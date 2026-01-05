# Rhadamanthus - 方林装饰 ERP 系统

## 📖 文档导航

本项目文档已整理归档至 `docs/` 目录，请查看以下资源：

### 快速开始
- **[项目概览](docs/PROJECT_OVERVIEW.md)** - 项目介绍、架构总览、模块索引
- **[项目知识库](docs/KNOWLEDGE_BASE.md)** - 核心业务规则、技术规范、FAQ、最佳实践
- **[API 接口文档](docs/api/API.md)** - 前后端接口规范与调用示例

### 架构文档
- **[前端架构](WebContent/CLAUDE.md)** - 前端技术栈、组件体系、开发指南
- **[装饰模块构建](docs/architecture/BUILD_DECORATION_MODULE.md)** - 装饰订单模块架构

### 开发指南
- **[OSS 图片优化](docs/guides/OSS_IMAGE_OPTIMIZATION.md)** - 阿里云 OSS 图片处理优化指南
- **[OSS 简化方案](docs/guides/OSS_IMAGE_SIMPLIFIED.md)** - OSS 图片上传简化方案
- **[文件上传指南](docs/guides/UPLOAD_GUIDE.md)** - 文件上传功能开发指南

### 数据库
- **SQL 脚本** - 数据库初始化与迁移脚本位于 `docs/sql/`

### 技术栈
- **后端**: Spring 4.3.17 + Struts2 2.5.16 + Hibernate 3
- **数据库**: MySQL
- **前端**: Ace Admin + jQuery + LayUI
- **部署**: Tomcat 7.0.88

---

## 🚀 快速启动

1. 配置数据库连接 `conf/jdbc.properties`
2. 部署到 Tomcat 容器
3. 访问 `http://localhost:8080/Rhadamanthus/login.html`

---

## 📚 模块文档

各模块详细文档位于 `src/com/fanglin/[模块]/CLAUDE.md`，涵盖：
- 核心业务模块（装饰订单、报价、施工、结算等）
- 基础设施模块（系统管理、审批流程、人事薪资等）
- 集成模块（支付、微信、商城、电子签等）

详细索引请查看 [项目概览](docs/PROJECT_OVERVIEW.md)。

---

> **提示**: 建议从 [项目知识库](docs/KNOWLEDGE_BASE.md) 开始了解项目的核心规范和最佳实践。
