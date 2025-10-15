import { createContext, useContext, useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'

const InventoryContext = createContext()

export const useInventory = () => {
    const context = useContext(InventoryContext)
    if (!context) {
        throw new Error('useInventory must be used within InventoryProvider')
    }
    return context
}

export const InventoryProvider = ({ children }) => {
    // Products hook
    const {
        products,
        loading: productsLoading,
        error: productsError,
        fetchProducts,
        createProduct: apiCreateProduct,
        deleteProduct: apiDeleteProduct,
        getProduct
    } = useProducts()

    // Orders hook
    const {
        orders: apiOrders,
        loading: ordersLoading,
        error: ordersError,
        fetchOrders,
        createOrder: apiCreateOrder,
        getOrder
    } = useOrders()

    // Local orders for backward compatibility
    const [localOrders, setLocalOrders] = useState(() => {
        const saved = localStorage.getItem('orders')
        return saved ? JSON.parse(saved) : []
    })

    // Combined orders (API + local)
    const orders = [...apiOrders, ...localOrders]

    // Fetch products and orders on mount
    useEffect(() => {
        fetchProducts().catch(console.error)
        fetchOrders().catch(console.error)
    }, [fetchProducts, fetchOrders])

    // Create product (API integration)
    const addProduct = async (productData) => {
        try {
            const newProduct = await apiCreateProduct(productData)
            return newProduct
        } catch (error) {
            console.error('Failed to create product via API:', error)
            throw error
        }
    }

    // Delete product (API integration)
    const deleteProduct = async (id) => {
        try {
            const success = await apiDeleteProduct(id)
            if (!success) {
                throw new Error('Failed to delete product')
            }
            return true
        } catch (error) {
            console.error('Failed to delete product via API:', error)
            throw error
        }
    }

    // Create order (API integration)
    const createOrder = async (productId, orderQuantity) => {
        const product = products.find(p => p.id === productId)
        if (!product || product.quantity < orderQuantity) {
            return { success: false, message: 'Insufficient stock or product not found' }
        }

        try {
            // Create order via API
            const newOrder = await apiCreateOrder({
                productId: productId,
                quantity: orderQuantity
            })

            // Add product name for display
            const orderWithProductName = {
                ...newOrder,
                product_name: product.name,
                createdAt: new Date().toISOString()
            }

            return { success: true, order: orderWithProductName }
        } catch (error) {
            console.error('Failed to create order via API:', error)

            // Fallback to local order creation
            const subtotal = product.price * orderQuantity
            const fee = subtotal * 0.03
            const total = subtotal + fee

            const localOrder = {
                id: Date.now().toString(),
                product_id: productId,
                product_name: product.name,
                price: product.price,
                fee: parseFloat(fee.toFixed(2)),
                total: parseFloat(total.toFixed(2)),
                quantity: orderQuantity,
                status: 'pending',
                createdAt: new Date().toISOString()
            }

            const updatedLocalOrders = [...localOrders, localOrder]
            setLocalOrders(updatedLocalOrders)
            localStorage.setItem('orders', JSON.stringify(updatedLocalOrders))

            return { success: true, order: localOrder }
        }
    }

    // Update order status (local only for now)
    const updateOrderStatus = (orderId, status) => {
        const updatedLocalOrders = localOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
        )
        setLocalOrders(updatedLocalOrders)
        localStorage.setItem('orders', JSON.stringify(updatedLocalOrders))
    }

    // Refund order (local only for now)
    const refundOrder = (orderId) => {
        const order = orders.find(o => o.id === orderId)
        if (order && order.status === 'completed') {
            updateOrderStatus(orderId, 'refunded')
            return true
        }
        return false
    }

    return (
        <InventoryContext.Provider value={{
            products,
            orders,
            loading: productsLoading || ordersLoading,
            error: productsError || ordersError,
            addProduct,
            deleteProduct,
            getProduct,
            createOrder,
            updateOrderStatus,
            refundOrder,
            getOrder,
            refreshProducts: fetchProducts,
            refreshOrders: fetchOrders
        }}>
            {children}
        </InventoryContext.Provider>
    )
}
