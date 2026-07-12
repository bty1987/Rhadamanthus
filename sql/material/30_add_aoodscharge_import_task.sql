-- 注册 aoodsCharge 批量导入任务
-- keyword: import_aoodscharge (前端 aoodsCharge.js 中使用此 keyword 创建 Plan)
-- filepath: script/plan_import_data_aoodscharge.py
-- type: 0 (Python)
-- level: 0 (FUNCTION)
-- handle: 0 (READ)
-- status: 0 (启用)
-- isShow: 0 (显示)

INSERT INTO communion.task (
    name,
    filepath,
    level,
    type,
    plugins,
    keyWord,
    handle,
    server,
    week,
    day,
    hour,
    status,
    isShow,
    comment
) VALUES (
    '辅材费用导入',
    'script/plan_import_data_aoodscharge.py',
    0,
    0,
    NULL,
    'import_aoodscharge',
    0,
    0,
    NULL,
    NULL,
    NULL,
    0,
    0,
    '批量导入辅材费用数据(aoodsCharge), args: pid path aid'
);
