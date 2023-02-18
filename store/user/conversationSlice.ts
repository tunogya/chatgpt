import { createSlice } from '@reduxjs/toolkit'

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState: [],
  reducers: {
    setConversation: (state, action) => {
      return action.payload || [];
    },
  }
})

export const { setConversation } = conversationSlice.actions

export default conversationSlice.reducer