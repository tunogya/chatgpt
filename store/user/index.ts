import {createSlice} from '@reduxjs/toolkit'
import {Message} from "@/components/ConversationCell";

export const index = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
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
      state.session = {
        id: null,
        title: 'New Chat',
        messages: [] as Message[]
      }
    },
    setSession: (state, action) => {
      const {id, title, messages} = action.payload
      state.session.id = id
      state.session.title = title
      state.session.messages = messages.sort((a: Message, b: Message) => a.create_at - b.create_at)
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
  setToken,
  logout,
  setConversation,
  setSession,
  addMessageToSession,
  updateMessageAndIdAndTitleToSession,
  clearSession
} = index.actions

export default index.reducer