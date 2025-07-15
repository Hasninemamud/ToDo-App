import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function TaskEdit({ token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, description, due_date } = response.data;
        setTitle(title);
        setDescription(description);
        setDueDate(due_date);
      } catch (error) {
        setError('Failed to fetch task.');
      }
    };
    fetchTask();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/tasks/${id}/`,
        { title, description, status: false, due_date: dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/tasks');
    } catch (error) {
      setError('Failed to update task.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Edit Task</h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 p-3 rounded-md text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
            <textarea
              placeholder="Write a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskEdit;