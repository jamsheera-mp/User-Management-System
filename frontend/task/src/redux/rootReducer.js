import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import counterReducer from './slices/counterSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  count: counterReducer
  
});

export default rootReducer;