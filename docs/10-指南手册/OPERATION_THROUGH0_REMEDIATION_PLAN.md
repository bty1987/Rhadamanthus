# Operation 关闸(through=0)事故处置与 roleoperation 补齐方案

> 日期: 2026-10-12 | 背景: operation/roleoperation 体系上线后,运维将部分 operation 置 through=0
> 激活强校验,因 roleoperation 授权面收集不完整,大量用户被拒(-2 无操作权限)。
> 本方案给出:止血 → 补数据 → 修收集链路 → 再关闸 SOP v2 四阶段处置。
> 关联文档: `OPERATION_COLLECT_CUTOVER_SOP.md`(原 SOP,本方案是其事故分支与 v2 关闸流程)
>
> **决策记录(2026-10-12 拍板)**:Phase 1 主动回填不做;Phase 2 已实施(恢复 194 行 fillOperation
> + fillOperation NPE 修复 + super 旁路,fanglin-core/fanglin-system 8.3.030 已构建待部署),
> 被动收集跑一段时间;Phase 3 视收集情况再收紧。
> ⚠️ 被动收集边界:被拒的调用不会被收集(校验通过后才 fill),through=1 分支无登录态也不收集
> → **13 个零覆盖接口必须先回滚 through=1 才能用**;其授权面留到 P3 关闸前按审计记录补。

---

## 一、机理与诊断(2026-10-12 生产只读库实测)

### 1.1 鉴权语义(AccessInterceptor + OperationServiceImpl.checkOperation)

| operation 状态 | 行为 |
|---|---|
| 未登记 | 登录即放行 |
| through=1 (PASS) | **不做任何校验**直接放行 |
| through=2 (COMMON) | 仅校验 authentication 可解密 + userId 存在 |
| **through=0** | 登录 + **roleoperation(主角色∨附加角色, 用户公司) 命中才放行**,否则抛 -2 |

🔴 **两个放大事故的缺陷**:
1. `AccessInterceptor` 中两处 `fillOperation` 影子收集调用**均被注释**(122/194 行)——
   收集停摆,关闸后缺权限的角色**永远不会自愈**。生产实证:roleoperation 最后一条
   createTime=2026-10-02 09:04:02,此后 10 天零新增。
2. boolean 版 `checkOperation` **对 super 角色无旁路**——零覆盖接口连管理员都会被拒,
   应急救援通道也被堵。

### 1.2 生产实测数据

- operation 1435 个:through=0 **77 个** / =1 1270 个 / =2 87 个 / =3 1 个
- roleoperation 30.2 万行,其中 **23.07 万行系 2026-10-02 单日人工批量灌入**
  (cuid=34,覆盖 1143 oid × 175 rid × 100 company 的子集);本次关闸接口中一批
  **不在**这批授权范围内
- 活跃用户 24690 人,主角色×公司组合 **1009 个**(授权完整性的分母参考)
- log.actionLog 仅 9789 行(只记 logFlag=ALWAYS/业务 bind 的接口)——不是全量流水,
  不能直接当回填源;但 logFlag 开关本身是现成的审计抓手(见 Phase 3)
- 文件日志:关闸分支在鉴权后、校验前打印 `AI|I|<action>|<userId>|<company>|<ip>`
  (AccessInterceptor logger.error)——**被拒请求也在内**,是"谁在用/谁被挡"的最全数据源

### 1.3 through=0 三级分诊(77 个全量)

| 档 | 判定标准 | 清单(oid) | 处置 |
|---|---|---|---|
| T0 零覆盖 | roleoperation 0 行,非超管必被拒 | 1, 2, 37, 271, 285, 295, 1626~1631(功能区类型 6 件套), 1632(撤销销售款) = **13 个**(另 39 已 status=1 不碍事) | **立即回滚 through=1**(没人用=无害,有人用=解救) |
| T1 低覆盖 | rid_cnt≤5 或 comp_cnt<90,疑似收集缺口 | 7, 9, 20, 21, 28, 45, 48, 49, 55, 531, 535, 779, 784, 1287, 1619, 1620, 1621 | 日志证据审查后决定(见 2.2) |
| T2 其余 | 覆盖 6~119 角色 / 58~100 公司 | 其余 47 个 | 保留关闸,按 Phase 3 四件套逐个复查 |

> 注:低覆盖≠错——`successDrawLine1`(2 角色/58 公司)可能就是"放线员"专属,窄是正常的。
> 判定依据只能是日志实测调用面 vs 授权面的差集,不是行数本身。

---

## 二、Phase 0 止血(当天,即时生效,无需重启)

### 2.1 T0 零覆盖 13 个立即回滚(无风险)

