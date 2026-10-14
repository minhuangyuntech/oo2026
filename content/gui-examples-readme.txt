Python 桌面 GUI / Python desktop GUI / Python デスクトップ GUI

繁體中文
Windows 64 位元，Python 3.12。於解壓縮後的資料夾開啟 PowerShell。
依下方共通命令建立環境，再選擇需要的套件安裝及執行。
每個 .py 都可獨立執行。按 Add 1 兩次後應顯示 Count: 2。
Tkinter 使用 Python 安裝程式提供的 Tcl/Tk，不需 pip install tkinter。
requirements.txt 是原範例固定版本；不必一次安裝所有工具。
Kivy 需相容 OpenGL 環境；Dear PyGui 在 Windows 需 DirectX 11。
若要顯示中文，需設定具有中文字形的字型。行動裝置及獨立執行檔需要額外打包。

English
Windows 64-bit and Python 3.12. Open PowerShell in the extracted folder.
Create the environment below, then install and run the toolkit you want.
Every .py is independent. Click Add 1 twice to obtain Count: 2.
Tkinter requires the Python installer's Tcl/Tk component, not pip install tkinter.
requirements.txt preserves the source examples' pinned versions; installing every toolkit is optional.
Kivy needs an OpenGL environment; Dear PyGui on Windows needs DirectX 11.
Chinese/Japanese interfaces need fonts with the required glyphs. Mobile and standalone executable distribution require additional packaging.

日本語
Windows 64 ビット、Python 3.12 を使用します。展開したフォルダで PowerShell を開きます。
以下のコマンドで環境を作り、使用するツールを選んで導入・実行します。
各 .py は独立しています。Add 1 を 2 回押すと Count: 2 になります。
Tkinter には Python インストーラーの Tcl/Tk が必要で、pip install tkinter は不要です。
requirements.txt は元の例の固定バージョンです。全ツールを一括導入する必要はありません。
Kivy には OpenGL、Windows の Dear PyGui には DirectX 11 が必要です。
日本語・中国語には対応フォントを指定します。モバイル配布や単独実行ファイルには追加のパッケージ化が必要です。

PowerShell — environment / 環境 / 環境
py -3.12 -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -c "import sys; print(sys.executable)"

Tkinter
.\.venv\Scripts\python -m tkinter
.\.venv\Scripts\python 01_tkinter_counter.py

Qt / PySide6
.\.venv\Scripts\python -m pip install PySide6-Essentials
.\.venv\Scripts\python 02_pyside6_counter.py

Qt / PyQt6
.\.venv\Scripts\python -m pip install PyQt6
.\.venv\Scripts\python 02_pyqt6_counter.py

wxPython
.\.venv\Scripts\python -m pip install wxPython
.\.venv\Scripts\python 03_wxpython_counter.py

Kivy
.\.venv\Scripts\python -m pip install "Kivy[base]"
.\.venv\Scripts\python 04_kivy_counter.py

Dear PyGui
.\.venv\Scripts\python -m pip install dearpygui
.\.venv\Scripts\python 05_dearpygui_counter.py

All pinned versions / 一次安裝固定版本 / 固定バージョンを一括導入（optional / 選用 / 任意）
.\.venv\Scripts\python -m pip install -r requirements.txt

https://docs.python.org/3.12/library/tkinter.html
https://doc.qt.io/qtforpython-6/gettingstarted.html
https://www.riverbankcomputing.com/software/pyqt/
https://wxpython.org/pages/downloads/
https://kivy.org/doc/stable/gettingstarted/installation.html
https://dearpygui.readthedocs.io/en/latest/tutorials/first-steps.html
