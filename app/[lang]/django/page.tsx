import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
import {notFound} from "next/navigation";
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return lang==="en"||lang==="ja"?courseMetadata(lang,"django"):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=="en"&&lang!=="ja")notFound();return <WeekLesson lang={lang} week="django" lesson={getLesson(lang,"django")}/>;}
