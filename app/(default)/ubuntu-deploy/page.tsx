import WeekLesson from "../../components/week-lesson";
import { getLesson } from "../../lesson-data";
import { courseMetadata } from "../../metadata";

export const metadata = courseMetadata("zh", "ubuntu-deploy");
export default function Page() {
  return <WeekLesson lang="zh" week="ubuntu-deploy" lesson={getLesson("zh", "ubuntu-deploy")} />;
}
