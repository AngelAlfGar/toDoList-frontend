import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { Button, Container, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SubtaskList = () => {
  const { taskId } = useParams();
  const [subtasks, setSubtasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation()

  const task = location.state.task

  console.log(task)

  useEffect(() => {
    // if (!taskId) {
    //   setError('Task ID is missing');
    //   return;
    // }
    
    const fetchSubtasks = async () => {
      try {
        const response = await axios.get(`/subtasks/${task}`);
        setSubtasks(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch subtasks');
      }
    };

    fetchSubtasks();
  }, [taskId]);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) {
      setError('Subtask title cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`/subtasks/${taskId}`, { title: newSubtaskTitle });
      setSubtasks([...subtasks, response.data]);
      setNewSubtaskTitle('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add subtask');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        New Subtask
      </Button>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map((subtask) => (
            <tr key={subtask._id}>
              <td>{subtask.title}</td>
              <td>{subtask.status}</td>
              <td>
                <Button variant="warning" className="me-2">Edit</Button>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Subtask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubtask}>
            <Form.Group controlId="formSubtaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subtask title"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? 'Adding...' : 'Add Subtask'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SubtaskList;