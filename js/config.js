/* Configuración pública. No colocar claves API ni credenciales aquí. */
window.RR_CONFIG = Object.freeze({
  // Obligatorio: número COMERCIAL con código de país, solo dígitos, sin +.
  whatsappNumber: '',
  draftMinutes: 120,
  stores: [
    {id:'unsch',name:'TIENDAS UNSCH',address:'Jr. San Martín N° 374, Ayacucho, Perú.',image:'images/unsch.jpg',enabled:true},
    {id:'vi-market',name:'VI MARKET',address:'Jr. Asamblea N° 138, Ayacucho, Perú.',image:'images/vimarket.jpg',enabled:true},
    {id:'montefino',name:'Montefino',address:'Jr. 28 de Julio N° 262, Plaza More, Ayacucho, Perú.',image:'images/montefino.jpg',enabled:true}
  ]
});
