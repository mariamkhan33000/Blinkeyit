import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlilce'


export const store = configureStore({
  reducer: {
    user : userReducer
  },
})