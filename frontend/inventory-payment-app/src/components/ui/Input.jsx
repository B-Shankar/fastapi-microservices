// import { forwardRef } from 'react'
//
// const Input = forwardRef(({
//                               label,
//                               error,
//                               className = '',
//                               ...props
//                           }, ref) => {
//     return (
//         <div className="space-y-1">
//             {label && (
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {label}
//                 </label>
//             )}
//             <input
//                 ref={ref}
//                 className={`
//                   w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
//                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                   dark:bg-gray-700 dark:border-gray-600 dark:text-white
//                   ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
//                   ${className}
//                 `}
//                 {...props}
//             />
//             {error && (
//                 <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//             )}
//         </div>
//     )
// })
//
// Input.displayName = 'Input'
// export default Input

import { forwardRef } from 'react'

const Input = forwardRef(({
                              label,
                              error,
                              icon: Icon,
                              className = '',
                              disabled = false,
                              ...props
                          }, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <input
                    ref={ref}
                    className={`
            w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${disabled ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
                    disabled={disabled}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
