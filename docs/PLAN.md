# AIニュースメディア構築計画(Sonnet 5 実行用)

## Context

非エンジニアのオーナーが、Claude Sonnet 5 が記事を執筆する無料・高品質ニュースメディアを立ち上げる。

- **動機**: 既存メディアの裏取りの甘さへの不満。AIによる複数ソース裏取りの方が質を上げられるという仮説。ニュース選定と添削はオーナーが行う。
- **絶対条件**: DBなし・サーバーなし・読者情報を一切持たない静的サイト。「全データを引っこ抜かれても問題ない」を構造的に保証する。運用費0円(独自ドメインは後日任意)。
- **核となる仕組み**: オーナーの添削差分から教訓を蓄積するフィードバックループ(`editorial/` ディレクトリ)。回数を重ねるほど初稿の質が上がる設計。
- **実行体制**: この計画は **Claude Sonnet 5 が Claude Code 上で実行する**。1フェーズ=1セッションを厳守し、各フェーズは受入基準と検証手順で完結させる。
- **決定済み事項**: ホスティング=Cloudflare Pages / デザイン=本計画の仕様に忠実に実装(独自判断で変更しない) / URL=無料サブドメイン(`*.pages.dev`)で開始 / サイト名=保留(`src/consts.ts` の定数1箇所で後から変更可能にする)。

## Sonnet 5 への実行指示(全フェーズ共通)

1. **セッション開始時に必ず読む**: `CLAUDE.md` → `docs/PROGRESS.md` → 実施フェーズの本計画該当節(`docs/PLAN.md`)。
2. **スコープはフェーズ内に限定**。次フェーズの先取りをしない。計画にない機能を追加しない。判断に迷う点はオーナーに日本語で平易に質問する(オーナーは非エンジニア。専門用語は毎回一言で補足する)。
3. **本計画の仕様は全ファイル・全ページに適用する**。例: デザイントークンの使用は最初のページだけでなく作成する全コンポーネントに適用。
4. **各フェーズの終了条件**: (a) 受入基準を全て満たす (b) `npm run build` がエラー0で通る (c) `docs/PROGRESS.md` のチェックを更新 (d) git コミット(メッセージは日本語で `phase1: 基盤構築` の形式)。
5. **禁止事項(理由: 静的・無料・情報ゼロ保持の絶対条件を壊すため)**:
   - SSRアダプタ、APIエンドポイント、サーバー側コード、フォーム送信、コメント機能
   - 外部トラッカー・アナリティクス・広告スクリプト・外部CDNからのフォント/JS読み込み(全アセットは自己ホスト)
   - APIキー等の秘密情報をリポジトリに置くこと(そもそも必要になる設計をしない)
   - 計画外のnpm依存追加(必要と判断したらコミット前にオーナーに理由を説明して承認を得る)
6. `docs/PLAN.md`(本ファイル)と `docs/PROGRESS.md` は配置済み。以後のセッションはリポジトリ内だけで完結する。

## アーキテクチャ

- **Astro 5**(静的出力、`output: 'static'` 以外禁止)+ TypeScript strict
- 記事 = `src/content/articles/*.md`(Markdownファイルが唯一のデータ。DBなし)
- 検索 = **Pagefind**(ビルド後に静的インデックス生成。サーバー不要の日本語全文検索)
- ホスティング = **Cloudflare Pages**(GitHubリポジトリ連携で push → 自動ビルド・公開)
- サムネ = 決定論的な生成SVG(`scripts/gen-thumb.mjs`)。OG画像はそれをPNG化(`scripts/gen-og.mjs`)
- 想定npm依存(これで全部): `astro`, `@astrojs/rss`, `@astrojs/sitemap`, `pagefind`, `@resvg/resvg-js`, `@fontsource/shippori-mincho-b1`, `@fontsource/zen-kaku-gothic-new`, `@fontsource/ibm-plex-mono`

## リポジトリ構成(作成対象)

