-- ======================================================================
-- construction 模块「前端可配置 + 按公司差异化」功能表结构与种子数据
-- 对应 decorationFunction / paymentFunction 同类机制
-- type: 0=类型(页面分组) 1=api 2=条件 3=字段 4=功能(按钮)
-- subtype: 0=单值覆盖 1=数组追加
-- ======================================================================

-- ----------------------------------------------------------------------
-- 1. 主数据表: construction.constructionfunction (功能项目录)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `construction`.`constructionfunction` (
  `cfid`     BIGINT       NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(64)  NOT NULL COMMENT '页面标识(type=0时为页面分组名, 其余行为空或所属页面)',
  `key`      VARCHAR(128) NOT NULL COMMENT '点分配置路径 如 pageBtn.collect / condArr / apiPage',
  `value`    VARCHAR(255) NOT NULL COMMENT '配置值(type=1时为api路径 如 construction.pageConstruction)',
  `type`     SMALLINT     NOT NULL DEFAULT 0 COMMENT '0类型 1api 2条件 3字段 4功能',
  `subtype`  SMALLINT     NOT NULL DEFAULT 0 COMMENT '0单值 1数组追加',
  `comment`  VARCHAR(255) DEFAULT NULL COMMENT '说明',
  `sort`     SMALLINT     NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`cfid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='施工-前端功能配置项主数据';

-- ----------------------------------------------------------------------
-- 2. 权限绑定表: platform.constructionfunctionright (页面+功能项+公司)
--    按公司差异化配置的关键: company 维度
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `platform`.`constructionfunctionright` (
  `cfrrid` BIGINT      NOT NULL AUTO_INCREMENT,
  `name`   VARCHAR(64) NOT NULL COMMENT '页面标识(对应页面 depage 参数)',
  `cfid`   BIGINT      NOT NULL COMMENT '关联 construction.constructionfunction.cfid',
  `company` INT        NOT NULL DEFAULT 0 COMMENT '公司cid',
  PRIMARY KEY (`cfrrid`),
  KEY `idx_name_company` (`name`, `company`),
  KEY `idx_cfid` (`cfid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='施工-前端功能配置项公司权限绑定';

-- ======================================================================
-- 3. 种子数据: construction 主页面 (name='construction')
--    初始默认开启常用条件/字段/按钮, 各公司可自行在配置页调整
-- ======================================================================

-- 页面分组 (type=0)
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('construction','construction','construction',0,0,'施工管理主页面',1);

-- api 配置 (type=1): 列表分页接口
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('construction','apiPage','api.construction.pageConstructionForBase',1,0,'施工列表分页接口',1);

-- 条件 condArr (type=2, subtype=1 追加) - key 对应 condition/construction.js 中定义的规则名
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('construction','condArr','construction-orderId',2,1,'装修单号',1),
('construction','condArr','construction-village-name',2,1,'楼盘',2),
('construction','condArr','construction-houseNumber-name',2,1,'楼号',3),
('construction','condArr','construction-designer',2,1,'设计师',4),
('construction','condArr','construction-projectStatus',2,1,'工程状态',5),
('construction','condArr','construction-process',2,1,'施工状态',6),
('construction','condArr','construction-startTime',2,1,'开工时间',7),
('construction','condArr','construction-endTime',2,1,'完工时间',8);

-- 字段 propertyArr (type=3, subtype=1 追加) - key 对应 construction.js 中 lineprops 的 field
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('construction','propertyArr','decoration',3,1,'装修单',1),
('construction','propertyArr','village',3,1,'楼盘',2),
('construction','propertyArr','houseNumber',3,1,'楼号',3),
('construction','propertyArr','customer',3,1,'客户',4),
('construction','propertyArr','designer',3,1,'设计师',5),
('construction','propertyArr','supervisor',3,1,'监理',6),
('construction','propertyArr','orderTotalPrice',3,1,'总价',7),
('construction','propertyArr','version',3,1,'报价版本',8),
('construction','propertyArr','buildArea',3,1,'面积',9),
('construction','propertyArr','projectStatus',3,1,'工程状态',10),
('construction','propertyArr','process',3,1,'施工状态',11),
('construction','propertyArr','createTime',3,1,'创建时间',12),
('construction','propertyArr','startTime',3,1,'开工时间',13),
('construction','propertyArr','endTime',3,1,'完工时间',14),
('construction','propertyArr','finishTime',3,1,'验收时间',15),
('construction','propertyArr','period',3,1,'预计工期',16),
('construction','propertyArr','processTime',3,1,'竣工交付时间',17),
('construction','propertyArr','accessoryLimit',3,1,'辅料额上限',18),
('construction','propertyArr','salaryLimit',3,1,'工费上限',19),
('construction','propertyArr','accessory',3,1,'辅料控制',20),
('construction','propertyArr','balanceStatus',3,1,'结算状态',21),
('construction','propertyArr','terminalStatus',3,1,'终止状态',22);

-- 功能 pageBtn (type=4, subtype=1 追加) - key 形如 pageBtn.xxx, xxx 对应 construction.js 按钮标识
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('construction','pageBtn','info',4,1,'信息',1),
('construction','pageBtn','view',4,1,'查看',2),
('construction','pageBtn','record',4,1,'记录',3),
('construction','pageBtn','addReduce',4,1,'增减项',4),
('construction','pageBtn','rework',4,1,'返工',5),
('construction','pageBtn','constructionNode',4,1,'工程节点',6),
('construction','pageBtn','workerSalary',4,1,'工人工费',7),
('construction','pageBtn','accessory',4,1,'工程辅料',8),
('construction','pageBtn','update',4,1,'更新',9),
('construction','pageBtn','accessoryOpen',4,1,'辅料开启',10),
('construction','pageBtn','accessoryLock',4,1,'辅料锁定',11),
('construction','pageBtn','balance',4,1,'结算',12),
('construction','pageBtn','terminal',4,1,'终止',13);

-- ======================================================================
-- 4. 其余列表页种子数据: supervision / acceptance / inspection / allocation / qualiter
--    各页页面名与前端 getConfig 参数一致
-- ======================================================================

-- -------------------- supervision (施工节点) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('supervision','supervision','supervision',0,0,'施工节点页面',2),
('supervision','apiPage','api.construction.pageConstruction',1,0,'施工节点分页接口',1),
('supervision','condArr','decoration-orderId',2,1,'装修单号',1),
('supervision','condArr','decoration-village',2,1,'楼盘',2),
('supervision','condArr','decoration-houseNumber',2,1,'楼号',3),
('supervision','condArr','decoration-designer',2,1,'设计师',4),
('supervision','condArr','decoration-projectStatus',2,1,'工程状态',5),
('supervision','propertyArr','orderId',3,1,'装修单',1),
('supervision','propertyArr','village',3,1,'楼盘',2),
('supervision','propertyArr','houseNumber',3,1,'楼号',3),
('supervision','propertyArr','customer',3,1,'客户',4),
('supervision','propertyArr','designer',3,1,'设计师',5),
('supervision','propertyArr','supervisor',3,1,'监理',6),
('supervision','propertyArr','orderTotalPrice',3,1,'总价',7),
('supervision','propertyArr','buildArea',3,1,'面积',8),
('supervision','propertyArr','version',3,1,'报价版本',9),
('supervision','propertyArr','projectStatus',3,1,'进度',10),
('supervision','pageBtn','info',4,1,'信息',1),
('supervision','pageBtn','view',4,1,'施工节点',2),
('supervision','pageBtn','addReduce',4,1,'增减项',3),
('supervision','pageBtn','money',4,1,'扣款',4),
('supervision','pageBtn','quota',4,1,'定额材料',5),
('supervision','pageBtn','quopt',4,1,'定额工费',6),
('supervision','pageBtn','normtime',4,1,'定额工时',7);

-- -------------------- acceptance (验收) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('acceptance','acceptance','acceptance',0,0,'验收页面',3),
('acceptance','apiPage','api.construction.pageConstructionForAcceptance',1,0,'验收分页接口',1),
('acceptance','condArr','decoration-orderId',2,1,'装修单号',1),
('acceptance','condArr','decoration-village',2,1,'楼盘',2),
('acceptance','condArr','decoration-houseNumber',2,1,'楼号',3),
('acceptance','condArr','decoration-designer',2,1,'设计师',4),
('acceptance','condArr','construction-supervisor',2,1,'监理',5),
('acceptance','condArr','decoration-projectStatus',2,1,'工程状态',6),
('acceptance','condArr','construction-acceptanceFlag',2,1,'验收标识',7),
('acceptance','propertyArr','orderId',3,1,'装修单',1),
('acceptance','propertyArr','village',3,1,'楼盘',2),
('acceptance','propertyArr','houseNumber',3,1,'楼号',3),
('acceptance','propertyArr','customer',3,1,'客户',4),
('acceptance','propertyArr','designerDept',3,1,'设计部门',5),
('acceptance','propertyArr','designer',3,1,'设计师',6),
('acceptance','propertyArr','supervisor',3,1,'监理',7),
('acceptance','propertyArr','buildArea',3,1,'面积',8),
('acceptance','propertyArr','orderTotalPrice',3,1,'合同额',9),
('acceptance','propertyArr','version',3,1,'报价版本',10),
('acceptance','propertyArr','projectStatus',3,1,'进度',11),
('acceptance','pageBtn','view',4,1,'验收',1);

-- -------------------- inspection (巡检) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('inspection','inspection','inspection',0,0,'巡检页面',4),
('inspection','apiPage','api.construction.pageConstruction',1,0,'巡检分页接口',1),
('inspection','condArr','decoration-orderId',2,1,'装修单号',1),
('inspection','condArr','decoration-village',2,1,'楼盘',2),
('inspection','condArr','decoration-houseNumber',2,1,'楼号',3),
('inspection','condArr','decoration-designer',2,1,'设计师',4),
('inspection','condArr','construction-supervisor',2,1,'监理',5),
('inspection','condArr','decoration-projectStatus',2,1,'工程状态',6),
('inspection','propertyArr','orderId',3,1,'装修单',1),
('inspection','propertyArr','village',3,1,'楼盘',2),
('inspection','propertyArr','houseNumber',3,1,'楼号',3),
('inspection','propertyArr','customer',3,1,'客户',4),
('inspection','propertyArr','designerDept',3,1,'设计部门',5),
('inspection','propertyArr','designer',3,1,'设计师',6),
('inspection','propertyArr','supervisor',3,1,'监理',7),
('inspection','propertyArr','buildArea',3,1,'面积',8),
('inspection','propertyArr','orderTotalPrice',3,1,'合同额',9),
('inspection','propertyArr','version',3,1,'报价版本',10),
('inspection','propertyArr','projectStatus',3,1,'进度',11),
('inspection','pageBtn','view',4,1,'记录',1);

-- -------------------- allocation (调拨) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('allocation','allocation','allocation',0,0,'调拨页面',5),
('allocation','apiPage','api.construction.pageConstruction',1,0,'调拨分页接口',1),
('allocation','condArr','decoration-orderId',2,1,'装修单号',1),
('allocation','condArr','decoration-village',2,1,'楼盘',2),
('allocation','condArr','decoration-houseNumber',2,1,'楼号',3),
('allocation','condArr','decoration-designer',2,1,'设计师',4),
('allocation','condArr','decoration-projectStatus',2,1,'工程状态',5),
('allocation','propertyArr','orderId',3,1,'装修单',1),
('allocation','propertyArr','village',3,1,'楼盘',2),
('allocation','propertyArr','houseNumber',3,1,'楼号',3),
('allocation','propertyArr','customer',3,1,'客户',4),
('allocation','propertyArr','designer',3,1,'设计师',5),
('allocation','propertyArr','supervisor',3,1,'监理',6),
('allocation','propertyArr','orderTotalPrice',3,1,'总价',7),
('allocation','propertyArr','buildArea',3,1,'面积',8),
('allocation','propertyArr','version',3,1,'报价版本',9),
('allocation','propertyArr','projectStatus',3,1,'进度',10),
('allocation','pageBtn','qualiter',4,1,'质检',1),
('allocation','pageBtn','info',4,1,'信息',2),
('allocation','pageBtn','view',4,1,'施工节点',3);

-- -------------------- qualiter (质检) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('qualiter','qualiter','qualiter',0,0,'质检页面',6),
('qualiter','apiPage','api.construction.pageConstructionForQualiter',1,0,'质检分页接口',1),
('qualiter','condArr','decoration-orderId',2,1,'装修单号',1),
('qualiter','condArr','decoration-village',2,1,'楼盘',2),
('qualiter','condArr','decoration-houseNumber',2,1,'楼号',3),
('qualiter','condArr','decoration-designer',2,1,'设计师',4),
('qualiter','condArr','decoration-projectStatus',2,1,'工程状态',5),
('qualiter','propertyArr','orderId',3,1,'装修单',1),
('qualiter','propertyArr','village',3,1,'楼盘',2),
('qualiter','propertyArr','houseNumber',3,1,'楼号',3),
('qualiter','propertyArr','customer',3,1,'客户',4),
('qualiter','propertyArr','designer',3,1,'设计师',5),
('qualiter','propertyArr','user',3,1,'施工人员',6),
('qualiter','propertyArr','orderTotalPrice',3,1,'总价',7),
('qualiter','propertyArr','version',3,1,'报价版本',8),
('qualiter','propertyArr','buildArea',3,1,'面积',9),
('qualiter','propertyArr','projectStatus',3,1,'进度',10),
('qualiter','propertyArr','creater',3,1,'创建人',11),
('qualiter','propertyArr','createTime',3,1,'创建时间',12),
('qualiter','propertyArr','status',3,1,'状态',13),
('qualiter','pageBtn','info',4,1,'信息',1),
('qualiter','pageBtn','view',4,1,'施工节点',2);

-- ======================================================================
-- 5. 其余列表页种子数据: customer 系列 / supervision4rework / drawline /
--    accessory / diary / schedule / info / plan / record / qualiter4detail
-- ======================================================================

-- -------------------- customer (客服控制主表) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('customer','customer','customer',0,0,'客服控制主表',7),
('customer','apiPage','api.construction.pageConstruction',1,0,'客服控制分页接口',1),
('customer','condArr','decoration-orderId',2,1,'装修单号',1),
('customer','condArr','decoration-village',2,1,'楼盘',2),
('customer','condArr','decoration-houseNumber',2,1,'楼号',3),
('customer','condArr','decoration-designer',2,1,'设计师',4),
('customer','condArr','decoration-projectStatus',2,1,'工程状态',5),
('customer','propertyArr','orderId',3,1,'装修单',1),
('customer','propertyArr','village',3,1,'楼盘',2),
('customer','propertyArr','houseNumber',3,1,'楼号',3),
('customer','propertyArr','customer',3,1,'客户',4),
('customer','propertyArr','designerDept',3,1,'设计部门',5),
('customer','propertyArr','designer',3,1,'设计师',6),
('customer','propertyArr','supervisor',3,1,'监理',7),
('customer','propertyArr','orderTotalPrice',3,1,'总价',8),
('customer','propertyArr','buildArea',3,1,'面积',9),
('customer','propertyArr','version',3,1,'报价版本',10),
('customer','propertyArr','projectStatus',3,1,'进度',11),
('customer','pageBtn','view',4,1,'施工节点',1);

-- -------------------- customer4complaint (投诉) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('customer4complaint','customer4complaint','customer4complaint',0,0,'投诉页面',8),
('customer4complaint','apiPage','api.construction.pageCustomerServiceComplaint',1,0,'投诉分页接口',1),
('customer4complaint','propertyArr','customerName',3,1,'客户名',1),
('customer4complaint','propertyArr','createrName',3,1,'创建人',2),
('customer4complaint','propertyArr','operaterName',3,1,'操作人',3),
('customer4complaint','propertyArr','level',3,1,'等级',4),
('customer4complaint','propertyArr','type',3,1,'类型',5),
('customer4complaint','propertyArr','createTime',3,1,'时间',6),
('customer4complaint','propertyArr','des',3,1,'备注',7),
('customer4complaint','propertyArr','status',3,1,'状态',8),
('customer4complaint','propertyArr','handle',3,1,'处理信息',9),
('customer4complaint','pageBtn','edit',4,1,'处理',1),
('customer4complaint','pageBtn','del',4,1,'删除',2);

-- -------------------- customer4feedback (回访) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('customer4feedback','customer4feedback','customer4feedback',0,0,'回访页面',9),
('customer4feedback','apiPage','api.construction.pageCustomerServiceBackVisit',1,0,'回访分页接口',1),
('customer4feedback','propertyArr','orderAddr',3,1,'楼盘地址',1),
('customer4feedback','propertyArr','customerName',3,1,'客户名',2),
('customer4feedback','propertyArr','backVisitTime',3,1,'时间',3),
('customer4feedback','propertyArr','backVisitType',3,1,'类型',4),
('customer4feedback','propertyArr','backVisitDes',3,1,'备注',5),
('customer4feedback','pageBtn','edit',4,1,'编辑',1),
('customer4feedback','pageBtn','del',4,1,'删除',2);

-- -------------------- customer4guarantee (保修) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('customer4guarantee','customer4guarantee','customer4guarantee',0,0,'保修页面',10),
('customer4guarantee','apiPage','api.construction.pageCustomerServiceGuarantee',1,0,'保修分页接口',1),
('customer4guarantee','propertyArr','customerName',3,1,'客户名',1),
('customer4guarantee','propertyArr','guaranteeTime',3,1,'时间',2),
('customer4guarantee','propertyArr','guaranteeDes',3,1,'备注',3),
('customer4guarantee','pageBtn','edit',4,1,'编辑',1),
('customer4guarantee','pageBtn','del',4,1,'删除',2);

-- -------------------- supervision4rework (返工) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('supervision4rework','supervision4rework','supervision4rework',0,0,'返工信息列表',11),
('supervision4rework','apiPage','api.construction.pageReworkByOrderId',1,0,'返工分页接口',1),
('supervision4rework','propertyArr','createrName',3,1,'创建人',1),
('supervision4rework','propertyArr','createTime',3,1,'返工时间',2),
('supervision4rework','propertyArr','reworkDes',3,1,'返工说明',3),
('supervision4rework','pageBtn','view',4,1,'图纸',1),
('supervision4rework','pageBtn','edit',4,1,'编辑',2),
('supervision4rework','pageBtn','del',4,1,'删除',3);

-- -------------------- inspection4record (巡检记录) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('inspection4record','inspection4record','inspection4record',0,0,'巡检记录',12),
('inspection4record','apiPage','api.construction.pageInspectionRecordByOrderId',1,0,'巡检记录分页接口',1),
('inspection4record','propertyArr','orderAddr',3,1,'楼盘地址',1),
('inspection4record','propertyArr','operaterName',3,1,'操作人',2),
('inspection4record','propertyArr','startTime',3,1,'开始时间',3),
('inspection4record','propertyArr','endTime',3,1,'结束时间',4),
('inspection4record','propertyArr','recordDes',3,1,'备注',5),
('inspection4record','pageBtn','edit',4,1,'编辑',1),
('inspection4record','pageBtn','del',4,1,'删除',2);

-- -------------------- drawline4apply (放线申请) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('drawline4apply','drawline4apply','drawline4apply',0,0,'放线申请',13),
('drawline4apply','apiPage','api.construction.pageDrawLine',1,0,'放线申请分页接口',1),
('drawline4apply','condArr','decoration-orderId',2,1,'装修单号',1),
('drawline4apply','condArr','decoration-village',2,1,'楼盘',2),
('drawline4apply','condArr','decoration-houseNumber',2,1,'楼号',3),
('drawline4apply','condArr','construction-drawLine-status',2,1,'状态',4),
('drawline4apply','condArr','construction-drawLine-applayTime',2,1,'申请时间',5),
('drawline4apply','condArr','construction-drawLine-actualDate',2,1,'实际放线日期',6),
('drawline4apply','propertyArr','orderId',3,1,'装修单',1),
('drawline4apply','propertyArr','village',3,1,'楼盘',2),
('drawline4apply','propertyArr','houseNumber',3,1,'楼号',3),
('drawline4apply','propertyArr','customer',3,1,'客户',4),
('drawline4apply','propertyArr','designer',3,1,'设计师',5),
('drawline4apply','propertyArr','supervisor',3,1,'监理',6),
('drawline4apply','propertyArr','buildArea',3,1,'面积',7),
('drawline4apply','propertyArr','orderTotalPrice',3,1,'合同额',8),
('drawline4apply','propertyArr','version',3,1,'报价版本',9),
('drawline4apply','propertyArr','appler',3,1,'申请人',10),
('drawline4apply','propertyArr','applayTime',3,1,'申请时间',11),
('drawline4apply','propertyArr','count',3,1,'放线次数',12),
('drawline4apply','propertyArr','content',3,1,'描述',13),
('drawline4apply','pageBtn','info',4,1,'信息',1),
('drawline4apply','pageBtn','pretreat',4,1,'预放线',2),
('drawline4apply','pageBtn','update',4,1,'更新',3),
('drawline4apply','pageBtn','draw',4,1,'放线',4),
('drawline4apply','pageBtn','reset',4,1,'重置',5);

-- -------------------- drawline4user (人员部署) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('drawline4user','drawline4user','drawline4user',0,0,'人员部署',14),
('drawline4user','apiPage','api.construction.pageConstruction',1,0,'人员部署分页接口',1),
('drawline4user','condArr','decoration-orderId',2,1,'装修单号',1),
('drawline4user','condArr','decoration-village',2,1,'楼盘',2),
('drawline4user','condArr','decoration-houseNumber',2,1,'楼号',3),
('drawline4user','condArr','decoration-designer',2,1,'设计师',4),
('drawline4user','propertyArr','orderId',3,1,'装修单',1),
('drawline4user','propertyArr','village',3,1,'楼盘',2),
('drawline4user','propertyArr','houseNumber',3,1,'楼号',3),
('drawline4user','propertyArr','customer',3,1,'客户',4),
('drawline4user','propertyArr','designer',3,1,'设计师',5),
('drawline4user','propertyArr','supervisor',3,1,'监理',6),
('drawline4user','propertyArr','buildArea',3,1,'面积',7),
('drawline4user','propertyArr','orderTotalPrice',3,1,'合同额',8),
('drawline4user','propertyArr','version',3,1,'报价版本',9),
('drawline4user','propertyArr','createTime',3,1,'创建时间',10),
('drawline4user','propertyArr','projectStatus',3,1,'进度',11),
('drawline4user','propertyArr','status',3,1,'状态',12),
('drawline4user','pageBtn','deploy',4,1,'人员部署',1);

-- -------------------- accessory (工程辅料) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('accessory','accessory','accessory',0,0,'工程辅料',15),
('accessory','apiPage','api.construction.pageConstructionAccessory',1,0,'工程辅料分页接口',1),
('accessory','propertyArr','goodsNo',3,1,'商品编号',1),
('accessory','propertyArr','category',3,1,'品类',2),
('accessory','propertyArr','brand',3,1,'品牌',3),
('accessory','propertyArr','measurementUnit',3,1,'单位',4),
('accessory','propertyArr','accessoriesType',3,1,'辅类名称',5),
('accessory','propertyArr','numLimit',3,1,'数量限制',6),
('accessory','propertyArr','num',3,1,'数量',7),
('accessory','propertyArr','total',3,1,'总额',8),
('accessory','propertyArr','checkup',3,1,'验证标识',9),
('accessory','pageBtn','update',4,1,'更新',1);

-- -------------------- constructionDiary (施工日志) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('constructionDiary','constructionDiary','constructionDiary',0,0,'施工日志',16),
('constructionDiary','apiPage','api.construction.pageConstructionDiary',1,0,'施工日志分页接口',1),
('constructionDiary','condArr','decoration-orderId',2,1,'装修单号',1),
('constructionDiary','condArr','construction-diary-isUpload',2,1,'是否上传图片',2),
('constructionDiary','propertyArr','decoration',3,1,'装修单',1),
('constructionDiary','propertyArr','atttype',3,1,'类型',2),
('constructionDiary','propertyArr','cnid',3,1,'工程状态',3),
('constructionDiary','propertyArr','isUpload',3,1,'是否上传图片',4),
('constructionDiary','propertyArr','creater',3,1,'创建人',5),
('constructionDiary','propertyArr','content',3,1,'内容',6),
('constructionDiary','propertyArr','createTime',3,1,'创建时间',7),
('constructionDiary','pageBtn','picture',4,1,'图片',1);

-- -------------------- constructionSchedule (施工进度) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('constructionSchedule','constructionSchedule','constructionSchedule',0,0,'施工进度',17),
('constructionSchedule','apiPage','api.construction.pageConstructionSchedule',1,0,'施工进度分页接口',1),
('constructionSchedule','condArr','decoration-orderId',2,1,'装修单号',1),
('constructionSchedule','condArr','decoration-village',2,1,'楼盘',2),
('constructionSchedule','condArr','decoration-houseNumber',2,1,'楼号',3),
('constructionSchedule','condArr','decoration-designer',2,1,'设计师',4),
('constructionSchedule','condArr','construction-supervisor',2,1,'监理',5),
('constructionSchedule','condArr','decoration-projectStatus',2,1,'工程状态',6),
('constructionSchedule','condArr','constructionSchedule-status',2,1,'状态',7),
('constructionSchedule','condArr','constructionSchedule-planStatus',2,1,'预估工费状态',8),
('constructionSchedule','condArr','constructionSchedule-additemStatus',2,1,'附加项状态',9),
('constructionSchedule','propertyArr','orderId',3,1,'装修单',1),
('constructionSchedule','propertyArr','village',3,1,'楼盘',2),
('constructionSchedule','propertyArr','houseNumber',3,1,'楼号',3),
('constructionSchedule','propertyArr','customer',3,1,'客户',4),
('constructionSchedule','propertyArr','designer',3,1,'设计师',5),
('constructionSchedule','propertyArr','supervisor',3,1,'监理',6),
('constructionSchedule','propertyArr','orderTotalPrice',3,1,'总价',7),
('constructionSchedule','propertyArr','contractPrice',3,1,'合同额',8),
('constructionSchedule','propertyArr','version',3,1,'报价版本',9),
('constructionSchedule','propertyArr','buildArea',3,1,'面积',10),
('constructionSchedule','propertyArr','projectStatus',3,1,'工程状态',11),
('constructionSchedule','propertyArr','startTime',3,1,'开工时间',12),
('constructionSchedule','propertyArr','endTime',3,1,'完工时间',13),
('constructionSchedule','propertyArr','period',3,1,'工期',14),
('constructionSchedule','propertyArr','planSalary',3,1,'预估工费',15),
('constructionSchedule','propertyArr','planStatus',3,1,'预估工费状态',16),
('constructionSchedule','pageBtn','updateNorm',4,1,'更新定额',1),
('constructionSchedule','pageBtn','updateCale',4,1,'更新比例',2),
('constructionSchedule','pageBtn','updatePeriod',4,1,'更新工期',3),
('constructionSchedule','pageBtn','planSalary',4,1,'确认预估',4),
('constructionSchedule','pageBtn','additem',4,1,'附加项',5);

-- -------------------- constructionInfo (工程信息) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('constructionInfo','constructionInfo','constructionInfo',0,0,'工程信息',18),
('constructionInfo','apiPage','api.construction.pageConstructionInfo',1,0,'工程信息分页接口',1),
('constructionInfo','condArr','decoration-orderId',2,1,'装修单号',1),
('constructionInfo','condArr','decoration-village',2,1,'楼盘',2),
('constructionInfo','condArr','decoration-houseNumber',2,1,'楼号',3),
('constructionInfo','condArr','decoration-designer',2,1,'设计师',4),
('constructionInfo','condArr','decoration-supervisor',2,1,'监理',5),
('constructionInfo','condArr','decoration-houseType',2,1,'房屋类型',6),
('constructionInfo','condArr','decoration-designStatus',2,1,'设计状态',7),
('constructionInfo','condArr','decoration-projectStatus',2,1,'工程状态',8),
('constructionInfo','propertyArr','orderId',3,1,'装修单',1),
('constructionInfo','propertyArr','village',3,1,'楼盘',2),
('constructionInfo','propertyArr','houseNumber',3,1,'楼号',3),
('constructionInfo','propertyArr','customer',3,1,'客户',4),
('constructionInfo','propertyArr','designerFatherDept',3,1,'设计分区',5),
('constructionInfo','propertyArr','designerDept',3,1,'设计部',6),
('constructionInfo','propertyArr','designer',3,1,'设计师',7),
('constructionInfo','propertyArr','salesman',3,1,'业务员',8),
('constructionInfo','propertyArr','escorter',3,1,'方案设计',9),
('constructionInfo','propertyArr','supervisor',3,1,'监理',10),
('constructionInfo','propertyArr','status',3,1,'装修状态',11),
('constructionInfo','propertyArr','designStatus',3,1,'设计完成状态',12),
('constructionInfo','propertyArr','typeness',3,1,'装修业务',13),
('constructionInfo','propertyArr','buildArea',3,1,'面积',14),
('constructionInfo','propertyArr','orderTotalPrice',3,1,'合同额',15),
('constructionInfo','propertyArr','version',3,1,'报价版本',16),
('constructionInfo','propertyArr','contractTime',3,1,'签单时间',17),
('constructionInfo','propertyArr','projectStatus',3,1,'工程状态',18),
('constructionInfo','propertyArr','handoverStatus',3,1,'交接状态',19),
('constructionInfo','propertyArr','comment',3,1,'备注',20),
('constructionInfo','pageBtn','view',4,1,'记录',1),
('constructionInfo','pageBtn','service',4,1,'服务',2),
('constructionInfo','pageBtn','conplanPrint',4,1,'打印',3),
('constructionInfo','pageBtn','conplan',4,1,'施工计划',4),
('constructionInfo','pageBtn','proLine',4,1,'预派监理',5),
('constructionInfo','pageBtn','check',4,1,'验房',6),
('constructionInfo','pageBtn','handover',4,1,'交接',7),
('constructionInfo','pageBtn','profile',4,1,'画像',8),
('constructionInfo','pageBtn','constructionTag',4,1,'工程标签',9),
('constructionInfo','pageBtn','resetDesign',4,1,'重置设计',10);

-- -------------------- constructionPlan (施工计划) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('constructionPlan','constructionPlan','constructionPlan',0,0,'施工计划',19),
('constructionPlan','apiPage','api.construction.queryConstructionPlanByOrderId',1,0,'施工计划分页接口',1),
('constructionPlan','propertyArr','orderId',3,1,'装修单',1),
('constructionPlan','propertyArr','pacenodeName',3,1,'工程节点(定额)',2),
('constructionPlan','propertyArr','nodeName',3,1,'工程节点',3),
('constructionPlan','propertyArr','connum',3,1,'工程天数',4),
('constructionPlan','propertyArr','prenum',3,1,'前置间隔天数',5),
('constructionPlan','propertyArr','postnum',3,1,'后置间隔天数',6),
('constructionPlan','propertyArr','createTime',3,1,'创建时间',7),
('constructionPlan','propertyArr','conStartTime',3,1,'工程开始时间',8),
('constructionPlan','propertyArr','conEndTime',3,1,'工程结束时间',9),
('constructionPlan','propertyArr','comnum',3,1,'主材天数',10),
('constructionPlan','propertyArr','comStartTime',3,1,'主材开始时间',11),
('constructionPlan','propertyArr','comEndTime',3,1,'主材结束时间',12),
('constructionPlan','propertyArr','phase',3,1,'施工节点',13),
('constructionPlan','propertyArr','material',3,1,'配套主材',14),
('constructionPlan','propertyArr','period',3,1,'进场周期',15),
('constructionPlan','propertyArr','comment',3,1,'说明',16),
('constructionPlan','propertyArr','content',3,1,'注释',17),
('constructionPlan','pageBtn','edit',4,1,'编辑',1),
('constructionPlan','pageBtn','up',4,1,'上移',2),
('constructionPlan','pageBtn','down',4,1,'下移',3),
('constructionPlan','pageBtn','del',4,1,'删除',4);

-- -------------------- constructionRecord (施工记录) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('constructionRecord','constructionRecord','constructionRecord',0,0,'施工记录',20),
('constructionRecord','apiPage','api.construction.queryConstructionRecordByOrderId',1,0,'施工记录分页接口',1),
('constructionRecord','propertyArr','orderId',3,1,'装修单',1),
('constructionRecord','propertyArr','operater',3,1,'操作人',2),
('constructionRecord','propertyArr','operateTime',3,1,'操作时间',3),
('constructionRecord','propertyArr','comment',3,1,'说明',4);

-- -------------------- qualiter4detail (质检详情) --------------------
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('qualiter4detail','qualiter4detail','qualiter4detail',0,0,'质检详情',21),
('qualiter4detail','apiPage','api.construction.queryQualiter',1,0,'质检详情分页接口',1),
('qualiter4detail','propertyArr','orderId',3,1,'装修单',1),
('qualiter4detail','propertyArr','creater',3,1,'创建人',2),
('qualiter4detail','propertyArr','createTime',3,1,'创建时间',3),
('qualiter4detail','propertyArr','status',3,1,'状态',4),
('qualiter4detail','pageBtn','del',4,1,'删除',1);

-- ======================================================================
-- 6. 默认权限: 为公司 cid=0 (总/默认公司) 初始化所有页面的全部配置项
--    新公司首次访问时, 可参照 decorationFunction 的 sync 逻辑同步
-- ======================================================================
INSERT INTO `platform`.`constructionfunctionright` (`name`, `cfid`, `company`)
SELECT f.name, f.cfid, 0
FROM `construction`.`constructionfunction` f
WHERE f.`type` != 0;
