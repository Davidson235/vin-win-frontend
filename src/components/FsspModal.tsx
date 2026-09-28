import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Loader2, 
  ShieldAlert
} from 'lucide-react';

interface FsspModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFio?: string;
  initialRegion?: string;
}

export const FsspModal: React.FC<FsspModalProps> = ({
  isOpen,
  onClose,
  initialFio = '',
  initialRegion = '77',
}) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [birthDate, setBirthDate] = useState('15.05.1985');
  const [region, setRegion] = useState(initialRegion || '77');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // При открытии предзаполняем поля из маскированного имени ОСАГО
  useEffect(() => {
    if (initialFio) {
      const parts = initialFio.split(' ').map(p => p.replace('.', ''));
      if (parts[0]) setLastName(parts[0]);
      if (parts[1] && parts[1].length > 1) {
        setFirstName(parts[1]);
      } else if (!firstName) {
        setFirstName('Алексей'); // Стандартный тестовый вариант при маске
      }
      if (parts[2] && parts[2].length > 1) {
        setSecondName(parts[2]);
      } else if (!secondName) {
        setSecondName('Владимирович');
      }
    } else {
      if (!lastName) setLastName('Смирнов');
      if (!firstName) setFirstName('Алексей');
      if (!secondName) setSecondName('Владимирович');
    }
    if (initialRegion) {
      setRegion(initialRegion);
    }
  }, [isOpen, initialFio, initialRegion]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lastName.trim() || !firstName.trim()) {
      setError('Пожалуйста, укажите Фамилию и Имя');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check/fssp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          last_name: lastName.trim(),
          first_name: firstName.trim(),
          second_name: secondName.trim() || undefined,
          birth_date: birthDate.trim() || undefined,
          region: region.trim() || '77',
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка запроса: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('FSSP error:', err);
      setError('Не удалось получить ответ от сервиса ФССП. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                ФССП России · Проверка долгов собственника
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Банк данных исполнительных производств (ст. 6.1 № 229-ФЗ)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Фамилия <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Иванов"
                  required
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Имя <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Иван"
                  required
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Отчество
                </label>
                <input
                  type="text"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  placeholder="Иванович"
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Дата рождения (ДД.ММ.ГГГГ)
                </label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="15.05.1985"
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Код региона РФ
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="77"
                  className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono shadow-2xs"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500 font-sans">
                Совет: укажите «Иванов», чтобы проверить сценарий с долгами и арестом
              </span>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Поиск в ФССП...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Выполнить проверку ФССП</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in">
              {result.has_debts ? (
                /* Warning / Debt Alert */
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold block">
                          Высокий юридический риск
                        </span>
                        <h4 className="text-base font-black text-rose-950">
                          Обнаружены задолженности на сумму {result.total_debt_amount?.toLocaleString('ru-RU')} ₽
                        </h4>
                      </div>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200 font-bold shrink-0">
                      {result.proceedings_count} ИП
                    </span>
                  </div>

                  <p className="text-xs text-rose-900 leading-relaxed font-medium">
                    {result.status_text}
                  </p>

                  {/* List of Proceedings */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
                      Открытые исполнительные производства:
                    </span>
                    {result.proceedings?.map((p: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-rose-200/90 rounded-xl p-3.5 space-y-2 shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            № {p.ip_number}
                          </span>
                          <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            {p.amount?.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">
                          {p.subject}
                        </p>

                        <div className="text-[11px] font-mono text-slate-500 flex flex-wrap justify-between gap-2 pt-1 border-t border-slate-100">
                          <span>{p.bailiff_dept}</span>
                          <span>{p.bailiff_officer}</span>
                        </div>

                        {p.has_restrictive_measure && (
                          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>{p.restriction_details}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Clean Debtor State */
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                        Банк данных ФССП чист
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        Задолженностей и арестов не обнаружено (0 ₽)
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.status_text}
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Исполнительные производства: 0</span>
                    <span className="text-emerald-700 font-bold">Безопасно для сделки</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational / Security Note */}
          {!result && (
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">
                Почему важно проверять долги продавца:
              </span>
              Если у продавца автомобиля имеются непогашенные судебные долги (свыше 10 000 ₽), судебные приставы в любой момент могут наложить запрет на регистрационные действия или объявить автомобиль в исполнительный розыск. Проверка перед подписанием ДКП защищает покупателя от блокировки учета в МРЭО ГИБДД.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>fssp.gov.ru · ФССП России</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer font-bold font-sans"
          >
            Закрыть окно
          </button>
        </div>
      </div>
    </div>
  );
};

