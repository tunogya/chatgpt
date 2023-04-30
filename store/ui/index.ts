import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
    input: '',
    off_protected: false,
    freeUseTTL: 0,
    paidUseTTL: 0,
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
    },
    setFreeUseTTL: (state, action) => {
      state.freeUseTTL = action.payload
    },
    setPaidUseTTL: (state, action) => {
      state.paidUseTTL = action.payload
    }
  }
})

export const {
  setIsOpenSidebar,
  setInput,
  setOffProtected,
  setFreeUseTTL,
  setPaidUseTTL
} = index.actions

export default index.reducer