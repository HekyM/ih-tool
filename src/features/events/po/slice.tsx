import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


export interface EventsPOState {
    currency: {
        [key: number]: number;
    }
}

const initialState: EventsPOState = {
    currency: {
        10: 5,
        20: 5,
        30: 5,
        40: 5,
        50: 5,
        60: 5,
        80: 10,
    }
};

export interface POpayload {
    points: number;
    currency: number;
}


export const eventsPOSlice = createSlice({
  name: 'eventsPO',
  initialState,
  reducers: {
    POcurrency: (state, action: PayloadAction<POpayload> ) => {
        state.currency[action.payload.points] = action.payload.currency;
    },
  },
});

export const selectPORewards = (state: RootState) => state.po;

export const { POcurrency } = eventsPOSlice.actions;

export default eventsPOSlice.reducer;
