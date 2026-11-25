import {notFound} from "next/navigation";
import WeekLesson from "../../../components/week-lesson";
import {getLesson} from "../../../lesson-data";
import {courseMetadata} from "../../../metadata";
import {modernWeeks} from "../../../data";
export const dynamicParams=false;
export function generateStaticParams(){return modernWeeks.map(week=>({week:String(week)}));}
export async function generateMetadata({params}:{params:Promise<{lang:string;week:string}>}){
  const {lang,week}=await params;return (lang==="en"||lang==="ja")&&modernWeeks.includes(Number(week))?courseMetadata(lang,Number(week)):{};
}
export default async function Page({params}:{params:Promise<{lang:string;week:string}>}){
  const {lang,week:value}=await params,week=Number(value);
  if((lang!=="en"&&lang!=="ja")||!Number.isInteger(week)||!modernWeeks.includes(week))notFound();
  return <WeekLesson lang={lang} week={week} lesson={getLesson(lang,week)}/>;
}
