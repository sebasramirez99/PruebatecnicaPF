// src/features/fibonacciSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definición del estado inicial y su estructura.
interface FibonacciState {
  series: number[];
  history: string[];
}

const initialState: FibonacciState = {
  series: [],
  history: [],
};

// Creación de un slice de Redux para manejar el estado de Fibonacci.
const fibonacciSlice = createSlice({
  name: 'fibonacci',
  initialState,
  reducers: {
    // Acción para actualizar la serie Fibonacci y agregarla al historial.
    setSeries: (state, action: PayloadAction<number[]>) => {
      state.series = action.payload;
      state.history.push(action.payload.join(', '));
      localStorage.setItem('fibonacciHistory', JSON.stringify(state.history));
    },
    // Acción para cargar el historial de series desde localStorage.
    loadHistory: (state) => {
      const storedHistory = localStorage.getItem('fibonacciHistory');
      if (storedHistory) {
        state.history = JSON.parse(storedHistory);
      }
    },
  },
});

// Exportación de las acciones para que puedan ser utilizadas en los componentes.
export const { setSeries, loadHistory } = fibonacciSlice.actions;

// Exportación del reducer para ser utilizado en el store de Redux.
export default fibonacciSlice.reducer;
