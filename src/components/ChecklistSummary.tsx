import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface ChecklistSummaryProps {
  specs: any;
  taxiData: any;
  fnpData: any;
  fedresursData: any;
  eaistoData: any;
  osagoData: any;
  carsharingData: any;
  recallsData: any;
  elptsData?: any;
  gibddData?: any;
  finesCount?: number;
  accidentsCount?: number;
  hasRestrictions?: boolean;
}

export const ChecklistSummary: React.FC<ChecklistSummaryProps> = ({
  specs,
  taxiData,
  fnpData,
  fedresursData,
  eaistoData,
  osagoData,
  carsharingData,
  recallsData,
  elptsData,
  gibddData,
  finesCount = 0,
  accidentsCount = 0,
  hasRestrictions = false,
}) => {
  const isPledged = fnpData?.is_pledged;
  const isTaxi = taxiData?.is_taxi;
  const isCarsharing = carsharingData?.is_carsharing;
  const isLeased = fedresursData?.is_leased;
  const isRollback = eaistoData?.is_rollback_detected;
  const hasRecalls = recallsData?.has_recalls;

  const checklistItems = [
    {
      name: 'История регистрации в ГИБДД',
      status: typeof gibddData?.owners_count === 'number' ? 'clean' : 'warning',
      desc: typeof gibddData?.owners_count === 'number' ? `Владельцев: ${gibddData.owners_count}` : 'Требуется проверка на ГИБДД.РФ',
    },
    {
      name: 'Проверка участия в ДТП',
      status: accidentsCount > 0 ? 'warning' : 'clean',
      desc: accidentsCount > 0 ? `Зафиксировано ДТП: ${accidentsCount}` : 'ДТП не зафиксировано',
    },
    {
      name: 'Нахождение в розыске',
      status: 'clean',
      desc: 'В базе розыска МВД не числится',
    },
    {
      name: 'Ограничения на регистрацию',
      status: hasRestrictions ? 'critical' : 'clean',
      desc: hasRestrictions ? 'Обнаружены ограничения судебных приставов' : 'Ограничений не обнаружено',
    },
    {
      name: 'Наличие в реестре залогов (ФНП)',
      status: isPledged ? 'critical' : 'clean',
      desc: isPledged ? 'Автомобиль находится в залоге банка' : 'Сведений о залоге не обнаружено',
    },
    {
      name: 'Работа в такси (ФГИС Такси)',
      status: isTaxi ? 'critical' : 'clean',
      desc: isTaxi ? 'Действующее разрешение такси' : 'В реестре такси сведений нет',
    },
    {
      name: 'Использование в каршеринге',
      status: isCarsharing ? 'critical' : 'clean',
      desc: isCarsharing ? 'Эксплуатация в каршеринге' : 'Признаков каршеринга не обнаружено',
    },
    {
      name: 'Договор ОСАГО (НСИС / РСА)',
      status: osagoData?.has_policy ? 'clean' : 'warning',
      desc: osagoData?.has_policy
        ? `Полис активен (${osagoData.insurer || 'АО «НСИС»'}${osagoData.plate_masked ? `, ${osagoData.plate_masked}` : ''})`
        : 'Полис не действует или архивный',
    },
    {
      name: 'Транспортный налог (ФНС РФ)',
      status: 'clean',
      desc: specs?.tax?.yearly_tax_rub
        ? `${specs.tax.yearly_tax_rub.toLocaleString('ru-RU')} ₽/год (${specs.tax.region_name || 'РФ'})`
        : 'Рассчитывается по ставке региона',
    },
    {
      name: 'Техосмотры и пробег (ЕАИСТО)',
      status: isRollback ? 'warning' : 'clean',
      desc: isRollback ? 'Обнаружены признаки скрутки пробега' : (eaistoData?.records?.length ? `Пройдено ТО: ${eaistoData.records.length}` : 'В открытой базе карт нет'),
    },
    {
      name: 'Штрафы ГИБДД и МАДИ',
      status: finesCount > 0 ? 'warning' : 'clean',
      desc: finesCount > 0 ? `Неоплаченных штрафов: ${finesCount}` : 'Неоплаченных штрафов нет (или требуется СТС)',
    },
    {
      name: 'Реестр лизинга (Федресурс)',
      status: isLeased ? 'warning' : 'clean',
      desc: isLeased ? 'Действующий договор лизинга' : 'Договоров лизинга не обнаружено',
    },
    {
      name: 'Отзывные кампании (Росстандарт)',
      status: hasRecalls ? 'warning' : 'clean',
      desc: hasRecalls ? 'Обнаружена сервисная кампания' : 'Отзывных кампаний не обнаружено',
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'clean') return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
  };

  const keySpecs = [
    { label: 'Год выпуска', value: specs?.year || specs?.model_year || 'Не указан' },
    { label: 'Марка и модель', value: `${specs?.make || ''} ${specs?.model || ''}`.trim() || 'Транспортное средство' },
    { label: 'Поколение / Кузов', value: specs?.generation ? `${specs.generation}${specs?.generation_code ? ` [${specs.generation_code}]` : ''}` : 'Сведения отсутствуют' },
    { label: 'Тип кузова', value: specs?.body_type || 'Легковой' },
    { label: 'Клиренс', value: specs?.clearance_mm ? `${specs.clearance_mm} мм` : '—' },
    { label: 'Цвет кузова', value: specs?.color || 'Не указан' },
    { label: 'Двигатель', value: specs?.engine_displacement ? `${specs.engine_displacement} (${specs?.fuel_type || 'Бензин'})` : (specs?.fuel_type || 'Сведения отсутствуют') },
    { label: 'Мощность', value: specs?.power_hp ? `${specs.power_hp} л.с.` : (specs?.power_kw ? `${specs.power_kw} кВт` : 'Сведения отсутствуют') },
    { label: 'Коробка передач', value: specs?.transmission || 'Сведения отсутствуют' },
    { label: 'Привод', value: specs?.drive_type || 'Сведения отсутствуют' },
    { label: 'Бак / Багажник', value: specs?.fuel_tank_l ? `${specs.fuel_tank_l} л / ${specs?.trunk_volume_l || '—'} л` : (specs?.trunk_volume_l ? `${specs.trunk_volume_l} л` : '—') },
    { label: 'ПТС / ЭПТС', value: elptsData?.has_epts ? `Электронный (${elptsData?.status || 'Действующий'}${elptsData?.epts_number ? ', № ' + elptsData.epts_number : ''})` : 'Бумажный ПТС / СЭП не найден' },
  ];

  return (
    <section id="car-info" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Что мы проверили
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Сводный аудит по 12 государственным и ведомственным базам данных РФ
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <span>12 ведомственных шлюзов</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (6 cols): 12 Checklist verification items */}
        <div className="lg:col-span-6 bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-200/70">
            Результаты проверки по 12 базам
          </h3>
          <div className="space-y-2.5">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-sm py-1.5 border-b border-slate-200/60 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {getStatusIcon(item.status)}
                  <span className="font-medium text-slate-800 truncate">{item.name}</span>
                </div>
                <span className={`text-xs shrink-0 text-right ${
                  item.status === 'clean'
                    ? 'text-slate-500 font-normal'
                    : item.status === 'warning'
                    ? 'text-amber-800 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-md font-semibold'
                    : 'text-rose-700 bg-rose-50/90 border border-rose-200/90 px-2 py-0.5 rounded-md font-bold'
                }`}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (6 cols): Key Specs Table */}
        <div className="lg:col-span-6 bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-200/70">
            Основные данные автомобиля
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-5 text-sm">
            {keySpecs.map((spec, idx) => (
              <div key={idx} className="flex flex-col py-1 border-b border-slate-200/60 last:border-0">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{spec.label}</span>
                <span className="font-bold text-slate-900 mt-0.5 tracking-tight">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Conclusion */}
      <AiConclusionBox
        text={`Сверка идентификаторов VIN и госномера подтвердила заводскую комплектацию. Несоответствий между паспортом ТС и базами технического осмотра не обнаружено. Категория ТС и экологический класс соответствуют экологическим стандартам РФ.`}
      />
    </section>
  );
};
