import axios from 'axios'
import { ActionTypes } from '../constants/action-type'
import Cookies from 'js-cookie'

export const Signin = (form) => async (dispatch) => {
  return await axios.post(`http://127.0.0.1:3000/api/v1/auth/login`, form)
  .then((response) => {
    Cookies.set('token', response.data.TOKEN)
  })
  .catch(error=>{
    console.log(error)
  })
}

export const GetCitizen = (cnic) => async (dispatch) => {
  return await axios.get(`http://127.0.0.1:3000/api/v1/citizen/${cnic}`,{
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      Accept: 'application/json',
    },
  })
    // .then(response => {
    //   dispatch({
    //     type: ActionTypes.GET_CITIZEN,
    //     payload: response.data,
    //   })
    // })
    // .catch(error => {
    //   console.log(error.message)
    // })
}

export const GetCitizens = () => async () => {
  return await axios.get(`http://127.0.0.1:3000/api/v1/citizen/getCitizens`)
}

export const GetEections = (cnic) => async (dispatch) => {
  return await axios.get(`http://127.0.0.1:3000/api/v1/citizen/election/${cnic}`,{
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      Accept: 'application/json',
    },
  })
}

export const ContactUs = (form) => (dispatch) => {
  return axios.post('http://127.0.0.1:3000/api/v1/send/contact-us', form)
}

export const GetCandidate = (type,cnic) => async (dispatch) => {
  return await axios.get(`http://127.0.0.1:3000/api/v1/citizen/${type}/${cnic}`,{
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      Accept: 'application/json',
    },
  })
}

export const PostElectionAppearance = (form) => async () => {
  return await axios({
    url: `http://127.0.0.1:3000/api/v1/voterStatus/update/${Cookies.get('cnic')}`,
    method: 'PATCH',
    data: form,
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      Accept: 'application/json',
    },
  })
}

export const GetElectionAppearance = () => async () => {
  return await axios.get(`http://127.0.0.1:3000/api/v1/voterStatus/${Cookies.get('cnic')}`,{
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      Accept: 'application/json',
    },
  })
}

export const isLoggedin = () => {
  return{
    type: 'LoggedIn'
  }
}

export const contract = (obj) => {
  return{
    type: 'Contract',
    payload: obj
  }
}