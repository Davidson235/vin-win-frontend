import React from 'react';
import { Send, Shield, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/95 py-10 px-4 text-xs text-slate-500 font-sans print-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Legal notices */}
        <div className="space-y-2 text-center md:text-left max-w-2xl leading-relaxed">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">VIN-WIN</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              v2.4 Pro
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Верифицировано по ГОСТ
            </span>
          </div>
          <p className="text-slate-600 text-xs">
            Отчёт сформирован на основании сведений из открытых государственных и коммерческих реестров РФ (ГИБДД, ФНП, ЕАИСТО, ФГИС «Такси», НСИС, Федресурс, Росстандарт, ФССП).
          </p>
          <p className="text-[11px] text-slate-400">
            Выводы, скоринг и аналитические рекомендации подготовлены с применением алгоритмов кросс-валидации реестров и носят информационно-аналитический характер.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            © 2025–2026 VIN-WIN • Все права защищены
          </p>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-slate-600 font-medium">
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200/90 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-bold text-xs">Telegram-бот проверки авто</span>
          </a>
          <span className="text-slate-300">•</span>
          <span className="cursor-pointer hover:text-rose-600 transition flex items-center gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Оферта
          </span>
          <span className="text-slate-300">•</span>
          <span className="cursor-pointer hover:text-rose-600 transition flex items-center gap-1.5 text-xs">
            <Shield className="w-3.5 h-3.5 text-slate-400" /> Конфиденциальность
          </span>
        </div>

      </div>
    </footer>
  );
};

