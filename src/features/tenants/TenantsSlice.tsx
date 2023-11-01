import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
//import { HeroFaction, HeroClass } from '../../components/heroes';


export interface TenantsFilterState {
    heroes: string[];
    ho: boolean;
    tenant: boolean;
    faction: string | null;
    class: string[];
    imprintable: boolean;
}

const initialState: TenantsFilterState = {
    heroes: [],
    ho: false,
    tenant: false,
    faction: null,
    class: [],
    imprintable: false,
};

const toNull = (item: any) => {
    if (item === 'undefined') return null
    return item
}

export const tenantsFilterSlice = createSlice({
  name: 'heroesFilter',
  initialState,
  reducers: {
    ci_select_hero: (state, action: PayloadAction<string> ) => {
        if (state.heroes.includes(action.payload)) {
            state.heroes.splice(state.heroes.indexOf(action.payload), 1)
        } else {
            state.heroes.push(action.payload);
        }
    },
    ci_filter_ho: (state) => {
        state.ho = !state.ho
    },
    ci_filter_tenant: (state) => {
        state.tenant = !state.tenant
    },
    ci_filter_faction: (state, action: PayloadAction<string>) => {
        state.faction = toNull(action.payload)
    },
    ci_filter_class: (state, action: PayloadAction<string>) => {
        if (state.class.includes(action.payload)) {
            state.class = state.class.filter(e => e !== action.payload)
        } else {
            state.class.push(action.payload)
        }
    },
    ci_filter_imprintable: (state) => {
        state.imprintable = !state.imprintable
    },
  },
});

export const tenantsFilter = (state: RootState) => state.tenants;

export const { ci_select_hero, ci_filter_ho, ci_filter_tenant, ci_filter_faction, ci_filter_class, ci_filter_imprintable } = tenantsFilterSlice.actions;

export default tenantsFilterSlice.reducer;
