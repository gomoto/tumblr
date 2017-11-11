import { State } from './state';

// Selectors based on blog state
export const name = (state: State) => state.name;
export const size = (state: State) => state.size;
export const cursor = (state: State) => state.cursor;
export const posts = (state: State) => state.posts;
