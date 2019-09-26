/* eslint-disable no-cond-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('../models/Users');
const Notification = require('../models/Notifications');
const config = require('../../util/config');
const jwtAuth = require('../middleware/jwtAuth');
const { reduceUserDetails, uploadImage } = require('../../util/validators');

// -multer (start)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
};

const upload = multer({
  // eslint-disable-next-line object-shorthand
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

// - multer (end)

exports.addUser = async (req, res) => {
  const {
    username,
    password,
    confirmedPassword,
    email,
    profilePicture,
    bio,
    website,
    location
  } = req.body;
  if (!username || !password || !confirmedPassword || !email) {
    console.log('======= MISSING INFO FOR USER CREATION =======');
    const checkFields = `Username: ${
      !username ? 'Missing' : 'Not Missing'
    } || Password: ${
      !password ? 'Missing' : 'Not Missing'
    } || Confirmed Password: ${
      !confirmedPassword ? 'Missing' : 'Not Missing'
    } || Email: ${!email ? 'Missing' : 'Not Missing'}`;
    console.log(checkFields);
    return res.status(400).json({
      newUser: 'All fields must be filled',
      isMissing: checkFields
    });
  }
  // - Validates Matching Passwords
  if (password !== confirmedPassword) {
    return res.status(406).json({ password: 'Passwords must match' });
  }

  const newUser = new User({
    username,
    password: confirmedPassword,
    email,
    profilePicture,
    bio,
    website,
    location
  });
  try {
    // - Checks For Existing
    const foundUser = await User.find({
      $or: [{ email: newUser.email }, { username: newUser.username }]
    });
    if (foundUser.length > 0) {
      return res.status(409).json({ user: 'Username already taken' });
    }
    // - Encrypts Password and Saves
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        console.log(saltError);
        return res
          .status(500)
          .json({ error: 'error occurred during user creation' });
      }
      bcrypt.hash(confirmedPassword, salt, async (err, hash) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: 'error occurred during user creation' });
        }
        // - Changes password to hash
        newUser.password = hash;
        // - Saves the user after the hash has been applied
        const saveNewUser = await newUser.save((saveError, result) => {
          if (saveError) {
            console.log(saveError);
            return res.status(304).json({ user: 'user could not be saved' });
          }
          return res.status(201).json({ user: 'user has been created' });
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ user: 'Could not search for user' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  // - Checks for user
  const foundUser = await User.find({ username });
  if (foundUser.length <= 0) {
    return res
      .status(401)
      .json({ login: 'Credentials are invalid or no account was found' });
  }
  // - Compares Password
  const comparePassword = await bcrypt.compare(password, foundUser[0].password);
  if (!comparePassword) {
    return res
      .status(401)
      .json({ login: 'Credentials are invalid or no account was found' });
  }
  // - Signs token after verification
  try {
    const token = await jwt.sign({ foundUser }, config.JWT_SECRET, {
      expiresIn: '1h'
    });
    return res.status(200).json({
      login: 'verified',
      user: {
        username: foundUser[0].username,
        email: foundUser[0].email,
        bio: foundUser[0].bio,
        location: foundUser[0].location,
        website: foundUser[0].website
      },
      token
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      login: 'something went wrong when trying to fetch user',
      error: err
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ passwordReset: 'please include all info' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ passwordReset: 'passwords must match' });
  }
  try {
    const foundUser = await User.find({ username });
    if ((foundUser[0].email = !email || foundUser[0].username != username)) {
      return res
        .status(400)
        .json({ passwordReset: 'information must match user' });
    }
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        console.log(saltError);
        return res
          .status(500)
          .json({ error: 'error occurred during password reset' });
      }
      bcrypt.hash(confirmPassword, salt, async (err, hash) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: 'error occurred during user creation' });
        }
        // - Changes password to hash
        const hashedPassword = hash;
        // - Saves the user after the hash has been applied
        const updatePassword = await User.findOneAndUpdate(
          { username },
          {
            password: hashedPassword
          }
        );
      });
    });
    const foundUser1 = await User.find({ username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ passwordReset: 'password could not be reset' });
  }
};

exports.refreshUserInfo = async (req, res) => {
  try {
    const userToken = req.body.token;
    const verifyUserInfo = jwt.decode(userToken, config.JWT_SECRET);
    let doDis;
    if (typeof verifyUserInfo.foundUserAfter !== 'undefined') {
      doDis = verifyUserInfo.foundUserAfter[0].username;
    } else {
      doDis = verifyUserInfo.foundUser[0].username;
    }
    const foundUser = await User.find({
      username: doDis
    });
    // console.log(foundUser[0]);
    const { username, email, bio, location, website, createdAt } = foundUser[0];
    return res.status(200).json({
      user: {
        username,
        email,
        bio,
        location,
        website,
        createdAt
      }
    });
  } catch (err) {
    console.log('============== COULD NOT REFRESH USER INFO ==============');
    console.log(err);
    res.status(500).json({ fetchUserInfo: 'User info could not be refreshed' });
  }
};

exports.getUserInfo = async (req, res) => {
  const foundUser = await User.find({ username: req.params.username });
  if (foundUser.length < 1) {
    return res
      .status(404)
      .json({ user: 'user information could not be found' });
  }

  try {
    res.status(200).json({
      username: foundUser[0].username,
      email: foundUser[0].email,
      profilePicture: foundUser[0].profilePicture,
      bio: foundUser[0].bio,
      website: foundUser[0].website,
      location: foundUser[0].location
    });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ user: 'user information could not be found' });
  }
};

exports.updateUserInfo = async (req, res) => {
  // - Check if user exists
  const foundUser = await User.find({ username: req.params.username });
  if (foundUser.length < 1) {
    return res
      .status(404)
      .json({ user: 'user information could not be found' });
  }
  /*
    Allowed Info Change:
    username || email || location || website || bio || 
    */
  // - All body info permitted

  req.body.originalUsername = req.params.username;
  const userUpdate = await reduceUserDetails(req.body);
  if (Object.keys(userUpdate) < 1) {
    return res
      .status(400)
      .json({ userUpdate: 'valid info was not included for update' });
  }
  // - Updates verified info
  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: foundUser[0]._id },
      userUpdate
    );
    const foundUserAfter = await User.find({ username: userUpdate.username });
    // - Signs token after verification
    try {
      const token = await jwt.sign({ foundUserAfter }, config.JWT_SECRET, {
        expiresIn: '1h'
      });
      return res.status(200).json({
        login: 'verified',
        userUpdate: 'user has been updated',
        user: {
          username: foundUserAfter[0].username,
          email: foundUserAfter[0].email,
          bio: foundUserAfter[0].bio,
          location: foundUserAfter[0].location,
          website: foundUserAfter[0].website
        },
        token
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        login: 'something went wrong when trying to fetch user',
        error: err
      });
    }
    // ! return res.status(201).json({ userUpdate: 'user has been updated' });
  } catch (err) {
    console.log('error');
    return res
      .status(500)
      .json({ updateInformation: 'could not update information' });
  }
};

// ! ======== IN DEVELOPMENT ============
// exports.addUserImage = async (req, res) => {
//   upload(req, res, err => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ fileUpload: 'Unable to upload file' });
//     }

//     const formatedImage = new Buffer.from(
//       fs.readFileSync(req.file.path)
//     ).toString('base64');
//     const formatedImageType = path.extname(req.file.path);
//     console.log(formatedImage);

//     User.findOneAndUpdate(
//       { username: req.params.username },
//       {
//         profilePicture: formatedImage,
//         profilePictureType: formatedImageType
//       }
//     )
//       .then(result => {
//         console.log('========== SUCCESSFUL BUFFERING =============');
//         User.findOne({ username: req.params.username }).then(newUser => {
//           console.log(newUser.profileImagePath);
//           return res.status(201).json({
//             fileUpload: 'file uploaded',
//             user: {
//               path: res
//             }
//           });
//         });
//       })
//       .catch(err => {
//         console.log('========== ERROR WHEN BUFFERING =============');
//         console.log(err);
//       });
//   });
// };
// ! ======== IN DEVELOPMENT ============

exports.fetchNotifications = async (req, res) => {
  const { username } = req.params.username;
  let foundUser;
  try {
    const checkUser = await User.findOne({ username });
  } catch (err) {
    console.log('======== USER COULD NOT BE FOUND (notifications) =========');
    console.log(err);
    return res.status(404).json({ notifications: 'user could not be found' });
  }
  try {
    const getNotifications = await Notification.find({
      $and: [({ recipient: username }, { read: false })]
    });
    if (getNotifications.length <= 0) {
      console.log('====== NO NOTIFICATIONS FOR THIS USER ======');
      return res
        .status(200)
        .json({ notifications: 'there are no new notification for this user' });
    }
    return res.status(200).json({
      username,
      notifications: getNotifications
    });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ notifications: 'notification could not be gathered' });
  }
};

exports.markNotification = async (req, res) => {
  const { username, id } = req.params;
  let foundUser;
  let foundNotification;
  if (!username || !id) {
    console.log('===== CANNOT MARK POST =====');
    return res
      .status(400)
      .json({ markPost: 'must call with valid username and notification id' });
  }

  try {
    foundUser = await User.findOne({ username });
    foundNotification = await Notification.findOne({ _id: id });
    
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ markPost: 'could not find user or post to mark post' });
  }

  try {
    const markPost = await Notification.findOneAndUpdate(
      { _id: foundNotification._id },
      { read: true }
    );

    try {
      const getNotifications = await Notification.find({
        $and: [({ recipient: username }, { read: false })]
      });
      if (getNotifications.length <= 0) {
        console.log('====== NOTIFICATIONS FOUND FOR THIS USER ======');
        return res.status(200).json({
          notifications: 'there are no new notification for this user'
        });
      }
      return res.status(200).json({
        username,
        notifications: getNotifications
      });
    } catch (err) {
      console.log(err);
      res
        .status(404)
        .json({ notifications: 'notification could not be gathered' });
    }
  } catch (err) {
    console.log('===== RAN INTO ERROR WHEN MARKING POST =====');
    console.log(err);
    return res.status(500).json({ markPost: 'unable to mark users post' });
  }
};
