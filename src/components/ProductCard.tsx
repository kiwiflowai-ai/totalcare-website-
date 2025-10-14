import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  originalPrice: number;
  salePrice?: number;
  image: string;
  hoverImage?: string;
  onSale?: boolean;
  isNew?: boolean;
}

export function ProductCard({
  title,
  originalPrice,
  salePrice,
  image,
  hoverImage,
  onSale = false,
  isNew = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = salePrice || originalPrice;
  const hasDiscount = onSale && salePrice && salePrice < originalPrice;

  return (
    <div 
      className="group relative bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale Badge */}
      {onSale && (
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            variant="destructive" 
            className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs px-2 py-1 shadow-md"
          >
            SALE
          </Badge>
        </div>
      )}
      
      {/* New Badge */}
      {isNew && (
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant="outline" 
            className="bg-success hover:bg-success text-success-foreground border-success font-bold text-xs px-2 py-1 shadow-md"
          >
            NEW
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted/50 relative">
        <img
          src={isHovered && hoverImage ? hoverImage : image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-foreground">
              ${displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Incl GST • Free Installation Quote
          </div>
          {hasDiscount && (
            <div className="text-xs font-medium text-success">
              Save ${(originalPrice - (salePrice || 0)).toLocaleString()}
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* CTA Button */}
        <button className="w-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-primary/20 hover:border-primary">
          Get Quote
        </button>
      </div>
    </div>
  );
}