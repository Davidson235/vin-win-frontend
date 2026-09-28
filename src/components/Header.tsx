import React, { useState, useEffect } from 'react';
import { Search, Loader2, Printer, X, ArrowLeft, Menu } from 'lucide-react';

interface HeaderProps {
  onSearch: (vin: string, plate: string) => void;
  isLoading: boolean;
  currentVin?: string;
  currentPlate?: string;
  onGoHome?: () => void;
  onLoadSampleReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  isLoading,
  currentVin,
  currentPlate,
  onGoHome,
  onLoadSampleReport,
}) => {
  const [vin, setVin] = useState(currentVin ?? '');
  const [plate, setPlate] = useState(currentPlate ?? '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentVin !== undefined && currentVin !== vin) {
      setVin(currentVin);
    }
  }, [currentVin]);

  useEffect(() => {
    if (currentPlate !== undefined && currentPlate !== plate) {
      setPlate(currentPlate);
    }
  }, [currentPlate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = vin.trim();
    const isUrl = rawVal.startsWith('http://') || rawVal.startsWith('https://') || rawVal.includes('auto.ru') || rawVal.includes('avito.ru') || rawVal.includes('drom.ru');
    const cleanVin = isUrl ? rawVal : rawVal.toUpperCase();
    const cleanPlate = plate.trim().toUpperCase();
    if (cleanVin || cleanPlate) {
      onSearch(cleanVin, cleanPlate);
    }
  };

  const isReportActive = Boolean(currentVin || currentPlate);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.06)] border-b border-slate-200/70 transition-all print-hidden">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand & Telemetry Badge */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <div
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="На главную"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 group-hover:from-rose-600 group-hover:to-red-700 flex items-center justify-center text-white shadow-md shadow-rose-600/25 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight uppercase">
                VIN<span className="text-[#e11d48]">-</span>WIN
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
                Автомобильная Экспертиза
              </span>
            </div>
          </div>

          {/* Live API Telemetry Chip from Stitch */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-[11px] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">API Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">2.4 ms</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links from Stitch */}
        {!isReportActive ? (
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-semibold text-slate-600">
            <button
              onClick={onGoHome}
              className="text-[#e11d48] font-bold hover:text-rose-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Проверка авто
            </button>
            <button
              onClick={onLoadSampleReport}
              className="hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <span>Пример отчета</span>
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-full font-bold">
                Audi A6
              </span>
            </button>
            <a
              href="#databases"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Базы данных (ГИБДД, Нотариат, ЕАИСТО)
            </a>
            <a
              href="#b2b"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Партнерам / B2B
            </a>
            <a
              href="#tariffs"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Тарифы
            </a>
          </nav>
        ) : (
          /* Report View: Quick Search Bar */
          <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xl mx-4">
            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/90 px-3 py-2 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>К поиску</span>
              </button>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="VIN / Госномер"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 focus:border-[#e11d48] uppercase shadow-2xs"
                />
                {vin && (
                  <button
                    type="button"
                    onClick={() => setVin('')}
                    aria-label="Очистить поле ввода"
                    title="Очистить поле ввода"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Поиск</span>
              </button>
            </form>
          </div>
        )}

        {/* Right Action Tools: 42 Bases Chip + Login + Print */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider shadow-2xs">
            <span className="material-symbols-outlined text-[#e11d48] text-[18px]">verified</span>
            <span>42 базы онлайн</span>
          </div>

          {/* Quick PDF Print button */}
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Распечатать отчет или сохранить в PDF"
            className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs shadow-2xs transition cursor-pointer"
            title="Распечатать / PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Печать</span>
          </button>

          {/* User Cabin CTA */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e11d48] text-white font-bold text-xs hover:bg-[#be123c] shadow-md shadow-rose-600/20 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span className="hidden sm:inline">Кабинет</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть мобильное навигационное меню"
            title="Открыть навигационное меню"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-sm font-semibold text-slate-700 shadow-lg">
          <button
            onClick={() => {
              onGoHome?.();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 text-[#e11d48] font-bold"
          >
            Проверка авто
          </button>
          <button
            onClick={() => {
              onLoadSampleReport?.();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 flex items-center justify-between"
          >
            <span>Пример отчета (Audi A6)</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">Демо</span>
          </button>
          <div className="py-1 text-xs text-slate-500 border-t border-slate-100">
            Базы данных: ГИБДД, ФНП Залоги, ЕАИСТО, НСИС ОСАГО, ФССП
          </div>
        </div>
      )}
    </header>
  );
};
