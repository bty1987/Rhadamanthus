-- ============================================================================
-- 29_company_grant_seed_template.sql
-- ============================================================================
-- 用途: 新公司开张 · operation 授权种子(纯三元组模式的必选步骤)
--       总方案: docs/10-指南手册/OPERATION_PURE_TRIPLE_MASTER_PLAN.md 阶段4
--       机制: 从参考公司整矩阵复制显式授权 (rid,oid,company) —— 新公司获得与
--       参考公司同等的操作面; 差异授权开司后按需增删。不使用 company=0 通配。
-- 使用方法(每次开司复制本模板一份, 替换两个变量):
--   SET @CID := 0;    -- 🔴 新公司ID(必填)
--   SET @REF := 1;    -- 参考公司ID(默认1=方林总部; 可换其他成熟公司)
-- 执行前置条件:
--   ① SELECT cid,name FROM communion.company WHERE cid=@CID;        -- 确认新公司已建
--   ② SELECT COUNT(DISTINCT oid) FROM communion.roleoperation WHERE company=@REF;
--     -- 确认参考公司矩阵非空(预期500+)
--   ③ 若@CID已有授权行, 先核差异(本脚本NOT EXISTS防重, 不会重复插, 但建议人工过目):
--     SELECT COUNT(*) FROM communion.roleoperation WHERE company=@CID;
-- 回滚方式:
--   DELETE FROM communion.roleoperation WHERE company=@CID AND createTime >= <本次执行时间>;
--   -- (精确回滚按本次插入行; 种子行不带特殊标记, 按时间窗定位)
-- 验证语句:
--   SELECT COUNT(*) FROM communion.roleoperation WHERE company=@CID;
--   -- 期望 ≈ 参考公司行数(SELECT COUNT(*) FROM communion.roleoperation WHERE company=@REF)
-- 幂等性: NOT EXISTS 按(rid,oid,company)防重, 可重复执行
-- ============================================================================

-- 🔴 开司时替换这两个变量并取消注释:
-- SET @CID := 0;
-- SET @REF := 1;

-- 种子复制: 参考公司整矩阵 → 新公司(显式三元组, 无通配)
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT ref.rid, ref.oid, 34, @CID, NOW()
FROM communion.roleoperation ref
WHERE ref.company = @REF
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = ref.rid AND x.oid = ref.oid AND x.company = @CID
  );

-- 参考公司矩阵中若有 company=0 通配行(过渡期遗留), 同步展开为 @CID 显式行:
-- (标准角色在参考公司持通配 = 该角色在新公司也应具备同等操作面)
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT ref.rid, ref.oid, 34, @CID, NOW()
FROM communion.roleoperation ref
WHERE ref.company = 0
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = ref.rid AND x.oid = ref.oid AND x.company = @CID
  );

-- 验证: 新公司授权行数(期望 ≈ 参考公司显式行数 + 参考公司通配行数)
-- SELECT COUNT(*) FROM communion.roleoperation WHERE company = @CID;

-- ============================================================================
-- 🔴 待执行清单(2026-11-01): 上海三公司补种(批1关闸的前置第0项)
--    @CID=101(上海分总) / 102(上海方林装饰) / 103(上海方林整装), @REF=1
--    上海现零授权行, 不补种则批1关闸即刻闸死上海员工
-- ============================================================================
