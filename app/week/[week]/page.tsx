import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const lessons = [
  ["課程介紹與程式設計典範","基礎","程序式、物件導向與函數式典範","課程評量與個人專題","從 C 的資料與函式轉入物件責任","物件、訊息與協作"],
  ["Python 程式語言基礎複習","Python","資料型別、運算子與控制流程","函式、參數、作用域與回傳值","list、tuple、dict、set","C 與 Python 的執行模式"],
  ["類別、物件與物件模型","核心","類別、物件、身分、狀態與行為","__init__、self 與實體屬性","類別屬性與共享資料","實體、類別與靜態方法"],
  ["封裝與資訊隱藏","核心","公開、單底線與名稱修飾","Property、Getter 與 Setter","驗證規則與類別不變條件","最小且清楚的公開介面"],
  ["物件生命週期與記憶體模型","核心","名稱、參考與物件回收","Identity、Equality 與雜湊","Mutable、Immutable 與 Alias","Shallow Copy 與 Deep Copy"],
  ["類別關係與 UML 類別圖","建模","Association 與 Dependency","Aggregation 與 Composition","類別責任與協作者","Multiplicity 與 UML 符號"],
  ["繼承與類別階層","核心","基底類別與衍生類別","方法覆寫與 super()","Is-a 關係與可替換性","多重繼承與 MRO"],
  ["多型、抽象化與介面","核心","多型、動態繫結與鴨子型別","ABC 與抽象方法","Protocol 與 Type Hints","繼承與組合的選擇"],
  ["期中考試（筆試）","評量","類別、物件與封裝","參考、複製與生命週期","關係、繼承與多型","抽象化與 UML 綜合題"],
  ["Python 進階物件導向機制","進階","特殊方法與字串表示","比較、雜湊與運算子多載","Iterator、Iterable、Generator","Context Manager"],
  ["資料類別、泛型與型別設計","進階","dataclass 與 field","Enum 與有限狀態","Generic 與 TypeVar","Protocol 與靜態型別檢查"],
  ["物件導向分析與設計","設計","從需求辨識候選物件","CRC 卡與責任分配","使用案例與例外流程","循序圖與設計模型"],
  ["SOLID 與物件導向設計原則","設計","SRP 與 OCP","LSP 與 ISP","DIP 與依賴注入","高內聚、低耦合與組合優先"],
  ["設計模式與程式重構","設計","Factory 與 Strategy","Observer 與 Adapter","Code Smell 與小步重構","單元測試、Mock 與依賴注入"],
  ["Python 網站與資料庫應用（補充）","整合","URL、Router、View 與 Template","表單、驗證與錯誤處理","ORM、Transaction 與 CRUD","Domain、Service、Repository"],
  ["LLM 整合與 Linux 部署（補充）","整合","LLM Provider 與 Service","API、Ollama 與可替換實作","環境變數、密鑰與錯誤處理","Git、虛擬環境與 Linux 部署"],
  ["物件導向系統整合與專題輔導","專題","核心類別責任與物件關係","依賴方向與系統架構","測試、例外處理與重構","文件、版本、部署與維護性"],
  ["期末總結及期末專題要求說明","評量","物件導向核心概念總結","專題功能與設計要求","UML、測試與品質證據","文件、部署、展示與評分標準"],
] as const;

const details = [
  "定義：能準確說明概念、目的與常見使用情境。",
  "辨識：能從需求或程式碼中找出此概念的具體位置。",
  "設計：能判斷何時使用，以及不用時可能產生的問題。",
  "實作：能以 Python 建立最小可運作範例。",
  "驗證：能用輸出、測試或圖表證明設計符合預期。",
];

