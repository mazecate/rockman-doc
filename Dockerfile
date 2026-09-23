# === 階段 1：共享基礎 (Base) ===
FROM node:23-alpine AS base
WORKDIR /app

# Install git
RUN apk add --no-cache git

COPY package*.json ./

# === 階段 2：開發測試 (Target: development) ===
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "docs:dev", "--", "--host", "0.0.0.0"]

# === 階段 3：生產打包 (Builder) ===
FROM base AS builder
RUN npm install
COPY . .
RUN npm run docs:build

# === 階段 4：生產運行 (Target: production) ===
FROM nginx:alpine AS production
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
