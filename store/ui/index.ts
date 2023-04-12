import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
    input: '',
    off_protected: false,
  },
  reducers: {
    setIsOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    },
    setInput: (state, action) => {
      state.input = action.payload
    },
    setOffProtected: (state, action) => {
      state.off_protected = action.payload
    }
  }
})

export const {
  setIsOpenSidebar,
  setInput,
  setOffProtected
} = index.actions

export default index.reducer