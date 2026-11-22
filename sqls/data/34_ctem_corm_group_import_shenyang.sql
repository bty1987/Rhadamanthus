-- ============================== 集团施工项导入-沈阳方林 (443 施工项规格) ==============================
-- 用途: 集团施工项模板(集团施工项导入-沈阳方林(1).xlsx)导入四表:
--       quotation.quotationCtem(施工项主档)/quotation.quotationformat(规格) + data.cormrice(定额工费)/data.cormood(定额材料)
-- 源: 主表443对(项目,规格)唯一对(1对重复已并); 定额工费539行(481有值/58占位跳过); 定额材料244实料行; 工时sheet空表未导入
-- 匹配口径(生产实查 2026-11-13): ctem按name精确匹配(库内同名多qcid=0); format按(qcid,format)精确匹配
--       A类(项目+规格均在库)=5 对直接复用qfid(弧形石膏线|特殊订制等); B类(项目在库,规格新)=58 对插format(含高空作业费3规格挂既有qcid=534); C类(全新)=380 对插ctem+format(276个新名称)
-- 维度映射: 单位→communion.measurementunit 全直命中(平米=47独立id); 工程节点→data.constructionNode company=1 按名称
--       🔴"水工"映射到水暖(cnid=5)——全公司均无"水工"节点(惯例=水暖+水工安装), 如需独立水工节点先建后改本映射
--       "电工安装"取cnid=12(启用)非625(禁用)
-- 枚举映射: 业务类型→type 标准=0/成本=1/纯利=4/综合=6(communion.constant data.quotationItem字典); 是否打折→discount 是=1/否=0(同字典)
-- 金额口径: 销售价/成本价/工费salary 元x1000厘(Decimal精确); cormrice.trannum 按预算量=1000(即1.000)/固定量=0(normrice惯例);
--       cormood.normnum=storenum=数量x1000, normunit=storeunit=材料单位, price=0(模板无材料价列)
-- 其他口径: cormrice.company=0(集团数据语义废弃拍板); comment=工艺说明\n计价说明拼接(最长349<500); cormood.name取data.noods.name;
--       ctem/format的pinyin=PinYin4Util同款首字母(name+format); ctem维度六列(类型/分类/大类/小类/单位/工种)留NULL(既有211行同款)
-- 括号名拆分(用户拍板3+5): 主表"基础名（规格）"且规格名称列为空 → 括号内容即规格, 拆成(基础名,规格)入库, 共107行
--       (含1行半角括号"有线网络智能家居电路改造（非平层)"归一); 括号后带后缀(如"增加错缝铺设（含工字铺）人工费")不拆;
--       规格列有值的括号名(如"地面瓷砖铺设（无辅料）"+规格200*200, 31行)括号属名称不拆; 工费/材料sheet同语义行用括号全名作键,
--       已按remap归一到拆分后键(如高空作业费OSB材料2行); 拆分后工费/材料引用缺口清零
-- 缺口(未导入, 待人工): 58行工费占位(有节点无金额)跳过——涉及57项目见文件尾部SKIP清单
-- 前置: 无DDL; 全部INSERT带NOT EXISTS幂等守卫, 可重复执行(重跑时段取既有id续挂定额)
-- 回滚: DELETE m FROM data.cormood m JOIN quotation.quotationformat f ON m.qfid=f.qfid JOIN quotation.quotationCtem c ON f.qcid=c.qcid
--         WHERE c.qcid > 555 OR (c.qcid <= 555 AND EXISTS (SELECT 1 FROM quotation.quotationCtem c2 WHERE c2.qcid=c.qcid AND c2.name IN ('地面瓷砖铺设','PVC下水横杠上提' )) AND f.qfid > 916);
--       🔴精确回滚按执行后 SELECT MIN/MAX 圈定本次新增区间(qcid>555 / qfid>916 为当前库水位), 回滚脚本先查后删
--       同口径删 data.cormrice(cpid按qfid区间) / quotation.quotationformat(qfid>916) / quotation.quotationCtem(qcid>555)
-- 验证(执行后): SELECT COUNT(*) FROM quotation.quotationCtem;   -- 期望 487 (211+276, C类380对守卫去重后276个新名称)
--       SELECT COUNT(*) FROM quotation.quotationformat;         -- 期望 1098 (660+438: A类5对复用不插)
--       SELECT COUNT(*) FROM data.cormrice;                     -- 期望 480 (539-58占位-1重复, 拆分后全部解上)
--       SELECT COUNT(*) FROM data.cormood;                      -- 期望 244


-- ======== 增加吊斜面边棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加吊斜面边棚', 'zjdxmbp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加吊斜面边棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加吊斜面边棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加吊斜面边棚', '', 'zjdxmbp', 40000, 0, '', 0, 1, 1, '1.乙供：人工及机械。 2.说明：适用于延斜面吊棚和原平顶吊斜面棚。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 检修口制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '检修口制作', 'jxkzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '检修口制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '检修口制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '检修口制作', '', 'jxkzz', 100000, 0, '', 0, 0, 12, '1.工艺：轻钢龙骨基础框架制作→框架安装→检修口石膏板罩面安装→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于厨房或卫生间石膏板吊顶排烟检修口制作。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 地面瓷砖铺设 | 规格:200*200 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '200*200', 'dmczps200*200', 121000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 86000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 86000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:200*200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '200*200', 'dmczps（wfl）200*200', 113000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 86000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 86000);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤300mm;高度＞500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤300mm;高度＞500mm', 'sgbdbppmkd≤300mm;gd＞500mm', 269000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤300mm;高度＞500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤300mm;高度＞500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 47000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 47000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 320, '张', 320, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤500mm;高度＞500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤500mm;高度＞500mm', 'sgbdbppmkd≤500mm;gd＞500mm', 195000, 0, '', 0, 1, 1, '说明:1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤500mm;高度＞500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤500mm;高度＞500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 52000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 52000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤700mm;高度＞500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤700mm;高度＞500mm', 'sgbdbppmkd≤700mm;gd＞500mm', 215000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤700mm;高度＞500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤700mm;高度＞500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 62000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 62000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 地面瓷砖铺设（无辅料） | 规格:1200*2400 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '1200*2400', 'dmczps（wfl）1200*2400', 185000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 90000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 90000);

-- ======== 地面瓷砖铺设 | 规格:1000*2000 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '1000*2000', 'dmczps1000*2000', 188000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1000*2000');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1000*2000' LIMIT 1);

-- ======== 地面瓷砖铺设 | 规格:1200*1800 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '1200*1800', 'dmczps1200*1800', 188000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*1800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*1800' LIMIT 1);

-- ======== 高分子地面防水 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '高分子地面防水', 'gfzdmfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '高分子地面防水');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '高分子地面防水' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '高分子地面防水', '', 'gfzdmfs', 100000, 0, '', 0, 1, 47, '1.乙供：人工、材料（包含高分子防水胶、高分子防水布 ）。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 墙面挂网防裂处理 | 规格:(空) ========
SET @qcid = 510; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面挂网防裂处理', '', 'qmgwflcl', 15000, 0, '', 0, 1, 47, '1.工艺：石膏找平处满贴抗裂网格→拼接处重叠→石膏粘贴。2.乙供：玻璃纤维网、人工及机械。3.说明：适用于沙灰质量差的原墙、保温层及大面积龟裂等墙面；墙面挂网防裂处理范围在25mm＜厚度≤40mm，超过40mm套用墙面石膏板找平定额。\n1.计算规则：按平方米计算。\n2.说明：门窗面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 624, '平米', 1000, 4000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 624 AND salary = 4000);

-- ======== 窗帘滑道安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '窗帘滑道安装', 'clhdaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '窗帘滑道安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '窗帘滑道安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '窗帘滑道安装', '', 'clhdaz', 40000, 0, '', 0, 1, 1, '1.塑钢轻型滑道及安装。2.固定螺丝间距≤600mm，要求横平竖直，转角处弧形流畅。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 地面瓷砖铺设 | 规格:1000*1000 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '1000*1000', 'dmczps1000*1000', 128000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1000*1000');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1000*1000' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 48000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 48000);

-- ======== 全屋总控开关 | 规格:平层 (拆分自:全屋总控开关（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋总控开关', 'qwzkkg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋总控开关');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋总控开关' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋总控开关', '平层', 'qwzkkgpc', 350000, 0, '1', 0, 0, 12, '1.工艺：管内穿2.5平方BV线。 2.乙供：子目中包含的材料、人工及机械。 3.说明：不含所需要的接触器和组装配线。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);

-- ======== 全屋总控开关 | 规格:非平层 (拆分自:全屋总控开关（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋总控开关', 'qwzkkg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋总控开关');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋总控开关' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋总控开关', '非平层', 'qwzkkgfpc', 550000, 0, '1', 0, 0, 12, '1.工艺：管内穿2.5平方BV线。 2.乙供：子目中包含的材料、人工及机械。 3.说明：不含所需要的接触器和组装配线；按层收取费用。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);

-- ======== 莱姆石瓷砖混合铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '莱姆石瓷砖混合铺设', 'lmsczhhps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '莱姆石瓷砖混合铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '莱姆石瓷砖混合铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '莱姆石瓷砖混合铺设', '', 'lmsczhhps', 160000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 变压器安装人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '变压器安装人工费', 'byqazrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '变压器安装人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '变压器安装人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '变压器安装人工费', '', 'byqazrgf', 50000, 0, '', 0, 0, 12, '1.乙供：人工 2.甲供：变压器\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);

-- ======== 独立配电回路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '独立配电回路敷设', 'dlpdhlfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '独立配电回路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '独立配电回路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '独立配电回路敷设', '', 'dlpdhlfs', 300000, 0, '', 0, 0, 12, '1.工艺：放线定位→开槽→管线敷设→穿2.5平方BV线→绝缘保护→线路测试。 2.乙供：2.5平方BV线、辅材、人工及机械。 3.说明：仅限单独回路控制，如需多条单独回路依次累计增加此项。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);

-- ======== 棚面超厚挂网防裂处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面超厚挂网防裂处理', 'pmchgwflcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面超厚挂网防裂处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面超厚挂网防裂处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面超厚挂网防裂处理', '', 'pmchgwflcl', 40000, 0, '', 0, 1, 47, '1.工艺：石膏找平处满贴抗裂网格→棚面苯板钉固定→拼接处重叠→石膏粘贴 2.乙供：网格、苯板钉、人工及机械。 3.说明：棚面挂网防裂处理范围在25mm＜厚度≤40mm，需使用此项定额。\n1.计算规则：按平方米计算。\n2.说明：门窗面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== OSB假梁制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB假梁制作', 'osbjlzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB假梁制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB假梁制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB假梁制作', '', 'osbjlzz', 218000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB或木方做框架→吊滑拉门框架膨胀吊杆加固处理→梁底双层OSB加固→OSB饰面→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== PU线条面漆喷涂 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'PU线条面漆喷涂', 'puxtmqpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'PU线条面漆喷涂');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'PU线条面漆喷涂' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'PU线条面漆喷涂', '', 'puxtmqpt', 8000, 0, '', 0, 1, 1, '1.工艺：表面多次薄喷施工；每道喷涂前基层彻底除尘，上道漆膜完全干透，方可实施下道喷涂。 2.乙供：面漆、人工及机械。 3.说明：本工序仅负责面漆喷涂，适用于甲方自行完成安装、拼缝及钉眼修补后的施工；基层质量由甲方负责，因基层缺陷导致漆面问题不在本项责任范围。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 2000);

-- ======== PU花角面漆喷涂 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'PU花角面漆喷涂', 'puhjmqpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'PU花角面漆喷涂');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'PU花角面漆喷涂' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'PU花角面漆喷涂', '', 'puhjmqpt', 25000, 0, '', 0, 1, 5, '1.工艺：表面多次薄喷施工；每道喷涂前基层彻底除尘，上道漆膜完全干透，方可实施下道喷涂。 2.乙供：面漆、人工及机械。 3.说明：本工序仅负责面漆喷涂，适用于甲方自行完成安装、拼缝及钉眼修补后的施工；基层质量由甲方负责，因基层缺陷导致漆面问题不在本项责任范围。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 10000);

-- ======== PU灯盘面漆喷涂 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'PU灯盘面漆喷涂', 'pudpmqpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'PU灯盘面漆喷涂');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'PU灯盘面漆喷涂' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'PU灯盘面漆喷涂', '', 'pudpmqpt', 30000, 0, '', 0, 1, 5, '1.工艺：表面多次薄喷施工；每道喷涂前基层彻底除尘，上道漆膜完全干透，方可实施下道喷涂。 2.乙供：面漆、人工及机械。 3.说明：本工序仅负责面漆喷涂，适用于甲方自行完成条安装、拼缝及钉眼修补后的施工；基层质量由甲方负责，因基层缺陷导致漆面问题不在本项责任范围。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 15000);

-- ======== 地面瓷砖铺设 | 规格:100*100 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '100*100', 'dmczps100*100', 298000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);

-- ======== 原墙棚大白铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '原墙棚大白铲除', 'yqpdbcc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '原墙棚大白铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '原墙棚大白铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '原墙棚大白铲除', '', 'yqpdbcc', 3500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：人工铲除墙、顶面饰面及腻子层并装袋。 2.乙供：垃圾袋、人工及机械。 3.说明：饰面包含普通乳胶漆；如墙面、顶面含造型，费用另计；如原墙顶粉刷石膏找平层存在开裂、起砂、空鼓等问题，则应铲除，费用另计；不包含耐水腻子铲除或可拆除保温层拆除等费用；垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 3, '平米', 1000, 2500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 3 AND salary = 2500);

-- ======== 原墙棚仿瓷大白,耐水腻子铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '原墙棚仿瓷大白,耐水腻子铲除', 'yqpfcdb,nsnzcc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '原墙棚仿瓷大白,耐水腻子铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '原墙棚仿瓷大白,耐水腻子铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '原墙棚仿瓷大白,耐水腻子铲除', '', 'yqpfcdb,nsnzcc', 10000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：人工铲除墙、顶面涂料及耐水腻子层并装袋。 2.乙供：垃圾袋、人工及机械。3.说明：饰面包含壁纸、壁布、仿瓷大白铲除；如原墙顶粉刷石膏找平层存在开裂、起砂、空鼓等问题，则应铲除，费用另计；不包括水泥砂浆层铲除或可拆除保温层拆除等费用；垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 3, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 3 AND salary = 10000);

-- ======== 阳台保温层拆除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台保温层拆除', 'ytbwccc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台保温层拆除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台保温层拆除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台保温层拆除', '', 'ytbwccc', 25000, 0, '', 0, 1, 47, '1.工艺：人工拆除室内保温层、并机械剔除墙面粘贴剂并装袋。2.乙供：垃圾袋、人工及机械。3.说明：垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 8000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 8000);

-- ======== 阳台墙砖铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台墙砖铲除', 'ytqzcc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台墙砖铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台墙砖铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台墙砖铲除', '', 'ytqzcc', 15000, 0, '', 0, 1, 47, '1.工艺：人工非保护性铲除瓷砖、马赛克及墙面水泥砂浆找平粘贴层（厚20mm以内）并装袋。 2.乙供：垃圾袋、人工及机械。3.说明：垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 12000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 12000);

-- ======== 120mm以内墙体拆除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '120mm以内墙体拆除', '120mmynqtcc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '120mm以内墙体拆除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '120mm以内墙体拆除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '120mm以内墙体拆除', '', '120mmynqtcc', 50000, 0, '', 0, 0, 47, '1.工艺：人工拆除墙厚120mm以内各类砌块墙体并装袋。2.乙供：垃圾袋、人工及机械。3.说明：不包含混凝土墙（承重结构）拆除；砖混结构禁止拆除。垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。\n2.说明：整体拆除不再重复计收面层材料铲除费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 21000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 21000);

-- ======== 240mm以内墙体拆除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '240mm以内墙体拆除', '240mmynqtcc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '240mm以内墙体拆除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '240mm以内墙体拆除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '240mm以内墙体拆除', '', '240mmynqtcc', 100000, 0, '', 0, 0, 47, '1.工艺：人工拆除墙厚240mm以内各类砌块墙体并装袋。2.乙供：垃圾袋、人工及机械。3.说明：不包含混凝土墙（承重结构）拆除；砖混结构禁止拆除。垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。\n2.说明：整体拆除不再重复计收面层材料铲除费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 42000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 42000);

-- ======== 超优-原墙顶大白铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-原墙顶大白铲除', 'cy-yqddbcc', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-原墙顶大白铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-原墙顶大白铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-原墙顶大白铲除', '', 'cy-yqddbcc', 1800, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 1, 0, 47, '1.工艺：人工铲除墙、顶面饰面及腻子层并装袋。 2.乙供：垃圾袋、人工及机械。 3.说明：饰面包含普通乳胶漆；如墙面、顶面含造型，费用另计；如原墙顶粉刷石膏找平层存在开裂、起砂、空鼓等问题，则应铲除，费用另计；不包含耐水腻子铲除或可拆除保温层拆除等费用；垃圾排放到园区指定地点，如需外运费用另计。\n1.规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 3, '平米', 1000, 2500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 3 AND salary = 2500);

-- ======== 厨房排水立杠制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房排水立杠制作', 'cfpslgzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房排水立杠制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房排水立杠制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房排水立杠制作', '', 'cfpslgzz', 500000, 0, '1', 0, 1, 12, '1.工艺：PVC排水管安装→管件连接。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于厨房无下水管道或损坏严重重新制作；不含水钻打眼。\n1.计算规则：按项计算。\n2.说明：按排水管根数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);

-- ======== 厨房PVC排水立杠三通下落或上提 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房PVC排水立杠三通下落或上提', 'cfpvcpslgstxlhst', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房PVC排水立杠三通下落或上提');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房PVC排水立杠三通下落或上提' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房PVC排水立杠三通下落或上提', '', 'cfpvcpslgstxlhst', 200000, 0, '1', 0, 1, 12, '1.工艺：原始三通切割→更换新三通下落至标准高度。2.乙供：本子目需要的材料、人工及机械。3.说明：适用于厨房下水立杠下沉或棚面支杠上提；不含水钻打眼。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 厨房铸铁排水立杠三通下落或上提 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房铸铁排水立杠三通下落或上提', 'cfztpslgstxlhst', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房铸铁排水立杠三通下落或上提');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房铸铁排水立杠三通下落或上提' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房铸铁排水立杠三通下落或上提', '', 'cfztpslgstxlhst', 300000, 0, '1', 0, 1, 12, '1.工艺：原始三通切割→更换新三通下落至标准高度。2.乙供：本子目需要的材料、人工及机械。3.说明：适用于厨房下水立杠下沉或棚面支杠上提；不含水钻打眼。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);

-- ======== 厨房排水管道隔音处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房排水管道隔音处理', 'cfpsgdgycl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房排水管道隔音处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房排水管道隔音处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房排水管道隔音处理', '', 'cfpsgdgycl', 120000, 0, '1', 0, 1, 12, '1.工艺：检查排水立杠检修口→清理管道表面→包隔音棉→扎带固定→锡纸包裹缝隙。2.乙供：辅料、人工及机械。3.说明：环形包裹处理，包扎严密无空隙。\n1.计算规则：按项计算。\n2.说明：按排水管根数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 20000);

-- ======== 厨房地面排水管道支杠改造 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房地面排水管道支杠改造', 'cfdmpsgdzggz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房地面排水管道支杠改造');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房地面排水管道支杠改造' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房地面排水管道支杠改造', '', 'cfdmpsgdzggz', 150000, 0, '1', 0, 1, 12, '1.工艺：确定位置→通水测试→管道制作。2.乙供：PVC排水管、辅料、人工及机械。3.说明：厨房原始预留管道接至现有水槽和厨房其他用水部位。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 厨房地面排水管道支杠重新制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房地面排水管道支杠重新制作', 'cfdmpsgdzgzxzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房地面排水管道支杠重新制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房地面排水管道支杠重新制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房地面排水管道支杠重新制作', '', 'cfdmpsgdzgzxzz', 300000, 0, '1', 0, 1, 12, '1.工艺：确定位置→PVC排水管安装→管件连接→通水测试。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于厨房位置变更，独立西厨及独立洗衣间下水制作；不含水钻打孔。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 厨房棚面排水管道支杠改造 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房棚面排水管道支杠改造', 'cfpmpsgdzggz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房棚面排水管道支杠改造');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房棚面排水管道支杠改造' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房棚面排水管道支杠改造', '', 'cfpmpsgdzggz', 300000, 0, '1', 0, 1, 12, '1.工艺：确定位置→原始排水管道切割→PVC排水管安装→管件连接→通水测试。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于厨房棚面支杠走向改造（躲避燃气热水器排烟管）。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 厨房洗菜槽安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房洗菜槽安装', 'cfxccaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房洗菜槽安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房洗菜槽安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房洗菜槽安装', '', 'cfxccaz', 80000, 0, '1', 0, 1, 12, '1.工艺：确定位置→标记孔位→玻璃钻头钻孔水平安装。2.乙供：防霉玻璃胶、人工及机械。3.甲供：洗菜槽、水龙头、角阀、软连接、挂件。4.说明：不含理石开孔；套餐包项目无单项费用退减；与配套卫生间卫浴产品、开关插座同时安装，如需单独安装费用另计（100元/趟）。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 卫生间PVC排风管道制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间PVC排风管道制作', 'wsjpvcpfgdzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间PVC排风管道制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间PVC排风管道制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间PVC排风管道制作', '', 'wsjpvcpfgdzz', 280000, 0, '1', 0, 1, 12, '1.工艺：确定位置→PVC管道安装→管件连接→吊卡固定。2.乙供：PVC排水管及辅料、人工及机械。3.说明：适用于原卫生间无排风管道增加卫生间排风功能，室外部分甲方自理；不含水钻钻孔。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 卫生间排水立杠制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间排水立杠制作', 'wsjpslgzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间排水立杠制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间排水立杠制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间排水立杠制作', '', 'wsjpslgzz', 700000, 0, '1', 0, 1, 12, '1.工艺：PVC排水管安装→管件连接2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于卫生间无下水管道或损坏严重重新制作；不含水钻打眼。\n1.计算规则：按项计算。\n2.说明：按排水管根数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);

-- ======== 卫生间排水管道隔音处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间排水管道隔音处理', 'wsjpsgdgycl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间排水管道隔音处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间排水管道隔音处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间排水管道隔音处理', '', 'wsjpsgdgycl', 220000, 0, '1', 0, 1, 12, '1.工艺：检查排水立杠检修口→清理管道表面→包隔音棉→扎带固定→锡纸包裹缝隙。2.乙供：辅料、人工及机械。3.说明：环形包裹处理，包扎严密无空隙。\n1.计算规则：按项计算。\n2.说明：按排水管根数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 30000);

-- ======== 卫生间地面排水管道支杠改造 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间地面排水管道支杠改造', 'wsjdmpsgdzggz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间地面排水管道支杠改造');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间地面排水管道支杠改造' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间地面排水管道支杠改造', '', 'wsjdmpsgdzggz', 280000, 0, '1', 0, 1, 12, '1.工艺：确定位置→通水测试→卫生间地面管道移位→PVC排水管安装→管件连接。2.乙供:PVC管、辅料、人工及机械。3.说明：适用于坐便移位、洗手盆下水墙排改造及地漏移位。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 卫生间地面排水管道支杠重新制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间地面排水管道支杠重新制作', 'wsjdmpsgdzgzxzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间地面排水管道支杠重新制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间地面排水管道支杠重新制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间地面排水管道支杠重新制作', '', 'wsjdmpsgdzgzxzz', 600000, 0, '1', 0, 1, 12, '1.工艺：确定位置→PVC排水管安装→管件连接→吊卡固定→通水测试。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于卫生间无原始下水管道、损坏严重或无法移位时重新制作及支杠上提；不包含水钻打孔。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);

-- ======== 下沉卫生间排水管道制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间排水管道制作', 'xcwsjpsgdzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间排水管道制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间排水管道制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间排水管道制作', '', 'xcwsjpsgdzz', 500000, 0, '1', 0, 1, 12, '1.工艺：确定位置→PVC管道安装→管件连接→座卡固定→通水测试。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于下沉式卫生间无原始下水管道横杠整体重新制作；如二手房拆除后仅剩一个坐便排水口，则按此项收取。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);

