const WhyAVIMS = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why AVIMS™ Changes Everything:</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-green-500 text-2xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">95% automation</h3>
            <p className="text-gray-600">vs 60% with RFID systems</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-green-500 text-2xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">$0 per container</h3>
            <p className="text-gray-600">vs $0.50 RFID tags</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-green-500 text-2xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI safety monitoring</h3>
            <p className="text-gray-600">spills, leaks, hazards</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-green-500 text-2xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual verification</h3>
            <p className="text-gray-600">real-time, not just beeps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyAVIMS;