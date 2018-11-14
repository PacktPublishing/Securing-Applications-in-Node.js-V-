import React from 'react';
import Nav from './_nav';

export default function VerifyTwoFactorAuth({username, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <form action="/2-factor-auth/verify" method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input type="tel" name="token" />
        <button type="submit">Verify Code</button>
      </form>
    </React.Fragment>
  );
}
