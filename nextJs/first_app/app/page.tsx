// the component will be rendered and executed in the user's browser, rather than on the server.
"use client";

import Todo from "../components/Todo";

export default function Home() {
  return (
    <div>
      <h1>Todo List</h1>
      <Todo />
    </div>
  );
}
