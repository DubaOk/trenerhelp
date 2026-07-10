# TrenerHelp

Мобильное PWA-приложение (CRM) для персонального тренера: клиенты, расписание, программы тренировок, оплаты и статистика. Оптимизировано под телефон — крупные кнопки, всё в 1–2 тапа.

**Продакшн:** https://trenerhelp.pages.dev

## Стек

| Слой | Технология |
|---|---|
| UI | React 19 + Vite 8 |
| Стили | Tailwind CSS v4 (CSS-first тема), шрифты Inter + Space Grotesk (bundled), шрифт НБРБ для знака BYN |
| Роутинг | react-router-dom (HashRouter), нижняя таб-навигация |
| Данные | Dexie.js (IndexedDB) — офлайн-first, реактивные запросы через dexie-react-hooks |
| Синхронизация | Dexie Cloud — вход по email (OTP), автосинк между устройствами, изоляция данных каждого тренера |
| Графики | Recharts (динамика замеров, доход по неделям) |
| PWA | vite-plugin-pwa (service worker, манифест, установка на главный экран, работа офлайн) |
| Хостинг | Cloudflare Pages (деплой через wrangler) |
| Тесты/проверка | Playwright (скриптовые прогоны с проверкой экранов) |

## Ключевая бизнес-логика

- **Денежный учёт** ([src/utils/subscription.js](src/utils/subscription.js)): баланс клиента = внесённые деньги − стоимость проведённых тренировок. Отрицательный баланс = долг (виден на «Сегодня» и в Финансах).
- **Цены** ([src/data/pricing.js](src/data/pricing.js)): обычная тренировка / сплит (в паре) — настраиваются в Финансах. Цена **фиксируется в тренировке в момент отметки «пришёл»** — повышение цен не пересчитывает историю.
- **Каждая 10-я тренировка — в подарок** (не списывает деньги), прогресс до подарка виден в карточке клиента.
- **Сплит-тренировки**: несколько участников в один слот (по записи на каждого — своя отметка посещения и своё списание по цене «в паре»).
- **Программы** (планы по дням, «День 1: ноги…») с автоподсказкой следующего дня по истории клиента.

## Структура

```
src/
  data/        db.js (Dexie-схема, версии+миграции) · seed.js (дефолты/демо) ·
               pricing.js (цены, фиксация) · backup.js (экспорт/импорт JSON) · cloudConfig.js
  utils/       subscription.js (денежный движок) · date.js · format.js · id.js
  hooks/       useClientDerived (баланс/статус) · useTodaySessions · useDateRangeStats
  components/  today/ clients/ schedule/ finance/ statistics/ — экраны
               layout/ (BottomNav, BottomSheet, Fab, WelcomeScreen, SettingsSheet)
               ui/ (Button, Picker — кастомный дропдаун-шторка, Money, Badge, icons)
```

## Команды

```bash
npm run dev              # dev-сервер (localhost:5173)
npm run dev -- --host    # + доступ из локальной сети
npm run build            # production-сборка в dist/
npx wrangler pages deploy dist --project-name trenerhelp   # деплой на Cloudflare Pages
```

## Dexie Cloud

База: `https://z7znbyrj2.dexie.cloud` (URL в [src/data/cloudConfig.js](src/data/cloudConfig.js), ключ в `dexie-cloud.key` — не коммитить).

```bash
npx dexie-cloud whitelist <origin>   # разрешить новый домен (нужно при смене хостинга/домена)
npx dexie-cloud whitelist            # список разрешённых
```

Бесплатный тариф: 3 production-пользователя. При первом входе локальные данные автоматически загружаются в облако.

## Дизайн

Стиль по [DESIGN.md](DESIGN.md): тёплая «бумажная» монохромная палитра (Ash/Ivory/Graphite) + один оранжевый акцент (Ember), заголовки Space Grotesk weight 400, три «диалекта» скруглений (пилюли-кнопки / асимметричные featured-карточки / круглая навигация), CSS-анимации с уважением к prefers-reduced-motion.
