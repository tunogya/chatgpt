import { createSlice } from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    conversation: [],
    status: 'IDLE',
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setConversation: (state, action) => {
      state.conversation = action.payload || [];
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.conversation = []
    },
    setStatus: (state, action) => {
      state.status = action.payload
    }
  }
})

export const { setUser, setToken, logout, setConversation, setStatus } = index.actions

export default index.reducer