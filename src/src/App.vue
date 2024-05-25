<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PopupReservationForm from "./components/PopupReservationForm.vue";
import WeekSelector from "./components/WeekSelector.vue";
import { getWeeklyLessons } from "./consts/weeklyLessons";
import type { Lesson } from "./types/Lesson";
import { addDays, formatDate } from "./utils/dateUtils";
import { extractTime } from "./utils/timeUtils";

// 現在の週の開始日を管理するためのリアクティブな参照
const currentStartOfWeek = ref(new Date());

// 日曜日の曜日コード（0）を取得
const sundayDay = 0;

// 現在の日付から日曜日までの日数を計算して、週の開始日を設定
const daysUntilSunday = (7 + currentStartOfWeek.value.getDay() - sundayDay) % 7;
currentStartOfWeek.value.setDate(
  currentStartOfWeek.value.getDate() - daysUntilSunday
);

// weeklyLessonsの使用
const weeklyLessons = computed(() => {
  return getWeeklyLessons(currentStartOfWeek.value);
});

// 週を進める関数
const advanceWeek = (days: number) => {
  currentStartOfWeek.value = addDays(currentStartOfWeek.value, days);
};

// 週選択で表示する、現在の週の日付範囲を計算する関数
const weekDisplay = computed(() => {
  const endOfWeek = addDays(currentStartOfWeek.value, 6);
  return `${currentStartOfWeek.value.getFullYear()}/${
    currentStartOfWeek.value.getMonth() + 1
  }/${currentStartOfWeek.value.getDate()} - ${endOfWeek.getFullYear()}/${
    endOfWeek.getMonth() + 1
  }/${endOfWeek.getDate()}`;
});

// 曜日の配列
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * 選択中の週の日付を計算し、日付ごとのイベントをオブジェクトで管理する
 */
const days = computed(() => {
  return daysOfWeek.map((dayLabel, index) => {
    // 現在の週の開始日にindex日を加算
    const currentDay = addDays(currentStartOfWeek.value, index);
    // 日付をフォーマット（時間と分は0に設定）
    const dateString = formatDate(currentDay, 0, 0).split(" ")[0]; // 日付部分だけを取得

    // 1日分のイベントを抽出
    return {
      date: dateString,
      events: weeklyLessons.value.filter((event) => {
        // イベントの開始日の日付部分を取得して比較
        const eventStartDateString = event.start.split(" ")[0];
        return eventStartDateString === dateString;
      }),
    };
  });
});

// レッスンの開始時間をもとに、過去のイベントかどうかを判定する関数
const isPastEvent = (eventStart) => {
  const eventStartTime = new Date(eventStart);
  return eventStartTime < new Date(); // 現在時刻と比較
};

// Style用オブジェクトの型定義
type StyleRecord = Record<string, string>;

/**
 * レッスンの時間をもとに位置と高さを計算する
 * @param {Lesson} classEvent レッスンのオブジェクト
 */
const getEventStyle = (classEvent: Lesson): StyleRecord => {
  const eventStart = classEvent.start.split(" ")[1];
  const eventEnd = classEvent.end.split(" ")[1];

  const [startHour, startMinute] = eventStart.split(":").map(Number);
  const [endHour, endMinute] = eventEnd.split(":").map(Number);

  // イベントの開始時間から10時までの分を計算する
  const top = (startHour - 10) * 60 + startMinute + 60; // 10時からの差分を分で計算(+60は日付のラベル分)
  // イベントの終了時間から開始時間までの高さを計算する
  const height = (endHour - startHour) * 60 + (endMinute - startMinute); // 開始と終了の差分を分で計算

  return {
    top: `${top}px`, // 上端の位置
    height: `${height}px`, // 高さ
    position: "absolute",
    left: "0",
    right: "0",
  };
};

/************************************************************************************************
 *                            フォームを取り扱うための状態の定義・関数                                *
 ************************************************************************************************/

// ポップアップ予約フォームの状態管理
const popupVisible = ref(false);

// 第一希望のレッスンを管理するリアクティブな参照
const selectedEvent = reactive({
  title: "",
  start: "",
  end: "",
  class: "",
  instructor: "",
});

// 第二希望のレッスンを管理するリアクティブな参照
const secondChoiceEvent = reactive({
  title: "",
  start: "",
  end: "",
  class: "",
  instructor: "",
});

// 第二希望選択モードかどうかを管理するリアクティブな参照
const selectingSecondChoice = ref(false);

/**
 * レッスンをクリックしたときのイベントハンドラ
 * 第一希望のレッスンを選択していない場合は第一希望に選択し、
 * 第一希望のレッスンを選択している場合は第二希望に選択する
 * @param lesson - クリックしたレッスンのオブジェクト
 */
const handleLessonClick = (lesson: Lesson) => {
  if (!selectingSecondChoice.value) {
    Object.assign(selectedEvent, lesson);
  } else {
    Object.assign(secondChoiceEvent, lesson);
    selectingSecondChoice.value = false; // 第二希望選択モードを終了
  }
  popupVisible.value = true; // ポップアップを表示
};

