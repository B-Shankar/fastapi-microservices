// # Base API client configuration

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const ORDERS_BASE_URL = import.meta.env.VITE_ORDERS_API_BASE_URL || 'http://localhost:8001'

class ApiClient {
	constructor() {
		this.baseURL = BASE_URL
		this.ordersBaseURL = ORDERS_BASE_URL
	}

	// Get custom headers for orders API
	getOrderHeaders(customHeaders = {}) {
		return {
			'Accept': 'application/json',
			'Accept-Language': 'en-GB,en;q=0.9,kn;q=0.8,en-US;q=0.7,ml;q=0.6',
			'Branch-id': '716',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Content-Type': 'application/json',
			'Facility-id': '456',
			'Pragma': 'no-cache',
			...customHeaders
		}
	}

	// Regular headers for products API
	getHeaders(customHeaders = {}) {
		return {
			'accept': 'application/json',
			'Content-Type': 'application/json',
			...customHeaders
		}
	}

	async request(endpoint, options = {}, useOrdersAPI = false) {
		const baseUrl = useOrdersAPI ? this.ordersBaseURL : this.baseURL
		const url = `${baseUrl}${endpoint}`
		const headers = useOrdersAPI
			? this.getOrderHeaders(options.headers)
			: this.getHeaders(options.headers)

		const config = {
			headers,
			mode: 'cors',
			...options
		}

		try {
			const response = await fetch(url, config)

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`, errorData)
			}

			// Handle empty responses
			if (response.status === 204 || response.headers.get('content-length') === '0') {
				return { success: true }
			}

			const contentType = response.headers.get('content-type')
			if (contentType && contentType.includes('application/json')) {
				return await response.json()
			}

			return await response.text()
		} catch (error) {
			if (error instanceof ApiError) {
				throw error
			}
			throw new ApiError(0, 'Network error', { originalError: error.message })
		}
	}

	// Products API methods
	async get(endpoint) {
		return this.request(endpoint, { method: 'GET' })
	}

	async post(endpoint, data = {}) {
		return this.request(endpoint, {
			method: 'POST',
			body: JSON.stringify(data)
		})
	}

	async delete(endpoint) {
		return this.request(endpoint, { method: 'DELETE' })
	}

	// Orders API methods
	async getOrder(endpoint) {
		return this.request(endpoint, { method: 'GET' }, true)
	}

	async postOrder(endpoint, data = {}) {
		return this.request(endpoint, {
			method: 'POST',
			body: JSON.stringify(data)
		}, true)
	}
}

export class ApiError extends Error {
	constructor(status, message, details = {}) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.details = details
	}
}

export const apiClient = new ApiClient()
export default apiClient
