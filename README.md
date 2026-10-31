# 深空当铺：鉴定手册 (Deep Space Pawnshop: Appraisal Manual)

一个轻量、现代化的深空物品估价与成色评估单页应用（SPA）。通过多维度检查点（材质、成色磨损、批次/工厂编号、配件等）以及组合加成规则，实时计算当品回收与鉴定的最终估价。

## ✨ 特性

- **实时估价计算**：选择不同检查项即时预览价格变动、底价保护与组合加成。
- **丰富的检查项类型**：支持单选、多选（含排他选项）以及批次/编号输入等检查点。
- **组合奖励规则**：满足特定组合条件时触发额外加成/折扣奖励。
- **现代化 UI**：基于 Tailwind CSS 打造的暗黑未来感风格，支持响应式布局。
- **单文件打包**：基于 `vite-plugin-singlefile` 打包为单个独立的 HTML 文件，便于离线查阅或静态托管。
- **GitHub Pages 友好**：打包产物默认输出至 `docs` 目录，可一键通过 GitHub Pages 发布。

## 🛠️ 技术栈

- **框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **打包插件**：[vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)

## 🚀 本地开发与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地开发服务

```bash
npm run dev
```

启动后可在浏览器中打开本地地址（默认 `http://localhost:5173`）进行实时预览。

### 3. 构建打包

```bash
npm run build
```

打包完成后，构建产物将自动生成到根目录的 **`docs/`** 文件夹中（内含 `index.html` 与 `.nojekyll`）。

### 4. 本地预览打包产物

```bash
npm run preview
```

---

## 🌐 部署到 GitHub Pages

该项目已配置直接通过仓库分支的 `/docs` 目录进行静态托管：

1. 执行打包命令：
   ```bash
   npm run build
   ```
2. 提交并将代码推送至 GitHub 仓库：
   ```bash
   git add .
   git commit -m "build: update docs for github pages"
   git push origin main
   ```
3. 在 GitHub 仓库页面中开启 Pages：
   - 打开 **Settings** -> **Pages**
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择 `main`（或你当前的分支），目录选择 **/docs**
   - 点击 **Save**，稍等片刻即可访问生成的在线页面。
