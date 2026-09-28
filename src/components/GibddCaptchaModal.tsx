import React, { useState } from 'react';
import { X, RefreshCw, Send, ShieldCheck, Loader2 } from 'lucide-react';

interface GibddCaptchaModalProps {
  isOpen: boolean;
  captchaBase64: string;
  onClose: () => void;
  onSubmit: (code: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const GibddCaptchaModal: React.FC<GibddCaptchaModalProps> = ({
  isOpen,
  captchaBase64,
  onClose,
  onSubmit,
  onRefresh,
  isLoading,
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white border border-slate-200/90 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Закрыть (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Проверка по базе ГИБДД.РФ
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">
          Для бесплатного получения официальной истории регистраций, ДТП и ограничений введите 5 цифр с проверочной картинки Госавтоинспекции:
        </p>

        {/* Captcha Image */}
        <div className="flex items-center justify-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/90 mb-4 shadow-2xs">
          {captchaBase64 ? (
            <img
              src={captchaBase64}
              alt="Капча ГИБДД"
              className="h-12 object-contain rounded select-none shadow-xs"
            />
          ) : (
            <div className="h-12 flex items-center text-xs text-slate-400 font-mono">
              Загрузка капчи...
            </div>
          )}
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Обновить капчу"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="5 цифр капчи"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={5}
            className="w-full bg-slate-50/70 border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 rounded-xl px-4 py-3 text-center text-xl text-slate-900 font-mono tracking-widest focus:outline-none transition shadow-inner font-bold"
            autoFocus
          />

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Отправить</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

