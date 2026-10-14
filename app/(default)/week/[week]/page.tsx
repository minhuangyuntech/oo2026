import {notFound} from "next/navigation";
import WeekLesson from "../../../components/week-lesson";
import LegacyWeek,{generateMetadata as legacyMetadata} from "../../../components/legacy-week";
import {getLesson} from "../../../lesson-data";
import {courseMetadata} from "../../../metadata";
export const dynamicParams=false;
export function generateStaticParams(){return Array.from({length:18},(_,i)=>({week:String(i+1)}));}
export async function generateMetadata({params}:{params:Promise<{week:string}>}){
  const week=Number((await params).week);
  return week>=1&&week<=4?courseMetadata("zh",week):legacyMetadata({params});
}
export default async function Page({params}:{params:Promise<{week:string}>}){
  const week=Number((await params).week);
  if(!Number.isInteger(week)||week<1||week>18)notFound();
  if(week<=4)return <WeekLesson lang="zh" week={week} lesson={getLesson("zh",week)}/>;
  return <div className="legacy-shell"><LegacyWeek params={params}/></div>;
}
