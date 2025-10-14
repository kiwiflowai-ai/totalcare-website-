import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThermometerSun, Award, Clock, Shield, Zap, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogos } from './BrandLogos';

export function Hero() {
  return (
    <section className="relative bg-gradient-hero py-16 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Content */}
          <div className="space-y-12 max-w-5xl">
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/30 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center">
                  <ThermometerSun className="h-8 w-8 text-success" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">Heat Pump Installation</div>
                  <div className="text-lg text-muted-foreground">Professional installation</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-500/20 to-blue-500/10 border-2 border-blue-500/30 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">EV Charger Installation</div>
                  <div className="text-lg text-muted-foreground">Smart charging solutions</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-background/50 rounded-xl">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">Licensed Auckland Electrician</div>
                  <div className="text-lg text-muted-foreground">Certified & insured</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-background/50 rounded-xl">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">Fast Service</div>
                  <div className="text-lg text-muted-foreground">Available across Auckland</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/contact">
                <Button size="lg" className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xl px-16 py-6 w-full sm:w-[250px] h-16 rounded-xl font-bold">
                  Contact Us
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground text-xl px-16 py-6 w-full sm:w-[250px] h-16 rounded-xl font-bold">
                  <ShoppingBag className="w-6 h-6 mr-3" />
                  View Products
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}