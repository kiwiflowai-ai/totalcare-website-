import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to parse price and extract numeric value
function parsePrice(priceStr: string): number {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Function to clean and format data for Airtable
function formatForAirtable(products: any[]) {
  return products.map(product => ({
    'Product ID': product.id,
    'Product Name': product.name,
    'Brand': product.brand,
    'Model': product.model,
    'Series': product.series,
    'Price': product.price,
    'Price Numeric': parsePrice(product.price),
    'Cooling Capacity': product.coolingCapacity,
    'Heating Capacity': product.heatingCapacity,
    'Has WiFi': product.hasWifi ? 'Yes' : 'No',
    'Description': product.description.replace(/\n/g, ' ').trim(),
    'Image URL': product.image,
    'Promotions': product.promotions || '',
    'Created Date': new Date().toISOString().split('T')[0]
  }));
}

// Generate CSV content
function generateCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

// Main execution
try {
  console.log('🔄 Processing products...');
  const formattedData = formatForAirtable(products);
  const csvContent = generateCSV(formattedData);
  
  // Write to CSV file
  const outputPath = path.join(__dirname, 'products-for-airtable.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  
  console.log(`✅ Successfully exported ${products.length} products to: ${outputPath}`);
  console.log('\n📋 Next steps:');
  console.log('1. Open Airtable and create a new base or use an existing one');
  console.log('2. Create a table with these fields:');
  console.log('   - Product ID (Single line text)');
  console.log('   - Product Name (Single line text)');
  console.log('   - Brand (Single select)');
  console.log('   - Model (Single line text)');
  console.log('   - Series (Single select)');
  console.log('   - Price (Single line text)');
  console.log('   - Price Numeric (Number)');
  console.log('   - Cooling Capacity (Single line text)');
  console.log('   - Heating Capacity (Single line text)');
  console.log('   - Has WiFi (Checkbox)');
  console.log('   - Description (Long text)');
  console.log('   - Image URL (URL)');
  console.log('   - Promotions (Single line text)');
  console.log('   - Created Date (Date)');
  console.log('3. Import the CSV file using Airtable\'s import feature');
  console.log('4. Set up the Brand and Series fields as single select fields with the appropriate options');
  
} catch (error) {
  console.error('❌ Error exporting products:', error.message);
}





