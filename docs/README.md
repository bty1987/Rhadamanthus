# Rhadamanthus 文档中心

> 最后更新：2026-01-03

本目录包含 Rhadamanthus 系统的所有文档资料，按照功能分类组织。

---

## 📚 文档分类

### 📋 API 文档 (`api/`)
前后端接口规范、调用示例、错误码说明
- **[API 接口文档](api/API.md)** - 统一的请求/响应格式、认证流程、分页查询规范

### 📖 使用指南 (`guides/`)
功能使用指南、最佳实践、操作教程
- **[文件上传指南](guides/UPLOAD_GUIDE.md)** - 文件上传操作规范与配置说明
- **[OSS 图片优化指南](guides/OSS_IMAGE_OPTIMIZATION.md)** - 阿里云 OSS 图片处理与优化方案
- **[OSS 图片简化方案](guides/OSS_IMAGE_SIMPLIFIED.md)** - 图片上传简化实现方案

### 🏗️ 架构文档 (`architecture/`)
系统架构设计、模块构建说明
- **[装饰模块构建文档](architecture/BUILD_DECORATION_MODULE.md)** - 装饰订单模块的构建与实现

### 🔧 故障排查 (`troubleshooting/`)
常见问题解决方案、错误排查指南
> *暂无文档*

### 📖 Sphinx 文档系统 (`sphinx/`)
使用 Sphinx 构建的规范化文档系统（包含 RST 格式文档）
- **[标准规范](sphinx/standard.rst)** - 开发标准与规范
- **[错误码参考](sphinx/error.rst)** - 完整的错误码列表
- **[格式规范](sphinx/format.rst)** - 代码格式规范
- **[日志规范](sphinx/log.rst)** - 日志记录规范
- **[检查规则](sphinx/check_rule.rst)** - 代码检查规则

### 💾 SQL 脚本 (`sql/`)
数据库脚本、初始化 SQL、迁移脚本

---

## 🗂️ 根级文档

项目根目录下的文档：
- **[CLAUDE.md](../CLAUDE.md)** - 项目主文档（AI 上下文配置）
  - 项目愿景与技术栈
  - 模块索引与依赖关系
  - 开发规范与编码标准
  - AI 使用指引

---

## 🔍 快速导航

### 按角色查看文档

**新入职开发人员**
1. 阅读 [CLAUDE.md](../CLAUDE.md) 了解项目整体架构
2. 查看 [sphinx/standard.rst](sphinx/standard.rst) 学习开发规范
3. 阅读 [api/API.md](api/API.md) 了解接口调用方式
4. 根据模块查看对应的 `src/com/fanglin/[模块]/CLAUDE.md`

**前端开发人员**
1. 阅读 [WebContent/CLAUDE.md](../WebContent/CLAUDE.md) 了解前端架构
2. 查看 [api/API.md](api/API.md) 了解接口规范
3. 参考 [guides/UPLOAD_GUIDE.md](guides/UPLOAD_GUIDE.md) 实现文件上传

**后端开发人员**
1. 阅读 [CLAUDE.md](../CLAUDE.md) 了解分层架构与模块划分
2. 学习 [sphinx/standard.rst](sphinx/standard.rst) 遵循开发规范
3. 查看对应模块的 `CLAUDE.md` 了解业务逻辑

**运维人员**
1. 查看 [CLAUDE.md](../CLAUDE.md) 的环境要求章节
2. 参考 [sphinx/error.rst](sphinx/error.rst) 了解错误码含义
3. 查看 [sphinx/log.rst](sphinx/log.rst) 了解日志规范

---

## 📝 文档维护

### 添加新文档时的分类建议

**API 接口相关** → `api/`
- 接口规范、认证方式、数据格式

**使用教程/指南** → `guides/`
- 功能使用说明、操作步骤、最佳实践

**架构设计文档** → `architecture/`
- 系统设计、模块构建、技术方案

**问题排查** → `troubleshooting/`
- 常见错误、解决方案、调试方法

**规范化文档** → `sphinx/`
- 编码规范、标准流程、检查规则

### 文档命名规范
- 使用大写字母和下划线：`FEATURE_NAME.md`
- 中文文档使用拼音或英文：`UPLOAD_GUIDE.md`
- 保持命名简洁且具有描述性

---

## 🔗 相关资源

- **项目知识库**: [docs/KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md)（如已创建）
- **前端文档**: [WebContent/CLAUDE.md](../WebContent/CLAUDE.md)
- **模块文档**: 各模块目录下的 `CLAUDE.md`（共 28 个模块）

---

*文档维护：方林装饰技术团队*
