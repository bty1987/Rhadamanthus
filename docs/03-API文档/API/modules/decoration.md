# 装修


## 订单


装修单信息管理以及相关业务功能


> **类**: `api.decoration.DecorationAction`


#### 数据类型: `decoration`

| 参数 | 说明 | 类型 |
|------|------|------|
| `doid` | 装修单ID | Long |
| `orderId` | 装修单号 | String |
| `customer` | 客户信息 , 类型 [customer ](./data.html#api.data.CustomerAction.customer) | Object |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `grade` | 等级 , A/B/C | String |
| `type` | 类型 , 0: 半包 , 装修单 , 不包括主材单 , 1: 整装 , 装修+主材单 , 2: 满减 , 主材配比 , 装修打折 | Short |
| `typeness` | 类型 , 0: 半包 , 1: 整装 , 2: 半价 , 3: 满减 , 4: 减上捡 | Short |
| `houseType` | 房屋类别 , 包括: 0: 期房 , 1: 现房 | String |
| `houseClass` | 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等 | String |
| `resourceType` | 资源类型 , 0: 咨询 , 1: 量房 | Short |
| `busitype` | 业务类型ID | Long |
| `ddid` | 部门ID | Long |
| `sdid` | 部门ID |  |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `designer` | 设计师 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `quoter` | 报价员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `escorter` | 跟单员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `contracter` | 签单人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `versionId` | 报价版本 | String |
| `discount` | 默认报价折扣 | Integer |
| `payScale` | 付款比例 | Integer |
| `saleScale` | 销售比例 | Integer |
| `presignPrice` | 预签额 | Long |
| `signPrice` | 合同额 | Long |
| `factPrice` | 实收额 | Long |
| `couponCut` | 券优惠额 | Long |
| `thingCut` | 奖品优惠额 | Long |
| `notSalesmanRate` | 非业务人员提点 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `measureTime` | 量尺时间 | Timestamp |
| `depositTime` | 定金时间 | Timestamp |
| `sdesignTime` | 开始设计时间 | Timestamp |
| `edesignTime` | 结束设计时间 | Timestamp |
| `presignTime` | 预签时间 | Timestamp |
| `signTime` | 签单时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `accountTime` | 决算时间 | Timestamp |
| `status` | 状态 , 包括: 0(初始) , 1(定金) , 2(预签) , 3(签约) , 4(重签), 5(废单) , 6(终止) , 7(决算) , 8(完结) | Short |
| `designStatus` | 设计状态 , 包括: 0(待设计), 1(设计中), 2(完成) | Short |
| `projectStatus` | 工程状态 , 包括: 0(初始) , 1(开工) , 2(完工) , 其他状态关联 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Long |
| `sourceStatus` | 资源状态 , 包括: 0(待确认) , 1(合同确认) , 2(放线确认) | Short |
| `repairStatus` | 维修状态 , 包括: 0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款) | Short |
| `balanceStatus` | 结算状态 , 包括: 0(初始) , 1(结算) | Short |
| `otherStatus` | 其他状态 , 包括: 1(合尺) , 2(设计费) | Short |
| `addition` | 附加信息 , 类型 [decorationAddition ](./decoration.html#api.decoration.DecorationAdditionAction.decorationAddition) | Obejct |
| `company` | 装修公司 | Integer |
| `conpany` | 工程公司 | Integer |


:param orderId: 装修单号
:type orderId: String
:param customerId: 客户编号
:type customerId: String
:param customerPhone: 客户电话
:type customerPhone: String
:param houseNumber: 楼号
:type houseNumber: String
:param houseClass: 房屋类型
:type houseClass: String
:param status: 状态
:type status: String
:param otherStatus: 其他状态
:type otherStatus: String
:param designerId: 设计师编号
:type designerId: String
:param salesmanId: 业务员编号
:type salesmanId: String
:param supervisorId: 监理名编号
:type supervisorId: String
:param designerDepartmentId: 设计部编号
:type designerDepartmentId: String
:param salesmanDepartmentId: 业务部编号
:type salesmanDepartmentId: String
:param villageId: 楼盘编号
:type villageId: String

:param houseArea: 房屋面积
:type houseArea: String
:param signTimeDateRange: 签单时间 , 例: 2016/01/01-2016/01/02
:type signTimeDateRange: String
:param createTimeDateRange: 创建时间 , 例: 2016/01/01-2016/01/02
:type createTimeDateRange: String


##### `查询` pageDecoration

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位/部门权限/公司等条件控制

该方法只提供基本信息 , 部分重要信息不可显示 , 显示信息包括: 装修单号, 楼盘, 设计师/部门, 业务员/部门, 面积, 状态

该方法可以提供装修单状态作为条件

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseArea": 111,
                    ...
                },

                "grade": "B",
                "type": 0,
                "status": 0,

                "createTime": "2016-01-01",

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForGeneral

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位 , 部门权限控制

该方法查询范围为当前操作公司 , 状态为5(废单)和5(废单)之外状态的装修单

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForCommon

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法获取的信息是通用方式获取 , 在标准获取方式的基础上增加了归属信息 , 客户预付款信息

该方法根据操作人设计部门权限限制 , 装修单状态权限限制 , 当前操作公司限制

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "presignTime": null,
                "signTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForCompany

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法获取的信息是通用方式获取 , 在标准获取方式的基础上增加了归属信息 , 客户预付款信息

当前操作公司限制

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "presignTime": null,
                "signTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForGrade

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

默认条件为公司和等级

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "presignTime": null,
                "signTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForCustomer

分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

支持电话作为条件查询客户拥有的装修单信息

**Requests:**

- `customerPhone` (String): 客户电话

