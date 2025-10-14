// Product data from Supabase
export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  model: string;
  price: string;
  promotions?: string;
  coolingCapacity: string;
  heatingCapacity: string;
  hasWifi: boolean;
  series: string;
  image: string;
  product_images: string[];
}

// Parse price string to extract numeric value
function parsePrice(priceStr: string): number {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Extract capacity from description
function extractCapacity(description: string, type: 'cooling' | 'heating'): string {
  const regex = type === 'cooling' 
    ? /Cooling:\s*(\d+\.?\d*)\s*kW/i
    : /Heating:\s*(\d+\.?\d*)\s*kW/i;
  const match = description.match(regex);
  return match ? `${match[1]}kW` : '';
}


// Check if product has WiFi
function hasWifi(description: string, name: string): boolean {
  return description.toLowerCase().includes('wifi') || 
         description.toLowerCase().includes('wi-fi') ||
         name.toLowerCase().includes('wifi');
}

// Generate product ID
function generateId(name: string, model: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase()}`;
}

import { supabase } from '@/lib/supabase';

// Function to fetch products from Supabase
export async function getProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products from Supabase...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No products found in Supabase');
      return [];
    }

    // Convert Supabase format to our Product interface
    const convertedProducts = data.map((product: any) => {
      // Log details for product 222 specifically
      if (product.id === '222') {
        console.log('=== PRODUCT 222 DETAILS ===');
        console.log('Product name:', product.name);
        console.log('Product images type:', typeof product.product_images);
        console.log('Product images value:', product.product_images);
        console.log('Is array?', Array.isArray(product.product_images));
        if (Array.isArray(product.product_images)) {
          console.log('Array length:', product.product_images.length);
          product.product_images.forEach((img, index) => {
            console.log(`Image ${index}:`, {
              type: typeof img,
              length: img?.length || 0,
              startsWith: img?.substring(0, 50) || 'null/undefined',
              isBase64: img?.startsWith('data:image/') || false
            });
          });
        } else {
          console.log('Product images is not an array, value:', product.product_images);
        }
        console.log('========================');
      }
      
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description || '',
        model: product.model || '',
        price: product.price || '',
        promotions: (product.promotions && product.promotions !== '[]' && product.promotions.trim() !== '') ? product.promotions : '',
        coolingCapacity: product.cooling_capacity || '',
        heatingCapacity: product.heating_capacity || '',
        hasWifi: product.has_wifi || false,
        series: product.series || '',
        image: product.image || '',
        product_images: product.product_images || []
      };
    });

    console.log(`Successfully converted ${convertedProducts.length} products`);
    
    // Debug: Check for EV charger products in converted data
    const evChargers = convertedProducts.filter(p => p.brand === 'Wallbox' || p.brand === 'Tesla');
    console.log('EV Charger products in converted data:', evChargers.length);
    evChargers.forEach(p => console.log(`  - ${p.brand} ${p.name}`));
    
    return convertedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Legacy products array for backward compatibility (fallback)
export const products: Product[] = [
  {
    id: "daikin-standard-20-27kw-heat-pump-ftxv20u",
    name: "Daikin Standard 2.0/2.7kw Heat Pump",
    brand: "Daikin",
    description: `Cooling:  2.0 kW
Heating:  2.7 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:285x770x223
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        42/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        Cool (dBA)        47/43
Heat (dBA)        48/44`,
    model: "FTXV20U",
    price: "$1553+GST",
    promotions: undefined,
    coolingCapacity: "2.0kW",
    heatingCapacity: "2.7kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-cora-20-28kw-heat-pump-ftxm25u",
    name: "Daikin Cora 2.0/2.8kw Heat Pump",
    brand: "Daikin",
    description: `Cooling:  2.0 kW
Heating:  2.8 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:285x770x226
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        42/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        Cool (dBA)        47/43
Heat (dBA)        48/44`,
    model: "FTXM25U",
    price: "$1620+GST ",
    promotions: undefined,
    coolingCapacity: "2.0kW",
    heatingCapacity: "2.8kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-22-27-kw-heat-pump-with-wifi-ftxm20y",
    name: "Daikin Alira 2.2/2.7 kw Heat Pump with WIFI",
    brand: "Daikin",
    description: `Cooling:  2.2 kW
Heating:  2.7 kW

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x920x275
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        41/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        Cool (dBA)        47/43
Heat (dBA)        48/44`,
    model: "FTXM20Y",
    price: "$1721+GST",
    promotions: undefined,
    coolingCapacity: "2.2kW",
    heatingCapacity: "2.7kW",
    hasWifi: true,
    series: "Alira",
    image: "/src/assets/Daikin/Alira/FTXM20U Alira 2.0-2.7/Alira 2.0 kw.JPG"
  },
  {
    id: "daikin-standard-25-30kw-heat-pump-ftxv25u",
    name: "Daikin Standard 2.5/3.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  2.50 kW
Heating:  3.20 kW


Dimensions (HxWxD)
Indoor:285x770x223
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)	42/19
Heat (dBA)	40/20
Outdoor Sound Level (H/SL)	Cool (dBA)	47/43
Heat (dBA)	48/44`,
    model: "FTXV25U",
    price: "$1566+GST",
    promotions: undefined,
    coolingCapacity: "2.50kW",
    heatingCapacity: "3.20kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-cora-25-30kw-heat-pump-ftxm25u",
    name: "Daikin Cora 2.5/3.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  2.50 kW
Heating:  3.20 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:285x770x226
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)	42/19
Heat (dBA)	40/20
Outdoor Sound Level (H/SL)	Cool (dBA)	47/43
Heat (dBA)	48/44`,
    model: "FTXM25U",
    price: "$1750+GST",
    promotions: undefined,
    coolingCapacity: "2.50kW",
    heatingCapacity: "3.20kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-25-32kw-heat-pump-ftxm25wvma",
    name: "Daikin Alira 2.5/3.2kw heat pump",
    brand: "Daikin",
    description: `Cooling:  2.50 kW
Heating:  3.20 kW

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x920x275
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        41/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        Cool (dBA)        47/43
Heat (dBA)        48/44`,
    model: "FTXM25WVMA",
    price: "$1844+GST",
    promotions: undefined,
    coolingCapacity: "2.50kW",
    heatingCapacity: "3.20kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-35-37kw-heat-pump-ftxv35u",
    name: "Daikin Standard 3.5/3.7kw heat pump",
    brand: "Daikin",
    description: `Cooling:  3.5 kW
