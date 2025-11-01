import { Feature } from '@/lib/types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { icon, title, description } = feature;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;