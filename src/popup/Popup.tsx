import React, { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { useExtensionStore } from '@/store/useExtensionStore'
import { isValidUrl } from '@/lib/utils'
import { Plus, Trash2, Sun, Moon, Monitor } from 'lucide-react'
import { Theme } from '@/types'

export const Popup: React.FC = () => {
  const {
    enabled,
    apps,
    theme,
    loadState,
    toggleEnabled,
    addApp,
    deleteApp,
    setTheme
  } = useExtensionStore()

  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newApp, setNewApp] = useState({ name: '', url: '' })
  const [error, setError] = useState<string | null>(null)

  // Detect system theme
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const initializeStore = async () => {
      await loadState()
      setIsLoading(false)
    }
    initializeStore()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleThemeChange)
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleThemeChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleThemeChange)
      }
    }
  }, [loadState])

  const handleAddApp = async () => {
    setError(null)
    
    if (!newApp.name.trim() || !isValidUrl(newApp.url)) {
      setError('Please enter a valid name and URL')
      return
    }

    // Check maximum limit
    if (apps.length >= 10) {
      setError('Maximum of 10 AI tools allowed')
      return
    }
    
    // Check for duplicate URLs
    if (apps.some(app => app.url === newApp.url)) {
      setError('This AI tool is already added')
      return
    }
    
    await addApp({ ...newApp, logoKey: 'default' })
    setNewApp({ name: '', url: '' })
    setShowAddForm(false)
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
  ]

  if (isLoading) {
    return (
      <div className={`w-80 p-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={`w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      {/* Header */}
      <div className="p-5 border-b border-opacity-10" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center bg-white">
              <img 
                src="/icon48.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              How do I AI this?
            </h1>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Enable AI suggestions
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Show on each new page visit
            </span>
          </div>
          <Switch checked={enabled} onCheckedChange={toggleEnabled} />
        </div>

        {/* Theme Selector */}
        <div className="mb-2">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Theme
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-opacity-50 rounded-lg" style={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  theme === option.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              AI Tools
            </h2>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {apps.length}/10 tools added
            </span>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => {
              if (apps.length >= 10) {
                setError('Maximum of 10 AI tools allowed')
                return
              }
              setShowAddForm(!showAddForm)
              setError(null)
            }}
            className={`${
              apps.length >= 10 
                ? isDarkMode 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : ''
            }`}
            disabled={apps.length >= 10}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            isDarkMode 
              ? 'bg-red-900/20 text-red-300 border border-red-900/30' 
              : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {error}
          </div>
        )}

        {/* Add App Form */}
        {showAddForm && (
          <div className={`mb-4 p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="App name"
                value={newApp.name}
                onChange={(e) => {
                  setError(null)
                  setNewApp({ ...newApp, name: e.target.value })
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'border-gray-300 bg-white focus:border-blue-500'
                } transition-colors focus:outline-none`}
              />
              <input
                type="url"
                placeholder="https://..."
                value={newApp.url}
                onChange={(e) => {
                  setError(null)
                  setNewApp({ ...newApp, url: e.target.value })
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'border-gray-300 bg-white focus:border-blue-500'
                } transition-colors focus:outline-none`}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddApp}
                  className={`${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors`}
                >
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => {
                    setShowAddForm(false)
                    setError(null)
                  }}
                  className={`${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  } transition-colors`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Apps List */}
        <div className="space-y-2">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className={`flex items-center justify-between p-3 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-6 h-6">
                  <img 
                    src={`https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(app.url)}`}
                    alt=""
                    className="w-6 h-6 rounded object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className={`absolute inset-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center ${
                      isDarkMode ? 'text-gray-100' : 'text-white'
                    }`}
                    style={{ display: 'none' }}
                  >
                    <span className="font-bold text-xs">
                      {app.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {app.name}
                  </div>
                  <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {app.url}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => deleteApp(app.id)}
                className={`ml-2 ${
                  isDarkMode 
                    ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200' 
                    : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                } transition-colors border-none`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        {apps.length === 0 && (
          <div className={`text-center py-8 px-4 border-2 border-dashed rounded-lg ${
            isDarkMode 
              ? 'border-gray-700 bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No AI tools added yet
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Add your favorite AI tools to get started
            </div>
          </div>
        )}

        {/* Info about behavior */}
        <div className={`text-xs text-center border-t pt-4 mt-4 ${
          isDarkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-200'
        }`}>
          AI suggestions appear when you visit new pages
        </div>
      </div>
    </div>
  )
} 