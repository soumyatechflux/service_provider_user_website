import{r as n,A as c,f as s,R as l,h as x,j as t,k as u,_ as p}from"./index-BLDXZsNf.js";const y=n.lazy(()=>p(()=>import("./ProgramExploreCard-WsNvD6lL.js"),__vite__mapDeps([0,1,2,3,4])));function m(){const{userData:e}=n.useContext(c),{data:o}=s({queryKey:["favoritePrograms",e==null?void 0:e.id],queryFn:()=>l(e.favoritePrograms),enabled:!!e}),{data:i}=s({queryKey:["currentPrograms",e==null?void 0:e.id],queryFn:()=>x(e.id),enabled:!!(e!=null&&e.id)}),a=o==null?void 0:o.map(r=>t.jsx(n.Suspense,{children:t.jsx("div",{onClick:()=>i!=null&&i.find(d=>d.id===r.id)?window.location.replace(`/programs/current/${r.id}`):window.location.replace(`/programs/explore/${r.id}`),children:t.jsx(y,{program:r})})},r.id));return t.jsx(u,{direction:"row",justifyContent:"flex-start",my:8,gap:4,flexWrap:"wrap",children:a})}export{m as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ProgramExploreCard-WsNvD6lL.js","assets/index-BLDXZsNf.js","assets/index-sAHsY2w0.css","assets/setStudentProgramFavorite-WRttFheY.js","assets/CardMedia-eCeaUfzP.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}