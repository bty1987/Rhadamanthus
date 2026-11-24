-- ============================================================================
-- 61_advancepayment_balance_fix.sql (v2 彻底修正版, 替代v1作废)
-- ============================================================================
-- 用途: advancepayment 余额与流水对账的最终核实结论(2026-11-24 三轮口径迭代定案)
--   对账口径(定案): 流水重算必须过滤 status=0(作废38,843条) AND status=3(取消66条),
--   即仅统计 status IN (1,2) 有效流水 —— 余额列的维护逻辑只算有效流水。
--   🔴 v1两处口径错误全部作废:
--     v1-① 未滤status=0 → 假差异2.1万行(真实无)
--     v1-② 未滤status=3 → 假"清零态"38行(排除取消流水后全部自洽, 用户实例
--         1612210040/2302040467等均验证为平) —— 本文件v1的38条UPDATE全部作废未执行
--   最终结论: 全量重对账真实不平仅 **5行**, 全部为小额(≤9000元), 无清零态行。
--   checked=16(31行, 历史直改库批次)按拍板无法找平保持现状, 不入修数范围。
--
-- 剩余5行待业务核对清单(核对要点见各行注释):
--   ① 1712010064 pt0: 流水重算10000000厘 列=1000000厘 (列少9000元)
--   ② 1812120025 pt0: 流水重算500000厘 列=2000000厘 (列多1500元)
--   ③ 1812120134 pt0: 流水重算2000000厘 列=500000厘 (列少1500元)
--      → ②③为镜像对(单号相邻/同期/差额互为相反), 疑似当年一笔转移/挪账
--        只改了两单列值未写流水, 两行需合并核对
--   ④ 2508090090 pt2: 流水重算96777000厘 列=98477000厘 (列多1700元)
--   ⑤ 2511020203 pt2: 流水重算9678000厘 列=9048000厘 (列少630元)
--   ⑤和④若列正确则流水缺账; 若流水正确则列需按流水刷回(小额直接刷无风险)
-- 处理建议:
--   ①~⑤逐单业务核对(收款/退款凭证), 定方向后小额刷列或补流水均可;
--   无清零态大额修复需求; 原子化防重(6处写入点)仍建议做, 防增量双发
--   (历史实锤: 2512300255/2607120450 双击差额216元/142元, 已修平)
-- 备份表: 本文件无UPDATE段(待5行核对后另出修数SQL), 无需备份
-- ============================================================================

-- ---------- 对账复核语句(随时可重跑) ----------
SELECT m.orderId, m.paymentType, m.bal,
    CASE m.paymentType WHEN 0 THEN ap.balance WHEN 1 THEN ap.projectBalance
      WHEN 2 THEN ap.materialBalance ELSE ap.zhenglinBalance END dbval,
    ap.checked
FROM (
    SELECT orderId, paymentType, SUM(CASE WHEN type IN (1,3) THEN recharge ELSE -recharge END) bal
    FROM payment.payment WHERE IFNULL(status,1) NOT IN (0,3)
    GROUP BY orderId, paymentType
) m
JOIN payment.advancepayment ap ON ap.orderId = m.orderId
WHERE (m.paymentType = 0 AND m.bal <> ap.balance)
   OR (m.paymentType = 1 AND m.bal <> ap.projectBalance)
   OR (m.paymentType = 2 AND m.bal <> ap.materialBalance)
   OR (m.paymentType = 3 AND m.bal <> ap.zhenglinBalance)
ORDER BY m.orderId;
-- 预期: 5行(①~⑤清单); 若出现新行 = 新增差异, 按本文件口径排查
