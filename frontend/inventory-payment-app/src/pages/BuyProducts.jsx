import { useState } from 'react'
import { ShoppingCart, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { useInventory } from '../context/InventoryContext'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'

const BuyProducts = () => {
    const { products, createOrder, loading } = useInventory()
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderResult, setOrderResult] = useState(null)

    const availableProducts = products.filter(product => product.quantity > 0)

    const handleProductSelect = (product) => {
        setSelectedProduct(product)
        setQuantity(1)
        setOrderResult(null)
    }

    const calculateOrderSummary = () => {
        if (!selectedProduct) return null

        const subtotal = selectedProduct.price * quantity
        const fee = subtotal * 0.02 // 2% fee (you can adjust this)
        const total = subtotal + fee

        return {
            subtotal: subtotal.toFixed(2),
            fee: fee.toFixed(2),
            total: total.toFixed(2)
        }
    }

    const handlePurchase = async () => {
        if (!selectedProduct || quantity < 1) return

        setIsProcessing(true)

        try {
            const result = await createOrder(selectedProduct.id, quantity)
            setOrderResult(result)

            if (result.success) {
                setSelectedProduct(null)
                setQuantity(1)
            }
        } catch (error) {
            setOrderResult({
                success: false,
                message: error.message || 'Failed to create order'
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const orderSummary = calculateOrderSummary()

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Buy Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Purchase products from your inventory
                    </p>
                </div>

                {/* Order Result Alert */}
                {orderResult && (
                    <Alert
                        type={orderResult.success ? 'success' : 'error'}
                        title={orderResult.success ? 'Order Created Successfully!' : 'Order Failed'}
                        message={
                            orderResult.success
                                ? `Order ID: ${orderResult.order?.id} - Status: ${orderResult.order?.status}`
                                : orderResult.message
                        }
                        onClose={() => setOrderResult(null)}
                    />
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Product Selection */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Available Products
                        </h2>

                        {availableProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No products available for purchase
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {availableProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                            selectedProduct?.id === product.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                        }`}
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Available: {product.quantity} units
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    ID: {product.id}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    per unit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Order Summary */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Order Summary
                        </h2>

                        {!selectedProduct ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Select a product to create an order
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                        {selectedProduct.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ${selectedProduct.price.toFixed(2)} per unit
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Product ID: {selectedProduct.id}
                                    </p>
                                </div>

                                <div>
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        max={selectedProduct.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                </div>

                                {orderSummary && (
                                    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                            <span className="text-gray-800 dark:text-white">
                        ${orderSummary.subtotal}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                                            <span className="text-gray-800 dark:text-white">
                        ${orderSummary.fee}
                      </span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <span className="text-gray-800 dark:text-white">Total:</span>
                                            <span className="text-green-600 dark:text-green-400">
                        ${orderSummary.total}
                      </span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handlePurchase}
                                    disabled={isProcessing || quantity < 1 || quantity > selectedProduct.quantity || loading}
                                    className="w-full"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Processing Order...
                                        </div>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}

export default BuyProducts
