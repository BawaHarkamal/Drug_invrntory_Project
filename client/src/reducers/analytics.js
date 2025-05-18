import {
  GENERATE_REPORT,
  GET_REPORTS,
  GET_REPORT,
  ANALYTICS_ERROR
} from '../actions/types';

const initialState = {
  reports: [],
  report: null,
  loading: true,
  error: {}
};

function analyticsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REPORTS:
      return {
        ...state,
        reports: payload,
        loading: false
      };
    case GET_REPORT:
    case GENERATE_REPORT:
      return {
        ...state,
        report: payload,
        loading: false
      };
    case ANALYTICS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default analyticsReducer; 