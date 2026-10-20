import type {Metadata} from "next";
import type {Language} from "../data";
import {playPath, playText} from "./text";
const origin = "https://minhuangyuntech.github.io/oo2026";
export function gameMetadata(lang: Language): Metadata {
  const title = `${playText[lang].title} | OOP 2026`;
  return {title, description: playText[lang].description,
    alternates: {canonical: origin + playPath(lang), languages: {
      "zh-Hant": origin + playPath("zh"), en: origin + playPath("en"),
      ja: origin + playPath("ja"), "x-default": origin + playPath("zh"),
    }}, openGraph: {title, description: playText[lang].description, type: "website", url: origin + playPath(lang)},
    icons: {icon: "/oo2026/favicon.svg"}};
}
