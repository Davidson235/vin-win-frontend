import React from 'react';
import { TrendingUp, Layers } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface MarketOffersSectionProps {
  specs?: any;
}

export const MarketOffersSection: React.FC<MarketOffersSectionProps> = ({ specs }) => {
  const hasRealPrices = Boolean(specs?.market_prices?.avg_price || specs?.min_price);
  const minPrice = specs?.market_prices?.min_price || specs?.min_price;
  const avgPrice = specs?.market_prices?.avg_price || specs?.avg_price;
  const maxPrice = specs?.market_prices?.max_price || specs?.max_price;
  const currentPrice = specs?.market_prices?.current_price || specs?.current_price;

  const positionPercent = minPrice && maxPrice && currentPrice && maxPrice > minPrice
    ? Math.min(100, Math.max(0, ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100))
    : 50;

  const carTitle = `${specs?.make || ''} ${specs?.model || ''} ${specs?.year ? specs.year + ' г.' : ''}`.trim() || 'автомобиля';

  return (
    <section id="offers" className="report-card p-6 mb-8 bg-white/95 border border-slate-200/80 rounded-2xl shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Оценка рыночной стоимости
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              Классифайды РФ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Аналитика предложений вторичного рынка на основе реальных объявлений без синтетических симуляций
          </p>
        </div>
        <div>
          {hasRealPrices ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Рыночная цена в норме
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Требуется выборка объявлений
            </div>
          )}
        </div>
      </div>

      {hasRealPrices ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Минимальная цена</span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {minPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 text-center shadow-sm">
              <span className="text-xs text-rose-800 uppercase tracking-wider font-bold block mb-1">Средняя по рынку</span>
              <div className="text-2xl font-black text-rose-950 font-mono">
                {avgPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Максимальная цена</span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {maxPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {/* Visual Slider Bar */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 mb-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold font-mono">
              <span>{minPrice.toLocaleString('ru-RU')} ₽</span>
              <span className="text-rose-600 font-black">Средняя: {avgPrice.toLocaleString('ru-RU')} ₽</span>
              <span>{maxPrice.toLocaleString('ru-RU')} ₽</span>
            </div>

            <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 shadow-inner">
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${positionPercent}%` }}
              >
                <div className="w-5 h-5 bg-white border-2 border-rose-600 rounded-full shadow-md"></div>
              </div>
            </div>

            {currentPrice && (
              <div className="text-center pt-2 text-xs text-slate-600 font-medium">
                Текущая заявленная стоимость: <span className="font-bold text-slate-900 font-mono">{currentPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
          </div>

          <AiConclusionBox
            text={`Среднерыночная стоимость аналогичных автомобилей ${carTitle} с учётом года выпуска составляет ~${avgPrice.toLocaleString('ru-RU')} ₽.`}
          />
        </>
      ) : (
        <>
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 text-sm text-slate-600 leading-relaxed space-y-3">
            <p className="font-bold text-slate-900">
              Для расчёта рыночной стоимости требуется достаточная выборка активных объявлений
            </p>
            <p className="text-xs text-slate-500">
              В соответствии с Zero Mock Data Policy мы не выдумываем искусственные оценки. Точная среднерыночная цена для {carTitle} рассчитывается на основе фактически размещенных предложений на вторичном рынке в аналогичной комплектации и регионе.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-rose-600 font-bold block mb-1 font-mono text-[11px]">ШАГ 1</span>
                <span className="font-semibold text-slate-800">Поиск предложений в регионе</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-rose-600 font-bold block mb-1 font-mono text-[11px]">ШАГ 2</span>
                <span className="font-semibold text-slate-800">Фильтрация по пробегу и ДТП</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-rose-600 font-bold block mb-1 font-mono text-[11px]">ШАГ 3</span>
                <span className="font-semibold text-slate-800">Калибровка цены торга</span>
              </div>
            </div>
          </div>

          <AiConclusionBox
            text={`Для объективной оценки стоимости ${carTitle} рекомендуем сопоставить запрашиваемую продавцом цену с актуальными предложениями на Auto.ru и Avito в вашем регионе с учетом реального состояния кузова и подтвержденного пробега.`}
          />
        </>
      )}
    </section>
  );
};

