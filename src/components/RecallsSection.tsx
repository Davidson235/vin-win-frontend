import React from 'react';
import { ShieldCheck, AlertTriangle, Wrench, Calendar, CheckCircle2 } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface RecallsSectionProps {
  recallsData?: any;
}

export const RecallsSection: React.FC<RecallsSectionProps> = ({ recallsData }) => {
  const campaigns = Array.isArray(recallsData?.campaigns) ? recallsData.campaigns : [];
  const hasRecalls = Boolean(recallsData?.has_recalls && campaigns.length > 0);
  const count = campaigns.length;

  return (
    <section id="recalls" className="report-card p-6 mb-8 bg-white/95 border border-slate-200/80 rounded-2xl shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Отзывные кампании
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              Росстандарт РФ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Реестр специальных сервисных программ Федерального агентства по техническому регулированию
          </p>
        </div>
        <div>
          {hasRecalls ? (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Обнаружены кампании: {count}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Отзывных кампаний не найдено
            </span>
          )}
        </div>
      </div>

      {hasRecalls ? (
        <div className="space-y-4">
          {campaigns.map((camp: any, idx: number) => (
            <div 
              key={idx} 
              className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 hover:border-slate-300 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-700">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {camp.organizer || 'Сервисная кампания завода-изготовителя'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Инициатор: Официальное представительство марки
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-rose-100 text-rose-900 font-bold px-2.5 py-0.5 rounded-md border border-rose-200">
                    {camp.campaign_id || 'РОССТАНДАРТ'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Дата публикации:
                  </span>
                  <div className="font-bold text-slate-900 font-mono">{camp.date || 'Уточняется'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 font-medium block mb-1">Статус проведения:</span>
                  <div className="font-bold text-amber-700">{camp.status || 'Требуется проверка'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Стоимость для владельца:
                  </span>
                  <div className="font-extrabold text-emerald-700">0 ₽ (За счёт производителя)</div>
                </div>
              </div>

              {camp.issue && (
                <div className="text-xs text-slate-700 bg-white border border-slate-200/90 rounded-lg p-3.5 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Причина отзыва / дефект:
                  </span>
                  <p className="text-slate-600 leading-relaxed">{camp.issue}</p>
                </div>
              )}

              {camp.remedy && (
                <div className="text-xs text-slate-700 bg-white border border-slate-200/90 rounded-lg p-3.5 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-500" /> Рекомендованные сервисные работы:
                  </span>
                  <p className="text-slate-600 leading-relaxed">{camp.remedy}</p>
                </div>
              )}
            </div>
          ))}

          <AiConclusionBox
            text="На автомобиль объявлена сервисная отзывная кампания. Уточните у продавца заказ-наряд на проведение бесплатных отзывных работ. Если работы не проводились, вы можете бесплатно выполнить их у любого официального дилера марки в РФ."
          />
        </div>
      ) : (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Открытых сервисных кампаний не зарегистрировано
          </div>
          По данному VIN открытых или незавершенных отзывных предписаний Федерального агентства по техническому регулированию (Росстандарт) не обнаружено.
          <AiConclusionBox
            text="Завод-изготовитель не выпускал предписаний по критическим дефектам узлов и агрегатов для данной партии автомобилей."
          />
        </div>
      )}
    </section>
  );
};