const week2Lectures = [
  {
    title:"資料型別、運算子與控制流程",
    lead:"Python 程式執行時，每一個值都是物件。資料型別決定一個值能進行哪些操作；運算子用來組合與比較資料；控制流程則決定哪些敘述會執行、執行幾次。",
    sections:[
      {title:"1. 內建基本型別",items:["int 表示任意精度整數，例如 42、-7；float 表示浮點數，例如 3.14。浮點數採二進位近似表示，不適合直接用 == 判斷計算結果。","bool 只有 True 與 False。比較運算、成員判斷與邏輯運算都會產生布林值。","str 是不可變的 Unicode 字串，可使用索引、切片、split、strip、replace 與 f-string。","None 表示「沒有值」或「尚未取得結果」，判斷時使用 value is None，而不是 value == None。","type(value) 可觀察實際型別；isinstance(value, int) 能同時考量繼承關係，通常更適合程式判斷。"]},
      {title:"2. 運算子與優先順序",items:["算術運算子包含 +、-、*、/、//、%、**；/ 一律產生 float，// 是向負無限方向取整的整除。","比較運算子可串接，例如 0 <= score <= 100，比使用兩次 and 更接近數學寫法。","and 與 or 具有短路求值：結果已能確定時，右側運算式不會執行。","in 與 not in 檢查成員；is 與 is not 比較是否為同一物件，不能拿來取代值相等比較。","運算式過長時應使用括號表達意圖，不要要求讀者背誦所有優先順序。"]},
      {title:"3. 條件判斷",items:["if 處理第一個條件，elif 處理互斥的其他情況，else 處理剩餘情況。","Python 以縮排表示程式區塊；同一區塊必須維持一致縮排，慣例使用四個空白。","空字串、數字 0、空容器與 None 在條件中視為 False；其他物件通常視為 True。","條件應表達業務意圖，例如 if not cart，而不是 if len(cart) == 0。","多層巢狀 if 可透過提早 return、拆分函式或合併條件降低複雜度。"]},
      {title:"4. 迴圈與流程控制",items:["for 逐一取得 iterable 的元素，適合已知資料集合；while 適合條件成立期間持續執行。","range(start, stop, step) 不包含 stop；enumerate 同時取得索引與元素；zip 可平行走訪多個 iterable。","break 結束最內層迴圈；continue 跳過本次剩餘敘述；不應過度使用而破壞流程可讀性。","for 與 while 可搭配 else；只有迴圈正常結束、沒有 break 時才執行 else。","無限迴圈必須有明確離開機制，並思考輸入錯誤、資源耗盡與停止條件。"]},
    ],
    demo:String.raw`score = 87
if not 0 <= score <= 100:
    print("分數範圍錯誤")
elif score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C 以下")

for index, value in enumerate([10, 20, 30], start=1):
    print(index, value)`,
    questions:["為什麼 0.1 + 0.2 == 0.3 可能是 False？","is 與 == 的差別是什麼？","什麼情況應使用 while 而不是 for？"],
  },
  {
    title:"函式、參數、作用域與回傳值",
    lead:"函式把一段具有明確目的的處理命名，建立可重用、可測試的抽象。好的函式不是單純把長程式切短，而是用清楚的輸入與輸出表達一項責任。",
    sections:[
      {title:"1. 函式介面",items:["def 後接函式名稱與參數；名稱應使用動詞或動詞片語，例如 calculate_average。","參數是函式內的區域名稱；呼叫時傳入的物件會繫結到這些名稱。","return 結束函式並交回結果；沒有明確 return 時會回傳 None。","一個函式應盡量只有一個主要目的。若名稱中出現 and，可能需要拆成兩個函式。","docstring 應說明用途、參數意義、回傳結果與可能拋出的例外。"]},
      {title:"2. 參數種類",items:["位置參數依順序配對；關鍵字參數以名稱配對，能提高呼叫可讀性。","預設參數讓呼叫端省略常用設定，但預設值在函式定義時只建立一次。","不可使用 [] 或 {} 作為可變預設值；應以 None 為預設，再於函式內建立新容器。","*args 把額外位置參數收集成 tuple；**kwargs 把額外關鍵字參數收集成 dict。","/ 左側是 positional-only；* 右側是 keyword-only，可用來設計不易誤用的 API。"]},
      {title:"3. 作用域與名稱解析",items:["函式內指定的名稱預設屬於 local scope，函式結束後不再能從外部直接存取。","Python 依 LEGB 順序尋找名稱：Local、Enclosing、Global、Built-in。","global 允許重新繫結模組層名稱；nonlocal 允許重新繫結外層函式名稱，兩者都應謹慎使用。","讀取全域常數通常沒有問題，但修改共享全域狀態會增加測試與理解難度。","閉包能保留外層函式的狀態，但若狀態與多個行為相關，類別可能更清楚。"]},
      {title:"4. 物件參考的傳遞",items:["Python 會把物件參考傳給函式，參數名稱與呼叫端名稱可能指向同一物件。","修改 list、dict 等可變物件的內容，呼叫端能看見變化。","在函式內重新指定參數，只會讓區域參數改指向另一物件，不會改變呼叫端名稱。","若函式不應修改輸入，可傳入不可變型別、建立副本，或在文件中明確說明。","回傳新值通常比偷偷修改輸入更容易理解與測試，但仍需依效能與語意判斷。"]},
    ],
    demo:String.raw`def add_item(item: str, items: list[str] | None = None) -> list[str]:
    """回傳加入 item 後的新清單，不修改呼叫端資料。"""
    result = [] if items is None else items.copy()
    result.append(item)
    return result

original = ["book"]
updated = add_item("pen", original)
print(original)  # ['book']
print(updated)   # ['book', 'pen']`,
    questions:["為什麼 def f(items=[]): 可能造成跨次呼叫共享資料？","修改參數內容與重新指定參數有何不同？","函式何時應回傳 None？"],
  },
  {
    title:"list、tuple、dict、set",
    lead:"四種核心容器各自表達不同資料語意。選擇容器時，不只看語法方便，更要考慮順序、重複、可變性、查找方式與資料關係。",
    sections:[
      {title:"1. list：有順序、可變",items:["list 保存有順序的元素，允許重複值，適合需要新增、刪除與排序的序列。","append 加入一個元素；extend 加入另一 iterable 的所有元素；兩者不可混用。","索引從 0 開始，負索引由尾端計算；切片 list[start:stop:step] 會建立新的 list。","在迴圈中直接刪除正在走訪的 list 容易漏掉元素，應建立新 list 或走訪副本。","成員查找通常是線性時間；若主要需求是快速判斷是否存在，set 更合適。"]},
      {title:"2. tuple：固定結構、不可變",items:["tuple 有順序且可重複，但建立後不能替換、增加或刪除元素。","適合座標、RGB、資料列等欄位數與意義固定的紀錄。","tuple 不代表內部物件一定不可變；若元素含 list，list 內容仍能修改。","函式回傳多個值實際上是回傳 tuple，可使用 unpacking 分配給多個名稱。","只有所有元素都可雜湊時，tuple 才能作為 dict key 或 set 元素。"]},
      {title:"3. dict：鍵值對應",items:["dict 以唯一且可雜湊的 key 對應 value，適合依識別碼或名稱查找資料。","使用 mapping[key] 讀取不存在的 key 會產生 KeyError；get 可提供預設值。","keys、values、items 分別走訪鍵、值與鍵值對；items 最適合解包成 key, value。","setdefault 與 defaultdict 可簡化分組，但過度使用可能隱藏資料建立時機。","Python dict 保留插入順序，但其核心語意仍是 key 到 value 的對應。"]},
      {title:"4. set：唯一元素集合",items:["set 不保存重複元素，適合去重、成員判斷與集合運算。","|、&、-、^ 分別表示聯集、交集、差集與對稱差集。","元素必須可雜湊，因此 list、dict、set 不能直接放入 set。","set 沒有索引，不能依位置取值；若需要穩定顯示順序，可在輸出時 sorted。","使用 set 去重會失去重複次數；若要統計次數應使用 dict 或 collections.Counter。"]},
    ],
    demo:String.raw`students = [
    {"id": "S01", "skills": {"Python", "Git"}},
    {"id": "S02", "skills": {"Python", "SQL"}},
]

by_id = {student["id"]: student for student in students}
common = students[0]["skills"] & students[1]["skills"]
all_skills = students[0]["skills"] | students[1]["skills"]

print(by_id["S02"]["skills"])
print(common)
print(sorted(all_skills))`,
    questions:["為什麼學號查詢適合 dict 而不是 list？","tuple 內含 list 時，tuple 是否完全不可變？","去重與統計次數應分別選擇什麼容器？"],
  },
  {
    title:"C 與 Python 的執行模式",
    lead:"C 與 Python 不只語法不同，型別系統、記憶體模型、建置流程與錯誤發生時間也不同。理解這些差異，才能避免把 C 的心智模型直接套用到 Python。",
    sections:[
      {title:"1. 建置與執行流程",items:["C 原始碼先經前處理、編譯、組譯與連結，產生平台相關的機器碼執行檔。","一般 Python 實作 CPython 會先把原始碼編譯成 bytecode，再由 Python 虛擬機器執行。","Python 也有編譯階段；稱為直譯語言不代表完全沒有編譯，而是最終通常由 VM 執行。","C 的編譯器可在執行前發現許多型別與語法問題；Python 的部分錯誤要執行到該路徑才出現。","Python 匯入模組時可能建立 __pycache__，快取 bytecode 以加速後續載入。"]},
      {title:"2. 型別與名稱",items:["C 變數宣告包含固定型別與記憶體配置資訊，例如 int score。","Python 名稱沒有固定型別，名稱可以先後繫結到不同型別的物件。","Python 仍是強型別語言；不會自動把 '3' 與 2 相加，必須明確轉換。","型別提示不改變 Python 的動態執行特性，主要供閱讀、IDE 與靜態檢查工具使用。","動態型別提高彈性，也要求更完整的測試與清楚的介面設計。"]},
      {title:"3. 記憶體與物件",items:["C 可直接操作位址、指標與配置／釋放記憶體，錯誤可能造成越界、懸空指標或記憶體洩漏。","Python 名稱保存物件參考，開發者通常不直接操作記憶體位址。","CPython 主要以 reference counting 管理生命週期，並搭配垃圾回收處理循環參考。","Python 的 list 是物件參考的動態陣列，不等同於 C 的固定型別陣列。","資源如檔案、鎖與網路連線應用 with 明確管理，不可只依賴垃圾回收。"]},
      {title:"4. 效能與開發取捨",items:["C 接近硬體且編譯為機器碼，適合即時系統、驅動程式與高效能底層元件。","Python 語法精簡、標準函式庫豐富，適合快速開發、自動化、資料處理與應用整合。","效能比較必須針對實際瓶頸；Python 常透過以 C 實作的函式庫取得高效能。","先建立正確、可測試的設計，再使用 profiler 找出真正需要最佳化的位置。","實務系統可混合語言：Python 負責高階流程，C／C++／Rust 負責高成本核心。"]},
    ],
    demo:String.raw`# Python：名稱可以重新繫結，但操作仍受物件型別限制
value = 10
print(type(value).__name__)
value = "10"
print(type(value).__name__)

try:
    print(value + 2)
except TypeError as error:
    print(type(error).__name__)

# 明確轉換後才能運算
print(int(value) + 2)`,
    questions:["為什麼 Python 是動態型別但仍稱為強型別？","bytecode 與機器碼有何不同？","哪些系統適合 C，哪些工作適合 Python？"],
  },
];

