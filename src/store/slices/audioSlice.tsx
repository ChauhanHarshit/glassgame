import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from '../store' // Adjust this path based on where your store is defined

interface AudioState {
  isPlaying: boolean
  isMuted: boolean
  currText: string
}

const initialState: AudioState = {
  isPlaying: false,
  isMuted: false,
  currText: "",
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    mute: (state) => { state.isMuted = true },
    unmute: (state) => {
      state.isMuted = false;
    },
    changeTrack: (state, action: PayloadAction<string>) => {
      state.currText = action.payload;
    },
  },
})
// Hooks with type support
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export const { play, pause, mute, unmute, changeTrack } = audioSlice.actions
export default audioSlice.reducer
