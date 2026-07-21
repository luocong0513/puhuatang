# AGENTS.md - 蒲华堂项目

## 项目概览
蒲华堂 - 五行康养·戏曲疗愈 Web App，融合中医五行养生、蒲剧戏曲文化与二十四节气智慧。

## 版本技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4 + 自定义新中式水墨风格

## 目录结构
```
├── public/                 # 静态资源
├── src/
│   ├── app/
│   │   ├── globals.css     # 全局样式（宣纸纹理、配色、组件类）
│   │   ├── layout.tsx      # 根布局（HTML shell + 字体）
│   │   └── (app)/          # 应用路由组
│   │       ├── layout.tsx  # 应用壳（Header + TabBar + FavoritesProvider）
│   │       ├── page.tsx    # 首页（品牌区、Hero、输入框、三大入口）
│   │       ├── report/     # 五行报告页（五行图、六大模块卡片）
│   │       ├── opera/      # 戏曲馆（播放器、唱段卡片、科普区）
│   │       ├── solar/      # 节气馆（当前节气、24节气横滑、详情）
│   │       └── profile/    # 我的页面（收藏的报告、歌单、节气提醒）
│   ├── components/
│   │   ├── ui/             # Shadcn UI 组件库
│   │   ├── layout/         # 布局组件（Header、TabBar）
│   │   ├── icons.tsx       # 水墨风格SVG图标集
│   │   └── favorites-context.tsx  # 收藏状态管理 Context
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/
│   │   ├── utils.ts        # 通用工具函数
│   │   ├── five-elements.ts # 五行数据与报告生成逻辑
│   │   ├── lunar-utils.ts  # 农历工具库（基于 solarlunar 真实历法转换）
│   │   ├── solar-terms.ts  # 24节气数据与计算
│   │   └── opera-data.ts   # 蒲剧戏曲数据
│   ├── types/
│   │   └── solarlunar.d.ts # solarlunar 类型声明
│   └── server.ts           # 自定义服务端入口
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 设计规范
详见 DESIGN.md - 新中式水墨风格，配色：宣纸米白#F5F0E8 + 水墨黑#1A1A1A + 朱砂红#C0392B + 竹青#4A6B3A

## 构建与测试命令
- 开发：`pnpm dev`
- 构建：`pnpm build`
- 类型检查：`pnpm ts-check`
- Lint：`pnpm lint`
- 启动：`pnpm start`

## 开发规范
- 仅使用 pnpm 管理依赖
- 严禁 emoji，统一使用 SVG 水墨风格图标
- 全站背景宣纸米白，禁止纯白背景
- 卡片统一 4px 朱砂红左边框
- 按钮最小点击区域 44px
- 移动端优先，最大宽度 768px 居中
- 严禁蓝紫渐变等 AI 默认风格
