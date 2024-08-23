import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use(
  config => {
    console.log({localStorage})
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token)
      config.headers['x-auth-token'] = token;
    }else{
      console.log('no hay token')
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;