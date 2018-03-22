export default function nav({username}) {
  return `
    <link rel="stylesheet" href="style.css" />
    <nav>
      <a href="/">Example App</a>
    ${
      username
        ? `
            <form action="/logout" method="post">
              <button type="submit">Logout</button>
            </form>
          `
        : `
            <div>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
        `
    }
    </nav>
  `;
}