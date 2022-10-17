import {useEffect, useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import { Alert, Button, Form, Col, Row} from 'react-bootstrap';
import {StandaloneSearchBox, useJsApiLoader , GoogleMap, Marker, DirectionsRenderer} from "@react-google-maps/api"
import Geocode from "react-geocode"
import {  } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
// import {UserField} from './User'
import {placeOrder} from '../store/actions/user'
import * as yup from 'yup'
import { Formik } from 'formik';
import styled from 'styled-components'

import config from '../config.json'

Geocode.setApiKey(config.googleMapsApiKey);
Geocode.setLanguage("ua");
Geocode.setRegion("ua");

const origin = { lat: 50.422516, lng: 25.804742 }
const maxCapacity = 9 //cub meters per car
const pricePerKm = 30 //delivery price for one kilometer for one car
const baseDeliveryPrice = 650 //basic delivery price per car


export default function Checkout(){
  // const {props, setProps} = useState(defaultProps)
  const productsInCart = useSelector(store => store.product.products.filter(product => product.inCart))
  const goodsInCart = useSelector(store => store.goods.goods.filter(product => product.inCart))
  // const servicesInCart = useSelector(store => store.services.services.filter(product => product.inCart))
  const user = useSelector(store => store.user)
  const [address, setAddress] = useState(user.props.address)
  const dispatch = useDispatch()
  const [updateView, setUpdateView] = useState(true)
  const [directions, setDirections] = useState()
  const [destination, setDestination] = useState()
  const [distance, setDistance] = useState(0)

  const totalPrice = productsInCart.reduce((acc, prod) => acc += prod.price * prod.quantity, 0) + goodsInCart.reduce((acc, prod) => acc += prod.price * prod.quantity, 0)
  const totalCars = productsInCart.reduce((acc, item) => acc += 1 + parseInt((item.quantity - 1) / maxCapacity) , 0)
  const servicePrice = productsInCart.reduce((acc, prod) => acc += prod.services.reduce((serviceAcc, service) => serviceAcc += (service.checked ? 1:0) * prod.quantity * service.price , 0), 0)
  const deliveryDistance = parseInt(distance / 1000)
  const deliveryPrice = totalCars * (baseDeliveryPrice + pricePerKm * (deliveryDistance > 10 ? deliveryDistance: 0))



  useEffect(() => {
    
    Geocode.fromAddress(address).then(
      (response) => {
        const {location} = response.results[0].geometry
        if(response.results.length > 0) setDestination(location)
      },
      (error) => {
        console.error(error);
      }
    );
  }, [updateView])

  const onClick = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setDestination({lat: lat, lng: lng})

    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
    calcRoute()
  }

  const calcRoute = () => {

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result)
          setDistance(result.routes[0].legs[0].distance.value)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  useEffect(() => {
    if (window.google && destination) {
      calcRoute()
     }
  }, [destination])

  const handleSubmit = (userData) => {
    userData.id = user.id
    const orderDetails = {
      userData: userData,
      products: productsInCart,
      goods: goodsInCart.map(item => ({id: item.id, quantity: item.quantity, price: item.price})),
      destination: destination,
      distance: distance,
      deliveryPrice: deliveryPrice,
    }
    dispatch(placeOrder(orderDetails))
  }

  const refs = {}

  const onPlacesChanged = () => {
    const places = refs.searchBox.getPlaces();
    if(places.length === 0 || !places[0].hasOwnProperty("geometry")) return
    setAddress(places[0].formatted_address)
    const {location} = places[0].geometry
    if(places.length > 0) setDestination({lat: location.lat(), lng: location.lng()})
  }

  const onSearchBoxMounted = (ref) => {
    debugger
    refs.searchBox = ref;
  }

  return (
    <CheckoutContainer>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="page-header">
              Калькулятор вартості доставки
            </div>
            <div className="container">
              <div className="row justify-content-center">
                <Calculator
                  totalPrice={totalPrice}
                  totalCars={totalCars}
                  servicePrice={servicePrice}
                  deliveryDistance={deliveryDistance}
                  deliveryPrice={deliveryPrice}
                  />
                <div className="col-11 col-xl-5">
                  <div>
                    {!updateView &&
                      <StandaloneSearchBox
                        onLoad={onSearchBoxMounted}
                        onPlacesChanged={onPlacesChanged}
                        >
                        <input
                          type="text"
                          placeholder="Адреса доставки"
                          className="search-box"
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                        />
                      </StandaloneSearchBox>
                    }
                  </div>
                  <div className="map-container">
                    <MyMapComponent
                      isMarkerShown
                      setUpdateView={setUpdateView}
                      updateView={updateView}
                      directions={directions}
                      onClick={onClick}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="light" className="alert col-11 mx-auto">
              Вартість доставки розраховується за формулою: {baseDeliveryPrice} грн за кожну машину (одна машина може перевозити не більше {maxCapacity} куб. м. за одну поїздку), плюс {pricePerKm} грн за кожний кілометр маршруту якщо . Розрахована вартість може не відповідати дійсності. Деталі замовлення з вами узгодить менеджер.
            </Alert>
          </div>
        </div>
        <div className="section">
          <div className="page-header">
            Данні для оформлення замовлення
          </div>
          <User user={user} handleSubmitOrder={handleSubmit} address={address}/>
        </div>
      </div>
    </CheckoutContainer>
  )
}


const Calculator = (props) => {
  const {totalPrice, totalCars, servicePrice, deliveryDistance, deliveryPrice} = props

  return (
    <CalculatorContainer className="col-12 col-xl-6">
      <div className="card m-2 p-2">
        <TextRow text={"Орієнтовна відстань: "} value={deliveryDistance + " км"}/>
        <TextRow text={"Кількість машин: "} value={totalCars + " шт"} />
        <TextRow text={"Орієнтовна вартість доставки: "} value={"₴" + deliveryPrice}/>
        <TextRow text={"Вартість замовлення: "} value={"₴" + totalPrice}/>
        <TextRow text={"Додаткові послуги: "} value={"₴" + servicePrice}/>
        <TextRow addStyle="totals " text={"Загальна вартість: "} value={"₴" + Number(deliveryPrice + totalPrice + servicePrice).toLocaleString('ua')} />
      </div>
    </CalculatorContainer>
  )
}

const User = (props) => {
  let history = useHistory();
  const {user} = props
  const phoneRegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
  const schema = yup.object().shape({
    firstName: yup.string()
      .required("Введіть ім'я"),
    lastName: yup.string()
      .required("Введіть Прізвище"),
    phone: yup.string()
      .required("Введіть номер мобільного")
      .matches(phoneRegExp, 'Введений не корректний номер телефону'),
    address: yup.string(),
    email: yup.string(),
  });

  const handleSubmit = (obj) => {
    props.handleSubmitOrder(obj)
    history.push("/thanks");
  }

  return (
    <div className="container">
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.props.email,
          phone: user.props.phone,
          address: props.address,
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {!user.loggedIn ? <Alert variant="light" className="alert">Зареєструйтесь на сайті щоб отримувати доступ до статусу замовлень</Alert>:null}
            <Row className="justify-content-center">
              <StyledFormGroup as={Col} md="5" controlid="validationFormikFirstName">
                <Form.Label className="propName">Ім'я</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  value={values.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                  isValid={touched.firstName && !errors.firstName}
                />
                <StyledFeedback type="invalid">
                  {errors.firstName}
                </StyledFeedback>
              </StyledFormGroup>
              <StyledFormGroup as={Col} md="5" controlid="validationFormikLastName">
                <Form.Label className="propName">Прізвище</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                  isValid={touched.lastName && !errors.lastName}
                />
                <StyledFeedback type="invalid">
                  {errors.lastName}
                </StyledFeedback>
              </StyledFormGroup>
            </Row>
            <Row className="justify-content-center">
              <StyledFormGroup as={Col} md="5" controlid="validationFormikPhone">
                <Form.Label className="propName">Телефон</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Телефон"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  isValid={touched.phone && !errors.phone}
                />
                <StyledFeedback type="invalid">
                  {errors.phone}
                </StyledFeedback>
              </StyledFormGroup>
              <StyledFormGroup as={Col} md="5" controlid="validationFormikEmail">
                <Form.Label className="propName">E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  isValid={touched.email && !errors.email}
                />
                <StyledFeedback type="invalid">
                  {errors.email}
                </StyledFeedback>
              </StyledFormGroup>
            </Row>
            <Row className="justify-content-center">
              <StyledFormGroup as={Col} md="8" controlid="validationFormikAddress">
                <Form.Label className="propName">Адреса доставки</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Адреса"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  isValid={touched.address && !errors.address}
                />
                <StyledFeedback type="invalid">
                  {errors.address}
                </StyledFeedback>
              </StyledFormGroup>
            </Row>
            <Button className="m-4" type="submit">Замовлення підтверджую</Button>
          </Form>
        )}
      </Formik>
    </div>
  )

  // return (
  //   <div>
  //     {!user.loggedIn ? <Alert variant="light" className="alert">Зареєструйтесь на сайті щоб отримувати доступ до статусу замовлень</Alert>:null}
  //     <UserField name="Телефон" value={phone} id="phone"  type="number" onChange={(newPhone) => {mSetPhone(newPhone)}} onKeyPress={handleContactInfoKeyPress} />
  //     <div className="d-flex flex-column flex-lg-row justify-content-center">
  //       <UserField name="Ім'я" value={firstName} id="firstName" type="text" onChange={(newFirstName) => {mSetFirstName(newFirstName)}} onKeyPress={handleUserDataKeyPress} />
  //       <UserField name="Прізвище" value={lastName} id="lastName" type="text" onChange={(newLastName) => {mSetLastName(newLastName)}} onKeyPress={handleUserDataKeyPress} />
  //     </div>
  //     <div className="d-flex flex-column flex-lg-row justify-content-center">
  //       <UserField name="Пошта" value={email} id="email" type="email" onChange={(newEmail) => {mSetEmail(newEmail)}} onKeyPress={handleContactInfoKeyPress} />
  //       <UserField name="Адреса" value={address} id="address"  type="text" onChange={(newAddress) => {mSetAddress(newAddress)}} onKeyPress={handleContactInfoKeyPress} />
  //     </div>
  //     <Button className="m-4">
  //       Замовлення підтверджую
  //     </Button>
  //   </div>
  // )
}


