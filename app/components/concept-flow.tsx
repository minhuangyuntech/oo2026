import {type Language,ui} from "../data";

const flows:Record<number,Record<Language,string[][]>>={
  14:{zh:[["讀取 p.price","getter","回傳 _price"],["指定 p.price = 120","setter：驗證 120","更新 _price"]],en:[["Read p.price","getter","Return _price"],["Assign p.price = 120","setter: validate 120","Update _price"]],ja:[["p.price を読む","getter","_price を返す"],["p.price = 120 を代入","setter：120 を検証","_price を更新"]]},
  27:{zh:[["withdraw(amount)","正整數？餘額足夠？","通過：更新餘額與紀錄"],["任一驗證失敗","拋出例外","餘額與紀錄保持原狀"]],en:[["withdraw(amount)","Positive int? Sufficient funds?","Pass: update balance + history"],["Any validation fails","Raise an exception","Balance + history unchanged"]],ja:[["withdraw(amount)","正の整数？残高は十分？","成功：残高と履歴を更新"],["いずれかの検証に失敗","例外を送出","残高と履歴は変更しない"]]},
  32:{zh:[["internal：list","internal[0]","共用的 dict：amount = 100"],["snapshot：tuple","snapshot[0]","同一個 dict：修改後為 -999"]],en:[["internal: list","internal[0]","Shared dict: amount = 100"],["snapshot: tuple","snapshot[0]","Same dict: becomes -999"]],ja:[["internal：list","internal[0]","共有 dict：amount = 100"],["snapshot：tuple","snapshot[0]","同じ dict：変更後は -999"]]},
  39:{zh:[["類別的 data descriptor","實體 __dict__","non-data descriptor／類別屬性"],["上述均未取得值","AttributeError","若定義了 __getattr__，則接手"]],en:[["Class data descriptor","Instance __dict__","Non-data descriptor / class attribute"],["None resolves the attribute","AttributeError","__getattr__ fallback, if defined"]],ja:[["クラスのデータディスクリプタ","インスタンスの __dict__","非データディスクリプタ／クラス属性"],["いずれでも見つからない","AttributeError","定義済みなら __getattr__ が処理"]]}
};
export default function ConceptFlow({slide,lang}:{slide:number;lang:Language}){
  const rows=flows[slide]?.[lang];
  if(!rows)return null;
  return <figure className="concept-flow"><figcaption>{ui[lang].diagram}</figcaption>{rows.map((row,i)=><ol key={i}>{row.map((label,j)=><li key={label}><span>{label}</span>{j<row.length-1&&<b aria-hidden="true">→</b>}</li>)}</ol>)}</figure>;
}
