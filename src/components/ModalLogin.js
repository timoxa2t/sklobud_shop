import {useState} from 'react'
import styled from 'styled-components'
import {useSelector, useDispatch} from 'react-redux'
import {loginHandler, signUpHandler, loginViaGoogle} from '../store/actions/user'
import {setShowModal} from '../store/actions/display'
import { useCookies } from 'react-cookie'
import { Form , Row, Col, InputGroup, Button} from 'react-bootstrap';
import { Formik } from 'formik';
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import {refreshTokenSetup} from '../services/Google'
import * as yup from 'yup'

const SIGN_IN = "SIGN_IN"
const SIGN_UP = "SIGN_UP"
const clientId = "456710911666-ssl7bpd2rpbjej12em4mljld58hue8rm.apps.googleusercontent.com"

export default function ModalLogin() {
    const showModal = useSelector((store) => store.display.showModal)
    const errorMessage = useSelector((store) => store.display.loginErrorMessage)
    const [container, setContainer] = useState(SIGN_IN)


    return showModal ?
      (
      <ModalContainer>

        <div className="d-flex flex-column" id="modal">
          {errorMessage ?
            <div className="error-container">
              <div className="p-2">
                {errorMessage}
              </div>
            </div>
          : null}
          <div className="form-container">
            {(() => {
              switch (container) {
                case SIGN_IN:
                  return <SignInContainer changeContainer={setContainer}/>
                case SIGN_UP:
                  return <SignUpContainer changeContainer={setContainer}/>
                default:
                  return <SignInContainer changeContainer={setContainer}/>
                }
              })()
            }
          </div>
        </div>

      </ModalContainer>
    ): null
}

const SignInContainer = (props) => {
  const dispatch = useDispatch()
  const changeContainer = props.changeContainer
  const setCookie = useCookies(['login', 'pwd'])[1];
  // const [login, setLogin] = useState("")
  // const [pwd, setPwd] = useState("")
  // const [remember, setRemember] = useState(true);

  const schema = yup.object().shape({
    login: yup.string().required(),
    pwd: yup.string().required(),
    remember: yup.bool(),
  });

  const onSignIn = (obj) => {
    const {login, pwd, remember} = obj
    if(remember){
      setCookie("login", login, {path: '/', sameSite:'Strict'})
      setCookie("pwd", pwd, {path: '/', sameSite:'Strict'})
    }
    dispatch(loginHandler(login, pwd, remember))
  }

  const onGoogleSignIn = (obj) => {
    dispatch(loginViaGoogle(obj))
  }

  return(
    <Formik
      validationSchema={schema}
      onSubmit={onSignIn}
      initialValues={{
        login: '',
        pwd: '',
        remember: false,
      }}>
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
            <div className="header-container">
              <button
                className="close-btn"
                onClick={() => {dispatch(setShowModal(false))}}>
                  <i className="far fa-window-close"></i>
              </button>
              <div className="window-title">
                Увійти в особистий кабінет
              </div>
            </div>
            <Row className="mb-3">
              <Form.Group as={Col} controlid="validationFormik01">
                <Form.Control
                  type="text"
                  name="login"
                  value={values.login}
                  onChange={handleChange}
                  isValid={touched.login && !errors.login}
                  isInvalid={!!errors.login}
                  placeholder="Телефон або пошта"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlid="validationFormik02">
                <Form.Control
                  type="password"
                  name="pwd"
                  value={values.pwd}
                  onChange={handleChange}
                  isValid={touched.pwd && !errors.pwd}
                  isInvalid={!!errors.pwd}
                  placeholder="Пароль"
                />

              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                name="remember"
                label="Запам'ятати мене"
                onChange={handleChange}
                isInvalid={!!errors.remember}
                feedback={errors.remember}
                feedbackType="invalid"
                id="validationFormik0"
              />
            </Form.Group>
            <Button type="submit">Увійти</Button>
            <Login onGoogleSignIn={onGoogleSignIn}/>
            <div className="buttonContainer">
                <div className="text-center question-text">Не маєте аккаунт? <Button variant="link" onClick={() => {changeContainer(SIGN_UP); return false}}>Створити</Button></div>
            </div>
          </Form>
        )}
      </Formik>
  )
 
}

