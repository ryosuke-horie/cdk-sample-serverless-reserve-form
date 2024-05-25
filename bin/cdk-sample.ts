#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TimetableReservationStack } from "../lib/aws-cdk-resorce-cdk-sample-api_gateway-backend-stack";
import { CdkDeployGhOidcStack } from "../lib/aws-cdk-resorce-cdk-sample-deploy-gh-oidc-for-s3-stack";
import { FrontendS3WithCloudFrontStack } from "../lib/aws-cdk-resorce-cdk-sample-s3-frontend-stack";

// cdkによるアプリケーション定義
const app = new cdk.App();
const env = { region: "ap-northeast-1", account: "851725614224" };

// バックエンドLambda及びAPI Gatewayのデプロイ
new TimetableReservationStack(app, "TimetableReservationStack", { env });
// フロントエンド側S3およびCloudFrontのデプロイ
new FrontendS3WithCloudFrontStack(app, "FrontendS3WithCloudFrontStack", {
  env,
});
// GitHub Actionsによるデプロイを許可するOICDプロバイダーのデプロイ
new CdkDeployGhOidcStack(app, "CdkDeployGhOidcStack", { env });
