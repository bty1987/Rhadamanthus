-- =====================================================================
-- information 50号SQL: activityitem表增加资格层级字段(level)
-- =====================================================================
-- 用途:
--   礼品选取权限管控(2026-11-22拍板): information.activityitem 新增 level 列
--   (资格层级), 值域: 0=普通(申领活动物品等普通功能可见可申领, 默认)
--   1=管理专用(仅"添加活动物品"高级功能可见, 设计师申领不可见), 后续可扩展更高层级。
--   配套代码(同批部署): queryActivityItemByAid 接口按 level 过滤(不传level参数
--   仅返回0, 活动物品配置维护页与"添加活动物品"高级功能传level=1查全量);
--   活动物品配置页新增"管理专用"开关自助标记。
--
-- 执行前置条件:
--   1) 预检应返回空(列不存在)
--   2) 🔴先执行本DDL再部署 information jar, 否则Hibernate映射列与表不一致,
--     活动物品查询/新增直接Unknown column
--
-- 回滚方式:
--   ALTER TABLE information.activityitem DROP COLUMN level;
--   (回滚后须同步回退 information jar)
--
-- 验证语句:
--   SHOW COLUMNS FROM information.activityitem LIKE 'level';
--   SELECT level, COUNT(*) FROM information.activityitem GROUP BY level;
--   (存量全部落默认0=普通, 现有行为不变)
-- =====================================================================

-- ---------- 预检: 期望空 ----------
SHOW COLUMNS FROM information.activityitem LIKE 'level';

-- ---------- DDL: 重复执行报Duplicate column即已执行过, 跳过 ----------
ALTER TABLE information.activityitem
	ADD COLUMN level tinyint(4) NOT NULL DEFAULT 0 COMMENT '资格层级 0:普通(申领可见) 1:管理专用(仅添加活动物品功能可见)';

-- ---------- 终验: 列定义 + 存量分布(应只有0一行) ----------
SHOW COLUMNS FROM information.activityitem LIKE 'level';
SELECT level, COUNT(*) FROM information.activityitem GROUP BY level;
