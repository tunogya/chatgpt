import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'user',
  initialState: {
    user: null,
    username: null,
    photo_url: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setPhotoUrl: (state, action) => {
      state.photo_url = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.user = null
      state.username = null
      state.token = null
      state.photo_url = null
    },
  }
})

export const {
  setUser,
  setUsername,
  setPhotoUrl,
  setToken,
  logout,
} = index.actions

export default index.reducer