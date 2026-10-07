(function(root){
 'use strict';
 const clean=value=>String(value||'').trim().replace(/\s+/g,' ');
 function phone(value){const s=clean(value).replace(/[\s()-]/g,'');if(/^9\d{8}$/.test(s))return '+51'+s;return /^\+[1-9]\d{7,14}$/.test(s)?s:null;}
 function pickupTimestamp(value){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return NaN;
  const ms=Date.parse(value+'-05:00');
  if(!Number.isFinite(ms)||new Date(ms-5*3600000).toISOString().slice(0,16)!==value)return NaN;
  return ms;
 }
 function validate(values,stores,now=Date.now()){
  const errors={};const name=clean(values.name);
  if(name.length<5||name.length>100||!/^\p{L}[\p{L}\p{M} .'’-]+\s+[\p{L}\p{M} .'’-]+$/u.test(name))errors.name='Escribe tu nombre y apellido (hasta 100 caracteres).';
  if(!phone(values.phone))errors.phone='Usa un celular peruano de 9 dígitos o un número internacional con +.';
  if(!stores.some(s=>s.enabled&&s.id===values.storeId))errors.storeId='Selecciona un punto de recojo disponible.';
  const timestamp=pickupTimestamp(values.pickup);
  if(!Number.isFinite(timestamp)||timestamp<=now)errors.pickup='Elige una fecha y hora futura, en horario de Perú.';
  return errors;
 }
 function message(product,store,values){
  const [date,time]=values.pickup.split('T');const [year,month,day]=date.split('-');
  return ['Hola, Royal Raymi. Quisiera consultar disponibilidad y solicitar una reserva para recojo.', '',`Producto: ${product.name}`,`Referencia: ${product.slug}`,`Punto de recojo: ${store.name}`,`Dirección: ${store.address}`,`Nombre: ${clean(values.name)}`,`Teléfono: ${phone(values.phone)}`,`Recojo orientativo: ${day}/${month}/${year}, ${time} (hora de Perú)`, '', 'Entiendo que esta es una solicitud de disponibilidad y reserva, no una confirmación automática. Quedo atento a la confirmación del establecimiento.'].join('\n');
 }
 function url(number,text){if(!/^[1-9]\d{7,14}$/.test(number))throw Error('Configura el número comercial de WhatsApp.');return 'https://wa.me/'+number+'?text='+encodeURIComponent(text);}
 root.RR_RESERVATION={clean,phone,pickupTimestamp,validate,message,url};
})(typeof window==='undefined'?globalThis:window);