-- ======== 卫生间洁具及五金件安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间洁具及五金件安装', 'wsjjjjwjjaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间洁具及五金件安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间洁具及五金件安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间洁具及五金件安装', '', 'wsjjjjwjjaz', 220000, 0, '1', 0, 1, 12, '1.工艺：确定位置→标记孔位→玻璃钻头钻孔水平安装。2.乙供：防霉玻璃胶、人工及机械。3.甲供：普通座便、手盆、洗面镜、毛巾架、手纸盒、五金挂件等主材及配件辅料。4.说明：不含理石开孔及浴缸安装；套餐包项目无单项费用退减；配套卫生间卫浴产品需整套齐全后一次性安装，如需单独安装费用另计（100元/趟）。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 蹲便排水敷设及砌筑地台 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '蹲便排水敷设及砌筑地台', 'dbpsfsjqzdt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '蹲便排水敷设及砌筑地台');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '蹲便排水敷设及砌筑地台' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '蹲便排水敷设及砌筑地台', '', 'dbpsfsjqzdt', 800000, 0, '1', 0, 1, 12, '1.工艺：确定位置→管件焊接→排水制作→防水处理→实心砖砌筑→回填→瓷砖铺贴→蹲便安装。2.乙供：本子目中需要的基础材料、人工及机械。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 壁挂马桶排水敷设及砌筑 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '壁挂马桶排水敷设及砌筑', 'bgmtpsfsjqz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '壁挂马桶排水敷设及砌筑');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '壁挂马桶排水敷设及砌筑' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '壁挂马桶排水敷设及砌筑', '', 'bgmtpsfsjqz', 1000000, 0, '1', 0, 1, 12, '1.工艺：确定位置→预埋件固定→上下水制作→打压测试→实心砖砌筑。2.乙供：本子目中需要的基础材料、人工及机械。3.甲供：马桶及预埋件、马桶安装。4.说明：如马桶安装处为混凝土墙或墙体不符合安装需求，则预埋件无法入墙。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);

-- ======== 嵌入式浴缸安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '嵌入式浴缸安装', 'qrsygaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '嵌入式浴缸安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '嵌入式浴缸安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '嵌入式浴缸安装', '', 'qrsygaz', 360000, 0, '', 0, 1, 11, '1.工艺：放线定位→开槽→给排水管路敷设；安装浴缸→管道连接→通水测试→密闭打胶。2.乙供：人工及机械。3.甲供：浴缸及辅料配件。4.说明：嵌入式浴缸需要与浴缸砌筑抹灰搭配使用。\n1.计算规则：按套计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '套', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 2000, '个', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 暗藏花洒给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '暗藏花洒给水敷设', 'achsgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '暗藏花洒给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '暗藏花洒给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '暗藏花洒给水敷设', '', 'achsgsfs', 300000, 0, '', 0, 1, 12, '1.工艺：放线定位→开槽→暗藏阀体安装→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.甲供：暗藏阀体及花洒。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 2000, '个', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 暗藏水龙头给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '暗藏水龙头给水敷设', 'acsltgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '暗藏水龙头给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '暗藏水龙头给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '暗藏水龙头给水敷设', '', 'acsltgsfs', 300000, 0, '', 0, 1, 12, '1.工艺：放线定位→开槽→暗藏阀体安装→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.甲供：暗藏阀体及水龙头。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 2000, '个', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 棚面排水管横杠上提 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面排水管横杠上提', 'pmpsghgst', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面排水管横杠上提');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面排水管横杠上提' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面排水管横杠上提', '', 'pmpsghgst', 140000, 0, '', 0, 1, 1, '1.工艺：确定位置→PVC管件安装→管件连接→吊卡固定。2.乙供：PVC排水管、辅料、人工及机械。3.说明：适用于别墅地下室卫生间、厨房以外区域的横杠上提；仅限于改造室内部分，室外部分甲方自理；不含水钻钻孔。\n1.计算规则：按米计算。\n2.说明：按单根横杠延长米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 35000);

-- ======== 棚面排水管道隔音处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面排水管道隔音处理', 'pmpsgdgycl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面排水管道隔音处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面排水管道隔音处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面排水管道隔音处理', '', 'pmpsgdgycl', 40000, 0, '', 0, 1, 1, '1.工艺：检查排水管道→清理管道表面→包隔音棉→扎带固定→锡纸包裹缝隙。2.乙供：辅料、人工及机械。3.说明：适用于地下室卫生间、厨房以外区域的下水管隔音处理；环形包裹处理，包扎严密无空隙。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 5000);

-- ======== 入户给水主杠制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '入户给水主杠制作', 'rhgszgzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '入户给水主杠制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '入户给水主杠制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '入户给水主杠制作', '', 'rhgszgzz', 350000, 0, '', 0, 1, 12, '1.工艺：原有管道拆除→更换PPR给水管→管件连接。2.乙供：PPR管、接头、配件、人工及机械。3.说明：如原始立杠为PVC材质，统一变更为公司标准规定的PPR材质及配件；不包含阀门。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);

-- ======== 入户给水管管径Ф25mm升级为管径Ф32mm | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '入户给水管管径Ф25mm升级为管径Ф32mm', 'rhgsggjФ25mmsjwgjФ32mm', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '入户给水管管径Ф25mm升级为管径Ф32mm');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '入户给水管管径Ф25mm升级为管径Ф32mm' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '入户给水管管径Ф25mm升级为管径Ф32mm', '', 'rhgsggjФ25mmsjwgjФ32mm', 60000, 0, '', 0, 0, 1, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：从入户到室内阀门采用PPR给水管管径Ф32mm制作。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 10000);

-- ======== 全屋热水管管径Ф20mm升级为管径Ф25mm | 规格:一厨一卫 (拆分自:全屋热水管管径Ф20mm升级为管径Ф25mm（一厨一卫）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋热水管管径Ф20mm升级为管径Ф25mm', 'qwrsggjФ20mmsjwgjФ25mm', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋热水管管径Ф20mm升级为管径Ф25mm');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋热水管管径Ф20mm升级为管径Ф25mm' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋热水管管径Ф20mm升级为管径Ф25mm', '一厨一卫', 'qwrsggjФ20mmsjwgjФ25mmycyw', 400000, 0, '', 0, 0, 12, '1.工艺：PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于全屋热水管升级为PPR给水管管径Ф25mm。\n1.计算规则：按项计算。\n2.说明：按卫生间数量收费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一厨一卫');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一厨一卫' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 全屋热水管管径Ф20mm升级为管径Ф25mm | 规格:增加一卫 (拆分自:全屋热水管管径Ф20mm升级为管径Ф25mm（增加一卫）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋热水管管径Ф20mm升级为管径Ф25mm', 'qwrsggjФ20mmsjwgjФ25mm', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋热水管管径Ф20mm升级为管径Ф25mm');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋热水管管径Ф20mm升级为管径Ф25mm' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋热水管管径Ф20mm升级为管径Ф25mm', '增加一卫', 'qwrsggjФ20mmsjwgjФ25mmzjyw', 280000, 0, '', 0, 0, 12, '1.工艺：PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于增加一卫热水管升级为PPR给水管管径Ф25mm。\n1.计算规则：按项计算。\n2.说明：每增加一个卫生间。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '增加一卫');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '增加一卫' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 无厨房单独一卫冷热水路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '无厨房单独一卫冷热水路敷设', 'wcfddywlrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '无厨房单独一卫冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '无厨房单独一卫冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '无厨房单独一卫冷热水路敷设', '', 'wcfddywlrslfs', 2580000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于无厨房施工的项目；包含阀门、壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水、净水、软水各一处。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 240000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 240000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 8000, '个', 8000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 无卫生间单独一厨冷热水路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '无卫生间单独一厨冷热水路敷设', 'wwsjddyclrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '无卫生间单独一厨冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '无卫生间单独一厨冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '无卫生间单独一厨冷热水路敷设', '', 'wwsjddyclrslfs', 1440000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于无卫生间施工的项目；包含阀门、净水、软水各一处。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 210000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 210000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 1000, 90000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 90000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 4000, '个', 4000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 一厨一卫冷热水路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '一厨一卫冷热水路敷设', 'ycywlrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '一厨一卫冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '一厨一卫冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '一厨一卫冷热水路敷设', '', 'ycywlrslfs', 3680000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：原始进户入水管全部更换,室内主管道更换为PPR给水管管径Ф25mm，1处阀门更换；包含阀门、壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水、净水、软水各一处。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 430000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 430000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 1000, 130000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 130000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 10000, '个', 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 增加一卫冷热水路敷设 | 规格:平层 (拆分自:增加一卫冷热水路敷设（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加一卫冷热水路敷设', 'zjywlrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加一卫冷热水路敷设', '平层', 'zjywlrslfspc', 1300000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：原始进户入水管全部更换,室内主管道更换为PPR给水管管径Ф25mm；包含壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水各一处。\n1.计算规则：按项计算。\n2.说明：按卫生间个数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 240000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 240000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 6000, '个', 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 增加一卫冷热水路敷设 | 规格:非平层 (拆分自:增加一卫冷热水路敷设（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加一卫冷热水路敷设', 'zjywlrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加一卫冷热水路敷设', '非平层', 'zjywlrslfsfpc', 2080000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：原始进户入水管全部更换,室内主管道更换为PPR给水管管径Ф25；包含壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水各一处。\n1.计算规则：按项计算。\n2.说明：按卫生间个数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 350000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 350000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 6000, '个', 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 增加一厨冷热水路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加一厨冷热水路敷设', 'zjyclrslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加一厨冷热水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加一厨冷热水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加一厨冷热水路敷设', '', 'zjyclrslfs', 800000, 0, '', 0, 0, 12, '1.工艺：确定位置→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于增加一个厨房的冷热水路敷设。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 2000, '个', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 一厨一卫冷热水路走棚敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '一厨一卫冷热水路走棚敷设', 'ycywlrslzpfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '一厨一卫冷热水路走棚敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '一厨一卫冷热水路走棚敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '一厨一卫冷热水路走棚敷设', '', 'ycywlrslzpfs', 4380000, 0, '', 0, 0, 12, '1.工艺：确定位置→吊卡安装→套棉安装→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：预留PPR给水管管径Ф25mm总阀门；包含阀门、壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水、净水、软水各一处。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 800000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 800000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 10000, '个', 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);

-- ======== 增加一卫冷热水路走棚敷设 | 规格:平层 (拆分自:增加一卫冷热水路走棚敷设（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加一卫冷热水路走棚敷设', 'zjywlrslzpfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路走棚敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路走棚敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加一卫冷热水路走棚敷设', '平层', 'zjywlrslzpfspc', 1500000, 0, '', 0, 0, 12, '1.工艺：确定位置→吊卡安装→套棉安装→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械；包含壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水各一处。\n1.计算规则：按项计算。\n2.说明：按卫生间个数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 6000, '个', 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 增加一卫冷热水路走棚敷设 | 规格:非平层 (拆分自:增加一卫冷热水路走棚敷设（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加一卫冷热水路走棚敷设', 'zjywlrslzpfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路走棚敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加一卫冷热水路走棚敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加一卫冷热水路走棚敷设', '非平层', 'zjywlrslzpfsfpc', 2580000, 0, '', 0, 0, 12, '1.工艺：确定位置→吊卡安装→套棉安装→管件焊接→管路打压测试。2.乙供：PPR给水管、辅料、人工及机械；包含壁挂马桶、暗藏花洒及暗藏水龙头小便池上下水各一处。\n1.计算规则：按项计算。\n2.说明：按卫生间个数收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 6000, '个', 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 独立洗衣间给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '独立洗衣间给水敷设', 'dlxyjgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '独立洗衣间给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '独立洗衣间给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '独立洗衣间给水敷设', '', 'dlxyjgsfs', 500000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于洗衣机上水改造、洗衣间增加洗手盆上水改造。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 3000, '个', 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 独立西厨给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '独立西厨给水敷设', 'dlxcgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '独立西厨给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '独立西厨给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '独立西厨给水敷设', '', 'dlxcgsfs', 500000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于西厨上水改造。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 2000, '个', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);

-- ======== 独立车库给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '独立车库给水敷设', 'dlckgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '独立车库给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '独立车库给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '独立车库给水敷设', '', 'dlckgsfs', 600000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试2.乙供：PPR给水管、辅料、人工及机械。3.说明：适用于车库拖布池及龙头上下水改造及增加车库独立控制阀门。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '内牙', 1652, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1652);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);

-- ======== 温泉水给水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '温泉水给水敷设', 'wqsgsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '温泉水给水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '温泉水给水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '温泉水给水敷设', '', 'wqsgsfs', 600000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试2.乙供：PPR给水管、辅料费、人工及机械。3.说明：适用于温泉水需独立管路敷设及增设独立控制阀门。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);

-- ======== 设备间水路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '设备间水路敷设', 'sbjslfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '设备间水路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '设备间水路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '设备间水路敷设', '', 'sbjslfs', 800000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料费、人工及机械。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);

-- ======== 燃气热水器热水循环敷设 | 规格:一卫 (拆分自:燃气热水器热水循环敷设（一卫）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '燃气热水器热水循环敷设', 'rqrsqrsxhfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '燃气热水器热水循环敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '燃气热水器热水循环敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '燃气热水器热水循环敷设', '一卫', 'rqrsqrsxhfsyw', 500000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：棚面水管或外露部分外套保温棉，支管长度≤300mm不使用U型管件；不含循环泵、单向阀等设备。\n1.计算规则：按项计算。\n2.说明：按卫生间数量收费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一卫');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一卫' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 燃气热水器热水循环走棚敷设 | 规格:一卫 (拆分自:燃气热水器热水循环走棚敷设（一卫）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '燃气热水器热水循环走棚敷设', 'rqrsqrsxhzpfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '燃气热水器热水循环走棚敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '燃气热水器热水循环走棚敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '燃气热水器热水循环走棚敷设', '一卫', 'rqrsqrsxhzpfsyw', 900000, 0, '', 0, 0, 12, '1.工艺：确定位置→吊卡安装→套棉安装→管件焊接→管路打压测试。2.乙供：PPR给水管、管件、人工及机械。3.说明：棚面水管或外露部分外套保温棉，支管长度≤300mm不使用U型管件；不含循环泵、单向阀等设备。\n1.计算规则：按项计算。\n2.说明：按卫生间数量收费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一卫');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一卫' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);

-- ======== 污水提升泵排水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '污水提升泵排水敷设', 'wstsbpsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '污水提升泵排水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '污水提升泵排水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '污水提升泵排水敷设', '', 'wstsbpsfs', 700000, 0, '', 0, 0, 5, '1.工艺：确定位置→PVC管道安装→管件连接→吊卡固定。2.乙供：PVC排水管、辅料、人工及机械。3.甲供：设备及安装。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '个', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 200000);

-- ======== 污水提升泵站排水敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '污水提升泵站排水敷设', 'wstsbzpsfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '污水提升泵站排水敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '污水提升泵站排水敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '污水提升泵站排水敷设', '', 'wstsbzpsfs', 2000000, 0, '', 0, 0, 12, '1.工艺：确定位置→PVC管道安装→管件连接→吊卡固定。2.乙供：PVC排水管、辅料、人工及机械。3.甲供：设备及安装。4.说明：包含室外排气管制作，不含水钻钻孔。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 300000);

-- ======== 室外给水点位 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '室外给水点位', 'swgsdw', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '室外给水点位');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '室外给水点位' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '室外给水点位', '', 'swgsdw', 300000, 0, '', 0, 0, 12, '1.工艺：确定位置→PPR管道安装→管件连接→打压测试。2.乙供：PPR给水管、辅料、人工及机械。3.说明：如有两处及以上给水点位提供一处独立阀门控制；不含水钻钻孔。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '阀门', 1649, '个', 1000, '个', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1649);

-- ======== 弱电全屋布线 | 规格:＞80平 (拆分自:弱电全屋布线（＞80平）) ========
SET @qcid = 310; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弱电全屋布线', '＞80平', 'rdqwbx＞80p', 9000, 0, '', 4, 0, 47, '1.工艺：定位→PVC线管加工→线盒固定→管路敷设→穿弱电线→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本定额仅限于弱电箱到各功能空间弱电点位（网络、光纤、电话、有线电视）管路敷设及穿线；（2）含一个弱电箱（规格300mm*400mm）更换，（3）弱电箱移位会导致入户光纤、网络、电话、有线电视线日后无法更换或升级；（4）不含入户光纤、网络、电话、有线电视线更换；（5）监控、智能家居系统等布线，费用另计。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平' LIMIT 1);

-- ======== 弱电全屋布线 | 规格:≤80平 (拆分自:弱电全屋布线（≤80平）) ========
SET @qcid = 310; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弱电全屋布线', '≤80平', 'rdqwbx≤80p', 720000, 0, '', 4, 0, 12, '1.工艺：定位→PVC线管加工→线盒固定→管路敷设→穿弱电线→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本定额仅限于弱电箱到各功能空间弱电点位（网络、光纤、电话、有线电视）重新布管穿线，（2）含一个弱电箱（规格300mm*400mm）更换，（3）弱电箱移位会导致入户光纤、网络、电话、有线电视线日后无法更换或升级；（4）不含入户光纤、网络、电话、有线电视线更换；（5）监控、智能家居系统等布线，费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平' LIMIT 1);

-- ======== 弱电全屋走棚布线 | 规格:＞80平 (拆分自:弱电全屋走棚布线（＞80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弱电全屋走棚布线', 'rdqwzpbx', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弱电全屋走棚布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弱电全屋走棚布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弱电全屋走棚布线', '＞80平', 'rdqwzpbx＞80p', 19000, 0, '', 4, 0, 47, '1.工艺：定位→线盒固定→棚顶排卡固定→管路敷设→穿弱电线→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本弱电工程改造仅限于弱电箱到墙面弱电点位（网络、光纤、电话、有线电视）重新布管穿线，其他弱电如监控、智能家居系统等布线。费用另计；（2）含一个弱电箱（规格300mm*400mm）更换，（3）弱电箱移位会导致入户光纤、网络、电话、有线电视线日后无法更换或升级；（4）不含入户光纤、网络、电话、有线电视线更换；（5）不包含水钻打孔费用。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平' LIMIT 1);

-- ======== 弱电全屋走棚布线 | 规格:≤80平 (拆分自:弱电全屋走棚布线（≤80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弱电全屋走棚布线', 'rdqwzpbx', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弱电全屋走棚布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弱电全屋走棚布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弱电全屋走棚布线', '≤80平', 'rdqwzpbx≤80p', 1520000, 0, '', 4, 0, 12, '1.工艺：定位→线盒固定→棚顶排卡固定→管路敷设→穿弱电线→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本弱电工程改造仅限于弱电箱到墙面弱电点位（网络、光纤、电话、有线电视）重新布管穿线，其他弱电如监控、智能家居系统等布线。费用另计；（2）含一个弱电箱（规格300mm*400mm）更换，（3）弱电箱移位会导致入户光纤、网络、电话、有线电视线日后无法更换或升级；（4）不含入户光纤、网络、电话、有线电视线更换；（5）不包含水钻打孔费用。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平' LIMIT 1);

-- ======== 增设弱电箱 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增设弱电箱', 'zsrdx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增设弱电箱');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增设弱电箱' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增设弱电箱', '', 'zsrdx', 500000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→固定多媒体信息箱→管道敷设→穿线→线路测试。2.乙供：子目中包含的材料、人工及机械。3.说明：（1）包含换箱、移位、增设（箱体规格300mm*400mm*100mm），箱内预留220V电源；（2）入户光纤、网络、有线电视、电话信号线、通讯组件及支架由甲方负责。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 100000);

-- ======== 智能开关加零线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '智能开关加零线', 'znkgjlx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '智能开关加零线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '智能开关加零线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '智能开关加零线', '', 'znkgjlx', 10000, 0, '', 0, 0, 47, '1.乙供：子目中包含的材料、人工及机械。2.说明：仅限照明开关线盒内增加一根零线。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '平米', 1000, 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 1000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 350, '米', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 有线网络智能家居电路改造 | 规格:平层 (拆分自:有线网络智能家居电路改造（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '有线网络智能家居电路改造', 'yxwlznjjdlgz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '有线网络智能家居电路改造');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '有线网络智能家居电路改造' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '有线网络智能家居电路改造', '平层', 'yxwlznjjdlgzpc', 40000, 0, '', 0, 0, 47, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：子目中包含的材料、人工及机械。3.说明：将所有照明控制回路、智能设备控制回路布置到智能控制箱，通过智能模块的集成，实现家庭内各个设备智能化控制。（不含模块设备及控制箱、特殊底盒、设备安装及调试）\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);

-- ======== 有线网络智能家居电路改造 | 规格:非平层 (拆分自:有线网络智能家居电路改造（非平层)) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '有线网络智能家居电路改造', 'yxwlznjjdlgz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '有线网络智能家居电路改造');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '有线网络智能家居电路改造' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '有线网络智能家居电路改造', '非平层', 'yxwlznjjdlgzfpc', 55000, 0, '', 0, 0, 47, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：子目中包含的材料、人工及机械。3.说明：将所有照明控制回路、智能设备控制回路布置到智能控制箱，通过智能模块的集成，实现家庭内各个设备智能化控制。（不含模块设备及控制箱、特殊底盒、设备安装及调试）\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);

