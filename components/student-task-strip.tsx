"use client";
import { ArrowRight, CalendarDays, CheckCircle2, ListChecks } from "lucide-react";
function dueLabel(value?: string | null) {
  if (!value) return "No deadline";
  const due = new Date(value);
  const diff = Math.ceil((due.getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Past due";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due ${due.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}
export default function StudentTaskStrip({assignments,activities,contents,responses,onOpen}:{assignments:any[];activities:any[];contents:any[];responses:any[];onOpen:(activity:any)=>void}) {
  const tasks=assignments.map((assignment)=>({assignment,activity:activities.find((item)=>item.id===assignment.activity_id)})).filter((item)=>item.activity).sort((a,b)=>{if(!a.assignment.deadline)return 1;if(!b.assignment.deadline)return -1;return new Date(a.assignment.deadline).getTime()-new Date(b.assignment.deadline).getTime()});
  return <section className="student-tasks"><div className="section-row task-section-head"><div><h2>My tasks</h2><p>Teacher-assigned loops come first.</p></div><div className="task-count"><ListChecks size={14}/>{tasks.filter(({activity})=>!responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted")).length} open</div></div>{!tasks.length?<div className="task-empty"><CheckCircle2 size={20}/><div><strong>You are all caught up.</strong><span>Explore the library whenever you want extra practice.</span></div></div>:<div className="task-grid">{tasks.slice(0,3).map(({assignment,activity})=>{const content=contents.find((item)=>item.id===activity.content_id);const done=responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted");return <article className="task-card" key={assignment.id}><div className="task-card-top"><span className={done?"task-status done":"task-status"}>{done?"Completed":"Assigned"}</span><span className="task-due"><CalendarDays size={13}/>{dueLabel(assignment.deadline)}</span></div><h3>{activity.title}</h3><p>{content?.topic||activity.speaking_prompt}</p><button onClick={()=>onOpen(activity)}>{done?"Practice again":"Start task"}<ArrowRight size={15}/></button></article>})}</div>}</section>;
}
