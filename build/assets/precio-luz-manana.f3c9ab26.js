import"./styles.a4c63ff9.js";import{d as l}from"./tomorrow_price.43e27c55.js";import{d as m}from"./omie_data.e85400b9.js";import{d as w}from"./omie_compensacion_data.428777e6.js";import{t as s,b as g}from"./table.80c4a304.js";let a=new Date().getHours(),n=new Date().getMinutes();a=a<10?`0${a}`:a;n=n<10?`0${n}`:n;const f=1220,b=790,E=845,r=new Date;r.setDate(r.getDate()+1);const c={weekday:"long",month:"long",day:"numeric"},x=+m[0].day,S=+m[0].month,I=+l[0].day.split("/")[0],D=+l[0].day.split("/")[1],_=a*60+ +n>=f&&a<24,y=a*60+ +n>=E&&a<24,A=a*60+ +n>=b&&a<24,z=_?I:x,M=_?D:S,O=z===r.getDate()&&M===r.getMonth()+1;let d=m.filter(({price:t})=>t),T=w.map(({precio:t,hora:e,dia:i})=>({day:i,hour:e,price:t}));y&&(d=Object.values([...d,...T].reduce((t,{hour:e,price:i})=>(t[e]={hour:e,price:(t[e]?t[e].price:0)+i},t),{})));let o=_?l:d;const p=document.getElementById("table-next-day-data"),v=_?"ESIOS":y?"OMIE + COMPENSACI\xD3N GAS":"OMIE";o=o.sort(({price:t},{price:e})=>t-e);const u=document.querySelector(".table-next-day");o=o.map(({price:t,...e})=>({price:t.toFixed(3),...e}));for(let[t,e]of o.entries())t<8?e.zone="valle":t>=8&&t<16?e.zone="llano":e.zone="punta";h();if(A&&O)u.style.display="grid",p.textContent=`Los datos de los precios son de la subasta de: ${v}`,p.style.display="block";else{const t=document.getElementById("warning-tomorrow-data");t.textContent=`Todav\xEDa no hay datos disponibles para ma\xF1ana: ${r.toLocaleDateString("es-ES",c)}`,u.style.display="none"}function h(){o=o.sort(({price:t},{price:e})=>t-e),s(o.slice(0,12),".table-next-day-grid-left"),s(o.slice(12,24),".table-next-day-grid-right")}function L(){o=o.sort(({hour:t},{hour:e})=>t-e),s(o.slice(0,12),".table-next-day-grid-left"),s(o.slice(12,24),".table-next-day-grid-right")}document.getElementById("order-price-next").addEventListener("click",()=>{g(),h()});document.getElementById("order-hour-next").addEventListener("click",()=>{g(),L()});const $=`whatsapp://send?text=Aqu\xED puedes consultar el precio de la luz de ma\xF1ana ${r.toLocaleDateString("es-ES",c)} https://www.apaga-luz.com/precio-luz-manana/?utm_source=whatsapp_mnn`,k=document.getElementById("btn-whatsapp-manana");k.href=$;document.title=`Precio de la luz ma\xF1ana ${r.toLocaleDateString("es-ES",c)} | Consulta ahora`;
