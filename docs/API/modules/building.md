# 房产


## 流转节点


> **类**: `api.building.BuildingNodeAction`


#### 数据类型: `buildingNode`

| 参数 | 说明 | 类型 |
|------|------|------|


:param bnid: 房产节点ID
:type bnid: Long
:param name: 房产节点名称
:type name: String
:param type: 节点类型 , 包括: 0(一手房买卖) , 1(全款) , 2(商业贷款) , 3(公积金) , 4(部队公积金) , 5(租赁)
:type type: Short
:param sore: 排序 , 类型
:type sore: Short
:param status: 状态 , 包括: 0(启用) , 1(禁用)
:type status: Short


##### `查询` pageBuildingNode

分页方式获取房产节点信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房产节点信息列表 , 每条数据类型 `buildingNode`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bnid": 1,
                "name": "面签",
                "type": "商业贷款",
                "sore": 2,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBuildingNodeByType

通过节点类型查询节点信息, 同时可以利用sore获取具体节点信息

如果sore没有传值将返回节点类型对应的所有节点信息

节点状态为有效(0)

**Requests:**

- `buildingNode.type` (Short): 类型
- `buildingNode.sore` (Short): 排序

```json
{
    "buildingNode.type": 2,
    "buildingNode.sore": 1
}
```


##### `查询` addBuildingNode

添加房产节点信息

**Requests:**

- `buildingNode.name` (String): 名称
- `buildingNode.type` (Short): 商业贷款

```json
{
    "buildingNode.name": "面签",
    "buildingNode.type": 2
}
```


##### `查询` updateBuildingNode

更新房产节点信息

**Requests:**

- `buildingNode.bnid` (Long): 房产节点ID
- `buildingNode.name` (String): 房产节点名称

```json
{
    "buildingNode.bnid": 2,
    "buildingNode.name": "面签"
}
```


##### `查询` updateBuildingNodeForStatus

更新房产节点状态

**Requests:**

- `buildingNode.bnid` (Long): 房产节点ID
- `buildingNode.status` (short): 状态

```json
{
    "buildingNode.bnid": 2,
    "buildingNode.status": 0
}
```

## 房源


> **类**: `api.building.BuildingHouseAction`


#### 数据类型: `buildingHouse`

| 参数 | 说明 | 类型 |
|------|------|------|


