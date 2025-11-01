import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Phone, MapPin, Mail, Clock, MessageSquare } from 'lucide-react';
// Supabase WhatsApp image URL
const whatsappSc1 = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/whatsapp/sc1.JPEG';

// Debug logging
console.log('🔍 WhatsApp Image Debug:');
console.log('sc1 URL:', whatsappSc1);

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submit triggered!');
    console.log('📋 Current form data:', formData);
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.serviceType || !formData.message) {
      console.error('❌ Form validation failed - missing required fields');
      console.error('Missing fields:', {
        firstName: !formData.firstName,
        lastName: !formData.lastName,
        email: !formData.email,
        phone: !formData.phone,
        serviceType: !formData.serviceType,
        message: !formData.message
      });
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const webhookData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        message: formData.message,
        timestamp: new Date().toISOString(),
        source: 'contact_page_form',
        website: 'totalcareelectrical.co.nz'
      };

      console.log('📤 Sending webhook data:', webhookData);
      console.log('🌐 Webhook URL: https://hook.us2.make.com/sui70ratqagk38ttekllz681l5w2i9zu');

      // Send to Make.com webhook
      const response = await fetch('https://hook.us2.make.com/sui70ratqagk38ttekllz681l5w2i9zu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(webhookData),
        mode: 'cors',
      });

      console.log('📥 Response status:', response.status);
      console.log('✅ Response ok:', response.ok);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      // Try to read response body for debugging
      let responseBody = '';
      try {
        responseBody = await response.text();
        console.log('📄 Response body:', responseBody);
      } catch (readError) {
        console.log('⚠️ Could not read response body:', readError);
      }

      // Make.com webhooks typically return 200 OK for successful submissions
      // Some may return 202 Accepted or other 2xx status codes
      if (response.ok || response.status === 200 || response.status === 202) {
        console.log('✅ Contact form submitted successfully to webhook');
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceType: '',
          message: ''
        });
      } else {
        console.error('❌ Failed to submit contact form.');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Response Body:', responseBody);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('💥 Error submitting contact form:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🌐 Network error - webhook may be unreachable or CORS blocked');
      }
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Scan the QR code below to contact us directly on WhatsApp for instant support and quotes.
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe" 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="021 123 4567" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <select 
                      id="serviceType" 
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">Select service type</option>
                      <option value="heating-cooling">Heating & Cooling Installation</option>
                      <option value="air-conditioning">Air Conditioning Services</option>
                      <option value="electrical">Electrical Services</option>
                      <option value="maintenance">Maintenance & Repairs</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your heating needs, room size, or any specific requirements..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium mb-2">Sorry, there was an error sending your message.</p>
                      <p className="text-red-700 text-sm">
                        Please ensure all required fields are filled out, especially the Service Type field, and try again. 
                        If the problem persists, call us directly at +64 27 750 0999.
                      </p>
                      <p className="text-red-600 text-xs mt-2">
                        💡 Check the browser console (F12) for detailed error messages.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Choose Totalcare Electrical & HVAC LTD?</h2>
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
