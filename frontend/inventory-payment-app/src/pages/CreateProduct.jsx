import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { addProduct } = useInventory()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required'
        }

        if (!formData.quantity || parseInt(formData.quantity) < 0) {
            newErrors.quantity = 'Valid quantity is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            await addProduct({
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            })

            navigate('/products')
        } catch (error) {
            alert('Failed to create product: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Create New Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Add a new product to your inventory
                    </p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Enter product name"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Price ($)"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                error={errors.price}
                                placeholder="0.00"
                                required
                            />

                            <Input
                                label="Quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                error={errors.quantity}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/products')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    )
}

export default CreateProduct
