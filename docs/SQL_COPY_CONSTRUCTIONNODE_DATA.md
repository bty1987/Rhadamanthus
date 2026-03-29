# 复制 constructionnode 数据 SQL 语句

> 创建时间：2026-03-29
> 目的：将 company=1 的 constructionnode 数据复制到 company=77

---

## SQL 语句

```sql
INSERT INTO data.constructionnode (
    name,
    precheck,
    postcheck,
    stacheck,
    fincheck,
    startalk,
    endtalk,
    sstid,
    estid,
    `timeLimit`,
    process,
    sort,
    proset,
    accessoryLimit,
    salaryLimit,
    kino,
    kiname,
    mark,
    status,
    company
)
SELECT
    name,
    precheck,
    postcheck,
    stacheck,
    fincheck,
    startalk,
    endtalk,
    sstid,
    estid,
    `timeLimit`,
    process,
    sort,
    proset,
    accessoryLimit,
    salaryLimit,
    kino,
    kiname,
    mark,
    status,
    77
FROM data.constructionnode
WHERE company = 1;
```

---

## 注意事项

1. ⚠️ **`timeLimit` 字段**：这是 MySQL 保留字，必须用反引号 `` ` `` 包裹
2. ⚠️ **`cnid` 字段**：不需要包含，因为是自增主键，会自动生成
3. ⚠️ **`company` 值**：在 SELECT 中硬编码为 `77`

---

## 验证方法

执行后可以验证数据是否正确复制：

```sql
-- 检查复制的记录数
SELECT COUNT(*) as count FROM data.constructionnode WHERE company = 77;

-- 预期结果：10（与 company=1 的记录数一致）
```

---

## 执行方式

### 方式 1：使用数据库管理工具
- Navicat
- phpMyAdmin
- DBeaver
- MySQL Workbench

直接复制上述 SQL 语句到工具中执行即可。

### 方式 2：使用命令行
```bash
mysql -h rm-2ze6qgdw1vit531v3io.mysql.rds.aliyuncs.com -u username -p data < sql_script.sql
```

---

## 数据说明

- **源数据**：`data.constructionnode` 表中 `company=1` 的记录
- **目标数据**：复制到 `company=77`
- **记录数**：10 条
- **表结构**：21 个字段（不含自增主键 cnid）

---

**创建时间**：2026-03-29
**用途**：数据初始化和同步
