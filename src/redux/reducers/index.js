import { combineReducers } from 'redux'
import { LoginReducer, IsLoggedin, GetCitizen,Contract } from './loginReducer'
import { Candidates } from './candidateReducer'

export const reducers = combineReducers({
  LoginReducer,
  IsLoggedin,
  GetCitizen,
  Candidates,
  Contract
})