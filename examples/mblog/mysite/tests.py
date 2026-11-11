from datetime import timedelta
from io import StringIO
from pathlib import Path
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.staticfiles import finders
from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone
from .models import Post
from .templatetags.markdown_extras import render_markdown

class BlogTests(TestCase):
    def post(self, **kwargs):
        return Post.objects.create(**({"title":"Hello", "slug":"hello-django", "body":"## Heading\n\n**bold**"} | kwargs))

    def test_empty_home(self):
        self.assertContains(self.client.get(reverse("mysite:home")), "目前還沒有文章")

    def test_home_links_summary_and_escapes_title(self):
        post = self.post(title='<script>alert(1)</script>', body="A" * 100)
        response = self.client.get(reverse("mysite:home"))
        self.assertContains(response, reverse("mysite:post-detail", kwargs={"slug":post.slug}))
        self.assertContains(response, "&lt;script&gt;")
        self.assertNotContains(response, "A" * 100)
        self.assertNotContains(response, "<script>")

    def test_detail_and_missing_slug(self):
        self.post()
        response = self.client.get("/post/hello-django/")
        self.assertContains(response, "<h2>Heading</h2>")
        self.assertContains(response, "<strong>bold</strong>")
        self.assertEqual(self.client.get("/post/missing/").status_code, 404)

    def test_unique_slug(self):
        self.post()
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.post()

    def test_date_order_and_tie_break(self):
        first=self.post(slug="first")
        second=self.post(slug="second")
        Post.objects.update(pub_date=timezone.now())
        self.assertEqual(list(Post.objects.all()), [second,first])
        Post.objects.filter(pk=first.pk).update(pub_date=timezone.now()+timedelta(days=1))
        self.assertEqual(Post.objects.first().pk, first.pk)

    def test_seed_preserves_edits_and_users(self):
        call_command("seed_demo", stdout=StringIO())
        post=Post.objects.get(slug="hello-django")
        post.title="My edited title";post.save()
        call_command("seed_demo", stdout=StringIO())
        self.assertEqual(Post.objects.count(),5)
        self.assertEqual(Post.objects.get(pk=post.pk).title,"My edited title")
        self.assertEqual(get_user_model().objects.count(),0)

    def test_markdown_features_and_xss_removal(self):
        safe=render_markdown('## Title\n\n- one\n- two\n\n```python\nprint("hi")\n```')
        for token in ['<h2>Title</h2>','<ul>','<pre><code>']: self.assertIn(token,safe)
        unsafe='<script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">link</a><iframe src="https://example.com">bad</iframe>'
        post=self.post(body=unsafe)
        output=self.client.get(reverse("mysite:post-detail",kwargs={"slug":post.slug})).content.decode()
        for token in ['<script','onerror','javascript:','<iframe','alert(1)']:self.assertNotIn(token,output)
        self.assertIn('rel="nofollow noopener noreferrer"',render_markdown('[Django](https://www.djangoproject.com/)'))

    def test_static_assets_and_local_bootstrap(self):
        for name in ['mysite/css/site.css','mysite/images/logo.svg','vendor/bootstrap/bootstrap.min.css']:
            self.assertTrue(finders.find(name),name)
        response=self.client.get('/')
        self.assertContains(response,'/static/vendor/bootstrap/bootstrap.min.css')
        self.assertNotContains(response,'cdn.jsdelivr.net')
        self.assertTrue((Path(settings.BASE_DIR)/'static/vendor/bootstrap/LICENSE').exists())

    def test_admin_authentication(self):
        self.assertEqual(self.client.get('/admin/mysite/post/').status_code,302)
        user=get_user_model().objects.create_superuser('local_test',password='only-for-unit-tests-9281')
        self.client.force_login(user)
        self.assertEqual(self.client.get('/admin/mysite/post/').status_code,200)

    def test_admin_create_edit_delete(self):
        user=get_user_model().objects.create_superuser('local_test',password='only-for-unit-tests-9281')
        self.client.force_login(user)
        response=self.client.post('/admin/mysite/post/add/',{'title':'Created','slug':'created','body':'**new**','_save':'Save'})
        self.assertEqual(response.status_code,302)
        post=Post.objects.get(slug='created')
        response=self.client.post(f'/admin/mysite/post/{post.pk}/change/',{'title':'Edited','slug':'created','body':'updated','_save':'Save'})
        self.assertEqual(response.status_code,302)
        self.assertEqual(Post.objects.get(pk=post.pk).title,'Edited')
        response=self.client.post(f'/admin/mysite/post/{post.pk}/delete/',{'post':'yes'})
        self.assertEqual(response.status_code,302)
        self.assertFalse(Post.objects.filter(pk=post.pk).exists())

    def test_admin_post_requires_csrf(self):
        client=Client(enforce_csrf_checks=True)
        self.assertEqual(client.post('/admin/login/',{'username':'x','password':'x'}).status_code,403)
