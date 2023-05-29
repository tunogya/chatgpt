import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    area: 'china',
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setArea: (state, action) => {
      state.area = action.payload
    }
  }
})

export const {
  setTheme,
  setArea,
} = index.actions

export default index.reducer