
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

