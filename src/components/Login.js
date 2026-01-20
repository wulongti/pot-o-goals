import React from "react";
import "../sass/login.scss";
//import PropTypes from "props";

const Login = ({authenticate}) => (
    <nav className="login">
        <h2 className="login__headline">Log In To Get Started</h2>
        <button
            className="login__button google"
            onClick={()=>{authenticate("Google")}}>
            Login with Google
        </button>
        <button
            className="login__button facebook"
            onClick={()=>{authenticate("Facebook")}}>
            Login with Facebook
        </button>
    </nav>
);

// Login.propTypes = {
//     authenticate: PropTypes.func.isRequired,
// }

export default Login;