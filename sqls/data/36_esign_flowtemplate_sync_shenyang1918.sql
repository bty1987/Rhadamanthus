-- =====================================================================
-- 36: e签宝流程模板同步到沈阳1918装饰(company=2)
-- =====================================================================
-- 用途:
--   将 e签宝平台(沈阳数林科技 orgId=0b94fe62, 即 systemconfig esign.template.orgid)
--   下已上传的 20 张启用状态流程模板登记到 data.contract(company=2 沈阳1918装饰, atttype=0 装修),
--   并补齐流程模板路线开关配置 communion.systemconfig esign.orgid.2。
--   依据 GET /v3/sign-templates?orgId=0b94fe62 全量拉取(22张, 其中 2 张 status=0 停用不同步:
--   "2026.8工程合同-对个人"已被 2026.11.1 版本取代; "wKgFd2qnwx..."为脏名误建物且主体=辽宁爱林)。
--   同批模板企业参与方均为 setMode=2 固定成员(沈阳数林科技, 平台方自动落章),
--   个人参与方 setMode=1(发起时绑定装修单客户), 与公司解耦, 可直接复用。
--   参照先例: company=43(盘锦宜家) befdeb9a(2026-10-28 生产创建实跑通过)。
--
-- 执行前置条件:
--   1. 生产库执行(data.contract 与 communion.systemconfig 均在生产)。
--   2. 幂等: 每行 NOT EXISTS 守卫(按 no+company / key+company), 可重复执行。
--   3. 20 个模板编号(no=e签宝 signTemplateId)生产 data.contract 均无存量(已核)。
--
-- 验证语句:
--   SELECT COUNT(*) FROM data.contract WHERE company=2 AND path='esign://docTemplate';          -- 期望 20
--   SELECT * FROM communion.systemconfig WHERE `key`='esign.orgid.2' AND company=2;             -- 期望 1 行
--   页面验证: 合同模板页(data/contract.html)切换沈阳1918装饰 → 列表 20 条厂商列"e签宝";
--   装修单详情创建合同 → 模板下拉出现"(e签宝)"标注模板 → 选模板填报 → 发起后 decorationcontract.provider=2 且 flowid 有值。
--
-- 回滚方式:
--   DELETE FROM data.contract WHERE company=2 AND no IN ('a3e8b5f7f3824eb591ba961b17b945b8','2847f5ac02f24e0e9c27ee13eafd767a','22a1a3ed68224bc589119561a94e3dec','cdca193db4c24714852e62c47f15ab2d','39209e493c1744a791bf5c2238e4e296','f2d8baa83c3741af8dc2d2e62158d1a0','617b83057cba4e09bcf370ac19caa333','792c734968244e389612c0021a8ba3d2','5b5d098edf0748d6a09114a9736e62cd','2684b2a200f14b7fa5ebd723cbf45c40','9c5dd09b57f54c93a35c7180666ce765','aa94a2b5785a409f946b5b230e311c2b','642988ee21c8498fbaa21c67d0f147d1','515fadd2504e4809a4561ad6ca389f9e','105f349965744652940ebc2d3f523af7','245981fb4f6e49e98d6f3b19e951a20a','d2bf3b314b0e43419008dd2ff949bfb6','8e14043ef45f405ab388e4f696193086','23aeaf26d44c4143a6f892db89928f65','b326df74c0d948538a7b793988dcec6c');
--   DELETE FROM communion.systemconfig WHERE `key`='esign.orgid.2' AND company=2;
--   (仅当尚无基于这些模板创建的 decorationcontract 行时才可回滚, 否则模板行置 status=1 停用替代删除)
-- =====================================================================

-- ---------- 段1: data.contract 登记 20 张流程模板 ----------
-- page=对应类别合同填写页(照沈阳1918现有同名法大大行的基础路径), 创建合同弹窗 load 收集填报;
-- videopath 照前端 e签宝形态口径='esign://docTemplate'; noticePath 空。

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'a3e8b5f7f3824eb591ba961b17b945b8', '20240709解除协议-对个人', '20240709解除协议-对个人', '/views/contract/C-001-D-5-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='a3e8b5f7f3824eb591ba961b17b945b8' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '2847f5ac02f24e0e9c27ee13eafd767a', '一笔款20260305全案产品委托购买协议-对公司1', '一笔款20260305全案产品委托购买协议-对公司1', '/views/contract/C-002-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='2847f5ac02f24e0e9c27ee13eafd767a' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '22a1a3ed68224bc589119561a94e3dec', '一笔款20260305全案产品委托购买协议-对个人1', '一笔款20260305全案产品委托购买协议-对个人1', '/views/contract/C-002-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='22a1a3ed68224bc589119561a94e3dec' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'cdca193db4c24714852e62c47f15ab2d', '一笔款20260305半包产品委托购买协议-对公司1', '一笔款20260305半包产品委托购买协议-对公司1', '/views/contract/C-003-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='cdca193db4c24714852e62c47f15ab2d' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '39209e493c1744a791bf5c2238e4e296', '一笔款20260305半包产品委托购买协议-对个人1', '一笔款20260305半包产品委托购买协议-对个人1', '/views/contract/C-003-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='39209e493c1744a791bf5c2238e4e296' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'f2d8baa83c3741af8dc2d2e62158d1a0', '二笔款20260305全案产品委托购买协议-对公司2', '二笔款20260305全案产品委托购买协议-对公司2', '/views/contract/C-002-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='f2d8baa83c3741af8dc2d2e62158d1a0' AND company=2);

