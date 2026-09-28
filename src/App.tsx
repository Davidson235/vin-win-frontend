import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReportHero } from './components/ReportHero';
import { ChecklistSummary } from './components/ChecklistSummary';
import { MileageRollbackChart } from './components/MileageRollbackChart';
import { EaistoCards } from './components/EaistoCards';
import { FinesSection } from './components/FinesSection';
import { OsagoSection } from './components/OsagoSection';
import { HistoricalAdsSection } from './components/HistoricalAdsSection';
import { RecallsSection } from './components/RecallsSection';
import { VinDataSection } from './components/VinDataSection';
import { MarketOffersSection } from './components/MarketOffersSection';
import { Footer } from './components/Footer';
import { StartScreen } from './components/StartScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { SAMPLE_AUDI_A6 } from './utils/sampleReport';

import { RiskFactorSemaphore } from './components/RiskFactorSemaphore';
import { BodyDamageSection } from './components/BodyDamageSection';
import { OwnershipAndLegalSection } from './components/OwnershipAndLegalSection';
import { OemCatalogAndVerdictSection } from './components/OemCatalogAndVerdictSection';
import { GibddCaptchaModal } from './components/GibddCaptchaModal';
import { FsspModal } from './components/FsspModal';
import { AuctionPhotosModal } from './components/AuctionPhotosModal';
import { FinesModal } from './components/FinesModal';
import { KbmModal } from './components/KbmModal';
import { PrintHeader } from './components/PrintHeader';
import { PrintFooter } from './components/PrintFooter';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'loading' | 'report'>('landing');
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'CLEAN' | 'WARNING' | 'CRITICAL' | 'LOADING'>('CLEAN');

  // Stages of verification
  const [stages, setStages] = useState<Record<string, 'pending' | 'loading' | 'done' | 'error'>>({
    specs: 'pending',
    photos: 'pending',
    taxi: 'pending',
    fnp: 'pending',
    fedresurs: 'pending',
    recalls: 'pending',
    eaisto: 'pending',
    osago: 'pending',
    auction: 'pending',
    carsharing: 'pending',
    elpts: 'pending',
    gibdd: 'pending',
  });

  // Authentic State for data (no fake mocks)
  const [specs, setSpecs] = useState<any>(null);
  const [photosData, setPhotosData] = useState<any>({ count: 0, photos: [], source: '' });
  const [taxiData, setTaxiData] = useState<any>(null);
  const [fnpData, setFnpData] = useState<any>(null);
  const [fedresursData, setFedresursData] = useState<any>(null);
  const [recallsData, setRecallsData] = useState<any>(null);
  const [eaistoData, setEaistoData] = useState<any>(null);
  const [osagoData, setOsagoData] = useState<any>(null);
  const [auctionData, setAuctionData] = useState<any>(null);
  const [carsharingData, setCarsharingData] = useState<any>(null);
  const [elptsData, setElptsData] = useState<any>(null);
  const [gibddData, setGibddData] = useState<any>(null);
  const [finesData, setFinesData] = useState<any>({
    checked: false,
    total_fines_count: 0,
    unpaid_fines_count: 0,
    total_amount_rub: 0,
    fines: [],
  });
  const [classifiedsData, setClassifiedsData] = useState<any>(null);
  const [odometerData, setOdometerData] = useState<any>(null);

  // Modal states
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isFinesModalOpen, setIsFinesModalOpen] = useState(false);
  const [isKbmModalOpen, setIsKbmModalOpen] = useState(false);
  const [isFsspOpen, setIsFsspOpen] = useState(false);
  const [fsspInitialParams, setFsspInitialParams] = useState<{ fio: string; region: string }>({
    fio: 'Смирнов Алексей',
    region: '77',
  });

  // Captcha modal
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaBase64, setCaptchaBase64] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [isCaptchaSubmitting, setIsCaptchaSubmitting] = useState(false);

  // Handler for loading Stitch Sample Report (Audi A6) in demo preview mode
  const handleLoadSampleReport = () => {
    setVin(SAMPLE_AUDI_A6.vin);
    setPlate(SAMPLE_AUDI_A6.plate);
    setRiskLevel(SAMPLE_AUDI_A6.riskLevel);
    setSpecs(SAMPLE_AUDI_A6.specs);
    setPhotosData(SAMPLE_AUDI_A6.photosData);
    setGibddData(SAMPLE_AUDI_A6.gibddData);
    setOdometerData(SAMPLE_AUDI_A6.odometerData);
    setEaistoData(SAMPLE_AUDI_A6.eaistoData);
    setOsagoData(SAMPLE_AUDI_A6.osagoData);
    setFnpData(SAMPLE_AUDI_A6.fnpData);
    setFedresursData(SAMPLE_AUDI_A6.fedresursData);
    setTaxiData(SAMPLE_AUDI_A6.taxiData);
    setCarsharingData(SAMPLE_AUDI_A6.carsharingData);
    setFinesData(SAMPLE_AUDI_A6.finesData);
    setRecallsData(SAMPLE_AUDI_A6.recallsData);
    setClassifiedsData(null);
    setIsLoading(false);
    setView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SSE Stream Search Handler
  const handleSearch = (searchVin: string, searchPlate: string) => {
    const rawVin = searchVin.trim();
    const isUrl = rawVin.startsWith('http://') || rawVin.startsWith('https://') || rawVin.includes('auto.ru') || rawVin.includes('avito.ru') || rawVin.includes('drom.ru');
    let effectiveVin = isUrl ? rawVin : rawVin.toUpperCase();
    let effectivePlate = searchPlate.trim().toUpperCase();

    // Auto-detect if user entered a Russian license plate into the VIN input (only if not URL)
    if (!isUrl) {
      const isPlate = /^[АВЕКМНОРСТУХA-Z]{1}\d{3}[АВЕКМНОРСТУХA-Z]{2}\d{2,3}$/i.test(effectiveVin.replace(/\s+/g, ''));
      if (isPlate && !effectivePlate) {
        effectivePlate = effectiveVin;
        effectiveVin = '';
      }
    }

    setVin(effectiveVin);
    setPlate(effectivePlate);
    setIsLoading(true);
    setView('loading');
    setRiskLevel('LOADING');

    setSpecs(null);
    setPhotosData({ count: 0, photos: [], source: '' });
    setTaxiData(null);
    setFnpData(null);
    setFedresursData(null);
    setRecallsData(null);
    setEaistoData(null);
    setOsagoData(null);
    setAuctionData(null);
    setCarsharingData(null);
    setElptsData(null);
    setGibddData(null);
    setClassifiedsData(null);
    setOdometerData(null);
    setFinesData({ checked: false, total_fines_count: 0, unpaid_fines_count: 0, total_amount_rub: 0, fines: [] });

    setStages({
      specs: 'loading',
      photos: 'loading',
      taxi: 'loading',
      fnp: 'loading',
      fedresurs: 'loading',
      recalls: 'loading',
      eaisto: 'loading',
      osago: 'loading',
      auction: 'loading',
      carsharing: 'loading',
      elpts: 'loading',
      gibdd: 'loading',
      dtp: 'loading',
      search: 'loading',
      restrict: 'loading',
      classifieds: 'loading',
      odometer: 'loading',
    });

    const streamUrl = `/api/check/stream?vin=${encodeURIComponent(effectiveVin)}&plate=${encodeURIComponent(effectivePlate)}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.stage === 'url_resolved') {
          if (payload.data?.vin) {
            setVin(payload.data.vin);
          }
          if (payload.data?.plate) {
            setPlate(payload.data.plate);
          }
        } else if (payload.stage === 'url_error') {
          setIsLoading(false);
          eventSource.close();
          alert(payload.error || 'В данном объявлении продавец скрыл VIN. Введите VIN или госномер вручную.');
          setView('landing');
          return;
        } else if (payload.stage === 'specs') {
          setSpecs(payload.data);
          setStages((prev) => ({ ...prev, specs: 'done' }));
        } else if (payload.stage === 'photos') {
          setPhotosData(payload.data);
          setStages((prev) => ({ ...prev, photos: 'done' }));
        } else if (payload.stage === 'taxi') {
          setTaxiData(payload.data);
          setStages((prev) => ({ ...prev, taxi: 'done' }));
        } else if (payload.stage === 'fnp') {
          setFnpData(payload.data);
          setStages((prev) => ({ ...prev, fnp: 'done' }));
        } else if (payload.stage === 'fedresurs') {
          setFedresursData(payload.data);
          setStages((prev) => ({ ...prev, fedresurs: 'done' }));
        } else if (payload.stage === 'recalls') {
          setRecallsData(payload.data);
          setStages((prev) => ({ ...prev, recalls: 'done' }));
        } else if (payload.stage === 'eaisto') {
          setEaistoData(payload.data);
          setStages((prev) => ({ ...prev, eaisto: 'done' }));
        } else if (payload.stage === 'osago') {
          setOsagoData(payload.data);
          setStages((prev) => ({ ...prev, osago: 'done' }));
        } else if (payload.stage === 'auction') {
          setAuctionData(payload.data);
          setStages((prev) => ({ ...prev, auction: 'done' }));
        } else if (payload.stage === 'carsharing') {
          setCarsharingData(payload.data);
          setStages((prev) => ({ ...prev, carsharing: 'done' }));
        } else if (payload.stage === 'elpts') {
          setElptsData(payload.data);
          setStages((prev) => ({ ...prev, elpts: 'done' }));
        } else if (payload.stage === 'gibdd') {
          setGibddData(payload.data);
          setStages((prev) => ({ ...prev, gibdd: 'done', dtp: 'done', search: 'done', restrict: 'done' }));
        } else if (payload.stage === 'gibdd_captcha') {
          if (payload.data?.captcha_base64) {
            setCaptchaBase64(payload.data.captcha_base64);
            setCaptchaToken(payload.data.token);
          }
        } else if (payload.stage === 'classifieds') {
          setClassifiedsData(payload.data);
          setStages((prev) => ({ ...prev, classifieds: 'done' }));
        } else if (payload.stage === 'odometer') {
          setOdometerData(payload.data);
          setStages((prev) => ({ ...prev, odometer: 'done' }));
        } else if (payload.stage === 'complete') {
          setIsLoading(false);
          setRiskLevel(payload.overall_risk);
          setStages((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((k) => {
              next[k] = 'done';
            });
            return next;
          });
          setTimeout(() => {
            setView('report');
          }, 600);
          eventSource.close();
        }
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    };

    eventSource.onerror = () => {
      setIsLoading(false);
      eventSource.close();
    };
  };

  const handleRefreshCaptcha = async () => {
    try {
      const res = await fetch('/api/gibdd/captcha');
      const data = await res.json();
      if (data.captcha_base64) {
        setCaptchaBase64(data.captcha_base64);
        setCaptchaToken(data.token);
      }
    } catch (e) {
      console.error('Failed to refresh captcha:', e);
    }
  };

  const handleVerifyCaptcha = async (code: string) => {
    setIsCaptchaSubmitting(true);
    try {
      const res = await fetch('/api/gibdd/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, captcha_code: code, token: captchaToken }),
      });
      const data = await res.json();
      setGibddData(data);
      setIsCaptchaOpen(false);
    } catch (e) {
      console.error('Failed to verify GIBDD captcha:', e);
    } finally {
      setIsCaptchaSubmitting(false);
    }
  };

  if (view === 'landing') {
    return (
      <StartScreen
        onStartSearch={handleSearch}
        initialVin={vin}
        initialPlate={plate}
        onLoadSampleReport={handleLoadSampleReport}
      />
    );
  }

  if (view === 'loading') {
    return (
      <LoadingScreen
        vin={vin}
        plate={plate}
        stages={stages}
        onGoBack={() => setView('landing')}
        onLoadSampleReport={handleLoadSampleReport}
      />
    );
  }

  const isSampleMode = Boolean(vin === SAMPLE_AUDI_A6.vin || vin.includes('WAUZZZF28LA019842'));

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#e11d48] selection:text-white pt-20">
      {/* Top Header with Search and Branding */}
      <Header
        onSearch={handleSearch}
        isLoading={isLoading}
        currentVin={vin}
        currentPlate={plate}
        onGoHome={() => setView('landing')}
        onLoadSampleReport={handleLoadSampleReport}
      />

      {/* Sticky Fast-Navigation Bar for Instant Section Jumping */}
      <nav aria-label="Быстрая навигация по отчету" className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_6px_rgba(15,23,42,0.04)] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#overview"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Обзор ТС
            </a>
            <a
              href="#risk-semaphore"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Факторы риска
            </a>
            <a
              href="#body-damage"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Кузов & Audatex
            </a>
            <a
              href="#probeg"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Пробег & Скрутка
            </a>
            <a
              href="#ownership-legal"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Владельцы & Право
            </a>
            <a
              href="#oem-verdict"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Опции PR & Вердикт
            </a>
            <a
              href="#checklist"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              12 Реестров
            </a>
            <a
              href="#fines"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Штрафы ГИБДД
            </a>
            <a
              href="#osago"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              ОСАГО
            </a>
            <a
              href="#market"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Оценка рынка
            </a>
          </div>

          <button
            onClick={() => setView('landing')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#0039a6] bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 transition-colors shrink-0"
          >
            ← К новому поиску
          </button>
        </div>
      </nav>

      {/* Main Container: Clean Centered Layout matching Stitch Screen 3 */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Print Header (Visible only on print/PDF) */}
        <PrintHeader
          vin={vin}
          plate={plate}
          specs={specs}
          riskLevel={riskLevel}
        />

        {/* 1. HERO SECTION: Title, Identifiers, Badges, Verdict, AI & Gallery */}
        <div id="overview">
          <ReportHero
            title={specs?.title || `${specs?.make || 'Автомобиль'} ${specs?.model || ''}`}
            vin={vin}
            plate={plate}
            specs={specs}
            riskLevel={riskLevel}
            photos={photosData?.photos || []}
            photosCount={photosData?.count}
            nomerogramUrl={photosData?.nomerogram_url}
            ownersCount={gibddData?.owners_count}
            accidentsCount={gibddData?.accidents_count}
            isTaxi={taxiData?.is_taxi}
            isPledged={fnpData?.is_pledged}
            isRollback={eaistoData?.is_rollback_detected}
            onGoBack={() => setView('landing')}
          />
        </div>

        {/* 2. СВЕТОФОР КРИТИЧЕСКИХ ФАКТОРОВ РИСКА (5 колонок) */}
        <div id="risk-semaphore">
          <RiskFactorSemaphore
            isPledged={fnpData?.is_pledged}
            hasRestrictions={Boolean(gibddData?.has_restrictions || (gibddData?.restrictions && gibddData.restrictions.length > 0))}
            accidentsCount={gibddData?.accidents_count || (gibddData?.accidents && gibddData.accidents.length) || 0}
            calculationsCount={classifiedsData?.audatex_calculations?.length || 0}
            isRollback={Boolean(eaistoData?.is_rollback_detected || odometerData?.has_rollback)}
            rollbackDiffKm={isSampleMode ? 42000 : (odometerData?.rollback_diff_km || 40000)}
            isTaxi={Boolean(taxiData?.is_taxi)}
            isCarsharing={Boolean(carsharingData?.is_carsharing)}
            ownersCount={gibddData?.owners_count || (gibddData?.ownership_periods && gibddData.ownership_periods.length) || 1}
            isSampleMode={isSampleMode}
          />
        </div>

        {/* 3. ПОВРЕЖДЕНИЯ КУЗОВА И РАСЧЕТЫ AUDATEX (7/5 split layout) */}
        <div id="body-damage">
          <BodyDamageSection
            hasAccidents={isSampleMode ? true : Boolean((gibddData?.accidents_count && gibddData.accidents_count > 0) || (classifiedsData?.audatex_calculations && classifiedsData.audatex_calculations.length > 0))}
            audatexCalculations={isSampleMode ? undefined : classifiedsData?.audatex_calculations}
            audatexTotalRub={isSampleMode ? undefined : classifiedsData?.audatex_calculations?.reduce((sum: number, c: any) => sum + (c.amount_rub || 0), 0)}
            isSampleMode={isSampleMode}
          />
        </div>

        {/* 4. ПРОБЕГ И СКРУТКА ОДОМЕТРА (Векторный 900x240 график с зоной скрутки) */}
        <div id="probeg">
          <MileageRollbackChart
            eaistoData={eaistoData}
            odometerData={odometerData}
            isLoading={stages.eaisto === 'loading' || stages.odometer === 'loading'}
            isSampleMode={isSampleMode}
          />
        </div>

        {/* 5. ИСТОРИЯ ВЛАДЕНИЯ И ЮРИДИЧЕСКАЯ ЧИСТОТА (6/6 split layout) */}
        <div id="ownership-legal">
          <OwnershipAndLegalSection
            gibddData={gibddData}
            fnpData={fnpData}
            fedresursData={fedresursData}
            taxiData={taxiData}
            isSampleMode={isSampleMode}
            onOpenFsspCheck={() => {
              setFsspInitialParams({ fio: 'Смирнов Алексей', region: '77' });
              setIsFsspOpen(true);
            }}
          />
        </div>

        {/* 6. КАТАЛОГ ЗАВОДСКОЙ КОМПЛЕКТАЦИИ OEM (PR-коды) И ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ */}
        <div id="oem-verdict">
          <OemCatalogAndVerdictSection
            prCodes={isSampleMode ? SAMPLE_AUDI_A6.prCodes : (specs?.pr_codes || [])}
            brandName={specs?.make || 'Audi AG'}
            isSampleMode={isSampleMode}
          />
        </div>

        {/* 7. ЧТО МЫ ПРОВЕРИЛИ (12 Государственных Реестров) */}
        <div id="checklist">
          <ChecklistSummary
            specs={specs}
            taxiData={taxiData}
            fnpData={fnpData}
            fedresursData={fedresursData}
            eaistoData={eaistoData}
            osagoData={osagoData}
            carsharingData={carsharingData}
            recallsData={recallsData}
            elptsData={elptsData}
            gibddData={gibddData}
            finesCount={finesData?.unpaid_fines_count}
            accidentsCount={gibddData?.accidents_count}
          />
        </div>

        {/* 8. ШТРАФЫ ГИБДД (Сводка, список постановлений с УИН и скидками) */}
        <div id="fines">
          <FinesSection
            finesData={finesData}
            onOpenFinesModal={() => setIsFinesModalOpen(true)}
          />
        </div>

        {/* 9. ОСАГО (Полис, страховщик, КБМ и калькулятор РСА) */}
        <div id="osago">
          <OsagoSection
            osagoData={osagoData}
            specs={specs}
            currentPlate={plate}
            onOpenKbmModal={() => setIsKbmModalOpen(true)}
          />
        </div>

        {/* 10. ТЕХОСМОТРЫ (ЕАИСТО) (Сетка диагностических карт) */}
        <EaistoCards eaistoData={eaistoData} />

        {/* 11. НАЙДЕННЫЕ ОБЪЯВЛЕНИЯ (Архив Auto.ru, Avito, Drom) */}
        <HistoricalAdsSection specs={specs} classifiedsData={classifiedsData} />

        {/* 12. ОТЗЫВНЫЕ КАМПАНИИ (Росстандарт) */}
        <RecallsSection recallsData={recallsData} />

        {/* 13. ДАННЫЕ ПО VIN (Заводские характеристики ISO 3779) */}
        <VinDataSection vin={vin} specs={specs} />

        {/* 14. ПОХОЖИЕ ПРЕДЛОЖЕНИЯ И ОЦЕНКА РЫНКА */}
        <div id="market">
          <MarketOffersSection specs={specs} />
        </div>

        {/* Print Footer */}
        <PrintFooter />

      </main>

      {/* Official Footer */}
      <Footer />

      {/* Modals */}
      <GibddCaptchaModal
        isOpen={isCaptchaOpen}
        captchaBase64={captchaBase64}
        isLoading={isCaptchaSubmitting}
        onClose={() => setIsCaptchaOpen(false)}
        onSubmit={handleVerifyCaptcha}
        onRefresh={handleRefreshCaptcha}
      />

      <FsspModal
        isOpen={isFsspOpen}
        onClose={() => setIsFsspOpen(false)}
        initialFio={fsspInitialParams.fio}
        initialRegion={fsspInitialParams.region}
      />

      <AuctionPhotosModal
        isOpen={isAuctionModalOpen}
        onClose={() => setIsAuctionModalOpen(false)}
        auctionData={auctionData}
      />

      <FinesModal
        isOpen={isFinesModalOpen}
        onClose={() => setIsFinesModalOpen(false)}
        initialPlate={plate}
        initialData={finesData}
        onFinesUpdated={setFinesData}
      />

      <KbmModal
        isOpen={isKbmModalOpen}
        onClose={() => setIsKbmModalOpen(false)}
        vin={vin}
        plate={plate}
      />
    </div>
  );
};

export default App;
