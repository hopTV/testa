import {
  createAsyncThunk,
  AsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'

interface GenerateState {
  isShow: boolean
  isSelling: boolean
  numSelling: number
  isSellingDone: boolean
  step: number
  isSuccessTutorial: boolean
  isStore: boolean
}

const initialState: GenerateState = {
  isShow: false,
  isSelling: false,
  numSelling: 1,
  isSellingDone: false,
  step: 0,
  isSuccessTutorial: false,
  isStore: false
}

const commonSlice = createSlice({
  name: 'generate',
  initialState,
  reducers: {
    setIsShowPopup: (state, action: PayloadAction<boolean>) => {
      state.isShow = action.payload
    },

    setIsSelling: (state, action: PayloadAction<boolean>) => {
      state.isSelling = action.payload
    },

    setIsSellingConfirm: (state, action: PayloadAction<boolean>) => {
      state.isSellingDone = action.payload
    },

    setNumSelling: (state, action: PayloadAction<number>) => {
      state.numSelling = action.payload
    },

    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },

    setIsSuccessTutorial: (state, action: PayloadAction<boolean>) => {
      state.isSuccessTutorial = action.payload
    },

    setIsStore: (state, action: PayloadAction<boolean>) => {
      state.isStore = action.payload
    }
  }
})

export const {
  setIsShowPopup,
  setIsSelling,
  setIsSellingConfirm,
  setNumSelling,
  setStep,
  setIsSuccessTutorial,
  setIsStore
} = commonSlice.actions

const generateReducer = commonSlice.reducer

export default generateReducer
