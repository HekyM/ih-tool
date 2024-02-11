import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { array_move } from '../../../components/functions';
import _ from 'lodash';
import { imprintsCost, treeCost, destinyCost } from '../../../data/lvl';

export interface HeroCost {
    aurora: number;
    cot: number;
    spiritvein: number;
    stellar: number;
    esence: number;
}
const emptyHeroCost: HeroCost = { aurora: 0, cot: 0, spiritvein: 0, stellar: 0, esence: 0 }

export interface HeroRankCost {
    [details: string] : HeroCost;
}

export const rankCost: HeroRankCost = {
    E5: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 0,
        esence: 0,
    },
    V1: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 138630,
        esence: 0,
    },
    V2: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 726540,
        esence: 0,
    },
    V3: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 2184930,
        esence: 0,
    },
    V4: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 4935000,
        esence: 0,
    },
    T0: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 4945000,
        esence: 1000,
    },
    T1: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 5242350,
        esence: 31020,
    },
    T2: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 5879700,
        esence: 100840,
    },
    T3: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 7007050,
        esence: 233460,
    },
    T4: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 8784400,
        esence: 452880,
    },
    T5: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 11371750,
        esence: 783100,
    },
    Tmax: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 14929100,
        esence: 1248120,
    },
    D1: {
        aurora: 5,
        cot: 420000,
        spiritvein: 0,
        stellar: 0,
        esence: 1248120,
    },
    D2: {
        aurora: 12,
        cot: 1010000,
        spiritvein: 197236,
        stellar: 15750640,
        esence: 1248120,
    },
    D3: {
        aurora: 21,
        cot: 1760000,
        spiritvein: 474436,
        stellar: 16905640,
        esence: 1248120,
    },
    D4: {
        aurora: 32,
        cot: 2680000,
        spiritvein: 830836,
        stellar: 18390640,
        esence: 1248120,
    },
    D5: {
        aurora: 45,
        cot: 3780000,
        spiritvein: 1266436,
        stellar: 20205640,
        esence: 1248120,
    },
    D6: {
        aurora: 60,
        cot: 5030000,
        spiritvein: 1781236,
        stellar: 22350640,
        esence: 1248120,
    },
    Dmax: {
        aurora: 60,
        cot: 5030000,
        spiritvein: 2400536,
        stellar: 24929590,
        esence: 1248120,
    },
};

export interface HeroLevel {
    hero: string | undefined;
    enabled: boolean;
    trans: boolean;
    rank: string;
    nodes?: number[];
    lvl?: number;
}

export const heroCost = (hero: HeroLevel): HeroCost => {
    let cost = {..._.get(rankCost, hero.rank)}
    if (hero.nodes !== undefined) {
        cost.stellar = cost.stellar + imprintsCost(hero.rank, hero.nodes)
    }
    if (hero.lvl !== undefined) {
        if (hero.rank[0] === 'T') {
            let x = treeCost(hero.lvl)
            cost.stellar = rankCost.V4.stellar + x.stellar
            cost.esence = rankCost.V4.esence + x.esence
        }
        if (hero.rank[0] === 'D') {
            let x = destinyCost(hero.rank, hero.lvl)
            cost.spiritvein = cost.spiritvein + x.spiritvein
            cost.stellar = cost.stellar + x.stellar
        }
    }
    if (hero.trans) {
        cost.cot += 5000000
    }

    return cost
}

export interface HeroItem {
    hero: HeroLevel;
    cost: HeroCost;
}

export interface Resources {
    have: {
        heroes: HeroItem[];
        bag: {
            enabled: boolean;
            cost: HeroCost;
        };
        total: HeroCost;
    };
    build: {
        heroes: HeroItem[];
        total: HeroCost;
    }; 
    total: HeroCost;
    
}

const calcTotal = (heroes: HeroItem[], bag: {enabled: boolean, cost: HeroCost} | undefined): HeroCost => {
    let total: HeroCost = {...emptyHeroCost}
    let heroesCost: HeroCost[] = heroes.filter(h => h.hero.enabled).map(h => h.cost)

    for (const key of Object.keys(total)) {
        total[key as keyof HeroCost] = _.sumBy(heroesCost, key)
    }

    if (bag && bag.enabled) {
        for (const [key, value] of Object.entries(total)) {
            total[key as keyof HeroCost] = value + _.get(bag.cost, key)
        }
    }

    return total
}

