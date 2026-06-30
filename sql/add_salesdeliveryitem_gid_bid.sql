-- ============================================
-- 销售配送项表增加 商品 和 品牌 关联字段
-- 表名: sales.salesdeliveryitem
-- 字段名: gid (商品ID, 外键关联 data.goods.gid)
--         bid (品牌ID, 外键关联 communion.brand.bid)
-- 数据来源: salesdeliveryitem 关联的 salesItem 对应 goods 的 gid / bid
-- 创建时间: 2026-06-30
-- ============================================

USE sales;

-- 添加 gid 字段 (商品ID), 默认值为 0
ALTER TABLE `salesdeliveryitem`
ADD COLUMN `gid` INT NOT NULL DEFAULT 0 COMMENT '商品ID'
AFTER `siid`;

-- 添加 bid 字段 (品牌ID), 默认值为 0
ALTER TABLE `salesdeliveryitem`
ADD COLUMN `bid` INT NOT NULL DEFAULT 0 COMMENT '品牌ID'
AFTER `gid`;

-- 为已有数据回填 gid / bid (来源: 关联 salesitem -> goods)
UPDATE `salesdeliveryitem` sdi
INNER JOIN `sales`.`salesitem` si ON sdi.`siid` = si.`siid`
INNER JOIN `data`.`goods` g ON si.`gid` = g.`gid`
SET sdi.`gid` = g.`gid`,
    sdi.`bid` = g.`bid`;

-- 验证字段是否添加成功
DESC `salesdeliveryitem`;

-- 说明:
-- 1. gid 字段类型为 INT, 外键关联 data.goods.gid (PO 中 @ManyToOne GoodsPO)
-- 2. bid 字段类型为 INT, 外键关联 communion.brand.bid (PO 中 @ManyToOne BrandPO)
-- 3. 默认值为 0, NOT NULL 约束, 确保现有数据不受影响
-- 4. 位置在 siid 字段之后
-- 5. 已有数据通过 UPDATE 关联 salesitem/goods 回填
-- 6. 新增数据由 SalesDeliveryServiceImpl.deliveSalesDeliveryItem 写入
--    - goods: 直接复用 salesItem.goods
--    - brand: 通过 brandDao.get(goods.bid) 查询

-- 回滚脚本 (如需删除字段):
-- ALTER TABLE `salesdeliveryitem` DROP COLUMN `gid`;
-- ALTER TABLE `salesdeliveryitem` DROP COLUMN `bid`;
