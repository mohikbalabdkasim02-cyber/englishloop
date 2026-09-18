"use client";
import { ExternalLink, FileText, Headphones, Loader2, Volume2, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { ContentItem } from "@/lib/demo-data";
import { youtubeId } from "@/lib/youtube";

export default function LearningMaterialPanel({content}:{content:ContentItem}){
  const materialType=content.material_type||(content.format?.toLowerCase()==="youtube"?"youtube":content.format?.toLowerCase()==="pdf"?"pdf":"text");
  const videoId=useMemo(()=>youtubeId(content.content_url),[content.content_url]);
  const [pdfUrl,setPdfUrl]=useState<string|null>(materialType==="pdf"&&content.content_url?.startsWith("blob:")?content.content_url:null);
  const [pdfError,setPdfError]=useState("");
  const [speaking,setSpeaking]=useState(false);
  const [speechError,setSpeechError]=useState("");

  useEffect(()=>()=>{if(content.content_type==="listen"&&typeof window!=="undefined")window.speechSynthesis?.cancel()},[content.id,content.content_type]);

  function playListening(){
    if(!("speechSynthesis" in window)){
      setSpeechError("Audio playback is unavailable in this browser. Read the transcript below.");
      return;
    }
    window.speechSynthesis.cancel();
    const sample=content.content_body.split("\n\n")[0];
    const utterance=new SpeechSynthesisUtterance(sample);
    utterance.lang="en-US";
    utterance.rate=0.82;
    utterance.onend=()=>setSpeaking(false);
    utterance.onerror=()=>{setSpeaking(false);setSpeechError("Audio playback failed. Read the transcript below.")};
    setSpeechError("");
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(()=>{
    if(materialType!=="pdf"||pdfUrl||!content.storage_path)return;
    const supabase=getSupabase();
    if(!supabase){setPdfError("PDF preview needs a connected English Loop account.");return;}
    supabase.storage.from("learning-materials").createSignedUrl(content.storage_path,900).then(({data,error})=>{
      if(error||!data?.signedUrl)setPdfError(error?.message||"Could not prepare PDF preview.");
      else setPdfUrl(data.signedUrl);
    });
  },[materialType,content.storage_path,pdfUrl]);

  if(materialType==="youtube"){
    if(!videoId)return <div className="material-error">The YouTube link could not be previewed.</div>;
    return <div className="material-panel youtube-material">
      <div className="material-frame"><iframe loading="lazy" src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title={content.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>
      <div className="material-meta"><div><Video size={18}/><span><strong>YouTube input</strong><small>{content.source||"External video"}</small></span></div><a href={content.content_url||"#"} target="_blank" rel="noreferrer">Open on YouTube <ExternalLink size={14}/></a></div>
      {content.content_body&&<p className="material-note">{content.content_body}</p>}
    </div>;
  }

  if(materialType==="pdf")return <div className="material-panel pdf-material">
    <div className="material-meta"><div><FileText size={18}/><span><strong>PDF material</strong><small>Private signed access</small></span></div>{pdfUrl&&<a href={pdfUrl} target="_blank" rel="noreferrer">Open full PDF <ExternalLink size={14}/></a>}</div>
    {pdfUrl?<iframe className="pdf-frame" src={pdfUrl} title={content.title}/>:<div className="pdf-loading">{pdfError?<><FileText size={22}/><span>{pdfError}</span></>:<><Loader2 className="spin" size={20}/><span>Preparing PDF preview…</span></>}</div>}
    {content.content_body&&<p className="material-note">{content.content_body}</p>}
  </div>;

  return <div className="content-reader"><div className="reader-meta"><span>{content.source}</span><span>{content.topic}</span></div>
    {content.content_type==="listen"&&<div className="listening-sample"><Headphones size={20}/><div><strong>Listen to the example</strong><small>Computer voice · tap to replay, then try saying it yourself.</small></div><button className="btn btn-soft" type="button" onClick={playListening}><Volume2 size={16}/>{speaking?"Replay":"Play audio"}</button></div>}
    {speechError&&<p role="status" className="material-error">{speechError}</p>}
    {content.content_type==="listen"?<details className="listening-transcript"><summary>Show transcript and reading material</summary><p>{content.content_body}</p></details>:<p>{content.content_body}</p>}
  </div>;
}