-- 注: 平台侧该模板名称疑似漏"二"字(系列其余均为"二笔款"前缀), 原样同步, 如需改名走平台编辑免登链接
INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '617b83057cba4e09bcf370ac19caa333', '笔款20260305全案产品委托购买协议-对个人2', '笔款20260305全案产品委托购买协议-对个人2', '/views/contract/C-002-M-2-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='617b83057cba4e09bcf370ac19caa333' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '792c734968244e389612c0021a8ba3d2', '二笔款20260305半包产品委托购买协议-对公司2', '二笔款20260305半包产品委托购买协议-对公司2', '/views/contract/C-001-M-2-0004.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='792c734968244e389612c0021a8ba3d2' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '5b5d098edf0748d6a09114a9736e62cd', '二笔款20260305半包产品委托购买协议-对个人2', '二笔款20260305半包产品委托购买协议-对个人2', '/views/contract/C-001-M-2-0004.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='5b5d098edf0748d6a09114a9736e62cd' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '2684b2a200f14b7fa5ebd723cbf45c40', '二笔款20250709半包服务费协议-对个人', '二笔款20250709半包服务费协议-对个人', '/views/contract/C-001-D-3-0002.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='2684b2a200f14b7fa5ebd723cbf45c40' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '9c5dd09b57f54c93a35c7180666ce765', '20260423设计费合同-对公司', '20260423设计费合同-对公司', '/views/contract/C-001-D-1-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='9c5dd09b57f54c93a35c7180666ce765' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'aa94a2b5785a409f946b5b230e311c2b', '20260423设计费合同-对个人', '20260423设计费合同-对个人', '/views/contract/C-001-D-1-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='aa94a2b5785a409f946b5b230e311c2b' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '642988ee21c8498fbaa21c67d0f147d1', '20250709全案服务费协议-对公司', '20250709全案服务费协议-对公司', '/views/contract/C-001-D-3-0002.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='642988ee21c8498fbaa21c67d0f147d1' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '515fadd2504e4809a4561ad6ca389f9e', '20250709全案服务费协议-对个人', '20250709全案服务费协议-对个人', '/views/contract/C-001-D-3-0002.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='515fadd2504e4809a4561ad6ca389f9e' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '105f349965744652940ebc2d3f523af7', '20250709半包服务费协议-对公司', '20250709半包服务费协议-对公司', '/views/contract/C-001-D-3-0002.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='105f349965744652940ebc2d3f523af7' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '245981fb4f6e49e98d6f3b19e951a20a', '20250709半包服务费协议-对个人', '20250709半包服务费协议-对个人', '/views/contract/C-001-D-3-0002.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='245981fb4f6e49e98d6f3b19e951a20a' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'd2bf3b314b0e43419008dd2ff949bfb6', '20250709-14天无理由退合同承诺-对公司', '20250709-14天无理由退合同承诺-对公司', '/views/contract/C-001-D-8-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='d2bf3b314b0e43419008dd2ff949bfb6' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '8e14043ef45f405ab388e4f696193086', '2026.11.1施工合同-对公司', '2026.11.1施工合同-对公司', '/views/contract/C-001-D-0-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='8e14043ef45f405ab388e4f696193086' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT '23aeaf26d44c4143a6f892db89928f65', '2026.11.1施工合同-对个人', '2026.11.1施工合同-对个人', '/views/contract/C-001-D-0-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='23aeaf26d44c4143a6f892db89928f65' AND company=2);

INSERT INTO data.contract (no, name, title, page, path, videopath, noticePath, atttype, status, company)
SELECT 'b326df74c0d948538a7b793988dcec6c', '20250709-14天无理由退合同承诺-对个人', '20250709-14天无理由退合同承诺-对个人', '/views/contract/C-001-D-8-0001.html', 'esign://docTemplate', 'esign://docTemplate', NULL, 0, 0, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE no='b326df74c0d948538a7b793988dcec6c' AND company=2);

-- ---------- 段2: 流程模板路线开关(缺此行, 沈阳1918创建合同走不到流程模板分支, 模板ID会被当文档模板ID误用) ----------
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, createTime, comment, company)
SELECT 'esign', 'esign.orgid.2', '0b94fe62e691451e8e342cdea237ae8d', 0, NOW(), '流程模板归属企业orgId-探测sign-templates用(照company=43口径, 企业=沈阳数林科技有限责任公司)', 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key`='esign.orgid.2' AND company=2);