const pitfalls: string[][] = [
  ["把所有資料包成 class 就誤以為已完成物件導向","類別只有 getter／setter，真正規則仍散落在主程式","為了重用幾行程式而建立不自然的繼承","物件彼此直接修改屬性，形成難追蹤的共享狀態"],
  ["混用 is 與 ==，或忽略浮點數近似問題","使用可變預設參數，造成不同呼叫共享容器","未依資料語意選容器，只因熟悉 list","把 Python 當成沒有編譯與型別規則的腳本語言"],
  ["把類別屬性誤當成每個物件獨立的資料","在 __init__ 外任意補屬性，產生不完整物件","classmethod 直接寫死類別名稱，破壞子類別相容性","staticmethod 放入需要物件狀態的行為"],
  ["只用雙底線追求私有，卻沒有定義不變條件","setter 靜默修正非法輸入，讓錯誤難以察覺","直接回傳內部 list，讓呼叫端繞過驗證","公開過多底層欄位，使介面難以重構"],
  ["用 is 比較數字或字串的值","誤以為 b=a 會複製物件","不知道淺複製仍共享巢狀資料","依賴 __del__ 釋放檔案或網路資源"],
  ["把資料庫外鍵直接當成物件關係設計","過度使用雙向關聯，增加同步責任","混淆聚合與組合的生命週期語意","UML 多重性與實際程式集合限制不一致"],
  ["只為消除重複而繼承，沒有 Is-a 關係","子類別拒絕父類別方法，違反可替換性","在多重繼承中直接呼叫父類別造成重複初始化","Mixin 太大並保存核心領域狀態"],
  ["呼叫端以 isinstance 分支處理每個具體類別","ABC 同時承擔過多不相關能力","誤以為型別提示會自動做執行期驗證","為了介面共用而建立不自然的繼承階層"],
  ["只背術語，無法追蹤實際物件狀態","未先畫參考關係就猜測 copy 題輸出","UML 只畫類別名稱而沒有責任與多重性","分析 MRO 時忽略 super 的協作順序"],
  ["__repr__ 回傳非字串或包含難以除錯的資訊","可變物件實作不穩定的 __hash__","__next__ 結束時回傳 None 而非拋出 StopIteration","__exit__ 沒有保證清理或錯誤地吞掉例外"],
  ["dataclass 使用共享的 list 預設值","把 frozen 誤認為所有巢狀內容都不可變","Enum 與一般字串混用，失去有限狀態保障","泛型只寫 Any，沒有保留輸入輸出的型別關係"],
  ["需求中的每個名詞都直接建立類別","Controller 吸收所有規則，形成 God Object","CRC 卡只列資料欄位而沒有責任","循序圖訊息與最後方法介面不一致"],
  ["把 SRP 解釋成每個類別只能有一個方法","為未知變化建立過多抽象與介面","子類別加強前置條件，破壞 LSP","只有依賴注入容器，卻沒有反轉依賴方向"],
  ["為展示模式而套用模式，增加不必要類別","Observer 沒有解除訂閱或隔離訂閱者錯誤","重構同時改變行為，卻沒有測試保護","過度 Mock 內部實作，使測試阻礙重構"],
  ["把領域規則寫在 View 或路由函式","ORM 模型直接等同領域模型，所有邏輯只剩 CRUD","Service 只轉呼叫 Repository，沒有使用案例責任","交易邊界不清，部分操作成功造成資料不一致"],
  ["應用層直接依賴特定模型供應商 SDK","API Key 寫入原始碼或提交版本庫","沒有 timeout、重試上限與錯誤降級","部署只描述手動指令，缺乏服務、日誌與健康檢查"],
  ["UML、程式與資料庫三者互相不一致","Manager、Utils、Controller 類別持續膨脹","只測試成功流程，忽略邊界與外部失敗","README 無法讓另一台電腦重現專題"],
  ["專題功能很多但核心物件沒有實際行為","設計模式只出現在文件，程式並未解決相應問題","測試數量很多但沒有涵蓋主要使用案例","只有本機畫面，沒有部署或可重現啟動方式"],
];

const applications: string[][] = [
  ["比較成績統計的程序式函式與 GradeBook 物件","將 C struct 與相關函式搬入一個 Python 類別","以純函式計算折扣並與有狀態策略物件比較","為專題列出物件、責任與傳遞的訊息"],
  ["解析文字成數字並使用條件與迴圈統計","設計不修改輸入資料的 summarize 函式","分別以 list、dict、set 解決查找與去重","觀察 Python 型別錯誤何時在執行路徑出現"],
  ["建立兩個 BankAccount 比較實體狀態","用類別屬性統計物件數量","以 from_csv 建立替代建構子","比較實體方法、classmethod 與 staticmethod"],
  ["以 Product.price property 驗證價格","建立唯讀 account_number","回傳 tuple 保護交易紀錄","以 deposit／withdraw 取代直接修改 balance"],
  ["畫出 a、b、copy 對物件的參考箭頭","比較可變 list 與不可變 tuple 的操作","修改巢狀資料觀察 shallow／deep copy","用 with 明確管理檔案生命週期"],
  ["以 Student、Course、Enrollment 表達關聯類別","用 Engine 與 Car 表達 Composition","以方法參數展示 Dependency","把多重性規則實作成集合與驗證"],
  ["建立 Shape、Circle、Rectangle 階層","以 super 延伸基底初始化","建立 PrintableMixin 並查看 mro()","把不適合的繼承改寫為組合"],
  ["以 Payment Protocol 注入不同付款方式","比較 ABC 與 Protocol 的程式寫法","加入 FakePayment 驗證 Checkout","把 isinstance 條件改為多型呼叫"],
  ["逐行追蹤 Cart 的狀態與 alias","練習 property、類別屬性與複製綜合題","由需求補完 UML 關係與多重性","先列 MRO 再預測 super 輸出"],
  ["讓 Playlist 支援 len、repr 與迭代","比較 iterator class 與 generator function","建立可呼叫的累積器物件","以 context manager 管理暫時資源"],
  ["建立 frozen、slots 的 Order dataclass","用 Enum 控制 Order 狀態","設計 Repository[T] 保存不同實體","用 Protocol 描述可序列化能力"],
  ["從設備租借需求圈出名詞、動詞與規則","建立四張 CRC 卡並互換協作者","寫出主要與例外使用案例","由循序圖反推方法簽名"],
  ["拆分同時儲存、寄信與計價的服務","以 Strategy 支援新增折扣而不改 Checkout","用小介面取代大型 Service Protocol","注入 MemoryRepository 測試高階使用案例"],
  ["以 Factory 建立不同匯出器","把折扣條件重構為 Strategy","用 Observer 發送訂單事件","以 Adapter 包裝介面不同的外部服務"],
  ["追蹤 Browser 到 Database 的請求流程","把容量規則移入 Course domain model","用 Service 協調註冊使用案例","以 Repository Protocol 隔離 ORM"],
  ["建立 Cloud、Ollama、Fake 三種 Provider","在 Service 中集中 prompt 與錯誤處理","以環境變數選擇 Provider","撰寫 systemd、反向代理與健康檢查流程"],
  ["用一句話重寫每個核心類別責任","比較 UML 與實際 import 依賴方向","替主要使用案例補正常與失敗測試","請同學依 README 在乾淨環境重建專題"],
  ["以評分規準逐項檢查專題證據","從展示流程反查缺少的功能或文件","以 Spy／Fake 驗證外部互動","完成部署網址、版本標記與最終反思"],
];

