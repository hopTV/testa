import { createSlice } from '@reduxjs/toolkit'

interface LoadingState {
  isLoading: boolean
}

const initialState: LoadingState = {
  isLoading: false
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setIsLoading: (state, action) => action.payload
  }
})

export const { setIsLoading } = loadingSlice.actions

const loadingReducer = loadingSlice.reducer

export default loadingReducer
