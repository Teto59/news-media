# 進捗チェックリスト

各フェーズの詳細と受入基準は `docs/PLAN.md` を参照。
フェーズ完了時に該当行を `[x]` にし、完了日と一言メモを追記すること。

- [x] Phase 0: 準備 — 2026-07-02 git init 済み・gh auth 確認済み(アカウント: Teto59)・Node v22 / Git インストール済み
- [x] Phase 1: 基盤構築 — 2026-07-02 Astro 7(minimal/TS strict)スキャフォールド・CLAUDE.md書き換え・editorial/4ファイル・content.config.ts(zodスキーマ)・ダミー記事3本・global.css(トークン+@fontsource3種)・Base/Masthead/Footer/ThemeToggle・gen-thumb.mjs(決定論的SVG)・build/dev/ダーク切替を確認済み
- [x] Phase 2: 全ページ実装 — 2026-07-02 トップ(大型カード+3列グリッド+staggered fade-in)/記事ページ(TldrBox→本文→分析→SourceList→CorrectionNote→RelatedArticles)/タグ一覧・タグ別/about(POLICY.md反映)/404/rss.xml/sitemap(@astrojs/sitemap)/OGPメタ+canonical/gen-og.mjs(resvg)/robots.txt/favicon.svg差し替え。draft記事は本番ビルドで一覧・RSS・sitemap・詳細ページから自動的に除外(npm run devでは確認用に表示)。build エラー0・全ページをdevプレビューで目視確認済み(モバイル375px・ライト/ダーク両方)
- [ ] Phase 3: 検索(Pagefind)
- [ ] Phase 4: 編集ワークフロー(/article /publish /retro)+ ドライラン
- [ ] Phase 5: 公開(GitHub → Cloudflare Pages)
- [ ] Phase 6: 運用開始(E2E検証・運用カレンダー)

## メモ

- サイト名は保留中。`src/consts.ts` の定数で仮称運用
- ホスティング: Cloudflare Pages / URL: 無料サブドメイン(`*.pages.dev`)で開始
- `src/consts.ts` の `SITE_URL` はPhase 5でCloudflare Pagesのプロジェクト名確定まで仮URL(`https://newsmedia-placeholder.pages.dev`)。RSS/sitemap/OGPの絶対URL生成に使用しているため、Phase 5で実URLに更新すること
