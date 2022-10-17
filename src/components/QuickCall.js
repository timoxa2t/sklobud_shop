import {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useSelector, useDispatch} from 'react-redux'
import { setQuickCall} from '../store/actions/display'
import {callMeBackHandler} from '../store/actions/user'
import { Form , Button} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup'

const BUTTON_VIEW = "BUTTON"
const FORM_VIEW = "FORM"

export default function QuickCall() {
    const showModal = useSelector((store) => store.display.quickCall)
    const [container, setContainer] = useState(FORM_VIEW)
    const dispatch = useDispatch()

    useEffect(() => {
      setTimeout(() => {dispatch(setQuickCall(true))}, 30000)
    },[dispatch])

    return showModal ?
      (
      <ModalContainer>

        <div className="d-flex flex-column">
            {(() => {
              switch (container) {
                case BUTTON_VIEW:
                  return <ButtonView changeContainer={setContainer}/>
                case FORM_VIEW:
                  return <FormView changeContainer={setContainer}/>
                default:
                  return <ButtonView changeContainer={setContainer}/>
                }
              })()
            }
        </div>

      </ModalContainer>
    ): null
}

const ButtonView = (props) => {
  const changeContainer = props.changeContainer

  const clickHandler = (e) => {
    changeContainer(FORM_VIEW)
  }

  return(
    <button onClick={clickHandler} className="call-button">
      <i className="fas fa-solid fa-headset fa-2x"></i>
    </button>
  )

}

const FormView = (props) => {
  const dispatch = useDispatch()
  const changeContainer = props.changeContainer

  const phoneRegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

  const handleSubmit = (obj) => {
    const {phone} = obj
    dispatch(callMeBackHandler(phone))
  }

  const schema = yup.object().shape({
    phone: yup.string()
      .required("Введіть номер телефону")
      .matches(phoneRegExp, 'Введений не корректний номер телефону'),
  });

  return(
    <div className="phone-form">
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
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
                onClick={() => {changeContainer(BUTTON_VIEW)}}>
                  <i className="far fa-window-close"></i>
              </button>
              <div className="window-title">
                Залиште свій телефон і ми відповімо на всі ваші питання
              </div>
            </div>
              <Form.Group className="phone-field" controlid="validationFormik05">
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
            <Button type="submit">Перетелефонуйте мені</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const ModalContainer = styled.div`
  position: fixed;
  right: 3vw;
  bottom: 3vw;
  max-width: calc(100% - 6vw);
  z-index: 10000;
  display: flex;
  align-items: end;
  justify-content: flex-end;


  .form-container{
    padding: 2vmin;
  }

  .phone-form{
    padding: 1vw;
    background: var(--mainBackground);
    border-radius: 1vmin;
    box-shadow: 0px 0px 4vmin #000;
  }

  .phone-field{
    padding: 1vw;
  }

  .call-button{
    color: var(--textWhite) !important;
    background-color: rgba(20, 30, 50, 0.2);
    border:  2px solid #4CAF50;
    padding: calc(5px + 0.5vw);
    border-radius: 50%;
    transition: all 0.2s linear;
  }

  .inputContainer{
    margin: 1vmin;
  }


  .close-btn {
    background-color: rgba(0,0,0,0);
    position: absolute;
    top: -1vmin;
    right: -1vmin;
    border: none;
    color: var(--textColor);
  }

  .call-button:hover{
    transform: scale(1.2);
  }

  .header-container{

    position: relative;
  }

  .window-title{
    padding-left: 5vmin;
    padding-right: 5vmin;
  }


`

const StyledFeedback = styled(Form.Control.Feedback)`
  font-size: var(--smallFontSize);
`