-- ======== 智能设备点位布线 | 规格:含网线 (拆分自:智能设备点位布线（含网线）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '智能设备点位布线', 'znsbdwbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '智能设备点位布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '智能设备点位布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '智能设备点位布线', '含网线', 'znsbdwbxhwx', 300000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：子目中包含的材料、人工及机械。3.说明：平层户型基础水电项目外增加智能设备预留线路施工；仅限于监控、门禁、WiFi覆盖（吸顶）等单体设备的敷线施工；包含网线、强电BV线及辅料费，其余线材由甲方提供；按照预留点位数量计费，不含设备安装调试。\n1.计算规则：按点位计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '含网线');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '含网线' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 40000);

-- ======== 智能设备点位布线 | 规格:不含专用线缆 (拆分自:智能设备点位布线（不含专用线缆）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '智能设备点位布线', 'znsbdwbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '智能设备点位布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '智能设备点位布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '智能设备点位布线', '不含专用线缆', 'znsbdwbxbhzyxl', 280000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：子目中包含的材料、人工及机械。3.说明：平层户型基础水电项目外增加智能设备预留线路施工；仅限于手机信号放大、背景音乐等单体设备的敷线施工不含网线；仅含辅料及人工费，线材由甲方提供；按照预留点位数量计费，不含设备安装调试。\n1.计算规则：按点位计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '不含专用线缆');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '不含专用线缆' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 40000);

-- ======== 强电改造 | 规格:平层 ＞80平 (拆分自:强电改造（平层 ＞80平）) ========
SET @qcid = 315; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '强电改造', '平层 ＞80平', 'qdgzpc ＞80p', 57000, 0, '', 0, 0, 47, '1.工艺：原始线路通断测试→定位→PVC线管加工→线盒固定→管路敷设→穿ZR-BV电线→并线焊锡→绝缘保护→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本电路工程改造是基于房屋有原始线路基础上进行断点改造施工，如房屋无原始线路或原始线路不符合改造标准，需增加全屋换线项目；（2）空调、电热水器、厨房插座使用4平方BV线(不含原始线路),普通插座使用2.5平方BV线，磁吸灯、线性灯、筒灯灯吊棚内灯线可使用1.0护套线（与BV线不同品牌）；（3）卧室、客厅主灯布置双控线路,不含走廊等其它位置双控,如其它位置需双控,费用另计；（4）不包括入户配电箱移位、速热热水器、中央空调系统、智能家居系统、新风系统、室外电源，费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层 ＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层 ＞80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '平米', 1000, 14500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 14500);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 12, '平米', 1000, 4500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 12 AND salary = 4500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 4600, '米', 4600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 1800, '米', 1800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 强电改造 | 规格:平层 ≤80平 (拆分自:强电改造（平层 ≤80平）) ========
SET @qcid = 315; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '强电改造', '平层 ≤80平', 'qdgzpc ≤80p', 4560000, 0, '', 0, 0, 12, '1.工艺：原始线路通断测试→定位→PVC线管加工→线盒固定→管路敷设→穿ZR-BV电线→并线焊锡→绝缘保护→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本电路工程改造是基于房屋有原始线路基础上进行断点改造施工，如房屋无原始线路或原始线路不符合改造标准，需增加全屋换线项目；（2）空调、电热水器、厨房插座使用4平方BV线(不含原始线路),普通插座使用2.5平方BV线，磁吸灯、线性灯、筒灯灯吊棚内灯线可使用1.0护套线（与BV线不同品牌）；（3）卧室、客厅主灯布置双控线路,不含走廊等其它位置双控,如其它位置需双控,费用另计；（4）不包括入户配电箱移位、速热热水器、中央空调系统、智能家居系统、新风系统、室外电源，费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层 ≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层 ≤80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 1160000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 1160000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 12, '项', 1000, 360000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 12 AND salary = 360000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 368000, '米', 368000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 150000, '米', 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 强电改造 | 规格:非平层 ＞80平 (拆分自:强电改造（非平层 ＞80平）) ========
SET @qcid = 315; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '强电改造', '非平层 ＞80平', 'qdgzfpc ＞80p', 65000, 0, '', 0, 0, 47, '1.工艺：原始线路通断测试→定位→PVC线管加工→线盒固定→管路敷设→穿ZR-BV电线→并线焊锡→绝缘保护→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本电路工程改造是基于房屋有原始线路基础上进行断点改造施工，如房屋无原始线路或原始线路不符合改造标准，需增加全屋换线项目；（2）空调、电热水器、厨房插座使用4平方BV线(不含原始线路),普通插座使用2.5平方BV线，磁吸灯、线性灯、筒灯灯吊棚内灯线可使用1.0护套线（与BV线不同品牌）；（3）卧室、客厅、楼梯主灯布置双控线路,不含走廊等其它位置双控,如其它位置需双控,费用另计；（4）不包括入户配电箱移位、速热热水器、中央空调系统、智能家居系统、新风系统、室外电源、楼梯踏步灯，费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层 ＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层 ＞80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '平米', 1000, 17000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 17000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 12, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 12 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 4800, '米', 4800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 1800, '米', 1800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 强电改造 | 规格:非平层 ≤80平 (拆分自:强电改造（非平层 ≤80平）) ========
SET @qcid = 315; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '强电改造', '非平层 ≤80平', 'qdgzfpc ≤80p', 5200000, 0, '', 0, 0, 12, '1.工艺：原始线路通断测试→定位→PVC线管加工→线盒固定→管路敷设→穿ZR-BV电线→并线焊锡→绝缘保护→线路检测。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）本电路工程改造是基于房屋有原始线路基础上进行断点改造施工，如房屋无原始线路或原始线路不符合改造标准，需增加全屋换线项目；（2）空调、电热水器、厨房插座使用4平方BV线(不含原始线路),普通插座使用2.5平方BV线，磁吸灯、线性灯、筒灯灯吊棚内灯线可使用1.0护套线（与BV线不同品牌）；（3）卧室、客厅、楼梯主灯布置双控线路,不含走廊等其它位置双控,如其它位置需双控,费用另计；（4）不包括入户配电箱移位、速热热水器、中央空调系统、智能家居系统、新风系统、室外电源、楼梯踏步灯，费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层 ≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层 ≤80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 1360000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 1360000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 12, '项', 1000, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 12 AND salary = 400000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 368000, '米', 368000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 150000, '米', 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增加原始布线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加原始布线', 'zjysbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加原始布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加原始布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加原始布线', '', 'zjysbx', 35000, 0, '', 0, 0, 47, '1.工艺：原始线路拆除→原始线管或新做线管穿线。2.乙供：本子目中需要的基础材料、人工及机械。3.说明：（1）原始布线线径标准，厨房、卫生间、空调使用4平方BV线，普通插座及照明使用2.5平方BV线；（2）不包括入户配电箱、入户主线。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '平米', 1000, 4000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 4000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 3000, '米', 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 1500, '米', 1500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增加强电走棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加强电走棚', 'zjqdzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加强电走棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加强电走棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加强电走棚', '', 'zjqdzp', 20000, 0, '', 0, 0, 47, '1.说明：新做电路由地面敷设调整为棚面敷设。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 入户强电箱移位 | 规格:长度≤4000mm (拆分自:入户强电箱移位（长度≤4000mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '入户强电箱移位', 'rhqdxyw', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '入户强电箱移位');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '入户强电箱移位' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '入户强电箱移位', '长度≤4000mm', 'rhqdxywzd≤4000mm', 980000, 0, '', 0, 0, 12, '1.工艺：放线定位→开槽→电箱固定→管道敷设→穿ZR-BV电线→焊锡→绝缘保护→空开连接。2.乙供：PVC穿线管、ZR-BV电线、辅料、人工及机械。3.说明：进户主线长度不满足移位距离时，在原配电箱位置压接，改动范围超过4米费用另计，套用增加入户配电箱移位定额；不含箱体,空气开关组件。\n1.计算规则：按项计算。\n2.说明：380V配电箱按两项计算；按主线长度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '长度≤4000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '长度≤4000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 25000, '米', 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 75000, '米', 75000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增加入户强电箱移位 | 规格:每增加1000mm (拆分自:增加入户强电箱移位（每增加1000mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加入户强电箱移位', 'zjrhqdxyw', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加入户强电箱移位');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加入户强电箱移位' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加入户强电箱移位', '每增加1000mm', 'zjrhqdxywmzj1000mm', 220000, 0, '', 0, 0, 1, '1.工艺：配电箱移位距离超过4米的材料及人工费。2.乙供：PVC穿线管、ZR-BV电线、辅料、人工及机械。3.说明：每增加一米，依次累计增加此项，每米增加220元；不含箱体,空气开关组件。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加1000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加1000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 2500, '米', 2500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 26000, '米', 26000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增设强电箱 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增设强电箱', 'zsqdx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增设强电箱');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增设强电箱' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增设强电箱', '', 'zsqdx', 580000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→电箱固定→管道敷设→穿线→焊锡→绝缘保护→空开连接。2.乙供：子目中包含的材料、人工及机械。3.说明：适用于全屋换线增设配电箱，不包含原始入户线或进入该电箱的主线；不含箱体,空气开关组件。\n1.计算规则：按项计算。\n2.说明：380V配电箱按两项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 200000);

-- ======== 空开配线及安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '空开配线及安装', 'kkpxjaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '空开配线及安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '空开配线及安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '空开配线及安装', '', 'kkpxjaz', 200000, 0, '', 0, 0, 12, '1.工艺：空开安装→跳线制作→主空开铜鼻固定。2.乙供：辅料、人工及机械。3.甲供：空开、漏电保护器、过欠压保护器等。4.说明：与配电箱搭配使用；跳线线径与回路线径一致。\n1.计算规则：按项计算。\n2.说明：380V配电箱按两项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 2000, '米', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 5000, '米', 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 全屋插座升级为4平方BV线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋插座升级为4平方BV线', 'qwczsjw4pfbvx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋插座升级为4平方BV线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋插座升级为4平方BV线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋插座升级为4平方BV线', '', 'qwczsjw4pfbvx', 10000, 0, '', 0, 0, 47, '1.工艺：全屋插座由2.5平方BV线升级为4平方BV线的材料及人工费。2.乙供：4平方BV线、辅料、人工及机械。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 2500, '米', 2500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 厨卫升级为4平方BV线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨卫升级为4平方BV线', 'cwsjw4pfbvx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨卫升级为4平方BV线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨卫升级为4平方BV线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨卫升级为4平方BV线', '', 'cwsjw4pfbvx', 1000000, 0, '', 0, 0, 12, '1.乙供：4平方BV线、辅材、人工及机械.2.说明：适用于厨房、卫生间原始主线更换。\n1.计算规则：按项计算。\n2.说明：按厨房和卫生间总数量计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 18000, '米', 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增加4平方BV线敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加4平方BV线敷设', 'zj4pfbvxfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加4平方BV线敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加4平方BV线敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加4平方BV线敷设', '', 'zj4pfbvxfs', 50000, 0, '', 0, 0, 1, '1.乙供：4平方BV线、辅材、人工及机械。2.说明：适用于新风等设备布线。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 0, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '4平方线', 1646, '米', 3150, '米', 3150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1646);

-- ======== 增加6平方BV线敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加6平方BV线敷设', 'zj6pfbvxfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加6平方BV线敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加6平方BV线敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加6平方BV线敷设', '', 'zj6pfbvxfs', 70000, 0, '', 0, 0, 1, '1.乙供：6平方BV线、辅材、人工及机械。2.说明：适用于速热电热水器、老房改造入户线。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 0, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);

-- ======== 增加10平方BV线敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加10平方BV线敷设', 'zj10pfbvxfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加10平方BV线敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加10平方BV线敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加10平方BV线敷设', '', 'zj10pfbvxfs', 80000, 0, '', 0, 0, 1, '1.乙供：10平方BV线、辅材、人工及机械。2.说明：适用于新、老房改造入户线。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 0, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 100000);

-- ======== 增加双控开关电路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加双控开关电路敷设', 'zjskkgdlfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加双控开关电路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加双控开关电路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加双控开关电路敷设', '', 'zjskkgdlfs', 300000, 0, '', 0, 0, 5, '1.工艺：卧室、客厅、楼梯主灯布置双控线路以外区域增加双控开关电路敷设的材料及人工费。2.乙供：2.5平方BV线、辅料、人工及机械。3.说明：不含开关。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 16000, '米', 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 中央空调分机2.5平方BV线布线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '中央空调分机2.5平方BV线布线', 'zykdfj2.5pfbvxbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '中央空调分机2.5平方BV线布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '中央空调分机2.5平方BV线布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '中央空调分机2.5平方BV线布线', '', 'zykdfj2.5pfbvxbx', 200000, 0, '', 0, 0, 12, '1.工艺：放线定位→开槽→管线敷设→穿2.5平方BV线→绝缘保护→线路测试。2.乙供：2.5平方BV线、辅材、人工及机械。3.说明：单个空调分机为一项；所有分机在同一回路；不含新增空调回路空气开关。\n1.计算规则：按项计算。\n2.说明：按空调分机数量收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 20000, '米', 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 中央空调外机6平方电缆布线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '中央空调外机6平方电缆布线', 'zykdwj6pfdlbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '中央空调外机6平方电缆布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '中央空调外机6平方电缆布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '中央空调外机6平方电缆布线', '', 'zykdwj6pfdlbx', 800000, 0, '1', 0, 0, 12, '1.工艺：放线定位→开槽→管线敷设。2.乙供：3芯6平方电缆线（与BV线不同品牌）、辅料、人工及机械。3.说明：独立回路控制；不含新增空调回路空气开关；限长度≤20米；超出20米费用另计，套用增加中央空调外机6平方电缆布线定额。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 80000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '3芯6平方电缆', 1653, '米', 18000, '米', 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1653);

-- ======== 增加中央空调外机6平方电缆布线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加中央空调外机6平方电缆布线', 'zjzykdwj6pfdlbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加中央空调外机6平方电缆布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加中央空调外机6平方电缆布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加中央空调外机6平方电缆布线', '', 'zjzykdwj6pfdlbx', 40000, 0, '', 0, 0, 1, '1.乙供：3芯6平方电缆线（与BV线不同品牌）、辅料、人工及机械。3.说明：独立回路控制；不含新增空调回路空气开关；每增加一米，依次累计增加此项，40元/米。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '3芯6平方电缆', 1653, '米', 1000, '米', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1653);

-- ======== 楼梯踏步感应灯光电路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '楼梯踏步感应灯光电路敷设', 'lttbgydgdlfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '楼梯踏步感应灯光电路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '楼梯踏步感应灯光电路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '楼梯踏步感应灯光电路敷设', '', 'lttbgydgdlfs', 65000, 0, '', 0, 0, 10, '1.工艺：确定位置→开槽→管道敷设→穿线→灯带安装。2.乙供：1.0平行线布线（非BV线品牌）、辅料、人工及机械。3.说明：不含智能控制设备、灯带及调试。\n1.计算规则：按踏计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '踏', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 20000);

-- ======== 灯具及开关插座安装 | 规格:(空) ========
SET @qcid = 318; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '灯具及开关插座安装', '', 'djjkgczaz', 6000, 0, '', 0, 0, 47, '1.工艺：全屋灯具及开关插座安装及运行检查。2.乙供：辅料、人工及机械。3.甲供：灯具、开关、插座及配件。4.说明：不含智能开关安装及调试、水晶灯、欧式吊灯等高档灯具安装。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 灯具及开关插座安装 | 规格:≤80平 (拆分自:灯具及开关插座安装（≤80平）) ========
SET @qcid = 318; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '灯具及开关插座安装', '≤80平', 'djjkgczaz≤80p', 480000, 0, '1', 0, 0, 12, '1.工艺：全屋灯具及开关插座安装及运行检查。2.乙供：辅料、人工及机械。3.甲供：灯具、开关、插座及配件。4.说明：不含智能开关安装及调试、水晶灯、欧式吊灯等高档灯具安装。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平' LIMIT 1);

-- ======== 电视背景墙预埋穿线套管 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '电视背景墙预埋穿线套管', 'dsbjqymcxtg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '电视背景墙预埋穿线套管');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '电视背景墙预埋穿线套管' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '电视背景墙预埋穿线套管', '', 'dsbjqymcxtg', 40000, 0, '1', 0, 1, 12, '1.工艺：切割开槽→PVC管安装→石膏固定。2.乙供：子目中包含的材料、人工及机械。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 独立车库电路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '独立车库电路敷设', 'dlckdlfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '独立车库电路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '独立车库电路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '独立车库电路敷设', '', 'dlckdlfs', 900000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：2.5平方BV线、辅料、人工及机械。3.说明：包含2个插座、1个照明回路（2个灯位）、卷帘门电源；不包含充电桩电源敷设。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 50000, '米', 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 阳光房电路敷设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳光房电路敷设', 'ygfdlfs', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳光房电路敷设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳光房电路敷设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳光房电路敷设', '', 'ygfdlfs', 900000, 0, '', 0, 0, 12, '1.工艺：确定位置→开槽→布管穿线→线路检测。2.乙供：2.5平方BV线、辅料、人工及机械。3.说明：包含2个插座、1个照明回路（2个灯位）、电动天窗电源。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 200000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 50000, '米', 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 室外电源点位 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '室外电源点位', 'swdydw', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '室外电源点位');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '室外电源点位' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '室外电源点位', '', 'swdydw', 300000, 0, '', 0, 0, 12, '1.工艺：确定位置→布管穿线→线路检测。2.乙供：4平方BV线、辅料、人工及机械。3.说明：仅限于外墙墙面预留插座（4平方BV线）或照明（2.5平方BV线），单独回路控制；此项目仅限于单独插座或照明，如需插座和照明同时预留，则依次累计增加此项。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '2.5平方线', 1645, '米', 30000, '米', 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1645);

-- ======== 全屋AP光纤布线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '全屋AP光纤布线', 'qwapgxbx', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '全屋AP光纤布线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '全屋AP光纤布线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '全屋AP光纤布线', '', 'qwapgxbx', 10000, 0, '', 4, 0, 47, '1.工艺：确定位置→开槽→管道敷设→穿线→线路测试。2.乙供：子目中包含的材料、人工及机械。3.说明：不含设备安装及调试。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 卫生间等电位联结 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间等电位联结', 'wsjddwlj', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间等电位联结');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间等电位联结' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间等电位联结', '', 'wsjddwlj', 800000, 0, '', 4, 0, 5, '1.工艺：管道敷设→穿线→内牙接线。2.乙供：子目中包含的材料、人工及机械。3.说明：接到淋浴花洒内牙弯头上。\n1.计算规则：按个计算。\n2.说明：按卫生间数量收费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 卫生间地热回填层铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间地热回填层铲除', 'wsjdrhtccc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间地热回填层铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间地热回填层铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间地热回填层铲除', '', 'wsjdrhtccc', 70000, 0, '面积', 0, 1, 47, '1.工艺：人工保护性拆除卫生间地面地热回填层并装袋。2.乙供：垃圾袋、人工及机械。3.说明：原始地热不更换情况下收取此项费用，并保留卫生间地热管；垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 60000);

-- ======== 下沉卫生间地面回填层铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间地面回填层铲除', 'xcwsjdmhtccc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填层铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填层铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间地面回填层铲除', '', 'xcwsjdmhtccc', 100000, 0, '面积', 0, 1, 47, '1.工艺：人工保护性拆除卫生间地面地热回填层并装袋。2.乙供：垃圾袋、人工及机械。3.说明：卫生间地热管保留；垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 60000);

-- ======== 卫生间地面回填 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间地面回填', 'wsjdmht', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间地面回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间地面回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间地面回填', '', 'wsjdmht', 45000, 0, '面积', 0, 1, 47, '1.工艺：人工清理基层→地面预湿→水泥砂浆搅拌→地面找平→边角圆弧处理→门口拦水坝制作。2.乙供：沙子、水泥、人工及机械。3.说明： 卫生间必做项，不区分是否重新做地热。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 下沉卫生间地面回填 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间地面回填', 'xcwsjdmht', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间地面回填', '', 'xcwsjdmht', 180000, 0, '面积', 0, 1, 47, '1.工艺：沉箱内下水管道保护砌筑→回填陶粒或河石→钢筋绑扎→地面混凝土浇筑并回填→养护。2.乙供：沙子、水泥、陶粒/河石、钢筋、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 75000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 75000);

-- ======== 地面防水涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面防水涂刷', 'dmfsts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面防水涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面防水涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面防水涂刷', '', 'dmfsts', 150000, 0, '面积', 0, 1, 47, '1.工艺：边角及排水管口加强层处理→坐便口高分子防水加强处理→防水材料搅拌→刚性防水材料涂刷一遍→柔性防水材料涂刷二遍→闭水试验。 2.乙供：水泥、沙子、刚性防水剂、柔性防水剂、高分子防水、人工及机械。3.说明：墙（含门洞口两侧）地面交接涂刷高度不得低于地面以上300mm。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 55000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 55000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '刚性防水剂', 1642, '瓶', 600, '瓶', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1642);

-- ======== 下沉卫生间地面防水涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间地面防水涂刷', 'xcwsjdmfsts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间地面防水涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间地面防水涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间地面防水涂刷', '', 'xcwsjdmfsts', 280000, 0, '面积', 0, 1, 47, '1.工艺：沉箱防水底涂涂刷一遍→沉箱柔性防水材料涂刷二遍→闭水试验→边角及排水管口加强层处理→坐便口高分子防水加强处理→防水材料搅拌→刚性防水材料涂刷一遍→柔性防水材料涂刷二遍→闭水试验。 2.乙供：水泥、沙子、刚性防水剂、柔性防水剂、高分子防水、人工及机械。 3.说明：墙（含门洞口两侧）地面交接涂刷高度不得低于地面以上300mm。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '刚性防水剂', 1642, '瓶', 750, '瓶', 750, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1642);

-- ======== 嵌入式浴缸砌筑抹灰 | 规格:方形 (拆分自:嵌入式浴缸砌筑抹灰（方形）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '嵌入式浴缸砌筑抹灰', 'qrsygqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '嵌入式浴缸砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '嵌入式浴缸砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '嵌入式浴缸砌筑抹灰', '方形', 'qrsygqzmhfx', 850000, 0, '1', 0, 1, 12, '1.工艺：地面防水检查→放线定位→基层处理→水泥砂浆搅拌→墙体砌筑（预留检修口）→抹灰→养护。2.乙供：沙子、水泥、人工费及机械。3.说明：不包含浴缸安装费，浴缸下方需增加地漏，地漏甲供。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '方形');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '方形' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 400000);

-- ======== 嵌入式浴缸砌筑抹灰 | 规格:异形 (拆分自:嵌入式浴缸砌筑抹灰（异形）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '嵌入式浴缸砌筑抹灰', 'qrsygqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '嵌入式浴缸砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '嵌入式浴缸砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '嵌入式浴缸砌筑抹灰', '异形', 'qrsygqzmhyx', 1700000, 0, '1', 0, 1, 12, '1.工艺：地面防水检查→放线定位→基层处理→水泥砂浆搅拌→墙体砌筑（预留检修口）→抹灰→养护。2.乙供：沙子、水泥、人工费及机械。3.说明：不包含浴缸安装费，浴缸下方需增加地漏，地漏甲供。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '异形');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '异形' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 500000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 500000);

-- ======== 淋浴区基石安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '淋浴区基石安装', 'lyqjsaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '淋浴区基石安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '淋浴区基石安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '淋浴区基石安装', '', 'lyqjsaz', 100000, 0, '1', 0, 1, 12, '1.工艺：确认基石规格→定位放线→基石试铺→涂抹粘结材料→安装调平基石→铺设周边地砖→清洁养护。2.乙供：人工及机械。3.甲供：成品浴屏基石。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 淋浴区地面瓷砖局部下沉 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '淋浴区地面瓷砖局部下沉', 'lyqdmczjbxc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '淋浴区地面瓷砖局部下沉');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '淋浴区地面瓷砖局部下沉' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '淋浴区地面瓷砖局部下沉', '', 'lyqdmczjbxc', 240000, 0, '1', 0, 1, 12, '1.工艺：淋浴区内定位找坡→淋浴区内瓷砖铺设→下沉区域侧砖45度倒角处理→粘贴养护。2.乙供：人工及机械。3.说明：淋浴区地面低于卫生间瓷砖地面10-30mm，无传统挡水条，视觉平整且排水高效。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);

-- ======== 淋浴区地面理石造型安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '淋浴区地面理石造型安装', 'lyqdmlszxaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '淋浴区地面理石造型安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '淋浴区地面理石造型安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '淋浴区地面理石造型安装', '', 'lyqdmlszxaz', 150000, 0, '1', 0, 1, 12, '1.工艺：人工地面清理→标高定位及灰饼制作→水泥砂浆搅拌→砂浆找平→安装理石。2.乙供：人工及机械3.说明：淋浴区脚踏成品理石含四边导水槽（甲供）铺贴安装；施工部位地砖铺贴面积正常计算。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 150000);

-- ======== 极简玻璃隔断型材安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '极简玻璃隔断型材安装', 'jjblgdxcaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '极简玻璃隔断型材安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '极简玻璃隔断型材安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '极简玻璃隔断型材安装', '', 'jjblgdxcaz', 300000, 0, '1', 0, 1, 12, '1.工艺：型材嵌入墙地面瓷砖→制作假梁并安装棚顶型材→下沉区域侧砖45度倒角处理。2.乙供：本子目中需要的基础材料、人工及机械。3.甲供：型材、玻璃隔断。4.说明：包含淋浴区地面下沉、隔断上方假梁制作及型材预埋。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);

-- ======== 浴池防水处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '浴池防水处理', 'ycfscl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '浴池防水处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '浴池防水处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '浴池防水处理', '', 'ycfscl', 278000, 0, '', 0, 1, 47, '1.工艺：边角及排水管口加强层处理→防水材料搅拌→刚性防水材料涂刷一遍→柔性防水材料涂刷二遍→闭水试验。 2.乙供：水泥、沙子、刚性防水剂、柔性防水剂、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 55000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 55000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '刚性防水剂', 1642, '瓶', 750, '瓶', 750, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1642);

-- ======== 浴池砌筑抹灰 | 规格:方形 (拆分自:浴池砌筑抹灰（方形）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '浴池砌筑抹灰', 'ycqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '浴池砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '浴池砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '浴池砌筑抹灰', '方形', 'ycqzmhfx', 340000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：红砖、沙子、水泥、人工及机械。3.说明：已包含墙体抹灰找平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '方形');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '方形' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 125000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 125000);

-- ======== 浴池砌筑抹灰 | 规格:异形 (拆分自:浴池砌筑抹灰（异形）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '浴池砌筑抹灰', 'ycqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '浴池砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '浴池砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '浴池砌筑抹灰', '异形', 'ycqzmhyx', 380000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：红砖、沙子、水泥、人工及机械。3.说明：已包含墙体抹灰找平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '异形');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '异形' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 155000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 155000);

-- ======== 阳台地面回填层铲除 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台地面回填层铲除', 'ytdmhtccc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台地面回填层铲除');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台地面回填层铲除' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台地面回填层铲除', '', 'ytdmhtccc', 70000, 0, '面积', 0, 1, 47, '1.工艺：人工拆除阳台地面回填层并装袋。2.乙供：垃圾袋、人工及机械。3.说明：垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 20000);

-- ======== 阳台地面水泥砂浆回填找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台地面水泥砂浆回填找平', 'ytdmsnsjhtzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台地面水泥砂浆回填找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台地面水泥砂浆回填找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台地面水泥砂浆回填找平', '', 'ytdmsnsjhtzp', 80000, 0, '面积', 0, 1, 47, '1.工艺：人工地面清理→地面回填→水泥砂浆搅拌→地面找平→表面收平→养护。 2.乙供：沙子、水泥、人工及机械。 3.说明：回填高度与室内原始地热找平层高度一致。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 地面水泥砂浆找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面水泥砂浆找平', 'dmsnsjzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面水泥砂浆找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面水泥砂浆找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面水泥砂浆找平', '', 'dmsnsjzp', 45000, 0, '面积', 0, 1, 47, '1.工艺：人工地面清理→标高定位及灰饼制作→水泥砂浆搅拌→地面找平→表面收平→养护。 2.乙供：沙子、水泥、人工及机械。 3.说明：适用于室内及阳台铺设地板基层处理；不包含原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平，铲除费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 9, '平米', 1000, 13000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 9 AND salary = 13000);

