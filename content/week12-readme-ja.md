# 実験室環境モニタリングステーション（第12週のサンプル）

オブジェクト指向分析・設計 × AI支援開発。ハードウェアは不要で、模擬センサーで実行します。

ドキュメント、コードのコメント、プログラムのメッセージは繁体字中国語です。授業で使うファイルと手順は、日本語版の第12週スライドで説明しています。

## 環境の準備

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -e ".[dev]"
```

## 実行

```bash
python -m lab_monitor     # デモ：8 回のサンプリング
pytest                    # 本体のテスト（すべて通るはず）
mypy src                  # 型チェック
```

## ファイル案内

| パス | 内容 |
|---|---|
| `docs/requirements.md` | 要求、確認事項、ユーザーストーリー、ユースケース、やらないこと |
| `docs/design.md` | ドメインモデル、クラス図、シーケンス図、責務の割り当て、設計判断 |
| `docs/crc-cards.md` | CRCカードとシナリオ・ロールプレイ |
| `docs/prompts.md` | 各段階のプロンプトのテンプレート |
| `docs/review-checklist.md` | AI の出力のレビューチェックリスト |
| `docs/ai-log-template.md` | AI利用記録（最終プロジェクトの振り返りの材料） |
| `AGENTS.md` | AI アシスタント向けのプロジェクトのルール |
| `src/lab_monitor/` | 本体のプログラム |
| `tests/` | 本体のテスト |
| `exercises/a_rate_rule/` | 演習A：変化率アラート |
| `exercises/b_cooldown/` | 演習B：アラートのクールダウン |
| `exercises/flawed_design/` | AI設計の問題探し |

## 授業の演習

```bash
pytest exercises/a_rate_rule   # 最初はすべて失敗し、完成すればすべて通ります
pytest exercises/b_cooldown
```

ルール：**テストファイルを変更してはいけません**。テストはあなたと AI の間の契約です。
