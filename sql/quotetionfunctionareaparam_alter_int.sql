-- ============================================================
-- 功能区参数表字段类型修改脚本
-- ============================================================
-- 表名: quotetion.quotetionfunctionareaparam
-- 目的: 将数值字段从 DECIMAL 改为 INT，统一使用整数存储（毫米）
-- 创建时间: 2026-04-07
-- ============================================================

USE quotetion;

-- 修改字段类型：DECIMAL -> INT
ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN girth INT DEFAULT 0 COMMENT '周长（毫米）- 对应公式变量 {a}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN area INT DEFAULT 0 COMMENT '面积（平方毫米）- 对应公式变量 {b}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN height INT DEFAULT 0 COMMENT '举架（毫米）- 对应公式变量 {c}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN holeLength INT DEFAULT 0 COMMENT '洞面长度（毫米）- 对应公式变量 {d}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN holeHeight INT DEFAULT 0 COMMENT '洞面高度（毫米）- 对应公式变量 {e}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN windowLength INT DEFAULT 0 COMMENT '窗面长度（毫米）- 对应公式变量 {f}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN windowHeight INT DEFAULT 0 COMMENT '窗面高度（毫米）- 对应公式变量 {g}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN beamLength INT DEFAULT 0 COMMENT '梁长（毫米）- 对应公式变量 {h}';

ALTER TABLE quotetionfunctionareaparam
MODIFY COLUMN beamHeight INT DEFAULT 0 COMMENT '梁高（毫米）- 对应公式变量 {i}';

-- ============================================================
-- 数据迁移说明：
-- 如果表中已有数据，需要先将 DECIMAL 值转换为整数（乘以1000）
-- ============================================================

-- 数据迁移（仅在有旧数据时执行）
-- UPDATE quotetionfunctionareaparam SET
--     girth = CAST(girth * 1000 AS SIGNED),
--     area = CAST(area * 1000 AS SIGNED),
--     height = CAST(height * 1000 AS SIGNED),
--     holeLength = CAST(holeLength * 1000 AS SIGNED),
--     holeHeight = CAST(holeHeight * 1000 AS SIGNED),
--     windowLength = CAST(windowLength * 1000 AS SIGNED),
--     windowHeight = CAST(windowHeight * 1000 AS SIGNED),
--     beamLength = CAST(beamLength * 1000 AS SIGNED),
--     beamHeight = CAST(beamHeight * 1000 AS SIGNED);

-- ============================================================
-- 验证修改结果
-- ============================================================
-- DESC quotetion.quotetionfunctionareaparam;
-- SELECT * FROM quotetion.quotetionfunctionareaparam LIMIT 5;
