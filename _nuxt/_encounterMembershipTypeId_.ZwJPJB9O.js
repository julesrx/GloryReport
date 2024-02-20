import{n as M,D as R,E as S,F as B,G as E,H as V,o as t,I as k,w as $,y as e,c as p,z as v,a,t as f,q as z,u as F,J as H,K as j,L as G,r as L,b,T as K,M as q,N as J,A as O,O as U,d as Q,S as W,B as X}from"./entry.oVrYNFh1.js";import{_ as P}from"./nuxt-link.uUxLxdcC.js";import{_ as Y}from"./ProfileCard.vue.09FRsUdj.js";import{b as Z}from"./useReportStore.Z-KhGkUH.js";import{c as ee,u as te}from"./useLazyDatabaseData.U3CCcPk_.js";import{u as se}from"./asyncData.sd3t0YhD.js";const A=Symbol("membershipId"),ae=["src"],ne={class:"text-white-muted text-sm"},oe=a("div",{class:"flex-1"},null,-1),ie={class:"text-end"},re={class:"text-white-muted text-sm"},ce=M({__name:"EncounterActivityItem",props:{instanceId:{}},async setup(T){let o,i;const I=Z(),r=R(),x=T,w=S(A),n=([o,i]=B(()=>E(x.instanceId,I)),o=await o,i(),o),c=n.entries.find(s=>s.player.destinyUserInfo.membershipId===w),u=V.format(new Date(n.period)),g=c&&c.values.standing.basic.value===0,d=r.getRef(n.activityDetails.directorActivityHash),m=ee(async()=>{if(!d.value)return null;const s=d.value.directActivityModeHash;return s?await r.getRaw(s):null});return(s,l)=>{const D=P;return t(),k(D,{to:`https://destinytracker.com/destiny-2/pgcr/${s.instanceId}`,target:"_blank",class:"flex items-center space-x-2"},{default:$(()=>{var _,h,y;return[(_=e(m))!=null&&_.displayProperties.hasIcon?(t(),p("img",{key:0,src:`https://www.bungie.net${e(m).displayProperties.icon}`,class:"h-16 w-16"},null,8,ae)):v("",!0),a("div",null,[a("div",null,f((h=e(m))==null?void 0:h.displayProperties.name),1),a("div",ne,f((y=e(d))==null?void 0:y.displayProperties.name),1)]),oe,a("div",ie,[a("div",null,f(e(g)?"Victory":"Defeat"),1),a("div",re,f(e(u)),1)])]}),_:1},8,["to"])}}}),de={class:"space-y-2"},le={key:0},pe=a("div",{class:"text-white-muted"},"vs",-1),me={key:1,class:"space-y-2"},ue=["disabled"],Ie=M({__name:"[encounterMembershipTypeId]",setup(T){const o=z(),i=F(),I=H();j(A,o.membershipTypeId[1]);const r=i.params.encounterMembershipTypeId,[x,w]=G(r),{data:n}=se(r,async()=>{const l=await O(w,x);return U(l.Response)},{deep:!1}),c=L(25),u=L(!0),g=()=>{c.value+=25,m()},{data:d,refresh:m,pending:s}=te("details",()=>{const l=I.getEncounterInstanceIds(r,c.value);return l.length<c.value&&(u.value=!1),l});return(l,D)=>{const _=X,h=P,y=Y,N=ce;return t(),p("div",de,[b(h,{class:"text-white-muted text-sm mb-4 underline",to:`/${e(i).params.membershipType}/${e(i).params.membershipId}`},{default:$(()=>[b(_,{name:"material-symbols-light:keyboard-backspace"}),Q(" back ")]),_:1},8,["to"]),e(n)?(t(),p("div",le,[(t(),k(K,{to:"#profiles"},[pe,b(y,{profile:e(n)[0],characters:e(n)[1],rtl:""},null,8,["profile","characters"])]))])):v("",!0),e(d)?(t(),p("div",me,[(t(!0),p(q,null,J(e(d),C=>(t(),k(W,{key:C.instanceId},{default:$(()=>[b(N,{"instance-id":C.instanceId},null,8,["instance-id"])]),_:2},1024))),128)),e(u)?(t(),p("button",{key:0,type:"button",disabled:e(s),class:"w-full py-4 text-white-muted",onClick:g}," Load more ",8,ue)):v("",!0)])):v("",!0)])}}});export{Ie as default};