import {createSlice} from '@reduxjs/toolkit'
import {Message} from "@/components/ConversationCell";

export const index = createSlice({
  name: 'user',
  initialState: {
    user: null,
    username: null,
    photo_url: null,
    token: null,
    conversation: [],
    session: {
      id: null,
      title: '新会话',
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
    setConversation: (state, action) => {
      state.conversation = action.payload || [];
    },
    logout: (state) => {
      state.user = null
      state.username = null
      state.token = null
      state.photo_url = null
      state.conversation = []
      state.session = {
        id: null,
        title: '新会话',
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
      const index = state.session.messages.findIndex((m) => m.id === message.id)
      if (index !== -1) {
        state.session.messages[index].content.parts[0] += message.content.parts[0]
      } else {
        state.session.messages.push(message)
      }
    },
    clearSession: (state) => {
      state.session = {
        id: null,
        title: '新会话',
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
  logout,
  setConversation,
  setSession,
  addMessageToSession,
  updateMessageAndIdAndTitleToSession,
  clearSession
} = index.actions

export default index.reducer