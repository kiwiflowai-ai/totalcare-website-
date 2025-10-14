import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the products file
const productsFilePath = path.join(__dirname, 'src', 'data', 'products.ts');
const productsContent = fs.readFileSync(productsFilePath, 'utf8');

// Extract products array using regex (simple approach)
const productsMatch = productsContent.match(/export const products: Product\[\] = \[([\s\S]*?)\];/);
if (!productsMatch) {
  console.error('❌ Could not find products array in the file');
  process.exit(1);
}

// Parse the products (this is a simplified parser - you might need to adjust)
const productsText = productsMatch[1];
const products = [];

// Split by product objects (looking for { pattern)
const productBlocks = productsText.split(/(?=\s*{)/).filter(block => block.trim().startsWith('{'));

for (const block of productBlocks) {
  try {
    // Extract key-value pairs using regex
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const brandMatch = block.match(/brand:\s*"([^"]+)"/);
    const modelMatch = block.match(/model:\s*"([^"]+)"/);
    const priceMatch = block.match(/price:\s*"([^"]+)"/);
    const seriesMatch = block.match(/series:\s*"([^"]+)"/);
    const coolingMatch = block.match(/coolingCapacity:\s*"([^"]*)"/);
    const heatingMatch = block.match(/heatingCapacity:\s*"([^"]*)"/);
    const wifiMatch = block.match(/hasWifi:\s*(true|false)/);
    const imageMatch = block.match(/image:\s*"([^"]+)"/);
    
    // Extract description (multiline)
    const descMatch = block.match(/description:\s*`([\s\S]*?)`/);
    
    if (idMatch && nameMatch && brandMatch) {
      products.push({
        id: idMatch[1],
        name: nameMatch[1],
        brand: brandMatch[1],
        model: modelMatch ? modelMatch[1] : '',
        price: priceMatch ? priceMatch[1] : '',
        series: seriesMatch ? seriesMatch[1] : '',
        coolingCapacity: coolingMatch ? coolingMatch[1] : '',
        heatingCapacity: heatingMatch ? heatingMatch[1] : '',
        hasWifi: wifiMatch ? wifiMatch[1] === 'true' : false,
        image: imageMatch ? imageMatch[1] : '',
        description: descMatch ? descMatch[1].replace(/\n/g, ' ').trim() : ''
      });
    }
  } catch (error) {
    console.warn('⚠️  Could not parse product block:', error.message);
  }
}

// Function to parse price and extract numeric value
function parsePrice(priceStr) {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Function to clean and format data for Airtable
function formatForAirtable(products) {
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
    'Description': product.description,
    'Image URL': product.image,
    'Promotions': '',
    'Created Date': new Date().toISOString().split('T')[0]
  }));
}

// Generate CSV content
function generateCSV(data) {
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
  console.log(`📊 Found ${products.length} products`);
  
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





