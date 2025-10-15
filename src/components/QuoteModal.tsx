import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, MessageSquare, Phone, MapPin, User, CheckCircle, QrCode } from 'lucide-react';
import { Product } from '@/data/products';

// Supabase WhatsApp image URLs
const whatsappSc1 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc1.JPEG';
const whatsappSc2 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc2.png';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function QuoteModal({ isOpen, onClose, product }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    description: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send data to webhook
      const webhookData = {
        product: {
          name: product?.name,
          brand: product?.brand,
          price: product?.price,
          series: product?.series,
          model: product?.model
        },
        customer: {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          description: formData.description
        },
        timestamp: new Date().toISOString(),
        source: 'website_quote_modal'
      };

      const response = await fetch('https://hook.us2.make.com/p2rf9okiehaj8scot6qdreachdilqvv7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('Quote request sent to webhook successfully');
      } else {
        console.error('Failed to send quote request to webhook');
      }
    } catch (error) {
      console.error('Error sending quote request to webhook:', error);
    }
    
    // Show success state with QR code instead of opening WhatsApp
    setIsSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      location: '',
      description: ''
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Quote Request Sent!
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 text-primary" />
                Get Free Quote
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isSubmitted ? (
            // Success State with WhatsApp QR Codes
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Thank you for your interest!</h3>
                <p className="text-sm text-muted-foreground">
                  We've received your quote request for the <strong>{product.name}</strong>. 
                  Our team will contact you shortly.
                </p>
              </div>

              {/* WhatsApp QR Codes */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Contact us on WhatsApp
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan the QR codes below to chat with our team directly
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">WhatsApp Business</h5>
                    <img 
                      src={whatsappSc1} 
                      alt="WhatsApp QR Code 1" 
                      className="w-32 h-32 mx-auto object-contain rounded-lg border border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-2">For general inquiries</p>
                  </div>
                  
                  <div className="text-center p-4 border border-border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">WhatsApp Support</h5>
                    <img 
                      src={whatsappSc2} 
                      alt="WhatsApp QR Code 2" 
                      className="w-32 h-32 mx-auto object-contain rounded-lg border border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-2">For technical support</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Close
              </Button>
            </div>
          ) : (
            // Form State
            <>
              {/* Product Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Product Details</h3>
                <div className="space-y-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.brand} • {product.series}</p>
                  <p className="text-sm font-semibold text-primary">{product.price}</p>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +64 21 123 4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., North Shore, Auckland"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your requirements, room size, or any specific needs..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Quote Request
                  </Button>
                </div>
              </form>

              <div className="text-xs text-muted-foreground text-center">
                We'll contact you within 24 hours with your free quote
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
