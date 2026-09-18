"use client";

import { Play, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { youtubeThumbnail } from "@/lib/youtube";

export default function YouTubeThumbnail({
  url,
  title,
  level,
  compact=false,
}:{
  url?:string|null;
  title:string;
  level?:string;
  compact?:boolean;
}){
  const thumbnail=useMemo(()=>youtubeThumbnail(url),[url]);
  const [failed,setFailed]=useState(false);

  return <div className={`youtube-thumb${compact?" compact":""}`}>
    {thumbnail&&!failed
      ? <img src={thumbnail} alt="" loading="lazy" onError={()=>setFailed(true)}/>
      : <div className="youtube-thumb-fallback"><Video size={compact?24:32}/></div>}
    <div className="youtube-thumb-shade"/>
    <span className="youtube-play" aria-hidden="true"><Play size={compact?18:24} fill="currentColor"/></span>
    <span className="youtube-source">YouTube</span>
    {level&&<span className="youtube-level">{level}</span>}
    <span className="sr-only">Open YouTube material: {title}</span>
  </div>;
}