```json
{
    "customerPhone": "13000000000"
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "presignTime": null,
                "signTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForDesigner

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作人员 , 当前操作公司限制 , 返回对应设计师归属的装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForDesignerDept

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法根据操作人归属部门 , 返回装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,
                "notSalesmanRate": 30,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForDesignerManager

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法根据操作人设计部门权限限制 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,
                "notSalesmanRate": 30,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForSalesman

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作人员 , 当前操作公司限制 , 返回对应业务员归属的装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,
                "notSalesmanRate": 30,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForSalesmanDept

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法根据操作人归属部门 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForSalesmanManager

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法根据操作人业务部门权限限制 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForQuoter

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作人员 , 当前操作公司限制 , 返回对应报价员归属的装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForEscorter

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作人员 , 当前操作公司限制 , 返回对应跟单员归属的装修单基本信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageDecorationForBelong

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

该方法提供归属相关功能装修单查询 , 状态范围作为限制修改归属的条件

该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位 , 部门权限控制

该方法查询范围为当前操作公司 , 状态为0(初始)/1(定金)/2(预签)/4(重签)的装修单

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },

                "grade": "B",
                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "notSalesmanRate": 30,
                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },
                "discount": 10,

                "presignPrice": 50,
                "signPrice": 10000,
                "quotationPrice": 10000,
                "factPrice": 10000,
                "payScale": 0,
                "saleScale" 0,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,
                "sdesignTime": null,
                "edesignTime": null,
                "accountTime": null,
                "balanceTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "U0003",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "U0938",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "addition": {
                    "diid": 1,
                    "orderId": "1601010001",
                    "designer": "设计师",
                    "designDepartment": "设计一部",
                    "designRegion": "设计一分区",
                    "salesman": "业务员",
                    "salesDepartment": "业务一部/业务二部",
                    "salesRegion": "业务一分区/业务二分区"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDecorationByCustomerId

通过客户ID或客户编号获取装修单 , 返回装修单中基础信息

**Requests:**

- `decoration.customer.cid` (Long): 客户ID
- `decoration.customer.no` (String): 客户编号

```json
{
    "decoration.customer.cid": 1
}
```

**Returns:**

- `decorations` (Object): 装修单列表 , 每条数据类型 `decoration`

```json
{
    ...
    "decorations": [
        {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "cid": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                ...
            },

            "grade": "B",
            "type": 0,
            "typeness": 0,
            "busitype": 1,
            "houseType": 0,
            "houseClass": "二手",
            "resourceType": 0,

            "notSalesmanRate": 30,
            "version": {
                "qvid": 1,
                "versionId": "QV001",
            },
            "discount": 10,

            "presignPrice": 50,
            "signPrice": 10000,
            "quotationPrice": 10000,
            "factPrice": 10000,
            "payScale": 0,
            "saleScale" 0,

            "createTime": "2016-01-01",
            "measureTime": null,
            "depositTime": null,
            "signTime": null,
            "presignTime": null,
            "sdesignTime": null,
            "edesignTime": null,
            "accountTime": null,
            "balanceTime": null,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,

            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "U0003",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "U0938",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            },
            "quoter": null,
            "escorter": null,
            "supervisor": null,
            "contracter": null
        }

    ],
    ...
}
```


##### `查询` queryDecorationByOrderId

通过装修单号获取装修单信息 , 返回装修单中基础信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

该方法增加显示装修单归属公司编号 , 该编号利用加密方式进行处理 , 加密过程出现错误 , 错误信息 **230015 公司不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `decoration` (Object): 装修单信息 , 类型 `decoration`

```json
{
    ...
    "decoration":{
        "doid": 1,
        "orderId": "1601010001",
        "customer": {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
        },
        "house":{
            "hid": 1,
            "village": {
                "vid": 1,
                "no": "P001",
                "name": "广场一期"
            },
            "houseNumber": "1#1-1-1",
            ...
        },

        "grade": "B",
        "type": 0,
        "typeness": 0,
        "busitype": 1,
        "houseType": 0,
        "houseClass": "二手",
        "resourceType": 0,
        "houseArea": 111,
        "freeArea": 11,

        "notSalesmanRate": 30,
        "version": {
            "qvid": 1,
            "versionId": "QV001",
        },
        "discount": 10,

        "presignPrice": 50,
        "signPrice": 10000,
        "quotationPrice": 10000,
        "factPrice": 10000,
        "payScale": 0,
        "saleScale" 0,

        "createTime": "2016-01-01",
        "measureTime": null,
        "depositTime": null,
        "signTime": null,
        "presignTime": null,
        "sdesignTime": null,
        "edesignTime": null,
        "accountTime": null,
        "balanceTime": null,

        "status": 0,
        "designStatus": 0,
        "designStatus": 0,
        "projectStatus": 0,
        "sourceStatus": 0,
        "repairStatus": 0,
        "balanceStatus": 0,
        "otherStatus": 0,

        "creater": {
            "uid": 1,
            "userId": "U0203",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        },
        "designer": {
            "uid": 2,
            "userId": "U0003",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "salesman": {
            "uid": 3,
            "userId": "U0938",
            "userName": "李宁",
            "currentName": "李宁",
            "phone": "156xxxx9283",
            ...
        },
        "quoter": null,
        "escorter": null,
        "supervisor": null,
        "contracter": null
    },
    ...
}
```


##### `查询` queryDecorationForCommonByOrderId

通过装修单号获取装修单 , 根据操作人员信息控制客户敏感信息是否显示 , 返回装修单中基础信息

该方法增加显示装修单归属公司编号 , 该编号利用加密方式进行处理 , 加密过程出现错误 , 错误信息 **230015 公司不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `decoration` (Object): 装修单信息 , 类型 `decoration`

```json
{
    ...
    "decoration":{
        "doid": 1,
        "orderId": "1601010001",
        "customer": {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
        },
        "house":{
            "hid": 1,
            "village": {
                "vid": 1,
                "no": "P001"
            },
            "houseNumber": "1#1-1-1",
            ...
        },


        "grade": "B",
        "type": 0,
        "typeness": 0,
        "houseType": 0,
        "houseClass": "二手",
        "resourceType": 0,

        "busitype": 1,

        "notSalesmanRate": 30,
        "version": {
            "qvid": 1,
            "versionId": "QV001",
        },
        "discount": 10,

        "presignPrice": 50,
        "signPrice": 10000,
        "quotationPrice": 10000,
        "factPrice": 10000,
        "payScale": 0,
        "saleScale" 0,

        "createTime": "2016-01-01",
        "measureTime": null,
        "depositTime": null,
        "signTime": null,
        "presignTime": null,
        "sdesignTime": null,
        "edesignTime": null,
        "accountTime": null,
        "balanceTime": null,

        "status": 0,
        "designStatus": 0,
        "projectStatus": 0,
        "sourceStatus": 0,
        "repairStatus": 0,
        "balanceStatus": 0,
        "otherStatus": 0,

        "creater": {
            "uid": 1,
            "userId": "U0203",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        },
        "designer": {
            "uid": 2,
            "userId": "U0003",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "salesman": {
            "uid": 3,
            "userId": "U0938",
            "userName": "李宁",
            "currentName": "李宁",
            "phone": "156xxxx9283",
            ...
        },
        "quoter": null,
        "escorter": null,
        "supervisor": null,
        "contracter": null
    },
    ...
}
```


##### `查询` checkDecoration

通过指定条件验证装修单是否存在

条件参数传递方式参照 [filter ](../check_rule.html#filter)

**Returns:**

- `decorations` (Object): 装修单信息 , 类型 `decorations`

```json
{
    ...
    "decorations": [
        {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "cid": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                ...
            },

            "grade": "B",
            "type": 0,
            "typeness": 0,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,

            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "U0003",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "U0938",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            }
        },
    ]
    ...
}
```


##### `查询` createDecoration

创建装修单 , 客户与装修单一一绑定 , 不能同时拥有多个装修单 , 楼盘号不能重复

判断楼盘楼号是否已经绑定装修单 , 装修单状态为5(废单)和6(终止)除外 , 错误信息 **140034 订单楼盘,楼号已存在**

创建的装修单绑定当前归属公司的默认报价版本

根据装修单基本信息生成装修单信息

根据设计师和业务员生成装修单归属信息 , 包括归属设计/业务对应的人员/部门/分区 , 以及相应的比例等信息

根据设计师和业务员生成附加信息 , 包括设计/业务人员/部门/分区名称 , 保护期等信息

根据当前服务节点信息 , 生成装修单对应的服务信息

生成装修单对应的预算审核信息

**Requests:**

- `decoration.customer.cid` (Long): 客户Id
- `decoration.house.hid` (Long): 房产ID
- `decoration.designer.userId` (String): 设计师编号
- `decoration.salesman.userId` (String): 业务员编号
- `decoration.quoter.userId` (String): 报价员编号
- `decoration.escorter.userId` (String): 跟单员编号
- `decoration.grade` (String): 等级
- `decoration.type` (Short): 类型
- `decoration.typeness` (Short): 类型
- `decoration.resourceType` (Short): 资源类型
- `decoration.houseType` (String): 房屋类别 , 包括: 期房 , 现房
- `decoration.houseClass` (String): 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
- `decoration.houseArea` (Integer): 建筑面积
- `decoration.notSalesmanRate` (Integer): 非业务人员比例
- `decoration.busitype` (Long): 业务类型ID
- `decorationInfo.notSalesmanName` (String): 非业务员名
- `decorationInfo.notSalesmanPhone` (String): 非业务员电话
- `decorationInfo.notSalesmanContent` (String): 非业务员备注
- `decorationInfo.backOrderName` (String): 返单人员名
- `decorationInfo.backOrderPhone` (String): 返单人员电话
- `decorationInfo.backOrderContent` (String): 返单人员备注

```json
{
    "decoration.customer.cid": 1,
    "deocrationOrder.house.hid": 1,
    "decoration.designer.userId": "U001",
    "decoration.salesman.userId": "U002",
    "decoration.quoter.userId": "U003",
    "decoration.escorter.userId": "U004",

    "decoration.type": 0,
    "decoration.typeness": 0,
    "decoration.houseArea": 111,
    "decoration.houseClass": "二手",
    "decoration.houseType": "期房",
    "decoration.notSalesmanRate": 30,

    "decoration.busitype": 1,

    "decorationInfo.notSalesmanContent": "",
    "decorationInfo.notSalesmanName": "",
    "decorationInfo.notSalesmanPhone": "",
    "decorationInfo.backOrderContent": "",
    "decorationInfo.backOrderName": "",
    "decorationInfo.backOrderPhone": ""
}
```


##### `查询` createDecorationForAdvance

创建装修单 , 楼盘号不能重复 , 不针对客户多单进行校验

判断楼盘楼号是否已经绑定装修单 , 装修单状态为5(废单)和6(终止)除外 , 错误信息 **140034 订单楼盘,楼号已存在**

创建的装修单绑定当前归属公司的默认报价版本

根据装修单基本信息生成装修单信息

根据设计师和业务员生成装修单归属信息 , 包括归属设计/业务对应的人员/部门/分区 , 以及相应的比例等信息

根据设计师和业务员生成附加信息 , 包括设计/业务人员/部门/分区名称 , 保护期等信息

根据当前服务节点信息 , 生成装修单对应的服务信息

生成装修单对应的预算审核信息

**Requests:**

- `decoration.customer.cid` (Long): 客户Id
- `decoration.house.hid` (Long): 房产ID
- `decoration.designer.userId` (String): 设计师编号
- `decoration.salesman.userId` (String): 业务员编号
- `decoration.quoter.userId` (String): 报价员编号
- `decoration.escorter.userId` (String): 跟单员编号
- `decoration.grade` (String): 等级
- `decoration.type` (Short): 类型
- `decoration.typeness` (Short): 类型
- `decoration.resourceType` (Short): 资源类型
- `decoration.houseType` (String): 房屋类别 , 包括: 期房 , 现房
- `decoration.houseClass` (String): 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
- `decoration.houseArea` (Integer): 建筑面积
- `decoration.notSalesmanRate` (Integer): 非业务人员比例
- `decoration.busitype` (Long): 业务类型ID
- `decorationInfo.notSalesmanName` (String): 非业务员名
- `decorationInfo.notSalesmanPhone` (String): 非业务员电话
- `decorationInfo.notSalesmanContent` (String): 非业务员备注
- `decorationInfo.backOrderName` (String): 返单人员名
- `decorationInfo.backOrderPhone` (String): 返单人员电话
- `decorationInfo.backOrderContent` (String): 返单人员备注

```json
{
    "decoration.customer.cid": 1,
    "deocrationOrder.house.hid": 1,
    "decoration.designer.userId": "U001",
    "decoration.salesman.userId": "U002",
    "decoration.quoter.userId": "U003",
    "decoration.escorter.userId": "U004",

    "decoration.type": 0,
    "decoration.typeness": 0,
    "decoration.houseArea": 111,
    "decoration.houseClass": "二手",
    "decoration.houseType": "期房",
    "decoration.notSalesmanRate": 30,

    "decoration.busitype": 1,

    "decorationInfo.notSalesmanContent": "",
    "decorationInfo.notSalesmanName": "",
    "decorationInfo.notSalesmanPhone": "",
    "decorationInfo.backOrderContent": "",
    "decorationInfo.backOrderName": "",
    "decorationInfo.backOrderPhone": ""
}
```


##### `查询` changeDecorationForAdvance

更改装修单高级信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

修改装修单高级信息 , 装修单状态为: 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可修改

修改信息包括业务员信息 , 房屋类别 , 房屋类型 , 类型 , 报价员以及跟单员 , 等级

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.house.buildArea` (Integer): 建筑面积
- `decoration.house.quoteArea` (Integer): 计价面积
- `decoration.quoter.userId` (String): 报价员编号
- `decoration.escorter.userId` (String): 跟单员Id
- `decoration.grade` (String): 等级
- `decoration.houseType` (String): 房屋类别 , 包括: 期房 , 现房
- `decoration.houseClass` (String): 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
- `decoration.notSalesmanRate` (Integer): 非业务人员比例
- `decoration.busitype` (Long): 业务类型ID
- `decorationInfo.notSalesmanName` (String): 非业务员名
- `decorationInfo.notSalesmanPhone` (String): 非业务员电话
- `decorationInfo.notSalesmanContent` (String): 非业务员备注

```json
{
    "decoration.orderId": "1601010001",
    "decoration.house.buildArea": 1000,
    "decoration.house.quoteArea": 1000,
    "decoration.quoter.userId": "U003",
    "decoration.escorter.userId": "U004",
    "decoration.grade": "A",
    "decoration.houseType": "期房",
    "decoration.houseArea": 10000,
    "decoration.houseClass": "清水",
    "decoration.notSalesmanRate": 0,
    "decoration.busitype": 1,
    "decorationInfo.notSalesmanName": "",
    "decorationInfo.ordenotSalesmanPhonerId": "",
    "decorationInfo.notSalesmanContent": "",
}
```


##### `查询` changeDecorationForCustomer

更改装修单归属客户

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断客户是否存在 , 不存在 , 错误信息 **130002 客户不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.customer.cid` (Long): 客户ID

```json
{
    "decoration.orderId": "1601010001",
    "decoration.customer.cid": 1
}
```


##### `查询` changeDecorationForHouse

更改装修单归属房产

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断房产是否存在 , 不存在 , 错误信息 **320002 房产不存在**

将修改前后的房产信息生成服务记录

**Requests:**

- `decoration.orderId` (String): 编号
- `decoration.house.hid` (Long): 修改房产ID

```json
{
    "decoration.orderId": "1601010001",
    "decoration.house.hid": 1
}
```


##### `查询` changeDecorationForOrderId

更改装修单编号

由于装修单号关联其他信息 , 所以不能轻易修改

判断修改装修单号是否存在 , 已经存在 , 错误信息 **140010 订单编号已经存在**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

根据修改装修单号信息生成服务记录

**Requests:**

- `decoration.orderId` (String): 原装修单号
- `decorationId` (String): 新装修单号

```json
{
    "decoration.orderId": "1601010001",
    "decorationId": "1601010002"
}
```


##### `查询` changeDecorationForTime

更改装修单相关时间 , 例: 创建时间 , 签单时间

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

根据修改的时间信息生成服务记录

**Requests:**

- `decoration.orderId` (String): 装修单号
- `timeType` (Integer): 修改时间类型 , 1: 创建时间 , 2: 签单时间
- `dateTime` (Timestamp): 修改时间

```json
{
    "decoration.orderId": "1601010001",
    "timeType": 1,
    "dateTime": "2016-01-01 00:00:00"
}
```


##### `查询` changeDecorationForVersionId

更改装修单报价版本

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可更改 , 错误信息 **140004 装修单状态不可操作**

装修单更改报价版本之后 , 已经存在的报价相关内容将被删除 , 保证报价关联的版本信息一致

已经存在的报价相关内容将被删除 , 保证报价关联的版本信息一致

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.versionId` (String): 报价版本

```json
{
    "decoration.orderId": "1601010001",
    "decoration.versionId": "QV001"
}
```


##### `查询` changeDecorationForPayScale

修改装修单付款比例

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```


##### `查询` changeDecorationForStatus

修改装修单状态

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

由于装修单状态较多关联信息以及节点控制 , 更改之后可能引发数据问题

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.status` (Short): 状态

```json
{
    "decoration.orderId": "1601010001",
    "decoration.status": 1
}
```


##### `查询` changeDecorationForRepairStatus

修改装修单保修状态

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.repairStatus` (Short): 保修状态

```json
{
    "decoration.orderId": "1601010001",
    "decoration.repairStatus": 0
}
```


##### `查询` obsoleteDecoration

废单

装修单状态为3(签约)/4(重签)/5(废单)/6(终止)/7(决算)/8(完结) , 不能完成废单操作 , 其他状态可以完成操作

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 废单状态 , 错误信息 **140021 订单已处于废单状态**

判断装修单状态 , 签约状态 , 错误信息 **140022 订单已签约,不可废单**

判断装修单状态 , 完工状态 , 错误信息 **140023 订单已完工,不可废单**

判断装修单状态 , 终止状态 , 错误信息 **140024 订单合同终止,不可废单**

判断装修单状态 , 重签状态 , 错误信息 **140026 订单重新签约,不能终止合同**

更新装修单状态为5(废单)

生成装修单操作记录

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```


##### `查询` terminalDecoration

终止

