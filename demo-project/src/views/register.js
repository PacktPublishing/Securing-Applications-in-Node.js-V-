import nav from './_nav';

export default function register({username}) {
  return `
    ${nav({username})}
    <form action="/register" method="post">
      <label><span>username</span><input type="text" name="username" /></label>
      <label><span>password</span><input type="password" name="password" /></label>
      <label><span>password confirmation</span><input type="password" name="passwordConfirmation" /></label>
      <button type="submit">Register</button>
    </form>
  `;
}
