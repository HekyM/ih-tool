import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { heroes, HeroFaction, heroClasses } from '../../../components/heroes';

export interface ShelterFood {
    [key: string]: {
        [key: string]: string[];
    }
}
export const shelterFoodCount = 4;
export const shelterFood: ShelterFood = {};
export const shelterFactions = [HeroFaction.Fortress, HeroFaction.Shadow, HeroFaction.Forest, HeroFaction.Abyss]

shelterFactions.forEach(hero_faction => {
    shelterFood[hero_faction] = {};
    heroClasses.forEach(hero_class => {
        shelterFood[hero_faction][hero_class] = heroes.filter(hero =>
             hero.faction === hero_faction && 
             (hero.class === hero_class || hero.class_supplement === hero_class) &&
             hero.stars.includes(4)
        ).map(hero => hero.name)
    });
});

export interface ShelterState {
    [key: string]: {
        hero: string | null;
        food: string[];
        have: number;
    };
}

const loaded = localStorage.getItem('ih-tool:shelter')

const emptyState: ShelterState = {
    Shadow: {hero: null, food: [], have: 0}, 
    Fortress: {hero: null, food: [], have: 0},
    Abyss: {hero: null, food: [], have: 0},
    Forest: {hero: null, food: [], have: 0},
};
const initialState: ShelterState = loaded ? JSON.parse(loaded) : emptyState

export interface ShelterHero {
    name: string;
    faction: string;
    class: string;
}


export const shelterSlice = createSlice({
  name: 'shelter',
  initialState,
  reducers: {
    selectShelterHero: (state, action: PayloadAction<ShelterHero> ) => {
        state[action.payload.faction] = { hero: action.payload.name, food: shelterFood[action.payload.faction][action.payload.class], have: 0};
        localStorage.setItem('ih-tool:shelter', JSON.stringify(state));
    },
    shelterHerosPlus: (state, action: PayloadAction<string> ) => {
        state[action.payload].have = Math.min(state[action.payload].have + 1, shelterFoodCount);
        localStorage.setItem('ih-tool:shelter', JSON.stringify(state));
    },
    shelterHerosMinus: (state, action: PayloadAction<string> ) => {
        state[action.payload].have = Math.max(state[action.payload].have - 1, 0);
        localStorage.setItem('ih-tool:shelter', JSON.stringify(state));
    },
    shelterReset: () => {
        localStorage.removeItem('ih-tool:shelter');
        return {...emptyState}
    }
  },
});

export const selectShelter = (state: RootState) => state.shelter;

export const { selectShelterHero, shelterHerosPlus, shelterHerosMinus, shelterReset } = shelterSlice.actions;

export default shelterSlice.reducer;