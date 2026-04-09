import { createContext, useContext } from 'react'
import { STRINGS } from '../data/strings'

export const LangContext = createContext('es')

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  const lang = useContext(LangContext)
  return (key) => {
    const entry = STRINGS[key]
    if (!entry) return key
    return entry[lang] || entry['es'] || key
  }
}
