-- ============================================================================
-- 文件: 17_task_payment_construction_check_finish.sql
-- 库表: communion.task(计划导出任务注册)
-- 用途: 款项工程验证导出脚本(plan_export_decoration_payment_construction_check.py)
--       新增工程验收时间查询类型(type前置惯例, 同 salary_worker 92/249 与
--       order_measure 133/257 的"一脚本多类型变体=多task行"模式):
--       type=0 按签单时间(原行为) / type=1 按工程验收时间(construction.construction.finishTime)。
--       脚本已改为 type-first 取参(sys.argv[1]=type, 之后 pid/args/company)。
-- 内容:
--   ① UPDATE 现有 tid=181: filepath 追加固定参数 " 0"(保持签单时间行为),
--      name 加"(签单时间)"后缀与变体区分;
--   ② INSERT 新行: filepath 追加 " 1"(验收时间), keyword 唯一值防重。
-- 执行前置条件:
--   ① 脚本新版本已同步执行器 /home/fanglin/cronbin/py3/(低峰同批, 切换窗口避开
--      tid=181 计划执行时段——窗口内旧脚本收4参会把type当pid、新脚本缺type报IndexError);
--   ② SELECT filepath, keyword FROM communion.task WHERE tid = 181;
--      ——确认现状 filepath 无参数后缀、keyword 无 _finish 变体
-- 回滚方式:
--   DELETE FROM communion.task WHERE keyword = 'export_decoration_payment_construction_check_finish';
--   UPDATE communion.task SET filepath = '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py',
--     name = '导出款项工程验证' WHERE tid = 181;
-- 幂等性: UPDATE 天然幂等; INSERT 带 keyword NOT EXISTS 守卫(keyword 列有唯一索引)。
-- ============================================================================

-- ① 现有任务: 固定 type=0(签单时间), 行为不变
UPDATE communion.task
SET filepath = '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py 0',
    name = '导出款项工程验证(签单时间)',
    comment = 'type=0按签单时间过滤; type=1变体见keyword=export_decoration_payment_construction_check_finish'
WHERE tid = 181;

-- ② 新增任务: type=1(工程验收时间)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, week, day, hour, status, isShow, comment, keyword)
SELECT '导出款项工程验证(工程验收时间)',
       '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py 1',
       'A', 0, 2, 0, 0, '', '', '', 0, 0,
       'type=1按工程验收时间(construction.construction.finishTime)过滤, 其余条件与签单时间变体一致',
       'export_decoration_payment_construction_check_finish'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_decoration_payment_construction_check_finish');

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT tid, name, filepath, status, keyword FROM communion.task
--    WHERE keyword IN ('export_decoration_payment_construction_check',
--                      'export_decoration_payment_construction_check_finish');
--   期望两行: tid=181 filepath 以 ".py 0" 结尾 / 新行以 ".py 1" 结尾, 均 status=0
-- 生效方式: 任务注册数据, 下次创建计划选用即生效(执行器脚本需已同步, 见前置①)。
-- ============================================================================
