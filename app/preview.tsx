import React, { ReactNode, useState } from "react";
import Image from "next/image";
import styles from "./preview.module.css";
import avatar from "./avatar.png";
import reactStringReplace from "react-string-replace";

/** プレビュー画面 */
export default function Preview({
  text,
}: {
  /** 表示する文章 */
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    await global.navigator.clipboard.writeText(text.trim());
    // 2秒間だけcopiedをtrueにする
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.preview}>
      {copied ? (
        <button className={`${styles.copy} ${styles.done}`} disabled>
          <span>Copied!</span>
        </button>
      ) : (
        <button className={styles.copy} onClick={copyToClipboard}>
          <span>Copy</span>
        </button>
      )}
      <div className={styles.message}>
        <Image className={styles.avatar} src={avatar} alt="avatar" />
        <div className={styles.text}>
          <div className={styles.header}>
            <span className={styles.header_name}>あなた</span>
            <span className={styles.header_time}>今日 09:00</span>
          </div>
          <div className={styles.content}>{decorate(text + "\u200b")}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 文章中のハイパーリンクや改行をaタグやbrタグに変換する。
 * @param text 入力文章
 * @returns マークアップされた文章
 */
function decorate(text: ReactNode[] | string) {
  text = reactStringReplace(
    text,
    /(https?:\/\/[\w/:%#$&?()~.=+-]+)/g,
    (match, i) => (
      <a key={match + i} href={match}>
        {match}
      </a>
    )
  );
  return text;
}
