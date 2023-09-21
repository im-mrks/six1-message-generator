import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import styles from "./editor.module.css";
import Mode from "./mode";
import { TimeRangeContext, LocalStorageWrapper } from "./utils";

/** 編集画面 */
export default function Editor({
  mode,
  editorItems,
  values,
  setValues,
}: {
  /** 出勤 or 退勤 */
  mode: Mode;
  /** 表示する要素のタイトル */
  editorItems: string[];
  /** 編集画面の各要素の値 */
  values: string[];
  /** 編集画面の各要素の値のセッター */
  setValues: Dispatch<SetStateAction<string[]>>;
}) {
  /**
   * 編集画面の`values`を1つ更新する。
   * @param index 更新する値のインデックス
   * @param newValue 更新する値
   */
  function setSingleValue(index: number, newValue: string) {
    setValues(values.map((oldValue, i) => (i === index ? newValue : oldValue)));
  }

  return (
    <>
      {editorItems.map((title, index) => {
        // EditorItemPropsを作成
        const value = values[index];
        const setValue = setSingleValue.bind(null, index);
        const args = { title, mode, value, setValue };

        if (index === 0) {
          // 1つ目は時間
          return <TimeRange key={index} {...args} />;
        } else {
          // それ以外は自由入力
          return <TextInput key={index} {...args} />;
        }
      })}
    </>
  );
}

/** 編集画面の要素の情報 */
type EditorItemProps = {
  /** タイトル */
  title: string;
  /** 現在のモード */
  mode: Mode;
  /** 現在保存されている要素の値 */
  value: string;
  /** 要素の値を更新する */
  setValue: (value: string) => void;
};

/**
 * 時間の範囲を入力する画面
 * @param props 描画に必要な情報。`initial`は無視し、代わりにローカルストレージの値を使う。
 */
function TimeRange(props: EditorItemProps) {
  const [initialFrom, initialTo] = useContext(TimeRangeContext);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const { title, mode, setValue } = props;

  function onChangeFrom(event: React.ChangeEvent<HTMLInputElement>) {
    const from = event.target.value;
    setFrom(from);
    setValue(from + "-" + to);
    if (mode === "Join") {
      LocalStorageWrapper.set("from", from);
    }
  }

  function onChangeTo(event: React.ChangeEvent<HTMLInputElement>) {
    const to = event.target.value;
    setTo(to);
    setValue(from + "-" + to);
    if (mode === "Join") {
      LocalStorageWrapper.set("to", to);
    }
  }

  return (
    <label className={styles.editor}>
      <span className={styles.title}>{title}</span>
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="time"
          defaultValue={from}
          onChange={onChangeFrom}
        />
        <span className={styles.tilde}>~</span>
        <input
          className={styles.input}
          type="time"
          defaultValue={to}
          onChange={onChangeTo}
        />
      </div>
    </label>
  );
}

/** テキストエリアに入力する画面 */
function TextInput(props: EditorItemProps) {
  const { title, value, setValue } = props;

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  return (
    <label className={styles.editor}>
      <span className={styles.title}>{title}</span>
      <div className={styles.wrapper}>
        <textarea
          className={styles.input}
          defaultValue={value}
          onChange={onChange}
        ></textarea>
        <div className={styles.dummy} aria-hidden="true">
          {value + "\u200b"}
        </div>
      </div>
    </label>
  );
}
