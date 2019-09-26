/* eslint-disable no-console */
import constants from '../types';

const initialState = {
  verified: false,
  username: '',
  email: '',
  bio: '',
  location: '',
  website: '',
  profilePicture: '',
  profilePictureType: '',
  notifications: []
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.LOGIN_USER:
      return {
        ...state,
        verified: true,
        ...payload
      };
    case constants.UPDATE_IMAGE:
      return {
        ...state,
        ...payload
      };
    case constants.LOGOUT_USER:
      return initialState;
    case constants.FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: [...payload]
      };
    case constants.LOGIN_RECOVER:
      return {
        ...state,
        verified: false,
        notifications: { ...payload }
      };
    default:
      return state;
  }
};

export default userReducer;
