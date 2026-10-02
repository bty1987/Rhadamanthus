-- ========================================================
-- 签约准备功能配置(签约前前置条件检查+轻操作弹窗)
-- 功能: 装修单列表页(decoration.html / app 版同)新增"签约准备/预签准备"行按钮,
--       原"签约/预签"按钮及直签流程不动, 新按钮弹出 checklist 准备台(零菜单零DDL)
-- 依赖: fanglin-decoration jar(queryDecorationForSignPrepareByOrderId) + 前端双版
-- 执行顺序: 本 SQL 先于 jar/前端(插行未发版无副作用)
-- 幂等: 是(WHERE NOT EXISTS)
-- 生产执行前核验: SELECT MAX(sort) FROM decoration.decorationfunction WHERE `key`='pageBtn' AND type=4;
--                2026-09-19 生产实测 sign=17/pcontract=16/terminal1=24, 本脚本取 sort 25/26
-- 🔴 本脚本落库的 sort 25/26 系段尾追加(临时占位): 正式排序规则见
--    decoration_function_sort_normalize.sql(准备按钮归位到 预签22/签约24,执行按钮 23/25),
--    新环境需两脚本同跑; 生产 2026-10-02 起以 normalize 脚本为准。
-- ========================================================

-- 1. decorationfunction 主表定义 2 行(pageBtn 白名单, 不插行则按钮不显示)
INSERT INTO decoration.decorationfunction (`name`, `key`, `value`, `type`, `subtype`, `sort`, `comment`)
SELECT '签约准备', 'pageBtn', 'signprepare', 4, 1, 25, '签约准备弹窗按钮(2026-09-19)'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'signprepare' AND `type` = 4
);

INSERT INTO decoration.decorationfunction (`name`, `key`, `value`, `type`, `subtype`, `sort`, `comment`)
SELECT '预签准备', 'pageBtn', 'presignprepare', 4, 1, 26, '预签准备弹窗按钮(2026-09-19)'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'presignprepare' AND `type` = 4
);

-- 2. 授权复制(可选, 二选一):
--    方式A: 执行本段按既有按钮授权集批量插右行(无 company=0 回退, 须逐公司插行);
--           签约准备=复制"签约"(value='sign')的全部 (name, company) 行,
--           预签准备=复制"预签合同"(value='pcontract')的全部 (name, company) 行。
--    方式B: 不执行本段, 执行后在"装修功能"配置页(decorationFunction.html)按公司手工勾选。
-- 🔴 注意: decorationfunctionright 无 company=0 回退, 未插行/未勾选的公司看不到新按钮。
-- 🔴 权限一致性红线: 准备台弹窗内"确认签约/预签"走 decoration:signprepare 事件桥,
--    复用宿主 signOrder/presign 链路且不再校验 pageBtn —— 准备按钮是事实执行入口,
--    授权视野必须与 sign/pcontract 完全一致(即本段复制逻辑), 禁止放宽到
--    prosign(预签单)等阅读宽视野或 designer/salesman/部门视图(2026-10-02 复核定论)。

-- 2.1 签约准备 <- 复制 sign 授权集(2026-10-02 生产复测: directer 99 家 + finance 77 家 + designermanager 2 家 = 178 行; 09-19 首测 96+74+2)
INSERT INTO platform.decorationfunctionright (`name`, `dfid`, `company`)
SELECT r.name, (SELECT dfid FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'signprepare' AND `type` = 4), r.company
FROM platform.decorationfunctionright r
JOIN decoration.decorationfunction d ON d.dfid = r.dfid
WHERE d.`key` = 'pageBtn' AND d.`value` = 'sign' AND d.`type` = 4
  AND NOT EXISTS (
    SELECT 1 FROM platform.decorationfunctionright r2
    WHERE r2.name = r.name AND r2.company = r.company
      AND r2.dfid = (SELECT dfid FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'signprepare' AND `type` = 4)
  );

-- 2.2 预签准备 <- 复制 pcontract 授权集(2026-10-02 生产复测: finance 76 家 + designermanager 2 家 = 78 行; 09-19 首测 73+2)
--     注: pcontract 现状不含 directer —— 预签执行权在财务, 督导仅可签约; 若要督导兼预签须连 pcontract 一起放, 另行拍板
INSERT INTO platform.decorationfunctionright (`name`, `dfid`, `company`)
SELECT r.name, (SELECT dfid FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'presignprepare' AND `type` = 4), r.company
FROM platform.decorationfunctionright r
JOIN decoration.decorationfunction d ON d.dfid = r.dfid
WHERE d.`key` = 'pageBtn' AND d.`value` = 'pcontract' AND d.`type` = 4
  AND NOT EXISTS (
    SELECT 1 FROM platform.decorationfunctionright r2
    WHERE r2.name = r.name AND r2.company = r.company
      AND r2.dfid = (SELECT dfid FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'presignprepare' AND `type` = 4)
  );

-- ========================================================
-- 执行后核验:
-- SELECT d.dfid, d.name, d.value, COUNT(r.dfrid) rights
-- FROM decoration.decorationfunction d
-- LEFT JOIN platform.decorationfunctionright r ON r.dfid = d.dfid
-- WHERE d.`key` = 'pageBtn' AND d.`type` = 4 AND d.value IN ('signprepare', 'presignprepare')
-- GROUP BY d.dfid, d.name, d.value;
-- 预期: signprepare 行 rights=178(directer99+finance77+designermanager2),
--       presignprepare 行 rights=78(finance76+designermanager2); 方式B手工勾选则按勾选数
-- ========================================================
