
ALTER TABLE `platform`.`chanconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`putlineconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`waterwaycircuitpowerconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`bricklayconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`groundlevelingconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`carpentconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`oilconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`cleaningconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`waterwaycircuitcheckconstructionschedule` 
DROP COLUMN `qualityRatyDes`,
DROP COLUMN `qualityRaty`,
DROP COLUMN `supervisorRatyDes`,
DROP COLUMN `supervisorRaty`;

ALTER TABLE `platform`.`customerservicecomplaint` 
CHANGE COLUMN `complaintType` `type` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintLevel` `level` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintTime` `createTime` DATE NOT NULL ,
CHANGE COLUMN `complaintStatus` `status` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintHandle` `handle` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `complaintHandleTime` `handleTime` DATE NOT NULL ,
CHANGE COLUMN `complaintDes` `des` VARCHAR(256) NOT NULL;

ALTER TABLE `platform`.`materialsuborderitem` 
DROP COLUMN `paymentStatus`;

ALTER TABLE `platform`.`approvalmaterialrefund` 
ADD COLUMN `type` TINYINT(4) NOT NULL AFTER `refund`;

DROP TABLE IF EXISTS materialsuborderbalance;
CREATE TABLE materialsuborderbalance (
  msobId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  createrId varchar(15) NOT NULL,
  instorerId varchar(15),
  posterId varchar(15),
  balanceTime timestamp NULL NOT NULL,
  balance decimal(10,3) NOT NULL DEFAULT '0.000',
  difference decimal(10,3) NOT NULL DEFAULT '0.000',
  vbalance decimal(10,3) NOT NULL DEFAULT '0.000',
  vbalanceTime timestamp NULL NOT NULL,
  status tinyint(4) NOT NULL DEFAULT '0',
  type tinyint(4) NOT NULL,
  ident int(11) NOT NULL,
  PRIMARY KEY (msobId),
  KEY indexone (msoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单结算表';