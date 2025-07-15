import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function TaskList({ token, setToken }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = 'http://localhost:8000/api/tasks/';
        if (filter === 'completed') {
          url += '?status=true';
        } else if (filter === 'incomplete') {
          url += '?status=false';
        } else if (filter === 'upcoming') {
          url += '?upcoming=true';
        }
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        setError('Failed to fetch tasks.');
      }
    };
    fetchTasks();
  }, [token, filter]);

  const toggleStatus = async (task) => {
    try {
      await axios.put(
        `http://localhost:8000/api/tasks/${task.id}/`,
        { ...task, status: !task.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: !t.status } : t)));
    } catch (error) {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      setError('Failed to delete task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`p-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className={`p-2 rounded ${filter === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Incomplete
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`p-2 rounded ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Upcoming
        </button>
      </div>
      <Link
        to="/tasks/new"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mb-4 inline-block"
      >
        Add Task
      </Link>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded bg-white shadow-sm flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Due: {task.due_date}</p>
                <p className="text-sm text-gray-500">
                  Status: {task.status ? 'Completed' : 'Incomplete'}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/tasks/${task.id}`}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                >
                  Details
                </Link>
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleStatus(task)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;  