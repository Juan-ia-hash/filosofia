const CACHE='rousseau-presentation-v1';
const ASSETS=['/','/icon.svg','/images/rousseau.jpg','/images/hobbes.jpg','/images/forest.svg','/images/peru.svg','/images/community.svg','/images/city.svg','/images/palace.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('rousseau-presentation-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{
 if(event.data?.type!=='CACHE_PRESENTATION')return;
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const urls=[...new Set([...ASSETS,...event.data.urls])].filter(url=>new URL(url,self.location.origin).origin===self.location.origin);
  await Promise.all(urls.map(async url=>{if(!(await cache.match(url)))await cache.add(url);}));
  event.source?.postMessage({type:'OFFLINE_READY'});
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(event.request);
   if(response.ok)await cache.put(event.request,response.clone());
   return response;
  }catch(error){
   const saved=await cache.match(event.request);
   if(saved)return saved;
   if(event.request.mode==='navigate'){const home=await cache.match('/');if(home)return home;}
   throw error;
  }
 })());
});
