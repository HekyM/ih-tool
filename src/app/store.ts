import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from '../features/SettingsSlice';
import counterReducer from '../features/counter/counterSlice';
import heroesFilterReducer from '../features/heroes/HeroesSlice';
import eventsWCReducer from '../features/events/wc/slice';
import eventsHSReducer from '../features/events/hs/slice';
import eventsPOReducer from '../features/events/po/slice';
import eventsFFReducer from '../features/events/ff/slice';
import eventsRNGReducer from '../features/events/rng/slice';
import eventsPityReducer from '../features/events/pity/slice';
import shelterReducer from '../features/events/shelter/slice';
import tenantsReducer from '../features/tenants/TenantsSlice';
import impReducer from '../features/events/imp/slice';
import regressionReducer from '../features/lvl/regress/slice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    counter: counterReducer,
    heroesFilter: heroesFilterReducer,
    tenants: tenantsReducer,
    wc: eventsWCReducer,
    hs: eventsHSReducer,
    po: eventsPOReducer,
    ff: eventsFFReducer,
    rng: eventsRNGReducer,
    pity: eventsPityReducer,
    shelter: shelterReducer,
    imp: impReducer,
    regression: regressionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