const TextRow = (props) => {
  return (
    <div className={props.addStyle + " text-field row"}>
      <div className="col-8">
        {props.text}
      </div>
      <div className="col-4">
        {props.value}
      </div>
    </div>
  )
}

const MyMapComponent = (props) => {
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 50.422516, 
    lng: 25.804742 
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.googleMapsApiKey
  })

  const renderMap = () => {
    return (
      <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={containerStyle}
          onClick={props.onClick}
        >
        {props.isMarkerShown && <Marker position={{ lat: 50.422516, lng: 25.804742 }} />}
        {/* {props.updateView && props.setUpdateView(false)} */}
        <DirectionsRenderer
          directions={props.directions}
        />
      </GoogleMap>)
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? renderMap() : <div>Loading...</div>
}

  


const CheckoutContainer = styled.div`

  .search-box{
    box-sizing: border-box;
    border: 1px solid transparent;
    width: 380px;
    max-width: 640px;
    height: 32px;
    padding: 0 12px;
    margin: 0 0 10px 0;
    border-radius: 3px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    outline: none;
    text-overflow: ellipses;
  }

  .map-container{
    border-radius: 1vmin;
    padding: 1vmin;
    background: var(--darkGrey)
  }

  .card{
    background: var(--cardBackground);
  }

  .alert{
    margin: 2vmin;
    font-size: 2vmin;
  }

  .page-header{
    font-size: 4vmin;
  }
  .section{
    background: rgba(0,0,0,0.1);
    border-radius: 2vmin;
    margin: 1vmin;
    padding: 1vmin;
  }
`

const CalculatorContainer = styled.div`

  .text-field {
    font-size: calc(10px + 1.5vmin);
    padding: 0 12px;
    text-align: left;
  }

  .totals{
    font-weight: bold;
  }
`

const StyledFeedback = styled(Form.Control.Feedback)`
  font-size: var(--smallFontSize);
`

const StyledFormGroup = styled(Form.Group)`
  justify-content: center;
  margin: calc(10px + 1vw);
  background: rgb(150,200,200);
  border-radius: 0.7rem;

  .propName{
    width: 30vmin;
    display: inline-block;
  }

  .inline-block{
    display: inline-block;
    background: rgb(150,200,200);
    border-radius: 1rem;
  }
`