```sql
UPDATE communion.operation SET through = 1
WHERE through = 0 AND oid IN (
  1,   -- subDecorationForQuotationTime 增加报价次数限制
  2,   -- changeDecorationForOrderId   装修单号修改
  37,  -- pageCustomerOriginForCommunion 客源共享
  271, -- disableCustomerChance        客户机会不匹配
  285, -- queryEpersonByEuid           获取营销人员
  295, -- queryCardPhotoByCaid         获取方片信息
  1626,1627,1628,1629,1630,1631, -- *FunctionAreaType 功能区类型 6 件套
  1632 -- withdrawSalesPayment         撤销销售款
);
```

### 2.2 本次调整的 20 个逐一过筛

对本次置 0 的 20 个,按下表核对(O2 全量覆盖统计见附录 A):

```sql
SELECT o.oid, o.operation, o.name, COUNT(ro.roid) ro_cnt,
       COUNT(DISTINCT ro.rid) rid_cnt, COUNT(DISTINCT ro.company) comp_cnt
FROM communion.operation o
LEFT JOIN communion.roleoperation ro ON ro.oid = o.oid
WHERE o.oid IN (/* 本次关闸的 20 个 oid */)
GROUP BY o.oid, o.operation, o.name;
```

- 命中 T0 清单 → 已被 2.1 覆盖;
- 命中 T1 且近 3 天有用户报障/日志有被拒记录 → 先回滚,补齐后重关;
- 其余 → 保留,进入 Phase 3 流程复查。

### 2.3 全部 77 个关闸接口打开审计(为补齐与再关闸提供数据)

```sql
UPDATE communion.operation SET logFlag = 1 WHERE through = 0;
```

logFlag=1(ALWAYS)后,**每次调用(含被拒的 -2)都会带 userId/company/ip/errorCode 落
log.actionLog**——这是零代码变更的旁路审计,后续补齐与观察全靠它。
关闸接口均为管理/低频动作,量级可控(对照:全量 actionLog 现 100~500 行/天)。

---

## 三、Phase 1 补齐 roleoperation(1~3 天,四源合并)

### 3.1 源A:应用日志挖掘(主数据源)

生产 app 服务器滚动日志中 grep(窗口越长越好,建议 ≥30 天,必须覆盖一次月结):

```bash
# 行样例: ... AI|I|pageDecoration|FL-00479|1|1.2.3.4
grep -rh 'AI|I|' /path/to/app-logs/ \
 | awk -F'|' '{print $3"|"$4"|"$5}' | sort -u > used_combos.txt
```

产出 `(actionName, userId, company)` 去重集 → 导入临时表后生成授权(幂等,可重跑):

```sql
CREATE TABLE IF NOT EXISTS communion.tmp_op_usage (
  action VARCHAR(64), userId VARCHAR(15), company INT,
  PRIMARY KEY(action, userId, company)) ENGINE=InnoDB;
-- LOAD DATA / 批量 INSERT used_combos.txt

-- 生成授权:主角色 + 附加角色 双腿,NOT EXISTS 防重
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT u.roleId, o.oid, 34, t.company, NOW()
FROM communion.tmp_op_usage t
JOIN communion.user u        ON u.userId = t.userId
JOIN communion.operation o   ON o.operation = t.action AND o.through = 0
WHERE NOT EXISTS (SELECT 1 FROM communion.roleoperation ro
                  WHERE ro.rid = u.roleId AND ro.oid = o.oid AND ro.company = t.company);

INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT ur.rid, o.oid, 34, t.company, NOW()
FROM communion.tmp_op_usage t
JOIN communion.user u        ON u.userId = t.userId
JOIN communion.userrole ur   ON ur.uid = u.uid
JOIN communion.operation o   ON o.operation = t.action AND o.through = 0
WHERE NOT EXISTS (SELECT 1 FROM communion.roleoperation ro
                  WHERE ro.rid = ur.rid AND ro.oid = o.oid AND ro.company = t.company);
```

> 同一份日志同时回答"谁正在被挡":筛选关闸之后时间戳的记录,即当前受阻人群清单。

### 3.2 源B:菜单推导(结构性兜底,补"还没人调过但应当有")

有 mid 归属的 operation,授权给持有该菜单的全部 (rid, company):

```sql
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT DISTINCT rm.rid, o.oid, 34, rm.company, NOW()
FROM communion.operation o
JOIN communion.rolemodule rm ON rm.mid = o.mid
WHERE o.through = 0 AND o.mid IS NOT NULL AND o.mid > 0
  AND NOT EXISTS (SELECT 1 FROM communion.roleoperation ro
                  WHERE ro.rid = rm.rid AND ro.oid = o.oid AND ro.company = rm.company);
```

