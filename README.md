# User Management API with Authentication

# وب‌سرویس مدیریت کاربران با احراز هویت

[cite_start]این پروژه یک API RESTful برای مدیریت کاربران است که با استفاده از Node.js، Express و MongoDB ساخته شده است[cite: 3]. [cite_start]این سیستم از معماری استاندارد لایه‌ای (Controller-Service) بهره می‌برد [cite: 4] [cite_start]و امنیت آن توسط توکن‌های JWT، هش کردن رمزهای عبور با bcrypt [cite: 3] و کش کردن توکن‌ها با Redis تامین می‌شود.

## 🚀 ویژگی‌ها (Features)

- [cite_start]**ثبت‌نام و ورود:** احراز هویت امن با هش کردن رمز عبور قبل از ذخیره‌سازی[cite: 20, 32, 33].
- [cite_start]**مدیریت توکن‌ها (JWT + Redis):** تولید توکن‌های JWT [cite: 33] و کش کردن/مدیریت آن‌ها با استفاده از Redis برای افزایش امنیت و کارایی.
- [cite_start]**کنترل دسترسی مبتنی بر نقش (RBAC):** پشتیبانی از نقش‌های `user` و `admin` برای محدودسازی دسترسی‌ها[cite: 15, 44].
- [cite_start]**اعتبارسنجی داده‌ها:** بررسی و اعتبارسنجی ورودی‌های کاربر با استفاده از `express-validator`[cite: 45].
- [cite_start]**معماری لایه‌بندی شده:** تفکیک منطق برنامه به لایه‌های مسیرها (Routes)، کنترلرها (Controllers)، سرویس‌ها (Services) و مدل‌ها (Models)[cite: 4].
- [cite_start]**مدیریت خطای سراسری (Global Error Handling):** ساختار یکپارچه برای مدیریت خطاها[cite: 46].

## 🛠 تکنولوژی‌های استفاده شده (Tech Stack)

- [cite_start]**Backend:** Node.js, Express [cite: 3]
- [cite_start]**Database:** MongoDB (Mongoose) [cite: 3]
- [cite_start]**Authentication & Security:** JWT (JSON Web Tokens), bcrypt [cite: 3]
- **Caching:** Redis (برای کش کردن و مدیریت بلک‌لیست توکن‌ها)
- [cite_start]**Validation:** express-validator [cite: 45]

## 📂 ساختار پروژه (Project Structure)

[cite_start]ساختار پوشه‌بندی این پروژه به شکل زیر است[cite: 60]:

```text
├── src/
│   ├── config/          # تنظیمات دیتابیس و Redis [cite: 62, 63]
│   ├── models/          # مدل‌های Mongoose (مانند User.js) [cite: 64, 65]
│   ├── services/        # منطق تجاری و تعامل با دیتابیس [cite: 66, 67]
│   ├── controllers/     # مدیریت درخواست‌ها و پاسخ‌ها [cite: 68, 69, 70]
│   ├── middleware/      # میدلورهای احراز هویت، دسترسی و اعتبارسنجی [cite: 71, 72, 73, 74, 75]
│   ├── routes/          # تعریف مسیرهای API [cite: 76, 77, 78]
│   ├── utils/           # توابع کمکی و ثابت‌ها [cite: 79, 80]
│   └── app.js           # نقطه ورود اصلی برنامه [cite: 81]
```
