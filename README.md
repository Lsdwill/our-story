# 我们的故事

一个简约浪漫、小清新的旅行照片墙网站。入口固定为：

```text
https://mathai.tech/love.html
```

旅行详情页使用 hash 路由：

```text
https://mathai.tech/love.html#/trip/hangzhou
```

## 本地开发

```bash
npm install
npm run dev
```

然后访问：

```text
http://localhost:5173/love.html
```

## 添加照片和旅行

旅行数据在 `src/data/trips.ts`。照片放在：

```text
public/photos/<slug>/
```

例如：

```text
public/photos/hangzhou/cover.jpg
public/photos/hangzhou/01.jpg
public/photos/hangzhou/02.jpg
```

如果照片文件暂时不存在，页面会显示柔和占位图，不会影响构建。

首页首屏的人物扣图放在：

```text
public/photos/couple-cutout.png
```

这是透明 PNG，页面会把它作为前景人物层，配合后方虚化照片做景深效果。

## 构建

```bash
npm run build
```

构建产物在 `dist/`，其中 `dist/love.html` 是入口文件。

## 部署到服务器

先在服务器安装 Nginx 和 Certbot，并确保 `mathai.tech` 已解析到服务器 IP。

```bash
./scripts/deploy.sh
```

脚本会自动完成：

- 本地执行 `npm run build`
- 上传 `dist/` 到 `/var/www/mathai-love/`
- 上传并安装 `deploy/mathai.tech.remote.conf`
- 备份服务器现有 Nginx 配置
- 执行 `nginx -t` 并 reload Nginx
- 检查线上页面和关键图片是否可访问

默认服务器配置：

```text
SERVER_HOST=24.233.2.106
SERVER_PORT=13608
SERVER_USER=root
DOMAIN=mathai.tech
```

如果要覆盖默认值：

```bash
SERVER_HOST=24.233.2.106 SERVER_PORT=13608 SERVER_USER=root DOMAIN=mathai.tech ./scripts/deploy.sh
```

不要把服务器密码写入仓库或脚本。部署时 SSH 会提示输入密码；更推荐配置 SSH key。
