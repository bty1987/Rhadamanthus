# 生产待执行 SQL 清单(2026-11-01 核对版)

> 依据:2026-11-01 对近 5 周 sqls/ 全量对照生产只读库核验。
> 原盘点 8 项,复核后 **23号补回(addDuty/updateDutyForStatus)确认已执行**(oid 1718/1719 在,through=0/type=0/moduleId NULL 符合终态;此前按 name 列查询系假阴性),实际待执行 **7 项**。
> 本清单只读核验语句均已验证可直接执行;写操作由生产通道人工执行,执行完可回读复核。

## 执行顺序总览

| 批次 | 项 | 前置 | 耗时 |
|---|---|---|---|
| **A. 立即可执行** | ①quotationrtem 索引 ②deco21号查询条件 ③NERP operation×3 ④厂结按钮 | 无 | 秒级 |
| **B. 有前置** | ⑤17号task(前置:执行器脚本已同步) ⑥material/30号task(前置:执行器已有脚本) | 执行器侧动作 | 秒级 |
| **C. 随发布窗口** | ⑦抽奖菜单(mid=940) | 建议与 decoration-8.3.030(331482B) 同批 | 秒级 |

依赖说明:③的 operation 行可先落(免登鉴权行,无副作用),但 NERP 接口真正可用需 seiya-8.3.030(109689B) 部署;②的功能生效需前端 condition/decoration.js + decoration jar(331482B,含 queryFilterExcute 白名单)配对;⑦同理需 decoration jar + 前端 6 文件。SQL 均可先落。

---

## ① quotation.quotationrtem 业务索引(唯一 DDL 缺口)

- **文件**:`sqls/quotation/QUOTATIONRTEM_INDEX.sql`
- **现状**:6,521 行,仅主键索引;sqiid/tqiid 两列已在;idx_sqiid/idx_tqiid **不在**
- **幂等性**:🔴 非幂等(MySQL 5.6 无 ADD INDEX IF NOT EXISTS),重复执行报 Duplicate key name
- **前置核验**(应返回 0 行,>0 行则跳过本项):
  ```sql
  SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');
  ```
- **执行**:文件内 ALTER 原句(两索引一条语句,6.5k 行秒级,任意时段可跑)
- **执行后验证**:
  ```sql
  SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');  -- 期望2行
  ```
- **回滚**:`ALTER TABLE quotation.quotationrtem DROP INDEX idx_sqiid, DROP INDEX idx_tqiid;`

## ② 装修单-客户"客户姓名"查询条件(decoration/21号)

- **文件**:`sqls/decoration/21_decoration_customer_name_condition.sql`
- **现状**:decoration.decorationfunction 无 customerName 行(0 行)
- **幂等性**:✅ 双段 NOT EXISTS 防重,可重复执行
- **执行**:文件原样(段1 主表定义行 + 段2 复制 dfid=131 的全部绑定)
- **执行后验证**(绑定数应与客户电话 131 一致,当前 77):
  ```sql
  SELECT f.dfid, f.value,
         (SELECT COUNT(*) FROM platform.decorationfunctionright r WHERE r.dfid=f.dfid) bindings
  FROM decoration.decorationfunction f WHERE f.`key`='condArr' AND f.value='decoration-customerName';
  SELECT COUNT(*) FROM platform.decorationfunctionright WHERE dfid=131;  -- 对照,期望同为77
  ```
- **回滚**:
  ```sql
  DELETE r FROM platform.decorationfunctionright r JOIN decoration.decorationfunction f
    ON r.dfid=f.dfid WHERE f.`key`='condArr' AND f.value='decoration-customerName';
  DELETE FROM decoration.decorationfunction WHERE `key`='condArr' AND value='decoration-customerName';
  ```
- **备注**:SQL 先落无副作用;页面出现该条件还需前端规则 + decoration jar(含 DAO 白名单)上线。

## ③ NERP 三接口 operation 注册(communion/20+21号)

- **文件**:`sqls/communion/20_operation_sync_prosign_for_nerp.sql`、`sqls/communion/21_operation_sync_sign_payment_for_nerp.sql`
- **现状**:三行全缺(按 operation 列实查)
- **幂等性**:✅ 每行 NOT EXISTS 防重
- **执行**:两文件原样(共插 3 行:syncProsignForNerp / syncSignContractForNerp / syncDecorationPaymentForNerp,moduleId=6,through=2 免登)
- **执行后验证**(期望各 1 行,moduleId=6,through=2,type=2):
  ```sql
  SELECT oid, operation, moduleId, through, type, status FROM communion.operation
  WHERE operation IN ('syncProsignForNerp','syncSignContractForNerp','syncDecorationPaymentForNerp');
  ```
- **回滚**:`DELETE FROM communion.operation WHERE operation IN ('syncProsignForNerp','syncSignContractForNerp','syncDecorationPaymentForNerp');`
- **备注**:行先落无害;接口真正可用需 seiya-8.3.030(109689B,含 NERP 合并 047230441)部署。

## ④ 销售单"厂结"按钮(sales 总控 SQL)

