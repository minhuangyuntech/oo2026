import lessons from "../content/lessons.json";
import type { Language, Lesson } from "./data";
export function getLesson(lang: Language, week: number): Lesson {
  return (lessons as Record<string, Lesson>)[`${lang}-${week}`];
}
