-- ============================================================
-- 删除 balance 死菜单"成本"(comcost 功能从未投产)
-- 背景: 菜单指向 /views/balance/comcost.html, 该页面文件不存在(老版/app 双版均无),
--       点击 404; 后端 Comcost 链路(Action/Service/Dao/PO)与前端 api 注册均为无调用方死代码;
--       生产 balance.comcost 表 0 行, dev 仅 2 行 2020 年测试数据 → 判定无用, 删除菜单
-- 🔴 执行前安检: SELECT mid,name,url FROM communion.module WHERE mid=573;
--    预期: (573, '成本', '/views/balance/comcost.html'), 不符则中止勿执行
-- ============================================================

-- 1. 授权行(生产实测 535 行)
DELETE FROM communion.rolemodule WHERE mid = 573;

-- 2. 菜单行
DELETE FROM communion.module WHERE mid = 573 AND name = '成本' AND url = '/views/balance/comcost.html';

-- 执行后核验(应为 0):
SELECT COUNT(*) FROM communion.module WHERE url LIKE '%comcost%';
