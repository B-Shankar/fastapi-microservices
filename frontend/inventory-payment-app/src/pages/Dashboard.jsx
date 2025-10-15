import { useState, useEffect } from 'react'
import {
    Package,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Eye,
    Plus,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

const Dashboard = () => {
    const {
        products,
        orders,
        loading,
        error,
        refreshProducts,
        refreshOrders
    } = useInventory()

    const [refreshing, setRefreshing] = useState(false)

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshProducts().catch(console.error)
            refreshOrders().catch(console.error)
        }, 30000)

        return () => clearInterval(interval)
    }, [refreshProducts, refreshOrders])

    // Calculate statistics
    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) => sum + product.quantity, 0)
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
    const lowStockProducts = products.filter(product => product.quantity < 10).length

    // Order statistics
    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'completed').length
    const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0)

    // Recent orders (last 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0))
        .slice(0, 5)

    // Low stock products
    const lowStockItems = products
        .filter(product => product.quantity < 10)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5)

    const stats = [
        {
            title: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            trend: '+12%',
            description: `${totalStock} total units`
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: ShoppingCart,
            color: 'bg-green-500',
            trend: '+8%',
            description: `${pendingOrders} pending`
        },
        {
            title: 'Inventory Value',
            value: `$${totalValue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-yellow-500',
            trend: '+15%',
            description: 'Total stock value'
        },
        {
            title: 'Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: TrendingUp,
            color: 'bg-purple-500',
            trend: '+22%',
            description: 'From completed orders'
        }
    ]

    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            await Promise.all([refreshProducts(), refreshOrders()])
        } catch (error) {
            console.error('Refresh failed:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'refunded':
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    if (loading && products.length === 0 && orders.length === 0) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading dashboard...</span>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Welcome to your inventory management system
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            onClick={handleRefresh}
                            variant="secondary"
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Link to="/create-product">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert
                        type="error"
                        title="API Error"
                        message={error.message}
                    />
                )}

                {/* Low Stock Alert */}
                {lowStockProducts > 0 && (
                    <Alert
                        type="warning"
                        title="Low Stock Alert"
                        message={`${lowStockProducts} products are running low on stock. Check inventory levels.`}
                    />
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.trend}
                  </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Recent Orders
                            </h2>
                            <Link to="/orders">
                                <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View All
                                </Button>
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No orders yet
                                </p>
                                <Link to="/buy-products">
                                    <Button size="sm" className="mt-2">
                                        Create First Order
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(order.status)}
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {order.product_name || `Product ${order.product_id}`}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Order #{order.id?.slice(-8)} • Qty: {order.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                ${order.total?.toFixed(2) || '0.00'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Low Stock Products */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Low Stock Alert
                            </h2>
                            <Link to="/products">
                                <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View All
                                </Button>
                            </Link>
                        </div>

                        {lowStockItems.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    All products are well stocked!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockItems.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ${product.price.toFixed(2)} per unit
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600 dark:text-red-400">
                                                {product.quantity} left
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Restock needed
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link to="/create-product">
                            <Button variant="secondary" className="w-full justify-start">
                                <Plus className="w-5 h-5 mr-3" />
                                Add New Product
                            </Button>
                        </Link>

                        <Link to="/buy-products">
                            <Button variant="secondary" className="w-full justify-start">
                                <ShoppingCart className="w-5 h-5 mr-3" />
                                Create Order
                            </Button>
                        </Link>

                        <Link to="/products?filter=low-stock">
                            <Button variant="secondary" className="w-full justify-start">
                                <AlertTriangle className="w-5 h-5 mr-3" />
                                Check Low Stock
                            </Button>
                        </Link>

                        <Link to="/orders">
                            <Button variant="secondary" className="w-full justify-start">
                                <Eye className="w-5 h-5 mr-3" />
                                View All Orders
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Summary Table */}
                {products.length > 0 && (
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Product Overview
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Value</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.slice(0, 10).map((product) => (
                                    <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            <div>
                                                <p>{product.name}</p>
                                                <p className="text-xs text-gray-500">ID: {product.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.quantity < 10
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : product.quantity < 50
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {product.quantity}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                                            ${(product.price * product.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.quantity < 10 ? (
                                                <span className="flex items-center text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Low Stock
                          </span>
                                            ) : (
                                                <span className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            In Stock
                          </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {products.length > 10 && (
                                <div className="mt-4 text-center">
                                    <Link to="/products">
                                        <Button variant="secondary" size="sm">
                                            View All {products.length} Products
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard
