import { Lesson } from "../types/Lesson";
import { addDays, formatDate } from "../utils/dateUtils";

/**
 * タイムライン形式スケジュールを1週間分のイベントの配列として計算する
 * @returns {Lesson[]} 1週間分のレッスンの配列
 */
export const getWeeklyLessons = (currentStartOfWeek: Date): Lesson[] => {
  // レッスンの配列
  const lessons: Lesson[] = [];

  // 1週間分のレッスンを定義
  for (let i = 0; i < 7; i++) {
    const day = addDays(currentStartOfWeek, i);

    // 日曜日
    if (i === 0) {
      lessons.push(
        {
          start: formatDate(day, 11, 45),
          end: formatDate(day, 13, 0),
          title: "サンプル１",
          class: "sample1",
          instructor: "user1",
        },
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 14, 50),
          title: "サンプル2",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 15, 0),
          end: formatDate(day, 15, 50),
          title: "サンプル3",
          class: "sample3",
          instructor: "user1",
        },
        {
          start: formatDate(day, 16, 0),
          end: formatDate(day, 16, 50),
          title: "サンプル4",
          class: "sample4",
          instructor: "user1",
        },
        {
          start: formatDate(day, 17, 0),
          end: formatDate(day, 18, 30),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        }
      );
    }

    // 月曜日
    if (i === 1) {
      lessons.push(
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 15, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user2",
        },
        {
          start: formatDate(day, 15, 0),
          end: formatDate(day, 15, 45),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル6",
          class: "color6",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 22, 0),
          end: formatDate(day, 23, 0),
          title: "サンプル7",
          class: "color7",
          instructor: "user2",
        }
      );
    }

    // 火曜日
    if (i === 2) {
      lessons.push(
        {
          start: formatDate(day, 10, 0),
          end: formatDate(day, 13, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user2",
        },
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 16, 0),
          title: "サンプル8",
          class: "color8",
          instructor: "user1",
        },
        {
          start: formatDate(day, 17, 0),
          end: formatDate(day, 17, 50),
          title: "サンプル4",
          class: "sample4",
          instructor: "user1",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "サンプル9",
          class: "color9",
          instructor: "user1",
        },
        {
          start: formatDate(day, 22, 0),
          end: formatDate(day, 23, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user2",
        }
      );
    }

    // 水曜日
    if (i === 3) {
      lessons.push(
        {
          start: formatDate(day, 12, 0),
          end: formatDate(day, 12, 50),
          title: "サンプル3",
          class: "sample3",
          instructor: "user1",
        },
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 15, 45),
          title: "サンプル9",
          class: "color9",
          instructor: "user2",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 22, 0),
          end: formatDate(day, 23, 0),
          title: "サンプル7",
          class: "color7",
          instructor: "user2",
        }
      );
    }

    // 木曜日
    if (i === 4) {
      lessons.push(
        {
          start: formatDate(day, 10, 0),
          end: formatDate(day, 13, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 16, 0),
          title: "サンプル8",
          class: "color8",
          instructor: "user2",
        },
        {
          start: formatDate(day, 17, 0),
          end: formatDate(day, 17, 50),
          title: "サンプル4",
          class: "sample4",
          instructor: "user1",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "サンプル9",
          class: "color9",
          instructor: "user1",
        },
        {
          start: formatDate(day, 22, 0),
          end: formatDate(day, 23, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        }
      );
    }

    // 金曜日
    if (i === 5) {
      lessons.push(
        {
          start: formatDate(day, 12, 0),
          end: formatDate(day, 12, 50),
          title: "サンプル3",
          class: "sample3",
          instructor: "user1",
        },
        {
          start: formatDate(day, 14, 0),
          end: formatDate(day, 15, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 15, 0),
          end: formatDate(day, 15, 45),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "グラップリング",
          class: "color10",
          instructor: "user1",
        },
        {
          start: formatDate(day, 22, 0),
          end: formatDate(day, 23, 0),
          title: "サンプル7",
          class: "color7",
          instructor: "user1",
        }
      );
    }

    // 土曜日
    if (i === 6) {
      lessons.push(
        {
          start: formatDate(day, 17, 0),
          end: formatDate(day, 18, 30),
          title: "サンプル5",
          class: "sample2",
          instructor: "user1",
        },
        {
          start: formatDate(day, 18, 30),
          end: formatDate(day, 20, 0),
          title: "サンプル9",
          class: "color9",
          instructor: "user1",
        },
        {
          start: formatDate(day, 20, 0),
          end: formatDate(day, 21, 30),
          title: "サンプル2",
          class: "sample2",
          instructor: "user1",
        }
      );
    }
  }
  return lessons;
};
