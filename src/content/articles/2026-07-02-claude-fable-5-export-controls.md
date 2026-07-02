---
title: "Claude Fable 5、米輸出規制で停止 18日後に復旧"
lead: "米国政府は6月12日、Anthropicに「Claude Fable 5」と「Claude Mythos 5」の輸出規制を指令しました。安全対策を回避する手法が見つかったことが理由です。Anthropicは国籍を即座に確認できないとして、世界中の利用者への提供を停止しました。6月30日に規制は解除され、7月1日にFable 5の提供が再開しました。"
tldr:
  - "米政府は6月12日、Fable 5とMythos 5の輸出規制を発動"
  - "Anthropicは国籍確認不能を理由に世界中で提供停止、決定に異議"
  - "6月30日に規制解除、7月1日にFable 5提供再開"
pubDate: 2026-07-02
tags: ["政策", "テック", "AI"]
sources:
  - name: "Claude Fable 5 and Claude Mythos 5"
    url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
    publisher: "Anthropic"
    accessed: 2026-07-02
  - name: "Statement on the US government directive to suspend access to Fable 5 and Mythos 5"
    url: "https://www.anthropic.com/news/fable-mythos-access"
    publisher: "Anthropic"
    accessed: 2026-07-02
  - name: "Redeploying Claude Fable 5"
    url: "https://www.anthropic.com/news/redeploying-fable-5"
    publisher: "Anthropic"
    accessed: 2026-07-02
  - name: "Claude Fable 5 from Anthropic back on Amazon Bedrock with stronger guardrails"
    url: "https://www.aboutamazon.com/news/aws/claude-fable-5-anthropic-available-amazon-bedrock"
    publisher: "Amazon"
    accessed: 2026-07-02
corrections: []
draft: true
---

Anthropicは6月9日、新しいAIモデル「Claude Fable 5」と「Claude Mythos 5」を発表しました[1]。Fable 5は発表当日から世界中で利用できるようになりました[1]。同社はFable 5を、これまでで最も高性能な汎用モデルと位置づけています[1]。料金は入力100万トークンあたり10ドル、出力100万トークンあたり50ドルです[1]。一度に読み込める文章量(コンテキスト)は最大100万トークンです[1]。

Mythos 5はFable 5と同じ基盤モデルですが、サイバーセキュリティなど一部領域の安全対策を緩めた版です[1]。サイバー防御の専門家向けプログラム「Project Glasswing」と、生物医学研究者向けの限定プログラムを通じてのみ提供されます[1]。Anthropicは発表時、外部専門家による1000時間超のレッドチーミング(第三者による安全性検証)を実施したと説明していました[1]。汎用的な安全対策の回避策(ジェイルブレイク)は見つからなかったとしていました[1]。

発表から3日後の6月12日午後5時21分(米東部時間)、米国政府はAnthropicに輸出管理指令を出しました[2]。国家安全保障上の権限を根拠とする指令です[2]。内容は、米国内外を問わず外国籍者(Anthropicの外国籍従業員を含む)によるFable 5とMythos 5へのアクセスをすべて停止するよう求めるものでした[2]。政府がこの指令を出したのは、Amazon(アマゾン)の研究者がFable 5の安全対策を回避する手法を発見したという報告を把握したためです[3]。

Anthropicは、利用者の国籍をその場で確実に確認する手段がないとして、対象を外国籍者に絞らず、世界中のすべての利用者向けにFable 5とMythos 5を無効化しました[2]。他のAnthropicのモデルへの影響はありませんでした[2]。同社は同日、この決定に公式に異議を唱える声明を出しました[2]。声明は「数億人に配備された商用モデルを、限定的なジェイルブレイクの発見を理由に停止させるべきだとは考えていない」としています[2]。さらに「この基準を業界全体に適用すれば、最先端モデルを開発するすべての企業で、新モデルの提供が事実上止まってしまう」と主張しました[2]。政府の対応については、「透明・公正・明確で、技術的事実に基づく」という原則に沿っていないと批判しました[2]。

その後およそ2週間、Anthropicは政府やAmazonを含む関係者と共に、報告内容と証拠の検証を進めました[3]。この間に改良した安全分類器(問題のある質問を検知する仕組み)を訓練しました[3]。

6月30日、米国政府は輸出管理指令を撤回しました[3]。Anthropicはこれを受けてFable 5の再展開を発表しました[3]。同社は政府に対し、4つの取り組みを約束しました[3]。国家安全保障に関わる能力の飛躍があるモデルについて、政府に事前アクセスを提供すること。重大なジェイルブレイクや安全対策の不備を速やかに開示すること。AIの安全性に関する共同研究を行うこと。最先端モデル開発企業向けの業界標準づくりに取り組むことです[3]。AmazonやMicrosoft、Googleなど「Glasswing」の協力企業と共に、ジェイルブレイクの深刻度を評価する業界共通の枠組みも提案するとしています[3]。

Fable 5は7月1日、Claude Platform・Claude.ai・Claude Code・Claude Cowork(いずれもAnthropicが提供するサービス)で、世界中の利用者向けに再び利用できるようになりました[3]。Pro・Max・Team・一部のEnterpriseプランの利用者は、7月7日まで週間利用上限の最大50%まで無料で使えます[3]。7月8日以降は利用クレジットを通じたアクセスに移行します[3]。Amazon Bedrock(Amazonのクラウド経由でAIモデルを利用できるサービス)でも7月1日からFable 5の提供が再開されました[4]。Amazonは、強化されたガードレール(安全対策の仕組み)を伴うと説明しています[4]。

## 分析

Anthropicは発表時、1000時間超のレッドチーミングで汎用的な回避策は見つからなかったとしていました[1]。それにもかかわらず、発表からわずか3日で回避手法が見つかった形です。大規模言語モデルの安全対策の限界を事前にすべて把握することの難しさが、改めて浮き彫りになったとみられます。

Anthropicが政府に約束した4つの取り組みは、モデルの事前審査や脆弱性の早期共有を制度化する内容です。高い能力を持つAIモデルの開発企業と政府の間で、公開前の情報共有が今後の慣行として定着していく一歩になる可能性があるとみられます。
