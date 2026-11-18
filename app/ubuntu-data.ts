import type { Language } from "./data";

export const ubuntuInfo = {
  zh: {
    title: "在校內 Ubuntu 部署自己的 Django 網站",
    summary: "從 VPN 與 SSH 登入，到個人目錄部署、連接埠檢查及發文，用流程圖掌握 mblog 的完整操作。",
    tag: "Ubuntu · Django 部署",
    outcomes: ["分辨本機與伺服器的操作位置", "在 .venv 中部署並管理個人的 Django 網站", "建立 SSH 通道、避開占用埠並確認網站回應"],
  },
  en: {
    title: "Deploying your Django website on campus Ubuntu",
    summary: "Follow the flowcharts from VPN and SSH login to deployment, local port checks and publishing your first mblog post.",
    tag: "Ubuntu · Django deployment",
    outcomes: ["Distinguish local commands from server commands", "Deploy and manage your Django website in .venv", "Open an SSH tunnel, avoid occupied ports and check the website"],
  },
  ja: {
    title: "学内 Ubuntu で自分の Django サイトを公開する",
    summary: "VPN・SSH 接続から配置、ローカルポートの確認、mblog への投稿までをフローチャートで学びます。",
    tag: "Ubuntu · Django の配置",
    outcomes: ["ローカルとサーバーでの操作を区別する", ".venv を使って自分の Django サイトを配置・管理する", "SSH トンネルを開き、使用中のポートを避けてサイトを確認する"],
  },
};

export const ubuntuRanges = [[1, 4], [5, 7], [8, 10], [11, 13]];
export const ubuntuChapters = {
  zh: ["連線與帳號", "部署 mblog", "通道與發文", "維護、排錯與重連"],
  en: ["Connection and account", "Deploying mblog", "Tunnel and publishing", "Maintenance, troubleshooting and reconnection"],
  ja: ["接続とアカウント", "mblog の配置", "トンネルと投稿", "保守・トラブル対応・再接続"],
};
export const ubuntuResourceNote = {
  zh: "下載 mblog 完整專案，內含中英日三語 README。請依本頁的校內部署步驟操作，並向教師取得實際連線資訊。本頁可使用上方列印按鈕另存 PDF。",
  en: "Download the complete mblog project with Chinese, English and Japanese README files. Follow this page for campus deployment and obtain connection details from your instructor. Use the print button above to save this lesson as a PDF.",
  ja: "中国語・英語・日本語の README を含む mblog 完全版をダウンロードできます。学内への配置は本ページに沿って行い、接続情報は教員から受け取ってください。上部の印刷ボタンで PDF として保存できます。",
};

