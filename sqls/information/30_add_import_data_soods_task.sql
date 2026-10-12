-- =====================================================================
-- 修复:「信息模块-计划任务」执行「导入选材」报 160028 计划不存在
-- =====================================================================
-- 根因:选材导入创建计划时,前端(WebContent/js/data/soods.js)以
--       keyword = 'import_data_soods' 调 information.createPlan,
--       后端 PlanServiceImpl.createPlan 按 keyWord 查 communion.task 无行,
--       抛 FLException(160028, "计划不存在")。
--       生产 communion.task 中同族三行仅缺此行:
--         tid=156 update_data_soods → plan_update_data_soods.py(批量更新选材)
--         tid=216 export_data_soods → plan_export_data_soods.py(导出选材)
--         tid=266 import_aoods      → plan_import_data_aoods.py(导入辅材)
-- 字段口径:照同族 import_data_* 八行实况(level=0 / type=2 / handle=1 /
--           server=0 / week·day·hour=NULL / status=0 / isShow=1),
--           其中 type=2 系现有 py3 任务实况,与 material/30 模板的 type=0 不同,勿照模板。
-- args:前端上传文件后的 resUrl(单参数),由 Python 调度器传给脚本。
--
-- 🔴 前置核对(生产服务器,库外动作):
--   ls /home/fanglin/cronbin/py3/plan_import_data_soods.py
--   脚本文件必须存在;若缺失,需先部署脚本再执行本 SQL,否则计划可建、执行必败。
-- 执行后无需重启服务(queryTaskByKeyWord 为实时查库)。
-- 幂等性:非幂等(先删后插,重复执行安全)。
-- =====================================================================

DELETE FROM communion.task WHERE keyWord = 'import_data_soods';

INSERT INTO communion.task (
    name, filepath, level, type, plugins, keyWord, handle,
    server, week, day, hour, status, isShow, comment
) VALUES (
    '导入选材',
    '/home/fanglin/cronbin/py3/plan_import_data_soods.py',
    0,
    2,
    NULL,
    'import_data_soods',
    1,
    0,
    NULL,
    NULL,
    NULL,
    0,
    1,
    '批量导入选材数据(soods), args: 上传文件resUrl'
);
