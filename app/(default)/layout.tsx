import "../globals.css";
export default function ChineseLayout({children}:{children:React.ReactNode}){
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
