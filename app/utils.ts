import { createContext } from "react";

export const TimeRangeContext = createContext<[string, string]>([
  "09:00",
  "14:00",
]);

/** ローカルストレージのラッパークラス */
export class LocalStorageWrapper {
  /**
   * ローカルストレージに保存された値を取得する。
   * @param key 取得したい値のキー
   * @param init デフォルトの値
   * @returns ローカルストレージに保存された値。存在しない場合は`init`の値。
   */
  static get(key: string, init: string) {
    if (this.hasStorage()) {
      return localStorage.getItem(key) ?? init;
    } else {
      return init;
    }
  }

  /**
   * ローカルストレージに値を保存する。
   * @param key 保存する値のキー
   * @param value 保存する値
   */
  static set(key: string, value: string) {
    if (this.hasStorage()) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * `localStorage`にアクセスできるかを調べる。
   * Next.jsがSSRを行う間はアクセスできないので、このメソッドでチェックする必要がある。
   * @returns `localStorage`にアクセスできるなら`true`を返す。
   */
  private static hasStorage() {
    return typeof window !== "undefined";
  }
}
