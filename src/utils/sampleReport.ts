/**
 * Stitch MCP Sample Report: Audi A6 Avant 3.0 TDI Quattro
 * Generated for "Пример отчета" mode to provide instant preview matching Stitch screen 3.
 */

export const SAMPLE_AUDI_A6 = {
  vin: 'WAUZZZ4G8EN054129',
  plate: 'О777ОО777',
  riskLevel: 'WARNING' as const,
  specs: {
    brand: 'Audi',
    model: 'A6 Avant 3.0 TDI Quattro',
    generation: 'Поколение C7 Рестайлинг (2018 г.в.)',
    year: 2018,
    power_hp: 245,
    engine_volume_liters: 3.0,
    engine_model: '3.0 CR V6 (CKVD)',
    engine_number: 'CKV 084120',
    color: 'Mythos Black (0E0E) Черный металлик',
    transmission: '7-АКПП S tronic',
    drive: 'Постоянный 4x4 Quattro (Torsen 40/60)',
    body_type: 'Универсал 5-дв. S line',
    sts_number: '77 92 841920',
    pts_type: 'ЭПТС (Электронный паспорт ТС)',
    customs: 'ФТС РФ Очищен (Ввоз 22.09.2018)',
    category: 'B / Легковой универсал',
  },
  photosData: {
    count: 14,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsuolHM5XS1UjWA0rLCYqWSo4J4mrGZwZKcJNEHLU1PXKauIjGt3Gvul1GfrdBfQ5VCnxoT6-iy2_1bQAY9lx9VPn-NhvlRUwtpy1Zh1jOcH-o8Xg0IanxUL7DFJHIyp5xFqdibTgfOSrNbKdvC2OmdQ45lbqhlNgvZymnZrTJ1JVyd_UFHpMRkHCs8s89grEqRpZhW1Pwql2z5sTFfzT6O8xHsenIfmKb7CTQ0ejK2VdLhCepa0Wo'
    ],
    source: 'Студийный архив VIN-WIN'
  },
  gibddData: {
    periods: [
      {
        from: '24.09.2018',
        to: '12.06.2021',
        owner_type: 'Физическое лицо',
        duration_months: 32,
        region: 'г. Москва'
      },
      {
        from: '14.07.2021',
        to: 'наст. время',
        owner_type: 'Физическое лицо',
        duration_months: 38,
        region: 'г. Москва'
      }
    ],
    accidents: [
      {
        date: '14.03.2023',
        accident_type: 'Столкновение двух ТС',
        region: 'г. Москва, ул. Тверская',
        damage_points: [1, 2], // 1: Front bumper, 2: Front left fender
        damage_desc: 'Деформация переднего бампера, левого крыла и левой светодиодной блок-фары Matrix LED',
        audatex_calculation: 184000
      }
    ],
    restrictions: []
  },
  odometerData: {
    has_rollback: true,
    rollback_details: 'Зафиксировано расхождение пробега: при ДТП в 2023 г. указан пробег 52 000 км после фиксации 107 000 км в ЕАИСТО',
    current_odometer: 62150,
    points: [
      { date: '15.09.2019', mileage: 28400, km: 28400, source: 'ТО Дилер Audi' },
      { date: '10.09.2020', mileage: 54200, km: 54200, source: 'ТО Дилер Audi', diff: 25800 },
      { date: '12.06.2021', mileage: 81000, km: 81000, source: 'Продажа на Auto.ru', diff: 26800 },
      { date: '20.08.2022', mileage: 107000, km: 107000, source: 'Диагностическая карта ЕАИСТО', diff: 26000 },
      { date: '14.03.2023', mileage: 52000, km: 52000, source: 'ЦБД ГИБДД (ДТП)', rollback: true, is_rollback: true, diff: -55000 },
      { date: '10.02.2024', mileage: 62150, km: 62150, source: 'Диагностическая карта ЕАИСТО', diff: 10150 }
    ]
  },
  eaistoData: {
    records: [
      {
        number: '084201928491823',
        date: '10.02.2024',
        valid_to: '10.02.2025',
        odometer: 62150,
        result: 'Соответствует требованиям безопасности'
      },
      {
        number: '028471928491820',
        date: '20.08.2022',
        valid_to: '20.08.2023',
        odometer: 107000,
        result: 'Соответствует требованиям безопасности'
      }
    ]
  },
  osagoData: {
    found: true,
    company: 'САО «РЕСО-Гарантия»',
    policy_number: 'ХХХ 0284719284',
    valid_from: '15.11.2025',
    valid_to: '14.11.2026',
    kbm: 0.46,
    purpose: 'Личное использование (не такси)',
    insured_fio: 'Смирнов Алексей Владимирович'
  },
  fnpData: {
    found: false,
    records: [],
    status_text: 'Залоги в реестре ФНП не обнаружены'
  },
  fedresursData: {
    found: false,
    records: [],
    status_text: 'Договоров лизинга не найдено'
  },
  taxiData: {
    found: false,
    records: [],
    status_text: 'Разрешений на перевозку пассажиров (такси) не выдавалось'
  },
  carsharingData: {
    found: false,
    records: [],
    status_text: 'В реестрах операторов каршеринга не числится'
  },
  finesData: {
    checked: true,
    total_fines_count: 2,
    unpaid_fines_count: 0,
    total_amount_rub: 1500,
    fines: [
      {
        uin: '18810177240412891024',
        date: '12.04.2024 11:24',
        article: '12.9 ч.2 КоАП РФ (Превышение скорости на 20-40 км/ч)',
        amount: 500,
        paid: true,
        location: 'г. Москва, проспект Мира, д. 112'
      },
      {
        uin: '18810177240119847192',
        date: '19.01.2024 16:42',
        article: '12.16 ч.1 КоАП РФ (Несоблюдение требований разметки)',
        amount: 1000,
        paid: true,
        location: 'г. Москва, Ленинградский проспект, д. 36'
      }
    ]
  },
  recallsData: {
    found: true,
    campaigns: [
      {
        campaign_number: 'RC-2022-AUDI-04',
        title: 'Замена обратного клапана вакуумного усилителя тормозов',
        date: '18.11.2022',
        status: 'Требуется обращение к официальному дилеру (Бесплатно)',
        cost_rub: 0
      }
    ]
  },
  // Decoded Factory PR-Codes (Audi AG)
  prCodes: [
    {
      code: '1BK',
      category: 'Подвеска',
      title: 'Adaptive Air Suspension',
      description: 'Электронно-управляемая адаптивная пневматическая подвеска с бесступенчатым демпфированием.'
    },
    {
      code: '8G4',
      category: 'Оптика',
      title: 'Audi Matrix LED Headlights',
      description: 'Матричные светодиодные фары с динамическими указателями поворота спереди и сзади.'
    },
    {
      code: '9VD',
      category: 'Акустика',
      title: 'Bang & Olufsen 3D Premium Sound',
      description: 'Премиум-акустическая система с 16 динамиками, сабвуфером и 15-канальным усилителем на 705 Вт.'
    },
    {
      code: 'N5D',
      category: 'Интерьер',
      title: 'Кожа Valcona с тиснением S',
      description: 'Спортивные кресла S line с вентиляцией, электрической регулировкой и памятью положений.'
    },
    {
      code: 'PCN',
      category: 'Безопасность',
      title: 'Пакет ассистентов «Tour»',
      description: 'Адаптивный круиз-контроль (ACC) Stop&Go, контроль полосы, распознавание знаков и Audi pre sense front.'
    },
    {
      code: '3FU',
      category: 'Крыша',
      title: 'Панорамная стеклянная крыша',
      description: 'Двухсекционный панорамный люк с электроприводом сдвига/подъема и солнцезащитной шторкой.'
    }
  ],
  // Audatex / DAT Insurance Damage Ledger
  audatexCalculations: [
    {
      date: '14.03.2021',
      city: 'Москва',
      type: 'Столкновение двух ТС (Наезд на препятствие)',
      insurer: 'СПАО «Ингосстрах»',
      amount_rub: 385400,
      description: 'Замена: бампер передний, фара правая в сборе, крыло правое, решетка радиатора S line.'
    },
    {
      date: '19.11.2022',
      city: 'Санкт-Петербург',
      type: 'Касательное столкновение на парковке',
      insurer: 'ПАО «РЕСО-Гарантия»',
      amount_rub: 78500,
      description: 'Ремонт и окраска задней правой двери и арки крыла.'
    }
  ],
  audatexTotalRub: 463900,
  // Detailed 4 parts breakdown
  damageParts: [
    {
      title: 'Передний бампер S line',
      action: 'Замена на новый оригинал + покраска (14.03.2021)',
      severity: 'replace'
    },
    {
      title: 'Правая LED Matrix фара',
      action: 'Разрушение креплений и стекла. Замена блока (14.03.2021)',
      severity: 'replace'
    },
    {
      title: 'Правое переднее крыло',
      action: 'Деформация ребра жесткости. Замена и подгонка',
      severity: 'replace'
    },
    {
      title: 'Капот алюминиевый',
      action: 'Локальный ремонт кромки, окрас с переходом (до 210 мкм)',
      severity: 'paint'
    }
  ],
  // Expert Recommendation Verdict
  expertRecommendation: {
    title: 'Рекомендация эксперта перед покупкой',
    verdict: 'Автомобиль юридически безопасен для сделки (залоги и обременения отсутствуют), однако требует обязательного торга и углубленной компьютерной диагностики блоков управления (ECU, коробка передач S tronic) по причине подтвержденной скрутки одометра на 45 000 км и кузовных ремонтов правой передней четверти на сумму 385 400 ₽.',
    cta: 'Заказать выездной осмотр эксперта',
    ctaBadge: 'Выезд за 60 минут в СПб и МСК'
  }
};
