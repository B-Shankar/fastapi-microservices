import apiClient from '../client.js'
import { API_ENDPOINTS } from '../endpoints.js'

export const productService = {
	// Get all products - returns array of products with "id" field
	async getProducts() {
		try {
			const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST)
			// Response is directly an array: [{ id, name, price, quantity }]
			return response
		} catch (error) {
			console.error('Error fetching products:', error)
			throw error
		}
	},

	// Create a new product - returns product with "pk" field
	async createProduct(productData) {
		try {
			const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, {
				name: productData.name,
				price: Number(productData.price),
				quantity: Number(productData.quantity)
			})

			// Response: { pk, name, price, quantity }
			// Normalize to use "id" instead of "pk" for consistency
			return {
				id: response.pk,
				name: response.name,
				price: response.price,
				quantity: response.quantity
			}
		} catch (error) {
			console.error('Error creating product:', error)
			throw error
		}
	},

	// Get product by ID - returns product with "pk" field
	async getProduct(id) {
		try {
			const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id))

			// Response: { pk, name, price, quantity }
			// Normalize to use "id" instead of "pk" for consistency
			return {
				id: response.pk,
				name: response.name,
				price: response.price,
				quantity: response.quantity
			}
		} catch (error) {
			console.error('Error fetching product:', error)
			throw error
		}
	},

	// Delete product by ID - returns 1 for success
	async deleteProduct(id) {
		try {
			const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
			// Response is just: 1 (for success)
			return response === 1 || response === "1"
		} catch (error) {
			console.error('Error deleting product:', error)
			throw error
		}
	}
}
