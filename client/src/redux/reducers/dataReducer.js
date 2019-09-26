import constants from '../types';

const initialState = {
  allPosts: []
};

const dataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.GET_ALL_POSTS:
      return { allPosts: [...payload] };
    default:
      return state;
  }
};

export default dataReducer;
