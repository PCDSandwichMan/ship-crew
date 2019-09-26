/* eslint-disable no-undef */
/* eslint-disable dot-notation */
/* eslint-disable no-console */
import axios from 'axios';

import constants from '../types';

// - Helpers
const setAuthHeader = token => {
  const formatedToken = `bearer ${token}`;
  localStorage.setItem('token', formatedToken);
  // eslint-disable-next-line dot-notation
  axios.defaults.headers.common['Authorization'] = formatedToken;
};

// - Login page
// - =========== SIGN IN AND ASSIGN TOKEN ===============
export const addInfo = userData => dispatch => {
  // dispatch({ type: constants.TOGGLE_LOADING });
  axios
    .post('/login', userData)
    .then(res => {
      setAuthHeader(res.data.token);
      dispatch({
        type: constants.LOGIN_USER,
        payload: res.data.user
      });
      dispatch({ type: constants.CLEAR_ERRORS });
      window.location.assign('/home');
    })
    .catch(err => {
      dispatch({
        type: constants.ADD_ERROR,
        payload: Object.values(err.response.data)
      });
    });
};

// TODO finish me and check on home page
// - =========== SIGN IN AND ASSIGN TOKEN ===============
export const logoutUser = () => dispatch => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: constants.LOGOUT_USER });
  window.location.href = '/';
};

// - ========== CREATE USER ===========
export const createUser = userData => dispatch => {
  // dispatch({ type: constants.TOGGLE_LOADING });
  dispatch({ type: constants.CLEAR_ERRORS });
  axios
    .post('/user/add', userData)
    .then(res => {
      dispatch({
        type: constants.UI_ALERTS,
        payload: { confirmation: 'Account created please sign in' }
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: constants.ADD_ERROR,
        payload: Object.values(err.response.data)
      });
    });
};

// - Home page
// - ================= GET USER INFO ==============
export const getUserInfo = token => dispatch => {
  // dispatch({ type: constants.TOGGLE_LOADING });
  dispatch({ type: constants.CLEAR_ERRORS });
  axios.defaults.headers.common['Authorization'] = localStorage.getItem(
    'token'
  );
  axios
    .post('/getUserInfo', {
      token: localStorage.getItem('token').split(' ')[1]
    })
    .then(userInfo => {
      dispatch({
        type: constants.LOGIN_USER,
        payload: userInfo.data.user
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: constants.ADD_ERROR,
        payload: Object.values(err.response.data)
      });
    });
};

// - ================= EDIT USER INFO ==============
export const editUserInfo = userInput => dispatch => {
  dispatch({
    type: constants.MODAL_STATUS,
    payload: {
      modalActive: true,
      modalContent: 'viewUserProfile'
    }
  });
};

// ! ======== IN DEVELOPMENT ============
// // - ================= Upload Profile Picture ==============
// export const uploadProfilePicture = (username, formData) => dispatch => {
//   axios
//     .post(`/${username}/add-image`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     .then(res => {
//       console.log(res);
//       dispatch({
//         type: constants.UPDATE_IMAGE,
//         payload: {
//           profilePicture: res.user.profilePicture,
//           profilePictureType: res.user.profilePictureType
//         }
//       });
//     })
//     .catch(err => console.log(err));
// };
// ! ======== IN DEVELOPMENT ============

// - ================= Send Edited Info ===================
export const sendEditedInfo = userInput => dispatch => {
  const {
    currentUsername,
    username,
    email,
    bio,
    website,
    location
  } = userInput;

  console.log(userInput.userPicture);
  axios
    .put(`/${currentUsername}/update`, {
      username,
      email,
      bio,
      website,
      location
    })
    .then(res => {
      setAuthHeader(res.data.token);
      dispatch({
        type: constants.LOGIN_USER,
        payload: res.data.user
      });
      window.location.assign('/home');
    })
    .catch(err => {
      console.log(err);
    });
};

// - ================= Password Recovery Form ==============
export const recoverPassword = credentials => dispatch => {
  axios
    .post('/recover-password', {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword
    })
    .then(res => {
      dispatch({
        type: constants.LOGIN_RECOVER,
        payload: res
      });
    })
    .catch(err => {
      dispatch({
        type: constants.ADD_ERROR,
        payload: Object.values(err.response.data)
      });
    });
};

// - ================= Get Notifications ==============
export const fetchNotifications = userInfo => dispatch => {
  axios
    .get(`/${userInfo.username}/notifications`)
    .then(res => {
      dispatch({
        type: constants.FETCH_NOTIFICATIONS,
        payload: res.data.notifications
      });
    })
    .catch(err => console.log(err));
};

// - ================= Mark Notifications As Read ==============
export const markAsRead = notificationInfo => dispatch => {
  console.log(notificationInfo);
  axios
    .get(
      `/${notificationInfo.username}/${notificationInfo.id}`
    )
    .then(res => {
      dispatch({
        type: constants.FETCH_NOTIFICATIONS,
        payload: res.data.notifications
      });
    })
    .catch(err => console.log(err));
};
