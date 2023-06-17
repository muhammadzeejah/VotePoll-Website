import { useEffect } from 'react'
import { ActionTypes } from '../constants/action-type'
import Cookies from 'js-cookie'

const defaultState = {}
export const LoginReducer = (state = defaultState, action) => {  
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {...state, ...action.payload}
    case ActionTypes.LOGOUT:
      return state
    default:
      return state
  }
}


export const GetCitizen= (state = {}, action) => {  
  switch (action.type) {
    case ActionTypes.GET_CITIZEN:
      return {...state, ...action.payload}
    default:
      return state
  }
}

const initial=Cookies.get('token')
export const IsLoggedin=(state = true, action)=>{
  switch (action.type) {
    case 'LoggedIn':
      return !state
    default:
      return state
  }
}

export const Contract=(state = {}, action)=>{
  switch (action.type) {
    case 'Contract':
      return {...state, ...action.payload}
    default:
      return state
  }
}
