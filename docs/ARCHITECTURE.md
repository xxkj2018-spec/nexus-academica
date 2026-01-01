# Nexus Academica: 生成式路径学习系统架构白皮书

**版本**: 1.3.0 (Full Social & Multi-modal)
**架构师**: Gemini (Chief Architect)

## 一、 核心理念与体验流 (The Concept)
* **知识点** = **游戏关卡 / 小说章节 / 视频 / 数据档案**
* **学习路径** = **探险地图**
* **掌握程度** = **装备与等级**
* **考试** = **BOSS 战**
* **社区** = **冒险者酒馆**

## 二、 技术架构设计 (Technical Architecture)
系统采用 **微服务架构** 配合 **事件驱动** 模式。

### 2.1 数据层：全知图谱 (The Omniscient Graph)
* **Neo4j + Vector DB**: 存储知识依赖关系和用户状态向量。
* **Social Graph**: 存储关注、师徒、组队及路书关系。
* **Asset Graph**: 链接知识点与对应的游戏资产、**文本故事(Stories)**、视频文件、图文数据。

### 2.2 核心引擎层 (Core Engines)
1. **Pathfinder Engine (寻路)**: 规划路径，调整难度。
2. **Genesis Engine (AIGC Core)**:
   * **LLM Orchestrator**: 生成文本、对话、**长篇小说章节**。
   * **Asset Generator**: 生成 3D 场景、图标。
   * **Media Curator (媒体策展人)**: 自动从 Youtube/Bilibili 索引优质教学视频，或调用 Sora/Runway 生成概念演示视频；生成结构化思维导图。
   * **Code Sandbox**: 实时代码环境。
3. **Dungeon Master (DM) Engine**: 游戏逻辑管理。

### 2.3 接口层与客户端 (Interfaces)
* **Web Client**: React/Three.js (支持富文本阅读器组件)。
* **VR/AR Client**: Unity/Unreal。
* **Mobile App**: 侧重于阅读、视频流和图文学习。

### 2.4 社交协作层 (Social & Collaboration Layer)
* **Path Sharing (路书分享)**: 用户可将独特学习路径打包为“路书”发布，支持 Fork。
* **The Tavern (交流广场)**: 知识节点下的微型论坛；支持 Contextual Chat（场景内即时求助）。
* **Mentorship Protocol (师徒协议)**: 师徒系统，通关分红，定制指导。

## 三、 创作者经济与商业模式 (Creator Economy)
*(详细见经济协议文档)*

## 四、 智能体分工构建系统 (Agentic Workflow)
| **智能体代号** | **职责** |
| :--- | :--- |
| **Architect-01** | 维护图谱拓扑正确性。 |
| **Lorekeeper** | 生成世界观、NPC 故事、**撰写知识小说**。 |
| **Artificer** | 生成模型、UI 代码。 |
| **Curator** | 筛选并关联优质的视频/图文/文章素材。 |
| **Pedagogue** | 教学督导，审核知识准确性。 |
| **Economist** | 经济平衡，防止通胀。 |
| **CodeSmith** | 全栈工程师，写代码。 |
| **Bard** | 社区管理，酒馆运营，路书推荐。 |

## 五、 部署与未来升级
* **Hybrid Cloud**: 核心数据私有云，AIGC 公有云。
* **Edge Computing**: 边缘计算降延迟。
* **Open Knowledge Protocol (OKP)**: 允许外部机构接入。
