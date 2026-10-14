import CourseHome from "../components/course-home";
import {courseMetadata} from "../metadata";
export const metadata=courseMetadata("zh");
export default function Page(){return <CourseHome lang="zh"/>;}
