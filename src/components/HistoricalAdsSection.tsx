import React, { useState } from 'react';
import { ExternalLink, Tag, CheckCircle, Archive } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';

interface AdItem {
  id?: string;
  platform?: string;
  source?: string;
  source_badge_class?: string;
  sourceBadgeClass?: string;
  date?: string;
  city?: string;
  title?: string;
  price?: number;
  price_rub?: number;
  mileage?: number;
  mileage_km?: number;
  year?: number;
  url?: string;
  is_sold?: boolean;
  photos?: string[];
}

interface HistoricalAdsSectionProps {
  specs?: any;
  classifiedsData?: any;
}

export const HistoricalAdsSection: React.FC<HistoricalAdsSectionProps> = ({ specs, classifiedsData }) => {
  const [showAll, setShowAll] = useState(false);

  const rawAds: any[] = Array.isArray(classifiedsData?.ads)
    ? classifiedsData.ads
    : Array.isArray(specs?.ads)
      ? specs.ads
      : [];

  const ads: AdItem[] = rawAds.map((item, idx) => ({
    id: item.id || `ad_${idx}`,
    platform: item.platform || 'Классифайд',
    source: item.source || item.platform || 'Объявление',
    source_badge_class: item.source_badge_class || item.sourceBadgeClass || 'bg-gray-100 text-gray-700 border-gray-200',
    date: item.date || '—',
    city: item.city || 'РФ',
    title: item.title || 'Автомобиль в продаже',
    price: item.price_rub ?? item.price ?? 0,
    price_rub: item.price_rub ?? item.price ?? 0,
    mileage: item.mileage_km ?? item.mileage,
    mileage_km: item.mileage_km ?? item.mileage,
    year: item.year,
    url: item.url,
    is_sold: Boolean(item.is_sold),
    photos: Array.isArray(item.photos) ? item.photos : [],
  }));

  const displayedAds = showAll ? ads : ads.slice(0, 3);

  return (
    <section id="offerlist" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Найденные объявления
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Архив размещения автомобиля на классифайдах (Auto.ru, Avito, Drom) с историей изменения цен и пробегов
          </p>
        </div>
        <div>
          {ads.length > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              Найдено публикаций: {ads.length}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              0 публикаций
            </div>
          )}
        </div>
      </div>

      {ads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedAds.map((ad, idx) => {
              const mainPhoto = ad.photos && ad.photos.length > 0 ? ad.photos[0] : null;

              return (
                <div
                  key={ad.id || idx}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between transition duration-150 hover:border-slate-300 shadow-xs relative overflow-hidden"
                >
                  {/* Photo Preview if available */}
                  {mainPhoto && (
                    <div className="mb-3.5 -mx-5 -mt-5 h-36 bg-slate-200 relative overflow-hidden">
                      <img
                        src={mainPhoto}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {ad.is_sold && (
                        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Archive className="w-3 h-3 text-amber-400" /> В архиве
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400">№{idx + 1}</span>
                      <span className="text-xs font-bold bg-white border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-mono shadow-2xs">
                        {ad.date}
                      </span>
                      <span className="text-xs font-bold text-slate-700 uppercase">{ad.city}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-2 mb-3 line-clamp-2 leading-snug">
                      {ad.title}
                    </h3>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Источник:</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold border text-[11px] shadow-2xs ${ad.source_badge_class}`}>
                          {ad.source}
                        </span>
                      </div>

                      {ad.mileage != null && ad.mileage > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Пробег в объявлении:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {ad.mileage.toLocaleString('ru-RU')} км
                          </span>
                        </div>
                      )}

                      {ad.year && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Год выпуска:</span>
                          <span className="font-medium text-slate-800 font-mono">{ad.year} г.</span>
                        </div>
                      )}

                      {ad.is_sold && !mainPhoto && (
                        <div className="flex items-center justify-between text-amber-800 font-semibold">
                          <span className="text-slate-400">Статус:</span>
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px]">
                            <CheckCircle className="w-3 h-3 text-amber-600" /> Автомобиль продан
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Цена в объявлении</div>
                      <div className="text-lg font-black text-slate-900 font-mono">
                        {ad.price && ad.price > 0 ? `${ad.price.toLocaleString('ru-RU')} ₽` : 'Цена не указана'}
                      </div>
                    </div>

                    {ad.url && (
                      <a
                        href={ad.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        Открыть <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {ads.length > 3 && (
            <div className="mt-5 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200/90 hover:border-slate-300 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                {showAll ? 'Свернуть' : `Показать все (${ads.length})`}
              </button>
            </div>
          )}

          <AiConclusionBox
            text="История размещения на классифайдах проверена. Пробег и цены в объявлениях сопоставлены с данными техосмотров и реестров."
          />
        </>
      ) : (
        <>
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed shadow-xs">
            <p className="font-bold text-slate-900 mb-1.5">
              Объявлений о продаже данного автомобиля на классифайдах не обнаружено
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Поиск по открытым архивам Auto.ru, Avito и Drom осуществляется по совпадению VIN-номера или государственного регистрационного знака. Записей о продаже автомобиля с указанными данными в открытом доступе не зафиксировано.
            </p>
          </div>

          <AiConclusionBox
            text="Автомобиль не размещался на открытых досках объявлений либо продается без публикации открытого идентификатора."
          />
        </>
      )}
    </section>
  );
};
