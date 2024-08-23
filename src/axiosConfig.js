import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que la URL base coincida con la de tu servidor backend
});

// Interceptor para añadir el token JWT a cada solicitud
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;