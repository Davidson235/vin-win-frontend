import React, { useEffect, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  badge?: string;
  badgeColor?: 'green' | 'red' | 'amber';
}

interface ReportSidebarProps {
  finesCount?: number;
  accidentsCount?: number;
  hasPledges?: boolean;
  hasRestrictions?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Общая оценка' },
  { id: 'car-info', label: 'Что мы проверили' },
  { id: 'owners', label: 'История владения' },
  { id: 'probeg', label: 'Пробег' },
  { id: 'eaisto', label: 'Техосмотры (ЕАИСТО)' },
  { id: 'dtp', label: 'ДТП' },
  { id: 'restrict', label: 'Ограничения' },
  { id: 'search', label: 'Розыск' },
  { id: 'zalog', label: 'Залоги' },
  { id: 'fines', label: 'Штрафы' },
  { id: 'taxi', label: 'Такси' },
  { id: 'carsharing', label: 'Каршеринг' },
  { id: 'osago', label: 'ОСАГО' },
  { id: 'offerlist', label: 'Найденные объявления' },
  { id: 'recalls', label: 'Отзывные кампании' },
  { id: 'vin-data', label: 'Данные по VIN' },
  { id: 'offers', label: 'Похожие предложения' },
];

export const ReportSidebar: React.FC<ReportSidebarProps> = ({
  finesCount = 0,
  accidentsCount = 0,
  hasPledges = false,
  hasRestrictions = false,
}) => {
  const [activeId, setActiveId] = useState<string>('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  const getItemBadge = (id: string) => {
    if (id === 'dtp' && accidentsCount > 0) {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          {accidentsCount}
        </span>
      );
    }
    if (id === 'zalog' && hasPledges) {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          Залог
        </span>
      );
    }
    if (id === 'restrict' && hasRestrictions) {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          Блок
        </span>
      );
    }
    if (id === 'fines' && finesCount > 0) {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {finesCount}
        </span>
      );
    }
    return null;
  };

  return (
    <aside className="w-[220px] flex-shrink-0 hidden lg:block sticky top-24 self-start">
      <nav className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] text-sm space-y-0.5">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Разделы отчёта
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const badge = getItemBadge(item.id);

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition duration-150 text-[13px] font-medium ${
                isActive
                  ? 'bg-rose-50/90 text-rose-700 font-semibold border-l-[3px] border-rose-600 rounded-r-xl shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/90'
              }`}
            >
              <span className="truncate">{item.label}</span>
              {badge}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
