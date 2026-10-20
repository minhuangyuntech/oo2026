import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
export const metadata=courseMetadata("zh","pygame");
export default function Page(){return <WeekLesson lang="zh" week="pygame" lesson={getLesson("zh","pygame")}/>;}
