-- ============================================================================
-- decoration.decorationfunction type=4(功能按钮) sort 排序规范化
-- ============================================================================
-- 背景:
--   装修单列表页行按钮顺序 = decorationfunction(type=4, key=pageBtn) 按 sort 升序,
--   前端 decorationPageUtils.getConfig 排序后逐个 push 进 pageBtn 数组,无缓存即改即生效。
--   签约准备(signprepare dfid=248 sort=25)/预签准备(presignprepare dfid=249 sort=26)
--   两按钮(26131fe23 签约准备台功能,即预签/签约校验)当初追加在 sort 段尾:
--     1) 位置脱离功能族 —— 预签/签约执行按钮在 16/17,准备按钮却挂在 废单(23)/导出(24) 之后;
--     2) 族内顺序颠倒 —— 主流程 预签(16)<签约(17),准备按钮却是 签约准备(25)<预签准备(26)。
--   当前生产 right 表对 248/249 零绑定(授权段 decoration_sign_prepare.sql 可选段未执行),
--   按钮尚不可见,本脚本在授权前先修正 sort,一次到位。
--
-- 排序规则(从存量数据反推,本脚本将其固化为显式规则):
--   1~21   阅读与过程按钮(查看/跟进族/详情/扣款/放线/合同族/预签单/报价/定额/工程/选材/拓展项/增减项族/活动)
--   22~25  执行段: 预签准备→预签合同(执行预签)→签约准备→签约   ★准备在前,执行在后,与状态机同序
--   26~33  签约后生命周期: 终止→重签→内决→决算→保修→废单→导出→终止(可终止态)
--   91~93  创建族(创建/多单/国补,工具栏按钮与行按钮隔离段,不动)
--
-- 影响面: 纯配置数据,零代码零发版;对已绑定视图,现有按钮相对顺序与改前完全一致
--         (段内单调重映射+同值槽位按 dfid 序展开,展示序不变),仅 248/249 归位。
-- 执行时机: 任意时机皆可;建议先于 decoration_sign_prepare.sql 授权段执行。
-- 幂等性: 每条带 AND sort=旧值 守卫,重跑零命中无害。
-- ============================================================================

-- ---------- A段(核心): 预签准备/签约准备归位 + 16~24 尾段顺延 ----------

UPDATE decoration.decorationfunction SET sort = 22 WHERE dfid = 249 AND sort = 26; -- 预签准备 presignprepare  26→22(预签合同前)
UPDATE decoration.decorationfunction SET sort = 23 WHERE dfid = 186 AND sort = 16; -- 预签合同 pcontract      16→23(执行预签)
UPDATE decoration.decorationfunction SET sort = 24 WHERE dfid = 248 AND sort = 25; -- 签约准备 signprepare    25→24(签约前)
UPDATE decoration.decorationfunction SET sort = 25 WHERE dfid = 87  AND sort = 17; -- 签约 sign               17→25
UPDATE decoration.decorationfunction SET sort = 26 WHERE dfid = 88  AND sort = 18; -- 终止 terminal           18→26
UPDATE decoration.decorationfunction SET sort = 27 WHERE dfid = 89  AND sort = 19; -- 重签 resign             19→27
UPDATE decoration.decorationfunction SET sort = 28 WHERE dfid = 90  AND sort = 20; -- 内决 balance            20→28
UPDATE decoration.decorationfunction SET sort = 29 WHERE dfid = 83  AND sort = 21; -- 决算 cal                21→29
UPDATE decoration.decorationfunction SET sort = 30 WHERE dfid = 176 AND sort = 22; -- 保修 repair             22→30
UPDATE decoration.decorationfunction SET sort = 31 WHERE dfid = 86  AND sort = 23; -- 废单 delete             23→31
UPDATE decoration.decorationfunction SET sort = 32 WHERE dfid = 91  AND sort = 24; -- 导出 hasExport          24→32(顺带解开与 terminal1 同槽)
UPDATE decoration.decorationfunction SET sort = 33 WHERE dfid = 240 AND sort = 24; -- 终止(可终止态) terminal1 24→33

-- ---------- B段(建议): 1~15 段同值槽位展开为唯一 sort,固化族内顺序 ----------
-- 组内顺序 = 现状实际渲染序(同 sort 时按 dfid 序),纯固化,展示序不变:
--   sort3  回访(75)/推荐(235)/画像(241) → 3/4/5
--   sort7  合同(77)/合同(设计)(179)     → 9/10
--   sort10 定额(191)/工程(242)          → 13/14
--   sort13 增减项(80)/增减项(工程)(195)/增减项(主材)(196) → 17/18/19

UPDATE decoration.decorationfunction SET sort = 4  WHERE dfid = 235 AND sort = 3;  -- 推荐 refer
UPDATE decoration.decorationfunction SET sort = 5  WHERE dfid = 241 AND sort = 3;  -- 画像 profile
UPDATE decoration.decorationfunction SET sort = 6  WHERE dfid = 82  AND sort = 4;  -- 详情 info
UPDATE decoration.decorationfunction SET sort = 7  WHERE dfid = 78  AND sort = 5;  -- 扣款 scal
UPDATE decoration.decorationfunction SET sort = 8  WHERE dfid = 76  AND sort = 6;  -- 放线 line
UPDATE decoration.decorationfunction SET sort = 9  WHERE dfid = 77  AND sort = 7;  -- 合同 contract
UPDATE decoration.decorationfunction SET sort = 10 WHERE dfid = 179 AND sort = 7;  -- 合同(设计) contractc
UPDATE decoration.decorationfunction SET sort = 11 WHERE dfid = 74  AND sort = 8;  -- 预签单 prosign
UPDATE decoration.decorationfunction SET sort = 12 WHERE dfid = 79  AND sort = 9;  -- 报价 price
UPDATE decoration.decorationfunction SET sort = 13 WHERE dfid = 191 AND sort = 10; -- 定额 normPart
UPDATE decoration.decorationfunction SET sort = 14 WHERE dfid = 242 AND sort = 10; -- 工程 consche
UPDATE decoration.decorationfunction SET sort = 15 WHERE dfid = 134 AND sort = 11; -- 选材 selection
UPDATE decoration.decorationfunction SET sort = 16 WHERE dfid = 81  AND sort = 12; -- 拓展项 extension
UPDATE decoration.decorationfunction SET sort = 17 WHERE dfid = 80  AND sort = 13; -- 增减项 btnAddReduce
UPDATE decoration.decorationfunction SET sort = 18 WHERE dfid = 195 AND sort = 13; -- 增减项(工程) btnAddReduceD
UPDATE decoration.decorationfunction SET sort = 19 WHERE dfid = 196 AND sort = 13; -- 增减项(主材) btnAddReduceM
UPDATE decoration.decorationfunction SET sort = 20 WHERE dfid = 85  AND sort = 14; -- 装修活动 activity
UPDATE decoration.decorationfunction SET sort = 21 WHERE dfid = 175 AND sort = 15; -- 销售活动 sctivity

-- ---------- 验收(执行后人工核对,期望 34 行、sort 1~33 + 91~93 无重复) ----------
-- SELECT dfid, name, `key`, value, subtype, sort
-- FROM decoration.decorationfunction
-- WHERE type = 4
-- ORDER BY sort, dfid;
