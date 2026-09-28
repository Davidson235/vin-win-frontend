import React from 'react';

interface TechnicalDamageBlueprintProps {
  hasDamage?: boolean;
  damageZoneLabel?: string;
  damageZoneAmount?: string;
  paintZoneLabel?: string;
  onSelectZone?: (zoneName: string) => void;
}

export const TechnicalDamageBlueprint: React.FC<TechnicalDamageBlueprintProps> = ({
  hasDamage = true,
  damageZoneLabel = 'Зона ДТП #1: 385 400 ₽',
  damageZoneAmount: _damageZoneAmount,
  paintZoneLabel = 'Окрас до 210 мкм',
  onSelectZone,
}) => {
  return (
    <div className="relative bg-[#eff4ff] rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center border border-slate-200/80">
      
      {/* Blueprint Header */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-slate-500 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-white font-bold text-slate-800 text-[11px] uppercase tracking-wider border border-slate-200">
            Вид сверху (Схема кузова 360°)
          </span>
          <span className="hidden sm:inline text-slate-500 text-xs">
            • Спецификация C7 Avant
          </span>
        </div>

        {hasDamage ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-[#e11d48] font-bold text-[11px] border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse"></span>
            <span>Зафиксировано 1 ДТП (4 элемента)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00845a] font-bold text-[11px] border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#00845a]"></span>
            <span>0 повреждений • Заводской окрас</span>
          </div>
        )}
      </div>

      {/* Detailed Top-Down Technical Blueprint SVG from Stitch Screen 3 */}
      <div className="relative w-full max-w-xl flex items-center justify-center py-2">
        <svg
          className="w-full h-auto drop-shadow-sm select-none"
          viewBox="0 0 720 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="redDamageGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#BE0037" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="hoodDamageFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFDADA" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFB3B6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D3E4FE" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#EFF4FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D3E4FE" stopOpacity="0.85" />
            </linearGradient>
            <pattern id="techGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#CBDDF5" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
            </pattern>
          </defs>

          {/* Background Precision Technical Measurement Grid */}
          <rect x="20" y="15" width="680" height="250" rx="10" fill="url(#techGrid)" stroke="#D3E4FE" strokeWidth="1" />
          
          {/* Vehicle Centerline & Dimension Axis Lines */}
          <line x1="45" y1="140" x2="675" y2="140" stroke="#906F70" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <line x1="195" y1="20" x2="195" y2="260" stroke="#906F70" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />
          <line x1="545" y1="20" x2="545" y2="260" stroke="#906F70" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />

          {/* Wheels & Tires with Disc Detail */}
          {/* Front Left Wheel (Upper) */}
          <g id="wheel_FL">
            <rect x="165" y="28" width="64" height="20" rx="5" fill="#0B1C30" stroke="#213145" strokeWidth="1.5" />
            <rect x="175" y="31" width="44" height="14" rx="2" fill="#565E74" />
            <line x1="185" y1="31" x2="185" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="197" y1="31" x2="197" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="209" y1="31" x2="209" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
          </g>
          {/* Front Right Wheel (Lower) */}
          <g id="wheel_FR">
            <rect x="165" y="232" width="64" height="20" rx="5" fill="#0B1C30" stroke="#213145" strokeWidth="1.5" />
            <rect x="175" y="235" width="44" height="14" rx="2" fill="#565E74" />
            <line x1="185" y1="235" x2="185" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="197" y1="235" x2="197" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="209" y1="235" x2="209" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
          </g>
          {/* Rear Left Wheel (Upper) */}
          <g id="wheel_RL">
            <rect x="515" y="28" width="64" height="20" rx="5" fill="#0B1C30" stroke="#213145" strokeWidth="1.5" />
            <rect x="525" y="31" width="44" height="14" rx="2" fill="#565E74" />
            <line x1="535" y1="31" x2="535" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="547" y1="31" x2="547" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="559" y1="31" x2="559" y2="45" stroke="#BEC6E0" strokeWidth="1.5" />
          </g>
          {/* Rear Right Wheel (Lower) */}
          <g id="wheel_RR">
            <rect x="515" y="232" width="64" height="20" rx="5" fill="#0B1C30" stroke="#213145" strokeWidth="1.5" />
            <rect x="525" y="235" width="44" height="14" rx="2" fill="#565E74" />
            <line x1="535" y1="235" x2="535" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="547" y1="235" x2="547" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
            <line x1="559" y1="235" x2="559" y2="249" stroke="#BEC6E0" strokeWidth="1.5" />
          </g>

          {/* Side Mirrors */}
          <path d="M 230 46 C 236 34 248 33 252 38 C 255 42 249 48 238 50 Z" fill="#FFFFFF" stroke="#565E74" strokeWidth="1.5" />
          <path d="M 230 234 C 236 246 248 247 252 242 C 255 238 249 232 238 230 Z" fill="#FFFFFF" stroke="#565E74" strokeWidth="1.5" />

          {/* Main Body Base Solid Shell (Audi A6 Avant Silhouette) */}
          <path
            d="M 85 140 
               C 85 110 95 72 135 60 
               C 152 55 178 52 240 50 
               L 490 50 
               C 555 52 585 58 610 74 
               C 638 92 645 115 645 140 
               C 645 165 638 188 610 206 
               C 585 222 555 228 490 230 
               L 240 230 
               C 178 228 152 225 135 220 
               C 95 208 85 170 85 140 Z"
            fill="#FFFFFF"
            stroke="#565E74"
            strokeWidth="2"
          />

          {/* PANEL SECTION 1: FRONT BUMPER */}
          <path d="M 85 140 C 85 110 95 72 135 60 L 138 78 C 112 88 106 112 106 140 Z" fill="#F8F9FF" stroke="#906F70" strokeWidth="1.5" />
          
          {/* DAMAGED Front Right Bumper Corner */}
          <path
            d="M 85 140 L 106 140 C 106 168 112 192 138 202 L 135 220 C 95 208 85 170 85 140 Z"
            fill={hasDamage ? "url(#redDamageGlow)" : "#F8F9FF"}
            stroke={hasDamage ? "#BE0037" : "#906F70"}
            strokeWidth={hasDamage ? 2 : 1.5}
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => onSelectZone?.('Передний бампер S line')}
          />
          
          {/* Radiator Grille (Singleframe) */}
          <path d="M 86 112 C 86 102 96 98 106 98 L 106 182 C 96 182 86 178 86 168 Z" fill="#131B2E" stroke="#565E74" strokeWidth="1.5" />
          {/* 4 Rings Emblem (Audi Motif) */}
          <circle cx="96" cy="130" r="3.5" stroke="#CBDDF5" strokeWidth="1" fill="none" />
          <circle cx="96" cy="136" r="3.5" stroke="#CBDDF5" strokeWidth="1" fill="none" />
          <circle cx="96" cy="142" r="3.5" stroke="#CBDDF5" strokeWidth="1" fill="none" />
          <circle cx="96" cy="148" r="3.5" stroke="#CBDDF5" strokeWidth="1" fill="none" />

          {/* Headlights */}
          {/* Left Headlight (Intact) */}
          <path d="M 106 82 L 134 76 L 126 94 L 106 94 Z" fill="#EFF4FF" stroke="#00845A" strokeWidth="1.5" />
          {/* Right Matrix LED Headlight (DAMAGED) */}
          <path
            d="M 106 198 L 134 204 L 126 186 L 106 186 Z"
            fill={hasDamage ? "#E11D48" : "#EFF4FF"}
            stroke={hasDamage ? "#FFFFFF" : "#00845A"}
            strokeWidth={1.5}
            className="cursor-pointer"
            onClick={() => onSelectZone?.('Правая LED Matrix фара')}
          />

          {/* PANEL SECTION 2: FRONT FENDERS */}
          {/* Front Left Fender (Intact) */}
          <path d="M 135 60 L 224 51 L 228 85 L 140 85 Z" fill="#F8F9FF" stroke="#906F70" strokeWidth="1.5" />
          {/* DAMAGED Front Right Fender */}
          <path
            d="M 135 220 L 224 229 L 228 195 L 140 195 Z"
            fill={hasDamage ? "url(#redDamageGlow)" : "#F8F9FF"}
            stroke={hasDamage ? "#BE0037" : "#906F70"}
            strokeWidth={hasDamage ? 2 : 1.5}
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => onSelectZone?.('Правое переднее крыло')}
          />

          {/* PANEL SECTION 3: HOOD (ALUMINUM - PAINT REPAIR) */}
          <path
            d="M 106 94 L 126 94 L 140 85 L 228 85 L 234 140 L 228 195 L 140 195 L 126 186 L 106 186 Z"
            fill={hasDamage ? "url(#hoodDamageFill)" : "#F8F9FF"}
            stroke={hasDamage ? "#E11D48" : "#906F70"}
            strokeWidth={1.5}
            strokeDasharray={hasDamage ? "4 3" : undefined}
            className="cursor-pointer"
            onClick={() => onSelectZone?.('Капот алюминиевый')}
          />
          {hasDamage && (
            <line x1="115" y1="140" x2="228" y2="140" stroke="#BE0037" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
          )}

          {/* PANEL SECTION 4: CABIN & GLASSHOUSE */}
          {/* Windshield */}
          <path d="M 235 84 L 285 92 L 285 188 L 235 196 Z" fill="url(#glassGradient)" stroke="#565E74" strokeWidth="1.5" />
          {/* Windshield Wipers */}
          <line x1="237" y1="108" x2="265" y2="130" stroke="#213145" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="237" y1="142" x2="268" y2="165" stroke="#213145" strokeWidth="1.5" strokeLinecap="round" />

          {/* Roof with Panoramic Glass Dual Sunroof */}
          <rect x="285" y="91" width="215" height="98" fill="#F8F9FF" stroke="#906F70" strokeWidth="1.5" />
          <rect x="295" y="101" width="95" height="78" rx="4" fill="#CBDDF5" stroke="#565E74" strokeWidth="1" opacity="0.85" />
          <rect x="398" y="101" width="75" height="78" rx="4" fill="#CBDDF5" stroke="#565E74" strokeWidth="1" opacity="0.85" />
          {/* Roof Rails */}
          <rect x="260" y="88" width="255" height="3" rx="1.5" fill="#565E74" />
          <rect x="260" y="189" width="255" height="3" rx="1.5" fill="#565E74" />

          {/* Rear Avant Screen & D-Pillar */}
          <path d="M 500 92 L 565 106 L 565 174 L 500 188 Z" fill="url(#glassGradient)" stroke="#565E74" strokeWidth="1.5" />
          <line x1="515" y1="115" x2="515" y2="165" stroke="#D3E4FE" strokeWidth="0.75" />
          <line x1="530" y1="120" x2="530" y2="160" stroke="#D3E4FE" strokeWidth="0.75" />
          <line x1="545" y1="125" x2="545" y2="155" stroke="#D3E4FE" strokeWidth="0.75" />

          {/* PANEL SECTION 5: DOORS & SILLS */}
          <path d="M 224 51 L 345 50 L 345 88 L 228 85 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <rect x="285" y="54" width="14" height="3.5" rx="1.5" fill="#565E74" />
          <path d="M 224 229 L 345 230 L 345 192 L 228 195 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <rect x="285" y="222.5" width="14" height="3.5" rx="1.5" fill="#565E74" />
          
          <path d="M 345 50 L 460 50 L 460 88 L 345 88 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <rect x="395" y="54" width="14" height="3.5" rx="1.5" fill="#565E74" />
          <path d="M 345 230 L 460 230 L 460 192 L 345 192 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <rect x="395" y="222.5" width="14" height="3.5" rx="1.5" fill="#565E74" />

          {/* PANEL SECTION 6: REAR QUARTER & TAILGATE */}
          <path d="M 460 50 L 595 56 C 606 63 615 72 622 84 L 565 106 L 500 92 L 460 88 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <path d="M 460 230 L 595 224 C 606 217 615 208 622 196 L 565 174 L 500 188 L 460 192 Z" fill="#FFFFFF" stroke="#906F70" strokeWidth="1.5" />
          <path d="M 565 106 L 622 84 C 635 100 640 120 640 140 C 640 160 635 180 622 196 L 565 174 Z" fill="#F8F9FF" stroke="#906F70" strokeWidth="1.5" />
          
          <path d="M 498 90 L 508 90 L 508 190 L 498 190 Z" fill="#213145" />
          <line x1="503" y1="128" x2="503" y2="152" stroke="#E11D48" strokeWidth="2.5" />
          
          <path d="M 622 84 C 636 96 645 118 645 140 C 645 162 636 184 622 196 L 626 204 C 643 186 648 163 648 140 C 648 117 643 94 626 76 Z" fill="#E5EEFF" stroke="#565E74" strokeWidth="1.5" />
          
          {/* Dual Exhaust Pipes */}
          <rect x="638" y="78" width="12" height="7" rx="3" fill="#565E74" stroke="#131B2E" strokeWidth="1" />
          <rect x="638" y="195" width="12" height="7" rx="3" fill="#565E74" stroke="#131B2E" strokeWidth="1" />

          {/* DYNAMIC HOTSPOTS & CALLOUT ANNOTATIONS */}
          {hasDamage && (
            <>
              {/* 1. Pulsing Hotspot on Headlight / Corner */}
              <circle cx="116" cy="198" r="14" fill="#E11D48" opacity="0.2" className="animate-pulse" />
              <circle cx="116" cy="198" r="6" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* 2. Pulsing Hotspot on Right Fender */}
              <circle cx="185" cy="214" r="12" fill="#E11D48" opacity="0.2" className="animate-pulse" />
              <circle cx="185" cy="214" r="5" fill="#BE0037" stroke="#FFFFFF" strokeWidth="2" />

              {/* 3. Hotspot on Hood */}
              <circle cx="165" cy="155" r="4" fill="#E5BDBE" stroke="#B80035" strokeWidth="2" />

              {/* Pointer Callout Line & Floating Badge */}
              <path d="M 185 214 L 140 248 L 70 248" stroke="#0B1C30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(25, 230)">
                <rect width="170" height="30" rx="6" fill="#0B1C30" />
                <circle cx="15" cy="15" r="4.5" fill="#E11D48" className="animate-pulse" />
                <text x="28" y="19" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700">
                  {damageZoneLabel}
                </text>
              </g>

              {/* Sub-Callout Marker on Hood */}
              <path d="M 165 155 L 145 110 L 95 110" stroke="#906F70" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(28, 96)">
                <rect width="100" height="22" rx="4" fill="#EFF4FF" stroke="#906F70" strokeWidth="1" />
                <text x="50" y="15" fill="#5C3F40" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" textAnchor="middle">
                  {paintZoneLabel}
                </text>
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Vector Legend Note */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
            <span>Силовые повреждения / Замена</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-200 border border-[#e11d48]"></span>
            <span>Косметический перекрас</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400"></span>
            <span>Заводской слой</span>
          </span>
        </div>
        <span className="font-mono text-slate-700 text-xs font-bold">Масштаб: 1:45</span>
      </div>

    </div>
  );
};
