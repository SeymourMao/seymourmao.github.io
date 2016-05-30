(function(e){var t=1,n,r=Array.prototype.slice,i=e.isFunction,a=function(e){return typeof e=="string"},o={},s={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};s.click=s.mousedown=s.mouseup=s.mousemove="MouseEvents";function l(e){return e._zid||(e._zid=t++)}function p(e,t,n,r){t=g(t);if(t.ns)var i=v(t.ns);return(o[l(e)]||[]).filter(function(e){return e&&(!t.e||e.e==t.e)&&(!t.ns||i.test(e.ns))&&(!n||l(e.fn)===l(n))&&(!r||e.sel==r)})}function g(e){var t=(""+e).split(".");return{e:t[0],ns:t.slice(1).sort().join(" ")}}function v(e){return new RegExp("(?:^| )"+e.replace(" "," .* ?")+"(?: |$)")}function d(e,t){return e.del&&(!u&&e.e in f)||!!t}function h(e){return c[e]||u&&f[e]||e}function m(t,r,i,a,s,u,f){var p=l(t),v=o[p]||(o[p]=[]);r.split(/\s/).forEach(function(r){if(r=="ready")return e(document).ready(i);var o=g(r);o.fn=i;o.sel=s;if(o.e in c)i=function(t){var n=t.relatedTarget;if(!n||n!==this&&!e.contains(this,n))return o.fn.apply(this,arguments)};o.del=u;var l=u||i;o.proxy=function(e){e=x(e);if(e.isImmediatePropagationStopped())return;e.data=a;var r=l.apply(t,e._args==n?[e]:[e].concat(e._args));if(r===false)e.preventDefault(),e.stopPropagation();return r};o.i=v.length;v.push(o);if("addEventListener"in t)t.addEventListener(h(o.e),o.proxy,d(o,f))})}function y(e,t,n,r,i){var a=l(e);(t||"").split(/\s/).forEach(function(t){p(e,t,n,r).forEach(function(t){delete o[a][t.i];if("removeEventListener"in e)e.removeEventListener(h(t.e),t.proxy,d(t,i))})})}e.event={add:m,remove:y};e.proxy=function(t,n){var o=2 in arguments&&r.call(arguments,2);if(i(t)){var s=function(){return t.apply(n,o?o.concat(r.call(arguments)):arguments)};s._zid=l(t);return s}else if(a(n)){if(o){o.unshift(t[n],t);return e.proxy.apply(null,o)}else{return e.proxy(t[n],t)}}else{throw new TypeError("expected function")}};e.fn.bind=function(e,t,n){return this.on(e,t,n)};e.fn.unbind=function(e,t){return this.off(e,t)};e.fn.one=function(e,t,n,r){return this.on(e,t,n,r,1)};var P=function(){return true},E=function(){return false},b=/^([A-Z]|returnValue$|layer[XY]$)/,w={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};function x(t,r){if(r||!t.isDefaultPrevented){r||(r=t);e.each(w,function(e,n){var i=r[e];t[e]=function(){this[n]=P;return i&&i.apply(r,arguments)};t[n]=E});if(r.defaultPrevented!==n?r.defaultPrevented:"returnValue"in r?r.returnValue===false:r.getPreventDefault&&r.getPreventDefault())t.isDefaultPrevented=P}return t}function k(e){var t,r={originalEvent:e};for(t in e)if(!b.test(t)&&e[t]!==n)r[t]=e[t];return x(r,e)}e.fn.delegate=function(e,t,n){return this.on(t,e,n)};e.fn.undelegate=function(e,t,n){return this.off(t,e,n)};e.fn.live=function(t,n){e(document.body).delegate(this.selector,t,n);return this};e.fn.die=function(t,n){e(document.body).undelegate(this.selector,t,n);return this};e.fn.on=function(t,o,s,u,f){var c,l,p=this;if(t&&!a(t)){e.each(t,function(e,t){p.on(e,o,s,t,f)});return p}if(!a(o)&&!i(u)&&u!==false)u=s,s=o,o=n;if(u===n||s===false)u=s,s=n;if(u===false)u=E;return p.each(function(n,i){if(f)c=function(e){y(i,e.type,u);return u.apply(this,arguments)};if(o)l=function(t){var n,a=e(t.target).closest(o,i).get(0);if(a&&a!==i){n=e.extend(k(t),{currentTarget:a,liveFired:i});return(c||u).apply(a,[n].concat(r.call(arguments,1)))}};m(i,t,u,s,o,l||c)})};e.fn.off=function(t,r,o){var s=this;if(t&&!a(t)){e.each(t,function(e,t){s.off(e,r,t)});return s}if(!a(r)&&!i(o)&&o!==false)o=r,r=n;if(o===false)o=E;return s.each(function(){y(this,t,o,r)})};e.fn.trigger=function(t,n){t=a(t)||e.isPlainObject(t)?e.Event(t):x(t);t._args=n;return this.each(function(){if(t.type in f&&typeof this[t.type]=="function")this[t.type]();else if("dispatchEvent"in this)this.dispatchEvent(t);else e(this).triggerHandler(t,n)})};e.fn.triggerHandler=function(t,n){var r,i;this.each(function(o,s){r=k(a(t)?e.Event(t):t);r._args=n;r.target=s;e.each(p(s,t.type||t),function(e,t){i=t.proxy(r);if(r.isImmediatePropagationStopped())return false})});return i};("focusin focusout focus blur load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select keydown keypress keyup error").split(" ").forEach(function(t){e.fn[t]=function(e){return 0 in arguments?this.bind(t,e):this.trigger(t)}});e.Event=function(e,t){if(!a(e))t=e,e=t.type;var n=document.createEvent(s[e]||"Events"),r=true;if(t)for(var i in t)i=="bubbles"?r=!!t[i]:n[i]=t[i];n.initEvent(e,r,true);return x(n)}})(Zepto);