"use strict";(self.webpackChunkschool_web=self.webpackChunkschool_web||[]).push([[4],{50004:(e,t,n)=>{n.r(t),n.d(t,{solr:()=>s});var r=/[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/,o=/[\|\!\+\-\*\?\~\^\&]/,u=/^(OR|AND|NOT|TO)$/;function i(e){return function(t,n){for(var o=e;(e=t.peek())&&null!=e.match(r);)o+=t.next();return n.tokenize=a,u.test(o)?"operator":function(e){return parseFloat(e).toString()===e}(o)?"number":":"==t.peek()?"propertyName":"string"}}function a(e,t){var n,u,s=e.next();return'"'==s?t.tokenize=(u=s,function(e,t){for(var n,r=!1;null!=(n=e.next())&&(n!=u||r);)r=!r&&"\\"==n;return r||(t.tokenize=a),"string"}):o.test(s)?t.tokenize=(n=s,function(e,t){return"|"==n?e.eat(/\|/):"&"==n&&e.eat(/\&/),t.tokenize=a,"operator"}):r.test(s)&&(t.tokenize=i(s)),t.tokenize!=a?t.tokenize(e,t):null}const s={name:"solr",startState:function(){return{tokenize:a}},token:function(e,t){return e.eatSpace()?null:t.tokenize(e,t)}}}}]);
//# sourceMappingURL=4.396cd225.chunk.js.map