Heating:  3.7kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:285x770x223
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        42/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        Cool (dBA)        49/44
Heat (dBA)        49/45`,
    model: "FTXV35U",
    price: "$1735+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "3.7kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-new-cora-35-40kw-heat-pump-ftxm35u",
    name: "Daikin New Cora 3.5/4.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  3.5 kW
Heating:  4.0 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:285x770x226
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)	42/19
Heat (dBA)	40/20
Outdoor Sound Level (H/SL)	Cool (dBA)	49/44
Heat (dBA)	50/45`,
    model: "FTXM35U",
    price: "$1888+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "4.0kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-35-37kw-heat-pump-ftxm35y",
    name: "Daikin Alira 3.5/3.7kw heat pump",
    brand: "Daikin",
    description: `Cooling:  3.5 kW
Heating:  3.7 kW

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x920x275
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        42/19
Heat (dBA)        42/20
Outdoor Sound Level (H/SL)        Cool (dBA)        49/44
Heat (dBA)        49/45`,
    model: "FTXM35Y",
    price: "$2001+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "3.7kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-50-60kw-heat-pump-ftxv50u",
    name: "Daikin Standard 5.0/6.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  5.0 kW
Heating:  6.0 kW

Optional WiFi Adaptor

Dimensions (HxWxD)
Indoor:295x990x264
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)        45/28
Heat (dBA)        45/28
Outdoor Sound Level (H/SL)        Cool (dBA)        47/44
Heat (dBA)        48/45`,
    model: "FTXV50U",
    price: "$2125+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-new-cora-50-61kw-heat-pump-ftxm50u",
    name: "Daikin New Cora 5.0/6.1kw heat pump",
    brand: "Daikin",
    description: `Cooling:  5.0 kW
Heating:  6.1 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:295x990x226
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	45/28
Heat (dBA)	45/28
Outdoor Sound Level (H/SL)	
Cool (dBA)	47/44
Heat (dBA)	48/45`,
    model: "FTXM50U",
    price: "$2302+GST ",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.1kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-50-60kw-heat-pump-with-wifi-ftxm50w",
    name: "Daikin Alira 5.0/6.0kw heat pump with WIFI",
    brand: "Daikin",
    description: `Cooling:  5.0 kW
Heating:  6.0 kW

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x1100x275
Outdoor:695x930x275

Indoor Sound Level (H/SL)
Cool (dBA)        45/28
Heat (dBA)        45/28
Outdoor Sound Level (H/SL)        Cool (dBA)        47/44
Heat (dBA)        48/45`,
    model: "FTXM50W",
    price: "$2498+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-60-72kw-heat-pump-ftxv60u",
    name: "Daikin Standard 6.0/7.2kw heat pump",
    brand: "Daikin",
    description: `Cooling:  6.0kW
Heating:  7.2kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:295x990x263
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	48/29
Heat (dBA)	48/29
Outdoor Sound Level (H/SL)	Cool (dBA)	49/45
Heat (dBA)	52/45`,
    model: "FTXV60U",
    price: "$2619+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "7.2kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-new-cora-60-73kw-heat-pump-ftxm60u",
    name: "Daikin New Cora 6.0/7.3kw heat pump",
    brand: "Daikin",
    description: `Cooling:  6.0 kW
Heating:  7.3 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:295x990x226
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	48/29
Heat (dBA)	48/29
Outdoor Sound Level (H/SL)	
Cool (dBA)	49/45
Heat (dBA)	52/45`,
    model: "FTXM60U",
    price: "$2714+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "7.3kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-60-72kw-heat-pump-with-wifi-ftxm60w",
    name: "Daikin Alira 6.0/7.2kw heat pump with WiFi",
    brand: "Daikin",
    description: `Cooling:  6.2 kW
Heating:  7.3 kW

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x1100x275
Outdoor:695x930x275

