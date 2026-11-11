-- ============================================================
-- 30_activityitem_cuid0_null.sql 活动物品历史迁移行cuid=0清NULL (decoration.decorationactivityitem)
-- 用途: 2023-06-02历史迁移的312,944行cuid=0(指向不存在的uid=0), 活动物品查询
--      (queryDecorationActivityItemByOrderId L148)新加createrName展示后,
--      ManyToOne懒代理对uid=0初始化炸"No row with the given identifier exists: UserPO#0"
--      (2026-11-11 08:29生产实证)。置NULL后getCreater()返回null, 代码已有
--      creater==null兜底空串分支自然接住, 接口恢复、前端创建人显示空。
--      cuid零业务消费(纯审计列, 全库无getCuid读取), 列可空, 置NULL零副作用。
-- 范围: 312,944行(全部create=2023-06-02 23:12:09迁移秒, type分布0券238528/1物品70375/2红包3962/3共79);
--      ruid/rfuid无零值不用动; 2023-06之后无新增cuid=0, 修完根治
-- 前置: 备份段先行并核对行数=312944(或执行日实查数); 低峰执行(31万行UPDATE)
-- 回滚: UPDATE decoration.decorationactivityitem SET cuid = 0 WHERE cuid IS NULL AND createTime = '2023-06-02 23:12:09';
--      (或从bak表按daiId还原)
-- 验证: SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE cuid = 0; -- 期望0
-- 幂等: cuid=0守卫, 重跑零影响
-- ============================================================

-- ---------- 0. 备份段(先行, 核对行数) ----------
CREATE TABLE IF NOT EXISTS bak_activityitem_cuid0_20261111 AS
SELECT daiId, cuid, createTime FROM decoration.decorationactivityitem WHERE cuid = 0;
-- 期望 312944 行(2026-11-09实证); SELECT COUNT(*) FROM bak_activityitem_cuid0_20261111; 核对后继续

-- ---------- 1. 修复 ----------
UPDATE decoration.decorationactivityitem SET cuid = NULL WHERE cuid = 0;
-- 期望影响 312944 行

-- ---------- 2. 验证 ----------
SELECT COUNT(*) remaining FROM decoration.decorationactivityitem WHERE cuid = 0;
-- 期望: 0
SELECT COUNT(*) null_cuid FROM decoration.decorationactivityitem WHERE createTime = '2023-06-02 23:12:09' AND cuid IS NULL;
-- 期望: =备份行数
