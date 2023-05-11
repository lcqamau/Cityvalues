/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch, withRouter } from "react-router-dom";
import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import Footer from './js/components/Footer';
import RegisterPage from './js/pages/RegisterPage';
import Chaussures from './js/pages/Chaussures';
import Panier from './js/pages/Panier';
import Produit from './js/pages/Produit';
import PrivateRoute from "./js/components/PrivateRoute";
import AuthContext from "./js/contexts/AuthContext";
import stock from './js/pages/stock';
import HomePage from './js/pages/HomePage';
import LoginPage from './js/pages/LoginPage';
import authAPI from './js/services/authAPI';
import ProfilPage from './js/pages/profil';
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import jwtDecode from 'jwt-decode';




authAPI.setup();

const App = () =>{

    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    var token = localStorage.getItem("authToken");
  
    if (token) {
      var decodedToken = jwtDecode(token);
      if (decodedToken.roles[0] === "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    }
  
    },[isAuthenticated]);
  
    const AdminRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated && isAdmin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );

    console.log(isAuthenticated);

    const NavbarWithRouter = withRouter(Navbar);

    return( 
    <AuthContext.Provider value={{
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated
    }}>
    <HashRouter>
        <NavbarWithRouter isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} />
        <main>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <PrivateRoute path="/profil" component={ProfilPage}/>
                <AdminRoute path="/stock" component={stock}/>
                <AdminRoute path="/Produit" component={Produit}/>
                <PrivateRoute path="/Chaussures" component={Chaussures}/>
                <PrivateRoute path="/Panier" component={Panier}/>                  
                <Route path="/" component={HomePage}/>
            </Switch>
        </main>
    </HashRouter>
    <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </AuthContext.Provider>
  );
};
const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);

