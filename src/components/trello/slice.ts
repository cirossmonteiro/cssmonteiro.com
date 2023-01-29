import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import { initialState } from './initialState';


export const trelloSlice = createSlice({
  name: 'trello',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})

export const { /* increment, decrement, incrementByAmount */ } = trelloSlice.actions;

const trelloReducer = trelloSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectors = {
  selectBoards: (state: RootState) => state.trello.boards
};

export default trelloReducer;