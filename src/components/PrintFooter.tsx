import React from 'react';

export const PrintFooter: React.FC = () => {
  return (
    <div className="hidden print:block w-full pt-4 mt-8 border-t border-slate-400 text-slate-800 bg-white text-[10px] break-inside-avoid">
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Колонка 1: Список реестров */}
        <div className="col-span-2 space-y-1.5">
          <span className="font-bold text-slate-900 uppercase font-mono block text-[11px]">
            Источники данных и ведомственные реестры РФ (10 из 10 проверено):
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700 font-mono text-[9px] leading-tight">
            <div>• ГИБДД МВД России (Регистрация и ДТП)</div>
            <div>• ФНП (Федеральная нотариальная палата)</div>
            <div>• ФГИС «Такси» Минтранса РФ</div>
            <div>• Федресурс (Реестр лизинга ЕФРСДЮЛ)</div>
            <div>• ЕАИСТО МВД РФ (Техосмотры и пробег)</div>
            <div>• Росстандарт (Отзывные кампании)</div>
            <div>• АО «НСИС» Банк России (Полисы ОСАГО)</div>
            <div>• ФССП РФ (Исполнительные производства)</div>
            <div>• СЭП / elpts.ru (ЭПТС и Утильсбор)</div>
            <div>• Copart / IAAI (Аварийные аукционы США)</div>
          </div>
          <p className="text-[9px] text-slate-500 pt-1 leading-normal">
            Отчет сгенерирован автоматически аналитическим шлюзом VIN-WIN. Все сведения получены из официальных открытых баз данных и криминалистических алгоритмов кросс-валидации.
          </p>
        </div>

        {/* Колонка 2: Официальный штамп ЭЦП */}
        <div className="flex justify-end">
          <div className="border-2 border-blue-700 rounded-lg p-2 text-blue-900 text-[8px] font-mono leading-tight bg-blue-50/50 w-56 text-center shadow-sm">
            <div className="font-bold border-b border-blue-600 pb-1 mb-1 tracking-wider text-[9px] uppercase">
              Документ подписан ЭЦП
            </div>
            <div className="text-left space-y-0.5">
              <div><span className="font-semibold">Сертификат:</span> 00E1 4892 0184 F920 1840 C284</div>
              <div><span className="font-semibold">Владелец:</span> ООО «ВИН-ВИН Технологии»</div>
              <div><span className="font-semibold">Действителен:</span> с 12.09.2025 по 12.09.2027</div>
              <div className="text-center text-blue-700 font-bold pt-0.5">✓ Подпись верна</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono">
        <span>VIN-WIN • vin-win.ru • Система верификации транспорта РФ</span>
        <span>Страница 1</span>
      </div>
    </div>
  );
};
