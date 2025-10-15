import { Link } from 'react-router-dom'
import { Package, TrendingUp, Shield, Smartphone } from 'lucide-react'
import Button from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const Landing = () => {
    const { isDark, toggleTheme } = useTheme()

    const features = [
        {
            icon: Package,
            title: 'Inventory Management',
            description: 'Easily manage your product inventory with real-time tracking and updates.'
        },
        {
            icon: TrendingUp,
            title: 'Sales Analytics',
            description: 'Track your sales performance with detailed analytics and insights.'
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Your data is safe with our secure and reliable platform.'
        },
        {
            icon: Smartphone,
            title: 'Mobile Responsive',
            description: 'Access your inventory from anywhere with our mobile-friendly design.'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Inventory App
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={toggleTheme}>
                            {isDark ? '☀️' : '🌙'}
                        </Button>
                        <Link to="/login">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
                    Manage Your Inventory
                    <span className="block text-blue-600">Like Never Before</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Streamline your business operations with our powerful inventory management system.
                    Track products, manage sales, and grow your business efficiently.
                </p>
                <div className="space-x-4">
                    <Link to="/login">
                        <Button size="lg">Start Free Trial</Button>
                    </Link>
                    <Button variant="secondary" size="lg">
                        Watch Demo
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
                    Why Choose Our Platform?
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Inventory App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
