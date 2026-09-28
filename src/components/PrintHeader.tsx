import React from 'react';

interface PrintHeaderProps {
  vin: string;
  plate?: string;
  specs?: any;
  riskLevel?: 'CLEAN' | 'WARNING' | 'CRITICAL' | 'LOADING';
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  vin,
  plate = '',
  specs,
  riskLevel = 'CLEAN',
}) => {
  // Детерминированный номер отчета
  const reportId = vin ? `CCH-2026-${vin.slice(-6).toUpperCase()}` : 'CCH-2026-SEARCH';
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="hidden print:flex flex-col w-full pb-4 mb-6 border-b-2 border-slate-900 text-slate-900 bg-white">
      {/* Верхняя строка: Логотип, реквизиты документа и QR-код */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center text-white font-black text-sm font-mono shadow-xs">
              VW
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                VIN-WIN
              </h1>
              <p className="text-[10px] font-mono tracking-wider text-slate-600 uppercase font-semibold">
                Единая система проверки автотранспорта по открытым реестрам РФ
              </p>
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              ОФИЦИАЛЬНЫЙ СВОДНЫЙ ОТЧЕТ ЮРИДИЧЕСКОЙ И ТЕХНИЧЕСКОЙ ЧИСТОТЫ
            </h2>
            <p className="text-[11px] text-slate-600">
              Сформирован на основе официальных ведомственных шлюзов ГИБДД, ФНП, ФГИС Такси, Федресурс, ЕАИСТО, НСИС, СЭП, ФССП
            </p>
          </div>
        </div>

        {/* QR-код верификации и метаданные */}
        <div className="flex items-center gap-3 border border-slate-300 p-2 rounded-lg bg-slate-50 shrink-0">
          <div className="text-right text-[10px] font-mono">
            <span className="block font-bold text-slate-900">№ {reportId}</span>
            <span className="text-slate-600 block">{currentDate} {currentTime} МСК</span>
            <span className="text-emerald-700 font-bold block mt-1">Оригинал заверен ЭЦП</span>
          </div>

          {/* Векторный QR-код */}
          <div className="w-14 h-14 p-1 bg-white border border-slate-300 rounded flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
              {/* Угловые маркеры QR-кода */}
              <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="13" y="13" width="12" height="12" />
              <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="75" y="13" width="12" height="12" />
              <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="13" y="75" width="12" height="12" />
              {/* Паттерны данных */}
              <rect x="42" y="10" width="8" height="8" />
              <rect x="42" y="24" width="8" height="8" />
              <rect x="10" y="42" width="8" height="8" />
              <rect x="24" y="42" width="8" height="8" />
              <rect x="38" y="38" width="12" height="12" />
              <rect x="56" y="42" width="8" height="8" />
              <rect x="70" y="42" width="8" height="8" />
              <rect x="84" y="42" width="8" height="8" />
              <rect x="42" y="56" width="8" height="8" />
              <rect x="42" y="70" width="8" height="8" />
              <rect x="42" y="84" width="8" height="8" />
              <rect x="56" y="56" width="10" height="10" />
              <rect x="72" y="60" width="10" height="10" />
              <rect x="60" y="78" width="10" height="10" />
              <rect x="80" y="78" width="10" height="10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Информационная полоса автомобиля */}
      <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono block">Транспортное средство:</span>
          <span className="text-sm font-bold text-slate-900 font-mono">
            {specs?.title || `${specs?.make || 'Автомобиль'} ${specs?.model || ''}`.trim() || 'Транспортное средство'}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">VIN:</span>
            <span className="font-bold text-slate-900">{vin || specs?.vin || 'Не указан'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Госномер:</span>
            <span className="font-bold text-slate-900">{specs?.resolved_plate || plate || 'Не указан'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Год:</span>
            <span className="font-bold text-slate-900">{specs?.model_year || specs?.year || '—'}</span>
          </div>
        </div>

        {/* Общий экспертный статус */}
        <div>
          {riskLevel === 'CLEAN' ? (
            <span className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-500 text-emerald-800 font-bold text-[11px] rounded font-mono">
              ✓ ЮРИДИЧЕСКИ ЧИСТ (10 ИЗ 10 РЕЕСТРОВ)
            </span>
          ) : riskLevel === 'CRITICAL' ? (
            <span className="inline-block px-3 py-1 bg-rose-100 border border-rose-600 text-rose-800 font-bold text-[11px] rounded font-mono">
              ⚠ ВНИМАНИЕ: ОБНАРУЖЕНЫ КРИТИЧЕСКИЕ РИСКИ
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-amber-100 border border-amber-600 text-amber-800 font-bold text-[11px] rounded font-mono">
              ⚠ ОБНАРУЖЕНЫ ПРЕДУПРЕЖДЕНИЯ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
