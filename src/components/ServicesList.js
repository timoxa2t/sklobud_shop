
import React from 'react'
import {useSelector} from 'react-redux'
// import styled from 'styled-components'
import ServiceItem from "./ServiceItem"

export default function ServicesList() {
  const services = useSelector(store => store.services.services)

  return (
    <React.Fragment>
      <div className="container">
        {services.map(item =>
          <ServiceItem details={item} key={item.id}/>
        )}
      </div>
    </React.Fragment>
  )
}
