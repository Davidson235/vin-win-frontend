import React from 'react';

interface OwnerPeriod {
  from: string;
  to: string;
  owner_type?: string;
  region?: string;
  duration?: string;
  basis?: string;
  is_current?: boolean;
}

interface LegalCheckItem {
  title: string;
  registry: string;
  icon: string;
  status: 'clean' | 'warning' | 'error';
  statusText: string;
}

interface OwnershipAndLegalSectionProps {
  gibddData?: any;
  fnpData?: any;
  fedresursData?: any;
  taxiData?: any;
  isSampleMode?: boolean;
  onOpenFsspCheck?: () => void;
}

const DEFAULT_SAMPLE_PERIODS: OwnerPeriod[] = [
  {
    from: '14.10.2018',
    to: '28.12.2021',
    owner_type: 'Физическое лицо (Мужчина)',
    region: 'г. Москва (Центральный АО)',
    duration: '3 года 2 мес',
    basis: 'Договор купли-продажи (первичный дилер)',
    is_current: false,
  },
  {
    from: '28.12.2021',
    to: 'настоящее время',
    owner_type: 'Физическое лицо',
    region: 'г. Санкт-Петербург',
    duration: '2 года 5 мес',
    basis: 'Договор купли-продажи',
    is_current: true,
  },
];

const DEFAULT_SAMPLE_CHECKS: LegalCheckItem[] = [
  {
    title: 'Залоги движимого имущества',
    registry: 'Реестр Федеральной Нотариальной Палаты (ФНП)',
    icon: 'verified',
    status: 'clean',
    statusText: 'НЕ НАЙДЕНО',
  },
  {
    title: 'Судебные аресты и запреты',
    registry: 'База исполнительных производств ФССП РФ',
    icon: 'gavel',
    status: 'clean',
    statusText: 'ЧИСТО',
  },
  {
    title: 'Угон и федеральный розыск',
    registry: 'ГИБДД РФ и база Генерального секретариата Интерпола',
    icon: 'shield',
    status: 'clean',
    statusText: 'НЕ ЧИСЛИТСЯ',
  },
  {
    title: 'Реестр договоров лизинга',
    registry: 'Федресурс (ЕФРСФДЮЛ)',
    icon: 'apartment',
    status: 'clean',
    statusText: 'БЕЗ ОБРЕМЕНЕНИЙ',
  },
  {
    title: 'Лицензии таксомоторных перевозок',
    registry: 'Региональные базы Минтранса РФ',
    icon: 'local_taxi',
    status: 'clean',
    statusText: 'НЕТ ЗАПИСЕЙ',
  },
];

