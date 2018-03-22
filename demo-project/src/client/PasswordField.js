import React from 'react';
import {Field} from 'react-final-form';

function validatePassword(isRegister) {
  return value => {
    if (!value) {
      return isRegister
        ? 'Please choose a password'
        : 'Please enter your password';
    }
    if (
      isRegister &&
      (value.length < 5 ||
        !/[a-z]/.test(value) ||
        !/[A-Z]/.test(value) ||
        !/[^a-z]/i.test(value))
    ) {
      return 'Your password must meet all the requirements';
    }
  };
}
export const isValidPassword = value => !validatePassword(true)(value);
function Requirement({met, message, isRegister}) {
  if (!isRegister) {
    return <li>{message}</li>;
  }
  return (
    <p>
      <span style={{color: met ? 'green' : 'red'}}>{met ? '✔' : '✘'}</span>{' '}
      {message}
    </p>
  );
}
export default class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showing: props.isRegister};
    this._toggleVisibility = () => {
      this.setState(s => ({showing: !s.showing}));
    };
  }
  render() {
    return (
      <Field name="password" validate={validatePassword(this.props.isRegister)}>
        {({input, meta}) => (
          <React.Fragment>
            <label style={{display: 'flex', alignItems: 'center'}}>
              <div style={{marginRight: '1em', width: '5em'}}>Password</div>{' '}
              <input
                style={{flexGrow: 1, marginRight: '1em'}}
                {...input}
                type={this.state.showing ? 'text' : 'password'}
                placeholder="Password..."
                autocomplete="off"
              />{' '}
              {meta.error &&
                meta.touched && (
                  <div style={{color: 'red', marginRight: '1em'}}>
                    {meta.error}
                  </div>
                )}{' '}
              <button type="button" onClick={this._toggleVisibility}>
                {this.state.showing ? 'hide' : 'show'} passord
              </button>
            </label>
            <div style={{marginBottom: '2em', marginLeft: '6em'}}>
              <Requirement
                isRegister={this.props.isRegister}
                met={input.value.length >= 5}
                message="Your password must contain at least 5 characters"
              />
              <Requirement
                isRegister={this.props.isRegister}
                met={/[a-z]/.test(input.value)}
                message="Your password must contain at least one lowercase letter"
              />
              <Requirement
                isRegister={this.props.isRegister}
                met={/[A-Z]/.test(input.value)}
                message="Your password must contain at least one uppercase letter"
              />
              <Requirement
                isRegister={this.props.isRegister}
                met={/[^a-z]/i.test(input.value)}
                message="Your password must contain at least one number or symbol"
              />
            </div>
          </React.Fragment>
        )}
      </Field>
    );
  }
}
