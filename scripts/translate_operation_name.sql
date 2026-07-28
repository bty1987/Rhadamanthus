-- ============================================================================
-- communion.operation 表 name 字段英文名翻译为简短中文
-- 范围: name 完全无中文字符的 105 条记录 (oid 见下)
-- 翻译依据:
--   1. 项目代码 PO/Service 真实业务语义核实 (见脚本同目录说明)
--   2. 同类已中文化记录的统一表述 (如 "按XId查询Y" / "分页查询Y")
--   3. 元音替换命名还原: Soods=主材, Aoods=辅材, Oales=销售单,
--      Qeasure=量房, Cormrice=工费配比, Protation=利润测算, Holonomy=整装,
--      Vustomer=客户, Signet=电子印章
-- 说明: name 字段在数据库中存储截断(带…), 此次翻译用简短中文(<=16字),
--       既解决英文显示问题, 也避免再次超长截断
-- ============================================================================

-- ---------- oid 678 ~ 1540: 105 条英文操作名 ----------
UPDATE communion.operation SET name = '查询功能区(通用)'                WHERE oid = 678;
UPDATE communion.operation SET name = '查询功能区项(通用)'              WHERE oid = 690;
UPDATE communion.operation SET name = '查询施工进度(订单)'              WHERE oid = 736;
UPDATE communion.operation SET name = '新增功能区(复制)'                WHERE oid = 817;
UPDATE communion.operation SET name = '查询装修款(合同)'                WHERE oid = 1057;
UPDATE communion.operation SET name = '提交客源转装修审批'              WHERE oid = 1333;
UPDATE communion.operation SET name = '查询业务员部门权限'              WHERE oid = 1359;
UPDATE communion.operation SET name = '查询设计师部门权限'              WHERE oid = 1360;
UPDATE communion.operation SET name = '提交客源停用审批'                WHERE oid = 1435;
UPDATE communion.operation SET name = '消耗装修活动奖品'                WHERE oid = 1445;
UPDATE communion.operation SET name = '按UID查询用户经历'              WHERE oid = 1446;
UPDATE communion.operation SET name = '新增图纸'                        WHERE oid = 1447;
UPDATE communion.operation SET name = '更新主材'                        WHERE oid = 1448;
UPDATE communion.operation SET name = '重置密码'                        WHERE oid = 1449;
UPDATE communion.operation SET name = '按订单查量房'                    WHERE oid = 1450;
UPDATE communion.operation SET name = '新增部门'                        WHERE oid = 1451;
UPDATE communion.operation SET name = '更新业务员部门权限'              WHERE oid = 1452;
UPDATE communion.operation SET name = '同步装修功能权限'                WHERE oid = 1453;
UPDATE communion.operation SET name = '驳回销售单'                      WHERE oid = 1454;
UPDATE communion.operation SET name = '更新活动状态'                    WHERE oid = 1455;
UPDATE communion.operation SET name = '新增活动'                        WHERE oid = 1456;
UPDATE communion.operation SET name = '新增公告'                        WHERE oid = 1457;
UPDATE communion.operation SET name = '更新公告'                        WHERE oid = 1458;
UPDATE communion.operation SET name = '更新报价版本'                    WHERE oid = 1459;
UPDATE communion.operation SET name = '更新报价版本状态'                WHERE oid = 1460;
UPDATE communion.operation SET name = '按用户分页主材'                  WHERE oid = 1461;
UPDATE communion.operation SET name = '新增客户'                        WHERE oid = 1462;
UPDATE communion.operation SET name = '分页查询商品池'                  WHERE oid = 1463;
UPDATE communion.operation SET name = '新增报价图片'                    WHERE oid = 1464;
UPDATE communion.operation SET name = '更新选材'                        WHERE oid = 1465;
UPDATE communion.operation SET name = '分页查询供应商辅材'              WHERE oid = 1466;
UPDATE communion.operation SET name = '转移客户机会'                    WHERE oid = 1467;
UPDATE communion.operation SET name = '新增转换款'                      WHERE oid = 1468;
UPDATE communion.operation SET name = '转换款支付'                      WHERE oid = 1469;
UPDATE communion.operation SET name = '取消转换款'                      WHERE oid = 1470;
UPDATE communion.operation SET name = '注册用户'                        WHERE oid = 1471;
UPDATE communion.operation SET name = '认证用户'                        WHERE oid = 1472;
UPDATE communion.operation SET name = '确认用户'                        WHERE oid = 1473;
UPDATE communion.operation SET name = '按SID查询印章'                   WHERE oid = 1474;
UPDATE communion.operation SET name = '公司签署员工合同'                WHERE oid = 1475;
UPDATE communion.operation SET name = '附签员工合同'                    WHERE oid = 1476;
UPDATE communion.operation SET name = '归档员工合同'                    WHERE oid = 1477;
UPDATE communion.operation SET name = '按WSID查工人工资'               WHERE oid = 1478;
UPDATE communion.operation SET name = '分页查询VIP活动'                WHERE oid = 1479;
UPDATE communion.operation SET name = '统计放线'                        WHERE oid = 1480;
UPDATE communion.operation SET name = '按QCID查工费配比'               WHERE oid = 1481;
UPDATE communion.operation SET name = '按QCID查报价格式'               WHERE oid = 1482;
UPDATE communion.operation SET name = '更新利润测算'                    WHERE oid = 1483;
UPDATE communion.operation SET name = '更新销售单付款'                  WHERE oid = 1484;
UPDATE communion.operation SET name = '按订单分页主材'                  WHERE oid = 1485;
UPDATE communion.operation SET name = '分页查询预收客户'                WHERE oid = 1486;
UPDATE communion.operation SET name = '删除审批人'                      WHERE oid = 1487;
UPDATE communion.operation SET name = '更新销售卡券'                    WHERE oid = 1488;
UPDATE communion.operation SET name = '分页查询组织'                    WHERE oid = 1489;
UPDATE communion.operation SET name = '新增组织'                        WHERE oid = 1490;
UPDATE communion.operation SET name = '查询组织'                        WHERE oid = 1491;
UPDATE communion.operation SET name = '更新公司'                        WHERE oid = 1492;
UPDATE communion.operation SET name = '拉取付款配比项'                  WHERE oid = 1493;
UPDATE communion.operation SET name = '删除客户公司规则'                WHERE oid = 1494;
UPDATE communion.operation SET name = '查询用户教育经历'                WHERE oid = 1495;
UPDATE communion.operation SET name = '查询用户操作记录'                WHERE oid = 1496;
UPDATE communion.operation SET name = '分页查询主材付款'                WHERE oid = 1497;
UPDATE communion.operation SET name = '查询品牌入驻商'                  WHERE oid = 1498;
UPDATE communion.operation SET name = '删除报价价格'                    WHERE oid = 1499;
UPDATE communion.operation SET name = '更新预签项状态'                  WHERE oid = 1500;
UPDATE communion.operation SET name = '分页查询装修匹配'                WHERE oid = 1501;
UPDATE communion.operation SET name = '新增装修匹配'                    WHERE oid = 1502;
UPDATE communion.operation SET name = '删除利润测算项'                  WHERE oid = 1503;
UPDATE communion.operation SET name = '分页查询整装方案'                WHERE oid = 1504;
UPDATE communion.operation SET name = '发送付款'                        WHERE oid = 1505;
UPDATE communion.operation SET name = '更新功能区状态'                  WHERE oid = 1506;
UPDATE communion.operation SET name = '恢复默认密码'                    WHERE oid = 1507;
UPDATE communion.operation SET name = '删除施工图纸'                    WHERE oid = 1508;
UPDATE communion.operation SET name = '更新沟通状态'                    WHERE oid = 1509;
UPDATE communion.operation SET name = '新增沟通'                        WHERE oid = 1510;
UPDATE communion.operation SET name = '删除沟通'                        WHERE oid = 1511;
UPDATE communion.operation SET name = '删除销售单付款'                  WHERE oid = 1512;
UPDATE communion.operation SET name = '更新装修匹配'                    WHERE oid = 1513;
UPDATE communion.operation SET name = '取消客源'                        WHERE oid = 1514;
UPDATE communion.operation SET name = '分页查询报价记录'                WHERE oid = 1515;
UPDATE communion.operation SET name = '新增预付款'                      WHERE oid = 1516;
UPDATE communion.operation SET name = '更新合同'                        WHERE oid = 1517;
UPDATE communion.operation SET name = '分页查询户型'                    WHERE oid = 1518;
UPDATE communion.operation SET name = '更新客户电话状态'                WHERE oid = 1519;
UPDATE communion.operation SET name = '客户电话设为默认'                WHERE oid = 1520;
UPDATE communion.operation SET name = '作废销售单'                      WHERE oid = 1521;
UPDATE communion.operation SET name = '分页查询主材结算'                WHERE oid = 1522;
UPDATE communion.operation SET name = '关联推荐装修单'                  WHERE oid = 1523;
UPDATE communion.operation SET name = '取消关联推荐装修单'              WHERE oid = 1524;
UPDATE communion.operation SET name = '分页查询销售结算项'              WHERE oid = 1525;
UPDATE communion.operation SET name = '按QIID查定额工时'               WHERE oid = 1526;
UPDATE communion.operation SET name = '结算选材项'                      WHERE oid = 1527;
UPDATE communion.operation SET name = '更新辅料计算'                    WHERE oid = 1528;
UPDATE communion.operation SET name = '更新辅料状态'                    WHERE oid = 1529;
UPDATE communion.operation SET name = '开工'                            WHERE oid = 1530;
UPDATE communion.operation SET name = '查询选材项状态权限'              WHERE oid = 1531;
UPDATE communion.operation SET name = '按拼音查报价命名规则'            WHERE oid = 1532;
UPDATE communion.operation SET name = '新增客户用户规则'                WHERE oid = 1533;
UPDATE communion.operation SET name = '按CURID停用客户规则'            WHERE oid = 1534;
UPDATE communion.operation SET name = '分页查询分组'                    WHERE oid = 1535;
UPDATE communion.operation SET name = '分页查询报价命名规则'            WHERE oid = 1536;
UPDATE communion.operation SET name = '查询施工功能'                    WHERE oid = 1537;
UPDATE communion.operation SET name = '分页查询辅材收费'                WHERE oid = 1538;
UPDATE communion.operation SET name = '查询施工成本'                    WHERE oid = 1539;
UPDATE communion.operation SET name = '分页查询辅材成本'                WHERE oid = 1540;
