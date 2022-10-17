
import {useSelector, useDispatch} from 'react-redux'
import styled from 'styled-components'
import { useLocation, useHistory} from 'react-router-dom'
import { ToggleButton, InputGroup, FormControl, Button, Table} from 'react-bootstrap';

import {addToCart, setServiceChecked, changeQuantity} from '../store/actions/product.js'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default function Details(props) {
  const dispatch = useDispatch()
  const query = useQuery();
  const queryId = query.get("id")
  let history = useHistory();

  const productStore = useSelector(store => store.product)
  if(queryId == null) return (<h1>Продукція не знайдена</h1>)
  const prod = productStore.products.find(({id}) => id === queryId)
  if(prod === undefined) return (<h1>Продукція не знайдена</h1>)
  const {id, name, price, description, img, params, services} = prod
  const quantity = prod.quantity ? prod.quantity: 1
  const inCart = prod.inCart === undefined ? false: prod.inCart
  const servicesPrice = services.reduce((acc, item) => acc += item.checked ? item.price * 1: 0, 0)
  const totalPrice = (1 * price + servicesPrice) * quantity

  const handleClick = () => {
    if(inCart){
      history.push("/cart")
    }else{
      dispatch(addToCart(id))
    }
  }

  return(
    <ProductWrapper>
      <div className="container py-5">
        <div className="row">
          <div className="col-10 mx-auto text-center my-5">
            <h1>{name}</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-10 mx-auto col-md-6 my-3">
            {img ? <img src={img} alt="Зображення" className="img-fluid" />: null}
          </div>
          <div className="col-12 mx-auto ">
            <h4><strong>Ціна за куб: <span>₴</span> {price} {servicesPrice > 0 ? " + " + servicesPrice: null}</strong></h4>
            {services && services.map(service => <ServiceItem key={service.id} productId={id} quantity={quantity} {...service}/>)}
            <div className="row justify-content-center">
              <div className="col-12 col-md-4 row justify-content-center">
                <div className="col-10 m-2">
                  <InputGroup>
                    <InputGroup.Text>Кількість</InputGroup.Text>
                    <InputGroup.Text>м. куб.</InputGroup.Text>
                    <FormControl
                      min={1}
                      value={quantity}
                      aria-label="Кількість"
                      onChange={(event) => {dispatch(changeQuantity({id, quantity: event.target.value}))}}/>
                  </InputGroup>
                </div>
                <div className="col-12">
                  <InputGroup className="justify-content-center">
                    <InputGroup.Text><span>₴</span></InputGroup.Text>
                    <InputGroup.Text>{Number(totalPrice).toLocaleString('ua')}</InputGroup.Text>
                     <Button variant="outline-secondary" onClick={handleClick}>
                       <div className="current-text-color">{ inCart ? "Перейти до кошика": "Додати в кошик"}</div>
                     </Button>
                  </InputGroup>
                </div>
              </div>
            </div>
            <div className="card m-2 p-2 mx-auto col-lg-6">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Характеристика</th>
                    <th>Значення</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(params).map(key =>
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{params[key]}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <p className="text-capitalize font-weight-bold mt-3 mb-0 text-left">Опис: </p>
            <p className="lead">{description}</p>
          </div>
        </div>
      </div>
    </ProductWrapper>
  )
}

const ServiceItem = (props) => {
  const dispatch = useDispatch()
  const {id, name, price, checked, productId, quantity} = props

  const handleServiceCheck = (productId, serviceId, checked) => {
    dispatch(setServiceChecked({productId, serviceId, checked: !checked}))
  }

  return (
    <ToggleButton
      className="col-10 m-1 p-1 text-start"
      id={id}
      type="checkbox"
      variant="outline-secondary"
      checked={checked}
      value={id}
      onChange={(event) => handleServiceCheck(productId, id, checked)}
    >
      <div className="row justify-space-between current-text-color">
        <div className="col-8">
          <i class={"far " + (checked ? "fa-check-circle": "fa-circle")}></i>{" " + name}
        </div>
        <div className="col-4 text-end">
          {quantity * price} <span>₴</span>
        </div>
      </div>
    </ToggleButton>
  )
}

//
// const TextRow = (props) => {
//   return (
//     <div className={props.addStyle + " text-field row"}>
//       <div className="col-8">
//         {props.text}
//       </div>
//       <div className="col-4">
//         {props.value}
//       </div>
//     </div>
//   )
// }

const ProductWrapper = styled.div`
 .lead{
   text-align: left;
 }

 .text-field {
   font-size: calc(10px + 1.5vmin);
   padding: 0 12px;
   margin: 0 1vmin ;
   text-align: left;
   border: 1px solid grey;
 }
`