type FlowStep = { title: string; detail: string };
type Flowchart = { caption: string; steps: FlowStep[] };
export const ubuntuFlows: Record<string, Record<Language, Flowchart>> = {
  "ubuntu-overview": {
    zh: { caption: "從登入到發文的操作流程", steps: [
      { title: "VPN 與 SSH", detail: "終端機 A 登入並更改密碼" },
      { title: "部署專案", detail: "Ubuntu 建立 .venv 並啟動服務" },
      { title: "建立通道", detail: "本機終端機 B 開啟可用埠" },
      { title: "瀏覽與發文", detail: "本機瀏覽器進入管理後台" },
    ] },
    en: { caption: "From login to your first post", steps: [
      { title: "VPN and SSH", detail: "Terminal A signs in and changes the password" },
      { title: "Deploy", detail: "Create .venv and start the service on Ubuntu" },
      { title: "Open tunnel", detail: "Local terminal B opens an available port" },
      { title: "Publish", detail: "Open the admin page in your local browser" },
    ] },
    ja: { caption: "ログインから投稿までの流れ", steps: [
      { title: "VPN と SSH", detail: "ターミナル A で接続しパスワードを変更" },
      { title: "配置", detail: "Ubuntu で .venv を作りサービスを起動" },
      { title: "トンネル", detail: "ローカルの B で空きポートを使用" },
      { title: "投稿", detail: "ローカルのブラウザーで管理画面を開く" },
    ] },
  },
  "ubuntu-deploy": {
    zh: { caption: "deploy-django 的執行順序", steps: [
      { title: "安裝與檢查", detail: "pip install 與 manage.py check" },
      { title: "準備資料", detail: "migrate 與 collectstatic" },
      { title: "啟動服務", detail: "systemd 啟動 Gunicorn，監聽個人 socket" },
      { title: "確認回應", detail: "HTTP 檢查後，再由瀏覽器確認內容" },
    ] },
    en: { caption: "What deploy-django runs", steps: [
      { title: "Install and check", detail: "pip install and manage.py check" },
      { title: "Prepare data", detail: "migrate and collectstatic" },
      { title: "Start service", detail: "systemd starts Gunicorn on your socket" },
      { title: "Verify", detail: "Check HTTP, then inspect the site in a browser" },
    ] },
    ja: { caption: "deploy-django の実行順序", steps: [
      { title: "導入と確認", detail: "pip install と manage.py check" },
      { title: "データの準備", detail: "migrate と collectstatic" },
      { title: "サービス起動", detail: "systemd が個人用ソケットで Gunicorn を起動" },
      { title: "応答確認", detail: "HTTP 応答の確認後にブラウザーで内容を確認" },
    ] },
  },
  "ubuntu-request": {
    zh: { caption: "瀏覽器請求經 SSH 通道到達個人的 Django 網站，回應沿原路返回", steps: [
      { title: "自己的瀏覽器", detail: "localhost\nLOCAL_PORT" },
      { title: "本機終端機 B", detail: "SSH 通道透過 VPN 連到 SERVER_IP" },
      { title: "個人 Unix socket", detail: "/run/user/STUDENT_UID/course-django/site.sock" },
      { title: "Gunicorn 與 Django", detail: "執行 ~/www/site/ 的程式並回應 HTTP" },
    ] },
    en: { caption: "The browser request reaches your Django site through SSH. The response follows the same route back.", steps: [
      { title: "Your browser", detail: "localhost\nLOCAL_PORT" },
      { title: "Local terminal B", detail: "SSH tunnel through the VPN to SERVER_IP" },
      { title: "Your Unix socket", detail: "/run/user/STUDENT_UID/course-django/site.sock" },
      { title: "Gunicorn and Django", detail: "Run ~/www/site/ and return the HTTP response" },
    ] },
    ja: { caption: "ブラウザーの要求は SSH を通って自分の Django サイトに届き、応答は同じ経路を戻ります", steps: [
      { title: "自分のブラウザー", detail: "localhost\nLOCAL_PORT" },
      { title: "ローカルの B", detail: "VPN 経由で SERVER_IP へ SSH 接続" },
      { title: "個人用ソケット", detail: "/run/user/STUDENT_UID/course-django/site.sock" },
      { title: "Gunicorn と Django", detail: "~/www/site/ を実行し HTTP で応答" },
    ] },
  },
};

export const ubuntuPortFlow = {
  zh: {
    caption: "本機連接埠選擇與重試流程", start: "9000 + 學號末三碼",
    check: "在自己的電腦檢查連接埠", question: "連接埠有被占用嗎？",
    yes: "有", no: "沒有", retry: "埠號加 1，回到檢查步驟",
    open: "Ubuntu 產生指令，本機 B 開啟 SSH 通道",
    race: "若出現 Address already in use，回到加 1 步驟",
    finish: "成功後，用新的埠號開啟瀏覽器網址",
  },
  en: {
    caption: "Choosing a local port and retrying", start: "9000 + the last three ID digits",
    check: "Check the port on your own computer", question: "Is the port occupied?",
    yes: "Yes", no: "No", retry: "Increase by 1 and return to the port check",
    open: "Generate the command on Ubuntu, open SSH in local B",
    race: "If Address already in use appears, return to the increment step",
    finish: "Once connected, open the browser URL with the selected port",
  },
  ja: {
    caption: "ローカルポートの選択と再試行", start: "9000 + 学籍番号の末尾 3 桁",
    check: "自分のパソコンでポートを確認", question: "ポートは使用中ですか？",
    yes: "はい", no: "いいえ", retry: "1 増やしてポート確認に戻る",
    open: "Ubuntu でコマンドを生成し、ローカルの B で SSH 接続",
    race: "Address already in use が出たら、1 増やす手順に戻る",
    finish: "接続後、選んだポートの URL をブラウザーで開く",
  },
};
