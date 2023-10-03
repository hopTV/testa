import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserType } from 'interfaces/use.interface'
import { networkService } from 'network/service'
import { USER } from 'network/key'
import { setIsLoading } from './loading.reducer'

interface UserState {
  userInfo: UserType
  isBeginner: boolean
}

export const getUserInfo = createAsyncThunk(
  'user/getUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Get<UserType | any>({
        url: USER.getUserInfo
      })
      return res?.data.result.isBeginner
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

export const updateUserinfo = createAsyncThunk(
  'user/updateUser',
  async ({ body }: { body: any }, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Patch<UserType | any>({
        url: USER.updateUserInfo,
        body
      })
      if (res?.data.message == 'Update successfully') {
        dispatch(getUserInfo())
      }
      return res?.data
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

const initialState: UserState = {
  userInfo: {},
  isBeginner: true
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.isBeginner = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.isBeginner = action.payload
    })
  }
})

export const { setUserInfo } = userSlice.actions
const userReducer = userSlice.reducer

export default userReducer
