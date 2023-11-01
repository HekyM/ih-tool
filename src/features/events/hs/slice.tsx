import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


export interface EventsHSState {
    currency: {
        [key: number]: number;
    }
}

const initialState: EventsHSState = {
    currency: {
        50: 5,
        100: 5,
        200: 5,
        300: 5,
        400: 10,
        500: 10,
    }
};

export interface HSpayload {
    points: number;
    currency: number;
}


export const eventsHSSlice = createSlice({
  name: 'eventsHS',
  initialState,
  reducers: {
    HScurrency: (state, action: PayloadAction<HSpayload> ) => {
        state.currency[action.payload.points] = action.payload.currency;
    },
  },
});

export const selectHSRewards = (state: RootState) => state.hs;

export const { HScurrency } = eventsHSSlice.actions;

export default eventsHSSlice.reducer;
