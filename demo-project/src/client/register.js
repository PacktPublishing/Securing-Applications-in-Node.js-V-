import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'react-final-form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const csrfToken = document
  .querySelector('[data-csrf]')
  .getAttribute('data-csrf');

function Register() {
  return (
    <Form
      onSubmit={() => {}}
      render={({handleSubmit, invalid}) => (
        <form
          onSubmit={invalid ? handleSubmit : undefined}
          action="/register"
          method="post"
        >
          <input type="hidden" name="_csrf" value={csrfToken} />
          <EmailField />
          <PasswordField isRegister={true} />

          <button type="submit">Sign Up</button>
          <a href="/login">(Login instead)</a>
        </form>
      )}
    />
  );
}
const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<Register />, div);
