-- ======================================================================
-- 表重命名: customerOriginFunction → customerFunction (生产库迁移)
-- 上线时需先执行此段, 把已有表名改为新名称(保留全部数据)
-- ======================================================================
RENAME TABLE `customer`.`customeroriginfunction` TO `customer`.`customerfunction`;
RENAME TABLE `platform`.`customeroriginfunctionright` TO `platform`.`customerfunctionright`;

create table `customer`.`customerfunction` like `customer`.`customeroriginfunction`;
create table `platform`.`customerfunctionright` like `platform`.`customeroriginfunctionright`;

-- ======================================================================
-- customerFunction 扩展: 为 vustomer / feedback / revisit 三个客户模块
-- 列表页新增可配置种子数据
--
-- 复用现有 customerFunction / customerFunctionRight 结构
-- name 列: 页面标识(对应前端 getConfig 传入的页面名)
-- key  列: 配置类型(apiPage / condArr / propertyArr / pageBtn)
-- value列: 配置值(api 路径 / 条件键 / 字段键 / 按钮键)
-- type : 0 页面分组  1 api  2 条件  3 字段  4 功能按钮
-- subtype: 0 单值  1 数组追加
-- ======================================================================

-- -------------------- vustomer (客户管理) --------------------
INSERT INTO `customer`.`customerfunction` (`name`,`key`,`value`,`type`,`subtype`,`status`,`sort`,`comment`) VALUES
('vustomer','vustomer','vustomer',0,0,0,7,'客户管理页面'),
('vustomer','apiPage','api.customer.pageVustomer',1,0,0,1,'客户管理分页接口'),
('vustomer','condArr','customer-v-name',2,1,0,1,'客户名称'),
('vustomer','propertyArr','name',3,1,0,1,'客户名称'),
('vustomer','propertyArr','address',3,1,0,2,'客户地址'),
('vustomer','propertyArr','orderId',3,1,0,3,'装修单号'),
('vustomer','propertyArr','referrer',3,1,0,4,'推荐人'),
('vustomer','propertyArr','referphone',3,1,0,5,'推荐人电话'),
('vustomer','propertyArr','createTime',3,1,0,6,'创建时间'),
('vustomer','propertyArr','contractPrice',3,1,0,7,'合同额'),
('vustomer','propertyArr','status',3,1,0,8,'状态'),
('vustomer','propertyArr','comment',3,1,0,9,'说明'),
('vustomer','pageBtn','score',4,1,0,1,'积分'),
('vustomer','pageBtn','release',4,1,0,2,'释放');

-- -------------------- feedback (反馈/投诉/维修) --------------------
INSERT INTO `customer`.`customerfunction` (`name`,`key`,`value`,`type`,`subtype`,`status`,`sort`,`comment`) VALUES
('feedback','feedback','feedback',0,0,0,8,'反馈管理页面'),
('feedback','apiPage','api.customer.pageFeedback',1,0,0,1,'反馈分页接口'),
('feedback','condArr','customer-feedback-orderId',2,1,0,1,'装修单号'),
('feedback','condArr','customer-feedback-phone',2,1,0,2,'电话'),
('feedback','condArr','customer-feedback-createTime',2,1,0,3,'创建时间'),
('feedback','condArr','customer-feedback-type',2,1,0,4,'类型'),
('feedback','condArr','customer-feedback-company',2,1,0,5,'公司'),
('feedback','condArr','customer-feedback-status',2,1,0,6,'状态'),
('feedback','condArr','customer-feedback-handler',2,1,0,7,'处理人'),
('feedback','condArr','customer-feedback-receiver',2,1,0,8,'接收人'),
('feedback','propertyArr','orderId',3,1,0,1,'装修单号'),
('feedback','propertyArr','createTime',3,1,0,2,'创建时间'),
('feedback','propertyArr','phone',3,1,0,3,'电话'),
('feedback','propertyArr','type',3,1,0,4,'类型'),
('feedback','propertyArr','company',3,1,0,5,'公司'),
('feedback','propertyArr','content',3,1,0,6,'说明'),
('feedback','propertyArr','receiver',3,1,0,7,'接收人'),
('feedback','propertyArr','receiveTime',3,1,0,8,'接收时间'),
('feedback','propertyArr','handler',3,1,0,9,'处理人'),
('feedback','propertyArr','handleTime',3,1,0,10,'处理时间'),
('feedback','propertyArr','finisher',3,1,0,11,'完成人'),
('feedback','propertyArr','finishTime',3,1,0,12,'完成时间'),
('feedback','propertyArr','status',3,1,0,13,'状态'),
('feedback','pageBtn','drawing',4,1,0,1,'图片'),
('feedback','pageBtn','record',4,1,0,2,'记录'),
('feedback','pageBtn','receive',4,1,0,3,'接收'),
('feedback','pageBtn','done',4,1,0,4,'完成'),
('feedback','pageBtn','complaint',4,1,0,5,'投诉'),
('feedback','pageBtn','guarantee',4,1,0,6,'维修'),
('feedback','pageBtn','backVisit',4,1,0,7,'回访');

