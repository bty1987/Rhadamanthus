-- 合同模版"约定比例"下拉常量(decoration.decorationContract.commonRatio)
-- 用途: 对公/个人-新满减主材代购、对公/个人-新配减主材代购 四个合同模版页面的"约定比例"下拉选项
-- 前端: js/contract/C-001-M-2-0001.js 与 C-001-M-2-0003.js 通过 constant.decoration().decorationContract.commonRatio.datas 读取
-- 顺序: 先执行本 SQL, 再发前端文件(否则下拉为空, v_required 校验会拦截保存)
-- 幂等性: 非幂等, 重复执行会插入重复行(按 field 查重后再执行)

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('约定比例(1:1.1)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_1_STR', '1:1.1', '1:1.1', 0),
('约定比例(1:1.2)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_2_STR', '1:1.2', '1:1.2', 0),
('约定比例(1:1.3)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_3_STR', '1:1.3', '1:1.3', 0),
('约定比例(1:1.4)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_4_STR', '1:1.4', '1:1.4', 0),
('约定比例(1:1.5)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_5_STR', '1:1.5', '1:1.5', 0),
('约定比例(1:1.6)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_6_STR', '1:1.6', '1:1.6', 0),
('约定比例(1:1.7)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_7_STR', '1:1.7', '1:1.7', 0),
('约定比例(1:1.8)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_8_STR', '1:1.8', '1:1.8', 0),
('约定比例(1:1.9)', 'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_1_9_STR', '1:1.9', '1:1.9', 0),
('约定比例(1:2)',   'decoration', 'decorationContract', 'commonRatio', 'COMMONRATIO_2_STR',   '1:2',   '1:2',   0);
