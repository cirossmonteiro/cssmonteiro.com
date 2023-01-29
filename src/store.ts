import { configureStore } from '@reduxjs/toolkit';

import trelloReducer from './components/trello/slice';
// ...

export const store = configureStore({
  reducer: {
    trello: trelloReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch