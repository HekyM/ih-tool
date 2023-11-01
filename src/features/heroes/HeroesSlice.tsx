import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { HeroFaction, HeroClass } from '../../components/heroes';


export interface HeroesFilterState {
    name: string | null;
    faction: HeroFaction | null;
    class: HeroClass | null;
    stars: {
        [key: string]: boolean | null;
    };
    shard: string | null;
    imprint: boolean | null;
    ho: boolean | null;
    tenant: boolean | null;
}

const initialState: HeroesFilterState = {
    name: null,
    faction: null,
    class: null,
    stars: {
        4: null,
        5: null,
        6: null,
        9: null,
        10: null,
    },
    shard: null,
    imprint: null,
    ho: null,
    tenant: null,
};

export interface StarsPayload {
    stars: number;
    filter: string;
}


const toNull = (item: any) => {
    if (item === 'undefined') return null
    return item
}

const yesNo = (item: any) => {
    if (item === 'undefined') return null
    if (item === 'yes') return true
    if (item === 'no') return false
    return item
}


export const heroesFilterSlice = createSlice({
  name: 'heroesFilter',
  initialState,
  reducers: {
    filter_name: (state, action: PayloadAction<string | null> ) => {
        state.name = action.payload;
    },
    filter_faction: (state, action: PayloadAction<HeroFaction | null> ) => {
      state.faction = toNull(action.payload);
    },
    filter_class: (state, action: PayloadAction<HeroClass | null> ) => {
        state.class = toNull(action.payload);
    },
    filter_stars: (state, action: PayloadAction<StarsPayload> ) => {
        state.stars[action.payload.stars] = yesNo(action.payload.filter);
    },
    filter_shard: (state, action: PayloadAction<string | null> ) => {
        state.shard = toNull(action.payload);
    },
    filter_imprint: (state, action: PayloadAction<string | null> ) => {
        state.imprint = yesNo(action.payload);
    },
    filter_ho: (state, action: PayloadAction<string | null> ) => {
        state.ho = yesNo(action.payload);
    },
    filter_tenant: (state, action: PayloadAction<string | null> ) => {
        state.tenant = yesNo(action.payload);
    },
  },
});

export const selectHeroFilter = (state: RootState) => state.heroesFilter;

export const { filter_name, filter_faction, filter_class, filter_stars, filter_shard, filter_imprint, filter_ho, filter_tenant } = heroesFilterSlice.actions;

export default heroesFilterSlice.reducer;
