import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const Alert = ({ type = 'info', title, message, onClose }) => {
	const variants = {
		success: {
			bg: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
			text: 'text-green-800 dark:text-green-200',
			icon: CheckCircle
		},
		error: {
			bg: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
			text: 'text-red-800 dark:text-red-200',
			icon: XCircle
		},
		warning: {
			bg: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
			text: 'text-yellow-800 dark:text-yellow-200',
			icon: AlertCircle
		},
		info: {
			bg: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
			text: 'text-blue-800 dark:text-blue-200',
			icon: Info
		}
	}

	const variant = variants[type]
	const Icon = variant.icon

	return (
		<div className={`border rounded-lg p-4 ${variant.bg} ${variant.text}`}>
			<div className="flex items-start">
				<Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
				<div className="flex-1">
					{title && (
						<h3 className="font-medium mb-1">{title}</h3>
					)}
					<p className="text-sm">{message}</p>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<XCircle className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	)
}

export default Alert