function lectureFor(week:number, topic:string, index:number) {
  const specific=weekNotes[week-1];
  return {
    title:topic,
    lead:`本章聚焦「${topic}」。授課時應先說明它解決的問題，再從 Python 執行行為、設計選擇與錯誤案例逐步建立完整心智模型。`,
    sections:[
      {title:"1. 核心概念與運作方式",items:[specific[index*2],specific[index*2+1],"請學生用自己的話重新敘述概念，並指出程式執行前後有哪些狀態或依賴發生改變。"]},
      {title:"2. Python 實作觀察",items:[applications[week-1][index],`在本週完整範例中找出與「${topic}」直接相關的類別、方法、型別提示或控制流程。`,"執行前先預測輸出，再加入 print、repr 或測試觀察物件身分、狀態與訊息傳遞。"]},
      {title:"3. 設計判斷",items:[`先確認「${topic}」是否真的回應目前需求，而不是為了使用語法或模式而增加複雜度。`,"比較至少兩種可行寫法，從可讀性、耦合、可測試性、擴充成本與執行效能說明取捨。","把設計決策寫成一句話：因為哪一項變化或規則，所以選擇目前的責任與介面配置。"]},
      {title:"4. 常見錯誤與診斷",items:[pitfalls[week-1][index],"要求學生建立最小反例重現問題，再修改為正確版本並比較輸出。","檢查錯誤屬於語法、執行期型別、物件狀態、責任配置或依賴方向，避免只修正表面訊息。"]},
    ],
    demo:`# 課堂示範：${applications[week-1][index]}\n# 1. 先執行本頁下方完整範例\n# 2. 找出與「${topic}」相關的程式行\n# 3. 修改一項輸入、狀態或具體實作\n# 4. 比較修改前後輸出並說明原因`,
    questions:[`「${topic}」主要解決什麼問題？`,`如果不用這項設計，哪一段程式最先變得難以修改？`,`如何用輸出、測試或圖表證明目前實作正確？`],
  };
}

