import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import _ from 'lodash';
import { array_move } from '../../components/functions';
import {
  timers as defaultTimers,
  weeklies as defaultWeeklies,
} from './backup'


export const removeTimersStorage = () => {localStorage.removeItem('ih-tool:timers')}
export const copyTimersStorage = (): string|null => {return localStorage.getItem('ih-tool:timers')}
export const pasteTimersStorage = (value: string) => {localStorage.setItem('ih-tool:timers', value)}

export const removeWeekliesStorage = () => {localStorage.removeItem('ih-tool:weeklies')}
export const copyWeekliesStorage = (): string|null => {return localStorage.getItem('ih-tool:weeklies')}
export const pasteWeekliesStorage = (value: string) => {localStorage.setItem('ih-tool:weeklies', value)}


const now = new Date();
const nowTime = now.getTime()
const utcToday = (now.getUTCDay() + 6) % 7

function get_event_time() {
  var reset = new Date();
  var today = reset.getUTCDate()
  reset.setUTCDate(today + (7-reset.getUTCDay()+5) % 7);
  reset.setUTCHours(0)
  reset.setUTCMinutes(0)
  reset.setUTCSeconds(0)
  reset.setMilliseconds(0)

  if (reset.getTime() < nowTime) {
    reset.setUTCDate(today + 7);
  }

  return reset.getTime()
}

function get_reset_time() {
  var reset = new Date();
  reset.setUTCDate(reset.getUTCDate() + 1);
  reset.setUTCHours(0)
  reset.setUTCMinutes(0)
  reset.setUTCSeconds(0)
  reset.setMilliseconds(0)

  return reset.getTime()
}

export interface Timer {
  t: number;
  dsc: string;
  i?: string;
  type: 'private' | 'deadline' | 'repeat' | 'onoff' | 'custom';
  r?: number;
  rm?: boolean;
}

export interface WeeklyDays {
  dsc: string;
  i?: string;
  d: number[];
}
export interface WeeklyOnOff {
  dsc: string;
  i?: string;
  t: number;
  on: number;
  off: number;
  sign?: number;
}

export interface Weekly {
  d: number[];
  prev: number;
  next: number;
  on?: number;
  off?: number;
  settings: WeeklyDays | WeeklyOnOff;
}

export interface CounterState {
  timers: Timer[];
  weeklies: Weekly[];
  timerIndex: number|null|undefined;
  weekliesIndex: number|null|undefined;
}

function saveCustomTimers(timers: Timer[]) {
  pasteTimersStorage(JSON.stringify(timers.filter(timer => 'private' !== timer.type)));
}

function repeatTimer(timer: Timer, nowTime: number): Timer {
  if (timer.t && timer.r) {
    while (timer.t < nowTime) {
      timer.t += timer.r 
    }
  }
  return timer
}

function loadCustomTimers(nowTime: number): Timer[] {
  const customData = copyTimersStorage()
  const customTimers: Timer[] = customData ? JSON.parse(customData) : defaultTimers
  customTimers.forEach((timer) => {
    if (!timer.rm) {
      repeatTimer(timer, nowTime)
    }
  })
  saveCustomTimers(customTimers) // save updated
  return customTimers
}

function saveCustomWeeklies(weeklies: Weekly[]) {
  pasteWeekliesStorage(JSON.stringify(weeklies.map(weekly => weekly.settings)));
}

function settings2Weekly(nowTime: number, utcToday: number, settings: WeeklyDays | WeeklyOnOff): Weekly {
  if (_.has(settings, 'd')) {
    var weeklyDays = settings as WeeklyDays
    return {
      d: weeklyDays.d,
      prev: weeklyDays.d[6],
      next: weeklyDays.d[0],
      settings: weeklyDays,
    }
  }
  else /*if (_.has(settings, 't'))*/ {
    var weeklyOnOff = settings as WeeklyOnOff
    const resetDays = weeklyOnOff.on + weeklyOnOff.off
    const reset = resetDays*86400000
    
    var d = [0,0,0,0,0,0,0]
    var p = 0
    var n = 0
    var activeAfter = undefined
    var inactiveAfter = undefined
    if (weeklyOnOff.t && reset) {
      while (weeklyOnOff.t < nowTime) {
        weeklyOnOff.t += reset
      }
      const ed: number[] = Array(weeklyOnOff.sign || 0).fill(2).concat(Array(weeklyOnOff.on - (weeklyOnOff.sign || 0)).fill(1)).concat(Array(weeklyOnOff.off).fill(0))
      activeAfter = Math.ceil((weeklyOnOff.t - nowTime)/86400000) 
      inactiveAfter = activeAfter - weeklyOnOff.off
      if (inactiveAfter < 0) inactiveAfter += resetDays

      //console.log(weeklyOnOff.dsc, ed, utcToday, activeAfter, nowTime, weeklyOnOff.t, weeklyOnOff.t - nowTime, (weeklyOnOff.t - nowTime)/86400000)
      p = ed[(-1 - (utcToday + activeAfter) + 10*resetDays) % resetDays]
      for (const index of _.range(0, 7, 1)) {
        //console.log(ed, index, utcToday, activeAfter, (index - (utcToday + activeAfter) + 10*resetDays) % resetDays)
        d[index] = ed[(index - (utcToday + activeAfter) + 10*resetDays) % resetDays]
      }
      n = ed[(7 - (utcToday + activeAfter) + 10*resetDays) % resetDays]
    }

    return {
      d: d,
      prev: p,
      next: n,
      on: activeAfter,
      off: inactiveAfter,
      settings: weeklyOnOff,
    }
  }
}

