import { Phone, MapPin, Menu, Home, ShoppingBag, MessageSquare, ChevronDown, ThermometerSun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logos/main.JPEG';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="TotalCare Electrician Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">TotalCare Electrician</h1>
              <p className="text-sm text-muted-foreground">Licensed Auckland Electrician • Heat Pump and EV charger Installation Specialists</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-1">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <div className="relative group">
                <Link 
                  to="/products" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/products') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Products
                  <ChevronDown className="h-3 w-3" />
                </Link>
                
                {/* Hover Dropdown */}
                <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link 
                      to="/products" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <ThermometerSun className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Heat Pumps</div>
                        <div className="text-xs text-muted-foreground">Energy efficient heating & cooling</div>
                      </div>
                    </Link>
                    <Link 
                      to="/products?category=ev-chargers" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Zap className="h-5 w-5 text-accent" />
                      <div>
                        <div className="font-medium">EV Chargers</div>
                        <div className="text-xs text-muted-foreground">Electric vehicle charging solutions</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <Link 
                to="/contact" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/contact') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Serving All Auckland</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:+64277500999" className="font-semibold text-foreground hover:text-primary transition-colors">
                +64 27 750 0999
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  <nav className="space-y-2">
                    <Link 
                      to="/" 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/') 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        Products
                      </div>
                      <div className="ml-7 space-y-1">
                        <Link 
                          to="/products" 
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/products') 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <ThermometerSun className="h-4 w-4 text-primary" />
                          Heat Pumps
                        </Link>
                        <Link 
                          to="/products?category=ev-chargers" 
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/products?category=ev-chargers') 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Zap className="h-4 w-4 text-accent" />
                          EV Chargers
                        </Link>
                      </div>
                    </div>
                    <Link 
                      to="/contact" 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/contact') 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact
                    </Link>
                  </nav>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Serving All Auckland</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href="tel:+64277500999" className="font-semibold hover:text-primary transition-colors">
                        +64 27 750 0999
                      </a>
                    </div>
                  </div>
                  <Button className="bg-gradient-primary hover:bg-primary-hover w-full">
                    Get Free Quote
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}