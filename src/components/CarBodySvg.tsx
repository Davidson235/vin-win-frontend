import React, { useState } from 'react';

export type DamageSeverity = 'undamaged' | 'minor' | 'severe';

export interface ZoneDamageInfo {
  zoneId: string;
  name: string;
  severity: DamageSeverity;
  accidentDates?: string[];
  defectDescriptions?: string[];
  repairOperations?: string[];
  estimateAmount?: number;
}

interface CarBodySvgProps {
  damageMap: Record<string, ZoneDamageInfo>;
  selectedZoneId?: string | null;
  onSelectZone?: (zone: ZoneDamageInfo) => void;
  className?: string;
}

export const ZONE_NAMES: Record<string, string> = {
  front_bumper: 'Передний бампер',
  headlight_l: 'Передняя левая фара',
  headlight_r: 'Передняя правая фара',
  hood: 'Капот',
  fender_fl: 'Переднее левое крыло',
  fender_fr: 'Переднее правое крыло',
  windshield: 'Лобовое стекло',
  pillar_a_l: 'Передняя левая стойка (A)',
  pillar_a_r: 'Передняя правая стойка (A)',
  roof: 'Крыша',
  door_fl: 'Передняя левая дверь',
  door_fr: 'Передняя правая дверь',
  sill_l: 'Левый порог',
  sill_r: 'Правый порог',
  pillar_b_l: 'Средняя левая стойка (B)',
  pillar_b_r: 'Средняя правая стойка (B)',
  door_rl: 'Задняя левая дверь',
  door_rr: 'Задняя правая дверь',
  pillar_c_l: 'Задняя левая стойка (C)',
  pillar_c_r: 'Задняя правая стойка (C)',
  rear_window: 'Заднее стекло',
  trunk: 'Крышка багажника',
  fender_rl: 'Заднее левое крыло',
  fender_rr: 'Заднее правое крыло',
  taillight_l: 'Задний левый фонарь',
  taillight_r: 'Задний правый фонарь',
  rear_bumper: 'Задний бампер',
  floor: 'Лонжероны и силовая структура пола',
};

