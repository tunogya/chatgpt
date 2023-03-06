import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'user',
  initialState: {
    id: null,
    username: null,
    photo_url: null,
    accessToken: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.photo_url = action.payload.photo_url
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    logout: (state) => {
      state.id = null
      state.username = null
      state.photo_url = null
      state.accessToken = null
    },
  }
})

export const {
  setUser,
  setAccessToken,
  logout,
} = index.actions

export default index.reducer