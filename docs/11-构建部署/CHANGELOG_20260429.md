# 2026-04-29 变更记录

## 一、DecorationAddition 新增 brokerFlag 字段

> 提交: `6d050772`

在 `decorationaddition` 表中新增经纪人标识字段，用于区分订单是否来源于经纪人渠道。

### 数据模型变更

| 文件 | 变更 |
|------|------|
| `src/com/fanglin/decoration/po/DecorationAdditionPO.java` | 新增 `private short brokerFlag` + `@Column` + getter/setter + `ptv()` 回写 |
| `src/com/fanglin/decoration/vo/DecorationVO.java` | 新增 `private Short brokerFlag` + getter/setter |

### DDL（待执行）

```sql
ALTER TABLE decoration.decorationaddition ADD COLUMN brokerFlag smallint DEFAULT 0;
```

### 字段语义

- `brokerFlag = 0` — 非经纪人（默认）
- `brokerFlag = 1` — 经纪人来源

---

## 二、DecorationBelong ccid 更改

> 提交: `c501f656`

确认 DecorationBelong 的 ccid（公司ID）相关更改已完成并推送。

---

## 三、特权购 paymenttype atttype=1 数据生成

> 提交: `ab054938`
> 文件: `sqls/insert_paymenttype_tequangou_atttype1.sql`

### 背景

生产库 `data.paymenttype` 中已存在 `ptid=4307, name=特权购, atttype=0, company=0` 的记录。
需要为 96 个公司（cid 0~95）各生成一条 `atttype=1` 的特权购记录。

### 生产库查询

```sql
-- 查询特权购原始记录
SELECT ptid, name, atttype, company FROM data.paymenttype WHERE name = '特权购';
-- 结果: ptid=4307, name=特权购, atttype=0, company=0

-- 查询公司数量
SELECT COUNT(*) FROM company.company;
-- 结果: 96 个公司 (cid 0~95)
```

### 生成结果

96 条 INSERT 语句，格式：
```sql
INSERT INTO data.paymenttype (name, atttype, company) VALUES ('特权购', 1, N);
```

### 状态

- SQL 脚本已提交 git
- **尚未在生产库执行**（`fanglin1918` 用户为只读，需要写权限用户执行）

---

## 四、pageQuotationAssignRequest JSONException 修复

> 提交: `782a3163`, `3c17fc5b`
> 详细文档: [QUOTATION_ASSIGN_REQUEST_FIX.md](QUOTATION_ASSIGN_REQUEST_FIX.md)

修复报价预算分配请求页面 JSON 序列化异常。详见独立文档。
