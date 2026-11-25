import WeekLesson from "../../components/week-lesson";
import {getLesson} from "../../lesson-data";
import {courseMetadata} from "../../metadata";
export const metadata=courseMetadata("zh","testing");
export default function Page(){return <WeekLesson lang="zh" week="testing" lesson={getLesson("zh","testing")}/>;}
