import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Home,
    Package,
    Plus,
    ShoppingCart,
    User,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Receipt
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Plus, label: 'Create Product', path: '/create-product' },
        { icon: Package, label: 'All Products', path: '/products' },
        { icon: ShoppingCart, label: 'Buy Products', path: '/buy-products' },
        { icon: Receipt, label: 'Orders', path: '/orders' },
        { icon: User, label: 'Profile', path: '/profile' },
    ]


    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <>
            {/* Mobile menu button */}
            {!isOpen && <Button
                variant="ghost"
                size="sm"
                className="fixed top-4 left-4 z-50 lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/*{isOpen ? <X size={20} /> : <Menu size={20} />}*/}
                {<Menu size={20}/>}
            </Button>}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0
              `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Inventory App
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                    </div>

                    {/* User Profile */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                                  ${isActive(item.path)
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }
                                `}
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10 z-30 lg:hidden transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar
