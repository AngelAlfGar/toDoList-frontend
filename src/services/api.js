// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Reemplaza con la URL de tu backend

export const getTasks = () => axios.get(`${API_URL}/tasks`);
export const createTask = (task) => axios.post(`${API_URL}/tasks`, task);
export const updateTask = (id, task) => axios.put(`${API_URL}/tasks/${id}`, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/tasks/${id}`);

// Agrega funciones similares para otras colecciones como subtareas y comentarios
