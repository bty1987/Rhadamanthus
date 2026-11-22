-- ============================================================================
-- 30_user_update_ops_grant_rid86.sql
-- ============================================================================
-- 用途: user 相关更新类 operation 授权给角色 rid=86(系统管理员),
--       按纯三元组 (rid, oid, company) 逐公司落 roleoperation 显式行(不用 company=0 通配)。
--       覆盖 24 个人员域写接口 × 103 家在营公司(status=0) ≈ 2472 行。
-- 接口清单(2026-11-02 生产实查, 均为人员/用户域更新类):
--   人员档案与权限: addUser 新增人员 / updateUser 更新人员 / updateUserForAdvance 更新人员权配 /
--     updateUserForBaseInfo 更新人员基本信息 / updateUserCompany 更新人员公司 /
--     updateUserRole 更新人员角色 / updateUserPrefer 更新人员偏好 / quitUser 人员离职 /
--     tranUser 转移人员 / authUser 认证用户 / confirmUser 确认用户 / registUser 注册用户 /
--     syncUser 同步人员 / addDingTalkUser·updateDingTalkUser·deleteDingTalkUser 钉钉用户 /
--     updateBrandUserRight 更新品牌人员权限
--   人员合同: addUserContract / updateUserContract / affixUserContract 附签 /
--     expireUserContract 过期 / filingUserContract 归档 /
--     signUserContractForCompany·signUserContractForUser 签署
-- 执行前置条件:
--   ① 段0 自检应返回 0 行(oid 清单全部存在且启用)
--   ② rid=86 角色存在: SELECT rid,name FROM communion.role WHERE rid=86;  -- 系统管理员
-- 幂等性: NOT EXISTS 按 (rid,oid,company) 防重, 可重复执行
-- 回滚方式:
--   DELETE FROM communion.roleoperation WHERE rid=86 AND company<>0 AND oid IN (段1清单);
--   -- (如需保留执行前已存在的显式行, 按 createTime >= 本次执行时间收窄)
-- 验证语句(执行后核对):
--   SELECT COUNT(*) FROM communion.roleoperation WHERE rid=86 AND company<>0 AND oid IN (段1清单);
--   -- 期望 ≈ 24 × 103 = 2472(少出的行=该公司本就有部分显式行, NOT EXISTS 防重所致)
-- ============================================================================

-- ---------- 段0: 前置自检(期望0行) ----------
SELECT o.oid, o.operation, o.name
FROM communion.operation o
WHERE o.oid IN (
    1126,894,49,1341,1233,1307,989,904,1099,1472,1473,1471,327,1127,909,903,1216,
    1222,1659,1476,1244,1477,1475,1437
  ) AND (o.status <> 0);

-- ---------- 段1: 授权落库(rid=86 × 24接口 × 在营公司) ----------
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT 86, o.oid, 34, c.cid, NOW()
FROM communion.operation o
CROSS JOIN communion.company c
WHERE o.oid IN (
    -- 人员档案与权限
    1126,  -- addUser 新增人员
    894,   -- updateUser 更新人员
    49,    -- updateUserForAdvance 更新人员权配
    1341,  -- updateUserForBaseInfo 更新人员基本信息
    1233,  -- updateUserCompany 更新人员公司
    1307,  -- updateUserRole 更新人员角色
    989,   -- updateUserPrefer 更新人员偏好
    904,   -- quitUser 人员离职
    1099,  -- tranUser 转移人员
    1472,  -- authUser 认证用户
    1473,  -- confirmUser 确认用户
    1471,  -- registUser 注册用户
    327,   -- syncUser 同步人员
    1127,  -- addDingTalkUser 新增钉钉用户
    909,   -- updateDingTalkUser 更新钉钉用户
    903,   -- deleteDingTalkUser 删除钉钉用户
    1216,  -- updateBrandUserRight 更新品牌人员权限
    -- 人员合同
    1222,  -- addUserContract 新增人员合同
    1659,  -- updateUserContract 更新人员合同
    1476,  -- affixUserContract 附签员工合同
    1244,  -- expireUserContract 人员合同过期
    1477,  -- filingUserContract 归档员工合同
    1475,  -- signUserContractForCompany 公司签署员工合同
    1437   -- signUserContractForUser 人员签订合同
  )
  AND o.status = 0
  AND c.status = 0
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = 86 AND x.oid = o.oid AND x.company = c.cid
  );

-- ---------- 验证 ----------
-- 授权行总数(期望 ≈ 2472)
SELECT COUNT(*) granted_rows FROM communion.roleoperation
WHERE rid = 86 AND company<>0 AND oid IN (
    1126,894,49,1341,1233,1307,989,904,1099,1472,1473,1471,327,1127,909,903,1216,
    1222,1659,1476,1244,1477,1475,1437
);
-- 抽查: 系统管理员在任一公司的 updateUser 授权
SELECT ro.rid, ro.oid, ro.company, ro.createTime FROM communion.roleoperation ro
WHERE ro.rid = 86 AND ro.oid = 894 ORDER BY ro.company LIMIT 5;
