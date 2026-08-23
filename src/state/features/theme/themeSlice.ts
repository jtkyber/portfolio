import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const html = document.documentElement;

export interface ThemeState {
    darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: true,
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            const willBeDark = !state.darkMode;
            state.darkMode = willBeDark;

            localStorage.setItem('darkMode', willBeDark.toString());

            if (willBeDark) html?.classList.add('dark');
            else html?.classList.remove('dark');
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;

            if (action.payload) html?.classList.add('dark');
            else html?.classList.remove('dark');
        },
    },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
