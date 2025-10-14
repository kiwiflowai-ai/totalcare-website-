import { Card } from '@/components/ui/card';
import mitsubishiImage from '@/assets/Mitsubishi Electric/AP 25.png';
import daikinImage from '@/assets/Daikin/standard/daikin1.JPEG';
import samsungImage from '@/assets/Samsung/Windfree AR30 8.0-9.0/windfree 8.0_9.0.png';
import lgImage from '@/assets/LG/IMG_4683.JPEG';
import panasonicImage from '@/assets/Panasonic/cover/Panasonic-Aero-Series-CS-CU-Z25VKR.jpg';
import mideaImage from '@/assets/Midea/Aurora/midea1.JPG';
import haierImage from '@/assets/haire/Capture.JPG';

const brands = [
  {
    name: 'Mitsubishi',
    logo: mitsubishiImage,
    description: 'Mitsubishi Heavy Industries Air Conditioning'
  },
  {
    name: 'Daikin',
    logo: daikinImage,
    description: 'Daikin Air Conditioning'
  },
  {
    name: 'Samsung',
    logo: samsungImage,
    description: 'Samsung Heating & Cooling'
  },
  {
    name: 'LG',
    logo: lgImage,
    description: 'LG Air Conditioning'
  },
  {
    name: 'Panasonic',
    logo: panasonicImage,
    description: 'Panasonic Air Conditioning'
  },
  {
    name: 'Midea',
    logo: mideaImage,
    description: 'Midea Air Conditioners'
  },
  {
    name: 'Haier',
    logo: haierImage,
    description: 'Haier Air Conditioners'
  }
];

interface BrandLogosProps {
  variant?: 'compact' | 'detailed';
  showDescription?: boolean;
}

export function BrandLogos({ variant = 'compact', showDescription = false }: BrandLogosProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6">
        {brands.map((brand) => (
          <div key={brand.name} className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
            <div className="w-14 h-10 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`}
                className="h-7 w-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
              />
            </div>
            <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{brand.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 items-stretch">
      {brands.map((brand) => (
        <Card key={brand.name} className="group p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-gray-100">
          <div className="w-20 h-16 flex items-center justify-center mx-auto mb-4 bg-white rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <img 
              src={brand.logo} 
              alt={`${brand.name} logo`}
              className="h-10 w-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
            />
          </div>
          <p className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-1">{brand.name}</p>
          {showDescription && (
            <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors leading-tight">{brand.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
}