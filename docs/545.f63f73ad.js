(self.webpackChunkxform=self.webpackChunkxform||[]).push([[545],{3477:(M,N,z)=>{"use strict";z.d(N,{Et:()=>i,Hg:()=>t,Xu:()=>y,D2:()=>L});z(5212),z(2772),z(561);var j=z(1965),D=z(6252),I=z(2262),u=(0,j.hS)(),T=u.EVENTS,g=u.BuiltInDefaultValueType;function i(M,N,z){var j=(0,D.FN)();return(0,I.Fl)({get:function(){var D,I=j.props.field,u=N?null==I||null===(D=I[N])||void 0===D?void 0:D[M]:null==I?void 0:I[M];return null!=u?u:z},set:function(z){var D=""===z?void 0:z;j.emit(T.UPDATE_FIELD,{prop:M,value:D,scope:N})}})}function t(M){var N,z=(N=(0,D.FN)(),(0,I.Vh)(N.props,"field"));return(0,I.Fl)({get:function(){var N;return null!==(N=z.value.value)&&void 0!==N?N:M},set:function(M){z.value.value=M}})}function y(){var M=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],N=i("defaultValue");function z(){return(0,I.Fl)({get:function(){var z=N.value.type;return M.some((function(M){return M.value==z}))?z:g.MANUAL},set:function(M){N.value.type=M,M!=g.MANUAL&&(N.value.value=void 0)}})}function j(M){return(0,I.Fl)({get:function(){return"function"==typeof M?M(N.value):N.value.value},set:function(M){N.value.value=""===M?void 0:M}})}function D(){return(0,I.Fl)((function(){return N.value.type==g.MANUAL}))}return{useCompatType:z,useCompatValue:j,useIsManual:D}}function L(M){var N=(0,D.FN)(),z=(0,I.Fl)((function(){return N.props.field.options}));function j(z,j,D){N.emit(T.UPDATE_FIELD,{prop:z,value:j,scope:D}),"function"==typeof M&&M()}return{options:z,addOption:function(){var M=z.value;M.push({value:"选项".concat(M.length+1)}),j("options",M)},updateOption:function(M,N){var D=M.target.value;N.value=D,j("options",z.value)},removeOption:function(M){var N=z.value;if(!(N.length<=1)){var D=N.indexOf(M);D>=0&&N.splice(D,1),j("options",N)}},update:j}}},863:(M,N,z)=>{var j=z(1702);M.exports=j(1..valueOf)},9653:(M,N,z)=>{"use strict";var j=z(9781),D=z(7854),I=z(1702),u=z(4705),T=z(1320),g=z(2597),i=z(9587),t=z(7976),y=z(2190),L=z(7593),A=z(7293),O=z(8006).f,c=z(1236).f,e=z(3070).f,x=z(863),S=z(3111).trim,a="Number",n=D.Number,o=n.prototype,E=D.TypeError,Y=I("".slice),C=I("".charCodeAt),U=function(M){var N=L(M,"number");return"bigint"==typeof N?N:w(N)},w=function(M){var N,z,j,D,I,u,T,g,i=L(M,"number");if(y(i))throw E("Cannot convert a Symbol value to a number");if("string"==typeof i&&i.length>2)if(i=S(i),43===(N=C(i,0))||45===N){if(88===(z=C(i,2))||120===z)return NaN}else if(48===N){switch(C(i,1)){case 66:case 98:j=2,D=49;break;case 79:case 111:j=8,D=55;break;default:return+i}for(u=(I=Y(i,2)).length,T=0;T<u;T++)if((g=C(I,T))<48||g>D)return NaN;return parseInt(I,j)}return+i};if(u(a,!n(" 0o1")||!n("0b1")||n("+0x1"))){for(var r,Q=function(M){var N=arguments.length<1?0:n(U(M)),z=this;return t(o,z)&&A((function(){x(z)}))?i(Object(N),z,Q):N},l=j?O(n):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),d=0;l.length>d;d++)g(n,r=l[d])&&!g(Q,r)&&e(Q,r,c(n,r));Q.prototype=o,o.constructor=Q,T(D,a,Q)}},6113:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0zODguNjIzNSAxMzAuMDk0bDI0MS4xMjM1IDAgMCAyOC45NzFMMzg4LjYyMzUgMTU5LjA2NSAzODguNjIzNSAxMzAuMDk0IDM4OC42MjM1IDEzMC4wOTQgMzg4LjYyMzUgMTMwLjA5NE05MzAuNSAxNTkuMDY1bDAtMjguOTcxLTE4MS4zMDk1IDAgMCAyOC45NzEgMTUyLjMzODUgMCAwIDEzOS44MTVMMTE1LjcyMSAyOTguODggMTE1LjcyMSAxNTkuMDY1bDE1Mi4zMzg1IDAgMC0yOC45NzFMODYuNzUgMTMwLjA5NGwwIDI4Ljk3MSAwIDAgMCA3NDQuMzA5IDAgMCAwIDI4Ljk3MUw5MzAuNSA5MzIuMzQ1bDAtMjguOTcxIDAgMEw5MzAuNSAxNTkuMDY1IDkzMC41IDE1OS4wNjUgOTMwLjUgMTU5LjA2NSA5MzAuNSAxNTkuMDY1TTExNS43MjEgOTAzLjM3ODVMMTE1LjcyMSAzMjcuNjcxbDc4NS44MDggMCAwIDU3NS43MDc1TDExNS43MjEgOTAzLjM3ODUgMTE1LjcyMSA5MDMuMzc4NSAxMTUuNzIxIDkwMy4zNzg1TTMxMy40NzggODBsMjguOTc1NSAwIDAgMTQ4LjQxNDUtMjguOTc1NSAwTDMxMy40NzggODAgMzEzLjQ3OCA4MCAzMTMuNDc4IDgwTTY3NS45MjE1IDgwbDI4Ljk3MSAwIDAgMTQ4LjQxNDUtMjguOTcxIDBMNjc1LjkyMTUgODAgNjc1LjkyMTUgODAgNjc1LjkyMTUgODBNMzEzLjEwOSA1MzIuMzQ0NWwwIDMyLjUyMTVjMjIuODAxNS0xMy42NDQgNDEuNDk0NS0yNy44NDYgNTYuNDQ4LTQyLjgwNGwwIDIzNS44OSAzNC4yMDkgMEw0MDMuNzY2IDQ2My45MzFsLTIwLjU2MDUgMEMzNjUuMDcwNSA0OTAuMjg3NSAzNDEuNzA2NSA1MTMuMDkzNSAzMTMuMTA5IDUzMi4zNDQ1TDMxMy4xMDkgNTMyLjM0NDUgMzEzLjEwOSA1MzIuMzQ0NU02ODMuMzkxNSA2MzAuNjYwNWMtMi43OTktMTAuODQwNS03LjQ3LTIxLjY4MS0xMy42Mzk1LTMyLjUyNi02LjM1ODUtMTAuODQwNS0xNi4yNTg1LTE5LjQzNTUtMjkuOTA3LTI1LjYwNS0xMy42NDQtNi4xNjUtMjcuODUwNS05LjcyLTQyLjgwODUtMTAuMjc4LTE0Ljc2NDUtMC41NjI1LTMwLjgzODUgMy4xNzctNDcuODQ4NSAxMS4wMjUgNS42MDctMTguMTI2IDExLjM5ODUtNDIuODA0IDE3LjAxLTczLjQ1OGwxMDkuMzQxIDAgMC0zMC44NDMtMTM1LjEzNSAwYy0xOS40MzU1IDkxLjIxOTUtMzAuMjgwNSAxNDAuMTg4NS0zMi41MjYgMTQ3LjEwNWwyOC45NzEgMy4zNjE1YzkuMTU3NS0xMi41MjM1IDIwLjc0NS0yMC41NjA1IDM1LjE0MDUtMjMuOTIyIDE0LjIwNjUtMy4zNjYgMjcuMTAzNS0zLjM2NiAzOC41MDY1IDAgMTEuNDAzIDMuMzYxNSAyMC43NDUgMTAuMjc4IDI4LjIyNCAyMC41NjA1IDcuNDc0NSAxMC4yNzggMTEuNDAzIDIyLjgwMTUgMTEuOTY1NSAzNy41NzA1IDAuNTU4IDE0Ljc2OS0xLjY4NzUgMjguMjE5NS02LjkyMSA0MC4xODk1LTUuMDQ0NSAxMS45NjEtMTMuNjQ0IDIxLjY4MS0yNS42MDUgMjkuMTU1NS0xMS45NjEgNy40NzktMjcuNjYxNSA5LjM0NjUtNDcuMTA2IDUuOTgwNS0xOS40MzU1LTMuMzYxNS0zMy4wODQtMjAuNTU2LTQxLjEyMS01MS40MDM1bC0zMC44NDMgOC41OTk1YzUuNjAyNSAyNy4yODggMTYuMjU4NSA0Ni43MzI1IDMxLjU5IDU4LjEzMSAxNS4zMjcgMTEuNDAzIDMxLjU5NDUgMTcuNzU3IDQ4Ljc4NDUgMTguODc3NSAxNy4wMSAxLjEyMDUgMzIuMTU3LTAuOTM2IDQ1LjIzODUtNS45ODA1czI0LjI5NTUtMTEuOTYxIDMzLjI3My0yMC41NjA1YzkuMTU3NS04LjU5NSAxNS44ODk1LTE5LjQzNTUgMjAuNTYwNS0zMi41MjYgNC40ODY1LTEzLjA4MTUgNy4xMDEtMjUuOTc4NSA3LjY1OS0zOC41MDY1QzY4Ny4zMiA2NTMuMjc3NSA2ODYuMTk1IDY0MS41MDU1IDY4My4zOTE1IDYzMC42NjA1TDY4My4zOTE1IDYzMC42NjA1IDY4My4zOTE1IDYzMC42NjA1TTY4My4zOTE1IDYzMC42NjA1TDY4My4zOTE1IDYzMC42NjA1eiI+PC9wYXRoPgo8L3N2Zz4="},2209:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiID4KICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNODU2LjUzMDQ4ODg5IDc1Ni4yNzI5MjQ0NWwtMTAwLjI1NzU2NDQ0IDEwMC4yNTg3MDIyMmgtNTYuNjAyMTY4OWwxNTYuODYwODcxMTItMTU2Ljg2MDg3MTEydjU2LjYwMjE2ODl6IG0wIDczLjY4MDIxMzMzdjI2LjU3ODQ4ODg5aC0yNi41NzczNTExMWwyNi41Nzg0ODg4OS0yNi41Nzg0ODg4OXogbTAtMjAzLjk2MjU5NTU2TDYyNS45OTE2OCA4NTYuNTMxNjI2NjdINTY5LjM4OTUxMTExbDI0Ni4wOTMzNjg4OS0yNDYuMDk0NTA2NjdoNDEuMDQ4NzQ2Njd2MTUuNTUzNDIyMjJ6IG0tMTE0LjcyNzgyMjIyLTE1LjU1MzQyMjIyTDQ5NS43MDcwMjIyMiA4NTYuNTMxNjI2NjdoLTU2LjYwMTAzMTExbDI0Ni4wOTMzNjg4OS0yNDYuMDk0NTA2NjdoNTYuNjAyMTY4ODl6IG0tMTMwLjMzMjQ0NDQ1IDBMMzY1LjM3Nzk5MTExIDg1Ni41MzE2MjY2N2gtNTYuNjAxMDMxMTFsMjQ2LjA5MzM2ODg5LTI0Ni4wOTQ1MDY2N2g1Ni42MDIxNjg4OXogbS0xMzAuMjgxMjQ0NDQgMEwyMzUuMDk1NjA4ODkgODU2LjUzMTYyNjY3aC01Ni42MDIxNjg4OWwyNDYuMDk0NTA2NjctMjQ2LjA5NDUwNjY3aDU2LjYwMTAzMTExeiBtLTEzMC4yODIzODIyMyAwTDE2Ny40Njk1MTExMSA3OTMuODc1MzQyMjJ2LTU2LjA1OTQ0ODg5bDEyNy4zNzg3NzMzNC0xMjcuMzc4NzczMzNoNTYuMTA5NTExMXogbS0xMjkuNzQwOCAwbC01My42OTc0MjIyMiA1My42OTg1NnYtNTMuNjk4NTZoNTMuNjk4NTZ6IG02MzUuMzY1ODMxMTItMzcwLjk2MTA2NjY3TDczMS42NjI3OTExMSAzNjQuMzQzNzUxMTFoLTU2LjYwMTAzMTExbDE4MS40Njk4NjY2Ny0xODEuNDY5ODY2NjZ2NTYuNjAyMTY4ODh6IG0wIDczLjY4MDIxMzM0djUxLjE4NzQ4NDQ0aC01MS4xODg2MjIyMmw1MS4xODg2MjIyMi01MS4xODc0ODQ0NHogbS01OC4yNzU4NC0xNDUuNjg3ODkzMzRMNjAxLjM4MTU0NjY3IDM2NC4zNDM3NTExMUg1NDQuNzc5Mzc3NzhsMTk2Ljg3NTM3Nzc3LTE5Ni44NzUzNzc3OGg1Ni42MDEwMzExMnogbS0xMzAuMjgxMjQ0NDUgMEw0NzEuMDk5MTY0NDUgMzY0LjM0Mzc1MTExaC01Ni42MDEwMzExMmwxOTYuODc0MjQtMTk2Ljg3NTM3Nzc4aDU2LjYwMjE2ODg5eiBtLTEzMC4zODAyMzExMSAwTDM0MC43MTg5MzMzMyAzNjQuMzQzNzUxMTFoLTU2LjYwMjE2ODg4bDE5Ni44NzUzNzc3Ny0xOTYuODc1Mzc3NzhoNTYuNjAyMTY4ODl6IG0tMTMwLjIzMzQ1Nzc4IDBMMjEwLjQ4NTQ3NTU1IDM2NC4zNDM3NTExMUgxNjcuNDY5NTExMTF2LTEzLjUzNTAwNDQ0bDE4My4zNDAzNzMzNC0xODMuMzQwMzczMzRoNTYuNjAxMDMxMXogbS0xMzAuMjgyMzgyMjIgMGwtMTA5LjYxMDA5Nzc4IDEwOS42MTAwOTc3OHYtNTYuMDU5NDQ4ODlsNTMuNTUwNjQ4ODktNTMuNTUwNjQ4ODloNTYuMTA5NTExMTF6TTY5LjAzMTI1MzMzIDQ2Mi43ODA4NzExMWg4ODUuOTM3NDkzMzRWNTEySDY5LjAzMTI1MzMzdi00OS4yMTkxMjg4OXoiPjwvcGF0aD4KPC9zdmc+"},4874:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPHBhdGggZmlsbD0iIzMzMyIgZD0iTTg5NiAyMjRIMTI4Yy0zNS4yIDAtNjQgMjguOC02NCA2NHY0NDhjMCAzNS4yIDI4LjggNjQgNjQgNjRoNzY4YzM1LjIgMCA2NC0yOC44IDY0LTY0VjI4OGMwLTM1LjItMjguOC02NC02NC02NHogbTAgNDgwYzAgMTkuMi0xMi44IDMyLTMyIDMySDE2MGMtMTkuMiAwLTMyLTEyLjgtMzItMzJWMzIwYzAtMTkuMiAxMi44LTMyIDMyLTMyaDcwNGMxOS4yIDAgMzIgMTIuOCAzMiAzMnYzODR6Ij48L3BhdGg+CiAgPHBhdGggZmlsbD0iIzMzMyIgZD0iTTI5MS4yIDQxMi44Yy0xMi44IDYuNC0yMi40IDEyLjgtMzUuMiAxNnY0MS42YzIyLjQtNi40IDQxLjYtMTYgNTQuNC0yOC44VjY0MGgzOC40VjM5My42SDMyMGMtNi40IDMuMi0xOS4yIDEyLjgtMjguOCAxOS4yek00ODkuNiA1NjBjMjIuNC0xNiA0MS42LTI4LjggNDgtMzguNCAxNi0xNiAyMi40LTM4LjQgMjIuNC01Ny42IDAtMjIuNC02LjQtMzguNC0yMi40LTU0LjQtMTYtMTIuOC0zNS4yLTE5LjItNTcuNi0xOS4yLTI1LjYgMC00OCA5LjYtNjAuOCAyNS42LTE2IDE2LTIyLjQgMzguNC0yMi40IDY3LjJoMzguNGMwLTE5LjIgMy4yLTM1LjIgMTIuOC00NC44IDYuNC05LjYgMTkuMi0xNiAzMi0xNnMyNS42IDMuMiAzMiA5LjZjNi40IDYuNCA5LjYgMTYgOS42IDI4LjhzLTYuNCAyNS42LTE2IDM4LjRjLTYuNCA2LjQtMTYgMTYtMzIgMjguOC0yOC44IDE5LjItNDQuOCAzNS4yLTU0LjQgNDQuOC0xNiAxOS4yLTIyLjQgNDEuNi0yMi40IDY0aDE2Ni40di0zNS4ySDQ0NC44YzYuNC0xMi44IDIyLjQtMjUuNiA0NC44LTQxLjZ6IG0yMzMuNi01NC40YzI1LjYtOS42IDM4LjQtMjUuNiAzOC40LTU0LjQgMC0yMi40LTYuNC0zOC40LTIyLjQtNTEuMi0xNi0xMi44LTM1LjItMTkuMi01Ny42LTE5LjJTNjQwIDM4Ny4yIDYyNCA0MDBjLTE2IDEyLjgtMjUuNiAzMi0yNS42IDU3LjZoMzguNGMwLTE2IDYuNC0yNS42IDEyLjgtMzIgNi40LTYuNCAxOS4yLTkuNiAzMi05LjZzMjUuNiAzLjIgMzIgOS42YzYuNCA2LjQgOS42IDE2IDkuNiAyOC44cy0zLjIgMjIuNC05LjYgMjguOGMtNi40IDYuNC0xOS4yIDkuNi0zMiA5LjZoLTE2djI4LjhoMTZjMTYgMCAyNS42IDMuMiAzNS4yIDkuNiA5LjYgNi40IDEyLjggMTYgMTIuOCAzMiAwIDEyLjgtMy4yIDIyLjQtMTIuOCAyOC44LTkuNiA5LjYtMTkuMiAxMi44LTM1LjIgMTIuOC0xMi44IDAtMjUuNi0zLjItMzItMTIuOC05LjYtOS42LTEyLjgtMjIuNC0xNi0zOC40aC0zOC40YzMuMiAyOC44IDEyLjggNDggMjguOCA2NCAxNiAxMi44IDM1LjIgMTkuMiA2MC44IDE5LjIgMjUuNiAwIDQ4LTYuNCA2NC0yMi40IDE2LTE2IDIyLjQtMzIgMjIuNC01NC40IDAtMTYtMy4yLTI1LjYtMTIuOC0zNS4yLTkuNi02LjQtMjIuNC0xNi0zNS4yLTE5LjJ6Ij48L3BhdGg+Cjwvc3ZnPg=="},1871:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik05MC4xMjUgMzcxLjM3NXYyODEuMjVoODQzLjc1VjM3MS4zNzVIOTAuMTI1eiBtLTI4LjEyNS0yOC4xMjVoOTAwdjMzNy41SDYyVjM0My4yNXoiPjwvcGF0aD4KICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNODc3LjYyNSA1NDAuMTI1bC00Mi4xODc1IDQyLjE4NzVMNzkzLjI1IDU0MC4xMjV6TTg3Ny42MjUgNDgzLjg3NWwtNDIuMTg3NS00Mi4xODc1TDc5My4yNSA0ODMuODc1ek0xNzQuNSA0ODMuODc1aDUzNC4zNzV2NTYuMjVIMTc0LjV6Ij48L3BhdGg+Cjwvc3ZnPg=="},3161:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik05Mi41Njk2IDc0MS4zNzZoODMwLjEyMjY2NjY3VjI4Mi42MjRoLTgzMC4xMjI2NjY2N3Y0NTguNzUyek00OC44Nzg5MzMzMyAyMzguOTMzMzMzMzNoOTE3LjUwNHY1NDYuMTMzMzMzMzRINDguODc4OTMzMzNWMjM4LjkzMzMzMzMzek0xNzMuMzk3MzMzMzMgNDAyLjc3MzMzMzMzdjIxOC40NTMzMzMzNGMwIDEzLjEwNzIgOC43MzgxMzMzMyAyMS44NDUzMzMzMyAyMS44NDUzMzMzNCAyMS44NDUzMzMzM3MyMS44NDUzMzMzMy04LjczODEzMzMzIDIxLjg0NTMzMzMzLTIxLjg0NTMzMzMzVjQwMi43NzMzMzMzM2MwLTEzLjEwNzItOC43MzgxMzMzMy0yMS44NDUzMzMzMy0yMS44NDUzMzMzMy0yMS44NDUzMzMzM3MtMjEuODQ1MzMzMzMgOC43MzgxMzMzMy0yMS44NDUzMzMzNCAyMS44NDUzMzMzM3oiPjwvcGF0aD4KPC9zdmc+"},3923:(M,N,z)=>{"use strict";z.d(N,{Z:()=>j});const j="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPHBhdGggZmlsbD0iIzMzMyIgZD0iTTkyNi43MiA1NzQuMzEwNEw3MzEuMzQwOCA3NTcuNzZoNjkuMjIyNGwxMjYuMTU2OC0xMjEuNjUxMnYtNjEuNzk4NHpNNjY4LjcyMzIgNzU3Ljc2bDI1OC4wNDgtMjQ0LjIyNFYyNTAuODhIOTcuMjh2NTA2Ljg4aDU3MS40NDMyeiBtMjU4LjA0OC01NS4yOTZsLTU3LjI5MjggNTUuMjk2SDkyNi43MnYtNTUuMjk2ek0xODkuNDQgMzQzLjA0aDQ2LjA4djI3Ni40OGgtNDYuMDhWMzQzLjA0ek01MS4yIDIwNC44aDkyMS42djU5OS4wNEg1MS4yVjIwNC44eiI+PC9wYXRoPgo8L3N2Zz4="},1302:(M,N,z)=>{"use strict";z.d(N,{Z:()=>T});var j=z(6252),D=z(3577),I={key:0,class:"xform-divider-title"};z(9653);const u=(0,j.aZ)({name:"xform-divider",props:{title:{type:String,default:null},layout:{type:String,default:"center"},type:{type:String,default:"solid"},top:{type:Number,default:0},bottom:{type:Number,default:0}},computed:{style:function(){var M={};return this.top>0&&(M.marginTop="".concat(this.top,"px")),this.bottom>0&&(M.marginBottom="".concat(this.bottom,"px")),M}}});const T=(0,z(3744).Z)(u,[["render",function(M,N,z,u,T,g){return(0,j.wg)(),(0,j.iD)("div",{class:(0,D.C_)(["xform-divider","xform-divider-".concat(M.layout)]),style:(0,D.j5)(M.style)},[(0,j._)("div",{class:(0,D.C_)(["xform-divider-line","xform-divider-type-".concat(M.type)])},null,2),M.title?((0,j.wg)(),(0,j.iD)("strong",I,(0,D.zw)(M.title),1)):(0,j.kq)("",!0)],6)}]])}}]);