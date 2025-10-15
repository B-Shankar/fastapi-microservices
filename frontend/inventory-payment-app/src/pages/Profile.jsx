import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const Profile = () => {
	const { user } = useAuth()
	const { products, orders } = useInventory()
	const [isEditing, setIsEditing] = useState(false)
	const [profileData, setProfileData] = useState({
		name: user?.name || 'Test User',
		email: user?.email || 'test@gmail.com',
		phone: '+1 (555) 123-4567',
		address: '123 Business Street, City, State 12345',
		company: 'My Business Inc.',
		joinDate: '2024-01-15',
		bio: 'Inventory management professional with experience in retail operations and product management.'
	})

	const [tempData, setTempData] = useState(profileData)

	const handleEdit = () => {
		setTempData(profileData)
		setIsEditing(true)
	}

	const handleSave = () => {
		setProfileData(tempData)
		setIsEditing(false)
		// In a real app, you would save to backend here
	}

	const handleCancel = () => {
		setTempData(profileData)
		setIsEditing(false)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setTempData(prev => ({ ...prev, [name]: value }))
	}

	// Calculate user statistics
	const totalProducts = products.length
	const totalOrders = orders.length
	const completedOrders = orders.filter(order => order.status === 'completed').length
	const totalRevenue = orders
		.filter(order => order.status === 'completed')
		.reduce((sum, order) => sum + order.total, 0)

	const userStats = [
		{
			label: 'Total Products',
			value: totalProducts,
			icon: User,
			color: 'bg-blue-500'
		},
		{
			label: 'Total Orders',
			value: totalOrders,
			icon: Mail,
			color: 'bg-green-500'
		},
		{
			label: 'Completed Orders',
			value: completedOrders,
			icon: Phone,
			color: 'bg-purple-500'
		},
		{
			label: 'Total Revenue',
			value: `$${totalRevenue.toFixed(2)}`,
			icon: MapPin,
			color: 'bg-yellow-500'
		}
	]

	const recentActivity = [
		...orders.slice(-3).reverse().map(order => ({
			type: 'order',
			message: `Order #${order.id} - ${order.product_name}`,
			time: new Date(order.createdAt).toLocaleDateString(),
			status: order.status
		})),
		...products.slice(-2).reverse().map(product => ({
			type: 'product',
			message: `Added product "${product.name}"`,
			time: new Date(product.createdAt || Date.now()).toLocaleDateString(),
			status: 'created'
		}))
	].slice(0, 5)

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							Profile
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2">
							Manage your account information and preferences
						</p>
					</div>

					{!isEditing && (
						<Button onClick={handleEdit}>
							<Edit2 className="w-4 h-4 mr-2" />
							Edit Profile
						</Button>
					)}
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Profile Information */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Information */}
						<Card className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-800 dark:text-white">
									Basic Information
								</h2>
								{isEditing && (
									<div className="flex space-x-2">
										<Button size="sm" onClick={handleSave}>
											<Save className="w-4 h-4 mr-1" />
											Save
										</Button>
										<Button size="sm" variant="secondary" onClick={handleCancel}>
											<X className="w-4 h-4 mr-1" />
											Cancel
										</Button>
									</div>
								)}
							</div>

							{/* Avatar Section */}
							<div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
								<div className="relative">
									<div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
										<User className="w-10 h-10 text-white" />
									</div>
									{isEditing && (
										<button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
											<Camera className="w-4 h-4" />
										</button>
									)}
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
										{profileData.name}
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										{profileData.email}
									</p>
									<p className="text-sm text-blue-600 dark:text-blue-400">
										Member since {new Date(profileData.joinDate).toLocaleDateString()}
									</p>
								</div>
							</div>

							{/* Form Fields */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="Full Name"
									name="name"
									value={isEditing ? tempData.name : profileData.name}
									onChange={handleChange}
									disabled={!isEditing}
									icon={User}
								/>

								<Input
									label="Email Address"
									name="email"
									type="email"
									value={isEditing ? tempData.email : profileData.email}
									onChange={handleChange}
									disabled={!isEditing}
									icon={Mail}
								/>

								<Input
									label="Phone Number"
									name="phone"
									value={isEditing ? tempData.phone : profileData.phone}
									onChange={handleChange}
									disabled={!isEditing}
									icon={Phone}
								/>

								<Input
									label="Company"
									name="company"
									value={isEditing ? tempData.company : profileData.company}
									onChange={handleChange}
									disabled={!isEditing}
								/>
							</div>

							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Address
								</label>
								<div className="relative">
									<MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
									<textarea
										name="address"
										value={isEditing ? tempData.address : profileData.address}
										onChange={handleChange}
										disabled={!isEditing}
										rows={2}
										className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
											!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''
										}`}
									/>
								</div>
							</div>

							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Bio
								</label>
								<textarea
									name="bio"
									value={isEditing ? tempData.bio : profileData.bio}
									onChange={handleChange}
									disabled={!isEditing}
									rows={3}
									className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
										!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''
									}`}
									placeholder="Tell us about yourself..."
								/>
							</div>
						</Card>

						{/* Recent Activity */}
						<Card className="p-6">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
								Recent Activity
							</h2>
							{recentActivity.length === 0 ? (
								<p className="text-gray-500 dark:text-gray-400 text-center py-4">
									No recent activity
								</p>
							) : (
								<div className="space-y-3">
									{recentActivity.map((activity, index) => (
										<div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className={`w-2 h-2 rounded-full ${
												activity.status === 'completed' ? 'bg-green-400' :
													activity.status === 'pending' ? 'bg-yellow-400' :
														activity.status === 'refunded' ? 'bg-red-400' :
															'bg-blue-400'
											}`} />
											<div className="flex-1">
												<p className="text-sm text-gray-800 dark:text-white">
													{activity.message}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{activity.time}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</Card>
					</div>

					{/* Statistics Sidebar */}
					<div className="space-y-6">
						{/* User Statistics */}
						<Card className="p-6">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
								Your Statistics
							</h2>
							<div className="space-y-4">
								{userStats.map((stat, index) => (
									<div key={index} className="flex items-center space-x-3">
										<div className={`${stat.color} p-2 rounded-lg`}>
											<stat.icon className="w-4 h-4 text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{stat.label}
											</p>
											<p className="font-semibold text-gray-800 dark:text-white">
												{stat.value}
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>

						{/* Account Information */}
						<Card className="p-6">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
								Account Information
							</h2>
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">Account Type:</span>
									<span className="text-gray-800 dark:text-white font-medium">Premium</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">Member Since:</span>
									<span className="text-gray-800 dark:text-white font-medium">
                    {new Date(profileData.joinDate).toLocaleDateString()}
                  </span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">Last Login:</span>
									<span className="text-gray-800 dark:text-white font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">Status:</span>
									<span className="text-green-600 dark:text-green-400 font-medium">Active</span>
								</div>
							</div>
						</Card>

						{/* Quick Actions */}
						<Card className="p-6">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
								Quick Actions
							</h2>
							<div className="space-y-2">
								<Button variant="secondary" size="sm" className="w-full justify-start">
									<Mail className="w-4 h-4 mr-2" />
									Change Password
								</Button>
								<Button variant="secondary" size="sm" className="w-full justify-start">
									<User className="w-4 h-4 mr-2" />
									Privacy Settings
								</Button>
								<Button variant="secondary" size="sm" className="w-full justify-start">
									<Calendar className="w-4 h-4 mr-2" />
									Download Data
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Profile
