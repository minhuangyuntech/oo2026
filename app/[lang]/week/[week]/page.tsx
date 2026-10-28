import {notFound} from "next/navigation";
import WeekLesson from "../../../components/week-lesson";
import {getLesson} from "../../../lesson-data";
import {courseMetadata} from "../../../metadata";
export const dynamicParams=false;
export function generateStaticParams(){return [1,2,3,4,5,6,8].map(week=>({week:String(week)}));}
export async function generateMetadata({params}:{params:Promise<{lang:string;week:string}>}){
  const {lang,week}=await params;return (lang==="en"||lang==="ja")&&((Number(week)>=1&&Number(week)<=6)||Number(week)===8)?courseMetadata(lang,Number(week)):{};
}
export default async function Page({params}:{params:Promise<{lang:string;week:string}>}){
  const {lang,week:value}=await params,week=Number(value);
  if((lang!=="en"&&lang!=="ja")||!Number.isInteger(week)||!([1,2,3,4,5,6,8].includes(week)))notFound();
  return <WeekLesson lang={lang} week={week} lesson={getLesson(lang,week)}/>;
}
