import {createSlice} from '@reduxjs/toolkit'
import {Message} from "@/components/ConversationCell";

export const index = createSlice({
  name: 'user',
  initialState: {
    user: null,
    username: null,
    photo_url: null,
    token: null,
    balance: 0,
    priority_pass: 0,
    conversation: [],
    session: {
      id: null,
      title: 'New Chat',
      messages: [] as Message[]
    },
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
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setPriorityPass: (state, action) => {
      state.priority_pass = action.payload
    },
    setConversation: (state, action) => {
      state.conversation = action.payload || [];
    },
    logout: (state) => {
      state.user = null
      state.username = null
      state.token = null
      state.balance = 0
      state.priority_pass = 0
      state.photo_url = null
      state.conversation = []
      state.session = {
        id: null,
        title: 'New Chat',
        messages: [] as Message[]
      }
    },
    setSession: (state, action) => {
      state.session = action.payload
    },
    addMessageToSession: (state, action) => {
      state.session.messages.push(action.payload)
    },
    updateMessageAndIdAndTitleToSession: (state, action) => {
      const {id, title, message} = action.payload
      state.session.id = id
      state.session.title = title
      state.session.messages.push(message)
    },
    clearSession: (state) => {
      state.session = {
        id: null,
        title: 'New Chat',
        messages: [] as Message[]
      }
    }
  }
})

export const {
  setUser,
  setUsername,
  setPhotoUrl,
  setToken,
  setBalance,
  setPriorityPass,
  logout,
  setConversation,
  setSession,
  addMessageToSession,
  updateMessageAndIdAndTitleToSession,
  clearSession
} = index.actions

export default index.reducer