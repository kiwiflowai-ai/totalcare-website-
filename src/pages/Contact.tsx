import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Phone, MapPin, Mail, Clock, MessageSquare } from 'lucide-react';
// Supabase WhatsApp image URLs
const whatsappSc1 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc1.JPEG';
const whatsappSc2 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc2.png';

// Debug logging
console.log('🔍 WhatsApp Images Debug:');
console.log('sc1 URL:', whatsappSc1);
console.log('sc2 URL:', whatsappSc2);

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* WhatsApp QR Codes */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us via WhatsApp</h2>
              <p className="text-muted-foreground mb-8">
                Scan the QR codes below to contact us directly on WhatsApp for instant support and quotes.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <Card className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-6">WhatsApp Business</h3>
                <img 
                  src={whatsappSc1} 
                  alt="WhatsApp QR Code 1" 
                  className="w-80 h-80 mx-auto object-contain rounded-lg border border-border"
                  onLoad={() => console.log('✅ sc1 image loaded successfully')}
                  onError={(e) => console.error('❌ sc1 image failed to load:', e)}
                />
                <p className="text-muted-foreground mt-4">Scan to chat with our team</p>
              </Card>
              <Card className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-6">WhatsApp Support</h3>
                <img 
                  src={whatsappSc2} 
                  alt="WhatsApp QR Code 2" 
                  className="w-80 h-80 mx-auto object-contain rounded-lg border border-border"
                  onLoad={() => console.log('✅ sc2 image loaded successfully')}
                  onError={(e) => console.error('❌ sc2 image failed to load:', e)}
                />
                <p className="text-muted-foreground mt-4">Scan for technical support</p>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="021 123 4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <select 
                      id="propertyType" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential Home</option>
                      <option value="apartment">Apartment</option>
                      <option value="commercial">Commercial Building</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your heating needs, room size, or any specific requirements..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Choose TotalCare Electrician?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">
                Emergency service available around the clock for urgent heating issues.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Local Experts</h3>
              <p className="text-muted-foreground text-sm">
                Auckland-based team with deep knowledge of local climate and requirements.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Installation</h3>
              <p className="text-muted-foreground text-sm">
                Most installations completed same day with minimal disruption to your routine.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
