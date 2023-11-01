import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import heroesFilterReducer from '../features/heroes/HeroesSlice';
import eventsWCReducer from '../features/events/wc/slice';
import eventsHSReducer from '../features/events/hs/slice';
import eventsPOReducer from '../features/events/po/slice';
import eventsFFReducer from '../features/events/ff/slice';
import eventsRNGReducer from '../features/events/rng/slice';
import shelterReducer from '../features/events/shelter/slice';
import tenantsReducer from '../features/tenants/TenantsSlice';
import impReducer from '../features/events/imp/slice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    heroesFilter: heroesFilterReducer,
    tenants: tenantsReducer,
    wc: eventsWCReducer,
    hs: eventsHSReducer,
    po: eventsPOReducer,
    ff: eventsFFReducer,
    rng: eventsRNGReducer,
    shelter: shelterReducer,
    imp: impReducer,
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
