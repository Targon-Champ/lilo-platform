import Button from './Button';

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-800 to-teal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Transform Your Lab Operations Today
        </h2>
        <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
          Join leading research institutions using LILO to achieve 300% ROI within the first year
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button href="#" variant="secondary" size="lg" className="shadow-lg">
            Start Free Trial
          </Button>
          <Button href="#" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;