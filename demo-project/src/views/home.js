import React from 'react';
import Nav from './_nav';

export default function Home({username, posts, csrfToken}) {
  return (
    <React.Fragment>
      <Nav username={username} csrfToken={csrfToken} />
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <strong>{post.authorUsername}</strong>
            <div>{post.body}</div>
          </li>
        ))}
      </ul>
      {username ? (
        <form action="/add-post" method="post">
          <input type="hidden" name="_csrf" value={csrfToken} />
          <textarea name="body" />
          <button type="submit">Add Post</button>
        </form>
      ) : null}
    </React.Fragment>
  );
}
