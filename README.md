# 小萌馬金庫

李宣穆的育兒資金帳本。網頁放在 GitHub Pages，資料存在 Firebase Firestore，只有登入的家人可以讀寫。

## 檔案
- `index.html`：整個網頁程式
- `firebase-config.js`：Firebase 網頁設定碼（不是密碼，可以公開）
- `firestore.rules`：資料庫安全規則，貼到 Firebase Console → Firestore → 規則
- `manifest.webmanifest`、`icon-*.png`：加入手機主畫面用的名稱和圖示

## 備份
網頁右上角「備份」→「下載完整備份 (JSON)」，建議每月一次。
