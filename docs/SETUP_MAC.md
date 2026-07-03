# MacBook Air セットアップ手順

Windowsデスクトップ機と同じ開発環境をMacBook Airに作るための手順。上から順に実行すれば完了します。所要時間はダウンロード込みで30分程度。

すべての作業は「ターミナル」アプリで行います(Launchpad →「その他」→「ターミナル」。黒い画面にコマンドを打ち込むアプリです)。

## 1. Git を入れる(バージョン管理ツール)

ターミナルで次を実行:

```sh
xcode-select --install
```

ダイアログが出たら「インストール」を押して待つ。すでに入っている場合は「インストール済み」と出るのでそのまま次へ。

## 2. Node.js を入れる(サイトのビルドに必要な実行環境)

https://nodejs.org/ja を開き、「LTS」と書かれた方をダウンロードしてインストール(ダブルクリックして進めるだけ)。

終わったらターミナルで確認:

```sh
node --version
```

`v22.x.x` のようなバージョン番号が出ればOK。

## 3. GitHub CLI を入れてログインする(GitHubへの送信に必要)

https://github.com/cli/cli/releases/latest を開き、`gh_〇〇_macOS_universal.pkg` をダウンロードしてインストール。

その後ターミナルで:

```sh
gh auth login
```

質問には次のように答える:

- Where do you use GitHub? → **GitHub.com**
- Preferred protocol → **HTTPS**
- Authenticate Git with your GitHub credentials? → **Yes**
- How would you like to authenticate? → **Login with a web browser**

ブラウザが開くので、Windowsで使っているのと同じGitHubアカウント(Teto59)でログインし、画面に表示されたコードを入力する。

## 4. リポジトリを取得する(clone)

ターミナルで:

```sh
cd ~
gh repo clone Teto59/news-media NewsMedia
cd NewsMedia
npm install
```

`npm install` は必要な部品を自動でダウンロードするコマンド。数分かかることがあります。

## 5. 動作確認

```sh
npm run build
```

エラーなく終われば環境構築は完了。プレビューを見たい場合は:

```sh
npm run dev
```

と実行し、表示されるURL(通常 http://localhost:4321)をブラウザで開く。止めるときは `Ctrl + C`。

## 6. Claude Code を入れる

ターミナルで:

```sh
curl -fsSL https://claude.ai/install.sh | bash
```

インストール後、いったんターミナルを閉じて開き直し:

```sh
cd ~/NewsMedia
claude
```

でClaude Codeが起動する。初回はAnthropicアカウントでのログインを求められるので、Windowsと同じアカウントでログインする。`/article` や `/publish` などのワークフローはリポジトリに含まれているため、そのまま使えます。

## 日々の運用ルール(2台で作業する場合)

作業内容はGitHub経由で同期します。自動では同期されないので、次の習慣だけ守ってください:

- **作業を始める前に**: `git pull` (他方のマシンでの変更を取り込む)
- **作業が終わったら**: コミットしてpush(Claude Codeに「コミットしてpushして」と頼めばOK)

これを忘れると2台の内容がずれて、あとで合体作業(コンフリクト解消)が必要になります。「始めにpull、終わりにpush」だけ覚えれば大丈夫です。

## 同期されないもの(知っておくだけでOK)

- Claude Codeの「メモリ」(会話をまたいで覚えている内容)はマシンごとに別。ただしプロジェクトのルールはすべて `CLAUDE.md` と `editorial/` に書かれているので、記事の品質には影響しません。
- Claude Codeの許可設定(どのコマンドを確認なしで実行してよいか)もマシンごとに別。Mac側で最初のうちは確認が多めに出ますが、正常です。
