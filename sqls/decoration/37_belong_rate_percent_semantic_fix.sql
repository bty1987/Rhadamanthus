-- ============================================================================
-- 37_belong_rate_percent_semantic_fix.sql
-- ============================================================================
-- 用途: 离职移交物化行比例语义修复(旧输入语义百分数×10落‰, 拍板改比例0~1×1000)
--   错误行特征: decorationbelong.rate=10 且 与 approval.approvalbelongtranitem
--   (orderId+belongType+buid+rate)四方匹配 —— 即经审批移交物化、落库值10‰(=1%)的行,
--   业务实际输入比例1(=100%), 应为1000‰。
--   背景: 旧前端 tranParseRatePercent 按百分数语义 ×10 落库(2026-11-13 4f560e867 起),
--   2026-11-24 224deeb97 改比例语义 ×1000; 期间物化行全部少百倍。
--   审批项表 rate 仅两值: 10(30行,错)/1000(72行,输入100恰好正确,不动)。
-- 范围实测(2026-11-24 只读库): 30行/26单, 全部 operateTime>=2026-11-20, 其中6行status=1
--   (后续又被移交走, 历史轨迹一并修正保持一致)。
-- 修复口径: rate 10 → 1000(即×100, 语义=用户输入的比例1)。
--   🔴 未物化的历史审批项 rate=10 不改(审批项是操作留痕, 物化行才是生效数据);
--   🔴 rate=1000 的72行不改(输入100恰好=100%,数值正确)。
-- 执行前置条件:
--   ① 段0 备份先建并核对行数(应=30)
--   ② 低峰执行
-- 幂等性: rate=10 守卫, 重复执行第二遍0行
-- 回滚方式(按备份表):
--   UPDATE decoration.decorationbelong b
--   JOIN decoration.decorationbelong_bak_37_20261124 bak ON bak.dbid = b.dbid
--   SET b.rate = bak.rate;
-- 验证语句(见文件末尾段2)
-- ============================================================================

-- ---------- 段0: 备份(先建后跑, 同库建表) ----------
CREATE TABLE decoration.decorationbelong_bak_37_20261124 AS
SELECT b.*
FROM decoration.decorationbelong b
JOIN approval.approvalbelongtranitem i
  ON i.orderId = b.orderId AND i.belongType = b.type AND i.buid = b.buid AND i.rate = b.rate
WHERE b.rate = 10;
-- 验证备份: SELECT COUNT(*) FROM decoration.decorationbelong_bak_37_20261124;
--          -- 应 = 30(2026-11-24 实测)

-- ---------- 段1: 修复 rate 10 → 1000 ----------
UPDATE decoration.decorationbelong b
JOIN approval.approvalbelongtranitem i
  ON i.orderId = b.orderId AND i.belongType = b.type AND i.buid = b.buid AND i.rate = b.rate
SET b.rate = 1000,
    b.updateTime = NOW()
WHERE b.rate = 10;
-- 预期影响行数 = 30; 若不等于30立即 STOP 并核对比对条件

-- ---------- 段2: 验证 ----------
-- ① 错误行清零(应=0):
--   SELECT COUNT(*) FROM decoration.decorationbelong b
--   JOIN approval.approvalbelongtranitem i
--     ON i.orderId = b.orderId AND i.belongType = b.type AND i.buid = b.buid AND i.rate = b.rate
--   WHERE b.rate = 10;
-- ② 修复行复查(应=30, 全部rate=1000):
--   SELECT COUNT(*) FROM decoration.decorationbelong b
--   JOIN approval.approvalbelongtranitem i
--     ON i.orderId = b.orderId AND i.belongType = b.type AND i.buid = b.buid
--   JOIN decoration.decorationbelong_bak_37_20261124 bak ON bak.dbid = b.dbid
--   WHERE b.rate = 1000;
-- ③ 抽查用户报障单 2603140613 业务归属行(应 rate=1000, 张彤超):
--   SELECT dbid, type, rate, defaultFlag, status, operateTime
--   FROM decoration.decorationbelong WHERE orderId = '2603140613';
