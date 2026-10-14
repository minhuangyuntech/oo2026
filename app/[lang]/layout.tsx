import {notFound} from "next/navigation";
import "../globals.css";
export const dynamicParams=false;
export function generateStaticParams(){return [{lang:"en"},{lang:"ja"}];}
export default async function LocalizedLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){
  const {lang}=await params;
  if(lang!=="en"&&lang!=="ja")notFound();
  return <html lang={lang}><body>{children}</body></html>;
}
