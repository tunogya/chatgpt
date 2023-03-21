import {combineReducers, configureStore} from '@reduxjs/toolkit'
import sessionReducer from './session'
import uiReducer from './ui'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui'],
};

const reducers = combineReducers({
  ui: uiReducer,
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export default store;