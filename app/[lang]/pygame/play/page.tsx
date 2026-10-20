import {notFound} from "next/navigation";
import ShooterGame from "../../../components/shooter-game";
import {gameMetadata} from "../../../game/metadata";
export async function generateMetadata({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params;
  return lang === "en" || lang === "ja" ? gameMetadata(lang) : {};
}
export default async function Page({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params;
  if (lang !== "en" && lang !== "ja") notFound();
  return <ShooterGame initialLang={lang}/>;
}
