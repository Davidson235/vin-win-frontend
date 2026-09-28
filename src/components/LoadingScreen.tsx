import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  vin: string;
  plate?: string;
  stages?: Record<string, 'pending' | 'loading' | 'done' | 'error'>;
  onGoBack?: () => void;
  onLoadSampleReport?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  vin,
  plate,
  stages = {},
  onGoBack,
  onLoadSampleReport,
}) => {
  // Real-time Telemetry & HUD State
  const [percent, setPercent] = useState(78);
  const [countdown, setCountdown] = useState(14);
  const [deliveryContact, setDeliveryContact] = useState('');
  const [isDeliverySubmitted, setIsDeliverySubmitted] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const statusUpdates = [
    'EAISTO_GATEWAY: Пакет #402 получен успешно',
    'EAISTO: Зафиксирован пробег ТО-5: 117 000 км',
    "AUDI_OEM: Расшифровка опции 'S-Line Sports Package'...",
    'AUDI_OEM: Коробка передач: 7-ступенчатая S Tronic 0CK',
    'MVD_ACCIDENTS: Локализация удара: передняя левая четверть',
    'ALL_STREAMS: Завершение формирования цифровой подписи...',
  ];

  // Dynamic status ticker and countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => (prev < 99 ? prev + 1 : prev));
      setCountdown((prev) => (prev > 2 ? prev - 1 : 2));
      setTickerIndex((prev) => (prev + 1) % statusUpdates.length);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  // SVG Radial progress calculations
  const totalCircumference = 314.16; // 2 * PI * 50
  const strokeDashoffset = totalCircumference - (percent / 100) * totalCircumference;
  const loadedKb = Math.floor(1480 + (percent - 78) * 125);

  // Decompose plate if provided
  const cleanPlate = (plate || 'О 777 ОО 777').toUpperCase().replace(/\s+/g, '');
  const plateMatch = cleanPlate.match(/^([А-ЯA-Z]{1})(\d{3})([А-ЯA-Z]{2})(\d{2,3})$/);
  const plateMain = plateMatch ? `${plateMatch[1]} ${plateMatch[2]} ${plateMatch[3]}` : (plate || 'О 777 ОО');
  const plateRegion = plateMatch ? plateMatch[4] : '777';

  // Dynamic calculation based on live SSE stages if present
  const liveDoneCount = Object.values(stages).filter((s) => s === 'done').length;
  const activeBasesCount = liveDoneCount > 0 ? 30 + Math.min(12, liveDoneCount) : 36;

  // Smart vehicle title detection
  const isBMW = vin.toUpperCase().startsWith('X4X') || vin.toUpperCase().includes('BMW');
  const isToyota = vin.toUpperCase().startsWith('XW7') || vin.toUpperCase().includes('CAMRY');
  const isMercedes = vin.toUpperCase().startsWith('WDD') || vin.toUpperCase().includes('MERCEDES');
  
  const vehicleTitle = isBMW
    ? 'BMW X5 xDrive30d G05'
    : isToyota
    ? 'Toyota Camry 2.5 Elegance'
    : isMercedes
    ? 'Mercedes-Benz E 200 4MATIC'
    : 'Audi A6 Avant 3.0 TDI Quattro';

  const vehicleSpecs = isBMW
    ? '2021 г.в. • Внедорожник • 249 л.с. • Дизель B57'
    : isToyota
    ? '2019 г.в. • Седан • 181 л.с. • Бензин 2.5'
    : isMercedes
    ? '2020 г.в. • Седан • 197 л.с. • Бензин M264'
    : '2018 г.в. • Универсал • 245 л.с. • Дизель CleanDiesel';

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryContact.trim()) {
      setIsDeliverySubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#e11d48] selection:text-white relative">
      
      {/* 1. FIXED TOP HEADER (Stitch Screen 2) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.06)] border-b border-slate-200/70">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Live Telemetry Badge */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              type="button"
              onClick={onGoBack}
              className="flex items-center gap-2 cursor-pointer group text-left"
              title="К поиску авто"
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
              onClick={onGoBack}
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
            <span className="text-slate-400 font-medium text-sm">Тарифы</span>
            <span className="text-slate-400 font-medium text-sm">Партнерам / B2B</span>
            <span className="text-slate-400 font-medium text-sm">Базы данных (ГИБДД, Нотариат, ЕАИСТО)</span>
          </nav>

          {/* Right Header Badges and CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[11px] font-bold uppercase tracking-wider border border-slate-200/60">
              <span className="material-symbols-outlined text-[#e11d48] text-[16px]">verified</span>
              <span>42 базы онлайн</span>
            </div>

            <button
              type="button"
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

      {/* Main Diagnostic Hub Container */}
      <main className="w-full pt-20 bg-[#f8f9ff] flex-1">
        
        {/* Subtle Telemetry Atmosphere Layer */}
        <div className="w-full relative overflow-hidden py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#e11d48]/10 via-[#d3e4fe]/40 to-transparent blur-3xl pointer-events-none rounded-full -z-10"></div>
          
          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-6 lg:gap-8">
            
            {/* 2. BREADCRUMB & SESSION METADATA STRIP */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 text-[#565e74]">
                <button
                  type="button"
                  onClick={onGoBack}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#e11d48] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>К поиску авто</span>
                </button>
                <span className="font-mono text-xs opacity-40">/</span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#0b1c30] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping"></span>
                  <span>TASK-ID: #AUD-2026-8902A</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-[#565e74]">
                  <span className="material-symbols-outlined text-[16px] text-[#00845a]">lock</span>
                  <span>SSL 256-bit GovStream</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0b1c30] text-[10px] font-bold uppercase tracking-wider border border-slate-200/60">
                  VIN-WIN AUDIT PRO v3.8
                </div>
              </div>
            </div>

            {/* 3. HERO HEADER & VEHICLE DOSSIER CARD (SPLIT LAYOUT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (lg:col-span-7): Diagnostic Stage & Vehicle Identity */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#e11d48] border border-rose-200 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-pulse"></span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">
                      Глубокий криминалистический аудит
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight mt-1">
                    Формирование расширенного отчета
                  </h1>
                  <p className="text-xs sm:text-sm text-[#565e74] max-w-xl leading-relaxed">
                    Платформа выполняет параллельную верификацию по 42 официальным реестрам МВД, ФНП, ЕАИСТО, лизинговым агрегаторам и европейским базам дилерского обслуживания.
                  </p>
                </div>

                {/* Vehicle Identity Strip */}
                <div className="mt-6 pt-4 bg-[#eff4ff] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/60">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-13 h-13 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[#e11d48] text-[28px]">directions_car</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-extrabold text-[#0b1c30] truncate">
                        {vehicleTitle}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                        <span className="text-xs text-[#565e74]">{vehicleSpecs}</span>
                      </div>
                    </div>
                  </div>

                  {/* GOST License Plate Plaque Replica */}
                  <div className="shrink-0 flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black tracking-widest text-[#0b1c30] uppercase">
                        {plateMain}
                      </span>
                      <div className="flex flex-col items-center pl-2 border-l border-slate-200">
                        <span className="text-[11px] leading-tight font-black text-[#0b1c30]">{plateRegion}</span>
                        <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#565e74]">
                          <span>RUS</span>
                          <div className="w-3 h-2 rounded-[1px] overflow-hidden flex flex-col border border-slate-300">
                            <span className="h-1/3 bg-white w-full"></span>
                            <span className="h-1/3 bg-[#0039A6] w-full"></span>
                            <span className="h-1/3 bg-[#e11d48] w-full"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Identifier Bar */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#565e74]">
                  <div className="p-3 bg-[#f8f9ff] border border-slate-200/80 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">VIN Номер</div>
                    <div className="font-mono text-xs font-bold text-[#0b1c30] mt-0.5 flex items-center justify-between">
                      <span className="truncate">{vin || 'WAUZZZ4G8EN054129'}</span>
                      <span className="material-symbols-outlined text-[16px] text-[#00845a]">check_circle</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8f9ff] border border-slate-200/80 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Номер кузова / Шасси</div>
                    <div className="font-mono text-xs font-bold text-[#0b1c30] mt-0.5 truncate">
                      {isBMW ? 'WBA-X5-30D-01' : isToyota ? 'XW7-BF4-FK00S' : '4G-8-054129'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8f9ff] border border-slate-200/80 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Двигатель (Код)</div>
                    <div className="font-mono text-xs font-bold text-[#0b1c30] mt-0.5 truncate">
                      {isBMW ? 'B57D30 #189204' : isToyota ? 'A25A-FKS #8819' : 'CRTD #920411'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (lg:col-span-5): Radial Engine & Velocity Telemetry Widget */}
              <div className="lg:col-span-5 bg-[#213145] text-[#eaf1ff] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#e11d48]/20 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="material-symbols-outlined text-[#e11d48] text-[20px] animate-spin">sync</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Синхронизация шлюзов</span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {loadedKb} кб / 4 120 кб
                    </span>
                  </div>

                  {/* Radial Progress Gauge Display */}
                  <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                    <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          fill="none"
                          r="50"
                          stroke="rgba(255,255,255,0.12)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          fill="none"
                          r="50"
                          stroke="#e11d48"
                          strokeWidth="8"
                          strokeDasharray="314.16"
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-white font-mono">{percent}%</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                          Готовность
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          <span>Ориентировочное время</span>
                          <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                        </div>
                        <div className="font-mono text-xl font-bold text-[#e11d48] mt-0.5">
                          <span>{countdown}</span> сек
                        </div>
                      </div>

                      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          <span>Баз опрошено</span>
                          <span className="text-emerald-400 font-bold font-mono">{activeBasesCount} / 42</span>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-[#e11d48] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Running Telemetry Feed Line */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="truncate">{statusUpdates[tickerIndex]}</span>
                  </div>
                  <span className="text-rose-300 shrink-0 font-bold">PING 24ms</span>
                </div>

              </div>

            </div>

            {/* 4. MAIN LIVE AUDIT STREAM CONSOLE (8 HIGH-FIDELITY SERVER CARDS) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e11d48] text-[26px]">terminal</span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#0b1c30]">
                      Телеметрия проверки баз данных в реальном времени
                    </h2>
                    <p className="text-xs text-[#565e74]">
                      Опрос государственных реестров, банковских залоговых депозитариев и баз страховой истории
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1 rounded-full text-xs font-mono text-[#0b1c30] font-bold border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-[#00845a] animate-pulse"></span>
                  <span>42 API потока активны</span>
                </div>
              </div>

              {/* 8 Database Verification Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Row 1: GIBDD (Accidents Warning) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-[#e11d48] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">car_crash</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          База ГИБДД МВД (Учет и ДТП)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Регистрационные действия, розыск, 12 аварийных реестров
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      2 ДТП найдено
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: МВД РФ / ФИС ГИБДД-М</span>
                    <span className="text-[#e11d48] font-bold">0.84 сек • 2 совпадения</span>
                  </div>
                </div>

                {/* Row 2: FNP (Clean) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#00845a] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">account_balance</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          Федеральная нотариальная палата (ФНП)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Единый реестр залогов движимого имущества РФ
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#00845a] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Залогов нет
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: NOTARY-REGISTRY-API</span>
                    <span className="text-[#00845a] font-bold">1.12 сек • Залогов 0</span>
                  </div>
                </div>

                {/* Row 3: EAISTO (In Progress) */}
                <div className="p-4 rounded-xl bg-white flex flex-col gap-2 relative overflow-hidden border border-rose-200 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] animate-spin">build</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          ЕАИСТО (ТО и Диагностические карты)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          История техосмотров, фиксация пробега и дефектов
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-rose-50 text-[#e11d48] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1 animate-pulse border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                      Анализ 8 карт ТО...
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-100">
                    <span>ШЛЮЗ: МИНТРАНС ЕАИСТО-2</span>
                    <span className="text-[#e11d48] font-bold">Чтение дельты пробега...</span>
                  </div>
                </div>

                {/* Row 4: RSA & Audatex (Alert) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-[#e11d48] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          РСА &amp; Страховые расчеты (Audatex/DAT)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Калькуляции восстановительного ремонта ОСАГО/КАСКО
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">report</span>
                      3 расчета выплат
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: RSA-DATA-STREAM / AUDATEX</span>
                    <span className="text-[#e11d48] font-bold">Найдено 420 000 ₽</span>
                  </div>
                </div>

                {/* Row 5: FSSP (Clean) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#00845a] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">gavel</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          ФССП (Судебные приставы и аресты)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Исполнительные производства и запреты регдействий
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#00845a] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Ограничений нет
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: FSSP-GOV-ENDPOINT</span>
                    <span className="text-[#00845a] font-bold">1.40 сек • Исполнений: 0</span>
                  </div>
                </div>

                {/* Row 6: Mintrans Taxi (Clean) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#00845a] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">local_taxi</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          Реестры Минтранса (Такси и каршеринг)
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Лицензии субъектов РФ, реестр агрегаторов таксопарков
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#00845a] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      В такси не был
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: MINTRANS-TAXI-REG</span>
                    <span className="text-[#00845a] font-bold">0.65 сек • Лицензий: 0</span>
                  </div>
                </div>

                {/* Row 7: Interpol (Clean) */}
                <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col gap-2 relative overflow-hidden border border-slate-200/70 hover:bg-[#e5eeff] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#00845a] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          Интерпол и международный розыск
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Базы угнанных ТС: Интерпол, Беларусь, Казахстан
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#00845a] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Розыск чист
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-200/60">
                    <span>СЕРВЕР: INTERPOL-ASF-STOLEN</span>
                    <span className="text-[#00845a] font-bold">1.82 сек • Чистый статус</span>
                  </div>
                </div>

                {/* Row 8: OEM VAG Catalog (In Progress) */}
                <div className="p-4 rounded-xl bg-white flex flex-col gap-2 relative overflow-hidden border border-rose-200 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] animate-spin">memory</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0b1c30] truncate">
                          OEM База комплектаций Audi AG
                        </div>
                        <div className="text-xs text-[#565e74] truncate">
                          Заводская комплектация, цвет, дата сборки в Ингольштадте
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-rose-50 text-[#e11d48] text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1 animate-pulse border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                      PR-коды: 84 / 112
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#565e74] pt-2 border-t border-slate-100">
                    <span>ШЛЮЗ: VAG-DEALER-PORTAL</span>
                    <span className="text-[#e11d48] font-bold">Расшифровка опций...</span>
                  </div>
                </div>

              </div>

            </div>

            {/* 5. LIVE TEASER PREVIEW: 3 CRITICAL FLAGS DETECTED */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Teaser 1: Mileage Rollback Alert */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#e11d48] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48]">
                      Внимание: Аномалия пробега
                    </span>
                    <h3 className="text-base font-extrabold text-[#0b1c30] mt-0.5">
                      Выявлена скрутка: -45 000 км
                    </h3>
                    <p className="text-xs text-[#565e74] mt-1.5 leading-relaxed">
                      В 2021 году зафиксирован пробег 162 000 км при ТО-4. На следующем ТО-5 в 2022 году в базу внесен пробег 117 000 км.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">График расхождения</span>
                  <span className="text-[#e11d48] font-bold">В отчете #РАЗДЕЛ 4</span>
                </div>
              </div>

              {/* Teaser 2: Repair Calculations */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#e11d48] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">hardware</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48]">
                      Страховые калькуляции
                    </span>
                    <h3 className="text-base font-extrabold text-[#0b1c30] mt-0.5">
                      Ремонты на сумму 420 000 ₽
                    </h3>
                    <p className="text-xs text-[#565e74] mt-1.5 leading-relaxed">
                      Замена переднего бампера, капота и левой LED-фары Matrix в 2020 году. Геометрия лонжеронов не нарушена.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Смета с каталожными номерами</span>
                  <span className="text-[#e11d48] font-bold">В отчете #РАЗДЕЛ 6</span>
                </div>
              </div>

              {/* Teaser 3: Technical & Factory Spec */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00845a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">fact_check</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00845a]">
                      Юридическая чистота
                    </span>
                    <h3 className="text-base font-extrabold text-[#0b1c30] mt-0.5">
                      Без залогов и ограничений
                    </h3>
                    <p className="text-xs text-[#565e74] mt-1.5 leading-relaxed">
                      ПТС оригинальный, 2 собственника. Автомобиль свободен от прав третьих лиц, судебных арестов и банковских залогов.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Гарантия юридической защиты</span>
                  <span className="text-[#00845a] font-bold">Сертификат ФНП</span>
                </div>
              </div>

            </div>

            {/* 6. ACTION PANEL & EMAIL DISPATCH STRIP (LEAD CAPTURE FORM) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-1.5 text-[#00845a] text-[11px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Автоматическая синхронизация доставки</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0b1c30]">
                  Отчет готов на {percent}%. Куда отправить полную PDF-версию?
                </h3>
                <p className="text-xs text-[#565e74] leading-relaxed">
                  Мы продублируем криминалистическую экспертизу на ваш Email или в мессенджер с бессрочной ссылкой для скачивания на мобильный телефон.
                </p>
              </div>

              {/* Input Dispatch Form */}
              <form onSubmit={handleDeliverySubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
                {isDeliverySubmitted ? (
                  <div className="h-12 px-6 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00845a] text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>✓ Ссылка на отчёт будет направлена по готовности</span>
                  </div>
                ) : (
                  <>
                    <div className="relative min-w-[280px]">
                      <input
                        type="text"
                        value={deliveryContact}
                        onChange={(e) => setDeliveryContact(e.target.value)}
                        placeholder="Telegram @username или Email"
                        className="w-full h-12 px-4 pl-10 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-sm placeholder:text-[#565e74]/60 focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 transition-all border border-slate-200/70"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#565e74] text-[20px]">
                        alternate_email
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="h-12 px-6 rounded-xl bg-[#e11d48] text-white text-sm font-bold hover:bg-[#b80035] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-rose-600/20 cursor-pointer active:scale-[0.98]"
                    >
                      <span>Получить копию</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* 7. BOTTOM INTERACTIVE INSPECTION ANCHOR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#eff4ff] text-[#0b1c30] border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#e11d48] text-[24px]">visibility</span>
                <div className="text-xs sm:text-sm">
                  Не хотите ждать? <span className="font-bold">Интерактивный предпросмотр уже сформированных разделов:</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {onLoadSampleReport && (
                  <button
                    type="button"
                    onClick={onLoadSampleReport}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white text-[#0b1c30] text-xs font-bold hover:bg-slate-50 transition-colors text-center shadow-xs border border-slate-200 cursor-pointer"
                  >
                    Открыть демо-структуру
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLoadSampleReport}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0b1c30] text-white text-xs font-bold hover:bg-[#213145] transition-colors text-center cursor-pointer"
                >
                  Разблокировать PRO
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* 8. FULL INSTITUTIONAL 4-COLUMN FOOTER */}
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
                  <button type="button" onClick={onGoBack} className="hover:text-[#e11d48] transition-colors cursor-pointer text-left">
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
                  <span className="hover:text-[#e11d48] transition-colors cursor-pointer">
                    Пакеты для физических лиц
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#e11d48] transition-colors cursor-pointer">
                    API интеграция для дилеров и лизинга
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#e11d48] transition-colors cursor-pointer">
                    Регламент синхронизации баз
                  </span>
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
