# 進捗チェックリスト

各フェーズの詳細と受入基準は `docs/PLAN.md` を参照。
フェーズ完了時に該当行を `[x]` にし、完了日と一言メモを追記すること。

- [x] Phase 0: 準備 — 2026-07-02 git init 済み・gh auth 確認済み(アカウント: Teto59)・Node v22 / Git インストール済み
- [x] Phase 1: 基盤構築 — 2026-07-02 Astro 7(minimal/TS strict)スキャフォールド・CLAUDE.md書き換え・editorial/4ファイル・content.config.ts(zodスキーマ)・ダミー記事3本・global.css(トークン+@fontsource3種)・Base/Masthead/Footer/ThemeToggle・gen-thumb.mjs(決定論的SVG)・build/dev/ダーク切替を確認済み
- [ ] Phase 2: 全ページ実装(トップ・記事・タグ・about・RSS・sitemap・OGP)
- [ ] Phase 3: 検索(Pagefind)
- [ ] Phase 4: 編集ワークフロー(/article /publish /retro)+ ドライラン
- [ ] Phase 5: 公開(GitHub → Cloudflare Pages)
- [ ] Phase 6: 運用開始(E2E検証・運用カレンダー)

## メモ

- サイト名は保留中。`src/consts.ts` の定数で仮称運用
- ホスティング: Cloudflare Pages / URL: 無料サブドメイン(`*.pages.dev`)で開始
