import logo1 from '@/assets/logos/IMG_5860.JPEG';
import logo2 from '@/assets/logos/IMG_5862.PNG';
import logo3 from '@/assets/logos/IMG_5864.PNG';
import logo4 from '@/assets/logos/IMG_5865.JPEG';
import logo5 from '@/assets/logos/IMG_5866.PNG';
import logo6 from '@/assets/logos/IMG_5867.JPEG';
import logo7 from '@/assets/logos/IMG_5868.PNG';

const logos = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7
];

export function LogosGallery() {
  return (
    <section className="pt-8 pb-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Our Trusted Brands</h3>
          <p className="text-lg text-muted-foreground">We work with the world's leading manufacturers</p>
        </div>
        <div className="flex justify-center items-center gap-6 overflow-x-auto">
          {logos.map((logo, index) => (
            <img 
              key={index}
              src={logo} 
              alt={`Trusted Brand ${index + 1}`}
              className="h-28 w-28 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