装修单状态为2(预签) , 通过预付款完成扣款动作 , 同时验证预付款余额

装修单状态为3(签约) , 通过已交款项完成扣款动作

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断涉及款项总额与交款总额 , 如果超过 , 错误信息 **150025 款项金额不正确**

根据涉及款项信息 , 生成对应款项 , 交款总额如有结余 , 生成合同退款

更新装修单状态为6(终止) , 生成装修单操作记录

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001",

    "decorationPayments[0].paymentType": "合同退款",
    "decorationPayments[0].referMoney": 100
}
```


##### `查询` subDecorationForQuotationTime

装修单拷贝报价限制次数减一

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```


##### `查询` updateDecorationForAdvance

更改装修单高级信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

修改装修单高级信息 , 装修单状态为: 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可修改

修改信息包括类型, 业务类型, 非业务提点

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.type` (Short): 类型
- `decoration.typeness` (Short): 类型
- `decoration.notSalesmanRate` (Integer): 非业务人员比例

```json
{
    "decoration.orderId": "1601010001",
    "decoration.type": 0,
    "decoration.typeness": 0,
    "decoration.notSalesmanRate": 0
}
```


##### `查询` updateDecorationForPayScale

更新装修单付款比例

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```


##### `查询` updateDecorationForSaleScale

更新装修单销售比例

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

## 信息


装修单相关信息


> **类**: `api.decoration.DecorationInfoAction`


#### 数据类型: `decorationInfo`

| 参数 | 说明 | 类型 |
|------|------|------|
| `diid` | 信息ID | Long |
| `orderId` | 装修单号 | String |
| `notSalesmanName` | 非业务员名 | String |
| `notSalesmanPhone` | 非业务员电话 | String |
| `notSalesmanContent` | 非业务员备注 | String |
| `backOrderName` | 返单人员名 | String |
| `backOrderPhone` | 返单人员电话 | String |
| `backOrderContent` | 返单人员备注 | String |
| `isConfirmPricture` | 确认图纸 , 0: 已确认 , 1: 待确认 | Short |
| `isConfirmDesign` | 确认设计 , 0: 已确认 , 1: 待确认 | Short |


##### `查询` queryDecorationInfoByOrderId

通过装修单号获取装修单信息

**Requests:**

- `decorationInfo.orderId` (String): 装修单号

```json
{
    "decorationInfo.orderId": "1601010001"
}
```

**Returns:**

- `decorationInfo` (Object): 合同信息 , 类型 `decorationInfo`

```json
{
    ...
    "decorationInfo":{
        "diid": 1,
        "orderId": "1601010001",
        "notSalesmanContent": "",
        "notSalesmanName": "",
        "notSalesmanPhone": "",
        "backOrderContent": "",
        "backOrderName": "",
        "backOrderPhone": "",
        "isConfirmPricture": 0,
        "isConfirmDesign": 0
    },
    ...
}
```


##### `查询` sendDecorationInfoForConfirm

发送确认装修信息消息

**Requests:**

- `decorationInfo.orderId` (String): 装修单号
- `decorationInfo.isConfirmPricture` (Short): 施工图确认
- `decorationInfo.isConfirmDesign` (Short): 施工图确认

```json
{
    "decorationInfo.orderId": "1601010001",
    "decorationInfo.isConfirmPricture": 1,
    "decorationInfo.isConfirmDesign": 1
}
```


##### `查询/创建` confirmDecorationInfo

确认装修单信息 , 其中包括施工图确认

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

**Requests:**

- `decorationInfo.orderId` (Long): 信息ID
- `decoration.customer.phone` (String): 电话
- `decorationInfo.isConfirmPricture` (Short): 施工图确认
- `decorationInfo.isConfirmDesign` (Short): 设计确认

```json
{
    "constructionInfo.orderId": 1,
    "decoration.customer.phone": "138xxxx9283",

    "constructionInfo.isConfirmPricture": 1,
    "constructionInfo.isConfirmDesign": 1
}
```

## 附加


装修单附加信息


> **类**: `api.decoration.DecorationAdditionAction`


#### 数据类型: `decorationAddition`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daid` | 附加信息ID | Long |
| `orderId` | 装修单号 | String |
| `designer` | 设计师 | String |
| `designDepartment` | 设计部 | String |
| `designRegion` | 设计大区 | String |
| `salesman` | 业务员 | String |
| `salesDepartment` | 业务部 | String |
| `salesRegion` | 业务大区 | String |


##### `查询` queryDecorationAdditionByOrderId

通过装修单号获取附加信息

**Requests:**

- `decorationAddition.orderId` (String): 装修单号

```json
{
    "decorationAddition.orderId": "1601010001"
}
```

**Returns:**

- `decorationAddition` (Object): 合同信息 , 类型 `decorationAddition`

```json
{
    ...
    "decorationAddition":{
        "diid": 1,
        "orderId": "1601010001",
        "designer": "设计师",
        "designDepartment": "设计一部",
        "designRegion": "设计一分区",
        "salesman": "业务员",
        "salesDepartment": "业务一部/业务二部",
        "salesRegion": "业务一分区/业务二分区"
    },
    ...
}
```


##### `查询` queryDecorationConfig

获取装修单配置信息 , 例如半价配置等

满减配比 , 字段说明 , id(编号)/n(名称)/mm(主材配比)/dd(折扣-十进制)/db(折扣基数)/dt(装修单类型)/sr(服务费比例)/v(显示标识)

**Requests:**

- `typeness` (List): 类型列表 , 每条数据类型 Short , 半包/半价/...

```json
{
    "typeness[0]": 0
    "typeness[1]": 1
}
```

**Returns:**

- `config` (Object): 配置信息 , 类型 Map <String, Object>

```json
{
    ...
    "config":{
        machingType: [
            {
                "id":0,
                "n":"半价-1.5主材配比",
                "mm":"1.5",
                "dd":"5",
                "db":"1",
                "dt":"2",
                "sr":"100",
                "v": 0
            }
        ]
    },
    ...
}
```


##### `查询/创建` queryDecorationSchedule

获取装修单对应的进度信息 , 进度包括:

0(订单生成) , 1(预算) , 2(合同签单) , 3(签单设计方案完成) , 4(开工设计方案完成) ,

5(铲大白) , 6(放线) , 7(力工) , 8(水暖) , 9(电工) , 10(瓦工) , 11(地面找平) ,

12(木工) , 13(油工) , 14(决算) , 15(保洁)

根据装修单的状态/设计状态/工程状态 , 报价 , 装修信息的效果图完成进度的确认

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

## 量房


装修量尺信息


> **类**: `api.decoration.DecorationMeasureAction`


#### 数据类型: `decorationMeasure`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dmid` | 量房ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `applayTime` | 申请时间 | Timestamp |
| `content` | 说明 | String |
| `actualTime` | 量房时间 | Long |
| `startTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `status` | 状态 , 0: 排队, 1: 申请, 2: 成功, 3: 失败 | Short |
| `count` | 申请次数 | Short |
| `appler` | 申请人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `measurer` | 量房员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `company` | 公司ID | Long |


##### `查询` pageDecorationMeasure


##### `查询` queryDecorationMeasure


##### `查询` applayDecorationMeasure


##### `查询` sendDecorationMeasure


##### `查询` confirmDecorationMeasure


##### `查询` successDecorationMeasure


##### `查询` failureDecorationMeasure

## 合同


装修单合同相关操作


> **类**: `api.decoration.DecorationContractAction`


#### 数据类型: `decorationContract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dcid` | 合同ID | Long |
| `orderId` | 装修单号 | String |
| `cid` | 合同ID | Long |
| `no` | 合同编号 | String |
| `name` | 名称 | String |
| `title` | 标题 | String |
| `download` | 下载地址 | String |
| `viewpdf` | 查看地址 | String |
| `filesize` | 文件大小 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `signner` | 签署人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comsignTime` | 公司签时间 | Timestamp |
| `cussignTime` | 客户签时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地) | Short |
| `ishow` | 显示标识 | Short |


##### `查询` queryDecorationContractByOrderId

通过装修单号获取合同信息

**Requests:**

- `decorationContract.orderId` (String): 装修单号

```json
{
    "decorationContract.orderId": "1601010001"
}
```

**Returns:**

- `decorationContracts` (List): 合同信息列表 , 类型 `decorationContract`

```json
{
    ...
    "decorationContract":[
        {
            "dcid": 1,
            "orderId": "1601010001",
            "no": "74HENIDH121H",
            "name": "合同模版",
            "title": "合同标题",
            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
            "download": "JKLSHFD213J12GH312U32.pdf",
            "filesize": 0,
            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "signner": null,
            "createTime": "2016-01-01 00:00:00",
            "comsignTime": null,
            "cussignTime": null,
            "status": 0,
            "ishow": 0
        },
        ...
    ],
    ...
}
```


##### `查询/创建` queryDecorationContract

通过装修单号获取合同信息

**Requests:**

- `decorationContract.orderId` (String): 装修单号

```json
{
    "decorationContract.orderId": "1601010001"
}
```

**Returns:**

- `decorationContracts` (List): 合同信息列表 , 类型 `decorationContract`

```json
{
    ...
    "decorationContract":[
        {
            "dcid": 1,
            "orderId": "1601010001",
            "no": "74HENIDH121H",
            "name": "合同模版",
            "title": "合同标题",
            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
            "download": "JKLSHFD213J12GH312U32.pdf",
            "filesize": 0,
            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "signner": null,
            "createTime": "2016-01-01 00:00:00",
            "comsignTime": null,
            "cussignTime": null,
            "status": 0,
            "ishow": 0
        },
        ...
    ],
    ...
}
```


##### `查询` sendDecorationContractForAuth

发送认证通知

**Requests:**

- `decorationContract.orderId` (String): 装修单号

```json
{
    "decorationContract.orderId": "1601010001"
}
```


##### `查询` sendDecorationContract

发送合同通知

通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID
- `decorationContract.type` (Short): 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载

```json
{
    "decorationContract.dcid": 1,
    "decorationContract.type": 1
}
```


##### `查询` redirectDecorationContract

跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址

类型包括1(签章)/2(签订)/3(查看)/4(下载)

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID

```json
{
    "decorationContract.dcid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` viewDecorationContract

查看合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID

```json
{
    "decorationContract.dcid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` signDecorationContractForCompany

签订合同 , 针对公司信息

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID
- `signet.sid` (Long): 签章ID

```json
{
    "decorationContract.dcid": 1,
    "signet.sid": 1
}
```


##### `查询` signDecorationContractForCustomer

签订合同 , 针对客户信息

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID
- `customer.cid` (Long): 客户ID

```json
{
    "decorationContract.dcid": 1,
    "customer.cid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=sign",
    ...
}
```


##### `查询` addDecorationContract

创建合同

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断合同模版是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

**Requests:**

- `decorationContract.orderId` (String): 装修单号
- `contract.cid` (Long): 合同模版ID

```json
{
    "decorationContract.orderId": "1601010001",
    "contract.cid": 1,
}
```


##### `查询` makeDecorationContract

生成合同

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断合同模版是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**

判断装修合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

**Requests:**

- `decorationContract.dcid` (String): 装修合同ID
- `decorationContract.orderId` (String): 装修单号
- `contract.cid` (Long): 合同模版ID
- `data` (String): 模版参数 , 字符串类型的JSON格式对象

```json
{
    "decorationContract.dcid": 1,
    "contract.cid": 1,
    "data": "{"data": "数据内容格式"}"
}
```


##### `查询` affixDecorationContract

签订合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

更新装修合同为1(已签)

**Requests:**

- `decorationContract.dcid` (Long): 合同ID

```json
{
    "decorationContract.dcid": 1
}
```


##### `查询` expireDecorationContract

失效合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

更新装修合同为2(失效)

**Requests:**

- `decorationContract.dcid` (Long): 合同ID

```json
{
    "decorationContract.dcid": 1
}
```


##### `查询` filingDecorationContract

