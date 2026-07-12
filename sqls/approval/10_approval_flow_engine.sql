-- ============================================================
-- 审批流程引擎 - 新增流转模型表
-- 用于支持配置化审批流、或签/并签/会签、前置表单、后置业务影响
-- 设计原则:
--   1. 不改动现有 approval/process/processItem/approver 表,完全兼容现有审批与钉钉链路
--   2. 现有 approval 表保持单 receiver 模型不变,新表作为可选的"流程实例层"叠加
--   3. 表名/字段名全部驼峰,与现有 approval 模块风格一致
-- ============================================================

-- ------------------------------------------------------------
-- 1. approvalFlow  审批流程定义
--    一个 businessType + company 对应一条启用的流程定义(多版本通过 status 切换)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalFlow` (
  `flowId`       bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '流程定义ID',
  `code`         varchar(64)  NOT NULL                COMMENT '流程编码(业务唯一键,如 DECORATION_CONTRACT)',
  `name`         varchar(100) NOT NULL                COMMENT '流程名称',
  `businessType` smallint(6)  NOT NULL                COMMENT '业务审批类型,对应 ApprovalPO.APPROVAL_TYPE_*',
  `version`      int(11)      NOT NULL DEFAULT 1      COMMENT '版本号',
  `status`       smallint(6)  NOT NULL DEFAULT 0      COMMENT '状态:0=启用 1=禁用',
  `company`      int(11)      NOT NULL DEFAULT 0      COMMENT '公司ID,0=全公司通用',
  `comment`      varchar(255) DEFAULT NULL            COMMENT '流程说明',
  `createTime`   timestamp    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`flowId`),
  UNIQUE KEY `uk_code_company_version` (`code`, `company`, `version`),
  KEY `idx_businessType_company_status` (`businessType`, `company`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批流程定义';

-- ------------------------------------------------------------
-- 2. approvalFlowNode  审批流程节点定义
--    一个流程包含多个节点,按 nodeSeq 顺序流转
--    nodeType 决定节点审批模式:串行/并签/或签/会签
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalFlowNode` (
  `nodeId`         bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '节点定义ID',
  `flowId`         bigint(20)   NOT NULL                COMMENT '所属流程定义ID',
  `nodeSeq`        smallint(6)  NOT NULL                COMMENT '节点顺序(从1开始)',
  `nodeName`       varchar(100) NOT NULL                COMMENT '节点名称(如:部门经理审批)',
  `nodeType`       smallint(6)  NOT NULL DEFAULT 1      COMMENT '节点类型:1=串行 2=并签(全通过) 3=或签(任一通过) 4=会签(按比例)',
  `approverRule`   smallint(6)  NOT NULL DEFAULT 0      COMMENT '审批人规则:0=指定人 1=直属上级 2=部门负责人 3=角色 4=发起人自选 5=表达式',
  `approverData`   text         DEFAULT NULL            COMMENT '规则数据(JSON):指定人["uid1","uid2"]/角色{"role":"X"}/表达式{"expr":"..."}',
  `passRatio`      decimal(4,2) DEFAULT NULL            COMMENT '会签通过比例(0~1),仅 nodeType=4 时生效',
  `timeoutHours`   int(11)      DEFAULT NULL            COMMENT '超时小时数(NULL=不超时)',
  `autoAction`     smallint(6)  NOT NULL DEFAULT 0      COMMENT '超时动作:0=无 1=自动通过 2=自动拒绝',
  `skipCondition`  varchar(500) DEFAULT NULL            COMMENT '跳过条件表达式(如 amount<10000 则跳过本节点)',
  `preHandler`     varchar(500) DEFAULT NULL            COMMENT '前置处理器(beanClass#methodName),提交时校验/准备表单数据',
  `postHandler`    varchar(500) DEFAULT NULL            COMMENT '后置处理器(beanClass#methodName),审批通过后触发业务影响',
  `rejectStrategy` smallint(6)  NOT NULL DEFAULT 0      COMMENT '驳回策略:0=整体驳回 1=回退上一节点 2=回退发起人',
  `status`         smallint(6)  NOT NULL DEFAULT 0      COMMENT '状态:0=启用 1=禁用',
  PRIMARY KEY (`nodeId`),
  KEY `idx_flowId_status_seq` (`flowId`, `status`, `nodeSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批流程节点定义';

-- ------------------------------------------------------------
-- 3. approvalTask  审批任务(运行时实例)
--    每个节点的每个审批人产生一条任务;并签/或签/会签通过同 nodeId 多任务判定
--    通过 approval.aid 关联现有审批主表(不破坏现有 ApprovalPO 模型)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalTask` (
  `taskId`      bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `aid`         bigint(20)   NOT NULL                COMMENT '关联审批主表 aid(approval.aid)',
  `flowId`      bigint(20)   NOT NULL                COMMENT '流程定义ID(冗余,便于查询)',
  `nodeId`      bigint(20)   NOT NULL                COMMENT '节点定义ID',
  `nodeSeq`     smallint(6)  NOT NULL                COMMENT '节点顺序(冗余)',
  `nodeType`    smallint(6)  NOT NULL                COMMENT '节点类型(冗余,判定时用)',
  `assigneeId`  varchar(50)  NOT NULL                COMMENT '审批人 userId',
  `status`      smallint(6)  NOT NULL DEFAULT 0      COMMENT '任务状态:0=待办 1=通过 2=拒绝 3=转交 4=已失效(并签/或签终结) 5=超时自动处理',
  `action`      varchar(20)  DEFAULT NULL            COMMENT '动作:agree/refuse/transfer/timeout(冗余记录)',
  `comment`     varchar(500) DEFAULT NULL            COMMENT '审批意见',
  `transferTo`  varchar(50)  DEFAULT NULL            COMMENT '转交目标 userId(status=3时)',
  `assignTime`  timestamp    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '任务分配时间',
  `actionTime`  timestamp    NULL DEFAULT NULL       COMMENT '审批动作时间',
  PRIMARY KEY (`taskId`),
  KEY `idx_aid_nodeId` (`aid`, `nodeId`),
  KEY `idx_assignee_status` (`assigneeId`, `status`),
  KEY `idx_flowId_nodeSeq` (`flowId`, `nodeSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批任务(运行时实例)';
