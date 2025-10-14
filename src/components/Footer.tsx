import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">TotalCare Electrician</h3>
                <p className="text-background/70">Your trusted heat pump specialists</p>
              </div>
            </div>
            <p className="text-background/80 leading-relaxed">
              Professional heat pump installation and service across Auckland. 
              We're committed to providing energy-efficient heating solutions 
              that save you money and keep your family comfortable.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+64277500999" className="text-background/80 hover:text-background transition-colors">
                  +64 27 750 0999
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-background/80">totalcareelectrical@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-background/80">Serving All Auckland</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-background/80">24/7 Emergency Service</span>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Service Areas</h4>
            <div className="space-y-2 text-background/80">
              <div>• North Shore</div>
              <div>• Central Auckland</div>
              <div>• South Auckland</div>
              <div>• West Auckland</div>
              <div>• East Auckland</div>
              <div>• Waitakere</div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2024 TotalCare Electrician. Licensed & Insured. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/60">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background transition-colors">Warranty</a>
          </div>
        </div>
      </div>
    </footer>
  );
}