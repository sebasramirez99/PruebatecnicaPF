// src/App.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { setSeries, loadHistory } from './features/fibonacciSlice';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const App: React.FC = () => {
  // Hook de Redux para disparar acciones.
  const dispatch = useDispatch();
  // Selección del estado actual de la serie Fibonacci y del historial.
  const fibonacciNumbers = useSelector((state: RootState) => state.fibonacci.series);
  const history = useSelector((state: RootState) => state.fibonacci.history);
  
  // Estado local para manejar el tiempo actual, correo electrónico y su validez.
  const [time, setTime] = useState(new Date());
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Efecto para actualizar la hora actual cada segundo.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar el historial de series Fibonacci desde localStorage al iniciar el componente.
  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  // Validar el correo electrónico.
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar el cambio en el campo de correo electrónico.
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  // Función para generar la serie Fibonacci y actualizar el estado de Redux.
  const handleGenerate = async () => {
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    try {
      const response = await axios.get('http://localhost:3001/fibonacci', {
        params: {
          x: minutes,
          y: seconds,
          n: seconds,
        },
      });
      dispatch(setSeries(response.data));
    } catch (error) {
      console.error("Error al generar la serie Fibonacci", error);
    }
  };

  // Función para enviar la serie Fibonacci por correo electrónico.
  const handleSendEmail = async () => {
    if (!isEmailValid) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/send-email', {
        email,
        time: time.toLocaleTimeString(),
        fibonacciNumbers,
      });
      alert('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo', error);
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4">Serie Fibonacci</Typography>
      <Typography variant="h6">Hora Actual: {time.toLocaleTimeString()}</Typography>
      <Button variant="contained" color="primary" onClick={handleGenerate}>
        Generar Serie Fibonacci
      </Button>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Números Fibonacci:
      </Typography>
      <ul>
        {fibonacciNumbers.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <TextField
        label="Correo Electrónico"
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        style={{ marginTop: '20px', marginBottom: '20px' }}
        fullWidth
        error={!isEmailValid && email !== ''}
        helperText={!isEmailValid && email !== '' ? 'Por favor, ingrese un correo electrónico válido' : ''}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSendEmail}
        disabled={!isEmailValid}
      >
        Enviar Serie por Correo
      </Button>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Historial:
      </Typography>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </Container>
  );
};

export default App;
