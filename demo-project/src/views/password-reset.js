import React from 'react';
import Nav from './_nav';

export default function PasswordReset({csrfToken}) {
  return (
    <React.Fragment>
      <Nav csrfToken={csrfToken} />
      <form action="/auth/facebook" method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button type="submit">Login With Facebook</button>
      </form>
      <script src="static/js/password-reset.js" data-csrf={csrfToken} />
    </React.Fragment>
  );
}
