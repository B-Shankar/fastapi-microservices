// # API endpoint constants

export const API_ENDPOINTS = {
	// Products API (port 8000)
	PRODUCTS: {
		LIST: '/products',           // GET all products
		CREATE: '/product',          // POST create product (note: singular)
		DETAIL: (id) => `/products/${id}`,  // GET product by ID
		DELETE: (id) => `/products/${id}`   // DELETE product by ID
	},

	// Orders API (port 8001)
	ORDERS: {
		CREATE: '/orders',
		DETAIL: (id) => `/orders/${id}`,
		LIST: '/orders',
		UPDATE: (id) => `/orders/${id}`
	}
}
