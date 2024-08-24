import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import TaskList from './components/Tasks/TaskList';
import SubtaskList from './components/Tasks/SubtaskList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path='/subtasks' element={<SubtaskList />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;