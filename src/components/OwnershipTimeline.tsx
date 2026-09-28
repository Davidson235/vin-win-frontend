import React from 'react';
import { User, Building, Calendar, MapPin, Tag } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface OwnerRecord {
  period_from: string;
  period_to: string;
  duration: string;
  owner_type: 'FIZ' | 'YUR';
  region: string;
  operation: string;
  plate?: string;
}

interface OwnershipTimelineProps {
  gibddData?: any;
  currentPlate?: string;
}

export const OwnershipTimeline: React.FC<OwnershipTimelineProps> = ({ gibddData, currentPlate }) => {
  // Only use verified registration periods if available from official response
  const rawPeriods = gibddData?.registration_periods;
  const isRealData = gibddData?.is_real_data && Array.isArray(rawPeriods) && rawPeriods.length > 0;

  const owners: OwnerRecord[] = isRealData
    ? rawPeriods.map((p: any) => ({
        period_from: p.from || p.period?.split('—')[0]?.trim() || '',
        period_to: p.to || p.period?.split('—')[1]?.trim() || 'По настоящее время',
        duration: p.duration || 'Не указана',
        owner_type: p.owner_type?.includes('Юр') ? 'YUR' : 'FIZ',
        region: p.region || 'РФ',
        operation: p.operation || 'Регистрационное действие',
        plate: p.plate || currentPlate,
      }))
    : [];

  const totalOwners = gibddData?.owners_count || owners.length;

  return (
    <section id="owners" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            История владения
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Официальные данные регистрационных действий Госавтоинспекции МВД РФ
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-center border border-rose-200/80 shadow-xs">
          <span>{totalOwners ? `Всего владельцев: ${totalOwners}` : 'ГИБДД.РФ (МВД)'}</span>
        </div>
      </div>

      {/* Render Real Periods if available */}
      {owners.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80">
          {owners.map((owner, idx) => (
            <div key={idx} className="relative group">
              {/* Node Icon */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-rose-600 flex items-center justify-center text-rose-600 font-bold text-xs shadow-sm ring-4 ring-rose-50 z-10 font-mono">
                {idx + 1}
              </div>

              {/* Content Box */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 transition duration-150 hover:border-slate-300/90 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {idx + 1}-й владелец
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      owner.owner_type === 'FIZ' ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {owner.owner_type === 'FIZ' ? <User className="w-3 h-3 text-slate-600" /> : <Building className="w-3 h-3 text-purple-600" />}
                      {owner.owner_type === 'FIZ' ? 'Физическое лицо' : 'Юридическое лицо'}
                    </span>
                  </div>

                  {/* Duration chip */}
                  <span className="text-xs bg-white border border-slate-200/80 text-slate-700 font-semibold px-2.5 py-1 rounded-full shadow-2xs font-mono">
                    {owner.duration}
                  </span>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-mono">{owner.period_from} — {owner.period_to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{owner.region}</span>
                  </div>
                  {owner.plate && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="font-mono font-bold text-slate-800">{owner.plate}</span>
                    </div>
                  )}
                </div>

                {/* Operation label */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Действие: </span>
                  {owner.operation}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Honest Status when GIBDD API is blocked by CAPTCHA */
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-center sm:text-left flex flex-col sm:flex-row items-center gap-5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-xs">
            <User className="w-6 h-6 text-rose-600" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              {totalOwners ? `Зафиксировано собственников по открытым базам: ${totalOwners}` : 'История периодов владения ограничена защитой МВД'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Официальный сервер Госавтоинспекции (ГИБДД.РФ) защищён интерактивной графической капчей и блокирует автоматический сбор истории владения. Вы можете запросить выписку у текущего собственника через Госуслуги или провести бесплатную ручную проверку на официальном сайте ГИБДД.
            </p>
            <div className="pt-2">
              <a
                href="https://xn--90adear.xn--p1ai/check/auto"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-lg border border-rose-200/90 transition shadow-xs"
              >
                <span>Проверить историю на сайте ГИБДД.РФ ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI Conclusion */}
      <AiConclusionBox
        text={
          owners.length > 0
            ? `Машина сменила ${totalOwners} владельцев за всё время эксплуатации.`
            : 'Точные периоды владения подтверждаются паспортом транспортного средства (ПТС/СТС) или выпиской из Госуслуг собственника.'
        }
      />
    </section>
  );
};
