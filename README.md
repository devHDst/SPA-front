#目次

<p>0.操作方法</p>
<p>1.プロジェクトの概要</p>
<p>2.プロジェクトの作成経緯</p>
<p>3.構成</p>
<p>4.改善課題</p>

<h2>0.操作方法</h2>
<h3>ローカル</h3>
<p>ローカルのでの運用方法はルートディレクトリでnpm startを実行してください</p>
<p>注意としてstripe_api_keyとgoogle_map_keyは個別の値を差し込むこと</p>

<h3>検証環境サーバーへの立ちあげ</h3>
<pre>
gcp経由でデプロイ完了 <a href="https://spa-r-front.com">一般公開済み(従量課金制のため、非使用時はoff)</a>
1.ローカルでプロジェクトルートディレクトリに移動しビルド
npm run build

2.以下コマンドに各設定値を用いでgcp環境にデプロイ
gcloud compute scp --project "<GCPのプロジェクト名>" --zone "<GCEインスタンスのゾーン(リージョン)>" --recurse build/ <GCEのインスタンス名>:./view

3.gceのデプロイ先コンテナにssh接続
gcloud compute ssh --zone "<GCEインスタンスのゾーン(リージョン)>"  <GCEのインスタンス名> --project "<GCPのプロジェクト名>"

4.作業ディレクトリに移動
cd /var/www/

5.nginxですでにルートパスをビルドファイルにしていしているので以下コマンドでビルドファイルをルートディレクトリに移動
cp -r /home/{username}/view/build/ ./html

</pre>

<h2>1.プロジェクトの概要</h2>
<p>react+springbootで予約、自動決済機能を活用したSPA(single-page-Application)であり、このrepositoryは以下フロント枠の箇所のソース管理兼メモとして利用してます。</p>
<p>現在の進捗としてローカルでの挙動まで確認し、今後2ヶ月の目標としてサイトとして一般的にブラウザで利用できるところまで作成する予定です。</p>

<img width="800" alt="構成" src="https://github.com/user-attachments/assets/312c6f5f-8c8e-4421-9868-f2447734a15f" />

<h2>2.プロジェクトの作成経緯</h2>
<p>元の題材としてはweb系で何かECサイトをコピーしてみるというところで形にならなかった中で、行きつけのお店が予約時に決済をとるアプリ機能を採用していたが、</p>
<p>レビューで予約直後の決済はキャンセルできない不満が散見されたので、もし当事者ならどのように改善したかという発想をベースにSPAとして切り出してみただけです。</p>
<p>上記の構成図みて</p>
<p>・mqいらなくない？</p>
<p>・なんでコンテナ分けたの?　1個のコンテナでバッチとして運用すればよくない？</p>
<p>と疑問を思われると思いますが、全くその通りだと思います。こちらに関してはspring未経験で学習目的なので慣れるために色々機能使いたかっただけです。納品するプロジェクト業務ではちゃんと1つにまとめます。</p>

<h2>3.構成</h2>
<h3>3-1.開発環境</h3>
<pre>
| 言語・主にインストールしたlib | バージョン |
| --------------------- | ---------- |
| React                 | 19.1.0     |
| axios                 | 1.10.0     |
| uuid                  | 11.1.0     |
| dayjs                 | 1.11.13    |
| @mui/material         | 7.1.2      |
| @mui/x-date-pickers   | 8.5.3      |
| @stripe/stripe-js     | 7.3.1      |
| @stripe/react-stripe-js| 3.7.0     |
| @stripe/react-stripe-js| 3.7.0     |
| @@react-google-maps/api| 2.20.7    |

</pre>

<h3>3-2.ディレクトリ</h3>
<pre>
~/src
├── App.css
├── App.js
├── App.test.js
├── css(それぞれのコンポーネント用のcss)
│   ├── Access.css
│   ├── CardElementForm.css
│   ├── Home.css
│   ├── Introduction.css
│   ├── Menu.css
│   ├── Order.css
│   └── Reservation.css
├── index.css
├── index.js
├── logo.svg
├── reportWebVitals.js
├── setupTests.js
└── spa-component(各ビューとAPI情報)
    ├── Access.tsx
    ├── CardElementForm.tsx
    ├── Home.tsx
    ├── Introduction.tsx
    ├── Menu.tsx
    ├── Order.tsx
    ├── Reservation.tsx
    └── ResultDialog.tsx
</pre>

<h2>4.改善課題</h2>
<p>1.Accsss.tsxコンポーネント内で使用してるgoogle mapだが、APIキーをenv経由で読ませる挙動がうまくいかなかったので、ローカルで暫定直読みの実装にして対応。セキュリティの観点でAPIキーの直読みはナンセンスなので要修正->対応済み</p>
<p>2.メールアドレス入力欄に対してバリデーションをセット</p>
