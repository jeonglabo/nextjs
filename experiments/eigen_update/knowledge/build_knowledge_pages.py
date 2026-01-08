"""
URL リストからページ本文を取得し、1ページ1レコードで保存する。
チャンク分割は行わず、後段で実施する前提。
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.request
import ssl
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from typing import List


@dataclass(frozen=True)
class KnowledgePage:
    id: str
    url: str
    title: str
    text: str
    sourceIndex: int


class TextExtractor(HTMLParser):
    """HTML から本文らしいテキストだけを抽出する簡易パーサー。"""

    def __init__(self, prefer_main_article: bool = True) -> None:
        super().__init__()
        self._texts: List[str] = []
        self._skip_depth = 0
        self._content_depth = 0
        self._prefer_main_article = prefer_main_article

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "noscript", "nav", "header", "footer", "aside"):
            self._skip_depth += 1
            return
        if tag in ("main", "article"):
            self._content_depth += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "nav", "header", "footer", "aside"):
            if self._skip_depth > 0:
                self._skip_depth -= 1
            return
        if tag in ("main", "article"):
            if self._content_depth > 0:
                self._content_depth -= 1

    def handle_data(self, data):
        if self._skip_depth > 0:
            return
        if self._prefer_main_article and self._content_depth == 0:
            return
        text = data.strip()
        if text:
            self._texts.append(text)

    def get_text(self) -> str:
        return " ".join(self._texts)

    def get_lines(self) -> List[str]:
        return self._texts


def build_ssl_context() -> ssl.SSLContext:
    """証明書検証用の SSL コンテキストを作成する。"""
    allow_insecure = os.getenv("ALLOW_INSECURE_SSL", "0") == "1"
    if allow_insecure:
        return ssl._create_unverified_context()
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()


def read_urls(path: str) -> List[str]:
    urls: List[str] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            urls.append(stripped)
    return urls


def fetch_html(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (EigenUpdateBot/0.1)",
        },
    )
    context = build_ssl_context()
    with urllib.request.urlopen(req, timeout=20, context=context) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="ignore")


def extract_title(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return "Untitled"
    return re.sub(r"\s+", " ", match.group(1)).strip()


def cleanup_noise(text: str) -> str:
    noise_patterns = [
        r"Toggle navigation",
        r"サイト内検索",
        r"検索",
        r"RSS",
        r"amazon",
        r"プライバシー",
        r"利用規約",
        r"カテゴリ",
        r"トップ",
        r"目次",
        r"印刷",
        r"ログイン",
        r"新着記事",
        r"関連記事",
        r"タグ",
        r"シェア",
    ]
    cleaned = text
    for pattern in noise_patterns:
        cleaned = re.sub(pattern, " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bundefined\b", " ", cleaned, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", cleaned).strip()


def filter_lines(lines: List[str]) -> List[str]:
    filtered: List[str] = []
    for line in lines:
        compact = re.sub(r"\s+", " ", line).strip()
        if not compact:
            continue
        if re.search(r"\bundefined\b", compact, flags=re.IGNORECASE):
            continue
        if re.search(r"(目次|カテゴリ|検索|RSS|amazon|プライバシー|利用規約|トップ|印刷|ログイン|新着記事|関連記事|タグ|シェア)", compact):
            continue
        if re.search(r"[|›»>]", compact) and len(compact) < 80:
            continue
        if len(compact) < 15 and not re.search(r"[。．.!?！？]", compact):
            continue
        filtered.append(compact)
    return filtered


def extract_text(html: str) -> str:
    parser = TextExtractor(prefer_main_article=True)
    parser.feed(html)
    lines = parser.get_lines()
    if len(" ".join(lines)) < 200:
        fallback = TextExtractor(prefer_main_article=False)
        fallback.feed(html)
        lines = fallback.get_lines()
    cleaned_lines = filter_lines(lines)
    raw = " ".join(cleaned_lines)
    return cleanup_noise(raw)


def build_pages(urls: List[str], output_path: str) -> None:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pages: List[KnowledgePage] = []

    for idx, url in enumerate(urls):
        try:
            html = fetch_html(url)
        except Exception as e:
            print(f"⚠️ 取得失敗: {url} ({e})")
            continue
        title = extract_title(html)
        text = extract_text(html)
        pages.append(
            KnowledgePage(
                id=f"src{idx}",
                url=url,
                title=title,
                text=text,
                sourceIndex=idx,
            )
        )
        time.sleep(1)

    with open(output_path, "w", encoding="utf-8") as f:
        for page in pages:
            f.write(json.dumps(asdict(page), ensure_ascii=False) + "\n")


def main() -> None:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    urls_path = os.path.join(base_dir, "urls.txt")
    output_path = os.path.join(base_dir, "db", "knowledge_pages.jsonl")

    urls = read_urls(urls_path)
    if not urls:
        raise ValueError("urls.txt に URL がありません。")

    build_pages(urls, output_path)

    meta = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceCount": len(urls),
        "pageCount": sum(1 for _ in open(output_path, "r", encoding="utf-8")),
        "note": "Eigen update knowledge pages (raw per page)",
    }
    with open(os.path.join(base_dir, "db", "pages_index.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"✅ knowledge pages を作成しました: {output_path}")


if __name__ == "__main__":
    main()
