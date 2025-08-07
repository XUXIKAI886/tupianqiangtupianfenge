# 图片墙图片分割工具 (Image Splitter)

一个基于 Next.js 14 的现代化 Web 应用，可以将图片横向等分为三个部分。支持多种图片格式，提供直观的用户界面和便捷的下载功能。

## ✨ 功能特点

- 🖼️ **多格式支持**: 支持 JPG、PNG、GIF、WebP 等常见图片格式
- ✂️ **智能分割**: 自动将图片横向等分为三个相等的部分
- 👀 **实时预览**: 上传后立即预览原图和分割结果
- 📥 **灵活下载**: 支持单独下载或批量打包下载（ZIP格式）
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🎯 **拖拽上传**: 支持拖拽文件上传，操作更便捷
- ⚡ **性能优化**: 使用 Canvas API 进行高效图片处理
- 🛡️ **错误处理**: 完善的错误边界和用户友好的提示信息

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **图标**: Lucide React
- **图片处理**: Canvas API
- **文件处理**: JSZip, FileSaver
- **部署**: GitHub Pages

## 📦 安装和使用

### 环境要求

- Node.js 18+
- npm 或 yarn

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd image-splitter
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建和部署

1. **构建生产版本**
```bash
npm run build
# 或
yarn build
```

2. **本地预览构建结果**
```bash
npm run start
# 或
yarn start
```

## 🎯 使用说明

1. **上传图片**: 点击上传区域或拖拽图片文件到指定区域
2. **等待处理**: 应用会自动处理图片并显示进度
3. **预览结果**: 查看原图和三个分割后的图片
4. **下载文件**:
   - 单独下载：点击每个分割图片的下载按钮
   - 批量下载：点击"批量下载"按钮获取ZIP文件

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── image-splitter/   # 图片分割相关组件
│   └── ErrorBoundary.tsx # 错误边界组件
├── hooks/                # 自定义 Hooks
│   └── useImageSplitter.ts
├── types/                # TypeScript 类型定义
│   └── index.ts
├── utils/                # 工具函数
│   ├── image-processing.ts # 图片处理
│   └── download.ts       # 下载功能
└── lib/                  # 库文件
    └── utils.ts          # 通用工具
```

## 🔧 配置说明

### GitHub Pages 部署

项目已配置自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 访问 `https://your-username.github.io/repository-name`

### 自定义域名

如需使用自定义域名，请：

1. 在 `public/` 目录下创建 `CNAME` 文件
2. 在文件中添加你的域名
3. 在域名提供商处配置 DNS 记录

## 🛠️ 开发指南

### 添加新功能

1. 在 `src/types/` 中定义相关类型
2. 在 `src/utils/` 中实现核心逻辑
3. 在 `src/components/` 中创建 UI 组件
4. 在 `src/hooks/` 中封装状态管理

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式写法
- 优先使用自定义 Hooks 管理状态

## 🐛 故障排除

### 常见问题

1. **图片上传失败**
   - 检查文件格式是否支持
   - 确认文件大小不超过 10MB

2. **分割结果异常**
   - 确保图片宽度足够（建议 > 300px）
   - 检查图片是否损坏

3. **下载功能不工作**
   - 检查浏览器是否支持 File API
   - 确认没有被广告拦截器阻止

### 性能优化

- 大图片会自动压缩处理
- 使用 Web Workers 处理大文件（未来版本）
- 实现图片懒加载

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持

如有问题或建议，请：

- 提交 [GitHub Issue](../../issues)
- 发送邮件到 [your-email@example.com]

---

⭐ 图片墙图片分割工具 - 呈尚策划运营部出品