-- ======== 地台砌筑抹灰 | 规格:高度≤60mm (拆分自:地台砌筑抹灰（高度≤60mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地台砌筑抹灰', 'dtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地台砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地台砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地台砌筑抹灰', '高度≤60mm', 'dtqzmhgd≤60mm', 240000, 0, '', 0, 1, 47, '1.工艺：放线定位→基层处理→水泥砂浆搅拌→地台砌筑→抹灰→养护。2.乙供：沙子、水泥、人工费及机械。3.说明：高度为一层砖加抹灰厚度。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤60mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤60mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 超高地台砌筑抹灰 | 规格:每增加60mm (拆分自:超高地台砌筑抹灰（每增加60mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超高地台砌筑抹灰', 'cgdtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超高地台砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超高地台砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超高地台砌筑抹灰', '每增加60mm', 'cgdtqzmhmzj60mm', 100000, 0, '', 0, 1, 47, '1.工艺：增加地台砌筑抹灰的材料、人工费及机械费。2.乙供：沙子、水泥、人工费及机械。3.说明：高度为一层砖加抹灰厚度。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加60mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加60mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== OSB楼梯踏步基层制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB楼梯踏步基层制作', 'osblttbjczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB楼梯踏步基层制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB楼梯踏步基层制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB楼梯踏步基层制作', '', 'osblttbjczz', 150000, 0, '', 0, 1, 10, '1.工艺：人工测量定位→弹线→OSB裁切→电锤打孔加木楔（打孔间距400mm以内）→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按踏计算。\n2.说明：缓步台按两踏计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '踏', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 钢结构楼梯下方基层制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '钢结构楼梯下方基层制作', 'gjgltxfjczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '钢结构楼梯下方基层制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '钢结构楼梯下方基层制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '钢结构楼梯下方基层制作', '', 'gjgltxfjczz', 350000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→木方或OSB板做框架→石膏板饰面安装。2.乙供：本子目需要的材料、人工及机械。3.说明：不含旋转钢结构楼梯。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);

-- ======== 异形钢结构楼梯下方基层制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '异形钢结构楼梯下方基层制作', 'yxgjgltxfjczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '异形钢结构楼梯下方基层制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '异形钢结构楼梯下方基层制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '异形钢结构楼梯下方基层制作', '', 'yxgjgltxfjczz', 420000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→木方或OSB板做框架→石膏板饰面安装。2.乙供：本子目需要的材料、人工及机械。3.说明：不含旋转钢结构楼梯。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);

-- ======== OSB地台基层制作 | 规格:高度≤300mm (拆分自:OSB地台基层制作（高度≤300mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB地台基层制作', 'osbdtjczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB地台基层制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB地台基层制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB地台基层制作', '高度≤300mm', 'osbdtjczzgd≤300mm', 580000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→木方或OSB做框架→自攻钉加固→OSB饰面安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB异形地台基层制作 | 规格:高度≤300mm (拆分自:OSB异形地台基层制作（高度≤300mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB异形地台基层制作', 'osbyxdtjczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB异形地台基层制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB异形地台基层制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB异形地台基层制作', '高度≤300mm', 'osbyxdtjczzgd≤300mm', 680000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→木方或OSB做框架→自攻钉加固→OSB饰面安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 1100, '张', 1100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 地面瓷砖铺设 | 规格:300*300 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '300*300', 'dmczps300*300', 108000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*300');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*300' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设 | 规格:400*400 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '400*400', 'dmczps400*400', 108000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*400');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*400' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设 | 规格:400*800 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '400*800', 'dmczps400*800', 108000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设 | 规格:600*600 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '600*600', 'dmczps600*600', 108000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 40000);

-- ======== 地面瓷砖铺设 | 规格:800*800 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '800*800', 'dmczps800*800', 108000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 40000);

-- ======== 地面瓷砖铺设 | 规格:600*1200 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '600*1200', 'dmczps600*1200', 113000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 45000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 45000);

-- ======== 地面瓷砖铺设 | 规格:900*900 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '900*900', 'dmczps900*900', 113000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 45000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 45000);

-- ======== 地面瓷砖铺设 | 规格:200*1200 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '200*1200', 'dmczps200*1200', 133000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设 | 规格:150*1200 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '150*1200', 'dmczps150*1200', 133000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设 | 规格:150*900 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '150*900', 'dmczps150*900', 133000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：水泥、沙子、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设 | 规格:750*1500 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '750*1500', 'dmczps750*1500', 128000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 60000);

-- ======== 地面瓷砖铺设 | 规格:800*1600 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '800*1600', 'dmczps800*1600', 128000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 60000);

-- ======== 地面瓷砖铺设 | 规格:900*1800 ========
SET @qcid = 388; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设', '900*1800', 'dmczps900*1800', 148000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 70000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 70000);

-- ======== 地面六边形瓷砖铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面六边形瓷砖铺设', 'dmlbxczps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面六边形瓷砖铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面六边形瓷砖铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面六边形瓷砖铺设', '', 'dmlbxczps', 282000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 增加地面天然石铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加地面天然石铺设人工费', 'zjdmtrspsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加地面天然石铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加地面天然石铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加地面天然石铺设人工费', '', 'zjdmtrspsrgf', 20000, 0, '', 0, 1, 47, '1.乙供：人工及机械。2.说明：适用于理石、岩板、火烧板或青石板铺设。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 15000);

-- ======== 增加波打线铺设人工费 | 规格:单条 (拆分自:增加波打线铺设人工费（单条）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加波打线铺设人工费', 'zjbdxpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加波打线铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加波打线铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加波打线铺设人工费', '单条', 'zjbdxpsrgfdt', 42000, 0, '', 0, 1, 1, '1.乙供：人工及机械。2.说明：适用于瓷砖或理石墙地面；不含边线加工费，多条组合费用另计。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单条');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单条' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 9000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 9000);

-- ======== 增加波打线铺设人工费 | 规格:多条组合 (拆分自:增加波打线铺设人工费（多条组合）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加波打线铺设人工费', 'zjbdxpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加波打线铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加波打线铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加波打线铺设人工费', '多条组合', 'zjbdxpsrgfdtzh', 47000, 0, '', 0, 1, 1, '1.乙供：人工及机械。2.说明：适用于瓷砖或理石墙地面；不含边线加工费，多条组合如未进行粘贴，需按单条逐条收费。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '多条组合');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '多条组合' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 14000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 14000);

-- ======== 增加错缝铺设（含工字铺）人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加错缝铺设（含工字铺）人工费', 'zjcfps（hgzp）rgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加错缝铺设（含工字铺）人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加错缝铺设（含工字铺）人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加错缝铺设（含工字铺）人工费', '', 'zjcfps（hgzp）rgf', 43000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 25000);

-- ======== 增加人字铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加人字铺设人工费', 'zjrzpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加人字铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加人字铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加人字铺设人工费', '', 'zjrzpsrgf', 85000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 35000);

-- ======== 增加斜铺/菱形铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加斜铺/菱形铺设人工费', 'zjxp/lxpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加斜铺/菱形铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加斜铺/菱形铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加斜铺/菱形铺设人工费', '', 'zjxp/lxpsrgf', 15000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 增加多规格组合铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加多规格组合铺设人工费', 'zjdggzhpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加多规格组合铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加多规格组合铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加多规格组合铺设人工费', '', 'zjdggzhpsrgf', 50000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 25000);

-- ======== 增加花角铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加花角铺设人工费', 'zjhjpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加花角铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加花角铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加花角铺设人工费', '', 'zjhjpsrgf', 17000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 8000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 8000);

-- ======== 增加地心铺设人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加地心铺设人工费', 'zjdxpsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加地心铺设人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加地心铺设人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加地心铺设人工费', '', 'zjdxpsrgf', 132000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：仅适用于满铺地心；不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项；不足3.2平按3.2平计。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 23000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 23000);

-- ======== 增加地面瓷砖无缝铺贴人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加地面瓷砖无缝铺贴人工费', 'zjdmczwfptrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加地面瓷砖无缝铺贴人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加地面瓷砖无缝铺贴人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加地面瓷砖无缝铺贴人工费', '', 'zjdmczwfptrgf', 35000, 0, '', 0, 1, 47, '1.乙供：人工及机械2.说明：不含瓷砖加工费，需要甲方在工厂加工。\n1.计算规则：按平方米计算。\n2.说明：在标准铺贴基础上增加此项；不足3.2平按3.2平计。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 暗藏踢脚线开槽 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '暗藏踢脚线开槽', 'actjxkc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '暗藏踢脚线开槽');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '暗藏踢脚线开槽' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '暗藏踢脚线开槽', '', 'actjxkc', 20000, 0, '', 0, 1, 1, '1.工艺：定位放线→无齿锯切割→剔槽→线槽清理→垃圾清理。2.乙供：垃圾袋、人工及机械。3.说明：垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 5000);

-- ======== 瓷砖或理石踢脚线铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '瓷砖或理石踢脚线铺设', 'czhlstjxps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '瓷砖或理石踢脚线铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '瓷砖或理石踢脚线铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '瓷砖或理石踢脚线铺设', '', 'czhlstjxps', 45000, 0, '', 0, 1, 1, '1.工艺：瓷砖或理石背面清理→踢脚清理→材料预排→标高定位→水泥砂浆搅拌→铺贴踢脚湿润→摊铺粘结层（厚度不超过20mm）→按定位线铺贴踢脚线→擦缝→油工处理边角→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：瓷砖或理石踢脚线、定位卡（调平器）。4.说明：不含瓷砖或理石加工费。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 18000);

-- ======== 嵌入式金属踢脚线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '嵌入式金属踢脚线', 'qrsjstjx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '嵌入式金属踢脚线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '嵌入式金属踢脚线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '嵌入式金属踢脚线', '', 'qrsjstjx', 55000, 0, '', 0, 1, 1, '1.工艺：踢脚清理→材料预排→标高定位→石膏U型槽制作→踢脚线安装。2.乙供：石膏、人工及机械。3.甲供：金属踢脚线。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);

-- ======== 过门石铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '过门石铺设', 'gmsps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '过门石铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '过门石铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '过门石铺设', '', 'gmsps', 60000, 0, '', 0, 1, 1, '1.工艺：人工清理过门石背面→地面清理→材料预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：水泥、沙子、人工及机械。3.甲供：过门石。\n1.计算规则：按米计算。\n2.说明：不足1米按1米计。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 25000);

-- ======== 卫生间地面回填 | 规格:无辅料 (拆分自:卫生间地面回填（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间地面回填', 'wsjdmht', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间地面回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间地面回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间地面回填', '无辅料', 'wsjdmhtwfl', 37000, 0, '', 0, 1, 47, '1.工艺：人工清理基层→地面预湿→水泥砂浆搅拌→地面找平→边角圆弧处理→门口拦水坝制作。2.乙供：人工及机械。3.说明： 卫生间必做项，不区分是否重新做地热。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);

-- ======== 下沉卫生间地面回填 | 规格:无辅料 (拆分自:下沉卫生间地面回填（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间地面回填', 'xcwsjdmht', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间地面回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间地面回填', '无辅料', 'xcwsjdmhtwfl', 172000, 0, '面积', 0, 1, 47, '1.工艺：沉箱内下水管道保护砌筑→回填陶粒或河石→钢筋绑扎→地面混凝土浇筑并回填→养护。2.乙供：陶粒/河石、钢筋、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 75000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 75000);

-- ======== 阳台地面水泥砂浆回填找平 | 规格:无辅料 (拆分自:阳台地面水泥砂浆回填找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台地面水泥砂浆回填找平', 'ytdmsnsjhtzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台地面水泥砂浆回填找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台地面水泥砂浆回填找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台地面水泥砂浆回填找平', '无辅料', 'ytdmsnsjhtzpwfl', 72000, 0, '面积', 0, 1, 47, '1.工艺：人工地面清理→地面回填→水泥砂浆搅拌→地面找平→表面收平→养护。 2.乙供：人工及机械。 3.说明：回填高度与室内原始地热找平层高度一致。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 地面水泥砂浆找平 | 规格:无辅料 (拆分自:地面水泥砂浆找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面水泥砂浆找平', 'dmsnsjzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面水泥砂浆找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面水泥砂浆找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面水泥砂浆找平', '无辅料', 'dmsnsjzpwfl', 37000, 0, '面积', 0, 1, 47, '1.工艺：人工地面清理→标高定位及灰饼制作→水泥砂浆搅拌→地面找平→表面收平→养护。 2.乙供：人工及机械。 3.说明：适用于室内及阳台铺设地板基层处理；不包含原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平，铲除费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 13000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 13000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:300*300 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '300*300', 'dmczps（wfl）300*300', 100000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*300');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*300' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:400*400 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '400*400', 'dmczps（wfl）400*400', 100000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*400');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*400' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:400*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '400*800', 'dmczps（wfl）400*800', 100000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:600*600 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '600*600', 'dmczps（wfl）600*600', 100000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 40000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:800*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '800*800', 'dmczps（wfl）800*800', 100000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 40000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:600*1200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '600*1200', 'dmczps（wfl）600*1200', 105000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 45000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 45000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:900*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '900*900', 'dmczps（wfl）900*900', 105000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 45000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 45000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:200*1200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '200*1200', 'dmczps（wfl）200*1200', 125000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:150*1200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '150*1200', 'dmczps（wfl）150*1200', 125000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:150*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '150*900', 'dmczps（wfl）150*900', 125000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。 2.乙供：人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：150*900适用于人字铺，需加收人字铺人工费，200*1200/150*1200含已包含369铺或工字铺费用；不含理石铺设,斜铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 65000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 65000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:750*1500 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '750*1500', 'dmczps（wfl）750*1500', 120000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 60000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:800*1600 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '800*1600', 'dmczps（wfl）800*1600', 120000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 60000);

-- ======== 地面瓷砖铺设（无辅料） | 规格:900*1800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面瓷砖铺设（无辅料）', 'dmczps（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面瓷砖铺设（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面瓷砖铺设（无辅料）', '900*1800', 'dmczps（wfl）900*1800', 140000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不含理石铺设,斜铺,条型铺,工字铺,多规格组合铺,花角,收边,腰线,地心、原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 70000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 70000);

-- ======== 地面六边形瓷砖铺设 | 规格:无辅料 (拆分自:地面六边形瓷砖铺设（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '地面六边形瓷砖铺设', 'dmlbxczps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '地面六边形瓷砖铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '地面六边形瓷砖铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地面六边形瓷砖铺设', '无辅料', 'dmlbxczpswfl', 274000, 0, '面积', 0, 1, 47, '1.工艺：瓷砖准备（泡砖、背面清理）→地面清理→瓷砖预排→标高定位→水泥砂浆搅拌→铺贴地面湿润→摊铺粘结层（厚度不超过40mm）→按定位线铺贴瓷砖→擦缝→养护。2.乙供：人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：原地面基层铲除等项目，如地面基层存在起砂、空鼓等问题，需按相关项目报价铲除后找平费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 原捣制、加气块墙体铺瓷砖基层处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '原捣制、加气块墙体铺瓷砖基层处理', 'ydz、jqkqtpczjccl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '原捣制、加气块墙体铺瓷砖基层处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '原捣制、加气块墙体铺瓷砖基层处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '原捣制、加气块墙体铺瓷砖基层处理', '', 'ydz、jqkqtpczjccl', 48000, 0, '', 0, 1, 47, '1.工艺：墙面清理→瓷砖粘合剂搅拌→批刮粘合剂→拉槽处理→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.说明：适用于捣制混凝土墙面及加气块墙面贴砖前墙面的基层处理；此项为墙面抹灰找平前的拉槽处理，目的为防止抹灰层空鼓脱落。\n1.计算规则：按平方米计算。\n2.说明：不足1平方米按1平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 墙棚面基层打磨处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙棚面基层打磨处理', 'qpmjcdmcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙棚面基层打磨处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙棚面基层打磨处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙棚面基层打磨处理', '', 'qpmjcdmcl', 75000, 0, '', 0, 1, 47, '1.工艺：原始胶泥墙面打磨或原始大白墙面贴瓷砖基层处理、防水打磨至原始抹灰层或结构层机械打磨并装袋。2.乙供：垃圾袋、人工及机械。3.说明：垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 10000);

-- ======== 墙面原防水层打磨 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面原防水层打磨', 'qmyfscdm', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面原防水层打磨');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面原防水层打磨' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面原防水层打磨', '', 'qmyfscdm', 200000, 0, '1', 0, 1, 12, '1.工艺：原始高分子防水层及卷材防水层撕除后打磨并装袋。2.乙供：垃圾袋、人工及机械。 3.说明：如进行水泥砂浆层铲除且防水层在砂浆外层，不再重复收取原防水层打磨费；垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 1000, 75000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 75000);

-- ======== 墙面防水涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面防水涂刷', 'qmfsts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面防水涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面防水涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面防水涂刷', '', 'qmfsts', 140000, 0, '', 0, 1, 47, '1.工艺：人工清理基层→防水区域定位弹线→防水材料搅拌→涂刷防水底涂一遍→柔性防水材料涂刷二遍→淋水试验。 2.乙供：水泥、沙子、柔性防水剂、人工及机械。 3.说明：淋浴区墙面涂刷高度1800mm，淋浴区中心左右各返900mm，其余部位涂刷高度600mm。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 下沉卫生间墙面防水涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '下沉卫生间墙面防水涂刷', 'xcwsjqmfsts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '下沉卫生间墙面防水涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '下沉卫生间墙面防水涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '下沉卫生间墙面防水涂刷', '', 'xcwsjqmfsts', 140000, 0, '', 0, 1, 47, '1.工艺：人工清理基层→防水区域定位弹线→防水材料搅拌→涂刷防水底涂一遍→柔性防水材料涂刷二遍→淋水试验。 2.乙供：水泥、沙子、柔性防水剂、人工及机械。 3.说明：淋浴区墙面涂刷高度1800mm，淋浴区中心左右各返900mm，其余部位涂刷高度600mm。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 60mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '60mm墙体砌筑抹灰', '60mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '60mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '60mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '60mm墙体砌筑抹灰', '', '60mmqtqzmh', 173000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：红砖、沙子、水泥、人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 60000);

-- ======== 120mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '120mm墙体砌筑抹灰', '120mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '120mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '120mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '120mm墙体砌筑抹灰', '', '120mmqtqzmh', 283000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：红砖、沙子、水泥、人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 80000);

-- ======== 240mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '240mm墙体砌筑抹灰', '240mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '240mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '240mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '240mm墙体砌筑抹灰', '', '240mmqtqzmh', 383000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：红砖、沙子、水泥、人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 150000);

-- ======== 增加异形墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加异形墙体砌筑抹灰', 'zjyxqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加异形墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加异形墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加异形墙体砌筑抹灰', '', 'zjyxqtqzmh', 30000, 0, '', 0, 1, 47, '1.工艺：增加异形墙体砌筑抹灰的材料和人工费。2.乙供：红砖、沙子、水泥、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在墙体砌筑抹灰基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 300000);

-- ======== 墙体抹灰找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙体抹灰找平', 'qtmhzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙体抹灰找平', '', 'qtmhzp', 28000, 0, '', 0, 1, 47, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：沙子、水泥、人工及机械。3.说明：适用于原墙面瓷砖拆除后、阳台保温拆除后或墙面空鼓拆除后抹灰。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 墙体抹灰找平 | 规格:规方冲筋 (拆分自:墙体抹灰找平（规方冲筋）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙体抹灰找平', 'qtmhzp', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙体抹灰找平', '规方冲筋', 'qtmhzpgfcj', 25000, 0, '', 4, 1, 47, '1.工艺：规方放线→水泥砂浆搅拌→墙面浇水湿润→冲筋打点→抹灰→表面收平→养护。2.乙供：沙子、水泥、人工及机械。3.说明：适用于贴砖前墙面归方找平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '规方冲筋');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '规方冲筋' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 20000);

-- ======== 门口或窗口处抹灰找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '门口或窗口处抹灰找平', 'mkhckcmhzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '门口或窗口处抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '门口或窗口处抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '门口或窗口处抹灰找平', '', 'mkhckcmhzp', 35000, 0, '', 0, 0, 1, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：沙子、水泥、人工及机械。3.说明：适用于墙体拆除后抹灰、窗口抹灰，不含厨房、卫生间窗口。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 16000);

-- ======== 空心墙体填实加固 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '空心墙体填实加固', 'kxqttsjg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '空心墙体填实加固');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '空心墙体填实加固' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '空心墙体填实加固', '', 'kxqttsjg', 100000, 0, '', 0, 1, 12, '1.工艺：放线定位→空心墙掏空→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。 2.乙供：红砖、沙子、水泥、人工及机械。3.说明：适用于电视挂墙、储水热水器、壁挂洗衣机。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 30000);

-- ======== 内门口过梁加固 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '内门口过梁加固', 'nmkgljg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '内门口过梁加固');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '内门口过梁加固' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '内门口过梁加固', '', 'nmkgljg', 210000, 0, '', 0, 1, 12, '1.工艺：放线定位→角铁安装位置开槽→角铁安装→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。 2.乙供：红砖、沙子、水泥、角铁、人工及机械。3.说明：适用于厨房、卫生间门洞口长度≤1000mm，砌筑高度≤600mm的过梁制作；门洞口长度＞100高度超过600mm套用“假梁制作”定额子目。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 50000);

-- ======== 厨房排烟管道挂网抹灰处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房排烟管道挂网抹灰处理', 'cfpygdgwmhcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房排烟管道挂网抹灰处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房排烟管道挂网抹灰处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房排烟管道挂网抹灰处理', '', 'cfpygdgwmhcl', 130000, 0, '', 0, 1, 12, '1.工艺：墙面清理→水泥砂浆搅拌→挂铁丝网→抹灰→表面收平→烟道口套管安装→逆止阀口瓷砖铺贴→安装逆止阀。2.乙供：沙子、水泥、铁丝网、逆止阀、人工及机械。3.说明：方林装饰提供固定尺寸厨房逆止阀，如甲方有特殊需求，请自行购买。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 排水立杠砌筑抹灰 | 规格:单管 (拆分自:排水立杠砌筑抹灰（单管）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '排水立杠砌筑抹灰', 'pslgqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '排水立杠砌筑抹灰', '单管', 'pslgqzmhdg', 370000, 0, '1', 0, 1, 12, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→检修口保护套管安装→挂铁丝网→抹灰→表面收平→养护。 2.乙供：红砖、沙子、水泥、铁丝网、人工及机械。3.说明：不含成品检修口。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单管');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单管' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 排水立杠砌筑抹灰 | 规格:双管 (拆分自:排水立杠砌筑抹灰（双管）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '排水立杠砌筑抹灰', 'pslgqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '排水立杠砌筑抹灰', '双管', 'pslgqzmhsg', 450000, 0, '1', 0, 1, 12, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→检修口保护套管安装→挂铁丝网→抹灰→表面收平→养护。 2.乙供：红砖、沙子、水泥、铁丝网、人工及机械。3.说明：不含成品检修口。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '双管');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '双管' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 120000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 120000);

-- ======== 置物隔砌筑 | 规格:一隔 (拆分自:置物隔砌筑（一隔）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '置物隔砌筑', 'zwgqz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '置物隔砌筑');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '置物隔砌筑' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '置物隔砌筑', '一隔', 'zwgqzyg', 400000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→瓷砖裁切→隔板瓷砖倒角→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴。2.乙供：红砖、沙子、水泥、瓷砖粘合剂、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：成品置物隔、钢化玻璃隔板需要甲供。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一隔');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '一隔' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 190000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 190000);

-- ======== 增加置物隔砌筑 | 规格:每增加一隔 (拆分自:增加置物隔砌筑（每增加一隔）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加置物隔砌筑', 'zjzwgqz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加置物隔砌筑');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加置物隔砌筑' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加置物隔砌筑', '每增加一隔', 'zjzwgqzmzjyg', 300000, 0, '', 0, 1, 12, '1.乙供：人工及机械。2.说明：每增加一隔，依次累计增加此项。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加一隔');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加一隔' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 90000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 90000);

-- ======== 玻璃砖砌筑勾缝 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '玻璃砖砌筑勾缝', 'blzqzgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '玻璃砖砌筑勾缝');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '玻璃砖砌筑勾缝' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '玻璃砖砌筑勾缝', '', 'blzqzgf', 500000, 0, '', 0, 1, 47, '1.工艺：定位放线→玻璃砖预排→框架安装（框架基层处理）→砌筑玻璃砖→勾缝。2.乙供：人工及机械。3.甲供：玻璃砖及配件、白水泥或建筑胶。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 100000);

-- ======== 墙地面马赛克铺贴及勾缝 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙地面马赛克铺贴及勾缝', 'qdmmskptjgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙地面马赛克铺贴及勾缝');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙地面马赛克铺贴及勾缝' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙地面马赛克铺贴及勾缝', '', 'qdmmskptjgf', 257000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→马赛克预排→水泥砂浆规方找平→人工清理马赛克背面→瓷砖粘合剂搅拌→批刮粘合剂→马赛克粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：马赛克、定位卡（调平器）。4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 110000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 110000);

-- ======== 墙面文化石铺贴 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面文化石铺贴', 'qmwhspt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面文化石铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面文化石铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面文化石铺贴', '', 'qmwhspt', 183000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→文化石预排→水泥砂浆规方找平→人工清理文化石背面→瓷砖粘合剂搅拌→批刮粘合剂→文化石粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：文化石。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 84000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 84000);

