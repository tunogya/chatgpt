import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
    input: '',
  },
  reducers: {
    setIsOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    },
    setInput: (state, action) => {
      state.input = action.payload
    }
  }
})

export const {
  setIsOpenSidebar,
  setInput,
} = index.actions

export default index.reducer