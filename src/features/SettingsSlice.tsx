import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type NumbersStyle = 'short'|'long'|'plain'|'longUS';

export interface Settings {
    numbers: NumbersStyle;
}

const initialState: Settings = {
    numbers: 'long'
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      setNumbersStyle: (state, action: PayloadAction<NumbersStyle> ) => {
          state.numbers = action.payload;
      },
    },
  });
  
  export const settings = (state: RootState) => state.settings;
  
  export const { setNumbersStyle } = settingsSlice.actions;
  
  export default settingsSlice.reducer;