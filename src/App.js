import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import {Switch, Route, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'


import NavBar       from './components/NavBar.js'
import Footer       from './components/Footer.js'
import Details      from './components/Details.js'
import Cart         from './components/Cart.js'
import Main         from './components/Main.js'
import ProductList  from './components/ProductList.js'
import GoodsList    from './components/GoodsList.js'
import ServicesList from './components/ServicesList.js'
import Profile      from './components/Profile.js'
import ModalLogin   from './components/ModalLogin'
import QuickCall    from './components/QuickCall'
import Checkout     from './components/Checkout'
import ThankYouPage from './components/ThankYouPage'
import OrdersList   from './components/OrdersList'


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const query = useQuery();
  const queryId = query.get("id")
  const currentTheme = useSelector(store => store.display.currentTheme)
  return (
      <div className={"app " + currentTheme}>
          <NavBar/>
          <div className="app_content">
            <Switch>
              <Route path="/" exact           component={Main}/>
              <Route path="/cart"             component={Cart}/>
              <Route path="/details"          component={Details}/>
              <Route path="/products"         component={queryId == null ? ProductList: Details}/>
              <Route path="/goods"            component={queryId == null ? GoodsList: Details}/>
              <Route path="/services"         component={queryId == null ? ServicesList: Details}/>
              <Route path="/profile"          component={Profile}/>
              <Route path="/checkout"         component={Checkout}/>
              <Route path="/thanks"           component={ThankYouPage}/>
              <Route path="/orders"           component={OrdersList}/>
            </Switch>
          </div>
          <Footer />
          <ModalLogin/>
          <QuickCall/>
      </div>
  );
}

export default App;
