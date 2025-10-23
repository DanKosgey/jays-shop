const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, is_featured');
      
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    console.log('Products in database:');
    if (data && data.length > 0) {
      data.forEach(p => {
        console.log(` - ${p.name} (featured: ${p.is_featured})`);
      });
    } else {
      console.log('No products found in database');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkProducts();