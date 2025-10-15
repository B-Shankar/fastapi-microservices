import { useState, useCallback } from 'react'
import { orderService } from '../api/services/orderService.js'

export const useOrders = () => {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	// Fetch all orders
	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await orderService.getOrders()
			setOrders(response || [])

			return response
		} catch (err) {
			setError(err)
			console.error('Fetch orders error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	// Create order
	const createOrder = useCallback(async (orderData) => {
		try {
			setLoading(true)
			setError(null)

			const newOrder = await orderService.createOrder(orderData)

			// Add to local state
			setOrders(prev => [...prev, newOrder])

			return newOrder
		} catch (err) {
			setError(err)
			console.error('Create order error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	// Get single order
	const getOrder = useCallback(async (id) => {
		try {
			setLoading(true)
			setError(null)

			const order = await orderService.getOrder(id)

			// Update order in local state if it exists
			setOrders(prev =>
				prev.map(existingOrder =>
					existingOrder.id === id ? order : existingOrder
				)
			)

			return order
		} catch (err) {
			setError(err)
			console.error('Get order error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		orders,
		loading,
		error,
		fetchOrders,
		createOrder,
		getOrder
	}
}
