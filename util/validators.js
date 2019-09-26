/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

/* eslint-disable no-console */
const User = require('../api/models/Users');

const jwt = require('jsonwebtoken');
const config = require('./config');

// - Used for profile picture upload
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = string => {
  if (!string) return true;
  if (string.trim() === '') return true;
  return false;
};

exports.validateSignupData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = async data => {
  let userDetails = {};

  // - Username
  try {
    const checkUsername = await User.findOne({ username: data.username });
    if (!checkUsername) {
      console.log(' ========= NEW USERNAME ADDED ========== ');
      userDetails.username = data.username;
    } else {
      console.log(' ========= USERNAME REQUEST IS ALREADY TAKEN ========== ');
      userDetails.username = data.originalUsername;
    }
  } catch (err) {
    console.log(err);
  }

  // - Email
  if (data.email) {
    if (!isEmpty(data.email.trim()) && isEmail(data.email))
      userDetails.email = data.email;
  }
  // - Bio
  if (data.bio) {
    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  }
  // - Website
  if (data.website) {
    if (!isEmpty(data.website.trim())) {
      // https://website.com
      if (data.website.trim().substring(0, 4) !== 'http') {
        userDetails.website = `http://${data.website.trim()}`;
      } else userDetails.website = data.website;
    }
  }
  // - Location
  if (data.location) {
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  }
  return userDetails;
};

exports.uploadImage = (editingUser, bodyImage) => {
  // - Checks for image
  if (bodyImage == null) {
    console.log('==== MISSING IMAGE ====');
    editingUser.errors = 'image was not included';
    return;
  }
  // - Parses the image
  const parsedImage = JSON.parse(bodyImage);
  if (parsedImage && imageMimeTypes.includes(parsedImage.type)) {
    editingUser.profilePicture = new Buffer.from(parsedImage.data, 'base64');
    editingUser.profilePictureType = parsedImage.type;
  } else {
    editingUser.errors = 'bad image // could not be parsed';
    console.log(' ====== SOMETHING WENT WRONG WITH IMAGE CONVERSION ======= ');
  }
};

// - Returns boolean if the name given match the username on the token
exports.authorizedUserToken = async (headers, params) => {
  // - Gets token from header
  try {
    const token = headers.authorization.split(' ')[1];
    // - Checks for existing token
    if (!token) {
      console.log('========= (validator) TOKEN NOT INCLUDED ==========');
      return false;
    }
    // - Verifies token
    const verified = jwt.verify(token, config.JWT_SECRET);
    if (!verified) {
      console.log('========= (validator) TOKEN NOT VERIFIED ==========');
      return false;
    }
    // - Verifies that the token is for this user
    let verifyIdentity = jwt.decode(token, config.JWT_SECRET);
    // ! This is to fix a call break this is temporary I'm sorry
    if (verifyIdentity.hasOwnProperty('foundUser')) {
      verifyIdentity = verifyIdentity.foundUser[0].username;
    } else {
      verifyIdentity = verifyIdentity.foundUserAfter[0].username;
    }
    if (params.username !== verifyIdentity) {
      console.log('======== (validator) TOKEN FOR WRONG USER ==========');
      return false;
    }
    return true;
  } catch (err) {
    console.log('====== (validator) RAN INTO AN ERROR DURING CHECKS ======');
    console.log(err);
    return false;
  }
};
