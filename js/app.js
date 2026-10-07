(function(){
 'use strict';
 const products=window.RR_PRODUCTS, config=window.RR_CONFIG, core=window.RR_RESERVATION;
 const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const stores=config.stores.filter(s=>s.enabled), draftKey='royal-raymi-reservation-v1';
 let product=null, returnFocus=null, category='Todos';
 const dialog=$('#reservation-dialog'),form=$('#reservation-form'),fields=['storeId','name','phone','pickup'];
 const categories=['Todos',...new Set(products.map(p=>p.category))];
 function openDialog(element,trigger){returnFocus=trigger||document.activeElement;element.showModal();}
 function closeDialog(element){element.classList.add('closing');setTimeout(()=>{element.close();element.classList.remove('closing');returnFocus?.focus?.();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:180);}
 document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target===d)closeDialog(d);});});
 document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
 const menu=$('.menu-toggle'),nav=$('#main-nav');
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();}});
 const header=$('.site-header');
 const sizeHeader=()=>document.documentElement.style.setProperty('--header-height',header.offsetHeight+'px');sizeHeader();
 if('ResizeObserver' in window)new ResizeObserver(sizeHeader).observe(header);else window.addEventListener('resize',sizeHeader);
 function watchImages(root){root.querySelectorAll('.product-photo img').forEach(img=>{
  const finish=()=>img.parentElement.classList.add(img.naturalWidth?'loaded':'failed');
  img.addEventListener('load',finish,{once:true});img.addEventListener('error',finish,{once:true});if(img.complete)finish();
 });}
 function cards(list){return list.map(p=>`<article class="product-card"><button class="photo-button" data-detail="${esc(p.id)}" aria-label="Ver ${esc(p.name)}"><span class="product-photo"><img src="${esc(p.image_url)}" alt="${esc(p.name)}" width="1000" height="1250" loading="lazy" decoding="async"><span class="image-failure">Imagen no disponible</span></span>${p.cacao_percent!=null?`<span class="cacao-badge">${p.cacao_percent}% cacao</span>`:''}</button><div class="product-copy"><span class="eyebrow">${esc(p.category)}</span><h2><button data-detail="${esc(p.id)}">${esc(p.name)}</button></h2><p>${esc(p.description||'Descubre esta presentación y consulta su disponibilidad en tu punto de recojo.')}</p><button class="button reserve" data-reserve="${esc(p.id)}">Reservar <span aria-hidden="true">↗</span></button></div></article>`).join('');}
 function wireCards(root){watchImages(root);root.querySelectorAll('[data-reserve]').forEach(b=>b.addEventListener('click',()=>reserve(b.dataset.reserve,b)));root.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.detail,b)));
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arrived');observer.unobserve(e.target);}}),{threshold:.07});root.querySelectorAll('.product-card').forEach(c=>observer.observe(c));}
 }
 function detail(id,trigger){const p=products.find(x=>x.id===id);if(!p)return;$('#detail-title').textContent=p.name;
  $('#detail-content').innerHTML=`<div class="detail-layout"><div>${[p.image_url,...(p.gallery_urls||[])].map(src=>`<img src="${esc(src)}" alt="${esc(p.name)}" width="1000" height="1250" loading="lazy">`).join('')}</div><div><span class="eyebrow">${esc(p.category)}</span><p>${esc(p.description||'Consulta los detalles de esta presentación con nuestro equipo.')}</p><p>Disponibilidad sujeta a confirmación del establecimiento.</p><button class="button" id="detail-reserve">Reservar ↗</button></div></div>`;
  $('#detail-reserve').addEventListener('click',()=>{$('#product-dialog').close();reserve(id,trigger);});openDialog($('#product-dialog'),trigger);
 }
 function renderCatalog(){const target=$('#catalog');if(!target)return;const q=($('#search').value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let list=products.filter(p=>(category==='Todos'||p.category===category)&&(p.name+' '+p.description).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));if($('#sort').value==='name')list=list.slice().sort((a,b)=>a.name.localeCompare(b.name,'es'));
  target.innerHTML=cards(list);wireCards(target);$('#active-category').textContent=category;$('#product-count').textContent=list.length+' productos';$('#empty-state').hidden=!!list.length;
 }
 if($('#catalog')){
  const requested=new URLSearchParams(location.search).get('categoria');if(categories.includes(requested))category=requested;
  $('#category-list').innerHTML=categories.map(c=>`<button data-category="${esc(c)}" aria-pressed="${c===category}">${esc(c)} <span aria-hidden="true">↗</span></button>`).join('');
  $('#open-categories').addEventListener('click',e=>openDialog($('#category-dialog'),e.currentTarget));
  $('#category-list').addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;category=button.dataset.category;$('#category-list').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCatalog();closeDialog($('#category-dialog'));});
  $('#search').addEventListener('input',renderCatalog);$('#sort').addEventListener('change',renderCatalog);renderCatalog();
 }
 if($('#featured-products')){const root=$('#featured-products');root.innerHTML=cards(products.slice(0,4));wireCards(root);}
 if($('#store-list'))$('#store-list').innerHTML=stores.map(s=>`<article class="store-card"><img src="${esc(s.image)}" alt="${esc(s.name)}" width="700" height="500" loading="lazy"><div><span class="eyebrow">⌖ PUNTO DE RECOJO</span><h2>${esc(s.name)}</h2><p>${esc(s.address)}</p><p class="muted">Confirma disponibilidad y horario antes de tu visita.</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}" target="_blank" rel="noopener noreferrer">Ver ubicación ↗</a><a class="button outline" href="tienda.html">Elegir producto</a></div></article>`).join('');
 stores.forEach(s=>{const o=document.createElement('option');o.value=s.id;o.textContent=s.name+' · '+s.address;form.elements.storeId.append(o);});
 function values(){return Object.fromEntries(fields.map(k=>[k,form.elements[k].value]));}
 function readDraft(){try{const d=JSON.parse(sessionStorage.getItem(draftKey)||'null');if(d&&Date.now()-d.savedAt<config.draftMinutes*60000&&d.values&&typeof d.values==='object')return d;sessionStorage.removeItem(draftKey);}catch{}return null;}
 function saveDraft(){if(!product)return;try{sessionStorage.setItem(draftKey,JSON.stringify({savedAt:Date.now(),productId:product.id,values:values()}));}catch{$('#reservation-status').textContent='El navegador no permite guardar el borrador. Puedes continuar sin guardarlo.';}}
 function reserve(id,trigger){product=products.find(p=>p.id===id);if(!product)return;
  const draft=readDraft();form.reset();fields.forEach(k=>{form.elements[k].value=typeof draft?.values[k]==='string'?draft.values[k]:'';$('#error-'+k).textContent='';form.elements[k].removeAttribute('aria-invalid');});
  if(!stores.some(s=>s.id===form.elements.storeId.value))form.elements.storeId.value='';
  const minimum=new Date(Date.now()-5*3600000+60000).toISOString().slice(0,16);form.elements.pickup.min=minimum;
  $('#reservation-product').textContent=product.name;$('#reservation-status').textContent='';$('#whatsapp-fallback').hidden=true;$('#message-preview').textContent='Completa los datos para preparar tu solicitud.';
  saveDraft();openDialog(dialog,trigger);
 }
 function showErrors(errors,only){fields.forEach(k=>{if(only&&k!==only)return;$('#error-'+k).textContent=errors[k]||'';form.elements[k].setAttribute('aria-invalid',String(!!errors[k]));});}
 fields.forEach(k=>{const el=form.elements[k];el.addEventListener('input',()=>{showErrors(core.validate(values(),stores),k);saveDraft();$('#whatsapp-fallback').hidden=true;$('#message-preview').textContent='';});el.addEventListener('blur',()=>showErrors(core.validate(values(),stores),k));el.addEventListener('change',()=>{showErrors(core.validate(values(),stores),k);saveDraft();});});
 $('#clear-draft').addEventListener('click',()=>{try{sessionStorage.removeItem(draftKey);}catch{}form.reset();showErrors({});$('#message-preview').textContent='';$('#whatsapp-fallback').hidden=true;$('#reservation-status').textContent='Borrador borrado de esta pestaña.';});
 form.addEventListener('submit',e=>{e.preventDefault();if(!product)return;const data=values(),errors=core.validate(data,stores);showErrors(errors);if(Object.keys(errors).length){form.elements[Object.keys(errors)[0]].focus();$('#reservation-status').textContent='Revisa los campos indicados antes de continuar.';return;}
  const text=core.message(product,stores.find(s=>s.id===data.storeId),data);$('#message-preview').textContent=text;saveDraft();
  try{const link=core.url(config.whatsappNumber,text);const fallback=$('#whatsapp-fallback');fallback.href=link;fallback.hidden=false;$('#reservation-status').textContent='Se abrirá WhatsApp. Envía allí el mensaje y espera la respuesta del establecimiento.';window.location.assign(link);}catch(err){$('#reservation-status').textContent='La tienda todavía no ha configurado su WhatsApp comercial. Tu solicitud no ha sido enviada. Puedes conservar el borrador y volver más tarde.';}
 });
})();
