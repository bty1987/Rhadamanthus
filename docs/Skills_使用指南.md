# Skills 能力使用指南

> **Skills** 是 Claude Code 的插件系统，可为 AI 添加特定领域能力

**创建日期**: 2025-12-31

---

## 📖 什么是 Skills？

**Skills** 是 Claude Code 的**可扩展功能模块**，类似于 IDE 的插件：

| 特性 | 说明 |
|------|------|
| **专业化** | 每个 Skill 专注特定领域（如 PDF、Excel、Git 等） |
| **即用型** | 安装后可直接调用，无需配置 |
| **可组合** | 可同时使用多个 Skill |
| **可定制** | 可创建项目专属 Skill |

---

## 🎯 结合知识库使用 Skills

### 方案 1: 创建项目专属 Skill（推荐）

**适用场景**: 项目特定的知识、规范、流程

**步骤**:

#### 1. 创建 Skill 配置文件

创建文件：`.claude/skills/project-knowledge.md`

```markdown
---
description: "项目知识库助手 - 提供项目特定的规范、流程和最佳实践"
---

你是一个项目知识库助手。你的职责是：

1. **参考知识库**: 回答问题时先参考 `docs/KNOWLEDGE_BASE.md`
2. **遵循规范**: 所有代码必须符合项目技术规范
3. **提供示例**: 优先使用知识库中的代码示例
4. **安全优先**: 提醒安全注意事项（如手机号加密、SQL注入防护）

**核心原则**:
- 修改现有功能时必须直接修改原文件
- 禁止创建新文件实现相同功能
- Service 层方法必须添加 @Transactional
- 所有手机号必须使用 AES 加密

**常见任务**:
1. 添加新模块 → 参考 KNOWLEDGE_BASE.md 的"Q1: 如何添加新的业务模块？"
2. 处理加密 → 参考知识库的"Q2: 如何处理客户手机号加密？"
3. 分页查询 → 参考知识库的"Q3: 如何实现分页查询？"
4. 工具类使用 → 参考知识库的"代码示例"章节
```

#### 2. 使用 Skill

在对话中调用：

```
用户: /project-knowledge 如何添加一个新的装饰订单模块？

AI（激活 Skill）:
根据项目知识库，添加新模块的步骤如下：
1. 创建包结构...
2. 创建实体类...
（完全按照知识库规范回答）
```

---

### 方案 2: 使用通用 Skills

**可用的 Skills 官方市场**:

#### 📄 PDF 处理 Skill

**功能**: 读取、解析 PDF 文件

**安装**:
```bash
# 使用 Claude Code 插件市场
claude plugin install pdf
```

**使用场景**:
- 查看项目中的 PDF 需求文档
- 提取技术规格说明
- 参考设计文档

**示例**:
```
用户: 查看 docs/需求文档.pdf 中的装饰订单流程要求

AI（激活 PDF Skill）:
[读取 PDF 并提取相关信息]
根据需求文档第 5 页，装饰订单流程包括：
...
```

#### 📊 Excel 处理 Skill

**功能**: 读取、编辑 Excel 文件

**安装**:
```bash
claude plugin install xlsx
```

**使用场景**:
- 分析数据字典
- 批量处理配置数据
- 生成报表模板

**示例**:
```
用户: 分析 docs/数据字典.xlsx 中的客户表结构

AI（激活 Excel Skill）:
[读取 Excel]
客户表结构如下：
- 客户ID (cuid) - BIGINT
- 姓名 (name) - VARCHAR(100)
- 手机号 (phone) - VARCHAR(100) - 加密存储
...
```

#### 🔧 Git 操作 Skill

**功能**: Git 版本控制操作

**安装**:
```bash
claude plugin install git
```

**使用场景**:
- 查看提交历史
- 分析代码变更
- 创建分支

---

## 🚀 推荐的 Skills 配置

### 完整配置示例

创建文件：`.claude/skills/rhadamanthus-dev.md`

