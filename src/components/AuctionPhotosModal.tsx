import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AuctionPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionData: any;
}

export const AuctionPhotosModal: React.FC<AuctionPhotosModalProps> = ({
  isOpen,
  onClose,
  auctionData,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen || !auctionData) return null;

  const photos = auctionData.photos && auctionData.photos.length > 0
    ? auctionData.photos
    : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1400&auto=format&fit=crop',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101522]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  {auctionData.auction_name || 'Страховой аукцион Copart / IAAI'}
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-bold">
                  Total Loss
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Лот № {auctionData.lot_number || '58491024'} · Продажа: {auctionData.sale_date || 'Архив'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Inspection Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#131826] border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[11px] font-mono uppercase">Основной удар</span>
              <span className="text-rose-400 text-sm font-black font-mono block truncate mt-0.5" title={auctionData.primary_damage}>
                {auctionData.primary_damage || 'Front End'}
              </span>
            </div>

            <div className="bg-[#131826] border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[11px] font-mono uppercase">Статус документа</span>
              <span className="text-white text-sm font-bold font-mono block truncate mt-0.5" title={auctionData.title_status}>
                {auctionData.title_status || 'Salvage Certificate'}
              </span>
            </div>

            <div className="bg-[#131826] border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[11px] font-mono uppercase">Пробег при ДТП</span>
              <span className="text-white text-sm font-bold font-mono mt-0.5 block">
                {auctionData.odometer_at_sale ? `${auctionData.odometer_at_sale.toLocaleString()} миль` : '42 100 миль'}
              </span>
            </div>

            <div className="bg-[#131826] border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[11px] font-mono uppercase">Финальная ставка</span>
              <span className="text-emerald-400 text-sm font-black font-mono mt-0.5 block">
                {auctionData.final_bid_usd ? `$${auctionData.final_bid_usd.toLocaleString()}` : '$11 400'}
              </span>
            </div>
          </div>

          {/* Active Photo Viewer */}
          <div className="space-y-3">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center group shadow-inner">
              <img
                src={photos[selectedPhotoIndex]}
                alt={`Повреждения лота ${selectedPhotoIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-md text-[11px] font-mono text-slate-200">
                Фото {selectedPhotoIndex + 1} из {photos.length} · Состояние до ремонта
              </div>
              <div className="absolute bottom-3 right-3 bg-rose-950/85 backdrop-blur-md border border-rose-800/60 px-3 py-1 rounded-md text-[11px] font-mono text-rose-200 flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Архив страховой компании {auctionData.seller || 'США'}</span>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {photos.map((url: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx
                      ? 'border-rose-500 scale-105 shadow-md shadow-rose-950/50'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img src={url} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Expert Automotive Warning */}
          <div className="bg-[#1c1217] border border-rose-900/60 rounded-xl p-4 text-xs text-rose-200 leading-relaxed space-y-1 shadow-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Рекомендация эксперта-криминалиста перед покупкой:</span>
            </div>
            <p className="text-rose-200/90">
              Данный автомобиль был признан в США/Европе конструктивно погибшим (<span className="text-white font-semibold">Total Loss</span>) с выдачей сертификата <span className="text-white font-semibold">Salvage</span>. После этого машина была выкуплена, ввезена в РФ и восстановлена. 
              Обязательно проверьте геометрию кузова на лазерном стапеле, целостность силовых лонжеронов и фактическое наличие физических подушек безопасности SRS (вместо установленных резисторов-обманок).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101522] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>bid.cars · copart.com · Международные аукционы</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Закрыть окно
          </button>
        </div>
      </div>
    </div>
  );
};

