import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


class MetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.structured = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.current = []

    def handle_data(self, data):
        if self.current is not None:
            self.current.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.current is not None:
            self.structured.append(json.loads("".join(self.current)))
            self.current = None


def parse(path):
    result = MetadataParser()
    result.feed(path.read_text(encoding="utf-8"))
    return result


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def verify(build):
    sitemap = ET.parse(build / "sitemap.xml")
    urls = {item.text for item in sitemap.findall(".//{*}loc")}
    count = 0

    def walk(value, origin):
        nonlocal count
        if isinstance(value, list):
            for item in value:
                walk(item, origin)
        elif isinstance(value, dict):
            if value.get("@type") in ("Blog", "BlogPosting"):
                count += 1
                for key in ("@id", "url", "mainEntityOfPage"):
                    if key not in value:
                        continue
                    url = value[key]
                    parts = urlsplit(url)
                    check(f"{parts.scheme}://{parts.netloc}" == origin, f"Unexpected origin: {url}")
                    check(parts.path.endswith("/"), f"Missing trailing slash: {key}={url}")
                    target = build / unquote(parts.path).lstrip("/") / "index.html"
                    check(target.is_file(), f"Missing page: {url}")
                    check(parse(target).canonicals == [url], f"Canonical mismatch: {key}={url}")
                    check(url in urls, f"Missing sitemap URL: {url}")
            for item in value.values():
                walk(item, origin)

    for path in (build / "blog").rglob("*.html"):
        page = parse(path)
        if not page.structured:
            continue
        check(len(page.canonicals) == 1, f"Expected one canonical: {path}")
        parts = urlsplit(page.canonicals[0])
        origin = f"{parts.scheme}://{parts.netloc}"
        for data in page.structured:
            if data.get("@type") in ("Blog", "BlogPosting"):
                check(data["@id"] == page.canonicals[0], f"Page identity mismatch: {path}")
            walk(data, origin)

    mos = parse(build / "blog/mos-qualification-guide/index.html")
    posts = [data for data in mos.structured if data.get("@type") == "BlogPosting"]
    check(len(posts) == 1, "Expected exactly one MOS BlogPosting")
    post = posts[0]
    check(post["author"]["url"] == "https://github.com/nomuonji", "Author URL changed")
    for key in ("@id", "url", "contentUrl"):
        check(post["image"][key] == "https://shikaku.antonbase.com/img/mos-qualification-hero.png", "Image URL changed")
    check(count > 0, "No blog structured data verified")
    print(f"Verified {count} Blog/BlogPosting nodes: canonical, sitemap, target HTML, author and image URLs.")


if __name__ == "__main__":
    verify(Path(__file__).resolve().parents[1] / "build")
