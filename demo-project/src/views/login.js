import nav from './_nav';

export default function login({username}) {
  return `
    ${nav({username})}
    <form action="/login" method="post">
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
