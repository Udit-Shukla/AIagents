import React from 'react'
import Sidebar from '../../components/Sidebar'

const NDACreation = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">NDA Creation</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">NDA creation tool coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NDACreation 