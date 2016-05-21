DROP TABLE IF EXISTS decorationorderdesigndepartmentright;
CREATE TABLE decorationorderdesigndepartmentright (
  doddrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  dId int(11) NOT NULL,
  PRIMARY KEY (doddrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单设计部权限';

DROP TABLE IF EXISTS decorationordersalesmandepartmentright;
CREATE TABLE decorationordersalesmandepartmentright (
  dosdrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  dId int(11) NOT NULL,
  PRIMARY KEY (dosdrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单业务部权限';

DROP TABLE IF EXISTS decorationorderstatusright;
CREATE TABLE decorationorderstatusright (
  dosrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  status varchar(10) NOT NULL,
  PRIMARY KEY (dosrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单状态权限';

DROP TABLE IF EXISTS logininfo;
CREATE TABLE logininfo (
  liId int(11) NOT NULL AUTO_INCREMENT,
  loginFlag varchar(32) NOT NULL,
  code int(11) NOT NULL DEFAULT -1 COMMENT '-1 无确认, 0 成功 , 其他错误码',
  message varchar(64) NOT NULL DEFAULT '',
  authentication varchar(512) NOT NULL DEFAULT '',
  optime bigint(20) NOT NULL,
  PRIMARY KEY (liId),
  KEY indexone (loginFlag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='二维码登陆信息';

alter table decorationorder change orderSupervisorId supervisorId varchar(15) DEFAULT NULL COMMENT '监理编号';

alter table decorationorder change orderInspectionId inspectionId varchar(15) DEFAULT NULL COMMENT '巡检编号';

alter table decorationorder change contractOperateUserId contractUserId varchar(15) DEFAULT NULL COMMENT '签约操作人';

alter table decorationorder add column depositTime timestamp NULL DEFAULT NULL COMMENT '定金时间';

alter table waterwaycircuitpowerconstructionschedule drop column waterwayWorkerSalary;
alter table waterwaycircuitpowerconstructionschedule drop column circuitWorkerSalary;
alter table waterwaycircuitpowerconstructionschedule drop column powerWorkerSalary;

alter table waterwaycircuitpowerconstructionschedule drop column waterwayWorkerRaty;
alter table waterwaycircuitpowerconstructionschedule drop column waterwayWorkerRatyDes;
alter table waterwaycircuitpowerconstructionschedule drop column circuitWorkerRaty;
alter table waterwaycircuitpowerconstructionschedule drop column circuitWorkerRatyDes;
alter table waterwaycircuitpowerconstructionschedule drop column powerWorkerRaty;
alter table waterwaycircuitpowerconstructionschedule drop column powerWorkerRatyDes;

alter table bricklayconstructionschedule drop column workerSalary;
alter table bricklayconstructionschedule drop column workerRaty;
alter table bricklayconstructionschedule drop column workerRatyDes;

alter table groundlevelingconstructionschedule drop column workerSalary;
alter table groundlevelingconstructionschedule drop column workerRaty;
alter table groundlevelingconstructionschedule drop column workerRatyDes;

alter table carpentconstructionschedule drop column workerSalary;
alter table carpentconstructionschedule drop column workerRaty;
alter table carpentconstructionschedule drop column workerRatyDes;

alter table oilconstructionschedule drop column workerSalary;
alter table oilconstructionschedule drop column workerRaty;
alter table oilconstructionschedule drop column workerRatyDes;

alter table waterwaycircuitcheckconstructionschedule drop column waterwayWorkerSalary;
alter table waterwaycircuitcheckconstructionschedule drop column circuitWorkerSalary;
alter table waterwaycircuitcheckconstructionschedule drop column powerWorkerSalary;

alter table waterwaycircuitcheckconstructionschedule drop column waterwayWorkerRaty;
alter table waterwaycircuitcheckconstructionschedule drop column waterwayWorkerRatyDes;
alter table waterwaycircuitcheckconstructionschedule drop column circuitWorkerRaty;
alter table waterwaycircuitcheckconstructionschedule drop column circuitWorkerRatyDes;
alter table waterwaycircuitcheckconstructionschedule drop column powerWorkerRaty;
alter table waterwaycircuitcheckconstructionschedule drop column powerWorkerRatyDes;

alter table cleaningconstructionschedule drop column workerSalary;
alter table cleaningconstructionschedule drop column workerRaty;
alter table cleaningconstructionschedule drop column workerRatyDes;

alter table chandrawing drop column operatorName;
alter table chandrawing drop column operateTime;

alter table putlinedrawing drop column operatorName;
alter table putlinedrawing drop column operateTime;

alter table waterwaycircuitpowerdrawing drop column operatorName;
alter table waterwaycircuitpowerdrawing drop column operateTime;

alter table bricklaydrawing drop column operatorName;
alter table bricklaydrawing drop column operateTime;

alter table groundlevelingdrawing drop column operatorName;
alter table groundlevelingdrawing drop column operateTime;

alter table carpentdrawing drop column operatorName;
alter table carpentdrawing drop column operateTime;

alter table oildrawing drop column operatorName;
alter table oildrawing drop column operateTime;

alter table waterwaycircuitcheckdrawing drop column operatorName;
alter table waterwaycircuitcheckdrawing drop column operateTime;

alter table cleaningdrawing drop column operatorName;
alter table cleaningdrawing drop column operateTime;

alter table chandrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table putlinedrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table waterwaycircuitpowerdrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table bricklaydrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table groundlevelingdrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table carpentdrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table oildrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table waterwaycircuitcheckdrawing add column type tinyint(4) NOT NULL DEFAULT 0;
alter table cleaningdrawing add column type tinyint(4) NOT NULL DEFAULT 0;

alter table chandrawing modify column drawingName varchar(15);
alter table putlinedrawing modify column drawingName varchar(15);
alter table waterwaycircuitpowerdrawing modify column drawingName varchar(15);
alter table bricklaydrawing modify column drawingName varchar(15);
alter table groundlevelingdrawing modify column drawingName varchar(15);
alter table carpentdrawing modify column drawingName varchar(15);
alter table oildrawing modify column drawingName varchar(15);
alter table waterwaycircuitcheckdrawing modify column drawingName varchar(15);
alter table cleaningdrawing modify column drawingName varchar(15);

alter table chandrawing modify column drawingAddUrl varchar(256);
alter table putlinedrawing modify column drawingAddUrl varchar(256);
alter table waterwaycircuitpowerdrawing modify column drawingAddUrl varchar(256);
alter table bricklaydrawing modify column drawingAddUrl varchar(256);
alter table groundlevelingdrawing modify column drawingAddUrl varchar(256);
alter table carpentdrawing modify column drawingAddUrl varchar(256);
alter table oildrawing modify column drawingAddUrl varchar(256);
alter table waterwaycircuitcheckdrawing modify column drawingAddUrl varchar(256);
alter table cleaningdrawing modify column drawingAddUrl varchar(256);

alter table materialModel add column status tinyint(4) NOT NULL DEFAULT 0;

alter table quotationitem add column status tinyint(4) NOT NULL DEFAULT 0;