const calcBalance = (have: HeroCost, build: HeroCost): HeroCost => {
    let total: HeroCost = {...emptyHeroCost}
    for (const key of Object.keys(total)) {
        let _key = key as keyof HeroCost
        total[_key] = have[_key] - build[_key]
    }
    return total
}

const initialState: Resources = {
    have: {
        heroes: [],
        bag: {enabled: true, cost: {...emptyHeroCost}},
        total: {...emptyHeroCost},
    },
    build: {
        heroes: [],
        total: {...emptyHeroCost},
    }, 
    total: {...emptyHeroCost},
};

export const regressionSlice = createSlice({
    name: 'regressionResources',
    initialState,
    reducers: {
      addHaveHero: (state, action: PayloadAction<HeroLevel> ) => {
        state.have.heroes.push({hero: action.payload, cost: heroCost(action.payload)})
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      addBuildHero: (state, action: PayloadAction<HeroLevel> ) => {
        state.build.heroes.push({hero: action.payload, cost: heroCost(action.payload)})
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      updateHaveHero: (state, action: PayloadAction<{index: number, hero: HeroLevel}> ) => {
        state.have.heroes[action.payload.index] = ({hero: action.payload.hero, cost: heroCost(action.payload.hero)})
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      updateBuildHero: (state, action: PayloadAction<{index: number, hero: HeroLevel}> ) => {
        state.build.heroes[action.payload.index] = ({hero: action.payload.hero, cost: heroCost(action.payload.hero)})
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      rmHaveHero: (state, action: PayloadAction<number> ) => {
        state.have.heroes.splice(action.payload, 1);
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      rmBuildHero: (state, action: PayloadAction<number> ) => {
        state.build.heroes.splice(action.payload, 1);
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      moveHaveHero: (state, action: PayloadAction<{index: number, add: number}> ) => {
        let new_index = action.payload.index + action.payload.add
        if (new_index < 0 || new_index >= state.have.heroes.length) {
            return
        }
        state.have.heroes = array_move(state.have.heroes, action.payload.index, new_index)
      },
      moveBuildHero: (state, action: PayloadAction<{index: number, add: number}> ) => {
        let new_index = action.payload.index + action.payload.add
        if (new_index < 0 || new_index >= state.have.heroes.length) {
            return
        }
        state.build.heroes = array_move(state.build.heroes, action.payload.index, new_index)
      },
      enabledHaveHero: (state, action: PayloadAction<{index: number, enabled: boolean}> ) => {
        state.have.heroes[action.payload.index].hero.enabled = action.payload.enabled;
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      enabledBuildHero: (state, action: PayloadAction<{index: number, enabled: boolean}> ) => {
        state.build.heroes[action.payload.index].hero.enabled = action.payload.enabled;
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      setBag: (state, action: PayloadAction<HeroCost> ) => {
        state.have.bag.cost = action.payload
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      resetBag: (state) => {
        state.have.bag.cost = {...emptyHeroCost}
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      enabledBag: (state, action: PayloadAction<boolean>) => {
        state.have.bag.enabled = action.payload
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = calcBalance(state.have.total, state.build.total)
      },
      saveRegress: (state) => {
        localStorage.setItem('ih-tool:regression', JSON.stringify(state));
      },
      loadRegress: (state) => {
        let data = localStorage.getItem('ih-tool:regression');
        return data ? JSON.parse(data) : initialState;
      },
      resetRegress: () => initialState,
    },
  });
  
 export const regressionResources = (state: RootState) => state.regression;
  
export const { 
    addHaveHero, addBuildHero, 
    rmHaveHero, rmBuildHero, 
    updateHaveHero, updateBuildHero,
    moveHaveHero, moveBuildHero,
    enabledHaveHero, enabledBuildHero, 
    setBag, resetBag, enabledBag,
    saveRegress, loadRegress, resetRegress,
} = regressionSlice.actions;
  
export default regressionSlice.reducer;
