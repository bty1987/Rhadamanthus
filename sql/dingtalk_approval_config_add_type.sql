-- 增量迁移脚本：给现有 dingtalk_approval_config 表添加 type 字段，并插入通用审批配置

-- 1. 添加 type 字段
ALTER TABLE `approval`.`dingtalk_approval_config`
  ADD COLUMN `type` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0=通用审批(approve/refuse) 1=专用审批(反射调用)' AFTER `handleAgreeOnly`;

-- 2. 将 beanClass/methodName 改为允许 NULL (通用审批不需要这些字段)
ALTER TABLE `approval`.`dingtalk_approval_config`
  MODIFY COLUMN `beanClass` VARCHAR(200) NULL COMMENT 'Spring Bean全限定类名(专用审批必填)',
  MODIFY COLUMN `methodName` VARCHAR(100) NULL COMMENT '方法名(专用审批必填)';

-- 3. 插入通用审批配置 (原来硬编码在 DingTalkCallbackServiceImpl 中的3个 codes)
INSERT INTO `approval`.`dingtalk_approval_config`
  (`processCode`, `name`, `fieldId`, `beanClass`, `methodName`, `voClass`, `handleAgreeOnly`, `type`, `enabled`, `companyId`)
VALUES
  ('PROC-EF6YJDXRN2-2EQFBYULQQ5CPGGVZAUU1-ME75EHVI-9', '主材退款审批',
    NULL, NULL, NULL, NULL,
    0, 0, 1, 0),
  ('PROC-9B7CBC59-96FB-4941-BF01-608DB3E37C5E', '装修终审审批',
    NULL, NULL, NULL, NULL,
    0, 0, 1, 0),
  ('PROC-5750A51A-05FE-42B8-BB5E-4FBA28B939B6', '装修归属审批',
    NULL, NULL, NULL, NULL,
    0, 0, 1, 0);
