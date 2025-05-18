import {
  GET_MEDICINES,
  GET_MEDICINE,
  MEDICINE_ERROR,
  ADD_MEDICINE,
  UPDATE_MEDICINE,
  DELETE_MEDICINE,
  SEARCH_MEDICINES,
  CLEAR_MEDICINES
} from '../actions/types';

const initialState = {
  medicines: [],
  medicine: null,
  loading: true,
  error: {}
};

function medicineReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEDICINES:
    case SEARCH_MEDICINES:
      return {
        ...state,
        medicines: payload,
        loading: false
      };
    case GET_MEDICINE:
      return {
        ...state,
        medicine: payload,
        loading: false
      };
    case ADD_MEDICINE:
      return {
        ...state,
        medicines: [payload, ...state.medicines],
        loading: false
      };
    case UPDATE_MEDICINE:
      return {
        ...state,
        medicines: state.medicines.map(medicine =>
          medicine._id === payload._id ? payload : medicine
        ),
        loading: false
      };
    case DELETE_MEDICINE:
      return {
        ...state,
        medicines: state.medicines.filter(
          medicine => medicine._id !== payload
        ),
        loading: false
      };
    case MEDICINE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_MEDICINES:
      return {
        ...state,
        medicines: [],
        medicine: null,
        loading: false
      };
    default:
      return state;
  }
}

export default medicineReducer; 