import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import styled from 'styled-components'
import {ListGroup} from 'react-bootstrap';

import {changeQuantity as changeProductQuantity, deleteFromCart as deleteProductFromCart, setServiceChecked} from '../store/actions/product'
import {changeQuantity as changeGoodsQuantity, deleteFromCart as deleteGoodsFromCart} from '../store/actions/goods'


export default function Cart() {
  const productsInCart = useSelector(store => store.product.products.filter(product => product.inCart))
  const goodsInCart = useSelector(store => store.goods.goods.filter(goods => goods.inCart))


  return productsInCart.length > 0 || goodsInCart.length > 0 ? (
    <CartWrapper className="container-fluid">
      <h2>Кошик</h2>

      {productsInCart.length > 0 && (
        <div className="card">
          <div className="row">
            <div className="col-12 col-md-5">Назва</div>
            <div className="col-3 col-md-2">К-сть(<span>㎥</span>)</div>
            <div className="col-3 col-md-2">Ціна за <span>㎥</span></div>
            <div className="col-3 col-md-2">Сума <span>₴</span></div>
          </div>
          {productsInCart.map(prod => {
            return (
                <CartItem key={prod.id} params={prod} changeQuantity={changeProductQuantity} deleteFromCart={deleteProductFromCart} id={prod.id}/>
              )
            })
          }
      </div>)
      }

      <p/>

      {goodsInCart.length > 0 && (
        <div className="card">
          <div className="row">
            <div className="col-12 col-md-5">Назва</div>
            <div className="col-3 col-md-2">К-сть т.</div>
            <div className="col-3 col-md-2">Ціна за тонну</div>
            <div className="col-3 col-md-2">Сума <span>₴</span></div>
          </div>
            {goodsInCart.map(prod => {
              return (
                  <CartItem key={prod.id} params={prod} changeQuantity={changeGoodsQuantity} deleteFromCart={deleteGoodsFromCart} id={prod.id}/>
                )
              })
            }
        </div>)
      }
      <p/>
      <h1>До сплати: ₴ {Number(
        productsInCart.reduce((acc, prod) => acc += prod.price * prod.quantity + prod.services.reduce((serviceAcc, service) => serviceAcc += (service.checked ? 1:0) * prod.quantity * service.price , 0), 0) +
        goodsInCart.reduce((acc, prod) => acc += prod.price * prod.quantity, 0)
      ).toLocaleString('ua')}</h1>
      <Link to="/checkout">
        <button className="btn btn-block btn-primary">Оформити замовлення</button>
      </Link>
      </CartWrapper>
    ): (<h2>Кошик порожній</h2>)
}

const CartItem = (props) => {
  const dispatch = useDispatch()
  const {id, name, price, quantity, services} = props.params
  const [showServices, setShowServices] = useState(false)
  const servicesPrice = services.reduce((acc, service) => acc += (service.checked ? 1:0) * quantity * service.price, 0)

  return(
    <ProductWrapper id={id}>
      <div className="card">
        <div className="row">
          <div className="col-12 col-md-5 row">
            <div className="col-1" onClick={() => {setShowServices(!showServices)}}>
              <i className={"fas fa-angle-down " + (showServices ? "rotate": "")}> </i>
            </div>
            <div className="col-11">
              {name}
            </div>
          </div>
          <div className="col-3 col-md-2"><input type="number" className="form-control" value={quantity} min={1} onChange={(event) => {dispatch(props.changeQuantity({id, quantity: event.target.value}))}}/></div>
          <div className="col-3 col-md-2">{price}</div>
          <div className="col-3 col-md-2">{quantity * price + servicesPrice}</div>
          <div className="col-3 col-md-1 row">
              <button className="btn btn-block btn-danger " onClick={() => {dispatch(props.deleteFromCart(id))}}>
                <i className="fa fa-trash"></i>
              </button>
          </div>

        </div>
        {showServices &&
          services.map(service => <ServiceListItem key={service.id} productId={id} quantity={quantity} {...service}/>)
        }
      </div>
    </ProductWrapper>
  )
}

const ServiceListItem = (props) => {
  const dispatch = useDispatch()
  const {id, name, price, checked, productId, quantity} = props
  
  const handleServiceCheck = (productId, serviceId, checked) => {
    dispatch(setServiceChecked({productId, serviceId, checked: !checked}))
  }

  return (
    <ListGroup.Item action key={id} onClick={() => handleServiceCheck(productId, id, checked)}>
      <div className="row justify-space-between">
        <div className="col-12 col-md-5 text-start">

          <i class={"far " + (checked ? "fa-check-circle text-success": "fa-circle")}></i>
           {" " + name}
        </div>
        <div className="col-3 col-md-2">
        </div>
        <div className="col-3 col-md-2">
          {price}
        </div>
        <div className="col-3 col-md-2">{(checked ? 1:0) * quantity * price}</div>
      </div>
    </ListGroup.Item>
  )
}

const ProductWrapper = styled.div`


  .rotate {
   animation: rotate-keyframes 0.5s;
   animation-fill-mode: forwards;
  }

  @keyframes rotate-keyframes {
   from {
    transform: rotate(0deg);
   }
   to {
    transform: rotate(180deg);
   }
 }

  .card{
    transition: all 0.2s linear;
    background: var(--mainGray);
    border-radius: 1rem;
    margin: 1rem;
    padding: 5px;
    text-align: center;
    font-size: var(--standartFontSize)
  }
`

const CartWrapper = styled.div`
  .card{
    background: var(--cardBackground);
  }
`
