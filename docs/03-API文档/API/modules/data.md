# 数据


## 楼盘


楼盘信息管理


> **类**: `api.communion.VillageAction`


#### 数据类型: `village`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vid` | 楼盘ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `pinyinAB` | 拼音缩写 | String |
| `pinyinAll` | 拼音 | String |
| `cityProper` | 城区 , 类型 [cityProper ](./system.html#api.system.CityProperAction.cityProper) | Object |
| `developer` | 开发商 | String |
| `salesPhone` | 销售电话 | String |
| `deliveryTime` | 开盘时间 | String |
| `x` | 楼盘位置坐标 , 经度 | Integer |
| `y` | 楼盘位置坐标 , 纬度 | Integer |
| `url` | 默认图片 | String |
| `content` | 说明 | String |
| `status` | 状态 , 0: 禁用 , 1: 启用 | Short |


#### 数据类型: `keyValue`

| 参数 | 说明 | 类型 |
|------|------|------|
| `key` | 键 | String |
| `value` | 值 | String |


##### `查询` pageVillage

分页方式获取楼盘信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 楼盘信息列表 , 每条数据类型 `village`

```json
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
```


##### `查询` queryVillageByVid

通过楼盘ID获取楼盘信息

**Requests:**

- `village.vid` (Long): 楼盘ID

```json
{
    "village.vid": 1
}
```

**Returns:**

- `vilalge` (object): 楼盘信息 , 类型 `village`

```json
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
```


##### `查询` queryVillageForNameByPinyin

通过拼音信息获取楼盘名称信息

**Requests:**

- `pinyinName` (String): 楼盘名拼音

```json
{
    "pinyinName": "wd"
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为楼盘编号 , 值为楼盘名
- `autoFillList` (List): 楼盘名列表 , 每条数据类型String

```json
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
```


##### `创建` addVillage

添加楼盘信息

根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**

**Requests:**

- `village.name` (String): 楼盘名称
- `village.no` (String): 城区编号
- `village.developer` (String): 开发商
- `village.salesPhone` (String): 销售电话
- `village.deliveryTime` (String): 开盘时间
- `village.content` (String): 说明
- `village.x` (Integer): 经度
- `village.y` (Integer): 纬度

```json
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
```


##### `创建` updateVillage

更新楼盘信息

判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

根据楼盘名以及所在城区判断是否已经存在 , 已存在 , 错误信息 **130020 楼盘已存在**

**Requests:**

- `village.vid` (String): 楼盘ID
- `village.name` (String): 楼盘名称
- `village.cityProper.cpid` (String): 城区ID
- `village.developer` (String): 开发商
- `village.salesPhone` (String): 销售电话
- `village.deliveryTime` (String): 开盘时间
- `village.content` (String): 说明
- `village.x` (Integer): 经度
- `village.y` (Integer): 纬度

```json
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
```


##### `创建` updateVillageForStatus

更新楼盘状态 , 启用禁用

判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**Requests:**

- `village.vid` (Long): 楼盘ID
- `village.status` (Short): 状态 , 0: 禁用 , 1: 启用

```json
{
    "village.vid": 1,
    "village.status": 0
}
```


##### `创建` updateVillageForPosition

更新楼盘位置信息

判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**Requests:**

- `village.vid` (Long): 楼盘ID
- `village.x` (Integer): 横坐标
- `village.y` (Integer): 纵坐标

```json
{
    "village.vid": 1,
    "village.x": 0,
    "village.y": 0
}
```


##### `创建` updateVillageForUrl

更新楼盘默认图片

判断楼盘信息是否存在 , 不存在 , 错误信息 **130003 楼盘信息不存在**

**Requests:**

- `village.vid` (Long): 楼盘ID
- `village.url` (String): 默认图片

```json
{
    "village.vid": 1,
    "village.url": "/JSIODFNSNDF.JPG"
}
```

## 规则


> **类**: `api.communion.VillageRuleAction`


#### 数据类型: `villageRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vrid` | 规则ID | Long |
| `vid` | 楼盘ID | Long |
| `rule` | 规则 , [buildingNameRule ](./data.html#api.data.BuildingNameRuleAction.buildingNameRule) | Object |


##### `查询` queryVillageRule


##### `查询` addVillageRule


##### `查询` deleteVillageRule

## 户型


> **类**: `api.communion.HouseLayoutAction`


#### 数据类型: `houseLayout`

| 参数 | 说明 | 类型 |
|------|------|------|
| `hlid` | 户型ID | Long |
| `village` | 楼盘 , [village ](./data.html#api.data.VillageAction.village) | Object |
| `name` | 名称 | String |
| `layout` | 房型 | String |
| `area` | 面积 | Long |
| `houseType` | 类型 | String |
| `comment` | 说明 | String |


##### `查询` pageHouseLayout

分页方式获取户型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 户型信息列表 , 每条数据类型 `houseLayout`

```json
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
```


##### `查询` queryHouseLayout

根据楼盘ID获取户型信息

**Requests:**

- `houseLayout.vid` (Long): 楼盘ID

```json
{
    "houseLayout.vid": 1
}
```

**Returns:**

- `houseLayouts` (List): 户型信息列表 , 每条数据类型 `houseLayout`

```json
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
```


##### `查询` addHouseLayout

添加户型信息

**Requests:**

- `houseLayout.name` (String): 名称
- `houseLayout.village.vid` (-): 楼盘ID
- `houseLayout.layout` (String): 房型
- `houseLayout.area` (Long): 面积
- `houseLayout.houseType` (Long): 类型
- `houseLayout.comment` (String): 备注

```json
{
    "houseLayout.name": "名称",
    "houseLayout.village.vid": 1,
    "houseLayout.layout": "",
    "houseLayout.area": 100000,
    "houseLayout.houseType": "",
    "houseLayout.comment": "说明",
}
```


##### `创建` deleteHouseLayout

删除户型信息

**Requests:**

- `houseLayout.hlid` (Long): 户型ID

```json
{
    "houseLayout.hlid": 1
}
```

## 房产


> **类**: `api.communion.HouseAction`


#### 数据类型: `house`

| 参数 | 说明 | 类型 |
|------|------|------|


:param hid: 房产ID
:type hid: Long
:param village: 楼盘 , 类型 [village ](./data.html#api.data.VillageAction.village)
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


##### `查询` pageHouse

分页方式获取房产信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房产信息列表 , 每条数据类型 `house`

```json
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
```


##### `查询` queryHouseByHid

根据房产ID获取房产信息

**Requests:**

- `house.hid` (Long): 房产ID

```json
{
    "house.hid": 1
}
```

**Returns:**

- `houses` (List): 房产信息列表 , 每条数据类型 `house`

```json
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
```


##### `查询` queryHouseByNoAHnum

通过楼盘编号以及楼牌号查询房产信息

**Requests:**

- `house.village.no` (String): 楼盘编号
- `house.houseNumber` (String): 楼牌号

```json
{
    "house.village.no": "P001",
    "house.houseNumber": "1#1-1-1"
}
```

**Returns:**

- `houses` (List): 房产信息列表 , 每条数据类型 `house`

```json
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
```


##### `创建` addHouse

添加房产信息

判断楼盘号是否存在 , 错误信息 **320001 楼牌号已存在**

**Requests:**

- `house.village.vid` (Long): 楼盘ID
- `house.houseNumber` (String): 楼牌号
- `house.built` (Integer): 楼号
- `house.unit` (Integer): 单元
- `house.floor` (Integer): 楼层
- `house.door` (Integer): 门号
- `house.type` (Short): 房产类型
- `house.buildArea` (Integer): 建筑面积
- `house.freeArea` (Integer): 赠送面积
- `house.innerArea` (Integer): 套内面积
- `house.totalArea` (Integer): 总面积
- `house.maxFloor` (Short): 最高楼层
- `house.through` (Short): 是否越层
- `house.roomNum` (Integer): 房间数量
- `house.houseType` (String): 户型
- `house.orientation` (Short): 房屋朝向
- `house.feature` (String): 三不
- `house.waterVapour` (Short): 水气设施
- `house.parlourType` (Short): 客厅类型
- `house.heatingType` (Short): 供暖类型

```json
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
```


##### `查询` existHouse

通过楼盘ID和楼号判断房产信息 , 不存在创建 , 存在返回房产信息

**Requests:**

- `house.village.vid` (Long): 楼盘ID
- `house.houseNumber` (String): 楼牌号
- `house.buildArea` (Integer): 建筑面积
- `house.freeArea` (Integer): 赠送面积
- `house.innerArea` (Integer): 套内面积
- `house.totalArea` (Integer): 总面积
- `house.built` (Integer): 楼号
- `house.unit` (Integer): 单元
- `house.floor` (Integer): 楼层
- `house.door` (Integer): 门号

```json
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
```


##### `创建` updateHouse

更新房产信息

判断房产是否存在 , 错误信息 **320002 房产不存在**

判断房产状态是否为已出售 , 已出售房产状态不可操作 , 错误信息 **320003 房产状态不可操作**

**Requests:**

- `house.hid` (1): 房产ID
- `house.buildArea` (Integer): 建筑面积
- `house.freeArea` (Integer): 赠送面积
- `house.innerArea` (Integer): 套内面积
- `house.totalArea` (Integer): 总面积
- `house.maxFloor` (Short): 最高楼层
- `house.through` (Short): 是否越层
- `house.roomNum` (Integer): 房间数量
- `house.houseType` (String): 户型
- `house.orientation` (Short): 房屋朝向
- `house.feature` (String): 三不
- `house.waterVapour` (Short): 水气设施
- `house.parlourType` (Short): 客厅类型
- `house.heatingType` (Short): 供暖类型

```json
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
```


##### `创建` updateHouseForStatus

更新房产信息状态

**Requests:**

- `house.hid` (Long): 房产ID
- `house.status` (1): 状态

```json
{
    "house.hid": 1
    "house.status": 1
}
```

## 基础


### 常量


> **类**: `api.communion.ConstantAction`


#### 数据类型: `constant`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 常量ID | Long |
| `name` | 名称 | String |
| `module` | 模块 | String |
| `clazz` | 对象 | String |
| `type` | 类型 | String |
| `field` | 字段名 | String |
| `key` | 键 | String |
| `value` | 值 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `创建` pageConstant

分页方式获取常量信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 常量信息列表 , 每条数据类型 `constant`

```json
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
```


##### `创建` queryConstant

获取常量信息

**Returns:**

- `constants` (List): 常量信息列表 , 每条数据类型 `constant`

```json
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
```


##### `创建` addConstant


##### `创建` updateConstant


##### `创建` updateConstantForStatus


##### `创建` deleteConstant

### 工种


工种信息管理


> **类**: `api.communion.WorkTypeAction`


#### 数据类型: `workType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wtid` | 工种ID | Long |
| `name` | 工种名称 | String |


##### `查询` queryWorkType

获取所有工种信息

**Returns:**

- `workTypes` (List): 工种信息列表 , 每条数据类型 `workType`

```json
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
```

### 单位


单位信息管理


> **类**: `api.communion.MeasurementUnitAction`


#### 数据类型: `measurementUnit`

| 参数 | 说明 | 类型 |
|------|------|------|
| `muid` | 单位ID | Long |
| `name` | 单位名称 | String |


##### `查询` pageMeasurementUnit

分页方式获取单位信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 单位信息列表 , 每条数据类型 `measurementUnit`

```json
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
```


##### `查询` queryMeasurementUnit

获取所有单位信息

**Returns:**

- `measurementUnits` (List): 单位信息列表 , 每条数据类型 `measurementUnit`

```json
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
```


##### `创建` addMeasurementUnit

添加单位信息

判断单位名称是否存在,已经存在,错误信息 **130010 单位已存在**

**Requests:**

- `measurementUnit.name` (String): 名称

```json
{
    "measurementUnit.name": '个'
}
```


##### `创建` updateMeasurementUnit

编辑单位信息

判断单位名称是否存在,不存在,错误信息 **130011 单位不存在**

**Requests:**

- `measurementUnit.muid` (Long): 单位ID
- `measurementUnit.name` (String): 名称

```json
{
    "measurementUnit.muid": 1,
    "measurementUnit.name": '个'
}
```

### 职位


职位信息管理


> **类**: `api.communion.DutyAction`


#### 数据类型: `duty`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 职位ID | Long |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `departmentType` | 部门类型 , 类型 [departmentType ](./department.html#api.department.DepartmentTypeAction.departmentType) | Object |
| `type` | 类型 , 0: 产值 , 1: 非产值 | Short |
| `status` | 状态 , 0(启用) , 1(禁用) | Short |
| `lead` | 领导标识 , 0: 标准 , 1: 领导 | Short |


##### `查询` pageDuty

分页方式获取职位信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 职位信息列表 , 每条数据类型 `duty`

```json
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
```


##### `查询` queryDuty

获取职位信息 , 职位状态为启用

**Returns:**

- `dutys` (List): 职位列表 , 每条数据类型 `duty`

```json
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
```


##### `查询` queryDutyByName

获取职位信息 , 通过拼音/名称作为条件匹配

**Requests:**

- `pinyinName` (String): 拼音
- `duty.departmentType.dtid` (Long): 部门类型ID

```json
{
    "pinyinName": "pinyin",
    "duty.departmentType.dtid": 1
}
```

**Returns:**

- `dutys` (List): 职位列表 , 每条数据类型 `duty`

```json
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
```


##### `查询` queryDutyByDtid

通过部门类型ID获取职位信息

**Requests:**

- `duty.departmentType.dtid` (Long): 部门类型ID

```json
{
    "duty.departmentType.dtid": 1
}
```

**Returns:**

- `dutys` (List): 职位列表 , 每条数据类型 `duty`

```json
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
```


##### `创建` addDuty

添加职位信息

**Requests:**

- `duty.name` (String): 名称
- `duty.lead` (Short): 领导标识
- `duty.departmentType.dtid` (Long): 部门类型ID
- `duty.type` (Short): 类型

```json
{
    "duty.name": "设计师",
    "duty.lead": 0,
    "duty.departmentType.dtid": 1,
    "duty.type": 1
}
```


##### `创建` updateDuty

更新职位信息

职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**

**Requests:**

- `duty.did` (Long): 职位ID
- `duty.name` (String): 名称
- `duty.lead` (Short): 领导标识

```json
{
    "duty.did": 1,
    "duty.name": "设计师",
    "duty.lead": 0,
    "duty.departmentType.dtid": 1,
    "duty.type": 1
}
```


##### `创建` updateDutyForStatus

更新职位状态

职位信息不存在 , 更新失败 , 错误信息 **130015 职位不存在**

**Requests:**

- `duty.did` (Long): 职位ID
- `duty.status` (Short): 状态
- `duty.lead` (Short): 领导标识

```json
{
    "duty.did": 1,
    "duty.status": 0
}
```

### 楼号规则


楼号规则信息管理


> **类**: `api.communion.BuildingNameRuleAction`


#### 数据类型: `buildingNameRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bnrid` | 规则ID | Long |
| `no` | 规则编号 | String |
| `rule` | 楼号规则 | String |
| `example` | 规则样例 | String |
| `content` | 规则说明 | String |
| `filling` | 填充方式 | String |


##### `查询` pageBuildingNameRule

分页方式获取楼号规则信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 楼号规则信息列表 , 每条数据类型 `buildingNameRule`

```json
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
```


##### `查询` queryBuildingNameRule

获取所有楼号规则信息

**Returns:**

- `buildingNameRules` (List): 楼号规则列表 , 每条数据类型 `buildingNameRule`

```json
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
```

### 外链


外链页面信息管理


> **类**: `api.data.ChainPageAction`


#### 数据类型: `chainPage`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | ID | Long |
| `name` | 名称 | String |
| `url` | 地址 | String |
| `companymark` | 公司标识 | Short |
| `comment` | 说明 | String |


##### `查询` queryChainPage

获取外链页面信息

**Returns:**

- `chainPages` (List): 外链信息列表 , 每条数据类型 `chainPage`

```json
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
```


##### `查询` queryChainPageForSelf

获取当前登录用户拥有外链

**Requests:**

- `chainPage.name` (String): 名称
- `chainPage.url` (String): 地址
- `chainPage.comment` (String): 说明

```json
{
    "chainPage.name": "页面",
    "chainPage.url": "http://api.com",
    "chainPage.companymark": 1,
    "chainPage.comment": "说明"
}
```


##### `查询` addChainPage

添加外链信息

**Requests:**

- `chainPage.name` (String): 名称
- `chainPage.url` (String): 地址
- `chainPage.companymark` (Short): 公司标识
- `chainPage.comment` (String): 说明

```json
{
    "chainPage.name": "页面",
    "chainPage.url": "http://api.com",
    "chainPage.companymark": 1,
    "chainPage.comment": "说明"
}
```


##### `查询` deleteChainPage

删除外链信息

外链已经被使用 , 删除失败 , 错误信息 **130013 外链已使用**

**Requests:**

- `chainPage.cpid` (Long): ID

```json
{
    "chainPage.cpid": 1
}
```

### 服务节点


> **类**: `api.communion.ServiceNodeAction`


#### 数据类型: `serviceNode`

| 参数 | 说明 | 类型 |
|------|------|------|
| `snid` | 服务节点ID | Long |
| `psnid` | 上级节点ID | Long |
| `name` | 名称 | String |
| `detail` | 详述 | String |
| `type` | 类型 , 0: 装修 , 1: 主材 , 2: 工程 | Short |
| `attnode` | 业务节点 , 0: 创建 , 1: 预签 , 2: 签单 , 3: 付款 | Short |
| `blankNum` | 间隔天数 | Integer |
| `workNum` | 工期天数 | Integer |
| `loop` | 是否循环 | Short |
| `userType` | 人员类型 , 0: 员工 , 1: 经历 , 2: 总监 | Short |
| `userDuty` | 人员职位 | Long |
| `status` | 状态 , 0(启用) , 1(禁用) | Short |
| `company` | 公司 | Integer |


##### `查询` pageServiceNode

分页方式获取服务节点信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 服务节点信息列表 , 每条数据类型 `serviceNode`

```json
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
```


##### `创建` addServiceNode

添加服务节点信息

**Requests:**

- `serviceNode.name` (String): 名称
- `serviceNode.detail` (String): 详述
- `serviceNode.type` (Short): 类型

```json
{
    "serviceNode.name": "报价",
    "serviceNode.detail": "报价详述",
    "serviceNode.type": 0
}
```


##### `创建` updateServiceNode

更新服务节点信息

服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**

**Requests:**

- `serviceNode.snid` (Long): 服务节点ID
- `serviceNode.name` (String): 名称
- `serviceNode.detail` (String): 详述
- `serviceNode.type` (Short): 领导标识

```json
{
    "serviceNode.snid": 1,
    "serviceNode.name": "报价",
    "serviceNode.detail": "报价详述",
    "serviceNode.type": 1
}
```


##### `创建` updateServiceNodeForStatus

更新服务节点状态

服务节点信息不存在 , 更新失败 , 错误信息 ** 服务节点不存在**

**Requests:**

- `serviceNode.snid` (Long): 职位ID
- `serviceNode.status` (Short): 状态

```json
{
    "serviceNode.snid": 1,
    "serviceNode.status": 0
}
```

### 图表


> **类**: `api.communion.ChartAction`


#### 数据类型: `chart`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 图表ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `type` | 类型 , 1: 装修 , 2: 销售 , 3: 工程 , 4: 款项 | Short |
| `level` | 等级 , 0: 集团 , 1: 公司 , 2: 大区 , 3: 部门 | Short |
| `api` | 接口 | String |
| `method` | 方法 | String |
| `param` | 参数 | String |
| `style` | 样式 | String |
| `clazz` | 类型 | String |
| `sort` | 排序 | Integer |
| `comment` | 说明 | String |


##### `查询` pageChart

分页方式获取图表信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 图表信息列表 , 每条数据类型 `chart`

```json
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
```


##### `查询` queryChart

获取图表信息

**Requests:**

- `chart.type` (Short): 类型
- `chart.level` (Short): 等级

```json
{
    "chart.type": 1
}
```

**Returns:**

- `charts` (List): 图表信息列表 , 每条数据类型 `chart`

```json
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
```


##### `查询` queryChartForLogin

获取当前用户所属角色拥有的图表信息

**Returns:**

- `charts` (List): 图表信息列表 , 每条数据类型 `chart`

```json
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
```


##### `查询` queryChartByRid

通过角色ID获取图表信息

**Requests:**

- `role.rid` (Long): 角色ID

```json
{
    "role.rid": 1
}
```

**Returns:**

- `charts` (List): 图表信息列表 , 每条数据类型 `chart`

```json
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
```


##### `创建` updateRoleChartByRid

通过角色ID更新角色拥有图表信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**

**Requests:**

- `role.rid` (String): 角色编号

```json
{
    "role.rid": 1,
    "cids[0]": 1,
}
```

### 标签


> **类**: `api.data.LabelAction`


#### 数据类型: `label`

| 参数 | 说明 | 类型 |
|------|------|------|
| `lid` | 标签ID | Long |
| `name` | 名称 | String |
| `scale` | 比例 , 范围: 1-100 | Short |
| `type` | 类型 , 0: 风格, 1: 面积, 2: 楼盘, 3: 年龄 | Short |
| `isShow` | 是否显示 , 0: 显示 , 1: 不显示 | Short |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |


##### `查询` pageLabel

分页方式获取标签消息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 标签信息列表 , 每条数据类型 `label`

```json
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
```


##### `查询` queryLabel

获取标签信息 , 状态0(启用)

**Returns:**

- `labels` (List): 标签信息列表 , 每条数据类型 `label`

```json
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
```


##### `查询` addLabel

添加标签

**Requests:**

- `label.name` (String): 名称
- `label.scale` (Short): 比例
- `label.type` (Short): 类型

```json
{
    "label.name": "中式",
    "label.scale": 15,
    "label.type": 0
}
```


##### `查询` updateLabel

更新标签

判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**

**Requests:**

- `label.lid` (Long): 标签ID
- `label.name` (String): 名称
- `label.scale` (Short): 比例
- `label.type` (Short): 类型

```json
{
    "label.lid": 1,
    "label.name": "中式",
    "label.scale": 15,
    "label.type": 0
}
```


##### `查询` updateLabelForStatus

更新标签状态

判断标签是否存在 , 不存在 , 错误信息 **130024 标签不存在**

**Requests:**

- `label.lid` (Long): 标签ID
- `label.status` (Short): 状态

```json
{
    "label.lid": 1,
    "label.status": 1
}
```

### 流程


> **类**: `api.data.FlowpathAction`


#### 数据类型: `flowpath`

| 参数 | 说明 | 类型 |
|------|------|------|
| `fpid` | 流程ID | Long |
| `name` | 名称 | String |
| `no` | 编号 | String |
| `keyword` | 关键字 | String |
| `type` | 类型 | Short |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |


##### `查询` pageFlowpath

分页方式获取流程信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 流程信息列表 , 每条数据类型 `flowpath`

```json
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
```


##### `查询` queryFlowpath

获取流程信息

**Requests:**

- `flowpath.fpid` (Long): 流程ID
- `flowpath.keyword` (String): 关键字

```json
{
    "flowpath.fpid": 1,
    "flowpath.keyword": "",
}
```

**Returns:**

- `flowpaths` (List): 流程信息列表 , 每条数据类型 `flowpath`

```json
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
```


##### `查询` addFlowpath

创建流程

**Requests:**

- `flowpath.name` (Long): 名称
- `flowpath.no` (String): 编号
- `flowpath.keyword` (Long): 关键字
- `flowpath.type` (Short): 类型

```json
{
    "flowpath.name": "流程信息",
    "flowpath.no": "FP0001",
    "flowpath.keyword": "FlowInfo",
    "flowpath.type": 0
}
```


##### `查询` updateFlowpath

更新流程

判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**Requests:**

- `flowpath.fpid` (Long): 流程ID
- `flowpath.name` (Long): 名称
- `flowpath.no` (String): 编号
- `flowpath.keyword` (Long): 关键字
- `flowpath.type` (Short): 类型

```json
{
    "flowpath.fpid": 1,
    "flowpath.name": "流程信息",
    "flowpath.no": "FP0001",
    "flowpath.keyword": "FlowInfo",
    "flowpath.type": 0
}
```


##### `查询` deleteFlowpath

删除流程

判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**Requests:**

- `flowpath.fpid` (Long): 流程ID

```json
{
    "flowpath.fpid": 1
}
```


> **类**: `api.data.FlowitemAction`


#### 数据类型: `flowitem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `fiid` | 节点ID | Long |
| `fpid` | 流程ID | Long |
| `name` | 名称 | String |
| `content` | 内容 | String |
| `type` | 类型 | Short |
| `x` | x坐标 | Integer |
| `y` | y坐标 | Integer |
| `pfiid` | 上级节点ID | Long |
| `nfiid` | 下级节点ID | Long |


##### `查询` queryFlowitem

获取流程节点

**Requests:**

- `flowitem.fpid` (Long): 流程ID

```json
{
    "flowitem.fpid": 1
}
```

**Returns:**

- `flowitems` (List): 流程节点信息列表 , 每条数据类型 `flowitem`

```json
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
```


##### `查询` addFlowitem

添加流程节点

判断流程信息是否存在 , 不存在 , 错误信息 **130111 流程不存在**

**Requests:**

- `flowpath.fpid` (Long): 流程ID

```json
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
```


##### `查询` deleteFlowItem

删除流程节点

**Requests:**

- `flowitem.fpid` (Long): 流程ID

```json
{
    "flowitem.fpid": 1
}
```

### 帮助


> **类**: `api.data.AssistanceAction`


#### 数据类型: `assistance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 帮助ID | Long |
| `name` | 名称 | String |
| `keyword` | 关键字 | String |
| `atttype` | 业务类型 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |


#### 数据类型: `assistanceItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aiid` | 项目ID | Long |
| `aid` | 帮助ID | Long |
| `title` | 标题 | String |
| `content` | 说明 | String |
| `sort` | 排序 | Integer |
| `drawings` | 图片 | List |


##### `查询` pageAssistance

分页方式获取客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 帮助信息列表 , 每条数据类型 `assistance`

```json
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
```


##### `创建` queryAssistance


##### `创建` queryAssistanceByAid


##### `创建` queryAssistanceByKeyword


##### `创建` addAssistance


##### `创建` updateAssistance


##### `创建` updateAssistanceForStatus


##### `创建` queryAssistanceItem


##### `创建` addAssistanceItem


##### `创建` updateAssistanceItem

## 客户


### 投诉原因


> **类**: `api.customer.ComplasonAction`


#### 数据类型: `complason`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csid` | 投诉理由ID | Long |
| `type` | 类型 , 0: 设计 , 1: 业务 , 2: 工程 , 3: 销售 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `content` | 内容 | String |
| `company` | 公司 | Integer |


##### `查询` pageComplason

分页方式获取投诉原因信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 投诉原因信息列表 , 每条数据类型 `complason`

```json
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
```


##### `查询` queryComplason

通过类型查询投诉原因

**Requests:**

- `complason.type` (Short): 类型

```json
{
    "complason.type": 1
}
```


##### `查询` addComplason

添加投诉原因信息

**Requests:**

- `complason.type` (Short): 类型
- `complason.content` (Short): 类型

```json
{
    "complason.type": 1,
    "complason.content": "内容"
}
```


##### `查询` updateComplasonForStatus

更新投诉原因状态

**Requests:**

- `complason.csid` (Long): 原因ID
- `complason.status` (Short): 类型

```json
{
    "complason.csid": 1,
    "complason.status": 0
}
```

### 调研模版


> **类**: `api.data.SurveyTemplateAction`


#### 数据类型: `surveyTemplate`

| 参数 | 说明 | 类型 |
|------|------|------|
| `stid` | 模版ID | Long |
| `name` | 名称 | String |
| `isSend` | 推送标识 , 0: 手动 , 1: 自动 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |
| `items` | 项目列表 , 每条数据类型 [surveyTemplateItem ](./data.html#api.data.SurveyTemplateAction.surveyTemplateItem) | List |


#### 数据类型: `surveyTemplateItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `stiid` | 项目ID | Long |
| `stid` | 模版ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选 | Short |
| `content` | 内容 | String |
| `options` | 选项列表 , 每条数据类型 [surveyTemplateItem ](./data.html#api.data.SurveyTemplateAction.surveyTemplateItem) | List |


#### 数据类型: `surveyTemplateOption`

| 参数 | 说明 | 类型 |
|------|------|------|
| `stoid` | 选项ID | Long |
| `stiid` | 项目ID | Long |
| `stid` | 模版ID | Long |
| `title` | 标题 | String |


##### `查询` pageSurveyTemplate

分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 调研模版列表 , 每条数据类型 `surveyTemplate`

```json
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
```


##### `查询` querySurveyTemplate

获取调研模版

**Returns:**

- `surveyTemplates` (List): 调研模版列表 , 每条数据类型类型 `surveyTemplate`

```json
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
```


##### `查询` querySurveyTemplateByStid

获取调研模版

**Requests:**

- `surveyTemplate.stid` (Long): 模版ID

```json
{
    "surveyTemplate.stid": 1
}
```

**Returns:**

- `surveyTemplate` (Object): 调研模版 , 数据类型 `surveyTemplate`

```json
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
```


##### `查询` addSurveyTemplate

创建调研模版

**Requests:**

- `surveyTemplate.name` (String): 名称
- `surveyTemplate.isSend` (Short): 推送标识

```json
{
    "surveyTemplate.name": "模版",
    "surveyTemplate.isSend": 0,

    "surveyTemplate.items[0].name": "项目",
    "surveyTemplate.items[0].type": 0,
    "surveyTemplate.items[0].content": "内容",

    "surveyTemplate.items[0].options[0].title": "标题"
}
```


##### `查询` updateSurveyTemplate

更新调研模版

判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**Requests:**

- `surveyTemplate.stid` (Long): 模版ID
- `surveyTemplate.name` (String): 名称

```json
{
    "surveyTemplate.stid": 1,
    "surveyTemplate.name": "模版",

    "surveyTemplate.items[0].name": "项目",
    "surveyTemplate.items[0].type": 0,
    "surveyTemplate.items[0].content": "内容",

    "surveyTemplate.items[0].options[0].title": "标题"
}
```


##### `查询` updateSurveyTemplateForStatus

更新调研模版状态

判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**Requests:**

- `surveyTemplate.stid` (Long): 模版ID
- `surveyTemplate.isSend` (Short): 推送标识
- `surveyTemplate.status` (Short): 状态

```json
{
    "surveyTemplate.stid": 1,
    "surveyTemplate.isSend": 0,
    "surveyTemplate.status": 0
}
```


##### `查询` deleteSurveyTemplate

删除调研模版

判断调研模版是否存在 , 不存在 , **130096 调研模版不存在**

**Requests:**

- `surveyTemplate.stid` (Long): 模版ID

```json
{
    "surveyTemplate.stid": 1
}
```

### 话术


> **类**: `api.data.ChatingAction`


#### 数据类型: `chating`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 话术ID | Long |
| `title` | 标题 | String |
| `content` | 内容 | String |
| `type` | 类型 , 0: 文本, 2: 应用 | Short |
| `atttype` | 业务类型 , 0: 客户, 1: 装修, 2: 主材, 3: 工程, 4: 款项, 5: 其他 | Short |
| `path` | 路径 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


##### `查询` pageChating

分页方式获取话术信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 话术列表 , 每条数据类型 `chating`

```json
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
```


##### `查询` queryChating

获取话术信息

**Returns:**

- `chatings` (List): 话术列表 , 每条数据类型 `chating`

```json
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
```


##### `查询` addChating

添加话术

**Requests:**

- `chating.title` (String): 标题
- `chating.content` (String): 内容
- `chating.type` (Short): 类型
- `chating.atttype` (Short): 业务类型
- `chating.path` (String): 路径

```json
{
    "chating.title": "标题",
    "chating.content": "内容",
    "chating.type": 0,
    "chating.atttype": 0,
    "chating.path": ""
}
```


##### `查询` updateChating

更新话术

判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**Requests:**

- `chating.cid` (Long): 话术ID
- `chating.title` (String): 标题
- `chating.content` (String): 内容
- `chating.type` (Short): 类型
- `chating.atttype` (Short): 业务类型
- `chating.path` (String): 路径

```json
{
    "chating.cid": 1,
    "chating.title": "标题",
    "chating.content": "内容",
    "chating.type": 0,
    "chating.atttype": 0,
    "chating.path": ""
}
```


##### `查询` updateChatingForStatus

更新话术状态

判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**Requests:**

- `chating.cid` (Long): 话术ID
- `chating.status` (String): 状态

```json
{
    "chating.cid": 1,
    "chating.status": 0
}
```


##### `查询` deleteChating

删除话术

判断话术信息是否存在 , 不存在 , 错误信息 **130101 话术不存在**

**Requests:**

- `chating.cid` (Long): 话术ID

```json
{
    "chating.cid": 1
}
```

## 装修


### 业务类型


> **类**: `api.data.DecorationBusitype`


#### 数据类型: `decorationBusitype`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dbid` | 类型ID | Long |
| `name` | 名称 | String |
| `outside` | 三方 , 0: 内部 , 1: 三方 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


##### `查询` pageDecorationBusitype

分页方式获取业务类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 客户信息列表 , 每条数据类型 `decorationBusitype`

```json
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
```


##### `查询` queryDecorationBusitype

获取业务类型信息

**Returns:**

- `decorationBusitypes` (object): 业务类型信息 , 类型 `decorationBusitype`

```json
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
```


##### `查询` addDecorationBusitype

添加业务类型

**Requests:**

- `decorationBusitype.name` (String): 名称
- `decorationBusitype.outside` (Short): 三方

```json
{
    "decorationBusitype.name": "业务类型",
    "decorationBusitype.outside": 0
}
```


##### `查询` updateDecorationBusitype

更新业务类型

判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**

**Requests:**

- `decorationBusitype.dbid` (Long): 业务类型ID
- `decorationBusitype.name` (String): 名称
- `decorationBusitype.outside` (Short): 三方

```json
{
    "decorationBusitype.dbid": 1,
    "decorationBusitype.name": "业务类型",
    "decorationBusitype.outside": 0
}
```


##### `查询` updateDecorationBusitypeForStatus

更新业务类型状态

判断业务类型是否存在 , 不存在 , 错误信息 **130061 业务类型不存在**

**Requests:**

- `decorationBusitype.dbid` (Long): 业务类型ID
- `decorationBusitype.status` (Short): 状态
- `decorationBusitype.outside` (Short): 三方

```json
{
    "decorationBusitype.dbid": 1,
    "decorationBusitype.status": 1,
    "decorationBusitype.outside": 0
}
```

### 装修业务


> **类**: `api.data.DecorationAtttype`


#### 数据类型: `decorationAtttype`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daid` | 业务ID | Long |
| `name` | 名称 | String |
| `key` | 键值 | Long |
| `type` | 类型 , 0: 半包, 1: 整装, 2: 满减 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


##### `查询` pageDecorationAtttype

分页方式获取装修业务信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修业务信息列表 , 每条数据类型 `decorationAtttype`

```json
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
```


##### `查询` queryDecorationAtttype

获取装修业务信息

**Returns:**

- `decorationAtttypes` (object): 装修业务类型信息 , 类型 `decorationAtttype`

```json
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
```

### 装修配比


> **类**: `api.data.DecorationMatchingAction`


#### 数据类型: `decorationMatching`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dmid` | 配比ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 对应装修单中的type | Short |
| `base` | 基数 | Integer |
| `discount` | 折扣 | Integer |
| `discountType` | 折扣方式 , 0: 固定 , 1: 可改 , 2: 最低 | Short |
| `material` | 主材配比 | Integer |
| `service` | 服务配比 | Integer |
| `vision` | 显示 , 1: 报价折扣 , 2: 报价计算 , 4: 生成款项 , 8: 决算计算 | Short |
| `isShow` | 默认显示 0: 显示 , 1: 隐藏 | Short |
| `trafficDiscount` | 车运费折扣 , 0: 不打折 , 1: 打折 | Short |
| `manageDiscount` | 管理费折扣 , 0: 不打折 , 1: 打折 | Short |
| `taxDiscount` | 税金折扣 , 0: 管理税金 , 1: 总额税金 | Short |
| `comment` | 说明 | String |
| `company` | 公司 | Integer |


##### `查询` pageDecorationMatching


##### `查询` queryDecorationMatching


##### `查询` addDecorationMatching


##### `查询` updateDecorationMatching

### 量尺规则


> **类**: `api.data.DecorationMeasure`


#### 数据类型: `decorationMeasure`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dmid` | 规则ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `comment` | 说明 | String |


#### 数据类型: `decorationMeasureItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dmiid` | 项目ID | Long |
| `dmid` | 规则ID | Long |
| `company` | 公司ID | Integer |


##### `查询` queryDecorationMeasure

## 款项


### 款项类型


收据类型信息管理


> **类**: `api.data.PaymentTypeAction`


| type | paytype | bustype | atttype | name | index |
| --- | --- | --- | --- | --- | --- |
| 0 预付款 | 0 收款 | 0 合同 | 0 预付 | 装修预付款 |  |
| 0 预付款 | 1 提现 | 1 主材 | 0 预付 | 主材预付款 |  |
|  |  |  |  |  |  |
| 1 装修款 | 0 收款 | 0 装修 | 0 基础 | 设计费 |  |
| 1 装修款 | 0 收款 | 0 装修 | 1 合同 | 首付款 |  |
| 1 装修款 | 0 收款 | 0 装修 | 2 增减 | 增项款 |  |
| 1 装修款 | 1 退款 | 0 装修 | 2 增减 | 减项款 |  |
| 1 装修款 | 0 收款 | 1 主材 | 4 终止 | 违约金 |  |
| 1 装修款 | 0 收款 | 1 装修 | 3 其他 | 手续费 |  |
|  |  |  |  |  |  |
| 2 主材款 | 0 收款 | 1 主材 | 0 基础 | 定金 | 2 |
| 2 主材款 | 0 收款 | 1 主材 | 0 基础 | 补款 | 3 |
|  |  |  |  |  |  |
| 3 销售款 | 0 收款 | 1 主材 | 0 基础 | 定金 | 2 |
| 3 销售款 | 0 收款 | 1 主材 | 0 基础 | 补款 | 3 |
| 3 销售款 | 1 退款 | 1 主材 | 1 退款 | 退款 | 4 |
| 3 销售款 | 1 退款 | 1 主材 | 1 退款 | 补款退款 | 5 |
| 3 销售款 | 1 退款 | 1 主材 | 1 退款 | 券退款 | 6 |
| 3 销售款 | 1 退款 | 1 主材 | 1 退款 | 定金退款 | 7 |
| 3 销售款 | 0 收款 | 1 主材 | 2 其他 | 不退定金 | 8 |
|  |  |  |  |  |  |
| 4 服务款 |  |  |  |  |  |


#### 数据类型: `paymentType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ptid` | 款项类型ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 | Short |
| `paytype` | 付款类型 , 0: 收款 , 1: 出款 | Short |
| `bustype` | 业务类型 , 0: 装修 , 1: 主材 | Short |
| `atttype` | 属性类型 , 装修: 0(基础) , 1(合同) , 2(增减) , 3(其他) | Short |
| `payScale` | 付款比例 | Integer |
| `saleScale` | 销售比例 | Integer |
| `index` | 索引 | Integer |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |
| `kibalance` | 结算方式 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pagePaymentType

分页方式获取款项类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 收据类型信息列表 , 每条数据类型 `paymentType`

```json
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
```


##### `查询` queryPaymentType

查询款项类型

**Requests:**

- `paymentType.type` (Short): 类型
- `paymentType.paytype` (Short): 付款类型
- `paymentType.bustype` (Short): 业务类型
- `paymentType.atttype` (Short): 属性类型

```json
{
    "paymentType.type": 1,
    "paymentType.paytype": 1,
    "paymentType.bustype": 1,
    "paymentType.atttype": 1
}
```

**Returns:**

- `paymentTypes` (List): 款项类型信息列表 , 每条信息类型 `paymentType`

```json
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
```


##### `查询` queryPaymentTypeByName


##### `创建` queryPaymentTypeByPtid

通过ID查询款项类型信息

**Requests:**

- `paymentType.ptid` (Long): 款项类型ID

```json
{
    "paymentType.ptid": 1
}
```

**Returns:**

- `paymentType` (Object): 款项类型 , 类型 `paymentType`

```json
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
```


##### `创建` addPaymentType

添加款项类型

判断款项类型名称是否存在有效数据 , 已存在 , 错误信息 **130093 款项类型已存在**

**Requests:**

- `paymentType.name` (String): 名称
- `paymentType.type` (Short): 类型
- `paymentType.paytype` (Short): 付款类型
- `paymentType.bustype` (Short): 业务类型
- `paymentType.atttype` (Short): 属性类型
- `paymentType.payScale` (Integer): 付款比例
- `paymentType.salesScale` (Integer): 索引
- `paymentType.index` (Integer): 索引
- `paymentType.kino` (String): 金蝶编号
- `paymentType.kiname` (String): 金蝶名称
- `paymentType.kibalance` (String): 金蝶结算

```json
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
```


##### `创建` updatePaymentType

添加款项类型

判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**

**Requests:**

- `paymentType.ptid` (Long): 款项类型ID
- `paymentType.kino` (String): 金蝶编号
- `paymentType.kiname` (String): 金蝶名称
- `paymentType.kibalance` (String): 金蝶结算

```json
{
    "paymentType.ptid": 1
    "paymentType.kino": "1010001001",
    "paymentType.kiname": "现金",
    "paymentType.kibalance": "JSU2J3-SYS",
}
```


##### `创建` updatePaymentTypeForStatus

更新款项类型状态

判断款项类型是否存在 , 不存在 , 错误信息 **130091 款项类型不存在**

**Requests:**

- `paymentType.ptid` (Long): 款项类型ID
- `paymentType.status` (Short): 状态

```json
{
    "paymentType.ptid": 1
    "paymentType.status": 1
}
```

### 收据类型


收据类型信息管理


> **类**: `api.data.ReceiptTypeAction`


#### 数据类型: `receiptType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rtid` | 收据类型ID | Long |
| `no` | 编号 | String |
| `name` | 收据类型名称 | String |
| `grade` | 等级 , A/B/C | String |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |
| `kibalance` | 结算方式 | String |
| `assistant` | 辅助核算项 | String |
| `type` | 类型 , 1: 现金 , 2: 银行 , 3: 转账 , 4: 对公 , 5: 优惠 | Short |
| `fund` | 资金类型 , 0: 标准 , 1: 资金 | Short |
| `status` | 状态 , 0: 失效 , 1: 有效 | Short |
| `bankno` | 银行卡 | String |
| `company` | 公司ID | Integer |


##### `查询` pageReceiptType

分页方式获取收据类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 收据类型信息列表 , 每条数据类型 `receiptType`

```json
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
```


##### `查询` queryReceiptType

获取所有收据类型信息

**Returns:**

- `receiptTypes` (List): 收据类型信息列表 , 每条信息类型 `receiptType`

```json
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
```


##### `查询` queryReceiptTypeByNo


##### `查询` queryReceiptTypeByType

通过类型获取收据类型信息

**Requests:**

- `receiptType.type` (Short): 类型
- `receiptType.grade` (String): 等级

```json
{
    "receiptType.type": 1
}
```

**Returns:**

- `receiptTypes` (List): 收据类型信息列表 , 每条信息类型 `receiptType`

```json
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
```


##### `创建` addReceiptType

添加收据类型信息

**Requests:**

- `receiptType.no` (String): 键值
- `receiptType.name` (String): 名称
- `receiptType.grade` (String): 等级
- `receiptType.kino` (String): 金蝶编号
- `receiptType.kiname` (String): 金蝶名称
- `receiptType.kibalance` (String): 结算方式
- `receiptType.assistant` (String): 辅助核算项
- `receiptType.type` (Short): 类型
- `receiptType.fund` (Short): 资金类型

```json
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
```


##### `查询` updateReceiptType

更新收据类型信息

收据类型信息不存在 , 错误信息 **130005 收据类型不存在**

**Requests:**

- `receiptType.rtid` (Long): ID
- `receiptType.no` (String): 键值
- `receiptType.name` (String): 名称
- `receiptType.grade` (String): 等级
- `receiptType.kino` (String): 金蝶编号
- `receiptType.kiname` (String): 金蝶名称
- `receiptType.kibalance` (String): 结算方式
- `receiptType.assistant` (String): 辅助核算项
- `receiptType.type` (Short): 类型
- `receiptType.fund` (Short): 资金类型

```json
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
```


##### `查询` updateReceiptTypeForStatus

更新收据类型信息状态

收据类型信息不存在 , 错误信息 **130005 收据类型不存在**

**Requests:**

- `receiptType.rtid` (Long): ID
- `receiptType.status` (Short): 状态

```json
{
    "receiptType.rtid": 1,
    "receiptType.status": 1
}
```

**DataType:**


#### 数据类型: `receiptTypeItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rtiid` | 单据ID | Long |
| `rtid` | 收据类型ID | Long |
| `no` | 编号 | String |
| `name` | 单据名 | String |
| `bustype` | 类型 , 0: 预付 | Short |
| `paytype` | 款项类型 , 0: 收款 , 1: 退款 | Short |


##### `查询` queryReceiptTypeItem

查询单据信息

**Requests:**

- `receiptTypeItem.rtid` (Long): ID

```json
{
    "receiptTypeItem.rtid": 1
}
```

**Returns:**

- `receiptTypeItems` (List): 单据信息列表 , 每条信息类型 `receiptTypeItem`

```json
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
```


##### `创建` addReceiptTypeItem

添加单据信息

**Requests:**

- `receiptTypeItem.rtid` (Long): ID
- `receiptTypeItem.no` (Long): 编号
- `receiptTypeItem.name` (Long): 名称
- `receiptTypeItem.type` (Long): 类型

```json
{
    "receiptTypeItem.rtid": 1,
    "receiptTypeItem.no": "DJFIJ3I2J23HJ",
    "receiptTypeItem.name": "单据名称",
    "receiptTypeItem.rtid": 1,
}
```


##### `创建` deleteReceiptTypeItem

删除单据信息

**Requests:**

- `receiptTypeItem.rtiid` (Long): ID

```json
{
    "receiptTypeItem.rtiid": 1
}
```

### 款项比例


款项比例信息 , 生成装修款按照该比例进行


> **类**: `api.data.PaymentScaleAction`


#### 数据类型: `paymentScale`

| 参数 | 说明 | 类型 |
|------|------|------|
| `psid` | ID | Long |
| `cid` | 公司ID | String |
| `name` | 名称 | String |
| `typeness` | 业务类型 | Short |
| `dbid` | 业务类型 | Long |
| `atttype` | 业务类型 , 1: 合同 , 3: 其他 | Short |
| `status` | 状态 | Short |
| `comment` | 说明 | String |


#### 数据类型: `paymentScaleItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `psiid` | ID | Long |
| `psid` | 款项比例ID | Long |
| `ptid` | 款项类型ID | Long |
| `name` | 款项名 | String |
| `scale` | 比例 | Short |
| `sort` | 排序 | Short |


##### `查询` queryPaymentScale

通过公司ID获取款项比例信息

**Requests:**

- `paymentScale.cid` (String): 公司ID

```json
{
    "paymentScale.cid": 1
}
```

**Returns:**

- `paymentScales` (List): 款项比例列表 , 每条数据类型 `paymentScale`

```json
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
```


##### `查询` queryPaymentScaleItemByPsid

通过款项比例ID获取款项比例项信息

**Requests:**

- `paymentScaleItem.psid` (String): 公司ID

```json
{
    "paymentScaleItem.psid": 1
}
```

**Returns:**

- `paymentScaleItems` (List): 款项比例项列表 , 每条数据类型 `paymentScaleItem`

```json
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
```


##### `查询` addPaymentScale

添加款项比例, 关联公司

**Requests:**

- `paymentScale.cid` (String): 公司ID
- `paymentScale.name` (String): 名称
- `paymentScale.comment` (String): 说明

```json
{
    "paymentScale.name": "半包",
    "paymentScale.comment": 0.4
}
```


##### `查询` addPaymentScaleItem

添加款项比例项信息

**Requests:**

- `paymentScaleitem.psid` (Long): 款项比例ID
- `paymentScaleitem.ptid` (Long): 款项类型ID
- `paymentScaleitem.name` (String): 名称
- `paymentScaleitem.scale` (Short): 比例
- `paymentScaleItem.sort` (Short): 排序

```json
{
    "paymentScaleitem.psid": 1,
    "paymentScaleitem.ptid": 1,
    "paymentScaleitem.name": "半包",
    "paymentScaleitem.scale": 30,
    "paymentScaleitem.sort": 1
}
```


##### `查询` updatePaymentScaleForStatus

更新款项比例状态

**Requests:**

- `paymentScale.psid` (Long): 款项比例ID
- `paymentScale.status` (Short): 状态

```json
{
    "paymentScale.psid": 1,
    "paymentScale.status": 1
}
```


##### `查询` deletePaymentScale

删除款项比例信息

删除款项比例关联的款项比例项信息

**Requests:**

- `paymentScale.psid` (Long): 款项比例ID

```json
{
    "paymentScale.psid": 1
}
```


##### `查询` deletePaymentScaleItem

删除款项比例项

**Requests:**

- `paymentScaleItem.psiid` (Long): 款项比例项ID

```json
{
    "paymentScaleItem.psiid": 1
}
```

### 商户类型


> **类**: `api.data.CustypeAction`


#### 数据类型: `custype`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ctid` | ID | Long |
| `name` | 名称 | String |
| `no` | 商户号 | String |
| `agent` | 机构号 | String |
| `phone` | 电话 | String |
| `wxapp` | 微信APPID | String |
| `receiptType` | 收据类型 , 类型 [receiptType ](./data.html#api.communion.ReceiptTypeAction.receiptType) | Object |
| `platform` | 支付平台 , 0: pospay(POS机) , 1: wxpay(微信) , 2: alipay(支付宝) | Short |
| `atttype` | 业务类型 , 0: 预付 , 1: 装修 , 2: 主材 , 3: 销售 , 4: 服务 | Short |
| `dgrade` | 装修等级 | String |
| `sgrade` | 销售等级 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


##### `查询` pageCustype

分页方式获取商户类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 商户类型信息列表 , 每条数据类型 `custype`

```json
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
```


##### `查询` queryCustype

查询商户类型

**Requests:**

- `custype.attype` (Short): 业务类型
- `custype.dgrade` (String): 装修等级
- `custype.sgrade` (String): 销售等级

```json
{
    "custype.atttype": 0,
    "custype.dgrade": ""
    "custype.sgrade": ""
}
```

**Returns:**

- `custypes` (List): 商户类型信息列表 , 每条数据类型 `custype`

```json
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
```


##### `创建` addCustype

添加商户类型

**Requests:**

- `custype.name` (String): 名称
- `custype.no` (String): 商户号
- `custype.agent` (String): 机构号
- `custype.wxapp` (String): 微信APPID
- `custype.platform` (Short): 支付平台
- `custype.attype` (Short): 业务类型
- `custype.dgrade` (String): 装修等级
- `custype.sgrade` (String): 销售等级
- `custype.receiptType.rtid` (Long): 收据类型ID

```json
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
```


##### `创建` updateCustype

更新商户类型

判断商户类型是否存在 , 不存在 , 错误信息 **130105 商户不存在**

**Requests:**

- `custype.ctid` (Long): ID
- `custype.name` (String): 名称
- `custype.no` (String): 商户号
- `custype.agent` (String): 机构号
- `custype.wxapp` (String): 微信APPID
- `custype.platform` (Short): 支付平台
- `custype.attype` (Short): 业务类型
- `custype.dgrade` (String): 装修等级
- `custype.sgrade` (String): 销售等级
- `custype.status` (Short): 状态
- `custype.receiptType.rtid` (Long): 收据类型ID

```json
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
```

## 报价


### 类型

报价类型信息管理


> **类**: `api.data.QuotationTypeAction`


#### 数据类型: `quotationType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qtid` | 类型ID | Long |
| `name` | 名称 | String |


##### `查询` pageQuotationType

分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价类型信息列表 , 每条数据类型 `quotationType`

```json
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
```


##### `查询` queryQuotationType

获取所有报价类型信息

**Returns:**

- `quotationTypes` (List): 报价类型信息列表 , 每条数据类型 `quotationType`

```json
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
```

### 分类

报价分类信息管理


> **类**: `api.data.QuotationClassificationAction`


#### 数据类型: `quotationClassification`

| 参数 | 说明 | 类型 |
|------|------|------|
| `id` | ID | Long |
| `name` | 名称 | String |


##### `查询` pageQuotationClassification

分页方式获取报分类信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价分类信息列表 , 每条数据类型 `quotationClassification`

```json
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
```


##### `查询` queryQuotationClassification

获取所有报价分类信息

**Returns:**

- `quotationClassifications` (List): 报价分类信息列表 , 每条数据类型 `quotationClassification`

```json
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
```

### 大类

报价大类信息管理


> **类**: `api.data.QuotationBigCategoryAction`


#### 数据类型: `quotationBigCategory`

| 参数 | 说明 | 类型 |
|------|------|------|
| `id` | ID | Long |
| `name` | 名称 | String |
| `qtid` | 类型ID | Long |


##### `查询` pageQuotationBigCategory

分页方式获取报大类信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价分类信息列表 , 每条数据类型 `quotationBigCategory`

```json
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
```


##### `查询` queryQuotationBigCategory

获取所有报价大类信息

**Requests:**

- `quotationBigCategory.qtid` (Long): 类型

```json
{
    "quotationBigCategory.qtid": 1
}
```

**Returns:**

- `quotationBigCategorys` (List): 报价大类信息列表 , 每条数据类型 `quotationBigCategory`

```json
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
```

### 小类

报价小类信息管理


> **类**: `api.data.QuotationSmallCategoryAction`


#### 数据类型: `quotationSmallCategory`

| 参数 | 说明 | 类型 |
|------|------|------|
| `id` | ID | Long |
| `name` | 名称 | String |
| `qtid` | 类型ID | Long |


##### `查询` pageQuotationSmallCategory

分页方式获取报小类信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价小类信息列表 , 每条数据类型 `quotationSmallCategory`

```json
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
```


##### `查询` queryQuotationSmallCategory

获取所有报价小类信息

**Requests:**

- `quotationSmallCategory.qtid` (Long): 类型

```json
{
    "quotationSmallCategory.qtid": 1
}
```

**Returns:**

- `quotationSmallCategorys` (List): 报价小类信息列表 , 每条数据类型 `quotationSmallCategory`

```json
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
```

### 版本

报价版本信息管理


> **类**: `api.data.QuotationVersionAction`


#### 数据类型: `quotationVersion`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qvid` | 报价版本ID | Long |
| `no` | 编号 | String |
| `name` | 版本名称 | String |
| `defaultFlag` | 默认标识 , 0: 非默认版本 , 1: 默认报价版本 , 表示当前系统报价默认使用报价版本 , 并作为报价项选择条件 , 系统有且仅有一个默认报价版本 | Short |
| `undisDiscount` | 不打折折扣 , 0: 不打折 , 1: 打折 | Short |
| `trafficRate` | 车运费比例 | Integer |
| `trafficDiscount` | 车运费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣 | Short |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理费折扣 , 0: 不打折 , 1: 基数折扣 , 2: 独立折扣 | Short |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 , 0: 管理税金 , 1: 总价税金 | Short |
| `offset` | 偏移量 | Integer |
| `type` | 类型 , 0: 半包 , 装修单 , 不包括主材单 , 1: 整装 , 装修+主材单 , 2: 满减 , 主材配比 , 装修打折 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `comment` | 说明 | String |
| `company` | 公司ID | Integer |


:param name: 版本名称
:type name: String


##### `查询` pageQuotationVersion

分页方式获取报价爱版本信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 大区信息列表 , 每条数据类型 `region`

```json
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
```


##### `查询` queryQuotationVersion

获取所有报价版本信息

**Returns:**

- `quotationVersions` (List): 报价版本信息列表 , 每条数据类型 `quotationVersion`

```json
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
```


##### `查询` queryQuotationVersionByVersionId

通过报价版本编号查询版本信息

**Requests:**

- `quotationVersion.no` (String): 版本编号

```json
{
    "quotationVersion.no": "QV002"
}
```

**Returns:**

- `quotationVersion` (Object): 报价版本信息 , 类型 `quotationVersion`

```json
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
```


##### `查询` addQuotationVersion

添加报价版本信息

**Requests:**

- `quotationVersion.name` (String): 版本名称
- `quotationVersion.undisDiscount` (Short): 不打折折扣
- `quotationVersion.trafficRate` (Integer): 车运费比例
- `quotationVersion.trafficDiscount` (Short): 车运费折扣
- `quotationVersion.manageRate` (Integer): 管理费比例
- `quotationVersion.manageDiscount` (Short): 管理费折扣
- `quotationVersion.taxRate` (Integer): 税金比例
- `quotationVersion.taxDiscount` (Short): 税金折扣
- `quotationVersion.type` (Short): 类型
- `quotationVersion.comment` (String): 说明

```json
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
```


##### `查询` updateQuotationVersion

更新报价版本信息

判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**Requests:**

- `quotationVersion.no` (String): 版本编号
- `quotationVersion.name` (String): 版本名称
- `quotationVersion.undisDiscount` (Short): 不打折折扣
- `quotationVersion.trafficRate` (Integer): 车运费比例
- `quotationVersion.trafficDiscount` (Short): 车运费折扣
- `quotationVersion.manageRate` (Integer): 管理费比例
- `quotationVersion.manageDiscount` (Short): 车运费折扣
- `quotationVersion.taxRate` (Integer): 税金比例
- `quotationVersion.taxDiscount` (Short): 税金折扣
- `quotationVersion.offset` (Integer): 偏移量
- `quotationVersion.type` (Short): 类型
- `quotationVersion.comment` (String): 说明

```json
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
```


##### `查询` updateQuotationVersionForDefault

更新默认报价

判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**Requests:**

- `quotationVersion.qvid` (Long): 版本ID
- `quotationVersion.defaultFlag` (Short): 默认标识

```json
{
    "qvid": 1,
    "defaultFlag": 0
}
```


##### `查询` updateQuotationVersionForStatus

更新状态

判断报价版本是否存在 , 不存在 , 错误信息 **200022 报价版本不存在**

**Requests:**

- `quotationVersion.qvid` (Long): 版本ID
- `quotationVersion.status` (Short): 状态

```json
{
    "qvid": 1,
    "status": 0
}
```

### 共享项


> **类**: `api.data.QuotationCtemAction`


#### 数据类型: `quotationCtem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qcid` | 项目ID | Long |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `type` | 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩 | Short |
| `category` | 类型 , 类型 [quotationType ](./data.html#api.data.QuotationTypeAction.quotationType) | Object |
| `classification` | 类别 , 类型 [quotationClassification ](./data.html#api.data.QuotationClassificationAction.quotationClassification) | Object |
| `bigCategory` | 大类 , 类型 [quotationBigCategory ](./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory) | Object |
| `smallCategory` | 小类 , 类型 [quotationSmallCategory ](./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory) | Object |
| `unit` | 单位 , 类型 [measurementUnit ](./data.html#api.communion.MeasurementUnitAction.measurementUnit) | Object |
| `workType` | 工种 , 类型 [workType ](./data.html#api.communion.WorkTypeAction.workType) | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageQuotationCtem

分页方式获取报价项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quotationCtem`

```json
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
```


##### `查询` queryQuotationCtem

查询共享项信息

**Requests:**

- `quotationCtem.pinyin` (String): 拼音

```json
{
    "quotationCtem.pinyin": "pinyin",
}
```

**Returns:**

- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quotationCtem`

```json
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
```


##### `查询` addQuotationCtem

添加共享项

**Requests:**

- `quotationCtem.name` (String): 名称
- `quotationCtem.type` (Short): 类型
- `quotationCtem.category.qtid` (Long): 报价类型ID
- `quotationCtem.classification.qcid` (Long): 报价类别ID
- `quotationCtem.bigCategory.qbcid` (Long): 报价大类ID
- `quotationCtem.smallCategory.qscid` (Long): 报价小类ID

```json
{
    "quotationCtem.name": "名称",
    "quotationCtem.type": 1,
    "quotationCtem.category.qtid": 1,
    "quotationCtem.classification.qcid": 1,
    "quotationCtem.bigCategory.qbcid": 1,
    "quotationCtem.smallCategory.qscid": 11
}
```


##### `查询` updateQuotationCtem

更新共享项

**Requests:**

- `quotationCtem.qcid` (Long): 共享项ID
- `quotationCtem.name` (String): 名称
- `quotationCtem.type` (Short): 类型
- `quotationCtem.category.qtid` (Long): 报价类型ID
- `quotationCtem.classification.qcid` (Long): 报价类别ID
- `quotationCtem.bigCategory.qbcid` (Long): 报价大类ID
- `quotationCtem.smallCategory.qscid` (Long): 报价小类ID

```json
{
    "quotationCtem.qcid": 1,
    "quotationCtem.name": "名称",
    "quotationCtem.type": 1,
    "quotationCtem.category.qtid": 1,
    "quotationCtem.classification.qcid": 1,
    "quotationCtem.bigCategory.qbcid": 1,
    "quotationCtem.smallCategory.qscid": 11
}
```


##### `查询` updateQuotationCtemForStatus

更新共享项状态

**Requests:**

- `quotationCtem.qcid` (Long): 项目ID
- `quotationCtem.status` (Short): 状态

```json
{
    "quotationCtem.qcid": 1,
    "quotationCtem.status": 1
}
```


> **类**: `api.data.QuotationFormatAction`


#### 数据类型: `quotationFormat`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfid` | 规格ID | Long |
| `qcid` | 项目ID | Long |
| `name` | 名称 | String |
| `format` | 规格 | String |
| `pinyin` | 拼音 | String |
| `price` | 价格 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` queryQuotationFormat

通过名称/拼音获取规格信息

**Requests:**

- `quotationFormat.name` (Long): 项目ID

```json
{
    "quotationFormat.name": 1,
}
```

**Returns:**

- `quotationFormats` (List): 规格信息列表 , 每条数据类型 `quotationFormat`

```json
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
```


##### `查询` queryQuotationFormatByQcid

通过项目获取规格信息

**Requests:**

- `quotationFormat.qcid` (Long): 项目ID

```json
{
    "quotationFormat.qcid": 1,
}
```

**Returns:**

- `quotationFormats` (List): 规格信息列表 , 每条数据类型 `quotationFormat`

```json
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
```


##### `查询` addQuotationFormat

添加规格

**Requests:**

- `quotationFormat.qcid` (Long): 项目ID
- `quotationFormat.format` (String): 规格

```json
{
    "quotationFormat.qcid": 1,
    "quotationFormat.format": "规格"
}
```


##### `查询` updateQuotationFormat

更新规格

**Requests:**

- `quotationFormat.qfid` (Long): 规格ID
- `quotationFormat.format` (String): 规格

```json
{
    "quotationFormat.qfid": 1,
    "quotationFormat.format": "规格"
}
```


##### `查询` updateQuotationFormatForStatus

更新规格状态

**Requests:**

- `quotationFormat.qfid` (Long): 规格ID
- `quotationFormat.status` (Short): 状态

```json
{
    "quotationFormat.qfid": 1,
    "quotationFormat.status": 1
}
```


##### `查询` deleteQuotationFormat

删除规格

**Requests:**

- `quotationFormat.qfid` (Long): 规格ID

```json
{
    "quotationFormat.qfid": 1
}
```

### 报价项

报价项信息管理 , 报价项归属于一个报价版本 , 通过报价版本的控制来完成报价项的使用 .


> **类**: `api.data.QuotationItemAction`


#### 数据类型: `quotationItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qiid` | 报价项ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `alias` | 别名 | String |
| `version` | 版本 , 类型  [quotationVersion ](./data.html#api.data.QuotationVersionAction.quotationVersion) | Object |
| `category` | 类型 , 类型 [quotationType ](./data.html#api.data.QuotationTypeAction.quotationType) | Object |
| `classification` | 类别 , 类型 [quotationClassification ](./data.html#api.data.QuotationClassificationAction.quotationClassification) | Object |
| `bigCategory` | 大类 , 类型 [quotationBigCategory ](./data.html#api.data.QuotationBigCategoryAction.quotationBigCategory) | Object |
| `smallCategory` | 小类 , 类型 [quotationSmallCategory ](./data.html#api.data.QuotationSmallCategoryAction.quotationSmallCategory) | Object |
| `unit` | 单位 , 类型 [measurementUnit ](./data.html#api.communion.MeasurementUnitAction.measurementUnit) | Object |
| `workType` | 工种 , 类型 [workType ](./data.html#api.communion.WorkTypeAction.workType) | String |
| `addPrice` | 增补价 | Integer |
| `unitPrice` | 单价 | Integer |
| `subPrice` | 退减价 | Integer |
| `cost` | 成本 | Integer |
| `achePrice` | 业绩额 | Integer |
| `type` | 类型 , 0: 标准 , 1: 成本 , 2: 自定义(隐藏) , 3: 不计总额(隐藏) , 4: 非业绩 | Short |
| `status` | 状态 , 0: 禁用 , 1: 启用 | Short |
| `discount` | 折扣标识 , 0: 不打折 , 1: 打折 | Short |
| `formula` | 公式 | String |
| `offset` | 偏移量 , 用于计算编号使用 | Integer |
| `comment` | 说明 | String |


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


##### `查询` pageQuotationItem

分页方式获取报价项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quotationItem`

```json
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
```


##### `查询` pageQuotationItemByVersionId

分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用

**Requests:**

- `quotationItem.version.no` (String): 报价版本编号

```json
{
    "quotationItem.version.no": "QV001",
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quotationItem`

```json
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
```


##### `查询` queryQuotationItemByItemIdAVersionId

通过版本编号以及报价项编号查询报价项信息

**Requests:**

- `quotationItem.version.no` (String): 报价版本编号
- `quotationItem.no` (String): 报价项编号

```json
{
    "quotationItem.version.no": "QV001",
    "quotationItem.no": "QI00100"
}
```

**Returns:**

- `quotationItem` (Object): 报价项信息 , 类型 `quotationItem`

```json
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
```


##### `查询` pageQuotationItemForPrice

分页方式获取报价项信息 , 同时通过报价版本编号获取报价项信息 , 报价项状态为启用

**Requests:**

- `quotationItem.version.no` (String): 报价版本编号
- `quotationPrice.updateTime` (Timestamp): 更新时间

```json
{
    "quotationItem.version.no": "QV001",
    "quotationItem.updateTime": "2016-01-01 00:00:00",
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quotationItem`

```json
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
```


##### `查询` queryQuotationItemByQiid

通过报价项ID查询信息

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID

```json
{
    "quotationItem.qiid": 1
}
```

**Returns:**

- `quotationItem` (Object): 报价项信息 , 类型 `quotationItem`

```json
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
```


##### `查询` addQuotationItem

添加报价项信息

**Requests:**

- `quotationItem.no` (String): 编号
- `quotationItem.name` (String): 名称
- `quotationItem.addPrice` (Integer): 增补价
- `quotationItem.unitPrice` (Integer): 单价
- `quotationItem.subPrice` (Integer): 退减价
- `quotationItem.version.no` (String): 报价版本编号
- `quotationItem.category.qtid` (Long): 报价类型ID
- `quotationItem.classification.qcid` (Long): 报价类别ID
- `quotationItem.bigCategory.qbcid` (Long): 报价大类ID
- `quotationItem.smallCategory.qscid` (Long): 报价小类ID
- `quotationItem.unit.muid` (Long): 单位ID
- `quotationItem.workType.wtid` (Long): 工种ID
- `quotationItem.comment` (String): 说明

```json
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
```


##### `查询` updateQuotationItem

更新报价项信息

判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID
- `quotationItem.name` (String): 名称
- `quotationItem.addPrice` (Integer): 增补价
- `quotationItem.unitPrice` (Integer): 单价
- `quotationItem.subPrice` (Integer): 退减价
- `quotationItem.category.qtid` (Long): 报价类型ID
- `quotationItem.classification.qcid` (Long): 报价类别ID
- `quotationItem.bigCategory.qbcid` (Long): 报价大类ID
- `quotationItem.smallCategory.qscid` (Long): 报价小类ID
- `quotationItem.unit.muid` (Long): 单位ID
- `quotationItem.workType.wtid` (Long): 工种ID
- `quotationItem.comment` (String): 说明

```json
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
```


##### `查询` updateQuotationItemForStatus

更新报价项中状态信息 , 控制报价项启用禁用状态

判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID
- `quotationItem.status` (Short): 状态 , 0: 禁用 , 1: 启用

```json
{
    "quotationItem.qiid": 1,
    "quotationItem.status": 1,
}
```


##### `查询` updateQuotationItemForDiscount

更新报价项中折扣标识 , 控制报价项是否打折状态

判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID
- `quotationItem.discount` (Short): 折扣标识 , 0: 不打折 , 1: 打折

```json
{
    "quotationItem.qiid": 1,
    "quotationItem.discount": 1
}
```


##### `查询` updateQuotationItemForFormula

更新报价项中公式信息

判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID
- `quotationItem.formula` (String): 公式

```json
{
    "quotationItem.qiid": 1,
    "quotationItem.formula": ""
}
```


##### `查询` updateQuotationItemForCost

更新报价项中成本金额

判断报价项是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotationItem.qiid` (Long): 报价项ID
- `quotationItem.alias` (String): 别名
- `quotationItem.cost` (Integer): 成本
- `quotationItem.achePrice` (Integer): 业绩额

```json
{
    "quotationItem.qiid": 1,
    "quotationItem.alias": "",
    "quotationItem.cost": 0,
    "quotationItem.achePrice": 0
}
```

### 定义项

定义项 , 系统级自定义项目 , 提供订单制作减项过程使用


> **类**: `api.data.SystemDefineItemAction`


#### 数据类型: `systemDefineItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sdiid` | 定义项目ID | Long |
| `itemId` | 定义项目编号 | String |
| `quotationBigno` | 报价大类ID | Long |
| `quotationBigCategory` | 报价大类 | String |
| `itemName` | 项目名称 | String |
| `measurementUnitId` | 单位ID | Long |
| `measurementUnit` | 单位 | String |
| `itemWorkTypeId` | 工种ID | Long |
| `itemWorkType` | 工种 | String |
| `quotationItemDes` | 项目说明 | String |
| `unitPrice` | 单价 | Integer |
| `status` | 状态 , 0: 禁用 , 1: 启用 | Short |
| `discount` | 折扣标识 , 0: 不打折 , 1: 打折 | Short |
| `company` | 公司ID | Long |


:param itemName: 项目名称
:type itemName: String
:param quotationBigno: 报价大类ID
:type quotationBigno: Long
:param quotationWorkTypeId: 工种ID
:type quotationWorkTypeId: Long


##### `查询` pageSystemDefineItem

分页方式获取定义项目信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 定义项目信息列表 , 每条数据类型 `systemDefineItem`

```json
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
```


##### `查询` pageSystemDefineItemForEnable

分页方式获取开启状态的定义项目信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 定义项目信息列表 , 每条数据类型 `systemDefineItem`

```json
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
```


##### `查询` querySystemDefineItemByItemId

通过定义项目编号获取定义项目信息

**Requests:**

- `systemDefineItem.itemId` (String): 项目编号

```json
{
    "systemDefineItem.itemId": "SI00001"
}
```

**Returns:**

- `systemDefineItem` (object): 定义项目信息 , 类型 `systemDefineItem`

```json
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
```


##### `查询` addSystemDefineItem

添加定义项目信息

**Requests:**

- `systemDefineItem.itemId` (String): 项目编号
- `systemDefineItem.itemName` (String): 项目名称
- `systemDefineItem.unitPrice` (String): 单价
- `systemDefineItem.quotationItemDes` (String): 项目说明
- `systemDefineItem.itemWorkTypeId` (Long): 工种ID
- `systemDefineItem.measurementUnitId` (Long): 单位ID
- `systemDefineItem.quotationBigno` (Long): 报价大类ID

```json
{
    "systemDefineItem.itemId": "SI_00002",
    "systemDefineItem.itemName": "test",
    "systemDefineItem.unitPrice": 100,
    "systemDefineItem.quotationItemDes": "111",
    "systemDefineItem.itemWorkTypeId": 1,
    "systemDefineItem.measurementUnitId": 1,
    "systemDefineItem.quotationBigno": 1
}
```


##### `查询` updateSystemDefineItem

更新定义项目信息

**Requests:**

- `systemDefineItem.sdiid` (Long): 定义项目ID
- `systemDefineItem.itemName` (String): 项目名称
- `systemDefineItem.unitPrice` (String): 单价
- `systemDefineItem.quotationItemDes` (String): 项目说明
- `systemDefineItem.itemWorkTypeId` (Long): 工种ID
- `systemDefineItem.measurementUnitId` (Long): 单位ID
- `systemDefineItem.quotationBigno` (Long): 报价大类ID

```json
{
    "systemDefineItem.sdiid": 1,
    "systemDefineItem.itemName": "test",
    "systemDefineItem.unitPrice": 100,
    "systemDefineItem.quotationItemDes": "111",
    "systemDefineItem.itemWorkTypeId": 1,
    "systemDefineItem.measurementUnitId": 1,
    "systemDefineItem.quotationBigno": 1
}
```


##### `查询` updateSystemDefineItemForStatus

更新定义项目中状态信息 , 控制定义项目启用禁用状态

**Requests:**

- `systemDefineItem.sdiid` (Long): 定义项目ID
- `systemDefineItem.status` (Short): 状态 , 0: 禁用 , 1: 启用

```json
{
    "systemDefineItem.sdiid": 1,
    "systemDefineItem.status": 1
}
```


##### `查询` updateSystemDefineItemForDiscount

更新定义项目中折扣标识信息 , 控制定义项目是否可以打折

**Requests:**

- `systemDefineItem.sdiid` (Long): 定义项目ID
- `systemDefineItem.discount` (Short): 折扣标识 , 0: 不打折 , 1: 打折

```json
{
    "systemDefineItem.sdiid": 1,
    "systemDefineItem.discount": 1
}
```


##### `查询` deleteSystemDefineItem

通过定义项目ID列表信息批量删除定义项目信息

**Requests:**

- `systemDefineItem.sdiid` (Long): 定义项目ID

```json
{
    "systemDefineItem.sdiid": 1
}
```

### 功能区

功能区信息管理


> **类**: `api.data.FunctionAreaAction`


#### 数据类型: `functionArea`

| 参数 | 说明 | 类型 |
|------|------|------|
| `faId` | 功能区ID | Long |
| `functionAreaId` | 功能区编号 | String |
| `functionAreaName` | 功能区名称 | String |
| `functionAreaOrder` | 排序 | Integer |
| `functionAreaType` | 类型 , 分为: 标准 , 一次性包死 , 综合项目 | String |
| `no` | 版本编号 | String |
| `version` | 版本名称 | String |
| `type` | 类型 , 分为: 0(管理), 1(工程量), 2(总额), 3(不计算), 4(成本), 5(非业绩) | Short |
| `total` | 总额 , 当类型为2(功能区总额)时 , 可以按照功能区总价计算 | Long |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司ID | Long |


:param no: 报价版本编号
:type no: String


##### `查询` pageFunctionArea

分页方式获取功能区信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 功能区信息列表 , 每条数据类型 `functionArea`

```json
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
```


##### `查询` queryFunctionAreaByIdAVersionId

通过功能区编号以及报价版本获取功能区信息

**Requests:**

- `functionArea.functionAreaId` (String): 功能区编号
- `functionArea.no` (String): 版本编号

```json
{
    "functionArea.functionAreaId": "D001",
    "functionArea.no": "QV001"
}
```

**Returns:**

- `functionArea` (object): 功能区信息 , 类型 `functionArea`

```json
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
```


##### `查询` queryFunctionAreaByVersionId

通过报价版本获取功能区信息

**Requests:**

- `functionArea.no` (String): 版本编号

```json
{
    "functionArea.no": "QV001"
}
```

**Returns:**

- `functionAreas` (List): 功能区信息列表 , 每条数据类型 `functionArea`

```json
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
```


##### `查询` addFunctionArea

添加功能区信息

**Requests:**

- `functionArea.functionAreaName` (String): 功能区名称
- `functionArea.functionAreaOrder` (Integer): 排序
- `functionArea.functionAreaType` (String): 类型 , 分为: 标准 , 一次性包死 , 综合项目
- `functionArea.no` (String): 报价版本编号
- `functionArea.type` (Short): 类型
- `functionArea.total` (Long): 总额

```json
{
    "functionArea.functionAreaName": "标准",
    "functionArea.functionAreaOrder": 1,
    "functionArea.functionAreaType": "标准",
    "functionArea.no": "QV001",
    "functionArea.type": 1,
    "functionArea.total": 0
}
```


##### `查询` updateFunctionArea

更新功能区信息

**Requests:**

- `functionArea.faId` (Integer): 功能区ID
- `functionArea.functionAreaName` (String): 功能区名称
- `functionArea.functionAreaOrder` (Integer): 排序
- `functionArea.functionAreaType` (String,): 类型 , 分为: 标准 , 一次性包死 , 综合项目
- `functionArea.type` (Short): 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算)
- `functionArea.total` (Long): 总额

```json
{
    "functionArea.faId": 1,
    "functionArea.functionAreaName": "标准",
    "functionArea.functionAreaOrder": 1,
    "functionArea.functionAreaType": "标准",
    "functionArea.type": 1,
    "functionArea.total": 0
}
```


##### `查询` deleteFunctionArea

通过功能区ID批量删除功能区信息

**Requests:**

- `ids` (List): 功能区ID列表 , 每条数据类型 Integer

```json
{
    "ids[0]": 1,
    "ids[1]": 2
}
```

### 功能区-报价项

功能区中包含的报价项信息 , 提供归属报价的相关操作


> **类**: `api.data.FunctionAreaItemAction`


#### 数据类型: `functionAreaItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `faiId` | 所属报价项ID | Long |
| `functionArea` | 功能区信息 , 类型 [functionArea ](./data.html#api.data.FunctionAreaAction.functionArea) | Object |
| `quotationItem` | 报价项信息 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |
| `formula` | 公式 | String |
| `sort` | 排序 | Integer |


##### `查询` queryFunctionAreaItemByFunctionAreaId

通过功能区ID获取功能区包含的报价项信息

**Requests:**

- `functionAreaItem.faId` (Long): 功能区ID

```json
{
    "functionAreaItem.faId": 1
}
```

**Returns:**

- `functionAreaItems` (List): 报价项信息列表 , 每条数据类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem)

```json
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
```


##### `查询` addFunctionAreaItem

向功能区中添加报价项信息

**Requests:**


```json
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
```


##### `查询` updateFunctionAreaItem

更新功能区中报价项

**Requests:**

- `functionAreaItem.faiId` (Long): ID
- `functionAreaItem.formula` (String): 公式

```json
{
    "functionAreaItem.faiId": 1,
    "functionAreaItem.formula": "a*b+c"
}
```


##### `查询` updateFunctionAreaItemForSort

更新功能区中报价项排序

**Requests:**


```json
{
    "functionAreaItems[0].faiid": 1,
    "functionAreaItems[0].sort": 0,
    "functionAreaItems[1].faiid": 1,
    "functionAreaItems[1].sort": 1
}
```


##### `查询` deleteFunctionAreaItemByIds

通过功能区包含报价项ID删除报价项信息

**Requests:**

- `ids` (List): 功能区包含报价项ID列表 , 每条数据类型 Long

```json
{
    "ids[0]": 1,
    "ids[1]": 2
}
```

### 价格


> **类**: `api.data.QuotationPriceAction`


#### 数据类型: `quotationPrice`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qpid` | 价格ID | Long |
| `quotationItem` | 报价项信息 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |
| `addPrice` | 增补价 | Integer |
| `unitPrice` | 单价 | Integer |
| `subPrice` | 退减价 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageQuotationPrice

分页方式获取报价价格信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 报价价格信息列表 , 每条数据类型 `quotationPrice`

```json
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
```


##### `查询` queryQuotationPrice

通过报价项获取价格信息

**Requests:**

- `quotationPrice.quotationItem.qiid` (Long): 报价项ID
- `quotationPrice.updateTime` (Timestamp): 更新时间
**Returns:**

- `quotationPrices` (List): 报价价格信息 , 类型 `quotationPrice`

```json
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
```


##### `查询` addQuotationPrice

添加报价价格

**Requests:**

- `quotationPrice.quotationItem.qiid` (Long): 报价项ID
- `quotationPrice.addPrice` (Timestamp): 增补价
- `quotationPrice.unitPrice` (Timestamp): 增补价
- `quotationPrice.subPrice` (Timestamp): 退减价
- `quotationPrice.updateTime` (Timestamp): 更新时间

```json
{
    "quotationPrice.quotationItem.qiid": 1,
    "quotationPrice.addPrice": 10000000,
    "quotationPrice.unitPrice": 100000,
    "quotationPrice.subPrice": 100000,
    "quotationPrice.updateTime": "2016-01-01 00:00:00"
}
```


##### `查询` updateQuotationPrice

更新报价价格

**Requests:**

- `quotationPrice.qpid` (Long): 价格ID
- `quotationPrice.addPrice` (Timestamp): 增补价
- `quotationPrice.unitPrice` (Timestamp): 增补价
- `quotationPrice.subPrice` (Timestamp): 退减价
- `quotationPrice.updateTime` (Timestamp): 更新时间

```json
{
    "quotationPrice.qpid": 1,
    "quotationPrice.addPrice": 10000000,
    "quotationPrice.unitPrice": 100000,
    "quotationPrice.subPrice": 100000,
    "quotationPrice.updateTime": "2016-01-01 00:00:00"
}
```


##### `查询` deleteQuotationPrice

删除报价价格

**Requests:**

- `quotationPrice.qpid` (Long): 价格ID

```json
{
    "quotationPrice.qpid": 1
}
```

## 预签


### 产品


> **类**: `api.data.PresignProduceAction`


#### 数据类型: `presignProduce`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppid` | 预签产品ID | Long |
| `name` | 名称 | String |
| `version` | 报价版本 , 类型 [quotationVersion ](./data.html#api.data.QuotationVersionAction.quotationVersion) | Object |
| `quotePrice` | 起报价 | Long |
| `quoteArea` | 起报面积 | Integer |
| `unitPrice` | 计价单价 | Long |
| `discount` | 折扣 | Integer |
| `discountt` | 二级折扣 | Integer |
| `manageRate` | 管理费比例 | Integer |
| `manageFormula` | 管理费公式 | String |
| `manageDiscount` | 管理费折扣 | Integer |
| `manageDiscountt` | 管理费折扣 | Integer |
| `preferPrice` | 优惠额 | Long |
| `costPrice` | 成本单价 | Long |
| `mostPrice` | 主材成本 | Long |
| `profitRate` | 利润率 | Integer |
| `costRate` | 工程增项成本比例 | Integer |
| `mostRate` | 主材增项成本比例 | Integer |
| `offset` | 偏移量 | Long |
| `status` | 状态 , 0: 初始 , 1: 发布 | Short |
| `company` | 公司 | Integer |


##### `查询` pagePresignProduce

分页方式获取预签产品信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 预签产品信息列表 , 每条数据类型 `presignProduce`

```json
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
```


##### `查询` queryPresignProduce

获取预签产品信息 , 状态为1(发布)

**Returns:**

- `presignProduces` (List): 预签产品列表 , 每条数据类型 `presignProduce`

```json
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
```


##### `查询` queryPresignProduceByPpid

通过预签产品ID获取信息

**Returns:**

- `presignProduce` (Object): 预签产品信息 , 类型 `presignProduce`

```json
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
```


##### `查询` addPresignProduce

添加预签产品

**Requests:**

- `presignProduce.name` (String): 名称
- `presignProduce.version.qvid` (Long): 报价版本ID
- `presignProduce.quotePrice` (Long): 起报价
- `presignProduce.quoteArea` (Integer): 起报面积
- `presignProduce.unitPrice` (Long): 计价单价
- `presignProduce.discount` (Integer): 折扣
- `presignProduce.manageRate` (Integer): 管理费比例
- `presignProduce.manageFormula` (String): 管理费公式
- `presignProduce.preferPrice` (Long): 优惠额
- `presignProduce.costPrice` (Long): 成本单价
- `presignProduce.mostPrice` (Long): 主材成本
- `presignProduce.profitRate` (Integer): 利润率
- `presignProduce.costRate` (Integer): 工程增项成本比例
- `presignProduce.mostRate` (Integer): 主材增项成本比例
- `presignProduce.offset` (Long): 偏移量

```json
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
```


##### `查询` updatePresignProduce

更新预签产品

判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

判断预签产品状态为0(初始) , 其他状态 , 错误信息 **130081 预签产品不可操作**

**Requests:**

- `presignProduce.ppid` (Long): 预签产品ID
- `presignProduce.name` (String): 名称
- `presignProduce.version.qvid` (Long): 报价版本ID
- `presignProduce.quotePrice` (Long): 起报价
- `presignProduce.quoteArea` (Integer): 起报面积
- `presignProduce.unitPrice` (Long): 计价单价
- `presignProduce.discount` (Integer): 折扣
- `presignProduce.manageRate` (Integer): 管理费比例
- `presignProduce.manageFormula` (String): 管理费公式
- `presignProduce.preferPrice` (Long): 优惠额
- `presignProduce.costPrice` (Long): 成本单价
- `presignProduce.mostPrice` (Long): 主材成本
- `presignProduce.profitRate` (Integer): 利润率
- `presignProduce.costRate` (Integer): 工程增项成本比例
- `presignProduce.mostRate` (Integer): 主材增项成本比例
- `presignProduce.offset` (Long): 偏移量

```json
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
```


##### `查询` updatePresignProduceForStatus

更新预签产品状态

判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

**Requests:**

- `presignProduce.ppid` (Long): 预签产品ID
- `presignProduce.status` (Short): 状态

```json
{
    "presignProduce.ppid": 1,
    "presignProduce.status": 0
}
```


##### `查询` copyPresignProduce

复制预签产品

判断预签产品是否存在 , 不存在 , 错误信息 **130080 预签产品不存在**

**Requests:**

- `presignProduce.ppid` (Long): 预签产品ID
- `presignProduce.name` (String): 产品名称

```json
{
    "presignProduce.ppid": 1,
    "presignProduce.name": "产品名称"
}
```

### 价格


> **类**: `api.data.PresignPriceAction`


#### 数据类型: `presignPrice`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pspid` | 价格ID | Long |
| `ppid` | 预签产品ID | Long |
| `name` | 名称 | String |
| `upperArea` | 起始面积 | Integer |
| `lowerArea` | 终止面积 | Integer |
| `price` | 价格 | Long |
| `costPrice` | 工程成本 | Integer |
| `mostPrice` | 主材成本 | Integer |
| `status` | 状态 | Short |


##### `查询` pagePresignPrice

分页方式获取预签价格信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 预签价格信息列表 , 每条数据类型 `presignPrice`

```json
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
```


##### `查询` addPresignPrice

添加预签价格

**Requests:**

- `presignPrice.ppid` (Long): 预签产品ID
- `presignPrice.name` (String): 名称
- `presignProduce.upperArea` (Long): 起报价
- `presignProduce.lowerArea` (Integer): 起报面积
- `presignProduce.price` (Long): 计价单价
- `presignProduce.costPrice` (Long): 工程成本
- `presignProduce.mostPrice` (Long): 主材成本

```json
{
    "presignProduce.ppid": 1,
    "presignProduce.name": "名称",
    "presignProduce.upperArea": 10000000,
    "presignProduce.lowerArea": 100000,
    "presignProduce.price": 100000,
    "presignProduce.costPrice": 0,
    "presignProduce.mostPrice": 0
}
```


##### `查询` updatePresignPrice

更新预签价格

**Requests:**

- `presignPrice.pspid` (Long): 预签价格ID
- `presignPrice.name` (String): 名称
- `presignProduce.upperArea` (Long): 起报价
- `presignProduce.lowerArea` (Integer): 起报面积
- `presignProduce.price` (Long): 计价单价
- `presignProduce.costPrice` (Long): 工程成本
- `presignProduce.mostPrice` (Long): 主材成本

```json
{
    "presignProduce.pspid": 1,
    "presignProduce.name": "名称",
    "presignProduce.upperArea": 10000000,
    "presignProduce.lowerArea": 100000,
    "presignProduce.price": 100000,
    "presignProduce.costPrice": 0,
    "presignProduce.mostPrice": 0
}
```


##### `查询` updatePresignPriceForStatus

更新预签价格

判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**

**Requests:**

- `presignPrice.pspid` (Long): 预签价格ID
- `presignPrice.status` (Short): 状态

```json
{
    "presignProduce.pspid": 1,
    "presignProduce.status": 0
}
```


##### `查询` deletePresignPrice

删除预签价格

判断预签价格是否存在 , 不存在 , 错误信息 **130083 预签价格不存在**

**Requests:**

- `presignPrice.pspid` (Long): 预签价格ID

```json
{
    "presignProduce.pspid": 1
}
```

### 项目


> **类**: `api.data.PresignItemAction`


#### 数据类型: `presignItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `piid` | 预签项ID | Long |
| `ppid` | 预签产品ID | Long |
| `name` | 名称 | String |
| `basicNum` | 基础量 | Integer |
| `addPrice` | 增补价 | Integer |
| `price` | 价格 | Integer |
| `subPrice` | 退减价 | Integer |
| `cost` | 成本 | Integer |
| `achePrice` | 业绩 | Integer |
| `areaCale` | 面积规则 , 0: 数量 , 1: 面积 | Short |
| `type` | 类型 , 0: 功能区 , 1: 可选配 , 2: 个性 , 3: 赋能 | Short |
| `onetype` | 一类 , 0: 标准 , 1: 标配 , 2: 标减 | Short |
| `atttype` | 业务类型 , 0: 通用 , 1: 工程 , 2: 主材 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `content` | 说明 | String |


##### `查询` pagePresignItem

分页方式获取预签项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `presignItem.ppid` (Long): 预签产品ID
- `presignItem.status` (Short): 状态
- `types` (List): 类型

```json
{
    "presignItem.ppid": 1,
    "presignItem.status": 1,

    "types[0]": 0,
    "types[1]": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 预签项列表 , 每条数据类型 `presignItem`

```json
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
```


##### `查询` queryPresignItemByPiid

通过预签项ID获取预签项信息

**Requests:**

- `presignItem.piid` (Long): 预签项ID

```json
{
    "presignItem.piid": 1
}
```

**Returns:**

- `presignItem` (Object): 预签项 , 类型 `presignItem`

```json
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
```


##### `查询` addPresignItem

添加预签项

**Requests:**

- `presignItem.ppid` (Long): 预签产品ID
- `presignItem.name` (String): 名称
- `presignItem.basicNum` (Integer): 基础量
- `presignItem.addPrice` (Integer): 增补价
- `presignItem.price` (Integer): 价格
- `presignItem.subPrice` (Integer): 退减价
- `presignItem.cost` (Integer): 成本
- `presignItem.ache` (Integer): 业绩
- `presignItem.areaCale` (Short): 面积规则
- `presignItem.type` (Short): 类型
- `presignItem.onetype` (Short): 一类
- `presignItem.atttype` (Short): 业务类型
- `presignItem.content` (String): 说明

```json
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
```


##### `查询` updatePresignItem

更新预签项

判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**

判断预签项状态为0(启用) , 其他状态 , 错误信息 **130087 预签项不可操作**

**Requests:**

- `presignItem.piid` (Long): 预签项ID
- `presignItem.name` (String): 名称
- `presignItem.basicNum` (Integer): 基础量
- `presignItem.addPrice` (Integer): 增补价
- `presignItem.price` (Integer): 价格
- `presignItem.subPrice` (Integer): 退减价
- `presignItem.cost` (Integer): 成本
- `presignItem.ache` (Integer): 业绩
- `presignItem.areaCale` (Short): 面积规则
- `presignItem.type` (Short): 类型
- `presignItem.onetype` (Short): 一类
- `presignItem.atttype` (Short): 业务类型
- `presignItem.content` (String): 说明

```json
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
```


##### `查询` updatePresignItemForStatus

更新预签项状态

判断预签项是否存在 , 不存在 , 错误信息 **130086 预签项不存在**

**Requests:**

- `presignItem.piid` (Long): 预签项ID
- `presignItem.status` (Short): 状态

```json
{
    "presignItem.piid": 1,
    "presignItem.status": 0
}
```


##### `查询` deletePresignItem

删除预签项

**Requests:**

- `presignItem.piid` (Long): 预签项ID

```json
{
    "presignItem.piid": 1
}
```

### 成本


> **类**: `api.quotation.PresignCostAction`


#### 数据类型: `presignCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pcid` | 成本ID | Long |
| `ppid` | 预签产品ID | Long |
| `toplimit` | 上限面积 | Integer |
| `lowlimit` | 下限面积 | Integer |
| `costPrice` | 成本单价 | Integer |


##### `查询` queryPresignCost

通过预签产品获取成本信息

**Requests:**

- `presignCost.ppid` (Long): 预签产品ID

```json
{
    "presignCost.ppid": 1
}
```

**Returns:**

- `presignCosts` (List): 预签成本列表 , 类型 `presignCost`

```json
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
```


##### `查询` addPresignCost

添加预签成本

**Requests:**

- `presignCost.ppid` (Long): 预签产品ID
- `presignCost.toplimit` (Integer): 上限面积
- `presignCost.lowlimit` (Integer): 下限面积
- `presignCost.costPrice` (Integer): 成本单价

```json
{
    "presignCost.ppid": 1
}
```


##### `查询` deletePresignCost

删除预签成本

**Requests:**

- `presignCost.pcid` (Long): 成本ID

```json
{
    "presignCost.pcid": 1
}
```

## 定额


### 共享工费


> **类**: `api.data.NormriceAction`


#### 数据类型: `cormrice`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 定额工费ID | Long |
| `constructionNode` | 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |
| `quotationCtem` | 共享项 , 类型 [quotationCtem ](./data.html#api.data.QuotationItemAction.quotationCtem) | Object |
| `unit` | 定额单位 | String |
| `trannum` | 转换量 | Integer |
| `salary` | 薪资 | Integer |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` pageCormrice

分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 定额工费信息列表 , 每条数据类型 `cormrice`

```json
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
```


##### `查询` queryCormriceByQcid

通过共享项ID获取定额工费信息

**Requests:**

- `cormrice.quotationCtem.qcid` (Long): 共享项ID

```json
{
    "cormrice.quotationCtem.qcid": 1
}
```

**Returns:**

- `cormrices` (List): 定额工费信息列表 , 每条数据类型 `cormrice`

```json
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
```


##### `查询` addCormrice

添加定额工费信息

**Requests:**

- `cormrice.constructionNode.cnid` (Long): 施工节点ID
- `cormrice.quotationCtem.qcid` (Long): 报价项ID
- `cormrice.salary` (Integer): 薪资

```json
{
    "cormrice.constructionNode.cnid": 1,
    "cormrice.quotationCtem.qcid": 1,
    "cormrice.salary": 1000
}
```


##### `查询` deleteCormrice

删除定额工费信息

**Requests:**

- `cormrice.cpid` (Long): 定额工费ID

```json
{
    "cormrice.cpid": 1
}
```

### 材料项


> **类**: `api.data.NormoodAction`


#### 数据类型: `normood`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ngid` | 定额商品ID | Long |
| `name` | 名称 | String |
| `noods` | 定材 , 类型 [noods ](./data.html#api.data.NoodsAction.noods) | Object |
| `quotationItem` | 报价项 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |
| `normunit` | 定额单位 | String |
| `normnum` | 定额数量 | Integer |
| `storeunit` | 库房单位 | String |
| `storenum` | 库房数量 | Integer |
| `price` | 价格 | Integer |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` pageNormood

分页方式获取定额材料信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 定额材料信息列表 , 每条数据类型 `normood`

```json
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
```


##### `查询` queryNormoodByQiid

通过报价项ID获取定额商品

**Requests:**

- `normood.quotationItem.qiid` (Long): 报价项ID
**Returns:**

- `normoods` (List): 定额商品信息列表 , 每条数据类型 `normood`

```json
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
```


##### `查询` addNormood

添加定额材料

**Requests:**

- `normood.name` (String): 名称
- `normood.noods.nid` (Long): 定材ID
- `normood.quotationItem.qiid` (Long): 报价项ID
- `normood.normunit` (String): 定额单位
- `normood.normnum` (Integer): 定额数量
- `normood.storeunit` (String): 库房单位
- `normood.storenum` (Integer): 库房数量
- `normood.price` (Integer): 价格

```json
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
```


##### `查询` deleteNormood

删除定额材料

**Requests:**

- `normood.ngid` (Long): 定额材料ID

```json
{
    "normood.ngid": 1
}
```

### 工费项


> **类**: `api.data.NormriceAction`


#### 数据类型: `normrice`

| 参数 | 说明 | 类型 |
|------|------|------|
| `npid` | 定额工费ID | Long |
| `constructionNode` | 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |
| `quotationItem` | 报价项 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |
| `unit` | 定额单位 | String |
| `trannum` | 转换量 | Integer |
| `salary` | 薪资 | Integer |
| `stuff` | 材料费 | Integer |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` pageNormrice

分页方式获取定额工费信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 定额工费信息列表 , 每条数据类型 `normrice`

```json
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
```


##### `查询` queryNormriceByQiid

通过报价项ID获取定额工费

**Requests:**

- `normrice.quotationItem.qiid` (Long): 报价项ID

```json
{
    "normrice.quotationItem.qiid": 1
}
```

**Returns:**

- `normrices` (List): 定额商品信息列表 , 每条数据类型 `normrice`

```json
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
```


##### `查询` addNormrice

添加定额薪资

**Requests:**

- `normrice.constructionNode.cnid` (Long): 施工节点ID
- `normrice.quotationItem.qiid` (Long): 报价项ID
- `normrice.trannum` (Integer): 转换量
- `normrice.salary` (Integer): 薪资
- `normrice.stuff` (Integer): 材料费

```json
{
    "normrice.constructionNode.cnid": 1,
    "normrice.quotationItem.qiid": 1,
    "normrice.trannum": 1000,
    "normrice.salary": 1000,
    "normrice.stuff": 1000
}
```


##### `查询` deleteNormrice

删除定额薪资

**Requests:**

- `normrice.npid` (Long): 定额薪资ID

```json
{
    "normrice.npid": 1
}
```

### 附加项


针对于定额工费提供的基础数据


> **类**: `api.data.NormaddAction`


#### 数据类型: `normadd`

| 参数 | 说明 | 类型 |
|------|------|------|
| `naid` | 附加项ID | Long |
| `name` | 名称 | String |
| `constructionNode` | 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |
| `unit` | 单位 | String |
| `price` | 单价 | Integer |
| `stuff` | 材料费 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageNormadd

分页方式获取附加项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 附加项信息列表 , 每条数据类型 `normadd`

```json
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
```


##### `查询` queryNormadd

获取附加项信息 , 可通过施工节点进行控制

**Requests:**

- `normadd.constructionNode.cnid` (Long): 节点ID

```json
{
    "normadd.constructionNode.cnid": 1
}
```

**Returns:**

- `normadds` (List): 附加项信息列表 , 每条数据类型 `normadd`

```json
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
```


##### `查询` addNormadd

添加附加项

**Requests:**

- `normadd.name` (String): 名称
- `normadd.constructionNode.cnid` (Long): 节点ID
- `normadd.unit` (String): 单位
- `normadd.price` (Integer): 单价
- `normadd.stuff` (Integer): 材料费

```json
{
    "normadd.name": "名称",
    "normadd.constructionNode.cnid": 1,
    "normadd.unit": "米",
    "normadd.price": 1000,
    "normadd.stuff": 0
}
```


##### `查询` updateNormaddForStatus

更新附加项状态

**Requests:**

- `normadd.aiid` (Long): 附加项ID
- `normadd.status` (Short): 状态

```json
{
    "normadd.aiid": 1,
    "normadd.status": 0
}
```


##### deleteNormadd

删除附加项

**Requests:**

- `normadd.aiid` (Long): 附加项ID

```json
{
    "normadd.aiid": 1
}
```

### 打包项


针对于定额材料提供的基础数据


> **类**: `api.data.NormpackAction`


#### 数据类型: `normpack`

| 参数 | 说明 | 类型 |
|------|------|------|
| `npid` | 打包项ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `normpackItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `npiid` | 打包项ID | Long |
| `npid` | 打包项ID | Long |
| `noods` | 定材 , 类型 [noods ](./data.html#api.data.NoodsAction.noods) | Object |
| `normunit` | 定额单位 | String |
| `normnum` | 定额数量 | Integer |
| `storeunit` | 库房单位 | String |
| `storenum` | 数量 | Integer |
| `price` | 价格 | Integer |


##### `查询` pageNormpack

分页方式获取打包项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 打包项信息列表 , 每条数据类型 `normpack`

```json
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
```


##### `查询` queryNormpack

获取打包项信息 , 可通过施工节点进行控制

**Returns:**

- `normpacks` (List): 打包项信息列表 , 每条数据类型 `normpack`

```json
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
```


##### `查询` queryNormpackItem

获取打包项信息

**Requests:**

- `normpack.npid` (Long): 打包项ID

```json
{
    "normpack.npid": 1
}
```

**Returns:**

- `normpackItems` (List): 打包项信息列表 , 每条数据类型 `normpackItem`

```json
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
```


##### `查询` addNormpack

添加打包项

**Requests:**

- `normpack.name` (String): 名称

```json
{
    "normpack.name": "名称"
}
```


##### `查询` addNormpackItem

添加打包项

**Requests:**

- `normpackItem.npid` (Long): 打包项ID
- `normpackItem.noods.nid` (Long): 定材ID
- `normpackItem.normunit` (String): 定额单位
- `normpackItem.normnum` (Integer): 定额数量
- `normpackItem.storeunit` (String): 库房单位
- `normpackItem.storenum` (Integer): 数量
- `normpackItem.price` (Integer): 价格

```json
{
    "normpackItem.npid": 1,
    "normpackItem.noods.nid": 1,
    "normpackItem.normunit": 10000,
    "normpackItem.normnum": "个",
    "normpackItem.storeunit": 10000,
    "normpackItem.storenum": 10000,
    "normpackItem.price": 1000
}
```


##### `查询` updateNormpackForStatus

更新打包项状态

**Requests:**

- `normpack.npid` (Long): 打包项ID
- `normpack.status` (Short): 状态

```json
{
    "normpack.npid": 1,
    "normpack.status": 0
}
```


##### deleteNormpack

删除打包项

**Requests:**

- `normpack.npid` (Long): 打包项ID

```json
{
    "normpack.npid": 1
}
```


##### deleteNormpackItem

删除打包项

**Requests:**

- `normpackItem.npiid` (Long): 打包项ID

```json
{
    "normpackItem.npiid": 1
}
```

## 信息


### 任务


> **类**: `api.communion.TaskAction`


#### 数据类型: `task`

| 参数 | 说明 | 类型 |
|------|------|------|
| `tid` | 任务ID | Long |
| `name` | 名称 | String |
| `filepath` | 执行文件路径 | String |
| `level` | 等级 , 0: 功能级 , 1: 模块级 | Short |
| `type` | 类型 , 0: python, 1: shell | Short |
| `handle` | 操作 , 0: 读 , 1: 写 | Short |
| `server` | 服务 | Integer |
| `week` | 星期 | String |
| `day` | 天数 | String |
| `hour` | 小时 | String |
| `plugins` | 控件 , A: 时间区间, B: 月份区间, C: 上传附件, D: 自定义参数 | String |
| `keyword` | 关键字 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `isShow` | 显示标识 , 0: 显示 , 1: 不显示 | Short |
| `comment` | 说明 | String |


#### 数据类型: `taskParam`

| 参数 | 说明 | 类型 |
|------|------|------|
| `tpid` | 字段ID | Long |
| `tid` | 任务ID | Long |
| `no` | 编号 | Integer |
| `name` | 名称 | String |
| `table` | 表名 | String |
| `union` | 关联 | String |
| `param` | 字段 | String |
| `alias` | 别名 | String |
| `type` | 类型 , 0: 文本 , 1: 数值 | Short |
| `handle` | 处理过程 | String |
| `status` | 状态 | Short |
| `sort` | 排序 | Integer |
| `comment` | 备注 | String |


##### `查询` pageTask

分页方式获取任务信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 任务信息列表 , 每条数据类型 `task`

```json
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
```


##### `查询` queryTask

获取当前任务信息 , 状态为0(启用) , 显示标识为0(显示)

**Returns:**

- `tasks` (List): 任务信息列表 , 每条数据类型 `task`

```json
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
```


##### `查询` queryTaskForSelf

获取当前操作系统用户任务信息

**Returns:**

- `tasks` (List): 任务信息列表 , 每条数据类型 `task`

```json
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
```


##### `查询` queryTaskByRid

通过角色ID获取任务信息

**Requests:**

- `role.rid` (String): 角色ID

```json
{
    "role.rid": 1
}
```

**Returns:**

- `tasks` (List): 任务信息列表 , 每条数据类型 `task`

```json
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
```


##### `创建` addTask

添加任务

**Requests:**

- `task.name` (String): 名称
- `task.filepath` (String): 文件路径 , 绝对路径
- `task.level` (Short): 级别
- `task.type` (Short): 类型
- `task.handle` (Short): 操作
- `task.plugins` (String): 控件
- `task.keyword` (String): 关键字
- `task.comment` (String): 关键字

```json
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
```


##### `创建` updateTaskForStatus

更新任务状态

判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**

**Requests:**

- `task.tid` (Long): 任务ID
- `task.status` (Short): 状态

```json
{
    "task.tid": 1,
    "task.status": 0
}
```


##### `创建` updateTaskForIsShow

更新任务可见

判断任务是否存在 , 不存在 , 错误信息 **160027 任务不存在**

**Requests:**

- `task.tid` (Long): 任务ID
- `task.isShow` (Short): 可见

```json
{
    "task.tid": 1,
    "task.isShow": 0
}
```


##### `创建` updateRoleTask

更新角色对应任务信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**Requests:**

- `role.rid` (Long): 角色ID
- `task.tid` (Long): 任务ID

```json
{
    "role.rid": 1,
    "task.tid": 1
}
```


##### `创建` deleteRoleTask

删除角色对应任务信息

**Requests:**

- `role.rid` (Long): 角色ID
- `task.tid` (Long): 任务ID

```json
{
    "role.rid": 1,
    "task.tid": 1
}
```


##### `创建` pageTaskParam

分页方式获取任务字段信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 任务字段信息列表 , 每条数据类型 `taskParam`

```json
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
```


##### `创建` queryTaskParam

获取任务字段

**Requests:**

- `task.tid` (Long): 任务ID

```json
{
    "task.tid": 1
}
```

**Returns:**

- `taskParams` (List): 任务字段信息列表 , 每条数据类型 `taskParam`

```json
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
```


##### `创建` addTaskParam

添加任务字段

**Requests:**

- `taskParam.tid` (Long): 任务ID
- `taskParam.no` (Integer): 编号
- `taskParam.name` (String): 名称
- `taskParam.table` (String): 表名
- `taskParam.union` (String): 关联
- `taskParam.param` (String): 字段
- `taskParam.alias` (String): 别名
- `taskParam.type` (Short): 类型
- `taskParam.handle` (String): 处理过程
- `taskParam.sort` (Integer): 排序
- `taskParam.comment` (String): 说明

```json
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
```


##### `创建` updateTaskParam

更新任务字段

**Requests:**

- `taskParam.tpid` (Long): 任务字段ID
- `taskParam.tid` (Long): 任务ID
- `taskParam.no` (Integer): 编号
- `taskParam.name` (String): 名称
- `taskParam.table` (String): 表名
- `taskParam.union` (String): 关联
- `taskParam.param` (String): 字段
- `taskParam.alias` (String): 别名
- `taskParam.type` (Short): 类型
- `taskParam.handle` (String): 处理过程
- `taskParam.sort` (Integer): 排序
- `taskParam.comment` (String): 说明

```json
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
```


##### `创建` updateTaskParamForStatus

更新任务字段状态

**Requests:**

- `taskParam.tpid` (Long): 任务字段ID
- `taskParam.status` (Short): 状态

```json
{
    "taskParam.tpid": 1,
    "taskParam.status": 1
}
```


##### `创建` deleteTaskParam

删除任务字段

**Requests:**

- `taskParam.tpid` (Long): 任务字段ID

```json
{
    "taskParam.tpid": 1
}
```

## 工程


### 施工节点


> **类**: `api.data.ConstructionNodeAction`


#### 数据类型: `constructionNode`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cnid` | 节点ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `precheck` | 开工验证付款比例 | Integer |
| `postcheck` | 完工验证付款比例 | Integer |
| `stacheck` | 开工验证销售比例 | Integer |
| `fincheck` | 完工验证销售比例 | Integer |
| `startalk` | 开工话术 | String |
| `endtalk` | 完工话术 | String |
| `startSurvey` | 开工调研模版 , 类型 [surveyTemplate ](./data.html#api.data.SurveyTemplateAction.surveyTemplate) | Object |
| `endSurvey` | 完工调研模版 , 类型 [surveyTemplate ](./data.html#api.data.SurveyTemplateAction.surveyTemplate) | Object |
| `timeLimit` | 工期 | Integer |
| `sort` | 排序 | Short |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |


##### `查询` pageConstructionNode

分页方式获取工程节点信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 工程节点信息列表 , 每条数据类型 `constructionNode`

```json
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
```


##### `查询` queryConstructionNode

获取工程节点信息

**Returns:**

- `constructionNodes` (List): 工程节点信息列表 , 每条数据类型 `constructionNode`

```json
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
```


##### `查询` queryConstructionNodeByCnid

通过工程节点ID获取信息

**Requests:**

- `constructionNode.cnid` (Long): 工程节点ID

```json
{
    "constructionNode.cnid": 1
}
```

**Returns:**

- `constructionNode` (Object): 工程节点信息 , 类型 `constructionNode`

```json
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
```


##### `查询` queryConstructionNodeByOrderId

通过装修单归属公司 , 获取对应的工程节点信息

**Requests:**

- `orderId` (String): 装修单号

```json
{
    "orderId": "1601010001"
}
```

**Returns:**

- `constructionNodes` (List): 工程节点信息列表 , 每条数据类型 `constructionNode`

```json
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
```


##### `查询` addConstructionNode

添加工程节点信息

**Requests:**

- `constructionNode.name` (String): 名称
- `constructionNode.precheck` (Integer): 开工验证付款比例
- `constructionNode.postcheck` (Integer): 开工验证付款比例
- `constructionNode.stacheck` (Integer): 开工验证销售比例
- `constructionNode.fincheck` (Integer): 完工验证销售比例
- `constructionNode.startalk` (String): 开工话术
- `constructionNode.endtalk` (String): 完工话术
- `constructionNode.timeLimit` (Integer): 工期
- `constructionNode.startSurvey.stid` (Long): 开工调研模版ID
- `constructionNode.endSurvey.stid` (Long): 完工调研模版ID
- `constructionNode.kino` (String): 金蝶编号
- `constructionNode.kiname` (String): 金蝶名称

```json
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
```


##### `查询` updateConstructionNode

更新工程节点信息

**Requests:**

- `constructionNode.cnid` (Long): 节点ID
- `constructionNode.precheck` (Integer): 开工验证款比例
- `constructionNode.postcheck` (Integer): 完工验证款比例
- `constructionNode.stacheck` (Integer): 开工验证销售比例
- `constructionNode.fincheck` (Integer): 完工验证销售比例
- `constructionNode.startalk` (String): 开工话术
- `constructionNode.endtalk` (String): 完工话术
- `constructionNode.timeLimit` (Integer): 工期
- `constructionNode.startSurvey.stid` (Long): 开工调研模版ID
- `constructionNode.endSurvey.stid` (Long): 完工调研模版ID
- `constructionNode.kino` (String): 金蝶编号
- `constructionNode.kiname` (String): 金蝶名称

```json
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
```


##### `查询` updateConstructionNodeForStatus

更新工程节点状态

**Requests:**

- `constructionNode.cnid` (Long): 节点ID
- `constructionNode.status` (Short): 状态

```json
{
    "constructionNode.cnid": 1,
    "constructionNode.status": 0
}
```

### 施工计划


> **类**: `api.data.ConstructionPaceAction`


#### 数据类型: `constructionPace`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 计划ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `content` | 说明 | String |


##### `查询` pageConstructionPace

分页方式获取施工计划信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 施工计划信息列表 , 每条数据类型 `constructionPace`

```json
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
```


##### `查询` queryConstructionPace

获取工程计划信息

**Returns:**

- `constructionPaces` (List): 施工计划信息列表 , 每条数据类型 `constructionPace`

```json
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
```


##### `查询` addConstructionPace

添加工程计划

**Requests:**

- `constructionPace.name` (String): 名称
- `constructionPace.content` (String): 说明

```json
{
    "constructionPace.name": "计划",
    "constructionPace.content": "说明"
}
```


##### `查询` updateConstructionPace

更新工程计划

判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**

**Requests:**

- `constructionPace.cpid` (Long): 计划ID
- `constructionPace.name` (String): 名称
- `constructionPace.content` (String): 说明

```json
{
    "constructionPace.cpid": 1,
    "constructionPace.name": "计划",
    "constructionPace.content": "说明"
}
```


##### `查询` updateConstructionPaceForStatus

更新工程计划状态

判断工程计划是否存在 , 不存在 , 错误信息 **130123 工程计划不存在**

**Requests:**

- `constructionPace.cpid` (Long): 计划ID
- `constructionPace.status` (String): 状态

```json
{
    "constructionPace.cpid": 1,
    "constructionPace.status": 0
}
```

### 放线小组


> **类**: `api.data.DrawlineGroup`


#### 数据类型: `drawlineGroup`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dgid` | ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1:禁用 | Short |
| `content` | 说明 | String |
| `company` | 公司ID | Long |


:param groupName: 名称
:type groupName: String


##### `创建/查询` pageDrawlineGroup

分页方式获取放线小组信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 放线信息列表 , 每条数据类型 `drawlineGroup`

```json
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
```


##### `创建/查询` queryDrawlineGroup

获取状态为启用的放线小组信息

**Returns:**

- `drawlineGroups` (List): 放线信息列表 , 每条数据类型 `drawlineGroup`

```json
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
```


##### `创建` addDrawlineGroup

添加放线小组信息

判断放线小组名称是否存在 , 已经存在 , 错误信息 **130009 防线小组已存在**

**Requests:**

- `drawline.name` (String): 名称
- `drawline.content` (String): 说明

```json
{
    "drawline.name": "放线一组",
    "drawline.content": "说明"
}
```


##### `创建` updateDrawlineGroup

更新放线小组信息

判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**

**Requests:**

- `drawline.dgid` (Long): ID
- `drawline.name` (String): 名称
- `drawline.content` (String): 说明

```json
{
    "drawline.dgid": 1,
    "drawline.name": "放线一组",
    "drawline.content": "说明"
}
```


##### `创建` updateDrawlineGroupForStatus

更新放线小组状态 , 实现于启用/禁用

判断放线小组是否存在 , 不存存在 , 错误信息 **130008 防线小组不存在**

**Requests:**

- `drawline.dgid` (Long): ID
- `drawline.status` (Short): 状态

```json
{
    "drawline.dgid": 1,
    "drawline.status": 1
}
```

### 工程成本


> **类**: `api.data.ConstructionCostAction`


#### 数据类型: `constructionCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ccid` | 成本ID | Long |
| `name` | 名称 | String |
| `areaLeft` | 起始面积 | Integer |
| `areaRight` | 终止面积 | Integer |
| `accessory` | 辅料额 | Long |
| `salary` | 工费额 | Long |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `sort` | 排序 | Short |
| `company` | 公司 | Integer |


##### `查询` pageConstructionCost

分页方式获取工程成本信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 工程成本信息列表 , 每条数据类型 `constructionCost`

```json
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
```


##### `查询` queryConstructionCost

获取工程成本信息

**Returns:**

- `constructionCosts` (List): 工程成本信息列表 , 每条数据类型 `constructionCost`

```json
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
```


##### `查询` addConstructionCost

添加工程成本信息

**Requests:**

- `constructionCost.name` (String): 名称
- `constructionCost.areaLeft` (Integer): 开工验证款比例
- `constructionCost.areaRight` (Integer): 完工验证款比例
- `constructionCost.accessory` (Long): 辅料额
- `constructionCost.salary` (Long): 工费额

```json
{
    "constructionCost.name": "节点名称",
    "constructionCost.areaLeft": 60000,
    "constructionCost.areaRight": 69000,
    "constructionCost.accessory": 12000000,
    "constructionCost.salary": 60000000,
}
```


##### `查询` updateConstructionCost

更新工程成本信息

判断工程成本是否存在 , 不存在 , 错误信息 **120029 工程成本不存在**

**Requests:**

- `constructionCost.cnid` (Long): 成本ID
- `constructionCost.name` (String): 名称
- `constructionCost.areaLeft` (Integer): 起始面积
- `constructionCost.areaRight` (Integer): 终止面积
- `constructionCost.accessory` (Long): 辅料额
- `constructionCost.salary` (Long): 工费额

```json
{
    "constructionCost.ccid": 1,
    "constructionCost.name": "节点名称",
    "constructionCost.areaLeft": 60000,
    "constructionCost.areaRight": 69000,
    "constructionCost.accessory": 12000000,
    "constructionCost.salary": 60000000,
}
```


##### `查询` updateConstructionCostForStatus

更新工程成本状态

**Requests:**

- `constructionCost.ccid` (Long): 成本ID
- `constructionCost.status` (Short): 状态

```json
{
    "constructionCost.ccid": 1,
    "constructionCost.status": 0
}
```

### 辅材成本


> **类**: `api.data.AoodsCostAction`


#### 数据类型: `aoodsCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `acid` | 辅材成本ID | Long |
| `aoods` | 辅材 , 类型 [aoods ](./data.html#api.data.AoodsAction.aoods) | Object |
| `constructionCost` | 工程成本 , 类型 [constructionCost ](./data.html#api.data.ConstructionCostAction.constructionCost) | Object |
| `numLimit` | 数量上限 | Integer |


##### `查询` pageAoodsCost

分页方式获取辅材成本信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 辅材成本信息列表 , 每条数据类型 `aoodsCost`

```json
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
```


##### `查询` addAoodsCost

添加辅材成本

**Requests:**

- `aoodsCost.aoods.aid` (Long): 辅材ID
- `aoodsCost.constructionCost.ccid` (Long): 工程成本ID
- `aoodsCost.numLimit` (Integer): 数量限制

```json
{
    "aoodsCost.aoods.aid": 1,
    "aoodsCost.constructionCost.ccid": 1,
    "aoodsCost.numLimit": 1
}
```


##### `查询` deleteAoodsCost

删除辅材成本

**Requests:**

- `aoodsCost.acid` (Long): 辅材成本ID

```json
{
    "aoodsCost.acid": 1
}
```

### 工程工期


> **类**: `api.data.ConstructionPeriodAction`


#### 数据类型: `constructionPeriod`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 工期ID | Long |
| `name` | 名称 | String |
| `typeness` | 业务类型 | Short |
| `upperArea` | 起始面积 | Integer |
| `lowerArea` | 终止面积 | Integer |
| `period` | 工期 | Integer |
| `company` | 公司 | Integer |


##### `查询` pageConstructionPeriod

分页方式获取工程工期信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 工程工期信息列表 , 每条数据类型 `constructionPeriod`

```json
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
```


##### `创建` addConstructionPeriod

添加品类信息

- `constructionPeriod.name` (String): 名称
- `constructionPeriod.typeness` (Short): 业务类型

```json
{
    "constructionPeriod.name": "地板",
    "constructionPeriod.typeness": -1,
    "constructionPeriod.upperArea": 10000,
    "constructionPeriod.lowerArea": 0
    "constructionPeriod.period": 10000
}
```


##### `创建` updateConstructionPeriod

更新工程工期

- `constructionPeriod.cpid` (Long): 工期ID
- `constructionPeriod.name` (String): 名称
- `constructionPeriod.typeness` (Short): 业务类型

```json
{
    "constructionPeriod.cpid": 1,
    "constructionPeriod.name": "地板",
    "constructionPeriod.typeness": -1,
    "constructionPeriod.upperArea": 10000,
    "constructionPeriod.lowerArea": 0
    "constructionPeriod.period": 10000
}
```


##### `创建` deleteConstructionPeriod

删除工程工期

**Requests:**

- `constructionPeriod.cpid` (List): 工期ID

```json
{
    "constructionPeriod.cpid": 1
}
```

## 厂商


### 品类


品类信息管理


> **类**: `api.communion.CategoryAction`


#### 数据类型: `category`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 品类ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `type` | 类型 , 0: 标准 , 1: 统计 | Short |
| `isCoupon` | 券标识 , 0: 优惠 , 1: 标准 | Short |
| `isCount` | Short |  |
| `isCount` | Short |  |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |


:param name: 品类名称
:type name: String


##### `查询` pageCategory

分页方式获取品类信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 品类信息列表 , 每条数据类型 `category`

```json
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
```


##### `查询` queryCategory

获取所有品类信息

**Returns:**

- `categorys` (List): 品类信息列表 , 每条数据类型 `category`

```json
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
```


##### `查询` queryCategoryByCId

通过品类ID获取品类信息

**Requests:**

- `category.cid` (Long): 品类ID

```json
{
    "category.cid": 1
}
```

**Returns:**

- `category` (Object): 品类信息 , 类型 `category`

```json
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
```


##### `创建` addCategory

添加品类信息

- `category.name` (String): 品类名称
- `category.kino` (String): 金蝶编号

```json
{
    "category.name": "地板",
    "category.kino": "01",
    "category.kiname": "地板"
}
```


##### `创建` updateCategory

更新品类信息

- `category.cid` (Long): 品类ID
- `category.name` (String): 品类名称
- `category.type` (Short): 类型
- `category.isCoupon` (Short): 券标识
- `category.isCount` (Short): 统计标识
- `category.kino` (String): 金蝶编号

```json
{
    "category.cid": 1,
    "category.name": "地板",
    "category.type": 0,
    "category.isCoupon": 0,
    "category.isCount": 0,
    "category.kino": "01",
    "category.kiname": "地板"
}
```


##### `创建` deleteCategoryByCIds

通过品类ID批量删除品类信息

**Requests:**

- `cids` (cids): 品类ID列表 , 每条数据类型 Long

```json
{
    "cids[0]": 1,
    "cids[1]": 2
}
```

### 品牌


品牌信息管理


> **类**: `api.communion.BrandAction`


#### 数据类型: `brand`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bid` | 品牌ID | Long |
| `no` | 品牌编码 | String |
| `name` | 品牌名称 | String |
| `pinyin` | 拼音 | String |
| `category` | 品类 , 类型 [category ](./data.html#api.data.CategoryAction.category) | Object |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `atttype` | 业务类型 , 0: 内销 , 1: 外销 | Short |
| `agentName` | 代理 | String |
| `agentPhone` | 电话 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `comment` | 说明 | String |
| `company` | 公司ID | Long |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |


:param no: 品类ID
:type no: Long
:param name: 品牌名称
:type name: String


##### `查询` pageBrand

分页方式获取品牌信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 品牌信息列表 , 每条数据类型 `brand`

```json
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
```


##### `查询` queryBrand

获取所有品牌信息

**Returns:**

- `brands` (List): 品牌信息列表 , 每条数据类型 `brand`

```json
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
```


##### `查询` queryBrandByBid

通过品牌ID获取品牌信息

**Requests:**

- `brand.bid` (String): 品牌ID

```json
{
    "brand.bid": 1
}
```

**Returns:**

- `brand` (object): 品牌信息 , 类型 `brand`

```json
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
```


##### `查询` queryBrandByNo

通过品牌编号获取品牌信息

**Requests:**

- `brand.no` (String): 品牌编号

```json
{
    "brand.no": "B001"
}
```

**Returns:**

- `brand` (object): 品牌信息 , 类型 `brand`

```json
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
```


##### `查询` queryBrandByCid

通过品类ID获取品牌信息

**Requests:**

- `brand.cid` (Long): 品类ID

```json
{
    "brand.cid": 1
}
```

**Returns:**

- `brands` (List): 品牌信息列表 , 每条数据类型 `brand`

```json
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
```


##### `查询` queryBrandByPinyin

通过品牌名拼音获取品牌编号和品牌名称信息 , 公司限制

**Requests:**

- `brand.pinyin` (String): 拼音
- `brand.atttype` (Short): 业务类型

```json
{
    "brand.pinyin": "pinpai",
    "brand.attype": 0
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为品牌编号 , 值为品牌名
- `autoFillList` (List): 品牌名列表 , 每条数据类型String

```json
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
```


##### `查询` queryBrandByPinyinForAll

通过品牌名拼音获取品牌编号和品牌名称信息 , 无公司限制

**Requests:**

- `brand.pinyin` (String): 品牌名拼音
- `brand.atttype` (Short): 业务类型

```json
{
    "brand.pinyin": "pinpai",
    "brand.atttype": 0
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为品牌编号 , 值为品牌名 - 品类名
- `autoFillList` (List): 品牌名 - 品类名列表 , 每条数据类型String

```json
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
```


##### `创建` addBrand

添加品牌信息

**Requests:**

- `brand.name` (String): 品牌名称
- `brand.cid` (Long): 品类ID
- `brand.supplier.uid` (Long): 厂商ID
- `brand.atttype` (Short): 业务类型
- `agentName` (String): 代理
- `agentPhone` (String): 代理电话
- `brand.comment` (String): 说明
- `brand.kino` (String): 金蝶编号
- `brand.kiname` (String): 金蝶名称

```json
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
```


##### `创建` updateBrand

更新品牌信息

**Requests:**

- `brand.bid` (Long): 品牌ID
- `brand.name` (String): 品牌名称
- `brand.cid` (Long): 品类ID
- `brand.supplier.uid` (Long): 厂商ID
- `brand.atttype` (Short): 业务类型
- `agentName` (String): 代理
- `agentPhone` (String): 代理电话
- `brand.comment` (String): 说明
- `brand.kino` (String): 金蝶编号
- `brand.kiname` (String): 金蝶名称

```json
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
```


##### `创建` updateBrandForStatus

**Requests:**

- `brand.bid` (Long): 品牌ID
- `brand.status` (Short): 状态

```json
{
    "brand.bid": 1,
    "brand.status": 0
}
```


##### `创建` deleteBrand

通过品牌ID批量删除品牌信息

**Requests:**


```json
{
    "brands[0].bid": 1,
    "brands[1].bid": 2,
}
```

### 厂商


> **类**: `api.data.BrandSupplierAction`


#### 数据类型: `brandSupplier`

| 参数 | 说明 | 类型 |
|------|------|------|
| `buid` | 厂商ID | Long |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `brand` | 品牌 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |


##### `查询` queryBrandSupplier

查询品牌厂商信息

**Returns:**

- `brandSuppliers` (List): 品牌厂商信息列表 , 每条数据类型 `brandSupplier`

```json
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
```


##### `查询` addBrandSupplier

添加品牌厂商信息

**Requests:**

- `brandSupplier.supplier.uid` (Long): 厂商ID
- `brandSupplier.brand.bid` (Long): 品牌ID

```json
{
    "brandSupplier.supplier.uid": 1,
    "brandSupplier.brand.uid": 1
}
```


##### `查询` deleteBrandSupplier

删除品牌厂商信息

**Requests:**

- `brandSupplier.buid` (Long): 厂商ID

```json
{
    "brandSupplier.buid": 1
}
```

### 驻店


> **类**: `api.data.BrandInstorerAction`


#### 数据类型: `brandInstorer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `biid` | 驻店ID | Long |
| `instorer` | 驻店 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `agentName` | 代理 | String |
| `agentPhone` | 电话 | String |


##### `查询` queryBrandInstorer

查询品牌驻店信息

**Returns:**

- `brandInstorers` (List): 品牌厂商信息列表 , 每条数据类型 `brandInstorer`

```json
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
```


##### `查询` addBrandInstorer

添加品牌驻店信息

**Requests:**

- `brandInstorer.instorer.uid` (Long): 厂商ID
- `brandInstorer.brand.bid` (Long): 品牌ID
- `brandInstorer.agentName` (String): 代理
- `brandInstorer.agentPhone` (String): 电话

```json
{
    "brandInstorer.instorer.uid": 1,
    "brandInstorer.brand.uid": 1,
    "brandInstorer.agentName": "",
    "brandInstorer.agentPhone": ""
}
```


##### `查询` deleteBrandInstorer

删除品牌驻店信息

**Requests:**

- `brandInstorer.buid` (Long): 厂商ID

```json
{
    "brandInstorer.buid": 1
}
```

### 结算


> **类**: `api.data.BrandBalanceAction`


#### 数据类型: `brandBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bbid` | 结算ID | Long |
| `bid` | 品牌ID | Long |
| `name` | 名称 | String |
| `ctype` | 类型 , 0: 底价 , 1: 点位 | Short |
| `cvalue` | 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数 | Integer |
| `comment` | 说明 | String |


##### `查询` queryBrandBalance

获取品牌结算信息

**Requests:**

- `brandBalance.bid` (Long): 品牌ID

```json
{
    "brandBalance.bid": 1
}
```

**Returns:**

- `brandBalances` (List): 结算信息列表 , 每条数据类型 `brandBalance`

```json
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
```


##### `查询` addBrandBalance

添加结算信息

**Requests:**

- `brandBalance.bid` (Long): 品牌ID
- `brandBalance.name` (String): 名称
- `brandBalance.ctype` (Short): 类型
- `brandBalance.cvalue` (Integer): 结算值
- `brandBalance.comment` (String): 说明

```json
{
    "brandBalance.bid": 1,
    "brandBalance.name": "名称",
    "brandBalance.ctype": 0,
    "brandBalance.cvalue": 100000,
    "brandBalance..comment": "说明"
}
```


##### `查询` deleteBrandBalance

删除结算信息

**Requests:**

- `brandBalance.bbid` (Long): 结算ID

```json
{
    "brandBalance.bbid": 1
}
```

### 生产


> **类**: `api.data.BrandProductAction`


#### 数据类型: `brandProduct`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bpid` | 生产ID | Long |
| `bid` | 品牌ID | Long |
| `name` | 名称 | String |
| `cnid` | 工程节点ID | Long |
| `workNum` | 工期 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `comment` | 说明 | String |


##### `查询` queryBrandProduct


##### `查询` addBrandProduct


##### `查询` updateBrandProduct


##### `查询` deleteBrandProduct

### 回尺


> **类**: `api.data.RemeasureFormatAction`


#### 数据类型: `remeasureTemplate`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rtid` | 模板ID | Long |
| `name` | 名称 | String |
| `cid` | 品类ID | Long |
| `bid` | 品牌ID | Long |
| `company` | 公司ID | Integer |


#### 数据类型: `remeasureFormat`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rfid` | 指标ID | Long |
| `name` | 名称 | String |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `quotationItem` | 报价项 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `type` | 类型 , 0: 文本 , 1: 数值 | Short |
| `value` | 数值 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司ID | Integer |


##### `查询` queryRemeasureFormatByBid


##### `查询` queryRemeasureFormatByRfid


##### `查询` addRemeasureFormat


##### `查询` updateRemeasureFormat


##### `查询` updateRemeasureFormatForStatus

## 主材


### 型号


> **类**: `api.data.MaterialModelAction`


#### 数据类型: `materialModel`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mmid` | 型号ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `category` | 品类名称 | String |
| `bid` | 品牌ID | Long |
| `brand` | 品牌名称 | String |
| `measurementUnit` | 单位 | String |
| `unitPrice` | 单价 | Integer |
| `purchasePrice` | 售价 | Integer |
| `discount` | 折扣 | Integer |
| `calcType` | 计算方式 , 0: 底价 , 1: 点位 | Short |
| `point` | 点位计算值 | Integer |
| `base` | 底价计算值 | Integer |
| `calcValue` | 计算值 | Integer |
| `status` | 状态 , 0: 禁用 , 1: 启用 | Short |
| `company` | 公司ID | Long |


:param category: 品类ID
:type category: Long
:param brand: 品牌ID
:type brand: Long
:param no: 型号编号
:type no: String
:param name: 型号名称
:type name: String


##### `查询` pageMaterialModel

分页方式获取型号信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 型号信息列表 , 每条数据类型 `materialModel`

```json
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
```


##### `查询` pageMaterialModelForAdvance

分页方式获取型号信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 型号信息列表 , 每条数据类型 `materialModel`

```json
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
```


##### `查询` queryMaterialModel

获取所有型号信息

**Returns:**

- `materialModels` (List): 型号信息列表 , 每条数据类型 `materialModel`

```json
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
```


##### `查询` queryMaterialModelById

通过型号ID获取型号信息

**Requests:**

- `materialModel.mmid` (Long): 型号ID

```json
{
    "materialModel.mmid": 1
}
```

**Returns:**

- `materialModel` (object): 型号信息 , 类型 `materialModel`

```json
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
```


##### `查询` queryMaterialModelByNo

通过型号编号获取型号信息

**Requests:**

- `materialModel.no` (String): 型号编号

```json
{
    "materialModel.no": "PW0001"
}
```

**Returns:**

- `materialModel` (object): 型号信息 , 类型 `materialModel`

```json
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
```


##### `查询` queryMaterialModelForAllByName

通过型号名称查询型号信息列表

**Requests:**

- `materialModel.name` (String): 型号名称

```json
{
    "materialModel.name": "卫浴A12"
}
```

**Returns:**

- `materialModels` (List): 型号信息列表 , 每条数据类型 `materialModel`

```json
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
```


##### `查询` queryMaterialModelForAllByNo

通过型号编号查询型号信息列表

**Requests:**

- `materialModel.no` (String): 型号编号

```json
{
    "materialModel.no": "PW0001"
}
```

**Returns:**

- `materialModels` (List): 型号信息列表 , 每条数据类型 `materialModel`

```json
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
```


##### `查询` addMaterialModel

添加型号信息

**Requests:**

- `materialModel.no` (String): 编号
- `materialModel.name` (String): 名称
- `materialModel.bid` (Long): 品牌ID
- `materialModel.measurementUnit` (String): 单位
- `materialModel.unitPrice` (Integer): 单价
- `materialModel.purchasePrice` (Integer): 售价
- `materialModel.discount` (Integer): 折扣

```json
{
    "materialModel.no": "PW0001",
    "materialModel.name": "卫浴A12208C",
    "materialModel.bid": 2,
    "materialModel.measurementUnit": "个",
    "materialModel.purchasePrice": 1,
    "materialModel.unitPrice": 100,
    "materialModel.discount": 1
}
```


##### `查询` updateMaterialModel

更新型号信息

**Requests:**

- `materialModel.mmid` (Long): 型号ID
- `materialModel.no` (String): 编号
- `materialModel.name` (String): 名称
- `materialModel.bid` (Long): 品牌ID
- `materialModel.measurementUnit` (String): 单位
- `materialModel.unitPrice` (Integer): 单价
- `materialModel.purchasePrice` (Integer): 售价
- `materialModel.discount` (Integer): 折扣

```json
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
```


##### `查询` updateMaterialModelForStatus

更新型号状态信息 , 控制型号启用禁用状态

**Requests:**

- `materialModel.mmid` (Long): 型号ID
- `materialModel.status` (Short): 状态 , 0: 禁用 , 1: 启用

```json
{
    "materialModel.mmid": 1,
    "materialModel.status": 1
}
```


##### `查询` updateMaterialModelForAdvance

更新型号高级信息 , 比如计算方式 , 点位 , 底价计算值

**Requests:**

- `materialModel.mmid` (Long): 型号ID
- `materialModel.calcType` (Short): 计算类型 , 0: 底价 , 1: 点位
- `materialModel.base` (Integer): 底价计算值
- `materialModel.point` (Integer): 点位计算值

```json
{
    "materialModel.mmid": 1,
    "materialModel.calcType": 1,
    "materialModel.base": 10,
    "materialModel.point": 0.1
}
```


##### `查询` deleteMaterialModelByIds

通过型号ID批量删除型号信息

**Requests:**

- `dis` (dis): 型号ID列表 , 每条数据类型 Long

```json
{
    "dis[0]": 1,
    "dis[1]": 2
}
```

## 材料


### 类别


类别信息管理


> **类**: `api.data.GoodsKindAction`


#### 数据类型: `goodsKind`

| 参数 | 说明 | 类型 |
|------|------|------|
| `gkid` | 类别ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `level` | 等级 , 1/2/3 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageGoodsKind


##### `查询` queryGoodsKind


##### `查询` addGoodsKind


##### `查询` updateGoodsKind


##### `查询` updateGoodsKindForStauts

### 辅类


> **类**: `api.data.AccessoriesTypeAction`


#### 数据类型: `accessoriesType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `atid` | 辅类ID | Long |
| `name` | 名称 | String |
| `workType` | 工种 , 类型 [workType ](./data.html#api.data.WorkTypeAction.workType) | Object |
| `status` | 状态 , 包括: 0(禁用) , 1(启用) | Short |
| `comment` | 说明 | String |


##### `查询` pageAccessoriesType

分页方式获取辅类信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 辅类信息列表 , 每条数据类型 `accessoriesType`

```json
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
```


##### `查询` queryAccessoriesType

获取辅类信息

**Returns:**

- `accessoriesTypes` (List): 辅类信息列表 , 每条数据类型 `accessoriesType`

```json
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
```


##### `查询` queryAccessoriesTypeByWtid

通过工种ID获取对应的辅类信息

**Requests:**

- `accessoriesType.workType.id` (Integer): 工种ID

```json
{
    "accessoriesType.workType.id": 1
}
```

**Returns:**

- `accessoriesTypes` (List): 辅类信息列表 , 每条数据类型 `accessoriesType`

```json
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
```


##### `查询` addAccessoriesType

添加辅类信息

**Requests:**

- `accessoriesType.name` (String): 名称
- `accessoriesType.comment` (String): 说明
- `accessoriesType.workType.id` (Integer): 工种ID

```json
{
    "accessoriesType.name": "墙面",
    "accessoriesType.comment": "",
    "accessoriesType.workType.id": 1
}
```


##### `查询` updateAccessoriesType

更新辅类信息

辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**

**Requests:**

- `accessoriesType.atid` (Long): 辅类ID
- `accessoriesType.name` (String): 名称
- `accessoriesType.comment` (String): 说明
- `accessoriesType.workType.id` (Integer): 工种ID

```json
{
    "accessoriesType.atid": 1,
    "accessoriesType.name": "墙面",
    "accessoriesType.comment": "",
    "accessoriesType.workType.id": 1
}
```


##### `查询` updateAccessoriesTypeForStatus

更新辅类状态

辅类信息不存在 , 更新失败 , 错误信息 **260020 辅类不存在**

**Requests:**

- `accessoriesType.atid` (Long): 辅类ID
- `accessoriesType.status` (Short): 状态

```json
{
    "accessoriesType.atid": 1,
    "accessoriesType.status": 0
}
```

### 商品


> **类**: `api.data.GoodsAction`


#### 数据类型: `goods`

| 参数 | 说明 | 类型 |
|------|------|------|
| `gid` | 商品ID | Long |
| `no` | 编号 | String |
| `name` | 商品名 | String |
| `alias` | 别名 | String |
| `pinyin` | 拼音 | String |
| `barcode` | 条形码 | String |
| `category` | 品类 | String |
| `onekind` | 一类 , 类型 [goodsKind ](./data.html#api.data.GoodsKindAction.goodsKind) | Object |
| `twokind` | 二类 , 类型 [goodsKind ](./data.html#api.data.GoodsKindAction.goodsKind) | Object |
| `thrkind` | 三类 , 类型 [goodsKind ](./data.html#api.data.GoodsKindAction.goodsKind) | Object |
| `bid` | 品牌ID | Long |
| `brand` | 品牌 | String |
| `measurementUnit` | 单位 | String |
| `path` | 图片 | String |
| `purchase` | 进价 | Integer |
| `selling` | 售价 | Integer |
| `pieceNum` | 件数 | Integer |
| `type` | 类型 , 0: 商品 , 1: 套餐 | Short |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `isShow` | 是否出样 , 0: 已出 , 1: 未出 | Short |
| `company` | 公司 | Long |


#### 数据类型: `goodsPackage`

| 参数 | 说明 | 类型 |
|------|------|------|
| `gpid` | 套餐ID | Long |
| `pid` | 套餐商品ID | Long |
| `goods` | 商品 , 类型 `goods` | Object |
| `color` | 商品颜色 , 类型 [color ](./data.html#api.data.ColorAction.color) | Object |
| `format` | 商品规格 , 类型 [format ](./data.html#api.data.FormatAction.format) | Object |
| `num` | 数量 | Integer |


:param name: 大区名称
:type name: String
:param category: 大区名称
:type category: String
:param brand: 大区名称
:type brand: String


##### `查询` pageGoods

分页方式获取商品信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

查询过程根据当前操作人员获取对应的品牌权限 , 返回有权限获取的品牌信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` pageGoodsForAdvance

分页方式获取商品信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` queryGoods

获取商品信息

**Returns:**

- `goodes` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` queryGoodsByAtid

通过辅类ID获取商品信息

**Requests:**

- `goods.accessoriesType.atid` (Long): 辅类ID

```json
{
    "goods.accessoriesType.atid": 1
}
```

**Returns:**

- `goodes` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` queryGoodsByNo

通过编号获取商品信息

**Requests:**

- `goods.no` (String): 商品编号

```json
{
    "goods.no": "JGIDNEHDUIN5SD"
}
```

**Returns:**

- `goodes` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` queryGoodsByName

通过名称或拼音获取商品信息

**Requests:**

- `goods.name` (String): 商品名称

```json
{
    "goods.name": "瓷砖"
}
```

**Returns:**

- `goodes` (List): 商品信息列表 , 每条数据类型 `goods`

```json
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
```


##### `查询` queryGoodsByBarcode

通过条型号获取商品信息

**Requests:**

- `goods.barcode` (String): 条形码

```json
{
    "goods.barcode": "254125212521251"
}
```

**Returns:**

- `goods` (object): 商品信息 , 类型 `goods`

```json
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
```


##### `查询` queryGoodsByGId

通过商品ID获取商品信息

**Requests:**

- `goods.gid` (Long): 商品ID

```json
{
    "goods.gid": 2
}
```

**Returns:**

- `goods` (object): 商品信息 , 类型 `goods`

```json
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
```


##### `查询` queryPackage

获取套餐信息

**Requests:**

- `goodsPackage.pid` (Long): 商品ID

```json
{
    "goodsPackage.pid": 1
}
```

**Returns:**

- `goodsPackages` (List): 商品信息列表 , 每条数据类型 `goodsPackages`

```json
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
```


##### `查询` addGoods

添加商品

通过商品名称判断状态为0(启用)的商品是否存在 , 错误信息 **260046 商品已存在**

**Requests:**

- `goods.no` (String): 商品编号
- `goods.name` (String): 名称
- `goods.alias` (String): 别名
- `goods.barcode` (String): 条形码
- `goods.category` (String): 品类
- `goods.brand` (String): 品牌
- `goods.measurementUnit` (String): 单位
- `goods.purchase` (Integer): 进价
- `goods.selling` (Integer): 售价
- `goods.pieceNum` (Integer): 件数

```json
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
```


##### `查询` addPackage

添加套餐

绑定商品到指定商品 , 被绑定商品形成套餐商品

被绑商品信息不存在 , 添加失败 , 错误信息 **260004 商品不存在**

被绑商品不能为套餐 , 添加失败 , 错误信息 **260043 套餐归属商品不可为套餐**

套餐与绑定商品的品牌需要爱一致 , 不一致添加失败 , 错误信息 **260044 品牌不一致**

更新被绑商品类型为1(套餐)

**Requests:**

- `goods.no` (String): 商品编号
- `goods.name` (String): 名称
- `goods.alias` (String): 别名
- `goods.barcode` (String): 条形码
- `goods.category` (String): 品类
- `goods.brand` (String): 品牌
- `goods.measurementUnit` (String): 单位
- `goods.purchase` (Integer): 进价
- `goods.selling` (Integer): 售价
- `goods.pieceNum` (Integer): 件数

```json
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
```


##### `查询` updateGoods

更新商品

可更新的字段信息包括进价和售价

商品是否存在 , 不存在 , 错误信息 **260004 商品不存在**

**Requests:**

- `goods.gid` (Long): 商品ID
- `goods.path` (String): 图片路径
- `goods.purchase` (Integer): 进价
- `goods.selling` (Integer): 售价

```json
{
    "goods.gid": 1,
    "goods.path": "",
    "goods.purchase": 1000,
    "goods.selling": 100000
}
```


##### `查询` updateGoodsForStatus

更新商品状态

商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**

**Requests:**

- `goods.gid` (Long): 商品ID
- `goods.status` (Short): 状态

```json
{
    "goods.gid": 1,
    "goods.status": 0
}
```


##### `查询` showGoods

出样商品

商品信息不存在 , 更新失败 , 错误信息 **260004 商品不存在**

**Requests:**

- `goods.gid` (Long): 商品ID
- `goods.isShow` (Short): 是否出样

```json
{
    "goods.gid": 1,
    "goods.isShow": 0
}
```

### 辅材


> **类**: `api.data.AoodsAction`


#### 数据类型: `aoods`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 辅材ID | Long |
| `name` | 名称 | String |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `type` | 辅类 , 类型 [accessoriesType ](./data.html#api.data.AccessoriesTypeAction.accessoriesType) | Object |
| `noods` | 商品 , 类型 [noods ](./data.html#api.data.NoodsAction.noods) | Object |
| `constructionNode` | 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |
| `atttype` | 业务类型 , 0: 标准 , 1: 外辅 | Short |
| `balance` | 结算价 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |
| `bompany` | 归属公司 | Integer |


##### `查询` pageAoods

分页方式获取辅材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

查询过程根据当前操作公司查询辅材公司或归属公司作为条件

**Requests:**

- `companyType` (String): 公司类型

```json
{
    "companyType": "company"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 辅材信息列表 , 每条数据类型 `aoods`

```json
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
```


##### `查询` queryAoods

获取辅材信息

**Requests:**

- `aoods.type.atid` (Long): 辅类ID
- `aoods.atttype` (Short): 业务类型

```json
{
    "aoods.type.atid": 2,
    "aoods.atttype": 0
}
```

**Returns:**

- `aoodes` (object): 辅材信息 , 类型 `aoods`

```json
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
```


##### `查询` queryAoodsByAtid

通过辅类ID获取辅材信息

**Requests:**

- `aoods.type.atid` (Long): 辅类ID
- `aoods.atttype` (Short): 业务类型

```json
{
    "aoods.type.atid": 2,
    "aoods.atttype": 0
}
```

**Returns:**

- `aoodes` (object): 辅材信息 , 类型 `aoods`

```json
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
```


##### `查询` queryAoodsByName

通过商品名称获取辅材信息

**Requests:**

- `aoods.goods.name` (String): 商品名

```json
{
    "aoods.goods.name": "名称"
}
```

**Returns:**

- `aoodes` (object): 辅材信息 , 类型 `aoods`

```json
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
```


##### `查询` addAoods

添加辅材

**Requests:**

- `aoods.name` (String): 名称
- `aoods.goods.gid` (Long): 商品ID
- `aoods.noods.nid` (Long): 定材ID
- `aoods.constructionNode.cnid` (Long): 施工节点ID
- `aoods.type.atid` (Long): 辅类ID
- `aoods.atttype` (Short): 业务类型
- `aoods.balance` (Integer): 结算价
- `aoods.bompany` (Integer): 归属公司

```json
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
```


##### `查询` updateAoods

更新辅材信息

判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

**Requests:**

- `aoods.aid` (String): 商品ID
- `aoods.name` (String): 名称
- `aoods.noods.nid` (Long): 定材ID
- `aoods.constructionNode.cnid` (Long): 施工节点ID
- `aoods.type.atid` (Long): 辅类ID
- `aoods.atttype` (Short): 业务类型
- `aoods.balance` (Integer): 结算价
- `aoods.bompany` (Integer): 归属公司

```json
{
    "aoods.aid": 1,

    "aoods.name": "名称",
    "aoods.normood.ngid": 1,
    "aoods.constructionNode.cnid": 1,

    "aoods.type.atid": 1,
    "aoods.atttype": 0,
    "aoods.balance": 0
}
```


##### `查询` updateAoodsForNorm

更新辅材关联定额信息

判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

**Requests:**

- `aoods.aid` (String): 商品ID
- `aoods.noods.nid` (Long): 定材ID

```json
{
    "aoods.aid": 1,

    "aoods.noods.nid": 1
}
```


##### `查询` updateAoodsForStatus

更新辅材状态

判断辅材是否存在 , 不存在 , 错误信息 **260056 辅材不存在**

更新关联商品状态

**Requests:**

- `aoods.aid` (Long): 辅材ID
- `aoods.status` (Short): 状态

```json
{
    "aoods.aid": 1,
    "aoods.status": 0
}
```


##### `查询` copyAoods

拷贝辅材

**Requests:**

- `aoods.bompany` (String): 拷贝公司

```json
{
    "aoods.bompany": "AD2FOENN1SJILJ12I3JSODLJ3O"
}
```

### 选材


> **类**: `api.data.SoodsAction`


#### 数据类型: `soods`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 选材ID | Long |
| `name` | 名称 | String |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `format` | 规格 | String |
| `num` | 数量 | Integer |
| `selling` | 售价 | Integer |
| `cost` | 成本 | Integer |
| `balance` | 结算价 | Integer |
| `path` | 图片 | String |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司ID | Integer |


##### `查询` pageSoods

分页方式获取选材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材信息列表 , 每条数据类型 `soods`

```json
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
```


##### `查询` querySoods

通过选材ID查询选材信息

**Requests:**

- `soods.sid` (Long): 选材ID

```json
{
    "soods.sid": 1
}
```

**Returns:**

- `soodes` (List): 选材信息列表 , 每条数据类型 `soods`

```json
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
```


##### `查询` querySoodsByName

通过商品名称查询选材

**Requests:**

- `soods.goods.name` (String): 商品名

```json
{
    "soods.goods.name": "商品名"
}
```

**Returns:**

- `soodes` (List): 选材信息列表 , 每条数据类型 `soods`

```json
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
```


##### `查询` addSoods

添加选材

**Requests:**

- `soods.name` (String): 名称
- `soods.goods.gid` (Long): 商品ID
- `soods.format` (Long): 售价
- `soods.selling` (Long): 售价
- `soods.cost` (Long): 成本
- `soods.balance` (Long): 结算价
- `soods.num` (Integer): 数量

```json
{
    "soods.name": "选材",
    "soods.goods.gid": 1,
    "soods.format": "",
    "soods.selling": 1000,
    "soods.cost": 1000,
    "soods.balance": 1000,
    "soods.num": 1
}
```


##### `查询` copySoods

复制选材

**Requests:**

- `soods.qiid` (Long): 报价项ID
- `soods.quotationItem.qiid` (Long): 报价项ID

```json
{
    "soods.qiid": 1,
    "soods.quotationItem.qiid": 1
}
```


##### `查询` updateSoods

更新选材项

选材项更新内容包括结算价

判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**

**Requests:**

- `soods.sid` (Long): 选材项ID
- `soods.name` (String): 名称
- `soods.format` (String): 规格
- `soods.selling` (Integer): 结算价
- `soods.cost` (Integer): 结算价
- `soods.balance` (Integer): 结算价
- `soods.path` (String): 路径

```json
{
    "soods.sid": 1,
    "soods.name": "选材",
    "soods.format": "规格",
    "soods.selling": 10000,
    "soods.cost": 10000,
    "soods.balance": 10000,
    "soods.path": ""
}
```


##### `查询` updateSoodsForStatus

更新选材项状态

判断选材是否存在 , 不存在 , 错误信息 **130033 选材不存在**

**Requests:**


```json
{
    "soodes[0].sid": 1,
    "soodes[0].status": 10000,
}
```


##### `查询` deleteSoods

删除选材

**Requests:**

- `soods.sid` (Long): 选材ID

```json
{
    "soods.sid": 1
}    
```


#### 数据类型: `soodsItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `siid` | 选材项ID | Long |
| `soods` | 选材 , 类型 [soods ](./data.html#api.data.SoodsAction.soods) | Object |
| `quotationItem` | 报价项 , 类型 [quotationItem ](./data.html#api.data.QuotationItemAction.quotationItem) | Object |


##### `查询` pageSoodsItemByQiid

分页方式获取选材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

默认条件为选材归属的报价项ID

**Requests:**

- `soodsItem.quotationItem.qiid` (Long): 报价项ID

```json
{
    "soodsItem.quotationItem.qiid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材信息列表 , 每条数据类型 `soodsItem`

```json
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
```


##### `查询` pageSoodsItemBySid

分页方式获取选材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

默认条件为选材ID

**Requests:**

- `soodsItem.sid` (Long): 选材ID

```json
{
    "soodsItem.sid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材信息列表 , 每条数据类型 `soodsItem`

```json
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
```


##### `查询` querySoodsItemByQiid

通过报价项ID获取选材信息

**Requests:**

- `soodsItem.quotationItem.qiid` (Long): 报价项ID

```json
{
    "soodsItem.quotationItem.qiid": 1
}
```

**Returns:**

- `soodsItems` (List): 选材信息列表 , 每条数据类型 `soodsItem`

```json
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
```


##### `查询` querySoodsItemBySid

通过选材ID获取选材信息

**Requests:**

- `soodsItem.sid` (Long): 报价项ID
**Returns:**

- `soodsItems` (List): 选材信息列表 , 每条数据类型 `soodsItem`

```json
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
```


##### `查询` addSoodsItem

添加选材项

**Requests:**

- `soodsItem.sid` (Long): 选材ID
- `soodsItem.quotationItem.qiid` (Long): 报价项ID

```json
{
    "soodsItem.sid": 1,
    "soodsItem.quotationItem.qiid": 1
}
```


##### `查询` deleteSoodsItem

删除选材项

**Requests:**

- `soodsItem.siid` (Long): 选材项ID

```json
{
    "soodsItem.siid": 1
}
```

### 定材


> **类**: `api.data.NoodsAction`


#### 数据类型: `noods`

| 参数 | 说明 | 类型 |
|------|------|------|
| `nid` | 选材ID | Long |
| `name` | 名称 | String |
| `selling` | 售价 | Integer |
| `balance` | 结算价 | Integer |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司ID | Integer |


##### `查询` pageNoods

分页方式获取定材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 定材信息列表 , 每条数据类型 `noods`

```json
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
```


##### `查询` queryNoods

通过定材ID查询定材信息

**Requests:**

- `noods.sid` (Long): 定材ID

```json
{
    "noods.sid": 1
}
```

**Returns:**

- `soodes` (List): 定材信息列表 , 每条数据类型 `noods`

```json
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
```


##### `查询` queryNoodsByName

通过商品名称查询定材

**Requests:**

- `noods.name` (String): 名称

```json
{
    "noods.name": "名称"
}
```

**Returns:**

- `soodes` (List): 定材信息列表 , 每条数据类型 `noods`

```json
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
```


##### `查询` addNoods

添加定材

**Requests:**

- `noods.name` (String): 名称
- `noods.selling` (Integer): 售价
- `noods.balance` (Integer): 结算价

```json
{
    "noods.name": 1,
    "noods.selling": 1000,
    "noods.balance": 1000
}
```


##### `查询` updateNoods

更新定材

判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**

**Requests:**

- `noods.nid` (Long): 定材项ID
- `noods.name` (String): 名称
- `noods.selling` (Integer): 售价
- `noods.balance` (Integer): 结算价

```json
{
    "noods.nid": 1,
    "noods.name": 1,
    "noods.selling": 1000,
    "noods.balance": 1000
}
```


##### `查询` updateNoodsForStatus

更新定材项状态

判断定材是否存在 , 不存在 , 错误信息 **130118 定材不存在**

**Requests:**

- `noods.sid` (Long): 定材项ID
- `noods.status` (Short): 状态

```json
{
    "noods.sid": 1,
    "noods.status": 10000,
}
```

### 颜色


颜色信息管理 , 商品属性之一


> **类**: `api.data.ColorAction`


#### 数据类型: `color`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 颜色ID | Long |
| `gid` | 商品ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageColor

分页方式获取颜色信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 颜色信息列表 , 每条数据类型 `color`

```json
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
```


##### `查询` queryColorByGid

通过商品ID获取对应的颜色信息

**Requests:**

- `color.gid` (Long): 商品ID

```json
{
    "color.gid": 1
}
```

**Returns:**

- `colors` (List): 颜色信息列表 , 每条数据类型 `color`

```json
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
```


##### `查询` queryColorForEnableByGid

通过商品ID获取对应的颜色信息 , 状态为启用

**Requests:**

- `color.gid` (Long): 商品ID

```json
{
    "color.gid": 1
}
```

**Returns:**

- `colors` (List): 颜色信息列表 , 每条数据类型 `color`

```json
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
```


##### `查询` addColor

添加商品颜色信息

**Requests:**

- `color.gid` (Long): 商品ID
- `color.name` (String): 颜色名

```json
{
    "color.gid": 1,
    "color.name": "白色"
}
```


##### `查询` updateColorForStatus

更新颜色状态

颜色信息不存在 , 更新失败 , 错误信息 **260014 颜色不存在**

**Requests:**

- `color.cid` (Long): 颜色ID
- `color.status` (Short): 状态 , 0: 启用 , 1: 禁用

```json
{
    "color.cid": 1,
    "color.status":1
}
```

### 规格


规格信息管理 , 商品属性之一


> **类**: `api.inventory.FormatAction`


#### 数据类型: `format`

| 参数 | 说明 | 类型 |
|------|------|------|
| `fid` | 规格ID | Long |
| `gid` | 商品ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `info` | 规格信息 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageFormat

分页方式获取规格信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 规格信息列表 , 每条数据类型 `format`

```json
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
```


##### `查询` queryFormatByGid

通过商品ID获取对应的规格信息

**Requests:**

- `format.gid` (Long): 商品ID

```json
{
    "format.gid": 1
}
```

**Returns:**

- `formats` (List): 颜色信息列表 , 每条数据类型 `format`

```json
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
```


##### `查询` queryFormatForEnableByGid

通过商品ID获取对应的规格信息 , 状态为启用

**Requests:**

- `format.gid` (Long): 商品ID

```json
{
    "format.gid": 1
}
```

**Returns:**

- `formats` (List): 规格信息列表 , 每条数据类型 `format`

```json
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
```


##### `查询` addFormat

添加商品规格信息

**Requests:**

- `format.gid` (Long): 商品ID
- `format.info` (String): 规格信息

```json
{
    "format.gid": 1,
    "format.info": "300*300"
}
```


##### `查询` updateFormatForStatus

更新规格状态

规格信息不存在 , 更新失败 , 错误信息 **260015 规格不存在**

**Requests:**

- `format.fid` (Long): 规格ID
- `format.status` (Short): 状态 , 0: 启用 , 1: 禁用

```json
{
    "format.fid": 1,
    "format.status":1
}
```

### 价格


价格信息管理 , 商品属性之一


> **类**: `api.inventory.PriceAction`


#### 数据类型: `price`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 价格ID | Long |
| `gid` | 商品ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `name` | 名称 | String |
| `type` | 类型 , 0: 正价 , 1: 特价 | Short |
| `purchase` | 进价 | Integer |
| `selling` | 售价 | Integer |
| `ctype` | 结算类型 , 0: 底价 , 1: 点位 | Short |
| `cvalue` | 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pagePrice

分页方式获取价格信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 价格信息列表 , 每条数据类型 `price`

```json
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
```


##### `查询` queryPriceByGid

通过商品ID获取对应价格信息

**Requests:**

- `price.gid` (Long): 商品ID
- `price.status` (Short): 状态

```json
{
    "price.gid": 1,
    "price.status": 0
}
```

**Returns:**

- `prices` (List): 价格信息列表 , 每条数据类型 `price`

```json
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
```


##### `查询` queryPriceByPid

通过ID获取对应价格信息

**Requests:**

- `price.pid` (Long): 价格ID

```json
{
    "price.pid": 1
}
```

**Returns:**

- `price` (Object): 价格信息 , 类型 `price`

```json
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
```


##### `查询` addPrice

添加商品价格信息

**Requests:**

- `price.gid` (Long): 商品ID
- `price.name` (String): 名称
- `price.purchase` (Integer): 进价
- `price.selling` (Integer): 售价
- `price.ctype` (Short): 结算类型
- `price.cvalue` (Integer): 结算值

```json
{
    "price.gid": 1,
    "price.name": "价格说明",
    "price.purchase": 100000,
    "price.selling": 150000,
    "price.ctype": 0,
    "price.cvalue": 90
}
```


##### `查询` updatePriceForStatus

更新价格状态

**Requests:**

- `price.pid` (Long): 价格ID
- `price.status` (Short): 状态

```json
{
    "price.pid": 1,
    "price.status": 0
}
```


##### `查询` deletePrice

删除商品价格信息

价格信息不存在 , 更新失败 , 错误信息 **260016 价格不存在**

**Requests:**

- `price.pid` (Long): 价格ID

```json
{
    "price.pid": 1
}
```

### 记录


> **类**: `api.data.GoodsRecordAction`


#### 数据类型: `goodsRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `grid` | 记录ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `sid` | 关联ID | Long |
| `type` | 类型 , 0: 商品, 1: 选材 , 2: 辅材 | Short |
| `operator` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 说明 | String |


.. pageGoodsRecord

## 仓储


### 仓库


> **类**: `api.inventory.StorehouseAction`


#### 数据类型: `storehouse`

| 参数 | 说明 | 类型 |
|------|------|------|
| `shid` | 仓库ID | Long |
| `code` | 编号 | String |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | String |


##### `查询` pageStorehouse

分页方式获取仓库信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 仓库信息列表 , 每条数据类型 `storehouse`

```json
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
```


##### `查询` queryStorehouse

获取全部仓库信息

**Returns:**

- `storehouses` (List): 仓库信息列表 , 每条数据类型 `storehouse`

```json
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
```


##### `查询` queryStorehouseForSelf

获取当前登陆用户有权操作仓库信息

**Returns:**

- `storehouses` (List): 仓库信息列表 , 每条数据类型 `storehouse`

```json
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
```


##### `查询` addStorehouse

添加仓库信息

仓库编号已经存在 , 添加失败 , 错误信息: **260012 仓库编号已存在**

**Requests:**

- `storehouse.code` (String): 编号
- `storehouse.name` (String): 名称

```json
{
    "storehouse.code": "SDJ4SDF5",
    "storehouse.name": "仓库",
}
```


##### `查询` updateStorehouseForStatus

更新仓库状态

通过仓库ID获取的仓库信息不存在 , 更新失败 , 错误信息 **260005 仓库不存在**

**Requests:**

- `storehouse.shid` (Long): 仓库ID
- `storehouse.status` (Short): 状态

```json
{
    "storehouse.shid": 1,
    "storehouse.status": 0,
}
```

### 仓库权限


> **类**: `api.inventory.StorehouseUserAction`


仓库权限信息管理 , 主要维护人员与仓库间的关联关系


#### 数据类型: `storehouseUser`

| 参数 | 说明 | 类型 |
|------|------|------|
| `shuid` | 仓库权限ID | Long |
| `user` | 用户 , 类型 [user ](./user.html#api.personel.UserAction.user) | String |
| `storehouse` | 仓库 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | String |


##### `查询` queryStorehouseUserByUserId

获取指定人员的仓库权限信息

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```

**Returns:**

- `storehouseUsers` (Object): 权限信息列表 , 每条数据类型 `storehouseUser`

```json
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
```


##### `查询` updateStorehouseUser

更新仓库人员权限信息

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001",
    "shIds[0]": 1
}
```

### 商品模版


商品模版信息管理


> **类**: `api.inventory.ManifestTemplateAction`


#### 数据类型: `manifestTemplate`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mtid` | 商品模版ID | Long |
| `name` | 名称 | String |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Long |


#### 数据类型: `manifestTemplateItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mtiid` | 商品模版项ID | Long |
| `manifestTemplate` | 模版 , 类型 `manifestTemplate` | Object |
| `goods` | 商品 , 类型 [goods ](./inventory.html#api.data.GoodsAction.goods) | Object |


##### `查询` pageManifestTemplate

分页方式获取商品模版信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 商品模版信息列表 , 每条数据类型 `manifestTemplate`

```json
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
```


##### `查询` queryManifestTemplate

获取全部商品模版

**Returns:**

- `manifestTemplates` (List): 商品模版信息列表 , 每条数据类型 `manifestTemplate`

```json
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
```


##### `查询` queryManifestTemplateItemByMtid

通过商品模版ID获取商品模版项信息

**Requests:**

- `manifestTemplate.mtid` (String): 商品模版ID

```json
{
    "manifestTemplate.mtid": 1
}
```

**Returns:**

- `manifestTemplates` (List): 商品模版信息列表 , 每条数据类型 `manifestTemplate`

```json
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
```


##### `查询` queryManifestItemByMtid

通过商品模版ID获取上包含的商品信息

**Requests:**

- `manifestTemplate.mtid` (String): 商品模版ID

```json
{
    "manifestTemplate.mtid": 1
}
```

**Returns:**

- `manifestItems` (List): 商品信息列表 , 每条数据类型 `manifestItem`

```json
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
```


##### `查询` queryManifestItemBySiids

通过销售项列表获取对应的货单项信息

**Requests:**


```json
{
    "siids[0]": 1
}
```

**Returns:**

- `manifestItems` (List): 商品信息列表 , 每条数据类型 `manifestItem`

```json
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
```


##### `查询` addManifestTemplate

添加商品模版

**Requests:**

- `manifestTemplate.name` (String): 模版名
- `manifestTemplate.comment` (String): 说明

```json
{
    "manifestTemplate.name": "模版",
    "manifestTemplate.comment": ""
}
```


##### `查询` addManifestTemplateItem

添加商品模版项

**Requests:**

- `manifestTemplate.mtid` (Long): 商品模版ID

```json
{
    "manifestTemplate.mtid": 1,
    "miIds[0]": 1
}
```


##### `查询` updateManifestTemplate

更新商品模版

商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**Requests:**

- `manifestTemplate.mtid` (Long): 商品模版ID
- `manifestTemplate.name` (String): 模版名
- `manifestTemplate.comment` (String): 说明

```json
{
    "manifestTemplate.mtid": 1,
    "manifestTemplate.name": "模版",
    "manifestTemplate.comment": ""
}
```


##### `查询` updateManifestTemplateForStatus

更新商品模版状态

商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**Requests:**

- `manifestTemplate.mtid` (Long): 商品模版ID
- `manifestTemplate.status` (Short): 状态

```json
{
    "manifestTemplate.mtid": 1,
    "manifestTemplate.status": 0
}
```


##### `查询` deleteManifestTemplate

删除商品模版

商品模版信息不存在 , 更新失败 , 错误信息 **260001 商品模版不存在**

**Requests:**

- `manifestTemplate.mtid` (Long): 商品模版ID

```json
{
    "manifestTemplate.mtid": 1
}
```


##### `查询` deleteManifestTemplateItem

删除商品模版项

**Requests:**

- `manifestTemplate.mtid` (Long): 商品模版ID

```json
{
    "manifestTemplate.mtid": 1,
    "mtiIds[0]": 1
}
```

## 合同


### 模版


> **类**: `api.communion.ContractAction`


#### 数据类型: `contract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 模版ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `title` | 标题 | String |
| `page` | 页面 | String |
| `path` | 路径 | String |
| `videopath` | 视频路径 |  |
| `atttype` | 业务类型 , 0: 装修 , 1: 人员 | Short |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `company` | 公司ID | Integer |


##### `查询` pageContract

分页方式获取合同模版信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 合同模版列表 , 每条数据类型 `contract`

```json
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
```


##### `查询` queryContract

查询合同信息 , 状态为0(启用)

**Requests:**

- `contract.atttype` (Short): 业务类型

```json
{
    "contract.atttype": 0
}
```

**Returns:**

- `constracts` (List): 合同模版列表 , 每条数据类型 `contract`

```json
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
```


##### `查询` countContract

统计合同

**Returns:**

- `count` (Integer): 总数

```json
{
    ...
    "count": 0
    ...
}
```


##### `查询` addContract

添加合同

判断合同编号是否存在 , 已经存在 , 错误信息 **130043 合同模版已存在**

**Requests:**

- `contract.no` (String): 编号
- `contract.name` (String): 名称
- `contract.title` (String): 标题
- `contract.page` (String): 页面
- `contract.path` (String): 文件路径
- `contract.videopath` (String): 文件路径
- `contract.atttype` (Short): 业务类型

```json
{
    "contract.no": "74HENIDH121H",
    "contract.name": "合同模版",
    "contract.title": "合同标题",
    "contract.page": "contract.html",
    "contract.path": "/ASDLFKJDSJFSADFLKJ",
    "contract.videopath": "/ASDLFKJDSJFSADFLKJ",
    "contract.atttype": 0
}
```


##### `查询` updateContract

更新合同

判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

**Requests:**

- `contract.cid` (Long): 模版ID

```json
{
    "contract.cid": 1
}
```


##### `查询` updateContractForStatus

更新合同状态

判断合同是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

**Requests:**

- `contract.cid` (Long): 模版ID
- `contract.status` (Short): 状态

```json
{
    "contract.cid": 1,
    "contract.status": 0
}
```

### 签章


> **类**: `api.communion.SignetAction`


#### 数据类型: `signet`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 签章ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `keyword` | 关键字 | String |
| `path` | 路径 | String |
| `type` | 类型 , 0: 合同 , 1: 款项 , 2: 人资 | Short |
| `status` | 状态 , 0: 初始, 1: 注册, 2: 认证, 3: 确认 , 4: 签章 , 5: 作废 | Short |
| `company` | 公司ID | Integer |
| `signno` | 签章编号 | String |
| `token` | 签章令牌 | String |
| `authurl` | 认证路径 | String |


##### `查询` pageSignet

分页方式获取签章信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 签章列表 , 每条数据类型 `signet`

```json
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
```


##### `查询` querySignet

查询签章信息 , 状态为0(初始)/1(注册)/2(认证)

**Requests:**

- `signet.type` (Short): 类型

```json
{
    "signet.type": 0
}
```

**Returns:**

- `signets` (List): 签章列表 , 每条数据类型 `signet`

```json
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
```


##### `查询` querySignetBySid

通过印章ID查询签章信息

**Requests:**

- `signet.sid` (Long): 印章ID

```json
{
    "signet.sid": 1
}
```

**Returns:**

- `signet` (Object): 签章信息 , 类型 `signet`

```json
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
```


##### `查询` addSignet

添加签章

判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**

**Requests:**

- `signet.no` (String): 编号
- `signet.name` (String): 名称
- `signet.keyword` (String): 关键字
- `signet.path` (String): 文件路径
- `signet.type` (Short): 类型

```json
{
    "signet.no": "IN31HJOS",
    "signet.name": "签章名称",
    "signet.keyword": "关键字",
    "signet.path": "/ASDLFKJDSJFSADFLKJ",
    "signet.type": 0
}
```


##### `查询` copySignet

赋值签章

判断签章编号是否存在 , 存在编号 , 错误信息 **130046 签章已存在**

**Requests:**

- `signet.sid` (String): 签章ID
- `signet.no` (String): 编号
- `signet.name` (String): 名称
- `signet.keyword` (String): 关键字

```json
{
    "signet.sid": 1,
    "signet.no": "IN31HJOS",
    "signet.name": "签章名称",
    "signet.keyword": "关键字",
    "signet.path": "/ASDLFKJDSJFSADFLKJ"
}
```


##### `查询` moveSignet


##### `查询` updateSignet

更新签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

**Requests:**

- `signet.sid` (Long): 签章ID
- `signet.no` (String): 编号
- `signet.name` (String): 名称
- `signet.keyword` (String): 关键字
- `signet.path` (String): 文件路径

```json
{
    "signet.sid": 1,
    "signet.no": "IN31HJOS",
    "signet.name": "签章名称",
    "signet.keyword": "关键字",
    "signet.path": "/ASDLFKJDSJFSADFLKJ"
}
```


##### `查询` registSignet

注册签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为0(初始) , 其他状态 , 错误信息 **130047 签章状态不可操作**

更新签章状态为1(注册)

**Requests:**

- `signet.sid` (Long): 签章ID

```json
{
    "signet.sid": 1
}
```


##### `查询` authSignet

认证签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为1(注册) , 其他状态 , 错误信息 **130047 签章状态不可操作**

更新签章状态为2(认证)

**Requests:**

- `signet.sid` (Long): 签章ID

```json
{
    "signet.sid": 1
}
```


##### `查询` confirmSignet

确认签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为2(认证) , 其他状态 , 错误信息 **130047 签章状态不可操作**

更新签章状态为3(确认)

**Requests:**

- `signet.sid` (Long): 签章ID

```json
{
    "signet.sid": 1
}
```


##### `查询` signateSignet

上传签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**Requests:**

- `signet.sid` (Long): 签章ID
- `signet.path` (String): 文件路径

```json
{
    "signet.sid": 1,
    "signet.path": "/ASDLFKJDSJFSADFLKJ"
}
```


##### `查询` autoSignet

自动签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**Requests:**

- `signet.sid` (Long): 签章ID

```json
{
    "signet.sid": 1
}
```

**Returns:**

- `signet.path` (String): 自动签章地址

```json
{
    ...
    "signet": {
        "path": "ASDLFKJDSJFSADFLKJ"
    },
    ...
}
```


##### `查询` selectSignet

选择签章 , 配置签章所使用印章信息

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断签章状态是否为3(确认) , 其他状态 , 错误信息 **130047 签章状态不可操作**

**Requests:**

- `signet.sid` (Long): 签章ID
- `signet.signid` (String): 印章编号
**Requests:**

- `signet.sid` (Long): 签章ID
- `signet.signid` (String): 印章编号

```json
{
    "signet.sid": 1,
    "signet.signid": "IN31HJOS"
}
```


##### `查询` cancelSignet

作废签章

判断签章信息是否存在 , 不存在 , 错误信息 **130045 签章不存在**

**Requests:**

- `signet.sid` (Long): 签章ID

```json
{
    "signet.sid": 1
}
```

### 印章


> **类**: `api.communion.FadadaAction`


#### 数据类型: `signature`

| 参数 | 说明 | 类型 |
|------|------|------|
| `customerId` | 客户编号 | String |
| `signatureId` | 印章编号 | String |
| `path` | 图片地址 | String |
| `image` | 图片内容(base64) | String |
| `defaults` | 默认标识 , 0: 标准 , 1: 默认 | Short |
| `type` | 类型 , 0: 个人 , 1: 公司 | Short |


##### `查询` pollingSignature

查询印章信息

**Requests:**

- `signature.customerId` (String): 客户编号

```json
{
    "signature.customerId": 1
}
```

**Returns:**

- `signatures` (List): 印章列表 , 每条数据类型 `signature`

```json
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
```


##### `查询` addSignature

添加印章信息

**Requests:**

- `signature.customerId` (String): 客户编号
- `signature.path` (String): 客户编号

```json
{
    "signature.customerId": 1,
    "signature.path": "/ASDLFKJDSJFSADFLKJ",
}
```

**Returns:**

- `signature` (Object): 印章信息 , 类型 `signature`

```json
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
```


##### `查询` defaultSignature

默认印章

**Requests:**

- `signature.customerId` (String): 客户编号
- `signature.signatureId` (String): 印章编号

```json
{
    "signature.customerId": 1,
    "signature.signatureId": "IN31HJOS"
}
```


##### `查询` deleteSignature

删除印章

**Requests:**

- `signature.customerId` (String): 客户编号
- `signature.signatureId` (String): 印章编号

```json
{
    "signature.customerId": 1,
    "signature.signatureId": "IN31HJOS"
}
```

### 话术


> **类**: `api.communion.TalkingAction`


#### 数据类型: `talking`

| 参数 | 说明 | 类型 |
|------|------|------|
| `tid` | 话术ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 施工合同 | Short |
| `content` | 内容 | String |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司ID | Integer |


##### `查询` pageTalking

分页方式获取话术信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 签章列表 , 每条数据类型 `talking`

```json
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
```


##### `查询` queryTalking

根据类型查询话术 , 状态为0(有效)

**Requests:**

- `talking.type` (Short): 类型

```json
{
    "talking.type": 0
}
```

**Returns:**

- `talkings` (List): 话术列表 , 每条数据类型 `talking`

```json
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
```


##### `查询` addTalking

添加话术

**Requests:**

- `talking.name` (String): 名称
- `talking.type` (Short): 类型
- `talking.content` (String): 内容

```json
{
    "talking.name": "名称",
    "talking.type": 0,
    "talking.content": "内容"
}
```


##### `查询` updateTalking

更新话术

判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**

**Requests:**

- `talking.tid` (Long): 话术ID
- `talking.name` (String): 名称
- `talking.type` (Short): 类型
- `talking.content` (String): 内容

```json
{
    "talking.tid": 1,
    "talking.name": "名称",
    "talking.type": 0,
    "talking.content": "内容"
}
```


##### `查询` updateTalkingForStatus

更新话术状态

判断话术是否存在 , 不存在 , 错误信息 **130040 话术不存在**

**Requests:**

- `talking.tid` (Long): 话术ID
- `talking.status` (Short): 状态

```json
{
    "talking.tid": 1,
    "talking.status": 0
}
```


##### `查询` deleteTalking

删除话术

**Requests:**

- `talking.tid` (Long): 话术ID

```json
{
    "talking.tid": 1
}
```

## 图片


图片信息管理 , 提供如楼盘图片等资源


> **类**: `api.communion.DataDrawingAction`


#### 数据类型: `dataDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ddid` | 图片ID | Long |
| `sid` | 关联ID | Long |
| `name` | 名称 | String |
| `drawingUrl` | 图片路径 | String |
| `drawingType` | 图片类型 , 0: 本地 , 1: 钉钉 | Short |
| `type` | 类型 , 0: 楼盘 , 1: 户型 , 2: 商品 , 3: 选材 , 4: 辅材 , 5: 商品池 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` queryDataDrawing

通过关联ID以及类型获取图片信息

**Requests:**

- `dataDrawing.sid` (Long): 关联ID
- `dataDrawing.type` (Short): 类型

```json
{
    "dataDrawing.sid": 1,
    "dataDrawing.type": 0
}
```

**Returns:**

- `dataDrawings` (List): 图片信息列表 , 每条数据类型 `dataDrawing`

```json
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
```


##### `创建` addDataDrawing

添加图片信息

**Requests:**

- `dataDrawing.sid` (Long): 关联ID
- `dataDrawing.name` (String): 名称
- `dataDrawing.drawingUrl` (String): 路径
- `dataDrawing.drawingType` (Short): 图片类型
- `dataDrawing.type` (Short): 类型

```json
{
    "dataDrawing.sid": 1,
    "dataDrawing.name": "name.jpg",
    "dataDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
    "dataDrawing.drawingType": 0,
    "dataDrawing.type": 0
}
```


##### `创建` deleteDataDrawing

删除图片信息

**Requests:**

- `dataDrawing.ddid` (Long): 图片ID

```json
{
    "dataDrawing.ddid": 1
}
```

### 自检


> **类**: `api.data.InspectAction`


#### 数据类型: `inspect`

| 参数 | 说明 | 类型 |
|------|------|------|
| `iid` | 自检ID | Long |
| `name` | 名称 | String |
| `atttype` | 业务类型 , 0: 通用 , 1: 装修 , 2: 销售 | Short |
| `type` | 类型 , 0, 装修合同方案 , 1: 装修放线方案 , 2: 销售配送资料 , 3: 销售安装资料 | Short |
| `content` | 内容 | String |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司ID | Integer |


#### 数据类型: `inspectItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `iiid` | 项目ID | Long |
| `iid` | 自检ID | Long |
| `title` | 标题 | String |
| `type` | 类型 | Short |
| `isRequire` | 必填标识 | Short |


##### `查询` pageInspect


##### `查询` queryInspect


##### `查询` queryInspectItem


##### `查询` addInspect


##### `查询` addInspectItem


##### `查询` updateInspect


##### `查询` updateInspectForStatus


##### `查询` updateInspectItem


##### `查询` deleteInspectItem
