import React, { useState, useEffect } from 'react';
import { Shield, User, Building2, X, Search, Loader2, CheckCircle2 } from 'lucide-react';

export interface InsuranceClaim {
  accident_date: string;
  insurer_name: string;
  policy_serial: string;
  policy_number: string;
}

export interface KbmData {
  service: string;
  type: 'FIZ_RESTRICTED' | 'COMPANY' | 'FIZ_NOT_RESTRICTED';
  kbm_done: boolean;
  kbm: string | null;
  claims_count: number;
  claims: InsuranceClaim[];
  risk_level: 'CLEAN' | 'WARNING' | 'CRITICAL';
  status_text: string;
  source: string;
}

interface KbmModalProps {
  isOpen: boolean;
  onClose: () => void;
  vin?: string;
  plate?: string;
}

export const KbmModal: React.FC<KbmModalProps> = ({
  isOpen,
  onClose,
  vin: _vin = '',
  plate: _plate = '',
}) => {
  const [activeTab, setActiveTab] = useState<'driver' | 'company'>('driver');
  
  // Поля водителя
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [dob, setDob] = useState('');
  const [licenseSeries, setLicenseSeries] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Поля компании
  const [inn, setInn] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KbmData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = activeTab === 'driver' ? {
      check_type: 'FIZ_RESTRICTED',
      last_name: lastName.trim(),
      first_name: firstName.trim(),
      second_name: secondName.trim() || undefined,
      dob: dob.trim(),
      license_series: licenseSeries.trim().toUpperCase(),
      license_number: licenseNumber.trim()
    } : {
      check_type: 'COMPANY',
      inn: inn.trim()
    };

    try {
      const resp = await fetch('/api/check/kbm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const data: KbmData = await resp.json();
        setResult(data);
      } else {
        setError(`Ошибка ответа сервера: ${resp.status}`);
      }
    } catch (err: any) {
      setError(`Сбой запроса: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Проверка КБМ и выплат по ДТП
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  РСА / АИС ОСАГО
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Официальный коэффициент бонус-малус водителя и история страховых выплат
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

        {/* Переключатель вкладок: Водитель / Юрлицо */}
        <div className="px-6 pt-3 bg-slate-50/50 border-b border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('driver'); setResult(null); }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'driver'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Водитель (Физическое лицо)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('company'); setResult(null); }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'company'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Компания (Таксопарк / Юрлицо по ИНН)</span>
          </button>
        </div>

        {/* Форма запроса */}
        <div className="p-6 bg-slate-50/30 border-b border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'driver' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Фамилия:</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Имя:</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Отчество (если есть):</label>
                  <input
                    type="text"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                    placeholder="Иванович"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Дата рождения:</label>
                  <input
                    type="text"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="22.06.1990"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Серия ВУ (4 знака):</label>
                  <input
                    type="text"
                    required
                    value={licenseSeries}
                    onChange={(e) => setLicenseSeries(e.target.value.toUpperCase())}
                    placeholder="77АА или 9901"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">Номер ВУ (6 цифр):</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="112233"
                    className="w-full bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">ИНН организации:</label>
                <input
                  type="text"
                  required
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  placeholder="7707083893"
                  className="w-full sm:w-1/2 bg-white border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none shadow-2xs"
                />
                <span className="text-xs text-slate-500 block mt-1.5 font-sans">
                  10 цифр для юридических лиц (таксопарки, каршеринговые компании, лизингодатели)
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Запрос в РСА...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-white" />
                    <span>Рассчитать КБМ и выплаты РСА</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Результаты */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-6">
              {/* Сводка КБМ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Коэффициент бонус-малус (КБМ):</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black font-mono ${
                      result.kbm && parseFloat(result.kbm) < 1.0 ? 'text-emerald-700' :
                      result.kbm && parseFloat(result.kbm) === 1.0 ? 'text-slate-900' : 'text-rose-600'
                    }`}>
                      {result.kbm || 'Не найден'}
                    </span>
                    {result.kbm && (
                      <span className="text-xs text-slate-500 font-medium">
                        {parseFloat(result.kbm) < 1.0 
                          ? `(Скидка ${Math.round((1 - parseFloat(result.kbm)) * 100)}% на ОСАГО)` 
                          : parseFloat(result.kbm) > 1.0 
                          ? `(Надбавка ${Math.round((parseFloat(result.kbm) - 1) * 100)}% за аварии)` 
                          : '(Базовый тариф)'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Страховых выплат по авариям:</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black font-mono ${result.claims_count > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {result.claims_count}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">ДТП</span>
                  </div>
                </div>
              </div>

              {/* Статус */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                result.risk_level === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                result.risk_level === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="text-xs leading-relaxed font-medium">
                  {result.status_text}
                </div>
              </div>

              {/* Таблица страховых выплат (claims) */}
              {result.claims && result.claims.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    История страховых возмещений по ДТП (РСА):
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-slate-100 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Дата ДТП</th>
                          <th className="py-2.5 px-4">Страховщик</th>
                          <th className="py-2.5 px-4">Полис виновника</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {result.claims.map((c, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="py-2.5 px-4 font-mono text-rose-600 font-bold">
                              {c.accident_date}
                            </td>
                            <td className="py-2.5 px-4 font-medium">
                              {c.insurer_name}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-500">
                              {c.policy_serial} {c.policy_number}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Страховых выплат по ДТП не зарегистрировано
                  </h4>
                  <p className="text-xs text-slate-600">
                    Водитель или компания не имеют зарегистрированных выплат потерпевшим по договорам ОСАГО.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Shield className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
              <p className="text-sm text-slate-600 font-medium">Заполните данные водителя или ИНН компании для расчёта официального КБМ и проверки выплат по ДТП</p>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px]">Шлюз РСА КБМ активен</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-xs cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