归档合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为1(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID

```json
{
    "decorationContract.dcid": 1
}
```


##### `查询` showDecorationContract

合同显示控制

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

**Requests:**

- `decorationContract.dcid` (Long): 合同ID
- `decorationContract.ishow` (Short): 显示标识

```json
{
    "decorationContract.dcid": 1,
    "decorationContract.ishow": 0
}
```


##### `查询` presignDecorationContract

预签合同

装修单状态需要为: 0(初始)/1(定金)

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 0(初始)/1(定金)之外的其他状态不能预签 , 错误信息 **140005 订单合同不能修改**

判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

装修款中 , 一类为0(收款), 二类为1(合同)的款项 , 至少存在一个款项状态为已付款/已确认

更新装修单状态为2(预签)

生成装修单操作记录

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001",
    "decoration.presignPrice": 100
}
```


##### `查询` signDecorationContract

签订合同

装修单状态需要为: 0(初始)/1(定金)/2(预签)/4(重签)

装修款中 , 一类为0(收款), 二类为1(合同)的款项 , 至少存在一个款项状态为已付款/已确认

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 3(签约)/5(废单)/6(终止)/7(决算)/8(完结)不能签约 , 错误信息 **140005 订单合同不能修改**

判断装修单对应款项 , 一状态为0(收款) , 二状态为1(合同) , 款项状态为已付款或已确认的款项是否存在 , 不存在 , 错误信息 **140006 订单没有进行款项交付,不能签订合同**

判断装修单是否有未处理审批 , 存在未处理审批不能重签 , 错误信息 **140037 订单存在未处理审批项**

判断装修单是否存在默认报价 , 不存在 , 错误信息 **140008 订单没有报价信息**

判断工程信息是否存在 , 不存在 , 错误信息 **120020 工程信息不存在**

判断工程信息中预计领钥匙时间是否配置 , 没有配置预计领钥匙时间 , 错误信息 **120031 未配置预计领取钥匙时间**

判断工程信息中预计放线时间是否配置 , 没有配置预计领钥匙时间 , 错误信息 **120032 未配置预计放线时间**

更新装修单状态为3(签约) , 签约操作人

装修单状态为非重签状态 , 按照归属信息中的设计师和业务员更新设计部/分区和业务部/分区 , 更新签约时间

生成装修单操作记录

根据装修单默认报价 , 更新净业绩和复合业绩

净业绩 = 合同额 - 券优惠额 - 奖品优惠额 - ((∑打折项 + ∑非打折项 + 车运费) * 非业务提点

复合业绩 = ((∑打折项 * 0.88 + ∑非打折项 + 车运费 + 管理费 - (∑打折项 + ∑非打折项 + 车运费) * 非业务提点) * 0.38 - 券优惠额 - 奖品优惠额 + (签单额 - (∑打折项 * 0.88 + ∑非打折项 + 车运费 + 管理费))) / 0.38

复合业绩 = ((88折合同额 - 非业务提成) * 0.38 - 优惠额 + (合同额 - 88折合同额)) / 0.38 , 简版说明

**Requests:**

- `decorationContract.orderId` (String): 装修单号

```json
{
    "decorationContract.orderId": "1601010001"
}
```


##### `查询` resignDecorationContract

重签合同

装修单状态需要为: 重签

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态为4(重签) , 其他状态不能重签 , 错误信息 **140027 订单状态不能重签合同**

判断装修单是否有未处理审批 , 存在未处理审批不能重签 , 错误信息 **140037 订单存在未处理审批项**

判断装修单是否存在增减项 , 存在增减项不能重签 , 错误信息 **140041 订单存在增减项,不能重新签单**

判断装修活动 , 存在状态0(初始)/2(接收)的物品/券 , 错误信息 **140058 订单活动奖品未处理**

更新装修单状态为4(重签)

生成装修单操作记录

**Requests:**

- `decorationContract.orderId` (String): 装修单号

```json
{
    "decorationContract.orderId": "1601010001"
}
```

## 半包


装修单半包模式说明


> **类**: `api.decoration.DecorationMidpackAction`


#### 数据类型: `decorationMidpack`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dmid` | 半包ID | Long |
| `decoration` | 装修单信息 , 类型 [decoration ](./decoration.html#api.decoration.DecorationAction.decoration) | Object |
| `name` | 名称 | String |
| `trafficRate` | 车运费折扣 , 0: 不打折 , 1: 打折 |  |
| `trafficRate` | 车运费折扣 , 0: 不打折 , 1: 打折 |  |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理折扣 , 0: 不打折 , 1: 打折 | Short |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 , 0: 管理税金 , 1: 总额税金 | Short |
| `materialRate` | 主材配比 | Integer |
| `materialOrigin` | 原主材额 | Long |
| `materialPrice` | 主材额 | Long |
| `materialPaidup` | 主材实付额 | Long |
| `serviceRate` | 服务费配比 | Integer |
| `servicePrice` | 服务费 | Long |
| `servicePaidup` | 服务实付费 | Long |
| `status` | 状态 , 包括: 0(初始) | Short |


##### `查询` queryDecorationMidpack

获取装修单对应的半包信息

**Requests:**

- `decorationMidpack.orderId` (String): 装修单号

```json
{
    "decorationMidpack.orderId": "1601010001"
}
```

**Returns:**

- `decorationMidpack` (Object): 半包信息 , 每条数据类型 `decorationMidpack`

```json
{
    ...
    "decorationMidpack": {
        "dmid": 1,
        "decoration": {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "id": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1"
                "buildArea": 88600
            },

            "type": 0,
            "typeness": 0,
            "busitype": 1,
            "houseType": 0,
            "houseClass": "二手",
            "resourceType": 0,
            "houseArea": 111,
            "freeArea": 11,

            "notSalesmanRate": 30,
            "versionId": null,
            "versionName": null,
            "discount": 10,

            "presignPrice": 50,
            "signPrice": 10000,
            "quotationPrice": 10000,
            "factPrice": 10000,

            "createTime": "2016-01-01",
            "measureTime": null,
            "depositTime": null,
            "signTime": null,
            "presignTime": null,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,

            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "U0003",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "U0938",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            },
            "quoter": null,
            "escorter": null,
            "supervisor": null,
            "contracter": null,

            "designDepartment": "设计中心一部",
            "designRegion": "设计一分区",
            "businessDepartment": "市场营销一部"
        },
        "name": "",
        "trafficRate": 0
        "trafficDiscount": 0,
        "manageRate": 160,
        "manageDiscount": 0,
        "taxRate": 100,
        "taxDiscount": 0,
        "materialRate": 0
        "materialOrigin": 0,
        "materialPrice": 116000,
        "materialPaidup": 116000,
        "serviceRate": 1000,
        "servicePrice": 11600,
        "servicePaidup": 0
    }
    ...
}
```


##### `查询` makeDecorationMidpack

生成装修单对应半包信息 , 通过款项比例对应的比例项信息生成装修款信息

如果装修单没有生成半包信息 , 创建信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态是否为0(初始)/1(定金)/2(预签)/4(重签) , 其他状态 , 错误信息 **140004 装修单状态不可操作**

判断装修单默认报价是否存在 , 不存在 , 错误信息 **200003 报价不存在**

判断装修单对应默认报价状态是否为1(锁定) , 其他状态 , 错误信息 **200031 报价未锁定**

判断装修单归属活动是否存在状态为0(初始) , 存在该状态活动 , 错误信息 **140060 活动未锁定**

获取装修单对应装修款信息 , 类型onetype为0(收款) , twotype为1(合同) ,状态为初始可以更新 , 其他状态不能更新 , 错误信息 **150001 款项已付,不可修改**

利用默认报价总额作为生成款项金额

装修款更新款项信息

**Requests:**

- `decorationMidpack.orderId` (String): 装修单号
- `decorationMidpack.psid` (Long): 款项比例ID
- `decorationMidpack.materialRate` (Integer): 主材配比
- `decorationMidpack.serviceRate` (Integer): 服务配比
- `decorationMidpack.materialPrice` (Integer): 主材金额

```json
{
    "decorationMidpack.orderId": "1601010001",
    "decorationMidpack.psid": 1,

    "decorationMidpack.materialRate": 100000,
    "decorationMidpack.serviceRate": 100000,

    "decorationMidpack.materialPrice": 100000
}
```


##### `查询` updateDecorationMidpack

更新半包信息

**Requests:**

- `decorationMidpack.orderId` (String): 装修单号
- `decorationMidpack.materialPrice` (Integer): 主材金额

```json
{
    "decorationMidpack.orderId": "1601010001",
    "decorationMidpack.materialPrice": 0
}
```

## 满减


装修单满减模式说明 , 半价是特殊的满减方式

基础造价 = ∑打折项 + ∑非打折项 + 车运费   **注: 直接费**

工程造价 = ∑打折项 + ∑非打折项 + 车运费 + 管理费

主材造价 = (∑打折项 + ∑非打折项 + 车运费 + 管理费) * 主材配比

服务费 = 主材造价 * 服务费配比

合同额 = (基础造价 - 基础造价 % 基数) * 折扣 + 基础造价 % 基数 + 管理费


| 主材配比 | 装修单折扣 |
| --- | --- |
| 120% | 7.2 |
| 150% | 6.5 |
| 180% | 5.6 |
| 200% | 5 |


> **类**: `api.decoration.DecorationHolonomyAction`


#### 数据类型: `decorationHolonomy`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dhid` | 半价ID | Long |
| `decoration` | 装修单信息 , 类型 [decoration ](./decoration.html#api.decoration.DecorationAction.decoration) | Object |
| `name` | 名称 | String |
| `maching` | 主材配比 | Long |
| `discount` | 装修单折扣 | Long |
| `discountBase` | 折扣基数 | Long |
| `projectBase` | 工程基础 , 与报价额等同 | Long |
| `projectPrice` | 工程总额 , 折后工程额 | Long |
| `trafficRate` | 车运费比例 | Integer |
| `trafficDiscount` | 车运费折扣 , 0: 不打折 , 1: 打折 | Short |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理折扣 , 0: 不打折 , 1: 打折 | Short |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 , 0: 管理税金 , 1: 总额税金 | Short |
| `taxPrice` | 税金 | Long |
| `originMaterialPrice` | 原主材总额 | Long |
| `materialPrice` | 主材总额 | Long |
| `materialPaidup` | 主材实付额 | Long |
| `servicePrice` | 服务费 | Long |
| `serviceRate` | 服务费比例 | Integer |
| `servicePaidup` | 服务费实收 | Long |
| `status` | 状态 , 包括: 0(初始) , 1(决算) | Short |


##### `查询` pageDecorationHolonomy

分页方式获取装修单满减信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单满减信息列表 , 每条数据类型 `decorationHolonomy`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "dhid": 1,
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001"
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88600,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0
                    },

                    "type": 0,
                    "typeness": 0,
                    "busitype": 1,
                    "houseType": 0,
                    "houseClass": "二手",
                    "resourceType": 0,

                    "notSalesmanRate": 30,
                    "versionId": null,
                    "versionName": null,
                    "discount": 10,

                    "presignPrice": 50,
                    "signPrice": 10000,
                    "quotationPrice": 10000,
                    "factPrice": 10000,

                    "createTime": "2016-01-01",
                    "measureTime": null,
                    "depositTime": null,
                    "signTime": null,
                    "presignTime": null,

                    "status": 0,
                    "designStatus": 0,
                    "projectStatus": 0,
                    "sourceStatus": 0,
                    "repairStatus": 0,
                    "balanceStatus": 0,
                    "otherStatus": 0,

                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "U0003",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "U0938",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "quoter": null,
                    "escorter": null,
                    "supervisor": null,
                    "contracter": null,

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部"
                },
                "name": "",
                "maching": 2,
                "discount": 5,
                "discountbase": 1,
                "projectBase": 50000,
                "projectPrice": 25000,
                "originMaterialPrice": "8000",
                "trafficRate": 0
                "trafficDiscount": 0,
                "manageRate": 160,
                "manageDiscount": 0,
                "taxRate": 100,
                "taxDiscount": 0,
                "taxPrice": 0,
                "materialPrice": 116000,
                "servicePrice": 11600,
                "serviceRate": 100,
                "materialPaidup": 0,
                "servicePaidup": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDecorationHolonomy

