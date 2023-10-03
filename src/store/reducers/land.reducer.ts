import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LandType } from 'interfaces/land-form.interface'
import { HARVEST, LAND_LIST, LAND_SEED, LAND_WATER, USER } from 'network/key'
import { setIsLoading } from './loading.reducer'
import { fetchData } from 'utils/fetchdata'
import { networkService } from 'network/service'

interface LandState {
  landList: LandType[]
  loading: boolean
  isPersionNew: boolean
  // initialLand: LandType[]
}

const initialState: LandState = {
  loading: false,
  isPersionNew: false,
  landList: []
  // initialLand: fetchData
}

export const getListLandAsync = createAsyncThunk(
  'land/getListLand',
  async (_, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Get<LandType[] | any>({ url: LAND_LIST })
      return res?.data?.result?.reverse()
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

export const handleSeedLand = createAsyncThunk(
  'land/seed',
  async (_, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Post<LandType | any>({ url: LAND_SEED })
      await dispatch(getListLandAsync())
      return res?.data?.result
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

export const handleWaterTree = createAsyncThunk(
  'land/water',
  async (id: string, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Post<LandType | any>({
        url: `${LAND_WATER}/${id}`
      })
      await dispatch(getListLandAsync())
      return res?.data?.data?.result
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

export const handleHarvestById = createAsyncThunk(
  'land,harvest',
  async (id: string, { dispatch }) => {
    try {
      dispatch(setIsLoading(true))
      const res = await networkService.Post<LandType | any>({
        url: `${HARVEST}/${id}`
      })
      await dispatch(getListLandAsync())
      return res?.data?.result
    } catch (err) {
      console.log(err)
      dispatch(setIsLoading(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }
)

const landSlice = createSlice({
  name: 'land',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getListLandAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getListLandAsync.fulfilled, (state, action) => {
        state.landList = action.payload
        state.loading = false
      })
      .addCase(handleSeedLand.fulfilled, (state, action) => {
        state.landList = action.payload
      })
  }
})

export const {} = landSlice.actions
const landReducer = landSlice.reducer

export default landReducer