function loadCustomWeeklies(): Weekly[] {
  const customData = copyWeekliesStorage()
  const customWeekliesSettings: (WeeklyDays | WeeklyOnOff) [] = customData ? JSON.parse(customData) : defaultWeeklies
  const customWeeklies: Weekly[] = [];
  customWeekliesSettings.forEach((settings) => {
    customWeeklies.push(settings2Weekly(nowTime, utcToday, settings))
  })
  saveCustomWeeklies(customWeeklies)
  return customWeeklies
}



const initialState: CounterState = {
  timers: [
    {t: get_reset_time(), dsc: "Daily reset", i: "d", type: 'private'},
    {t: get_event_time(), dsc: "Weekly reset", i: "w", type: 'private'}, 
    ...loadCustomTimers(nowTime)
  ],
  timerIndex: undefined,
  weeklies: loadCustomWeeklies(),
  weekliesIndex: undefined,
};

const toUndef = (item: any) => {
  if (item === 'undefined') return undefined
  return item
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addTimer: (state, action: PayloadAction<Timer>) => {
      state.timers.push(action.payload);
      saveCustomTimers(state.timers);
    },
    removeTimer: (state, action: PayloadAction<number>) => {
      state.timers.splice(action.payload, 1);
      saveCustomTimers(state.timers);
    },
    updateTimer: (state, action: PayloadAction<{index: number, timer: Timer}>) => {
      state.timers[action.payload.index].dsc = action.payload.timer.dsc;
      if (action.payload.timer.t !== 0)
        state.timers[action.payload.index].t = action.payload.timer.t;
      state.timers[action.payload.index].r = action.payload.timer.r;
      state.timers[action.payload.index].i = toUndef(action.payload.timer.i);
      saveCustomTimers(state.timers);
    },
    repeateTimer: (state, action: PayloadAction<number>) => {
      state.timers[action.payload] = repeatTimer(state.timers[action.payload], Date.now())
      saveCustomTimers(state.timers);
    },
    reloadTimers: (state) => {
      state.timers = [
        {t: get_reset_time(), dsc: "Daily reset", type: 'private'},
        {t: get_event_time(), dsc: "Weekly reset", type: 'private'}, 
        ...loadCustomTimers(Date.now())
      ]
      saveCustomTimers(state.timers);
    },
    moveTimer: (state, action: PayloadAction<{index: number, add: number}>) => {
      let new_index = action.payload.index + action.payload.add
      if (new_index < 2 || new_index >= state.timers.length) {
        return
      }
      state.timers = array_move(state.timers, action.payload.index, new_index, 2)
      state.timerIndex = state.timerIndex! + action.payload.add
      saveCustomTimers(state.timers);
    },
    timerIndex: (state, action: PayloadAction<number|null|undefined>) => {
      state.timerIndex =  action.payload
    },
    addWeekly: (state, action: PayloadAction<WeeklyDays | WeeklyOnOff>) => {
      const now = new Date();
      const nowTime = now.getTime()
      const utcToday = (now.getUTCDay() + 6) % 7

      state.weeklies.push(settings2Weekly(nowTime, utcToday, action.payload));
      saveCustomWeeklies(state.weeklies);
    },
    removeWeekly: (state, action: PayloadAction<number>) => {
      state.weeklies.splice(action.payload, 1);
      saveCustomWeeklies(state.weeklies);
    },
    updateWeekly: (state, action: PayloadAction<{index: number, settings: WeeklyDays | WeeklyOnOff}>) => {
      const now = new Date();
      const nowTime = now.getTime()
      const utcToday = (now.getUTCDay() + 6) % 7

      if (_.has(action.payload.settings, 't') && (action.payload.settings as WeeklyOnOff).t === 0) {
        (action.payload.settings as WeeklyOnOff).t = (state.weeklies[action.payload.index].settings as WeeklyOnOff).t
      }
      action.payload.settings.i = toUndef(action.payload.settings.i)

      state.weeklies[action.payload.index] = settings2Weekly(nowTime, utcToday, action.payload.settings);
      saveCustomWeeklies(state.weeklies);
    },
    moveWeekly: (state, action: PayloadAction<{index: number, add: number}>) => {
      let new_index = action.payload.index + action.payload.add
      if (new_index < 0 || new_index >= state.weeklies.length) {
        return
      }
      state.weeklies = array_move(state.weeklies, action.payload.index, new_index)
      state.weekliesIndex = state.weekliesIndex! + action.payload.add
      saveCustomWeeklies(state.weeklies);
    },
    weeklyIndex: (state, action: PayloadAction<number|null|undefined>) => {
      state.weekliesIndex =  action.payload
    },
  },
});

export const { 
  addTimer, removeTimer, updateTimer, repeateTimer, moveTimer, timerIndex, reloadTimers,
  addWeekly, removeWeekly, updateWeekly, moveWeekly, weeklyIndex 
} = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCounters = (state: RootState) => state.counter;

export default counterSlice.reducer;
