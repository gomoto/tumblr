import { State } from './state';

// Selectors based on blog state
export const size = (state: State) => state.size;
export const posts = (state: State) => state.posts;
export const postTypes = (state: State) => state.postTypes;
