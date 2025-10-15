// src/components/DarkModeTest.jsx
import { useTheme } from '../context/ThemeContext'

const DarkModeTest = () => {
	const { isDark, toggleTheme } = useTheme()

	return (
		<div className="p-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg">
			<h3 className="text-black dark:text-white font-bold">Dark Mode Test</h3>
			<p className="text-gray-600 dark:text-gray-300">
				Current mode: {isDark ? 'Dark' : 'Light'}
			</p>
			<button
				onClick={toggleTheme}
				className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
			>
				Toggle Theme
			</button>
			<div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
				HTML classes: {document.documentElement.className}
			</div>
		</div>
	)
}

export default DarkModeTest
