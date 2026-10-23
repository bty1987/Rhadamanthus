-- ============================================================================
-- 文件: 15_duty_supplement_from_fluser_20261022.sql  (v2: 纯批量INSERT,免EXISTS)
-- 库表: communion.duty
-- 用途: 按"岗位分类核对_方林集团_v3_20261022084718.xlsx"的"需要 ERP 补充"sheet
--       向 communion.duty 补录 63 个 fl-user 岗位(一条多值INSERT,整批一事务)。
--       v1的 INSERT...SELECT WHERE NOT EXISTS 在MySQL 5.6系语法错误(SELECT无FROM
--       不能带WHERE),且63名已生产实时核实均不存在、GW编码全库为0条,无需防重,
--       故改纯批量INSERT。
--       · 49个同名岗位未包含(48行sheet标注"已有同名ERP岗位"+"信息化中心总监"
--         生产实查已存在=14号治理组),清单见尾部附录,待业务确认后另行处理;
--       · 部门类型(sheet未填)按岗位名关键词映射:设计/平面→2设计部(6)、主材→6主材部(3)、
--         工程/监理/预算/保险/售后→8工程部(12)、运营/电商/客户/咨询/新媒体/推广/主播/家装/
--         业务/约访/企划/文案/中介/品牌→4业务部(23)、其余→10职能部(19);⚠️启发式,可改行内值;
--       · lead一律0(sheet未提供领导标识);status已换算duty口径:0=启用,1=禁用;
--       · 6行名称含"已禁用/测试/废弃"字样行尾⚠️标注,建议复核后决定去留。
-- 执行前置条件(可选复验):
--   SELECT name FROM communion.duty WHERE name IN ('人事行政经理','运营-经理','电商总监');
--   ——应返回空;若期间有人手工建过同名岗,先删对应VALUES行再执行
-- 回滚方式(生产GW码为零,按前缀删除即精确回滚本批):
--   DELETE FROM communion.duty WHERE code LIKE 'GW0%';
-- ============================================================================

