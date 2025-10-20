import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Heat Pump Installation</h1>
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">Terms & Conditions</h2>
          <p className="text-muted-foreground text-lg">
            Clear pricing and installation guidelines for your heat pump project
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          
          {/* Standard Installation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Standard Back-to-Back Installation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-foreground leading-relaxed">
                  The outdoor unit is placed at the base of the outside wall on which the indoor unit will be installed, 
                  and the two are connected. The connection shall not exceed <strong>3 meters</strong>.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-foreground leading-relaxed">
                  <strong>Assessment Process:</strong> We will visit your home, provide an assessment of your situation, 
                  and let you know if your installation will be standard or will incur any additional costs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Possible Extras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Possible Additional Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                
                {/* Connection Length */}
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Extended Connection</h4>
                    <p className="text-sm text-muted-foreground">Connection exceeding 3M between indoor and outdoor unit</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $70/meter
                  </Badge>
                </div>

                {/* Wall Penetrations */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Brick Wall Penetration</h4>
                      <p className="text-sm text-muted-foreground">Drilling through brick walls</p>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                      <DollarSign className="w-3 h-3 mr-1" />
                      $100
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Concrete Wall Penetration</h4>
                      <p className="text-sm text-muted-foreground">Drilling through concrete walls</p>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                      <DollarSign className="w-3 h-3 mr-1" />
                      $100
                    </Badge>
                  </div>
                </div>

                {/* Power Line */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Dedicated Power Line</h4>
                    <p className="text-sm text-muted-foreground">Installation for large units (6kw or larger)</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $200+
                  </Badge>
                </div>

                {/* Mounting Options */}
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Wall Brackets or Roof Mounting</h4>
                    <p className="text-sm text-muted-foreground">Special mounting kits for unique installations</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $50-200
                  </Badge>
                </div>

                {/* Base Options */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Poly Slab Base</h4>
                    <p className="text-sm text-muted-foreground">Stable base for outdoor unit</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $50
                  </Badge>
                </div>

                {/* Old Unit Removal */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Detachment of Old Unit</h4>
                      <p className="text-sm text-muted-foreground">Removing existing heat pump</p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      <DollarSign className="w-3 h-3 mr-1" />
                      $60
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Disposal of Old Unit</h4>
                      <p className="text-sm text-muted-foreground">Proper disposal of removed unit</p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      <DollarSign className="w-3 h-3 mr-1" />
                      $60
                    </Badge>
                  </div>
                </div>

                {/* Drainage Pump */}
                <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Drainage Pump</h4>
                    <p className="text-sm text-muted-foreground">For units requiring drainage assistance</p>
                  </div>
                  <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $100+
                  </Badge>
                </div>

                {/* Aerial Work */}
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">Aerial Work</h4>
                    <p className="text-sm text-muted-foreground">Any work higher than 3 meters</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Quote Required
                  </Badge>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Questions About Your Installation?</h3>
                <p className="text-muted-foreground">
                  Contact us for a free assessment and detailed quote for your specific requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="tel:+64277500999" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Call: +64 27 750 0999
                  </a>
                  <a 
                    href="mailto:totalcareelectrical@gmail.com" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  );
}
