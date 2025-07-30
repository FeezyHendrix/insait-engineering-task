import { AuthState } from "@/types/redux";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";


const authInitialState: AuthState = {
    token: "",
    isAuth: false,
    currentUser: null
  };
  
  export const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
      setIsAuth: (state,action : PayloadAction<boolean>) => {
        state.isAuth = action.payload;
      },
      setToken: (state,action : PayloadAction<string>) => {
        state.token = action.payload;
      },
      setCurrentUser: (state, action: PayloadAction<string>) => {
        state.currentUser = action.payload
      },
      resetAuth: (state) => {
        state.isAuth = false;
        state.token = null;
        state.currentUser = null;
      }
    }
  })
  
  export const { setToken, setIsAuth, setCurrentUser, resetAuth } = authSlice.actions;
  export const selectIsAuth = (state: { auth: AuthState }) => state.auth.isAuth;
  export const selectToken = (state: { auth: AuthState }) => state.auth.token;
  export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser
  export default authSlice.reducer