:param hsid: 房源ID
:type hsid: Long
:param type: 房源类型 , 包括: 0(出售) , 1(出租)
:type type: Short
:param sourceType: 信息来源 , 包括: 0(店内) , 1(电话) , 2(网络)
:type sourceType: Short
:param house: 房证ID [house ](./data.html#api.data.HouseAction.house)
:type house: Object
:param customer: 房产权属 [customer ](./data.html#api.data.CustomerAction.customer)
:type customer: Object
:param deedNum: 契证编号
:type deedNum: String
:param deedValue: 契证原值
:type deedValue: Float
:param unitPrice: 单价
:type unitPrice: Float
:param totalPrice: 总价
:type totalPrice: Float
:param decorateTime: 装修时间
:type decorateTime: Timestamp
:param decorateDegree: 装修程度 , 包括: 0(清水房) , 1(老式装修) , 2(简单装修) , 3(中等装修) , 4(高级装修) , 5(豪华装修) , 6(其它)
:type decorateDegree: Short
:param discussType: 商议类型 , 包括: 0(少议) , 1(可议) , 2(不可议)
:type discussType: Short
:param rentType: 交租方式
:type rentType: Short
:param indoores: 室内设施
:type indoores: String
:param history: 房屋历史 , 包括: 0(正常) , 1(特殊)
:type history: Short
:param propertyFee: 物业费
:type propertyFee: Float
:param elevator: 电梯 , 包括: 0(有) , 1(无)
:type elevator: Short
:param onlyHousing: 唯一住房 , 包括: 0(是) , 1(否)
:type onlyHousing: Short
:param documentsDate: 下证日期
:type documentsDate: Timestamp
:param allowLoan: 允许贷款 , 包括: 0(是) , 1(否)
:type allowLoan: Short
:param beingLoan: 有无贷款 , 包括: 0(无) , 1(有)
:type beingLoan: Short
:param checkingTime: 看房时间
:type checkingTime: Timestamp
:param creater: 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user)
:type creater: Object
:param createTime: 创建时间
:type createTime: Timestamp
:param follower: 跟进人 , 类型 [user ](./user.html#api.personel.UserAction.user)
:type follower: Object
:param department: 跟进人部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department)
:type department: Object
:param region: 跟进人分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department)
:type region: Object
:param keyer: 钥匙归属人 , 类型 [user ](./user.html#api.personel.UserAction.user)
:type keyer: Object
:param housingGrade: 房源等级 , 包括: A , B , C , D
:type housingGrade: String
:param status: 状态 , 包括: 0(初始) , 1(签约) , 2(失效)
:type status: Short
:param path: 图片默认路径
:type path: String
:param comment: 备注
:type comment: String


##### `查询` pageBuildingHouse

分页方式获取房源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "hsid": 1,
                "type": 2
                "sourceType": "1#1-1-1",
                "house": {
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
                    "built": 1,
                    "unit": 1,
                    "floor": 1,
                    "door": 1,
                    "type": 0,
                    "buildArea": 88.6,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0,
                    "status": 0,
                },
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "deedNum": 1,
                "deedValue": 1,
                "unitPrice": 0,
                "totalPrice": 88.6,
                "decorateTime": 7,
                "decorateDegree": 0,
                "discussType": 2,
                "rentType": "2室1厅1卫1厨",
                "indoores": 0,
                "history": ["临街", "把西山"],
                "propertyFee": 0,
                "elevator": 0,
                "onlyHousing": 0,
                "documentsDate": 0,
                "allowLoan": 0,
                "beingLoan": 0
                "checkingTime": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": 0
                "follower": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "keyer": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "housingGrade": 0,
                "status": 0,
                "path": 0,
                "comment": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBuildingHouseForFollower

分页方式获取房源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

利用当前人员查询跟进人归属的房源信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "hsid": 1,
                "type": 2
                "sourceType": "1#1-1-1",
                "house": {
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
                    "built": 1,
                    "unit": 1,
                    "floor": 1,
                    "door": 1,
                    "type": 0,
                    "buildArea": 88.6,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0,
                    "status": 0,
                },
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "deedNum": 1,
                "deedValue": 1,
                "unitPrice": 0,
                "totalPrice": 88.6,
                "decorateTime": 7,
                "decorateDegree": 0,
                "discussType": 2,
                "rentType": "2室1厅1卫1厨",
                "indoores": 0,
                "history": ["临街", "把西山"],
                "propertyFee": 0,
                "elevator": 0,
                "onlyHousing": 0,
                "documentsDate": 0,
                "allowLoan": 0,
                "beingLoan": 0
                "checkingTime": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": 0
                "follower": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "keyer": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "housingGrade": 0,
                "status": 0,
                "path": 0,
                "comment": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBuildingHouseForAdvance

分页方式获取房源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

利用房源-部门权限 , 查询当前人员拥有的部门权限下跟进人归属的房源信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "hsid": 1,
                "type": 2
                "sourceType": "1#1-1-1",
                "house": {
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
                    "built": 1,
                    "unit": 1,
                    "floor": 1,
                    "door": 1,
                    "type": 0,
                    "buildArea": 88.6,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0,
                    "status": 0,
                },
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "deedNum": 1,
                "deedValue": 1,
                "unitPrice": 0,
                "totalPrice": 88.6,
                "decorateTime": 7,
                "decorateDegree": 0,
                "discussType": 2,
                "rentType": "2室1厅1卫1厨",
                "indoores": 0,
                "history": ["临街", "把西山"],
                "propertyFee": 0,
                "elevator": 0,
                "onlyHousing": 0,
                "documentsDate": 0,
                "allowLoan": 0,
                "beingLoan": 0
                "checkingTime": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": 0
                "follower": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "keyer": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "housingGrade": 0,
                "status": 0,
                "path": 0,
                "comment": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBuildingHouseByHsid

根据房产ID获取房源信息

**Requests:**

- `buildingHouse.hsid` (Long): 房源ID

```json
{
    "buildingHouse.hsid": 1
}
```

**Returns:**

- `buildingHouse` (Object): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "buildingHouse": {
        "hsid": 1,
        "type": 2
        "sourceType": "1#1-1-1",
        "house": {
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
            "built": 1,
            "unit": 1,
            "floor": 1,
            "door": 1,
            "type": 0,
            "buildArea": 88.6,
            "maxFloor": 7,
            "through": 0,
            "roomNum": 2,
            "houseType": "2室1厅1卫1厨",
            "orientation": 0,
            "feature": ["临街", "把西山"],
            "waterVapour": 0,
            "parlourType": 0,
            "status": 0,
        },
        "customer": {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
        },
        "deedNum": 1,
        "deedValue": 1,
        "unitPrice": 0,
        "totalPrice": 88.6,
        "decorateTime": 7,
        "decorateDegree": 0,
        "discussType": 2,
        "rentType": "2室1厅1卫1厨",
        "indoores": 0,
        "history": ["临街", "把西山"],
        "propertyFee": 0,
        "elevator": 0,
        "onlyHousing": 0,
        "documentsDate": 0,
        "allowLoan": 0,
        "beingLoan": 0
        "checkingTime": 0,
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": 0
        "follower": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "keyer": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
        "housingGrade": 0,
        "status": 0,
        "path": 0,
        "comment": 0
    }
    ...
}
```


##### `查询` queryBuildingHouseByNo

根据房产编号获取房源信息

**Requests:**

- `buildingHouse.no` (String): 房源编号

```json
{
    "buildingHouse.no": "H1601010001"
}
```

**Returns:**

- `buildingHouse` (Object): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "buildingHouse": {
        "hsid": 1,
        "type": 2
        "sourceType": "1#1-1-1",
        "house": {
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
            "built": 1,
            "unit": 1,
            "floor": 1,
            "door": 1,
            "type": 0,
            "buildArea": 88.6,
            "maxFloor": 7,
            "through": 0,
            "roomNum": 2,
            "houseType": "2室1厅1卫1厨",
            "orientation": 0,
            "feature": ["临街", "把西山"],
            "waterVapour": 0,
            "parlourType": 0,
            "status": 0,
        },
        "customer": {
            "id": 1,
            "no": "1501010001",
            "name": "李",
        },
        "deedNum": 1,
        "deedValue": 1,
        "unitPrice": 0,
        "totalPrice": 88.6,
        "decorateTime": 7,
        "decorateDegree": 0,
        "discussType": 2,
        "rentType": "2室1厅1卫1厨",
        "indoores": 0,
        "history": ["临街", "把西山"],
        "propertyFee": 0,
        "elevator": 0,
        "onlyHousing": 0,
        "documentsDate": 0,
        "allowLoan": 0,
        "beingLoan": 0
        "checkingTime": 0,
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": 0
        "follower": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "keyer": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "housingGrade": 0,
        "status": 0,
        "path": 0,
        "comment": 0
    }
    ...
}
```


