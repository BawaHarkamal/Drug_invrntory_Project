import {
  GET_ORDERS,
  GET_ORDER,
  ADD_ORDER,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_LOCATION,
  UPLOAD_PRESCRIPTION,
  VERIFY_PRESCRIPTION,
  ORDER_ERROR,
  CLEAR_ORDER
} from '../actions/types';

const initialState = {
  orders: [],
  order: null,
  loading: true,
  error: {}
};

function orderReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: payload,
        loading: false
      };
    case GET_ORDER:
      return {
        ...state,
        order: payload,
        loading: false
      };
    case ADD_ORDER:
      return {
        ...state,
        orders: [payload, ...state.orders],
        loading: false
      };
    case UPDATE_ORDER_STATUS:
    case UPDATE_ORDER_LOCATION:
    case UPLOAD_PRESCRIPTION:
    case VERIFY_PRESCRIPTION:
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === payload._id ? payload : order
        ),
        order: payload,
        loading: false
      };
    case ORDER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_ORDER:
      return {
        ...state,
        order: null,
        loading: false
      };
    default:
      return state;
  }
}

export default orderReducer; 