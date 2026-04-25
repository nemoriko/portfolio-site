# AI Agent Portfolio

匿名公開のポートフォリオサイト。応募ルートからのみ閲覧される前提で構築。

- 公開URL: `https://nemoriko.github.io/portfolio-site/`
- 検索エンジン: `noindex` + `robots.txt Disallow: /` でインデックス除外
- 連絡先・氏名・顔写真: 非掲載

## 構成

- `index.html` — 単一ページ（Hero / About / Projects / Skills / Timeline / Closing）
- `assets/css/style.css` — vanilla CSS（Inter + Noto Sans JP・濃淡ブルー基調）
- `assets/js/scroll.js` — IntersectionObserver による reveal アニメーション
- `assets/mocks/*.svg` — 各実績のホットモック SVG（インライン UI 風）
- `assets/img/` — Hero 背景・About 補足・OGP（オプション・なくても CSS フォールバック）
- `assets/video/hero.mp4` — Hero 背景動画（オプション）
- `robots.txt` / `.nojekyll` — Pages 公開制御

## ローカル確認

```bash
python -m http.server 8090
```

→ `http://localhost:8090/`

## スクショ撮影

```bash
python take_screenshots_v2.py
```

`screenshots_v2/` に保存（Playwright Chromium / 1440x900 / DPR 2）。
