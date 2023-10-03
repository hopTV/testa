import {
  createAsyncThunk,
  AsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import axiosInstance from 'network/axios'

interface HistoryState {
  tabActive: number
  comingSoon: boolean
}

const initialState: HistoryState = {
  tabActive: 1,
  comingSoon: false
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setTabActive: (state, action: PayloadAction<number>) => {
      state.tabActive = action.payload
    },
    setComingSoon: (state, action: PayloadAction<boolean>) => {
      state.comingSoon = action.payload
    }
  }
})

export const { setTabActive } = historySlice.actions
export const { setComingSoon } = historySlice.actions

const historyReducer = historySlice.reducer

export default historyReducer
