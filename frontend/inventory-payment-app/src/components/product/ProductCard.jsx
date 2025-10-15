import { Package, Edit, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProductCard = ({ product, onEdit, onDelete, showActions = true }) => {
    const isLowStock = product.quantity < 10

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                        <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {product.id}
                        </p>
                    </div>
                </div>

                {showActions && (
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(product)}
                        >
                            <Edit size={16} />
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete?.(product.id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
            ${product.price.toFixed(2)}
          </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                        isLowStock
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
            {product.quantity} {isLowStock && '(Low Stock)'}
          </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Value:</span>
                        <span className="font-bold text-gray-800 dark:text-white">
              ${(product.price * product.quantity).toFixed(2)}
            </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ProductCard
