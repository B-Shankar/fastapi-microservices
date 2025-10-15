import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) {
            try {
                // Handle both string and JSON formats
                return saved === 'dark' || saved === 'true' || JSON.parse(saved) === true
            } catch (error) {
                // If parsing fails, check if it's the string "dark"
                return saved === 'dark'
            }
        }
        return false
    })

    useEffect(() => {
        // Store as boolean JSON
        localStorage.setItem('theme', JSON.stringify(isDark))

        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(!isDark)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