const weekNotes: string[][] = [
  ["程序式設計把資料與處理資料的函式分開管理，流程通常由主程式控制。","物件導向將狀態與行為封裝在物件內，控制權分散到負責任的物件。","函數式設計偏好不可變資料與純函式，降低隱藏狀態造成的副作用。","從 C 轉換時，可把 struct 視為狀態，把操作 struct 的函式移入類別。","類別不是資料表；沒有行為、只放欄位的類別通常無法發揮物件導向價值。","物件之間應以方法呼叫傳遞訊息，而不是任意修改彼此內部資料。","專題評量會同時檢查功能、類別責任、物件關係、測試、文件與部署。","選擇典範時應考量問題特性，不需要把所有程式都強迫寫成類別。"],
  ["Python 名稱在執行時繫結到物件，名稱本身沒有固定型別。","bool 是 int 的子型別，但條件式應優先使用清楚的布林語意。","list 適合有順序且會變動的資料；tuple 適合固定結構或不可變紀錄。","dict 以鍵快速查找值；set 適合唯一性、交集、聯集與成員判斷。","預設參數在函式定義時建立，不可直接使用 list 或 dict 作為可變預設值。","*args 收集額外位置參數，**kwargs 收集額外關鍵字參數。","Python 的參數傳遞可理解為物件參考的傳值；函式收到新的名稱繫結。","容器推導式應保持簡短，複雜條件應改用一般迴圈提高可讀性。"],
  ["物件具有 identity、state、behavior；三者共同形成可辨識的執行個體。","__new__ 建立物件，__init__ 負責把已建立的物件初始化為有效狀態。","self 不是關鍵字，但依慣例必須使用 self 表示接收訊息的實體。","實體屬性放在個別物件的 __dict__，類別屬性則由類別與實體共同查找。","若以實體指定同名屬性，會遮蔽類別屬性而不是修改類別本身。","classmethod 的第一個參數是 cls，可依實際子類別建立物件。","staticmethod 不接收 self 或 cls，適合與類別語意相關的純工具操作。","建構子應建立有效物件，避免先建立不完整狀態再由外部補欄位。"],
  ["封裝的重點是保護設計決策與不變條件，不只是把名稱加上底線。","單底線表示非公開慣例；雙底線觸發 name mangling，主要避免子類別名稱衝突。","property 可在不改變呼叫語法的情況下加入驗證、計算或相容處理。","setter 應拒絕非法狀態，而不是默默修正所有錯誤輸入。","唯讀 property 只提供 getter，讓外部能觀察但不能直接改寫。","可變集合應回傳副本、tuple 或唯讀檢視，避免呼叫端繞過驗證。","Tell–Don’t–Ask 鼓勵要求物件完成工作，而不是取出資料後替它做決策。","公開介面一旦被使用就形成契約，命名與例外行為應保持穩定。"],
  ["變數保存的是物件參考；a=b 不會複製物件，只讓兩個名稱指向同一物件。","is 比較是否為同一物件；== 呼叫物件的相等語意。","小整數或字串可能被快取，因此不可用 is 比較一般資料值。","可變物件能在 identity 不變時改變內容，不可變物件的操作會得到新物件。","函式修改傳入 list 的內容會影響呼叫端，重新繫結參數則不會。","shallow copy 建立新外層容器，但內部元素仍指向原物件。","deepcopy 遞迴複製物件圖，成本較高且不一定適合外部資源。","循環參考可由垃圾回收器處理，但資源釋放不應依賴回收時機。"],
  ["Association 表示物件長期知道另一物件，通常對應屬性或集合。","Dependency 表示暫時使用，常出現在方法參數、區域變數或回傳值。","Aggregation 的部分可獨立存在；Composition 的部分生命週期由整體管理。","UML 實心菱形表示組合，空心菱形表示聚合，虛線箭頭表示依賴。","Multiplicity 1、0..1、*、1..* 分別表達必有、可選、多個與至少一個。","關聯類別可承載兩個類別關係本身的資料，例如 Enrollment 的成績。","雙向關聯會增加同步責任，沒有雙向導覽需求時應保持單向。","先寫類別責任再畫關係，可避免把資料庫外鍵直接當成物件設計。"],
  ["繼承表達 Is-a 與可替換關係，不只是為了少寫幾行程式。","方法覆寫必須維持基底類別使用者所期待的前置與後置條件。","super() 不是固定呼叫父類別，而是沿目前類別的 MRO 尋找下一個實作。","協作式多重繼承要求每層方法都使用相容簽名並呼叫 super。","Mixin 應小而聚焦，通常不獨立建立物件，也不保存核心領域狀態。","菱形繼承若直接指定父類別方法，可能造成重複初始化。","Class.mro() 可顯示 C3 linearization 計算出的解析順序。","若子類別需要停用或拒絕父類別能力，通常代表繼承關係不恰當。"],
  ["多型讓呼叫端只依賴共同操作，不需要知道物件的具體類別。","動態繫結會依執行時物件選擇方法實作，支援開放式擴充。","鴨子型別以可用行為判斷相容性，不要求共同名義基底類別。","ABC 適合需要共享實作、執行期檢查或明確繼承關係的情況。","Protocol 適合結構式型別；既有類別不必顯式繼承即可符合介面。","型別提示不會自動進行執行期驗證，需搭配靜態檢查工具。","策略物件透過組合注入，可在執行時替換並方便建立測試替身。","依賴抽象時，抽象應由使用端需要的能力決定，而非複製實作端全部方法。"],
  ["先用術語表確認 identity、equality、encapsulation、polymorphism 等定義。","程式追蹤題應畫出名稱到物件的箭頭，逐行記錄狀態變化。","遇到 copy 題目要區分外層容器與巢狀元素是否共享。","UML 題先辨識責任，再標示關係與 multiplicity。","繼承題應先列出 MRO，再依順序追蹤 super 呼叫。","多型題應檢查呼叫端是否依賴共同介面而非 isinstance 分支。","封裝題應說明被保護的不變條件，而不只回答使用 private。","設計題沒有唯一答案，但每個關係與方法配置都必須有需求依據。"],
  ["__repr__ 應提供無歧義、利於除錯的表示；__str__ 提供使用者友善文字。","實作 __eq__ 後若物件可變，通常不應提供穩定 __hash__。","運算子多載應符合既有運算語意，避免讓 + 產生令人意外的副作用。","__call__ 讓物件像函式使用，適合保存設定或累積狀態的策略。","Iterable 的 __iter__ 可回傳新的 iterator；Iterator 的 __iter__ 回傳自己。","__next__ 無資料時必須拋出 StopIteration。","generator 以 yield 暫停並保存區域狀態，適合惰性資料流。","context manager 的 __exit__ 必須保證清理，並決定是否抑制例外。"],
  ["dataclass 適合以資料值為主的物件，但領域規則仍應放入方法。","default_factory 用於建立每個實體獨立的 list、dict 等可變預設值。","frozen=True 提供淺層不可變性，內部可變欄位仍可能被修改。","slots=True 可限制動態屬性並減少大量實體的記憶體成本。","Enum 成員是具名稱的唯一值，適合取代魔術字串與整數常數。","TypeVar 表達多個位置必須維持相同型別的關係。","Generic[T] 讓容器、Repository 與服務在保留型別資訊下重用。","Protocol 可搭配 TypeVar 描述泛型能力介面。"],
  ["分析階段關注問題領域，避免過早加入資料庫、框架或畫面元件。","需求名詞只是候選類別，需排除屬性、角色重複與無行為資料。","動詞提示責任，但責任應配置到擁有必要資訊的物件。","CRC 卡以 Class、Responsibilities、Collaborators 快速檢查分工。","使用案例描述角色目標、前置條件、主要流程、替代流程與後置條件。","系統循序圖把系統視為黑箱；設計循序圖則顯示內部物件協作。","Controller 應協調流程，不應吸收所有領域規則。","從互動反推方法介面，再以類別圖整理穩定結構。"],
  ["SRP 的責任可理解為變更原因，並非要求每個類別只能有一個方法。","OCP 對預期變化建立擴充點，不能為所有未知可能性過度抽象。","LSP 要求子型別維持行為契約，不能加強前置條件或削弱後置條件。","ISP 讓用戶只依賴真正需要的方法，避免胖介面。","DIP 讓高階政策與低階細節共同依賴抽象。","依賴注入是提供依賴的方式，DIP 是依賴方向的設計原則。","高內聚讓同一變更集中，低耦合減少變更擴散。","Favor Composition over Inheritance 提供更彈性的執行期替換。"],
  ["Factory 封裝建立決策，讓呼叫端不直接依賴具體類別名稱。","Strategy 把演算法變化封裝為可替換物件，移除大型條件分支。","Observer 建立一對多通知，但需注意訂閱解除、順序與錯誤隔離。","Adapter 把既有介面轉成用戶需要的介面，不修改被轉接物件。","長方法、重複程式、資料泥團與散彈式修改是常見 Code Smell。","重構必須保持外部可觀察行為不變，並以小步驟持續執行測試。","Mock 適合驗證重要互動；值計算應優先使用真實物件的狀態測試。","模式應回應已知的變化與耦合問題，不應為展示模式而增加複雜度。"],
  ["HTTP 請求包含 method、path、headers 與 body，回應包含 status、headers 與內容。","Router 依 URL 與方法選擇 View；View 負責轉換輸入輸出而非領域規則。","表單驗證應區分格式錯誤與領域規則違反。","ORM identity map 可能讓同一資料列在交易中對應同一物件。","CRUD 不是完整領域模型；複雜規則應以具意圖的方法表達。","Application Service 協調使用案例與交易邊界。","Repository 提供類似集合的領域介面，隱藏 SQL 或外部 API。","依賴方向應由介面層指向應用與領域，基礎設施實作領域需要的介面。"],
  ["Provider 封裝不同模型供應商的認證、請求與回應格式。","LLM Service 管理提示模板、重試、timeout、token 限制與結果解析。","介面應回傳應用需要的結果，而不是洩漏特定供應商完整回應。","OllamaProvider 與雲端 Provider 可共用 Protocol，並以設定選擇實作。","API Key 必須放在環境變數或密鑰服務，不可提交到 Git。","外部呼叫需處理限流、網路失敗、不合法輸出與降級策略。","Python 虛擬環境與鎖定版本確保部署可重現。","Linux 部署應考量 systemd、反向代理、HTTPS、日誌與健康檢查。"],
  ["專題核心類別應以一句話說明責任，若包含「以及」通常需要再檢查。","UML 關係與 multiplicity 必須和實際程式及資料規則一致。","Controller、Manager、Utils 過大常代表責任尚未分配到領域物件。","外部服務、檔案與資料庫應放在架構邊界並透過介面隔離。","測試應涵蓋主要使用案例、邊界值、非法狀態與外部失敗。","例外需在能處理的層級捕捉，不可用 except Exception 靜默忽略。","README 應包含目的、功能、架構、安裝、操作、測試與部署。","重構前後應保留可比較證據，例如測試、複雜度或依賴關係變化。"],
  ["期末作品需先清楚界定問題、使用者與可驗證的功能範圍。","核心領域至少應展現封裝、責任分配與有意義的物件協作。","UML 類別圖需與最終程式一致，並標示重要關係與多重性。","至少選擇一項 SOLID 原則或設計模式，說明它解決的具體問題。","測試報告需包含測試範圍、案例、結果與尚未處理的風險。","部署需提供可瀏覽網址或可重現的完整啟動步驟。","展示應依問題、需求、設計、操作、品質證據與反思安排。","繳交內容包含原始碼、版本紀錄、README、UML、測試與個人反思。"],
];

