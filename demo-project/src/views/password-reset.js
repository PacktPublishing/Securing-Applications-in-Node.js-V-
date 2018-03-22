import React from 'react';
import Nav from './_nav';

export default function PasswordReset({csrfToken}) {
  return (
    <React.Fragment>
      <Nav csrfToken={csrfToken} />
      <script src="static/js/password-reset.js" data-csrf={csrfToken} />
    </React.Fragment>
  );
}
