import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function TaskDetails({ token }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
      } catch (error) {
        setError('Failed to fetch task.');
      }
    };
    fetchTask();
  }, [id, token]);

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          {error ? (
            <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>
          ) : (
            <p className="text-gray-600 text-center animate-pulse">Loading...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Task Details</h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 p-3 rounded text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Title</h3>
            <p className="text-lg text-gray-800 mt-1 font-semibold">{task.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Description</h3>
            <p className="text-gray-700 mt-1">{task.description || 'No description'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Due Date</h3>
            <p className="text-gray-700 mt-1">{task.due_date}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${task.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {task.status ? 'Completed' : 'Incomplete'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t mt-4">
          <Link
            to={`/tasks/${id}/edit`}
            className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 shadow-sm transition"
          >
            Edit Task
          </Link>
          <Link
            to="/tasks"
            className="flex-1 text-center bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 shadow-sm transition"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;