/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import '../styles/Login/loginStyles.scss';

// Redux stuff
import { connect } from 'react-redux';
import { addInfo, createUser } from '../redux/actions/userActions';
import { clearErrors } from '../redux/actions/dataActions';

function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmedPassword: '',
    errors: {}
  });

  // - =========== HANDLE SIGN IN =============
  const handleSubmit = event => {
    event.preventDefault();
    props.addUserInfo(loginInfo);
  };

  //  - ================= HANDLE FIELD CHANGE ===============
  const handleChange = event => {
    setLoginInfo({
      ...loginInfo,
      [event.target.name]: event.target.value
    });
  };

  // - ================== HANDLE USER CREATION ==============
  const handleSubmitCreateUser = event => {
    event.preventDefault();
    props.newUser(loginInfo);
  };

  //  - ============== USED FOR SIGN IN SLIDE ===============
  useEffect(() => {
    const signUpButton = document.getElementById('overlay-right__button');
    const signInButton = document.getElementById('overlay-left__button');
    const container = document.getElementById('form-wrapper');

    signUpButton.addEventListener('click', () => {
      // * Clears errors on animation
      props.clearErrors();
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      // * Clears errors on animation
      props.clearErrors();
      container.classList.remove('right-panel-active');
    });
  }, []);

  return (
    <div id="login-page">
      <div id="form-wrapper">
        {/* // - ================== Sign up ================== */}
        <div className="form-container sign-up-container">
          <form
            className="form-container__credentials"
            onSubmit={handleSubmitCreateUser}
          >
            <h1>Create Account</h1>
            {Object.values(props.errors).length > 0
              ? Object.values(props.errors).map((err, i) => (
                  // eslint-disable-next-line react/jsx-indent
                  <div key={i}>
                    <small style={{ color: 'red' }}>{err}</small>
                    <hr />
                  </div>
                ))
              : ''}
            {Object.values(props.alerts).length > 0
              ? Object.values(props.alerts).map((alert, i) => (
                  // eslint-disable-next-line react/jsx-indent
                  <div key={i}>
                    <small style={{ color: 'green' }}>{alert}</small>
                    <hr />
                  </div>
                ))
              : ''}

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={loginInfo.username}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={loginInfo.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={loginInfo.password}
            />
            <input
              type="password"
              name="confirmedPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={loginInfo.confirmedPassword}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        {/* // - ================== Sign in ================== */}
        <div className="form-container sign-in-container">
          <form className="form-container__credentials" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            {Object.values(props.errors).length > 0
              ? Object.values(props.errors).map((err, i) => (
                  // eslint-disable-next-line react/jsx-indent
                  <div key={i}>
                    <small style={{ color: 'red' }}>{err}</small>
                    <hr />
                  </div>
                ))
              : ''}
            <input
              onChange={handleChange}
              value={loginInfo.username}
              name="username"
              type="text"
              placeholder="Username"
            />
            <input
              onChange={handleChange}
              value={loginInfo.password}
              name="password"
              type="password"
              placeholder="Password"
            />
            <Link to="/password-recovery">Forgot your password?</Link>
            <button type="submit">Sign In</button>
          </form>
        </div>
        {/* // - ================== OVERLAY ================== */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay__panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button type="submit" className="ghost" id="overlay-left__button">
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>
                To start helping others and ask questions please create an
                account.
              </p>
              <button
                type="submit"
                className="ghost"
                id="overlay-right__button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  addUserInfo: PropTypes.func.isRequired,
  newUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  alerts: PropTypes.object
};

const mapStateToProps = state => {
  return {
    username: state.user.username,
    errors: state.UI.errors,
    alerts: state.UI.alerts
  };
};

const mapActionsToProps = {
  addUserInfo: addInfo,
  newUser: createUser,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Login);
