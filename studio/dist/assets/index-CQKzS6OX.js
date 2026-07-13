var gv=Object.defineProperty;var _v=(r,e,n)=>e in r?gv(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var bn=(r,e,n)=>_v(r,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function vv(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Tu={exports:{}},Fa={},Au={exports:{}},ft={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Op;function xv(){if(Op)return ft;Op=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),d=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.iterator;function y(F){return F===null||typeof F!="object"?null:(F=v&&F[v]||F["@@iterator"],typeof F=="function"?F:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,C={};function x(F,oe,Ne){this.props=F,this.context=oe,this.refs=C,this.updater=Ne||M}x.prototype.isReactComponent={},x.prototype.setState=function(F,oe){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,oe,"setState")},x.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function S(){}S.prototype=x.prototype;function L(F,oe,Ne){this.props=F,this.context=oe,this.refs=C,this.updater=Ne||M}var b=L.prototype=new S;b.constructor=L,w(b,x.prototype),b.isPureReactComponent=!0;var N=Array.isArray,$=Object.prototype.hasOwnProperty,k={current:null},U={key:!0,ref:!0,__self:!0,__source:!0};function X(F,oe,Ne){var ee,de={},xe=null,Se=null;if(oe!=null)for(ee in oe.ref!==void 0&&(Se=oe.ref),oe.key!==void 0&&(xe=""+oe.key),oe)$.call(oe,ee)&&!U.hasOwnProperty(ee)&&(de[ee]=oe[ee]);var Ae=arguments.length-2;if(Ae===1)de.children=Ne;else if(1<Ae){for(var Pe=Array(Ae),je=0;je<Ae;je++)Pe[je]=arguments[je+2];de.children=Pe}if(F&&F.defaultProps)for(ee in Ae=F.defaultProps,Ae)de[ee]===void 0&&(de[ee]=Ae[ee]);return{$$typeof:r,type:F,key:xe,ref:Se,props:de,_owner:k.current}}function ae(F,oe){return{$$typeof:r,type:F.type,key:oe,ref:F.ref,props:F.props,_owner:F._owner}}function A(F){return typeof F=="object"&&F!==null&&F.$$typeof===r}function E(F){var oe={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(Ne){return oe[Ne]})}var V=/\/+/g;function Y(F,oe){return typeof F=="object"&&F!==null&&F.key!=null?E(""+F.key):oe.toString(36)}function se(F,oe,Ne,ee,de){var xe=typeof F;(xe==="undefined"||xe==="boolean")&&(F=null);var Se=!1;if(F===null)Se=!0;else switch(xe){case"string":case"number":Se=!0;break;case"object":switch(F.$$typeof){case r:case e:Se=!0}}if(Se)return Se=F,de=de(Se),F=ee===""?"."+Y(Se,0):ee,N(de)?(Ne="",F!=null&&(Ne=F.replace(V,"$&/")+"/"),se(de,oe,Ne,"",function(je){return je})):de!=null&&(A(de)&&(de=ae(de,Ne+(!de.key||Se&&Se.key===de.key?"":(""+de.key).replace(V,"$&/")+"/")+F)),oe.push(de)),1;if(Se=0,ee=ee===""?".":ee+":",N(F))for(var Ae=0;Ae<F.length;Ae++){xe=F[Ae];var Pe=ee+Y(xe,Ae);Se+=se(xe,oe,Ne,Pe,de)}else if(Pe=y(F),typeof Pe=="function")for(F=Pe.call(F),Ae=0;!(xe=F.next()).done;)xe=xe.value,Pe=ee+Y(xe,Ae++),Se+=se(xe,oe,Ne,Pe,de);else if(xe==="object")throw oe=String(F),Error("Objects are not valid as a React child (found: "+(oe==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":oe)+"). If you meant to render a collection of children, use an array instead.");return Se}function K(F,oe,Ne){if(F==null)return F;var ee=[],de=0;return se(F,ee,"","",function(xe){return oe.call(Ne,xe,de++)}),ee}function q(F){if(F._status===-1){var oe=F._result;oe=oe(),oe.then(function(Ne){(F._status===0||F._status===-1)&&(F._status=1,F._result=Ne)},function(Ne){(F._status===0||F._status===-1)&&(F._status=2,F._result=Ne)}),F._status===-1&&(F._status=0,F._result=oe)}if(F._status===1)return F._result.default;throw F._result}var ue={current:null},z={transition:null},he={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:z,ReactCurrentOwner:k};function le(){throw Error("act(...) is not supported in production builds of React.")}return ft.Children={map:K,forEach:function(F,oe,Ne){K(F,function(){oe.apply(this,arguments)},Ne)},count:function(F){var oe=0;return K(F,function(){oe++}),oe},toArray:function(F){return K(F,function(oe){return oe})||[]},only:function(F){if(!A(F))throw Error("React.Children.only expected to receive a single React element child.");return F}},ft.Component=x,ft.Fragment=n,ft.Profiler=o,ft.PureComponent=L,ft.StrictMode=s,ft.Suspense=f,ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=he,ft.act=le,ft.cloneElement=function(F,oe,Ne){if(F==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+F+".");var ee=w({},F.props),de=F.key,xe=F.ref,Se=F._owner;if(oe!=null){if(oe.ref!==void 0&&(xe=oe.ref,Se=k.current),oe.key!==void 0&&(de=""+oe.key),F.type&&F.type.defaultProps)var Ae=F.type.defaultProps;for(Pe in oe)$.call(oe,Pe)&&!U.hasOwnProperty(Pe)&&(ee[Pe]=oe[Pe]===void 0&&Ae!==void 0?Ae[Pe]:oe[Pe])}var Pe=arguments.length-2;if(Pe===1)ee.children=Ne;else if(1<Pe){Ae=Array(Pe);for(var je=0;je<Pe;je++)Ae[je]=arguments[je+2];ee.children=Ae}return{$$typeof:r,type:F.type,key:de,ref:xe,props:ee,_owner:Se}},ft.createContext=function(F){return F={$$typeof:d,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},F.Provider={$$typeof:l,_context:F},F.Consumer=F},ft.createElement=X,ft.createFactory=function(F){var oe=X.bind(null,F);return oe.type=F,oe},ft.createRef=function(){return{current:null}},ft.forwardRef=function(F){return{$$typeof:u,render:F}},ft.isValidElement=A,ft.lazy=function(F){return{$$typeof:g,_payload:{_status:-1,_result:F},_init:q}},ft.memo=function(F,oe){return{$$typeof:p,type:F,compare:oe===void 0?null:oe}},ft.startTransition=function(F){var oe=z.transition;z.transition={};try{F()}finally{z.transition=oe}},ft.unstable_act=le,ft.useCallback=function(F,oe){return ue.current.useCallback(F,oe)},ft.useContext=function(F){return ue.current.useContext(F)},ft.useDebugValue=function(){},ft.useDeferredValue=function(F){return ue.current.useDeferredValue(F)},ft.useEffect=function(F,oe){return ue.current.useEffect(F,oe)},ft.useId=function(){return ue.current.useId()},ft.useImperativeHandle=function(F,oe,Ne){return ue.current.useImperativeHandle(F,oe,Ne)},ft.useInsertionEffect=function(F,oe){return ue.current.useInsertionEffect(F,oe)},ft.useLayoutEffect=function(F,oe){return ue.current.useLayoutEffect(F,oe)},ft.useMemo=function(F,oe){return ue.current.useMemo(F,oe)},ft.useReducer=function(F,oe,Ne){return ue.current.useReducer(F,oe,Ne)},ft.useRef=function(F){return ue.current.useRef(F)},ft.useState=function(F){return ue.current.useState(F)},ft.useSyncExternalStore=function(F,oe,Ne){return ue.current.useSyncExternalStore(F,oe,Ne)},ft.useTransition=function(){return ue.current.useTransition()},ft.version="18.3.1",ft}var kp;function Qd(){return kp||(kp=1,Au.exports=xv()),Au.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zp;function yv(){if(zp)return Fa;zp=1;var r=Qd(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function d(u,f,p){var g,v={},y=null,M=null;p!==void 0&&(y=""+p),f.key!==void 0&&(y=""+f.key),f.ref!==void 0&&(M=f.ref);for(g in f)s.call(f,g)&&!l.hasOwnProperty(g)&&(v[g]=f[g]);if(u&&u.defaultProps)for(g in f=u.defaultProps,f)v[g]===void 0&&(v[g]=f[g]);return{$$typeof:e,type:u,key:y,ref:M,props:v,_owner:o.current}}return Fa.Fragment=n,Fa.jsx=d,Fa.jsxs=d,Fa}var Bp;function Sv(){return Bp||(Bp=1,Tu.exports=yv()),Tu.exports}var m=Sv(),qe=Qd();const Ga=vv(qe);var il={},Cu={exports:{}},Pn={},Ru={exports:{}},bu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Hp;function Mv(){return Hp||(Hp=1,(function(r){function e(z,he){var le=z.length;z.push(he);e:for(;0<le;){var F=le-1>>>1,oe=z[F];if(0<o(oe,he))z[F]=he,z[le]=oe,le=F;else break e}}function n(z){return z.length===0?null:z[0]}function s(z){if(z.length===0)return null;var he=z[0],le=z.pop();if(le!==he){z[0]=le;e:for(var F=0,oe=z.length,Ne=oe>>>1;F<Ne;){var ee=2*(F+1)-1,de=z[ee],xe=ee+1,Se=z[xe];if(0>o(de,le))xe<oe&&0>o(Se,de)?(z[F]=Se,z[xe]=le,F=xe):(z[F]=de,z[ee]=le,F=ee);else if(xe<oe&&0>o(Se,le))z[F]=Se,z[xe]=le,F=xe;else break e}}return he}function o(z,he){var le=z.sortIndex-he.sortIndex;return le!==0?le:z.id-he.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var d=Date,u=d.now();r.unstable_now=function(){return d.now()-u}}var f=[],p=[],g=1,v=null,y=3,M=!1,w=!1,C=!1,x=typeof setTimeout=="function"?setTimeout:null,S=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(z){for(var he=n(p);he!==null;){if(he.callback===null)s(p);else if(he.startTime<=z)s(p),he.sortIndex=he.expirationTime,e(f,he);else break;he=n(p)}}function N(z){if(C=!1,b(z),!w)if(n(f)!==null)w=!0,q($);else{var he=n(p);he!==null&&ue(N,he.startTime-z)}}function $(z,he){w=!1,C&&(C=!1,S(X),X=-1),M=!0;var le=y;try{for(b(he),v=n(f);v!==null&&(!(v.expirationTime>he)||z&&!E());){var F=v.callback;if(typeof F=="function"){v.callback=null,y=v.priorityLevel;var oe=F(v.expirationTime<=he);he=r.unstable_now(),typeof oe=="function"?v.callback=oe:v===n(f)&&s(f),b(he)}else s(f);v=n(f)}if(v!==null)var Ne=!0;else{var ee=n(p);ee!==null&&ue(N,ee.startTime-he),Ne=!1}return Ne}finally{v=null,y=le,M=!1}}var k=!1,U=null,X=-1,ae=5,A=-1;function E(){return!(r.unstable_now()-A<ae)}function V(){if(U!==null){var z=r.unstable_now();A=z;var he=!0;try{he=U(!0,z)}finally{he?Y():(k=!1,U=null)}}else k=!1}var Y;if(typeof L=="function")Y=function(){L(V)};else if(typeof MessageChannel<"u"){var se=new MessageChannel,K=se.port2;se.port1.onmessage=V,Y=function(){K.postMessage(null)}}else Y=function(){x(V,0)};function q(z){U=z,k||(k=!0,Y())}function ue(z,he){X=x(function(){z(r.unstable_now())},he)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(z){z.callback=null},r.unstable_continueExecution=function(){w||M||(w=!0,q($))},r.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ae=0<z?Math.floor(1e3/z):5},r.unstable_getCurrentPriorityLevel=function(){return y},r.unstable_getFirstCallbackNode=function(){return n(f)},r.unstable_next=function(z){switch(y){case 1:case 2:case 3:var he=3;break;default:he=y}var le=y;y=he;try{return z()}finally{y=le}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(z,he){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var le=y;y=z;try{return he()}finally{y=le}},r.unstable_scheduleCallback=function(z,he,le){var F=r.unstable_now();switch(typeof le=="object"&&le!==null?(le=le.delay,le=typeof le=="number"&&0<le?F+le:F):le=F,z){case 1:var oe=-1;break;case 2:oe=250;break;case 5:oe=1073741823;break;case 4:oe=1e4;break;default:oe=5e3}return oe=le+oe,z={id:g++,callback:he,priorityLevel:z,startTime:le,expirationTime:oe,sortIndex:-1},le>F?(z.sortIndex=le,e(p,z),n(f)===null&&z===n(p)&&(C?(S(X),X=-1):C=!0,ue(N,le-F))):(z.sortIndex=oe,e(f,z),w||M||(w=!0,q($))),z},r.unstable_shouldYield=E,r.unstable_wrapCallback=function(z){var he=y;return function(){var le=y;y=he;try{return z.apply(this,arguments)}finally{y=le}}}})(bu)),bu}var jp;function Ev(){return jp||(jp=1,Ru.exports=Mv()),Ru.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vp;function wv(){if(Vp)return Pn;Vp=1;var r=Qd(),e=Ev();function n(t){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+t,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+t+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(t,i){d(t,i),d(t+"Capture",i)}function d(t,i){for(o[t]=i,t=0;t<i.length;t++)s.add(i[t])}var u=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},v={};function y(t){return f.call(v,t)?!0:f.call(g,t)?!1:p.test(t)?v[t]=!0:(g[t]=!0,!1)}function M(t,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function w(t,i,a,c){if(i===null||typeof i>"u"||M(t,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function C(t,i,a,c,h,_,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=t,this.type=i,this.sanitizeURL=_,this.removeEmptyString=T}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){x[t]=new C(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var i=t[0];x[i]=new C(i,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){x[t]=new C(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){x[t]=new C(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){x[t]=new C(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){x[t]=new C(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){x[t]=new C(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){x[t]=new C(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){x[t]=new C(t,5,!1,t.toLowerCase(),null,!1,!1)});var S=/[\-:]([a-z])/g;function L(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var i=t.replace(S,L);x[i]=new C(i,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var i=t.replace(S,L);x[i]=new C(i,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var i=t.replace(S,L);x[i]=new C(i,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){x[t]=new C(t,1,!1,t.toLowerCase(),null,!1,!1)}),x.xlinkHref=new C("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){x[t]=new C(t,1,!1,t.toLowerCase(),null,!0,!0)});function b(t,i,a,c){var h=x.hasOwnProperty(i)?x[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(w(i,a,h,c)&&(a=null),c||h===null?y(i)&&(a===null?t.removeAttribute(i):t.setAttribute(i,""+a)):h.mustUseProperty?t[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?t.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?t.setAttributeNS(c,i,a):t.setAttribute(i,a))))}var N=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$=Symbol.for("react.element"),k=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),X=Symbol.for("react.strict_mode"),ae=Symbol.for("react.profiler"),A=Symbol.for("react.provider"),E=Symbol.for("react.context"),V=Symbol.for("react.forward_ref"),Y=Symbol.for("react.suspense"),se=Symbol.for("react.suspense_list"),K=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),ue=Symbol.for("react.offscreen"),z=Symbol.iterator;function he(t){return t===null||typeof t!="object"?null:(t=z&&t[z]||t["@@iterator"],typeof t=="function"?t:null)}var le=Object.assign,F;function oe(t){if(F===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);F=i&&i[1]||""}return`
`+F+t}var Ne=!1;function ee(t,i){if(!t||Ne)return"";Ne=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(re){var c=re}Reflect.construct(t,[],i)}else{try{i.call()}catch(re){c=re}t.call(i.prototype)}else{try{throw Error()}catch(re){c=re}t()}}catch(re){if(re&&c&&typeof re.stack=="string"){for(var h=re.stack.split(`
`),_=c.stack.split(`
`),T=h.length-1,I=_.length-1;1<=T&&0<=I&&h[T]!==_[I];)I--;for(;1<=T&&0<=I;T--,I--)if(h[T]!==_[I]){if(T!==1||I!==1)do if(T--,I--,0>I||h[T]!==_[I]){var B=`
`+h[T].replace(" at new "," at ");return t.displayName&&B.includes("<anonymous>")&&(B=B.replace("<anonymous>",t.displayName)),B}while(1<=T&&0<=I);break}}}finally{Ne=!1,Error.prepareStackTrace=a}return(t=t?t.displayName||t.name:"")?oe(t):""}function de(t){switch(t.tag){case 5:return oe(t.type);case 16:return oe("Lazy");case 13:return oe("Suspense");case 19:return oe("SuspenseList");case 0:case 2:case 15:return t=ee(t.type,!1),t;case 11:return t=ee(t.type.render,!1),t;case 1:return t=ee(t.type,!0),t;default:return""}}function xe(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case U:return"Fragment";case k:return"Portal";case ae:return"Profiler";case X:return"StrictMode";case Y:return"Suspense";case se:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case E:return(t.displayName||"Context")+".Consumer";case A:return(t._context.displayName||"Context")+".Provider";case V:var i=t.render;return t=t.displayName,t||(t=i.displayName||i.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case K:return i=t.displayName||null,i!==null?i:xe(t.type)||"Memo";case q:i=t._payload,t=t._init;try{return xe(t(i))}catch{}}return null}function Se(t){var i=t.type;switch(t.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=i.render,t=t.displayName||t.name||"",i.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return xe(i);case 8:return i===X?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Ae(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Pe(t){var i=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function je(t){var i=Pe(t)?"checked":"value",a=Object.getOwnPropertyDescriptor(t.constructor.prototype,i),c=""+t[i];if(!t.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,_=a.set;return Object.defineProperty(t,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,_.call(this,T)}}),Object.defineProperty(t,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){t._valueTracker=null,delete t[i]}}}}function Ke(t){t._valueTracker||(t._valueTracker=je(t))}function $e(t){if(!t)return!1;var i=t._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return t&&(c=Pe(t)?t.checked?"true":"false":t.value),t=c,t!==a?(i.setValue(t),!0):!1}function O(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Tt(t,i){var a=i.checked;return le({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??t._wrapperState.initialChecked})}function lt(t,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Ae(i.value!=null?i.value:a),t._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function pt(t,i){i=i.checked,i!=null&&b(t,"checked",i,!1)}function Ze(t,i){pt(t,i);var a=Ae(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&t.value===""||t.value!=a)&&(t.value=""+a):t.value!==""+a&&(t.value=""+a);else if(c==="submit"||c==="reset"){t.removeAttribute("value");return}i.hasOwnProperty("value")?Je(t,i.type,a):i.hasOwnProperty("defaultValue")&&Je(t,i.type,Ae(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(t.defaultChecked=!!i.defaultChecked)}function At(t,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+t._wrapperState.initialValue,a||i===t.value||(t.value=i),t.defaultValue=i}a=t.name,a!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,a!==""&&(t.name=a)}function Je(t,i,a){(i!=="number"||O(t.ownerDocument)!==t)&&(a==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+a&&(t.defaultValue=""+a))}var D=Array.isArray;function R(t,i,a,c){if(t=t.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<t.length;a++)h=i.hasOwnProperty("$"+t[a].value),t[a].selected!==h&&(t[a].selected=h),h&&c&&(t[a].defaultSelected=!0)}else{for(a=""+Ae(a),i=null,h=0;h<t.length;h++){if(t[h].value===a){t[h].selected=!0,c&&(t[h].defaultSelected=!0);return}i!==null||t[h].disabled||(i=t[h])}i!==null&&(i.selected=!0)}}function te(t,i){if(i.dangerouslySetInnerHTML!=null)throw Error(n(91));return le({},i,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function pe(t,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(n(92));if(D(a)){if(1<a.length)throw Error(n(93));a=a[0]}i=a}i==null&&(i=""),a=i}t._wrapperState={initialValue:Ae(a)}}function ve(t,i){var a=Ae(i.value),c=Ae(i.defaultValue);a!=null&&(a=""+a,a!==t.value&&(t.value=a),i.defaultValue==null&&t.defaultValue!==a&&(t.defaultValue=a)),c!=null&&(t.defaultValue=""+c)}function fe(t){var i=t.textContent;i===t._wrapperState.initialValue&&i!==""&&i!==null&&(t.value=i)}function Ye(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ce(t,i){return t==null||t==="http://www.w3.org/1999/xhtml"?Ye(i):t==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Fe,vt=(function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return t(i,a,c,h)})}:t})(function(t,i){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=i;else{for(Fe=Fe||document.createElement("div"),Fe.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Fe.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;i.firstChild;)t.appendChild(i.firstChild)}});function Me(t,i){if(i){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=i;return}}t.textContent=i}var Oe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},st=["Webkit","ms","Moz","O"];Object.keys(Oe).forEach(function(t){st.forEach(function(i){i=i+t.charAt(0).toUpperCase()+t.substring(1),Oe[i]=Oe[t]})});function rt(t,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||Oe.hasOwnProperty(t)&&Oe[t]?(""+i).trim():i+"px"}function ze(t,i){t=t.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=rt(a,i[a],c);a==="float"&&(a="cssFloat"),c?t.setProperty(a,h):t[a]=h}}var gt=le({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ot(t,i){if(i){if(gt[t]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(n(137,t));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(n(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(n(61))}if(i.style!=null&&typeof i.style!="object")throw Error(n(62))}}function Ct(t,i){if(t.indexOf("-")===-1)return typeof i.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var j=null;function Le(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ce=null,me=null,Re=null;function Ie(t){if(t=Sa(t)){if(typeof ce!="function")throw Error(n(280));var i=t.stateNode;i&&(i=vo(i),ce(t.stateNode,t.type,i))}}function _t(t){me?Re?Re.push(t):Re=[t]:me=t}function Ht(){if(me){var t=me,i=Re;if(Re=me=null,Ie(t),i)for(t=0;t<i.length;t++)Ie(i[t])}}function cn(t,i){return t(i)}function xt(){}var tn=!1;function Wn(t,i,a){if(tn)return t(i,a);tn=!0;try{return cn(t,i,a)}finally{tn=!1,(me!==null||Re!==null)&&(xt(),Ht())}}function Wi(t,i){var a=t.stateNode;if(a===null)return null;var c=vo(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(t=t.type,c=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!c;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(n(231,i,typeof a));return a}var ns=!1;if(u)try{var Fn={};Object.defineProperty(Fn,"passive",{get:function(){ns=!0}}),window.addEventListener("test",Fn,Fn),window.removeEventListener("test",Fn,Fn)}catch{ns=!1}function na(t,i,a,c,h,_,T,I,B){var re=Array.prototype.slice.call(arguments,3);try{i.apply(a,re)}catch(_e){this.onError(_e)}}var Xi=!1,Cr=null,wi=!1,is=null,rs={onError:function(t){Xi=!0,Cr=t}};function Qa(t,i,a,c,h,_,T,I,B){Xi=!1,Cr=null,na.apply(rs,arguments)}function Ja(t,i,a,c,h,_,T,I,B){if(Qa.apply(this,arguments),Xi){if(Xi){var re=Cr;Xi=!1,Cr=null}else throw Error(n(198));wi||(wi=!0,is=re)}}function Ti(t){var i=t,a=t;if(t.alternate)for(;i.return;)i=i.return;else{t=i;do i=t,(i.flags&4098)!==0&&(a=i.return),t=i.return;while(t)}return i.tag===3?a:null}function eo(t){if(t.tag===13){var i=t.memoizedState;if(i===null&&(t=t.alternate,t!==null&&(i=t.memoizedState)),i!==null)return i.dehydrated}return null}function to(t){if(Ti(t)!==t)throw Error(n(188))}function P(t){var i=t.alternate;if(!i){if(i=Ti(t),i===null)throw Error(n(188));return i!==t?null:t}for(var a=t,c=i;;){var h=a.return;if(h===null)break;var _=h.alternate;if(_===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===_.child){for(_=h.child;_;){if(_===a)return to(h),t;if(_===c)return to(h),i;_=_.sibling}throw Error(n(188))}if(a.return!==c.return)a=h,c=_;else{for(var T=!1,I=h.child;I;){if(I===a){T=!0,a=h,c=_;break}if(I===c){T=!0,c=h,a=_;break}I=I.sibling}if(!T){for(I=_.child;I;){if(I===a){T=!0,a=_,c=h;break}if(I===c){T=!0,c=_,a=h;break}I=I.sibling}if(!T)throw Error(n(189))}}if(a.alternate!==c)throw Error(n(190))}if(a.tag!==3)throw Error(n(188));return a.stateNode.current===a?t:i}function G(t){return t=P(t),t!==null?ne(t):null}function ne(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var i=ne(t);if(i!==null)return i;t=t.sibling}return null}var ie=e.unstable_scheduleCallback,W=e.unstable_cancelCallback,we=e.unstable_shouldYield,De=e.unstable_requestPaint,Te=e.unstable_now,Ge=e.unstable_getCurrentPriorityLevel,nt=e.unstable_ImmediatePriority,it=e.unstable_UserBlockingPriority,We=e.unstable_NormalPriority,wt=e.unstable_LowPriority,Pt=e.unstable_IdlePriority,Lt=null,zt=null;function St(t){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(Lt,t,void 0,(t.current.flags&128)===128)}catch{}}var ke=Math.clz32?Math.clz32:On,$t=Math.log,Mt=Math.LN2;function On(t){return t>>>=0,t===0?32:31-($t(t)/Mt|0)|0}var ni=64,nn=4194304;function Ai(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Dt(t,i){var a=t.pendingLanes;if(a===0)return 0;var c=0,h=t.suspendedLanes,_=t.pingedLanes,T=a&268435455;if(T!==0){var I=T&~h;I!==0?c=Ai(I):(_&=T,_!==0&&(c=Ai(_)))}else T=a&~h,T!==0?c=Ai(T):_!==0&&(c=Ai(_));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,_=i&-i,h>=_||h===16&&(_&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=t.entangledLanes,i!==0)for(t=t.entanglements,i&=c;0<i;)a=31-ke(i),h=1<<a,c|=t[a],i&=~h;return c}function _i(t,i){switch(t){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ia(t,i){for(var a=t.suspendedLanes,c=t.pingedLanes,h=t.expirationTimes,_=t.pendingLanes;0<_;){var T=31-ke(_),I=1<<T,B=h[T];B===-1?((I&a)===0||(I&c)!==0)&&(h[T]=_i(I,i)):B<=i&&(t.expiredLanes|=I),_&=~I}}function hn(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function ss(){var t=ni;return ni<<=1,(ni&4194240)===0&&(ni=64),t}function ra(t){for(var i=[],a=0;31>a;a++)i.push(t);return i}function Yi(t,i,a){t.pendingLanes|=i,i!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,i=31-ke(i),t[i]=a}function Og(t,i){var a=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;var c=t.eventTimes;for(t=t.expirationTimes;0<a;){var h=31-ke(a),_=1<<h;i[h]=0,c[h]=-1,t[h]=-1,a&=~_}}function ql(t,i){var a=t.entangledLanes|=i;for(t=t.entanglements;a;){var c=31-ke(a),h=1<<c;h&i|t[c]&i&&(t[c]|=i),a&=~h}}var bt=0;function ph(t){return t&=-t,1<t?4<t?(t&268435455)!==0?16:536870912:4:1}var mh,$l,gh,_h,vh,Kl=!1,no=[],qi=null,$i=null,Ki=null,sa=new Map,aa=new Map,Zi=[],kg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function xh(t,i){switch(t){case"focusin":case"focusout":qi=null;break;case"dragenter":case"dragleave":$i=null;break;case"mouseover":case"mouseout":Ki=null;break;case"pointerover":case"pointerout":sa.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":aa.delete(i.pointerId)}}function oa(t,i,a,c,h,_){return t===null||t.nativeEvent!==_?(t={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:_,targetContainers:[h]},i!==null&&(i=Sa(i),i!==null&&$l(i)),t):(t.eventSystemFlags|=c,i=t.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),t)}function zg(t,i,a,c,h){switch(i){case"focusin":return qi=oa(qi,t,i,a,c,h),!0;case"dragenter":return $i=oa($i,t,i,a,c,h),!0;case"mouseover":return Ki=oa(Ki,t,i,a,c,h),!0;case"pointerover":var _=h.pointerId;return sa.set(_,oa(sa.get(_)||null,t,i,a,c,h)),!0;case"gotpointercapture":return _=h.pointerId,aa.set(_,oa(aa.get(_)||null,t,i,a,c,h)),!0}return!1}function yh(t){var i=Rr(t.target);if(i!==null){var a=Ti(i);if(a!==null){if(i=a.tag,i===13){if(i=eo(a),i!==null){t.blockedOn=i,vh(t.priority,function(){gh(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function io(t){if(t.blockedOn!==null)return!1;for(var i=t.targetContainers;0<i.length;){var a=Ql(t.domEventName,t.eventSystemFlags,i[0],t.nativeEvent);if(a===null){a=t.nativeEvent;var c=new a.constructor(a.type,a);j=c,a.target.dispatchEvent(c),j=null}else return i=Sa(a),i!==null&&$l(i),t.blockedOn=a,!1;i.shift()}return!0}function Sh(t,i,a){io(t)&&a.delete(i)}function Bg(){Kl=!1,qi!==null&&io(qi)&&(qi=null),$i!==null&&io($i)&&($i=null),Ki!==null&&io(Ki)&&(Ki=null),sa.forEach(Sh),aa.forEach(Sh)}function la(t,i){t.blockedOn===i&&(t.blockedOn=null,Kl||(Kl=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Bg)))}function ca(t){function i(h){return la(h,t)}if(0<no.length){la(no[0],t);for(var a=1;a<no.length;a++){var c=no[a];c.blockedOn===t&&(c.blockedOn=null)}}for(qi!==null&&la(qi,t),$i!==null&&la($i,t),Ki!==null&&la(Ki,t),sa.forEach(i),aa.forEach(i),a=0;a<Zi.length;a++)c=Zi[a],c.blockedOn===t&&(c.blockedOn=null);for(;0<Zi.length&&(a=Zi[0],a.blockedOn===null);)yh(a),a.blockedOn===null&&Zi.shift()}var as=N.ReactCurrentBatchConfig,ro=!0;function Hg(t,i,a,c){var h=bt,_=as.transition;as.transition=null;try{bt=1,Zl(t,i,a,c)}finally{bt=h,as.transition=_}}function jg(t,i,a,c){var h=bt,_=as.transition;as.transition=null;try{bt=4,Zl(t,i,a,c)}finally{bt=h,as.transition=_}}function Zl(t,i,a,c){if(ro){var h=Ql(t,i,a,c);if(h===null)mc(t,i,c,so,a),xh(t,c);else if(zg(h,t,i,a,c))c.stopPropagation();else if(xh(t,c),i&4&&-1<kg.indexOf(t)){for(;h!==null;){var _=Sa(h);if(_!==null&&mh(_),_=Ql(t,i,a,c),_===null&&mc(t,i,c,so,a),_===h)break;h=_}h!==null&&c.stopPropagation()}else mc(t,i,c,null,a)}}var so=null;function Ql(t,i,a,c){if(so=null,t=Le(c),t=Rr(t),t!==null)if(i=Ti(t),i===null)t=null;else if(a=i.tag,a===13){if(t=eo(i),t!==null)return t;t=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;t=null}else i!==t&&(t=null);return so=t,null}function Mh(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ge()){case nt:return 1;case it:return 4;case We:case wt:return 16;case Pt:return 536870912;default:return 16}default:return 16}}var Qi=null,Jl=null,ao=null;function Eh(){if(ao)return ao;var t,i=Jl,a=i.length,c,h="value"in Qi?Qi.value:Qi.textContent,_=h.length;for(t=0;t<a&&i[t]===h[t];t++);var T=a-t;for(c=1;c<=T&&i[a-c]===h[_-c];c++);return ao=h.slice(t,1<c?1-c:void 0)}function oo(t){var i=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&i===13&&(t=13)):t=i,t===10&&(t=13),32<=t||t===13?t:0}function lo(){return!0}function wh(){return!1}function kn(t){function i(a,c,h,_,T){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=_,this.target=T,this.currentTarget=null;for(var I in t)t.hasOwnProperty(I)&&(a=t[I],this[I]=a?a(_):_[I]);return this.isDefaultPrevented=(_.defaultPrevented!=null?_.defaultPrevented:_.returnValue===!1)?lo:wh,this.isPropagationStopped=wh,this}return le(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=lo)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=lo)},persist:function(){},isPersistent:lo}),i}var os={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ec=kn(os),ua=le({},os,{view:0,detail:0}),Vg=kn(ua),tc,nc,da,co=le({},ua,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:rc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==da&&(da&&t.type==="mousemove"?(tc=t.screenX-da.screenX,nc=t.screenY-da.screenY):nc=tc=0,da=t),tc)},movementY:function(t){return"movementY"in t?t.movementY:nc}}),Th=kn(co),Gg=le({},co,{dataTransfer:0}),Wg=kn(Gg),Xg=le({},ua,{relatedTarget:0}),ic=kn(Xg),Yg=le({},os,{animationName:0,elapsedTime:0,pseudoElement:0}),qg=kn(Yg),$g=le({},os,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Kg=kn($g),Zg=le({},os,{data:0}),Ah=kn(Zg),Qg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Jg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},e_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function t_(t){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(t):(t=e_[t])?!!i[t]:!1}function rc(){return t_}var n_=le({},ua,{key:function(t){if(t.key){var i=Qg[t.key]||t.key;if(i!=="Unidentified")return i}return t.type==="keypress"?(t=oo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Jg[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:rc,charCode:function(t){return t.type==="keypress"?oo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?oo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),i_=kn(n_),r_=le({},co,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ch=kn(r_),s_=le({},ua,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:rc}),a_=kn(s_),o_=le({},os,{propertyName:0,elapsedTime:0,pseudoElement:0}),l_=kn(o_),c_=le({},co,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),u_=kn(c_),d_=[9,13,27,32],sc=u&&"CompositionEvent"in window,ha=null;u&&"documentMode"in document&&(ha=document.documentMode);var h_=u&&"TextEvent"in window&&!ha,Rh=u&&(!sc||ha&&8<ha&&11>=ha),bh=" ",Ph=!1;function Nh(t,i){switch(t){case"keyup":return d_.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Lh(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ls=!1;function f_(t,i){switch(t){case"compositionend":return Lh(i);case"keypress":return i.which!==32?null:(Ph=!0,bh);case"textInput":return t=i.data,t===bh&&Ph?null:t;default:return null}}function p_(t,i){if(ls)return t==="compositionend"||!sc&&Nh(t,i)?(t=Eh(),ao=Jl=Qi=null,ls=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Rh&&i.locale!=="ko"?null:i.data;default:return null}}var m_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Dh(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i==="input"?!!m_[t.type]:i==="textarea"}function Ih(t,i,a,c){_t(c),i=mo(i,"onChange"),0<i.length&&(a=new ec("onChange","change",null,a,c),t.push({event:a,listeners:i}))}var fa=null,pa=null;function g_(t){Qh(t,0)}function uo(t){var i=fs(t);if($e(i))return t}function __(t,i){if(t==="change")return i}var Uh=!1;if(u){var ac;if(u){var oc="oninput"in document;if(!oc){var Fh=document.createElement("div");Fh.setAttribute("oninput","return;"),oc=typeof Fh.oninput=="function"}ac=oc}else ac=!1;Uh=ac&&(!document.documentMode||9<document.documentMode)}function Oh(){fa&&(fa.detachEvent("onpropertychange",kh),pa=fa=null)}function kh(t){if(t.propertyName==="value"&&uo(pa)){var i=[];Ih(i,pa,t,Le(t)),Wn(g_,i)}}function v_(t,i,a){t==="focusin"?(Oh(),fa=i,pa=a,fa.attachEvent("onpropertychange",kh)):t==="focusout"&&Oh()}function x_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return uo(pa)}function y_(t,i){if(t==="click")return uo(i)}function S_(t,i){if(t==="input"||t==="change")return uo(i)}function M_(t,i){return t===i&&(t!==0||1/t===1/i)||t!==t&&i!==i}var ii=typeof Object.is=="function"?Object.is:M_;function ma(t,i){if(ii(t,i))return!0;if(typeof t!="object"||t===null||typeof i!="object"||i===null)return!1;var a=Object.keys(t),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!f.call(i,h)||!ii(t[h],i[h]))return!1}return!0}function zh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Bh(t,i){var a=zh(t);t=0;for(var c;a;){if(a.nodeType===3){if(c=t+a.textContent.length,t<=i&&c>=i)return{node:a,offset:i-t};t=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=zh(a)}}function Hh(t,i){return t&&i?t===i?!0:t&&t.nodeType===3?!1:i&&i.nodeType===3?Hh(t,i.parentNode):"contains"in t?t.contains(i):t.compareDocumentPosition?!!(t.compareDocumentPosition(i)&16):!1:!1}function jh(){for(var t=window,i=O();i instanceof t.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)t=i.contentWindow;else break;i=O(t.document)}return i}function lc(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i&&(i==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||i==="textarea"||t.contentEditable==="true")}function E_(t){var i=jh(),a=t.focusedElem,c=t.selectionRange;if(i!==a&&a&&a.ownerDocument&&Hh(a.ownerDocument.documentElement,a)){if(c!==null&&lc(a)){if(i=c.start,t=c.end,t===void 0&&(t=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(t,a.value.length);else if(t=(i=a.ownerDocument||document)&&i.defaultView||window,t.getSelection){t=t.getSelection();var h=a.textContent.length,_=Math.min(c.start,h);c=c.end===void 0?_:Math.min(c.end,h),!t.extend&&_>c&&(h=c,c=_,_=h),h=Bh(a,_);var T=Bh(a,c);h&&T&&(t.rangeCount!==1||t.anchorNode!==h.node||t.anchorOffset!==h.offset||t.focusNode!==T.node||t.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),t.removeAllRanges(),_>c?(t.addRange(i),t.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),t.addRange(i)))}}for(i=[],t=a;t=t.parentNode;)t.nodeType===1&&i.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)t=i[a],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var w_=u&&"documentMode"in document&&11>=document.documentMode,cs=null,cc=null,ga=null,uc=!1;function Vh(t,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;uc||cs==null||cs!==O(c)||(c=cs,"selectionStart"in c&&lc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),ga&&ma(ga,c)||(ga=c,c=mo(cc,"onSelect"),0<c.length&&(i=new ec("onSelect","select",null,i,a),t.push({event:i,listeners:c}),i.target=cs)))}function ho(t,i){var a={};return a[t.toLowerCase()]=i.toLowerCase(),a["Webkit"+t]="webkit"+i,a["Moz"+t]="moz"+i,a}var us={animationend:ho("Animation","AnimationEnd"),animationiteration:ho("Animation","AnimationIteration"),animationstart:ho("Animation","AnimationStart"),transitionend:ho("Transition","TransitionEnd")},dc={},Gh={};u&&(Gh=document.createElement("div").style,"AnimationEvent"in window||(delete us.animationend.animation,delete us.animationiteration.animation,delete us.animationstart.animation),"TransitionEvent"in window||delete us.transitionend.transition);function fo(t){if(dc[t])return dc[t];if(!us[t])return t;var i=us[t],a;for(a in i)if(i.hasOwnProperty(a)&&a in Gh)return dc[t]=i[a];return t}var Wh=fo("animationend"),Xh=fo("animationiteration"),Yh=fo("animationstart"),qh=fo("transitionend"),$h=new Map,Kh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Ji(t,i){$h.set(t,i),l(i,[t])}for(var hc=0;hc<Kh.length;hc++){var fc=Kh[hc],T_=fc.toLowerCase(),A_=fc[0].toUpperCase()+fc.slice(1);Ji(T_,"on"+A_)}Ji(Wh,"onAnimationEnd"),Ji(Xh,"onAnimationIteration"),Ji(Yh,"onAnimationStart"),Ji("dblclick","onDoubleClick"),Ji("focusin","onFocus"),Ji("focusout","onBlur"),Ji(qh,"onTransitionEnd"),d("onMouseEnter",["mouseout","mouseover"]),d("onMouseLeave",["mouseout","mouseover"]),d("onPointerEnter",["pointerout","pointerover"]),d("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _a="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),C_=new Set("cancel close invalid load scroll toggle".split(" ").concat(_a));function Zh(t,i,a){var c=t.type||"unknown-event";t.currentTarget=a,Ja(c,i,void 0,t),t.currentTarget=null}function Qh(t,i){i=(i&4)!==0;for(var a=0;a<t.length;a++){var c=t[a],h=c.event;c=c.listeners;e:{var _=void 0;if(i)for(var T=c.length-1;0<=T;T--){var I=c[T],B=I.instance,re=I.currentTarget;if(I=I.listener,B!==_&&h.isPropagationStopped())break e;Zh(h,I,re),_=B}else for(T=0;T<c.length;T++){if(I=c[T],B=I.instance,re=I.currentTarget,I=I.listener,B!==_&&h.isPropagationStopped())break e;Zh(h,I,re),_=B}}}if(wi)throw t=is,wi=!1,is=null,t}function Ft(t,i){var a=i[Sc];a===void 0&&(a=i[Sc]=new Set);var c=t+"__bubble";a.has(c)||(Jh(i,t,2,!1),a.add(c))}function pc(t,i,a){var c=0;i&&(c|=4),Jh(a,t,c,i)}var po="_reactListening"+Math.random().toString(36).slice(2);function va(t){if(!t[po]){t[po]=!0,s.forEach(function(a){a!=="selectionchange"&&(C_.has(a)||pc(a,!1,t),pc(a,!0,t))});var i=t.nodeType===9?t:t.ownerDocument;i===null||i[po]||(i[po]=!0,pc("selectionchange",!1,i))}}function Jh(t,i,a,c){switch(Mh(i)){case 1:var h=Hg;break;case 4:h=jg;break;default:h=Zl}a=h.bind(null,i,a,t),h=void 0,!ns||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?t.addEventListener(i,a,{capture:!0,passive:h}):t.addEventListener(i,a,!0):h!==void 0?t.addEventListener(i,a,{passive:h}):t.addEventListener(i,a,!1)}function mc(t,i,a,c,h){var _=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var I=c.stateNode.containerInfo;if(I===h||I.nodeType===8&&I.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var B=T.tag;if((B===3||B===4)&&(B=T.stateNode.containerInfo,B===h||B.nodeType===8&&B.parentNode===h))return;T=T.return}for(;I!==null;){if(T=Rr(I),T===null)return;if(B=T.tag,B===5||B===6){c=_=T;continue e}I=I.parentNode}}c=c.return}Wn(function(){var re=_,_e=Le(a),ye=[];e:{var ge=$h.get(t);if(ge!==void 0){var Ue=ec,He=t;switch(t){case"keypress":if(oo(a)===0)break e;case"keydown":case"keyup":Ue=i_;break;case"focusin":He="focus",Ue=ic;break;case"focusout":He="blur",Ue=ic;break;case"beforeblur":case"afterblur":Ue=ic;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Ue=Th;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Ue=Wg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Ue=a_;break;case Wh:case Xh:case Yh:Ue=qg;break;case qh:Ue=l_;break;case"scroll":Ue=Vg;break;case"wheel":Ue=u_;break;case"copy":case"cut":case"paste":Ue=Kg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Ue=Ch}var Ve=(i&4)!==0,Xt=!Ve&&t==="scroll",Z=Ve?ge!==null?ge+"Capture":null:ge;Ve=[];for(var H=re,J;H!==null;){J=H;var Ee=J.stateNode;if(J.tag===5&&Ee!==null&&(J=Ee,Z!==null&&(Ee=Wi(H,Z),Ee!=null&&Ve.push(xa(H,Ee,J)))),Xt)break;H=H.return}0<Ve.length&&(ge=new Ue(ge,He,null,a,_e),ye.push({event:ge,listeners:Ve}))}}if((i&7)===0){e:{if(ge=t==="mouseover"||t==="pointerover",Ue=t==="mouseout"||t==="pointerout",ge&&a!==j&&(He=a.relatedTarget||a.fromElement)&&(Rr(He)||He[Ci]))break e;if((Ue||ge)&&(ge=_e.window===_e?_e:(ge=_e.ownerDocument)?ge.defaultView||ge.parentWindow:window,Ue?(He=a.relatedTarget||a.toElement,Ue=re,He=He?Rr(He):null,He!==null&&(Xt=Ti(He),He!==Xt||He.tag!==5&&He.tag!==6)&&(He=null)):(Ue=null,He=re),Ue!==He)){if(Ve=Th,Ee="onMouseLeave",Z="onMouseEnter",H="mouse",(t==="pointerout"||t==="pointerover")&&(Ve=Ch,Ee="onPointerLeave",Z="onPointerEnter",H="pointer"),Xt=Ue==null?ge:fs(Ue),J=He==null?ge:fs(He),ge=new Ve(Ee,H+"leave",Ue,a,_e),ge.target=Xt,ge.relatedTarget=J,Ee=null,Rr(_e)===re&&(Ve=new Ve(Z,H+"enter",He,a,_e),Ve.target=J,Ve.relatedTarget=Xt,Ee=Ve),Xt=Ee,Ue&&He)t:{for(Ve=Ue,Z=He,H=0,J=Ve;J;J=ds(J))H++;for(J=0,Ee=Z;Ee;Ee=ds(Ee))J++;for(;0<H-J;)Ve=ds(Ve),H--;for(;0<J-H;)Z=ds(Z),J--;for(;H--;){if(Ve===Z||Z!==null&&Ve===Z.alternate)break t;Ve=ds(Ve),Z=ds(Z)}Ve=null}else Ve=null;Ue!==null&&ef(ye,ge,Ue,Ve,!1),He!==null&&Xt!==null&&ef(ye,Xt,He,Ve,!0)}}e:{if(ge=re?fs(re):window,Ue=ge.nodeName&&ge.nodeName.toLowerCase(),Ue==="select"||Ue==="input"&&ge.type==="file")var Xe=__;else if(Dh(ge))if(Uh)Xe=S_;else{Xe=x_;var et=v_}else(Ue=ge.nodeName)&&Ue.toLowerCase()==="input"&&(ge.type==="checkbox"||ge.type==="radio")&&(Xe=y_);if(Xe&&(Xe=Xe(t,re))){Ih(ye,Xe,a,_e);break e}et&&et(t,ge,re),t==="focusout"&&(et=ge._wrapperState)&&et.controlled&&ge.type==="number"&&Je(ge,"number",ge.value)}switch(et=re?fs(re):window,t){case"focusin":(Dh(et)||et.contentEditable==="true")&&(cs=et,cc=re,ga=null);break;case"focusout":ga=cc=cs=null;break;case"mousedown":uc=!0;break;case"contextmenu":case"mouseup":case"dragend":uc=!1,Vh(ye,a,_e);break;case"selectionchange":if(w_)break;case"keydown":case"keyup":Vh(ye,a,_e)}var tt;if(sc)e:{switch(t){case"compositionstart":var at="onCompositionStart";break e;case"compositionend":at="onCompositionEnd";break e;case"compositionupdate":at="onCompositionUpdate";break e}at=void 0}else ls?Nh(t,a)&&(at="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(at="onCompositionStart");at&&(Rh&&a.locale!=="ko"&&(ls||at!=="onCompositionStart"?at==="onCompositionEnd"&&ls&&(tt=Eh()):(Qi=_e,Jl="value"in Qi?Qi.value:Qi.textContent,ls=!0)),et=mo(re,at),0<et.length&&(at=new Ah(at,t,null,a,_e),ye.push({event:at,listeners:et}),tt?at.data=tt:(tt=Lh(a),tt!==null&&(at.data=tt)))),(tt=h_?f_(t,a):p_(t,a))&&(re=mo(re,"onBeforeInput"),0<re.length&&(_e=new Ah("onBeforeInput","beforeinput",null,a,_e),ye.push({event:_e,listeners:re}),_e.data=tt))}Qh(ye,i)})}function xa(t,i,a){return{instance:t,listener:i,currentTarget:a}}function mo(t,i){for(var a=i+"Capture",c=[];t!==null;){var h=t,_=h.stateNode;h.tag===5&&_!==null&&(h=_,_=Wi(t,a),_!=null&&c.unshift(xa(t,_,h)),_=Wi(t,i),_!=null&&c.push(xa(t,_,h))),t=t.return}return c}function ds(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function ef(t,i,a,c,h){for(var _=i._reactName,T=[];a!==null&&a!==c;){var I=a,B=I.alternate,re=I.stateNode;if(B!==null&&B===c)break;I.tag===5&&re!==null&&(I=re,h?(B=Wi(a,_),B!=null&&T.unshift(xa(a,B,I))):h||(B=Wi(a,_),B!=null&&T.push(xa(a,B,I)))),a=a.return}T.length!==0&&t.push({event:i,listeners:T})}var R_=/\r\n?/g,b_=/\u0000|\uFFFD/g;function tf(t){return(typeof t=="string"?t:""+t).replace(R_,`
`).replace(b_,"")}function go(t,i,a){if(i=tf(i),tf(t)!==i&&a)throw Error(n(425))}function _o(){}var gc=null,_c=null;function vc(t,i){return t==="textarea"||t==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var xc=typeof setTimeout=="function"?setTimeout:void 0,P_=typeof clearTimeout=="function"?clearTimeout:void 0,nf=typeof Promise=="function"?Promise:void 0,N_=typeof queueMicrotask=="function"?queueMicrotask:typeof nf<"u"?function(t){return nf.resolve(null).then(t).catch(L_)}:xc;function L_(t){setTimeout(function(){throw t})}function yc(t,i){var a=i,c=0;do{var h=a.nextSibling;if(t.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){t.removeChild(h),ca(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);ca(i)}function er(t){for(;t!=null;t=t.nextSibling){var i=t.nodeType;if(i===1||i===3)break;if(i===8){if(i=t.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return t}function rf(t){t=t.previousSibling;for(var i=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return t;i--}else a==="/$"&&i++}t=t.previousSibling}return null}var hs=Math.random().toString(36).slice(2),vi="__reactFiber$"+hs,ya="__reactProps$"+hs,Ci="__reactContainer$"+hs,Sc="__reactEvents$"+hs,D_="__reactListeners$"+hs,I_="__reactHandles$"+hs;function Rr(t){var i=t[vi];if(i)return i;for(var a=t.parentNode;a;){if(i=a[Ci]||a[vi]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(t=rf(t);t!==null;){if(a=t[vi])return a;t=rf(t)}return i}t=a,a=t.parentNode}return null}function Sa(t){return t=t[vi]||t[Ci],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function fs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(n(33))}function vo(t){return t[ya]||null}var Mc=[],ps=-1;function tr(t){return{current:t}}function Ot(t){0>ps||(t.current=Mc[ps],Mc[ps]=null,ps--)}function It(t,i){ps++,Mc[ps]=t.current,t.current=i}var nr={},fn=tr(nr),wn=tr(!1),br=nr;function ms(t,i){var a=t.type.contextTypes;if(!a)return nr;var c=t.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},_;for(_ in a)h[_]=i[_];return c&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=h),h}function Tn(t){return t=t.childContextTypes,t!=null}function xo(){Ot(wn),Ot(fn)}function sf(t,i,a){if(fn.current!==nr)throw Error(n(168));It(fn,i),It(wn,a)}function af(t,i,a){var c=t.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(n(108,Se(t)||"Unknown",h));return le({},a,c)}function yo(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||nr,br=fn.current,It(fn,t),It(wn,wn.current),!0}function of(t,i,a){var c=t.stateNode;if(!c)throw Error(n(169));a?(t=af(t,i,br),c.__reactInternalMemoizedMergedChildContext=t,Ot(wn),Ot(fn),It(fn,t)):Ot(wn),It(wn,a)}var Ri=null,So=!1,Ec=!1;function lf(t){Ri===null?Ri=[t]:Ri.push(t)}function U_(t){So=!0,lf(t)}function ir(){if(!Ec&&Ri!==null){Ec=!0;var t=0,i=bt;try{var a=Ri;for(bt=1;t<a.length;t++){var c=a[t];do c=c(!0);while(c!==null)}Ri=null,So=!1}catch(h){throw Ri!==null&&(Ri=Ri.slice(t+1)),ie(nt,ir),h}finally{bt=i,Ec=!1}}return null}var gs=[],_s=0,Mo=null,Eo=0,Xn=[],Yn=0,Pr=null,bi=1,Pi="";function Nr(t,i){gs[_s++]=Eo,gs[_s++]=Mo,Mo=t,Eo=i}function cf(t,i,a){Xn[Yn++]=bi,Xn[Yn++]=Pi,Xn[Yn++]=Pr,Pr=t;var c=bi;t=Pi;var h=32-ke(c)-1;c&=~(1<<h),a+=1;var _=32-ke(i)+h;if(30<_){var T=h-h%5;_=(c&(1<<T)-1).toString(32),c>>=T,h-=T,bi=1<<32-ke(i)+h|a<<h|c,Pi=_+t}else bi=1<<_|a<<h|c,Pi=t}function wc(t){t.return!==null&&(Nr(t,1),cf(t,1,0))}function Tc(t){for(;t===Mo;)Mo=gs[--_s],gs[_s]=null,Eo=gs[--_s],gs[_s]=null;for(;t===Pr;)Pr=Xn[--Yn],Xn[Yn]=null,Pi=Xn[--Yn],Xn[Yn]=null,bi=Xn[--Yn],Xn[Yn]=null}var zn=null,Bn=null,Bt=!1,ri=null;function uf(t,i){var a=Zn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=t,i=t.deletions,i===null?(t.deletions=[a],t.flags|=16):i.push(a)}function df(t,i){switch(t.tag){case 5:var a=t.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(t.stateNode=i,zn=t,Bn=er(i.firstChild),!0):!1;case 6:return i=t.pendingProps===""||i.nodeType!==3?null:i,i!==null?(t.stateNode=i,zn=t,Bn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Pr!==null?{id:bi,overflow:Pi}:null,t.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=Zn(18,null,null,0),a.stateNode=i,a.return=t,t.child=a,zn=t,Bn=null,!0):!1;default:return!1}}function Ac(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Cc(t){if(Bt){var i=Bn;if(i){var a=i;if(!df(t,i)){if(Ac(t))throw Error(n(418));i=er(a.nextSibling);var c=zn;i&&df(t,i)?uf(c,a):(t.flags=t.flags&-4097|2,Bt=!1,zn=t)}}else{if(Ac(t))throw Error(n(418));t.flags=t.flags&-4097|2,Bt=!1,zn=t}}}function hf(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;zn=t}function wo(t){if(t!==zn)return!1;if(!Bt)return hf(t),Bt=!0,!1;var i;if((i=t.tag!==3)&&!(i=t.tag!==5)&&(i=t.type,i=i!=="head"&&i!=="body"&&!vc(t.type,t.memoizedProps)),i&&(i=Bn)){if(Ac(t))throw ff(),Error(n(418));for(;i;)uf(t,i),i=er(i.nextSibling)}if(hf(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(n(317));e:{for(t=t.nextSibling,i=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"){if(i===0){Bn=er(t.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}t=t.nextSibling}Bn=null}}else Bn=zn?er(t.stateNode.nextSibling):null;return!0}function ff(){for(var t=Bn;t;)t=er(t.nextSibling)}function vs(){Bn=zn=null,Bt=!1}function Rc(t){ri===null?ri=[t]:ri.push(t)}var F_=N.ReactCurrentBatchConfig;function Ma(t,i,a){if(t=a.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(n(309));var c=a.stateNode}if(!c)throw Error(n(147,t));var h=c,_=""+t;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===_?i.ref:(i=function(T){var I=h.refs;T===null?delete I[_]:I[_]=T},i._stringRef=_,i)}if(typeof t!="string")throw Error(n(284));if(!a._owner)throw Error(n(290,t))}return t}function To(t,i){throw t=Object.prototype.toString.call(i),Error(n(31,t==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":t))}function pf(t){var i=t._init;return i(t._payload)}function mf(t){function i(Z,H){if(t){var J=Z.deletions;J===null?(Z.deletions=[H],Z.flags|=16):J.push(H)}}function a(Z,H){if(!t)return null;for(;H!==null;)i(Z,H),H=H.sibling;return null}function c(Z,H){for(Z=new Map;H!==null;)H.key!==null?Z.set(H.key,H):Z.set(H.index,H),H=H.sibling;return Z}function h(Z,H){return Z=dr(Z,H),Z.index=0,Z.sibling=null,Z}function _(Z,H,J){return Z.index=J,t?(J=Z.alternate,J!==null?(J=J.index,J<H?(Z.flags|=2,H):J):(Z.flags|=2,H)):(Z.flags|=1048576,H)}function T(Z){return t&&Z.alternate===null&&(Z.flags|=2),Z}function I(Z,H,J,Ee){return H===null||H.tag!==6?(H=xu(J,Z.mode,Ee),H.return=Z,H):(H=h(H,J),H.return=Z,H)}function B(Z,H,J,Ee){var Xe=J.type;return Xe===U?_e(Z,H,J.props.children,Ee,J.key):H!==null&&(H.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===q&&pf(Xe)===H.type)?(Ee=h(H,J.props),Ee.ref=Ma(Z,H,J),Ee.return=Z,Ee):(Ee=$o(J.type,J.key,J.props,null,Z.mode,Ee),Ee.ref=Ma(Z,H,J),Ee.return=Z,Ee)}function re(Z,H,J,Ee){return H===null||H.tag!==4||H.stateNode.containerInfo!==J.containerInfo||H.stateNode.implementation!==J.implementation?(H=yu(J,Z.mode,Ee),H.return=Z,H):(H=h(H,J.children||[]),H.return=Z,H)}function _e(Z,H,J,Ee,Xe){return H===null||H.tag!==7?(H=zr(J,Z.mode,Ee,Xe),H.return=Z,H):(H=h(H,J),H.return=Z,H)}function ye(Z,H,J){if(typeof H=="string"&&H!==""||typeof H=="number")return H=xu(""+H,Z.mode,J),H.return=Z,H;if(typeof H=="object"&&H!==null){switch(H.$$typeof){case $:return J=$o(H.type,H.key,H.props,null,Z.mode,J),J.ref=Ma(Z,null,H),J.return=Z,J;case k:return H=yu(H,Z.mode,J),H.return=Z,H;case q:var Ee=H._init;return ye(Z,Ee(H._payload),J)}if(D(H)||he(H))return H=zr(H,Z.mode,J,null),H.return=Z,H;To(Z,H)}return null}function ge(Z,H,J,Ee){var Xe=H!==null?H.key:null;if(typeof J=="string"&&J!==""||typeof J=="number")return Xe!==null?null:I(Z,H,""+J,Ee);if(typeof J=="object"&&J!==null){switch(J.$$typeof){case $:return J.key===Xe?B(Z,H,J,Ee):null;case k:return J.key===Xe?re(Z,H,J,Ee):null;case q:return Xe=J._init,ge(Z,H,Xe(J._payload),Ee)}if(D(J)||he(J))return Xe!==null?null:_e(Z,H,J,Ee,null);To(Z,J)}return null}function Ue(Z,H,J,Ee,Xe){if(typeof Ee=="string"&&Ee!==""||typeof Ee=="number")return Z=Z.get(J)||null,I(H,Z,""+Ee,Xe);if(typeof Ee=="object"&&Ee!==null){switch(Ee.$$typeof){case $:return Z=Z.get(Ee.key===null?J:Ee.key)||null,B(H,Z,Ee,Xe);case k:return Z=Z.get(Ee.key===null?J:Ee.key)||null,re(H,Z,Ee,Xe);case q:var et=Ee._init;return Ue(Z,H,J,et(Ee._payload),Xe)}if(D(Ee)||he(Ee))return Z=Z.get(J)||null,_e(H,Z,Ee,Xe,null);To(H,Ee)}return null}function He(Z,H,J,Ee){for(var Xe=null,et=null,tt=H,at=H=0,an=null;tt!==null&&at<J.length;at++){tt.index>at?(an=tt,tt=null):an=tt.sibling;var Et=ge(Z,tt,J[at],Ee);if(Et===null){tt===null&&(tt=an);break}t&&tt&&Et.alternate===null&&i(Z,tt),H=_(Et,H,at),et===null?Xe=Et:et.sibling=Et,et=Et,tt=an}if(at===J.length)return a(Z,tt),Bt&&Nr(Z,at),Xe;if(tt===null){for(;at<J.length;at++)tt=ye(Z,J[at],Ee),tt!==null&&(H=_(tt,H,at),et===null?Xe=tt:et.sibling=tt,et=tt);return Bt&&Nr(Z,at),Xe}for(tt=c(Z,tt);at<J.length;at++)an=Ue(tt,Z,at,J[at],Ee),an!==null&&(t&&an.alternate!==null&&tt.delete(an.key===null?at:an.key),H=_(an,H,at),et===null?Xe=an:et.sibling=an,et=an);return t&&tt.forEach(function(hr){return i(Z,hr)}),Bt&&Nr(Z,at),Xe}function Ve(Z,H,J,Ee){var Xe=he(J);if(typeof Xe!="function")throw Error(n(150));if(J=Xe.call(J),J==null)throw Error(n(151));for(var et=Xe=null,tt=H,at=H=0,an=null,Et=J.next();tt!==null&&!Et.done;at++,Et=J.next()){tt.index>at?(an=tt,tt=null):an=tt.sibling;var hr=ge(Z,tt,Et.value,Ee);if(hr===null){tt===null&&(tt=an);break}t&&tt&&hr.alternate===null&&i(Z,tt),H=_(hr,H,at),et===null?Xe=hr:et.sibling=hr,et=hr,tt=an}if(Et.done)return a(Z,tt),Bt&&Nr(Z,at),Xe;if(tt===null){for(;!Et.done;at++,Et=J.next())Et=ye(Z,Et.value,Ee),Et!==null&&(H=_(Et,H,at),et===null?Xe=Et:et.sibling=Et,et=Et);return Bt&&Nr(Z,at),Xe}for(tt=c(Z,tt);!Et.done;at++,Et=J.next())Et=Ue(tt,Z,at,Et.value,Ee),Et!==null&&(t&&Et.alternate!==null&&tt.delete(Et.key===null?at:Et.key),H=_(Et,H,at),et===null?Xe=Et:et.sibling=Et,et=Et);return t&&tt.forEach(function(mv){return i(Z,mv)}),Bt&&Nr(Z,at),Xe}function Xt(Z,H,J,Ee){if(typeof J=="object"&&J!==null&&J.type===U&&J.key===null&&(J=J.props.children),typeof J=="object"&&J!==null){switch(J.$$typeof){case $:e:{for(var Xe=J.key,et=H;et!==null;){if(et.key===Xe){if(Xe=J.type,Xe===U){if(et.tag===7){a(Z,et.sibling),H=h(et,J.props.children),H.return=Z,Z=H;break e}}else if(et.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===q&&pf(Xe)===et.type){a(Z,et.sibling),H=h(et,J.props),H.ref=Ma(Z,et,J),H.return=Z,Z=H;break e}a(Z,et);break}else i(Z,et);et=et.sibling}J.type===U?(H=zr(J.props.children,Z.mode,Ee,J.key),H.return=Z,Z=H):(Ee=$o(J.type,J.key,J.props,null,Z.mode,Ee),Ee.ref=Ma(Z,H,J),Ee.return=Z,Z=Ee)}return T(Z);case k:e:{for(et=J.key;H!==null;){if(H.key===et)if(H.tag===4&&H.stateNode.containerInfo===J.containerInfo&&H.stateNode.implementation===J.implementation){a(Z,H.sibling),H=h(H,J.children||[]),H.return=Z,Z=H;break e}else{a(Z,H);break}else i(Z,H);H=H.sibling}H=yu(J,Z.mode,Ee),H.return=Z,Z=H}return T(Z);case q:return et=J._init,Xt(Z,H,et(J._payload),Ee)}if(D(J))return He(Z,H,J,Ee);if(he(J))return Ve(Z,H,J,Ee);To(Z,J)}return typeof J=="string"&&J!==""||typeof J=="number"?(J=""+J,H!==null&&H.tag===6?(a(Z,H.sibling),H=h(H,J),H.return=Z,Z=H):(a(Z,H),H=xu(J,Z.mode,Ee),H.return=Z,Z=H),T(Z)):a(Z,H)}return Xt}var xs=mf(!0),gf=mf(!1),Ao=tr(null),Co=null,ys=null,bc=null;function Pc(){bc=ys=Co=null}function Nc(t){var i=Ao.current;Ot(Ao),t._currentValue=i}function Lc(t,i,a){for(;t!==null;){var c=t.alternate;if((t.childLanes&i)!==i?(t.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),t===a)break;t=t.return}}function Ss(t,i){Co=t,bc=ys=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&i)!==0&&(An=!0),t.firstContext=null)}function qn(t){var i=t._currentValue;if(bc!==t)if(t={context:t,memoizedValue:i,next:null},ys===null){if(Co===null)throw Error(n(308));ys=t,Co.dependencies={lanes:0,firstContext:t}}else ys=ys.next=t;return i}var Lr=null;function Dc(t){Lr===null?Lr=[t]:Lr.push(t)}function _f(t,i,a,c){var h=i.interleaved;return h===null?(a.next=a,Dc(i)):(a.next=h.next,h.next=a),i.interleaved=a,Ni(t,c)}function Ni(t,i){t.lanes|=i;var a=t.alternate;for(a!==null&&(a.lanes|=i),a=t,t=t.return;t!==null;)t.childLanes|=i,a=t.alternate,a!==null&&(a.childLanes|=i),a=t,t=t.return;return a.tag===3?a.stateNode:null}var rr=!1;function Ic(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function vf(t,i){t=t.updateQueue,i.updateQueue===t&&(i.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Li(t,i){return{eventTime:t,lane:i,tag:0,payload:null,callback:null,next:null}}function sr(t,i,a){var c=t.updateQueue;if(c===null)return null;if(c=c.shared,(yt&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Ni(t,a)}return h=c.interleaved,h===null?(i.next=i,Dc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Ni(t,a)}function Ro(t,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=t.pendingLanes,a|=c,i.lanes=a,ql(t,a)}}function xf(t,i){var a=t.updateQueue,c=t.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,_=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};_===null?h=_=T:_=_.next=T,a=a.next}while(a!==null);_===null?h=_=i:_=_.next=i}else h=_=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:_,shared:c.shared,effects:c.effects},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=i:t.next=i,a.lastBaseUpdate=i}function bo(t,i,a,c){var h=t.updateQueue;rr=!1;var _=h.firstBaseUpdate,T=h.lastBaseUpdate,I=h.shared.pending;if(I!==null){h.shared.pending=null;var B=I,re=B.next;B.next=null,T===null?_=re:T.next=re,T=B;var _e=t.alternate;_e!==null&&(_e=_e.updateQueue,I=_e.lastBaseUpdate,I!==T&&(I===null?_e.firstBaseUpdate=re:I.next=re,_e.lastBaseUpdate=B))}if(_!==null){var ye=h.baseState;T=0,_e=re=B=null,I=_;do{var ge=I.lane,Ue=I.eventTime;if((c&ge)===ge){_e!==null&&(_e=_e.next={eventTime:Ue,lane:0,tag:I.tag,payload:I.payload,callback:I.callback,next:null});e:{var He=t,Ve=I;switch(ge=i,Ue=a,Ve.tag){case 1:if(He=Ve.payload,typeof He=="function"){ye=He.call(Ue,ye,ge);break e}ye=He;break e;case 3:He.flags=He.flags&-65537|128;case 0:if(He=Ve.payload,ge=typeof He=="function"?He.call(Ue,ye,ge):He,ge==null)break e;ye=le({},ye,ge);break e;case 2:rr=!0}}I.callback!==null&&I.lane!==0&&(t.flags|=64,ge=h.effects,ge===null?h.effects=[I]:ge.push(I))}else Ue={eventTime:Ue,lane:ge,tag:I.tag,payload:I.payload,callback:I.callback,next:null},_e===null?(re=_e=Ue,B=ye):_e=_e.next=Ue,T|=ge;if(I=I.next,I===null){if(I=h.shared.pending,I===null)break;ge=I,I=ge.next,ge.next=null,h.lastBaseUpdate=ge,h.shared.pending=null}}while(!0);if(_e===null&&(B=ye),h.baseState=B,h.firstBaseUpdate=re,h.lastBaseUpdate=_e,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else _===null&&(h.shared.lanes=0);Ur|=T,t.lanes=T,t.memoizedState=ye}}function yf(t,i,a){if(t=i.effects,i.effects=null,t!==null)for(i=0;i<t.length;i++){var c=t[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(n(191,h));h.call(c)}}}var Ea={},xi=tr(Ea),wa=tr(Ea),Ta=tr(Ea);function Dr(t){if(t===Ea)throw Error(n(174));return t}function Uc(t,i){switch(It(Ta,i),It(wa,t),It(xi,Ea),t=i.nodeType,t){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ce(null,"");break;default:t=t===8?i.parentNode:i,i=t.namespaceURI||null,t=t.tagName,i=Ce(i,t)}Ot(xi),It(xi,i)}function Ms(){Ot(xi),Ot(wa),Ot(Ta)}function Sf(t){Dr(Ta.current);var i=Dr(xi.current),a=Ce(i,t.type);i!==a&&(It(wa,t),It(xi,a))}function Fc(t){wa.current===t&&(Ot(xi),Ot(wa))}var jt=tr(0);function Po(t){for(var i=t;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Oc=[];function kc(){for(var t=0;t<Oc.length;t++)Oc[t]._workInProgressVersionPrimary=null;Oc.length=0}var No=N.ReactCurrentDispatcher,zc=N.ReactCurrentBatchConfig,Ir=0,Vt=null,Kt=null,rn=null,Lo=!1,Aa=!1,Ca=0,O_=0;function pn(){throw Error(n(321))}function Bc(t,i){if(i===null)return!1;for(var a=0;a<i.length&&a<t.length;a++)if(!ii(t[a],i[a]))return!1;return!0}function Hc(t,i,a,c,h,_){if(Ir=_,Vt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,No.current=t===null||t.memoizedState===null?H_:j_,t=a(c,h),Aa){_=0;do{if(Aa=!1,Ca=0,25<=_)throw Error(n(301));_+=1,rn=Kt=null,i.updateQueue=null,No.current=V_,t=a(c,h)}while(Aa)}if(No.current=Uo,i=Kt!==null&&Kt.next!==null,Ir=0,rn=Kt=Vt=null,Lo=!1,i)throw Error(n(300));return t}function jc(){var t=Ca!==0;return Ca=0,t}function yi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return rn===null?Vt.memoizedState=rn=t:rn=rn.next=t,rn}function $n(){if(Kt===null){var t=Vt.alternate;t=t!==null?t.memoizedState:null}else t=Kt.next;var i=rn===null?Vt.memoizedState:rn.next;if(i!==null)rn=i,Kt=t;else{if(t===null)throw Error(n(310));Kt=t,t={memoizedState:Kt.memoizedState,baseState:Kt.baseState,baseQueue:Kt.baseQueue,queue:Kt.queue,next:null},rn===null?Vt.memoizedState=rn=t:rn=rn.next=t}return rn}function Ra(t,i){return typeof i=="function"?i(t):i}function Vc(t){var i=$n(),a=i.queue;if(a===null)throw Error(n(311));a.lastRenderedReducer=t;var c=Kt,h=c.baseQueue,_=a.pending;if(_!==null){if(h!==null){var T=h.next;h.next=_.next,_.next=T}c.baseQueue=h=_,a.pending=null}if(h!==null){_=h.next,c=c.baseState;var I=T=null,B=null,re=_;do{var _e=re.lane;if((Ir&_e)===_e)B!==null&&(B=B.next={lane:0,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null}),c=re.hasEagerState?re.eagerState:t(c,re.action);else{var ye={lane:_e,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null};B===null?(I=B=ye,T=c):B=B.next=ye,Vt.lanes|=_e,Ur|=_e}re=re.next}while(re!==null&&re!==_);B===null?T=c:B.next=I,ii(c,i.memoizedState)||(An=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=B,a.lastRenderedState=c}if(t=a.interleaved,t!==null){h=t;do _=h.lane,Vt.lanes|=_,Ur|=_,h=h.next;while(h!==t)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function Gc(t){var i=$n(),a=i.queue;if(a===null)throw Error(n(311));a.lastRenderedReducer=t;var c=a.dispatch,h=a.pending,_=i.memoizedState;if(h!==null){a.pending=null;var T=h=h.next;do _=t(_,T.action),T=T.next;while(T!==h);ii(_,i.memoizedState)||(An=!0),i.memoizedState=_,i.baseQueue===null&&(i.baseState=_),a.lastRenderedState=_}return[_,c]}function Mf(){}function Ef(t,i){var a=Vt,c=$n(),h=i(),_=!ii(c.memoizedState,h);if(_&&(c.memoizedState=h,An=!0),c=c.queue,Wc(Af.bind(null,a,c,t),[t]),c.getSnapshot!==i||_||rn!==null&&rn.memoizedState.tag&1){if(a.flags|=2048,ba(9,Tf.bind(null,a,c,h,i),void 0,null),sn===null)throw Error(n(349));(Ir&30)!==0||wf(a,i,h)}return h}function wf(t,i,a){t.flags|=16384,t={getSnapshot:i,value:a},i=Vt.updateQueue,i===null?(i={lastEffect:null,stores:null},Vt.updateQueue=i,i.stores=[t]):(a=i.stores,a===null?i.stores=[t]:a.push(t))}function Tf(t,i,a,c){i.value=a,i.getSnapshot=c,Cf(i)&&Rf(t)}function Af(t,i,a){return a(function(){Cf(i)&&Rf(t)})}function Cf(t){var i=t.getSnapshot;t=t.value;try{var a=i();return!ii(t,a)}catch{return!0}}function Rf(t){var i=Ni(t,1);i!==null&&li(i,t,1,-1)}function bf(t){var i=yi();return typeof t=="function"&&(t=t()),i.memoizedState=i.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ra,lastRenderedState:t},i.queue=t,t=t.dispatch=B_.bind(null,Vt,t),[i.memoizedState,t]}function ba(t,i,a,c){return t={tag:t,create:i,destroy:a,deps:c,next:null},i=Vt.updateQueue,i===null?(i={lastEffect:null,stores:null},Vt.updateQueue=i,i.lastEffect=t.next=t):(a=i.lastEffect,a===null?i.lastEffect=t.next=t:(c=a.next,a.next=t,t.next=c,i.lastEffect=t)),t}function Pf(){return $n().memoizedState}function Do(t,i,a,c){var h=yi();Vt.flags|=t,h.memoizedState=ba(1|i,a,void 0,c===void 0?null:c)}function Io(t,i,a,c){var h=$n();c=c===void 0?null:c;var _=void 0;if(Kt!==null){var T=Kt.memoizedState;if(_=T.destroy,c!==null&&Bc(c,T.deps)){h.memoizedState=ba(i,a,_,c);return}}Vt.flags|=t,h.memoizedState=ba(1|i,a,_,c)}function Nf(t,i){return Do(8390656,8,t,i)}function Wc(t,i){return Io(2048,8,t,i)}function Lf(t,i){return Io(4,2,t,i)}function Df(t,i){return Io(4,4,t,i)}function If(t,i){if(typeof i=="function")return t=t(),i(t),function(){i(null)};if(i!=null)return t=t(),i.current=t,function(){i.current=null}}function Uf(t,i,a){return a=a!=null?a.concat([t]):null,Io(4,4,If.bind(null,i,t),a)}function Xc(){}function Ff(t,i){var a=$n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Bc(i,c[1])?c[0]:(a.memoizedState=[t,i],t)}function Of(t,i){var a=$n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Bc(i,c[1])?c[0]:(t=t(),a.memoizedState=[t,i],t)}function kf(t,i,a){return(Ir&21)===0?(t.baseState&&(t.baseState=!1,An=!0),t.memoizedState=a):(ii(a,i)||(a=ss(),Vt.lanes|=a,Ur|=a,t.baseState=!0),i)}function k_(t,i){var a=bt;bt=a!==0&&4>a?a:4,t(!0);var c=zc.transition;zc.transition={};try{t(!1),i()}finally{bt=a,zc.transition=c}}function zf(){return $n().memoizedState}function z_(t,i,a){var c=cr(t);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Bf(t))Hf(i,a);else if(a=_f(t,i,a,c),a!==null){var h=yn();li(a,t,c,h),jf(a,i,c)}}function B_(t,i,a){var c=cr(t),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Bf(t))Hf(i,h);else{var _=t.alternate;if(t.lanes===0&&(_===null||_.lanes===0)&&(_=i.lastRenderedReducer,_!==null))try{var T=i.lastRenderedState,I=_(T,a);if(h.hasEagerState=!0,h.eagerState=I,ii(I,T)){var B=i.interleaved;B===null?(h.next=h,Dc(i)):(h.next=B.next,B.next=h),i.interleaved=h;return}}catch{}finally{}a=_f(t,i,h,c),a!==null&&(h=yn(),li(a,t,c,h),jf(a,i,c))}}function Bf(t){var i=t.alternate;return t===Vt||i!==null&&i===Vt}function Hf(t,i){Aa=Lo=!0;var a=t.pending;a===null?i.next=i:(i.next=a.next,a.next=i),t.pending=i}function jf(t,i,a){if((a&4194240)!==0){var c=i.lanes;c&=t.pendingLanes,a|=c,i.lanes=a,ql(t,a)}}var Uo={readContext:qn,useCallback:pn,useContext:pn,useEffect:pn,useImperativeHandle:pn,useInsertionEffect:pn,useLayoutEffect:pn,useMemo:pn,useReducer:pn,useRef:pn,useState:pn,useDebugValue:pn,useDeferredValue:pn,useTransition:pn,useMutableSource:pn,useSyncExternalStore:pn,useId:pn,unstable_isNewReconciler:!1},H_={readContext:qn,useCallback:function(t,i){return yi().memoizedState=[t,i===void 0?null:i],t},useContext:qn,useEffect:Nf,useImperativeHandle:function(t,i,a){return a=a!=null?a.concat([t]):null,Do(4194308,4,If.bind(null,i,t),a)},useLayoutEffect:function(t,i){return Do(4194308,4,t,i)},useInsertionEffect:function(t,i){return Do(4,2,t,i)},useMemo:function(t,i){var a=yi();return i=i===void 0?null:i,t=t(),a.memoizedState=[t,i],t},useReducer:function(t,i,a){var c=yi();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},c.queue=t,t=t.dispatch=z_.bind(null,Vt,t),[c.memoizedState,t]},useRef:function(t){var i=yi();return t={current:t},i.memoizedState=t},useState:bf,useDebugValue:Xc,useDeferredValue:function(t){return yi().memoizedState=t},useTransition:function(){var t=bf(!1),i=t[0];return t=k_.bind(null,t[1]),yi().memoizedState=t,[i,t]},useMutableSource:function(){},useSyncExternalStore:function(t,i,a){var c=Vt,h=yi();if(Bt){if(a===void 0)throw Error(n(407));a=a()}else{if(a=i(),sn===null)throw Error(n(349));(Ir&30)!==0||wf(c,i,a)}h.memoizedState=a;var _={value:a,getSnapshot:i};return h.queue=_,Nf(Af.bind(null,c,_,t),[t]),c.flags|=2048,ba(9,Tf.bind(null,c,_,a,i),void 0,null),a},useId:function(){var t=yi(),i=sn.identifierPrefix;if(Bt){var a=Pi,c=bi;a=(c&~(1<<32-ke(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Ca++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=O_++,i=":"+i+"r"+a.toString(32)+":";return t.memoizedState=i},unstable_isNewReconciler:!1},j_={readContext:qn,useCallback:Ff,useContext:qn,useEffect:Wc,useImperativeHandle:Uf,useInsertionEffect:Lf,useLayoutEffect:Df,useMemo:Of,useReducer:Vc,useRef:Pf,useState:function(){return Vc(Ra)},useDebugValue:Xc,useDeferredValue:function(t){var i=$n();return kf(i,Kt.memoizedState,t)},useTransition:function(){var t=Vc(Ra)[0],i=$n().memoizedState;return[t,i]},useMutableSource:Mf,useSyncExternalStore:Ef,useId:zf,unstable_isNewReconciler:!1},V_={readContext:qn,useCallback:Ff,useContext:qn,useEffect:Wc,useImperativeHandle:Uf,useInsertionEffect:Lf,useLayoutEffect:Df,useMemo:Of,useReducer:Gc,useRef:Pf,useState:function(){return Gc(Ra)},useDebugValue:Xc,useDeferredValue:function(t){var i=$n();return Kt===null?i.memoizedState=t:kf(i,Kt.memoizedState,t)},useTransition:function(){var t=Gc(Ra)[0],i=$n().memoizedState;return[t,i]},useMutableSource:Mf,useSyncExternalStore:Ef,useId:zf,unstable_isNewReconciler:!1};function si(t,i){if(t&&t.defaultProps){i=le({},i),t=t.defaultProps;for(var a in t)i[a]===void 0&&(i[a]=t[a]);return i}return i}function Yc(t,i,a,c){i=t.memoizedState,a=a(c,i),a=a==null?i:le({},i,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Fo={isMounted:function(t){return(t=t._reactInternals)?Ti(t)===t:!1},enqueueSetState:function(t,i,a){t=t._reactInternals;var c=yn(),h=cr(t),_=Li(c,h);_.payload=i,a!=null&&(_.callback=a),i=sr(t,_,h),i!==null&&(li(i,t,h,c),Ro(i,t,h))},enqueueReplaceState:function(t,i,a){t=t._reactInternals;var c=yn(),h=cr(t),_=Li(c,h);_.tag=1,_.payload=i,a!=null&&(_.callback=a),i=sr(t,_,h),i!==null&&(li(i,t,h,c),Ro(i,t,h))},enqueueForceUpdate:function(t,i){t=t._reactInternals;var a=yn(),c=cr(t),h=Li(a,c);h.tag=2,i!=null&&(h.callback=i),i=sr(t,h,c),i!==null&&(li(i,t,c,a),Ro(i,t,c))}};function Vf(t,i,a,c,h,_,T){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(c,_,T):i.prototype&&i.prototype.isPureReactComponent?!ma(a,c)||!ma(h,_):!0}function Gf(t,i,a){var c=!1,h=nr,_=i.contextType;return typeof _=="object"&&_!==null?_=qn(_):(h=Tn(i)?br:fn.current,c=i.contextTypes,_=(c=c!=null)?ms(t,h):nr),i=new i(a,_),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Fo,t.stateNode=i,i._reactInternals=t,c&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=h,t.__reactInternalMemoizedMaskedChildContext=_),i}function Wf(t,i,a,c){t=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==t&&Fo.enqueueReplaceState(i,i.state,null)}function qc(t,i,a,c){var h=t.stateNode;h.props=a,h.state=t.memoizedState,h.refs={},Ic(t);var _=i.contextType;typeof _=="object"&&_!==null?h.context=qn(_):(_=Tn(i)?br:fn.current,h.context=ms(t,_)),h.state=t.memoizedState,_=i.getDerivedStateFromProps,typeof _=="function"&&(Yc(t,i,_,a),h.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Fo.enqueueReplaceState(h,h.state,null),bo(t,a,h,c),h.state=t.memoizedState),typeof h.componentDidMount=="function"&&(t.flags|=4194308)}function Es(t,i){try{var a="",c=i;do a+=de(c),c=c.return;while(c);var h=a}catch(_){h=`
Error generating stack: `+_.message+`
`+_.stack}return{value:t,source:i,stack:h,digest:null}}function $c(t,i,a){return{value:t,source:null,stack:a??null,digest:i??null}}function Kc(t,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var G_=typeof WeakMap=="function"?WeakMap:Map;function Xf(t,i,a){a=Li(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){Vo||(Vo=!0,du=c),Kc(t,i)},a}function Yf(t,i,a){a=Li(-1,a),a.tag=3;var c=t.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){Kc(t,i)}}var _=t.stateNode;return _!==null&&typeof _.componentDidCatch=="function"&&(a.callback=function(){Kc(t,i),typeof c!="function"&&(or===null?or=new Set([this]):or.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function qf(t,i,a){var c=t.pingCache;if(c===null){c=t.pingCache=new G_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),t=rv.bind(null,t,i,a),i.then(t,t))}function $f(t){do{var i;if((i=t.tag===13)&&(i=t.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return t;t=t.return}while(t!==null);return null}function Kf(t,i,a,c,h){return(t.mode&1)===0?(t===i?t.flags|=65536:(t.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Li(-1,1),i.tag=2,sr(a,i,1))),a.lanes|=1),t):(t.flags|=65536,t.lanes=h,t)}var W_=N.ReactCurrentOwner,An=!1;function xn(t,i,a,c){i.child=t===null?gf(i,null,a,c):xs(i,t.child,a,c)}function Zf(t,i,a,c,h){a=a.render;var _=i.ref;return Ss(i,h),c=Hc(t,i,a,c,_,h),a=jc(),t!==null&&!An?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~h,Di(t,i,h)):(Bt&&a&&wc(i),i.flags|=1,xn(t,i,c,h),i.child)}function Qf(t,i,a,c,h){if(t===null){var _=a.type;return typeof _=="function"&&!vu(_)&&_.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=_,Jf(t,i,_,c,h)):(t=$o(a.type,null,c,i,i.mode,h),t.ref=i.ref,t.return=i,i.child=t)}if(_=t.child,(t.lanes&h)===0){var T=_.memoizedProps;if(a=a.compare,a=a!==null?a:ma,a(T,c)&&t.ref===i.ref)return Di(t,i,h)}return i.flags|=1,t=dr(_,c),t.ref=i.ref,t.return=i,i.child=t}function Jf(t,i,a,c,h){if(t!==null){var _=t.memoizedProps;if(ma(_,c)&&t.ref===i.ref)if(An=!1,i.pendingProps=c=_,(t.lanes&h)!==0)(t.flags&131072)!==0&&(An=!0);else return i.lanes=t.lanes,Di(t,i,h)}return Zc(t,i,a,c,h)}function ep(t,i,a){var c=i.pendingProps,h=c.children,_=t!==null?t.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},It(Ts,Hn),Hn|=a;else{if((a&1073741824)===0)return t=_!==null?_.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:t,cachePool:null,transitions:null},i.updateQueue=null,It(Ts,Hn),Hn|=t,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=_!==null?_.baseLanes:a,It(Ts,Hn),Hn|=c}else _!==null?(c=_.baseLanes|a,i.memoizedState=null):c=a,It(Ts,Hn),Hn|=c;return xn(t,i,h,a),i.child}function tp(t,i){var a=i.ref;(t===null&&a!==null||t!==null&&t.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function Zc(t,i,a,c,h){var _=Tn(a)?br:fn.current;return _=ms(i,_),Ss(i,h),a=Hc(t,i,a,c,_,h),c=jc(),t!==null&&!An?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~h,Di(t,i,h)):(Bt&&c&&wc(i),i.flags|=1,xn(t,i,a,h),i.child)}function np(t,i,a,c,h){if(Tn(a)){var _=!0;yo(i)}else _=!1;if(Ss(i,h),i.stateNode===null)ko(t,i),Gf(i,a,c),qc(i,a,c,h),c=!0;else if(t===null){var T=i.stateNode,I=i.memoizedProps;T.props=I;var B=T.context,re=a.contextType;typeof re=="object"&&re!==null?re=qn(re):(re=Tn(a)?br:fn.current,re=ms(i,re));var _e=a.getDerivedStateFromProps,ye=typeof _e=="function"||typeof T.getSnapshotBeforeUpdate=="function";ye||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==c||B!==re)&&Wf(i,T,c,re),rr=!1;var ge=i.memoizedState;T.state=ge,bo(i,c,T,h),B=i.memoizedState,I!==c||ge!==B||wn.current||rr?(typeof _e=="function"&&(Yc(i,a,_e,c),B=i.memoizedState),(I=rr||Vf(i,a,I,c,ge,B,re))?(ye||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=B),T.props=c,T.state=B,T.context=re,c=I):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,vf(t,i),I=i.memoizedProps,re=i.type===i.elementType?I:si(i.type,I),T.props=re,ye=i.pendingProps,ge=T.context,B=a.contextType,typeof B=="object"&&B!==null?B=qn(B):(B=Tn(a)?br:fn.current,B=ms(i,B));var Ue=a.getDerivedStateFromProps;(_e=typeof Ue=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==ye||ge!==B)&&Wf(i,T,c,B),rr=!1,ge=i.memoizedState,T.state=ge,bo(i,c,T,h);var He=i.memoizedState;I!==ye||ge!==He||wn.current||rr?(typeof Ue=="function"&&(Yc(i,a,Ue,c),He=i.memoizedState),(re=rr||Vf(i,a,re,c,ge,He,B)||!1)?(_e||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,He,B),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,He,B)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||I===t.memoizedProps&&ge===t.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===t.memoizedProps&&ge===t.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=He),T.props=c,T.state=He,T.context=B,c=re):(typeof T.componentDidUpdate!="function"||I===t.memoizedProps&&ge===t.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===t.memoizedProps&&ge===t.memoizedState||(i.flags|=1024),c=!1)}return Qc(t,i,a,c,_,h)}function Qc(t,i,a,c,h,_){tp(t,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&of(i,a,!1),Di(t,i,_);c=i.stateNode,W_.current=i;var I=T&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,t!==null&&T?(i.child=xs(i,t.child,null,_),i.child=xs(i,null,I,_)):xn(t,i,I,_),i.memoizedState=c.state,h&&of(i,a,!0),i.child}function ip(t){var i=t.stateNode;i.pendingContext?sf(t,i.pendingContext,i.pendingContext!==i.context):i.context&&sf(t,i.context,!1),Uc(t,i.containerInfo)}function rp(t,i,a,c,h){return vs(),Rc(h),i.flags|=256,xn(t,i,a,c),i.child}var Jc={dehydrated:null,treeContext:null,retryLane:0};function eu(t){return{baseLanes:t,cachePool:null,transitions:null}}function sp(t,i,a){var c=i.pendingProps,h=jt.current,_=!1,T=(i.flags&128)!==0,I;if((I=T)||(I=t!==null&&t.memoizedState===null?!1:(h&2)!==0),I?(_=!0,i.flags&=-129):(t===null||t.memoizedState!==null)&&(h|=1),It(jt,h&1),t===null)return Cc(i),t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?((i.mode&1)===0?i.lanes=1:t.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,t=c.fallback,_?(c=i.mode,_=i.child,T={mode:"hidden",children:T},(c&1)===0&&_!==null?(_.childLanes=0,_.pendingProps=T):_=Ko(T,c,0,null),t=zr(t,c,a,null),_.return=i,t.return=i,_.sibling=t,i.child=_,i.child.memoizedState=eu(a),i.memoizedState=Jc,t):tu(i,T));if(h=t.memoizedState,h!==null&&(I=h.dehydrated,I!==null))return X_(t,i,T,c,I,h,a);if(_){_=c.fallback,T=i.mode,h=t.child,I=h.sibling;var B={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=B,i.deletions=null):(c=dr(h,B),c.subtreeFlags=h.subtreeFlags&14680064),I!==null?_=dr(I,_):(_=zr(_,T,a,null),_.flags|=2),_.return=i,c.return=i,c.sibling=_,i.child=c,c=_,_=i.child,T=t.child.memoizedState,T=T===null?eu(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},_.memoizedState=T,_.childLanes=t.childLanes&~a,i.memoizedState=Jc,c}return _=t.child,t=_.sibling,c=dr(_,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,t!==null&&(a=i.deletions,a===null?(i.deletions=[t],i.flags|=16):a.push(t)),i.child=c,i.memoizedState=null,c}function tu(t,i){return i=Ko({mode:"visible",children:i},t.mode,0,null),i.return=t,t.child=i}function Oo(t,i,a,c){return c!==null&&Rc(c),xs(i,t.child,null,a),t=tu(i,i.pendingProps.children),t.flags|=2,i.memoizedState=null,t}function X_(t,i,a,c,h,_,T){if(a)return i.flags&256?(i.flags&=-257,c=$c(Error(n(422))),Oo(t,i,T,c)):i.memoizedState!==null?(i.child=t.child,i.flags|=128,null):(_=c.fallback,h=i.mode,c=Ko({mode:"visible",children:c.children},h,0,null),_=zr(_,h,T,null),_.flags|=2,c.return=i,_.return=i,c.sibling=_,i.child=c,(i.mode&1)!==0&&xs(i,t.child,null,T),i.child.memoizedState=eu(T),i.memoizedState=Jc,_);if((i.mode&1)===0)return Oo(t,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var I=c.dgst;return c=I,_=Error(n(419)),c=$c(_,c,void 0),Oo(t,i,T,c)}if(I=(T&t.childLanes)!==0,An||I){if(c=sn,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==_.retryLane&&(_.retryLane=h,Ni(t,h),li(c,t,h,-1))}return _u(),c=$c(Error(n(421))),Oo(t,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=t.child,i=sv.bind(null,t),h._reactRetry=i,null):(t=_.treeContext,Bn=er(h.nextSibling),zn=i,Bt=!0,ri=null,t!==null&&(Xn[Yn++]=bi,Xn[Yn++]=Pi,Xn[Yn++]=Pr,bi=t.id,Pi=t.overflow,Pr=i),i=tu(i,c.children),i.flags|=4096,i)}function ap(t,i,a){t.lanes|=i;var c=t.alternate;c!==null&&(c.lanes|=i),Lc(t.return,i,a)}function nu(t,i,a,c,h){var _=t.memoizedState;_===null?t.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(_.isBackwards=i,_.rendering=null,_.renderingStartTime=0,_.last=c,_.tail=a,_.tailMode=h)}function op(t,i,a){var c=i.pendingProps,h=c.revealOrder,_=c.tail;if(xn(t,i,c.children,a),c=jt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=i.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&ap(t,a,i);else if(t.tag===19)ap(t,a,i);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===i)break e;for(;t.sibling===null;){if(t.return===null||t.return===i)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}c&=1}if(It(jt,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)t=a.alternate,t!==null&&Po(t)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),nu(i,!1,h,a,_);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(t=h.alternate,t!==null&&Po(t)===null){i.child=h;break}t=h.sibling,h.sibling=a,a=h,h=t}nu(i,!0,a,null,_);break;case"together":nu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function ko(t,i){(i.mode&1)===0&&t!==null&&(t.alternate=null,i.alternate=null,i.flags|=2)}function Di(t,i,a){if(t!==null&&(i.dependencies=t.dependencies),Ur|=i.lanes,(a&i.childLanes)===0)return null;if(t!==null&&i.child!==t.child)throw Error(n(153));if(i.child!==null){for(t=i.child,a=dr(t,t.pendingProps),i.child=a,a.return=i;t.sibling!==null;)t=t.sibling,a=a.sibling=dr(t,t.pendingProps),a.return=i;a.sibling=null}return i.child}function Y_(t,i,a){switch(i.tag){case 3:ip(i),vs();break;case 5:Sf(i);break;case 1:Tn(i.type)&&yo(i);break;case 4:Uc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;It(Ao,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(It(jt,jt.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?sp(t,i,a):(It(jt,jt.current&1),t=Di(t,i,a),t!==null?t.sibling:null);It(jt,jt.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(t.flags&128)!==0){if(c)return op(t,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),It(jt,jt.current),c)break;return null;case 22:case 23:return i.lanes=0,ep(t,i,a)}return Di(t,i,a)}var lp,iu,cp,up;lp=function(t,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)t.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},iu=function(){},cp=function(t,i,a,c){var h=t.memoizedProps;if(h!==c){t=i.stateNode,Dr(xi.current);var _=null;switch(a){case"input":h=Tt(t,h),c=Tt(t,c),_=[];break;case"select":h=le({},h,{value:void 0}),c=le({},c,{value:void 0}),_=[];break;case"textarea":h=te(t,h),c=te(t,c),_=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(t.onclick=_o)}ot(a,c);var T;a=null;for(re in h)if(!c.hasOwnProperty(re)&&h.hasOwnProperty(re)&&h[re]!=null)if(re==="style"){var I=h[re];for(T in I)I.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else re!=="dangerouslySetInnerHTML"&&re!=="children"&&re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&re!=="autoFocus"&&(o.hasOwnProperty(re)?_||(_=[]):(_=_||[]).push(re,null));for(re in c){var B=c[re];if(I=h!=null?h[re]:void 0,c.hasOwnProperty(re)&&B!==I&&(B!=null||I!=null))if(re==="style")if(I){for(T in I)!I.hasOwnProperty(T)||B&&B.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in B)B.hasOwnProperty(T)&&I[T]!==B[T]&&(a||(a={}),a[T]=B[T])}else a||(_||(_=[]),_.push(re,a)),a=B;else re==="dangerouslySetInnerHTML"?(B=B?B.__html:void 0,I=I?I.__html:void 0,B!=null&&I!==B&&(_=_||[]).push(re,B)):re==="children"?typeof B!="string"&&typeof B!="number"||(_=_||[]).push(re,""+B):re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&(o.hasOwnProperty(re)?(B!=null&&re==="onScroll"&&Ft("scroll",t),_||I===B||(_=[])):(_=_||[]).push(re,B))}a&&(_=_||[]).push("style",a);var re=_;(i.updateQueue=re)&&(i.flags|=4)}},up=function(t,i,a,c){a!==c&&(i.flags|=4)};function Pa(t,i){if(!Bt)switch(t.tailMode){case"hidden":i=t.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||t.tail===null?t.tail=null:t.tail.sibling=null:c.sibling=null}}function mn(t){var i=t.alternate!==null&&t.alternate.child===t.child,a=0,c=0;if(i)for(var h=t.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=t,h=h.sibling;else for(h=t.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=t,h=h.sibling;return t.subtreeFlags|=c,t.childLanes=a,i}function q_(t,i,a){var c=i.pendingProps;switch(Tc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return mn(i),null;case 1:return Tn(i.type)&&xo(),mn(i),null;case 3:return c=i.stateNode,Ms(),Ot(wn),Ot(fn),kc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(t===null||t.child===null)&&(wo(i)?i.flags|=4:t===null||t.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,ri!==null&&(pu(ri),ri=null))),iu(t,i),mn(i),null;case 5:Fc(i);var h=Dr(Ta.current);if(a=i.type,t!==null&&i.stateNode!=null)cp(t,i,a,c,h),t.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(n(166));return mn(i),null}if(t=Dr(xi.current),wo(i)){c=i.stateNode,a=i.type;var _=i.memoizedProps;switch(c[vi]=i,c[ya]=_,t=(i.mode&1)!==0,a){case"dialog":Ft("cancel",c),Ft("close",c);break;case"iframe":case"object":case"embed":Ft("load",c);break;case"video":case"audio":for(h=0;h<_a.length;h++)Ft(_a[h],c);break;case"source":Ft("error",c);break;case"img":case"image":case"link":Ft("error",c),Ft("load",c);break;case"details":Ft("toggle",c);break;case"input":lt(c,_),Ft("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!_.multiple},Ft("invalid",c);break;case"textarea":pe(c,_),Ft("invalid",c)}ot(a,_),h=null;for(var T in _)if(_.hasOwnProperty(T)){var I=_[T];T==="children"?typeof I=="string"?c.textContent!==I&&(_.suppressHydrationWarning!==!0&&go(c.textContent,I,t),h=["children",I]):typeof I=="number"&&c.textContent!==""+I&&(_.suppressHydrationWarning!==!0&&go(c.textContent,I,t),h=["children",""+I]):o.hasOwnProperty(T)&&I!=null&&T==="onScroll"&&Ft("scroll",c)}switch(a){case"input":Ke(c),At(c,_,!0);break;case"textarea":Ke(c),fe(c);break;case"select":case"option":break;default:typeof _.onClick=="function"&&(c.onclick=_o)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Ye(a)),t==="http://www.w3.org/1999/xhtml"?a==="script"?(t=T.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof c.is=="string"?t=T.createElement(a,{is:c.is}):(t=T.createElement(a),a==="select"&&(T=t,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):t=T.createElementNS(t,a),t[vi]=i,t[ya]=c,lp(t,i,!1,!1),i.stateNode=t;e:{switch(T=Ct(a,c),a){case"dialog":Ft("cancel",t),Ft("close",t),h=c;break;case"iframe":case"object":case"embed":Ft("load",t),h=c;break;case"video":case"audio":for(h=0;h<_a.length;h++)Ft(_a[h],t);h=c;break;case"source":Ft("error",t),h=c;break;case"img":case"image":case"link":Ft("error",t),Ft("load",t),h=c;break;case"details":Ft("toggle",t),h=c;break;case"input":lt(t,c),h=Tt(t,c),Ft("invalid",t);break;case"option":h=c;break;case"select":t._wrapperState={wasMultiple:!!c.multiple},h=le({},c,{value:void 0}),Ft("invalid",t);break;case"textarea":pe(t,c),h=te(t,c),Ft("invalid",t);break;default:h=c}ot(a,h),I=h;for(_ in I)if(I.hasOwnProperty(_)){var B=I[_];_==="style"?ze(t,B):_==="dangerouslySetInnerHTML"?(B=B?B.__html:void 0,B!=null&&vt(t,B)):_==="children"?typeof B=="string"?(a!=="textarea"||B!=="")&&Me(t,B):typeof B=="number"&&Me(t,""+B):_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&_!=="autoFocus"&&(o.hasOwnProperty(_)?B!=null&&_==="onScroll"&&Ft("scroll",t):B!=null&&b(t,_,B,T))}switch(a){case"input":Ke(t),At(t,c,!1);break;case"textarea":Ke(t),fe(t);break;case"option":c.value!=null&&t.setAttribute("value",""+Ae(c.value));break;case"select":t.multiple=!!c.multiple,_=c.value,_!=null?R(t,!!c.multiple,_,!1):c.defaultValue!=null&&R(t,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(t.onclick=_o)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return mn(i),null;case 6:if(t&&i.stateNode!=null)up(t,i,t.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(n(166));if(a=Dr(Ta.current),Dr(xi.current),wo(i)){if(c=i.stateNode,a=i.memoizedProps,c[vi]=i,(_=c.nodeValue!==a)&&(t=zn,t!==null))switch(t.tag){case 3:go(c.nodeValue,a,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&go(c.nodeValue,a,(t.mode&1)!==0)}_&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[vi]=i,i.stateNode=c}return mn(i),null;case 13:if(Ot(jt),c=i.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Bt&&Bn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)ff(),vs(),i.flags|=98560,_=!1;else if(_=wo(i),c!==null&&c.dehydrated!==null){if(t===null){if(!_)throw Error(n(318));if(_=i.memoizedState,_=_!==null?_.dehydrated:null,!_)throw Error(n(317));_[vi]=i}else vs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;mn(i),_=!1}else ri!==null&&(pu(ri),ri=null),_=!0;if(!_)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(t!==null&&t.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(t===null||(jt.current&1)!==0?Zt===0&&(Zt=3):_u())),i.updateQueue!==null&&(i.flags|=4),mn(i),null);case 4:return Ms(),iu(t,i),t===null&&va(i.stateNode.containerInfo),mn(i),null;case 10:return Nc(i.type._context),mn(i),null;case 17:return Tn(i.type)&&xo(),mn(i),null;case 19:if(Ot(jt),_=i.memoizedState,_===null)return mn(i),null;if(c=(i.flags&128)!==0,T=_.rendering,T===null)if(c)Pa(_,!1);else{if(Zt!==0||t!==null&&(t.flags&128)!==0)for(t=i.child;t!==null;){if(T=Po(t),T!==null){for(i.flags|=128,Pa(_,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)_=a,t=c,_.flags&=14680066,T=_.alternate,T===null?(_.childLanes=0,_.lanes=t,_.child=null,_.subtreeFlags=0,_.memoizedProps=null,_.memoizedState=null,_.updateQueue=null,_.dependencies=null,_.stateNode=null):(_.childLanes=T.childLanes,_.lanes=T.lanes,_.child=T.child,_.subtreeFlags=0,_.deletions=null,_.memoizedProps=T.memoizedProps,_.memoizedState=T.memoizedState,_.updateQueue=T.updateQueue,_.type=T.type,t=T.dependencies,_.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),a=a.sibling;return It(jt,jt.current&1|2),i.child}t=t.sibling}_.tail!==null&&Te()>As&&(i.flags|=128,c=!0,Pa(_,!1),i.lanes=4194304)}else{if(!c)if(t=Po(T),t!==null){if(i.flags|=128,c=!0,a=t.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Pa(_,!0),_.tail===null&&_.tailMode==="hidden"&&!T.alternate&&!Bt)return mn(i),null}else 2*Te()-_.renderingStartTime>As&&a!==1073741824&&(i.flags|=128,c=!0,Pa(_,!1),i.lanes=4194304);_.isBackwards?(T.sibling=i.child,i.child=T):(a=_.last,a!==null?a.sibling=T:i.child=T,_.last=T)}return _.tail!==null?(i=_.tail,_.rendering=i,_.tail=i.sibling,_.renderingStartTime=Te(),i.sibling=null,a=jt.current,It(jt,c?a&1|2:a&1),i):(mn(i),null);case 22:case 23:return gu(),c=i.memoizedState!==null,t!==null&&t.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Hn&1073741824)!==0&&(mn(i),i.subtreeFlags&6&&(i.flags|=8192)):mn(i),null;case 24:return null;case 25:return null}throw Error(n(156,i.tag))}function $_(t,i){switch(Tc(i),i.tag){case 1:return Tn(i.type)&&xo(),t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 3:return Ms(),Ot(wn),Ot(fn),kc(),t=i.flags,(t&65536)!==0&&(t&128)===0?(i.flags=t&-65537|128,i):null;case 5:return Fc(i),null;case 13:if(Ot(jt),t=i.memoizedState,t!==null&&t.dehydrated!==null){if(i.alternate===null)throw Error(n(340));vs()}return t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 19:return Ot(jt),null;case 4:return Ms(),null;case 10:return Nc(i.type._context),null;case 22:case 23:return gu(),null;case 24:return null;default:return null}}var zo=!1,gn=!1,K_=typeof WeakSet=="function"?WeakSet:Set,Be=null;function ws(t,i){var a=t.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Gt(t,i,c)}else a.current=null}function ru(t,i,a){try{a()}catch(c){Gt(t,i,c)}}var dp=!1;function Z_(t,i){if(gc=ro,t=jh(),lc(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{a.nodeType,_.nodeType}catch{a=null;break e}var T=0,I=-1,B=-1,re=0,_e=0,ye=t,ge=null;t:for(;;){for(var Ue;ye!==a||h!==0&&ye.nodeType!==3||(I=T+h),ye!==_||c!==0&&ye.nodeType!==3||(B=T+c),ye.nodeType===3&&(T+=ye.nodeValue.length),(Ue=ye.firstChild)!==null;)ge=ye,ye=Ue;for(;;){if(ye===t)break t;if(ge===a&&++re===h&&(I=T),ge===_&&++_e===c&&(B=T),(Ue=ye.nextSibling)!==null)break;ye=ge,ge=ye.parentNode}ye=Ue}a=I===-1||B===-1?null:{start:I,end:B}}else a=null}a=a||{start:0,end:0}}else a=null;for(_c={focusedElem:t,selectionRange:a},ro=!1,Be=i;Be!==null;)if(i=Be,t=i.child,(i.subtreeFlags&1028)!==0&&t!==null)t.return=i,Be=t;else for(;Be!==null;){i=Be;try{var He=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(He!==null){var Ve=He.memoizedProps,Xt=He.memoizedState,Z=i.stateNode,H=Z.getSnapshotBeforeUpdate(i.elementType===i.type?Ve:si(i.type,Ve),Xt);Z.__reactInternalSnapshotBeforeUpdate=H}break;case 3:var J=i.stateNode.containerInfo;J.nodeType===1?J.textContent="":J.nodeType===9&&J.documentElement&&J.removeChild(J.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(n(163))}}catch(Ee){Gt(i,i.return,Ee)}if(t=i.sibling,t!==null){t.return=i.return,Be=t;break}Be=i.return}return He=dp,dp=!1,He}function Na(t,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&t)===t){var _=h.destroy;h.destroy=void 0,_!==void 0&&ru(i,a,_)}h=h.next}while(h!==c)}}function Bo(t,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&t)===t){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function su(t){var i=t.ref;if(i!==null){var a=t.stateNode;switch(t.tag){case 5:t=a;break;default:t=a}typeof i=="function"?i(t):i.current=t}}function hp(t){var i=t.alternate;i!==null&&(t.alternate=null,hp(i)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(i=t.stateNode,i!==null&&(delete i[vi],delete i[ya],delete i[Sc],delete i[D_],delete i[I_])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function fp(t){return t.tag===5||t.tag===3||t.tag===4}function pp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||fp(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function au(t,i,a){var c=t.tag;if(c===5||c===6)t=t.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(t,i):a.insertBefore(t,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(t,a)):(i=a,i.appendChild(t)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=_o));else if(c!==4&&(t=t.child,t!==null))for(au(t,i,a),t=t.sibling;t!==null;)au(t,i,a),t=t.sibling}function ou(t,i,a){var c=t.tag;if(c===5||c===6)t=t.stateNode,i?a.insertBefore(t,i):a.appendChild(t);else if(c!==4&&(t=t.child,t!==null))for(ou(t,i,a),t=t.sibling;t!==null;)ou(t,i,a),t=t.sibling}var un=null,ai=!1;function ar(t,i,a){for(a=a.child;a!==null;)mp(t,i,a),a=a.sibling}function mp(t,i,a){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(Lt,a)}catch{}switch(a.tag){case 5:gn||ws(a,i);case 6:var c=un,h=ai;un=null,ar(t,i,a),un=c,ai=h,un!==null&&(ai?(t=un,a=a.stateNode,t.nodeType===8?t.parentNode.removeChild(a):t.removeChild(a)):un.removeChild(a.stateNode));break;case 18:un!==null&&(ai?(t=un,a=a.stateNode,t.nodeType===8?yc(t.parentNode,a):t.nodeType===1&&yc(t,a),ca(t)):yc(un,a.stateNode));break;case 4:c=un,h=ai,un=a.stateNode.containerInfo,ai=!0,ar(t,i,a),un=c,ai=h;break;case 0:case 11:case 14:case 15:if(!gn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var _=h,T=_.destroy;_=_.tag,T!==void 0&&((_&2)!==0||(_&4)!==0)&&ru(a,i,T),h=h.next}while(h!==c)}ar(t,i,a);break;case 1:if(!gn&&(ws(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(I){Gt(a,i,I)}ar(t,i,a);break;case 21:ar(t,i,a);break;case 22:a.mode&1?(gn=(c=gn)||a.memoizedState!==null,ar(t,i,a),gn=c):ar(t,i,a);break;default:ar(t,i,a)}}function gp(t){var i=t.updateQueue;if(i!==null){t.updateQueue=null;var a=t.stateNode;a===null&&(a=t.stateNode=new K_),i.forEach(function(c){var h=av.bind(null,t,c);a.has(c)||(a.add(c),c.then(h,h))})}}function oi(t,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var _=t,T=i,I=T;e:for(;I!==null;){switch(I.tag){case 5:un=I.stateNode,ai=!1;break e;case 3:un=I.stateNode.containerInfo,ai=!0;break e;case 4:un=I.stateNode.containerInfo,ai=!0;break e}I=I.return}if(un===null)throw Error(n(160));mp(_,T,h),un=null,ai=!1;var B=h.alternate;B!==null&&(B.return=null),h.return=null}catch(re){Gt(h,i,re)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)_p(i,t),i=i.sibling}function _p(t,i){var a=t.alternate,c=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(oi(i,t),Si(t),c&4){try{Na(3,t,t.return),Bo(3,t)}catch(Ve){Gt(t,t.return,Ve)}try{Na(5,t,t.return)}catch(Ve){Gt(t,t.return,Ve)}}break;case 1:oi(i,t),Si(t),c&512&&a!==null&&ws(a,a.return);break;case 5:if(oi(i,t),Si(t),c&512&&a!==null&&ws(a,a.return),t.flags&32){var h=t.stateNode;try{Me(h,"")}catch(Ve){Gt(t,t.return,Ve)}}if(c&4&&(h=t.stateNode,h!=null)){var _=t.memoizedProps,T=a!==null?a.memoizedProps:_,I=t.type,B=t.updateQueue;if(t.updateQueue=null,B!==null)try{I==="input"&&_.type==="radio"&&_.name!=null&&pt(h,_),Ct(I,T);var re=Ct(I,_);for(T=0;T<B.length;T+=2){var _e=B[T],ye=B[T+1];_e==="style"?ze(h,ye):_e==="dangerouslySetInnerHTML"?vt(h,ye):_e==="children"?Me(h,ye):b(h,_e,ye,re)}switch(I){case"input":Ze(h,_);break;case"textarea":ve(h,_);break;case"select":var ge=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!_.multiple;var Ue=_.value;Ue!=null?R(h,!!_.multiple,Ue,!1):ge!==!!_.multiple&&(_.defaultValue!=null?R(h,!!_.multiple,_.defaultValue,!0):R(h,!!_.multiple,_.multiple?[]:"",!1))}h[ya]=_}catch(Ve){Gt(t,t.return,Ve)}}break;case 6:if(oi(i,t),Si(t),c&4){if(t.stateNode===null)throw Error(n(162));h=t.stateNode,_=t.memoizedProps;try{h.nodeValue=_}catch(Ve){Gt(t,t.return,Ve)}}break;case 3:if(oi(i,t),Si(t),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ca(i.containerInfo)}catch(Ve){Gt(t,t.return,Ve)}break;case 4:oi(i,t),Si(t);break;case 13:oi(i,t),Si(t),h=t.child,h.flags&8192&&(_=h.memoizedState!==null,h.stateNode.isHidden=_,!_||h.alternate!==null&&h.alternate.memoizedState!==null||(uu=Te())),c&4&&gp(t);break;case 22:if(_e=a!==null&&a.memoizedState!==null,t.mode&1?(gn=(re=gn)||_e,oi(i,t),gn=re):oi(i,t),Si(t),c&8192){if(re=t.memoizedState!==null,(t.stateNode.isHidden=re)&&!_e&&(t.mode&1)!==0)for(Be=t,_e=t.child;_e!==null;){for(ye=Be=_e;Be!==null;){switch(ge=Be,Ue=ge.child,ge.tag){case 0:case 11:case 14:case 15:Na(4,ge,ge.return);break;case 1:ws(ge,ge.return);var He=ge.stateNode;if(typeof He.componentWillUnmount=="function"){c=ge,a=ge.return;try{i=c,He.props=i.memoizedProps,He.state=i.memoizedState,He.componentWillUnmount()}catch(Ve){Gt(c,a,Ve)}}break;case 5:ws(ge,ge.return);break;case 22:if(ge.memoizedState!==null){yp(ye);continue}}Ue!==null?(Ue.return=ge,Be=Ue):yp(ye)}_e=_e.sibling}e:for(_e=null,ye=t;;){if(ye.tag===5){if(_e===null){_e=ye;try{h=ye.stateNode,re?(_=h.style,typeof _.setProperty=="function"?_.setProperty("display","none","important"):_.display="none"):(I=ye.stateNode,B=ye.memoizedProps.style,T=B!=null&&B.hasOwnProperty("display")?B.display:null,I.style.display=rt("display",T))}catch(Ve){Gt(t,t.return,Ve)}}}else if(ye.tag===6){if(_e===null)try{ye.stateNode.nodeValue=re?"":ye.memoizedProps}catch(Ve){Gt(t,t.return,Ve)}}else if((ye.tag!==22&&ye.tag!==23||ye.memoizedState===null||ye===t)&&ye.child!==null){ye.child.return=ye,ye=ye.child;continue}if(ye===t)break e;for(;ye.sibling===null;){if(ye.return===null||ye.return===t)break e;_e===ye&&(_e=null),ye=ye.return}_e===ye&&(_e=null),ye.sibling.return=ye.return,ye=ye.sibling}}break;case 19:oi(i,t),Si(t),c&4&&gp(t);break;case 21:break;default:oi(i,t),Si(t)}}function Si(t){var i=t.flags;if(i&2){try{e:{for(var a=t.return;a!==null;){if(fp(a)){var c=a;break e}a=a.return}throw Error(n(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(Me(h,""),c.flags&=-33);var _=pp(t);ou(t,_,h);break;case 3:case 4:var T=c.stateNode.containerInfo,I=pp(t);au(t,I,T);break;default:throw Error(n(161))}}catch(B){Gt(t,t.return,B)}t.flags&=-3}i&4096&&(t.flags&=-4097)}function Q_(t,i,a){Be=t,vp(t)}function vp(t,i,a){for(var c=(t.mode&1)!==0;Be!==null;){var h=Be,_=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||zo;if(!T){var I=h.alternate,B=I!==null&&I.memoizedState!==null||gn;I=zo;var re=gn;if(zo=T,(gn=B)&&!re)for(Be=h;Be!==null;)T=Be,B=T.child,T.tag===22&&T.memoizedState!==null?Sp(h):B!==null?(B.return=T,Be=B):Sp(h);for(;_!==null;)Be=_,vp(_),_=_.sibling;Be=h,zo=I,gn=re}xp(t)}else(h.subtreeFlags&8772)!==0&&_!==null?(_.return=h,Be=_):xp(t)}}function xp(t){for(;Be!==null;){var i=Be;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:gn||Bo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!gn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:si(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var _=i.updateQueue;_!==null&&yf(i,_,c);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}yf(i,T,a)}break;case 5:var I=i.stateNode;if(a===null&&i.flags&4){a=I;var B=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":B.autoFocus&&a.focus();break;case"img":B.src&&(a.src=B.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var re=i.alternate;if(re!==null){var _e=re.memoizedState;if(_e!==null){var ye=_e.dehydrated;ye!==null&&ca(ye)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(n(163))}gn||i.flags&512&&su(i)}catch(ge){Gt(i,i.return,ge)}}if(i===t){Be=null;break}if(a=i.sibling,a!==null){a.return=i.return,Be=a;break}Be=i.return}}function yp(t){for(;Be!==null;){var i=Be;if(i===t){Be=null;break}var a=i.sibling;if(a!==null){a.return=i.return,Be=a;break}Be=i.return}}function Sp(t){for(;Be!==null;){var i=Be;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Bo(4,i)}catch(B){Gt(i,a,B)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(B){Gt(i,h,B)}}var _=i.return;try{su(i)}catch(B){Gt(i,_,B)}break;case 5:var T=i.return;try{su(i)}catch(B){Gt(i,T,B)}}}catch(B){Gt(i,i.return,B)}if(i===t){Be=null;break}var I=i.sibling;if(I!==null){I.return=i.return,Be=I;break}Be=i.return}}var J_=Math.ceil,Ho=N.ReactCurrentDispatcher,lu=N.ReactCurrentOwner,Kn=N.ReactCurrentBatchConfig,yt=0,sn=null,Yt=null,dn=0,Hn=0,Ts=tr(0),Zt=0,La=null,Ur=0,jo=0,cu=0,Da=null,Cn=null,uu=0,As=1/0,Ii=null,Vo=!1,du=null,or=null,Go=!1,lr=null,Wo=0,Ia=0,hu=null,Xo=-1,Yo=0;function yn(){return(yt&6)!==0?Te():Xo!==-1?Xo:Xo=Te()}function cr(t){return(t.mode&1)===0?1:(yt&2)!==0&&dn!==0?dn&-dn:F_.transition!==null?(Yo===0&&(Yo=ss()),Yo):(t=bt,t!==0||(t=window.event,t=t===void 0?16:Mh(t.type)),t)}function li(t,i,a,c){if(50<Ia)throw Ia=0,hu=null,Error(n(185));Yi(t,a,c),((yt&2)===0||t!==sn)&&(t===sn&&((yt&2)===0&&(jo|=a),Zt===4&&ur(t,dn)),Rn(t,c),a===1&&yt===0&&(i.mode&1)===0&&(As=Te()+500,So&&ir()))}function Rn(t,i){var a=t.callbackNode;ia(t,i);var c=Dt(t,t===sn?dn:0);if(c===0)a!==null&&W(a),t.callbackNode=null,t.callbackPriority=0;else if(i=c&-c,t.callbackPriority!==i){if(a!=null&&W(a),i===1)t.tag===0?U_(Ep.bind(null,t)):lf(Ep.bind(null,t)),N_(function(){(yt&6)===0&&ir()}),a=null;else{switch(ph(c)){case 1:a=nt;break;case 4:a=it;break;case 16:a=We;break;case 536870912:a=Pt;break;default:a=We}a=Np(a,Mp.bind(null,t))}t.callbackPriority=i,t.callbackNode=a}}function Mp(t,i){if(Xo=-1,Yo=0,(yt&6)!==0)throw Error(n(327));var a=t.callbackNode;if(Cs()&&t.callbackNode!==a)return null;var c=Dt(t,t===sn?dn:0);if(c===0)return null;if((c&30)!==0||(c&t.expiredLanes)!==0||i)i=qo(t,c);else{i=c;var h=yt;yt|=2;var _=Tp();(sn!==t||dn!==i)&&(Ii=null,As=Te()+500,Or(t,i));do try{nv();break}catch(I){wp(t,I)}while(!0);Pc(),Ho.current=_,yt=h,Yt!==null?i=0:(sn=null,dn=0,i=Zt)}if(i!==0){if(i===2&&(h=hn(t),h!==0&&(c=h,i=fu(t,h))),i===1)throw a=La,Or(t,0),ur(t,c),Rn(t,Te()),a;if(i===6)ur(t,c);else{if(h=t.current.alternate,(c&30)===0&&!ev(h)&&(i=qo(t,c),i===2&&(_=hn(t),_!==0&&(c=_,i=fu(t,_))),i===1))throw a=La,Or(t,0),ur(t,c),Rn(t,Te()),a;switch(t.finishedWork=h,t.finishedLanes=c,i){case 0:case 1:throw Error(n(345));case 2:kr(t,Cn,Ii);break;case 3:if(ur(t,c),(c&130023424)===c&&(i=uu+500-Te(),10<i)){if(Dt(t,0)!==0)break;if(h=t.suspendedLanes,(h&c)!==c){yn(),t.pingedLanes|=t.suspendedLanes&h;break}t.timeoutHandle=xc(kr.bind(null,t,Cn,Ii),i);break}kr(t,Cn,Ii);break;case 4:if(ur(t,c),(c&4194240)===c)break;for(i=t.eventTimes,h=-1;0<c;){var T=31-ke(c);_=1<<T,T=i[T],T>h&&(h=T),c&=~_}if(c=h,c=Te()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*J_(c/1960))-c,10<c){t.timeoutHandle=xc(kr.bind(null,t,Cn,Ii),c);break}kr(t,Cn,Ii);break;case 5:kr(t,Cn,Ii);break;default:throw Error(n(329))}}}return Rn(t,Te()),t.callbackNode===a?Mp.bind(null,t):null}function fu(t,i){var a=Da;return t.current.memoizedState.isDehydrated&&(Or(t,i).flags|=256),t=qo(t,i),t!==2&&(i=Cn,Cn=a,i!==null&&pu(i)),t}function pu(t){Cn===null?Cn=t:Cn.push.apply(Cn,t)}function ev(t){for(var i=t;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],_=h.getSnapshot;h=h.value;try{if(!ii(_(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function ur(t,i){for(i&=~cu,i&=~jo,t.suspendedLanes|=i,t.pingedLanes&=~i,t=t.expirationTimes;0<i;){var a=31-ke(i),c=1<<a;t[a]=-1,i&=~c}}function Ep(t){if((yt&6)!==0)throw Error(n(327));Cs();var i=Dt(t,0);if((i&1)===0)return Rn(t,Te()),null;var a=qo(t,i);if(t.tag!==0&&a===2){var c=hn(t);c!==0&&(i=c,a=fu(t,c))}if(a===1)throw a=La,Or(t,0),ur(t,i),Rn(t,Te()),a;if(a===6)throw Error(n(345));return t.finishedWork=t.current.alternate,t.finishedLanes=i,kr(t,Cn,Ii),Rn(t,Te()),null}function mu(t,i){var a=yt;yt|=1;try{return t(i)}finally{yt=a,yt===0&&(As=Te()+500,So&&ir())}}function Fr(t){lr!==null&&lr.tag===0&&(yt&6)===0&&Cs();var i=yt;yt|=1;var a=Kn.transition,c=bt;try{if(Kn.transition=null,bt=1,t)return t()}finally{bt=c,Kn.transition=a,yt=i,(yt&6)===0&&ir()}}function gu(){Hn=Ts.current,Ot(Ts)}function Or(t,i){t.finishedWork=null,t.finishedLanes=0;var a=t.timeoutHandle;if(a!==-1&&(t.timeoutHandle=-1,P_(a)),Yt!==null)for(a=Yt.return;a!==null;){var c=a;switch(Tc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&xo();break;case 3:Ms(),Ot(wn),Ot(fn),kc();break;case 5:Fc(c);break;case 4:Ms();break;case 13:Ot(jt);break;case 19:Ot(jt);break;case 10:Nc(c.type._context);break;case 22:case 23:gu()}a=a.return}if(sn=t,Yt=t=dr(t.current,null),dn=Hn=i,Zt=0,La=null,cu=jo=Ur=0,Cn=Da=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,_=a.pending;if(_!==null){var T=_.next;_.next=h,c.next=T}a.pending=c}Lr=null}return t}function wp(t,i){do{var a=Yt;try{if(Pc(),No.current=Uo,Lo){for(var c=Vt.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}Lo=!1}if(Ir=0,rn=Kt=Vt=null,Aa=!1,Ca=0,lu.current=null,a===null||a.return===null){Zt=1,La=i,Yt=null;break}e:{var _=t,T=a.return,I=a,B=i;if(i=dn,I.flags|=32768,B!==null&&typeof B=="object"&&typeof B.then=="function"){var re=B,_e=I,ye=_e.tag;if((_e.mode&1)===0&&(ye===0||ye===11||ye===15)){var ge=_e.alternate;ge?(_e.updateQueue=ge.updateQueue,_e.memoizedState=ge.memoizedState,_e.lanes=ge.lanes):(_e.updateQueue=null,_e.memoizedState=null)}var Ue=$f(T);if(Ue!==null){Ue.flags&=-257,Kf(Ue,T,I,_,i),Ue.mode&1&&qf(_,re,i),i=Ue,B=re;var He=i.updateQueue;if(He===null){var Ve=new Set;Ve.add(B),i.updateQueue=Ve}else He.add(B);break e}else{if((i&1)===0){qf(_,re,i),_u();break e}B=Error(n(426))}}else if(Bt&&I.mode&1){var Xt=$f(T);if(Xt!==null){(Xt.flags&65536)===0&&(Xt.flags|=256),Kf(Xt,T,I,_,i),Rc(Es(B,I));break e}}_=B=Es(B,I),Zt!==4&&(Zt=2),Da===null?Da=[_]:Da.push(_),_=T;do{switch(_.tag){case 3:_.flags|=65536,i&=-i,_.lanes|=i;var Z=Xf(_,B,i);xf(_,Z);break e;case 1:I=B;var H=_.type,J=_.stateNode;if((_.flags&128)===0&&(typeof H.getDerivedStateFromError=="function"||J!==null&&typeof J.componentDidCatch=="function"&&(or===null||!or.has(J)))){_.flags|=65536,i&=-i,_.lanes|=i;var Ee=Yf(_,I,i);xf(_,Ee);break e}}_=_.return}while(_!==null)}Cp(a)}catch(Xe){i=Xe,Yt===a&&a!==null&&(Yt=a=a.return);continue}break}while(!0)}function Tp(){var t=Ho.current;return Ho.current=Uo,t===null?Uo:t}function _u(){(Zt===0||Zt===3||Zt===2)&&(Zt=4),sn===null||(Ur&268435455)===0&&(jo&268435455)===0||ur(sn,dn)}function qo(t,i){var a=yt;yt|=2;var c=Tp();(sn!==t||dn!==i)&&(Ii=null,Or(t,i));do try{tv();break}catch(h){wp(t,h)}while(!0);if(Pc(),yt=a,Ho.current=c,Yt!==null)throw Error(n(261));return sn=null,dn=0,Zt}function tv(){for(;Yt!==null;)Ap(Yt)}function nv(){for(;Yt!==null&&!we();)Ap(Yt)}function Ap(t){var i=Pp(t.alternate,t,Hn);t.memoizedProps=t.pendingProps,i===null?Cp(t):Yt=i,lu.current=null}function Cp(t){var i=t;do{var a=i.alternate;if(t=i.return,(i.flags&32768)===0){if(a=q_(a,i,Hn),a!==null){Yt=a;return}}else{if(a=$_(a,i),a!==null){a.flags&=32767,Yt=a;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Zt=6,Yt=null;return}}if(i=i.sibling,i!==null){Yt=i;return}Yt=i=t}while(i!==null);Zt===0&&(Zt=5)}function kr(t,i,a){var c=bt,h=Kn.transition;try{Kn.transition=null,bt=1,iv(t,i,a,c)}finally{Kn.transition=h,bt=c}return null}function iv(t,i,a,c){do Cs();while(lr!==null);if((yt&6)!==0)throw Error(n(327));a=t.finishedWork;var h=t.finishedLanes;if(a===null)return null;if(t.finishedWork=null,t.finishedLanes=0,a===t.current)throw Error(n(177));t.callbackNode=null,t.callbackPriority=0;var _=a.lanes|a.childLanes;if(Og(t,_),t===sn&&(Yt=sn=null,dn=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Go||(Go=!0,Np(We,function(){return Cs(),null})),_=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||_){_=Kn.transition,Kn.transition=null;var T=bt;bt=1;var I=yt;yt|=4,lu.current=null,Z_(t,a),_p(a,t),E_(_c),ro=!!gc,_c=gc=null,t.current=a,Q_(a),De(),yt=I,bt=T,Kn.transition=_}else t.current=a;if(Go&&(Go=!1,lr=t,Wo=h),_=t.pendingLanes,_===0&&(or=null),St(a.stateNode),Rn(t,Te()),i!==null)for(c=t.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(Vo)throw Vo=!1,t=du,du=null,t;return(Wo&1)!==0&&t.tag!==0&&Cs(),_=t.pendingLanes,(_&1)!==0?t===hu?Ia++:(Ia=0,hu=t):Ia=0,ir(),null}function Cs(){if(lr!==null){var t=ph(Wo),i=Kn.transition,a=bt;try{if(Kn.transition=null,bt=16>t?16:t,lr===null)var c=!1;else{if(t=lr,lr=null,Wo=0,(yt&6)!==0)throw Error(n(331));var h=yt;for(yt|=4,Be=t.current;Be!==null;){var _=Be,T=_.child;if((Be.flags&16)!==0){var I=_.deletions;if(I!==null){for(var B=0;B<I.length;B++){var re=I[B];for(Be=re;Be!==null;){var _e=Be;switch(_e.tag){case 0:case 11:case 15:Na(8,_e,_)}var ye=_e.child;if(ye!==null)ye.return=_e,Be=ye;else for(;Be!==null;){_e=Be;var ge=_e.sibling,Ue=_e.return;if(hp(_e),_e===re){Be=null;break}if(ge!==null){ge.return=Ue,Be=ge;break}Be=Ue}}}var He=_.alternate;if(He!==null){var Ve=He.child;if(Ve!==null){He.child=null;do{var Xt=Ve.sibling;Ve.sibling=null,Ve=Xt}while(Ve!==null)}}Be=_}}if((_.subtreeFlags&2064)!==0&&T!==null)T.return=_,Be=T;else e:for(;Be!==null;){if(_=Be,(_.flags&2048)!==0)switch(_.tag){case 0:case 11:case 15:Na(9,_,_.return)}var Z=_.sibling;if(Z!==null){Z.return=_.return,Be=Z;break e}Be=_.return}}var H=t.current;for(Be=H;Be!==null;){T=Be;var J=T.child;if((T.subtreeFlags&2064)!==0&&J!==null)J.return=T,Be=J;else e:for(T=H;Be!==null;){if(I=Be,(I.flags&2048)!==0)try{switch(I.tag){case 0:case 11:case 15:Bo(9,I)}}catch(Xe){Gt(I,I.return,Xe)}if(I===T){Be=null;break e}var Ee=I.sibling;if(Ee!==null){Ee.return=I.return,Be=Ee;break e}Be=I.return}}if(yt=h,ir(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(Lt,t)}catch{}c=!0}return c}finally{bt=a,Kn.transition=i}}return!1}function Rp(t,i,a){i=Es(a,i),i=Xf(t,i,1),t=sr(t,i,1),i=yn(),t!==null&&(Yi(t,1,i),Rn(t,i))}function Gt(t,i,a){if(t.tag===3)Rp(t,t,a);else for(;i!==null;){if(i.tag===3){Rp(i,t,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(or===null||!or.has(c))){t=Es(a,t),t=Yf(i,t,1),i=sr(i,t,1),t=yn(),i!==null&&(Yi(i,1,t),Rn(i,t));break}}i=i.return}}function rv(t,i,a){var c=t.pingCache;c!==null&&c.delete(i),i=yn(),t.pingedLanes|=t.suspendedLanes&a,sn===t&&(dn&a)===a&&(Zt===4||Zt===3&&(dn&130023424)===dn&&500>Te()-uu?Or(t,0):cu|=a),Rn(t,i)}function bp(t,i){i===0&&((t.mode&1)===0?i=1:(i=nn,nn<<=1,(nn&130023424)===0&&(nn=4194304)));var a=yn();t=Ni(t,i),t!==null&&(Yi(t,i,a),Rn(t,a))}function sv(t){var i=t.memoizedState,a=0;i!==null&&(a=i.retryLane),bp(t,a)}function av(t,i){var a=0;switch(t.tag){case 13:var c=t.stateNode,h=t.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=t.stateNode;break;default:throw Error(n(314))}c!==null&&c.delete(i),bp(t,a)}var Pp;Pp=function(t,i,a){if(t!==null)if(t.memoizedProps!==i.pendingProps||wn.current)An=!0;else{if((t.lanes&a)===0&&(i.flags&128)===0)return An=!1,Y_(t,i,a);An=(t.flags&131072)!==0}else An=!1,Bt&&(i.flags&1048576)!==0&&cf(i,Eo,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;ko(t,i),t=i.pendingProps;var h=ms(i,fn.current);Ss(i,a),h=Hc(null,i,c,t,h,a);var _=jc();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Tn(c)?(_=!0,yo(i)):_=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,Ic(i),h.updater=Fo,i.stateNode=h,h._reactInternals=i,qc(i,c,t,a),i=Qc(null,i,c,!0,_,a)):(i.tag=0,Bt&&_&&wc(i),xn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(ko(t,i),t=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=lv(c),t=si(c,t),h){case 0:i=Zc(null,i,c,t,a);break e;case 1:i=np(null,i,c,t,a);break e;case 11:i=Zf(null,i,c,t,a);break e;case 14:i=Qf(null,i,c,si(c.type,t),a);break e}throw Error(n(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:si(c,h),Zc(t,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:si(c,h),np(t,i,c,h,a);case 3:e:{if(ip(i),t===null)throw Error(n(387));c=i.pendingProps,_=i.memoizedState,h=_.element,vf(t,i),bo(i,c,null,a);var T=i.memoizedState;if(c=T.element,_.isDehydrated)if(_={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=_,i.memoizedState=_,i.flags&256){h=Es(Error(n(423)),i),i=rp(t,i,c,a,h);break e}else if(c!==h){h=Es(Error(n(424)),i),i=rp(t,i,c,a,h);break e}else for(Bn=er(i.stateNode.containerInfo.firstChild),zn=i,Bt=!0,ri=null,a=gf(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(vs(),c===h){i=Di(t,i,a);break e}xn(t,i,c,a)}i=i.child}return i;case 5:return Sf(i),t===null&&Cc(i),c=i.type,h=i.pendingProps,_=t!==null?t.memoizedProps:null,T=h.children,vc(c,h)?T=null:_!==null&&vc(c,_)&&(i.flags|=32),tp(t,i),xn(t,i,T,a),i.child;case 6:return t===null&&Cc(i),null;case 13:return sp(t,i,a);case 4:return Uc(i,i.stateNode.containerInfo),c=i.pendingProps,t===null?i.child=xs(i,null,c,a):xn(t,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:si(c,h),Zf(t,i,c,h,a);case 7:return xn(t,i,i.pendingProps,a),i.child;case 8:return xn(t,i,i.pendingProps.children,a),i.child;case 12:return xn(t,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,_=i.memoizedProps,T=h.value,It(Ao,c._currentValue),c._currentValue=T,_!==null)if(ii(_.value,T)){if(_.children===h.children&&!wn.current){i=Di(t,i,a);break e}}else for(_=i.child,_!==null&&(_.return=i);_!==null;){var I=_.dependencies;if(I!==null){T=_.child;for(var B=I.firstContext;B!==null;){if(B.context===c){if(_.tag===1){B=Li(-1,a&-a),B.tag=2;var re=_.updateQueue;if(re!==null){re=re.shared;var _e=re.pending;_e===null?B.next=B:(B.next=_e.next,_e.next=B),re.pending=B}}_.lanes|=a,B=_.alternate,B!==null&&(B.lanes|=a),Lc(_.return,a,i),I.lanes|=a;break}B=B.next}}else if(_.tag===10)T=_.type===i.type?null:_.child;else if(_.tag===18){if(T=_.return,T===null)throw Error(n(341));T.lanes|=a,I=T.alternate,I!==null&&(I.lanes|=a),Lc(T,a,i),T=_.sibling}else T=_.child;if(T!==null)T.return=_;else for(T=_;T!==null;){if(T===i){T=null;break}if(_=T.sibling,_!==null){_.return=T.return,T=_;break}T=T.return}_=T}xn(t,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ss(i,a),h=qn(h),c=c(h),i.flags|=1,xn(t,i,c,a),i.child;case 14:return c=i.type,h=si(c,i.pendingProps),h=si(c.type,h),Qf(t,i,c,h,a);case 15:return Jf(t,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:si(c,h),ko(t,i),i.tag=1,Tn(c)?(t=!0,yo(i)):t=!1,Ss(i,a),Gf(i,c,h),qc(i,c,h,a),Qc(null,i,c,!0,t,a);case 19:return op(t,i,a);case 22:return ep(t,i,a)}throw Error(n(156,i.tag))};function Np(t,i){return ie(t,i)}function ov(t,i,a,c){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Zn(t,i,a,c){return new ov(t,i,a,c)}function vu(t){return t=t.prototype,!(!t||!t.isReactComponent)}function lv(t){if(typeof t=="function")return vu(t)?1:0;if(t!=null){if(t=t.$$typeof,t===V)return 11;if(t===K)return 14}return 2}function dr(t,i){var a=t.alternate;return a===null?(a=Zn(t.tag,i,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=i,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&14680064,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,i=t.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a}function $o(t,i,a,c,h,_){var T=2;if(c=t,typeof t=="function")vu(t)&&(T=1);else if(typeof t=="string")T=5;else e:switch(t){case U:return zr(a.children,h,_,i);case X:T=8,h|=8;break;case ae:return t=Zn(12,a,i,h|2),t.elementType=ae,t.lanes=_,t;case Y:return t=Zn(13,a,i,h),t.elementType=Y,t.lanes=_,t;case se:return t=Zn(19,a,i,h),t.elementType=se,t.lanes=_,t;case ue:return Ko(a,h,_,i);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case A:T=10;break e;case E:T=9;break e;case V:T=11;break e;case K:T=14;break e;case q:T=16,c=null;break e}throw Error(n(130,t==null?t:typeof t,""))}return i=Zn(T,a,i,h),i.elementType=t,i.type=c,i.lanes=_,i}function zr(t,i,a,c){return t=Zn(7,t,c,i),t.lanes=a,t}function Ko(t,i,a,c){return t=Zn(22,t,c,i),t.elementType=ue,t.lanes=a,t.stateNode={isHidden:!1},t}function xu(t,i,a){return t=Zn(6,t,null,i),t.lanes=a,t}function yu(t,i,a){return i=Zn(4,t.children!==null?t.children:[],t.key,i),i.lanes=a,i.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},i}function cv(t,i,a,c,h){this.tag=i,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ra(0),this.expirationTimes=ra(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ra(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Su(t,i,a,c,h,_,T,I,B){return t=new cv(t,i,a,I,B),i===1?(i=1,_===!0&&(i|=8)):i=0,_=Zn(3,null,null,i),t.current=_,_.stateNode=t,_.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ic(_),t}function uv(t,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:k,key:c==null?null:""+c,children:t,containerInfo:i,implementation:a}}function Lp(t){if(!t)return nr;t=t._reactInternals;e:{if(Ti(t)!==t||t.tag!==1)throw Error(n(170));var i=t;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Tn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(n(171))}if(t.tag===1){var a=t.type;if(Tn(a))return af(t,a,i)}return i}function Dp(t,i,a,c,h,_,T,I,B){return t=Su(a,c,!0,t,h,_,T,I,B),t.context=Lp(null),a=t.current,c=yn(),h=cr(a),_=Li(c,h),_.callback=i??null,sr(a,_,h),t.current.lanes=h,Yi(t,h,c),Rn(t,c),t}function Zo(t,i,a,c){var h=i.current,_=yn(),T=cr(h);return a=Lp(a),i.context===null?i.context=a:i.pendingContext=a,i=Li(_,T),i.payload={element:t},c=c===void 0?null:c,c!==null&&(i.callback=c),t=sr(h,i,T),t!==null&&(li(t,h,T,_),Ro(t,h,T)),T}function Qo(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Ip(t,i){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<i?a:i}}function Mu(t,i){Ip(t,i),(t=t.alternate)&&Ip(t,i)}function dv(){return null}var Up=typeof reportError=="function"?reportError:function(t){console.error(t)};function Eu(t){this._internalRoot=t}Jo.prototype.render=Eu.prototype.render=function(t){var i=this._internalRoot;if(i===null)throw Error(n(409));Zo(t,i,null,null)},Jo.prototype.unmount=Eu.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var i=t.containerInfo;Fr(function(){Zo(null,t,null,null)}),i[Ci]=null}};function Jo(t){this._internalRoot=t}Jo.prototype.unstable_scheduleHydration=function(t){if(t){var i=_h();t={blockedOn:null,target:t,priority:i};for(var a=0;a<Zi.length&&i!==0&&i<Zi[a].priority;a++);Zi.splice(a,0,t),a===0&&yh(t)}};function wu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function el(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Fp(){}function hv(t,i,a,c,h){if(h){if(typeof c=="function"){var _=c;c=function(){var re=Qo(T);_.call(re)}}var T=Dp(i,c,t,0,null,!1,!1,"",Fp);return t._reactRootContainer=T,t[Ci]=T.current,va(t.nodeType===8?t.parentNode:t),Fr(),T}for(;h=t.lastChild;)t.removeChild(h);if(typeof c=="function"){var I=c;c=function(){var re=Qo(B);I.call(re)}}var B=Su(t,0,!1,null,null,!1,!1,"",Fp);return t._reactRootContainer=B,t[Ci]=B.current,va(t.nodeType===8?t.parentNode:t),Fr(function(){Zo(i,B,a,c)}),B}function tl(t,i,a,c,h){var _=a._reactRootContainer;if(_){var T=_;if(typeof h=="function"){var I=h;h=function(){var B=Qo(T);I.call(B)}}Zo(i,T,t,h)}else T=hv(a,i,t,h,c);return Qo(T)}mh=function(t){switch(t.tag){case 3:var i=t.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ai(i.pendingLanes);a!==0&&(ql(i,a|1),Rn(i,Te()),(yt&6)===0&&(As=Te()+500,ir()))}break;case 13:Fr(function(){var c=Ni(t,1);if(c!==null){var h=yn();li(c,t,1,h)}}),Mu(t,1)}},$l=function(t){if(t.tag===13){var i=Ni(t,134217728);if(i!==null){var a=yn();li(i,t,134217728,a)}Mu(t,134217728)}},gh=function(t){if(t.tag===13){var i=cr(t),a=Ni(t,i);if(a!==null){var c=yn();li(a,t,i,c)}Mu(t,i)}},_h=function(){return bt},vh=function(t,i){var a=bt;try{return bt=t,i()}finally{bt=a}},ce=function(t,i,a){switch(i){case"input":if(Ze(t,a),i=a.name,a.type==="radio"&&i!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==t&&c.form===t.form){var h=vo(c);if(!h)throw Error(n(90));$e(c),Ze(c,h)}}}break;case"textarea":ve(t,a);break;case"select":i=a.value,i!=null&&R(t,!!a.multiple,i,!1)}},cn=mu,xt=Fr;var fv={usingClientEntryPoint:!1,Events:[Sa,fs,vo,_t,Ht,mu]},Ua={findFiberByHostInstance:Rr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},pv={bundleType:Ua.bundleType,version:Ua.version,rendererPackageName:Ua.rendererPackageName,rendererConfig:Ua.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:N.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=G(t),t===null?null:t.stateNode},findFiberByHostInstance:Ua.findFiberByHostInstance||dv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var nl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!nl.isDisabled&&nl.supportsFiber)try{Lt=nl.inject(pv),zt=nl}catch{}}return Pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fv,Pn.createPortal=function(t,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!wu(i))throw Error(n(200));return uv(t,i,null,a)},Pn.createRoot=function(t,i){if(!wu(t))throw Error(n(299));var a=!1,c="",h=Up;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Su(t,1,!1,null,null,a,!1,c,h),t[Ci]=i.current,va(t.nodeType===8?t.parentNode:t),new Eu(i)},Pn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var i=t._reactInternals;if(i===void 0)throw typeof t.render=="function"?Error(n(188)):(t=Object.keys(t).join(","),Error(n(268,t)));return t=G(i),t=t===null?null:t.stateNode,t},Pn.flushSync=function(t){return Fr(t)},Pn.hydrate=function(t,i,a){if(!el(i))throw Error(n(200));return tl(null,t,i,!0,a)},Pn.hydrateRoot=function(t,i,a){if(!wu(t))throw Error(n(405));var c=a!=null&&a.hydratedSources||null,h=!1,_="",T=Up;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(_=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=Dp(i,null,t,1,a??null,h,!1,_,T),t[Ci]=i.current,va(t),c)for(t=0;t<c.length;t++)a=c[t],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new Jo(i)},Pn.render=function(t,i,a){if(!el(i))throw Error(n(200));return tl(null,t,i,!1,a)},Pn.unmountComponentAtNode=function(t){if(!el(t))throw Error(n(40));return t._reactRootContainer?(Fr(function(){tl(null,null,t,!1,function(){t._reactRootContainer=null,t[Ci]=null})}),!0):!1},Pn.unstable_batchedUpdates=mu,Pn.unstable_renderSubtreeIntoContainer=function(t,i,a,c){if(!el(a))throw Error(n(200));if(t==null||t._reactInternals===void 0)throw Error(n(38));return tl(t,i,a,!1,c)},Pn.version="18.3.1-next-f1338f8080-20240426",Pn}var Gp;function Tv(){if(Gp)return Cu.exports;Gp=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Cu.exports=wv(),Cu.exports}var Wp;function Av(){if(Wp)return il;Wp=1;var r=Tv();return il.createRoot=r.createRoot,il.hydrateRoot=r.hydrateRoot,il}var Cv=Av();const Xp=r=>{let e;const n=new Set,s=(p,g)=>{const v=typeof p=="function"?p(e):p;if(!Object.is(v,e)){const y=e;e=g??(typeof v!="object"||v===null)?v:Object.assign({},e,v),n.forEach(M=>M(e,y))}},o=()=>e,u={setState:s,getState:o,getInitialState:()=>f,subscribe:p=>(n.add(p),()=>n.delete(p))},f=e=r(s,o,u);return u},Rv=(r=>r?Xp(r):Xp),bv=r=>r;function Pv(r,e=bv){const n=Ga.useSyncExternalStore(r.subscribe,Ga.useCallback(()=>e(r.getState()),[r,e]),Ga.useCallback(()=>e(r.getInitialState()),[r,e]));return Ga.useDebugValue(n),n}const Yp=r=>{const e=Rv(r),n=s=>Pv(e,s);return Object.assign(n,e),n},Nv=(r=>r?Yp(r):Yp);class Lv{constructor(){bn(this,"ws",null);bn(this,"host","127.0.0.1");bn(this,"connected",!1);bn(this,"rid",0);bn(this,"pending",new Map);bn(this,"stateSubs",new Set);bn(this,"eventSubs",new Set);bn(this,"connSubs",new Set);bn(this,"closing",!1);bn(this,"retryMs",800);bn(this,"token",null);bn(this,"role",null);bn(this,"user",null)}wsUrl(){return`ws://${this.host}:8765`}httpUrl(e){return`http://${this.host}:8080${e}`}connect(e){e&&(this.host=e,this.closing=!1,this.open())}disconnect(){var e;this.closing=!0,(e=this.ws)==null||e.close()}open(){var n;try{(n=this.ws)==null||n.close()}catch{}const e=new WebSocket(this.wsUrl());this.ws=e,e.onopen=()=>{this.connected=!0,this.retryMs=800,this.connSubs.forEach(s=>s(!0))},e.onclose=()=>{const s=this.connected;this.connected=!1,s&&this.connSubs.forEach(o=>o(!1)),this.pending.forEach(o=>o.res({type:"error",message:"connection lost"})),this.pending.clear(),this.closing||(setTimeout(()=>this.open(),this.retryMs),this.retryMs=Math.min(5e3,this.retryMs*1.6))},e.onerror=()=>e.close(),e.onmessage=s=>{let o;try{o=JSON.parse(s.data)}catch{return}if(o.rid&&this.pending.has(o.rid)){this.pending.get(o.rid).res(o),this.pending.delete(o.rid),o.type==="program"&&this.eventSubs.forEach(l=>l(o));return}o.type==="state"?this.stateSubs.forEach(l=>l(o)):(o.type==="program"||o.type==="probe")&&this.eventSubs.forEach(l=>l(o))}}cmd(e,n=15e3){return new Promise(s=>{if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return s({type:"error",message:"not connected"});const o=`s${++this.rid}`;this.pending.set(o,{res:s,t:Date.now()}),this.ws.send(JSON.stringify({...e,rid:o})),setTimeout(()=>{this.pending.has(o)&&(this.pending.delete(o),s({type:"error",message:"timeout"}))},n)})}fire(e){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(e))}onState(e){return this.stateSubs.add(e),()=>{this.stateSubs.delete(e)}}onEvent(e){return this.eventSubs.add(e),()=>{this.eventSubs.delete(e)}}onConn(e){return this.connSubs.add(e),()=>{this.connSubs.delete(e)}}async rest(e,n,s){const o=await fetch(this.httpUrl(n),{method:e,headers:{"Content-Type":"application/json",...this.token?{Authorization:`Bearer ${this.token}`}:{}},body:s===void 0?void 0:JSON.stringify(s)}),d=(o.headers.get("content-type")||"").includes("json")?await o.json():await o.blob();if(!o.ok)throw new Error(d&&d.error||`HTTP ${o.status}`);return d}async login(e,n){const s=await this.rest("POST","/api/v1/auth/login",{user:e,pin:n});return this.token=s.token,this.role=s.role,this.user=s.user,s}logout(){this.token&&this.rest("POST","/api/v1/auth/logout").catch(()=>{}),this.token=this.role=this.user=null}}const Qe=new Lv;let Dv=0;const ct=Nv(r=>({page:"move",theme:localStorage.getItem("erobo.theme")||"dark",host:localStorage.getItem("erobo.host")||window.location.hostname||"",connected:!1,state:null,progEvents:[],toasts:[],authRole:null,authUser:null,setPage:e=>r({page:e}),setTheme:e=>{localStorage.setItem("erobo.theme",e),document.documentElement.dataset.theme=e,r({theme:e})},setHost:e=>{localStorage.setItem("erobo.host",e),r({host:e})},toast:(e,n)=>{const s=++Dv;r(o=>({toasts:[...o.toasts.slice(-4),{id:s,kind:e,text:n}]})),setTimeout(()=>r(o=>({toasts:o.toasts.filter(l=>l.id!==s)})),5200)},dismissToast:e=>r(n=>({toasts:n.toasts.filter(s=>s.id!==e)})),setAuth:(e,n)=>r({authUser:e,authRole:n})})),Jd={s:null};function Iv(){document.documentElement.dataset.theme=ct.getState().theme,Qe.onState(e=>{Jd.s=e,ct.setState({state:e})}),Qe.onConn(e=>{ct.setState({connected:e}),ct.getState().toast(e?"ok":"warn",e?"Connected to robot":"Connection lost — reconnecting…")}),Qe.onEvent(e=>{ct.setState(n=>({progEvents:[...n.progEvents.slice(-199),e]})),e.event==="error"&&ct.getState().toast("err",`Program: ${e.message||"error"}`),e.event==="done"&&ct.getState().toast("ok","Program completed")});const r=ct.getState().host;r&&Qe.connect(r)}const Uv={IDLE:"ok",MOVING:"run",STOPPING:"warn",ESTOP:"err",DISABLED:"warn",HOLD:"warn",FREEDRIVE:"run"};function Fv({onLogin:r}){const e=ct(y=>y.state),n=ct(y=>y.connected),s=ct(y=>y.authUser),[o,l]=qe.useState(100),d=qe.useRef(!1);qe.useEffect(()=>{!d.current&&e&&l(e.speed_pct)},[e==null?void 0:e.speed_pct]);const u=(e==null?void 0:e.mode)??"OFFLINE",f=n?Uv[u]||"":"err",p=(e==null?void 0:e.safety.zone)??0,g=!!(e!=null&&e.enabled),v=y=>{l(y),Qe.cmd({cmd:"set_speed",frac:y/100})};return m.jsxs("header",{className:"hdr",children:[m.jsxs("div",{className:"brand",children:[m.jsx("div",{className:"logo",children:"eR"}),m.jsxs("div",{children:["eRoBo Studio ",m.jsx("small",{children:"· eRoBo 10"})]})]}),m.jsxs("span",{className:`chip ${f}`,children:[m.jsx("span",{className:"dot"}),n?u:"OFFLINE"]}),p===1&&m.jsxs("span",{className:"chip warn",children:[m.jsx("span",{className:"dot"}),"REDUCED ZONE"]}),(e==null?void 0:e.program.running)&&m.jsxs("span",{className:"chip run",children:[m.jsx("span",{className:"dot"}),"PROGRAM: ",e.program.name]}),m.jsx("div",{className:"grow"}),m.jsxs("div",{className:"speedbox",title:"Global speed override (applies live to all motion)",children:[m.jsx("span",{className:"dim small",children:"SPEED"}),m.jsx("input",{type:"range",min:5,max:100,value:o,style:{width:130},onMouseDown:()=>{d.current=!0},onMouseUp:()=>{d.current=!1},onTouchStart:()=>{d.current=!0},onTouchEnd:()=>{d.current=!1},onChange:y=>v(+y.target.value)}),m.jsxs("b",{children:[o,"%"]})]}),g?m.jsx("button",{className:"btn",onClick:()=>Qe.cmd({cmd:"disable"}),children:"Disable"}):m.jsx("button",{className:"btn good",onClick:()=>Qe.cmd({cmd:"enable"}),children:"Enable"}),m.jsx("button",{className:"btn",onClick:r,children:s?`${s}`:"Log in"}),m.jsx("button",{className:"estop",title:"Software emergency stop",onClick:()=>Qe.cmd({cmd:"estop"}),children:"STOP"})]})}const Ov=[{id:"move",label:"Move",d:"M12 2v6m0 8v6M2 12h6m8 0h6"},{id:"program",label:"Program",d:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"},{id:"io",label:"I/O",d:"M7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5M3 3h18v18H3z"},{id:"safety",label:"Safety",d:"M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"},{id:"tools",label:"Tools",d:"M14.7 6.3a4 4 0 105.6 5.6L22 10l-2-2-1.7 1.7-2-2L18 6l-2-2-1.3 2.3zM3 21l7.5-7.5"},{id:"diag",label:"Health",d:"M22 12h-4l-3 8-4-16-3 8H2"},{id:"logs",label:"Logs",d:"M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"},{id:"settings",label:"Setup",d:"M12 8a4 4 0 100 8 4 4 0 000-8zM19 12h3M2 12h3M12 2v3M12 19v3M17 7l2-2M5 19l2-2M17 17l2 2M5 5l2 2"}];function kv(){const r=ct(n=>n.page),e=ct(n=>n.setPage);return m.jsxs("nav",{className:"nav",children:[Ov.map(n=>m.jsxs("button",{className:r===n.id?"on":"",onClick:()=>e(n.id),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:m.jsx("path",{d:n.d})}),n.label]},n.id)),m.jsx("div",{className:"sep"})]})}function zv(){const r=ct(o=>o.state),e=ct(o=>o.connected),n=ct(o=>o.host),s=(r==null?void 0:r.tcp.pos)??[0,0,0];return m.jsxs("footer",{className:"statusbar",children:[m.jsx("span",{children:e?`● ${n}`:"○ disconnected"}),m.jsxs("span",{className:"mono",children:["TCP ",s.map(o=>(o*1e3).toFixed(1)).join(" / ")," mm"]}),m.jsxs("span",{className:"mono",children:["v ",(r?r.tcp_speed*1e3:0).toFixed(0)," mm/s"]}),m.jsxs("span",{className:"mono",children:["F ",((r==null?void 0:r.ext_force)??0).toFixed(0)," N"]}),m.jsx("span",{className:"grow"}),m.jsxs("span",{className:"mono",children:["jitter ",((r==null?void 0:r.jitter_us)??0).toFixed(0)," µs"]}),m.jsxs("span",{className:"mono",children:["overruns ",(r==null?void 0:r.overruns)??0]}),m.jsx("span",{children:"eRoBo Controller v2"})]})}function Bv(){const r=ct(n=>n.toasts),e=ct(n=>n.dismissToast);return m.jsx("div",{className:"toast-wrap",children:r.map(n=>m.jsx("div",{className:`toast ${n.kind}`,onClick:()=>e(n.id),children:n.text},n.id))})}function Hv({onClose:r}){const[e,n]=qe.useState("admin"),[s,o]=qe.useState(""),[l,d]=qe.useState(""),u=ct(v=>v.setAuth),f=ct(v=>v.toast),p=ct(v=>v.authUser),g=async()=>{try{const v=await Qe.login(e.trim(),s);u(v.user,v.role),f("ok",`Logged in as ${v.user} (${v.role})`),v.must_change&&f("warn","Default PIN in use — change it in Setup → Users."),r()}catch(v){d(v.message||"login failed")}};return m.jsx("div",{className:"modal-bg",onClick:r,children:m.jsxs("div",{className:"modal",onClick:v=>v.stopPropagation(),children:[m.jsx("div",{className:"mh",children:"Operator login"}),m.jsxs("div",{className:"mb",children:[p&&m.jsxs("p",{className:"muted small",style:{marginBottom:10},children:["Signed in as ",m.jsx("b",{children:p}),"."]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"User"}),m.jsx("input",{className:"in",value:e,onChange:v=>n(v.target.value)})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"PIN"}),m.jsx("input",{className:"in",type:"password",inputMode:"numeric",value:s,onChange:v=>o(v.target.value),onKeyDown:v=>v.key==="Enter"&&g()})]}),l&&m.jsx("p",{className:"small",style:{color:"var(--err)"},children:l})]}),m.jsxs("div",{className:"mf",children:[p&&m.jsx("button",{className:"btn",onClick:()=>{Qe.logout(),u(null,null),r()},children:"Log out"}),m.jsx("button",{className:"btn",onClick:r,children:"Cancel"}),m.jsx("button",{className:"btn primary",onClick:g,children:"Log in"})]})]})})}function jv(){const r=ct(g=>g.connected),e=ct(g=>g.host),n=ct(g=>g.setHost),[s,o]=qe.useState(e),[l,d]=qe.useState(!e),[u,f]=qe.useState(!1);if(qe.useEffect(()=>{if(r){d(!1),f(!1);return}if(!e){d(!0);return}const g=setTimeout(()=>d(!0),2500);return()=>clearTimeout(g)},[r,e]),!l||r)return null;const p=()=>{const g=s.trim();g&&(f(!0),n(g),Qe.connect(g))};return m.jsx("div",{className:"modal-bg",children:m.jsxs("div",{className:"modal",style:{width:430},children:[m.jsx("div",{className:"mh",children:"Connect to robot"}),m.jsxs("div",{className:"mb",children:[m.jsx("p",{className:"muted small",style:{marginBottom:12},children:"Enter the address of the PC running the eRoBo backend (the controller service on ports 8080 / 8765)."}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Robot address (IP or hostname)"}),m.jsx("input",{className:"in mono",autoFocus:!0,value:s,placeholder:"e.g. 192.168.1.50",onChange:g=>o(g.target.value),onKeyDown:g=>g.key==="Enter"&&p()})]}),u&&!r&&m.jsxs("p",{className:"small",style:{color:"var(--warn)"},children:["Trying ",s.trim(),"… check that the backend is running and ports 8080/8765 are open on its firewall."]}),!u&&e&&m.jsxs("p",{className:"small dim",children:["Last robot: ",e," — reconnecting automatically."]})]}),m.jsx("div",{className:"mf",children:m.jsx("button",{className:"btn primary",onClick:p,disabled:!s.trim(),children:"Connect"})})]})})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const eh="169",Gs={ROTATE:0,DOLLY:1,PAN:2},js={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Vv=0,qp=1,Gv=2,tg=1,Wv=2,Hi=3,Er=0,Dn=1,Ei=2,Sr=0,Ws=1,$p=2,Kp=3,Zp=4,Xv=5,qr=100,Yv=101,qv=102,$v=103,Kv=104,Zv=200,Qv=201,Jv=202,e0=203,dd=204,hd=205,t0=206,n0=207,i0=208,r0=209,s0=210,a0=211,o0=212,l0=213,c0=214,fd=0,pd=1,md=2,qs=3,gd=4,_d=5,vd=6,xd=7,ng=0,u0=1,d0=2,Mr=0,h0=1,f0=2,p0=3,m0=4,g0=5,_0=6,v0=7,ig=300,$s=301,Ks=302,yd=303,Sd=304,Vl=306,Md=1e3,Kr=1001,Ed=1002,ei=1003,x0=1004,rl=1005,fi=1006,Pu=1007,Zr=1008,Gi=1009,rg=1010,sg=1011,Xa=1012,th=1013,Jr=1014,ji=1015,Ya=1016,nh=1017,ih=1018,Zs=1020,ag=35902,og=1021,lg=1022,mi=1023,cg=1024,ug=1025,Xs=1026,Qs=1027,dg=1028,rh=1029,hg=1030,sh=1031,ah=1033,Rl=33776,bl=33777,Pl=33778,Nl=33779,wd=35840,Td=35841,Ad=35842,Cd=35843,Rd=36196,bd=37492,Pd=37496,Nd=37808,Ld=37809,Dd=37810,Id=37811,Ud=37812,Fd=37813,Od=37814,kd=37815,zd=37816,Bd=37817,Hd=37818,jd=37819,Vd=37820,Gd=37821,Ll=36492,Wd=36494,Xd=36495,fg=36283,Yd=36284,qd=36285,$d=36286,y0=3200,S0=3201,pg=0,M0=1,yr="",hi="srgb",Ar="srgb-linear",oh="display-p3",Gl="display-p3-linear",Fl="linear",kt="srgb",Ol="rec709",kl="p3",Rs=7680,Qp=519,E0=512,w0=513,T0=514,mg=515,A0=516,C0=517,R0=518,b0=519,Jp=35044,em="300 es",Vi=2e3,zl=2001;class ts{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(n)===-1&&s[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(n);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,d=o.length;l<d;l++)o[l].call(this,e);e.target=null}}}const _n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dl=Math.PI/180,Kd=180/Math.PI;function qa(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(_n[r&255]+_n[r>>8&255]+_n[r>>16&255]+_n[r>>24&255]+"-"+_n[e&255]+_n[e>>8&255]+"-"+_n[e>>16&15|64]+_n[e>>24&255]+"-"+_n[n&63|128]+_n[n>>8&255]+"-"+_n[n>>16&255]+_n[n>>24&255]+_n[s&255]+_n[s>>8&255]+_n[s>>16&255]+_n[s>>24&255]).toLowerCase()}function Mn(r,e,n){return Math.max(e,Math.min(n,r))}function P0(r,e){return(r%e+e)%e}function Nu(r,e,n){return(1-n)*r+n*e}function Oa(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Nn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const N0={DEG2RAD:Dl};class ut{constructor(e=0,n=0){ut.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,s=this.y,o=e.elements;return this.x=o[0]*n+o[3]*s+o[6],this.y=o[1]*n+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const s=this.dot(e)/n;return Math.acos(Mn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,s=this.y-e.y;return n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const s=Math.cos(n),o=Math.sin(n),l=this.x-e.x,d=this.y-e.y;return this.x=l*s-d*o+e.x,this.y=l*o+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ht{constructor(e,n,s,o,l,d,u,f,p){ht.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,s,o,l,d,u,f,p)}set(e,n,s,o,l,d,u,f,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=u,g[3]=n,g[4]=l,g[5]=f,g[6]=s,g[7]=d,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,s=e.elements;return n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=s[3],n[4]=s[4],n[5]=s[5],n[6]=s[6],n[7]=s[7],n[8]=s[8],this}extractBasis(e,n,s){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const s=e.elements,o=n.elements,l=this.elements,d=s[0],u=s[3],f=s[6],p=s[1],g=s[4],v=s[7],y=s[2],M=s[5],w=s[8],C=o[0],x=o[3],S=o[6],L=o[1],b=o[4],N=o[7],$=o[2],k=o[5],U=o[8];return l[0]=d*C+u*L+f*$,l[3]=d*x+u*b+f*k,l[6]=d*S+u*N+f*U,l[1]=p*C+g*L+v*$,l[4]=p*x+g*b+v*k,l[7]=p*S+g*N+v*U,l[2]=y*C+M*L+w*$,l[5]=y*x+M*b+w*k,l[8]=y*S+M*N+w*U,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],f=e[6],p=e[7],g=e[8];return n*d*g-n*u*p-s*l*g+s*u*f+o*l*p-o*d*f}invert(){const e=this.elements,n=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],f=e[6],p=e[7],g=e[8],v=g*d-u*p,y=u*f-g*l,M=p*l-d*f,w=n*v+s*y+o*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/w;return e[0]=v*C,e[1]=(o*p-g*s)*C,e[2]=(u*s-o*d)*C,e[3]=y*C,e[4]=(g*n-o*f)*C,e[5]=(o*l-u*n)*C,e[6]=M*C,e[7]=(s*f-p*n)*C,e[8]=(d*n-s*l)*C,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,s,o,l,d,u){const f=Math.cos(l),p=Math.sin(l);return this.set(s*f,s*p,-s*(f*d+p*u)+d+e,-o*p,o*f,-o*(-p*d+f*u)+u+n,0,0,1),this}scale(e,n){return this.premultiply(Lu.makeScale(e,n)),this}rotate(e){return this.premultiply(Lu.makeRotation(-e)),this}translate(e,n){return this.premultiply(Lu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,-s,0,s,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,s=e.elements;for(let o=0;o<9;o++)if(n[o]!==s[o])return!1;return!0}fromArray(e,n=0){for(let s=0;s<9;s++)this.elements[s]=e[s+n];return this}toArray(e=[],n=0){const s=this.elements;return e[n]=s[0],e[n+1]=s[1],e[n+2]=s[2],e[n+3]=s[3],e[n+4]=s[4],e[n+5]=s[5],e[n+6]=s[6],e[n+7]=s[7],e[n+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Lu=new ht;function gg(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Bl(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function L0(){const r=Bl("canvas");return r.style.display="block",r}const tm={};function Il(r){r in tm||(tm[r]=!0,console.warn(r))}function D0(r,e,n){return new Promise(function(s,o){function l(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:o();break;case r.TIMEOUT_EXPIRED:setTimeout(l,n);break;default:s()}}setTimeout(l,n)})}function I0(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function U0(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const nm=new ht().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),im=new ht().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ka={[Ar]:{transfer:Fl,primaries:Ol,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r,fromReference:r=>r},[hi]:{transfer:kt,primaries:Ol,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Gl]:{transfer:Fl,primaries:kl,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.applyMatrix3(im),fromReference:r=>r.applyMatrix3(nm)},[oh]:{transfer:kt,primaries:kl,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.convertSRGBToLinear().applyMatrix3(im),fromReference:r=>r.applyMatrix3(nm).convertLinearToSRGB()}},F0=new Set([Ar,Gl]),Rt={enabled:!0,_workingColorSpace:Ar,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!F0.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,n){if(this.enabled===!1||e===n||!e||!n)return r;const s=ka[e].toReference,o=ka[n].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return ka[r].primaries},getTransfer:function(r){return r===yr?Fl:ka[r].transfer},getLuminanceCoefficients:function(r,e=this._workingColorSpace){return r.fromArray(ka[e].luminanceCoefficients)}};function Ys(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Du(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let bs;class O0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{bs===void 0&&(bs=Bl("canvas")),bs.width=e.width,bs.height=e.height;const s=bs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=bs}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Bl("canvas");n.width=e.width,n.height=e.height;const s=n.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let d=0;d<l.length;d++)l[d]=Ys(l[d]/255)*255;return s.putImageData(o,0,0),n}else if(e.data){const n=e.data.slice(0);for(let s=0;s<n.length;s++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[s]=Math.floor(Ys(n[s]/255)*255):n[s]=Ys(n[s]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let k0=0;class _g{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=qa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let d=0,u=o.length;d<u;d++)o[d].isDataTexture?l.push(Iu(o[d].image)):l.push(Iu(o[d]))}else l=Iu(o);s.url=l}return n||(e.images[this.uuid]=s),s}}function Iu(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?O0.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let z0=0;class In extends ts{constructor(e=In.DEFAULT_IMAGE,n=In.DEFAULT_MAPPING,s=Kr,o=Kr,l=fi,d=Zr,u=mi,f=Gi,p=In.DEFAULT_ANISOTROPY,g=yr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:z0++}),this.uuid=qa(),this.name="",this.source=new _g(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=d,this.anisotropy=p,this.format=u,this.internalFormat=null,this.type=f,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),n||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ig)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Md:e.x=e.x-Math.floor(e.x);break;case Kr:e.x=e.x<0?0:1;break;case Ed:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Md:e.y=e.y-Math.floor(e.y);break;case Kr:e.y=e.y<0?0:1;break;case Ed:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}In.DEFAULT_IMAGE=null;In.DEFAULT_MAPPING=ig;In.DEFAULT_ANISOTROPY=1;class Wt{constructor(e=0,n=0,s=0,o=1){Wt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,s,o){return this.x=e,this.y=n,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,s=this.y,o=this.z,l=this.w,d=e.elements;return this.x=d[0]*n+d[4]*s+d[8]*o+d[12]*l,this.y=d[1]*n+d[5]*s+d[9]*o+d[13]*l,this.z=d[2]*n+d[6]*s+d[10]*o+d[14]*l,this.w=d[3]*n+d[7]*s+d[11]*o+d[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,s,o,l;const f=e.elements,p=f[0],g=f[4],v=f[8],y=f[1],M=f[5],w=f[9],C=f[2],x=f[6],S=f[10];if(Math.abs(g-y)<.01&&Math.abs(v-C)<.01&&Math.abs(w-x)<.01){if(Math.abs(g+y)<.1&&Math.abs(v+C)<.1&&Math.abs(w+x)<.1&&Math.abs(p+M+S-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const b=(p+1)/2,N=(M+1)/2,$=(S+1)/2,k=(g+y)/4,U=(v+C)/4,X=(w+x)/4;return b>N&&b>$?b<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(b),o=k/s,l=U/s):N>$?N<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(N),s=k/o,l=X/o):$<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt($),s=U/l,o=X/l),this.set(s,o,l,n),this}let L=Math.sqrt((x-w)*(x-w)+(v-C)*(v-C)+(y-g)*(y-g));return Math.abs(L)<.001&&(L=1),this.x=(x-w)/L,this.y=(v-C)/L,this.z=(y-g)/L,this.w=Math.acos((p+M+S-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this.z=e.z+(n.z-e.z)*s,this.w=e.w+(n.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class B0 extends ts{constructor(e=1,n=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Wt(0,0,e,n),this.scissorTest=!1,this.viewport=new Wt(0,0,e,n);const o={width:e,height:n,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new In(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const d=s.count;for(let u=0;u<d;u++)this.textures[u]=l.clone(),this.textures[u].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,s=1){if(this.width!==e||this.height!==n||this.depth!==s){this.width=e,this.height=n,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=n,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new _g(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class es extends B0{constructor(e=1,n=1,s={}){super(e,n,s),this.isWebGLRenderTarget=!0}}class vg extends In{constructor(e=null,n=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:s,depth:o},this.magFilter=ei,this.minFilter=ei,this.wrapR=Kr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class H0 extends In{constructor(e=null,n=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:s,depth:o},this.magFilter=ei,this.minFilter=ei,this.wrapR=Kr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wr{constructor(e=0,n=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=s,this._w=o}static slerpFlat(e,n,s,o,l,d,u){let f=s[o+0],p=s[o+1],g=s[o+2],v=s[o+3];const y=l[d+0],M=l[d+1],w=l[d+2],C=l[d+3];if(u===0){e[n+0]=f,e[n+1]=p,e[n+2]=g,e[n+3]=v;return}if(u===1){e[n+0]=y,e[n+1]=M,e[n+2]=w,e[n+3]=C;return}if(v!==C||f!==y||p!==M||g!==w){let x=1-u;const S=f*y+p*M+g*w+v*C,L=S>=0?1:-1,b=1-S*S;if(b>Number.EPSILON){const $=Math.sqrt(b),k=Math.atan2($,S*L);x=Math.sin(x*k)/$,u=Math.sin(u*k)/$}const N=u*L;if(f=f*x+y*N,p=p*x+M*N,g=g*x+w*N,v=v*x+C*N,x===1-u){const $=1/Math.sqrt(f*f+p*p+g*g+v*v);f*=$,p*=$,g*=$,v*=$}}e[n]=f,e[n+1]=p,e[n+2]=g,e[n+3]=v}static multiplyQuaternionsFlat(e,n,s,o,l,d){const u=s[o],f=s[o+1],p=s[o+2],g=s[o+3],v=l[d],y=l[d+1],M=l[d+2],w=l[d+3];return e[n]=u*w+g*v+f*M-p*y,e[n+1]=f*w+g*y+p*v-u*M,e[n+2]=p*w+g*M+u*y-f*v,e[n+3]=g*w-u*v-f*y-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,s,o){return this._x=e,this._y=n,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const s=e._x,o=e._y,l=e._z,d=e._order,u=Math.cos,f=Math.sin,p=u(s/2),g=u(o/2),v=u(l/2),y=f(s/2),M=f(o/2),w=f(l/2);switch(d){case"XYZ":this._x=y*g*v+p*M*w,this._y=p*M*v-y*g*w,this._z=p*g*w+y*M*v,this._w=p*g*v-y*M*w;break;case"YXZ":this._x=y*g*v+p*M*w,this._y=p*M*v-y*g*w,this._z=p*g*w-y*M*v,this._w=p*g*v+y*M*w;break;case"ZXY":this._x=y*g*v-p*M*w,this._y=p*M*v+y*g*w,this._z=p*g*w+y*M*v,this._w=p*g*v-y*M*w;break;case"ZYX":this._x=y*g*v-p*M*w,this._y=p*M*v+y*g*w,this._z=p*g*w-y*M*v,this._w=p*g*v+y*M*w;break;case"YZX":this._x=y*g*v+p*M*w,this._y=p*M*v+y*g*w,this._z=p*g*w-y*M*v,this._w=p*g*v-y*M*w;break;case"XZY":this._x=y*g*v-p*M*w,this._y=p*M*v-y*g*w,this._z=p*g*w+y*M*v,this._w=p*g*v+y*M*w;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const s=n/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,s=n[0],o=n[4],l=n[8],d=n[1],u=n[5],f=n[9],p=n[2],g=n[6],v=n[10],y=s+u+v;if(y>0){const M=.5/Math.sqrt(y+1);this._w=.25/M,this._x=(g-f)*M,this._y=(l-p)*M,this._z=(d-o)*M}else if(s>u&&s>v){const M=2*Math.sqrt(1+s-u-v);this._w=(g-f)/M,this._x=.25*M,this._y=(o+d)/M,this._z=(l+p)/M}else if(u>v){const M=2*Math.sqrt(1+u-s-v);this._w=(l-p)/M,this._x=(o+d)/M,this._y=.25*M,this._z=(f+g)/M}else{const M=2*Math.sqrt(1+v-s-u);this._w=(d-o)/M,this._x=(l+p)/M,this._y=(f+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let s=e.dot(n)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Mn(this.dot(e),-1,1)))}rotateTowards(e,n){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,n/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const s=e._x,o=e._y,l=e._z,d=e._w,u=n._x,f=n._y,p=n._z,g=n._w;return this._x=s*g+d*u+o*p-l*f,this._y=o*g+d*f+l*u-s*p,this._z=l*g+d*p+s*f-o*u,this._w=d*g-s*u-o*f-l*p,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,d=this._w;let u=d*e._w+s*e._x+o*e._y+l*e._z;if(u<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,u=-u):this.copy(e),u>=1)return this._w=d,this._x=s,this._y=o,this._z=l,this;const f=1-u*u;if(f<=Number.EPSILON){const M=1-n;return this._w=M*d+n*this._w,this._x=M*s+n*this._x,this._y=M*o+n*this._y,this._z=M*l+n*this._z,this.normalize(),this}const p=Math.sqrt(f),g=Math.atan2(p,u),v=Math.sin((1-n)*g)/p,y=Math.sin(n*g)/p;return this._w=d*v+this._w*y,this._x=s*v+this._x*y,this._y=o*v+this._y*y,this._z=l*v+this._z*y,this._onChangeCallback(),this}slerpQuaternions(e,n,s){return this.copy(e).slerp(n,s)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(n),l*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Q{constructor(e=0,n=0,s=0){Q.prototype.isVector3=!0,this.x=e,this.y=n,this.z=s}set(e,n,s){return s===void 0&&(s=this.z),this.x=e,this.y=n,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(rm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(rm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*n+l[3]*s+l[6]*o,this.y=l[1]*n+l[4]*s+l[7]*o,this.z=l[2]*n+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,s=this.y,o=this.z,l=e.elements,d=1/(l[3]*n+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*n+l[4]*s+l[8]*o+l[12])*d,this.y=(l[1]*n+l[5]*s+l[9]*o+l[13])*d,this.z=(l[2]*n+l[6]*s+l[10]*o+l[14])*d,this}applyQuaternion(e){const n=this.x,s=this.y,o=this.z,l=e.x,d=e.y,u=e.z,f=e.w,p=2*(d*o-u*s),g=2*(u*n-l*o),v=2*(l*s-d*n);return this.x=n+f*p+d*v-u*g,this.y=s+f*g+u*p-l*v,this.z=o+f*v+l*g-d*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*n+l[4]*s+l[8]*o,this.y=l[1]*n+l[5]*s+l[9]*o,this.z=l[2]*n+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this.z=e.z+(n.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const s=e.x,o=e.y,l=e.z,d=n.x,u=n.y,f=n.z;return this.x=o*f-l*u,this.y=l*d-s*f,this.z=s*u-o*d,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const s=e.dot(this)/n;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return Uu.copy(this).projectOnVector(e),this.sub(Uu)}reflect(e){return this.sub(Uu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const s=this.dot(e)/n;return Math.acos(Mn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return n*n+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,s){const o=Math.sin(n)*e;return this.x=o*Math.sin(s),this.y=Math.cos(n)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,s){return this.x=e*Math.sin(n),this.y=s,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=s,this.z=o,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,s=Math.sqrt(1-n*n);return this.x=s*Math.cos(e),this.y=n,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Uu=new Q,rm=new wr;class $a{constructor(e=new Q(1/0,1/0,1/0),n=new Q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,s=e.length;n<s;n+=3)this.expandByPoint(ci.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,s=e.count;n<s;n++)this.expandByPoint(ci.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,s=e.length;n<s;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const s=ci.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(n===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let d=0,u=l.count;d<u;d++)e.isMesh===!0?e.getVertexPosition(d,ci):ci.fromBufferAttribute(l,d),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),sl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),sl.copy(s.boundingBox)),sl.applyMatrix4(e.matrixWorld),this.union(sl)}const o=e.children;for(let l=0,d=o.length;l<d;l++)this.expandByObject(o[l],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,s;return e.normal.x>0?(n=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),n<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(za),al.subVectors(this.max,za),Ps.subVectors(e.a,za),Ns.subVectors(e.b,za),Ls.subVectors(e.c,za),fr.subVectors(Ns,Ps),pr.subVectors(Ls,Ns),Br.subVectors(Ps,Ls);let n=[0,-fr.z,fr.y,0,-pr.z,pr.y,0,-Br.z,Br.y,fr.z,0,-fr.x,pr.z,0,-pr.x,Br.z,0,-Br.x,-fr.y,fr.x,0,-pr.y,pr.x,0,-Br.y,Br.x,0];return!Fu(n,Ps,Ns,Ls,al)||(n=[1,0,0,0,1,0,0,0,1],!Fu(n,Ps,Ns,Ls,al))?!1:(ol.crossVectors(fr,pr),n=[ol.x,ol.y,ol.z],Fu(n,Ps,Ns,Ls,al))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ui=[new Q,new Q,new Q,new Q,new Q,new Q,new Q,new Q],ci=new Q,sl=new $a,Ps=new Q,Ns=new Q,Ls=new Q,fr=new Q,pr=new Q,Br=new Q,za=new Q,al=new Q,ol=new Q,Hr=new Q;function Fu(r,e,n,s,o){for(let l=0,d=r.length-3;l<=d;l+=3){Hr.fromArray(r,l);const u=o.x*Math.abs(Hr.x)+o.y*Math.abs(Hr.y)+o.z*Math.abs(Hr.z),f=e.dot(Hr),p=n.dot(Hr),g=s.dot(Hr);if(Math.max(-Math.max(f,p,g),Math.min(f,p,g))>u)return!1}return!0}const j0=new $a,Ba=new Q,Ou=new Q;class Wl{constructor(e=new Q,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const s=this.center;n!==void 0?s.copy(n):j0.setFromPoints(e).getCenter(s);let o=0;for(let l=0,d=e.length;l<d;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const s=this.center.distanceToSquared(e);return n.copy(e),s>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ba.subVectors(e,this.center);const n=Ba.lengthSq();if(n>this.radius*this.radius){const s=Math.sqrt(n),o=(s-this.radius)*.5;this.center.addScaledVector(Ba,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ou.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ba.copy(e.center).add(Ou)),this.expandByPoint(Ba.copy(e.center).sub(Ou))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Fi=new Q,ku=new Q,ll=new Q,mr=new Q,zu=new Q,cl=new Q,Bu=new Q;class lh{constructor(e=new Q,n=new Q(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const s=n.dot(this.direction);return s<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Fi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Fi.copy(this.origin).addScaledVector(this.direction,n),Fi.distanceToSquared(e))}distanceSqToSegment(e,n,s,o){ku.copy(e).add(n).multiplyScalar(.5),ll.copy(n).sub(e).normalize(),mr.copy(this.origin).sub(ku);const l=e.distanceTo(n)*.5,d=-this.direction.dot(ll),u=mr.dot(this.direction),f=-mr.dot(ll),p=mr.lengthSq(),g=Math.abs(1-d*d);let v,y,M,w;if(g>0)if(v=d*f-u,y=d*u-f,w=l*g,v>=0)if(y>=-w)if(y<=w){const C=1/g;v*=C,y*=C,M=v*(v+d*y+2*u)+y*(d*v+y+2*f)+p}else y=l,v=Math.max(0,-(d*y+u)),M=-v*v+y*(y+2*f)+p;else y=-l,v=Math.max(0,-(d*y+u)),M=-v*v+y*(y+2*f)+p;else y<=-w?(v=Math.max(0,-(-d*l+u)),y=v>0?-l:Math.min(Math.max(-l,-f),l),M=-v*v+y*(y+2*f)+p):y<=w?(v=0,y=Math.min(Math.max(-l,-f),l),M=y*(y+2*f)+p):(v=Math.max(0,-(d*l+u)),y=v>0?l:Math.min(Math.max(-l,-f),l),M=-v*v+y*(y+2*f)+p);else y=d>0?-l:l,v=Math.max(0,-(d*y+u)),M=-v*v+y*(y+2*f)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,v),o&&o.copy(ku).addScaledVector(ll,y),M}intersectSphere(e,n){Fi.subVectors(e.center,this.origin);const s=Fi.dot(this.direction),o=Fi.dot(Fi)-s*s,l=e.radius*e.radius;if(o>l)return null;const d=Math.sqrt(l-o),u=s-d,f=s+d;return f<0?null:u<0?this.at(f,n):this.at(u,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/n;return s>=0?s:null}intersectPlane(e,n){const s=this.distanceToPlane(e);return s===null?null:this.at(s,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let s,o,l,d,u,f;const p=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,y=this.origin;return p>=0?(s=(e.min.x-y.x)*p,o=(e.max.x-y.x)*p):(s=(e.max.x-y.x)*p,o=(e.min.x-y.x)*p),g>=0?(l=(e.min.y-y.y)*g,d=(e.max.y-y.y)*g):(l=(e.max.y-y.y)*g,d=(e.min.y-y.y)*g),s>d||l>o||((l>s||isNaN(s))&&(s=l),(d<o||isNaN(o))&&(o=d),v>=0?(u=(e.min.z-y.z)*v,f=(e.max.z-y.z)*v):(u=(e.max.z-y.z)*v,f=(e.min.z-y.z)*v),s>f||u>o)||((u>s||s!==s)&&(s=u),(f<o||o!==o)&&(o=f),o<0)?null:this.at(s>=0?s:o,n)}intersectsBox(e){return this.intersectBox(e,Fi)!==null}intersectTriangle(e,n,s,o,l){zu.subVectors(n,e),cl.subVectors(s,e),Bu.crossVectors(zu,cl);let d=this.direction.dot(Bu),u;if(d>0){if(o)return null;u=1}else if(d<0)u=-1,d=-d;else return null;mr.subVectors(this.origin,e);const f=u*this.direction.dot(cl.crossVectors(mr,cl));if(f<0)return null;const p=u*this.direction.dot(zu.cross(mr));if(p<0||f+p>d)return null;const g=-u*mr.dot(Bu);return g<0?null:this.at(g/d,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ut{constructor(e,n,s,o,l,d,u,f,p,g,v,y,M,w,C,x){Ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,s,o,l,d,u,f,p,g,v,y,M,w,C,x)}set(e,n,s,o,l,d,u,f,p,g,v,y,M,w,C,x){const S=this.elements;return S[0]=e,S[4]=n,S[8]=s,S[12]=o,S[1]=l,S[5]=d,S[9]=u,S[13]=f,S[2]=p,S[6]=g,S[10]=v,S[14]=y,S[3]=M,S[7]=w,S[11]=C,S[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ut().fromArray(this.elements)}copy(e){const n=this.elements,s=e.elements;return n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=s[3],n[4]=s[4],n[5]=s[5],n[6]=s[6],n[7]=s[7],n[8]=s[8],n[9]=s[9],n[10]=s[10],n[11]=s[11],n[12]=s[12],n[13]=s[13],n[14]=s[14],n[15]=s[15],this}copyPosition(e){const n=this.elements,s=e.elements;return n[12]=s[12],n[13]=s[13],n[14]=s[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,s){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,n,s){return this.set(e.x,n.x,s.x,0,e.y,n.y,s.y,0,e.z,n.z,s.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,s=e.elements,o=1/Ds.setFromMatrixColumn(e,0).length(),l=1/Ds.setFromMatrixColumn(e,1).length(),d=1/Ds.setFromMatrixColumn(e,2).length();return n[0]=s[0]*o,n[1]=s[1]*o,n[2]=s[2]*o,n[3]=0,n[4]=s[4]*l,n[5]=s[5]*l,n[6]=s[6]*l,n[7]=0,n[8]=s[8]*d,n[9]=s[9]*d,n[10]=s[10]*d,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,s=e.x,o=e.y,l=e.z,d=Math.cos(s),u=Math.sin(s),f=Math.cos(o),p=Math.sin(o),g=Math.cos(l),v=Math.sin(l);if(e.order==="XYZ"){const y=d*g,M=d*v,w=u*g,C=u*v;n[0]=f*g,n[4]=-f*v,n[8]=p,n[1]=M+w*p,n[5]=y-C*p,n[9]=-u*f,n[2]=C-y*p,n[6]=w+M*p,n[10]=d*f}else if(e.order==="YXZ"){const y=f*g,M=f*v,w=p*g,C=p*v;n[0]=y+C*u,n[4]=w*u-M,n[8]=d*p,n[1]=d*v,n[5]=d*g,n[9]=-u,n[2]=M*u-w,n[6]=C+y*u,n[10]=d*f}else if(e.order==="ZXY"){const y=f*g,M=f*v,w=p*g,C=p*v;n[0]=y-C*u,n[4]=-d*v,n[8]=w+M*u,n[1]=M+w*u,n[5]=d*g,n[9]=C-y*u,n[2]=-d*p,n[6]=u,n[10]=d*f}else if(e.order==="ZYX"){const y=d*g,M=d*v,w=u*g,C=u*v;n[0]=f*g,n[4]=w*p-M,n[8]=y*p+C,n[1]=f*v,n[5]=C*p+y,n[9]=M*p-w,n[2]=-p,n[6]=u*f,n[10]=d*f}else if(e.order==="YZX"){const y=d*f,M=d*p,w=u*f,C=u*p;n[0]=f*g,n[4]=C-y*v,n[8]=w*v+M,n[1]=v,n[5]=d*g,n[9]=-u*g,n[2]=-p*g,n[6]=M*v+w,n[10]=y-C*v}else if(e.order==="XZY"){const y=d*f,M=d*p,w=u*f,C=u*p;n[0]=f*g,n[4]=-v,n[8]=p*g,n[1]=y*v+C,n[5]=d*g,n[9]=M*v-w,n[2]=w*v-M,n[6]=u*g,n[10]=C*v+y}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(V0,e,G0)}lookAt(e,n,s){const o=this.elements;return jn.subVectors(e,n),jn.lengthSq()===0&&(jn.z=1),jn.normalize(),gr.crossVectors(s,jn),gr.lengthSq()===0&&(Math.abs(s.z)===1?jn.x+=1e-4:jn.z+=1e-4,jn.normalize(),gr.crossVectors(s,jn)),gr.normalize(),ul.crossVectors(jn,gr),o[0]=gr.x,o[4]=ul.x,o[8]=jn.x,o[1]=gr.y,o[5]=ul.y,o[9]=jn.y,o[2]=gr.z,o[6]=ul.z,o[10]=jn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const s=e.elements,o=n.elements,l=this.elements,d=s[0],u=s[4],f=s[8],p=s[12],g=s[1],v=s[5],y=s[9],M=s[13],w=s[2],C=s[6],x=s[10],S=s[14],L=s[3],b=s[7],N=s[11],$=s[15],k=o[0],U=o[4],X=o[8],ae=o[12],A=o[1],E=o[5],V=o[9],Y=o[13],se=o[2],K=o[6],q=o[10],ue=o[14],z=o[3],he=o[7],le=o[11],F=o[15];return l[0]=d*k+u*A+f*se+p*z,l[4]=d*U+u*E+f*K+p*he,l[8]=d*X+u*V+f*q+p*le,l[12]=d*ae+u*Y+f*ue+p*F,l[1]=g*k+v*A+y*se+M*z,l[5]=g*U+v*E+y*K+M*he,l[9]=g*X+v*V+y*q+M*le,l[13]=g*ae+v*Y+y*ue+M*F,l[2]=w*k+C*A+x*se+S*z,l[6]=w*U+C*E+x*K+S*he,l[10]=w*X+C*V+x*q+S*le,l[14]=w*ae+C*Y+x*ue+S*F,l[3]=L*k+b*A+N*se+$*z,l[7]=L*U+b*E+N*K+$*he,l[11]=L*X+b*V+N*q+$*le,l[15]=L*ae+b*Y+N*ue+$*F,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],s=e[4],o=e[8],l=e[12],d=e[1],u=e[5],f=e[9],p=e[13],g=e[2],v=e[6],y=e[10],M=e[14],w=e[3],C=e[7],x=e[11],S=e[15];return w*(+l*f*v-o*p*v-l*u*y+s*p*y+o*u*M-s*f*M)+C*(+n*f*M-n*p*y+l*d*y-o*d*M+o*p*g-l*f*g)+x*(+n*p*v-n*u*M-l*d*v+s*d*M+l*u*g-s*p*g)+S*(-o*u*g-n*f*v+n*u*y+o*d*v-s*d*y+s*f*g)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=n,o[14]=s),this}invert(){const e=this.elements,n=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],f=e[6],p=e[7],g=e[8],v=e[9],y=e[10],M=e[11],w=e[12],C=e[13],x=e[14],S=e[15],L=v*x*p-C*y*p+C*f*M-u*x*M-v*f*S+u*y*S,b=w*y*p-g*x*p-w*f*M+d*x*M+g*f*S-d*y*S,N=g*C*p-w*v*p+w*u*M-d*C*M-g*u*S+d*v*S,$=w*v*f-g*C*f-w*u*y+d*C*y+g*u*x-d*v*x,k=n*L+s*b+o*N+l*$;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/k;return e[0]=L*U,e[1]=(C*y*l-v*x*l-C*o*M+s*x*M+v*o*S-s*y*S)*U,e[2]=(u*x*l-C*f*l+C*o*p-s*x*p-u*o*S+s*f*S)*U,e[3]=(v*f*l-u*y*l-v*o*p+s*y*p+u*o*M-s*f*M)*U,e[4]=b*U,e[5]=(g*x*l-w*y*l+w*o*M-n*x*M-g*o*S+n*y*S)*U,e[6]=(w*f*l-d*x*l-w*o*p+n*x*p+d*o*S-n*f*S)*U,e[7]=(d*y*l-g*f*l+g*o*p-n*y*p-d*o*M+n*f*M)*U,e[8]=N*U,e[9]=(w*v*l-g*C*l-w*s*M+n*C*M+g*s*S-n*v*S)*U,e[10]=(d*C*l-w*u*l+w*s*p-n*C*p-d*s*S+n*u*S)*U,e[11]=(g*u*l-d*v*l-g*s*p+n*v*p+d*s*M-n*u*M)*U,e[12]=$*U,e[13]=(g*C*o-w*v*o+w*s*y-n*C*y-g*s*x+n*v*x)*U,e[14]=(w*u*o-d*C*o-w*s*f+n*C*f+d*s*x-n*u*x)*U,e[15]=(d*v*o-g*u*o+g*s*f-n*v*f-d*s*y+n*u*y)*U,this}scale(e){const n=this.elements,s=e.x,o=e.y,l=e.z;return n[0]*=s,n[4]*=o,n[8]*=l,n[1]*=s,n[5]*=o,n[9]*=l,n[2]*=s,n[6]*=o,n[10]*=l,n[3]*=s,n[7]*=o,n[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,s,o))}makeTranslation(e,n,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,s,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,n,-s,0,0,s,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,0,s,0,0,1,0,0,-s,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,-s,0,0,s,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const s=Math.cos(n),o=Math.sin(n),l=1-s,d=e.x,u=e.y,f=e.z,p=l*d,g=l*u;return this.set(p*d+s,p*u-o*f,p*f+o*u,0,p*u+o*f,g*u+s,g*f-o*d,0,p*f-o*u,g*f+o*d,l*f*f+s,0,0,0,0,1),this}makeScale(e,n,s){return this.set(e,0,0,0,0,n,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,n,s,o,l,d){return this.set(1,s,l,0,e,1,d,0,n,o,1,0,0,0,0,1),this}compose(e,n,s){const o=this.elements,l=n._x,d=n._y,u=n._z,f=n._w,p=l+l,g=d+d,v=u+u,y=l*p,M=l*g,w=l*v,C=d*g,x=d*v,S=u*v,L=f*p,b=f*g,N=f*v,$=s.x,k=s.y,U=s.z;return o[0]=(1-(C+S))*$,o[1]=(M+N)*$,o[2]=(w-b)*$,o[3]=0,o[4]=(M-N)*k,o[5]=(1-(y+S))*k,o[6]=(x+L)*k,o[7]=0,o[8]=(w+b)*U,o[9]=(x-L)*U,o[10]=(1-(y+C))*U,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,n,s){const o=this.elements;let l=Ds.set(o[0],o[1],o[2]).length();const d=Ds.set(o[4],o[5],o[6]).length(),u=Ds.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],ui.copy(this);const p=1/l,g=1/d,v=1/u;return ui.elements[0]*=p,ui.elements[1]*=p,ui.elements[2]*=p,ui.elements[4]*=g,ui.elements[5]*=g,ui.elements[6]*=g,ui.elements[8]*=v,ui.elements[9]*=v,ui.elements[10]*=v,n.setFromRotationMatrix(ui),s.x=l,s.y=d,s.z=u,this}makePerspective(e,n,s,o,l,d,u=Vi){const f=this.elements,p=2*l/(n-e),g=2*l/(s-o),v=(n+e)/(n-e),y=(s+o)/(s-o);let M,w;if(u===Vi)M=-(d+l)/(d-l),w=-2*d*l/(d-l);else if(u===zl)M=-d/(d-l),w=-d*l/(d-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+u);return f[0]=p,f[4]=0,f[8]=v,f[12]=0,f[1]=0,f[5]=g,f[9]=y,f[13]=0,f[2]=0,f[6]=0,f[10]=M,f[14]=w,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,n,s,o,l,d,u=Vi){const f=this.elements,p=1/(n-e),g=1/(s-o),v=1/(d-l),y=(n+e)*p,M=(s+o)*g;let w,C;if(u===Vi)w=(d+l)*v,C=-2*v;else if(u===zl)w=l*v,C=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+u);return f[0]=2*p,f[4]=0,f[8]=0,f[12]=-y,f[1]=0,f[5]=2*g,f[9]=0,f[13]=-M,f[2]=0,f[6]=0,f[10]=C,f[14]=-w,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const n=this.elements,s=e.elements;for(let o=0;o<16;o++)if(n[o]!==s[o])return!1;return!0}fromArray(e,n=0){for(let s=0;s<16;s++)this.elements[s]=e[s+n];return this}toArray(e=[],n=0){const s=this.elements;return e[n]=s[0],e[n+1]=s[1],e[n+2]=s[2],e[n+3]=s[3],e[n+4]=s[4],e[n+5]=s[5],e[n+6]=s[6],e[n+7]=s[7],e[n+8]=s[8],e[n+9]=s[9],e[n+10]=s[10],e[n+11]=s[11],e[n+12]=s[12],e[n+13]=s[13],e[n+14]=s[14],e[n+15]=s[15],e}}const Ds=new Q,ui=new Ut,V0=new Q(0,0,0),G0=new Q(1,1,1),gr=new Q,ul=new Q,jn=new Q,sm=new Ut,am=new wr;class gi{constructor(e=0,n=0,s=0,o=gi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,s,o=this._order){return this._x=e,this._y=n,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,s=!0){const o=e.elements,l=o[0],d=o[4],u=o[8],f=o[1],p=o[5],g=o[9],v=o[2],y=o[6],M=o[10];switch(n){case"XYZ":this._y=Math.asin(Mn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-d,l)):(this._x=Math.atan2(y,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Mn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(u,M),this._z=Math.atan2(f,p)):(this._y=Math.atan2(-v,l),this._z=0);break;case"ZXY":this._x=Math.asin(Mn(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-d,p)):(this._y=0,this._z=Math.atan2(f,l));break;case"ZYX":this._y=Math.asin(-Mn(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(y,M),this._z=Math.atan2(f,l)):(this._x=0,this._z=Math.atan2(-d,p));break;case"YZX":this._z=Math.asin(Mn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-v,l)):(this._x=0,this._y=Math.atan2(u,M));break;case"XZY":this._z=Math.asin(-Mn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(y,p),this._y=Math.atan2(u,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,s){return sm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sm,n,s)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return am.setFromEuler(this),this.setFromQuaternion(am,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gi.DEFAULT_ORDER="XYZ";class xg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let W0=0;const om=new Q,Is=new wr,Oi=new Ut,dl=new Q,Ha=new Q,X0=new Q,Y0=new wr,lm=new Q(1,0,0),cm=new Q(0,1,0),um=new Q(0,0,1),dm={type:"added"},q0={type:"removed"},Us={type:"childadded",child:null},Hu={type:"childremoved",child:null};class ln extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:W0++}),this.uuid=qa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ln.DEFAULT_UP.clone();const e=new Q,n=new gi,s=new wr,o=new Q(1,1,1);function l(){s.setFromEuler(n,!1)}function d(){n.setFromQuaternion(s,void 0,!1)}n._onChange(l),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Ut},normalMatrix:{value:new ht}}),this.matrix=new Ut,this.matrixWorld=new Ut,this.matrixAutoUpdate=ln.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Is.setFromAxisAngle(e,n),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,n){return Is.setFromAxisAngle(e,n),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(lm,e)}rotateY(e){return this.rotateOnAxis(cm,e)}rotateZ(e){return this.rotateOnAxis(um,e)}translateOnAxis(e,n){return om.copy(e).applyQuaternion(this.quaternion),this.position.add(om.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(lm,e)}translateY(e){return this.translateOnAxis(cm,e)}translateZ(e){return this.translateOnAxis(um,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(e,n,s){e.isVector3?dl.copy(e):dl.set(e,n,s);const o=this.parent;this.updateWorldMatrix(!0,!1),Ha.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(Ha,dl,this.up):Oi.lookAt(dl,Ha,this.up),this.quaternion.setFromRotationMatrix(Oi),o&&(Oi.extractRotation(o.matrixWorld),Is.setFromRotationMatrix(Oi),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dm),Us.child=e,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(q0),Hu.child=e,this.dispatchEvent(Hu),Hu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dm),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let s=0,o=this.children.length;s<o;s++){const d=this.children[s].getObjectByProperty(e,n);if(d!==void 0)return d}}getObjectsByProperty(e,n,s=[]){this[e]===n&&s.push(this);const o=this.children;for(let l=0,d=o.length;l<d;l++)o[l].getObjectsByProperty(e,n,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ha,e,X0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ha,Y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].updateMatrixWorld(e)}updateWorldMatrix(e,n){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const o=this.children;for(let l=0,d=o.length;l<d;l++)o[l].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",s={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(u=>({boxInitialized:u.boxInitialized,boxMin:u.box.min.toArray(),boxMax:u.box.max.toArray(),sphereInitialized:u.sphereInitialized,sphereRadius:u.sphere.radius,sphereCenter:u.sphere.center.toArray()})),o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(u,f){return u[f.uuid]===void 0&&(u[f.uuid]=f.toJSON(e)),f.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const u=this.geometry.parameters;if(u!==void 0&&u.shapes!==void 0){const f=u.shapes;if(Array.isArray(f))for(let p=0,g=f.length;p<g;p++){const v=f[p];l(e.shapes,v)}else l(e.shapes,f)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const u=[];for(let f=0,p=this.material.length;f<p;f++)u.push(l(e.materials,this.material[f]));o.material=u}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let u=0;u<this.children.length;u++)o.children.push(this.children[u].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let u=0;u<this.animations.length;u++){const f=this.animations[u];o.animations.push(l(e.animations,f))}}if(n){const u=d(e.geometries),f=d(e.materials),p=d(e.textures),g=d(e.images),v=d(e.shapes),y=d(e.skeletons),M=d(e.animations),w=d(e.nodes);u.length>0&&(s.geometries=u),f.length>0&&(s.materials=f),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),v.length>0&&(s.shapes=v),y.length>0&&(s.skeletons=y),M.length>0&&(s.animations=M),w.length>0&&(s.nodes=w)}return s.object=o,s;function d(u){const f=[];for(const p in u){const g=u[p];delete g.metadata,f.push(g)}return f}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}ln.DEFAULT_UP=new Q(0,1,0);ln.DEFAULT_MATRIX_AUTO_UPDATE=!0;ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const di=new Q,ki=new Q,ju=new Q,zi=new Q,Fs=new Q,Os=new Q,hm=new Q,Vu=new Q,Gu=new Q,Wu=new Q,Xu=new Wt,Yu=new Wt,qu=new Wt;class pi{constructor(e=new Q,n=new Q,s=new Q){this.a=e,this.b=n,this.c=s}static getNormal(e,n,s,o){o.subVectors(s,n),di.subVectors(e,n),o.cross(di);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,n,s,o,l){di.subVectors(o,n),ki.subVectors(s,n),ju.subVectors(e,n);const d=di.dot(di),u=di.dot(ki),f=di.dot(ju),p=ki.dot(ki),g=ki.dot(ju),v=d*p-u*u;if(v===0)return l.set(0,0,0),null;const y=1/v,M=(p*f-u*g)*y,w=(d*g-u*f)*y;return l.set(1-M-w,w,M)}static containsPoint(e,n,s,o){return this.getBarycoord(e,n,s,o,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,n,s,o,l,d,u,f){return this.getBarycoord(e,n,s,o,zi)===null?(f.x=0,f.y=0,"z"in f&&(f.z=0),"w"in f&&(f.w=0),null):(f.setScalar(0),f.addScaledVector(l,zi.x),f.addScaledVector(d,zi.y),f.addScaledVector(u,zi.z),f)}static getInterpolatedAttribute(e,n,s,o,l,d){return Xu.setScalar(0),Yu.setScalar(0),qu.setScalar(0),Xu.fromBufferAttribute(e,n),Yu.fromBufferAttribute(e,s),qu.fromBufferAttribute(e,o),d.setScalar(0),d.addScaledVector(Xu,l.x),d.addScaledVector(Yu,l.y),d.addScaledVector(qu,l.z),d}static isFrontFacing(e,n,s,o){return di.subVectors(s,n),ki.subVectors(e,n),di.cross(ki).dot(o)<0}set(e,n,s){return this.a.copy(e),this.b.copy(n),this.c.copy(s),this}setFromPointsAndIndices(e,n,s,o){return this.a.copy(e[n]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,n,s,o){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return di.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),di.cross(ki).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return pi.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,s,o,l){return pi.getInterpolation(e,this.a,this.b,this.c,n,s,o,l)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const s=this.a,o=this.b,l=this.c;let d,u;Fs.subVectors(o,s),Os.subVectors(l,s),Vu.subVectors(e,s);const f=Fs.dot(Vu),p=Os.dot(Vu);if(f<=0&&p<=0)return n.copy(s);Gu.subVectors(e,o);const g=Fs.dot(Gu),v=Os.dot(Gu);if(g>=0&&v<=g)return n.copy(o);const y=f*v-g*p;if(y<=0&&f>=0&&g<=0)return d=f/(f-g),n.copy(s).addScaledVector(Fs,d);Wu.subVectors(e,l);const M=Fs.dot(Wu),w=Os.dot(Wu);if(w>=0&&M<=w)return n.copy(l);const C=M*p-f*w;if(C<=0&&p>=0&&w<=0)return u=p/(p-w),n.copy(s).addScaledVector(Os,u);const x=g*w-M*v;if(x<=0&&v-g>=0&&M-w>=0)return hm.subVectors(l,o),u=(v-g)/(v-g+(M-w)),n.copy(o).addScaledVector(hm,u);const S=1/(x+C+y);return d=C*S,u=y*S,n.copy(s).addScaledVector(Fs,d).addScaledVector(Os,u)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_r={h:0,s:0,l:0},hl={h:0,s:0,l:0};function $u(r,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?r+(e-r)*6*n:n<1/2?e:n<2/3?r+(e-r)*6*(2/3-n):r}class mt{constructor(e,n,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,s)}set(e,n,s){if(n===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,n,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.toWorkingColorSpace(this,n),this}setRGB(e,n,s,o=Rt.workingColorSpace){return this.r=e,this.g=n,this.b=s,Rt.toWorkingColorSpace(this,o),this}setHSL(e,n,s,o=Rt.workingColorSpace){if(e=P0(e,1),n=Mn(n,0,1),s=Mn(s,0,1),n===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+n):s+n-s*n,d=2*s-l;this.r=$u(d,l,e+1/3),this.g=$u(d,l,e),this.b=$u(d,l,e-1/3)}return Rt.toWorkingColorSpace(this,o),this}setStyle(e,n=hi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const d=o[1],u=o[2];switch(d){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,n);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,n);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],d=l.length;if(d===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,n);if(d===6)return this.setHex(parseInt(l,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=hi){const s=yg[e.toLowerCase()];return s!==void 0?this.setHex(s,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}copyLinearToSRGB(e){return this.r=Du(e.r),this.g=Du(e.g),this.b=Du(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return Rt.fromWorkingColorSpace(vn.copy(this),e),Math.round(Mn(vn.r*255,0,255))*65536+Math.round(Mn(vn.g*255,0,255))*256+Math.round(Mn(vn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Rt.workingColorSpace){Rt.fromWorkingColorSpace(vn.copy(this),n);const s=vn.r,o=vn.g,l=vn.b,d=Math.max(s,o,l),u=Math.min(s,o,l);let f,p;const g=(u+d)/2;if(u===d)f=0,p=0;else{const v=d-u;switch(p=g<=.5?v/(d+u):v/(2-d-u),d){case s:f=(o-l)/v+(o<l?6:0);break;case o:f=(l-s)/v+2;break;case l:f=(s-o)/v+4;break}f/=6}return e.h=f,e.s=p,e.l=g,e}getRGB(e,n=Rt.workingColorSpace){return Rt.fromWorkingColorSpace(vn.copy(this),n),e.r=vn.r,e.g=vn.g,e.b=vn.b,e}getStyle(e=hi){Rt.fromWorkingColorSpace(vn.copy(this),e);const n=vn.r,s=vn.g,o=vn.b;return e!==hi?`color(${e} ${n.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,n,s){return this.getHSL(_r),this.setHSL(_r.h+e,_r.s+n,_r.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,s){return this.r=e.r+(n.r-e.r)*s,this.g=e.g+(n.g-e.g)*s,this.b=e.b+(n.b-e.b)*s,this}lerpHSL(e,n){this.getHSL(_r),e.getHSL(hl);const s=Nu(_r.h,hl.h,n),o=Nu(_r.s,hl.s,n),l=Nu(_r.l,hl.l,n);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*n+l[3]*s+l[6]*o,this.g=l[1]*n+l[4]*s+l[7]*o,this.b=l[2]*n+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const vn=new mt;mt.NAMES=yg;let $0=0;class ea extends ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$0++}),this.uuid=qa(),this.name="",this.type="Material",this.blending=Ws,this.side=Er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dd,this.blendDst=hd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new mt(0,0,0),this.blendAlpha=0,this.depthFunc=qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const s=e[n];if(s===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const o=this[n];if(o===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[n]=s}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ws&&(s.blending=this.blending),this.side!==Er&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==dd&&(s.blendSrc=this.blendSrc),this.blendDst!==hd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==qs&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Qp&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const d=[];for(const u in l){const f=l[u];delete f.metadata,d.push(f)}return d}if(n){const l=o(e.textures),d=o(e.images);l.length>0&&(s.textures=l),d.length>0&&(s.images=d)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let s=null;if(n!==null){const o=n.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=n[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ch extends ea{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.combine=ng,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const qt=new Q,fl=new ut;class Un{constructor(e,n,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=s,this.usage=Jp,this.updateRanges=[],this.gpuType=ji,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,s){e*=this.itemSize,s*=n.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=n.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,s=this.count;n<s;n++)fl.fromBufferAttribute(this,n),fl.applyMatrix3(e),this.setXY(n,fl.x,fl.y);else if(this.itemSize===3)for(let n=0,s=this.count;n<s;n++)qt.fromBufferAttribute(this,n),qt.applyMatrix3(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let n=0,s=this.count;n<s;n++)qt.fromBufferAttribute(this,n),qt.applyMatrix4(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let n=0,s=this.count;n<s;n++)qt.fromBufferAttribute(this,n),qt.applyNormalMatrix(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let n=0,s=this.count;n<s;n++)qt.fromBufferAttribute(this,n),qt.transformDirection(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let s=this.array[e*this.itemSize+n];return this.normalized&&(s=Oa(s,this.array)),s}setComponent(e,n,s){return this.normalized&&(s=Nn(s,this.array)),this.array[e*this.itemSize+n]=s,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Oa(n,this.array)),n}setX(e,n){return this.normalized&&(n=Nn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Oa(n,this.array)),n}setY(e,n){return this.normalized&&(n=Nn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Oa(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Nn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Oa(n,this.array)),n}setW(e,n){return this.normalized&&(n=Nn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,s){return e*=this.itemSize,this.normalized&&(n=Nn(n,this.array),s=Nn(s,this.array)),this.array[e+0]=n,this.array[e+1]=s,this}setXYZ(e,n,s,o){return e*=this.itemSize,this.normalized&&(n=Nn(n,this.array),s=Nn(s,this.array),o=Nn(o,this.array)),this.array[e+0]=n,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,n,s,o,l){return e*=this.itemSize,this.normalized&&(n=Nn(n,this.array),s=Nn(s,this.array),o=Nn(o,this.array),l=Nn(l,this.array)),this.array[e+0]=n,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jp&&(e.usage=this.usage),e}}class Sg extends Un{constructor(e,n,s){super(new Uint16Array(e),n,s)}}class Mg extends Un{constructor(e,n,s){super(new Uint32Array(e),n,s)}}class En extends Un{constructor(e,n,s){super(new Float32Array(e),n,s)}}let K0=0;const Qn=new Ut,Ku=new ln,ks=new Q,Vn=new $a,ja=new $a,on=new Q;class Gn extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:K0++}),this.uuid=qa(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gg(e)?Mg:Sg)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,s=0){this.groups.push({start:e,count:n,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new ht().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qn.makeRotationFromQuaternion(e),this.applyMatrix4(Qn),this}rotateX(e){return Qn.makeRotationX(e),this.applyMatrix4(Qn),this}rotateY(e){return Qn.makeRotationY(e),this.applyMatrix4(Qn),this}rotateZ(e){return Qn.makeRotationZ(e),this.applyMatrix4(Qn),this}translate(e,n,s){return Qn.makeTranslation(e,n,s),this.applyMatrix4(Qn),this}scale(e,n,s){return Qn.makeScale(e,n,s),this.applyMatrix4(Qn),this}lookAt(e){return Ku.lookAt(e),Ku.updateMatrix(),this.applyMatrix4(Ku.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ks).negate(),this.translate(ks.x,ks.y,ks.z),this}setFromPoints(e){const n=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];n.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new En(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $a);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Q(-1/0,-1/0,-1/0),new Q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const l=n[s];Vn.setFromBufferAttribute(l),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Q,1/0);return}if(e){const s=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),n)for(let l=0,d=n.length;l<d;l++){const u=n[l];ja.setFromBufferAttribute(u),this.morphTargetsRelative?(on.addVectors(Vn.min,ja.min),Vn.expandByPoint(on),on.addVectors(Vn.max,ja.max),Vn.expandByPoint(on)):(Vn.expandByPoint(ja.min),Vn.expandByPoint(ja.max))}Vn.getCenter(s);let o=0;for(let l=0,d=e.count;l<d;l++)on.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(on));if(n)for(let l=0,d=n.length;l<d;l++){const u=n[l],f=this.morphTargetsRelative;for(let p=0,g=u.count;p<g;p++)on.fromBufferAttribute(u,p),f&&(ks.fromBufferAttribute(e,p),on.add(ks)),o=Math.max(o,s.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=n.position,o=n.normal,l=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Un(new Float32Array(4*s.count),4));const d=this.getAttribute("tangent"),u=[],f=[];for(let X=0;X<s.count;X++)u[X]=new Q,f[X]=new Q;const p=new Q,g=new Q,v=new Q,y=new ut,M=new ut,w=new ut,C=new Q,x=new Q;function S(X,ae,A){p.fromBufferAttribute(s,X),g.fromBufferAttribute(s,ae),v.fromBufferAttribute(s,A),y.fromBufferAttribute(l,X),M.fromBufferAttribute(l,ae),w.fromBufferAttribute(l,A),g.sub(p),v.sub(p),M.sub(y),w.sub(y);const E=1/(M.x*w.y-w.x*M.y);isFinite(E)&&(C.copy(g).multiplyScalar(w.y).addScaledVector(v,-M.y).multiplyScalar(E),x.copy(v).multiplyScalar(M.x).addScaledVector(g,-w.x).multiplyScalar(E),u[X].add(C),u[ae].add(C),u[A].add(C),f[X].add(x),f[ae].add(x),f[A].add(x))}let L=this.groups;L.length===0&&(L=[{start:0,count:e.count}]);for(let X=0,ae=L.length;X<ae;++X){const A=L[X],E=A.start,V=A.count;for(let Y=E,se=E+V;Y<se;Y+=3)S(e.getX(Y+0),e.getX(Y+1),e.getX(Y+2))}const b=new Q,N=new Q,$=new Q,k=new Q;function U(X){$.fromBufferAttribute(o,X),k.copy($);const ae=u[X];b.copy(ae),b.sub($.multiplyScalar($.dot(ae))).normalize(),N.crossVectors(k,ae);const E=N.dot(f[X])<0?-1:1;d.setXYZW(X,b.x,b.y,b.z,E)}for(let X=0,ae=L.length;X<ae;++X){const A=L[X],E=A.start,V=A.count;for(let Y=E,se=E+V;Y<se;Y+=3)U(e.getX(Y+0)),U(e.getX(Y+1)),U(e.getX(Y+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Un(new Float32Array(n.count*3),3),this.setAttribute("normal",s);else for(let y=0,M=s.count;y<M;y++)s.setXYZ(y,0,0,0);const o=new Q,l=new Q,d=new Q,u=new Q,f=new Q,p=new Q,g=new Q,v=new Q;if(e)for(let y=0,M=e.count;y<M;y+=3){const w=e.getX(y+0),C=e.getX(y+1),x=e.getX(y+2);o.fromBufferAttribute(n,w),l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,x),g.subVectors(d,l),v.subVectors(o,l),g.cross(v),u.fromBufferAttribute(s,w),f.fromBufferAttribute(s,C),p.fromBufferAttribute(s,x),u.add(g),f.add(g),p.add(g),s.setXYZ(w,u.x,u.y,u.z),s.setXYZ(C,f.x,f.y,f.z),s.setXYZ(x,p.x,p.y,p.z)}else for(let y=0,M=n.count;y<M;y+=3)o.fromBufferAttribute(n,y+0),l.fromBufferAttribute(n,y+1),d.fromBufferAttribute(n,y+2),g.subVectors(d,l),v.subVectors(o,l),g.cross(v),s.setXYZ(y+0,g.x,g.y,g.z),s.setXYZ(y+1,g.x,g.y,g.z),s.setXYZ(y+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,s=e.count;n<s;n++)on.fromBufferAttribute(e,n),on.normalize(),e.setXYZ(n,on.x,on.y,on.z)}toNonIndexed(){function e(u,f){const p=u.array,g=u.itemSize,v=u.normalized,y=new p.constructor(f.length*g);let M=0,w=0;for(let C=0,x=f.length;C<x;C++){u.isInterleavedBufferAttribute?M=f[C]*u.data.stride+u.offset:M=f[C]*g;for(let S=0;S<g;S++)y[w++]=p[M++]}return new Un(y,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Gn,s=this.index.array,o=this.attributes;for(const u in o){const f=o[u],p=e(f,s);n.setAttribute(u,p)}const l=this.morphAttributes;for(const u in l){const f=[],p=l[u];for(let g=0,v=p.length;g<v;g++){const y=p[g],M=e(y,s);f.push(M)}n.morphAttributes[u]=f}n.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let u=0,f=d.length;u<f;u++){const p=d[u];n.addGroup(p.start,p.count,p.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const f=this.parameters;for(const p in f)f[p]!==void 0&&(e[p]=f[p]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const s=this.attributes;for(const f in s){const p=s[f];e.data.attributes[f]=p.toJSON(e.data)}const o={};let l=!1;for(const f in this.morphAttributes){const p=this.morphAttributes[f],g=[];for(let v=0,y=p.length;v<y;v++){const M=p[v];g.push(M.toJSON(e.data))}g.length>0&&(o[f]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const u=this.boundingSphere;return u!==null&&(e.data.boundingSphere={center:u.center.toArray(),radius:u.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(n));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(n))}const l=e.morphAttributes;for(const p in l){const g=[],v=l[p];for(let y=0,M=v.length;y<M;y++)g.push(v[y].clone(n));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let p=0,g=d.length;p<g;p++){const v=d[p];this.addGroup(v.start,v.count,v.materialIndex)}const u=e.boundingBox;u!==null&&(this.boundingBox=u.clone());const f=e.boundingSphere;return f!==null&&(this.boundingSphere=f.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fm=new Ut,jr=new lh,pl=new Wl,pm=new Q,ml=new Q,gl=new Q,_l=new Q,Zu=new Q,vl=new Q,mm=new Q,xl=new Q;class ti extends ln{constructor(e=new Gn,n=new ch){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,s=Object.keys(n);if(s.length>0){const o=n[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,d=o.length;l<d;l++){const u=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=l}}}}getVertexPosition(e,n){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,d=s.morphTargetsRelative;n.fromBufferAttribute(o,e);const u=this.morphTargetInfluences;if(l&&u){vl.set(0,0,0);for(let f=0,p=l.length;f<p;f++){const g=u[f],v=l[f];g!==0&&(Zu.fromBufferAttribute(v,e),d?vl.addScaledVector(Zu,g):vl.addScaledVector(Zu.sub(n),g))}n.add(vl)}return n}raycast(e,n){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),pl.copy(s.boundingSphere),pl.applyMatrix4(l),jr.copy(e.ray).recast(e.near),!(pl.containsPoint(jr.origin)===!1&&(jr.intersectSphere(pl,pm)===null||jr.origin.distanceToSquared(pm)>(e.far-e.near)**2))&&(fm.copy(l).invert(),jr.copy(e.ray).applyMatrix4(fm),!(s.boundingBox!==null&&jr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,n,jr)))}_computeIntersections(e,n,s){let o;const l=this.geometry,d=this.material,u=l.index,f=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,v=l.attributes.normal,y=l.groups,M=l.drawRange;if(u!==null)if(Array.isArray(d))for(let w=0,C=y.length;w<C;w++){const x=y[w],S=d[x.materialIndex],L=Math.max(x.start,M.start),b=Math.min(u.count,Math.min(x.start+x.count,M.start+M.count));for(let N=L,$=b;N<$;N+=3){const k=u.getX(N),U=u.getX(N+1),X=u.getX(N+2);o=yl(this,S,e,s,p,g,v,k,U,X),o&&(o.faceIndex=Math.floor(N/3),o.face.materialIndex=x.materialIndex,n.push(o))}}else{const w=Math.max(0,M.start),C=Math.min(u.count,M.start+M.count);for(let x=w,S=C;x<S;x+=3){const L=u.getX(x),b=u.getX(x+1),N=u.getX(x+2);o=yl(this,d,e,s,p,g,v,L,b,N),o&&(o.faceIndex=Math.floor(x/3),n.push(o))}}else if(f!==void 0)if(Array.isArray(d))for(let w=0,C=y.length;w<C;w++){const x=y[w],S=d[x.materialIndex],L=Math.max(x.start,M.start),b=Math.min(f.count,Math.min(x.start+x.count,M.start+M.count));for(let N=L,$=b;N<$;N+=3){const k=N,U=N+1,X=N+2;o=yl(this,S,e,s,p,g,v,k,U,X),o&&(o.faceIndex=Math.floor(N/3),o.face.materialIndex=x.materialIndex,n.push(o))}}else{const w=Math.max(0,M.start),C=Math.min(f.count,M.start+M.count);for(let x=w,S=C;x<S;x+=3){const L=x,b=x+1,N=x+2;o=yl(this,d,e,s,p,g,v,L,b,N),o&&(o.faceIndex=Math.floor(x/3),n.push(o))}}}}function Z0(r,e,n,s,o,l,d,u){let f;if(e.side===Dn?f=s.intersectTriangle(d,l,o,!0,u):f=s.intersectTriangle(o,l,d,e.side===Er,u),f===null)return null;xl.copy(u),xl.applyMatrix4(r.matrixWorld);const p=n.ray.origin.distanceTo(xl);return p<n.near||p>n.far?null:{distance:p,point:xl.clone(),object:r}}function yl(r,e,n,s,o,l,d,u,f,p){r.getVertexPosition(u,ml),r.getVertexPosition(f,gl),r.getVertexPosition(p,_l);const g=Z0(r,e,n,s,ml,gl,_l,mm);if(g){const v=new Q;pi.getBarycoord(mm,ml,gl,_l,v),o&&(g.uv=pi.getInterpolatedAttribute(o,u,f,p,v,new ut)),l&&(g.uv1=pi.getInterpolatedAttribute(l,u,f,p,v,new ut)),d&&(g.normal=pi.getInterpolatedAttribute(d,u,f,p,v,new Q),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const y={a:u,b:f,c:p,normal:new Q,materialIndex:0};pi.getNormal(ml,gl,_l,y.normal),g.face=y,g.barycoord=v}return g}class Ka extends Gn{constructor(e=1,n=1,s=1,o=1,l=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:s,widthSegments:o,heightSegments:l,depthSegments:d};const u=this;o=Math.floor(o),l=Math.floor(l),d=Math.floor(d);const f=[],p=[],g=[],v=[];let y=0,M=0;w("z","y","x",-1,-1,s,n,e,d,l,0),w("z","y","x",1,-1,s,n,-e,d,l,1),w("x","z","y",1,1,e,s,n,o,d,2),w("x","z","y",1,-1,e,s,-n,o,d,3),w("x","y","z",1,-1,e,n,s,o,l,4),w("x","y","z",-1,-1,e,n,-s,o,l,5),this.setIndex(f),this.setAttribute("position",new En(p,3)),this.setAttribute("normal",new En(g,3)),this.setAttribute("uv",new En(v,2));function w(C,x,S,L,b,N,$,k,U,X,ae){const A=N/U,E=$/X,V=N/2,Y=$/2,se=k/2,K=U+1,q=X+1;let ue=0,z=0;const he=new Q;for(let le=0;le<q;le++){const F=le*E-Y;for(let oe=0;oe<K;oe++){const Ne=oe*A-V;he[C]=Ne*L,he[x]=F*b,he[S]=se,p.push(he.x,he.y,he.z),he[C]=0,he[x]=0,he[S]=k>0?1:-1,g.push(he.x,he.y,he.z),v.push(oe/U),v.push(1-le/X),ue+=1}}for(let le=0;le<X;le++)for(let F=0;F<U;F++){const oe=y+F+K*le,Ne=y+F+K*(le+1),ee=y+(F+1)+K*(le+1),de=y+(F+1)+K*le;f.push(oe,Ne,de),f.push(Ne,ee,de),z+=6}u.addGroup(M,z,ae),M+=z,y+=ue}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Js(r){const e={};for(const n in r){e[n]={};for(const s in r[n]){const o=r[n][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][s]=null):e[n][s]=o.clone():Array.isArray(o)?e[n][s]=o.slice():e[n][s]=o}}return e}function Sn(r){const e={};for(let n=0;n<r.length;n++){const s=Js(r[n]);for(const o in s)e[o]=s[o]}return e}function Q0(r){const e=[];for(let n=0;n<r.length;n++)e.push(r[n].clone());return e}function Eg(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Rt.workingColorSpace}const J0={clone:Js,merge:Sn};var ex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tr extends ea{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ex,this.fragmentShader=tx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Js(e.uniforms),this.uniformsGroups=Q0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const o in this.uniforms){const d=this.uniforms[o].value;d&&d.isTexture?n.uniforms[o]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?n.uniforms[o]={type:"c",value:d.getHex()}:d&&d.isVector2?n.uniforms[o]={type:"v2",value:d.toArray()}:d&&d.isVector3?n.uniforms[o]={type:"v3",value:d.toArray()}:d&&d.isVector4?n.uniforms[o]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?n.uniforms[o]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?n.uniforms[o]={type:"m4",value:d.toArray()}:n.uniforms[o]={value:d}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(n.extensions=s),n}}class wg extends ln{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ut,this.projectionMatrix=new Ut,this.projectionMatrixInverse=new Ut,this.coordinateSystem=Vi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vr=new Q,gm=new ut,_m=new ut;class Jn extends wg{constructor(e=50,n=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Kd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Dl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Kd*2*Math.atan(Math.tan(Dl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,s){vr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(vr.x,vr.y).multiplyScalar(-e/vr.z),vr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(vr.x,vr.y).multiplyScalar(-e/vr.z)}getViewSize(e,n){return this.getViewBounds(e,gm,_m),n.subVectors(_m,gm)}setViewOffset(e,n,s,o,l,d){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Dl*.5*this.fov)/this.zoom,s=2*n,o=this.aspect*s,l=-.5*o;const d=this.view;if(this.view!==null&&this.view.enabled){const f=d.fullWidth,p=d.fullHeight;l+=d.offsetX*o/f,n-=d.offsetY*s/p,o*=d.width/f,s*=d.height/p}const u=this.filmOffset;u!==0&&(l+=e*u/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,n,n-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const zs=-90,Bs=1;class nx extends ln{constructor(e,n,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new Jn(zs,Bs,e,n);o.layers=this.layers,this.add(o);const l=new Jn(zs,Bs,e,n);l.layers=this.layers,this.add(l);const d=new Jn(zs,Bs,e,n);d.layers=this.layers,this.add(d);const u=new Jn(zs,Bs,e,n);u.layers=this.layers,this.add(u);const f=new Jn(zs,Bs,e,n);f.layers=this.layers,this.add(f);const p=new Jn(zs,Bs,e,n);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[s,o,l,d,u,f]=n;for(const p of n)this.remove(p);if(e===Vi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),u.up.set(0,1,0),u.lookAt(0,0,1),f.up.set(0,1,0),f.lookAt(0,0,-1);else if(e===zl)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),u.up.set(0,-1,0),u.lookAt(0,0,1),f.up.set(0,-1,0),f.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of n)this.add(p),p.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,d,u,f,p,g]=this.children,v=e.getRenderTarget(),y=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),w=e.xr.enabled;e.xr.enabled=!1;const C=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(n,l),e.setRenderTarget(s,1,o),e.render(n,d),e.setRenderTarget(s,2,o),e.render(n,u),e.setRenderTarget(s,3,o),e.render(n,f),e.setRenderTarget(s,4,o),e.render(n,p),s.texture.generateMipmaps=C,e.setRenderTarget(s,5,o),e.render(n,g),e.setRenderTarget(v,y,M),e.xr.enabled=w,s.texture.needsPMREMUpdate=!0}}class Tg extends In{constructor(e,n,s,o,l,d,u,f,p,g){e=e!==void 0?e:[],n=n!==void 0?n:$s,super(e,n,s,o,l,d,u,f,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ix extends es{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new Tg(o,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:fi}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new Ka(5,5,5),l=new Tr({name:"CubemapFromEquirect",uniforms:Js(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Dn,blending:Sr});l.uniforms.tEquirect.value=n;const d=new ti(o,l),u=n.minFilter;return n.minFilter===Zr&&(n.minFilter=fi),new nx(1,10,this).update(e,d),n.minFilter=u,d.geometry.dispose(),d.material.dispose(),this}clear(e,n,s,o){const l=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(n,s,o);e.setRenderTarget(l)}}const Qu=new Q,rx=new Q,sx=new ht;class xr{constructor(e=new Q(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,s,o){return this.normal.set(e,n,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,s){const o=Qu.subVectors(s,n).cross(rx.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const s=e.delta(Qu),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:n.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const n=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return n<0&&s>0||s<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const s=n||sx.getNormalMatrix(e),o=this.coplanarPoint(Qu).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Wl,Sl=new Q;class uh{constructor(e=new xr,n=new xr,s=new xr,o=new xr,l=new xr,d=new xr){this.planes=[e,n,s,o,l,d]}set(e,n,s,o,l,d){const u=this.planes;return u[0].copy(e),u[1].copy(n),u[2].copy(s),u[3].copy(o),u[4].copy(l),u[5].copy(d),this}copy(e){const n=this.planes;for(let s=0;s<6;s++)n[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,n=Vi){const s=this.planes,o=e.elements,l=o[0],d=o[1],u=o[2],f=o[3],p=o[4],g=o[5],v=o[6],y=o[7],M=o[8],w=o[9],C=o[10],x=o[11],S=o[12],L=o[13],b=o[14],N=o[15];if(s[0].setComponents(f-l,y-p,x-M,N-S).normalize(),s[1].setComponents(f+l,y+p,x+M,N+S).normalize(),s[2].setComponents(f+d,y+g,x+w,N+L).normalize(),s[3].setComponents(f-d,y-g,x-w,N-L).normalize(),s[4].setComponents(f-u,y-v,x-C,N-b).normalize(),n===Vi)s[5].setComponents(f+u,y+v,x+C,N+b).normalize();else if(n===zl)s[5].setComponents(u,v,C,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const n=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(n[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const n=this.planes;for(let s=0;s<6;s++){const o=n[s];if(Sl.x=o.normal.x>0?e.max.x:e.min.x,Sl.y=o.normal.y>0?e.max.y:e.min.y,Sl.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Sl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let s=0;s<6;s++)if(n[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ag(){let r=null,e=!1,n=null,s=null;function o(l,d){n(l,d),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&n!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){n=l},setContext:function(l){r=l}}}function ax(r){const e=new WeakMap;function n(u,f){const p=u.array,g=u.usage,v=p.byteLength,y=r.createBuffer();r.bindBuffer(f,y),r.bufferData(f,p,g),u.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)u.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:y,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:u.version,size:v}}function s(u,f,p){const g=f.array,v=f.updateRanges;if(r.bindBuffer(p,u),v.length===0)r.bufferSubData(p,0,g);else{v.sort((M,w)=>M.start-w.start);let y=0;for(let M=1;M<v.length;M++){const w=v[y],C=v[M];C.start<=w.start+w.count+1?w.count=Math.max(w.count,C.start+C.count-w.start):(++y,v[y]=C)}v.length=y+1;for(let M=0,w=v.length;M<w;M++){const C=v[M];r.bufferSubData(p,C.start*g.BYTES_PER_ELEMENT,g,C.start,C.count)}f.clearUpdateRanges()}f.onUploadCallback()}function o(u){return u.isInterleavedBufferAttribute&&(u=u.data),e.get(u)}function l(u){u.isInterleavedBufferAttribute&&(u=u.data);const f=e.get(u);f&&(r.deleteBuffer(f.buffer),e.delete(u))}function d(u,f){if(u.isInterleavedBufferAttribute&&(u=u.data),u.isGLBufferAttribute){const g=e.get(u);(!g||g.version<u.version)&&e.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}const p=e.get(u);if(p===void 0)e.set(u,n(u,f));else if(p.version<u.version){if(p.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,u,f),p.version=u.version}}return{get:o,remove:l,update:d}}class Za extends Gn{constructor(e=1,n=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:s,heightSegments:o};const l=e/2,d=n/2,u=Math.floor(s),f=Math.floor(o),p=u+1,g=f+1,v=e/u,y=n/f,M=[],w=[],C=[],x=[];for(let S=0;S<g;S++){const L=S*y-d;for(let b=0;b<p;b++){const N=b*v-l;w.push(N,-L,0),C.push(0,0,1),x.push(b/u),x.push(1-S/f)}}for(let S=0;S<f;S++)for(let L=0;L<u;L++){const b=L+p*S,N=L+p*(S+1),$=L+1+p*(S+1),k=L+1+p*S;M.push(b,N,k),M.push(N,$,k)}this.setIndex(M),this.setAttribute("position",new En(w,3)),this.setAttribute("normal",new En(C,3)),this.setAttribute("uv",new En(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Za(e.width,e.height,e.widthSegments,e.heightSegments)}}var ox=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ux=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,px=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,gx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_x=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ax=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,bx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Px=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Dx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ix=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ux=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ox="gl_FragColor = linearToOutputTexel( gl_FragColor );",kx=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Bx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$x=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Jx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ey=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ty=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ny=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,iy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ry=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sy=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ay=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,oy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ly=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dy=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,py=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,my=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_y=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,My=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ey=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ty=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ay=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ry=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,by=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Py=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ny=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ly=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Iy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Fy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Oy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ky=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,By=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Vy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Gy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yy=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,qy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$y=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ky=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jy=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,eS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,nS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,iS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const aS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,oS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,pS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,mS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,gS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_S=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,SS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ES=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,TS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,CS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,RS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,NS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,US=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,FS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,OS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:ox,alphahash_pars_fragment:lx,alphamap_fragment:cx,alphamap_pars_fragment:ux,alphatest_fragment:dx,alphatest_pars_fragment:hx,aomap_fragment:fx,aomap_pars_fragment:px,batching_pars_vertex:mx,batching_vertex:gx,begin_vertex:_x,beginnormal_vertex:vx,bsdfs:xx,iridescence_fragment:yx,bumpmap_pars_fragment:Sx,clipping_planes_fragment:Mx,clipping_planes_pars_fragment:Ex,clipping_planes_pars_vertex:wx,clipping_planes_vertex:Tx,color_fragment:Ax,color_pars_fragment:Cx,color_pars_vertex:Rx,color_vertex:bx,common:Px,cube_uv_reflection_fragment:Nx,defaultnormal_vertex:Lx,displacementmap_pars_vertex:Dx,displacementmap_vertex:Ix,emissivemap_fragment:Ux,emissivemap_pars_fragment:Fx,colorspace_fragment:Ox,colorspace_pars_fragment:kx,envmap_fragment:zx,envmap_common_pars_fragment:Bx,envmap_pars_fragment:Hx,envmap_pars_vertex:jx,envmap_physical_pars_fragment:Jx,envmap_vertex:Vx,fog_vertex:Gx,fog_pars_vertex:Wx,fog_fragment:Xx,fog_pars_fragment:Yx,gradientmap_pars_fragment:qx,lightmap_pars_fragment:$x,lights_lambert_fragment:Kx,lights_lambert_pars_fragment:Zx,lights_pars_begin:Qx,lights_toon_fragment:ey,lights_toon_pars_fragment:ty,lights_phong_fragment:ny,lights_phong_pars_fragment:iy,lights_physical_fragment:ry,lights_physical_pars_fragment:sy,lights_fragment_begin:ay,lights_fragment_maps:oy,lights_fragment_end:ly,logdepthbuf_fragment:cy,logdepthbuf_pars_fragment:uy,logdepthbuf_pars_vertex:dy,logdepthbuf_vertex:hy,map_fragment:fy,map_pars_fragment:py,map_particle_fragment:my,map_particle_pars_fragment:gy,metalnessmap_fragment:_y,metalnessmap_pars_fragment:vy,morphinstance_vertex:xy,morphcolor_vertex:yy,morphnormal_vertex:Sy,morphtarget_pars_vertex:My,morphtarget_vertex:Ey,normal_fragment_begin:wy,normal_fragment_maps:Ty,normal_pars_fragment:Ay,normal_pars_vertex:Cy,normal_vertex:Ry,normalmap_pars_fragment:by,clearcoat_normal_fragment_begin:Py,clearcoat_normal_fragment_maps:Ny,clearcoat_pars_fragment:Ly,iridescence_pars_fragment:Dy,opaque_fragment:Iy,packing:Uy,premultiplied_alpha_fragment:Fy,project_vertex:Oy,dithering_fragment:ky,dithering_pars_fragment:zy,roughnessmap_fragment:By,roughnessmap_pars_fragment:Hy,shadowmap_pars_fragment:jy,shadowmap_pars_vertex:Vy,shadowmap_vertex:Gy,shadowmask_pars_fragment:Wy,skinbase_vertex:Xy,skinning_pars_vertex:Yy,skinning_vertex:qy,skinnormal_vertex:$y,specularmap_fragment:Ky,specularmap_pars_fragment:Zy,tonemapping_fragment:Qy,tonemapping_pars_fragment:Jy,transmission_fragment:eS,transmission_pars_fragment:tS,uv_pars_fragment:nS,uv_pars_vertex:iS,uv_vertex:rS,worldpos_vertex:sS,background_vert:aS,background_frag:oS,backgroundCube_vert:lS,backgroundCube_frag:cS,cube_vert:uS,cube_frag:dS,depth_vert:hS,depth_frag:fS,distanceRGBA_vert:pS,distanceRGBA_frag:mS,equirect_vert:gS,equirect_frag:_S,linedashed_vert:vS,linedashed_frag:xS,meshbasic_vert:yS,meshbasic_frag:SS,meshlambert_vert:MS,meshlambert_frag:ES,meshmatcap_vert:wS,meshmatcap_frag:TS,meshnormal_vert:AS,meshnormal_frag:CS,meshphong_vert:RS,meshphong_frag:bS,meshphysical_vert:PS,meshphysical_frag:NS,meshtoon_vert:LS,meshtoon_frag:DS,points_vert:IS,points_frag:US,shadow_vert:FS,shadow_frag:OS,sprite_vert:kS,sprite_frag:zS},be={common:{diffuse:{value:new mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ht}},envmap:{envMap:{value:null},envMapRotation:{value:new ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ht},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0},uvTransform:{value:new ht}},sprite:{diffuse:{value:new mt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}}},Mi={basic:{uniforms:Sn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:Sn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new mt(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:Sn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new mt(0)},specular:{value:new mt(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:Sn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:Sn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new mt(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:Sn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:Sn([be.points,be.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:Sn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:Sn([be.common,be.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:Sn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:Sn([be.sprite,be.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ht}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:Sn([be.common,be.displacementmap,{referencePosition:{value:new Q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:Sn([be.lights,be.fog,{color:{value:new mt(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};Mi.physical={uniforms:Sn([Mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ht},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ht},sheen:{value:0},sheenColor:{value:new mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ht},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ht},attenuationDistance:{value:0},attenuationColor:{value:new mt(0)},specularColor:{value:new mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ht},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ht}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Ml={r:0,b:0,g:0},Gr=new gi,BS=new Ut;function HS(r,e,n,s,o,l,d){const u=new mt(0);let f=l===!0?0:1,p,g,v=null,y=0,M=null;function w(L){let b=L.isScene===!0?L.background:null;return b&&b.isTexture&&(b=(L.backgroundBlurriness>0?n:e).get(b)),b}function C(L){let b=!1;const N=w(L);N===null?S(u,f):N&&N.isColor&&(S(N,1),b=!0);const $=r.xr.getEnvironmentBlendMode();$==="additive"?s.buffers.color.setClear(0,0,0,1,d):$==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,d),(r.autoClear||b)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(L,b){const N=w(b);N&&(N.isCubeTexture||N.mapping===Vl)?(g===void 0&&(g=new ti(new Ka(1,1,1),new Tr({name:"BackgroundCubeMaterial",uniforms:Js(Mi.backgroundCube.uniforms),vertexShader:Mi.backgroundCube.vertexShader,fragmentShader:Mi.backgroundCube.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function($,k,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(b.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=N,g.material.uniforms.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(BS.makeRotationFromEuler(Gr)),g.material.toneMapped=Rt.getTransfer(N.colorSpace)!==kt,(v!==N||y!==N.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,v=N,y=N.version,M=r.toneMapping),g.layers.enableAll(),L.unshift(g,g.geometry,g.material,0,0,null)):N&&N.isTexture&&(p===void 0&&(p=new ti(new Za(2,2),new Tr({name:"BackgroundMaterial",uniforms:Js(Mi.background.uniforms),vertexShader:Mi.background.vertexShader,fragmentShader:Mi.background.fragmentShader,side:Er,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=N,p.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,p.material.toneMapped=Rt.getTransfer(N.colorSpace)!==kt,N.matrixAutoUpdate===!0&&N.updateMatrix(),p.material.uniforms.uvTransform.value.copy(N.matrix),(v!==N||y!==N.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,v=N,y=N.version,M=r.toneMapping),p.layers.enableAll(),L.unshift(p,p.geometry,p.material,0,0,null))}function S(L,b){L.getRGB(Ml,Eg(r)),s.buffers.color.setClear(Ml.r,Ml.g,Ml.b,b,d)}return{getClearColor:function(){return u},setClearColor:function(L,b=1){u.set(L),f=b,S(u,f)},getClearAlpha:function(){return f},setClearAlpha:function(L){f=L,S(u,f)},render:C,addToRenderList:x}}function jS(r,e){const n=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=y(null);let l=o,d=!1;function u(A,E,V,Y,se){let K=!1;const q=v(Y,V,E);l!==q&&(l=q,p(l.object)),K=M(A,Y,V,se),K&&w(A,Y,V,se),se!==null&&e.update(se,r.ELEMENT_ARRAY_BUFFER),(K||d)&&(d=!1,N(A,E,V,Y),se!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(se).buffer))}function f(){return r.createVertexArray()}function p(A){return r.bindVertexArray(A)}function g(A){return r.deleteVertexArray(A)}function v(A,E,V){const Y=V.wireframe===!0;let se=s[A.id];se===void 0&&(se={},s[A.id]=se);let K=se[E.id];K===void 0&&(K={},se[E.id]=K);let q=K[Y];return q===void 0&&(q=y(f()),K[Y]=q),q}function y(A){const E=[],V=[],Y=[];for(let se=0;se<n;se++)E[se]=0,V[se]=0,Y[se]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:V,attributeDivisors:Y,object:A,attributes:{},index:null}}function M(A,E,V,Y){const se=l.attributes,K=E.attributes;let q=0;const ue=V.getAttributes();for(const z in ue)if(ue[z].location>=0){const le=se[z];let F=K[z];if(F===void 0&&(z==="instanceMatrix"&&A.instanceMatrix&&(F=A.instanceMatrix),z==="instanceColor"&&A.instanceColor&&(F=A.instanceColor)),le===void 0||le.attribute!==F||F&&le.data!==F.data)return!0;q++}return l.attributesNum!==q||l.index!==Y}function w(A,E,V,Y){const se={},K=E.attributes;let q=0;const ue=V.getAttributes();for(const z in ue)if(ue[z].location>=0){let le=K[z];le===void 0&&(z==="instanceMatrix"&&A.instanceMatrix&&(le=A.instanceMatrix),z==="instanceColor"&&A.instanceColor&&(le=A.instanceColor));const F={};F.attribute=le,le&&le.data&&(F.data=le.data),se[z]=F,q++}l.attributes=se,l.attributesNum=q,l.index=Y}function C(){const A=l.newAttributes;for(let E=0,V=A.length;E<V;E++)A[E]=0}function x(A){S(A,0)}function S(A,E){const V=l.newAttributes,Y=l.enabledAttributes,se=l.attributeDivisors;V[A]=1,Y[A]===0&&(r.enableVertexAttribArray(A),Y[A]=1),se[A]!==E&&(r.vertexAttribDivisor(A,E),se[A]=E)}function L(){const A=l.newAttributes,E=l.enabledAttributes;for(let V=0,Y=E.length;V<Y;V++)E[V]!==A[V]&&(r.disableVertexAttribArray(V),E[V]=0)}function b(A,E,V,Y,se,K,q){q===!0?r.vertexAttribIPointer(A,E,V,se,K):r.vertexAttribPointer(A,E,V,Y,se,K)}function N(A,E,V,Y){C();const se=Y.attributes,K=V.getAttributes(),q=E.defaultAttributeValues;for(const ue in K){const z=K[ue];if(z.location>=0){let he=se[ue];if(he===void 0&&(ue==="instanceMatrix"&&A.instanceMatrix&&(he=A.instanceMatrix),ue==="instanceColor"&&A.instanceColor&&(he=A.instanceColor)),he!==void 0){const le=he.normalized,F=he.itemSize,oe=e.get(he);if(oe===void 0)continue;const Ne=oe.buffer,ee=oe.type,de=oe.bytesPerElement,xe=ee===r.INT||ee===r.UNSIGNED_INT||he.gpuType===th;if(he.isInterleavedBufferAttribute){const Se=he.data,Ae=Se.stride,Pe=he.offset;if(Se.isInstancedInterleavedBuffer){for(let je=0;je<z.locationSize;je++)S(z.location+je,Se.meshPerAttribute);A.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let je=0;je<z.locationSize;je++)x(z.location+je);r.bindBuffer(r.ARRAY_BUFFER,Ne);for(let je=0;je<z.locationSize;je++)b(z.location+je,F/z.locationSize,ee,le,Ae*de,(Pe+F/z.locationSize*je)*de,xe)}else{if(he.isInstancedBufferAttribute){for(let Se=0;Se<z.locationSize;Se++)S(z.location+Se,he.meshPerAttribute);A.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Se=0;Se<z.locationSize;Se++)x(z.location+Se);r.bindBuffer(r.ARRAY_BUFFER,Ne);for(let Se=0;Se<z.locationSize;Se++)b(z.location+Se,F/z.locationSize,ee,le,F*de,F/z.locationSize*Se*de,xe)}}else if(q!==void 0){const le=q[ue];if(le!==void 0)switch(le.length){case 2:r.vertexAttrib2fv(z.location,le);break;case 3:r.vertexAttrib3fv(z.location,le);break;case 4:r.vertexAttrib4fv(z.location,le);break;default:r.vertexAttrib1fv(z.location,le)}}}}L()}function $(){X();for(const A in s){const E=s[A];for(const V in E){const Y=E[V];for(const se in Y)g(Y[se].object),delete Y[se];delete E[V]}delete s[A]}}function k(A){if(s[A.id]===void 0)return;const E=s[A.id];for(const V in E){const Y=E[V];for(const se in Y)g(Y[se].object),delete Y[se];delete E[V]}delete s[A.id]}function U(A){for(const E in s){const V=s[E];if(V[A.id]===void 0)continue;const Y=V[A.id];for(const se in Y)g(Y[se].object),delete Y[se];delete V[A.id]}}function X(){ae(),d=!0,l!==o&&(l=o,p(l.object))}function ae(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:u,reset:X,resetDefaultState:ae,dispose:$,releaseStatesOfGeometry:k,releaseStatesOfProgram:U,initAttributes:C,enableAttribute:x,disableUnusedAttributes:L}}function VS(r,e,n){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),n.update(g,s,1)}function d(p,g,v){v!==0&&(r.drawArraysInstanced(s,p,g,v),n.update(g,s,v))}function u(p,g,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,g,0,v);let M=0;for(let w=0;w<v;w++)M+=g[w];n.update(M,s,1)}function f(p,g,v,y){if(v===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let w=0;w<p.length;w++)d(p[w],g[w],y[w]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,y,0,v);let w=0;for(let C=0;C<v;C++)w+=g[C];for(let C=0;C<y.length;C++)n.update(w,s,y[C])}}this.setMode=o,this.render=l,this.renderInstances=d,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function GS(r,e,n,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function d(U){return!(U!==mi&&s.convert(U)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function u(U){const X=U===Ya&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==Gi&&s.convert(U)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==ji&&!X)}function f(U){if(U==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=n.precision!==void 0?n.precision:"highp";const g=f(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const v=n.logarithmicDepthBuffer===!0,y=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(y===!0){const U=e.get("EXT_clip_control");U.clipControlEXT(U.LOWER_LEFT_EXT,U.ZERO_TO_ONE_EXT)}const M=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),w=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=r.getParameter(r.MAX_TEXTURE_SIZE),x=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),L=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),N=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),$=w>0,k=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:f,textureFormatReadable:d,textureTypeReadable:u,precision:p,logarithmicDepthBuffer:v,reverseDepthBuffer:y,maxTextures:M,maxVertexTextures:w,maxTextureSize:C,maxCubemapSize:x,maxAttributes:S,maxVertexUniforms:L,maxVaryings:b,maxFragmentUniforms:N,vertexTextures:$,maxSamples:k}}function WS(r){const e=this;let n=null,s=0,o=!1,l=!1;const d=new xr,u=new ht,f={value:null,needsUpdate:!1};this.uniform=f,this.numPlanes=0,this.numIntersection=0,this.init=function(v,y){const M=v.length!==0||y||s!==0||o;return o=y,s=v.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(v,y){n=g(v,y,0)},this.setState=function(v,y,M){const w=v.clippingPlanes,C=v.clipIntersection,x=v.clipShadows,S=r.get(v);if(!o||w===null||w.length===0||l&&!x)l?g(null):p();else{const L=l?0:s,b=L*4;let N=S.clippingState||null;f.value=N,N=g(w,y,b,M);for(let $=0;$!==b;++$)N[$]=n[$];S.clippingState=N,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=L}};function p(){f.value!==n&&(f.value=n,f.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(v,y,M,w){const C=v!==null?v.length:0;let x=null;if(C!==0){if(x=f.value,w!==!0||x===null){const S=M+C*4,L=y.matrixWorldInverse;u.getNormalMatrix(L),(x===null||x.length<S)&&(x=new Float32Array(S));for(let b=0,N=M;b!==C;++b,N+=4)d.copy(v[b]).applyMatrix4(L,u),d.normal.toArray(x,N),x[N+3]=d.constant}f.value=x,f.needsUpdate=!0}return e.numPlanes=C,e.numIntersection=0,x}}function XS(r){let e=new WeakMap;function n(d,u){return u===yd?d.mapping=$s:u===Sd&&(d.mapping=Ks),d}function s(d){if(d&&d.isTexture){const u=d.mapping;if(u===yd||u===Sd)if(e.has(d)){const f=e.get(d).texture;return n(f,d.mapping)}else{const f=d.image;if(f&&f.height>0){const p=new ix(f.height);return p.fromEquirectangularTexture(r,d),e.set(d,p),d.addEventListener("dispose",o),n(p.texture,d.mapping)}else return null}}return d}function o(d){const u=d.target;u.removeEventListener("dispose",o);const f=e.get(u);f!==void 0&&(e.delete(u),f.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class Cg extends wg{constructor(e=-1,n=1,s=1,o=-1,l=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=s,this.bottom=o,this.near=l,this.far=d,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,s,o,l,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,d=s+e,u=o+n,f=o-n;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,d=l+p*this.view.width,u-=g*this.view.offsetY,f=u-g*this.view.height}this.projectionMatrix.makeOrthographic(l,d,u,f,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Vs=4,vm=[.125,.215,.35,.446,.526,.582],$r=20,Ju=new Cg,xm=new mt;let ed=null,td=0,nd=0,id=!1;const Yr=(1+Math.sqrt(5))/2,Hs=1/Yr,ym=[new Q(-Yr,Hs,0),new Q(Yr,Hs,0),new Q(-Hs,0,Yr),new Q(Hs,0,Yr),new Q(0,Yr,-Hs),new Q(0,Yr,Hs),new Q(-1,1,-1),new Q(1,1,-1),new Q(-1,1,1),new Q(1,1,1)];class Sm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,s=.1,o=100){ed=this._renderer.getRenderTarget(),td=this._renderer.getActiveCubeFace(),nd=this._renderer.getActiveMipmapLevel(),id=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Em(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ed,td,nd),this._renderer.xr.enabled=id,e.scissorTest=!1,El(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===$s||e.mapping===Ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ed=this._renderer.getRenderTarget(),td=this._renderer.getActiveCubeFace(),nd=this._renderer.getActiveMipmapLevel(),id=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=n||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,s={magFilter:fi,minFilter:fi,generateMipmaps:!1,type:Ya,format:mi,colorSpace:Ar,depthBuffer:!1},o=Mm(e,n,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mm(e,n,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=YS(l)),this._blurMaterial=qS(l,e,n)}return o}_compileMaterial(e){const n=new ti(this._lodPlanes[0],e);this._renderer.compile(n,Ju)}_sceneToCubeUV(e,n,s,o){const u=new Jn(90,1,n,s),f=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,v=g.autoClear,y=g.toneMapping;g.getClearColor(xm),g.toneMapping=Mr,g.autoClear=!1;const M=new ch({name:"PMREM.Background",side:Dn,depthWrite:!1,depthTest:!1}),w=new ti(new Ka,M);let C=!1;const x=e.background;x?x.isColor&&(M.color.copy(x),e.background=null,C=!0):(M.color.copy(xm),C=!0);for(let S=0;S<6;S++){const L=S%3;L===0?(u.up.set(0,f[S],0),u.lookAt(p[S],0,0)):L===1?(u.up.set(0,0,f[S]),u.lookAt(0,p[S],0)):(u.up.set(0,f[S],0),u.lookAt(0,0,p[S]));const b=this._cubeSize;El(o,L*b,S>2?b:0,b,b),g.setRenderTarget(o),C&&g.render(w,u),g.render(e,u)}w.geometry.dispose(),w.material.dispose(),g.toneMapping=y,g.autoClear=v,e.background=x}_textureToCubeUV(e,n){const s=this._renderer,o=e.mapping===$s||e.mapping===Ks;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=wm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Em());const l=o?this._cubemapMaterial:this._equirectMaterial,d=new ti(this._lodPlanes[0],l),u=l.uniforms;u.envMap.value=e;const f=this._cubeSize;El(n,0,0,3*f,2*f),s.setRenderTarget(n),s.render(d,Ju)}_applyPMREM(e){const n=this._renderer,s=n.autoClear;n.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const d=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),u=ym[(o-l-1)%ym.length];this._blur(e,l-1,l,d,u)}n.autoClear=s}_blur(e,n,s,o,l){const d=this._pingPongRenderTarget;this._halfBlur(e,d,n,s,o,"latitudinal",l),this._halfBlur(d,e,s,s,o,"longitudinal",l)}_halfBlur(e,n,s,o,l,d,u){const f=this._renderer,p=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new ti(this._lodPlanes[o],p),y=p.uniforms,M=this._sizeLods[s]-1,w=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*$r-1),C=l/w,x=isFinite(l)?1+Math.floor(g*C):$r;x>$r&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${$r}`);const S=[];let L=0;for(let U=0;U<$r;++U){const X=U/C,ae=Math.exp(-X*X/2);S.push(ae),U===0?L+=ae:U<x&&(L+=2*ae)}for(let U=0;U<S.length;U++)S[U]=S[U]/L;y.envMap.value=e.texture,y.samples.value=x,y.weights.value=S,y.latitudinal.value=d==="latitudinal",u&&(y.poleAxis.value=u);const{_lodMax:b}=this;y.dTheta.value=w,y.mipInt.value=b-s;const N=this._sizeLods[o],$=3*N*(o>b-Vs?o-b+Vs:0),k=4*(this._cubeSize-N);El(n,$,k,3*N,2*N),f.setRenderTarget(n),f.render(v,Ju)}}function YS(r){const e=[],n=[],s=[];let o=r;const l=r-Vs+1+vm.length;for(let d=0;d<l;d++){const u=Math.pow(2,o);n.push(u);let f=1/u;d>r-Vs?f=vm[d-r+Vs-1]:d===0&&(f=0),s.push(f);const p=1/(u-2),g=-p,v=1+p,y=[g,g,v,g,v,v,g,g,v,v,g,v],M=6,w=6,C=3,x=2,S=1,L=new Float32Array(C*w*M),b=new Float32Array(x*w*M),N=new Float32Array(S*w*M);for(let k=0;k<M;k++){const U=k%3*2/3-1,X=k>2?0:-1,ae=[U,X,0,U+2/3,X,0,U+2/3,X+1,0,U,X,0,U+2/3,X+1,0,U,X+1,0];L.set(ae,C*w*k),b.set(y,x*w*k);const A=[k,k,k,k,k,k];N.set(A,S*w*k)}const $=new Gn;$.setAttribute("position",new Un(L,C)),$.setAttribute("uv",new Un(b,x)),$.setAttribute("faceIndex",new Un(N,S)),e.push($),o>Vs&&o--}return{lodPlanes:e,sizeLods:n,sigmas:s}}function Mm(r,e,n){const s=new es(r,e,n);return s.texture.mapping=Vl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function El(r,e,n,s,o){r.viewport.set(e,n,s,o),r.scissor.set(e,n,s,o)}function qS(r,e,n){const s=new Float32Array($r),o=new Q(0,1,0);return new Tr({name:"SphericalGaussianBlur",defines:{n:$r,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:dh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function Em(){return new Tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function wm(){return new Tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function dh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function $S(r){let e=new WeakMap,n=null;function s(u){if(u&&u.isTexture){const f=u.mapping,p=f===yd||f===Sd,g=f===$s||f===Ks;if(p||g){let v=e.get(u);const y=v!==void 0?v.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==y)return n===null&&(n=new Sm(r)),v=p?n.fromEquirectangular(u,v):n.fromCubemap(u,v),v.texture.pmremVersion=u.pmremVersion,e.set(u,v),v.texture;if(v!==void 0)return v.texture;{const M=u.image;return p&&M&&M.height>0||g&&M&&o(M)?(n===null&&(n=new Sm(r)),v=p?n.fromEquirectangular(u):n.fromCubemap(u),v.texture.pmremVersion=u.pmremVersion,e.set(u,v),u.addEventListener("dispose",l),v.texture):null}}}return u}function o(u){let f=0;const p=6;for(let g=0;g<p;g++)u[g]!==void 0&&f++;return f===p}function l(u){const f=u.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function KS(r){const e={};function n(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return n(s)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(s){const o=n(s);return o===null&&Il("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function ZS(r,e,n,s){const o={},l=new WeakMap;function d(v){const y=v.target;y.index!==null&&e.remove(y.index);for(const w in y.attributes)e.remove(y.attributes[w]);for(const w in y.morphAttributes){const C=y.morphAttributes[w];for(let x=0,S=C.length;x<S;x++)e.remove(C[x])}y.removeEventListener("dispose",d),delete o[y.id];const M=l.get(y);M&&(e.remove(M),l.delete(y)),s.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,n.memory.geometries--}function u(v,y){return o[y.id]===!0||(y.addEventListener("dispose",d),o[y.id]=!0,n.memory.geometries++),y}function f(v){const y=v.attributes;for(const w in y)e.update(y[w],r.ARRAY_BUFFER);const M=v.morphAttributes;for(const w in M){const C=M[w];for(let x=0,S=C.length;x<S;x++)e.update(C[x],r.ARRAY_BUFFER)}}function p(v){const y=[],M=v.index,w=v.attributes.position;let C=0;if(M!==null){const L=M.array;C=M.version;for(let b=0,N=L.length;b<N;b+=3){const $=L[b+0],k=L[b+1],U=L[b+2];y.push($,k,k,U,U,$)}}else if(w!==void 0){const L=w.array;C=w.version;for(let b=0,N=L.length/3-1;b<N;b+=3){const $=b+0,k=b+1,U=b+2;y.push($,k,k,U,U,$)}}else return;const x=new(gg(y)?Mg:Sg)(y,1);x.version=C;const S=l.get(v);S&&e.remove(S),l.set(v,x)}function g(v){const y=l.get(v);if(y){const M=v.index;M!==null&&y.version<M.version&&p(v)}else p(v);return l.get(v)}return{get:u,update:f,getWireframeAttribute:g}}function QS(r,e,n){let s;function o(y){s=y}let l,d;function u(y){l=y.type,d=y.bytesPerElement}function f(y,M){r.drawElements(s,M,l,y*d),n.update(M,s,1)}function p(y,M,w){w!==0&&(r.drawElementsInstanced(s,M,l,y*d,w),n.update(M,s,w))}function g(y,M,w){if(w===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,M,0,l,y,0,w);let x=0;for(let S=0;S<w;S++)x+=M[S];n.update(x,s,1)}function v(y,M,w,C){if(w===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let S=0;S<y.length;S++)p(y[S]/d,M[S],C[S]);else{x.multiDrawElementsInstancedWEBGL(s,M,0,l,y,0,C,0,w);let S=0;for(let L=0;L<w;L++)S+=M[L];for(let L=0;L<C.length;L++)n.update(S,s,C[L])}}this.setMode=o,this.setIndex=u,this.render=f,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=v}function JS(r){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,d,u){switch(n.calls++,d){case r.TRIANGLES:n.triangles+=u*(l/3);break;case r.LINES:n.lines+=u*(l/2);break;case r.LINE_STRIP:n.lines+=u*(l-1);break;case r.LINE_LOOP:n.lines+=u*l;break;case r.POINTS:n.points+=u*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function o(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:o,update:s}}function eM(r,e,n){const s=new WeakMap,o=new Wt;function l(d,u,f){const p=d.morphTargetInfluences,g=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,v=g!==void 0?g.length:0;let y=s.get(u);if(y===void 0||y.count!==v){let A=function(){X.dispose(),s.delete(u),u.removeEventListener("dispose",A)};var M=A;y!==void 0&&y.texture.dispose();const w=u.morphAttributes.position!==void 0,C=u.morphAttributes.normal!==void 0,x=u.morphAttributes.color!==void 0,S=u.morphAttributes.position||[],L=u.morphAttributes.normal||[],b=u.morphAttributes.color||[];let N=0;w===!0&&(N=1),C===!0&&(N=2),x===!0&&(N=3);let $=u.attributes.position.count*N,k=1;$>e.maxTextureSize&&(k=Math.ceil($/e.maxTextureSize),$=e.maxTextureSize);const U=new Float32Array($*k*4*v),X=new vg(U,$,k,v);X.type=ji,X.needsUpdate=!0;const ae=N*4;for(let E=0;E<v;E++){const V=S[E],Y=L[E],se=b[E],K=$*k*4*E;for(let q=0;q<V.count;q++){const ue=q*ae;w===!0&&(o.fromBufferAttribute(V,q),U[K+ue+0]=o.x,U[K+ue+1]=o.y,U[K+ue+2]=o.z,U[K+ue+3]=0),C===!0&&(o.fromBufferAttribute(Y,q),U[K+ue+4]=o.x,U[K+ue+5]=o.y,U[K+ue+6]=o.z,U[K+ue+7]=0),x===!0&&(o.fromBufferAttribute(se,q),U[K+ue+8]=o.x,U[K+ue+9]=o.y,U[K+ue+10]=o.z,U[K+ue+11]=se.itemSize===4?o.w:1)}}y={count:v,texture:X,size:new ut($,k)},s.set(u,y),u.addEventListener("dispose",A)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)f.getUniforms().setValue(r,"morphTexture",d.morphTexture,n);else{let w=0;for(let x=0;x<p.length;x++)w+=p[x];const C=u.morphTargetsRelative?1:1-w;f.getUniforms().setValue(r,"morphTargetBaseInfluence",C),f.getUniforms().setValue(r,"morphTargetInfluences",p)}f.getUniforms().setValue(r,"morphTargetsTexture",y.texture,n),f.getUniforms().setValue(r,"morphTargetsTextureSize",y.size)}return{update:l}}function tM(r,e,n,s){let o=new WeakMap;function l(f){const p=s.render.frame,g=f.geometry,v=e.get(f,g);if(o.get(v)!==p&&(e.update(v),o.set(v,p)),f.isInstancedMesh&&(f.hasEventListener("dispose",u)===!1&&f.addEventListener("dispose",u),o.get(f)!==p&&(n.update(f.instanceMatrix,r.ARRAY_BUFFER),f.instanceColor!==null&&n.update(f.instanceColor,r.ARRAY_BUFFER),o.set(f,p))),f.isSkinnedMesh){const y=f.skeleton;o.get(y)!==p&&(y.update(),o.set(y,p))}return v}function d(){o=new WeakMap}function u(f){const p=f.target;p.removeEventListener("dispose",u),n.remove(p.instanceMatrix),p.instanceColor!==null&&n.remove(p.instanceColor)}return{update:l,dispose:d}}class Rg extends In{constructor(e,n,s,o,l,d,u,f,p,g=Xs){if(g!==Xs&&g!==Qs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Xs&&(s=Jr),s===void 0&&g===Qs&&(s=Zs),super(null,o,l,d,u,f,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=u!==void 0?u:ei,this.minFilter=f!==void 0?f:ei,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const bg=new In,Tm=new Rg(1,1),Pg=new vg,Ng=new H0,Lg=new Tg,Am=[],Cm=[],Rm=new Float32Array(16),bm=new Float32Array(9),Pm=new Float32Array(4);function ta(r,e,n){const s=r[0];if(s<=0||s>0)return r;const o=e*n;let l=Am[o];if(l===void 0&&(l=new Float32Array(o),Am[o]=l),e!==0){s.toArray(l,0);for(let d=1,u=0;d!==e;++d)u+=n,r[d].toArray(l,u)}return l}function Jt(r,e){if(r.length!==e.length)return!1;for(let n=0,s=r.length;n<s;n++)if(r[n]!==e[n])return!1;return!0}function en(r,e){for(let n=0,s=e.length;n<s;n++)r[n]=e[n]}function Xl(r,e){let n=Cm[e];n===void 0&&(n=new Int32Array(e),Cm[e]=n);for(let s=0;s!==e;++s)n[s]=r.allocateTextureUnit();return n}function nM(r,e){const n=this.cache;n[0]!==e&&(r.uniform1f(this.addr,e),n[0]=e)}function iM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jt(n,e))return;r.uniform2fv(this.addr,e),en(n,e)}}function rM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Jt(n,e))return;r.uniform3fv(this.addr,e),en(n,e)}}function sM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jt(n,e))return;r.uniform4fv(this.addr,e),en(n,e)}}function aM(r,e){const n=this.cache,s=e.elements;if(s===void 0){if(Jt(n,e))return;r.uniformMatrix2fv(this.addr,!1,e),en(n,e)}else{if(Jt(n,s))return;Pm.set(s),r.uniformMatrix2fv(this.addr,!1,Pm),en(n,s)}}function oM(r,e){const n=this.cache,s=e.elements;if(s===void 0){if(Jt(n,e))return;r.uniformMatrix3fv(this.addr,!1,e),en(n,e)}else{if(Jt(n,s))return;bm.set(s),r.uniformMatrix3fv(this.addr,!1,bm),en(n,s)}}function lM(r,e){const n=this.cache,s=e.elements;if(s===void 0){if(Jt(n,e))return;r.uniformMatrix4fv(this.addr,!1,e),en(n,e)}else{if(Jt(n,s))return;Rm.set(s),r.uniformMatrix4fv(this.addr,!1,Rm),en(n,s)}}function cM(r,e){const n=this.cache;n[0]!==e&&(r.uniform1i(this.addr,e),n[0]=e)}function uM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jt(n,e))return;r.uniform2iv(this.addr,e),en(n,e)}}function dM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Jt(n,e))return;r.uniform3iv(this.addr,e),en(n,e)}}function hM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jt(n,e))return;r.uniform4iv(this.addr,e),en(n,e)}}function fM(r,e){const n=this.cache;n[0]!==e&&(r.uniform1ui(this.addr,e),n[0]=e)}function pM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jt(n,e))return;r.uniform2uiv(this.addr,e),en(n,e)}}function mM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Jt(n,e))return;r.uniform3uiv(this.addr,e),en(n,e)}}function gM(r,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jt(n,e))return;r.uniform4uiv(this.addr,e),en(n,e)}}function _M(r,e,n){const s=this.cache,o=n.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);let l;this.type===r.SAMPLER_2D_SHADOW?(Tm.compareFunction=mg,l=Tm):l=bg,n.setTexture2D(e||l,o)}function vM(r,e,n){const s=this.cache,o=n.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),n.setTexture3D(e||Ng,o)}function xM(r,e,n){const s=this.cache,o=n.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),n.setTextureCube(e||Lg,o)}function yM(r,e,n){const s=this.cache,o=n.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),n.setTexture2DArray(e||Pg,o)}function SM(r){switch(r){case 5126:return nM;case 35664:return iM;case 35665:return rM;case 35666:return sM;case 35674:return aM;case 35675:return oM;case 35676:return lM;case 5124:case 35670:return cM;case 35667:case 35671:return uM;case 35668:case 35672:return dM;case 35669:case 35673:return hM;case 5125:return fM;case 36294:return pM;case 36295:return mM;case 36296:return gM;case 35678:case 36198:case 36298:case 36306:case 35682:return _M;case 35679:case 36299:case 36307:return vM;case 35680:case 36300:case 36308:case 36293:return xM;case 36289:case 36303:case 36311:case 36292:return yM}}function MM(r,e){r.uniform1fv(this.addr,e)}function EM(r,e){const n=ta(e,this.size,2);r.uniform2fv(this.addr,n)}function wM(r,e){const n=ta(e,this.size,3);r.uniform3fv(this.addr,n)}function TM(r,e){const n=ta(e,this.size,4);r.uniform4fv(this.addr,n)}function AM(r,e){const n=ta(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,n)}function CM(r,e){const n=ta(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,n)}function RM(r,e){const n=ta(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,n)}function bM(r,e){r.uniform1iv(this.addr,e)}function PM(r,e){r.uniform2iv(this.addr,e)}function NM(r,e){r.uniform3iv(this.addr,e)}function LM(r,e){r.uniform4iv(this.addr,e)}function DM(r,e){r.uniform1uiv(this.addr,e)}function IM(r,e){r.uniform2uiv(this.addr,e)}function UM(r,e){r.uniform3uiv(this.addr,e)}function FM(r,e){r.uniform4uiv(this.addr,e)}function OM(r,e,n){const s=this.cache,o=e.length,l=Xl(n,o);Jt(s,l)||(r.uniform1iv(this.addr,l),en(s,l));for(let d=0;d!==o;++d)n.setTexture2D(e[d]||bg,l[d])}function kM(r,e,n){const s=this.cache,o=e.length,l=Xl(n,o);Jt(s,l)||(r.uniform1iv(this.addr,l),en(s,l));for(let d=0;d!==o;++d)n.setTexture3D(e[d]||Ng,l[d])}function zM(r,e,n){const s=this.cache,o=e.length,l=Xl(n,o);Jt(s,l)||(r.uniform1iv(this.addr,l),en(s,l));for(let d=0;d!==o;++d)n.setTextureCube(e[d]||Lg,l[d])}function BM(r,e,n){const s=this.cache,o=e.length,l=Xl(n,o);Jt(s,l)||(r.uniform1iv(this.addr,l),en(s,l));for(let d=0;d!==o;++d)n.setTexture2DArray(e[d]||Pg,l[d])}function HM(r){switch(r){case 5126:return MM;case 35664:return EM;case 35665:return wM;case 35666:return TM;case 35674:return AM;case 35675:return CM;case 35676:return RM;case 5124:case 35670:return bM;case 35667:case 35671:return PM;case 35668:case 35672:return NM;case 35669:case 35673:return LM;case 5125:return DM;case 36294:return IM;case 36295:return UM;case 36296:return FM;case 35678:case 36198:case 36298:case 36306:case 35682:return OM;case 35679:case 36299:case 36307:return kM;case 35680:case 36300:case 36308:case 36293:return zM;case 36289:case 36303:case 36311:case 36292:return BM}}class jM{constructor(e,n,s){this.id=e,this.addr=s,this.cache=[],this.type=n.type,this.setValue=SM(n.type)}}class VM{constructor(e,n,s){this.id=e,this.addr=s,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=HM(n.type)}}class GM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,s){const o=this.seq;for(let l=0,d=o.length;l!==d;++l){const u=o[l];u.setValue(e,n[u.id],s)}}}const rd=/(\w+)(\])?(\[|\.)?/g;function Nm(r,e){r.seq.push(e),r.map[e.id]=e}function WM(r,e,n){const s=r.name,o=s.length;for(rd.lastIndex=0;;){const l=rd.exec(s),d=rd.lastIndex;let u=l[1];const f=l[2]==="]",p=l[3];if(f&&(u=u|0),p===void 0||p==="["&&d+2===o){Nm(n,p===void 0?new jM(u,r,e):new VM(u,r,e));break}else{let v=n.map[u];v===void 0&&(v=new GM(u),Nm(n,v)),n=v}}}class Ul{constructor(e,n){this.seq=[],this.map={};const s=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(n,o),d=e.getUniformLocation(n,l.name);WM(l,d,this)}}setValue(e,n,s,o){const l=this.map[n];l!==void 0&&l.setValue(e,s,o)}setOptional(e,n,s){const o=n[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,n,s,o){for(let l=0,d=n.length;l!==d;++l){const u=n[l],f=s[u.id];f.needsUpdate!==!1&&u.setValue(e,f.value,o)}}static seqWithValue(e,n){const s=[];for(let o=0,l=e.length;o!==l;++o){const d=e[o];d.id in n&&s.push(d)}return s}}function Lm(r,e,n){const s=r.createShader(e);return r.shaderSource(s,n),r.compileShader(s),s}const XM=37297;let YM=0;function qM(r,e){const n=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,n.length);for(let d=o;d<l;d++){const u=d+1;s.push(`${u===e?">":" "} ${u}: ${n[d]}`)}return s.join(`
`)}function $M(r){const e=Rt.getPrimaries(Rt.workingColorSpace),n=Rt.getPrimaries(r);let s;switch(e===n?s="":e===kl&&n===Ol?s="LinearDisplayP3ToLinearSRGB":e===Ol&&n===kl&&(s="LinearSRGBToLinearDisplayP3"),r){case Ar:case Gl:return[s,"LinearTransferOETF"];case hi:case oh:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function Dm(r,e,n){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const d=parseInt(l[1]);return n.toUpperCase()+`

`+o+`

`+qM(r.getShaderSource(e),d)}else return o}function KM(r,e){const n=$M(e);return`vec4 ${r}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function ZM(r,e){let n;switch(e){case h0:n="Linear";break;case f0:n="Reinhard";break;case p0:n="Cineon";break;case m0:n="ACESFilmic";break;case _0:n="AgX";break;case v0:n="Neutral";break;case g0:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+r+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const wl=new Q;function QM(){Rt.getLuminanceCoefficients(wl);const r=wl.x.toFixed(4),e=wl.y.toFixed(4),n=wl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function JM(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Wa).join(`
`)}function eE(r){const e=[];for(const n in r){const s=r[n];s!==!1&&e.push("#define "+n+" "+s)}return e.join(`
`)}function tE(r,e){const n={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),d=l.name;let u=1;l.type===r.FLOAT_MAT2&&(u=2),l.type===r.FLOAT_MAT3&&(u=3),l.type===r.FLOAT_MAT4&&(u=4),n[d]={type:l.type,location:r.getAttribLocation(e,d),locationSize:u}}return n}function Wa(r){return r!==""}function Im(r,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Um(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const nE=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zd(r){return r.replace(nE,rE)}const iE=new Map;function rE(r,e){let n=dt[e];if(n===void 0){const s=iE.get(e);if(s!==void 0)n=dt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Zd(n)}const sE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fm(r){return r.replace(sE,aE)}function aE(r,e,n,s){let o="";for(let l=parseInt(e);l<parseInt(n);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function Om(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function oE(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===tg?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Wv?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Hi&&(e="SHADOWMAP_TYPE_VSM"),e}function lE(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case $s:case Ks:e="ENVMAP_TYPE_CUBE";break;case Vl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function cE(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ks:e="ENVMAP_MODE_REFRACTION";break}return e}function uE(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case ng:e="ENVMAP_BLENDING_MULTIPLY";break;case u0:e="ENVMAP_BLENDING_MIX";break;case d0:e="ENVMAP_BLENDING_ADD";break}return e}function dE(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:s,maxMip:n}}function hE(r,e,n,s){const o=r.getContext(),l=n.defines;let d=n.vertexShader,u=n.fragmentShader;const f=oE(n),p=lE(n),g=cE(n),v=uE(n),y=dE(n),M=JM(n),w=eE(l),C=o.createProgram();let x,S,L=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(x=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,w].filter(Wa).join(`
`),x.length>0&&(x+=`
`),S=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,w].filter(Wa).join(`
`),S.length>0&&(S+=`
`)):(x=[Om(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,w,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+g:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+f:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wa).join(`
`),S=[Om(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,w,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+p:"",n.envMap?"#define "+g:"",n.envMap?"#define "+v:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+f:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Mr?"#define TONE_MAPPING":"",n.toneMapping!==Mr?dt.tonemapping_pars_fragment:"",n.toneMapping!==Mr?ZM("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,KM("linearToOutputTexel",n.outputColorSpace),QM(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Wa).join(`
`)),d=Zd(d),d=Im(d,n),d=Um(d,n),u=Zd(u),u=Im(u,n),u=Um(u,n),d=Fm(d),u=Fm(u),n.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,x=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,S=["#define varying in",n.glslVersion===em?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===em?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const b=L+x+d,N=L+S+u,$=Lm(o,o.VERTEX_SHADER,b),k=Lm(o,o.FRAGMENT_SHADER,N);o.attachShader(C,$),o.attachShader(C,k),n.index0AttributeName!==void 0?o.bindAttribLocation(C,0,n.index0AttributeName):n.morphTargets===!0&&o.bindAttribLocation(C,0,"position"),o.linkProgram(C);function U(E){if(r.debug.checkShaderErrors){const V=o.getProgramInfoLog(C).trim(),Y=o.getShaderInfoLog($).trim(),se=o.getShaderInfoLog(k).trim();let K=!0,q=!0;if(o.getProgramParameter(C,o.LINK_STATUS)===!1)if(K=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,C,$,k);else{const ue=Dm(o,$,"vertex"),z=Dm(o,k,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(C,o.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+V+`
`+ue+`
`+z)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(Y===""||se==="")&&(q=!1);q&&(E.diagnostics={runnable:K,programLog:V,vertexShader:{log:Y,prefix:x},fragmentShader:{log:se,prefix:S}})}o.deleteShader($),o.deleteShader(k),X=new Ul(o,C),ae=tE(o,C)}let X;this.getUniforms=function(){return X===void 0&&U(this),X};let ae;this.getAttributes=function(){return ae===void 0&&U(this),ae};let A=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=o.getProgramParameter(C,XM)),A},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(C),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=YM++,this.cacheKey=e,this.usedTimes=1,this.program=C,this.vertexShader=$,this.fragmentShader=k,this}let fE=0;class pE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(n),l=this._getShaderStage(s),d=this._getShaderCacheForMaterial(e);return d.has(o)===!1&&(d.add(o),o.usedTimes++),d.has(l)===!1&&(d.add(l),l.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const s of n)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let s=n.get(e);return s===void 0&&(s=new Set,n.set(e,s)),s}_getShaderStage(e){const n=this.shaderCache;let s=n.get(e);return s===void 0&&(s=new mE(e),n.set(e,s)),s}}class mE{constructor(e){this.id=fE++,this.code=e,this.usedTimes=0}}function gE(r,e,n,s,o,l,d){const u=new xg,f=new pE,p=new Set,g=[],v=o.logarithmicDepthBuffer,y=o.reverseDepthBuffer,M=o.vertexTextures;let w=o.precision;const C={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(A){return p.add(A),A===0?"uv":`uv${A}`}function S(A,E,V,Y,se){const K=Y.fog,q=se.geometry,ue=A.isMeshStandardMaterial?Y.environment:null,z=(A.isMeshStandardMaterial?n:e).get(A.envMap||ue),he=z&&z.mapping===Vl?z.image.height:null,le=C[A.type];A.precision!==null&&(w=o.getMaxPrecision(A.precision),w!==A.precision&&console.warn("THREE.WebGLProgram.getParameters:",A.precision,"not supported, using",w,"instead."));const F=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,oe=F!==void 0?F.length:0;let Ne=0;q.morphAttributes.position!==void 0&&(Ne=1),q.morphAttributes.normal!==void 0&&(Ne=2),q.morphAttributes.color!==void 0&&(Ne=3);let ee,de,xe,Se;if(le){const tn=Mi[le];ee=tn.vertexShader,de=tn.fragmentShader}else ee=A.vertexShader,de=A.fragmentShader,f.update(A),xe=f.getVertexShaderID(A),Se=f.getFragmentShaderID(A);const Ae=r.getRenderTarget(),Pe=se.isInstancedMesh===!0,je=se.isBatchedMesh===!0,Ke=!!A.map,$e=!!A.matcap,O=!!z,Tt=!!A.aoMap,lt=!!A.lightMap,pt=!!A.bumpMap,Ze=!!A.normalMap,At=!!A.displacementMap,Je=!!A.emissiveMap,D=!!A.metalnessMap,R=!!A.roughnessMap,te=A.anisotropy>0,pe=A.clearcoat>0,ve=A.dispersion>0,fe=A.iridescence>0,Ye=A.sheen>0,Ce=A.transmission>0,Fe=te&&!!A.anisotropyMap,vt=pe&&!!A.clearcoatMap,Me=pe&&!!A.clearcoatNormalMap,Oe=pe&&!!A.clearcoatRoughnessMap,st=fe&&!!A.iridescenceMap,rt=fe&&!!A.iridescenceThicknessMap,ze=Ye&&!!A.sheenColorMap,gt=Ye&&!!A.sheenRoughnessMap,ot=!!A.specularMap,Ct=!!A.specularColorMap,j=!!A.specularIntensityMap,Le=Ce&&!!A.transmissionMap,ce=Ce&&!!A.thicknessMap,me=!!A.gradientMap,Re=!!A.alphaMap,Ie=A.alphaTest>0,_t=!!A.alphaHash,Ht=!!A.extensions;let cn=Mr;A.toneMapped&&(Ae===null||Ae.isXRRenderTarget===!0)&&(cn=r.toneMapping);const xt={shaderID:le,shaderType:A.type,shaderName:A.name,vertexShader:ee,fragmentShader:de,defines:A.defines,customVertexShaderID:xe,customFragmentShaderID:Se,isRawShaderMaterial:A.isRawShaderMaterial===!0,glslVersion:A.glslVersion,precision:w,batching:je,batchingColor:je&&se._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&se.instanceColor!==null,instancingMorph:Pe&&se.morphTexture!==null,supportsVertexTextures:M,outputColorSpace:Ae===null?r.outputColorSpace:Ae.isXRRenderTarget===!0?Ae.texture.colorSpace:Ar,alphaToCoverage:!!A.alphaToCoverage,map:Ke,matcap:$e,envMap:O,envMapMode:O&&z.mapping,envMapCubeUVHeight:he,aoMap:Tt,lightMap:lt,bumpMap:pt,normalMap:Ze,displacementMap:M&&At,emissiveMap:Je,normalMapObjectSpace:Ze&&A.normalMapType===M0,normalMapTangentSpace:Ze&&A.normalMapType===pg,metalnessMap:D,roughnessMap:R,anisotropy:te,anisotropyMap:Fe,clearcoat:pe,clearcoatMap:vt,clearcoatNormalMap:Me,clearcoatRoughnessMap:Oe,dispersion:ve,iridescence:fe,iridescenceMap:st,iridescenceThicknessMap:rt,sheen:Ye,sheenColorMap:ze,sheenRoughnessMap:gt,specularMap:ot,specularColorMap:Ct,specularIntensityMap:j,transmission:Ce,transmissionMap:Le,thicknessMap:ce,gradientMap:me,opaque:A.transparent===!1&&A.blending===Ws&&A.alphaToCoverage===!1,alphaMap:Re,alphaTest:Ie,alphaHash:_t,combine:A.combine,mapUv:Ke&&x(A.map.channel),aoMapUv:Tt&&x(A.aoMap.channel),lightMapUv:lt&&x(A.lightMap.channel),bumpMapUv:pt&&x(A.bumpMap.channel),normalMapUv:Ze&&x(A.normalMap.channel),displacementMapUv:At&&x(A.displacementMap.channel),emissiveMapUv:Je&&x(A.emissiveMap.channel),metalnessMapUv:D&&x(A.metalnessMap.channel),roughnessMapUv:R&&x(A.roughnessMap.channel),anisotropyMapUv:Fe&&x(A.anisotropyMap.channel),clearcoatMapUv:vt&&x(A.clearcoatMap.channel),clearcoatNormalMapUv:Me&&x(A.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Oe&&x(A.clearcoatRoughnessMap.channel),iridescenceMapUv:st&&x(A.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&x(A.iridescenceThicknessMap.channel),sheenColorMapUv:ze&&x(A.sheenColorMap.channel),sheenRoughnessMapUv:gt&&x(A.sheenRoughnessMap.channel),specularMapUv:ot&&x(A.specularMap.channel),specularColorMapUv:Ct&&x(A.specularColorMap.channel),specularIntensityMapUv:j&&x(A.specularIntensityMap.channel),transmissionMapUv:Le&&x(A.transmissionMap.channel),thicknessMapUv:ce&&x(A.thicknessMap.channel),alphaMapUv:Re&&x(A.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ze||te),vertexColors:A.vertexColors,vertexAlphas:A.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:se.isPoints===!0&&!!q.attributes.uv&&(Ke||Re),fog:!!K,useFog:A.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:A.flatShading===!0,sizeAttenuation:A.sizeAttenuation===!0,logarithmicDepthBuffer:v,reverseDepthBuffer:y,skinning:se.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:Ne,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:A.dithering,shadowMapEnabled:r.shadowMap.enabled&&V.length>0,shadowMapType:r.shadowMap.type,toneMapping:cn,decodeVideoTexture:Ke&&A.map.isVideoTexture===!0&&Rt.getTransfer(A.map.colorSpace)===kt,premultipliedAlpha:A.premultipliedAlpha,doubleSided:A.side===Ei,flipSided:A.side===Dn,useDepthPacking:A.depthPacking>=0,depthPacking:A.depthPacking||0,index0AttributeName:A.index0AttributeName,extensionClipCullDistance:Ht&&A.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&A.extensions.multiDraw===!0||je)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:A.customProgramCacheKey()};return xt.vertexUv1s=p.has(1),xt.vertexUv2s=p.has(2),xt.vertexUv3s=p.has(3),p.clear(),xt}function L(A){const E=[];if(A.shaderID?E.push(A.shaderID):(E.push(A.customVertexShaderID),E.push(A.customFragmentShaderID)),A.defines!==void 0)for(const V in A.defines)E.push(V),E.push(A.defines[V]);return A.isRawShaderMaterial===!1&&(b(E,A),N(E,A),E.push(r.outputColorSpace)),E.push(A.customProgramCacheKey),E.join()}function b(A,E){A.push(E.precision),A.push(E.outputColorSpace),A.push(E.envMapMode),A.push(E.envMapCubeUVHeight),A.push(E.mapUv),A.push(E.alphaMapUv),A.push(E.lightMapUv),A.push(E.aoMapUv),A.push(E.bumpMapUv),A.push(E.normalMapUv),A.push(E.displacementMapUv),A.push(E.emissiveMapUv),A.push(E.metalnessMapUv),A.push(E.roughnessMapUv),A.push(E.anisotropyMapUv),A.push(E.clearcoatMapUv),A.push(E.clearcoatNormalMapUv),A.push(E.clearcoatRoughnessMapUv),A.push(E.iridescenceMapUv),A.push(E.iridescenceThicknessMapUv),A.push(E.sheenColorMapUv),A.push(E.sheenRoughnessMapUv),A.push(E.specularMapUv),A.push(E.specularColorMapUv),A.push(E.specularIntensityMapUv),A.push(E.transmissionMapUv),A.push(E.thicknessMapUv),A.push(E.combine),A.push(E.fogExp2),A.push(E.sizeAttenuation),A.push(E.morphTargetsCount),A.push(E.morphAttributeCount),A.push(E.numDirLights),A.push(E.numPointLights),A.push(E.numSpotLights),A.push(E.numSpotLightMaps),A.push(E.numHemiLights),A.push(E.numRectAreaLights),A.push(E.numDirLightShadows),A.push(E.numPointLightShadows),A.push(E.numSpotLightShadows),A.push(E.numSpotLightShadowsWithMaps),A.push(E.numLightProbes),A.push(E.shadowMapType),A.push(E.toneMapping),A.push(E.numClippingPlanes),A.push(E.numClipIntersection),A.push(E.depthPacking)}function N(A,E){u.disableAll(),E.supportsVertexTextures&&u.enable(0),E.instancing&&u.enable(1),E.instancingColor&&u.enable(2),E.instancingMorph&&u.enable(3),E.matcap&&u.enable(4),E.envMap&&u.enable(5),E.normalMapObjectSpace&&u.enable(6),E.normalMapTangentSpace&&u.enable(7),E.clearcoat&&u.enable(8),E.iridescence&&u.enable(9),E.alphaTest&&u.enable(10),E.vertexColors&&u.enable(11),E.vertexAlphas&&u.enable(12),E.vertexUv1s&&u.enable(13),E.vertexUv2s&&u.enable(14),E.vertexUv3s&&u.enable(15),E.vertexTangents&&u.enable(16),E.anisotropy&&u.enable(17),E.alphaHash&&u.enable(18),E.batching&&u.enable(19),E.dispersion&&u.enable(20),E.batchingColor&&u.enable(21),A.push(u.mask),u.disableAll(),E.fog&&u.enable(0),E.useFog&&u.enable(1),E.flatShading&&u.enable(2),E.logarithmicDepthBuffer&&u.enable(3),E.reverseDepthBuffer&&u.enable(4),E.skinning&&u.enable(5),E.morphTargets&&u.enable(6),E.morphNormals&&u.enable(7),E.morphColors&&u.enable(8),E.premultipliedAlpha&&u.enable(9),E.shadowMapEnabled&&u.enable(10),E.doubleSided&&u.enable(11),E.flipSided&&u.enable(12),E.useDepthPacking&&u.enable(13),E.dithering&&u.enable(14),E.transmission&&u.enable(15),E.sheen&&u.enable(16),E.opaque&&u.enable(17),E.pointsUvs&&u.enable(18),E.decodeVideoTexture&&u.enable(19),E.alphaToCoverage&&u.enable(20),A.push(u.mask)}function $(A){const E=C[A.type];let V;if(E){const Y=Mi[E];V=J0.clone(Y.uniforms)}else V=A.uniforms;return V}function k(A,E){let V;for(let Y=0,se=g.length;Y<se;Y++){const K=g[Y];if(K.cacheKey===E){V=K,++V.usedTimes;break}}return V===void 0&&(V=new hE(r,E,A,l),g.push(V)),V}function U(A){if(--A.usedTimes===0){const E=g.indexOf(A);g[E]=g[g.length-1],g.pop(),A.destroy()}}function X(A){f.remove(A)}function ae(){f.dispose()}return{getParameters:S,getProgramCacheKey:L,getUniforms:$,acquireProgram:k,releaseProgram:U,releaseShaderCache:X,programs:g,dispose:ae}}function _E(){let r=new WeakMap;function e(d){return r.has(d)}function n(d){let u=r.get(d);return u===void 0&&(u={},r.set(d,u)),u}function s(d){r.delete(d)}function o(d,u,f){r.get(d)[u]=f}function l(){r=new WeakMap}return{has:e,get:n,remove:s,update:o,dispose:l}}function vE(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function km(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function zm(){const r=[];let e=0;const n=[],s=[],o=[];function l(){e=0,n.length=0,s.length=0,o.length=0}function d(v,y,M,w,C,x){let S=r[e];return S===void 0?(S={id:v.id,object:v,geometry:y,material:M,groupOrder:w,renderOrder:v.renderOrder,z:C,group:x},r[e]=S):(S.id=v.id,S.object=v,S.geometry=y,S.material=M,S.groupOrder=w,S.renderOrder=v.renderOrder,S.z=C,S.group=x),e++,S}function u(v,y,M,w,C,x){const S=d(v,y,M,w,C,x);M.transmission>0?s.push(S):M.transparent===!0?o.push(S):n.push(S)}function f(v,y,M,w,C,x){const S=d(v,y,M,w,C,x);M.transmission>0?s.unshift(S):M.transparent===!0?o.unshift(S):n.unshift(S)}function p(v,y){n.length>1&&n.sort(v||vE),s.length>1&&s.sort(y||km),o.length>1&&o.sort(y||km)}function g(){for(let v=e,y=r.length;v<y;v++){const M=r[v];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:n,transmissive:s,transparent:o,init:l,push:u,unshift:f,finish:g,sort:p}}function xE(){let r=new WeakMap;function e(s,o){const l=r.get(s);let d;return l===void 0?(d=new zm,r.set(s,[d])):o>=l.length?(d=new zm,l.push(d)):d=l[o],d}function n(){r=new WeakMap}return{get:e,dispose:n}}function yE(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new Q,color:new mt};break;case"SpotLight":n={position:new Q,direction:new Q,color:new mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new Q,color:new mt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new Q,skyColor:new mt,groundColor:new mt};break;case"RectAreaLight":n={color:new mt,position:new Q,halfWidth:new Q,halfHeight:new Q};break}return r[e.id]=n,n}}}function SE(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=n,n}}}let ME=0;function EE(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function wE(r){const e=new yE,n=SE(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new Q);const o=new Q,l=new Ut,d=new Ut;function u(p){let g=0,v=0,y=0;for(let ae=0;ae<9;ae++)s.probe[ae].set(0,0,0);let M=0,w=0,C=0,x=0,S=0,L=0,b=0,N=0,$=0,k=0,U=0;p.sort(EE);for(let ae=0,A=p.length;ae<A;ae++){const E=p[ae],V=E.color,Y=E.intensity,se=E.distance,K=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)g+=V.r*Y,v+=V.g*Y,y+=V.b*Y;else if(E.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(E.sh.coefficients[q],Y);U++}else if(E.isDirectionalLight){const q=e.get(E);if(q.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const ue=E.shadow,z=n.get(E);z.shadowIntensity=ue.intensity,z.shadowBias=ue.bias,z.shadowNormalBias=ue.normalBias,z.shadowRadius=ue.radius,z.shadowMapSize=ue.mapSize,s.directionalShadow[M]=z,s.directionalShadowMap[M]=K,s.directionalShadowMatrix[M]=E.shadow.matrix,L++}s.directional[M]=q,M++}else if(E.isSpotLight){const q=e.get(E);q.position.setFromMatrixPosition(E.matrixWorld),q.color.copy(V).multiplyScalar(Y),q.distance=se,q.coneCos=Math.cos(E.angle),q.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),q.decay=E.decay,s.spot[C]=q;const ue=E.shadow;if(E.map&&(s.spotLightMap[$]=E.map,$++,ue.updateMatrices(E),E.castShadow&&k++),s.spotLightMatrix[C]=ue.matrix,E.castShadow){const z=n.get(E);z.shadowIntensity=ue.intensity,z.shadowBias=ue.bias,z.shadowNormalBias=ue.normalBias,z.shadowRadius=ue.radius,z.shadowMapSize=ue.mapSize,s.spotShadow[C]=z,s.spotShadowMap[C]=K,N++}C++}else if(E.isRectAreaLight){const q=e.get(E);q.color.copy(V).multiplyScalar(Y),q.halfWidth.set(E.width*.5,0,0),q.halfHeight.set(0,E.height*.5,0),s.rectArea[x]=q,x++}else if(E.isPointLight){const q=e.get(E);if(q.color.copy(E.color).multiplyScalar(E.intensity),q.distance=E.distance,q.decay=E.decay,E.castShadow){const ue=E.shadow,z=n.get(E);z.shadowIntensity=ue.intensity,z.shadowBias=ue.bias,z.shadowNormalBias=ue.normalBias,z.shadowRadius=ue.radius,z.shadowMapSize=ue.mapSize,z.shadowCameraNear=ue.camera.near,z.shadowCameraFar=ue.camera.far,s.pointShadow[w]=z,s.pointShadowMap[w]=K,s.pointShadowMatrix[w]=E.shadow.matrix,b++}s.point[w]=q,w++}else if(E.isHemisphereLight){const q=e.get(E);q.skyColor.copy(E.color).multiplyScalar(Y),q.groundColor.copy(E.groundColor).multiplyScalar(Y),s.hemi[S]=q,S++}}x>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=be.LTC_FLOAT_1,s.rectAreaLTC2=be.LTC_FLOAT_2):(s.rectAreaLTC1=be.LTC_HALF_1,s.rectAreaLTC2=be.LTC_HALF_2)),s.ambient[0]=g,s.ambient[1]=v,s.ambient[2]=y;const X=s.hash;(X.directionalLength!==M||X.pointLength!==w||X.spotLength!==C||X.rectAreaLength!==x||X.hemiLength!==S||X.numDirectionalShadows!==L||X.numPointShadows!==b||X.numSpotShadows!==N||X.numSpotMaps!==$||X.numLightProbes!==U)&&(s.directional.length=M,s.spot.length=C,s.rectArea.length=x,s.point.length=w,s.hemi.length=S,s.directionalShadow.length=L,s.directionalShadowMap.length=L,s.pointShadow.length=b,s.pointShadowMap.length=b,s.spotShadow.length=N,s.spotShadowMap.length=N,s.directionalShadowMatrix.length=L,s.pointShadowMatrix.length=b,s.spotLightMatrix.length=N+$-k,s.spotLightMap.length=$,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=U,X.directionalLength=M,X.pointLength=w,X.spotLength=C,X.rectAreaLength=x,X.hemiLength=S,X.numDirectionalShadows=L,X.numPointShadows=b,X.numSpotShadows=N,X.numSpotMaps=$,X.numLightProbes=U,s.version=ME++)}function f(p,g){let v=0,y=0,M=0,w=0,C=0;const x=g.matrixWorldInverse;for(let S=0,L=p.length;S<L;S++){const b=p[S];if(b.isDirectionalLight){const N=s.directional[v];N.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),N.direction.sub(o),N.direction.transformDirection(x),v++}else if(b.isSpotLight){const N=s.spot[M];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(x),N.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),N.direction.sub(o),N.direction.transformDirection(x),M++}else if(b.isRectAreaLight){const N=s.rectArea[w];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(x),d.identity(),l.copy(b.matrixWorld),l.premultiply(x),d.extractRotation(l),N.halfWidth.set(b.width*.5,0,0),N.halfHeight.set(0,b.height*.5,0),N.halfWidth.applyMatrix4(d),N.halfHeight.applyMatrix4(d),w++}else if(b.isPointLight){const N=s.point[y];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(x),y++}else if(b.isHemisphereLight){const N=s.hemi[C];N.direction.setFromMatrixPosition(b.matrixWorld),N.direction.transformDirection(x),C++}}}return{setup:u,setupView:f,state:s}}function Bm(r){const e=new wE(r),n=[],s=[];function o(g){p.camera=g,n.length=0,s.length=0}function l(g){n.push(g)}function d(g){s.push(g)}function u(){e.setup(n)}function f(g){e.setupView(n,g)}const p={lightsArray:n,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:u,setupLightsView:f,pushLight:l,pushShadow:d}}function TE(r){let e=new WeakMap;function n(o,l=0){const d=e.get(o);let u;return d===void 0?(u=new Bm(r),e.set(o,[u])):l>=d.length?(u=new Bm(r),d.push(u)):u=d[l],u}function s(){e=new WeakMap}return{get:n,dispose:s}}class AE extends ea{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=y0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class CE extends ea{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const RE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function PE(r,e,n){let s=new uh;const o=new ut,l=new ut,d=new Wt,u=new AE({depthPacking:S0}),f=new CE,p={},g=n.maxTextureSize,v={[Er]:Dn,[Dn]:Er,[Ei]:Ei},y=new Tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:RE,fragmentShader:bE}),M=y.clone();M.defines.HORIZONTAL_PASS=1;const w=new Gn;w.setAttribute("position",new Un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new ti(w,y),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tg;let S=this.type;this.render=function(k,U,X){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||k.length===0)return;const ae=r.getRenderTarget(),A=r.getActiveCubeFace(),E=r.getActiveMipmapLevel(),V=r.state;V.setBlending(Sr),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const Y=S!==Hi&&this.type===Hi,se=S===Hi&&this.type!==Hi;for(let K=0,q=k.length;K<q;K++){const ue=k[K],z=ue.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",ue,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;o.copy(z.mapSize);const he=z.getFrameExtents();if(o.multiply(he),l.copy(z.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/he.x),o.x=l.x*he.x,z.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/he.y),o.y=l.y*he.y,z.mapSize.y=l.y)),z.map===null||Y===!0||se===!0){const F=this.type!==Hi?{minFilter:ei,magFilter:ei}:{};z.map!==null&&z.map.dispose(),z.map=new es(o.x,o.y,F),z.map.texture.name=ue.name+".shadowMap",z.camera.updateProjectionMatrix()}r.setRenderTarget(z.map),r.clear();const le=z.getViewportCount();for(let F=0;F<le;F++){const oe=z.getViewport(F);d.set(l.x*oe.x,l.y*oe.y,l.x*oe.z,l.y*oe.w),V.viewport(d),z.updateMatrices(ue,F),s=z.getFrustum(),N(U,X,z.camera,ue,this.type)}z.isPointLightShadow!==!0&&this.type===Hi&&L(z,X),z.needsUpdate=!1}S=this.type,x.needsUpdate=!1,r.setRenderTarget(ae,A,E)};function L(k,U){const X=e.update(C);y.defines.VSM_SAMPLES!==k.blurSamples&&(y.defines.VSM_SAMPLES=k.blurSamples,M.defines.VSM_SAMPLES=k.blurSamples,y.needsUpdate=!0,M.needsUpdate=!0),k.mapPass===null&&(k.mapPass=new es(o.x,o.y)),y.uniforms.shadow_pass.value=k.map.texture,y.uniforms.resolution.value=k.mapSize,y.uniforms.radius.value=k.radius,r.setRenderTarget(k.mapPass),r.clear(),r.renderBufferDirect(U,null,X,y,C,null),M.uniforms.shadow_pass.value=k.mapPass.texture,M.uniforms.resolution.value=k.mapSize,M.uniforms.radius.value=k.radius,r.setRenderTarget(k.map),r.clear(),r.renderBufferDirect(U,null,X,M,C,null)}function b(k,U,X,ae){let A=null;const E=X.isPointLight===!0?k.customDistanceMaterial:k.customDepthMaterial;if(E!==void 0)A=E;else if(A=X.isPointLight===!0?f:u,r.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0){const V=A.uuid,Y=U.uuid;let se=p[V];se===void 0&&(se={},p[V]=se);let K=se[Y];K===void 0&&(K=A.clone(),se[Y]=K,U.addEventListener("dispose",$)),A=K}if(A.visible=U.visible,A.wireframe=U.wireframe,ae===Hi?A.side=U.shadowSide!==null?U.shadowSide:U.side:A.side=U.shadowSide!==null?U.shadowSide:v[U.side],A.alphaMap=U.alphaMap,A.alphaTest=U.alphaTest,A.map=U.map,A.clipShadows=U.clipShadows,A.clippingPlanes=U.clippingPlanes,A.clipIntersection=U.clipIntersection,A.displacementMap=U.displacementMap,A.displacementScale=U.displacementScale,A.displacementBias=U.displacementBias,A.wireframeLinewidth=U.wireframeLinewidth,A.linewidth=U.linewidth,X.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const V=r.properties.get(A);V.light=X}return A}function N(k,U,X,ae,A){if(k.visible===!1)return;if(k.layers.test(U.layers)&&(k.isMesh||k.isLine||k.isPoints)&&(k.castShadow||k.receiveShadow&&A===Hi)&&(!k.frustumCulled||s.intersectsObject(k))){k.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,k.matrixWorld);const Y=e.update(k),se=k.material;if(Array.isArray(se)){const K=Y.groups;for(let q=0,ue=K.length;q<ue;q++){const z=K[q],he=se[z.materialIndex];if(he&&he.visible){const le=b(k,he,ae,A);k.onBeforeShadow(r,k,U,X,Y,le,z),r.renderBufferDirect(X,null,Y,le,k,z),k.onAfterShadow(r,k,U,X,Y,le,z)}}}else if(se.visible){const K=b(k,se,ae,A);k.onBeforeShadow(r,k,U,X,Y,K,null),r.renderBufferDirect(X,null,Y,K,k,null),k.onAfterShadow(r,k,U,X,Y,K,null)}}const V=k.children;for(let Y=0,se=V.length;Y<se;Y++)N(V[Y],U,X,ae,A)}function $(k){k.target.removeEventListener("dispose",$);for(const X in p){const ae=p[X],A=k.target.uuid;A in ae&&(ae[A].dispose(),delete ae[A])}}}const NE={[fd]:pd,[md]:vd,[gd]:xd,[qs]:_d,[pd]:fd,[vd]:md,[xd]:gd,[_d]:qs};function LE(r){function e(){let j=!1;const Le=new Wt;let ce=null;const me=new Wt(0,0,0,0);return{setMask:function(Re){ce!==Re&&!j&&(r.colorMask(Re,Re,Re,Re),ce=Re)},setLocked:function(Re){j=Re},setClear:function(Re,Ie,_t,Ht,cn){cn===!0&&(Re*=Ht,Ie*=Ht,_t*=Ht),Le.set(Re,Ie,_t,Ht),me.equals(Le)===!1&&(r.clearColor(Re,Ie,_t,Ht),me.copy(Le))},reset:function(){j=!1,ce=null,me.set(-1,0,0,0)}}}function n(){let j=!1,Le=!1,ce=null,me=null,Re=null;return{setReversed:function(Ie){Le=Ie},setTest:function(Ie){Ie?xe(r.DEPTH_TEST):Se(r.DEPTH_TEST)},setMask:function(Ie){ce!==Ie&&!j&&(r.depthMask(Ie),ce=Ie)},setFunc:function(Ie){if(Le&&(Ie=NE[Ie]),me!==Ie){switch(Ie){case fd:r.depthFunc(r.NEVER);break;case pd:r.depthFunc(r.ALWAYS);break;case md:r.depthFunc(r.LESS);break;case qs:r.depthFunc(r.LEQUAL);break;case gd:r.depthFunc(r.EQUAL);break;case _d:r.depthFunc(r.GEQUAL);break;case vd:r.depthFunc(r.GREATER);break;case xd:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=Ie}},setLocked:function(Ie){j=Ie},setClear:function(Ie){Re!==Ie&&(r.clearDepth(Ie),Re=Ie)},reset:function(){j=!1,ce=null,me=null,Re=null}}}function s(){let j=!1,Le=null,ce=null,me=null,Re=null,Ie=null,_t=null,Ht=null,cn=null;return{setTest:function(xt){j||(xt?xe(r.STENCIL_TEST):Se(r.STENCIL_TEST))},setMask:function(xt){Le!==xt&&!j&&(r.stencilMask(xt),Le=xt)},setFunc:function(xt,tn,Wn){(ce!==xt||me!==tn||Re!==Wn)&&(r.stencilFunc(xt,tn,Wn),ce=xt,me=tn,Re=Wn)},setOp:function(xt,tn,Wn){(Ie!==xt||_t!==tn||Ht!==Wn)&&(r.stencilOp(xt,tn,Wn),Ie=xt,_t=tn,Ht=Wn)},setLocked:function(xt){j=xt},setClear:function(xt){cn!==xt&&(r.clearStencil(xt),cn=xt)},reset:function(){j=!1,Le=null,ce=null,me=null,Re=null,Ie=null,_t=null,Ht=null,cn=null}}}const o=new e,l=new n,d=new s,u=new WeakMap,f=new WeakMap;let p={},g={},v=new WeakMap,y=[],M=null,w=!1,C=null,x=null,S=null,L=null,b=null,N=null,$=null,k=new mt(0,0,0),U=0,X=!1,ae=null,A=null,E=null,V=null,Y=null;const se=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,q=0;const ue=r.getParameter(r.VERSION);ue.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(ue)[1]),K=q>=1):ue.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(ue)[1]),K=q>=2);let z=null,he={};const le=r.getParameter(r.SCISSOR_BOX),F=r.getParameter(r.VIEWPORT),oe=new Wt().fromArray(le),Ne=new Wt().fromArray(F);function ee(j,Le,ce,me){const Re=new Uint8Array(4),Ie=r.createTexture();r.bindTexture(j,Ie),r.texParameteri(j,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(j,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let _t=0;_t<ce;_t++)j===r.TEXTURE_3D||j===r.TEXTURE_2D_ARRAY?r.texImage3D(Le,0,r.RGBA,1,1,me,0,r.RGBA,r.UNSIGNED_BYTE,Re):r.texImage2D(Le+_t,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Re);return Ie}const de={};de[r.TEXTURE_2D]=ee(r.TEXTURE_2D,r.TEXTURE_2D,1),de[r.TEXTURE_CUBE_MAP]=ee(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[r.TEXTURE_2D_ARRAY]=ee(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),de[r.TEXTURE_3D]=ee(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),d.setClear(0),xe(r.DEPTH_TEST),l.setFunc(qs),lt(!1),pt(qp),xe(r.CULL_FACE),O(Sr);function xe(j){p[j]!==!0&&(r.enable(j),p[j]=!0)}function Se(j){p[j]!==!1&&(r.disable(j),p[j]=!1)}function Ae(j,Le){return g[j]!==Le?(r.bindFramebuffer(j,Le),g[j]=Le,j===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=Le),j===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=Le),!0):!1}function Pe(j,Le){let ce=y,me=!1;if(j){ce=v.get(Le),ce===void 0&&(ce=[],v.set(Le,ce));const Re=j.textures;if(ce.length!==Re.length||ce[0]!==r.COLOR_ATTACHMENT0){for(let Ie=0,_t=Re.length;Ie<_t;Ie++)ce[Ie]=r.COLOR_ATTACHMENT0+Ie;ce.length=Re.length,me=!0}}else ce[0]!==r.BACK&&(ce[0]=r.BACK,me=!0);me&&r.drawBuffers(ce)}function je(j){return M!==j?(r.useProgram(j),M=j,!0):!1}const Ke={[qr]:r.FUNC_ADD,[Yv]:r.FUNC_SUBTRACT,[qv]:r.FUNC_REVERSE_SUBTRACT};Ke[$v]=r.MIN,Ke[Kv]=r.MAX;const $e={[Zv]:r.ZERO,[Qv]:r.ONE,[Jv]:r.SRC_COLOR,[dd]:r.SRC_ALPHA,[s0]:r.SRC_ALPHA_SATURATE,[i0]:r.DST_COLOR,[t0]:r.DST_ALPHA,[e0]:r.ONE_MINUS_SRC_COLOR,[hd]:r.ONE_MINUS_SRC_ALPHA,[r0]:r.ONE_MINUS_DST_COLOR,[n0]:r.ONE_MINUS_DST_ALPHA,[a0]:r.CONSTANT_COLOR,[o0]:r.ONE_MINUS_CONSTANT_COLOR,[l0]:r.CONSTANT_ALPHA,[c0]:r.ONE_MINUS_CONSTANT_ALPHA};function O(j,Le,ce,me,Re,Ie,_t,Ht,cn,xt){if(j===Sr){w===!0&&(Se(r.BLEND),w=!1);return}if(w===!1&&(xe(r.BLEND),w=!0),j!==Xv){if(j!==C||xt!==X){if((x!==qr||b!==qr)&&(r.blendEquation(r.FUNC_ADD),x=qr,b=qr),xt)switch(j){case Ws:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $p:r.blendFunc(r.ONE,r.ONE);break;case Kp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zp:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case Ws:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $p:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Kp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zp:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}S=null,L=null,N=null,$=null,k.set(0,0,0),U=0,C=j,X=xt}return}Re=Re||Le,Ie=Ie||ce,_t=_t||me,(Le!==x||Re!==b)&&(r.blendEquationSeparate(Ke[Le],Ke[Re]),x=Le,b=Re),(ce!==S||me!==L||Ie!==N||_t!==$)&&(r.blendFuncSeparate($e[ce],$e[me],$e[Ie],$e[_t]),S=ce,L=me,N=Ie,$=_t),(Ht.equals(k)===!1||cn!==U)&&(r.blendColor(Ht.r,Ht.g,Ht.b,cn),k.copy(Ht),U=cn),C=j,X=!1}function Tt(j,Le){j.side===Ei?Se(r.CULL_FACE):xe(r.CULL_FACE);let ce=j.side===Dn;Le&&(ce=!ce),lt(ce),j.blending===Ws&&j.transparent===!1?O(Sr):O(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),l.setFunc(j.depthFunc),l.setTest(j.depthTest),l.setMask(j.depthWrite),o.setMask(j.colorWrite);const me=j.stencilWrite;d.setTest(me),me&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),At(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?xe(r.SAMPLE_ALPHA_TO_COVERAGE):Se(r.SAMPLE_ALPHA_TO_COVERAGE)}function lt(j){ae!==j&&(j?r.frontFace(r.CW):r.frontFace(r.CCW),ae=j)}function pt(j){j!==Vv?(xe(r.CULL_FACE),j!==A&&(j===qp?r.cullFace(r.BACK):j===Gv?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Se(r.CULL_FACE),A=j}function Ze(j){j!==E&&(K&&r.lineWidth(j),E=j)}function At(j,Le,ce){j?(xe(r.POLYGON_OFFSET_FILL),(V!==Le||Y!==ce)&&(r.polygonOffset(Le,ce),V=Le,Y=ce)):Se(r.POLYGON_OFFSET_FILL)}function Je(j){j?xe(r.SCISSOR_TEST):Se(r.SCISSOR_TEST)}function D(j){j===void 0&&(j=r.TEXTURE0+se-1),z!==j&&(r.activeTexture(j),z=j)}function R(j,Le,ce){ce===void 0&&(z===null?ce=r.TEXTURE0+se-1:ce=z);let me=he[ce];me===void 0&&(me={type:void 0,texture:void 0},he[ce]=me),(me.type!==j||me.texture!==Le)&&(z!==ce&&(r.activeTexture(ce),z=ce),r.bindTexture(j,Le||de[j]),me.type=j,me.texture=Le)}function te(){const j=he[z];j!==void 0&&j.type!==void 0&&(r.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function pe(){try{r.compressedTexImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ve(){try{r.compressedTexImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function fe(){try{r.texSubImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ye(){try{r.texSubImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Fe(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function vt(){try{r.texStorage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Me(){try{r.texStorage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Oe(){try{r.texImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function st(){try{r.texImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function rt(j){oe.equals(j)===!1&&(r.scissor(j.x,j.y,j.z,j.w),oe.copy(j))}function ze(j){Ne.equals(j)===!1&&(r.viewport(j.x,j.y,j.z,j.w),Ne.copy(j))}function gt(j,Le){let ce=f.get(Le);ce===void 0&&(ce=new WeakMap,f.set(Le,ce));let me=ce.get(j);me===void 0&&(me=r.getUniformBlockIndex(Le,j.name),ce.set(j,me))}function ot(j,Le){const me=f.get(Le).get(j);u.get(Le)!==me&&(r.uniformBlockBinding(Le,me,j.__bindingPointIndex),u.set(Le,me))}function Ct(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},z=null,he={},g={},v=new WeakMap,y=[],M=null,w=!1,C=null,x=null,S=null,L=null,b=null,N=null,$=null,k=new mt(0,0,0),U=0,X=!1,ae=null,A=null,E=null,V=null,Y=null,oe.set(0,0,r.canvas.width,r.canvas.height),Ne.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),d.reset()}return{buffers:{color:o,depth:l,stencil:d},enable:xe,disable:Se,bindFramebuffer:Ae,drawBuffers:Pe,useProgram:je,setBlending:O,setMaterial:Tt,setFlipSided:lt,setCullFace:pt,setLineWidth:Ze,setPolygonOffset:At,setScissorTest:Je,activeTexture:D,bindTexture:R,unbindTexture:te,compressedTexImage2D:pe,compressedTexImage3D:ve,texImage2D:Oe,texImage3D:st,updateUBOMapping:gt,uniformBlockBinding:ot,texStorage2D:vt,texStorage3D:Me,texSubImage2D:fe,texSubImage3D:Ye,compressedTexSubImage2D:Ce,compressedTexSubImage3D:Fe,scissor:rt,viewport:ze,reset:Ct}}function Hm(r,e,n,s){const o=DE(s);switch(n){case og:return r*e;case cg:return r*e;case ug:return r*e*2;case dg:return r*e/o.components*o.byteLength;case rh:return r*e/o.components*o.byteLength;case hg:return r*e*2/o.components*o.byteLength;case sh:return r*e*2/o.components*o.byteLength;case lg:return r*e*3/o.components*o.byteLength;case mi:return r*e*4/o.components*o.byteLength;case ah:return r*e*4/o.components*o.byteLength;case Rl:case bl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Pl:case Nl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Td:case Cd:return Math.max(r,16)*Math.max(e,8)/4;case wd:case Ad:return Math.max(r,8)*Math.max(e,8)/2;case Rd:case bd:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Pd:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Nd:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ld:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Dd:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Id:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Ud:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Fd:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Od:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case kd:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case zd:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Bd:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Hd:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case jd:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Vd:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Gd:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Ll:case Wd:case Xd:return Math.ceil(r/4)*Math.ceil(e/4)*16;case fg:case Yd:return Math.ceil(r/4)*Math.ceil(e/4)*8;case qd:case $d:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function DE(r){switch(r){case Gi:case rg:return{byteLength:1,components:1};case Xa:case sg:case Ya:return{byteLength:2,components:1};case nh:case ih:return{byteLength:2,components:4};case Jr:case th:case ji:return{byteLength:4,components:1};case ag:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function IE(r,e,n,s,o,l,d){const u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,f=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new ut,g=new WeakMap;let v;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(D,R){return M?new OffscreenCanvas(D,R):Bl("canvas")}function C(D,R,te){let pe=1;const ve=Je(D);if((ve.width>te||ve.height>te)&&(pe=te/Math.max(ve.width,ve.height)),pe<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const fe=Math.floor(pe*ve.width),Ye=Math.floor(pe*ve.height);v===void 0&&(v=w(fe,Ye));const Ce=R?w(fe,Ye):v;return Ce.width=fe,Ce.height=Ye,Ce.getContext("2d").drawImage(D,0,0,fe,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+fe+"x"+Ye+")."),Ce}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),D;return D}function x(D){return D.generateMipmaps&&D.minFilter!==ei&&D.minFilter!==fi}function S(D){r.generateMipmap(D)}function L(D,R,te,pe,ve=!1){if(D!==null){if(r[D]!==void 0)return r[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let fe=R;if(R===r.RED&&(te===r.FLOAT&&(fe=r.R32F),te===r.HALF_FLOAT&&(fe=r.R16F),te===r.UNSIGNED_BYTE&&(fe=r.R8)),R===r.RED_INTEGER&&(te===r.UNSIGNED_BYTE&&(fe=r.R8UI),te===r.UNSIGNED_SHORT&&(fe=r.R16UI),te===r.UNSIGNED_INT&&(fe=r.R32UI),te===r.BYTE&&(fe=r.R8I),te===r.SHORT&&(fe=r.R16I),te===r.INT&&(fe=r.R32I)),R===r.RG&&(te===r.FLOAT&&(fe=r.RG32F),te===r.HALF_FLOAT&&(fe=r.RG16F),te===r.UNSIGNED_BYTE&&(fe=r.RG8)),R===r.RG_INTEGER&&(te===r.UNSIGNED_BYTE&&(fe=r.RG8UI),te===r.UNSIGNED_SHORT&&(fe=r.RG16UI),te===r.UNSIGNED_INT&&(fe=r.RG32UI),te===r.BYTE&&(fe=r.RG8I),te===r.SHORT&&(fe=r.RG16I),te===r.INT&&(fe=r.RG32I)),R===r.RGB_INTEGER&&(te===r.UNSIGNED_BYTE&&(fe=r.RGB8UI),te===r.UNSIGNED_SHORT&&(fe=r.RGB16UI),te===r.UNSIGNED_INT&&(fe=r.RGB32UI),te===r.BYTE&&(fe=r.RGB8I),te===r.SHORT&&(fe=r.RGB16I),te===r.INT&&(fe=r.RGB32I)),R===r.RGBA_INTEGER&&(te===r.UNSIGNED_BYTE&&(fe=r.RGBA8UI),te===r.UNSIGNED_SHORT&&(fe=r.RGBA16UI),te===r.UNSIGNED_INT&&(fe=r.RGBA32UI),te===r.BYTE&&(fe=r.RGBA8I),te===r.SHORT&&(fe=r.RGBA16I),te===r.INT&&(fe=r.RGBA32I)),R===r.RGB&&te===r.UNSIGNED_INT_5_9_9_9_REV&&(fe=r.RGB9_E5),R===r.RGBA){const Ye=ve?Fl:Rt.getTransfer(pe);te===r.FLOAT&&(fe=r.RGBA32F),te===r.HALF_FLOAT&&(fe=r.RGBA16F),te===r.UNSIGNED_BYTE&&(fe=Ye===kt?r.SRGB8_ALPHA8:r.RGBA8),te===r.UNSIGNED_SHORT_4_4_4_4&&(fe=r.RGBA4),te===r.UNSIGNED_SHORT_5_5_5_1&&(fe=r.RGB5_A1)}return(fe===r.R16F||fe===r.R32F||fe===r.RG16F||fe===r.RG32F||fe===r.RGBA16F||fe===r.RGBA32F)&&e.get("EXT_color_buffer_float"),fe}function b(D,R){let te;return D?R===null||R===Jr||R===Zs?te=r.DEPTH24_STENCIL8:R===ji?te=r.DEPTH32F_STENCIL8:R===Xa&&(te=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Jr||R===Zs?te=r.DEPTH_COMPONENT24:R===ji?te=r.DEPTH_COMPONENT32F:R===Xa&&(te=r.DEPTH_COMPONENT16),te}function N(D,R){return x(D)===!0||D.isFramebufferTexture&&D.minFilter!==ei&&D.minFilter!==fi?Math.log2(Math.max(R.width,R.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?R.mipmaps.length:1}function $(D){const R=D.target;R.removeEventListener("dispose",$),U(R),R.isVideoTexture&&g.delete(R)}function k(D){const R=D.target;R.removeEventListener("dispose",k),ae(R)}function U(D){const R=s.get(D);if(R.__webglInit===void 0)return;const te=D.source,pe=y.get(te);if(pe){const ve=pe[R.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&X(D),Object.keys(pe).length===0&&y.delete(te)}s.remove(D)}function X(D){const R=s.get(D);r.deleteTexture(R.__webglTexture);const te=D.source,pe=y.get(te);delete pe[R.__cacheKey],d.memory.textures--}function ae(D){const R=s.get(D);if(D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(R.__webglFramebuffer[pe]))for(let ve=0;ve<R.__webglFramebuffer[pe].length;ve++)r.deleteFramebuffer(R.__webglFramebuffer[pe][ve]);else r.deleteFramebuffer(R.__webglFramebuffer[pe]);R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer[pe])}else{if(Array.isArray(R.__webglFramebuffer))for(let pe=0;pe<R.__webglFramebuffer.length;pe++)r.deleteFramebuffer(R.__webglFramebuffer[pe]);else r.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&r.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let pe=0;pe<R.__webglColorRenderbuffer.length;pe++)R.__webglColorRenderbuffer[pe]&&r.deleteRenderbuffer(R.__webglColorRenderbuffer[pe]);R.__webglDepthRenderbuffer&&r.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const te=D.textures;for(let pe=0,ve=te.length;pe<ve;pe++){const fe=s.get(te[pe]);fe.__webglTexture&&(r.deleteTexture(fe.__webglTexture),d.memory.textures--),s.remove(te[pe])}s.remove(D)}let A=0;function E(){A=0}function V(){const D=A;return D>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+o.maxTextures),A+=1,D}function Y(D){const R=[];return R.push(D.wrapS),R.push(D.wrapT),R.push(D.wrapR||0),R.push(D.magFilter),R.push(D.minFilter),R.push(D.anisotropy),R.push(D.internalFormat),R.push(D.format),R.push(D.type),R.push(D.generateMipmaps),R.push(D.premultiplyAlpha),R.push(D.flipY),R.push(D.unpackAlignment),R.push(D.colorSpace),R.join()}function se(D,R){const te=s.get(D);if(D.isVideoTexture&&Ze(D),D.isRenderTargetTexture===!1&&D.version>0&&te.__version!==D.version){const pe=D.image;if(pe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(te,D,R);return}}n.bindTexture(r.TEXTURE_2D,te.__webglTexture,r.TEXTURE0+R)}function K(D,R){const te=s.get(D);if(D.version>0&&te.__version!==D.version){Ne(te,D,R);return}n.bindTexture(r.TEXTURE_2D_ARRAY,te.__webglTexture,r.TEXTURE0+R)}function q(D,R){const te=s.get(D);if(D.version>0&&te.__version!==D.version){Ne(te,D,R);return}n.bindTexture(r.TEXTURE_3D,te.__webglTexture,r.TEXTURE0+R)}function ue(D,R){const te=s.get(D);if(D.version>0&&te.__version!==D.version){ee(te,D,R);return}n.bindTexture(r.TEXTURE_CUBE_MAP,te.__webglTexture,r.TEXTURE0+R)}const z={[Md]:r.REPEAT,[Kr]:r.CLAMP_TO_EDGE,[Ed]:r.MIRRORED_REPEAT},he={[ei]:r.NEAREST,[x0]:r.NEAREST_MIPMAP_NEAREST,[rl]:r.NEAREST_MIPMAP_LINEAR,[fi]:r.LINEAR,[Pu]:r.LINEAR_MIPMAP_NEAREST,[Zr]:r.LINEAR_MIPMAP_LINEAR},le={[E0]:r.NEVER,[b0]:r.ALWAYS,[w0]:r.LESS,[mg]:r.LEQUAL,[T0]:r.EQUAL,[R0]:r.GEQUAL,[A0]:r.GREATER,[C0]:r.NOTEQUAL};function F(D,R){if(R.type===ji&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===fi||R.magFilter===Pu||R.magFilter===rl||R.magFilter===Zr||R.minFilter===fi||R.minFilter===Pu||R.minFilter===rl||R.minFilter===Zr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(D,r.TEXTURE_WRAP_S,z[R.wrapS]),r.texParameteri(D,r.TEXTURE_WRAP_T,z[R.wrapT]),(D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY)&&r.texParameteri(D,r.TEXTURE_WRAP_R,z[R.wrapR]),r.texParameteri(D,r.TEXTURE_MAG_FILTER,he[R.magFilter]),r.texParameteri(D,r.TEXTURE_MIN_FILTER,he[R.minFilter]),R.compareFunction&&(r.texParameteri(D,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(D,r.TEXTURE_COMPARE_FUNC,le[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===ei||R.minFilter!==rl&&R.minFilter!==Zr||R.type===ji&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||s.get(R).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");r.texParameterf(D,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,o.getMaxAnisotropy())),s.get(R).__currentAnisotropy=R.anisotropy}}}function oe(D,R){let te=!1;D.__webglInit===void 0&&(D.__webglInit=!0,R.addEventListener("dispose",$));const pe=R.source;let ve=y.get(pe);ve===void 0&&(ve={},y.set(pe,ve));const fe=Y(R);if(fe!==D.__cacheKey){ve[fe]===void 0&&(ve[fe]={texture:r.createTexture(),usedTimes:0},d.memory.textures++,te=!0),ve[fe].usedTimes++;const Ye=ve[D.__cacheKey];Ye!==void 0&&(ve[D.__cacheKey].usedTimes--,Ye.usedTimes===0&&X(R)),D.__cacheKey=fe,D.__webglTexture=ve[fe].texture}return te}function Ne(D,R,te){let pe=r.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(pe=r.TEXTURE_2D_ARRAY),R.isData3DTexture&&(pe=r.TEXTURE_3D);const ve=oe(D,R),fe=R.source;n.bindTexture(pe,D.__webglTexture,r.TEXTURE0+te);const Ye=s.get(fe);if(fe.version!==Ye.__version||ve===!0){n.activeTexture(r.TEXTURE0+te);const Ce=Rt.getPrimaries(Rt.workingColorSpace),Fe=R.colorSpace===yr?null:Rt.getPrimaries(R.colorSpace),vt=R.colorSpace===yr||Ce===Fe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Me=C(R.image,!1,o.maxTextureSize);Me=At(R,Me);const Oe=l.convert(R.format,R.colorSpace),st=l.convert(R.type);let rt=L(R.internalFormat,Oe,st,R.colorSpace,R.isVideoTexture);F(pe,R);let ze;const gt=R.mipmaps,ot=R.isVideoTexture!==!0,Ct=Ye.__version===void 0||ve===!0,j=fe.dataReady,Le=N(R,Me);if(R.isDepthTexture)rt=b(R.format===Qs,R.type),Ct&&(ot?n.texStorage2D(r.TEXTURE_2D,1,rt,Me.width,Me.height):n.texImage2D(r.TEXTURE_2D,0,rt,Me.width,Me.height,0,Oe,st,null));else if(R.isDataTexture)if(gt.length>0){ot&&Ct&&n.texStorage2D(r.TEXTURE_2D,Le,rt,gt[0].width,gt[0].height);for(let ce=0,me=gt.length;ce<me;ce++)ze=gt[ce],ot?j&&n.texSubImage2D(r.TEXTURE_2D,ce,0,0,ze.width,ze.height,Oe,st,ze.data):n.texImage2D(r.TEXTURE_2D,ce,rt,ze.width,ze.height,0,Oe,st,ze.data);R.generateMipmaps=!1}else ot?(Ct&&n.texStorage2D(r.TEXTURE_2D,Le,rt,Me.width,Me.height),j&&n.texSubImage2D(r.TEXTURE_2D,0,0,0,Me.width,Me.height,Oe,st,Me.data)):n.texImage2D(r.TEXTURE_2D,0,rt,Me.width,Me.height,0,Oe,st,Me.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){ot&&Ct&&n.texStorage3D(r.TEXTURE_2D_ARRAY,Le,rt,gt[0].width,gt[0].height,Me.depth);for(let ce=0,me=gt.length;ce<me;ce++)if(ze=gt[ce],R.format!==mi)if(Oe!==null)if(ot){if(j)if(R.layerUpdates.size>0){const Re=Hm(ze.width,ze.height,R.format,R.type);for(const Ie of R.layerUpdates){const _t=ze.data.subarray(Ie*Re/ze.data.BYTES_PER_ELEMENT,(Ie+1)*Re/ze.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,Ie,ze.width,ze.height,1,Oe,_t,0,0)}R.clearLayerUpdates()}else n.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ze.width,ze.height,Me.depth,Oe,ze.data,0,0)}else n.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ce,rt,ze.width,ze.height,Me.depth,0,ze.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ot?j&&n.texSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ze.width,ze.height,Me.depth,Oe,st,ze.data):n.texImage3D(r.TEXTURE_2D_ARRAY,ce,rt,ze.width,ze.height,Me.depth,0,Oe,st,ze.data)}else{ot&&Ct&&n.texStorage2D(r.TEXTURE_2D,Le,rt,gt[0].width,gt[0].height);for(let ce=0,me=gt.length;ce<me;ce++)ze=gt[ce],R.format!==mi?Oe!==null?ot?j&&n.compressedTexSubImage2D(r.TEXTURE_2D,ce,0,0,ze.width,ze.height,Oe,ze.data):n.compressedTexImage2D(r.TEXTURE_2D,ce,rt,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ot?j&&n.texSubImage2D(r.TEXTURE_2D,ce,0,0,ze.width,ze.height,Oe,st,ze.data):n.texImage2D(r.TEXTURE_2D,ce,rt,ze.width,ze.height,0,Oe,st,ze.data)}else if(R.isDataArrayTexture)if(ot){if(Ct&&n.texStorage3D(r.TEXTURE_2D_ARRAY,Le,rt,Me.width,Me.height,Me.depth),j)if(R.layerUpdates.size>0){const ce=Hm(Me.width,Me.height,R.format,R.type);for(const me of R.layerUpdates){const Re=Me.data.subarray(me*ce/Me.data.BYTES_PER_ELEMENT,(me+1)*ce/Me.data.BYTES_PER_ELEMENT);n.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,me,Me.width,Me.height,1,Oe,st,Re)}R.clearLayerUpdates()}else n.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Me.width,Me.height,Me.depth,Oe,st,Me.data)}else n.texImage3D(r.TEXTURE_2D_ARRAY,0,rt,Me.width,Me.height,Me.depth,0,Oe,st,Me.data);else if(R.isData3DTexture)ot?(Ct&&n.texStorage3D(r.TEXTURE_3D,Le,rt,Me.width,Me.height,Me.depth),j&&n.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Me.width,Me.height,Me.depth,Oe,st,Me.data)):n.texImage3D(r.TEXTURE_3D,0,rt,Me.width,Me.height,Me.depth,0,Oe,st,Me.data);else if(R.isFramebufferTexture){if(Ct)if(ot)n.texStorage2D(r.TEXTURE_2D,Le,rt,Me.width,Me.height);else{let ce=Me.width,me=Me.height;for(let Re=0;Re<Le;Re++)n.texImage2D(r.TEXTURE_2D,Re,rt,ce,me,0,Oe,st,null),ce>>=1,me>>=1}}else if(gt.length>0){if(ot&&Ct){const ce=Je(gt[0]);n.texStorage2D(r.TEXTURE_2D,Le,rt,ce.width,ce.height)}for(let ce=0,me=gt.length;ce<me;ce++)ze=gt[ce],ot?j&&n.texSubImage2D(r.TEXTURE_2D,ce,0,0,Oe,st,ze):n.texImage2D(r.TEXTURE_2D,ce,rt,Oe,st,ze);R.generateMipmaps=!1}else if(ot){if(Ct){const ce=Je(Me);n.texStorage2D(r.TEXTURE_2D,Le,rt,ce.width,ce.height)}j&&n.texSubImage2D(r.TEXTURE_2D,0,0,0,Oe,st,Me)}else n.texImage2D(r.TEXTURE_2D,0,rt,Oe,st,Me);x(R)&&S(pe),Ye.__version=fe.version,R.onUpdate&&R.onUpdate(R)}D.__version=R.version}function ee(D,R,te){if(R.image.length!==6)return;const pe=oe(D,R),ve=R.source;n.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+te);const fe=s.get(ve);if(ve.version!==fe.__version||pe===!0){n.activeTexture(r.TEXTURE0+te);const Ye=Rt.getPrimaries(Rt.workingColorSpace),Ce=R.colorSpace===yr?null:Rt.getPrimaries(R.colorSpace),Fe=R.colorSpace===yr||Ye===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);const vt=R.isCompressedTexture||R.image[0].isCompressedTexture,Me=R.image[0]&&R.image[0].isDataTexture,Oe=[];for(let me=0;me<6;me++)!vt&&!Me?Oe[me]=C(R.image[me],!0,o.maxCubemapSize):Oe[me]=Me?R.image[me].image:R.image[me],Oe[me]=At(R,Oe[me]);const st=Oe[0],rt=l.convert(R.format,R.colorSpace),ze=l.convert(R.type),gt=L(R.internalFormat,rt,ze,R.colorSpace),ot=R.isVideoTexture!==!0,Ct=fe.__version===void 0||pe===!0,j=ve.dataReady;let Le=N(R,st);F(r.TEXTURE_CUBE_MAP,R);let ce;if(vt){ot&&Ct&&n.texStorage2D(r.TEXTURE_CUBE_MAP,Le,gt,st.width,st.height);for(let me=0;me<6;me++){ce=Oe[me].mipmaps;for(let Re=0;Re<ce.length;Re++){const Ie=ce[Re];R.format!==mi?rt!==null?ot?j&&n.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Ie.width,Ie.height,rt,Ie.data):n.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,gt,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ot?j&&n.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Ie.width,Ie.height,rt,ze,Ie.data):n.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,gt,Ie.width,Ie.height,0,rt,ze,Ie.data)}}}else{if(ce=R.mipmaps,ot&&Ct){ce.length>0&&Le++;const me=Je(Oe[0]);n.texStorage2D(r.TEXTURE_CUBE_MAP,Le,gt,me.width,me.height)}for(let me=0;me<6;me++)if(Me){ot?j&&n.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Oe[me].width,Oe[me].height,rt,ze,Oe[me].data):n.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,gt,Oe[me].width,Oe[me].height,0,rt,ze,Oe[me].data);for(let Re=0;Re<ce.length;Re++){const _t=ce[Re].image[me].image;ot?j&&n.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,_t.width,_t.height,rt,ze,_t.data):n.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,gt,_t.width,_t.height,0,rt,ze,_t.data)}}else{ot?j&&n.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,rt,ze,Oe[me]):n.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,gt,rt,ze,Oe[me]);for(let Re=0;Re<ce.length;Re++){const Ie=ce[Re];ot?j&&n.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,rt,ze,Ie.image[me]):n.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,gt,rt,ze,Ie.image[me])}}}x(R)&&S(r.TEXTURE_CUBE_MAP),fe.__version=ve.version,R.onUpdate&&R.onUpdate(R)}D.__version=R.version}function de(D,R,te,pe,ve,fe){const Ye=l.convert(te.format,te.colorSpace),Ce=l.convert(te.type),Fe=L(te.internalFormat,Ye,Ce,te.colorSpace);if(!s.get(R).__hasExternalTextures){const Me=Math.max(1,R.width>>fe),Oe=Math.max(1,R.height>>fe);ve===r.TEXTURE_3D||ve===r.TEXTURE_2D_ARRAY?n.texImage3D(ve,fe,Fe,Me,Oe,R.depth,0,Ye,Ce,null):n.texImage2D(ve,fe,Fe,Me,Oe,0,Ye,Ce,null)}n.bindFramebuffer(r.FRAMEBUFFER,D),pt(R)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,pe,ve,s.get(te).__webglTexture,0,lt(R)):(ve===r.TEXTURE_2D||ve>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,pe,ve,s.get(te).__webglTexture,fe),n.bindFramebuffer(r.FRAMEBUFFER,null)}function xe(D,R,te){if(r.bindRenderbuffer(r.RENDERBUFFER,D),R.depthBuffer){const pe=R.depthTexture,ve=pe&&pe.isDepthTexture?pe.type:null,fe=b(R.stencilBuffer,ve),Ye=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ce=lt(R);pt(R)?u.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ce,fe,R.width,R.height):te?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ce,fe,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,fe,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ye,r.RENDERBUFFER,D)}else{const pe=R.textures;for(let ve=0;ve<pe.length;ve++){const fe=pe[ve],Ye=l.convert(fe.format,fe.colorSpace),Ce=l.convert(fe.type),Fe=L(fe.internalFormat,Ye,Ce,fe.colorSpace),vt=lt(R);te&&pt(R)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,vt,Fe,R.width,R.height):pt(R)?u.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,vt,Fe,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,Fe,R.width,R.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Se(D,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(r.FRAMEBUFFER,D),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(R.depthTexture).__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),se(R.depthTexture,0);const pe=s.get(R.depthTexture).__webglTexture,ve=lt(R);if(R.depthTexture.format===Xs)pt(R)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,pe,0,ve):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,pe,0);else if(R.depthTexture.format===Qs)pt(R)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,pe,0,ve):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,pe,0);else throw new Error("Unknown depthTexture format")}function Ae(D){const R=s.get(D),te=D.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==D.depthTexture){const pe=D.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),pe){const ve=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,pe.removeEventListener("dispose",ve)};pe.addEventListener("dispose",ve),R.__depthDisposeCallback=ve}R.__boundDepthTexture=pe}if(D.depthTexture&&!R.__autoAllocateDepthBuffer){if(te)throw new Error("target.depthTexture not supported in Cube render targets");Se(R.__webglFramebuffer,D)}else if(te){R.__webglDepthbuffer=[];for(let pe=0;pe<6;pe++)if(n.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer[pe]),R.__webglDepthbuffer[pe]===void 0)R.__webglDepthbuffer[pe]=r.createRenderbuffer(),xe(R.__webglDepthbuffer[pe],D,!1);else{const ve=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=R.__webglDepthbuffer[pe];r.bindRenderbuffer(r.RENDERBUFFER,fe),r.framebufferRenderbuffer(r.FRAMEBUFFER,ve,r.RENDERBUFFER,fe)}}else if(n.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=r.createRenderbuffer(),xe(R.__webglDepthbuffer,D,!1);else{const pe=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ve=R.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ve),r.framebufferRenderbuffer(r.FRAMEBUFFER,pe,r.RENDERBUFFER,ve)}n.bindFramebuffer(r.FRAMEBUFFER,null)}function Pe(D,R,te){const pe=s.get(D);R!==void 0&&de(pe.__webglFramebuffer,D,D.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),te!==void 0&&Ae(D)}function je(D){const R=D.texture,te=s.get(D),pe=s.get(R);D.addEventListener("dispose",k);const ve=D.textures,fe=D.isWebGLCubeRenderTarget===!0,Ye=ve.length>1;if(Ye||(pe.__webglTexture===void 0&&(pe.__webglTexture=r.createTexture()),pe.__version=R.version,d.memory.textures++),fe){te.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0){te.__webglFramebuffer[Ce]=[];for(let Fe=0;Fe<R.mipmaps.length;Fe++)te.__webglFramebuffer[Ce][Fe]=r.createFramebuffer()}else te.__webglFramebuffer[Ce]=r.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){te.__webglFramebuffer=[];for(let Ce=0;Ce<R.mipmaps.length;Ce++)te.__webglFramebuffer[Ce]=r.createFramebuffer()}else te.__webglFramebuffer=r.createFramebuffer();if(Ye)for(let Ce=0,Fe=ve.length;Ce<Fe;Ce++){const vt=s.get(ve[Ce]);vt.__webglTexture===void 0&&(vt.__webglTexture=r.createTexture(),d.memory.textures++)}if(D.samples>0&&pt(D)===!1){te.__webglMultisampledFramebuffer=r.createFramebuffer(),te.__webglColorRenderbuffer=[],n.bindFramebuffer(r.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let Ce=0;Ce<ve.length;Ce++){const Fe=ve[Ce];te.__webglColorRenderbuffer[Ce]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,te.__webglColorRenderbuffer[Ce]);const vt=l.convert(Fe.format,Fe.colorSpace),Me=l.convert(Fe.type),Oe=L(Fe.internalFormat,vt,Me,Fe.colorSpace,D.isXRRenderTarget===!0),st=lt(D);r.renderbufferStorageMultisample(r.RENDERBUFFER,st,Oe,D.width,D.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,te.__webglColorRenderbuffer[Ce])}r.bindRenderbuffer(r.RENDERBUFFER,null),D.depthBuffer&&(te.__webglDepthRenderbuffer=r.createRenderbuffer(),xe(te.__webglDepthRenderbuffer,D,!0)),n.bindFramebuffer(r.FRAMEBUFFER,null)}}if(fe){n.bindTexture(r.TEXTURE_CUBE_MAP,pe.__webglTexture),F(r.TEXTURE_CUBE_MAP,R);for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0)for(let Fe=0;Fe<R.mipmaps.length;Fe++)de(te.__webglFramebuffer[Ce][Fe],D,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,Fe);else de(te.__webglFramebuffer[Ce],D,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);x(R)&&S(r.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ye){for(let Ce=0,Fe=ve.length;Ce<Fe;Ce++){const vt=ve[Ce],Me=s.get(vt);n.bindTexture(r.TEXTURE_2D,Me.__webglTexture),F(r.TEXTURE_2D,vt),de(te.__webglFramebuffer,D,vt,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,0),x(vt)&&S(r.TEXTURE_2D)}n.unbindTexture()}else{let Ce=r.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ce=D.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),n.bindTexture(Ce,pe.__webglTexture),F(Ce,R),R.mipmaps&&R.mipmaps.length>0)for(let Fe=0;Fe<R.mipmaps.length;Fe++)de(te.__webglFramebuffer[Fe],D,R,r.COLOR_ATTACHMENT0,Ce,Fe);else de(te.__webglFramebuffer,D,R,r.COLOR_ATTACHMENT0,Ce,0);x(R)&&S(Ce),n.unbindTexture()}D.depthBuffer&&Ae(D)}function Ke(D){const R=D.textures;for(let te=0,pe=R.length;te<pe;te++){const ve=R[te];if(x(ve)){const fe=D.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Ye=s.get(ve).__webglTexture;n.bindTexture(fe,Ye),S(fe),n.unbindTexture()}}}const $e=[],O=[];function Tt(D){if(D.samples>0){if(pt(D)===!1){const R=D.textures,te=D.width,pe=D.height;let ve=r.COLOR_BUFFER_BIT;const fe=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ye=s.get(D),Ce=R.length>1;if(Ce)for(let Fe=0;Fe<R.length;Fe++)n.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,null),n.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,null,0);n.bindFramebuffer(r.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),n.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let Fe=0;Fe<R.length;Fe++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ve|=r.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ve|=r.STENCIL_BUFFER_BIT)),Ce){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[Fe]);const vt=s.get(R[Fe]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,vt,0)}r.blitFramebuffer(0,0,te,pe,0,0,te,pe,ve,r.NEAREST),f===!0&&($e.length=0,O.length=0,$e.push(r.COLOR_ATTACHMENT0+Fe),D.depthBuffer&&D.resolveDepthBuffer===!1&&($e.push(fe),O.push(fe),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,O)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,$e))}if(n.bindFramebuffer(r.READ_FRAMEBUFFER,null),n.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Ce)for(let Fe=0;Fe<R.length;Fe++){n.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[Fe]);const vt=s.get(R[Fe]).__webglTexture;n.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,vt,0)}n.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&f){const R=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[R])}}}function lt(D){return Math.min(o.maxSamples,D.samples)}function pt(D){const R=s.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Ze(D){const R=d.render.frame;g.get(D)!==R&&(g.set(D,R),D.update())}function At(D,R){const te=D.colorSpace,pe=D.format,ve=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||te!==Ar&&te!==yr&&(Rt.getTransfer(te)===kt?(pe!==mi||ve!==Gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",te)),R}function Je(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(p.width=D.naturalWidth||D.width,p.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(p.width=D.displayWidth,p.height=D.displayHeight):(p.width=D.width,p.height=D.height),p}this.allocateTextureUnit=V,this.resetTextureUnits=E,this.setTexture2D=se,this.setTexture2DArray=K,this.setTexture3D=q,this.setTextureCube=ue,this.rebindTextures=Pe,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=de,this.useMultisampledRTT=pt}function UE(r,e){function n(s,o=yr){let l;const d=Rt.getTransfer(o);if(s===Gi)return r.UNSIGNED_BYTE;if(s===nh)return r.UNSIGNED_SHORT_4_4_4_4;if(s===ih)return r.UNSIGNED_SHORT_5_5_5_1;if(s===ag)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===rg)return r.BYTE;if(s===sg)return r.SHORT;if(s===Xa)return r.UNSIGNED_SHORT;if(s===th)return r.INT;if(s===Jr)return r.UNSIGNED_INT;if(s===ji)return r.FLOAT;if(s===Ya)return r.HALF_FLOAT;if(s===og)return r.ALPHA;if(s===lg)return r.RGB;if(s===mi)return r.RGBA;if(s===cg)return r.LUMINANCE;if(s===ug)return r.LUMINANCE_ALPHA;if(s===Xs)return r.DEPTH_COMPONENT;if(s===Qs)return r.DEPTH_STENCIL;if(s===dg)return r.RED;if(s===rh)return r.RED_INTEGER;if(s===hg)return r.RG;if(s===sh)return r.RG_INTEGER;if(s===ah)return r.RGBA_INTEGER;if(s===Rl||s===bl||s===Pl||s===Nl)if(d===kt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===Rl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===bl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Pl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Nl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===Rl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===bl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Pl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Nl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===wd||s===Td||s===Ad||s===Cd)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===wd)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Td)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Ad)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Cd)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Rd||s===bd||s===Pd)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===Rd||s===bd)return d===kt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===Pd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Nd||s===Ld||s===Dd||s===Id||s===Ud||s===Fd||s===Od||s===kd||s===zd||s===Bd||s===Hd||s===jd||s===Vd||s===Gd)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===Nd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Ld)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Dd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Id)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Ud)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Fd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Od)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===kd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===zd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Bd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Hd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===jd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Vd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Gd)return d===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Ll||s===Wd||s===Xd)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Ll)return d===kt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Wd)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Xd)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===fg||s===Yd||s===qd||s===$d)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Ll)return l.COMPRESSED_RED_RGTC1_EXT;if(s===Yd)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===qd)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===$d)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Zs?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:n}}class FE extends Jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Qr extends ln{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OE={type:"move"};class sd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const s of e.hand.values())this._getHandJoint(n,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,s){let o=null,l=null,d=null;const u=this._targetRay,f=this._grip,p=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(p&&e.hand){d=!0;for(const C of e.hand.values()){const x=n.getJointPose(C,s),S=this._getHandJoint(p,C);x!==null&&(S.matrix.fromArray(x.transform.matrix),S.matrix.decompose(S.position,S.rotation,S.scale),S.matrixWorldNeedsUpdate=!0,S.jointRadius=x.radius),S.visible=x!==null}const g=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],y=g.position.distanceTo(v.position),M=.02,w=.005;p.inputState.pinching&&y>M+w?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&y<=M-w&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else f!==null&&e.gripSpace&&(l=n.getPose(e.gripSpace,s),l!==null&&(f.matrix.fromArray(l.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,l.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(l.linearVelocity)):f.hasLinearVelocity=!1,l.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(l.angularVelocity)):f.hasAngularVelocity=!1));u!==null&&(o=n.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(u.matrix.fromArray(o.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,o.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(o.linearVelocity)):u.hasLinearVelocity=!1,o.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(o.angularVelocity)):u.hasAngularVelocity=!1,this.dispatchEvent(OE)))}return u!==null&&(u.visible=o!==null),f!==null&&(f.visible=l!==null),p!==null&&(p.visible=d!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const s=new Qr;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[n.jointName]=s,e.add(s)}return e.joints[n.jointName]}}const kE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class BE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,s){if(this.texture===null){const o=new In,l=e.properties.get(o);l.__webglTexture=n.texture,(n.depthNear!=s.depthNear||n.depthFar!=s.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=o}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,s=new Tr({vertexShader:kE,fragmentShader:zE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new ti(new Za(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class HE extends ts{constructor(e,n){super();const s=this;let o=null,l=1,d=null,u="local-floor",f=1,p=null,g=null,v=null,y=null,M=null,w=null;const C=new BE,x=n.getContextAttributes();let S=null,L=null;const b=[],N=[],$=new ut;let k=null;const U=new Jn;U.layers.enable(1),U.viewport=new Wt;const X=new Jn;X.layers.enable(2),X.viewport=new Wt;const ae=[U,X],A=new FE;A.layers.enable(1),A.layers.enable(2);let E=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let de=b[ee];return de===void 0&&(de=new sd,b[ee]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ee){let de=b[ee];return de===void 0&&(de=new sd,b[ee]=de),de.getGripSpace()},this.getHand=function(ee){let de=b[ee];return de===void 0&&(de=new sd,b[ee]=de),de.getHandSpace()};function Y(ee){const de=N.indexOf(ee.inputSource);if(de===-1)return;const xe=b[de];xe!==void 0&&(xe.update(ee.inputSource,ee.frame,p||d),xe.dispatchEvent({type:ee.type,data:ee.inputSource}))}function se(){o.removeEventListener("select",Y),o.removeEventListener("selectstart",Y),o.removeEventListener("selectend",Y),o.removeEventListener("squeeze",Y),o.removeEventListener("squeezestart",Y),o.removeEventListener("squeezeend",Y),o.removeEventListener("end",se),o.removeEventListener("inputsourceschange",K);for(let ee=0;ee<b.length;ee++){const de=N[ee];de!==null&&(N[ee]=null,b[ee].disconnect(de))}E=null,V=null,C.reset(),e.setRenderTarget(S),M=null,y=null,v=null,o=null,L=null,Ne.stop(),s.isPresenting=!1,e.setPixelRatio(k),e.setSize($.width,$.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){l=ee,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){u=ee,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||d},this.setReferenceSpace=function(ee){p=ee},this.getBaseLayer=function(){return y!==null?y:M},this.getBinding=function(){return v},this.getFrame=function(){return w},this.getSession=function(){return o},this.setSession=async function(ee){if(o=ee,o!==null){if(S=e.getRenderTarget(),o.addEventListener("select",Y),o.addEventListener("selectstart",Y),o.addEventListener("selectend",Y),o.addEventListener("squeeze",Y),o.addEventListener("squeezestart",Y),o.addEventListener("squeezeend",Y),o.addEventListener("end",se),o.addEventListener("inputsourceschange",K),x.xrCompatible!==!0&&await n.makeXRCompatible(),k=e.getPixelRatio(),e.getSize($),o.renderState.layers===void 0){const de={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,n,de),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),L=new es(M.framebufferWidth,M.framebufferHeight,{format:mi,type:Gi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let de=null,xe=null,Se=null;x.depth&&(Se=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,de=x.stencil?Qs:Xs,xe=x.stencil?Zs:Jr);const Ae={colorFormat:n.RGBA8,depthFormat:Se,scaleFactor:l};v=new XRWebGLBinding(o,n),y=v.createProjectionLayer(Ae),o.updateRenderState({layers:[y]}),e.setPixelRatio(1),e.setSize(y.textureWidth,y.textureHeight,!1),L=new es(y.textureWidth,y.textureHeight,{format:mi,type:Gi,depthTexture:new Rg(y.textureWidth,y.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1})}L.isXRRenderTarget=!0,this.setFoveation(f),p=null,d=await o.requestReferenceSpace(u),Ne.setContext(o),Ne.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return C.getDepthTexture()};function K(ee){for(let de=0;de<ee.removed.length;de++){const xe=ee.removed[de],Se=N.indexOf(xe);Se>=0&&(N[Se]=null,b[Se].disconnect(xe))}for(let de=0;de<ee.added.length;de++){const xe=ee.added[de];let Se=N.indexOf(xe);if(Se===-1){for(let Pe=0;Pe<b.length;Pe++)if(Pe>=N.length){N.push(xe),Se=Pe;break}else if(N[Pe]===null){N[Pe]=xe,Se=Pe;break}if(Se===-1)break}const Ae=b[Se];Ae&&Ae.connect(xe)}}const q=new Q,ue=new Q;function z(ee,de,xe){q.setFromMatrixPosition(de.matrixWorld),ue.setFromMatrixPosition(xe.matrixWorld);const Se=q.distanceTo(ue),Ae=de.projectionMatrix.elements,Pe=xe.projectionMatrix.elements,je=Ae[14]/(Ae[10]-1),Ke=Ae[14]/(Ae[10]+1),$e=(Ae[9]+1)/Ae[5],O=(Ae[9]-1)/Ae[5],Tt=(Ae[8]-1)/Ae[0],lt=(Pe[8]+1)/Pe[0],pt=je*Tt,Ze=je*lt,At=Se/(-Tt+lt),Je=At*-Tt;if(de.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Je),ee.translateZ(At),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Ae[10]===-1)ee.projectionMatrix.copy(de.projectionMatrix),ee.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const D=je+At,R=Ke+At,te=pt-Je,pe=Ze+(Se-Je),ve=$e*Ke/R*D,fe=O*Ke/R*D;ee.projectionMatrix.makePerspective(te,pe,ve,fe,D,R),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function he(ee,de){de===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(de.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(o===null)return;let de=ee.near,xe=ee.far;C.texture!==null&&(C.depthNear>0&&(de=C.depthNear),C.depthFar>0&&(xe=C.depthFar)),A.near=X.near=U.near=de,A.far=X.far=U.far=xe,(E!==A.near||V!==A.far)&&(o.updateRenderState({depthNear:A.near,depthFar:A.far}),E=A.near,V=A.far);const Se=ee.parent,Ae=A.cameras;he(A,Se);for(let Pe=0;Pe<Ae.length;Pe++)he(Ae[Pe],Se);Ae.length===2?z(A,U,X):A.projectionMatrix.copy(U.projectionMatrix),le(ee,A,Se)};function le(ee,de,xe){xe===null?ee.matrix.copy(de.matrixWorld):(ee.matrix.copy(xe.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(de.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(de.projectionMatrix),ee.projectionMatrixInverse.copy(de.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Kd*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(y===null&&M===null))return f},this.setFoveation=function(ee){f=ee,y!==null&&(y.fixedFoveation=ee),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=ee)},this.hasDepthSensing=function(){return C.texture!==null},this.getDepthSensingMesh=function(){return C.getMesh(A)};let F=null;function oe(ee,de){if(g=de.getViewerPose(p||d),w=de,g!==null){const xe=g.views;M!==null&&(e.setRenderTargetFramebuffer(L,M.framebuffer),e.setRenderTarget(L));let Se=!1;xe.length!==A.cameras.length&&(A.cameras.length=0,Se=!0);for(let Pe=0;Pe<xe.length;Pe++){const je=xe[Pe];let Ke=null;if(M!==null)Ke=M.getViewport(je);else{const O=v.getViewSubImage(y,je);Ke=O.viewport,Pe===0&&(e.setRenderTargetTextures(L,O.colorTexture,y.ignoreDepthValues?void 0:O.depthStencilTexture),e.setRenderTarget(L))}let $e=ae[Pe];$e===void 0&&($e=new Jn,$e.layers.enable(Pe),$e.viewport=new Wt,ae[Pe]=$e),$e.matrix.fromArray(je.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(je.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Pe===0&&(A.matrix.copy($e.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),Se===!0&&A.cameras.push($e)}const Ae=o.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Pe=v.getDepthInformation(xe[0]);Pe&&Pe.isValid&&Pe.texture&&C.init(e,Pe,o.renderState)}}for(let xe=0;xe<b.length;xe++){const Se=N[xe],Ae=b[xe];Se!==null&&Ae!==void 0&&Ae.update(Se,de,p||d)}F&&F(ee,de),de.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:de}),w=null}const Ne=new Ag;Ne.setAnimationLoop(oe),this.setAnimationLoop=function(ee){F=ee},this.dispose=function(){}}}const Wr=new gi,jE=new Ut;function VE(r,e){function n(x,S){x.matrixAutoUpdate===!0&&x.updateMatrix(),S.value.copy(x.matrix)}function s(x,S){S.color.getRGB(x.fogColor.value,Eg(r)),S.isFog?(x.fogNear.value=S.near,x.fogFar.value=S.far):S.isFogExp2&&(x.fogDensity.value=S.density)}function o(x,S,L,b,N){S.isMeshBasicMaterial||S.isMeshLambertMaterial?l(x,S):S.isMeshToonMaterial?(l(x,S),v(x,S)):S.isMeshPhongMaterial?(l(x,S),g(x,S)):S.isMeshStandardMaterial?(l(x,S),y(x,S),S.isMeshPhysicalMaterial&&M(x,S,N)):S.isMeshMatcapMaterial?(l(x,S),w(x,S)):S.isMeshDepthMaterial?l(x,S):S.isMeshDistanceMaterial?(l(x,S),C(x,S)):S.isMeshNormalMaterial?l(x,S):S.isLineBasicMaterial?(d(x,S),S.isLineDashedMaterial&&u(x,S)):S.isPointsMaterial?f(x,S,L,b):S.isSpriteMaterial?p(x,S):S.isShadowMaterial?(x.color.value.copy(S.color),x.opacity.value=S.opacity):S.isShaderMaterial&&(S.uniformsNeedUpdate=!1)}function l(x,S){x.opacity.value=S.opacity,S.color&&x.diffuse.value.copy(S.color),S.emissive&&x.emissive.value.copy(S.emissive).multiplyScalar(S.emissiveIntensity),S.map&&(x.map.value=S.map,n(S.map,x.mapTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,n(S.alphaMap,x.alphaMapTransform)),S.bumpMap&&(x.bumpMap.value=S.bumpMap,n(S.bumpMap,x.bumpMapTransform),x.bumpScale.value=S.bumpScale,S.side===Dn&&(x.bumpScale.value*=-1)),S.normalMap&&(x.normalMap.value=S.normalMap,n(S.normalMap,x.normalMapTransform),x.normalScale.value.copy(S.normalScale),S.side===Dn&&x.normalScale.value.negate()),S.displacementMap&&(x.displacementMap.value=S.displacementMap,n(S.displacementMap,x.displacementMapTransform),x.displacementScale.value=S.displacementScale,x.displacementBias.value=S.displacementBias),S.emissiveMap&&(x.emissiveMap.value=S.emissiveMap,n(S.emissiveMap,x.emissiveMapTransform)),S.specularMap&&(x.specularMap.value=S.specularMap,n(S.specularMap,x.specularMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest);const L=e.get(S),b=L.envMap,N=L.envMapRotation;b&&(x.envMap.value=b,Wr.copy(N),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),x.envMapRotation.value.setFromMatrix4(jE.makeRotationFromEuler(Wr)),x.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=S.reflectivity,x.ior.value=S.ior,x.refractionRatio.value=S.refractionRatio),S.lightMap&&(x.lightMap.value=S.lightMap,x.lightMapIntensity.value=S.lightMapIntensity,n(S.lightMap,x.lightMapTransform)),S.aoMap&&(x.aoMap.value=S.aoMap,x.aoMapIntensity.value=S.aoMapIntensity,n(S.aoMap,x.aoMapTransform))}function d(x,S){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,S.map&&(x.map.value=S.map,n(S.map,x.mapTransform))}function u(x,S){x.dashSize.value=S.dashSize,x.totalSize.value=S.dashSize+S.gapSize,x.scale.value=S.scale}function f(x,S,L,b){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,x.size.value=S.size*L,x.scale.value=b*.5,S.map&&(x.map.value=S.map,n(S.map,x.uvTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,n(S.alphaMap,x.alphaMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest)}function p(x,S){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,x.rotation.value=S.rotation,S.map&&(x.map.value=S.map,n(S.map,x.mapTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,n(S.alphaMap,x.alphaMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest)}function g(x,S){x.specular.value.copy(S.specular),x.shininess.value=Math.max(S.shininess,1e-4)}function v(x,S){S.gradientMap&&(x.gradientMap.value=S.gradientMap)}function y(x,S){x.metalness.value=S.metalness,S.metalnessMap&&(x.metalnessMap.value=S.metalnessMap,n(S.metalnessMap,x.metalnessMapTransform)),x.roughness.value=S.roughness,S.roughnessMap&&(x.roughnessMap.value=S.roughnessMap,n(S.roughnessMap,x.roughnessMapTransform)),S.envMap&&(x.envMapIntensity.value=S.envMapIntensity)}function M(x,S,L){x.ior.value=S.ior,S.sheen>0&&(x.sheenColor.value.copy(S.sheenColor).multiplyScalar(S.sheen),x.sheenRoughness.value=S.sheenRoughness,S.sheenColorMap&&(x.sheenColorMap.value=S.sheenColorMap,n(S.sheenColorMap,x.sheenColorMapTransform)),S.sheenRoughnessMap&&(x.sheenRoughnessMap.value=S.sheenRoughnessMap,n(S.sheenRoughnessMap,x.sheenRoughnessMapTransform))),S.clearcoat>0&&(x.clearcoat.value=S.clearcoat,x.clearcoatRoughness.value=S.clearcoatRoughness,S.clearcoatMap&&(x.clearcoatMap.value=S.clearcoatMap,n(S.clearcoatMap,x.clearcoatMapTransform)),S.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=S.clearcoatRoughnessMap,n(S.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),S.clearcoatNormalMap&&(x.clearcoatNormalMap.value=S.clearcoatNormalMap,n(S.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(S.clearcoatNormalScale),S.side===Dn&&x.clearcoatNormalScale.value.negate())),S.dispersion>0&&(x.dispersion.value=S.dispersion),S.iridescence>0&&(x.iridescence.value=S.iridescence,x.iridescenceIOR.value=S.iridescenceIOR,x.iridescenceThicknessMinimum.value=S.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=S.iridescenceThicknessRange[1],S.iridescenceMap&&(x.iridescenceMap.value=S.iridescenceMap,n(S.iridescenceMap,x.iridescenceMapTransform)),S.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=S.iridescenceThicknessMap,n(S.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),S.transmission>0&&(x.transmission.value=S.transmission,x.transmissionSamplerMap.value=L.texture,x.transmissionSamplerSize.value.set(L.width,L.height),S.transmissionMap&&(x.transmissionMap.value=S.transmissionMap,n(S.transmissionMap,x.transmissionMapTransform)),x.thickness.value=S.thickness,S.thicknessMap&&(x.thicknessMap.value=S.thicknessMap,n(S.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=S.attenuationDistance,x.attenuationColor.value.copy(S.attenuationColor)),S.anisotropy>0&&(x.anisotropyVector.value.set(S.anisotropy*Math.cos(S.anisotropyRotation),S.anisotropy*Math.sin(S.anisotropyRotation)),S.anisotropyMap&&(x.anisotropyMap.value=S.anisotropyMap,n(S.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=S.specularIntensity,x.specularColor.value.copy(S.specularColor),S.specularColorMap&&(x.specularColorMap.value=S.specularColorMap,n(S.specularColorMap,x.specularColorMapTransform)),S.specularIntensityMap&&(x.specularIntensityMap.value=S.specularIntensityMap,n(S.specularIntensityMap,x.specularIntensityMapTransform))}function w(x,S){S.matcap&&(x.matcap.value=S.matcap)}function C(x,S){const L=e.get(S).light;x.referencePosition.value.setFromMatrixPosition(L.matrixWorld),x.nearDistance.value=L.shadow.camera.near,x.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function GE(r,e,n,s){let o={},l={},d=[];const u=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function f(L,b){const N=b.program;s.uniformBlockBinding(L,N)}function p(L,b){let N=o[L.id];N===void 0&&(w(L),N=g(L),o[L.id]=N,L.addEventListener("dispose",x));const $=b.program;s.updateUBOMapping(L,$);const k=e.render.frame;l[L.id]!==k&&(y(L),l[L.id]=k)}function g(L){const b=v();L.__bindingPointIndex=b;const N=r.createBuffer(),$=L.__size,k=L.usage;return r.bindBuffer(r.UNIFORM_BUFFER,N),r.bufferData(r.UNIFORM_BUFFER,$,k),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,b,N),N}function v(){for(let L=0;L<u;L++)if(d.indexOf(L)===-1)return d.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(L){const b=o[L.id],N=L.uniforms,$=L.__cache;r.bindBuffer(r.UNIFORM_BUFFER,b);for(let k=0,U=N.length;k<U;k++){const X=Array.isArray(N[k])?N[k]:[N[k]];for(let ae=0,A=X.length;ae<A;ae++){const E=X[ae];if(M(E,k,ae,$)===!0){const V=E.__offset,Y=Array.isArray(E.value)?E.value:[E.value];let se=0;for(let K=0;K<Y.length;K++){const q=Y[K],ue=C(q);typeof q=="number"||typeof q=="boolean"?(E.__data[0]=q,r.bufferSubData(r.UNIFORM_BUFFER,V+se,E.__data)):q.isMatrix3?(E.__data[0]=q.elements[0],E.__data[1]=q.elements[1],E.__data[2]=q.elements[2],E.__data[3]=0,E.__data[4]=q.elements[3],E.__data[5]=q.elements[4],E.__data[6]=q.elements[5],E.__data[7]=0,E.__data[8]=q.elements[6],E.__data[9]=q.elements[7],E.__data[10]=q.elements[8],E.__data[11]=0):(q.toArray(E.__data,se),se+=ue.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,V,E.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(L,b,N,$){const k=L.value,U=b+"_"+N;if($[U]===void 0)return typeof k=="number"||typeof k=="boolean"?$[U]=k:$[U]=k.clone(),!0;{const X=$[U];if(typeof k=="number"||typeof k=="boolean"){if(X!==k)return $[U]=k,!0}else if(X.equals(k)===!1)return X.copy(k),!0}return!1}function w(L){const b=L.uniforms;let N=0;const $=16;for(let U=0,X=b.length;U<X;U++){const ae=Array.isArray(b[U])?b[U]:[b[U]];for(let A=0,E=ae.length;A<E;A++){const V=ae[A],Y=Array.isArray(V.value)?V.value:[V.value];for(let se=0,K=Y.length;se<K;se++){const q=Y[se],ue=C(q),z=N%$,he=z%ue.boundary,le=z+he;N+=he,le!==0&&$-le<ue.storage&&(N+=$-le),V.__data=new Float32Array(ue.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=N,N+=ue.storage}}}const k=N%$;return k>0&&(N+=$-k),L.__size=N,L.__cache={},this}function C(L){const b={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(b.boundary=4,b.storage=4):L.isVector2?(b.boundary=8,b.storage=8):L.isVector3||L.isColor?(b.boundary=16,b.storage=12):L.isVector4?(b.boundary=16,b.storage=16):L.isMatrix3?(b.boundary=48,b.storage=48):L.isMatrix4?(b.boundary=64,b.storage=64):L.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",L),b}function x(L){const b=L.target;b.removeEventListener("dispose",x);const N=d.indexOf(b.__bindingPointIndex);d.splice(N,1),r.deleteBuffer(o[b.id]),delete o[b.id],delete l[b.id]}function S(){for(const L in o)r.deleteBuffer(o[L]);d=[],o={},l={}}return{bind:f,update:p,dispose:S}}class WE{constructor(e={}){const{canvas:n=L0(),context:s=null,depth:o=!0,stencil:l=!1,alpha:d=!1,antialias:u=!1,premultipliedAlpha:f=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1}=e;this.isWebGLRenderer=!0;let y;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=s.getContextAttributes().alpha}else y=d;const M=new Uint32Array(4),w=new Int32Array(4);let C=null,x=null;const S=[],L=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hi,this.toneMapping=Mr,this.toneMappingExposure=1;const b=this;let N=!1,$=0,k=0,U=null,X=-1,ae=null;const A=new Wt,E=new Wt;let V=null;const Y=new mt(0);let se=0,K=n.width,q=n.height,ue=1,z=null,he=null;const le=new Wt(0,0,K,q),F=new Wt(0,0,K,q);let oe=!1;const Ne=new uh;let ee=!1,de=!1;const xe=new Ut,Se=new Ut,Ae=new Q,Pe=new Wt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function $e(){return U===null?ue:1}let O=s;function Tt(P,G){return n.getContext(P,G)}try{const P={alpha:!0,depth:o,stencil:l,antialias:u,premultipliedAlpha:f,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${eh}`),n.addEventListener("webglcontextlost",me,!1),n.addEventListener("webglcontextrestored",Re,!1),n.addEventListener("webglcontextcreationerror",Ie,!1),O===null){const G="webgl2";if(O=Tt(G,P),O===null)throw Tt(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let lt,pt,Ze,At,Je,D,R,te,pe,ve,fe,Ye,Ce,Fe,vt,Me,Oe,st,rt,ze,gt,ot,Ct,j;function Le(){lt=new KS(O),lt.init(),ot=new UE(O,lt),pt=new GS(O,lt,e,ot),Ze=new LE(O),pt.reverseDepthBuffer&&Ze.buffers.depth.setReversed(!0),At=new JS(O),Je=new _E,D=new IE(O,lt,Ze,Je,pt,ot,At),R=new XS(b),te=new $S(b),pe=new ax(O),Ct=new jS(O,pe),ve=new ZS(O,pe,At,Ct),fe=new tM(O,ve,pe,At),rt=new eM(O,pt,D),Me=new WS(Je),Ye=new gE(b,R,te,lt,pt,Ct,Me),Ce=new VE(b,Je),Fe=new xE,vt=new TE(lt),st=new HS(b,R,te,Ze,fe,y,f),Oe=new PE(b,fe,pt),j=new GE(O,At,pt,Ze),ze=new VS(O,lt,At),gt=new QS(O,lt,At),At.programs=Ye.programs,b.capabilities=pt,b.extensions=lt,b.properties=Je,b.renderLists=Fe,b.shadowMap=Oe,b.state=Ze,b.info=At}Le();const ce=new HE(b,O);this.xr=ce,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const P=lt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=lt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return ue},this.setPixelRatio=function(P){P!==void 0&&(ue=P,this.setSize(K,q,!1))},this.getSize=function(P){return P.set(K,q)},this.setSize=function(P,G,ne=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=P,q=G,n.width=Math.floor(P*ue),n.height=Math.floor(G*ue),ne===!0&&(n.style.width=P+"px",n.style.height=G+"px"),this.setViewport(0,0,P,G)},this.getDrawingBufferSize=function(P){return P.set(K*ue,q*ue).floor()},this.setDrawingBufferSize=function(P,G,ne){K=P,q=G,ue=ne,n.width=Math.floor(P*ne),n.height=Math.floor(G*ne),this.setViewport(0,0,P,G)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(le)},this.setViewport=function(P,G,ne,ie){P.isVector4?le.set(P.x,P.y,P.z,P.w):le.set(P,G,ne,ie),Ze.viewport(A.copy(le).multiplyScalar(ue).round())},this.getScissor=function(P){return P.copy(F)},this.setScissor=function(P,G,ne,ie){P.isVector4?F.set(P.x,P.y,P.z,P.w):F.set(P,G,ne,ie),Ze.scissor(E.copy(F).multiplyScalar(ue).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(P){Ze.setScissorTest(oe=P)},this.setOpaqueSort=function(P){z=P},this.setTransparentSort=function(P){he=P},this.getClearColor=function(P){return P.copy(st.getClearColor())},this.setClearColor=function(){st.setClearColor.apply(st,arguments)},this.getClearAlpha=function(){return st.getClearAlpha()},this.setClearAlpha=function(){st.setClearAlpha.apply(st,arguments)},this.clear=function(P=!0,G=!0,ne=!0){let ie=0;if(P){let W=!1;if(U!==null){const we=U.texture.format;W=we===ah||we===sh||we===rh}if(W){const we=U.texture.type,De=we===Gi||we===Jr||we===Xa||we===Zs||we===nh||we===ih,Te=st.getClearColor(),Ge=st.getClearAlpha(),nt=Te.r,it=Te.g,We=Te.b;De?(M[0]=nt,M[1]=it,M[2]=We,M[3]=Ge,O.clearBufferuiv(O.COLOR,0,M)):(w[0]=nt,w[1]=it,w[2]=We,w[3]=Ge,O.clearBufferiv(O.COLOR,0,w))}else ie|=O.COLOR_BUFFER_BIT}G&&(ie|=O.DEPTH_BUFFER_BIT,O.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),ne&&(ie|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",me,!1),n.removeEventListener("webglcontextrestored",Re,!1),n.removeEventListener("webglcontextcreationerror",Ie,!1),Fe.dispose(),vt.dispose(),Je.dispose(),R.dispose(),te.dispose(),fe.dispose(),Ct.dispose(),j.dispose(),Ye.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",Wi),ce.removeEventListener("sessionend",ns),Fn.stop()};function me(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function Re(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const P=At.autoReset,G=Oe.enabled,ne=Oe.autoUpdate,ie=Oe.needsUpdate,W=Oe.type;Le(),At.autoReset=P,Oe.enabled=G,Oe.autoUpdate=ne,Oe.needsUpdate=ie,Oe.type=W}function Ie(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function _t(P){const G=P.target;G.removeEventListener("dispose",_t),Ht(G)}function Ht(P){cn(P),Je.remove(P)}function cn(P){const G=Je.get(P).programs;G!==void 0&&(G.forEach(function(ne){Ye.releaseProgram(ne)}),P.isShaderMaterial&&Ye.releaseShaderCache(P))}this.renderBufferDirect=function(P,G,ne,ie,W,we){G===null&&(G=je);const De=W.isMesh&&W.matrixWorld.determinant()<0,Te=Ti(P,G,ne,ie,W);Ze.setMaterial(ie,De);let Ge=ne.index,nt=1;if(ie.wireframe===!0){if(Ge=ve.getWireframeAttribute(ne),Ge===void 0)return;nt=2}const it=ne.drawRange,We=ne.attributes.position;let wt=it.start*nt,Pt=(it.start+it.count)*nt;we!==null&&(wt=Math.max(wt,we.start*nt),Pt=Math.min(Pt,(we.start+we.count)*nt)),Ge!==null?(wt=Math.max(wt,0),Pt=Math.min(Pt,Ge.count)):We!=null&&(wt=Math.max(wt,0),Pt=Math.min(Pt,We.count));const Lt=Pt-wt;if(Lt<0||Lt===1/0)return;Ct.setup(W,ie,Te,ne,Ge);let zt,St=ze;if(Ge!==null&&(zt=pe.get(Ge),St=gt,St.setIndex(zt)),W.isMesh)ie.wireframe===!0?(Ze.setLineWidth(ie.wireframeLinewidth*$e()),St.setMode(O.LINES)):St.setMode(O.TRIANGLES);else if(W.isLine){let ke=ie.linewidth;ke===void 0&&(ke=1),Ze.setLineWidth(ke*$e()),W.isLineSegments?St.setMode(O.LINES):W.isLineLoop?St.setMode(O.LINE_LOOP):St.setMode(O.LINE_STRIP)}else W.isPoints?St.setMode(O.POINTS):W.isSprite&&St.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)St.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(lt.get("WEBGL_multi_draw"))St.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const ke=W._multiDrawStarts,$t=W._multiDrawCounts,Mt=W._multiDrawCount,On=Ge?pe.get(Ge).bytesPerElement:1,ni=Je.get(ie).currentProgram.getUniforms();for(let nn=0;nn<Mt;nn++)ni.setValue(O,"_gl_DrawID",nn),St.render(ke[nn]/On,$t[nn])}else if(W.isInstancedMesh)St.renderInstances(wt,Lt,W.count);else if(ne.isInstancedBufferGeometry){const ke=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,$t=Math.min(ne.instanceCount,ke);St.renderInstances(wt,Lt,$t)}else St.render(wt,Lt)};function xt(P,G,ne){P.transparent===!0&&P.side===Ei&&P.forceSinglePass===!1?(P.side=Dn,P.needsUpdate=!0,rs(P,G,ne),P.side=Er,P.needsUpdate=!0,rs(P,G,ne),P.side=Ei):rs(P,G,ne)}this.compile=function(P,G,ne=null){ne===null&&(ne=P),x=vt.get(ne),x.init(G),L.push(x),ne.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(x.pushLight(W),W.castShadow&&x.pushShadow(W))}),P!==ne&&P.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(x.pushLight(W),W.castShadow&&x.pushShadow(W))}),x.setupLights();const ie=new Set;return P.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const we=W.material;if(we)if(Array.isArray(we))for(let De=0;De<we.length;De++){const Te=we[De];xt(Te,ne,W),ie.add(Te)}else xt(we,ne,W),ie.add(we)}),L.pop(),x=null,ie},this.compileAsync=function(P,G,ne=null){const ie=this.compile(P,G,ne);return new Promise(W=>{function we(){if(ie.forEach(function(De){Je.get(De).currentProgram.isReady()&&ie.delete(De)}),ie.size===0){W(P);return}setTimeout(we,10)}lt.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let tn=null;function Wn(P){tn&&tn(P)}function Wi(){Fn.stop()}function ns(){Fn.start()}const Fn=new Ag;Fn.setAnimationLoop(Wn),typeof self<"u"&&Fn.setContext(self),this.setAnimationLoop=function(P){tn=P,ce.setAnimationLoop(P),P===null?Fn.stop():Fn.start()},ce.addEventListener("sessionstart",Wi),ce.addEventListener("sessionend",ns),this.render=function(P,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(G),G=ce.getCamera()),P.isScene===!0&&P.onBeforeRender(b,P,G,U),x=vt.get(P,L.length),x.init(G),L.push(x),Se.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Ne.setFromProjectionMatrix(Se),de=this.localClippingEnabled,ee=Me.init(this.clippingPlanes,de),C=Fe.get(P,S.length),C.init(),S.push(C),ce.enabled===!0&&ce.isPresenting===!0){const we=b.xr.getDepthSensingMesh();we!==null&&na(we,G,-1/0,b.sortObjects)}na(P,G,0,b.sortObjects),C.finish(),b.sortObjects===!0&&C.sort(z,he),Ke=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ke&&st.addToRenderList(C,P),this.info.render.frame++,ee===!0&&Me.beginShadows();const ne=x.state.shadowsArray;Oe.render(ne,P,G),ee===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=C.opaque,W=C.transmissive;if(x.setupLights(),G.isArrayCamera){const we=G.cameras;if(W.length>0)for(let De=0,Te=we.length;De<Te;De++){const Ge=we[De];Cr(ie,W,P,Ge)}Ke&&st.render(P);for(let De=0,Te=we.length;De<Te;De++){const Ge=we[De];Xi(C,P,Ge,Ge.viewport)}}else W.length>0&&Cr(ie,W,P,G),Ke&&st.render(P),Xi(C,P,G);U!==null&&(D.updateMultisampleRenderTarget(U),D.updateRenderTargetMipmap(U)),P.isScene===!0&&P.onAfterRender(b,P,G),Ct.resetDefaultState(),X=-1,ae=null,L.pop(),L.length>0?(x=L[L.length-1],ee===!0&&Me.setGlobalState(b.clippingPlanes,x.state.camera)):x=null,S.pop(),S.length>0?C=S[S.length-1]:C=null};function na(P,G,ne,ie){if(P.visible===!1)return;if(P.layers.test(G.layers)){if(P.isGroup)ne=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(G);else if(P.isLight)x.pushLight(P),P.castShadow&&x.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Ne.intersectsSprite(P)){ie&&Pe.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Se);const De=fe.update(P),Te=P.material;Te.visible&&C.push(P,De,Te,ne,Pe.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Ne.intersectsObject(P))){const De=fe.update(P),Te=P.material;if(ie&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Pe.copy(P.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),Pe.copy(De.boundingSphere.center)),Pe.applyMatrix4(P.matrixWorld).applyMatrix4(Se)),Array.isArray(Te)){const Ge=De.groups;for(let nt=0,it=Ge.length;nt<it;nt++){const We=Ge[nt],wt=Te[We.materialIndex];wt&&wt.visible&&C.push(P,De,wt,ne,Pe.z,We)}}else Te.visible&&C.push(P,De,Te,ne,Pe.z,null)}}const we=P.children;for(let De=0,Te=we.length;De<Te;De++)na(we[De],G,ne,ie)}function Xi(P,G,ne,ie){const W=P.opaque,we=P.transmissive,De=P.transparent;x.setupLightsView(ne),ee===!0&&Me.setGlobalState(b.clippingPlanes,ne),ie&&Ze.viewport(A.copy(ie)),W.length>0&&wi(W,G,ne),we.length>0&&wi(we,G,ne),De.length>0&&wi(De,G,ne),Ze.buffers.depth.setTest(!0),Ze.buffers.depth.setMask(!0),Ze.buffers.color.setMask(!0),Ze.setPolygonOffset(!1)}function Cr(P,G,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;x.state.transmissionRenderTarget[ie.id]===void 0&&(x.state.transmissionRenderTarget[ie.id]=new es(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float")?Ya:Gi,minFilter:Zr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace}));const we=x.state.transmissionRenderTarget[ie.id],De=ie.viewport||A;we.setSize(De.z,De.w);const Te=b.getRenderTarget();b.setRenderTarget(we),b.getClearColor(Y),se=b.getClearAlpha(),se<1&&b.setClearColor(16777215,.5),b.clear(),Ke&&st.render(ne);const Ge=b.toneMapping;b.toneMapping=Mr;const nt=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),x.setupLightsView(ie),ee===!0&&Me.setGlobalState(b.clippingPlanes,ie),wi(P,ne,ie),D.updateMultisampleRenderTarget(we),D.updateRenderTargetMipmap(we),lt.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let We=0,wt=G.length;We<wt;We++){const Pt=G[We],Lt=Pt.object,zt=Pt.geometry,St=Pt.material,ke=Pt.group;if(St.side===Ei&&Lt.layers.test(ie.layers)){const $t=St.side;St.side=Dn,St.needsUpdate=!0,is(Lt,ne,ie,zt,St,ke),St.side=$t,St.needsUpdate=!0,it=!0}}it===!0&&(D.updateMultisampleRenderTarget(we),D.updateRenderTargetMipmap(we))}b.setRenderTarget(Te),b.setClearColor(Y,se),nt!==void 0&&(ie.viewport=nt),b.toneMapping=Ge}function wi(P,G,ne){const ie=G.isScene===!0?G.overrideMaterial:null;for(let W=0,we=P.length;W<we;W++){const De=P[W],Te=De.object,Ge=De.geometry,nt=ie===null?De.material:ie,it=De.group;Te.layers.test(ne.layers)&&is(Te,G,ne,Ge,nt,it)}}function is(P,G,ne,ie,W,we){P.onBeforeRender(b,G,ne,ie,W,we),P.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),W.onBeforeRender(b,G,ne,ie,P,we),W.transparent===!0&&W.side===Ei&&W.forceSinglePass===!1?(W.side=Dn,W.needsUpdate=!0,b.renderBufferDirect(ne,G,ie,W,P,we),W.side=Er,W.needsUpdate=!0,b.renderBufferDirect(ne,G,ie,W,P,we),W.side=Ei):b.renderBufferDirect(ne,G,ie,W,P,we),P.onAfterRender(b,G,ne,ie,W,we)}function rs(P,G,ne){G.isScene!==!0&&(G=je);const ie=Je.get(P),W=x.state.lights,we=x.state.shadowsArray,De=W.state.version,Te=Ye.getParameters(P,W.state,we,G,ne),Ge=Ye.getProgramCacheKey(Te);let nt=ie.programs;ie.environment=P.isMeshStandardMaterial?G.environment:null,ie.fog=G.fog,ie.envMap=(P.isMeshStandardMaterial?te:R).get(P.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&P.envMap===null?G.environmentRotation:P.envMapRotation,nt===void 0&&(P.addEventListener("dispose",_t),nt=new Map,ie.programs=nt);let it=nt.get(Ge);if(it!==void 0){if(ie.currentProgram===it&&ie.lightsStateVersion===De)return Ja(P,Te),it}else Te.uniforms=Ye.getUniforms(P),P.onBeforeCompile(Te,b),it=Ye.acquireProgram(Te,Ge),nt.set(Ge,it),ie.uniforms=Te.uniforms;const We=ie.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(We.clippingPlanes=Me.uniform),Ja(P,Te),ie.needsLights=to(P),ie.lightsStateVersion=De,ie.needsLights&&(We.ambientLightColor.value=W.state.ambient,We.lightProbe.value=W.state.probe,We.directionalLights.value=W.state.directional,We.directionalLightShadows.value=W.state.directionalShadow,We.spotLights.value=W.state.spot,We.spotLightShadows.value=W.state.spotShadow,We.rectAreaLights.value=W.state.rectArea,We.ltc_1.value=W.state.rectAreaLTC1,We.ltc_2.value=W.state.rectAreaLTC2,We.pointLights.value=W.state.point,We.pointLightShadows.value=W.state.pointShadow,We.hemisphereLights.value=W.state.hemi,We.directionalShadowMap.value=W.state.directionalShadowMap,We.directionalShadowMatrix.value=W.state.directionalShadowMatrix,We.spotShadowMap.value=W.state.spotShadowMap,We.spotLightMatrix.value=W.state.spotLightMatrix,We.spotLightMap.value=W.state.spotLightMap,We.pointShadowMap.value=W.state.pointShadowMap,We.pointShadowMatrix.value=W.state.pointShadowMatrix),ie.currentProgram=it,ie.uniformsList=null,it}function Qa(P){if(P.uniformsList===null){const G=P.currentProgram.getUniforms();P.uniformsList=Ul.seqWithValue(G.seq,P.uniforms)}return P.uniformsList}function Ja(P,G){const ne=Je.get(P);ne.outputColorSpace=G.outputColorSpace,ne.batching=G.batching,ne.batchingColor=G.batchingColor,ne.instancing=G.instancing,ne.instancingColor=G.instancingColor,ne.instancingMorph=G.instancingMorph,ne.skinning=G.skinning,ne.morphTargets=G.morphTargets,ne.morphNormals=G.morphNormals,ne.morphColors=G.morphColors,ne.morphTargetsCount=G.morphTargetsCount,ne.numClippingPlanes=G.numClippingPlanes,ne.numIntersection=G.numClipIntersection,ne.vertexAlphas=G.vertexAlphas,ne.vertexTangents=G.vertexTangents,ne.toneMapping=G.toneMapping}function Ti(P,G,ne,ie,W){G.isScene!==!0&&(G=je),D.resetTextureUnits();const we=G.fog,De=ie.isMeshStandardMaterial?G.environment:null,Te=U===null?b.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Ar,Ge=(ie.isMeshStandardMaterial?te:R).get(ie.envMap||De),nt=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,it=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),We=!!ne.morphAttributes.position,wt=!!ne.morphAttributes.normal,Pt=!!ne.morphAttributes.color;let Lt=Mr;ie.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Lt=b.toneMapping);const zt=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,St=zt!==void 0?zt.length:0,ke=Je.get(ie),$t=x.state.lights;if(ee===!0&&(de===!0||P!==ae)){const hn=P===ae&&ie.id===X;Me.setState(ie,P,hn)}let Mt=!1;ie.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==$t.state.version||ke.outputColorSpace!==Te||W.isBatchedMesh&&ke.batching===!1||!W.isBatchedMesh&&ke.batching===!0||W.isBatchedMesh&&ke.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&ke.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&ke.instancing===!1||!W.isInstancedMesh&&ke.instancing===!0||W.isSkinnedMesh&&ke.skinning===!1||!W.isSkinnedMesh&&ke.skinning===!0||W.isInstancedMesh&&ke.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ke.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ke.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ke.instancingMorph===!1&&W.morphTexture!==null||ke.envMap!==Ge||ie.fog===!0&&ke.fog!==we||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Me.numPlanes||ke.numIntersection!==Me.numIntersection)||ke.vertexAlphas!==nt||ke.vertexTangents!==it||ke.morphTargets!==We||ke.morphNormals!==wt||ke.morphColors!==Pt||ke.toneMapping!==Lt||ke.morphTargetsCount!==St)&&(Mt=!0):(Mt=!0,ke.__version=ie.version);let On=ke.currentProgram;Mt===!0&&(On=rs(ie,G,W));let ni=!1,nn=!1,Ai=!1;const Dt=On.getUniforms(),_i=ke.uniforms;if(Ze.useProgram(On.program)&&(ni=!0,nn=!0,Ai=!0),ie.id!==X&&(X=ie.id,nn=!0),ni||ae!==P){pt.reverseDepthBuffer?(xe.copy(P.projectionMatrix),I0(xe),U0(xe),Dt.setValue(O,"projectionMatrix",xe)):Dt.setValue(O,"projectionMatrix",P.projectionMatrix),Dt.setValue(O,"viewMatrix",P.matrixWorldInverse);const hn=Dt.map.cameraPosition;hn!==void 0&&hn.setValue(O,Ae.setFromMatrixPosition(P.matrixWorld)),pt.logarithmicDepthBuffer&&Dt.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Dt.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),ae!==P&&(ae=P,nn=!0,Ai=!0)}if(W.isSkinnedMesh){Dt.setOptional(O,W,"bindMatrix"),Dt.setOptional(O,W,"bindMatrixInverse");const hn=W.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),Dt.setValue(O,"boneTexture",hn.boneTexture,D))}W.isBatchedMesh&&(Dt.setOptional(O,W,"batchingTexture"),Dt.setValue(O,"batchingTexture",W._matricesTexture,D),Dt.setOptional(O,W,"batchingIdTexture"),Dt.setValue(O,"batchingIdTexture",W._indirectTexture,D),Dt.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&Dt.setValue(O,"batchingColorTexture",W._colorsTexture,D));const ia=ne.morphAttributes;if((ia.position!==void 0||ia.normal!==void 0||ia.color!==void 0)&&rt.update(W,ne,On),(nn||ke.receiveShadow!==W.receiveShadow)&&(ke.receiveShadow=W.receiveShadow,Dt.setValue(O,"receiveShadow",W.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(_i.envMap.value=Ge,_i.flipEnvMap.value=Ge.isCubeTexture&&Ge.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&G.environment!==null&&(_i.envMapIntensity.value=G.environmentIntensity),nn&&(Dt.setValue(O,"toneMappingExposure",b.toneMappingExposure),ke.needsLights&&eo(_i,Ai),we&&ie.fog===!0&&Ce.refreshFogUniforms(_i,we),Ce.refreshMaterialUniforms(_i,ie,ue,q,x.state.transmissionRenderTarget[P.id]),Ul.upload(O,Qa(ke),_i,D)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Ul.upload(O,Qa(ke),_i,D),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Dt.setValue(O,"center",W.center),Dt.setValue(O,"modelViewMatrix",W.modelViewMatrix),Dt.setValue(O,"normalMatrix",W.normalMatrix),Dt.setValue(O,"modelMatrix",W.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const hn=ie.uniformsGroups;for(let ss=0,ra=hn.length;ss<ra;ss++){const Yi=hn[ss];j.update(Yi,On),j.bind(Yi,On)}}return On}function eo(P,G){P.ambientLightColor.needsUpdate=G,P.lightProbe.needsUpdate=G,P.directionalLights.needsUpdate=G,P.directionalLightShadows.needsUpdate=G,P.pointLights.needsUpdate=G,P.pointLightShadows.needsUpdate=G,P.spotLights.needsUpdate=G,P.spotLightShadows.needsUpdate=G,P.rectAreaLights.needsUpdate=G,P.hemisphereLights.needsUpdate=G}function to(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(P,G,ne){Je.get(P.texture).__webglTexture=G,Je.get(P.depthTexture).__webglTexture=ne;const ie=Je.get(P);ie.__hasExternalTextures=!0,ie.__autoAllocateDepthBuffer=ne===void 0,ie.__autoAllocateDepthBuffer||lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,G){const ne=Je.get(P);ne.__webglFramebuffer=G,ne.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(P,G=0,ne=0){U=P,$=G,k=ne;let ie=!0,W=null,we=!1,De=!1;if(P){const Ge=Je.get(P);if(Ge.__useDefaultFramebuffer!==void 0)Ze.bindFramebuffer(O.FRAMEBUFFER,null),ie=!1;else if(Ge.__webglFramebuffer===void 0)D.setupRenderTarget(P);else if(Ge.__hasExternalTextures)D.rebindTextures(P,Je.get(P.texture).__webglTexture,Je.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const We=P.depthTexture;if(Ge.__boundDepthTexture!==We){if(We!==null&&Je.has(We)&&(P.width!==We.image.width||P.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(P)}}const nt=P.texture;(nt.isData3DTexture||nt.isDataArrayTexture||nt.isCompressedArrayTexture)&&(De=!0);const it=Je.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(it[G])?W=it[G][ne]:W=it[G],we=!0):P.samples>0&&D.useMultisampledRTT(P)===!1?W=Je.get(P).__webglMultisampledFramebuffer:Array.isArray(it)?W=it[ne]:W=it,A.copy(P.viewport),E.copy(P.scissor),V=P.scissorTest}else A.copy(le).multiplyScalar(ue).floor(),E.copy(F).multiplyScalar(ue).floor(),V=oe;if(Ze.bindFramebuffer(O.FRAMEBUFFER,W)&&ie&&Ze.drawBuffers(P,W),Ze.viewport(A),Ze.scissor(E),Ze.setScissorTest(V),we){const Ge=Je.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ge.__webglTexture,ne)}else if(De){const Ge=Je.get(P.texture),nt=G||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ge.__webglTexture,ne||0,nt)}X=-1},this.readRenderTargetPixels=function(P,G,ne,ie,W,we,De){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Je.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&De!==void 0&&(Te=Te[De]),Te){Ze.bindFramebuffer(O.FRAMEBUFFER,Te);try{const Ge=P.texture,nt=Ge.format,it=Ge.type;if(!pt.textureFormatReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=P.width-ie&&ne>=0&&ne<=P.height-W&&O.readPixels(G,ne,ie,W,ot.convert(nt),ot.convert(it),we)}finally{const Ge=U!==null?Je.get(U).__webglFramebuffer:null;Ze.bindFramebuffer(O.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(P,G,ne,ie,W,we,De){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=Je.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&De!==void 0&&(Te=Te[De]),Te){const Ge=P.texture,nt=Ge.format,it=Ge.type;if(!pt.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=P.width-ie&&ne>=0&&ne<=P.height-W){Ze.bindFramebuffer(O.FRAMEBUFFER,Te);const We=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,We),O.bufferData(O.PIXEL_PACK_BUFFER,we.byteLength,O.STREAM_READ),O.readPixels(G,ne,ie,W,ot.convert(nt),ot.convert(it),0);const wt=U!==null?Je.get(U).__webglFramebuffer:null;Ze.bindFramebuffer(O.FRAMEBUFFER,wt);const Pt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await D0(O,Pt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,We),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,we),O.deleteBuffer(We),O.deleteSync(Pt),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,G=null,ne=0){P.isTexture!==!0&&(Il("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,P=arguments[1]);const ie=Math.pow(2,-ne),W=Math.floor(P.image.width*ie),we=Math.floor(P.image.height*ie),De=G!==null?G.x:0,Te=G!==null?G.y:0;D.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,ne,0,0,De,Te,W,we),Ze.unbindTexture()},this.copyTextureToTexture=function(P,G,ne=null,ie=null,W=0){P.isTexture!==!0&&(Il("WebGLRenderer: copyTextureToTexture function signature has changed."),ie=arguments[0]||null,P=arguments[1],G=arguments[2],W=arguments[3]||0,ne=null);let we,De,Te,Ge,nt,it;ne!==null?(we=ne.max.x-ne.min.x,De=ne.max.y-ne.min.y,Te=ne.min.x,Ge=ne.min.y):(we=P.image.width,De=P.image.height,Te=0,Ge=0),ie!==null?(nt=ie.x,it=ie.y):(nt=0,it=0);const We=ot.convert(G.format),wt=ot.convert(G.type);D.setTexture2D(G,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,G.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,G.unpackAlignment);const Pt=O.getParameter(O.UNPACK_ROW_LENGTH),Lt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),zt=O.getParameter(O.UNPACK_SKIP_PIXELS),St=O.getParameter(O.UNPACK_SKIP_ROWS),ke=O.getParameter(O.UNPACK_SKIP_IMAGES),$t=P.isCompressedTexture?P.mipmaps[W]:P.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,$t.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,$t.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Te),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ge),P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,W,nt,it,we,De,We,wt,$t.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,W,nt,it,$t.width,$t.height,We,$t.data):O.texSubImage2D(O.TEXTURE_2D,W,nt,it,we,De,We,wt,$t),O.pixelStorei(O.UNPACK_ROW_LENGTH,Pt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Lt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,zt),O.pixelStorei(O.UNPACK_SKIP_ROWS,St),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ke),W===0&&G.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),Ze.unbindTexture()},this.copyTextureToTexture3D=function(P,G,ne=null,ie=null,W=0){P.isTexture!==!0&&(Il("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ne=arguments[0]||null,ie=arguments[1]||null,P=arguments[2],G=arguments[3],W=arguments[4]||0);let we,De,Te,Ge,nt,it,We,wt,Pt;const Lt=P.isCompressedTexture?P.mipmaps[W]:P.image;ne!==null?(we=ne.max.x-ne.min.x,De=ne.max.y-ne.min.y,Te=ne.max.z-ne.min.z,Ge=ne.min.x,nt=ne.min.y,it=ne.min.z):(we=Lt.width,De=Lt.height,Te=Lt.depth,Ge=0,nt=0,it=0),ie!==null?(We=ie.x,wt=ie.y,Pt=ie.z):(We=0,wt=0,Pt=0);const zt=ot.convert(G.format),St=ot.convert(G.type);let ke;if(G.isData3DTexture)D.setTexture3D(G,0),ke=O.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)D.setTexture2DArray(G,0),ke=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,G.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,G.unpackAlignment);const $t=O.getParameter(O.UNPACK_ROW_LENGTH),Mt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),On=O.getParameter(O.UNPACK_SKIP_PIXELS),ni=O.getParameter(O.UNPACK_SKIP_ROWS),nn=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Lt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Lt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Ge),O.pixelStorei(O.UNPACK_SKIP_ROWS,nt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,it),P.isDataTexture||P.isData3DTexture?O.texSubImage3D(ke,W,We,wt,Pt,we,De,Te,zt,St,Lt.data):G.isCompressedArrayTexture?O.compressedTexSubImage3D(ke,W,We,wt,Pt,we,De,Te,zt,Lt.data):O.texSubImage3D(ke,W,We,wt,Pt,we,De,Te,zt,St,Lt),O.pixelStorei(O.UNPACK_ROW_LENGTH,$t),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Mt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,On),O.pixelStorei(O.UNPACK_SKIP_ROWS,ni),O.pixelStorei(O.UNPACK_SKIP_IMAGES,nn),W===0&&G.generateMipmaps&&O.generateMipmap(ke),Ze.unbindTexture()},this.initRenderTarget=function(P){Je.get(P).__webglFramebuffer===void 0&&D.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?D.setTextureCube(P,0):P.isData3DTexture?D.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?D.setTexture2DArray(P,0):D.setTexture2D(P,0),Ze.unbindTexture()},this.resetState=function(){$=0,k=0,U=null,Ze.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===oh?"display-p3":"srgb",n.unpackColorSpace=Rt.workingColorSpace===Gl?"display-p3":"srgb"}}class XE extends ln{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gi,this.environmentIntensity=1,this.environmentRotation=new gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class Yl extends ea{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new mt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Hl=new Q,jl=new Q,jm=new Ut,Va=new lh,Tl=new Wl,ad=new Q,Vm=new Q;class Dg extends ln{constructor(e=new Gn,n=new Yl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,s=[0];for(let o=1,l=n.count;o<l;o++)Hl.fromBufferAttribute(n,o-1),jl.fromBufferAttribute(n,o),s[o]=s[o-1],s[o]+=Hl.distanceTo(jl);e.setAttribute("lineDistance",new En(s,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const s=this.geometry,o=this.matrixWorld,l=e.params.Line.threshold,d=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),Tl.copy(s.boundingSphere),Tl.applyMatrix4(o),Tl.radius+=l,e.ray.intersectsSphere(Tl)===!1)return;jm.copy(o).invert(),Va.copy(e.ray).applyMatrix4(jm);const u=l/((this.scale.x+this.scale.y+this.scale.z)/3),f=u*u,p=this.isLineSegments?2:1,g=s.index,y=s.attributes.position;if(g!==null){const M=Math.max(0,d.start),w=Math.min(g.count,d.start+d.count);for(let C=M,x=w-1;C<x;C+=p){const S=g.getX(C),L=g.getX(C+1),b=Al(this,e,Va,f,S,L);b&&n.push(b)}if(this.isLineLoop){const C=g.getX(w-1),x=g.getX(M),S=Al(this,e,Va,f,C,x);S&&n.push(S)}}else{const M=Math.max(0,d.start),w=Math.min(y.count,d.start+d.count);for(let C=M,x=w-1;C<x;C+=p){const S=Al(this,e,Va,f,C,C+1);S&&n.push(S)}if(this.isLineLoop){const C=Al(this,e,Va,f,w-1,M);C&&n.push(C)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,s=Object.keys(n);if(s.length>0){const o=n[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,d=o.length;l<d;l++){const u=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=l}}}}}function Al(r,e,n,s,o,l){const d=r.geometry.attributes.position;if(Hl.fromBufferAttribute(d,o),jl.fromBufferAttribute(d,l),n.distanceSqToSegment(Hl,jl,ad,Vm)>s)return;ad.applyMatrix4(r.matrixWorld);const f=e.ray.origin.distanceTo(ad);if(!(f<e.near||f>e.far))return{distance:f,point:Vm.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}const Gm=new Q,Wm=new Q;class Ig extends Dg{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,s=[];for(let o=0,l=n.count;o<l;o+=2)Gm.fromBufferAttribute(n,o),Wm.fromBufferAttribute(n,o+1),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Gm.distanceTo(Wm);e.setAttribute("lineDistance",new En(s,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class od extends ea{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=pg,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const Xm={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class YE{constructor(e,n,s){const o=this;let l=!1,d=0,u=0,f;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=s,this.itemStart=function(g){u++,l===!1&&o.onStart!==void 0&&o.onStart(g,d,u),l=!0},this.itemEnd=function(g){d++,o.onProgress!==void 0&&o.onProgress(g,d,u),d===u&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return f?f(g):g},this.setURLModifier=function(g){return f=g,this},this.addHandler=function(g,v){return p.push(g,v),this},this.removeHandler=function(g){const v=p.indexOf(g);return v!==-1&&p.splice(v,2),this},this.getHandler=function(g){for(let v=0,y=p.length;v<y;v+=2){const M=p[v],w=p[v+1];if(M.global&&(M.lastIndex=0),M.test(g))return w}return null}}}const qE=new YE;class hh{constructor(e){this.manager=e!==void 0?e:qE,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const s=this;return new Promise(function(o,l){s.load(e,o,n,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}hh.DEFAULT_MATERIAL_NAME="__DEFAULT";const Bi={};class $E extends Error{constructor(e,n){super(e),this.response=n}}class KE extends hh{constructor(e){super(e)}load(e,n,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=Xm.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{n&&n(l),this.manager.itemEnd(e)},0),l;if(Bi[e]!==void 0){Bi[e].push({onLoad:n,onProgress:s,onError:o});return}Bi[e]=[],Bi[e].push({onLoad:n,onProgress:s,onError:o});const d=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),u=this.mimeType,f=this.responseType;fetch(d).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Bi[e],v=p.body.getReader(),y=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=y?parseInt(y):0,w=M!==0;let C=0;const x=new ReadableStream({start(S){L();function L(){v.read().then(({done:b,value:N})=>{if(b)S.close();else{C+=N.byteLength;const $=new ProgressEvent("progress",{lengthComputable:w,loaded:C,total:M});for(let k=0,U=g.length;k<U;k++){const X=g[k];X.onProgress&&X.onProgress($)}S.enqueue(N),L()}},b=>{S.error(b)})}}});return new Response(x)}else throw new $E(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(f){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,u));case"json":return p.json();default:if(u===void 0)return p.text();{const v=/charset="?([^;"\s]*)"?/i.exec(u),y=v&&v[1]?v[1].toLowerCase():void 0,M=new TextDecoder(y);return p.arrayBuffer().then(w=>M.decode(w))}}}).then(p=>{Xm.add(e,p);const g=Bi[e];delete Bi[e];for(let v=0,y=g.length;v<y;v++){const M=g[v];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Bi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Bi[e];for(let v=0,y=g.length;v<y;v++){const M=g[v];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Ug extends ln{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new mt(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class ZE extends Ug{constructor(e,n,s){super(e,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ln.DEFAULT_UP),this.updateMatrix(),this.groundColor=new mt(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const ld=new Ut,Ym=new Q,qm=new Q;class QE{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new Ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uh,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,s=this.matrix;Ym.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ym),qm.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(qm),n.updateMatrixWorld(),ld.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ld),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(ld)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class JE extends QE{constructor(){super(new Cg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $m extends Ug{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ln.DEFAULT_UP),this.updateMatrix(),this.target=new ln,this.shadow=new JE}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Km{constructor(e=1,n=0,s=0){return this.radius=e,this.phi=n,this.theta=s,this}set(e,n,s){return this.radius=e,this.phi=n,this.theta=s,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,s){return this.radius=Math.sqrt(e*e+n*n+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,s),this.phi=Math.acos(Mn(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Zm extends Ig{constructor(e=10,n=10,s=4473924,o=8947848){s=new mt(s),o=new mt(o);const l=n/2,d=e/n,u=e/2,f=[],p=[];for(let y=0,M=0,w=-u;y<=n;y++,w+=d){f.push(-u,0,w,u,0,w),f.push(w,0,-u,w,0,u);const C=y===l?s:o;C.toArray(p,M),M+=3,C.toArray(p,M),M+=3,C.toArray(p,M),M+=3,C.toArray(p,M),M+=3}const g=new Gn;g.setAttribute("position",new En(f,3)),g.setAttribute("color",new En(p,3));const v=new Yl({vertexColors:!0,toneMapped:!1});super(g,v),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class ew extends Ig{constructor(e=1){const n=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],s=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],o=new Gn;o.setAttribute("position",new En(n,3)),o.setAttribute("color",new En(s,3));const l=new Yl({vertexColors:!0,toneMapped:!1});super(o,l),this.type="AxesHelper"}setColors(e,n,s){const o=new mt,l=this.geometry.attributes.color.array;return o.set(e),o.toArray(l,0),o.toArray(l,3),o.set(n),o.toArray(l,6),o.toArray(l,9),o.set(s),o.toArray(l,12),o.toArray(l,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class tw extends ts{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:eh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=eh);class nw extends hh{constructor(e){super(e)}load(e,n,s,o){const l=this,d=new KE(this.manager);d.setPath(this.path),d.setResponseType("arraybuffer"),d.setRequestHeader(this.requestHeader),d.setWithCredentials(this.withCredentials),d.load(e,function(u){try{n(l.parse(u))}catch(f){o?o(f):console.error(f),l.manager.itemError(e)}},s,o)}parse(e){function n(p){const g=new DataView(p),v=32/8*3+32/8*3*3+16/8,y=g.getUint32(80,!0);if(80+32/8+y*v===g.byteLength)return!0;const w=[115,111,108,105,100];for(let C=0;C<5;C++)if(s(w,g,C))return!1;return!0}function s(p,g,v){for(let y=0,M=p.length;y<M;y++)if(p[y]!==g.getUint8(v+y))return!1;return!0}function o(p){const g=new DataView(p),v=g.getUint32(80,!0);let y,M,w,C=!1,x,S,L,b,N;for(let E=0;E<70;E++)g.getUint32(E,!1)==1129270351&&g.getUint8(E+4)==82&&g.getUint8(E+5)==61&&(C=!0,x=new Float32Array(v*3*3),S=g.getUint8(E+6)/255,L=g.getUint8(E+7)/255,b=g.getUint8(E+8)/255,N=g.getUint8(E+9)/255);const $=84,k=50,U=new Gn,X=new Float32Array(v*3*3),ae=new Float32Array(v*3*3),A=new mt;for(let E=0;E<v;E++){const V=$+E*k,Y=g.getFloat32(V,!0),se=g.getFloat32(V+4,!0),K=g.getFloat32(V+8,!0);if(C){const q=g.getUint16(V+48,!0);(q&32768)===0?(y=(q&31)/31,M=(q>>5&31)/31,w=(q>>10&31)/31):(y=S,M=L,w=b)}for(let q=1;q<=3;q++){const ue=V+q*12,z=E*3*3+(q-1)*3;X[z]=g.getFloat32(ue,!0),X[z+1]=g.getFloat32(ue+4,!0),X[z+2]=g.getFloat32(ue+8,!0),ae[z]=Y,ae[z+1]=se,ae[z+2]=K,C&&(A.setRGB(y,M,w,hi),x[z]=A.r,x[z+1]=A.g,x[z+2]=A.b)}}return U.setAttribute("position",new Un(X,3)),U.setAttribute("normal",new Un(ae,3)),C&&(U.setAttribute("color",new Un(x,3)),U.hasColors=!0,U.alpha=N),U}function l(p){const g=new Gn,v=/solid([\s\S]*?)endsolid/g,y=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let w=0;const C=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,x=new RegExp("vertex"+C+C+C,"g"),S=new RegExp("normal"+C+C+C,"g"),L=[],b=[],N=[],$=new Q;let k,U=0,X=0,ae=0;for(;(k=v.exec(p))!==null;){X=ae;const A=k[0],E=(k=M.exec(A))!==null?k[1]:"";for(N.push(E);(k=y.exec(A))!==null;){let se=0,K=0;const q=k[0];for(;(k=S.exec(q))!==null;)$.x=parseFloat(k[1]),$.y=parseFloat(k[2]),$.z=parseFloat(k[3]),K++;for(;(k=x.exec(q))!==null;)L.push(parseFloat(k[1]),parseFloat(k[2]),parseFloat(k[3])),b.push($.x,$.y,$.z),se++,ae++;K!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+w),se!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+w),w++}const V=X,Y=ae-X;g.userData.groupNames=N,g.addGroup(V,Y,U),U++}return g.setAttribute("position",new En(L,3)),g.setAttribute("normal",new En(b,3)),g}function d(p){return typeof p!="string"?new TextDecoder().decode(p):p}function u(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let v=0;v<p.length;v++)g[v]=p.charCodeAt(v)&255;return g.buffer||g}else return p}const f=u(e);return n(f)?o(f):l(d(e))}}const Qm={type:"change"},fh={type:"start"},Fg={type:"end"},Cl=new lh,Jm=new xr,iw=Math.cos(70*N0.DEG2RAD),Qt=new Q,Ln=2*Math.PI,Nt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},cd=1e-6;class rw extends tw{constructor(e,n=null){super(e,n),this.state=Nt.NONE,this.enabled=!0,this.target=new Q,this.cursor=new Q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gs.ROTATE,MIDDLE:Gs.DOLLY,RIGHT:Gs.PAN},this.touches={ONE:js.ROTATE,TWO:js.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Q,this._lastQuaternion=new wr,this._lastTargetPosition=new Q,this._quat=new wr().setFromUnitVectors(e.up,new Q(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Km,this._sphericalDelta=new Km,this._scale=1,this._panOffset=new Q,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new Q,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=aw.bind(this),this._onPointerDown=sw.bind(this),this._onPointerUp=ow.bind(this),this._onContextMenu=pw.bind(this),this._onMouseWheel=uw.bind(this),this._onKeyDown=dw.bind(this),this._onTouchStart=hw.bind(this),this._onTouchMove=fw.bind(this),this._onMouseDown=lw.bind(this),this._onMouseMove=cw.bind(this),this._interceptControlDown=mw.bind(this),this._interceptControlUp=gw.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Qm),this.update(),this.state=Nt.NONE}update(e=null){const n=this.object.position;Qt.copy(n).sub(this.target),Qt.applyQuaternion(this._quat),this._spherical.setFromVector3(Qt),this.autoRotate&&this.state===Nt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(s)&&isFinite(o)&&(s<-Math.PI?s+=Ln:s>Math.PI&&(s-=Ln),o<-Math.PI?o+=Ln:o>Math.PI&&(o-=Ln),s<=o?this._spherical.theta=Math.max(s,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+o)/2?Math.max(s,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let l=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const d=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),l=d!=this._spherical.radius}if(Qt.setFromSpherical(this._spherical),Qt.applyQuaternion(this._quatInverse),n.copy(this.target).add(Qt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let d=null;if(this.object.isPerspectiveCamera){const u=Qt.length();d=this._clampDistance(u*this._scale);const f=u-d;this.object.position.addScaledVector(this._dollyDirection,f),this.object.updateMatrixWorld(),l=!!f}else if(this.object.isOrthographicCamera){const u=new Q(this._mouse.x,this._mouse.y,0);u.unproject(this.object);const f=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),l=f!==this.object.zoom;const p=new Q(this._mouse.x,this._mouse.y,0);p.unproject(this.object),this.object.position.sub(p).add(u),this.object.updateMatrixWorld(),d=Qt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;d!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(d).add(this.object.position):(Cl.origin.copy(this.object.position),Cl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Cl.direction))<iw?this.object.lookAt(this.target):(Jm.setFromNormalAndCoplanarPoint(this.object.up,this.target),Cl.intersectPlane(Jm,this.target))))}else if(this.object.isOrthographicCamera){const d=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),d!==this.object.zoom&&(this.object.updateProjectionMatrix(),l=!0)}return this._scale=1,this._performCursorZoom=!1,l||this._lastPosition.distanceToSquared(this.object.position)>cd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>cd||this._lastTargetPosition.distanceToSquared(this.target)>cd?(this.dispatchEvent(Qm),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ln/60*this.autoRotateSpeed*e:Ln/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Qt.setFromMatrixColumn(n,0),Qt.multiplyScalar(-e),this._panOffset.add(Qt)}_panUp(e,n){this.screenSpacePanning===!0?Qt.setFromMatrixColumn(n,1):(Qt.setFromMatrixColumn(n,0),Qt.crossVectors(this.object.up,Qt)),Qt.multiplyScalar(e),this._panOffset.add(Qt)}_pan(e,n){const s=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;Qt.copy(o).sub(this.target);let l=Qt.length();l*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*l/s.clientHeight,this.object.matrix),this._panUp(2*n*l/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),o=e-s.left,l=n-s.top,d=s.width,u=s.height;this._mouse.x=o/d*2-1,this._mouse.y=-(l/u)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Ln*this._rotateDelta.x/n.clientHeight),this._rotateUp(Ln*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(s,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(s,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),s=e.pageX-n.x,o=e.pageY-n.y,l=Math.sqrt(s*s+o*o);this._dollyStart.set(0,l)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const s=this._getSecondPointerPosition(e),o=.5*(e.pageX+s.x),l=.5*(e.pageY+s.y);this._rotateEnd.set(o,l)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Ln*this._rotateDelta.x/n.clientHeight),this._rotateUp(Ln*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(s,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),s=e.pageX-n.x,o=e.pageY-n.y,l=Math.sqrt(s*s+o*o);this._dollyEnd.set(0,l),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const d=(e.pageX+n.x)*.5,u=(e.pageY+n.y)*.5;this._updateZoomParameters(d,u)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new ut,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,s={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function sw(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function aw(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function ow(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Fg),this.state=Nt.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function lw(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Gs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=Nt.DOLLY;break;case Gs.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Nt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Nt.ROTATE}break;case Gs.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Nt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Nt.PAN}break;default:this.state=Nt.NONE}this.state!==Nt.NONE&&this.dispatchEvent(fh)}function cw(r){switch(this.state){case Nt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case Nt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case Nt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function uw(r){this.enabled===!1||this.enableZoom===!1||this.state!==Nt.NONE||(r.preventDefault(),this.dispatchEvent(fh),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(Fg))}function dw(r){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(r)}function hw(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case js.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=Nt.TOUCH_ROTATE;break;case js.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=Nt.TOUCH_PAN;break;default:this.state=Nt.NONE}break;case 2:switch(this.touches.TWO){case js.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=Nt.TOUCH_DOLLY_PAN;break;case js.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=Nt.TOUCH_DOLLY_ROTATE;break;default:this.state=Nt.NONE}break;default:this.state=Nt.NONE}this.state!==Nt.NONE&&this.dispatchEvent(fh)}function fw(r){switch(this._trackPointer(r),this.state){case Nt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case Nt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case Nt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case Nt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=Nt.NONE}}function pw(r){this.enabled!==!1&&r.preventDefault()}function mw(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function gw(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const _w=[{xyz:[5025e-8,-40296e-8,.04808044],rpy:[-3.14159265,0,0],axis:[0,0,1]},{xyz:[0,.09,-.075],rpy:[1.57079633,0,0],axis:[0,0,1]},{xyz:[0,-.612,-.017],rpy:[-3.14159265,0,0],axis:[0,0,1]},{xyz:[0,.59,-.0343],rpy:[3.14159265,0,0],axis:[0,0,1]},{xyz:[0,-.0425,-.0555],rpy:[1.57079633,0,0],axis:[0,0,-1]},{xyz:[0,-.0425,.0555],rpy:[-1.57079633,0,0],axis:[0,0,1]}],vw=["base_link","link1","link2","link3","link4","link5","link6"];function xw(r){const e=new Ut;return e.makeRotationFromEuler(new gi(r.rpy[0],r.rpy[1],r.rpy[2],"ZYX")),e.setPosition(r.xyz[0],r.xyz[1],r.xyz[2]),e}function eg(r,e){const n=[],s=[];let o=r;for(let l=0;l<6;l++){const d=new Qr;d.matrixAutoUpdate=!1,o.add(d),n.push(d);const u=new Qr;d.add(u),s.push(u),o=d}return{joints:n,links:s}}function yw({showPlanes:r=!0,ghostQ:e=null}){const n=qe.useRef(null),s=qe.useRef(e);s.current=e;const o=qe.useRef(r);o.current=r;const[l,d]=qe.useState(0),u=ct(y=>y.host),[f,p]=qe.useState(!1),g=qe.useRef(f);g.current=f;const v=qe.useRef(!0);return qe.useEffect(()=>{const y=n.current,M=new XE,w=new Jn(46,1,.05,40);w.position.set(1.8,-1.6,1.35),w.up.set(0,0,1);const C=new WE({antialias:!0,alpha:!0});C.setPixelRatio(Math.min(window.devicePixelRatio,2)),y.appendChild(C.domElement);const x=new rw(w,C.domElement);x.target.set(0,0,.45),x.enableDamping=!0,x.dampingFactor=.12,x.maxDistance=8,M.add(new ZE(14674175,2106414,1.05));const S=new $m(16777215,1.5);S.position.set(2.2,-1.6,3.2),M.add(S);const L=new $m(8959999,.5);L.position.set(-2.5,2,1.2),M.add(L);const b=new Zm(4,40,2766160,1712432);b.rotation.x=Math.PI/2,M.add(b);const N=new od({color:14344168,metalness:.55,roughness:.42}),$=new od({color:3900150,metalness:.5,roughness:.5}),k=new od({color:3718648,transparent:!0,opacity:.28,depthWrite:!1}),U=eg(M),X=eg(M),ae=X.joints[0],A=new nw,E=`http://${u}:8080/robot/meshes/erobo10/`;let V=0;vw.forEach((je,Ke)=>{A.load(E+je+".STL",$e=>{$e.computeVertexNormals();const O=Ke===0||Ke===3||Ke===6||Ke%2?N:$,Tt=new ti($e,O),lt=new ti($e,k);Ke===0?M.add(Tt):(U.links[Ke-1].add(Tt),X.links[Ke-1].add(lt)),V+=1,d(V)},void 0,()=>{})});const Y=new ew(.12);Y.matrixAutoUpdate=!1,M.add(Y);const se=new Gn,K=900,q=new Float32Array(K*3);se.setAttribute("position",new Un(q,3)),se.setDrawRange(0,0);const ue=new Dg(se,new Yl({color:3718648,transparent:!0,opacity:.8}));ue.frustumCulled=!1,M.add(ue);let z=0,he=0;const le=new Qr;M.add(le);let F="";async function oe(){try{const Ke=(await Qe.cmd({cmd:"get_safety"})).config||{},$e=JSON.stringify(Ke.planes||[]);if($e===F)return;F=$e,le.clear(),(Ke.planes||[]).forEach(O=>{if(!O.mode)return;const Tt=O.mode===1?15680580:16096779,lt=new Za(2.4,2.4),pt=new ch({color:Tt,transparent:!0,opacity:.1,side:Ei,depthWrite:!1}),Ze=new ti(lt,pt),At=new Q(...O.n).normalize();Ze.position.set(O.p[0],O.p[1],O.p[2]),Ze.quaternion.setFromUnitVectors(new Q(0,0,1),At),le.add(Ze);const Je=new Zm(2.4,12,Tt,Tt);Je.material.transparent=!0,Je.material.opacity=.22,Je.rotation.x=Math.PI/2,Ze.add(Je)})}catch{}}const Ne=setInterval(oe,2500);oe();const ee=(je,Ke)=>{const $e=new Ut;for(let O=0;O<6;O++){const Tt=_w[O];$e.makeRotationAxis(new Q(...Tt.axis).normalize(),Ke[O]||0),je.joints[O].matrix.copy(xw(Tt)).multiply($e)}};let de=0;const xe=()=>{const je=y.clientWidth,Ke=y.clientHeight;je&&Ke&&(C.setSize(je,Ke,!1),w.aspect=je/Ke,w.updateProjectionMatrix())},Se=new ResizeObserver(xe);Se.observe(y),xe();const Ae=new Ut,Pe=()=>{de=requestAnimationFrame(Pe);const je=Jd.s;if(je){ee(U,je.q);const Ke=s.current;ae.visible=!!Ke,Ke&&ee(X,Ke);const $e=je.tcp.pos,O=je.tcp.quat;Ae.makeRotationFromQuaternion(new wr(O[1],O[2],O[3],O[0])),Ae.setPosition($e[0],$e[1],$e[2]),Y.matrix.copy(Ae);const Tt=performance.now();if(v.current&&je.moving&&Tt-he>40){he=Tt;const lt=z%K;q[lt*3]=$e[0],q[lt*3+1]=$e[1],q[lt*3+2]=$e[2],z+=1,se.setDrawRange(0,Math.min(z,K)),se.attributes.position.needsUpdate=!0}g.current&&x.target.lerp(new Q($e[0],$e[1],$e[2]),.06),le.visible=o.current}x.update(),C.render(M,w)};return Pe(),()=>{cancelAnimationFrame(de),clearInterval(Ne),Se.disconnect(),x.dispose(),C.dispose(),y.removeChild(C.domElement)}},[u]),m.jsxs("div",{ref:n,className:"viewport",style:{width:"100%",height:"100%"},children:[m.jsxs("div",{className:"vp-tools",children:[m.jsx("button",{className:"btn sm",onClick:()=>p(y=>!y),children:f?"Free view":"Follow TCP"}),m.jsx("button",{className:"btn sm",onClick:()=>{v.current=!v.current},children:"Trace"})]}),l<7&&m.jsx("div",{className:"vp-hud",children:m.jsxs("span",{className:"chip",children:[m.jsx("span",{className:"dot"}),"Loading model… ",l,"/7"]})})]})}const Sw=["J1","J2","J3","J4","J5","J6"],Xr=180/Math.PI;function Mw(r){const[e,n,s,o]=r,l=Math.atan2(2*(e*n+s*o),1-2*(n*n+s*s)),d=Math.asin(Math.max(-1,Math.min(1,2*(e*s-o*n)))),u=Math.atan2(2*(e*o+n*s),1-2*(s*s+o*o));return[l,d,u]}function Ew(){const r=ct(L=>L.state),e=ct(L=>L.toast),[n,s]=qe.useState("jog"),[o,l]=qe.useState("base"),[d,u]=qe.useState(.35),f=qe.useRef(null),p=(L,b=o)=>{g();const N=()=>Qe.fire({cmd:"jog",frame:b,vel:L,speed:d});N(),f.current=window.setInterval(N,120)},g=()=>{f.current&&(clearInterval(f.current),f.current=null),Qe.fire({cmd:"jog",frame:o,vel:[0,0,0,0,0,0],speed:d})},v=(L,b)=>{const N=[0,0,0,0,0,0];N[L]=b*.6,p(N,"joint")},y=(L,b,N=!1)=>{const $=[0,0,0,0,0,0];$[N?3+L:L]=b*(N?.5:.12),p($)},[M,w]=qe.useState({x:"",y:"",z:"",r:"",p:"",yw:""}),C=()=>{if(!r)return;const[L,b,N]=Mw(r.tcp.quat);w({x:(r.tcp.pos[0]*1e3).toFixed(1),y:(r.tcp.pos[1]*1e3).toFixed(1),z:(r.tcp.pos[2]*1e3).toFixed(1),r:(L*Xr).toFixed(1),p:(b*Xr).toFixed(1),yw:(N*Xr).toFixed(1)})},x=async L=>{const b=[+M.x/1e3,+M.y/1e3,+M.z/1e3],N=[+M.r/Xr,+M.p/Xr,+M.yw/Xr];if(b.some(isNaN)||N.some(isNaN))return e("warn","Fill in all six target fields");const $=await Qe.cmd({cmd:L?"move_lin":"move_ptp",pos:b,rpy:N,speed:.5});$.ok||e("err",$.message||"Target unreachable")},S=(r==null?void 0:r.freedrive)??!1;return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 360px",gap:14,height:"100%"},children:[m.jsx(yw,{}),m.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12,minHeight:0,overflow:"auto"},children:[m.jsxs("div",{className:"panel",children:[m.jsxs("div",{className:"ph",children:["Hand guiding",m.jsx("span",{className:"grow"}),m.jsx("div",{className:`toggle ${S?"on":""}`,onClick:()=>Qe.cmd({cmd:"freedrive",on:!S})})]}),S&&m.jsx("div",{className:"pb small muted",children:"Drives in zero-torque mode — guide the arm by hand. Toggle off to hold position."})]}),m.jsxs("div",{className:"panel grow",style:{display:"flex",flexDirection:"column"},children:[m.jsxs("div",{className:"ph",children:[m.jsx("button",{className:`btn sm ${n==="jog"?"primary":""}`,onClick:()=>s("jog"),children:"Jog"}),m.jsx("button",{className:`btn sm ${n==="moveto"?"primary":""}`,onClick:()=>s("moveto"),children:"Move to"}),m.jsx("span",{className:"grow"}),n==="jog"&&m.jsxs("select",{className:"in",style:{width:96,padding:"5px 8px"},value:o,onChange:L=>l(L.target.value),children:[m.jsx("option",{value:"base",children:"Base"}),m.jsx("option",{value:"tool",children:"Tool"})]})]}),m.jsx("div",{className:"pb grow",style:{overflow:"auto"},children:n==="jog"?m.jsxs(m.Fragment,{children:[m.jsx("h3",{className:"sect",children:"Cartesian — translate (mm)"}),m.jsx("div",{className:"row",style:{justifyContent:"space-around"},children:["X","Y","Z"].map((L,b)=>m.jsxs("div",{style:{textAlign:"center"},children:[m.jsx("div",{className:"dim small",children:L}),m.jsxs("div",{className:"row",style:{gap:6},children:[m.jsx("button",{className:"jog2",onPointerDown:()=>y(b,-1),onPointerUp:g,onPointerLeave:g,children:"−"}),m.jsx("button",{className:"jog2",onPointerDown:()=>y(b,1),onPointerUp:g,onPointerLeave:g,children:"+"})]})]},L))}),m.jsx("h3",{className:"sect",children:"Cartesian — rotate"}),m.jsx("div",{className:"row",style:{justifyContent:"space-around"},children:["RX","RY","RZ"].map((L,b)=>m.jsxs("div",{style:{textAlign:"center"},children:[m.jsx("div",{className:"dim small",children:L}),m.jsxs("div",{className:"row",style:{gap:6},children:[m.jsx("button",{className:"jog2",onPointerDown:()=>y(b,-1,!0),onPointerUp:g,onPointerLeave:g,children:"−"}),m.jsx("button",{className:"jog2",onPointerDown:()=>y(b,1,!0),onPointerUp:g,onPointerLeave:g,children:"+"})]})]},L))}),m.jsx("h3",{className:"sect",children:"Joints"}),Sw.map((L,b)=>m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"jname",children:L}),m.jsx("button",{className:"jog2",onPointerDown:()=>v(b,-1),onPointerUp:g,onPointerLeave:g,children:"−"}),m.jsx("div",{className:"grow",children:m.jsx("div",{className:"bar",children:m.jsx("i",{style:{width:`${r?(r.q[b]+Math.PI)/(2*Math.PI)*100:50}%`}})})}),m.jsx("button",{className:"jog2",onPointerDown:()=>v(b,1),onPointerUp:g,onPointerLeave:g,children:"+"}),m.jsxs("span",{className:"jval",children:[r?(r.q[b]*Xr).toFixed(1):"—","°"]})]},L)),m.jsxs("div",{className:"row",style:{marginTop:10},children:[m.jsx("span",{className:"dim small",children:"Jog speed"}),m.jsx("input",{type:"range",min:5,max:100,value:d*100,className:"grow",onChange:L=>u(+L.target.value/100)}),m.jsxs("b",{className:"mono small",children:[Math.round(d*100),"%"]})]})]}):m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"grid2",children:[["x","y","z"].map(L=>m.jsxs("div",{className:"field",children:[m.jsxs("label",{children:[L.toUpperCase()," (mm)"]}),m.jsx("input",{className:"in mono",value:M[L],onChange:b=>w({...M,[L]:b.target.value})})]},L)),["r","p","yw"].map((L,b)=>m.jsxs("div",{className:"field",children:[m.jsxs("label",{children:[["Roll","Pitch","Yaw"][b]," (°)"]}),m.jsx("input",{className:"in mono",value:M[L],onChange:N=>w({...M,[L]:N.target.value})})]},L))]}),m.jsxs("div",{className:"row",children:[m.jsx("button",{className:"btn sm",onClick:C,children:"Use current pose"}),m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn primary",onClick:()=>x(!1),children:"MoveJ"}),m.jsx("button",{className:"btn primary",onClick:()=>x(!0),children:"MoveL"})]})]})})]}),m.jsx("button",{className:"btn danger",style:{padding:"12px"},onClick:()=>Qe.cmd({cmd:"stop"}),children:"STOP MOTION (Esc)"})]})]})}const ud={movej:"MoveJ",movel:"MoveL",movep:"MoveP",movec:"MoveC",wait:"Wait",wait_di:"Wait DI",set_do:"Set DO",set_ao:"Set AO",set_speed:"Speed",set_payload:"Payload",set_tcp:"Tool",comment:"Note",halt:"Halt"};function ww(r,e){const n=s=>{var o;return((o=e.find(l=>l.id===s))==null?void 0:o.name)||s};switch(r.type){case"movej":case"movel":return r.wp?`to ${n(r.wp)}`:r.q?"to joints":"to pose";case"movep":return`${(r.wps||[]).length} waypoints, blend ${((r.blend??.02)*1e3).toFixed(0)} mm`;case"movec":return`via ${n(r.via)} → ${n(r.end)}`;case"wait":return`${r.sec}s`;case"wait_di":return`DI${r.di} = ${r.value??1}${r.timeout?` (max ${r.timeout}s)`:""}`;case"set_do":return`DO${r.do} = ${r.value??1}`;case"set_ao":return`AO${r.ao} = ${r.volts} V`;case"set_speed":return`${Math.round((r.frac??1)*100)}%`;case"set_payload":return`${r.kg} kg`;case"set_tcp":return r.tool;case"comment":return r.text||"";default:return""}}function Tw(){const r=ct(E=>E.toast),e=ct(E=>E.state),n=ct(E=>E.progEvents),[s,o]=qe.useState([]),[l,d]=qe.useState([]),[u,f]=qe.useState(null),[p,g]=qe.useState(-1),[v,y]=qe.useState(!1),M=async()=>{const[E,V]=await Promise.all([Qe.cmd({cmd:"prog_list"}),Qe.cmd({cmd:"wp_list"})]);o(E.programs||[]),d(V.waypoints||[])};qe.useEffect(()=>{M()},[]);const w=async E=>{const V=await Qe.cmd({cmd:"prog_get",id:E});f(V.program),g(-1),y(!1)},C=()=>{f({name:"New program",steps:[],speed:.5,loop:!1}),y(!0)},x=async()=>{if(!u)return;const E=await Qe.cmd({cmd:"prog_save",program:u});if(E.type==="error")return r("err",E.message);r("ok","Program saved"),y(!1),!u.id&&E.saved&&f({...u,id:E.saved}),M()},S=async()=>{if(!(u!=null&&u.id))return r("warn","Save the program first");v&&await x();const E=await Qe.cmd({cmd:"prog_run",id:u.id});E.event!=="accepted"&&r("err",E.message||"could not start")},L=()=>Qe.cmd({cmd:"program_stop"}),b=E=>{if(!u)return;const V={type:E};E==="wait"&&(V.sec=1),E==="wait_di"&&(V.di=0,V.value=1,V.timeout=30),E==="set_do"&&(V.do=0,V.value=1),E==="set_ao"&&(V.ao=0,V.volts=0),E==="set_speed"&&(V.frac=.5),E==="set_payload"&&(V.kg=0),E==="movep"&&(V.wps=[]),f({...u,steps:[...u.steps,V]}),g(u.steps.length),y(!0)},N=(E,V)=>{if(!u)return;const Y=u.steps.slice();Y[E]={...Y[E],...V},f({...u,steps:Y}),y(!0)},$=(E,V)=>{if(!u)return;const Y=E+V;if(Y<0||Y>=u.steps.length)return;const se=u.steps.slice();[se[E],se[Y]]=[se[Y],se[E]],f({...u,steps:se}),g(Y),y(!0)},k=E=>{u&&(f({...u,steps:u.steps.filter((V,Y)=>Y!==E)}),g(-1),y(!0))},U=async()=>{const E=prompt("Waypoint name",`P${l.length+1}`);if(!E)return;const V=await Qe.cmd({cmd:"wp_save",name:E});if(V.saved)return r("ok",`Waypoint “${E}” taught`),M(),V.saved},X=e!=null&&e.program.running&&e.program.id===(u==null?void 0:u.id)?e.program.step:-1,ae=u&&p>=0?u.steps[p]:null,A=l.map(E=>m.jsx("option",{value:E.id,children:E.name},E.id));return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"230px 1fr 330px",gap:14,height:"100%"},children:[m.jsxs("div",{className:"panel",style:{display:"flex",flexDirection:"column",minHeight:0},children:[m.jsxs("div",{className:"ph",children:["Programs ",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm",onClick:C,children:"New"})]}),m.jsxs("div",{className:"pb grow",style:{overflow:"auto"},children:[s.map(E=>m.jsx("div",{className:`step ${(u==null?void 0:u.id)===E.id?"sel":""}`,style:{marginBottom:6},onClick:()=>w(E.id),children:m.jsxs("div",{className:"sname",children:[m.jsx("div",{children:E.name}),m.jsxs("div",{className:"dim small",children:[E.nsteps," steps · ",E.runs||0," runs"]})]})},E.id)),!s.length&&m.jsx("p",{className:"dim small",children:"No programs yet — create one, teach waypoints, add steps, run."})]})]}),m.jsxs("div",{className:"panel",style:{display:"flex",flexDirection:"column",minHeight:0},children:[m.jsxs("div",{className:"ph",children:[u?m.jsx("input",{className:"in",style:{width:240,padding:"6px 9px"},value:u.name,onChange:E=>{f({...u,name:E.target.value}),y(!0)}}):"Steps",m.jsx("span",{className:"grow"}),u&&m.jsxs(m.Fragment,{children:[m.jsxs("label",{className:"row small dim",style:{gap:5},children:[m.jsx("div",{className:`toggle ${u.loop?"on":""}`,onClick:()=>{f({...u,loop:!u.loop}),y(!0)}}),"Loop"]}),m.jsx("button",{className:"btn sm",disabled:!v,onClick:x,children:"Save"}),e!=null&&e.program.running?m.jsx("button",{className:"btn sm danger",onClick:L,children:"Stop"}):m.jsx("button",{className:"btn sm good",onClick:S,children:"▶ Run"})]})]}),m.jsxs("div",{className:"pb grow",style:{overflow:"auto"},children:[!u&&m.jsx("p",{className:"dim",children:"Select or create a program."}),u&&m.jsxs("div",{className:"steps",children:[u.steps.map((E,V)=>m.jsxs("div",{className:`step ${p===V?"sel":""} ${X===V?"active":""} ${X>V?"done":""}`,onClick:()=>g(V),children:[m.jsx("span",{className:"dim small mono",children:V+1}),m.jsx("span",{className:"stype",children:ud[E.type]||E.type}),m.jsx("span",{className:"sname",children:E.name||ww(E,l)}),m.jsx("button",{className:"btn sm icon",onClick:Y=>{Y.stopPropagation(),$(V,-1)},children:"↑"}),m.jsx("button",{className:"btn sm icon",onClick:Y=>{Y.stopPropagation(),$(V,1)},children:"↓"}),m.jsx("button",{className:"btn sm icon",onClick:Y=>{Y.stopPropagation(),k(V)},children:"✕"})]},V)),!u.steps.length&&m.jsx("p",{className:"dim small",children:"Empty program — add steps below."}),m.jsx("div",{className:"row",style:{flexWrap:"wrap",gap:6,marginTop:8},children:Object.keys(ud).map(E=>m.jsxs("button",{className:"btn sm",onClick:()=>b(E),children:["+ ",ud[E]]},E))})]})]})]}),m.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12,minHeight:0},children:[m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Step parameters"}),m.jsxs("div",{className:"pb",children:[!ae&&m.jsx("p",{className:"dim small",children:"Select a step to edit its parameters."}),ae&&m.jsxs(m.Fragment,{children:[["movej","movel"].includes(ae.type)&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Waypoint"}),m.jsxs("select",{className:"in",value:ae.wp||"",onChange:E=>N(p,{wp:E.target.value}),children:[m.jsx("option",{value:"",children:"— choose —"}),A]})]}),m.jsx("button",{className:"btn sm",onClick:async()=>{const E=await U();E&&N(p,{wp:E})},children:"⊕ Teach current pose as new waypoint"})]}),ae.type==="movec"&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Via waypoint"}),m.jsxs("select",{className:"in",value:ae.via||"",onChange:E=>N(p,{via:E.target.value}),children:[m.jsx("option",{value:"",children:"— choose —"}),A]})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"End waypoint"}),m.jsxs("select",{className:"in",value:ae.end||"",onChange:E=>N(p,{end:E.target.value}),children:[m.jsx("option",{value:"",children:"— choose —"}),A]})]})]}),ae.type==="movep"&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Waypoints (in order)"}),(ae.wps||[]).map((E,V)=>m.jsxs("div",{className:"row",children:[m.jsx("select",{className:"in",value:E,onChange:Y=>{const se=ae.wps.slice();se[V]=Y.target.value,N(p,{wps:se})},children:A}),m.jsx("button",{className:"btn sm icon",onClick:()=>N(p,{wps:ae.wps.filter((Y,se)=>se!==V)}),children:"✕"})]},V)),m.jsx("button",{className:"btn sm",onClick:()=>{var E;return N(p,{wps:[...ae.wps||[],((E=l[0])==null?void 0:E.id)||""]})},children:"+ add waypoint"})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Blend radius (mm)"}),m.jsx("input",{className:"in mono",value:(ae.blend??.02)*1e3,onChange:E=>N(p,{blend:+E.target.value/1e3})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Tool speed (mm/s)"}),m.jsx("input",{className:"in mono",value:(ae.tool_speed??.15)*1e3,onChange:E=>N(p,{tool_speed:+E.target.value/1e3})})]})]}),ae.type==="wait"&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Seconds"}),m.jsx("input",{className:"in mono",value:ae.sec,onChange:E=>N(p,{sec:+E.target.value})})]}),ae.type==="wait_di"&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Input DI"}),m.jsx("input",{className:"in mono",value:ae.di,onChange:E=>N(p,{di:+E.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Wait for value"}),m.jsxs("select",{className:"in",value:ae.value,onChange:E=>N(p,{value:+E.target.value}),children:[m.jsx("option",{value:1,children:"HIGH (1)"}),m.jsx("option",{value:0,children:"LOW (0)"})]})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Timeout (s, 0 = forever)"}),m.jsx("input",{className:"in mono",value:ae.timeout??0,onChange:E=>N(p,{timeout:+E.target.value})})]})]}),ae.type==="set_do"&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Output DO"}),m.jsx("input",{className:"in mono",value:ae.do,onChange:E=>N(p,{do:+E.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Value"}),m.jsxs("select",{className:"in",value:ae.value,onChange:E=>N(p,{value:+E.target.value}),children:[m.jsx("option",{value:1,children:"HIGH (1)"}),m.jsx("option",{value:0,children:"LOW (0)"})]})]})]}),ae.type==="set_ao"&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Output AO"}),m.jsxs("select",{className:"in",value:ae.ao,onChange:E=>N(p,{ao:+E.target.value}),children:[m.jsx("option",{value:0,children:"AO0"}),m.jsx("option",{value:1,children:"AO1"})]})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Volts"}),m.jsx("input",{className:"in mono",value:ae.volts,onChange:E=>N(p,{volts:+E.target.value})})]})]}),ae.type==="set_speed"&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Speed %"}),m.jsx("input",{className:"in mono",value:Math.round((ae.frac??1)*100),onChange:E=>N(p,{frac:+E.target.value/100})})]}),ae.type==="set_payload"&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Payload (kg)"}),m.jsx("input",{className:"in mono",value:ae.kg,onChange:E=>N(p,{kg:+E.target.value})})]}),ae.type==="set_tcp"&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Tool name"}),m.jsx("input",{className:"in",value:ae.tool||"",onChange:E=>N(p,{tool:E.target.value})})]}),ae.type==="comment"&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Text"}),m.jsx("input",{className:"in",value:ae.text||"",onChange:E=>N(p,{text:E.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Step label (optional)"}),m.jsx("input",{className:"in",value:ae.name||"",onChange:E=>N(p,{name:E.target.value})})]}),["movej","movel","movec"].includes(ae.type)&&m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Speed override (0–1, blank = program)"}),m.jsx("input",{className:"in mono",value:ae.speed??"",onChange:E=>N(p,{speed:E.target.value===""?void 0:+E.target.value})})]})]})]})]}),m.jsxs("div",{className:"panel grow",style:{display:"flex",flexDirection:"column",minHeight:120},children:[m.jsx("div",{className:"ph",children:"Run console"}),m.jsx("div",{className:"pb grow mono small",style:{overflow:"auto"},children:n.slice(-40).map((E,V)=>m.jsxs("div",{style:{color:E.event==="error"?"var(--err)":E.event==="done"?"var(--ok)":"var(--text1)"},children:[E.event,E.name?` · ${E.name}`:"",E.message?` — ${E.message}`:""]},V))})]})]})]})}function Aw(){const[r,e]=qe.useState(null),n=ct(f=>f.toast),s=async()=>{const f=await Qe.cmd({cmd:"io_get"});f.io&&e(f.io)};qe.useEffect(()=>{s();const f=setInterval(s,500);return()=>clearInterval(f)},[]);const o=async(f,p)=>{await Qe.cmd({cmd:"io_set",do:f,value:p?1:0}),s()},l=async(f,p)=>{await Qe.cmd({cmd:"di_force",di:f,value:p?1:0}),s(),n("warn",`DI${f} forced ${p?"HIGH":"LOW"} (controller-level input)`)},d=async(f,p)=>{await Qe.cmd({cmd:"io_set",ao:f,volts:p}),s()},u=(f,p)=>(f>>p&1)===1;return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"},children:[m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Digital outputs"}),m.jsx("div",{className:"pb io-grid",children:Array.from({length:16},(f,p)=>m.jsxs("div",{className:"io-cell",children:[m.jsx("span",{className:`led ${r&&u(r.do_state,p)?"on":""}`}),m.jsxs("span",{className:"grow mono",children:["DO",p]}),m.jsx("div",{className:`toggle ${r&&u(r.do_cmd,p)?"on":""}`,onClick:()=>r&&o(p,!u(r.do_cmd,p))})]},p))})]}),m.jsxs("div",{className:"panel",children:[m.jsxs("div",{className:"ph",children:["Digital inputs ",m.jsx("span",{className:"dim small",children:"(tap to force — PLC handshake / simulation)"})]}),m.jsx("div",{className:"pb io-grid",children:Array.from({length:16},(f,p)=>m.jsxs("div",{className:"io-cell",style:{cursor:"pointer"},onClick:()=>r&&l(p,!u(r.di,p)),children:[m.jsx("span",{className:`led ${r&&u(r.di,p)?"on":""}`}),m.jsxs("span",{className:"grow mono",children:["DI",p]})]},p))})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Analog"}),m.jsxs("div",{className:"pb",children:[[0,1].map(f=>m.jsxs("div",{className:"jrow",children:[m.jsxs("span",{className:"jname",children:["AO",f]}),m.jsx("input",{type:"range",min:0,max:10,step:.1,className:"grow",value:(r==null?void 0:r.ao[f])??0,onChange:p=>d(f,+p.target.value)}),m.jsxs("span",{className:"jval",children:[((r==null?void 0:r.ao[f])??0).toFixed(1)," V"]})]},f)),[0,1].map(f=>m.jsxs("div",{className:"jrow",children:[m.jsxs("span",{className:"jname",children:["AI",f]}),m.jsx("div",{className:"grow bar",children:m.jsx("i",{style:{width:`${((r==null?void 0:r.ai[f])??0)/10*100}%`}})}),m.jsxs("span",{className:"jval",children:[((r==null?void 0:r.ai[f])??0).toFixed(2)," V"]})]},f))]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Fieldbus map (Modbus TCP · port 1502)"}),m.jsxs("div",{className:"pb small muted",style:{lineHeight:1.7},children:["Coils 0–15 = DO · Discrete inputs 0–15 = DI.",m.jsx("br",{}),"Input regs: 0 mode · 1 enabled · 2 e-stop · 3 moving · 5 speed % · 7 safety code · 9 program running · 16–21 q [mrad] · 28–30 TCP xyz [0.1 mm] · 40 TCP speed [mm/s].",m.jsx("br",{}),"Holding regs: 0 speed ×1000 · 1 command (1 start prog #reg2 · 2 stop · 3 enable · 4 disable · 5 reset · 6 E-STOP) · 2 program number.",m.jsx("br",{}),"Full map: ",m.jsx("span",{className:"mono",children:"docs/INTEGRATION_API.md"})]})]})]})}function Cw(){const[r,e]=qe.useState(null),[n,s]=qe.useState(!1),o=ct(v=>v.toast),l=ct(v=>v.state),d=async()=>{const v=await Qe.cmd({cmd:"get_safety"});v.config&&(e(v.config),s(!1))};qe.useEffect(()=>{d()},[]);const u=v=>{r&&(e({...r,...v}),s(!0))},f=async()=>{if(!r)return;const v=await Qe.cmd({cmd:"set_safety",config:r});v.config?(e(v.config),s(!1),o("ok","Safety configuration applied and persisted")):o("err",v.message||"failed")},p=v=>{!r||!l||u({planes:[...r.planes,{mode:v,p:[0,0,+l.tcp.pos[2].toFixed(4)],n:[0,0,1]}]})},g=(v,y=!1)=>Math.abs(v)>1e8?"":String(v);return r?m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"},children:[m.jsxs("div",{className:"panel",children:[m.jsxs("div",{className:"ph",children:["Speed & force limits",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm primary",disabled:!n,onClick:f,children:"Apply"})]}),m.jsxs("div",{className:"pb",children:[m.jsxs("div",{className:"grid2",children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"TCP speed max (m/s)"}),m.jsx("input",{className:"in mono",value:r.tcp_speed_max,onChange:v=>u({tcp_speed_max:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Reduced-zone speed (m/s)"}),m.jsx("input",{className:"in mono",value:r.tcp_speed_reduced,onChange:v=>u({tcp_speed_reduced:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"TCP force limit (N)"}),m.jsx("input",{className:"in mono",value:r.tcp_force_max,onChange:v=>u({tcp_force_max:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Elbow speed max (m/s)"}),m.jsx("input",{className:"in mono",value:r.elbow_speed_max,onChange:v=>u({elbow_speed_max:+v.target.value})})]})]}),m.jsx("p",{className:"dim small",children:"Measured limits trip a protective stop with 15 % hysteresis; the planner limits commanded motion first. The hardware E-stop chain is independent of software."})]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Workspace bounds"}),m.jsxs("div",{className:"pb grid2",children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Max reach (m, 0 = off)"}),m.jsx("input",{className:"in mono",value:r.reach_max,onChange:v=>u({reach_max:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Base keep-out radius (m)"}),m.jsx("input",{className:"in mono",value:r.base_cyl_r,onChange:v=>u({base_cyl_r:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Floor z-min (m)"}),m.jsx("input",{className:"in mono",placeholder:"off",value:g(r.z_min),onChange:v=>u({z_min:v.target.value===""?-1e9:+v.target.value})})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Ceiling z-max (m)"}),m.jsx("input",{className:"in mono",placeholder:"off",value:g(r.z_max,!0),onChange:v=>u({z_max:v.target.value===""?1e9:+v.target.value})})]})]})]}),m.jsxs("div",{className:"panel",style:{gridColumn:"1 / -1"},children:[m.jsxs("div",{className:"ph",children:["Safety planes",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm",onClick:()=>p(2),children:"+ Reduced at TCP height"}),m.jsx("button",{className:"btn sm",onClick:()=>p(1),children:"+ Forbidden at TCP height"})]}),m.jsxs("div",{className:"pb",children:[m.jsxs("table",{className:"tbl",children:[m.jsx("thead",{children:m.jsxs("tr",{children:[m.jsx("th",{children:"#"}),m.jsx("th",{children:"Mode"}),m.jsx("th",{children:"Point (m)"}),m.jsx("th",{children:"Normal (keep on + side)"}),m.jsx("th",{})]})}),m.jsxs("tbody",{children:[r.planes.map((v,y)=>m.jsxs("tr",{children:[m.jsx("td",{children:y+1}),m.jsx("td",{children:m.jsxs("select",{className:"in",style:{width:130},value:v.mode,onChange:M=>{const w=r.planes.slice();w[y]={...v,mode:+M.target.value},u({planes:w})},children:[m.jsx("option",{value:0,children:"Off"}),m.jsx("option",{value:1,children:"Forbidden"}),m.jsx("option",{value:2,children:"Reduced"})]})}),["p","n"].map(M=>m.jsx("td",{children:m.jsx("div",{className:"row",style:{gap:4},children:[0,1,2].map(w=>m.jsx("input",{className:"in mono",style:{width:76},value:v[M][w],onChange:C=>{const x=r.planes.slice(),S=v[M].slice();S[w]=+C.target.value,x[y]={...v,[M]:S},u({planes:x})}},w))})},M)),m.jsx("td",{children:m.jsx("button",{className:"btn sm icon",onClick:()=>u({planes:r.planes.filter((M,w)=>w!==y)}),children:"✕"})})]},y)),!r.planes.length&&m.jsx("tr",{children:m.jsx("td",{colSpan:5,className:"dim",children:"No planes configured. Planes show in the 3-D view (red = forbidden, amber = reduced)."})})]})]}),m.jsx("p",{className:"dim small",style:{marginTop:8},children:"Targets beyond a forbidden boundary are rejected before motion starts; running motion decelerates into the boundary. Applying safety changes requires an admin login for remote (REST) clients."})]})]}),m.jsxs("div",{className:"panel",style:{gridColumn:"1 / -1"},children:[m.jsx("div",{className:"ph",children:"Contact & collision monitoring"}),m.jsxs("div",{className:"pb row",style:{gap:22,flexWrap:"wrap"},children:[m.jsxs("div",{children:[m.jsx("div",{className:"dim small",children:"Contact detection (torque residual)"}),m.jsxs("div",{className:"row",style:{marginTop:6},children:[m.jsx("button",{className:"btn sm",onClick:()=>Qe.cmd({cmd:"set_contact",on:1,sensitivity:.5}),children:"Enable"}),m.jsx("button",{className:"btn sm",onClick:()=>Qe.cmd({cmd:"set_contact",on:0}),children:"Disable"})]})]}),m.jsxs("div",{children:[m.jsx("div",{className:"dim small",children:"Self-collision monitor"}),m.jsxs("div",{className:"row",style:{marginTop:6},children:[m.jsx("button",{className:"btn sm",onClick:()=>Qe.cmd({cmd:"set_collision",on:!0}),children:"Enable"}),m.jsx("button",{className:"btn sm",onClick:()=>Qe.cmd({cmd:"set_collision",on:!1}),children:"Disable"})]})]}),m.jsx("div",{className:"grow"}),m.jsxs("div",{children:[m.jsx("div",{className:"dim small",children:"Live status"}),m.jsxs("div",{className:"row",style:{marginTop:6,gap:8},children:[m.jsxs("span",{className:`chip ${(l==null?void 0:l.safety.zone)===2?"err":(l==null?void 0:l.safety.zone)===1?"warn":"ok"}`,children:[m.jsx("span",{className:"dot"}),"zone: ",["normal","reduced","forbidden"][(l==null?void 0:l.safety.zone)??0]]}),m.jsxs("span",{className:"chip",children:[m.jsx("span",{className:"dot"}),"clearance ",((l==null?void 0:l.coll_dist)??0).toFixed(3)," m"]})]})]})]})]})]}):m.jsx("p",{className:"dim",children:"Loading safety configuration…"})}function Rw(){const[r,e]=qe.useState([]),[n,s]=qe.useState(null),[o,l]=qe.useState(null),[d,u]=qe.useState(null),f=ct(x=>x.toast),p=ct(x=>x.state),g=async()=>{const x=await Qe.cmd({cmd:"tool_list"});e(x.tools||[]),s(x.active||null)};qe.useEffect(()=>{g()},[]);const v=async x=>{const S=await Qe.cmd({cmd:"tool_select",name:x});if(S.type==="error")return f("err",S.message);f("ok",`Tool “${x}” active`),g()},y=async()=>{if(!o)return;const x=await Qe.cmd({cmd:"tool_save",name:o.name,pos:o.pos,quat:o.quat,payload:o.payload,cog:o.cog});if(x.type==="error")return f("err",x.message);f("ok","Tool saved"),l(null),g()},M=()=>{if(!p)return;const x=[...p.flange.pos,...p.flange.quat];u(S=>({flanges:[...(S==null?void 0:S.flanges)||[],x]}))},w=async x=>{if(!d||d.flanges.length<4)return f("warn","Capture at least 4 poses (tip on the same fixed point)");const S=await Qe.cmd({cmd:"tcp_teach",flanges:d.flanges,apply:x,name:(n==null?void 0:n.name)||"tool"});if(!S.ok)return f("err","solve failed — poses too similar?");u({...d,rms:S.rms,offset:S.offset}),x&&(f("ok",`TCP applied (RMS ${(S.rms*1e3).toFixed(2)} mm)`),g())},C=x=>x.map(S=>(S*1e3).toFixed(1)).join(", ");return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"},children:[m.jsxs("div",{className:"panel",children:[m.jsxs("div",{className:"ph",children:["Tool library",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm",onClick:()=>l({name:"new tool",pos:[0,0,.1],quat:[1,0,0,0],payload:0,cog:[0,0,.05]}),children:"+ New tool"})]}),m.jsxs("div",{className:"pb",children:[m.jsxs("table",{className:"tbl",children:[m.jsx("thead",{children:m.jsxs("tr",{children:[m.jsx("th",{children:"Name"}),m.jsx("th",{children:"Offset (mm)"}),m.jsx("th",{children:"Payload"}),m.jsx("th",{})]})}),m.jsxs("tbody",{children:[r.map(x=>m.jsxs("tr",{children:[m.jsxs("td",{children:[m.jsx("b",{children:x.name})," ",x.active&&m.jsxs("span",{className:"chip ok",style:{marginLeft:6,padding:"2px 8px"},children:[m.jsx("span",{className:"dot"}),"active"]})]}),m.jsx("td",{className:"mono",children:C(x.pos)}),m.jsxs("td",{className:"mono",children:[x.payload," kg"]}),m.jsxs("td",{className:"row",style:{gap:4,justifyContent:"flex-end"},children:[!x.active&&m.jsx("button",{className:"btn sm",onClick:()=>v(x.name),children:"Activate"}),m.jsx("button",{className:"btn sm",onClick:()=>l({...x}),children:"Edit"})]})]},x.name)),!r.length&&m.jsx("tr",{children:m.jsx("td",{colSpan:4,className:"dim",children:"No tools defined — the bare flange is active."})})]})]}),n&&m.jsxs("p",{className:"dim small",style:{marginTop:8},children:["Active TCP: ",m.jsx("b",{children:n.name})," · offset ",C(n.pos)," mm · payload ",n.payload," kg"]})]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"TCP teach — 4-point method"}),m.jsxs("div",{className:"pb",children:[m.jsxs("p",{className:"muted small",children:["Touch the SAME fixed point with the tool tip from different orientations (freedrive or jog), pressing ",m.jsx("b",{children:"Capture"})," each time. 4+ poses solve the tool offset."]}),m.jsxs("div",{className:"row",style:{margin:"10px 0"},children:[m.jsxs("button",{className:"btn",onClick:M,children:["⊕ Capture pose (",(d==null?void 0:d.flanges.length)||0,")"]}),m.jsx("button",{className:"btn",onClick:()=>u(null),children:"Reset"}),m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn",onClick:()=>w(!1),children:"Solve"}),m.jsx("button",{className:"btn primary",onClick:()=>w(!0),children:"Solve & apply"})]}),(d==null?void 0:d.offset)&&m.jsxs("p",{className:"small mono",children:["offset = [",C(d.offset),"] mm · RMS ",(1e3*(d.rms||0)).toFixed(2)," mm"]})]})]}),o&&m.jsx("div",{className:"modal-bg",onClick:()=>l(null),children:m.jsxs("div",{className:"modal",onClick:x=>x.stopPropagation(),children:[m.jsx("div",{className:"mh",children:"Edit tool"}),m.jsxs("div",{className:"mb",children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Name"}),m.jsx("input",{className:"in",value:o.name,onChange:x=>l({...o,name:x.target.value})})]}),m.jsxs("div",{className:"grid2",children:[["x","y","z"].map((x,S)=>m.jsxs("div",{className:"field",children:[m.jsxs("label",{children:["Offset ",x.toUpperCase()," (mm)"]}),m.jsx("input",{className:"in mono",value:o.pos[S]*1e3,onChange:L=>{const b=o.pos.slice();b[S]=+L.target.value/1e3,l({...o,pos:b})}})]},x)),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Payload (kg)"}),m.jsx("input",{className:"in mono",value:o.payload,onChange:x=>l({...o,payload:+x.target.value})})]}),["x","y","z"].map((x,S)=>m.jsxs("div",{className:"field",children:[m.jsxs("label",{children:["CoG ",x.toUpperCase()," (mm)"]}),m.jsx("input",{className:"in mono",value:o.cog[S]*1e3,onChange:L=>{const b=o.cog.slice();b[S]=+L.target.value/1e3,l({...o,cog:b})}})]},x))]}),m.jsx("p",{className:"dim small",children:"Orientation is set by TCP teach (orientation method) or kept as-is; payload + CoG feed gravity compensation and contact detection."})]}),m.jsxs("div",{className:"mf",children:[m.jsx("button",{className:"btn",onClick:()=>l(null),children:"Cancel"}),m.jsx("button",{className:"btn primary",onClick:y,children:"Save tool"})]})]})})]})}const bw=["J1","J2","J3","J4","J5","J6"],Pw=[281,281,140,51,51,51];function Nw({get:r,color:e="var(--accent)"}){const n=qe.useRef(null);return qe.useEffect(()=>{const s=n.current,o=s.getContext("2d"),l=[];let d=0,u=0;const f=p=>{if(d=requestAnimationFrame(f),p-u<100)return;u=p,l.push(r()),l.length>120&&l.shift();const g=s.width,v=s.height;o.clearRect(0,0,g,v);const y=Math.max(1e-9,...l.map(Math.abs));o.strokeStyle=getComputedStyle(s).getPropertyValue("color")||"#3b82f6",o.lineWidth=1.5,o.beginPath(),l.forEach((M,w)=>{const C=w/119*g,x=v-(M/y*.5+.5)*v;w?o.lineTo(C,x):o.moveTo(C,x)}),o.stroke()};return d=requestAnimationFrame(f),()=>cancelAnimationFrame(d)},[r]),m.jsx("canvas",{ref:n,width:220,height:40,style:{width:"100%",height:40,color:e}})}function Lw(){const r=ct(s=>s.state),[e,n]=qe.useState([]);return qe.useEffect(()=>{Qe.rest("GET","/api/v1/metrics").then(s=>n(s.alarms_24h||[])).catch(()=>{})},[]),m.jsxs("div",{children:[m.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:12},children:bw.map((s,o)=>{var u,f;const l=r?Math.abs(r.torque[o])/Pw[o]:0,d=(r==null?void 0:r.temp[o])??0;return m.jsxs("div",{className:"panel",children:[m.jsxs("div",{className:"ph",children:[s,m.jsx("span",{className:"grow"}),m.jsxs("span",{className:`chip ${((u=r==null?void 0:r.joint_op)==null?void 0:u[o])===!1?"err":"ok"}`,style:{padding:"3px 9px"},children:[m.jsx("span",{className:"dot"}),((f=r==null?void 0:r.joint_op)==null?void 0:f[o])===!1?"FAULT":"OK"]})]}),m.jsxs("div",{className:"pb",children:[m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"jname dim",children:"pos"}),m.jsxs("span",{className:"grow mono small",children:[r?(r.q[o]*57.2958).toFixed(2):"—","°"]}),m.jsx("span",{className:"jname dim",children:"vel"}),m.jsxs("span",{className:"mono small",children:[r?(r.qd[o]*57.2958).toFixed(1):"—","°/s"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"jname dim",children:"τ"}),m.jsx("div",{className:`grow bar ${l>.85?"err":l>.6?"warn":""}`,children:m.jsx("i",{style:{width:`${Math.min(100,l*100)}%`}})}),m.jsxs("span",{className:"jval",children:[r?r.torque[o].toFixed(1):"—"," Nm"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"jname dim",children:"°C"}),m.jsx("div",{className:`grow bar ${d>70?"err":d>55?"warn":""}`,children:m.jsx("i",{style:{width:`${Math.min(100,d/85*100)}%`}})}),m.jsxs("span",{className:"jval",children:[d.toFixed(0)," °C"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"jname dim",children:"A"}),m.jsxs("span",{className:"grow mono small",children:[r?r.current[o].toFixed(2):"—"," A"]}),m.jsx("span",{className:"jname dim",children:"V"}),m.jsxs("span",{className:"mono small",children:[r?r.voltage[o].toFixed(0):"—"," V"]}),m.jsx("span",{className:"jname dim",children:"brk"}),m.jsx("span",{className:`led ${r!=null&&r.brake[o]?"on":""}`,title:"brake released"})]}),m.jsx(Nw,{get:()=>{var p;return((p=Jd.s)==null?void 0:p.torque[o])??0}})]})]},s)})}),m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:12},children:[m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Real-time health"}),m.jsxs("div",{className:"pb small",children:[m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Control-loop jitter (1 s max)"}),m.jsxs("b",{className:"mono",children:[r==null?void 0:r.jitter_us.toFixed(0)," µs"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Cycle overruns since boot"}),m.jsx("b",{className:"mono",children:r==null?void 0:r.overruns})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Manipulability"}),m.jsx("b",{className:"mono",children:r==null?void 0:r.manip.toFixed(4)})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Self-collision clearance"}),m.jsxs("b",{className:"mono",children:[r==null?void 0:r.coll_dist.toFixed(3)," m"]})]})]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"TCP"}),m.jsxs("div",{className:"pb small",children:[m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Speed"}),m.jsxs("b",{className:"mono",children:[(((r==null?void 0:r.tcp_speed)??0)*1e3).toFixed(0)," mm/s"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Elbow speed"}),m.jsxs("b",{className:"mono",children:[(((r==null?void 0:r.elbow_speed)??0)*1e3).toFixed(0)," mm/s"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"External force estimate"}),m.jsxs("b",{className:"mono",children:[((r==null?void 0:r.ext_force)??0).toFixed(1)," N"]})]}),m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow dim",children:"Torque utilisation"}),m.jsxs("b",{className:"mono",children:[Math.round(((r==null?void 0:r.torque_util)??0)*100)," %"]})]})]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Alarms (24 h)"}),m.jsx("div",{className:"pb small",children:e.length?e.map(s=>m.jsxs("div",{className:"jrow",children:[m.jsx("span",{className:"grow mono",children:s.code}),m.jsx("b",{children:s.count})]},s.code)):m.jsx("p",{className:"dim",children:"No alarms in the last 24 hours."})})]})]})]})}const Dw={alarm:"var(--err)",warn:"var(--warn)",info:"var(--text)",debug:"var(--text2)"};function Iw(){const[r,e]=qe.useState([]),[n,s]=qe.useState(""),[o,l]=qe.useState(!0),d=async()=>{try{const u=await Qe.rest("GET",`/api/v1/events?limit=400${n?`&level=${n}`:""}`);e(u.events||[])}catch{}};return qe.useEffect(()=>{if(d(),!o)return;const u=setInterval(d,2e3);return()=>clearInterval(u)},[n,o]),m.jsxs("div",{className:"panel",style:{height:"100%",display:"flex",flexDirection:"column"},children:[m.jsxs("div",{className:"ph",children:["System log",m.jsx("span",{className:"grow"}),m.jsxs("select",{className:"in",style:{width:140,padding:"5px 8px"},value:n,onChange:u=>s(u.target.value),children:[m.jsx("option",{value:"",children:"All levels"}),m.jsx("option",{value:"info",children:"Info +"}),m.jsx("option",{value:"warn",children:"Warnings +"}),m.jsx("option",{value:"alarm",children:"Alarms only"})]}),m.jsxs("label",{className:"row small dim",style:{gap:6},children:[m.jsx("div",{className:`toggle ${o?"on":""}`,onClick:()=>l(!o)}),"Follow"]})]}),m.jsx("div",{className:"pb grow",style:{overflow:"auto"},children:m.jsxs("table",{className:"tbl",children:[m.jsx("thead",{children:m.jsxs("tr",{children:[m.jsx("th",{style:{width:165},children:"Time"}),m.jsx("th",{style:{width:70},children:"Level"}),m.jsx("th",{style:{width:90},children:"Source"}),m.jsx("th",{style:{width:170},children:"Code"}),m.jsx("th",{children:"Message"})]})}),m.jsxs("tbody",{children:[r.map(u=>m.jsxs("tr",{children:[m.jsx("td",{className:"mono dim",children:new Date(u.t*1e3).toLocaleString()}),m.jsx("td",{children:m.jsx("b",{style:{color:Dw[u.level]},children:u.level.toUpperCase()})}),m.jsx("td",{className:"dim",children:u.source}),m.jsx("td",{className:"mono",children:u.code}),m.jsx("td",{children:u.message})]},u.id)),!r.length&&m.jsx("tr",{children:m.jsx("td",{colSpan:5,className:"dim",children:"No events."})})]})]})})]})}function Uw(){var ae,A,E,V,Y,se;const r=ct(K=>K.theme),e=ct(K=>K.setTheme),n=ct(K=>K.host),s=ct(K=>K.setHost),o=ct(K=>K.toast),l=ct(K=>K.authRole),[d,u]=qe.useState(n),[f,p]=qe.useState(null),[g,v]=qe.useState(null),[y,M]=qe.useState([]),[w,C]=qe.useState({name:"",pin:"",role:"operator"}),[x,S]=qe.useState(""),L=qe.useRef(null),b=async()=>{try{if(p(await Qe.rest("GET","/api/v1/system")),v(await Qe.rest("GET","/api/v1/settings")),l==="admin"){const K=await Qe.rest("GET","/api/v1/users");M(K.users||[])}}catch{}};qe.useEffect(()=>{b()},[l]);const N=async K=>{try{const q=await Qe.rest("POST","/api/v1/settings",K);v(q),o("ok","Settings saved")}catch(q){o("err",q.message)}},$=async()=>{try{await Qe.rest("POST","/api/v1/users",w),C({name:"",pin:"",role:"operator"}),o("ok","User created"),b()}catch(K){o("err",K.message)}},k=async()=>{try{await Qe.rest("POST","/api/v1/auth/pin",{pin:x}),S(""),o("ok","PIN changed")}catch(K){o("err",K.message)}},U=async()=>{try{const K=await Qe.rest("GET","/api/v1/backup"),q=document.createElement("a");q.href=URL.createObjectURL(K),q.download=`erobo_backup_${new Date().toISOString().slice(0,10)}.tar.gz`,q.click(),o("ok","Backup downloaded")}catch(K){o("err",K.message)}},X=async K=>{const q=new Uint8Array(await K.arrayBuffer());let ue="";q.forEach(z=>{ue+=String.fromCharCode(z)});try{await Qe.rest("POST","/api/v1/restore",{data:btoa(ue)}),o("ok","Configuration restored — restart the controller to apply")}catch(z){o("err",z.message)}};return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"},children:[m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Connection & appearance"}),m.jsxs("div",{className:"pb",children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Robot address"}),m.jsxs("div",{className:"row",children:[m.jsx("input",{className:"in mono",value:d,onChange:K=>u(K.target.value)}),m.jsx("button",{className:"btn",onClick:()=>{s(d.trim()),Qe.connect(d.trim())},children:"Connect"})]})]}),m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Theme"}),m.jsxs("div",{className:"row",children:[m.jsx("button",{className:`btn ${r==="dark"?"primary":""}`,onClick:()=>e("dark"),children:"Dark"}),m.jsx("button",{className:`btn ${r==="light"?"primary":""}`,onClick:()=>e("light"),children:"Light"})]})]}),f&&m.jsxs("p",{className:"dim small",children:[f.model," · controller v",f.version," · up ",(f.uptime_s/3600).toFixed(1)," h · host ",f.hostname]})]})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Robot identity & integrations"}),m.jsx("div",{className:"pb",children:g?m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Robot name"}),m.jsxs("div",{className:"row",children:[m.jsx("input",{className:"in",defaultValue:g.robot_name,id:"rname"}),m.jsx("button",{className:"btn",onClick:()=>N({robot_name:document.getElementById("rname").value}),children:"Save"})]})]}),m.jsxs("div",{className:"jrow",children:[m.jsxs("span",{className:"grow",children:["Modbus TCP slave (port ",(ae=g.modbus)==null?void 0:ae.port,")"]}),m.jsx("div",{className:`toggle ${(A=g.modbus)!=null&&A.enabled?"on":""}`,onClick:()=>N({modbus:{...g.modbus,enabled:!g.modbus.enabled}})})]}),m.jsxs("div",{className:"jrow",children:[m.jsxs("span",{className:"grow",children:["MQTT publisher (",(E=g.mqtt)==null?void 0:E.host,":",(V=g.mqtt)==null?void 0:V.port,")"]}),m.jsx("div",{className:`toggle ${(Y=g.mqtt)!=null&&Y.enabled?"on":""}`,onClick:()=>N({mqtt:{...g.mqtt,enabled:!g.mqtt.enabled}})})]}),m.jsxs("div",{className:"field",style:{marginTop:8},children:[m.jsx("label",{children:"MQTT broker host"}),m.jsxs("div",{className:"row",children:[m.jsx("input",{className:"in mono",defaultValue:(se=g.mqtt)==null?void 0:se.host,id:"mqhost"}),m.jsx("button",{className:"btn",onClick:()=>N({mqtt:{...g.mqtt,host:document.getElementById("mqhost").value}}),children:"Save"})]})]}),m.jsxs("p",{className:"dim small",children:["Changing integrations requires an admin login. REST API reference: ",m.jsx("span",{className:"mono",children:"docs/INTEGRATION_API.md"})]})]}):m.jsx("p",{className:"dim small",children:"Connect (and log in) to edit controller settings."})})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"My account"}),m.jsx("div",{className:"pb",children:m.jsxs("div",{className:"field",children:[m.jsx("label",{children:"Change my PIN"}),m.jsxs("div",{className:"row",children:[m.jsx("input",{className:"in",type:"password",inputMode:"numeric",value:x,onChange:K=>S(K.target.value),placeholder:"new PIN (4+ digits)"}),m.jsx("button",{className:"btn",onClick:k,disabled:x.length<4,children:"Change"})]})]})})]}),m.jsxs("div",{className:"panel",children:[m.jsx("div",{className:"ph",children:"Backup & restore"}),m.jsxs("div",{className:"pb",children:[m.jsxs("div",{className:"row",children:[m.jsx("button",{className:"btn",onClick:U,children:"Download backup"}),m.jsx("button",{className:"btn",onClick:()=>{var K;return(K=L.current)==null?void 0:K.click()},children:"Restore from file…"}),m.jsx("input",{ref:L,type:"file",accept:".tar.gz,.tgz",style:{display:"none"},onChange:K=>{var q;return((q=K.target.files)==null?void 0:q[0])&&X(K.target.files[0])}})]}),m.jsx("p",{className:"dim small",style:{marginTop:8},children:"The archive contains programs, waypoints, tools, safety configuration, users and settings (admin login required)."})]})]}),l==="admin"&&m.jsxs("div",{className:"panel",style:{gridColumn:"1 / -1"},children:[m.jsx("div",{className:"ph",children:"Users & roles"}),m.jsxs("div",{className:"pb",children:[m.jsxs("table",{className:"tbl",children:[m.jsx("thead",{children:m.jsxs("tr",{children:[m.jsx("th",{children:"User"}),m.jsx("th",{children:"Role"}),m.jsx("th",{})]})}),m.jsx("tbody",{children:y.map(K=>m.jsxs("tr",{children:[m.jsxs("td",{children:[m.jsx("b",{children:K.name})," ",K.must_change&&m.jsxs("span",{className:"chip warn",style:{marginLeft:8,padding:"2px 8px"},children:[m.jsx("span",{className:"dot"}),"default PIN"]})]}),m.jsx("td",{children:K.role}),m.jsx("td",{style:{textAlign:"right"},children:m.jsx("button",{className:"btn sm danger",onClick:async()=>{try{await Qe.rest("DELETE",`/api/v1/users/${K.name}`),b()}catch(q){o("err",q.message)}},children:"Delete"})})]},K.name))})]}),m.jsxs("div",{className:"row",style:{marginTop:10},children:[m.jsx("input",{className:"in",placeholder:"name",value:w.name,onChange:K=>C({...w,name:K.target.value})}),m.jsx("input",{className:"in",placeholder:"PIN",type:"password",value:w.pin,onChange:K=>C({...w,pin:K.target.value})}),m.jsxs("select",{className:"in",value:w.role,onChange:K=>C({...w,role:K.target.value}),children:[m.jsx("option",{children:"operator"}),m.jsx("option",{children:"programmer"}),m.jsx("option",{children:"admin"})]}),m.jsx("button",{className:"btn primary",onClick:$,children:"Add user"})]})]})]})]})}const Fw={move:Ew,program:Tw,io:Aw,safety:Cw,tools:Rw,diag:Lw,logs:Iw,settings:Uw};function Ow(){const r=ct(l=>l.page),e=ct(l=>l.state),[n,s]=qe.useState(!1),o=Fw[r];return qe.useEffect(()=>{const l=d=>{d.key==="Escape"&&Qe.cmd({cmd:"stop"})};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]),m.jsxs("div",{className:"app",children:[m.jsx(Fv,{onLogin:()=>s(!0)}),m.jsxs("div",{className:"main",children:[m.jsx(kv,{}),m.jsxs("div",{className:"page",children:[e!=null&&e.safety.stop?m.jsxs("div",{className:"banner err",children:["Protective stop — ",e.safety.code_name,". Clear the cause, then press Enable to recover.",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm good",onClick:()=>Qe.cmd({cmd:"enable"}),children:"Enable"})]}):null,e!=null&&e.estop?m.jsxs("div",{className:"banner err",children:["EMERGENCY STOP engaged. When safe, reset and re-enable the drives.",m.jsx("span",{className:"grow"}),m.jsx("button",{className:"btn sm",onClick:()=>Qe.cmd({cmd:"reset"}),children:"Reset E-stop"}),m.jsx("button",{className:"btn sm good",onClick:()=>Qe.cmd({cmd:"enable"}),children:"Enable"})]}):null,e!=null&&e.contact?m.jsxs("div",{className:"banner warn",children:["Contact detected on J",(e.contact_joint??0)+1,". Check the workspace, then Enable to recover."]}):null,m.jsx(o,{})]})]}),m.jsx(zv,{}),m.jsx(Bv,{}),m.jsx(jv,{}),n&&m.jsx(Hv,{onClose:()=>s(!1)})]})}Iv();Cv.createRoot(document.getElementById("root")).render(m.jsx(Ga.StrictMode,{children:m.jsx(Ow,{})}));
