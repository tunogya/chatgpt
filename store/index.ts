import {configureStore} from '@reduxjs/toolkit'
import sessionReducer from './session'
import uiReducer from './ui'
import thunk from 'redux-thunk';


const store = configureStore({
  reducer: {
    ui: uiReducer,
    session: sessionReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export default store;