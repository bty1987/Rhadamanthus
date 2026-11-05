-- =====================================================================
-- 用途: 新接口 updateAccessoriesForDelivery.do 登记 operation 表【辅料单配送标识批次, 生产部署配套】
--   照同族 updateAccessoriesForAssign(oid=1632) 同款: through=1(放行收集档), moduleId=NULL,
--   system=1, logFlag=2; 不插 roleoperation(through=1 不查角色授权, 各公司登录用户即可用,
--   配送方式无角色限制与拍板①一致)
--   未登记时该接口走 AccessInterceptor 严格分支(有效登录亦可正常使用, 仅缺影子收集),
--   本行为对齐同族接口规范化登记
-- 执行前置条件:
--   fanglin-inventory jar(含 updateAccessoriesForDelivery)部署前/后均可, 与 jar 部署同批
-- 回滚方式:
--   DELETE FROM communion.operation WHERE operation='updateAccessoriesForDelivery' AND oid=<实际oid>;
--   (以实际插入 oid 为准, 执行前先 SELECT 核对)
-- 验证语句:
--   SELECT oid, name, operation, through, type, status, system, logFlag
--   FROM communion.operation WHERE operation='updateAccessoriesForDelivery';
-- 幂等性: 幂等(NOT EXISTS 守卫, moduleId 保持 NULL——勿以 moduleId IS NULL 作副本判定, 23号教训)
-- =====================================================================

INSERT INTO `communion`.`operation` (moduleId, name, operation, through, type, status, system, logFlag)
SELECT NULL, 'updateAccessoriesForDelivery', 'updateAccessoriesForDelivery', 1, 0, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`operation` WHERE operation = 'updateAccessoriesForDelivery');
