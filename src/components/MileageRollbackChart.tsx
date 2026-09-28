import React from 'react';

interface MileageRollbackChartProps {
  eaistoData?: any;
  odometerData?: any;
  isLoading?: boolean;
  isSampleMode?: boolean;
}

export const MileageRollbackChart: React.FC<MileageRollbackChartProps> = ({
  eaistoData,
  odometerData,
  isLoading = false,
  isSampleMode = false,
}) => {
  const isRollback = isSampleMode
    ? true
    : Boolean(odometerData?.has_rollback || eaistoData?.is_rollback_detected);

  const officialMileage = isSampleMode
    ? '62 150 км'
    : odometerData?.current_odometer
    ? `${Number(odometerData.current_odometer).toLocaleString('ru-RU')} км`
    : eaistoData?.records?.[0]?.odometer
    ? `${Number(eaistoData.records[0].odometer).toLocaleString('ru-RU')} км`
    : '62 150 км';

  const estimatedRealMileage = isSampleMode
    ? '~107 000 км'
    : odometerData?.estimated_real_mileage
    ? `~${Number(odometerData.estimated_real_mileage).toLocaleString('ru-RU')} км`
    : '~107 000 км';

  return (
    <section id="probeg" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
      
      {/* Header with Markers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
            Критический аналитический маркер
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
            График честного пробега и фиксация скрутки
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] text-[#565e74] font-mono text-xs border border-slate-200/60">
            Официальный одометр: <strong className="text-[#0b1c30]">{officialMileage}</strong>
          </div>
          {isRollback && (
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-[#ba1a1a] font-mono text-xs font-bold border border-rose-200">
              Расчетный реальный: {estimatedRealMileage}
            </div>
          )}
        </div>
      </div>

      {isLoading && !isSampleMode ? (
        <div className="p-12 text-center text-[#565e74] flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[#e11d48] text-[36px] animate-spin">
            progress_activity
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Синхронизация дельт одометра по реестрам...
          </span>
        </div>
      ) : (
        <>
          {/* SVG Curve Graph with Fraud Area Highlighting (viewBox="0 0 900 240") */}
          <div className="relative w-full overflow-x-auto bg-[#f8f9ff] p-4 rounded-xl border border-slate-200/70">
            <div className="min-w-[700px] py-2">
              <svg className="w-full h-60 select-none" fill="none" viewBox="0 0 900 240" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal Grid Lines */}
                <line stroke="#E5EEFF" strokeWidth="1" x1="80" x2="880" y1="20" y2="20" />
                <line stroke="#E5EEFF" strokeWidth="1" x1="80" x2="880" y1="70" y2="70" />
                <line stroke="#E5EEFF" strokeWidth="1" x1="80" x2="880" y1="120" y2="120" />
                <line stroke="#E5EEFF" strokeWidth="1" x1="80" x2="880" y1="170" y2="170" />
                <line stroke="#0B1C30" strokeWidth="1.5" x1="80" x2="880" y1="210" y2="210" />

                {/* Y Axis Labels */}
                <text fill="#565E74" fontFamily="monospace" fontSize="11" x="30" y="24">120k км</text>
                <text fill="#565E74" fontFamily="monospace" fontSize="11" x="30" y="74">90k км</text>
                <text fill="#565E74" fontFamily="monospace" fontSize="11" x="30" y="124">60k км</text>
                <text fill="#565E74" fontFamily="monospace" fontSize="11" x="30" y="174">30k км</text>

                {isRollback ? (
                  <>
                    {/* Red Shaded Fraud Delta Zone */}
                    <polygon fill="#FFB3B6" opacity="0.35" points="560,78 720,152 720,210 560,210" />
                    
                    {/* Projected Real Mileage Curve (Dotted Red) */}
                    <path d="M560 78 Q720 50 850 40" fill="none" stroke="#E11D48" strokeDasharray="5 5" strokeWidth="2.5" />
                    <text fill="#E11D48" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" x="730" y="32">
                      Проекция без скрутки (~107 000 км)
                    </text>

                    {/* Actual Recorded Telemetry Curve */}
                    <path
                      d="M120 195 L260 165 L410 135 L560 78"
                      fill="none"
                      stroke="#00845A"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />

                    {/* Rollback Red Drop Line */}
                    <line stroke="#E11D48" strokeWidth="3.5" x1="560" x2="720" y1="78" y2="152" />

                    {/* Post-rollback Curve */}
                    <line stroke="#00845A" strokeWidth="3" x1="720" x2="850" y1="152" y2="118" />

                    {/* 2019 Node */}
                    <circle cx="120" cy="195" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <text fill="#0B1C30" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="120" y="185">15 200</text>
                    <text fill="#565E74" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" x="120" y="228">2019 (ТО-1)</text>

                    {/* 2020 Node */}
                    <circle cx="260" cy="165" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <text fill="#0B1C30" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="260" y="155">32 400</text>
                    <text fill="#565E74" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" x="260" y="228">2020 (ТО-2)</text>

                    {/* 2021 Node */}
                    <circle cx="410" cy="135" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <text fill="#0B1C30" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="410" y="125">51 000</text>
                    <text fill="#565E74" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" x="410" y="228">2021 (ЕАИСТО)</text>

                    {/* 2022 Peak Node */}
                    <circle cx="560" cy="78" fill="#00845A" r="6" stroke="#FFFFFF" strokeWidth="2" />
                    <text fill="#0B1C30" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="560" y="68">84 000</text>
                    <text fill="#565E74" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" x="560" y="228">2022 (Объявление)</text>

                    {/* 2023 Scammed Rollback Node (Pulsing) */}
                    <circle className="animate-pulse" cx="720" cy="152" fill="#E11D48" r="7" stroke="#FFFFFF" strokeWidth="3" />
                    <text fill="#E11D48" fontFamily="monospace" fontSize="12" fontWeight="800" textAnchor="middle" x="720" y="142">42 000 км</text>
                    <text fill="#E11D48" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="720" y="228">2023 (ЕАИСТО)</text>

                    {/* Callout Tag for rollback */}
                    <g transform="translate(600, 100)">
                      <rect fill="#E11D48" height="24" rx="4" width="130" />
                      <text fill="#FFFFFF" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="65" y="16">-42 000 км скрутка</text>
                    </g>

                    {/* 2024 Current Node */}
                    <circle cx="850" cy="118" fill="#E11D48" r="6" stroke="#FFFFFF" strokeWidth="2" />
                    <text fill="#0B1C30" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle" x="850" y="108">62 150</text>
                    <text fill="#565E74" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" x="850" y="228">2024 (Текущий)</text>
                  </>
                ) : (
                  <>
                    {/* Normal Steady Progression Curve */}
                    <path
                      d="M120 195 L300 160 L500 120 L700 80 L850 60"
                      fill="none"
                      stroke="#00845A"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />
                    <circle cx="120" cy="195" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="300" cy="160" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="500" cy="120" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="700" cy="80" fill="#00845A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="850" cy="60" fill="#00845A" r="6" stroke="#FFFFFF" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* 3 Telemetry Sources Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#00845a] text-[32px] shrink-0">
                verified
              </span>
              <div>
                <div className="text-xs font-bold text-[#0b1c30]">Дилерские сервисы</div>
                <div className="text-[11px] text-[#565e74] mt-0.5">Audi Центр Север — 2 верифицированных ТО</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#e11d48] text-[32px] shrink-0">
                manage_search
              </span>
              <div>
                <div className="text-xs font-bold text-[#0b1c30]">Диагностические карты</div>
                <div className="text-[11px] text-[#565e74] mt-0.5">3 записи ЕАИСТО МВД с фиксацией пробега</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex items-center gap-3.5">
              <span className="material-symbols-outlined text-slate-600 text-[32px] shrink-0">
                travel_explore
              </span>
              <div>
                <div className="text-xs font-bold text-[#0b1c30]">Классифайды и аукционы</div>
                <div className="text-[11px] text-[#565e74] mt-0.5">1 архивная публикация о продаже в 2022 г.</div>
              </div>
            </div>
          </div>
        </>
      )}

    </section>
  );
};
