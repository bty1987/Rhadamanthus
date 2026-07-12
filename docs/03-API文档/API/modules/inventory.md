# 仓储


## 盘点


商品库存盘点信息


> **类**: `api.inventory.CheckListAction`


#### 数据类型: `checkList`

| 参数 | 说明 | 类型 |
|------|------|------|
| `clid` | 盘点信息ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./data.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./data.html#api.data.FormatAction.format) | Object |
| `storehouse` | 仓库信息 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `type` | 类型 , 0: 盘盈 , 1: 盘亏 | Short |
| `num` | 数量 | Long |
| `createTime` | 创建时间 | Timestamp |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |


:param goodsName: 商品名
:type goodsName: String
:param storehouseName: 仓库名
:type storehouseName: String


##### `查询` pageCheckList

分页方式获取盘点信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 盘点信息列表 , 每条数据类型 `checkList`

```json
{
    ...
    "paging": {
        ...
        "data": [
            "clid": 1,
            "type": 0,
            "num": 100000,
            "createTime": "2016-01-01 00:00:00",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "storehouse": {
                "shid": 1,
                "code": "SDJ4SDF5",
                "name": "仓库"
            },
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "color": {
                "cid": 1,
                "gid": 1,
                "name": "白色"
            },
            "format": {
                "fid": 1,
                "gid": 1,
                "info": "300*300"
            }
        ],
        ...
    },
    ...
}
```

## 货单


货单信息管理

货单中类分为十二种 , 分别是: 进货 , 进退 , 出货 , 出返 , 调拨 , 采购(进货) , 辅料(出货) , 辅退(进货) , 套合 , 套拆 , 盘盈 , 盘亏

其中 , 进退对应进货 , 出返对应出货 , 需要关联已经产生的货单完成操作 .

采购类型货单 , 需要关联采购单与货单 .

辅料类型货单 , 需要关联辅料单和货单 .


> **类**: `api.inventory.ManifestAction`


#### 数据类型: `manifest`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mid` | 货单ID | Long |
| `code` | 编号 , 十二种类型分别以CG(进货), CR(进退), XG(出货), XB(出返), DB(调拨), PU(采购), AS(辅料), AR(辅退), PM(套合), PS(套拆), CP(盘盈), CL(盘亏)作为编号前缀 , 之后由8为数字组成 | String |
| `createTime` | 创建时间 | Timestamp |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `manifestTime` | 货单时间 | Timestamp |
| `type` | 类型 , 分别是: 1(进货), 2(进退), 3(出货), 4(出返), 5(调拨) , 6(采购) , 7(辅料) , 8(辅退) , 9(套合) , 10(套拆) , 11(盘盈), 12(盘亏) | Short |
| `status` | 状态 , 0: 初始 , 1: 已确认 | Short |
| `comment` | 备注 | String |
| `attachment` | 附件路径 | String |
| `quoteManifest` | 关联货单 , 类型 `manifest` , 只有类型为进退和出返需要进行关联 | Object |
| `company` | 公司 | Long |


#### 数据类型: `manifestItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `miid` | 货单项ID | Long |
| `mid` | 货单ID | Long |
| `siid` | 销售项ID | Long |
| `piid` | 采购项ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./data.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./data.html#api.data.FormatAction.format) | Object |
| `instorehouse` | 进货仓库 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `outstorehouse` | 出货仓库 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `type` | 类型 , 与货单类型一致 | Short |
| `inprice` | 入库价 | Integer |
| `outprice` | 出库价 | Integer |
| `num` | 数量 | Integer |
| `surplus` | 剩余数量 | Integer |
| `comment` | 说明 | String |
| `qmiid` | 引用货单项ID | Long |


:param orderId: 装修单号
:type orderId: String
:param manifestTime: 货单时间 , 例: 2016/01/01-2016/01/02
:type manifestTime: String


##### `查询` pageManifest

分页方式获取货单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 货单信息列表 , 每条数据类型 `manifest`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "mid": 1,
                "code": "DB1601010001",
                "creatTime": "2016-01-01 00:00:00",
                "manifestTime": "2016-01-01 00:00:00",
                "creater": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师" 
                },
                "type": 5,
                "status": 0,
                "comment": "备注",
                "attachement": "",
                "company": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryManifestByMid

通过货单编号获取货单信息

**Requests:**

- `manifest.mid` (Long): 货单ID

```json
{
    "manifest.mid": 1
}
```

**Returns:**

- `manifest` (Object): 货单信息 , 类型 `manifest`

```json
{
    ...
    "manifest":{
        "mid": 1,
        "code": "DB1601010001",
        "creater": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师" 
        },
        "creatTime": "2016-01-01 00:00:00",
        "manifestTime": "2016-01-01 00:00:00",
        "type": 5,
        "status": 0,
        "comment": "备注",
        "attachement": "",
        "company": 0
    },
    ...
}
```


##### `查询` queryManifestForPUByPids

通过采购单ID信息以及采购销售关联信息获取货单信息

**Requests:**


```json
{
    "pids[0]": 1,
    "pids[1]": 2
}
```

**Returns:**

- `manifests` (List): 货单信息列表 , 每条数据类型 `manifest`

```json
{
    ...
    "manifests":[
        {
            "mid": 1,
            "code": "DB1601010001",
            "creater": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师" 
            },
            "creatTime": "2016-01-01 00:00:00",
            "manifestTime": "2016-01-01 00:00:00",
            "type": 5,
            "status": 0,
            "comment": "备注",
            "attachement": "",
            "company": 0
        },
    ]
    ...
}
```


##### `查询` queryManifestForXGBySid

