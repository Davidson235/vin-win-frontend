import React, { useState } from 'react';
import { TechnicalDamageBlueprint } from './TechnicalDamageBlueprint';

interface DamagePartItem {
  title: string;
  action: string;
  severity: 'replace' | 'paint' | 'repair';
}

interface AudatexCalculationItem {
  date: string;
  city?: string;
  type: string;
  insurer?: string;
  amount_rub: number;
  description: string;
}

interface BodyDamageSectionProps {
  hasAccidents?: boolean;
  damageParts?: DamagePartItem[];
  audatexCalculations?: AudatexCalculationItem[];
  audatexTotalRub?: number;
  isSampleMode?: boolean;
}

const DEFAULT_SAMPLE_PARTS: DamagePartItem[] = [
  {
    title: 'Передний бампер S line',
    action: 'Замена на новый оригинал + покраска (14.03.2021)',
    severity: 'replace',
  },
  {
    title: 'Правая LED Matrix фара',
    action: 'Разрушение креплений и стекла. Замена блока (14.03.2021)',
    severity: 'replace',
  },
  {
    title: 'Правое переднее крыло',
    action: 'Деформация ребра жесткости. Замена и подгонка',
    severity: 'replace',
  },
  {
    title: 'Капот алюминиевый',
    action: 'Локальный ремонт кромки, окрас с переходом (до 210 мкм)',
    severity: 'paint',
  },
];

const DEFAULT_SAMPLE_CALCULATIONS: AudatexCalculationItem[] = [
  {
    date: '14.03.2021',
    city: 'Москва',
    type: 'Столкновение двух ТС (Наезд на препятствие)',
    insurer: 'СПАО «Ингосстрах»',
    amount_rub: 385400,
    description: 'Замена: бампер передний, фара правая в сборе, крыло правое, решетка радиатора S line.',
  },
  {
    date: '19.11.2022',
    city: 'Санкт-Петербург',
    type: 'Касательное столкновение на парковке',
    insurer: 'ПАО «РЕСО-Гарантия»',
    amount_rub: 78500,
    description: 'Ремонт и окраска задней правой двери и арки крыла.',
  },
];

export const BodyDamageSection: React.FC<BodyDamageSectionProps> = ({
  hasAccidents = true,
  damageParts,
  audatexCalculations,
  audatexTotalRub,
  isSampleMode = false,
}) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // In sample mode or when hasAccidents is true, use data or fallback
  const isDamaged = isSampleMode ? true : hasAccidents;
  const parts = isSampleMode
    ? DEFAULT_SAMPLE_PARTS
    : damageParts && damageParts.length > 0
    ? damageParts
    : [];

  const calculations = isSampleMode
    ? DEFAULT_SAMPLE_CALCULATIONS
    : audatexCalculations && audatexCalculations.length > 0
    ? audatexCalculations
    : [];

  const totalCalculations = isSampleMode
    ? 463900
    : audatexTotalRub || calculations.reduce((sum, item) => sum + (item.amount_rub || 0), 0);

  return (
    <section id="dtp" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* LEFT COLUMN (lg:col-span-7): 2D Technical Body Damage Blueprint */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
              Кузовная дефектовка
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
              Интерактивная карта повреждений
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#565e74] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
              <span>Замена/Смена геометрии</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-200 border border-[#e11d48]"></span>
              <span>Окрас детали</span>
            </span>
          </div>
        </div>

        {/* Blueprint SVG Graphic */}
        <TechnicalDamageBlueprint
          hasDamage={isDamaged}
          damageZoneLabel="Зона ДТП #1: 385 400 ₽"
          paintZoneLabel="Окрас до 210 мкм"
          onSelectZone={(zone) => setSelectedPart(zone)}
        />

        {/* Itemized Parts Breakdown List (4 Cards) */}
        {parts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {parts.map((part, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                  selectedPart === part.title
                    ? 'bg-rose-50 border-[#e11d48] shadow-xs'
                    : 'bg-[#eff4ff] border-slate-200/70 hover:bg-[#e5eeff]'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    part.severity === 'replace' ? 'bg-[#e11d48]' : 'bg-rose-400'
                  }`}
                />
                <div>
                  <div className="text-xs font-extrabold text-[#0b1c30]">{part.title}</div>
                  <div className="text-[11px] text-[#565e74] mt-0.5 leading-relaxed">{part.action}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center">
            <span className="text-xs font-bold text-[#006847]">
              ✓ Все внешние кузовные элементы имеют заводскую толщину ЛКП и геометрию
            </span>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN (lg:col-span-5): Audatex / DAT Insurance Damage Ledger */}
      <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
              Калькуляции страховых
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#eff4ff] font-mono text-[11px] text-[#0b1c30] font-bold border border-slate-200/60">
              Audatex / РСА
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
            История выплат и смет
          </h2>
          <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
            Официальные экспертные расчеты ущерба по договорам КАСКО/ОСАГО.
          </p>
        </div>

        {/* Calculation Records List */}
        <div className="space-y-3.5 my-auto">
          {calculations.length > 0 ? (
            calculations.map((calc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#565e74]">
                    ДТП {calc.date} {calc.city ? `• ${calc.city}` : ''}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-[#e11d48]">
                    {calc.amount_rub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="text-xs font-bold text-[#0b1c30]">{calc.type}</div>
                <div className="text-[11px] text-[#565e74] leading-relaxed">
                  {calc.insurer ? `Страховщик: ${calc.insurer}. ` : ''}
                  {calc.description}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="material-symbols-outlined text-[32px] text-[#00845a] mb-1">
                receipt_long
              </span>
              <div className="text-xs font-bold text-[#0b1c30]">Калькуляций выплат не найдено</div>
              <div className="text-[11px] text-[#565e74] mt-1">
                Страховые компании не проводили расчетов восстановительного ремонта.
              </div>
            </div>
          )}
        </div>

        {/* Total Calculations Footer Pill */}
        <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
            Итоговая сумма калькуляций:
          </span>
          <span className="font-mono text-base sm:text-lg font-black text-[#e11d48]">
            {totalCalculations.toLocaleString('ru-RU')} ₽
          </span>
        </div>

      </div>

    </section>
  );
};
