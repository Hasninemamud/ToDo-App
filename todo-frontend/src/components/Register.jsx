import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', { username, password });
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Register</h2>
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 text-center">{error}</p>
        )}
        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out font-semibold"
          >
            Register
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;