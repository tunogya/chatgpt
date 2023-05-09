import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    input: '',
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload
    }
  }
})

export const {
  setInput,
} = index.actions

export default index.reducer