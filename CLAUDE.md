# CLAUDE.md

このリポジトリで作業する Claude Code (Sonnet 5) 向けの共通ルール。全セッション・全フェーズに適用する。

## プロジェクト概要

非エンジニアのオーナーが、Claude Sonnet 5 が記事を執筆する無料・高品質ニュースメディアを立ち上げるプロジェクト。既存メディアの裏取りの甘さへの不満が動機であり、AIによる複数ソース裏取りで質を上げる。ニュース選定と最終添削はオーナーが行う。

**絶対条件**: DBなし・サーバーなし・読者情報を一切持たない静的サイト。「全データを引っこ抜かれても問題ない」を構造的に保証する。運用費0円(独自ドメインは後日任意)。このリポジトリに置いてよい情報は「全世界に公開してよい情報」のみ。例外を作らないこと。

実行計画・フェーズの詳細は `docs/PLAN.md`、進捗は `docs/PROGRESS.md` を参照。セッション開始時は必ず `CLAUDE.md` → `docs/PROGRESS.md` → 該当フェーズの `docs/PLAN.md` の順で読むこと。スコープはフェーズ内に限定し、次フェーズの先取りや計画にない機能追加はしない。判断に迷う点はオーナーに日本語で平易に質問する(オーナーは非エンジニア。専門用語は毎回一言で補足する)。

## 禁止事項(理由: 静的・無料・情報ゼロ保持の絶対条件を壊すため)

1. SSRアダプタ、APIエンドポイント、サーバー側コード、フォーム送信、コメント機能
2. 外部トラッカー・アナリティクス・広告スクリプト・外部CDNからのフォント/JS読み込み(全アセットは自己ホスト)
3. APIキー等の秘密情報をリポジトリに置くこと(そもそも必要になる設計をしない)
4. 計画外のnpm依存追加(必要と判断したらコミット前にオーナーに理由を説明して承認を得る)

## 記事作業の前に必ず読むこと

記事に関わる作業(執筆・添削・出典確認など)の前に `editorial/` 配下の全ファイル(`STYLE_GUIDE.md` / `LESSONS.md` / `DESIGN_NOTES.md` / `POLICY.md`)を読むこと。

## 出典ルール

出典を確認できない事実主張は書かない。独立した情報源2つ以上を必須とする(同一発表の転載は1つと数える)。一次ソース(公式発表・決算資料・論文・当事者発言)を最優先する。

## 著作権ルール

事実は自由に使ってよいが、特定記事の表現・構成の引き写しは禁止。有料記事1本だけを情報源にした記事は作らない。

## コード変更のルール

コード変更後は `npm run build` でエラー0を確認してからコミットする。

色・フォントは `src/styles/global.css` のトークン経由でのみ使用する(hex直書き禁止)。デザインを変更する場合は `editorial/DESIGN_NOTES.md` に理由を追記してから行う。パレット・フォント・radius(角丸)は本仕様で固定し、独自判断で変更しない。

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

制約: 上記はこのプロジェクトのデザイントークン(`editorial/DESIGN_NOTES.md`)の範囲内で適用する。フォント・配色・radiusの変更は不可。創意はモーション・余白・タイポグラフィの細部に注ぐこと。

## 運用カレンダー

- `/retro`(教訓の整理・昇格): 月1回目安
- 依存更新(`npm update`): 四半期に1回で十分

## よく使うコマンド

- `npm run dev` — 開発サーバー起動(プレビュー確認用)
- `npm run build` — 本番ビルド(エラー0を必ず確認)
- `/article` — 記事執筆ワークフロー(Phase 4で導入)
- `/publish` — 差分学習+公開ワークフロー(Phase 4で導入)
- `/retro` — 教訓の整理・昇格ワークフロー(Phase 4で導入)
- `/correct <slug> <誤りの内容>` — 公開済み記事の訂正ワークフロー
