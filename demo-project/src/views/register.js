import React from 'react';
import Nav from './_nav';

export default function register({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <form action="/register" method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <label>
          <span>username</span>
          <input type="text" name="username" />
        </label>
        <label>
          <span>password</span>
          <input type="password" name="password" />
        </label>
        <label>
          <span>password confirmation</span>
          <input type="password" name="passwordConfirmation" />
        </label>
        <button type="submit">Register</button>
      </form>
    </React.Fragment>
  );
}
