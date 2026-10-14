import type {Metadata} from "next";
import {coursePath,ui,weekInfo,type Language} from "./data";
const origin="https://minhuangyuntech.github.io/oo2026";
export function courseMetadata(lang:Language,week?:number):Metadata {
  const title=week?`${weekInfo[lang][week-1].title} | ${ui[lang].course}`:ui[lang].course;
  const description=week?weekInfo[lang][week-1].summary:ui[lang].intro;
  return {title,description,alternates:{canonical:origin+coursePath(lang,week),languages:{"zh-Hant":origin+coursePath("zh",week),en:origin+coursePath("en",week),ja:origin+coursePath("ja",week),"x-default":origin+coursePath("zh",week)}},openGraph:{title,description,url:origin+coursePath(lang,week),type:"website",locale:lang==="zh"?"zh_TW":lang==="ja"?"ja_JP":"en_US"},icons:{icon:"/oo2026/favicon.svg"}};
}
