import markdown
import nh3
from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()
ALLOWED_TAGS = {
    "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "em", "blockquote", "ul", "ol", "li",
    "pre", "code", "hr", "a", "img",
}
ALLOWED_ATTRIBUTES = {
    "a": {"href", "title"},
    "img": {"src", "alt", "title"},
}

@register.filter
@stringfilter
def render_markdown(text):
    raw_html = markdown.markdown(
        text, extensions=["fenced_code"]
    )
    clean_html = nh3.clean(
        raw_html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes={"https", "http", "mailto"},
        clean_content_tags={"script", "style", "iframe",
                            "object", "svg", "math"},
        link_rel="nofollow noopener noreferrer",
    )
    return mark_safe(clean_html)
