import React from 'react';
import ReactDOM from 'react-dom';
import Passwordless from '@authentication/react-passwordless';

const csrfToken = document
  .querySelector('[data-csrf]')
  .getAttribute('data-csrf');

function PasswordReset() {
  return (
    <Passwordless
      createToken={async email => {
        const response = await fetch('/auth/passwordless/create-token', {
          headers: {
            'csrf-token': csrfToken,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({email, redirectURL: '/change-password'}),
        });
        return await response.json();
      }}
      verifyPassCode={async passCode => {
        const response = await fetch('/auth/passwordless/verify-pass-code', {
          headers: {
            'csrf-token': csrfToken,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({passCode}),
        });
        return await response.json();
      }}
      onPassCodeVerified={async email => {
        location.replace('/change-password');
      }}
    />
  );
}
const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<PasswordReset />, div);
