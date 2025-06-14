"use client";

import { useState } from "react";
import TodoItem from "./TodoItem";

export default function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<String[]>([]);

  function addTask() {
    if (!task.trim()) return;
    setTasks([task, ...tasks]);
    setTask("");
  }

  function removeTask(index: number) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
        style={{ padding: "0.5rem", marginRight: "1rem" }}
      />
      <button onClick={addTask}>Add</button>

      <ul style={{ marginTop: "1rem" }}>
        {tasks.map((t, i) => (
          <TodoItem key={i} task={t} onRemove={() => removeTask(i)} />
        ))}
      </ul>
    </div>
  );
}
