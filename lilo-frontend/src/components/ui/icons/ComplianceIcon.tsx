import { IconProps } from './IconProps';

const ComplianceIcon = ({ className, size = 24, color = 'currentColor' }: IconProps) => {
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
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M2 14v-4a2 2 0 0 1 2-2h4" />
      <path d="M14 2l4 4-4 4" />
      <path d="M2 14l4 4 4-4" />
      <path d="M2 10h15" />
      <path d="M2 14h15" />
      <path d="M2 18h10" />
    </svg>
  );
};

export default ComplianceIcon;