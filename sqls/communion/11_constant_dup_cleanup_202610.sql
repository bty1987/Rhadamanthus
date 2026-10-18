-- =====================================================================
-- communion.constant 重复数据清理(2026-10-17 对账产物)
-- =====================================================================
-- 背景: 2026-09至2026-10-17 全量对账。9月以来九组新增/重定义常量
--       (materialPlan 16行/积分商城stateType 2行/施工环节工费态重定义/
--       退报单状态4行/余额账户utype 2行/服务团队type 6行/contentRole 12行/
--       合同约定比例10行/外辅作废status=6)生产已全部配置到位,无缺失。
--       全表 GROUP BY(module,clazz,type,key) 扫出 3 组重复:
--
--   ① inventory/occessories/status key=3(到货): cid 1137 与 2569 完全同义
--     (同name/value/status=0,双加载互覆) → 删 2569 留 1137(老行)
--   ② inventory/occessories/status key=6(作废): cid 2570 与 2571 完全同义
--     (外辅作废功能2026-09上线配套,重复插入) → 删 2571 留 2570
--   ③ salary/salary/SalaryTwoType key=4: cid 809"维修款"(status=1已停用,
--     老行)与 cid 2568"监理维修款"(status=0在用,业务改名后新行) → 删 809
--     留 2568;因809本就不加载(加载器只取status=0),删除零展示变化
--
-- ⚠️ 全部按 cid 显式删除(主键点删,不存在误伤);重复执行零副作用(已删cid再删命中0行)。
-- ⚠️ 仅动3行字典,无DDL,改库即生效,无需重启;页面刷新后字典缓存随加载更新。
--
-- 核验(执行后跑):
--   SELECT module, clazz, type, `key`, COUNT(*) FROM communion.constant
--    WHERE (module='inventory' AND clazz='occessories' AND type='status' AND `key` IN ('3','6'))
--       OR (module='salary' AND clazz='salary' AND type='SalaryTwoType' AND `key`='4')
--    GROUP BY module, clazz, type, `key` HAVING COUNT(*) > 1;   -- 预期 0 行
-- =====================================================================

DELETE FROM communion.constant WHERE cid = 2569; -- 到货重复行(留1137)
DELETE FROM communion.constant WHERE cid = 2571; -- 作废重复行(留2570)
DELETE FROM communion.constant WHERE cid = 809;  -- SalaryTwoType停用老行"维修款"(留2568"监理维修款")
