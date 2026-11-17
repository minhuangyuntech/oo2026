import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
export const metadata=courseMetadata("zh","databases");
export default function Page(){return <WeekLesson lang="zh" week="databases" lesson={getLesson("zh","databases")}/>;}
