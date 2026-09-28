import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, Wrench, Camera, ZoomIn } from 'lucide-react';
import type { ZoneDamageInfo } from './CarBodySvg';

interface PhotoBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneInfo: ZoneDamageInfo | null;
  photos: string[];
}

export const PhotoBinderModal: React.FC<PhotoBinderModalProps> = ({
  isOpen,
  onClose,
  zoneInfo,
  photos = [],
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    setActivePhotoIdx(0);
    setIsZoomed(false);
  }, [zoneInfo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && photos.length > 1) {
        setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      } else if (e.key === 'ArrowRight' && photos.length > 1) {
        setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, photos.length, onClose]);

  if (!isOpen || !zoneInfo) return null;

  const isDamaged = zoneInfo.severity !== 'undamaged';
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[activePhotoIdx] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                zoneInfo.severity === 'severe'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : zoneInfo.severity === 'minor'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isDamaged ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{zoneInfo.name}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-2xs ${
                    zoneInfo.severity === 'severe'
                      ? 'bg-rose-100 text-rose-900 border border-rose-200'
                      : zoneInfo.severity === 'minor'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {zoneInfo.severity === 'severe'
                    ? 'Замена / Деформация'
                    : zoneInfo.severity === 'minor'
                    ? 'Ремонт / Окрас'
                    : 'Заводское состояние'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Интерактивный фотоархив и привязка повреждений кузова
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. БЛОК СТАТУСА ПОВРЕЖДЕНИЙ */}
          {isDamaged ? (
            <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                <Wrench className="w-4 h-4 text-rose-600" />
                Зафиксированные дефекты и калькуляции ремонта:
              </div>

              {zoneInfo.accidentDates && zoneInfo.accidentDates.length > 0 && (
                <div className="text-xs text-rose-950">
                  <span className="font-semibold text-slate-700">Даты происшествий: </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-rose-200 font-mono font-bold text-rose-900">
                    {zoneInfo.accidentDates.join(', ')}
                  </span>
                </div>
              )}

              {zoneInfo.defectDescriptions && zoneInfo.defectDescriptions.length > 0 && (
                <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-rose-200/80 space-y-1">
                  <div className="font-bold text-slate-900">Описание повреждений из баз ГИБДД:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {zoneInfo.defectDescriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {zoneInfo.repairOperations && zoneInfo.repairOperations.length > 0 && (
                <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-rose-200/80 space-y-1">
                  <div className="font-bold text-slate-900">
                    Страховые работы и заменяемые детали (Audatex / Автотека):
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {zoneInfo.repairOperations.map((op, i) => (
                      <span
                        key={i}
                        className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-200 font-medium font-mono text-[11px]"
                      >
                        {op}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {zoneInfo.estimateAmount ? (
                <div className="text-xs text-rose-950 font-black">
                  Ориентировочная сумма расчёта ремонта: <span className="font-mono text-sm">{zoneInfo.estimateAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Элемент не повреждён:</span> В базах Госавтоинспекции РФ,
                страховых смет Audatex и архивах объявлений сведений об авариях или окрасах данной
                детали не обнаружено.
              </div>
            </div>
          )}

          {/* 2. ФОТОАРХИВ АВТОМОБИЛЯ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Camera className="w-4 h-4 text-rose-600" />
                Архивные фотографии автомобиля
                {hasPhotos && (
                  <span className="text-xs text-slate-500 font-normal">
                    (найдено снимков: {photos.length})
                  </span>
                )}
              </div>
              {hasPhotos && (
                <span className="text-xs text-slate-500 font-mono font-bold">
                  {activePhotoIdx + 1} / {photos.length}
                </span>
              )}
            </div>

            {hasPhotos ? (
              <div className="space-y-3">
                {/* Main Viewport */}
                <div className="relative aspect-video max-h-[380px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center group border border-slate-800">
                  <img
                    src={currentPhoto || ''}
                    alt={`Фото автомобиля ${activePhotoIdx + 1}`}
                    className="max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300"
                    onClick={() => setIsZoomed(true)}
                  />

                  {/* Navigation Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-80 hover:opacity-100 hover:bg-black/90 transition-all cursor-pointer"
                        title="Предыдущее фото"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-80 hover:opacity-100 hover:bg-black/90 transition-all cursor-pointer"
                        title="Следующее фото"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Zoom hint */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] rounded-md flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" /> Кликните для зума
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {photos.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          idx === activePhotoIdx
                            ? 'border-rose-600 ring-2 ring-rose-200'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-2">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  В открытых фотоархивах (Номерограм, классифайды) снимки данного автомобиля не обнаружены.
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  В соответствии с Zero Mock Data Policy синтетические изображения исключены.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">База повреждений VIN-WIN</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Lightbox */}
      {isZoomed && currentPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/92 flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentPhoto}
            alt="Увеличенный снимок повреждения"
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

