import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteModal } from '@/components/QuoteModal';
import { Zap, Thermometer, MessageSquare, ExternalLink } from 'lucide-react';
import { Product } from '@/data/products';
import { useNavigate } from 'react-router-dom';
import { useState, memo } from 'react';

interface ProductCardNewProps {
  product: Product;
}

export const ProductCardNew = memo(function ProductCardNew({ product }: ProductCardNewProps) {
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Helper function to get the best available image
  const getProductImage = () => {
    // First try the cover image (already processed from Supabase)
    if (product.image && product.image.trim() !== '') {
      return product.image.trim();
    }
    
    // Fallback to first product image
    if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      const firstImage = product.product_images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
        return firstImage.trim();
      }
    }
    
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
            loading="lazy"
            decoding="async"
            onError={(e) => {
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
});