无 mid 的(自动收集行 mid 为空),仅对**准备关闸的接口**人工补 action→页面映射
(每批 ≤20 个,工作量可控)。

### 3.3 源C:actionLog 交叉验证 / 源D:管理角色兜底

- 源C:log.actionLog 已有数据与源A结果做差集验证(它只覆盖 ALWAYS 接口,仅作校验);
- 源D:集团管理类角色(按 RolePO.no/level 圈定)对全部 through=0 接口兜底授权,
  保证救援通道(在 super 旁路代码加固上线前的临时手段)。

### 3.4 回滚保障

```sql
CREATE TABLE communion.roleoperation_bak_20261012 AS SELECT * FROM communion.roleoperation;
-- 回滚:按 createTime>='2026-10-12' AND cuid=34 删除本次插入
```

---

## 四、Phase 2 修复收集链路(防再发,1 次部署)

1. **恢复影子收集**:取消 `AccessInterceptor` 两处 `fillOperation` 注释
   (122 行 COMMON 分支可选;**194 行必恢复**——它位于 checkOperation 通过之后,
   只记录"合法使用",不会给被拒角色放行,关闸安全性不受影响)。
   部署走 WEB-INF/classes(core/system 模块不在 jar 热替换体系)。
2. **super 旁路加固**(建议同批):boolean `checkOperation` 对
   `RolePO.SUPER_NO_STR` 直接 return true,避免管理员被挡死救援通道。
3. (可选)operation 表加 `updateTime` 列,审计"谁在何时关的闸"。

恢复后,新增的角色×公司×接口组合会被自动收集,后续关闸永远有数据可用。

---

## 五、Phase 3 再关闸 SOP v2(把"收集完整"变成可度量门槛)

**关闸四件套(每个接口全过才准关):**

1. **审计先行**:该接口 `logFlag=1` 已挂 ≥1 周,actionLog 有真实调用记录;
2. **覆盖率=100%**:`日志实测调用面 (rid,company)` ⊆ `roleoperation 授权面`,
   体检 SQL:

   ```sql
   SELECT t.action, t.company, COUNT(DISTINCT t.rid) used_rids,
          SUM(CASE WHEN ro.roid IS NULL THEN 1 ELSE 0 END) missing
   FROM (
     SELECT a.actionName action, u.roleId rid, al.companyId company
     FROM log.actionLog al
     JOIN communion.user u ON u.userId = (SELECT userId FROM communion.user WHERE uid = al.createUserId)
     JOIN communion.operation o ON o.operation = a.actionName  -- 别名以实际列为准
     WHERE o.through = 0 AND al.resultState = 0
   ) t
   LEFT JOIN communion.roleoperation ro
     ON ro.rid = t.rid AND ro.company = t.company
    AND ro.oid = (SELECT oid FROM communion.operation WHERE operation = t.action)
   GROUP BY t.action, t.company HAVING missing > 0;
   ```

3. **周期覆盖**:低频接口(月结/季结/年度)必须在收集窗口内覆盖一次完整周期;
4. **回滚预案**:单条 `UPDATE ... SET through=1 WHERE oid=?`,即时生效。

**节奏**:每批 ≤5 个,关后观察 24~48h 的 `actionLog(resultState=1 AND errorCode=-2)`,
零拒绝再放下一批。

**零覆盖接口的长期处置**:绝不直接关闸。挂 logFlag=1 审计两周 → 有人用:补授权后走
四件套;无人用:`status=1` 下线归档。

---

## 六、附录

### A. 77 个 through=0 覆盖统计(2026-10-12 实测)

见对话记录 O2 查询结果;要点:零覆盖 13+1(禁用) / rid_cnt≤5 共 17 个 /
最大覆盖 queryCustomerById(119 角色/100 公司)。

### B. 诊断复跑 SQL

```sql
-- through 分布
SELECT IFNULL(through,-1) thru, COUNT(*) FROM communion.operation GROUP BY thru;
-- 关闸接口覆盖全景
SELECT o.oid, o.operation, COUNT(ro.roid) ro_cnt, COUNT(DISTINCT ro.rid) rid_cnt,
       COUNT(DISTINCT ro.company) comp_cnt
FROM communion.operation o LEFT JOIN communion.roleoperation ro ON ro.oid = o.oid
WHERE o.through = 0 GROUP BY o.oid, o.operation ORDER BY o.oid;
-- 拒绝监控(审计打开后每日)
SELECT actionName, companyId, COUNT(*) FROM log.actionLog
WHERE resultState = 1 AND errorCode = -2 AND createTime >= CURDATE()
GROUP BY actionName, companyId ORDER BY 3 DESC;
```
