# Note: For Docker use (record only)

### 1. 刪除本機的快取資料夾與可能衝突的 node_modules
rm -rf node_modules package-lock.json docs/.vitepress/.vitepress-cache

### 2. 清除 Docker 之前建置失敗的殘留虛擬磁碟與快取
docker compose -f docker-compose.dev.yml down -v


```
docker compose -f docker-compose.dev.yml up --build
```

1. 🛠️ 在開發環境 (Development) 的正確指令
因為你在這個環境下可能會常常安裝新套件（修改 package.json），所以強烈建議每次都加上 --build。
docker compose -f docker-compose.dev.yml up --build


2. 📦 在生產環境 (Production) 的正確指令
   生產環境只是為了讓你測試 Nginx 靜態網頁和安全標頭（Headers），它不需要看 log，所以可以加 -d 讓它在背景執行：
   docker compose up -d --build

   說明：因為生產環境使用的是預設檔名 docker-compose.yml，所以不需要打 -f。加上 --build 是為了確保 Docker 雲端打包階段（Multi-stage Build）會重新把你的最新網頁內容編譯進 Nginx 裡面。
