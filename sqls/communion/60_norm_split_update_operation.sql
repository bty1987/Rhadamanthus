-- ============================================================================
-- 60_norm_split_update_operation.sql
-- ============================================================================
-- 用途: 定额拆单功能 3 个数量修改接口登记 communion.operation。
--   拆单页面(normtionSplit, 入口=定额单列表"拆单"按钮)按功能区分组展示定额明细,
--   支持行内修改数量: 工费项(normriceitem.num)/材料项(normooditem.normnum+storenum)/工时项(normtimeitem.num)。
-- through=1(免检): 跟随 norm 族现状——同族写操作 addNormoodItem/deleteNormoodItem/addNormriceItem/
--   deleteNormriceItem/confirm/reject/makeNormtion 全部 through=1, 新接口保持同族一致;
--   如需收紧为 through=0 强权限另行专项(届时 UPDATE through 并配 roleoperation)。
-- 执行前置: communion 库; 无表结构依赖; 建议在 quotation jar 部署前执行(登记即生效,
--   未登记=放行, 拦截器对已登记接口才做档位判定)
-- 回滚方式: DELETE FROM communion.operation WHERE operation IN ('updateNormriceItemForNum','updateNormoodItemForNum','updateNormtimeItemForNum');
-- 验证语句: SELECT operation, name, through FROM communion.operation WHERE operation IN ('updateNormriceItemForNum','updateNormoodItemForNum','updateNormtimeItemForNum'); -- 期望3行 through=1
-- 幂等: NOT EXISTS 守卫, 重复执行0行
-- ============================================================================

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'updateNormriceItemForNum', '修改定额价项数量', 1, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateNormriceItemForNum');

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'updateNormoodItemForNum', '修改定额子项数量', 1, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateNormoodItemForNum');

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'updateNormtimeItemForNum', '修改定额工时项数量', 1, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateNormtimeItemForNum');
