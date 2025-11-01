import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
          <p className="mt-4 text-lg text-gray-600">Contact content will be added here</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}