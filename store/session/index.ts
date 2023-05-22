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
    lastMessageId: "00000000-0000-0000-0000-000000000000",
    // isWaitComplete is used to indicate whether the answer wait is complete
    isWaitComplete: false,
    // isWaitHistory is used to indicate whether the history wait is complete
    isWaitHistory: false,
    isBlockComplete: false,
  },
  reducers: {
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
        parent: string,
      }
    }) => {
      const {message, parent} = action.payload
      if (!state.session.mapping?.[message.id]) {
        state.session.mapping[message.id] = {
          id: message.id,
          message,
          parent,
          children: []
        }
      } else {
        state.session.mapping = {
          ...state.session.mapping,
          [message.id]: {
            ...state.session.mapping[message.id],
            id: message.id,
            message,
            parent,
          },
        }
      }
      if (parent === '00000000-0000-0000-0000-000000000000') {
        if (!state.session.mapping['00000000-0000-0000-0000-000000000000']) {
          state.session.mapping['00000000-0000-0000-0000-000000000000'] = {
            id: '00000000-0000-0000-0000-000000000000',
            message: null,
            parent: null,
            children: [message.id]
          }
        }
      } else {
        if (!state.session.mapping[parent].children) {
          state.session.mapping[parent].children = []
        }
        if (state.session.mapping[parent].children.indexOf(message.id) === -1) {
          state.session.mapping[parent].children = [
            ...state.session.mapping[parent].children,
            message.id
          ]
        }
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
      state.lastMessageId = "00000000-0000-0000-0000-000000000000"
      state.isWaitComplete = false
      state.isWaitHistory = false
      state.isBlockComplete = false
    },
    updateLastMessageId: (state, action) => {
      state.lastMessageId = action.payload
    },
    setIsWaitComplete: (state, action) => {
      state.isWaitComplete = action.payload
    },
    setIsWaitHistory: (state, action) => {
      state.isWaitHistory = action.payload
    },
    setBlockComplete: (state, action) => {
      state.isBlockComplete = action.payload
    }
  }
})

export const {
  setSession,
  updateSession,
  updateMessageInSession,
  clearSession,
  updateLastMessageId,
  setIsWaitComplete,
  setIsWaitHistory,
  setBlockComplete,
} = index.actions

export default index.reducer