Indoor Sound Level (H/SL)
Cool (dBA)        48/29
Heat (dBA)        48/29
Outdoor Sound Level (H/SL)        Cool (dBA)        49/45
Heat (dBA)        52/45`,
    model: "FTXM60W",
    price: "$2838+GST",
    promotions: undefined,
    coolingCapacity: "6.2kW",
    heatingCapacity: "7.3kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-71-80kw-heat-pump-ftxv71u",
    name: "Daikin Standard 7.1/8.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  7.1kW
Heating:  8.0kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:295x990x263
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	49/30
Heat (dBA)	49/30
Outdoor Sound Level (H/SL)	Cool (dBA)	53/49
Heat (dBA)	54/49`,
    model: "FTXV71U",
    price: "$2995+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-new-cora-71-81kw-heat-pump-ftxm71u",
    name: "Daikin New Cora 7.1/8.1kw heat pump",
    brand: "Daikin",
    description: `Cooling:  7.1 kW
Heating:  8.1 kW

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:295x990x226
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	49/30
Heat (dBA)	49/30
Outdoor Sound Level (H/SL)	
Cool (dBA)	53/49
Heat (dBA)	53/49`,
    model: "FTXM71U",
    price: "$3042+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.1kW",
    hasWifi: true,
    series: "Cora",
  },
  {
    id: "daikin-alira-71-80kw-heat-pump-ftxm71w",
    name: "Daikin Alira 7.1/8.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  7.1 kw
Heating:  8.0 kw

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:299x1100x275
Outdoor:695x930x275

Indoor Sound Level (H/SL)
Cool (dBA)        49/30
Heat (dBA)        49/30
Outdoor Sound Level (H/SL)        
Cool (dBA)        53/49
Heat (dBA)        54/49`,
    model: "FTXM71W",
    price: "$3263+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-80-90kw-heat-pump-ftxv80w",
    name: "Daikin Standard 8.0/9.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  8.0 kw
Heating:  9.0 kw

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:329x1240x278
Outdoor:990x940x320

Indoor Sound Level (H/SL)
Cool (dBA)	51/37
Heat (dBA)	51/35
Outdoor Sound Level (H/SL)	
Cool (dBA)	54/51
Heat (dBA)	55/51`,
    model: "FTXV80W",
    price: "$3373+GST",
    promotions: undefined,
    coolingCapacity: "8.0kW",
    heatingCapacity: "9.0kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-alira-85-90kw-heat-pump-ftxm85w",
    name: "Daikin Alira 8.5/9.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  8.5 kw
Heating:  9.0 kw

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:329x1240x278
Outdoor:990x940x320

Indoor Sound Level (H/SL)
Cool (dBA)        49/35
Heat (dBA)        49/33
Outdoor Sound Level (H/SL)        
Cool (dBA)        54/51
Heat (dBA)        55/51`,
    model: "FTXM85W",
    price: "$3456+GST ",
    promotions: undefined,
    coolingCapacity: "8.5kW",
    heatingCapacity: "9.0kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-standard-90-103-kw-heat-pump-ftxv90w",
    name: "Daikin Standard 9.0/10.3 kw Heat Pump",
    brand: "Daikin",
    description: `Cooling:  9.0 kw
Heating:  10.3 kw

Optional WiFi Adaptor($150)

Dimensions (HxWxD)
Indoor:329x1240x278
Outdoor:990x940x320

Indoor Sound Level (H/SL)
Cool (dBA)	51/37
Heat (dBA)	51/35
Outdoor Sound Level (H/SL)	
Cool (dBA)	54/51
Heat (dBA)	55/51`,
    model: "FTXV90W",
    price: "$3977+gst",
    promotions: undefined,
    coolingCapacity: "9.0kW",
    heatingCapacity: "10.3kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "daikin-alira-95-103kw-heat-pump-with-wifi-ftxm95w",
    name: "Daikin Alira 9.5/10.3kw Heat pump with WiFi",
    brand: "Daikin",
    description: `Cooling:  9.5 kw
Heating:  10.3 kw

Built-in WiFi
Mould-proof Operation 
Advanced Air Purification

Dimensions (HxWxD)
Indoor:329x1240x278
Outdoor:990x940x320

Indoor Sound Level (H/SL)
Cool (dBA)	49/35
Heat (dBA)	49/33
Outdoor Sound Level (H/SL)`,
    model: "FTXM95W",
    price: "$4052+gst",
    promotions: undefined,
    coolingCapacity: "9.5kW",
    heatingCapacity: "10.3kW",
    hasWifi: true,
    series: "Alira",
  },
  {
    id: "daikin-lite-25-30kw-heat-pump-ftxf25wvma",
    name: "Daikin Lite 2.5/3.0kw Heat pump",
    brand: "Daikin",
    description: `Cooling:  2.50 kW
Heating:  3.20 kW

Dimensions (HxWxD)
Indoor:285x770x284
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        40/19
Heat (dBA)        40/20
Outdoor Sound Level (H/SL)        
Cool (dBA)        47/43
Heat (dBA)        48/44`,
    model: "FTXF25WVMA",
    price: "$1587+GST",
    promotions: undefined,
    coolingCapacity: "2.50kW",
    heatingCapacity: "3.20kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "daikin-lite-35-37kw-heat-pump-ftxf35wvma",
    name: "Daikin Lite 3.5/3.7kw heat pump",
    brand: "Daikin",
    description: `Cooling:  3.5 kW
Heating:  3.7 kW

Dimensions (HxWxD)
Indoor:285x770x284
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)        42/19
Heat (dBA)        42/20
Outdoor Sound Level (H/SL)        
Cool (dBA)        48/43
Heat (dBA)        49/45`,
    model: "FTXF35WVMA",
    price: "$1667+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "3.7kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "daikin-lite-50-52kw-heat-pump-ftxf50w",
    name: "Daikin Lite 5.0/5.2kw heat pump",
    brand: "Daikin",
    description: `Cooling:  5.0 kW
Heating:  5.2 kW

Dimensions (HxWxD)
Indoor:295x990x263
Outdoor:595x845x300

Indoor Sound Level (H/SL)
Cool (dBA)        45/28
Heat (dBA)        45/28
Outdoor Sound Level (H/SL)        
Cool (dBA)        47/44
Heat (dBA)        50/46`,
    model: "FTXF50W",
    price: "$2058+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "5.2kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "daikin-lite-60-65kw-heat-pump-ftxf60w",
    name: "Daikin Lite 6.0/6.5kw heat pump",
    brand: "Daikin",
    description: `Cooling:  6.0 kW
Heating:  6.5 kW

Dimensions (HxWxD)
Indoor:295x990x263
Outdoor:595x845x300

Indoor Sound Level (H/SL)
Cool (dBA)        46/29
Heat (dBA)        46/29
Outdoor Sound Level (H/SL)        
Cool (dBA)        49/46
Heat (dBA)        51/47`,
    model: "FTXF60W",
    price: "$2519+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "6.5kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "daikin-lite-71-80kw-heat-pump-ftxf71wvma",
    name: "Daikin Lite 7.1/8.0kw heat pump",
    brand: "Daikin",
    description: `Cooling:  7.1 kW
Heating:  8.0 kW

Dimensions (HxWxD)
Indoor:295x990x263
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)        49/30
Heat (dBA)        49/30
Outdoor Sound Level (H/SL)        
Cool (dBA)        43/47
Heat (dBA)        54/49`,
    model: "FTXF71WVMA",
    price: "$2856+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "daikin-aura-25-35-kw-floor-console-with-wifi-fvxm25y",
    name: "Daikin Aura 2.5/3.5 kw Floor Console with WiFi",
    brand: "Daikin",
    description: `2.5 kw Cooling 
3.5 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 595x845x300

Indoor max : 20 dBA
Outdoor max : 60 dBA

1/4,3/8 copper size`,
    model: "FVXM25Y",
    price: "$2401+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-aura-35-45kw-floor-console-with-wifi-fvxm35y",
    name: "Daikin Aura 3.5/4.5kw Floor Console with WiFi",
    brand: "Daikin",
    description: `3.5 kw Cooling 
4.5 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 595x845x300

Indoor max : 20 dBA
Outdoor max : 60 dBA

1/4,3/8 copper size`,
    model: "FVXM35Y",
    price: "$2708+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-aura-45-54kw-floor-console-with-wifi-fvxm45y",
    name: "Daikin Aura 4.5/5.4kw Floor Console with WiFi",
    brand: "Daikin",
    description: `4.5 kw Cooling 
5.4 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 595x845x300

Indoor max : 29 dBA
Outdoor max : 63 dBA

1/4,3/8 copper size`,
    model: "FVXM45Y",
    price: "$2908+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-aura-50-60kw-floor-console-with-wifi-fvxm50y",
    name: "Daikin Aura 5.0/6.0kw Floor Console with WiFi",
    brand: "Daikin",
    description: `5.0 kw Cooling 
