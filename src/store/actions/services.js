
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import {servicesForTest} from '../../data'
import {getServicesRequest} from '../../services/1ChttpService'

const defaultServices = process.env.NODE_ENV === "development" ? servicesForTest: []

const defaultState = {services: defaultServices, totalInCart: 0}

const GET_SERVICES = "GET_SERVICES"
const ADD_TO_CART = "ADD_TO_CART"
const DELETE_FROM_CART = "DELETE_FROM_CART"
const CHANGE_QUANTITY = "CHANGE_QUANTITY"
const SET_SERVICE_IMAGE = "SET_SERVICE_IMAGE"

export const addToCart = createAction(ADD_TO_CART)
export const deleteFromCart = createAction(DELETE_FROM_CART)
export const changeQuantity = createAction(CHANGE_QUANTITY)
export const setServiceImage = createAction(SET_SERVICE_IMAGE)

export const getServices = createAsyncThunk(
  GET_SERVICES,
  async () => {
    try{
      const services =  await getServicesRequest()
      return services
    }catch(e) {
      alert(e.message)
      return []
    }
  }
)


export const servicesReducer = createReducer(defaultState, {
  [getServices.fulfilled]: (state, {payload}) => {
    state.services = payload
  },
  [addToCart]: (state, {payload}) => {
    const { id, count } = payload
    const service = state.services.find(item => item.id === id)
    if(service){
      service.inCart = true
      service.quantity = count
      state.totalInCart++
    }
  },
  [deleteFromCart]: (state, {payload}) => {
    const service = state.services.find(item => item.id === payload)
    if(service){
      service.inCart = false
      service.quantity = 0
      state.totalInCart--
    }
  },
  [changeQuantity]: (state, {payload}) => {
    const { id, quantity } = payload
    const service = state.services.find(item => item.id === id)
    if(service){
      service.quantity = quantity
    }
  },
  [setServiceImage]: (state, {payload}) => {
    const { imageData, imageGuid } = payload
    const service = state.services.find(item => item.imageGuid === imageGuid)
    if(service){
      service.img = imageData.img
    }
  }
})

