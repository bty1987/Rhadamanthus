ALTER TABLE `platform`.`customerservicecomplaint` 
CHANGE COLUMN `complaintType` `type` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintLevel` `level` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintTime` `createTime` DATE NOT NULL ,
CHANGE COLUMN `complaintStatus` `status` TINYINT(4) NOT NULL ,
CHANGE COLUMN `complaintHandle` `handle` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `complaintHandleTime` `handleTime` DATE NOT NULL ,
CHANGE COLUMN `complaintDes` `des` VARCHAR(256) NOT NULL ;