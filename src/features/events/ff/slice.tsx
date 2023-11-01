import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


export interface EventsFFState {
    items: {
        [key: string]: boolean;
    };
    ratio: number;
}

const initialState: EventsFFState = {
    items: {
        '0-0': false, '0-1': false, '0-2': false,
        '1-0': false, '1-1': false, '1-2': false,
        '2-0': false, '2-1': false, '2-2': false,
        '3-0': false, '3-1': false, '3-2': false,
        '4-0': false, '4-1': false, '4-2': false,
        '5-0': false, '5-1': false, '5-2': false,
        '6-0': false, '6-1': false, '6-2': false,
    },
    ratio: 3
};

export const eventsFFSlice = createSlice({
  name: 'eventsFF',
  initialState,
  reducers: {
    FFtoggle: (state, action: PayloadAction<string> ) => {
        state.items[action.payload] = !state.items[action.payload];
    },
    FFratio: (state, action: PayloadAction<number> ) => {
        state.ratio = action.payload;
    },
  },
});

export const selectFFRewards = (state: RootState) => state.ff;

export const { FFtoggle, FFratio } = eventsFFSlice.actions;

export default eventsFFSlice.reducer;
