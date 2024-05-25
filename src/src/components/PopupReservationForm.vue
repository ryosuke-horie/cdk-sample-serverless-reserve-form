<script setup lang="ts">
import { ref } from "vue";
import { extractTime } from "../utils/timeUtils";
import { extractDate } from "../utils/dateUtils";

defineProps({
  selectedEvent: {
    type: Object,
    default: () => ({}), // デフォルト値を設定
  },
  secondChoiceEvent: {
    type: Object,
    default: () => ({}), // デフォルト値を設定
  },
  popupVisible: {
    type: Boolean,
    default: false, // デフォルト値を設定
  },
  selectingSecondChoice: {
    type: Boolean,
    default: false, // デフォルト値を設定
  },
});

const emit = defineEmits([
  "clearPopup",
  "closePopup",
  "formSubmitted",
  "toggleSecondChoice",
]);

// 以下のローカル状態とメソッドを定義
const applicantName = ref("");
const applicantEmail = ref("");
const applicantPhone = ref("");

// ポップアップを閉じるときにイベントを発火
const closePopup = () => {
  emit("closePopup");
};

// ポップアップをクリアするときにイベントを発火
const clearPopup = () => {
  emit("clearPopup");
};

// 第二希望を選択するための関数
const selectSecondChoice = () => {
  emit("toggleSecondChoice"); // 親コンポーネントに状態変更を通知
  closePopup(); // ポップアップを閉じる
};

const submitForm = () => {
  // フォーム送信処理
  emit("formSubmitted", {
    name: applicantName.value,
    email: applicantEmail.value,
    phone: applicantPhone.value,
  });
};
</script>

<template>
  <!-- ポップアップ -->
  <div v-if="popupVisible" class="popup">
    <div class="popup-content">
      <h2>予約</h2>
      <form @submit.prevent="submitForm">
        <!-- 第一希望の表示 -->
        <div>
          <label>第一希望：</label>
          <p>
            {{ selectedEvent.title }}
            ({{ extractDate(selectedEvent.start) }}
            {{ extractTime(selectedEvent.start) }} -
            {{ extractTime(selectedEvent.end) }})
          </p>
        </div>
        <!-- 第二希望の表示（第二希望が選択されている場合のみ表示） -->
        <div v-if="secondChoiceEvent.title">
          <label>第二希望：</label>
          <p>
            {{ secondChoiceEvent.title }}
            ({{ extractDate(secondChoiceEvent.start) }}
            {{ extractTime(secondChoiceEvent.start) }} -
            {{ extractTime(secondChoiceEvent.end) }})
          </p>
        </div>
        <div v-if="!secondChoiceEvent.title">
          <!-- 第二希望を選択するボタン -->
          <button type="button" @click="selectSecondChoice">
            第二希望を選択する<br />（レッスンを選んでクリックしてください）
          </button>
        </div>
        <!-- 応募者情報入力 -->
        <div>
          <label for="applicant-name">申し込み者の氏名：</label>
          <input
            id="applicant-name"
            v-model="applicantName"
            type="text"
            required
          />
        </div>
        <div>
          <label for="applicant-email">メールアドレス：</label>
          <input
            id="applicant-email"
            v-model="applicantEmail"
            type="email"
            required
          />
        </div>
        <div>
          <label for="applicant-phone">電話番号：</label>
          <input
            id="applicant-phone"
            v-model="applicantPhone"
            type="tel"
            required
          />
        </div>
        <div>
          <button type="submit">予約を確定する</button>
        </div>
        <p class="popup-mail-message">
          記載いただいたメール宛てに確認メールを送信します。
        </p>
      </form>
      <button class="cancel-button" @click="clearPopup">キャンセル</button>
    </div>
  </div>
</template>

<style scoped>
/* ポップアップ */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* ポップアップの幅 */
  max-width: 500px; /* 最大幅 */
  background-color: white;
  padding: 20px;
  border-radius: 10px; /* 角丸のデザイン */
  border: 1px solid #ccc;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.popup-content {
  margin: 0 auto; /* 中央揃え */
  display: flex;
  flex-direction: column; /* 縦に要素を並べる */
}

.popup-content h2 {
  margin-bottom: 20px; /* タイトル下の余白 */
  text-align: center; /* タイトルを中央揃えに */
}

.popup-content form {
  display: flex;
  flex-direction: column; /* フォーム内要素を縦に並べる */
}

.popup-content form div {
  display: flex; /* フレックスボックスを使用 */
  flex-direction: column; /* 要素を縦に配置 */
  align-items: stretch; /* 子要素を幅いっぱいに広げる */
}

.popup-content form div label {
  margin-bottom: 5px; /* ラベル下の余白 */
  font-weight: bold; /* ラベルの文字を太く */
}

.popup-content form input {
  padding: 10px; /* 入力欄内のパディング */
  border: 1px solid #ddd; /* 入力欄のボーダー */
  border-radius: 5px; /* 入力欄の角丸デザイン */
  width: 100%; /* 幅をポップアップの幅いっぱいに設定 */
  box-sizing: border-box; /* パディングとボーダーを幅に含める */
}

.popup-content form button {
  padding: 10px 15px; /* ボタン内のパディング */
  border: none;
  border-radius: 5px; /* ボタンの角丸デザイン */
  background-color: #42b983; /* ボタンの背景色 */
  color: white;
  margin-top: 10px; /* ボタン上の余白 */
  margin-bottom: 8px;
  cursor: pointer; /* カーソルをポインターに */
  transition: background-color 0.3s ease; /* 背景色のトランジション */
}

.popup-content form button:hover {
  background-color: #367b63; /* ホバー時の背景色 */
}

.popup-content button {
  border: none;
  background: none;
  color: #555;
  cursor: pointer;
  transition: color 0.3s ease;
}

.popup-content button:hover {
  color: #222;
}

.popup-mail-message {
  font-size: 0.7em;
  color: #555;
}

.popup-content button.cancel-button {
  padding: 10px 15px; /* ボタン内のパディング */
  border: none;
  border-radius: 5px; /* ボタンの角丸デザイン */
  background-color: #f44336; /* ボタンの背景色 */
  color: white;
  margin-top: 10px; /* ボタン上の余白 */
  cursor: pointer; /* カーソルをポインターに */
  transition: background-color 0.3s ease; /* 背景色のトランジション */
}

.popup-content button.cancel-button:hover {
  background-color: #d32f2f; /* ホバー時の背景色 */
}
</style>
