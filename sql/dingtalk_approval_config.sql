-- 钉钉审批回调配置表
-- 数据驱动审批回调，通过 type 区分：专用审批(1)反射调用 / 通用审批(0)approve-refuse
CREATE TABLE `dingtalk_approval_config` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `processCode`      VARCHAR(100)  NOT NULL                COMMENT '钉钉审批模板code',
  `name`             VARCHAR(100)  NOT NULL                COMMENT '配置名称',
  `fieldId`          VARCHAR(100)  NULL                    COMMENT '表单字段ID，用于提取orderId',
  `beanClass`        VARCHAR(200)  NULL                    COMMENT 'Spring Bean全限定类名(专用审批必填)',
  `methodName`       VARCHAR(100)  NULL                    COMMENT '方法名(专用审批必填)',
  `voClass`          VARCHAR(200)  NULL                    COMMENT 'VO类全限定名，构造方法接收orderId',
  `handleAgreeOnly`  TINYINT(1)    NOT NULL DEFAULT 1      COMMENT '1=只处理agree 0=处理agree+refuse',
  `type`             TINYINT(1)    NOT NULL DEFAULT 1      COMMENT '0=通用审批(approve/refuse) 1=专用审批(反射调用)',
  `enabled`          TINYINT(1)    NOT NULL DEFAULT 1      COMMENT '1=启用 0=禁用',
  `companyId`        INT           NOT NULL DEFAULT 0      COMMENT '公司ID',
  `createTime`       TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_processCode_company` (`processCode`, `companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='钉钉审批回调配置表';

-- ========== 专用审批 (type=1)：通过反射调用 Spring Bean 方法 ==========
-- 方法签名约定: void methodName(XXXVo(orderId), String userId) throws FLException
INSERT INTO `dingtalk_approval_config` (`processCode`, `name`, `fieldId`, `beanClass`, `methodName`, `voClass`, `handleAgreeOnly`, `type`, `enabled`, `companyId`) VALUES
('PROC-EEA1011C-8ABD-47F1-983F-68F3D5EA1D4A', '合同重签审批',
  'TextField-IG4N9OD3',
  'com.fanglin.decoration.service.impl.DecorationContractServiceImpl', 'resignDecorationContract',
  'com.fanglin.decoration.vo.DecorationContractVO',
  1, 1, 1, 0),

('PROC-94A6270F-10A1-45E4-B9A3-86EB39ED0D6E', '装修订单作废审批',
  'TextField-IG4UCGW1',
  'com.fanglin.decoration.service.impl.DecorationServiceImpl', 'obsoleteDecoration',
  'com.fanglin.decoration.vo.DecorationVO',
  1, 1, 1, 0),

('PROC-B852629C-D4F7-44E1-A9E2-6E1F830E38CB', '装修决算生成审批',
  'TextField-K2AD4O5B',
  'com.fanglin.decoration.service.impl.DecorationAccountServiceImpl', 'makeDecorationAccount',
  'com.fanglin.decoration.vo.DecorationAccountVO',
  1, 1, 1, 0);

-- ========== 通用审批 (type=0)：走 approve/refuse 逻辑，无需 beanClass/methodName ==========
INSERT INTO `dingtalk_approval_config` (`processCode`, `name`, `fieldId`, `beanClass`, `methodName`, `voClass`, `handleAgreeOnly`, `type`, `enabled`, `companyId`) VALUES
('PROC-EF6YJDXRN2-2EQFBYULQQ5CPGGVZAUU1-ME75EHVI-9', '主材退款审批',
  NULL, NULL, NULL, NULL,
  0, 0, 1, 0),

('PROC-9B7CBC59-96FB-4941-BF01-608DB3E37C5E', '装修终审审批',
  NULL, NULL, NULL, NULL,
  0, 0, 1, 0),

('PROC-5750A51A-05FE-42B8-BB5E-4FBA28B939B6', '装修归属审批',
  NULL, NULL, NULL, NULL,
  0, 0, 1, 0);
