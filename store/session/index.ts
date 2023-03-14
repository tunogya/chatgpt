import {createSlice} from '@reduxjs/toolkit'

export type Message = {
  id: string,
  author: {
    role: string, // 'assistant' | 'user' | 'system'
    name?: string,
    metadata?: {}
  },
  create_time?: number,
  content: {
    content_type: string, // 'text' | 'image' | 'video' | 'audio' | 'file'
    parts: string[]
  },
  role: string, // 'assistant' | 'user' | 'system'
  end_turn?: boolean,
  weight?: number,
  metadata?: {},
  recipient?: string, // 'all' | 'user' | 'assistant' | 'system'
}

export const index = createSlice({
  name: 'session',
  initialState: {
    // conversation is used to store the conversation list
    conversation: [] as {
      id: string, // conversation id
      title: string, // conversation title
      create_time: string, // conversation create time
    }[],
    // session is used to store the current conversation
    session: {
      id: null, // conversation id
      title: '新会话', // conversation title
      create_time: "", // conversation create time
      mapping: {} as { // mapping used to store messages in a tree structure
        [key: string]: { // message id
          children: string[], // children message id array
          id: string, // message id
          message: Message | null, // message
          parent: string | null // parent message id
        }
      },
    },
    lastMessageId: null,
  },
  reducers: {
    // setConversation is used to set the conversation list
    setConversation: (state, action: {
      payload: {
        id: string,
        title: string,
        create_time: string,
      }[]
    }) => {
      state.conversation = action.payload;
    },
    // updateConversationById is used to update the conversation list by id
    updateConversationById: (state, action: {
      payload: {
        id: string,
        title?: string,
        create_time?: string,
      }
    }) => {
      const newConversation = action.payload
      const index = state.conversation.findIndex((c: any) => c.id === newConversation.id)
      if (index !== -1) {
        state.conversation[index] = {
          ...state.conversation[index],
          ...newConversation
        }
      }
    },
    deleteConversationById: (state, action: {
      payload: string
    }) => {
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
          create_time: "",
          mapping: {},
        }
      }
    },
    // setSession is used to set the current session
    setSession: (state, action) => {
      state.session = action.payload
    },
    // updateSession is used to update the part of the current session
    updateSession: (state, action) => {
      state.session = {
        ...state.session,
        ...action.payload
      }
    },
    // update message in session
    updateMessageInSession: (state, action: {
      payload: {
        message: Message,
        parent: string | null,
      }
    }) => {
      const {message, parent} = action.payload
      state.session.mapping = {
        ...state.session.mapping,
        [message.id]: {
          ...state.session.mapping[message.id],
          id: message.id,
          message,
          parent,
        },
      }
      if (parent) {
        state.session.mapping[parent].children = [
          ...state.session.mapping[parent].children,
          message.id
        ]
      }
    },
    // clearSession is used to clear the current session
    clearSession: (state) => {
      state.session = {
        id: null,
        title: '新会话',
        create_time: "",
        mapping: {},
      }
    },
    updateLastMessageId: (state, action) => {
      state.lastMessageId = action.payload
    }
  }
})

export const {
  setConversation,
  updateConversationById,
  deleteConversationById,
  setSession,
  updateSession,
  updateMessageInSession,
  clearSession,
  updateLastMessageId
} = index.actions

export default index.reducer