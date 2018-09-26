import React from 'react';
import Nav from './_nav';

export default function register({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <script src="static/js/register.js" data-csrf={csrfToken} />
    </React.Fragment>
  );
}
