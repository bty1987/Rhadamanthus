-- =====================================================================
-- 文件: 25_signet_orgid_pull_backfill.sql
-- 用途: 正式环境已实名企业orgId批量回填签章(e签宝H5企业清单匹配keyword生成)
--       来源=经办人点链接认证+应用历史档案, 已认证主体直接回填免重认证
-- 前置条件: 21号切换已执行; 仅当该章signno为空时生效(防覆盖)
-- 回滚方式: UPDATE data.signet SET signno=NULL, status=1 WHERE sid IN(<下列sid>) AND provider=2;
-- 验证语句: SELECT COUNT(*) FROM data.signet WHERE provider=2 AND status=3 AND signno IS NOT NULL;
-- 幂等性: 幂等
-- =====================================================================

UPDATE data.signet SET signno = 'ddad148ec6d04450b4d980f410e5b619', status = 3 WHERE sid = 206 AND provider = 2 AND (signno IS NULL OR signno = ''); -- FANGLIN00004-ES / 方林家居装饰有限公司
UPDATE data.signet SET signno = 'ddad148ec6d04450b4d980f410e5b619', status = 3 WHERE sid = 248 AND provider = 2 AND (signno IS NULL OR signno = ''); -- FANGLIN00010-ES / 方林家居装饰有限公司
UPDATE data.signet SET signno = '5475a9244d4542afb02ee07657005b72', status = 3 WHERE sid = 308 AND provider = 2 AND (signno IS NULL OR signno = ''); -- FANGLIN00011-ES / 方林家居装饰有限公司沈阳分公司
UPDATE data.signet SET signno = '536be2070cf3414d8cdd81b29fb16aea', status = 3 WHERE sid = 219 AND provider = 2 AND (signno IS NULL OR signno = ''); -- YIJIA00001-ES / 沈阳宜家悦筑装饰工程有限公司
UPDATE data.signet SET signno = 'be8a60c05026429b85d1cbaa6fb39e47', status = 3 WHERE sid = 330 AND provider = 2 AND (signno IS NULL OR signno = ''); -- YIJIA00007-ES / 辽宁屿林悦筑装饰工程有限公司
UPDATE data.signet SET signno = 'abc024cc96a54292b5c09e986a2d3936', status = 3 WHERE sid = 292 AND provider = 2 AND (signno IS NULL OR signno = ''); -- AHFLTEMP2021040607-ES / 方林家居装饰有限公司合肥分公司
UPDATE data.signet SET signno = 'c1570e5a7afe4118a4afe7d9d0ee8431', status = 3 WHERE sid = 306 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HBFLTEMP2021040605-ES / 方林家居装饰有限公司武汉分公司
UPDATE data.signet SET signno = '86e0f476431946bfbd1ac18d7199a78a', status = 3 WHERE sid = 220 AND provider = 2 AND (signno IS NULL OR signno = ''); -- ENLIN00002-ES / 辽宁恩林房翻新家居装饰有限公司
UPDATE data.signet SET signno = '5475a9244d4542afb02ee07657005b72', status = 3 WHERE sid = 328 AND provider = 2 AND (signno IS NULL OR signno = ''); -- FANGLIN00019-ES / 方林家居装饰有限公司沈阳分公司
UPDATE data.signet SET signno = 'c6c9cd92a5ef4f2f82ff7718e3d3b1e6', status = 3 WHERE sid = 222 AND provider = 2 AND (signno IS NULL OR signno = ''); -- SYAILIN00002-ES / 辽宁爱林装饰装修有限公司
UPDATE data.signet SET signno = '6f13ffb27b89448782560ae214dc10c3', status = 3 WHERE sid = 290 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JLFLTEMP2021040605-ES / 方林家居装饰有限公司长春分公司
UPDATE data.signet SET signno = '6f13ffb27b89448782560ae214dc10c3', status = 3 WHERE sid = 340 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JLFLTEMP2021040609-ES / 方林家居装饰有限公司长春分公司
UPDATE data.signet SET signno = '565039e70d2d4d478eec11843a204743', status = 3 WHERE sid = 293 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HFALFANGLIN00004-ES / 辽宁爱林装饰装修有限公司合肥分公司
UPDATE data.signet SET signno = 'fb635b8f82a24515b15fc5679f963c5f', status = 3 WHERE sid = 291 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JLALFANGLIN00004-ES / 辽宁爱林装饰装修有限公司长春分公司
UPDATE data.signet SET signno = 'fb635b8f82a24515b15fc5679f963c5f', status = 3 WHERE sid = 313 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JLALFANGLIN00005-ES / 辽宁爱林装饰装修有限公司长春分公司
UPDATE data.signet SET signno = 'ff83ef6973bb40e8b066711f0bfa9d2c', status = 3 WHERE sid = 236 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HBFANGLIN00004-ES / 辽宁爱林装饰装修有限公司武汉分公司
UPDATE data.signet SET signno = 'c6c9cd92a5ef4f2f82ff7718e3d3b1e6', status = 3 WHERE sid = 226 AND provider = 2 AND (signno IS NULL OR signno = ''); -- PJALFANGLIN00001-ES / 辽宁爱林装饰装修有限公司
UPDATE data.signet SET signno = 'b8f4a05756ab4a4baa66aba3444fa356', status = 3 WHERE sid = 227 AND provider = 2 AND (signno IS NULL OR signno = ''); -- BXALFANGLIN00001-ES / 方林家居装饰有限公司本溪分公司
UPDATE data.signet SET signno = '591488d1c5a6454d963c909f778e65e9', status = 3 WHERE sid = 228 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLDALFANGLIN00001-ES / 方林家居装饰有限公司葫芦岛分公司
UPDATE data.signet SET signno = '7f13a32b49b14cc393a205a5750b6d51', status = 3 WHERE sid = 229 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DDALFANGLIN00001-ES / 方林家居装饰有限公司丹东分公司
UPDATE data.signet SET signno = '14a474fd935c4aafba62753d053dcecd', status = 3 WHERE sid = 230 AND provider = 2 AND (signno IS NULL OR signno = ''); -- LXALFANGLIN00001-ES / 方林家居装饰有限公司辽西分公司
UPDATE data.signet SET signno = '2c823c93461b498297ceb7dd5b7e4663', status = 3 WHERE sid = 211 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLJFLTEMP2021040601-ES / 方林家居装饰有限公司哈尔滨分公司
UPDATE data.signet SET signno = '2c823c93461b498297ceb7dd5b7e4663', status = 3 WHERE sid = 280 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLJFLTEMP2021040609-ES / 方林家居装饰有限公司哈尔滨分公司
UPDATE data.signet SET signno = '9b459036662d4b469368a8c300218be0', status = 3 WHERE sid = 231 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLJAILIN00001-ES / 辽宁爱林装饰装修有限公司哈尔滨分公司
UPDATE data.signet SET signno = '9b459036662d4b469368a8c300218be0', status = 3 WHERE sid = 281 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLJAILIN00002-ES / 辽宁爱林装饰装修有限公司哈尔滨分公司
UPDATE data.signet SET signno = '0c4b9dba4e8846b98c953edc808863be', status = 3 WHERE sid = 311 AND provider = 2 AND (signno IS NULL OR signno = ''); -- WUHANAILIN00005-ES / 辽宁壹玖壹捌建筑装饰有限公司武汉分公司
UPDATE data.signet SET signno = 'b8f4a05756ab4a4baa66aba3444fa356', status = 3 WHERE sid = 215 AND provider = 2 AND (signno IS NULL OR signno = ''); -- BXFLCONTRACT0001-ES / 方林家居装饰有限公司本溪分公司
UPDATE data.signet SET signno = 'e508976326054a0cae9cbc36921626e4', status = 3 WHERE sid = 216 AND provider = 2 AND (signno IS NULL OR signno = ''); -- PJFLCONTRACT0001-ES / 方林家居装饰有限公司盘锦分公司
UPDATE data.signet SET signno = '7f13a32b49b14cc393a205a5750b6d51', status = 3 WHERE sid = 217 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DDFLCONTRACT0001-ES / 方林家居装饰有限公司丹东分公司
UPDATE data.signet SET signno = '591488d1c5a6454d963c909f778e65e9', status = 3 WHERE sid = 218 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HLDFLCONTRACT0001-ES / 方林家居装饰有限公司葫芦岛分公司
UPDATE data.signet SET signno = '6f13ffb27b89448782560ae214dc10c3', status = 3 WHERE sid = 296 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JL1918FANGLIN00003-ES / 方林家居装饰有限公司长春分公司
UPDATE data.signet SET signno = '85d9eee35e2c42278da796dcda9f49ea', status = 3 WHERE sid = 232 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DLFANGLIN00001-ES / 方林家居装饰有限公司大连分公司
UPDATE data.signet SET signno = '85d9eee35e2c42278da796dcda9f49ea', status = 3 WHERE sid = 279 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DLFANGLIN00002-ES / 方林家居装饰有限公司大连分公司
UPDATE data.signet SET signno = '85d9eee35e2c42278da796dcda9f49ea', status = 3 WHERE sid = 233 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DL191800001-ES / 方林家居装饰有限公司大连分公司
UPDATE data.signet SET signno = 'f3c17c4a7c784cc1bb9ba6e0949f2631', status = 3 WHERE sid = 315 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DL191800007-ES / 辽宁壹玖壹捌建筑装饰有限公司大连分公司
UPDATE data.signet SET signno = '542d9718b920430fa5e06c86c3b9e925', status = 3 WHERE sid = 241 AND provider = 2 AND (signno IS NULL OR signno = ''); -- CQFANGLIN00001-ES / 方林家居装饰有限公司重庆分公司
UPDATE data.signet SET signno = '542d9718b920430fa5e06c86c3b9e925', status = 3 WHERE sid = 285 AND provider = 2 AND (signno IS NULL OR signno = ''); -- CQFANGLIN00002-ES / 方林家居装饰有限公司重庆分公司
UPDATE data.signet SET signno = 'ad9577f2078e47dfa1d4960dee2064dc', status = 3 WHERE sid = 239 AND provider = 2 AND (signno IS NULL OR signno = ''); -- ANSHANAILIN00001-ES / 辽宁爱林装饰装修有限公司鞍山分公司
UPDATE data.signet SET signno = 'ad9577f2078e47dfa1d4960dee2064dc', status = 3 WHERE sid = 287 AND provider = 2 AND (signno IS NULL OR signno = ''); -- ANSHANAILIN00003-ES / 辽宁爱林装饰装修有限公司鞍山分公司
UPDATE data.signet SET signno = 'cb24eb9cfd404638bb8a924edc991fdd', status = 3 WHERE sid = 235 AND provider = 2 AND (signno IS NULL OR signno = ''); -- NJFANGLIN00001-ES / 方林家居装饰有限公司南京分公司
UPDATE data.signet SET signno = 'cb24eb9cfd404638bb8a924edc991fdd', status = 3 WHERE sid = 282 AND provider = 2 AND (signno IS NULL OR signno = ''); -- NJFANGLIN00004-ES / 方林家居装饰有限公司南京分公司
UPDATE data.signet SET signno = 'dbe70a73a03d4354b122a31162dd1a19', status = 3 WHERE sid = 238 AND provider = 2 AND (signno IS NULL OR signno = ''); -- NJAILIN00001-ES / 辽宁爱林装饰装修有限公司南京分公司
UPDATE data.signet SET signno = 'dbe70a73a03d4354b122a31162dd1a19', status = 3 WHERE sid = 283 AND provider = 2 AND (signno IS NULL OR signno = ''); -- NJAILIN00003-ES / 辽宁爱林装饰装修有限公司南京分公司
UPDATE data.signet SET signno = '8ba89bf53b4e4a0aa850af9ce0440546', status = 3 WHERE sid = 242 AND provider = 2 AND (signno IS NULL OR signno = ''); -- CQAILIN00001-ES / 辽宁爱林装饰装修有限公司重庆分公司
UPDATE data.signet SET signno = '8ba89bf53b4e4a0aa850af9ce0440546', status = 3 WHERE sid = 286 AND provider = 2 AND (signno IS NULL OR signno = ''); -- CQAILIN00002-ES / 辽宁爱林装饰装修有限公司重庆分公司
UPDATE data.signet SET signno = '6c2bd62c78274116a9f255e01805ccc0', status = 3 WHERE sid = 240 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAFANGLIN00001-ES / 方林家居装饰有限公司西安分公司
UPDATE data.signet SET signno = '6c2bd62c78274116a9f255e01805ccc0', status = 3 WHERE sid = 276 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAFANGLIN00003-ES / 方林家居装饰有限公司西安分公司
UPDATE data.signet SET signno = '17a32c7e9b7441c8a7cfe73d59fc2289', status = 3 WHERE sid = 294 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAFANGLIN00004-ES / 西安方林建材销售有限公司
UPDATE data.signet SET signno = 'b46a3fded1894f0e9a48ac382c18abac', status = 3 WHERE sid = 244 AND provider = 2 AND (signno IS NULL OR signno = ''); -- YCAILIN00001-ES / 辽宁爱林装饰装修有限公司宜昌分公司
UPDATE data.signet SET signno = 'b46a3fded1894f0e9a48ac382c18abac', status = 3 WHERE sid = 274 AND provider = 2 AND (signno IS NULL OR signno = ''); -- YCAILIN00003-ES / 辽宁爱林装饰装修有限公司宜昌分公司
UPDATE data.signet SET signno = 'ffa939ebb6ac402db832df6fa6d6a6ae', status = 3 WHERE sid = 243 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAAILIN00001-ES / 辽宁爱林装饰装修有限公司西安分公司
UPDATE data.signet SET signno = 'ffa939ebb6ac402db832df6fa6d6a6ae', status = 3 WHERE sid = 288 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAAILIN00002-ES / 辽宁爱林装饰装修有限公司西安分公司
UPDATE data.signet SET signno = '6c2bd62c78274116a9f255e01805ccc0', status = 3 WHERE sid = 322 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAAILIN00003-ES / 方林家居装饰有限公司西安分公司
UPDATE data.signet SET signno = '717f229fc06b4beea0d362800e01ba0a', status = 3 WHERE sid = 246 AND provider = 2 AND (signno IS NULL OR signno = ''); -- SYHNFANGLIN00001-ES / 方林家居装饰有限公司浑南分公司
UPDATE data.signet SET signno = 'abc024cc96a54292b5c09e986a2d3936', status = 3 WHERE sid = 298 AND provider = 2 AND (signno IS NULL OR signno = ''); -- AH1918TEMP2021040606-ES / 方林家居装饰有限公司合肥分公司
UPDATE data.signet SET signno = 'c6c9cd92a5ef4f2f82ff7718e3d3b1e6', status = 3 WHERE sid = 257 AND provider = 2 AND (signno IS NULL OR signno = ''); -- SBALIN00001-ES / 辽宁爱林装饰装修有限公司
UPDATE data.signet SET signno = '6f13ffb27b89448782560ae214dc10c3', status = 3 WHERE sid = 329 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JLFLTEMP2021040608-ES / 方林家居装饰有限公司长春分公司
UPDATE data.signet SET signno = '6c2bd62c78274116a9f255e01805ccc0', status = 3 WHERE sid = 321 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAFANGLIN00005-ES / 方林家居装饰有限公司西安分公司
UPDATE data.signet SET signno = '85d9eee35e2c42278da796dcda9f49ea', status = 3 WHERE sid = 331 AND provider = 2 AND (signno IS NULL OR signno = ''); -- DLFz00002-ES / 方林家居装饰有限公司大连分公司
UPDATE data.signet SET signno = '35a2afdbf6c24682afba5b68418b8ecf', status = 3 WHERE sid = 318 AND provider = 2 AND (signno IS NULL OR signno = ''); -- TJFLTEMP2025030502-ES / 方林家居装饰有限公司天津分公司
UPDATE data.signet SET signno = 'edbaed4bf76241f38f0fff8062337bca', status = 3 WHERE sid = 319 AND provider = 2 AND (signno IS NULL OR signno = ''); -- TJALTEMP2025030502-ES / 辽宁爱林装饰装修有限公司天津分公司
UPDATE data.signet SET signno = '4afedf6bee514cbeb1903196888244ab', status = 3 WHERE sid = 323 AND provider = 2 AND (signno IS NULL OR signno = ''); -- JHFLTEMP2021040602-ES / 方林家居装饰有限公司武汉汉口分公司
UPDATE data.signet SET signno = '6c2bd62c78274116a9f255e01805ccc0', status = 3 WHERE sid = 324 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAFANGLIN00007-ES / 方林家居装饰有限公司西安分公司
UPDATE data.signet SET signno = '8bd266e4f2aa4ee3b121956a3dae9042', status = 3 WHERE sid = 325 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAWEIYANG00002-ES / 方林家居装饰有限公司未央分公司
UPDATE data.signet SET signno = '8bd266e4f2aa4ee3b121956a3dae9042', status = 3 WHERE sid = 326 AND provider = 2 AND (signno IS NULL OR signno = ''); -- XAWEIYANG00003-ES / 方林家居装饰有限公司未央分公司
UPDATE data.signet SET signno = 'dff1e4f5b1094ad8a264f62a57e18ae2', status = 3 WHERE sid = 350 AND provider = 2 AND (signno IS NULL OR signno = ''); -- HCFLJJHT00002-ES / 方林家居装饰有限公司海城分公司
UPDATE data.signet SET signno = '5ee2db46e5f642448aaf5e7d831385e3', status = 3 WHERE sid = 354 AND provider = 2 AND (signno IS NULL OR signno = ''); -- YCFL00001-ES / 方林家居装饰有限公司宜昌分公司
UPDATE data.signet SET signno = 'a446344744664d0fa10e7779133d60f9', status = 3 WHERE sid = 345 AND provider = 2 AND (signno IS NULL OR signno = ''); -- cdflhtz00001-ES / 方林家居装饰有限公司成都分公司
UPDATE data.signet SET signno = '9f49cbf7a50f4cd9ad6afe49db302df6', status = 3 WHERE sid = 344 AND provider = 2 AND (signno IS NULL OR signno = ''); -- cdalhtz00001-ES / 辽宁爱林装饰装修有限公司成都分公司
UPDATE data.signet SET signno = 'bbc40dc7331245f29c0f481139b5c562', status = 3 WHERE sid = 338 AND provider = 2 AND (signno IS NULL OR signno = ''); -- QDFL00001-ES / 方林家居装饰有限公司青岛分公司
UPDATE data.signet SET signno = 'cb56f4756bbe4ab49b4cf00801cba16d', status = 3 WHERE sid = 341 AND provider = 2 AND (signno IS NULL OR signno = ''); -- QDAL00001-ES / 辽宁爱林装饰装修有限公司青岛分公司
UPDATE data.signet SET signno = 'e68582f652c743c4ae084a537cad1a33', status = 3 WHERE sid = 339 AND provider = 2 AND (signno IS NULL OR signno = ''); -- aqfl00001-ES / 方林家居装饰有限公司安庆分公司
UPDATE data.signet SET signno = 'e68582f652c743c4ae084a537cad1a33', status = 3 WHERE sid = 347 AND provider = 2 AND (signno IS NULL OR signno = ''); -- aqfl0002-ES / 方林家居装饰有限公司安庆分公司
UPDATE data.signet SET signno = '591488d1c5a6454d963c909f778e65e9', status = 3 WHERE sid = 333 AND provider = 2 AND (signno IS NULL OR signno = ''); -- QHDFL00001-ES / 方林家居装饰有限公司葫芦岛分公司
UPDATE data.signet SET signno = 'e508976326054a0cae9cbc36921626e4', status = 3 WHERE sid = 349 AND provider = 2 AND (signno IS NULL OR signno = ''); -- PJFLCONTRACT0004-ES / 方林家居装饰有限公司盘锦分公司
UPDATE data.signet SET signno = 'b8f4a05756ab4a4baa66aba3444fa356', status = 3 WHERE sid = 336 AND provider = 2 AND (signno IS NULL OR signno = ''); -- LYFLZS00001-ES / 方林家居装饰有限公司本溪分公司

-- 共 76 条; 未匹配 73 把(主体无档案或未认证)继续走认证链接