6.0 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 695x930x350

Indoor max : 29 dBA
Outdoor max : 63 dBA

1/4,1/2 copper size
`,
    model: "FVXM50Y",
    price: "$3009+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-aura-60-70kw-floor-console-with-wifi-fvxm60y",
    name: "Daikin Aura 6.0/7.0kw Floor Console with WiFi",
    brand: "Daikin",
    description: `6.0 kw Cooling 
7.0 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 595x845x300

Indoor max : 34 dBA
Outdoor max : 67 dBA

1/4,1/2 copper size`,
    model: "FVXM60Y",
    price: "$3377+GST ",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-aura-67-80kw-floor-console-with-wifi-fvxm71y",
    name: "Daikin Aura 6.7/8.0kw Floor Console with WiFi",
    brand: "Daikin",
    description: `6.7 kw Cooling 
8.0 kw Heating 

Indoor(HxWxD) : 600x750x238
Outdoor(HxWxD) : 595x845x300

Indoor max : 34 dBA
Outdoor max : 67 dBA

1/4,1/2 copper size`,
    model: "FVXM71Y",
    price: "$3861+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-zena-25-32-black-colour-with-wifi-ftxj25t-k",
    name: "Daikin Zena 2.5/3.2 Black colour with WiFi",
    brand: "Daikin",
    description: `Cooling:  2.5 kw
Heating:  3.2 kw

Program Dry Function
Heavy duty Purification
Ultra Compact 
Super Quiet 

Dimensions (HxWxD)
Indoor:295x798x185
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)	40/19
Heat (dBA)	41/19
Outdoor Sound Level (H/SL)	
Cool (dBA)	47/43
Heat (dBA)	48/44`,
    model: "FTXJ25T-K",
    price: "$2038+GST",
    promotions: undefined,
    coolingCapacity: "2.5kW",
    heatingCapacity: "3.2kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-zena-35-37kw-black-colour-with-wifi-ftxj35t",
    name: "Daikin Zena 3.5/3.7kw Black colour with WiFi",
    brand: "Daikin",
    description: `Cooling:  3.5 kw
Heating:  3.7 kw

Program Dry Function
Heavy duty Purification
Ultra Compact 
Super Quiet 

Dimensions (HxWxD)
Indoor:295x798x185
Outdoor:550x675x284

Indoor Sound Level (H/SL)
Cool (dBA)	42/20
Heat (dBA)	42/20
Outdoor Sound Level (H/SL)	
Cool (dBA)	49/44
Heat (dBA)	49/45`,
    model: "FTXJ35T",
    price: "$2279+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "3.7kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-zena-50-60kw-black-colour-with-wifi-ftxj50t",
    name: "Daikin Zena 5.0/6.0kw Black colour with WiFi",
    brand: "Daikin",
    description: `Cooling:  5.0 kw
Heating:  6.0 kw

Program Dry Function
Heavy duty Purification
Ultra Compact 
Super Quiet 

Dimensions (HxWxD)
Indoor:295x798x185
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)        45/32
Heat (dBA)        45/32
Outdoor Sound Level (H/SL)        
Cool (dBA)        47/44
Heat (dBA)        48/45`,
    model: "FTXJ50T",
    price: "$2720+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "daikin-zena-60-72kw-black-colour-with-wifi-ftxj60t-k",
    name: "Daikin Zena 6.0/7.2kw Black colour with WiFi",
    brand: "Daikin",
    description: `Cooling:  6.0 kw
Heating:  7.2 kw

Program Dry Function
Heavy duty Purification
Ultra Compact 
Super Quiet 

Dimensions (HxWxD)
Indoor:295x798x185
Outdoor:695x930x350

Indoor Sound Level (H/SL)
Cool (dBA)	48/33
Heat (dBA)	48/33
Outdoor Sound Level (H/SL)	
Cool (dBA)	49/45
Heat (dBA)	52/45`,
    model: "FTXJ60T-K",
    price: "$3089+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "7.2kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "midea-aurora-25-31kw-with-wifi-mfab26nb",
    name: "Midea Aurora 2.5/3.1kw with Wifi",
    brand: "Midea",
    description: `2.5kw Cooling, 
3.2kw Heating Capacity 

with Wi-Fi control.
5 years manufacturer warranty 

Indoor (802 x 189 x 297)(mm)
Outdoor (800 x 333 x 554)(WxDXH)`,
    model: "MFAB26NB",
    price: "$1215+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "midea-aurora-35-40kw-with-wifi-mfab35nb",
    name: "Midea Aurora 3.5/4.0kw with Wifi",
    brand: "Midea",
    description: `3.5kw Cooling, 
4.0kw Heating Capacity 

with Wi-Fi control.
5 years manufacturer warranty 

Indoor (802 x 189 x 297)(mm)
Outdoor (800 x 333 x 554)(WxDXH)`,
    model: "MFAB35NB",
    price: "$1474+ GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "midea-aurora-50-60kw-with-wifi-mfam50nb",
    name: "Midea Aurora 5.0/6.0kw with Wifi",
    brand: "Midea",
    description: `5.0kw Cooling, 
6.0kw Heating Capacity 

with Wi-Fi control.
5 years manufacturer warranty 

Indoor (1080 x 226 x 335)(mm)
Outdoor (890 x 342 x673)(WxDXH)`,
    model: "MFAM50NB",
    price: "$1879+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "midea-aurora-71-80kw-with-wifi-mfab70nb",
    name: "Midea Aurora 7.1/8.0kw with Wifi",
    brand: "Midea",
    description: `7.1kw Cooling, 
8.0kw Heating Capacity 

with Wi-Fi control.
5 years manufacturer warranty 

Indoor (1080 x 226 x 335)(mm)
Outdoor (890 x 342 x673)(WxDXH)`,
    model: "MFAB70NB",
    price: "$2206+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "midea-aurora-90-10kw-with-wifi-mfab90nb",
    name: "Midea Aurora 9.0/10kw with Wifi",
    brand: "Midea",
    description: `10kw heating, 9.0kw cooling 
Capacity with Wi-Fi control.

5 years manufacturer warranty 
Indoor (1259 x 282 x 362)(mm)
Outdoor (946 x 410 810)(WxDXH)`,
    model: "MFAB90NB",
    price: "$2790+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mhi-ciara-15-20kw-built-in-wifi-dxk05ztla",
    name: "MHI Ciara 1.5/2.0kw built-In Wifi",
    brand: "MHI",
    description: `1.5kw cooling
