import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';


const pity = (success_percent: number, tries: number): number[] => {
    let results: number[] = [];
    let success = success_percent / 100
    let fail = 1 - success;

    let fail_total = 1;

    for (let n = 1; n <= tries; n++) {
        fail_total *= fail;
        results.push(1-fail_total)
    }
    //results.push(1)

    return  results
}

export interface EventsPityState {
    probability: number;
    tries: number;
    chance: number[];
    computed: boolean;
}

const initialState: EventsPityState = {
    probability: 0.5,
    tries: 10,
    chance: [],
    computed: false,
};

export const eventsPitySlice = createSlice({
  name: 'eventsPity',
  initialState,
  reducers: {
    Pityprobability: (state, action: PayloadAction<number> ) => {
        state.probability = action.payload;
    },
    Pitytries: (state, action: PayloadAction<number> ) => {
        state.tries = action.payload;
    },
    Pitycompute: (state) => {
        state.chance = pity(state.probability, state.tries);
        state.computed = true
    }
  },
});

export const selectPityRewards = (state: RootState) => state.pity;

export const { Pityprobability, Pitytries, Pitycompute } = eventsPitySlice.actions;

export default eventsPitySlice.reducer;
