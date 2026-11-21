-- ============================================================================
-- 文件: 53_sales_addsales_region_fdid_fix.sql
-- 库表: communion.department (+ tempbase 备份)
-- 用途: 修复"创建销售单提示系统繁忙"——装修单设计部门无父分区导致 sales.region(rid NOT NULL)写null违反非空约束
-- 案例: 公司正林兴邦(5) 装修单2508140167 创建销售单报系统繁忙(2026-11-21, SLS抓包实证参数)
-- 根因链: addSales(SalesServiceImpl:361) salesPO.setRegion(decoration.getDesignDept().getFatherDept())
--   → 该单ddid=3279「(禁)南京爱林设计二分区(不)」fdid=NULL → getFatherDept()=null
--   → sales表rid列 int NOT NULL → INSERT违反非空约束 → SQLException → 拦截器兜底110000"系统繁忙"
--   该单sales历史行=0(从未成功过); 同品牌(10646正林整家定制)其他装修单(部门有父分区)当天全部成功
-- 体检面(2026-11-21生产实测): fdid IS NULL的设计部门上共挂863个装修单, 全部存在同样炸点:
--   3278(禁)南京爱林设计一分区(不)=477单 / 3279(禁)南京爱林设计二分区(不)=317单 / 3725(禁)南京爱林设计一部(不)=69单
-- 修数方案: 三部门fdid统一挂现役分区3280「南京爱林设计一分区」(fdid=3280自指, 分区节点自指为系统惯例;
--   同族对照成都: 分区4044自指/部门4048→4044); 3278/3279/3725均为已废弃"(禁)(不)"部门, 挂靠不影响组织架构生效范围
--   另有两个同类低量部门未纳入本脚本待拍板: 146(禁)方林设计一分区(2单,方林公司属)/1860南京爱林设计中心(1单)
-- 生效: 数据即生效免重启; 修后装修单重试创建销售单即可成功
-- 执行前置条件: 无
-- 回滚方式: UPDATE communion.department SET fdid = NULL WHERE did IN (3278, 3279, 3725)
--   (或从备份表恢复: 见下方bak表)
-- 幂等性: WHERE fdid IS NULL守卫, 重跑零影响
-- ============================================================================

-- ============ 一、备份(先建备份表并回报行数, 预期=3行) ============

CREATE TABLE IF NOT EXISTS tempbase.bak_20261121_department_fdid AS
SELECT did, no, name, type, fdid FROM communion.department WHERE 1 = 0;

INSERT INTO tempbase.bak_20261121_department_fdid (did, no, name, type, fdid)
SELECT did, no, name, type, fdid
FROM communion.department
WHERE did IN (3278, 3279, 3725)
  AND NOT EXISTS (
    SELECT 1 FROM tempbase.bak_20261121_department_fdid b WHERE b.did = communion.department.did
  );

-- ============ 二、挂父分区(预期影响3行) ============

UPDATE communion.department
SET fdid = '3280'
WHERE did IN (3278, 3279, 3725)
  AND fdid IS NULL;

-- ============ 三、验证段 ============

-- 1. 三部门fdid核对(期望3行全为3280)
SELECT did, name, fdid FROM communion.department WHERE did IN (3278, 3279, 3725);

-- 2. 案例单回归核对(2508140167的部门链, 期望region指向3280有值)
SELECT d.orderId, d.ddid, dep.name, dep.fdid FROM decoration.decoration d
JOIN communion.department dep ON dep.did = d.ddid
WHERE d.orderId = '2508140167';

-- 3. 全系统残留核对(挂fdid=NULL设计部门的装修单, 期望仅剩146/1860两个待拍板部门约3单)
SELECT d.ddid, dep.name, COUNT(*) order_cnt FROM decoration.decoration d
JOIN communion.department dep ON dep.did = d.ddid
WHERE dep.fdid IS NULL GROUP BY d.ddid, dep.name ORDER BY order_cnt DESC;