-- ======== 墙面劈开砖留缝铺贴 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面劈开砖留缝铺贴', 'qmpkzlfpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面劈开砖留缝铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面劈开砖留缝铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面劈开砖留缝铺贴', '', 'qmpkzlfpt', 183000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→劈开砖预排→水泥砂浆规方找平→人工清理劈开砖背面→瓷砖粘合剂搅拌→批刮粘合剂→劈开砖粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：劈开砖。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 124000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 124000);

-- ======== 墙面劈开砖不留缝铺贴 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面劈开砖不留缝铺贴', 'qmpkzblfpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面劈开砖不留缝铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面劈开砖不留缝铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面劈开砖不留缝铺贴', '', 'qmpkzblfpt', 163000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→劈开砖预排→水泥砂浆规方找平→人工清理劈开砖背面→瓷砖粘合剂搅拌→批刮粘合剂→劈开砖粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：劈开砖。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 99000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 99000);

-- ======== 墙面瓷砖铺贴 | 规格:100*100 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '100*100', 'qmczpt100*100', 298000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 163000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 163000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:80*120 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '80*120', 'qmczpt80*120', 298000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '80*120');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '80*120' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 163000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 163000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:150*150 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '150*150', 'qmczpt150*150', 248000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*150');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*150' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 113000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 113000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:60*240 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '60*240', 'qmczpt60*240', 248000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '60*240');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '60*240' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 113000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 113000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:200*200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '200*200', 'qmczpt200*200', 121000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 89000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 89000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:300*600 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '300*600', 'qmczpt300*600', 120000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 68000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 68000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:400*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '400*800', 'qmczpt400*800', 125000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 73000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 73000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:450*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '450*900', 'qmczpt450*900', 125000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '450*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '450*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 73000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 73000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:800*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '800*800', 'qmczpt800*800', 133000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:900*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '900*900', 'qmczpt900*900', 133000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:600*1200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '600*1200', 'qmczpt600*1200', 133000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:600*1350 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '600*1350', 'qmczpt600*1350', 191000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1350');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1350' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 86000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 86000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:800*1350 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '800*1350', 'qmczpt800*1350', 198000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1350');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1350' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 93000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 93000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:750*1500 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '750*1500', 'qmczpt750*1500', 198000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 93000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 93000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:900*1800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '900*1800', 'qmczpt900*1800', 212000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 107000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 107000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴 | 规格:1200*2400 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴', 'qmczpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴', '1200*2400', 'qmczpt1200*2400', 268000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 127000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 127000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面六边形瓷砖铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面六边形瓷砖铺设', 'qmlbxczps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面六边形瓷砖铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面六边形瓷砖铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面六边形瓷砖铺设', '', 'qmlbxczps', 303000, 0, '', 0, 1, 47, '1.工艺：测量→瓷砖预排→水泥砂浆规方找平→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 101000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 101000);

-- ======== 墙面条形砖铺贴 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面条形砖铺贴', 'qmtxzpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面条形砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面条形砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面条形砖铺贴', '', 'qmtxzpt', 135000, 0, '', 0, 1, 47, '1.工艺：测量→瓷砖预排→水泥砂浆规方找平→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。2.乙供：瓷砖粘合剂、沙子、水泥、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 增加小规格砖斜铺人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加小规格砖斜铺人工费', 'zjxggzxprgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加小规格砖斜铺人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加小规格砖斜铺人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加小规格砖斜铺人工费', '', 'zjxggzxprgf', 30000, 0, '', 0, 1, 47, '1.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在对应尺寸瓷砖铺贴项目基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 增加墙面瓷砖无缝铺贴人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加墙面瓷砖无缝铺贴人工费', 'zjqmczwfptrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加墙面瓷砖无缝铺贴人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加墙面瓷砖无缝铺贴人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加墙面瓷砖无缝铺贴人工费', '', 'zjqmczwfptrgf', 45000, 0, '', 0, 1, 47, '1.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在对应尺寸瓷砖铺贴项目基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 增加弧形砖铺贴人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加弧形砖铺贴人工费', 'zjhxzptrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加弧形砖铺贴人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加弧形砖铺贴人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加弧形砖铺贴人工费', '', 'zjhxzptrgf', 40000, 0, '', 0, 1, 47, '1.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在对应尺寸瓷砖铺贴项目基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 5000);

-- ======== 增加墙面腰线铺贴（平面腰线）人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加墙面腰线铺贴（平面腰线）人工费', 'zjqmyxpt（pmyx）rgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加墙面腰线铺贴（平面腰线）人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加墙面腰线铺贴（平面腰线）人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加墙面腰线铺贴（平面腰线）人工费', '', 'zjqmyxpt（pmyx）rgf', 42000, 0, '', 0, 1, 1, '1.乙供：人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 9000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 9000);

-- ======== 增加墙面腰线铺贴（非平面腰线）人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加墙面腰线铺贴（非平面腰线）人工费', 'zjqmyxpt（fpmyx）rgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加墙面腰线铺贴（非平面腰线）人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加墙面腰线铺贴（非平面腰线）人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加墙面腰线铺贴（非平面腰线）人工费', '', 'zjqmyxpt（fpmyx）rgf', 42000, 0, '', 0, 1, 1, '1.乙供：人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 14000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 14000);

-- ======== 成品瓷砖阳角线铺设 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品瓷砖阳角线铺设', 'cpczyjxps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品瓷砖阳角线铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品瓷砖阳角线铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品瓷砖阳角线铺设', '', 'cpczyjxps', 27000, 0, '', 0, 1, 1, '1.工艺：阳角线铺设。2.乙供：人工及机械。3.甲供：成品瓷砖阳角线。4.说明：如遇特殊砖(手工无法切割等)需要甲方在工厂加工。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 8000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 8000);

-- ======== 瓷砖隐形检修口安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '瓷砖隐形检修口安装', 'czyxjxkaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '瓷砖隐形检修口安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '瓷砖隐形检修口安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '瓷砖隐形检修口安装', '', 'czyxjxkaz', 350000, 0, '', 0, 1, 12, '1.工艺：砌筑洞口→成品安装→瓷砖安装。2.乙供：人工及机械。3.甲供：隐形检修口及配件。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 200000);

-- ======== 单面OSB封板隔断墙 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '单面OSB封板隔断墙', 'dmosbfbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '单面OSB封板隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '单面OSB封板隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '单面OSB封板隔断墙', '', 'dmosbfbgdq', 295000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→75轻钢龙骨安装→穿心骨安装→OSB罩面→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：如墙体厚度低于龙骨宽度，则采用木方或OSB做骨架；适用于局部墙体封平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 350, '张', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 单面石膏板封板隔断墙 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '单面石膏板封板隔断墙', 'dmsgbfbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '单面石膏板封板隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '单面石膏板封板隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '单面石膏板封板隔断墙', '', 'dmsgbfbgdq', 180000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→75轻钢龙骨安装→穿心骨安装→石膏板罩面安装→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：如墙体厚度低于龙骨宽度，则采用木方或OSB做骨架；适用于局部墙体封平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板隔断墙 | 规格:厚度≤100mm (拆分自:石膏板隔断墙（厚度≤100mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板隔断墙', 'sgbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板隔断墙', '厚度≤100mm', 'sgbgdqhd≤100mm', 265000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→天地骨安装→75轻钢龙骨安装→穿心骨安装→一侧石膏板罩面安装安装→水电管线铺设→另一侧石膏板罩面安装安装→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。3.说明：单层龙骨，适用于隔断墙厚度≤100mm；隔音材料费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度≤100mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度≤100mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 45000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 45000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 800, '张', 800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板隔断墙 | 规格:厚度＞100mm (拆分自:石膏板隔断墙（厚度＞100mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板隔断墙', 'sgbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板隔断墙', '厚度＞100mm', 'sgbgdqhd＞100mm', 335000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→天地骨安装→75轻钢龙骨安装→穿心骨安装→一侧石膏板罩面安装安装→水电管线铺设→另一侧石膏板罩面安装安装→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。3.说明：双层龙骨，适用于隔断墙厚度＞100mm；隔音材料费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度＞100mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度＞100mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 60000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 800, '张', 800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== OSB隔断墙 | 规格:厚度≤100mm (拆分自:OSB隔断墙（厚度≤100mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB隔断墙', 'osbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB隔断墙', '厚度≤100mm', 'osbgdqhd≤100mm', 295000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→天地骨安装→75轻钢龙骨安装→穿心骨安装→一侧OSB罩面安装→水电管线铺设→另一侧OSB罩面安装→OSB接缝处理。2.乙供：本子目需要的材料、人工及机械。3.说明：单层龙骨，适用于隔断墙厚度≤100mm；隔音材料费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度≤100mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度≤100mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 680, '张', 680, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB隔断墙 | 规格:厚度＞100mm (拆分自:OSB隔断墙（厚度＞100mm）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB隔断墙', 'osbgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB隔断墙', '厚度＞100mm', 'osbgdqhd＞100mm', 365000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→天地骨安装→75轻钢龙骨安装→穿心骨安装→一侧OSB罩面安装→水电管线铺设→另一侧OSB罩面安装→OSB接缝处理。 2.乙供：本子目需要的材料、人工及机械。3.说明：双层龙骨，适用于隔断墙厚度＞100mm；隔音材料费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度＞100mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '厚度＞100mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 80000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 680, '张', 680, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 弧形隔断墙 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弧形隔断墙', 'hxgdq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弧形隔断墙');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弧形隔断墙' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弧形隔断墙', '', 'hxgdq', 650000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→OSB龙骨安装→一侧石膏板罩面安装安装→水电管线铺设→另一侧石膏板罩面安装安装→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。3.说明：适用于弧形隔断墙；隔音材料费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 870, '张', 870, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加隔断墙隔音棉 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加隔断墙隔音棉', 'zjgdqgym', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加隔断墙隔音棉');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加隔断墙隔音棉' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加隔断墙隔音棉', '', 'zjgdqgym', 60000, 0, '', 0, 1, 47, '1.乙供：人工及机械。2.甲供：隔音棉。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);

-- ======== 假梁制作 | 规格:(空) ========
SET @qcid = 467; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '假梁制作', '', 'jlzz', 168000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB或木方做框架→吊滑拉门框架膨胀吊杆加固处理→梁底双层OSB加固→石膏板饰面→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 350, '张', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 门口基层处理 | 规格:(空) ========
SET @qcid = 460; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '门口基层处理', '', 'mkjccl', 60000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB基层制作→侧封石膏板。2.乙供：本子目需要的材料、人工及机械。3.说明：侧边宽度和上口高度限100mm以内。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 25000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 无边框门口基层处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '无边框门口基层处理', 'wbkmkjccl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '无边框门口基层处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '无边框门口基层处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '无边框门口基层处理', '', 'wbkmkjccl', 500000, 0, '', 0, 1, 5, '1.工艺：人工测量定位→弹线→墙面刨槽→厂家安装门框→石膏板窄条找平→油工细部处理。2.乙供：本子目需要的材料、人工及机械。3.说明：门框由厂家安装。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙面保温隔音基层处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面保温隔音基层处理', 'qmbwgyjccl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面保温隔音基层处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面保温隔音基层处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面保温隔音基层处理', '', 'qmbwgyjccl', 200000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→苯板钉固定保温材料→发泡剂填充→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：人工及机械。 3.甲供：保温隔音材料。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 48000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 48000);

-- ======== 悬浮背景墙制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '悬浮背景墙制作', 'xfbjqzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '悬浮背景墙制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '悬浮背景墙制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '悬浮背景墙制作', '', 'xfbjqzz', 328000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→木方或OSB做框架→OSB板加固→石膏板罩面安装→自攻钉固定。 2.乙供：本子目需要的材料、人工及辅料3.说明：不含金属装饰框或金属置物隔；如需线性灯或虚光费用另计，增加套用线性灯安装或虚光灯槽制作项目。\n1.计算规则：按平方米计算。\n2.说明：按背景墙外框投影面积计算，中间区域不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 80000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 580, '张', 580, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙角圆弧造型 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙角圆弧造型', 'qjyhzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙角圆弧造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙角圆弧造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙角圆弧造型', '', 'qjyhzx', 600000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：此定额为单弧收费标准，半径≤500mm，如多弧墙面，依次累计增加此项。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 250, '张', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 360, '张', 360, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板包管道 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板包管道', 'sgbbgd', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板包管道');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板包管道' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板包管道', '', 'sgbbgd', 120000, 0, '举架', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方或OSB做框架→石膏板罩面安装→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。3.说明：下水管隔音套用厨房排水管道隔音处理。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 250, '张', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 楼梯侧封石膏板 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '楼梯侧封石膏板', 'ltcfsgb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '楼梯侧封石膏板');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '楼梯侧封石膏板' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '楼梯侧封石膏板', '', 'ltcfsgb', 120000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴石膏板→自攻钉加固。 2.乙供：本子目需要的材料、人工及机械。3.说明：适用于楼梯侧面及楼板侧面封石膏板。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 250, '张', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 异形楼梯侧封石膏板 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '异形楼梯侧封石膏板', 'yxltcfsgb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '异形楼梯侧封石膏板');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '异形楼梯侧封石膏板' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '异形楼梯侧封石膏板', '', 'yxltcfsgb', 150000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴石膏板→自攻钉加固。 2.乙供：本子目需要的材料、人工及机械。3.说明：适用于楼梯侧面及楼板侧面封石膏板。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 哑口拱门造型 | 规格:哑口宽度≤1800mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '哑口拱门造型', 'ykgmzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '哑口拱门造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '哑口拱门造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '哑口拱门造型', '哑口宽度≤1800mm', 'ykgmzxykkd≤1800mm', 980000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：拱形垂直高度≤500mm，侧边立柱宽度（墙厚）≤300mm。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑口宽度≤1800mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑口宽度≤1800mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 240000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 240000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 750, '张', 750, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 1500, '张', 1500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 哑口拱门造型 | 规格:1800mm＜哑口宽度≤2500mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '哑口拱门造型', 'ykgmzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '哑口拱门造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '哑口拱门造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '哑口拱门造型', '1800mm＜哑口宽度≤2500mm', 'ykgmzx1800mm＜ykkd≤2500mm', 1500000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：拱形垂直高度≤500mm，侧边立柱宽度（墙厚）≤300mm。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1800mm＜哑口宽度≤2500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1800mm＜哑口宽度≤2500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 340000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 340000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 1700, '张', 1700, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 哑口拱门造型 | 规格:2500mm＜哑口宽度≤4000mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '哑口拱门造型', 'ykgmzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '哑口拱门造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '哑口拱门造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '哑口拱门造型', '2500mm＜哑口宽度≤4000mm', 'ykgmzx2500mm＜ykkd≤4000mm', 2000000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：拱形垂直高度≤500mm，侧边立柱宽度（墙厚）≤300mm。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '2500mm＜哑口宽度≤4000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '2500mm＜哑口宽度≤4000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 400000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 1500, '张', 1500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 3000, '张', 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 哑口拱门造型 | 规格:哑口宽度≤1000mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '哑口拱门造型', 'ykgmzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '哑口拱门造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '哑口拱门造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '哑口拱门造型', '哑口宽度≤1000mm', 'ykgmzxykkd≤1000mm', 680000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：拱形垂直高度≤500mm，侧边宽度（墙厚）≤300mm。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑口宽度≤1000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑口宽度≤1000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 700, '张', 700, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 哑口弧形边角造型 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '哑口弧形边角造型', 'ykhxbjzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '哑口弧形边角造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '哑口弧形边角造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '哑口弧形边角造型', '', 'ykhxbjzx', 300000, 0, '', 0, 1, 5, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。3.说明：拱形垂直高度≤500mm，侧边宽度（墙厚）≤300mm。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 75000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 75000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 300, '张', 300, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙面单层石膏板找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面单层石膏板找平', 'qmdcsgbzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面单层石膏板找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面单层石膏板找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面单层石膏板找平', '', 'qmdcsgbzp', 70000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴石膏板→表面自攻钉加固。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙面OSB基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面OSB基层', 'qmosbjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面OSB基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面OSB基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面OSB基层', '', 'qmosbjc', 230000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 350, '张', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB基层 | 规格:宽度≤240mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB基层', 'osbjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB基层', '宽度≤240mm', 'osbjckd≤240mm', 120000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤240mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤240mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB基层 | 规格:240mm＜宽度≤400mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB基层', 'osbjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB基层', '240mm＜宽度≤400mm', 'osbjc240mm＜kd≤400mm', 150000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '240mm＜宽度≤400mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '240mm＜宽度≤400mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB方柱基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB方柱基层', 'osbfzjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB方柱基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB方柱基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB方柱基层', '', 'osbfzjc', 400000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。3.说明：限直径500mm以内。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 680, '张', 680, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== OSB圆柱基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT 'OSB圆柱基层', 'osbyzjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = 'OSB圆柱基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = 'OSB圆柱基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, 'OSB圆柱基层', '', 'osbyzjc', 550000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。3.说明：限直径500mm以内。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 界面剂涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '界面剂涂刷', 'jmjts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '界面剂涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '界面剂涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '界面剂涂刷', '', 'jmjts', 4000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：人工基层清理→界面剂稀释与搅拌→涂刷界面剂一遍→涂刷边角→养护。 2.乙供：界面剂、辅料及人工。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '界面剂', 1654, '升', 90, '升', 90, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1654);

-- ======== 石膏找平 | 规格:平层 (拆分自:石膏找平（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏找平', 'sgzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏找平', '平层', 'sgzppc', 28500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：墙面开槽回填→开槽处及原墙面可见裂缝抗裂处理→石膏搅拌→石膏填充刮平。 2.乙供：石膏、玻璃纤维网、牛皮纸等辅料、人工及机械。 3.说明：找平厚度超过25mm应加贴玻纤网格布，费用另计，套用墙面挂网防裂处理定额；适用范围：石膏墙面。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减；石膏板吊棚处不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 12500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 12500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏', 1638, '袋', 230, '袋', 230, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1638);

-- ======== 石膏找平 | 规格:非平层 (拆分自:石膏找平（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏找平', 'sgzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏找平', '非平层', 'sgzpfpc', 29500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：墙面开槽回填→开槽处及原墙面可见裂缝抗裂处理→石膏搅拌→石膏填充刮平。 2.乙供：石膏、玻璃纤维网、牛皮纸等辅料、人工及机械。 3.说明：找平厚度超过25mm应加贴玻纤网格布，费用另计，套用墙面挂网防裂处理定额；适用范围：石膏墙面。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减；石膏板吊棚处不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 13500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 13500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏', 1638, '袋', 250, '袋', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1638);

-- ======== 毛坯墙石膏找平 | 规格:平层 (拆分自:毛坯墙石膏找平（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '毛坯墙石膏找平', 'mpqsgzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '毛坯墙石膏找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '毛坯墙石膏找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '毛坯墙石膏找平', '平层', 'mpqsgzppc', 36500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：墙面开槽回填→开槽处及原墙面可见裂缝抗裂处理→石膏搅拌→石膏填充刮平。2.乙供：石膏、玻璃纤维网、牛皮纸等辅料、人工及机械。 3.说明：找平厚度超过25mm应加贴玻纤网格布，费用另计，套用墙面挂网防裂处理定额；适用范围：毛坯墙面、捣制墙面。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减；石膏板吊棚处不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 12500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 12500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏', 1638, '袋', 230, '袋', 230, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1638);

-- ======== 毛坯墙石膏找平 | 规格:非平层 (拆分自:毛坯墙石膏找平（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '毛坯墙石膏找平', 'mpqsgzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '毛坯墙石膏找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '毛坯墙石膏找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '毛坯墙石膏找平', '非平层', 'mpqsgzpfpc', 37500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：墙面开槽回填→开槽处及原墙面可见裂缝抗裂处理→石膏搅拌→石膏填充刮平。2.乙供：石膏、玻璃纤维网、牛皮纸等辅料、人工及机械。 3.说明：找平厚度超过25mm应加贴玻纤网格布，费用另计，套用墙面挂网防裂处理定额；适用范围：毛坯墙面、捣制墙面。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减；石膏板吊棚处不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 13500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 13500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏', 1638, '袋', 250, '袋', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1638);

-- ======== 增加斜面石膏找平人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加斜面石膏找平人工费', 'zjxmsgzprgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加斜面石膏找平人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加斜面石膏找平人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加斜面石膏找平人工费', '', 'zjxmsgzprgf', 40000, 0, '', 0, 1, 47, '1.乙供：人工。 2.说明：适用于斜屋面及斜面吊棚人工费补差。\n1.计算规则：按平方米计算。\n2.说明：正常收取石膏找平，斜面增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 20000);

-- ======== 增加楼梯石膏找平人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加楼梯石膏找平人工费', 'zjltsgzprgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加楼梯石膏找平人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加楼梯石膏找平人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加楼梯石膏找平人工费', '', 'zjltsgzprgf', 400000, 0, '', 0, 1, 12, '1.乙供：人工。 2.说明：适用于楼梯石膏找平处理人工费补差。\n1.计算规则：按项计算。\n2.说明：按每套楼梯收费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 400000);

-- ======== 阴阳角修直 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阴阳角修直', 'yyjxz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阴阳角修直');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阴阳角修直' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阴阳角修直', '', 'yyjxz', 3500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：墙体阳角处水平仪精准定位→石膏涂抹粘结→阳角PVC护角条安装→清理与修正；墙体阴角处水平仪精准定位→石膏涂抹粘结→人工阴角处理→清理与修正。2.乙供：PVC角条、辅料及人工。3.说明：阴阳角横平竖直误差≤3mm。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 腻子批刮 | 规格:平层 (拆分自:腻子批刮（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '腻子批刮', 'nzpg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '腻子批刮');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '腻子批刮' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '腻子批刮', '平层', 'nzpgpc', 23000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：基层检测→腻子批刮第一遍→腻子批刮第二遍。2.乙供：腻子、辅料、人工及机械。3.说明：石膏板接缝处石膏填充,表面压纸绷带。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 14500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 14500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '腻子粉', 1650, '袋', 30, '袋', 30, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1650);

-- ======== 腻子批刮 | 规格:非平层 (拆分自:腻子批刮（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '腻子批刮', 'nzpg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '腻子批刮');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '腻子批刮' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '腻子批刮', '非平层', 'nzpgfpc', 24000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：基层检测→腻子批刮第一遍→腻子批刮第二遍。2.乙供：腻子、辅料、人工及机械。3.说明：石膏板接缝处石膏填充,表面压纸绷带。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 15500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 15500);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '腻子粉', 1650, '袋', 30, '袋', 30, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1650);

-- ======== 耐水腻子批刮 | 规格:平层 (拆分自:耐水腻子批刮（平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '耐水腻子批刮', 'nsnzpg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '耐水腻子批刮');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '耐水腻子批刮' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '耐水腻子批刮', '平层', 'nsnzpgpc', 25000, 0, '', 0, 1, 47, '1.工艺：基层检测→耐水腻子批刮第一遍→耐水腻子批刮第二遍。2.乙供：耐水腻子、辅料、人工及机械。3.说明：厨房及卫生间做石膏板吊棚必收；石膏板接缝处石膏填充,表面压纸绷带。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 14000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 14000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '腻子粉', 1650, '袋', 30, '袋', 30, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1650);

-- ======== 耐水腻子批刮 | 规格:非平层 (拆分自:耐水腻子批刮（非平层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '耐水腻子批刮', 'nsnzpg', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '耐水腻子批刮');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '耐水腻子批刮' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '耐水腻子批刮', '非平层', 'nsnzpgfpc', 26000, 0, '', 0, 1, 47, '1.工艺：基层检测→耐水腻子批刮第一遍→耐水腻子批刮第二遍。2.乙供：耐水腻子、辅料、人工及机械。3.说明：厨房及卫生间做石膏板吊棚必收；石膏板接缝处石膏填充,表面压纸绷带。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 13000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 13000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '腻子粉', 1650, '袋', 30, '袋', 30, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1650);

-- ======== 腻子打磨处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '腻子打磨处理', 'nzdmcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '腻子打磨处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '腻子打磨处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '腻子打磨处理', '', 'nzdmcl', 2000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 0, 1, 47, '1.工艺：持照明灯具用砂纸打磨墙棚表面→边角打磨处理→表面光滑平整。2.乙供：砂纸、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 1000);

