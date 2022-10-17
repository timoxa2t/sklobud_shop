
import { createAsyncThunk, createReducer, createAction } from '@reduxjs/toolkit'
import {getProductsRequest} from '../../services/1ChttpService'

// import {storeProducts} from '../../data'
// const defaultProducts = process.env.NODE_ENV === "development" ? storeProducts: []

const SET_SELECTED = "SET_SELECTED"
const ADD_TO_CART = "ADD_TO_CART"
const DELETE_FROM_CART = "DELETE_FROM_CART"
const CHANGE_QUANTITY = "CHANGE_QUANTITY"
const GET_PRODUCTS = "GET_PRODUCTS"
const SET_PRODUCT_IMAGE = "SET_PRODUCT_IMAGE"
const CLEAR_CART = "CLEAR_CART"
const SET_SERVICES = "SET_SERVICES"
const SET_SERVICE_CHECHED = "SET_SERVICE_CHECHED"
const SORT_BY = "SORT_BY"

const defaultProducts = []

const defaultState = {products: defaultProducts, selected: null, totalInCart: 0}

export const getProducts = createAsyncThunk(
  GET_PRODUCTS,
  async () => {
    try{
      const prods =  await getProductsRequest()
      return prods
    }catch(e) {
      alert(e.message)
      return []
    }
  }
)
export const handleDetail = createAction(SET_SELECTED)
export const addToCart = createAction(ADD_TO_CART)
export const deleteFromCart = createAction(DELETE_FROM_CART)
export const changeQuantity = createAction(CHANGE_QUANTITY)
export const setProductImage = createAction(SET_PRODUCT_IMAGE) 
export const setProductServices = createAction(SET_SERVICES)
export const clearCart = createAction(CLEAR_CART)
export const setServiceChecked = createAction(SET_SERVICE_CHECHED) 
export const sortProducts = createAction(SORT_BY)


export const productReducer = createReducer(defaultState, {
  [getProducts.fulfilled]: (state, {payload}) => {
    state.products = payload
    state.products = assignServicestoProducts(payload, state.services)
    return state
  },
  [sortProducts]: (state, {payload}) => {
    state.products = state.products.sort((a, b) => {
      switch(payload){
          case "Від дешевих до дорогих":
          return a.price - b.price
          case "Від дорогих до дешевих":
          return b.price - a.price
          default: return a.price - b.price
      }
    })
  },
  [handleDetail]: (state, {payload}) => {
    state.selected = payload
  },
  [addToCart]: (state, {payload}) => {
    const prod = state.products.find(({id}) => id === payload)
    prod.inCart = true
    prod.quantity = !prod.quantity ? 1: prod.quantity
    state.totalInCart++
  },
  [deleteFromCart]:  (state, {payload}) => {
    const prod = state.products.find(({id}) => id === payload)
    deleteProductFromCart(prod)
    state.totalInCart--
  },
  [changeQuantity]: (state, {payload}) => {
    const {quantity, id} = payload
    const prod = state.products.find(prod => prod.id === id)
    prod.quantity = quantity < 0 ? -quantity: quantity
  },
  [setProductImage]: (state, {payload}) => {
    const {imageGuid, imageData} = payload
    const prod = state.products.find(prod => prod.imageGuid === imageGuid)
    prod.img = imageData.img
  }, 
  [setProductServices]: (state, {payload}) => {
    state.services = payload
    state.products = assignServicestoProducts(state.products, payload)
  }, 
  [clearCart]: (state) => {
    state.products = state.products.map(product => {
      deleteProductFromCart(product)
      return product
    })
    state.totalInCart = 0
  }, 
  [setServiceChecked]: (state, {payload}) => {
    const {productId, serviceId, checked} = payload
    const prod = state.products.find(({id}) => id === productId)
    const service = prod.services.find(({id}) => id === serviceId)
    service.checked = checked
  }
}) 

const deleteProductFromCart = (product) => {
  product.inCart = false
  product.quantity = 0
  product.services = product.services.map(service => {
    service.checked = false
    return service
  })
  return product
}


const assignServicestoProducts = (products, services = undefined) => {
  const servicesToAssign = services ? services.filter(item =>
    item.params.hasOwnProperty("Опція продукції") && item.params["Опція продукції"] === "Так"
  ): []

  return products.map(product => {
    product.services = servicesToAssign.map(service => {

      return {id: service.id, name: service.name, price: service.price, checked: false}
    })
    return product
  })
}


