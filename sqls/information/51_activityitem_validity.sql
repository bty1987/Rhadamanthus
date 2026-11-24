-- =====================================================================
-- 用途: information.activityitem 增加物品级有效期两列(阶梯奖品 type=30 判窗用)
--       口径: 物品窗口优先级高于 activity 窗口, 逐边界独立兜底
--       (effectiveStart = item.startTime ?? activity.startTime, effectiveEnd 同理, null=该边界不设限)
--       其余类型(券0/物1/红包2/额度族10/11/12)不涉窗, 列留空即可
-- 前置: 无依赖; 与 information+decoration+payment 三 jar 同批上线(老 jar 读到新列无感知, 新 jar 需列存在)
-- 幂等: 只加列不删改; 重复执行报 Duplicate column, 以验证语句为准
-- 回滚: ALTER TABLE information.activityitem DROP COLUMN startTime, DROP COLUMN endTime;
--       (窗口配置值随列删除, 上线后录入的物品窗口需重新配置; 代码侧对两列判空, 回滚后行为=回退活动窗, 可安全回退)
-- 验证: SELECT COLUMN_NAME FROM information_schema.COLUMNS
--       WHERE TABLE_SCHEMA='information' AND TABLE_NAME='activityitem' AND COLUMN_NAME IN ('startTime','endTime');
--       -- 期望 2 行
-- =====================================================================

ALTER TABLE information.activityitem ADD COLUMN startTime datetime NULL COMMENT '物品有效期起(阶梯奖品判窗, 空=逐边界回退活动窗口)';
ALTER TABLE information.activityitem ADD COLUMN endTime   datetime NULL COMMENT '物品有效期止(阶梯奖品判窗, 空=逐边界回退活动窗口)';