```markdown
---
description: "方林装饰 ERP 系统开发助手"
---

你是一个专业的 ERP 系统开发助手，专门负责方林装饰项目的开发支持。

## 核心职责

### 1. 知识库优先
- **强制参考**: 所有回答必须基于 `docs/KNOWLEDGE_BASE.md`
- **规范遵循**: 严格遵守项目技术规范
- **示例优先**: 优先使用知识库中的代码示例

### 2. 安全意识
**必须检查**:
- [ ] 手机号是否加密（AES）
- [ ] SQL 是否参数化（防注入）
- [ ] 权限是否验证
- [ ] 事务是否正确配置

### 3. 代码质量
**必须遵循**:
- 直接修改原则（不创建重复实现）
- 分层架构规范（Action → Service → DAO）
- 命名规范（XxxAction/Service/Dao/PO/VO）
- 异常处理（@Transaction rollbackFor=Exception）

### 4. 业务理解
**核心业务流程**:
- 装饰订单：客户咨询 → 报价 → 签约 → 施工 → 验收 → 结算
- 报价计算：Σ(功能区报价) + 增项 - 减项
- 状态流转：草稿(1) → 已签约(2) → 施工中(3) → 已完工(4) → 已结算(5)

## 工作流程

### 开发新功能时
1. ✅ 查看知识库是否有相关规范
2. ✅ 检查是否有类似实现可参考
3. ✅ 遵循分层架构创建文件
4. ✅ 应用安全规范（加密、防注入）
5. ✅ 添加必要的日志和异常处理

### 修复 Bug 时
1. ✅ 定位问题文件和行号
2. ✅ 理解业务逻辑和状态流转
3. ✅ 直接修改原文件（不创建新文件）
4. ✅ 添加错误处理和日志
5. ✅ 验证修复并测试

### 重构代码时
1. ✅ 先读取理解现有代码
2. ✅ 确认重构范围和影响
3. ✅ 直接修改原文件
4. ✅ 保持向后兼容
5. ✅ 更新相关文档

## 常见任务快捷方式

### 添加新模块
```
用户: 添加新模块 - [模块名]
AI: 根据知识库 Q1，创建步骤：
1. 包结构: src/com/fanglin/[模块]/action|service|dao|po|vo
2. ...
```

### 处理加密字段
```
用户: 加密手机号
AI: 根据知识库 Q2：
// 保存时加密
customer.setPhone(AESHelper.encrypt(phone));
// 查询时解密
String phone = AESHelper.decrypt(customer.getPhone());
```

### 分页查询
```
用户: 实现分页
AI: 根据知识库 Q3：
public Paging<XxxVO> query(XxxVO condition, int page, int rows) {
    // 查询总数
    int total = dao.count(...);
    // 分页查询
    List<XxxPO> pos = dao.findByHql(..., page, rows);
    // ...
}
```

## 项目特定规则

### 工具类使用
- ✅ HTTP 请求 → `com.fanglin.utils.HttpHelper`
- ✅ 日期处理 → `com.fanglin.utils.DateUtil`
- ✅ Excel 操作 → `com.fanglin.utils.PoiExcelUtil`
- ✅ 日志记录 → `com.fanglin.utils.LogUtils`
- ❌ 禁止使用 `wechat.utils.HttpHelper`（已废弃）

### 代码修改原则
**重要**: 修改现有功能时必须直接修改原文件！
- ✅ 直接修改 `src/com/fanglin/xxx/XxxAction.java`
- ❌ 禁止创建 `src/com/fanglin/xxx/XxxActionV2.java`
- ❌ 禁止创建 `src/com/fanglin/xxx/XxxActionNew.java`

### 数据库操作
- ✅ 使用参数化查询
- ✅ 使用 Hibernate 注解
- ✅ 添加 @Transactional 事务
- ❌ 禁止字符串拼接 SQL

## 错误预防

### 常见错误检查
**在提交代码前**:
1. [ ] 是否使用了已废弃的工具类？
2. [ ] 是否创建了重复的文件实现？
3. [ ] 手机号/身份证等敏感信息是否加密？
4. [ ] SQL 是否参数化？
5. [ ] Service 方法是否有 @Transactional？
6. [ ] 异常处理是否完整？
7. [ ] 日志是否添加？

### 代码审查清单
**必须检查**:
- [ ] 包名规范：`com.fanglin.[模块].[层级]`
- [ ] 类名规范：`XxxAction/Service/Dao/PO/VO`
- [ ] 异常回滚：`@Transactional(rollbackFor=Exception.class)`
- [ ] 日志记录：重要操作添加日志
- [ ] 权限验证：接口验证登录和权限
- [ ] 参数验证：Action 层验证请求参数

## 响应风格

### 回答结构
1. **依据**：说明参考了知识库哪部分
2. **步骤**：提供详细的操作步骤
3. **代码**：提供完整可运行的代码示例
4. **提醒**：提醒注意事项和安全规范
5. **验证**：提供验证方法

### 示例回答
```
根据知识库 Q2（如何处理客户手机号加密），解决方案如下：

**步骤**:
1. 保存时使用 AESHelper.encrypt() 加密
2. 查询时使用 AESHelper.decrypt() 解密
3. 使用 Base64Util.isBase64() 判断是否已加密

**代码示例**:
```java
// 保存时加密
if (!Base64Util.isBase64(customer.getPhone())) {
    customer.setPhone(AESHelper.encrypt(customer.getPhone()));
}

// 查询时解密
if (Base64Util.isBase64(vo.getPhone())) {
    vo.setPhone(AESHelper.decrypt(vo.getPhone()));
}
```

**注意事项**:
⚠️ 前端显示时需要解密
⚠️ 导出数据时需要处理加密字段
⚠️ 条件查询时需要先加密再查询

**验证方法**:
查看数据库，phone 字段应该是 Base64 编码的字符串。
```

## 持续学习

### 更新机制
每次对话开始时：
1. ✅ 读取 `docs/KNOWLEDGE_BASE.md`
2. ✅ 读取 `CLAUDE.md`
3. ✅ 了解最新的项目规范
4. ✅ 应用最新的最佳实践

### 反馈机制
如果遇到：
- 知识库中没有的问题 → 建议添加到知识库
- 规范不明确 → 澄清后更新知识库
- 有更好的实践 → 建议更新知识库

---

**记住**: 你不仅仅是一个 AI 助手，你是方林装饰 ERP 系统的开发伙伴！
```