2.0kw heating 
Room size: 12 - 18m² cooling  
/ 10 - 16m² heating

Wi-Fi built-in as standard! 

The innovative 1.5kW Ciara™ split system 

Dimensions (H x W x D):
INDOOR: 294 x 798 x 210mm
OUTDOOR: 540 x 645 x 275mm`,
    model: "DXK05ZTLA",
    price: "$1457+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mhi-ciara-25-30kw-built-in-wifi-dxk09ztla-set",
    name: "MHI Ciara 2.5/3.0kw Built-in Wifi",
    brand: "MHI",
    description: `2.5kw cooling
3.0kw heating 

Wi-Fi built-in as standard! 

The innovative Ciara™ split system 

Dimensions (HxWxD)
INDOOR: 294x798x210
OUTDOOR: 540x645x275`,
    model: "DXK09ZTLA-SET",
    price: "$1847+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mhi-ciara-33-38kw-built-in-wifi-dxk12ztla",
    name: "MHI Ciara 3.3/3.8kw Built-in Wifi",
    brand: "MHI",
    description: `3.3kw cooling
3.8kw heating 

Wi-Fi built-in as standard! 

The innovative Ciara™ split system 

Dimensions (HxWxD)
INDOOR: 294x798x210
OUTDOOR: 540x645x275`,
    model: "DXK12ZTLA",
    price: "$2001+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mhi-ciara-50-58kw-built-in-wifi-dxk18ztla",
    name: "MHI Ciara 5.0/5.8kw Built-in Wifi",
    brand: "MHI",
    description: `5.0kw cooling
5.8kw heating 

Wi-Fi built-in as standard! 

The innovative Ciara™ split system 

Dimensions (HxWxD)
INDOOR: 294x798x210
OUTDOOR: 595x780x290`,
    model: "DXK18ZTLA",
    price: "$2379+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mhi-ciara-71-80kw-built-in-wifi-dxk24tla-set",
    name: "MHI Ciara 7.1/8.0kw Built-in Wifi",
    brand: "MHI",
    description: `7.1kw cooling
8.0kw heating 

Wi-Fi built-in as standard! 

The innovative Ciara™ split system 

Dimensions (HxWxD)
INDOOR: 294x798x230
OUTDOOR: 640x800(+71)x290`,
    model: "DXK24TLA-SET",
    price: "$2826+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "samsung-25-30kw-ai-smart-airise-windfree-airconditioner-wall-mount---heat-pump-ar09bxecnwknsa",
    name: "Samsung 2.5/3.0kw AI Smart AIRISE WindFree™ AirConditioner Wall-mount - Heat Pump",
    brand: "Samsung",
    description: `Cooling, 2.5 kW/ Heating, 3.2 kW
Covers up to 28 m2

Built in WIFI
AI Function 
Wind-free technology 
10 years on compressor/ 5 years others warranty 

Noise Level (Indoor, High/Low, dBA)
38 / 17 dBA
Noise Level (Outdoor, High/Low, dBA)
45 dBA

Net Dimension (Indoor, WxHxD, ㎜*㎜*㎜)
889*299*215 mm
Net Dimension (Outdoor, WxHxD, ㎜*㎜*㎜)
790*548*285 mm`,
    model: "AR09BXECNWKNSA",
    price: "$1675+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "samsung-35-40kw-ai-smart-airise-windfree-airconditioner-wall-mount---heat-pump-ar12bxecnwknsa",
    name: "Samsung 3.5/4.0kw AI Smart AIRISE WindFree™ AirConditioner Wall-mount - Heat Pump",
    brand: "Samsung",
    description: `Cooling, 3.5 kW/ Heating, 4.0 kW
Covers up to 25 - 48 m23

Built in WIFI
AI Function 
Wind-free technology 
10 years on compressor/ 5 years others warranty 

Noise Level (Indoor, High/Low, dBA)
40 / 17 dBA
Noise Level (Outdoor, High/Low, dBA)
46 /17 dBA

Net Dimension (Indoor, WxHxD, ㎜*㎜*㎜)
889*299*215 mm
Net Dimension (Outdoor, WxHxD, ㎜*㎜*㎜)
790*548*285 mm`,
    model: "AR12BXECNWKNSA",
    price: "$1794+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "samsung-50-60kw-ai-smart-airise-windfree-airconditioner-wall-mount---heat-pump-ar18bxecnwknsa",
    name: "Samsung 5.0/6.0kw AI Smart AIRISE WindFree™ AirConditioner Wall-mount - Heat Pump",
    brand: "Samsung",
    description: `Cooling, 5.0 kW/ Heating, 6.0 kW
Covers 35-55m2

Built in WIFI
AI Function 
Wind-free technology 
10 years on compressor/ 5 years others warranty 

Noise Level (Indoor, High/Low, dBA)
41 / 25 dBA
Noise Level (Outdoor, High/Low, dBA)
51 dBA

Net Dimension (Indoor, WxHxD, ㎜*㎜*㎜)
1055*299*215 mm
Net Dimension (Outdoor, WxHxD, ㎜*㎜*㎜)
880*636*310 mm`,
    model: "AR18BXECNWKNSA",
    price: "$2245+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "samsung-68-72kw-ai-smart-airise-windfree-airconditioner-wall-mount---heat-pump-ar24bxecnwknsa",
    name: "Samsung 6.8/7.2kw AI Smart AIRISE WindFree™ AirConditioner Wall-mount - Heat Pump",
    brand: "Samsung",
    description: `Cooling, 6.8kW/ Heating, 7.2kW
Covers 48-72m2

Built in WIFI
AI Function 
Wind-free technology 
10 years on compressor/ 5 years others warranty 

Noise Level (Indoor, High/Low, dBA)
45 /26 dBA
Noise Level (Outdoor, High/Low, dBA)
54 dBA

Net Dimension (Indoor, WxHxD, ㎜*㎜*㎜)
1055*299*215mm
Net Dimension (Outdoor, WxHxD, ㎜*㎜*㎜)
880*636*310 mm`,
    model: "AR24BXECNWKNSA",
    price: "$2698+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "samsung-ai-windfree-80-90-kw-ar30bxecnwknsaar30bxecnwkxsa",
    name: "Samsung AI windfree 8.0/9.0 Kw",
    brand: "Samsung",
    description: `Cooling, 8.0kW/ Heating, 9.0kW
