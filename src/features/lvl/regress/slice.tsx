import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { array_move } from '../../../components/functions';
import _ from 'lodash';
import { nodesCost, treeCost, destinyCost } from '../../../data/lvl';
import { temple } from '../../../data/lvl';

export interface HeroCost {
    aurora: number;
    cot: number;
    spiritvein: number;
    stellar: number;
    esence: number;
    food5: number;
    food6: number;
    food9: number;
    food10: number;
}
const emptyHeroCost: HeroCost = { 
    aurora: 0, cot: 0, spiritvein: 0, stellar: 0, esence: 0,
    food5: 13, food6: 3, food9: 0, food10: 0, 
}

export interface HeroRankCost {
    [details: string] : HeroCost;
}

export const rankCost: HeroRankCost = {
    NONE: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 0,
        esence: 0,
        food5: 0, food6: 0, food9: 0, food10: 0, 
    },
    E5: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 0,
        esence: 0,
        food5: 13, food6: 3, food9: 3, food10: 3, 
    },
    V1: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 138630,
        esence: 0,
        food5: 13, food6: 3, food9: 3, food10: 4,
    },
    V2: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 726540,
        esence: 0,
        food5: 13, food6: 3, food9: 3, food10: 5,
    },
    V3: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 2184930,
        esence: 0,
        food5: 13, food6: 3, food9: 3, food10: 6,
    },
    V4: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 4935000,
        esence: 0,
        food5: 13, food6: 3, food9: 3, food10: 7,
    },
    T0: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 4945000,
        esence: 1000,
        food5: 13, food6: 3, food9: 3, food10: 7,
    },
    T1: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 5242350,
        esence: 31020,
        food5: 13, food6: 3, food9: 3, food10: 8,
    },
    T2: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 5879700,
        esence: 100840,
        food5: 13, food6: 3, food9: 3, food10: 9,
    },
    T3: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 7007050,
        esence: 233460,
        food5: 13, food6: 3, food9: 3, food10: 10,
    },
    T4: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 8784400,
        esence: 452880,
        food5: 13, food6: 3, food9: 3, food10: 11,
    },
    T5: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 11371750,
        esence: 783100,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    Tmax: {
        aurora: 0,
        cot: 0,
        spiritvein: 0,
        stellar: 14929100,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D1: {
        aurora: 5,
        cot: 420000,
        spiritvein: 0,
        stellar: 14929100,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D2: {
        aurora: 12,
        cot: 1010000,
        spiritvein: 197236,
        stellar: 15750640,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D3: {
        aurora: 21,
        cot: 1760000,
        spiritvein: 474436,
        stellar: 16905640,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D4: {
        aurora: 32,
        cot: 2680000,
        spiritvein: 830836,
        stellar: 18390640,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D5: {
        aurora: 45,
        cot: 3780000,
        spiritvein: 1266436,
        stellar: 20205640,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    D6: {
        aurora: 60,
        cot: 5030000,
        spiritvein: 1781236,
        stellar: 22350640,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
    Dmax: {
        aurora: 60,
        cot: 5030000,
        spiritvein: 2400536,
        stellar: 24929590,
        esence: 1248120,
        food5: 13, food6: 3, food9: 3, food10: 12,
    },
};

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
        cost.stellar = cost.stellar + nodesCost(hero.rank, hero.nodes)
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

const destinyMap  = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'Dmax'];
const templeHeros = (require: number[]): HeroItem[] => {
    let heroes: HeroItem[] = [];
    require.forEach( (count, d_lvl) => {
        for (var i = 0; i < count; i++) {
            let hero: HeroLevel = {
                hero: undefined,
                enabled: true,
                trans: true,
                rank: destinyMap[d_lvl],
                lvl: 100,
            }
            heroes.push({
                hero: hero,
                cost: heroCost(hero)
            })
        }
    });

    return heroes;
}

export interface TempleCost {
    level: number;
    heroes: HeroItem[];
    total: HeroCost;
}

export interface TempleHeroes {
    [level: number] : TempleCost;
}
export const templeHeroRequires: TempleCost[] = 
    temple.map(t => {
        let heroes = templeHeros(t.require);
        return {
            level: t.lvl, heroes: 
            heroes, 
            total: calcTotal(heroes, undefined)
        }
    });

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
        temple_id: number | undefined;
    };
    build: {
        heroes: HeroItem[];
        total: HeroCost;
        temple_id: number | undefined;
    }; 
    total: HeroCost;
    
}

const initialState: Resources = {
    have: {
        heroes: [],
        bag: {enabled: true, cost: {...emptyHeroCost}},
        total: {...emptyHeroCost},
        temple_id: undefined,
    },
    build: {
        heroes: [],
        total: {...emptyHeroCost},
        temple_id: undefined,
    },
    total: {...emptyHeroCost},
};

const recalcBalance = (state: Resources): HeroCost => {
    return calcBalance(
        state.have.temple_id === undefined ? state.have.total : templeHeroRequires[state.have.temple_id].total,
        state.build.temple_id === undefined ? state.build.total : templeHeroRequires[state.build.temple_id].total,
    )
}

const version = '2'
const patch = (data: Resources): Resources => {
    let v = localStorage.getItem('ih-tool:regression:v') || '1'
    if (v === version) return data;

    if (v === '1') {
        data.have.heroes.forEach(h => {
            if (h.hero.hero === 'Mellisa') { h.hero.hero = 'Melissa'}
            if (h.hero.hero === 'Lady of Blosom Realm - Mellisa') { h.hero.hero = 'Lady of Blossom Realm - Melissa'}
        });
        data.build.heroes.forEach(h => {
            if (h.hero.hero === 'Mellisa') { h.hero.hero = 'Melissa'}
            if (h.hero.hero === 'Lady of Blosom Realm - Mellisa') { h.hero.hero = 'Lady of Blossom Realm - Melissa'}
        });
    }

    localStorage.setItem('ih-tool:regression', JSON.stringify(data));
    localStorage.setItem('ih-tool:regression:v', version);
    return data;
}

export const regressionSlice = createSlice({
    name: 'regressionResources',
    initialState,
    reducers: {
      addHaveHero: (state, action: PayloadAction<HeroLevel> ) => {
        state.have.heroes.push({hero: action.payload, cost: heroCost(action.payload)})
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      addBuildHero: (state, action: PayloadAction<HeroLevel> ) => {
        state.build.heroes.push({hero: action.payload, cost: heroCost(action.payload)})
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = recalcBalance(state)
      },
      updateHaveHero: (state, action: PayloadAction<{index: number, hero: HeroLevel}> ) => {
        state.have.heroes[action.payload.index] = ({hero: action.payload.hero, cost: heroCost(action.payload.hero)})
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      updateBuildHero: (state, action: PayloadAction<{index: number, hero: HeroLevel}> ) => {
        state.build.heroes[action.payload.index] = ({hero: action.payload.hero, cost: heroCost(action.payload.hero)})
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = recalcBalance(state)
      },
      rmHaveHero: (state, action: PayloadAction<number> ) => {
        state.have.heroes.splice(action.payload, 1);
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      rmBuildHero: (state, action: PayloadAction<number> ) => {
        state.build.heroes.splice(action.payload, 1);
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = recalcBalance(state)
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
        state.total = recalcBalance(state)
      },
      enabledBuildHero: (state, action: PayloadAction<{index: number, enabled: boolean}> ) => {
        state.build.heroes[action.payload.index].hero.enabled = action.payload.enabled;
        state.build.total = calcTotal(state.build.heroes, undefined)
        state.total = recalcBalance(state)
      },
      setBag: (state, action: PayloadAction<HeroCost> ) => {
        state.have.bag.cost = action.payload
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      resetBag: (state) => {
        state.have.bag.cost = {...emptyHeroCost}
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      enabledBag: (state, action: PayloadAction<boolean>) => {
        state.have.bag.enabled = action.payload
        state.have.total = calcTotal(state.have.heroes, state.have.bag)
        state.total = recalcBalance(state)
      },
      setHaveTemple: (state, action: PayloadAction<number|undefined>) => {
        state.have.temple_id = action.payload
        state.total = recalcBalance(state)
      },
      setBuildTemple: (state, action: PayloadAction<number|undefined>) => {
        state.build.temple_id = action.payload
        state.total = recalcBalance(state)
      },
      saveRegress: (state) => {
        localStorage.setItem('ih-tool:regression', JSON.stringify(state));
        localStorage.setItem('ih-tool:regression:v', version);
      },
      loadRegress: (state) => {
        let localData = localStorage.getItem('ih-tool:regression');
        let data: Resources = localData ? patch(JSON.parse(localData)) : initialState;
        state.have.heroes = data.have.heroes.map((h, i) => {return {hero: h.hero, cost: heroCost(h.hero)}})
        state.have.bag.cost = {...emptyHeroCost, ...data.have.bag.cost}
        state.build.heroes = data.build.heroes.map((h, i) => {return {hero: h.hero, cost: heroCost(h.hero)}})
        state.have.total = calcTotal(data.have.heroes, data.have.bag)
        state.build.total = calcTotal(data.build.heroes, undefined)
        state.total = state.total = calcBalance(state.have.total, state.build.total) // ignore temple
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
    setHaveTemple, setBuildTemple,
    saveRegress, loadRegress, resetRegress,
} = regressionSlice.actions;
  
export default regressionSlice.reducer;
