import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import medicine from './medicine';
import order from './order';
import inventory from './inventory';
import analytics from './analytics';
import admin from './admin';
import manufacturer from './manufacturer';

export default combineReducers({
  auth,
  alert,
  medicine,
  order,
  inventory,
  analytics,
  admin,
  manufacturer
}); 