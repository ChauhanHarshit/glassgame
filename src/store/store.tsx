import { configureStore } from '@reduxjs/toolkit'
import audioReducer from './slices/audioSlice'

export const store = configureStore({
  reducer: {
    audio: audioReducer
  },middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['audio.currSound'],       // 🛑 no check on this slice
        ignoredActions: ['audio/changeTrack'],   // 🛑 or ignore the whole action
      },
    }),
})

// Infer types from store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
