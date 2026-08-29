#!/usr/bin/env python3
"""Prepare static/cnt/ for publishing as an unlisted section.

Two passes over the tree:
  1. Inject a noindex meta tag into every .html file that lacks one.
  2. Write an index.html into every directory that has none, since GitHub
     Pages serves no automatic directory listings and would return a 404.

Both passes are idempotent: rerun after each sync from the Pi.
"""
import html
import os
import sys

NOINDEX = '<meta name="robots" content="noindex, nofollow">'

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{noindex}
<title>{title}</title>
<style>
  :root {{ --fg: #1a1a1a; --bg: #fff; --dim: #666; --line: #e8e8e8; --link: #0645ad; }}
  @media (prefers-color-scheme: dark) {{
    :root {{ --fg: #e8e8e8; --bg: #1c1c1c; --dim: #999; --line: #333; --link: #7aa6e0; }}
  }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          max-width: 46rem; margin: 3rem auto; padding: 0 1.5rem; line-height: 1.6;
          color: var(--fg); background: var(--bg); }}
  h1 {{ font-size: 1.15rem; font-weight: 600; margin: 0 0 .2rem; }}
  .crumb {{ color: var(--dim); font-size: .85rem; margin-bottom: 1.5rem; }}
  ul {{ list-style: none; padding: 0; margin: 0; }}
  li {{ padding: .3rem 0; border-bottom: 1px solid var(--line); }}
  a {{ color: var(--link); text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  small {{ color: var(--dim); }}
</style>
</head>
<body>
<h1>{title}</h1>
<div class="crumb">{crumb}</div>
<ul>
{rows}
</ul>
</body>
</html>
"""


def crumbs(rel):
    parts = [p for p in rel.split(os.sep) if p and p != "."]
    out = ['<a href="{}">cnt</a>'.format("../" * len(parts) or "./")]
    for i, part in enumerate(parts):
        up = "../" * (len(parts) - i - 1)
        out.append('<a href="{}">{}</a>'.format(up or "./", html.escape(part)))
    return " / ".join(out)


def add_noindex(root):
    touched = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for name in filenames:
            if not name.endswith(".html"):
                continue
            path = os.path.join(dirpath, name)
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            if "noindex" in text:
                continue
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(NOINDEX + "\n" + text)
            touched += 1
    print("noindex: tagged {} file(s)".format(touched))


def make_indexes(root):
    made = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
        filenames = sorted(f for f in filenames if not f.startswith("."))
        if "index.html" in filenames:
            continue
        rel = os.path.relpath(dirpath, root)
        rows = []
        if rel != ".":
            rows.append('<li><a href="../">../</a></li>')
        for d in dirnames:
            e = html.escape(d)
            rows.append('<li><a href="{}/">{}/</a></li>'.format(e, e))
        for f in filenames:
            e = html.escape(f)
            size = os.path.getsize(os.path.join(dirpath, f))
            rows.append('<li><a href="{}">{}</a> <small>({:,} bytes)</small></li>'.format(e, e, size))
        title = "/cnt/" if rel == "." else "/cnt/" + rel.replace(os.sep, "/") + "/"
        with open(os.path.join(dirpath, "index.html"), "w", encoding="utf-8") as fh:
            fh.write(PAGE.format(
                noindex=NOINDEX,
                title=html.escape(title),
                crumb=crumbs(rel),
                rows="\n".join(rows) or "<li><em>empty</em></li>",
            ))
        made += 1
        print("  listing: {} ({} entries)".format(title, len(rows)))
    print("listings: generated {} index file(s)".format(made))


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "static/cnt"
    if not os.path.isdir(target):
        sys.exit("no such directory: " + target)
    add_noindex(target)
    make_indexes(target)
