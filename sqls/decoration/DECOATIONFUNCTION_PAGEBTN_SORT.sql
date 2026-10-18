-- =====================================================================
-- decoration.decorationfunction 功能按钮(pageBtn, type=4) sort 统一编号
-- =====================================================================
-- 版本3(2026-10-17): 两区段编号——0xx=行按钮(数据行操作列), 1xx=表按钮(页面级);
--   废单(delete)移至终止(26)之后(业务序: 签约→终止→废单→重签); 连续整数无空洞。
-- 版本2历史: 曾按批准顺序编1~36(废单在4), 本版在现值基础上重排+分区。
-- 顺序口径(25个角色视角统一, 用户批准):
--   行按钮: 查看1 画像2 推荐3 详情4 服务5 回访6 放线7 合同8 合同(设计)9
--           扣款10 预签11 报价12 拓展项13 定额14 选材15 增减项16
--           增减项(工程)17 增减项(主材)18 工程19 装修活动20 销售活动21
--           预签准备22 签约准备23 预签合同24 签约25 终止26 废单27
--           重签28 内决29 决算30 保修31 (32起为行按钮预留区)
--   表按钮: 创建101 多单102 国补103 导出104 终止(历史行)105
-- ⚠️ 幂等(按dfid定值); 需先于/随前端 decoration.js(按pageBtn序渲染)生效。
-- =====================================================================

UPDATE decoration.decorationfunction
SET sort = CASE dfid
    WHEN 73  THEN 1    -- 查看 view
    WHEN 241 THEN 2    -- 画像 profile
    WHEN 235 THEN 3    -- 推荐 refer
    WHEN 82  THEN 4    -- 详情 info
    WHEN 84  THEN 5    -- 服务 services
    WHEN 75  THEN 6    -- 回访 revie
    WHEN 76  THEN 7    -- 放线 line
    WHEN 77  THEN 8    -- 合同 contract
    WHEN 179 THEN 9    -- 合同(设计) contractc
    WHEN 78  THEN 10   -- 扣款 scal
    WHEN 74  THEN 11   -- 预签 prosign
    WHEN 79  THEN 12   -- 报价 price
    WHEN 81  THEN 13   -- 拓展项 extension
    WHEN 191 THEN 14   -- 定额 normPart
    WHEN 134 THEN 15   -- 选材 selection
    WHEN 80  THEN 16   -- 增减项 btnAddReduce
    WHEN 195 THEN 17   -- 增减项(工程) btnAddReduceD
    WHEN 196 THEN 18   -- 增减项(主材) btnAddReduceM
    WHEN 242 THEN 19   -- 工程 consche
    WHEN 85  THEN 20   -- 装修活动 activity
    WHEN 175 THEN 21   -- 销售活动 sctivity
    WHEN 249 THEN 22   -- 预签准备 presignprepare
    WHEN 248 THEN 23   -- 签约准备 signprepare
    WHEN 186 THEN 24   -- 预签合同 pcontract
    WHEN 87  THEN 25   -- 签约 sign
    WHEN 88  THEN 26   -- 终止 terminal
    WHEN 86  THEN 27   -- 废单 delete
    WHEN 89  THEN 28   -- 重签 resign
    WHEN 90  THEN 29   -- 内决 balance
    WHEN 83  THEN 30   -- 决算 cal
    WHEN 176 THEN 31   -- 保修 repair
    WHEN 244 THEN 101  -- 创建 create
    WHEN 245 THEN 102  -- 多单 createAdvance
    WHEN 246 THEN 103  -- 国补 createCountry
    WHEN 91  THEN 104  -- 导出 hasExport(标志行)
    WHEN 240 THEN 105  -- 终止 terminal1(历史行, 未渲染)
END
WHERE type = 4;

-- 核验: 行按钮区无并列、无越区
-- SELECT sort, COUNT(*) FROM decoration.decorationfunction WHERE type = 4
--  GROUP BY sort HAVING COUNT(*) > 1;
