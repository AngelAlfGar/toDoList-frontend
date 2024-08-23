import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { Table, Button, Modal, Form, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const res = await axios.post('/tasks', newTask);
      setTasks([...tasks, res.data]);
      handleCloseModal();
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error(err);
      setError('Error creating task');
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`/tasks/${task._id}`, updatedTask);
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    console.log("Editar tarea:", task);
  };

  const handleViewSubtasks = (taskId) => {
    console.log("Ver subtareas de la tarea:", taskId);
    navigate('/subtask');
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleShowModal} className="mb-3">
        Nueva Tarea
      </Button>

      <Table striped bordered hover responsive className='h-100'>
        <thead>
          <tr>
            <th>Nombre Tarea</th>
            <th>Descripción</th>
            <th>Status</th>
            <th>Subtareas</th>
            <th>Modificar tarea</th>
            <th>Eliminar tarea</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <Button
                  variant={task.completed ? 'success' : 'warning'}
                  onClick={() => handleStatusToggle(task)}
                >
                  {task.completed ? 'Completada' : 'Pendiente'}
                </Button>
              </td>
              <td>
                <Link to='/subtask' state={{'task':task._id}}> 
                  <Button variant="info" >
                    Ver Subtareas
                  </Button>
                </Link>
              </td>
              <td>
                <Button variant="success" onClick={() => handleEditTask(task)}>
                  Modificar
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteTask(task._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Nombre Tarea</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce el nombre de la tarea"
                name="title"
                value={newTask.title}
                onChange={handleNewTaskChange}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introduce la descripción de la tarea"
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
              />
            </Form.Group>
          </Form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Crear Tarea
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;