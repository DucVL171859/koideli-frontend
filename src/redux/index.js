import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/auth';

const rootReducer = combineReducers({
    auth: auth
});

export default rootReducer;