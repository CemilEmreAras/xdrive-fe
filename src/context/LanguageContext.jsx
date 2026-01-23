import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage)
  }

  const value = {
    language: i18n.language,
    changeLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
