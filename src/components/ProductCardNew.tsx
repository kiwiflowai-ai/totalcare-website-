import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteModal } from '@/components/QuoteModal';
import { Zap, Thermometer, MessageSquare, ExternalLink } from 'lucide-react';
import { Product } from '@/data/products';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

interface ProductCardNewProps {
  product: Product;
}

export function ProductCardNew({ product }: ProductCardNewProps) {
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Helper function to get the best available image
  const getProductImage = () => {
    console.log(`🔍 DEBUGGING PRODUCT: ${product.name}`, {
      id: product.id,
      hasCoverImage: !!product.image,
      coverImageLength: product.image?.length || 0,
      coverImagePreview: product.image?.substring(0, 50) + '...',
      hasProductImages: !!product.product_images,
      productImagesType: typeof product.product_images,
      productImagesLength: product.product_images?.length || 0
    });
    
    // First try the cover image
    if (product.image && product.image.trim() !== '') {
      console.log(`✅ Using cover image for ${product.name}`);
      return product.image;
    }
    
    // Fallback to first product image if cover image is not available
    if (product.product_images) {
      let productImagesArray = [];
      
      // Parse product_images if it's a JSON string
      if (typeof product.product_images === 'string') {
        try {
          productImagesArray = JSON.parse(product.product_images);
          console.log(`📦 Parsed ${productImagesArray.length} images from JSON for ${product.name}`);
        } catch (error) {
          console.error(`❌ Error parsing product_images JSON for ${product.name}:`, error);
          productImagesArray = [];
        }
      } else if (Array.isArray(product.product_images)) {
        productImagesArray = product.product_images;
        console.log(`📦 Using ${productImagesArray.length} images from array for ${product.name}`);
      }
      
      // Clean up the base64 strings (remove any extra escape characters)
      const cleanedImages = productImagesArray.map(img => {
        if (typeof img === 'string') {
          return img.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        return img;
      }).filter(img => img && img.startsWith('data:image/'));
      
      console.log(`🧹 Cleaned ${cleanedImages.length} valid images for ${product.name}`);
      
      if (cleanedImages.length > 0) {
        console.log(`🔄 Using first product image for ${product.name}`);
        return cleanedImages[0];
      }
    }
    
    console.log(`❌ No image available for ${product.name}`);
    return null;
  };

  const displayImage = getProductImage();

  return (
    <Card className="group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">

      {/* Product Image - Clickable */}
      <div 
        className="aspect-[4/3] overflow-hidden bg-muted/30 relative cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={`Auckland heat pump installation - ${product.name} by ${product.brand}`}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            onLoad={() => {
              console.log(`✅ Image loaded successfully for ${product.name}`);
            }}
            onError={(e) => {
              console.error(`❌ Image failed to load for ${product.name}:`, {
                productId: product.id,
                productName: product.name,
                imageSrc: displayImage.substring(0, 100) + '...',
                hasCoverImage: !!product.image,
                hasProductImages: product.product_images?.length || 0
              });
              // Hide the broken image and show fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full bg-red-100 flex items-center justify-center">
            <div className="text-center text-red-600">
              <div className="text-sm font-bold">NO IMAGE</div>
              <div className="text-xs">{product.name}</div>
            </div>
          </div>
        )}
        
        {/* Fallback content - shown when no image or image fails to load */}
        <div 
          className={`w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center ${displayImage ? 'hidden' : ''}`}
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Thermometer className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">{product.brand}</h3>
            <p className="text-sm text-muted-foreground">{product.series}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <ExternalLink className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="space-y-3 flex-1">

          {/* Product Name - Clickable */}
          <h3 
            className="text-sm font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer hover:underline"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>

          {/* Model */}
          <p className="text-xs text-muted-foreground font-mono">
            Model: {product.model}
          </p>

          {/* Capacity Info */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-500" />
              <span className="text-muted-foreground">Cool: {product.coolingCapacity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-500" />
              <span className="text-muted-foreground">Heat: {product.heatingCapacity}</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {product.price}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Incl GST • Free Installation Quote
            </div>
            <div className="text-xs text-blue-600 font-medium">
              Contact me for details: +64 27 750 0999
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={() => setIsQuoteModalOpen(true)}
            variant="outline"
            className="w-full text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Free Quote
          </Button>
        </div>
      </CardContent>
      
      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={product}
      />
    </Card>
  );
}
