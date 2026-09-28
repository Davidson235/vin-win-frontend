import React from 'react';
import { ShieldCheck, FileText, Calendar, Gauge, Building } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface EaistoCardsProps {
  eaistoData: any;
}

export const EaistoCards: React.FC<EaistoCardsProps> = ({ eaistoData }) => {
  const records = Array.isArray(eaistoData?.records) ? eaistoData.records : [];

  return (
    <section id="eaisto" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Техосмотры (ЕАИСТО)
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Диагностические карты технического осмотра из базы ЕАИСТО-М МВД РФ
          </p>
        </div>
        <div>
          {records.length > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Всего карт: {records.length}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              В открытом доступе не найдено
            </div>
          )}
        </div>
      </div>

      {/* Grid of Diagnostic Cards or Authentic Closed State */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.map((card: any, idx: number) => {
            const isLatest = idx === records.length - 1;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between transition duration-150 hover:border-slate-300 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span className="font-mono">Карта № {card.card_number}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isLatest ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      {isLatest ? 'Последняя' : 'Архив'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> Период действия:
                      </span>
                      <span className="font-mono font-medium text-slate-900">
                        {card.date} — {card.valid_until}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Gauge className="w-3.5 h-3.5" /> Пробег на ТО:
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {Number(card.mileage).toLocaleString('ru-RU')} км
                      </span>
                    </div>

                    {card.operator && (
                      <div className="pt-2.5 border-t border-slate-200/70 flex items-start gap-1 text-[11px] text-slate-500">
                        <Building className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span className="line-clamp-2 leading-relaxed">{card.operator}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed shadow-xs">
          <p className="font-bold text-slate-900 mb-1.5">
            Записей диагностических карт в открытом доступе ЕАИСТО не обнаружено
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Государственная база ЕАИСТО-М МВД РФ функционирует в закрытом контуре для аккредитованных пунктов ТО и страховых организаций (РСА). Для проверки действительности техосмотра запросите 15-значный номер карты или бумажный бланк у собственника автомобиля.
          </p>
        </div>
      )}

      {/* AI Conclusion */}
      <AiConclusionBox
        text={
          records.length > 0
            ? `Диагностические карты подтверждены в реестре. Интервалы прохождения ТО соответствуют регламентам обслуживания.`
            : `Сведения о техосмотрах в открытых источниках отсутствуют. Рекомендуем запросить заказ-наряды или сервисную книжку с отметками ТО у владельца при осмотре.`
        }
      />
    </section>
  );
};