- **文件**:`sqls/sales/SALES_PAGE_BTN_SETTLE_WITHDRAW_BALANCE.sql`
- **现状**:落款(pfid=179/type=8)、撤款(pfid=91/type=8)均已在产(文件内置核验会打印);唯一缺口=厂结(salesfunction '厂结' 0 行)
- **幂等性**:✅ 全段变量+NOT EXISTS 防重(总控版已修复原 LAST_INSERT_ID 缺陷)
- **执行**:文件原样。开头两条 SELECT 是核验(有输出=已在产,不用补);主体只插厂结两行
- **执行后验证**(期望 1 行):
  ```sql
  SELECT f.sfid, f.name, f.value, r.name, r.company
  FROM sales.salesfunction f LEFT JOIN platform.salesfunctionright r ON r.sfid=f.sfid
  WHERE f.`key`='pageBtn' AND f.value='balance';
  ```
- **回滚**:`DELETE FROM platform.salesfunctionright WHERE sfid=(SELECT sfid FROM sales.salesfunction WHERE `key`='pageBtn' AND value='balance'); DELETE FROM sales.salesfunction WHERE `key`='pageBtn' AND value='balance' AND `group`=65;`

## ⑤ 款项工程验证导出 type=1 变体(communion/17号)

- **文件**:`sqls/communion/17_task_payment_construction_check_finish.sql`
- **现状**:tid=181 filepath 无参数后缀、_finish 变体 0 行
- **幂等性**:✅ UPDATE 天然幂等 + INSERT keyword NOT EXISTS
- **🔴 前置(必须先做,库外动作)**:执行器(仓库外独立服务器)`/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py` 已换新版本(2ee08fbc7,type-first 取参)。**未换脚本就执行本 SQL:tid=181 的在跑任务旧脚本收 4 参会把 type 当 pid、新脚本缺 type 报 IndexError。** 执行窗口避开 tid=181 计划执行时段。
- **执行**:文件原样(①tid=181 追加 " 0" 参数改名(签单时间);②插 _finish 变体行)
- **执行后验证**:
  ```sql
  SELECT tid, name, filepath, keyword FROM communion.task
  WHERE tid=181 OR keyword='export_decoration_payment_construction_check_finish';
  -- 期望:tid=181 filepath 带 " 0";新行 filepath 带 " 1"
  ```
- **回滚**:文件头回滚段(DELETE _finish 行 + 还原 tid=181 原样)

## ⑥ 辅材费用导入计划任务(material/30号)

- **文件**:`sqls/material/30_add_aoodscharge_import_task.sql`
- **现状**:keyword=import_aoodscharge 0 行
- **幂等性**:✅ 先删后插
- **🔴 前置(必须先做,库外动作)**:执行器 `ls /home/fanglin/cronbin/py3/plan_import_data_aoodscharge.py` 存在(源码:`scripts/plan/plan_import_data_aoodscharge.py`)。脚本不在,计划可建、执行必败。
- **执行**:文件原样(字段口径照 import_data_* 八行实况,type=2 勿改)
- **执行后验证**:
  ```sql
  SELECT tid, name, filepath, type, handle, status, isShow FROM communion.task WHERE keyWord='import_aoodscharge';
  ```
- **回滚**:`DELETE FROM communion.task WHERE keyWord='import_aoodscharge';`
- **备注**:task 表按 keyWord 实时查库,执行后无需重启。

## ⑦ 抽奖"活动物品查询"菜单(decoration/menu_decoration4activityItem)

- **文件**:`sqls/decoration/menu_decoration4activityItem.sql`
- **现状**:mid=940 不存在(生产 MAX(mid)=939,脚本取值仍有效);授权复制源 mid=336
- **幂等性**:🔴 module 段非幂等(先核验 mid=940);rolemodule 段有 NOT EXISTS 防重
- **前置核验**(返回 0 行才执行):
  ```sql
  SELECT mid, name FROM communion.module WHERE mid=940;
  ```
- **执行**:文件原样(module 行 + 按 mid=336 DISTINCT 复制角色授权,cuid=34 白添宇)
- **执行后验证**:
  ```sql
  SELECT mid, name, url FROM communion.module WHERE mid=940;
  SELECT COUNT(*) FROM communion.rolemodule WHERE mid=940;   -- 应与 mid=336 行数一致
  SELECT COUNT(*) FROM communion.rolemodule WHERE mid=336;   -- 对照
  ```
- **回滚**:`DELETE FROM communion.rolemodule WHERE mid=940; DELETE FROM communion.module WHERE mid=940;`
- **备注**:与 decoration-8.3.030(331482B)+前端 6 文件同批最稳;菜单行先落、jar 未上时点菜单报 404,建议同窗口。

---

## 附:相关但不属于本批

- **70号辅料授权模板**(`sqls/inventory/70_accessories_supplier_auth_template.sql`):INSERT 本就注释(按公司人工开通);其示意表名 `right` 在生产不存在(真表=`platform.salesfunctionright`),开通某公司前须先修文件。
- **QV_247 库 602 vs 脚本 599**:+3 疑似公司9默认版本页面增补,业务确认即可,非执行缺陷。
- **已执行实证**(供追溯):25号上海建司、41/42号抽奖、25/26/23/24号字典、22号userPartner、12号常量、24号补档+清悬空、14/15号duty、QV245/248/249、26号esign配置、24号signet authurl、2609260335清理、23号补回。
