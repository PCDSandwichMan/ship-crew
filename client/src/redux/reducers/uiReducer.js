import constants from '../types';

let initialState = {
  errors: [],
  alerts: {},
  loading: true,
  refreshQue: false,
  modalActive: false,
  modalContent: '',
  modalPostComments: {}
};

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.TOGGLE_LOADING:
      return {
        ...state,
        loading: payload
      };
    case constants.REFRESH:
      return {
        ...state,
        refreshQue: !state.refreshQue
      };
    case constants.MODAL_STATUS:
      return {
        ...state,
        ...payload
      };
    case constants.FETCH_COMMENTS:
      return {
        ...state,
        ...payload
      };
    case constants.ADD_ERROR:
      console.log(payload)
      return {
        ...state,
        errors: [
          ...payload
        ]
      };
    case constants.CLEAR_ERRORS:
      return {
        ...state,
        errors: initialState.errors
      };
    case constants.UI_ALERTS:
      return {
        ...state,
        alerts: {
          ...state.alerts,
          ...payload
        }
      };
    default:
      return state;
  }
};

export default uiReducer;