获取装修单对应的满减信息

**Requests:**

- `decorationHolonomy.orderId` (String): 装修单号

```json
{
    "decorationHolonomy.orderId": "1601010001"
}
```

**Returns:**

- `decorationHolonomy` (Object): 满减信息 , 每条数据类型 `decorationHolonomy`

```json
{
    ...
    "decorationHolonomy": {
        "dhid": 1,
        "decoration": {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "id": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1"
                "buildArea": 88600
            },

            "type": 0,
            "typeness": 0,
            "busitype": 1,
            "houseType": 0,
            "houseClass": "二手",
            "resourceType": 0,
            "houseArea": 111,
            "freeArea": 11,

            "notSalesmanRate": 30,
            "versionId": null,
            "versionName": null,
            "discount": 10,

            "presignPrice": 50,
            "signPrice": 10000,
            "quotationPrice": 10000,
            "factPrice": 10000,

            "createTime": "2016-01-01",
            "measureTime": null,
            "depositTime": null,
            "signTime": null,
            "presignTime": null,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,

            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "U0003",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "U0938",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            },
            "quoter": null,
            "escorter": null,
            "supervisor": null,
            "contracter": null,

            "designDepartment": "设计中心一部",
            "designRegion": "设计一分区",
            "businessDepartment": "市场营销一部"
        },
        "name": "",
        "maching": 2,
        "discount": 5,
        "discountbase": 1,
        "projectBase": 50000,
        "projectPrice": 25000,
        "trafficRate": 0
        "trafficDiscount": 0,
        "manageRate": 160,
        "manageDiscount": 0,
        "taxRate": 100,
        "taxDiscount": 0,
        "taxPrice": 0,
        "originMaterialPrice": "8000",
        "materialPrice": 116000,
        "servicePrice": 11600,
        "serviceRate": 100,
        "materialPaidup": 0,
        "servicePaidup": 0,
        "onecheck": 0,
        "twocheck": 0,
        "thrcheck": 0
    }
    ...
}
```


##### `查询` makeDecorationHolonomy

生成装修单对应满减信息

如果装修单没有生成满减信息 , 创建信息

如果装修单满减信息已存在 , 更新满减信息 , 其中实收主材款不能更新

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态是否为0(初始)/1(定金)/2(预签)/4(重签) , 其他状态 , 错误信息 **140004 装修单状态不可操作**

判断装修单默认报价是否存在 , 不存在 , 错误信息 **200003 报价不存在**

判断装修单对应默认报价状态是否为1(锁定) , 其他状态 , 错误信息 **200031 报价未锁定**

判断装修单归属活动是否存在状态为0(初始) , 存在该状态活动 , 错误信息 **140060 活动未锁定**

获取装修单对应装修款信息 , 类型onetype为0(收款) , twotype为1(合同) ,状态为初始可以更新 , 其他状态不能更新 , 错误信息 **150001 款项已付,不可修改**

装修单满减信息中服务费实收为0 , 否则更新失败 , 错误信息 **140043 订单满减信息不可更新**

装修款更新款项信息

**Requests:**

- `decorationHolonomy.orderId` (String): 装修单号
- `decorationHolonomy.psid` (Long): 款项比例ID
- `decorationHolonomy.maching` (Long): 主材配比
- `decorationHolonomy.discount` (Long): 折扣
- `decorationHolonomy.serviceRate` (Integer): 服务费配比

```json
{
    "decorationHolonomy.orderId": "1601010001",
    "decorationHolonomy.psid": 1,
    "decorationHolonomy.manageRate": 1006,
    "decorationHolonomy.maching": 2,
    "decorationHolonomy.discount": 5,
    "decorationHolonomy.discountBase": 1,
    "decorationHolonomy.serviceRate": 100
}
```


##### `查询` updateDecorationHolonomy

更新装修满减信息

判断满减信息是否存在 , 不存在 , 错误信息 **140042 满减信息不存在**

更细内容主要为 , 主材总额

**Requests:**

- `decorationHolonomy.orderId` (String): 装修单号
- `decorationHolonomy.materialPrice` (Long): 主材总额

```json
{
    "decorationHolonomy.orderId": "1601010001",
    "decorationHolonomy.materialPrice": 10010000
}
```

## 整装


装修单整装类型相关信息


> **类**: `api.decoration.DecorationInclusiveAction`


#### 数据类型: `decorationInclusive`

| 参数 | 说明 | 类型 |
|------|------|------|
| `diid` | 整装ID | Long |
| `decoration` | 装修单信息 , 类型 `decoration` | Object |
| `contractPrice` | 合同总额 | Long |
| `projectPrice` | 工程总额 | Long |
| `cdiff` | 工程差额 | Long |
| `mdiff` | 主材差额 | Long |
| `trafficRate` | 车运费折扣 , 0: 不打折 , 1: 打折 |  |
| `trafficRate` | 车运费折扣 , 0: 不打折 , 1: 打折 |  |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理折扣 , 0: 不打折 , 1: 打折 | Short |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 , 0: 管理税金 , 1: 总额税金 | Short |
| `materialPaidup` | 实收主材额 | Long |


##### `查询` pageDecorationInclusive

分页方式获取装修单整装信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单套餐信息列表 , 每条数据类型 `decorationInclusive`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "diid": 1,
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1"
                        "buildArea": 88600
                    },

                    "type": 0,
                    "typeness": 0,
                    "busitype": 1,
                    "houseType": 0,
                    "houseClass": "二手",
                    "resourceType": 0,

                    "notSalesmanRate": 30,
                    "versionId": null,
                    "versionName": null,
                    "discount": 10,

                    "presignPrice": 50,
                    "signPrice": 10000,
                    "quotationPrice": 10000,
                    "factPrice": 10000,

                    "createTime": "2016-01-01",
                    "measureTime": null,
                    "depositTime": null,
                    "signTime": null,
                    "presignTime": null,

                    "status": 0,
                    "designStatus": 0,
                    "projectStatus": 0,
                    "sourceStatus": 0,
                    "repairStatus": 0,
                    "balanceStatus": 0,
                    "otherStatus": 0,

                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "U0003",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "U0938",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "quoter": null,
                    "escorter": null,
                    "supervisor": null,
                    "contracter": null,

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部"
                },
                "contractPrice": 50000,
                "projectPrice": 50000,
                "cdiff": 0,
                "mdiff": 0,
                "trafficRate": 0
                "trafficDiscount": 0,
                "manageRate": 160,
                "manageDiscount": 0,
                "taxRate": 100,
                "taxDiscount": 0,
                "materialPaidup": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDecorationInclusive

获取装修单对应的套餐信息

**Requests:**

- `decorationInclusive.orderId` (String): 装修单号

```json
{
    "decorationInclusive.orderId": "1601010001"
}
```

**Returns:**

- `decorationInclusive` (Object): 满减信息 , 类型 `decorationInclusive`

```json
{
    ...
    "decorationInclusive": {
        "dhid": 1,
        "decoration": {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "id": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1"
                "buildArea": 88600
            },

            "type": 0,
            "typeness": 0,
            "busitype": 1,
            "houseType": 0,
            "houseClass": "二手",
            "resourceType": 0,
            "houseArea": 111,
            "freeArea": 11,

            "notSalesmanRate": 30,
            "versionId": null,
            "versionName": null,
            "discount": 10,

            "presignPrice": 50,
            "signPrice": 10000,
            "quotationPrice": 10000,
            "factPrice": 10000,

            "createTime": "2016-01-01",
            "measureTime": null,
            "depositTime": null,
            "signTime": null,
            "presignTime": null,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,

            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "U0003",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "U0938",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            },
            "quoter": null,
            "escorter": null,
            "supervisor": null,
            "contracter": null,

            "designDepartment": "设计中心一部",
            "designRegion": "设计一分区",
            "businessDepartment": "市场营销一部"
        },
        "contractPrice": 50000,
        "projectPrice": 50000,
        "cdiff": 0,
        "mdiff": 0,
        "trafficRate": 0
        "trafficDiscount": 0,
        "manageRate": 160,
        "manageDiscount": 0,
        "taxRate": 100,
        "taxDiscount": 0,
        "materialPaidup": 0
    }
    ...
}
```


##### `查询` makeDecorationInclusive

生成装修单对套餐信息

如果装修单没有生成套餐信息 , 创建信息

如果装修单套餐信息已存在 , 更新套餐信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态是否为0(初始)/1(定金)/2(预签)/4(重签) , 其他状态 , 错误信息 **140004 装修单状态不可操作**

判断装修单默认报价是否存在 , 不存在 , 错误信息 **200003 报价不存在**

判断装修单对应默认报价状态是否为1(锁定) , 其他状态 , 错误信息 **200031 报价未锁定**

判断装修单归属活动是否存在状态为0(初始) , 存在该状态活动 , 错误信息 **140060 活动未锁定**

获取装修单对应装修款信息 , 类型onetype为0(收款) , twotype为1(合同) ,状态为初始可以更新 , 其他状态不能更新 , 错误信息 **150001 款项已付,不可修改**

装修款更新款项信息

**Requests:**

- `decorationInclusive.orderId` (String): 装修单号
- `decorationInclusive.contractPrice` (Long): 合同总额

```json
{
    "decorationInclusive.orderId": "1601010001",
    "decorationInclusive.contractPrice": 50000
}
```

## 决算


************************************ 半包/整装 , 决算计算公式 ************************************

决算直接费 = 打折项总额 + 不打折项总额 + 车运费

决算折前总价 = 打折总额 + 不打折总额 + 车运费 + 管理费 + 税金

决算管理费 = 管理费

决算税金 = 税金

决算主材额 = 0

决算服务费 = 0

决算合同额 = 打折总额 * 折扣 + 不打折总额 + 车运费 + 管理费 + 税金

差额 = 决算合同额 + 决算服务费 - 合同实收 - 服务费实收 - 优惠券 - 内部优惠 - 满送 - 返现

************************************ 满减 , 决算计算公式 **************************************

决算直接费(配比) = 打折总额 + 不打折总额 + 车运费 + 增项配比总额 - 减项配比总额

决算直接费(非配) = 打折总额 + 不打折总额 + 车运费

决算管理费(配比) = 管理费 + 增项管理费 - 减项管理费

决算管理费(非配) = 管理费

决算税金(配比) = 税金 + 增项税金 - 减项税金

决算税金(非配) = 税金

决算折前总额(配比) = 打折总额 + 不打折总额 + 车运费 + 增项配比总额 - 减项配比总额 + 管理费 + 增项管理费 - 减项管理费 + 税金 + 增项税金 - 减项税金

决算折前总额(非配) = 打折总额 + 不打折总额 + 车运费 + 管理费 + 税金

决算主材额 = 决算折前总额 * 主材配比

决算服务费(配比) = (决算直接费 + 管理费 + 增项管理费 - 减项管理费 + 税金 + 增项税金 - 减项税金) * 主材配比 * 服务费比例

决算服务费(非配) = (决算直接费 + 管理费 + 税金) * 主材配比 * 服务费比例

决算合同额(配比) = (决算直接费 - 决算直接费 % 基数) * 折扣 + 决算直接费 % 基数 + 管理费 + 增项管理费 - 减项管理费 + 税金 + 增项税金 - 减项税金

决算合同额(非配) = (决算直接费 - 决算直接费 % 基数) * 折扣 + 决算直接费 % 基数 + 管理费 + 税金

差额(配比) = 决算合同额 + 决算服务费 - 合同实收 - 服务费实收 - 增项实收 + 减项实收 + 增项非配比总额 - 优惠券 - 内部优惠 - 满送 - 返现

差额(非配) = 决算合同额 + 决算服务费 - 合同实收 - 服务费实收 - 优惠券 - 内部优惠 - 满送 - 返现

************************************ ************************ ************************************

决算直接费 = 打折总额 + 不打折总额 + 车运费 + 增项配比总额(配) - 减项配比总额(配)

决算管理费 = 管理费 + 增项管理费(配) - 减项管理费(配)

决算税金 = 税金 + 增项税金(配) - 减项税金(配)

