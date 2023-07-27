import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  }
})

export const {
  setTheme,
} = index.actions

export default index.reducer