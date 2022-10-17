
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'

import {productReducer, getProducts} from './actions/product'
import {userReducer} from './actions/user'
import {displayReducer} from './actions/display'
import {goodsReducer, getGoods} from './actions/goods'
import {servicesReducer, getServices} from './actions/services'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user: userReducer,
    goods: goodsReducer,
    product: productReducer,
    display: displayReducer,
    services: servicesReducer,
  })
  
// const store = createStore(rootReducer, applyMiddleware(thunk))


const persistConfig = {
    key: 'root',
    storage,
    blacklist: ["display.quickCall"]
  }


const persistedReducer = persistReducer(persistConfig, rootReducer)


let store = configureStore({reducer: persistedReducer})
let persistor = persistStore(store)
export { store, persistor }

store.dispatch(getServices())
store.dispatch(getProducts())
store.dispatch(getGoods())
  