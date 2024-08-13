// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import fibonacciReducer from '../features/fibonacciSlice';

// Configuración del store de Redux con el reducer de Fibonacci.
export const store = configureStore({
  reducer: {
    fibonacci: fibonacciReducer,
  },
});

// Tipos de TypeScript para el estado y el dispatch de Redux.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
