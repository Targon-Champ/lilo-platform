import Button from './Button';
import { SmartCabinetIcon } from '@/components/ui';

const HeroSection = () => {
  return (
    <div className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 w-full">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 tracking-tight">Beyond RFID. Beyond LIMS.</h2>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Meet <span className="text-blue-800">AVIMS™</span>—The First <span className="text-teal-700">Automated Visual</span><br />
              Inventory Management System for Labs.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              L.I.L.O uses computer vision and AI to track every chemical automatically. No RFID tags. No manual scanning. Just point cameras at your shelves and watch the magic.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button href="#" variant="primary" size="lg" className="shadow-md rounded-lg">
                See AVIMS in Action →
              </Button>
              <Button href="#" variant="outline" size="lg" className="rounded-lg">
                Compare to RFID
              </Button>
            </div>
            
            <div className="mt-8">
              <p className="text-base italic text-gray-700">
                "The computer vision revolution for laboratory management"
              </p>
              <p className="text-gray-600 mt-1 text-sm">— Chemistry Innovation Review, 2025</p>
            </div>
          </div>
          
          <div className="md:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="bg-gradient-to-br from-blue-100/50 to-teal-100/50 backdrop-blur-sm rounded-2xl w-full aspect-square max-w-[512px] max-h-[512px] flex items-center justify-center p-8">
                <SmartCabinetIcon size={512} className="mx-auto text-blue-600" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-red-400 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;