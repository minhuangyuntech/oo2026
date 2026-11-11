"""Create missing sample posts without overwriting student edits."""
from django.core.management.base import BaseCommand
from django.db import transaction
from mysite.models import Post

SAMPLES = [
    ("hello-django", "第一篇 Django 文章", "## Hello, Django!\n\n這是 mblog 的第一篇文章。\n\n用 **Model** 儲存資料、**View** 查詢資料、**Template** 顯示內容。"),
    ("learning-notes", "我的學習筆記", "## 建立網站的步驟\n\n1. 建立專案與 App\n2. 定義 Post 模型\n3. 執行 migration\n4. 透過 admin 新增文章\n5. 用模板呈現資料"),
    ("markdown-demo", "Markdown 練習", "## 學習筆記\n\n這是一段 **粗體** 與 *斜體*。\n\n[Django](https://www.djangoproject.com/)\n\n- 建立專案\n- 定義模型\n- 輸出模板\n\n```python\nprint(\"Hello, Django!\")\n```\n\n![mblog](/static/mysite/images/logo.svg)"),
    ("template-inheritance", "共用模板與繼承", "## base.html\n\n首頁與文章頁共用網站結構。\n\n- `extends`：繼承父模板\n- `block`：定義可替換的區域\n- `include`：插入 header 與 footer"),
    ("safe-markdown", "安全顯示文章", "## 解析與清理\n\nMarkdown 先轉成 HTML，再由 nh3 依允許清單清理。最後才標記為可安全顯示的內容。\n\n> 文章內容不等於可執行的程式。"),
]

class Command(BaseCommand):
    help = "Create five missing sample posts; preserve existing posts and users."

    @transaction.atomic
    def handle(self, *args, **options):
        created_count = 0
        for slug, title, body in SAMPLES:
            _, created = Post.objects.get_or_create(slug=slug, defaults={"title": title, "body": body})
            created_count += int(created)
        self.stdout.write(self.style.SUCCESS(f"Created {created_count} posts; kept existing posts unchanged."))
