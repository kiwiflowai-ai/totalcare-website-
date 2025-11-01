import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCardNew } from '@/components/ProductCardNew';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProducts, getBrands, getProductSeries, getPriceRanges, Product } from '@/data/products';
import { Search, Filter, X, Zap, Thermometer, ShoppingBag, ThermometerSun } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Show 24 products per page
  
  // Debounce search input to reduce filtering overhead
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load data from Supabase - OPTIMIZED: Fetch products once, then derive filter data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch products once (this is the only API call)
        const productsData = await getProducts();
        
        // Derive filter data from the fetched products (no additional API calls)
        const [brandsData, seriesData, priceRangesData] = await Promise.all([
          getBrands(productsData),  // Pass products to avoid duplicate fetch
          getProductSeries(productsData),  // Pass products to avoid duplicate fetch
          getPriceRanges(productsData)  // Pass products to avoid duplicate fetch
        ]);
        
        setProducts(productsData);
        setBrands(brandsData.filter(brand => brand && brand.trim() !== ''));
        setSeries(seriesData.filter(serie => serie && serie.trim() !== ''));
        setPriceRanges(priceRangesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle URL parameters - sync on mount and when URL changes
  useEffect(() => {
    const category = searchParams.get('category');
    if (category === 'ev-chargers') {
      setSelectedCategory('ev-chargers');
    } else if (category === 'heat-pumps') {
      setSelectedCategory('heat-pumps');
    } else if (!category) {
      // Only set to 'all' if no category param exists
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Update URL when category changes (but not from URL param reads)
  useEffect(() => {
    const currentCategory = searchParams.get('category');
    // Only update URL if category state doesn't match URL param
    if (selectedCategory === 'all' && currentCategory) {
      // Remove category param when "all" is selected
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams, { replace: true });
    } else if (selectedCategory !== 'all' && currentCategory !== selectedCategory) {
      // Update category param
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', selectedCategory);
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedCategory, searchParams, setSearchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter - use case-insensitive matching and trim whitespace
    if (selectedCategory === 'ev-chargers') {
      filtered = products.filter(product => {
        const brand = (product.brand || '').trim().toLowerCase();
        const isEVCharger = brand === 'wallbox' || brand === 'tesla';
        return isEVCharger;
      });
      if (import.meta.env.DEV && filtered.length === 0) {
        // Debug: Check available brands when no EV chargers found
        const allBrands = [...new Set(products.map(p => (p.brand || '').trim().toLowerCase()))];
        console.log('🔍 EV Charger filter - No products found. Available brands:', allBrands);
      }
    } else if (selectedCategory === 'heat-pumps') {
      filtered = products.filter(product => {
        const brand = (product.brand || '').trim().toLowerCase();
        return brand !== 'wallbox' && brand !== 'tesla';
      });
    }

    // Search filter (use debounced value)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        (product.model && product.model.toLowerCase().includes(searchLower))
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Series filter
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(product => product.series === selectedSeries);
    }

    // Price range filter - optimized with early exit
    if (selectedPriceRange !== 'all') {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => {
          // Cache price parsing
          const priceStr = product.price.replace(/[^0-9]/g, '');
          if (!priceStr) return false;
          const price = parseInt(priceStr);
          return !isNaN(price) && price >= range.min && price < range.max;
        });
      }
    }

    // Sort - Featured products always come first
    // Use toSorted for better performance (if available) or sort in place
    const sorted = [...filtered].sort((a, b) => {
      // Featured products always come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // If both featured or both not featured, apply regular sorting
      switch (sortBy) {
        case 'price-low': {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
          return priceA - priceB;
        }
        case 'price-high': {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
          return priceB - priceA;
        }
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    filtered = sorted;

    return filtered;
  }, [products, debouncedSearchTerm, selectedBrand, selectedSeries, selectedPriceRange, sortBy, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change (use debounced search)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedBrand, selectedSeries, selectedPriceRange, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
    setSelectedSeries('all');
    setSelectedPriceRange('all');
    setSortBy('name');
    setSelectedCategory('all');
  };

  const activeFiltersCount = [
    searchTerm,
    selectedBrand !== 'all',
    selectedSeries !== 'all',
    selectedPriceRange !== 'all',
    selectedCategory !== 'all'
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {selectedCategory === 'ev-chargers' 
                ? 'EV Charger Installation Auckland' 
                : selectedCategory === 'heat-pumps' 
                ? 'Heat Pump Installation Auckland' 
                : 'Heat Pump Installation Auckland - Licensed Electricians'
              }
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {selectedCategory === 'ev-chargers' 
                ? 'Professional EV charger installation services in Auckland. Licensed electricians for safe and efficient charging solutions.'
                : selectedCategory === 'heat-pumps'
                ? 'Professional heat pump installation Auckland. Licensed electricians specialising in heat pump supply, installation, and servicing.'
                : 'Professional heat pump installation Auckland. Licensed electricians with 25+ years experience. Certified installers. Free quotes available.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear ({activeFiltersCount})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          All Products
                        </div>
                      </SelectItem>
                      <SelectItem value="heat-pumps">
                        <div className="flex items-center gap-2">
                          <ThermometerSun className="h-4 w-4 text-primary" />
                          Heat Pumps
                        </div>
                      </SelectItem>
                      <SelectItem value="ev-chargers">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-accent" />
                          EV Chargers
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.filter(brand => brand && brand.trim() !== '').map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Series Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Series</label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Series</SelectItem>
                      {series.filter(serie => serie && serie.trim() !== '').map(serie => (
                        <SelectItem key={serie} value={serie}>{serie}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      {priceRanges.filter(range => range && range.label && range.label.trim() !== '').map(range => (
                        <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                  {totalPages > 1 && (
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      (Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)})
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeFiltersCount > 0 && 'Filtered results'}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCardNew
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                    <span className="text-sm text-muted-foreground ml-4">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
