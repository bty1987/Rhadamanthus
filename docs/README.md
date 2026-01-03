# Rhadamanthus 文档中心

> 最后更新：2026-01-03

本目录包含 Rhadamanthus ERP 系统的各类技术文档、开发指南和用户手册。

---

## 📚 文档分类

### 📖 [技术文档 (technical/)](./technical/)
包含系统架构、API 接口等技术规范文档。

**文件列表**：
- [API 接口文档](./technical/API.md) - 前后端接口规范、认证流程、分页查询、错误码说明

### 🛠️ [开发指南 (development/)](./development/)
包含模块开发、构建打包等开发相关文档。

**文件列表**：
- [装饰模块 JAR 打包说明](./development/BUILD_DECORATION_MODULE.md) - Decoration 模块编译与打包指南

### ⚡ [性能优化 (optimization/)](./optimization/)
包含系统优化、性能提升相关的文档。

**文件列表**：
- [OSS 图片显示优化](./optimization/OSS_IMAGE_OPTIMIZATION.md) - v2.0 版本优化文档
- [OSS 图片显示简化版](./optimization/OSS_IMAGE_SIMPLIFIED.md) - v3.0 极简版使用指南

### 📖 [使用指南 (user-guide/)](./user-guide/)
包含功能使用说明、操作手册等用户文档。

**文件列表**：
- [文件上传功能使用指南](./user-guide/UPLOAD_GUIDE.md) - OSS 和本地上传配置与使用

### 🔧 [开发工具 (tools/)](./tools/)
包含开发工具、辅助脚本等相关文档。

**文件列表**：
- [Sphinx 文档生成工具](./tools/sphinx/README.md) - Sphinx 自动化文档工具说明

---

## 🎯 快速导航

### 对于新开发者
1. 阅读 [项目主文档](../CLAUDE.md) 了解整体架构
2. 查看 [前端架构文档](../WebContent/CLAUDE.md) 了解前端组织
3. 阅读 [API 接口文档](./technical/API.md) 了解接口规范
4. 参考 [开发指南](./development/) 开始开发

### 对于功能开发
1. 查看对应模块的 CLAUDE.md 文档（位于 `src/com/fanglin/[模块]/CLAUDE.md`）
2. 阅读 [API 接口文档](./technical/API.md) 了解接口调用方式
3. 参考 [使用指南](./user-guide/) 了解最佳实践

### 对于性能优化
1. 阅读 [OSS 图片优化文档](./optimization/) 了解性能提升方案
2. 参考 [技术文档](./technical/) 了解底层实现

---

## 📝 文档贡献

### 文档命名规范
- 使用大写字母和下划线：`FEATURE_NAME.md`
- 避免使用空格和特殊字符
- 文件名应清晰表达文档内容

### 文档分类原则
- **technical/**：技术规范、架构设计、接口文档
- **development/**：开发流程、构建打包、环境配置
- **optimization/**：性能优化、代码重构、最佳实践
- **user-guide/**：功能使用、操作手册、配置说明
- **tools/**：开发工具、脚本说明、辅助工具

---

## 🔗 相关链接

- [项目根文档](../CLAUDE.md)
- [前端架构文档](../WebContent/CLAUDE.md)
- [各模块文档](../src/com/fanglin/)

---

**维护者**：AI 文档管理系统
**更新时间**：2026-01-03
