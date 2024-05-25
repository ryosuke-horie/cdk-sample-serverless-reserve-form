import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient({ region: "ap-northeast-1" });

// formから送信されたデータの型定義
type PostEventData = {
  body: string;
};

// Jsonパース後のデータの型定義
type ParsedData = {
  applicant: {
    name: string;
    email: string;
    phone: string;
  };
  firstChoice: {
    title: string;
    start: string;
    end: string;
    user: string;
  };
  secondChoice: {
    title: string;
    start: string;
    end: string;
    user: string;
  };
};

/**
 * Lambda関数のエントリーポイント
 * ユーザー及び申し込み者へのメールを送信する
 * @param event - formから送信されたデータ
 */
export const handler = async (event: PostEventData) => {
  try {
    // eventから受け取ったJSONデータを取り出す
    const eventData = JSON.parse(event.body);

    // ユーザー通知メールを送信
    await sendMailToGym(eventData);

    // 申込者への自動返信メールを送信
    await sendMailToApplicant(eventData);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // すべてのオリジンからのアクセスを許可
      },
      body: JSON.stringify({ message: "メール送信成功" }),
    };
  } catch (error) {
    // エラー処理
    return {
      statusCode: 500, // エラーが発生した場合
      headers: {
        "Access-Control-Allow-Origin": "*", // CORSヘッダーを含める
      },
      body: JSON.stringify({
        message: "エラー発生",
      }),
    };
  }
};

/**
 * アプリケーション利用者への通知メールを送信する
 * @param eventData - formから送信されたデータ
 * @returns
 */
const sendMailToGym = async (eventData: ParsedData) => {
  // メールの本文に組み込むデータを作成
  const emailBodyToUser = createmailBodyToUser(eventData);

  // SESコマンドを作成してメールを送信
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: ["sample@user.co.jp"],
      CcAddresses: [
        getCCAddress(eventData.firstChoice.instructor),
        getCCAddress(eventData.secondChoice.instructor),
      ],
    },
    Message: {
      Body: {
        Text: { Data: emailBodyToUser },
      },
      Subject: { Data: "申し込みがありました" },
    },
    Source: "no-reply@example.net",
  });

  try {
    const response = await ses.send(command);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    console.log("以下申し込み内容");
    console.log(eventData);
    console.log("ses sendEmail function has been called");
  }
};

/**
 * ユーザー向けのメール本文を生成
 * @param eventData - formから送信されたデータ
 * @returns
 */
const createmailBodyToUser = (eventData: ParsedData) => {
  return `申込者情報：
氏名：${eventData.applicant.name}
メール：${eventData.applicant.email}
電話番号：${eventData.applicant.phone}

第一希望：${eventData.firstChoice.title}（${eventData.firstChoice.start} ~ ${eventData.firstChoice.end}）
第二希望：${eventData.secondChoice.title}（${eventData.secondChoice.start} ~ ${eventData.secondChoice.end}）
`;
};

/**
 * 申込者向けの自動返信メールを送信する
 * @param eventData - formから送信されたデータ
 * @returns
 */
const sendMailToApplicant = async (eventData: ParsedData) => {
  // メールの本文に組み込むデータを作成
  const emailBodyToApplicant = createMailBodyToApplicant(eventData);

  // SESコマンドを作成してメールを送信
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [eventData.applicant.email],
    },
    Message: {
      Body: {
        Text: { Data: emailBodyToApplicant },
      },
      Subject: { Data: "ご予約を承りました" },
    },
    Source: "no-reply@example.net",
  });

  try {
    const response = await ses.send(command);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error; // エラーをハンドリングまたはログに記録するために再スロー
  } finally {
    console.log("以下申し込み内容");
    console.log(eventData);
    console.log("ses sendEmail function has been called");
  }
};

/***
 * 申込者向けのメール本文を生成
 * @param eventData - formから送信されたデータ
 * @returns
 */
const createMailBodyToApplicant = (eventData: ParsedData) => {
  return `${eventData.applicant.name} 様

この度はご予約をいただきありがとうございます。
以下の内容で受付いたしました。
第一希望：${eventData.firstChoice.title}（${eventData.firstChoice.start} ~ ${eventData.firstChoice.end}）
第二希望：${eventData.secondChoice.title}（${eventData.secondChoice.start} ~ ${eventData.secondChoice.end}）

後ほど担当スタッフからメールでご連絡を差し上げます。
今しばらくお待ちください。

このメールは自動送信です。
`;
};

type MailList = {
  [key: string]: string;
};

// 名前とメールアドレスの対応表
const MailList: MailList = {
  user1: "user1@example.com",
  user2: "user2@example.com",
};

/**
 * 名前をもとにメールのCCを返す
 * @param name
 * @returns メールアドレス
 */
const getCCAddress = (name: string) => {
  return MailList[name] || "";
};
