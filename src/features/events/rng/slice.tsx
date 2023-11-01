import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

export interface RNGItemState {
    count: number;
    exact: number;
    cumulative: number;
}

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

const chance = (tries: number, success: number, fail: number, requied: number): number => {
    // success^requied * (1-success)^(tries-requied) * tries!/(success!*(1-success)!)

    let success_tries = requied;
    let fail_tries = tries - requied;

    let permutation_up: number = tries;
    let permutation_up_stop: number;
    let permutation_down: number;

    if (success_tries < fail_tries) {
        permutation_up_stop = fail_tries;
        permutation_down = Math.max(success_tries, 1);
    } else {
        permutation_up_stop = success_tries;
        permutation_down = Math.max(fail_tries, 1);
    }

    //console.log('calc-chance init:', tries, success_tries, fail_tries, 'per:', permutation_up, '/', permutation_down, 'stop:', permutation_up_stop)

    var chance_result=1;
    while (true) {
        if (permutation_up <= permutation_up_stop) {
            permutation_up = 1
        }

        if (permutation_up === 1 && 
            permutation_down === 1 &&
            success_tries === 0 &&
            fail_tries === 0
            ) 
            break;
        
        
        if (success_tries > 0) {
            chance_result *= success;
            --success_tries;
        }
        if (fail_tries > 0) {
            chance_result *= fail;
            --fail_tries;
        }

        if (permutation_up > 1 || permutation_down > 1) {
            chance_result *= (permutation_up/permutation_down);
        }
        
        if (permutation_up > permutation_up_stop)
            --permutation_up;
            
        if (permutation_down > 1)
            --permutation_down;
    }

    //console.log('calc-chance:', tries, success, fail, chance_result)
    return chance_result;
}

const rng = (success_percent: number, tries: number): {computed: boolean, table: RNGItemState[]} => {
    let results = [] as RNGItemState[];
    let success = success_percent / 100
    let fail = 1 - success;
    let chances = Array(tries+1).fill(0);

    let rng_n: number;
    for (let n = 0; n <= tries; n++) {
        rng_n = chance(tries, success, fail, n)
        if (rng_n === Infinity) 
            return {computed: false, table: results} // to much
        chances[n] = rng_n
    }

    var reverted = [...chances].reverse();
    var cumulative = accumulate(reverted).reverse();

    for (let n = 0; n <= tries; n++) {
        results.push({
            count: n,
            exact: chances[n],
            cumulative: cumulative[n],
        })
    }

    return {computed: true, table: results}
}

export interface EventsRNGState {
    probability: number;
    tries: number;
    table: RNGItemState[];
    all: boolean;
    computed?: boolean;
}

const initialState: EventsRNGState = {
    probability: 6.67,
    tries: 15,
    table: [],
    all: false,
};

export const eventsRNGSlice = createSlice({
  name: 'eventsRNG',
  initialState,
  reducers: {
    RNGprobability: (state, action: PayloadAction<number> ) => {
        state.probability = action.payload;
    },
    RNGtries: (state, action: PayloadAction<number> ) => {
        state.tries = action.payload;
    },
    RNGcompute: (state) => {
        let result = rng(state.probability, state.tries);
        state.computed = result.computed;
        state.table = result.table;
    },
    RNGtoggleShowAll: (state) => {
        state.all = !state.all;
    },
  },
});

export const selectRNGRewards = (state: RootState) => state.rng;

export const { RNGprobability, RNGtries, RNGcompute, RNGtoggleShowAll } = eventsRNGSlice.actions;

export default eventsRNGSlice.reducer;
