interface LogoVisualProps {
  className?: string;
  size?: number;
}

const LogoVisual = ({ className, size = 40 }: LogoVisualProps) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg bg-blue-600 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold text-xl">L</span>
    </div>
  );
};

export default LogoVisual;