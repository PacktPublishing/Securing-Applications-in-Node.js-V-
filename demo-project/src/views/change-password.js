import React from 'react';
import Nav from './_nav';

export default function ChangePassword({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <script src="static/js/change-password.js" data-csrf={csrfToken} />
    </React.Fragment>
  );
}
