import databases from "../content/database-lessons.json";
import lessons from "../content/lessons.json";
import type { Language, Lesson, UnitId } from "./data";
export function getLesson(lang: Language, week: UnitId): Lesson {
  if (week === "databases") return databases[lang] as Lesson;
  return (lessons as Record<string, Lesson>)[`${lang}-${week}`];
}
