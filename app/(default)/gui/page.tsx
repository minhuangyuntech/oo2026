import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
export const metadata=courseMetadata("zh","gui");
export default function Page(){return <WeekLesson lang="zh" week="gui" lesson={getLesson("zh","gui")}/>;}
