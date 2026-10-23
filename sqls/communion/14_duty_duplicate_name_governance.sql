-- ============================================================================
-- 文件: 14_duty_duplicate_name_governance.sql
-- 库表: communion.duty / communion.user / communion.dutment
-- 用途: 岗位(duty)重名数据治理——生产实测14组重名31行(共1001行)。
--       分三类处置:
--       ① 同部门类型真重名(合并):服务管家116/442(同dt6)、订单专员846/847/554(同dt10)、
--          信息化中心总监679/705(同dt9)——合并方向按"保留用户量大者"选定,业务可调
--       ② 零引用孤儿(直接删):705/386/96/199/646/844/554 共7行,其中386/96已是禁用态
--       ③ 跨部门类型多义(保留不动):总监×4/总经理×2/招商经理×2/新媒体运营专员×2/
--          研发经理×2/品牌经理×2——departmentType不同属不同业务语境,为合法形态
--       引用面已核实:duty被communion.user.did(员工岗位)/communion.dutment.dutyId(定岗)/
--       customer.customerprotectrule.did/customer.feedbackcomplaintdept.did四处引用,
--       后两处对31行全部0引用;治理行清单与引用数见下方明细。
-- 执行前置条件(逐条核对,不满足则中止):
--   ① SELECT COUNT(*) FROM communion.duty WHERE did IN (442,846,554,705,386,96,199,646,844);
--      期望 = 9(待删行均在)
--   ② SELECT COUNT(*) FROM communion.`user` WHERE did IN (442,846);
--      期望 = 17(442有15人+846有2人;若人数有变,按实况核对后再执行)
--   ③ SELECT COUNT(*) FROM communion.dutment WHERE dutyId = 442;  期望 = 3
-- 回滚方式:
--   user:  UPDATE communion.`user` u JOIN communion.user_did_bak_20261020 b ON u.uid=b.uid
--          SET u.did = b.old_did;
--   dutment: DELETE FROM communion.dutment WHERE dutyId=116 AND did IN
--          (SELECT did FROM communion.dutment_bak_20261020);
--          再 INSERT INTO communion.dutment SELECT * FROM communion.dutment_bak_20261020 b
--          WHERE NOT EXISTS (SELECT 1 FROM communion.dutment t WHERE t.did=b.did); (全列含did/limits/num原样回插)
--   duty:  INSERT INTO communion.duty SELECT * FROM communion.duty_bak_20261020 b
--          WHERE NOT EXISTS (SELECT 1 FROM communion.duty t WHERE t.did=b.did);
-- 幂等性: 全部语句可重复执行(条件守卫,重复执行0行受影响)。
-- ============================================================================

-- ① 备份(幂等:表已存在则跳过)
CREATE TABLE IF NOT EXISTS communion.duty_bak_20261020 AS
SELECT * FROM communion.duty
WHERE did IN (116,442,846,847,554,679,705,386,96,199,646,844);

CREATE TABLE IF NOT EXISTS communion.user_did_bak_20261020 AS
SELECT uid, did AS old_did, userName AS user_name FROM communion.`user`
WHERE did IN (442,846);

CREATE TABLE IF NOT EXISTS communion.dutment_bak_20261020 AS
SELECT * FROM communion.dutment WHERE dutyId = 442;

-- ② 合并迁移(方向:用户量大者为主岗;调换方向改两组数字即可)
-- ②1 订单专员: 846(2人) → 847(4人,保留)
UPDATE communion.`user` SET did = 847 WHERE did = 846;

-- ②2 服务管家: 442(15人+3定岗) → 116(325人+23定岗,保留)
UPDATE communion.`user` SET did = 116 WHERE did = 442;
UPDATE communion.dutment SET dutyId = 116 WHERE dutyId = 442;

-- ③ 删除零引用/已合并行(NOT EXISTS 执行时点重验,杜绝删后有新引用)
DELETE FROM communion.duty
WHERE did IN (442,846,554,705,386,96,199,646,844)
  AND NOT EXISTS (SELECT 1 FROM communion.`user` u WHERE u.did = communion.duty.did)
  AND NOT EXISTS (SELECT 1 FROM communion.dutment m WHERE m.dutyId = communion.duty.did);

-- ============================================================================
-- 验证语句(执行后核对):
--   ① 重名组应剩12组且全为跨类型多义(每组内departmentType互不相同):
--   SELECT name, COUNT(*) AS cnt, GROUP_CONCAT(DISTINCT departmentType) AS dts
--   FROM communion.duty GROUP BY name HAVING COUNT(*) > 1 ORDER BY cnt DESC;
--   ② 被删did应不存在:
--   SELECT COUNT(*) FROM communion.duty WHERE did IN (442,846,554,705,386,96,199,646,844);
--   期望 = 0
-- ============================================================================
-- 附: 防再发建议(本脚本不执行,治理完成+业务确认后拍板):
--   1. DB层: ALTER TABLE communion.duty ADD UNIQUE KEY uk_name_dt (name, departmentType);
--      语义=同部门类型内不可重名、跨类型多义放行,与业务口径一致。
--      ⚠️ departmentType可空,MySQL唯一索引不约束NULL组合,空类型行仍可重名。
--   2. 代码层: DutyServiceImpl.updateDuty 改名时补 queryDutyByName 查重(排除自身),
--      与 addDuty 的 130016 对齐——当前更新分支改名不查重,是重名可再生的活口子
--      (syncDuty 更新分支同款问题)。
-- ============================================================================
