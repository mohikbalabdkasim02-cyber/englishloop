import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "English Loop — Input to Output English Learning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f7f7f4",
          color: "#181f1e",
          padding: "64px 70px",
          fontFamily: "Arial, Helvetica, sans-serif",
          overflow: "hidden",
        }}
      >
        <div style={{position:"absolute",width:520,height:520,borderRadius:9999,border:"76px solid #ece8ff",right:-120,top:-145,display:"flex"}} />
        <div style={{position:"absolute",width:300,height:300,borderRadius:9999,background:"#ccff5b",right:70,bottom:-190,display:"flex"}} />

        <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:"100%",zIndex:2}}>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <div style={{width:68,height:68,borderRadius:19,background:"#181f1e",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{width:39,height:39,borderRadius:9999,border:"5px solid #ccff5b",display:"flex",position:"absolute",left:10}} />
              <div style={{width:39,height:39,borderRadius:9999,border:"5px solid #ccff5b",display:"flex",position:"absolute",right:10}} />
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
              <div style={{fontSize:31,fontWeight:800,letterSpacing:"-1.2px"}}>English Loop</div>
              <div style={{fontSize:16,color:"#68716e",marginTop:2}}>Input → Output → Growth</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",maxWidth:820}}>
            <div style={{fontSize:16,fontWeight:800,color:"#6557e8",letterSpacing:"3px",textTransform:"uppercase",marginBottom:18}}>English learning, built around expression</div>
            <div style={{fontSize:68,lineHeight:1.02,fontWeight:900,letterSpacing:"-4px"}}>
              Learn from English.<br/>
              <span style={{color:"#6557e8"}}>Speak with English.</span>
            </div>
            <div style={{fontSize:22,lineHeight:1.45,color:"#59635f",marginTop:24,maxWidth:760}}>
              Authentic input, speaking practice, teacher feedback, and visible student progress — in one learning loop.
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:10}}>
              {["WATCH","LISTEN","READ","SPEAK","GROW"].map((item)=><div key={item} style={{fontSize:13,fontWeight:800,padding:"10px 14px",borderRadius:9999,background:item==="SPEAK"?"#181f1e":"#ffffff",color:item==="SPEAK"?"#ccff5b":"#59635f",border:"1px solid #dedfd9",display:"flex"}}>{item}</div>)}
            </div>
            <div style={{fontSize:15,fontWeight:700,color:"#68716e"}}>by Yusril Maulana</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
