
import React from 'react'
import {useSelector} from 'react-redux'
// import styled from 'styled-components'
import GoodsItem from "./GoodsItem"



export default function GoodsList() {
  const goods = useSelector(store => store.goods.goods)
  
  return (
    <React.Fragment>
      <div className="container">
        {goods.map(item =>
          <GoodsItem details={item} key={item.id}/>
        )}
      </div>
    </React.Fragment>
  )
}
