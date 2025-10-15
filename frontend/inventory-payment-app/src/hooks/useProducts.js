import { useState, useCallback } from 'react'
import { productService } from '../api/services/productService.js'

export const useProducts = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	// Fetch all products
	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await productService.getProducts()

			// Response is directly an array of products
			setProducts(response || [])

			return response
		} catch (err) {
			setError(err)
			console.error('Fetch products error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	// Create product
	const createProduct = useCallback(async (productData) => {
		try {
			setLoading(true)
			setError(null)

			const newProduct = await productService.createProduct(productData)

			// Add to local state with normalized structure
			setProducts(prev => [...prev, newProduct])

			return newProduct
		} catch (err) {
			setError(err)
			console.error('Create product error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	// Get single product
	const getProduct = useCallback(async (id) => {
		try {
			setLoading(true)
			setError(null)

			const product = await productService.getProduct(id)
			return product
		} catch (err) {
			setError(err)
			console.error('Get product error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	// Delete product
	const deleteProduct = useCallback(async (id) => {
		try {
			setLoading(true)
			setError(null)

			const success = await productService.deleteProduct(id)

			if (success) {
				// Remove from local state
				setProducts(prev => prev.filter(product => product.id !== id))
				return true
			} else {
				throw new Error('Delete operation failed')
			}
		} catch (err) {
			setError(err)
			console.error('Delete product error:', err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		products,
		loading,
		error,
		fetchProducts,
		createProduct,
		getProduct,
		deleteProduct
	}
}
