import {createSlice} from '@reduxjs/toolkit'

export const index = createSlice({
  name: 'ui',
  initialState: {
    isOpenSidebar: false,
    isShowRegenerate: false,
    isShowStop: false,
  },
  reducers: {
    setIsOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    },
    setIsShowRegenerate: (state, action) => {
      state.isShowRegenerate = action.payload
    },
    setIsShowStop: (state, action) => {
      state.isShowStop = action.payload
    }
  }
})

export const {
  setIsOpenSidebar,
  setIsShowRegenerate,
  setIsShowStop,
} = index.actions

export default index.reducer