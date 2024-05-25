import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { aws_iam, aws_lambda_nodejs } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as ses from "aws-cdk-lib/aws-ses";

// API Gateway と Lambda 関数を定義する
export class TimetableReservationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数として、sendMail をデプロイする
    const sendMail = new aws_lambda_nodejs.NodejsFunction(
      this,
      "SendMailHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../lambda/sendMail.ts"),
        handler: "index.handler", // デプロイするとindex.mjsになるため
        bundling: {
          externalModules: ["aws-sdk"], // aws-sdkを外部モジュールとして指定
        },
      }
    );

    // SendMail をAPIGatewayのエンドポイントとして公開する
    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: sendMail,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    // APIGatewayのエンドポイントにPOSTメソッドを追加する
    api.root.addMethod("POST");

    // Lambda関数にSESの権限を付与する
    const sendMailPolicyStatement = new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      resources: ["*"],
      actions: ["ses:SendRawEmail", "ses:SendEmail"],
    });
    sendMail.addToRolePolicy(sendMailPolicyStatement);

    const domainName: string = "example.net";

    /**
     * example.netがドメインとして定義されている既存のpublicHostZoneを参照
     */
    const hostedZone = route53.PublicHostedZone.fromLookup(
      this,
      "existHostZone",
      {
        domainName: domainName,
      }
    );

    /**
     * SESのIdentityを作成
     * メール配信設定
     * SPFとDKIMの設定は自動的に行われる
     */
    const identity = new ses.EmailIdentity(this, "Identity", {
      identity: ses.Identity.publicHostedZone(hostedZone),
      mailFromDomain: `bounce.${domainName}`,
    });

    /**
     * DMARCの設定
     */
    new route53.TxtRecord(this, "DmarcRecord", {
      zone: hostedZone,
      recordName: `_dmarc.${domainName}`,
      values: [`v=DMARC1; p=none; rua=mailto:dmarcreports@${domainName}`],
      ttl: cdk.Duration.hours(1),
    });
  }
}
