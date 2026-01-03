
.. _inventory:

***************
仓储
***************

盘点
================

商品库存盘点信息

.. class:: api.inventory.CheckListAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: checkList
    
    :param clid: 盘点信息ID
    :type clid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./data.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./data.html#api.data.FormatAction.format>`__
    :type format: Object
    :param storehouse: 仓库信息 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type storehouse: Object
    :param type: 类型 , 0: 盘盈 , 1: 盘亏
    :type type: Short
    :param num: 数量
    :type num: Long
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    
    +--------+
    |Filters:|
    +--------+
    
    :param goodsName: 商品名
    :type goodsName: String
    :param storehouseName: 仓库名
    :type storehouseName: String
    
    .. method:: <I> pageCheckList
    
        分页方式获取盘点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 盘点信息列表 , 每条数据类型 :data:`checkList`
        :type paging.data: List
        
        Example::
        
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

货单
================

货单信息管理

货单中类分为十二种 , 分别是: 进货 , 进退 , 出货 , 出返 , 调拨 , 采购(进货) , 辅料(出货) , 辅退(进货) , 套合 , 套拆 , 盘盈 , 盘亏

其中 , 进退对应进货 , 出返对应出货 , 需要关联已经产生的货单完成操作 . 

采购类型货单 , 需要关联采购单与货单 .

辅料类型货单 , 需要关联辅料单和货单 . 

