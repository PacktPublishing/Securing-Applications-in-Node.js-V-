import nav from './_nav';

export default function home({username, posts}) {
  return `
    ${nav({username})}
    <ul>
      ${posts
        .map(
          post =>
            `
              <li>
                <strong>${post.authorUsername}</strong>
                <div>${post.body}</div>
              </li>
            `,
        )
        .join('\n')}
    </ul>
    ${
      username
        ? `
            <form action="/add-post" method="post">
              <textarea name="body"></textarea>
              <button type="submit">Add Post</button>
            </form>
          `
        : ``
    }
  `;
}
