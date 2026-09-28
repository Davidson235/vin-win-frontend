import React from 'react';

interface AiConclusionBoxProps {
  text: string;
  className?: string;
}

export const AiConclusionBox: React.FC<AiConclusionBoxProps> = ({ text, className = '' }) => {
  if (!text) return null;

  return (
    <div className={`ai-insight-box flex items-start gap-3.5 mt-5 ${className}`}>
      <svg
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiCarmineGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
        <path
          d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
          fill="url(#aiCarmineGradient)"
        />
        <path
          d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z"
          fill="url(#aiCarmineGradient)"
          opacity="0.8"
        />
      </svg>
      <div className="text-sm leading-relaxed text-slate-700">
        <span className="font-extrabold text-slate-900 mr-1.5 tracking-tight">Вывод:</span>
        {text}
      </div>
    </div>
  );
};
