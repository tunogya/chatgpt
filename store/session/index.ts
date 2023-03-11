import {createSlice} from '@reduxjs/toolkit'

/**
 * Message demo
 *
 *       "message": {
 *         "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
 *         "author": {
 *           "role": "system",
 *           "metadata": {}
 *         },
 *         "create_time": 1678466827.852352,
 *         "content": {
 *           "content_type": "text",
 *           "parts": [
 *             ""
 *           ]
 *         },
 *         "end_turn": true,
 *         "weight": 1,
 *         "metadata": {},
 *         "recipient": "all"
 *       },
 */

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
    /**
     * Response data:
     * {
     *   "title": "Hello and Assistance",
     *   "create_time": 1678466827.852352,
     *   "mapping": {
     *     "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5": {
     *       "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
     *       "message": {
     *         "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
     *         "author": {
     *           "role": "system",
     *           "metadata": {}
     *         },
     *         "create_time": 1678466827.852352,
     *         "content": {
     *           "content_type": "text",
     *           "parts": [
     *             ""
     *           ]
     *         },
     *         "end_turn": true,
     *         "weight": 1,
     *         "metadata": {},
     *         "recipient": "all"
     *       },
     *       "parent": "91d08562-c1a2-4252-89d0-4eba985a65b6",
     *       "children": [
     *         "3fc5da70-98ab-4769-940a-13c26613b211"
     *       ]
     *     },
     *   },
     *   "moderation_results": [],
     *   "current_node": "f253c0d1-eb10-4ee4-9371-31832eae073f"
     * }
     */
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
    /**
     * Mapping data
     * {
     *       "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
     *       "message": {
     *         "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
     *         "author": {
     *           "role": "system",
     *           "metadata": {}
     *         },
     *         "create_time": 1678466827.852352,
     *         "content": {
     *           "content_type": "text",
     *           "parts": [
     *             ""
     *           ]
     *         },
     *         "end_turn": true,
     *         "weight": 1,
     *         "metadata": {},
     *         "recipient": "all"
     *       },
     *       "parent": "91d08562-c1a2-4252-89d0-4eba985a65b6",
     *       "children": [
     *         "3fc5da70-98ab-4769-940a-13c26613b211"
     *       ]
     * }
     * @param state
     * @param action
     */
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
  clearSession
} = index.actions

export default index.reducer