##### `查询` checkBuildingHouse

验证房源信息

**Requests:**

- `buildingHouse.house.hid` (Long): 房产ID
- `buildingHouse.type` (Short): 类型

```json
{
    "buildingHouse.house.hid": 1,
    "buildingHouse.type": 1
}
```

**Returns:**

- `buildingHouse` (Object): 房源信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "buildingHouse": {
        "hsid": 1,
        "type": 2
        "sourceType": "1#1-1-1",
        "house": {
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
            "built": 1,
            "unit": 1,
            "floor": 1,
            "door": 1,
            "type": 0,
            "buildArea": 88.6,
            "maxFloor": 7,
            "through": 0,
            "roomNum": 2,
            "houseType": "2室1厅1卫1厨",
            "orientation": 0,
            "feature": ["临街", "把西山"],
            "waterVapour": 0,
            "parlourType": 0,
            "status": 0,
        },
        "customer": {
            "id": 1,
            "no": "1501010001",
            "name": "李",
        },
        "deedNum": 1,
        "deedValue": 1,
        "unitPrice": 0,
        "totalPrice": 88.6,
        "decorateTime": 7,
        "decorateDegree": 0,
        "discussType": 2,
        "rentType": "2室1厅1卫1厨",
        "indoores": 0,
        "history": ["临街", "把西山"],
        "propertyFee": 0,
        "elevator": 0,
        "onlyHousing": 0,
        "documentsDate": 0,
        "allowLoan": 0,
        "beingLoan": 0
        "checkingTime": 0,
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": 0
        "follower": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "keyer": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "housingGrade": 0,
        "status": 0,
        "path": 0,
        "comment": 0
    }
    ...
}
```


##### `查询` addBuildingHouse

添加房源信息

判断房源是否存在 , 错误信息 **320004 房源已存在**

**Requests:**

- `buildingHouse.type` (Short): 房源类型
- `buildingHouse.sourceType` (Short): 信息来源
- `buildingHouse.house.hid` (Long): 房证ID
- `buildingHouse.customer.cid` (Long): 房产权属
- `buildingHouse.deedNum` (String): 契证编号
- `buildingHouse.deedValue` (Float): 契证原值
- `buildingHouse.unitPrice` (Float): 单价
- `buildingHouse.totalPrice` (Float): 总价
- `buildingHouse.decorateTime` (Timestamp): 装修时间
- `buildingHouse.decorateDegree` (Short): 装修程度
- `buildingHouse.discussType` (Short): 商议类型
- `buildingHouse.rentType` (Integer): 交租方式
- `buildingHouse.indoores` (String): 室内设施
- `buildingHouse.history` (Short): 房屋历史
- `buildingHouse.propertyFee` (Float): 物业费
- `buildingHouse.elevator` (Short): 电梯
- `buildingHouse.onlyHousing` (Short): 唯一住房
- `buildingHouse.documentsDate` (Timestamp): 下证日期
- `buildingHouse.allowLoan` (Short): 允许贷款
- `buildingHouse.beingLoan` (Short): 有无贷款
- `buildingHouse.checkingTime` (Timestamp): 看房时间
- `buildingHouse.user.uid` (Long): 跟进人
- `buildingHouse.housingGrade` (String): 房源等级
- `buildingHouse.comment` (String): 备注

```json
{
    "buildingHouse.type": 0,
    "buildingHouse.sourceType": 2,
    "buildingHouse.house.hid": 1,
    "buildingHouse.customer.cid": 1,
    "buildingHouse.deedNum": "×契证×字第×号",
    "buildingHouse.deedValue": 88,
    "buildingHouse.unitPrice": 6500,
    "buildingHouse.totalPrice": 50,
    "buildingHouse.decorateTime": "2017-01-01",
    "buildingHouse.decorateDegree": 2,
    "buildingHouse.discussType": 0,
    "buildingHouse.rentType": null,
    "buildingHouse.indoores": "["冰箱", "洗衣机"]",
    "buildingHouse.history": 0,
    "buildingHouse.propertyFee": 3.2,
    "buildingHouse.elevator": 0,
    "buildingHouse.onlyHousing": 0,
    "buildingHouse.documentsDate": "2016-01-01",
    "buildingHouse.allowLoan": 0,
    "buildingHouse.beingLoan": 0,
    "buildingHouse.checkingTime": 待定,
    "buildingHouse.user.uid": 1,
    "buildingHouse.housingGrade": A,
    "buildingHouse.comment": "说明"
}
```


##### `查询` takeBuildingHouse

认领房源信息

判断房源是否存在 , 错误信息 **320005 房源不存在**

判断房源当前跟进人是否为空 , 不为空 , 错误信息 **320006 房源状态不可操作**

**Requests:**

- `buildingHouse.hsid` (Long): 房产ID

```json
{
    "buildingHouse.hsid": 1
}
```


##### `查询` updateBuildingHouse

更新房源信息

判断房源是否存在 , 错误信息 **320005 房源不存在**

判断房源状态是否为失效 , 失效房产状态不可操作 , 错误信息 **320006 房源状态不可操作**

**Requests:**

- `buildingHouse.hsid` (Long): 房产ID
- `buildingHouse.sourceType` (Short): 信息来源
- `buildingHouse.deedNum` (String): 契证编号
- `buildingHouse.deedValue` (Float): 契证原值
- `buildingHouse.unitPrice` (Float): 单价
- `buildingHouse.totalPrice` (Float): 总价
- `buildingHouse.decorateTime` (Timestamp): 装修时间
- `buildingHouse.decorateDegree` (Short): 装修程度
- `buildingHouse.discussType` (Short): 商议类型
- `buildingHouse.rentType` (Integer): 交租方式
- `buildingHouse.indoores` (String): 室内设施
- `buildingHouse.history` (Short): 房屋历史
- `buildingHouse.propertyFee` (Float): 物业费
- `buildingHouse.elevator` (Short): 电梯
- `buildingHouse.onlyHousing` (Short): 唯一住房
- `buildingHouse.documentsDate` (Timestamp): 下证日期
- `buildingHouse.allowLoan` (Short): 允许贷款
- `buildingHouse.beingLoan` (Short): 有无贷款
- `buildingHouse.checkingTime` (Timestamp): 看房时间
- `buildingHouse.housingGrade` (String): 房源等级
- `buildingHouse.comment` (String): 备注

```json
{
    "buildingHouse.hsid": 1,
    "buildingHouse.sourceType": 2,
    "buildingHouse.deedNum": "×契证×字第×号",
    "buildingHouse.deedValue": 88,
    "buildingHouse.unitPrice": 6500,
    "buildingHouse.totalPrice": 50,
    "buildingHouse.decorateTime": "2017-01-01",
    "buildingHouse.decorateDegree": 2,
    "buildingHouse.discussType": 0,
    "buildingHouse.rentType": null,
    "buildingHouse.indoores": "["冰箱", "洗衣机"]",
    "buildingHouse.history": 0,
    "buildingHouse.propertyFee": 3.2,
    "buildingHouse.elevator": 0,
    "buildingHouse.onlyHousing": 0,
    "buildingHouse.documentsDate": "2016-01-01",
    "buildingHouse.allowLoan": 0,
    "buildingHouse.beingLoan": 0,
    "buildingHouse.checkingTime": 待定,
    "buildingHouse.housingGrade": A,
    "buildingHouse.comment": "说明"
}
```


##### `查询` updateBuildingHouseForBelong

更新房源的跟进人

判断房源是否存在 , 错误信息 **320005 房源不存在**

判断房源状态是否为0(初始) , 其他状态不可操作 , 错误信息 **320006 房源状态不可操作**

添加房产记录 , 类型为归属 , 内容为 **原跟进人,编号:<userId>,名称:<userName>;现跟进人,编号:<userId>,名称:<userName>**

**Requests:**

- `buildingHouse.hsid` (Long): 房源ID
- `buildingHouse.follower.uid` (Long): 跟进人ID

```json
{
    "buildingHouse.hsid": 1,
    "buildingHouse.follower.uid": 1
}
```


##### `查询` updateBuildingHouseForKeyer

更新房源的钥匙归属人

判断房源是否存在 , 错误信息 **320005 房源不存在**

判断房源状态是否为0(初始) , 其他状态不可操作 , 错误信息 **320006 房源状态不可操作**

添加房产记录 , 类型为归属 , 内容为 **原钥匙归属,编号:<userId>,名称:<userName>;现钥匙归属,编号:<userId>,名称:<userName>**

**Requests:**

- `buildingHouse.hsid` (Long): 房源ID
- `buildingHouse.keyer.uid` (Long): 钥匙归属人ID

```json
{
    "buildingHouse.hsid": 1,
    "buildingHouse.keyer.uid": 1
}
```


##### `查询` updateBuildingHouseForPath

更新房源默认图片路径

判断房源是否存在 , 错误信息 **320005 房源不存在**

**Requests:**

- `buildingHouse.hsid` (Long): 房源ID
- `buildingHouse.path` (String): 默认图片路径

```json
{
    "buildingHouse.hsid": 1,
    "buildingHouse.path": "HDKSDODKEJ3213J123H12K3J.jpg"
}
```


##### `查询` updateBuildingHouseForStatus

更新房源状态

判断房源是否存在 , 错误信息 **320005 房源不存在**

判断房源状态是否为失效 , 失效房产状态不可操作 , 错误信息 **320006 房源状态不可操作**

**Requests:**

- `buildingHouse.hsid` (Long): 房源ID
- `buildingHouse.status` (Short): 状态

```json
{
    "buildingHouse.hsid": 1,
    "buildingHouse.status": 2
}
```

## 客源


> **类**: `api.building.BuildingCustomerAction`


#### 数据类型: `customerSource`

| 参数 | 说明 | 类型 |
|------|------|------|


:param csid: 客源ID
:type csid: Long
:param no: 编号 ,
:param customer: 客户 , 类型 [customer ](./data.html#api.data.CustomerAction.customer)
:type customer: Object
:param type: 类型 , 包括: 0(买房) , 1(租房) , 2(投资)
:type type: Short
:param purpose: 目的
:type purpose: String
:param intention: 意向
:type intention: String
:param price: 需求价格
:type price: String
:param area: 需求面积
:type area: String
:param familyType: 需求户型
:type familyType: String
:param orientation: 朝向
:type orientation: Short
:param conditions: 意向备注
:type conditions: String
:param grade: 客户等级
:type grade: String
:param creater: 创建人 , 类型 [user ](./user.html#api.data.UserAction.user)
:type creater: Object
:param createTime: 创建时间
:type createTime: Timestamp
:param status: 状态 , 0(初始) , 1(签约) , 2(无效)
:type status: Short
:param comment: 备注
:type comment: String


##### `查询` pageBuildingCustomer

分页方式获取客源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

针对当前人员返回客源信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客源列表 , 每条数据类型 `customerSource`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csid": 1,
                "no": "C1601010001",
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "type": 0,
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "area": "{'MAX':70, 'MIN': 50}",
                "familyType": 2,
                "orientation": 0,
                "condition": "["4楼", "不把山"]",
                "grade": "A",
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2017-01-01",
                "status": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBuildingCustomerByCsid

通过客源ID获取客源信息

**Requests:**

- `customerSource.csid` (Long): 客源ID

```json
{
    "customerSource.csid": 1
}
```

**Returns:**

- `customerSource` (Object): 客源 , 类型 `customerSource`

```json
{
    ...
    "customerSource": {
        "csid": 1,
        "no": "C1601010001",
        "customer": {
            "id": 1,
            "no": "1501010001",
            "name": "李",
        },
        "type": 0,
        "purpose": "婚房",
        "intention": "铁西区学区房",
        "price": "{'MAX':1200, 'MIN': 1000}",
        "area": "{'MAX':70, 'MIN': 50}",
        "familyType": 2,
        "orientation": 0,
        "condition": "["4楼", "不把山"]",
        "grade": "A",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": "2017-01-01",
        "status": 0,
        "comment": "说明"
    }
    ...
}
```


##### `查询` queryBuildingCustomerByNo

通过客源编号获取客源信息

**Requests:**

- `customerSource.no` (String): 客源编号

```json
{
    "customerSource.no": "C1601010001",
}
```

**Returns:**

- `customerSource` (Object): 客源 , 类型 `customerSource`

```json
{
    ...
    "customerSource": {
        "csid": 1,
        "no": "C1601010001",
        "customer": {
            "id": 1,
            "no": "1501010001",
            "name": "李",
        },
        "type": 0,
        "purpose": "婚房",
        "intention": "铁西区学区房",
        "price": "{'MAX':1200, 'MIN': 1000}",
        "area": "{'MAX':70, 'MIN': 50}",
        "familyType": 2,
        "orientation": 0,
        "condition": "["4楼", "不把山"]",
        "grade": "A",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": "2017-01-01",
        "status": 0,
        "comment": "说明"
    }
    ...
}
```


##### `查询` checkBuildingCustomer

检验客源信息是否存在

**Requests:**

- `customerSource.customer.cid` (Long): 客户ID
- `customerSource.type` (Short): 类型

```json
{
    "customerSource.customer.cid": 1,
    "customerSource.type": 0
}
```

**Returns:**

- `customerSource` (Object): 客源 , 类型 `customerSource`

```json
{
    ...
    "customerSource": {
        "csid": 1,
        "no": "C1601010001",
        "customer": {
            "id": 1,
            "no": "1501010001",
            "name": "李",
        },
        "type": 0,
        "purpose": "婚房",
        "intention": "铁西区学区房",
        "price": "{'MAX':1200, 'MIN': 1000}",
        "area": "{'MAX':70, 'MIN': 50}",
        "familyType": 2,
        "orientation": 0,
        "condition": "["4楼", "不把山"]",
        "grade": "A",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "oldUserId": "CS001",
            "userName": "白雪",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": "2017-01-01",
        "status": 0,
        "comment": "说明"
    }
    ...
}
```


##### `查询` addBuildingCustomer

添加客源信息

**Requests:**

- `customerSource.customer.cid` (Long): 客户ID
- `customerSource.type` (Short): 类型
- `customerSource.purpose` (String): 目的
- `customerSource.intention` (String): 意向
- `customerSource.price` (String): 需求价格
- `customerSource.area` (String): 需求面积
- `customerSource.familyType` (String): 需求户型
- `customerSource.orientation` (Short): 朝向
- `customerSource.condition` (String): 意向备注
- `customerSource.grade` (String): 客户等级
- `customerSource.comment` (String): 备注

```json
{
    "customerSource.customer.cid": 2,
    "customerSource.type": 0,
    "customerSource.purpose": "婚房",
    "customerSource.intention": "铁西广场附近",
    "customerSource.price": "{'MAX':1200, 'MIN': 1000}",
    "customerSource.area": "{'MAX':70, 'MIN': 50}",
    "customerSource.familyType": 2,
    "customerSource.orientation": 0,
    "customerSource.condition": "["4楼", "不把山", "..."]",
    "customerSource.grade": "A",
    "customerSource.comment": "备注"
}
```


##### `查询` updateBuildingCustomer

更新客源信息

判断客源是否存在 , 错误信息 **320008 客源不存在**

判断客源状态是否为失效 , 失效客源状态不可操作 , 错误信息 **320009 客源状态不可操作**

**Requests:**

- `customerSource.csid` (1): 房产ID
- `customerSource.purpose` (String): 目的
- `customerSource.intention` (String): 意向
- `customerSource.price` (String): 需求价格
- `customerSource.area` (String): 需求面积
- `customerSource.familyType` (String): 需求户型
- `customerSource.orientation` (Short): 朝向
- `customerSource.condition` (String): 意向备注
- `customerSource.grade` (String): 客户等级
- `customerSource.status` (String): 备注

```json
{
    "customerSource.csid": 1,
    "customerSource.purpose": "婚房",
    "customerSource.intention": "铁西广场附近",
    "customerSource.price": "{'MAX':1200, 'MIN': 1000}",
    "customerSource.area": "{'MAX':70, 'MIN': 50}",
    "customerSource.familyType": 2,
    "customerSource.orientation": 0,
    "customerSource.condition": "["4楼", "不把山", "..."]",
    "customerSource.grade": "A",
    "customerSource.status": 0
}
```


##### `查询` updateBuildingCustomerForStatus

更新客源信息状态

判断客源是否存在 , 错误信息 **320008 客源不存在**

判断客源状态是否为失效 , 失效客源状态不可操作 , 错误信息 **320009 客源状态不可操作**

**Requests:**

- `customerSource.csid` (Long): 客源ID
- `customerSource.status` (1): 状态

```json
{
    "customerSource.csid": 1,
    "customerSource.status": 1
}
```

## 房产单


> **类**: `api.building.BuildingAction`


#### 数据类型: `building`

| 参数 | 说明 | 类型 |
|------|------|------|


:param bid: 房产单ID
:type bid: Long
:param no: 编号
:type no: String
:param buildingHouse: 房源 , 类型 [buildingHouse ](./building.html#api.building.HouseSourceAction.buildingHouse)
:type buildingHouse: Object
:param customerSource: 客源 , 类型 [customerSource ](./building.html#api.building.BuildingCustomerAction.customerSource)
:type customerSource: Object
:param buildingHouseAgent: 房源代理人 , 类型 [customer ](./data.html#api.data.CustomerAction.customer)
:type buildingHouseAgent: Object
:param customerSourceAgent: 客源代理人 , 类型 [customer ](./data.html#api.data.CustomerAction.customer)
:type customerSourceAgent: Object
:param creater: 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user)
:type creater: Object
:param createTime: 创建时间
:type createTime: Timestamp
:param signingTime: 签约时间
:type signingTime: Timestamp
:param tradePrice: 成交价格
:type tradePrice: Float
:param downpayment: 首付款
:type downpayment: Float
:param loanPrice: 贷款金额
:type loanPrice: Float
:param payType: 支付方式 , 包括: 0(全款) , 1(贷款) , 2(月付)
:type payType: Short
:param status: 状态 , 0(初始) , 1(失效)
:type status: Short
:param buildingNode: 流转状态 , 类型 [buildingNode ](./building.html#api.building.BuildingNodeAction.buildingNode)
:type buildingNode: Object
:param balanceStatus: 结算状态 , 包括: 0(认购) , 1(成交)
:type balanceStatus: Short


##### `查询` pageBuilding

分页方式获取房产单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 房产单信息列表 , 每条数据类型 `buildingHouse`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bid": 1,
                "no": "****",
                "buildingHouse": {
                    "hsid": 1,
                    "type": 2
                    "sourceType": "1#1-1-1",
                    "house": {
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
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0,
                    },
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "deedNum": 1,
                    "deedValue": 1,
                    "unitPrice": 0,
                    "totalPrice": 88.6,
                    "decorateTime": 7,
                    "decorateDegree": 0,
                    "discussType": 2,
                    "rentType": "2室1厅1卫1厨",
                    "indoores": 0,
                    "history": ["临街", "把西山"],
                    "propertyFee": 0,
                    "elevator": 0,
                    "onlyHousing": 0,
                    "documentsDate": 0,
                    "allowLoan": 0,
                    "beingLoan": 0
                    "checkingTime": 0,
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": 0
                    "follower": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "housingGrade": 0,
                    "status": 0,
                    "path": 0,
                    "comment": 0,
                },
                "customerSource": {
                    "csid": 1,
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "purpose": "婚房",
                    "intention": "铁西区学区房",
                    "price": "{'MAX':1200, 'MIN': 1000}",
                    "area": "{'MAX':70, 'MIN': 50}",
                    "familyType": 2,
                    "orientation": 0,
                    "condition": "["4楼", "不把山"]",
                    "grade": "A",
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": "2017-01-01",
                    "status": 0,
                    "comment": "说明",
                },
                "buildingHouseAgent": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "customerSourceAgent": {
                    "cid": 2,
                    "no": "1501010002",
                    "name": "赵",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2017-01-01",
                "signingTime": "2017-01-01",
                "tradePrice": 50,
                "downpayment": 15,
                "loanPrice": 35,
                "payType": 1,
                "balanceStatus": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBuildingByBid

根据房产单ID获取房产单信息

**Requests:**

- `building.bid` (Long): 房产单ID

```json
{
    "building.bid": 1
}
```

**Returns:**

- `building` (Object): 房产单信息列表 , 每条数据类型 `building`

```json
{
    ...
    "data": [
        {
            "bid": 1,
            "no": "****",
            "buildingHouse": {
                "hsid": 1,
                "type": 2
                "sourceType": "1#1-1-1",
                "house": {
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
                    "built": 1,
                    "unit": 1,
                    "floor": 1,
                    "door": 1,
                    "type": 0,
                    "buildArea": 88.6,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0,
                    "status": 0,
                },
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "deedNum": 1,
                "deedValue": 1,
                "unitPrice": 0,
                "totalPrice": 88.6,
                "decorateTime": 7,
                "decorateDegree": 0,
                "discussType": 2,
                "rentType": "2室1厅1卫1厨",
                "indoores": 0,
                "history": ["临街", "把西山"],
                "propertyFee": 0,
                "elevator": 0,
                "onlyHousing": 0,
                "documentsDate": 0,
                "allowLoan": 0,
                "beingLoan": 0
                "checkingTime": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": 0
                "follower": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "housingGrade": 0,
                "status": 0,
                "path": 0,
                "comment": 0,
            },
            "customerSource": {
                "csid": 1,
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "type": 0,
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "area": "{'MAX':70, 'MIN': 50}",
                "familyType": 2,
                "orientation": 0,
                "condition": "["4楼", "不把山"]",
                "grade": "A",
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "oldUserId": "CS001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2017-01-01",
                "status": 0,
                "comment": "说明",
            },
            "buildingHouseAgent": {
                "cid": 1,
                "no": "1501010001",
                "name": "李",
            },
            "customerSourceAgent": {
                "cid": 2,
                "no": "1501010002",
                "name": "赵",
            },
            "creater": {
                "uid": 1,
                "userId": "U0001",
                "oldUserId": "CS001",
                "userName": "白雪",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "createTime": "2017-01-01",
            "signingTime": "2017-01-01",
            "tradePrice": 50,
            "downpayment": 15,
            "loanPrice": 35,
            "payType": 1,
            "balanceStatus": 0
        }
    ],
    ...
}
```


##### `查询` bindBuilding

房产单绑定房源、客源信息 , 房源客源状态变成已签约

判断房源状态是否为初始状态 , 不是初始状态无法绑定 , 错误信息 **320006 房源状态不可操作**

判断客源状态是否为初始状态 , 不是初始状态无法绑定 , 错误信息 **320009 客源状态不可操作**

更新当前操作的房源和客源状态为1(签约)状态

更新房源中跟进人归属的部门以及分区信息

**Requests:**

- `building.bid` (Long): 房产单ID
- `building.buildingHouse.hsid` (Long): 房源ID
- `building.customerSource.csid` (Long): 客源ID
- `building.houseAgent.cid` (Long): 房源代理人ID
- `building.customerAgent.cid` (Long): 客源代理人ID
- `building.tradePrice` (Float): 成交价格
- `building.downpayment` (Float): 首付款
- `building.loanPrice` (Float): 贷款额
- `building.payType` (Short): 支付方式
- `building.status` (Short): 房产单状态

```json
{
    "building.bid": 2,
    "building.buildingHouse.hsid": 1,
    "building.customerSource.csid": 1,
    "building.houseAgent.id": 2,
    "building.customerAgent.id": 2,
    "building.tradePrice": 1000
    "building.downpayment": 100,
    "building.loanPrice": "900",
    "building.payType": 1,
    "building.status": 1
}
```


##### `查询` unbindBuilding

房产单绑定房源、客源信息 , 房源客源状态变成初始

判断房产单是否存在 , 错误信息 **320010 房产单不存在**

判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**

**Requests:**

- `building.bid` (Long): 房产单ID
- `building.buildingHouse.hsid` (Long): 房源ID
- `building.customerSource.csid` (Long): 客源ID

```json
{
    "building.bid": 2,
    "building.buildingHouse.hsid": 1,
    "building.customerSource.csid": 1
}
```


##### `查询` updateBuildingForBalanceStatus

更新房产单结算状态

判断房产单是否存在 , 错误信息 **320010 房产单不存在**

判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**

**Requests:**

- `building.bid` (Long): 房产单ID
- `building.balanceStatus` (1): 结算状态

```json
{
    "building.bid": 1,
    "building.balanceStatus": 1
}
```

## 房产流转


> **类**: `api.building.BuildingScheduleAction`


#### 数据类型: `buildingSchedule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bsid` | 流转ID | Long |
| `buildingNode` | 房产节点 , 类型 [buildingNode ](./building.html#api.building.BuildingNodeAction.buildingNode) | Object |
| `bid` | 房产单ID | Long |
| `name` | 名称 | String |
| `planTime` | 计划时间 | Timestamp |
| `status` | 状态 , 包括: 0(初始) , 1(失效) , 2(完结) | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operatTime` | 操作时间 | Timestamp |
| `comment` | 备注 | String |


##### `查询` queryBuildingScheduleByBid

通过房产单ID获取房产环节信息

**Returns:**

- `buildingSchedule.building.bid` (Long): 房产单ID

```json
{
    "buildingSchedule.building.bid": 1
}
```

**Returns:**

- `buildingSchedules` (List): 房产进度列表 , 每条数据类型 `buildingSchedule`

```json
{
    ...
    "buildingSchedules": [
        {
            "bsid": 1,
            "buildingNode": {
                "bnid": 1,
                "name": "面签",
                "type": "商业贷款",
                "sore": 2,
            },
            "name": 面签,
            "planTime": "2016-01-01 00:00:00",
            "operater": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪",
                ...
            },
            "operatTime": "2016-01-01 00:00:00"
        },
    ]
    ...
}
```


##### `查询` nextBuildingSchedule

房产流转节点下一阶段处理

更新当前操作流转节点状态为完成

添加下一流转节点信息

**Requests:**

- `buildingSchedule.bsid` (Long): 流转ID

```json
{
    "buildingSchedule.bsid": 1
}
```


##### `查询` updateBuildingSchedule

更新房产流转节点预计时间信息

**Requests:**

- `buildingSchedule.bsid` (Long): 流转ID
- `buildingSchedule.planTime` (Timestamp): 计划时间

```json
{
    "buildingSchedule.bsid": 1,
    "buildingSchedule.planTime": "2016-01-01 00:00:00"
}
```


##### `查询` updateBuildingScheduleForStatus

更新房产流转节点状态

**Requests:**

- `buildingSchedule.bsid` (Long): 流转ID
- `buildingSchedule.status` (Short): 状态

```json
{
    "buildingSchedule.bsid": 1,
    "buildingSchedule.status": 1
}
```


##### `查询` resetBuildingSchedule

重新设置房产流转节点

原有流转节点信息状态设置为失效 , 并记录操作人和操作时间

判断房产单是否存在 , 错误信息 **320010 房产单不存在**

判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**

**Requests:**

- `building.bid` (Long): 流转ID
- `building.payType` (Short): 支付方式

```json
{
    "building.bid": 1,
    "building.payType": 1
}
```

## 房产图片


> **类**: `api.building.buildingDrawingAction`


#### 数据类型: `buildingDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|


:param bdid: 房产图片ID
:type bdid: Long
:param sid: 资源ID
:type sid: Long
:param name: 图片名称
:type name: String
:param drawingUrl: 图片路径
:type drawingUrl: String
:param type: 类型 , 包括: 0(房源) , 1(楼盘) , 2(房产单) , 3(房产流转)
:type type: Short
:param drawingType: 图片类型 , 0(本地) , 1(钉钉)
:type drawingType: Short
:param status: 状态 , 0: 有效, 1: 无效
:type status: Short
:param creater: 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user)
:type creater: Object
:param createTime: 创建时间
:type createTime: Timestamp


