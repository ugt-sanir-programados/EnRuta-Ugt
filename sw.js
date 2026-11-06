// Caché de la interfaz local. No intercepta mapas externos ni respuestas con direcciones o GPS.
const CACHE='en-ruta-ugt-shell-v1';
const ASSETS=["./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./favicon.png", "./en-ruta.css", "./assets/ugt.png", "./assets/sanir.jpg", "./assets/en-ruta.svg", "./vendor/leaflet/leaflet.js", "./vendor/leaflet/leaflet.css", "./vendor/leaflet/images/layers.png", "./vendor/leaflet/images/layers-2x.png", "./vendor/leaflet/images/marker-icon.png", "./vendor/leaflet/images/marker-icon-2x.png", "./vendor/leaflet/images/marker-shadow.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('en-ruta-ugt-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const shell=new URL('./index.html',self.registration.scope).href;
 const cached=target=>caches.open(CACHE).then(cache=>cache.match(target));
 if(request.mode==='navigate'&&url.pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith(fetch(request).catch(async()=>await cached(shell)||new Response('Sin conexión. Vuelve a abrir En Ruta cuando tengas internet.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));return;
 }
 if(ASSETS.some(path=>new URL(path,self.registration.scope).href===url.href))event.respondWith(fetch(request).catch(()=>cached(request)));
});