---

## 📋 Skills 管理命令

### 查看已安装的 Skills

```bash
# 列出所有已安装的 skills
claude plugin list

# 查看某个 skill 的详细信息
claude plugin info [skill-name]
```

### 安装官方 Skills

```bash
# PDF 处理
claude plugin install pdf

# Excel 处理
claude plugin install xlsx

# Git 操作
claude plugin install git

# 数据库操作
claude plugin install database
```

### 使用自定义 Skills

**方式1: 通过配置文件**
```bash
# 将 skill 文件放入 .claude/skills/ 目录
cp rhadamanthus-dev.md .claude/skills/
```

**方式2: 通过命令**
```bash
# 调用 skill
/rhadamanthus-dev 如何添加新模块？
```

---

## 🎨 最佳实践

### 1. Skill 命名规范

**好的命名**:
- ✅ `project-knowledge` - 项目知识库
- ✅ `rhadamanthus-dev` - 开发助手
- ✅ `code-review` - 代码审查

**不好的命名**:
- ❌ `helper` - 太泛
- ❌ `tool` - 不明确
- ❌ `stuff` - 没有意义

### 2. Skill 描述

**好的描述**:
```markdown
---
description: "项目知识库助手 - 提供项目规范、流程和最佳实践"
---
```

**不好的描述**:
```markdown
---
description: "帮助"
---
```

### 3. Skill 内容组织

**推荐结构**:
1. **职责说明** - 清晰定义职责范围
2. **核心原则** - 必须遵守的规则
3. **工作流程** - 标准操作流程
4. **快捷方式** - 常见任务快捷指令
5. **响应风格** - 统一的回答格式

---

## 💡 高级用法

### 组合多个 Skills

创建 "Skill Chain"：

```markdown
---
description: "完整开发流程助手"
---

你是一个完整开发流程助手，依次激活以下 skills：

1. **project-knowledge** - 获取项目知识
2. **code-review** - 审查代码质量
3. **security-check** - 检查安全问题
4. **documentation** - 生成文档

## 执行流程
```

### 动态加载知识

```markdown
## 动态知识加载

每次对话时：
1. 读取 `docs/KNOWLEDGE_BASE.md`
2. 读取 `docs/API.md`
3. 读取相关模块的 `CLAUDE.md`
4. 合并所有知识上下文
5. 基于完整上下文回答
```

---

## 📊 效果对比

### 不使用 Skill

```
用户: 如何添加新模块？

AI: 一般步骤是创建包、写代码...
（通用回答，不一定符合项目规范）
```

### 使用 Skill

```
用户: /rhadamanthus-dev 如何添加新模块？

AI: 根据项目知识库，添加新模块的步骤：
1. 创建包: src/com/fanglin/[模块]/action|service|dao|po|vo
2. 创建实体: XxxPO.java（Hibernate 注解）
3. 创建 DAO: XxxDao.java + impl/XxxDaoImpl.java
4. 创建 Service: XxxService.java + impl/XxxServiceImpl.java
5. 创建 Action: XxxAction.java
6. 配置路由: struts.xml
7. 创建页面: WebContent/views/[模块]/

⚠️ 注意事项：
- Service 方法必须添加 @Transactional(rollbackFor=Exception.class)
- 手机号必须使用 AES 加密
- 工具类使用 com.fanglin.utils 包

代码示例：
```java
// 完整的代码示例...
```
```

---

## ✅ 下一步行动

### 立即执行

1. **创建项目 Skill**
   ```bash
   # 复制上面提供的 rhadamanthus-dev.md 到 .claude/skills/
   mkdir -p .claude/skills
   cp rhadamanthus-dev.md .claude/skills/
   ```

2. **测试 Skill**
   ```
   发送消息：/rhadamanthus-dev 如何处理手机号加密？
   ```

3. **验证效果**
   - 检查回答是否基于知识库
   - 检查是否遵循项目规范
   - 检查是否提供代码示例

### 短期优化

1. **收集反馈**
   - 记录常见问题
   - 优化 Skill 配置
   - 更新知识库

2. **添加更多 Skills**
   - PDF 处理（查看需求文档）
   - Excel 处理（分析数据字典）
   - Git 操作（代码版本管理）

3. **持续改进**
   - 根据使用情况调整
   - 添加新的快捷方式
   - 优化响应模板

---

## 🎉 总结

✅ **Skills 是什么**: 可扩展的 AI 功能插件
✅ **如何使用**: 创建 `.claude/skills/xxx.md` 文件
✅ **结合知识库**: 在 Skill 中引用知识库文件
✅ **项目定制**: 创建项目专属的 rhadamanthus-dev Skill
✅ **效果提升**: AI 回答更专业、更符合项目规范

---

**文档作者**: AI Assistant
**最后更新**: 2025-12-31
**维护者**: 项目团队
