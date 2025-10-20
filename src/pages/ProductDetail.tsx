import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Wifi, Zap, Settings, CheckCircle, MessageSquare, Images, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { QuoteModal } from '@/components/QuoteModal';
import { getProducts, Product } from '@/data/products';
import { supabase } from '@/lib/supabase';

interface ProductImages {
  main: string;
  gallery: string[];
}

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [productImages, setProductImages] = useState<ProductImages>({ main: '', gallery: [] });
  const [activeTab, setActiveTab] = useState<'cover' | 'images'>('cover');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Get all images from product_images column
  const getAllProductImages = (product: Product): string[] => {
    let productImagesArray = [];
    
    if (product.product_images) {
      if (typeof product.product_images === 'string') {
        try {
          productImagesArray = JSON.parse(product.product_images);
          console.log('Parsed product_images from JSON string:', productImagesArray.length, 'images');
        } catch (error) {
          console.error('Error parsing product_images JSON:', error);
          productImagesArray = [];
        }
      } else if (Array.isArray(product.product_images)) {
        productImagesArray = product.product_images;
        console.log('Using product_images array directly:', productImagesArray.length, 'images');
      }
    }
    
    // Clean up the base64 strings (remove any extra escape characters)
    const cleanedImages = productImagesArray.map(img => {
      if (typeof img === 'string') {
        return img.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      return img;
    });
    
    return cleanedImages.filter(img => img && img.startsWith('data:image/'));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get the best available image for initial selection
          let initialImage = foundProduct.image;
          if (!initialImage || initialImage.trim() === '') {
            const productImages = getAllProductImages(foundProduct);
            if (productImages.length > 0) {
              initialImage = productImages[0];
            }
          }
          setSelectedImage(initialImage || '');
          
          // Generate image gallery based on product series and brand
          const images = await generateProductImages(foundProduct);
          console.log('Generated images for product:', foundProduct.name, images);
          setProductImages({
            main: images.main || foundProduct.image || '',
            gallery: Array.isArray(images.gallery) ? images.gallery : []
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Set up real-time subscription to product changes
    if (productId) {
      const subscription = supabase
        .channel('product-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
            filter: `id=eq.${productId}`
          },
                (payload) => {
                  console.log('🔄 Product updated in Supabase:', payload);
                  
                  // Handle cover image updates
                  if (payload.new && payload.new.image) {
                    console.log('📸 Cover image updated:', payload.new.image.substring(0, 50) + '...');
                    
                    // Update selected image if we're on cover tab
                    if (activeTab === 'cover') {
                      setSelectedImage(payload.new.image);
                    }
                    
                    // Update product state with new cover image
                    setProduct(prev => ({
                      ...prev,
                      image: payload.new.image
                    }));
                  }
                  
                  // Handle product images updates
                  if (payload.new && payload.new.product_images) {
                    // Parse the updated product_images
                    let updatedImages = [];
                    if (typeof payload.new.product_images === 'string') {
                      try {
                        updatedImages = JSON.parse(payload.new.product_images);
                        console.log('✅ Parsed updated product_images from JSON:', updatedImages.length, 'images');
                      } catch (error) {
                        console.error('❌ Error parsing updated product_images:', error);
                      }
                    } else if (Array.isArray(payload.new.product_images)) {
                      updatedImages = payload.new.product_images;
                      console.log('✅ Using updated product_images array directly:', updatedImages.length, 'images');
                    }

                    // Clean up the base64 strings
                    const cleanedImages = updatedImages.map(img => {
                      if (typeof img === 'string') {
                        return img.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                      }
                      return img;
                    }).filter(img => img && img.startsWith('data:image/'));

                    console.log('🧹 Cleaned images:', cleanedImages.length, 'valid images');

                    // Update the UI with new images
                    const newProductImages = {
                      main: cleanedImages[0] || payload.new.image || '',
                      gallery: cleanedImages.slice(1, 7)
                    };
                    
                    setProductImages(newProductImages);
                    
                    // If we're on the images tab, select the first product image
                    if (activeTab === 'images' && cleanedImages.length > 0) {
                      setSelectedImage(cleanedImages[0]);
                    }
                    
                    // Update product state with product images
                    setProduct(prev => ({
                      ...prev,
                      product_images: cleanedImages
                    }));

                    console.log('🎉 UI updated with new product images from Supabase:', {
                      totalImages: cleanedImages.length,
                      mainImage: newProductImages.main ? '✅' : '❌',
                      galleryImages: newProductImages.gallery.length,
                      activeTab: activeTab
                    });
                  }
                  
                  // Handle any other product field updates
                  if (payload.new) {
                    setProduct(prev => ({
                      ...prev,
                      ...payload.new
                    }));
                    console.log('🔄 Product state updated with all changes from Supabase');
                  }
                }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [productId]);

  // Handle tab switching
  useEffect(() => {
    if (activeTab === 'images' && product) {
      const allImages = getAllProductImages(product);
      if (allImages.length > 0) {
        setSelectedImage(allImages[0]);
      }
    } else if (activeTab === 'cover' && product) {
      setSelectedImage(product.image || '');
    }
  }, [activeTab, product]);

  const generateProductImages = async (product: Product): Promise<ProductImages> => {
    // Parse product_images if it's a JSON string
    let productImagesArray = [];
    
    if (product.product_images) {
      if (typeof product.product_images === 'string') {
        try {
          productImagesArray = JSON.parse(product.product_images);
          console.log('Parsed product_images from JSON string:', productImagesArray.length, 'images');
          console.log('First parsed image preview:', productImagesArray[0]?.substring(0, 100) + '...');
          console.log('All parsed images:', productImagesArray.map((img, i) => ({
            index: i,
            length: img?.length || 0,
            startsWith: img?.substring(0, 50) || 'null'
          })));
        } catch (error) {
          console.error('Error parsing product_images JSON:', error);
          productImagesArray = [];
        }
      } else if (Array.isArray(product.product_images)) {
        productImagesArray = product.product_images;
        console.log('Using product_images array directly:', productImagesArray.length, 'images');
      }
    }
    
    // Use the parsed array
    if (productImagesArray && productImagesArray.length > 0) {
      // Clean up the base64 strings (remove any extra escape characters)
      const cleanedImages = productImagesArray.map(img => {
        if (typeof img === 'string') {
          // Remove any extra backslashes that might have been added during JSON storage
          return img.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        return img;
      });
      
      console.log('Cleaned images preview:', cleanedImages.map((img, i) => ({
        index: i,
        length: img?.length || 0,
        startsWith: img?.substring(0, 50) || 'null',
        isValidBase64: img?.startsWith('data:image/') || false
      })));
      
      return {
        main: cleanedImages[0] || product.image || '',
        gallery: cleanedImages.slice(1, 7) // Use remaining images as gallery
      };
    }
    
    // Fallback to single product image if no gallery
    return {
      main: product.image || '',
      gallery: []
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <Header />
      
      {/* Product Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.brand} {product.series}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Image Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('cover')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'cover'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                Cover Image
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'images'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Images className="w-4 h-4" />
                Product Images
                {product && getAllProductImages(product).length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getAllProductImages(product).length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Cover Image Tab */}
            {activeTab === 'cover' && (
              <div className="space-y-4">
                {/* Main Cover Image */}
                <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted/30">
                  {/* Helper function to get the best available cover image */}
                  {(() => {
                    // First try the cover image
                    let coverImage = product.image;
                    
                    // If no cover image, try first product image as fallback
                    if (!coverImage || coverImage.trim() === '') {
                      const productImages = getAllProductImages(product);
                      if (productImages.length > 0) {
                        coverImage = productImages[0];
                      }
                    }
                    
                    return coverImage ? (
                      <img
                        src={coverImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-300"
                        onLoad={() => {
                          console.log('✅ Cover image loaded successfully');
                          console.log('📏 Cover image length:', coverImage?.length);
                          console.log('🆔 Product ID:', product?.id);
                          console.log('📝 Product Name:', product?.name);
                          console.log('🖼️ Image source:', coverImage === product.image ? 'cover image' : 'first product image');
                        }}
                        onError={(e) => {
                          console.error('Cover image failed to load:', {
                            imageLength: coverImage?.length,
                            productId: product?.id,
                            productName: product?.name,
                            isCoverImage: coverImage === product.image,
                            isProductImage: coverImage !== product.image
                          });
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                          e.currentTarget.style.display = 'flex';
                          e.currentTarget.style.alignItems = 'center';
                          e.currentTarget.style.justifyContent = 'center';
                          e.currentTarget.innerHTML = '❌ Cover image failed to load';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Thermometer className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-bold text-primary">{product.brand}</h3>
                          <p className="text-sm text-muted-foreground">{product.series}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Product Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                {product && getAllProductImages(product).length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Selected Image */}
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted/30">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-300"
                          onLoad={() => {
                            console.log('Selected product image loaded successfully');
                            console.log('Selected image length:', selectedImage.length);
                          }}
                          onError={(e) => {
                            console.error('Selected product image failed to load:', {
                              imageLength: selectedImage.length,
                              productId: product?.id,
                              productName: product?.name
                            });
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                            e.currentTarget.style.display = 'flex';
                            e.currentTarget.style.alignItems = 'center';
                            e.currentTarget.style.justifyContent = 'center';
                            e.currentTarget.innerHTML = '❌ Product image failed to load';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                              <Images className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-primary">Product Images</h3>
                            <p className="text-sm text-muted-foreground">Click an image below to view</p>
                  </div>
                </div>
              )}
            </div>

                    {/* Thumbnail Grid */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">All Product Images</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {getAllProductImages(product).length} images
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {getAllProductImages(product).map((image, index) => (
                  <button
                            key={`product-image-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      selectedImage === image 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                              alt={`${product.name} image ${index + 1}`}
                      className="w-full h-full object-cover"
                              onLoad={() => {
                                console.log(`Product image ${index + 1} loaded successfully`);
                                console.log(`Image length: ${image.length} characters`);
                              }}
                              onError={(e) => {
                                console.error(`Product image ${index + 1} failed to load:`, {
                                  imageLength: image.length,
                                  imageStart: image.substring(0, 100),
                                  imageEnd: image.substring(image.length - 100),
                                  productId: product?.id,
                                  productName: product?.name
                                });
                                e.currentTarget.style.backgroundColor = '#f0f0f0';
                                e.currentTarget.style.display = 'flex';
                                e.currentTarget.style.alignItems = 'center';
                                e.currentTarget.style.justifyContent = 'center';
                                e.currentTarget.innerHTML = '❌';
                              }}
                    />
                  </button>
                ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted/30 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Images className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-bold text-muted-foreground">No Product Images</h3>
                      <p className="text-sm text-muted-foreground">Add images to the product_images column in Supabase</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                <Badge variant="outline">{product.series}</Badge>
                {product.hasWifi && (
                  <Badge variant="default" className="bg-blue-500">
                    <Wifi className="w-3 h-3 mr-1" />
                    WiFi
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-2">{product.price}</p>
              <div className="text-sm text-blue-600 font-medium mb-4">
                Contact me for details: +64 27 750 0999
              </div>
              {product.promotions && product.promotions !== '[]' && product.promotions.trim() !== '' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-800 font-medium">{product.promotions}</p>
                </div>
              )}
            </div>

            {/* Get Free Quote Button */}
            <div className="flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium shadow-lg" onClick={() => setIsQuoteModalOpen(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Get Free Quote
              </Button>
            </div>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Cooling Capacity:</span>
                      <span className="text-sm">{product.coolingCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Heating Capacity:</span>
                      <span className="text-sm">{product.heatingCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Model:</span>
                      <span className="text-sm font-mono">{product.model}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Brand:</span>
                      <span className="text-sm">{product.brand}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Series:</span>
                      <span className="text-sm">{product.series}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">WiFi:</span>
                      <span className="text-sm">{product.hasWifi ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {product.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Energy Efficient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Quiet Operation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Professional Installation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Warranty Included</span>
                  </div>
                  {product.hasWifi && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Smart WiFi Control</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Free Installation Quote</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions Link */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Installation Terms & Conditions</h3>
                      <p className="text-sm text-muted-foreground">Review pricing and installation guidelines</p>
                    </div>
                  </div>
                  <Link to="/terms">
                    <Button variant="outline" className="font-medium">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      
      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={product}
      />
    </div>
  );
}

export default ProductDetail;
