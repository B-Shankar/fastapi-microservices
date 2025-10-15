import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { InventoryProvider } from './context/InventoryContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import CreateProduct from './pages/CreateProduct'
import BuyProducts from './pages/BuyProducts'
import Orders from './pages/Orders'
import Profile from './pages/Profile'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" />
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <InventoryProvider>
                    <Router>
                        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/create-product"
                                    element={
                                        <ProtectedRoute>
                                            <CreateProduct />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products"
                                    element={
                                        <ProtectedRoute>
                                            <Products />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/buy-products"
                                    element={
                                        <ProtectedRoute>
                                            <BuyProducts />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <Orders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </Router>
                </InventoryProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