通过销售单ID以及销售货单关系获取货单信息

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```

**Returns:**

- `manifests` (List): 货单信息列表 , 每条数据类型 `manifest`

```json
{
    ...
    "manifests":[
        {
            "mid": 1,
            "code": "DB1601010001",
            "creater": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师" 
            },
            "creatTime": "2016-01-01 00:00:00",
            "manifestTime": "2016-01-01 00:00:00",
            "type": 5,
            "status": 0,
            "comment": "备注",
            "attachement": "",
            "company": 0
        },
    ]
    ...
}
```


##### `查询` queryManifestItemByMid

通过货单ID获取货单下拥有的货单项信息

**Requests:**

- `manifest.mid` (Long): 货单ID

```json
{
    "manifest.mid": 1
}
```

**Returns:**

- `manifestItems` (List): 货单项信息列表 , 每条数据类型 `manifestItem`

```json
{
    ...
    "manifestItems": [
        {
            "miid": 1,
            "mid": 1,
            "siid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "color": {
                "cid": 1,
                "gid": 1,
                "name": "白色",
            },
            "format": {
                "cid": 1,
                "gid": 1,
                "info": "300*300",
            },
            "instorehouse": {
                "shid": 1,
                "code": "SDJ4SDF5",
                "name": "仓库"
            },
            "outstorehouse": null,
            "inprice": 10000,
            "outprice": 10000,
            "num": 10000,
            "surplus": 10000,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` queryManifestByAid

通过辅料单ID获取货单信息 , 利用辅料货单关联关系

**Requests:**

- `accessoriesManifest.accessories.aid` (Long): 辅料单ID

```json
{
    "accessoriesManifest.accessories.aid": 1
}
```

**Returns:**

- `manifests` (List): 货单信息列表 , 每条数据类型 `manifest`

```json
{
    ...
    "manifests":[
        {
            "mid": 1,
            "code": "DB1601010001",
            "creater": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师" 
            },
            "creatTime": "2016-01-01 00:00:00",
            "manifestTime": "2016-01-01 00:00:00",
            "type": 5,
            "status": 0,
            "comment": "备注",
            "attachement": "",
            "company": 0
        },
    ]
    ...
}
```


##### `查询` addManifestForCG

添加进货类型货单

根据商品/颜色/规格/供应商生成商品库存信息

**Requests:**

- `manifest.manifestTime` (Timestamp): 货单时间
- `manifest.comment` (String): 备注
- `manifest.attachment` (String): 附件路径

```json
{
    "manifest.manifestTime": "2016-01-01 00:00:00",
    "manifest.comment": "说明",
    "manifest.attachment": "",
    "manifestItems[0].goods.gid": 1,
    "manifestItems[0].color.cid": 1,
    "manifestItems[0].format.fid": 1,
    "manifestItems[0].instorehouse.shid": 1,
    "manifestItems[0].outstorehouse.shid": 1,
    "manifestItems[0].inprice": 100000,
    "manifestItems[0].num": 1,
    "manifestItems[0].comment": "说明",
}
```


##### `查询` addManifestForXG

添加出货类型货单

判断商品库存不存在对应商品(颜色 , 规格) , 添加失败 , 错误信息 **260008 商品库存不足**

判断商品库存对应商品数量小于出货数量 , 添加失败 , 错误信息 **260008 商品库存不足**

判断销售项出库数量 , 数量不足 , 错误信息 **260055 销售项出库数量不足**

根据商品/颜色/规格/供应商获取商品库存信息 , 利用先入先出原则 , 减少商品库存数量

更新销售项出库剩余数量

**Requests:**

- `manifest.manifestTime` (Timestamp): 货单时间
- `manifest.comment` (String): 备注
- `manifest.attachment` (String): 附件路径

```json
{
    "manifest.manifestTime": "2016-01-01 00:00:00",
    "manifest.comment": "说明",
    "manifest.attachment": "",
    "manifestItems[0].goods.gid": 1,
    "manifestItems[0].color.cid": 1,
    "manifestItems[0].format.fid": 1,
    "manifestItems[0].instorehouse.shid": 1,
    "manifestItems[0].outstorehouse.shid": 1,
    "manifestItems[0].outprice": 100000,
    "manifestItems[0].num": 1,
    "manifestItems[0].comment": "说明",
}
```


##### `查询` addManifestForCR

添加进退类型货单

判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**

判断操作货单状态 , 非已确认进退失败 , 错误信息 **260027 货单状态不可操作**

判断操作货单中货单项数量与进退项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**

进退项中仓库为出库

生成的进退类型货单状态为已确认 , 货单项进价和出价与操作货单项进价相同

根据操作货单项信息 , 减掉商品库存中对应商品库存数量

**Requests:**

- `manifest.quoteManifest.mid` (Long): 操作货单ID

```json
{
    "manifest.quoteManifest.mid": 1,
    "manifestItems[0].miid": 1,
    "manifestItems[0].num": 1
}
```


##### `查询` addManifestForXB

添加出返类型货单

判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**

判断操作货单状态 , 非已确认出返失败 , 错误信息 **260027 货单状态不可操作**

判断操作货单中货单数量与出返项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**

出返项中仓库为进库

生成的出返类型货单状态为已确认 , 货单项进价和出价与操作货单项出价相同

根据操作货单项信息 , 增加商品库存中对应商品库存信息

**Requests:**

- `manifest.quoteManifest.mid` (Long): 操作货单ID

```json
{
    "manifest.quoteManifest.mid": 1,
    "manifestItems[0].miid": 1,
    "manifestItems[0].num": 1
}
```


##### `查询` addManifestForPU

添加采购类型货单

采购单不存在 , 添加失败 , 错误信息 **260017 采购单不存在**

入库数量大于采购项剩余数量 , 添加失败 , 错误信息 **260028 采购项剩余数量不足**

判断商品库存有无对应商品(颜色 , 规格) , 不存在创建商品库存 , 存在更新库存数量

更新采购项剩余数量

判断采购单中采购项剩余数量 , 所有项目剩余数量为0 , 更新采购单状态为 **2(全部入库)** ; 部分剩余数量为0 , 更新采购单状态为 **1(部分入库)**

更新采购货单状态为 **1(已确认)**

采购单与生成货单进行关联 , 采购货单 [purchaseManifest ](./inventory.html#api.inventory.PurchaseManifestAction.purchaseManifest)

根据商品/颜色/规格/供应商生成商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

**Requests:**


```json
{
    "purchases[0].pid": 1,
    "purchaseItems[0].piid": 1,
    "purchaseItems[0].storehouse.shid": 1,
    "purchaseItems[0].inprice": 100000,
    "purchaseItems[0].num": 10
}
```


##### `查询` addManifestForAS

添加辅料类型货单

辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

判断辅料单类型为0(普通), 状态为0(初始)/1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

判断辅料单类型为1(售后), 状态为7(审核) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

判断辅料项出库对应商品(颜色 , 规格)库存不存在 , 添加失败 , 错误信息 **260008 商品库存不足**

判断辅料项出库对应商品(颜色 , 规格)库存数量小于出库数量 , 添加失败 , 错误信息 **260008 商品库存不足**

更新辅料单状态为 **1(出货)**

更新辅料货单状态为 **1(已确认)**

辅料单与生成货单进行关联 , 辅料货单 [accessoriesManifest ](./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest)

根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

辅料项根据验证标识 , 关联工程辅料 , 验证总额上限 , 同时更新对应总额

**Requests:**


```json
{
    "accessories[0].aid": 1,
    "accessoriesItems[0].goods.gid": 1,
    "accessoriesItems[0].color.cid": 1,
    "accessoriesItems[0].format.fid": 1,
    "accessoriesItems[0].storehouse.shid": 1,
    "accessoriesItems[0].outprice": 100000,
    "accessoriesItems[0].num": 10,
    "accessoriesItems[0].checkup": 0
}
```


##### `查询` addManifestForAR

添加辅退类型货单

辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

判断辅料项剩余数量 , 退回数量大于剩余数量 , 错误信息 **260051 辅料项数量不足**

更新辅料货单状态为 **1(已确认)**

辅料单与生成货单进行关联 , 辅料货单 [accessoriesManifest ](./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest)

根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

**Requests:**


```json
{
    "accessories[0].aid": 1,
    "accessoriesItems[0].goods.gid": 1,
    "accessoriesItems[0].color.cid": 1,
    "accessoriesItems[0].format.fid": 1,
    "accessoriesItems[0].storehouse.shid": 1,
    "accessoriesItems[0].outprice": 100000,
    "accessoriesItems[0].num": 10
}
```


##### `查询` updateManifest

更新货单信息

货单信息不存在 , 更新失败 , 错误信息 **260009 货单不存在**

判断当前货单项状态 , 非初始删除失败 , 错误信息 **260027 货单状态不可操作**

**Requests:**

- `manifest.mid` (Long): 货单ID
- `manifest.manifestTime` (Timestamp): 货单时间
- `manifest.comment` (String): 备注
- `manifest.attachment` (String): 附件路径

```json
{
    "manifest.mid": 1,
    "manifest.manifestTime": "2016-01-01 00:00:00",
    "manifest.comment": "说明",
    "manifest.attachment": ""
}
```


##### `查询` addManifestItem

添加货单项信息

货单项信息不存在 , 添加失败 , 错误信息 **260010 货单项不存在**

判断当前货单项状态 , 非初始添加失败 , 错误信息 **260027 货单状态不可操作**

根据货单类型 , 选着货单项中的出库/入库 , 同时更新商品库存信息

**Requests:**

- `manifest.mid` (Long): 货单ID
- `manifestItem.goods.gid` (Long): 商品ID
- `manifestItem.color.cid` (Long): 颜色ID
- `manifestItem.format.fid` (Long): 规格ID
- `manifestItem.instorehouse.shid` (Long): 仓库ID
- `manifestItem.outstorehouse.shid` (Long): 仓库ID
- `manifestItem.inprice` (Integer): 进货价 , <可选>
- `manifestItem.outprice` (Integer): 出库价 , <可选>
- `manifestItem.num` (Integer): 数量
- `manifestItem.comment` (String): 说明

```json
{
    "manifest.mid": 1,
    "manifestItem.goods.gid": 1,
    "manifestItem.color.cid": 1,
    "manifestItem.format.fid": 1,
    "manifestItem.instorehouse.shid": 1,
    "manifestItem.outstorehouse.shid": 1,
    "manifestItem.inprice": 100000,
    "manifestItem.outprice": 100000,
    "manifestItem.num": 1,
    "manifestItem.comment": "说明"
}
```


##### `查询` updateManifestItem

更新货单项信息

货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**

判断当前货单项状态 , 非初始更新失败 , 错误信息 **260027 货单状态不可操作**

**Requests:**

- `manifest.mid` (Long): 货单ID
- `manifestItem.miid` (Long): 货单项ID
- `manifestItem.instorehouse.shid` (Long): 仓库ID
- `manifestItem.outstorehouse.shid` (Long): 仓库ID
- `manifestItem.num` (Integer): 数量
- `manifestItem.comment` (String): 说明

```json
{
    "manifest.mid": 1,
    "manifestItem.miid": 1,
    "manifestItem.instorehouse.shid": 1,
    "manifestItem.outstorehouse.shid": 1,
    "manifestItem.num": 1,
    "manifestItem.comment": "说明",
}
```


##### `查询` confirmManifest

确认货单状态

货单信息不存在 , 确认失败 , 错误信息 **260009 货单不存在**

货单状态不为初始 , 确认失败 , 错误信息 **260027 货单状态不可操作**

更新货单状态为已确认

**Requests:**

- `manifest.mid` (Long): 货单ID

```json
{
    "manifest.mid": 1
}
```


##### `查询` deleteManifestItem

删除货单项

货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**

判断当前货单项状态 , 只有初始状态才能够完成删除货单项

**Requests:**

- `manifest.mid` (Long): 货单ID
- `manifestItem.miid` (Long): 货单项ID

```json
{
    "manifest.mid": 1,
    "manifestItem.miid": 1,
}
```

## 销售


### 销售采购


> **类**: `api.inventory.SalesPurchaseAction`


#### 数据类型: `salesPurchase`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pmid` | 销售货单Id | Long |
| `sales` | 采购单 , 类型 [sales ](./inventory.html#api.inventory.SalesAction.sales) | Object |
| `purchase` | 采购单 , 类型 [purchase ](./inventory.html#api.inventory.PurchaseAction.purchase) | Object |


### 销售货单


> **类**: `api.inventory.SalesManifestAction`


#### 数据类型: `salesManifest`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pmid` | 销售货单Id | Long |
| `sales` | 采购单 , 类型 [sales ](./inventory.html#api.inventory.SalesAction.sales) | Object |
| `manifest` | 货单 , 类型 [manifest ](./inventory.html#api.inventory.ManifestAction.manifest) | Object |


## 采购


### 订单


> **类**: `api.inventory.PurchaseAction`


#### 数据类型: `purchase`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 采购单ID | Long |
| `no` | 编号 , PO作为编号前缀 , 之后由8位数字组成 | String |
| `creater` | 创建人 , 类型 [storehouse ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `deliveryTime` | 交付时间 | Timestramp |
| `balanceTime` | 结算时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 部分入库 , 2: 全部入库 | Short |
| `balanceStatus` | 结算状态 , 0: 初始 , 1: 已结算 , 2: 完结 | Short |
| `comment` | 说明 | String |
| `company` | 公司 | Long |


#### 数据类型: `purchaseItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `piid` | 采购项ID | Long |
| `pid` | 采购单ID | Long |
| `siid` | 销售项ID | Long |
| `goods` | 商品 , 类型 [goods ](./inventory.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./inventory.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./inventory.html#api.data.FormatAction.format) | Object |
| `inprice` | 商品单价 | Integer |
| `num` | 数量 | Integer |
| `surplus` | 剩余数量 | Integer |


##### `查询` pagePurchase

分页方式获取采购单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 采购单信息列表 , 每条数据类型 `purchase`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "no": "PO1601010001",
                "creater": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "deliveryTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "status": 0,
                "balanceStatus": 0,
                "comment": "说明",
                "company": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryPurchaseByPid

通过采购单ID获取采购单信息

**Requests:**

- `purchase.pid` (Long): 采购单ID
**Returns:**

- `purchase` (Object): 采购单 , 类型 `purchase`

```json
{
    ...
    "purchase": {
        "pid": 1,
        "no": "PO1601010001",
        "creater": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "createTime": "2016-01-01 00:00:00",
        "deliveryTime": "2016-01-01 00:00:00",
        "balanceTime": "2016-01-01 00:00:00",
        "status": 0,
        "balanceStatus": 0,
        "comment": "说明",
        "company": 0
    }
    ...
}
```


##### `查询` queryPurchaseBySid

通过销售单ID以及销售采购关系获取采购单信息

**Requests:**

- `sales.sid` (Long): 销售单ID
**Returns:**

- `purchases` (List): 采购单列表 , 每条数据类型 `purchase`

```json
{
    ...
    "purchases": [
        {
            "pid": 1,
            "no": "PO1601010001",
            "creater": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "deliveryTime": "2016-01-01 00:00:00",
            "balanceTime": "2016-01-01 00:00:00",
            "status": 0,
            "balanceStatus": 0,
            "comment": "说明",
            "company": 0
        }
    ]
    ...
}
```


##### `查询` addPurchase

添加采购单

判断销售项采购数量 , 数量不足 , 错误信息 **260054 销售项采购数量不足**

更新销售项采购剩余数量

**Requests:**

- `purchase.deliveryTime` (Timestamp): 交付时间
- `purchase.comment` (String): 说明

```json
{
    "purchase.comment": "说明",
    "purchase.deliveryTime": "2016-01-01 00:00:00",
    "purchaseItem[0].goods.gid": 1,
    "purchaseItem[0].color.cid": 1
    "purchaseItem[0].format.fid": 1,
    "purchaseItem[0].inprice": 100000,
    "purchaseItem[0].num": 10
}
```


##### `查询` updatePurchase

更新采购单信息

采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

更新需要判断当前订单状态 , 初始状态能够完成更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

**Requests:**

- `purchase.pid` (Long): 采购单ID
- `purchase.deliveryTime` (Timestamp): 交付时间
- `purchase.comment` (String): 说明

```json
{
    "purchase.pid": 1,
    "purchase.deliveryTime": "2016-01-01 00:00:00",
    "purchase.comment": "说明",
}
```


##### `查询` updatePurchaseForStatus

更新采购单信息

采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

采购单状态不能为全部入库 , 错误信息 **260018 采购单状态不可操作**

采购单状态更新为2(全部入库)

**Requests:**

- `purchase.pid` (Long): 采购单ID

```json
{
    "purchase.pid": 1
}
```


##### `查询` updatePurchaseForBalanceStatus

更新采购单信息

采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

采购单结算状态更新为2(完结)

**Requests:**

- `purchase.pid` (Long): 采购单ID

```json
{
    "purchase.pid": 1
}
```

### 项目


> **类**: `api.inventory.PurchaseItemAction`


#### 数据类型: `purchaseItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `piid` | 采购项ID | Long |
| `pid` | 采购单ID | Long |
| `siid` | 销售项ID | Long |
| `goods` | 商品 , 类型 [goods ](./inventory.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./inventory.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./inventory.html#api.data.FormatAction.format) | Object |
| `inprice` | 商品单价 | Integer |
| `num` | 数量 | Integer |
| `surplus` | 剩余数量 | Integer |


##### `查询` queryPurchaseItemByPid

通过采购单ID获取采购项

**Requests:**

- `purchase.pid` (Long): 采购单ID

```json
{
    "purchase.pid": 1
}
```

**Returns:**

- `purchaseItems` (List): 采购项信息列表 , 每条数据类型 `purchaseItem`

```json
{
    ...
    "purchaseItems": [
        {
            "piid": 1,
            "pid": 1,
            "siid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "color": {
                "cid": 1,
                "gid": 1,
                "name": "白色",
            },
            "format": {
                "cid": 1,
                "gid": 1,
                "info": "300*300",
            },
            "inprice": 100000,
            "num": 10000,
            "surplus": 10000
        }
    ],
    ...
}
```


##### `查询` queryPurchaseItemByPids

通过采购单ID获取采购项

**Requests:**


```json
{
    "pids[0]": 1
}
```

**Returns:**

- `purchaseItems` (List): 采购项信息列表 , 每条数据类型 `purchaseItem`

```json
{
    ...
    "purchaseItems": [
        {
            "piid": 1,
            "pid": 1,
            "siid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "color": {
                "cid": 1,
                "gid": 1,
                "name": "白色",
            },
            "format": {
                "cid": 1,
                "gid": 1,
                "info": "300*300",
            },
            "inprice": 100000,
            "num": 10000,
            "surplus": 10000
        }
    ],
    ...
}
```


##### `查询` addPurchaseItem

添加采购项

添加采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

**Requests:**

- `purchase.pid` (Long): 采购单ID
- `purchaseItem.goods.gid` (Long): 商品ID
- `purchaseItem.color.cid` (Long): 颜色ID
- `purchaseItem.format.fid` (Long): 规格ID
- `purchaseItem.inprice` (Integer): 单价
- `purchaseItem.num` (Integer): 数量

```json
{
    "purchase.pid": 1,
    "purchaseItem.goods.gid": 1,
    "purchaseItem.color.cid": 1
    "purchaseItem.format.fid": 1,
    "purchaseItem.inprice": 100000,
    "purchaseItem.num": 10
}
```


##### `查询` updatePurchaseItem

更新采购项

更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**

**Requests:**

- `purchaseItem.piid` (Long): 采购项ID
- `purchaseItem.inprice` (Integer): 单价
- `purchaseItem.num` (Integer): 数量

```json
{
    "purchaseItem.piid": 1,
    "purchaseItem.inprice": 100000,
    "purchaseItem.num": "说明",
}
```


##### `查询` deletePurchaseItem

删除采购项

更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**

**Requests:**

- `purchaseItem.piid` (Long): 采购项ID

```json
{
    "purchaseItem.piid": 1
}
```

### 货单

采购单与货单关联


> **类**: `api.inventory.PurchaseManifestAction`


#### 数据类型: `purchaseManifest`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pmid` | 采购货单Id | Long |
| `purchase` | 采购单 , 类型 [purchase ](./inventory.html#api.inventory.PurchaseAction.purchase) | Object |
| `manifest` | 货单 , 类型 [manifest ](./inventory.html#api.inventory.ManifestAction.manifest) | Object |


### 结算


> **类**: `api.inventory.PurchaseBalanceAction`


#### 数据类型: `purchaseBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pbid` | 采购结算ID | Long |
| `pid` | 采购单ID | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `balance` | 结算值 | Long |
| `status` | 状态 , 0: 初始 , 1: 已付款 | Short |
| `comment` | 说明 | String |


##### `查询` queryPurchaseBalanceByPid

通过采购单ID获取采购结算信息

**Returns:**

- `purchaseBalances` (List): 采购结算信息列表 , 每条数据类型 `purchaseBalance`

```json
{
    ...
    "purchaseBalances": [
        {
            "pbid": 1,
            "pid": 1,
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "财务"
            },
            "createTime": "2016-01-01 00:00:00",
            "balance": 100000,
            "status": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addPurchaseBalance

添加采购单对的结算信息

采购单信息不存在 , 添加失败 , 错误信息 **260017 采购单不存在**

**Requests:**

- `purchaseBalance.pid` (Long): 采购单ID
- `purchaseBalance.balance` (Long): 结算值
- `purchaseBalance.comment` (String): 说明

```json
{
    "purchaseBalance.pid": 1,
    "purchaseBalance.balance": 100000,
    "purchaseBalance.comment": "说明",
}
```


##### `查询` updatePurchaseBalance

更新采购结算信息

采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**

采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

**Requests:**

- `purchaseBalance.pbid` (Long): 采购结算ID
- `purchaseBalance.balance` (Long): 结算值
- `purchaseBalance.comment` (String): 说明

```json
{
    "purchaseBalance.pbid": 1,
    "purchaseBalance.balance": 100000,
    "purchaseBalance.comment": "说明"
}
```


##### `查询` updatePurchaseBalanceForStatus

更新采购结算状态

采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**

采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

**Requests:**

- `purchaseBalance.pbid` (Long): 采购结算ID
- `purchaseBalance.status` (Short): 状态

```json
{
    "purchaseBalance.pbid": 1,
    "purchaseBalance.status": 100.00
}
```

## 辅料


### 订单


> **类**: `api.inventory.AccessoriesAction`


#### 数据类型: `accessories`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 辅料单ID | Long |
| `no` | 编号 | String |
| `orderId` | 装修单号 | String |
| `csid` | 工程环节ID | Long |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `approver` | 审批人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `deliver` | 送货人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | TimeStamp |
| `fetchTime` | 领取时间 | TimeStamp |
| `approveTime` | 审批事件 | TimeStamp |
| `deliveTime` | 送货时间 | TimeStamp |
| `total` | 总价 | Long |
| `type` | 类型 , 0: 普通 , 1: 售后 | Short |
| `status` | 状态 , 包括: 0(初始), 1(预出), 2(出货), 3(撤销) , 4(拒绝) , 5(退回) , 6(到货), 7(审核) | Short |
| `printnum` | 打印次数 | Integer |
| `comment` | 备注 | String |
| `company` | 公司 | Long |


##### `查询` pageAccessories

分页方式获取辅料单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 订单信息列表 , 每条数据类型 `accessories`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "no": "1601010001",
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        "deliveryTime": null,
                        "developer": "222",
                        "salesPhone": "",
                        "status": 0,
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
                "creater": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "supervisor": {
                   "uid": 1,
                   "userName": "监理",
                   "currentName": "监理",
                   "duty": "设计师"
                },
                "approver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "deliver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "createTime": "2016-01-01",
                "fetchTime": "2016-01-01",
                "approveTime": "2016-01-01",
                "deliveTime": "2016-01-01",
                "total": 10000,
                "type": 0,
                "printnum": 0,
                "comment": "备注",
                "company": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryAccessoriesByOrderId

通过装修单号查询辅料单

**Requests:**

- `accessories.orderId` (String): 装修单号

```json
{
    "accessories.orderId": "1601010001"
}
```

**Returns:**

- `accessoriess` (List): 订单信息列表 , 每条数据类型 `accessories`

```json
{
    ...
    "accessoriess": [
        {
            "aid": 1,
            "no": "1601010001",
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期",
                    "deliveryTime": null,
                    "developer": "222",
                    "salesPhone": "",
                    "status": 0,
                },
                "houseNumber": "1#1-1-1",
                ...
            },
            "creater": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师"
            },
            "supervisor": {
               "uid": 1,
               "userName": "监理",
               "currentName": "监理",
               "duty": "设计师"
            },
            "approver": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师"
            },
            "deliver": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师"
            },
            "createTime": "2016-01-01",
            "fetchTime": "2016-01-01",
            "approveTime": "2016-01-01",
            "deliveTime": "2016-01-01",
            "total": 10000,
            "type": 0,
            "printnum": 0,
            "comment": "备注",
            "company": 0
        }
    ],
    ...
}
```


##### `查询` addAccessories

创建辅料单

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 5(废单)/6(终止)/7(决算)/8(完工)不可添加 , 错误信息 **140004 装修单状态不可操作**

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

判断工程环节状态为1(开工)或2(完工) , 0(初始)状态 , 错误信息 **120025 工程环节不可操作**

判断工程环节辅料控制 , 1(锁定状态) , 错误信息 **120028 辅料已禁用**

判断环节辅料总额 , 超过总额上限 , 错误信息 **260058 辅料总额已达上限**

判断辅料项对应的工程辅料数量 , 超过数量上限 , 错误信息 **辅料总数已达上限**

创建辅料单需要工程环节状态为1(开工)或2(完工)

**Requests:**

- `accessories.orderId` (String): 装修单号
- `accessories.csid` (Long): 工程环节ID
- `accessories.supervisor.userId` (String): 监理编号
- `accessories.type` (Short): 类型
- `accessories.total` (Integer): 总额
- `accessories.comment` (String): 备注
- `accessories.fetchTime` (TimeStamp): 领取时间

```json
{
    "accessories.orderId": "1601010001",
    "accessories.csid": 1,
    "accessories.fetchTime": "2016-01-01 00:00:00",
    "accessories.type": 0,
    "accessories.total": 100000,
    "accessories.comment": "备注",

    "accessoriesItems[0].goods.gid": 1,
    "accessoriesItems[0].num": 1000,
    "accessoriesItems[0].total": 100000,
    "accessoriesItems[0].checkup": 0,
    "accessoriesItems[0].caid": 1
}
```


##### `查询` updateAccessoriesForPrint

更新辅料单打印次数

辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

辅料单可打印对应的状态为1(预出)/2(出货)

计数并更新辅料单打印次数

**Requests:**

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```


##### `查询` preoutAccessories

预出辅料单

辅料单不存在 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

更新辅料单状态为1(预出)

**Requests:**

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```


##### `查询` auditAccessories

审核辅料单

辅料单不存在 , 错误信息 **260023 辅料单不存在**

辅料单类型为1(售后) , 状态为1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

更新辅料单状态为7(审核)

**Requests:**

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```


##### `查询` cancelAccessories

撤销辅料单

辅料单不存在 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

更新辅料单状态为3(撤销)

根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```


##### `查询` refuseAccessories

拒绝辅料单

辅料单不存在 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

更新辅料单状态为4(拒绝)

根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```


##### `查询` deliveAccessories

送货辅料单

辅料单不存在 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为2(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

更新辅料单状态为6(到货) , 更新送货人以及送货时间

- `accessories.aid` (Long): 辅料单ID

```json
{
    "accessories.aid": 1
}
```

### 项目


> **类**: `api.inventory.AccessoriesItemAction`


#### 数据类型: `accessoriesItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aiid` | 辅料项ID | Long |
| `aid` | 辅料单ID | Long |
| `goods` | 商品 , 类型 [user ](./inventory.html#api.data.GoodsAction.goods) | Object |
| `selling` | 销售价 | Integer |
| `num` | 数量 | Integer |
| `surplus` | 余数 | Integer |
| `checkup` | 验证标识 | Short |
| `caid` | 工程辅料ID | Long |


##### `查询` queryAccessoriesItemByOrderId

通过装修单号获取对应辅料项信息

**Requests:**

- `accessories.orderId` (String): 装修单号

```json
{
    "accessories.orderId": "1601010001"
}
```

**Returns:**

- `accessoriesItems` (List): 辅料单项信息列表 , 每条数据类型 `accessoriesItem`

```json
{
    ...
    "accessoriesItems": [
        {
            "aiid": 1,
            "aid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "selling": 100000,
            "num": 1,
            "surplus": 1
        }
    ],
    ...
}
```


##### `查询` queryAccessoriesItemByAid

通过辅料单ID获取对应辅料项信息

**Requests:**

- `accessoriesItem.aid` (Long): 辅料单ID

```json
{
    "accessoriesItem.aid": 1
}
```

**Returns:**

- `accessoriesItems` (List): 辅料单项信息列表 , 每条数据类型 `accessoriesItem`

```json
{
    ...
    "accessoriesItems": [
        {
            "aiid": 1,
            "aid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "selling": 100000,
            "num": 1,
            "surplus": 1
        }
    ],
    ...
}
```


##### `查询` queryAccessoriesItemByAids

通过辅料单ID获取对应辅料项信息

**Requests:**


```json
{
    "aids[0]": 1
}
```

**Returns:**

- `accessoriesItems` (List): 辅料单项信息列表 , 每条数据类型 `accessoriesItem`

```json
{
    ...
    "accessoriesItems": [
        {
            "aiid": 1,
            "aid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "selling": 100000,
            "num": 1,
            "surplus": 1
        }
    ],
    ...
}
```


##### `查询` addAccessoriesItem

添加辅料项到已存在辅料单

辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

**Requests:**

- `accessories.aid` (Long): 辅料单ID
- `accessories.total` (Long): 总价

```json
{
    "accessories.aid": 1,
    "accessories.total": 10000,
    "accessoriesItems[0].goods.gid": 1,
    "accessoriesItems[0].num": 1000
}
```


##### `查询` updateAccessoriesItem

更新辅料项信息

辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

辅料项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**

辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

**Requests:**

- `accessories.aid` (Long): 辅料单ID
- `accessories.total` (Long): 总价
- `accessoriesItem.aiid` (Long): 辅料项ID
- `accessoriesItem.num` (Integer): 数量

```json
{
    "accessories.aid": 1,
    "accessories.total": 10000,
    "accessoriesItem.aiid": 1,
    "accessoriesItem.num": 100000
}
```


##### `查询` deleteAccessoriesItem

删除辅料项信息

辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

辅料项不存在 , 不能删除 , 错误信息 **260025 辅料项不存在**

辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

**Requests:**

- `accessories.aid` (Long): 辅料单ID
- `accessories.total` (Long): 总价
- `accessoriesItem.aiid` (Long): 辅料项ID

```json
{
    "accessories.aid": 1,
    "accessories.total": 10000,
    "accessoriesItem.aiid": 1
}
```

### 成本


> **类**: `api.inventory.AccessoriesCostAction`


#### 数据类型: `accessoriesCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `acid` | 辅料成本ID | Long |
| `aid` | 辅料单ID | Long |
| `isAdded` | 是否为补料 | Short |
| `isEnter` | 可进园区 | Short |
| `isLift` | 有无电梯 | Short |
| `isExceed` | 有无超阶 | Short |
| `isAttic` | 有无阁楼 | Short |
| `floorNum` | 楼层数 | Integer |
| `baseNum` | 地下室层数 | Integer |
| `trafficPrice` | 运费 | Integer |
| `cost` | 成本 | Integer |
| `status` | 状态 , 0: 初始 | Short |


##### `查询` queryAccessoriesCost

查询辅料成本

辅料单不存在 , 错误信息 **260023 辅料单不存在**

**Requests:**

- `accessoriesCost.aid` (Long): 辅料单ID

```json
{
    "accessoriesCost.aid": 1
}
```

**Returns:**

- `accessoriesCost` (Object): 辅料成本

```json
{
    ...
    "accessoriesCost": {
        "acid": 1,
        "aid": 1,
        "isAdded": 0,
        "isEnter": 0,
        "isLift": 0,
        "isExceed": 0,
        "isAttic": 0,
        "floorNum": 10000,
        "baseNum": 0,
        "cost": 10000
    }
    ...
}
```


##### `查询` updateAccessoriesCost

更新辅料成本

辅料单不存在 , 错误信息 **260023 辅料单不存在**

**Requests:**

- `accessoriesCost.aid` (Long): 辅料单ID
- `accessoriesCost.isAdded` (Long): 是否为补料
- `accessoriesCost.isEnter` (Long): 可进园区
- `accessoriesCost.isLift` (Long): 有无电梯
- `accessoriesCost.isExceed` (Long): 有无超阶
- `accessoriesCost.isAttic` (Long): 有无阁楼
- `accessoriesCost.floorNum` (Long): 楼层数
- `accessoriesCost.baseNum` (Long): 地下室层数
- `accessoriesCost.cost` (Long): 成本

```json
{
    "accessoriesCost.aid": 1,
    "accessoriesCost.isAdded": 1,
    "accessoriesCost.isEnter": 0,
    "accessoriesCost.isLift": 0,
    "accessoriesCost.isExceed": 0,
    "accessoriesCost.isAttic": 0,
    "accessoriesCost.floorNum": 10000,
    "accessoriesCost.baseNum": 0,
    "accessoriesCost.cost": 10000,
}
```

### 货单

辅料单与货单关联


> **类**: `api.inventory.AccessoriesManifestAction`


#### 数据类型: `accessoriesManifest`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amid` | 辅料货单Id | Long |
| `accessories` | 辅料单 , 类型 [accessories ](./inventory.html#api.inventory.accessoriesAction.accessories) | Object |
| `manifest` | 货单 , 类型 [manifest ](./inventory.html#api.inventory.ManifestAction.manifest) | Object |


## 外辅


### 订单


外购辅料单 , 简化版辅料单功能 , 提供给厂商使用的辅料管理


> **类**: `api.inventory.OccessoriesAction`


#### 数据类型: `occessories`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oid` | 外辅单ID | Long |
| `no` | 编号 | String |
| `orderId` | 装修单号 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `deliver` | 配送人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `receiver` | 接收人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balancer` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `deliveTime` | 配送时间 | Timestamp |
| `receiveTime` | 接收时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `isEnter` | 可进园区 | Short |
| `isLift` | 有无电梯 | Short |
| `isExceed` | 有无超阶 | Short |
| `isAttic` | 有无阁楼 | Short |
| `rate` | 评分 | Integer |
| `status` | 状态 , 包括: 0(初始), 1(分配), 2(送货), 3(到货), 4(结算) , 5(完成) | Short |
| `comment` | 说明(创建) | String |
| `content` | 内容(送货) | String |
| `remake` | 评价(评分) | String |
| `company` | 公司 | Integer |


##### `查询` pageOccessories

分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 订单信息列表 , 每条数据类型 `occessories`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "oid": 1,
                "no": "1601010001",
                "creater": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "supervisor": {
                   "uid": 1,
                   "userName": "监理",
                   "currentName": "监理",
                   "duty": "设计师"
                },
                "supplier": {
                   "uid": 1,
                   "userName": "厂商",
                   "currentName": "厂商"
                },
                "deliver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "receiver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "balancer": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "createTime": "2016-01-01",
                "deliveTime": "2016-01-01",
                "receiveTime": "2016-01-01",
                "balanceTime": "2016-01-01",
                "finishTime": "2016-01-01",
                "rate": 10,
                "isEnter": 0,
                "isLift": 0,
                "isAttic": 0,
                "comment": "",
                "content": "",
                "remake": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageOccessoriesForSupplier

分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

厂商作为默认条件进行查询

**Requests:**

- `occessories.supplier.uid` (Long): 厂商ID

```json
{
    "occessories.supplier.uid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 订单信息列表 , 每条数据类型 `occessories`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "oid": 1,
                "no": "1601010001",
                "creater": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "supervisor": {
                   "uid": 1,
                   "userName": "监理",
                   "currentName": "监理",
                   "duty": "设计师"
                },
                "supplier": {
                   "uid": 1,
                   "userName": "厂商",
                   "currentName": "厂商"
                },
                "deliver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "receiver": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "balancer": {
                   "uid": 1,
                   "userName": "白雪",
                   "currentName": "白雪",
                   "duty": "设计师"
                },
                "createTime": "2016-01-01",
                "deliveTime": "2016-01-01",
                "receiveTime": "2016-01-01",
                "balanceTime": "2016-01-01",
                "finishTime": "2016-01-01",
                "rate": 10,
                "isEnter": 0,
                "isLift": 0,
                "isAttic": 0,
                "comment": "",
                "content": "",
                "remake": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryOccessoriesByOrderId

通过装修单号获取信息

**Requests:**

- `occessories.orderId` (Long): 装修单号

```json
{
    "occessories.orderId": "1601010001"
}
```

**Returns:**

- `occessories` (Object): 外辅单信息 , 类型 `occessories`

```json
{
    ...
    "occessories": {
        "oid": 1,
        "no": "1601010001",
        "creater": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "supervisor": {
           "uid": 1,
           "userName": "监理",
           "currentName": "监理",
           "duty": "设计师"
        },
        "supplier": {
           "uid": 1,
           "userName": "厂商",
           "currentName": "厂商"
        },
        "deliver": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "receiver": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "balancer": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "createTime": "2016-01-01",
        "deliveTime": "2016-01-01",
        "receiveTime": "2016-01-01",
        "balanceTime": "2016-01-01",
        "finishTime": "2016-01-01",
        "rate": 10,
        "isEnter": 0,
        "isLift": 0,
        "isAttic": 0,
        "comment": "",
        "content": "",
        "remake": ""
    }
    ...
}
```


##### `查询` queryOccessoriesByOid

通过外辅单ID获取信息

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1
}
```

**Returns:**

- `occessories` (Object): 外辅单信息 , 类型 `occessories`

```json
{
    ...
    "occessories": {
        "oid": 1,
        "no": "1601010001",
        "creater": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "supervisor": {
           "uid": 1,
           "userName": "监理",
           "currentName": "监理",
           "duty": "设计师"
        },
        "supplier": {
           "uid": 1,
           "userName": "厂商",
           "currentName": "厂商"
        },
        "deliver": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "receiver": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "balancer": {
           "uid": 1,
           "userName": "白雪",
           "currentName": "白雪",
           "duty": "设计师"
        },
        "createTime": "2016-01-01",
        "deliveTime": "2016-01-01",
        "receiveTime": "2016-01-01",
        "balanceTime": "2016-01-01",
        "finishTime": "2016-01-01",
        "rate": 10,
        "isEnter": 0,
        "isLift": 0,
        "isAttic": 0,
        "comment": "",
        "content": "",
        "remake": ""
    }
    ...
}
```


##### `查询` addOccessories

创建外辅单

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `occessories.orderId` (String): 装修单号
- `occessories.supervisor.uid` (String): 监理编号
- `occessories.isEnter` (Short): 有无电梯
- `occessories.isExceed` (Short): 有无超阶
- `occessories.isAttic` (Short): 有无阁楼
- `occessories.comment` (String): 说明

```json
{
    "occessories.orderId": "1601010001",
    "occessories.supervisor.uid": 1,
    "occessories.isLift": 0,
    "occessories.isExceed": 0,
    "occessories.isAttic": 0,
    "occessories.comment": "",

    "occessoriesItems[0].goods.gid": 1,
    "occessoriesItems[0].num": 1000,
    "occessoriesItems[0].rbalance": 1000
}
```


##### `查询` bindOccessories

绑定外辅单

外辅单不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

更新外辅单状态为1(分配)

**Requests:**

- `occessories.oid` (Long): 外辅单ID
- `occessories.supplier.uid` (Long): 厂商ID

```json
{
    "occessories.oid": 1,
    "occessories.supplier.uid": 1
}
```


##### `查询` deliveOccessories

发货外辅单

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为1(分配) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

更新外辅单状态为2(发货) , 更新发货时间和发货人

**Requests:**

- `occessories.oid` (Long): 外辅单ID
- `occessories.content` (String): 内容

```json
{
    "occessories.oid": 1,
    "occessories.content": "",

    "occessoriesItems[0].sennum": 0
}
```


##### `查询` receiveOccessories

到货外辅单

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为2(发货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

更新外辅单状态为3(到货) , 更新到货时间和接收人

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1,

    "occessoriesItems[0].oiid": 0,
    "occessoriesItems[0].recnum": 0
}
```


##### `查询` balanceOccessories

结算外辅单

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为3(到货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

更新外辅单状态为4(结算) , 更新结算时间和结算人

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1,

    "occessoriesItems[0].oiid": 0,
    "occessoriesItems[0].vbalance": 0
}
```


##### `查询` finishOccessories

完成

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为4(结算) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

更新外辅单状态为5(完成) , 更新完成时间

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1
}
```


##### `查询` rateOccessories

评分

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

**Requests:**

- `occessories.oid` (Long): 外辅单ID
- `occessories.rate` (Long): 外辅单ID
- `occessories.remake` (Long): 外辅单ID

```json
{
    "occessories.oid": 1,
    "occessories.rate": 1,
    "occessories.remake": ""
}
```


##### `查询` deleteOccessories

删除外辅单

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1
}
```

### 项目


> **类**: `api.inventory.OccessoriesItemAction`


#### 数据类型: `occessoriesItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oiid` | 外辅项ID | Long |
| `oid` | 外辅单ID | Long |
| `goods` | 商品 , 类型 [goods ](./inventory.html#api.data.GoodsAction.goods) | Object |
| `num` | 数量 | Integer |
| `sennum` | 送货数量 | Integer |
| `recnum` | 到货数量 | Integer |
| `rbalance` | 原结算价 | Integer |
| `vbalance` | 结算价 | Integer |


##### `查询` queryOccessoriesItemByOid

通过外辅单ID获取对应外辅项信息

**Requests:**

- `occessoriesItem.oid` (Long): 外辅单ID

```json
{
    "occessoriesItem.oid": 1
}
```

**Returns:**

- `occessoriesItems` (List): 外辅单项信息列表 , 每条数据类型 `occessoriesItem`

```json
{
    ...
    "occessoriesItems": [
        {
            "oiid": 1,
            "oid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "alias": "",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个"
            },
            "selling": 100000,
            "num": 1,
            "recnum": 1,
            "rbalance": 0,
            "vbalance": 0
        }
    ],
    ...
}
```


##### `查询` addOccessoriesItem

添加外辅项到已存在外辅单

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

外辅单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

**Requests:**

- `occessories.oid` (Long): 外辅单ID

```json
{
    "occessories.oid": 1,
    "occessoriesItems[0].goods.gid": 1,
    "occessoriesItems[0].num": 1000
}
```


##### `查询` updateOccessoriesItem

更新外辅项

外辅项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**

判断外辅单状态是否为4(结算) , 不可操作 , 错误信息 **260024 辅料单状态不可操作**

**Requests:**

- `occessoriesItem.oiid` (Long): 外辅项ID
- `occessoriesItem.recnum` (Integer): 数量
- `occessoriesItem.vbalance` (Integer): 结算价

```json
{
    "occessoriesItem.oiid": 1,
    "occessoriesItem.recnum": 100000,
    "occessoriesItem.vbalance": 100000
}
```


##### `查询` deleteOccessoriesItem

删除外辅项

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

**Requests:**

- `occessoriesItem.oiid` (Long): 外辅项ID

```json
{
    "occessoriesItem.oiid": 1
}
```

### 费用


> **类**: `api.inventory.OccessoriesCostAction`


#### 数据类型: `occessoriesCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ocid` | 外辅费用ID | Long |
| `oid` | 辅料单ID | Long |
| `initPrice` | 初始金额 | Integer |
| `price` | 金额 | Integer |
| `cost` | 成本 | Integer |
| `type` | 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费 | Short |
| `status` | 状态 , 0: 初始 | Short |


##### `查询` queryOccessoriesCost

查询辅料成本

辅料单不存在 , 错误信息 **260023 辅料单不存在**

**Requests:**

- `occessoriesCost.oid` (Long): 辅料单ID

```json
{
    "occessoriesCost.oid": 1
}
```

**Returns:**

- `occessoriesCost` (Object): 辅料成本

```json
{
    ...
    "occessoriesCost": {
        "ocid": 1,
        "oid": 1,
        "initPrice": 10000,
        "price": 10000,
        "cost": 10000
    }
    ...
}
```


##### `查询` addOccessoriesCost

创建外辅费用

判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

**Requests:**

- `occessoriesCost.oid` (Long): 外辅单ID
- `occessoriesCost.price` (Long): 金额
- `occessoriesCost.cost` (Long): 成本

```json
{
    "occessoriesCost.oid": 1,
    "occessoriesCost.price": 10000,
    "occessoriesCost.cost": 10000,
}
```


##### `查询` updateOccessoriesCost

更新外辅费用

**Requests:**

- `occessoriesCost.oid` (Long): 外辅单ID
- `occessoriesCost.price` (Long): 金额
- `occessoriesCost.cost` (Long): 成本

```json
{
    "occessoriesCost.oid": 1,
    "occessoriesCost.price": 10000,
    "occessoriesCost.cost": 10000,
}
```


##### `查询` deleteOccessoriesCost

删除外辅费用

**Requests:**

- `occessoriesCost.ocid` (Long): 外辅费用ID

```json
{
    "occessoriesCost.ocid": 1
}
```

## 商品库存


商品在仓库中的存量以及相关信息管理


> **类**: `api.inventory.GoodsStorehouseStockAction`


#### 数据类型: `goodsStorehouseStock`

| 参数 | 说明 | 类型 |
|------|------|------|
| `gshsid` | 库存信息ID | Long |
| `miid` | 货单项ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./data.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./data.html#api.data.FormatAction.format) | Object |
| `storehouse` | 仓库信息 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `num` | 库存量 | Long |


##### `查询` pageGoodsStorehouseStock

分页方式获取库存信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 库存信息列表 , 每条数据类型 `goodsStorehouseStock`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "gshsid": 1,
                "storehouse": {
                    "shid": 1,
                    "code": "SDJ4SDF5",
                    "name": "仓库"
                },
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "alias": "",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个"
                },
                "color": {
                    "cid": 1,
                    "gid": 1,
                    "name": "白色"
                },
                "format": {
                    "fid": 1,
                    "gid": 1,
                    "info": "300*300"
                },
                "num": 100000
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryGoodsStorehouseStockByGid

通过商品ID获取商品库存

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 商品ID

```json
{
    "goodsStorehouseStock.goods.gid": 1
}
```

**Returns:**

- `goodsStorehouseStock` (Object): 库存信息 , 其中num字段为汇总数值

```json
{
    ...
    "goodsStorehouseStock": {
        "gshsid": 1,
        "storehouse": {
            "shid": 1,
            "code": "SDJ4SDF5",
            "name": "仓库"
        },
        "goods": {
            "gid": 1,
            "no": "JGIDNEHDUIN5SD",
            "name": "瓷砖",
            "alias": "",
            "barcode": "254125212521251",
            "category": "瓷砖",
            "brand": "瓷砖",
            "measurementUnit": "个"
        },
        "color": {
            "cid": 1,
            "gid": 1,
            "name": "白色"
        },
        "format": {
            "fid": 1,
            "gid": 1,
            "info": "300*300"
        },
        "num": 100
    }
    ...
}
```


##### `查询` queryGoodsStorehouseStockByShidAGid

通过商品ID和仓库ID获取商品库存

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 商品ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID

```json
{
    "goodsStorehouseStock.goods.gid": 1
    "goodsStorehouseStock.storehouse.shid": 1
}
```

**Returns:**

- `goodsStorehouseStock` (Object): 库存信息 , 其中num字段为汇总数值

```json
{
    ...
    "goodsStorehouseStock": {
        "gshsid": 1,
        "storehouse": {
            "shid": 1,
            "code": "SDJ4SDF5",
            "name": "仓库"
        },
        "goods": {
            "gid": 1,
            "no": "JGIDNEHDUIN5SD",
            "name": "瓷砖",
            "alias": "",
            "barcode": "254125212521251",
            "category": "瓷砖",
            "brand": "瓷砖",
            "measurementUnit": "个"
        },
        "color": {
            "cid": 1,
            "gid": 1,
            "name": "白色"
        },
        "format": {
            "fid": 1,
            "gid": 1,
            "info": "300*300"
        },
        "num": 100
    }
    ...
}
```


##### `查询` makeGoodsStorehouseStock

生成商品库存 , 库存数量默认为0

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 商品ID
- `goodsStorehouseStock.color.cid` (Long): 颜色ID
- `goodsStorehouseStock.format.fid` (Long): 规格ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID

```json
{
    "goodsStorehouseStock.goods.gid": 1,
    "goodsStorehouseStock.color.cid": 1,
    "goodsStorehouseStock.format.fid": 1,
    "goodsStorehouseStock.storehouse.shid": 1
}
```


##### `查询` plusGoodsStorehouseStock

盘盈

判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**

生成对应货单以及货单项

生成对应商品(供应商/颜色/规格)库存信息

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 商品ID
- `goodsStorehouseStock.color.cid` (Long): 颜色ID
- `goodsStorehouseStock.format.fid` (Long): 规格ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID
- `goodsStorehouseStock.num` (Long): 数量
- `goodsStorehouseStock.surplus` (Long): 采购价

```json
{
    "goodsStorehouseStock.goods.gid": 1,
    "goodsStorehouseStock.color.cid": 1,
    "goodsStorehouseStock.format.fid": 1,
    "goodsStorehouseStock.storehouse.shid": 1,
    "goodsStorehouseStock.num": 1000,
    "goodsStorehouseStock.surplus": 10000
}
```


##### `查询` loseGoodsStorehouseStock

盘亏

判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**

判断商品(供应商/颜色/规格)是否存在商品库存数量是否满足盘亏数量 , 错误信息 **260008 商品库存不足**

生成对应货单以及货单项

根据对应的商品(供应商/颜色/规格)库存 , 按照盘亏数量以及先入先出规则进行匹配 , 减少对应商品库存

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 商品ID
- `goodsStorehouseStock.color.cid` (Long): 颜色ID
- `goodsStorehouseStock.format.fid` (Long): 规格ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID
- `goodsStorehouseStock.num` (Long): 数量

```json
{
    "goodsStorehouseStock.goods.gid": 1,
    "goodsStorehouseStock.color.cid": 1,
    "goodsStorehouseStock.format.fid": 1,
    "goodsStorehouseStock.storehouse.shid": 1,
    "goodsStorehouseStock.num": 1000
}
```


##### `查询` mergePackage

合并套餐库存

判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**

判断套餐归属商品库存 , 库存量不足 , 错误信息 **260008 商品库存不足**

如果套餐库存不存在创建套餐对应的库存信息

更新套餐归属商品库存量

创建套合类型货单

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 套餐ID
- `goodsStorehouseStock.color.cid` (Long): 颜色ID
- `goodsStorehouseStock.format.fid` (Long): 规格ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID
- `goodsStorehouseStock.num` (Long): 合并数量

```json
{
    "goodsStorehouseStock.goods.gid": 1,
    "goodsStorehouseStock.color.cid": 1,
    "goodsStorehouseStock.format.fid": 1,
    "goodsStorehouseStock.storehouse.shid": 1,
    "goodsStorehouseStock.num": 10000
}
```


##### `查询` splitPackage

拆分套餐库存

判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**

判断套餐库存 , 库存量不足 , 错误信息 **260008 商品库存不足**

如果套餐归属商品库存不存在创建商品对应的库存信息

更新套餐归属商品库存量

创建拆类型货单

**Requests:**

- `goodsStorehouseStock.goods.gid` (Long): 套餐ID
- `goodsStorehouseStock.color.cid` (Long): 颜色ID
- `goodsStorehouseStock.format.fid` (Long): 规格ID
- `goodsStorehouseStock.storehouse.shid` (Long): 仓库ID
- `goodsStorehouseStock.num` (Integer): 合并数量

```json
{
    "goodsStorehouseStock.goods.gid": 1,
    "goodsStorehouseStock.color.cid": 1,
    "goodsStorehouseStock.format.fid": 1,
    "goodsStorehouseStock.storehouse.shid": 1,
    "goodsStorehouseStock.num": 10000
}
```

## 库存


库存信息 , 按照月份统计仓库存量


> **类**: `api.inventory.StorehouseStockAction`


#### 数据类型: `storehouseStock`

| 参数 | 说明 | 类型 |
|------|------|------|
| `shsid` | 库存ID | Long |
| `storehouse` | 仓库信息 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `month` | 年月 , 格式 "yyyyMM" | String |
| `num` | 存量 | Long |


##### `查询` queryStorehouseStock

获取仓库存量信息

**Returns:**

- `storehouseStocks` (List): 库存信息列表 , 每条数据类型 `storehouseStock`

```json
{
    ...
    "storehouseStocks": [
        {
            "shsid": 1,
            "storehouse": {
                "shid": 1,
                "code": "SDJ4SDF5",
                "name": "仓库"
            },
            "month": "201601",
            "num": 10000,
        }
    ],
    ...
}
```

## 图片


图片信息管理 , 提供如楼盘图片等资源


> **类**: `api.inventory.InventoryDrawingAction`


#### 数据类型: `inventoryDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `idid` | 图片ID | Long |
| `sid` | 关联ID | Long |
| `name` | 名称 | String |
| `path` | 图片路径 | String |
| `size` | 图片大小 | Integer |
| `type` | 图片类型 , 0: 本地 , 1: 钉钉 | Short |
| `atttype` | 类型 , 0: 外辅 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` queryInventoryDrawing

通过关联ID以及类型获取图片信息

**Requests:**

- `inventoryDrawing.sid` (Long): 关联ID
- `inventoryDrawing.atttype` (Short): 业务类型

```json
{
    "inventoryDrawing.sid": 1,
    "inventoryDrawing.atttype": 0
}
```

**Returns:**

- `inventoryDrawings` (List): 图片信息列表 , 每条数据类型 `inventoryDrawing`

```json
{
    ...
    "inventoryDrawings": [
        {
            "sdid": 1,
            "sid": 1,
            "name": "SDFK4DFS4D5",
            "path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
            "size": 0,
            "type": 0,
            "atttype": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `创建` addInventoryDrawing

添加图片信息

**Requests:**

- `inventoryDrawing.sid` (Long): 关联ID
- `inventoryDrawing.name` (String): 名称
- `inventoryDrawing.path` (String): 路径
- `inventoryDrawing.type` (Short): 图片类型
- `inventoryDrawing.atttype` (Short): 业务类型

```json
{
    "inventoryDrawing.sid": 1,
    "inventoryDrawing.name": "name.jpg",
    "inventoryDrawing.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
    "inventoryDrawing.type": 0,
    "inventoryDrawing.atttype": 0
}
```


##### `创建` deleteInventoryDrawing

删除图片信息

**Requests:**

- `inventoryDrawing.idid` (Long): 图片ID

```json
{
    "inventoryDrawing.idid": 1
}
```
