import lessons from "../content/lessons.json";
import type { Language, Lesson, UnitId } from "./data";
export function getLesson(lang: Language, week: UnitId): Lesson {
  return (lessons as Record<string, Lesson>)[`${lang}-${week}`];
}