INSERT INTO communion.duty (code, name, pinyin, status, departmentType, type, lead) VALUES
('GW0097', '人事行政经理', 'renshixingzhengjingli', 1, 10, 0, 0),
('GW0112', '运营-经理', 'yunyingjingli', 0, 4, 0, 0),
('GW0117', '电商总监', 'dianshangzongjian', 0, 4, 0, 0),
('GW0131', '客户部经理', 'kehubujingli', 0, 4, 0, 0),
('GW0159', '设计部总监', 'shejibuzongjian', 0, 2, 0, 0),
('GW0207', '主材组长', 'zhucaizuzhang', 0, 6, 0, 0),
('GW0214', '前台接待', 'qiantaijiedai', 0, 10, 0, 0),
('GW0217', '品牌推广经理', 'pinpaituiguangjingli', 1, 4, 0, 0),
('GW0223', '客户部总监', 'kehubuzongjian', 0, 4, 0, 0),
('GW0224', '预算员', 'yusuanyuan', 0, 8, 0, 0),
('GW0227', '前台咨询部经理', 'qiantaizixunbujingli', 0, 4, 0, 0),
('GW0229', '研发总监', 'yanfazongjian', 0, 10, 0, 0),
('GW0236', '高级产品设计师（三分区）', 'gaojichanpinshejishisanfenqu', 1, 2, 0, 0),
('GW0237', '设计师助理', 'shejishizhuli', 0, 2, 0, 0),
('GW0245', '平面设计', 'pingmiansheji', 0, 2, 0, 0),
('GW0251', '高级产品设计师（二分区）', 'gaojichanpinshejishierfenqu', 1, 2, 0, 0),
('GW0257', '工程监理', 'gongchengjianli', 1, 8, 0, 0),
('GW0263', '系统管理员', 'xitongguanliyuan', 0, 10, 0, 0),
('GW0265', '售后部主管', 'shouhoubuzhuguan', 0, 8, 0, 0),
('GW0266', '系统工程师', 'xitonggongchengshi', 0, 8, 0, 0),
('GW0274', '企划部经理', 'qihuabujingli', 1, 4, 0, 0),
('GW0284', '产品设计师（四分区）', 'chanpinshejishisifenqu', 1, 2, 0, 0),
('GW0287', '法务', 'fawu', 0, 10, 0, 0),
('GW0292', '税务会计', 'shuiwukuaiji', 1, 10, 0, 0),
('GW0297', '助理主材管家', 'zhulizhucaiguanjia', 0, 6, 0, 0),
('GW0308', '主材服务专员', 'zhucaifuwuzhuanyuan', 0, 6, 0, 0),
('GW0317', '拍剪专员（数字化）', 'paijianzhuanyuanshuzihua', 0, 10, 0, 0),
('GW0326', '文案策划专员(整装）', 'wenancehuazhuanyuanzhengzhuang', 1, 4, 0, 0),
('GW0353', '新媒体经理（市场）', 'xinmeitijinglishichang', 1, 4, 0, 0),
('GW0357', '人事行政主管', 'renshixingzhengzhuguan', 1, 10, 0, 0),
(NULL, '工程部监理（已禁用）', 'gongchengbujianliyijinyong', 1, 8, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
(NULL, '工程部经理（已禁用）', 'gongchengbujingliyijinyong', 1, 8, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
('GW0392', '工程部库管', 'gongchengbukuguan', 0, 8, 0, 0),
('GW0397', '微管员', 'weiguanyuan', 0, 10, 0, 0),
('GW0451', '外部保险员', 'waibubaoxianyuan', 0, 8, 0, 0),
('GW0463', '咨询部长', 'zixunbuzhang', 0, 4, 0, 0),
('GW0465', '武汉新媒体运营专员（店铺）', 'wuhanxinmeitiyunyingzhuanyuandianpu', 0, 4, 0, 0),
('GW0466', '合肥运营专员', 'hefeiyunyingzhuanyuan', 1, 4, 0, 0),
('GW0467', '南京新媒体运营专员', 'nanjingxinmeitiyunyingzhuanyuan', 0, 4, 0, 0),
('GW0468', '副总裁-助理', 'fuzongcaizhuli', 1, 10, 0, 0),
('GW0470', '推广新媒体', 'tuiguangxinmeiti', 0, 4, 0, 0),
('GW0471', '咨询部长（测试勿动）', 'zixunbuzhangceshiwudong', 1, 4, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
('GW0510', '主播经理', 'zhubojingli', 1, 4, 0, 0),
('GW0511', '系统运维支持', 'xitongyunweizhichi', 0, 10, 0, 0),
('GW0513', '保险员', 'baoxianyuan', 0, 8, 0, 0),
('GW0518', '数据测试', 'shujuceshi', 0, 10, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
('GW0525', '工程研发中心经理', 'gongchengyanfazhongxinjingli', 0, 8, 0, 0),
('GW0527', '约访分区总监', 'yuefangfenquzongjian', 0, 4, 0, 0),
('GW0529', '中介运营专员', 'zhongjieyunyingzhuanyuan', 0, 4, 0, 0),
('GW0530', '中介运营经理', 'zhongjieyunyingjingli', 0, 4, 0, 0),
('GW0531', '中介运营总监', 'zhongjieyunyingzongjian', 0, 4, 0, 0),
('GW0541', '经营分析经理', 'jingyingfenxijingli', 0, 10, 0, 0),
('GW0542', '推广人员-小红书', 'tuiguangrenyuanxiaohongshu', 1, 4, 0, 0),
('GW0544', 'Bi城市总经理', 'bichengshizongjingli', 1, 10, 0, 0),
('GW0555', 'BI板块总经理', 'bibankuaizongjingli', 1, 10, 0, 0),
('GW0557', '家装顾问', 'jiazhuangguwen', 1, 4, 0, 0),
('GW0559', '测试进群岗位', 'ceshijinqungangwei', 1, 10, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
('GW0561', '企微进群管理岗位（废弃）', 'qiweijinqunguanligangweifeiqi', 1, 10, 0, 0),  -- ⚠️ 名称含已禁用/测试/废弃,建议复核后决定去留
('GW0567', '工程客服经理', 'gongchengkefujingli', 0, 8, 0, 0),
('GW0569', '工程客服', 'gongchengkefu', 0, 8, 0, 0),
('GW0571', '自营商贸业务员', 'ziyingshangmaoyewuyuan', 0, 4, 0, 0),
('GW0572', '自营商贸财务', 'ziyingshangmaocaiwu', 0, 10, 0, 0),
('GW0573', '商贸管理员', 'shangmaoguanliyuan', 0, 10, 0, 0);

-- ============================================================================
-- 验证语句(执行后核对):
--   ① 本批计数,应=63:
--   SELECT COUNT(*) FROM communion.duty WHERE code LIKE 'GW0%';
--   ② 抽查:
--   SELECT did, code, name, pinyin, status, departmentType, type, lead
--   FROM communion.duty WHERE code LIKE 'GW0%' ORDER BY code;
--   ③ 全表重名基线比对(不应新增同名启用组):
--   SELECT name, COUNT(*) cnt FROM communion.duty GROUP BY name HAVING cnt > 1;
-- ============================================================================
-- 附录: 49个未插入的同名待确认岗位(fl-user ID·名称·ERP既有did)
--   437·监理(914) / 453·主材销售部经理(508) / 461·财务副总监(350) / 463·外阜财务(279)
--   470·产品部经理(950) / 471·销售内勤(278) / 477·预算主管(166) / 481·库房文员(29,96)
--   482·推广经理(43) / 486·地面找平(38) / 491·设计总监助理(102) / 517·技术主管(119)
--   523·东北区域约访总监(713) / 525·渠道总监(555) / 527·方案设计经理(607) / 537·视频编导主管(505)
--   547·工程部内勤(295) / 551·方林总经理(458) / 557·网销专员(50) / 558·总经办助理(85)
--   567·后勤(201) / 572·运维工程师(548) / 588·主材库管(187) / 593·库管主管(472)
--   603·行政前台(580) / 607·合约专员(兼前台)(809) / 616·恩林浑南前台接待(675) / 626·战略副总监(658)
--   635·主材中心总监(467) / 639·SEM搜索专员(521) / 640·平台管理专员(613) / 644·拍剪专员(主材)(573)
--   645·财务实施工程师(633) / 646·软件测试工程师(638) / 650·新媒体主管(821) / 652·主材约访专员(609)
--   653·供应链实施工程师(634) / 664·PMO(726) / 667·渠道经理(556) / 668·主材约访主管(653)
--   678·恩林奉天前台接待(676) / 680·IOS开发工程师(814) / 14514·市场新媒体经理(773) / 14518·培训专员(123)
--   15333·主材文员(214) / 25250·新媒体经理(951) / 31771·综合专员(672) / 32531·培训经理(125,199)
--   654·信息化中心总监(679,705——14号治理组,随该单确认)
-- ============================================================================
