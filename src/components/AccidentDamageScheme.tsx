import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Calendar, MapPin, Wrench, Layers, Car } from 'lucide-react';
import { AiConclusionBox } from './AiConclusionBox';
import { CarBodySvg, ZONE_NAMES } from './CarBodySvg';
import type { ZoneDamageInfo, DamageSeverity } from './CarBodySvg';
import { PhotoBinderModal } from './PhotoBinderModal';

interface DamagePoint {
  id?: string;
  name: string;
  leftPercent?: number;
  topPercent?: number;
  severity?: 'light' | 'critical' | 'minor' | 'severe';
}

interface AccidentRecord {
  date: string;
  type?: string;
  region?: string;
  damage_desc?: string;
  damage_points?: string[];
  points?: DamagePoint[];
  source?: string;
}

interface AudatexEstimate {
  date?: string;
  source?: string;
  total_rub?: number;
  works_rub?: number;
  parts_rub?: number;
  repair_parts?: string[];
  replace_parts?: string[];
  paint_parts?: string[];
}

interface AccidentDamageSchemeProps {
  gibddData?: any;
  photos?: string[];
  audatexCalculations?: AudatexEstimate[];
}

// Словарь ключевых слов для интеллектуального маппинга деталей в 28 зон
const ZONE_KEYWORD_RULES: Record<string, string[]> = {
  front_bumper: ['бампер передн', 'передний бампер', 'front bumper', 'п/бампер', 'бампер п', 'переднего бампера'],
  rear_bumper: ['бампер задн', 'задний бампер', 'rear bumper', 'з/бампер', 'бампер з', 'заднего бампера'],
  headlight_l: ['фара лев', 'передняя левая фара', 'блок-фара лев', 'птф лев', 'противотуман лев', 'headlight left', 'headlight_l', 'левой фары'],
  headlight_r: ['фара прав', 'передняя правая фара', 'блок-фара прав', 'птф прав', 'противотуман прав', 'headlight right', 'headlight_r', 'правой фары'],
  hood: ['капот', 'hood', 'крышка капота', 'облицовка капота', 'капота'],
  fender_fl: ['крыло переднее левое', 'переднее левое крыло', 'крыло п/л', 'п.л. крыло', 'крыло пл', 'fender fl', 'fender_fl', 'крыла переднего левого'],
  fender_fr: ['крыло переднее правое', 'переднее правое крыло', 'крыло п/п', 'п.п. крыло', 'крыло пп', 'fender fr', 'fender_fr', 'крыла переднего правого'],
  windshield: ['лобовое', 'ветровое стекло', 'стекло ветровое', 'windshield', 'переднее стекло', 'лобового стекла'],
  pillar_a_l: ['стойка передняя левая', 'левая стойка а', 'передняя левая стойка', 'стойка а лев', 'стойка кузова передняя левая'],
  pillar_a_r: ['стойка передняя правая', 'правая стойка а', 'передняя правая стойка', 'стойка а прав', 'стойка кузова передняя правая'],
  roof: ['крыша', 'панель крыши', 'люк', 'панорама', 'roof', 'крыши'],
  door_fl: ['дверь передняя левая', 'передняя левая дверь', 'дверь водительская', 'дверь п/л', 'дверь пл', 'door fl', 'door_fl', 'двери передней левой'],
  door_fr: ['дверь передняя правая', 'передняя правая дверь', 'дверь пассажирская передняя', 'дверь п/п', 'дверь пп', 'door fr', 'door_fr', 'двери передней правой'],
  sill_l: ['порог лев', 'левый порог', 'накладка порога лев', 'боковина лев', 'sill l', 'sill_l', 'порога левого'],
  sill_r: ['порог прав', 'правый порог', 'накладка порога прав', 'боковина прав', 'sill r', 'sill_r', 'порога правого'],
  pillar_b_l: ['стойка средняя левая', 'левая стойка b', 'левая стойка б', 'стойка б лев', 'средняя левая стойка'],
  pillar_b_r: ['стойка средняя правая', 'правая стойка b', 'правая стойка б', 'стойка б прав', 'средняя правая стойка'],
  door_rl: ['дверь задняя левая', 'задняя левая дверь', 'дверь з/л', 'дверь зл', 'door rl', 'door_rl', 'двери задней левой'],
  door_rr: ['дверь задняя правая', 'задняя правая дверь', 'дверь з/п', 'дверь зп', 'door rr', 'door_rr', 'двери задней правой'],
  pillar_c_l: ['стойка задняя левая', 'левая стойка c', 'левая стойка с', 'стойка с лев', 'задняя левая стойка'],
  pillar_c_r: ['стойка задняя правая', 'правая стойка c', 'правая стойка с', 'стойка с прав', 'задняя правая стойка'],
  rear_window: ['заднее стекло', 'стекло заднее', 'стекло двери задка', 'rear window', 'заднего стекла'],
  trunk: ['крышка багажника', 'багажник', 'дверь задка', 'дверь багажника', 'пятая дверь', 'trunk', 'багажника'],
  fender_rl: ['крыло заднее левое', 'заднее левое крыло', 'крыло з/л', 'крыло зл', 'боковина задняя левая', 'fender rl', 'fender_rl', 'крыла заднего левого'],
  fender_rr: ['крыло заднее правое', 'заднее правое крыло', 'крыло з/п', 'крыло зп', 'боковина задняя правая', 'fender rr', 'fender_rr', 'крыла заднего правого'],
  taillight_l: ['фонарь задний левый', 'задний левый фонарь', 'задний фонарь л', 'taillight left', 'taillight_l', 'фонаря заднего левого'],
  taillight_r: ['фонарь задний правый', 'задний правый фонарь', 'задний фонарь п', 'taillight right', 'taillight_r', 'фонаря заднего правого'],
  floor: ['пол', 'днище', 'лонжерон', 'подрамник', 'силовая структура', 'рама', 'floor', 'chassis', 'геометрия кузова'],
};

