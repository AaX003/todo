import React, { useState } from 'react';
import './App.css';
import { FiEdit3, FiTrash } from "react-icons/fi";

function App() {

  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [tasks, setTasks] = useState([]);

  const [taskToEdit, setTaskToEdit] = useState("");
  const [descToEdit, setDescToEdit] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  
  const [filter, setFilter] = useState("all");
  

  const AddTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { id: crypto.randomUUID, name: task.trim(), desc: desc.trim(), isComplete: false }]);
      setTask("");
      setDesc("");
    }
  };

  const EditTask = (id) => {
    const taskToRevise = tasks.find(t => t.id === id);
    setTaskToEdit(taskToRevise.name);
    setDescToEdit(taskToRevise.desc);
    setEditingTask(id); // store id instead of index
  };

  const SaveTask = (id) => {
    const revisedTasks = tasks.map(t =>
      t.id === id ? { ...t, name: taskToEdit, desc: descToEdit } : t
    );
    setTasks(revisedTasks);
    setEditingTask(null);
    setTaskToEdit("");
    setDescToEdit("");
  };

  const DeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const MarkAsComplete = (id) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, isComplete: !t.isComplete } : t
    );
    setTasks(updated);
  };

  // ---- Derived data (for counts + filtering) ----
  const total = tasks.length;
  const activeTasks = tasks.filter(t => !t.isComplete);
  const completedTasks = tasks.filter(t => t.isComplete);

  const active = activeTasks.length;
  const completed = completedTasks.length; // count (was array before)

  const visibleTasks =
    filter === "completed" ? completedTasks :
    filter === "active"    ? activeTasks    :
    tasks; // "all"

  return (
    <div className="container">

      <h1 className="title">My Tasks</h1>
      <p className="subtitle">Stay organized and productive</p>

      <div className="task-stats">
        <div className="total-tasks">
          <p>{total} Total</p>
        </div>
        <div className="active-tasks">
          <p>{active} Active</p>
        </div>
        <div className="completed-tasks">
          <p>{completed} Completed</p> {/* fixed: show count, not array */}
        </div>
      </div>


      {/* Add Task Form */}
      
        <div className="add-task-container">
          <label className="task-title-label">
            Task Title
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
          />

          <label className="task-desc-label">
            Description (optional)
          </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="More details about the task..."
          />

          <div className="nav-container">
            <button
              className="add-task"
              onClick={AddTask}
              disabled={task.trim().length === 0}  // fixed
            >
              + Add Task
            </button>
          </div>
        </div>

      <div className="task-container">

        {tasks.length !== 0 && (
          <div className="filter-btns-container">
            <button className="all-btn" onClick={() => setFilter("all")}>All <small>{total}</small></button>
            <button className="active-btn" onClick={() => setFilter("active")}>Active <small>{active}</small></button>
            <button className="completed-btn" onClick={() => setFilter("completed")}>Completed <small>{completed}</small></button>
          </div>
        )}

        {/* Single source of truth for list & empty states */}
        {visibleTasks.length === 0 ? (
        <div className="no-task-container">
          <h3 className="no-task-msg">
            {filter === "completed"
              ? "No completed tasks yet"
              : filter === "active"
              ? "No active tasks"
              : "No tasks yet"}
          </h3>
          {(filter === "all" || filter === "active") && (
            <p className="no-task-subtitle">Create some tasks now</p>
          )}
        </div>
      ) : (
        visibleTasks.map((item) =>
          editingTask === item.id ? null : (
            <div key={item.id} className="task-card">
              <input
                type="checkbox"
                checked={item.isComplete}
                onChange={() => MarkAsComplete(item.id)}
              />

              <span
                style={{
                  textDecoration: item.isComplete ? "line-through" : "none",
                  textDecorationColor: item.isComplete ? "red" : "none",
                  textDecorationThickness: item.isComplete ? "4px" : "initial",
                }}
              >
                {item.name} {item.desc && <em>— {item.desc}</em>}
              </span>

              <div className="action-btns-container">
                <button onClick={() => EditTask(item.id)}>
                  <FiEdit3 />
                </button>
                <button onClick={() => DeleteTask(item.id)}>
                  <FiTrash />
                </button>
              </div>
            </div>
          )
        )
      )}

      {/* Edit panel (for the selected task only) */}
      {editingTask !== null && (
        <div className="edit-task-container">
          <input
            type="text"
            value={taskToEdit}
            onChange={(e) => setTaskToEdit(e.target.value)}
          />
          <input
            type="text"
            value={descToEdit}
            onChange={(e) => setDescToEdit(e.target.value)}
          />
          <button className="save-btn" onClick={() => SaveTask(editingTask)}>Save</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