##### `查询` queryBuildingDrawing

根据资源ID和图片类型获取房产图片信息

**Requests:**

- `buildingDrawing.sid` (Long): 资源ID
- `buildingDrawing.type` (Short): 类型

```json
{
    "buildingDrawing.sid": 1
    "buildingDrawing.type": 0
}
```

**Returns:**

- `buildingDrawings` (List): 房产图片信息列表 , 每条数据类型 `buildingDrawing`

```json
{
    ...
    "buildingDrawings": [
        {
            "bdid": 1,
            "sid": 1,
            "name": "资源图片",
            "drawingUrl": "lADO0kagwM0D6M0C7g_750_1000.jpg",
            "drawingType": 0,
            "type": 1,
            "creater": {
                "uid": 1,
                "userId": "U0001",
                "oldUserId": "CS001",
                "userName": "白雪",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "createTime": "2017-01-01"
        }
    ],
    ...
}
```


##### `查询` addBuildingDrawing

添加房产图片信息

**Requests:**

- `buildingDrawing.sid` (Long): 资源ID
- `buildingDrawing.name` (String): 图片名称
- `buildingDrawing.drawingUrl` (String): 图片路径
- `buildingDrawing.drawingType` (Short): 图片类型
- `buildingDrawing.type` (Short): 类型

