# Nexus Academica 开发与贡献指南

👋 欢迎来到 Nexus Academica 建设者社区！

我们正在构建一张对抗“技术焦虑”的全知地图。我们需要你的帮助来点亮地图上的每一个节点。不管你是想修复一个 Bug，还是想设计一个全新的“量子力学”副本，我们都极度欢迎。

---

## 🌟 你的角色 (Roles)

在 Nexus 中，贡献者主要分为三类。请找到适合你的角色：

### 1. 👾 代码游侠 (Code Contributor)
* **技能**: React, Three.js, Node.js, Python, AI API 调用。
* **任务**: 优化前端交互、改进寻路算法、修复 Bug、开发核心引擎。
* **入口**: 查看 GitHub Issues 中标记为 `bug` 或 `enhancement` 的任务。

### 2. ✍️ 内容造物主 (Content Creator / Storyteller)
* **技能**: 对最新 AI 技术（Sora, Gemini, Agent）有敏锐嗅觉，或擅长创意写作、视频制作。
* **任务**: 
    * **技术策展**: 发现新工具？第一时间提交 PR 更新 `nodes.json`，点亮新节点。
    * **传说编写**: 编写寓教于乐的小说章节或互动故事（例如：用侦探破案的故事讲解逻辑门电路）。
    * **视频制作**: 制作 3 分钟精讲视频。
    * **游戏设计**: 配置互动关卡 JSON 数据。
* **注意**: 你不需要精通代码！只需修改 `src/data/nodes/` 下的 JSON 或 Markdown 配置文件即可创造新世界。

### 3. 🎓 知识守门人 (Reviewer / Teacher)
* **技能**: 特定学科专业知识。
* **任务**: 审核提交的新技术是否真实有效，剔除营销号式的垃圾信息，确保不会误人子弟。
* **操作**: 在 Pull Request 中进行 Review 并留言。

---

## 🛠️ 技术栈 (Tech Stack)

我们力求保持技术栈的现代与轻量：

* **前端框架**: React 18 + Vite
* **语言**: JavaScript / TypeScript
* **样式**: Tailwind CSS
* **3D 引擎**: React Three Fiber (Three.js)
* **图标**: Lucide React
* **AI 接口**: 调用 OpenAI/Gemini/Claude API (需自行配置 Key)

---

## ⚡ 工作流 (Workflow)

我们采用标准的 GitHub 开源协作流程：

1.  **Fork 项目**: 点击右上角的 Fork 按钮，将仓库复制到你自己的账号下。
2.  **创建分支**: `git checkout -b feature/my-new-feature`
3.  **提交代码**: 请确保代码风格整洁。
4.  **发起 PR**: 在 GitHub 页面点击 "New Pull Request"。

---

## 💡 贡献建议 (Tips)

1.  **从小事做起**: 如果你是第一次参与，可以先尝试修改一个错别字。
2.  **善用 AI**: 我们鼓励使用 Cursor、ChatGPT 等工具辅助写代码或写故事。但请务必**测试/通读** AI 生成的内容。
3.  **在 Discord 交流**: 加入我们的 Discord 社区，不要闷头开发。

---

**感谢你加入这场重塑教育的冒险。让我们一起构建未来！**
