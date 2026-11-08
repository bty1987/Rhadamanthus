-- ============================================================
-- activityrule 加 grade 列(阶梯奖品等级号)
-- 用途: 阶梯抽奖活动——activityrule ruleType=5(阶梯奖品行)的等级号(1=一等奖/2=二等奖/3=三等奖),
--      发放引擎按 sort(优先级)升序降级发放, grade 用于等级展示与约束
-- 前置: 无(只加列); 🔴必须先于 jar 执行(ActivityRulePO 映射新列, 硬依赖)
-- 回滚: ALTER TABLE information.activityrule DROP COLUMN grade(仅限未产生业务数据前)
-- 验证: SHOW COLUMNS FROM information.activityrule LIKE 'grade';
-- 幂等: 存储过程判列存在(MySQL 5.x 无 ADD COLUMN IF NOT EXISTS, 照40号先例), 可重跑
-- ============================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS tmp_add_grade_48 $$

CREATE PROCEDURE tmp_add_grade_48()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'information' AND TABLE_NAME = 'activityrule' AND COLUMN_NAME = 'grade'
    ) THEN
        ALTER TABLE information.activityrule ADD COLUMN grade TINYINT NULL COMMENT '等级号(1=一等奖/2=二等奖/3=三等奖,阶梯奖品行专用)';
    END IF;
END $$

DELIMITER ;

CALL tmp_add_grade_48();

DROP PROCEDURE IF EXISTS tmp_add_grade_48;

-- 验证
SHOW COLUMNS FROM information.activityrule LIKE 'grade';