/**
 * 第二希望の選択状態をトグルする関数
 */
const toggleSecondChoice = () => {
  selectingSecondChoice.value = !selectingSecondChoice.value;
};

/**
 * ポップアップをクリアするイベントハンドラ
 */
const clearPopup = () => {
  // 第一候補の値を上書き
  Object.assign(selectedEvent, {
    title: "",
    start: "",
    end: "",
    class: "",
    instructor: "",
  });

  // 第二候補の値を上書き
  Object.assign(secondChoiceEvent, {
    title: "",
    start: "",
    end: "",
    class: "",
    instructor: "",
  });
  closePopup();
};

/**
 * ポップアップを閉じている状態に変更するイベントハンドラ
 */
const closePopup = () => {
  popupVisible.value = false;
};

/************************************************************************************************
 *                                 以下はフォームとAPIの連携処理                                    *
 ************************************************************************************************/

// 申込者情報
interface ApplicantInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * フォームの送信イベントハンドラ
 * フォームで入力した申し込み者情報にレッスン情報を追加してAPIに送信する
 *
 * @param {ApplicantInfo} ApplicantInfo PopupReservationFormで入力したデータ
 */
const handleFormSubmission = async (ApplicantInfo: ApplicantInfo) => {
  // APIへ送信するデータをまとめる
  const postData = {
    firstChoice: selectedEvent,
    secondChoice: secondChoiceEvent,
    applicant: ApplicantInfo,
  };

  // API にPOSTリクエストを送信し、レスポンスを待たない
  const responsePromise = fetch(
    "https://a08pmaxjgb.execute-api.ap-northeast-1.amazonaws.com/prod",
    {
      method: "POST",
      body: JSON.stringify(postData),
    }
  );

  // ポップアップをクリアして閉じる
  clearPopup();

  // レスポンスを待たずにアラートを表示
  alert("予約が受け付けられました。");

  // 裏側で送信処理を実行
  const response = await responsePromise;
};
</script>

<template>
  <h1>申し込み</h1>
  <NoticeBox />
  <div class="timeline-calendar">
    <!-- 週を操作するボタン -->
    <WeekSelector :week-display="weekDisplay" @advance-week="advanceWeek" />

    <div class="days-container">
      <div v-for="(day, index) in days" :key="day.date" class="day-column">
        <div class="date-label">{{ day.date }}{{ daysOfWeek[index] }}</div>
        <div
          v-for="event in day.events"
          :key="event.start"
          class="event"
          :class="{ past: isPastEvent(event.start), [event.class]: true }"
          :style="getEventStyle(event)"
          @click="handleLessonClick(event)"
        >
          <div class="event-time">
            {{ extractTime(event.start) }} - {{ extractTime(event.end) }}
          </div>
          <div class="event-title">
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <PopupReservationForm
    :popup-visible="popupVisible"
    :selected-event="selectedEvent"
    :second-choice-event="secondChoiceEvent"
    :selecting-second-choice="selectingSecondChoice"
    @form-submitted="handleFormSubmission"
    @close-popup="closePopup"
    @clear-popup="clearPopup"
    @toggle-second-choice="toggleSecondChoice"
  />
</template>

<style>
h1 {
  text-align: center;
}

.timeline-calendar {
  max-width: 730px; /* 暫定対応。PC表示で日曜日が表示される */
  margin: auto;
}

.days-container {
  display: flex;
  overflow-x: auto;
  min-height: 900px;
  background-color: #f9f9f9;
}

.day-column {
  min-width: 90px;
  border-right: 1px solid #ddd;
  padding: 10px;
  position: relative;
  min-height: 800px;
}

.date-label {
  text-align: center;
  font-weight: bold;
  font-size: 0.75rem;
  padding-bottom: 10px;
}

.event {
  border-left: 5px solid #42b983;
  border-bottom: 1px solid #ddd;
  padding: 7px;
  background-color: #fff;
  position: absolute;
  left: 0;
  right: 0;
}

.event.past {
  opacity: 0.5;
  background-color: #f0f0f0;
  pointer-events: none;
}

.event-time {
  font-size: 0.6rem;
  color: #555;
  border-bottom: 1px solid #ddd;
}

.event-title {
  font-weight: bold;
  font-size: 0.7rem;
  margin-top: 5px;
}

/* Add classes for event styles based on the "class" property */
.master-class {
  border-left-color: #9c27b0;
}
.sample1 {
  border-left-color: #2196f3;
}
.sample2 {
  border-left-color: #e91e63;
}
.color7 {
  border-left-color: #4caf50;
}
.sample3 {
  border-left-color: #ff9800;
}
.sample4 {
  border-left-color: #85dfff;
}
.nogi {
  border-left-color: #00bcd4;
}
.color8 {
  border-left-color: #c6e0b4;
}
.color9 {
  border-left-color: #607d8b;
}
.color10 {
  border-left-color: #795548;
}
.color6 {
  border-left-color: #ff5722;
}
</style>
