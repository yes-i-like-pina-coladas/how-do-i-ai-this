export interface AIApp {
  id: string
  name: string
  url: string
  logoKey: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface ExtensionState {
  enabled: boolean
  apps: AIApp[]
  lastShown?: number
  lastShownDomain?: string
  theme: Theme
}

export const DEFAULT_STATE: ExtensionState = {
  enabled: true,
  theme: 'system',
  apps: [
    {
      id: '1',
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      logoKey: 'default'
    },
    {
      id: '2', 
      name: 'Claude',
      url: 'https://claude.ai',
      logoKey: 'default'
    },
    {
      id: '3',
      name: 'Gemini',
      url: 'https://gemini.google.com',
      logoKey: 'default'
    }
  ]
} 