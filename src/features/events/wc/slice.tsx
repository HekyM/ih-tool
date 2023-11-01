import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


export interface EventsWCState {
    currency: {
        [key: number]: number;
    }
}

const initialState: EventsWCState = {
    currency: {
        50: 2,
        100: 3,
        200: 5,
        300: 5,
    }
};

export interface WCpayload {
    points: number;
    currency: number;
}


export const eventsWCSlice = createSlice({
  name: 'eventsWC',
  initialState,
  reducers: {
    WCcurrency: (state, action: PayloadAction<WCpayload> ) => {
        state.currency[action.payload.points] = action.payload.currency;
    },
  },
});

export const selectWCRewards = (state: RootState) => state.wc;

export const { WCcurrency } = eventsWCSlice.actions;

export default eventsWCSlice.reducer;
