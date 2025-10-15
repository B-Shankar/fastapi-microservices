import { useState } from 'react'
import { Package, Clock, CheckCircle, XCircle, RefreshCcw } from 'lucide-react'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Orders = () => {
	const { orders, updateOrderStatus, refundOrder } = useInventory()
	const [filter, setFilter] = useState('all')

	const statusIcons = {
		pending: Clock,
		completed: CheckCircle,
		refunded: XCircle
	}

	const statusColors = {
		pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
		completed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
		refunded: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
	}

	const filteredOrders = orders.filter(order =>
		filter === 'all' || order.status === filter
	).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

	const handleStatusChange = (orderId, newStatus) => {
		updateOrderStatus(orderId, newStatus)
	}

	const handleRefund = (orderId) => {
		if (window.confirm('Are you sure you want to refund this order?')) {
			refundOrder(orderId)
		}
	}

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							Orders
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2">
							Manage your product orders
						</p>
					</div>

					{/* Filter Buttons */}
					<div className="flex space-x-2">
						{['all', 'pending', 'completed', 'refunded'].map((status) => (
							<Button
								key={status}
								variant={filter === status ? 'primary' : 'secondary'}
								size="sm"
								onClick={() => setFilter(status)}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</Button>
						))}
					</div>
				</div>

				{filteredOrders.length === 0 ? (
					<Card className="p-8 text-center">
						<Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
							No Orders Found
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							{filter === 'all' ? 'No orders have been created yet.' : `No ${filter} orders found.`}
						</p>
					</Card>
				) : (
					<div className="grid gap-4">
						{filteredOrders.map((order) => {
							const StatusIcon = statusIcons[order.status]
							return (
								<Card key={order.id} className="p-6">
									<div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<StatusIcon className="w-5 h-5" />
												<h3 className="font-semibold text-gray-800 dark:text-white">
													Order #{order.id}
												</h3>
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
												<div>
													<p className="text-gray-500 dark:text-gray-400">Product:</p>
													<p className="font-medium text-gray-800 dark:text-white">
														{order.product_name}
													</p>
												</div>
												<div>
													<p className="text-gray-500 dark:text-gray-400">Quantity:</p>
													<p className="font-medium text-gray-800 dark:text-white">
														{order.quantity}
													</p>
												</div>
												<div>
													<p className="text-gray-500 dark:text-gray-400">Unit Price:</p>
													<p className="font-medium text-gray-800 dark:text-white">
														${order.price.toFixed(2)}
													</p>
												</div>
												<div>
													<p className="text-gray-500 dark:text-gray-400">Total:</p>
													<p className="font-bold text-green-600 dark:text-green-400">
														${order.total.toFixed(2)}
													</p>
												</div>
											</div>

											<div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
												Created: {new Date(order.createdAt).toLocaleString()}
											</div>
										</div>

										<div className="flex space-x-2">
											{order.status === 'pending' && (
												<Button
													size="sm"
													onClick={() => handleStatusChange(order.id, 'completed')}
												>
													Complete
												</Button>
											)}

											{order.status === 'completed' && (
												<Button
													variant="danger"
													size="sm"
													onClick={() => handleRefund(order.id)}
												>
													<RefreshCcw size={16} className="mr-1" />
													Refund
												</Button>
											)}
										</div>
									</div>

									{/* Order Details */}
									<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
										<div className="grid grid-cols-3 gap-4 text-sm">
											<div>
												<span className="text-gray-500 dark:text-gray-400">Subtotal: </span>
												<span className="text-gray-800 dark:text-white">
                          ${(order.total - order.fee).toFixed(2)}
                        </span>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">Fee: </span>
												<span className="text-gray-800 dark:text-white">
                          ${order.fee.toFixed(2)}
                        </span>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">Total: </span>
												<span className="font-bold text-gray-800 dark:text-white">
                          ${order.total.toFixed(2)}
                        </span>
											</div>
										</div>
									</div>
								</Card>
							)
						})}
					</div>
				)}
			</div>
		</Layout>
	)
}

export default Orders
