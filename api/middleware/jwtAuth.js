/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const config = require('../../util/config');

const jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // - Checks for existing token
    if (!token) {
      console.log('========= TOKEN NOT INCLUDED ==========');
      return res.status(401).json({ token: 'missing token' });
    }
    // - Verifies token
    const verified = jwt.verify(token, config.JWT_SECRET);
    if (!verified) {
      console.log('========= TOKEN NOT VERIFIED ==========');
      return res.status(401).json({ token: 'your token is not authorized' });
    }
    // - Verifies that the token is for this user
    if (req.params.username) {
      let verifyIdentity;
      if (
        typeof jwt.decode(token, config.JWT_SECRET).foundUser !== 'undefined'
      ) {
        verifyIdentity = jwt.decode(token, config.JWT_SECRET).foundUser[0]
          .username;
      } else {
        verifyIdentity = jwt.decode(token, config.JWT_SECRET).foundUserAfter[0]
          .username;
      }
      if (req.params.username !== verifyIdentity) {
        console.log('======== TOKEN FOR WRONG USER ==========');
        return res.status(401).json({
          systemAlerted: 'Woah there hackerman use your own account',
          systemAlertInfoCrawler: {
            userMachineInfoGathered: true,
            vpnStripSuccess: true,
            userIpStored: true,
            geoLocationGathered: true
          }
        });
      }
    }
    // - Allows User Access
    req.authenticated = verified;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ token: 'unable to authorize token' });
  }
};

module.exports = jwtAuth;