-- ======== 底漆涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '底漆涂刷', 'dqts', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '底漆涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '底漆涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '底漆涂刷', '', 'dqts', 7500, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 4, 1, 47, '1.基层处理→稀释底漆→喷涂或滚涂一遍。2.乙供：底漆、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 墙面生态环保内墙漆 | 规格:蛋壳光 (拆分自:墙面生态环保内墙漆（蛋壳光）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面生态环保内墙漆', 'qmsthbnqq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面生态环保内墙漆');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面生态环保内墙漆' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面生态环保内墙漆', '蛋壳光', 'qmsthbnqqdkg', 19300, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2', 0, 1, 47, '1.工艺：基层检查→内墙漆涂刷第一遍→内墙漆涂刷第二遍。2.乙供：内墙漆、人工及机械。3.说明：墙面滚涂两遍蛋壳光面漆；报价限白色及浅色，如需调深色内墙漆费用另计。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '蛋壳光');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '蛋壳光' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '乳胶漆', 1655, '升', 250, '升', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1655);

-- ======== 增加深色生态环保内墙漆 | 规格:蛋壳光 (拆分自:增加深色生态环保内墙漆（蛋壳光）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加深色生态环保内墙漆', 'zjsssthbnqq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加深色生态环保内墙漆');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加深色生态环保内墙漆' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加深色生态环保内墙漆', '蛋壳光', 'zjsssthbnqqdkg', 40000, 0, '', 0, 1, 47, '1.乙供：色浆、分色纸、人工及机械。2.说明：彩色乳胶漆涂刷部位后期不保修；调深色时，应使用调色专用基础漆（原乳胶漆不扣减）；限定一种颜色，如需增加颜色，每增加一种颜色，依次累计增加此项。彩色内墙漆不负责涂面保修。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减；不足15平按15平计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '蛋壳光');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '蛋壳光' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 6000);

-- ======== 防水乳胶漆涂刷 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '防水乳胶漆涂刷', 'fsrjqts', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '防水乳胶漆涂刷');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '防水乳胶漆涂刷' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '防水乳胶漆涂刷', '', 'fsrjqts', 38000, 0, '', 0, 1, 47, '1.工艺：基层检查→表面浮灰清理→乳胶漆涂刷第一遍→乳胶漆涂刷第二遍。2.乙供：防水乳胶漆、人工及机械。3.说明：厨房及卫生间做石膏板吊棚必收。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 1000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '乳胶漆', 1655, '升', 250, '升', 250, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1655);

-- ======== 乳胶漆涂刷人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '乳胶漆涂刷人工费', 'rjqtsrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '乳胶漆涂刷人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '乳胶漆涂刷人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '乳胶漆涂刷人工费', '', 'rjqtsrgf', 9800, 0, '', 0, 1, 47, '1.乙供：人工及机械。2.甲供：乳胶漆及辅料。3.说明：适用于甲供乳胶漆。\n1.计算规则：按平方米计算。\n2.说明：门窗面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 1000);

-- ======== 欧式石膏罗马柱安装人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '欧式石膏罗马柱安装人工费', 'ossglmzazrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '欧式石膏罗马柱安装人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '欧式石膏罗马柱安装人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '欧式石膏罗马柱安装人工费', '', 'ossglmzazrgf', 260000, 0, '', 0, 1, 12, '1.乙供：人工及机械。2.甲供：罗马柱。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 200000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);

-- ======== 欧式石膏柱头安装人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '欧式石膏柱头安装人工费', 'ossgztazrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '欧式石膏柱头安装人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '欧式石膏柱头安装人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '欧式石膏柱头安装人工费', '', 'ossgztazrgf', 180000, 0, '', 0, 1, 12, '1.乙供：人工及机械。2.甲供：罗马柱头。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 50000);

-- ======== 墙面阳角倒圆角 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面阳角倒圆角', 'qmyjdyj', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面阳角倒圆角');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面阳角倒圆角' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面阳角倒圆角', '', 'qmyjdyj', 55000, 0, '', 0, 1, 1, '1.工艺：阳角两侧放线→无齿锯切割阳角→阳角处石膏找平→石膏倒圆弧角处理。2.乙供：倒圆辅料、人工及机械。3.说明：倒圆弧角半径＞30mm。\n1.计算规则：按米计算。\n2.说明：不足1米按1米计费。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 10000);

-- ======== 阳台保温墙面处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '阳台保温墙面处理', 'ytbwqmcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '阳台保温墙面处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '阳台保温墙面处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '阳台保温墙面处理', '', 'ytbwqmcl', 70000, 0, '', 0, 1, 47, '1.工艺：石膏找平处满贴抗裂网格→拼接处重叠→石膏粘贴。2.乙供：玻璃纤维网、人工及机械。3.说明：适用于外扩阳台保温未拆除。\n1.计算规则：按平方米计算。\n2.说明：门窗面积不扣除。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 60mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:60mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '60mm墙体砌筑抹灰', '60mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '60mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '60mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '60mm墙体砌筑抹灰', '无辅料', '60mmqtqzmhwfl', 140000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 60000);

-- ======== 120mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:120mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '120mm墙体砌筑抹灰', '120mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '120mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '120mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '120mm墙体砌筑抹灰', '无辅料', '120mmqtqzmhwfl', 234000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 80000);

-- ======== 240mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:240mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '240mm墙体砌筑抹灰', '240mmqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '240mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '240mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '240mm墙体砌筑抹灰', '无辅料', '240mmqtqzmhwfl', 302000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 150000);

-- ======== 增加异形墙体砌筑抹灰 | 规格:无辅料 (拆分自:增加异形墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加异形墙体砌筑抹灰', 'zjyxqtqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加异形墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加异形墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加异形墙体砌筑抹灰', '无辅料', 'zjyxqtqzmhwfl', 30000, 0, '', 0, 1, 47, '1.工艺：增加异形墙体砌筑抹灰的材料和人工费。2.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在墙体砌筑抹灰基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 300000);

-- ======== 墙体抹灰找平 | 规格:无辅料 (拆分自:墙体抹灰找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙体抹灰找平', 'qtmhzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙体抹灰找平', '无辅料', 'qtmhzpwfl', 20000, 0, '', 0, 1, 47, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于原墙面瓷砖或阳台保温或墙面空鼓拆除后抹灰。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 墙体抹灰找平 | 规格:规方冲筋 无辅料 (拆分自:墙体抹灰找平（规方冲筋 无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙体抹灰找平', 'qtmhzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙体抹灰找平', '规方冲筋 无辅料', 'qtmhzpgfcj wfl', 17000, 0, '', 0, 1, 47, '1.工艺：规方放线→水泥砂浆搅拌→墙面浇水湿润→冲筋打点→抹灰→表面收平→养护。 2.乙供：人工费机械。 3.说明：适用于贴砖前墙面归方找平。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '规方冲筋 无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '规方冲筋 无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 20000);

-- ======== 门口或窗口处抹灰找平 | 规格:无辅料 (拆分自:门口或窗口处抹灰找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '门口或窗口处抹灰找平', 'mkhckcmhzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '门口或窗口处抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '门口或窗口处抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '门口或窗口处抹灰找平', '无辅料', 'mkhckcmhzpwfl', 27000, 0, '', 0, 0, 1, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于墙体拆除后抹灰、窗口抹灰，不含厨房、卫生间窗口。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 16000);

-- ======== 厨房排烟管道挂网抹灰处理 | 规格:无辅料 (拆分自:厨房排烟管道挂网抹灰处理（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '厨房排烟管道挂网抹灰处理', 'cfpygdgwmhcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '厨房排烟管道挂网抹灰处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '厨房排烟管道挂网抹灰处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '厨房排烟管道挂网抹灰处理', '无辅料', 'cfpygdgwmhclwfl', 120000, 0, '', 0, 1, 12, '1.工艺：墙面清理→水泥砂浆搅拌→挂铁丝网→抹灰→表面收平→烟道口套管安装→逆止阀口瓷砖铺贴→安装逆止阀。2.乙供：铁丝网、逆止阀、人工及机械。3.说明：方林装饰提供固定尺寸厨房逆止阀，如甲方有特殊需求，请自行购买。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);

-- ======== 卫生间排风管道挂网抹灰处理 | 规格:无辅料 (拆分自:卫生间排风管道挂网抹灰处理（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '卫生间排风管道挂网抹灰处理', 'wsjpfgdgwmhcl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '卫生间排风管道挂网抹灰处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '卫生间排风管道挂网抹灰处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '卫生间排风管道挂网抹灰处理', '无辅料', 'wsjpfgdgwmhclwfl', 120000, 0, '', 0, 1, 12, '1.工艺：墙面清理→水泥砂浆搅拌→挂铁丝网→抹灰→表面收平→排风口套管安装→逆止阀口瓷砖铺贴→安装逆止阀。2.乙供：铁丝网、逆止阀、人工及机械。3.说明：方林装饰提供固定尺寸卫生间逆止阀，如甲方有特殊需求，请自行购买。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);

-- ======== 排水立杠砌筑抹灰 | 规格:单管 无辅料 (拆分自:排水立杠砌筑抹灰（单管 无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '排水立杠砌筑抹灰', 'pslgqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '排水立杠砌筑抹灰', '单管 无辅料', 'pslgqzmhdg wfl', 225000, 0, '1', 0, 1, 12, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→检修口保护套管安装→挂铁丝网→抹灰→表面收平→养护。 2.乙供：铁丝网、人工及机械。3.说明：不含成品检修口。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单管 无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单管 无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 1059, '项', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 1059 AND salary = 80000);

-- ======== 排水立杠砌筑抹灰 | 规格:双管 无辅料 (拆分自:排水立杠砌筑抹灰（双管 无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '排水立杠砌筑抹灰', 'pslgqzmh', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '排水立杠砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '排水立杠砌筑抹灰', '双管 无辅料', 'pslgqzmhsg wfl', 270000, 0, '1', 0, 1, 12, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→检修口保护套管安装→挂铁丝网→抹灰→表面收平→养护。 2.乙供：铁丝网、人工及机械。3.说明：不含成品检修口。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '双管 无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '双管 无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 1059, '项', 1000, 120000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 1059 AND salary = 120000);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:100*100 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '100*100', 'qmczpt（wfl）100*100', 290000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '100*100' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 163000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 163000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:80*120 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '80*120', 'qmczpt（wfl）80*120', 290000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '80*120');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '80*120' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 163000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 163000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:150*150 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '150*150', 'qmczpt（wfl）150*150', 240000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*150');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '150*150' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 113000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 113000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:60*240 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '60*240', 'qmczpt（wfl）60*240', 240000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '60*240');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '60*240' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 113000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 113000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:200*200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '200*200', 'qmczpt（wfl）200*200', 113000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200*200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 84000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 84000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:300*600 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '300*600', 'qmczpt（wfl）300*600', 112000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*600');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '300*600' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 68000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 68000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:400*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '400*800', 'qmczpt（wfl）400*800', 117000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '400*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 73000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 73000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:450*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '450*900', 'qmczpt（wfl）450*900', 117000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '450*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '450*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 73000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 73000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:800*800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '800*800', 'qmczpt（wfl）800*800', 125000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:900*900 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '900*900', 'qmczpt（wfl）900*900', 125000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*900' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:600*1200 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '600*1200', 'qmczpt（wfl）600*1200', 125000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1200' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 81000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 81000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:600*1350 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '600*1350', 'qmczpt（wfl）600*1350', 183000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1350');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '600*1350' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 86000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 86000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:800*1350 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '800*1350', 'qmczpt（wfl）800*1350', 190000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1350');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800*1350' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 93000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 93000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:750*1500 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '750*1500', 'qmczpt（wfl）750*1500', 190000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '750*1500' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 93000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 93000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:900*1800 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '900*1800', 'qmczpt（wfl）900*1800', 204000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '900*1800' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 107000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 107000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面瓷砖铺贴（无辅料） | 规格:1200*2400 ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面瓷砖铺贴（无辅料）', 'qmczpt（wfl）', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面瓷砖铺贴（无辅料）' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面瓷砖铺贴（无辅料）', '1200*2400', 'qmczpt（wfl）1200*2400', 260000, 0, '周长*举架-周长*1/5-洞面/2-窗面/2', 0, 1, 47, '1.工艺：测量→瓷砖预排→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。 2.乙供：瓷砖粘合剂、人工及机械。 3.甲供：瓷砖、定位卡（调平器）。 4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。\n2.说明：如多规格组合铺贴，则按最小周长瓷砖定额报价，并增加多规格组合铺人工费项目。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '1200*2400' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 127000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 127000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '瓷砖背胶', 1644, '桶', 16, '桶', 16, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1644);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '胶泥', 1639, '袋', 600, '袋', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1639);

-- ======== 墙面六边形瓷砖铺设 | 规格:无辅料 (拆分自:墙面六边形瓷砖铺设（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面六边形瓷砖铺设', 'qmlbxczps', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面六边形瓷砖铺设');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面六边形瓷砖铺设' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面六边形瓷砖铺设', '无辅料', 'qmlbxczpswfl', 295000, 0, '', 0, 1, 47, '1.工艺：测量→瓷砖预排→水泥砂浆规方找平→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。2.乙供：瓷砖粘合剂、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 101000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 101000);

-- ======== 墙面条形砖铺贴 | 规格:无辅料 (拆分自:墙面条形砖铺贴（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面条形砖铺贴', 'qmtxzpt', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面条形砖铺贴');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面条形砖铺贴' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面条形砖铺贴', '无辅料', 'qmtxzptwfl', 127000, 0, '', 0, 1, 47, '1.工艺：测量→瓷砖预排→水泥砂浆规方找平→人工清理瓷砖背面→瓷砖粘合剂搅拌→批刮粘合剂→瓷砖粘贴→养护。2.乙供：瓷砖粘合剂、人工及机械。3.甲供：瓷砖、定位卡（调平器）。4.说明：不包含斜面拼贴、拼花、圆柱、曲面（弧形）粘贴等费用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 80000);

-- ======== 超优-60mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-60mm墙体砌筑抹灰', 'cy-60mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-60mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-60mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-60mm墙体砌筑抹灰', '', 'cy-60mmqtqzmh', 180000, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 60000);

-- ======== 超优-120mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-120mm墙体砌筑抹灰', 'cy-120mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-120mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-120mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-120mm墙体砌筑抹灰', '', 'cy-120mmqtqzmh', 198800, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 80000);

-- ======== 超优-240mm墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-240mm墙体砌筑抹灰', 'cy-240mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-240mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-240mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-240mm墙体砌筑抹灰', '', 'cy-240mmqtqzmh', 325500, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 150000);

-- ======== 超优-增加异形墙体砌筑抹灰 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-增加异形墙体砌筑抹灰', 'cy-zjyxqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-增加异形墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-增加异形墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-增加异形墙体砌筑抹灰', '', 'cy-zjyxqtqzmh', 30000, 0, '', 1, 0, 47, '1.工艺：增加异形墙体砌筑抹灰的材料和人工费。2.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在墙体砌筑抹灰基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 300000);

-- ======== 超优-墙体抹灰找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-墙体抹灰找平', 'cy-qtmhzp', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-墙体抹灰找平', '', 'cy-qtmhzp', 15500, 0, '', 1, 0, 47, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于原墙面瓷砖或阳台保温或墙面空鼓拆除后抹灰。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 超优-门口或窗口处抹灰找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-门口或窗口处抹灰找平', 'cy-mkhckcmhzp', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-门口或窗口处抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-门口或窗口处抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-门口或窗口处抹灰找平', '', 'cy-mkhckcmhzp', 30900, 0, '', 1, 0, 1, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于墙体拆除后抹灰、窗口抹灰，不含厨房、卫生间窗口。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 16000);

-- ======== 超优-墙面OSB基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-墙面OSB基层', 'cy-qmosbjc', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-墙面OSB基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-墙面OSB基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-墙面OSB基层', '', 'cy-qmosbjc', 154500, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→发泡剂填充→OSB基层安装。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 350, '张', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 超优-60mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:超优-60mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-60mm墙体砌筑抹灰', 'cy-60mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-60mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-60mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-60mm墙体砌筑抹灰', '无辅料', 'cy-60mmqtqzmhwfl', 108600, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 60000);

-- ======== 超优-120mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:超优-120mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-120mm墙体砌筑抹灰', 'cy-120mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-120mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-120mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-120mm墙体砌筑抹灰', '无辅料', 'cy-120mmqtqzmhwfl', 160200, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 80000);

-- ======== 超优-240mm墙体砌筑抹灰 | 规格:无辅料 (拆分自:超优-240mm墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-240mm墙体砌筑抹灰', 'cy-240mmqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-240mm墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-240mm墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-240mm墙体砌筑抹灰', '无辅料', 'cy-240mmqtqzmhwfl', 250800, 0, '', 1, 0, 47, '1.工艺：人工测量定位→弹线→水泥砂浆搅拌→实心砖砌筑→抹灰→表面收平→养护。2.乙供：人工及机械。3.说明：已包含墙体抹灰找平；原墙抹灰层开槽，非捣制墙体采用马牙槎结构，捣制墙体植筋处理。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 150000);

-- ======== 超优-增加异形墙体砌筑抹灰 | 规格:无辅料 (拆分自:超优-增加异形墙体砌筑抹灰（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-增加异形墙体砌筑抹灰', 'cy-zjyxqtqzmh', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-增加异形墙体砌筑抹灰');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-增加异形墙体砌筑抹灰' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-增加异形墙体砌筑抹灰', '无辅料', 'cy-zjyxqtqzmhwfl', 30000, 0, '', 1, 0, 47, '1.工艺：增加异形墙体砌筑抹灰的材料和人工费。2.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：在墙体砌筑抹灰基础上增加此项。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 181, '平米', 1000, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 181 AND salary = 300000);

-- ======== 超优-墙体抹灰找平 | 规格:无辅料 (拆分自:超优-墙体抹灰找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-墙体抹灰找平', 'cy-qtmhzp', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-墙体抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-墙体抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-墙体抹灰找平', '无辅料', 'cy-qtmhzpwfl', 15500, 0, '', 1, 0, 47, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于原墙面瓷砖或阳台保温或墙面空鼓拆除后抹灰。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 10000);

-- ======== 超优-门口或窗口处抹灰找平 | 规格:无辅料 (拆分自:超优-门口或窗口处抹灰找平（无辅料）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-门口或窗口处抹灰找平', 'cy-mkhckcmhzp', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-门口或窗口处抹灰找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-门口或窗口处抹灰找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-门口或窗口处抹灰找平', '无辅料', 'cy-mkhckcmhzpwfl', 22700, 0, '', 1, 0, 1, '1.工艺：水泥砂浆搅拌→墙面浇水湿润→抹灰→表面收平→养护。 2.乙供：人工费机械。3.说明：适用于墙体拆除后抹灰、窗口抹灰，不含厨房、卫生间窗口。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无辅料' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '米', 1000, 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 16000);

-- ======== 单处石膏板吊平棚 | 规格:高度≤200mm ========
SET @qcid = 480; -- A类复用既有ctem
SET @qfid = 489; -- A类复用既有format
UPDATE quotation.quotationformat SET price = 300000, cost = 0, formula = '', type = 0, discount = 1, unit = 12, comment = '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于平棚和斜面吊平棚，面积≤2平方米。\n1.计算规则：按项计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', pinyin = 'dcsgbdppgd≤200mm' WHERE qfid = 489 AND price = 0;
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 870, '张', 870, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 单处石膏板吊平棚 | 规格:高度＞200mm ========
SET @qcid = 480; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '单处石膏板吊平棚', '高度＞200mm', 'dcsgbdppgd＞200mm', 400000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于平棚和斜面吊平棚，面积≤2平方米。\n1.计算规则：按项计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 870, '张', 870, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 单处石膏板曲线吊平棚 | 规格:高度≤200mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '单处石膏板曲线吊平棚', 'dcsgbqxdpp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '单处石膏板曲线吊平棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '单处石膏板曲线吊平棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '单处石膏板曲线吊平棚', '高度≤200mm', 'dcsgbqxdppgd≤200mm', 600000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于弧形、正圆及椭圆造型吊棚，面积≤2平方米。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 180000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 180000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 单处石膏板曲线吊平棚 | 规格:高度＞200mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '单处石膏板曲线吊平棚', 'dcsgbqxdpp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '单处石膏板曲线吊平棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '单处石膏板曲线吊平棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '单处石膏板曲线吊平棚', '高度＞200mm', 'dcsgbqxdppgd＞200mm', 800000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于弧形、正圆及椭圆造型吊棚，面积≤2平方米。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 180000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 180000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 1000, '张', 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 石膏板吊平棚 | 规格:高度≤200mm ========
SET @qcid = 446; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊平棚', '高度≤200mm', 'sgbdppgd≤200mm', 152000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 43000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 43000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊平棚 | 规格:200＜高度≤500mm ========
SET @qcid = 446; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊平棚', '200＜高度≤500mm', 'sgbdpp200＜gd≤500mm', 182000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200＜高度≤500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200＜高度≤500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 43000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 43000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊平棚 | 规格:500＜高度≤1000mm ========
SET @qcid = 446; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊平棚', '500＜高度≤1000mm', 'sgbdpp500＜gd≤1000mm', 205000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '500＜高度≤1000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '500＜高度≤1000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 43000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 43000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊平棚 | 规格:高度＞1000mm ========
SET @qcid = 446; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊平棚', '高度＞1000mm', 'sgbdppgd＞1000mm', 345000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：坡屋顶吊平棚高度以平均高度计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞1000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞1000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 43000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 43000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加OSB吊棚基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加OSB吊棚基层', 'zjosbdpjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加OSB吊棚基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加OSB吊棚基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加OSB吊棚基层', '', 'zjosbdpjc', 100000, 0, '', 0, 1, 47, '1.工艺：在石膏板罩面内部增加一层OSB加固。2.乙供：OSB、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加平棚曲线造型 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加平棚曲线造型', 'zjppqxzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加平棚曲线造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加平棚曲线造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加平棚曲线造型', '', 'zjppqxzx', 119000, 0, '', 0, 1, 47, '1.工艺：按设计要求放样，增加平棚曲线造型的材料及人工费。2.乙供：OSB、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 10000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加曲线棚角倒圆角 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加曲线棚角倒圆角', 'zjqxpjdyj', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加曲线棚角倒圆角');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加曲线棚角倒圆角' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加曲线棚角倒圆角', '', 'zjqxpjdyj', 280000, 0, '', 0, 1, 1, '1.工艺：按设计要求放样，增加曲线造型棚角倒弧角的材料及人工费。2.乙供：OSB、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加吊斜面棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加吊斜面棚', 'zjdxmp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加吊斜面棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加吊斜面棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加吊斜面棚', '', 'zjdxmp', 58000, 0, '', 0, 1, 47, '1.乙供：人工及机械。2.说明：适用于延斜面吊棚和原平顶吊斜面棚。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);

-- ======== 增加不规则吊平棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加不规则吊平棚', 'zjbgzdpp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加不规则吊平棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加不规则吊平棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加不规则吊平棚', '', 'zjbgzdpp', 30000, 0, '', 0, 1, 47, '1.乙供：人工及机械。\n1.计算规则：按平方米计算。\n2.说明：按吊棚实际面积收取。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);

-- ======== 增加弧形棚角造型 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加弧形棚角造型', 'zjhxpjzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加弧形棚角造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加弧形棚角造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加弧形棚角造型', '', 'zjhxpjzx', 100000, 0, '', 0, 1, 5, '1.工艺：按设计要求放样，增加平棚弧形棚角的材料及人工费。2.乙供：OSB、人工及机械。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 25000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 120, '张', 120, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加防水石膏板吊平棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加防水石膏板吊平棚', 'zjfssgbdpp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加防水石膏板吊平棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加防水石膏板吊平棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加防水石膏板吊平棚', '', 'zjfssgbdpp', 40000, 0, '', 0, 1, 47, '1.乙供：防水石膏板、人工及机械。2.说明：厨房及卫生间做石膏板吊棚必收。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);

