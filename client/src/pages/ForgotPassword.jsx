import React, { useState } from 'react';
import { connect } from 'react-redux';

import { recoverPassword } from '../redux/actions/userActions';
import { clearErrors } from '../redux/actions/dataActions';
import '../styles/Recover/forgotPassword.scss';

function ForgotPassword(props) {
  const [recoveryFormInfo, setRecoveryFormInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const onChangeRecoveryForm = e => {
    setRecoveryFormInfo({
      ...recoveryFormInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSendRecover = e => {
    e.preventDefault();
    props.recoverPassword(recoveryFormInfo);
  };

  return (
    <div id="recover-page">
      <div id="recover__container">
        <a href="/">Home</a>
        {props.errors.length > 0
          ? props.errors.map((err, key) => (
              <div key={key} id="recover__error">
                <h5>{err}</h5>
                <hr />
              </div>
            ))
          : null}
        {Object.values(props.alerts).length > 0
          ? Object.values(props.alerts).map((alert, key) => (
              <div key={key} id="recover__error">
                <h5 style={{ color: 'green' }}>{alert}</h5>
                <hr />
              </div>
            ))
          : null}
        <form id="recover__form" onSubmit={handleSendRecover}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={onChangeRecoveryForm}
            value={recoveryFormInfo.username}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={onChangeRecoveryForm}
            value={recoveryFormInfo.email}
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            onChange={onChangeRecoveryForm}
            value={recoveryFormInfo.password}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            onChange={onChangeRecoveryForm}
            value={recoveryFormInfo.confirmPassword}
          />
          <button type="submit">Recover</button>
        </form>
      </div>
    </div>
  );
}

const mstp = state => ({
  errors: state.UI.errors,
  alerts: state.UI.alerts
});

const matp = {
  recoverPassword,
  clearErrors
};

export default connect(
  mstp,
  matp
)(ForgotPassword);
