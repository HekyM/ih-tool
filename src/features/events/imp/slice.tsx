import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


export interface ImpState {
    input: {
        [key: string]: any;
    };
}

const initialState: ImpState = {
    input: {
        'mushroom1': 1,
        'mushroom2': 1,
        'mushroom3': 1,
        'stars': 0,
        'ordinary': 78,
        'lucky': 0,
        'startPos': 0,
        'activeTarot': 'None',
    },
};

export interface InputPayload {
    id: string;
    value: any;
}

export const impSlice = createSlice({
  name: 'eventsFF',
  initialState,
  reducers: {
    input: (state, action: PayloadAction<InputPayload> ) => {
        state.input[action.payload.id] = action.payload.value;
    },
  },
});

export const impState = (state: RootState) => state.imp;
export const impInput = (id: string) => (state: RootState) => state.imp.input[id];

export const { input } = impSlice.actions;

export default impSlice.reducer;
