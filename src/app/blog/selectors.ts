import { State } from './state';

// Selectors based on blog state
export const cursor = (state: State) => state.cursor;
export const posts = (state: State) => state.posts;
