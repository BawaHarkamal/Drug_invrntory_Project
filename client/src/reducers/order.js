import {
  CREATE_ORDER,
  GET_ORDERS,
  GET_ORDER,
  ORDER_ERROR,
  UPDATE_ORDER_STATUS,
  UPDATE_PAYMENT_STATUS
} from '../actions/types';

const initialState = {
  orders: [],
  order: null,
  loading: true,
  error: null
};

export default function orderReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ORDER:
      return {
        ...state,
        orders: [payload.data, ...state.orders],
        loading: false
      };
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
    case UPDATE_ORDER_STATUS:
    case UPDATE_PAYMENT_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === payload._id ? payload : order
        ),
        order: state.order && state.order._id === payload._id ? payload : state.order,
        loading: false
      };
    case ORDER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
} 