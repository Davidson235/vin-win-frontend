import React, { useState, useEffect } from 'react';
import { Camera, Copy, ExternalLink, X, AlertTriangle, ShieldCheck, Search, Loader2 } from 'lucide-react';

export interface FineRecord {
  uin: string;
  date: string;
  article_koap: string;
  violation_title: string;
  amount: number;
  discount_amount: number;
  discount_valid_until: string | null;
  is_discount_active: boolean;
  location: string;
  camera_name: string;
  department: string;
  photo_url?: string;
  photo_plate_zoom_url?: string;
}

export interface FinesData {
  service: string;
  plate: string;
  sts: string;
  has_fines: boolean;
  total_fines_count: number;
  total_amount: number;
  discount_total: number;
  risk_level: 'CLEAN' | 'WARNING' | 'CRITICAL';
  status_text: string;
  fines: FineRecord[];
}

interface FinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
  initialSts?: string;
  initialData?: FinesData | null;
  onFinesUpdated?: (data: FinesData) => void;
}

export const FinesModal: React.FC<FinesModalProps> = ({
  isOpen,
  onClose,
  initialPlate = '',
  initialSts = '',
  initialData = null,
  onFinesUpdated,
}) => {
  const [plate, setPlate] = useState<string>(initialPlate || '');
  const [sts, setSts] = useState<string>(initialSts || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [finesData, setFinesData] = useState<FinesData | null>(initialData);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copiedUin, setCopiedUin] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlate !== undefined) setPlate(initialPlate);
    if (initialSts !== undefined) setSts(initialSts);
    if (initialData !== undefined) setFinesData(initialData);
  }, [initialPlate, initialSts, initialData]);

  // Закрытие по клавише Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedPhoto, onClose]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!plate.trim() || !sts.trim()) return;

    setLoading(true);
    try {
      const resp = await fetch('/api/check/fines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate: plate.trim(),
          sts: sts.trim(),
        }),
      });
      if (resp.ok) {
        const data: FinesData = await resp.json();
        setFinesData(data);
        onFinesUpdated?.(data);
      }
    } catch (err) {
      console.error('Ошибка проверки штрафов:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUin(text);
    setTimeout(() => setCopiedUin(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка модального окна */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Штрафы ГИБДД, АМПП и МАДИ
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  ЦАФАП
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Постановления с комплексов фиксации («Стрелка-СТ», «АвтоУраган», «Кордон», «ПаркРайт»)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Форма быстрого запроса (Госномер + СТС) */}
        <div className="p-6 bg-slate-50/40 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono text-[11px]">
                Государственный регистрационный знак:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  onFocus={(e) => e.target.select()}
                  placeholder="А123АА777"
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono tracking-wider focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono text-[11px]">
                Свидетельство о регистрации ТС (СТС):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sts}
                  onChange={(e) => setSts(e.target.value.toUpperCase())}
                  onFocus={(e) => e.target.select()}
                  placeholder="77 22 123456"
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono tracking-wider focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !plate.trim() || !sts.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Запрос ЦАФАП...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" />
                  <span>Проверить штрафы</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Контентная область с прокруткой */}
        <div className="p-6 overflow-y-auto space-y-6">
          {finesData ? (
            <>
              {/* Сводка задолженности */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Неоплаченных постановлений:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {finesData.total_fines_count}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">шт.</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Общая сумма задолженности:</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${finesData.total_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {finesData.total_amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80">
                  <span className="text-xs text-rose-900 font-medium block mb-1">К оплате со скидкой 50%:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-rose-700">
                      {finesData.discount_total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Предупреждающий баннер при риске */}
              {finesData.risk_level === 'CRITICAL' && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-xs">
                  <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 mt-0.5 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-950">Критический уровень долговой нагрузки</h4>
                    <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                      Сумма задолженности по штрафам превышает 10 000 ₽ или насчитывает более 5 постановлений. 
                      Существует высокий риск принудительного взыскания ФССП и вынесения постановления о запрете на совершение регистрационных действий!
                    </p>
                  </div>
                </div>
              )}

              {/* Список постановлений */}
              {finesData.fines.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Зафиксированные нарушения с камер:
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                      Всего: {finesData.fines.length}
                    </span>
                  </div>

                  {finesData.fines.map((fine, idx) => (
                    <div 
                      key={fine.uin || idx}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-colors space-y-3 shadow-2xs"
                    >
                      {/* Строка УИН, даты и суммы */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-900 font-bold">
                            УИН: {fine.uin}
                          </span>
                          <button
                            onClick={() => copyToClipboard(fine.uin)}
                            className="text-slate-400 hover:text-slate-700 transition text-[11px] p-1 rounded hover:bg-slate-200/60 cursor-pointer"
                            title="Скопировать УИН"
                          >
                            {copiedUin === fine.uin ? (
                              <span className="text-emerald-700 font-mono text-[10px] font-bold">Скопировано!</span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href="https://www.tbank.ru/fines/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => copyToClipboard(fine.uin)}
                            className="text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md transition flex items-center gap-1"
                            title="Скопировать УИН и перейти к оплате без комиссии в Т-Банке"
                          >
                            <span>Оплатить в Т-Банке</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-500 font-medium">
                            {fine.date}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-black font-mono text-rose-600">
                              {fine.amount} ₽
                            </span>
                            {fine.discount_amount < fine.amount && (
                              <span className="ml-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                {fine.discount_amount} ₽ со скидкой
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Описание нарушения */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <div>
                            <span className="text-xs font-bold text-rose-700 font-mono block">
                              {fine.article_koap}
                            </span>
                            <p className="text-sm text-slate-800 mt-0.5 leading-snug font-medium">
                              {fine.violation_title}
                            </p>
                          </div>

                          <div className="text-xs text-slate-500 space-y-1 pt-1 font-sans">
                            <div className="flex items-start gap-1.5">
                              <span className="font-semibold text-slate-600 shrink-0">Место:</span>
                              <span>{fine.location}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-500">
                              <span className="font-semibold text-slate-600 shrink-0">Камера:</span>
                              <span className="font-mono text-[11px]">{fine.camera_name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Превью снимка с камеры дорожной фиксации */}
                        {fine.photo_url && (
                          <div className="flex flex-col items-center sm:items-end justify-center">
                            <div 
                              onClick={() => setSelectedPhoto(fine.photo_url || null)}
                              className="group relative cursor-pointer rounded-lg overflow-hidden border border-slate-300 bg-slate-900 hover:border-rose-500 transition w-full sm:w-44 h-24 shadow-2xs"
                            >
                              <img 
                                src={fine.photo_url} 
                                alt="Снимок с камеры фиксации" 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-[11px] font-mono text-white">
                                <span>Открыть фото</span>
                              </div>

                              {fine.photo_plate_zoom_url && (
                                <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-mono text-white border border-slate-700">
                                  Госномер
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 text-center sm:text-right">
                              Кадр ЦАФАП ГИБДД
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-950">
                    Неоплаченных штрафов ГИБДД и МАДИ не обнаружено
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    По указанной связке госномера и СТС в базе ЦАФАП нет действующих неоплаченных постановлений. Ограничения на регистрацию по линии штрафов отсутствуют.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Camera className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
              <p className="text-sm text-slate-600 font-medium">Введите госномер и серию/номер СТС для поиска нарушений с дорожных камер</p>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px]">Шлюз ГИС ГМП · ЦАФАП</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-xs cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно полноразмерного просмотра снимка камеры */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-[#0c1017] border border-slate-700 rounded-2xl overflow-hidden p-2">
            <img 
              src={selectedPhoto} 
              alt="Увеличенный кадр нарушения" 
              className="max-w-full max-h-[75vh] object-contain rounded-lg mx-auto"
            />
            <div className="p-3 text-center">
              <span className="text-xs font-mono text-slate-300">
                Кадр автоматической фотофиксации правонарушения ЦАФАП
              </span>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