决算折前总额 = 决算直接费 + 决算管理费 + 决算税金

决算主材额 = 决算折前总额 * 主材配比

决算服务费 = 决算折前总额 * 主材配比 * 服务费比例

决算合同额 = (决算直接费 - 决算直接费 % 基数) * 折扣 + 决算直接费 % 基数 + 管理费(折) + 增项管理费(折)(配) - 减项管理费(折)(配) + 税金(折) + 增项税金(折)(配) - 减项税金(折)(配)

差额 = 决算合同额 + 决算服务费 - 合同实收 - 服务费实收 - 增项实收(配) + 减项实收(配) + 增项非配比总额(配) - 优惠券 - 内部优惠 - 满送 - 返现

************************************ ************************ ************************************


> **类**: `api.decoration.DecorationAccountAction`


#### 数据类型: `decorationAccount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daid` | 决算ID | Long |
| `orderId` | 装修单号 | String |
| `type` | 类型 , 0: 半包 , 1: 套餐 , 2: 半价, 3: 满减 | Short |
| `arcal` | 增减配比计算 , 0: 计算配比 , 1: 不计算配比 | Short |
| `matching` | 主材配比 | Integer |
| `discount` | 折扣 | Integer |
| `discountBase` | 折扣基数 | Long |
| `serviceRate` | 服务费比例 | Integer |
| `materialPrice` | 主材总额 | Long |
| `servicePrice` | 服务费 | Long |
| `paidupMatching` | 实花配比 | Integer |
| `difference` | 差额 | Long |
| `coupon` | 券优惠 | Long |
| `fulldel` | 满送 | Long |
| `cashback` | 返现 | Long |
| `internal` | 内部优惠 | Long |
| `isAffirm` | 是否确认 , 0: 初始 , 1: 确认 | Short |
| `affirmTime` | 确认时间 | Timestamp |


##### `查询` queryDecorationAccount

获取装修单对应的决算信息

**Requests:**

- `decorationAccount.orderId` (String): 装修单号

```json
{
    "decorationAccount.orderId": "1601010001"
}
```

**Returns:**

- `decorationAccount` (Object): 决算信息 , 每条数据类型 `decorationAccount`

```json
{
    ...
    "decorationAccount": {
        "daid": 1,
        "orderId": "1601010001",
        "type": 0,
        "arcal": 0,
        "maching": 2,
        "discount": 5,
        "discountBase": 1000,
        "serviceRate": 100,
        "materialPrice": 116000,
        "servicePrice": 11600,
        "paidupMatching": 0,
        "difference": 1000,
        "coupon": 0,
        "fulldel": 0,
        "cashback": 0,
        "internal": 0
    }
    ...
}
```


##### `查询` updateDecorationAccount

更新装修决算信息

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

装修单状态为3(签约)能够生成决算信息 , 错误信息 **140004 装修单状态不可操作**

**Requests:**

- `decorationAccount.orderId` (String): 装修单号
- `decorationAccount.type` (Short): 类型
- `decorationAccount.arcal` (Short): 增减配比计算
- `decorationAccount.maching` (Integer): 主材配比
- `decorationAccount.discount` (Long): 折扣
- `decorationAccount.serviceRate` (Long): 服务费配比
- `decorationAccount.materialPrice` (Long): 主材总额
- `decorationAccount.servicePrice` (Long): 服务费
- `decorationAccount.paidupMatching` (Integer): 实话配比
- `decorationAccount.difference` (Long): 差额
- `decorationAccount.coupon` (Long): 券优惠
- `decorationAccount.fulldel` (Long): 满减
- `decorationAccount.cashback` (Long): 返现
- `decorationAccount.internal` (Long): 内部优惠

```json
{
    "decorationAccount.orderId": "1601010001",
    "decorationAccount.type": 0,
    "decorationAccount.arcal": 0,
    "decorationAccount.maching": 2,
    "decorationAccount.discount": 5,
    "decorationAccount.manageRate": 1006,
    "decorationAccount.serviceRate": 100,
    "decorationAccount.materialPrice": 10000,
    "decorationAccount.servicePrice": 10000,
    "decorationAccount.paidupMatching": 0,
    "decorationAccount.difference": 1000,
    "decorationAccount.coupon": 0,
    "decorationAccount.fulldel": 0,
    "decorationAccount.cashback": 0,
    "decorationAccount.internal": 0
}
```


##### `查询` makeDecorationAccount

决算

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

装修单状态为3(签约)能够生成决算信息 , 错误信息 **140004 装修单状态不可操作**

装修款状态更新为7(决算)

生成装修单操作记录

**Requests:**

- `decorationAccount.orderId` (String): 装修单号

```json
{
    "decorationAccount.orderId": "1601010001"
}
```


##### `查询` sendDecorationAccount

推送决算信息

判断决算信息是否存在 , 不存在 , 错误信息 **140081 决算信息不存在**

**Requests:**

- `decorationAccount.orderId` (String): 装修单号

```json
{
    "decorationAccount.orderId": "1601010001"
}
```


##### `查询` affirmDecorationAccount

确认决算信息

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

判断客户编号是否绑定 , 未绑定 , 错误信息 **330017 装修单未绑定**

判断决算信息是否存在 , 不存在 , 错误信息 **140081 决算信息不存在**

**Requests:**

- `decorationAccount.orderId` (String): 装修单号
- `decoration.customer.no` (String): 编号

```json
{
    "decorationAccount.orderId": "1601010001",
    "decoration.customer.no": ""
}
```

## 归属


装修单归属信息 , 包括设计师和业务员归属管理


> **类**: `api.decoration.DecorationBelongAction`


#### 数据类型: `decorationBelong`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dbid` | 归属ID | Long |
| `orderId` | 装修单号 | String |
| `type` | 类型 , 0: 设计, 1: 业务 | Short |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `department` | 归属部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `region` | 归属分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `operater` | 操作人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `rate` | 比例 , 多个归属人员 , 比例之和等于1 | Short |
| `defaults` | 装修单归属标识 , 0: 非归属, 1: 归属 | Short |
| `status` | 状态 , 0: 有效 , 1: 无效 , 2: 确认 , 3: 审批 | Short |


##### `查询` queryDecorationBelong

获取所有类型为设计的归属信息 , 不区分状态是否有效

**Requests:**

- `decorationBelong.orderId` (String): 装修单号
- `decorationBelong.type` (Short): 类型
- `decorationBelong.status` (String): 状态

```json
{
    "decorationBelong.orderId": "1601010001",
    "decorationBelong.type": 1,
    "decorationBelong.status": 0
}
```

**Returns:**

- `decorationBelongs` (List): 归属信息列表 , 每条数据类型 `decorationBelong`

```json
{
    ...
    "decorationBelongs": [
        {
            "dbid": 1,
            "orderId": 1601010001,
            "type": 0,
            "belonger": {
                "uid": 1,
                "userId": "U0001",
                "userName": "白雪",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "department": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
            },
            "region": {
                "did": 2,
                "no": "D0022",
                "name": "市场一分区",
            },
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
            "rate": 1,
            "defaults": 1,
            "status": 1
        }
    ],
    ...
}
```

## 活动


装修单活动管理


> **类**: `api.decoration.DecorationActivityAction`


#### 数据类型: `decorationActivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daid` | 活动ID | Long |
| `orderId` | 装修单号 | String |
| `activity` | 活动信息 , 类型 [activity ](./information.html#api.information.ActivityAction.activity) | Object |
| `amount` | 总额 | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定 | Short |


#### 数据类型: `decorationActivityItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daiid` | 活动项ID | Long |
| `aid` | 活动ID | Long |
| `asid` | 奖品ID | Long |
| `orderId` | 装修单号 | String |
| `activity` | 活动名 | String |
| `name` | 活动项名 | String |
| `num` | 数量 | Integer |
| `money` | 价格 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `refunder` | 退货人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `operateTime` | 操作时间 | Timestamp |
| `refundTime` | 操作时间 | Timestamp |
| `affirmTime` | 确认时间 | Timestamp |
| `checkTime` | 核对时间 | Timestamp |
| `type` | 类型 , 0: 券 , 1: 物品 , 2: 红包 | Short |
| `state` | 状态 , 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗 , 8: 折现 | Short |
| `stateType` | 状态类型 , 0: 到点 , 1: 定金 , 2: 签单 , 3: 抽奖 , 4: 特批 , 5: 购买(过时) , 6: 其他(过时) , 7: 升级 , 8: 设计 | Short |
| `isStock` | 是否计入库存 , 0: 计入 , 1: 不计入 | Short |
| `isPrefor` | 是否计入业绩 , 0: 计入 , 1: 不计入 | Short |
| `isPayment` | 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算 | Short |
| `isAffirm` | 是否确认 , 0: 初始 , 1: 确认 , 2: 核对 | Short |
| `content` | 备注 | String |
| `comment` | 说明 | String |


##### `查询` queryDecorationActivityByOrderId

通过装修单号获取活动信息

**Requests:**

- `decorationActivity.orderId` (String): 装修单号

```json
{
    "decorationActivity.orderId": "1601010001"
}
```

**Returns:**

- `decorationActivitys` (List): 活动信息列表 , 每条数据类型 `decorationActivity`

```json
{
    ...
    "decorationActivitys": [
        {
            "daid": 1,
            "orderId": "1601010001"
            "activity": {
                "aid": 1,
                "name": "活动",
                "content": "说明"
            }
        }
    ],
    ...
}
```


##### `查询` amountDecorationActivity

汇总活动总额

**Requests:**

- `decorationActivity.orderId` (String): 装修单号
- `decorationActivityItem.type` (Short): 类型
- `decorationActivityItem.isPrefor` (Short): 是否计入业绩
- `decorationActivityItem.isPayment` (Short): 是否计入金额

```json
{
    "decorationActivity.orderId": "1601010001",
    "decorationActivityItem.type": 0,
    "decorationActivityItem.isPrefor": 0,
    "decorationActivityItem.isPayment": 0
}
```

**Returns:**

- `decorationActivity` (Object): 装修活动信息 , 类型 `decorationActivity`

```json
{
    ...
    "decorationActivity": {
            "orderId": "1601010001"
            "amount": 100000,
    }
    ...
}
```


##### `查询` queryDecorationActivityItem

通过装修单号获取装修单拥有活动项信息

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `decorationActivityItems` (List): 活动项信息列表 , 每条数据类型 `decorationActivityItem`

```json
{
    ...
    "decorationActivityItems": [
        {
            "daiid": 1,
            "orderId": "1601010001",
            "aid": 1,
            "asid": 1,
            "activity": "测试",
            "name": "测试项",

            "money": 10000,
            "num": 1,

            "creater": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "operater": null,
            "refunder": null,

            "createTime": "2016-01-01",
            "operateTime": "2016-01-01",
            "refundTime": "2016-01-01",
            "affirmTime": "2016-01-01",
            "checkTime": "2016-01-01",

            "stateType": 0,
            "state": 0,
            "type": 0,

            "isStock": 0,
            "isPrefor": 0,
            "isPayment": 0,
            "isAffirm": 0,

            "content": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addDecorationActivity

添加装修单参与活动信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签)之外的其他状态 , 错误信息 **140003 装修单已签约**

判断操作活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**

判断操作活动有效时间 , 结束时间小于当前时间 , 错误信息 **140032 活动已过期**

**Requests:**

- `decorationActivity.orderId` (String): 装修单号
- `decorationActivity.activity.aid` (Long): 活动ID

```json
{
    "decorationActivity.orderId": "1601010001",
    "decorationActivity.activity.aid": 1
}
```


##### `查询` deleteDecorationActivity

删除装修单参与活动信息

判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**

判断装修活动状态是否为0(初始) , 其他状态 , 错误信息 **140059 订单活动状态不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签)之外的其他状态 , 错误信息 **140003 装修单已签约**

更新对应装修单的券优惠额/奖品优惠额

**Requests:**

- `decorationActivity.daid` (Long): 活动ID

```json
{
    "decorationActivity.daid": 1
}
```


##### `查询` lockDecorationActivity

锁定装修活动

判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**

判断装修活动状态是否为0(初始) , 其他状态 , 错误信息 **140059 订单活动状态不可操作**

装修活动状态更新为1(锁定)

**Requests:**

- `decorationActivity.daid` (Long): 活动ID

```json
{
    "decorationActivity.daid": 1
}
```


##### `查询` unlockDecorationActivity

解锁装修活动

判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**

判断装修活动状态是否为1(锁定) , 其他状态 , 错误信息 **140059 订单活动不可操作**

装修活动状态更新为0(初始)

**Requests:**

- `decorationActivity.daid` (Long): 活动ID

```json
{
    "decorationActivity.daid": 1
}
```


##### `查询` addDecorationActivityItem

添加装修活动项

判断奖品是否存在 , 不存在 , 错误信息 **240003 奖品不存在**

**Requests:**

- `decorationActivityItem.orderId` (String): 装修单号
- `decorationActivityItem.asid` (Long): 奖品ID
- `decorationActivityItem.aid` (Long): 活动ID
- `decorationActivityItem.activityName` (String): 活动名
- `decorationActivityItem.type` (Short): 类型
- `decorationActivityItem.stateType` (Short): 状态类型
- `decorationActivityItem.money` (Integer): 价格
- `decorationActivityItem.num` (Integer): 数量
- `decorationActivityItem.content` (String): 说明

```json
{
    "decorationActivityItem.orderId": "1601010001",
    "decorationActivityItem.asid": 1,
    "decorationActivityItem.aid": 1,
    "decorationActivityItem.activityName": "活动名",
    "decorationActivityItem.type": 1,
    "decorationActivityItem.stateType": 1,
    "decorationActivityItem.money": 1000,
    "decorationActivityItem.num": 100,
    "decorationActivityItem.content": "说明"
}
```


##### `查询` receiveDecorationActivityItem

领取装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**

判断装修活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.content` (String): 备注

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.content": "备注"
}
```


##### `查询` abateDecorationActivityItem

失效装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

装修活动项状态更新为1(失效)

重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.content` (String): 备注

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.content": "备注"
}
```


##### `查询` deliveDecorationActivityItem

配送装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

装修活动项状态更新为4(配送)

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.content` (String): 备注

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.content": "备注"
}
```


##### `查询` unrefundDecorationActivityItem

未退装修活动 , 已审批未退货

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

装修活动项状态更新为5(未退)

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.comment` (String): 说明

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.comment": "说明"
}
```


##### `查询` refundDecorationActivityItem

退货装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

装修活动项状态更新为3(退货)

判断装修活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号

重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.comment` (String): 说明

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.comment": "说明"
}
```


##### `查询` expendDecorationActivityItem

消耗装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

装修活动项状态更新为7(消耗)

重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.comment` (String): 说明

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.comment": "说明"
}
```


##### `查询` discountDecorationActivityItem

折现装修活动项

判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

装修活动项状态更新为8(折现)

重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项

**Requests:**

- `decorationActivityItem.daiid` (Long): 活动项ID
- `decorationActivityItem.content` (String): 说明

```json
{
    "decorationActivityItem.daiid": 1,
    "decorationActivityItem.content": "说明"
}
```


##### `查询` amountDecorationActivityItem

统计装修活动项

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态 , 3(签单)/7(决算)其他状态不可操作 , 错误信息 **140004 装修单状态不可操作**

装修活动项状态更新为7(消耗)

重新计算归属装修单中券优惠和物品优惠 , 实收额 , 统计所有装修活动项进行统计

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decorationActivityItem.daiid": 1
}
```


