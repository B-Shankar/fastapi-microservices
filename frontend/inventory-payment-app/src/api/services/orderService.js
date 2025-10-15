// # Order-related API calls

import apiClient from '../client.js'
import { API_ENDPOINTS } from '../endpoints.js'

export const orderService = {
	// Create a new order
	async createOrder(orderData) {
		try {
			const response = await apiClient.postOrder(API_ENDPOINTS.ORDERS.CREATE, {
				id: orderData.productId,
				quantity: Number(orderData.quantity)
			})

			// Response: { pk, product_id, price, fee, total, quantity, status }
			// Normalize to use "id" instead of "pk" for consistency
			return {
				id: response.pk,
				product_id: response.product_id,
				price: response.price,
				fee: response.fee,
				total: response.total,
				quantity: response.quantity,
				status: response.status
			}
		} catch (error) {
			console.error('Error creating order:', error)
			throw error
		}
	},

	// Get order by ID
	async getOrder(id) {
		try {
			const response = await apiClient.getOrder(API_ENDPOINTS.ORDERS.DETAIL(id))

			// Response: { pk, product_id, price, fee, total, quantity, status }
			// Normalize to use "id" instead of "pk" for consistency
			return {
				id: response.pk,
				product_id: response.product_id,
				price: response.price,
				fee: response.fee,
				total: response.total,
				quantity: response.quantity,
				status: response.status
			}
		} catch (error) {
			console.error('Error fetching order:', error)
			throw error
		}
	},

	// Get all orders (if endpoint exists)
	async getOrders() {
		try {
			const response = await apiClient.getOrder(API_ENDPOINTS.ORDERS.LIST)
			return Array.isArray(response) ? response : []
		} catch (error) {
			console.error('Error fetching orders:', error)
			throw error
		}
	}
}