const SignUpContainer = (props) => {
  const dispatch = useDispatch()
  const changeContainer = props.changeContainer

  // const [email, setEmail] = useState("")
  // const [pwd, setPwd] = useState("")
  // const [confirmPwd, setСonfirmPwd] = useState("")
  // const [name, setName] = useState("")
  // const [phone, setPhone] = useState("")
  // const [lastName, setLastName] = useState("")
  const phoneRegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/


  const handleSubmit = (obj) => {
    const {phone, email, pwd, firstName, lastName} = obj
    dispatch(signUpHandler(phone, email, pwd, firstName, lastName))
  }

  const schema = yup.object().shape({
    firstName: yup.string()
      .required("Введіть ім'я"),
    lastName: yup.string()
      .required("Введіть Прізвище"),
    pwd: yup.string()
      .required("Введіть пароль")
      .min(8, "Мінімальна довжина паролю 8 символів"),
    confirmPwd: yup.string()
      .required("Підтвердіть пароль")
      .oneOf([yup.ref('pwd'), null], 'Паролі не співпадають'),
    email: yup.string()
      .email()
      .required("Введіть адресу елекронної пошти"),
    phone: yup.string()
      .required("Введіть номер телефону")
      .matches(phoneRegExp, 'Введений не корректний номер телефону'),
  });

  return(
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        firstName: '',
        lastName: '',
        pwd: '',
        confirmPwd: '',
        email: '',
        phone: '',
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
          <div className="header-container">
            <button
              className="close-btn"
              onClick={() => {dispatch(setShowModal(false))}}>
                <i className="far fa-window-close"></i>
            </button>
            <div className="window-title">
              Створити новий аккаунт
            </div>
          </div>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlid="validationFormik01">
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
            </Form.Group>
            <Form.Group as={Col} md="6" controlid="validationFormik02">

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
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlid="validationFormikUsername">

              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Пароль"
                  name="pwd"
                  value={values.pwd}
                  onChange={handleChange}
                  isInvalid={!!errors.pwd}
                  isValid={touched.pwd && !errors.pwd}
                />
                <StyledFeedback type="invalid">
                  {errors.pwd}
                </StyledFeedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="6" controlid="validationFormik03">

              <Form.Control
                type="password"
                placeholder="Підтвердіть пароль"
                name="confirmPwd"
                value={values.confirmPwd}
                onChange={handleChange}
                isInvalid={!!errors.confirmPwd}
                isValid={touched.confirmPwd && !errors.confirmPwd}
              />

              <StyledFeedback type="invalid">
                {errors.confirmPwd}
              </StyledFeedback>
            </Form.Group>

          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlid="validationFormik04">
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
            </Form.Group>
            <Form.Group as={Col} md="6" controlid="validationFormik05">
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
            </Form.Group>
          </Row>
          <Button type="submit">Зареєструватись</Button>
            <div className="buttonContainer">
                <div className="text-center question-text">Маєте аккаунт? <Button variant="link" onClick={() => {changeContainer(SIGN_IN); return false}}>Увійти</Button></div>
            </div>
        </Form>
      )}
    </Formik>
  )
}

const Login = (props) => {
  const {dispatch} = props
  const onSuccess = (res) => {
    console.log("login success: ", res.profileObj)
    props.onGoogleSignIn(res.profileObj)

    refreshTokenSetup(res)
  }

  const onFailure = (res) => {
    console.log("login failed: ", res)
  }

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Вхід"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  )
}

const Logout = () => {
    const onSuccess = (res) => {
      alert("Успішний вихід")
    }

    return (
      <div>
        <GoogleLogout
          clientId={clientId}
          buttonText="Вихід"
          onLogoutSuccess={onSuccess}
        >
        </GoogleLogout>
      </div>
    )
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: start;
  justify-content: flex-end;


  #modal {
    background: var(--mainBackground);
    border-radius: 1vmin;
    margin: 10vmin;
    box-shadow: 0px 0px 4vmin #000;
  }

  .form-container{
    padding: 2vmin;
  }

  .inputContainer{
    margin: 1vmin;
  }

  .buttonContainer{
    margin-bottom: 2vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
  }

  .question-text{
    font-size: 1rem;
  }

  .close-btn {

    position: absolute;
    top: -1vmin;
    right: -1vmin;
    border: none;
    background: var(--mainBackground);
    color: var(--textColor);
  }

  .header-container{
    position: relative;

  }

  .error-container{
    font-size: 2vmin;
    background: rgba(255,0,0,0.3);
    border-radius: 1vmin 1vmin 0 0;

  }

  .window-title{
    padding-left: 5vmin;
    padding-right: 5vmin;
  }


`

const StyledFeedback = styled(Form.Control.Feedback)`
  font-size: var(--smallFontSize);
`
