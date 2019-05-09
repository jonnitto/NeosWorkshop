/*!
 * Jonnitto.Slider - created by Jon Uhlmann
 * @link https://www.jonnitto.ch
 */
!function(){"use strict";var e,t=(function(e){!function(){var t,n=0,o=0,i={},c={};function l(e,o,i){return"_root"==o?i:e!==i?function(e){return t||(t=e.matches?e.matches:e.webkitMatchesSelector?e.webkitMatchesSelector:e.mozMatchesSelector?e.mozMatchesSelector:e.msMatchesSelector?e.msMatchesSelector:e.oMatchesSelector?e.oMatchesSelector:d.matchesSelector)}(e).call(e,o)?e:e.parentNode?(n++,l(e.parentNode,o,i)):void 0:void 0}function s(e,t,n,o){i[e.id]||(i[e.id]={}),i[e.id][t]||(i[e.id][t]={}),i[e.id][t][n]||(i[e.id][t][n]=[]),i[e.id][t][n].push(o)}function r(e,t,n,o){if(i[e.id])if(t)if(o||n)if(o){if(i[e.id][t][n])for(var c=0;c<i[e.id][t][n].length;c++)if(i[e.id][t][n][c]===o){i[e.id][t][n].splice(c,1);break}}else delete i[e.id][t][n];else i[e.id][t]={};else for(var l in i[e.id])i[e.id].hasOwnProperty(l)&&(i[e.id][l]={})}function a(e,t,o,a){if(this.element){e instanceof Array||(e=[e]),o||"function"!=typeof t||(o=t,t="_root");var u,f=this.id;for(u=0;u<e.length;u++)a?r(this,e[u],t,o):(i[f]&&i[f][e[u]]||d.addEvent(this,e[u],m(e[u])),s(this,e[u],t,o));return this}function m(e){return function(t){!function(e,t,o){if(i[e][o]){var s,r,a=t.target||t.srcElement,u={},f=0,m=0;for(s in n=0,i[e][o])i[e][o].hasOwnProperty(s)&&(r=l(a,s,c[e].element))&&d.matchesEvent(o,c[e].element,r,"_root"==s,t)&&(n++,i[e][o][s].match=r,u[n]=i[e][o][s]);for(t.stopPropagation=function(){t.cancelBubble=!0},f=0;f<=n;f++)if(u[f])for(m=0;m<u[f].length;m++){if(!1===u[f][m].call(u[f].match,t))return void d.cancel(t);if(t.cancelBubble)return}}}(f,t,e)}}}function d(e,t){if(!(this instanceof d)){for(var n in c)if(c[n].element===e)return c[n];return c[++o]=new d(e,o),c[o]}this.element=e,this.id=t}d.prototype.on=function(e,t,n){return a.call(this,e,t,n)},d.prototype.off=function(e,t,n){return a.call(this,e,t,n,!0)},d.matchesSelector=function(){},d.cancel=function(e){e.preventDefault(),e.stopPropagation()},d.addEvent=function(e,t,n){var o="blur"==t||"focus"==t;e.element.addEventListener(t,n,o)},d.matchesEvent=function(){return!0},e.exports&&(e.exports=d),window.Gator=d}()}(e={exports:{}},e.exports),e.exports);function n(e){return"function"==typeof e.get?e.get("nodeType"):e.nodeType}function o(e,t){return!!("string"==typeof t?n(e)==t:t.includes(n(e)))}const i=[];function c(e){let t=e.parentElement.querySelector(".slider");return t||(t=e.parentElement.parentElement.querySelector(".slider")),t||e.closest(".slider")}function l(e){let t=e.dataset.index,n=c(e);n&&void 0!==t&&n.scrollTo(n.clientWidth*parseInt(t),0)}t(document).on("click",".flickity-prev-next-button",function(){let e=c(this);if(!e)return;let t=e.parentElement,n=this.classList.contains("next")?1:-1;e.scrollBy(t.clientWidth*n,0)}),t(document).on("click",".flickity-page-dots .dot",function(){l(this)});let s=0;t(document).on("Neos.NodeSelected",e=>{const t=e.detail;o(t.node,i)&&(clearInterval(null),setInterval(()=>{document.documentElement.scrollLeft=0,20==++s&&(clearInterval(null),s=0)},100),l(t.element))});const r=!("neos-content-main"!=window.name),a=window.document,d=a.documentElement.classList,u=r?window.parent.document:a,f="__carbonbuttoncontextbar",m='style="fill:#fff" class="neos-svg-inline--fa neos-fa-image fa-w-18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"',g={images:`<svg ${m} viewBox="0 0 576 512"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"/></svg>`,ellipsis:`<svg ${m} viewBox="0 0 512 512"><path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"/></svg>`,arrows:`<svg ${m} viewBox="0 0 512 512"><path d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z"/></svg>`,camera:`<svg ${m} viewBox="0 0 512 512"><path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"/></svg>`};let h=null,p=null,v=null;function y(e){setTimeout(()=>{w(e)},100)}function w(e){try{r?h=u.querySelector("[target=neosPreview]").parentElement:u.getElementById("neos-context-bar")?h=u.querySelector("#neos-context-bar>.neos-right"):y(e)}catch(t){y(e)}finally{h&&"function"==typeof e&&setTimeout(e,100)}}function b(e,t=x()){e&&(e.style.background=t?"#00adee":"transparent")}function x(){return d.contains(p.toggleClass)}function S(){if(!u.querySelector(`button.${f}.${p.className}[title="${p.title.replace(/' '/," ")}"]`)){let e=u.createElement("button");e.className=`${f} ${p.className}`,e.type="button",e.title=p.title,Object.assign(e.style,{position:"relative",outline:"none",float:"left",display:"inline-block",height:"40px",minWidth:"40px",padding:0,border:0,verticalAlign:"top",width:"40px",color:"#fff",cursor:"pointer",background:"transparent",font:"normal normal normal 14px/1 FontAwesome",textRendering:"auto","-webkit-font-smoothing":"antialiased","-moz-osx-font-smoothing":"grayscale"}),e.onmouseover=(()=>{b(e,!0)}),e.onmouseout=(()=>{b(e)}),e.onclick=(()=>{let t=x();e.blur(),k(e),t||"function"!=typeof p.onActive||p.onActive(),t&&"function"==typeof p.onInactive&&p.onInactive()}),e.innerHTML=p.icon in g?g[p.icon]:p.icon,h.insertBefore(e,h.firstChild),u[f][p.toggleClass]&&(d.add(p.toggleClass),b(e,!0)),window.onunload=(()=>{v!=location.href?C(e):e.parentElement.removeChild(e)})}}function E(e,t){(e=e||!!h&&h.querySelector(`.${p.className}`))&&t(e)}function k(e){d.toggle(p.toggleClass),v=location.href,u[f][p.toggleClass]=d.contains(p.toggleClass),E(e,b)}function C(e){E(e,e=>{e.parentElement.removeChild(e)}),d.remove(p.toggleClass),u[f][p.toggleClass]=!1}void 0===u[f]&&(u[f]={});const M=e=>{e.className&&e.icon&&e.title&&e.toggleClass&&(p=Object.assign({},e),"function"==typeof e.check&&(p.check=e.check()),w(p.check?S:C))},N=e=>{e.className&&e.toggleClass&&(p=e,w(k))},z=document.getElementById("slider-edit"),B={check:()=>!!z,title:!!z&&z.querySelector("h1").textContent,icon:"images",className:"toggle-slider",toggleClass:"-slider--visible",onInactive:()=>{location.reload()}};t(document).on("click",".toggle-slider-empty, .slider__slide--page",()=>{N(B)}),t(document).on("Neos.NodeSelected",e=>{const t=e.detail.node;!o(t,"Jonnitto.Slider:PageSlider.Slide")&&!function(e,t,o="Neos.Neos:ContentCollection"){return!(n(e)!=o||e.name!=t)}(t,"pageslides")||document.documentElement.classList.contains(B.toggleClass)||N(B)}),M(B)}();

//# sourceMappingURL=Backend.js.map