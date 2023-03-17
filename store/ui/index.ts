import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
    isWaitComplete: false,
  },
  reducers: {
    setIsOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    },
    setIsWaitComplete: (state, action) => {
      state.isWaitComplete = action.payload
    }
  }
})

export const {
  setIsOpenSidebar,
  setIsWaitComplete
} = index.actions

export default index.reducer