-- ============================================================================
-- 文件: 50_lottery_oales_peramount_30000.sql
-- 库表: information.activityrule
-- 用途: 双人海外玩翻天——外销(场外)金额判断门槛全部统一调整为 30000 元(2026-11-24 用户拍板):
--       外销与主材预存共用同一份每满门槛(v3 场外并入机制: ruleType=4 为场外启用标记行,
--       ruleType=2 每满行 perAmount 为共用门槛)——本脚本将"配了场外标记的活动"的每满行
--       perAmount 全部调至 30000000 厘(30000元); 已是 30000 的 17 家不动, 仅调 12 家:
--       20000元10家 = 恩林房翻新9/沈阳爱林12/盘锦爱林24/本溪爱林25/葫芦岛爱林26/丹东爱林27/
--                    朝阳爱林28/鞍山爱林46/沈阳方林整装55/沈北爱林57
--       60000元2家  = 沈阳1918装饰2/大连1918装饰42
--       ⚠️ 共用门槛语义: 调整同时影响该公司"主材预存每满"判断(同一条规则行, 场内外销共用是既定设计)
-- 金额匹配机制(代码实证, 回答"是否使用 sales.oales.total"):
--       ❌ 不使用 sales.oales.total(销售单总额); 实际口径 = payment.oalespayment.referMoney
--       (外销收款流水, type=0收为正/type=1退为负, status IN(1,2)已付/已确认),
--       窗口锚 = oalesreceipt.collectTime(收款时间落活动窗内), 归因 = oalespayment.orderId(装修单号),
--       与主材预存款收款(payment, PAYMENT_PAYMENTTYPE_MATERIAL)窗口求和合并为 net,
--       逐行判断 net >= perAmount 每 full perAmount 赠 tickets 张(maxTickets 封顶)
--       —— 引擎: DecorationActivityItemServiceImpl.issueDecorationActivityItemByOrderId
-- 执行前置条件(生产干跑 2026-11-24):
--       ① 外销参与活动 29 个(status=0, 有 ruleType=4 行), 其中 perAmount=30000 已达标 17 家,
--         20000×10 + 60000×2 = 12 家待调; ② 全量参与(有每满行)66 家公司
--       ③ 本脚本仅动 ruleType=2 行(与 ruleType=4 标记行 JOIN 定位), ruleType=1 签约赠/4 标记行零触碰
-- 回滚方式: 依备份表 bak_activityrule_per30000_20261124 按 arId 回写原 perAmount
-- 幂等性: perAmount != 30000000 值级守卫, 重复执行零效果
-- ============================================================================

-- ============ 一、备份(先建并核对行数=12) ============

CREATE TABLE IF NOT EXISTS information.bak_activityrule_per30000_20261124 AS
SELECT r2.* FROM information.activityrule r2
JOIN information.activityrule r4 ON r4.aid = r2.aid AND r4.ruleType = 4
WHERE r2.ruleType = 2 AND r2.perAmount <> 30000000;
SELECT COUNT(*) AS bakRows_expect12 FROM information.bak_activityrule_per30000_20261124;

-- ============ 二、外销共用门槛统一调 30000 元(影响行数必须=12) ============

UPDATE information.activityrule r2
JOIN information.activityrule r4 ON r4.aid = r2.aid AND r4.ruleType = 4
SET r2.perAmount = 30000000
WHERE r2.ruleType = 2 AND r2.perAmount <> 30000000;

-- ============ 验证段 ============

-- 1. 外销活动每满门槛分布: 期望 30000×29 全达标, 非零 0 行
SELECT r2.perAmount DIV 1000 AS perAmountYuan, COUNT(*) AS cnt
FROM information.activity a
JOIN information.activityrule r4 ON r4.aid = a.aid AND r4.ruleType = 4
JOIN information.activityrule r2 ON r2.aid = a.aid AND r2.ruleType = 2
WHERE a.status = 0
GROUP BY r2.perAmount DIV 1000;

-- 2. 逐家核对清单(外销参与 29 家)
SELECT a.company, c.name AS companyName, a.aid, r2.perAmount DIV 1000 AS perAmountYuan
FROM information.activity a
JOIN information.activityrule r4 ON r4.aid = a.aid AND r4.ruleType = 4
JOIN information.activityrule r2 ON r2.aid = a.aid AND r2.ruleType = 2
LEFT JOIN communion.company c ON c.cid = a.company
WHERE a.status = 0
ORDER BY a.company;

-- ============ 参与公司清单(2026-11-24 干跑, 供核对) ============
-- 外销参与 29 家(=本脚本作用域):
--   30000已达标17: 沈阳方林1/沈阳屿林3/方林置业13/方林辅料14/方林地产18/朝阳方林31/方林售后32/
--                本溪方林35/盘锦方林36/丹东方林37/葫芦岛方林38/大连方林41/海城方林70/营口方林88/
--                辽阳方林89/阜新方林90/鞍山方林95
--   本次调增10(20000→30000): 恩林房翻新9/沈阳爱林12/盘锦爱林24/本溪爱林25/葫芦岛爱林26/
--                丹东爱林27/朝阳爱林28/鞍山爱林46/沈阳方林整装55/沈北爱林57
--   本次调降2(60000→30000): 沈阳1918装饰2/大连1918装饰42
-- 全量活动参与 66 家公司(有每满行 status=0), 其中 37 家未配外销标记(ruleType=4)不受本脚本影响