-- ======== 增加双层石膏板吊平棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加双层石膏板吊平棚', 'zjscsgbdpp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加双层石膏板吊平棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加双层石膏板吊平棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加双层石膏板吊平棚', '', 'zjscsgbdpp', 25000, 0, '', 0, 1, 47, '1.乙供：石膏板、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤300mm;高度≤200mm ========
SET @qcid = 447; -- A类复用既有ctem
SET @qfid = 402; -- A类复用既有format
UPDATE quotation.quotationformat SET price = 118000, cost = 0, formula = '', type = 0, discount = 1, unit = 1, comment = '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', pinyin = 'sgbdbppmkd≤300mm;gd≤200mm' WHERE qfid = 402 AND price = 0;
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 37000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 37000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤300mm;200mm＜高度≤500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤300mm;200mm＜高度≤500mm', 'sgbdbppmkd≤300mm;200mm＜gd≤500mm', 149000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤300mm;200mm＜高度≤500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤300mm;200mm＜高度≤500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 47000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 47000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 320, '张', 320, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤500mm;高度≤200mm ========
SET @qcid = 447; -- A类复用既有ctem
SET @qfid = 410; -- A类复用既有format
UPDATE quotation.quotationformat SET price = 130000, cost = 0, formula = '', type = 0, discount = 1, unit = 1, comment = '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', pinyin = 'sgbdbppmkd≤500mm;gd≤200mm' WHERE qfid = 410 AND price = 0;
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 42000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 42000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 280, '张', 280, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤500mm;200mm＜高度≤500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤500mm;200mm＜高度≤500mm', 'sgbdbppmkd≤500mm;200mm＜gd≤500mm', 164000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤500mm;200mm＜高度≤500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤500mm;200mm＜高度≤500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 52000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 52000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤700mm;高度≤200mm ========
SET @qcid = 447; -- A类复用既有ctem
SET @qfid = 420; -- A类复用既有format
UPDATE quotation.quotationformat SET price = 163000, cost = 0, formula = '', type = 0, discount = 1, unit = 1, comment = '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', pinyin = 'sgbdbppmkd≤700mm;gd≤200mm' WHERE qfid = 420 AND price = 0;
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 52000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 52000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 360, '张', 360, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板吊边棚 | 规格:棚面宽度≤700mm;200mm＜高度≤500mm ========
SET @qcid = 447; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板吊边棚', '棚面宽度≤700mm;200mm＜高度≤500mm', 'sgbdbppmkd≤700mm;200mm＜gd≤500mm', 206000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→轻钢龙骨安装→筒灯布线→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：衣柜上封板也适用此项定额。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤700mm;200mm＜高度≤500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '棚面宽度≤700mm;200mm＜高度≤500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 62000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 62000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 480, '张', 480, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板立边斜面吊边棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板立边斜面吊边棚', 'zjsgblbxmdbp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板立边斜面吊边棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板立边斜面吊边棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板立边斜面吊边棚', '', 'zjsgblbxmdbp', 134000, 0, '', 0, 1, 1, '1.工艺：按设计要求放样，增加轻钢龙骨的材料及人工费。2.乙供：本子目需要的材料、人工及机械。 3。说明：斜面宽度≤700mm。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 50, '张', 50, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板立边弧面吊边棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板立边弧面吊边棚', 'zjsgblbhmdbp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板立边弧面吊边棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板立边弧面吊边棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板立边弧面吊边棚', '', 'zjsgblbhmdbp', 234000, 0, '', 0, 1, 1, '1.工艺：按设计要求放样，增加轻钢龙骨或OSB造型的材料及人工费。2.乙供：本子目需要的材料、人工及机械。 3。说明：斜面宽度≤700mm。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加边棚曲线造型 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加边棚曲线造型', 'zjbpqxzx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加边棚曲线造型');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加边棚曲线造型' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加边棚曲线造型', '', 'zjbpqxzx', 75000, 0, '', 0, 1, 1, '1.工艺：按设计要求放样，增加轻钢龙骨或OSB造型的材料及人工费。2.乙供：OSB、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 120, '张', 120, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加边棚倒角 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加边棚倒角', 'zjbpdj', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加边棚倒角');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加边棚倒角' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加边棚倒角', '', 'zjbpdj', 60000, 0, '', 0, 1, 1, '1.乙供：人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 增加OSB吊边棚基层 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加OSB吊边棚基层', 'zjosbdbpjc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加OSB吊边棚基层');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加OSB吊边棚基层' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加OSB吊边棚基层', '', 'zjosbdbpjc', 80000, 0, '', 0, 1, 1, '1.工艺：在石膏板罩面内部增加一层OSB加固。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加防水石膏板吊边棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加防水石膏板吊边棚', 'zjfssgbdbp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加防水石膏板吊边棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加防水石膏板吊边棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加防水石膏板吊边棚', '', 'zjfssgbdbp', 40000, 0, '', 0, 1, 1, '1.乙供：防水石膏板、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 增加双层石膏板吊边棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加双层石膏板吊边棚', 'zjscsgbdbp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加双层石膏板吊边棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加双层石膏板吊边棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加双层石膏板吊边棚', '', 'zjscsgbdbp', 12000, 0, '', 0, 1, 1, '1.乙供：石膏板、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板内返虚光灯槽 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板内返虚光灯槽', 'zjsgbnfxgdc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板内返虚光灯槽');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板内返虚光灯槽' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板内返虚光灯槽', '', 'zjsgbnfxgdc', 35000, 0, '', 0, 1, 1, '1.工艺：增加石膏板内返虚光灯槽的材料及人工费。 2.乙供：本子目需要的材料、人工及机械。3.甲供：虚光灯带。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 120, '张', 120, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板外返虚光灯槽 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板外返虚光灯槽', 'zjsgbwfxgdc', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板外返虚光灯槽');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板外返虚光灯槽' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板外返虚光灯槽', '', 'zjsgbwfxgdc', 60000, 0, '', 0, 1, 1, '1.工艺：增加石膏板外返虚光灯槽的材料及人工费。2.乙供：本子目需要的材料、人工及机械。3.甲供：虚光灯带。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 10000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 120, '张', 120, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加线性灯灯槽安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加线性灯灯槽安装', 'zjxxddcaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加线性灯灯槽安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加线性灯灯槽安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加线性灯灯槽安装', '', 'zjxxddcaz', 75000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板抽缝→油工修边→玻璃胶固定型材→灯具安装 2.乙供：本子目需要的材料、人工及机械。3.甲供：型材、灯片、变压器等。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 5000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 增加弧形线性灯灯槽安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加弧形线性灯灯槽安装', 'zjhxxxddcaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加弧形线性灯灯槽安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加弧形线性灯灯槽安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加弧形线性灯灯槽安装', '', 'zjhxxxddcaz', 90000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板抽缝→固定型材→油工修边→灯具安装 2.乙供：本子目需要的材料、人工及机械。3.甲供：型材、灯片、变压器等。4.说明：单根局部弧形，直线段仍按此项收费。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 5000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 增加洗墙灯安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加洗墙灯安装', 'zjxqdaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加洗墙灯安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加洗墙灯安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加洗墙灯安装', '', 'zjxqdaz', 103000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→布线→固定支撑制作→型材安装→灯具安装 2.乙供：本子目需要的材料、人工及机械。3.甲供：型材、灯片、变压器等。4.说明：如使用线性灯型材做洗墙灯按线性灯收费。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 5000);

-- ======== 增加磁吸轨道灯安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加磁吸轨道灯安装', 'zjcxgddaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加磁吸轨道灯安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加磁吸轨道灯安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加磁吸轨道灯安装', '', 'zjcxgddaz', 98000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB衬底→自攻钉固定→灯具安装。2.乙供：本子目需要的材料、人工及机械。3.甲供：型材、灯片、变压器等。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 增加弧形磁吸轨道灯安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加弧形磁吸轨道灯安装', 'zjhxcxgddaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加弧形磁吸轨道灯安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加弧形磁吸轨道灯安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加弧形磁吸轨道灯安装', '', 'zjhxcxgddaz', 110000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB衬底→自攻钉固定→灯具安装。2.乙供：本子目需要的材料、人工及机械。3.甲供：型材、灯片、变压器等。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 增加无边框筒灯开孔及安装 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加无边框筒灯开孔及安装', 'zjwbktdkkjaz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加无边框筒灯开孔及安装');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加无边框筒灯开孔及安装' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加无边框筒灯开孔及安装', '', 'zjwbktdkkjaz', 30000, 0, '', 0, 1, 5, '1.工艺：人工测量定位→弹线→开孔→铣槽→安装筒灯框。 2.乙供：本子目需要的材料、人工及机械。3.甲供：无边框筒灯。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '个', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 10000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 5000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 5000);

-- ======== 增加晾衣架凹槽制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加晾衣架凹槽制作', 'zjlyjaczz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加晾衣架凹槽制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加晾衣架凹槽制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加晾衣架凹槽制作', '', 'zjlyjaczz', 200000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→轻钢龙骨做基层框架（预留功能槽）→OSB做套边或顶板→石膏板罩面安装→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。 3.说明：不含设备安装（甲供）。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 130000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 130000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 200, '张', 200, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加隐形晾衣杆框架制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加隐形晾衣杆框架制作', 'zjyxlygkjzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加隐形晾衣杆框架制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加隐形晾衣杆框架制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加隐形晾衣杆框架制作', '', 'zjyxlygkjzz', 80000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→轻钢龙骨做基层框架（预留功能槽）→OSB做套边→石膏板罩面安装→自攻钉固定。2.乙供：本子目需要的材料、人工及机械。 3.说明：不含设备安装（甲供）。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);

-- ======== 增加电动投影幕布盒制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加电动投影幕布盒制作', 'zjddtymbhzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加电动投影幕布盒制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加电动投影幕布盒制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加电动投影幕布盒制作', '', 'zjddtymbhzz', 140000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→底板电锤打孔加木楔→自攻钉固定→石膏板罩面安装。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 500, '张', 500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加中央空调排风口制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加中央空调排风口制作', 'zjzykdpfkzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加中央空调排风口制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加中央空调排风口制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加中央空调排风口制作', '', 'zjzykdpfkzz', 300000, 0, '', 0, 1, 11, '1.工艺：人工测量定位→弹线→局部OSB或木方做风口套边→安装隐形检修口。2.乙供：本子目需要的材料、人工及机械。3.甲供：中央空调百叶风口及配套设施安装、铝合金隐形检修口。4.说明：风口长度≤1500mm以内；含中央空调回风口及隐形检修口。\n1.计算规则：按套计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '套', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加中央空调弧形排风口制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加中央空调弧形排风口制作', 'zjzykdhxpfkzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加中央空调弧形排风口制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加中央空调弧形排风口制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加中央空调弧形排风口制作', '', 'zjzykdhxpfkzz', 580000, 0, '', 0, 1, 11, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→做风口套边→安装隐形检修口。2.乙供：本子目需要的材料、人工及机械。3.甲供：中央空调百叶风口及配套设施安装、铝合金隐形检修口。4.说明：风口长度≤1500mm以内；含中央空调回风口及隐形检修口。\n1.计算规则：按套计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '套', 1000, 240000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 240000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 增加加长中央空调排风口制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加加长中央空调排风口制作', 'zjjzzykdpfkzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加加长中央空调排风口制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加加长中央空调排风口制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加加长中央空调排风口制作', '', 'zjjzzykdpfkzz', 150000, 0, '', 0, 1, 1, '1.乙供：本子目需要的材料、人工及机械。2.说明：风口长度＞1500mm增加此项，不足一米按一米计算。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加加长中央空调弧形排风口制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加加长中央空调弧形排风口制作', 'zjjzzykdhxpfkzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加加长中央空调弧形排风口制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加加长中央空调弧形排风口制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加加长中央空调弧形排风口制作', '', 'zjjzzykdhxpfkzz', 170000, 0, '', 0, 1, 1, '1.乙供：本子目需要的材料、人工及机械。2.说明：风口长度＞1500mm增加此项，不足一米按一米计算。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 150, '张', 150, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加隐形中央空调排风口制作人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加隐形中央空调排风口制作人工费', 'zjyxzykdpfkzzrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加隐形中央空调排风口制作人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加隐形中央空调排风口制作人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加隐形中央空调排风口制作人工费', '', 'zjyxzykdpfkzzrgf', 120000, 0, '', 0, 1, 11, '1.乙供：人工及机械。2.说明：需要与“增加中央空调排风口制作”项目搭配使用。\n1.计算规则：按套计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '套', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '套', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 100000);

-- ======== 石膏板穹顶造型吊棚 | 规格:(空) ========
SET @qcid = 441; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板穹顶造型吊棚', '', 'sgbqdzxdp', 540000, 0, '', 0, 1, 47, '1.工艺：按设计要求放样→人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按展开面积计算 s=2πrh。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 240000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 240000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 600, '张', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板拱形造型吊棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板拱形造型吊棚', 'sgbgxzxdp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板拱形造型吊棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板拱形造型吊棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板拱形造型吊棚', '', 'sgbgxzxdp', 490000, 0, '', 0, 1, 47, '1.工艺：按设计要求放样→人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：按投影面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 200000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 600, '张', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 石膏板十字穹顶造型吊棚 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板十字穹顶造型吊棚', 'sgbszqdzxdp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板十字穹顶造型吊棚');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板十字穹顶造型吊棚' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板十字穹顶造型吊棚', '', 'sgbszqdzxdp', 640000, 0, '', 0, 1, 47, '1.工艺：按设计要求放样→人工测量定位→弹线→边龙骨安装→吊件安装→膨胀螺栓固定→50轻钢龙骨安装→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：按投影面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 350000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 350000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 400, '张', 400, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 600, '张', 600, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 弧形棚包梁 | 规格:单弧 (拆分自:弧形棚包梁（单弧）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弧形棚包梁', 'hxpbl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弧形棚包梁');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弧形棚包梁' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弧形棚包梁', '单弧', 'hxpbldh', 398000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按单面延长米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单弧');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '单弧' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 100000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 100000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 40000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 240, '张', 240, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 280, '张', 280, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 弧形棚包梁 | 规格:多弧 (拆分自:弧形棚包梁（多弧）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弧形棚包梁', 'hxpbl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弧形棚包梁');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弧形棚包梁' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弧形棚包梁', '多弧', 'hxpbldh', 438000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→石膏板罩面安装→缝隙预留八字角→自攻钉固定→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按单面延长米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '多弧');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '多弧' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 120000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 120000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 60000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 380, '张', 380, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 450, '张', 450, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 窗帘盒制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '窗帘盒制作', 'clhzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '窗帘盒制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '窗帘盒制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '窗帘盒制作', '', 'clhzz', 130000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→两侧墙体开槽→底板电锤打孔加木楔→自攻钉固定→石膏板罩面安装。 2.乙供：本子目需要的材料、人工及机械。3.甲供：窗帘滑道4.说明:含L型窗帘盒转角圆弧处理；含普通滑道安装，电动窗帘滑道由厂家安装。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 360, '张', 360, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 弧形窗帘盒制作 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '弧形窗帘盒制作', 'hxclhzz', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '弧形窗帘盒制作');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '弧形窗帘盒制作' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '弧形窗帘盒制作', '', 'hxclhzz', 158000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→OSB做弧形基础→石膏板折锯微弯→两侧墙体开槽→底板电锤打孔加木楔→自攻钉固定→石膏板罩面安装。 2.乙供：本子目需要的材料、人工及机械。3.甲供：窗帘滑道4.说明:含普通滑道安装，电动窗帘滑道由厂家安装。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 280, '张', 280, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 650, '张', 650, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 窗帘杆安装人工费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '窗帘杆安装人工费', 'clgazrgf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '窗帘杆安装人工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '窗帘杆安装人工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '窗帘杆安装人工费', '', 'clgazrgf', 45000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→电锤开孔加木楔→专用钉固定→窗帘杆安装。2.乙供：本子目需要的材料、人工及机械。3.甲供：窗帘杆或滑道及配件。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);

-- ======== 棚面单层石膏板找平 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面单层石膏板找平', 'pmdcsgbzp', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面单层石膏板找平');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面单层石膏板找平' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面单层石膏板找平', '', 'pmdcsgbzp', 98000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→电锤打孔加木楔打孔→嵌缝石膏粘贴→表面自攻钉加固。2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 35000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 35000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 350, '张', 350, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 棚面保温隔音处理 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面保温隔音处理', 'pmbwgycl', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面保温隔音处理');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面保温隔音处理' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面保温隔音处理', '', 'pmbwgycl', 60000, 0, '', 0, 1, 47, '1.工艺：人工测量定位→弹线→电锤打孔→苯板钉固定保温材料→发泡剂填充。2.乙供：人工及机械。3.甲供：保温材料。4.说明：需要搭配吊棚使用。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);

-- ======== 墙面石膏直板线 | 规格:高度≤200mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面石膏直板线', 'qmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面石膏直板线', '高度≤200mm', 'qmsgzbxgd≤200mm', 36000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 160, '张', 160, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙面石膏直板线 | 规格:200mm＜高度≤300mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面石膏直板线', 'qmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面石膏直板线', '200mm＜高度≤300mm', 'qmsgzbx200mm＜gd≤300mm', 40000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜高度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜高度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 13000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 13000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 240, '张', 240, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 墙面石膏直板线 | 规格:高度＞300mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面石膏直板线', 'qmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面石膏直板线', '高度＞300mm', 'qmsgzbxgd＞300mm', 44000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '高度＞300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 16000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 16000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 320, '张', 320, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 棚面石膏直板线 | 规格:宽度≤200mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面石膏直板线', 'pmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面石膏直板线', '宽度≤200mm', 'pmsgzbxkd≤200mm', 44000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 160, '张', 160, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 棚面石膏直板线 | 规格:200mm＜宽度≤300mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面石膏直板线', 'pmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面石膏直板线', '200mm＜宽度≤300mm', 'pmsgzbx200mm＜kd≤300mm', 48000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 18000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 240, '张', 240, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 棚面石膏直板线 | 规格:宽度＞300mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面石膏直板线', 'pmsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面石膏直板线', '宽度＞300mm', 'pmsgzbxkd＞300mm', 52000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板裁切→嵌缝石膏粘贴→自攻钉固定（石膏板间用白乳胶粘贴）→石膏板接缝处理。 2.乙供：本子目需要的材料、人工及机械。 3.说明：适用于双层直板线，如需增加厚度套用增加石膏直板线项目。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度＞300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度＞300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 23000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 23000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 5000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 320, '张', 320, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加弧形石膏板线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加弧形石膏板线', 'zjhxsgbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加弧形石膏板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加弧形石膏板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加弧形石膏板线', '', 'zjhxsgbx', 48000, 0, '', 0, 1, 1, '1.工艺：按设计要求放样，增加弧形板线的材料及人工费。2.乙供：人工及机械。3.说明：需要搭配标准石膏直板线使用。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);

-- ======== 增加石膏直板线 | 规格:每增加一层 (拆分自:增加石膏直板线（每增加一层）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏直板线', 'zjsgzbx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏直板线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏直板线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏直板线', '每增加一层', 'zjsgzbxmzjyc', 15000, 0, '', 0, 1, 1, '1.乙供：本子目需要的材料、人工及机械。2.说明：每增加一层石膏直板线，依次累计增加此项。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加一层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '每增加一层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 5000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 2000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 100, '张', 100, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板抽缝 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板抽缝', 'zjsgbcf', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板抽缝');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板抽缝' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板抽缝', '', 'zjsgbcf', 30000, 0, '', 0, 1, 1, '1.工艺：增加石膏板抽缝的材料及人工费。2.乙供：石膏板、人工及机械。3.说明：适用于棚面或墙面石膏板表面抽缝。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 5000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 5000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 50, '张', 50, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 增加石膏板抽缝安装金属条 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '增加石膏板抽缝安装金属条', 'zjsgbcfazjst', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '增加石膏板抽缝安装金属条');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '增加石膏板抽缝安装金属条' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '增加石膏板抽缝安装金属条', '', 'zjsgbcfazjst', 55000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→石膏板或直板线抽缝→金属条安装。2.乙供：本子目需要的材料、人工及机械。3.甲供：金属条。4.说明：适用于墙棚面石膏板或直板线抽缝及安装金属条。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏素线 | 规格:宽度≤120mm ========
SET @qcid = 483; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏素线', '宽度≤120mm', 'cpsgsxkd≤120mm', 45000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤120mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤120mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 11000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 11000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏素线 | 规格:120mm＜宽度≤200mm ========
SET @qcid = 483; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏素线', '120mm＜宽度≤200mm', 'cpsgsx120mm＜kd≤200mm', 55000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '120mm＜宽度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '120mm＜宽度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 18000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏素线 | 规格:200mm＜宽度≤300mm ========
SET @qcid = 483; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏素线', '200mm＜宽度≤300mm', 'cpsgsx200mm＜kd≤300mm', 65000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 弧形石膏线 | 规格:特殊订制 (拆分自:弧形石膏线（特殊订制）) ========
SET @qcid = 471; -- A类复用既有ctem
SET @qfid = 760; -- A类复用既有format
UPDATE quotation.quotationformat SET price = 150000, cost = 0, formula = '', type = 0, discount = 1, unit = 1, comment = '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', pinyin = 'hxsgxtsdz' WHERE qfid = 760 AND price = 0;
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏花线 | 规格:宽度≤120mm ========
SET @qcid = 487; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏花线', '宽度≤120mm', 'cpsghxkd≤120mm', 50000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。3.甲供：花线\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤120mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '宽度≤120mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 13000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 13000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏花线 | 规格:120mm＜宽度≤200mm ========
SET @qcid = 487; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏花线', '120mm＜宽度≤200mm', 'cpsghx120mm＜kd≤200mm', 60000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。3.甲供：花线\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '120mm＜宽度≤200mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '120mm＜宽度≤200mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 10000);

-- ======== 成品石膏花线 | 规格:200mm＜宽度≤300mm ========
SET @qcid = 487; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏花线', '200mm＜宽度≤300mm', 'cpsghx200mm＜kd≤300mm', 70000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→木方衬底→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。3.甲供：花线\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200mm＜宽度≤300mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 20000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 20000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 15000);

-- ======== 墙面成品石膏广线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '墙面成品石膏广线', 'qmcpsggx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '墙面成品石膏广线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '墙面成品石膏广线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '墙面成品石膏广线', '', 'qmcpsggx', 30000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 8000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 8000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 棚面成品石膏广线 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面成品石膏广线', 'pmcpsggx', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面成品石膏广线');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面成品石膏广线' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面成品石膏广线', '', 'pmcpsggx', 44000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定。 2.乙供：本子目需要的材料、人工及机械。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 10000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 10000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏线安装及修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏线安装及修补', 'cpsgxazjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏线安装及修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏线安装及修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏线安装及修补', '', 'cpsgxazjxb', 40000, 0, '', 0, 1, 1, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定→石膏刮平→批刮腻子→腻子打磨→表面光滑平整。 2.乙供：本子目需要的材料、人工及机械。3.甲供：石膏线。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '米', 1000, 18000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 18000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏饰花安装及修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏饰花安装及修补', 'cpsgshazjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏饰花安装及修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏饰花安装及修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏饰花安装及修补', '', 'cpsgshazjxb', 120000, 0, '', 0, 1, 5, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定→石膏刮平→批刮腻子→腻子打磨→表面光滑平整。 2.乙供：本子目需要的材料、人工及机械。3.甲供：石膏饰花。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 40000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 40000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 60000);

-- ======== 成品石膏花角安装及修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏花角安装及修补', 'cpsghjazjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏花角安装及修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏花角安装及修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏花角安装及修补', '', 'cpsghjazjxb', 60000, 0, '', 0, 1, 5, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定→石膏刮平→批刮腻子→腻子打磨→表面光滑平整。2.乙供：本子目需要的材料、人工及机械。3.甲供：石膏花角。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '个', 1000, 15000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 15000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 25000);

-- ======== 成品石膏灯盘安装及修补 | 规格:直径≤800mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏灯盘安装及修补', 'cpsgdpazjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏灯盘安装及修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏灯盘安装及修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏灯盘安装及修补', '直径≤800mm', 'cpsgdpazjxbzj≤800mm', 150000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定→石膏刮平→批刮腻子→腻子打磨→表面光滑平整。 2.乙供：本子目需要的材料、人工及机械。3.甲供：石膏灯盘。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '直径≤800mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '直径≤800mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 50000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 50000);

-- ======== 成品石膏灯盘安装及修补 | 规格:800mm＜直径≤1400mm ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏灯盘安装及修补', 'cpsgdpazjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏灯盘安装及修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏灯盘安装及修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏灯盘安装及修补', '800mm＜直径≤1400mm', 'cpsgdpazjxb800mm＜zj≤1400mm', 280000, 0, '', 0, 1, 12, '1.工艺：人工测量定位→弹线→电锤打孔加木楔→嵌缝石膏粘贴→自攻钉固定→石膏刮平→批刮腻子→腻子打磨→表面光滑平整。 2.乙供：本子目需要的材料、人工及机械。3.甲供：石膏灯盘。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800mm＜直径≤1400mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '800mm＜直径≤1400mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 80000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 80000);

-- ======== 成品石膏线修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏线修补', 'cpsgxxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏线修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏线修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏线修补', '', 'cpsgxxb', 20000, 0, '', 0, 1, 1, '1.工艺：石膏刮平→批刮腻子→腻子打磨→表面光滑平整2.乙供：石膏、腻子、人工及机械。3.甲供：石膏线或PU线自行安装。4.说明：适用于甲方自行安装石膏线的修补。\n1.计算规则：按米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '米', 1000, 7000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 7000);

-- ======== 成品石膏饰花修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏饰花修补', 'cpsgshxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏饰花修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏饰花修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏饰花修补', '', 'cpsgshxb', 80000, 0, '', 0, 1, 5, '1.工艺：石膏刮平→批刮腻子→腻子打磨→表面光滑平整。2.乙供：石膏、腻子、人工及机械。3.甲供：石膏饰花自行安装。4.说明：适用于甲方自行安装饰花的修补。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 60000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 60000);

