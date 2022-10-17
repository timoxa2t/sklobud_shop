

import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import {getGoodsRequest} from '../../services/1ChttpService'
// import {goodsForTest} from '../../data'
// const defaultGoods = process.env.NODE_ENV === "development" ? goodsForTest: []
const defaultGoods = []
const defaultState = {goods: defaultGoods, totalInCart: 0}

const GET_GOODS = "GET_GOODS"
const ADD_TO_CART = "ADD_TO_CART"
const DELETE_FROM_CART = "DELETE_FROM_CART"
const CHANGE_QUANTITY = "CHANGE_QUANTITY"
const SET_GOODS_IMAGE = "SET_GOODS_IMAGE"

export const addToCart = createAction(ADD_TO_CART)
export const deleteFromCart = createAction(DELETE_FROM_CART)
export const changeQuantity = createAction(CHANGE_QUANTITY)
export const setGoodsImage = createAction(SET_GOODS_IMAGE)

export const getGoods = createAsyncThunk(
  GET_GOODS,
  async () => {
    try{
      const goods = await getGoodsRequest()
      return goods
    }catch(err){
      console.err(err)
    }
  }
)

export const goodsReducer = createReducer(defaultState, {
  [getGoods.fulfilled]: (state, {payload}) => {
    state.goods = payload
  },
  [addToCart]: (state, {payload}) => {
    const { id, count } = payload
    const good = state.goods.find(item => item.id === id)
    if(good){
      good.inCart = true
      good.quantity = count
      state.totalInCart++
    }
  },
  [deleteFromCart]: (state, {payload}) => {
    const good = state.goods.find(item => item.id === payload)
    if(good){
      good.inCart = false
      good.quantity = 0
      state.totalInCart--
    }
  },
  [changeQuantity]: (state, {payload}) => {
    const { id, quantity } = payload
    const good = state.goods.find(item => item.id === id)
    if(good){
      good.quantity = quantity
    }
  },
  [setGoodsImage]: (state, {payload}) => {
    const { imageData, imageGuid } = payload
    const good = state.goods.find(item => item.imageGuid === imageGuid)
    if(good){
      good.img = imageData.img
    }
  },
})


