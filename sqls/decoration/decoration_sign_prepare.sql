-- ========================================================
-- 签约准备功能配置(签约前前置条件检查+轻操作弹窗)
-- 功能: 装修单列表页(decoration.html / app 版同)新增"签约准备/预签准备"行按钮,
--       原"签约/预签"按钮及直签流程不动, 新按钮弹出 checklist 准备台(零菜单零DDL)
-- 依赖: fanglin-decoration jar(queryDecorationForSignPrepareByOrderId) + 前端双版
-- 执行顺序: 本 SQL 先于 jar/前端(插行未发版无副作用)
-- 幂等: 是(WHERE NOT EXISTS)
-- 生产执行前核验: SELECT MAX(sort) FROM decoration.decorationfunction WHERE `key`='pageBtn' AND type=4;
--                2026-09-19 生产实测 sign=17/pcontract=16/terminal1=24, 本脚本取 sort 25/26
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

-- 2.1 签约准备 <- 复制 sign 授权集(2026-09-19 生产实测: directer 96 家 + finance 74 家 + designermanager 2 家)
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

-- 2.2 预签准备 <- 复制 pcontract 授权集(2026-09-19 生产实测: finance 73 家 + designermanager 2 家)
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
-- 预期: signprepare 行 rights=172(directer96+finance74+designermanager2),
--       presignprepare 行 rights=75(finance73+designermanager2); 方式B手工勾选则按勾选数
-- ========================================================
