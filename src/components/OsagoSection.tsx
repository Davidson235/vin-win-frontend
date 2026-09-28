import React from 'react';
import { ShieldCheck, AlertCircle, Calculator } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface OsagoSectionProps {
  osagoData?: any;
  specs?: any;
  currentPlate?: string;
  onOpenKbmModal?: () => void;
}

export const OsagoSection: React.FC<OsagoSectionProps> = ({
  osagoData,
  onOpenKbmModal,
}) => {
  const hasPolicy = Boolean(osagoData?.has_policy);
  const isValid = Boolean(osagoData?.is_valid);
  const insurer = osagoData?.insurer;
  const policyNumber = osagoData?.full_number || (osagoData?.policy_series && osagoData?.policy_number ? `${osagoData.policy_series} ${osagoData.policy_number}` : null);
  const validPeriod = osagoData?.valid_from && osagoData?.valid_to
    ? `${osagoData.valid_from} — ${osagoData.valid_to}`
    : null;

  const policyCar = osagoData?.full_model || (osagoData?.mark ? `${osagoData.mark} ${osagoData.model_name || ''}`.trim() : null);
  const policyPlateMask = osagoData?.plate_masked;

  return (
    <section id="osago" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ОСАГО
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Единая информационная система страхования АО «НСИС» (Банк России) и РСА
          </p>
        </div>
        <div>
          {hasPolicy && isValid ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ДЕЙСТВУЕТ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              НЕ ДЕЙСТВУЕТ
            </span>
          )}
        </div>
      </div>

      {hasPolicy && isValid ? (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Страховая компания</span>
              <div className="font-bold text-slate-900 mt-0.5">{insurer || 'Указана в полисе'}</div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Серия и номер полиса</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5 tracking-wide">{policyNumber || '—'}</div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Срок действия</span>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">{validPeriod || '—'}</div>
            </div>

            {policyCar && (
              <div>
                <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">ТС по договору</span>
                <div className="font-semibold text-slate-900 mt-0.5">{policyCar}</div>
              </div>
            )}

            {policyPlateMask && (
              <div>
                <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Госномер по полису</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{policyPlateMask}</div>
              </div>
            )}

            <div>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Ограничения водителей</span>
              <div className="font-medium text-slate-900 mt-0.5">{osagoData?.drivers_restriction || 'С ограничениями'}</div>
            </div>

            {osagoData?.kbm && (
              <div>
                <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Коэффициент бонус-малус (КБМ)</span>
                <div className="font-mono font-bold text-emerald-700 mt-0.5">
                  {osagoData.kbm}
                </div>
              </div>
            )}

            <div>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Цель использования</span>
              <div className="font-medium text-slate-900 mt-0.5">{osagoData?.purpose || 'Личные цели'}</div>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between gap-2 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="leading-relaxed">
                Сведения подтверждены единой системой страхования Банка России (АО «НСИС»). Полис зарегистрирован на данное ТС.
              </span>
            </div>
          </div>

          {onOpenKbmModal && (
            <div className="mt-4 pt-3.5 border-t border-slate-200/70">
              <button
                onClick={onOpenKbmModal}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5 text-rose-600" /> Рассчитать официальный КБМ водителя в РСА →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed shadow-xs">
          <p className="font-bold text-slate-900 mb-1.5">
            Действующий полис ОСАГО в реестре АО «НСИС» не обнаружен
          </p>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
            На момент запроса активных договоров обязательного страхования автогражданской ответственности в единой информационной системе Банка России (АО «НСИС») не зафиксировано. Это стандартная ситуация при продаже автомобиля: прежний владелец расторгает страховку для возврата части премии, а покупатель оформит новый полис при постановке на учёт в МРЭО ГИБДД.
          </p>

          {onOpenKbmModal && (
            <div className="pt-3.5 border-t border-slate-200/70">
              <button
                onClick={onOpenKbmModal}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5 text-rose-600" /> Рассчитать персональный КБМ водителя перед оформлением ОСАГО →
              </button>
            </div>
          )}
        </div>
      )}

      <AiConclusionBox
        text={
          hasPolicy && isValid
            ? `Действующий полис ОСАГО подтвержден в реестре АО «НСИС». Автомобиль допущен к участию в дорожном движении.`
            : 'Полис ОСАГО не действует. Эксплуатация автомобиля без действующего полиса ОСАГО влечет административный штраф по ст. 12.37 КоАП РФ. Перед выездом на дороги общего пользования необходимо оформить страховку.'
        }
      />
    </section>
  );
};
