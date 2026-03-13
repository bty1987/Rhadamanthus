# Rhadamanthus - 辅助工具手册

> 最后更新：2026-03-11

---

## 📚 概述

本文档集中管理 Rhadamanthus 项目中所有开发辅助工具的使用方法，帮助开发者快速查阅和使用各类工具，提高开发效率。

**工具分类**：
- 🗄️ **数据库工具** - 数据查询、结构分析、数据迁移
- 🔧 **代码生成工具** - 实体生成、代码模板、自动化脚本
- 🧪 **测试工具** - 单元测试、接口测试、性能测试
- 🚀 **部署工具** - 构建脚本、部署配置、环境管理

---

## 🗄️ 数据库工具

### 1. 数据库查询工具

**用途**: 直接查询生产/测试环境数据库，支持只读安全模式

**文件位置**: `.claude/skills/`

**核心文件**:
- `simple_query.py` - 简化查询工具（推荐）
- `db_query.py` - 完整查询工具
- `db_config.ini` - 环境配置
- `DB_QUERY_README.md` - 完整文档

**环境配置**:

| 环境标识 | 名称 | 主机地址 | 权限 |
|---------|------|---------|------|
| `prod` | 生产环境 | rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com | 只读 |
| `test` | 测试环境 | rm-2ze6qgdw1vit531v3io.mysql.rds.aliyuncs.com | 读/写 |

**使用方法**:

```bash
# 格式
D:/Python/Python38/python.exe .claude/skills/simple_query.py [环境] [SQL] [数据库]

# 示例 1：查看所有数据库
D:/Python/Python38/python.exe .claude/skills/simple_query.py prod "SHOW DATABASES"

# 示例 2：查看指定数据库的表
D:/Python/Python38/python.exe .claude/skills/simple_query.py prod "SHOW TABLES" decoration

# 示例 3：查询数据（带 LIMIT）
D:/Python/Python38/python.exe .claude/skills/simple_query.py prod "SELECT * FROM decorationorder LIMIT 5" decoration

# 示例 4：统计查询
D:/Python/Python38/python.exe .claude/skills/simple_query.py prod "SELECT COUNT(*) FROM customer" customer

# 示例 5：查询测试环境
D:/Python/Python38/python.exe .claude/skills/simple_query.py test "SHOW DATABASES"
```

**安全特性**:
- ✅ 自动拦截写入操作（INSERT/UPDATE/DELETE）
- ✅ 仅允许只读 SQL（SELECT/SHOW/DESCRIBE）
- ✅ 默认连接生产环境（只读账户）

**完整文档**: [`.claude/skills/DB_QUERY_README.md`](.claude/skills/DB_QUERY_README.md)

---

### 2. 其他数据库工具

#### 数据结构对比工具
- **文件**: `.claude/skills/compare_company.py`
- **用途**: 对比不同环境的数据结构差异

#### 数据库 Schema 文档
- **文件**: `.claude/skills/db-schema.md`
- **用途**: 数据库表结构参考文档

---

## 🔧 代码生成工具

### Java 查询工具
- **文件**: `.claude/skills/DBQueryTool.java`
- **用途**: Java 版本的数据库查询工具
- **使用场景**: 需要在 Java 代码中集成查询功能时参考

---

## 🧪 测试工具

### 当前状态
项目目前暂无独立的测试工具配置，主要依赖手工功能测试。

**建议增强** (参见 `CLAUDE.md` - 测试策略):
1. JUnit 单元测试
2. Service 层 Mock 测试
3. Selenium/TestCafe UI 自动化测试

---

## 🚀 部署工具

### 构建脚本
项目使用传统的 Eclipse + Tomcat 部署方式，暂无自动化构建脚本。

**手动部署步骤**:
1. 导出项目为 WAR 包
2. 部署到 Tomcat webapps 目录
3. 启动 Tomcat 服务

---

## 📖 常用查询示例

### 数据库探索

```sql
-- 查看所有数据库
SHOW DATABASES

-- 查看指定数据库的表
SHOW TABLES FROM decoration

-- 查看表结构
DESCRIBE decoration.decorationorder
```

### 业务数据查询

