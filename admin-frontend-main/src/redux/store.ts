import { configureStore } from '@reduxjs/toolkit'
import reducer from './root-reducer';

export const store = configureStore({
  reducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
