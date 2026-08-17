const $=id=>document.getElementById(id),money=n=>'₦'+Math.round(n).toLocaleString('en-NG');
let s={from:'',to:'',date:'',base:0,details:{}};
const routes={'Lagos-Abuja':10000,'Abuja-Lagos':10000,'Lagos-Benin City':7000,'Benin City-Lagos':7000,'Lagos-Port Harcourt':10000,'Port Harcourt-Lagos':10000,'Lagos-Ibadan':5000,'Ibadan-Lagos':5000,'Lagos-Warri':8000,'Warri-Lagos':8000,'Abuja-Benin City':9000,'Benin City-Abuja':9000,'Abuja-Enugu':7000,'Enugu-Abuja':7000,'Lagos-Enugu':9000,'Enugu-Lagos':9000,'Lagos-Owerri':9500,'Owerri-Lagos':9500};
function fee(){return 100}
function quote(){ $('quote').textContent=money(fee())}
['from','to','date','type','weight','speed'].forEach(x=>$(x).onchange=()=>{s.from=$('from').value;s.to=$('to').value;s.date=$('date').value;quote()});
$('date').min=new Date().toISOString().slice(0,10);quote();
function page(n){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));$(n).classList.remove('hidden');scrollTo({top:0,behavior:'smooth'})}
$('next1').onclick=()=>{s.from=$('from').value;s.to=$('to').value;s.date=$('date').value;if(!s.from||!s.to||!s.date)return alert('Please select pickup city, delivery city and pickup date.');if(s.from===s.to)return alert('Pickup and delivery cities must be different.');page('p2')};
$('back1').onclick=()=>page('p1');
$('form').onsubmit=e=>{e.preventDefault();s.details=Object.fromEntries(new FormData(e.target));$('summary').innerHTML=`<div><span>Route</span><b>${s.from} → ${s.to}</b></div><div><span>Pickup date</span><b>${new Date(s.date+'T00:00:00').toLocaleDateString('en-NG')}</b></div><div><span>Sender</span><b>${s.details.sender}</b></div><div><span>Receiver</span><b>${s.details.receiver}</b></div><div><span>Package</span><b>${s.details.contents}</b></div>`;$('total').textContent=money(fee());page('p3')};
$('back2').onclick=()=>page('p2');
$('pay').onclick=()=>{let r='NC-'+Date.now().toString().slice(-8);$('ref').textContent=r;$('ticket').innerHTML=`<p><b>Tracking reference:</b> ${r}</p><p><b>From:</b> ${s.from} — ${s.details.pickupAddress}</p><p><b>To:</b> ${s.to} — ${s.details.deliveryAddress}</p><p><b>Receiver:</b> ${s.details.receiver} · ${s.details.receiverPhone}</p><p><b>Package:</b> ${s.details.contents}</p><p><b>Fee:</b> ${money(fee())}</p>`;page('done')};