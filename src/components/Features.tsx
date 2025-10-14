import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award, Wrench } from 'lucide-react';
import { BrandLogos } from './BrandLogos';

const features = [
  {
    icon: CheckCircle,
    title: "Licensed Auckland Electrician",
    description: "Certified heat pump installers with 25+ years experience. Mitsubishi and Daikin certified technicians."
  },
  {
    icon: Users,
    title: "100+ Auckland Customers",
    description: "Join hundreds of satisfied Auckland families who trust us for heat pump installation and servicing."
  },
  {
    icon: Award,
    title: "Heat Pump Servicing Auckland",
    description: "Comprehensive 5-year warranty on all heat pump installations. Professional maintenance and servicing."
  },
  {
    icon: Wrench,
    title: "24/7 Emergency Service",
    description: "Round-the-clock heat pump repair and electrical services across Auckland, including weekends and holidays."
  }
];

export function Features() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose TotalCare Electrician?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're Auckland's most trusted heat pump specialists, delivering exceptional 
            service and energy savings for over a decade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center space-y-4 shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>


      </div>
    </section>
  );
}