import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskEdit from './components/TaskEdit.jsx';
import TaskDetails from './components/TaskDetails.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/login" element={token ? <Navigate to="/tasks" /> : <Login setToken={setToken} />} />
            <Route path="/register" element={token ? <Navigate to="/tasks" /> : <Register />} />
            <Route
              path="/tasks"
              element={token ? <TaskList token={token} setToken={setToken} /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks/new"
              element={token ? <TaskForm token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks/:id/edit"
              element={token ? <TaskEdit token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks/:id"
              element={token ? <TaskDetails token={token} /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;