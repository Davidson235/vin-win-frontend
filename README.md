# VIN-WIN Web Frontend

Интерактивный веб-интерфейс аналитической платформы проверки истории и состояния автомобилей **VIN-WIN**.

## Стек технологий

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (иконки)

## Структура проекта

```text
web_frontend/
├── public/              # Статические ассеты (favicon, схемы ДТП)
├── src/
│   ├── components/      # UI-компоненты отчета (схемы повреждений, модальные окна, таймлайн)
│   ├── utils/           # Утилиты и демо-данные (sampleReport.ts)
│   ├── App.tsx          # Корневой компонент интерфейса
│   ├── index.css        # Стили и дизайн-система Tailwind v4
│   └── main.tsx         # Точка входа приложения
├── index.html
├── package.json
└── vite.config.ts
```

## Установка и запуск

1. **Установка зависимостей**:

   ```bash
   npm install
   ```

2. **Запуск в режиме разработки**:

   ```bash
   npm run dev
   ```

3. **Сборка для продакшена**:

   ```bash
   npm run build
   ```