```
X:\NewsMedia\
├─ CLAUDE.md                  # 全セッション共通ルール(Phase 1で作成、内容は本計画に明記)
├─ docs/
│  ├─ PLAN.md                 # 本計画
│  └─ PROGRESS.md             # フェーズ進捗チェックリスト
├─ editorial/                 # ★フィードバックループの心臓部
│  ├─ STYLE_GUIDE.md          # 文体・タイトル・出典ルール(初期内容は本計画に明記)
│  ├─ LESSONS.md              # 添削差分から自動蓄積される教訓
│  ├─ DESIGN_NOTES.md         # デザイン仕様の写し+デザイン変更の教訓
│  └─ POLICY.md               # 公開ページ「編集方針」の原稿
├─ .claude/skills/
│  ├─ article/SKILL.md        # /article 記事執筆ワークフロー
│  ├─ publish/SKILL.md        # /publish 差分学習+公開
│  └─ retro/SKILL.md          # /retro 教訓の整理・昇格
├─ scripts/
│  ├─ gen-thumb.mjs           # slug+タグから決定論的SVGサムネ生成
│  └─ gen-og.mjs              # サムネSVG→OG用PNG(1200x630)
├─ src/
│  ├─ consts.ts               # SITE_NAME='(仮称)', SITE_DESCRIPTION 等。名前確定時ここだけ変更
│  ├─ content.config.ts       # 記事スキーマ(zod)
│  ├─ content/articles/
│  ├─ styles/global.css       # デザイントークン(下記仕様)
│  ├─ layouts/Base.astro
│  ├─ components/             # Masthead, Footer, ArticleCard, TagChips, TldrBox,
│  │                          # SourceList, CorrectionNote, ThemeToggle, RelatedArticles
│  └─ pages/
│     ├─ index.astro          # トップ(カード一覧)
│     ├─ articles/[slug].astro
│     ├─ tags/index.astro, tags/[tag].astro
│     ├─ search.astro         # Pagefind UI
│     ├─ about.astro          # 編集方針(POLICY.mdを反映)
│     ├─ rss.xml.ts
│     └─ 404.astro
└─ public/ (thumbs/, og/, favicon.svg, robots.txt)
```

## 記事データモデル(`src/content.config.ts`、zodで強制)

```ts
{
  title: z.string().max(48),            // 扇動禁止。STYLE_GUIDE準拠
  lead: z.string().min(80).max(180),    // リード文。カードと記事冒頭に表示
  tldr: z.array(z.string()).length(3),  // 3行まとめ。各60字以内
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).min(1).max(4),
  sources: z.array(z.object({           // ★出典。ニュース記事はmin(2)を運用ルールで強制
    name: z.string(),                   // 例: "Anthropic公式発表"
    url: z.string().url(),
    publisher: z.string().optional(),
    accessed: z.coerce.date(),          // 参照日
  })).min(1),
  corrections: z.array(z.object({       // 訂正履歴(公開する)
    date: z.coerce.date(),
    description: z.string(),
  })).default([]),
  draft: z.boolean().default(true),
}
```

ファイル名規約: `YYYY-MM-DD-english-slug.md`(URLは `/articles/YYYY-MM-DD-english-slug/`)。
本文規約: 事実主張には `[1]` 形式で sources の番号を付ける。分析・見立ては「分析」見出しの節に分離。

## デザイン仕様(全ページ・全コンポーネントに適用。独自変更禁止)

**コンセプト**: 「紙の新聞の信頼感 × 現代の静的サイト」。生成り紙×墨×藍×朱の和のパレット。鋭角(radius 2px)、罫線主体、影なしのフラットな紙面。

`src/styles/global.css` に以下のトークンを定義し、**全コンポーネントはトークン経由でのみ色を使う**(hex直書き禁止):

```css
:root {
  --paper:   #F6F1E7;  /* 背景: 生成り紙 */
  --surface: #FDFBF5;  /* カード面 */
  --ink:     #211D16;  /* 本文: 墨 */
  --ink-2:   #6B6353;  /* 補助テキスト */
  --line:    #DDD3BE;  /* 罫線 */
  --ai:      #2A5A8C;  /* 藍: リンク・主アクセント・タグ */
  --shu:     #C2451E;  /* 朱: 訂正・強調・「NEW」 */
  --radius: 2px;
}
[data-theme="dark"] {
  --paper: #191611; --surface: #211D16; --ink: #EBE4D3;
  --ink-2: #A39A85; --line: #3A3428; --ai: #8FB4DC; --shu: #E27452;
}
```

