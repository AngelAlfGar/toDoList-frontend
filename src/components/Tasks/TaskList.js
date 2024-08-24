import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editTask, setEditTask] = useState({
    _id: "",
    title: "",
    description: "",
  });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowEditModal = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleEditTaskChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const res = await axios.post("/tasks", newTask);
      setTasks([...tasks, res.data]);
      handleCloseCreateModal();
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      setError("Error creando la tarea");
    }
  };

  const handleUpdateTask = async () => {
    try {
      const res = await axios.put(`/tasks/${editTask._id}`, editTask);
      setTasks(tasks.map((t) => (t._id === editTask._id ? res.data : t)));
      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      setError("Error actualizando la tarea");
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const res = await axios.patch(`/tasks/${task._id}/completed`);
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error("Error al cambiar el estado de la tarea:", err);
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/tasks/${taskToDelete._id}`);
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
      handleCloseDeleteModal();
    } catch (err) {
      console.error(
        "Error al eliminar la tarea:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleViewSubtasks = (taskId) => {
    console.log(taskId);
    navigate("/subtasks", { state: { taskId } });
  };

  return (
    <div className="container mt-4">
      <Button
        variant="primary"
        onClick={handleShowCreateModal}
        className="mb-3"
      >
        Nueva Tarea
      </Button>

      <Table striped bordered hover responsive className="h-100">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Subtareas</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`status-switch-${task._id}`}
                  checked={task.completed}
                  onChange={() => handleStatusToggle(task)}
                  label={task.completed ? "Completada" : "Pendiente"}
                />
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleViewSubtasks(task._id)}
                >
                  Ver Subtareas
                </Button>
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowEditModal(task)}
                >
                  Editar
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShowDeleteModal(task)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para Crear Tarea */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Nombre de la Tarea</Form.Label>
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
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar Tarea */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditTaskTitle">
              <Form.Label>Nombre de la Tarea</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce el nombre de la tarea"
                name="title"
                value={editTask.title}
                onChange={handleEditTaskChange}
              />
            </Form.Group>
            <Form.Group controlId="formEditTaskDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introduce la descripción de la tarea"
                name="description"
                value={editTask.description}
                onChange={handleEditTaskChange}
              />
            </Form.Group>
          </Form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Confirmar Eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas eliminar esta tarea{" "}
            <strong>{taskToDelete?.title}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
