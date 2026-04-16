
.. _data:

***************
数据
***************

楼盘
================

楼盘信息管理

.. class:: api.communion.VillageAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: village
    
    :param vid: 楼盘ID
    :type vid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param pinyinAB: 拼音缩写
    :type pinyinAB: String
    :param pinyinAll: 拼音
    :type pinyinAll: String
    :param cityProper: 城区 , 类型 `cityProper <./system.html#api.system.CityProperAction.cityProper>`__
    :type cityProper: Object
    :param developer: 开发商
    :type developer: String
    :param salesPhone: 销售电话
    :type salesPhone: String
    :param deliveryTime: 开盘时间
    :type deliveryTime: String
    :param x: 楼盘位置坐标 , 经度
    :type x: Integer
    :param y: 楼盘位置坐标 , 纬度
    :type y: Integer
    :param url: 默认图片
    :type url: String
    :param content: 说明
    :type content: String
    :param status: 状态 , 0: 禁用 , 1: 启用
    :type status: Short
    
    .. data:: keyValue
    
    :param key: 键
    :type key: String
    :param value: 值
    :type value: String
    
    .. method:: <I> pageVillage
    
        分页方式获取楼盘信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
    
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 楼盘信息列表 , 每条数据类型 :data:`village`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "vid": 6,
                            "no": "P001",
                            "name": "广场一期",
                            "pinyinAB": null,
                            "pinyinAll": null,
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "x": 123367996,
                            "y": 41787998,
                            "url": "/JSIODFNSNDF.JPG",
                            "content": "字母数字#A或B或C-×-×",
                            "cityProper": {
                                "cpid": 1,
                                "no": "CP001",
                                "name": "铁西",
                                "city": {
                                    "cid": 1,
                                    "no": "C001",
                                    "name": "沈阳",
                                    "region": {
                                        "rid": 1,
                                        "no": "R001",
                                        "name": "东北区"
                                    }
                                }
                            },
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryVillageByVid
    
        通过楼盘ID获取楼盘信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param village.vid: 楼盘ID
        :type village.vid: Long
        
        Example::
        
            {
                "village.vid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param vilalge: 楼盘信息 , 类型 :data:`village`
        :type vilalge: object
        
        Example::
        
            {
                ...
                "village": {
                    "vid": 6,
                    "no": "P001",
                    "name": "广场一期",
                    "deliveryTime": null,
                    "developer": "222",
                    "salesPhone": "",
                    "x": 123367996,
                    "y": 41787998,
                    "content": "字母数字#A或B或C-×-×",
                    "url": "/JSIODFNSNDF.JPG",
                    "cityProper": {
                        "cpid": 1,
                        "no": "CP001",
                        "name": "铁西",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            ...
                        }
                    },
                }
                ...
            }
            
    .. method:: <I> queryVillageForNameByPinyin
    
        通过拼音信息获取楼盘名称信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param pinyinName: 楼盘名拼音
        :type pinyinName: String
        
        Example::
        
            {
                "pinyinName": "wd"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为楼盘编号 , 值为楼盘名
        :type autoFillKeyValue: List
        :param autoFillList: 楼盘名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "P001",
                        "value": "广场一期"
                    }
                ],
                "autoFillList": [
                    "广场一期"
                ],
                ...
            }
            
    .. method:: <C> addVillage
    
        添加楼盘信息
        
        根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param village.name: 楼盘名称
        :type village.name: String
        :param village.no: 城区编号
        :type village.no: String
        :param village.developer: 开发商
        :type village.developer: String
        :param village.salesPhone: 销售电话
        :type village.salesPhone: String
        :param village.deliveryTime: 开盘时间
        :type village.deliveryTime: String
        :param village.content: 说明
        :type village.content: String
        :param village.x: 经度
        :type village.x: Integer
        :param village.y: 纬度
        :type village.y: Integer
        
        Example::
        
            {
                "village.name": "广场一期",
                "village.no": "CP001",
                "village.developer": "222",
                "village.salesPhone": "",
                "village.deliveryTime": null,
                "village.x": 0,
                "village.y": 0,
                "village.content": "",
            }
            
    .. method:: <C> updateVillage
    
        更新楼盘信息
        
        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**
        
        根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param village.vid: 楼盘ID
        :type village.vid: String
        :param village.name: 楼盘名称
        :type village.name: String
        :param village.cityProper.cpid: 城区ID
        :type village.cityProper.cpid: String
        :param village.developer: 开发商
        :type village.developer: String
        :param village.salesPhone: 销售电话
        :type village.salesPhone: String
        :param village.deliveryTime: 开盘时间
        :type village.deliveryTime: String
        :param village.content: 说明
        :type village.content: String
        :param village.x: 经度
        :type village.x: Integer
        :param village.y: 纬度
        :type village.y: Integer
        
        Example::
        
            {
                "village.vid": 1,
                "village.name": "广场一期",
                "village.cityProper.cpid": 1,
                "village.developer": "222",
                "village.salesPhone": "",
                "village.deliveryTime": null,
                "village.x": 0,
                "village.y": 0,
                "village.content": "",
            }
            
    .. method:: <C> updateVillageForStatus
    
        更新楼盘状态 , 启用禁用
        
        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param village.vid: 楼盘ID
        :type village.vid: Long
        :param village.status: 状态 , 0: 禁用 , 1: 启用
        :type village.status: Short
        
        Example::
        
            {
                "village.vid": 1,
                "village.status": 0
            }
            
    .. method:: <C> updateVillageForPosition
    
        更新楼盘位置信息
        
        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param village.vid: 楼盘ID
        :type village.vid: Long
        :param village.x: 横坐标
        :type village.x: Integer
        :param village.y: 纵坐标
        :type village.y: Integer
        
        Example::
        
            {
                "village.vid": 1,
                "village.x": 0,
                "village.y": 0
            }
    
    .. method:: <C> updateVillageForUrl
    
        更新楼盘默认图片
        
        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param village.vid: 楼盘ID
        :type village.vid: Long
        :param village.url: 默认图片
        :type village.url: String
        
        Example::
        
            {
                "village.vid": 1,
                "village.url": "/JSIODFNSNDF.JPG"
            }

            
规则
================

.. class:: api.communion.VillageRuleAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: villageRule
    
    :param vrid: 规则ID
    :type vrid: Long
    :param vid: 楼盘ID
    :type vid: Long
    :param rule: 规则 , `buildingNameRule <./data.html#api.data.BuildingNameRuleAction.buildingNameRule>`__
    :type rule: Object
    
    .. method:: <I> queryVillageRule
    
    .. method:: <I> addVillageRule
    
    .. method:: <I> deleteVillageRule

户型
================

