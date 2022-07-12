import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import home from './home';

import settings from './settings';
import edit from './edit';
import addList from './addList';
import exercise from './exercise';

export default combineReducers({
  alert,
  auth,
  home,
  settings,
  edit,
  addList,
  exercise,
});
