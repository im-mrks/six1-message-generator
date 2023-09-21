import styles from "./page.module.css";
import Generator from "./generator";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <h1>出退勤メッセージジェネレーター</h1>
      </header>
      <main className={styles.main}>
        <Generator />
      </main>
      <footer className={styles.footer}>©2023 im-mrks</footer>
    </>
  );
}
