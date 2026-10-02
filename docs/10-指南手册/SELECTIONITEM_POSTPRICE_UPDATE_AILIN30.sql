-- =====================================================================
-- 哈尔滨爱林装饰(company=30) 选材项结算价批量更新 + 结算选材汇总同步重算
-- =====================================================================
-- 背景: 5个gid(板材类商品)结算价调整, 存量 quotation.selectionitem.postprice
--       需统一刷成新价; 已挂结算选材(balance.balanceselectionitem)的行,
--       其 balanceselection.cost/payment 汇总需按新价重算.
--
-- 依据(2026-09-21 生产只读库核实):
--   * 5个gid仅存在于company=30, 共560行:
--       676958→442000  38行 (现值450000×36 / 500000×1 / 442000×1)
--       676960→442000 155行 (现值450000×154 / 442000×1)
--       676959→394000  31行 (现值380000×29 / 290000×1 / 394000×1)
--       676962→394000 193行 (现值400000×191 / 440000×1 / 394000×1)
--       677154→394000 143行 (现值380000×142 / 394000×1)
--     postprice为×1000存储(394元→394000), num为×1000存储, 与页面口径一致.
--   * 关联结算选材共3张:
--       bsid=16863 status=2(待审) 35项 → 重算: cost/payment 51,908,600 → 51,618,322
--       bsid=15608 status=3(审核)  9项 → 不动(口径: 仅初始0/锁定1/待审2重算)
--       bsid=16196 status=3(审核) 14项 → 不动
--     注意: 两张审核单内的23行选材项价格会被改, 但其结算单汇总不重算(按口径保留).
--
-- 重算公式 = 后端 amountBalaceSelection(BalanceSelectionDaoImpl:87) 同款:
--   cost = payment = SUM(IF(type IN (2,4,14), -(num-refnum), (num-refnum)) * postprice) DIV 1000
--   (balanceselection.cost/payment 为×1000存储; Arith.div(l,1000000)实为 sum/1e6*1e3)
--   balanceselectionitem 只存 bsid+siid 无价格快照, 无需更新.
--
-- 执行顺序: 步骤1(事前快照) → 步骤2(selectionitem) → 步骤3(balanceselection重算) → 步骤4(事后核对)
-- 事务内执行; 若单条失败整体 ROLLBACK.
-- =====================================================================

-- ---------- 步骤1: 事前快照(留档) ----------
SELECT gid, status, accountStatus, COUNT(*) cnt, MIN(postprice) min_pp, MAX(postprice) max_pp
FROM quotation.selectionitem
WHERE company = 30 AND gid IN (676959, 677154, 676958, 676960, 676962)
GROUP BY gid, status, accountStatus
ORDER BY gid, status, accountStatus;

SELECT bs.bsid, bs.status, bs.cost, bs.payment, COUNT(*) linked_items
FROM balance.balanceselectionitem bsi
JOIN balance.balanceselection bs ON bs.bsid = bsi.bsid
WHERE bsi.siid IN (
    SELECT siid FROM quotation.selectionitem
    WHERE company = 30 AND gid IN (676959, 677154, 676958, 676960, 676962))
GROUP BY bs.bsid, bs.status, bs.cost, bs.payment
ORDER BY bs.status, bs.bsid;

-- ---------- 步骤2: 更新选材项结算价 ----------
START TRANSACTION;

-- 676958 → 442000, 预期 38 行
UPDATE quotation.selectionitem SET postprice = 442000
WHERE company = 30 AND gid = 676958;

-- 676960 → 442000, 预期 155 行
UPDATE quotation.selectionitem SET postprice = 442000
WHERE company = 30 AND gid = 676960;

-- 676959 → 394000, 预期 31 行
UPDATE quotation.selectionitem SET postprice = 394000
WHERE company = 30 AND gid = 676959;

-- 676962 → 394000, 预期 193 行
UPDATE quotation.selectionitem SET postprice = 394000
WHERE company = 30 AND gid = 676962;

-- 677154 → 394000, 预期 143 行
UPDATE quotation.selectionitem SET postprice = 394000
WHERE company = 30 AND gid = 677154;

-- ---------- 步骤3: 重算受影响结算选材汇总(仅 status 0初始/1锁定/2待审) ----------
-- 预期仅命中 bsid=16863: cost/payment 51,908,600 → 51,618,322
-- 链接头按 balanceselectionitem 关联自动圈定, 无需写死bsid; 公式对单内全部行(含非本次5个gid)全量重算, 与后端锁定/提交流程一致
UPDATE balance.balanceselection bs
JOIN (
    SELECT bsi.bsid AS bsid,
           SUM(IF(si.type IN (2, 4, 14), -(si.num - si.refnum), (si.num - si.refnum)) * si.postprice) DIV 1000 AS amt
    FROM balance.balanceselectionitem bsi
    JOIN quotation.selectionitem si ON bsi.siid = si.siid
    WHERE bsi.bsid IN (
        SELECT bsi2.bsid FROM balance.balanceselectionitem bsi2
        WHERE bsi2.siid IN (
            SELECT siid FROM quotation.selectionitem
            WHERE company = 30 AND gid IN (676959, 677154, 676958, 676960, 676962)))
    GROUP BY bsi.bsid
) t ON t.bsid = bs.bsid
SET bs.cost = t.amt, bs.payment = t.amt
WHERE bs.status IN (0, 1, 2);

-- 核对影响行数: 步骤2应累计560, 步骤3应为1; 无误后提交, 有误执行 ROLLBACK
COMMIT;

-- ---------- 步骤4: 事后核对 ----------
-- 4.1 selectionitem 各gid价格已统一
SELECT gid, postprice, COUNT(*) cnt
FROM quotation.selectionitem
WHERE company = 30 AND gid IN (676959, 677154, 676958, 676960, 676962)
GROUP BY gid, postprice
ORDER BY gid, postprice;
-- 预期: 676958/676960 仅 442000; 676959/676962/677154 仅 394000

-- 4.2 结算选材汇总已刷新
SELECT bs.bsid, bs.status, bs.cost, bs.payment
FROM balance.balanceselection bs
WHERE bs.bsid IN (16863, 15608, 16196);
-- 预期: 16863(status=2) cost=payment=51618322; 15608/16196(status=3) 维持 13821650 / 18977290
