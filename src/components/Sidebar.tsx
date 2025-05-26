import React from 'react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const router = useRouter()
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 cursor-pointer" onClick={() => router.push('/')}>PriceAgent</h1>
        <nav>
          <ul className="space-y-4 ">
            <li>
              <a href="/stockComparison" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <span className="ml-2">Stock Comparison</span>
              </a>
            </li>
            <li>
              <a href="/contractComparison" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <span className="ml-2">Contract Comparison</span>
              </a>
            </li>
            <li>
              <a href="/ndaCreation" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <span className="ml-2">NDA Creation</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar