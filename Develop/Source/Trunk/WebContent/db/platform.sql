CREATE DATABASE  IF NOT EXISTS `platform` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `platform`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS acceptance;
CREATE TABLE acceptance (
  actId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  acceptanceTime date NOT NULL,
  waterwayQuality tinyint(4) DEFAULT NULL,
  waterwayServer tinyint(4) DEFAULT NULL,
  waterwayHygiene tinyint(4) DEFAULT NULL,
  waterwayDes varchar(256) DEFAULT NULL,
  circuitQuality tinyint(4) DEFAULT NULL,
  circuitServer tinyint(4) DEFAULT NULL,
  circuitHygiene tinyint(4) DEFAULT NULL,
  circuitDes varchar(256) DEFAULT NULL,
  bricklayQuality tinyint(4) DEFAULT NULL,
  bricklayServer tinyint(4) DEFAULT NULL,
  bricklayHygiene tinyint(4) DEFAULT NULL,
  bricklayDes varchar(256) DEFAULT NULL,
  carpentQuality tinyint(4) DEFAULT NULL,
  carpentServer tinyint(4) DEFAULT NULL,
  carpentHygiene tinyint(4) DEFAULT NULL,
  carpentDes varchar(256) DEFAULT NULL,
  oilQuality tinyint(4) DEFAULT NULL,
  oilServer tinyint(4) DEFAULT NULL,
  oilHygiene tinyint(4) DEFAULT NULL,
  oilDes varchar(256) DEFAULT NULL,
  supervisQuality tinyint(4) DEFAULT NULL,
  supervisServer tinyint(4) DEFAULT NULL,
  supervisHygiene tinyint(4) DEFAULT NULL,
  supervisDes varchar(256) DEFAULT NULL,
  materialQuality tinyint(4) DEFAULT NULL,
  materialServer tinyint(4) DEFAULT NULL,
  materialDes varchar(256) DEFAULT NULL,
  question varchar(256) DEFAULT NULL,
  propose varchar(256) DEFAULT NULL,
  multiple tinyint(4) DEFAULT NULL,
  internal tinyint(4) DEFAULT NULL,
  PRIMARY KEY (actId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客服回访表';

DROP TABLE IF EXISTS actionlog;
CREATE TABLE actionlog (
  alId int(11) NOT NULL AUTO_INCREMENT,
  uuid varchar(32) NOT NULL COMMENT '主键',
  actionName varchar(128) NOT NULL,
  createUserId varchar(15) DEFAULT NULL COMMENT '操作人',
  createTime timestamp NULL DEFAULT NULL COMMENT '创建时间',
  runTime int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (alId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作日志表';

DROP TABLE IF EXISTS activity;
CREATE TABLE activity (
  aId int(11) NOT NULL AUTO_INCREMENT,
  activityName varchar(32) NOT NULL,
  createUserId varchar(15) NOT NULL,
  createUserName varchar(32) NOT NULL,
  status tinyint(4) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  startTime timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  endTime timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  content varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (aId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动表';

DROP TABLE IF EXISTS activityitem;
CREATE TABLE activityitem (
  aiId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  activityName varchar(32) NOT NULL,
  activityItemName varchar(32) NOT NULL,
  num int(11) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  money decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (aiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动物品表';

DROP TABLE IF EXISTS addorreducedetail;
CREATE TABLE addorreducedetail (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  arId int(11) NOT NULL COMMENT '增减项编号',
  customerItemId varchar(20) DEFAULT NULL,
  itemId varchar(15) DEFAULT NULL,
  itemName varchar(128) NOT NULL,
  itemType tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目',
  quotationClassificationId int(11) NOT NULL,
  quotationBigCategoryId int(11) NOT NULL,
  measurementUnitId int(11) NOT NULL,
  itemWorkTypeId int(11) NOT NULL,
  quotationItemDes varchar(512) DEFAULT NULL,
  unitPrice decimal(10,3) NOT NULL DEFAULT '0.000',
  num decimal(10,3) NOT NULL DEFAULT '0.000',
  quotationFunctionAreaId bigint(20) NOT NULL COMMENT '所属报价功能区编号',
  PRIMARY KEY (autoId),
  KEY indexone (arId,itemId,itemType,customerItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='增减项明细表';

DROP TABLE IF EXISTS addreduce;
CREATE TABLE addreduce (
  arId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  type tinyint(4) NOT NULL COMMENT '0 增项 1 减项 2 漏项',
  total decimal(10,3) NOT NULL,
  status tinyint(4) NOT NULL COMMENT '0 未提交 1、已提交/未付款 2、已付款 3、已确认  ',
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  content varchar(256) NOT NULL,
  dpId bigint(20) DEFAULT NULL COMMENT '对应收款编号',
  PRIMARY KEY (arId),
  KEY indexone (orderId,type,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='增减项表';
DROP TABLE IF EXISTS addreduceitem;
CREATE TABLE addreduceitem (
  ariId bigint(20) NOT NULL AUTO_INCREMENT,
  arId int(11) NOT NULL COMMENT '增减项编号',
  itemName varchar(128) NOT NULL,
  type tinyint(4) NOT NULL DEFAULT '0' COMMENT '0报价项 , 1自定义报价项目',
  measurementUnit varchar(10) NOT NULL,
  workType varchar(15) NOT NULL,
  unitPrice decimal(10,3) NOT NULL DEFAULT '0.000',
  num decimal(10,3) NOT NULL DEFAULT '0.000',
  quotationFunctionAreaId bigint(20) NOT NULL COMMENT '所属报价功能区编号',
  quoteItemId bigint(20),
  content varchar(512) DEFAULT NULL,
  discount tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (ariId),
  KEY indexone (arId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='增减项目';



DROP TABLE IF EXISTS advancepayment;
CREATE TABLE advancepayment (
  apId int(11) NOT NULL AUTO_INCREMENT,
  customerId int(11) NOT NULL,
  balance decimal(10,3) DEFAULT NULL,
  materialBalance decimal(10,3) DEFAULT '0.000',
  zhenglinBalance decimal(10,3) DEFAULT '0.000',
  projectBalance decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (apId),
  UNIQUE KEY uniqueone (customerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户预付款';

DROP TABLE IF EXISTS advancereceipt;
CREATE TABLE advancereceipt (
  arId int(11) NOT NULL AUTO_INCREMENT,
  collectUserId varchar(15) NOT NULL DEFAULT '',
  collectUserName varchar(32) NOT NULL DEFAULT '',
  collectTime timestamp NULL DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT '',
  confirmUserName varchar(32) NOT NULL DEFAULT '',
  confirmTime timestamp NULL DEFAULT NULL,
  realMoney decimal(10,3) NOT NULL DEFAULT '0.000',
  cash decimal(10,3) NOT NULL DEFAULT '0.000',
  cashInfo varchar(20) DEFAULT NULL,
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankInfo varchar(512) NOT NULL DEFAULT '',
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvBankName varchar(20) NOT NULL DEFAULT '',
  installment decimal(10,3) NOT NULL DEFAULT '0.000',
  installmentBankName varchar(20) NOT NULL DEFAULT '',
  accounts decimal(10,3) NOT NULL DEFAULT '0.000',
  accountsBankName varchar(20) NOT NULL DEFAULT '',
  status tinyint(4) NOT NULL DEFAULT '0',
  receiptType tinyint(4) NOT NULL,
  des varchar(256) NOT NULL DEFAULT '',
  apId int(11) DEFAULT NULL,
  PRIMARY KEY (arId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='预付款项收据表';

DROP TABLE IF EXISTS approval;
CREATE TABLE approval (
  aId int(11) NOT NULL AUTO_INCREMENT,
  receiverId varchar(15) NOT NULL,
  senderId varchar(15) NOT NULL,
  `type` tinyint(4) NOT NULL,
  ident varchar(20) NOT NULL,
  status tinyint(4) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approvalTime timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  contents varchar(256) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (aId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批表';

DROP TABLE IF EXISTS approvalactivity;
CREATE TABLE approvalactivity (
  aaId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  activityId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  activityName varchar(32) NOT NULL,
  `receiveUserId` varchar(15) NOT NULL DEFAULT '',
  `receiveTime` timestamp NOT NULL DEFAULT NULL,
  PRIMARY KEY (aaId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS approvalactivityitem;
CREATE TABLE approvalactivityitem (
  aaiId int(11) NOT NULL AUTO_INCREMENT,
  aaId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  activityName varchar(32) NOT NULL,
  activityItemName varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  num int(11) NOT NULL,
  money decimal(10,3) NOT NULL DEFAULT '0.000',
  content varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (aaiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS approvalcustomer;
CREATE TABLE approvalcustomer (
  acId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  customerId int(11) NOT NULL,
  oldCustomerName varchar(32) NOT NULL,
  oldCustomerPhone varchar(64) NOT NULL,
  newCustomerName varchar(32) NOT NULL,
  newCustomerPhone varchar(64) NOT NULL,
  PRIMARY KEY (acId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户信息修改审批表';

DROP TABLE IF EXISTS approvaldecorationrefund;
CREATE TABLE approvaldecorationrefund (
  adrId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  paymentId int(11) NOT NULL,
  PRIMARY KEY (adrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单退款审批表';

DROP TABLE IF EXISTS `approvalmaterial`;
CREATE TABLE `approvalmaterial` (
  `amId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `msoId` int(11) NOT NULL,
  `refund` decimal(10,3) NOT NULL,
  PRIMARY KEY (`amId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材退货审批表';
DROP TABLE IF EXISTS approvalmaterialfullpayment;
CREATE TABLE approvalmaterialfullpayment (
  amfpId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  msoId int(11) NOT NULL,
  referMoney decimal(10,3) NOT NULL,
  PRIMARY KEY (amfpId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材补款审批表';

DROP TABLE IF EXISTS `approvalmaterialitem`;
CREATE TABLE `approvalmaterialitem` (
  `amiId` int(11) NOT NULL AUTO_INCREMENT,
  `amId` int(11) NOT NULL,
  `msoId` int(11) NOT NULL,
  `msoiId` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `packageName` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`amiId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材退货项审批表';
DROP TABLE IF EXISTS approvalmaterialoutsiderefund;
CREATE TABLE approvalmaterialoutsiderefund (
  amorId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  moId int(11) NOT NULL,
  PRIMARY KEY (amorId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场外退款审批表';

DROP TABLE IF EXISTS approvalmaterialrefund;
CREATE TABLE approvalmaterialrefund (
  amrId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  msoId int(11) NOT NULL,
  refund decimal(10,3) NOT NULL,
  PRIMARY KEY (amrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材退货审批表';

DROP TABLE IF EXISTS approvalmaterialrefunditem;
CREATE TABLE approvalmaterialrefunditem (
  amriId int(11) NOT NULL AUTO_INCREMENT,
  amrId int(11) NOT NULL,
  msoId int(11) NOT NULL,
  msoiId int(11) NOT NULL,
  num decimal(10,3) NOT NULL DEFAULT '0.000',
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  packageName varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (amriId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材退货项审批表';

DROP TABLE IF EXISTS approvalorderbelong;


CREATE TABLE approvalorderbelong (
  aobId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  belongType varchar(10) NOT NULL,
  PRIMARY KEY (aobId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单归属信息修改审批表';

DROP TABLE IF EXISTS approvalorderbelongitem;
CREATE TABLE approvalorderbelongitem (
  aobiId int(11) NOT NULL AUTO_INCREMENT,
  aobId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  belongUserId varchar(15) NOT NULL,
  belongRate decimal(10,3) NOT NULL,
  defaultFlag varchar(5) NOT NULL,
  PRIMARY KEY (aobiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单归属信息审批项表';

DROP TABLE IF EXISTS approvalquotationdiscount;
CREATE TABLE approvalquotationdiscount (
  aqdId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  quotationId bigint(20) NOT NULL,
  oldDiscount decimal(10,3) NOT NULL,
  newDiscount decimal(10,3) NOT NULL,
  `level` tinyint(4) NOT NULL,
  PRIMARY KEY (aqdId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单报价折扣修改审批表';



DROP TABLE IF EXISTS approvalvillage;
CREATE TABLE approvalvillage (
  avId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  oldVillageId varchar(10) NOT NULL,
  oldHouseNumber varchar(30) NOT NULL,
  newVillageId varchar(10) NOT NULL,
  newHouseNumber varchar(30) NOT NULL,
  PRIMARY KEY (avId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单楼盘信息修改审批表';

DROP TABLE IF EXISTS backvisit;
CREATE TABLE backvisit (
  bvId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  senderId varchar(15) NOT NULL,
  createTime timestamp NULL DEFAULT NULL,
  content varchar(128) NOT NULL,
  receiverIds varchar(128),
  PRIMARY KEY (bvId),
  KEY indexone (orderId,grade,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师回访记录表';

DROP TABLE IF EXISTS bricklayconstructionschedule;
CREATE TABLE bricklayconstructionschedule (
  bcsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (bcsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='瓦工工程进度表';

DROP TABLE IF EXISTS bricklayconstructionscheduleworker;
CREATE TABLE bricklayconstructionscheduleworker (
  bcswId int(11) NOT NULL AUTO_INCREMENT,
  bcsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) NOT NULL,
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (bcswId),
  KEY indexone (bcsId,orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='瓦工工程工人表';

DROP TABLE IF EXISTS bricklaydrawing;
CREATE TABLE bricklaydrawing (
  bdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  bcsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (bdId),
  KEY indexone (bcsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='瓦工图纸表';

DROP TABLE IF EXISTS carpentconstructionschedule;
CREATE TABLE carpentconstructionschedule (
  ccsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (ccsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='木工工程进度表';

DROP TABLE IF EXISTS carpentconstructionscheduleworker;
CREATE TABLE carpentconstructionscheduleworker (
  ccswId int(11) NOT NULL AUTO_INCREMENT,
  ccsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (ccswId),
  KEY indexone (csId),
  KEY indextwo (ccsId,workerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='木工工程工人表';

DROP TABLE IF EXISTS carpentdrawing;
CREATE TABLE carpentdrawing (
  cdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  ccsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (cdId),
  KEY indexone (ccsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='木工图纸表';

DROP TABLE IF EXISTS chanconstructionschedule;
CREATE TABLE chanconstructionschedule (
  ccsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerSalary decimal(10,3) DEFAULT '0.000',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  status tinyint(4) NOT NULL DEFAULT '0',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (ccsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='铲大白工程进度表';

DROP TABLE IF EXISTS chandrawing;
CREATE TABLE chandrawing (
  cdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  ccsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (cdId),
  KEY indexone (ccsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='铲大白图纸表';

DROP TABLE IF EXISTS cleaningconstructionschedule;
CREATE TABLE cleaningconstructionschedule (
  ccsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (ccsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='保洁工程进度表';

DROP TABLE IF EXISTS cleaningconstructionscheduleworker;
CREATE TABLE cleaningconstructionscheduleworker (
  ccswId int(11) NOT NULL AUTO_INCREMENT,
  ccsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (ccswId),
  KEY indexone (csId),
  KEY indextwo (ccsId,orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='保洁工程工人表';

DROP TABLE IF EXISTS cleaningdrawing;
CREATE TABLE cleaningdrawing (
  cdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  ccsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (cdId),
  KEY indexone (ccsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='保洁工图纸表';

DROP TABLE IF EXISTS constructionschedule;
CREATE TABLE constructionschedule (
  csId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) DEFAULT '',
  supervisorQualityId varchar(15) DEFAULT '',
  chanQualityId varchar(15) DEFAULT '',
  putlineQualityId varchar(15) DEFAULT '',
  waterwayCircuitPowerQualityId varchar(15) DEFAULT '',
  powerQualityId varchar(15) DEFAULT '',
  bricklayQualityId varchar(15) DEFAULT '',
  carpentQualityId varchar(15) DEFAULT '',
  oilQualityId varchar(15) DEFAULT '',
  cleaningQualityId varchar(15) DEFAULT '',
  schedule tinyint(4) DEFAULT '0',
  chanStatus tinyint(4) DEFAULT '0',
  allocationWorkerFlag int(11) DEFAULT '0',
  PRIMARY KEY (csId),
  KEY indexone (orderId),
  KEY indextwo (supervisorQualityId),
  KEY indexthr (schedule)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工程进度表';

DROP TABLE IF EXISTS customerservicebackvisit;
CREATE TABLE customerservicebackvisit (
  csbvId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  customerName varchar(32) NOT NULL,
  backVisitTime date NOT NULL,
  backVisitType tinyint(4) NOT NULL DEFAULT '0',
  backVisitDes varchar(256) NOT NULL,
  PRIMARY KEY (csbvId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客服回访表';

DROP TABLE IF EXISTS customerservicecomplaint;
CREATE TABLE customerservicecomplaint (
  cscId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  createrId varchar(15) NOT NULL,
  createrName varchar(32) NOT NULL,
  operaterId varchar(15) NOT NULL,
  operaterName varchar(32) NOT NULL,
  complaintType tinyint(4) NOT NULL,
  complaintLevel tinyint(4) NOT NULL,
  complaintTime date NOT NULL,
  complaintStatus tinyint(4) NOT NULL,
  complaintHandle varchar(256) NOT NULL,
  complaintHandleTime date NOT NULL,
  complaintDes varchar(256) NOT NULL,
  PRIMARY KEY (cscId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客服投诉表';

DROP TABLE IF EXISTS customerserviceguarantee;
CREATE TABLE customerserviceguarantee (
  csgId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  guaranteeTime date NOT NULL,
  guaranteeDes varchar(256) NOT NULL,
  PRIMARY KEY (csgId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客服保修表';



DROP TABLE IF EXISTS decorationactivity;
CREATE TABLE decorationactivity (
  daId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  aId int(11) NOT NULL,
  PRIMARY KEY (daId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单活动表';

DROP TABLE IF EXISTS decorationactivityitem;
CREATE TABLE decorationactivityitem (
  daiId int(11) NOT NULL AUTO_INCREMENT,
  aId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  activityName varchar(32) NOT NULL,
  activityItemName varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  state tinyint(4) NOT NULL,
  total int(11) NOT NULL,
  num int(11) NOT NULL,
  money decimal(10,3) NOT NULL DEFAULT '0.000',
  content varchar(32) NOT NULL DEFAULT '',
  receiveUserId varchar(15) NOT NULL DEFAULT '',
  receiveUserName varchar(15) NOT NULL DEFAULT '',
  receiveTime timestamp NOT NULL DEFAULT NULL,
  PRIMARY KEY (daiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单活动物品表';

DROP TABLE IF EXISTS decorationcontract;
CREATE TABLE decorationcontract (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL COMMENT '订单编号',
  additionalInfo varchar(2048) DEFAULT NULL COMMENT '附加条款信息',
  templateHtml varchar(100) DEFAULT NULL COMMENT '合同模板路径',
  signTime timestamp NULL DEFAULT NULL COMMENT '签订时间',
  workingDuration int(11) DEFAULT NULL COMMENT '工期',
  startTime timestamp NULL DEFAULT NULL COMMENT '开工时间',
  endTime timestamp NULL DEFAULT NULL COMMENT '竣工时间',
  contractCode varchar(45) DEFAULT NULL COMMENT '合同编号',
  orderTotalPrice decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (autoId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修合同表';

DROP TABLE IF EXISTS decorationdesignerdepartmentrank;
CREATE TABLE decorationdesignerdepartmentrank (
  dddrId int(11) NOT NULL AUTO_INCREMENT,
  designerDeptId varchar(15) NOT NULL,
  designerDeptName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (dddrId),
  KEY indexone (designerDeptId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工程设计部门业绩排名';

DROP TABLE IF EXISTS decorationdesignerrank;
CREATE TABLE decorationdesignerrank (
  ddrId int(11) NOT NULL AUTO_INCREMENT,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (ddrId),
  KEY indexone (designerId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工程设计师业绩排名';

DROP TABLE IF EXISTS decorationdesignerregionrank;
CREATE TABLE decorationdesignerregionrank (
  ddrrId int(11) NOT NULL AUTO_INCREMENT,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (ddrrId),
  KEY indexone (designerRegionId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工程设计分区业绩排名';

DROP TABLE IF EXISTS decorationorder;
CREATE TABLE decorationorder (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL DEFAULT '',
  customerId bigint(20) NOT NULL COMMENT '客户编号',
  villageId varchar(10) NOT NULL COMMENT '楼盘编号',
  houseNumber varchar(30) NOT NULL COMMENT '门牌号',
  houseType varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  houseClass varchar(10) DEFAULT NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  apartmentType varchar(45) DEFAULT NULL COMMENT '一室一厅、两室一厅、三室两厅、三室一厅、阁楼、别墅',
  houseArea decimal(10,2) DEFAULT '0.00' COMMENT '建筑面积',
  freeArea decimal(10,2) DEFAULT '0.00' COMMENT '赠送面积',
  designerId varchar(15) DEFAULT NULL COMMENT '设计师编号',
  salesmanId varchar(15) DEFAULT NULL COMMENT '业务员编号',
  supervisorId varchar(15) DEFAULT NULL COMMENT '监理编号',
  inspectionId varchar(15) DEFAULT NULL COMMENT '巡检编号',
  notSalesmanName varchar(10) DEFAULT NULL COMMENT '非业务信息',
  notSalesmanPhone varchar(15) DEFAULT NULL,
  notSalesmanContent varchar(100) DEFAULT NULL,
  backOrderName varchar(20) DEFAULT NULL COMMENT '返单信息',
  backOrderPhone varchar(45) DEFAULT NULL,
  backOrderContent varchar(128) DEFAULT NULL,
  contractCode varchar(25) DEFAULT NULL COMMENT '合同号',
  contractUserId varchar(15) DEFAULT NULL COMMENT '签约操作人',
  contractTime timestamp NULL DEFAULT NULL COMMENT '签订合同时间',
  depositTime timestamp NULL DEFAULT NULL COMMENT '定金时间',
  measureTime timestamp NULL DEFAULT NULL,
  createTime timestamp NULL DEFAULT NULL COMMENT '订单创建时间',
  createUser varchar(15) DEFAULT NULL COMMENT '订单创建人',
  status varchar(10) DEFAULT NULL COMMENT '咨询、量房、已报价、定金、已签约、废单、已完工、合同终止',
  projectStatus varchar(10) DEFAULT NULL COMMENT '等待施工、放线申请、放线失败、放线成功、水电申请、水电、水电验收、瓦工申请、瓦工、瓦工验收、木工申请、木工、木工验收、油工申请、油工、油工验收、保洁申请、保洁、保洁验收、',
  paymentStatus varchar(10) DEFAULT NULL COMMENT '预付款、设计费、定金、首付款、首付二期款、二期款、尾款',
  orderType int(11) DEFAULT '1' COMMENT '1 装修订单 2 主材订单',
  versionId varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  orderTotalPrice decimal(10,3) DEFAULT '0.000' COMMENT '折后合同额',
  notSalesmanRate decimal(10,3) NOT NULL DEFAULT '0.000',
  salesmanType varchar(10) NOT NULL DEFAULT '守园',
  otherStatus tinyint(4) DEFAULT '0' COMMENT '1合尺, 2设计费',
  company tinyint(4) NOT NULL COMMENT '订单所属公司',
  quotationTimeLimit int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (autoId),
  UNIQUE KEY uniqueone (orderId),
  KEY indexone (orderId),
  KEY indextwo (houseNumber),
  KEY indexthr (houseArea),
  KEY indexfou (customerId),
  KEY indexfiv (villageId),
  KEY indexsix (designerId),
  KEY indexsev (salesmanId),
  KEY indexeig (status),
  KEY indexnig (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修订单表';

DROP TABLE IF EXISTS decorationorderdrawline;
CREATE TABLE decorationorderdrawline (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  applayTime timestamp NULL DEFAULT NULL,
  applayDes varchar(100) DEFAULT NULL,
  actualStartTime timestamp NULL DEFAULT NULL,
  actualEndTime timestamp NULL DEFAULT NULL,
  status varchar(45) DEFAULT NULL COMMENT '排队、申请放线、分配工人、放线失败、放线成功',
  applayCount int(11) DEFAULT '1',
  applayUserId varchar(15) DEFAULT NULL,
  drawLineGroup varchar(45) DEFAULT NULL,
  drawLineUserId varchar(15) DEFAULT NULL,
  PRIMARY KEY (autoId),
  KEY indexone (orderId),
  KEY indextwo (drawLineGroup,status,applayTime),
  KEY indexthr (status,actualStartTime,actualEndTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单放线表';

DROP TABLE IF EXISTS decorationorderdesigndepartmentright;
CREATE TABLE decorationorderdesigndepartmentright (
  doddrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  dId int(11) NOT NULL,
  PRIMARY KEY (doddrId),
  KEY indexone (uId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单设计部权限';

DROP TABLE IF EXISTS decorationordersalesmandepartmentright;
CREATE TABLE decorationordersalesmandepartmentright (
  dosdrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  dId int(11) NOT NULL,
  PRIMARY KEY (dosdrId),
  KEY indexone (uId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单业务部权限';

DROP TABLE IF EXISTS decorationorderstatusright;
CREATE TABLE decorationorderstatusright (
  dosrId int(20) NOT NULL AUTO_INCREMENT,
  uId int(11) NOT NULL,
  status varchar(10) NOT NULL,
  PRIMARY KEY (dosrId),
  KEY indexone (uId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单状态权限';



DROP TABLE IF EXISTS `decorationpayment`;
CREATE TABLE `decorationpayment` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `paymentType` varchar(10) NOT NULL COMMENT '设计费、定金、首付款、首付二期款、二期款、尾款、增项款、减项款、其他退款、违约金、定金退款、设计费退款、首付款退款、首付二期款退款、二期款退款、尾款退款',
  `paymentStatus` varchar(10) NOT NULL DEFAULT '未提交' COMMENT '申请审批,审批未通过,未提交 , 未付款 , 已付款,已确认,申请退款',
  `createUserId` varchar(15) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `createDes` varchar(45) DEFAULT NULL,
  `referMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `paymentBlance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '付款余额',
  `other` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '对于首付款是定金转首付金额',
  `drId` int(11) DEFAULT NULL,
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`createUserId`),
  KEY `indexfor` (`orderId`,`paymentType`,`paymentStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=375 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `decorationpicture`;
CREATE TABLE `decorationpicture` (
  `dpId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` varchar(256) NOT NULL,
  `uploadTime` timestamp NULL DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `userId` varchar(15) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1 设计效果图 2、工程制图CAD',
  PRIMARY KEY (`dpId`),
  KEY `indexone` (`orderId`,`uploadTime`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COMMENT='设计图纸';
DROP TABLE IF EXISTS decorationreceipt;
CREATE TABLE decorationreceipt (
  drId int(11) NOT NULL AUTO_INCREMENT,
  createUserId varchar(15) DEFAULT NULL,
  createTime timestamp NULL DEFAULT NULL,
  collectUserId varchar(15) DEFAULT NULL,
  collectTime timestamp NULL DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT NULL,
  confirmTime timestamp NULL DEFAULT NULL,
  cash decimal(10,3) NOT NULL DEFAULT '0.000',
  cashInfo varchar(20) DEFAULT NULL,
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankInfo varchar(512) DEFAULT NULL,
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvBankName varchar(20) DEFAULT NULL,
  installment decimal(10,3) NOT NULL DEFAULT '0.000',
  installmentBankName varchar(20) DEFAULT NULL,
  accounts decimal(10,3) NOT NULL DEFAULT '0.000',
  accountsBankName varchar(20) DEFAULT NULL,
  coupon decimal(10,3) NOT NULL DEFAULT '0.000',
  couponInfo varchar(512) DEFAULT NULL,
  advance decimal(10,3) NOT NULL DEFAULT '0.000',
  advanceType tinyint(4) NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  receiptType tinyint(4) NOT NULL,
  des varchar(256) NOT NULL DEFAULT '',
  dpId int(11) DEFAULT NULL,
  PRIMARY KEY (drId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修款项收据表';

DROP TABLE IF EXISTS designerdeductsalary;
CREATE TABLE designerdeductsalary (
  ddsId int(11) NOT NULL AUTO_INCREMENT,
  dsId int(11) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime date NOT NULL,
  `type` tinyint(4) NOT NULL,
  deduct decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  des varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (ddsId),
  KEY indexone (dsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师扣款';

DROP TABLE IF EXISTS designeroutsidesalary;
CREATE TABLE designeroutsidesalary (
  dosId int(11) NOT NULL AUTO_INCREMENT,
  dsId int(11) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime date NOT NULL,
  outside decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (dosId),
  KEY indextwo (dsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师场外工资';

DROP TABLE IF EXISTS designerpostbalancesalary;
CREATE TABLE designerpostbalancesalary (
  dpobsId int(11) NOT NULL AUTO_INCREMENT,
  dsId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime date NOT NULL,
  postBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (dpobsId),
  KEY indexone (msoId,status),
  KEY indextwo (dsId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师结算工资';

DROP TABLE IF EXISTS designerprebalancesalary;
CREATE TABLE designerprebalancesalary (
  dprbsId int(11) NOT NULL AUTO_INCREMENT,
  dsId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime date NOT NULL,
  preBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (dprbsId),
  KEY indexone (dsId,status),
  KEY indextwo (msoId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师预结算工资';

DROP TABLE IF EXISTS designersalary;
CREATE TABLE designersalary (
  dsId int(11) NOT NULL AUTO_INCREMENT,
  pdsId int(11) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  material decimal(10,3) NOT NULL DEFAULT '0.000',
  deduct decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (dsId),
  KEY indexone (userId,status),
  KEY indextwo (pdsId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设计师工资';

DROP TABLE IF EXISTS `drawline`;
CREATE TABLE `drawline` (
  `dlId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL DEFAULT NULL,
  `applayDes` varchar(100) DEFAULT NULL,
  `actualStartTime` timestamp NULL DEFAULT NULL,
  `actualEndTime` timestamp NULL DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL COMMENT '排队、申请放线、放线失败、放线成功',
  `applayCount` int(11) DEFAULT '1',
  `applayUserId` varchar(15) DEFAULT NULL,
  `drawLineGroup` varchar(45) DEFAULT NULL,
  `drawLineUserId` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`dlId`),
  KEY `indexone` (`drawLineGroup`,`status`,`applayTime`),
  KEY `indextwo` (`status`,`actualStartTime`,`actualEndTime`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COMMENT='订单放线表';
DROP TABLE IF EXISTS functionarea;
CREATE TABLE functionarea (
  faId bigint(20) NOT NULL AUTO_INCREMENT,
  functionAreaId varchar(10) NOT NULL,
  functionAreaName varchar(20) NOT NULL,
  versionId varchar(11) NOT NULL,
  functionAreaOrder int(11) NOT NULL,
  functionAreaType varchar(10) NOT NULL DEFAULT '普通' COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  PRIMARY KEY (faId),
  KEY indexone (functionAreaId,versionId,functionAreaType,functionAreaOrder),
  KEY indextwo (versionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能区表';

DROP TABLE IF EXISTS functionareaquoteitem;
CREATE TABLE functionareaquoteitem (
  faiId bigint(20) NOT NULL AUTO_INCREMENT,
  functionAreaId bigint(20) NOT NULL,
  quoteItemId bigint(20) NOT NULL,
  PRIMARY KEY (faiId),
  KEY indexone (functionAreaId,quoteItemId),
  KEY indextwo (quoteItemId,functionAreaId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能区报价项关联表';

DROP TABLE IF EXISTS groundlevelingconstructionschedule;
CREATE TABLE groundlevelingconstructionschedule (
  glcsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (glcsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='地面找平工程进度表';

DROP TABLE IF EXISTS groundlevelingconstructionscheduleworker;
CREATE TABLE groundlevelingconstructionscheduleworker (
  glcswId int(11) NOT NULL AUTO_INCREMENT,
  glcsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) NOT NULL,
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (glcswId),
  KEY indexone (glcsId,orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='地面找平工程工人表';

DROP TABLE IF EXISTS groundlevelingdrawing;
CREATE TABLE groundlevelingdrawing (
  gldId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  glcsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (gldId),
  KEY indexone (glcsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='地面找平图纸表';

DROP TABLE IF EXISTS inspectiondeduction;
CREATE TABLE inspectiondeduction (
  idId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  deductionMoney decimal(10,3) NOT NULL,
  deductionTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deductionDes varchar(256) NOT NULL,
  PRIMARY KEY (idId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='巡检扣款表';

DROP TABLE IF EXISTS inspectionrecord;
CREATE TABLE inspectionrecord (
  irId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  operaterId varchar(15) NOT NULL,
  operaterName varchar(32) NOT NULL,
  startTime timestamp NULL DEFAULT NULL,
  recordDes varchar(256) NOT NULL,
  endTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (irId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='巡检记录表';

DROP TABLE IF EXISTS logininfo;
CREATE TABLE logininfo (
  liId int(11) NOT NULL AUTO_INCREMENT,
  loginFlag varchar(32) NOT NULL,
  code int(11) NOT NULL DEFAULT -1 COMMENT '-1 无确认, 0 成功 , 其他错误码',
  message varchar(64) NOT NULL DEFAULT '',
  authentication varchar(512) NOT NULL DEFAULT '',
  optime bigint NOT NULL,
  x double NOT NULL DEFAULT 0,
  y double NOT NULL DEFAULT 0,
  PRIMARY KEY (liId),
  KEY indexone (loginFlag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='二维码登陆信息';

DROP TABLE IF EXISTS loginlog;
CREATE TABLE loginlog (
  id varchar(32) NOT NULL,
  loginId varchar(32) NOT NULL DEFAULT '0',
  loginTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sourceIp varchar(45) NOT NULL,
  successFlag smallint(5) unsigned NOT NULL DEFAULT '0',
  llId int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (llId),
  KEY indexone (loginId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;



DROP TABLE IF EXISTS materialbrand;
CREATE TABLE materialbrand (
  mbId int(11) NOT NULL AUTO_INCREMENT,
  materialBrandId varchar(10) NOT NULL,
  materialBrandName varchar(30) NOT NULL,
  materialBrandNamePinyin varchar(216) NOT NULL,
  materialTypeId int(11) NOT NULL,
  PRIMARY KEY (mbId),
  KEY indexone (materialTypeId),
  KEY indextwo (materialBrandName,materialBrandNamePinyin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品牌表';

DROP TABLE IF EXISTS materialbrandcount;
CREATE TABLE materialbrandcount (
  mbcId int(11) NOT NULL AUTO_INCREMENT,
  materialBrand varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mbcId),
  KEY indexone (materialBrand,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材品牌业绩统计';

DROP TABLE IF EXISTS materialbrandright;
CREATE TABLE materialbrandright (
  mbrId int(11) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  brandId varchar(128) NOT NULL,
  PRIMARY KEY (mbrId),
  KEY indexone (userId,brandId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品牌权限表';

DROP TABLE IF EXISTS materialdepartmentcount;
CREATE TABLE materialdepartmentcount (
  mdcId int(11) NOT NULL AUTO_INCREMENT,
  materialDeptId varchar(10) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mdcId),
  UNIQUE KEY uniqueone (materialDeptId,createTime),
  KEY indexone (materialDeptId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材部门业绩统计';

DROP TABLE IF EXISTS materialdesignercount;
CREATE TABLE materialdesignercount (
  mdcId int(11) NOT NULL AUTO_INCREMENT,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  designerDepartmentId varchar(15) NOT NULL,
  designerDepartmentName varchar(32) NOT NULL,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mdcId),
  UNIQUE KEY uniqueone (designerId,createTime),
  KEY indexone (designerId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计师业绩统计';

DROP TABLE IF EXISTS materialdesignerdepartmentcount;
CREATE TABLE materialdesignerdepartmentcount (
  mddcId int(11) NOT NULL AUTO_INCREMENT,
  designerDeptId varchar(15) NOT NULL,
  designerDeptName varchar(32) NOT NULL,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mddcId),
  UNIQUE KEY uniqueone (designerDeptId,designerRegionId,createTime),
  KEY indexone (designerDeptId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计部门业绩统计';

DROP TABLE IF EXISTS materialdesignerdepartmentrank;
CREATE TABLE materialdesignerdepartmentrank (
  mddrId int(11) NOT NULL AUTO_INCREMENT,
  designerDeptId varchar(15) NOT NULL,
  designerDeptName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (mddrId),
  KEY indexone (designerDeptId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计部门排名';

DROP TABLE IF EXISTS materialdesignerrank;
CREATE TABLE materialdesignerrank (
  mdrId int(11) NOT NULL AUTO_INCREMENT,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (mdrId),
  KEY indexone (designerId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计师排名';

DROP TABLE IF EXISTS materialdesignerregioncount;
CREATE TABLE materialdesignerregioncount (
  mdrcId int(11) NOT NULL AUTO_INCREMENT,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mdrcId),
  UNIQUE KEY uniqueone (designerRegionId,createTime),
  KEY indexone (designerRegionId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计分区业绩统计';

DROP TABLE IF EXISTS materialdesignerregionrank;
CREATE TABLE materialdesignerregionrank (
  mdrrId int(11) NOT NULL AUTO_INCREMENT,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (mdrrId),
  KEY indexone (designerRegionId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材设计中心排名';

DROP TABLE IF EXISTS materialinside;
CREATE TABLE materialinside (
  miId int(11) NOT NULL AUTO_INCREMENT,
  orderAddr varchar(128) NOT NULL,
  customerId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  materialGuideId varchar(15) NOT NULL,
  materialGuideName varchar(32) NOT NULL,
  materialTypeId int(11) NOT NULL,
  materialType varchar(32) NOT NULL,
  materialBrandId int(11) NOT NULL,
  materialBrand varchar(32) NOT NULL,
  createTime date NOT NULL,
  sales decimal(10,3) NOT NULL DEFAULT '0.000',
  profit decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  des varchar(256) NOT NULL DEFAULT '',
  orderId varchar(15) NOT NULL,
  PRIMARY KEY (miId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场内信息';

DROP TABLE IF EXISTS materialinsidepayment;
CREATE TABLE materialinsidepayment (
  mipId int(11) NOT NULL AUTO_INCREMENT,
  miId int(11) NOT NULL,
  paymentType tinyint(4) NOT NULL DEFAULT '0',
  paymentStatus tinyint(4) NOT NULL DEFAULT '0',
  orderAddr varchar(128) NOT NULL,
  customerId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  materialTypeName varchar(32) NOT NULL,
  materialBrandName varchar(32) NOT NULL,
  createUserId varchar(15) NOT NULL DEFAULT '',
  createUserName varchar(32) NOT NULL DEFAULT '',
  collectUserId varchar(15) NOT NULL DEFAULT '',
  collectUserName varchar(32) NOT NULL DEFAULT '',
  collectTime date DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT '',
  confirmUserName varchar(32) NOT NULL DEFAULT '',
  confirmTime date DEFAULT NULL,
  referMoney decimal(10,3) NOT NULL DEFAULT '0',
  cash decimal(10,3) NOT NULL DEFAULT '0',
  bank decimal(10,3) NOT NULL DEFAULT '0',
  bankName varchar(20) NOT NULL DEFAULT '',
  checkv decimal(10,3) NOT NULL DEFAULT '0',
  checkvBankName varchar(20) NOT NULL DEFAULT '',
  installment decimal(10,3) NOT NULL DEFAULT '0',
  installmentBankName varchar(20) NOT NULL DEFAULT '',
  accounts decimal(10,3) NOT NULL DEFAULT '0',
  accountsBankName varchar(20) NOT NULL DEFAULT '',
  des varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (mipId),
  KEY indexone (miId),
  KEY indextwo (paymentStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场内收款表';

DROP TABLE IF EXISTS materialmodel;
CREATE TABLE materialmodel (
  mmId int(11) NOT NULL AUTO_INCREMENT,
  materialModelNo varchar(64) NOT NULL,
  materialModelName varchar(64) NOT NULL,
  brandId int(11) NOT NULL,
  materialTypeName varchar(30) NOT NULL DEFAULT '',
  materialBrandName varchar(30) NOT NULL DEFAULT '',
  measurementUnitId int(11) NOT NULL,
  measurementUnitName varchar(10) NOT NULL DEFAULT '',
  materialUnitPrice decimal(10,3) NOT NULL,
  materialPurchasePrice decimal(10,3) NOT NULL,
  discount decimal(10,3) NOT NULL,
  calcType tinyint(4) NOT NULL DEFAULT '0',
  point decimal(10,3) NOT NULL,
  base decimal(10,3) NOT NULL,
  status tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (mmId),
  KEY indexone (materialModelName),
  KEY indextwo (brandId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='型号表';

DROP TABLE IF EXISTS materialoutside;
CREATE TABLE materialoutside (
  moId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  customerName varchar(32) NOT NULL,
  salesmanId varchar(15) NOT NULL,
  salesmanName varchar(32) NOT NULL,
  deptId varchar(10) NOT NULL,
  deptName varchar(32) NOT NULL,
  regionId varchar(10) NOT NULL,
  regionName varchar(32) NOT NULL,
  createUserId varchar(15) NOT NULL,
  createUserName varchar(32) NOT NULL,
  materialType varchar(32) NOT NULL,
  materialBrand varchar(32) NOT NULL,
  createTime timestamp NULL DEFAULT NULL,
  sales decimal(10,3) NOT NULL DEFAULT '0.000',
  profit decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  des varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (moId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场外信息';

DROP TABLE IF EXISTS materialoutsidepayment;
CREATE TABLE materialoutsidepayment (
  mopId int(11) NOT NULL AUTO_INCREMENT,
  moId int(11) NOT NULL,
  paymentType tinyint(4) NOT NULL DEFAULT '0',
  paymentStatus tinyint(4) NOT NULL DEFAULT '0',
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  customerName varchar(32) NOT NULL,
  materialTypeName varchar(32) NOT NULL,
  materialBrandName varchar(32) NOT NULL,
  createUserId varchar(15) NOT NULL DEFAULT '',
  createUserName varchar(32) NOT NULL DEFAULT '',
  createTime timestamp NULL DEFAULT NULL,
  collectUserId varchar(15) NOT NULL DEFAULT '',
  collectUserName varchar(32) NOT NULL DEFAULT '',
  collectTime timestamp NULL DEFAULT NULL,
  referMoney decimal(10,3) NOT NULL DEFAULT '0.000',
  cash decimal(10,3) NOT NULL DEFAULT '0.000',
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankName varchar(20) NOT NULL DEFAULT '',
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvBankName varchar(20) NOT NULL DEFAULT '',
  installment decimal(10,3) NOT NULL DEFAULT '0.000',
  installmentBankName varchar(20) NOT NULL DEFAULT '',
  accounts decimal(10,3) NOT NULL DEFAULT '0.000',
  accountsBankName varchar(20) NOT NULL DEFAULT '',
  des varchar(256) NOT NULL DEFAULT '',
  morId int(11) DEFAULT NULL,
  PRIMARY KEY (mopId),
  KEY indexone (moId),
  KEY indextwo (paymentStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场外收款表';

DROP TABLE IF EXISTS materialoutsidereceipt;
CREATE TABLE materialoutsidereceipt (
  morId int(11) NOT NULL AUTO_INCREMENT,
  collectUserId varchar(15) NOT NULL DEFAULT '',
  collectUserName varchar(32) NOT NULL DEFAULT '',
  collectTime timestamp NULL DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT '',
  confirmUserName varchar(32) NOT NULL DEFAULT '',
  confirmTime timestamp NULL DEFAULT NULL,
  realMoney decimal(10,3) NOT NULL DEFAULT '0.000',
  cash decimal(10,3) NOT NULL DEFAULT '0.000',
  cashInfo varchar(20) DEFAULT NULL,
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankName varchar(20) NOT NULL DEFAULT '',
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvBankName varchar(20) NOT NULL DEFAULT '',
  installment decimal(10,3) NOT NULL DEFAULT '0.000',
  installmentBankName varchar(20) NOT NULL DEFAULT '',
  accounts decimal(10,3) NOT NULL DEFAULT '0.000',
  accountsBankName varchar(20) NOT NULL DEFAULT '',
  status tinyint(4) NOT NULL DEFAULT '0',
  des varchar(256) NOT NULL DEFAULT '',
  mopId int(11) DEFAULT NULL,
  PRIMARY KEY (morId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场外款项收据表';

DROP TABLE IF EXISTS materialpayment;
CREATE TABLE materialpayment (
  mpId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  paymentType tinyint(4) NOT NULL DEFAULT '0',
  paymentStatus tinyint(4) NOT NULL DEFAULT '0',
  materialType varchar(32) NOT NULL DEFAULT '',
  materialBrand varchar(32) NOT NULL DEFAULT '',
  customerId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  createUserId varchar(15) NOT NULL DEFAULT '',
  createUserName varchar(32) NOT NULL DEFAULT '',
  referMoney decimal(10,3) NOT NULL DEFAULT '0.000',
  mrId int(11) DEFAULT NULL,
  PRIMARY KEY (mpId),
  KEY indexone (msoId,paymentStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单款项表';

DROP TABLE IF EXISTS materialreceipt;
CREATE TABLE materialreceipt (
  mrId int(11) NOT NULL AUTO_INCREMENT,
  collectUserId varchar(15) NOT NULL DEFAULT '',
  collectUserName varchar(32) NOT NULL DEFAULT '',
  collectTime timestamp NULL DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT '',
  confirmUserName varchar(32) NOT NULL DEFAULT '',
  confirmTime timestamp NULL DEFAULT NULL,
  realMoney decimal(10,3) NOT NULL DEFAULT '0.000',
  cash decimal(10,3) NOT NULL DEFAULT '0.000',
  cashInfo varchar(20) DEFAULT NULL,
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankInfo varchar(512) NOT NULL DEFAULT '',
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvBankName varchar(20) NOT NULL DEFAULT '',
  installment decimal(10,3) NOT NULL DEFAULT '0.000',
  installmentBankName varchar(20) NOT NULL DEFAULT '',
  accounts decimal(10,3) NOT NULL DEFAULT '0.000',
  accountsBankName varchar(20) NOT NULL DEFAULT '',
  advance decimal(10,3) NOT NULL DEFAULT '0.000',
  advanceType tinyint(4) NOT NULL DEFAULT '0',
  coupon decimal(10,3) NOT NULL DEFAULT '0.000',
  couponType tinyint(4) NOT NULL DEFAULT '0',
  couponInfo text NOT NULL,
  status tinyint(4) NOT NULL DEFAULT '0',
  receiptType tinyint(4) NOT NULL,
  des varchar(256) NOT NULL DEFAULT '',
  mpId int(11) DEFAULT NULL,
  PRIMARY KEY (mrId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材款项收据表';

DROP TABLE IF EXISTS materialsuborder;
CREATE TABLE materialsuborder (
  msoId int(11) NOT NULL AUTO_INCREMENT,
  msoNo varchar(15) NOT NULL,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  customerId varchar(15) NOT NULL,
  customerName varchar(32) NOT NULL,
  salesmanId varchar(15) NOT NULL,
  salesmanName varchar(32) NOT NULL,
  materialerId varchar(15) NOT NULL,
  materialerName varchar(32) NOT NULL,
  instoreId varchar(15) NOT NULL,
  instoreName varchar(32) NOT NULL,
  materialType varchar(32) NOT NULL DEFAULT '',
  materialBrand varchar(32) NOT NULL DEFAULT '',
  designerFlag tinyint(4) NOT NULL DEFAULT '0',
  packageFlag tinyint(4) NOT NULL DEFAULT '0',
  regionId varchar(10) NOT NULL,
  regionName varchar(32) NOT NULL,
  departmentId varchar(10) NOT NULL,
  departmentName varchar(32) NOT NULL,
  materialDeptId varchar(10) NOT NULL,
  materialDeptName varchar(32) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  preBalanceTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  postBalanceTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  msoType tinyint(4) DEFAULT '0',
  status tinyint(4) DEFAULT '0' COMMENT '初始, 删除',
  depositPayment decimal(10,3) NOT NULL DEFAULT '0.000',
  depositStatus tinyint(4) NOT NULL DEFAULT '0',
  fullPayment decimal(10,3) NOT NULL DEFAULT '0.000',
  fullStatus tinyint(4) NOT NULL DEFAULT '0',
  deliveryStatus tinyint(4) DEFAULT '0' COMMENT '送货状态',
  balanceStatus tinyint(4) NOT NULL DEFAULT '0',
  base decimal(10,3) NOT NULL DEFAULT '0.000',
  `point` decimal(10,3) NOT NULL DEFAULT '0.000',
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  maling decimal(10,3) NOT NULL DEFAULT '0.000',
  venderMaling decimal(10,3) NOT NULL DEFAULT '0.000',
  coupon decimal(10,3) NOT NULL DEFAULT '0.000',
  couponInfo varchar(64) NOT NULL DEFAULT '',
  des varchar(256) NOT NULL DEFAULT '',
  profit decimal(10,3) NOT NULL DEFAULT '0.000',
  deliveryTime timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  deliveryUserId varchar(15) NOT NULL DEFAULT '',
  fullCollectTime timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  postProfit decimal(10,3) NOT NULL DEFAULT '0.000',
  custProfit decimal(10,3) NOT NULL DEFAULT '0.000',
  otherStatus int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (msoId),
  KEY indexone (orderId,status),
  KEY indextwo (balanceStatus,fullStatus),
  KEY indexthr (msoNo),
  KEY indexfor (orderAddr),
  KEY indexfiv (salesmanName),
  KEY indexsix (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单表';

DROP TABLE IF EXISTS materialsuborderitem;
CREATE TABLE materialsuborderitem (
  msoiId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  mpId int(11) NOT NULL DEFAULT '0',
  materialModelNo varchar(64) NOT NULL,
  materialModelName varchar(64) NOT NULL,
  materialTypeName varchar(32) NOT NULL DEFAULT '',
  materialBrandName varchar(32) NOT NULL DEFAULT '',
  measurementUnitName varchar(10) NOT NULL,
  packageName varchar(10) NOT NULL DEFAULT '',
  materialUnitPrice decimal(10,3) NOT NULL,
  materialPurchasePrice decimal(10,3) NOT NULL,
  salePrice decimal(10,3) NOT NULL DEFAULT '0.000',
  price decimal(10,3) NOT NULL DEFAULT '0.000',
  discount decimal(10,3) NOT NULL DEFAULT '1.000',
  postDiscount decimal(10,3) NOT NULL DEFAULT '1.000',
  num decimal(10,3) DEFAULT '0.000',
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  paymentStatus tinyint(4) NOT NULL DEFAULT '0',
  balanceStatus tinyint(4) NOT NULL DEFAULT '0',
  refundStatus tinyint(4) NOT NULL DEFAULT '0',
  calcType tinyint(4) NOT NULL DEFAULT '0',
  prePoint decimal(10,3) NOT NULL DEFAULT '0.000',
  postPoint decimal(10,3) NOT NULL DEFAULT '0.000',
  des varchar(256) DEFAULT '',
  rawCalcType tinyint(4) NOT NULL DEFAULT '0',
  rawPoint decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (msoiId),
  KEY indexone (mpId),
  KEY indextwo (msoId,status,refundStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单项表';

DROP TABLE IF EXISTS materialsuborderpostbalance;
CREATE TABLE materialsuborderpostbalance (
  msopobId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  postBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (msopobId),
  KEY indexone (msoId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单结算表';

DROP TABLE IF EXISTS materialsuborderprebalance;
CREATE TABLE materialsuborderprebalance (
  msoprbId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  preBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (msoprbId),
  KEY indexone (msoId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单预结算表';

DROP TABLE IF EXISTS materialsuborderrefund;
CREATE TABLE materialsuborderrefund (
  msorId int(11) NOT NULL AUTO_INCREMENT,
  msoId int(11) NOT NULL,
  msoiId int(11) NOT NULL,
  dpbsId int(11) NOT NULL,
  mpId int(11) NOT NULL,
  ident int(11) NOT NULL,
  materialModelNo varchar(64) NOT NULL,
  materialModelName varchar(64) NOT NULL,
  materialTypeName varchar(32) NOT NULL DEFAULT '',
  materialBrandName varchar(32) NOT NULL DEFAULT '',
  measurementUnitName varchar(10) NOT NULL,
  packageName varchar(10) NOT NULL DEFAULT '',
  materialUnitPrice decimal(10,3) NOT NULL,
  materialPurchasePrice decimal(10,3) NOT NULL,
  salePrice decimal(10,3) NOT NULL DEFAULT '0.000',
  price decimal(10,3) NOT NULL DEFAULT '0.000',
  discount decimal(10,3) NOT NULL DEFAULT '1.000',
  postDiscount decimal(10,3) NOT NULL DEFAULT '1.000',
  num decimal(10,3) NOT NULL DEFAULT '0.000',
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  balanceType tinyint(4) NOT NULL DEFAULT '0',
  calcType tinyint(4) NOT NULL DEFAULT '0',
  prePoint decimal(10,3) NOT NULL DEFAULT '0.000',
  postPoint decimal(10,3) NOT NULL DEFAULT '0.000',
  des varchar(256) DEFAULT '',
  refundDes varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (msorId),
  KEY indexone (msoId,status),
  KEY indextwo (mpId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材子订单退款信息表';

DROP TABLE IF EXISTS materialtype;
CREATE TABLE materialtype (
  mtId int(11) NOT NULL AUTO_INCREMENT,
  materialTypeId varchar(10) NOT NULL,
  materialTypeName varchar(32) NOT NULL,
  PRIMARY KEY (mtId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品类表';

DROP TABLE IF EXISTS materialtypecount;
CREATE TABLE materialtypecount (
  mtcId int(11) NOT NULL AUTO_INCREMENT,
  materialType varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (mtcId),
  KEY indexone (materialType,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材品类业绩统计';

DROP TABLE IF EXISTS measurementunit;
CREATE TABLE measurementunit (
  id int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  unitDes varchar(30) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='计量单位表';

DROP TABLE IF EXISTS message;
CREATE TABLE message (
  messageId bigint(32) NOT NULL AUTO_INCREMENT,
  receiverId varchar(15) NOT NULL,
  senderId varchar(15) NOT NULL,
  `type` varchar(10) NOT NULL COMMENT '类别',
  contents varchar(256) NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status varchar(10) NOT NULL COMMENT '未读,已读',
  args varchar(1024) DEFAULT NULL,
  PRIMARY KEY (messageId),
  KEY indexone (receiverId,status,`type`,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS notice;
CREATE TABLE notice (
  noticeId bigint(20) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  deptId varchar(10) NOT NULL,
  theme varchar(64) NOT NULL,
  `type` varchar(10) NOT NULL,
  priority varchar(10) NOT NULL,
  startTime date NOT NULL,
  endTime date NOT NULL,
  publishTime date NOT NULL,
  isPublic varchar(4) NOT NULL,
  contents varchar(4096) NOT NULL,
  contentsText varchar(1024) NOT NULL,
  filePath varchar(128) DEFAULT NULL,
  PRIMARY KEY (noticeId),
  KEY indexone (`type`,deptId,isPublic,startTime,endTime,publishTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='公告';

DROP TABLE IF EXISTS oilconstructionschedule;
CREATE TABLE oilconstructionschedule (
  ocsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (ocsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='油工工程进度表';

DROP TABLE IF EXISTS oilconstructionscheduleworker;
CREATE TABLE oilconstructionscheduleworker (
  ocswId int(11) NOT NULL AUTO_INCREMENT,
  ocsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (ocswId),
  KEY indexone (csId),
  KEY indextwo (ocsId,orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='油工工程工人表';

DROP TABLE IF EXISTS oildrawing;
CREATE TABLE oildrawing (
  odId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  ocsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (odId),
  KEY indexone (ocsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='油工工图纸表';

DROP TABLE IF EXISTS orderbelonginfo;
CREATE TABLE orderbelonginfo (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(32) NOT NULL COMMENT '订单编号',
  belongType varchar(10) NOT NULL DEFAULT '设计' COMMENT '设计、业务',
  belongUserId varchar(15) NOT NULL COMMENT '归属人',
  belongDeptId varchar(10) NOT NULL COMMENT '归属部门',
  belongRegionId varchar(10) DEFAULT NULL COMMENT '归属中心',
  belongRate decimal(10,3) NOT NULL DEFAULT '1.000' COMMENT '归属比例',
  operateUserId varchar(15) NOT NULL COMMENT '操作人',
  operateTime timestamp NULL DEFAULT NULL COMMENT '最后编辑时间',
  status varchar(10) DEFAULT '申请审批' COMMENT '申请审批，审批通过、审批未通过、替换',
  changeReason varchar(100) DEFAULT NULL,
  approvalUserId varchar(15) DEFAULT NULL,
  approvalTime timestamp NULL DEFAULT NULL,
  defaultFlag varchar(5) NOT NULL DEFAULT '否' COMMENT '是 否',
  PRIMARY KEY (autoId),
  KEY indexone (orderId,belongType,belongUserId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单归属信息';

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

DROP TABLE IF EXISTS payment;
CREATE TABLE payment (
  paymentId bigint(32) NOT NULL AUTO_INCREMENT,
  customerId int(11) NOT NULL,
  balance decimal(10,3) NOT NULL,
  recharge decimal(10,3) NOT NULL,
  `type` varchar(10) NOT NULL,
  cash decimal(10,3) DEFAULT NULL,
  installmentBankName varchar(32) DEFAULT NULL,
  installment decimal(10,3) DEFAULT NULL,
  accountsBankName varchar(32) DEFAULT NULL,
  accounts decimal(10,3) DEFAULT NULL,
  des varchar(256) DEFAULT NULL,
  collectUserId varchar(15) DEFAULT NULL,
  collectTime timestamp NULL DEFAULT NULL,
  confirmUserId varchar(15) DEFAULT NULL,
  confirmTime timestamp NULL DEFAULT NULL,
  status varchar(10) DEFAULT NULL,
  paymentType varchar(10) NOT NULL,
  convertPaymentId bigint(20) DEFAULT NULL,
  bank decimal(10,3) NOT NULL DEFAULT '0.000',
  bankinfo varchar(512) DEFAULT NULL,
  checkv decimal(10,3) NOT NULL DEFAULT '0.000',
  checkvbankname varchar(32) DEFAULT NULL,
  orderId varchar(15) DEFAULT NULL,
  arId int(11) DEFAULT NULL,
  PRIMARY KEY (paymentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS putlineconstructionschedule;
CREATE TABLE putlineconstructionschedule (
  plcsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerSalary decimal(10,3) DEFAULT '0.000',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  putlineStatus tinyint(4) DEFAULT '0',
  putlineTime date DEFAULT NULL,
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (plcsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='放线工程进度表';

DROP TABLE IF EXISTS putlinedrawing;
CREATE TABLE putlinedrawing (
  pldId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  plcsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (pldId),
  KEY indexone (plcsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='放线工图纸表';

DROP TABLE IF EXISTS qualitytestingrecord;
CREATE TABLE qualitytestingrecord (
  qtrId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  orderAddr varchar(128) NOT NULL,
  operaterId varchar(15) NOT NULL,
  operaterName varchar(32) NOT NULL,
  recordTime timestamp NULL DEFAULT NULL,
  recordDes varchar(256) NOT NULL,
  PRIMARY KEY (qtrId),
  KEY indexone (operaterId,orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='质检记录表';

DROP TABLE IF EXISTS quotation;
CREATE TABLE quotation (
  qId bigint(20) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  quotationName varchar(64) NOT NULL,
  decorationStyle varchar(10) DEFAULT NULL,
  createTime timestamp NULL DEFAULT NULL,
  createUserId varchar(15) NOT NULL,
  discount decimal(10,3) NOT NULL DEFAULT '10.000',
  content varchar(45) DEFAULT NULL,
  totalPrice decimal(10,3) DEFAULT NULL,
  status tinyint(4) NOT NULL DEFAULT '0' COMMENT '1、默认',
  saveStatus tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 autoSave 1 cofirmSave',
  calFlag int(11) NOT NULL DEFAULT '1',
  latexCut decimal(10,3) DEFAULT '0.000',
  managePrice decimal(10,3) DEFAULT '0.000',
  manageRate decimal(10,3) DEFAULT '0.000',
  trafficPrice decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (qId),
  KEY indexone (orderId,createTime,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价表';

DROP TABLE IF EXISTS quotationfuncationareaitem;
CREATE TABLE quotationfuncationareaitem (
  uuid varchar(32) NOT NULL,
  functionAreaId bigint(20) NOT NULL,
  quoteItemId bigint(20) NOT NULL,
  num decimal(10,3) NOT NULL,
  qfaiId int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (qfaiId),
  KEY indexone (functionAreaId),
  KEY indextwo (quoteItemId),
  KEY indexthr (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS quotationfunctionareaitem;
CREATE TABLE quotationfunctionareaitem (
  qfaiId int(11) NOT NULL AUTO_INCREMENT,
  itemName varchar(128) NOT NULL,
  measurementUnit varchar(10) NOT NULL,
  workType varchar(15) NOT NULL,
  unitPrice decimal(10,3) NOT NULL,
  num decimal(10,3) NOT NULL,
  type tinyint(4) NOT NULL,
  discount tinyint(4) NOT NULL DEFAULT 1,
  quotationFunctionAreaId bigint(20) NOT NULL,
  quotationItemId bigint(20),
  content varchar(256),
  PRIMARY KEY (qfaiId),
  KEY indexone (quotationFunctionAreaId),
  KEY indextwo (quotationItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS quotationfunctionarea;
CREATE TABLE quotationfunctionarea (
  qfaId bigint(20) NOT NULL AUTO_INCREMENT,
  quotationId bigint(20) NOT NULL,
  functionAreaName varchar(10) NOT NULL,
  functionAreaOrder int(11) DEFAULT NULL,
  functionAreaType varchar(10) NOT NULL COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  PRIMARY KEY (qfaId),
  KEY indexone (quotationId,functionAreaOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价功能区';

DROP TABLE IF EXISTS quotationitem;
CREATE TABLE quotationitem (
  qiId bigint(20) NOT NULL AUTO_INCREMENT,
  itemId varchar(10) NOT NULL,
  versionId varchar(11) NOT NULL,
  quotationTypeId int(11) NOT NULL,
  quotationClassificationId int(11) NOT NULL,
  quotationBigCategoryId int(11) NOT NULL,
  quotationSmallCategoryId int(11) NOT NULL,
  itemName varchar(128) NOT NULL,
  measurementUnitId int(11) NOT NULL,
  itemWorkTypeId int(11) NOT NULL,
  quotationItemDes varchar(512) NOT NULL,
  unitPrice decimal(10,3) NOT NULL,
  status tinyint(4) NOT NULL DEFAULT 0,
  discount tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (qiId),
  KEY indexone (itemId,versionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价项目表';

DROP TABLE IF EXISTS quotationversion;
CREATE TABLE quotationversion (
  versionId varchar(11) NOT NULL,
  versionName varchar(32) NOT NULL,
  defaultFlag int(11) NOT NULL DEFAULT '0',
  versionDes varchar(100) DEFAULT NULL,
  qvId int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (qvId),
  UNIQUE KEY versionId_UNIQUE (versionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价版本表';

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
  PRIMARY KEY (rtId),
  KEY indexone (key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportbusinessdept;
CREATE TABLE reportbusinessdept (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportbusinessregion;
CREATE TABLE reportbusinessregion (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportdesigndept;
CREATE TABLE reportdesigndept (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportdesignregion;
CREATE TABLE reportdesignregion (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportdesignsdept;
CREATE TABLE reportdesignsdept (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportdesignsregion;
CREATE TABLE reportdesignsregion (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  deptId varchar(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '天' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS reportuserranking;
CREATE TABLE reportuserranking (
  reportId bigint(20) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  `type` varchar(32) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  reportDate date NOT NULL,
  createTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind varchar(10) NOT NULL DEFAULT '月' COMMENT '天/月/季度/半年/一年',
  PRIMARY KEY (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS rework;
CREATE TABLE rework (
  rwId int(11) NOT NULL AUTO_INCREMENT,
  orderId varchar(15) NOT NULL,
  createrId varchar(15) NOT NULL,
  createrName varchar(32) NOT NULL,
  createTime date NOT NULL,
  reworkDes varchar(256) NOT NULL,
  PRIMARY KEY (rwId),
  KEY indexone (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='返工表';

DROP TABLE IF EXISTS reworkdrawing;
CREATE TABLE reworkdrawing (
  rwdId int(11) NOT NULL AUTO_INCREMENT,
  rwId int(11) NOT NULL,
  rwdName varchar(15) NOT NULL,
  rwdUrl varchar(256) NOT NULL,
  rwdAddUrl varchar(256) NOT NULL,
  operatorName varchar(32) NOT NULL DEFAULT '',
  operateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (rwdId),
  KEY indexone (rwId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='返工图片表';

DROP TABLE IF EXISTS servicerecord;
CREATE TABLE servicerecord (
  srId bigint(20) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  operateUserId varchar(15) NOT NULL,
  operateTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  info varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (srId),
  KEY indexone (operateUserId,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='服务记录';

DROP TABLE IF EXISTS systemdefineitem;
CREATE TABLE systemdefineitem (
  `sdiId` bigint(20) NOT NULL AUTO_INCREMENT,
  itemId varchar(10) NOT NULL,
  quotationBigCategoryId int(11) NOT NULL,
  itemName varchar(128) NOT NULL,
  measurementUnitId int(11) NOT NULL,
  itemWorkTypeId int(11) NOT NULL,
  quotationItemDes varchar(512) NOT NULL,
  unitPrice decimal(10,3) NOT NULL,
  status tinyint(4) NOT NULL DEFAULT 0,
  discount tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (sdiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统定义报项目表';

DROP TABLE IF EXISTS userapprove;
CREATE TABLE userapprove (
  approveId bigint(32) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  `type` varchar(32) NOT NULL COMMENT '楼号审批,客户信息审批,折扣审批,退款审批,预算审批,归属设计审批,归属业务审批',
  PRIMARY KEY (approveId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS usercheck;
CREATE TABLE usercheck (
  ucId bigint(32) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  checkTime timestamp NULL DEFAULT NULL,
  x double NOT NULL,
  y double NOT NULL,
  PRIMARY KEY (ucId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户考勤表';

DROP TABLE IF EXISTS usersalary;
CREATE TABLE usersalary (
  autoId bigint(20) NOT NULL AUTO_INCREMENT,
  userId varchar(15) NOT NULL,
  `type` varchar(15) NOT NULL COMMENT '报价扣款、考勤扣款、保险扣款、其他扣款、月度奖金、季度奖金、年终奖金、其他奖金、补款',
  createTime timestamp NULL DEFAULT NULL,
  createUserId varchar(15) NOT NULL,
  comments varchar(100) DEFAULT NULL,
  money decimal(10,3) NOT NULL,
  status int(11) NOT NULL COMMENT '0 初始状态 1 已结算',
  dealUserId varchar(15) DEFAULT NULL,
  dealTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (autoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户工资表';

DROP TABLE IF EXISTS venderbalance;
CREATE TABLE venderbalance (
  vbId int(11) NOT NULL AUTO_INCREMENT,
  materialBrandId int(11) NOT NULL,
  materialBrandName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  balance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (vbId),
  KEY indexone (materialBrandId,status),
  KEY indextwo (materialBrandName,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='厂商结算';

DROP TABLE IF EXISTS venderpostbalance;
CREATE TABLE venderpostbalance (
  vpbId int(11) NOT NULL AUTO_INCREMENT,
  vbId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  materialBrandId int(11) NOT NULL,
  materialBrandName varchar(32) NOT NULL,
  createTime date NOT NULL,
  postBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (vpbId),
  KEY indexone (vbId,status),
  KEY indextwo (msoId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='厂商结算';

DROP TABLE IF EXISTS venderprebalance;
CREATE TABLE venderprebalance (
  vpbId int(11) NOT NULL AUTO_INCREMENT,
  vbId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  msoId int(11) NOT NULL,
  msoNo varchar(15) NOT NULL,
  materialBrandId int(11) NOT NULL,
  materialBrandName varchar(32) NOT NULL,
  createTime date NOT NULL,
  preBalance decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (vpbId),
  KEY indexone (vbId,status),
  KEY indextwo (msoId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='厂商预结算';

DROP TABLE IF EXISTS waterwaycircuitcheckconstructionschedule;
CREATE TABLE waterwaycircuitcheckconstructionschedule (
  wcccsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  waterwayWorkerId varchar(15) DEFAULT '',
  circuitWorkerId varchar(15) DEFAULT '',
  powerWorkerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (wcccsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电工程进度表';

DROP TABLE IF EXISTS waterwaycircuitcheckconstructionscheduleworker;
CREATE TABLE waterwaycircuitcheckconstructionscheduleworker (
  wcccswId int(11) NOT NULL AUTO_INCREMENT,
  wcccsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (wcccswId),
  KEY indexone (csId),
  KEY indextwo (wcccsId,workerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电工程工人表';

DROP TABLE IF EXISTS waterwaycircuitcheckdrawing;
CREATE TABLE waterwaycircuitcheckdrawing (
  wccdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  wcccsId int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (wccdId),
  KEY indexone (wcccsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电图纸表';

DROP TABLE IF EXISTS waterwaycircuitpowerconstructionschedule;
CREATE TABLE waterwaycircuitpowerconstructionschedule (
  wcpcsId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  waterwayWorkerId varchar(15) DEFAULT '',
  circuitWorkerId varchar(15) DEFAULT '',
  powerWorkerId varchar(15) DEFAULT '',
  startTime date NOT NULL,
  startTimeFlag tinyint(4) DEFAULT '0',
  endTime date NOT NULL,
  endTimeFlag tinyint(4) DEFAULT '0',
  supervisorRaty tinyint(4) DEFAULT '0',
  supervisorRatyDes varchar(256) DEFAULT '',
  qualityRaty tinyint(4) DEFAULT '0',
  qualityRatyDes varchar(256) DEFAULT '',
  PRIMARY KEY (wcpcsId),
  KEY indexone (csId),
  KEY indextwo (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电工程进度表';

DROP TABLE IF EXISTS waterwaycircuitpowerconstructionscheduleworker;
CREATE TABLE waterwaycircuitpowerconstructionscheduleworker (
  wcpcswId int(11) NOT NULL AUTO_INCREMENT,
  wcpcsId int(11) NOT NULL,
  csId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  workerId varchar(15) DEFAULT '',
  workerName varchar(32) NOT NULL,
  workerSalary decimal(10,3) DEFAULT '0.000',
  workerRaty tinyint(4) DEFAULT '0',
  workerRatyDes varchar(256) DEFAULT '',
  allocateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (wcpcswId),
  KEY indexone (csId),
  KEY indextwo (wcpcsId,workerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电工程工人表';

DROP TABLE IF EXISTS waterwaycircuitpowerdrawing;
CREATE TABLE waterwaycircuitpowerdrawing (
  wcpdId int(11) NOT NULL AUTO_INCREMENT,
  csId int(11) NOT NULL,
  wcpcsid int(11) NOT NULL,
  drawingName varchar(15),
  drawingUrl varchar(256) NOT NULL,
  drawingAddUrl varchar(256),
  type tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (wcpdId),
  KEY indexone (wcpcsid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='水力电图纸表';

DROP TABLE IF EXISTS workerbasesalary;
CREATE TABLE workerbasesalary (
  wbsId int(11) NOT NULL AUTO_INCREMENT,
  wsId int(11) NOT NULL,
  cswId int(11) NOT NULL DEFAULT '0',
  orderId varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  workTypeId tinyint(4) NOT NULL,
  workType varchar(16) NOT NULL,
  createTime date NOT NULL,
  base decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (wbsId),
  KEY indexone (orderId,workTypeId,status),
  KEY indextwo (wsId,status),
  KEY indexthr (cswId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人基本工资';

DROP TABLE IF EXISTS workerdeductsalary;
CREATE TABLE workerdeductsalary (
  wdsId int(11) NOT NULL AUTO_INCREMENT,
  wsId int(11) NOT NULL,
  orderId varchar(15) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  workTypeId tinyint(4) NOT NULL,
  workType varchar(16) NOT NULL,
  createTime date NOT NULL,
  deduct decimal(10,3) NOT NULL DEFAULT '0.000',
  deductType int(11) NOT NULL,
  status tinyint(4) NOT NULL DEFAULT '0',
  des varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (wdsId),
  KEY indexone (orderId,workTypeId,wsId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人扣款工资';

DROP TABLE IF EXISTS workersalary;
CREATE TABLE workersalary (
  wsId int(11) NOT NULL AUTO_INCREMENT,
  pwsId int(11) NOT NULL,
  userId varchar(15) NOT NULL,
  userName varchar(32) NOT NULL,
  workTypeId tinyint(4) NOT NULL,
  workType varchar(16) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  base decimal(10,3) NOT NULL DEFAULT '0.000',
  deduct decimal(10,3) NOT NULL DEFAULT '0.000',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (wsId),
  KEY indexone (userId,status),
  KEY indextwo (pwsId,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人工资';

DROP TABLE IF EXISTS zaterialdesignercount;
CREATE TABLE zaterialdesignercount (
  zdcId int(11) NOT NULL AUTO_INCREMENT,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  designerDepartmentId varchar(15) NOT NULL,
  designerDepartmentName varchar(32) NOT NULL,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  materialBrand varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (zdcId),
  UNIQUE KEY uniqueone (designerId,materialBrand,createTime),
  KEY indexone (designerId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计师业绩统计';

DROP TABLE IF EXISTS zaterialdesignerdepartmentcount;
CREATE TABLE zaterialdesignerdepartmentcount (
  zddcId int(11) NOT NULL AUTO_INCREMENT,
  designerDeptId varchar(15) NOT NULL,
  designerDeptName varchar(32) NOT NULL,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  materialBrand varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (zddcId),
  UNIQUE KEY uniqueone (designerDeptId,materialBrand,createTime),
  KEY indexone (designerDeptId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计部门业绩统计';

DROP TABLE IF EXISTS zaterialdesignerdepartmentrank;
CREATE TABLE zaterialdesignerdepartmentrank (
  zddrId int(11) NOT NULL AUTO_INCREMENT,
  designerDeptId varchar(15) NOT NULL,
  designerDeptName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (zddrId),
  KEY indexone (designerDeptId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计部门排名';

DROP TABLE IF EXISTS zaterialdesignerrank;
CREATE TABLE zaterialdesignerrank (
  zdrId int(11) NOT NULL AUTO_INCREMENT,
  designerId varchar(15) NOT NULL,
  designerName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (zdrId),
  KEY indexone (designerId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计师排名';

DROP TABLE IF EXISTS zaterialdesignerregioncount;
CREATE TABLE zaterialdesignerregioncount (
  zdrcId int(11) NOT NULL AUTO_INCREMENT,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  materialBrand varchar(32) NOT NULL,
  createTime date NOT NULL,
  total decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (zdrcId),
  UNIQUE KEY uniqueone (designerRegionId,materialBrand,createTime),
  KEY indexone (designerRegionId,createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计分区业绩统计';

DROP TABLE IF EXISTS zaterialdesignerregionrank;
CREATE TABLE zaterialdesignerregionrank (
  zdrrId int(11) NOT NULL AUTO_INCREMENT,
  designerRegionId varchar(15) NOT NULL,
  designerRegionName varchar(32) NOT NULL,
  createTime date NOT NULL,
  endTime date NOT NULL,
  rank double NOT NULL DEFAULT '0',
  status tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (zdrrId),
  KEY indexone (designerRegionId,status,createTime,endTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='正林设计中心排名';


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

