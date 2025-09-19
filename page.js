"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState("");
  const [filter, setFilter] = useState("All"); // all | pending | done

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:3001/tasks");
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTasks = async () => {
    await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ task: newTasks }),
    });
    setNewTasks("");
    fetchTasks();
  };

  const markAsDone = async (id) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });
    fetchTasks();
  };

  // Aplicar filtro
  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "pending") return !task.done;
    return true; // "all"
  });

  return (
    <div>
      <h1>gerenciador-de-tarefas</h1>
      <input
        type="text"
        value={newTasks}
        onChange={(e) => setNewTasks(e.target.value)}
      />
      <button onClick={addTasks}>Adicione uma Tarefa</button>

      {/* Botões de filtro */}
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <button onClick={() => setFilter("all")}>Todas</button>
        <button onClick={() => setFilter("pending")}>Pendentes</button>
        <button onClick={() => setFilter("done")}>Concluídas</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.done ? "line-through" : "none" }}
            >
              {task.id + " - "} {task.task + " "}
            </span>
            <button onClick={() => markAsDone(task.id)}>
              Marcar como feita
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
