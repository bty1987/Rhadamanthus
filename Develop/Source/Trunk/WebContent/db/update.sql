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