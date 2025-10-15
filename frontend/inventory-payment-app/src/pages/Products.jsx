import { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'

const Products = () => {
	const {
		products,
		loading,
		error,
		deleteProduct,
		refreshProducts
	} = useInventory()

	const [searchTerm, setSearchTerm] = useState('')
	const [alert, setAlert] = useState(null)

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const handleDelete = async (productId) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			try {
				await deleteProduct(productId)
				setAlert({
					type: 'success',
					message: 'Product deleted successfully!'
				})

				// Clear alert after 3 seconds
				setTimeout(() => setAlert(null), 3000)
			} catch (err) {
				setAlert({
					type: 'error',
					title: 'Delete Failed',
					message: err.message || 'Failed to delete product'
				})
			}
		}
	}

	const handleRefresh = async () => {
		try {
			await refreshProducts()
			setAlert({
				type: 'success',
				message: 'Products refreshed successfully!'
			})
			setTimeout(() => setAlert(null), 3000)
		} catch (err) {
			setAlert({
				type: 'error',
				title: 'Refresh Failed',
				message: err.message || 'Failed to refresh products'
			})
		}
	}

	if (loading && products.length === 0) {
		return (
			<Layout>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span className="ml-2">Loading products...</span>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							All Products
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2">
							Manage your product inventory ({products.length} products)
						</p>
					</div>

					<div className="flex space-x-2">
						<Button
							onClick={handleRefresh}
							variant="secondary"
							disabled={loading}
						>
							<RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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

				{/* Alert */}
				{alert && (
					<Alert
						type={alert.type}
						title={alert.title}
						message={alert.message}
						onClose={() => setAlert(null)}
					/>
				)}

				{/* Error Display */}
				{error && !alert && (
					<Alert
						type="error"
						title="API Error"
						message={error.message}
					/>
				)}

				{/* Search */}
				<Card className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</Card>

				{/* Products Grid */}
				{filteredProducts.length === 0 ? (
					<Card className="p-8 text-center">
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
							{products.length === 0 ? 'No Products Yet' : 'No Products Found'}
						</h3>
						<p className="text-gray-500 dark:text-gray-400 mb-4">
							{products.length === 0
								? 'Create your first product to get started with inventory management.'
								: 'Try adjusting your search criteria.'
							}
						</p>
						{products.length === 0 && (
							<Link to="/create-product">
								<Button>
									<Plus className="w-4 h-4 mr-2" />
									Create Your First Product
								</Button>
							</Link>
						)}
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onDelete={handleDelete}
								showActions={true}
							/>
						))}
					</div>
				)}
			</div>
		</Layout>
	)
}

export default Products
