/* آدرس Web App گوگل را اینجا قرار دهید */
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf80N18t6Fe5T5SQHNmDSaqUEzt9qBaTj2U4WNeESonhiqoJ00KfeF03MOY9C4lycd/exec';

const activities = document.getElementById('activities');
const form = document.getElementById('reportForm');
const addBtn = document.getElementById('addActivity');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

function pad(n){return String(n).padStart(2,'0')}
function gregorianToJalali(gy,gm,gd){
  const gdm=[0,31,59,90,120,151,181,212,243,273,304,334];
  let gy2=gm>2?gy+1:gy, days=355666+365*gy+Math.floor((gy2+3)/4)-Math.floor((gy2+99)/100)+Math.floor((gy2+399)/400)+gd+gdm[gm-1];
  let jy=-1595+33*Math.floor(days/12053); days%=12053; jy+=4*Math.floor(days/1461); days%=1461;
  if(days>365){jy+=Math.floor((days-1)/365);days=(days-1)%365}
  const jm=days<186?1+Math.floor(days/31):7+Math.floor((days-186)/30); const jd=1+(days<186?days%31:(days-186)%30); return `${jy}/${pad(jm)}/${pad(jd)}`;
}
function todayJalali(){const d=new Date();return gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate())}

function activityTemplate(i){return `<div class="activity" data-index="${i}">
  <div class="activity-top"><span class="num">فعالیت ${i+1}</span><button type="button" class="remove" onclick="removeActivity(this)">حذف</button></div>
  <label>شرح فعالیت / پروژه
    <textarea class="description" required placeholder="فعالیت‌های انجام‌شده را دقیق و به ترتیب زمانی بنویسید. هر فعالیت را در یک خط جدا بنویسید."></textarea>
  </label>
  <div class="grid activity-grid">
    <label>وضعیت
      <select class="status" required><option value="">انتخاب وضعیت</option><option>انجام شد</option><option>در حال انجام</option><option>متوقف شد</option><option>تکمیل شد</option></select>
    </label>
    <label>درصد پیشرفت
      <input class="progress" type="number" min="0" max="100" step="1" value="0" required>
    </label>
    <label>تاریخ
      <input class="date" value="${todayJalali()}" required>
    </label>
  </div>
  <div class="row-two">
    <label>مبلغ / سند مرتبط<input class="document" placeholder="در صورت وجود"></label>
    <label>مسئول<input class="responsible" placeholder="نام مسئول"></label>
  </div>
  <div class="row-two">
    <label>اقدام بعدی<input class="nextAction" placeholder="در صورت وجود"></label>
    <label>توضیحات و موانع<input class="notes" placeholder="در صورت وجود"></label>
  </div>
</div>`}
function renumber(){[...activities.children].forEach((el,i)=>{el.querySelector('.num').textContent=`فعالیت ${i+1}`})}
function addActivity(){activities.insertAdjacentHTML('beforeend',activityTemplate(activities.children.length));renumber()}
function removeActivity(btn){if(activities.children.length===1){alert('حداقل یک فعالیت باید ثبت شود.');return}btn.closest('.activity').remove();renumber()}
window.removeActivity=removeActivity;
addBtn.addEventListener('click',addActivity);addActivity();

form.addEventListener('submit',async(e)=>{
 e.preventDefault(); message.className='';message.textContent='';
 if(GOOGLE_APPS_SCRIPT_URL.includes('PASTE_YOUR')){message.className='err';message.textContent='ابتدا آدرس Web App گوگل را در فایل script.js وارد کنید.';return}
 const cards=[...document.querySelectorAll('.activity')];
 const payload={employeeName:document.getElementById('employeeName').value.trim(),unitIndex:document.getElementById('unitIndex').value,activities:cards.map(c=>({description:c.querySelector('.description').value,status:c.querySelector('.status').value,progress:c.querySelector('.progress').value,date:c.querySelector('.date').value,document:c.querySelector('.document').value,responsible:c.querySelector('.responsible').value,nextAction:c.querySelector('.nextAction').value,notes:c.querySelector('.notes').value}))};
 submitBtn.disabled=true;submitBtn.textContent='در حال ثبت...';form.classList.add('busy');
 try{
   // text/plain + no-cors avoids a browser CORS preflight. The Apps Script endpoint processes the POST.
   await fetch(GOOGLE_APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload)});
   message.className='ok';message.textContent='گزارش با موفقیت ارسال شد.';form.reset();activities.innerHTML='';addActivity();
 }catch(err){message.className='err';message.textContent='ارسال انجام نشد. اتصال اینترنت و آدرس Web App را بررسی کنید.';}
 finally{submitBtn.disabled=false;submitBtn.textContent='ثبت گزارش روزانه';form.classList.remove('busy')}
});
