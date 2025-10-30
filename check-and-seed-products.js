// Script to check and seed products data
import { createClient } from '@supabase/supabase-js'

// Configuration - Update these with your Supabase credentials
const supabaseUrl = 'http://127.0.0.1:54322'
const supabaseKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz' // Using service role key

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndSeedProducts() {
  try {
    console.log('Checking for products with any image URLs...')
    
    // Check all products and their image URLs
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
    
    if (allError) {
      console.error('Error fetching all products:', allError)
      return
    }
    
    console.log(`Total products in database: ${allProducts.length}`)
    
    // Check each product's image URL
    allProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}: ${product.name} - Image URL: "${product.image_url}"`)
    })
    
    // Check specifically for the problematic Unsplash URL
    const { data: unsplashProducts, error: unsplashError } = await supabase
      .from('products')
      .select('*')
      .ilike('image_url', '%1688649516343%')
    
    if (unsplashError) {
      console.error('Error fetching products with Unsplash URLs:', unsplashError)
      return
    }
    
    console.log(`Found ${unsplashProducts.length} products with the specific Unsplash URL`)
    
    if (unsplashProducts.length > 0) {
      console.log('Updating products to remove the Unsplash URL...')
      
      // Update products with the specific Unsplash URL to have empty image URLs
      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({ image_url: '' })
        .ilike('image_url', '%1688649516343%')
        
      if (updateError) {
        console.error('Error updating product image URLs:', updateError)
      } else {
        console.log('Successfully updated product image URLs to empty')
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkAndSeedProducts()