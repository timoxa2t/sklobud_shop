import {setProductImage, setProductServices} from "../store/actions/product"
import {getGoods, setGoodsImage} from "../store/actions/goods"
import {getServices, setServiceImage} from "../store/actions/services"
import {setQuickCall} from "../store/actions/display"
import axios from 'axios'

import config from '../config.json'
import { loginUser } from "../store/actions/user"

// const baseURL = process.env.NODE_ENV === "development" ? config.baseURLtest :config.baseURL;
// const baseURL = process.env.NODE_ENV === "development" ? config.baseURLtest :"https://sklobudresurs.com/api/";
const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000/storage/": config.baseURL;


const makeFetchRequest = (method, address, urlParams = {}) => {
  let targetUrl = baseURL.concat(address);
  const url = new URL(targetUrl)
  Object.keys(urlParams).forEach(key => url.searchParams.append(key, urlParams[key]))

  return fetch(url, {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json;X-www-form-urlencoded',
      Accept: 'application/json,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',

    },
  })
  .then((response) => {
      return response.json()
  })
  .catch((error) => {
     console.error(error);
  });
}


export const postPhoneRequest = (dispatch, phone) => {
  const callback = (json) => {
    if(json.statusMessage === "OK"){
      console.log("setQuickCall(false)")
      dispatch(setQuickCall(false))
    }
  }

  makeFetchRequest("GET", "telegram/sendMessage", callback, {text: "Передзвонити " + phone});
}

export const getProductsRequest = () => {

  return makeFetchRequest("GET", "products")
  .then(({data}) => {
    return data.map(product => {
      product.services = []
      if(product.hasOwnProperty("imageGuid") ){
        // getImage(dispatch, product.imageGuid, setProductImage)
      }
      return product
    })
  });
}

export const getGoodsRequest = () => {

  return makeFetchRequest("GET", "goods")
  .then(({data}) => data)
}

export const getServicesRequest = () => {

  return makeFetchRequest("GET", "services")
  .then(({data}) => data);
}

export const postUserRequest = (dispatch, userData) => {
  let targetUrl = baseURL.concat('user');
  const url = new URL(targetUrl)
  axios(url.href, {
    method: 'post',
    data: {type: "Sign_up", data: userData}
  })
  .then((response) => {
      return response.data
  })
  .then((json) => {

    dispatch(loginUser(json))
  })
  .catch((error) => {
     console.error(error);
  });
}

export const getUserRequest = (dispatch, userData) => {
  let targetUrl = baseURL.concat('user');
  const url = new URL(targetUrl)
  axios({
    method: 'post',
    url: url.href,
    data: {type: "Sign_in", data: userData}
  })
  .then((response) => {
      return response.data
  })
  .then((json) => {
    dispatch(loginUser(json))
  })
  .catch((error) => {
     console.error(error);
  });
}

export const getImage = (dispatch, imageGuid, dispatchFunction) => {
  
  if(imageGuid === "" || imageGuid === null || imageGuid === "null") return

  let targetUrl = baseURL.concat('image');
  const url = new URL(targetUrl)

  const params = {ImageGUID: imageGuid}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    },
  })
  .then((response) => {
      return response.json()
  })
  .then((json) => {
    // const getImagefromBase64 = (base64String) =>{
    //   let base64Icon = 'data:image/jpeg;base64,' + base64String;
    //   return base64Icon
    // }

    if(!json.hasOwnProperty("loaded") || !json.loaded) return;

    // json.data.img = getImagefromBase64(json.data.img)
    dispatch(dispatchFunction(json.data, imageGuid))
  })
  .catch((error) => {
     console.error(error);
  });
}

export const updateUserDataRequest = (dispatch, userData, callback) => {
  let targetUrl = baseURL.concat('user');
  const url = new URL(targetUrl)
  axios(url.href, {
    method: 'put',
    data: {type: "user_info", data: userData}
  })
  .then((response) => {
      return response.data
  })
  .then((json) => {
    if(json.hasOwnProperty("error")){
      callback({status: "error", message: json.error})
    }else{
      callback(userData, {status: "succsess", message: "Дані збережено"})
    }
  })
  .catch((error) => {
     console.error(error);
  });
}

export const updateUserContactInfoRequest = (dispatch, userData, callback) => {
  let targetUrl = baseURL.concat('user');
  const url = new URL(targetUrl)

  fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    },
    body: JSON.stringify({type: "contact_info", data: userData})
  })
  .then((response) => {
      return response.json()
  })
  .then((json) => {
    if(json.hasOwnProperty("error")){
      callback({status: "error", message: json.error})
    }else{
      callback(json.data, {status: "succsess", message: "Дані збережено"})
    }

  })
  .catch((error) => {
    debugger
     console.error(error);
  });
}

export const plaseOrderRequest = (orderDetails) => {
  let targetUrl = baseURL.concat('orders');
  const url = new URL(targetUrl)
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    },
    body: JSON.stringify({type: "Place_order", data: orderDetails})
  })
  .then((response) => {
      return response.json()
  })
  .then((json) => {
    return true
  })
  .catch((error) => {
     console.error(error);
  });
}

export const getOrdersRequest = (userId, callback) => {
  const urlParams = {UserId: userId}
  makeFetchRequest("get", "orders", callback, urlParams)
}
