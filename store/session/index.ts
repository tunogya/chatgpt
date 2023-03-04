import {createSlice} from '@reduxjs/toolkit'
import {Message} from "@/components/ConversationCell";

export const index = createSlice({
  name: 'session',
  initialState: {
    conversation: [],
    session: {
      id: null,
      title: '新会话',
      messages: [] as Message[]
    },
  },
  reducers: {
    setConversation: (state, action) => {
      state.conversation = action.payload || [];
    },
    updateConversationTitle: (state, action) => {
      const {id, title} = action.payload
      const index = state.conversation?.findIndex((c: any) => c.id === id) || -1
      if (index !== -1) {
        // @ts-ignore
        state.conversation[index].title = title
      }
      if (id === state.session.id) {
        state.session.title = title
      }
    },
    deleteConversation: (state, action) => {
      const id = action.payload
      const index = state.conversation.findIndex((c: any) => c.id === id)
      if (index !== -1) {
        // @ts-ignore
        state.conversation.splice(index, 1)
      }
      if (id === state.session.id) {
        state.session = {
          id: null,
          title: '新会话',
          messages: [] as Message[]
        }
      }
    },
    setSession: (state, action) => {
      state.session = action.payload
    },
    addMessageToSession: (state, action) => {
      state.session.messages = [...state.session.messages, action.payload]
    },
    updateMessageAndIdAndTitleToSession: (state, action) => {
      const {id, title, message} = action.payload
      state.session.id = id
      state.session.title = title
      const index = state.session.messages?.findIndex((m) => m.id === message.id) || -1
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
  setConversation,
  setSession,
  addMessageToSession,
  deleteConversation,
  updateConversationTitle,
  updateMessageAndIdAndTitleToSession,
  clearSession
} = index.actions

export default index.reducer