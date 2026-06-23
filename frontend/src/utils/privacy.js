const APP_KEYS = ['stages_pfe_token', 'stages_pfe_user']

export function clearLocalDemoData() {
  sessionStorage.clear()

  for (const key of Object.keys(localStorage)) {
    const value = localStorage.getItem(key) || ''
    const normalized = `${key} ${value}`.toLowerCase()
    if (
      normalized.includes('demo') ||
      normalized.includes('test') ||
      normalized.includes('example.com') ||
      normalized.includes('password')
    ) {
      localStorage.removeItem(key)
    }
  }

  for (const key of APP_KEYS) {
    const value = localStorage.getItem(key)
    if (value && value.toLowerCase().includes('example.com')) {
      localStorage.removeItem(key)
    }
  }
}
