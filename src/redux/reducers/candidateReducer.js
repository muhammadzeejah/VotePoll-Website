import { ActionTypes } from '../constants/action-type'

const iniatialCandidates=[]
export const Candidates = (state = iniatialCandidates, action) => {  
  switch (action.type) {
    case ActionTypes.GET_ALL_CANDIDATES:
      return {...state, ...action.payload}
    default:
      return state
  }
}