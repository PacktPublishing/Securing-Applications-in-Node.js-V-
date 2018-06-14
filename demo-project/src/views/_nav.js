export default function nav({username, csrfToken}) {
  return `
    <link rel="stylesheet" href="style.css" />
    <nav>
      <a href="/">Example App</a>
    ${
      username
        ? `
            <form action="/logout" method="post">
              <input type="hidden" name="_csrf" value="${csrfToken}" />
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