##### `查询` sendDecorationActivityItem

发送装修活动项

**Requests:**

- `decorationActivityItem.orderId` (Long): 装修单号
- `decorationActivityItem.content` (String): 备注

```json
{
    "decorationActivityItem.orderId": "1601010001",
    "decorationActivityItem.content": ""
}
```


##### `查询` affirmDecorationActivityItem

确认装修活动项

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.customer.no` (String): 编号

```json
{
    "decoration.orderId": "1601010001",
    "decoration.customer.no": "",

    "decorationActivityItem[0].daiid": 1

}
```

## 回访


装修单回访信息管理


> **类**: `api.decoration.BackVisitAction`


#### 数据类型: `backVisit`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bvid` | 回访ID | Integer |
| `orderId` | 装修单号 | String |
| `sender` | 发送者 | String |
| `senderId` | 发送者编号 | String |
| `senderPhoto` | 发送者照片 | String |
| `createTime` | 创建时间 | Timestamp |
| `content` | 内容 | String |
| `receivers` | 接收者名称列表 , 每条数据类型 String | List |


:param orderId: 装修单号
:type orderId: String


##### `查询` pageBackVisitByOrderId

分页方式通过装修单号获取回访信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `backVisit.orderId` (String): 装修单号

```json
{
    "backVisit.orderId": "1601010001"
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 回访信息列表 , 每条数据类型 `backVisit`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bvid": 1,
                "orderId": "1601010001",
                "content": "测试",
                "createTime": "2016-08-21 15:31:38",
                "receivers": null,
                "sender": "白雪",
                "senderId": "U001",
                "senderPhoto": "/upload/Imag/26/7/2/0/bd9334afd87318c5c24fe6c44.jpg"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBackVisitByOrderId

通过装修单号获取回访信息

**Requests:**

- `backVisit.orderId` (String): 装修单号

```json
{
    "backVisit.orderId": "1601010001"
}
```

**Returns:**

- `backVisits` (List): 回访信息列表 , 每条数据类型 `backVisit`

```json
{
    ...
    "backVisits": [
        {
            "bvid": 1,
            "orderId": "1601010001",
            "content": "测试",
            "createTime": "2016-08-21 15:31:38",
            "receivers": null,
            "sender": "白雪",
            "senderId": "U001",
            "senderPhoto": "/upload/Imag/26/7/2/0/bd9334afd87318c5c24fe6c44.jpg"
        }
    ],
    ...
}
```


##### `查询` addBackVisit

添加回访信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `backVisit.orderId` (String): 装修单号
- `backVisit.content` (String): 内容
- `backVisit.receivers` (List): 接收人编号列表 , 每条数据类型 String

```json
{
    "backVisit.orderId": "1601010001",
    "backVisit.receivers[0]": "U001",
    "backVisit.receivers[1]": "U002"
}
```


##### `查询` deleteBackVisitById

通过回访ID删除回访信息

**Requests:**

- `backVisit.bvid` (Integer): 回访ID

```json
{
    "backVisit.bvid": 1
}
```

## 图纸


装修单图纸信息管理


> **类**: `api.decoration.DecorationPictureAction`


#### 数据类型: `decorationPicture`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dpid` | 图纸ID | Long |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `path` | 图纸路径 | String |
| `uploadTime` | 上传时间 | Timestamp |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `content` | 说明 | String |
| `type` | 类型 , 0: CAD , 1: 效果图 , 2: 工程文件 , 3: 合同图 , 4: 原始图 | Short |
| `status` | 状态 , 0: 初始, 1: 失效 | Short |


#### 数据类型: `decorationPictureRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dprid` | 记录ID | Long |
| `dpid` | 图纸ID | Long |
| `orderId` | 装修单号 | String |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 上传时间 | Timestamp |


##### `查询` queryDecorationPictureByOrderId

通过装修单号获取图纸信息

**Requests:**

- `decorationPricture.orderId` (String): 装修单号

```json
{
    "decorationPricture.orderId": "1601010001"
}
```

**Returns:**

- `decorationPictures` (List): 图纸信息列表 , 每条数据类型 `decorationPicture`

```json
{
    ...
    "decorationPictures": [
        {
            "dpid": 1,
            "name": "picture.png",
            "orderId": "1601010001",
            "path": "/upload/Imag/2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
            "type": 1,
            "uploadTime": "2016-08-02 14:28:23",
            "content": "",
            "operater": {
                "uid": 3,
                "userId": "FL-00638",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            }
            "userId": "U001",
            "userName": "白雪"
        }
    ],
    ...
}
```


##### `查询` downloadDecorationPicture

下载

**Requests:**

- `decorationPricture.dpid` (Long): 图纸ID

```json
{
    "decorationPricture.dpid": 1
}
```

**Returns:**

- `decorationPicture` (List): 图纸信息 , 每条数据类型 `decorationPicture`

```json
{
    ...
    "decorationPicture": {
        "dpid": 1,
        "name": "picture.png",
        "orderId": "1601010001",
        "path": "/upload/Imag/2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
        "type": 1,
        "uploadTime": "2016-08-02 14:28:23",
        "content": "",
        "operater": {
            "uid": 3,
            "userId": "FL-00638",
            "userName": "李宁",
            "currentName": "李宁",
            "phone": "156xxxx9283",
            ...
        }
        "userId": "U001",
        "userName": "白雪"
    },
    ...
}
```


##### `查询` addDecorationPicture

添加图纸信息

**Requests:**

- `decorationPricture.orderId` (String): 装修单号
- `decorationPricture.name` (String): 名称
- `decorationPricture.content` (String): 说明
- `decorationPricture.path` (String): 路径
- `decorationPricture.type` (Short): 类型 , 0: CAD , 1: 图片 , 2: 合同

```json
{
    "decorationPricture.orderId": "1601010001"
    "decorationPricture.name": "picture.jpg"
    "decorationPricture.content": ""
    "decorationPricture.path": "/upload/Imag/26/8/1/2/1d7184baf670d0370658.png"
    "decorationPricture.type": 1
}
```


##### `查询` deleteDecorationPicture

删除图纸系你想

**Requests:**

- `decorationPricture.dpid` (Long): 图纸ID

```json
{
    "decorationPricture.dpid": 1
}
```

## 服务


> **类**: `api.decoration.DecorationServiceAction`


#### 数据类型: `decorationService`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dsid` | 服务ID | Long |
| `orderId` | 装修单编号 | String |
| `name` | 名称 | String |
| `detail` | 详述 | String |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 完成 | Short |
| `comment` | 备注 | String |


##### `查询` queryDecorationServiceByOrderId

**Requests:**

- `decorationService.orderId` (String): 装修单编号

```json
{
    "decorationService.orderId": "1601010001"
}
```

**Returns:**

- `decorationServices` (List): 服务信息列表 , 每条数据类型 `decorationService`

```json
{
    ...
    "decorationServices": [
        {
            "dsid": 1,
            "orderId": "1601010001",
            "name": "报价",
            "detail": "报价详情",
            "operater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "operateTime": "2016-01-01 00:00:00",
            "status": 0,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` addDecorationService

添加装修服务信息

**Requests:**

- `decorationService.orderId` (String): 装修单号
- `decorationService.name` (String): 名称
- `decorationService.detail` (String): 详述

```json
{
    "decorationService.orderId": "1601010001",
    "decorationService.name": "报价",
    "decorationService.detail": "报价详情"
}
```


##### `查询` completeDecorationService

提交完成装修服务

判断装修服务信息是否存在 , 不存在 , 错误信息 **140055 装修服务不存在**

判断装修服务信息状态是否为0(初始) , 错误信息 **140056 装修服务不可操作**

**Requests:**

- `decorationService.dsid` (Long): 服务ID
- `decorationService.comment` (String): 说明

```json
{
    "decorationService.dsid": 1,
    "decorationService.comment": "说明"
}
```

## 人员


> **类**: `api.decoration.DecorationUserAction`


#### 数据类型: `decorationUser`

| 参数 | 说明 | 类型 |
|------|------|------|
| `duid` | ID | Long |
| `orderId` | 装修单编号 | String |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `isShow` | 显示标识 , 0: 显示 , 1: 隐藏 | Short |
| `isPay` | 薪资标识 , 0: 无薪 , 1: 有薪 | Short |
| `content` | 说明 | String |


##### `查询` pageDecorationForUser

