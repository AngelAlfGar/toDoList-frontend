import React from 'react';
import axios from '../../axiosConfig';

const TaskItem = ({ task }) => {
  const toggleStatus = async () => {
    try {
      await axios.put(`/tasks/${task._id}`, {
        status: task.status === 'pending' ? 'completed' : 'pending'
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={toggleStatus}>
        {task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
      </button>
    </div>
  );
};

export default TaskItem;