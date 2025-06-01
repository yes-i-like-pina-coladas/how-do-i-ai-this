import { create } from 'zustand'
import { AIApp, ExtensionState, Theme } from '@/types'
import { getExtensionState, setExtensionState } from '@/lib/storage'
import { generateId } from '@/lib/utils'

interface ExtensionStore extends ExtensionState {
  // Actions
  loadState: () => Promise<void>
  toggleEnabled: () => Promise<void>
  addApp: (app: Omit<AIApp, 'id'>) => Promise<void>
  updateApp: (id: string, updates: Partial<AIApp>) => Promise<void>
  deleteApp: (id: string) => Promise<void>
  updateLastShown: () => Promise<void>
  setTheme: (theme: Theme) => Promise<void>
}

export const useExtensionStore = create<ExtensionStore>((set, get) => ({
  // Initial state
  enabled: true,
  apps: [],
  theme: 'system',

  // Actions
  loadState: async () => {
    const state = await getExtensionState()
    set(state)
  },

  toggleEnabled: async () => {
    const newState = { ...get(), enabled: !get().enabled }
    await setExtensionState(newState)
    set({ enabled: newState.enabled })
  },

  addApp: async (app) => {
    const newApp: AIApp = { ...app, id: generateId() }
    const newState = { ...get(), apps: [...get().apps, newApp] }
    await setExtensionState(newState)
    set({ apps: newState.apps })
  },

  updateApp: async (id, updates) => {
    const apps = get().apps.map(app => 
      app.id === id ? { ...app, ...updates } : app
    )
    const newState = { ...get(), apps }
    await setExtensionState(newState)
    set({ apps })
  },

  deleteApp: async (id) => {
    const apps = get().apps.filter(app => app.id !== id)
    const newState = { ...get(), apps }
    await setExtensionState(newState)
    set({ apps })
  },

  updateLastShown: async () => {
    const newState = { 
      ...get(), 
      lastShown: Date.now(),
      lastShownDomain: window.location.hostname
    }
    await setExtensionState(newState)
    set({ lastShown: newState.lastShown, lastShownDomain: newState.lastShownDomain })
  },

  setTheme: async (theme) => {
    const newState = { ...get(), theme }
    await setExtensionState(newState)
    set({ theme })
  }
})) 