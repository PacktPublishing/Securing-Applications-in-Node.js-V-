import React from 'react';
import Nav from './_nav';

export default function Login({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <form action="/login" method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <label>
          <span>username</span>
          <input type="text" name="username" />
        </label>
        <label>
          <span>password</span>
          <input type="password" name="password" />
        </label>
        <button type="submit">Log In</button>
      </form>
    </React.Fragment>
  );
}
