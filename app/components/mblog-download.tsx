import {basePath,type Language} from "../data";

const text={
  zh:{title:"mblog 部落格完整專案",description:"對應第 1–88 頁。下載後可執行文章列表、Markdown 文章頁與管理後台，附資料庫遷移、五篇示範文章、完整靜態資源及測試。",download:"下載 mblog 完整專案",guides:"安裝與執行說明",note:"ZIP 內含繁體中文、英文、日文 README；部落格介面與示範文章沿用繁體中文。需要 Python 3.12–3.14，首次安裝套件需要網路。解壓縮後依說明建立環境、執行 migrate 與 seed_demo，再啟動本機伺服器。",admin:"管理員由 createsuperuser 自行建立，沒有預設帳密。重複執行 seed_demo 不會覆寫已編輯的文章。"},
  en:{title:"Complete mblog project",description:"Companion to slides 1–88: runnable post list, Markdown detail pages, and admin, with migrations, five sample posts, local static assets, and tests.",download:"Download complete mblog project",guides:"Installation and running guides",note:"The ZIP includes Traditional Chinese, English, and Japanese READMEs. The blog interface and sample posts remain in Traditional Chinese. Requires Python 3.12–3.14 and internet for initial dependency installation. Extract it, follow the guide to set up the environment, run migrate and seed_demo, then start the local server.",admin:"Create your own administrator with createsuperuser; no preset credentials are included. Repeating seed_demo preserves edited posts."},
  ja:{title:"mblog の完全なプロジェクト",description:"1〜88 枚目に対応。記事一覧、Markdown 記事ページ、管理画面を実行でき、マイグレーション、五つのサンプル記事、ローカルの静的ファイル、テストも含みます。",download:"mblog 完全版をダウンロード",guides:"インストールと実行の説明",note:"ZIP に繁体字中国語・英語・日本語の README を同梱しています。ブログ画面と記事は繁体字中国語です。Python 3.12〜3.14 が必要で、初回のパッケージ導入にはネット接続を使います。展開後、説明に従って環境を作成し、migrate と seed_demo を実行してサーバーを起動します。",admin:"管理者は createsuperuser で作成します。既定の認証情報はありません。seed_demo を再実行しても編集した記事は上書きされません。"}
};

export default function MblogDownload({lang}:{lang:Language}){
  const t=text[lang];
  return <section id="mblog-download" className="lesson-resources">
    <p className="kicker">MBLOG · COMPLETE PROJECT</p><h2>{t.title}</h2><p>{t.description}</p>
    <div className="resource-links"><a className="action-primary" download href={`${basePath}/materials/mblog-complete.zip`}>↓ {t.download}<small>ZIP</small></a></div>
    <h3>{t.guides}</h3><div className="resource-links">{([['zh','繁體中文'],['en','English'],['ja','日本語']] as const).map(([code,label])=><a className="action-secondary" key={code} href={`${basePath}/materials/mblog-guide-${code}.html`} lang={code}>{label} ↗</a>)}</div>
    <p>{t.note}</p><p>{t.admin}</p>
  </section>;
}