```json
{
    "buildingDrawing.sid": 1,
    "buildingDrawing.name": "资源图片",
    "buildingDrawing.drawingUrl": "lADO3gWWs80BkM0BkA_400_400.jpg",
    "buildingDrawing.drawingType": 0,
    "buildingDrawing.type": 1
}
```


##### `查询` deleteBuildingDrawing

删除房产图片信息

**Requests:**

- `buildingDrawing.bdid` (Long): 图片ID

```json
{
    "buildingDrawing.bdid": 1
}
```

## 房产记录


> **类**: `api.building.BuildingRecordAction`


#### 数据类型: `buildingRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `brid` | 房产记录ID | Long |
| `hsid` | 房源ID | Long |
| `csid` | 客源ID | Long |
| `comment` | 记录信息 | String |
| `type` | 记录类型 , 包括: 0(跟进) , 1(带看) , 2(自看) , 3(归属) | Short |
| `pattern` | 联系方式 | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operatTime` | 记录时间 | Timestamp |


##### `查询` queryBuildingRecord

根据房源ID或客源ID和类型获取房产记录信息

**Requests:**

- `buildingRecord.buildingHouse.hsid` (Long): 房源ID
- `buildingRecord.customerSource.csid` (Long): 客源ID
- `buildingRecord.type` (Short): 类型

```json
{
    "buildingRecord.buildingHouse.hsid": 1,
    "buildingRecord.customerSource.csid": null,
    "buildingRecord.type": 0
}
```

**Returns:**

- `buildingRecords` (List): 房产记录信息列表 , 每条数据类型 `buildingRecord`

```json
{
    ...
    "buildingRecords": [
        {
            "brid": 1,
            "hsid": 1,
            "csid": 1,
            "operater": {
                "uid": 1,
                "userId": "U0001",
                "oldUserId": "CS001",
                "userName": "白雪",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "operatTime": "2017-01-01",
            "comment": "说明",
            "type": 0,
            "pattern": 0
        }
    ],
    ...
}
```


##### `查询` addBuildingRecord

添加房产记录信息

**Requests:**

- `buildingRecord.buildingHouse.hsid` (Long): 房源ID
- `buildingRecord.customerSource.csid` (Long): 客源ID
- `buildingRecord.type` (Short): 记录类型
- `buildingRecord.pattern` (Short): 联系方式
- `buildingRecord.comment` (String): 记录信息

```json
{
    "buildingRecord.buildingHouse.hsid": 1,
    "buildingRecord.customerSource.csid": 1,
    "buildingRecord.type": 1,
    "buildingRecord.pattern": 0,
    "buildingRecord.comment": "说明"
}
```
