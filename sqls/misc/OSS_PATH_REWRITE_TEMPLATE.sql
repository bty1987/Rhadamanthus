-- =====================================================================
-- 用途: OSS存量迁移·path列批量改写模板(FastDFS相对路径 → 完整OSS URL)
--       适用于所有含FastDFS格式path列的资源表, 每表一份实例化副本
--       本文件为模板, 变量以 ${} 标注, 实例化时替换; 首个试点表为 communion.signet
-- 前置: 1) 该表已完成 ossimport 对象迁移且校验通过(manifest.verified=1)
--       2) 生产低峰窗口执行(建议周六22:00后)
--       3) 确认 oss.url.base 与目标桶一致(fl-prod-erp)
-- 回滚: 见文件尾部【回滚】段(备份表按主键回填 / 前缀剥离, 二选一)
-- 验证: 见文件尾部【验证】段(残留计数应为0 + 抽样格式核对)
-- 幂等: LIKE 'group%' 守卫保证重复执行不产生双前缀
-- =====================================================================

-- ${TABLE}       = 库.表名, 如 decoration.decorationpicture
-- ${PK}          = 主键列, 如 dpId
-- ${PATH_COL}    = 路径列, 如 path
-- ${BACKUP_NAME} = 备份表名, 如 decoration.bak_decorationpicture_path_20261103
-- ${OSS_BASE}    = https://fl-prod-erp.oss-cn-beijing.aliyuncs.com

-- ---------------------------------------------------------------------
-- 1. 备份表(回滚保命, 只备份将被改写的老格式行)
-- ---------------------------------------------------------------------
CREATE TABLE ${BACKUP_NAME} AS
SELECT ${PK}, ${PATH_COL} AS old_path
FROM ${TABLE}
WHERE ${PATH_COL} LIKE 'group%';

-- 核对备份行数与下面统计一致后再进行改写
SELECT COUNT(*) AS to_rewrite FROM ${TABLE} WHERE ${PATH_COL} LIKE 'group%';

-- ---------------------------------------------------------------------
-- 2. 分批改写(主键区间, 5万/批; ${FROM_ID}/${TO_ID} 按主键区间切片)
--    每批执行后跑一次【验证】中的残留计数, 递减核对
-- ---------------------------------------------------------------------
UPDATE ${TABLE}
SET ${PATH_COL} = CONCAT('${OSS_BASE}/', ${PATH_COL})
WHERE ${PK} BETWEEN ${FROM_ID} AND ${TO_ID}
  AND ${PATH_COL} LIKE 'group%';

-- ---------------------------------------------------------------------
-- 验证
-- ---------------------------------------------------------------------
-- 残留老格式计数: 全部批次跑完应为 0
SELECT COUNT(*) AS remaining FROM ${TABLE} WHERE ${PATH_COL} LIKE 'group%';

-- 新格式计数(应等于 to_rewrite)
SELECT COUNT(*) AS rewritten FROM ${TABLE} WHERE ${PATH_COL} LIKE 'https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/group%';

-- 抽样格式核对(取10条新改写的行, 确认无双前缀/截断)
SELECT ${PK}, ${PATH_COL} FROM ${TABLE}
WHERE ${PATH_COL} LIKE 'https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/group%'
ORDER BY ${PK} DESC LIMIT 10;

-- ---------------------------------------------------------------------
-- 回滚(二选一)
-- ---------------------------------------------------------------------
-- 方式A: 备份表按主键回填(精确, 推荐)
-- UPDATE ${TABLE} t
-- JOIN ${BACKUP_NAME} b ON t.${PK} = b.${PK}
-- SET t.${PATH_COL} = b.old_path;

-- 方式B: 前缀剥离(无备份表时的兜底, 前缀确定性保证等价)
-- UPDATE ${TABLE}
-- SET ${PATH_COL} = REPLACE(${PATH_COL}, '${OSS_BASE}/', '')
-- WHERE ${PATH_COL} LIKE 'https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/group%';
