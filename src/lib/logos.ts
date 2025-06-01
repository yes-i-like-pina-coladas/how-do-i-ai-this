export const logoMap: Record<string, string> = {
  chatgpt: '/src/assets/chatgpt.svg',
  claude: '/src/assets/claude.svg', 
  gemini: '/src/assets/gemini.svg',
  perplexity: '/src/assets/perplexity.svg',
  midjourney: '/src/assets/midjourney.svg',
  default: '/src/assets/ai-default.svg'
}

export const getLogoPath = (logoKey: string): string => {
  return logoMap[logoKey] || logoMap.default
}

export const getAvailableLogos = (): string[] => {
  return Object.keys(logoMap).filter(key => key !== 'default')
} 