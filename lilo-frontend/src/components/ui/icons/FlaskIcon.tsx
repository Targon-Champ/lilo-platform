import { IconProps } from './IconProps';

const FlaskIcon = ({ className, size = 24, color = 'currentColor' }: IconProps) => {
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
      <path d="M10 2v2.343M14 2v2.343" />
      <path d="M19.5 8.5v11a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-11L6 4h12l2.5 4.5Z" />
      <path d="M8 16h8" />
      <path d="M8 12h8" />
    </svg>
  );
};

export default FlaskIcon;