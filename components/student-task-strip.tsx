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
  const tasks=activities.map((activity,index)=>({activity,index,assignment:assignments.find((item)=>item.activity_id===activity.id)}));
  const open=tasks.filter(({activity})=>!responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted"));
  return <section className="student-tasks"><div className="section-row task-section-head"><div><h2>Your next tasks</h2><p>Each day starts with material, then practice and speaking.</p></div><div className="task-count"><ListChecks size={14}/>{open.length} to do</div></div>{!tasks.length?<div className="task-empty"><CheckCircle2 size={20}/><div><strong>No tasks available yet.</strong><span>Your teacher will add tasks for your level.</span></div></div>:<div className="task-grid">{(open.length?open:tasks).slice(0,3).map(({assignment,activity,index})=>{const content=contents.find((item)=>item.id===activity.content_id);const done=responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted");return <article className="task-card" key={activity.id}><div className="task-card-top"><span className={done?"task-status done":"task-status"}>{done?"Completed":`Day ${activity.pathway_order??index+1}`}</span>{assignment?.deadline&&<span className="task-due"><CalendarDays size={13}/>{dueLabel(assignment.deadline)}</span>}</div><h3>{activity.title}</h3><p>{content?.description||content?.topic||activity.speaking_prompt}</p><button onClick={()=>onOpen(activity)}>{done?"Practice again":"Start task"}<ArrowRight size={15}/></button></article>})}</div>}</section>;
}