分页方式获取装修单信息 , 通过装修人员关联 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
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
                    "buildArea": 88600,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0
                },

                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,
            },
            "balance": 10000,
            "balanceTime": "2016-01-01 00:00:00",
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            }
        ]
    }
}
```


##### `查询` queryDecorationUser

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 人员信息列表 , 每条数据类型 `decorationUser`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "duid": 1,
                "orderId": "1601010001",
                "user": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                    "userPhoto": "1d7184baf670d0370658.png"
                },
                "isShow": 0,
                "isPay": 0,
                "content": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addDecorationUser

添加装修单相关人员信息

**Requests:**

- `decorationUser.orderId` (Long): 装修单号
- `decorationUser.user.uid` (Long): 人员ID

```json
{
    "decorationUser.orderId": "1601010001",
    "decorationUser.user.uid": 1
}
```


##### `查询` updateDecorationUser

更新

判断人员信息是否存在 , 不存在 , 错误信息 **140077 人员不存在**

**Requests:**

- `decorationUser.duid` (Long): 人员ID
- `decorationUser.isShow` (Short): 显示标识
- `decorationUser.isPay` (Short): 薪资标识

```json
{
    "decorationUser.orderId": "1601010001",
    "decorationUser.isShow": 1,
    "decorationUser.isPay": 1
}
```


##### `查询` deleteDecorationUser

删除装修单相关人员信息

**Requests:**

- `decorationUser.duid` (Long): ID
## 审核


预算审核相关处理过程


> **类**: `api.decoration.AuditAction`


#### 数据类型: `audit`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 审核ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.DecorationAction.decoration) | Object |
| `auditer` | 审核人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `auditTime` | 审核时间 | Timestamp |


#### 数据类型: `auditRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `arid` | ID | Long |
| `aid` | 审核信息ID | Long |
| `unitprice` | 单价 | Integer |
| `num` | 数量 | Integer |
| `discount` | 折扣 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已处理 | Short |
| `comment` | 说明 | String |


#### 数据类型: `auditScale`

| 参数 | 说明 | 类型 |
|------|------|------|
| `asid` | ID | Long |
| `arid` | 审核记录ID | Long |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `belongDepartment` | 归属部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `money` | 金额 | Long |
| `type` | 类型 , 0: 设计师 , 1: 设计经理 | Short |
| `status` | 状态 , 0: 初始 , 1: 已付款 , 2: 退款 | Short |


##### `查询` pageAudit

分页方式通过装修单号获取审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `backVisit`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
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
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88600,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0
                    },

                    "type": 0,
                    "typeness": 0,
                    "busitype": 1,
                    "houseType": 0,
                    "houseClass": "二手",
                    "resourceType": 0,

                    "notSalesmanRate": 30,
                    "versionId": null,
                    "versionName": null,
                    "discount": 10,

                    "presignPrice": 50,
                    "signPrice": 10000,
                    "quotationPrice": 10000,
                    "factPrice": 10000,

                    "createTime": "2016-01-01",
                    "measureTime": null,
                    "depositTime": null,
                    "signTime": null,
                    "presignTime": null,

                    "status": 0,
                    "designStatus": 0,
                    "projectStatus": 0,
                    "sourceStatus": 0,
                    "repairStatus": 0,
                    "balanceStatus": 0,
                    "otherStatus": 0,

                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "U0003",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "U0938",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "quoter": null,
                    "escorter": null,
                    "supervisor": null,
                    "contracter": null,

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部"
                },
                "auditer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "auditTime": "2016-01-01 00:00:00"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` applyAudit

申请审批 , 审批记录没有审批人归属 , 进行审批人分配

判断审批信息是否存在 , 不存在 , 错误信息 **140044 审批记录不存在**

审批信息归属审批人已经存在 , 错误信息 **140048 审核人已存在**

**Requests:**

- `audit.aid` (Long): ID

```json
{
    "audit.aid": 1
}
```

**Returns:**

- `auditRecords` (List): 审核记录信息列表 , 每条数据类型 `auditRecord`

```json
{
    ...
    "auditRecords": [
        {
            "arid": 1,
            "aid": 1,
            "unitprice": 10000,
            "num": 10,
            "discount": 0.9,
            "comment": "说明",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00"
        }
    ],
    ...
}
```


##### `查询` queryAuditRecordByOrderId

通过审核信息ID获取审核信息

**Requests:**

- `audit.decoration.orderId` (String): 装修单号

```json
{
    "audit.decoration.orderId": "1601010001"
}
```

**Returns:**

- `auditRecords` (List): 审核记录信息列表 , 每条数据类型 `auditRecord`

```json
{
    ...
    "auditRecords": [
        {
            "arid": 1,
            "aid": 1,
            "unitprice": 10000,
            "num": 10,
            "discount": 0.9,
            "comment": "说明",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00"
        }
    ],
    ...
}
```


##### `查询` addAuditRecord

添加审批记录信息

判断审批信息是否存在 , 不存在 , 错误信息 **140044 审批记录不存在**

**Requests:**

- `auditRecord.aid` (Long): ID
- `auditRecord.unitprice` (Integer): 单价
- `auditRecord.num` (Integer): 数量
- `auditRecord.discount` (Integer): 折扣
- `auditRecord.comment` (String): 说明

```json
{
    "auditRecord.aid": 1,
    "auditRecord.unitprice":10000,
    "auditRecord.num": 10,
    "auditRecord.discount": 0.9,
    "auditRecord.comment": "说明"
}
```


##### `查询` updateAuditRecord

更新审批记录信息

操作审批记录信息不存在 , 错误信息 **140044 审批记录不存在**

判断审批信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140045 审批记录状态不可操作**

判断操作审批信息是否拥有审批比例信息 , 存在不可更新 , 错误信息 **140045 审批记录状态不可操作**

**Requests:**

- `auditRecord.arid` (Long): ID
- `auditRecord.unitprice` (Integer): 单价
- `auditRecord.num` (Integer): 数量
- `auditRecord.discount` (Integer): 折扣
- `auditRecord.comment` (String): 说明

```json
{
    "auditRecord.arid": 1,
    "auditRecord.unitprice":10000,
    "auditRecord.num": 10,
    "auditRecord.discount": 0.9,
    "auditRecord.comment": "说明"
}
```


##### `查询` queryAuditScaleByArid

通过审批信息ID获取审批比例信息

**Requests:**

- `auditRecord.arid` (Long): ID

```json
{
    "auditRecord.arid": 1
}
```

**Returns:**

- `auditScales` (List): 审核比例信息列表 , 每条数据类型 `auditScale`

```json
{
    ...
    "auditScales": [
        {
            "asid": 1,
            "arid": 1,
            "belonger": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "belongDepartment": {
                "did": 1,
                "cityProper": null,
                "contractPrefix": null,
                "createTime": "2015-01-01",
                "deptId": "D001",
                "deptName": "设计部",
                "des": "ERP",
                "fatherDept": null,
                "ident": 0,
                "subType": "行政部",
                "type": "职能部"
            },
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "money": 10000,
            "type": 0,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` makeAuditScale

按照规则生成审批比例信息

生成规则为归属装修单中的默认设计师以及设计师所在部门经理 , 比例为9:1方式才分审批信息中的金额

判断归属审批信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140046 审批比例生成失败**

**Requests:**

- `auditRecord.arid` (Long): ID

```json
{
    "auditRecord.arid": 1
}
```


##### `查询` addAuditScale

添加审核比例信息

判断审批记录是否存在 , 不存在 , 错误信息 **140044 审核记录不存在**

**Requests:**

- `auditScale.arid` (Long): ID
- `auditScale.belonger.userId` (String): 归属人编号
- `auditScale.money` (Long): 金额
- `auditScale.type` (Short): 类型

```json
{
    "auditScale.arid": 1,
    "auditScale.belonger.userId": "U001",
    "auditScale.money": 10000,
    "auditScale.type": 0,
}
```


##### `查询` updateAuditScaleForStatus

更新审核比例信息状态

判断审核比例信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140047 审批比例信息状态不可操作**

**Requests:**

- `auditScale.asid` (Long): ID
- `auditScale.status` (Short): 状态

```json
{
    "auditScale.asid": 1,
    "auditScale.status": 0,
}
```


##### `查询` deleteAuditScale

删除审核比例信息

判断审核比例信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140047 审批比例信息状态不可操作**

**Requests:**

- `auditScale.asid` (Long): ID

```json
{
    "auditScale.asid": 1
}
```

## 结算


> **类**: `api.decoration.decorationBalanceAction`


#### 数据类型: `decorationBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dbid` | 结算ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.DecorationAction.decoration) | Object |
| `balance` | 结算额 | Long |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balanceTime` | 结算时间 | Timestamp |


##### `查询` pageDecorationForBalance

分页方式获取装修结算信息 , 通过装修结算信息关联 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 `decoration`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "house":{
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
                    "buildArea": 88600,
                    "maxFloor": 7,
                    "through": 0,
                    "roomNum": 2,
                    "houseType": "2室1厅1卫1厨",
                    "orientation": 0,
                    "feature": ["临街", "把西山"],
                    "waterVapour": 0,
                    "parlourType": 0
                },

                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": 0,
                "houseClass": "二手",
                "resourceType": 0,
                "houseArea": 111,
                "freeArea": 11,

                "createTime": "2016-01-01",
                "measureTime": null,
                "depositTime": null,
                "signTime": null,
                "presignTime": null,

                "status": 0,
                "designStatus": 0,
                "projectStatus": 0,
                "sourceStatus": 0,
                "repairStatus": 0,
                "balanceStatus": 0,
                "otherStatus": 0,
            },
            "balance": 10000,
            "balanceTime": "2016-01-01 00:00:00",
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            }
        ]
    }
}
```


##### `查询` queryDecorationBalance

通过装修单号查询结算信息

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `decorationBalance` (Object): 结算信息 , 类型 `decorationBalance`

```json
{
    ...
    "decorationBalance": {
        "dbid": 1,
        "decoration": {
            "doid": 1,
            "orderId": "1601010001",
            "customer": {
                "id": 1,
                "no": "1501010001",
                "name": "李",
            },
            "house":{
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
                "buildArea": 88600,
                "maxFloor": 7,
                "through": 0,
                "roomNum": 2,
                "houseType": "2室1厅1卫1厨",
                "orientation": 0,
                "feature": ["临街", "把西山"],
                "waterVapour": 0,
                "parlourType": 0
            },

            "type": 0,
            "typeness": 0,
            "busitype": 1,
            "houseType": 0,
            "houseClass": "二手",
            "resourceType": 0,
            "houseArea": 111,
            "freeArea": 11,

            "createTime": "2016-01-01",
            "measureTime": null,
            "depositTime": null,
            "signTime": null,
            "presignTime": null,

            "status": 0,
            "designStatus": 0,
            "projectStatus": 0,
            "sourceStatus": 0,
            "repairStatus": 0,
            "balanceStatus": 0,
            "otherStatus": 0,
        },
        "balance": 10000,
        "balanceTime": "2016-01-01 00:00:00",
        "operater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        }
    }
}
```


##### `查询` makeDecorationBalance

生成结算信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修结算信息是否存在 , 存在更新结算值 , 不存在创建结算信息

**Requests:**

- `decorationBalance.decoration.orderId` (String): 装修单号
- `decorationBalance.balance` (Long): 结算额

```json
{
    "decorationBalance.decoration.orderId": "1601010001",
    "decorationBalance.balance": 10000
}
```

## 功能


> **类**: `api.decoration.DecorationFunctionAction`


#### 数据类型: `decorationFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dfid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点, 6: 状态 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` queryDecorationFunction

获取装修功能信息

**Requests:**

- `decorationFunction.type` (Short): 类型

```json
{
    "decorationFunction.type": 0
}
```

**Returns:**

- `decorationFunctions` (List): 功能信息列表 , 类型 `decorationFunction`

```json
{
    ...
    "decorationFunctions": [
        {
            "dfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.decoration.function",
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```


##### `查询` queryDecorationFunctionByName

通过名称获取装修功能信息

**Requests:**

- `decorationFunction.name` (String): 名称

```json
{
    "decorationFunction.name": "designer"
}
```

**Returns:**

- `decorationFunctions` (Object): 结算信息 , 类型 `decorationFunction`

```json
{
    ...
    "decorationFunctions": [
        {
            "dfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.decoration.function",
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```
