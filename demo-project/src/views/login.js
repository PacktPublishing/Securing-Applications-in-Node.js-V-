import nav from './_nav';

export default function login({username, csrfToken}) {
  return `
    ${nav({username, csrfToken})}
    <form action="/login" method="post">
      <input type="hidden" name="_csrf" value="${csrfToken}" />
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
  `;
}
