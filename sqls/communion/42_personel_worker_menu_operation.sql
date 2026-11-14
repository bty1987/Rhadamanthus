-- =============================================================
-- 用途: 人员模块-工人数据维护功能上生产前置数据
--       ① module 菜单登记(工人 worker.html, 挂人事L1下, mid由库自增不写死)
--       ② operation 登记 pageWorker(through=1免检, 对齐pageInstorer 1576惯例;
--          addWorker/updateWorker 不登记=收集期放行, 与addInstorer/updateInstorer同)
--       ③ systemconfig 种 worker 键(游客角色rid, 暂与驻店员同值145, 可在
--         systemconfig页改指专用工人角色); workerlimit 不种走代码缺省100
-- 前置: fanglin-personel-8.3.031.jar(含WorkerAction等五类, TYPE_WORKER_INT=5/57)
--       与前端 worker.html/worker.js/api(personel.js) 已部署; 三条均幂等可重跑
-- 回滚: DELETE FROM communion.module WHERE url='/views/personnel/worker.html';
--       DELETE FROM communion.operation WHERE operation='pageWorker';
--       DELETE FROM communion.systemconfig WHERE `key`='worker' AND company=0;
-- 验证: SELECT mid,name,url FROM communion.module WHERE url='/views/personnel/worker.html';
--       SELECT oid,operation,through FROM communion.operation WHERE operation='pageWorker';
--       SELECT scid,`key`,value FROM communion.systemconfig WHERE `key`='worker';
-- =============================================================

INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey)
SELECT 4, '工人', NULL, NULL, 'icon-user', '/views/personnel/worker.html', 2, 1, 0, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.module WHERE url = '/views/personnel/worker.html');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT NULL, 'pageWorker', 'pageWorker', 1, 0, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'pageWorker');

INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT NULL, 'worker', '145', 34, '工人数据维护-游客角色ID', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'worker' AND company = 0);
