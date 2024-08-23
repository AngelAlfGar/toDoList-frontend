import React, { useState } from 'react';
import axios from '../../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', formData);
      console.log(res.data); // Recibe el token y otros datos del usuario
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;