```sql
-- 统计订单数量
SELECT COUNT(*) as total FROM decoration.decorationorder WHERE status != 4

-- 查看最近订单
SELECT * FROM decoration.decorationorder
ORDER BY createtime DESC
LIMIT 10

-- 查看客户信息
SELECT * FROM customer.customer
LIMIT 10

-- 查看施工项目
SELECT * FROM construction.construction
WHERE status = 1
```

### 数据分析查询

```sql
-- 订单状态分布
SELECT status, COUNT(*) as count
FROM decoration.decorationorder
GROUP BY status

-- 客户来源统计
SELECT source, COUNT(*) as count
FROM customer.customer
GROUP BY source

-- 最新 10 个装饰订单
SELECT do.deoid, c.cusname, do.address, do.status, do.createtime
FROM decoration.decorationorder do
LEFT JOIN customer.customer c ON do.cusid = c.cusid
ORDER BY do.createtime DESC
LIMIT 10
```

---

## 🔍 工具使用技巧

### 1. 数据库查询最佳实践

**✅ 推荐做法**:
- 始终使用 `LIMIT` 限制返回行数
- 优先查询生产环境（只读模式更安全）
- 使用 `DESCRIBE` 先了解表结构
- 复杂查询使用 `EXPLAIN` 分析性能

**❌ 避免做法**:
- 不要在没有 WHERE 条件时查询大表
- 不要在生产环境执行 JOIN 大表操作
- 不要尝试写入操作（会被自动拦截）

### 2. Python 版本兼容性

系统默认 Python 为 2.7，使用 Python 3.8+ 调用工具：
```bash
# Windows
D:/Python/Python38/python.exe .claude/skills/simple_query.py [参数]

# Linux/Mac
python3 .claude/skills/simple_query.py [参数]
```

### 3. 环境选择建议

| 使用场景 | 推荐环境 | 原因 |
|---------|---------|------|
| 查询生产数据 | `prod` | 数据最新，只读安全 |
| 测试 SQL 语句 | `test` | 可随意测试，支持写入 |
| 验证新功能 | `test` | 不影响生产环境 |
| 数据分析统计 | `prod` | 基于真实生产数据 |

---

## 🛠️ 工具维护指南

### 添加新工具

当添加新的辅助工具时，请按以下步骤更新本文档：

1. **工具分类** - 确定工具所属分类（数据库/代码生成/测试/部署）
2. **文档说明** - 创建对应的使用文档
3. **更新索引** - 在本文档中添加工具说明
4. **更新主文档** - 在 `CLAUDE.md` 中引用新工具

### 文档结构模板

```markdown
### 工具名称

**用途**: 简要描述工具功能

**文件位置**: 工具所在路径

**核心文件**:
- `file1` - 文件说明
- `file2` - 文件说明

**使用方法**:
\```bash
命令示例
\```

**完整文档**: [链接]
```

---

## 📞 问题排查

### 常见问题

#### Q1: Python 版本错误
**症状**: `SyntaxError: invalid syntax`

**解决方案**:
```bash
# 使用 Python 3.8+
D:/Python/Python38/python.exe .claude/skills/simple_query.py [参数]
```

#### Q2: 数据库连接失败
**症状**: `Can't connect to MySQL server`

**检查项**:
1. 网络连接是否正常
2. 数据库地址是否正确
3. 防火墙是否允许连接

#### Q3: SQL 语句被拦截
**症状**: 查询被拒绝执行

**原因**: 工具默认拦截写入操作

**解决方案**: 使用只读 SQL（SELECT/SHOW/DESCRIBE）

---

## 📝 更新日志

### 2026-03-11
- ✅ 创建辅助工具手册
- ✅ 整理数据库查询工具完整说明
- ✅ 添加常用查询示例
- ✅ 建立工具维护规范

---

## 🔗 相关文档

- **[项目主文档](./CLAUDE.md)** - 项目架构与开发规范
- **[数据库工具完整文档](.claude/skills/DB_QUERY_README.md)** - 数据库查询工具详细说明
- **[前端架构文档](./WebContent/CLAUDE.md)** - 前端开发指南
- **[API 接口文档](./docs/API.md)** - 前后端接口规范

---

*本文档由 Claude AI 维护，如有问题或建议，请及时更新*
