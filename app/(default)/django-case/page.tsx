import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
export const metadata=courseMetadata("zh","django-case");
export default function Page(){return <WeekLesson lang="zh" week="django-case" lesson={getLesson("zh","django-case")}/>;}
