import { IconProps } from './IconProps';

const SmartCabinetIcon = ({ className, size = 24 }: IconProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        {/* Gradient for cabinet */}
        <linearGradient id="cabinetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient for glass shelves */}
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#bae6fd', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#e0f2fe', stopOpacity: 0.6 }} />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes wave {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.5); opacity: 0; }
          }
          .pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          .rotate {
            animation: rotate 3s linear infinite;
            transform-origin: center;
          }
          .wave {
            animation: wave 2s ease-out infinite;
            transform-origin: center;
          }
        `}</style>
      </defs>
      
      {/* Cabinet main body */}
      <rect x="50" y="30" width="100" height="140" rx="8" 
            fill="url(#cabinetGrad)" stroke="#4c1d95" strokeWidth="2"/>
      
      {/* Cabinet door frame */}
      <rect x="55" y="35" width="90" height="130" rx="5" 
            fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4"/>
      
      {/* Glass shelves with items */}
      <g id="shelves">
        {/* Top shelf */}
        <rect x="60" y="55" width="80" height="2" fill="url(#glassGrad)"/>
        <circle cx="70" cy="50" r="3" fill="#ef4444"/>
        <circle cx="85" cy="50" r="3" fill="#3b82f6"/>
        <circle cx="100" cy="50" r="3" fill="#10b981"/>
        <circle cx="115" cy="50" r="3" fill="#f59e0b"/>
        <circle cx="130" cy="50" r="3" fill="#8b5cf6"/>
        
        {/* Middle shelf */}
        <rect x="60" y="90" width="80" height="2" fill="url(#glassGrad)"/>
        <circle cx="75" cy="85" r="3" fill="#06b6d4"/>
        <circle cx="95" cy="85" r="3" fill="#ec4899"/>
        <circle cx="115" cy="85" r="3" fill="#14b8a6"/>
        
        {/* Bottom shelf */}
        <rect x="60" y="125" width="80" height="2" fill="url(#glassGrad)"/>
        <circle cx="70" cy="120" r="3" fill="#f97316"/>
        <circle cx="90" cy="120" r="3" fill="#6366f1"/>
        <circle cx="110" cy="120" r="3" fill="#22c55e"/>
        <circle cx="130" cy="120" r="3" fill="#eab308"/>
      </g>
      
      {/* Door handle */}
      <rect x="145" y="95" width="3" height="15" rx="1.5" fill="#cbd5e1"/>
      
      {/* LED status indicator */}
      <circle cx="70" cy="160" r="4" fill="#10b981" filter="url(#glow)">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* QR Code symbol */}
      <rect x="120" y="150" width="20" height="20" rx="2" fill="white" stroke="#1e293b" strokeWidth="1"/>
      <rect x="122" y="152" width="6" height="6" fill="#1e293b"/>
      <rect x="130" y="152" width="6" height="6" fill="#1e293b"/>
      <rect x="122" y="160" width="6" height="6" fill="#1e293b"/>
      <rect x="130" y="164" width="3" height="2" fill="#1e293b"/>
      <rect x="134" y="160" width="2" height="6" fill="#1e293b"/>
      
      {/* Camera (top center) */}
      <g transform="translate(100, 25)">
        <circle cx="0" cy="0" r="8" fill="#1e293b"/>
        <circle cx="0" cy="0" r="5" fill="#3b82f6"/>
        <circle cx="0" cy="0" r="2" fill="#60a5fa"/>
        {/* Camera scan lines */}
        <line x1="-15" y1="0" x2="-10" y2="0" stroke="#3b82f6" strokeWidth="1" className="pulse"/>
        <line x1="10" y1="0" x2="15" y2="0" stroke="#3b82f6" strokeWidth="1" className="pulse"/>
      </g>
      
      {/* Temperature sensor (left side) */}
      <g transform="translate(45, 80)">
        <rect x="-6" y="-8" width="6" height="16" rx="3" fill="#ef4444"/>
        <rect x="-4" y="-6" width="2" height="8" fill="#fca5a5"/>
        <circle cx="-3" cy="6" r="3" fill="#dc2626"/>
      </g>
      
      {/* WiFi signal (top right) */}
      <g transform="translate(155, 50)">
        <path d="M 0,8 Q -8,0 -16,-4" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" className="wave"/>
        <path d="M 0,8 Q -5,3 -10,0" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" className="wave" style={{ animationDelay: '0.3s' }}/>
        <path d="M 0,8 Q -2,6 -4,5" fill="none" stroke="#10b981" strokeWidth="2" className="wave" style={{ animationDelay: '0.6s' }}/>
        <circle cx="0" cy="8" r="2" fill="#10b981"/>
      </g>
      
      {/* IoT hub/processor (bottom right) */}
      <g transform="translate(155, 120)">
        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5"/>
        <circle cx="0" cy="0" r="4" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="rotate"/>
        <circle cx="0" cy="0" r="1" fill="#60a5fa"/>
        {/* Connection ports */}
        <rect x="-9" y="-2" width="2" height="4" fill="#3b82f6"/>
        <rect x="7" y="-2" width="2" height="4" fill="#3b82f6"/>
      </g>
      
      {/* Wireless data transmission lines */}
      <g opacity="0.4">
        <line x1="100" y1="25" x2="100" y2="15" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2,2" className="pulse"/>
        <line x1="155" y1="120" x2="165" y2="120" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" className="pulse" style={{ animationDelay: '0.5s' }}/>
      </g>
      
      {/* Cloud connection icon (top) */}
      <g transform="translate(100, 10)">
        <path d="M -8,0 Q -10,-4 -6,-6 Q -4,-8 0,-6 Q 4,-8 6,-6 Q 10,-4 8,0 Z" 
              fill="#e0f2fe" stroke="#3b82f6" strokeWidth="1"/>
        <circle cx="-3" cy="-2" r="1" fill="#3b82f6"/>
        <circle cx="3" cy="-2" r="1" fill="#3b82f6"/>
      </g>
      
      {/* Lock indicator (secure) */}
      <g transform="translate(40, 60)">
        <rect x="-3" y="0" width="6" height="5" rx="1" fill="#fbbf24"/>
        <path d="M -2,-3 Q -2,-5 0,-5 Q 2,-5 2,-3 L 2,0 L -2,0 Z" 
              fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      </g>
      
      {/* Data flow particles */}
      <circle cx="100" cy="20" r="1.5" fill="#3b82f6" className="pulse">
        <animateMotion dur="2s" repeatCount="indefinite">
          <path d="M 0,0 L 0,10" />
        </animateMotion>
      </circle>
      <circle cx="160" cy="120" r="1.5" fill="#10b981" className="pulse" style={{ animationDelay: '0.7s' }}>
        <animateMotion dur="2s" repeatCount="indefinite">
          <path d="M 0,0 L 10,0" />
        </animateMotion>
      </circle>
    </svg>
  );
};

export default SmartCabinetIcon;