import React ,{useState} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {handleDetail, addToCart, setServiceChecked} from '../store/actions/product.js'
import {ListGroup} from 'react-bootstrap';


export default function Product(props) {
  const dispatch = useDispatch()
  const [showServices, setShowServices] = useState(false)
  const {id, name, price, description, img, inCart, services} = props.details



  return (
    <ProductWrapper className="col-10 mx-auto col-12 col-xl-6 my-3">
      <div className="card">
        <div className="img-container text-center" onClick={() => {dispatch(handleDetail(id))}}>
          <Link to={"/products?id=" + id} className='nav-link p-2'>
            <div className="row">
              <div className="col-4">
                <img src={props.details.hasOwnProperty("img") ? props.details.img: "img/logo.png"} alt="product" className="card-img-top"/>
              </div>
              <div className="col-8">
                <p className="description_container text-start">{description.length > 200 ? description.substring(0,200) + "...": description}</p>
              </div>
            </div>
          </Link>

          {inCart &&
            <ListGroup className="text-start rounded-0 list-style">
              <ListGroup.Item action onClick={() => {setShowServices(!showServices)}}>
                    <i className={"fas fa-angle-down " + (showServices ? "rotate": "")}> </i>
                  {" Додаткові послуги"}
              </ListGroup.Item>
              {showServices &&
                services.map(service => <ServiceListItem key={service.id} productId={id} {...service}/>)
              }
            </ListGroup>
          }

          <button
            className="cart-btn"
            disabled={inCart}
            onClick={() => {dispatch(addToCart(id))}}>
              {inCart ?
                (<p className="text-capitalize mb-0" disabled>
                  У кошику
                </p>):
                (<i className="fas fa-cart-plus fa-lg"/>)
              }
          </button>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <p className="align-self-center mb-0">{name}</p>
          <h3 className="text-blue font-italic mb-0">
            <span className="mr-1">₴</span>
            {price}
          </h3>
        </div>
      </div>
    </ProductWrapper>
  )
}

const ServiceListItem = (props) => {
  const dispatch = useDispatch()
  const {id, name, checked, productId} = props
  const handleServiceCheck = (productId, serviceId, checked) => {
    dispatch(setServiceChecked({productId, serviceId, checked: !checked}))
  }

  return (
    <ListGroup.Item action key={id} onClick={() => handleServiceCheck(productId, id, checked)}>

          <i class={"far " + (checked ? "fa-check-circle text-success": "fa-circle")}></i>
           {" " + name}

    </ListGroup.Item>
  )
}
// Product.propTypes = {
//   details: PropTypes.shape({
//     id: PropTypes.number,
//     img: PropTypes.string,
//     title: PropTypes.string,
//     price: PropTypes.number,
//     inCart: PropTypes.bool,
//     quantity: PropTypes.number
//   }).isRequired
// }

const ProductWrapper = styled.div`

  .list-style{
    font-size: var(--standartFontSize);
  }

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
    background: var(--cardBackground);
    border-radius: 1rem;
  }
  .card-footer{
    transition: all 0.2s linear;
    border-radius: 0 0 1rem 1rem;
    font-size: var(--standartFontSize);
  }
  .nav-link{
    color: var(--mainWhite) !important;
    font-size: var(--smallFontSize);
  }

  &:hover{
    .card{
      border: 0.04srem solid rgba(0,0,35,0.3);
      box-shadow: 6px 6px 15px 0px rgba(0,0,35,0.2);
    }
    .card-footer{
      background-image: var(--backgroundTexture);
      color: var(--textWhite);
      text-shadow: 0.1rem 0.1rem 0.1rem black;
    }
  }
  .img-container{
    position: relative;
    overflow: hidden;
    text-align: left;
  }

  .card-img-top {
    max-width: 50vmin;
    height: auto;
    margin: auto;
    transition: all 0.3s linear;
    border-radius: 1rem;
  }

  .img-container: hover .card-img-top{
    transform: scale(1.1);
  }

  .cart-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.5rem 0.5rem ;
    background-image: var(--backgroundTexture);
    border: none;
    color: var(--textWhite);
    border-radius: 0.5rem 0 0 0;
    transform: translate(100%, 100%);
    transition: all 0.3s linear;
  }

  .img-container:hover .cart-btn{
    transform: translate(0,0);
  }

  .img-container:hover .description_container{
    transform: translate(0,0);
  }

  .cart-btn:hover{
    color: var(--textBlack);
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: white;
  }

  .list-style:checked{
    color: var(--textWhite);
  }

  .dropdown-button{
    color: var(--textColor) !important;
    text-decoration: none;
  }
`
