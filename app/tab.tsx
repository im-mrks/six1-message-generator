import styles from "./tab.module.css";

/** モード変更タブ */
export default function Tab({
  label,
  color,
  active,
  onClick,
}: {
  /** 表示するラベル */
  label: string;
  /** CSSの色 */
  color: "primary" | "secondary";
  /** 現在選択されているモードならtrue */
  active: boolean;
  /** モードを変更する関数 */
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.tab} ${styles[color]} ${active && styles.active}`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
