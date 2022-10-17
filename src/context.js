import React, {useState} from 'react'
import {storeProducts, detailProduct} from './data'


const ProductContext = React.createContext()

export const ProductProvider = (props) => {

  const [products, setProducts] = useState(storeProducts)
  const [detail, setDetail] = useState(detailProduct)

  const handleDetail = (id) => {
    setDetail(products.find(prod => prod.id === id))
  }

  const addToCart = (id) => {
    const newProdList = products.map(product => {
      if(product.id === id){
        product.inCart = true
        product.quantity = 1
      }
      return product
    })
    setProducts(newProdList)
  }

  const deleteFromCart = (id) => {
    const newProdList = products.map(product => {
      if(product.id === id){
        product.inCart = false
        product.quantity = 0
      }
      return product
    })
    setProducts(newProdList)
  }

  const changeQuantity = (id, newQuantity) => {
    const newProdList = products.map(product => {
      if(product.id === id){
        product.quantity = newQuantity
      }
      return product
    })
    setProducts(newProdList)
  }



  return (
    <ProductContext.Provider value={{
      products: products,
      detailProduct: detail,
      handleDetail: handleDetail,
      addToCart: addToCart,
      deleteFromCart: deleteFromCart,
      changeQuantity: changeQuantity,
    }}>
      {props.children}
    </ProductContext.Provider>
  )
}


export const ProductConsumer = ProductContext.Consumer
