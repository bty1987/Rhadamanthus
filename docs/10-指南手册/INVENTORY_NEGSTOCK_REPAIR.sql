-- =====================================================================
-- INVENTORY_NEGSTOCK_REPAIR.sql  inventory.goodsstorehousestock 负库存修数
-- 生成日期: 2026-10-01    执行库: 生产 inventory    幂等: 是(仅命中 num<0)
-- =====================================================================
-- 【诊断结论】(2026-10-01 生产只读库实测)
--   1. 负库存共 114 行, 全部集中在 shid=1 仓库, 商品为"融阁/缇香"软装配饰
--      族 (gid 591~707, 画/花/灯/地毯/床品/摆件等), 单行差额 -1000 ~ -200000;
--   2. 该族商品最后一条出入库流水 (manifestitem) 停在 2019-12-04, 近 7 年
--      零活动, 历史流水无法与当前负数对账 (历史 inbound 117 行/outbound 1 行,
--      差额远小于负库存绝对值, 判定为当年初始化/导入口径问题而非并发超扣);
--   3. 处置口径 (已确认): 无法对账的历史负数直接修数归零; 若仓库实际仍有
--      实物, 后续通过盘点盘盈 (CP 货单) 重建账面, 不在本脚本范围。
-- 【执行顺序】本脚本与代码修复 (goodsstorehousestock 原子扣减, jar
--   inventory-8.3.029) 相互独立, 顺序不敏感; 建议先发 jar 再修数,
--   避免修数后新的并发超扣再次产生负数。
-- =====================================================================

-- 1) 修数前快照 (留档, 预期 114 行)
SELECT gshsid, gid, cid, fid, shid, num
FROM inventory.goodsstorehousestock
WHERE num < 0
ORDER BY num;

-- 2) 修数: 负库存归零 (仅命中 num<0, 幂等, 可重复执行)
UPDATE inventory.goodsstorehousestock
SET num = 0
WHERE num < 0;

-- 3) 修数后校验 (预期均应为 0)
SELECT COUNT(*) AS neg_remaining FROM inventory.goodsstorehousestock WHERE num < 0;

-- 4) 顺手核对: 全表存量分布参考 (执行人留档, 不做修改)
--    num=0 约 2.86 万行属长期零库存商品, 不动; 负库存仅修本脚本所述 114 行。
SELECT SUM(num < 0) AS neg, SUM(num = 0) AS zero, COUNT(*) AS total
FROM inventory.goodsstorehousestock;