Covers more than 72 m2

Built in WIFI
AI Function 
Wind-free technology 
10 years on compressor/ 5 years others warranty 

Noise Level (Indoor, High/Low, dBA)
47/30 dBA
Noise Level (Outdoor, High/Low, dBA)
57 dBA

Net Dimension (Indoor, WxHxD, ㎜*㎜*㎜)
1055*299*215 mm
Net Dimension (Outdoor, WxHxD, ㎜*㎜*㎜)
940*998*330 mm`,
    model: "AR30BXECNWKNSA + AR30BXECNWKXSA",
    price: "$3199+GST ",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap25-25-32kw-with-wi-fi-msz-ap25vgkd2",
    name: "Mitsubish Electric AP25 2.5/3.2kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 2.5 kW
Heating 3.2 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,
`,
    model: "MSZ-AP25VGKD2",
    price: "$2125+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap35-35-37kw-with-wi-fi-",
    name: "Mitsubish Electric AP35 3.5/3.7kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 3.5 kW
Heating 3.7 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,`,
    model: "",
    price: "$2215+GST ",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap50-50-60kw-with-wi-fi-",
    name: "Mitsubish Electric AP50 5.0/6.0kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 5.0 kW
Heating 6.0 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,`,
    model: "",
    price: "$2735+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap42-42-54kw-with-wi-fi-",
    name: "Mitsubish Electric AP42 4.2/5.4kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 4.2 kW
