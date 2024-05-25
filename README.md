# Timetable Reservation | タイムテーブル式予約用アプリ

## 構想

hide`s kickHP掲載のタイムテーブルを予約用にカスタマイズする。
YSAがhacomonoを利用して提供している予約サービスを参考としている。
最低限の入力項目・操作で済むUXを提供する。
将来的には決済サイトに組み込む可能性があるため、CDKでインフラを構築し、流用しやすい設計を行う

## 技術スタック｜依存ライブラリ

### フロントエンド

- Vue.js v3
- TypeScript
- vite
- vue-cal ... カレンダー用ライブラリ
- ress ... リセットCSS

### バックエンド

- 未実装
- Lambda
- ApiGateway

### インフラ

- AWS CDK
- biome ... Linter, Formatter
- dotenv ... 環境変数参照用

### 全体に関係するもの

- CICD:Github Actions
  - biomeによる静的解析(CDK側 push時)
  - S3への自動デプロイ

## CDKで実装したインフラの概要

- APIGateway , Lambda, DynamoDBによるバックエンド（スケルトン実装）
- S3, CloudFrontによるビルド成果物のホスティング
- Github ActionsとIAMの連携用OICD設定（IAM関連）

## 注意点

- scr以下がフロントエンドの実装となる。
  - パスに注意すること

## インフラデプロイ

注意：Windows10のノートPCではaws configureがうまくいっておらずデプロイ不可。(2024/3/8)

```
cdk deploy --profile=timetable --all
```