const examples = [
  {title:"由程序式重構為物件協作",code:String.raw`# 程序式：資料與操作分離
account = {"owner": "Amy", "balance": 1000}
def withdraw(data, amount):
    if 0 < amount <= data["balance"]:
        data["balance"] -= amount

# 物件導向：由物件維持自己的規則
class Account:
    def __init__(self, owner: str, balance: int = 0):
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount: int) -> None:
        if amount <= 0:
            raise ValueError("金額必須為正數")
        if amount > self.balance:
            raise ValueError("餘額不足")
        self.balance -= amount

amy = Account("Amy", 1000)
amy.withdraw(250)
print(amy.balance)`,output:"750",points:["資料與驗證規則移入 Account","呼叫端只需傳送 withdraw 訊息","物件保證餘額不會因提款變成負數"]},
  {title:"容器、函式與參數設計",code:String.raw`def summarize(scores: list[int]) -> dict[str, float]:
    if not scores:
        return {"count": 0, "average": 0.0}
    return {
        "count": len(scores),
        "average": sum(scores) / len(scores),
        "highest": max(scores),
    }

raw = "85, 92, 76, 88"
scores = [int(value.strip()) for value in raw.split(",")]
result = summarize(scores)
for key, value in result.items():
    print(f"{key}: {value}")`,output:"count: 4\naverage: 85.25\nhighest: 92",points:["輸入轉換與統計責任分開","空集合先處理以避免除以零","型別提示清楚描述容器內容"]},
  {title:"實體、類別與替代建構子",code:String.raw`class Student:
    school = "YunTech"
    count = 0

    def __init__(self, student_id: str, name: str):
        self.student_id = student_id
        self.name = name
        Student.count += 1

    @classmethod
    def from_csv(cls, row: str) -> "Student":
        student_id, name = row.split(",")
        return cls(student_id.strip(), name.strip())

amy = Student.from_csv("B11301, Amy")
bob = Student("B11302", "Bob")
print(amy.name, amy.school, Student.count)`,output:"Amy YunTech 2",points:["name 是每個實體獨立的狀態","school 與 count 是共享類別屬性","from_csv 提供具名稱的替代建構方式"]},
  {title:"Property 維持類別不變條件",code:String.raw`class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float) -> None:
        if value < 0:
            raise ValueError("價格不可為負數")
        self._price = round(value, 2)

book = Product("Python OOP", 580.126)
print(book.price)`,output:"580.13",points:["所有價格寫入都經過同一驗證入口","內部使用 _price 避免 setter 遞迴","外部仍以 book.price 的自然語法操作"]},
  {title:"Alias、淺複製與深複製",code:String.raw`from copy import copy, deepcopy

order = {"items": [{"name": "Book", "qty": 1}]}
alias = order
shallow = copy(order)
deep = deepcopy(order)

alias["items"][0]["qty"] = 2
print(order["items"][0]["qty"])
print(shallow["items"][0]["qty"])
print(deep["items"][0]["qty"])
print(order is alias, order is shallow)`,output:"2\n2\n1\nTrue False",points:["alias 與 order 是同一物件","shallow 的外層不同但 items 仍共享","deep 的巢狀物件也已獨立"]},
  {title:"以程式表達組合與關聯",code:String.raw`class Engine:
    def start(self) -> str:
        return "engine started"

class Car:
    def __init__(self, plate: str):
        self.plate = plate
        self._engine = Engine()       # composition
        self.driver: Driver | None = None  # association

    def assign(self, driver: "Driver") -> None:
        self.driver = driver

class Driver:
    def __init__(self, name: str):
        self.name = name

car = Car("ABC-123")
car.assign(Driver("Amy"))
print(car.driver.name, car._engine.start())`,output:"Amy engine started",points:["Engine 由 Car 建立並擁有生命週期","Driver 可獨立存在並被指派給 Car","型別提示表達可選關聯"]},
  {title:"覆寫、super 與 MRO",code:String.raw`class Logged:
    def save(self) -> None:
        print("write log")
        super().save()

class Repository:
    def save(self) -> None:
        print("save data")

class StudentRepository(Logged, Repository):
    pass

repo = StudentRepository()
repo.save()
print([cls.__name__ for cls in StudentRepository.mro()])`,output:"write log\nsave data\n['StudentRepository', 'Logged', 'Repository', 'object']",points:["super 依 MRO 尋找下一個方法","Logged 可作為聚焦的 Mixin","各層協作而不是直接指定父類別"]},
  {title:"Protocol 與可替換支付策略",code:String.raw`from typing import Protocol

class Payment(Protocol):
    def pay(self, amount: int) -> str: ...

class CardPayment:
    def pay(self, amount: int) -> str:
        return f"card paid {amount}"

class Checkout:
    def __init__(self, payment: Payment):
        self.payment = payment

    def submit(self, total: int) -> str:
        return self.payment.pay(total)

print(Checkout(CardPayment()).submit(1200))`,output:"card paid 1200",points:["CardPayment 不必繼承 Protocol","Checkout 只依賴自己需要的 pay 能力","測試時可注入 FakePayment"]},
  {title:"期中綜合：追蹤物件狀態",code:String.raw`class Cart:
    tax_rate = 0.05
    def __init__(self):
        self.items: list[int] = []
    def add(self, price: int) -> None:
        self.items.append(price)
    @property
    def total(self) -> float:
        return sum(self.items) * (1 + self.tax_rate)

a = Cart()
b = a
c = Cart()
a.add(100)
c.items = a.items.copy()
b.add(200)
print(a.total, c.total, a is b)`,output:"315.0 105.0 True",points:["a 與 b 指向同一個 Cart","c 是另一物件且 items 已複製","property 每次依目前狀態計算總額"]},
  {title:"特殊方法、迭代與 Context Manager",code:String.raw`class Playlist:
    def __init__(self, songs: list[str]):
        self.songs = songs
    def __len__(self) -> int:
        return len(self.songs)
    def __iter__(self):
        return iter(self.songs)
    def __repr__(self) -> str:
        return f"Playlist({self.songs!r})"
    def __enter__(self):
        print("start playlist")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("stop playlist")

with Playlist(["A", "B"]) as playlist:
    print(len(playlist), list(playlist))`,output:"start playlist\n2 ['A', 'B']\nstop playlist",points:["內建 len 與 for 會查找類別上的特殊方法","__iter__ 委派給 list iterator","with 即使發生例外也會執行 __exit__"]},
  {title:"dataclass、Enum 與泛型 Repository",code:String.raw`from dataclasses import dataclass
from enum import Enum, auto
from typing import Generic, TypeVar

class Status(Enum):
    DRAFT = auto()
    PAID = auto()

@dataclass(frozen=True, slots=True)
class Order:
    id: int
    total: int
    status: Status = Status.DRAFT

T = TypeVar("T")
class Repository(Generic[T]):
    def __init__(self):
        self._items: list[T] = []
    def add(self, item: T) -> None:
        self._items.append(item)

orders = Repository[Order]()
orders.add(Order(1, 1200))
print(orders._items[0])`,output:"Order(id=1, total=1200, status=<Status.DRAFT: 1>)",points:["dataclass 產生初始化與表示方法","Enum 限制合法狀態集合","Repository 保留實體型別資訊"]},
  {title:"從使用案例配置物件責任",code:String.raw`class Book:
    def __init__(self, title: str):
        self.title = title
        self.available = True
    def borrow(self) -> None:
        if not self.available:
            raise ValueError("already borrowed")
        self.available = False

class Member:
    def __init__(self, name: str, limit: int = 3):
        self.name = name
        self.limit = limit
        self.loans: list[Book] = []
    def borrow(self, book: Book) -> None:
        if len(self.loans) >= self.limit:
            raise ValueError("loan limit")
        book.borrow()
        self.loans.append(book)

member = Member("Amy")
member.borrow(Book("OOP"))
print(member.loans[0].title)`,output:"OOP",points:["Book 負責自己的可借狀態","Member 負責借閱上限與持有的借閱","使用案例由物件協作完成而非集中在主程式"]},
  {title:"DIP：高階服務依賴抽象",code:String.raw`from typing import Protocol

class OrderRepository(Protocol):
    def save(self, order: dict) -> None: ...

class MemoryRepository:
    def __init__(self):
        self.saved: list[dict] = []
    def save(self, order: dict) -> None:
        self.saved.append(order)

class PlaceOrder:
    def __init__(self, repo: OrderRepository):
        self.repo = repo
    def execute(self, item: str, price: int) -> dict:
        order = {"item": item, "price": price}
        self.repo.save(order)
        return order

repo = MemoryRepository()
PlaceOrder(repo).execute("Book", 580)
print(repo.saved)`,output:"[{'item': 'Book', 'price': 580}]",points:["PlaceOrder 不知道資料庫細節","抽象由高階使用案例需要的 save 定義","MemoryRepository 讓測試快速且可觀察"]},
  {title:"Strategy 與 Factory",code:String.raw`from typing import Protocol

class Discount(Protocol):
    def apply(self, total: int) -> int: ...

class Regular:
    def apply(self, total: int) -> int:
        return total

class Vip:
    def apply(self, total: int) -> int:
        return int(total * 0.8)

def create_discount(level: str) -> Discount:
    return Vip() if level == "vip" else Regular()

class Checkout:
    def __init__(self, discount: Discount):
        self.discount = discount
    def total(self, subtotal: int) -> int:
        return self.discount.apply(subtotal)

print(Checkout(create_discount("vip")).total(1000))`,output:"800",points:["Strategy 移除 Checkout 內的會員條件分支","Factory 集中具體策略的建立決策","增加新折扣不需修改 Checkout"]},
  {title:"Domain、Service 與 Repository 分層",code:String.raw`from dataclasses import dataclass
from typing import Protocol

@dataclass
class Course:
    code: str
    capacity: int
    enrolled: int = 0
    def enroll(self) -> None:
        if self.enrolled >= self.capacity:
            raise ValueError("course is full")
        self.enrolled += 1

class CourseRepo(Protocol):
    def get(self, code: str) -> Course: ...
    def save(self, course: Course) -> None: ...

class EnrollService:
    def __init__(self, repo: CourseRepo):
        self.repo = repo
    def execute(self, code: str) -> None:
        course = self.repo.get(code)
        course.enroll()
        self.repo.save(course)`,output:"Service 取得課程 → Domain 執行規則 → Repository 儲存",points:["容量規則位於 Course 領域物件","Service 協調一個完整使用案例","Repository 隔離 ORM 或 SQL"]},
  {title:"可替換的 LLM Provider",code:String.raw`from typing import Protocol

class LLMProvider(Protocol):
    def complete(self, prompt: str) -> str: ...

class FakeProvider:
    def complete(self, prompt: str) -> str:
        return f"[fake] {prompt[:20]}"

class TutorService:
    def __init__(self, provider: LLMProvider):
        self.provider = provider
    def explain(self, concept: str) -> str:
        prompt = f"以大學生程度解釋：{concept}"
        try:
            return self.provider.complete(prompt)
        except TimeoutError:
            return "服務暫時無法使用"

print(TutorService(FakeProvider()).explain("polymorphism"))`,output:"[fake] 以大學生程度解釋：polymorph",points:["Service 管理提示與錯誤策略","Provider 封裝供應商實作","FakeProvider 讓測試不需要網路與 API Key"]},
  {title:"用測試保護專題重構",code:String.raw`from dataclasses import dataclass

@dataclass
class Cart:
    prices: list[int]
    def subtotal(self) -> int:
        return sum(self.prices)
    def checkout(self, discount: float = 0) -> int:
        if not 0 <= discount <= 1:
            raise ValueError("invalid discount")
        return round(self.subtotal() * (1 - discount))

def test_cart_checkout():
    cart = Cart([500, 300])
    assert cart.subtotal() == 800
    assert cart.checkout(0.25) == 600

def test_invalid_discount():
    try:
        Cart([100]).checkout(1.5)
        assert False
    except ValueError:
        assert True`,output:"兩個測試皆通過；重構 Cart 時可快速檢查行為是否改變。",points:["測試名稱描述行為而非方法內部細節","同時涵蓋正常與非法輸入","重構前先建立安全網"]},
  {title:"期末專題的可測試架構",code:String.raw`from typing import Protocol

class Notifier(Protocol):
    def send(self, message: str) -> None: ...

class ProjectService:
    def __init__(self, notifier: Notifier):
        self.notifier = notifier
    def complete(self, project: dict) -> None:
        required = {"code", "readme", "tests", "deployment"}
        missing = required - project.keys()
        if missing:
            raise ValueError(f"missing: {sorted(missing)}")
        self.notifier.send("project accepted")

class SpyNotifier:
    def __init__(self):
        self.messages: list[str] = []
    def send(self, message: str) -> None:
        self.messages.append(message)

spy = SpyNotifier()
ProjectService(spy).complete(
    {"code":1, "readme":1, "tests":1, "deployment":1}
)
print(spy.messages)`,output:"['project accepted']",points:["交付規則集中在應用服務","Notifier 介面隔離外部寄信或聊天服務","Spy 測試替身能驗證重要互動"]},
];

