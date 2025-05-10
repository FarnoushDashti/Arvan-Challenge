
# Arvan-Challenge

## مستندات پیاده‌سازی و نگهداری پروژه

### معرفی پروژه
این پروژه یک وب‌اپلیکیشن مدیریت مقالات است که با استفاده از Vue 3 (فرانت‌اند) و Express (بک‌اند) پیاده‌سازی شده و امکاناتی مانند احراز هویت، ایجاد، ویرایش، حذف و مشاهده مقاله را فراهم می‌کند.

### تکنولوژی‌ها
- **فرانت‌اند:** Vue 3 + Vite + TailwindCSS
- **بک‌اند:** Express.js
- **سایر:** Axios، Moment.js

### ساختار پروژه
- `/src/views` : صفحات اصلی (مقالات، لاگین، ثبت‌نام و ...)
- `/src/components` : کامپوننت‌های قابل استفاده مجدد (Toast، Modal و ...)
- `/src/layouts` : لایه‌بندی صفحات
- `/server` : کدهای بک‌اند (Express)
- `tailwind.config.js` : تنظیمات استایل سفارشی

### نحوه اجرا
```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور بک‌اند
npm run start

# اجرای فرانت‌اند (در تب دیگر)
npm run dev
```
سپس پروژه روی `http://localhost:5173` (یا پورت Vite) در دسترس است.

### نکات نگهداری
- برای بروزرسانی پکیج‌ها از `npm update` استفاده کنید.
- تمام استایل‌ها با Tailwind و کلاس‌های سفارشی پیاده‌سازی شده‌اند.
- برای افزودن قابلیت جدید، یک فایل جدید در `/src/views` بسازید و آن را به router اضافه کنید.
- برای افزودن API جدید، در `/server/server.js` endpoint جدید تعریف کنید.
- قبل از هر تغییر، یک شاخه (branch) جدید ایجاد کنید و پس از اعمال تغییرات، با توضیح مناسب commit و سپس push کنید.

---

## لینک مخزن پروژه

[مشاهده پروژه در گیت‌هاب](https://github.com/FarnoushDashti/Arvan-Challenge)

---

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
