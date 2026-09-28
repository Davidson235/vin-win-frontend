import React, { useState } from 'react';

interface PrCodeItem {
  code: string;
  category: string;
  title: string;
  description: string;
}

interface OemCatalogAndVerdictSectionProps {
  prCodes?: PrCodeItem[];
  brandName?: string;
  isSampleMode?: boolean;
}

const DEFAULT_SAMPLE_PR_CODES: PrCodeItem[] = [
  {
    code: '1BK',
    category: 'Подвеска',
    title: 'Adaptive Air Suspension',
    description: 'Электронно-управляемая адаптивная пневматическая подвеска с бесступенчатым демпфированием.',
  },
  {
    code: '8G4',
    category: 'Оптика',
    title: 'Audi Matrix LED Headlights',
    description: 'Матричные светодиодные фары с динамическими указателями поворота спереди и сзади.',
  },
  {
    code: '9VD',
    category: 'Акустика',
    title: 'Bang & Olufsen 3D Premium Sound',
    description: 'Премиум-акустическая система с 16 динамиками, сабвуфером и 15-канальным усилителем на 705 Вт.',
  },
  {
    code: 'N5D',
    category: 'Интерьер',
    title: 'Кожа Valcona с тиснением S',
    description: 'Спортивные кресла S line с вентиляцией, электрической регулировкой и памятью положений.',
  },
  {
    code: 'PCN',
    category: 'Безопасность',
    title: 'Пакет ассистентов «Tour»',
    description: 'Адаптивный круиз-контроль (ACC) Stop&Go, контроль полосы, распознавание знаков и Audi pre sense front.',
  },
  {
    code: '3FU',
    category: 'Крыша',
    title: 'Панорамная стеклянная крыша',
    description: 'Двухсекционный панорамный люк с электроприводом сдвига/подъема и солнцезащитной шторкой.',
  },
];

export const OemCatalogAndVerdictSection: React.FC<OemCatalogAndVerdictSectionProps> = ({
  prCodes,
  brandName = 'Audi AG',
  isSampleMode = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items: PrCodeItem[] = isSampleMode
    ? DEFAULT_SAMPLE_PR_CODES
    : prCodes && prCodes.length > 0
    ? prCodes
    : DEFAULT_SAMPLE_PR_CODES;

  return (
    <div className="space-y-6">
      
      {/* 1. Factory OEM Configuration (Decoded PR-codes) */}
      <section id="vin-data" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
              Каталог комплектации {brandName} (PR-Коды)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight mt-0.5">
              Заводское оснащение автомобиля
            </h2>
          </div>

          <span className="px-3 py-1 rounded-xl bg-[#eff4ff] font-mono text-xs text-[#0b1c30] font-bold border border-slate-200/60 w-fit">
            Идентификация по VIN расшифрована на 100%
          </span>
        </div>

        {/* 6 PR-Code Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex flex-col justify-between gap-2 hover:bg-[#e5eeff] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs text-[#e11d48] font-black">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#565e74]">
                    {item.category}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0b1c30]">
                  {item.title}
                </div>
                <p className="text-[11px] text-[#565e74] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 2. Final Recommendation & Forensic Verdict Banner */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-l-4 border-[#e11d48] border-y border-r border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48]">
              Заключение аналитической службы VIN-WIN
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#0b1c30]">
              Рекомендация эксперта перед покупкой
            </h3>
            <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
              Автомобиль <strong>юридически безопасен</strong> для сделки (залоги и обременения отсутствуют), однако требует обязательного <strong>торга и углубленной компьютерной диагностики</strong> блоков управления (ECU, коробка передач S tronic) по причине подтвержденной скрутки одометра на <strong>45 000 км</strong> и кузовных ремонтов правой передней четверти на сумму <strong>385 400 ₽</strong>.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-stretch gap-1.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-[#e11d48] hover:bg-[#b80035] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              Заказать выездной осмотр эксперта
            </button>
            <span className="text-center font-mono text-[10px] text-[#565e74]">
              Выезд за 60 минут в СПб и МСК
            </span>
          </div>
        </div>
      </section>

      {/* Modal for Order Expert Inspection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-[#0b1c30]">Выездная диагностика</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#565e74] mb-4">
              Эксперт проведет инструментальный замер толщины ЛКП, компьютерную диагностику дилерским сканером и тест-драйв с фотофиксацией.
            </p>
            <input
              type="text"
              placeholder="+7 (___) ___-__-__"
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
            />
            <button
              onClick={() => {
                alert('Заявка принята! Эксперт свяжется с вами в течение 10 минут.');
                setIsModalOpen(false);
              }}
              className="w-full h-11 rounded-xl bg-[#e11d48] text-white font-bold text-xs hover:bg-[#b80035] transition shadow-md"
            >
              Вызвать эксперта на адрес
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
