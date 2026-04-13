import { create } from 'zustand'

interface ApiStatusState {
  isConnected: boolean
  mockMode: boolean
  setConnected: (connected: boolean) => void
  setMockMode: (mockMode: boolean) => void
}

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  isConnected: false,
  mockMode: false,
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setMockMode: (mockMode: boolean) => set({ mockMode }),
}))
