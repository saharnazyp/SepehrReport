نسخه GitHub Pages فرم سپهر

1) فایل‌های public را در یک GitHub repository قرار بده.
2) در فایل public/script.js مقدار GOOGLE_APPS_SCRIPT_URL را با آدرس Web App گوگل جایگزین کن.
3) در Code.gs فعلی، فایل Code_Google_Apps_Script_Addition.gs را اضافه کن (تابع doPost).
4) Apps Script را Deploy > New deployment > Web app کن:
   Execute as: Me
   Who has access: Anyone
5) نسخه جدید را Deploy کن و URL /exec را در script.js قرار بده.
6) GitHub: Settings > Pages > Deploy from branch > main > /public (اگر گزینه /public موجود بود) یا فایل‌ها را در root بگذار و Pages را از root انتخاب کن.

نکته: نام و نام خانوادگی در فرم دریافت می‌شود ولی عمداً در 8 ستون شیت نوشته نمی‌شود؛ ساختار 8 ستون فعلی حفظ شده است.
هر خط غیرخالی شرح فعالیت در submitReport به یک ردیف جداگانه تبدیل می‌شود.
