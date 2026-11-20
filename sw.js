/* Street Hoops 1v1 offline cache. Network first, so updates arrive when online; cache when offline. */
const C='sh1v1-v2',PRE=['./','index.html','manifest.webmanifest','icon.svg','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>c.add(new Request(u,{mode:u.startsWith('http')?'no-cors':'same-origin'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin&&!u.href.includes('peerjs'))return;
 e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')).then(m=>m||caches.match('./')).then(m=>m||new Response('Offline',{status:503}))))});