- **タイポグラフィ**(@fontsourceで自己ホスト): 見出し・サイトロゴ = Shippori Mincho B1(700/800)/ 本文・UI = Zen Kaku Gothic New(400/500)/ 日付・出典番号・英数 = IBM Plex Mono。本文 16px・行間1.9・記事本文は max-width 38em。`font-feature-settings: "palt"` を見出しに適用。
- **トップページ**: 上部に Masthead(明朝の大きなロゴタイプ+今日の日付を IBM Plex Mono で+テーマ切替+検索リンク)。最新1本を横長の大型カード、以下3列グリッド(タブレット2列・スマホ1列)のカード。カード構成 = サムネSVG(16:9)→タグチップ→タイトル(明朝)→リード2行(`-webkit-line-clamp: 2`)→日付。
- **記事ページ**: タイトル(明朝 clamp(1.6rem,4vw,2.4rem))→メタ行(日付・タグ・読了目安=本文字数÷500字/分)→ TldrBox(「3行まとめ」見出し、`border-left: 3px solid var(--ai)`)→本文→「分析」節(ある場合)→ SourceList(番号付き出典リスト。publisher と参照日を表示)→ CorrectionNote(corrections がある場合のみ、`var(--shu)` の罫線で目立たせる)→ RelatedArticles(同一タグの最新3本)。
- **モーション**: ページロード時にカードを `animation-delay` で 40ms ずつ順に fade-in + 8px 上昇(CSSのみ)。カード hover は `border-color: var(--ai)` + `translateY(-2px)`、`transition: all 160ms ease-out`。`prefers-reduced-motion` を尊重。
- **ダークモード**: `prefers-color-scheme` 初期値 + ThemeToggle(選択を localStorage に保存。個人情報ではないのでOK)。FOUC防止のため `<head>` 内インラインスクリプトで `data-theme` を先に設定。
- **サムネSVG**(gen-thumb.mjs): slug の文字列ハッシュを乱数シードにした決定論的生成(同じ記事は常に同じ絵)。構成 = `--paper` 系地色 + 第一タグで決まる主色(藍/朱/深緑 #3F6B4F/黄土 #A67C2E の4系統をタグ名ハッシュで割当)+ 幾何学構成(斜めの帯・同心円弧・点群のうちシードで2種を層状に重ねる)。文字は入れない。ダーク対応不要(画像として固定)。
- 以下のディレクティブを CLAUDE.md に収録し、**「パレット・フォント・radius は本仕様で固定。その制約内で」**モーションや余白の質を追求する:

```
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>

制約: 上記はこのプロジェクトのデザイントークン(editorial/DESIGN_NOTES.md)の範囲内で適用する。
フォント・配色・radiusの変更は不可。創意はモーション・余白・タイポグラフィの細部に注ぐこと。
```

## CLAUDE.md(Phase 1 で作成する内容)

以下を含める(全文日本語):
1. プロジェクト概要1段落と「静的サイト・DBなし・読者情報ゼロ」の絶対条件
2. 上記「禁止事項」5項目をそのまま
3. **記事に関わる作業の前に `editorial/` の全ファイルを読むこと(必須)**
4. 出典ルール: 出典を確認できない事実主張は書かない。独立した情報源2つ以上(同一発表の転載は1つと数える)。一次ソース(公式発表・決算資料・論文・当事者発言)最優先
5. 著作権ルール: 事実は自由だが特定記事の表現・構成の引き写しは禁止。有料記事1本だけを情報源にした記事は作らない
6. コード変更後は `npm run build` でエラー0を確認してからコミット
7. 色・フォントはトークン経由のみ。デザイン変更は `editorial/DESIGN_NOTES.md` に理由を追記してから
8. frontend_aesthetics ブロック(上記の制約注記付き)
9. よく使うコマンド一覧(`npm run dev` / `npm run build` / `/article` / `/publish` / `/retro`)

## STYLE_GUIDE.md 初期内容(Phase 1 で作成)

- 第1条: **出典のない事実主張は書かない**(このメディアの存在理由)
- 文体: です・ます調。一文60字以内目安。カタカナ語の乱用を避け、初出の専門用語は一言で説明
- タイトル: 48字以内。「〜か?」等の煽り疑問形・「衝撃」「ヤバい」等の扇動語・釣り見出し禁止。記事を読んだ後に「タイトル通りだった」と思える正確さを最優先
- 事実と意見の分離: 本文は事実のみ。見立て・解釈は「分析」節に分離し「〜とみられる」等の推量表現を使う
- 数字: 必ず出典付き。一次ソースの数字を優先し、報道間で数字が食い違う場合は両論併記
- 訂正: 誤りに気づいたら本文を直した上で corrections に「いつ・何を・なぜ」を追記(隠さない)
- ※このガイドは /retro により LESSONS.md から昇格したルールで成長していく

## フィードバックループ(スキル3本の仕様。Phase 4 で作成)

### /article(`.claude/skills/article/SKILL.md`)— 引数: ニュースURLまたはテーマ
1. `editorial/STYLE_GUIDE.md`・`editorial/LESSONS.md` 全文と直近記事3本を読む
2. WebSearch/WebFetch で独立ソース3件以上を調査。一次ソース最優先。paywall で本文を確認できないものは出典にしない
3. スキーマ完全準拠の記事を `draft: true` で執筆(出典番号 `[1]`、分析節分離、STYLE_GUIDE遵守)
4. `node scripts/gen-thumb.mjs <slug>` でサムネ生成 → `npm run build` 通過確認
5. **`draft: <slug>` として即コミット**(←このコミットが「初稿」。/publish の差分学習の基準点になる)
6. オーナーにプレビュー方法と、レビュー観点(タイトルは正確か/リードは読みたくなるか/事実誤認はないか)を提示して終了

### /publish(`.claude/skills/publish/SKILL.md`)— 引数: slug
1. `git log --oneline -- <記事ファイル>` で `draft:` コミットを特定し、`git diff <draftコミット> -- <記事ファイル>`(+未コミット変更)で**初稿とオーナー最終稿の差分**を取得
2. 差分から教訓を抽出し `editorial/LESSONS.md` に追記。形式: `- [YYYY-MM-DD][分類: タイトル/文体/構成/事実確認/その他] 一般化した教訓1行(具体例: 「X」→「Y」)`。**差分ゼロの場合も「今回の初稿で通用した点」を1行記録**(成功パターンの強化)
3. `draft: false` にし pubDate を確定 → `node scripts/gen-og.mjs <slug>` → `npm run build`
4. `publish: <slug>` でコミットして push(→ Cloudflare Pages が自動公開)。数分後に本番URLで表示確認して報告

### /retro(`.claude/skills/retro/SKILL.md`)— 月1回目安、オーナーが起動
- LESSONS.md を読み、3回以上繰り返されている教訓を STYLE_GUIDE.md の正式ルールに昇格(昇格済みは LESSONS から削除)。矛盾する教訓はオーナーに質問して解消。DESIGN_NOTES.md も同様に整理

## フェーズ計画(1フェーズ=1セッション)

### Phase 0: 準備(オーナー作業。Sonnet はガイド役)
- `git init` + GitHubアカウント確認(なければ github.com で作成を案内)+ `gh auth login`
- Cloudflare アカウントは Phase 5 まで不要(先送り可)
- **受入基準**: `git init` 済み、`gh auth status` が成功

### Phase 1: 基盤構築
- `npm create astro@latest`(最小テンプレ・TypeScript strict)→ 上記リポジトリ構成の骨格を作成
- `docs/PROGRESS.md` 更新 / `CLAUDE.md` / `editorial/` 4ファイル(上記仕様の初期内容)
- `content.config.ts`(スキーマ)+ ダミー記事3本(サンプルと明記。タグ・出典・tldr・corrections を含む多様なパターンで)
- `global.css`(トークン+フォント)+ `Base.astro` + `Masthead` + `Footer` + `ThemeToggle` + `scripts/gen-thumb.mjs`
- **受入基準**: `npm run build` エラー0 / `npm run dev` でトップにダミー記事カード3枚が仕様通りの配色・フォントで表示 / ダーク切替動作 / サムネSVGが slug ごとに異なる絵で生成される

### Phase 2: 全ページ実装
- トップ(大型カード+グリッド+staggered fade-in)/ 記事ページ(TldrBox→本文→分析→SourceList→CorrectionNote→RelatedArticles)/ タグ一覧・タグ別 / about(POLICY.md 反映: AI執筆の明示・出典方針・訂正方針・「広告なし・トラッカーなし・読者データ不収集」宣言)/ 404
- RSS(`@astrojs/rss`、全文でなく lead まで)/ sitemap / OGPメタ(og:image は `public/og/<slug>.png`)/ `scripts/gen-og.mjs`(resvg で 1200x630 PNG化)/ robots.txt / favicon.svg(明朝の一文字ロゴ等、トークン準拠)
- **受入基準**: build エラー0 / 全ページをプレビューで目視確認(モバイル幅375pxでも崩れない)/ ダミー記事の corrections・sources・関連記事が仕様通り表示 / `/rss.xml` が有効なXML

### Phase 3: 検索
- `pagefind` を postbuild(`package.json` の scripts)で実行し `dist/` にインデックス生成。`search.astro` に Pagefind UI を組み込み、トークンでスタイル調整
- **受入基準**: `npm run build && npx serve dist` で検索ページから日本語キーワードでダミー記事がヒットする

### Phase 4: 編集ワークフロー(スキル3本)+ ドライラン
- 上記仕様どおり `.claude/skills/` に3スキル作成
- **ドライラン**: 実在の直近ニュースで `/article` を実行 → オーナーが実際に添削 → `/publish`(push はまだしない)まで通し、LESSONS.md に教訓が追記されることを確認
- **受入基準**: ドライラン1周完了 / LESSONS.md に差分由来の教訓が正しい形式で追記されている / 記事がスキーマ検証を通過

### Phase 5: 公開
- GitHub にプライベート→パブリックどちらでも可(オーナーに選ばせる。記事は全公開なのでパブリック推奨)でリポジトリ作成・push
- Cloudflare アカウント作成 → Pages で GitHub リポジトリ連携(Framework: Astro / Build: `npm run build` / Output: `dist`)。ダッシュボード操作はオーナーが行うため、Sonnet は**スクリーンショット単位の手順書を日本語で提示**しながら伴走
- 任意: Cloudflare Web Analytics(Cookie不使用・訪問者を追跡しない集計)を有効にするかオーナーに確認。断られたら入れない
- **受入基準**: `https://<プロジェクト名>.pages.dev` で全ページ表示 / push → 数分で自動反映されることを1回実証

### Phase 6: 運用開始(E2E検証)
- 本物のニュース1本を `/article` → 添削 → `/publish` で本番公開する通し運用
- **受入基準(最終検証)**: (1) 本番URLに記事が出る (2) LESSONS.md に教訓追記 (3) 検索でヒット (4) RSS に掲載 (5) SNSシェアでOG画像が出る(確認ツールでよい) (6) スマホ実機で読める
- 運用カレンダー提示: /retro は月1、依存更新(`npm update`)は四半期に1回で十分、と CLAUDE.md に記録

## 検証方法(全体)

- 各フェーズ: `npm run build` エラー0 + 受入基準の目視確認(プレビューは `npm run dev`、検索だけは `dist` 配信で確認)
- 最終: Phase 6 の6点チェック。加えて「リポジトリ内に秘密情報が1つもない」ことを公開前に `git grep -iE "(api[_-]?key|secret|token|password)"` で確認
- フィードバックループの健全性: 記事5本公開時点で LESSONS.md を人間(オーナー)がレビューし、教訓が具体的すぎず一般化されているか確認(/retro の初回を兼ねる)

## 備考

- サイト名確定時: `src/consts.ts` の `SITE_NAME`・`SITE_DESCRIPTION` を変更し、favicon とロゴタイプを更新するだけ。独自ドメイン移行時は Cloudflare Pages のカスタムドメイン設定(記事URLパスは不変)
- 想定費用: 0円(独自ドメイン取得時のみ年1,500円前後)
- このリポジトリに置いてよい情報は「全世界に公開してよい情報」のみ。これが本プロジェクトの安全性の根拠であり、例外を作らないこと
