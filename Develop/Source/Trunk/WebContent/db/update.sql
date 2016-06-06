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

DROP TABLE IF EXISTS quotationfunctionareaitem;
CREATE TABLE quotationfunctionareaitem (
  qfaiId int(11) NOT NULL AUTO_INCREMENT,
  itemName varchar(128) NOT NULL,
  measurementUnit varchar(10) NOT NULL,
  unitPrice decimal(10,3) NOT NULL,
  num decimal(10,3) NOT NULL,
  type tinyint(4) NOT NULL,
  quotationFunctionAreaId bigint(20) NOT NULL,
  quotationItemId bigint(20),
  content varchar(256),
  PRIMARY KEY (qfaiId),
  KEY indexone (functionAreaId),
  KEY indextwo (quotationItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

) ENGINE=InnoDB DEFAULT CHARSET=utf8;
