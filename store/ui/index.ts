import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    input: '',
    theme: 'light',
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const {
  setInput,
  setTheme,
} = index.actions

export default index.reducer