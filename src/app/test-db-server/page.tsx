import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function TestDBServerPage() {
  let status = 'Testing database connection...'
  let error = null

  try {
    const supabase = getSupabaseServerClient()
    
    // Test the connection by trying to fetch from the products table
    const { data, error: dbError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (dbError) {
      status = 'Database connection failed'
      error = dbError.message
    } else {
      status = 'Database connection successful!'
      error = null
    }
  } catch (err) {
    status = 'Database connection failed'
    error = err.message
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Server-Side Database Connection Test</h1>
      <p className="mb-2"><strong>Status:</strong> {status}</p>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        This test checks if the server can connect to the Supabase database using the environment variables.
      </p>
    </div>
  )
}