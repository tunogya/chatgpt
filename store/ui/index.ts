import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
  },
  reducers: {
    setIsOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    }
  }
})

export const {
  setIsOpenSidebar
} = index.actions

export default index.reducer