const references = [
  ["Python Tutorial：Classes","https://docs.python.org/3/tutorial/classes.html"],
  ["Python Data Model","https://docs.python.org/3/reference/datamodel.html"],
  ["typing — Type Hints","https://docs.python.org/3/library/typing.html"],
  ["abc — Abstract Base Classes","https://docs.python.org/3/library/abc.html"],
];

function SvgDiagram({week, topics}:{week:number;topics:readonly string[]}) {
  const hierarchy=[6,7,8,13,14,15,16].includes(week);
  const pos=hierarchy?[[350,55],[110,205],[350,205],[590,205]]:[[50,125],[250,125],[450,125],[650,125]];
  return <svg className="lesson-svg" viewBox="0 0 800 330" role="img" aria-labelledby={`svg-title-${week} svg-desc-${week}`}>
    <title id={`svg-title-${week}`}>第 {week} 週概念圖</title><desc id={`svg-desc-${week}`}>呈現本週四個主要概念的關係。</desc>
    <defs><marker id={`arrow-${week}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#d9f25f"/></marker></defs>
    {hierarchy?<>{[1,2,3].map(i=><line key={i} x1="400" y1="125" x2={pos[i][0]+50} y2="205" stroke="#d9f25f" strokeWidth="3" markerEnd={`url(#arrow-${week})`}/>)}</>:<>{[0,1,2].map(i=><line key={i} x1={pos[i][0]+100} y1="165" x2={pos[i+1][0]} y2="165" stroke="#d9f25f" strokeWidth="3" markerEnd={`url(#arrow-${week})`}/>)}</>}
    {topics.map((topic,i)=><g key={topic} transform={`translate(${pos[i][0]},${pos[i][1]})`}><rect width="150" height="80" rx="10" fill={i===0?"#d9f25f":"#20352e"} stroke={i===0?"#d9f25f":"#587269"} strokeWidth="2"/><foreignObject x="8" y="8" width="134" height="64"><div className={i===0?"svg-label dark":"svg-label"}>{topic}</div></foreignObject></g>)}
  </svg>;
}

export const generateStaticParams = () => lessons.map((_, i) => ({ week: String(i + 1) }));

export async function generateMetadata({params}:{params:Promise<{week:string}>}):Promise<Metadata>{
  const n=Number((await params).week), lesson=lessons[n-1];
  return lesson?{title:`第 ${n} 週｜${lesson[0]}`,description:`物件導向程式設計第 ${n} 週完整教材`}:{};
}

export default async function WeekPage({params}:{params:Promise<{week:string}>}){
  const n=Number((await params).week), lesson=lessons[n-1];
  if(!lesson) notFound();
  const topics=lesson.slice(2);
  return <main className="lesson-page">
    <header className="site-header"><Link className="brand" href="/"><span>OO</span> 物件導向程式設計</Link><nav><Link href="/">課程首頁</Link><a href="#notes">詳細講義</a><a href="#code">程式範例</a><a href="#lab">課堂實作</a></nav></header>
    <section className="lesson-hero"><div><p className="eyebrow">WEEK {String(n).padStart(2,"0")} · {lesson[1]}</p><h1>{lesson[0]}</h1><p>本頁提供第 {n} 週的完整課堂講義、概念圖、實作流程與課後檢核，適合課堂投影與學生複習。</p></div><aside><b>本週學習重點</b><ol>{topics.slice(0,3).map(x=><li key={x}>{x}</li>)}</ol></aside></section>
    <div className="lesson-layout"><aside className="lesson-toc"><b>本頁目錄</b><a href="#objectives">學習目標</a><a href="#notes">詳細講義</a><a href="#diagram">概念圖</a><a href="#code">Python 範例</a><a href="#lab">實作任務</a><a href="#checklist">課後檢核</a></aside><article className="lesson-content">
      <section id="objectives" className="content-section"><p className="section-index">01 / OBJECTIVES</p><h2>本週學習目標</h2><ul className="objective-list">{topics.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section id="notes" className="content-section"><p className="section-index">02 / LECTURE NOTES</p><h2>詳細講義內容</h2><div className="lecture-chapters">{(n===2?week2Lectures:topics.map((topic,index)=>lectureFor(n,topic,index))).map((chapter,index)=><article className="lecture-chapter" key={chapter.title}><header><span>CHAPTER 0{index+1}</span><h3>{chapter.title}</h3><p>{chapter.lead}</p></header><div className="lecture-sections">{chapter.sections.map(section=><section key={section.title}><h4>{section.title}</h4><ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul></section>)}</div><div className="mini-demo"><div><b>課堂示範程式</b><small>請學生先預測結果，再實際執行與修改。</small></div><pre><code>{chapter.demo}</code></pre></div><div className="class-questions"><b>課堂提問</b><ol>{chapter.questions.map(question=><li key={question}>{question}</li>)}</ol></div></article>)}</div><section className="deep-notes"><h3>本週必懂的核心重點</h3><ul>{weekNotes[n-1].map(x=><li key={x}>{x}</li>)}</ul></section><div className="teaching-flow"><b>建議教學流程</b><div><span>概念引導<small>20 分鐘</small></span><i>→</i><span>程式示範<small>30 分鐘</small></span><i>→</i><span>分組討論<small>20 分鐘</small></span><i>→</i><span>動手實作<small>50 分鐘</small></span></div></div></section>
      <section id="diagram" className="content-section"><p className="section-index">03 / SVG VISUAL MODEL</p><figure className="concept-diagram"><div className="diagram-heading"><span>SCALABLE VECTOR DIAGRAM</span><h2>{lesson[0]}概念關係圖</h2></div><SvgDiagram week={n} topics={topics}/><figcaption>{[6,7,8,13,14,15,16].includes(n)?"上層為抽象或核心角色，下層為具體類別、實作或協作者。":"由左至右閱讀，呈現本週概念的處理流程與學習順序。"}</figcaption></figure></section>
      <section id="code" className="content-section code-section"><p className="section-index">04 / PYTHON EXAMPLE</p><h2>完整 Python 程式碼範例</h2><p className="code-intro">以下範例不是孤立語法片段，而是把本週概念放入可執行的小型情境。請先預測輸出，再逐行追蹤物件狀態與方法呼叫。</p><div className="example-card"><div className="example-title"><span>example_{String(n).padStart(2,"0")}.py</span><h3>{examples[n-1].title}</h3></div><pre><code>{examples[n-1].code}</code></pre><div className="example-output"><b>預期輸出／結果</b><pre>{examples[n-1].output}</pre></div><div className="example-analysis"><b>程式解讀</b><ul>{examples[n-1].points.map(x=><li key={x}>{x}</li>)}</ul></div></div></section>
      <section id="lab" className="content-section practice-panel"><p className="section-index">05 / HANDS-ON LAB</p><h2>課堂實作任務</h2><p className="lab-brief">先執行並修改上方範例，再選擇個人專題情境，運用「{topics[0]}」與「{topics[1]}」建立第二個版本。</p><ol className="lab-steps"><li><b>閱讀</b><span>預測輸出並逐行追蹤。</span></li><li><b>修改</b><span>加入一項規則與錯誤情境。</span></li><li><b>重構</b><span>改善命名、責任與重複程式。</span></li><li><b>測試</b><span>驗證正常、邊界與錯誤案例。</span></li></ol><div className="exercise-levels"><article><b>基礎題</b><p>替範例加入輸入驗證、型別提示與清楚的輸出。</p></article><article><b>進階題</b><p>增加第二種實作或物件，證明目前介面能否支援擴充。</p></article><article><b>專題題</b><p>找出專題中對應的類別或服務，套用本週技巧並提交前後差異。</p></article></div></section>
      <section id="checklist" className="content-section"><p className="section-index">06 / CHECKLIST & REFERENCES</p><h2>課後任務與檢核</h2><ul className="deliverable-list"><li><span>✓</span>能用自己的話解釋四項核心概念</li><li><span>✓</span>能在不執行程式前預測範例的主要輸出</li><li><span>✓</span>完成修改版程式並保留測試證據</li><li><span>✓</span>能說明此設計對專題維護性的影響</li></ul><div className="reflection"><b>反思問題</b><p>本週概念解決了什麼問題？如果不使用它，程式最可能在哪裡變得難以維護？</p></div><div className="reference-list"><b>延伸閱讀：Python 官方文件</b>{references.map(([label,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></section>
    </article></div>
    <nav className="lesson-pagination">{n>1?<Link href={`/week/${n-1}/`}><small>← 上一週</small><b>{lessons[n-2][0]}</b></Link>:<span/>}{n<18?<Link href={`/week/${n+1}/`}><small>下一週 →</small><b>{lessons[n][0]}</b></Link>:<Link href="/"><small>完成課程</small><b>回到課程首頁</b></Link>}</nav>
  </main>;
}