Heating 5.4 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,`,
    model: "",
    price: "$ 2560+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap71-71-80kw-with-wi-fi-",
    name: "Mitsubish Electric AP71 7.1/8.0kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 7.1 kW
Heating 8.0 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,`,
    model: "",
    price: "$3819+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-ap80-80-90kw-with-wi-fi-",
    name: "Mitsubish Electric AP80 8.0/9.0kw with Wi-Fi",
    brand: "Mitsubishi",
    description: `Cooling 8.0kW
Heating 9.0 kW

Built-in Wi-Fi Energy Monitoring for total control over your power use. 

Starting at just 18dBA, it's New Zealand's quietest heat pump ever making it ideal for living rooms and bedrooms. 

With Dual Barrier Coating that prevents dust and dirt build-up on the inner surface,`,
    model: "",
    price: "$4119+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-gs25-25-31kwheat-pump-msz-gs25vfd",
    name: "Mitsubish Electric GS25 2.5/3.1kwHeat Pump",
    brand: "Mitsubishi",
    description: `Cooling: 2.5 kW, Heating: 3.1 kW

optional upgrades, from Wi-Fi Control`,
    model: "MSZ-GS25VFD",
    price: "$1834+GST",
    promotions: undefined,
    coolingCapacity: "2.5kW",
    heatingCapacity: "3.1kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "mitsubish-electric-gs580-78-90kwheat-pump-msz-gs80vfd",
    name: "Mitsubish Electric GS580 7.8/9.0kwHeat Pump",
    brand: "Mitsubishi",
    description: `Cooling: 7.8 kW, Heating: 9.0 kW

optional upgrades, from Wi-Fi Control`,
    model: "MSZ-GS80VFD",
    price: "$3674+GST",
    promotions: undefined,
    coolingCapacity: "7.8kW",
    heatingCapacity: "9.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-pinnacle-35-37kw-heat-pump-as35pbdhra-set",
    name: "Haire Pinnacle 3.5/3.7kw heat pump",
    brand: "Haire",
    description: `3.5kw cooling/3.7kw heating 
Wi-Fi and voice control.

Noise indoor max: 40dBA
          Outdoor max: 51dBA

Dimension 
Indoor:292x805x200
Outdoor: 800x553x275`,
    model: "AS35PBDHRA-SET",
    price: "$1504+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-pinnacle-25-30-kw-with-wifi-as26pbdhra-set",
    name: "Haire pinnacle 2.5/3.0 kw with WIFI",
    brand: "Haire",
    description: `2.5kw cooling/3.0kw heating 
Wi-Fi and voice control.

Noise 
indoor max: 40dBA
Outdoor max: 51dBA

Dimension 
Indoor:292x805x200
Outdoor: 800x553x275`,
    model: "AS26PBDHRA-SET",
    price: "$1455+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-71-80kw-heat-pump-as71qeehra-set",
    name: "Haire Quartz 7.1/8.0kw heat pump",
    brand: "Haire",
    description: `Cooling:  7.1 kW
Heating:  8.0 kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:345x1106x240
Outdoor:705x890x340`,
    model: "AS71QEEHRA-SET",
    price: "$2478+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-50-60kw-heat-pump-as50qdehra-set",
    name: "Haire Quartz 5.0/6.0kw heat pump",
    brand: "Haire",
    description: `Cooling:  5.0 kW
Heating:  6.0 kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:320x970x220
Outdoor:705x890x340`,
    model: "AS50QDEHRA-SET",
    price: "$2152+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-pinnacle-50-55kw-heat-pump-as53pddhra-set",
    name: "Haire Pinnacle 5.0/5.5kw heat pump",
    brand: "Haire",
    description: `5.0kw cooling/5.5kw heating 
Wi-Fi and voice control.

Noise indoor max: 47dBA
          Outdoor max: 66dBA

Dimension 
Indoor:320x970x220
Outdoor: 890x705x340`,
    model: "AS53PDDHRA-SET",
    price: "$2080+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-pinnacle-70-76kw-heat-pump-as71pddhra-set",
    name: "Haire Pinnacle 7.0/7.6kw heat pump",
    brand: "Haire",
    description: `7.0 cooling/7.6kw heating 
Wi-Fi and voice control.

Noise indoor max: 48dBA
          Outdoor max: 67dBA

Dimension 
Indoor:320x970x220
Outdoor: 890x705x340`,
    model: "AS71PDDHRA-SET",
    price: "$2381+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-90-95kw-heat-pump-as90qfdhra-set",
    name: "Haire Quartz 9.0/9.5kw heat pump",
    brand: "Haire",
    description: `Cooling:  9.0 kW
Heating:  9.5 kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:365x1316x275
Outdoor:815x905x370`,
    model: "AS90QFDHRA-SET",
    price: "$2999+GST",
    promotions: undefined,
    coolingCapacity: "9.0kW",
    heatingCapacity: "9.5kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-25-32kw-heat-pump-as25qcehra-set",
    name: "Haire Quartz 2.5/3.2kw Heat pump",
    brand: "Haire",
    description: `Cooling:  2.5 kW
Heating:  3.2kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:307x875x217
Outdoor:553x800x275`,
    model: "AS25QCEHRA-SET",
    price: "$1610+GST",
    promotions: undefined,
    coolingCapacity: "2.5kW",
    heatingCapacity: "3.2kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-35-37kw-heat-pump-as35qcehra-set",
    name: "Haire Quartz 3.5/3.7kw heat pump",
    brand: "Haire",
    description: `Cooling:  3.5 kW
Heating:  3.7 kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:307x875x217
Outdoor:553x800x275`,
    model: "AS35QCEHRA-SET",
    price: "$1664+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "3.7kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "haire-quartz-60-70kw-heat-pump-",
    name: "Haire Quartz 6.0/7.0kw heat pump",
    brand: "Haire",
    description: `Cooling:  7.1 kW
Heating:  8.0 kW

Built-in WiFi
Self-Clean function 
Whisper Quiet 

Dimensions (HxWxD)
Indoor:345x1106x240
Outdoor:705x890x340`,
    model: "",
    price: "$2332+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "lg-standard-63-73-kw-high-wall-ws24wu",
    name: "LG STANDARD 6.3/7.3 KW HIGH WALL",
    brand: "LG",
    description: `Cooling: 6.3kw, Heating: 7.3kw

Built in Wi-Fi so you can control your Air Conditioner remotely

Control your energy usage with Active Energy Control on the LG ThinQ® app

Google Assistant

10 Year Compressor Parts Warranty for peace of mind`,
    model: "WS24WU",
    price: "$2525+GST ",
    promotions: undefined,
    coolingCapacity: "6.3kW",
    heatingCapacity: "7.3kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "lg-deluxe-85kw---90kw-high-wall-wh30sr-1-wh30sr",
    name: "LG DELUXE 8.5KW / 9.0KW HIGH WALL WH30SR-1",
    brand: "LG",
    description: `Cooling:8.5kw, heating:9.0kw

Key Features
Built-in Wi-Fi Smart Control
Energy Display & Monitoring
Active Energy Control
Plasmaster™ Ioniser Plus
10 Year Compressor Parts Warranty`,
    model: "WH30SR",
    price: "$3234+GST",
    promotions: undefined,
    coolingCapacity: "8.5kW",
    heatingCapacity: "9.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "lg-deluxe-94-103kw-high-wall-wh34sr",
    name: "LG Deluxe 9.4/10.3KW High Wall",
    brand: "LG",
    description: `Cooling: 9.4kw, Heating:10.3kw

Key Features
Built-in Wi-Fi Smart Control
Energy Display & Monitoring
Active Energy Control
Plasmaster™ Ioniser Plus
10 Year Compressor Parts Warranty`,
    model: "WH34SR",
    price: "$3697+GST",
    promotions: undefined,
    coolingCapacity: "9.4kW",
    heatingCapacity: "10.3kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "lg-standard-26kw---32kw-high-wall-ws09tws",
    name: "LG STANDARD 2.6KW / 3.2KW HIGH WALL",
    brand: "LG",
    description: `Cooling: 2.6kw, Heating: 3.3kw

Built in Wi-Fi so you can control your Air Conditioner remotely

Control your energy usage with Active Energy Control on the LG ThinQ® app

Google Assistant

10 Year Compressor Parts Warranty for peace of mind`,
    model: "WS09TWS",
    price: "$1707+GST",
    promotions: undefined,
    coolingCapacity: "2.6kW",
    heatingCapacity: "3.3kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "lg-standard-34-40-kw-high-wall-ws12twn",
    name: "LG STANDARD 3.4/4.0 Kw HIGH WALL",
    brand: "LG",
    description: `Cooling: 3.4kw, Heating: 4.0kw

Built in Wi-Fi so you can control your Air Conditioner remotely

Control your energy usage with Active Energy Control on the LG ThinQ® app

Google Assistant

10 Year Compressor Parts Warranty for peace of mind`,
    model: "WS12TWN",
    price: "$2003+GST",
    promotions: undefined,
    coolingCapacity: "3.4kW",
    heatingCapacity: "4.0kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "lg-standard-48kw---59kw-high-wall-ws18tws",
    name: "LG STANDARD 4.8KW / 5.9KW HIGH WALL",
    brand: "LG",
    description: `$2179+GST incl Standard back-to-back Installation within 3 meters 

Cooling: 4.8kw, Heating: 5.9kw

Built in Wi-Fi so you can control your Air Conditioner remotely

Control your energy usage with Active Energy Control on the LG ThinQ® app

Google Assistant

10 Year Compressor Parts Warranty for peace of mind`,
    model: "WS18TWS",
    price: "$2179+GST",
    promotions: undefined,
    coolingCapacity: "4.8kW",
    heatingCapacity: "5.9kW",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "lg-standard-71kw---77kw-high-wall-ws24sl-23",
    name: "LG STANDARD 7.1KW / 7.7KW HIGH WALL",
    brand: "LG",
    description: `Key Features
Ideal for large rooms or areas in your home
Built in Wi-Fi so you can control your Air Conditioner remotely
10 Year Compressor Parts Warranty
`,
    model: "WS24SL-23",
    price: "$2671+GST",
    promotions: undefined,
    coolingCapacity: "",
    heatingCapacity: "",
    hasWifi: true,
    series: "Standard",
  },
  {
    id: "panasonic-developer-25-30kw-heat-pump-rz25xkr",
    name: "Panasonic Developer 2.5/3.0kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  2.5 kw
Heating:  3.0 kw

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:542x780x289

Indoor Sound Level (dBA):40 
Outdoor Sound Level (dBA):49`,
    model: "RZ25XKR",
    price: "$1845+GST",
    promotions: undefined,
    coolingCapacity: "2.5kW",
    heatingCapacity: "3.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-aero-80-90kw-with-wifi-heat-pump-z80xkr",
    name: "Panasonic Aero 8.0/9.0kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  8.0 kw
Heating:  9.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:295x1040x244
Outdoor:795x875x320

Indoor Sound Level (dBA):51
Outdoor Sound Level (dBA):55`,
    model: "Z80XKR",
    price: "$3486+GST",
    promotions: undefined,
    coolingCapacity: "8.0kW",
    heatingCapacity: "9.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-aero-25-30kw-with-wifi-heat-pump-z25xkr-1",
    name: "Panasonic Aero 2.5/3.0kw with WIFI heat pump",
    brand: "Panasonic",
    description: `Cooling:  2.5 kw
Heating:  3.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:542x780x289

Indoor Sound Level (dBA):40 
Outdoor Sound Level (dBA):48`,
    model: "Z25XKR-1",
    price: "$1985+GST",
    promotions: undefined,
    coolingCapacity: "2.5kW",
    heatingCapacity: "3.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-aero-35-40kw-with-wifi-heat-pump-z35xkr",
    name: "Panasonic Aero 3.5/4.0kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  3.5 kw
Heating:  4.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:542x780x289

Indoor Sound Level (dBA):44
Outdoor Sound Level (dBA):49`,
    model: "Z35XKR",
    price: "$2027+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "4.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-aero-71-80kw-with-wifi-heat-pump-z71xkr",
    name: "Panasonic Aero 7.1/8.0kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  7.1 kw
Heating:  8.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:295x1040x244
Outdoor:695x875x320

Indoor Sound Level (dBA):49
Outdoor Sound Level (dBA):54`,
    model: "Z71XKR",
    price: "$3072+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-developer-35-40kw-heat-pump-rz35xkr",
    name: "Panasonic Developer 3.5/4.0kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  3.5 kw
Heating:  4.0 kw

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:542x780x289

Indoor Sound Level max(dBA):44
Outdoor Sound Level max:(dBA):49`,
    model: "RZ35XKR",
    price: "$1952+GST ",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "4.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-developer-42-51kw-heat-pump-rz42xkr",
    name: "Panasonic Developer 4.2/5.1kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  4.2 kw
Heating:  5.1 kw

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:619x824x299

Indoor Sound Level (dBA):44
Outdoor Sound Level (dBA):49`,
    model: "RZ42XKR",
    price: "$2198+GST",
    promotions: undefined,
    coolingCapacity: "4.2kW",
    heatingCapacity: "5.1kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-developer-50-60kw-heat-pump-rz50xkr",
    name: "Panasonic Developer 5.0/6.0kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  5.0 kw
Heating:  6.0 kw

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:619x824x299

Indoor Sound Level (dBA):44
Outdoor Sound Level (dBA):48`,
    model: "RZ50XKR",
    price: "$2328+GST",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-developer-60-65kw-heat-pump-rz60xkr",
    name: "Panasonic Developer 6.0/6.5kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  6.0 kw
Heating:  6.5 kw

Dimensions (HxWxD)
Indoor:295x1047x244
Outdoor:619x824x299

Indoor Sound Level (dBA):47
Outdoor Sound Level (dBA):49`,
    model: "RZ60XKR",
    price: "$2617+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "6.5kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-developer-71-80kw-heat-pump-rz71xkr",
    name: "Panasonic Developer 7.1/8.0kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  7.1 kw
Heating:  8.0 kw

Dimensions (HxWxD)
Indoor:295x1047x244
Outdoor:695x875x320

Indoor Sound Level (dBA):49
Outdoor Sound Level (dBA):54`,
    model: "RZ71XKR",
    price: "$2885+GST",
    promotions: undefined,
    coolingCapacity: "7.1kW",
    heatingCapacity: "8.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-developer-80-90kw-heat-pump-rz80xkr",
    name: "Panasonic Developer 8.0/9.0kw heat pump",
    brand: "Panasonic",
    description: `Cooling:  8.0 kw
Heating:  9.0 kw

Dimensions (HxWxD)
Indoor:295x1047x244
Outdoor:795x875x320

Indoor Sound Level (dBA):51
Outdoor Sound Level (dBA):55`,
    model: "RZ80XKR",
    price: "$3375+GST",
    promotions: undefined,
    coolingCapacity: "8.0kW",
    heatingCapacity: "9.0kW",
    hasWifi: false,
    series: "Other",
  },
  {
    id: "panasonic-aero-42-51kw-with-wifi-heat-pump-z42xkr",
    name: "Panasonic Aero 4.2/5.1kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  3.5 kw
Heating:  4.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:542x780x289

Indoor Sound Level (dBA):44
Outdoor Sound Level (dBA):49`,
    model: "Z42XKR",
    price: "$2331+GST",
    promotions: undefined,
    coolingCapacity: "3.5kW",
    heatingCapacity: "4.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-aero-50-60kw-with-wifi-heat-pump-z50xkr",
    name: "Panasonic Aero 5.0/6.0kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  5.0 kw
Heating:  6.0 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:290x779x209
Outdoor:619x824x299

Indoor Sound Level (dBA):44
Outdoor Sound Level (dBA):49`,
    model: "Z50XKR",
    price: "$2465+GST ",
    promotions: undefined,
    coolingCapacity: "5.0kW",
    heatingCapacity: "6.0kW",
    hasWifi: true,
    series: "Other",
  },
  {
    id: "panasonic-aero-60-72kw-with-wifi-heat-pump-z60xkr",
    name: "Panasonic Aero 6.0/7.2kw with Wifi heat pump",
    brand: "Panasonic",
    description: `Cooling:  6.0 kw
Heating:  7.2 kw

Built-in WIFI
Nanoe-G Air purifying system 

Dimensions (HxWxD)
Indoor:295x1040x244
Outdoor:695x875x320

Indoor Sound Level (dBA):49
Outdoor Sound Level (dBA):54`,
    model: "Z60XKR",
    price: "$2802+GST",
    promotions: undefined,
    coolingCapacity: "6.0kW",
    heatingCapacity: "7.2kW",
    hasWifi: true,
    series: "Other",
  },
];

// Helper functions for filtering
export const getBrands = async () => {
  const products = await getProducts();
  return [...new Set(products.map(p => p.brand))];
};

export const getProductSeries = async () => {
  const products = await getProducts();
  return [...new Set(products.map(p => p.series))];
};

export const getPriceRanges = async () => {
  const products = await getProducts();
  const prices = products.map(p => parsePrice(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return [
    { label: 'Under $2,000', min: 0, max: 2000 },
    { label: '$2,000 - $3,000', min: 2000, max: 3000 },
    { label: '$3,000 - $4,000', min: 3000, max: 4000 },
    { label: 'Over $4,000', min: 4000, max: Infinity }
  ];
};
