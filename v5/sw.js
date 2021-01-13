try{self["workbox:core:6.0.2"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:6.0.2"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class a extends n{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class i{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:a,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let r=i&&i.handler;const c=e.method;if(!r&&this.i.has(c)&&(r=this.i.get(c)),!r)return;let o;try{o=r.handle({url:s,request:e,event:t,params:a})}catch(e){o=Promise.reject(e)}return o instanceof Promise&&this.o&&(o=o.catch((n=>this.o.handle({url:s,request:e,event:t})))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this.t.get(s.method)||[];for(const i of a){let a;const r=i.match({url:e,sameOrigin:t,request:s,event:n});if(r)return a=r,(Array.isArray(r)&&0===r.length||r.constructor===Object&&0===Object.keys(r).length||"boolean"==typeof r)&&(a=void 0),{route:i,params:a}}return{}}setDefaultHandler(e,t="GET"){this.i.set(t,s(e))}setCatchHandler(e){this.o=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const c=()=>(r||(r=new i,r.addFetchListener(),r.addCacheListener()),r);function o(e,s,i){let r;if("string"==typeof e){const t=new URL(e,location.href);r=new n((({url:e})=>e.href===t.href),s,i)}else if(e instanceof RegExp)r=new a(e,s,i);else if("function"==typeof e)r=new n(e,s,i);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=e}return c().registerRoute(r),r}const h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[h.prefix,e,h.suffix].filter((e=>e&&e.length>0)).join("-"),l=e=>e||u(h.precache),f=e=>e||u(h.runtime);function d(e){e.then((()=>{}))}const w=new Set;class p{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.h=null,this.u=e,this.l=t,this.p=s,this.v=n||(()=>this.close())}get db(){return this.h}async open(){if(!this.h)return this.h=await new Promise(((e,t)=>{let s=!1;setTimeout((()=>{s=!0,t(new Error("The open request was blocked and timed out"))}),this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.l);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.p&&this.p(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.v.bind(this),e(t))}})),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map((e=>e.key))}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:a,includeKeys:i=!1}={}){return await this.transaction([e],"readonly",((r,c)=>{const o=r.objectStore(e),h=t?o.index(t):o,u=[],l=h.openCursor(s,n);l.onsuccess=()=>{const e=l.result;e?(u.push(i?e:e.value),a&&u.length>=a?c(u):e.continue()):c(u)}}))}async transaction(e,t,s){return await this.open(),await new Promise(((n,a)=>{const i=this.h.transaction(e,t);i.onabort=()=>a(i.error),i.oncomplete=()=>n(),s(i,(e=>n(e)))}))}async g(e,t,s,...n){return await this.transaction([t],s,((s,a)=>{const i=s.objectStore(t),r=i[e].apply(i,n);r.onsuccess=()=>a(r.result)}))}close(){this.h&&(this.h.close(),this.h=null)}}p.prototype.OPEN_TIMEOUT=2e3;const v={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(v))for(const s of t)s in IDBObjectStore.prototype&&(p.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:6.0.2"]&&_()}catch(e){}const b=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class y{constructor(e){this.m=e,this.h=new p("workbox-expiration",1,{onupgradeneeded:e=>this.R(e)})}R(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise(((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}}))})(this.m)}async setTimestamp(e,t){const s={url:e=b(e),timestamp:t,cacheName:this.m,id:this.q(e)};await this.h.put("cache-entries",s)}async getTimestamp(e){return(await this.h.get("cache-entries",this.q(e))).timestamp}async expireEntries(e,t){const s=await this.h.transaction("cache-entries","readwrite",((s,n)=>{const a=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),i=[];let r=0;a.onsuccess=()=>{const s=a.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&r>=t?i.push(s.value):r++),s.continue()}else n(i)}})),n=[];for(const e of s)await this.h.delete("cache-entries",e.id),n.push(e.url);return n}q(e){return this.m+"|"+b(e)}}class g{constructor(e,t={}){this.j=!1,this.U=!1,this._=t.maxEntries,this.L=t.maxAgeSeconds,this.N=t.matchOptions,this.m=e,this.C=new y(e)}async expireEntries(){if(this.j)return void(this.U=!0);this.j=!0;const e=this.L?Date.now()-1e3*this.L:0,t=await this.C.expireEntries(e,this._),s=await self.caches.open(this.m);for(const e of t)await s.delete(e,this.N);this.j=!1,this.U&&(this.U=!1,d(this.expireEntries()))}async updateTimestamp(e){await this.C.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.L){return await this.C.getTimestamp(e)<Date.now()-1e3*this.L}return!1}async delete(){this.U=!1,await this.C.expireEntries(1/0)}}try{self["workbox:strategies:6.0.2"]&&_()}catch(e){}const m={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};function R(){return(R=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n])}return e}).apply(this,arguments)}function q(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class j{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}function x(e){return"string"==typeof e?new Request(e):e}class U{constructor(e,t){this.T={},Object.assign(this,t),this.event=t.event,this.D=e,this.K=new j,this.O=[],this.S=[...e.plugins],this.k=new Map;for(const e of this.S)this.k.set(e,{});this.event.waitUntil(this.K.promise)}fetch(e){return this.waitUntil((async()=>{const{event:s}=this;let n=x(e);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const a=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))n=await e({request:n.clone(),event:s})}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const i=n.clone();try{let e;e=await fetch(n,"navigate"===n.mode?void 0:this.D.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:i,response:e});return e}catch(e){throw a&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:a.clone(),request:i.clone()}),e}})())}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}cacheMatch(e){return this.waitUntil((async()=>{const t=x(e);let s;const{cacheName:n,matchOptions:a}=this.D,i=await this.getCacheKey(t,"read"),r=R({},a,{cacheName:n});s=await caches.match(i,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:a,cachedResponse:s,request:i,event:this.event})||void 0;return s})())}async cachePut(e,s){const n=x(e);var a;await(a=0,new Promise((e=>setTimeout(e,a))));const i=await this.getCacheKey(n,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=i.url,new URL(String(r),location.href).href.replace(new RegExp("^"+location.origin),""))});var r;const c=await this.P(s);if(!c)return;const{cacheName:o,matchOptions:h}=this.D,u=await self.caches.open(o),l=this.hasCallback("cacheDidUpdate"),f=l?await async function(e,t,s,n){const a=q(t.url,s);if(t.url===a)return e.match(t,n);const i=R({},n,{ignoreSearch:!0}),r=await e.keys(t,i);for(const t of r)if(a===q(t.url,s))return e.match(t,n)}(u,i.clone(),["__WB_REVISION__"],h):null;try{await u.put(i,l?c.clone():c)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:f,newResponse:c.clone(),request:i,event:this.event})}async getCacheKey(e,t){if(!this.T[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=x(await e({mode:t,request:s,event:this.event,params:this.params}));this.T[t]=s}return this.T[t]}hasCallback(e){for(const t of this.D.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this.D.plugins)if("function"==typeof t[e]){const s=this.k.get(t),n=n=>{const a=R({},n,{state:s});return t[e](a)};yield n}}waitUntil(e){return this.O.push(e),e}async doneWaiting(){let e;for(;e=this.O.shift();)await e}destroy(){this.K.resolve()}async P(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class L{constructor(e={}){this.cacheName=f(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new U(this,{event:t,request:s,params:n}),i=this.M(a,s,t);return[i,this.W(i,a,s,t)]}async M(e,s,n){await e.runCallbacks("handlerWillStart",{event:n,request:s});let a=void 0;try{if(a=await this.A(s,e),!a||"error"===a.type)throw new t("no-response",{url:s.url})}catch(t){for(const i of e.iterateCallbacks("handlerDidError"))if(a=await i({error:t,event:n,request:s}),a)break;if(!a)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))a=await t({event:n,request:s,response:a});return a}async W(e,t,s,n){let a,i;try{a=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(e){i=e}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:i}),t.destroy(),i)throw i}}function N(e,t){const s=t();return e.waitUntil(s),s}try{self["workbox:precaching:6.0.2"]&&_()}catch(e){}function E(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(n,location.href),i=new URL(n,location.href);return a.searchParams.set("__WB_REVISION__",s),{cacheKey:a.href,url:i.href}}class C{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class T{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=t&&t.cacheKey||this.I.getCacheKeyForURL(e.url);return s?new Request(s):e},this.I=e}}let D;async function K(e,s){let n=null;if(e.url){n=new URL(e.url).origin}if(n!==self.location.origin)throw new t("cross-origin-copy-response",{origin:n});const a=e.clone(),i={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},r=s?s(i):i,c=function(){if(void 0===D){const e=new Response("");if("body"in e)try{new Response(e.body),D=!0}catch(e){D=!1}D=!1}return D}()?a.body:await a.blob();return new Response(c,r)}const O={cacheWillUpdate:async({response:e})=>e.redirected?await K(e):e};class S extends L{constructor(e={}){e.cacheName=l(e.cacheName),super(e),this.B=!1!==e.fallbackToNetwork,this.plugins.push(O)}async A(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this.F(e,t):await this.H(e,t))}async H(e,s){let n;if(!this.B)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return n=await s.fetch(e),n}async F(e,s){const n=await s.fetchAndCachePut(e);let a=Boolean(n);if(n&&n.status>=400&&!this.G()&&(a=!1),!a)throw new t("bad-precaching-response",{url:e.url,status:n.status});return n}G(){return this.plugins.some((e=>e.cacheWillUpdate&&e!==O))}}class k{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this.V=new Map,this.$=new Map,this.J=new Map,this.D=new S({cacheName:l(e),plugins:[...t,new T({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.D}precache(e){this.addToCacheList(e),this.X||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.X=!0)}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:a}=E(n),i="string"!=typeof n&&n.revision?"reload":"default";if(this.V.has(a)&&this.V.get(a)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.V.get(a),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.J.has(e)&&this.J.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:a});this.J.set(e,n.integrity)}if(this.V.set(a,e),this.$.set(a,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return N(e,(async()=>{const t=new C;this.strategy.plugins.push(t);for(const[t,s]of this.V){const n=this.J.get(s),a=this.$.get(t),i=new Request(t,{integrity:n,cache:a,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:i,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return N(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this.V.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.V}getCachedURLs(){return[...this.V.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.V.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=R({cacheKey:s},t.params),this.strategy.handle(t))}}let P;const M=()=>(P||(P=new k),P);class W extends n{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const e of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const i=new URL(e,location.href);i.hash="",yield i.href;const r=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(i,t);if(yield r.href,s&&r.pathname.endsWith("/")){const e=new URL(r.href);e.pathname+=s,yield e.href}if(n){const e=new URL(r.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:i});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(e);if(t)return{cacheKey:t}}}),e.strategy)}}var A,I;self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),A={},function(e){M().precache(e)}([{url:"/v5/assets/a.0dea9028.json",revision:"d3ee4aa856a05727328ce982655d2e94"},{url:"/v5/assets/a.1841132a.json",revision:"aee3b52fbef469ab34143f23829eb82d"},{url:"/v5/assets/a.1cbe572a.json",revision:"2f62e7c53f6585ee5539ccd79b5128c5"},{url:"/v5/assets/a.1f48f115.json",revision:"a8ca5ba114e20d5193d8819ff942af14"},{url:"/v5/assets/a.2a051692.json",revision:"b93ebf07e4fb6eeb8ea03ad3e255420a"},{url:"/v5/assets/a.31e02f64.json",revision:"96a631c312ff228103ed5431e1a64ee1"},{url:"/v5/assets/a.37f2027b.json",revision:"ada62900628de5d9324dc1a69dce62b9"},{url:"/v5/assets/a.3a1055aa.json",revision:"9c788732271006a1cfc28c58165f228d"},{url:"/v5/assets/a.548e89c5.json",revision:"67f15123fc8be71934d66970a8c6e262"},{url:"/v5/assets/a.55d6bf93.json",revision:"03ac84531bf0e0ccc8ffdc7e674b0fa3"},{url:"/v5/assets/a.57c39e99.json",revision:"9b737b257fa88b1b75a231da09efcb79"},{url:"/v5/assets/a.591230d6.json",revision:"4ce68d68dc9532aa1511e7e1f2623d13"},{url:"/v5/assets/a.6190cb35.json",revision:"22edff7b64557882a00b954b8d1a2c67"},{url:"/v5/assets/a.6c254f15.json",revision:"69952abe463e91fe66b2a136ec58cf43"},{url:"/v5/assets/a.72cb4d30.json",revision:"105d508994b692f8730c563736995373"},{url:"/v5/assets/a.7f2e17a9.json",revision:"ba50a948823b3ab7e721ae90dc4fae93"},{url:"/v5/assets/a.7f9e5e17.json",revision:"7335cbeccc54bcd11f6d6989645de2f9"},{url:"/v5/assets/a.81de9639.json",revision:"a34fd1e0b6a0a58e54d757e0ff65833d"},{url:"/v5/assets/a.8e663da7.json",revision:"14c21186b33a5c3b6ade74ff5164fa6f"},{url:"/v5/assets/a.b3e3566d.json",revision:"032fd24539b358b7d63ae75e7e6242ae"},{url:"/v5/assets/a.c4ccdc58.json",revision:"c83447e229ac7ca56f1aa2e763c08272"},{url:"/v5/assets/a.c852f966.json",revision:"c0bb046de2f6d375b73d48ce20f2b382"},{url:"/v5/assets/a.c89bfa3b.json",revision:"a405476bd4b4ef6fdc0bea945cd3d8cf"},{url:"/v5/assets/a.ce6b825a.json",revision:"ba96393963ceb5fc068a122e022cee94"},{url:"/v5/assets/a.d397cd54.json",revision:"9d8192b936cc8aa225313a429ff435ae"},{url:"/v5/assets/a.e53e8df2.json",revision:"0e01fd24cabe31df5ddc9675b11a08da"},{url:"/v5/assets/a.fb36041d.json",revision:"c82a9dc2b5e765953b0a2099abd66073"},{url:"/v5/assets/a.fb3a29b4.json",revision:"541806ba61d3c00102917734876b16b6"},{url:"/v5/assets/content_pages_searchIndexes.en.b757abbd.json",revision:"3aea8480847d67cb968a79b6a5c90b8d"},{url:"/v5/assets/content_pages_summaries.en.ebe5914d.json",revision:"97be031ab8aa93883d744160a1db1884"},{url:"/v5/app-icons/android-chrome-192x192.png",revision:"0b18304dea12cc8d59c9528a00d37ee8"},{url:"/v5/app-icons/android-chrome-256x256.png",revision:"8da8a7602d1cc4d21a70445eda7e8e62"},{url:"/v5/app-icons/apple-touch-icon.png",revision:"e2be3ed5414bed313d9219504bd7224f"},{url:"/v5/app-icons/favicon-16x16.png",revision:"c72946f88111cb426093e6bdb63fa70b"},{url:"/v5/app-icons/favicon-32x32.png",revision:"e53028dac3ae19a1ebd8c2ed0a0772a8"},{url:"/v5/app-icons/favicon.ico",revision:"bc4c3c662b5614ee2e63ac9bd79cafa4"},{url:"/v5/app-icons/mstile-150x150.png",revision:"ffd33ced9004c319a6743d79a61d23c3"},{url:"/v5/app-icons/safari-pinned-tab.svg",revision:"1171db203c6305482c696d3f702c83f6"},{url:"/v5/fonts/StardosStencil-Bold.woff2",revision:"1c20088eb1050b0b81483791c320d03f"},{url:"/v5/fonts/StardosStencil-Regular.woff2",revision:"54e90de15eb7c8d1d4ddb71ebc125937"},{url:"/v5/manifest.json",revision:"9a2195c0c368b7ae215a188a95ff7f26"},{url:"/v5/index.html",revision:"239545755163bd53692cf120bac57795"},{url:"/v5/bootstrap.9aa1466b.js",revision:"9e4f31ce72d8e856540aedbd01365486"},{url:"/v5/51b9cc103e05f66c.png",revision:"62d05a9e2e6273d588849a035ed9925e"}]),function(e){const t=M();o(new W(t,e))}(A),self.addEventListener("activate",(e=>{const t=l();e.waitUntil((async(e,t="-precache-")=>{const s=(await self.caches.keys()).filter((s=>s.includes(t)&&s.includes(self.registration.scope)&&s!==e));return await Promise.all(s.map((e=>self.caches.delete(e)))),s})(t).then((e=>{})))})),o(new class extends n{constructor(e,{allowlist:t=[/./],denylist:s=[]}={}){super((e=>this.Y(e)),e),this.Z=t,this.ee=s}Y({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;const s=e.pathname+e.search;for(const e of this.ee)if(e.test(s))return!1;return!!this.Z.some((e=>e.test(s)))}}((I="/v5/index.html",M().createHandlerBoundToURL(I)))),o(/\/v5\/images\//,new class extends L{constructor(e){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(m)}async A(e,s){const n=s.fetchAndCachePut(e).catch((()=>{}));let a,i=await s.cacheMatch(e);if(i);else try{i=await n}catch(e){a=e}if(!i)throw new t("no-response",{url:e.url,error:a});return i}}({cacheName:"images",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this.te(n),i=this.se(s);d(i.expireEntries());const r=i.updateTimestamp(t.url);if(e)try{e.waitUntil(r)}catch(e){}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.se(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.ne=e,this.L=e.maxAgeSeconds,this.ae=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}se(e){if(e===f())throw new t("expire-custom-caches-only");let s=this.ae.get(e);return s||(s=new g(e,this.ne),this.ae.set(e,s)),s}te(e){if(!this.L)return!0;const t=this.ie(e);if(null===t)return!0;return t>=Date.now()-1e3*this.L}ie(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.ae)await self.caches.delete(e),await t.delete();this.ae=new Map}}({maxEntries:100,purgeOnQuotaError:!0})]}),"GET"),o(/\/v5\/@webcomponents\//,new class extends L{async A(e,s){let n,a=await s.cacheMatch(e);if(!a)try{a=await s.fetchAndCachePut(e)}catch(e){n=e}if(!a)throw new t("no-response",{url:e.url,error:n});return a}}({cacheName:"polyfills",plugins:[]}),"GET");
//# sourceMappingURL=sw.js.map
