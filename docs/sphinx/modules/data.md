# data 数据
## 楼盘

楼盘信息管理

## api.communion.VillageAction

**数据类型**:

#### village

    - **vid**: 楼盘ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **pinyinAB**: 拼音缩写
      - 类型: *String*
    - **pinyinAll**: 拼音
      - 类型: *String*
    - **cityProper**: 城区 , 类型 [cityProper](./system.html#api.system.CityProperAction.cityProper)
      - 类型: *Object*
    - **developer**: 开发商
      - 类型: *String*
    - **salesPhone**: 销售电话
      - 类型: *String*
    - **deliveryTime**: 开盘时间
      - 类型: *String*
    - **x**: 楼盘位置坐标 , 经度
      - 类型: *Integer*
    - **y**: 楼盘位置坐标 , 纬度
      - 类型: *Integer*
    - **url**: 默认图片
      - 类型: *String*
    - **content**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 禁用 , 1: 启用
      - 类型: *Short*

    #### keyValue

    - **key**: 键
      - 类型: *String*
    - **value**: 值
      - 类型: *String*

    ### `pageVillage` <span style="color:gray">[内部]</span>

        分页方式获取楼盘信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  楼盘信息列表 , 每条数据类型 *village*

        **示例**:{
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

    ### `queryVillageByVid` <span style="color:gray">[内部]</span>

        通过楼盘ID获取楼盘信息

**请求参数**:

- **village.vid**:
  楼盘ID

        **示例**:{
                "village.vid": 1
            }

**返回参数**:

- **vilalge**: 楼盘信息 , 类型 *village*
          - 类型: *object*

        **示例**:{
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

    ### `queryVillageForNameByPinyin` <span style="color:gray">[内部]</span>

        通过拼音信息获取楼盘名称信息

**请求参数**:

- **pinyinName**: 楼盘名拼音
          - 类型: *String*

        **示例**:{
                "pinyinName": "wd"
            }

**返回参数**:

- **autoFillKeyValue**: 键值列表 , 每条数据类型 *keyValue* , 键为楼盘编号 , 值为楼盘名
          - 类型: *List*
        - **autoFillList**: 楼盘名列表 , 每条数据类型String
          - 类型: *List*

        **示例**:{
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

    ### `addVillage` <span style="color:blue">[自定义]</span>

        添加楼盘信息

        根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**

**请求参数**:

- **village.name**:
  楼盘名称
        - **village.no**:
  城区编号
        - **village.developer**:
  开发商
        - **village.salesPhone**:
  销售电话
        - **village.deliveryTime**:
  开盘时间
        - **village.content**:
  说明
        - **village.x**:
  经度
        - **village.y**:
  纬度

        **示例**:{
                "village.name": "广场一期",
                "village.no": "CP001",
                "village.developer": "222",
                "village.salesPhone": "",
                "village.deliveryTime": null,
                "village.x": 0,
                "village.y": 0,
                "village.content": "",
            }

    ### `updateVillage` <span style="color:blue">[自定义]</span>

        更新楼盘信息

        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

        根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**

**请求参数**:

- **village.vid**:
  楼盘ID
        - **village.name**:
  楼盘名称
        - **village.cityProper.cpid**:
  城区ID
        - **village.developer**:
  开发商
        - **village.salesPhone**:
  销售电话
        - **village.deliveryTime**:
  开盘时间
        - **village.content**:
  说明
        - **village.x**:
  经度
        - **village.y**:
  纬度

        **示例**:{
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

    ### `updateVillageForStatus` <span style="color:blue">[自定义]</span>

        更新楼盘状态 , 启用禁用

        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**请求参数**:

- **village.vid**:
  楼盘ID
        - **village.status**:
  状态 , 0: 禁用 , 1: 启用

        **示例**:{
                "village.vid": 1,
                "village.status": 0
            }

    ### `updateVillageForPosition` <span style="color:blue">[自定义]</span>

        更新楼盘位置信息

        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**请求参数**:

- **village.vid**:
  楼盘ID
        - **village.x**:
  横坐标
        - **village.y**:
  纵坐标

        **示例**:{
                "village.vid": 1,
                "village.x": 0,
                "village.y": 0
            }

    ### `updateVillageForUrl` <span style="color:blue">[自定义]</span>

        更新楼盘默认图片

        判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**请求参数**:

- **village.vid**:
  楼盘ID
        - **village.url**:
  默认图片

        **示例**:{
                "village.vid": 1,
                "village.url": "/JSIODFNSNDF.JPG"
            }


## 规则

## api.communion.VillageRuleAction

**数据类型**:

#### villageRule

    - **vrid**: 规则ID
      - 类型: *Long*
    - **vid**: 楼盘ID
      - 类型: *Long*
    - **rule**: 规则 , [buildingNameRule](./data.html#api.data.BuildingNameRuleAction.buildingNameRule)
      - 类型: *Object*

    ### `queryVillageRule` <span style="color:gray">[内部]</span>

    ### `addVillageRule` <span style="color:gray">[内部]</span>

    ### `deleteVillageRule` <span style="color:gray">[内部]</span>

## 户型

## api.communion.HouseLayoutAction

**数据类型**:

#### houseLayout

    - **hlid**: 户型ID
      - 类型: *Long*
    - **village**: 楼盘 , [village](./data.html#api.data.VillageAction.village)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **layout**: 房型
      - 类型: *String*
    - **area**: 面积
      - 类型: *Long*
    - **houseType**: 类型
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*

    ### `pageHouseLayout` <span style="color:gray">[内部]</span>

        分页方式获取户型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  户型信息列表 , 每条数据类型 *houseLayout*

        **示例**:{
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

    ### `queryHouseLayout` <span style="color:gray">[内部]</span>

        根据楼盘ID获取户型信息

**请求参数**:

- **houseLayout.vid**:
  楼盘ID

        **示例**:{
                "houseLayout.vid": 1
            }

**返回参数**:

- **houseLayouts**: 户型信息列表 , 每条数据类型 *houseLayout*
          - 类型: *List*

        **示例**:{
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

    ### `addHouseLayout` <span style="color:gray">[内部]</span>

        添加户型信息

**请求参数**:

- **houseLayout.name**:
  名称
        - **houseLayout.village.vid**:楼盘ID
        :tyoe houseLayout.village.vid: Long
        - **houseLayout.layout**:
  房型
        - **houseLayout.area**:
  面积
        - **houseLayout.houseType**:
  类型
        - **houseLayout.comment**:
  备注

        **示例**:{
                "houseLayout.name": "名称",
                "houseLayout.village.vid": 1,
                "houseLayout.layout": "",
                "houseLayout.area": 100000,
                "houseLayout.houseType": "",
                "houseLayout.comment": "说明",
            }

    ### `deleteHouseLayout` <span style="color:blue">[自定义]</span>

        删除户型信息

**请求参数**:

- **houseLayout.hlid**:
  户型ID

        **示例**:{
                "houseLayout.hlid": 1
            }

## 房产

## api.communion.HouseAction

**数据类型**:

#### house

    - **hid**: 房产ID
      - 类型: *Long*
    - **village**: 楼盘 , 类型 [village](./data.html#api.data.VillageAction.village)
      - 类型: *Object*
    - **houseNumber**: 楼牌号
      - 类型: *String*
    - **built**: 楼号
      - 类型: *Integer*
    - **unit**: 单元
      - 类型: *Integer*
    - **floor**: 楼层
      - 类型: *Integer*
    - **door**: 门号
      - 类型: *Integer*
    - **type**: 房产类型 , 包括: 0(住宅) , 1(半越住宅) , 2(全越住宅) , 3(门市房) , 4(窗改门) , 5(商住综合) , 6(酒店公寓) , 7(写字间) , 8(别墅厂房) , 9(仓库) , 10(车库) , 11(其它)
      - 类型: *Short*
    - **buildArea**: 建筑面积
      - 类型: *Integer*
    - **freeArea**: 赠送面积
      - 类型: *Integer*
    - **innerArea**: 套内面积
      - 类型: *Integer*
    - **quoteArea**: 报价面积
      - 类型: *Integer*
    - **totalArea**: 总面积
      - 类型: *Integer*
    - **maxFloor**: 最高楼层
      - 类型: *Short*
    - **through**: 是否越层 , 包括: 0(否) , 1(是)
      - 类型: *Short*
    - **roomNum**: 房间数量
      - 类型: *Integer*
    - **houseType**: 户型 , 例如: 1室1厅1卫1厨
      - 类型: *String*
    - **orientation**: 房屋朝向 , 包括: 0(南北) , 1(东西) , 2(双阳) , 3(双东) , 4(双西) , 5(双北) , 6(东南) , 7(东北) , 8(西南) , 9(西北) , 10(其它)
      - 类型: *Short*
    - **feature**: 三不 , 包括: 封顶 , 把东山 , 把西山 , 挡光 , 临街 , 不想
      - 类型: *String*
    - **waterVapour**: 水气设施 , 包括: 0(两水一气) , 1(两水两气) , 2(三水两气)
      - 类型: *Short*
    - **parlourType**: 客厅类型 , 包括: 0(明厅) , 1(暗厅)
      - 类型: *Short*
    - **heatingType**: 供暖类型 , 包括: 0(热网) , 1(锅炉房) , 2(燃气)
      - 类型: *Short*
    - **status**: 状态 , 包括: 0(初始)
      - 类型: *Short*

    ### `pageHouse` <span style="color:gray">[内部]</span>

        分页方式获取房产信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  房产信息列表 , 每条数据类型 *house*

        **示例**:{
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

    ### `queryHouseByHid` <span style="color:gray">[内部]</span>

        根据房产ID获取房产信息

**请求参数**:

- **house.hid**:
  房产ID

        **示例**:{
                "house.hid": 1
            }

**返回参数**:

- **houses**: 房产信息列表 , 每条数据类型 *house*
          - 类型: *List*

        **示例**:{
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

    ### `queryHouseByNoAHnum` <span style="color:gray">[内部]</span>

        通过楼盘编号以及楼牌号查询房产信息

**请求参数**:

- **house.village.no**:
  楼盘编号
        - **house.houseNumber**:
  楼牌号

        **示例**:{
                "house.village.no": "P001",
                "house.houseNumber": "1#1-1-1"
            }

**返回参数**:

- **houses**: 房产信息列表 , 每条数据类型 *house*
          - 类型: *List*

        **示例**:{
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

    ### `addHouse` <span style="color:blue">[自定义]</span>

        添加房产信息

        判断楼盘号是否存在 , 错误信息 **320001 楼牌号已存在**

**请求参数**:

- **house.village.vid**:
  楼盘ID
        - **house.houseNumber**:
  楼牌号
        - **house.built**:
  楼号
        - **house.unit**:
  单元
        - **house.floor**:
  楼层
        - **house.door**:
  门号
        - **house.type**:
  房产类型
        - **house.buildArea**:
  建筑面积
        - **house.freeArea**:
  赠送面积
        - **house.innerArea**:
  套内面积
        - **house.totalArea**:
  总面积
        - **house.maxFloor**:
  最高楼层
        - **house.through**:
  是否越层
        - **house.roomNum**:
  房间数量
        - **house.houseType**:
  户型
        - **house.orientation**:
  房屋朝向
        - **house.feature**:
  三不
        - **house.waterVapour**:
  水气设施
        - **house.parlourType**:
  客厅类型
        - **house.heatingType**:
  供暖类型

        **示例**:{
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

    ### `existHouse` <span style="color:gray">[内部]</span>

        通过楼盘ID和楼号判断房产信息 , 不存在创建 , 存在返回房产信息

**请求参数**:

- **house.village.vid**:
  楼盘ID
        - **house.houseNumber**:
  楼牌号
        - **house.buildArea**:
  建筑面积
        - **house.freeArea**:
  赠送面积
        - **house.innerArea**:
  套内面积
        - **house.totalArea**:
  总面积
        - **house.built**:
  楼号
        - **house.unit**:
  单元
        - **house.floor**:
  楼层
        - **house.door**:
  门号

        **示例**:{
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

    ### `updateHouse` <span style="color:blue">[自定义]</span>

        更新房产信息

        判断房产是否存在 , 错误信息 **320002 房产不存在**

        判断房产状态是否为已出售 , 已出售房产状态不可操作 , 错误信息 **320003 房产状态不可操作**

**请求参数**:

- **house.hid**:
  房产ID
        - **house.buildArea**:
  建筑面积
        - **house.freeArea**:
  赠送面积
        - **house.innerArea**:
  套内面积
        - **house.totalArea**:
  总面积
        - **house.maxFloor**:
  最高楼层
        - **house.through**:
  是否越层
        - **house.roomNum**:
  房间数量
        - **house.houseType**:
  户型
        - **house.orientation**:
  房屋朝向
        - **house.feature**:
  三不
        - **house.waterVapour**:
  水气设施
        - **house.parlourType**:
  客厅类型
        - **house.heatingType**:
  供暖类型

        **示例**:{
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

    ### `updateHouseForStatus` <span style="color:blue">[自定义]</span>

        更新房产信息状态

**请求参数**:

- **house.hid**:
  房产ID
        - **house.status**:
  状态

        **示例**:{
                "house.hid": 1
                "house.status": 1
            }

## 基础

### 常量

## api.communion.ConstantAction

**数据类型**:

#### constant

    - **cid**: 常量ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **module**: 模块
      - 类型: *String*
    - **clazz**: 对象
      - 类型: *String*
    - **type**: 类型
      - 类型: *String*
    - **field**: 字段名
      - 类型: *String*
    - **key**: 键
      - 类型: *String*
    - **value**: 值
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageConstant` <span style="color:blue">[自定义]</span>

        分页方式获取常量信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  常量信息列表 , 每条数据类型 *constant*

        **示例**:{
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

    ### `queryConstant` <span style="color:blue">[自定义]</span>

        获取常量信息

**返回参数**:

- **constants**: 常量信息列表 , 每条数据类型 *constant*
          - 类型: *List*

        **示例**:{
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

    ### `addConstant` <span style="color:blue">[自定义]</span>

    ### `updateConstant` <span style="color:blue">[自定义]</span>

    ### `updateConstantForStatus` <span style="color:blue">[自定义]</span>

    ### `deleteConstant` <span style="color:blue">[自定义]</span>

### 工种

工种信息管理

## api.communion.WorkTypeAction

**数据类型**:

#### workType

    - **wtid**: 工种ID
      - 类型: *Long*
    - **name**: 工种名称
      - 类型: *String*

    ### `queryWorkType` <span style="color:gray">[内部]</span>

        获取所有工种信息

**返回参数**:

- **workTypes**: 工种信息列表 , 每条数据类型 *workType*
          - 类型: *List*

        **示例**:{
                ...
                "workTypes": [
                    {
                        "wtid": 1,
                        "name": "力"
                    }
                ],
                ...
            }

### 单位

单位信息管理

## api.communion.MeasurementUnitAction

**数据类型**:

#### measurementUnit

    - **muid**: 单位ID
      - 类型: *Long*
    - **name**: 单位名称
      - 类型: *String*

    ### `pageMeasurementUnit` <span style="color:gray">[内部]</span>

        分页方式获取单位信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  单位信息列表 , 每条数据类型 *measurementUnit*

        **示例**:{
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

    ### `queryMeasurementUnit` <span style="color:gray">[内部]</span>

        获取所有单位信息

**返回参数**:

- **measurementUnits**: 单位信息列表 , 每条数据类型 *measurementUnit*
          - 类型: *List*

        **示例**:{
                ...
                "measurementUnits": [
                    {
                        "muid": 1,
                        "name": "米"
                    }
                ],
                ...
            }

    ### `addMeasurementUnit` <span style="color:blue">[自定义]</span>

        添加单位信息

        判断单位名称是否存在,已经存在,错误信息 **130010 单位已存在**

**请求参数**:

- **measurementUnit.name**:
  名称

        **示例**:{
                "measurementUnit.name": '个'
            }

    ### `updateMeasurementUnit` <span style="color:blue">[自定义]</span>

        编辑单位信息

        判断单位名称是否存在,不存在,错误信息 **130011 单位不存在**

**请求参数**:

- **measurementUnit.muid**:
  单位ID
        - **measurementUnit.name**:
  名称

        **示例**:{
                "measurementUnit.muid": 1,
                "measurementUnit.name": '个'
            }

### 职位

职位信息管理

## api.communion.DutyAction

**数据类型**:

#### duty

    - **did**: 职位ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **departmentType**: 部门类型 , 类型 `departmentType <./department.html#api.department.DepartmentTypeAction.departmentType>`_
      - 类型: *Object*
    - **type**: 类型 , 0: 产值 , 1: 非产值
      - 类型: *Short*
    - **status**: 状态 , 0(启用) , 1(禁用)
      - 类型: *Short*
    - **lead**: 领导标识 , 0: 标准 , 1: 领导
      - 类型: *Short*

    ### `pageDuty` <span style="color:gray">[内部]</span>

        分页方式获取职位信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  职位信息列表 , 每条数据类型 *duty*

        **示例**:{
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

    ### `queryDuty` <span style="color:gray">[内部]</span>

        获取职位信息 , 职位状态为启用

**返回参数**:

- **dutys**: 职位列表 , 每条数据类型 *duty*
          - 类型: *List*

        **示例**:{
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

    ### `queryDutyByName` <span style="color:gray">[内部]</span>

        获取职位信息 , 通过拼音/名称作为条件匹配

**请求参数**:

- **pinyinName**: 拼音
          - 类型: *String*
        - **duty.departmentType.dtid**:
  部门类型ID

        **示例**:{
                "pinyinName": "pinyin",
                "duty.departmentType.dtid": 1
            }

**返回参数**:

- **dutys**: 职位列表 , 每条数据类型 *duty*
          - 类型: *List*

        **示例**:{
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

    ### `queryDutyByDtid` <span style="color:gray">[内部]</span>

        通过部门类型ID获取职位信息

**请求参数**:

- **duty.departmentType.dtid**:
  部门类型ID

        **示例**:{
                "duty.departmentType.dtid": 1
            }

**返回参数**:

- **dutys**: 职位列表 , 每条数据类型 *duty*
          - 类型: *List*

        **示例**:{
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

    ### `addDuty` <span style="color:blue">[自定义]</span>

        添加职位信息

**请求参数**:

- **duty.name**:
  名称
        - **duty.lead**:
  领导标识
        - **duty.departmentType.dtid**:
  部门类型ID
        - **duty.type**:
  类型

        **示例**:{
                "duty.name": "设计师",
                "duty.lead": 0,
                "duty.departmentType.dtid": 1,
                "duty.type": 1
            }

    ### `updateDuty` <span style="color:blue">[自定义]</span>

        更新职位信息

        职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**

**请求参数**:

- **duty.did**:
  职位ID
        - **duty.name**:
  名称
        - **duty.lead**:
  领导标识

        **示例**:{
                "duty.did": 1,
                "duty.name": "设计师",
                "duty.lead": 0,
                "duty.departmentType.dtid": 1,
                "duty.type": 1
            }

    ### `updateDutyForStatus` <span style="color:blue">[自定义]</span>

        更新职位状态

        职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**

**请求参数**:

- **duty.did**:
  职位ID
        - **duty.status**:
  状态
        - **duty.lead**:
  领导标识

        **示例**:{
                "duty.did": 1,
                "duty.status": 0
            }

### 楼号规则

楼号规则信息管理

## api.communion.BuildingNameRuleAction

**数据类型**:

#### buildingNameRule

    - **bnrid**: 规则ID
      - 类型: *Long*
    - **no**: 规则编号
      - 类型: *String*
    - **rule**: 楼号规则
      - 类型: *String*
    - **example**: 规则样例
      - 类型: *String*
    - **content**: 规则说明
      - 类型: *String*
    - **filling**: 填充方式
      - 类型: *String*

    ### `pageBuildingNameRule` <span style="color:gray">[内部]</span>

        分页方式获取楼号规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  楼号规则信息列表 , 每条数据类型 *buildingNameRule*

        **示例**:{
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

    ### `queryBuildingNameRule` <span style="color:gray">[内部]</span>

        获取所有楼号规则信息

**返回参数**:

- **buildingNameRules**: 楼号规则列表 , 每条数据类型 *buildingNameRule*
          - 类型: *List*

        **示例**:{
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

### 外链

外链页面信息管理

## api.data.ChainPageAction

**数据类型**:

#### chainPage

    - **cpid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **url**: 地址
      - 类型: *String*
    - **companymark**: 公司标识
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    ### `queryChainPage` <span style="color:gray">[内部]</span>

        获取外链页面信息

**返回参数**:

- **chainPages**: 外链信息列表 , 每条数据类型 *chainPage*
          - 类型: *List*

        **示例**:{
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

    ### `queryChainPageForSelf` <span style="color:gray">[内部]</span>

        获取当前登录用户拥有外链

**请求参数**:

- **chainPage.name**:
  名称
        - **chainPage.url**:
  地址
        - **chainPage.comment**:
  说明

        **示例**:{
                "chainPage.name": "页面",
                "chainPage.url": "http://api.com",
                "chainPage.companymark": 1,
                "chainPage.comment": "说明"
            }

    ### `addChainPage` <span style="color:gray">[内部]</span>

        添加外链信息

**请求参数**:

- **chainPage.name**:
  名称
        - **chainPage.url**:
  地址
        - **chainPage.companymark**:
  公司标识
        - **chainPage.comment**:
  说明

        **示例**:{
                "chainPage.name": "页面",
                "chainPage.url": "http://api.com",
                "chainPage.companymark": 1,
                "chainPage.comment": "说明"
            }

    ### `deleteChainPage` <span style="color:gray">[内部]</span>

        删除外链信息

        外链已经被使用 , 删除失败 , 错误信息 **130013 外链已使用**

**请求参数**:

- **chainPage.cpid**:
  ID

        **示例**:{
                "chainPage.cpid": 1
            }

### 服务节点

## api.communion.ServiceNodeAction

**数据类型**:

#### serviceNode

    - **snid**: 服务节点ID
      - 类型: *Long*
    - **psnid**: 上级节点ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **detail**: 详述
      - 类型: *String*
    - **type**: 类型 , 0: 装修 , 1: 主材 , 2: 工程
      - 类型: *Short*
    - **attnode**: 业务节点 , 0: 创建 , 1: 预签 , 2: 签单 , 3: 付款
      - 类型: *Short*
    - **blankNum**: 间隔天数
      - 类型: *Integer*
    - **workNum**: 工期天数
      - 类型: *Integer*
    - **loop**: 是否循环
      - 类型: *Short*
    - **userType**: 人员类型 , 0: 员工 , 1: 经历 , 2: 总监
      - 类型: *Short*
    - **userDuty**: 人员职位
      - 类型: *Long*
    - **status**: 状态 , 0(启用) , 1(禁用)
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageServiceNode` <span style="color:gray">[内部]</span>

        分页方式获取服务节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  服务节点信息列表 , 每条数据类型 *serviceNode*

        **示例**:{
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

    ### `addServiceNode` <span style="color:blue">[自定义]</span>

        添加服务节点信息

**请求参数**:

- **serviceNode.name**:
  名称
        - **serviceNode.detail**:
  详述
        - **serviceNode.type**:
  类型

        **示例**:{
                "serviceNode.name": "报价",
                "serviceNode.detail": "报价详述",
                "serviceNode.type": 0
            }

    ### `updateServiceNode` <span style="color:blue">[自定义]</span>

        更新服务节点信息

        服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**

**请求参数**:

- **serviceNode.snid**:
  服务节点ID
        - **serviceNode.name**:
  名称
        - **serviceNode.detail**:
  详述
        - **serviceNode.type**:
  领导标识

        **示例**:{
                "serviceNode.snid": 1,
                "serviceNode.name": "报价",
                "serviceNode.detail": "报价详述",
                "serviceNode.type": 1
            }

    ### `updateServiceNodeForStatus` <span style="color:blue">[自定义]</span>

        更新服务节点状态

        服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**

**请求参数**:

- **serviceNode.snid**:
  职位ID
        - **serviceNode.status**:
  状态

        **示例**:{
                "serviceNode.snid": 1,
                "serviceNode.status": 0
            }

### 图表

## api.communion.ChartAction

**数据类型**:

#### chart

    - **cid**: 图表ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 1: 装修 , 2: 销售 , 3: 工程 , 4: 款项
      - 类型: *Short*
    - **level**: 等级 , 0: 集团 , 1: 公司 , 2: 大区 , 3: 部门
      - 类型: *Short*
    - **api**: 接口
      - 类型: *String*
    - **method**: 方法
      - 类型: *String*
    - **param**: 参数
      - 类型: *String*
    - **style**: 样式
      - 类型: *String*
    - **clazz**: 类型
      - 类型: *String*
    - **sort**: 排序
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*

    ### `pageChart` <span style="color:gray">[内部]</span>

        分页方式获取图表信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  图表信息列表 , 每条数据类型 *chart*

        **示例**:{
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

    ### `queryChart` <span style="color:gray">[内部]</span>

        获取图表信息

**请求参数**:

- **chart.type**:
  类型
        - **chart.level**:
  等级

        **示例**:{
                "chart.type": 1
            }

**返回参数**:

- **charts**: 图表信息列表 , 每条数据类型 *chart*
          - 类型: *List*

        **示例**:{
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

    ### `queryChartForLogin` <span style="color:gray">[内部]</span>

        获取当前用户所属角色拥有的图表信息

**返回参数**:

- **charts**: 图表信息列表 , 每条数据类型 *chart*
          - 类型: *List*

        **示例**:{
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

    ### `queryChartByRid` <span style="color:gray">[内部]</span>

        通过角色ID获取图表信息

**请求参数**:

- **role.rid**:
  角色ID

        **示例**:{
                "role.rid": 1
            }

**返回参数**:

- **charts**: 图表信息列表 , 每条数据类型 *chart*
          - 类型: *List*

        **示例**:{
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

    ### `updateRoleChartByRid` <span style="color:blue">[自定义]</span>

        通过角色ID更新角色拥有图表信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

        判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**

**请求参数**:

- **cids[n]**:
  图表ID列表 , 每条数据类型 Long
        - **role.rid**:
  角色编号

        **示例**:{
                "role.rid": 1,
                "cids[0]": 1,
            }

### 标签

## api.data.LabelAction

**数据类型**:

#### label

    - **lid**: 标签ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **scale**: 比例 , 范围: 1-100
      - 类型: *Short*
    - **type**: 类型 , 0: 风格, 1: 面积, 2: 楼盘, 3: 年龄
      - 类型: *Short*
    - **isShow**: 是否显示 , 0: 显示 , 1: 不显示
      - 类型: *Short*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*

    ### `pageLabel` <span style="color:gray">[内部]</span>

        分页方式获取标签消息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  标签信息列表 , 每条数据类型 *label*

        **示例**:{
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

    ### `queryLabel` <span style="color:gray">[内部]</span>

        获取标签信息 , 状态0(启用)

**返回参数**:

- **labels**: 标签信息列表 , 每条数据类型 *label*
          - 类型: *List*

        **示例**:{
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

    ### `addLabel` <span style="color:gray">[内部]</span>

        添加标签

**请求参数**:

- **label.name**:
  名称
        - **label.scale**:
  比例
        - **label.type**:
  类型

        **示例**:{
                "label.name": "中式",
                "label.scale": 15,
                "label.type": 0
            }

    ### `updateLabel` <span style="color:gray">[内部]</span>

        更新标签

        判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**

**请求参数**:

- **label.lid**:
  标签ID
        - **label.name**:
  名称
        - **label.scale**:
  比例
        - **label.type**:
  类型

        **示例**:{
                "label.lid": 1,
                "label.name": "中式",
                "label.scale": 15,
                "label.type": 0
            }

    ### `updateLabelForStatus` <span style="color:gray">[内部]</span>

        更新标签状态

        判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**

**请求参数**:

- **label.lid**:
  标签ID
        - **label.status**:
  状态

        **示例**:{
                "label.lid": 1,
                "label.status": 1
            }

### 流程

## api.data.FlowpathAction

**数据类型**:

#### flowpath

    - **fpid**: 流程ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **no**: 编号
      - 类型: *String*
    - **keyword**: 关键字
      - 类型: *String*
    - **type**: 类型
      - 类型: *Short*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*

    ### `pageFlowpath` <span style="color:gray">[内部]</span>

        分页方式获取流程信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  流程信息列表 , 每条数据类型 *flowpath*

        **示例**:{
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

    ### `queryFlowpath` <span style="color:gray">[内部]</span>

        获取流程信息

**请求参数**:

- **flowpath.fpid**:
  流程ID
        - **flowpath.keyword**:
  关键字

        **示例**:{
                "flowpath.fpid": 1,
                "flowpath.keyword": "",
            }

**返回参数**:

- **flowpaths**: 流程信息列表 , 每条数据类型 *flowpath*
          - 类型: *List*

        **示例**:{
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

    ### `addFlowpath` <span style="color:gray">[内部]</span>

        创建流程

**请求参数**:

- **flowpath.name**:
  名称
        - **flowpath.no**:
  编号
        - **flowpath.keyword**:
  关键字
        - **flowpath.type**:
  类型

        **示例**:{
                "flowpath.name": "流程信息",
                "flowpath.no": "FP0001",
                "flowpath.keyword": "FlowInfo",
                "flowpath.type": 0
            }

    ### `updateFlowpath` <span style="color:gray">[内部]</span>

        更新流程

        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**请求参数**:

- **flowpath.fpid**:
  流程ID
        - **flowpath.name**:
  名称
        - **flowpath.no**:
  编号
        - **flowpath.keyword**:
  关键字
        - **flowpath.type**:
  类型

        **示例**:{
                "flowpath.fpid": 1,
                "flowpath.name": "流程信息",
                "flowpath.no": "FP0001",
                "flowpath.keyword": "FlowInfo",
                "flowpath.type": 0
            }

    ### `deleteFlowpath` <span style="color:gray">[内部]</span>

        删除流程

        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**请求参数**:

- **flowpath.fpid**:
  流程ID

        **示例**:{
                "flowpath.fpid": 1
            }

## api.data.FlowitemAction

    #### flowitem

    - **fiid**: 节点ID
      - 类型: *Long*
    - **fpid**: 流程ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **content**: 内容
      - 类型: *String*
    - **type**: 类型
      - 类型: *Short*
    - **x**: x坐标
      - 类型: *Integer*
    - **y**: y坐标
      - 类型: *Integer*
    - **pfiid**: 上级节点ID
      - 类型: *Long*
    - **nfiid**: 下级节点ID
      - 类型: *Long*

    ### `queryFlowitem` <span style="color:gray">[内部]</span>

        获取流程节点

**请求参数**:

- **flowitem.fpid**:
  流程ID

        **示例**:{
                "flowitem.fpid": 1
            }

**返回参数**:

- **flowitems**: 流程节点信息列表 , 每条数据类型 *flowitem*
          - 类型: *List*

        **示例**:{
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

    ### `addFlowitem` <span style="color:gray">[内部]</span>

        添加流程节点

        判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**请求参数**:

- **flowpath.fpid**:
  流程ID

        - **flowitems[n].name**:
  名称
        - **flowitems[n].content**:
  内容
        - **flowitems[n].type**:
  类型
        - **flowitems[n].x**:
  x坐标
        - **flowitems[n].y**:
  y坐标
        - **flowitems[n].pfiid**:
  上级节点ID
        - **flowitems[n].nfiid**:
  下级节点ID

        **示例**:{
                "flowitems[0].fpid": 1,
                "flowitems[0].name": "流程信息",
                "flowitems[0].content": "",
                "flowitems[0].type": 0,
                "flowitems[0].x": 0,
                "flowitems[0].y": 0,
                "flowitems[0].pfiid": 0,
                "flowitems[0].nfiid": 0,
            }

    ### `deleteFlowItem` <span style="color:gray">[内部]</span>

        删除流程节点

**请求参数**:

- **flowitem.fpid**:
  流程ID

        **示例**:{
                "flowitem.fpid": 1
            }

### 帮助

## api.data.AssistanceAction

**数据类型**:

#### assistance

    - **aid**: 帮助ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **keyword**: 关键字
      - 类型: *String*
    - **atttype**: 业务类型
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*

    #### assistanceItem

    - **aiid**: 项目ID
      - 类型: *Long*
    - **aid**: 帮助ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **content**: 说明
      - 类型: *String*
    - **sort**: 排序
      - 类型: *Integer*

    - **drawings**: 图片
      - 类型: *List*

    ### `pageAssistance` <span style="color:gray">[内部]</span>

        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  帮助信息列表 , 每条数据类型 *assistance*

        **示例**:{
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

    ### `queryAssistance` <span style="color:blue">[自定义]</span>

    ### `queryAssistanceByAid` <span style="color:blue">[自定义]</span>

    ### `queryAssistanceByKeyword` <span style="color:blue">[自定义]</span>

    ### `addAssistance` <span style="color:blue">[自定义]</span>

    ### `updateAssistance` <span style="color:blue">[自定义]</span>

    ### `updateAssistanceForStatus` <span style="color:blue">[自定义]</span>

    ### `queryAssistanceItem` <span style="color:blue">[自定义]</span>

    ### `addAssistanceItem` <span style="color:blue">[自定义]</span>

    ### `updateAssistanceItem` <span style="color:blue">[自定义]</span>

## 客户

### 投诉原因

## api.customer.ComplasonAction

**数据类型**:

#### complason

    - **csid**: 投诉理由ID
      - 类型: *Long*
    - **type**: 类型 , 0: 设计 , 1: 业务 , 2: 工程 , 3: 销售
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageComplason` <span style="color:gray">[内部]</span>

        分页方式获取投诉原因信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  投诉原因信息列表 , 每条数据类型 *complason*

        **示例**:{
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

    ### `queryComplason` <span style="color:gray">[内部]</span>

        通过类型查询投诉原因

**请求参数**:

- **complason.type**:
  类型

        **示例**:{
                "complason.type": 1
            }

    ### `addComplason` <span style="color:gray">[内部]</span>

        添加投诉原因信息

**请求参数**:

- **complason.type**:
  类型
        - **complason.content**:
  类型

        **示例**:{
                "complason.type": 1,
                "complason.content": "内容"
            }

    ### `updateComplasonForStatus` <span style="color:gray">[内部]</span>

        更新投诉原因状态

**请求参数**:

- **complason.csid**:
  原因ID
        - **complason.status**:
  类型

        **示例**:{
                "complason.csid": 1,
                "complason.status": 0
            }

### 调研模版

## api.data.SurveyTemplateAction

**数据类型**:

#### surveyTemplate

    - **stid**: 模版ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **isSend**: 推送标识 , 0: 手动 , 1: 自动
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    - **items**: 项目列表 , 每条数据类型 [surveyTemplateItem](./data.html#api.data.SurveyTemplateAction.surveyTemplateItem)
      - 类型: *List*

    #### surveyTemplateItem

    - **stiid**: 项目ID
      - 类型: *Long*
    - **stid**: 模版ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*

    - **options**: 选项列表 , 每条数据类型 [surveyTemplateItem](./data.html#api.data.SurveyTemplateAction.surveyTemplateItem)
      - 类型: *List*

    #### surveyTemplateOption

    - **stoid**: 选项ID
      - 类型: *Long*
    - **stiid**: 项目ID
      - 类型: *Long*
    - **stid**: 模版ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*

    ### `pageSurveyTemplate` <span style="color:gray">[内部]</span>

        分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  调研模版列表 , 每条数据类型 *surveyTemplate*

        **示例**:{
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

    ### `querySurveyTemplate` <span style="color:gray">[内部]</span>

        获取调研模版

**返回参数**:

- **surveyTemplates**: 调研模版列表 , 每条数据类型类型 *surveyTemplate*
          - 类型: *List*

        **示例**:{
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

    ### `querySurveyTemplateByStid` <span style="color:gray">[内部]</span>

        获取调研模版

**请求参数**:

- **surveyTemplate.stid**:
  模版ID

        **示例**:{
                "surveyTemplate.stid": 1
            }

**返回参数**:

- **surveyTemplate**: 调研模版 , 数据类型 *surveyTemplate*
          - 类型: *Object*

        **示例**:{
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

    ### `addSurveyTemplate` <span style="color:gray">[内部]</span>

        创建调研模版

**请求参数**:

- **surveyTemplate.name**:
  名称
        - **surveyTemplate.isSend**:
  推送标识

        - **surveyTemplate.items[n].name**:
  名称
        - **surveyTemplate.items[n].type**:
  类型
        - **surveyTemplate.items[n].content**:
  内容

        - **surveyTemplate.items[n].options[n].title**:
  标题


        **示例**:{
                "surveyTemplate.name": "模版",
                "surveyTemplate.isSend": 0,

                "surveyTemplate.items[0].name": "项目",
                "surveyTemplate.items[0].type": 0,
                "surveyTemplate.items[0].content": "内容",

                "surveyTemplate.items[0].options[0].title": "标题"
            }

    ### `updateSurveyTemplate` <span style="color:gray">[内部]</span>

        更新调研模版

        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**请求参数**:

- **surveyTemplate.stid**:
  模版ID
        - **surveyTemplate.name**:
  名称

        - **surveyTemplate.items[n].name**:
  名称
        - **surveyTemplate.items[n].type**:
  类型
        - **surveyTemplate.items[n].content**:
  内容

        - **surveyTemplate.items[n].options[n].title**:
  标题

        **示例**:{
                "surveyTemplate.stid": 1,
                "surveyTemplate.name": "模版",

                "surveyTemplate.items[0].name": "项目",
                "surveyTemplate.items[0].type": 0,
                "surveyTemplate.items[0].content": "内容",

                "surveyTemplate.items[0].options[0].title": "标题"
            }

    ### `updateSurveyTemplateForStatus` <span style="color:gray">[内部]</span>

        更新调研模版状态

        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**请求参数**:

- **surveyTemplate.stid**:
  模版ID
        - **surveyTemplate.isSend**:
  推送标识
        - **surveyTemplate.status**:
  状态

        **示例**:{
                "surveyTemplate.stid": 1,
                "surveyTemplate.isSend": 0,
                "surveyTemplate.status": 0
            }

    ### `deleteSurveyTemplate` <span style="color:gray">[内部]</span>

        删除调研模版

        判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**请求参数**:

- **surveyTemplate.stid**:
  模版ID

        **示例**:{
                "surveyTemplate.stid": 1
            }

### 话术

## api.data.ChatingAction

**数据类型**:

#### chating

    - **cid**: 话术ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **content**: 内容
      - 类型: *String*
    - **type**: 类型 , 0: 文本, 2: 应用
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 客户, 1: 装修, 2: 主材, 3: 工程, 4: 款项, 5: 其他
      - 类型: *Short*
    - **path**: 路径
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageChating` <span style="color:gray">[内部]</span>

        分页方式获取话术信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  话术列表 , 每条数据类型 *chating*

        **示例**:{
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

    ### `queryChating` <span style="color:gray">[内部]</span>

        获取话术信息

**返回参数**:

- **chatings**: 话术列表 , 每条数据类型 *chating*
          - 类型: *List*

        **示例**:{
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

    ### `addChating` <span style="color:gray">[内部]</span>

        添加话术

**请求参数**:

- **chating.title**:
  标题
        - **chating.content**:
  内容
        - **chating.type**:
  类型
        - **chating.atttype**:
  业务类型
        - **chating.path**:
  路径

        **示例**:{
                "chating.title": "标题",
                "chating.content": "内容",
                "chating.type": 0,
                "chating.atttype": 0,
                "chating.path": ""
            }

    ### `updateChating` <span style="color:gray">[内部]</span>

        更新话术

        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**请求参数**:

- **chating.cid**:
  话术ID
        - **chating.title**:
  标题
        - **chating.content**:
  内容
        - **chating.type**:
  类型
        - **chating.atttype**:
  业务类型
        - **chating.path**:
  路径

        **示例**:{
                "chating.cid": 1,
                "chating.title": "标题",
                "chating.content": "内容",
                "chating.type": 0,
                "chating.atttype": 0,
                "chating.path": ""
            }

    ### `updateChatingForStatus` <span style="color:gray">[内部]</span>

        更新话术状态

        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**请求参数**:

- **chating.cid**:
  话术ID
        - **chating.status**:
  状态

        **示例**:{
                "chating.cid": 1,
                "chating.status": 0
            }

    ### `deleteChating` <span style="color:gray">[内部]</span>

        删除话术

        判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**请求参数**:

- **chating.cid**:
  话术ID

        **示例**:{
                "chating.cid": 1
            }

## 装修

### 业务类型

## api.data.DecorationBusitype

**数据类型**:

#### decorationBusitype

    - **dbid**: 类型ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **outside**: 三方 , 0: 内部 , 1: 三方
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageDecorationBusitype` <span style="color:gray">[内部]</span>

        分页方式获取业务类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  客户信息列表 , 每条数据类型 *decorationBusitype*

        **示例**:{
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

    ### `queryDecorationBusitype` <span style="color:gray">[内部]</span>

        获取业务类型信息

**返回参数**:

- **decorationBusitypes**: 业务类型信息 , 类型 *decorationBusitype*
          - 类型: *object*

        **示例**:{
                ...
                "decorationBusitypes": [{
                    "dbid": 1,
                    "name": "李",
                    "outside": 0,
                    "status": 0
                }],
                ...
            }

    ### `addDecorationBusitype` <span style="color:gray">[内部]</span>

        添加业务类型

**请求参数**:

- **decorationBusitype.name**:
  名称
        - **decorationBusitype.outside**:
  三方

        **示例**:{
                "decorationBusitype.name": "业务类型",
                "decorationBusitype.outside": 0
            }

    ### `updateDecorationBusitype` <span style="color:gray">[内部]</span>

        更新业务类型

        判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**

**请求参数**:

- **decorationBusitype.dbid**:
  业务类型ID
        - **decorationBusitype.name**:
  名称
        - **decorationBusitype.outside**:
  三方

        **示例**:{
                "decorationBusitype.dbid": 1,
                "decorationBusitype.name": "业务类型",
                "decorationBusitype.outside": 0
            }

    ### `updateDecorationBusitypeForStatus` <span style="color:gray">[内部]</span>

        更新业务类型状态

        判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**

**请求参数**:

- **decorationBusitype.dbid**:
  业务类型ID
        - **decorationBusitype.status**:
  状态
        - **decorationBusitype.outside**:
  三方

        **示例**:{
                "decorationBusitype.dbid": 1,
                "decorationBusitype.status": 1,
                "decorationBusitype.outside": 0
            }

### 装修业务

## api.data.DecorationAtttype

**数据类型**:

#### decorationAtttype

    - **daid**: 业务ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: 键值
      - 类型: *Long*
    - **type**: 类型 , 0: 半包, 1: 整装, 2: 满减
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageDecorationAtttype` <span style="color:gray">[内部]</span>

        分页方式获取装修业务信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  装修业务信息列表 , 每条数据类型 *decorationAtttype*

        **示例**:{
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

    ### `queryDecorationAtttype` <span style="color:gray">[内部]</span>

        获取装修业务信息

**返回参数**:

- **decorationAtttypes**: 装修业务类型信息 , 类型 *decorationAtttype*
          - 类型: *object*

        **示例**:{
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

### 装修配比

## api.data.DecorationMatchingAction

**数据类型**:

#### decorationMatching

    - **dmid**: 配比ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 对应装修单中的type
      - 类型: *Short*
    - **base**: 基数
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **discountType**: 折扣方式 , 0: 固定 , 1: 可改 , 2: 最低
      - 类型: *Short*
    - **material**: 主材配比
      - 类型: *Integer*
    - **service**: 服务配比
      - 类型: *Integer*
    - **vision**: 显示 , 1: 报价折扣 , 2: 报价计算 , 4: 生成款项 , 8: 决算计算
      - 类型: *Short*
    - **isShow**: 默认显示 0: 显示 , 1: 隐藏
      - 类型: *Short*
    - **trafficDiscount**: 车运费折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **taxDiscount**: 税金折扣 , 0: 管理税金 , 1: 总额税金
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageDecorationMatching` <span style="color:gray">[内部]</span>

    ### `queryDecorationMatching` <span style="color:gray">[内部]</span>

    ### `addDecorationMatching` <span style="color:gray">[内部]</span>

    ### `updateDecorationMatching` <span style="color:gray">[内部]</span>

### 量尺规则

## api.data.DecorationMeasure

**数据类型**:

#### decorationMeasure

    - **dmid**: 规则ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    #### decorationMeasureItem

    - **dmiid**: 项目ID
      - 类型: *Long*
    - **dmid**: 规则ID
      - 类型: *Long*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryDecorationMeasure` <span style="color:gray">[内部]</span>

## 款项

### 款项类型

收据类型信息管理

## api.data.PaymentTypeAction

    | 0 预付款         | 0 收款                   | 0 合同                           | 0 预付                           | 装修预付款                       |                  |
        #### paymentType

    - **ptid**: 款项类型ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款
      - 类型: *Short*
    - **paytype**: 付款类型 , 0: 收款 , 1: 出款
      - 类型: *Short*

    - **bustype**: 业务类型 , 0: 装修 , 1: 主材
      - 类型: *Short*
    - **atttype**: 属性类型 , 装修: 0(基础) , 1(合同) , 2(增减) , 3(其他)
      - 类型: *Short*

    - **payScale**: 付款比例
      - 类型: *Integer*
    - **saleScale**: 销售比例
      - 类型: *Integer*
    - **index**: 索引
      - 类型: *Integer*

    - **kino**: 金蝶编号
      - 类型: *String*
    - **kiname**: 金蝶名称
      - 类型: *String*
    - **kibalance**: 结算方式
      - 类型: *String*

    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pagePaymentType` <span style="color:gray">[内部]</span>

        分页方式获取款项类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  收据类型信息列表 , 每条数据类型 *paymentType*

        **示例**:{
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

    ### `queryPaymentType` <span style="color:gray">[内部]</span>

        查询款项类型

**请求参数**:

- **paymentType.type**:
  类型
        - **paymentType.paytype**:
  付款类型
        - **paymentType.bustype**:
  业务类型
        - **paymentType.atttype**:
  属性类型

        **示例**:{
                "paymentType.type": 1,
                "paymentType.paytype": 1,
                "paymentType.bustype": 1,
                "paymentType.atttype": 1
            }

**返回参数**:

- **paymentTypes**: 款项类型信息列表 , 每条信息类型 *paymentType*
          - 类型: *List*

        **示例**:{
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

    ### `queryPaymentTypeByName` <span style="color:gray">[内部]</span>

    ### `queryPaymentTypeByPtid` <span style="color:blue">[自定义]</span>

        通过ID查询款项类型信息

**请求参数**:

- **paymentType.ptid**:
  款项类型ID

        **示例**:{
                "paymentType.ptid": 1
            }

**返回参数**:

- **paymentType**: 款项类型 , 类型 *paymentType*
          - 类型: *Object*

        **示例**:{
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

    ### `addPaymentType` <span style="color:blue">[自定义]</span>

        添加款项类型

        判断款项类型名称是否存在有效数据 , 已存在 , 错误信息 **130093 款项类型已存在**

**请求参数**:

- **paymentType.name**:
  名称
        - **paymentType.type**:
  类型
        - **paymentType.paytype**:
  付款类型
        - **paymentType.bustype**:
  业务类型
        - **paymentType.atttype**:
  属性类型
        - **paymentType.payScale**:
  付款比例
        - **paymentType.salesScale**:
  索引
        - **paymentType.index**:
  索引
        - **paymentType.kino**:
  金蝶编号
        - **paymentType.kiname**:
  金蝶名称
        - **paymentType.kibalance**:
  金蝶结算

        **示例**:{
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

    ### `updatePaymentType` <span style="color:blue">[自定义]</span>

        添加款项类型

        判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**

**请求参数**:

- **paymentType.ptid**:
  款项类型ID
        - **paymentType.kino**:
  金蝶编号
        - **paymentType.kiname**:
  金蝶名称
        - **paymentType.kibalance**:
  金蝶结算

        **示例**:{
                "paymentType.ptid": 1
                "paymentType.kino": "1010001001",
                "paymentType.kiname": "现金",
                "paymentType.kibalance": "JSU2J3-SYS",
            }

    ### `updatePaymentTypeForStatus` <span style="color:blue">[自定义]</span>

        更新款项类型状态

        判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**

**请求参数**:

- **paymentType.ptid**:
  款项类型ID
        - **paymentType.status**:
  状态

        **示例**:{
                "paymentType.ptid": 1
                "paymentType.status": 1
            }

### 收据类型

收据类型信息管理

## api.data.ReceiptTypeAction

**数据类型**:

#### receiptType

    - **rtid**: 收据类型ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 收据类型名称
      - 类型: *String*
    - **grade**: 等级 , A/B/C
      - 类型: *String*
    - **kino**: 金蝶编号
      - 类型: *String*
    - **kiname**: 金蝶名称
      - 类型: *String*
    - **kibalance**: 结算方式
      - 类型: *String*
    - **assistant**: 辅助核算项
      - 类型: *String*
    - **type**: 类型 , 1: 现金 , 2: 银行 , 3: 转账 , 4: 对公 , 5: 优惠
      - 类型: *Short*
    - **fund**: 资金类型 , 0: 标准 , 1: 资金
      - 类型: *Short*
    - **status**: 状态 , 0: 失效 , 1: 有效
      - 类型: *Short*
    - **bankno**: 银行卡
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageReceiptType` <span style="color:gray">[内部]</span>

        分页方式获取收据类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  收据类型信息列表 , 每条数据类型 *receiptType*

        **示例**:{
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

    ### `queryReceiptType` <span style="color:gray">[内部]</span>

        获取所有收据类型信息

**返回参数**:

- **receiptTypes**: 收据类型信息列表 , 每条信息类型 *receiptType*
          - 类型: *List*

        **示例**:{
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

    ### `queryReceiptTypeByNo` <span style="color:gray">[内部]</span>

    ### `queryReceiptTypeByType` <span style="color:gray">[内部]</span>

        通过类型获取收据类型信息

**请求参数**:

- **receiptType.type**:
  类型
        - **receiptType.grade**:
  等级

        **示例**:{
                "receiptType.type": 1
            }

**返回参数**:

- **receiptTypes**: 收据类型信息列表 , 每条信息类型 *receiptType*
          - 类型: *List*

        **示例**:{
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

    ### `addReceiptType` <span style="color:blue">[自定义]</span>

        添加收据类型信息

**请求参数**:

- **receiptType.no**:
  键值
        - **receiptType.name**:
  名称
        - **receiptType.grade**:
  等级
        - **receiptType.kino**:
  金蝶编号
        - **receiptType.kiname**:
  金蝶名称
        - **receiptType.kibalance**:
  结算方式
        - **receiptType.assistant**:
  辅助核算项
        - **receiptType.type**:
  类型
        - **receiptType.fund**:
  资金类型

        **示例**:{
                "receiptType.no": "157",
                "receiptType.name": '总公司',
                "receiptType.grade": "",
                "receiptType.kino": "1010001001",
                "receiptType.kiname": "现金",
                "receiptType.kibalance": "JSU2J3-SYS",
                "receiptType.type": 1,
                "receiptType.fund": 0
            }

    ### `updateReceiptType` <span style="color:gray">[内部]</span>

        更新收据类型信息

        收据类型信息不存在 , 错误信息 **130005 收据类型不存在**

**请求参数**:

- **receiptType.rtid**:
  ID
        - **receiptType.no**:
  键值
        - **receiptType.name**:
  名称
        - **receiptType.grade**:
  等级
        - **receiptType.kino**:
  金蝶编号
        - **receiptType.kiname**:
  金蝶名称
        - **receiptType.kibalance**:
  结算方式
        - **receiptType.assistant**:
  辅助核算项
        - **receiptType.type**:
  类型
        - **receiptType.fund**:
  资金类型

        **示例**:{
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

    ### `updateReceiptTypeForStatus` <span style="color:gray">[内部]</span>

        更新收据类型信息状态

        收据类型信息不存在 , 错误信息 **130005 收据类型不存在**

**请求参数**:

- **receiptType.rtid**:
  ID
        - **receiptType.status**:
  状态

        **示例**:{
                "receiptType.rtid": 1,
                "receiptType.status": 1
            }

**数据类型**:

#### receiptTypeItem

    - **rtiid**: 单据ID
      - 类型: *Long*
    - **rtid**: 收据类型ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 单据名
      - 类型: *String*
    - **bustype**: 类型 , 0: 预付
      - 类型: *Short*
    - **paytype**: 款项类型 , 0: 收款 , 1: 退款
      - 类型: *Short*

    ### `queryReceiptTypeItem` <span style="color:gray">[内部]</span>

        查询单据信息

**请求参数**:

- **receiptTypeItem.rtid**:
  ID

        **示例**:{
                "receiptTypeItem.rtid": 1
            }

**返回参数**:

- **receiptTypeItems**: 单据信息列表 , 每条信息类型 *receiptTypeItem*
          - 类型: *List*

        **示例**:{
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

    ### `addReceiptTypeItem` <span style="color:blue">[自定义]</span>

        添加单据信息

**请求参数**:

- **receiptTypeItem.rtid**:
  ID
        - **receiptTypeItem.no**:
  编号
        - **receiptTypeItem.name**:
  名称
        - **receiptTypeItem.type**:
  类型

        **示例**:{
                "receiptTypeItem.rtid": 1,
                "receiptTypeItem.no": "DJFIJ3I2J23HJ",
                "receiptTypeItem.name": "单据名称",
                "receiptTypeItem.rtid": 1,
            }

    ### `deleteReceiptTypeItem` <span style="color:blue">[自定义]</span>

        删除单据信息

**请求参数**:

- **receiptTypeItem.rtiid**:
  ID

        **示例**:{
                "receiptTypeItem.rtiid": 1
            }

### 款项比例

款项比例信息 , 生成装修款按照该比例进行

## api.data.PaymentScaleAction

**数据类型**:

#### paymentScale

    - **psid**: ID
      - 类型: *Long*
    - **cid**: 公司ID
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **typeness**: 业务类型
      - 类型: *Short*
    - **dbid**: 业务类型
      - 类型: *Long*
    - **atttype**: 业务类型 , 1: 合同 , 3: 其他
      - 类型: *Short*
    - **status**: 状态
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    #### paymentScaleItem

    - **psiid**: ID
      - 类型: *Long*
    - **psid**: 款项比例ID
      - 类型: *Long*
    - **ptid**: 款项类型ID
      - 类型: *Long*
    - **name**: 款项名
      - 类型: *String*
    - **scale**: 比例
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### `queryPaymentScale` <span style="color:gray">[内部]</span>

        通过公司ID获取款项比例信息

**请求参数**:

- **paymentScale.cid**:
  公司ID

        **示例**:{
                "paymentScale.cid": 1
            }

**返回参数**:

- **paymentScales**: 款项比例列表 , 每条数据类型 *paymentScale*
          - 类型: *List*

        **示例**:{
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

    ### `queryPaymentScaleItemByPsid` <span style="color:gray">[内部]</span>

        通过款项比例ID获取款项比例项信息

**请求参数**:

- **paymentScaleItem.psid**:
  公司ID

        **示例**:{
                "paymentScaleItem.psid": 1
            }

**返回参数**:

- **paymentScaleItems**: 款项比例项列表 , 每条数据类型 *paymentScaleItem*
          - 类型: *List*

        **示例**:{
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

    ### `addPaymentScale` <span style="color:gray">[内部]</span>

        添加款项比例, 关联公司

**请求参数**:

- **paymentScale.cid**:
  公司ID
        - **paymentScale.name**:
  名称
        - **paymentScale.comment**:
  说明

        **示例**:{
                "paymentScale.name": "半包",
                "paymentScale.comment": 0.4
            }

    ### `addPaymentScaleItem` <span style="color:gray">[内部]</span>

        添加款项比例项信息

**请求参数**:

- **paymentScaleitem.psid**:
  款项比例ID
        - **paymentScaleitem.ptid**:
  款项类型ID
        - **paymentScaleitem.name**:
  名称
        - **paymentScaleitem.scale**:
  比例
        - **paymentScaleItem.sort**:
  排序

        **示例**:{
                "paymentScaleitem.psid": 1,
                "paymentScaleitem.ptid": 1,
                "paymentScaleitem.name": "半包",
                "paymentScaleitem.scale": 30,
                "paymentScaleitem.sort": 1
            }

    ### `updatePaymentScaleForStatus` <span style="color:gray">[内部]</span>

        更新款项比例状态

**请求参数**:

- **paymentScale.psid**:
  款项比例ID
        - **paymentScale.status**:
  状态

        **示例**:{
                "paymentScale.psid": 1,
                "paymentScale.status": 1
            }

    ### `deletePaymentScale` <span style="color:gray">[内部]</span>

        删除款项比例信息

        删除款项比例关联的款项比例项信息

**请求参数**:

- **paymentScale.psid**:
  款项比例ID

        **示例**:{
                "paymentScale.psid": 1
            }

    ### `deletePaymentScaleItem` <span style="color:gray">[内部]</span>

        删除款项比例项

**请求参数**:

- **paymentScaleItem.psiid**:
  款项比例项ID

        **示例**:{
                "paymentScaleItem.psiid": 1
            }

### 商户类型

## api.data.CustypeAction

**数据类型**:

#### custype

    - **ctid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **no**: 商户号
      - 类型: *String*
    - **agent**: 机构号
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **wxapp**: 微信APPID
      - 类型: *String*
    - **receiptType**: 收据类型 , 类型 [receiptType](./data.html#api.communion.ReceiptTypeAction.receiptType)
      - 类型: *Object*
    - **platform**: 支付平台 , 0: pospay(POS机) , 1: wxpay(微信) , 2: alipay(支付宝)
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 预付 , 1: 装修 , 2: 主材 , 3: 销售 , 4: 服务
      - 类型: *Short*
    - **dgrade**: 装修等级
      - 类型: *String*
    - **sgrade**: 销售等级
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageCustype` <span style="color:gray">[内部]</span>

        分页方式获取商户类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  商户类型信息列表 , 每条数据类型 *custype*

        **示例**:{
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

    ### `queryCustype` <span style="color:gray">[内部]</span>

        查询商户类型

**请求参数**:

- **custype.attype**:
  业务类型
        - **custype.dgrade**:
  装修等级
        - **custype.sgrade**:
  销售等级

        **示例**:{
                "custype.atttype": 0,
                "custype.dgrade": ""
                "custype.sgrade": ""
            }

**返回参数**:

- **custypes**: 商户类型信息列表 , 每条数据类型 *custype*
          - 类型: *List*

        **示例**:{
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

    ### `addCustype` <span style="color:blue">[自定义]</span>

        添加商户类型

**请求参数**:

- **custype.name**:
  名称
        - **custype.no**:
  商户号
        - **custype.agent**:
  机构号
        - **custype.wxapp**:
  微信APPID
        - **custype.platform**:
  支付平台
        - **custype.attype**:
  业务类型
        - **custype.dgrade**:
  装修等级
        - **custype.sgrade**:
  销售等级
        - **custype.receiptType.rtid**:
  收据类型ID

        **示例**:{
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

    ### `updateCustype` <span style="color:blue">[自定义]</span>

        更新商户类型

        判断商户类型是否存在 , 不存在 , 错误信息 **130105 商户不存在**

**请求参数**:

- **custype.ctid**:
  ID
        - **custype.name**:
  名称
        - **custype.no**:
  商户号
        - **custype.agent**:
  机构号
        - **custype.wxapp**:
  微信APPID
        - **custype.platform**:
  支付平台
        - **custype.attype**:
  业务类型
        - **custype.dgrade**:
  装修等级
        - **custype.sgrade**:
  销售等级
        - **custype.status**:
  状态
        - **custype.receiptType.rtid**:
  收据类型ID

        **示例**:{
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

## 报价

### 类型
报价类型信息管理

## api.data.QuotationTypeAction

**数据类型**:

#### quotationType

    - **qtid**: 类型ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*

    ### `pageQuotationType` <span style="color:gray">[内部]</span>

        分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价类型信息列表 , 每条数据类型 *quotationType*

        **示例**:{
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

    ### `queryQuotationType` <span style="color:gray">[内部]</span>

        获取所有报价类型信息

**返回参数**:

- **quotationTypes**: 报价类型信息列表 , 每条数据类型 *quotationType*
          - 类型: *List*

        **示例**:{
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

### 分类
报价分类信息管理

## api.data.QuotationClassificationAction

**数据类型**:

#### quotationClassification

    - **id**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*

    ### `pageQuotationClassification` <span style="color:gray">[内部]</span>

        分页方式获取报分类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价分类信息列表 , 每条数据类型 *quotationClassification*

        **示例**:{
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

    ### `queryQuotationClassification` <span style="color:gray">[内部]</span>

        获取所有报价分类信息

**返回参数**:

- **quotationClassifications**: 报价分类信息列表 , 每条数据类型 *quotationClassification*
          - 类型: *List*

        **示例**:{
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

### 大类
报价大类信息管理

## api.data.QuotationBigCategoryAction

**数据类型**:

#### quotationBigCategory

    - **id**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **qtid**: 类型ID
      - 类型: *Long*

    ### `pageQuotationBigCategory` <span style="color:gray">[内部]</span>

        分页方式获取报大类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价分类信息列表 , 每条数据类型 *quotationBigCategory*

        **示例**:{
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

    ### `queryQuotationBigCategory` <span style="color:gray">[内部]</span>

        获取所有报价大类信息

**请求参数**:

- **quotationBigCategory.qtid**:
  类型

        **示例**:{
                "quotationBigCategory.qtid": 1
            }

**返回参数**:

- **quotationBigCategorys**: 报价大类信息列表 , 每条数据类型 *quotationBigCategory*
          - 类型: *List*

        **示例**:{
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

### 小类
报价小类信息管理

## api.data.QuotationSmallCategoryAction

**数据类型**:

#### quotationSmallCategory

    - **id**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **qtid**: 类型ID
      - 类型: *Long*

    ### `pageQuotationSmallCategory` <span style="color:gray">[内部]</span>

        分页方式获取报小类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价小类信息列表 , 每条数据类型 *quotationSmallCategory*

        **示例**:{
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

    ### `queryQuotationSmallCategory` <span style="color:gray">[内部]</span>

        获取所有报价小类信息

**请求参数**:

- **quotationSmallCategory.qtid**:
  类型

        **示例**:{
                "quotationSmallCategory.qtid": 1
            }

**返回参数**:

- **quotationSmallCategorys**: 报价小类信息列表 , 每条数据类型 *quotationSmallCategory*
          - 类型: *List*

        **示例**:{
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

### 版本
报价版本信息管理

## api.data.QuotationVersionAction

**数据类型**:

#### quotationVersion

    - **qvid**: 报价版本ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 版本名称
      - 类型: *String*
    - **defaultFlag**: 默认标识 , 0: 非默认版本 , 1: 默认报价版本 , 表示当前系统报价默认使用报价版本 , 并作为报价项选择条件 , 系统有且仅有一个默认报价版本
      - 类型: *Short*
    - **undisDiscount**: 不打折折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficDiscount**: 车运费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣
      - 类型: *Short*
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣
      - 类型: *Short*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣 , 0: 管理税金 , 1: 总价税金
      - 类型: *Short*
    - **offset**: 偏移量
      - 类型: *Integer*
    - **type**: 类型 , 0: 半包 , 装修单 , 不包括主材单 , 1: 整装 , 装修+主材单 , 2: 满减 , 主材配比 , 装修打折
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*

        |Filters:|
        - **name**: 版本名称
      - 类型: *String*

    ### `pageQuotationVersion` <span style="color:gray">[内部]</span>

        分页方式获取报价爱版本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  大区信息列表 , 每条数据类型 *region*

        **示例**:{
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

    ### `queryQuotationVersion` <span style="color:gray">[内部]</span>

        获取所有报价版本信息

**返回参数**:

- **quotationVersions**: 报价版本信息列表 , 每条数据类型 *quotationVersion*
          - 类型: *List*

        **示例**:{
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

    ### `queryQuotationVersionByVersionId` <span style="color:gray">[内部]</span>

        通过报价版本编号查询版本信息

**请求参数**:

- **quotationVersion.no**:
  版本编号

        **示例**:{
                "quotationVersion.no": "QV002"
            }

**返回参数**:

- **quotationVersion**: 报价版本信息 , 类型 *quotationVersion*
          - 类型: *Object*

        **示例**:{
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

    ### `addQuotationVersion` <span style="color:gray">[内部]</span>

        添加报价版本信息

**请求参数**:

- **quotationVersion.name**:
  版本名称
        - **quotationVersion.undisDiscount**:
  不打折折扣
        - **quotationVersion.trafficRate**:
  车运费比例
        - **quotationVersion.trafficDiscount**:
  车运费折扣
        - **quotationVersion.manageRate**:
  管理费比例
        - **quotationVersion.manageDiscount**:
  管理费折扣
        - **quotationVersion.taxRate**:
  税金比例
        - **quotationVersion.taxDiscount**:
  税金折扣
        - **quotationVersion.type**:
  类型
        - **quotationVersion.comment**:
  说明

        **示例**:{
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

    ### `updateQuotationVersion` <span style="color:gray">[内部]</span>

        更新报价版本信息

        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**请求参数**:

- **quotationVersion.no**:
  版本编号
        - **quotationVersion.name**:
  版本名称
        - **quotationVersion.undisDiscount**:
  不打折折扣
        - **quotationVersion.trafficRate**:
  车运费比例
        - **quotationVersion.trafficDiscount**:
  车运费折扣
        - **quotationVersion.manageRate**:
  管理费比例
        - **quotationVersion.manageDiscount**:
  车运费折扣
        - **quotationVersion.taxRate**:
  税金比例
        - **quotationVersion.taxDiscount**:
  税金折扣
        - **quotationVersion.offset**:
  偏移量
        - **quotationVersion.type**:
  类型
        - **quotationVersion.comment**:
  说明

        **示例**:{
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

    ### `updateQuotationVersionForDefault` <span style="color:gray">[内部]</span>

        更新默认报价

        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**请求参数**:

- **quotationVersion.qvid**:
  版本ID
        - **quotationVersion.defaultFlag**:
  默认标识

        **示例**:{
                "qvid": 1,
                "defaultFlag": 0
            }

    ### `updateQuotationVersionForStatus` <span style="color:gray">[内部]</span>

        更新状态

        判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**请求参数**:

- **quotationVersion.qvid**:
  版本ID
        - **quotationVersion.status**:
  状态

        **示例**:{
                "qvid": 1,
                "status": 0
            }

### 共享项

## api.data.QuotationCtemAction

**数据类型**:

#### quotationCtem

    - **qcid**: 项目ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **type**: 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩
      - 类型: *Short*
    - **category**: 类型 , 类型 [quotationType](./data.html#api.data.QuotationTypeAction.quotationType)
      - 类型: *Object*
    - **classification**: 类别 , 类型 [quotationClassification](./data.html#api.data.QuotationClassificationAction.quotationClassification)
      - 类型: *Object*
    - **bigCategory**: 大类 , 类型 [quotationBigCategory](./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory)
      - 类型: *Object*
    - **smallCategory**: 小类 , 类型 [quotationSmallCategory](./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory)
      - 类型: *Object*
    - **unit**: 单位 , 类型 [measurementUnit](./data.html#api.communion.MeasurementUnitAction.measurementUnit)
      - 类型: *Object*
    - **workType**: 工种 , 类型 [workType](./data.html#api.communion.WorkTypeAction.workType)
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageQuotationCtem` <span style="color:gray">[内部]</span>

        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价项信息列表 , 每条数据类型 *quotationCtem*

        **示例**:{
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

    ### `queryQuotationCtem` <span style="color:gray">[内部]</span>

        查询共享项信息

**请求参数**:

- **quotationCtem.pinyin**:
  拼音

        **示例**:{
                "quotationCtem.pinyin": "pinyin",
            }

**返回参数**:

- **paging.data**:
  报价项信息列表 , 每条数据类型 *quotationCtem*

        **示例**:{
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

    ### `addQuotationCtem` <span style="color:gray">[内部]</span>

        添加共享项

**请求参数**:

- **quotationCtem.name**:
  名称
        - **quotationCtem.type**:
  类型
        - **quotationCtem.category.qtid**:
  报价类型ID
        - **quotationCtem.classification.qcid**:
  报价类别ID
        - **quotationCtem.bigCategory.qbcid**:
  报价大类ID
        - **quotationCtem.smallCategory.qscid**:
  报价小类ID

        **示例**:{
                "quotationCtem.name": "名称",
                "quotationCtem.type": 1,
                "quotationCtem.category.qtid": 1,
                "quotationCtem.classification.qcid": 1,
                "quotationCtem.bigCategory.qbcid": 1,
                "quotationCtem.smallCategory.qscid": 11
            }

    ### `updateQuotationCtem` <span style="color:gray">[内部]</span>

        更新共享项

**请求参数**:

- **quotationCtem.qcid**:
  共享项ID
        - **quotationCtem.name**:
  名称
        - **quotationCtem.type**:
  类型
        - **quotationCtem.category.qtid**:
  报价类型ID
        - **quotationCtem.classification.qcid**:
  报价类别ID
        - **quotationCtem.bigCategory.qbcid**:
  报价大类ID
        - **quotationCtem.smallCategory.qscid**:
  报价小类ID

        **示例**:{
                "quotationCtem.qcid": 1,
                "quotationCtem.name": "名称",
                "quotationCtem.type": 1,
                "quotationCtem.category.qtid": 1,
                "quotationCtem.classification.qcid": 1,
                "quotationCtem.bigCategory.qbcid": 1,
                "quotationCtem.smallCategory.qscid": 11
            }

    ### `updateQuotationCtemForStatus` <span style="color:gray">[内部]</span>

        更新共享项状态

**请求参数**:

- **quotationCtem.qcid**:
  项目ID
        - **quotationCtem.status**:
  状态

        **示例**:{
                "quotationCtem.qcid": 1,
                "quotationCtem.status": 1
            }

## api.data.QuotationFormatAction

**数据类型**:

#### quotationFormat

    - **qfid**: 规格ID
      - 类型: *Long*
    - **qcid**: 项目ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **format**: 规格
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **price**: 价格
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `queryQuotationFormat` <span style="color:gray">[内部]</span>

        通过名称/拼音获取规格信息

**请求参数**:

- **quotationFormat.name**:
  项目ID

        **示例**:{
                "quotationFormat.name": 1,
            }

**返回参数**:

- **quotationFormats**: 规格信息列表 , 每条数据类型 *quotationFormat*
          - 类型: *List*

        **示例**:{
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

    ### `queryQuotationFormatByQcid` <span style="color:gray">[内部]</span>

        通过项目获取规格信息

**请求参数**:

- **quotationFormat.qcid**:
  项目ID

        **示例**:{
                "quotationFormat.qcid": 1,
            }

**返回参数**:

- **quotationFormats**: 规格信息列表 , 每条数据类型 *quotationFormat*
          - 类型: *List*

        **示例**:{
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

    ### `addQuotationFormat` <span style="color:gray">[内部]</span>

        添加规格

**请求参数**:

- **quotationFormat.qcid**:
  项目ID
        - **quotationFormat.format**:
  规格

        **示例**:{
                "quotationFormat.qcid": 1,
                "quotationFormat.format": "规格"
            }

    ### `updateQuotationFormat` <span style="color:gray">[内部]</span>

        更新规格

**请求参数**:

- **quotationFormat.qfid**:
  规格ID
        - **quotationFormat.format**:
  规格

        **示例**:{
                "quotationFormat.qfid": 1,
                "quotationFormat.format": "规格"
            }

    ### `updateQuotationFormatForStatus` <span style="color:gray">[内部]</span>

        更新规格状态

**请求参数**:

- **quotationFormat.qfid**:
  规格ID
        - **quotationFormat.status**:
  状态

        **示例**:{
                "quotationFormat.qfid": 1,
                "quotationFormat.status": 1
            }

    ### `deleteQuotationFormat` <span style="color:gray">[内部]</span>

        删除规格

**请求参数**:

- **quotationFormat.qfid**:
  规格ID

        **示例**:{
                "quotationFormat.qfid": 1
            }

### 报价项
报价项信息管理 , 报价项归属于一个报价版本 , 通过报价版本的控制来完成报价项的使用 .

## api.data.QuotationItemAction

**数据类型**:

#### quotationItem

    - **qiid**: 报价项ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **alias**: 别名
      - 类型: *String*
    - **version**: 版本 , 类型  [quotationVersion](./data.html#api.data.QuotationVersionAction.quotationVersion)
      - 类型: *Object*
    - **category**: 类型 , 类型 [quotationType](./data.html#api.data.QuotationTypeAction.quotationType)
      - 类型: *Object*
    - **classification**: 类别 , 类型 [quotationClassification](./data.html#api.data.QuotationClassificationAction.quotationClassification)
      - 类型: *Object*
    - **bigCategory**: 大类 , 类型 [quotationBigCategory](./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory)
      - 类型: *Object*
    - **smallCategory**: 小类 , 类型 [quotationSmallCategory](./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory)
      - 类型: *Object*
    - **unit**: 单位 , 类型 [measurementUnit](./data.html#api.communion.MeasurementUnitAction.measurementUnit)
      - 类型: *Object*
    - **workType**: 工种 , 类型 [workType](./data.html#api.communion.WorkTypeAction.workType)
      - 类型: *String*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **achePrice**: 业绩额
      - 类型: *Integer*
    - **type**: 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩
      - 类型: *Short*
    - **status**: 状态 , 0: 禁用 , 1: 启用
      - 类型: *Short*
    - **discount**: 折扣标识 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **formula**: 公式
      - 类型: *String*
    - **offset**: 偏移量 , 用于计算编号使用
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*

        |Filters:|
        - **quotationTypeId**: 报价类型ID
      - 类型: *Long*
    - **quotationClassificationId**: 报价类别ID
      - 类型: *Long*
    - **quotationBigno**: 报价大类ID
      - 类型: *Long*
    - **quotationSmallno**: 报价小类ID
      - 类型: *Long*
    - **quotationWorkTypeId**: 工种ID
      - 类型: *Long*
    - **no**: 报价版本编号
      - 类型: *String*
    - **status**: 状态
      - 类型: *Short*

    ### `pageQuotationItem` <span style="color:gray">[内部]</span>

        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价项信息列表 , 每条数据类型 *quotationItem*

        **示例**:{
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

    ### `pageQuotationItemByVersionId` <span style="color:gray">[内部]</span>

        分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用

**请求参数**:

- **quotationItem.version.no**:
  报价版本编号

        **示例**:{
                "quotationItem.version.no": "QV001",
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价项信息列表 , 每条数据类型 *quotationItem*

        **示例**:{
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

    ### `queryQuotationItemByItemIdAVersionId` <span style="color:gray">[内部]</span>

        通过版本编号以及报价项编号查询报价项信息

**请求参数**:

- **quotationItem.version.no**:
  报价版本编号
        - **quotationItem.no**:
  报价项编号

        **示例**:{
                "quotationItem.version.no": "QV001",
                "quotationItem.no": "QI00100"
            }

**返回参数**:

- **quotationItem**: 报价项信息 , 类型 *quotationItem*
          - 类型: *Object*

        **示例**:{
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

    ### `pageQuotationItemForPrice` <span style="color:gray">[内部]</span>

        分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用

**请求参数**:

- **quotationItem.version.no**:
  报价版本编号
        - **quotationPrice.updateTime**:
  更新时间

        **示例**:{
                "quotationItem.version.no": "QV001",
                "quotationItem.updateTime": "2016-01-01 00:00:00",
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报价项信息列表 , 每条数据类型 *quotationItem*

        **示例**:{
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

    ### `queryQuotationItemByQiid` <span style="color:gray">[内部]</span>

        通过报价项ID查询信息

**请求参数**:

- **quotationItem.qiid**:
  报价项ID

        **示例**:{
                "quotationItem.qiid": 1
            }

**返回参数**:

- **quotationItem**: 报价项信息 , 类型 *quotationItem*
          - 类型: *Object*

        **示例**:{
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

    ### `addQuotationItem` <span style="color:gray">[内部]</span>

        添加报价项信息

**请求参数**:

- **quotationItem.no**:
  编号
        - **quotationItem.name**:
  名称
        - **quotationItem.addPrice**:
  增补价
        - **quotationItem.unitPrice**:
  单价
        - **quotationItem.subPrice**:
  退减价
        - **quotationItem.version.no**:
  报价版本编号
        - **quotationItem.category.qtid**:
  报价类型ID
        - **quotationItem.classification.qcid**:
  报价类别ID
        - **quotationItem.bigCategory.qbcid**:
  报价大类ID
        - **quotationItem.smallCategory.qscid**:
  报价小类ID
        - **quotationItem.unit.muid**:
  单位ID
        - **quotationItem.workType.wtid**:
  工种ID
        - **quotationItem.comment**:
  说明

        **示例**:{
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

    ### `updateQuotationItem` <span style="color:gray">[内部]</span>

        更新报价项信息

        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**请求参数**:

- **quotationItem.qiid**:
  报价项ID
        - **quotationItem.name**:
  名称
        - **quotationItem.addPrice**:
  增补价
        - **quotationItem.unitPrice**:
  单价
        - **quotationItem.subPrice**:
  退减价
        - **quotationItem.category.qtid**:
  报价类型ID
        - **quotationItem.classification.qcid**:
  报价类别ID
        - **quotationItem.bigCategory.qbcid**:
  报价大类ID
        - **quotationItem.smallCategory.qscid**:
  报价小类ID
        - **quotationItem.unit.muid**:
  单位ID
        - **quotationItem.workType.wtid**:
  工种ID
        - **quotationItem.comment**:
  说明

        **示例**:{
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

    ### `updateQuotationItemForStatus` <span style="color:gray">[内部]</span>

        更新报价项中状态信息 , 控制报价项启用禁用状态

        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**请求参数**:

- **quotationItem.qiid**:
  报价项ID
        - **quotationItem.status**:
  状态 , 0: 禁用 , 1: 启用

        **示例**:{
                "quotationItem.qiid": 1,
                "quotationItem.status": 1,
            }

    ### `updateQuotationItemForDiscount` <span style="color:gray">[内部]</span>

        更新报价项中折扣标识 , 控制报价项是否打折状态

        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**请求参数**:

- **quotationItem.qiid**:
  报价项ID
        - **quotationItem.discount**:
  折扣标识 , 0: 不打折 , 1: 打折

        **示例**:{
                "quotationItem.qiid": 1,
                "quotationItem.discount": 1
            }

    ### `updateQuotationItemForFormula` <span style="color:gray">[内部]</span>

        更新报价项中公式信息

        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**请求参数**:

- **quotationItem.qiid**:
  报价项ID
        - **quotationItem.formula**:
  公式

        **示例**:{
                "quotationItem.qiid": 1,
                "quotationItem.formula": ""
            }

    ### `updateQuotationItemForCost` <span style="color:gray">[内部]</span>

        更新报价项中成本金额

        判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**请求参数**:

- **quotationItem.qiid**:
  报价项ID
        - **quotationItem.alias**:
  别名
        - **quotationItem.cost**:
  成本
        - **quotationItem.achePrice**:
  业绩额

        **示例**:{
                "quotationItem.qiid": 1,
                "quotationItem.alias": "",
                "quotationItem.cost": 0,
                "quotationItem.achePrice": 0
            }

### 定义项
定义项 , 系统级自定义项目 , 提供订单制作减项过程使用

## api.data.SystemDefineItemAction

**数据类型**:

#### systemDefineItem

    - **sdiid**: 定义项目ID
      - 类型: *Long*
    - **itemId**: 定义项目编号
      - 类型: *String*
    - **quotationBigno**: 报价大类ID
      - 类型: *Long*
    - **quotationBigCategory**: 报价大类
      - 类型: *String*
    - **itemName**: 项目名称
      - 类型: *String*
    - **measurementUnitId**: 单位ID
      - 类型: *Long*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **itemWorkTypeId**: 工种ID
      - 类型: *Long*
    - **itemWorkType**: 工种
      - 类型: *String*
    - **quotationItemDes**: 项目说明
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **status**: 状态 , 0: 禁用 , 1: 启用
      - 类型: *Short*
    - **discount**: 折扣标识 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **itemName**: 项目名称
      - 类型: *String*
    - **quotationBigno**: 报价大类ID
      - 类型: *Long*
    - **quotationWorkTypeId**: 工种ID
      - 类型: *Long*

    ### `pageSystemDefineItem` <span style="color:gray">[内部]</span>

        分页方式获取定义项目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  定义项目信息列表 , 每条数据类型 *systemDefineItem*

        **示例**:{
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

    ### `pageSystemDefineItemForEnable` <span style="color:gray">[内部]</span>

        分页方式获取开启状态的定义项目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  定义项目信息列表 , 每条数据类型 *systemDefineItem*

        **示例**:{
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

    ### `querySystemDefineItemByItemId` <span style="color:gray">[内部]</span>

        通过定义项目编号获取定义项目信息

**请求参数**:

- **systemDefineItem.itemId**:
  项目编号

        **示例**:{
                "systemDefineItem.itemId": "SI00001"
            }

**返回参数**:

- **systemDefineItem**: 定义项目信息 , 类型 *systemDefineItem*
          - 类型: *object*

        **示例**:{
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

    ### `addSystemDefineItem` <span style="color:gray">[内部]</span>

        添加定义项目信息

**请求参数**:

- **systemDefineItem.itemId**:
  项目编号
        - **systemDefineItem.itemName**:
  项目名称
        - **systemDefineItem.unitPrice**:
  单价
        - **systemDefineItem.quotationItemDes**:
  项目说明
        - **systemDefineItem.itemWorkTypeId**:
  工种ID
        - **systemDefineItem.measurementUnitId**:
  单位ID
        - **systemDefineItem.quotationBigno**:
  报价大类ID

        **示例**:{
                "systemDefineItem.itemId": "SI_00002",
                "systemDefineItem.itemName": "test",
                "systemDefineItem.unitPrice": 100,
                "systemDefineItem.quotationItemDes": "111",
                "systemDefineItem.itemWorkTypeId": 1,
                "systemDefineItem.measurementUnitId": 1,
                "systemDefineItem.quotationBigno": 1
            }

    ### `updateSystemDefineItem` <span style="color:gray">[内部]</span>

        更新定义项目信息

**请求参数**:

- **systemDefineItem.sdiid**:
  定义项目ID
        - **systemDefineItem.itemName**:
  项目名称
        - **systemDefineItem.unitPrice**:
  单价
        - **systemDefineItem.quotationItemDes**:
  项目说明
        - **systemDefineItem.itemWorkTypeId**:
  工种ID
        - **systemDefineItem.measurementUnitId**:
  单位ID
        - **systemDefineItem.quotationBigno**:
  报价大类ID

        **示例**:{
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.itemName": "test",
                "systemDefineItem.unitPrice": 100,
                "systemDefineItem.quotationItemDes": "111",
                "systemDefineItem.itemWorkTypeId": 1,
                "systemDefineItem.measurementUnitId": 1,
                "systemDefineItem.quotationBigno": 1
            }

    ### `updateSystemDefineItemForStatus` <span style="color:gray">[内部]</span>

        更新定义项目中状态信息 , 控制定义项目启用禁用状态

**请求参数**:

- **systemDefineItem.sdiid**:
  定义项目ID
        - **systemDefineItem.status**:
  状态 , 0: 禁用 , 1: 启用

        **示例**:{
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.status": 1
            }

    ### `updateSystemDefineItemForDiscount` <span style="color:gray">[内部]</span>

        更新定义项目中折扣标识信息 , 控制定义项目是否可以打折

**请求参数**:

- **systemDefineItem.sdiid**:
  定义项目ID
        - **systemDefineItem.discount**:
  折扣标识 , 0: 不打折 , 1: 打折

        **示例**:{
                "systemDefineItem.sdiid": 1,
                "systemDefineItem.discount": 1
            }

    ### `deleteSystemDefineItem` <span style="color:gray">[内部]</span>

        通过定义项目ID列表信息批量删除定义项目信息

**请求参数**:

- **systemDefineItem.sdiid**:
  定义项目ID

        **示例**:{
                "systemDefineItem.sdiid": 1
            }

### 功能区
功能区信息管理

## api.data.FunctionAreaAction

**数据类型**:

#### functionArea

    - **faId**: 功能区ID
      - 类型: *Long*
    - **functionAreaId**: 功能区编号
      - 类型: *String*
    - **functionAreaName**: 功能区名称
      - 类型: *String*
    - **functionAreaOrder**: 排序
      - 类型: *Integer*
    - **functionAreaType**: 类型 , 分为: 标准 , 一次性包死 , 综合项目
      - 类型: *String*
    - **no**: 版本编号
      - 类型: *String*
    - **version**: 版本名称
      - 类型: *String*
    - **type**: 类型 , 分为: 0(管理), 1(工程量), 2(总额), 3(不计算), 4(成本), 5(非业绩)
      - 类型: *Short*
    - **total**: 总额 , 当类型为2(功能区总额)时 , 可以按照功能区总价计算
      - 类型: *Long*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **no**: 报价版本编号
      - 类型: *String*

    ### `pageFunctionArea` <span style="color:gray">[内部]</span>

        分页方式获取功能区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  功能区信息列表 , 每条数据类型 *functionArea*

        **示例**:{
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

    ### `queryFunctionAreaByIdAVersionId` <span style="color:gray">[内部]</span>

        通过功能区编号以及报价版本获取功能区信息

**请求参数**:

- **functionArea.functionAreaId**:
  功能区编号
        - **functionArea.no**:
  版本编号

        **示例**:{
                "functionArea.functionAreaId": "D001",
                "functionArea.no": "QV001"
            }

**返回参数**:

- **functionArea**: 功能区信息 , 类型 *functionArea*
          - 类型: *object*

        **示例**:{
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

    ### `queryFunctionAreaByVersionId` <span style="color:gray">[内部]</span>

        通过报价版本获取功能区信息

**请求参数**:

- **functionArea.no**:
  版本编号

        **示例**:{
                "functionArea.no": "QV001"
            }

**返回参数**:

- **functionAreas**: 功能区信息列表 , 每条数据类型 *functionArea*
          - 类型: *List*

        **示例**:{
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

    ### `addFunctionArea` <span style="color:gray">[内部]</span>

        添加功能区信息

**请求参数**:

- **functionArea.functionAreaName**:
  功能区名称
        - **functionArea.functionAreaOrder**:
  排序
        - **functionArea.functionAreaType**:
  类型 , 分为: 标准 , 一次性包死 , 综合项目
        - **functionArea.no**:
  报价版本编号
        - **functionArea.type**:
  类型
        - **functionArea.total**:
  总额

        **示例**:{
                "functionArea.functionAreaName": "标准",
                "functionArea.functionAreaOrder": 1,
                "functionArea.functionAreaType": "标准",
                "functionArea.no": "QV001",
                "functionArea.type": 1,
                "functionArea.total": 0
            }

    ### `updateFunctionArea` <span style="color:gray">[内部]</span>

        更新功能区信息

**请求参数**:

- **functionArea.faId**:
  功能区ID
        - **functionArea.functionAreaName**:
  功能区名称
        - **functionArea.functionAreaOrder**:
  排序
        - **functionArea.functionAreaType**:
  类型 , 分为: 标准 , 一次性包死 , 综合项目
        - **functionArea.type**:
  类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算)
        - **functionArea.total**:
  总额

        **示例**:{
                "functionArea.faId": 1,
                "functionArea.functionAreaName": "标准",
                "functionArea.functionAreaOrder": 1,
                "functionArea.functionAreaType": "标准",
                "functionArea.type": 1,
                "functionArea.total": 0
            }

    ### `deleteFunctionArea` <span style="color:gray">[内部]</span>

        通过功能区ID批量删除功能区信息

**请求参数**:

- **ids**: 功能区ID列表 , 每条数据类型 Integer
          - 类型: *List*

        **示例**:{
                "ids[0]": 1,
                "ids[1]": 2
            }

### 功能区-报价项
功能区中包含的报价项信息 , 提供归属报价的相关操作

## api.data.FunctionAreaItemAction

**数据类型**:

#### functionAreaItem

    - **faiId**: 所属报价项ID
      - 类型: *Long*
    - **functionArea**: 功能区信息 , 类型 [functionArea](./data.html#api.data.FunctionAreaAction.functionArea)
      - 类型: *Object*
    - **quotationItem**: 报价项信息 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*
    - **formula**: 公式
      - 类型: *String*
    - **sort**: 排序
      - 类型: *Integer*

    ### `queryFunctionAreaItemByFunctionAreaId` <span style="color:gray">[内部]</span>

        通过功能区ID获取功能区包含的报价项信息

**请求参数**:

- **functionAreaItem.faId**:
  功能区ID

        **示例**:{
                "functionAreaItem.faId": 1
            }

**返回参数**:

- **functionAreaItems**: 报价项信息列表 , 每条数据类型 `quotationItem <./data.html#api.data.QuotationItemAction.quotationItem>`_
          - 类型: *List*

        **示例**:{
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

    ### `addFunctionAreaItem` <span style="color:gray">[内部]</span>

        向功能区中添加报价项信息

**请求参数**:

- **functionAreaItems[n].functionArea.faId**:
  功能区ID
        - **functionAreaItems[n].quotationItem.qiid**:
  报价项ID
        - **functionAreaItems[n].quotationItem.quotationClassification**:
  功能区类别
        - **functionAreaItems[n].sort**:
  排序

        **示例**:{
                "functionAreaItems[0].functionArea.faId": 1,
                "functionAreaItems[0].quotationItem.qiid": 1,
                "functionAreaItems[0].quotationItem.quotationClassification": "标准",
                "functionAreaItems[0].sort": 0,
                "functionAreaItems[1].functionArea.faId": 1,
                "functionAreaItems[1].quotationItem.qiid": 2,
                "functionAreaItems[1].quotationItem.quotationClassification": "标准",
                "functionAreaItems[1].sort": 1
            }

    ### `updateFunctionAreaItem` <span style="color:gray">[内部]</span>

        更新功能区中报价项

**请求参数**:

- **functionAreaItem.faiId**:
  ID
        - **functionAreaItem.formula**:
  公式

        **示例**:{
                "functionAreaItem.faiId": 1,
                "functionAreaItem.formula": "a*b+c"
            }

    ### `updateFunctionAreaItemForSort` <span style="color:gray">[内部]</span>

        更新功能区中报价项排序

**请求参数**:

- **functionAreaItems[n].faiid**:
  项目ID
        - **functionAreaItems[n].sort**:
  排序

        **示例**:{
                "functionAreaItems[0].faiid": 1,
                "functionAreaItems[0].sort": 0,
                "functionAreaItems[1].faiid": 1,
                "functionAreaItems[1].sort": 1
            }

    ### `deleteFunctionAreaItemByIds` <span style="color:gray">[内部]</span>

        通过功能区包含报价项ID删除报价项信息

**请求参数**:

- **ids**: 功能区包含报价项ID列表 , 每条数据类型 Long
          - 类型: *List*

        **示例**:{
                "ids[0]": 1,
                "ids[1]": 2
            }

### 价格

## api.data.QuotationPriceAction

**数据类型**:

#### quotationPrice

    - **qpid**: 价格ID
      - 类型: *Long*
    - **quotationItem**: 报价项信息 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageQuotationPrice` <span style="color:gray">[内部]</span>

        分页方式获取报价价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  报价价格信息列表 , 每条数据类型 *quotationPrice*

        **示例**:{
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

    ### `queryQuotationPrice` <span style="color:gray">[内部]</span>

        通过报价项获取价格信息

**请求参数**:

- **quotationPrice.quotationItem.qiid**:
  报价项ID
        - **quotationPrice.updateTime**:
  更新时间

**返回参数**:

- **quotationPrices**: 报价价格信息 , 类型 *quotationPrice*
          - 类型: *List*

        **示例**:{
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

    ### `addQuotationPrice` <span style="color:gray">[内部]</span>

        添加报价价格

**请求参数**:

- **quotationPrice.quotationItem.qiid**:
  报价项ID
        - **quotationPrice.addPrice**:
  增补价
        - **quotationPrice.unitPrice**:
  增补价
        - **quotationPrice.subPrice**:
  退减价
        - **quotationPrice.updateTime**:
  更新时间

        **示例**:{
                "quotationPrice.quotationItem.qiid": 1,
                "quotationPrice.addPrice": 10000000,
                "quotationPrice.unitPrice": 100000,
                "quotationPrice.subPrice": 100000,
                "quotationPrice.updateTime": "2016-01-01 00:00:00"
            }

    ### `updateQuotationPrice` <span style="color:gray">[内部]</span>

        更新报价价格

**请求参数**:

- **quotationPrice.qpid**:
  价格ID
        - **quotationPrice.addPrice**:
  增补价
        - **quotationPrice.unitPrice**:
  增补价
        - **quotationPrice.subPrice**:
  退减价
        - **quotationPrice.updateTime**:
  更新时间

        **示例**:{
                "quotationPrice.qpid": 1,
                "quotationPrice.addPrice": 10000000,
                "quotationPrice.unitPrice": 100000,
                "quotationPrice.subPrice": 100000,
                "quotationPrice.updateTime": "2016-01-01 00:00:00"
            }

    ### `deleteQuotationPrice` <span style="color:gray">[内部]</span>

        删除报价价格

**请求参数**:

- **quotationPrice.qpid**:
  价格ID

        **示例**:{
                "quotationPrice.qpid": 1
            }

## 预签

### 产品

## api.data.PresignProduceAction

**数据类型**:

#### presignProduce

    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **version**: 报价版本 , 类型 [quotationVersion](./data.html#api.data.QuotationVersionAction.quotationVersion)
      - 类型: *Object*
    - **quotePrice**: 起报价
      - 类型: *Long*
    - **quoteArea**: 起报面积
      - 类型: *Integer*
    - **unitPrice**: 计价单价
      - 类型: *Long*
    - **discount**: 折扣
      - 类型: *Integer*
    - **discountt**: 二级折扣
      - 类型: *Integer*
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageFormula**: 管理费公式
      - 类型: *String*
    - **manageDiscount**: 管理费折扣
      - 类型: *Integer*
    - **manageDiscountt**: 管理费折扣
      - 类型: *Integer*
    - **preferPrice**: 优惠额
      - 类型: *Long*
    - **costPrice**: 成本单价
      - 类型: *Long*
    - **mostPrice**: 主材成本
      - 类型: *Long*
    - **profitRate**: 利润率
      - 类型: *Integer*
    - **costRate**: 工程增项成本比例
      - 类型: *Integer*
    - **mostRate**: 主材增项成本比例
      - 类型: *Integer*
    - **offset**: 偏移量
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 发布
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pagePresignProduce` <span style="color:gray">[内部]</span>

        分页方式获取预签产品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  预签产品信息列表 , 每条数据类型 *presignProduce*

        **示例**:{
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

    ### `queryPresignProduce` <span style="color:gray">[内部]</span>

        获取预签产品信息 , 状态为1(发布)

**返回参数**:

- **presignProduces**: 预签产品列表 , 每条数据类型 *presignProduce*
          - 类型: *List*

        **示例**:{
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

    ### `queryPresignProduceByPpid` <span style="color:gray">[内部]</span>

        通过预签产品ID获取信息

**返回参数**:

- **presignProduce**: 预签产品信息 , 类型 *presignProduce*
          - 类型: *Object*

        **示例**:{
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

    ### `addPresignProduce` <span style="color:gray">[内部]</span>

        添加预签产品

**请求参数**:

- **presignProduce.name**:
  名称
        - **presignProduce.version.qvid**:
  报价版本ID
        - **presignProduce.quotePrice**:
  起报价
        - **presignProduce.quoteArea**:
  起报面积
        - **presignProduce.unitPrice**:
  计价单价
        - **presignProduce.discount**:
  折扣
        - **presignProduce.manageRate**:
  管理费比例
        - **presignProduce.manageFormula**:
  管理费公式
        - **presignProduce.preferPrice**:
  优惠额
        - **presignProduce.costPrice**:
  成本单价
        - **presignProduce.mostPrice**:
  主材成本
        - **presignProduce.profitRate**:
  利润率
        - **presignProduce.costRate**:
  工程增项成本比例
        - **presignProduce.mostRate**:
  主材增项成本比例
        - **presignProduce.offset**:
  偏移量

        **示例**:{
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

    ### `updatePresignProduce` <span style="color:gray">[内部]</span>

        更新预签产品

        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

        判断预签产品状态为0(初始) , 其他状态 , 错误信息 **130081 预签产品不可操作**

**请求参数**:

- **presignProduce.ppid**:
  预签产品ID
        - **presignProduce.name**:
  名称
        - **presignProduce.version.qvid**:
  报价版本ID
        - **presignProduce.quotePrice**:
  起报价
        - **presignProduce.quoteArea**:
  起报面积
        - **presignProduce.unitPrice**:
  计价单价
        - **presignProduce.discount**:
  折扣
        - **presignProduce.manageRate**:
  管理费比例
        - **presignProduce.manageFormula**:
  管理费公式
        - **presignProduce.preferPrice**:
  优惠额
        - **presignProduce.costPrice**:
  成本单价
        - **presignProduce.mostPrice**:
  主材成本
        - **presignProduce.profitRate**:
  利润率
        - **presignProduce.costRate**:
  工程增项成本比例
        - **presignProduce.mostRate**:
  主材增项成本比例
        - **presignProduce.offset**:
  偏移量

        **示例**:{
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

    ### `updatePresignProduceForStatus` <span style="color:gray">[内部]</span>

        更新预签产品状态

        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

**请求参数**:

- **presignProduce.ppid**:
  预签产品ID
        - **presignProduce.status**:
  状态

        **示例**:{
                "presignProduce.ppid": 1,
                "presignProduce.status": 0
            }

    ### `copyPresignProduce` <span style="color:gray">[内部]</span>

        复制预签产品

        判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

**请求参数**:

- **presignProduce.ppid**:
  预签产品ID
        - **presignProduce.name**:
  产品名称

        **示例**:{
                "presignProduce.ppid": 1,
                "presignProduce.name": "产品名称"
            }

### 价格

## api.data.PresignPriceAction

**数据类型**:

#### presignPrice

    - **pspid**: 价格ID
      - 类型: *Long*
    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **upperArea**: 起始面积
      - 类型: *Integer*
    - **lowerArea**: 终止面积
      - 类型: *Integer*
    - **price**: 价格
      - 类型: *Long*
    - **costPrice**: 工程成本
      - 类型: *Integer*
    - **mostPrice**: 主材成本
      - 类型: *Integer*
    - **status**: 状态
      - 类型: *Short*

    ### `pagePresignPrice` <span style="color:gray">[内部]</span>

        分页方式获取预签价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  预签价格信息列表 , 每条数据类型 *presignPrice*

        **示例**:{
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

    ### `addPresignPrice` <span style="color:gray">[内部]</span>

        添加预签价格

**请求参数**:

- **presignPrice.ppid**:
  预签产品ID
        - **presignPrice.name**:
  名称
        - **presignProduce.upperArea**:
  起报价
        - **presignProduce.lowerArea**:
  起报面积
        - **presignProduce.price**:
  计价单价
        - **presignProduce.costPrice**:
  工程成本
        - **presignProduce.mostPrice**:
  主材成本

        **示例**:{
                "presignProduce.ppid": 1,
                "presignProduce.name": "名称",
                "presignProduce.upperArea": 10000000,
                "presignProduce.lowerArea": 100000,
                "presignProduce.price": 100000,
                "presignProduce.costPrice": 0,
                "presignProduce.mostPrice": 0
            }

    ### `updatePresignPrice` <span style="color:gray">[内部]</span>

        更新预签价格

**请求参数**:

- **presignPrice.pspid**:
  预签价格ID
        - **presignPrice.name**:
  名称
        - **presignProduce.upperArea**:
  起报价
        - **presignProduce.lowerArea**:
  起报面积
        - **presignProduce.price**:
  计价单价
        - **presignProduce.costPrice**:
  工程成本
        - **presignProduce.mostPrice**:
  主材成本

        **示例**:{
                "presignProduce.pspid": 1,
                "presignProduce.name": "名称",
                "presignProduce.upperArea": 10000000,
                "presignProduce.lowerArea": 100000,
                "presignProduce.price": 100000,
                "presignProduce.costPrice": 0,
                "presignProduce.mostPrice": 0
            }

    ### `updatePresignPriceForStatus` <span style="color:gray">[内部]</span>

        更新预签价格

        判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**

**请求参数**:

- **presignPrice.pspid**:
  预签价格ID
        - **presignPrice.status**:
  状态

        **示例**:{
                "presignProduce.pspid": 1,
                "presignProduce.status": 0
            }

    ### `deletePresignPrice` <span style="color:gray">[内部]</span>

        删除预签价格

        判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**

**请求参数**:

- **presignPrice.pspid**:
  预签价格ID

        **示例**:{
                "presignProduce.pspid": 1
            }

### 项目

## api.data.PresignItemAction

**数据类型**:

#### presignItem

    - **piid**: 预签项ID
      - 类型: *Long*
    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **basicNum**: 基础量
      - 类型: *Integer*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **price**: 价格
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **achePrice**: 业绩
      - 类型: *Integer*
    - **areaCale**: 面积规则 , 0: 数量 , 1: 面积
      - 类型: *Short*
    - **type**: 类型 , 0: 功能区 , 1: 可选配 , 2: 个性 , 3: 赋能
      - 类型: *Short*
    - **onetype**: 一类 , 0: 标准 , 1: 标配 , 2: 标减
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 通用 , 1: 工程 , 2: 主材
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*

    ### `pagePresignItem` <span style="color:gray">[内部]</span>

        分页方式获取预签项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **presignItem.ppid**:
  预签产品ID
        - **presignItem.status**:
  状态

        - **types**: 类型
          - 类型: *List*

        **示例**:{
                "presignItem.ppid": 1,
                "presignItem.status": 1,

                "types[0]": 0,
                "types[1]": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  预签项列表 , 每条数据类型 *presignItem*

        **示例**:{
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

    ### `queryPresignItemByPiid` <span style="color:gray">[内部]</span>

        通过预签项ID获取预签项信息

**请求参数**:

- **presignItem.piid**:
  预签项ID

        **示例**:{
                "presignItem.piid": 1
            }

**返回参数**:

- **presignItem**: 预签项 , 类型 *presignItem*
          - 类型: *Object*

        **示例**:{
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

    ### `addPresignItem` <span style="color:gray">[内部]</span>

        添加预签项

**请求参数**:

- **presignItem.ppid**:
  预签产品ID
        - **presignItem.name**:
  名称
        - **presignItem.basicNum**:
  基础量
        - **presignItem.addPrice**:
  增补价
        - **presignItem.price**:
  价格
        - **presignItem.subPrice**:
  退减价
        - **presignItem.cost**:
  成本
        - **presignItem.ache**:
  业绩
        - **presignItem.areaCale**:
  面积规则
        - **presignItem.type**:
  类型
        - **presignItem.onetype**:
  一类
        - **presignItem.atttype**:
  业务类型
        - **presignItem.content**:
  说明

        **示例**:{
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

    ### `updatePresignItem` <span style="color:gray">[内部]</span>

        更新预签项

        判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**

        判断预签项状态为0(启用) , 其他状态 , 错误信息 **130087 预签项不可操作**

**请求参数**:

- **presignItem.piid**:
  预签项ID
        - **presignItem.name**:
  名称
        - **presignItem.basicNum**:
  基础量
        - **presignItem.addPrice**:
  增补价
        - **presignItem.price**:
  价格
        - **presignItem.subPrice**:
  退减价
        - **presignItem.cost**:
  成本
        - **presignItem.ache**:
  业绩
        - **presignItem.areaCale**:
  面积规则
        - **presignItem.type**:
  类型
        - **presignItem.onetype**:
  一类
        - **presignItem.atttype**:
  业务类型
        - **presignItem.content**:
  说明

        **示例**:{
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

    ### `updatePresignItemForStatus` <span style="color:gray">[内部]</span>

        更新预签项状态

        判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**

**请求参数**:

- **presignItem.piid**:
  预签项ID
        - **presignItem.status**:
  状态

        **示例**:{
                "presignItem.piid": 1,
                "presignItem.status": 0
            }

    ### `deletePresignItem` <span style="color:gray">[内部]</span>

        删除预签项

**请求参数**:

- **presignItem.piid**:
  预签项ID

        **示例**:{
                "presignItem.piid": 1
            }

### 成本

## api.quotation.PresignCostAction

**数据类型**:

#### presignCost

    - **pcid**: 成本ID
      - 类型: *Long*
    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **toplimit**: 上限面积
      - 类型: *Integer*
    - **lowlimit**: 下限面积
      - 类型: *Integer*
    - **costPrice**: 成本单价
      - 类型: *Integer*

    ### `queryPresignCost` <span style="color:gray">[内部]</span>

        通过预签产品获取成本信息

**请求参数**:

- **presignCost.ppid**:
  预签产品ID

        **示例**:{
                "presignCost.ppid": 1
            }

**返回参数**:

- **presignCosts**: 预签成本列表 , 类型 *presignCost*
          - 类型: *List*

        **示例**:{
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

    ### `addPresignCost` <span style="color:gray">[内部]</span>

        添加预签成本

**请求参数**:

- **presignCost.ppid**:
  预签产品ID
        - **presignCost.toplimit**:
  上限面积
        - **presignCost.lowlimit**:
  下限面积
        - **presignCost.costPrice**:
  成本单价

        **示例**:{
                "presignCost.ppid": 1
            }

    ### `deletePresignCost` <span style="color:gray">[内部]</span>

        删除预签成本

**请求参数**:

- **presignCost.pcid**:
  成本ID

        **示例**:{
                "presignCost.pcid": 1
            }

## 定额

### 共享工费

## api.data.NormriceAction

**数据类型**:

#### cormrice

    - **cpid**: 定额工费ID
      - 类型: *Long*
    - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*
    - **quotationCtem**: 共享项 , 类型 [quotationCtem](./data.html#api.data.QuotationItemAction.quotationCtem)
      - 类型: *Object*
    - **unit**: 定额单位
      - 类型: *String*
    - **trannum**: 转换量
      - 类型: *Integer*
    - **salary**: 薪资
      - 类型: *Integer*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `pageCormrice` <span style="color:gray">[内部]</span>

        分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  定额工费信息列表 , 每条数据类型 *cormrice*

        **示例**:{
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

    ### `queryCormriceByQcid` <span style="color:gray">[内部]</span>

        通过共享项ID获取定额工费信息

**请求参数**:

- **cormrice.quotationCtem.qcid**:
  共享项ID

        **示例**:{
                "cormrice.quotationCtem.qcid": 1
            }

**返回参数**:

- **cormrices**: 定额工费信息列表 , 每条数据类型 *cormrice*
          - 类型: *List*

        **示例**:{
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

    ### `addCormrice` <span style="color:gray">[内部]</span>

        添加定额工费信息

**请求参数**:

- **cormrice.constructionNode.cnid**:
  施工节点ID
        - **cormrice.quotationCtem.qcid**:
  报价项ID
        - **cormrice.salary**:
  薪资

        **示例**:{
                "cormrice.constructionNode.cnid": 1,
                "cormrice.quotationCtem.qcid": 1,
                "cormrice.salary": 1000
            }

    ### `deleteCormrice` <span style="color:gray">[内部]</span>

        删除定额工费信息

**请求参数**:

- **cormrice.cpid**:
  定额工费ID

        **示例**:{
                "cormrice.cpid": 1
            }

### 材料项

## api.data.NormoodAction

**数据类型**:

#### normood

    - **ngid**: 定额商品ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **noods**: 定材 , 类型 [noods](./data.html#api.data.NoodsAction.noods)
      - 类型: *Object*
    - **quotationItem**: 报价项 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*
    - **normunit**: 定额单位
      - 类型: *String*
    - **normnum**: 定额数量
      - 类型: *Integer*
    - **storeunit**: 库房单位
      - 类型: *String*
    - **storenum**: 库房数量
      - 类型: *Integer*
    - **price**: 价格
      - 类型: *Integer*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `pageNormood` <span style="color:gray">[内部]</span>

        分页方式获取定额材料信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  定额材料信息列表 , 每条数据类型 *normood*

        **示例**:{
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

    ### `queryNormoodByQiid` <span style="color:gray">[内部]</span>

        通过报价项ID获取定额商品

**请求参数**:

- **normood.quotationItem.qiid**:
  报价项ID

**返回参数**:

- **normoods**: 定额商品信息列表 , 每条数据类型 *normood*
          - 类型: *List*

        **示例**:{
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

    ### `addNormood` <span style="color:gray">[内部]</span>

        添加定额材料

**请求参数**:

- **normood.name**:
  名称
        - **normood.noods.nid**:
  定材ID
        - **normood.quotationItem.qiid**:
  报价项ID
        - **normood.normunit**:
  定额单位
        - **normood.normnum**:
  定额数量
        - **normood.storeunit**:
  库房单位
        - **normood.storenum**:
  库房数量
        - **normood.price**:
  价格

        **示例**:{
                "normood.name": "名称",
                "normood.noods.nid": 1,
                "normood.quotationItem.qiid": 1,
                "normood.normunit": "个",
                "normood.normnum": 1000,
                "normood.storeunit": "个",
                "normood.storenum": 1000,
                "normood.price": 1000
            }

    ### `deleteNormood` <span style="color:gray">[内部]</span>

        删除定额材料

**请求参数**:

- **normood.ngid**:
  定额材料ID

        **示例**:{
                "normood.ngid": 1
            }

### 工费项

## api.data.NormriceAction

**数据类型**:

#### normrice

    - **npid**: 定额工费ID
      - 类型: *Long*
    - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*
    - **quotationItem**: 报价项 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*
    - **unit**: 定额单位
      - 类型: *String*
    - **trannum**: 转换量
      - 类型: *Integer*
    - **salary**: 薪资
      - 类型: *Integer*
    - **stuff**: 材料费
      - 类型: *Integer*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `pageNormrice` <span style="color:gray">[内部]</span>

        分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  定额工费信息列表 , 每条数据类型 *normrice*

        **示例**:{
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

    ### `queryNormriceByQiid` <span style="color:gray">[内部]</span>

        通过报价项ID获取定额工费

**请求参数**:

- **normrice.quotationItem.qiid**:
  报价项ID

        **示例**:{
                "normrice.quotationItem.qiid": 1
            }

**返回参数**:

- **normrices**: 定额商品信息列表 , 每条数据类型 *normrice*
          - 类型: *List*

        **示例**:{
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

    ### `addNormrice` <span style="color:gray">[内部]</span>

        添加定额薪资

**请求参数**:

- **normrice.constructionNode.cnid**:
  施工节点ID
        - **normrice.quotationItem.qiid**:
  报价项ID
        - **normrice.trannum**:
  转换量
        - **normrice.salary**:
  薪资
        - **normrice.stuff**:
  材料费

        **示例**:{
                "normrice.constructionNode.cnid": 1,
                "normrice.quotationItem.qiid": 1,
                "normrice.trannum": 1000,
                "normrice.salary": 1000,
                "normrice.stuff": 1000
            }

    ### `deleteNormrice` <span style="color:gray">[内部]</span>

        删除定额薪资

**请求参数**:

- **normrice.npid**:
  定额薪资ID

        **示例**:{
                "normrice.npid": 1
            }

### 附加项

针对于定额工费提供的基础数据

## api.data.NormaddAction

**数据类型**:

#### normadd

    - **naid**: 附加项ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*
    - **unit**: 单位
      - 类型: *String*
    - **price**: 单价
      - 类型: *Integer*
    - **stuff**: 材料费
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageNormadd` <span style="color:gray">[内部]</span>

        分页方式获取附加项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  附加项信息列表 , 每条数据类型 *normadd*

        **示例**:{
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

    ### `queryNormadd` <span style="color:gray">[内部]</span>

        获取附加项信息 , 可通过施工节点进行控制

**请求参数**:

- **normadd.constructionNode.cnid**:
  节点ID

        **示例**:{
                "normadd.constructionNode.cnid": 1
            }

**返回参数**:

- **normadds**: 附加项信息列表 , 每条数据类型 *normadd*
          - 类型: *List*

        **示例**:{
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

    ### `addNormadd` <span style="color:gray">[内部]</span>

        添加附加项

**请求参数**:

- **normadd.name**:
  名称
        - **normadd.constructionNode.cnid**:
  节点ID
        - **normadd.unit**:
  单位
        - **normadd.price**:
  单价
        - **normadd.stuff**:
  材料费

        **示例**:{
                "normadd.name": "名称",
                "normadd.constructionNode.cnid": 1,
                "normadd.unit": "米",
                "normadd.price": 1000,
                "normadd.stuff": 0
            }

    ### `updateNormaddForStatus` <span style="color:gray">[内部]</span>

        更新附加项状态

**请求参数**:

- **normadd.aiid**:
  附加项ID
        - **normadd.status**:
  状态

        **示例**:{
                "normadd.aiid": 1,
                "normadd.status": 0
            }

    ### deleteNormadd

        删除附加项

**请求参数**:

- **normadd.aiid**:
  附加项ID

        **示例**:{
                "normadd.aiid": 1
            }

### 打包项

针对于定额材料提供的基础数据

## api.data.NormpackAction

**数据类型**:

#### normpack

    - **npid**: 打包项ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    #### normpackItem

    - **npiid**: 打包项ID
      - 类型: *Long*
    - **npid**: 打包项ID
      - 类型: *Long*
    - **noods**: 定材 , 类型 [noods](./data.html#api.data.NoodsAction.noods)
      - 类型: *Object*
    - **normunit**: 定额单位
      - 类型: *String*
    - **normnum**: 定额数量
      - 类型: *Integer*
    - **storeunit**: 库房单位
      - 类型: *String*
    - **storenum**: 数量
      - 类型: *Integer*
    - **price**: 价格
      - 类型: *Integer*

    ### `pageNormpack` <span style="color:gray">[内部]</span>

        分页方式获取打包项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  打包项信息列表 , 每条数据类型 *normpack*

        **示例**:{
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

    ### `queryNormpack` <span style="color:gray">[内部]</span>

        获取打包项信息 , 可通过施工节点进行控制

**返回参数**:

- **normpacks**: 打包项信息列表 , 每条数据类型 *normpack*
          - 类型: *List*

        **示例**:{
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

    ### `queryNormpackItem` <span style="color:gray">[内部]</span>

        获取打包项信息

**请求参数**:

- **normpack.npid**:
  打包项ID

        **示例**:{
                "normpack.npid": 1
            }

**返回参数**:

- **normpackItems**: 打包项信息列表 , 每条数据类型 *normpackItem*
          - 类型: *List*

        **示例**:{
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

    ### `addNormpack` <span style="color:gray">[内部]</span>

        添加打包项

**请求参数**:

- **normpack.name**:
  名称

        **示例**:{
                "normpack.name": "名称"
            }

    ### `addNormpackItem` <span style="color:gray">[内部]</span>

        添加打包项

**请求参数**:

- **normpackItem.npid**:
  打包项ID
        - **normpackItem.noods.nid**:
  定材ID
        - **normpackItem.normunit**:
  定额单位
        - **normpackItem.normnum**:
  定额数量
        - **normpackItem.storeunit**:
  库房单位
        - **normpackItem.storenum**:
  数量
        - **normpackItem.price**:
  价格

        **示例**:{
                "normpackItem.npid": 1,
                "normpackItem.noods.nid": 1,
                "normpackItem.normunit": 10000,
                "normpackItem.normnum": "个",
                "normpackItem.storeunit": 10000,
                "normpackItem.storenum": 10000,
                "normpackItem.price": 1000
            }

    ### `updateNormpackForStatus` <span style="color:gray">[内部]</span>

        更新打包项状态

**请求参数**:

- **normpack.npid**:
  打包项ID
        - **normpack.status**:
  状态

        **示例**:{
                "normpack.npid": 1,
                "normpack.status": 0
            }

    ### deleteNormpack

        删除打包项

**请求参数**:

- **normpack.npid**:
  打包项ID

        **示例**:{
                "normpack.npid": 1
            }

    ### deleteNormpackItem

        删除打包项

**请求参数**:

- **normpackItem.npiid**:
  打包项ID

        **示例**:{
                "normpackItem.npiid": 1
            }

## 信息

### 任务

## api.communion.TaskAction

**数据类型**:

#### task

    - **tid**: 任务ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **filepath**: 执行文件路径
      - 类型: *String*
    - **level**: 等级 , 0: 功能级 , 1: 模块级
      - 类型: *Short*
    - **type**: 类型 , 0: python, 1: shell
      - 类型: *Short*
    - **handle**: 操作 , 0: 读 , 1: 写
      - 类型: *Short*
    - **server**: 服务
      - 类型: *Integer*
    - **week**: 星期
      - 类型: *String*
    - **day**: 天数
      - 类型: *String*
    - **hour**: 小时
      - 类型: *String*
    - **plugins**: 控件 , A: 时间区间, B: 月份区间, C: 上传附件, D: 自定义参数
      - 类型: *String*
    - **keyword**: 关键字
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **isShow**: 显示标识 , 0: 显示 , 1: 不显示
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    #### taskParam

    - **tpid**: 字段ID
      - 类型: *Long*
    - **tid**: 任务ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *Integer*
    - **name**: 名称
      - 类型: *String*
    - **table**: 表名
      - 类型: *String*
    - **union**: 关联
      - 类型: *String*
    - **param**: 字段
      - 类型: *String*
    - **alias**: 别名
      - 类型: *String*
    - **type**: 类型 , 0: 文本 , 1: 数值
      - 类型: *Short*
    - **handle**: 处理过程
      - 类型: *String*
    - **status**: 状态
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*

    ### `pageTask` <span style="color:gray">[内部]</span>

        分页方式获取任务信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  任务信息列表 , 每条数据类型 *task*

        **示例**:{
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

    ### `queryTask` <span style="color:gray">[内部]</span>

        获取当前任务信息 , 状态为0(启用) , 显示标识为0(显示)

**返回参数**:

- **tasks**: 任务信息列表 , 每条数据类型 *task*
          - 类型: *List*

        **示例**:{
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

    ### `queryTaskForSelf` <span style="color:gray">[内部]</span>

        获取当前操作系统用户任务信息

**返回参数**:

- **tasks**: 任务信息列表 , 每条数据类型 *task*
          - 类型: *List*

        **示例**:{
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

    ### `queryTaskByRid` <span style="color:gray">[内部]</span>

        通过角色ID获取任务信息

**请求参数**:

- **role.rid**:
  角色ID

        **示例**:{
                "role.rid": 1
            }

**返回参数**:

- **tasks**: 任务信息列表 , 每条数据类型 *task*
          - 类型: *List*

        **示例**:{
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

    ### `addTask` <span style="color:blue">[自定义]</span>

        添加任务

**请求参数**:

- **task.name**:
  名称
        - **task.filepath**:
  文件路径 , 绝对路径
        - **task.level**:
  级别
        - **task.type**:
  类型
        - **task.handle**:
  操作
        - **task.plugins**:
  控件
        - **task.keyword**:
  关键字
        - **task.comment**:
  关键字

        **示例**:{
                "task.name": "1601010001",
                "task.filepath": "/fanglin/task/execution.py",
                "task.level": 0,
                "task.type": 1,
                "task.handle": 0,
                "task.plugins": "A",
                "task.keyword": "Exports",
                "task.comment": ""
            }

    ### `updateTaskForStatus` <span style="color:blue">[自定义]</span>

        更新任务状态

        判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**

**请求参数**:

- **task.tid**:
  任务ID
        - **task.status**:
  状态

        **示例**:{
                "task.tid": 1,
                "task.status": 0
            }

    ### `updateTaskForIsShow` <span style="color:blue">[自定义]</span>

        更新任务可见

        判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**

**请求参数**:

- **task.tid**:
  任务ID
        - **task.isShow**:
  可见

        **示例**:{
                "task.tid": 1,
                "task.isShow": 0
            }

    ### `updateRoleTask` <span style="color:blue">[自定义]</span>

        更新角色对应任务信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**请求参数**:

- **role.rid**:
  角色ID
        - **task.tid**:
  任务ID

        **示例**:{
                "role.rid": 1,
                "task.tid": 1
            }

    ### `deleteRoleTask` <span style="color:blue">[自定义]</span>

        删除角色对应任务信息

**请求参数**:

- **role.rid**:
  角色ID
        - **task.tid**:
  任务ID

        **示例**:{
                "role.rid": 1,
                "task.tid": 1
            }

    ### `pageTaskParam` <span style="color:blue">[自定义]</span>

        分页方式获取任务字段信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  任务字段信息列表 , 每条数据类型 *taskParam*

        **示例**:{
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

    ### `queryTaskParam` <span style="color:blue">[自定义]</span>

        获取任务字段

**请求参数**:

- **task.tid**:
  任务ID

        **示例**:{
                "task.tid": 1
            }

**返回参数**:

- **taskParams**: 任务字段信息列表 , 每条数据类型 *taskParam*
          - 类型: *List*

        **示例**:{
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

    ### `addTaskParam` <span style="color:blue">[自定义]</span>

        添加任务字段

**请求参数**:

- **taskParam.tid**:
  任务ID
        - **taskParam.no**:
  编号
        - **taskParam.name**:
  名称
        - **taskParam.table**:
  表名
        - **taskParam.union**:
  关联
        - **taskParam.param**:
  字段
        - **taskParam.alias**:
  别名
        - **taskParam.type**:
  类型
        - **taskParam.handle**:
  处理过程
        - **taskParam.sort**:
  排序
        - **taskParam.comment**:
  说明

        **示例**:{
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

    ### `updateTaskParam` <span style="color:blue">[自定义]</span>

        更新任务字段

**请求参数**:

- **taskParam.tpid**:
  任务字段ID
        - **taskParam.tid**:
  任务ID
        - **taskParam.no**:
  编号
        - **taskParam.name**:
  名称
        - **taskParam.table**:
  表名
        - **taskParam.union**:
  关联
        - **taskParam.param**:
  字段
        - **taskParam.alias**:
  别名
        - **taskParam.type**:
  类型
        - **taskParam.handle**:
  处理过程
        - **taskParam.sort**:
  排序
        - **taskParam.comment**:
  说明

        **示例**:{
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

    ### `updateTaskParamForStatus` <span style="color:blue">[自定义]</span>

        更新任务字段状态

**请求参数**:

- **taskParam.tpid**:
  任务字段ID
        - **taskParam.status**:
  状态

        **示例**:{
                "taskParam.tpid": 1,
                "taskParam.status": 1
            }

    ### `deleteTaskParam` <span style="color:blue">[自定义]</span>

        删除任务字段

**请求参数**:

- **taskParam.tpid**:
  任务字段ID

        **示例**:{
                "taskParam.tpid": 1
            }

## 工程

### 施工节点

## api.data.ConstructionNodeAction

**数据类型**:

#### constructionNode

    - **cnid**: 节点ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **precheck**: 开工验证付款比例
      - 类型: *Integer*
    - **postcheck**: 完工验证付款比例
      - 类型: *Integer*
    - **stacheck**: 开工验证销售比例
      - 类型: *Integer*
    - **fincheck**: 完工验证销售比例
      - 类型: *Integer*
    - **startalk**: 开工话术
      - 类型: *String*
    - **endtalk**: 完工话术
      - 类型: *String*
    - **startSurvey**: 开工调研模版 , 类型 [surveyTemplate](./data.html#api.data.SurveyTemplateAction.surveyTemplate)
      - 类型: *Object*
    - **endSurvey**: 完工调研模版 , 类型 [surveyTemplate](./data.html#api.data.SurveyTemplateAction.surveyTemplate)
      - 类型: *Object*
    - **timeLimit**: 工期
      - 类型: *Integer*
    - **sort**: 排序
      - 类型: *Short*
    - **kino**: 金蝶编号
      - 类型: *String*
    - **kiname**: 金蝶名称
      - 类型: *String*

    ### `pageConstructionNode` <span style="color:gray">[内部]</span>

        分页方式获取工程节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  工程节点信息列表 , 每条数据类型 *constructionNode*

        **示例**:{
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

    ### `queryConstructionNode` <span style="color:gray">[内部]</span>

        获取工程节点信息

**返回参数**:

- **constructionNodes**: 工程节点信息列表 , 每条数据类型 *constructionNode*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructionNodeByCnid` <span style="color:gray">[内部]</span>

        通过工程节点ID获取信息

**请求参数**:

- **constructionNode.cnid**:
  工程节点ID

        **示例**:{
                "constructionNode.cnid": 1
            }

**返回参数**:

- **constructionNode**: 工程节点信息 , 类型 *constructionNode*
          - 类型: *Object*

        **示例**:{
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

    ### `queryConstructionNodeByOrderId` <span style="color:gray">[内部]</span>

        通过装修单归属公司 , 获取对应的工程节点信息

**请求参数**:

- **orderId**: 装修单号
          - 类型: *String*

        **示例**:{
                "orderId": "1601010001"
            }

**返回参数**:

- **constructionNodes**: 工程节点信息列表 , 每条数据类型 *constructionNode*
          - 类型: *List*

        **示例**:{
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

    ### `addConstructionNode` <span style="color:gray">[内部]</span>

        添加工程节点信息

**请求参数**:

- **constructionNode.name**:
  名称
        - **constructionNode.precheck**:
  开工验证付款比例
        - **constructionNode.postcheck**:
  开工验证付款比例
        - **constructionNode.stacheck**:
  开工验证销售比例
        - **constructionNode.fincheck**:
  完工验证销售比例
        - **constructionNode.startalk**:
  开工话术
        - **constructionNode.endtalk**:
  完工话术
        - **constructionNode.timeLimit**:
  工期
        - **constructionNode.startSurvey.stid**:
  开工调研模版ID
        - **constructionNode.endSurvey.stid**:
  完工调研模版ID
        - **constructionNode.kino**:
  金蝶编号
        - **constructionNode.kiname**:
  金蝶名称

        **示例**:{
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

    ### `updateConstructionNode` <span style="color:gray">[内部]</span>

        更新工程节点信息

**请求参数**:

- **constructionNode.cnid**:
  节点ID
        - **constructionNode.precheck**:
  开工验证款比例
        - **constructionNode.postcheck**:
  完工验证款比例
        - **constructionNode.stacheck**:
  开工验证销售比例
        - **constructionNode.fincheck**:
  完工验证销售比例
        - **constructionNode.startalk**:
  开工话术
        - **constructionNode.endtalk**:
  完工话术
        - **constructionNode.timeLimit**:
  工期
        - **constructionNode.startSurvey.stid**:
  开工调研模版ID
        - **constructionNode.endSurvey.stid**:
  完工调研模版ID
        - **constructionNode.kino**:
  金蝶编号
        - **constructionNode.kiname**:
  金蝶名称

        **示例**:{
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

    ### `updateConstructionNodeForStatus` <span style="color:gray">[内部]</span>

        更新工程节点状态

**请求参数**:

- **constructionNode.cnid**:
  节点ID
        - **constructionNode.status**:
  状态

        **示例**:{
                "constructionNode.cnid": 1,
                "constructionNode.status": 0
            }

### 施工计划

## api.data.ConstructionPaceAction

**数据类型**:

#### constructionPace

    - **cpid**: 计划ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*

    ### `pageConstructionPace` <span style="color:gray">[内部]</span>

        分页方式获取施工计划信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  施工计划信息列表 , 每条数据类型 *constructionPace*

        **示例**:{
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

    ### `queryConstructionPace` <span style="color:gray">[内部]</span>

        获取工程计划信息

**返回参数**:

- **constructionPaces**: 施工计划信息列表 , 每条数据类型 *constructionPace*
          - 类型: *List*

        **示例**:{
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

    ### `addConstructionPace` <span style="color:gray">[内部]</span>

        添加工程计划

**请求参数**:

- **constructionPace.name**:
  名称
        - **constructionPace.content**:
  说明

        **示例**:{
                "constructionPace.name": "计划",
                "constructionPace.content": "说明"
            }

    ### `updateConstructionPace` <span style="color:gray">[内部]</span>

        更新工程计划

        判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**

**请求参数**:

- **constructionPace.cpid**:
  计划ID
        - **constructionPace.name**:
  名称
        - **constructionPace.content**:
  说明

        **示例**:{
                "constructionPace.cpid": 1,
                "constructionPace.name": "计划",
                "constructionPace.content": "说明"
            }

    ### `updateConstructionPaceForStatus` <span style="color:gray">[内部]</span>

        更新工程计划状态

        判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**

**请求参数**:

- **constructionPace.cpid**:
  计划ID
        - **constructionPace.status**:
  状态

        **示例**:{
                "constructionPace.cpid": 1,
                "constructionPace.status": 0
            }

### 放线小组

## api.data.DrawlineGroup

**数据类型**:

#### drawlineGroup

    - **dgid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1:禁用
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **groupName**: 名称
      - 类型: *String*

    ### <C/I> pageDrawlineGroup

        分页方式获取放线小组信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  放线信息列表 , 每条数据类型 *drawlineGroup*

        **示例**:{
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

    ### <C/I> queryDrawlineGroup

        获取状态为启用的放线小组信息

**返回参数**:

- **drawlineGroups**: 放线信息列表 , 每条数据类型 *drawlineGroup*
          - 类型: *List*

        **示例**:{
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

    ### `addDrawlineGroup` <span style="color:blue">[自定义]</span>

        添加放线小组信息

        判断放线小组名称是否存在 , 已经存在 , 错误信息 **130009 防线小组已存在**

**请求参数**:

- **drawline.name**:
  名称
        - **drawline.content**:
  说明

        **示例**:{
                "drawline.name": "放线一组",
                "drawline.content": "说明"
            }

    ### `updateDrawlineGroup` <span style="color:blue">[自定义]</span>

        更新放线小组信息

        判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**

**请求参数**:

- **drawline.dgid**:
  ID
        - **drawline.name**:
  名称
        - **drawline.content**:
  说明

        **示例**:{
                "drawline.dgid": 1,
                "drawline.name": "放线一组",
                "drawline.content": "说明"
            }

    ### `updateDrawlineGroupForStatus` <span style="color:blue">[自定义]</span>

        更新放线小组状态 , 实现于启用/禁用

        判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**

**请求参数**:

- **drawline.dgid**:
  ID
        - **drawline.status**:
  状态

        **示例**:{
                "drawline.dgid": 1,
                "drawline.status": 1
            }

### 工程成本

## api.data.ConstructionCostAction

**数据类型**:

#### constructionCost

    - **ccid**: 成本ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **areaLeft**: 起始面积
      - 类型: *Integer*
    - **areaRight**: 终止面积
      - 类型: *Integer*
    - **accessory**: 辅料额
      - 类型: *Long*
    - **salary**: 工费额
      - 类型: *Long*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageConstructionCost` <span style="color:gray">[内部]</span>

        分页方式获取工程成本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  工程成本信息列表 , 每条数据类型 *constructionCost*

        **示例**:{
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

    ### `queryConstructionCost` <span style="color:gray">[内部]</span>

        获取工程成本信息

**返回参数**:

- **constructionCosts**: 工程成本信息列表 , 每条数据类型 *constructionCost*
          - 类型: *List*

        **示例**:{
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

    ### `addConstructionCost` <span style="color:gray">[内部]</span>

        添加工程成本信息

**请求参数**:

- **constructionCost.name**:
  名称
        - **constructionCost.areaLeft**:
  开工验证款比例
        - **constructionCost.areaRight**:
  完工验证款比例
        - **constructionCost.accessory**:
  辅料额
        - **constructionCost.salary**:
  工费额

        **示例**:{
                "constructionCost.name": "节点名称",
                "constructionCost.areaLeft": 60000,
                "constructionCost.areaRight": 69000,
                "constructionCost.accessory": 12000000,
                "constructionCost.salary": 60000000,
            }

    ### `updateConstructionCost` <span style="color:gray">[内部]</span>

        更新工程成本信息

        判断工程成本是否存在 , 不存在 , 错误信息 **120029 工程成本不存在**

**请求参数**:

- **constructionCost.cnid**:
  成本ID
        - **constructionCost.name**:
  名称
        - **constructionCost.areaLeft**:
  起始面积
        - **constructionCost.areaRight**:
  终止面积
        - **constructionCost.accessory**:
  辅料额
        - **constructionCost.salary**:
  工费额

        **示例**:{
                "constructionCost.ccid": 1,
                "constructionCost.name": "节点名称",
                "constructionCost.areaLeft": 60000,
                "constructionCost.areaRight": 69000,
                "constructionCost.accessory": 12000000,
                "constructionCost.salary": 60000000,
            }

    ### `updateConstructionCostForStatus` <span style="color:gray">[内部]</span>

        更新工程成本状态

**请求参数**:

- **constructionCost.ccid**:
  成本ID
        - **constructionCost.status**:
  状态

        **示例**:{
                "constructionCost.ccid": 1,
                "constructionCost.status": 0
            }

### 辅材成本

## api.data.AoodsCostAction

    #### aoodsCost

    - **acid**: 辅材成本ID
      - 类型: *Long*
    - **aoods**: 辅材 , 类型 [aoods](./data.html#api.data.AoodsAction.aoods)
      - 类型: *Object*
    - **constructionCost**: 工程成本 , 类型 [constructionCost](./data.html#api.data.ConstructionCostAction.constructionCost)
      - 类型: *Object*
    - **numLimit**: 数量上限
      - 类型: *Integer*

    ### `pageAoodsCost` <span style="color:gray">[内部]</span>

        分页方式获取辅材成本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  辅材成本信息列表 , 每条数据类型 *aoodsCost*

        **示例**:{
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

    ### `addAoodsCost` <span style="color:gray">[内部]</span>

        添加辅材成本

**请求参数**:

- **aoodsCost.aoods.aid**:
  辅材ID
        - **aoodsCost.constructionCost.ccid**:
  工程成本ID
        - **aoodsCost.numLimit**:
  数量限制

        **示例**:{
                "aoodsCost.aoods.aid": 1,
                "aoodsCost.constructionCost.ccid": 1,
                "aoodsCost.numLimit": 1
            }

    ### `deleteAoodsCost` <span style="color:gray">[内部]</span>

        删除辅材成本

**请求参数**:

- **aoodsCost.acid**:
  辅材成本ID

        **示例**:{
                "aoodsCost.acid": 1
            }

### 工程工期

## api.data.ConstructionPeriodAction

**数据类型**:

#### constructionPeriod

    - **cpid**: 工期ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **typeness**: 业务类型
      - 类型: *Short*
    - **upperArea**: 起始面积
      - 类型: *Integer*
    - **lowerArea**: 终止面积
      - 类型: *Integer*
    - **period**: 工期
      - 类型: *Integer*
    - **company**: 公司
      - 类型: *Integer*

    ### `pageConstructionPeriod` <span style="color:gray">[内部]</span>

        分页方式获取工程工期信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  工程工期信息列表 , 每条数据类型 *constructionPeriod*

        **示例**:{
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

    ### `addConstructionPeriod` <span style="color:blue">[自定义]</span>

        添加品类信息

        - **constructionPeriod.name**:
  名称
        - **constructionPeriod.typeness**:
  业务类型
        :params constructionPeriod.upperArea: 起始面积
          - 类型: `Integer`
        :params constructionPeriod.lowerArea: 起始面积
          - 类型: `Integer`
        :params constructionPeriod.period: 工期
          - 类型: `Integer`
        **示例**:{
                "constructionPeriod.name": "地板",
                "constructionPeriod.typeness": -1,
                "constructionPeriod.upperArea": 10000,
                "constructionPeriod.lowerArea": 0
                "constructionPeriod.period": 10000
            }

    ### `updateConstructionPeriod` <span style="color:blue">[自定义]</span>

        更新工程工期

        - **constructionPeriod.cpid**:
  工期ID
        - **constructionPeriod.name**:
  名称
        - **constructionPeriod.typeness**:
  业务类型
        :params constructionPeriod.upperArea: 起始面积
          - 类型: `Integer`
        :params constructionPeriod.lowerArea: 起始面积
          - 类型: `Integer`
        :params constructionPeriod.period: 工期
          - 类型: `Integer`
        **示例**:{
                "constructionPeriod.cpid": 1,
                "constructionPeriod.name": "地板",
                "constructionPeriod.typeness": -1,
                "constructionPeriod.upperArea": 10000,
                "constructionPeriod.lowerArea": 0
                "constructionPeriod.period": 10000
            }

    ### `deleteConstructionPeriod` <span style="color:blue">[自定义]</span>

        删除工程工期

**请求参数**:

- **constructionPeriod.cpid**:
  工期ID

        **示例**:{
                "constructionPeriod.cpid": 1
            }

## 厂商

### 品类

品类信息管理

## api.communion.CategoryAction

**数据类型**:

#### category

    - **cid**: 品类ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 标准 , 1: 统计
      - 类型: *Short*
    - **isCoupon**: 券标识 , 0: 优惠 , 1: 标准
      - 类型: *Short*
    - **isCount**: 统计标识 , 0: 统计 , 1: 标准
    - **isCount**: Short
    - **kino**: 金蝶编号
      - 类型: *String*
    - **kiname**: 金蝶名称
      - 类型: *String*

        |Filters:|
        - **name**: 品类名称
      - 类型: *String*

    ### `pageCategory` <span style="color:gray">[内部]</span>

        分页方式获取品类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  品类信息列表 , 每条数据类型 *category*

        **示例**:{
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

    ### `queryCategory` <span style="color:gray">[内部]</span>

        获取所有品类信息

**返回参数**:

- **categorys**: 品类信息列表 , 每条数据类型 *category*
          - 类型: *List*

        **示例**:{
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

    ### `queryCategoryByCId` <span style="color:gray">[内部]</span>

        通过品类ID获取品类信息

**请求参数**:

- **category.cid**:
  品类ID

        **示例**:{
                "category.cid": 1
            }

**返回参数**:

- **category**: 品类信息 , 类型 *category*
          - 类型: *Object*

        **示例**:{
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

    ### `addCategory` <span style="color:blue">[自定义]</span>

        添加品类信息

        - **category.name**:
  品类名称
        - **category.kino**:
  金蝶编号
        :params category.kiname: 金蝶名称
          - 类型: `String`
        **示例**:{
                "category.name": "地板",
                "category.kino": "01",
                "category.kiname": "地板"
            }

    ### `updateCategory` <span style="color:blue">[自定义]</span>

        更新品类信息

        - **category.cid**:
  品类ID
        - **category.name**:
  品类名称
        - **category.type**:
  类型
        - **category.isCoupon**:
  券标识
        - **category.isCount**:
  统计标识
        - **category.kino**:
  金蝶编号
        :params category.kiname: 金蝶名称
          - 类型: `String`
        **示例**:{
                "category.cid": 1,
                "category.name": "地板",
                "category.type": 0,
                "category.isCoupon": 0,
                "category.isCount": 0,
                "category.kino": "01",
                "category.kiname": "地板"
            }

    ### `deleteCategoryByCIds` <span style="color:blue">[自定义]</span>

        通过品类ID批量删除品类信息

**请求参数**:

- **cids**: 品类ID列表 , 每条数据类型 Long
          - 类型: *cids*

        **示例**:{
                "cids[0]": 1,
                "cids[1]": 2
            }

### 品牌

品牌信息管理

## api.communion.BrandAction

**数据类型**:

#### brand

    - **bid**: 品牌ID
      - 类型: *Long*
    - **no**: 品牌编码
      - 类型: *String*
    - **name**: 品牌名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **category**: 品类 , 类型 [category](./data.html#api.data.CategoryAction.category)
      - 类型: *Object*
    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **atttype**: 业务类型 , 0: 内销 , 1: 外销
      - 类型: *Short*
    - **agentName**: 代理
      - 类型: *String*
    - **agentPhone**: 电话
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Long*

    - **kino**: 金蝶编号
      - 类型: *String*
    - **kiname**: 金蝶名称
      - 类型: *String*

        |Filters:|
        - **no**: 品类ID
      - 类型: *Long*
    - **name**: 品牌名称
      - 类型: *String*

    ### `pageBrand` <span style="color:gray">[内部]</span>

        分页方式获取品牌信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  品牌信息列表 , 每条数据类型 *brand*

        **示例**:{
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

    ### `queryBrand` <span style="color:gray">[内部]</span>

        获取所有品牌信息

**返回参数**:

- **brands**: 品牌信息列表 , 每条数据类型 *brand*
          - 类型: *List*

        **示例**:{
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

    ### `queryBrandByBid` <span style="color:gray">[内部]</span>

        通过品牌ID获取品牌信息

**请求参数**:

- **brand.bid**:
  品牌ID

        **示例**:{
                "brand.bid": 1
            }

**返回参数**:

- **brand**: 品牌信息 , 类型 *brand*
          - 类型: *object*

        **示例**:{
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

    ### `queryBrandByNo` <span style="color:gray">[内部]</span>

        通过品牌编号获取品牌信息

**请求参数**:

- **brand.no**:
  品牌编号

        **示例**:{
                "brand.no": "B001"
            }

**返回参数**:

- **brand**: 品牌信息 , 类型 *brand*
          - 类型: *object*

        **示例**:{
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

    ### `queryBrandByCid` <span style="color:gray">[内部]</span>

        通过品类ID获取品牌信息

**请求参数**:

- **brand.cid**:
  品类ID

        **示例**:{
                "brand.cid": 1
            }

**返回参数**:

- **brands**: 品牌信息列表 , 每条数据类型 *brand*
          - 类型: *List*

        **示例**:{
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

    ### `queryBrandByPinyin` <span style="color:gray">[内部]</span>

        通过品牌名拼音获取品牌编号和品牌名称信息 , 公司限制

**请求参数**:

- **brand.pinyin**:
  拼音
        - **brand.atttype**:
  业务类型

        **示例**:{
                "brand.pinyin": "pinpai",
                "brand.attype": 0
            }

**返回参数**:

- **autoFillKeyValue**: 键值列表 , 每条数据类型 *keyValue* , 键为品牌编号 , 值为品牌名
          - 类型: *List*
        - **autoFillList**: 品牌名列表 , 每条数据类型String
          - 类型: *List*

        **示例**:{
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

    ### `queryBrandByPinyinForAll` <span style="color:gray">[内部]</span>

        通过品牌名拼音获取品牌编号和品牌名称信息 , 无公司限制

**请求参数**:

- **brand.pinyin**:
  品牌名拼音
        - **brand.atttype**:
  业务类型

        **示例**:{
                "brand.pinyin": "pinpai",
                "brand.atttype": 0
            }

**返回参数**:

- **autoFillKeyValue**: 键值列表 , 每条数据类型 *keyValue* , 键为品牌编号 , 值为品牌名 - 品类名
          - 类型: *List*
        - **autoFillList**: 品牌名 - 品类名列表 , 每条数据类型String
          - 类型: *List*

        **示例**:{
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

    ### `addBrand` <span style="color:blue">[自定义]</span>

        添加品牌信息

**请求参数**:

- **brand.name**:
  品牌名称
        - **brand.cid**:
  品类ID
        - **brand.supplier.uid**:
  厂商ID
        - **brand.atttype**:
  业务类型
        - **agentName**: 代理
          - 类型: *String*
        - **agentPhone**: 代理电话
          - 类型: *String*
        - **brand.comment**:
  说明

        - **brand.kino**:
  金蝶编号
        - **brand.kiname**:
  金蝶名称

        **示例**:{
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

    ### `updateBrand` <span style="color:blue">[自定义]</span>

        更新品牌信息

**请求参数**:

- **brand.bid**:
  品牌ID
        - **brand.name**:
  品牌名称
        - **brand.cid**:
  品类ID
        - **brand.supplier.uid**:
  厂商ID
        - **brand.atttype**:
  业务类型
        - **agentName**: 代理
          - 类型: *String*
        - **agentPhone**: 代理电话
          - 类型: *String*
        - **brand.comment**:
  说明

        - **brand.kino**:
  金蝶编号
        - **brand.kiname**:
  金蝶名称

        **示例**:{
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

    ### `updateBrandForStatus` <span style="color:blue">[自定义]</span>

**请求参数**:

- **brand.bid**:
  品牌ID
        - **brand.status**:
  状态

        **示例**:{
                "brand.bid": 1,
                "brand.status": 0
            }

    ### `deleteBrand` <span style="color:blue">[自定义]</span>

        通过品牌ID批量删除品牌信息

**请求参数**:

- **brands[n].bid**:
  品牌ID列表, 每条数据类型 Long

        **示例**:{
                "brands[0].bid": 1,
                "brands[1].bid": 2,
            }

### 厂商

## api.data.BrandSupplierAction

**数据类型**:

#### brandSupplier

    - **buid**: 厂商ID
      - 类型: *Long*
    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **brand**: 品牌 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    ### `queryBrandSupplier` <span style="color:gray">[内部]</span>

        查询品牌厂商信息

**返回参数**:

- **brandSuppliers**: 品牌厂商信息列表 , 每条数据类型 *brandSupplier*
          - 类型: *List*

        **示例**:{
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

    ### `addBrandSupplier` <span style="color:gray">[内部]</span>

        添加品牌厂商信息

**请求参数**:

- **brandSupplier.supplier.uid**:
  厂商ID
        - **brandSupplier.brand.bid**:
  品牌ID

        **示例**:{
                "brandSupplier.supplier.uid": 1,
                "brandSupplier.brand.uid": 1
            }

    ### `deleteBrandSupplier` <span style="color:gray">[内部]</span>

        删除品牌厂商信息

**请求参数**:

- **brandSupplier.buid**:
  厂商ID

        **示例**:{
                "brandSupplier.buid": 1
            }

### 驻店

## api.data.BrandInstorerAction

**数据类型**:

#### brandInstorer

    - **biid**: 驻店ID
      - 类型: *Long*
    - **instorer**: 驻店 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.data.BrandAction.brand)
      - 类型: *Object*
    - **agentName**: 代理
      - 类型: *String*
    - **agentPhone**: 电话
      - 类型: *String*

    ### `queryBrandInstorer` <span style="color:gray">[内部]</span>

        查询品牌驻店信息

**返回参数**:

- **brandInstorers**: 品牌厂商信息列表 , 每条数据类型 *brandInstorer*
          - 类型: *List*

        **示例**:{
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

    ### `addBrandInstorer` <span style="color:gray">[内部]</span>

        添加品牌驻店信息

**请求参数**:

- **brandInstorer.instorer.uid**:
  厂商ID
        - **brandInstorer.brand.bid**:
  品牌ID
        - **brandInstorer.agentName**:
  代理
        - **brandInstorer.agentPhone**:
  电话

        **示例**:{
                "brandInstorer.instorer.uid": 1,
                "brandInstorer.brand.uid": 1,
                "brandInstorer.agentName": "",
                "brandInstorer.agentPhone": ""
            }

    ### `deleteBrandInstorer` <span style="color:gray">[内部]</span>

        删除品牌驻店信息

**请求参数**:

- **brandInstorer.buid**:
  厂商ID

        **示例**:{
                "brandInstorer.buid": 1
            }

### 结算

## api.data.BrandBalanceAction

**数据类型**:

#### brandBalance

    - **bbid**: 结算ID
      - 类型: *Long*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **ctype**: 类型 , 0: 底价 , 1: 点位
      - 类型: *Short*
    - **cvalue**: 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*

    ### `queryBrandBalance` <span style="color:gray">[内部]</span>

        获取品牌结算信息

**请求参数**:

- **brandBalance.bid**:
  品牌ID

        **示例**:{
                "brandBalance.bid": 1
            }

**返回参数**:

- **brandBalances**: 结算信息列表 , 每条数据类型 *brandBalance*
          - 类型: *List*

        **示例**:{
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

    ### `addBrandBalance` <span style="color:gray">[内部]</span>

        添加结算信息

**请求参数**:

- **brandBalance.bid**:
  品牌ID
        - **brandBalance.name**:
  名称
        - **brandBalance.ctype**:
  类型
        - **brandBalance.cvalue**:
  结算值
        - **brandBalance.comment**:
  说明

        **示例**:{
                "brandBalance.bid": 1,
                "brandBalance.name": "名称",
                "brandBalance.ctype": 0,
                "brandBalance.cvalue": 100000,
                "brandBalance..comment": "说明"
            }

    ### `deleteBrandBalance` <span style="color:gray">[内部]</span>

        删除结算信息

**请求参数**:

- **brandBalance.bbid**:
  结算ID

        **示例**:{
                "brandBalance.bbid": 1
            }

### 生产

## api.data.BrandProductAction

**数据类型**:

#### brandProduct

    - **bpid**: 生产ID
      - 类型: *Long*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **cnid**: 工程节点ID
      - 类型: *Long*
    - **workNum**: 工期
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    ### `queryBrandProduct` <span style="color:gray">[内部]</span>

    ### `addBrandProduct` <span style="color:gray">[内部]</span>

    ### `updateBrandProduct` <span style="color:gray">[内部]</span>

    ### `deleteBrandProduct` <span style="color:gray">[内部]</span>

### 回尺

## api.data.RemeasureFormatAction

**数据类型**:

#### remeasureTemplate

    - **rtid**: 模板ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **cid**: 品类ID
      - 类型: *Long*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **company**: 公司ID
      - 类型: *Integer*

    #### remeasureFormat

    - **rfid**: 指标ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.data.BrandAction.brand)
      - 类型: *Object*
    - **quotationItem**: 报价项 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **type**: 类型 , 0: 文本 , 1: 数值
      - 类型: *Short*
    - **value**: 数值
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryRemeasureFormatByBid` <span style="color:gray">[内部]</span>

    ### `queryRemeasureFormatByRfid` <span style="color:gray">[内部]</span>

    ### `addRemeasureFormat` <span style="color:gray">[内部]</span>

    ### `updateRemeasureFormat` <span style="color:gray">[内部]</span>

    ### `updateRemeasureFormatForStatus` <span style="color:gray">[内部]</span>

## 主材

### 型号

## api.data.MaterialModelAction

**数据类型**:

#### materialModel

    - **mmid**: 型号ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **category**: 品类名称
      - 类型: *String*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **brand**: 品牌名称
      - 类型: *String*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **purchasePrice**: 售价
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **calcType**: 计算方式 , 0: 底价 , 1: 点位
      - 类型: *Short*
    - **point**: 点位计算值
      - 类型: *Integer*
    - **base**: 底价计算值
      - 类型: *Integer*
    - **calcValue**: 计算值
      - 类型: *Integer*
    - **status**: 状态 , 0: 禁用 , 1: 启用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **category**: 品类ID
      - 类型: *Long*
    - **brand**: 品牌ID
      - 类型: *Long*
    - **no**: 型号编号
      - 类型: *String*
    - **name**: 型号名称
      - 类型: *String*

    ### `pageMaterialModel` <span style="color:gray">[内部]</span>

        分页方式获取型号信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

        查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  型号信息列表 , 每条数据类型 *materialModel*

        **示例**:{
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

    ### `pageMaterialModelForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取型号信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  型号信息列表 , 每条数据类型 *materialModel*

        **示例**:{
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

    ### `queryMaterialModel` <span style="color:gray">[内部]</span>

        获取所有型号信息

**返回参数**:

- **materialModels**: 型号信息列表 , 每条数据类型 *materialModel*
          - 类型: *List*

        **示例**:{
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

    ### `queryMaterialModelById` <span style="color:gray">[内部]</span>

        通过型号ID获取型号信息

**请求参数**:

- **materialModel.mmid**:
  型号ID

        **示例**:{
                "materialModel.mmid": 1
            }

**返回参数**:

- **materialModel**: 型号信息 , 类型 *materialModel*
          - 类型: *object*

        **示例**:{
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

    ### `queryMaterialModelByNo` <span style="color:gray">[内部]</span>

        通过型号编号获取型号信息

**请求参数**:

- **materialModel.no**:
  型号编号

        **示例**:{
                "materialModel.no": "PW0001"
            }

**返回参数**:

- **materialModel**: 型号信息 , 类型 *materialModel*
          - 类型: *object*

        **示例**:{
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

    ### `queryMaterialModelForAllByName` <span style="color:gray">[内部]</span>

        通过型号名称查询型号信息列表

**请求参数**:

- **materialModel.name**:
  型号名称

        **示例**:{
                "materialModel.name": "卫浴A12"
            }

**返回参数**:

- **materialModels**: 型号信息列表 , 每条数据类型 *materialModel*
          - 类型: *List*

        **示例**:{
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

    ### `queryMaterialModelForAllByNo` <span style="color:gray">[内部]</span>

        通过型号编号查询型号信息列表

**请求参数**:

- **materialModel.no**:
  型号编号

        **示例**:{
                "materialModel.no": "PW0001"
            }

**返回参数**:

- **materialModels**: 型号信息列表 , 每条数据类型 *materialModel*
          - 类型: *List*

        **示例**:{
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

    ### `addMaterialModel` <span style="color:gray">[内部]</span>

        添加型号信息

**请求参数**:

- **materialModel.no**:
  编号
        - **materialModel.name**:
  名称
        - **materialModel.bid**:
  品牌ID
        - **materialModel.measurementUnit**:
  单位
        - **materialModel.unitPrice**:
  单价
        - **materialModel.purchasePrice**:
  售价
        - **materialModel.discount**:
  折扣

        **示例**:{
                "materialModel.no": "PW0001",
                "materialModel.name": "卫浴A12208C",
                "materialModel.bid": 2,
                "materialModel.measurementUnit": "个",
                "materialModel.purchasePrice": 1,
                "materialModel.unitPrice": 100,
                "materialModel.discount": 1
            }

    ### `updateMaterialModel` <span style="color:gray">[内部]</span>

        更新型号信息

**请求参数**:

- **materialModel.mmid**:
  型号ID
        - **materialModel.no**:
  编号
        - **materialModel.name**:
  名称
        - **materialModel.bid**:
  品牌ID
        - **materialModel.measurementUnit**:
  单位
        - **materialModel.unitPrice**:
  单价
        - **materialModel.purchasePrice**:
  售价
        - **materialModel.discount**:
  折扣

        **示例**:{
                "materialModel.mmid": 1,
                "materialModel.no": "PW0001",
                "materialModel.name": "卫浴A12208C",
                "materialModel.bid": 2,
                "materialModel.measurementUnit": "个",
                "materialModel.purchasePrice": 1,
                "materialModel.unitPrice": 100,
                "materialModel.discount": 1
            }

    ### `updateMaterialModelForStatus` <span style="color:gray">[内部]</span>

        更新型号状态信息 , 控制型号启用禁用状态

**请求参数**:

- **materialModel.mmid**:
  型号ID
        - **materialModel.status**:
  状态 , 0: 禁用 , 1: 启用

        **示例**:{
                "materialModel.mmid": 1,
                "materialModel.status": 1
            }

    ### `updateMaterialModelForAdvance` <span style="color:gray">[内部]</span>

        更新型号高级信息 , 比如计算方式 , 点位 , 底价计算值

**请求参数**:

- **materialModel.mmid**:
  型号ID
        - **materialModel.calcType**:
  计算类型 , 0: 底价 , 1: 点位
        - **materialModel.base**:
  底价计算值
        - **materialModel.point**:
  点位计算值

        **示例**:{
                "materialModel.mmid": 1,
                "materialModel.calcType": 1,
                "materialModel.base": 10,
                "materialModel.point": 0.1
            }

    ### `deleteMaterialModelByIds` <span style="color:gray">[内部]</span>

        通过型号ID批量删除型号信息

**请求参数**:

- **dis**: 型号ID列表 , 每条数据类型 Long
          - 类型: *dis*

        **示例**:{
                "dis[0]": 1,
                "dis[1]": 2
            }

## 材料

### 类别

类别信息管理

## api.data.GoodsKindAction

**数据类型**:

#### goodsKind

    - **gkid**: 类别ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **level**: 等级 , 1/2/3
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageGoodsKind` <span style="color:gray">[内部]</span>

    ### `queryGoodsKind` <span style="color:gray">[内部]</span>

    ### `addGoodsKind` <span style="color:gray">[内部]</span>

    ### `updateGoodsKind` <span style="color:gray">[内部]</span>

    ### `updateGoodsKindForStauts` <span style="color:gray">[内部]</span>

### 辅类

## api.data.AccessoriesTypeAction

**数据类型**:

#### accessoriesType

    - **atid**: 辅类ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **workType**: 工种 , 类型 [workType](./data.html#api.data.WorkTypeAction.workType)
      - 类型: *Object*
    - **status**: 状态 , 包括: 0(禁用) , 1(启用)
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    ### `pageAccessoriesType` <span style="color:gray">[内部]</span>

        分页方式获取辅类信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  辅类信息列表 , 每条数据类型 *accessoriesType*

        **示例**:{
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

    ### `queryAccessoriesType` <span style="color:gray">[内部]</span>

        获取辅类信息

**返回参数**:

- **accessoriesTypes**: 辅类信息列表 , 每条数据类型 *accessoriesType*
          - 类型: *List*

        **示例**:{
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

    ### `queryAccessoriesTypeByWtid` <span style="color:gray">[内部]</span>

        通过工种ID获取对应的辅类信息

**请求参数**:

- **accessoriesType.workType.id**:
  工种ID

        **示例**:{
                "accessoriesType.workType.id": 1
            }

**返回参数**:

- **accessoriesTypes**: 辅类信息列表 , 每条数据类型 *accessoriesType*
          - 类型: *List*

        **示例**:{
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

    ### `addAccessoriesType` <span style="color:gray">[内部]</span>

        添加辅类信息

**请求参数**:

- **accessoriesType.name**:
  名称
        - **accessoriesType.comment**:
  说明
        - **accessoriesType.workType.id**:
  工种ID

        **示例**:{
                "accessoriesType.name": "墙面",
                "accessoriesType.comment": "",
                "accessoriesType.workType.id": 1
            }

    ### `updateAccessoriesType` <span style="color:gray">[内部]</span>

        更新辅类信息

        辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**

**请求参数**:

- **accessoriesType.atid**:
  辅类ID
        - **accessoriesType.name**:
  名称
        - **accessoriesType.comment**:
  说明
        - **accessoriesType.workType.id**:
  工种ID

        **示例**:{
                "accessoriesType.atid": 1,
                "accessoriesType.name": "墙面",
                "accessoriesType.comment": "",
                "accessoriesType.workType.id": 1
            }

    ### `updateAccessoriesTypeForStatus` <span style="color:gray">[内部]</span>

        更新辅类状态

        辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**

**请求参数**:

- **accessoriesType.atid**:
  辅类ID
        - **accessoriesType.status**:
  状态

        **示例**:{
                "accessoriesType.atid": 1,
                "accessoriesType.status": 0
            }

### 商品

## api.data.GoodsAction

**数据类型**:

#### goods

    - **gid**: 商品ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 商品名
      - 类型: *String*
    - **alias**: 别名
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **barcode**: 条形码
      - 类型: *String*
    - **category**: 品类
      - 类型: *String*
    - **onekind**: 一类 , 类型 [goodsKind](./data.html#api.data.GoodsKindAction.goodsKind)
      - 类型: *Object*
    - **twokind**: 二类 , 类型 [goodsKind](./data.html#api.data.GoodsKindAction.goodsKind)
      - 类型: *Object*
    - **thrkind**: 三类 , 类型 [goodsKind](./data.html#api.data.GoodsKindAction.goodsKind)
      - 类型: *Object*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **brand**: 品牌
      - 类型: *String*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **path**: 图片
      - 类型: *String*
    - **purchase**: 进价
      - 类型: *Integer*
    - **selling**: 售价
      - 类型: *Integer*
    - **pieceNum**: 件数
      - 类型: *Integer*
    - **type**: 类型 , 0: 商品 , 1: 套餐
      - 类型: *Short*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **isShow**: 是否出样 , 0: 已出 , 1: 未出
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Long*

    #### goodsPackage

    - **gpid**: 套餐ID
      - 类型: *Long*
    - **pid**: 套餐商品ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 *goods*
      - 类型: *Object*
    - **color**: 商品颜色 , 类型 [color](./data.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 商品规格 , 类型 [format](./data.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Integer*

        |Filters:|
        - **name**: 大区名称
      - 类型: *String*
    - **category**: 大区名称
      - 类型: *String*
    - **brand**: 大区名称
      - 类型: *String*

    ### `pageGoods` <span style="color:gray">[内部]</span>

        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  商品信息列表 , 每条数据类型 *goods*

        **示例**:{
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

    ### `pageGoodsForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取商品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  商品信息列表 , 每条数据类型 *goods*

        **示例**:{
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

    ### `queryGoods` <span style="color:gray">[内部]</span>

        获取商品信息

**返回参数**:

- **goodes**: 商品信息列表 , 每条数据类型 *goods*
          - 类型: *List*

        **示例**:{
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

    ### `queryGoodsByAtid` <span style="color:gray">[内部]</span>

        通过辅类ID获取商品信息

**请求参数**:

- **goods.accessoriesType.atid**:
  辅类ID

        **示例**:{
                "goods.accessoriesType.atid": 1
            }

**返回参数**:

- **goodes**: 商品信息列表 , 每条数据类型 *goods*
          - 类型: *List*

        **示例**:{
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

    ### `queryGoodsByNo` <span style="color:gray">[内部]</span>

        通过编号获取商品信息

**请求参数**:

- **goods.no**:
  商品编号

        **示例**:{
                "goods.no": "JGIDNEHDUIN5SD"
            }

**返回参数**:

- **goodes**: 商品信息列表 , 每条数据类型 *goods*
          - 类型: *List*

        **示例**:{
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

    ### `queryGoodsByName` <span style="color:gray">[内部]</span>

        通过名称或拼音获取商品信息

**请求参数**:

- **goods.name**:
  商品名称

        **示例**:{
                "goods.name": "瓷砖"
            }

**返回参数**:

- **goodes**: 商品信息列表 , 每条数据类型 *goods*
          - 类型: *List*

        **示例**:{
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

    ### `queryGoodsByBarcode` <span style="color:gray">[内部]</span>

        通过条型号获取商品信息

**请求参数**:

- **goods.barcode**:
  条形码

        **示例**:{
                "goods.barcode": "254125212521251"
            }

**返回参数**:

- **goods**: 商品信息 , 类型 *goods*
          - 类型: *object*

        **示例**:{
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

    ### `queryGoodsByGId` <span style="color:gray">[内部]</span>

        通过商品ID获取商品信息

**请求参数**:

- **goods.gid**:
  商品ID

        **示例**:{
                "goods.gid": 2
            }

**返回参数**:

- **goods**: 商品信息 , 类型 *goods*
          - 类型: *object*

        **示例**:{
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

    ### `queryPackage` <span style="color:gray">[内部]</span>

        获取套餐信息

**请求参数**:

- **goodsPackage.pid**:
  商品ID

        **示例**:{
                "goodsPackage.pid": 1
            }

**返回参数**:

- **goodsPackages**: 商品信息列表 , 每条数据类型 *goodsPackages*
          - 类型: *List*

        **示例**:{
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

    ### `addGoods` <span style="color:gray">[内部]</span>

        添加商品

        通过商品名称判断状态为0(启用)的商品是否存在 , 错误信息 **260046 商品已存在**

**请求参数**:

- **goods.no**:
  商品编号
        - **goods.name**:
  名称
        - **goods.alias**:
  别名
        - **goods.barcode**:
  条形码
        - **goods.category**:
  品类
        - **goods.brand**:
  品牌
        - **goods.measurementUnit**:
  单位
        - **goods.purchase**:
  进价
        - **goods.selling**:
  售价
        - **goods.pieceNum**:
  件数

        **示例**:{
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

    ### `addPackage` <span style="color:gray">[内部]</span>

        添加套餐

        绑定商品到指定商品 , 被绑定商品形成套餐商品

        被绑商品信息不存在 , 添加失败 , 错误信息 **260004 商品不存在**

        被绑商品不能为套餐 , 添加失败 , 错误信息 **260043 套餐归属商品不可为套餐**

        套餐与绑定商品的品牌需要爱一致 , 不一致添加失败 , 错误信息 **260044 品牌不一致**

        更新被绑商品类型为1(套餐)

**请求参数**:

- **goods.no**:
  商品编号
        - **goods.name**:
  名称
        - **goods.alias**:
  别名
        - **goods.barcode**:
  条形码
        - **goods.category**:
  品类
        - **goods.brand**:
  品牌
        - **goods.measurementUnit**:
  单位
        - **goods.purchase**:
  进价
        - **goods.selling**:
  售价
        - **goods.pieceNum**:
  件数
        - **goodsPackage[n].pid**:
  被绑商品ID
        - **goodsPackage[n].goods.gid**:
  商品ID
        - **goodsPackage[n].color.cid**:
  颜色ID
        - **goodsPackage[n].format.fid**:
  规格ID
        - **goodsPackage[n].num**:
  数量

        **示例**:{
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

    ### `updateGoods` <span style="color:gray">[内部]</span>

        更新商品

        可更新的字段信息包括进价和售价

        商品是否存在 , 不存在 , 错误信息 **260004 商品不存在**

**请求参数**:

- **goods.gid**:
  商品ID
        - **goods.path**:
  图片路径
        - **goods.purchase**:
  进价
        - **goods.selling**:
  售价

        **示例**:{
                "goods.gid": 1,
                "goods.path": "",
                "goods.purchase": 1000,
                "goods.selling": 100000
            }

    ### `updateGoodsForStatus` <span style="color:gray">[内部]</span>

        更新商品状态

        商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**

**请求参数**:

- **goods.gid**:
  商品ID
        - **goods.status**:
  状态

        **示例**:{
                "goods.gid": 1,
                "goods.status": 0
            }

    ### `showGoods` <span style="color:gray">[内部]</span>

        出样商品

        商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**

**请求参数**:

- **goods.gid**:
  商品ID
        - **goods.isShow**:
  是否出样

        **示例**:{
                "goods.gid": 1,
                "goods.isShow": 0
            }

### 辅材

## api.data.AoodsAction

**数据类型**:

#### aoods

    - **aid**: 辅材ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **type**: 辅类 , 类型 [accessoriesType](./data.html#api.data.AccessoriesTypeAction.accessoriesType)
      - 类型: *Object*
    - **noods**: 商品 , 类型 [noods](./data.html#api.data.NoodsAction.noods)
      - 类型: *Object*
    - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*
    - **atttype**: 业务类型 , 0: 标准 , 1: 外辅
      - 类型: *Short*
    - **balance**: 结算价
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    - **bompany**: 归属公司
      - 类型: *Integer*

    ### `pageAoods` <span style="color:gray">[内部]</span>

        分页方式获取辅材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        查询过程根据当前操作公司查询辅材公司或归属公司作为条件

**请求参数**:

- **companyType**: 公司类型
          - 类型: *String*

        **示例**:{
                "companyType": "company"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  辅材信息列表 , 每条数据类型 *aoods*

        **示例**:{
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
    ### `queryAoods` <span style="color:gray">[内部]</span>

        获取辅材信息

**请求参数**:

- **aoods.type.atid**:
  辅类ID
        - **aoods.atttype**:
  业务类型

        **示例**:{
                "aoods.type.atid": 2,
                "aoods.atttype": 0
            }

**返回参数**:

- **aoodes**: 辅材信息 , 类型 *aoods*
          - 类型: *object*

        **示例**:{
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

    ### `queryAoodsByAtid` <span style="color:gray">[内部]</span>

        通过辅类ID获取辅材信息

**请求参数**:

- **aoods.type.atid**:
  辅类ID
        - **aoods.atttype**:
  业务类型

        **示例**:{
                "aoods.type.atid": 2,
                "aoods.atttype": 0
            }

**返回参数**:

- **aoodes**: 辅材信息 , 类型 *aoods*
          - 类型: *object*

        **示例**:{
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

    ### `queryAoodsByName` <span style="color:gray">[内部]</span>

        通过商品名称获取辅材信息

**请求参数**:

- **aoods.goods.name**:
  商品名

        **示例**:{
                "aoods.goods.name": "名称"
            }

**返回参数**:

- **aoodes**: 辅材信息 , 类型 *aoods*
          - 类型: *object*

        **示例**:{
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

    ### `addAoods` <span style="color:gray">[内部]</span>

        添加辅材

**请求参数**:

- **aoods.name**:
  名称
        - **aoods.goods.gid**:
  商品ID
        - **aoods.noods.nid**:
  定材ID
        - **aoods.constructionNode.cnid**:
  施工节点ID

        - **aoods.type.atid**:
  辅类ID
        - **aoods.atttype**:
  业务类型
        - **aoods.balance**:
  结算价
        - **aoods.bompany**:
  归属公司

        **示例**:{
                "aoods.name": "名称",
                "aoods.goods.gid": 1,
                "aoods.noods.nid": 1,
                "aoods.constructionNode.cnid": 1,

                "aoods.type.atid": 1,
                "aoods.atttype": 0,
                "aoods.balance": 0,
                "aoods.bompany": 1
            }

    ### `updateAoods` <span style="color:gray">[内部]</span>

        更新辅材信息

        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

**请求参数**:

- **aoods.aid**:
  商品ID

        - **aoods.name**:
  名称
        - **aoods.noods.nid**:
  定材ID
        - **aoods.constructionNode.cnid**:
  施工节点ID
        - **aoods.type.atid**:
  辅类ID
        - **aoods.atttype**:
  业务类型
        - **aoods.balance**:
  结算价
        - **aoods.bompany**:
  归属公司

        **示例**:{
                "aoods.aid": 1,

                "aoods.name": "名称",
                "aoods.normood.ngid": 1,
                "aoods.constructionNode.cnid": 1,

                "aoods.type.atid": 1,
                "aoods.atttype": 0,
                "aoods.balance": 0
            }

    ### `updateAoodsForNorm` <span style="color:gray">[内部]</span>

        更新辅材关联定额信息

        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

**请求参数**:

- **aoods.aid**:
  商品ID

        - **aoods.noods.nid**:
  定材ID

        **示例**:{
                "aoods.aid": 1,

                "aoods.noods.nid": 1
            }

    ### `updateAoodsForStatus` <span style="color:gray">[内部]</span>

        更新辅材状态

        判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

        更新关联商品状态

**请求参数**:

- **aoods.aid**:
  辅材ID
        - **aoods.status**:
  状态

        **示例**:{
                "aoods.aid": 1,
                "aoods.status": 0
            }

    ### `copyAoods` <span style="color:gray">[内部]</span>

        拷贝辅材

**请求参数**:

- **aoods.bompany**:
  拷贝公司

        **示例**:{
                "aoods.bompany": "AD2FOENN1SJILJ12I3JSODLJ3O"
            }

### 选材

## api.data.SoodsAction

**数据类型**:

#### soods

    - **sid**: 选材ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **format**: 规格
      - 类型: *String*
    - **num**: 数量
      - 类型: *Integer*
    - **selling**: 售价
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **balance**: 结算价
      - 类型: *Integer*
    - **path**: 图片
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageSoods` <span style="color:gray">[内部]</span>

        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  选材信息列表 , 每条数据类型 *soods*

        **示例**:{
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

    ### `querySoods` <span style="color:gray">[内部]</span>

        通过选材ID查询选材信息

**请求参数**:

- **soods.sid**:
  选材ID

        **示例**:{
                "soods.sid": 1
            }

**返回参数**:

- **soodes**: 选材信息列表 , 每条数据类型 *soods*
          - 类型: *List*

        **示例**:{
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

    ### `querySoodsByName` <span style="color:gray">[内部]</span>

        通过商品名称查询选材

**请求参数**:

- **soods.goods.name**:
  商品名

        **示例**:{
                "soods.goods.name": "商品名"
            }

**返回参数**:

- **soodes**: 选材信息列表 , 每条数据类型 *soods*
          - 类型: *List*

        **示例**:{
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

    ### `addSoods` <span style="color:gray">[内部]</span>

        添加选材

**请求参数**:

- **soods.name**:
  名称
        - **soods.goods.gid**:
  商品ID
        - **soods.format**:
  售价
        - **soods.selling**:
  售价
        - **soods.cost**:
  成本
        - **soods.balance**:
  结算价
        - **soods.num**:
  数量

        **示例**:{
                "soods.name": "选材",
                "soods.goods.gid": 1,
                "soods.format": "",
                "soods.selling": 1000,
                "soods.cost": 1000,
                "soods.balance": 1000,
                "soods.num": 1
            }

    ### `copySoods` <span style="color:gray">[内部]</span>

        复制选材

**请求参数**:

- **soods.qiid**:
  报价项ID
        - **soods.quotationItem.qiid**:
  报价项ID

        **示例**:{
                "soods.qiid": 1,
                "soods.quotationItem.qiid": 1
            }

    ### `updateSoods` <span style="color:gray">[内部]</span>

        更新选材项

        选材项更新内容包括结算价

        判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**

**请求参数**:

- **soods.sid**:
  选材项ID
        - **soods.name**:
  名称
        - **soods.format**:
  规格
        - **soods.selling**:
  结算价
        - **soods.cost**:
  结算价
        - **soods.balance**:
  结算价
        - **soods.path**:
  路径

        **示例**:{
                "soods.sid": 1,
                "soods.name": "选材",
                "soods.format": "规格",
                "soods.selling": 10000,
                "soods.cost": 10000,
                "soods.balance": 10000,
                "soods.path": ""
            }

    ### `updateSoodsForStatus` <span style="color:gray">[内部]</span>

        更新选材项状态

        判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**

**请求参数**:

- **soodes[n].sid**:
  选材项ID
        - **soodes[n].status**:
  状态

        **示例**:{
                "soodes[0].sid": 1,
                "soodes[0].status": 10000,
            }

    ### `deleteSoods` <span style="color:gray">[内部]</span>

        删除选材

**请求参数**:

- **soods.sid**:
  选材ID

        **示例**:{
                "soods.sid": 1
            }

    #### soodsItem

    - **siid**: 选材项ID
      - 类型: *Long*
    - **soods**: 选材 , 类型 [soods](./data.html#api.data.SoodsAction.soods)
      - 类型: *Object*
    - **quotationItem**: 报价项 , 类型 [quotationItem](./data.html#api.data.QuotationItemAction.quotationItem)
      - 类型: *Object*

    ### `pageSoodsItemByQiid` <span style="color:gray">[内部]</span>

        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        默认条件为选材归属的报价项ID

**请求参数**:

- **soodsItem.quotationItem.qiid**:
  报价项ID

        **示例**:{
                "soodsItem.quotationItem.qiid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  选材信息列表 , 每条数据类型 *soodsItem*

        **示例**:{
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

    ### `pageSoodsItemBySid` <span style="color:gray">[内部]</span>

        分页方式获取选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        默认条件为选材ID

**请求参数**:

- **soodsItem.sid**:
  选材ID

        **示例**:{
                "soodsItem.sid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  选材信息列表 , 每条数据类型 *soodsItem*

        **示例**:{
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

    ### `querySoodsItemByQiid` <span style="color:gray">[内部]</span>

        通过报价项ID获取选材信息

**请求参数**:

- **soodsItem.quotationItem.qiid**:
  报价项ID

        **示例**:{
                "soodsItem.quotationItem.qiid": 1
            }

**返回参数**:

- **soodsItems**: 选材信息列表 , 每条数据类型 *soodsItem*
          - 类型: *List*

        **示例**:{
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

    ### `querySoodsItemBySid` <span style="color:gray">[内部]</span>

        通过选材ID获取选材信息

**请求参数**:

- **soodsItem.sid**:
  报价项ID

**返回参数**:

- **soodsItems**: 选材信息列表 , 每条数据类型 *soodsItem*
          - 类型: *List*

        **示例**:{
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

    ### `addSoodsItem` <span style="color:gray">[内部]</span>

        添加选材项

**请求参数**:

- **soodsItem.sid**:
  选材ID
        - **soodsItem.quotationItem.qiid**:
  报价项ID

        **示例**:{
                "soodsItem.sid": 1,
                "soodsItem.quotationItem.qiid": 1
            }

    ### `deleteSoodsItem` <span style="color:gray">[内部]</span>

        删除选材项

**请求参数**:

- **soodsItem.siid**:
  选材项ID

        **示例**:{
                "soodsItem.siid": 1
            }

### 定材

## api.data.NoodsAction

**数据类型**:

#### noods

    - **nid**: 选材ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **selling**: 售价
      - 类型: *Integer*
    - **balance**: 结算价
      - 类型: *Integer*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageNoods` <span style="color:gray">[内部]</span>

        分页方式获取定材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  定材信息列表 , 每条数据类型 *noods*

        **示例**:{
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

    ### `queryNoods` <span style="color:gray">[内部]</span>

        通过定材ID查询定材信息

**请求参数**:

- **noods.sid**:
  定材ID

        **示例**:{
                "noods.sid": 1
            }

**返回参数**:

- **soodes**: 定材信息列表 , 每条数据类型 *noods*
          - 类型: *List*

        **示例**:{
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

    ### `queryNoodsByName` <span style="color:gray">[内部]</span>

        通过商品名称查询定材

**请求参数**:

- **noods.name**:
  名称

        **示例**:{
                "noods.name": "名称"
            }

**返回参数**:

- **soodes**: 定材信息列表 , 每条数据类型 *noods*
          - 类型: *List*

        **示例**:{
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

    ### `addNoods` <span style="color:gray">[内部]</span>

        添加定材

**请求参数**:

- **noods.name**:
  名称
        - **noods.selling**:
  售价
        - **noods.balance**:
  结算价

        **示例**:{
                "noods.name": 1,
                "noods.selling": 1000,
                "noods.balance": 1000
            }

    ### `updateNoods` <span style="color:gray">[内部]</span>

        更新定材

        判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**

**请求参数**:

- **noods.nid**:
  定材项ID
        - **noods.name**:
  名称
        - **noods.selling**:
  售价
        - **noods.balance**:
  结算价

        **示例**:{
                "noods.nid": 1,
                "noods.name": 1,
                "noods.selling": 1000,
                "noods.balance": 1000
            }

    ### `updateNoodsForStatus` <span style="color:gray">[内部]</span>

        更新定材项状态

        判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**

**请求参数**:

- **noods.sid**:
  定材项ID
        - **noods.status**:
  状态

        **示例**:{
                "noods.sid": 1,
                "noods.status": 10000,
            }

### 颜色

颜色信息管理 , 商品属性之一

## api.data.ColorAction

**数据类型**:

#### color

    - **cid**: 颜色ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageColor` <span style="color:gray">[内部]</span>

        分页方式获取颜色信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  颜色信息列表 , 每条数据类型 *color*

        **示例**:{
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

    ### `queryColorByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取对应的颜色信息

**请求参数**:

- **color.gid**:
  商品ID

        **示例**:{
                "color.gid": 1
            }

**返回参数**:

- **colors**: 颜色信息列表 , 每条数据类型 *color*
          - 类型: *List*

        **示例**:{
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

    ### `queryColorForEnableByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取对应的颜色信息 , 状态为启用

**请求参数**:

- **color.gid**:
  商品ID

        **示例**:{
                "color.gid": 1
            }

**返回参数**:

- **colors**: 颜色信息列表 , 每条数据类型 *color*
          - 类型: *List*

        **示例**:{
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

    ### `addColor` <span style="color:gray">[内部]</span>

        添加商品颜色信息

**请求参数**:

- **color.gid**:
  商品ID
        - **color.name**:
  颜色名

        **示例**:{
                "color.gid": 1,
                "color.name": "白色"
            }

    ### `updateColorForStatus` <span style="color:gray">[内部]</span>

        更新颜色状态

        颜色信息不存在 , 更新失败 , 错误信息 **260014 颜色不存在**

**请求参数**:

- **color.cid**:
  颜色ID
        - **color.status**:
  状态 , 0: 启用 , 1: 禁用

        **示例**:{
                "color.cid": 1,
                "color.status":1
            }

### 规格

规格信息管理 , 商品属性之一

## api.inventory.FormatAction

**数据类型**:

#### format

    - **fid**: 规格ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **info**: 规格信息
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pageFormat` <span style="color:gray">[内部]</span>

        分页方式获取规格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  规格信息列表 , 每条数据类型 *format*

        **示例**:{
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

    ### `queryFormatByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取对应的规格信息

**请求参数**:

- **format.gid**:
  商品ID

        **示例**:{
                "format.gid": 1
            }

**返回参数**:

- **formats**: 颜色信息列表 , 每条数据类型 *format*
          - 类型: *List*

        **示例**:{
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

    ### `queryFormatForEnableByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取对应的规格信息 , 状态为启用

**请求参数**:

- **format.gid**:
  商品ID

        **示例**:{
                "format.gid": 1
            }

**返回参数**:

- **formats**: 规格信息列表 , 每条数据类型 *format*
          - 类型: *List*

        **示例**:{
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

    ### `addFormat` <span style="color:gray">[内部]</span>

        添加商品规格信息

**请求参数**:

- **format.gid**:
  商品ID
        - **format.info**:
  规格信息

        **示例**:{
                "format.gid": 1,
                "format.info": "300*300"
            }

    ### `updateFormatForStatus` <span style="color:gray">[内部]</span>

        更新规格状态

        规格信息不存在 , 更新失败 , 错误信息 **260015 规格不存在**

**请求参数**:

- **format.fid**:
  规格ID
        - **format.status**:
  状态 , 0: 启用 , 1: 禁用

        **示例**:{
                "format.fid": 1,
                "format.status":1
            }

### 价格

价格信息管理 , 商品属性之一

## api.inventory.PriceAction

**数据类型**:

#### price

    - **pid**: 价格ID
      - 类型: *Long*
    - **gid**: 商品ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 正价 , 1: 特价
      - 类型: *Short*
    - **purchase**: 进价
      - 类型: *Integer*
    - **selling**: 售价
      - 类型: *Integer*
    - **ctype**: 结算类型 , 0: 底价 , 1: 点位
      - 类型: *Short*
    - **cvalue**: 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

    ### `pagePrice` <span style="color:gray">[内部]</span>

        分页方式获取价格信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  价格信息列表 , 每条数据类型 *price*

        **示例**:{
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

    ### `queryPriceByGid` <span style="color:gray">[内部]</span>

        通过商品ID获取对应价格信息

**请求参数**:

- **price.gid**:
  商品ID
        - **price.status**:
  状态

        **示例**:{
                "price.gid": 1,
                "price.status": 0
            }

**返回参数**:

- **prices**: 价格信息列表 , 每条数据类型 *price*
          - 类型: *List*

        **示例**:{
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

    ### `queryPriceByPid` <span style="color:gray">[内部]</span>

        通过ID获取对应价格信息

**请求参数**:

- **price.pid**:
  价格ID

        **示例**:{
                "price.pid": 1
            }

**返回参数**:

- **price**: 价格信息 , 类型 *price*
          - 类型: *Object*

        **示例**:{
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

    ### `addPrice` <span style="color:gray">[内部]</span>

        添加商品价格信息

**请求参数**:

- **price.gid**:
  商品ID
        - **price.name**:
  名称
        - **price.purchase**:
  进价
        - **price.selling**:
  售价
        - **price.ctype**:
  结算类型
        - **price.cvalue**:
  结算值

        **示例**:{
                "price.gid": 1,
                "price.name": "价格说明",
                "price.purchase": 100000,
                "price.selling": 150000,
                "price.ctype": 0,
                "price.cvalue": 90
            }

    ### `updatePriceForStatus` <span style="color:gray">[内部]</span>

        更新价格状态

**请求参数**:

- **price.pid**:
  价格ID
        - **price.status**:
  状态

        **示例**:{
                "price.pid": 1,
                "price.status": 0
            }

    ### `deletePrice` <span style="color:gray">[内部]</span>

        删除商品价格信息

        价格信息不存在 , 更新失败 , 错误信息 **260016 价格不存在**

**请求参数**:

- **price.pid**:
  价格ID

        **示例**:{
                "price.pid": 1
            }

### 记录

## api.data.GoodsRecordAction

**数据类型**:

#### goodsRecord

    - **grid**: 记录ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **sid**: 关联ID
      - 类型: *Long*
    - **type**: 类型 , 0: 商品, 1: 选材 , 2: 辅材
      - 类型: *Short*
    - **operator**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*

    .. pageGoodsRecord

## 仓储

### 仓库

## api.inventory.StorehouseAction

**数据类型**:

#### storehouse

    - **shid**: 仓库ID
      - 类型: *Long*
    - **code**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *String*

    ### `pageStorehouse` <span style="color:gray">[内部]</span>

        分页方式获取仓库信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  仓库信息列表 , 每条数据类型 *storehouse*

        **示例**:{
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

    ### `queryStorehouse` <span style="color:gray">[内部]</span>

        获取全部仓库信息

**返回参数**:

- **storehouses**: 仓库信息列表 , 每条数据类型 *storehouse*
          - 类型: *List*

        **示例**:{
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

    ### `queryStorehouseForSelf` <span style="color:gray">[内部]</span>

        获取当前登陆用户有权操作仓库信息

**返回参数**:

- **storehouses**: 仓库信息列表 , 每条数据类型 *storehouse*
          - 类型: *List*

        **示例**:{
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

    ### `addStorehouse` <span style="color:gray">[内部]</span>

        添加仓库信息

        仓库编号已经存在 , 添加失败 , 错误信息: **260012 仓库编号已存在**

**请求参数**:

- **storehouse.code**:
  编号
        - **storehouse.name**:
  名称

        **示例**:{
                "storehouse.code": "SDJ4SDF5",
                "storehouse.name": "仓库",
            }

    ### `updateStorehouseForStatus` <span style="color:gray">[内部]</span>

        更新仓库状态

        通过仓库ID获取的仓库信息不存在 , 更新失败 , 错误信息 **260005 仓库不存在**

**请求参数**:

- **storehouse.shid**:
  仓库ID
        - **storehouse.status**:
  状态

        **示例**:{
                "storehouse.shid": 1,
                "storehouse.status": 0,
            }

### 仓库权限

## api.inventory.StorehouseUserAction

    仓库权限信息管理 , 主要维护人员与仓库间的关联关系

**数据类型**:

#### storehouseUser

    - **shuid**: 仓库权限ID
      - 类型: *Long*
    - **user**: 用户 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *String*
    - **storehouse**: 仓库 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *String*

    ### `queryStorehouseUserByUserId` <span style="color:gray">[内部]</span>

        获取指定人员的仓库权限信息

**请求参数**:

- **user.userId**:
  员工编号

        **示例**:{
                "user.userId": "U001"
            }

**返回参数**:

- **storehouseUsers**: 权限信息列表 , 每条数据类型 *storehouseUser*
          - 类型: *Object*

        **示例**:{
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

    ### `updateStorehouseUser` <span style="color:gray">[内部]</span>

        更新仓库人员权限信息

**请求参数**:

- **user.userId**:
  员工编号
        - **shIds[n]**:
  仓库ID列表 , 每条数据类型: Long

        **示例**:{
                "user.userId": "U001",
                "shIds[0]": 1
            }

### 商品模版

商品模版信息管理

## api.inventory.ManifestTemplateAction

**数据类型**:

#### manifestTemplate

    - **mtid**: 商品模版ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Long*

    #### manifestTemplateItem

    - **mtiid**: 商品模版项ID
      - 类型: *Long*
    - **manifestTemplate**: 模版 , 类型 *manifestTemplate*
      - 类型: *Object*
    - **goods**: 商品 , 类型 [goods](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*

    ### `pageManifestTemplate` <span style="color:gray">[内部]</span>

        分页方式获取商品模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  商品模版信息列表 , 每条数据类型 *manifestTemplate*

        **示例**:{
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

    ### `queryManifestTemplate` <span style="color:gray">[内部]</span>

        获取全部商品模版

**返回参数**:

- **manifestTemplates**: 商品模版信息列表 , 每条数据类型 *manifestTemplate*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestTemplateItemByMtid` <span style="color:gray">[内部]</span>

        通过商品模版ID获取商品模版项信息

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID

        **示例**:{
                "manifestTemplate.mtid": 1
            }

**返回参数**:

- **manifestTemplates**: 商品模版信息列表 , 每条数据类型 *manifestTemplate*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestItemByMtid` <span style="color:gray">[内部]</span>

        通过商品模版ID获取上包含的商品信息

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID

        **示例**:{
                "manifestTemplate.mtid": 1
            }

**返回参数**:

- **manifestItems**: 商品信息列表 , 每条数据类型 *manifestItem*
          - 类型: *List*

        **示例**:{
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

    ### `queryManifestItemBySiids` <span style="color:gray">[内部]</span>

        通过销售项列表获取对应的货单项信息

**请求参数**:

- **siids[n]**:
  销售项ID列表 , 每条数据类型 Long

        **示例**:{
                "siids[0]": 1
            }

**返回参数**:

- **manifestItems**: 商品信息列表 , 每条数据类型 *manifestItem*
          - 类型: *List*

        **示例**:{
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

    ### `addManifestTemplate` <span style="color:gray">[内部]</span>

        添加商品模版

**请求参数**:

- **manifestTemplate.name**:
  模版名
        - **manifestTemplate.comment**:
  说明

        **示例**:{
                "manifestTemplate.name": "模版",
                "manifestTemplate.comment": ""
            }

    ### `addManifestTemplateItem` <span style="color:gray">[内部]</span>

        添加商品模版项

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID
        - **miIds[n]**:
  商品ID列表 , 每条数据类型 Long

        **示例**:{
                "manifestTemplate.mtid": 1,
                "miIds[0]": 1
            }

    ### `updateManifestTemplate` <span style="color:gray">[内部]</span>

        更新商品模版

        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID
        - **manifestTemplate.name**:
  模版名
        - **manifestTemplate.comment**:
  说明

        **示例**:{
                "manifestTemplate.mtid": 1,
                "manifestTemplate.name": "模版",
                "manifestTemplate.comment": ""
            }

    ### `updateManifestTemplateForStatus` <span style="color:gray">[内部]</span>

        更新商品模版状态

        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID
        - **manifestTemplate.status**:
  状态

        **示例**:{
                "manifestTemplate.mtid": 1,
                "manifestTemplate.status": 0
            }

    ### `deleteManifestTemplate` <span style="color:gray">[内部]</span>

        删除商品模版

        商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID

        **示例**:{
                "manifestTemplate.mtid": 1
            }

    ### `deleteManifestTemplateItem` <span style="color:gray">[内部]</span>

        删除商品模版项

**请求参数**:

- **manifestTemplate.mtid**:
  商品模版ID
        - **mtiIds[n]**:
  商品ID列表 , 每条数据类型 Long

        **示例**:{
                "manifestTemplate.mtid": 1,
                "mtiIds[0]": 1
            }

## 合同

### 模版

## api.communion.ContractAction

**数据类型**:

#### contract

    - **cid**: 模版ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **title**: 标题
      - 类型: *String*
    - **page**: 页面
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **videopath**: 视频路径
      - 类型: *String*
    - **atttype**: 业务类型 , 0: 装修 , 1: 人员
      - 类型: *Short*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageContract` <span style="color:gray">[内部]</span>

        分页方式获取合同模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  合同模版列表 , 每条数据类型 *contract*

        **示例**:{
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

    ### `queryContract` <span style="color:gray">[内部]</span>

        查询合同信息 , 状态为0(启用)

**请求参数**:

- **contract.atttype**:
  业务类型

        **示例**:{
                "contract.atttype": 0
            }

**返回参数**:

- **constracts**: 合同模版列表 , 每条数据类型 *contract*
          - 类型: *List*

        **示例**:{
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

    ### `countContract` <span style="color:gray">[内部]</span>

        统计合同

**返回参数**:

- **count**: 总数
          - 类型: *Integer*

        **示例**:{
                ...
                "count": 0
                ...
            }

    ### `addContract` <span style="color:gray">[内部]</span>

        添加合同

        判断合同编号是否存在 , 已经存在 , 错误信息 **130043 合同模版已存在**

**请求参数**:

- **contract.no**:
  编号
        - **contract.name**:
  名称
        - **contract.title**:
  标题
        - **contract.page**:
  页面
        - **contract.path**:
  文件路径
        - **contract.videopath**:
  文件路径
        - **contract.atttype**:
  业务类型

        **示例**:{
                "contract.no": "74HENIDH121H",
                "contract.name": "合同模版",
                "contract.title": "合同标题",
                "contract.page": "contract.html",
                "contract.path": "/ASDLFKJDSJFSADFLKJ",
                "contract.videopath": "/ASDLFKJDSJFSADFLKJ",
                "contract.atttype": 0
            }

    ### `updateContract` <span style="color:gray">[内部]</span>

        更新合同

        判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

**请求参数**:

- **contract.cid**:
  模版ID

        **示例**:{
                "contract.cid": 1
            }

    ### `updateContractForStatus` <span style="color:gray">[内部]</span>

        更新合同状态

        判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

**请求参数**:

- **contract.cid**:
  模版ID
        - **contract.status**:
  状态

        **示例**:{
                "contract.cid": 1,
                "contract.status": 0
            }

### 签章

## api.communion.SignetAction

**数据类型**:

#### signet

    - **sid**: 签章ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **keyword**: 关键字
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **type**: 类型 , 0: 合同 , 1: 款项 , 2: 人资
      - 类型: *Short*
    - **status**: 状态 , 0: 初始, 1: 注册, 2: 认证, 3: 确认 , 4: 签章 , 5: 作废
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*
    - **signno**: 签章编号
      - 类型: *String*
    - **token**: 签章令牌
      - 类型: *String*
    - **authurl**: 认证路径
      - 类型: *String*

    ### `pageSignet` <span style="color:gray">[内部]</span>

        分页方式获取签章信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  签章列表 , 每条数据类型 *signet*

        **示例**:{
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

    ### `querySignet` <span style="color:gray">[内部]</span>

        查询签章信息 , 状态为0(初始)/1(注册)/2(认证)

**请求参数**:

- **signet.type**:
  类型

        **示例**:{
                "signet.type": 0
            }

**返回参数**:

- **signets**: 签章列表 , 每条数据类型 *signet*
          - 类型: *List*

        **示例**:{
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

    ### `querySignetBySid` <span style="color:gray">[内部]</span>

        通过印章ID查询签章信息

**请求参数**:

- **signet.sid**:
  印章ID

        **示例**:{
                "signet.sid": 1
            }

**返回参数**:

- **signet**: 签章信息 , 类型 *signet*
          - 类型: *Object*

        **示例**:{
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

    ### `addSignet` <span style="color:gray">[内部]</span>

        添加签章

        判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**

**请求参数**:

- **signet.no**:
  编号
        - **signet.name**:
  名称
        - **signet.keyword**:
  关键字
        - **signet.path**:
  文件路径
        - **signet.type**:
  类型

        **示例**:{
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ",
                "signet.type": 0
            }

    ### `copySignet` <span style="color:gray">[内部]</span>

        赋值签章

        判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**

**请求参数**:

- **signet.sid**:
  签章ID
        - **signet.no**:
  编号
        - **signet.name**:
  名称
        - **signet.keyword**:
  关键字

        **示例**:{
                "signet.sid": 1,
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }

    ### `moveSignet` <span style="color:gray">[内部]</span>

    ### `updateSignet` <span style="color:gray">[内部]</span>

        更新签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

**请求参数**:

- **signet.sid**:
  签章ID
        - **signet.no**:
  编号
        - **signet.name**:
  名称
        - **signet.keyword**:
  关键字
        - **signet.path**:
  文件路径

        **示例**:{
                "signet.sid": 1,
                "signet.no": "IN31HJOS",
                "signet.name": "签章名称",
                "signet.keyword": "关键字",
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }

    ### `registSignet` <span style="color:gray">[内部]</span>

        注册签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为0(初始) , 其他状态 , 错误信息 **130047 签章状态不可操作**

        更新签章状态为1(注册)

**请求参数**:

- **signet.sid**:
  签章ID

        **示例**:{
                "signet.sid": 1
            }

    ### `authSignet` <span style="color:gray">[内部]</span>

        认证签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为1(注册) , 其他状态 , 错误信息 **130047 签章状态不可操作**

        更新签章状态为2(认证)

**请求参数**:

- **signet.sid**:
  签章ID

        **示例**:{
                "signet.sid": 1
            }

    ### `confirmSignet` <span style="color:gray">[内部]</span>

        确认签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为2(认证) , 其他状态 , 错误信息 **130047 签章状态不可操作**

        更新签章状态为3(确认)

**请求参数**:

- **signet.sid**:
  签章ID

        **示例**:{
                "signet.sid": 1
            }

    ### `signateSignet` <span style="color:gray">[内部]</span>

        上传签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**请求参数**:

- **signet.sid**:
  签章ID
        - **signet.path**:
  文件路径

        **示例**:{
                "signet.sid": 1,
                "signet.path": "/ASDLFKJDSJFSADFLKJ"
            }

    ### `autoSignet` <span style="color:gray">[内部]</span>

        自动签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**请求参数**:

- **signet.sid**:
  签章ID

        **示例**:{
                "signet.sid": 1
            }

**返回参数**:

- **signet.path**:
  自动签章地址

        **示例**:{
                ...
                "signet": {
                    "path": "ASDLFKJDSJFSADFLKJ"
                },
                ...
            }

    ### `selectSignet` <span style="color:gray">[内部]</span>

        选择签章 , 配置签章所使用印章信息

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**请求参数**:

- **signet.sid**:
  签章ID
        - **signet.signid**:
  印章编号

**请求参数**:

- **signet.sid**:
  签章ID
        - **signet.signid**:
  印章编号

        **示例**:{
                "signet.sid": 1,
                "signet.signid": "IN31HJOS"
            }

    ### `cancelSignet` <span style="color:gray">[内部]</span>

        作废签章

        判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

**请求参数**:

- **signet.sid**:
  签章ID

        **示例**:{
                "signet.sid": 1
            }

### 印章

## api.communion.FadadaAction

**数据类型**:

#### signature

    - **customerId**: 客户编号
      - 类型: *String*
    - **signatureId**: 印章编号
      - 类型: *String*
    - **path**: 图片地址
      - 类型: *String*
    - **image**: 图片内容(base64)
      - 类型: *String*
    - **defaults**: 默认标识 , 0: 标准 , 1: 默认
      - 类型: *Short*
    - **type**: 类型 , 0: 个人 , 1: 公司
      - 类型: *Short*

    ### `pollingSignature` <span style="color:gray">[内部]</span>

        查询印章信息

**请求参数**:

- **signature.customerId**:
  客户编号

        **示例**:{
                "signature.customerId": 1
            }

**返回参数**:

- **signatures**: 印章列表 , 每条数据类型 *signature*
          - 类型: *List*

        **示例**:{
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

    ### `addSignature` <span style="color:gray">[内部]</span>

        添加印章信息

**请求参数**:

- **signature.customerId**:
  客户编号
        - **signature.path**:
  客户编号

        **示例**:{
                "signature.customerId": 1,
                "signature.path": "/ASDLFKJDSJFSADFLKJ",
            }

**返回参数**:

- **signature**: 印章信息 , 类型 *signature*
          - 类型: *Object*

        **示例**:{
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

    ### `defaultSignature` <span style="color:gray">[内部]</span>

        默认印章

**请求参数**:

- **signature.customerId**:
  客户编号
        - **signature.signatureId**:
  印章编号

        **示例**:{
                "signature.customerId": 1,
                "signature.signatureId": "IN31HJOS"
            }

    ### `deleteSignature` <span style="color:gray">[内部]</span>

        删除印章

**请求参数**:

- **signature.customerId**:
  客户编号
        - **signature.signatureId**:
  印章编号

        **示例**:{
                "signature.customerId": 1,
                "signature.signatureId": "IN31HJOS"
            }

### 话术

## api.communion.TalkingAction

**数据类型**:

#### talking

    - **tid**: 话术ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 施工合同
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageTalking` <span style="color:gray">[内部]</span>

        分页方式获取话术信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  签章列表 , 每条数据类型 *talking*

        **示例**:{
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

    ### `queryTalking` <span style="color:gray">[内部]</span>

        根据类型查询话术 , 状态为0(有效)

**请求参数**:

- **talking.type**:
  类型

        **示例**:{
                "talking.type": 0
            }

**返回参数**:

- **talkings**: 话术列表 , 每条数据类型 *talking*
          - 类型: *List*

        **示例**:{
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

    ### `addTalking` <span style="color:gray">[内部]</span>

        添加话术

**请求参数**:

- **talking.name**:
  名称
        - **talking.type**:
  类型
        - **talking.content**:
  内容

        **示例**:{
                "talking.name": "名称",
                "talking.type": 0,
                "talking.content": "内容"
            }

    ### `updateTalking` <span style="color:gray">[内部]</span>

        更新话术

        判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**

**请求参数**:

- **talking.tid**:
  话术ID
        - **talking.name**:
  名称
        - **talking.type**:
  类型
        - **talking.content**:
  内容

        **示例**:{
                "talking.tid": 1,
                "talking.name": "名称",
                "talking.type": 0,
                "talking.content": "内容"
            }

    ### `updateTalkingForStatus` <span style="color:gray">[内部]</span>

        更新话术状态

        判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**

**请求参数**:

- **talking.tid**:
  话术ID
        - **talking.status**:
  状态

        **示例**:{
                "talking.tid": 1,
                "talking.status": 0
            }

    ### `deleteTalking` <span style="color:gray">[内部]</span>

        删除话术

**请求参数**:

- **talking.tid**:
  话术ID

        **示例**:{
                "talking.tid": 1
            }

## 图片

图片信息管理 , 提供如楼盘图片等资源

## api.communion.DataDrawingAction

**数据类型**:

#### dataDrawing

    - **ddid**: 图片ID
      - 类型: *Long*
    - **sid**: 关联ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **drawingUrl**: 图片路径
      - 类型: *String*
    - **drawingType**: 图片类型 , 0: 本地 , 1: 钉钉
      - 类型: *Short*
    - **type**: 类型 , 0: 楼盘 , 1: 户型 , 2: 商品 , 3: 选材 , 4: 辅材 , 5: 商品池
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `queryDataDrawing` <span style="color:gray">[内部]</span>

        通过关联ID以及类型获取图片信息

**请求参数**:

- **dataDrawing.sid**:
  关联ID
        - **dataDrawing.type**:
  类型

        **示例**:{
                "dataDrawing.sid": 1,
                "dataDrawing.type": 0
            }

**返回参数**:

- **dataDrawings**: 图片信息列表 , 每条数据类型 *dataDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `addDataDrawing` <span style="color:blue">[自定义]</span>

        添加图片信息

**请求参数**:

- **dataDrawing.sid**:
  关联ID
        - **dataDrawing.name**:
  名称
        - **dataDrawing.drawingUrl**:
  路径
        - **dataDrawing.drawingType**:
  图片类型
        - **dataDrawing.type**:
  类型

        **示例**:{
                "dataDrawing.sid": 1,
                "dataDrawing.name": "name.jpg",
                "dataDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "dataDrawing.drawingType": 0,
                "dataDrawing.type": 0
            }

    ### `deleteDataDrawing` <span style="color:blue">[自定义]</span>

        删除图片信息

**请求参数**:

- **dataDrawing.ddid**:
  图片ID

        **示例**:{
                "dataDrawing.ddid": 1
            }

### 自检

## api.data.InspectAction

**数据类型**:

#### inspect

    - **iid**: 自检ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **atttype**: 业务类型 , 0: 通用 , 1: 装修 , 2: 销售
      - 类型: *Short*
    - **type**: 类型 , 0, 装修合同方案 , 1: 装修放线方案 , 2: 销售配送资料 , 3: 销售安装资料
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    #### inspectItem

    - **iiid**: 项目ID
      - 类型: *Long*
    - **iid**: 自检ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **type**: 类型
      - 类型: *Short*
    - **isRequire**: 必填标识
      - 类型: *Short*

    ### `pageInspect` <span style="color:gray">[内部]</span>

    ### `queryInspect` <span style="color:gray">[内部]</span>

    ### `queryInspectItem` <span style="color:gray">[内部]</span>

    ### `addInspect` <span style="color:gray">[内部]</span>

    ### `addInspectItem` <span style="color:gray">[内部]</span>

    ### `updateInspect` <span style="color:gray">[内部]</span>

    ### `updateInspectForStatus` <span style="color:gray">[内部]</span>

    ### `updateInspectItem` <span style="color:gray">[内部]</span>

    ###
