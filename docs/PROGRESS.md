# 進捗チェックリスト

各フェーズの詳細と受入基準は `docs/PLAN.md` を参照。
フェーズ完了時に該当行を `[x]` にし、完了日と一言メモを追記すること。

- [x] Phase 0: 準備 — 2026-07-02 git init 済み・gh auth 確認済み(アカウント: Teto59)・Node v22 / Git インストール済み
- [x] Phase 1: 基盤構築 — 2026-07-02 Astro 7(minimal/TS strict)スキャフォールド・CLAUDE.md書き換え・editorial/4ファイル・content.config.ts(zodスキーマ)・ダミー記事3本・global.css(トークン+@fontsource3種)・Base/Masthead/Footer/ThemeToggle・gen-thumb.mjs(決定論的SVG)・build/dev/ダーク切替を確認済み
- [x] Phase 2: 全ページ実装 — 2026-07-02 トップ(大型カード+3列グリッド+staggered fade-in)/記事ページ(TldrBox→本文→分析→SourceList→CorrectionNote→RelatedArticles)/タグ一覧・タグ別/about(POLICY.md反映)/404/rss.xml/sitemap(@astrojs/sitemap)/OGPメタ+canonical/gen-og.mjs(resvg)/robots.txt/favicon.svg差し替え。draft記事は本番ビルドで一覧・RSS・sitemap・詳細ページから自動的に除外(npm run devでは確認用に表示)。build エラー0・全ページをdevプレビューで目視確認済み(モバイル375px・ライト/ダーク両方)
- [x] Phase 3: 検索(Pagefind) — 2026-07-02 pagefindをdependenciesに追加し`postbuild`で`dist`にインデックス生成/`search.astro`にPagefind Default UIを組み込みトークン(藍・墨・生成り紙・罫線・radius・ゴシック)でスタイル調整、検索結果の強調(`mark`)も朱で上書き/記事ページに`data-pagefind-body`+`data-pagefind-meta="title"`を付与し記事本文のみを索引対象に/ダミー記事を一時的に`draft: false`にしてbuild→`npx serve dist`で「核融合」等の日本語キーワードが3記事にヒットすることをライト・ダーク・モバイル幅で確認後、`draft: true`に戻して最終build エラー0を確認(draft記事のみの現状はdata-pagefind-body不検出→全body索引にフォールバックする旨をログで確認済み。Phase4/6で記事が公開されれば自動的に本来の索引範囲に切り替わる)
- [x] Phase 4: 編集ワークフロー(/article /publish /retro)+ ドライラン — 2026-07-02 `.claude/skills/{article,publish,retro}/SKILL.md` を仕様通り作成。ドライラン: 実在ニュース(日銀短観2026年6月調査)で`/article`相当の手順を実行し独立ソース2件(日銀公式PDF+NHK報道)で裏取りして`draft: 2026-07-02-boj-tankan-2026-june`をコミット→オーナー添削を模して一文60字超過を分割修正→`/publish`相当の手順で差分から教訓2件をLESSONS.mdに追記(文体・事実確認の2分類)→`draft: false`化・OG画像生成・build成功を確認して`publish: 2026-07-02-boj-tankan-2026-june`をコミット(push未実施、Cloudflare未接続のためPhase5で実施)。記事はスキーマ検証を通過
- [x] Phase 5: 公開(GitHub → Cloudflare Pages) — 2026-07-02 GitHubにパブリックリポジトリ`Teto59/news-media`を作成しpush(公開前にAPIキー等の秘密情報が無いことを`git grep`で確認済み)。Cloudflare Pagesでプロジェクト`news-media`を作成しGit連携(Framework: Astro / Build: `npm run build` / Output: `dist`)、初回デプロイ成功。本番URL`https://news-media-8c6.pages.dev`確定に伴い`src/consts.ts`の`SITE_URL`を更新してpush→数分後にCloudflareダッシュボードで新デプロイのSuccessを確認、RSS内のドメインが新URLに切り替わったことも確認(自動反映を実証)。トップ・about・記事ページ(sources・タイトル含む)の表示をリモートで確認。Cloudflare Web Analyticsはオーナーに確認の上「入れない」で確定(未設定のまま)
- [x] Phase 6: 運用開始(E2E検証・運用カレンダー) — 2026-07-02 実在ニュース(日銀短観2026年6月調査、Phase4/5で /article→添削→/publish→本番pushまで完了済み)の本番公開を最終E2E検証。(1) 本番URL `https://news-media-8c6.pages.dev/articles/2026-07-02-boj-tankan-2026-june/` が200で記事表示を確認 (2) LESSONS.mdに文体・事実確認の教訓2件が形式通り記録済みを確認 (3) `npm run build`(pagefind postbuild含む)→`serve dist`で検索ページから「短観」で1件ヒットを確認 (4) 本番`/rss.xml`に記事のtitle/link/descriptionが掲載されていることを確認 (5) 記事ページの`og:image`が本番の`/og/2026-07-02-boj-tankan-2026-june.png`(200, image/png)を指し、画像がトークン準拠の配色で正しく生成されていることを目視確認(SNSシェア確認ツールの代替として直接検証) (6) モバイル幅375pxでTldrBox・本文・SourceListまで崩れなく表示されることを確認(実機ではなくビューポートエミュレーションでの代替確認である旨を付記)。公開前の秘密情報チェック(`git grep`)も再実施し該当なし。運用カレンダー(/retro月1回・依存更新四半期に1回)はCLAUDE.mdに記載済みであることを確認(Phase1時点で追加済み)。build エラー0

## メモ

- サイト名は「Chronica」に確定(2026-07-02)。`src/consts.ts` の `SITE_NAME` に反映済み
- ホスティング: Cloudflare Pages / URL: 無料サブドメイン(`*.pages.dev`)で開始
- `src/consts.ts` の `SITE_URL` はPhase 5でCloudflare Pagesのプロジェクト名確定まで仮URL(`https://newsmedia-placeholder.pages.dev`)。RSS/sitemap/OGPの絶対URL生成に使用しているため、Phase 5で実URLに更新すること
