# Password Generator

Генератор паролей на Next.js + Tailwind CSS + TypeScript с двумя режимами:
- **Random** — криптографически случайный пароль (Web Crypto API)
- **Memorable** — запоминающийся пароль из трёх слов с мнемоникой

---

## Деплой на Vercel за 3 шага

### Шаг 1 — Создай репозиторий на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Зайди на [github.com](https://github.com), создай новый репозиторий и запушь:

```bash
git remote add origin https://github.com/ТВО_ИМЯ/password-generator.git
git branch -M main
git push -u origin main
```

### Шаг 2 — Импортируй проект в Vercel

1. Открой [vercel.com/new](https://vercel.com/new)
2. Нажми **"Import Git Repository"**
3. Выбери свой репозиторий `password-generator`
4. Vercel автоматически определит Next.js — нажми **Deploy**

### Шаг 3 — Готово!

Через ~1 минуту сайт будет доступен по адресу вида:  
`https://password-generator-xxxx.vercel.app`

---

## Локальный запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## Сборка для продакшена

```bash
npm run build
npm run start
```

---

## Технологии

- **Next.js 16** (App Router)
- **React 19** (функциональные компоненты + хуки)
- **Tailwind CSS v4**
- **TypeScript** (strict mode)
- **Web Crypto API** — все пароли генерируются только в браузере

## Google AdSense

Для подключения AdSense добавь скрипт в `src/app/layout.tsx` внутри `<head>`:

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-ТВОЙ_ID"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

Не забудь добавить `import Script from 'next/script'` в начале файла.