.. class:: api.communion.HouseLayoutAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: houseLayout
    
    :param hlid: 户型ID
    :type hlid: Long
    :param village: 楼盘 , `village <./data.html#api.data.VillageAction.village>`__
    :type village: Object
    :param name: 名称
    :type name: String
    :param layout: 房型
    :type layout: String
    :param area: 面积
    :type area: Long
    :param houseType: 类型
    :type houseType: String
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> pageHouseLayout
    
        分页方式获取户型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
    
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 户型信息列表 , 每条数据类型 :data:`houseLayout`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "hlid": 1,
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期"
                            },
                            "name": "名称",
                            "layout": "",
                            "area": 100000,
                            "houseType": "",
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryHouseLayout
    
        根据楼盘ID获取户型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param houseLayout.vid: 楼盘ID
        :type houseLayout.vid: Long
        
        Example::
        
            {
                "houseLayout.vid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param houseLayouts: 户型信息列表 , 每条数据类型 :data:`houseLayout`
        :type houseLayouts: List
        
        Example::
        
            {
                ...
                "houseLayouts": [
                    {
                        "hlid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "name": "名称",
                        "layout": "",
                        "area": 100000,
                        "houseType": "",
                        "comment": "说明"
                    }
                ],
                ...
            }
            
    .. method:: <I> addHouseLayout
    
        添加户型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param houseLayout.name: 名称
        :type houseLayout.name: String
        :param houseLayout.village.vid: 楼盘ID
        :tyoe houseLayout.village.vid: Long
        :param houseLayout.layout: 房型
        :type houseLayout.layout: String
        :param houseLayout.area: 面积
        :type houseLayout.area: Long
        :param houseLayout.houseType: 类型
        :type houseLayout.houseType: Long
        :param houseLayout.comment: 备注
        :type houseLayout.comment: String
        
        Example::
        
            {
                "houseLayout.name": "名称",
                "houseLayout.village.vid": 1,
                "houseLayout.layout": "",
                "houseLayout.area": 100000,
                "houseLayout.houseType": "",
                "houseLayout.comment": "说明",
            }
            
    .. method:: <C> deleteHouseLayout
    
        删除户型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param houseLayout.hlid: 户型ID
        :type houseLayout.hlid: Long
        
        Example::
        
            {
                "houseLayout.hlid": 1
            }

房产
================

.. class:: api.communion.HouseAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: house
    
    
    :param hid: 房产ID
    :type hid: Long
    :param village: 楼盘 , 类型 `village <./data.html#api.data.VillageAction.village>`__
    :type village: Object
    :param houseNumber: 楼牌号
    :type houseNumber: String
    :param built: 楼号
    :type built: Integer
    :param unit: 单元
    :type unit: Integer
    :param floor: 楼层
    :type floor: Integer
    :param door: 门号
    :type door: Integer
    :param type: 房产类型 , 包括: 0(住宅) , 1(半越住宅) , 2(全越住宅) , 3(门市房) , 4(窗改门) , 5(商住综合) , 6(酒店公寓) , 7(写字间) , 8(别墅厂房) , 9(仓库) , 10(车库) , 11(其它)
    :type type: Short
    :param buildArea: 建筑面积
    :type buildArea: Integer
    :param freeArea: 赠送面积
    :type freeArea: Integer
    :param innerArea: 套内面积
    :type innerArea: Integer
    :param quoteArea: 报价面积
    :type quoteArea: Integer
    :param totalArea: 总面积
    :type totalArea: Integer
    :param maxFloor: 最高楼层
    :type maxFloor: Short
    :param through: 是否越层 , 包括: 0(否) , 1(是)
    :type through: Short
    :param roomNum: 房间数量
    :type roomNum: Integer
    :param houseType: 户型 , 例如: 1室1厅1卫1厨
    :type houseType: String
    :param orientation: 房屋朝向 , 包括: 0(南北) , 1(东西) , 2(双阳) , 3(双东) , 4(双西) , 5(双北) , 6(东南) , 7(东北) , 8(西南) , 9(西北) , 10(其它)
    :type orientation: Short
    :param feature: 三不 , 包括: 封顶 , 把东山 , 把西山 , 挡光 , 临街 , 不想
    :type feature: String
    :param waterVapour: 水气设施 , 包括: 0(两水一气) , 1(两水两气) , 2(三水两气)
    :type waterVapour: Short
    :param parlourType: 客厅类型 , 包括: 0(明厅) , 1(暗厅)
    :type parlourType: Short
    :param heatingType: 供暖类型 , 包括: 0(热网) , 1(锅炉房) , 2(燃气)
    :type heatingType: Short
    :param status: 状态 , 包括: 0(初始)
    :type status: Short
    
    .. method:: <I> pageHouse
    
        分页方式获取房产信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 房产信息列表 , 每条数据类型 :data:`house`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "hid": 1,
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期"
                            },
                            "houseNumber": "1#1-1-1",
                            "built": 1,
                            "unit": 1,
                            "floor": 1,
                            "door": 1,
                            "type": 0,
                            "buildArea": 88.6,
                            "freeArea": 0,
                            "innerArea": 0,
                            "quoteArea": 0,
                            "totalArea": 0,
                            "maxFloor": 7,
                            "through": 0,
                            "roomNum": 2,
                            "houseType": "2室1厅1卫1厨",
                            "orientation": 0,
                            "feature": ["临街", "把西山"],
                            "waterVapour": 0,
                            "parlourType": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryHouseByHid
    
        根据房产ID获取房产信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param house.hid: 房产ID
        :type house.hid: Long
        
        Example::
        
            {
                "house.hid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param houses: 房产信息列表 , 每条数据类型 :data:`house`
        :type houses: List
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "freeArea": 0,
                        "innerArea": 0,
                        "quoteArea": 0,
                        "totalArea": 0,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryHouseByNoAHnum
    
        通过楼盘编号以及楼牌号查询房产信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param house.village.no: 楼盘编号
        :type house.village.no: String
        :param house.houseNumber: 楼牌号
        :type house.houseNumber: String
        
        Example::
        
            {
                "house.village.no": "P001",
                "house.houseNumber": "1#1-1-1"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param houses: 房产信息列表 , 每条数据类型 :data:`house`
        :type houses: List
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "freeArea": 0,
                        "innerArea": 0,
                        "quoteArea": 0,
                        "totalArea": 0,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <C> addHouse
    
        添加房产信息
        
        判断楼盘号是否存在 , 错误信息 **320001 楼牌号已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param house.village.vid: 楼盘ID
        :type house.village.vid: Long
        :param house.houseNumber: 楼牌号
        :type house.houseNumber: String
        :param house.built: 楼号
        :type house.built: Integer
        :param house.unit: 单元
        :type house.unit: Integer
        :param house.floor: 楼层
        :type house.floor: Integer
        :param house.door: 门号
        :type house.door: Integer
        :param house.type: 房产类型
        :type house.type: Short
        :param house.buildArea: 建筑面积
        :type house.buildArea: Integer
        :param house.freeArea: 赠送面积
        :type house.freeArea: Integer
        :param house.innerArea: 套内面积
        :type house.innerArea: Integer
        :param house.totalArea: 总面积
        :type house.totalArea: Integer
        :param house.maxFloor: 最高楼层
        :type house.maxFloor: Short
        :param house.through: 是否越层
        :type house.through: Short
        :param house.roomNum: 房间数量
        :type house.roomNum: Integer
        :param house.houseType: 户型
        :type house.houseType: String
        :param house.orientation: 房屋朝向
        :type house.orientation: Short
        :param house.feature: 三不
        :type house.feature: String
        :param house.waterVapour: 水气设施
        :type house.waterVapour: Short
        :param house.parlourType: 客厅类型
        :type house.parlourType: Short
        :param house.heatingType: 供暖类型
        :type house.heatingType: Short
        
        Example::
        
            {
                "house.village.vid": 2,
                "house.houseNumber": "1#1-1-1",
                "house.built": 1,
                "house.unit": 1,
                "house.floor": 1,
                "house.door": 1,
                "house.type": 0,
                "house.buildArea": 88.6,
                "house.freeArea": 0,
                "house.innerArea": 0,
                "house.totalArea": 0,
                "house.maxFloor": 7,
                "house.through": 0,
                "house.roomNum": 2,
                "house.houseType": "1室1厅1卫1厨",
                "house.orientation": 0,
                "house.feature": "["临街", "把东山"]",
                "house.waterVapour": 0,
                "house.parlourType": 0,
                "house.heatingType": 0
            }

    .. method:: <I> existHouse
    
        通过楼盘ID和楼号判断房产信息 , 不存在创建 , 存在返回房产信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param house.village.vid: 楼盘ID
        :type house.village.vid: Long
        :param house.houseNumber: 楼牌号
        :type house.houseNumber: String
        :param house.buildArea: 建筑面积
        :type house.buildArea: Integer
        :param house.freeArea: 赠送面积
        :type house.freeArea: Integer
        :param house.innerArea: 套内面积
        :type house.innerArea: Integer
        :param house.totalArea: 总面积
        :type house.totalArea: Integer
        :param house.built: 楼号
        :type house.built: Integer
        :param house.unit: 单元
        :type house.unit: Integer
        :param house.floor: 楼层
        :type house.floor: Integer
        :param house.door: 门号
        :type house.door: Integer
        
        Example::
        
            {
                "house.village.vid": 2,
                "house.houseNumber": "1#1-1-1",
                "house.buildArea": 100000,
                "house.freeArea": 0,
                "house.innerArea": 0,
                "house.totalArea": 0,
                "house.built": 1,
                "house.unit": 1,
                "house.floor": 1,
                "house.door": 1
            }

    .. method:: <C> updateHouse
    
        更新房产信息
        
        判断房产是否存在 , 错误信息 **320002 房产不存在**
        
        判断房产状态是否为已出售 , 已出售房产状态不可操作 , 错误信息 **320003 房产状态不可操作**
		
        +---------+
        |Requests:|
        +---------+
        
        :param house.hid: 房产ID
        :type house.hid: 1
        :param house.buildArea: 建筑面积
        :type house.buildArea: Integer
        :param house.freeArea: 赠送面积
        :type house.freeArea: Integer
        :param house.innerArea: 套内面积
        :type house.innerArea: Integer
        :param house.totalArea: 总面积
        :type house.totalArea: Integer
        :param house.maxFloor: 最高楼层
        :type house.maxFloor: Short
        :param house.through: 是否越层
        :type house.through: Short
        :param house.roomNum: 房间数量
        :type house.roomNum: Integer
        :param house.houseType: 户型
        :type house.houseType: String
        :param house.orientation: 房屋朝向
        :type house.orientation: Short
        :param house.feature: 三不
        :type house.feature: String
        :param house.waterVapour: 水气设施
        :type house.waterVapour: Short
        :param house.parlourType: 客厅类型
        :type house.parlourType: Short
        :param house.heatingType: 供暖类型
        :type house.heatingType: Short
        
        Example::
        
            {
                "house.hid": 1,
                "house.buildArea": 88.6,
                "house.freeArea": 0,
                "house.innerArea": 0,
                "house.totalArea": 0,
                "house.maxFloor": 7,
                "house.through": 0,
                "house.roomNum": 2,
                "house.houseType": "1室1厅1卫1厨",
                "house.orientation": 0,
                "house.feature": "["临街", "把东山"]",
                "house.waterVapour": 0,
                "house.parlourType": 0,
                "house.heatingType": 0
            }
            
    .. method:: <C> updateHouseForStatus
    
        更新房产信息状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param house.hid: 房产ID
        :type house.hid: Long
        :param house.status: 状态
        :type house.status: 1
        
        Example::
        
            {
                "house.hid": 1
                "house.status": 1
            }
            
基础
================

常量
----------------

.. class:: api.communion.ConstantAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: constant
    
    :param cid: 常量ID
    :type cid: Long
    :param name: 名称
    :type name: String
    :param module: 模块
    :type module: String
    :param clazz: 对象
    :type clazz: String
    :param type: 类型
    :type type: String
    :param field: 字段名
    :type field: String
    :param key: 键
    :type key: String
    :param value: 值
    :type value: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <C> pageConstant
    
        分页方式获取常量信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 常量信息列表 , 每条数据类型 :data:`constant`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "name": "初始状态",
                            "module": "data",
                            "clazz": "goods",
                            "type": "status",
                            "field": "STATUS_INIT_INT",
                            "key": "0",
                            "value": "初始"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <C> queryConstant
    
        获取常量信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param constants: 常量信息列表 , 每条数据类型 :data:`constant`
        :type constants: List
        
        Example::
        
            {
                ...
                "constants": [
                    {
                        "cid": 1,
                        "name": "初始状态",
                        "module": "data",
                        "clazz": "goods",
                        "type": "status",
                        "field": "STATUS_INIT_INT",
                        "key": "0",
                        "value": "初始"
                    }
                ],
                ...
            }

    .. method:: <C> addConstant
    
    .. method:: <C> updateConstant
    
    .. method:: <C> updateConstantForStatus
    
    .. method:: <C> deleteConstant

工种
----------------

工种信息管理

.. class:: api.communion.WorkTypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: workType
    
    :param wtid: 工种ID
    :type wtid: Long
    :param name: 工种名称
    :type name: String
    
    .. method:: <I> queryWorkType
    
        获取所有工种信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param workTypes: 工种信息列表 , 每条数据类型 :data:`workType`
        :type workTypes: List
        
        Example::
        
            {
                ...
                "workTypes": [
                    {
                        "wtid": 1,
                        "name": "力"
                    }
                ],
                ...
            }

单位
----------------

单位信息管理

.. class:: api.communion.MeasurementUnitAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: measurementUnit
    
    :param muid: 单位ID
    :type muid: Long
    :param name: 单位名称
    :type name: String
    
    .. method:: <I> pageMeasurementUnit
        
        分页方式获取单位信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 单位信息列表 , 每条数据类型 :data:`measurementUnit`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "muid": 1,
                            "name": "个"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryMeasurementUnit
    
        获取所有单位信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param measurementUnits: 单位信息列表 , 每条数据类型 :data:`measurementUnit`
        :type measurementUnits: List
        
        Example::
        
            {
                ...
                "measurementUnits": [
                    {
                        "muid": 1,
                        "name": "米"
                    }
                ],
                ...
            }
            
    .. method:: <C> addMeasurementUnit
    
        添加单位信息
        
        判断单位名称是否存在,已经存在,错误信息 **130010 单位已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param measurementUnit.name: 名称
        :type measurementUnit.name: String
        
        Example::
        
            {
                "measurementUnit.name": '个'
            }
            
    .. method:: <C> updateMeasurementUnit
    
        编辑单位信息
        
        判断单位名称是否存在,不存在,错误信息 **130011 单位不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param measurementUnit.muid: 单位ID
        :type measurementUnit.muid: Long
        :param measurementUnit.name: 名称
        :type measurementUnit.name: String
        
        Example::
        
            {
                "measurementUnit.muid": 1,
                "measurementUnit.name": '个'
            }
            
职位
----------------

职位信息管理

.. class:: api.communion.DutyAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: duty
    
    :param did: 职位ID
    :type did: Long
    :param name: 名称
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param departmentType: 部门类型 , 类型 `departmentType <./department.html#api.department.DepartmentTypeAction.departmentType>`_
    :type departmentType: Object
    :param type: 类型 , 0: 产值 , 1: 非产值
    :type type: Short
    :param status: 状态 , 0(启用) , 1(禁用)
    :type status: Short
    :param lead: 领导标识 , 0: 标准 , 1: 领导
    :type lead: Short
    
    .. method:: <I> pageDuty
        
        分页方式获取职位信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 职位信息列表 , 每条数据类型 :data:`duty`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "did": 1,
                            "name": "设计师",
                            "departmentType": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "type": 0,
                            "status": 0,
                            "lead": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryDuty
    
        获取职位信息 , 职位状态为启用
        
        +--------+
        |Returns:|
        +--------+
        
        :param dutys: 职位列表 , 每条数据类型 :data:`duty`
        :type dutys: List
        
        Example::
        
            {
                ...
                "dutys": [
                    {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "type": 0,
                        "lead": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryDutyByName
    
        获取职位信息 , 通过拼音/名称作为条件匹配
        
        +---------+
        |Requests:|
        +---------+
        
        :param pinyinName: 拼音
        :type pinyinName: String
        :param duty.departmentType.dtid: 部门类型ID
        :type duty.departmentType.dtid: Long
        
        Example::
        
            {
                "pinyinName": "pinyin",
                "duty.departmentType.dtid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param dutys: 职位列表 , 每条数据类型 :data:`duty`
        :type dutys: List
        
        Example::
        
            {
                ...
                "dutys": [
                    {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "type": 0,
                        "lead": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryDutyByDtid
    
        通过部门类型ID获取职位信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param duty.departmentType.dtid: 部门类型ID
        :type duty.departmentType.dtid: Long
        
        Example::
        
            {
                "duty.departmentType.dtid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dutys: 职位列表 , 每条数据类型 :data:`duty`
        :type dutys: List
        
        Example::
        
            {
                ...
                "dutys": [
                    {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "type": 0,
                        "lead": 0
                    }
                ],
                ...
            }
            
    .. method:: <C> addDuty
    
        添加职位信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param duty.name: 名称
        :type duty.name: String
        :param duty.lead: 领导标识
        :type duty.lead: Short
        :param duty.departmentType.dtid: 部门类型ID
        :type duty.departmentType.dtid: Long
        :param duty.type: 类型
        :type duty.type: Short
        
        Example::
        
            {
                "duty.name": "设计师",
                "duty.lead": 0,
                "duty.departmentType.dtid": 1,
                "duty.type": 1
            }
            
    .. method:: <C> updateDuty
    
        更新职位信息
        
        职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param duty.did: 职位ID
        :type duty.did: Long
        :param duty.name: 名称
        :type duty.name: String
        :param duty.lead: 领导标识
        :type duty.lead: Short
        
        Example::
        
            {
                "duty.did": 1,
                "duty.name": "设计师",
                "duty.lead": 0,
                "duty.departmentType.dtid": 1,
                "duty.type": 1
            }
            
    .. method:: <C> updateDutyForStatus
    
        更新职位状态
        
        职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param duty.did: 职位ID
        :type duty.did: Long
        :param duty.status: 状态
        :type duty.status: Short
        :param duty.lead: 领导标识
        :type duty.lead: Short
        
        Example::
        
            {
                "duty.did": 1,
                "duty.status": 0
            }

楼号规则
----------------

楼号规则信息管理

.. class:: api.communion.BuildingNameRuleAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: buildingNameRule
    
    :param bnrid: 规则ID
    :type bnrid: Long
    :param no: 规则编号
    :type no: String
    :param rule: 楼号规则
    :type rule: String
    :param example: 规则样例
    :type example: String
    :param content: 规则说明
    :type content: String
    :param filling: 填充方式
    :type filling: String
    
    .. method:: <I> pageBuildingNameRule
        
        分页方式获取楼号规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 楼号规则信息列表 , 每条数据类型 :data:`buildingNameRule`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bnrid": 1,
                            "no": "BNR001",
                            "rule": "[0-9]{1,3}#[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}",
                            "content": "数字#1-1-1",
                            "example": "9#1",
                            "filling": "{0}#{1}-{2}-{3}"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryBuildingNameRule
    
        获取所有楼号规则信息
    
        +--------+
        |Returns:|
        +--------+
        
        :param buildingNameRules: 楼号规则列表 , 每条数据类型 :data:`buildingNameRule`
        :type buildingNameRules: List
        
        Example::
        
            {
                ...
                "buildingNameRules": [
                    {
                        "bnrid": 1,
                        "no": "BNR001",
                        "rule": "[0-9]{1,3}#[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}",
                        "content": "数字#1-1-1",
                        "example": "9#1",
                        "filling": "{0}#{1}-{2}-{3}"
                    }
                ],
                ...
            }
            
外链
----------------

外链页面信息管理

.. class:: api.data.ChainPageAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: chainPage
    
    :param cpid: ID
    :type cpid: Long
    :param name: 名称
    :type name: String
    :param url: 地址
    :type url: String
    :param companymark: 公司标识
    :type companymark: Short
    :param comment: 说明
    :type comment: String

    .. method:: <I> queryChainPage
    
        获取外链页面信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param chainPages: 外链信息列表 , 每条数据类型 :data:`chainPage`
        :type chainPages: List
        
        Example::
        
            {
                ...
                "chainPages": [
                    {
                        "cpid": 1,
                        "name": "页面",
                        "url": "http://api.com",
                        "companymark": 1,
                        "comment": "说明"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryChainPageForSelf
    
        获取当前登录用户拥有外链
        
        +---------+
        |Requests:|
        +---------+
        
        :param chainPage.name: 名称
        :type chainPage.name: String
        :param chainPage.url: 地址
        :type chainPage.url: String
        :param chainPage.comment: 说明
        :type chainPage.comment: String
        
        Example::
        
            {
                "chainPage.name": "页面",
                "chainPage.url": "http://api.com",
                "chainPage.companymark": 1,
                "chainPage.comment": "说明"
            }
            
    .. method:: <I> addChainPage
    
        添加外链信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param chainPage.name: 名称
        :type chainPage.name: String
        :param chainPage.url: 地址
        :type chainPage.url: String
        :param chainPage.companymark: 公司标识
        :type chainPage.companymark: Short
        :param chainPage.comment: 说明
        :type chainPage.comment: String
        
        Example::
        
            {
                "chainPage.name": "页面",
                "chainPage.url": "http://api.com",
                "chainPage.companymark": 1,
                "chainPage.comment": "说明"
            }
            
    .. method:: <I> deleteChainPage
    
        删除外链信息
        
        外链已经被使用 , 删除失败 , 错误信息 **130013 外链已使用**
        
        +---------+
        |Requests:|
        +---------+
        
        :param chainPage.cpid: ID
        :type chainPage.cpid: Long
         
        Example::
        
            {
                "chainPage.cpid": 1
            }

服务节点
----------------

.. class:: api.communion.ServiceNodeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: serviceNode
    
    :param snid: 服务节点ID
    :type snid: Long
    :param psnid: 上级节点ID
    :type psnid: Long
    :param name: 名称
    :type name: String
    :param detail: 详述
    :type detail: String
    :param type: 类型 , 0: 装修 , 1: 主材 , 2: 工程
    :type type: Short
    :param attnode: 业务节点 , 0: 创建 , 1: 预签 , 2: 签单 , 3: 付款
    :type attnode: Short
    :param blankNum: 间隔天数
    :type blankNum: Integer
    :param workNum: 工期天数
    :type workNum: Integer
    :param loop: 是否循环
    :type loop: Short
    :param userType: 人员类型 , 0: 员工 , 1: 经历 , 2: 总监
    :type userType: Short
    :param userDuty: 人员职位
    :type userDuty: Long
    :param status: 状态 , 0(启用) , 1(禁用)
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageServiceNode
        
        分页方式获取服务节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 服务节点信息列表 , 每条数据类型 :data:`serviceNode`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "snid": 1,
                            "name": "报价",
                            "detail": "报价详述",
                            "type": 0,
                            "status": 0,
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <C> addServiceNode
    
        添加服务节点信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param serviceNode.name: 名称
        :type serviceNode.name: String
        :param serviceNode.detail: 详述
        :type serviceNode.detail: String
        :param serviceNode.type: 类型
        :type serviceNode.type: Short
        
        Example::
        
            {
                "serviceNode.name": "报价",
                "serviceNode.detail": "报价详述",
                "serviceNode.type": 0
            }
            
    .. method:: <C> updateServiceNode
    
        更新服务节点信息
        
        服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param serviceNode.snid: 服务节点ID
        :type serviceNode.snid: Long
        :param serviceNode.name: 名称
        :type serviceNode.name: String
        :param serviceNode.detail: 详述
        :type serviceNode.detail: String
        :param serviceNode.type: 领导标识
        :type serviceNode.type: Short
        
        Example::
        
            {
                "serviceNode.snid": 1,
                "serviceNode.name": "报价",
                "serviceNode.detail": "报价详述",
                "serviceNode.type": 1
            }
            
    .. method:: <C> updateServiceNodeForStatus
    
        更新服务节点状态
        
        服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param serviceNode.snid: 职位ID
        :type serviceNode.snid: Long
        :param serviceNode.status: 状态
        :type serviceNode.status: Short
        
        Example::
        
            {
                "serviceNode.snid": 1,
                "serviceNode.status": 0
            }
            
图表
----------------

.. class:: api.communion.ChartAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: chart
    
    :param cid: 图表ID
    :type cid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param type: 类型 , 1: 装修 , 2: 销售 , 3: 工程 , 4: 款项
    :type type: Short
    :param level: 等级 , 0: 集团 , 1: 公司 , 2: 大区 , 3: 部门
    :type level: Short
    :param api: 接口
    :type api: String
    :param method: 方法
    :type method: String
    :param param: 参数
    :type param: String
    :param style: 样式
    :type style: String
    :param clazz: 类型
    :type clazz: String
    :param sort: 排序
    :type sort: Integer
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> pageChart
    
        分页方式获取图表信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 图表信息列表 , 每条数据类型 :data:`chart`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "no": "ASDFEFSD",
                            "name": "图表",
                            "type": 1,
                            "level": 0,
                            "api": "api.chart",
                            "method": "chart",
                            "param": "{\"param\": \"args\"}",
                            "style": "",
                            "clazz": "",
                            "sort": 1,
                            "comment": "描述"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryChart
    
        获取图表信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param chart.type: 类型
        :type chart.type: Short
        :param chart.level: 等级
        :type chart.level: Short
        
        Example::
        
            {
                "chart.type": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param charts: 图表信息列表 , 每条数据类型 :data:`chart`
        :type charts: List
        
        Example::
        
            {
                "charts": [
                    {
                        "cid": 1,
                        "no": "ASDFEFSD",
                        "name": "图表",
                        "type": 1,
                        "level": 0,
                        "api": "api.chart",
                        "method": "chart",
                        "param": "{\"param\": \"args\"}",
                        "style": "",
                        "clazz": "",
                        "sort": 1,
                        "comment": "描述"
                    }
                ]
            }
            
    .. method:: <I> queryChartForLogin
    
        获取当前用户所属角色拥有的图表信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param charts: 图表信息列表 , 每条数据类型 :data:`chart`
        :type charts: List
        
        Example::
        
            {
                ...
                "charts": [
                    {
                        "cid": 1,
                        "no": "ASDFEFSD",
                        "name": "图表",
                        "type": 1,
                        "level": 0,
                        "api": "api.chart",
                        "method": "chart",
                        "param": "{\"param\": \"args\"}",
                        "style": "",
                        "clazz": "",
                        "sort": 1,
                        "comment": "描述"
                    }
                ],
                ...
            }

    .. method:: <I> queryChartByRid
    
        通过角色ID获取图表信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param role.rid: 角色ID
        :type role.rid: Long
        
        Example::
        
            {
                "role.rid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param charts: 图表信息列表 , 每条数据类型 :data:`chart`
        :type charts: List
        
        Example::
        
            {
                ...
                "charts": [
                    {
                        "cid": 1,
                        "no": "ASDFEFSD",
                        "name": "图表",
                        "type": 1,
                        "level": 0,
                        "api": "api.chart",
                        "method": "chart",
                        "param": "{\"param\": \"args\"}",
                        "style": "",
                        "clazz": "",
                        "sort": 1,
                        "comment": "描述"
                    }
                ],
                ...
            }
            
    .. method:: <C> updateRoleChartByRid
    
        通过角色ID更新角色拥有图表信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
        判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**
        
        +---------+
        |Requests:|
        +---------+
        
        :param cids[n]: 图表ID列表 , 每条数据类型 Long
        :type cids[n]: List
        :param role.rid: 角色编号
        :type role.rid: String
        
        Example::
        
            {
                "role.rid": 1,
                "cids[0]": 1,
            }

标签
----------------

.. class:: api.data.LabelAction

    +---------+
    |DataType:|
    +---------+

    .. data:: label
    
    :param lid: 标签ID
    :type lid: Long
    :param name: 名称
    :type name: String
    :param scale: 比例 , 范围: 1-100
    :type scale: Short
    :param type: 类型 , 0: 风格, 1: 面积, 2: 楼盘, 3: 年龄
    :type type: Short
    :param isShow: 是否显示 , 0: 显示 , 1: 不显示
    :type isShow: Short
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short

    .. method:: <I> pageLabel
    
        分页方式获取标签消息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 标签信息列表 , 每条数据类型 :data:`label`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "lid": 1,
                            "name": "中式",
                            "scale": 15,
                            "type": 0,
                            "isShow": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryLabel
    
        获取标签信息 , 状态0(启用)
        
        +--------+
        |Returns:|
        +--------+
        
        :param labels: 标签信息列表 , 每条数据类型 :data:`label`
        :type labels: List
        
        Example::
        
            {
                ...
                "labels": [
                    {
                        "lid": 1,
                        "name": "中式",
                        "scale": 15,
                        "type": 0,
                    }
                ],
                ...
            }
            
    .. method:: <I> addLabel
    
        添加标签
        
        +---------+
        |Requests:|
        +---------+
        
        :param label.name: 名称
        :type label.name: String
        :param label.scale: 比例
        :type label.scale: Short
        :param label.type: 类型
        :type label.type: Short
        
        Example::
        
            {
                "label.name": "中式",
                "label.scale": 15,
                "label.type": 0
            }
            
    .. method:: <I> updateLabel
    
        更新标签
        
        判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param label.lid: 标签ID
        :type label.lid: Long
        :param label.name: 名称
        :type label.name: String
        :param label.scale: 比例
        :type label.scale: Short
        :param label.type: 类型
        :type label.type: Short
        
        Example::
        
            {
                "label.lid": 1,
                "label.name": "中式",
                "label.scale": 15,
                "label.type": 0
            }
            
    .. method:: <I> updateLabelForStatus
    
        更新标签状态
        
        判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param label.lid: 标签ID
        :type label.lid: Long
        :param label.status: 状态
        :type label.status: Short

        Example::
        
            {
                "label.lid": 1,
                "label.status": 1
            }

流程
----------------

.. class:: api.data.FlowpathAction

    +---------+
    |DataType:|
    +---------+

    .. data:: flowpath
    
    :param fpid: 流程ID
    :type fpid: Long
    :param name: 名称
    :type name: String
    :param no: 编号
    :type no: String
    :param keyword: 关键字
    :type keyword: String
    :param type: 类型
    :type type: Short
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    
    .. method:: <I> pageFlowpath
    
        分页方式获取流程信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 流程信息列表 , 每条数据类型 :data:`flowpath`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "fpid": 1,
                            "name": "流程信息",
                            "no": "FP0001",
                            "keyword": "FlowInfo",
                            "type": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryFlowpath
    
        获取流程信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowpath.fpid: 流程ID
        :type flowpath.fpid: Long
        :param flowpath.keyword: 关键字
        :type flowpath.keyword: String
        
        Example::
        
            {
                "flowpath.fpid": 1,
                "flowpath.keyword": "",
            }

        +--------+
        |Returns:|
        +--------+
        
        :param flowpaths: 流程信息列表 , 每条数据类型 :data:`flowpath`
        :type flowpaths: List
        
        Example::
        
            {
                ...
                "flowpaths": [
                    {
                        "fpid": 1,
                        "name": "流程信息",
                        "no": "FP0001",
                        "keyword": "FlowInfo",
                        "type": 0
                    }
                ]
                ...
            }
    
    .. method:: <I> addFlowpath
    
        创建流程
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowpath.name: 名称
        :type flowpath.name: Long
        :param flowpath.no: 编号
        :type flowpath.no: String
        :param flowpath.keyword: 关键字
        :type flowpath.keyword: Long
        :param flowpath.type: 类型
        :type flowpath.type: Short
        
        Example::
        
            {
                "flowpath.name": "流程信息",
                "flowpath.no": "FP0001",
                "flowpath.keyword": "FlowInfo",
                "flowpath.type": 0
            }
    
    .. method:: <I> updateFlowpath
    
        更新流程
        
        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowpath.fpid: 流程ID
        :type flowpath.fpid: Long
        :param flowpath.name: 名称
        :type flowpath.name: Long
        :param flowpath.no: 编号
        :type flowpath.no: String
        :param flowpath.keyword: 关键字
        :type flowpath.keyword: Long
        :param flowpath.type: 类型
        :type flowpath.type: Short
        
        Example::
        
            {
                "flowpath.fpid": 1,
                "flowpath.name": "流程信息",
                "flowpath.no": "FP0001",
                "flowpath.keyword": "FlowInfo",
                "flowpath.type": 0
            }
    
    .. method:: <I> deleteFlowpath
    
        删除流程
        
        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowpath.fpid: 流程ID
        :type flowpath.fpid: Long
        
        Example::
        
            {
                "flowpath.fpid": 1
            }

.. class:: api.data.FlowitemAction
    
    .. data:: flowitem
    
    :param fiid: 节点ID
    :type fiid: Long
    :param fpid: 流程ID
    :type fpid: Long
    :param name: 名称
    :type name: String
    :param content: 内容
    :type content: String
    :param type: 类型
    :type type: Short
    :param x: x坐标
    :type x: Integer
    :param y: y坐标
    :type y: Integer
    :param pfiid: 上级节点ID
    :type pfiid: Long
    :param nfiid: 下级节点ID
    :type nfiid: Long
    
    .. method:: <I> queryFlowitem
    
        获取流程节点
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowitem.fpid: 流程ID
        :type flowitem.fpid: Long
        
        Example::
        
            {
                "flowitem.fpid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param flowitems: 流程节点信息列表 , 每条数据类型 :data:`flowitem`
        :type flowitems: List
        
        Example::
        
            {
                ...
                "flowitems": [
                    {
                        "fiid": 1,
                        "fpid": 1,
                        "name": "流程节点",
                        "content": "",
                        "type": 0,
                        "x": 0,
                        "y": 0,
                        "pfiid": 0,
                        "nfiid": 0
                    }
                ]
                ...
            }
    
    .. method:: <I> addFlowitem
    
        添加流程节点
        
        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowpath.fpid: 流程ID
        :type flowpath.fpid: Long
        
        :param flowitems[n].name: 名称
        :type flowitems[n].name: Long
        :param flowitems[n].content: 内容
        :type flowitems[n].content: String
        :param flowitems[n].type: 类型
        :type flowitems[n].type: Short
        :param flowitems[n].x: x坐标
        :type flowitems[n].x: Integer
        :param flowitems[n].y: y坐标
        :type flowitems[n].y: Integer
        :param flowitems[n].pfiid: 上级节点ID
        :type flowitems[n].pfiid: Long
        :param flowitems[n].nfiid: 下级节点ID
        :type flowitems[n].nfiid: Long
        
        Example::
        
            {
                "flowitems[0].fpid": 1,
                "flowitems[0].name": "流程信息",
                "flowitems[0].content": "",
                "flowitems[0].type": 0,
                "flowitems[0].x": 0,
                "flowitems[0].y": 0,
                "flowitems[0].pfiid": 0,
                "flowitems[0].nfiid": 0,
            }
    
    .. method:: <I> deleteFlowItem
    
        删除流程节点
        
        +---------+
        |Requests:|
        +---------+
        
        :param flowitem.fpid: 流程ID
        :type flowitem.fpid: Long
        
        Example::
        
            {
                "flowitem.fpid": 1
            }

帮助
----------------

.. class:: api.data.AssistanceAction

    +---------+
    |DataType:|
    +---------+

    .. data:: assistance
    
    :param aid: 帮助ID
    :type aid: Long
    :param name: 名称
    :type name: String
    :param keyword: 关键字
    :type keyword: String
    :param atttype: 业务类型
    :type atttype: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    
    .. data:: assistanceItem
    
    :param aiid: 项目ID
    :type aiid: Long
    :param aid: 帮助ID
    :type aid: Long
    :param title: 标题
    :type title: String
    :param content: 说明
    :type content: String
    :param sort: 排序
    :type sort: Integer
    
    :param drawings: 图片
    :type drawings: List
    
    .. method:: <I> pageAssistance
    
        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 帮助信息列表 , 每条数据类型 :data:`assistance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "name": "李",
                            "keyword": "",
                            "atttype": "D-01-4",
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": "2016-01-01 00:00:00"
                            
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <C> queryAssistance
    
    .. method:: <C> queryAssistanceByAid
    
    .. method:: <C> queryAssistanceByKeyword
    
    .. method:: <C> addAssistance
    
    .. method:: <C> updateAssistance
    
    .. method:: <C> updateAssistanceForStatus
    
    .. method:: <C> queryAssistanceItem
    
    .. method:: <C> addAssistanceItem
    
    .. method:: <C> updateAssistanceItem
    
客户
================

投诉原因
----------------

.. class:: api.customer.ComplasonAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: complason
    
    :param csid: 投诉理由ID
    :type csid: Long
    :param type: 类型 , 0: 设计 , 1: 业务 , 2: 工程 , 3: 销售
    :type type: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param content: 内容
    :type content: String
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageComplason
    
        分页方式获取投诉原因信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 投诉原因信息列表 , 每条数据类型 :data:`complason`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "csid": 1,
                            "type": 1,
                            "status": 0,
                            "content": "内容"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryComplason
    
        通过类型查询投诉原因
        
        +---------+
        |Requests:|
        +---------+
        
        :param complason.type: 类型
        :type complason.type: Short
        
        Example::
        
            {
                "complason.type": 1
            }
    
    .. method:: <I> addComplason
    
        添加投诉原因信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param complason.type: 类型
        :type complason.type: Short
        :param complason.content: 类型
        :type complason.content: Short
        
        Example::
        
            {
                "complason.type": 1,
                "complason.content": "内容"
            }
    
    .. method:: <I> updateComplasonForStatus
    
        更新投诉原因状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param complason.csid: 原因ID
        :type complason.csid: Long
        :param complason.status: 类型
        :type complason.status: Short
        
        Example::
        
            {
                "complason.csid": 1,
                "complason.status": 0
            }

调研模版
----------------

.. class:: api.data.SurveyTemplateAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: surveyTemplate
    
    :param stid: 模版ID
    :type stid: Long
    :param name: 名称
    :type name: String
    :param isSend: 推送标识 , 0: 手动 , 1: 自动
    :type isSend: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    :param items: 项目列表 , 每条数据类型 `surveyTemplateItem <./data.html#api.data.SurveyTemplateAction.surveyTemplateItem>`__
    :type items: List
    
    .. data:: surveyTemplateItem
    
    :param stiid: 项目ID
    :type stiid: Long
    :param stid: 模版ID
    :type stid: Long
    :param name: 名称
    :type name: String
    :param type: 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选
    :type type: Short
    :param content: 内容
    :type content: String
    
    :param options: 选项列表 , 每条数据类型 `surveyTemplateItem <./data.html#api.data.SurveyTemplateAction.surveyTemplateItem>`__
    :type options: List
    
    .. data:: surveyTemplateOption
    
    :param stoid: 选项ID
    :type stoid: Long
    :param stiid: 项目ID
    :type stiid: Long
    :param stid: 模版ID
    :type stid: Long
    :param title: 标题
    :type title: String

    .. method:: <I> pageSurveyTemplate
    
        分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 调研模版列表 , 每条数据类型 :data:`surveyTemplate`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "stid": 1,
                            "name": "模版",
                            "isSend": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> querySurveyTemplate
    
        获取调研模版
        
        +--------+
        |Returns:|
        +--------+
        
        :param surveyTemplates: 调研模版列表 , 每条数据类型类型 :data:`surveyTemplate`
        :type surveyTemplates: List
        
        Example::
        
            {
                ...
                "surveyTemplates": [
                    {
                        "stid": 1,
                        "name": "模版",
                        "isSend": 0,
                        "status": 0,
                    }
                ],
                ...
            }

    .. method:: <I> querySurveyTemplateByStid
    
        获取调研模版
        
        +---------+
        |Requests:|
        +---------+
        
        :param surveyTemplate.stid: 模版ID
        :type surveyTemplate.stid: Long
        
        Example::
        
            {
                "surveyTemplate.stid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param surveyTemplate: 调研模版 , 数据类型 :data:`surveyTemplate`
        :type surveyTemplate: Object
        
        Example::
        
            {
                ...
                "surveyTemplate": {
                    "stid": 1,
                    "name": "模版",
                    "isSend": 0,
                    "status": 0,
                    "items": [
                        {
                            "stiid": 1,
                            "stid": 1,
                            "name": "项目",
                            "type": 0,
                            "content": "内容",
                        },
                        {
                            "stiid": 1,
                            "stid": 1,
                            "name": "项目",
                            "type": 2,
                            "content": "内容",
                            "options": [
                                {
                                    "stoid": 1,
                                    "stiid": 1,
                                    "stid": 1,
                                    "title": "选项"
                                }
                            ]
                        }
                    ]
                },
                ...
            }
    
    .. method:: <I> addSurveyTemplate
    
        创建调研模版
        
        +---------+
        |Requests:|
        +---------+
        
        :param surveyTemplate.name: 名称
        :type surveyTemplate.name: String
        :param surveyTemplate.isSend: 推送标识
        :type surveyTemplate.isSend: Short
        
        :param surveyTemplate.items[n].name: 名称
        :type surveyTemplate.items[n].name: String
        :param surveyTemplate.items[n].type: 类型
        :type surveyTemplate.items[n].type: Short
        :param surveyTemplate.items[n].content: 内容
        :type surveyTemplate.items[n].content: String
        
        :param surveyTemplate.items[n].options[n].title: 标题
        :type surveyTemplate.items[n].options[n].title: String
        
        
        Example::
        
            {
                "surveyTemplate.name": "模版",
                "surveyTemplate.isSend": 0,
                
                "surveyTemplate.items[0].name": "项目",
                "surveyTemplate.items[0].type": 0,
                "surveyTemplate.items[0].content": "内容",
                
                "surveyTemplate.items[0].options[0].title": "标题"
            }
    
    .. method:: <I> updateSurveyTemplate
    
        更新调研模版
        
        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param surveyTemplate.stid: 模版ID
        :type surveyTemplate.stid: Long
        :param surveyTemplate.name: 名称
        :type surveyTemplate.name: String
        
        :param surveyTemplate.items[n].name: 名称
        :type surveyTemplate.items[n].name: String
        :param surveyTemplate.items[n].type: 类型
        :type surveyTemplate.items[n].type: Short
        :param surveyTemplate.items[n].content: 内容
        :type surveyTemplate.items[n].content: String
        
        :param surveyTemplate.items[n].options[n].title: 标题
        :type surveyTemplate.items[n].options[n].title: String
        
        Example::
        
            {
                "surveyTemplate.stid": 1,
                "surveyTemplate.name": "模版",
                
                "surveyTemplate.items[0].name": "项目",
                "surveyTemplate.items[0].type": 0,
                "surveyTemplate.items[0].content": "内容",
                
                "surveyTemplate.items[0].options[0].title": "标题"
            }

    .. method:: <I> updateSurveyTemplateForStatus
    
        更新调研模版状态
        
        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param surveyTemplate.stid: 模版ID
        :type surveyTemplate.stid: Long
        :param surveyTemplate.isSend: 推送标识
        :type surveyTemplate.isSend: Short
        :param surveyTemplate.status: 状态
        :type surveyTemplate.status: Short
        
        Example::
        
            {
                "surveyTemplate.stid": 1,
                "surveyTemplate.isSend": 0,
                "surveyTemplate.status": 0
            }
    
    .. method:: <I> deleteSurveyTemplate
    
        删除调研模版
        
        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param surveyTemplate.stid: 模版ID
        :type surveyTemplate.stid: Long
        
        Example::
        
            {
                "surveyTemplate.stid": 1
            }

话术
----------------

.. class:: api.data.ChatingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: chating
    
    :param cid: 话术ID
    :type cid: Long
    :param title: 标题
    :type title: String
    :param content: 内容
    :type content: String
    :param type: 类型 , 0: 文本, 2: 应用
    :type type: Short
    :param atttype: 业务类型 , 0: 客户, 1: 装修, 2: 主材, 3: 工程, 4: 款项, 5: 其他
    :type atttype: Short
    :param path: 路径
    :type path: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageChating
    
        分页方式获取话术信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 话术列表 , 每条数据类型 :data:`chating`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "title": "标题",
                            "content": "内容",
                            "type": 0,
                            "atttype": 0,
                            "path": "",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryChating
    
        获取话术信息
        
        +--------+
        |Returns:|
        +--------+

        :param chatings: 话术列表 , 每条数据类型 :data:`chating`
        :type chatings: List
        
        Example::
        
            {
                ...
                "chatings": [
                    {
                        "cid": 1,
                        "title": "标题",
                        "content": "内容",
                        "type": 0,
                        "atttype": 0,
                        "path": "",
                        "status": 0
                    }
                ],
                ...
            }
    
    .. method:: <I> addChating
    
        添加话术
        
        +---------+
        |Requests:|
        +---------+
        
        :param chating.title: 标题
        :type chating.title: String
        :param chating.content: 内容
        :type chating.content: String
        :param chating.type: 类型
        :type chating.type: Short
        :param chating.atttype: 业务类型
        :type chating.atttype: Short
        :param chating.path: 路径
        :type chating.path: String
        
        Example::
        
            {
                "chating.title": "标题",
                "chating.content": "内容",
                "chating.type": 0,
                "chating.atttype": 0,
                "chating.path": ""
            }
    
    .. method:: <I> updateChating
    
        更新话术
        
        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param chating.cid: 话术ID
        :type chating.cid: Long
        :param chating.title: 标题
        :type chating.title: String
        :param chating.content: 内容
        :type chating.content: String
        :param chating.type: 类型
        :type chating.type: Short
        :param chating.atttype: 业务类型
        :type chating.atttype: Short
        :param chating.path: 路径
        :type chating.path: String
        
        Example::
        
            {
                "chating.cid": 1,
                "chating.title": "标题",
                "chating.content": "内容",
                "chating.type": 0,
                "chating.atttype": 0,
                "chating.path": ""
            }

    .. method:: <I> updateChatingForStatus
    
        更新话术状态
        
        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param chating.cid: 话术ID
        :type chating.cid: Long
        :param chating.status: 状态
        :type chating.status: String
        
        Example::
        
            {
                "chating.cid": 1,
                "chating.status": 0
            }
    
    .. method:: <I> deleteChating
    
        删除话术
        
        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param chating.cid: 话术ID
        :type chating.cid: Long
        
        Example::
        
            {
                "chating.cid": 1
            }
            
装修
================

业务类型
----------------

.. class:: api.data.DecorationBusitype

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationBusitype
    
    :param dbid: 类型ID
    :type dbid: Long
    :param name: 名称
    :type name: String
    :param outside: 三方 , 0: 内部 , 1: 三方
    :type outside: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageDecorationBusitype
    
        分页方式获取业务类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 客户信息列表 , 每条数据类型 :data:`decorationBusitype`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "dbid": 1,
                            "name": "名称",
                            "outside": 0,
                            "status": 1
                            
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryDecorationBusitype
    
        获取业务类型信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param decorationBusitypes: 业务类型信息 , 类型 :data:`decorationBusitype`
        :type decorationBusitypes: object
        
        Example::
        
            {
                ...
                "decorationBusitypes": [{
                    "dbid": 1,
                    "name": "李",
                    "outside": 0,
                    "status": 0
                }],
                ...
            }
    
    .. method:: <I> addDecorationBusitype
    
        添加业务类型
        
        +---------+
        |Requests:|
        +---------+
        
        :param decorationBusitype.name: 名称
        :type decorationBusitype.name: String
        :param decorationBusitype.outside: 三方
        :type decorationBusitype.outside: Short
        
        Example::
        
            {
                "decorationBusitype.name": "业务类型",
                "decorationBusitype.outside": 0
            }
            
    .. method:: <I> updateDecorationBusitype
    
        更新业务类型
        
        判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param decorationBusitype.dbid: 业务类型ID
        :type decorationBusitype.dbid: Long
        :param decorationBusitype.name: 名称
        :type decorationBusitype.name: String
        :param decorationBusitype.outside: 三方
        :type decorationBusitype.outside: Short
        
        Example::
        
            {
                "decorationBusitype.dbid": 1,
                "decorationBusitype.name": "业务类型",
                "decorationBusitype.outside": 0
            }
    
    .. method:: <I> updateDecorationBusitypeForStatus
    
        更新业务类型状态
        
        判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param decorationBusitype.dbid: 业务类型ID
        :type decorationBusitype.dbid: Long
        :param decorationBusitype.status: 状态
        :type decorationBusitype.status: Short
        :param decorationBusitype.outside: 三方
        :type decorationBusitype.outside: Short
        
        Example::
        
            {
                "decorationBusitype.dbid": 1,
                "decorationBusitype.status": 1,
                "decorationBusitype.outside": 0
            }

装修业务
----------------

.. class:: api.data.DecorationAtttype

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationAtttype
    
    :param daid: 业务ID
    :type daid: Long
    :param name: 名称
    :type name: String
    :param key: 键值
    :type key: Long
    :param type: 类型 , 0: 半包, 1: 整装, 2: 满减
    :type type: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageDecorationAtttype
    
        分页方式获取装修业务信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 装修业务信息列表 , 每条数据类型 :data:`decorationAtttype`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "daid": 1,
                            "name": "半包",
                            "key": 1,
                            "type": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryDecorationAtttype
    
        获取装修业务信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param decorationAtttypes: 装修业务类型信息 , 类型 :data:`decorationAtttype`
        :type decorationAtttypes: object
        
        Example::
        
            {
                ...
                "decorationAtttypes": [
                    {
                        "daid": 1,
                        "name": "半包",
                        "key": 1,
                        "type": 0,
                        "status": 0
                    }
                ],
                ...
            }

装修配比
----------------

.. class:: api.data.DecorationMatchingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationMatching
    
    :param dmid: 配比ID
    :type dmid: Long
    :param name: 名称
    :type name: String
    :param type: 类型 , 对应装修单中的type
    :type type: Short
    :param base: 基数
    :type base: Integer
    :param discount: 折扣
    :type discount: Integer
    :param discountType: 折扣方式 , 0: 固定 , 1: 可改 , 2: 最低
    :type discountType: Short
    :param material: 主材配比
    :type material: Integer
    :param service: 服务配比
    :type service: Integer
    :param vision: 显示 , 1: 报价折扣 , 2: 报价计算 , 4: 生成款项 , 8: 决算计算
    :type vision: Short
    :param isShow: 默认显示 0: 显示 , 1: 隐藏
    :type isShow: Short
    :param trafficDiscount: 车运费折扣 , 0: 不打折 , 1: 打折
    :type trafficDiscount: Short
    :param manageDiscount: 管理费折扣 , 0: 不打折 , 1: 打折
    :type manageDiscount: Short
    :param taxDiscount: 税金折扣 , 0: 管理税金 , 1: 总额税金
    :type taxDiscount: Short
    :param comment: 说明
    :type comment: String
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageDecorationMatching
    
    .. method:: <I> queryDecorationMatching
    
    .. method:: <I> addDecorationMatching
    
    .. method:: <I> updateDecorationMatching

量尺规则
----------------

.. class:: api.data.DecorationMeasure

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationMeasure
    
    :param dmid: 规则ID
    :type dmid: Long
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. data:: decorationMeasureItem
    
    :param dmiid: 项目ID
    :type dmiid: Long
    :param dmid: 规则ID
    :type dmid: Long
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> queryDecorationMeasure

款项
================

款项类型
----------------

收据类型信息管理

.. class:: api.data.PaymentTypeAction

    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | type             | paytype                  | bustype                          | atttype                          | name                             | index            |
    +==================+==========================+==================================+==================================+==================================+==================+
    | 0 预付款         | 0 收款                   | 0 合同                           | 0 预付                           | 装修预付款                       |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 0 预付款         | 1 提现                   | 1 主材                           | 0 预付                           | 主材预付款                       |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    |                  |                          |                                  |                                  |                                  |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 0 收款                   | 0 装修                           | 0 基础                           | 设计费                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 0 收款                   | 0 装修                           | 1 合同                           | 首付款                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 0 收款                   | 0 装修                           | 2 增减                           | 增项款                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 1 退款                   | 0 装修                           | 2 增减                           | 减项款                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 0 收款                   | 1 主材                           | 4 终止                           | 违约金                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 1 装修款         | 0 收款                   | 1 装修                           | 3 其他                           | 手续费                           |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    |                  |                          |                                  |                                  |                                  |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 2 主材款         | 0 收款                   | 1 主材                           | 0 基础                           | 定金                             | 2                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 2 主材款         | 0 收款                   | 1 主材                           | 0 基础                           | 补款                             | 3                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    |                  |                          |                                  |                                  |                                  |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 0 收款                   | 1 主材                           | 0 基础                           | 定金                             | 2                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 0 收款                   | 1 主材                           | 0 基础                           | 补款                             | 3                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 1 退款                   | 1 主材                           | 1 退款                           | 退款                             | 4                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 1 退款                   | 1 主材                           | 1 退款                           | 补款退款                         | 5                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 1 退款                   | 1 主材                           | 1 退款                           | 券退款                           | 6                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 1 退款                   | 1 主材                           | 1 退款                           | 定金退款                         | 7                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 3 销售款         | 0 收款                   | 1 主材                           | 2 其他                           | 不退定金                         | 8                |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    |                  |                          |                                  |                                  |                                  |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    | 4 服务款         |                          |                                  |                                  |                                  |                  |
    +------------------+--------------------------+----------------------------------+----------------------------------+----------------------------------+------------------+
    

    +---------+
    |DataType:|
    +---------+
    
    .. data:: paymentType
    
    :param ptid: 款项类型ID
    :type ptid: Long
    :param name: 名称
    :type name: String
    :param type: 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款
    :type type: Short
    :param paytype: 付款类型 , 0: 收款 , 1: 出款
    :type paytype: Short
    
    :param bustype: 业务类型 , 0: 装修 , 1: 主材
    :type bustype: Short
    :param atttype: 属性类型 , 装修: 0(基础) , 1(合同) , 2(增减) , 3(其他)
    :type atttype: Short
    
    :param payScale: 付款比例
    :type payScale: Integer
    :param saleScale: 销售比例
    :type saleScale: Integer
    :param index: 索引
    :type index: Integer
    
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    :param kibalance: 结算方式
    :type kibalance: String
    
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pagePaymentType
    
        分页方式获取款项类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 收据类型信息列表 , 每条数据类型 :data:`paymentType`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ptid": 1,
                            "name": "首付款",
                            "type": 1,
                            "paytype": 0,
                            "bustype": 0,
                            "atttype": 1,
                            "payScale": 0,
                            "salesScale": 0,
                            "index": 1,
                            "kino": "1010001001"
                            "kiname": "现金",
                            "kibalance": "JSU2J3-SYS",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryPaymentType
    
        查询款项类型
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentType.type: 类型
        :type paymentType.type: Short
        :param paymentType.paytype: 付款类型
        :type paymentType.paytype: Short
        :param paymentType.bustype: 业务类型
        :type paymentType.bustype: Short
        :param paymentType.atttype: 属性类型
        :type paymentType.atttype: Short
        
        Example::
        
            {
                "paymentType.type": 1,
                "paymentType.paytype": 1,
                "paymentType.bustype": 1,
                "paymentType.atttype": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param paymentTypes: 款项类型信息列表 , 每条信息类型 :data:`paymentType`
        :type paymentTypes: List
        
        Example::
        
            {
                ...
                "paymentTypes": [
                    {
                        "ptid": 1,
                        "name": "首付款",
                        "type": 1,
                        "paytype": 0,
                        "bustype": 0,
                        "atttype": 1,
                        "payScale": 0,
                        "salesScale": 0,
                        "index": 1,
                        "kino": "1010001001"
                        "kiname": "现金",
                        "kibalance": "JSU2J3-SYS",
                        "status": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryPaymentTypeByName

    .. method:: <C> queryPaymentTypeByPtid
    
        通过ID查询款项类型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentType.ptid: 款项类型ID
        :type paymentType.ptid: Long
        
        Example::
        
            {
                "paymentType.ptid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param paymentType: 款项类型 , 类型 :data:`paymentType`
        :type paymentType: Object
        
        Example::
        
            {
                ...
                "paymentType": {
                    "ptid": 1,
                    "name": "首付款",
                    "type": 1,
                    "paytype": 0,
                    "bustype": 0,
                    "atttype": 1,
                    "payScale": 0,
                    "salesScale": 0,
                    "index": 1,
                    "kino": "1010001001"
                    "kiname": "现金",
                    "kibalance": "JSU2J3-SYS",
                    "status": 0
                }
                ...
            }

    .. method:: <C> addPaymentType

        添加款项类型
        
        判断款项类型名称是否存在有效数据 , 已存在 , 错误信息 **130093 款项类型已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentType.name: 名称
        :type paymentType.name: String
        :param paymentType.type: 类型
        :type paymentType.type: Short
        :param paymentType.paytype: 付款类型
        :type paymentType.paytype: Short
        :param paymentType.bustype: 业务类型
        :type paymentType.bustype: Short
        :param paymentType.atttype: 属性类型
        :type paymentType.atttype: Short
        :param paymentType.payScale: 付款比例
        :type paymentType.payScale: Integer
        :param paymentType.salesScale: 索引
        :type paymentType.salesScale: Integer
        :param paymentType.index: 索引
        :type paymentType.index: Integer
        :param paymentType.kino: 金蝶编号
        :type paymentType.kino: String
        :param paymentType.kiname: 金蝶名称
        :type paymentType.kiname: String
        :param paymentType.kibalance: 金蝶结算
        :type paymentType.kibalance: String
        
        Example::
        
            {
                "paymentType.name": "首付款",
                "paymentType.type": 1,
                "paymentType.paytype": 1,
                "paymentType.bustype": 1,
                "paymentType.atttype": 1,
                "paymentType.payScale": 0,
                "paymentType.salesScale": 0,
                "paymentType.index": 1,
                "paymentType.kino": "1010001001",
                "paymentType.kiname": "现金",
                "paymentType.kibalance": "JSU2J3-SYS",
            }
            
    .. method:: <C> updatePaymentType
    
        添加款项类型
        
        判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentType.ptid: 款项类型ID
        :type paymentType.ptid: Long
        :param paymentType.kino: 金蝶编号
        :type paymentType.kino: String
        :param paymentType.kiname: 金蝶名称
        :type paymentType.kiname: String
        :param paymentType.kibalance: 金蝶结算
        :type paymentType.kibalance: String
        
        Example::
        
            {
                "paymentType.ptid": 1
                "paymentType.kino": "1010001001",
                "paymentType.kiname": "现金",
                "paymentType.kibalance": "JSU2J3-SYS",
            }

    .. method:: <C> updatePaymentTypeForStatus
    
        更新款项类型状态
        
        判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentType.ptid: 款项类型ID
        :type paymentType.ptid: Long
        :param paymentType.status: 状态
        :type paymentType.status: Short
        
        Example::
        
            {
                "paymentType.ptid": 1
                "paymentType.status": 1
            }

收据类型
----------------

收据类型信息管理

.. class:: api.data.ReceiptTypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: receiptType
    
    :param rtid: 收据类型ID
    :type rtid: Long
    :param no: 编号
    :type no: String
    :param name: 收据类型名称
    :type name: String
    :param grade: 等级 , A/B/C
    :type grade: String
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    :param kibalance: 结算方式
    :type kibalance: String
    :param assistant: 辅助核算项
    :type assistant: String
    :param type: 类型 , 1: 现金 , 2: 银行 , 3: 转账 , 4: 对公 , 5: 优惠
    :type type: Short
    :param fund: 资金类型 , 0: 标准 , 1: 资金
    :type fund: Short
    :param status: 状态 , 0: 失效 , 1: 有效
    :type status: Short
    :param bankno: 银行卡
    :type bankno: String
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> pageReceiptType
    
        分页方式获取收据类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 收据类型信息列表 , 每条数据类型 :data:`receiptType`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "rtid": 1,
                            "no": "157",
                            "name": "总公司",
                            "grade": "",
                            "kino": "1010001001"
                            "kiname": "现金",
                            "kibalance": "JSU2J3-SYS",
                            "assistant": "",
                            "fund": 0,
                            "type": 1,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryReceiptType
    
        获取所有收据类型信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param receiptTypes: 收据类型信息列表 , 每条信息类型 :data:`receiptType`
        :type receiptTypes: List
        
        Example::
        
            {
                ...
                "receiptTypes": [
                    {
                        "rtid": 1,
                        "no": "157",
                        "name": "总公司",
                        "grade": "",
                        "kino": "1010001001"
                        "kiname": "现金",
                        "kibalance": "JSU2J3-SYS",
                        "assistant": "",
                        "fund": 0,
                        "type": 1,
                        "status": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryReceiptTypeByNo
    
    .. method:: <I> queryReceiptTypeByType
    
        通过类型获取收据类型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param receiptType.type: 类型
        :type receiptType.type: Short
        :param receiptType.grade: 等级
        :type receiptType.grade: String
        
        Example::
        
            {
                "receiptType.type": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param receiptTypes: 收据类型信息列表 , 每条信息类型 :data:`receiptType`
        :type receiptTypes: List
        
        Example::
        
            {
                ...
                "receiptTypes": [
                    {
                        "rtid": 1,
                        "no": "157",
                        "name": "总公司",
                        "grade": "",
                        "kino": "1010001001"
                        "kiname": "现金",
                        "kibalance": "JSU2J3-SYS",
                        "assistant": "",
                        "fund": 0,
                        "type": 1,
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <C> addReceiptType
    
        添加收据类型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param receiptType.no: 键值
        :type receiptType.no: String
        :param receiptType.name: 名称
        :type receiptType.name: String
        :param receiptType.grade: 等级
        :type receiptType.grade: String
        :param receiptType.kino: 金蝶编号
        :type receiptType.kino: String
        :param receiptType.kiname: 金蝶名称
        :type receiptType.kiname: String
        :param receiptType.kibalance: 结算方式
        :type receiptType.kibalance: String
        :param receiptType.assistant: 辅助核算项
        :type receiptType.assistant: String
        :param receiptType.type: 类型
        :type receiptType.type: Short
        :param receiptType.fund: 资金类型
        :type receiptType.fund: Short
        
        Example::
        
            {
                "receiptType.no": "157",
                "receiptType.name": '总公司',
                "receiptType.grade": "",
                "receiptType.kino": "1010001001",
                "receiptType.kiname": "现金",
                "receiptType.kibalance": "JSU2J3-SYS",
                "receiptType.type": 1,
                "receiptType.fund": 0
            }
            
    .. method:: <I> updateReceiptType
    
        更新收据类型信息
        
        收据类型信息不存在 , 错误信息 **130005 收据类型不存在**
        
        +---------+
        |Requests:|
        +---------+

        :param receiptType.rtid: ID
        :type receiptType.rtid: Long
        :param receiptType.no: 键值
        :type receiptType.no: String
        :param receiptType.name: 名称
        :type receiptType.name: String
        :param receiptType.grade: 等级
        :type receiptType.grade: String
        :param receiptType.kino: 金蝶编号
        :type receiptType.kino: String
        :param receiptType.kiname: 金蝶名称
        :type receiptType.kiname: String
        :param receiptType.kibalance: 结算方式
        :type receiptType.kibalance: String
        :param receiptType.assistant: 辅助核算项
        :type receiptType.assistant: String
        :param receiptType.type: 类型
        :type receiptType.type: Short
        :param receiptType.fund: 资金类型
        :type receiptType.fund: Short

        Example::

            {
                "receiptType.rtid": 1,
                "receiptType.no": "157",
                "receiptType.name": "总公司",
                "receiptType.grade": "",
                "receiptType.kino": "1010001001",
                "receiptType.kiname": "现金",
                "receiptType.kibalance": "JSU2J3-SYS",
                "receiptType.type": 1,
                "receiptType.fund": 0
            }
            
    .. method:: <I> updateReceiptTypeForStatus
    
        更新收据类型信息状态
        
        收据类型信息不存在 , 错误信息 **130005 收据类型不存在**

        +---------+
        |Requests:|
        +---------+

        :param receiptType.rtid: ID
        :type receiptType.rtid: Long
        :param receiptType.status: 状态
        :type receiptType.status: Short

        Example::

            {
                "receiptType.rtid": 1,
                "receiptType.status": 1
            }

    +---------+
    |DataType:|
    +---------+
    
    .. data:: receiptTypeItem
    
    :param rtiid: 单据ID
    :type rtiid: Long
    :param rtid: 收据类型ID
    :type rtid: Long
    :param no: 编号
    :type no: String
    :param name: 单据名
    :type name: String
    :param bustype: 类型 , 0: 预付
    :type bustype: Short
    :param paytype: 款项类型 , 0: 收款 , 1: 退款
    :type paytype: Short
    
    .. method:: <I> queryReceiptTypeItem
    
        查询单据信息
        
        +---------+
        |Requests:|
        +---------+

        :param receiptTypeItem.rtid: ID
        :type receiptTypeItem.rtid: Long

        Example::

            {
                "receiptTypeItem.rtid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param receiptTypeItems: 单据信息列表 , 每条信息类型 :data:`receiptTypeItem`
        :type receiptTypeItems: List
        
        Example::
        
            {
                ...
                "receiptTypeItems": [
                    {
                        "rtiid": 1,
                        "rtid": 1,
                        "no": "157",
                        "name": "总公司",
                        "type": 1
                    }
                ],
                ...
            }

    .. method:: <C> addReceiptTypeItem
    
        添加单据信息
        
        +---------+
        |Requests:|
        +---------+

        :param receiptTypeItem.rtid: ID
        :type receiptTypeItem.rtid: Long
        :param receiptTypeItem.no: 编号
        :type receiptTypeItem.no: Long
        :param receiptTypeItem.name: 名称
        :type receiptTypeItem.name: Long
        :param receiptTypeItem.type: 类型
        :type receiptTypeItem.type: Long

        Example::

            {
                "receiptTypeItem.rtid": 1,
                "receiptTypeItem.no": "DJFIJ3I2J23HJ",
                "receiptTypeItem.name": "单据名称",
                "receiptTypeItem.rtid": 1,
            }

    .. method:: <C> deleteReceiptTypeItem
    
        删除单据信息
        
        +---------+
        |Requests:|
        +---------+

        :param receiptTypeItem.rtiid: ID
        :type receiptTypeItem.rtid: Long
        
        Example::

            {
                "receiptTypeItem.rtiid": 1
            }
            
款项比例
----------------

款项比例信息 , 生成装修款按照该比例进行

.. class:: api.data.PaymentScaleAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: paymentScale
    
    :param psid: ID
    :type psid: Long
    :param cid: 公司ID
    :type cid: String
    :param name: 名称
    :type name: String
    :param typeness: 业务类型
    :type typeness: Short
    :param dbid: 业务类型
    :type dbid: Long
    :param atttype: 业务类型 , 1: 合同 , 3: 其他
    :type atttype: Short
    :param status: 状态
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. data:: paymentScaleItem
    
    :param psiid: ID
    :type psiid: Long
    :param psid: 款项比例ID
    :type psid: Long
    :param ptid: 款项类型ID
    :type ptid: Long
    :param name: 款项名
    :type name: String
    :param scale: 比例
    :type scale: Short
    :param sort: 排序
    :type sort: Short

    .. method:: <I> queryPaymentScale
    
        通过公司ID获取款项比例信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScale.cid: 公司ID
        :type paymentScale.cid: String
        
        Example::
        
            {
                "paymentScale.cid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param paymentScales: 款项比例列表 , 每条数据类型 :data:`paymentScale`
        :type paymentScales: List
        
        Example::
        
            {
                ...
                "paymentScales": [
                    {
                        "psid": 1,
                        "cid": 1,
                        "name": "半包",
                        "status": 0,
                        "comment": "说明"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryPaymentScaleItemByPsid
    
        通过款项比例ID获取款项比例项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScaleItem.psid: 公司ID
        :type paymentScaleItem.psid: String
        
        Example::
        
            {
                "paymentScaleItem.psid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param paymentScaleItems: 款项比例项列表 , 每条数据类型 :data:`paymentScaleItem`
        :type paymentScaleItems: List
        
        Example::
        
            {
                ...
                "paymentScaleItems": [
                    {
                        "psiid": 1,
                        "psid": 1,
                        "ptid": 1,
                        "name": "首付款",
                        "scale": 30,
                        "sort": 1
                    }
                ],
                ...
            }
            
    .. method:: <I> addPaymentScale
    
        添加款项比例, 关联公司
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScale.cid: 公司ID
        :type paymentScale.cid: String
        :param paymentScale.name: 名称
        :type paymentScale.name: String
        :param paymentScale.comment: 说明
        :type paymentScale.comment: String
        
        Example::
        
            {
                "paymentScale.name": "半包",
                "paymentScale.comment": 0.4
            }
            
    .. method:: <I> addPaymentScaleItem
    
        添加款项比例项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScaleitem.psid: 款项比例ID
        :type paymentScaleitem.psid: Long
        :param paymentScaleitem.ptid: 款项类型ID
        :type paymentScaleitem.ptid: Long
        :param paymentScaleitem.name: 名称
        :type paymentScaleitem.name: String
        :param paymentScaleitem.scale: 比例
        :type paymentScaleitem.scale: Short
        :param paymentScaleItem.sort: 排序
        :type paymentScaleItem.sort: Short
        
        Example::
        
            {
                "paymentScaleitem.psid": 1,
                "paymentScaleitem.ptid": 1,
                "paymentScaleitem.name": "半包",
                "paymentScaleitem.scale": 30,
                "paymentScaleitem.sort": 1
            }

    .. method:: <I> updatePaymentScaleForStatus
    
        更新款项比例状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScale.psid: 款项比例ID
        :type paymentScale.psid: Long
        :param paymentScale.status: 状态
        :type paymentScale.status: Short
        
        Example::
        
            {
                "paymentScale.psid": 1,
                "paymentScale.status": 1
            }

    .. method:: <I> deletePaymentScale
    
        删除款项比例信息
        
        删除款项比例关联的款项比例项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScale.psid: 款项比例ID
        :type paymentScale.psid: Long
         
        Example::
        
            {
                "paymentScale.psid": 1
            }
            
    .. method:: <I> deletePaymentScaleItem
    
        删除款项比例项
        
        +---------+
        |Requests:|
        +---------+
        
        :param paymentScaleItem.psiid: 款项比例项ID
        :type paymentScaleItem.psiid: Long
         
        Example::
        
            {
                "paymentScaleItem.psiid": 1
            }

商户类型
----------------

.. class:: api.data.CustypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: custype
    
    :param ctid: ID
    :type ctid: Long
    :param name: 名称
    :type name: String
    :param no: 商户号
    :type no: String
    :param agent: 机构号
    :type agent: String
    :param phone: 电话
    :type phone: String
    :param wxapp: 微信APPID
    :type wxapp: String
    :param receiptType: 收据类型 , 类型 `receiptType <./data.html#api.communion.ReceiptTypeAction.receiptType>`__
    :type receiptType: Object
    :param platform: 支付平台 , 0: pospay(POS机) , 1: wxpay(微信) , 2: alipay(支付宝)
    :type platform: Short
    :param atttype: 业务类型 , 0: 预付 , 1: 装修 , 2: 主材 , 3: 销售 , 4: 服务
    :type atttype: Short
    :param dgrade: 装修等级
    :type dgrade: String
    :param sgrade: 销售等级
    :type sgrade: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageCustype
    
        分页方式获取商户类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 商户类型信息列表 , 每条数据类型 :data:`custype`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ctid": 1,
                            "name": "名称",
                            "no": "",
                            "agent": "",
                            "phone": "",
                            "wxapp": "",
                            "receiptType": {
                                "rtid": 1,
                                "no": "157",
                                "name": "总公司",
                                "grade": "",
                                "kino": "1010001001"
                                "kiname": "现金",
                                "kibalance": "JSU2J3-SYS",
                                "assistant": "",
                                "fund": 0,
                                "type": 1
                            },
                            "platform": 0,
                            "attype": 0,
                            "dgrade": "A",
                            "sgrade": "",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryCustype
    
        查询商户类型
    
        +---------+
        |Requests:|
        +---------+
        
        :param custype.attype: 业务类型
        :type custype.attype: Short
        :param custype.dgrade: 装修等级
        :type custype.dgrade: String
        :param custype.sgrade: 销售等级
        :type custype.sgrade: String
        
        Example::
        
            {
                "custype.atttype": 0,
                "custype.dgrade": ""
                "custype.sgrade": ""
            }

        +--------+
        |Returns:|
        +--------+
        
        :param custypes: 商户类型信息列表 , 每条数据类型 :data:`custype`
        :type custypes: List
        
        Example::
        
            {
                ...
                "custypes": [
                    {
                        "ctid": 1,
                        "name": "名称",
                        "no": "",
                        "agent": "",
                        "phone": "",
                        "wxapp": "",
                        "receiptType": {
                            "rtid": 1,
                            "no": "157",
                            "name": "总公司",
                            "grade": "",
                            "kino": "1010001001"
                            "kiname": "现金",
                            "kibalance": "JSU2J3-SYS",
                            "assistant": "",
                            "fund": 0,
                            "type": 1
                        },
                        "platform": 0,
                        "attype": 0,
                        "dgrade": "A",
                        "sgrade": "",
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <C> addCustype
    
        添加商户类型
        
        +---------+
        |Requests:|
        +---------+
        
        :param custype.name: 名称
        :type custype.name: String
        :param custype.no: 商户号
        :type custype.no: String
        :param custype.agent: 机构号
        :type custype.agent: String
        :param custype.wxapp: 微信APPID
        :type custype.wxapp: String
        :param custype.platform: 支付平台
        :type custype.platform: Short
        :param custype.attype: 业务类型
        :type custype.attype: Short
        :param custype.dgrade: 装修等级
        :type custype.dgrade: String
        :param custype.sgrade: 销售等级
        :type custype.sgrade: String
        :param custype.receiptType.rtid: 收据类型ID
        :type custype.receiptType.rtid: Long
        
        Example::
        
            {
                "custype.name": "test",
                "custype.no": "",
                "custype.agent": "",
                "custype.wxapp": "",
                "custype.platform": 0,
                "custype.atttype": 0,
                "custype.dgrade": "",
                "custype.sgrade": "",
                "custype.receiptType.rtid": 1
            }

    .. method:: <C> updateCustype
    
        更新商户类型
        
        判断商户类型是否存在 , 不存在 , 错误信息 **130105 商户不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param custype.ctid: ID
        :type custype.ctid: Long
        :param custype.name: 名称
        :type custype.name: String
        :param custype.no: 商户号
        :type custype.no: String
        :param custype.agent: 机构号
        :type custype.agent: String
        :param custype.wxapp: 微信APPID
        :type custype.wxapp: String
        :param custype.platform: 支付平台
        :type custype.platform: Short
        :param custype.attype: 业务类型
        :type custype.attype: Short
        :param custype.dgrade: 装修等级
        :type custype.dgrade: String
        :param custype.sgrade: 销售等级
        :type custype.sgrade: String
        :param custype.status: 状态
        :type custype.status: Short
        :param custype.receiptType.rtid: 收据类型ID
        :type custype.receiptType.rtid: Long
        
        Example::
        
            {
                "custype.ctid": 1,
                "custype.name": "test",
                "custype.no": "",
                "custype.agent": "",
                "custype.wxapp": "",
                "custype.platform": 0,
                "custype.atttype": 0,
                "custype.dgrade": ""
                "custype.sgrade": "",
                "custype.status": 0,
                "custype.receiptType.rtid": 1
            }
    
报价
================

类型
---------------------
报价类型信息管理

.. class:: api.data.QuotationTypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationType
    
    :param qtid: 类型ID
    :type qtid: Long
    :param name: 名称
    :type name: String
    
    .. method:: <I> pageQuotationType
    
        分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价类型信息列表 , 每条数据类型 :data:`quotationType`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qtid": 2,
                            "name": "大宅"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryQuotationType
    
        获取所有报价类型信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationTypes: 报价类型信息列表 , 每条数据类型 :data:`quotationType`
        :type quotationTypes: List
        
        Example::
        
            {
                ...
                "quotationTypes": [
                    {
                        "qtid": 1,
                        "name": "工程"
                    }, {
                        "qtid": 2,
                        "name": "主材"
                    }
                ],
                ...
            }
            
分类
---------------------
报价分类信息管理

.. class:: api.data.QuotationClassificationAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationClassification
    
    :param id: ID
    :type id: Long
    :param name: 名称
    :type name: String
    
    .. method:: <I> pageQuotationClassification
    
        分页方式获取报分类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价分类信息列表 , 每条数据类型 :data:`quotationClassification`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "id": 2,
                            "name": "其他部分"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryQuotationClassification
    
        获取所有报价分类信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationClassifications: 报价分类信息列表 , 每条数据类型 :data:`quotationClassification`
        :type quotationClassifications: List
        
        Example::
        
            {
                ...
                "quotationClassifications": [
                    {
                        "id": 1,
                        "name": "基础部分"
                    }, {
                        "id": 2,
                        "name": "其他部分"
                    }
                ],
                ...
            }

大类
---------------------
报价大类信息管理

.. class:: api.data.QuotationBigCategoryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationBigCategory
    
    :param id: ID
    :type id: Long
    :param name: 名称
    :type name: String
    :param qtid: 类型ID
    :type qtid: Long
    
    .. method:: <I> pageQuotationBigCategory
    
        分页方式获取报大类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价分类信息列表 , 每条数据类型 :data:`quotationBigCategory`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "id": 2,
                            "name": "其他部分",
                            "qtid": 1
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryQuotationBigCategory
    
        获取所有报价大类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationBigCategory.qtid: 类型
        :type quotationBigCategory.qtid: Long
        
        Example::
        
            {
                "quotationBigCategory.qtid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationBigCategorys: 报价大类信息列表 , 每条数据类型 :data:`quotationBigCategory`
        :type quotationBigCategorys: List
        
        Example::
        
            {
                ...
                "quotationBigCategorys": [
                    {
                        "id": 1,
                        "name": "基础部分",
                        "qtid": 1
                    }, {
                        "id": 2,
                        "name": "木作及油饰",
                        "qtid": 1
                    }
                ],
                ...
            }
            
小类
---------------------
报价小类信息管理

.. class:: api.data.QuotationSmallCategoryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationSmallCategory
    
    :param id: ID
    :type id: Long
    :param name: 名称
    :type name: String
    :param qtid: 类型ID
    :type qtid: Long
    
    .. method:: <I> pageQuotationSmallCategory
    
        分页方式获取报小类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价小类信息列表 , 每条数据类型 :data:`quotationSmallCategory`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "id": 2,
                            "name": "灯具及开关插座安装",
                            "qtid": 1
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryQuotationSmallCategory
    
        获取所有报价小类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationSmallCategory.qtid: 类型
        :type quotationSmallCategory.qtid: Long
        
        Example::
        
            {
                "quotationSmallCategory.qtid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationSmallCategorys: 报价小类信息列表 , 每条数据类型 :data:`quotationSmallCategory`
        :type quotationSmallCategorys: List
        
        Example::
        
            {
                ...
                "quotationSmallCategorys": [
                    {
                        "id": 1,
                        "name": "厨房",
                        "qtid": 1
                    }, {
                        "id": 2,
                        "name": "灯具及开关插座安装",
                        "qtid": 1
                    }
                ],
                ...
            }
            
版本
---------------------
报价版本信息管理

.. class:: api.data.QuotationVersionAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationVersion
    
    :param qvid: 报价版本ID
    :type qvid: Long
    :param no: 编号
    :type no: String
    :param name: 版本名称
    :type name: String
    :param defaultFlag: 默认标识 , 0: 非默认版本 , 1: 默认报价版本 , 表示当前系统报价默认使用报价版本 , 并作为报价项选择条件 , 系统有且仅有一个默认报价版本
    :type defaultFlag: Short
    :param undisDiscount: 不打折折扣 , 0: 不打折 , 1: 打折
    :type undisDiscount: Short
    :param trafficRate: 车运费比例
    :type trafficRate: Integer
    :param trafficDiscount: 车运费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣
    :type trafficDiscount: Short
    :param manageRate: 管理费比例
    :type manageRate: Integer
    :param manageDiscount: 管理费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣
    :type manageDiscount: Short
    :param taxRate: 税金比例
    :type taxRate: Integer
    :param taxDiscount: 税金折扣 , 0: 管理税金 , 1: 总价税金
    :type taxDiscount: Short
    :param offset: 偏移量
    :type offset: Integer
    :param type: 类型 , 0: 半包 , 装修单 , 不包括主材单 , 1: 整装 , 装修+主材单 , 2: 满减 , 主材配比 , 装修打折
    :type type: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param comment: 说明
    :type comment: String
    :param company: 公司ID
    :type company: Integer
    
    +--------+
    |Filters:|
    +--------+
    
    :param name: 版本名称
    :type name: String
    
    .. method:: <I> pageQuotationVersion
    
        分页方式获取报价爱版本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 大区信息列表 , 每条数据类型 :data:`region`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qvid": 1,
                            "no": "QV001",
                            "name": "test"
                            "defaultFlag": 0,
                            "undisDiscount": 0,
                            "trafficRate": 0.15,
                            "trafficDiscount": 0,
                            "manageRate": 0.135,
                            "manageDiscount": 0,
                            "taxRate": 0.135,
                            "taxDiscount": 0,
                            "offset": 0,
                            "type": 0,
                            "status": 0,
                            "comment": "test"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryQuotationVersion
    
        获取所有报价版本信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationVersions: 报价版本信息列表 , 每条数据类型 :data:`quotationVersion`
        :type quotationVersions: List
        
        Example::
        
            {
                ...
                "quotationVersions": [
                    {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "test",
                        "defaultFlag": 0,
                        "undisDiscount": 0,
                        "trafficRate": 0.15,
                        "trafficDiscount": 0,
                        "manageRate": 0.135,
                        "manageDiscount": 0,
                        "taxRate": 0.135,
                        "taxDiscount": 0,
                        "offset": 0,
                        "type": 0,
                        "status": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> queryQuotationVersionByVersionId
    
        通过报价版本编号查询版本信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationVersion.no: 版本编号
        :type quotationVersion.no: String
        
        Example::
        
            {
                "quotationVersion.no": "QV002"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param quotationVersion: 报价版本信息 , 类型 :data:`quotationVersion`
        :type quotationVersion: Object
        
        Example::
        
            {
                ...
                "quotationVersion":{
                    "qvid": 1,
                    "no": "QV001",
                    "name": "test"
                    "defaultFlag": 0,
                    "undisDiscount": 0,
                    "trafficRate": 0.15,
                    "trafficDiscount": 0,
                    "manageRate": 0.135,
                    "manageDiscount": 0,
                    "taxRate": 0.135,
                    "taxDiscount": 0,
                    "offset": 0,
                    "type": 0,
                    "comment": "test",
                },
                ...
            }
            
    .. method:: <I> addQuotationVersion
    
        添加报价版本信息 
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationVersion.name: 版本名称
        :type quotationVersion.name: String
        :param quotationVersion.undisDiscount: 不打折折扣
        :type qotationVersion.undisDiscount: Short
        :param quotationVersion.trafficRate: 车运费比例
        :type quotationVersion.trafficRate: Integer
        :param quotationVersion.trafficDiscount: 车运费折扣
        :type quotationVersion.trafficDiscount: Short
        :param quotationVersion.manageRate: 管理费比例
        :type quotationVersion.manageRate: Integer
        :param quotationVersion.manageDiscount: 管理费折扣
        :type quotationVersion.manageDiscount: Short
        :param quotationVersion.taxRate: 税金比例
        :type quotationVersion.taxRate: Integer
        :param quotationVersion.taxDiscount: 税金折扣
        :type quotationVersion.taxDiscount: Short
        :param quotationVersion.type: 类型
        :type quotationVersion.type: Short
        :param quotationVersion.comment: 说明
        :type quotationVersion.comment: String
        
        Example::
        
            {
                "quotationVersion.name": "test",
                "quotationVersion.defaultFlag": 0,
                "quotationVersion.undisDiscount": 0,
                "quotationVersion.trafficRate": 0.1,
                "quotationVersion.trafficDiscount": 0,
                "quotationVersion.manageRate": 0.1,
                "quotationVersion.manageDiscount": 0,
                "quotationVersion.taxRate": 0.135,
                "quotationVersion.taxDiscount": 0,
                "quotationVersion.offset": 0,
                "quotationVersion.type": 0,
                "quotationVersion.comment": "test"
            }
            
    .. method:: <I> updateQuotationVersion
    
        更新报价版本信息
        
        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationVersion.no: 版本编号
        :type quotationVersion.no: String
        :param quotationVersion.name: 版本名称
        :type quotationVersion.name: String
        :param quotationVersion.undisDiscount: 不打折折扣
        :type qotationVersion.undisDiscount: Short
        :param quotationVersion.trafficRate: 车运费比例
        :type quotationVersion.trafficRate: Integer
        :param quotationVersion.trafficDiscount: 车运费折扣
        :type quotationVersion.trafficDiscount: Short
        :param quotationVersion.manageRate: 管理费比例
        :type quotationVersion.manageRate: Integer
        :param quotationVersion.manageDiscount: 车运费折扣
        :type quotationVersion.manageDiscount: Short
        :param quotationVersion.taxRate: 税金比例
        :type quotationVersion.taxRate: Integer
        :param quotationVersion.taxDiscount: 税金折扣
        :type quotationVersion.taxDiscount: Short
        :param quotationVersion.offset: 偏移量
        :type quotationVersion.offset: Integer
        :param quotationVersion.type: 类型
        :type quotationVersion.type: Short
        :param quotationVersion.comment: 说明
        :type quotationVersion.comment: String
        
        Example::
        
            {
                "quotationVersion.no": "QV001",
                "quotationVersion.name": "test",
                "quotationVersion.undisDiscount": 0,
                "quotationVersion.trafficRate": 0.1,
                "quotationVersion.trafficDiscount": 0,
                "quotationVersion.manageRate": 0.1,
                "quotationVersion.manageDiscount": 0,
                "quotationVersion.taxRate": 0.135,
                "quotationVersion.taxDiscount": 0,
                "quotationVersion.offset": 0,
                "quotationVersion.type": 0,
                "quotationVersion.comment": "test",
            }

    .. method:: <I> updateQuotationVersionForDefault
    
        更新默认报价
        
        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationVersion.qvid: 版本ID
        :type quotationVersion.qvid: Long
        :param quotationVersion.defaultFlag: 默认标识
        :type quotationVersion.defaultFlag: Short
        
        Example::
        
            {
                "qvid": 1,
                "defaultFlag": 0
            }

    .. method:: <I> updateQuotationVersionForStatus
    
        更新状态
        
        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationVersion.qvid: 版本ID
        :type quotationVersion.qvid: Long
        :param quotationVersion.status: 状态
        :type quotationVersion.status: Short
        
        Example::
        
            {
                "qvid": 1,
                "status": 0
            }

共享项
---------------------

.. class:: api.data.QuotationCtemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationCtem
    
    :param qcid: 项目ID
    :type qcid: Long
    :param name: 名称
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param type: 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩
    :type type: Short
    :param category: 类型 , 类型 `quotationType <./data.html#api.data.QuotationTypeAction.quotationType>`__
    :type category: Object
    :param classification: 类别 , 类型 `quotationClassification <./data.html#api.data.QuotationClassificationAction.quotationClassification>`__
    :type classification: Object
    :param bigCategory: 大类 , 类型 `quotationBigCategory <./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory>`__
    :type bigCategory: Object
    :param smallCategory: 小类 , 类型 `quotationSmallCategory <./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory>`__
    :type smallCategory: Object
    :param unit: 单位 , 类型 `measurementUnit <./data.html#api.communion.MeasurementUnitAction.measurementUnit>`__
    :type unit: Object
    :param workType: 工种 , 类型 `workType <./data.html#api.communion.WorkTypeAction.workType>`__
    :type workType: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageQuotationCtem
    
        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价项信息列表 , 每条数据类型 :data:`quotationCtem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qcid": 1,
                            "name": "原墙体建筑大白铲除",
                            "type": 0,
                            "category": {
                                "qtid": 1,
                                "name": "报价类型"
                            },
                            "classification": {
                                "qcid": 1,
                                "name": "报价类别"
                            },
                            "bigCategory": {
                                "qbcid": 1,
                                "name": "报价大类"
                            },
                            "smallCategory": {
                                "qscid": 1,
                                "name": "报价小类"
                            },
                            "unit": {
                                "muid": 1,
                                "name": "名称"
                            },
                            "workType": {
                                "wtid": 1,
                                "name": "工种"
                            },
                            "status": 1
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryQuotationCtem
    
        查询共享项信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationCtem.pinyin: 拼音
        :type quotationCtem.pinyin: String
        
        Example::
        
            {
                "quotationCtem.pinyin": "pinyin",
            }

        +--------+
        |Returns:|
        +--------+
        
        :param paging.data: 报价项信息列表 , 每条数据类型 :data:`quotationCtem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qcid": 1,
                            "name": "原墙体建筑大白铲除",
                            "status": 1
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> addQuotationCtem
    
        添加共享项
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationCtem.name: 名称
        :type quotationCtem.name: String
        :param quotationCtem.type: 类型
        :type quotationCtem.type: Short
        :param quotationCtem.category.qtid: 报价类型ID
        :type quotationCtem.category.qtid: Long
        :param quotationCtem.classification.qcid: 报价类别ID
        :type quotationCtem.classification.qcid: Long
        :param quotationCtem.bigCategory.qbcid: 报价大类ID
        :type quotationCtem.bigCategory.qbcid: Long
        :param quotationCtem.smallCategory.qscid: 报价小类ID
        :type quotationCtem.smallCategory.qscid: Long
        
        Example::
        
            {
                "quotationCtem.name": "名称",
                "quotationCtem.type": 1,
                "quotationCtem.category.qtid": 1,
                "quotationCtem.classification.qcid": 1,
                "quotationCtem.bigCategory.qbcid": 1,
                "quotationCtem.smallCategory.qscid": 11
            }
    
    .. method:: <I> updateQuotationCtem

        更新共享项
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationCtem.qcid: 共享项ID
        :type quotationCtem.qcid: Long
        :param quotationCtem.name: 名称
        :type quotationCtem.name: String
        :param quotationCtem.type: 类型
        :type quotationCtem.type: Short
        :param quotationCtem.category.qtid: 报价类型ID
        :type quotationCtem.category.qtid: Long
        :param quotationCtem.classification.qcid: 报价类别ID
        :type quotationCtem.classification.qcid: Long
        :param quotationCtem.bigCategory.qbcid: 报价大类ID
        :type quotationCtem.bigCategory.qbcid: Long
        :param quotationCtem.smallCategory.qscid: 报价小类ID
        :type quotationCtem.smallCategory.qscid: Long
        
        Example::
        
            {
                "quotationCtem.qcid": 1,
                "quotationCtem.name": "名称",
                "quotationCtem.type": 1,
                "quotationCtem.category.qtid": 1,
                "quotationCtem.classification.qcid": 1,
                "quotationCtem.bigCategory.qbcid": 1,
                "quotationCtem.smallCategory.qscid": 11
            }
    
    .. method:: <I> updateQuotationCtemForStatus
    
        更新共享项状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationCtem.qcid: 项目ID
        :type quotationCtem.qcid: Long
        :param quotationCtem.status: 状态
        :type quotationCtem.status: Short
        
        Example::
        
            {
                "quotationCtem.qcid": 1,
                "quotationCtem.status": 1
            }

.. class:: api.data.QuotationFormatAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationFormat
    
    :param qfid: 规格ID
    :type qfid: Long
    :param qcid: 项目ID
    :type qcid: Long
    :param name: 名称
    :type name: String
    :param format: 规格
    :type format: String
    :param pinyin: 拼音
    :type pinyin: String
    :param price: 价格
    :type price: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> queryQuotationFormat
    
        通过名称/拼音获取规格信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.name: 项目ID
        :type quotationFormat.name: Long
        
        Example::
        
            {
                "quotationFormat.name": 1,
            }

        +--------+
        |Returns:|
        +--------+
        
        :param quotationFormats: 规格信息列表 , 每条数据类型 :data:`quotationFormat`
        :type quotationFormats: List
        
        Example::
        
            {
                ...
                "quotationFormats": [
                    {
                        "qfid": 1,
                        "qcid": 1,
                        "name": "原墙体建筑大白铲除",
                        "format": "100*100"
                        "price": 1000,
                        "status": 1
                    }
                ],
                ...
            }

    .. method:: <I> queryQuotationFormatByQcid
    
        通过项目获取规格信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.qcid: 项目ID
        :type quotationFormat.qcid: Long
        
        Example::
        
            {
                "quotationFormat.qcid": 1,
            }

        +--------+
        |Returns:|
        +--------+
        
        :param quotationFormats: 规格信息列表 , 每条数据类型 :data:`quotationFormat`
        :type quotationFormats: List
        
        Example::
        
            {
                ...
                "quotationFormats": [
                    {
                        "qfid": 1,
                        "qcid": 1,
                        "name": "原墙体建筑大白铲除",
                        "format": "100*100"
                        "price": 1000,
                        "status": 1
                    }
                ],
                ...
            }

    .. method:: <I> addQuotationFormat
    
        添加规格
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.qcid: 项目ID
        :type quotationFormat.qcid: Long
        :param quotationFormat.format: 规格
        :type quotationFormat.format: String
        
        Example::
        
            {
                "quotationFormat.qcid": 1,
                "quotationFormat.format": "规格"
            }
    
    .. method:: <I> updateQuotationFormat
    
        更新规格
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.qfid: 规格ID
        :type quotationFormat.qfid: Long
        :param quotationFormat.format: 规格
        :type quotationFormat.format: String
        
        Example::
        
            {
                "quotationFormat.qfid": 1,
                "quotationFormat.format": "规格"
            }
    
    .. method:: <I> updateQuotationFormatForStatus
    
        更新规格状态
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.qfid: 规格ID
        :type quotationFormat.qfid: Long
        :param quotationFormat.status: 状态
        :type quotationFormat.status: Short
        
        Example::
        
            {
                "quotationFormat.qfid": 1,
                "quotationFormat.status": 1
            }
    
    .. method:: <I> deleteQuotationFormat
    
        删除规格
    
        +---------+
        |Requests:|
        +---------+
        
        :param quotationFormat.qfid: 规格ID
        :type quotationFormat.qfid: Long
        
        Example::
        
            {
                "quotationFormat.qfid": 1
            }
            
报价项
---------------------
报价项信息管理 , 报价项归属于一个报价版本 , 通过报价版本的控制来完成报价项的使用 . 

.. class:: api.data.QuotationItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationItem
    
    :param qiid: 报价项ID
    :type qiid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param alias: 别名
    :type alias: String
    :param version: 版本 , 类型  `quotationVersion <./data.html#api.data.QuotationVersionAction.quotationVersion>`__
    :type version: Object
    :param category: 类型 , 类型 `quotationType <./data.html#api.data.QuotationTypeAction.quotationType>`__
    :type category: Object
    :param classification: 类别 , 类型 `quotationClassification <./data.html#api.data.QuotationClassificationAction.quotationClassification>`__
    :type classification: Object
    :param bigCategory: 大类 , 类型 `quotationBigCategory <./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory>`__
    :type bigCategory: Object
    :param smallCategory: 小类 , 类型 `quotationSmallCategory <./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory>`__
    :type smallCategory: Object
    :param unit: 单位 , 类型 `measurementUnit <./data.html#api.communion.MeasurementUnitAction.measurementUnit>`__
    :type unit: Object
    :param workType: 工种 , 类型 `workType <./data.html#api.communion.WorkTypeAction.workType>`__
    :type workType: String
    :param addPrice: 增补价
    :type addPrice: Integer
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param subPrice: 退减价
    :type subPrice: Integer
    :param cost: 成本
    :type cost: Integer
    :param achePrice: 业绩额
    :type achePrice: Integer
    :param type: 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩
    :type type: Short
    :param status: 状态 , 0: 禁用 , 1: 启用
    :type status: Short
    :param discount: 折扣标识 , 0: 不打折 , 1: 打折
    :type discount: Short
    :param formula: 公式
    :type formula: String
    :param offset: 偏移量 , 用于计算编号使用
    :type offset: Integer
    :param comment: 说明
    :type comment: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param quotationTypeId: 报价类型ID
    :type quotationTypeId: Long
    :param quotationClassificationId: 报价类别ID
    :type quotationClassificationId: Long
    :param quotationBigno: 报价大类ID
    :type quotationBigno: Long
    :param quotationSmallno: 报价小类ID
    :type quotationSmallno: Long
    :param quotationWorkTypeId: 工种ID
    :type quotationWorkTypeId: Long
    :param no: 报价版本编号
    :type no: String
    :param status: 状态
    :type status: Short
    
    .. method:: <I> pageQuotationItem
    
        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价项信息列表 , 每条数据类型 :data:`quotationItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qiid": 1,
                            "no": "QI00100",
                            "name": "原墙体建筑大白铲除",
                            "alias": "",
                            "version": {
                                "qvid": 1,
                                "no": "QV001",
                                "name": "报价版本"
                            },
                            "category": {
                                "qtid": 1,
                                "name": "报价类型"
                            },
                            "classification": {
                                "qcid": 1,
                                "name": "报价类别"
                            },
                            "bigCategory": {
                                "qbcid": 1,
                                "name": "报价大类"
                            },
                            "smallCategory": {
                                "qscid": 1,
                                "name": "报价小类"
                            },
                            "unit": {
                                "muid": 1,
                                "name": "名称"
                            },
                            "workType": {
                                "wtid": 1,
                                "name": "工种"
                            },
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "cost": 0,
                            "achePrice": 0,
                            "discount": 1,
                            "formula": "",
                            "type": 0,
                            "status": 1,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageQuotationItemByVersionId
    
        分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.version.no: 报价版本编号
        :type quotationItem.version.no: String
        
        Example::
        
            {
                "quotationItem.version.no": "QV001",
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价项信息列表 , 每条数据类型 :data:`quotationItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qiid": 1,
                            "no": "QI00100",
                            "name": "原墙体建筑大白铲除",
                            "alias": "",
                            "version": {
                                "qvid": 1,
                                "no": "QV001",
                                "name": "报价版本"
                            },
                            "category": {
                                "qtid": 1,
                                "name": "报价类型"
                            },
                            "classification": {
                                "qcid": 1,
                                "name": "报价类别"
                            },
                            "bigCategory": {
                                "qbcid": 1,
                                "name": "报价大类"
                            },
                            "smallCategory": {
                                "qscid": 1,
                                "name": "报价小类"
                            },
                            "unit": {
                                "muid": 1,
                                "name": "名称"
                            },
                            "workType": {
                                "wtid": 1,
                                "name": "工种"
                            },
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "cost": 0,
                            "achePrice": 0,
                            "discount": 1,
                            "formula": "",
                            "type": 0,
                            "status": 1,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryQuotationItemByItemIdAVersionId
    
        通过版本编号以及报价项编号查询报价项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.version.no: 报价版本编号
        :type quotationItem.version.no: String
        :param quotationItem.no: 报价项编号
        :type quotationItem.no: String
        
        Example::
        
            {
                "quotationItem.version.no": "QV001",
                "quotationItem.no": "QI00100"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param quotationItem: 报价项信息 , 类型 :data:`quotationItem`
        :type region: Object
        
        Example::
        
            {
                ...
                "quotationItem":{
                    "qiid": 1,
                    "no": "QI00100",
                    "name": "原墙体建筑大白铲除",
                    "alias": "",
                    "version": {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "报价版本"
                    },
                    "category": {
                        "qtid": 1,
                        "name": "报价类型"
                    },
                    "classification": {
                        "qcid": 1,
                        "name": "报价类别"
                    },
                    "bigCategory": {
                        "qbcid": 1,
                        "name": "报价大类"
                    },
                    "smallCategory": {
                        "qscid": 1,
                        "name": "报价小类"
                    },
                    "unit": {
                        "muid": 1,
                        "name": "名称"
                    },
                    "workType": {
                        "wtid": 1,
                        "name": "工种"
                    },
                    "addPrice": 120,
                    "unitPrice": 100,
                    "subPrice": 80,
                    "cost": 0,
                    "achePrice": 0,
                    "discount": 1,
                    "formula": "",
                    "type": 0,
                    "status": 1,
                    "comment": "说明"
                },
                ...
            }

    .. method:: <I> pageQuotationItemForPrice
    
        分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.version.no: 报价版本编号
        :type quotationItem.version.no: String
        :param quotationPrice.updateTime: 更新时间
        :type quotationPrice.updateTime: Timestamp
        
        Example::
        
            {
                "quotationItem.version.no": "QV001",
                "quotationItem.updateTime": "2016-01-01 00:00:00",
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 报价项信息列表 , 每条数据类型 :data:`quotationItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qiid": 1,
                            "no": "QI00100",
                            "name": "原墙体建筑大白铲除",
                            "alias": "",
                            "version": {
                                "qvid": 1,
                                "no": "QV001",
                                "name": "报价版本"
                            },
                            "category": {
                                "qtid": 1,
                                "name": "报价类型"
                            },
                            "classification": {
                                "qcid": 1,
                                "name": "报价类别"
                            },
                            "bigCategory": {
                                "qbcid": 1,
                                "name": "报价大类"
                            },
                            "smallCategory": {
                                "qscid": 1,
                                "name": "报价小类"
                            },
                            "unit": {
                                "muid": 1,
                                "name": "名称"
                            },
                            "workType": {
                                "wtid": 1,
                                "name": "工种"
                            },
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "cost": 0,
                            "achePrice": 0,
                            "discount": 1,
                            "formula": "",
                            "type": 0,
                            "status": 1,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryQuotationItemByQiid
    
        通过报价项ID查询信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        
        Example::
        
            {
                "quotationItem.qiid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param quotationItem: 报价项信息 , 类型 :data:`quotationItem`
        :type region: Object
        
        Example::
        
            {
                ...
                "quotationItem":{
                    "qiid": 1,
                    "no": "QI00100",
                    "name": "原墙体建筑大白铲除",
                    "alias": "",
                    "version": {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "报价版本"
                    },
                    "category": {
                        "qtid": 1,
                        "name": "报价类型"
                    },
                    "classification": {
                        "qcid": 1,
                        "name": "报价类别"
                    },
                    "bigCategory": {
                        "qbcid": 1,
                        "name": "报价大类"
                    },
                    "smallCategory": {
                        "qscid": 1,
                        "name": "报价小类"
                    },
                    "unit": {
                        "muid": 1,
                        "name": "名称"
                    },
                    "workType": {
                        "wtid": 1,
                        "name": "工种"
                    },
                    "addPrice": 120,
                    "unitPrice": 100,
                    "subPrice": 80,
                    "cost": 0,
                    "achePrice": 0,
                    "discount": 1,
                    "formula": "",
                    "type": 0,
                    "status": 1,
                    "comment": "说明"
                },
                ...
            }
            
    .. method:: <I> addQuotationItem
    
        添加报价项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.no: 编号
        :type quotationItem.no: String
        :param quotationItem.name: 名称
        :type quotationItem.name: String
        :param quotationItem.addPrice: 增补价
        :type quotationItem.addPrice: Integer
        :param quotationItem.unitPrice: 单价
        :type quotationItem.unitPrice: Integer
        :param quotationItem.subPrice: 退减价
        :type quotationItem.subPrice: Integer
        :param quotationItem.version.no: 报价版本编号
        :type quotationItem.version.no: String
        :param quotationItem.category.qtid: 报价类型ID
        :type quotationItem.category.qtid: Long
        :param quotationItem.classification.qcid: 报价类别ID
        :type quotationItem.classification.qcid: Long
        :param quotationItem.bigCategory.qbcid: 报价大类ID
        :type quotationItem.bigCategory.qbcid: Long
        :param quotationItem.smallCategory.qscid: 报价小类ID
        :type quotationItem.smallCategory.qscid: Long
        :param quotationItem.unit.muid: 单位ID
        :type quotationItem.unit.muid: Long
        :param quotationItem.workType.wtid: 工种ID
        :type quotationItem.workType.wtid: Long
        :param quotationItem.comment: 说明
        :type quotationItem.comment: String
        
        Example::
        
            {
                "quotationItem.no": "QI00100",
                "quotationItem.name": "原墙体建筑大白铲除",
                "quotationItem.addPrice": 100,
                "quotationItem.unitPrice": 100,
                "quotationItem.subPrice": 100,
                "quotationItem.version.no": "QV001",
                "quotationItem.category.qtid": 1,
                "quotationItem.classification.qcid": 1,
                "quotationItem.bigCategory.qbcid": 1,
                "quotationItem.smallCategory.qscid": 11,
                "quotationItem.unit.muid": 1,
                "quotationItem.workType.wtid": 1,
                "quotationItem.comment": "说明"
            }
            
    .. method:: <I> updateQuotationItem
    
        更新报价项信息
        
        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        :param quotationItem.name: 名称
        :type quotationItem.name: String
        :param quotationItem.addPrice: 增补价
        :type quotationItem.addPrice: Integer
        :param quotationItem.unitPrice: 单价
        :type quotationItem.unitPrice: Integer
        :param quotationItem.subPrice: 退减价
        :type quotationItem.subPrice: Integer
        :param quotationItem.category.qtid: 报价类型ID
        :type quotationItem.category.qtid: Long
        :param quotationItem.classification.qcid: 报价类别ID
        :type quotationItem.classification.qcid: Long
        :param quotationItem.bigCategory.qbcid: 报价大类ID
        :type quotationItem.bigCategory.qbcid: Long
        :param quotationItem.smallCategory.qscid: 报价小类ID
        :type quotationItem.smallCategory.qscid: Long
        :param quotationItem.unit.muid: 单位ID
        :type quotationItem.unit.muid: Long
        :param quotationItem.workType.wtid: 工种ID
        :type quotationItem.workType.wtid: Long
        :param quotationItem.comment: 说明
        :type quotationItem.comment: String
        
        Example::
        
            {
                "quotationItem.no": "QI00100",
                "quotationItem.name": "原墙体建筑大白铲除",
                "quotationItem.alias": "",
                "quotationItem.addPrice": 100,
                "quotationItem.unitPrice": 100,
                "quotationItem.subPrice": 100,
                "quotationItem.category.qtid": 1,
                "quotationItem.classification.qcid": 1,
                "quotationItem.bigCategory.qbcid": 1,
                "quotationItem.smallCategory.qscid": 11,
                "quotationItem.unit.muid": 1,
                "quotationItem.workType.wtid": 1,
                "quotationItem.comment": "说明",
            }
            
    .. method:: <I> updateQuotationItemForStatus
    
        更新报价项中状态信息 , 控制报价项启用禁用状态
        
        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        :param quotationItem.status: 状态 , 0: 禁用 , 1: 启用
        :type quotationItem.status: Short
        
        Example::
        
            {
                "quotationItem.qiid": 1,
                "quotationItem.status": 1,
            }
            
    .. method:: <I> updateQuotationItemForDiscount
    
        更新报价项中折扣标识 , 控制报价项是否打折状态
        
        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        :param quotationItem.discount: 折扣标识 , 0: 不打折 , 1: 打折
        :type quotationItem.discount: Short
        
        Example::
        
            {
                "quotationItem.qiid": 1,
                "quotationItem.discount": 1
            }

    .. method:: <I> updateQuotationItemForFormula
    
        更新报价项中公式信息
        
        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        :param quotationItem.formula: 公式
        :type quotationItem.formula: String
        
        Example::
        
            {
                "quotationItem.qiid": 1,
                "quotationItem.formula": ""
            }

    .. method:: <I> updateQuotationItemForCost
    
        更新报价项中成本金额
        
        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationItem.qiid: 报价项ID
        :type quotationItem.qiid: Long
        :param quotationItem.alias: 别名
        :type quotationItem.alias: String
        :param quotationItem.cost: 成本
        :type quotationItem.cost: Integer
        :param quotationItem.achePrice: 业绩额
        :type quotationItem.achePrice: Integer
        
        Example::
        
            {
                "quotationItem.qiid": 1,
                "quotationItem.alias": "",
                "quotationItem.cost": 0,
                "quotationItem.achePrice": 0
            }

定义项
---------------------
定义项 , 系统级自定义项目 , 提供订单制作减项过程使用

.. class:: api.data.SystemDefineItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: systemDefineItem
    
    :param sdiid: 定义项目ID
    :type sdiid: Long
    :param itemId: 定义项目编号
    :type itemId: String
    :param quotationBigno: 报价大类ID
    :type quotationBigno: Long
    :param quotationBigCategory: 报价大类
    :type quotationBigCategory: String
    :param itemName: 项目名称
    :type itemName: String
    :param measurementUnitId: 单位ID
    :type measurementUnitId: Long
    :param measurementUnit: 单位
    :type measurementUnit: String
    :param itemWorkTypeId: 工种ID
    :type itemWorkTypeId: Long
    :param itemWorkType: 工种
    :type itemWorkType: String
    :param quotationItemDes: 项目说明
    :type quotationItemDes: String
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param status: 状态 , 0: 禁用 , 1: 启用
    :type status: Short
    :param discount: 折扣标识 , 0: 不打折 , 1: 打折
    :type discount: Short
    :param company: 公司ID
    :type company: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param itemName: 项目名称
    :type itemName: String
    :param quotationBigno: 报价大类ID
    :type quotationBigno: Long
    :param quotationWorkTypeId: 工种ID
    :type quotationWorkTypeId: Long
    
    .. method:: <I> pageSystemDefineItem
    
        分页方式获取定义项目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 定义项目信息列表 , 每条数据类型 :data:`systemDefineItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "itemId": "SI00001",
                            "itemName": "test",
                            "quotationItemDes": "",
                            "unitPrice": 100,
                            "status": 1,
                            "discount": 0,
                            "itemWorkType": "力",
                            "itemWorkTypeId": 1,
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSystemDefineItemForEnable
    
        分页方式获取开启状态的定义项目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 定义项目信息列表 , 每条数据类型 :data:`systemDefineItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "itemId": "SI00001",
                            "itemName": "test",
                            "quotationItemDes": "",
                            "unitPrice": 100,
                            "status": 1,
                            "discount": 0,
                            "itemWorkType": "力",
                            "itemWorkTypeId": 1,
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> querySystemDefineItemByItemId
    
        通过定义项目编号获取定义项目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.itemId: 项目编号
        :type systemDefineItem.itemId: String
        
        Example::
        
            {
                "systemDefineItem.itemId": "SI00001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param systemDefineItem: 定义项目信息 , 类型 :data:`systemDefineItem`
        :type systemDefineItem: object
        
        Example::
        
            {
                ...
                "systemDefineItem":{
                    "sdiid": 1,
                    "itemId": "SI00001",
                    "itemName": "test",
                    "quotationItemDes": "",
                    "unitPrice": 100,
                    "status": 1,
                    "discount": 0,
                    "itemWorkType": "力",
                    "itemWorkTypeId": 1,
                    "measurementUnit": "米",
                    "measurementUnitId": 1,
                    "quotationBigCategory": "基础部分",
                    "quotationBigno": 1,
                },
                ...
            }
        
    .. method:: <I> addSystemDefineItem
    
        添加定义项目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.itemId: 项目编号
        :type systemDefineItem.itemId: String
        :param systemDefineItem.itemName: 项目名称
        :type systemDefineItem.itemName: String
        :param systemDefineItem.unitPrice: 单价
        :type systemDefineItem.unitPrice: String
        :param systemDefineItem.quotationItemDes: 项目说明
        :type systemDefineItem.quotationItemDes: String
        :param systemDefineItem.itemWorkTypeId: 工种ID
        :type systemDefineItem.itemWorkTypeId: Long
        :param systemDefineItem.measurementUnitId: 单位ID
        :type systemDefineItem.measurementUnitId: Long
        :param systemDefineItem.quotationBigno: 报价大类ID
        :type systemDefineItem.quotationBigno: Long
        
        Example::
        
            {
                "systemDefineItem.itemId": "SI_00002",
                "systemDefineItem.itemName": "test",
                "systemDefineItem.unitPrice": 100,
                "systemDefineItem.quotationItemDes": "111",
                "systemDefineItem.itemWorkTypeId": 1,
                "systemDefineItem.measurementUnitId": 1,
                "systemDefineItem.quotationBigno": 1
            }
        
    .. method:: <I> updateSystemDefineItem
    
        更新定义项目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.sdiid: 定义项目ID
        :type systemDefineItem.sdiid: Long
        :param systemDefineItem.itemName: 项目名称
        :type systemDefineItem.itemName: String
        :param systemDefineItem.unitPrice: 单价
        :type systemDefineItem.unitPrice: String
        :param systemDefineItem.quotationItemDes: 项目说明
        :type systemDefineItem.quotationItemDes: String
        :param systemDefineItem.itemWorkTypeId: 工种ID
        :type systemDefineItem.itemWorkTypeId: Long
        :param systemDefineItem.measurementUnitId: 单位ID
        :type systemDefineItem.measurementUnitId: Long
        :param systemDefineItem.quotationBigno: 报价大类ID
        :type systemDefineItem.quotationBigno: Long
        
        Example::
        
            {
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.itemName": "test",
                "systemDefineItem.unitPrice": 100,
                "systemDefineItem.quotationItemDes": "111",
                "systemDefineItem.itemWorkTypeId": 1,
                "systemDefineItem.measurementUnitId": 1,
                "systemDefineItem.quotationBigno": 1
            }
            
    .. method:: <I> updateSystemDefineItemForStatus
    
        更新定义项目中状态信息 , 控制定义项目启用禁用状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.sdiid: 定义项目ID
        :type systemDefineItem.sdiid: Long
        :param systemDefineItem.status: 状态 , 0: 禁用 , 1: 启用
        :type systemDefineItem.sdiid: Short
        
        Example::
        
            {
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.status": 1
            }
            
    .. method:: <I> updateSystemDefineItemForDiscount
    
        更新定义项目中折扣标识信息 , 控制定义项目是否可以打折
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.sdiid: 定义项目ID
        :type systemDefineItem.sdiid: Long
        :param systemDefineItem.discount: 折扣标识 , 0: 不打折 , 1: 打折
        :type systemDefineItem.discount: Short
        
        Example::
        
            {
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.discount": 1
            }
            
    .. method:: <I> deleteSystemDefineItem
    
        通过定义项目ID列表信息批量删除定义项目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param systemDefineItem.sdiid: 定义项目ID
        :type systemDefineItem.sdiid: Long
        
        Example::
        
            {
                "systemDefineItem.sdiid": 1
            }

功能区
---------------------
功能区信息管理

.. class:: api.data.FunctionAreaAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: functionArea
    
    :param faId: 功能区ID
    :type faId: Long
    :param functionAreaId: 功能区编号
    :type functionAreaId: String
    :param functionAreaName: 功能区名称
    :type functionAreaName: String
    :param functionAreaOrder: 排序
    :type functionAreaOrder: Integer
    :param functionAreaType: 类型 , 分为: 标准 , 一次性包死 , 综合项目
    :type functionAreaType: String
    :param no: 版本编号
    :type no: String
    :param version: 版本名称
    :type version: String
    :param type: 类型 , 分为: 0(管理), 1(工程量), 2(总额), 3(不计算), 4(成本), 5(非业绩)
    :type type: Short
    :param total: 总额 , 当类型为2(功能区总额)时 , 可以按照功能区总价计算
    :type total: Long
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司ID
    :type company: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param no: 报价版本编号
    :type no: String
    
    .. method:: <I> pageFunctionArea
    
        分页方式获取功能区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 功能区信息列表 , 每条数据类型 :data:`functionArea`
        :type paging.data: List
    
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "faId": 1,
                            "functionAreaId": "D001",
                            "functionAreaName": "标准",
                            "functionAreaOrder": 1,
                            "functionAreaType": "标准",
                            "version": "test",
                            "no": "QV001",
                            "type": 1,
                            "total": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryFunctionAreaByIdAVersionId
    
        通过功能区编号以及报价版本获取功能区信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param functionArea.functionAreaId: 功能区编号
        :type functionArea.functionAreaId: String
        :param functionArea.no: 版本编号
        :type functionArea.no: String
        
        Example::
        
            {
                "functionArea.functionAreaId": "D001",
                "functionArea.no": "QV001"
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param functionArea: 功能区信息 , 类型 :data:`functionArea`
        :type functionArea: object
        
        Example::
        
            {
                ...
                "region":{
                    "faId": 1,
                    "functionAreaId": "D001",
                    "functionAreaName": "标准",
                    "functionAreaOrder": 1,
                    "functionAreaType": "标准",
                    "version": "test",
                    "no": "QV001",
                    "type": 1,
                    "total": 0
                },
                ...
            }
            
    .. method:: <I> queryFunctionAreaByVersionId
    
        通过报价版本获取功能区信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionArea.no: 版本编号
        :type functionArea.no: String
        
        Example::
        
            {
                "functionArea.no": "QV001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param functionAreas: 功能区信息列表 , 每条数据类型 :data:`functionArea`
        :type functionAreas: List
        
        Example::
        
            {
                ...
                "functionAreas": [
                    {
                        "faId": 1,
                        "functionAreaId": "D001",
                        "functionAreaName": "标准",
                        "functionAreaOrder": 1,
                        "functionAreaType": "标准",
                        "version": "test",
                        "no": "QV001",
                        "type": 1,
                        "total": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> addFunctionArea
    
        添加功能区信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionArea.functionAreaName: 功能区名称
        :type functionArea.functionAreaName: String
        :param functionArea.functionAreaOrder: 排序
        :type functionArea.functionAreaOrder: Integer
        :param functionArea.functionAreaType: 类型 , 分为: 标准 , 一次性包死 , 综合项目
        :type functionArea.functionAreaType: String
        :param functionArea.no: 报价版本编号
        :type functionArea.no: String
        :param functionArea.type: 类型
        :type functionArea.type: Short
        :param functionArea.total: 总额
        :type functionArea.total: Long
        
        Example::
        
            {
                "functionArea.functionAreaName": "标准",
                "functionArea.functionAreaOrder": 1,
                "functionArea.functionAreaType": "标准",
                "functionArea.no": "QV001",
                "functionArea.type": 1,
                "functionArea.total": 0
            }
            
    .. method:: <I> updateFunctionArea
    
        更新功能区信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionArea.faId: 功能区ID
        :type functionArea.faId: Integer
        :param functionArea.functionAreaName: 功能区名称
        :type functionArea.functionAreaName: String
        :param functionArea.functionAreaOrder: 排序
        :type functionArea.functionAreaOrder: Integer
        :param functionArea.functionAreaType: 类型 , 分为: 标准 , 一次性包死 , 综合项目
        :type functionArea.functionAreaType: String,
        :param functionArea.type: 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算)
        :type functionArea.type: Short
        :param functionArea.total: 总额
        :type functionArea.total: Long
        
        Example::
        
            {
                "functionArea.faId": 1,
                "functionArea.functionAreaName": "标准",
                "functionArea.functionAreaOrder": 1,
                "functionArea.functionAreaType": "标准",
                "functionArea.type": 1,
                "functionArea.total": 0
            }
            
    .. method:: <I> deleteFunctionArea
    
        通过功能区ID批量删除功能区信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param ids: 功能区ID列表 , 每条数据类型 Integer
        :type ids: List
        
        Example::
        
            {
                "ids[0]": 1,
                "ids[1]": 2
            }

功能区-报价项
---------------------
功能区中包含的报价项信息 , 提供归属报价的相关操作

.. class:: api.data.FunctionAreaItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: functionAreaItem
    
    :param faiId: 所属报价项ID
    :type faiId: Long
    :param functionArea: 功能区信息 , 类型 `functionArea <./data.html#api.data.FunctionAreaAction.functionArea>`__
    :type functionArea: Object
    :param quotationItem: 报价项信息 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    :param formula: 公式
    :type formula: String
    :param sort: 排序
    :type sort: Integer
    
    .. method:: <I> queryFunctionAreaItemByFunctionAreaId
    
        通过功能区ID获取功能区包含的报价项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionAreaItem.faId: 功能区ID
        :type functionAreaItem.faId: Long
        
        Example::
        
            {
                "functionAreaItem.faId": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param functionAreaItems: 报价项信息列表 , 每条数据类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`_
        :type functionAreaItems: List

        Example::
        
            {
                ...
                "functionAreas": [
                    {
                        "faiId": 1,
                        "functionArea": {
                            "faId": 1,
                            "functionAreaId": "D001",
                            "functionAreaName": "标准",
                            "functionAreaOrder": 1,
                            "functionAreaType": "标准",
                            "version": "test",
                            "no": "QV001"
                        },
                        "quotationItem": {
                            "qiid": 1,
                            "itemId": "QI00100",
                            "itemName": "原墙体建筑大白铲除",
                            "addPrice": 100,
                            "unitPrice": 100,
                            "subPrice": 100,
                            "status": 1,
                            "discount": 1,
                            "no": "QV001",
                            "version": "banben",
                            "quotationItemDes": "说明",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "workTypeId": 1,
                            "workType": "力"
                        },
                        "formula": "a*b+c",
                        "sort": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> addFunctionAreaItem
    
        向功能区中添加报价项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionAreaItems[n].functionArea.faId: 功能区ID
        :type functionAreaItems[n].functionArea.faId: Long
        :param functionAreaItems[n].quotationItem.qiid: 报价项ID
        :type functionAreaItems[n].quotationItem.qiid: Long
        :param functionAreaItems[n].quotationItem.quotationClassification: 功能区类别
        :type functionAreaItems[n].quotationItem.quotationClassification: String
        :param functionAreaItems[n].sort: 排序
        :type functionAreaItems[n].sort: Integer
        
        Example::
        
            {
                "functionAreaItems[0].functionArea.faId": 1,
                "functionAreaItems[0].quotationItem.qiid": 1,
                "functionAreaItems[0].quotationItem.quotationClassification": "标准",
                "functionAreaItems[0].sort": 0,
                "functionAreaItems[1].functionArea.faId": 1,
                "functionAreaItems[1].quotationItem.qiid": 2,
                "functionAreaItems[1].quotationItem.quotationClassification": "标准",
                "functionAreaItems[1].sort": 1
            }
            
    .. method:: <I> updateFunctionAreaItem
    
        更新功能区中报价项
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionAreaItem.faiId: ID
        :type functionAreaItem.faiId: Long
        :param functionAreaItem.formula: 公式
        :type functionAreaItem.formula: String
        
        Example::
        
            {
                "functionAreaItem.faiId": 1,
                "functionAreaItem.formula": "a*b+c"
            }

    .. method:: <I> updateFunctionAreaItemForSort
    
        更新功能区中报价项排序
        
        +---------+
        |Requests:|
        +---------+
        
        :param functionAreaItems[n].faiid: 项目ID
        :type functionAreaItems[n].faiid: Long
        :param functionAreaItems[n].sort: 排序
        :type functionAreaItems[n].sort: Integer
        
        Example::
        
            {
                "functionAreaItems[0].faiid": 1,
                "functionAreaItems[0].sort": 0,
                "functionAreaItems[1].faiid": 1,
                "functionAreaItems[1].sort": 1
            }
            
    .. method:: <I> deleteFunctionAreaItemByIds
    
        通过功能区包含报价项ID删除报价项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param ids: 功能区包含报价项ID列表 , 每条数据类型 Long
        :type ids: List
        
        Example::
        
            {
                "ids[0]": 1,
                "ids[1]": 2
            }

价格
---------------------

.. class:: api.data.QuotationPriceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: quotationPrice
    
    :param qpid: 价格ID
    :type qpid: Long
    :param quotationItem: 报价项信息 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    :param addPrice: 增补价
    :type addPrice: Integer
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param subPrice: 退减价
    :type subPrice: Integer
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param updateTime: 更新时间
    :type updateTime: Timestamp
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageQuotationPrice
    
        分页方式获取报价价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 报价价格信息列表 , 每条数据类型 :data:`quotationPrice`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qpid": 1,
                            "quotationItem": {
                                "qiid": 1,
                                "no": "QI00100",
                                "name": "原墙体建筑大白铲除",
                                "alias": "",
                                "version": {
                                    "qvid": 1,
                                    "no": "QV001",
                                    "name": "报价版本"
                                },
                                "addPrice": 120,
                                "unitPrice": 100,
                                "subPrice": 80,
                                "cost": 0,
                                "achePrice": 0,
                                "discount": 1,
                                "formula": "",
                                "type": 0,
                                "status": 1,
                                "comment": "说明"
                            },
                            "addPrice": 10000,
                            "unitPrice": 10000,
                            "subPrice": 10000,
                            "createTime": "2016-01-01 00:00:00",
                            "updateTime": "2016-01-01 00:00:00",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryQuotationPrice
    
        通过报价项获取价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationPrice.quotationItem.qiid: 报价项ID
        :type quotationPrice.quotationItem.qiid: Long
        :param quotationPrice.updateTime: 更新时间
        :type quotationPrice.updateTime: Timestamp
        
        +--------+
        |Returns:|
        +--------+
        
        :param quotationPrices: 报价价格信息 , 类型 :data:`quotationPrice`
        :type quotationPrices: List
        
        Example::
        
            {
                ...
                "quotationPrices": [
                    {
                        "qpid": 1,
                        "addPrice": 10000,
                        "unitPrice": 10000,
                        "subPrice": 10000,
                        "createTime": "2016-01-01 00:00:00",
                        "updateTime": "2016-01-01 00:00:00",
                        "status": 0
                    },
                ]
                ...
            }

    .. method:: <I> addQuotationPrice
    
        添加报价价格
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationPrice.quotationItem.qiid: 报价项ID
        :type quotationPrice.quotationItem.qiid: Long
        :param quotationPrice.addPrice: 增补价
        :type quotationPrice.addPrice: Timestamp
        :param quotationPrice.unitPrice: 增补价
        :type quotationPrice.unitPrice: Timestamp
        :param quotationPrice.subPrice: 退减价
        :type quotationPrice.subPrice: Timestamp
        :param quotationPrice.updateTime: 更新时间
        :type quotationPrice.updateTime: Timestamp
        
        Example::
        
            {
                "quotationPrice.quotationItem.qiid": 1,
                "quotationPrice.addPrice": 10000000,
                "quotationPrice.unitPrice": 100000,
                "quotationPrice.subPrice": 100000,
                "quotationPrice.updateTime": "2016-01-01 00:00:00"
            }

    .. method:: <I> updateQuotationPrice
    
        更新报价价格
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationPrice.qpid: 价格ID
        :type quotationPrice.qpid: Long
        :param quotationPrice.addPrice: 增补价
        :type quotationPrice.addPrice: Timestamp
        :param quotationPrice.unitPrice: 增补价
        :type quotationPrice.unitPrice: Timestamp
        :param quotationPrice.subPrice: 退减价
        :type quotationPrice.subPrice: Timestamp
        :param quotationPrice.updateTime: 更新时间
        :type quotationPrice.updateTime: Timestamp
        
        Example::
        
            {
                "quotationPrice.qpid": 1,
                "quotationPrice.addPrice": 10000000,
                "quotationPrice.unitPrice": 100000,
                "quotationPrice.subPrice": 100000,
                "quotationPrice.updateTime": "2016-01-01 00:00:00"
            }

    .. method:: <I> deleteQuotationPrice
    
        删除报价价格
        
        +---------+
        |Requests:|
        +---------+
        
        :param quotationPrice.qpid: 价格ID
        :type quotationPrice.qpid: Long
        
        Example::
        
            {
                "quotationPrice.qpid": 1
            }

预签
================

产品
---------------------

.. class:: api.data.PresignProduceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: presignProduce
    
    :param ppid: 预签产品ID
    :type ppid: Long
    :param name: 名称
    :type name: String
    :param version: 报价版本 , 类型 `quotationVersion <./data.html#api.data.QuotationVersionAction.quotationVersion>`__
    :type version: Object
    :param quotePrice: 起报价
    :type quotePrice: Long
    :param quoteArea: 起报面积
    :type quoteArea: Integer
    :param unitPrice: 计价单价
    :type unitPrice: Long
    :param discount: 折扣
    :type discount: Integer
    :param discountt: 二级折扣
    :type discountt: Integer
    :param manageRate: 管理费比例
    :type manageRate: Integer
    :param manageFormula: 管理费公式
    :type manageFormula: String
    :param manageDiscount: 管理费折扣
    :type manageDiscount: Integer
    :param manageDiscountt: 管理费折扣
    :type manageDiscountt: Integer
    :param preferPrice: 优惠额
    :type preferPrice: Long
    :param costPrice: 成本单价
    :type costPrice: Long
    :param mostPrice: 主材成本
    :type mostPrice: Long
    :param profitRate: 利润率
    :type profitRate: Integer
    :param costRate: 工程增项成本比例
    :type costRate: Integer
    :param mostRate: 主材增项成本比例
    :type mostRate: Integer
    :param offset: 偏移量
    :type offset: Long
    :param status: 状态 , 0: 初始 , 1: 发布
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pagePresignProduce
    
        分页方式获取预签产品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 预签产品信息列表 , 每条数据类型 :data:`presignProduce`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ppid": 1,
                            "name": "预签产品",
                            "version": {
                                "qvid": 1,
                                "no": "QV001",
                                "name": "test"
                                "comment": "test"
                            },
                            "quotePrice": 10000,
                            "quoteArea": 10000,
                            "unitPrice": 10000,
                            "discount": 1000,
                            "manageRate": 1000,
                            "manageFormula": "",
                            "preferPrice": 0,
                            "costPrice": 799000,
                            "mostPrice": 20000000,
                            "profitRate": 760,
                            "costRate": 100,
                            "mostRate": 700,
                            "offset": 1782,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryPresignProduce
    
        获取预签产品信息 , 状态为1(发布)
        
        +--------+
        |Returns:|
        +--------+
        
        :param presignProduces: 预签产品列表 , 每条数据类型 :data:`presignProduce`
        :type presignProduces: List
        
        Example::
        
            {
                ...
                "tasks": [
                    {
                        "ppid": 1,
                        "name": "预签产品",
                        "version": {
                            "qvid": 1,
                            "no": "QV001",
                            "name": "test"
                            "comment": "test"
                        },
                        "quotePrice": 10000,
                        "quoteArea": 10000,
                        "unitPrice": 10000,
                        "discount": 1000,
                        "manageRate": 1000,
                        "manageFormula": "",
                        "preferPrice": 0,
                        "costPrice": 799000,
                        "mostPrice": 20000000,
                        "profitRate": 760,
                        "costRate": 100,
                        "mostRate": 700,
                        "offset": 1782,
                        "status": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryPresignProduceByPpid
    
        通过预签产品ID获取信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param presignProduce: 预签产品信息 , 类型 :data:`presignProduce`
        :type presignProduce: Object
        
        Example::
        
            {
                ...
                "tasks": {
                    "ppid": 1,
                    "name": "预签产品",
                    "version": {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "test"
                        "comment": "test"
                    },
                    "quotePrice": 10000,
                    "quoteArea": 10000,
                    "unitPrice": 10000,
                    "discount": 1000,
                    "manageRate": 1000,
                    "manageFormula": "",
                    "preferPrice": 0,
                    "costPrice": 799000,
                    "mostPrice": 20000000,
                    "profitRate": 760,
                    "costRate": 100,
                    "mostRate": 700,
                    "offset": 1782,
                    "status": 0
                },
                ...
            }

    .. method:: <I> addPresignProduce
    
        添加预签产品
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignProduce.name: 名称
        :type presignProduce.name: String
        :param presignProduce.version.qvid: 报价版本ID
        :type presignProduce.version.qvid: Long
        :param presignProduce.quotePrice: 起报价
        :type presignProduce.quotePrice: Long
        :param presignProduce.quoteArea: 起报面积
        :type presignProduce.quoteArea: Integer
        :param presignProduce.unitPrice: 计价单价
        :type presignProduce.unitPrice: Long
        :param presignProduce.discount: 折扣
        :type presignProduce.discount: Integer
        :param presignProduce.manageRate: 管理费比例
        :type presignProduce.manageRate: Integer
        :param presignProduce.manageFormula: 管理费公式
        :type presignProduce.manageFormula: String
        :param presignProduce.preferPrice: 优惠额
        :type presignProduce.preferPrice: Long
        :param presignProduce.costPrice: 成本单价
        :type presignProduce.costPrice: Long
        :param presignProduce.mostPrice: 主材成本
        :type presignProduce.mostPrice: Long
        :param presignProduce.profitRate: 利润率
        :type presignProduce.profitRate: Integer
        :param presignProduce.costRate: 工程增项成本比例
        :type presignProduce.costRate: Integer
        :param presignProduce.mostRate: 主材增项成本比例
        :type presignProduce.mostRate: Integer
        :param presignProduce.offset: 偏移量
        :type presignProduce.offset: Long
        
        Example::
        
            {
                "presignProduce.name": "预签产品",
                "presignProduce.version.qvid": 1,
                "presignProduce.quotePrice": 10000000,
                "presignProduce.quoteArea": 100000,
                "presignProduce.unitPrice": 100000,
                "presignProduce.discount": 1000,
                "presignProduce.manageRate": 1000,
                "presignProduce.manageFormula": "",
                "presignProduce.preferPrice": 0,
                "presignProduce.costPrice": 899000,
                "presignProduce.mostPrice": 20000000,
                "presignProduce.profitRate": 790,
                "presignProduce.costRate": 100,
                "presignProduce.mostRate": 100,
                "presignProduce.offset": 1765
            }
    
    .. method:: <I> updatePresignProduce
    
        更新预签产品
        
        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**
        
        判断预签产品状态为0(初始) , 其他状态 , 错误信息 **130081 预签产品不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignProduce.ppid: 预签产品ID
        :type presignProduce.ppid: Long
        :param presignProduce.name: 名称
        :type presignProduce.name: String
        :param presignProduce.version.qvid: 报价版本ID
        :type presignProduce.version.qvid: Long
        :param presignProduce.quotePrice: 起报价
        :type presignProduce.quotePrice: Long
        :param presignProduce.quoteArea: 起报面积
        :type presignProduce.quoteArea: Integer
        :param presignProduce.unitPrice: 计价单价
        :type presignProduce.unitPrice: Long
        :param presignProduce.discount: 折扣
        :type presignProduce.discount: Integer
        :param presignProduce.manageRate: 管理费比例
        :type presignProduce.manageRate: Integer
        :param presignProduce.manageFormula: 管理费公式
        :type presignProduce.manageFormula: String
        :param presignProduce.preferPrice: 优惠额
        :type presignProduce.preferPrice: Long
        :param presignProduce.costPrice: 成本单价
        :type presignProduce.costPrice: Long
        :param presignProduce.mostPrice: 主材成本
        :type presignProduce.mostPrice: Long
        :param presignProduce.profitRate: 利润率
        :type presignProduce.profitRate: Integer
        :param presignProduce.costRate: 工程增项成本比例
        :type presignProduce.costRate: Integer
        :param presignProduce.mostRate: 主材增项成本比例
        :type presignProduce.mostRate: Integer
        :param presignProduce.offset: 偏移量
        :type presignProduce.offset: Long
        
        Example::
        
            {
                "presignProduce.ppid": 1,
                "presignProduce.name": "预签产品",
                "presignProduce.version.qvid": 1,
                "presignProduce.quotePrice": 10000000,
                "presignProduce.quoteArea": 100000,
                "presignProduce.unitPrice": 100000,
                "presignProduce.discount": 1000,
                "presignProduce.manageRate": 1000,
                "presignProduce.manageFormula": "",
                "presignProduce.preferPrice": 0,
                "presignProduce.costPrice": 899000,
                "presignProduce.mostPrice": 20000000,
                "presignProduce.profitRate": 790,
                "presignProduce.costRate": 100,
                "presignProduce.mostRate": 790,
                "presignProduce.offset": 1765
            }
    
    .. method:: <I> updatePresignProduceForStatus
    
        更新预签产品状态
        
        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignProduce.ppid: 预签产品ID
        :type presignProduce.ppid: Long
        :param presignProduce.status: 状态
        :type presignProduce.status: Short
        
        Example::
        
            {
                "presignProduce.ppid": 1,
                "presignProduce.status": 0
            }
    
    .. method:: <I> copyPresignProduce
    
        复制预签产品
        
        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignProduce.ppid: 预签产品ID
        :type presignProduce.ppid: Long
        :param presignProduce.name: 产品名称
        :type presignProduce.name: String
        
        Example::
        
            {
                "presignProduce.ppid": 1,
                "presignProduce.name": "产品名称"
            }

价格
---------------------

.. class:: api.data.PresignPriceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: presignPrice
    
    :param pspid: 价格ID
    :type pspid: Long
    :param ppid: 预签产品ID
    :type ppid: Long
    :param name: 名称
    :type name: String
    :param upperArea: 起始面积
    :type upperArea: Integer
    :param lowerArea: 终止面积
    :type lowerArea: Integer
    :param price: 价格
    :type price: Long
    :param costPrice: 工程成本
    :type costPrice: Integer
    :param mostPrice: 主材成本
    :type mostPrice: Integer
    :param status: 状态
    :type status: Short
    
    .. method:: <I> pagePresignPrice
    
        分页方式获取预签价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 预签价格信息列表 , 每条数据类型 :data:`presignPrice`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pspid": 1,
                            "ppid": 1,
                            "name": "名称",
                            "upperArea": 10000,
                            "lowerArea": 10000,
                            "price": 10000,
                            "costPrice": 0,
                            "mostPrice": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> addPresignPrice
    
        添加预签价格
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignPrice.ppid: 预签产品ID
        :type presignPrice.ppid: Long
        :param presignPrice.name: 名称
        :type presignPrice.name: String
        :param presignProduce.upperArea: 起报价
        :type presignProduce.upperArea: Long
        :param presignProduce.lowerArea: 起报面积
        :type presignProduce.lowerArea: Integer
        :param presignProduce.price: 计价单价
        :type presignProduce.price: Long
        :param presignProduce.costPrice: 工程成本
        :type presignProduce.costPrice: Long
        :param presignProduce.mostPrice: 主材成本
        :type presignProduce.mostPrice: Long
        
        Example::
        
            {
                "presignProduce.ppid": 1,
                "presignProduce.name": "名称",
                "presignProduce.upperArea": 10000000,
                "presignProduce.lowerArea": 100000,
                "presignProduce.price": 100000,
                "presignProduce.costPrice": 0,
                "presignProduce.mostPrice": 0
            }

    .. method:: <I> updatePresignPrice
    
        更新预签价格
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignPrice.pspid: 预签价格ID
        :type presignPrice.pspid: Long
        :param presignPrice.name: 名称
        :type presignPrice.name: String
        :param presignProduce.upperArea: 起报价
        :type presignProduce.upperArea: Long
        :param presignProduce.lowerArea: 起报面积
        :type presignProduce.lowerArea: Integer
        :param presignProduce.price: 计价单价
        :type presignProduce.price: Long
        :param presignProduce.costPrice: 工程成本
        :type presignProduce.costPrice: Long
        :param presignProduce.mostPrice: 主材成本
        :type presignProduce.mostPrice: Long
        
        Example::
        
            {
                "presignProduce.pspid": 1,
                "presignProduce.name": "名称",
                "presignProduce.upperArea": 10000000,
                "presignProduce.lowerArea": 100000,
                "presignProduce.price": 100000,
                "presignProduce.costPrice": 0,
                "presignProduce.mostPrice": 0
            }

    .. method:: <I> updatePresignPriceForStatus
    
        更新预签价格
        
        判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignPrice.pspid: 预签价格ID
        :type presignPrice.pspid: Long
        :param presignPrice.status: 状态
        :type presignPrice.status: Short
        
        Example::
        
            {
                "presignProduce.pspid": 1,
                "presignProduce.status": 0
            }

    .. method:: <I> deletePresignPrice
    
        删除预签价格
        
        判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignPrice.pspid: 预签价格ID
        :type presignPrice.pspid: Long
        
        Example::
        
            {
                "presignProduce.pspid": 1
            }
    
项目
---------------------

.. class:: api.data.PresignItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: presignItem
    
    :param piid: 预签项ID
    :type piid: Long
    :param ppid: 预签产品ID
    :type ppid: Long
    :param name: 名称
    :type name: String
    :param basicNum: 基础量
    :type basicNum: Integer
    :param addPrice: 增补价
    :type addPrice: Integer
    :param price: 价格
    :type price: Integer
    :param subPrice: 退减价
    :type subPrice: Integer
    :param cost: 成本
    :type cost: Integer
    :param achePrice: 业绩
    :type achePrice: Integer
    :param areaCale: 面积规则 , 0: 数量 , 1: 面积
    :type areaCale: Short
    :param type: 类型 , 0: 功能区 , 1: 可选配 , 2: 个性 , 3: 赋能
    :type type: Short
    :param onetype: 一类 , 0: 标准 , 1: 标配 , 2: 标减
    :type onetype: Short
    :param atttype: 业务类型 , 0: 通用 , 1: 工程 , 2: 主材
    :type atttype: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param content: 说明
    :type content: String
    
    .. method:: <I> pagePresignItem
    
        分页方式获取预签项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.ppid: 预签产品ID
        :type presignItem.ppid: Long
        :param presignItem.status: 状态
        :type presignItem.status: Short
        
        :param types: 类型
        :type types: List
        
        Example::
        
            {
                "presignItem.ppid": 1,
                "presignItem.status": 1,
                
                "types[0]": 0,
                "types[1]": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 预签项列表 , 每条数据类型 :data:`presignItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "piid": 1,
                            "ppid": 1,
                            "name": "预签项",
                            "basicNum": 10000,
                            "addPrice": 1000,
                            "price": 799000,
                            "subPrice": 1000,
                            "cost": 1000,
                            "ache": 1000,
                            "areaCale": 0,
                            "type": 0,
                            "onetype": 0,
                            "atttype": 0,
                            "status": 0,
                            "content": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryPresignItemByPiid
    
        通过预签项ID获取预签项信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.piid: 预签项ID
        :type presignItem.piid: Long
        
        Example::
        
            {
                "presignItem.piid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param presignItem: 预签项 , 类型 :data:`presignItem`
        :type presignItem: Object
        
        Example::
        
            {
                ...
                "presignItem": {
                    "piid": 1,
                    "ppid": 1,
                    "name": "预签项",
                    "basicNum": 10000,
                    "addPrice": 1000,
                    "price": 799000,
                    "subPrice": 1000,
                    "cost": 1000,
                    "ache": 1000,
                    "areaCale": 0,
                    "type": 0,
                    "onetype": 0,
                    "atttype": 0,
                    "status": 0,
                    "content": "说明"
                }
                ...
            }
    
    .. method:: <I> addPresignItem
    
        添加预签项
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.ppid: 预签产品ID
        :type presignItem.ppid: Long
        :param presignItem.name: 名称
        :type presignItem.name: String
        :param presignItem.basicNum: 基础量
        :type presignItem.basicNum: Integer
        :param presignItem.addPrice: 增补价
        :type presignItem.addPrice: Integer
        :param presignItem.price: 价格
        :type presignItem.price: Integer
        :param presignItem.subPrice: 退减价
        :type presignItem.subPrice: Integer
        :param presignItem.cost: 成本
        :type presignItem.cost: Integer
        :param presignItem.ache: 业绩
        :type presignItem.ache: Integer
        :param presignItem.areaCale: 面积规则
        :type presignItem.areaCale: Short
        :param presignItem.type: 类型
        :type presignItem.type: Short
        :param presignItem.onetype: 一类
        :type presignItem.onetype: Short
        :param presignItem.atttype: 业务类型
        :type presignItem.atttype: Short
        :param presignItem.content: 说明
        :type presignItem.content: String
        
        Example::
        
            {
                "presignItem.ppid": 1,
                "presignItem.name": "预签产品",
                "presignItem.basicNum": 100000,
                "presignItem.addPrice": 1000,
                "presignItem.price": 10000000,
                "presignItem.subPrice": 1000,
                "presignItem.cost": 1000,
                "presignItem.ache": 1000,
                "presignItem.areaCale": 0,
                "presignItem.type": 0,
                "presignItem.onetype": 0,
                "presignItem.atttype": 0,
                "presignItem.content": "说明"
            }
    
    .. method:: <I> updatePresignItem
    
        更新预签项
        
        判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**
        
        判断预签项状态为0(启用) , 其他状态 , 错误信息 **130087 预签项不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.piid: 预签项ID
        :type presignItem.piid: Long
        :param presignItem.name: 名称
        :type presignItem.name: String
        :param presignItem.basicNum: 基础量
        :type presignItem.basicNum: Integer
        :param presignItem.addPrice: 增补价
        :type presignItem.addPrice: Integer
        :param presignItem.price: 价格
        :type presignItem.price: Integer
        :param presignItem.subPrice: 退减价
        :type presignItem.subPrice: Integer
        :param presignItem.cost: 成本
        :type presignItem.cost: Integer
        :param presignItem.ache: 业绩
        :type presignItem.ache: Integer
        :param presignItem.areaCale: 面积规则
        :type presignItem.areaCale: Short
        :param presignItem.type: 类型
        :type presignItem.type: Short
        :param presignItem.onetype: 一类
        :type presignItem.onetype: Short
        :param presignItem.atttype: 业务类型
        :type presignItem.atttype: Short
        :param presignItem.content: 说明
        :type presignItem.content: String
        
        Example::
        
            {
                "presignItem.piid": 1,
                "presignItem.name": "预签产品",
                "presignItem.basicNum": 100000,
                "presignItem.addPrice": 1000,
                "presignItem.price": 10000000,
                "presignItem.subPrice": 1000,
                "presignItem.cost": 1000,
                "presignItem.ache": 1000,
                "presignItem.areaCale": 0,
                "presignItem.type": 0,
                "presignItem.onetype": 0,
                "presignItem.atttype": 0,
                "presignItem.content": "说明"
            }
    
    .. method:: <I> updatePresignItemForStatus
    
        更新预签项状态
        
        判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.piid: 预签项ID
        :type presignItem.piid: Long
        :param presignItem.status: 状态
        :type presignItem.status: Short
        
        Example::
        
            {
                "presignItem.piid": 1,
                "presignItem.status": 0
            }
    
    .. method:: <I> deletePresignItem
    
        删除预签项
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignItem.piid: 预签项ID
        :type presignItem.piid: Long
        
        Example::
        
            {
                "presignItem.piid": 1
            }

成本
---------------------

.. class:: api.quotation.PresignCostAction
    
    +---------+
    |DataType:|
    +---------+
    
    .. data:: presignCost
    
    :param pcid: 成本ID
    :type pcid: Long
    :param ppid: 预签产品ID
    :type ppid: Long
    :param toplimit: 上限面积
    :type toplimit: Integer
    :param lowlimit: 下限面积
    :type lowlimit: Integer
    :param costPrice: 成本单价
    :type costPrice: Integer

    .. method:: <I> queryPresignCost
    
        通过预签产品获取成本信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignCost.ppid: 预签产品ID
        :type presignCost.ppid: Long
        
        Example::
        
            {
                "presignCost.ppid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param presignCosts: 预签成本列表 , 类型 :data:`presignCost`
        :type presignCosts: List
        
        Example::
        
            {
                ...
                "presignCosts":[
                    {
                        "pcid": 1,
                        "pid": 1,
                        "toplimit": 0,
                        "lowlimit": 0,
                        "costPrice": 0
                    }
                ],
                ...
            }

    .. method:: <I> addPresignCost
    
        添加预签成本
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignCost.ppid: 预签产品ID
        :type presignCost.ppid: Long
        :param presignCost.toplimit: 上限面积
        :type presignCost.toplimit: Integer
        :param presignCost.lowlimit: 下限面积
        :type presignCost.lowlimit: Integer
        :param presignCost.costPrice: 成本单价
        :type presignCost.costPrice: Integer
        
        Example::
        
            {
                "presignCost.ppid": 1
            }

    .. method:: <I> deletePresignCost
    
        删除预签成本
        
        +---------+
        |Requests:|
        +---------+
        
        :param presignCost.pcid: 成本ID
        :type presignCost.pcid: Long
        
        Example::
        
            {
                "presignCost.pcid": 1
            }

定额
================

共享工费
---------------------

.. class:: api.data.NormriceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: cormrice
    
    :param cpid: 定额工费ID
    :type cpid: Long
    :param constructionNode: 施工节点 , 类型 `constructionNode <./data.html#api.data.ConstructionNodeAction.constructionNode>`__
    :type constructionNode: Object
    :param quotationCtem: 共享项 , 类型 `quotationCtem <./data.html#api.data.QuotationItemAction.quotationCtem>`__
    :type quotationCtem: Object
    :param unit: 定额单位
    :type unit: String
    :param trannum: 转换量
    :type trannum: Integer
    :param salary: 薪资
    :type salary: Integer
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> pageCormrice
    
        分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 定额工费信息列表 , 每条数据类型 :data:`cormrice`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "npid": 1,
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白"
                            },
                            "quotationCtem": {
                                "qcid": 1,
                                "itemName": "原墙体建筑大白铲除",
                                "quotationTypeId": 1,
                                "quotationType": "标准",
                                "quotationClassification": "基础部分",
                                "quotationClassificationId": 1,
                                "quotationBigCategory": "基础部分",
                                "quotationBigno": 1,
                                "quotationSmallno": 11,
                                "quotationSmallCategory": "棚顶工程",
                                "measurementUnit": "米",
                                "measurementUnitId": 1,
                                "workTypeId": 1,
                                "workType": "力",
                                "quotationItemDes": "说明"
                            },
                            "unit": 米,
                            "trannum": 1,
                            "salary": 1000,
                            "status": 0
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryCormriceByQcid
    
        通过共享项ID获取定额工费信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param cormrice.quotationCtem.qcid: 共享项ID
        :type cormrice.quotationCtem.qcid: Long
        
        Example::
        
            {
                "cormrice.quotationCtem.qcid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param cormrices: 定额工费信息列表 , 每条数据类型 :data:`cormrice`
        :type cormrices: List
        
        Example::
        
            {
                ...
                "cormrices": [
                    {
                        "cpid": 1,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "quotationCtem": {
                            "qcid": 1,
                            "itemName": "原墙体建筑大白铲除",
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "workTypeId": 1,
                            "workType": "力",
                            "quotationItemDes": "说明"
                        },
                        "unit": 米,
                        "trannum": 1,
                        "salary": 1000,
                        "status": 0
                    },
                ],
                ...
            }
            
    .. method:: <I> addCormrice
    
        添加定额工费信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param cormrice.constructionNode.cnid: 施工节点ID
        :type cormrice.constructionNode.cnid: Long
        :param cormrice.quotationCtem.qcid: 报价项ID
        :type cormrice.quotationCtem.qcid: Long
        :param cormrice.salary: 薪资
        :type cormrice.salary: Integer
        
        Example::
        
            {
                "cormrice.constructionNode.cnid": 1,
                "cormrice.quotationCtem.qcid": 1,
                "cormrice.salary": 1000
            }
            
    .. method:: <I> deleteCormrice
    
        删除定额工费信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param cormrice.cpid: 定额工费ID
        :type cormrice.cpid: Long
        
        Example::
        
            {
                "cormrice.cpid": 1
            }

材料项
---------------------

.. class:: api.data.NormoodAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: normood
    
    :param ngid: 定额商品ID
    :type ngid: Long
    :param name: 名称
    :type name: String
    :param noods: 定材 , 类型 `noods <./data.html#api.data.NoodsAction.noods>`__
    :type noods: Object
    :param quotationItem: 报价项 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    :param normunit: 定额单位
    :type normunit: String
    :param normnum: 定额数量
    :type normnum: Integer
    :param storeunit: 库房单位
    :type storeunit: String
    :param storenum: 库房数量
    :type storenum: Integer
    :param price: 价格
    :type price: Integer
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> pageNormood
    
        分页方式获取定额材料信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 定额材料信息列表 , 每条数据类型 :data:`normood`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ngid": 1,
                            "name": "名称",
                            "noods": {
                                "nid": 1,
                                "name": "名称",
                                "selling": 1000,
                                "balance": 1000
                            },
                            "quotationItem": {
                                "qiid": 1,
                                "itemId": "QI00100",
                                "itemName": "原墙体建筑大白铲除",
                                "addPrice": 120,
                                "unitPrice": 100,
                                "subPrice": 80,
                                "status": 1,
                                "discount": 1,
                                "no": "QV001",
                                "version": "banben",
                                "quotationItemDes": "说明",
                                "measurementUnit": "米",
                                "measurementUnitId": 1,
                                "quotationTypeId": 1,
                                "quotationType": "标准",
                                "quotationClassification": "基础部分",
                                "quotationClassificationId": 1,
                                "quotationBigCategory": "基础部分",
                                "quotationBigno": 1,
                                "quotationSmallno": 11,
                                "quotationSmallCategory": "棚顶工程",
                                "workTypeId": 1,
                                "workType": "力"
                            },
                            "normunit": "米",
                            "normnum": 1000,
                            "storeunit": "个",
                            "storenum": 1000,
                            "price": 1000
                        },
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryNormoodByQiid
    
        通过报价项ID获取定额商品
        
        +---------+
        |Requests:|
        +---------+
        
        :param normood.quotationItem.qiid: 报价项ID
        :type normood.quotationItem.qiid: Long
        
        +--------+
        |Returns:|
        +--------+
        
        :param normoods: 定额商品信息列表 , 每条数据类型 :data:`normood`
        :type normoods: List
        
        Example::
        
            {
                ...
                "normoods": [
                    {
                        "ngid": 1,
                        "name": "名称",
                        "noods": {
                            "nid": 1,
                            "name": "名称",
                            "selling": 1000,
                            "balance": 1000
                        },
                        "quotationItem": {
                            "qiid": 1,
                            "itemId": "QI00100",
                            "itemName": "原墙体建筑大白铲除",
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "status": 1,
                            "discount": 1,
                            "no": "QV001",
                            "version": "banben",
                            "quotationItemDes": "说明",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "workTypeId": 1,
                            "workType": "力"
                        },
                        "normunit": "米",
                        "normnum": 1000,
                        "storeunit": "个",
                        "storenum": 1000,
                        "price": 1000
                    },
                ],
                ...
            }
            
    .. method:: <I> addNormood
    
        添加定额材料
    
        +---------+
        |Requests:|
        +---------+
        
        :param normood.name: 名称
        :type normood.name: String
        :param normood.noods.nid: 定材ID
        :type normood.noods.nid: Long
        :param normood.quotationItem.qiid: 报价项ID
        :type normood.quotationItem.qiid: Long
        :param normood.normunit: 定额单位
        :type normood.normunit: String
        :param normood.normnum: 定额数量
        :type normood.normnum: Integer
        :param normood.storeunit: 库房单位
        :type normood.storeunit: String
        :param normood.storenum: 库房数量
        :type normood.storenum: Integer
        :param normood.price: 价格
        :type normood.price: Integer
        
        Example::
        
            {
                "normood.name": "名称",
                "normood.noods.nid": 1,
                "normood.quotationItem.qiid": 1,
                "normood.normunit": "个",
                "normood.normnum": 1000,
                "normood.storeunit": "个",
                "normood.storenum": 1000,
                "normood.price": 1000
            }
            
    .. method:: <I> deleteNormood
    
        删除定额材料
        
        +---------+
        |Requests:|
        +---------+
        
        :param normood.ngid: 定额材料ID
        :type normood.ngid: Long
        
        Example::
        
            {
                "normood.ngid": 1
            }

工费项
---------------------

.. class:: api.data.NormriceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: normrice
    
    :param npid: 定额工费ID
    :type npid: Long
    :param constructionNode: 施工节点 , 类型 `constructionNode <./data.html#api.data.ConstructionNodeAction.constructionNode>`__
    :type constructionNode: Object
    :param quotationItem: 报价项 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    :param unit: 定额单位
    :type unit: String
    :param trannum: 转换量
    :type trannum: Integer
    :param salary: 薪资
    :type salary: Integer
    :param stuff: 材料费
    :type stuff: Integer
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> pageNormrice
    
        分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 定额工费信息列表 , 每条数据类型 :data:`normrice`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "npid": 1,
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白"
                            },
                            "quotationItem": {
                                "qiid": 1,
                                "itemId": "QI00100",
                                "itemName": "原墙体建筑大白铲除",
                                "addPrice": 120,
                                "unitPrice": 100,
                                "subPrice": 80,
                                "status": 1,
                                "discount": 1,
                                "no": "QV001",
                                "version": "banben",
                                "quotationItemDes": "说明",
                                "measurementUnit": "米",
                                "measurementUnitId": 1,
                                "quotationTypeId": 1,
                                "quotationType": "标准",
                                "quotationClassification": "基础部分",
                                "quotationClassificationId": 1,
                                "quotationBigCategory": "基础部分",
                                "quotationBigno": 1,
                                "quotationSmallno": 11,
                                "quotationSmallCategory": "棚顶工程",
                                "workTypeId": 1,
                                "workType": "力"
                            },
                            "trannum": 0,
                            "salary": 1000,
                            "stuff": 0
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryNormriceByQiid
    
        通过报价项ID获取定额工费
        
        +---------+
        |Requests:|
        +---------+
        
        :param normrice.quotationItem.qiid: 报价项ID
        :type normrice.quotationItem.qiid: Long
        
        Example::
        
            {
                "normrice.quotationItem.qiid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param normrices: 定额商品信息列表 , 每条数据类型 :data:`normrice`
        :type normrices: List
        
        Example::
        
            {
                ...
                "normrices": [
                    {
                        "npid": 1,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "quotationItem": {
                            "qiid": 1,
                            "itemId": "QI00100",
                            "itemName": "原墙体建筑大白铲除",
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "status": 1,
                            "discount": 1,
                            "no": "QV001",
                            "version": "banben",
                            "quotationItemDes": "说明",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "workTypeId": 1,
                            "workType": "力"
                        },
                        "trannum": 0,
                        "salary": 1000,
                        "stuff": 0
                    },
                ],
                ...
            }
            
    .. method:: <I> addNormrice
    
        添加定额薪资
    
        +---------+
        |Requests:|
        +---------+
        
        :param normrice.constructionNode.cnid: 施工节点ID
        :type normrice.constructionNode.cnid: Long
        :param normrice.quotationItem.qiid: 报价项ID
        :type normrice.quotationItem.qiid: Long
        :param normrice.trannum: 转换量
        :type normrice.trannum: Integer
        :param normrice.salary: 薪资
        :type normrice.salary: Integer
        :param normrice.stuff: 材料费
        :type normrice.stuff: Integer
        
        Example::
        
            {
                "normrice.constructionNode.cnid": 1,
                "normrice.quotationItem.qiid": 1,
                "normrice.trannum": 1000,
                "normrice.salary": 1000,
                "normrice.stuff": 1000
            }
            
    .. method:: <I> deleteNormrice
    
        删除定额薪资
        
        +---------+
        |Requests:|
        +---------+
        
        :param normrice.npid: 定额薪资ID
        :type normrice.npid: Long
        
        Example::
        
            {
                "normrice.npid": 1
            }

附加项
---------------------

针对于定额工费提供的基础数据

.. class:: api.data.NormaddAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: normadd
    
    :param naid: 附加项ID
    :type naid: Long
    :param name: 名称
    :type name: String
    :param constructionNode: 施工节点 , 类型 `constructionNode <./data.html#api.data.ConstructionNodeAction.constructionNode>`__
    :type constructionNode: Object
    :param unit: 单位
    :type unit: String
    :param price: 单价
    :type price: Integer
    :param stuff: 材料费
    :type stuff: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageNormadd
    
        分页方式获取附加项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 附加项信息列表 , 每条数据类型 :data:`normadd`
        :type paging.data: List
    
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "naid": 1,
                            "name": "D001",
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白"
                            },
                            "unit": "米",
                            "price": 1000,
                            "stuff": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryNormadd
    
        获取附加项信息 , 可通过施工节点进行控制
        
        +---------+
        |Requests:|
        +---------+
        
        :param normadd.constructionNode.cnid: 节点ID
        :type normadd.constructionNode.cnid: Long
        
        Example::
        
            {
                "normadd.constructionNode.cnid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param normadds: 附加项信息列表 , 每条数据类型 :data:`normadd`
        :type normadds: List
    
        Example::
        
            {
                ...
                "normadds": [
                    {
                        "aiid": 1,
                        "name": "D001",
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "unit": "米",
                        "price": 1000,
                        "stuff": 0
                    }
                ],
                ...
            }

    .. method:: <I> addNormadd
    
        添加附加项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normadd.name: 名称
        :type normadd.name: String
        :param normadd.constructionNode.cnid: 节点ID
        :type normadd.constructionNode.cnid: Long
        :param normadd.unit: 单位
        :type normadd.unit: String
        :param normadd.price: 单价
        :type normadd.price: Integer
        :param normadd.stuff: 材料费
        :type normadd.stuff: Integer
        
        Example::
        
            {
                "normadd.name": "名称",
                "normadd.constructionNode.cnid": 1,
                "normadd.unit": "米",
                "normadd.price": 1000,
                "normadd.stuff": 0
            }

    .. method:: <I> updateNormaddForStatus
    
        更新附加项状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param normadd.aiid: 附加项ID
        :type normadd.aiid: Long
        :param normadd.status: 状态
        :type normadd.status: Short
        
        Example::
        
            {
                "normadd.aiid": 1,
                "normadd.status": 0
            }
            
    .. method:: deleteNormadd
    
        删除附加项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normadd.aiid: 附加项ID
        :type normadd.aiid: Long
        
        Example::
        
            {
                "normadd.aiid": 1
            }

打包项
---------------------

针对于定额材料提供的基础数据

.. class:: api.data.NormpackAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: normpack
    
    :param npid: 打包项ID
    :type npid: Long
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    
    .. data:: normpackItem
    
    :param npiid: 打包项ID
    :type npiid: Long
    :param npid: 打包项ID
    :type npid: Long
    :param noods: 定材 , 类型 `noods <./data.html#api.data.NoodsAction.noods>`__
    :type noods: Object
    :param normunit: 定额单位
    :type normunit: String
    :param normnum: 定额数量
    :type normnum: Integer
    :param storeunit: 库房单位
    :type storeunit: String
    :param storenum: 数量
    :type storenum: Integer
    :param price: 价格
    :type price: Integer
    
    .. method:: <I> pageNormpack
    
        分页方式获取打包项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 打包项信息列表 , 每条数据类型 :data:`normpack`
        :type paging.data: List
    
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "npid": 1,
                            "name": "D001",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryNormpack
    
        获取打包项信息 , 可通过施工节点进行控制

        +--------+
        |Returns:|
        +--------+
        
        :param normpacks: 打包项信息列表 , 每条数据类型 :data:`normpack`
        :type normpacks: List
    
        Example::
        
            {
                ...
                "normpacks": [
                    {
                        "npid": 1,
                        "name": "D001",
                        "status": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryNormpackItem
    
        获取打包项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpack.npid: 打包项ID
        :type normpack.npid: Long
        
        Example::
        
            {
                "normpack.npid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param normpackItems: 打包项信息列表 , 每条数据类型 :data:`normpackItem`
        :type normpackItems: List
    
        Example::
        
            {
                ...
                "normpackItems": [
                    {
                        "npiid": 1,
                        "name": "名称",
                        "noods": {
                            "nid": 1,
                            "name": "名称",
                            "selling": 1000,
                            "balance": 1000
                        },
                        "normunit": "个",
                        "normnum": 1000,
                        "storeunit": "米",
                        "storenum": 1000,
                        "price": 1000
                    }
                ],
                ...
            }

    .. method:: <I> addNormpack
    
        添加打包项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpack.name: 名称
        :type normpack.name: String
        
        Example::
        
            {
                "normpack.name": "名称"
            }

    .. method:: <I> addNormpackItem
    
        添加打包项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpackItem.npid: 打包项ID
        :type normpackItem.npid: Long
        :param normpackItem.noods.nid: 定材ID
        :type normpackItem.noods.nid: Long
        :param normpackItem.normunit: 定额单位
        :type normpackItem.normunit: String
        :param normpackItem.normnum: 定额数量
        :type normpackItem.normnum: Integer
        :param normpackItem.storeunit: 库房单位
        :type normpackItem.storeunit: String
        :param normpackItem.storenum: 数量
        :type normpackItem.storenum: Integer
        :param normpackItem.price: 价格
        :type normpackItem.price: Integer
        
        Example::
        
            {
                "normpackItem.npid": 1,
                "normpackItem.noods.nid": 1,
                "normpackItem.normunit": 10000,
                "normpackItem.normnum": "个",
                "normpackItem.storeunit": 10000,
                "normpackItem.storenum": 10000,
                "normpackItem.price": 1000
            }

    .. method:: <I> updateNormpackForStatus
    
        更新打包项状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpack.npid: 打包项ID
        :type normpack.npid: Long
        :param normpack.status: 状态
        :type normpack.status: Short
        
        Example::
        
            {
                "normpack.npid": 1,
                "normpack.status": 0
            }
            
    .. method:: deleteNormpack
    
        删除打包项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpack.npid: 打包项ID
        :type normpack.npid: Long
        
        Example::
        
            {
                "normpack.npid": 1
            }

    .. method:: deleteNormpackItem
    
        删除打包项
        
        +---------+
        |Requests:|
        +---------+
        
        :param normpackItem.npiid: 打包项ID
        :type normpackItem.npiid: Long
        
        Example::
        
            {
                "normpackItem.npiid": 1
            }

信息
================

任务
---------------------

.. class:: api.communion.TaskAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: task

    :param tid: 任务ID
    :type tid: Long
    :param name: 名称
    :type name: String
    :param filepath: 执行文件路径
    :type filepath: String
    :param level: 等级 , 0: 功能级 , 1: 模块级
    :type level: Short
    :param type: 类型 , 0: python, 1: shell
    :type type: Short
    :param handle: 操作 , 0: 读 , 1: 写
    :type handle: Short
    :param server: 服务
    :type server: Integer
    :param week: 星期
    :type week: String
    :param day: 天数
    :type day: String
    :param hour: 小时
    :type hour: String
    :param plugins: 控件 , A: 时间区间, B: 月份区间, C: 上传附件, D: 自定义参数
    :type plugins: String
    :param keyword: 关键字
    :type keyword: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param isShow: 显示标识 , 0: 显示 , 1: 不显示
    :type isShow: Short
    :param comment: 说明
    :type comment: String
    
    .. data:: taskParam

    :param tpid: 字段ID
    :type tpid: Long
    :param tid: 任务ID
    :type tid: Long
    :param no: 编号
    :type no: Integer
    :param name: 名称
    :type name: String
    :param table: 表名
    :type table: String
    :param union: 关联
    :type union: String
    :param param: 字段
    :type param: String
    :param alias: 别名
    :type alias: String
    :param type: 类型 , 0: 文本 , 1: 数值
    :type type: Short
    :param handle: 处理过程
    :type handle: String
    :param status: 状态
    :type status: Short
    :param sort: 排序
    :type sort: Integer
    :param comment: 备注
    :type comment: String
    
    .. method:: <I> pageTask
    
        分页方式获取任务信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 任务信息列表 , 每条数据类型 :data:`task`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "tid": 1,
                            "name": "任务",
                            "filepath": "/fanglin/task/execution.py",
                            "level": 0,
                            "type": 1,
                            "handle": 0,
                            "server": 0,
                            "week": "",
                            "day": "",
                            "hour": "",
                            "plugins": "A",
                            "keyword": "Exports",
                            "status": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryTask
    
        获取当前任务信息 , 状态为0(启用) , 显示标识为0(显示)
        
        +--------+
        |Returns:|
        +--------+
        
        :param tasks: 任务信息列表 , 每条数据类型 :data:`task`
        :type tasks: List
        
        Example::
        
            {
                ...
                "tasks": [
                    {
                        "tid": 1,
                        "name": "任务",
                        "filepath": "/fanglin/task/execution.py",
                        "level": 0,
                        "type": 1,
                        "handle": 0,
                        "server": 0,
                        "week": "",
                        "day": "",
                        "hour": "",
                        "plugins": "A",
                        "keyword": "Exports",
                        "comment": ""
                    }
                ],
                ...
            }

    .. method:: <I> queryTaskForSelf
    
        获取当前操作系统用户任务信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param tasks: 任务信息列表 , 每条数据类型 :data:`task`
        :type tasks: List
        
        Example::
        
            {
                ...
                "tasks": [
                    {
                        "tid": 1,
                        "name": "任务",
                        "filepath": "/fanglin/task/execution.py",
                        "level": 0,
                        "type": 1,
                        "handle": 0,
                        "server": 0,
                        "week": "",
                        "day": "",
                        "hour": "",
                        "plugins": "A",
                        "keyword": "Exports",
                        "comment": ""
                    }
                ],
                ...
            }

    .. method:: <I> queryTaskByRid
    
        通过角色ID获取任务信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param role.rid: 角色ID
        :type role.rid: String
        
        Example::
        
            {
                "role.rid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param tasks: 任务信息列表 , 每条数据类型 :data:`task`
        :type tasks: List
        
        Example::
        
            {
                ...
                "tasks": [
                    {
                        "tid": 1,
                        "name": "任务",
                        "filepath": "/fanglin/task/execution.py",
                        "level": 0,
                        "type": 1,
                        "handle": 0,
                        "server": 0,
                        "week": "",
                        "day": "",
                        "hour": "",
                        "plugins": "A",
                        "keyword": "Exports",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <C> addTask
    
        添加任务
        
        +---------+
        |Requests:|
        +---------+
        
        :param task.name: 名称
        :type task.name: String
        :param task.filepath: 文件路径 , 绝对路径
        :type task.filepath: String
        :param task.level: 级别
        :type task.level: Short
        :param task.type: 类型
        :type task.type: Short
        :param task.handle: 操作
        :type task.handle: Short
        :param task.plugins: 控件
        :type task.plugins: String
        :param task.keyword: 关键字
        :type task.keyword: String
        :param task.comment: 关键字
        :type task.comment: String
        
        Example::
        
            {
                "task.name": "1601010001",
                "task.filepath": "/fanglin/task/execution.py",
                "task.level": 0,
                "task.type": 1,
                "task.handle": 0,
                "task.plugins": "A",
                "task.keyword": "Exports",
                "task.comment": ""
            }
            
    .. method:: <C> updateTaskForStatus
        
        更新任务状态
        
        判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param task.tid: 任务ID
        :type task.tid: Long
        :param task.status: 状态
        :type task.status: Short
        
        Example::
        
            {
                "task.tid": 1,
                "task.status": 0
            }

    .. method:: <C> updateTaskForIsShow
    
        更新任务可见
        
        判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param task.tid: 任务ID
        :type task.tid: Long
        :param task.isShow: 可见
        :type task.isShow: Short
        
        Example::
        
            {
                "task.tid": 1,
                "task.isShow": 0
            }

    .. method:: <C> updateRoleTask
    
        更新角色对应任务信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param role.rid: 角色ID
        :type role.rid: Long
        :param task.tid: 任务ID
        :type task.tid: Long
        
        Example::
        
            {
                "role.rid": 1,
                "task.tid": 1
            }

    .. method:: <C> deleteRoleTask
    
        删除角色对应任务信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param role.rid: 角色ID
        :type role.rid: Long
        :param task.tid: 任务ID
        :type task.tid: Long
        
        Example::
        
            {
                "role.rid": 1,
                "task.tid": 1
            }

    .. method:: <C> pageTaskParam
    
        分页方式获取任务字段信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 任务字段信息列表 , 每条数据类型 :data:`taskParam`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "tpid": 1,
                            "tid": 1,
                            "no": 1,
                            "name": "字段",
                            "table": "table",
                            "union": "union",
                            "param": "param",
                            "alias": "alias",
                            "type": 1,
                            "handle": "handle",
                            "status": 0,
                            "sort": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <C> queryTaskParam
    
        获取任务字段
        
        +---------+
        |Requests:|
        +---------+
        
        :param task.tid: 任务ID
        :type task.tid: Long
        
        Example::
        
            {
                "task.tid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param taskParams: 任务字段信息列表 , 每条数据类型 :data:`taskParam`
        :type taskParams: List
        
        Example::
        
            {
                ...
                "taskParams": [
                    {
                        "tpid": 1,
                        "tid": 1,
                        "no": 1,
                        "name": "字段",
                        "table": "table",
                        "union": "union",
                        "param": "param",
                        "alias": "alias",
                        "type": 1,
                        "handle": "handle",
                        "status": 0,
                        "sort": 0,
                        "comment": "说明"
                    }
                ],
                ...
            }

    .. method:: <C> addTaskParam
    
        添加任务字段
        
        +---------+
        |Requests:|
        +---------+
        
        :param taskParam.tid: 任务ID
        :type taskParam.tid: Long
        :param taskParam.no: 编号
        :type taskParam.no: Integer
        :param taskParam.name: 名称
        :type taskParam.name: String
        :param taskParam.table: 表名
        :type taskParam.table: String
        :param taskParam.union: 关联
        :type taskParam.union: String
        :param taskParam.param: 字段
        :type taskParam.param: String
        :param taskParam.alias: 别名
        :type taskParam.alias: String
        :param taskParam.type: 类型
        :type taskParam.type: Short
        :param taskParam.handle: 处理过程
        :type taskParam.handle: String
        :param taskParam.sort: 排序
        :type taskParam.sort: Integer
        :param taskParam.comment: 说明
        :type taskParam.comment: String
        
        Example::
        
            {
                "taskParam.tid": 1,
                "taskParam.no": 1,
                "taskParam.name": "名称",
                "taskParam.table": "table",
                "taskParam.union": "union",
                "taskParam.param": "param",
                "taskParam.alias": "alias",
                "taskParam.type": 1,
                "taskParam.handle": "handle",
                "taskParam.sort": 1,
                "taskParam.comment": "说明",
            }
            
    .. method:: <C> updateTaskParam
    
        更新任务字段
        
        +---------+
        |Requests:|
        +---------+
        
        :param taskParam.tpid: 任务字段ID
        :type taskParam.tpid: Long
        :param taskParam.tid: 任务ID
        :type taskParam.tid: Long
        :param taskParam.no: 编号
        :type taskParam.no: Integer
        :param taskParam.name: 名称
        :type taskParam.name: String
        :param taskParam.table: 表名
        :type taskParam.table: String
        :param taskParam.union: 关联
        :type taskParam.union: String
        :param taskParam.param: 字段
        :type taskParam.param: String
        :param taskParam.alias: 别名
        :type taskParam.alias: String
        :param taskParam.type: 类型
        :type taskParam.type: Short
        :param taskParam.handle: 处理过程
        :type taskParam.handle: String
        :param taskParam.sort: 排序
        :type taskParam.sort: Integer
        :param taskParam.comment: 说明
        :type taskParam.comment: String
        
        Example::
        
            {
                "taskParam.tpid": 1,
                "taskParam.tid": 1,
                "taskParam.no": 1,
                "taskParam.name": "名称",
                "taskParam.table": "table",
                "taskParam.union": "union",
                "taskParam.param": "param",
                "taskParam.alias": "alias",
                "taskParam.type": 1,
                "taskParam.handle": "handle",
                "taskParam.sort": 1,
                "taskParam.comment": "说明",
            }
            
    .. method:: <C> updateTaskParamForStatus
    
        更新任务字段状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param taskParam.tpid: 任务字段ID
        :type taskParam.tpid: Long
        :param taskParam.status: 状态
        :type taskParam.status: Short

        Example::
        
            {
                "taskParam.tpid": 1,
                "taskParam.status": 1
            }
            
    .. method:: <C> deleteTaskParam
    
        删除任务字段
        
        +---------+
        |Requests:|
        +---------+
        
        :param taskParam.tpid: 任务字段ID
        :type taskParam.tpid: Long

        Example::
        
            {
                "taskParam.tpid": 1
            }

工程
================

施工节点
----------------

.. class:: api.data.ConstructionNodeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: constructionNode
    
    :param cnid: 节点ID
    :type cnid: Long
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    :param precheck: 开工验证付款比例
    :type precheck: Integer
    :param postcheck: 完工验证付款比例
    :type postcheck: Integer
    :param stacheck: 开工验证销售比例
    :type stacheck: Integer
    :param fincheck: 完工验证销售比例
    :type fincheck: Integer
    :param startalk: 开工话术
    :type startalk: String
    :param endtalk: 完工话术
    :type endtalk: String
    :param startSurvey: 开工调研模版 , 类型 `surveyTemplate <./data.html#api.data.SurveyTemplateAction.surveyTemplate>`__
    :type startSurvey: Object
    :param endSurvey: 完工调研模版 , 类型 `surveyTemplate <./data.html#api.data.SurveyTemplateAction.surveyTemplate>`__
    :type endSurvey: Object
    :param timeLimit: 工期
    :type timeLimit: Integer
    :param sort: 排序
    :type sort: Short
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    
    .. method:: <I> pageConstructionNode
    
        分页方式获取工程节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 工程节点信息列表 , 每条数据类型 :data:`constructionNode`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cnid": 2,
                            "name": "铲大白",
                            "sort": 0,
                            "precheck": 0,
                            "postcheck": 0,
                            "stacheck": 0,
                            "fincheck": 0,
                            "startalk": "开工话术",
                            "endtalk": "完工话术",
                            "timeLimit": 10,
                            "startSurvey": {
                                "stid": 1,
                                "name": "模版",
                                "status": 0
                            },
                            "endSurvey": {
                                "stid": 1,
                                "name": "模版",
                                "status": 0
                            },
                            "kino": "",
                            "kiname": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryConstructionNode
    
        获取工程节点信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param constructionNodes: 工程节点信息列表 , 每条数据类型 :data:`constructionNode`
        :type constructionNodes: List
        
        Example::
        
            {
                ...
                "constructionNodes": [
                    {
                        "cnid": 2,
                        "name": "铲大白",
                        "sort": 0,
                        "precheck": 0,
                        "postcheck": 0,
                        "stacheck": 0,
                        "fincheck": 0,
                        "startalk": "开工话术",
                        "endtalk": "完工话术",
                        "timeLimit": 10,
                        "startSurvey": {
                            "stid": 1,
                            "name": "模版",
                            "status": 0
                        },
                        "endSurvey": {
                            "stid": 1,
                            "name": "模版",
                            "status": 0
                        },
                        "kino": "",
                        "kiname": ""
                    }
                ],
                ...
            }

    .. method:: <I> queryConstructionNodeByCnid
    
        通过工程节点ID获取信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionNode.cnid: 工程节点ID
        :type constructionNode.cnid: Long
        
        Example::
        
            {
                "constructionNode.cnid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param constructionNode: 工程节点信息 , 类型 :data:`constructionNode`
        :type constructionNode: Object
        
        Example::
        
            {
                ...
                "constructionNode": {
                    "cnid": 2,
                    "name": "铲大白",
                    "sort": 0,
                    "precheck": 0,
                    "postcheck": 0,
                    "stacheck": 0,
                    "fincheck": 0,
                    "startalk": "开工话术",
                    "endtalk": "完工话术",
                    "timeLimit": 10,
                    "startSurvey": {
                        "stid": 1,
                        "name": "模版",
                        "status": 0
                    },
                    "endSurvey": {
                        "stid": 1,
                        "name": "模版",
                        "status": 0
                    },
                    "kino": "",
                    "kiname": ""
                },
                ...
            }
            
    .. method:: <I> queryConstructionNodeByOrderId
    
        通过装修单归属公司 , 获取对应的工程节点信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param orderId: 装修单号
        :type orderId: String
        
        Example::
        
            {
                "orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param constructionNodes: 工程节点信息列表 , 每条数据类型 :data:`constructionNode`
        :type constructionNodes: List
        
        Example::
        
            {
                ...
                "constructionNodes": [
                    {
                        "cnid": 2,
                        "name": "铲大白",
                        "sort": 0,
                        "precheck": 0,
                        "postcheck": 0,
                        "stacheck": 0,
                        "fincheck": 0,
                        "startalk": "开工话术",
                        "endtalk": "完工话术",
                        "timeLimit": 10,
                        "startSurvey": {
                            "stid": 1,
                            "name": "模版",
                            "status": 0
                        },
                        "endSurvey": {
                            "stid": 1,
                            "name": "模版",
                            "status": 0
                        },
                        "kino": "",
                        "kiname": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> addConstructionNode
    
        添加工程节点信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param constructionNode.name: 名称
        :type constructionNode.name: String
        :param constructionNode.precheck: 开工验证付款比例
        :type constructionNode.precheck: Integer
        :param constructionNode.postcheck: 开工验证付款比例
        :type constructionNode.postcheck: Integer
        :param constructionNode.stacheck: 开工验证销售比例
        :type constructionNode.stacheck: Integer
        :param constructionNode.fincheck: 完工验证销售比例
        :type constructionNode.fincheck: Integer
        :param constructionNode.startalk: 开工话术
        :type constructionNode.startalk: String
        :param constructionNode.endtalk: 完工话术
        :type constructionNode.endtalk: String
        :param constructionNode.timeLimit: 工期
        :type constructionNode.timeLimit: Integer
        :param constructionNode.startSurvey.stid: 开工调研模版ID
        :type constructionNode.startSurvey.stid: Long
        :param constructionNode.endSurvey.stid: 完工调研模版ID
        :type constructionNode.endSurvey.stid: Long
        :param constructionNode.kino: 金蝶编号
        :type constructionNode.kino: String
        :param constructionNode.kiname: 金蝶名称
        :type constructionNode.kiname: String
        
        Example::
        
            {
                "constructionNode.name": "节点名称",
                "constructionNode.precheck": 0,
                "constructionNode.postcheck": 100,
                "constructionNode.stacheck": 0,
                "constructionNode.fincheck": 0,
                "constructionNode.startalk": "开工话术",
                "constructionNode.endtalk": "完工话术",
                "constructionNode.timeLimit": 10,
                "constructionNode.startSurvey.stid": 1,
                "constructionNode.endSurvey.stid": 1,
                "constructionNode.kino": "",
                "constructionNode.kiname": ""
            }
            
    .. method:: <I> updateConstructionNode
    
        更新工程节点信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionNode.cnid: 节点ID
        :type constructionNode.cnid: Long
        :param constructionNode.precheck: 开工验证款比例
        :type constructionNode.precheck: Integer
        :param constructionNode.postcheck: 完工验证款比例
        :type constructionNode.postcheck: Integer
        :param constructionNode.stacheck: 开工验证销售比例
        :type constructionNode.stacheck: Integer
        :param constructionNode.fincheck: 完工验证销售比例
        :type constructionNode.fincheck: Integer
        :param constructionNode.startalk: 开工话术
        :type constructionNode.startalk: String
        :param constructionNode.endtalk: 完工话术
        :type constructionNode.endtalk: String
        :param constructionNode.timeLimit: 工期
        :type constructionNode.timeLimit: Integer
        :param constructionNode.startSurvey.stid: 开工调研模版ID
        :type constructionNode.startSurvey.stid: Long
        :param constructionNode.endSurvey.stid: 完工调研模版ID
        :type constructionNode.endSurvey.stid: Long
        :param constructionNode.kino: 金蝶编号
        :type constructionNode.kino: String
        :param constructionNode.kiname: 金蝶名称
        :type constructionNode.kiname: String
        
        Example::
        
            {
                "constructionNode.cnid": 1,
                "constructionNode.precheck": 0,
                "constructionNode.postcheck": 200,
                "constructionNode.stacheck": 0,
                "constructionNode.fincheck": 0,
                "constructionNode.startalk": "开工话术",
                "constructionNode.endtalk": "完工话术",
                "constructionNode.timeLimit": 10,
                "constructionNode.startSurvey.stid": 1,
                "constructionNode.endSurvey.stid": 1
                "constructionNode.kino": "",
                "constructionNode.kiname": ""
            }

    .. method:: <I> updateConstructionNodeForStatus
    
        更新工程节点状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionNode.cnid: 节点ID
        :type constructionNode.cnid: Long
        :param constructionNode.status: 状态
        :type constructionNode.status: Short
        
        Example::
        
            {
                "constructionNode.cnid": 1,
                "constructionNode.status": 0
            }

施工计划
----------------

.. class:: api.data.ConstructionPaceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: constructionPace
    
    :param cpid: 计划ID
    :type cpid: Long
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    :param content: 说明
    :type content: String
    
    .. method:: <I> pageConstructionPace
    
        分页方式获取施工计划信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 施工计划信息列表 , 每条数据类型 :data:`constructionPace`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cpid": 1,
                            "name": "计划",
                            "content": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryConstructionPace
    
        获取工程计划信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param constructionPaces: 施工计划信息列表 , 每条数据类型 :data:`constructionPace`
        :type constructionPaces: List
        
        Example::
        
            {
                ...
                "constructionPaces": [
                    {
                        "cpid": 1,
                        "name": "计划",
                        "content": "说明"
                    }
                ],
                ...
            }

    .. method:: <I> addConstructionPace
    
        添加工程计划
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionPace.name: 名称
        :type constructionPace.name: String
        :param constructionPace.content: 说明
        :type constructionPace.content: String
        
        Example::
        
            {
                "constructionPace.name": "计划",
                "constructionPace.content": "说明"
            }

    .. method:: <I> updateConstructionPace
    
        更新工程计划
        
        判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionPace.cpid: 计划ID
        :type constructionPace.cpid: Long
        :param constructionPace.name: 名称
        :type constructionPace.name: String
        :param constructionPace.content: 说明
        :type constructionPace.content: String
        
        Example::
        
            {
                "constructionPace.cpid": 1,
                "constructionPace.name": "计划",
                "constructionPace.content": "说明"
            }

    .. method:: <I> updateConstructionPaceForStatus
    
        更新工程计划状态
        
        判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionPace.cpid: 计划ID
        :type constructionPace.cpid: Long
        :param constructionPace.status: 状态
        :type constructionPace.status: String
        
        Example::
        
            {
                "constructionPace.cpid": 1,
                "constructionPace.status": 0
            }

放线小组
----------------

.. class:: api.data.DrawlineGroup

    +---------+
    |DataType:|
    +---------+
    
    .. data:: drawlineGroup
    
    :param dgid: ID
    :type dgid: Long
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1:禁用
    :type status: Short
    :param content: 说明
    :type content: String
    :param company: 公司ID
    :type company: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param groupName: 名称
    :type groupName: String
    
    .. method:: <C/I> pageDrawlineGroup
    
        分页方式获取放线小组信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 放线信息列表 , 每条数据类型 :data:`drawlineGroup`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "dgid": 1,
                            "name": "放线一组",
                            "content": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <C/I> queryDrawlineGroup
    
        获取状态为启用的放线小组信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param drawlineGroups: 放线信息列表 , 每条数据类型 :data:`drawlineGroup`
        :type drawlineGroups: List
        
        Example::
        
            {
                ...
                "drawlineGroups": [
                    {
                        "dgid": 1,
                        "name": "放线一组",
                        "content": "说明"
                    }
                ],
                ...
            }
            
    .. method:: <C> addDrawlineGroup
    
        添加放线小组信息
        
        判断放线小组名称是否存在 , 已经存在 , 错误信息 **130009 防线小组已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param drawline.name: 名称
        :type drawline.name: String
        :param drawline.content: 说明
        :type drawline.content: String
        
        Example::
        
            {
                "drawline.name": "放线一组",
                "drawline.content": "说明"
            }
            
    .. method:: <C> updateDrawlineGroup
    
        更新放线小组信息
        
        判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param drawline.dgid: ID
        :type drawline.dgid: Long
        :param drawline.name: 名称
        :type drawline.name: String
        :param drawline.content: 说明
        :type drawline.content: String
        
        Example::
        
            {
                "drawline.dgid": 1,
                "drawline.name": "放线一组",
                "drawline.content": "说明"
            }
            
    .. method:: <C> updateDrawlineGroupForStatus
    
        更新放线小组状态 , 实现于启用/禁用
        
        判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param drawline.dgid: ID
        :type drawline.dgid: Long
        :param drawline.status: 状态
        :type drawline.status: Short
        
        Example::
        
            {
                "drawline.dgid": 1,
                "drawline.status": 1
            }

工程成本
----------------

.. class:: api.data.ConstructionCostAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: constructionCost
    
    :param ccid: 成本ID
    :type ccid: Long
    :param name: 名称
    :type name: String
    :param areaLeft: 起始面积
    :type areaLeft: Integer
    :param areaRight: 终止面积
    :type areaRight: Integer
    :param accessory: 辅料额
    :type accessory: Long
    :param salary: 工费额
    :type salary: Long
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    :param sort: 排序
    :type sort: Short
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageConstructionCost
    
        分页方式获取工程成本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 工程成本信息列表 , 每条数据类型 :data:`constructionCost`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ccid": 1,
                            "name": "工程成本",
                            "areaLeft": 60000,
                            "areaRight": 69000,
                            "accessory": 12000000,
                            "salary": 60000000,
                            "sort": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryConstructionCost
    
        获取工程成本信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param constructionCosts: 工程成本信息列表 , 每条数据类型 :data:`constructionCost`
        :type constructionCosts: List
        
        Example::
        
            {
                ...
                "constructionCosts": [
                    {
                        "ccid": 1,
                        "name": "工程成本",
                        "areaLeft": 60000,
                        "areaRight": 69000,
                        "accessory": 12000000,
                        "salary": 60000000,
                        "sort": 0
                    }
                ],
                ...
            }

    .. method:: <I> addConstructionCost
    
        添加工程成本信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param constructionCost.name: 名称
        :type constructionCost.name: String
        :param constructionCost.areaLeft: 开工验证款比例
        :type constructionCost.areaLeft: Integer
        :param constructionCost.areaRight: 完工验证款比例
        :type constructionCost.areaRight: Integer
        :param constructionCost.accessory: 辅料额
        :type constructionCost.accessory: Long
        :param constructionCost.salary: 工费额
        :type constructionCost.salary: Long
        
        Example::
        
            {
                "constructionCost.name": "节点名称",
                "constructionCost.areaLeft": 60000,
                "constructionCost.areaRight": 69000,
                "constructionCost.accessory": 12000000,
                "constructionCost.salary": 60000000,
            }
            
    .. method:: <I> updateConstructionCost
    
        更新工程成本信息
        
        判断工程成本是否存在 , 不存在 , 错误信息 **120029 工程成本不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionCost.cnid: 成本ID
        :type constructionCost.cnid: Long
        :param constructionCost.name: 名称
        :type constructionCost.name: String
        :param constructionCost.areaLeft: 起始面积
        :type constructionCost.areaLeft: Integer
        :param constructionCost.areaRight: 终止面积
        :type constructionCost.areaRight: Integer
        :param constructionCost.accessory: 辅料额
        :type constructionCost.accessory: Long
        :param constructionCost.salary: 工费额
        :type constructionCost.salary: Long
        
        Example::
        
            {
                "constructionCost.ccid": 1,
                "constructionCost.name": "节点名称",
                "constructionCost.areaLeft": 60000,
                "constructionCost.areaRight": 69000,
                "constructionCost.accessory": 12000000,
                "constructionCost.salary": 60000000,
            }

    .. method:: <I> updateConstructionCostForStatus
    
        更新工程成本状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionCost.ccid: 成本ID
        :type constructionCost.ccid: Long
        :param constructionCost.status: 状态
        :type constructionCost.status: Short
        
        Example::
        
            {
                "constructionCost.ccid": 1,
                "constructionCost.status": 0
            }
            
辅材成本
----------------

.. class:: api.data.AoodsCostAction

    .. data:: aoodsCost
    
    :param acid: 辅材成本ID
    :type acid: Long
    :param aoods: 辅材 , 类型 `aoods <./data.html#api.data.AoodsAction.aoods>`__
    :type aoods: Object
    :param constructionCost: 工程成本 , 类型 `constructionCost <./data.html#api.data.ConstructionCostAction.constructionCost>`__
    :type constructionCost: Object
    :param numLimit: 数量上限
    :type numLimit: Integer
    
    .. method:: <I> pageAoodsCost
    
        分页方式获取辅材成本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 辅材成本信息列表 , 每条数据类型 :data:`aoodsCost`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aoods": {
                                "aid": 1,
                                "name": "辅材",
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
                                    "pinyin": "cizhuan",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个",
                                    "purchase": 100000,
                                    "selling": 10000,
                                    "pieceNum": 1,
                                    "type": 0,
                                    "company": 0
                                },
                                "type": {
                                    "atid": 1,
                                    "name": "墙面",
                                    "status": 1,
                                    "comment": "",
                                }
                            },
                            "constructionCost": {
                                "ccid": 1,
                                "name": "工程成本",
                                "areaLeft": 60000,
                                "areaRight": 69000,
                                "accessory": 12000000,
                                "salary": 60000000,
                                "sort": 0
                            },
                            "numLimit": 1
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> addAoodsCost
    
        添加辅材成本
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoodsCost.aoods.aid: 辅材ID
        :type aoodsCost.aoods.aid: Long
        :param aoodsCost.constructionCost.ccid: 工程成本ID
        :type aoodsCost.constructionCost.ccid: Long
        :param aoodsCost.numLimit: 数量限制
        :type aoodsCost.numLimit: Integer
        
        Example::
        
            {
                "aoodsCost.aoods.aid": 1,
                "aoodsCost.constructionCost.ccid": 1,
                "aoodsCost.numLimit": 1
            }
    
    .. method:: <I> deleteAoodsCost
    
        删除辅材成本
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoodsCost.acid: 辅材成本ID
        :type aoodsCost.acid: Long
        
        Example::
        
            {
                "aoodsCost.acid": 1
            }

工程工期
----------------

.. class:: api.data.ConstructionPeriodAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: constructionPeriod
    
    :param cpid: 工期ID
    :type cpid: Long
    :param name: 名称
    :type name: String
    :param typeness: 业务类型
    :type typeness: Short
    :param upperArea: 起始面积
    :type upperArea: Integer
    :param lowerArea: 终止面积
    :type lowerArea: Integer
    :param period: 工期
    :type period: Integer
    :param company: 公司
    :type company: Integer
    
    .. method:: <I> pageConstructionPeriod
    
        分页方式获取工程工期信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 工程工期信息列表 , 每条数据类型 :data:`constructionPeriod`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cpid": 1,
                            "name": "通用",
                            "typeness": -1,
                            "upperArea": 10000,
                            "lowerArea": 0,
                            "period": 1000
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <C> addConstructionPeriod
    
        添加品类信息
        
        :param constructionPeriod.name: 名称
        :type constructionPeriod.name: String
        :param constructionPeriod.typeness: 业务类型
        :type constructionPeriod.typeness: Short
        :params constructionPeriod.upperArea: 起始面积
        :type constructionPeriod.upperArea: Integer
        :params constructionPeriod.lowerArea: 起始面积
        :type constructionPeriod.lowerArea: Integer
        :params constructionPeriod.period: 工期
        :type constructionPeriod.period: Integer
        
        Example::
        
            {
                "constructionPeriod.name": "地板",
                "constructionPeriod.typeness": -1,
                "constructionPeriod.upperArea": 10000,
                "constructionPeriod.lowerArea": 0
                "constructionPeriod.period": 10000
            }
            
    .. method:: <C> updateConstructionPeriod
    
        更新工程工期
        
        :param constructionPeriod.cpid: 工期ID
        :type constructionPeriod.cpid: Long
        :param constructionPeriod.name: 名称
        :type constructionPeriod.name: String
        :param constructionPeriod.typeness: 业务类型
        :type constructionPeriod.typeness: Short
        :params constructionPeriod.upperArea: 起始面积
        :type constructionPeriod.upperArea: Integer
        :params constructionPeriod.lowerArea: 起始面积
        :type constructionPeriod.lowerArea: Integer
        :params constructionPeriod.period: 工期
        :type constructionPeriod.period: Integer
        
        Example::
        
            {
                "constructionPeriod.cpid": 1,
                "constructionPeriod.name": "地板",
                "constructionPeriod.typeness": -1,
                "constructionPeriod.upperArea": 10000,
                "constructionPeriod.lowerArea": 0
                "constructionPeriod.period": 10000
            }
            
    .. method:: <C> deleteConstructionPeriod
    
        删除工程工期
        
        +---------+
        |Requests:|
        +---------+
        
        :param constructionPeriod.cpid: 工期ID
        :type constructionPeriod.cpid: List
        
        Example::
        
            {
                "constructionPeriod.cpid": 1
            }

厂商
================

品类
---------------------

品类信息管理

.. class:: api.communion.CategoryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: category
    
    :param cid: 品类ID
    :type cid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param type: 类型 , 0: 标准 , 1: 统计
    :type type: Short
    :param isCoupon: 券标识 , 0: 优惠 , 1: 标准
    :type isCoupon: Short
    :param isCount: 统计标识 , 0: 统计 , 1: 标准
    :param isCount: Short
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param name: 品类名称
    :type name: String
    
    .. method:: <I> pageCategory
    
        分页方式获取品类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 品类信息列表 , 每条数据类型 :data:`category`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "no": "C001",
                            "name": "地板",
                            "type": 0,
                            "isCoupon": 0,
                            "isCount": 0,
                            "kino": "01",
                            "kiname": "地板"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryCategory
    
        获取所有品类信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param categorys: 品类信息列表 , 每条数据类型 :data:`category`
        :type categorys: List
        
        Example::
        
            {
                ...
                "categorys": [
                    {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板",
                        "type": 0,
                        "isCoupon": 0,
                        "isCount": 0,
                        "kino": "01",
                        "kiname": "地板"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryCategoryByCId
    
        通过品类ID获取品类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param category.cid: 品类ID
        :type category.cid: Long
        
        Example::
        
            {
                "category.cid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param category: 品类信息 , 类型 :data:`category`
        :type category: Object
        
        Example::
        
            {
                ...
                "category":{
                    "cid": 1,
                    "no": "C001",
                    "name": "地板",
                    "type": 0,
                    "isCoupon": 0,
                    "isCount": 0,
                    "kino": "01",
                    "kiname": "地板"
                },
                ...
            }

    .. method:: <C> addCategory
    
        添加品类信息
        
        :param category.name: 品类名称
        :type category.name: String
        :param category.kino: 金蝶编号
        :type category.kino: String
        :params category.kiname: 金蝶名称
        :type category.kiname: String
        
        Example::
        
            {
                "category.name": "地板",
                "category.kino": "01",
                "category.kiname": "地板"
            }
            
    .. method:: <C> updateCategory
    
        更新品类信息
        
        :param category.cid: 品类ID
        :type category.cid: Long
        :param category.name: 品类名称
        :type category.name: String
        :param category.type: 类型
        :type category.type: Short
        :param category.isCoupon: 券标识
        :type category.isCoupon: Short
        :param category.isCount: 统计标识
        :type category.isCount: Short
        :param category.kino: 金蝶编号
        :type category.kino: String
        :params category.kiname: 金蝶名称
        :type category.kiname: String
        
        Example::
        
            {
                "category.cid": 1,
                "category.name": "地板",
                "category.type": 0,
                "category.isCoupon": 0,
                "category.isCount": 0,
                "category.kino": "01",
                "category.kiname": "地板"
            }
            
    .. method:: <C> deleteCategoryByCIds
    
        通过品类ID批量删除品类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param cids: 品类ID列表 , 每条数据类型 Long
        :type ids: cids
        
        Example::
        
            {
                "cids[0]": 1,
                "cids[1]": 2
            }

品牌
---------------------

品牌信息管理

.. class:: api.communion.BrandAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: brand
    
    :param bid: 品牌ID
    :type bid: Long
    :param no: 品牌编码
    :type no: String
    :param name: 品牌名称
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param category: 品类 , 类型 `category <./data.html#api.data.CategoryAction.category>`__
    :type category: Object
    :param supplier: 厂商 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supplier: Object
    :param atttype: 业务类型 , 0: 内销 , 1: 外销
    :type atttype: Short
    :param agentName: 代理
    :type agentName: String
    :param agentPhone: 电话
    :type agentPhone: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param comment: 说明
    :type comment: String
    :param company: 公司ID
    :type company: Long
    
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param no: 品类ID
    :type no: Long
    :param name: 品牌名称
    :type name: String
    
    .. method:: <I> pageBrand
    
        分页方式获取品牌信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 品牌信息列表 , 每条数据类型 :data:`brand`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                            "pinyin": "pinpai",
                            "category": {
                                "cid": 1,
                                "no": "C001",
                                "name": "地板"
                            },
                            "supplier": {
                                "uid": 1000,
                                "userId": "OC001",
                                "currentName": "厂商",
                                "userName": "厂商"
                            },
                            "atttype": 0,
                            "agentName": "",
                            "agentPhone": "",
                            "kino": "01.02",
                            "kiname": "品牌",
                            "comment": ""
                            
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryBrand
    
        获取所有品牌信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param brands: 品牌信息列表 , 每条数据类型 :data:`brand`
        :type brands: List
        
        Example::
        
            {
                ...
                "brands": [
                    {
                        "bid": 1,
                        "no": "B001",
                        "name": "品牌",
                        "pinyin": "pinpai",
                        "category": {
                            "cid": 1,
                            "no": "C001",
                            "name": "地板"
                        },
                        "supplier": {
                            "uid": 1000,
                            "userId": "OC001",
                            "currentName": "厂商",
                            "userName": "厂商"
                        },
                        "atttype": 0,
                        "agentName": "",
                        "agentPhone": "",
                        "kino": "01.02",
                        "kiname": "品牌",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> queryBrandByBid
    
        通过品牌ID获取品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.bid: 品牌ID
        :type brand.bid: String
        
        Example::
        
            {
                "brand.bid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param brand: 品牌信息 , 类型 :data:`brand`
        :type brand: object
        
        Example::
        
            {
                ...
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                    "atttype": 0,
                    "agentName": "",
                    "agentPhone": "",
                    "kino": "01.02",
                    "kiname": "品牌",
                    "comment": ""
                },
                ...
            }
            
    .. method:: <I> queryBrandByNo
    
        通过品牌编号获取品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.no: 品牌编号
        :type brand.no: String
        
        Example::
        
            {
                "brand.no": "B001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param brand: 品牌信息 , 类型 :data:`brand`
        :type brand: object
        
        Example::
        
            {
                ...
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                    "atttype": 0,
                    "agentName": "",
                    "agentPhone": "",
                    "kino": "01.02",
                    "kiname": "品牌",
                    "comment": ""
                },
                ...
            }
            
    .. method:: <I> queryBrandByCid
    
        通过品类ID获取品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.cid: 品类ID
        :type brand.cid: Long
        
        Example::
        
            {
                "brand.cid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param brands: 品牌信息列表 , 每条数据类型 :data:`brand`
        :type brands: List
        
        Example::
        
            {
                ...
                "brands": [
                    {
                        "bid": 1,
                        "no": "B001",
                        "name": "品牌",
                        "pinyin": "pinpai",
                        "category": {
                            "cid": 1,
                            "no": "C001",
                            "name": "地板"
                        },
                        "supplier": {
                            "uid": 1000,
                            "userId": "OC001",
                            "currentName": "厂商",
                            "userName": "厂商"
                        },
                        "atttype": 0,
                        "agentName": "",
                        "agentPhone": "",
                        "kino": "01.02",
                        "kiname": "品牌",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> queryBrandByPinyin
    
        通过品牌名拼音获取品牌编号和品牌名称信息 , 公司限制
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.pinyin: 拼音
        :type brand.pinyin: String
        :param brand.atttype: 业务类型
        :type brand.atttype: Short
        
        Example::
        
            {
                "brand.pinyin": "pinpai",
                "brand.attype": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为品牌编号 , 值为品牌名
        :type autoFillKeyValue: List
        :param autoFillList: 品牌名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "B001",
                        "value": "品牌"
                    }
                ],
                "autoFillList": [
                    "品牌"
                ],
                ...
            }
            
    .. method:: <I> queryBrandByPinyinForAll
    
        通过品牌名拼音获取品牌编号和品牌名称信息 , 无公司限制
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.pinyin: 品牌名拼音
        :type brand.pinyin: String
        :param brand.atttype: 业务类型
        :type brand.atttype: Short
        
        Example::
        
            {
                "brand.pinyin": "pinpai",
                "brand.atttype": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为品牌编号 , 值为品牌名 - 品类名
        :type autoFillKeyValue: List
        :param autoFillList: 品牌名 - 品类名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "B001",
                        "value": "品牌 - 地板"
                    }
                ],
                "autoFillList": [
                    "品牌 - 地板"
                ],
                ...
            }
            
    .. method:: <C> addBrand
    
        添加品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.name: 品牌名称
        :type brand.name: String
        :param brand.cid: 品类ID
        :type brand.cid: Long
        :param brand.supplier.uid: 厂商ID
        :type brand.supplier.uid: Long
        :param brand.atttype: 业务类型
        :type brand.atttype: Short
        :param agentName: 代理
        :type agentName: String
        :param agentPhone: 代理电话
        :type agentPhone: String
        :param brand.comment: 说明
        :type brand.comment: String
        
        :param brand.kino: 金蝶编号
        :type brand.kino: String
        :param brand.kiname: 金蝶名称
        :type brand.kiname: String
        
        Example::
        
            {
                "brand.name": "品牌",
                "brand.cid": 1,
                "brand.supplier.uid": 1000,
                "brand.atttype": 0,
                "brand.agentName": "",
                "brand.agentPhone": "",
                "brand.comment": "",
                
                "brand.kino": "01.02",
                "brand.kiname": "品牌"
            }
        
    .. method:: <C> updateBrand
    
        更新品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brand.bid: 品牌ID
        :type brand.bid: Long
        :param brand.name: 品牌名称
        :type brand.name: String
        :param brand.cid: 品类ID
        :type brand.cid: Long
        :param brand.supplier.uid: 厂商ID
        :type brand.supplier.uid: Long
        :param brand.atttype: 业务类型
        :type brand.atttype: Short
        :param agentName: 代理
        :type agentName: String
        :param agentPhone: 代理电话
        :type agentPhone: String
        :param brand.comment: 说明
        :type brand.comment: String
        
        :param brand.kino: 金蝶编号
        :type brand.kino: String
        :param brand.kiname: 金蝶名称
        :type brand.kiname: String
        
        Example::
        
            {
                "brand.bid": 1,
                "brand.name": "品牌",
                "brand.cid": 1,
                "brand.supplier.uid": 1000,
                "brand.atttype": 0,
                "brand.agentName": "",
                "brand.agentPhone": "",
                "brand.comment": "",
                
                "brand.kino": "01.02",
                "brand.kiname": "品牌"
            }

    .. method:: <C> updateBrandForStatus
    
        +---------+
        |Requests:|
        +---------+
        
        :param brand.bid: 品牌ID
        :type brand.bid: Long
        :param brand.status: 状态
        :type brand.status: Short
        
        Example::
        
            {
                "brand.bid": 1,
                "brand.status": 0
            }
            
    .. method:: <C> deleteBrand
    
        通过品牌ID批量删除品牌信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brands[n].bid: 品牌ID列表, 每条数据类型 Long
        :type brands[n].bid: List
        
        Example::
        
            {
                "brands[0].bid": 1,
                "brands[1].bid": 2,
            }

厂商
---------------------

.. class:: api.data.BrandSupplierAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: brandSupplier
    
    :param buid: 厂商ID
    :type buid: Long
    :param supplier: 厂商 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supplier: Object
    :param brand: 品牌 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type brand: Object
    
    .. method:: <I> queryBrandSupplier
    
        查询品牌厂商信息
    
        +--------+
        |Returns:|
        +--------+
        
        :param brandSuppliers: 品牌厂商信息列表 , 每条数据类型 :data:`brandSupplier`
        :type brandSuppliers: List
        
        Example::
        
            {
                ...
                "brandSuppliers": [
                    {
                        "buid": 1,
                        "supplier": {
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "phone": "138xxxx3874",
                            
                            ...
                        },
                        "brand": {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                        }
                    }
                ],
                ...
            }
    
    .. method:: <I> addBrandSupplier
    
        添加品牌厂商信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandSupplier.supplier.uid: 厂商ID
        :type brandSupplier.supplier.uid: Long
        :param brandSupplier.brand.bid: 品牌ID
        :type brandSupplier.brand.bid: Long
        
        Example::
        
            {
                "brandSupplier.supplier.uid": 1,
                "brandSupplier.brand.uid": 1
            }
    
    .. method:: <I> deleteBrandSupplier
    
        删除品牌厂商信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandSupplier.buid: 厂商ID
        :type brandSupplier.buid: Long
        
        Example::
        
            {
                "brandSupplier.buid": 1
            }

驻店
---------------------

.. class:: api.data.BrandInstorerAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: brandInstorer
    
    :param biid: 驻店ID
    :type biid: Long
    :param instorer: 驻店 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type instorer: Object
    :param brand: 品牌 , 类型 `brand <./data.html#api.data.BrandAction.brand>`__
    :type brand: Object
    :param agentName: 代理
    :type agentName: String
    :param agentPhone: 电话
    :type agentPhone: String
    
    .. method:: <I> queryBrandInstorer
    
        查询品牌驻店信息
    
        +--------+
        |Returns:|
        +--------+
        
        :param brandInstorers: 品牌厂商信息列表 , 每条数据类型 :data:`brandInstorer`
        :type brandInstorers: List
        
        Example::
        
            {
                ...
                "brandInstorers": [
                    {
                        "buid": 1,
                        "instorer": {
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "phone": "138xxxx3874",
                            
                            ...
                        },
                        "brand": {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                        },
                        "agentName": "",
                        "agentPhone": ""
                    }
                ],
                ...
            }
    
    .. method:: <I> addBrandInstorer
    
        添加品牌驻店信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandInstorer.instorer.uid: 厂商ID
        :type brandInstorer.instorer.uid: Long
        :param brandInstorer.brand.bid: 品牌ID
        :type brandInstorer.brand.bid: Long
        :param brandInstorer.agentName: 代理
        :type brandInstorer.agentName: String
        :param brandInstorer.agentPhone: 电话
        :type brandInstorer.agentPhone: String
        
        Example::
        
            {
                "brandInstorer.instorer.uid": 1,
                "brandInstorer.brand.uid": 1,
                "brandInstorer.agentName": "",
                "brandInstorer.agentPhone": ""
            }
    
    .. method:: <I> deleteBrandInstorer
    
        删除品牌驻店信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandInstorer.buid: 厂商ID
        :type brandInstorer.buid: Long
        
        Example::
        
            {
                "brandInstorer.buid": 1
            }

结算
---------------------

.. class:: api.data.BrandBalanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: brandBalance
    
    :param bbid: 结算ID
    :type bbid: Long
    :param bid: 品牌ID
    :type bid: Long
    :param name: 名称
    :type name: String
    :param ctype: 类型 , 0: 底价 , 1: 点位
    :type ctype: Short
    :param cvalue: 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
    :type cvalue: Integer
    :param comment: 说明
    :type comment: String

    .. method:: <I> queryBrandBalance
    
        获取品牌结算信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandBalance.bid: 品牌ID
        :type brandBalance.bid: Long
        
        Example::
        
            {
                "brandBalance.bid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param brandBalances: 结算信息列表 , 每条数据类型 :data:`brandBalance`
        :type brandBalances: List
        
        Example::
        
            {
                ...
                "brandBalances": [
                    {
                        "bbid": 1,
                        "bid": 1,
                        "name": "名称",
                        "ctype": 0,
                        "cvalue": 100000,
                        "status": 0,
                        "comment": "说明"
                    }
                ]
            }

    .. method:: <I> addBrandBalance
    
        添加结算信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandBalance.bid: 品牌ID
        :type brandBalance.bid: Long
        :param brandBalance.name: 名称
        :type brandBalance.name: String
        :param brandBalance.ctype: 类型
        :type brandBalance.ctype: Short
        :param brandBalance.cvalue: 结算值
        :type brandBalance.cvalue: Integer
        :param brandBalance.comment: 说明
        :type brandBalance.comment: String
        
        Example::
        
            {
                "brandBalance.bid": 1,
                "brandBalance.name": "名称",
                "brandBalance.ctype": 0,
                "brandBalance.cvalue": 100000,
                "brandBalance..comment": "说明"
            }

    .. method:: <I> deleteBrandBalance
    
        删除结算信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param brandBalance.bbid: 结算ID
        :type brandBalance.bbid: Long
        
        Example::
        
            {
                "brandBalance.bbid": 1
            }

生产
---------------------

.. class:: api.data.BrandProductAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: brandProduct
    
    :param bpid: 生产ID
    :type bpid: Long
    :param bid: 品牌ID
    :type bid: Long
    :param name: 名称
    :type name: String
    :param cnid: 工程节点ID
    :type cnid: Long
    :param workNum: 工期
    :type workNum: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> queryBrandProduct
    
    .. method:: <I> addBrandProduct
    
    .. method:: <I> updateBrandProduct
    
    .. method:: <I> deleteBrandProduct

回尺
---------------------

.. class:: api.data.RemeasureFormatAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: remeasureTemplate
    
    :param rtid: 模板ID
    :type rtid: Long
    :param name: 名称
    :type name: String
    :param cid: 品类ID
    :type cid: Long
    :param bid: 品牌ID
    :type bid: Long
    :param company: 公司ID
    :type company: Integer
    
    .. data:: remeasureFormat
    
    :param rfid: 指标ID
    :type rfid: Long
    :param name: 名称
    :type name: String
    :param brand: 品牌 , 类型 `brand <./data.html#api.data.BrandAction.brand>`__
    :type brand: Object
    :param quotationItem: 报价项 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param type: 类型 , 0: 文本 , 1: 数值
    :type type: Short
    :param value: 数值
    :type value: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> queryRemeasureFormatByBid
    
    .. method:: <I> queryRemeasureFormatByRfid
    
    .. method:: <I> addRemeasureFormat
    
    .. method:: <I> updateRemeasureFormat
    
    .. method:: <I> updateRemeasureFormatForStatus

主材
================

型号
---------------------

.. class:: api.data.MaterialModelAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: materialModel
    
    :param mmid: 型号ID
    :type mmid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param category: 品类名称
    :type category: String
    :param bid: 品牌ID
    :type bid: Long
    :param brand: 品牌名称
    :type brand: String
    :param measurementUnit: 单位
    :type measurementUnit: String
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param purchasePrice: 售价
    :type purchasePrice: Integer
    :param discount: 折扣
    :type discount: Integer
    :param calcType: 计算方式 , 0: 底价 , 1: 点位
    :type calcType: Short
    :param point: 点位计算值
    :type point: Integer
    :param base: 底价计算值
    :type base: Integer
    :param calcValue: 计算值
    :type calcValue: Integer
    :param status: 状态 , 0: 禁用 , 1: 启用
    :type status: Short
    :param company: 公司ID
    :type company: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param category: 品类ID
    :type category: Long
    :param brand: 品牌ID
    :type brand: Long
    :param no: 型号编号
    :type no: String
    :param name: 型号名称
    :type name: String
    
    .. method:: <I> pageMaterialModel
    
        分页方式获取型号信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
        查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 型号信息列表 , 每条数据类型 :data:`materialModel`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mmid": 1,
                            "no": "PW0001",
                            "name": "卫浴A12208C",
                            "bid": 2,
                            "brand": "卫浴",
                            "category": "洁具",
                            "measurementUnit": "个",
                            "purchasePrice": 1,
                            "unitPrice": 100,
                            "discount": 1,
                            "calcType": 0,
                            "calcValue": 0,
                            "base": 1,
                            "point": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageMaterialModelForAdvance
    
        分页方式获取型号信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 型号信息列表 , 每条数据类型 :data:`materialModel`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mmid": 1,
                            "no": "PW0001",
                            "name": "卫浴A12208C",
                            "bid": 2,
                            "brand": "卫浴",
                            "category": "洁具",
                            "measurementUnit": "个",
                            "purchasePrice": 1,
                            "unitPrice": 100,
                            "discount": 1,
                            "calcType": 0,
                            "calcValue": 0,
                            "base": 1,
                            "point": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryMaterialModel
    
        获取所有型号信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param materialModels: 型号信息列表 , 每条数据类型 :data:`materialModel`
        :type materialModels: List
        
        Example::
        
            {
                ...
                "materialModels": [
                    {
                        "mmid": 1,
                        "no": "PW0001",
                        "name": "卫浴A12208C",
                        "bid": 2,
                        "brand": "卫浴",
                        "category": "洁具",
                        "measurementUnit": "个",
                        "purchasePrice": 1,
                        "unitPrice": 100,
                        "discount": 1,
                        "calcType": 0,
                        "calcValue": 0,
                        "base": 1,
                        "point": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryMaterialModelById
    
        通过型号ID获取型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.mmid: 型号ID
        :type materialModel.mmid: Long
        
        Example::
        
            {
                "materialModel.mmid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialModel: 型号信息 , 类型 :data:`materialModel`
        :type materialModel: object
        
        Example::
        
            {
                ...
                "materialModel":{
                    "mmid": 1,
                    "no": "PW0001",
                    "name": "卫浴A12208C",
                    "bid": 2,
                    "brand": "卫浴",
                    "category": "洁具",
                    "measurementUnit": "个",
                    "purchasePrice": 1,
                    "unitPrice": 100,
                    "discount": 1,
                    "calcType": 0,
                    "calcValue": 0,
                    "base": 1,
                    "point": 0,
                    "status": 0
                },
                ...
            }
            
    .. method:: <I> queryMaterialModelByNo
    
        通过型号编号获取型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.no: 型号编号
        :type materialModel.no: String
        
        Example::
        
            {
                "materialModel.no": "PW0001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialModel: 型号信息 , 类型 :data:`materialModel`
        :type materialModel: object
        
        Example::
        
            {
                ...
                "materialModel":{
                    "mmid": 1,
                    "no": "PW0001",
                    "name": "卫浴A12208C",
                    "bid": 2,
                    "brand": "卫浴",
                    "category": "洁具",
                    "measurementUnit": "个",
                    "purchasePrice": 1,
                    "unitPrice": 100,
                    "discount": 1,
                    "calcType": 0,
                    "calcValue": 0,
                    "base": 1,
                    "point": 0,
                    "status": 0
                },
                ...
            }
            
    .. method:: <I> queryMaterialModelForAllByName
    
        通过型号名称查询型号信息列表
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.name: 型号名称
        :type materialModel.name: String
        
        Example::
        
            {
                "materialModel.name": "卫浴A12"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param materialModels: 型号信息列表 , 每条数据类型 :data:`materialModel`
        :type materialModels: List
        
        Example::
        
            {
                ...
                "materialModels": [
                    {
                        "mmid": 1,
                        "no": "PW0001",
                        "name": "卫浴A12208C",
                        "bid": 2,
                        "brand": "卫浴",
                        "category": "洁具",
                        "measurementUnit": "个",
                        "purchasePrice": 1,
                        "unitPrice": 100,
                        "discount": 1,
                        "calcType": 0,
                        "calcValue": 0,
                        "base": 1,
                        "point": 0,
                        "status": 0
                    }
                ],
                ...
            }
    
    .. method:: <I> queryMaterialModelForAllByNo
    
        通过型号编号查询型号信息列表
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.no: 型号编号
        :type materialModel.no: String
        
        Example::
        
            {
                "materialModel.no": "PW0001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param materialModels: 型号信息列表 , 每条数据类型 :data:`materialModel`
        :type materialModels: List
        
        Example::
        
            {
                ...
                "materialModels": [
                    {
                        "mmid": 1,
                        "no": "PW0001",
                        "name": "卫浴A12208C",
                        "bid": 2,
                        "brand": "卫浴",
                        "category": "洁具",
                        "measurementUnit": "个",
                        "purchasePrice": 1,
                        "unitPrice": 100,
                        "discount": 1,
                        "calcType": 0,
                        "calcValue": 0,
                        "base": 1,
                        "point": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> addMaterialModel
    
        添加型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.no: 编号
        :type materialModel.no: String
        :param materialModel.name: 名称
        :type materialModel.name: String
        :param materialModel.bid: 品牌ID
        :type materialModel.bid: Long
        :param materialModel.measurementUnit: 单位
        :type materialModel.measurementUnit: String
        :param materialModel.unitPrice: 单价
        :type materialModel.unitPrice: Integer
        :param materialModel.purchasePrice: 售价
        :type materialModel.purchasePrice: Integer
        :param materialModel.discount: 折扣
        :type materialModel.discount: Integer

        Example::
        
            {
                "materialModel.no": "PW0001",
                "materialModel.name": "卫浴A12208C",
                "materialModel.bid": 2,
                "materialModel.measurementUnit": "个",
                "materialModel.purchasePrice": 1,
                "materialModel.unitPrice": 100,
                "materialModel.discount": 1
            }
            
    .. method:: <I> updateMaterialModel
    
        更新型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.mmid: 型号ID
        :type materialModel.mmid: Long
        :param materialModel.no: 编号
        :type materialModel.no: String
        :param materialModel.name: 名称
        :type materialModel.name: String
        :param materialModel.bid: 品牌ID
        :type materialModel.bid: Long
        :param materialModel.measurementUnit: 单位
        :type materialModel.measurementUnit: String
        :param materialModel.unitPrice: 单价
        :type materialModel.unitPrice: Integer
        :param materialModel.purchasePrice: 售价
        :type materialModel.purchasePrice: Integer
        :param materialModel.discount: 折扣
        :type materialModel.discount: Integer
        
        Example::
        
            {
                "materialModel.mmid": 1,
                "materialModel.no": "PW0001",
                "materialModel.name": "卫浴A12208C",
                "materialModel.bid": 2,
                "materialModel.measurementUnit": "个",
                "materialModel.purchasePrice": 1,
                "materialModel.unitPrice": 100,
                "materialModel.discount": 1
            }
            
    .. method:: <I> updateMaterialModelForStatus
    
        更新型号状态信息 , 控制型号启用禁用状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.mmid: 型号ID
        :type materialModel.mmid: Long
        :param materialModel.status: 状态 , 0: 禁用 , 1: 启用
        :type materialModel.status: Short
        
        Example::
        
            {
                "materialModel.mmid": 1,
                "materialModel.status": 1
            }
            
    .. method:: <I> updateMaterialModelForAdvance
    
        更新型号高级信息 , 比如计算方式 , 点位 , 底价计算值
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialModel.mmid: 型号ID
        :type materialModel.mmid: Long
        :param materialModel.calcType: 计算类型 , 0: 底价 , 1: 点位
        :type materialModel.calcType: Short
        :param materialModel.base: 底价计算值
        :type materialModel.base: Integer
        :param materialModel.point: 点位计算值
        :type materialModel.point: Integer
        
        Example::
        
            {
                "materialModel.mmid": 1,
                "materialModel.calcType": 1,
                "materialModel.base": 10,
                "materialModel.point": 0.1
            }
            
    .. method:: <I> deleteMaterialModelByIds
    
        通过型号ID批量删除型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dis: 型号ID列表 , 每条数据类型 Long
        :type ids: dis
        
        Example::
        
            {
                "dis[0]": 1,
                "dis[1]": 2
            }
            
材料
================

类别
---------------------

类别信息管理

.. class:: api.data.GoodsKindAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: goodsKind
    
    :param gkid: 类别ID
    :type gkid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param level: 等级 , 1/2/3
    :type level: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageGoodsKind
    
    .. method:: <I> queryGoodsKind
    
    .. method:: <I> addGoodsKind
    
    .. method:: <I> updateGoodsKind
    
    .. method:: <I> updateGoodsKindForStauts

辅类
---------------------

.. class:: api.data.AccessoriesTypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: accessoriesType
    
    :param atid: 辅类ID
    :type atid: Long
    :param name: 名称
    :type name: String
    :param workType: 工种 , 类型 `workType <./data.html#api.data.WorkTypeAction.workType>`__
    :type workType: Object
    :param status: 状态 , 包括: 0(禁用) , 1(启用)
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> pageAccessoriesType
    
        分页方式获取辅类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 辅类信息列表 , 每条数据类型 :data:`accessoriesType`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "atid": 1,
                            "name": "墙面",
                            "status": 1,
                            "comment": "",
                            "workType": {
                                "id": 1,
                                "name": "瓦"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryAccessoriesType
    
        获取辅类信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriesTypes: 辅类信息列表 , 每条数据类型 :data:`accessoriesType`
        :type accessoriesTypes: List
        
        Example::
        
            {
                ...
                "accessoriesTypes": [
                    {
                        "atid": 1,
                        "name": "墙面",
                        "status": 1,
                        "comment": "",
                        "workType": {
                            "id": 1,
                            "name": "瓦"
                        }
                    }
                ],
                ...
            }
            
    .. method:: <I> queryAccessoriesTypeByWtid
    
        通过工种ID获取对应的辅类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesType.workType.id: 工种ID
        :type accessoriesType.workType.id: Integer
        
        Example::
        
            {
                "accessoriesType.workType.id": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param accessoriesTypes: 辅类信息列表 , 每条数据类型 :data:`accessoriesType`
        :type accessoriesTypes: List
        
        Example::
        
            {
                ...
                "accessoriesTypes": [
                    {
                        "atid": 1,
                        "name": "墙面",
                        "status": 1,
                        "comment": "",
                        "workType": {
                            "id": 1,
                            "name": "瓦"
                        }
                    }
                ],
                ...
            }
            
    .. method:: <I> addAccessoriesType
    
        添加辅类信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesType.name: 名称
        :type accessoriesType.name: String
        :param accessoriesType.comment: 说明
        :type accessoriesType.comment: String
        :param accessoriesType.workType.id: 工种ID
        :type accessoriesType.workType.id: Integer
        
        Example::
        
            {
                "accessoriesType.name": "墙面",
                "accessoriesType.comment": "",
                "accessoriesType.workType.id": 1
            }
            
    .. method:: <I> updateAccessoriesType
    
        更新辅类信息
        
        辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesType.atid: 辅类ID
        :type accessoriesType.atid: Long
        :param accessoriesType.name: 名称
        :type accessoriesType.name: String
        :param accessoriesType.comment: 说明
        :type accessoriesType.comment: String
        :param accessoriesType.workType.id: 工种ID
        :type accessoriesType.workType.id: Integer
        
        Example::
        
            {
                "accessoriesType.atid": 1,
                "accessoriesType.name": "墙面",
                "accessoriesType.comment": "",
                "accessoriesType.workType.id": 1
            }
            
    .. method:: <I> updateAccessoriesTypeForStatus
    
        更新辅类状态
        
        辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param accessoriesType.atid: 辅类ID
        :type accessoriesType.atid: Long
        :param accessoriesType.status: 状态
        :type accessoriesType.status: Short
        
        Example::
        
            {
                "accessoriesType.atid": 1,
                "accessoriesType.status": 0
            }

商品
---------------------

.. class:: api.data.GoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: goods
    
    :param gid: 商品ID
    :type gid: Long
    :param no: 编号
    :type no: String
    :param name: 商品名
    :type name: String
    :param alias: 别名
    :type alias: String
    :param pinyin: 拼音
    :type pinyin: String
    :param barcode: 条形码
    :type barcode: String
    :param category: 品类
    :type category: String
    :param onekind: 一类 , 类型 `goodsKind <./data.html#api.data.GoodsKindAction.goodsKind>`__
    :type onekind: Object
    :param twokind: 二类 , 类型 `goodsKind <./data.html#api.data.GoodsKindAction.goodsKind>`__
    :type twokind: Object
    :param thrkind: 三类 , 类型 `goodsKind <./data.html#api.data.GoodsKindAction.goodsKind>`__
    :type thrkind: Object
    :param bid: 品牌ID
    :type bid: Long
    :param brand: 品牌
    :type brand: String
    :param measurementUnit: 单位
    :type measurementUnit: String
    :param path: 图片
    :type path: String
    :param purchase: 进价
    :type purchase: Integer
    :param selling: 售价
    :type selling: Integer
    :param pieceNum: 件数
    :type pieceNum: Integer
    :param type: 类型 , 0: 商品 , 1: 套餐
    :type type: Short
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param isShow: 是否出样 , 0: 已出 , 1: 未出
    :type isShow: Short
    :param company: 公司
    :type company: Long
    
    .. data:: goodsPackage
    
    :param gpid: 套餐ID
    :type gpid: Long
    :param pid: 套餐商品ID
    :type pid: Long
    :param goods: 商品 , 类型 :data:`goods`
    :type goods: Object
    :param color: 商品颜色 , 类型 `color <./data.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 商品规格 , 类型 `format <./data.html#api.data.FormatAction.format>`__
    :type format: Object
    :param num: 数量
    :type num: Integer
    
    +--------+
    |Filters:|
    +--------+
    
    :param name: 大区名称
    :type name: String
    :param category: 大区名称
    :type category: String
    :param brand: 大区名称
    :type brand: String

    .. method:: <I> pageGoods
    
        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 商品信息列表 , 每条数据类型 :data:`goods`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "isShow": 0,
                            "company": 0
                        },
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageGoodsForAdvance
    
        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 商品信息列表 , 每条数据类型 :data:`goods`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "path": "",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "isShow": 0,
                            "company": 0
                        },
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryGoods
    
        获取商品信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param goodes: 商品信息列表 , 每条数据类型 :data:`goods`
        :type goodes: List
        
        Example::
        
            {
                ...
                "goodes": [
                    {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "path": "",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "isShow": 0,
                        "company": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryGoodsByAtid
    
        通过辅类ID获取商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.accessoriesType.atid: 辅类ID
        :type goods.accessoriesType.atid: Long
        
        Example::
        
            {
                "goods.accessoriesType.atid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param goodes: 商品信息列表 , 每条数据类型 :data:`goods`
        :type goodes: List
        
        Example::
        
            {
                ...
                "goodes": [
                    {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "path": "",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "isShow": 0,
                        "company": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryGoodsByNo
    
        通过编号获取商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.no: 商品编号
        :type goods.no: String
        
        Example::
        
            {
                "goods.no": "JGIDNEHDUIN5SD"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param goodes: 商品信息列表 , 每条数据类型 :data:`goods`
        :type goodes: List
        
        Example::
        
            {
                ...
                "goodes": [
                    {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "path": "",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "isShow": 0,
                        "company": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryGoodsByName
    
        通过名称或拼音获取商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.name: 商品名称
        :type goods.name: String
        
        Example::
        
            {
                "goods.name": "瓷砖"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param goodes: 商品信息列表 , 每条数据类型 :data:`goods`
        :type goodes: List
        
        Example::
        
            {
                ...
                "goodes": [
                    {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "path": "",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "isShow": 0,
                        "company": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryGoodsByBarcode
    
        通过条型号获取商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.barcode: 条形码
        :type goods.barcode: String
        
        Example::
        
            {
                "goods.barcode": "254125212521251"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param goods: 商品信息 , 类型 :data:`goods`
        :type goods: object
        
        Example::
        
            {
                ...
                "goods":{
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "alias": "",
                    "pinyin": "cizhuan",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "path": "",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "isShow": 0,
                    "company": 0
                },
                ...
            }
            
    .. method:: <I> queryGoodsByGId
    
        通过商品ID获取商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.gid: 商品ID
        :type goods.gid: Long
        
        Example::
        
            {
                "goods.gid": 2
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param goods: 商品信息 , 类型 :data:`goods`
        :type goods: object
        
        Example::
        
            {
                ...
                "goods":{
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "alias": "",
                    "pinyin": "cizhuan",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "path": "",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "isShow": 0,
                    "company": 0
                },
                ...
            }
            
    .. method:: <I> queryPackage
    
        获取套餐信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param goodsPackage.pid: 商品ID
        :type goodsPackage.pid: Long
        
        Example::
        
            {
                "goodsPackage.pid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param goodsPackages: 商品信息列表 , 每条数据类型 :data:`goodsPackages`
        :type goodsPackages: List
        
        Example::
        
            {
                ...
                "goodsPackages": [
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "path": "",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "isShow": 0,
                        "company": 0
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
            }
        
    .. method:: <I> addGoods
    
        添加商品
        
        通过商品名称判断状态为0(启用)的商品是否存在 , 错误信息 **260046 商品已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.no: 商品编号
        :type goods.no: String
        :param goods.name: 名称
        :type goods.name: String
        :param goods.alias: 别名
        :type goods.alias: String
        :param goods.barcode: 条形码
        :type goods.barcode: String
        :param goods.category: 品类
        :type goods.category: String
        :param goods.brand: 品牌
        :type goods.brand: String
        :param goods.measurementUnit: 单位
        :type goods.measurementUnit: String
        :param goods.purchase: 进价
        :type goods.purchase: Integer
        :param goods.selling: 售价
        :type goods.selling: Integer
        :param goods.pieceNum: 件数
        :type goods.pieceNum: Integer
        
        Example::
        
            {
                "goods.no": "JGIDNEHDUIN5SD",
                "goods.name": "瓷砖",
                "goods.alias": "别名",
                "goods.barcode": "254125212521251",
                "goods.category": "瓷砖",
                "goods.brand": "瓷砖",
                "goods.measurementUnit": "个",
                "goods.purchase": 100000,
                "goods.selling": 50000,
                "goods.pieceNum": 1
            }
            
    .. method:: <I> addPackage
    
        添加套餐
        
        绑定商品到指定商品 , 被绑定商品形成套餐商品
        
        被绑商品信息不存在 , 添加失败 , 错误信息 **260004 商品不存在**
        
        被绑商品不能为套餐 , 添加失败 , 错误信息 **260043 套餐归属商品不可为套餐**
        
        套餐与绑定商品的品牌需要爱一致 , 不一致添加失败 , 错误信息 **260044 品牌不一致**
        
        更新被绑商品类型为1(套餐)
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.no: 商品编号
        :type goods.no: String
        :param goods.name: 名称
        :type goods.name: String
        :param goods.alias: 别名
        :type goods.alias: String
        :param goods.barcode: 条形码
        :type goods.barcode: String
        :param goods.category: 品类
        :type goods.category: String
        :param goods.brand: 品牌
        :type goods.brand: String
        :param goods.measurementUnit: 单位
        :type goods.measurementUnit: String
        :param goods.purchase: 进价
        :type goods.purchase: Integer
        :param goods.selling: 售价
        :type goods.selling: Integer
        :param goods.pieceNum: 件数
        :type goods.pieceNum: Integer
        :param goodsPackage[n].pid: 被绑商品ID
        :type goodsPackage[n].pid: Long
        :param goodsPackage[n].goods.gid: 商品ID
        :type goodsPackage[n].goods.gid: Long
        :param goodsPackage[n].color.cid: 颜色ID
        :type goodsPackage[n].color.cid: Long
        :param goodsPackage[n].format.fid: 规格ID
        :type goodsPackage[n].format.fid: Long
        :param goodsPackage[n].num: 数量
        :type goodsPackage[n].num: Floa
        
        Example::
        
            {
                "goods.no": "JGIDNEHDUIN5SD",
                "goods.name": "瓷砖",
                "goods.alias": "",
                "goods.barcode": "254125212521251",
                "goods.category": "瓷砖",
                "goods.brand": "瓷砖",
                "goods.measurementUnit": "个",
                "goods.purchase": 100000,
                "goods.selling": 50000,
                "goods.pieceNum": 1,
                "goodsPackage[0].pid": 1,
                "goodsPackage[0].goods.gid": 2,
                "goodsPackage[0].color.cid": 2,
                "goodsPackage[0].format.fid": 2,
                "goodsPackage[0].num": 1
            }
            
    .. method:: <I> updateGoods
    
        更新商品
        
        可更新的字段信息包括进价和售价
        
        商品是否存在 , 不存在 , 错误信息 **260004 商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.gid: 商品ID
        :type goods.gid: Long
        :param goods.path: 图片路径
        :type goods.path: String
        :param goods.purchase: 进价
        :type goods.purchase: Integer
        :param goods.selling: 售价
        :type goods.selling: Integer
    
        Example::
        
            {
                "goods.gid": 1,
                "goods.path": "",
                "goods.purchase": 1000,
                "goods.selling": 100000
            }

    .. method:: <I> updateGoodsForStatus
    
        更新商品状态
        
        商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.gid: 商品ID
        :type goods.gid: Long
        :param goods.status: 状态
        :type goods.status: Short
    
        Example::
        
            {
                "goods.gid": 1,
                "goods.status": 0
            }

    .. method:: <I> showGoods
    
        出样商品
        
        商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param goods.gid: 商品ID
        :type goods.gid: Long
        :param goods.isShow: 是否出样
        :type goods.isShow: Short
    
        Example::
        
            {
                "goods.gid": 1,
                "goods.isShow": 0
            }

辅材
---------------------

.. class:: api.data.AoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: aoods
    
    :param aid: 辅材ID
    :type aid: Long
    :param name: 名称
    :type name: String
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param type: 辅类 , 类型 `accessoriesType <./data.html#api.data.AccessoriesTypeAction.accessoriesType>`__
    :type type: Object
    :param noods: 商品 , 类型 `noods <./data.html#api.data.NoodsAction.noods>`__
    :type noods: Object
    :param constructionNode: 施工节点 , 类型 `constructionNode <./data.html#api.data.ConstructionNodeAction.constructionNode>`__
    :type constructionNode: Object
    :param atttype: 业务类型 , 0: 标准 , 1: 外辅
    :type atttype: Short
    :param balance: 结算价
    :type balance: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Integer
    :param bompany: 归属公司
    :type bompany: Integer
    
    .. method:: <I> pageAoods
    
        分页方式获取辅材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        查询过程根据当前操作公司查询辅材公司或归属公司作为条件
        
        +---------+
        |Requests:|
        +---------+
        
        :param companyType: 公司类型
        :type companyType: String
        
        Example::
        
            {
                "companyType": "company"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 辅材信息列表 , 每条数据类型 :data:`aoods`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "name": "辅材",
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "pinyin": "cizhuan",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "company": 0
                            },
                            "noods": {
                                "nid": 1,
                                "name": "名称",
                                "selling": 1000,
                                "balance": 1000
                            },
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白",
                                "schedule": 3
                            },
                            "type": {
                                "atid": 1,
                                "name": "墙面",
                                "status": 1,
                                "comment": "",
                            },
                            "atttype": 0,
                            "balance": 0
                        }
                    ],
                    ...
                },
                ...
            }
    .. method:: <I> queryAoods
    
        获取辅材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.type.atid: 辅类ID
        :type aoods.type.atid: Long
        :param aoods.atttype: 业务类型
        :type aoods.atttype: Short
        
        Example::
        
            {
                "aoods.type.atid": 2,
                "aoods.atttype": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param aoodes: 辅材信息 , 类型 :data:`aoods`
        :type aoodes: object
        
        Example::
        
            {
                ...
                "aoodes": {
                    "aid": 1,
                    "name": "辅材",
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "company": 0
                    },
                    "noods": {
                        "nid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000
                    },
                    "constructionNode": {
                        "cnid": 2,
                        "name": "铲大白",
                        "schedule": 3
                    },
                    "type": {
                        "atid": 1,
                        "name": "墙面",
                        "status": 1,
                        "comment": "",
                    },
                    "atttype": 0,
                    "balance": 0
                },
                ...
            }

    .. method:: <I> queryAoodsByAtid
    
        通过辅类ID获取辅材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.type.atid: 辅类ID
        :type aoods.type.atid: Long
        :param aoods.atttype: 业务类型
        :type aoods.atttype: Short
        
        Example::
        
            {
                "aoods.type.atid": 2,
                "aoods.atttype": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param aoodes: 辅材信息 , 类型 :data:`aoods`
        :type aoodes: object
        
        Example::
        
            {
                ...
                "aoodes": {
                    "aid": 1,
                    "name": "辅材",
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "company": 0
                    },
                    "noods": {
                        "nid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000
                    },
                    "constructionNode": {
                        "cnid": 2,
                        "name": "铲大白",
                        "schedule": 3
                    },
                    "type": {
                        "atid": 1,
                        "name": "墙面",
                        "status": 1,
                        "comment": "",
                    },
                    "atttype": 0,
                    "balance": 0
                },
                ...
            }
            
    .. method:: <I> queryAoodsByName
    
        通过商品名称获取辅材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.goods.name: 商品名
        :type aoods.goods.name: String
        
        Example::
        
            {
                "aoods.goods.name": "名称"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param aoodes: 辅材信息 , 类型 :data:`aoods`
        :type aoodes: object
        
        Example::
        
            {
                ...
                "aoodes": {
                    "aid": 1,
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "alias": "",
                        "pinyin": "cizhuan",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "company": 0
                    },
                    "noods": {
                        "nid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000
                    },
                    "constructionNode": {
                        "cnid": 2,
                        "name": "铲大白",
                        "schedule": 3
                    },
                    "type": {
                        "atid": 1,
                        "name": "墙面",
                        "status": 1,
                        "comment": "",
                    },
                    "atttype": 0,
                    "balance": 0
                },
                ...
            }
            
    .. method:: <I> addAoods
    
        添加辅材
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.name: 名称
        :type aoods.name: String
        :param aoods.goods.gid: 商品ID
        :type aoods.goods.gid: Long
        :param aoods.noods.nid: 定材ID
        :type aoods.noods.nid: Long
        :param aoods.constructionNode.cnid: 施工节点ID
        :type aoods.constructionNode.cnid: Long
        
        :param aoods.type.atid: 辅类ID
        :type aoods.type.atid: Long
        :param aoods.atttype: 业务类型
        :type aoods.atttype: Short
        :param aoods.balance: 结算价
        :type aoods.balance: Integer
        :param aoods.bompany: 归属公司
        :type aoods.bompany: Integer
        
        Example::
        
            {
                "aoods.name": "名称",
                "aoods.goods.gid": 1,
                "aoods.noods.nid": 1,
                "aoods.constructionNode.cnid": 1,
                
                "aoods.type.atid": 1,
                "aoods.atttype": 0,
                "aoods.balance": 0,
                "aoods.bompany": 1
            }
            
    .. method:: <I> updateAoods
    
        更新辅材信息
        
        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.aid: 商品ID
        :type aoods.aid: String
        
        :param aoods.name: 名称
        :type aoods.name: String
        :param aoods.noods.nid: 定材ID
        :type aoods.noods.nid: Long
        :param aoods.constructionNode.cnid: 施工节点ID
        :type aoods.constructionNode.cnid: Long
        :param aoods.type.atid: 辅类ID
        :type aoods.type.atid: Long
        :param aoods.atttype: 业务类型
        :type aoods.atttype: Short
        :param aoods.balance: 结算价
        :type aoods.balance: Integer
        :param aoods.bompany: 归属公司
        :type aoods.bompany: Integer
        
        Example::
        
            {
                "aoods.aid": 1,
                
                "aoods.name": "名称",
                "aoods.normood.ngid": 1,
                "aoods.constructionNode.cnid": 1,
                
                "aoods.type.atid": 1,
                "aoods.atttype": 0,
                "aoods.balance": 0
            }

    .. method:: <I> updateAoodsForNorm
    
        更新辅材关联定额信息
        
        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.aid: 商品ID
        :type aoods.aid: String
        
        :param aoods.noods.nid: 定材ID
        :type aoods.noods.nid: Long
        
        Example::
        
            {
                "aoods.aid": 1,
                
                "aoods.noods.nid": 1
            }
            
    .. method:: <I> updateAoodsForStatus
    
        更新辅材状态
        
        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**
        
        更新关联商品状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.aid: 辅材ID
        :type aoods.aid: Long
        :param aoods.status: 状态
        :type aoods.status: Short
    
        Example::
        
            {
                "aoods.aid": 1,
                "aoods.status": 0
            }
            
    .. method:: <I> copyAoods
    
        拷贝辅材
        
        +---------+
        |Requests:|
        +---------+
        
        :param aoods.bompany: 拷贝公司
        :type aoods.bompany: String
    
        Example::
        
            {
                "aoods.bompany": "AD2FOENN1SJILJ12I3JSODLJ3O"
            }
            
选材
---------------------

.. class:: api.data.SoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: soods
    
    :param sid: 选材ID
    :type sid: Long
    :param name: 名称
    :type name: String
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param format: 规格
    :type format: String
    :param num: 数量
    :type num: Integer
    :param selling: 售价
    :type selling: Integer
    :param cost: 成本
    :type cost: Integer
    :param balance: 结算价
    :type balance: Integer
    :param path: 图片
    :type path: String
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> pageSoods
    
        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 选材信息列表 , 每条数据类型 :data:`soods`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "name": "选材",
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "pinyin": "cizhuan",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "company": 0
                            },
                            "format": "",
                            "selling": 1000,
                            "cost": 1000,
                            "balance": "1000",
                            "num": 1000,
                            "path": ""
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> querySoods
    
        通过选材ID查询选材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param soods.sid: 选材ID
        :type soods.sid: Long
        
        Example::
        
            {
                "soods.sid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodes: 选材信息列表 , 每条数据类型 :data:`soods`
        :type soodes: List
        
        Example::
        
            {
                ...
                "soodes": [
                    {
                        "aid": 1,
                        "name": "选材",
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "company": 0
                        },
                        "format": "",
                        "selling": 1000,
                        "cost": 1000,
                        "balance": "1000",
                        "num": 1000,
                        "path": ""
                    },
                ],
                ...
            }

    .. method:: <I> querySoodsByName
    
        通过商品名称查询选材
        
        +---------+
        |Requests:|
        +---------+
        
        :param soods.goods.name: 商品名
        :type soods.goods.name: String
        
        Example::
        
            {
                "soods.goods.name": "商品名"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodes: 选材信息列表 , 每条数据类型 :data:`soods`
        :type soodes: List
        
        Example::
        
            {
                ...
                "soodes": [
                    {
                        "aid": 1,
                        "name": "",
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "company": 0
                        },
                        "format": "",
                        "selling": 1000,
                        "cost": 1000,
                        "balance": "1000",
                        "num": 1000,
                        "path": ""
                    },
                ],
                ...
            }
            
    .. method:: <I> addSoods
    
        添加选材
    
        +---------+
        |Requests:|
        +---------+
        
        :param soods.name: 名称
        :type soods.name: String
        :param soods.goods.gid: 商品ID
        :type soods.goods.gid: Long
        :param soods.format: 售价
        :type soods.format: Long
        :param soods.selling: 售价
        :type soods.selling: Long
        :param soods.cost: 成本
        :type soods.cost: Long
        :param soods.balance: 结算价
        :type soods.balance: Long
        :param soods.num: 数量
        :type soods.num: Integer
        
        Example::
        
            {
                "soods.name": "选材",
                "soods.goods.gid": 1,
                "soods.format": "",
                "soods.selling": 1000,
                "soods.cost": 1000,
                "soods.balance": 1000,
                "soods.num": 1
            }

    .. method:: <I> copySoods
    
        复制选材
        
        +---------+
        |Requests:|
        +---------+
        
        :param soods.qiid: 报价项ID
        :type soods.qiid: Long
        :param soods.quotationItem.qiid: 报价项ID
        :type soods.quotationItem.qiid: Long
        
        Example::
        
            {
                "soods.qiid": 1,
                "soods.quotationItem.qiid": 1
            }
            
    .. method:: <I> updateSoods
    
        更新选材项
        
        选材项更新内容包括结算价
        
        判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param soods.sid: 选材项ID
        :type soods.sid: Long
        :param soods.name: 名称
        :type soods.name: String
        :param soods.format: 规格
        :type soods.format: String
        :param soods.selling: 结算价
        :type soods.selling: Integer
        :param soods.cost: 结算价
        :type soods.cost: Integer
        :param soods.balance: 结算价
        :type soods.balance: Integer
        :param soods.path: 路径
        :type soods.path: String
        
        Example::
        
            {
                "soods.sid": 1,
                "soods.name": "选材",
                "soods.format": "规格",
                "soods.selling": 10000,
                "soods.cost": 10000,
                "soods.balance": 10000,
                "soods.path": ""
            }
            
    .. method:: <I> updateSoodsForStatus
    
        更新选材项状态
        
        判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodes[n].sid: 选材项ID
        :type soodes[n].sid: Long
        :param soodes[n].status: 状态
        :type soodes[n].status: Short
        
        Example::
        
            {
                "soodes[0].sid": 1,
                "soodes[0].status": 10000,
            }
            
    .. method:: <I> deleteSoods
    
        删除选材
        
        +---------+
        |Requests:|
        +---------+
        
        :param soods.sid: 选材ID
        :type soods.sid: Long
        
        Example::
        
            {
                "soods.sid": 1
            }    
            
    .. data:: soodsItem
    
    :param siid: 选材项ID
    :type siid: Long
    :param soods: 选材 , 类型 `soods <./data.html#api.data.SoodsAction.soods>`__
    :type soods: Object
    :param quotationItem: 报价项 , 类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`__
    :type quotationItem: Object
    
    .. method:: <I> pageSoodsItemByQiid
    
        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        默认条件为选材归属的报价项ID
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.quotationItem.qiid: 报价项ID
        :type soodsItem.quotationItem.qiid: Long
        
        Example::
        
            {
                "soodsItem.quotationItem.qiid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 选材信息列表 , 每条数据类型 :data:`soodsItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "pinyin": "cizhuan",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "company": 0
                            },
                            "quotationItem": {
                                "qiid": 1,
                                "itemId": "QI00100",
                                "itemName": "原墙体建筑大白铲除",
                                "addPrice": 120,
                                "unitPrice": 100,
                                "subPrice": 80,
                                "status": 1,
                                "discount": 1,
                                "no": "QV001",
                                "version": "banben",
                                "quotationItemDes": "说明",
                                "measurementUnit": "米",
                                "measurementUnitId": 1,
                                "quotationTypeId": 1,
                                "quotationType": "标准",
                                "quotationClassification": "基础部分",
                                "quotationClassificationId": 1,
                                "quotationBigCategory": "基础部分",
                                "quotationBigno": 1,
                                "quotationSmallno": 11,
                                "quotationSmallCategory": "棚顶工程",
                                "workTypeId": 1,
                                "workType": "力"
                            },
                            "selling": 1000,
                            "cost": 1000,
                            "balance": 1000,
                            "num": 1000
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageSoodsItemBySid
    
        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        默认条件为选材ID
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.sid: 选材ID
        :type soodsItem.sid: Long
        
        Example::
        
            {
                "soodsItem.sid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 选材信息列表 , 每条数据类型 :data:`soodsItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "pinyin": "cizhuan",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "company": 0
                            },
                            "quotationItem": {
                                "qiid": 1,
                                "itemId": "QI00100",
                                "itemName": "原墙体建筑大白铲除",
                                "addPrice": 120,
                                "unitPrice": 100,
                                "subPrice": 80,
                                "status": 1,
                                "discount": 1,
                                "no": "QV001",
                                "version": "banben",
                                "quotationItemDes": "说明",
                                "measurementUnit": "米",
                                "measurementUnitId": 1,
                                "quotationTypeId": 1,
                                "quotationType": "标准",
                                "quotationClassification": "基础部分",
                                "quotationClassificationId": 1,
                                "quotationBigCategory": "基础部分",
                                "quotationBigno": 1,
                                "quotationSmallno": 11,
                                "quotationSmallCategory": "棚顶工程",
                                "workTypeId": 1,
                                "workType": "力"
                            },
                            "selling": 1000,
                            "cost": 1000,
                            "balance": 1000,
                            "num": 1000
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> querySoodsItemByQiid
    
        通过报价项ID获取选材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.quotationItem.qiid: 报价项ID
        :type soodsItem.quotationItem.qiid: Long
        
        Example::
        
            {
                "soodsItem.quotationItem.qiid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodsItems: 选材信息列表 , 每条数据类型 :data:`soodsItem`
        :type soodsItems: List
        
        Example::
        
            {
                ...
                "soodsItems": [
                    {
                        "aid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "company": 0
                        },
                        "quotationItem": {
                            "qiid": 1,
                            "itemId": "QI00100",
                            "itemName": "原墙体建筑大白铲除",
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "status": 1,
                            "discount": 1,
                            "no": "QV001",
                            "version": "banben",
                            "quotationItemDes": "说明",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "workTypeId": 1,
                            "workType": "力"
                        },
                        "selling": 1000,
                        "cost": 1000,
                        "balance": 1000,
                        "num": 1000
                    },
                ],
                ...
            }

    .. method:: <I> querySoodsItemBySid
    
        通过选材ID获取选材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.sid: 报价项ID
        :type soodsItem.sid: Long
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodsItems: 选材信息列表 , 每条数据类型 :data:`soodsItem`
        :type soodsItems: List
        
        Example::
        
            {
                ...
                "soodsItems": [
                    {
                        "aid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "pinyin": "cizhuan",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "company": 0
                        },
                        "quotationItem": {
                            "qiid": 1,
                            "itemId": "QI00100",
                            "itemName": "原墙体建筑大白铲除",
                            "addPrice": 120,
                            "unitPrice": 100,
                            "subPrice": 80,
                            "status": 1,
                            "discount": 1,
                            "no": "QV001",
                            "version": "banben",
                            "quotationItemDes": "说明",
                            "measurementUnit": "米",
                            "measurementUnitId": 1,
                            "quotationTypeId": 1,
                            "quotationType": "标准",
                            "quotationClassification": "基础部分",
                            "quotationClassificationId": 1,
                            "quotationBigCategory": "基础部分",
                            "quotationBigno": 1,
                            "quotationSmallno": 11,
                            "quotationSmallCategory": "棚顶工程",
                            "workTypeId": 1,
                            "workType": "力"
                        },
                        "selling": 1000,
                        "cost": 1000,
                        "balance": 1000,
                        "num": 1000
                    },
                ],
                ...
            }
    
    .. method:: <I> addSoodsItem
        
        添加选材项
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.sid: 选材ID
        :type soodsItem.sid: Long
        :param soodsItem.quotationItem.qiid: 报价项ID
        :type soodsItem.quotationItem.qiid: Long
        
        Example::
        
            {
                "soodsItem.sid": 1,
                "soodsItem.quotationItem.qiid": 1
            }
    
    .. method:: <I> deleteSoodsItem
    
        删除选材项
        
        +---------+
        |Requests:|
        +---------+
        
        :param soodsItem.siid: 选材项ID
        :type soodsItem.siid: Long
        
        Example::
        
            {
                "soodsItem.siid": 1
            }

定材
---------------------

.. class:: api.data.NoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: noods
    
    :param nid: 选材ID
    :type nid: Long
    :param name: 名称
    :type name: String
    :param selling: 售价
    :type selling: Integer
    :param balance: 结算价
    :type balance: Integer
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> pageNoods
    
        分页方式获取定材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 定材信息列表 , 每条数据类型 :data:`noods`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "name": "名称",
                            "selling": 1000,
                            "balance": 1000,
                            "status": 0
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryNoods
    
        通过定材ID查询定材信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param noods.sid: 定材ID
        :type noods.sid: Long
        
        Example::
        
            {
                "noods.sid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodes: 定材信息列表 , 每条数据类型 :data:`noods`
        :type soodes: List
        
        Example::
        
            {
                ...
                "soodes": [
                    {
                        "aid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000,
                        "status": 0
                    },
                ],
                ...
            }

    .. method:: <I> queryNoodsByName
    
        通过商品名称查询定材
        
        +---------+
        |Requests:|
        +---------+
        
        :param noods.name: 名称
        :type noods.name: String
        
        Example::
        
            {
                "noods.name": "名称"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param soodes: 定材信息列表 , 每条数据类型 :data:`noods`
        :type soodes: List
        
        Example::
        
            {
                ...
                "soodes": [
                    {
                        "aid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000,
                        "status": 0
                    },
                ],
                ...
            }
            
    .. method:: <I> addNoods
    
        添加定材
    
        +---------+
        |Requests:|
        +---------+
        
        :param noods.name: 名称
        :type noods.name: String
        :param noods.selling: 售价
        :type noods.selling: Integer
        :param noods.balance: 结算价
        :type noods.balance: Integer
        
        Example::
        
            {
                "noods.name": 1,
                "noods.selling": 1000,
                "noods.balance": 1000
            }
            
    .. method:: <I> updateNoods
    
        更新定材
        
        判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param noods.nid: 定材项ID
        :type noods.nid: Long
        :param noods.name: 名称
        :type noods.name: String
        :param noods.selling: 售价
        :type noods.selling: Integer
        :param noods.balance: 结算价
        :type noods.balance: Integer
        
        Example::
        
            {
                "noods.nid": 1,
                "noods.name": 1,
                "noods.selling": 1000,
                "noods.balance": 1000
            }
            
    .. method:: <I> updateNoodsForStatus
    
        更新定材项状态
        
        判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param noods.sid: 定材项ID
        :type noods.sid: Long
        :param noods.status: 状态
        :type noods.status: Short
        
        Example::
        
            {
                "noods.sid": 1,
                "noods.status": 10000,
            }
    
颜色
---------------------

颜色信息管理 , 商品属性之一

.. class:: api.data.ColorAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: color
    
    :param cid: 颜色ID
    :type cid: Long
    :param gid: 商品ID
    :type gid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageColor
    
        分页方式获取颜色信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 颜色信息列表 , 每条数据类型 :data:`color`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "gid": 1,
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
                            "name": "白色",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryColorByGid
        
        通过商品ID获取对应的颜色信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param color.gid: 商品ID
        :type color.gid: Long
        
        Example::
        
            {
                "color.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param colors: 颜色信息列表 , 每条数据类型 :data:`color`
        :type colors: List
        
        Example::
        
            {
                ...
                "colors": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "name": "白色",
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryColorForEnableByGid
    
        通过商品ID获取对应的颜色信息 , 状态为启用
        
        +---------+
        |Requests:|
        +---------+
        
        :param color.gid: 商品ID
        :type color.gid: Long
        
        Example::
        
            {
                "color.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param colors: 颜色信息列表 , 每条数据类型 :data:`color`
        :type colors: List
        
        Example::
        
            {
                ...
                "colors": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "name": "白色",
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> addColor
    
        添加商品颜色信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param color.gid: 商品ID
        :type color.gid: Long
        :param color.name: 颜色名
        :type color.name: String
        
        Example::
        
            {
                "color.gid": 1,
                "color.name": "白色"
            }
            
    .. method:: <I> updateColorForStatus
    
        更新颜色状态
        
        颜色信息不存在 , 更新失败 , 错误信息 **260014 颜色不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param color.cid: 颜色ID
        :type color.cid: Long
        :param color.status: 状态 , 0: 启用 , 1: 禁用
        :type color.status: Short
        
        Example::
        
            {
                "color.cid": 1,
                "color.status":1
            }

规格
---------------------

规格信息管理 , 商品属性之一

.. class:: api.inventory.FormatAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: format
    
    :param fid: 规格ID
    :type fid: Long
    :param gid: 商品ID
    :type gid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param info: 规格信息
    :type info: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pageFormat
    
        分页方式获取规格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 规格信息列表 , 每条数据类型 :data:`format`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "gid": 1,
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
                            "info": "300*300",
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryFormatByGid
        
        通过商品ID获取对应的规格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param format.gid: 商品ID
        :type format.gid: Long
        
        Example::
        
            {
                "format.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param formats: 颜色信息列表 , 每条数据类型 :data:`format`
        :type formats: List
        
        Example::
        
            {
                ...
                "formats": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "info": "300*300",
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryFormatForEnableByGid
    
        通过商品ID获取对应的规格信息 , 状态为启用
        
        +---------+
        |Requests:|
        +---------+
        
        :param format.gid: 商品ID
        :type format.gid: Long
        
        Example::
        
            {
                "format.gid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param formats: 规格信息列表 , 每条数据类型 :data:`format`
        :type formats: List
        
        Example::
        
            {
                ...
                "formats": [
                    {
                        "cid": 1,
                        "gid": 1,
                        "info": "300*300",
                        "status": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> addFormat
    
        添加商品规格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param format.gid: 商品ID
        :type format.gid: Long
        :param format.info: 规格信息
        :type format.info: String
        
        Example::
        
            {
                "format.gid": 1,
                "format.info": "300*300"
            }
            
    .. method:: <I> updateFormatForStatus
    
        更新规格状态
        
        规格信息不存在 , 更新失败 , 错误信息 **260015 规格不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param format.fid: 规格ID
        :type format.fid: Long
        :param format.status: 状态 , 0: 启用 , 1: 禁用
        :type format.status: Short
        
        Example::
        
            {
                "format.fid": 1,
                "format.status":1
            }
    
价格
---------------------

价格信息管理 , 商品属性之一

.. class:: api.inventory.PriceAction
    
    +---------+
    |DataType:|
    +---------+
    
    .. data:: price
    
    :param pid: 价格ID
    :type pid: Long
    :param gid: 商品ID
    :type gid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param name: 名称
    :type name: String
    :param type: 类型 , 0: 正价 , 1: 特价
    :type type: Short
    :param purchase: 进价
    :type purchase: Integer
    :param selling: 售价
    :type selling: Integer
    :param ctype: 结算类型 , 0: 底价 , 1: 点位
    :type ctype: Short
    :param cvalue: 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
    :type cvalue: Integer
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    
    .. method:: <I> pagePrice
    
        分页方式获取价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 价格信息列表 , 每条数据类型 :data:`price`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pid": 1,
                            "gid": 1,
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
                            "name": "价格说明",
                            "purchase": 100000,
                            "selling": 150000,
                            "ctype": 0,
                            "cvalue": 90000
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryPriceByGid
    
        通过商品ID获取对应价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param price.gid: 商品ID
        :type price.gid: Long
        :param price.status: 状态
        :type price.status: Short
        
        Example::
        
            {
                "price.gid": 1,
                "price.status": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param prices: 价格信息列表 , 每条数据类型 :data:`price`
        :type prices: List
        
        Example::
        
            {
                ...
                "prices": [
                    {
                        "pid": 1,
                        "gid": 1,
                        "name": "价格说明",
                        "purchase": 100000,
                        "selling": 150000,
                        "ctype": 0,
                        "cvalue": 90000
                    }
                ],
                ...
            }
            
    .. method:: <I> queryPriceByPid
    
        通过ID获取对应价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param price.pid: 价格ID
        :type price.pid: Long
        
        Example::
        
            {
                "price.pid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param price: 价格信息 , 类型 :data:`price`
        :type price: Object
        
        Example::
        
            {
                ...
                "price": {
                    "pid": 1,
                    "gid": 1,
                    "name": "价格说明",
                    "purchase": 100000,
                    "selling": 150000,
                    "ctype": 0,
                    "cvalue": 90000
                }
                ...
            }
    
    .. method:: <I> addPrice
    
        添加商品价格信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param price.gid: 商品ID
        :type price.gid: Long
        :param price.name: 名称
        :type price.name: String
        :param price.purchase: 进价
        :type price.purchase: Integer
        :param price.selling: 售价
        :type price.selling: Integer
        :param price.ctype: 结算类型
        :type price.ctype: Short
        :param price.cvalue: 结算值
        :type price.cvalue: Integer
        
        Example::
        
            {
                "price.gid": 1,
                "price.name": "价格说明",
                "price.purchase": 100000,
                "price.selling": 150000,
                "price.ctype": 0,
                "price.cvalue": 90
            }
    
    .. method:: <I> updatePriceForStatus
    
        更新价格状态
    
        +---------+
        |Requests:|
        +---------+
        
        :param price.pid: 价格ID
        :type price.pid: Long
        :param price.status: 状态
        :type price.status: Short
        
        Example::
        
            {
                "price.pid": 1,
                "price.status": 0
            }

    .. method:: <I> deletePrice
    
        删除商品价格信息
        
        价格信息不存在 , 更新失败 , 错误信息 **260016 价格不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param price.pid: 价格ID
        :type price.pid: Long
        
        Example::
        
            {
                "price.pid": 1
            }

记录
---------------------

.. class:: api.data.GoodsRecordAction
    
    +---------+
    |DataType:|
    +---------+
    
    .. data:: goodsRecord
    
    :param grid: 记录ID
    :type grid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param sid: 关联ID
    :type sid: Long
    :param type: 类型 , 0: 商品, 1: 选材 , 2: 辅材
    :type type: Short
    :param operator: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type operator: Object
    :param operateTime: 操作时间
    :type operateTime: Timestamp
    :param comment: 说明
    :type comment: String
    
    .. pageGoodsRecord
    
仓储
================

仓库
---------------------

.. class:: api.inventory.StorehouseAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: storehouse
    
    :param shid: 仓库ID
    :type shid: Long
    :param code: 编号
    :type code: String
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: String
    
    .. method:: <I> pageStorehouse
    
        分页方式获取仓库信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 仓库信息列表 , 每条数据类型 :data:`storehouse`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "shid": 1,
                            "code": "SDJ4SDF5",
                            "name": "仓库"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryStorehouse
    
        获取全部仓库信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param storehouses: 仓库信息列表 , 每条数据类型 :data:`storehouse`
        :type storehouses: List
        
        Example::
        
            {
                ...
                "storehouses": [
                    {
                        "shid": 1,
                        "code": "SDJ4SDF5",
                        "name": "仓库"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryStorehouseForSelf
    
        获取当前登陆用户有权操作仓库信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param storehouses: 仓库信息列表 , 每条数据类型 :data:`storehouse`
        :type storehouses: List
        
        Example::
        
            {
                ...
                "storehouses": [
                    {
                        "shid": 1,
                        "code": "SDJ4SDF5",
                        "name": "仓库"
                    }
                ],
                ...
            }
            
    .. method:: <I> addStorehouse
    
        添加仓库信息
        
        仓库编号已经存在 , 添加失败 , 错误信息: **260012 仓库编号已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param storehouse.code: 编号
        :type storehouse.code: String
        :param storehouse.name: 名称
        :type storehouse.name: String
        
        Example::
        
            {
                "storehouse.code": "SDJ4SDF5",
                "storehouse.name": "仓库",
            }
            
    .. method:: <I> updateStorehouseForStatus
    
        更新仓库状态
        
        通过仓库ID获取的仓库信息不存在 , 更新失败 , 错误信息 **260005 仓库不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param storehouse.shid: 仓库ID
        :type storehouse.shid: Long
        :param storehouse.status: 状态
        :type storehouse.status: Short
        
        Example::
        
            {
                "storehouse.shid": 1,
                "storehouse.status": 0,
            }
            
仓库权限
---------------------

.. class:: api.inventory.StorehouseUserAction

    仓库权限信息管理 , 主要维护人员与仓库间的关联关系

    +---------+
    |DataType:|
    +---------+
    
    .. data:: storehouseUser
    
    :param shuid: 仓库权限ID
    :type shuid: Long
    :param user: 用户 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: String
    :param storehouse: 仓库 , 类型 `storehouse <./inventory.html#api.inventory.StorehouseAction.storehouse>`__
    :type storehouse: String
    
    .. method:: <I> queryStorehouseUserByUserId
    
        获取指定人员的仓库权限信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param storehouseUsers: 权限信息列表 , 每条数据类型 :data:`storehouseUser`
        :type storehouseUsers: Object
        
        Example::
        
            {
                ...
                "storehouseUsers":[
                    {
                        "shuid": 1,
                        "user": {
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
                        }
                    }
                ]
                ...
            }
            
    .. method:: <I> updateStorehouseUser
    
        更新仓库人员权限信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        :param shIds[n]: 仓库ID列表 , 每条数据类型: Long
        :type shIds[n]: List
        
        Example::
        
            {
                "user.userId": "U001",
                "shIds[0]": 1
            }

商品模版
---------------------

商品模版信息管理

.. class:: api.inventory.ManifestTemplateAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: manifestTemplate
    
    :param mtid: 商品模版ID
    :type mtid: Long
    :param name: 名称
    :type name: String
    :param comment: 说明
    :type comment: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param company: 公司
    :type company: Long
    
    .. data:: manifestTemplateItem
    
    :param mtiid: 商品模版项ID
    :type mtiid: Long
    :param manifestTemplate: 模版 , 类型 :data:`manifestTemplate`
    :type manifestTemplate: Object
    :param goods: 商品 , 类型 `goods <./inventory.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    
    .. method:: <I> pageManifestTemplate
    
        分页方式获取商品模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 商品模版信息列表 , 每条数据类型 :data:`manifestTemplate`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mtid": 1,
                            "name": "商品模版",
                            "comment": "说明",
                            "status": 0,
                            "company": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryManifestTemplate
    
        获取全部商品模版
        
        +--------+
        |Returns:|
        +--------+
        
        :param manifestTemplates: 商品模版信息列表 , 每条数据类型 :data:`manifestTemplate`
        :type manifestTemplates: List
        
        Example::
        
            {
                ...
                "manifestTemplates": [
                    {
                        "mtid": 1,
                        "name": "商品模版",
                        "comment": "说明",
                        "status": 0,
                        "company": 0
                    }
                ],
                ...
            }
            
    .. method:: <I> queryManifestTemplateItemByMtid
    
        通过商品模版ID获取商品模版项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: String
        
        Example::
        
            {
                "manifestTemplate.mtid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifestTemplates: 商品模版信息列表 , 每条数据类型 :data:`manifestTemplate`
        :type manifestTemplates: List
        
        Example::
        
            {
                ...
                "manifestTemplateItems": [
                    {
                        "mtiid": 1,
                        "manifestTemplate": {
                            "mtid": 1,
                            "name": "商品模版",
                            "comment": "说明",
                            "status": 0,
                            "company": 0
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
                        }
                    }
                ],
                ...
            }
            
    .. method:: <I> queryManifestItemByMtid
    
        通过商品模版ID获取上包含的商品信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: String
        
        Example::
        
            {
                "manifestTemplate.mtid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifestItems: 商品信息列表 , 每条数据类型 :data:`manifestItem`
        :type manifestItems: List
        
        Example::
        
            {
                ...
                "manifestItems": [
                    {
                        "mtiid": 1,
                        "manifestTemplate": {
                            "mtid": 1,
                            "name": "商品模版",
                            "comment": "说明",
                            "status": 0,
                            "company": 0
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
                        }
                    }
                ],
                ...
            }
            
    .. method:: <I> queryManifestItemBySiids
    
        通过销售项列表获取对应的货单项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param siids[n]: 销售项ID列表 , 每条数据类型 Long
        :type siids[n]: List
        
        Example::
        
            {
                "siids[0]": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param manifestItems: 商品信息列表 , 每条数据类型 :data:`manifestItem`
        :type manifestItems: List
        
        Example::
        
            {
                ...
                "manifestItems": [
                    {
                        "mtiid": 1,
                        "manifestTemplate": {
                            "mtid": 1,
                            "name": "商品模版",
                            "comment": "说明",
                            "status": 0,
                            "company": 0
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
                        }
                    }
                ],
                ...
            }
            
    .. method:: <I> addManifestTemplate
    
        添加商品模版
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.name: 模版名
        :type manifestTemplate.name: String
        :param manifestTemplate.comment: 说明
        :type manifestTemplate.comment: String
        
        Example::
        
            {
                "manifestTemplate.name": "模版",
                "manifestTemplate.comment": ""
            }
            
    .. method:: <I> addManifestTemplateItem
    
        添加商品模版项
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: Long
        :param miIds[n]: 商品ID列表 , 每条数据类型 Long
        :type miIds[n]: List
        
        Example::
        
            {
                "manifestTemplate.mtid": 1,
                "miIds[0]": 1
            }
            
    .. method:: <I> updateManifestTemplate
    
        更新商品模版
        
        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: Long
        :param manifestTemplate.name: 模版名
        :type manifestTemplate.name: String
        :param manifestTemplate.comment: 说明
        :type manifestTemplate.comment: String
        
        Example::
        
            {
                "manifestTemplate.mtid": 1,
                "manifestTemplate.name": "模版",
                "manifestTemplate.comment": ""
            }
            
    .. method:: <I> updateManifestTemplateForStatus
    
        更新商品模版状态
        
        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**
    
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: Long
        :param manifestTemplate.status: 状态
        :type manifestTemplate.status: Short
        
        Example::
        
            {
                "manifestTemplate.mtid": 1,
                "manifestTemplate.status": 0
            }
        
    .. method:: <I> deleteManifestTemplate
    
        删除商品模版
        
        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: Long
        
        Example::
        
            {
                "manifestTemplate.mtid": 1
            }
            
    .. method:: <I> deleteManifestTemplateItem
    
        删除商品模版项
        
        +---------+
        |Requests:|
        +---------+
        
        :param manifestTemplate.mtid: 商品模版ID
        :type manifestTemplate.mtid: Long
        :param mtiIds[n]: 商品ID列表 , 每条数据类型 Long
        :type mtiIds[n]: List
        
        Example::
        
            {
                "manifestTemplate.mtid": 1,
                "mtiIds[0]": 1
            }
            
合同
================

模版
----------------

.. class:: api.communion.ContractAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: contract
    
    :param cid: 模版ID
    :type cid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param title: 标题
    :type title: String
    :param page: 页面
    :type page: String
    :param path: 路径
    :type path: String
    :param videopath: 视频路径
    :type vodeopath: String
    :param atttype: 业务类型 , 0: 装修 , 1: 人员
    :type atttype: Short
    :param status: 状态 , 0: 启用, 1: 禁用
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> pageContract
    
        分页方式获取合同模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 合同模版列表 , 每条数据类型 :data:`contract`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "no": "74HENIDH121H",
                            "name": "合同模版",
                            "title": "合同标题",
                            "page": "contract.html",
                            "path": "/ASDLFKJDSJFSADFLKJ",
                            "vodeopath": "/ASDLFKJDSJFSADFLKJ",
                            "atttype": 1,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryContract
    
        查询合同信息 , 状态为0(启用)
        
        +---------+
        |Requests:|
        +---------+
        
        :param contract.atttype: 业务类型
        :type contract.atttype: Short
        
        Example::
        
            {
                "contract.atttype": 0
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param constracts: 合同模版列表 , 每条数据类型 :data:`contract`
        :type constracts: List
        
        Example::
        
            {
                ...
                "constracts": [
                    {
                        "cid": 1,
                        "no": "74HENIDH121H",
                        "name": "合同模版",
                        "title": "合同标题",
                        "page": "contract.html",
                        "path": "/ASDLFKJDSJFSADFLKJ",
                        "vodeopath": "/ASDLFKJDSJFSADFLKJ",
                        "atttype": 0,
                        "status": 0
                    }
                ],
                ...
            }

    .. method:: <I> countContract
    
        统计合同
        
        +--------+
        |Returns:|
        +--------+
        
        :param count: 总数
        :type count: Integer
        
        Example::
        
            {
                ...
                "count": 0
                ...
            }

    .. method:: <I> addContract
    
        添加合同
        
        判断合同编号是否存在 , 已经存在 , 错误信息 **130043 合同模版已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param contract.no: 编号
        :type contract.no: String
        :param contract.name: 名称
        :type contract.name: String
        :param contract.title: 标题
        :type contract.title: String
        :param contract.page: 页面
        :type contract.page: String
        :param contract.path: 文件路径
        :type contract.path: String
        :param contract.videopath: 文件路径
        :type contract.videopath: String
        :param contract.atttype: 业务类型
        :type contract.atttype: Short
        
        Example::
        
            {
                "contract.no": "74HENIDH121H",
                "contract.name": "合同模版",
                "contract.title": "合同标题",
                "contract.page": "contract.html",
                "contract.path": "/ASDLFKJDSJFSADFLKJ",
                "contract.videopath": "/ASDLFKJDSJFSADFLKJ",
                "contract.atttype": 0
            }

    .. method:: <I> updateContract
    
        更新合同
        
        判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param contract.cid: 模版ID
        :type contract.cid: Long
        
        Example::
        
            {
                "contract.cid": 1
            }

    .. method:: <I> updateContractForStatus
    
        更新合同状态
        
        判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param contract.cid: 模版ID
        :type contract.cid: Long
        :param contract.status: 状态
        :type contract.status: Short
        
        Example::
        
            {
                "contract.cid": 1,
                "contract.status": 0
            }
            
签章
----------------

.. class:: api.communion.SignetAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: signet
    
    :param sid: 签章ID
    :type sid: Long
    :param no: 编号
    :type no: String
    :param name: 名称
    :type name: String
    :param keyword: 关键字
    :type keyword: String
    :param path: 路径
    :type path: String
    :param type: 类型 , 0: 合同 , 1: 款项 , 2: 人资
    :type type: Short
    :param status: 状态 , 0: 初始, 1: 注册, 2: 认证, 3: 确认 , 4: 签章 , 5: 作废
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    :param signno: 签章编号
    :type signno: String
    :param token: 签章令牌
    :type token: String
    :param authurl: 认证路径
    :type authurl: String
    
    .. method:: <I> pageSignet
    
        分页方式获取签章信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 签章列表 , 每条数据类型 :data:`signet`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "IN31HJOS",
                            "name": "签章名称",
                            "keyword": "关键字",
                            "path": "/ASDLFKJDSJFSADFLKJ",
                            "type": 0,
                            "status": 0,
                            "signno": "SKF3JK324H23KL4J",
                            "toke": "jk2j31k23j1ggsdpfj3ij23",
                            "authurl": "",
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> querySignet
    
        查询签章信息 , 状态为0(初始)/1(注册)/2(认证)
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.type: 类型
        :type signet.type: Short
        
        Example::
        
            {
                "signet.type": 0
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param signets: 签章列表 , 每条数据类型 :data:`signet`
        :type signets: List
        
        Example::
        
            {
                ...
                "signets": [
                    {
                        "sid": 1,
                        "no": "IN31HJOS",
                        "name": "签章名称",
                        "keyword": "关键字",
                        "path": "/ASDLFKJDSJFSADFLKJ",
                        "type": 0,
                        "status": 0,
                        "signno": "SKF3JK324H23KL4J",
                        "toke": "jk2j31k23j1ggsdpfj3ij23",
                        "authurl": "",
                    }
                ],
                ...
            }

    .. method:: <I> querySignetBySid
    
        通过印章ID查询签章信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 印章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param signet: 签章信息 , 类型 :data:`signet`
        :type signet: Object
        
        Example::
        
            {
                ...
                "signet": {
                    "sid": 1,
                    "no": "IN31HJOS",
                    "name": "签章名称",
                    "keyword": "关键字",
                    "path": "/ASDLFKJDSJFSADFLKJ",
                    "type": 0,
                    "status": 0,
                    "signno": "SKF3JK324H23KL4J",
                    "toke": "jk2j31k23j1ggsdpfj3ij23",
                    "authurl": "",
                },
                ...
            }

    .. method:: <I> addSignet
    
        添加签章
        
        判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.no: 编号
        :type signet.no: String
        :param signet.name: 名称
        :type signet.name: String
        :param signet.keyword: 关键字
        :type signet.keyword: String
        :param signet.path: 文件路径
        :type signet.path: String
        :param signet.type: 类型
        :type signet.type: Short
        
        Example::
        
            {
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ",
                "signet.type": 0
            }

    .. method:: <I> copySignet
    
        赋值签章
        
        判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: String
        :param signet.no: 编号
        :type signet.no: String
        :param signet.name: 名称
        :type signet.name: String
        :param signet.keyword: 关键字
        :type signet.keyword: String
        
        Example::
        
            {
                "signet.sid": 1,
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }

    .. method:: <I> moveSignet

    .. method:: <I> updateSignet
    
        更新签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        :param signet.no: 编号
        :type signet.no: String
        :param signet.name: 名称
        :type signet.name: String
        :param signet.keyword: 关键字
        :type signet.keyword: String
        :param signet.path: 文件路径
        :type signet.path: String
        
        Example::
        
            {
                "signet.sid": 1,
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }

    .. method:: <I> registSignet
    
        注册签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为0(初始) , 其他状态 , 错误信息 **130047 签章状态不可操作**
        
        更新签章状态为1(注册)
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }

    .. method:: <I> authSignet
    
        认证签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为1(注册) , 其他状态 , 错误信息 **130047 签章状态不可操作**
        
        更新签章状态为2(认证)
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }

    .. method:: <I> confirmSignet
    
        确认签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为2(认证) , 其他状态 , 错误信息 **130047 签章状态不可操作**
        
        更新签章状态为3(确认)
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }

    .. method:: <I> signateSignet

        上传签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        :param signet.path: 文件路径
        :type signet.path: String
        
        Example::
        
            {
                "signet.sid": 1,
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }
            
    .. method:: <I> autoSignet
    
        自动签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param signet.path: 自动签章地址
        :type signet.path: String
        
        Example::
        
            {
                ...
                "signet": {
                    "path": "ASDLFKJDSJFSADFLKJ"
                },
                ...
            }

    .. method:: <I> selectSignet
    
        选择签章 , 配置签章所使用印章信息
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**
    
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        :param signet.signid: 印章编号
        :type signet.signid: String
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        :param signet.signid: 印章编号
        :type signet.signid: String
        
        Example::
        
            {
                "signet.sid": 1,
                "signet.signid": "IN31HJOS"
            }

    .. method:: <I> cancelSignet
    
        作废签章
        
        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "signet.sid": 1
            }

印章
----------------

.. class:: api.communion.FadadaAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: signature
    
    :param customerId: 客户编号
    :type customerId: String
    :param signatureId: 印章编号
    :type signatureId: String
    :param path: 图片地址
    :type path: String
    :param image: 图片内容(base64)
    :type image: String
    :param defaults: 默认标识 , 0: 标准 , 1: 默认
    :type defaults: Short
    :param type: 类型 , 0: 个人 , 1: 公司
    :type type: Short
    
    .. method:: <I> pollingSignature
    
        查询印章信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param signature.customerId: 客户编号
        :type signature.customerId: String
        
        Example::
        
            {
                "signature.customerId": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param signatures: 印章列表 , 每条数据类型 :data:`signature`
        :type signatures: List
        
        Example::
        
            {
                ...
                "signatures": [
                    {
                        "customerId": "DA20D4",
                        "signatureId": "IN31HJOS",
                        "path": "/ASDLFKJDSJFSADFLKJ",
                        "image": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
                        "defaults": 0,
                        "type": 1
                    }
                ],
                ...
            }

    .. method:: <I> addSignature
    
        添加印章信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param signature.customerId: 客户编号
        :type signature.customerId: String
        :param signature.path: 客户编号
        :type signature.path: String
        
        Example::
        
            {
                "signature.customerId": 1,
                "signature.path": "/ASDLFKJDSJFSADFLKJ",
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param signature: 印章信息 , 类型 :data:`signature`
        :type signature: Object
        
        Example::
        
            {
                ...
                "signature": {
                    "customerId": "DA20D4",
                    "signatureId": "IN31HJOS",
                    "image": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
                    "defaults": 0,
                    "type": 1
                }
                ...
            }

    .. method:: <I> defaultSignature
    
        默认印章
        
        +---------+
        |Requests:|
        +---------+
        
        :param signature.customerId: 客户编号
        :type signature.customerId: String
        :param signature.signatureId: 印章编号
        :type signature.signatureId: String
        
        Example::
        
            {
                "signature.customerId": 1,
                "signature.signatureId": "IN31HJOS"
            }

    .. method:: <I> deleteSignature
    
        删除印章
        
        +---------+
        |Requests:|
        +---------+
        
        :param signature.customerId: 客户编号
        :type signature.customerId: String
        :param signature.signatureId: 印章编号
        :type signature.signatureId: String
        
        Example::
        
            {
                "signature.customerId": 1,
                "signature.signatureId": "IN31HJOS"
            }

话术
----------------

.. class:: api.communion.TalkingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: talking
    
    :param tid: 话术ID
    :type tid: Long
    :param name: 名称
    :type name: String
    :param type: 类型 , 0: 施工合同
    :type type: Short
    :param content: 内容
    :type content: String
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. method:: <I> pageTalking
    
        分页方式获取话术信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 签章列表 , 每条数据类型 :data:`talking`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "tid": 1,
                            "name": "话术名称",
                            "content": "话术内容"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryTalking
    
        根据类型查询话术 , 状态为0(有效)
    
        +---------+
        |Requests:|
        +---------+
        
        :param talking.type: 类型
        :type talking.type: Short
        
        Example::
        
            {
                "talking.type": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param talkings: 话术列表 , 每条数据类型 :data:`talking`
        :type talkings: List
        
        Example::
        
            {
                ...
                "talkings": [
                    {
                        "tid": 1,
                        "name": "话术名称",
                        "content": "话术内容"
                    }
                ],
                ...
            }
            
    .. method:: <I> addTalking
    
        添加话术
        
        +---------+
        |Requests:|
        +---------+
        
        :param talking.name: 名称
        :type talking.name: String
        :param talking.type: 类型
        :type talking.type: Short
        :param talking.content: 内容
        :type talking.content: String
        
        Example::
        
            {
                "talking.name": "名称",
                "talking.type": 0,
                "talking.content": "内容"
            }
            
    .. method:: <I> updateTalking
    
        更新话术
        
        判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param talking.tid: 话术ID
        :type talking.tid: Long
        :param talking.name: 名称
        :type talking.name: String
        :param talking.type: 类型
        :type talking.type: Short
        :param talking.content: 内容
        :type talking.content: String
        
        Example::
        
            {
                "talking.tid": 1,
                "talking.name": "名称",
                "talking.type": 0,
                "talking.content": "内容"
            }
            
    .. method:: <I> updateTalkingForStatus
    
        更新话术状态
        
        判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param talking.tid: 话术ID
        :type talking.tid: Long
        :param talking.status: 状态
        :type talking.status: Short
        
        Example::
        
            {
                "talking.tid": 1,
                "talking.status": 0
            }
            
    .. method:: <I> deleteTalking
    
        删除话术
        
        +---------+
        |Requests:|
        +---------+
        
        :param talking.tid: 话术ID
        :type talking.tid: Long
        
        Example::
        
            {
                "talking.tid": 1
            }

图片
================

图片信息管理 , 提供如楼盘图片等资源

.. class:: api.communion.DataDrawingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: dataDrawing
    
    :param ddid: 图片ID
    :type ddid: Long
    :param sid: 关联ID
    :type sid: Long
    :param name: 名称
    :type name: String
    :param drawingUrl: 图片路径
    :type drawingUrl: String
    :param drawingType: 图片类型 , 0: 本地 , 1: 钉钉
    :type drawingType: Short
    :param type: 类型 , 0: 楼盘 , 1: 户型 , 2: 商品 , 3: 选材 , 4: 辅材 , 5: 商品池
    :type type: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> queryDataDrawing
    
        通过关联ID以及类型获取图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dataDrawing.sid: 关联ID
        :type dataDrawing.sid: Long
        :param dataDrawing.type: 类型
        :type dataDrawing.type: Short
        
        Example::
        
            {
                "dataDrawing.sid": 1,
                "dataDrawing.type": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dataDrawings: 图片信息列表 , 每条数据类型 :data:`dataDrawing`
        :type dataDrawings: List
        
        Example::
        
            {
                ...
                "dataDrawings": [
                    {
                        "ddid": 1,
                        "sid": 1,
                        "name": "SDFK4DFS4D5",
                        "drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                        "drawingType": 0,
                        "type": 0,
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
            
    .. method:: <C> addDataDrawing
    
        添加图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dataDrawing.sid: 关联ID
        :type dataDrawing.sid: Long
        :param dataDrawing.name: 名称
        :type dataDrawing.name: String
        :param dataDrawing.drawingUrl: 路径
        :type dataDrawing.drawingUrl: String
        :param dataDrawing.drawingType: 图片类型
        :type dataDrawing.drawingType: Short
        :param dataDrawing.type: 类型
        :type dataDrawing.type: Short
        
        Example::
        
            {
                "dataDrawing.sid": 1,
                "dataDrawing.name": "name.jpg",
                "dataDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "dataDrawing.drawingType": 0,
                "dataDrawing.type": 0
            }

    .. method:: <C> deleteDataDrawing
    
        删除图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dataDrawing.ddid: 图片ID
        :type dataDrawing.ddid: Long
        
        Example::
        
            {
                "dataDrawing.ddid": 1
            }

自检
----------------

.. class:: api.data.InspectAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: inspect
    
    :param iid: 自检ID
    :type iid: Long
    :param name: 名称
    :type name: String
    :param atttype: 业务类型 , 0: 通用 , 1: 装修 , 2: 销售
    :type atttype: Short
    :param type: 类型 , 0, 装修合同方案 , 1: 装修放线方案 , 2: 销售配送资料 , 3: 销售安装资料
    :type type: Short
    :param content: 内容
    :type content: String
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param company: 公司ID
    :type company: Integer
    
    .. data:: inspectItem
    
    :param iiid: 项目ID
    :type iiid: Long
    :param iid: 自检ID
    :type iid: Long
    :param title: 标题
    :type title: String
    :param type: 类型
    :type type: Short
    :param isRequire: 必填标识
    :type isRequire: Short
    
    .. method:: <I> pageInspect
    
    .. method:: <I> queryInspect
    
    .. method:: <I> queryInspectItem
    
    .. method:: <I> addInspect
    
    .. method:: <I> addInspectItem
    
    .. method:: <I> updateInspect
    
    .. method:: <I> updateInspectForStatus
    
    .. method:: <I> updateInspectItem
    
    .. method:: <I> deleteInspectItem
    
    