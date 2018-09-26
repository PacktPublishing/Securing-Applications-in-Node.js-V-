import React from 'react';
import Nav from './_nav';

export default function Login({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <script src="static/js/login.js" data-csrf={csrfToken} />
    </React.Fragment>
  );
}
