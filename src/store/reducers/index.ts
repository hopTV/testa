import { combineReducers } from 'redux'
import generateReducer from './generate.slice'
import historyReducer from './history.slice'
import auth from './auth.reducer'
import LandReducer from './land.reducer'
import userReducer from './user.reducer'

const rootReducer = combineReducers({
  auth: auth.reducer,
  generate: generateReducer,
  history: historyReducer,
  land: LandReducer,
  user: userReducer
})

export default rootReducer

// export type RootState = ReturnType<typeof rootReducer>
