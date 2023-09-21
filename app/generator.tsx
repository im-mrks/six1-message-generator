"use client";

import styles from "./generator.module.css";
import Editor from "./editor";
import Mode from "./mode";
import Preview from "./preview";
import Tab from "./tab";
import { useEffect, useState } from "react";
import { TimeRangeContext, LocalStorageWrapper } from "./utils";

/** メッセージジェネレーター */
export default function Generator() {
  const [mode, setMode] = useState<Mode>("Join");
  const [prevMode, setPrevMode] = useState(mode);
  const [values, setValues] = useState(Array(4).fill(""));
  const [prevValues, setPrevValues] = useState(values);
  const [text, setText] = useState("");

  // 前回出勤時に入力した時刻を取得する
  const timeRange: [string, string] = [
    LocalStorageWrapper.get("from", "09:00"),
    LocalStorageWrapper.get("to", "14:00"),
  ];
  const timeRangeDisplay = timeRange.join("-");

  // 初期値の設定
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setValues([timeRangeDisplay, "・", "", ""]);
  }, []);
  /* eslint-enable */

  // 編集画面に表示する要素
  let editorItems: string[];
  switch (mode) {
    case "Join":
      editorItems = ["勤務時間", "作業予定"];
      break;
    case "Leave":
      editorItems = ["勤務時間", "行ったこと", "作業ログ", "今日のひとこと"];
      break;
  }

  // modeかvaluesが変わったらプレビューを更新する
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (
    prevMode !== mode ||
    prevValues.some((value, index) => value !== values[index])
  ) {
    setPrevMode(mode);
    setPrevValues(values);

    switch (mode) {
      case "Join":
        setText(
          `出勤します。${values[0]}\n` +
            `${values[1]}\n` +
            "を進めていきます。よろしくお願いします。"
        );
        break;
      case "Leave":
        setText(
          editorItems.reduce(
            (previousValue, currentTitle, currentIndex) =>
              `${previousValue}\n` +
              `＜${currentTitle}＞\n` +
              values[currentIndex],
            "退勤します。"
          )
        );
        break;
    }
  }

  return (
    <TimeRangeContext.Provider value={timeRange}>
      <div className={styles.header}>
        <nav className={styles.navbar}>
          <Tab
            label="出勤"
            color="primary"
            active={mode === "Join"}
            onClick={() => setMode("Join")}
          />
          <Tab
            label="退勤"
            color="secondary"
            active={mode === "Leave"}
            onClick={() => setMode("Leave")}
          />
        </nav>
      </div>
      <div
        className={`${styles.body} ${
          mode === "Join" ? styles.primary : styles.secondary
        }`}
      >
        <section className={styles.left}>
          <Editor
            mode={mode}
            editorItems={editorItems}
            values={values}
            setValues={setValues}
          />
        </section>
        <section className={styles.right}>
          <Preview text={text} />
        </section>
      </div>
    </TimeRangeContext.Provider>
  );
}
