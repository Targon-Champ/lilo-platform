import { IconProps } from './IconProps';

const TestTubeIcon = ({ className, size = 24, color = 'currentColor' }: IconProps) => {
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
      <path d="M14.5 2v17.5c0 1.1-.9 2-2 2s-2-.9-2-2V2" />
      <path d="M8.5 2h7" />
      <path d="M14.5 16h-5" />
    </svg>
  );
};

export default TestTubeIcon;