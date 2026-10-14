import {notFound} from "next/navigation";
import CourseHome from "../components/course-home";
import {courseMetadata} from "../metadata";
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;return lang==="en"||lang==="ja"?courseMetadata(lang):{};
}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(lang!=="en"&&lang!=="ja")notFound();
  return <CourseHome lang={lang}/>;
}
