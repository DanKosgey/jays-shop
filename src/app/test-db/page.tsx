"use client"

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/server/supabase/client'

export default function TestDBPage() {
  const [status, setStatus] = useState('Testing database connection...')
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Clear any potential cached data
    console.log('Clearing potential cached image data...');
    
    const testConnection = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        
        // Test the connection by trying to fetch featured products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .is('deleted_at', null)
          .limit(5)
        
        if (error) {
          setStatus('Database connection failed')
          setError(error.message)
        } else {
          setStatus(`Database connection successful! Found ${data.length} featured products.`)
          setProducts(data)
          setError(null)
        }
      } catch (err) {
        setStatus('Database connection failed')
        setError(err.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <p className="mb-2"><strong>Status:</strong> {status}</p>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      {products.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Featured Products:</h2>
          <ul className="list-disc pl-5">
            {products.map((product) => (
              <li key={product.id}>{product.name} - KSh {product.price}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-muted-foreground mt-4">
        This test checks if the application can connect to the Supabase database and fetch featured products.
      </p>
    </div>
  )
}