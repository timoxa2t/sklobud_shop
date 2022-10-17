
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
// import styled from 'styled-components'
import {getOrdersRequest} from '../services/1ChttpService'


export default function OrdersList() {
  const user = useSelector(store => store.user)
  const [orders, setOrders] = useState([])
  const [ordersReceived] = useState(false)

  const receiveOrders = (json) => {

    setOrders(json.data.map(order => {
      order.date = new Date(Number(order.date)).toLocaleString('ua')
      order.payed = Number(order.paymentDate) > 0
      order.delivered = Number(order.deliveryDate) > 0
      return order
    }))
  }

  useEffect(() => {
    if(user.loggedIn){
      getOrdersRequest(user.id, receiveOrders)
    }
  }, [ordersReceived, user])

  return (
    <React.Fragment>
      <div className="container">
        {orders.map(item =>
          <div className="card m-2 p-2" key={item.code}>
            <div className="row space-between">
              <div className="col-6 text-start">{item.code}</div>
              <div className="col-6 text-end">{item.date}</div>
            </div>
            <div className="row space-between">
              <div className="col-6 text-start">{item.payed ? "Оплачено": "Не оплачено"}</div>

              <div className="col-6 text-end">₴ {Number(item.total).toLocaleString('ua')}</div>
              <div className="col-6 text-start">{item.delivered ? "Відгружено": "Не відгружено"}</div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
