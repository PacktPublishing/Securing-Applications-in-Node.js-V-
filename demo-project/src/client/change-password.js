import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'react-final-form';
import PasswordField from './PasswordField';

const csrfToken = document
  .querySelector('[data-csrf]')
  .getAttribute('data-csrf');

function ChangePassword() {
  return (
    <Form
      onSubmit={() => {}}
      render={({handleSubmit, invalid}) => (
        <form
          onSubmit={invalid ? handleSubmit : undefined}
          action="/change-password"
          method="post"
        >
          <input type="hidden" name="_csrf" value={csrfToken} />
          <PasswordField isRegister={true} />

          <button type="submit">Set New Password</button>
        </form>
      )}
    />
  );
}
const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<ChangePassword />, div);
