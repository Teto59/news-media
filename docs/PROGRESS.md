# 進捗チェックリスト

各フェーズの詳細と受入基準は `docs/PLAN.md` を参照。
フェーズ完了時に該当行を `[x]` にし、完了日と一言メモを追記すること。

- [x] Phase 0: 準備 — 2026-07-02 git init 済み・gh auth 確認済み(アカウント: Teto59)・Node v22 / Git インストール済み
- [x] Phase 1: 基盤構築 — 2026-07-02 Astro 7(minimal/TS strict)スキャフォールド・CLAUDE.md書き換え・editorial/4ファイル・content.config.ts(zodスキーマ)・ダミー記事3本・global.css(トークン+@fontsource3種)・Base/Masthead/Footer/ThemeToggle・gen-thumb.mjs(決定論的SVG)・build/dev/ダーク切替を確認済み
- [x] Phase 2: 全ページ実装 — 2026-07-02 トップ(大型カード+3列グリッド+staggered fade-in)/記事ページ(TldrBox→本文→分析→SourceList→CorrectionNote→RelatedArticles)/タグ一覧・タグ別/about(POLICY.md反映)/404/rss.xml/sitemap(@astrojs/sitemap)/OGPメタ+canonical/gen-og.mjs(resvg)/robots.txt/favicon.svg差し替え。draft記事は本番ビルドで一覧・RSS・sitemap・詳細ページから自動的に除外(npm run devでは確認用に表示)。build エラー0・全ページをdevプレビューで目視確認済み(モバイル375px・ライト/ダーク両方)
- [x] Phase 3: 検索(Pagefind) — 2026-07-02 pagefindをdependenciesに追加し`postbuild`で`dist`にインデックス生成/`search.astro`にPagefind Default UIを組み込みトークン(藍・墨・生成り紙・罫線・radius・ゴシック)でスタイル調整、検索結果の強調(`mark`)も朱で上書き/記事ページに`data-pagefind-body`+`data-pagefind-meta="title"`を付与し記事本文のみを索引対象に/ダミー記事を一時的に`draft: false`にしてbuild→`npx serve dist`で「核融合」等の日本語キーワードが3記事にヒットすることをライト・ダーク・モバイル幅で確認後、`draft: true`に戻して最終build エラー0を確認(draft記事のみの現状はdata-pagefind-body不検出→全body索引にフォールバックする旨をログで確認済み。Phase4/6で記事が公開されれば自動的に本来の索引範囲に切り替わる)
- [x] Phase 4: 編集ワークフロー(/article /publish /retro)+ ドライラン — 2026-07-02 `.claude/skills/{article,publish,retro}/SKILL.md` を仕様通り作成。ドライラン: 実在ニュース(日銀短観2026年6月調査)で`/article`相当の手順を実行し独立ソース2件(日銀公式PDF+NHK報道)で裏取りして`draft: 2026-07-02-boj-tankan-2026-june`をコミット→オーナー添削を模して一文60字超過を分割修正→`/publish`相当の手順で差分から教訓2件をLESSONS.mdに追記(文体・事実確認の2分類)→`draft: false`化・OG画像生成・build成功を確認して`publish: 2026-07-02-boj-tankan-2026-june`をコミット(push未実施、Cloudflare未接続のためPhase5で実施)。記事はスキーマ検証を通過
- [ ] Phase 5: 公開(GitHub → Cloudflare Pages)
- [ ] Phase 6: 運用開始(E2E検証・運用カレンダー)

## メモ

- サイト名は保留中。`src/consts.ts` の定数で仮称運用
- ホスティング: Cloudflare Pages / URL: 無料サブドメイン(`*.pages.dev`)で開始
- `src/consts.ts` の `SITE_URL` はPhase 5でCloudflare Pagesのプロジェクト名確定まで仮URL(`https://newsmedia-placeholder.pages.dev`)。RSS/sitemap/OGPの絶対URL生成に使用しているため、Phase 5で実URLに更新すること
