-- ============================================================================
-- 文件: 43_lottery_oalesrule_liaoning.sql
-- 库表: information.activityrule
-- 用途: 双人海外玩翻天——辽宁地区29个活动增加"场外(外销款)"规则行(用户拍板 2026-11-04):
--       口径=场外款与主材预存共用同一份基数和门槛(v3并入机制, 不独立计算), 场外规则行
--       本身是"启用场外计算"的开关标记——有该行的活动, 引擎才把外销款净额并入每满/阶梯基数;
--       行形态: ruleType=4(新增标记类型, 现引擎 if 链无此分支=完全忽略, 零影响可先行落库),
--               threshold=0, perAmount=照抄同活动场内每满行(共用门槛, SELECT带入零硬编码),
--               tickets=0(纯标记不单独计张), sort=3, status=0
--       名单: 辽宁全量29家(用户选"辽宁全量"):
--         沈阳6(3552方林/3553 1918/3554屿林/3558爱林/3592整装/3594沈北)
--       大连2(3582方林/3583 1918) 盘锦2(3566爱林/3577方林) 朝阳2(3570爱林/3573方林)
--       营口1(3610方林) 葫芦岛2(3568爱林/3579方林) 丹东2(3569爱林/3578方林)
--       本溪2(3567爱林/3576方林) 辽阳1(3611方林) 鞍山2(3585爱林/3616方林)
--       边缘7(3599海城[鞍山代管]/3612阜新/3557恩林房翻新/3559方林置业/3560方林辅料/3574方林售后/3562方林地产, 均沈阳总部系)
-- 执行前置条件:
--   ① 活动行存在且在窗: SELECT COUNT(*) FROM information.activity WHERE aid IN (下方29个aid) AND name='双人海外玩翻天'; 期望=29
--   ② 各活动已有 ruleType=2 每满行(全库实测138行=69活动×2, 门槛取值来源)
--   ③ 段0自检全部期望值通过后再执行段1
-- 回滚方式: DELETE FROM information.activityrule WHERE ruleType=4 AND aid IN (下方29个aid); (期望29行)
-- 幂等性: NOT EXISTS 守卫(aid+ruleType=4), 可重复执行
-- 🔴 生效依赖: 引擎闸门已落码(DecorationActivityItemServiceImpl.issueDecorationActivityItemByOrderId,
--    rules 中存在 ruleType=4 才调 oalesPaymentDao.amountOalesPaymentForLottery, 否则 oalesNet=0),
--    插桩/补发入口两路径同闸; 本SQL先行落库安全(对未部署闸门的现引擎完全惰性),
--    闸门 jar 未上线期间全部公司仍按 v3 无条件并入(截至2026-11-04窗口内外销收款=0笔, 零实际影响)
-- ============================================================================

-- 段0: 自检(只读, 逐条核对期望值)
-- 0.1 活动29个在窗
SELECT COUNT(*) AS expect_29 FROM information.activity
WHERE aid IN (3552,3553,3554,3557,3558,3559,3560,3562,3566,3567,3568,3569,3570,3573,3574,3576,3577,3578,3579,3582,3583,3585,3592,3594,3599,3610,3611,3612,3616)
  AND name = '双人海外玩翻天';

-- 0.2 尚无 ruleType=4 行(首跑期望0, 重跑可>0)
SELECT COUNT(*) AS first_run_expect_0 FROM information.activityrule WHERE ruleType = 4;

-- 段1: 插入场外规则标记行(门槛/asid 照抄同活动场内每满行, 期望影响29行)
INSERT INTO information.activityrule
  (`aid`, `ruleType`, `asid`, `threshold`, `perAmount`, `tickets`, `maxTickets`, `sort`, `status`, `createTime`)
SELECT
  r2.`aid`, 4, r2.`asid`, 0, r2.`perAmount`, 0, 0, 3, 0, NOW()
FROM information.activityrule r2
WHERE r2.`ruleType` = 2
  AND r2.`aid` IN (3552,3553,3554,3557,3558,3559,3560,3562,3566,3567,3568,3569,3570,3573,3574,3576,3577,3578,3579,3582,3583,3585,3592,3594,3599,3610,3611,3612,3616)
  AND NOT EXISTS (
    SELECT 1 FROM information.activityrule x
    WHERE x.`aid` = r2.`aid` AND x.`ruleType` = 4
  );

-- 段2: 验证
-- 2.1 期望29行, 且 perAmount 与同活动 ruleType=2 行一致
SELECT r4.`aid`, a.`company`, c.`name`, r4.`perAmount`/1000 AS oales_yuan, r2.`perAmount`/1000 AS prestore_yuan
FROM information.activityrule r4
JOIN information.activity a ON a.`aid` = r4.`aid`
JOIN communion.`company` c ON c.`cid` = a.`company`
JOIN information.activityrule r2 ON r2.`aid` = r4.`aid` AND r2.`ruleType` = 2
WHERE r4.`ruleType` = 4
ORDER BY r4.`aid`;
-- 2.2 期望 29
SELECT COUNT(*) AS expect_29 FROM information.activityrule WHERE ruleType = 4;