.. class:: api.inventory.ManifestAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: manifest
    
    :param mid: 货单ID
    :type mid: Long
    :param code: 编号 , 十二种类型分别以CG(进货), CR(进退), XG(出货), XB(出返), DB(调拨), PU(采购), AS(辅料), AR(辅退), PM(套合), PS(套拆), CP(盘盈), CL(盘亏)作为编号前缀 , 之后由8为数字组成
    :type code: String
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param manifestTime: 货单时间
    :type manifestTime: Timestamp
    :param type: 类型 , 分别是: 1(进货), 2(进退), 3(出货), 4(出返), 5(调拨) , 6(采购) , 7(辅料) , 8(辅退) , 9(套合) , 10(套拆) , 11(盘盈), 12(盘亏)
    :type type: Short
    :param status: 状态 , 0: 初始 , 1: 已确认
    :type status: Short
    :param comment: 备注
    :type comment: String
    :param attachment: 附件路径
    :type attachment: String
    :param quoteManifest: 关联货单 , 类型 :data:`manifest` , 只有类型为进退和出返需要进行关联
    :type quoteManifest: Object
    :param company: 公司
    :type company: Long
    
    .. data:: manifestItem
    
    :param miid: 货单项ID
    :type miid: Long
    :param mid: 货单ID
    :type mid: Long
    :param siid: 销售项ID
    :type siid: Long
    :param piid: 采购项ID
    :type piid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./data.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./data.html#api.data.FormatAction.format>`__
    :type format: Object
    :param instorehouse: 进货仓库 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type instorehouse: Object
    :param outstorehouse: 出货仓库 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type outstorehouse: Object
    :param type: 类型 , 与货单类型一致
    :type type: Short
    :param inprice: 入库价
    :type inprice: Integer
    :param outprice: 出库价
    :type outprice: Integer
    :param num: 数量
    :type num: Integer
    :param surplus: 剩余数量
    :type surplus: Integer
    :param comment: 说明
    :type comment: String
    :param qmiid: 引用货单项ID
    :type qmiid: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param orderId: 装修单号
    :type orderId: String
    :param manifestTime: 货单时间 , 例: 2016/01/01-2016/01/02
    :type manifestTime: String
    
    .. method:: <I> pageManifest
    
        分页方式获取货单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 货单信息列表 , 每条数据类型 :data:`manifest`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> queryManifestByMid
    
        通过货单编号获取货单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        Example::
        
            {
                "manifest.mid": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param manifest: 货单信息 , 类型 :data:`manifest`
        :type manifest: Object
        
        Example::
        
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
            
    .. method:: <I> queryManifestForPUByPids
    
        通过采购单ID信息以及采购销售关联信息获取货单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param pids[n]: 采购单ID列表 , 每条数据类型 Long
        :type pids[n]: List
        
        Example::
        
            {
                "pids[0]": 1,
                "pids[1]": 2
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifests: 货单信息列表 , 每条数据类型 :data:`manifest`
        :type manifests: List
        
        Example::
        
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
            
    .. method:: <I> queryManifestForXGBySid
    
        通过销售单ID以及销售货单关系获取货单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifests: 货单信息列表 , 每条数据类型 :data:`manifest`
        :type manifests: List
        
        Example::
        
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
    
    .. method:: <I> queryManifestItemByMid
    
        通过货单ID获取货单下拥有的货单项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        Example::
        
            {
                "manifest.mid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifestItems: 货单项信息列表 , 每条数据类型 :data:`manifestItem`
        :type manifestItems: List
        
        Example::
        
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
            
    .. method:: <I> queryManifestByAid
    
        通过辅料单ID获取货单信息 , 利用辅料货单关联关系
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesManifest.accessories.aid: 辅料单ID
        :type accessoriesManifest.accessories.aid: Long
        
        Example::
        
            {
                "accessoriesManifest.accessories.aid": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param manifests: 货单信息列表 , 每条数据类型 :data:`manifest`
        :type manifests: List
        
        Example::
        
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
            
    .. method:: <I> addManifestForCG
    
        添加进货类型货单
        
        根据商品/颜色/规格/供应商生成商品库存信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.manifestTime: 货单时间
        :type manifest.manifestTime: Timestamp
        :param manifest.comment: 备注
        :type manifest.comment: String
        :param manifest.attachment: 附件路径
        :type manifest.attachment: String
        
        :param manifestItems[n].goods.gid: 商品ID
        :type manifestItems[n].goods.gid: Long
        :param manifestItems[n].color.cid: 颜色ID
        :type manifestItems[n].color.cid: Long
        :param manifestItems[n].format.fid: 规格ID
        :type manifestItems[n].format.fid: Long
        :param manifestItems[n].instorehouse.shid: 仓库ID
        :type manifestItems[n].instorehouse.shid: Long
        :param manifestItems[n].inprice: 入库价
        :type manifestItems[n].inprice: Integer
        :param manifestItems[n].num: 数量
        :type manifestItems[n].num: Integer
        :param manifestItems[n].comment: 说明
        :type manifestItems[n].comment: String
        
        Example::
        
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
            
    .. method:: <I> addManifestForXG
    
        添加出货类型货单
        
        判断商品库存不存在对应商品(颜色 , 规格) , 添加失败 , 错误信息 **260008 商品库存不足**
        
        判断商品库存对应商品数量小于出货数量 , 添加失败 , 错误信息 **260008 商品库存不足**
        
        判断销售项出库数量 , 数量不足 , 错误信息 **260055 销售项出库数量不足**
        
        根据商品/颜色/规格/供应商获取商品库存信息 , 利用先入先出原则 , 减少商品库存数量
        
        更新销售项出库剩余数量
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.manifestTime: 货单时间
        :type manifest.manifestTime: Timestamp
        :param manifest.comment: 备注
        :type manifest.comment: String
        :param manifest.attachment: 附件路径
        :type manifest.attachment: String
        
        :param manifestItems[n].goods.gid: 商品ID
        :type manifestItems[n].goods.gid: Long
        :param manifestItems[n].color.cid: 颜色ID
        :type manifestItems[n].color.cid: Long
        :param manifestItems[n].format.fid: 规格ID
        :type manifestItems[n].format.fid: Long
        :param manifestItems[n].outstorehouse.shid: 仓库ID
        :type manifestItems[n].outstorehouse.shid: Long
        :param manifestItems[n].outprice: 出库价
        :type manifestItems[n].outprice: Integer
        :param manifestItems[n].num: 数量
        :type manifestItems[n].num: Integer
        :param manifestItems[n].comment: 说明
        :type manifestItems[n].comment: String
        
        Example::
        
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
        
    .. method:: <I> addManifestForCR
    
        添加进退类型货单
        
        判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**
        
        判断操作货单状态 , 非已确认进退失败 , 错误信息 **260027 货单状态不可操作**
        
        判断操作货单中货单项数量与进退项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**
        
        进退项中仓库为出库
        
        生成的进退类型货单状态为已确认 , 货单项进价和出价与操作货单项进价相同
        
        根据操作货单项信息 , 减掉商品库存中对应商品库存数量
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.quoteManifest.mid: 操作货单ID
        :type manifest.quoteManifest.mid: Long
        
        :param manifestItems[n].miid: 进退项ID
        :type manifestItems[n].miid: Long
        :param manifestItems[n].num: 数量
        :type manifestItems[n].num: Integer
        
        Example::
        
            {
                "manifest.quoteManifest.mid": 1,
                "manifestItems[0].miid": 1,
                "manifestItems[0].num": 1
            }
            
    .. method:: <I> addManifestForXB
    
        添加出返类型货单
        
        判断操作货单是否存在 , 不存在 , 错误信息 **260009 货单不存在**
        
        判断操作货单状态 , 非已确认出返失败 , 错误信息 **260027 货单状态不可操作**
        
        判断操作货单中货单数量与出返项数量 , 后者不能大于前者 , 错误信息 **260026 货单项数量不符**
        
        出返项中仓库为进库
        
        生成的出返类型货单状态为已确认 , 货单项进价和出价与操作货单项出价相同
        
        根据操作货单项信息 , 增加商品库存中对应商品库存信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.quoteManifest.mid: 操作货单ID
        :type manifest.quoteManifest.mid: Long
        
        :param manifestItems[n].miid: 进退项ID
        :type manifestItems[n].miid: Long
        :param manifestItems[n].num: 数量
        :type manifestItems[n].num: Integer
        
        Example::
        
            {
                "manifest.quoteManifest.mid": 1,
                "manifestItems[0].miid": 1,
                "manifestItems[0].num": 1
            }
            
    .. method:: <I> addManifestForPU
    
        添加采购类型货单
        
        采购单不存在 , 添加失败 , 错误信息 **260017 采购单不存在**
        
        入库数量大于采购项剩余数量 , 添加失败 , 错误信息 **260028 采购项剩余数量不足**
        
        判断商品库存有无对应商品(颜色 , 规格) , 不存在创建商品库存 , 存在更新库存数量
        
        更新采购项剩余数量
        
        判断采购单中采购项剩余数量 , 所有项目剩余数量为0 , 更新采购单状态为 **2(全部入库)** ; 部分剩余数量为0 , 更新采购单状态为 **1(部分入库)**
        
        更新采购货单状态为 **1(已确认)**
        
        采购单与生成货单进行关联 , 采购货单 `purchaseManifest <./inventory.html#api.inventory.PurchaseManifestAction.purchaseManifest>`__
        
        根据商品/颜色/规格/供应商生成商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchases[n].pid: 采购单ID
        :type purchases[n].pid: Long
        :param purchaseItems[n].piid: 采购项ID
        :type purchaseItems[n].piid: Long
        :param purchaseItems[n].storehouse.shid: 仓库ID
        :type purchaseItems[n].storehouse.shid: Long
        :param purchaseItems[n].inprice: 入库价
        :type purchaseItems[n].inprice: Integer
        :param purchaseItems[n].num: 入库数量
        :type purchaseItems[n].num: Integer
        
        Example::
        
            {
                "purchases[0].pid": 1,
                "purchaseItems[0].piid": 1,
                "purchaseItems[0].storehouse.shid": 1,
                "purchaseItems[0].inprice": 100000,
                "purchaseItems[0].num": 10
            }
            
    .. method:: <I> addManifestForAS
    
        添加辅料类型货单
        
        辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        判断辅料单类型为0(普通), 状态为0(初始)/1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        判断辅料单类型为1(售后), 状态为7(审核) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        判断辅料项出库对应商品(颜色 , 规格)库存不存在 , 添加失败 , 错误信息 **260008 商品库存不足**
        
        判断辅料项出库对应商品(颜色 , 规格)库存数量小于出库数量 , 添加失败 , 错误信息 **260008 商品库存不足** 
        
        更新辅料单状态为 **1(出货)**
        
        更新辅料货单状态为 **1(已确认)**
        
        辅料单与生成货单进行关联 , 辅料货单 `accessoriesManifest <./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest>`__
        
        根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价
        
        辅料项根据验证标识 , 关联工程辅料 , 验证总额上限 , 同时更新对应总额
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories[n].aid: 辅料单ID
        :type accessories[n].aid: Long
        :param accessoriesItems[n].goods.gid: 商品ID
        :type accessoriesItems[n].goods.gid: Long
        :param accessoriesItems[n].color.cid: 颜色ID
        :type accessoriesItems[n].color.cid: Long
        :param accessoriesItems[n].format.fid: 规格ID
        :type accessoriesItems[n].format.fid: Long
        :param accessoriesItems[n].storehouse.shid: 仓库ID
        :type accessoriesItems[n].storehouse.shid: Long
        :param accessoriesItems[n].outprice: 出库价
        :type accessoriesItems[n].outprice: Integer
        :param accessoriesItems[n].num: 出库数量
        :type accessoriesItems[n].num: Integer
        :param accessoriesItems[n].checkup: 验证标识
        :type accessoriesItems[n].checkup: Short
        
        Example::
        
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
            
    .. method:: <I> addManifestForAR
    
        添加辅退类型货单
        
        辅料单不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        判断辅料单状态为1(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        判断辅料项剩余数量 , 退回数量大于剩余数量 , 错误信息 **260051 辅料项数量不足**
        
        更新辅料货单状态为 **1(已确认)**
        
        辅料单与生成货单进行关联 , 辅料货单 `accessoriesManifest <./inventory.html#api.inventory.AccessoriesManifestAction.accessoriesManifest>`__
        
        根据商品/颜色/规格/供应商获取商品库存信息 , 采购项的采购价 = 货单项进价 = 商品库存进价
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories[n].aid: 辅料单ID
        :type accessories[n].aid: Long
        :param accessoriesItems[n].goods.gid: 商品ID
        :type accessoriesItems[n].goods.gid: Long
        :param accessoriesItems[n].color.cid: 颜色ID
        :type accessoriesItems[n].color.cid: Long
        :param accessoriesItems[n].format.fid: 规格ID
        :type accessoriesItems[n].format.fid: Long
        :param accessoriesItems[n].storehouse.shid: 仓库ID
        :type accessoriesItems[n].storehouse.shid: Long
        :param accessoriesItems[n].outprice: 出库价
        :type accessoriesItems[n].outprice: Integer
        :param accessoriesItems[n].num: 出库数量
        :type accessoriesItems[n].num: Integer
        
        Example::
        
            {
                "accessories[0].aid": 1,
                "accessoriesItems[0].goods.gid": 1,
                "accessoriesItems[0].color.cid": 1,
                "accessoriesItems[0].format.fid": 1,
                "accessoriesItems[0].storehouse.shid": 1,
                "accessoriesItems[0].outprice": 100000,
                "accessoriesItems[0].num": 10
            }
            
    .. method:: <I> updateManifest
    
        更新货单信息
        
        货单信息不存在 , 更新失败 , 错误信息 **260009 货单不存在**
        
        判断当前货单项状态 , 非初始删除失败 , 错误信息 **260027 货单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        :param manifest.manifestTime: 货单时间
        :type manifest.manifestTime: Timestamp
        :param manifest.comment: 备注
        :type manifest.comment: String
        :param manifest.attachment: 附件路径
        :type manifest.attachment: String
        
        Example::
        
            {
                "manifest.mid": 1,
                "manifest.manifestTime": "2016-01-01 00:00:00",
                "manifest.comment": "说明",
                "manifest.attachment": ""
            }
            
    .. method:: <I> addManifestItem
    
        添加货单项信息
        
        货单项信息不存在 , 添加失败 , 错误信息 **260010 货单项不存在**
        
        判断当前货单项状态 , 非初始添加失败 , 错误信息 **260027 货单状态不可操作**
        
        根据货单类型 , 选着货单项中的出库/入库 , 同时更新商品库存信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        :param manifestItem.goods.gid: 商品ID
        :type manifestItem.goods.gid: Long
        :param manifestItem.color.cid: 颜色ID
        :type manifestItem.color.cid: Long
        :param manifestItem.format.fid: 规格ID
        :type manifestItem.format.fid: Long
        :param manifestItem.instorehouse.shid: 仓库ID
        :type manifestItem.instorehouse.shid: Long
        :param manifestItem.outstorehouse.shid: 仓库ID
        :type manifestItem.outstorehouse.shid: Long
        :param manifestItem.inprice: 进货价 , <可选>
        :type manifestItem.inprice: Integer
        :param manifestItem.outprice: 出库价 , <可选>
        :type manifestItem.outprice: Integer
        :param manifestItem.num: 数量
        :type manifestItem.num: Integer
        :param manifestItem.comment: 说明
        :type manifestItem.comment: String
        
        Example::
        
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
            
    .. method:: <I> updateManifestItem
        
        更新货单项信息
        
        货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**
        
        判断当前货单项状态 , 非初始更新失败 , 错误信息 **260027 货单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        :param manifestItem.miid: 货单项ID
        :type manifestItem.miid: Long
        :param manifestItem.instorehouse.shid: 仓库ID
        :type manifestItem.instorehouse.shid: Long
        :param manifestItem.outstorehouse.shid: 仓库ID
        :type manifestItem.outstorehouse.shid: Long
        :param manifestItem.num: 数量
        :type manifestItem.num: Integer
        :param manifestItem.comment: 说明
        :type manifestItem.comment: String
        
        Example::
        
            {
                "manifest.mid": 1,
                "manifestItem.miid": 1,
                "manifestItem.instorehouse.shid": 1,
                "manifestItem.outstorehouse.shid": 1,
                "manifestItem.num": 1,
                "manifestItem.comment": "说明",
            }
            
    .. method:: <I> confirmManifest
    
        确认货单状态
        
        货单信息不存在 , 确认失败 , 错误信息 **260009 货单不存在**
        
        货单状态不为初始 , 确认失败 , 错误信息 **260027 货单状态不可操作**
        
        更新货单状态为已确认
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        Example::
        
            {
                "manifest.mid": 1
            }
            
    .. method:: <I> deleteManifestItem
    
        删除货单项
        
        货单项信息不存在 , 更新失败 , 错误信息 **260010 货单项不存在**
        
        判断当前货单项状态 , 只有初始状态才能够完成删除货单项
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifest.mid: 货单ID
        :type manifest.mid: Long
        
        :param manifestItem.miid: 货单项ID
        :type manifestItem.miid: Long
        
        Example::
        
            {
                "manifest.mid": 1,
                "manifestItem.miid": 1,
            }
            
销售
================

销售采购
---------------------

.. class:: api.inventory.SalesPurchaseAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesPurchase
    
    :param pmid: 销售货单Id
    :type pmid: Long
    :param sales: 采购单 , 类型 `sales <./inventory.html#api.inventory.SalesAction.sales>`__
    :type sales: Object
    :param purchase: 采购单 , 类型 `purchase <./inventory.html#api.inventory.PurchaseAction.purchase>`__
    :type purchase: Object

销售货单
---------------------

.. class:: api.inventory.SalesManifestAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesManifest
    
    :param pmid: 销售货单Id
    :type pmid: Long
    :param sales: 采购单 , 类型 `sales <./inventory.html#api.inventory.SalesAction.sales>`__
    :type sales: Object
    :param manifest: 货单 , 类型 `manifest <./inventory.html#api.inventory.ManifestAction.manifest>`__
    :type manifest: Object
            
采购
================

订单
---------------------

.. class:: api.inventory.PurchaseAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: purchase
    
    :param pid: 采购单ID
    :type pid: Long
    :param no: 编号 , PO作为编号前缀 , 之后由8位数字组成
    :type no: String
    :param creater: 创建人 , 类型 `storehouse <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param deliveryTime: 交付时间
    :type deliveryTime: Timestramp
    :param balanceTime: 结算时间
    :type balanceTime: Timestamp
    :param status: 状态 , 0: 初始 , 1: 部分入库 , 2: 全部入库
    :type status: Short
    :param balanceStatus: 结算状态 , 0: 初始 , 1: 已结算 , 2: 完结
    :type balanceStatus: Short
    :param comment: 说明
    :type comment: String 
    :param company: 公司
    :type company: Long
    
    .. data:: purchaseItem
    
    :param piid: 采购项ID
    :type piid: Long
    :param pid: 采购单ID
    :type pid: Long
    :param siid: 销售项ID
    :type siid: Long
    :param goods: 商品 , 类型 `goods <./inventory.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./inventory.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./inventory.html#api.data.FormatAction.format>`__
    :type format: Object
    :param inprice: 商品单价
    :type inprice: Integer
    :param num: 数量
    :type num: Integer
    :param surplus: 剩余数量
    :type surplus: Integer
    
    .. method:: <I> pagePurchase
    
        分页方式获取采购单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 采购单信息列表 , 每条数据类型 :data:`purchase`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> queryPurchaseByPid
    
        通过采购单ID获取采购单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        
        +--------+
        |Returns:|
        +--------+
        
        :param purchase: 采购单 , 类型 :data:`purchase`
        :type purchase: Object
        
        Example::
        
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
            
    .. method:: <I> queryPurchaseBySid
    
        通过销售单ID以及销售采购关系获取采购单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        +--------+
        |Returns:|
        +--------+
        
        :param purchases: 采购单列表 , 每条数据类型 :data:`purchase`
        :type purchases: List
        
        Example::
        
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
            
    .. method:: <I> addPurchase
    
        添加采购单
        
        判断销售项采购数量 , 数量不足 , 错误信息 **260054 销售项采购数量不足**
        
        更新销售项采购剩余数量
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.deliveryTime: 交付时间
        :type purchase.deliveryTime: Timestamp
        :param purchase.comment: 说明
        :type purchase.comment: String
        
        :param purchaseItems[n].siid: 销售项ID
        :type purchaseItems[n].siid: Long
        :param purchaseItems[n].goods.gid: 商品ID
        :type purchaseItems[n].goods.gid: Long
        :param purchaseItems[n].color.cid: 颜色ID
        :type purchaseItems[n].color.cid: Long
        :param purchaseItems[n].format.fid: 规格ID
        :type purchaseItems[n].format.fid: Long
        :param purchaseItems[n].inprice: 进价
        :type purchaseItems[n].inprice: Integer
        :param purchaseItems[n].num: 数量
        :type purchaseItems[n].num: Integer
        
        Example::
        
            {
                "purchase.comment": "说明",
                "purchase.deliveryTime": "2016-01-01 00:00:00",
                "purchaseItem[0].goods.gid": 1,
                "purchaseItem[0].color.cid": 1
                "purchaseItem[0].format.fid": 1,
                "purchaseItem[0].inprice": 100000,
                "purchaseItem[0].num": 10
            }
        
    .. method:: <I> updatePurchase
    
        更新采购单信息
        
        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**
        
        更新需要判断当前订单状态 , 初始状态能够完成更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**
    
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        :param purchase.deliveryTime: 交付时间
        :type purchase.deliveryTime: Timestamp
        :param purchase.comment: 说明
        :type purchase.comment: String
        
        Example::
        
            {
                "purchase.pid": 1,
                "purchase.deliveryTime": "2016-01-01 00:00:00",
                "purchase.comment": "说明",
            }
            
    .. method:: <I> updatePurchaseForStatus
    
        更新采购单信息
        
        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**
        
        采购单状态不能为全部入库 , 错误信息 **260018 采购单状态不可操作**
        
        采购单状态更新为2(全部入库)
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        
        Example::
        
            {
                "purchase.pid": 1
            }
        
    .. method:: <I> updatePurchaseForBalanceStatus
    
        更新采购单信息
        
        采购单信息不存在 , 更新失败 , 错误信息 **260017 采购单不存在**
        
        采购单结算状态更新为2(完结)
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        
        Example::
        
            {
                "purchase.pid": 1
            }

项目
---------------------

.. class:: api.inventory.PurchaseItemAction

    +---------+
    |DataType:|
    +---------+

    .. data:: purchaseItem
    
    :param piid: 采购项ID
    :type piid: Long
    :param pid: 采购单ID
    :type pid: Long
    :param siid: 销售项ID
    :type siid: Long
    :param goods: 商品 , 类型 `goods <./inventory.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./inventory.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./inventory.html#api.data.FormatAction.format>`__
    :type format: Object
    :param inprice: 商品单价
    :type inprice: Integer
    :param num: 数量
    :type num: Integer
    :param surplus: 剩余数量
    :type surplus: Integer
    
    .. method:: <I> queryPurchaseItemByPid
    
        通过采购单ID获取采购项
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        
        Example::
        
            {
                "purchase.pid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param purchaseItems: 采购项信息列表 , 每条数据类型 :data:`purchaseItem`
        :type purchaseItems: List
        
        Example::
        
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
            
    .. method:: <I> queryPurchaseItemByPids
    
        通过采购单ID获取采购项
        
        +---------+
        |Requests:|
        +---------+
        
        :param pids[n]: 采购单ID列表 , 每条数据类型 Long
        :type pids[n]: List
        
        Example::
        
            {
                "pids[0]": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param purchaseItems: 采购项信息列表 , 每条数据类型 :data:`purchaseItem`
        :type purchaseItems: List
        
        Example::
        
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
    
    .. method:: <I> addPurchaseItem
    
        添加采购项
        
        添加采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchase.pid: 采购单ID
        :type purchase.pid: Long
        :param purchaseItem.goods.gid: 商品ID
        :type purchaseItem.goods.gid: Long
        :param purchaseItem.color.cid: 颜色ID
        :type purchaseItem.color.cid: Long
        :param purchaseItem.format.fid: 规格ID
        :type purchaseItem.format.fid: Long
        :param purchaseItem.inprice: 单价
        :type purchaseItem.inprice: Integer
        :param purchaseItem.num: 数量
        :type purchaseItem.num: Integer
        
        Example::
        
            {
                "purchase.pid": 1,
                "purchaseItem.goods.gid": 1,
                "purchaseItem.color.cid": 1
                "purchaseItem.format.fid": 1,
                "purchaseItem.inprice": 100000,
                "purchaseItem.num": 10
            }
            
    .. method:: <I> updatePurchaseItem
    
        更新采购项
        
        更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**
        
        更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchaseItem.piid: 采购项ID
        :type purchaseItem.piid: Long
        :param purchaseItem.inprice: 单价
        :type purchaseItem.inprice: Integer
        :param purchaseItem.num: 数量
        :type purchaseItem.num: Integer
        
        Example::
        
            {
                "purchaseItem.piid": 1,
                "purchaseItem.inprice": 100000,
                "purchaseItem.num": "说明",
            }
            
    .. method:: <I> deletePurchaseItem
    
        删除采购项
        
        更新采购项需要判断对应采购单状态 , 初始状态能够完成项目更新动作 , 其他状态失败 , 错误信息 **260018 采购单状态不可操作**
        
        更新采购项信息不存在 , 更新失败 , 错误信息 **260019 采购项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchaseItem.piid: 采购项ID
        :type purchaseItem.piid: Long
        
        Example::
        
            {
                "purchaseItem.piid": 1
            }
            
货单
---------------------
采购单与货单关联

.. class:: api.inventory.PurchaseManifestAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: purchaseManifest
    
    :param pmid: 采购货单Id
    :type pmid: Long
    :param purchase: 采购单 , 类型 `purchase <./inventory.html#api.inventory.PurchaseAction.purchase>`__
    :type purchase: Object
    :param manifest: 货单 , 类型 `manifest <./inventory.html#api.inventory.ManifestAction.manifest>`__
    :type manifest: Object
    
结算
---------------------

.. class:: api.inventory.PurchaseBalanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: purchaseBalance
    
    :param pbid: 采购结算ID
    :type pbid: Long
    :param pid: 采购单ID
    :type pid: Long
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param balance: 结算值
    :type balance: Long
    :param status: 状态 , 0: 初始 , 1: 已付款
    :type status: Short
    :param comment: 说明
    :type comment: String

    .. method:: <I> queryPurchaseBalanceByPid
    
        通过采购单ID获取采购结算信息
    
        +--------+
        |Returns:|
        +--------+
        
        :param purchaseBalances: 采购结算信息列表 , 每条数据类型 :data:`purchaseBalance`
        :type purchaseBalances: List
        
        Example::
        
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
            
    .. method:: <I> addPurchaseBalance
    
        添加采购单对的结算信息
        
        采购单信息不存在 , 添加失败 , 错误信息 **260017 采购单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param purchaseBalance.pid: 采购单ID
        :type purchaseBalance.pid: Long
        :param purchaseBalance.balance: 结算值
        :type purchaseBalance.balance: Long
        :param purchaseBalance.comment: 说明
        :type purchaseBalance.comment: String
        
        Example::
        
            {
                "purchaseBalance.pid": 1,
                "purchaseBalance.balance": 100000,
                "purchaseBalance.comment": "说明",
            }
            
    .. method:: <I> updatePurchaseBalance
    
        更新采购结算信息
        
        采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**
        
        采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

        +---------+
        |Requests:|
        +---------+
        
        :param purchaseBalance.pbid: 采购结算ID
        :type purchaseBalance.pbid: Long
        :param purchaseBalance.balance: 结算值
        :type purchaseBalance.balance: Long
        :param purchaseBalance.comment: 说明
        :type purchaseBalance.comment: String
        
        Example::
        
            {
                "purchaseBalance.pbid": 1,
                "purchaseBalance.balance": 100000,
                "purchaseBalance.comment": "说明"
            }
            
    .. method:: <I> updatePurchaseBalanceForStatus
    
        更新采购结算状态
        
        采购结算信息不存在 , 更新失败 , 错误信息 **260039 采购结算信息不存在**
        
        采购结算状态不为0(初始) , 更新失败 , 错误信息 **260040 采购结算状态不可操作**

        +---------+
        |Requests:|
        +---------+
        
        :param purchaseBalance.pbid: 采购结算ID
        :type purchaseBalance.pbid: Long
        :param purchaseBalance.status: 状态
        :type purchaseBalance.status: Short
        
        Example::
        
            {
                "purchaseBalance.pbid": 1,
                "purchaseBalance.status": 100.00
            }
            

    
辅料
================

订单
---------------------

.. class:: api.inventory.AccessoriesAction
    
    .. data:: accessories
    
    :param aid: 辅料单ID
    :type aid: Long
    :param no: 编号
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param csid: 工程环节ID
    :type csid: Long
    :param house: 房产 , 类型 `house <./data.html#api.data.HouseAction.house>`__
    :type house: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param supervisor: 监理 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supervisor: Object
    :param approver: 审批人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type approver: Object
    :param deliver: 送货人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type deliver: Object
    :param createTime: 创建时间
    :type createTime: TimeStamp
    :param fetchTime: 领取时间
    :type fetchTime: TimeStamp
    :param approveTime: 审批事件
    :type approveTime: TimeStamp
    :param deliveTime: 送货时间
    :type deliveTime: TimeStamp
    :param total: 总价
    :type total: Long
    :param type: 类型 , 0: 普通 , 1: 售后
    :type type: Short
    :param status: 状态 , 包括: 0(初始), 1(预出), 2(出货), 3(撤销) , 4(拒绝) , 5(退回) , 6(到货), 7(审核)
    :type status: Short
    :param printnum: 打印次数
    :type printnum: Integer
    :param comment: 备注
    :type comment: String
    :param company: 公司
    :type company: Long
    
    .. method:: <I> pageAccessories
    
        分页方式获取辅料单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 订单信息列表 , 每条数据类型 :data:`accessories`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> queryAccessoriesByOrderId
    
        通过装修单号查询辅料单
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.orderId: 装修单号
        :type accessories.orderId: String
        
        Example::
        
            {
                "accessories.orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriess: 订单信息列表 , 每条数据类型 :data:`accessories`
        :type accessoriess: List
        
        Example::
        
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

    .. method:: <I> addAccessories
    
        创建辅料单
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 5(废单)/6(终止)/7(决算)/8(完工)不可添加 , 错误信息 **140004 装修单状态不可操作**
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        判断工程环节状态为1(开工)或2(完工) , 0(初始)状态 , 错误信息 **120025 工程环节不可操作**
        
        判断工程环节辅料控制 , 1(锁定状态) , 错误信息 **120028 辅料已禁用**
        
        判断环节辅料总额 , 超过总额上限 , 错误信息 **260058 辅料总额已达上限**
        
        判断辅料项对应的工程辅料数量 , 超过数量上限 , 错误信息 **辅料总数已达上限**
        
        创建辅料单需要工程环节状态为1(开工)或2(完工)
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.orderId: 装修单号
        :type accessories.orderId: String
        :param accessories.csid: 工程环节ID
        :type accessories.csid: Long
        :param accessories.supervisor.userId: 监理编号
        :type accessories.supervisor.userId: String
        :param accessories.type: 类型
        :type accessories.type: Short
        :param accessories.total: 总额
        :type accessories.total: Integer
        :param accessories.comment: 备注
        :type accessories.comment: String
        
        :param accessories.fetchTime: 领取时间
        :type accessories.fetchTime: TimeStamp
        :param accessoriesItems[n].goods.gid: 商品ID
        :type accessoriesItems[n].goods.gid: Long
        :param accessoriesItems[n].num: 数量
        :type accessoriesItems[n].num: Integer
        :param accessoriesItems[n].total: 总额
        :type accessoriesItems[n].total: Integer
        :param accessoriesItems[n].checkup: 验证标识
        :type accessoriesItems[n].checkup: Short
        :param accessoriesItems[n].caid: 工程辅料ID
        :type accessoriesItems[n].caid: Long
        
        Example::
        
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

    .. method:: <I> updateAccessoriesForPrint
    
        更新辅料单打印次数
        
        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        辅料单可打印对应的状态为1(预出)/2(出货)
        
        计数并更新辅料单打印次数
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }
            
    .. method:: <I> preoutAccessories
    
        预出辅料单
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        更新辅料单状态为1(预出)
        
        +---------+
        |Requests:|
        +---------+
       
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }

    .. method:: <I> auditAccessories
    
        审核辅料单
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        辅料单类型为1(售后) , 状态为1(预出) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        更新辅料单状态为7(审核)
        
        +---------+
        |Requests:|
        +---------+
       
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }
            
    .. method:: <I> cancelAccessories
    
        撤销辅料单
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        更新辅料单状态为3(撤销)
        
        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }
            
    .. method:: <I> refuseAccessories
    
        拒绝辅料单
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        更新辅料单状态为4(拒绝)
        
        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }
            
    .. method:: <I> deliveAccessories
    
        送货辅料单
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为2(出库) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        更新辅料单状态为6(到货) , 更新送货人以及送货时间
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        
        Example::
        
            {
                "accessories.aid": 1
            }



项目
---------------------

.. class:: api.inventory.AccessoriesItemAction

    .. data:: accessoriesItem
    
    :param aiid: 辅料项ID
    :type aiid: Long
    :param aid: 辅料单ID
    :type aid: Long
    :param goods: 商品 , 类型 `user <./inventory.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param selling: 销售价
    :type selling: Integer
    :param num: 数量
    :type num: Integer
    :param surplus: 余数
    :type surplus: Integer
    
    :param checkup: 验证标识
    :type checkup: Short
    :param caid: 工程辅料ID
    :type caid: Long
    
    .. method:: <I> queryAccessoriesItemByOrderId
    
        通过装修单号获取对应辅料项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.orderId: 装修单号
        :type accessories.orderId: String
        
        Example::
        
            {
                "accessories.orderId": "1601010001"
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriesItems: 辅料单项信息列表 , 每条数据类型 :data:`accessoriesItem`
        :type accessoriesItems: List
        
        Example::
        
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

    .. method:: <I> queryAccessoriesItemByAid
    
        通过辅料单ID获取对应辅料项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesItem.aid: 辅料单ID
        :type accessoriesItem.aid: Long
        
        Example::
        
            {
                "accessoriesItem.aid": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriesItems: 辅料单项信息列表 , 每条数据类型 :data:`accessoriesItem`
        :type accessoriesItems: List
        
        Example::
        
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
            
    .. method:: <I> queryAccessoriesItemByAids
    
        通过辅料单ID获取对应辅料项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param aids[n]: 辅料单ID
        :type aids[n]: Long
        
        Example::
        
            {
                "aids[0]": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriesItems: 辅料单项信息列表 , 每条数据类型 :data:`accessoriesItem`
        :type accessoriesItems: List
        
        Example::
        
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

    .. method:: <I> addAccessoriesItem
    
        添加辅料项到已存在辅料单
        
        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        :param accessories.total: 总价
        :type accessories.total: Long
        :param accessoriesItems[n].goods.gid: 商品ID
        :type accessoriesItems[n].goods.gid: Long
        :param accessoriesItems[n].num: 数量
        :type accessoriesItems[n].num: Integer
        
        Example::
        
            {
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItems[0].goods.gid": 1,
                "accessoriesItems[0].num": 1000
            }

    .. method:: <I> updateAccessoriesItem
    
        更新辅料项信息
        
        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        辅料项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**
        
        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**
        
        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        :param accessories.total: 总价
        :type accessories.total: Long
        :param accessoriesItem.aiid: 辅料项ID
        :type accessoriesItem.aiid: Long
        :param accessoriesItem.num: 数量
        :type accessoriesItem.num: Integer
        
        Example::
        
            {
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItem.aiid": 1,
                "accessoriesItem.num": 100000
            }

    .. method:: <I> deleteAccessoriesItem
    
        删除辅料项信息
        
        辅料单信息不存在 , 添加失败 , 错误信息 **260023 辅料单不存在**
        
        辅料单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        辅料项不存在 , 不能删除 , 错误信息 **260025 辅料项不存在**
        
        辅料单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**
        
        根据工程辅料关联辅材信息 , 更新工程单中辅料总额以及总数
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessories.aid: 辅料单ID
        :type accessories.aid: Long
        :param accessories.total: 总价
        :type accessories.total: Long
        :param accessoriesItem.aiid: 辅料项ID
        :type accessoriesItem.aiid: Long
        
        Example::
        
            {
                "accessories.aid": 1,
                "accessories.total": 10000,
                "accessoriesItem.aiid": 1
            }

成本
---------------------

.. class:: api.inventory.AccessoriesCostAction
    
    .. data:: accessoriesCost
    
    :param acid: 辅料成本ID
    :type acid: Long
    :param aid: 辅料单ID
    :type aid: Long
    :param isAdded: 是否为补料
    :type isAdded: Short
    :param isEnter: 可进园区
    :type isEnter: Short
    :param isLift: 有无电梯
    :type isLift: Short
    :param isExceed: 有无超阶
    :type isExceed: Short
    :param isAttic: 有无阁楼
    :type isAttic: Short
    :param floorNum: 楼层数
    :type floorNum: Integer
    :param baseNum: 地下室层数
    :type baseNum: Integer
    :param trafficPrice: 运费
    :type trafficPrice: Integer
    :param cost: 成本
    :type cost: Integer
    :param status: 状态 , 0: 初始
    :type status: Short

    .. method:: <I> queryAccessoriesCost
    
        查询辅料成本
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        +---------+
        |Requests:|
        +---------+
       
        :param accessoriesCost.aid: 辅料单ID
        :type accessoriesCost.aid: Long
        
        Example::
        
            {
                "accessoriesCost.aid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
            
        :param accessoriesCost: 辅料成本
        :type accessoriesCost: Object
        
        Example::
        
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
            
    .. method:: <I> updateAccessoriesCost
    
        更新辅料成本
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        +---------+
        |Requests:|
        +---------+
       
        :param accessoriesCost.aid: 辅料单ID
        :type accessoriesCost.aid: Long
        :param accessoriesCost.isAdded: 是否为补料
        :type accessoriesCost.isAdded: Long
        :param accessoriesCost.isEnter: 可进园区
        :type accessoriesCost.isEnter: Long
        :param accessoriesCost.isLift: 有无电梯
        :type accessoriesCost.isLift: Long
        :param accessoriesCost.isExceed: 有无超阶
        :type accessoriesCost.isExceed: Long
        :param accessoriesCost.isAttic: 有无阁楼
        :type accessoriesCost.isAttic: Long
        :param accessoriesCost.floorNum: 楼层数
        :type accessoriesCost.floorNum: Long
        :param accessoriesCost.baseNum: 地下室层数
        :type accessoriesCost.baseNum: Long
        :param accessoriesCost.cost: 成本
        :type accessoriesCost.cost: Long
        
        Example::
        
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
            
货单
---------------------
辅料单与货单关联

.. class:: api.inventory.AccessoriesManifestAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: accessoriesManifest
    
    :param amid: 辅料货单Id
    :type amid: Long
    :param accessories: 辅料单 , 类型 `accessories <./inventory.html#api.inventory.accessoriesAction.accessories>`__
    :type accessories: Object
    :param manifest: 货单 , 类型 `manifest <./inventory.html#api.inventory.ManifestAction.manifest>`__
    :type manifest: Object
    
外辅
================
    
订单
---------------------

外购辅料单 , 简化版辅料单功能 , 提供给厂商使用的辅料管理

.. class:: api.inventory.OccessoriesAction
    
    .. data:: occessories
    
    :param oid: 外辅单ID
    :type oid: Long
    :param no: 编号
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param supervisor: 监理 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supervisor: Object
    :param supplier: 厂商 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supplier: Object
    :param deliver: 配送人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type deliver: Object
    :param receiver: 接收人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type receiver: Object
    :param balancer: 结算人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type balancer: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param deliveTime: 配送时间
    :type deliveTime: Timestamp
    :param receiveTime: 接收时间
    :type receiveTime: Timestamp
    :param balanceTime: 结算时间
    :type balanceTime: Timestamp
    :param finishTime: 完成时间
    :type finishTime: Timestamp
    :param isEnter: 可进园区
    :type isEnter: Short
    :param isLift: 有无电梯
    :type isLift: Short
    :param isExceed: 有无超阶
    :type isExceed: Short
    :param isAttic: 有无阁楼
    :type isAttic: Short
    :param rate: 评分
    :type rate: Integer
    :param status: 状态 , 包括: 0(初始), 1(分配), 2(送货), 3(到货), 4(结算) , 5(完成)
    :type status: Short
    :param comment: 说明(创建)
    :type comment: String
    :param content: 内容(送货)
    :type content: String
    :param remake: 评价(评分)
    :type remake: String
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageOccessories
    
        分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 订单信息列表 , 每条数据类型 :data:`occessories`
        :type paging.data: List
        
        Example::
        
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

    .. method:: <I> pageOccessoriesForSupplier
    
        分页方式获取外辅单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        厂商作为默认条件进行查询
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessories.supplier.uid: 厂商ID
        :type occessories.supplier.uid: Long
        
        Example::
        
            {
                "occessories.supplier.uid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 订单信息列表 , 每条数据类型 :data:`occessories`
        :type paging.data: List
        
        Example::
        
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

    .. method:: <I> queryOccessoriesByOrderId
    
        通过装修单号获取信息

        +---------+
        |Requests:|
        +---------+
        
        :param occessories.orderId: 装修单号
        :type occessories.orderId: Long
        
        Example::
        
            {
                "occessories.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param occessories: 外辅单信息 , 类型 :data:`occessories`
        :type occessories: Object
        
        Example::
        
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

    .. method:: <I> queryOccessoriesByOid
    
        通过外辅单ID获取信息

        +---------+
        |Requests:|
        +---------+
        
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        
        Example::
        
            {
                "occessories.oid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param occessories: 外辅单信息 , 类型 :data:`occessories`
        :type occessories: Object
        
        Example::
        
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
        
    .. method:: <I> addOccessories
    
        创建外辅单
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessories.orderId: 装修单号
        :type occessories.orderId: String
        :param occessories.supervisor.uid: 监理编号
        :type occessories.supervisor.uid: String
        :param occessories.isEnter: 有无电梯
        :type occessories.isEnter: Short
        :param occessories.isExceed: 有无超阶
        :type occessories.isExceed: Short
        :param occessories.isAttic: 有无阁楼
        :type occessories.isAttic: Short
        :param occessories.comment: 说明
        :type occessories.comment: String
        
        :param occessoriesItems[n].goods.gid: 商品ID
        :type occessoriesItems[n].goods.gid: Long
        :param occessoriesItems[n].num: 数量
        :type occessoriesItems[n].num: Integer
        :param occessoriesItems[n].rbalance: 结算金额
        :type occessoriesItems[n].rbalance: Integer
        
        Example::
        
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

    .. method:: <I> bindOccessories
    
        绑定外辅单
        
        外辅单不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        更新外辅单状态为1(分配)
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        :param occessories.supplier.uid: 厂商ID
        :type occessories.supplier.uid: Long
        
        Example::
        
            {
                "occessories.oid": 1,
                "occessories.supplier.uid": 1
            }

    .. method:: <I> deliveOccessories
    
        发货外辅单
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为1(分配) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        更新外辅单状态为2(发货) , 更新发货时间和发货人
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        :param occessories.content: 内容
        :type occessories.content: String
        
        :param occessoriesItems[n].sennum: 送货数量
        :type occessoriesItems[n].sennum: Integer
        
        Example::
        
            {
                "occessories.oid": 1,
                "occessories.content": "",
                
                "occessoriesItems[0].sennum": 0
            }

    .. method:: <I> receiveOccessories
    
        到货外辅单
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为2(发货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        更新外辅单状态为3(到货) , 更新到货时间和接收人
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        
        :param occessoriesItems[n].oiid: 外辅项ID
        :type occessoriesItems[n].oiid: Long
        :param occessoriesItems[n].recnum: 到货数量
        :type occessoriesItems[n].recnum: Integer
        
        Example::
        
            {
                "occessories.oid": 1,
                
                "occessoriesItems[0].oiid": 0,
                "occessoriesItems[0].recnum": 0
            }

    .. method:: <I> balanceOccessories
    
        结算外辅单
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为3(到货) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        更新外辅单状态为4(结算) , 更新结算时间和结算人
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        
        :param occessoriesItems[n].oiid: 外辅项ID
        :type occessoriesItems[n].oiid: Long
        :param occessoriesItems[n].vbalance: 结算值
        :type occessoriesItems[n].vbalance: Integer
        
        Example::
        
            {
                "occessories.oid": 1,
                
                "occessoriesItems[0].oiid": 0,
                "occessoriesItems[0].vbalance": 0
            }

    .. method:: <I> finishOccessories
    
        完成
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为4(结算) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        更新外辅单状态为5(完成) , 更新完成时间
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        
        Example::
        
            {
                "occessories.oid": 1
            }

    .. method:: <I> rateOccessories
    
        评分
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        :param occessories.rate: 外辅单ID
        :type occessories.rate: Long
        :param occessories.remake: 外辅单ID
        :type occessories.remake: Long
        
        Example::
        
            {
                "occessories.oid": 1,
                "occessories.rate": 1,
                "occessories.remake": ""
            }

    .. method:: <I> deleteOccessories
    
        删除外辅单
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        
        Example::
        
            {
                "occessories.oid": 1
            }

项目
---------------------

.. class:: api.inventory.OccessoriesItemAction
    
    .. data:: occessoriesItem
    
    :param oiid: 外辅项ID
    :type oiid: Long
    :param oid: 外辅单ID
    :type oid: Long
    :param goods: 商品 , 类型 `goods <./inventory.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param num: 数量
    :type num: Integer
    :param sennum: 送货数量
    :type sennum: Integer
    :param recnum: 到货数量
    :type recnum: Integer
    :param rbalance: 原结算价
    :type rbalance: Integer
    :param vbalance: 结算价
    :type vbalance: Integer

    .. method:: <I> queryOccessoriesItemByOid
    
        通过外辅单ID获取对应外辅项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessoriesItem.oid: 外辅单ID
        :type occessoriesItem.oid: Long
        
        Example::
        
            {
                "occessoriesItem.oid": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param occessoriesItems: 外辅单项信息列表 , 每条数据类型 :data:`occessoriesItem`
        :type occessoriesItems: List
        
        Example::
        
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

    .. method:: <I> addOccessoriesItem
    
        添加外辅项到已存在外辅单
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        外辅单状态不为0(初始) , 添加失败 , 错误信息 **260024 辅料单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessories.oid: 外辅单ID
        :type occessories.oid: Long
        :param occessoriesItems[n].goods.gid: 商品ID
        :type occessoriesItems[n].goods.gid: Long
        :param occessoriesItems[n].num: 数量
        :type occessoriesItems[n].num: Integer
        
        Example::
        
            {
                "occessories.oid": 1,
                "occessoriesItems[0].goods.gid": 1,
                "occessoriesItems[0].num": 1000
            }
    
    .. method:: <I> updateOccessoriesItem
    
        更新外辅项
        
        外辅项信息不存在 , 删除失败 , 错误信息 **260025 辅料项不存在**
        
        判断外辅单状态是否为4(结算) , 不可操作 , 错误信息 **260024 辅料单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessoriesItem.oiid: 外辅项ID
        :type occessoriesItem.oiid: Long
        :param occessoriesItem.recnum: 数量
        :type occessoriesItem.recnum: Integer
        :param occessoriesItem.vbalance: 结算价
        :type occessoriesItem.vbalance: Integer
        
        Example::
        
            {
                "occessoriesItem.oiid": 1,
                "occessoriesItem.recnum": 100000,
                "occessoriesItem.vbalance": 100000
            }

    .. method:: <I> deleteOccessoriesItem
    
        删除外辅项
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        判断外辅单状态是否为0(初始) , 其他状态 , 错误信息 **260024 辅料单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param occessoriesItem.oiid: 外辅项ID
        :type occessoriesItem.oiid: Long
        
        Example::
        
            {
                "occessoriesItem.oiid": 1
            }

费用
---------------------

.. class:: api.inventory.OccessoriesCostAction
    
    .. data:: occessoriesCost
    
    :param ocid: 外辅费用ID
    :type ocid: Long
    :param oid: 辅料单ID
    :type oid: Long
    :param initPrice: 初始金额
    :type initPrice: Integer
    :param price: 金额
    :type price: Integer
    :param cost: 成本
    :type cost: Integer
    :param type: 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费
    :type type: Short
    :param status: 状态 , 0: 初始
    :type status: Short

    .. method:: <I> queryOccessoriesCost
    
        查询辅料成本
        
        辅料单不存在 , 错误信息 **260023 辅料单不存在**
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessoriesCost.oid: 辅料单ID
        :type occessoriesCost.oid: Long
        
        Example::
        
            {
                "occessoriesCost.oid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
            
        :param occessoriesCost: 辅料成本
        :type occessoriesCost: Object
        
        Example::
        
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
            
    .. method:: <I> addOccessoriesCost
    
        创建外辅费用
        
        判断外辅单是否存在 , 不存在 , 错误信息 **260023 辅料单不存在**
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessoriesCost.oid: 外辅单ID
        :type occessoriesCost.oid: Long
        :param occessoriesCost.price: 金额
        :type occessoriesCost.price: Long
        :param occessoriesCost.cost: 成本
        :type occessoriesCost.cost: Long
        
        Example::
        
            {
                "occessoriesCost.oid": 1,
                "occessoriesCost.price": 10000,
                "occessoriesCost.cost": 10000,
            }

    .. method:: <I> updateOccessoriesCost
    
        更新外辅费用
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessoriesCost.oid: 外辅单ID
        :type occessoriesCost.oid: Long
        :param occessoriesCost.price: 金额
        :type occessoriesCost.price: Long
        :param occessoriesCost.cost: 成本
        :type occessoriesCost.cost: Long
        
        Example::
        
            {
                "occessoriesCost.oid": 1,
                "occessoriesCost.price": 10000,
                "occessoriesCost.cost": 10000,
            }

    .. method:: <I> deleteOccessoriesCost
    
        删除外辅费用
        
        +---------+
        |Requests:|
        +---------+
       
        :param occessoriesCost.ocid: 外辅费用ID
        :type occessoriesCost.ocid: Long
        
        Example::
        
            {
                "occessoriesCost.ocid": 1
            }

商品库存
================

商品在仓库中的存量以及相关信息管理

.. class:: api.inventory.GoodsStorehouseStockAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: goodsStorehouseStock
    
    :param gshsid: 库存信息ID
    :type gshsid: Long
    :param miid: 货单项ID
    :type miid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./data.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./data.html#api.data.FormatAction.format>`__
    :type format: Object
    :param storehouse: 仓库信息 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type storehouse: Object
    :param num: 库存量
    :type num: Long
    
    .. method:: <I> pageGoodsStorehouseStock
    
        分页方式获取库存信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 库存信息列表 , 每条数据类型 :data:`goodsStorehouseStock`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> queryGoodsStorehouseStockByGid
    
        通过商品ID获取商品库存
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 商品ID
        :type goodsStorehouseStock.goods.gid: Long
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
            
        :param goodsStorehouseStock: 库存信息 , 其中num字段为汇总数值
        :type goodsStorehouseStock: Object
        
        Example::
        
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
            
    .. method:: <I> queryGoodsStorehouseStockByShidAGid
    
        通过商品ID和仓库ID获取商品库存
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 商品ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type goodsStorehouseStock.storehouse.shid: Long
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1
                "goodsStorehouseStock.storehouse.shid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
            
        :param goodsStorehouseStock: 库存信息 , 其中num字段为汇总数值
        :type goodsStorehouseStock: Object
        
        Example::
        
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
            
    .. method:: <I> makeGoodsStorehouseStock
    
        生成商品库存 , 库存数量默认为0
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 商品ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.color.cid: 颜色ID
        :type gooesStorehouseStock.color.cid: Long
        :param goodsStorehouseStock.format.fid: 规格ID
        :type gooesStorehouseStock.format.fid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type gooesStorehouseStock.storehouse.shid: Long

        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1
            }

    .. method:: <I> plusGoodsStorehouseStock
    
        盘盈
        
        判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**
        
        生成对应货单以及货单项
        
        生成对应商品(供应商/颜色/规格)库存信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 商品ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.color.cid: 颜色ID
        :type gooesStorehouseStock.color.cid: Long
        :param goodsStorehouseStock.format.fid: 规格ID
        :type gooesStorehouseStock.format.fid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type gooesStorehouseStock.storehouse.shid: Long
        :param goodsStorehouseStock.num: 数量
        :type goodsStorehouseStock.num: Long
        :param goodsStorehouseStock.surplus: 采购价
        :type goodsStorehouseStock.surplus: Long
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 1000,
                "goodsStorehouseStock.surplus": 10000
            }
    
    .. method:: <I> loseGoodsStorehouseStock
    
        盘亏
        
        判断商品(供应商/颜色/规格)是否存在商品库存 , 不存在 , 错误信息 **260011 商品库存不存在**
        
        判断商品(供应商/颜色/规格)是否存在商品库存数量是否满足盘亏数量 , 错误信息 **260008 商品库存不足**
        
        生成对应货单以及货单项
        
        根据对应的商品(供应商/颜色/规格)库存 , 按照盘亏数量以及先入先出规则进行匹配 , 减少对应商品库存
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 商品ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.color.cid: 颜色ID
        :type gooesStorehouseStock.color.cid: Long
        :param goodsStorehouseStock.format.fid: 规格ID
        :type gooesStorehouseStock.format.fid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type gooesStorehouseStock.storehouse.shid: Long
        :param goodsStorehouseStock.num: 数量
        :type goodsStorehouseStock.num: Long
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 1000
            }

    .. method:: <I> mergePackage
    
        合并套餐库存
        
        判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**
        
        判断套餐归属商品库存 , 库存量不足 , 错误信息 **260008 商品库存不足**
        
        如果套餐库存不存在创建套餐对应的库存信息
        
        更新套餐归属商品库存量
        
        创建套合类型货单
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 套餐ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.color.cid: 颜色ID
        :type goodsStorehouseStock.color.cid: Long
        :param goodsStorehouseStock.format.fid: 规格ID
        :type goodsStorehouseStock.format.fid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type goodsStorehouseStock.storehouse.shid: Long
        :param goodsStorehouseStock.num: 合并数量
        :type goodsStorehouseStock.num: Long
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 10000
            }
            
    .. method:: <I> splitPackage
    
        拆分套餐库存
        
        判断套餐是否存在 , 不存在 , 错误信息 **260041 套餐不存在**
        
        判断套餐库存 , 库存量不足 , 错误信息 **260008 商品库存不足**
        
        如果套餐归属商品库存不存在创建商品对应的库存信息
        
        更新套餐归属商品库存量
        
        创建拆类型货单
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsStorehouseStock.goods.gid: 套餐ID
        :type goodsStorehouseStock.goods.gid: Long
        :param goodsStorehouseStock.color.cid: 颜色ID
        :type goodsStorehouseStock.color.cid: Long
        :param goodsStorehouseStock.format.fid: 规格ID
        :type goodsStorehouseStock.format.fid: Long
        :param goodsStorehouseStock.storehouse.shid: 仓库ID
        :type goodsStorehouseStock.storehouse.shid: Long
        :param goodsStorehouseStock.num: 合并数量
        :type goodsStorehouseStock.num: Integer
        
        Example::
        
            {
                "goodsStorehouseStock.goods.gid": 1,
                "goodsStorehouseStock.color.cid": 1,
                "goodsStorehouseStock.format.fid": 1,
                "goodsStorehouseStock.storehouse.shid": 1,
                "goodsStorehouseStock.num": 10000
            }
    
库存
================

库存信息 , 按照月份统计仓库存量

.. class:: api.inventory.StorehouseStockAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: storehouseStock
    
    :param shsid: 库存ID
    :type shsid: Long
    :param storehouse: 仓库信息 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type storehouse: Object
    :param month: 年月 , 格式 "yyyyMM"
    :type month: String
    :param num: 存量
    :type num: Long
    
    .. method:: <I> queryStorehouseStock
    
        获取仓库存量信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param storehouseStocks: 库存信息列表 , 每条数据类型 :data:`storehouseStock`
        :type storehouseStocks: List
        
        Example::
        
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

图片
================

图片信息管理 , 提供如楼盘图片等资源

.. class:: api.inventory.InventoryDrawingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: inventoryDrawing
    
    :param idid: 图片ID
    :type idid: Long
    :param sid: 关联ID
    :type sid: Long
    :param name: 名称
    :type name: String
    :param path: 图片路径
    :type path: String
    :param size: 图片大小
    :type size: Integer
    :param type: 图片类型 , 0: 本地 , 1: 钉钉
    :type type: Short
    :param atttype: 类型 , 0: 外辅
    :type atttype: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> queryInventoryDrawing
    
        通过关联ID以及类型获取图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param inventoryDrawing.sid: 关联ID
        :type inventoryDrawing.sid: Long
        :param inventoryDrawing.atttype: 业务类型
        :type inventoryDrawing.atttype: Short
        
        Example::
        
            {
                "inventoryDrawing.sid": 1,
                "inventoryDrawing.atttype": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param inventoryDrawings: 图片信息列表 , 每条数据类型 :data:`inventoryDrawing`
        :type inventoryDrawings: List
        
        Example::
        
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
            
    .. method:: <C> addInventoryDrawing
    
        添加图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param inventoryDrawing.sid: 关联ID
        :type inventoryDrawing.sid: Long
        :param inventoryDrawing.name: 名称
        :type inventoryDrawing.name: String
        :param inventoryDrawing.path: 路径
        :type inventoryDrawing.path: String
        :param inventoryDrawing.type: 图片类型
        :type inventoryDrawing.type: Short
        :param inventoryDrawing.atttype: 业务类型
        :type inventoryDrawing.atttype: Short
        
        Example::
        
            {
                "inventoryDrawing.sid": 1,
                "inventoryDrawing.name": "name.jpg",
                "inventoryDrawing.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "inventoryDrawing.type": 0,
                "inventoryDrawing.atttype": 0
            }

    .. method:: <C> deleteInventoryDrawing
    
        删除图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param inventoryDrawing.idid: 图片ID
        :type inventoryDrawing.idid: Long
        
        Example::
        
            {
                "inventoryDrawing.idid": 1
            }