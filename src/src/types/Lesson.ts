// インストラクターとして登録されている人の名前
export type Instructor = "user1" | "user2";

export interface Lesson {
  start: string; // 開始時刻
  end: string; // 終了時刻
  title: string; // レッスンタイトル
  class: string; // CSSクラス
  instructor: Instructor; // インストラクター名
}
