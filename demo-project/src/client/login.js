import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'react-final-form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const csrfToken = document
  .querySelector('[data-csrf]')
  .getAttribute('data-csrf');

function Login() {
  return (
    <Form
      onSubmit={() => {}}
      render={({handleSubmit, invalid}) => (
        <form
          onSubmit={invalid ? handleSubmit : undefined}
          action="/login"
          method="post"
        >
          <input type="hidden" name="_csrf" value={csrfToken} />
          <EmailField />
          <PasswordField isRegister={false} />

          <button type="submit">Login</button>
          <a href="/register">(Sign Up instead)</a>
          <a href="/password-reset">Forgotten Password?</a>
        </form>
      )}
    />
  );
}
const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<Login />, div);
