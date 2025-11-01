import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="LILO Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">LILO</span>
            </div>
            <p className="mt-4 text-gray-400">
              Next-generation LIMS with cloud-native analytics & IoT automation
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Solutions</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Community</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">API Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 LILO Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;