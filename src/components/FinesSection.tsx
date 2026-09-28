import React from 'react';
import { ShieldCheck, AlertTriangle, Receipt } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface FinesSectionProps {
  finesData?: any;
  onOpenFinesModal?: () => void;
}

export const FinesSection: React.FC<FinesSectionProps> = ({ finesData, onOpenFinesModal }) => {
  const isChecked = Boolean(finesData?.checked || finesData?.sts);
  const totalFines = finesData?.total_fines_count || 0;
  const unpaidFines = finesData?.unpaid_fines_count || 0;
  const totalAmount = finesData?.total_amount_rub || finesData?.total_amount || 0;
  const finesList = finesData?.fines || [];

  return (
    <section id="fines" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Штрафы ГИБДД
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Проверка по базе ГИС ГМП, Госавтоинспекции и Федерального Казначейства
          </p>
        </div>
        <div>
          {!isChecked ? (
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              Требуется номер СТС
            </span>
          ) : unpaidFines > 0 ? (
            <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Неоплачено: {unpaidFines} ({totalAmount.toLocaleString('ru-RU')} ₽)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Штрафов не обнаружено
            </span>
          )}
        </div>
      </div>

      {isChecked ? (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 text-center shadow-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Всего штрафов</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalFines}</div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 text-center shadow-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Неоплаченных</span>
              <div className={`text-2xl font-black mt-1 font-mono ${unpaidFines > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {unpaidFines}
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 text-center shadow-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Сумма к оплате</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {totalAmount.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {/* Fines List or Clean State */}
          {finesList.length > 0 ? (
            <div className="space-y-3">
              {finesList.map((fine: any, idx: number) => (
                <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-700">№ {fine.uin || fine.bill_number}</span>
                      <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200/70 font-semibold px-2 py-0.5 rounded-md">
                        {fine.article || 'КоАП РФ'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{fine.violation_name || fine.name || 'Превышение скорости'}</p>
                    <div className="text-xs text-slate-500 font-mono">{fine.date || fine.bill_date} • {fine.division_name || 'ГИБДД РФ'}</div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900 font-mono">{fine.amount || fine.amount_rub} ₽</div>
                      {fine.discount_date && (
                        <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded">
                          Скидка 50% до {fine.discount_date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm text-slate-600 shadow-xs">
              По указанному номеру СТС неоплаченных штрафов ГИБДД, МАДИ и АМПП не обнаружено.
            </div>
          )}

          <AiConclusionBox
            text={
              unpaidFines > 0
                ? `Обнаружено ${unpaidFines} неоплаченных штрафов на сумму ${totalAmount} ₽. При покупке авто убедитесь, что продавец погасил все задолженности во избежание наложения ареста приставами.`
                : 'Неоплаченных штрафов ГИБДД по указанному СТС не обнаружено. За автомобилем не числится долговых обязательств перед дорожной инспекцией.'
            }
          />
        </>
      ) : (
        <>
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed shadow-xs">
            <p className="font-bold text-slate-900 mb-1.5">
              Для официального запроса штрафов с камер фотовидеофиксации требуется номер СТС
            </p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
              Государственная система ГИС ГМП (Федеральное Казначейство) и базы Госавтоинспекции в соответствии с Федеральным законом «О персональных данных» не предоставляют сведения о штрафах по одному лишь VIN или госномеру. Для проверки требуется ввести номер Свидетельства о регистрации (СТС).
            </p>

            {onOpenFinesModal && (
              <button
                onClick={onOpenFinesModal}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-md shadow-rose-600/20 active:scale-[0.99]"
              >
                <Receipt className="w-4 h-4" /> Ввести номер СТС для бесплатной проверки штрафов
              </button>
            )}
          </div>

          <AiConclusionBox
            text="Штрафы с камер не запрашивались, так как номер СТС не был указан. Нажмите кнопку выше для мгновенной бесплатной проверки задолженностей по официальной базе ГИС ГМП."
          />
        </>
      )}
    </section>
  );
};
