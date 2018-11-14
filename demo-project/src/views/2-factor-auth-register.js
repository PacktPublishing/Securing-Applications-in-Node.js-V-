import React from 'react';
import Nav from './_nav';

export default function RegisterTwoFactorAuth({
  username,
  csrfToken,
  qrCode,
  secret,
}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <form action="/2-factor-auth/register" method="post">
        <img width={200} height={200} src={qrCode} />
        <p>{secret}</p>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input type="hidden" name="secret" value={secret} />
        <input type="tel" name="token" />
        <button type="submit">Verify Code</button>
      </form>
    </React.Fragment>
  );
}
