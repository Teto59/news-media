# DESIGN_NOTES.md — デザイン仕様の写し + デザイン変更の教訓

`docs/PLAN.md` に記載のデザイン仕様の写し。デザインを変更する場合は理由をこのファイルに追記してから行う(`CLAUDE.md` 参照)。パレット・フォント・radius は固定であり、独自判断で変更しない。

## コンセプト

「紙の新聞の信頼感 × 現代の静的サイト」。生成り紙×墨×藍×朱の和のパレット。鋭角(radius 2px)、罫線主体、影なしのフラットな紙面。

## デザイントークン(`src/styles/global.css`)

全コンポーネントはトークン経由でのみ色を使う(hex直書き禁止)。

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

## タイポグラフィ

自己ホスト(@fontsource)。

- 見出し・サイトロゴ = Shippori Mincho B1(700/800)
- 本文・UI = Zen Kaku Gothic New(400/500)
- 日付・出典番号・英数 = IBM Plex Mono
- 本文16px・行間1.9・記事本文は `max-width: 38em`
- `font-feature-settings: "palt"` を見出しに適用

## トップページ

上部に Masthead(明朝の大きなロゴタイプ+今日の日付をIBM Plex Monoで+テーマ切替+検索リンク)。最新1本を横長の大型カード、以下3列グリッド(タブレット2列・スマホ1列)のカード。カード構成 = サムネSVG(16:9)→タグチップ→タイトル(明朝)→リード2行(`-webkit-line-clamp: 2`)→日付。

Phase 2で最新1本の大型カード(サムネ+本文を横並び)+3列グリッド(タブレット2列・スマホ1列)+staggered fade-inを実装済み。

## 記事ページ

タイトル(明朝 `clamp(1.6rem,4vw,2.4rem)`)→メタ行(日付・タグ・読了目安=本文字数÷500字/分)→ TldrBox(「3行まとめ」見出し、`border-left: 3px solid var(--ai)`)→本文→「分析」節(ある場合)→ SourceList(番号付き出典リスト。publisherと参照日を表示)→ CorrectionNote(correctionsがある場合のみ、`var(--shu)` の罫線で目立たせる)→ RelatedArticles(同一タグの最新3本)。

## モーション

ページロード時にカードを `animation-delay` で40msずつ順にfade-in + 8px上昇(CSSのみ)。カードhoverは `border-color: var(--ai)` + `translateY(-2px)`、`transition: all 160ms ease-out`。`prefers-reduced-motion` を尊重する。

## ダークモード

`prefers-color-scheme` 初期値 + ThemeToggle(選択をlocalStorageに保存。個人情報ではないのでOK)。FOUC防止のため `<head>` 内インラインスクリプトで `data-theme` を先に設定する。

## サムネSVG(`scripts/gen-thumb.mjs`)

slugの文字列ハッシュを乱数シードにした決定論的生成(同じ記事は常に同じ絵)。構成 = `--paper` 系地色 + 第一タグで決まる主色(藍/朱/深緑 #3F6B4F/黄土 #A67C2E の4系統をタグ名ハッシュで割当)+ 幾何学構成(斜めの帯・同心円弧・点群のうちシードで2種を層状に重ねる)。文字は入れない。ダーク対応不要(画像として固定)。

## OG画像(`scripts/gen-og.mjs`)

記事のサムネSVG(16:9・800x450)を、OGP標準比率(1200x630)にcoverフィット(拡大して中央クロップ)させてPNG化する。サムネと同様に文字は入れない。

## デザイン変更履歴

- Phase 2: favicon.svg をAstroデフォルトのロケットロゴから、トークン準拠のデザインに変更。サイト名が「(仮称)」で未確定のため、暫定的に明朝体1文字「報」(ink/paper トークン・ダーク対応)を仮のロゴマークとして採用。サイト名確定時に `src/consts.ts` の更新と合わせて差し替えること。
