-- =====================================================================
-- 用途: 印章档案(data.signet)加"适用装修单等级"列【合同公司签印章等级管控, DDL 先于 jar】
--   grade: 对应装修单(decoration.grade)等级字典(communion.constant module=decoration clazz=decoration type=grade, A~G字母);
--          NULL=不限制(任何装修单可用); 非空=仅限同等级装修单使用(严格口径: 装修单等级为空亦拒);
--          管控落点=合同页公司签(signDecorationContractForCompany, 法大大选章路线)前端过滤+服务端130194硬闸
-- 配套改动: SignetPO/SignetVO加grade + DecorationContractServiceImpl等级闸 + 印章维护页/合同页/签约准备页前端过滤
-- 执行前置条件: 先于 fanglin-data jar(新PO映射新列, 老库+新jar报错); 与 fanglin-decoration jar 同批
-- 回滚方式:
--   不回滚(只加列, 可空, 老jar不读零影响; 代码可独立回退)
-- 验证语句:
--   SHOW COLUMNS FROM `data`.`signet` LIKE 'grade';
-- 幂等性: 非幂等(裸 ALTER, 33号先例), 重跑报 Duplicate column 无害
-- =====================================================================

ALTER TABLE `data`.`signet`
  ADD COLUMN `grade` VARCHAR(4) DEFAULT NULL COMMENT '适用装修单等级(decoration.grade): NULL=不限制, 非空=仅限同等级装修单(严格口径, 装修单等级为空亦拒)';
