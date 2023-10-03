import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAuth {
  token?: string
  refresh_token?: string
}

const initialState: IAuth = {
  token: undefined,
  refresh_token: undefined
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: IAuth, action: PayloadAction<IAuth>) => {
      state.token = action.payload.token
      state.refresh_token = action.payload.refresh_token
    },
    reset: () => {
      return initialState
    }
  }
})

export default auth