export const CarBodySvg: React.FC<CarBodySvgProps> = ({
  damageMap,
  selectedZoneId,
  onSelectZone,
  className = '',
}) => {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const getZoneStyle = (zoneId: string) => {
    const damage = damageMap[zoneId];
    const severity = damage?.severity || 'undamaged';
    const isSelected = selectedZoneId === zoneId;
    const isHovered = hoveredZoneId === zoneId;

    let fill = '#F8FAFC'; // neutral undamaged (titanium white)
    let stroke = '#CBD5E1';
    let strokeWidth = 1.5;

    if (severity === 'severe') {
      fill = '#FFE4E6'; // carmine/rose subtle
      stroke = '#E11D48'; // carmine accent
      strokeWidth = 2;
    } else if (severity === 'minor') {
      fill = '#FEF3C7'; // warm amber light
      stroke = '#F59E0B'; // amber dark
      strokeWidth = 2;
    }

    if (isSelected) {
      stroke = '#E11D48';
      strokeWidth = 3;
    } else if (isHovered) {
      stroke = severity === 'undamaged' ? '#94A3B8' : stroke;
      strokeWidth = 2.5;
    }

    return {
      fill,
      stroke,
      strokeWidth,
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
    };
  };

  const handleMouseEnter = (_e: React.MouseEvent<SVGElement>, zoneId: string) => {
    setHoveredZoneId(zoneId);
  };

  const handleMouseLeave = () => {
    setHoveredZoneId(null);
  };

  const handleClick = (zoneId: string) => {
    const info: ZoneDamageInfo = damageMap[zoneId] || {
      zoneId,
      name: ZONE_NAMES[zoneId] || zoneId,
      severity: 'undamaged',
    };
    if (onSelectZone) {
      onSelectZone(info);
    }
  };

  const hoveredDamage = hoveredZoneId ? damageMap[hoveredZoneId] : null;
  const hoveredName = hoveredZoneId ? ZONE_NAMES[hoveredZoneId] || hoveredZoneId : '';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 360 660"
        className="w-full max-w-[340px] sm:max-w-[380px] h-auto drop-shadow-sm filter"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="Векторная схема повреждений автомобиля на 28 зон"
      >
        <defs>
          {/* Shadow filters for elevation */}
          <filter id="carShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
          </filter>
          {/* Wheel pattern */}
          <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* 1. КОЛЕСА (Подложка под кузовом) */}
        <g id="wheels">
          {/* Переднее левое колесо */}
          <rect x="36" y="105" width="22" height="60" rx="6" fill="url(#tireGrad)" />
          {/* Переднее правое колесо */}
          <rect x="302" y="105" width="22" height="60" rx="6" fill="url(#tireGrad)" />
          {/* Заднее левое колесо */}
          <rect x="36" y="475" width="22" height="64" rx="6" fill="url(#tireGrad)" />
          {/* Заднее правое колесо */}
          <rect x="302" y="475" width="22" height="64" rx="6" fill="url(#tireGrad)" />
        </g>

        {/* 2. БОКОВЫЕ ЗЕРКАЛА */}
        <g id="mirrors" fill="#94A3B8" stroke="#64748B" strokeWidth="1">
          {/* Левое зеркало */}
          <path d="M 54 220 C 38 215 36 230 52 235 Z" />
          {/* Правое зеркало */}
          <path d="M 306 220 C 322 215 324 230 308 235 Z" />
        </g>

        {/* 3. ОСНОВНЫЕ 28 КУЗОВНЫХ ЗОН */}
        <g id="body-zones" filter="url(#carShadow)">
          
          {/* 1. ПЕРЕДНИЙ БАМПЕР (front_bumper) */}
          <path
            id="zone-front_bumper"
            d="M 80 62 C 110 40 250 40 280 62 C 298 75 304 88 288 88 C 240 76 120 76 72 88 C 56 88 62 75 80 62 Z"
            style={getZoneStyle('front_bumper')}
            onMouseEnter={(e) => handleMouseEnter(e, 'front_bumper')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('front_bumper')}
          />

          {/* 2. ПЕРЕДНЯЯ ЛЕВАЯ ФАРА (headlight_l) */}
          <path
            id="zone-headlight_l"
            d="M 80 84 C 95 78 122 82 126 94 C 118 104 86 102 78 94 C 76 89 77 86 80 84 Z"
            style={getZoneStyle('headlight_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'headlight_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('headlight_l')}
          />

          {/* 3. ПЕРЕДНЯЯ ПРАВАЯ ФАРА (headlight_r) */}
          <path
            id="zone-headlight_r"
            d="M 280 84 C 265 78 238 82 234 94 C 242 104 274 102 282 94 C 284 89 283 86 280 84 Z"
            style={getZoneStyle('headlight_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'headlight_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('headlight_r')}
          />

          {/* 4. КАПОТ (hood) */}
          <path
            id="zone-hood"
            d="M 132 86 C 160 84 200 84 228 86 C 242 135 248 175 252 212 C 200 216 160 216 108 212 C 112 175 118 135 132 86 Z"
            style={getZoneStyle('hood')}
            onMouseEnter={(e) => handleMouseEnter(e, 'hood')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('hood')}
          />

          {/* 5. ПЕРЕДНЕЕ ЛЕВОЕ КРЫЛО (fender_fl) */}
          <path
            id="zone-fender_fl"
            d="M 72 92 C 84 98 122 106 128 102 C 114 140 108 178 105 212 C 85 210 65 204 55 186 C 50 162 52 120 72 92 Z"
            style={getZoneStyle('fender_fl')}
            onMouseEnter={(e) => handleMouseEnter(e, 'fender_fl')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('fender_fl')}
          />

          {/* 6. ПЕРЕДНЕЕ ПРАВОЕ КРЫЛО (fender_fr) */}
          <path
            id="zone-fender_fr"
            d="M 288 92 C 276 98 238 106 232 102 C 246 140 252 178 255 212 C 275 210 295 204 305 186 C 310 162 308 120 288 92 Z"
            style={getZoneStyle('fender_fr')}
            onMouseEnter={(e) => handleMouseEnter(e, 'fender_fr')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('fender_fr')}
          />

          {/* 7. ЛОБОВОЕ СТЕКЛО (windshield) */}
          <path
            id="zone-windshield"
            d="M 112 216 C 160 220 200 220 248 216 L 240 274 C 195 277 165 277 120 274 Z"
            style={getZoneStyle('windshield')}
            onMouseEnter={(e) => handleMouseEnter(e, 'windshield')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('windshield')}
          />

          {/* 8. ПЕРЕДНЯЯ ЛЕВАЯ СТОЙКА (pillar_a_l) */}
          <path
            id="zone-pillar_a_l"
            d="M 104 216 L 110 216 L 118 274 L 102 274 C 98 250 100 230 104 216 Z"
            style={getZoneStyle('pillar_a_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_a_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_a_l')}
          />

          {/* 9. ПЕРЕДНЯЯ ПРАВАЯ СТОЙКА (pillar_a_r) */}
          <path
            id="zone-pillar_a_r"
            d="M 256 216 L 250 216 L 242 274 L 258 274 C 262 250 260 230 256 216 Z"
            style={getZoneStyle('pillar_a_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_a_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_a_r')}
          />

          {/* 10. КРЫША (roof) */}
          <path
            id="zone-roof"
            d="M 122 278 C 165 281 195 281 238 278 L 236 430 C 195 432 165 432 124 430 Z"
            style={getZoneStyle('roof')}
            onMouseEnter={(e) => handleMouseEnter(e, 'roof')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('roof')}
          />

          {/* 11. ПЕРЕДНЯЯ ЛЕВАЯ ДВЕРЬ (door_fl) */}
          <path
            id="zone-door_fl"
            d="M 100 220 L 100 274 L 102 352 C 84 352 68 350 62 344 C 60 300 60 250 62 220 C 74 220 88 220 100 220 Z"
            style={getZoneStyle('door_fl')}
            onMouseEnter={(e) => handleMouseEnter(e, 'door_fl')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('door_fl')}
          />

          {/* 12. ПЕРЕДНЯЯ ПРАВАЯ ДВЕРЬ (door_fr) */}
          <path
            id="zone-door_fr"
            d="M 260 220 L 260 274 L 258 352 C 276 352 292 350 298 344 C 300 300 300 250 298 220 C 286 220 272 220 260 220 Z"
            style={getZoneStyle('door_fr')}
            onMouseEnter={(e) => handleMouseEnter(e, 'door_fr')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('door_fr')}
          />

          {/* 13. ЛЕВЫЙ ПОРОГ (sill_l) */}
          <path
            id="zone-sill_l"
            d="M 60 224 L 52 224 C 48 260 48 390 52 444 L 60 444 C 56 390 56 260 60 224 Z"
            style={getZoneStyle('sill_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'sill_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('sill_l')}
          />

          {/* 14. ПРАВЫЙ ПОРОГ (sill_r) */}
          <path
            id="zone-sill_r"
            d="M 300 224 L 308 224 C 312 260 312 390 308 444 L 300 444 C 304 390 304 260 300 224 Z"
            style={getZoneStyle('sill_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'sill_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('sill_r')}
          />

          {/* 15. СРЕДНЯЯ ЛЕВАЯ СТОЙКА (pillar_b_l) */}
          <path
            id="zone-pillar_b_l"
            d="M 104 350 L 122 350 L 122 366 L 104 366 Z"
            style={getZoneStyle('pillar_b_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_b_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_b_l')}
          />

          {/* 16. СРЕДНЯЯ ПРАВАЯ СТОЙКА (pillar_b_r) */}
          <path
            id="zone-pillar_b_r"
            d="M 238 350 L 256 350 L 256 366 L 238 366 Z"
            style={getZoneStyle('pillar_b_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_b_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_b_r')}
          />

          {/* 17. ЗАДНЯЯ ЛЕВАЯ ДВЕРЬ (door_rl) */}
          <path
            id="zone-door_rl"
            d="M 102 368 L 102 444 C 84 444 68 440 62 434 C 60 405 60 380 62 368 C 74 368 88 368 102 368 Z"
            style={getZoneStyle('door_rl')}
            onMouseEnter={(e) => handleMouseEnter(e, 'door_rl')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('door_rl')}
          />

          {/* 18. ЗАДНЯЯ ПРАВАЯ ДВЕРЬ (door_rr) */}
          <path
            id="zone-door_rr"
            d="M 258 368 L 258 444 C 276 444 292 440 298 434 C 300 405 300 380 298 368 C 286 368 272 368 258 368 Z"
            style={getZoneStyle('door_rr')}
            onMouseEnter={(e) => handleMouseEnter(e, 'door_rr')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('door_rr')}
          />

          {/* 19. ЗАДНЯЯ ЛЕВАЯ СТОЙКА (pillar_c_l) */}
          <path
            id="zone-pillar_c_l"
            d="M 102 446 L 122 434 L 118 494 L 98 488 C 98 470 100 456 102 446 Z"
            style={getZoneStyle('pillar_c_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_c_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_c_l')}
          />

          {/* 20. ЗАДНЯЯ ПРАВАЯ СТОЙКА (pillar_c_r) */}
          <path
            id="zone-pillar_c_r"
            d="M 258 446 L 238 434 L 242 494 L 262 488 C 262 470 260 456 258 446 Z"
            style={getZoneStyle('pillar_c_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'pillar_c_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('pillar_c_r')}
          />

          {/* 21. ЗАДНЕЕ СТЕКЛО (rear_window) */}
          <path
            id="zone-rear_window"
            d="M 124 434 C 165 436 195 436 236 434 L 240 494 C 195 497 165 497 120 494 Z"
            style={getZoneStyle('rear_window')}
            onMouseEnter={(e) => handleMouseEnter(e, 'rear_window')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('rear_window')}
          />

          {/* 22. КРЫШКА БАГАЖНИКА (trunk) */}
          <path
            id="zone-trunk"
            d="M 120 498 C 165 500 195 500 240 498 L 248 578 C 200 582 160 582 112 578 Z"
            style={getZoneStyle('trunk')}
            onMouseEnter={(e) => handleMouseEnter(e, 'trunk')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('trunk')}
          />

          {/* 23. ЗАДНЕЕ ЛЕВОЕ КРЫЛО (fender_rl) */}
          <path
            id="zone-fender_rl"
            d="M 100 450 C 114 465 118 520 110 578 C 92 576 74 570 60 554 C 52 530 52 480 60 450 C 75 450 88 450 100 450 Z"
            style={getZoneStyle('fender_rl')}
            onMouseEnter={(e) => handleMouseEnter(e, 'fender_rl')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('fender_rl')}
          />

          {/* 24. ЗАДНЕЕ ПРАВОЕ КРЫЛО (fender_rr) */}
          <path
            id="zone-fender_rr"
            d="M 260 450 C 246 465 242 520 250 578 C 268 576 286 570 300 554 C 308 530 308 480 300 450 C 285 450 272 450 260 450 Z"
            style={getZoneStyle('fender_rr')}
            onMouseEnter={(e) => handleMouseEnter(e, 'fender_rr')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('fender_rr')}
          />

          {/* 25. ЗАДНИЙ ЛЕВЫЙ ФОНАРЬ (taillight_l) */}
          <path
            id="zone-taillight_l"
            d="M 76 576 C 90 574 116 578 122 584 C 118 594 88 594 76 588 Z"
            style={getZoneStyle('taillight_l')}
            onMouseEnter={(e) => handleMouseEnter(e, 'taillight_l')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('taillight_l')}
          />

          {/* 26. ЗАДНИЙ ПРАВЫЙ ФОНАРЬ (taillight_r) */}
          <path
            id="zone-taillight_r"
            d="M 284 576 C 270 574 244 578 238 584 C 242 594 272 594 284 588 Z"
            style={getZoneStyle('taillight_r')}
            onMouseEnter={(e) => handleMouseEnter(e, 'taillight_r')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('taillight_r')}
          />

          {/* 27. ЗАДНИЙ БАМПЕР (rear_bumper) */}
          <path
            id="zone-rear_bumper"
            d="M 68 590 C 110 600 250 600 292 590 C 304 602 296 620 278 626 C 240 634 120 634 82 626 C 64 620 56 602 68 590 Z"
            style={getZoneStyle('rear_bumper')}
            onMouseEnter={(e) => handleMouseEnter(e, 'rear_bumper')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('rear_bumper')}
          />

          {/* 28. ЛОНЖЕРОНЫ И СИЛОВАЯ СТРУКТУРА (floor) */}
          {/* Индикатор в центре крыши / шасси, активен только при повреждениях геометрии кузова */}
          <g
            id="zone-floor"
            style={getZoneStyle('floor')}
            onMouseEnter={(e) => handleMouseEnter(e, 'floor')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('floor')}
          >
            <rect
              x="155"
              y="335"
              width="50"
              height="38"
              rx="4"
              strokeDasharray="3 3"
              style={{
                fill: damageMap['floor']?.severity === 'severe' ? '#EF4444' : '#E2E8F0',
                stroke: damageMap['floor']?.severity === 'severe' ? '#B91C1C' : '#94A3B8',
                strokeWidth: 1.5,
              }}
            />
            <text
              x="180"
              y="358"
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill={damageMap['floor']?.severity === 'severe' ? '#FFFFFF' : '#64748B'}
            >
              СИЛА
            </text>
          </g>

        </g>
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredZoneId && (
        <div className="mt-3.5 px-3.5 py-2 bg-slate-950/90 backdrop-blur-md text-white text-xs rounded-xl shadow-xl border border-slate-700/60 pointer-events-none flex items-center gap-2.5 animate-fade-in">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              hoveredDamage?.severity === 'severe'
                ? 'bg-rose-500 ring-4 ring-rose-500/20'
                : hoveredDamage?.severity === 'minor'
                ? 'bg-amber-400 ring-4 ring-amber-400/20'
                : 'bg-emerald-400 ring-4 ring-emerald-400/20'
            }`}
          />
          <span className="font-bold tracking-tight">{hoveredName}</span>
          <span className="text-slate-300">
            {hoveredDamage?.severity === 'severe'
              ? '• Критическое повреждение / Замена'
              : hoveredDamage?.severity === 'minor'
              ? '• Легкое повреждение / Окрас'
              : '• Без повреждений (Завод)'}
          </span>
        </div>
      )}
    </div>
  );
};
