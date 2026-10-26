-- =====================================================================
-- 用途: 注册辅材费用批量导入计划任务（communion.task，keyword=import_aoodscharge）
--   前端 aoodsCharge.js 以该 keyword 调 information.createPlan 创建导入计划，
--   Python 调度器按 pid path aid 传参执行脚本
-- 字段口径: 照同族 import_data_* 八行生产实况（level=0 / type=2 / handle=1 /
--   server=0 / week·day·hour=NULL / status=0 / isShow=1）；
--   type=2 系现有 py3 任务实况，勿改回模板的 type=0
-- args: 前端上传文件后的 resUrl,aid（逗号拼接），调度器前置 pid 后传脚本
--
-- 🔴 前置核对（生产服务器，库外动作）:
--   ls /home/fanglin/cronbin/py3/plan_import_data_aoodscharge.py
--   脚本必须先部署到 cronbin/py3，否则计划可建、执行必败
--   （脚本源码: 仓库 scripts/plan/plan_import_data_aoodscharge.py）
-- 执行后无需重启服务（task 按 keyWord 实时查库）
-- 回滚方式:
--   DELETE FROM communion.task WHERE keyWord = 'import_aoodscharge';
-- 验证语句:
--   SELECT tid, name, filepath, type, handle, status, isShow
--   FROM communion.task WHERE keyWord = 'import_aoodscharge';
-- 幂等性: 先删后插，重复执行安全
-- =====================================================================

DELETE FROM communion.task WHERE keyWord = 'import_aoodscharge';

INSERT INTO communion.task (
    name, filepath, level, type, plugins, keyWord, handle,
    server, week, day, hour, status, isShow, comment
) VALUES (
    '辅材费用导入',
    '/home/fanglin/cronbin/py3/plan_import_data_aoodscharge.py',
    0,
    2,
    NULL,
    'import_aoodscharge',
    1,
    0,
    NULL,
    NULL,
    NULL,
    0,
    1,
    '批量导入辅材费用数据(aoodsCharge), args: pid path aid'
);
