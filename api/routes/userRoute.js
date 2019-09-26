/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/Users');
const config = require('../../util/config');
const jwtAuth = require('../middleware/jwtAuth');
const { reduceUserDetails, uploadImage } = require('../../util/validators');
const {
  addUser,
  loginUser,
  getUserInfo,
  updateUserInfo,
  refreshUserInfo,
  addUserImage,
  resetPassword,
  fetchNotifications,
  markNotification
} = require('../handlers/userHandlers');

// - New User Creation
router.post('/user/add', addUser);

// - User Login
router.post('/login', loginUser);

// - Password Reset
router.post('/recover-password', resetPassword);

// - Get User Info
router.post('/getUserInfo', jwtAuth, refreshUserInfo);

// - Get User Notifications
router.get('/:username/notifications', fetchNotifications);

// - Mark Notifications As Read
router.get('/:username/:id', markNotification);

// - Fetch User Info (AFTER LOGIN)
router.get('/:username/get-info', jwtAuth, getUserInfo);

// - Add User Information (profile)
router.put('/:username/update', jwtAuth, updateUserInfo);

// ! ======== IN DEVELOPMENT ============
// // - Upload Profile Image
// // TODO readd auth
// router.post('/:username/add-image', addUserImage);
// ! ======== IN DEVELOPMENT ============


module.exports = router;
