DROP TABLE IF EXISTS receipttype;
CREATE TABLE receipttype (
  rtId int(11) NOT NULL AUTO_INCREMENT,
  name varchar(36) NOT NULL,
  `key` varchar(36) NOT NULL,
  subjectName varchar(64) NOT NULL,
  oneCode varchar(6) NOT NULL,
  twoCode varchar(4) NOT NULL,
  thrCode varchar(4) NOT NULL,
  direction tinyint(4) NOT NULL COMMENT '余额方向,借 1, 贷 -1',
  `type` varchar(32) NOT NULL,
  status tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (rtId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE quotationItem ADD COLUMN discount tinyint(4) NOT NULL DEFAULT 0;
ALTER TABLE quotationItem CHANGE COLUMN autoId qiId BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE quotationfunctionarea CHANGE COLUMN autoId qfaId BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE quotation CHANGE COLUMN autoId qId BIGINT(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE quotation CHANGE COLUMN quotationContent content varchar(45) DEFAULT NULL;

ALTER TABLE functionarea CHANGE COLUMN autoId faId BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE functionAreaQuoteItem CHANGE COLUMN autoId faiId BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE systemdefineitem CHANGE COLUMN autoId sdiId BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE addreduce CHANGE COLUMN addReduceType type tinyint(4) NOT NULL COMMENT '0 增项 1 减项 2 漏项';
ALTER TABLE addreduce CHANGE COLUMN addReduceTotal total decimal(10,3) NOT NULL;
ALTER TABLE addreduce CHANGE COLUMN addReduceStatus status tinyint(4) NOT NULL COMMENT '0 未提交 1、已提交/未付款 2、已付款 3、已确认  ';
ALTER TABLE addreduce CHANGE COLUMN addReduceDes content varchar(256) NOT NULL;
ALTER TABLE addreduce CHANGE COLUMN orderPaymentId dpId bigint(20) DEFAULT NULL COMMENT '对应收款编号';

DROP TABLE IF EXISTS quotationfunctionareaitem;
CREATE TABLE quotationfunctionareaitem (
  qfaiId int(11) NOT NULL AUTO_INCREMENT,
  itemName varchar(128) NOT NULL,
  measurementUnit varchar(10) NOT NULL,
  workType varchar(15) NOT NULL,
  unitPrice decimal(10,3) NOT NULL,
  num decimal(10,3) NOT NULL,
  discount tinyint(4) NOT NULL DEFAULT 1,
  type tinyint(4) NOT NULL,
  quotationFunctionAreaId bigint(20) NOT NULL,
  quotationItemId bigint(20),
  content varchar(256),
  PRIMARY KEY (qfaiId),
  KEY indexone (quotationFunctionAreaId),
  KEY indextwo (quotationItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS addreduceitem;
CREATE TABLE addreduceitem (
  ariId bigint(20) NOT NULL AUTO_INCREMENT,
  arId int(11) NOT NULL COMMENT '增减项编号',
  itemName varchar(128) NOT NULL,
  type tinyint(4) NOT NULL DEFAULT '0' COMMENT '0报价项 , 1自定义报价项目',
  measurementUnit varchar(10) NOT NULL,
  workType int(15) NOT NULL,
  unitPrice decimal(10,3) NOT NULL DEFAULT '0.000',
  num decimal(10,3) NOT NULL DEFAULT '0.000',
  quotationFunctionAreaId bigint(20) NOT NULL COMMENT '所属报价功能区编号',
  quoteItemId bigint(20),
  content varchar(512) DEFAULT NULL,
  PRIMARY KEY (ariId),
  KEY indexone (arId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='增减项目';

update quotationitem set quotationTypeId = 1; # 添加系统类型
update functionarea set functionAreaType = 1; # 功能区全部为普通

DROP TABLE IF EXISTS decorationpicture;
CREATE TABLE decorationpicture (
  dpId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  name varchar(32) NOT NULL,
  path varchar(256) NOT NULL,
  uploadTime timestamp NULL DEFAULT NULL,
  content varchar(45) DEFAULT NULL,
  userId varchar(15) NOT NULL,
  type int(11) NOT NULL COMMENT '1 设计效果图 2、工程制图CAD',
  PRIMARY KEY (dpId),
  KEY indexone (orderId,uploadTime,type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计图纸';

DROP TABLE IF EXISTS budgetaudit;