// Зоны силовой структуры кузова (любой удар в них критичен)
const STRUCTURAL_ZONES = new Set([
  'pillar_a_l', 'pillar_a_r', 'pillar_b_l', 'pillar_b_r', 'pillar_c_l', 'pillar_c_r', 'roof', 'floor'
]);

export const AccidentDamageScheme: React.FC<AccidentDamageSchemeProps> = ({
  gibddData,
  photos = [],
  audatexCalculations = [],
}) => {
  const [selectedZone, setSelectedZone] = useState<ZoneDamageInfo | null>(null);
  const [isPhotoBinderOpen, setIsPhotoBinderOpen] = useState<boolean>(false);

  const accidents: AccidentRecord[] = Array.isArray(gibddData?.accidents) ? gibddData.accidents : [];
  const hasAccidents = accidents.length > 0;

  // Интеллектуальный расчет маппинга повреждений на 28 зон кузова
  const damageMap = useMemo<Record<string, ZoneDamageInfo>>(() => {
    const map: Record<string, ZoneDamageInfo> = {};

    // Инициализируем все 28 зон как целые (undamaged)
    Object.keys(ZONE_KEYWORD_RULES).forEach((zId) => {
      map[zId] = {
        zoneId: zId,
        name: ZONE_NAMES[zId] || zId,
        severity: 'undamaged',
        accidentDates: [],
        defectDescriptions: [],
        repairOperations: [],
      };
    });

    if (!hasAccidents && (!audatexCalculations || audatexCalculations.length === 0)) {
      return map;
    }

    // 1. Анализируем записи ДТП
    accidents.forEach((acc) => {
      const accDate = acc.date || 'Не указана';
      const desc = acc.damage_desc || acc.type || '';

      // Извлекаем все текстовые упоминания деталей
      const partNames: string[] = [];
      if (Array.isArray(acc.damage_points)) {
        partNames.push(...acc.damage_points);
      }
      if (Array.isArray(acc.points)) {
        acc.points.forEach((p) => {
          if (p?.name) partNames.push(p.name);
          if (p?.id) partNames.push(p.id);
        });
      }
      if (desc) {
        partNames.push(desc);
      }

      // Проверяем каждую зону кузова по ключевым словам
      Object.entries(ZONE_KEYWORD_RULES).forEach(([zoneId, keywords]) => {
        const matches = partNames.some((partStr) => {
          const lower = String(partStr).toLowerCase();
          return keywords.some((kw) => lower.includes(kw));
        });

        if (matches) {
          const isStructural = STRUCTURAL_ZONES.has(zoneId);
          const currentSeverity = map[zoneId].severity;

          // Определение степени тяжести повреждения
          let newSeverity: DamageSeverity = 'minor';
          if (
            isStructural ||
            desc.toLowerCase().includes('тотал') ||
            desc.toLowerCase().includes('сильн') ||
            desc.toLowerCase().includes('замен') ||
            desc.toLowerCase().includes('геометр')
          ) {
            newSeverity = 'severe';
          }

          if (currentSeverity === 'severe' || newSeverity === 'severe') {
            map[zoneId].severity = 'severe';
          } else {
            map[zoneId].severity = 'minor';
          }

          if (!map[zoneId].accidentDates?.includes(accDate)) {
            map[zoneId].accidentDates?.push(accDate);
          }
          if (desc && !map[zoneId].defectDescriptions?.includes(desc)) {
            map[zoneId].defectDescriptions?.push(desc);
          }
        }
      });
    });

    // 2. Дополняем данными страховых смет Audatex
    if (Array.isArray(audatexCalculations)) {
      audatexCalculations.forEach((estimate) => {

        Object.entries(ZONE_KEYWORD_RULES).forEach(([zoneId, keywords]) => {
          const matchedOps: string[] = [];
          const isReplace = (estimate.replace_parts || []).some((p) =>
            keywords.some((kw) => p.toLowerCase().includes(kw))
          );
          const isPaint = (estimate.paint_parts || []).some((p) =>
            keywords.some((kw) => p.toLowerCase().includes(kw))
          );
          const isRepair = (estimate.repair_parts || []).some((p) =>
            keywords.some((kw) => p.toLowerCase().includes(kw))
          );

          if (isReplace) matchedOps.push('Замена детали');
          if (isPaint) matchedOps.push('Окрас');
          if (isRepair) matchedOps.push('Ремонт / Рихтовка');

          if (matchedOps.length > 0) {
            const isStructural = STRUCTURAL_ZONES.has(zoneId);
            if (isReplace || isStructural) {
              map[zoneId].severity = 'severe';
            } else if (map[zoneId].severity === 'undamaged') {
              map[zoneId].severity = 'minor';
            }

            matchedOps.forEach((op) => {
              if (!map[zoneId].repairOperations?.includes(op)) {
                map[zoneId].repairOperations?.push(op);
              }
            });

            if (estimate.total_rub && !map[zoneId].estimateAmount) {
              map[zoneId].estimateAmount = estimate.total_rub;
            }
          }
        });
      });
    }

    return map;
  }, [accidents, audatexCalculations, hasAccidents]);

  // Статистика повреждений кузова
  const stats = useMemo(() => {
    let damagedCount = 0;
    let severeCount = 0;
    let hasStructuralDamage = false;

    Object.entries(damageMap).forEach(([zoneId, info]) => {
      if (info.severity !== 'undamaged') {
        damagedCount += 1;
        if (info.severity === 'severe') {
          severeCount += 1;
        }
        if (STRUCTURAL_ZONES.has(zoneId)) {
          hasStructuralDamage = true;
        }
      }
    });

    return {
      damagedCount,
      severeCount,
      hasStructuralDamage,
    };
  }, [damageMap]);

  const handleSelectZone = (zone: ZoneDamageInfo) => {
    setSelectedZone(zone);
    setIsPhotoBinderOpen(true);
  };

  return (
    <section id="dtp" className="report-card p-6 sm:p-7 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
      {/* Заголовок секции */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ДТП и векторная схема повреждений кузова
            </h2>
            <span className="text-[11px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
              28 зон
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Агрегированные данные из федеральной базы ГИБДД, страховых смет Audatex и фотоархива
          </p>
        </div>
        <div>
          {hasAccidents ? (
            <span className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-700 border border-rose-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Зафиксировано происшествий: {accidents.length}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ДТП не обнаружено
            </span>
          )}
        </div>
      </div>

      {/* Метрики целостности кузова */}
      {hasAccidents && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Повреждённых элементов</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <span className="font-mono">{stats.damagedCount} из 28</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                ({Math.round((stats.damagedCount / 28) * 100)}% кузова)
              </span>
            </div>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Сильная деформация / Замена</div>
            <div className={`text-lg font-extrabold mt-0.5 font-mono ${stats.severeCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stats.severeCount} деталей
            </div>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Силовая структура (лонжероны/стойки)</div>
            <div className="text-lg font-extrabold mt-0.5 flex items-center gap-1.5">
              {stats.hasStructuralDamage ? (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Нарушена
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Без повреждений
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Основной контент: Векторная схема + Карточки ДТП */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА (5 cols): Векторная интерактивная SVG схема кузова */}
        <div className="lg:col-span-5 flex flex-col items-center p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="w-full flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/70">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-rose-600" />
              Интерактивная 2D-схема кузова
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200/80">
              Нажмите на деталь
            </span>
          </div>

          {/* Векторный SVG компонент */}
          <CarBodySvg
            damageMap={damageMap}
            selectedZoneId={selectedZone?.zoneId}
            onSelectZone={handleSelectZone}
            className="w-full"
          />

          {/* Цветовая легенда схемы */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3.5 border-t border-slate-200/70 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 shrink-0"></span>
              <span>Завод / Целая</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-500 shrink-0"></span>
              <span>Косметика / Окрас</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-600 shrink-0"></span>
              <span>Замена / Сила</span>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (7 cols): Список происшествий или статус чистоты */}
        <div className="lg:col-span-7 space-y-4">
          {hasAccidents ? (
            <div className="space-y-4">
              {accidents.map((accident, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 bg-rose-50/80 border border-rose-200/70 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" /> Происшествие №{idx + 1}
                    </span>
                    <span className="text-xs font-bold bg-white border border-slate-300/80 text-slate-800 px-2.5 py-0.5 rounded-lg font-mono shadow-xs">
                      {accident.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {accident.type || 'Столкновение транспортных средств'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-mono">{accident.date}</span>
                    </div>
                    {accident.region && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{accident.region}</span>
                      </div>
                    )}
                  </div>

                  {accident.damage_desc && (
                    <div className="p-3 bg-white border border-slate-200/80 rounded-lg text-xs text-slate-700 mb-3 leading-relaxed shadow-xs">
                      <span className="font-bold text-slate-900">Описание повреждений: </span>
                      {accident.damage_desc}
                    </div>
                  )}

                  {/* Поврежденные элементы чипсы */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-slate-400" /> Повреждённые детали:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {((accident.damage_points && accident.damage_points.length > 0)
                        ? accident.damage_points
                        : (accident.points || []).map((p) => p.name)
                      ).map((name, pIdx) => (
                        <span
                          key={pIdx}
                          className="bg-amber-50 text-amber-900 border border-amber-300/80 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Страховые калькуляции Audatex при наличии */}
              {audatexCalculations && audatexCalculations.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-rose-600" /> Расчёты страховых смет ремонта (Audatex / Автотека)
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    Зафиксировано страховых расчётов: <strong className="text-slate-900">{audatexCalculations.length}</strong>.
                    Калькуляции учитывают стоимость запасных частей и норма-часов восстановительного ремонта.
                  </div>
                </div>
              )}

              <AiConclusionBox
                text={
                  stats.hasStructuralDamage
                    ? 'Внимание! Зафиксированы повреждения элементов силовой структуры или геометрии кузова. Требуется обязательная диагностика на стенде измерения геометрии перед покупкой.'
                    : 'Зафиксированы кузовные повреждения навесных деталей (бамперы, крылья, оптика). Силовая структура кузова, стойки и лонжероны по открытым базам не затронуты. Рекомендуется замер ЛКП толщиномером.'
                }
              />
            </div>
          ) : (
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-8 text-center space-y-3.5 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                Записей о ДТП не обнаружено
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                В базах Госавтоинспекции РФ с 2015 года записи о дорожно-транспортных происшествиях отсутствуют.
                Все 28 зон кузова находятся в заводском состоянии без зарегистрированных повреждений.
              </p>

              <AiConclusionBox
                text="В открытых государственных реестрах ГИБДД МВД и страховых архивах данные об авариях отсутствуют. Кузов не имеет официально зарегистрированных повреждений силовой структуры."
              />
            </div>
          )}
        </div>

      </div>

      {/* Фотоархив и модальное окно Photo Binder */}
      <PhotoBinderModal
        isOpen={isPhotoBinderOpen}
        onClose={() => setIsPhotoBinderOpen(false)}
        zoneInfo={selectedZone}
        photos={photos}
      />
    </section>
  );
};
