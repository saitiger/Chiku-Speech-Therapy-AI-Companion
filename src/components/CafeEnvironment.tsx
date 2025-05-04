
import React from 'react';
import { Coffee, CupSoda, UtensilsCrossed, Cake } from 'lucide-react';

interface CafeEnvironmentProps {
  type: 'order' | 'whippedCream' | 'wrongDrink' | 'general';
  description?: string;
}

const CafeEnvironment: React.FC<CafeEnvironmentProps> = ({ 
  type, 
  description 
}) => {
  // Different cafe visuals based on the current exchange
  const renderEnvironment = () => {
    switch (type) {
      case 'order':
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-speech-light p-3 rounded-lg flex flex-col items-center">
                <Coffee size={24} className="mb-1" />
                <p className="text-xs">Coffee</p>
                <p className="text-xs font-bold">$3.50</p>
              </div>
              <div className="bg-speech-light p-3 rounded-lg flex flex-col items-center">
                <CupSoda size={24} className="mb-1" />
                <p className="text-xs">Hot Chocolate</p>
                <p className="text-xs font-bold">$4.00</p>
              </div>
              <div className="bg-speech-light p-3 rounded-lg flex flex-col items-center">
                <UtensilsCrossed size={24} className="mb-1" />
                <p className="text-xs">Tea</p>
                <p className="text-xs font-bold">$2.75</p>
              </div>
            </div>
            <div className="w-full h-2 bg-speech-purple/20 mb-2"></div>
            <p className="text-xs text-center text-speech-dark/70">Café Menu</p>
          </div>
        );
      
      case 'whippedCream':
        return (
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-12 bg-amber-800/70 rounded-b-3xl rounded-t-lg flex items-start justify-center pt-1 relative">
                <div className="absolute -top-2 rounded-full bg-white h-4 w-8"></div>
              </div>
              <p className="text-xs mt-1">No Whipped Cream</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-12 bg-amber-800/70 rounded-b-3xl rounded-t-lg flex items-start justify-center pt-1 relative">
                <div className="absolute -top-4 rounded-full bg-white h-6 w-10 flex items-center justify-center">
                  <div className="bg-white h-3 w-6 rounded-full transform rotate-45"></div>
                </div>
              </div>
              <p className="text-xs mt-1">With Whipped Cream</p>
            </div>
          </div>
        );
      
      case 'wrongDrink':
        return (
          <div className="flex flex-col items-center">
            <div className="relative bg-amber-800/70 h-20 w-14 rounded-b-3xl rounded-t-lg flex items-center justify-center">
              <p className="text-white text-xs">Coffee</p>
              <div className="absolute -right-8 -top-2 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold border-2 border-white">✘</div>
            </div>
            <div className="mt-4 flex items-center">
              <p className="text-xs text-red-500 font-bold mr-2">Wrong Order!</p>
              <p className="text-xs">You ordered Hot Chocolate</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center bg-speech-light p-4 rounded-lg">
            <Coffee size={32} className="mr-3 text-speech-dark" />
            <p className="text-sm text-speech-dark">Café Counter</p>
            <Cake size={28} className="ml-3 text-speech-dark" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      {renderEnvironment()}
      {description && <p className="text-xs text-center mt-2 text-speech-dark/70">{description}</p>}
    </div>
  );
};

export default CafeEnvironment;
