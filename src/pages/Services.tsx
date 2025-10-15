import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Phone, MapPin, Mail, Clock, MessageSquare, QrCode, Zap, Settings, CheckCircle, Star } from 'lucide-react';

// Supabase WhatsApp image URL
const whatsappSc1 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc1.JPEG';

export default function Services() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      // Send data to webhook
      const webhookData = {
        service: 'electrician_services',
        customer: {
          name: formData.get('name'),
          phone: formData.get('phone'),
          location: formData.get('location'),
          service_type: formData.get('service_type'),
          description: formData.get('description')
        },
        timestamp: new Date().toISOString(),
        source: 'services_page_contact_form'
      };

      const response = await fetch('https://hook.us2.make.com/p2rf9okiehaj8scot6qdreachdilqvv7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('Service inquiry sent to webhook successfully');
        alert('Thank you! We\'ll contact you within 24 hours.');
        (e.target as HTMLFormElement).reset();
      } else {
        console.error('Failed to send service inquiry to webhook');
        alert('There was an error sending your inquiry. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Error sending service inquiry to webhook:', error);
      alert('There was an error sending your inquiry. Please try again or call us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional Electrical Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From residential installations to commercial projects, we deliver safe, reliable, and efficient electrical solutions across Auckland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Phone className="w-5 h-5 mr-2" />
              Call +64 27 750 0999
            </Button>
            <Button size="lg" variant="outline">
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Free Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Residential Services */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">⚡ Residential</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We provide tailored, modern electrical solutions for all residential projects — from new builds and renovations to repairs and upgrades. Our team combines your vision with our expertise to make every project seamless, efficient, and stress-free.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With extensive product knowledge and trusted industry contacts, we ensure your home is in safe hands from start to finish. Whether it's improving comfort, safety, or energy efficiency, we deliver high-quality results that last.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-900">
                    Total Works Electrical — quality residential electricians you can trust across Auckland.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Commercial Services */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">⚙️ Commercial</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We offer dependable electrical support for small-to-medium commercial spaces, including offices, retail stores, and workshops. From installations and upgrades to ongoing maintenance, we deliver safe, efficient, and compliant solutions tailored to your business needs.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our focus is on reliability and minimizing downtime — so your business can keep operating smoothly without interruptions.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900">
                    Total Works Electrical — trusted Auckland electricians for professional, no-fuss commercial support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Get Your Free Quote</h2>
                <p className="text-muted-foreground mb-8">
                  Ready to start your electrical project? Fill out the form below and we'll get back to you within 24 hours with a detailed quote.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <span>Full Name *</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
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
                      placeholder="+64 21 123 4567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., North Shore, Auckland"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type *</Label>
                  <select
                    id="service_type"
                    name="service_type"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Select service type</option>
                    <option value="residential">Residential Electrical</option>
                    <option value="commercial">Commercial Electrical</option>
                    <option value="repair">Repair & Maintenance</option>
                    <option value="installation">New Installation</option>
                    <option value="upgrade">Upgrade & Renovation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your electrical project, room size, specific requirements, or any questions you have..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Quote Request
                </Button>
              </form>

              <div className="text-sm text-muted-foreground text-center">
                We'll contact you within 24 hours with your free quote
              </div>
            </div>

            {/* WhatsApp QR Code */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us Directly</h2>
                <p className="text-muted-foreground mb-8">
                  Prefer to chat? Scan our WhatsApp QR code for instant contact and support.
                </p>
              </div>

              <div className="text-center p-8 border border-border rounded-lg bg-white">
                <h3 className="font-semibold text-xl mb-6">WhatsApp Business</h3>
                <img 
                  src={whatsappSc1} 
                  alt="WhatsApp QR Code" 
                  className="w-64 h-64 mx-auto object-contain rounded-lg border border-border"
                />
                <p className="text-lg text-muted-foreground mt-6 font-medium">For inquiries & quotes</p>
                <p className="text-sm text-muted-foreground mt-2">Scan with your phone's camera to start chatting</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">+64 27 750 0999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Service Area</p>
                    <p className="text-muted-foreground">Auckland & Surrounding Areas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-muted-foreground">Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
