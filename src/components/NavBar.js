import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { useCookies } from 'react-cookie'
import cart_img from '../car_icon.png';
// import logo from '../logo.png'

import {setShowModal, DARK_THEME, WHITE_THEME, setCurrentTheme} from '../store/actions/display'
import {logOut, loginHandler} from '../store/actions/user'
import styled from 'styled-components'
import {Dropdown, Form} from 'react-bootstrap'

export default function NavBar(){
  const totalInCart = useSelector(store => store.product.totalInCart + store.goods.totalInCart)
  const currentTheme = useSelector(store => store.display.currentTheme)
  const loggedIn =  useSelector(store => store.user.loggedIn)
  const [cookies, setCookie] = useCookies(['login', 'pwd']);
  const dispatch = useDispatch()
  const size = useWindowSize()

  const navbarDivision = size.width < 1000 ? ["col-5","col-7"]: ["col-8","col-4"]



  if(!loggedIn && cookies.login && cookies.pwd){
    dispatch(loginHandler(cookies.login, cookies.pwd))
  }

  function useWindowSize() {

    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  const onLogOut = () => {
    setCookie("login", "", {path: '/'})
    setCookie("pwd", "", {path: '/'})
    dispatch(logOut())
  }

  const createMenu = () => {
    const menuItemsList = [
      <Link to="/products" className="nav-link card" key="products">Продукція</Link>,
      <Link to="/goods" className="nav-link card" key="goods">Товари</Link>,
      <Link to="/services" className="nav-link card" key="services">Послуги</Link>
    ]
    return size.width < 1000 ?
    <Dropdown>
      <Dropdown.Toggle as={MenuDropdown} variant="success" id="dropdown-basic">
        Menu
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown">
        {menuItemsList.map(item => (
          <Dropdown.Item key={item.key}>
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>:
    <>
    {menuItemsList.map(item =>
        item
    )}
    </>



  }

  return (
    <NavWrapper className="container-fluid">
      <div className="d-flex justify-content-between">
        <div className={"navbar justify-content-start " + navbarDivision[0]}>
          <Link to="/" className="nav-link" key="main">
            <LogoImage src="logo_blue.png" alt="Logo" />
            {/*<h1 className="Header-title">Sklobudresurs</h1>*/}
          </Link>
          {createMenu()}
        </div>

        <div className={"navbar justify-content-end " + navbarDivision[1]}>
          <Form className="pe-2 medium-text">
            <Form.Check
              type="switch"
              id="change-theme"
              label={currentTheme === WHITE_THEME ? "🌞":"🌜"}
              onChange={() => {
                dispatch(setCurrentTheme(currentTheme === WHITE_THEME ? DARK_THEME: WHITE_THEME))
              }}
            />
          </Form>
          <Link to="/cart" className="nav-link card" key="cart">
            <ImgWrapper>
              <img src={cart_img} alt="Корзина" />
              {totalInCart > 0 ? <div className="dot">{totalInCart}</div>: <></>}
            </ImgWrapper>
          </Link>
          <Dropdown>
            <Dropdown.Toggle as={UserDropdown} variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item key="profile">
                <Link to="/profile" className="dropdown-link">
                  <div>Профіль</div>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item key="orders">
                <Link to="/orders" className="dropdown-link">
                  <div>Замовлення</div>
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item key="sign-out">
                <div onClick={onLogOut}>
                  <i className="fa fa-sign-out"/>
                  Вийти
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </NavWrapper>
  )
}

const UserDropdown = React.forwardRef(({ children, onClick }, ref) => {
  const loggedIn =  useSelector(store => store.user.loggedIn)
  const dispatch = useDispatch()
  return (
    <DropdownWrapper  className="card"
      href=""
      ref={ref}
      onClick={(e) => {
      e.preventDefault();
      if(!loggedIn) {
        dispatch(setShowModal(true))
      }else{
        onClick(e);
      }
    }}>
    <i className="fas fa-user fa-2x"/>
  </DropdownWrapper>)
})

const MenuDropdown = React.forwardRef(({ children, onClick }, ref) => {
  return (
    <DropdownWrapper  className="card"
      href=""
      ref={ref}
      onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>
    <i className="fas fa-bars fa-2x"/>
  </DropdownWrapper>)
})

const DropdownWrapper = styled.a`
  padding: calc(5px + 0.7vw);
  font-size: calc(10px + 0.5vw);
  text-decoration: none;
  i{
    color: var(--textWhite) !important;
  }
`
//background-image: url("cementl-texture-small.jpg");
const NavWrapper = styled.nav`
  background-image: var(--backgroundTexture);
  background-repeat: repeat;
  padding: 0;
  .nav-link{
    color: var(--textWhite) !important;
    font-size: calc(10px + 1vw);
    text-decoration: none;

  }
  .dropdown-link{
    color: var(--textBlack) !important;
    text-decoration: none;
  }

  .card{
    background: rgba(20, 30, 50, 0.4);
    border-radius: 1rem;
    margin: 0.5vw;
  }

  .dropdown{
    border-radius: 1rem;
  }
`

const LogoImage = styled.img`
    height: calc(40px + 2vw);
}
`

const ImgWrapper = styled.div`
  position: relative;

  img{
    height: calc(20px + 2vw);
    pointer-events: none;
  }

  .dot {
  position: absolute;
  top: 80%;
  left: 80%;
  transform: translate(-50%, -50%);
  height: calc(10px + 1vw);
  width: calc(10px + 1vw);
  font-size: calc(9px + 0.7vw);
  background-color: #f00;
  border-radius: 50%;
  display: inline-block;
}
`
