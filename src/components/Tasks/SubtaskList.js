import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const SubtaskList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const [subtasks, setSubtasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSubtask, setNewSubtask] = useState({ title: '' });
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [error, setError] = useState('');
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

  useEffect(() => {
    if (taskId) {
      const fetchSubtasks = async () => {
        try {
          const res = await axios.get(`/subtasks/task/${taskId}`);
          setSubtasks(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchSubtasks();
    }
  }, [taskId]);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowEditModal = (subtask) => {
    setSelectedSubtask(subtask);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedSubtask(null);
    setShowEditModal(false);
  };

  const handleShowDeleteModal = (subtask) => {
    setSubtaskToDelete(subtask);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSubtaskToDelete(null);
    setShowDeleteModal(false);
  };

  const handleNewSubtaskChange = (e) => {
    setNewSubtask({ ...newSubtask, [e.target.name]: e.target.value });
  };

  const handleCreateSubtask = async () => {
    try {
      const res = await axios.post(`/subtasks/task/${taskId}`, newSubtask);
      setSubtasks([...subtasks, res.data]);
      handleCloseCreateModal();
      setNewSubtask({ title: '' });
    } catch (err) {
      console.error(err);
      setError('Error creating subtask');
    }
  };

  const handleEditSubtaskChange = (e) => {
    setSelectedSubtask({ ...selectedSubtask, [e.target.name]: e.target.value });
  };

  const handleEditSubtask = async () => {
    if (selectedSubtask) {
      try {
        const res = await axios.put(`/subtasks/${selectedSubtask._id}`, selectedSubtask);
        setSubtasks(subtasks.map(st => st._id === selectedSubtask._id ? res.data : st));
        handleCloseEditModal();
      } catch (err) {
        console.error(err);
        setError('Error updating subtask');
      }
    }
  };

  const handleDeleteSubtask = async () => {
    if (subtaskToDelete) {
      try {
        await axios.delete(`/subtasks/${subtaskToDelete._id}`);
        setSubtasks(subtasks.filter(st => st._id !== subtaskToDelete._id));
        handleCloseDeleteModal();
      } catch (err) {
        console.error(err);
        setError('Error deleting subtask');
      }
    }
  };

  const handleStatusToggle = async (subtask) => {
    try {
      const updatedStatus = subtask.status === 'pending' ? 'completed' : 'pending';
      await axios.patch(`/subtasks/${subtask._id}/status`, { status: updatedStatus });
      setSubtasks(subtasks.map(st => st._id === subtask._id ? { ...st, status: updatedStatus } : st));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackToTasks = () => {
    navigate('/tasks');
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <Button variant="primary" onClick={handleShowCreateModal} className="me-2">
          Nueva Subtarea
        </Button>
        <Button variant="secondary" onClick={handleBackToTasks}>
          Regresar a Tareas
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Subtarea</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map(subtask => (
            <tr key={subtask._id}>
              <td>{subtask.title}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`status-switch-${subtask._id}`}
                  checked={subtask.status === 'completed'}
                  onChange={() => handleStatusToggle(subtask)}
                  label={subtask.status === 'completed' ? 'Completada' : 'Pendiente'}
                />
              </td>
              <td>
                <Button variant="info" onClick={() => handleShowEditModal(subtask)}>
                  Editar
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleShowDeleteModal(subtask)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Crear Subtarea Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Subtarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSubtaskTitle">
              <Form.Label>Nombre de la Subtarea</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce el nombre de la subtarea"
                name="title"
                value={newSubtask.title}
                onChange={handleNewSubtaskChange}
              />
            </Form.Group>
          </Form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateSubtask}>
            Crear Subtarea
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Editar Subtarea Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Subtarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubtask && (
            <Form>
              <Form.Group controlId="formSubtaskEditTitle">
                <Form.Label>Nombre de la Subtarea</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Introduce el nombre de la subtarea"
                  name="title"
                  value={selectedSubtask.title}
                  onChange={handleEditSubtaskChange}
                />
              </Form.Group>
            </Form>
          )}
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditSubtask}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmar Eliminación Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {subtaskToDelete && (
            <p>¿Estás seguro que deseas eliminar la subtarea{" "} 
            <strong>{subtaskToDelete.title}</strong>?</p>
          )}
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteSubtask}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubtaskList;
