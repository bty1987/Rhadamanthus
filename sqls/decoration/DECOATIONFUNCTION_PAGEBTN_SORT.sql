-- =====================================================================
-- decoration.decorationfunction 功能按钮(pageBtn) sort 值统一重排
-- =====================================================================
-- 背景: 装修单页面(decoration.html/js)行内功能按钮的显示顺序自此版本起由
--       decorationFunction.sort 驱动(decoration.js 渲染前按 pageConfig.pageBtn
--       顺序重排 linebtns, pageBtn 数组在 getConfig 中已按 sort 排序)。
--       原sort值大量并列(profile/refer同3、contract/contractc同7、三个
--       btnAddReduce同13), 并列时顺序漂移=顺序问题的根源。
-- 口径: 25个角色视角统一采用以下顺序(用户2026-10-17批准, 与decoration.js
--       linebtns当前定义序一致), ×10留插入空隙:
--   查看10 档案20 推荐30 补充信息40 服务50 审核60 精准排线70 放线80
--   合同90 合同查看100 活动额110 预签120 报价130 增减项140 定额150 选材160
--   增减170 增减D180 增减M190 施工计划200 活动210 活动(二)220 预签准备230
--   签约准备240 合同打印250 签约260 结算270 重签280 余额290 决算300
--   保修310 终端状态320 隐藏330
-- 范围: 仅 subtype=1 AND key='pageBtn' 且 value 属于上述33键的行;
--       其他值(delete/create/createAdvance/createCountry/terminal1 等
--       属其他页面)不动。
-- ⚠️ 需先于前端JS(decoration.js重排逻辑)生效, 否则并列旧值下顺序漂移。
-- ⚠️ 幂等: UPDATE按值定值, 重复执行无副作用。
-- =====================================================================

UPDATE decoration.decorationfunction
SET sort = CASE `value`
    WHEN 'view' THEN 10
    WHEN 'profile' THEN 20
    WHEN 'refer' THEN 30
    WHEN 'info' THEN 40
    WHEN 'services' THEN 50
    WHEN 'revie' THEN 60
    WHEN 'proline' THEN 70
    WHEN 'line' THEN 80
    WHEN 'contract' THEN 90
    WHEN 'contractc' THEN 100
    WHEN 'scal' THEN 110
    WHEN 'prosign' THEN 120
    WHEN 'price' THEN 130
    WHEN 'extension' THEN 140
    WHEN 'normPart' THEN 150
    WHEN 'selection' THEN 160
    WHEN 'btnAddReduce' THEN 170
    WHEN 'btnAddReduceD' THEN 180
    WHEN 'btnAddReduceM' THEN 190
    WHEN 'consche' THEN 200
    WHEN 'activity' THEN 210
    WHEN 'sctivity' THEN 220
    WHEN 'presignprepare' THEN 230
    WHEN 'signprepare' THEN 240
    WHEN 'pcontract' THEN 250
    WHEN 'sign' THEN 260
    WHEN 'terminal' THEN 270
    WHEN 'resign' THEN 280
    WHEN 'balance' THEN 290
    WHEN 'cal' THEN 300
    WHEN 'repair' THEN 310
    WHEN 'terminalStatus' THEN 320
    WHEN 'hidden' THEN 330
END
WHERE subtype = 1
  AND `key` = 'pageBtn'
  AND `value` IN ('view','profile','refer','info','services','revie','proline','line','contract','contractc',
                  'scal','prosign','price','extension','normPart','selection','btnAddReduce','btnAddReduceD',
                  'btnAddReduceM','consche','activity','sctivity','presignprepare','signprepare','pcontract',
                  'sign','terminal','resign','balance','cal','repair','terminalStatus','hidden');

-- 核验: 无并列
-- SELECT sort, COUNT(*) FROM decoration.decorationfunction
--  WHERE subtype = 1 AND `key` = 'pageBtn' AND sort <= 330
--  GROUP BY sort HAVING COUNT(*) > 1;
