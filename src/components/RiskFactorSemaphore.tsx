import React from 'react';

interface RiskFactorSemaphoreProps {
  isPledged?: boolean;
  hasRestrictions?: boolean;
  accidentsCount?: number;
  calculationsCount?: number;
  isRollback?: boolean;
  rollbackDiffKm?: number;
  isTaxi?: boolean;
  isCarsharing?: boolean;
  ownersCount?: number;
  averageOwnershipYears?: number;
  // Fallback demo mode flag
  isSampleMode?: boolean;
}

export const RiskFactorSemaphore: React.FC<RiskFactorSemaphoreProps> = ({
  isPledged = false,
  hasRestrictions = false,
  accidentsCount = 0,
  calculationsCount = 0,
  isRollback = false,
  rollbackDiffKm = 45000,
  isTaxi = false,
  isCarsharing = false,
  ownersCount = 2,
  averageOwnershipYears = 2.8,
  isSampleMode = false,
}) => {
  // Determine card 1: FNP / Legal
  const legalClean = isSampleMode ? true : (!isPledged && !hasRestrictions);
  // Determine card 2: Accidents
  const hasAccidentRisk = isSampleMode ? true : (accidentsCount > 0 || calculationsCount > 0);
  // Determine card 3: Odometer
  const hasOdometerFraud = isSampleMode ? true : isRollback;
  // Determine card 4: Commercial
  const commercialUsed = isSampleMode ? false : (isTaxi || isCarsharing);
  // Determine card 5: Ownership
  const normalOwnership = isSampleMode ? true : (ownersCount > 0 && ownersCount <= 3);

  // Critical flags count
  const criticalFlagsCount = (legalClean ? 0 : 1) + (hasAccidentRisk ? 1 : 0) + (hasOdometerFraud ? 1 : 0) + (commercialUsed ? 1 : 0);
  const overallRisk = criticalFlagsCount >= 2 ? 'high' : criticalFlagsCount === 1 ? 'medium' : 'clean';

  return (
    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
      
      {/* Header with Risk Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
            Форензик-сводка платформы
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
            Светофор критических факторов риска
          </h2>
        </div>

        {overallRisk === 'high' ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-[#ba1a1a] text-xs sm:text-sm font-bold border border-rose-200">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>Высокий риск сделки ({criticalFlagsCount} критических флага)</span>
          </div>
        ) : overallRisk === 'medium' ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold border border-amber-200">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>Требует внимания (1 фактор риска)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-[#006847] text-xs sm:text-sm font-bold border border-emerald-200">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Безопасная сделка (0 критических флагов)</span>
          </div>
        )}
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: FNP / GIBDD Legal */}
        <div className={`p-4 rounded-xl flex flex-col justify-between border ${
          legalClean ? 'bg-emerald-50/70 border-emerald-200/80' : 'bg-rose-50/70 border-rose-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                Реестры ФНП / ГИБДД
              </span>
              <span className={`material-symbols-outlined text-[20px] ${legalClean ? 'text-[#00845a]' : 'text-[#e11d48]'}`}>
                {legalClean ? 'check_circle' : 'report'}
              </span>
            </div>
            <h3 className={`text-sm font-extrabold ${legalClean ? 'text-[#006847]' : 'text-[#ba1a1a]'}`}>
              {legalClean ? 'Юридически чист' : 'Залог или ограничения'}
            </h3>
            <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
              {legalClean
                ? 'Ограничений на регдействия, розыска и залогов не зафиксировано.'
                : 'Выявлены записи в реестре уведомлений о залогах или аресты приставов.'}
            </p>
          </div>
          <span className={`mt-4 inline-block font-mono text-[11px] font-bold uppercase ${
            legalClean ? 'text-[#00845a]' : 'text-[#ba1a1a]'
          }`}>
            {legalClean ? 'Статус: Зеленый' : 'Статус: Обременение'}
          </span>
        </div>

        {/* Card 2: Accidents / Damages */}
        <div className={`p-4 rounded-xl flex flex-col justify-between border ${
          hasAccidentRisk ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200/80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                База ДТП и убытков
              </span>
              <span className={`material-symbols-outlined text-[20px] ${hasAccidentRisk ? 'text-[#e11d48]' : 'text-[#00845a]'}`}>
                {hasAccidentRisk ? 'report' : 'check_circle'}
              </span>
            </div>
            <h3 className={`text-sm font-extrabold ${hasAccidentRisk ? 'text-[#ba1a1a]' : 'text-[#006847]'}`}>
              {hasAccidentRisk
                ? `${accidentsCount || 2} ДТП / ${calculationsCount || 3} расчета`
                : 'Без зафиксированных ДТП'}
            </h3>
            <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
              {hasAccidentRisk
                ? 'Передняя правая часть, замена Matrix LED фары, капот, бампер.'
                : 'В официальной базе Госавтоинспекции РФ с 2015 года происшествий нет.'}
            </p>
          </div>
          <span className={`mt-4 inline-block font-mono text-[11px] font-bold uppercase ${
            hasAccidentRisk ? 'text-[#e11d48]' : 'text-[#00845a]'
          }`}>
            {hasAccidentRisk ? 'Статус: Алерт #E11D48' : 'Статус: Зеленый'}
          </span>
        </div>

        {/* Card 3: Odometer Fraud */}
        <div className={`p-4 rounded-xl flex flex-col justify-between border ${
          hasOdometerFraud ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200/80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                Телеметрия одометра
              </span>
              <span className={`material-symbols-outlined text-[20px] ${hasOdometerFraud ? 'text-[#e11d48]' : 'text-[#00845a]'}`}>
                {hasOdometerFraud ? 'history_toggle_off' : 'check_circle'}
              </span>
            </div>
            <h3 className={`text-sm font-extrabold ${hasOdometerFraud ? 'text-[#ba1a1a]' : 'text-[#006847]'}`}>
              {hasOdometerFraud
                ? `Скрутка -${(rollbackDiffKm || 45000).toLocaleString('ru-RU')} км`
                : 'Пробег подтвержден'}
            </h3>
            <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
              {hasOdometerFraud
                ? 'Резкое падение пробега в ЕАИСТО между 2022 и 2023 гг.'
                : 'Показания одометра возрастают равномерно по всем диагностическим картам.'}
            </p>
          </div>
          <span className={`mt-4 inline-block font-mono text-[11px] font-bold uppercase ${
            hasOdometerFraud ? 'text-[#ba1a1a]' : 'text-[#00845a]'
          }`}>
            {hasOdometerFraud ? 'Статус: Фальсификация' : 'Статус: Чистая динамика'}
          </span>
        </div>

        {/* Card 4: Commercial Usage */}
        <div className={`p-4 rounded-xl flex flex-col justify-between border ${
          commercialUsed ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200/80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                Коммерческое исп.
              </span>
              <span className={`material-symbols-outlined text-[20px] ${commercialUsed ? 'text-[#e11d48]' : 'text-[#00845a]'}`}>
                {commercialUsed ? 'local_taxi' : 'verified'}
              </span>
            </div>
            <h3 className={`text-sm font-extrabold ${commercialUsed ? 'text-[#ba1a1a]' : 'text-[#006847]'}`}>
              {commercialUsed ? 'Работа в такси / каршеринге' : 'Частное владение'}
            </h3>
            <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
              {commercialUsed
                ? 'Найдено действующее или архивное разрешение на перевозку пассажиров.'
                : 'Нет лицензий такси (Минтранс), реестров каршеринга и карлизинга.'}
            </p>
          </div>
          <span className={`mt-4 inline-block font-mono text-[11px] font-bold uppercase ${
            commercialUsed ? 'text-[#ba1a1a]' : 'text-[#00845a]'
          }`}>
            {commercialUsed ? 'Статус: Коммерческий износ' : 'Статус: Эксплуатация Ок'}
          </span>
        </div>

        {/* Card 5: Rights History */}
        <div className={`p-4 rounded-xl flex flex-col justify-between border ${
          normalOwnership ? 'bg-[#eff4ff] border-slate-200/80' : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                История прав
              </span>
              <span className={`material-symbols-outlined text-[20px] ${normalOwnership ? 'text-slate-600' : 'text-amber-700'}`}>
                person_check
              </span>
            </div>
            <h3 className={`text-sm font-extrabold ${normalOwnership ? 'text-[#0b1c30]' : 'text-amber-900'}`}>
              {ownersCount || 2} владельца
            </h3>
            <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
              Средний срок владения {averageOwnershipYears || 2.8} года. Регистрация: Москва, СПб.
            </p>
          </div>
          <span className={`mt-4 inline-block font-mono text-[11px] font-bold uppercase ${
            normalOwnership ? 'text-slate-600' : 'text-amber-800'
          }`}>
            {normalOwnership ? 'Статус: Норма' : 'Статус: Частая смена'}
          </span>
        </div>

      </div>

    </section>
  );
};
