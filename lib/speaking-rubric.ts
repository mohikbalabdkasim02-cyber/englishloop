export const RUBRIC_NAME="CEFR-informed Classroom Speaking Rubric";

export type RubricKey="task_fulfilment"|"fluency"|"grammar"|"vocabulary"|"pronunciation";

export const SPEAKING_RUBRIC:Array<{
  key:RubricKey;
  label:string;
  description:string;
  weight:number;
  descriptors:Record<1|2|3|4|5,string>;
}>=[
  {key:"task_fulfilment",label:"Task Fulfilment",description:"Relevance, completeness, and response to the speaking prompt.",weight:20,descriptors:{1:"Barely addresses the prompt; meaning is difficult to follow.",2:"Addresses part of the prompt but important ideas are missing.",3:"Addresses the main prompt with enough relevant content to understand the message.",4:"Responds clearly and develops relevant ideas with useful detail.",5:"Fully addresses the prompt and develops ideas purposefully and effectively."}},
  {key:"fluency",label:"Fluency & Coherence",description:"Continuity, hesitation, organisation, and connection of ideas.",weight:20,descriptors:{1:"Frequent stops make the message difficult to sustain.",2:"Speech is hesitant and ideas are only loosely connected.",3:"Can sustain a short response with some pauses and generally connected ideas.",4:"Speaks at a steady pace with clear organisation and useful linking.",5:"Speaks smoothly and flexibly with well-developed, coherent ideas."}},
  {key:"grammar",label:"Grammar",description:"Range and control of grammatical forms appropriate to the learner's level.",weight:20,descriptors:{1:"Very limited control; errors often block meaning.",2:"Uses simple forms with frequent errors that sometimes affect clarity.",3:"Uses familiar structures with reasonable control; errors do not usually block meaning.",4:"Uses a useful range of forms with good control and only occasional errors.",5:"Uses varied grammatical forms flexibly and accurately for the task."}},
  {key:"vocabulary",label:"Vocabulary",description:"Range, appropriacy, and ability to express intended meaning.",weight:20,descriptors:{1:"Very limited vocabulary makes the message hard to express.",2:"Basic vocabulary communicates some ideas but repetition or gaps are frequent.",3:"Has enough vocabulary for the topic and can usually express the intended message.",4:"Uses a good range of appropriate vocabulary and some effective paraphrasing.",5:"Uses varied, precise vocabulary flexibly and naturally for the task."}},
  {key:"pronunciation",label:"Pronunciation & Intelligibility",description:"How understandable the speech is, including sounds, stress, rhythm, and intonation.",weight:20,descriptors:{1:"Often difficult to understand.",2:"Understandable in parts, but pronunciation frequently interferes with meaning.",3:"Generally intelligible despite noticeable pronunciation or prosody issues.",4:"Clearly intelligible with mostly effective stress, rhythm, and intonation.",5:"Consistently clear and effective; pronunciation supports and enhances meaning."}}
];

export function rubricOverall(scores:Record<string,number>){
  const total=SPEAKING_RUBRIC.reduce((sum,item)=>sum+(scores[item.key]||0),0);
  return Math.round((total/(SPEAKING_RUBRIC.length*5))*100);
}

export function rubricPerformanceLabel(score:number){
  if(score>=90)return "Strong";
  if(score>=75)return "Secure";
  if(score>=60)return "Developing";
  return "Needs support";
}
