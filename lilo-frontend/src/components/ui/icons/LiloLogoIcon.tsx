import { IconProps } from './IconProps';

const LiloLogoIcon = ({ className, size = 24, color = 'currentColor' }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v18M8 7h8v10H8z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

export default LiloLogoIcon;