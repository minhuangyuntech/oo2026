# mblog: installation and running guide

This complete project accompanies slides 1–88 of Django Website Case Studies. It includes a post list, detail pages, admin, shared templates, Bootstrap, static assets, and Markdown sanitized with nh3. The blog interface and sample posts are in Traditional Chinese, matching the original example. All three guides describe this same project.

## 1. Requirements

Install Python 3.13 or 3.14 (3.12 also works). Extract the ZIP and open the `mblog` folder containing `manage.py`. Internet access is needed to install dependencies initially. SQLite is included with Python; no separate database or AI key is needed.

The course pins Django 5.2.18, Markdown 3.11.2, and nh3 0.3.7. Bootstrap 5.3.8 and its MIT license are included in `static/vendor/bootstrap/`. Page styling does not need a CDN connection.

## 2. Windows PowerShell

Open PowerShell in the extracted `mblog` folder and run:

```powershell
python --version
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_demo
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

These commands use the virtual environment's Python directly. You do not need Activate.ps1 or a PowerShell execution-policy change. If `python` does not start your installed Python, use `py -3.14` (or your installed version) for the first two commands.

## 3. macOS / Linux

Open a terminal in that same `mblog` folder:

```sh
python3 --version
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo
./.venv/bin/python manage.py check
./.venv/bin/python manage.py runserver 127.0.0.1:8000
```

Use only the command set for your operating system. On Ubuntu / Debian, if venv is unavailable, install the venv package matching your Python version and create the environment again.

## 4. Browse and manage posts

Keep the terminal running and open:

- Home: <http://127.0.0.1:8000/>
- First post: <http://127.0.0.1:8000/post/hello-django/>
- Markdown example: <http://127.0.0.1:8000/post/markdown-demo/>
- Administration: <http://127.0.0.1:8000/admin/>

Press `Ctrl+C` to stop the server, create your own administrator, and restart it.

Windows:

```powershell
.\.venv\Scripts\python.exe manage.py createsuperuser
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

macOS / Linux:

```sh
./.venv/bin/python manage.py createsuperuser
./.venv/bin/python manage.py runserver 127.0.0.1:8000
```

Choose your own username and password. Password characters are not displayed while you type. No preset credentials are included. Use Posts in the admin to add or edit entries. `title` is the heading, `slug` is the unique URL identifier (such as `my-first-post`), `body` accepts Markdown, and `pub_date` is generated automatically. If a Chinese title does not produce a slug, type an ASCII slug using letters, digits, and hyphens.

`seed_demo` creates five missing sample posts. Running it again preserves existing posts and your edits; it never creates users. The ZIP contains no database. `migrate` creates your local `db.sqlite3`. On later visits, run `runserver` again; installation and initialization do not need to be repeated.

## 5. Files and slides

| File | Purpose | Slides |
|---|---|---|
| `mblog/settings.py` | Apps, templates, database, static files | 12–13, 39, 67 |
| `mysite/models.py`, `migrations/0001_initial.py` | Post model and database schema | 22–25 |
| `mysite/admin.py` | Admin list, search, slug prepopulation | 30 |
| `mblog/urls.py`, `mysite/urls.py`, `mysite/views.py` | Routing, home query, detail, 404 | 38, 40, 47 |
| `templates/`, `static/` | Shared layout, post pages, CSS, logo | 54–71, 82 |
| `mysite/templatetags/markdown_extras.py` | Markdown parsing and HTML allowlist sanitization | 79–80 |
| `mysite/management/commands/seed_demo.py` | Repeatable sample-data command | Download companion utility |
| `mysite/tests.py` | Pages, data constraints, admin, Markdown tests | 84 |

## 6. Tests

Stop the development server first. Windows:

```powershell
.\.venv\Scripts\python.exe manage.py test
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
```

macOS / Linux:

```sh
./.venv/bin/python manage.py test
./.venv/bin/python manage.py makemigrations --check --dry-run
```

Tests use a separate test database and do not modify your posts. They cover empty lists, links, 404s, unique slugs, ordering, repeatable sample loading, admin create/edit/delete, CSRF, and dangerous HTML removal. No external service is called.

## 7. Troubleshooting

- `No module named django`: use the `.venv` Python for both installation and execution.
- `no such table`: run `migrate` from the folder containing `manage.py`.
- Empty home page: run `seed_demo` or add posts in the admin.
- Port already in use: use `runserver 127.0.0.1:8001` and open port 8001 in your browser too.
- `manage.py` not found: enter the extracted `mblog` directory. Do not run directly inside the ZIP or from its parent folder.
- Unknown post URL returns 404: this is expected; the slug must match an existing post.

## 8. Scope and references

This is a local learning project with `DEBUG=True` and a public classroom SECRET_KEY. Before public deployment, configure a separate secret from the environment, disable DEBUG, set production ALLOWED_HOSTS, HTTPS, static-file hosting, backups, and a production WSGI/ASGI server. `runserver` is not a production server. Do not commit your database, virtual environment, or secrets. GitHub Pages hosts the lesson and downloads; it does not execute Django.

- [English course material](https://minhuangyuntech.github.io/oo2026/en/django-case/)
- [Django 5.2 tutorial](https://docs.djangoproject.com/en/5.2/intro/tutorial02/)
- [nh3 documentation](https://nh3.readthedocs.io/en/latest/)
- [Bootstrap downloads and license](https://getbootstrap.com/docs/5.3/getting-started/download/)
