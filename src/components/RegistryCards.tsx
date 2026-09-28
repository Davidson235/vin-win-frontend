import React from 'react';
import { ShieldCheck, AlertCircle, Scale, Car } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface RegistryCardsProps {
  fnpData: any;
  taxiData: any;
  carsharingData: any;
  fedresursData: any;
  hasRestrictions?: boolean;
  onOpenFsspCheck?: () => void;
}

export const RegistryCards: React.FC<RegistryCardsProps> = ({
  fnpData,
  taxiData,
  carsharingData,
  hasRestrictions = false,
  onOpenFsspCheck,
}) => {
  const isPledged = fnpData?.is_pledged;
  const isTaxi = taxiData?.is_taxi;
  const isCarsharing = carsharingData?.is_carsharing;

  return (
    <div className="space-y-8">
      {/* 7. ОГРАНИЧЕНИЯ */}
      <section id="restrict" className="report-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ограничения на регистрационные действия
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              База Госавтоинспекции РФ и Федеральной службы судебных приставов (ФССП)
            </p>
          </div>
          <div>
            {hasRestrictions ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Обнаружены ограничения!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Ограничения не обнаружены
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {hasRestrictions
              ? 'Внимание! На автомобиль наложен запрет на регистрационные действия судебными приставами. Регистрация в ГИБДД на нового собственника невозможна до полного погашения задолженности.'
              : 'ГИБДД не выявило запретов и ограничений на совершение регистрационных действий судебными приставами, следственными или таможенными органами. Автомобиль свободен для переоформления в МРЭО.'}
          </p>

          {onOpenFsspCheck && (
            <div className="mt-3.5">
              <button
                onClick={onOpenFsspCheck}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-rose-600" /> Проверить задолженности собственника по ФССП →
              </button>
            </div>
          )}
        </div>

        <AiConclusionBox
          text={
            hasRestrictions
              ? 'Наложен запрет на совершение регистрационных действий. Сделка купли-продажи несет высокий риск потери средств. Требуется закрытие исполнительного производства в ФССП.'
              : 'Ограничений на совершение регистрационных действий в органах ГИБДД не обнаружено. Юридических препятствий для покупки и постановки на учёт нет.'
          }
        />
      </section>

      {/* 8. РОЗЫСК */}
      <section id="search" className="report-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Розыск
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              Проверка по федеральной базе розыска транспортных средств МВД России
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              В розыске не числится
            </span>
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            Автомобиль проверен по базе розыска МВД России. Совпадений с угнанными, похищенными или разыскиваемыми транспортными средствами не обнаружено.
          </p>
        </div>

        <AiConclusionBox
          text="Автомобиль чист по криминальным учётам МВД. Записей об угоне или розыске интерполом нет."
        />
      </section>

      {/* 9. ЗАЛОГИ */}
      <section id="zalog" className="report-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Залоги (ФНП)
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              Реестр уведомлений о залоге движимого имущества Федеральной нотариальной палаты
            </p>
          </div>
          <div>
            {isPledged ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Автомобиль в залоге!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Залоги не обнаружены
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {isPledged
              ? 'Внимание! В реестре Федеральной нотариальной палаты обнаружено действующее уведомление о залоге в пользу кредитной организации. Покупка авто в залоге чревата изъятием банком!'
              : 'В реестре уведомлений о залоге движимого имущества Федеральной нотариальной палаты (reestr-zalogov.ru) сведений о залоге данного автомобиля не обнаружено.'}
          </p>
        </div>

        <AiConclusionBox
          text={
            isPledged
              ? 'Критический риск! Автомобиль обременен залогом банка. Требуйте от продавца справку из банка о полном погашении автокредита и снятии уведомления из нотариата.'
              : 'Залоговых обременений в реестре Нотариата РФ не зафиксировано. Риск изъятия банком за долги прежнего владельца отсутствует.'
          }
        />
      </section>

      {/* 11. ТАКСИ */}
      <section id="taxi" className="report-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Такси
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              Единая федеральная система ФГИС «Такси» и региональные реестры Минтранса РФ
            </p>
          </div>
          <div>
            {isTaxi ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <Car className="w-3.5 h-3.5 text-rose-600" />
                Работало в такси!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Использование в такси не обнаружено
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {isTaxi
              ? `Обнаружено действующее или архивное разрешение на осуществление деятельности по перевозке пассажиров и багажа легковым такси (№ ${taxiData?.license_number || ''}).`
              : 'Автомобиль проверен по федеральной базе ФГИС «Такси» и региональным реестрам перевозчиков. Разрешений на работу в такси не выдавалось.'}
          </p>
        </div>

        <AiConclusionBox
          text={
            isTaxi
              ? 'Автомобиль эксплуатировался в режиме такси. Это означает повышенный износ ходовой части, двигателя и элементов салона. Рекомендуется тщательная эндоскопия мотора.'
              : 'Автомобиль не использовался в качестве легкового такси. Износ салона и силовых агрегатов соответствует стандартной частной эксплуатации.'
          }
        />
      </section>

      {/* 12. КАРШЕРИНГ */}
      <section id="carsharing" className="report-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Каршеринг
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              Базы операторов поминутной аренды и лизинговых парков юридических лиц
            </p>
          </div>
          <div>
            {isCarsharing ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Каршеринг обнаружен!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                В каршеринге не обнаружено
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {isCarsharing
              ? 'Автомобиль состоял в парке оператора каршеринга. Эксплуатация множеством разных водителей приводит к ускоренному износу трансмиссии и подвески.'
              : 'Среди парков каршеринга (Яндекс Драйв, Делимобиль, Ситидрайв, BelkaCar) автомобиль не зарегистрирован.'}
          </p>
        </div>

        <AiConclusionBox
          text="Признаков коммерческой эксплуатации в каршеринге не выявлено. Автомобиль находился в частном владении."
        />
      </section>
    </div>
  );
};
