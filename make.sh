#!/bin/bash

# 顏色定義（讓終端機輸出更美觀）
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # 無顏色

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}    VitePress Docker 學習控制面板      ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo "請選擇要執行的 Docker 環境："
echo "1) 🛠️  開發環境 (Node.js + Hot Reload 即時更新)"
echo "2) 📦 生產環境 (多階段打包 + Nginx 安全靜態伺服器)"
echo "3) 🛑 關閉並清理所有容器 (Down)"
echo "4) ❌ 離開"
echo -e "${BLUE}---------------------------------------${NC}"

read -p "輸入選項 (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}正在啟動開發環境... (網址: http://localhost:5173)${NC}"
        echo -e "${YELLOW}提示: 此模式未開啟背景執行，修改檔案可直接在終端機看 log。${NC}"
        # docker compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo -e "${GREEN}正在啟動生產環境... (網址: http://localhost:8080)${NC}"
        echo -e "${YELLOW}提示: 正在使用 Nginx 背景建構，建構完成後請直接訪問網頁。${NC}"
        # docker compose up -d --build
        echo -e "${GREEN}啟動成功！目前容器狀態：${NC}"
        # docker compose ps
        ;;
    3)
        echo -e "${YELLOW}正在關閉所有相關容器與清理網路...${NC}"
        # docker compose down
        # docker compose -f docker-compose.dev.yml down
        echo -e "${GREEN}清理完畢！${NC}"
        ;;
    4)
        echo "已取消操作。"
        exit 0
        ;;
    *)
        echo "無效的選項，請重新執行腳本。"
        exit 1
        ;;
esac
