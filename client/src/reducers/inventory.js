import {
  GET_MEDICINE_REQUESTS,
  GET_MEDICINE_REQUEST,
  ADD_MEDICINE_REQUEST,
  UPDATE_MEDICINE_REQUEST,
  DELETE_MEDICINE_REQUEST,
  GET_SALT_REQUESTS,
  GET_SALT_REQUEST,
  ADD_SALT_REQUEST,
  UPDATE_SALT_REQUEST,
  DELETE_SALT_REQUEST,
  INVENTORY_ERROR
} from '../actions/types';

const initialState = {
  medicineRequests: [],
  medicineRequest: null,
  saltRequests: [],
  saltRequest: null,
  loading: true,
  error: {}
};

function inventoryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEDICINE_REQUESTS:
      return {
        ...state,
        medicineRequests: payload,
        loading: false
      };
    case GET_MEDICINE_REQUEST:
      return {
        ...state,
        medicineRequest: payload,
        loading: false
      };
    case ADD_MEDICINE_REQUEST:
      return {
        ...state,
        medicineRequests: [payload, ...state.medicineRequests],
        loading: false
      };
    case UPDATE_MEDICINE_REQUEST:
      return {
        ...state,
        medicineRequests: state.medicineRequests.map(request =>
          request._id === payload._id ? payload : request
        ),
        medicineRequest: payload,
        loading: false
      };
    case DELETE_MEDICINE_REQUEST:
      return {
        ...state,
        medicineRequests: state.medicineRequests.filter(
          request => request._id !== payload
        ),
        loading: false
      };
    case GET_SALT_REQUESTS:
      return {
        ...state,
        saltRequests: payload,
        loading: false
      };
    case GET_SALT_REQUEST:
      return {
        ...state,
        saltRequest: payload,
        loading: false
      };
    case ADD_SALT_REQUEST:
      return {
        ...state,
        saltRequests: [payload, ...state.saltRequests],
        loading: false
      };
    case UPDATE_SALT_REQUEST:
      return {
        ...state,
        saltRequests: state.saltRequests.map(request =>
          request._id === payload._id ? payload : request
        ),
        saltRequest: payload,
        loading: false
      };
    case DELETE_SALT_REQUEST:
      return {
        ...state,
        saltRequests: state.saltRequests.filter(
          request => request._id !== payload
        ),
        loading: false
      };
    case INVENTORY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default inventoryReducer; 