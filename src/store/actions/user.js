// import {defaultUser} from '../../data'
import {setShowModal, setLoginErrorMessage} from './display'
import {clearCart} from './product'
import {postUserRequest, getUserRequest, updateUserDataRequest, plaseOrderRequest, postPhoneRequest} from '../../services/1ChttpService'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
// import GoogleLogin from 'react-google-login'

const defaultUser = {
  userId: 0,
  firstName: "",
  lastName: "",
  loggedIn: false,
  email: "",
  phone: "",
  address: ""
}

const SET_USER = "SET_USER"
const SET_EMAIL = "SET_EMAIL"
const SET_FIRST_NAME = "SET_FIRST_NAME"
const SET_LAST_NAME = "SET_LAST_NAME"
const SET_PHONE = "SET_PHONE"
const LOG_OUT = "LOG_OUT"
const SET_ADDRESS = "SET_ADDRESS"
const PLACE_ORDER = "PLACE_ORDER"

// export const setUser = (user) => ({type: SET_USER, user})
// export const logOut = () => ({type: LOG_OUT})
// export const setFirstName = (firstName) => ({type: SET_FIRST_NAME, firstName})
// export const setLastName = (lastName) => ({type: SET_LAST_NAME, lastName})
// export const setPhone = (phone) => ({type: SET_PHONE, phone})
// export const setAddress = (address) => ({type: SET_ADDRESS, address})
// export const setEmail = (email) => ({type: SET_EMAIL, email})

export const setUser = createAction(SET_USER)
export const logOut = createAction(LOG_OUT)
export const setFirstName = createAction(SET_FIRST_NAME)
export const setLastName = createAction(SET_LAST_NAME)
export const setPhone = createAction(SET_PHONE)
export const setAddress = createAction(SET_ADDRESS)
export const setEmail = createAction(SET_EMAIL)

export const placeOrder = createAsyncThunk(
  PLACE_ORDER, 
  async (orderDetails) => {
    const result = await plaseOrderRequest(orderDetails)
  }
)

// export const placeOrder = (orderDetails) => {
//   return (dispatch) => {
//     plaseOrderRequest(dispatch, orderDetails, clearCart)
//   }
// }

export const loginHandler = (login, pwd) => {
  return function(dispatch) {
    const userData = {}

    userData.login = login
    userData.pwd = pwd

    getUserRequest(dispatch, userData, loginUser)

  }
}

export const loginViaGoogle = (userData) => {
  return function(dispatch) {
    getUserRequest(dispatch, userData, loginUser)
  }
}

export const getParamFunction = (paramName) => {
  switch (paramName) {
    case "firstName":
      return setFirstName
    case "lastName":
      return setLastName
    case "phone":
      return setPhone
    case "address":
      return setAddress
    case "email":
      return setEmail
    default:
      return () => {}
  }
}

export const updateUserData = (userId, value, id, updateStatus) => {
  return (dispatch) => {

    const userData = {userId, id, value}
    updateStatus({status: "loading", message: "Оновлення даних на сервері"})
    const callback = (data, status) => {
      updateStatus(status)
      if(data.hasOwnProperty("id")){
        dispatch(getParamFunction(data.id)(data.value))
      }
    }
    updateUserDataRequest(dispatch, userData, callback)
  }
}

export const loginUser = (user) => {
  return function(dispatch) {
    if(user.hasOwnProperty("error")){
      dispatch(setLoginErrorMessage(user.error))
    }else{   
      user.loggedIn = true
      dispatch(setUser(user))
      dispatch(setShowModal(false))
    }
  }
}

export const signUpHandler = (phone, email, pwd, name, lastName) => {
  return (dispatch) => {

    const userData = {}
    userData.login = email
    userData.phone = phone
    userData.email = email
    userData.firstName = name
    userData.lastName = lastName
    userData.pwd = pwd

    postUserRequest(dispatch, userData)
  }
}

export const callMeBackHandler = (phone) => {
  return (dispatch, getState) => {
    postPhoneRequest(dispatch, phone)
  }
}


export function userReducer(state = defaultUser, action){
  const newState = getNewState(state)
  switch(action.type){
    case SET_USER:
      return action.user
    case LOG_OUT:
      return defaultUser
    case SET_FIRST_NAME:
      newState.firstName = action.firstName
      return newState
    case SET_LAST_NAME:
      newState.lastName = action.lastName
      return newState
    case SET_EMAIL:
      newState.email = action.email
      return newState
    case SET_PHONE:
      newState.phone = action.phone
      return newState
    case SET_ADDRESS:
      newState.address = action.address
      return newState
    default:
      return state
  }
}

const getNewState = (state) => {
  const newState = {}
  Object.assign(newState, state)
  return newState
}
