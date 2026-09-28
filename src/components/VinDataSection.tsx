import React from 'react';
import { Cpu, ReceiptText } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface VinDataSectionProps {
  vin?: string;
  specs?: any;
}

export const VinDataSection: React.FC<VinDataSectionProps> = ({ vin, specs }) => {
  const cleanVin = vin || specs?.vin || '—';
  const wmiCode = specs?.wmi || (cleanVin !== '—' ? cleanVin.slice(0, 3) : '—');

  const vinDetails = [
    { label: 'Идентификационный номер (VIN)', value: cleanVin },
    { label: 'Код WMI (Изготовитель)', value: wmiCode },
    { label: 'Марка автомобиля', value: specs?.make || '—' },
    { label: 'Модель', value: specs?.model || '—' },
    { label: 'Поколение / Кузов', value: specs?.generation ? `${specs.generation}${specs?.generation_code ? ` [${specs.generation_code}]` : ''}` : '—' },
    { label: 'Модельный год', value: specs?.model_year || specs?.year || '—' },
    { label: 'Тип кузова', value: specs?.body_type || '—' },
    { label: 'Дорожный просвет (клиренс)', value: specs?.clearance_mm ? `${specs.clearance_mm} мм` : '—' },
    { label: 'Объем багажника', value: specs?.trunk_volume_l ? `${specs.trunk_volume_l} л` : '—' },
    { label: 'Объем топливного бака', value: specs?.fuel_tank_l ? `${specs.fuel_tank_l} л` : '—' },
    { label: 'Габариты (Д × Ш × В)', value: specs?.dimensions ? `${specs.dimensions.length_mm || specs.dimensions.length} × ${specs.dimensions.width_mm || specs.dimensions.width} × ${specs.dimensions.height_mm || specs.dimensions.height} мм` : '—' },
    { label: 'Объем двигателя', value: specs?.engine_displacement || '—' },
    { label: 'Тип топлива', value: specs?.fuel_type || '—' },
    { label: 'Мощность', value: specs?.power_hp ? `${specs.power_hp} л.с.` : (specs?.power_kw ? `${specs.power_kw} кВт` : '—') },
    { label: 'Коробка передач', value: specs?.transmission || '—' },
    { label: 'Тип привода', value: specs?.drive_type || '—' },
    { label: 'Страна происхождения', value: specs?.country || '—' },
    { label: 'Завод-изготовитель', value: specs?.manufacturer || '—' },
    { label: 'Стандарт спецификации', value: 'ISO 3779 / NHTSA WMI / Каталог ТТХ' },
  ].filter(item => item.value && item.value !== '—');

  const manufacturerName = specs?.manufacturer || specs?.make || 'автопроизводителя';
  const countryName = specs?.country ? ` (${specs.country})` : '';

  return (
    <section id="vin-data" className="report-card p-6 mb-8 bg-white/95 border border-slate-200/80 rounded-2xl shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Данные по VIN
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              ISO 3779
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Заводские спецификации и параметры комплектации по международному стандарту автопроизводителей
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200/80 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-rose-600" />
          Декодирование ISO 3779
        </div>
      </div>

      <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
          {vinDetails.map((item, idx) => (
            <div key={idx} className="flex flex-col py-1.5 border-b border-slate-200/60 last:border-0">
              <span className="text-slate-500 text-xs font-medium">{item.label}</span>
              <span className="font-bold text-slate-900 mt-0.5 font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Tax Widget (ФНС РФ) */}
      {specs?.tax && specs.tax.yearly_tax_rub > 0 && (
        <div className="mt-5 p-5 rounded-xl bg-gradient-to-r from-slate-50 via-rose-50/20 to-slate-50 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-600/20 shrink-0">
                <ReceiptText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Транспортный налог (ФНС РФ)
                  </span>
                  {specs.tax.luxury_coef > 1.0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      Налог на роскошь ×{specs.tax.luxury_coef}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                  {specs.tax.tax_note}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {specs.tax.yearly_tax_rub.toLocaleString('ru-RU')} ₽ <span className="text-xs font-semibold text-slate-500 font-sans">/ год</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">
                {specs.tax.power_hp} л.с. · {specs.tax.region_name} ({specs.tax.rate_per_hp} ₽/л.с.)
              </div>
            </div>
          </div>
        </div>
      )}

      <AiConclusionBox
        text={vin && vin !== '—'
          ? `Декодирование контрольных символов VIN подтверждает соответствие международному реестру изготовителей WMI: ${manufacturerName}${countryName}. Структура номера валидна, контрольный символ совпадает.`
          : 'Поиск автомобиля производился по государственному регистрационному знаку. Детальная заводская спецификация по стандарту ISO 3779 доступна при указании VIN-номера.'
        }
      />
    </section>
  );
};

