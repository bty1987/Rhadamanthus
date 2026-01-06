# inventory 仓储
## 盘点

商品库存盘点信息

## api.inventory.CheckListAction

**数据类型**:

#### checkList

    - **clid**: 盘点信息ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./data.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./data.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **storehouse**: 仓库信息 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **type**: 类型 , 0: 盘盈 , 1: 盘亏
      - 类型: *Short*
    - **num**: 数量
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

        |Filters:|
        - **goodsName**: 商品名
      - 类型: *String*
    - **storehouseName**: 仓库名
      - 类型: *String*

    ### `pageCheckList` <span style="color:gray">[内部]</span>

        分页方式获取盘点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  盘点信息列表 , 每条数据类型 *checkList*

        **示例**:{
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

## 货单

货单信息管理

货单中类分为十二种 , 分别是: 进货 , 进退 , 出货 , 出返 , 调拨 , 采购(进货) , 辅料(出货) , 辅退(进货) , 套合 , 套拆 , 盘盈 , 盘亏

其中 , 进退对应进货 , 出返对应出货 , 需要关联已经产生的货单完成操作 .

采购类型货单 , 需要关联采购单与货单 .

辅料类型货单 , 需要关联辅料单和货单 .

## api.inventory.ManifestAction

**数据类型**:

#### manifest

    - **mid**: 货单ID
      - 类型: *Long*
    - **code**: 编号 , 十二种类型分别以CG(进货), CR(进退), XG(出货), XB(出返), DB(调拨), PU(采购), AS(辅料), AR(辅退), PM(套合), PS(套拆), CP(盘盈), CL(盘亏)作为编号前缀 , 之后由8为数字组成
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **manifestTime**: 货单时间
      - 类型: *Timestamp*
    - **type**: 类型 , 分别是: 1(进货), 2(进退), 3(出货), 4(出返), 5(调拨) , 6(采购) , 7(辅料) , 8(辅退) , 9(套合) , 10(套拆) , 11(盘盈), 12(盘亏)
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 已确认
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    - **attachment**: 附件路径
      - 类型: *String*
    - **quoteManifest**: 关联货单 , 类型 *manifest* , 只有类型为进退和出返需要进行关联
      - 类型: *Object*
    - **company**: 公司
      - 类型: *Long*

    #### manifestItem

    - **miid**: 货单项ID
      - 类型: *Long*
    - **mid**: 货单ID
      - 类型: *Long*
    - **siid**: 销售项ID
      - 类型: *Long*
    - **piid**: 采购项ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./data.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./data.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **instorehouse**: 进货仓库 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **outstorehouse**: 出货仓库 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **type**: 类型 , 与货单类型一致
      - 类型: *Short*
    - **inprice**: 入库价
      - 类型: *Integer*
    - **outprice**: 出库价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **surplus**: 剩余数量
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    - **qmiid**: 引用货单项ID
      - 类型: *Long*

        |Filters:|
        - **orderId**: 装修单号
      - 类型: *String*
    - **manifestTime**: 货单时间 , 例: 2016/01/01-2016/01/02
      - 类型: *String*

    ### `pageManifest` <span style="color:gray">[内部]</span>

        分页方式获取货单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  货单信息列表 , 每条数据类型 *manifest*

        **示例**:{
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

    ### `queryManifestByMid` <span style="color:gray">[内部]</span>

        通过货单编号获取货单信息

**请求参数**:

- **manifest.mid**:
  货单ID

        **示例**:{
                "manifest.mid": 1
            }

**返回参数**:

- **manifest**: 货单信息 , 类型 *manifest*
          - 类型: *Object*

        **示例**:{
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

    ### `queryManifestForPUByPids` <span style="color:gray">[内部]</span>

        通过采购单ID信息以及采购销售关联信息获取货单信息

**请求参数**:

- **pids[n]**:
  采购单ID列表 , 每条数据类型 Long

        **示例**:{
                "pids[0]": 1,
                "pids[1]": 2
            }

**返回参数**:

- **manifests**: 货单信息列表 , 每条数据类型 *manifest*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestForXGBySid` <span style="color:gray">[内部]</span>

        通过销售单ID以及销售货单关系获取货单信息

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

**返回参数**:

- **manifests**: 货单信息列表 , 每条数据类型 *manifest*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestItemByMid` <span style="color:gray">[内部]</span>

        通过货单ID获取货单下拥有的货单项信息

**请求参数**:

- **manifest.mid**:
  货单ID

        **示例**:{
                "manifest.mid": 1
            }

**返回参数**:

- **manifestItems**: 货单项信息列表 , 每条数据类型 *manifestItem*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestByAid` <span style="color:gray">[内部]</span>

        通过辅料单ID获取货单信息 , 利用辅料货单关联关系

**请求参数**:

- **accessoriesManifest.accessories.aid**:
  辅料单ID

        **示例**:{
                "accessoriesManifest.accessories.aid": 1
            }

**返回参数**:

- **manifests**: 货单信息列表 , 每条数据类型 *manifest*
          - 类型: *List*

        **示例**:{
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

    ### `addManifestForCG` <span style="color:gray">[内部]</span>

        添加进货类型货单

        根据商品/颜色/规格/供应商生成商品库存信息

**请求参数**:

- **manifest.manifestTime**:
  货单时间
        - **manifest.comment**:
  备注
        - **manifest.attachment**:
  附件路径

        - **manifestItems[n].goods.gid**:
  商品ID
        - **manifestItems[n].color.cid**:
  颜色ID
        - **manifestItems[n].format.fid**:
  规格ID
        - **manifestItems[n].instorehouse.shid**:
  仓库ID
        - **manifestItems[n].inprice**:
  入库价
        - **manifestItems[n].num**:
  数量
        - **manifestItems[n].comment**:
  说明

        **示例**:{
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

    ### `addManifestForXG` <span style="color:gray">[内部]</span>

        添加出货类型货单

        判断商品库存不存在对应商品(颜色 , 规格) , 添加失败 , 错误信息 **260008 商品库存不足**

        判断商品库存对应商品数量小于出货数量 , 添加失败 , 错误信息 **260008 商品库存不足**

        判断销售项出库数量 , 数量不足 , 错误信息 **260055 销售项出库数量不足**

        根据商品/颜色/规格/供应商获取商品库存信息 , 利用先入先出原则 , 减少商品库存数量

        更新销售项出库剩余数量

**请求参数**:

- **manifest.manifestTime**:
  货单时间
        - **manifest.comment**:
  备注
        - **manifest.attachment**:
  附件路径

        - **manifestItems[n].goods.gid**:
  商品ID
        - **manifestItems[n].color.cid**:
  颜色ID
        - **manifestItems[n].format.fid**:
  规格ID
        - **manifestItems[n].outstorehouse.shid**:
  仓库ID
        - **manifestItems[n].outprice**:
  出库价
        - **manifestItems[n].num**:
  数量
        - **manifestItems[n].comment**:
  说明

        **示例**:{
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

    ### `addManifestForCR` <span style="color:gray">[内部]</span>

        添加进退类型货单

        判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**

        判断操作货单状态 , 非已确认进退失败 , 错误信息 **260027 货单状态不可操作**

        判断操作货单中货单项数量与进退项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**

        进退项中仓库为出库

        生成的进退类型货单状态为已确认 , 货单项进价和出价与操作货单项进价相同

        根据操作货单项信息 , 减掉商品库存中对应商品库存数量

**请求参数**:

- **manifest.quoteManifest.mid**:
  操作货单ID

        - **manifestItems[n].miid**:
  进退项ID
        - **manifestItems[n].num**:
  数量

        **示例**:{
                "manifest.quoteManifest.mid": 1,
                "manifestItems[0].miid": 1,
                "manifestItems[0].num": 1
            }

    ### `addManifestForXB` <span style="color:gray">[内部]</span>

        添加出返类型货单

        判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**

        判断操作货单状态 , 非已确认出返失败 , 错误信息 **260027 货单状态不可操作**

        判断操作货单中货单数量与出返项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**

        出返项中仓库为进库

        生成的出返类型货单状态为已确认 , 货单项进价和出价与操作货单项出价相同

        根据操作货单项信息 , 增加商品库存中对应商品库存信息

**请求参数**:

- **manifest.quoteManifest.mid**:
  操作货单ID

        - **manifestItems[n].miid**:
  进退项ID
        - **manifestItems[n].num**:
  数量

        **示例**:{
                "manifest.quoteManifest.mid": 1,
                "manifestItems[0].miid": 1,
                "manifestItems[0].num": 1
            }

    ### `addManifestForPU` <span style="color:gray">[内部]</span>

        添加采购类型货单

        采购单不存在 , 添加失败 , 错误信息 **260017 采购单不存在**

        入库数量大于采购项剩余数量 , 添加失败 , 错误信息 **260028 采购项剩余数量不足**

        判断商品库存有无对应商品(颜色 , 规格) , 不存在创建商品库存 , 存在更新库存数量

        更新采购项剩余数量

        判断采购单中采购项剩余数量 , 所有项目剩余数量为0 , 更新采购单状态为 **2(全部入库)** ; 部分剩余数量为0 , 更新采购单状态为 **1(部分入库)**

        更新采购货单状态为 **1(已确认)**

        采购单与生成货单进行关联 , 采购货单 [purchaseManifest](./inventory.html#api.inventory.PurchaseManifestAction.purchaseManifest)

        根据商品/颜色/规格/供应商生成商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

**请求参数**:

- **purchases[n].pid**:
  采购单ID
        - **purchaseItems[n].piid**:
  采购项ID
        - **purchaseItems[n].storehouse.shid**:
  仓库ID
        - **purchaseItems[n].inprice**:
  入库价
        - **purchaseItems[n].num**:
  入库数量

        **示例**:{
                "purchases[0].pid": 1,
                "purchaseItems[0].piid": 1,
                "purchaseItems[0].storehouse.shid": 1,
                "purchaseItems[0].inprice": 100000,
                "purchaseItems[0].num": 10
            }

    ### `addManifestForAS` <span style="color:gray">[内部]</span>

        添加辅料类型货单

        辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        判断辅料单类型为0(普通), 状态为0(初始)/1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        判断辅料单类型为1(售后), 状态为7(审核) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        判断辅料项出库对应商品(颜色 , 规格)库存不存在 , 添加失败 , 错误信息 **260008 商品库存不足**

        判断辅料项出库对应商品(颜色 , 规格)库存数量小于出库数量 , 添加失败 , 错误信息 **260008 商品库存不足**

        更新辅料单状态为 **1(出货)**

        更新辅料货单状态为 **1(已确认)**

        辅料单与生成货单进行关联 , 辅料货单 [accessoriesManifest](./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest)

        根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

        辅料项根据验证标识 , 关联工程辅料 , 验证总额上限 , 同时更新对应总额

**请求参数**:

- **accessories[n].aid**:
  辅料单ID
        - **accessoriesItems[n].goods.gid**:
  商品ID
        - **accessoriesItems[n].color.cid**:
  颜色ID
        - **accessoriesItems[n].format.fid**:
  规格ID
        - **accessoriesItems[n].storehouse.shid**:
  仓库ID
        - **accessoriesItems[n].outprice**:
  出库价
        - **accessoriesItems[n].num**:
  出库数量
        - **accessoriesItems[n].checkup**:
  验证标识

        **示例**:{
                "accessories[0].aid": 1,
                "accessoriesItems[0].goods.gid": 1,
                "accessoriesItems[0].color.cid": 1,
                "accessoriesItems[0].format.fid": 1,
                "accessoriesItems[0].storehouse.shid": 1,
                "accessoriesItems[0].outprice": 100000,
                "accessoriesItems[0].num": 10,
                "accessoriesItems[0].checkup": 0
            }

    ### `addManifestForAR` <span style="color:gray">[内部]</span>

        添加辅退类型货单

        辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        判断辅料项剩余数量 , 退回数量大于剩余数量 , 错误信息 **260051 辅料项数量不足**

        更新辅料货单状态为 **1(已确认)**

        辅料单与生成货单进行关联 , 辅料货单 [accessoriesManifest](./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest)

        根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价

**请求参数**:

- **accessories[n].aid**:
  辅料单ID
        - **accessoriesItems[n].goods.gid**:
  商品ID
        - **accessoriesItems[n].color.cid**:
  颜色ID
        - **accessoriesItems[n].format.fid**:
  规格ID
        - **accessoriesItems[n].storehouse.shid**:
  仓库ID
        - **accessoriesItems[n].outprice**:
  出库价
        - **accessoriesItems[n].num**:
  出库数量

        **示例**:{
                "accessories[0].aid": 1,
                "accessoriesItems[0].goods.gid": 1,
                "accessoriesItems[0].color.cid": 1,
                "accessoriesItems[0].format.fid": 1,
                "accessoriesItems[0].storehouse.shid": 1,
                "accessoriesItems[0].outprice": 100000,
                "accessoriesItems[0].num": 10
            }

    ### `updateManifest` <span style="color:gray">[内部]</span>

        更新货单信息

        货单信息不存在 , 更新失败 , 错误信息 **260009 货单不存在**

        判断当前货单项状态 , 非初始删除失败 , 错误信息 **260027 货单状态不可操作**

**请求参数**:

- **manifest.mid**:
  货单ID
        - **manifest.manifestTime**:
  货单时间
        - **manifest.comment**:
  备注
        - **manifest.attachment**:
  附件路径

        **示例**:{
                "manifest.mid": 1,
                "manifest.manifestTime": "2016-01-01 00:00:00",
                "manifest.comment": "说明",
                "manifest.attachment": ""
            }

    ### `addManifestItem` <span style="color:gray">[内部]</span>

        添加货单项信息

        货单项信息不存在 , 添加失败 , 错误信息 **260010 货单项不存在**

        判断当前货单项状态 , 非初始添加失败 , 错误信息 **260027 货单状态不可操作**

        根据货单类型 , 选着货单项中的出库/入库 , 同时更新商品库存信息

**请求参数**:

- **manifest.mid**:
  货单ID

        - **manifestItem.goods.gid**:
  商品ID
        - **manifestItem.color.cid**:
  颜色ID
        - **manifestItem.format.fid**:
  规格ID
        - **manifestItem.instorehouse.shid**:
  仓库ID
        - **manifestItem.outstorehouse.shid**:
  仓库ID
        - **manifestItem.inprice**:
  进货价 , <可选>
        - **manifestItem.outprice**:
  出库价 , <可选>
        - **manifestItem.num**:
  数量
        - **manifestItem.comment**:
  说明

        **示例**:{
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

    ### `updateManifestItem` <span style="color:gray">[内部]</span>

        更新货单项信息

        货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**

        判断当前货单项状态 , 非初始更新失败 , 错误信息 **260027 货单状态不可操作**

**请求参数**:

- **manifest.mid**:
  货单ID

        - **manifestItem.miid**:
  货单项ID
        - **manifestItem.instorehouse.shid**:
  仓库ID
        - **manifestItem.outstorehouse.shid**:
  仓库ID
        - **manifestItem.num**:
  数量
        - **manifestItem.comment**:
  说明

        **示例**:{
                "manifest.mid": 1,
                "manifestItem.miid": 1,
                "manifestItem.instorehouse.shid": 1,
                "manifestItem.outstorehouse.shid": 1,
                "manifestItem.num": 1,
                "manifestItem.comment": "说明",
            }

    ### `confirmManifest` <span style="color:gray">[内部]</span>

        确认货单状态

        货单信息不存在 , 确认失败 , 错误信息 **260009 货单不存在**

        货单状态不为初始 , 确认失败 , 错误信息 **260027 货单状态不可操作**

        更新货单状态为已确认

**请求参数**:

- **manifest.mid**:
  货单ID

        **示例**:{
                "manifest.mid": 1
            }

    ### `deleteManifestItem` <span style="color:gray">[内部]</span>

        删除货单项

        货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**

        判断当前货单项状态 , 只有初始状态才能够完成删除货单项

**请求参数**:

- **manifest.mid**:
  货单ID

        - **manifestItem.miid**:
  货单项ID

        **示例**:{
                "manifest.mid": 1,
                "manifestItem.miid": 1,
            }

## 销售

### 销售采购

## api.inventory.SalesPurchaseAction

**数据类型**:

#### salesPurchase

    - **pmid**: 销售货单Id
      - 类型: *Long*
    - **sales**: 采购单 , 类型 [sales](./inventory.html#api.inventory.SalesAction.sales)
      - 类型: *Object*
    - **purchase**: 采购单 , 类型 [purchase](./inventory.html#api.inventory.PurchaseAction.purchase)
      - 类型: *Object*

### 销售货单

## api.inventory.SalesManifestAction

**数据类型**:

#### salesManifest

    - **pmid**: 销售货单Id
      - 类型: *Long*
    - **sales**: 采购单 , 类型 [sales](./inventory.html#api.inventory.SalesAction.sales)
      - 类型: *Object*
    - **manifest**: 货单 , 类型 [manifest](./inventory.html#api.inventory.ManifestAction.manifest)
      - 类型: *Object*

## 采购

### 订单

## api.inventory.PurchaseAction

**数据类型**:

#### purchase

    - **pid**: 采购单ID
      - 类型: *Long*
    - **no**: 编号 , PO作为编号前缀 , 之后由8位数字组成
      - 类型: *String*
    - **creater**: 创建人 , 类型 [storehouse](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **deliveryTime**: 交付时间
      - 类型: *Timestramp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 部分入库 , 2: 全部入库
      - 类型: *Short*
    - **balanceStatus**: 结算状态 , 0: 初始 , 1: 已结算 , 2: 完结
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String *
    - **company**: 公司
      - 类型: *Long*

    #### purchaseItem

    - **piid**: 采购项ID
      - 类型: *Long*
    - **pid**: 采购单ID
      - 类型: *Long*
    - **siid**: 销售项ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./inventory.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./inventory.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **inprice**: 商品单价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **surplus**: 剩余数量
      - 类型: *Integer*

    ### `pagePurchase` <span style="color:gray">[内部]</span>

        分页方式获取采购单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  采购单信息列表 , 每条数据类型 *purchase*

        **示例**:{
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

    ### `queryPurchaseByPid` <span style="color:gray">[内部]</span>

        通过采购单ID获取采购单信息

**请求参数**:

- **purchase.pid**:
  采购单ID

**返回参数**:

- **purchase**: 采购单 , 类型 *purchase*
          - 类型: *Object*

        **示例**:{
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

    ### `queryPurchaseBySid` <span style="color:gray">[内部]</span>

        通过销售单ID以及销售采购关系获取采购单信息

**请求参数**:

- **sales.sid**:
  销售单ID

**返回参数**:

- **purchases**: 采购单列表 , 每条数据类型 *purchase*
          - 类型: *List*

        **示例**:{
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

    ### `addPurchase` <span style="color:gray">[内部]</span>

        添加采购单

        判断销售项采购数量 , 数量不足 , 错误信息 **260054 销售项采购数量不足**

        更新销售项采购剩余数量

**请求参数**:

- **purchase.deliveryTime**:
  交付时间
        - **purchase.comment**:
  说明

        - **purchaseItems[n].siid**:
  销售项ID
        - **purchaseItems[n].goods.gid**:
  商品ID
        - **purchaseItems[n].color.cid**:
  颜色ID
        - **purchaseItems[n].format.fid**:
  规格ID
        - **purchaseItems[n].inprice**:
  进价
        - **purchaseItems[n].num**:
  数量

        **示例**:{
                "purchase.comment": "说明",
                "purchase.deliveryTime": "2016-01-01 00:00:00",
                "purchaseItem[0].goods.gid": 1,
                "purchaseItem[0].color.cid": 1
                "purchaseItem[0].format.fid": 1,
                "purchaseItem[0].inprice": 100000,
                "purchaseItem[0].num": 10
            }

    ### `updatePurchase` <span style="color:gray">[内部]</span>

        更新采购单信息

        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

        更新需要判断当前订单状态 , 初始状态能够完成更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

**请求参数**:

- **purchase.pid**:
  采购单ID
        - **purchase.deliveryTime**:
  交付时间
        - **purchase.comment**:
  说明

        **示例**:{
                "purchase.pid": 1,
                "purchase.deliveryTime": "2016-01-01 00:00:00",
                "purchase.comment": "说明",
            }

    ### `updatePurchaseForStatus` <span style="color:gray">[内部]</span>

        更新采购单信息

        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

        采购单状态不能为全部入库 , 错误信息 **260018 采购单状态不可操作**

        采购单状态更新为2(全部入库)

**请求参数**:

- **purchase.pid**:
  采购单ID

        **示例**:{
                "purchase.pid": 1
            }

    ### `updatePurchaseForBalanceStatus` <span style="color:gray">[内部]</span>

        更新采购单信息

        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**

        采购单结算状态更新为2(完结)

**请求参数**:

- **purchase.pid**:
  采购单ID

        **示例**:{
                "purchase.pid": 1
            }

### 项目

## api.inventory.PurchaseItemAction

**数据类型**:

#### purchaseItem

    - **piid**: 采购项ID
      - 类型: *Long*
    - **pid**: 采购单ID
      - 类型: *Long*
    - **siid**: 销售项ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./inventory.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./inventory.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **inprice**: 商品单价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **surplus**: 剩余数量
      - 类型: *Integer*

    ### `queryPurchaseItemByPid` <span style="color:gray">[内部]</span>

        通过采购单ID获取采购项

**请求参数**:

- **purchase.pid**:
  采购单ID

        **示例**:{
                "purchase.pid": 1
            }

**返回参数**:

- **purchaseItems**: 采购项信息列表 , 每条数据类型 *purchaseItem*
          - 类型: *List*

        **示例**:{
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

    ### `queryPurchaseItemByPids` <span style="color:gray">[内部]</span>

        通过采购单ID获取采购项

**请求参数**:

- **pids[n]**:
  采购单ID列表 , 每条数据类型 Long

        **示例**:{
                "pids[0]": 1
            }

**返回参数**:

- **purchaseItems**: 采购项信息列表 , 每条数据类型 *purchaseItem*
          - 类型: *List*

        **示例**:{
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

    ### `addPurchaseItem` <span style="color:gray">[内部]</span>

        添加采购项

        添加采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

**请求参数**:

- **purchase.pid**:
  采购单ID
        - **purchaseItem.goods.gid**:
  商品ID
        - **purchaseItem.color.cid**:
  颜色ID
        - **purchaseItem.format.fid**:
  规格ID
        - **purchaseItem.inprice**:
  单价
        - **purchaseItem.num**:
  数量

        **示例**:{
                "purchase.pid": 1,
                "purchaseItem.goods.gid": 1,
                "purchaseItem.color.cid": 1
                "purchaseItem.format.fid": 1,
                "purchaseItem.inprice": 100000,
                "purchaseItem.num": 10
            }

    ### `updatePurchaseItem` <span style="color:gray">[内部]</span>

        更新采购项

        更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

        更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**

**请求参数**:

- **purchaseItem.piid**:
  采购项ID
        - **purchaseItem.inprice**:
  单价
        - **purchaseItem.num**:
  数量

        **示例**:{
                "purchaseItem.piid": 1,
                "purchaseItem.inprice": 100000,
                "purchaseItem.num": "说明",
            }

    ### `deletePurchaseItem` <span style="color:gray">[内部]</span>

        删除采购项

        更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**

        更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**

**请求参数**:

- **purchaseItem.piid**:
  采购项ID

        **示例**:{
                "purchaseItem.piid": 1
            }

### 货单
采购单与货单关联

## api.inventory.PurchaseManifestAction

**数据类型**:

#### purchaseManifest

    - **pmid**: 采购货单Id
      - 类型: *Long*
    - **purchase**: 采购单 , 类型 [purchase](./inventory.html#api.inventory.PurchaseAction.purchase)
      - 类型: *Object*
    - **manifest**: 货单 , 类型 [manifest](./inventory.html#api.inventory.ManifestAction.manifest)
      - 类型: *Object*

### 结算

## api.inventory.PurchaseBalanceAction

**数据类型**:

#### purchaseBalance

    - **pbid**: 采购结算ID
      - 类型: *Long*
    - **pid**: 采购单ID
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **balance**: 结算值
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 已付款
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    ### `queryPurchaseBalanceByPid` <span style="color:gray">[内部]</span>

        通过采购单ID获取采购结算信息

**返回参数**:

- **purchaseBalances**: 采购结算信息列表 , 每条数据类型 *purchaseBalance*
          - 类型: *List*

        **示例**:{
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

    ### `addPurchaseBalance` <span style="color:gray">[内部]</span>

        添加采购单对的结算信息

        采购单信息不存在 , 添加失败 , 错误信息 **260017 采购单不存在**

**请求参数**:

- **purchaseBalance.pid**:
  采购单ID
        - **purchaseBalance.balance**:
  结算值
        - **purchaseBalance.comment**:
  说明

        **示例**:{
                "purchaseBalance.pid": 1,
                "purchaseBalance.balance": 100000,
                "purchaseBalance.comment": "说明",
            }

    ### `updatePurchaseBalance` <span style="color:gray">[内部]</span>

        更新采购结算信息

        采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**

        采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

**请求参数**:

- **purchaseBalance.pbid**:
  采购结算ID
        - **purchaseBalance.balance**:
  结算值
        - **purchaseBalance.comment**:
  说明

        **示例**:{
                "purchaseBalance.pbid": 1,
                "purchaseBalance.balance": 100000,
                "purchaseBalance.comment": "说明"
            }

    ### `updatePurchaseBalanceForStatus` <span style="color:gray">[内部]</span>

        更新采购结算状态

        采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**

        采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

**请求参数**:

- **purchaseBalance.pbid**:
  采购结算ID
        - **purchaseBalance.status**:
  状态

        **示例**:{
                "purchaseBalance.pbid": 1,
                "purchaseBalance.status": 100.00
            }


## 辅料

### 订单

## api.inventory.AccessoriesAction

    #### accessories

    - **aid**: 辅料单ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **csid**: 工程环节ID
      - 类型: *Long*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **supervisor**: 监理 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **approver**: 审批人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **deliver**: 送货人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *TimeStamp*
    - **fetchTime**: 领取时间
      - 类型: *TimeStamp*
    - **approveTime**: 审批事件
      - 类型: *TimeStamp*
    - **deliveTime**: 送货时间
      - 类型: *TimeStamp*
    - **total**: 总价
      - 类型: *Long*
    - **type**: 类型 , 0: 普通 , 1: 售后
      - 类型: *Short*
    - **status**: 状态 , 包括: 0(初始), 1(预出), 2(出货), 3(撤销) , 4(拒绝) , 5(退回) , 6(到货), 7(审核)
      - 类型: *Short*
    - **printnum**: 打印次数
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司
      - 类型: *Long*

    ### `pageAccessories` <span style="color:gray">[内部]</span>

        分页方式获取辅料单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  订单信息列表 , 每条数据类型 *accessories*

        **示例**:{
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

    ### `queryAccessoriesByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号查询辅料单

**请求参数**:

- **accessories.orderId**:
  装修单号

        **示例**:{
                "accessories.orderId": "1601010001"
            }

**返回参数**:

- **accessoriess**: 订单信息列表 , 每条数据类型 *accessories*
          - 类型: *List*

        **示例**:{
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

    ### `addAccessories` <span style="color:gray">[内部]</span>

        创建辅料单

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断装修单状态 , 5(废单)/6(终止)/7(决算)/8(完工)不可添加 , 错误信息 **140004 装修单状态不可操作**

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        判断工程环节状态为1(开工)或2(完工) , 0(初始)状态 , 错误信息 **120025 工程环节不可操作**

        判断工程环节辅料控制 , 1(锁定状态) , 错误信息 **120028 辅料已禁用**

        判断环节辅料总额 , 超过总额上限 , 错误信息 **260058 辅料总额已达上限**

        判断辅料项对应的工程辅料数量 , 超过数量上限 , 错误信息 **辅料总数已达上限**

        创建辅料单需要工程环节状态为1(开工)或2(完工)

**请求参数**:

- **accessories.orderId**:
  装修单号
        - **accessories.csid**:
  工程环节ID
        - **accessories.supervisor.userId**:
  监理编号
        - **accessories.type**:
  类型
        - **accessories.total**:
  总额
        - **accessories.comment**:
  备注

        - **accessories.fetchTime**:
  领取时间
        - **accessoriesItems[n].goods.gid**:
  商品ID
        - **accessoriesItems[n].num**:
  数量
        - **accessoriesItems[n].total**:
  总额
        - **accessoriesItems[n].checkup**:
  验证标识
        - **accessoriesItems[n].caid**:
  工程辅料ID

        **示例**:{
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

    ### `updateAccessoriesForPrint` <span style="color:gray">[内部]</span>

        更新辅料单打印次数

        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        辅料单可打印对应的状态为1(预出)/2(出货)

        计数并更新辅料单打印次数

**请求参数**:

- **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

    ### `preoutAccessories` <span style="color:gray">[内部]</span>

        预出辅料单

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        更新辅料单状态为1(预出)

**请求参数**:

- **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

    ### `auditAccessories` <span style="color:gray">[内部]</span>

        审核辅料单

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

        辅料单类型为1(售后) , 状态为1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        更新辅料单状态为7(审核)

**请求参数**:

- **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

    ### `cancelAccessories` <span style="color:gray">[内部]</span>

        撤销辅料单

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        更新辅料单状态为3(撤销)

        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

        - **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

    ### `refuseAccessories` <span style="color:gray">[内部]</span>

        拒绝辅料单

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        更新辅料单状态为4(拒绝)

        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

        - **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

    ### `deliveAccessories` <span style="color:gray">[内部]</span>

        送货辅料单

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为2(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        更新辅料单状态为6(到货) , 更新送货人以及送货时间

        - **accessories.aid**:
  辅料单ID

        **示例**:{
                "accessories.aid": 1
            }

### 项目

## api.inventory.AccessoriesItemAction

    #### accessoriesItem

    - **aiid**: 辅料项ID
      - 类型: *Long*
    - **aid**: 辅料单ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [user](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **selling**: 销售价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **surplus**: 余数
      - 类型: *Integer*

    - **checkup**: 验证标识
      - 类型: *Short*
    - **caid**: 工程辅料ID
      - 类型: *Long*

    ### `queryAccessoriesItemByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取对应辅料项信息

**请求参数**:

- **accessories.orderId**:
  装修单号

        **示例**:{
                "accessories.orderId": "1601010001"
            }

**返回参数**:

- **accessoriesItems**: 辅料单项信息列表 , 每条数据类型 *accessoriesItem*
          - 类型: *List*

        **示例**:{
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

    ### `queryAccessoriesItemByAid` <span style="color:gray">[内部]</span>

        通过辅料单ID获取对应辅料项信息

**请求参数**:

- **accessoriesItem.aid**:
  辅料单ID

        **示例**:{
                "accessoriesItem.aid": 1
            }

**返回参数**:

- **accessoriesItems**: 辅料单项信息列表 , 每条数据类型 *accessoriesItem*
          - 类型: *List*

        **示例**:{
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

    ### `queryAccessoriesItemByAids` <span style="color:gray">[内部]</span>

        通过辅料单ID获取对应辅料项信息

**请求参数**:

- **aids[n]**:
  辅料单ID

        **示例**:{
                "aids[0]": 1
            }

**返回参数**:

- **accessoriesItems**: 辅料单项信息列表 , 每条数据类型 *accessoriesItem*
          - 类型: *List*

        **示例**:{
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

    ### `addAccessoriesItem` <span style="color:gray">[内部]</span>

        添加辅料项到已存在辅料单

        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

**请求参数**:

- **accessories.aid**:
  辅料单ID
        - **accessories.total**:
  总价
        - **accessoriesItems[n].goods.gid**:
  商品ID
        - **accessoriesItems[n].num**:
  数量

        **示例**:{
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItems[0].goods.gid": 1,
                "accessoriesItems[0].num": 1000
            }

    ### `updateAccessoriesItem` <span style="color:gray">[内部]</span>

        更新辅料项信息

        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        辅料项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**

        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

**请求参数**:

- **accessories.aid**:
  辅料单ID
        - **accessories.total**:
  总价
        - **accessoriesItem.aiid**:
  辅料项ID
        - **accessoriesItem.num**:
  数量

        **示例**:{
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItem.aiid": 1,
                "accessoriesItem.num": 100000
            }

    ### `deleteAccessoriesItem` <span style="color:gray">[内部]</span>

        删除辅料项信息

        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**

        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**

        辅料项不存在 , 不能删除 , 错误信息 **260025 辅料项不存在**

        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数

**请求参数**:

- **accessories.aid**:
  辅料单ID
        - **accessories.total**:
  总价
        - **accessoriesItem.aiid**:
  辅料项ID

        **示例**:{
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItem.aiid": 1
            }

### 成本

## api.inventory.AccessoriesCostAction

    #### accessoriesCost

    - **acid**: 辅料成本ID
      - 类型: *Long*
    - **aid**: 辅料单ID
      - 类型: *Long*
    - **isAdded**: 是否为补料
      - 类型: *Short*
    - **isEnter**: 可进园区
      - 类型: *Short*
    - **isLift**: 有无电梯
      - 类型: *Short*
    - **isExceed**: 有无超阶
      - 类型: *Short*
    - **isAttic**: 有无阁楼
      - 类型: *Short*
    - **floorNum**: 楼层数
      - 类型: *Integer*
    - **baseNum**: 地下室层数
      - 类型: *Integer*
    - **trafficPrice**: 运费
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*

    ### `queryAccessoriesCost` <span style="color:gray">[内部]</span>

        查询辅料成本

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

**请求参数**:

- **accessoriesCost.aid**:
  辅料单ID

        **示例**:{
                "accessoriesCost.aid": 1
            }

**返回参数**:

- **accessoriesCost**: 辅料成本
          - 类型: *Object*

        **示例**:{
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

    ### `updateAccessoriesCost` <span style="color:gray">[内部]</span>

        更新辅料成本

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

**请求参数**:

- **accessoriesCost.aid**:
  辅料单ID
        - **accessoriesCost.isAdded**:
  是否为补料
        - **accessoriesCost.isEnter**:
  可进园区
        - **accessoriesCost.isLift**:
  有无电梯
        - **accessoriesCost.isExceed**:
  有无超阶
        - **accessoriesCost.isAttic**:
  有无阁楼
        - **accessoriesCost.floorNum**:
  楼层数
        - **accessoriesCost.baseNum**:
  地下室层数
        - **accessoriesCost.cost**:
  成本

        **示例**:{
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

### 货单
辅料单与货单关联

## api.inventory.AccessoriesManifestAction

**数据类型**:

#### accessoriesManifest

    - **amid**: 辅料货单Id
      - 类型: *Long*
    - **accessories**: 辅料单 , 类型 [accessories](./inventory.html#api.inventory.accessoriesAction.accessories)
      - 类型: *Object*
    - **manifest**: 货单 , 类型 [manifest](./inventory.html#api.inventory.ManifestAction.manifest)
      - 类型: *Object*

## 外辅

### 订单

外购辅料单 , 简化版辅料单功能 , 提供给厂商使用的辅料管理

## api.inventory.OccessoriesAction

    #### occessories

    - **oid**: 外辅单ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **supervisor**: 监理 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **deliver**: 配送人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **receiver**: 接收人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balancer**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **deliveTime**: 配送时间
      - 类型: *Timestamp*
    - **receiveTime**: 接收时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **isEnter**: 可进园区
      - 类型: *Short*
    - **isLift**: 有无电梯
      - 类型: *Short*
    - **isExceed**: 有无超阶
      - 类型: *Short*
    - **isAttic**: 有无阁楼
      - 类型: *Short*
    - **rate**: 评分
      - 类型: *Integer*
    - **status**: 状态 , 包括: 0(初始), 1(分配), 2(送货), 3(到货), 4(结算) , 5(完成)
      - 类型: *Short*
    - **comment**: 说明(创建)
      - 类型: *String*
    - **content**: 内容(送货)
      - 类型: *String*
    - **remake**: 评价(评分)
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageOccessories` <span style="color:gray">[内部]</span>

        分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  订单信息列表 , 每条数据类型 *occessories*

        **示例**:{
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

    ### `pageOccessoriesForSupplier` <span style="color:gray">[内部]</span>

        分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        厂商作为默认条件进行查询

**请求参数**:

- **occessories.supplier.uid**:
  厂商ID

        **示例**:{
                "occessories.supplier.uid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  订单信息列表 , 每条数据类型 *occessories*

        **示例**:{
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

    ### `queryOccessoriesByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取信息

**请求参数**:

- **occessories.orderId**:
  装修单号

        **示例**:{
                "occessories.orderId": "1601010001"
            }

**返回参数**:

- **occessories**: 外辅单信息 , 类型 *occessories*
          - 类型: *Object*

        **示例**:{
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

    ### `queryOccessoriesByOid` <span style="color:gray">[内部]</span>

        通过外辅单ID获取信息

**请求参数**:

- **occessories.oid**:
  外辅单ID

        **示例**:{
                "occessories.oid": 1
            }

**返回参数**:

- **occessories**: 外辅单信息 , 类型 *occessories*
          - 类型: *Object*

        **示例**:{
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

    ### `addOccessories` <span style="color:gray">[内部]</span>

        创建外辅单

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **occessories.orderId**:
  装修单号
        - **occessories.supervisor.uid**:
  监理编号
        - **occessories.isEnter**:
  有无电梯
        - **occessories.isExceed**:
  有无超阶
        - **occessories.isAttic**:
  有无阁楼
        - **occessories.comment**:
  说明

        - **occessoriesItems[n].goods.gid**:
  商品ID
        - **occessoriesItems[n].num**:
  数量
        - **occessoriesItems[n].rbalance**:
  结算金额

        **示例**:{
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

    ### `bindOccessories` <span style="color:gray">[内部]</span>

        绑定外辅单

        外辅单不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

        更新外辅单状态为1(分配)

**请求参数**:

- **occessories.oid**:
  外辅单ID
        - **occessories.supplier.uid**:
  厂商ID

        **示例**:{
                "occessories.oid": 1,
                "occessories.supplier.uid": 1
            }

    ### `deliveOccessories` <span style="color:gray">[内部]</span>

        发货外辅单

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为1(分配) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

        更新外辅单状态为2(发货) , 更新发货时间和发货人

**请求参数**:

- **occessories.oid**:
  外辅单ID
        - **occessories.content**:
  内容

        - **occessoriesItems[n].sennum**:
  送货数量

        **示例**:{
                "occessories.oid": 1,
                "occessories.content": "",

                "occessoriesItems[0].sennum": 0
            }

    ### `receiveOccessories` <span style="color:gray">[内部]</span>

        到货外辅单

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为2(发货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

        更新外辅单状态为3(到货) , 更新到货时间和接收人

**请求参数**:

- **occessories.oid**:
  外辅单ID

        - **occessoriesItems[n].oiid**:
  外辅项ID
        - **occessoriesItems[n].recnum**:
  到货数量

        **示例**:{
                "occessories.oid": 1,

                "occessoriesItems[0].oiid": 0,
                "occessoriesItems[0].recnum": 0
            }

    ### `balanceOccessories` <span style="color:gray">[内部]</span>

        结算外辅单

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为3(到货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

        更新外辅单状态为4(结算) , 更新结算时间和结算人

**请求参数**:

- **occessories.oid**:
  外辅单ID

        - **occessoriesItems[n].oiid**:
  外辅项ID
        - **occessoriesItems[n].vbalance**:
  结算值

        **示例**:{
                "occessories.oid": 1,

                "occessoriesItems[0].oiid": 0,
                "occessoriesItems[0].vbalance": 0
            }

    ### `finishOccessories` <span style="color:gray">[内部]</span>

        完成

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为4(结算) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

        更新外辅单状态为5(完成) , 更新完成时间

**请求参数**:

- **occessories.oid**:
  外辅单ID

        **示例**:{
                "occessories.oid": 1
            }

    ### `rateOccessories` <span style="color:gray">[内部]</span>

        评分

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

**请求参数**:

- **occessories.oid**:
  外辅单ID
        - **occessories.rate**:
  外辅单ID
        - **occessories.remake**:
  外辅单ID

        **示例**:{
                "occessories.oid": 1,
                "occessories.rate": 1,
                "occessories.remake": ""
            }

    ### `deleteOccessories` <span style="color:gray">[内部]</span>

        删除外辅单

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

**请求参数**:

- **occessories.oid**:
  外辅单ID

        **示例**:{
                "occessories.oid": 1
            }

### 项目

## api.inventory.OccessoriesItemAction

    #### occessoriesItem

    - **oiid**: 外辅项ID
      - 类型: *Long*
    - **oid**: 外辅单ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Integer*
    - **sennum**: 送货数量
      - 类型: *Integer*
    - **recnum**: 到货数量
      - 类型: *Integer*
    - **rbalance**: 原结算价
      - 类型: *Integer*
    - **vbalance**: 结算价
      - 类型: *Integer*

    ### `queryOccessoriesItemByOid` <span style="color:gray">[内部]</span>

        通过外辅单ID获取对应外辅项信息

**请求参数**:

- **occessoriesItem.oid**:
  外辅单ID

        **示例**:{
                "occessoriesItem.oid": 1
            }

**返回参数**:

- **occessoriesItems**: 外辅单项信息列表 , 每条数据类型 *occessoriesItem*
          - 类型: *List*

        **示例**:{
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

    ### `addOccessoriesItem` <span style="color:gray">[内部]</span>

        添加外辅项到已存在外辅单

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        外辅单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**

**请求参数**:

- **occessories.oid**:
  外辅单ID
        - **occessoriesItems[n].goods.gid**:
  商品ID
        - **occessoriesItems[n].num**:
  数量

        **示例**:{
                "occessories.oid": 1,
                "occessoriesItems[0].goods.gid": 1,
                "occessoriesItems[0].num": 1000
            }

    ### `updateOccessoriesItem` <span style="color:gray">[内部]</span>

        更新外辅项

        外辅项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**

        判断外辅单状态是否为4(结算) , 不可操作 , 错误信息 **260024 辅料单状态不可操作**

**请求参数**:

- **occessoriesItem.oiid**:
  外辅项ID
        - **occessoriesItem.recnum**:
  数量
        - **occessoriesItem.vbalance**:
  结算价

        **示例**:{
                "occessoriesItem.oiid": 1,
                "occessoriesItem.recnum": 100000,
                "occessoriesItem.vbalance": 100000
            }

    ### `deleteOccessoriesItem` <span style="color:gray">[内部]</span>

        删除外辅项

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**

**请求参数**:

- **occessoriesItem.oiid**:
  外辅项ID

        **示例**:{
                "occessoriesItem.oiid": 1
            }

### 费用

## api.inventory.OccessoriesCostAction

    #### occessoriesCost

    - **ocid**: 外辅费用ID
      - 类型: *Long*
    - **oid**: 辅料单ID
      - 类型: *Long*
    - **initPrice**: 初始金额
      - 类型: *Integer*
    - **price**: 金额
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **type**: 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费
      - 类型: *Short*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*

    ### `queryOccessoriesCost` <span style="color:gray">[内部]</span>

        查询辅料成本

        辅料单不存在 , 错误信息 **260023 辅料单不存在**

**请求参数**:

- **occessoriesCost.oid**:
  辅料单ID

        **示例**:{
                "occessoriesCost.oid": 1
            }

**返回参数**:

- **occessoriesCost**: 辅料成本
          - 类型: *Object*

        **示例**:{
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

    ### `addOccessoriesCost` <span style="color:gray">[内部]</span>

        创建外辅费用

        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**

**请求参数**:

- **occessoriesCost.oid**:
  外辅单ID
        - **occessoriesCost.price**:
  金额
        - **occessoriesCost.cost**:
  成本

        **示例**:{
                "occessoriesCost.oid": 1,
                "occessoriesCost.price": 10000,
                "occessoriesCost.cost": 10000,
            }

    ### `updateOccessoriesCost` <span style="color:gray">[内部]</span>

        更新外辅费用

**请求参数**:

- **occessoriesCost.oid**:
  外辅单ID
        - **occessoriesCost.price**:
  金额
        - **occessoriesCost.cost**:
  成本

        **示例**:{
                "occessoriesCost.oid": 1,
                "occessoriesCost.price": 10000,
                "occessoriesCost.cost": 10000,
            }

    ### `deleteOccessoriesCost` <span style="color:gray">[内部]</span>

        删除外辅费用

**请求参数**:

- **occessoriesCost.ocid**:
  外辅费用ID

        **示例**:{
                "occessoriesCost.ocid": 1
            }

## 商品库存

商品在仓库中的存量以及相关信息管理

## api.inventory.GoodsStorehouseStockAction

**数据类型**:

#### goodsStorehouseStock

    - **gshsid**: 库存信息ID
      - 类型: *Long*
    - **miid**: 货单项ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./data.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./data.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **storehouse**: 仓库信息 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **num**: 库存量
      - 类型: *Long*

    ### `pageGoodsStorehouseStock` <span style="color:gray">[内部]</span>

        分页方式获取库存信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  库存信息列表 , 每条数据类型 *goodsStorehouseStock*

        **示例**:{
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

    ### `queryGoodsStorehouseStockByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取商品库存

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  商品ID

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1
            }

**返回参数**:

- **goodsStorehouseStock**: 库存信息 , 其中num字段为汇总数值
          - 类型: *Object*

        **示例**:{
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

    ### `queryGoodsStorehouseStockByShidAGid` <span style="color:gray">[内部]</span>

        通过商品ID和仓库ID获取商品库存

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  商品ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1
                "goodsStorehouseStock.storehouse.shid": 1
            }

**返回参数**:

- **goodsStorehouseStock**: 库存信息 , 其中num字段为汇总数值
          - 类型: *Object*

        **示例**:{
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

    ### `makeGoodsStorehouseStock` <span style="color:gray">[内部]</span>

        生成商品库存 , 库存数量默认为0

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  商品ID
        - **goodsStorehouseStock.color.cid**:
  颜色ID
        - **goodsStorehouseStock.format.fid**:
  规格ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1
            }

    ### `plusGoodsStorehouseStock` <span style="color:gray">[内部]</span>

        盘盈

        判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**

        生成对应货单以及货单项

        生成对应商品(供应商/颜色/规格)库存信息

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  商品ID
        - **goodsStorehouseStock.color.cid**:
  颜色ID
        - **goodsStorehouseStock.format.fid**:
  规格ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID
        - **goodsStorehouseStock.num**:
  数量
        - **goodsStorehouseStock.surplus**:
  采购价

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 1000,
                "goodsStorehouseStock.surplus": 10000
            }

    ### `loseGoodsStorehouseStock` <span style="color:gray">[内部]</span>

        盘亏

        判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**

        判断商品(供应商/颜色/规格)是否存在商品库存数量是否满足盘亏数量 , 错误信息 **260008 商品库存不足**

        生成对应货单以及货单项

        根据对应的商品(供应商/颜色/规格)库存 , 按照盘亏数量以及先入先出规则进行匹配 , 减少对应商品库存

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  商品ID
        - **goodsStorehouseStock.color.cid**:
  颜色ID
        - **goodsStorehouseStock.format.fid**:
  规格ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID
        - **goodsStorehouseStock.num**:
  数量

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 1000
            }

    ### `mergePackage` <span style="color:gray">[内部]</span>

        合并套餐库存

        判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**

        判断套餐归属商品库存 , 库存量不足 , 错误信息 **260008 商品库存不足**

        如果套餐库存不存在创建套餐对应的库存信息

        更新套餐归属商品库存量

        创建套合类型货单

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  套餐ID
        - **goodsStorehouseStock.color.cid**:
  颜色ID
        - **goodsStorehouseStock.format.fid**:
  规格ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID
        - **goodsStorehouseStock.num**:
  合并数量

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 10000
            }

    ### `splitPackage` <span style="color:gray">[内部]</span>

        拆分套餐库存

        判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**

        判断套餐库存 , 库存量不足 , 错误信息 **260008 商品库存不足**

        如果套餐归属商品库存不存在创建商品对应的库存信息

        更新套餐归属商品库存量

        创建拆类型货单

**请求参数**:

- **goodsStorehouseStock.goods.gid**:
  套餐ID
        - **goodsStorehouseStock.color.cid**:
  颜色ID
        - **goodsStorehouseStock.format.fid**:
  规格ID
        - **goodsStorehouseStock.storehouse.shid**:
  仓库ID
        - **goodsStorehouseStock.num**:
  合并数量

        **示例**:{
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 10000
            }

## 库存

库存信息 , 按照月份统计仓库存量

## api.inventory.StorehouseStockAction

**数据类型**:

#### storehouseStock

    - **shsid**: 库存ID
      - 类型: *Long*
    - **storehouse**: 仓库信息 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **month**: 年月 , 格式 "yyyyMM"
      - 类型: *String*
    - **num**: 存量
      - 类型: *Long*

    ### `queryStorehouseStock` <span style="color:gray">[内部]</span>

        获取仓库存量信息

**返回参数**:

- **storehouseStocks**: 库存信息列表 , 每条数据类型 *storehouseStock*
          - 类型: *List*

        **示例**:{
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

## 图片

图片信息管理 , 提供如楼盘图片等资源

## api.inventory.InventoryDrawingAction

**数据类型**:

#### inventoryDrawing

    - **idid**: 图片ID
      - 类型: *Long*
    - **sid**: 关联ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **path**: 图片路径
      - 类型: *String*
    - **size**: 图片大小
      - 类型: *Integer*
    - **type**: 图片类型 , 0: 本地 , 1: 钉钉
      - 类型: *Short*
    - **atttype**: 类型 , 0: 外辅
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `queryInventoryDrawing` <span style="color:gray">[内部]</span>

        通过关联ID以及类型获取图片信息

**请求参数**:

- **inventoryDrawing.sid**:
  关联ID
        - **inventoryDrawing.atttype**:
  业务类型

        **示例**:{
                "inventoryDrawing.sid": 1,
                "inventoryDrawing.atttype": 0
            }

**返回参数**:

- **inventoryDrawings**: 图片信息列表 , 每条数据类型 *inventoryDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `addInventoryDrawing` <span style="color:blue">[自定义]</span>

        添加图片信息

**请求参数**:

- **inventoryDrawing.sid**:
  关联ID
        - **inventoryDrawing.name**:
  名称
        - **inventoryDrawing.path**:
  路径
        - **inventoryDrawing.type**:
  图片类型
        - **inventoryDrawing.atttype**:
  业务类型

        **示例**:{
                "inventoryDrawing.sid": 1,
                "inventoryDrawing.name": "name.jpg",
                "inventoryDrawing.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "inventoryDrawing.type": 0,
                "inventoryDrawing.atttype": 0
            }

    ### `deleteInventoryDrawing` <span style="color:blue">[自定义]</span>

        删除图片信息

**请求参数**:

- **inventoryDrawing.idid**:
  图片ID

        **示例**:{
                "inventoryDrawing.idid": 1
            }
