import React, { useState, useRef } from 'react';

interface StartScreenProps {
  onStartSearch: (vin: string, plate: string) => void;
  initialVin?: string;
  initialPlate?: string;
  onLoadSampleReport?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartSearch,
  initialVin = '',
  initialPlate = '',
  onLoadSampleReport,
}) => {
  const [searchMode, setSearchMode] = useState<'vin' | 'plate' | 'frame'>('vin');
  const [vin, setVin] = useState(initialVin);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Russian plate decomposed fields for pixel-perfect GOST styling
  const initialPlateClean = initialPlate.toUpperCase().replace(/\s+/g, '');
  const initialMatch = initialPlateClean.match(/^([А-ЯA-Z]{1})(\d{3})([А-ЯA-Z]{2})(\d{2,3})$/);

  const [plateSeriesStart, setPlateSeriesStart] = useState(initialMatch ? initialMatch[1] : 'О');
  const [plateDigits, setPlateDigits] = useState(initialMatch ? initialMatch[2] : '777');
  const [plateSeriesEnd, setPlateSeriesEnd] = useState(initialMatch ? initialMatch[3] : 'ОО');
  const [plateRegion, setPlateRegion] = useState(initialMatch ? initialMatch[4] : '777');

  const [frameNumber, setFrameNumber] = useState('');

  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'vin') {
      const rawVal = vin.trim();
      const isUrl = rawVal.startsWith('http://') || rawVal.startsWith('https://') || rawVal.includes('auto.ru') || rawVal.includes('avito.ru') || rawVal.includes('drom.ru');
      const cleanVin = isUrl ? rawVal : rawVal.toUpperCase();
      if (cleanVin) onStartSearch(cleanVin, '');
    } else if (searchMode === 'plate') {
      const fullPlate = `${plateSeriesStart}${plateDigits}${plateSeriesEnd}${plateRegion}`.toUpperCase().trim();
      if (fullPlate) onStartSearch('', fullPlate);
    } else if (searchMode === 'frame') {
      const cleanFrame = frameNumber.trim().toUpperCase();
      if (cleanFrame) onStartSearch(cleanFrame, '');
    }
  };

  const handleQuickSample = (sampleVin: string, samplePlate: string) => {
    if (sampleVin) {
      setSearchMode('vin');
      setVin(sampleVin);
      onStartSearch(sampleVin, '');
    } else if (samplePlate) {
      setSearchMode('plate');
      onStartSearch('', samplePlate);
    }
  };

  const handleApplyPreset = (code: string) => {
    setSearchMode('vin');
    setVin(code);
    onStartSearch(code, '');
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const scrollToDatabases = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('official-databases');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#e11d48] selection:text-white relative">
      
      {/* 1. FIXED TOP HEADER (Stitch Screen 1) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.06)] border-b border-slate-200/70">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Live Telemetry Badge */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              type="button"
              onClick={scrollToSearch}
              className="flex items-center gap-2 cursor-pointer group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#e11d48] flex items-center justify-center text-white shadow-md shadow-rose-600/30 font-black text-sm tracking-wider group-hover:scale-105 transition-transform">
                VW
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0b1c30] uppercase">
                VIN<span className="text-[#e11d48]">-</span>WIN
              </span>
            </button>

            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] text-slate-600 font-mono text-xs border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-[#00845a] animate-pulse"></span>
              <span>API Active • 2.4 ms</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button
              type="button"
              onClick={scrollToSearch}
              className="text-[#e11d48] font-bold text-sm tracking-wide cursor-pointer transition-colors"
            >
              Проверка авто
            </button>
            {onLoadSampleReport && (
              <button
                type="button"
                onClick={onLoadSampleReport}
                className="text-slate-600 hover:text-[#0b1c30] font-semibold text-sm transition-colors cursor-pointer"
              >
                Пример отчета
              </button>
            )}
            <a
              href="#tariffs"
              onClick={(e) => { e.preventDefault(); scrollToSearch(); }}
              className="text-slate-600 hover:text-[#0b1c30] font-medium text-sm transition-colors"
            >
              Тарифы
            </a>
            <a
              href="#b2b"
              onClick={(e) => { e.preventDefault(); scrollToSearch(); }}
              className="text-slate-600 hover:text-[#0b1c30] font-medium text-sm transition-colors"
            >
              Партнерам / B2B
            </a>
            <a
              href="#official-databases"
              onClick={scrollToDatabases}
              className="text-slate-600 hover:text-[#0b1c30] font-medium text-sm transition-colors"
            >
              Базы данных (ГИБДД, Нотариат, ЕАИСТО)
            </a>
          </nav>

          {/* Right Header Badges and CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[11px] font-bold uppercase tracking-wider border border-slate-200/60">
              <span className="material-symbols-outlined text-[#e11d48] text-[16px]">verified</span>
              <span>42 базы онлайн</span>
            </div>

            <button
              type="button"
              onClick={scrollToSearch}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e11d48] text-white text-xs sm:text-sm font-bold hover:bg-[#b80035] shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span className="hidden sm:inline">Войти в кабинет</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-[#b80035] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-[#f8f9ff] flex-1">
        
        {/* 2. HERO & SEARCH HUB SECTION */}
        <div className="relative w-full overflow-hidden">
          
          {/* Atmospheric Glow Layer (Porsche Digital Cockpit aesthetic) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-b from-[#e11d48]/10 via-[#e5eeff]/40 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
            
            {/* Top Micro Status Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200/80">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00845a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00845a]"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">
                  Проверка истории автомобиля по 42 официальным базам
                </span>
                <span className="text-slate-400 font-mono text-[11px] pl-1 font-semibold">LIVE 2.4 ms</span>
              </div>
            </div>

            {/* Main Headline & Subhead */}
            <div className="text-center max-w-4xl mx-auto mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-black text-[#0b1c30] tracking-tight leading-[1.12] mb-4">
                Узнайте полную историю автомобиля перед покупкой{' '}
                <span className="text-[#e11d48]">за 60 секунд</span>
              </h1>
              <p className="text-sm sm:text-base text-[#565e74] max-w-2xl mx-auto leading-relaxed">
                Комплексный криминалистический аудит: поиск скрытых ДТП, реального пробега, залогов в 128 банках, работы в такси и расчетов страховых ремонтов по стандартам автоподбора.
              </p>
            </div>

            {/* Core Search Panel (Apple / Stripe Card Refinement) */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 transition-all duration-300">
                
                {/* Mode Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#eff4ff] rounded-xl mb-4 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setSearchMode('vin')}
                    className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      searchMode === 'vin'
                        ? 'bg-white text-[#0b1c30] shadow-sm border border-slate-200/60'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${searchMode === 'vin' ? 'text-[#e11d48]' : 'text-[#565e74]'}`}>
                      fingerprint
                    </span>
                    <span>VIN-код (17 знаков)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchMode('plate')}
                    className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      searchMode === 'plate'
                        ? 'bg-white text-[#0b1c30] shadow-sm border border-slate-200/60'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${searchMode === 'plate' ? 'text-[#e11d48]' : 'text-[#565e74]'}`}>
                      directions_car
                    </span>
                    <span>Госномер РФ (ГОСТ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchMode('frame')}
                    className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      searchMode === 'frame'
                        ? 'bg-white text-[#0b1c30] shadow-sm border border-slate-200/60'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${searchMode === 'frame' ? 'text-[#e11d48]' : 'text-[#565e74]'}`}>
                      build_circle
                    </span>
                    <span>Номер кузова (Frame)</span>
                  </button>
                </div>

                {/* Input Block & CTA Button */}
                <form onSubmit={handleVinSubmit} className="space-y-4">
                  <div className="flex flex-col md:flex-row items-stretch gap-3">
                    
                    {/* Left Form Field Container */}
                    <div className="relative flex-1">
                      
                      {/* Standard VIN Input */}
                      {searchMode === 'vin' && (
                        <div className="w-full h-14 bg-white rounded-xl border border-slate-300 flex items-center px-4 shadow-xs focus-within:border-[#e11d48] focus-within:ring-4 focus-within:ring-[#e11d48]/10 transition-all">
                          <span className="material-symbols-outlined text-[#565e74] mr-2.5 text-[22px]">search</span>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            placeholder="WAUZZZ4G1FA123456"
                            maxLength={17}
                            spellCheck={false}
                            autoComplete="off"
                            className="w-full bg-transparent font-mono text-base font-bold text-[#0b1c30] uppercase placeholder:text-[#565e74]/60 focus:outline-none tracking-wider"
                          />
                          {vin && (
                            <button
                              type="button"
                              onClick={() => setVin('')}
                              className="text-[#565e74] hover:text-[#0b1c30] p-1"
                              title="Очистить"
                            >
                              <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* GOST Russian License Plate Input Replica from Stitch */}
                      {searchMode === 'plate' && (
                        <div className="w-full h-14 bg-white rounded-xl border border-slate-300 flex items-center px-3 shadow-xs focus-within:border-[#e11d48] focus-within:ring-4 focus-within:ring-[#e11d48]/10 transition-all justify-between">
                          <div className="flex items-center gap-2 font-mono">
                            <input
                              type="text"
                              maxLength={1}
                              value={plateSeriesStart}
                              onChange={(e) => setPlateSeriesStart(e.target.value.toUpperCase())}
                              className="w-8 text-center text-lg font-black uppercase text-[#0b1c30] bg-[#eff4ff] rounded-md py-1 focus:outline-none"
                            />
                            <input
                              type="text"
                              maxLength={3}
                              value={plateDigits}
                              onChange={(e) => setPlateDigits(e.target.value)}
                              placeholder="777"
                              className="w-16 text-center text-lg font-black text-[#0b1c30] bg-[#eff4ff] rounded-md py-1 focus:outline-none"
                            />
                            <input
                              type="text"
                              maxLength={2}
                              value={plateSeriesEnd}
                              onChange={(e) => setPlateSeriesEnd(e.target.value.toUpperCase())}
                              className="w-12 text-center text-lg font-black uppercase text-[#0b1c30] bg-[#eff4ff] rounded-md py-1 focus:outline-none"
                            />
                          </div>

                          {/* Region and Russian Tricolor Partition */}
                          <div className="flex items-center gap-2 pl-3 border-l-2 border-slate-200">
                            <input
                              type="text"
                              maxLength={3}
                              value={plateRegion}
                              onChange={(e) => setPlateRegion(e.target.value)}
                              placeholder="777"
                              className="w-12 text-center font-mono text-base font-black text-[#0b1c30] bg-[#eff4ff] rounded-md py-1 focus:outline-none"
                            />
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black leading-tight text-[#0b1c30]">RUS</span>
                              <div className="w-4 h-2.5 rounded-[1px] overflow-hidden flex flex-col border border-slate-400">
                                <span className="h-1/3 bg-white w-full"></span>
                                <span className="h-1/3 bg-[#0039A6] w-full"></span>
                                <span className="h-1/3 bg-[#e11d48] w-full"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Frame Number Input */}
                      {searchMode === 'frame' && (
                        <div className="w-full h-14 bg-white rounded-xl border border-slate-300 flex items-center px-4 shadow-xs focus-within:border-[#e11d48] focus-within:ring-4 focus-within:ring-[#e11d48]/10 transition-all">
                          <span className="material-symbols-outlined text-[#565e74] mr-2.5 text-[22px]">build_circle</span>
                          <input
                            type="text"
                            value={frameNumber}
                            onChange={(e) => setFrameNumber(e.target.value)}
                            placeholder="JZS161-0024910"
                            maxLength={20}
                            className="w-full bg-transparent font-mono text-base font-bold text-[#0b1c30] uppercase placeholder:text-[#565e74]/60 focus:outline-none tracking-wider"
                          />
                        </div>
                      )}

                    </div>

                    {/* Main Carmine Launch Button */}
                    <button
                      type="submit"
                      className="h-14 px-8 bg-[#e11d48] hover:bg-[#b80035] text-white font-bold text-base rounded-xl shadow-lg shadow-rose-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-[0.98]"
                    >
                      <span>Проверить автомобиль</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Sub-input Meta & Quick Sample Paste */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs text-[#565e74]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <span className="material-symbols-outlined text-[#00845a] text-[16px]">verified</span>
                        Мгновенный опрос ГИБДД, ФНП и РСА
                      </span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-slate-400 text-[16px]">lock</span>
                        100% анонимно
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickSample('WAUZZZ4G8EN054129', '')}
                      className="font-mono text-xs font-bold text-[#e11d48] hover:text-[#b80035] transition-colors flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-1 rounded"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_paste</span>
                      <span>Вставить пример: WAUZZZ4G8EN...</span>
                    </button>
                  </div>
                </form>

              </div>

              {/* Section 3: Popular Quick Audit Presets (from Stitch Screen 1) */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-[#565e74] mr-1">Готовые аудиты:</span>

                {onLoadSampleReport && (
                  <button
                    type="button"
                    onClick={onLoadSampleReport}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200/90 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 text-xs text-rose-700 font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse"></span>
                    <span>Audi A6 2020 (Эталонный отчет Stitch: ДТП, скрутка, Audatex)</span>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => handleApplyPreset('X4XCR610800P54911')}
                  className="px-3 py-1.5 rounded-lg bg-white shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex items-center gap-1.5 text-xs text-[#0b1c30] hover:text-[#e11d48] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00845a]"></span>
                  <span className="font-medium">BMW X5 2021 (Чистая история)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('XW7BF4FK00S129481')}
                  className="px-3 py-1.5 rounded-lg bg-white shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex items-center gap-1.5 text-xs text-[#0b1c30] hover:text-[#e11d48] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                  <span className="font-medium">Toyota Camry 2019 (Скручен пробег)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('WDD2130421A883912')}
                  className="px-3 py-1.5 rounded-lg bg-white shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex items-center gap-1.5 text-xs text-[#0b1c30] hover:text-[#e11d48] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                  <span className="font-medium">Mercedes E-Class (Залог в банке)</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 3. TELEMETRY LIVE TICKER BAR (Institutional Precision) */}
        <div className="w-full bg-[#eff4ff] py-3 border-y border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#0b1c30]">
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#00845a]">query_stats</span>
                <span className="text-[#565e74]">Проверено сегодня:</span>
                <span className="font-mono font-bold text-[#0b1c30]">14 820 авто</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#e11d48]">speed</span>
                <span className="text-[#565e74]">Среднее время ответа:</span>
                <span className="font-mono font-bold text-[#0b1c30]">48 сек</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#e11d48]">warning</span>
                <span className="text-[#565e74]">Выявлено скрытых ДТП:</span>
                <span className="font-mono font-bold text-[#e11d48]">3 410 за 30 дней</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-[#565e74]">
              <span className="w-2 h-2 rounded-full bg-[#00845a] animate-pulse"></span>
              <span>Синхронизация шлюзов: 42/42 OK</span>
            </div>
          </div>
        </div>

        {/* 4. OFFICIAL DATABASES REGISTRY GRID (8 Badges) */}
        <div id="official-databases" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[11px] uppercase text-[#e11d48] tracking-wider font-extrabold mb-1">
                Прямое подключение по защищенным API
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                42 официальные базы в реальном времени
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#565e74] max-w-md">
              Каждый отчет агрегирует официальные реестры исполнительной власти РФ, страховых союзов и закрытых банковских баз.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Source 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">local_police</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">ГИБДД МВД РФ</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  История периодов владения, официальные ДТП, розыск и запреты на регдействия.
                </p>
              </div>
            </div>

            {/* Source 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">Реестр залогов ФНП</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Нотариальная палата РФ. Проверка обременений в пользу кредиторов и физлиц.
                </p>
              </div>
            </div>

            {/* Source 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">РСА и Страховые</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Калькуляции восстановительного ремонта ОСАГО/КАСКО с суммами выплат.
                </p>
              </div>
            </div>

            {/* Source 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">ФССП России</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Исполнительные производства, судебные аресты и неоплаченные долги владельца.
                </p>
              </div>
            </div>

            {/* Source 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">local_taxi</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">Минтранс РФ (Такси)</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Реестр выданных лицензий легкового такси по всем 89 субъектам Федерации.
                </p>
              </div>
            </div>

            {/* Source 6 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">fact_check</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">ЕАИСТО (Техосмотр)</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Диагностические карты с хронологической фиксацией реального пробега.
                </p>
              </div>
            </div>

            {/* Source 7 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">128 Банков и Лизингов</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Сбер, ВТБ, Альфа, Т-Банк, Европлан, Каркаде, Газпромбанк Лизинг.
                </p>
              </div>
            </div>

            {/* Source 8 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] shrink-0">
                <span className="material-symbols-outlined text-[24px]">car_crash</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0b1c30]">Аукционы и Тоталы</h3>
                  <span className="material-symbols-outlined text-[#00845a] text-[15px]">check_circle</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Базы списанных автомобилей с конструктивной гибелью кузова (Total Loss).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. INTERACTIVE DOSSIER INSPECTION PREVIEW (BENTO FORENSIC GRID) */}
        <div className="w-full bg-[#eff4ff] py-14 sm:py-20 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-[11px] uppercase text-[#e11d48] tracking-wider font-extrabold mb-1">
                  Архитектура аудита
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                  Что покажет итоговый отчет VIN-WIN
                </h2>
              </div>

              {onLoadSampleReport && (
                <button
                  type="button"
                  onClick={onLoadSampleReport}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#e11d48] hover:text-[#b80035] transition-colors cursor-pointer"
                >
                  <span>Смотреть полный интерактивный образец</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
              )}
            </div>

            {/* Bento Forensic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Bento Card 1: ДТП & Схема повреждений кузова */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-100 text-rose-800">
                      Высокий риск
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">ГИБДД + РСА</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">ДТП и геометрия кузова</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Точные схемы ударов с указанием деформированных несущих элементов, лонжеронов и сработавших подушек безопасности.
                  </p>

                  {/* SVG 2D Car Silhouette Graphic */}
                  <div className="w-full bg-[#eff4ff] rounded-xl p-4 flex items-center justify-center">
                    <div className="relative w-48 h-24 flex items-center justify-center">
                      <svg className="w-full h-full text-slate-300 fill-current" viewBox="0 0 200 80">
                        {/* Car Outline */}
                        <path d="M20,40 Q25,20 50,18 L150,18 Q175,20 180,40 Q175,60 150,62 L50,62 Q25,60 20,40 Z" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        {/* Windshield & Roof */}
                        <path d="M60,25 L85,22 L115,22 L140,25" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M60,55 L85,58 L115,58 L140,55" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                        {/* Impact zones with Carmine markers */}
                        <circle className="fill-[#e11d48]/20 stroke-[#e11d48]" cx="165" cy="28" r="7" strokeWidth="2"></circle>
                        <circle className="fill-[#e11d48]" cx="165" cy="28" r="2.5"></circle>
                        <circle className="fill-[#00845a]/30 stroke-[#00845a]" cx="45" cy="40" r="5" strokeWidth="1.5"></circle>
                      </svg>
                      <div className="absolute bottom-1 right-2 text-[10px] font-mono text-[#e11d48] font-bold">
                        Фронт/Правое крыло
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Статус в базе:</span>
                  <span className="font-bold text-[#e11d48]">2 зафиксированных ДТП</span>
                </div>
              </div>

              {/* Bento Card 2: Интерактивный график скрутки пробега */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-100 text-rose-800">
                      Откат -64 000 км
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">Дилеры + ТО</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">График реального пробега</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Сопоставление отметок официального дилера, данных техосмотра ЕАИСТО и объявлений о продаже с выявлением манипуляций.
                  </p>

                  {/* Visual Graphic: Mileage rollback sparkline */}
                  <div className="w-full bg-[#eff4ff] rounded-xl p-4">
                    <div className="h-24 w-full flex items-end justify-between relative px-2">
                      <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                        <path d="M 5,42 L 30,30 L 55,18 L 75,38 L 95,28" fill="none" stroke="#e11d48" strokeLinecap="round" strokeWidth="2.5"></path>
                        <circle cx="5" cy="42" fill="#00845a" r="3"></circle>
                        <circle cx="30" cy="30" fill="#00845a" r="3"></circle>
                        <circle cx="55" cy="18" fill="#e11d48" r="3.5"></circle>
                        <circle cx="75" cy="38" fill="#e11d48" r="3.5"></circle>
                        <circle cx="95" cy="28" fill="#00845a" r="3"></circle>
                      </svg>
                      <div className="text-[10px] font-mono text-slate-500 z-10">2019</div>
                      <div className="text-[10px] font-mono text-slate-500 z-10">2021</div>
                      <div className="text-[10px] font-mono text-[#e11d48] font-bold z-10">2022 (Скрутка)</div>
                      <div className="text-[10px] font-mono text-slate-500 z-10">2024</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Текущий расчет:</span>
                  <span className="font-mono text-xs font-bold text-[#0b1c30]">192 400 км (на одометре 128k)</span>
                </div>
              </div>

              {/* Bento Card 3: Реестр залогов и банковских обременений */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-[#00845a]">
                      Юридическая чистота
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">ФНП + БКИ</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">Залоги, лизинги и аресты</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Исключение рисков изъятия авто судебными приставами или банками. Проверка залогодателя и номера кредитного договора.
                  </p>

                  <div className="w-full bg-[#eff4ff] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200/60">
                      <span className="flex items-center gap-1.5 text-[#0b1c30] font-medium">
                        <span className="material-symbols-outlined text-[#00845a] text-[18px]">verified</span>
                        Нотариальный залог (ФНП)
                      </span>
                      <span className="font-mono text-xs text-[#00845a] font-bold">Обременений нет</span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200/60">
                      <span className="flex items-center gap-1.5 text-[#0b1c30] font-medium">
                        <span className="material-symbols-outlined text-[#00845a] text-[18px]">verified</span>
                        Арест ФССП
                      </span>
                      <span className="font-mono text-xs text-[#00845a] font-bold">Чисто</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Сертификат проверки:</span>
                  <span className="font-mono text-xs text-[#0b1c30] font-bold">#FNP-2024-992140</span>
                </div>
              </div>

              {/* Bento Card 4: Страховые выплаты и расчеты ремонтов */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      Аудит выплат
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">Audatex / РСА</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">Калькуляции ремонтов</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Все страховые оценки, стоимость запчастей и перечень замененных узлов, даже если ДТП не оформлялось через инспекторов.
                  </p>

                  <div className="w-full bg-[#eff4ff] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#565e74]">
                      <span>Капот, замена OEM</span>
                      <span className="font-mono text-xs text-[#0b1c30] font-bold">84 200 ₽</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#565e74]">
                      <span>Блок-фара Matrix LED (R)</span>
                      <span className="font-mono text-xs text-[#0b1c30] font-bold">142 000 ₽</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#565e74]">
                      <span>Окрас бампера переднего</span>
                      <span className="font-mono text-xs text-[#0b1c30] font-bold">18 500 ₽</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Итого расчетов:</span>
                  <span className="font-mono text-xs font-bold text-[#e11d48]">244 700 ₽ (1 расчет)</span>
                </div>
              </div>

              {/* Bento Card 5: История владельцев и периоды регистрации */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      Владельцы
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">ГИБДД РФ</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">История регистраций</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Периоды нахождения на учете, статус собственников (физические или юридические лица), частые перепродажи перекупами.
                  </p>

                  <div className="w-full bg-[#eff4ff] rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[#0b1c30] text-xs">1</span>
                      <span className="font-medium text-[#0b1c30]">Физ. лицо</span>
                      <span className="text-[#565e74] text-xs">(3 года 2 мес)</span>
                      <span className="ml-auto font-mono text-xs text-[#565e74]">Москва</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[#0b1c30] text-xs">2</span>
                      <span className="font-medium text-[#0b1c30]">Физ. лицо</span>
                      <span className="text-[#565e74] text-xs">(1 год 8 мес)</span>
                      <span className="ml-auto font-mono text-xs text-[#565e74]">СПб</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Всего владельцев:</span>
                  <span className="font-mono text-xs font-bold text-[#0b1c30]">2 владельца по ПТС</span>
                </div>
              </div>

              {/* Bento Card 6: Заводская комплектация OEM & Техпаспорт */}
              <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                      Заводской паспорт
                    </span>
                    <span className="font-mono text-xs text-[#565e74]">OEM Catalog</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">Комплектация по VIN</h3>
                  <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                    Заводской PR-код комплектации: точный объем двигателя, код трансмиссии, цвет кузова и установленные с завода опции.
                  </p>

                  <div className="w-full bg-[#eff4ff] rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="block text-[#565e74] text-[10px]">Двигатель</span>
                      <span className="font-bold text-[#0b1c30] font-mono text-xs">3.0 TDI CRCA</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="block text-[#565e74] text-[10px]">Мощность</span>
                      <span className="font-bold text-[#0b1c30] font-mono text-xs">249 л.с.</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="block text-[#565e74] text-[10px]">Привод</span>
                      <span className="font-bold text-[#0b1c30] font-mono text-xs">quattro (4WD)</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="block text-[#565e74] text-[10px]">Цвет кузова</span>
                      <span className="font-bold text-[#0b1c30] font-mono text-xs truncate">Daytona Grey</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#565e74]">Опций расшифровано:</span>
                  <span className="font-mono text-xs font-bold text-[#00845a]">84 заводских кода</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 6. DIRECT ACTION CTA BANNER */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="bg-[#0b1c30] rounded-2xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#e11d48]/20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 mb-3 font-mono text-xs">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Аудит перед переводом задатка</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Не покупайте «кота в мешке» с чужими долгами
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Один клик сохранит ваши деньги, нервы и исключит риск юридического аннулирования сделки купли-продажи.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={scrollToSearch}
                  className="w-full sm:w-auto h-12 px-6 bg-[#e11d48] hover:bg-[#b80035] text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ввести VIN прямо сейчас</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>

                {onLoadSampleReport && (
                  <button
                    type="button"
                    onClick={onLoadSampleReport}
                    className="w-full sm:w-auto h-12 px-6 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Образец PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* 7. FULL INSTITUTIONAL 4-COLUMN FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 shadow-[0_-1px_8px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-extrabold text-xl tracking-tight text-[#0b1c30] uppercase">
                  VIN<span className="text-[#e11d48]">-</span>WIN
                </span>
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#565e74] font-mono text-xs">
                  v3.8 Telemetry
                </span>
              </div>
              <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                Аналитическая платформа мгновенной верификации транспортных средств, выявления скрытых рисков, залогов и скруток пробега.
              </p>
              <div className="flex items-center gap-1.5 text-[#00845a] text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>SSL 256-bit Encrypted Protocol</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-sm font-extrabold text-[#0b1c30] mb-4">Официальные реестры</h4>
              <ul className="space-y-2 text-xs text-[#565e74]">
                <li>ГИБДД РФ — история учета, ДТП, розыск</li>
                <li>ФНП — реестр уведомлений о залогах движимого имущества</li>
                <li>ФССП — судебные приставы и аресты</li>
                <li>РСА — расчеты ремонтных работ и убытки ОСАГО/КАСКО</li>
                <li>ЕАИСТО — диагностические карты и техосмотры</li>
                <li>ФТС РФ — таможенное оформление и ввоз</li>
                <li>Банки РФ — 128 кредитных организаций</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-sm font-extrabold text-[#0b1c30] mb-4">Навигация и B2B</h4>
              <ul className="space-y-2 text-xs text-[#565e74]">
                <li>
                  <button type="button" onClick={scrollToSearch} className="hover:text-[#e11d48] transition-colors cursor-pointer text-left">
                    Проверка VIN / Госномера
                  </button>
                </li>
                {onLoadSampleReport && (
                  <li>
                    <button type="button" onClick={onLoadSampleReport} className="hover:text-[#e11d48] transition-colors cursor-pointer text-left">
                      Интерактивный образец аудита
                    </button>
                  </li>
                )}
                <li>
                  <button type="button" onClick={scrollToSearch} className="hover:text-[#e11d48] transition-colors cursor-pointer text-left">
                    Пакеты для физических лиц
                  </button>
                </li>
                <li>
                  <button type="button" onClick={scrollToSearch} className="hover:text-[#e11d48] transition-colors cursor-pointer text-left">
                    API интеграция для дилеров и лизинга
                  </button>
                </li>
                <li>
                  <a href="#official-databases" onClick={scrollToDatabases} className="hover:text-[#e11d48] transition-colors cursor-pointer">
                    Регламент синхронизации баз
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-sm font-extrabold text-[#0b1c30] mb-4">Поддержка 24/7</h4>
              <div className="space-y-3 text-xs text-[#565e74]">
                <p className="font-mono text-sm font-bold text-[#0b1c30]">8 (800) 555-38-42</p>
                <p>support@vin-win.ru</p>
                <div className="p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#e11d48] text-[20px] shrink-0">verified_user</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#0b1c30]">Сертификат ФСТЭК</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Защита персональных данных 152-ФЗ</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#565e74]">
            <p>© 2026 VIN-WIN. ООО «Автомобильная Телеметрия». Все права защищены.</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="hover:text-[#0b1c30] cursor-pointer">Политика конфиденциальности</span>
              <span className="hover:text-[#0b1c30] cursor-pointer">Пользовательское соглашение</span>
              <span className="hover:text-[#0b1c30] cursor-pointer">Отказ от ответственности</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