-- -------------------- revisit (回访) --------------------
INSERT INTO `customer`.`customerfunction` (`name`,`key`,`value`,`type`,`subtype`,`status`,`sort`,`comment`) VALUES
('revisit','revisit','revisit',0,0,0,9,'回访管理页面'),
('revisit','apiPage','api.customer.pageRevisit',1,0,0,1,'回访分页接口'),
('revisit','condArr','customer-service-orderId',2,1,0,1,'装修单号'),
('revisit','condArr','customer-service-revisit-type',2,1,0,2,'回访类型'),
('revisit','propertyArr','rid',3,1,0,1,'回访id'),
('revisit','propertyArr','orderId',3,1,0,2,'装修单号'),
('revisit','propertyArr','type',3,1,0,3,'类型'),
('revisit','propertyArr','ident',3,1,0,4,'引用id'),
('revisit','propertyArr','creater',3,1,0,5,'操作人'),
('revisit','propertyArr','createTime',3,1,0,6,'创建时间'),
('revisit','propertyArr','gladness',3,1,0,7,'满意度'),
('revisit','propertyArr','content',3,1,0,8,'内容');

-- ======================================================================
-- 默认权限初始化
-- ======================================================================

-- -------------------- 一、已有 6 个客源页面: 把 company=30 的现有配置同步到所有公司
-- 背景: 修复 company 过滤前, 全部数据只有 company=30 一家, 修复后其它公司会查不到配置。
-- 此处将 company=30 的 (name, cfid) 组合复制到所有公司, 确保上线后每家公司配置不变。
-- 跳过已有 company=30 的记录, 避免重复。
-- ======================================================================
INSERT INTO `platform`.`customerfunctionright` (`name`, `cfid`, `company`)
SELECT s.name, s.cfid, co.cid
FROM `platform`.`customerfunctionright` s
JOIN `communion`.`company` co ON co.cid != 30
WHERE s.company = 30
  AND NOT EXISTS (
    SELECT 1 FROM `platform`.`customerfunctionright` t
    WHERE t.name = s.name AND t.cfid = s.cfid AND t.company = co.cid
  );

-- -------------------- 二、新增 3 个页面(vustomer/feedback/revisit): 为所有公司初始化
-- ======================================================================
INSERT INTO `platform`.`customerfunctionright` (`name`, `cfid`, `company`)
SELECT f.name, f.cfid, co.cid
FROM `customer`.`customerfunction` f
JOIN `communion`.`company` co
WHERE f.name IN ('vustomer', 'feedback', 'revisit') AND f.`type` != 0
  AND NOT EXISTS (
    SELECT 1 FROM `platform`.`customerfunctionright` t
    WHERE t.name = f.name AND t.cfid = f.cfid AND t.company = co.cid
  );