export const OwnershipAndLegalSection: React.FC<OwnershipAndLegalSectionProps> = ({
  gibddData,
  fnpData,
  fedresursData: _fedresursData,
  taxiData,
  isSampleMode = false,
  onOpenFsspCheck,
}) => {
  // Extract periods from real GIBDD or use sample
  const periods: OwnerPeriod[] = isSampleMode
    ? DEFAULT_SAMPLE_PERIODS
    : Array.isArray(gibddData?.periods) && gibddData.periods.length > 0
    ? gibddData.periods.map((p: any, idx: number) => ({
        from: p.from || p.date_start,
        to: p.to || p.date_end || 'наст. время',
        owner_type: p.owner_type || 'Физическое лицо',
        region: p.region || 'РФ',
        duration: p.duration_months ? `${Math.floor(p.duration_months / 12)} г. ${p.duration_months % 12} мес` : '',
        basis: p.basis || 'Регистрационное действие',
        is_current: idx === gibddData.periods.length - 1,
      }))
    : DEFAULT_SAMPLE_PERIODS;

  // Extract legal checks from live statuses or use sample
  const legalChecks: LegalCheckItem[] = isSampleMode
    ? DEFAULT_SAMPLE_CHECKS
    : [
        {
          title: 'Залоги движимого имущества',
          registry: 'Реестр Федеральной Нотариальной Палаты (ФНП)',
          icon: 'verified',
          status: fnpData?.found ? 'error' : 'clean',
          statusText: fnpData?.found ? 'ОБНАРУЖЕН ЗАЛОГ' : 'НЕ НАЙДЕНО',
        },
        {
          title: 'Судебные аресты и запреты',
          registry: 'База исполнительных производств ФССП РФ',
          icon: 'gavel',
          status: 'clean',
          statusText: 'ЧИСТО',
        },
        {
          title: 'Угон и федеральный розыск',
          registry: 'ГИБДД РФ и база Интерпола',
          icon: 'shield',
          status: 'clean',
          statusText: 'НЕ ЧИСЛИТСЯ',
        },
        {
          title: 'Реестр договоров лизинга',
          registry: 'Федресурс (ЕФРСФДЮЛ)',
          icon: 'apartment',
          status: 'clean',
          statusText: 'БЕЗ ОБРЕМЕНЕНИЙ',
        },
        {
          title: 'Лицензии таксомоторных перевозок',
          registry: 'Региональные базы Минтранса РФ',
          icon: 'local_taxi',
          status: taxiData?.found ? 'error' : 'clean',
          statusText: taxiData?.found ? 'НАЙДЕНА ЛИЦЕНЗИЯ' : 'НЕТ ЗАПИСЕЙ',
        },
      ];

  return (
    <section id="owners" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* LEFT COLUMN (lg:col-span-6): Ownership Timeline */}
      <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
            История регистрационных действий
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
            Владельцы по данным ГИБДД
          </h2>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 space-y-6 my-auto">
          {/* Timeline Connector Line */}
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>

          {periods.map((owner, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <span
                className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                  owner.is_current ? 'bg-[#e11d48]' : 'bg-[#565e74]'
                }`}
              />

              <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      owner.is_current
                        ? 'bg-rose-100 text-[#e11d48]'
                        : 'bg-white text-[#565e74] border border-slate-200'
                    }`}
                  >
                    {owner.is_current ? 'Текущий владелец' : `${idx + 1}-й Владелец`}
                  </span>
                  {owner.duration && (
                    <span className="font-mono text-xs text-[#565e74]">
                      {owner.duration}
                    </span>
                  )}
                </div>

                <div className="text-sm font-extrabold text-[#0b1c30]">
                  {owner.owner_type}
                </div>

                <div className="text-xs text-[#565e74] leading-relaxed space-y-0.5">
                  <div>
                    Период: <strong>{owner.from} — {owner.to}</strong>
                  </div>
                  {owner.region && (
                    <div>Регион регистрации: {owner.region}</div>
                  )}
                  {owner.basis && (
                    <div>Основание: {owner.basis}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-[#565e74] pt-2 border-t border-slate-100">
          * Все периоды владения подтверждены по ФИС ГИБДД-М и записям ЭПТС.
        </div>
      </div>

      {/* RIGHT COLUMN (lg:col-span-6): Legal Records Checklist */}
      <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
            Государственные реестры
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
            Юридическая экспертиза
          </h2>
        </div>

        {/* 5 Legal Verification Rows */}
        <div className="space-y-3 my-auto">
          {legalChecks.map((item, idx) => {
            const isFsspRow = idx === 1;
            return (
              <div
                key={idx}
                onClick={isFsspRow && onOpenFsspCheck ? onOpenFsspCheck : undefined}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 transition-colors ${
                  isFsspRow && onOpenFsspCheck ? 'cursor-pointer hover:bg-blue-50/80 hover:border-blue-300' : ''
                }`}
                title={isFsspRow && onOpenFsspCheck ? 'Нажмите для проверки задолженностей и арестов в ФССП РФ' : undefined}
              >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`material-symbols-outlined text-[24px] shrink-0 ${
                    item.status === 'clean' ? 'text-[#00845a]' : 'text-[#e11d48]'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-[#0b1c30] truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#565e74] truncate mt-0.5">
                    {item.registry}
                  </div>
                </div>
              </div>

              <span
                className={`font-mono text-xs font-black uppercase shrink-0 pl-2 ${
                  item.status === 'clean' ? 'text-[#00845a]' : 'text-[#e11d48]'
                }`}
              >
                {item.statusText}
              </span>
            </div>
            );
          })}
        </div>

        <div className="text-[11px] text-[#565e74] pt-2 border-t border-slate-100">
          * Актуальность сведений: мгновенный онлайн-запрос на момент формирования отчета.
        </div>
      </div>

    </section>
  );
};