-- ======== 成品石膏花角修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏花角修补', 'cpsghjxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏花角修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏花角修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏花角修补', '', 'cpsghjxb', 45000, 0, '', 0, 1, 5, '1.工艺：石膏刮平→批刮腻子→腻子打磨→表面光滑平整。2.乙供：石膏、腻子、人工及机械。3.甲供：石膏花角自行安装。4.说明：适用于甲方自行安装花角的修补。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 25000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 25000);

-- ======== 成品石膏灯盘修补 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '成品石膏灯盘修补', 'cpsgdpxb', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '成品石膏灯盘修补');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '成品石膏灯盘修补' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '成品石膏灯盘修补', '', 'cpsgdpxb', 100000, 0, '', 0, 1, 5, '1.工艺：石膏刮平→批刮腻子→腻子打磨→表面光滑平整。2.乙供：石膏、腻子、人工及机械。3.甲供：石膏灯盘自行安装。4.说明：适用于甲方自行安装灯盘的修补。\n1.计算规则：按个计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '个', 1000, 50000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 50000);

-- ======== 仅包含棚面生态环保内墙漆 | 规格:哑光 (拆分自:仅包含棚面生态环保内墙漆（哑光）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '仅包含棚面生态环保内墙漆', 'jbhpmsthbnqq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '仅包含棚面生态环保内墙漆');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '仅包含棚面生态环保内墙漆' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '仅包含棚面生态环保内墙漆', '哑光', 'jbhpmsthbnqqyg', 24300, 0, '面积', 0, 1, 47, '1.工艺：基层检查→内墙漆涂刷第一遍→内墙漆涂刷第二遍。2.乙供：内墙漆、人工及机械。3.说明：棚顶喷涂或滚涂两遍哑光面漆；报价限白色及浅色，如需调深色内墙漆费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑光');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑光' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '乳胶漆', 1655, '升', 180, '升', 180, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1655);

-- ======== 棚面生态环保内墙漆 | 规格:哑光 (拆分自:棚面生态环保内墙漆（哑光）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '棚面生态环保内墙漆', 'pmsthbnqq', 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '棚面生态环保内墙漆');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '棚面生态环保内墙漆' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '棚面生态环保内墙漆', '哑光', 'pmsthbnqqyg', 19300, 0, '面积', 0, 1, 47, '1.工艺：基层检查→内墙漆涂刷第一遍→内墙漆涂刷第二遍。2.乙供：内墙漆、人工及机械。3.说明：棚顶喷涂或滚涂两遍哑光面漆；报价限白色及浅色，如需调深色内墙漆费用另计。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑光');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '哑光' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 3000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '乳胶漆', 1655, '升', 180, '升', 180, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1655);

-- ======== 三维立体模拟放线 | 规格:平层 (拆分自:三维立体模拟放线（平层）) ========
SET @qcid = 519; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '三维立体模拟放线', '平层', 'swltmnfxpc', 12000, 0, '', 6, 0, 47, '1.工艺：成品保护→放基准线→水电点位改造放线→模拟图形喷绘。2.乙供：本子目中包含的材料、人工及机械。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 4, '平米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 4 AND salary = 3000);

-- ======== 三维立体模拟放线 | 规格:非平层 (拆分自:三维立体模拟放线（非平层）) ========
SET @qcid = 519; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '三维立体模拟放线', '非平层', 'swltmnfxfpc', 12000, 0, '', 6, 0, 47, '1.工艺：成品保护→放基准线→水电点位改造放线→模拟图形喷绘。2.乙供：本子目中包含的材料、人工及机械。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 4, '平米', 1000, 3300, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 4 AND salary = 3300);

-- ======== 水电管线开槽 | 规格:≤80平 (拆分自:水电管线开槽（≤80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '水电管线开槽', 'sdgxkc', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '水电管线开槽');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '水电管线开槽' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '水电管线开槽', '≤80平', 'sdgxkc≤80p', 1200000, 0, '', 6, 0, 12, '1.工艺：定位放线→无齿锯切割→剔槽→线槽清理→垃圾清理。2.乙供：垃圾袋、人工及机械。3.说明：不含智能家居布线开槽；垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 1000, 544000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 544000);

-- ======== 水电管线开槽 | 规格:＞80平 (拆分自:水电管线开槽（＞80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '水电管线开槽', 'sdgxkc', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '水电管线开槽');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '水电管线开槽' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '水电管线开槽', '＞80平', 'sdgxkc＞80p', 15000, 0, '', 6, 0, 47, '1.工艺：定位放线→无齿锯切割→剔槽→线槽清理→垃圾清理。2.乙供：垃圾袋、人工及机械。3.说明：不含智能家居布线开槽；垃圾排放到园区指定地点，如需外运费用另计。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '平米', 1000, 6800, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 6800);

-- ======== 水电线槽回填 | 规格:≤80平 (拆分自:水电线槽回填（≤80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '水电线槽回填', 'sdxcht', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '水电线槽回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '水电线槽回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '水电线槽回填', '≤80平', 'sdxcht≤80p', 320000, 0, '', 6, 0, 12, '1.工艺：清理线槽→浇水湿润→水泥砂浆回填（或石膏填充）。2.乙供：沙子、水泥、石膏、人工及机械。3.说明：墙面为水泥砂浆材质则使用水泥砂浆回填，墙面为石膏材质则用石膏回填。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '≤80平' LIMIT 1);

-- ======== 水电线槽回填 | 规格:＞80平 (拆分自:水电线槽回填（＞80平）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '水电线槽回填', 'sdxcht', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '水电线槽回填');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '水电线槽回填' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '水电线槽回填', '＞80平', 'sdxcht＞80p', 4000, 0, '', 6, 0, 47, '1.工艺：清理线槽→浇水湿润→水泥砂浆回填（或石膏填充）。2.乙供：沙子、水泥、石膏、人工及机械。3.说明：墙面为水泥砂浆材质则使用水泥砂浆回填，墙面为石膏材质则用石膏回填。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '＞80平' LIMIT 1);

-- ======== 沙子、水泥搬运费 | 规格:有电梯或无电梯3楼及以下 (拆分自:沙子、水泥搬运费（有电梯或无电梯3楼及以下）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '沙子、水泥搬运费', 'sz、snbyf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '沙子、水泥搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '沙子、水泥搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '沙子、水泥搬运费', '有电梯或无电梯3楼及以下', 'sz、snbyfydthwdt3ljyx', 9000, 0, '', 6, 0, 47, '1.说明：沙子、水泥远程搬运及垂直搬运(不含甲方购料搬运费)。\n1.计算规则：按平方米计算。\n2.说明：按面积*3计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下' LIMIT 1);

-- ======== 沙子、水泥搬运费 | 规格:无电梯4楼及以上 (拆分自:沙子、水泥搬运费（无电梯4楼及以上）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '沙子、水泥搬运费', 'sz、snbyf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '沙子、水泥搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '沙子、水泥搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '沙子、水泥搬运费', '无电梯4楼及以上', 'sz、snbyfwdt4ljys', 3000, 0, '', 6, 0, 47, '1.说明：沙子、水泥远程搬运及垂直搬运(不含甲方购料搬运费)。\n1.计算规则：按平方米计算。\n2.说明：按面积*楼层计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上' LIMIT 1);

-- ======== 红砖搬运费 | 规格:有电梯或无电梯3楼及以下 (拆分自:红砖搬运费（有电梯或无电梯3楼及以下）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '红砖搬运费', 'hzbyf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '红砖搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '红砖搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '红砖搬运费', '有电梯或无电梯3楼及以下', 'hzbyfydthwdt3ljyx', 300, 0, '', 6, 0, 8, '1.说明：红砖或多孔砖远程搬运及垂直搬运费用。(60mm墙)43块,(120mm墙)80块,(240mm墙)150块；红砖包管单根50块，双根100块。\n1.计算规则：按块计算。\n2.说明：按块数*3计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下' LIMIT 1);

-- ======== 红砖搬运费 | 规格:无电梯4楼及以上 (拆分自:红砖搬运费（无电梯4楼及以上）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '红砖搬运费', 'hzbyf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '红砖搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '红砖搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '红砖搬运费', '无电梯4楼及以上', 'hzbyfwdt4ljys', 100, 0, '', 6, 0, 8, '1.说明：红砖或多孔砖远程搬运及垂直搬运费用。(60mm墙)43块,(120mm墙)80块,(240mm墙)150块；红砖包管单根50块，双根100块。\n1.计算规则：按平方米计算。\n2.说明：按块数*楼层计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上' LIMIT 1);

-- ======== 材料上楼搬运费 | 规格:(空) ========
SET @qcid = 536; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '材料上楼搬运费', '', 'clslbyf', 1000, 0, '', 6, 0, 12, '1.说明：材料远程搬运及垂直搬运费（不含甲供材料搬运费）；沙子、水泥、红砖上楼费用另计。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 园区倒料费 | 规格:(空) ========
SET @qcid = 525; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '园区倒料费', '', 'yqdlf', 1000, 0, '', 6, 0, 12, '1.说明：园区进不去车情况下，乙供材料须增收倒料费。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 园区垃圾外运费 | 规格:(空) ========
SET @qcid = 524; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '园区垃圾外运费', '', 'yqljwyf', 600000, 0, '', 6, 0, 4, '1.说明：乙方施工范围内的垃圾从园区内指定地点外运至垃圾排放点。\n1.计算规则：按车计算。\n2.说明：不足一车按一车计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 地砖保护 | 规格:(空) ========
SET @qcid = 535; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '地砖保护', '', 'dzbh', 11000, 0, '', 6, 0, 47, '1.乙供：本子目中包含的材料、人工及机械。2.说明：地砖铺设完毕后,使用地板革进行成品保护。\n1.计算规则：按地砖面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 816, '平米', 1000, 1000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 816 AND salary = 1000);

-- ======== 石膏板地面保护 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '石膏板地面保护', 'sgbdmbh', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '石膏板地面保护');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '石膏板地面保护' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '石膏板地面保护', '', 'sgbdmbh', 15000, 0, '', 6, 0, 47, '1.乙供：本子目中包含的材料、人工及机械。2.说明：人工使用石膏板对地面进行硬质保护。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, '石膏板', 1641, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1641);

-- ======== 楼梯踏步成品保护 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '楼梯踏步成品保护', 'lttbcpbh', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '楼梯踏步成品保护');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '楼梯踏步成品保护' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '楼梯踏步成品保护', '', 'lttbcpbh', 28000, 0, '', 6, 0, 10, '1.说明：除木楼梯基层外，其余材质踏步施工完毕后使用地板革或石膏板进行保护。\n1.计算规则：按踏计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 开荒保洁 | 规格:平层 (拆分自:开荒保洁（平层）) ========
SET @qcid = 533; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '开荒保洁', '平层', 'khbjpc', 4000, 0, '', 6, 0, 47, '1.乙供：本子目中包含的材料、人工及机械。2.说明：室内初始开荒除尘、窗户清洁，非家政精保洁；不含灯具、非瓷砖墙面的保洁。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 13, '平米', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 13 AND salary = 3000);

-- ======== 开荒保洁 | 规格:非平层 (拆分自:开荒保洁（非平层）) ========
SET @qcid = 533; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '开荒保洁', '非平层', 'khbjfpc', 4000, 0, '', 6, 0, 47, '1.乙供：本子目中包含的材料、人工及机械。2.说明：室内初始开荒除尘、窗户清洁，非家政精保洁；不含灯具、非瓷砖墙面的保洁。\n1.计算规则：按计价面积计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '非平层' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 13, '平米', 1000, 3500, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 13 AND salary = 3500);

-- ======== 楼梯间施工高空作业费 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '楼梯间施工高空作业费', 'ltjsggkzyf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '楼梯间施工高空作业费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '楼梯间施工高空作业费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '楼梯间施工高空作业费', '', 'ltjsggkzyf', 600000, 0, '', 6, 0, 12, '1.说明：仅适用于楼梯口≤5平方米；楼梯口＞5平方米套用高空作业费（层高＞4000mm）子目以平方米计算；高空作业需搭设作业平台。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 1000, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 200000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 1000, 600000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 600000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 2000, '张', 2000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 高空作业费 | 规格:3000mm≤层高≤3500mm (拆分自:高空作业费（3000mm≤层高≤3500mm）) ========
SET @qcid = 534; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '高空作业费', '3000mm≤层高≤3500mm', 'gkzyf3000mm≤cg≤3500mm', 25000, 0, '', 6, 0, 47, '1.说明：高空作业需搭设脚手架。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '3000mm≤层高≤3500mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '3000mm≤层高≤3500mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '平米', 1000, 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 6000);

-- ======== 高空作业费 | 规格:3500mm＜层高≤4000mm (拆分自:高空作业费（3500mm＜层高≤4000mm）) ========
SET @qcid = 534; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '高空作业费', '3500mm＜层高≤4000mm', 'gkzyf3500mm＜cg≤4000mm', 60000, 0, '', 6, 0, 47, '1.说明：高空作业需搭设脚手架。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '3500mm＜层高≤4000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '3500mm＜层高≤4000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 170, '张', 170, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 高空作业费 | 规格:层高＞4000mm (拆分自:高空作业费（层高＞4000mm）) ========
SET @qcid = 534; -- B类: 项目在库
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '高空作业费', '层高＞4000mm', 'gkzyfcg＞4000mm', 120000, 0, '', 6, 0, 47, '1.说明：高空作业需搭设作业平台。\n1.计算规则：按平方米计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '层高＞4000mm');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '层高＞4000mm' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '平米', 1000, 30000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 30000);
INSERT INTO data.cormood (qfid, name, nid, normunit, normnum, storeunit, storenum, price, status) SELECT @qfid, 'osb板', 1640, '张', 340, '张', 340, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormood WHERE qfid = @qfid AND nid = 1640);

-- ======== 远程施工维修费 | 规格:200km＜距离≤500km (拆分自:远程施工维修费（200km＜距离≤500km）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '远程施工维修费', 'ycsgwxf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '远程施工维修费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '远程施工维修费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '远程施工维修费', '200km＜距离≤500km', 'ycsgwxf200km＜jl≤500km', 5000000, 0, '', 6, 0, 12, '1.说明：异地维修200km＜距离≤500km收取此项费用。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200km＜距离≤500km');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '200km＜距离≤500km' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 400000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 0, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 200000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 400000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 400000);

-- ======== 远程施工维修费 | 规格:距离＞500km (拆分自:远程施工维修费（距离＞500km）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '远程施工维修费', 'ycsgwxf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '远程施工维修费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '远程施工维修费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '远程施工维修费', '距离＞500km', 'ycsgwxfjl＞500km', 10000000, 0, '', 6, 0, 12, '1.说明：异地维修距离＞500km收取此项费用。\n1.计算规则：按项计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '距离＞500km');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '距离＞500km' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 400000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 0, 200000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 200000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 400000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 0, 400000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 400000);

-- ======== 远程施工费 | 规格:市区三环外 (拆分自:远程施工费（市区三环外）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '远程施工费', 'ycsgf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '远程施工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '远程施工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '远程施工费', '市区三环外', 'ycsgfsqshw', 60000, 0, '', 6, 0, 7, '1.说明：市区三环以外施工运输费；从三环开始计算单程公里数。市区包含：和平区、沈河区、皇姑区、大东区、铁西区、浑南区、于洪区、沈北新区、苏家屯区。\n1.计算规则：按公里计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '市区三环外');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '市区三环外' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 4, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 4 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 9, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 9 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '公里', 1000, 3000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 3000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '公里', 1000, 6000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 6000);

-- ======== 远程施工费 | 规格:周边外阜 (拆分自:远程施工费（周边外阜）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '远程施工费', 'ycsgf', 0, 6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '远程施工费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '远程施工费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '远程施工费', '周边外阜', 'ycsgfzbwf', 1000, 0, '', 6, 0, 12, '1.说明：周边城市施工运输费；从三环开始计算单程公里数。\n1.计算规则：按项计算。\n2.说明：工程基础报价*2%+公里*40元/公里。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '周边外阜');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '周边外阜' LIMIT 1);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 4, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 4 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 5, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 5 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 6, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 6 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 7, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 7 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 8, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 8 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 9, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 9 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 10, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 10 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 11, '项', 0, 300000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 11 AND salary = 300000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 12, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 12 AND salary = 150000);
INSERT INTO data.cormrice (qcid, qfid, cnid, unit, trannum, salary, status, company) SELECT @qcid, @qfid, 626, '项', 0, 150000, 0, 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM data.cormrice WHERE qfid = @qfid AND cnid = 626 AND salary = 150000);

-- ======== 定点冲筋 | 规格:(空) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '定点冲筋', 'ddcj', 0, 4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '定点冲筋');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '定点冲筋' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '定点冲筋', '', 'ddcj', 30000, 0, '周长*举架-洞面/2-窗面/2+梁长*梁高*2+面积', 4, 0, 47, '1.工艺：水平仪测垂平线并找出墙面最高点→依照最高点定点冲筋。 2.乙供：石膏、人工及机械。\n1.计算规则：按平方米计算。\n2.说明：门窗口面积按50%扣除，不足一平不扣减。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '' LIMIT 1);

-- ======== 超优-沙子、水泥搬运费 | 规格:有电梯或无电梯3楼及以下 (拆分自:超优-沙子、水泥搬运费（有电梯或无电梯3楼及以下）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-沙子、水泥搬运费', 'cy-sz、snbyf', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-沙子、水泥搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-沙子、水泥搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-沙子、水泥搬运费', '有电梯或无电梯3楼及以下', 'cy-sz、snbyfydthwdt3ljyx', 9300, 0, '', 1, 0, 47, '1.说明：沙子、水泥远程搬运及垂直搬运(不含甲方购料搬运费)。\n1.计算规则：按平方米计算。\n2.说明：按面积*3计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下' LIMIT 1);

-- ======== 超优-沙子、水泥搬运费 | 规格:无电梯4楼及以上 (拆分自:超优-沙子、水泥搬运费（无电梯4楼及以上）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-沙子、水泥搬运费', 'cy-sz、snbyf', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-沙子、水泥搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-沙子、水泥搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-沙子、水泥搬运费', '无电梯4楼及以上', 'cy-sz、snbyfwdt4ljys', 3100, 0, '', 1, 0, 47, '1.说明：沙子、水泥远程搬运及垂直搬运(不含甲方购料搬运费)。\n1.计算规则：按平方米计算。\n2.说明：按面积*楼层计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上' LIMIT 1);

-- ======== 超优-红砖搬运费 | 规格:有电梯或无电梯3楼及以下 (拆分自:超优-红砖搬运费（有电梯或无电梯3楼及以下）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-红砖搬运费', 'cy-hzbyf', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-红砖搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-红砖搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-红砖搬运费', '有电梯或无电梯3楼及以下', 'cy-hzbyfydthwdt3ljyx', 300, 0, '', 1, 0, 8, '1.说明：红砖或多孔砖远程搬运及垂直搬运费用。(60mm墙)43块,(120mm墙)80块,(240mm墙)150块。\n1.计算规则：按块计算。\n2.说明：按工程量*3计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '有电梯或无电梯3楼及以下' LIMIT 1);

-- ======== 超优-红砖搬运费 | 规格:无电梯4楼及以上 (拆分自:超优-红砖搬运费（无电梯4楼及以上）) ========
INSERT INTO quotation.quotationCtem (name, pinyin, status, type) SELECT '超优-红砖搬运费', 'cy-hzbyf', 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationCtem WHERE name = '超优-红砖搬运费');
SET @qcid = (SELECT qcid FROM quotation.quotationCtem WHERE name = '超优-红砖搬运费' LIMIT 1);
INSERT INTO quotation.quotationformat (qcid, name, format, pinyin, price, cost, formula, type, discount, unit, comment, status) SELECT @qcid, '超优-红砖搬运费', '无电梯4楼及以上', 'cy-hzbyfwdt4ljys', 100, 0, '', 1, 0, 8, '1.说明：红砖或多孔砖远程搬运及垂直搬运费用。(60mm墙)43块,(120mm墙)80块,(240mm墙)150块。\n1.计算规则：按平方米计算。\n2.说明：按工程量*楼层计算。', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上');
SET @qfid = (SELECT qfid FROM quotation.quotationformat WHERE qcid = @qcid AND format = '无电梯4楼及以上' LIMIT 1);

-- ============================== SKIP: 58行工费占位(有节点无金额, 未导入) 57项目 ==============================
-- SKIP占位: OSB假梁制作 |  | 木工
-- SKIP占位: 下沉卫生间墙面防水涂刷 |  | 瓦工
-- SKIP占位: 全屋AP光纤布线 |  | 电工
-- SKIP占位: 全屋总控开关（平层） |  | 电工
-- SKIP占位: 全屋总控开关（非平层） |  | 电工
-- SKIP占位: 全屋插座升级为4平方BV线 |  | 电工
-- SKIP占位: 卫生间地面回填 |  | 瓦工
-- SKIP占位: 卫生间地面回填（无辅料） |  | 瓦工
-- SKIP占位: 卫生间地面排水管道支杠改造 |  | 水工
-- SKIP占位: 卫生间排风管道挂网抹灰处理（无辅料） |  | 瓦工
-- SKIP占位: 卫生间洁具及五金件安装 |  | 水工
-- SKIP占位: 卫生间等电位联结 |  | 电工
-- SKIP占位: 厨房地面排水管道支杠改造 |  | 水工
-- SKIP占位: 厨房地面排水管道支杠重新制作 |  | 水工
-- SKIP占位: 厨房排烟管道挂网抹灰处理 |  | 瓦工
-- SKIP占位: 厨房排烟管道挂网抹灰处理（无辅料） |  | 瓦工
-- SKIP占位: 厨房洗菜槽安装 |  | 水工
-- SKIP占位: 园区倒料费 |  | 力工
-- SKIP占位: 园区垃圾外运费 |  | 力工
-- SKIP占位: 地面瓷砖铺设 | 1000*2000 | 瓦工
-- SKIP占位: 地面瓷砖铺设 | 1200*1800 | 瓦工
-- SKIP占位: 墙面防水涂刷 |  | 瓦工
-- SKIP占位: 增加中央空调外机6平方电缆布线 |  | 电工
-- SKIP占位: 增加双控开关电路敷设 |  | 电工
-- SKIP占位: 增加吊斜面边棚 |  | 木工
-- SKIP占位: 增加强电走棚 |  | 电工
-- SKIP占位: 增加防水石膏板吊边棚 |  | 木工
-- SKIP占位: 定点冲筋 |  | 油工
-- SKIP占位: 底漆涂刷 |  | 油工
-- SKIP占位: 弱电全屋布线（≤80平） |  | 电工
-- SKIP占位: 弱电全屋布线（＞80平） |  | 电工
-- SKIP占位: 弱电全屋走棚布线（≤80平） |  | 电工
-- SKIP占位: 弱电全屋走棚布线（＞80平） |  | 电工
-- SKIP占位: 有线网络智能家居电路改造（平层） |  | 电工
-- SKIP占位: 有线网络智能家居电路改造（非平层) |  | 电工
-- SKIP占位: 材料上楼搬运费 |  | 力工
-- SKIP占位: 检修口制作 |  | 木工
-- SKIP占位: 棚面超厚挂网防裂处理 |  | 石膏
-- SKIP占位: 楼梯踏步成品保护 |  | 形象保护
-- SKIP占位: 水电线槽回填（≤80平） |  | 石膏
-- SKIP占位: 水电线槽回填（＞80平） |  | 石膏
-- SKIP占位: 沙子、水泥搬运费（无电梯4楼及以上） |  | 力工
-- SKIP占位: 沙子、水泥搬运费（有电梯或无电梯3楼及以下） |  | 力工
-- SKIP占位: 灯具及开关插座安装 |  | 电工
-- SKIP占位: 灯具及开关插座安装（≤80平） |  | 电工
-- SKIP占位: 电视背景墙预埋穿线套管 |  | 电工
-- SKIP占位: 界面剂涂刷 |  | 油工
-- SKIP占位: 石膏板地面保护 |  | 形象保护
-- SKIP占位: 窗帘滑道安装 |  | 木工
-- SKIP占位: 红砖搬运费（无电梯4楼及以上） |  | 力工
-- SKIP占位: 红砖搬运费（有电梯或无电梯3楼及以下） |  | 力工
-- SKIP占位: 超优-沙子、水泥搬运费（无电梯4楼及以上） |  | 力工
-- SKIP占位: 超优-沙子、水泥搬运费（有电梯或无电梯3楼及以下） |  | 力工
-- SKIP占位: 超优-红砖搬运费（无电梯4楼及以上） |  | 力工
-- SKIP占位: 超优-红砖搬运费（有电梯或无电梯3楼及以下） |  | 力工
-- SKIP占位: 阳台保温墙面处理 |  | 油工
-- SKIP占位: 阴阳角修直 |  | 油工
-- SKIP占位: 高分子地面防水 |  | 瓦工
-- ============================== END ==============================