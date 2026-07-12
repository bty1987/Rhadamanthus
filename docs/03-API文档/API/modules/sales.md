# 销售


## 销售


### 销售单


> **类**: `api.material.SalesAction`


#### 数据类型: `sales`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 销售单ID | Long |
| `no` | 编号 , 由日期加六位格式计数组成 , 例: 1601010001 | String |
| `orderId` | 装修单号 | String |
| `phone` | 电话 | String |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `grade` | 等级 , 包括: A/B/C | String |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `guider` | 导购 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `instorer` | 驻店 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `guideDept` | 导购归属部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `finisher` | 完结人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `category` | 品类 | String |
| `bid` | 品牌ID | Long |
| `brand` | 品牌 | String |
| `createTime` | 创建时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `fullpayTime` | 补款时间 | Timestamp |
| `finishTime` | 完结时间 | Timestamp |
| `affirmTime` | 确认时间 | Timestamp |
| `isAffirm` | 确认状态 | Short |
| `status` | 状态 , 0: 初始 , 2: 全退 , 3: 倒单 , 4: 废单 , 5: 完结 | Short |
| `depositpay` | 定金 | Long |
| `depositpayStatus` | 定金状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认 | Short |
| `fullpay` | 补款 | Long |
| `fullpayStatus` | 补款状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认 | Short |
| `balanceStatus` | 结算状态 , 0: 初始 , 1: 预结算 , 2: 厂商结算 , 3: 结算 , 4: 完结 | Short |
| `total` | 总额 | Long |
| `amount` | 总额 , 当前总额 | Long |
| `maling` | 抹零 | Integer |
| `venderMaling` | 厂商抹零 | Integer |
| `coupon` | 券值 | Integer |
| `couponInfo` | 券信息 , 例: #洁具券:150# | String |
| `ctype` | 结算类型 , 0: 底价 , 1: 点位 , 2: 不计算(默认) | Short |
| `cvalue` | 结算值 | Long |
| `comment` | 备注 | String |
| `company` | 公司 , 通常为销售公司 | Long |
| `dompany` | 公司 , 通常为装修公司 | Long |
| `pompany` | 公司 , 通常为收款公司 | Long |


:param no: 销售单号
:type no: String
:param orderId: 装修单号
:type orderId: String
:param instorerId: 驻店员编号
:type instorerId: String
:param salesmanId: 业务员编号
:type salesmanId: String
:param salesmanName: 业务员名
:type salesmanName: String
:param fullpayTimeRange: 补款收款时间 , 格式: 2016/01/01-2016/01/01
:type fullpayTimeRange: String


##### `查询` pageSales

分页方式获取销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作用户信息 , 过滤销售单归属人员 , 包括业务 , 驻店 , 导购

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForDompany

分页方式获取销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单归属的第二公司进行查询 , 第二公司为装修单公司

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForPompany

分页方式获取销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单归属的第三公司进行查询 , 第三公司为款项公司

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForSupplier

分页方式获取销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作用户信息 , 查询对应厂商对应的销售单

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForAdvance

分页方式获取销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForBalance

分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": "",
                "company": 1,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForBalanceByDompany

分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据销售单归属第二公司进行查询 , 第二公司为装修单公司

需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": "",
                "comment": "",
                "company": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesForBalanceByPompany

分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据销售单归属第三公司进行查询 , 第三公司为款项公司

需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": "",
                "comment": "",
                "company": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesByOrderId

分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过装修单号获取归属的销售单信息

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId:": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售单信息列表 , 每条数据类型 `sales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "phone": "",
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "affirmTime": "2016-01-01 00:00:00",
                "isAffirm": 0,
                "status": 0,
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": "",
                "comment": "",
                "company": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySalesBySid

通过销售单ID获取销售单信息

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```

**Returns:**

- `sales` (List): 销售单信息 , 类型 `sales`

```json
{
    ...
    "sales": {
        "sid": 1,
        "no": "1601010001",
        "orderId": "1601010001",
        "phone": "",
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
        "salesman": {
            "uid": 1,
            "userId": "U001",
            "userName": "设计师",
            "currentName": "设计师",
            "duty": "设计师"
        },
        dept: {
            "did": 1,
            "no": "D001",
            "name": "设计一部",
            "type": "设计部",
        },
        "region": {
            "did": 2,
            "no": "D002",
            "name": "设计一分区",
            "type": "设计大区",
        },
        "guider": {
            "uid": 2,
            "userId": "U0012",
            "userName": "导购",
            "currentName": "导购",
            "duty": "导购"
        },
        "instorer": {
            "uid": 3,
            "userId": "U0032",
            "userName": "驻店",
            "currentName": "驻店",
            "duty": "驻店导购"
        },
        "guideDept": {
            "did": 1,
            "no": "D003",
            "name": "导购一部",
            "type": "导购部",
        },
        "finisher": {
            "uid": 100,
            "userId": "U073",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "财务"
        },
        "grade": "A",
        "category": "瓷砖",
        "brand": "瓷砖",
        "createTime": "2016-01-01 00:00:00",
        "fullpayTime": "2016-01-01 00:00:00",
        "balanceTime": "2016-01-01 00:00:00",
        "finishTime": "2016-01-01 00:00:00",
        "affirmTime": "2016-01-01 00:00:00",
        "isAffirm": 0,
        "status": 0,
        "depositpay": 100000,
        "depositpayStatus": 1,
        "fullpay": 0,
        "fullpayStatus": 0,
        "balanceStatus": 0,
        "total": 100000,
        "amount": 100000,
        "maling": 0,
        "venderMaling": 0,
        "coupon": 0,
        "couponInfo": "",
        "comment": "",
        "company": 1
    }
    ...
}
```


##### `查询` querySalesByNo

通过销售单编号获取销售单信息

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

**Requests:**

- `sales.no` (String): 销售单编号

```json
{
    "sales.no": "1601010001"
}
```

**Returns:**

- `sales` (List): 销售单信息 , 类型 `sales`

```json
{
    ...
    "sales": {
            "sid": 1,
        "no": "1601010001",
        "orderId": "1601010001",
        "phone": "",
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
        "salesman": {
            "uid": 1,
            "userId": "U001",
            "userName": "设计师",
            "currentName": "设计师",
            "duty": "设计师"
        },
        dept: {
            "did": 1,
            "no": "D001",
            "name": "设计一部",
            "type": "设计部",
        },
        "region": {
            "did": 2,
            "no": "D002",
            "name": "设计一分区",
            "type": "设计大区",
        },
        "guider": {
            "uid": 2,
            "userId": "U0012",
            "userName": "导购",
            "currentName": "导购",
            "duty": "导购"
        },
        "instorer": {
            "uid": 3,
            "userId": "U0032",
            "userName": "驻店",
            "currentName": "驻店",
            "duty": "驻店导购"
        },
        "guideDept": {
            "did": 1,
            "no": "D003",
            "name": "导购一部",
            "type": "导购部",
        },
        "finisher": {
            "uid": 100,
            "userId": "U073",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "财务"
        },
        "grade": "A",
        "category": "瓷砖",
        "brand": "瓷砖",
        "createTime": "2016-01-01 00:00:00",
        "fullpayTime": "2016-01-01 00:00:00",
        "balanceTime": "2016-01-01 00:00:00",
        "finishTime": "2016-01-01 00:00:00",
        "affirmTime": "2016-01-01 00:00:00",
        "isAffirm": 0,
        "status": 0,
        "depositpay": 100000,
        "depositpayStatus": 1,
        "fullpay": 0,
        "fullpayStatus": 0,
        "balanceStatus": 0,
        "total": 100000,
        "amount": 100000,
        "maling": 0,
        "venderMaling": 0,
        "coupon": 0,
        "couponInfo": "",
        "comment": "",
        "company": 1
    }
    ...
}
```


##### `查询` amountSales

汇总销售总额

**Requests:**

- `sales.orderId` (Long): 销售单ID

```json
{
    "sales.orderId": "1601010001"
}
```

**Returns:**

- `amount` (Long): 销售总额

```json
{
    ...
    "amount": 1000000,
    ...
}
```


##### `查询` sendSales

推送销售单

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```


##### `查询` checkSales

验证销售单

根据归属装修单判断销售单状态是否全部完结 , 存在其他状态 , 错误信息 **260057 销售单未完结**

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId": "1601010001",
}
```


##### `查询` addSales

创建销售单

判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单状态为

获取第二公司信息 , 解密过程以及获取公司信息 , 处理失败 , 错误信息 **230015 公司不存在**

销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**

销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**

利用归属装修单等级和公司以及销售单归属公司 , 按照规则生成销售单等级信息

**Requests:**

- `sales.orderId` (String): 装修单号
- `sales.phone` (String): 电话
- `sales.house.hid` (Long): 房产ID
- `sales.salesman.userId` (String): 业务员编号
- `sales.guider.userId` (String): 主材员编号
- `sales.instorer.userId` (String): 驻店编号
- `sales.category` (String): 品类
- `sales.bid` (Long): 品牌ID
- `sales.brand` (String): 品牌
- `sales.total` (Long): 总价
- `sales.maling` (Integer): 抹零
- `sales.coupon` (Integer): 券值
- `sales.comment` (String): 备注

```json
{
    "sales.orderId": "1601010001",
    "sales.phone": "",
    "sales.house.hid": 1,
    "sales.salesman.userId": "U0186",
    "sales.guider.userId": "U0511",
    "sales.instore.userId": "",
    "sales.category": "洁具",
    "sales.bid": 1,
    "sales.brand": "卫浴",
    "sales.coupon": 0,
    "sales.couponInfo": "",
    "sales.comment": "",
    "sales.maling": 0,
    "sales.total": 0,

    "salesItems[0].goods.gid": 1,
    "salesItems[0].color.cid": 1,
    "salesItems[0].format.fid": 1,
    "salesItems[0].purchase": 50000
    "salesItems[0].selling": 100000,
    "salesItems[0].discount": 900,
    "salesItems[0].disPrice": 90000
    "salesItems[0].postDis": 900,
    "salesItems[0].price": 81000,
    "salesItems[0].priceType": 0,
    "salesItems[0].num": 1,
    "salesItems[0].total": 81000,
    "salesItems[0].comment": "",
    "salesItems[0].ctype": "",
    "salesItems[0].cvalue": ""
}
```


##### `查询` updateSales

更新销售单信息

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.grade` (String): 等级

```json
{
    "sales.sid": 1,
    "sales.grade": "B"
}
```


##### `查询` updateSalesForActivity

更新销售单参与活动信息

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.activityId` (Long): 活动ID

```json
{
    "sales.sid": 1,
    "sales.activityId": 1
}
```


##### `查询` updateSalesForBelong

更新销售单归属信息 , 渠道(业务)/驻店/导购

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.salesman.userId` (String): 业务员编号
- `sales.guider.userId` (String): 主材员编号
- `sales.instorer.userId` (String): 驻店编号
- `sales.supplier.userId` (String): 厂商

```json
{
    "sales.sid": 1,
    "sales.salesman.userId": "U0083",
    "sales.guider.userId": "U0083",
    "sales.instorer.userId": "U0083",
    "sales.supplier.userId": "U0083"
}
```


##### `查询` updateSalesForCoupon

更新销售单中券相关信息

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.coupon` (Integer): 券值
- `sales.couponInfo` (String): 券信息 , 例子: #洁具券:150#

```json
{
    "sales.sid": 1,
    "sales.coupon": 150000
    "sales.couponInfo": #洁具券:150#
}
```


##### `查询` updateSalesForMaling

更新销售单中抹零信息

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.maling` (Integer): 抹零
- `sales.venderMaling` (Integer): 厂商抹零

```json
{
    "sales.sid": 1,
    "sales.maling": 100000,
    "sales.venderMaling": 100
}
```


##### `查询` updateSalesForAdvance

更新销售单的信息 , 高级业务处理

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

更新销售单状态为0(初始)

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```


##### `查询/创建` affirmSales

确认销售单

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

判断客户编号是否绑定 , 未绑定 , 错误信息 **330017 装修单未绑定**

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.customer.no` (String): 客户编号

```json
{
    "sales.sid": 1,
    "sales.customer.no": "",
}
```


##### `查询` terminalSales

废止销售单

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 结算状态为0(初始) , 定金状态为-1(初始) , 补款状态为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```


##### `查询` finishSales

完结销售单

销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```

### 销售项


> **类**: `api.material.SalesItemAction`


#### 数据类型: `salesItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `siid` | 销售项ID | Long |
| `sid` | 销售单ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `color` | 颜色 , 类型 [color ](./data.html#api.data.ColorAction.color) | Object |
| `format` | 规格 , 类型 [format ](./data.html#api.data.FormatAction.format) | Object |
| `purchase` | 进价 | Integer |
| `selling` | 售价 | Integer |
| `discount` | 折扣 | Integer |
| `disPrice` | 折扣价 | Integer |
| `postDis` | 折让 | Integer |
| `price` | 折让价 | Integer |
| `priceType` | 价格类型 | Short |
| `initnum` | 初始量 | Integer |
| `num` | 数量 | Integer |
| `total` | 总价 | Integer |
| `comment` | 备注 | String |
| `punum` | 采购余数 | Integer |
| `xgnum` | 出库余数 | Integer |
| `rawCtype` | 原结算方式 | Short |
| `rawCvalue` | 原结算值 | Integer |
| `ctype` | 结算方式 , 0: 底价 , 1: 点位 , 2: 不计算 | Short |
| `cvalue` | 结算值 | Integer |


##### `查询` querySalesItemBySid

通过销售单ID获取销售项

**Requests:**

- `sales.sid` (Long): 销售单ID

```json
{
    "sales.sid": 1
}
```

**Returns:**

- `salesItems` (List): 销售项列表 , 每条数据类型 `salesItem`

```json
{
    ...
    "salesItems": [
        {
            "siid": 1,
            "sid": 1,
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
            "purchase": 60,
            "selling": 90000
            "discount": 1,
            "disPrice": 90000
            "postDis": 1,
            "price": 90000
            "initnum": 1,
            "num": 1,
            "total": 90000
            "comment": "",
            "punum": 1,
            "xgnum": 1,
            "rawCtype": 0,
            "rawCvalue": 80000,
            "ctype": 0,
            "cvalue": 80000,
        }
    ],
    ...
}
```


##### `查询` querySalesItemBySids

通过销售单ID列表获取销售项

**Requests:**


```json
{
    "sids[0]": 1
}
```

**Returns:**

- `salesItems` (List): 销售项列表 , 每条数据类型 `salesItem`

```json
{
    ...
    "salesItems": [
        {
            "siid": 1,
            "sid": 1,
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
            "purchase": 60,
            "selling": 90000
            "discount": 1,
            "disPrice": 90000
            "postDis": 1,
            "price": 90000,
            "initnum": 1,
            "num": 1,
            "total": 90000
            "comment": "",
            "punum": 1,
            "xgnum": 1,
            "rawCtype": 0,
            "rawCvalue": 80000,
            "ctype": 0,
            "cvalue": 80000,
        }
    ],
    ...
}
```


##### `查询` addSalesItem

添加销售项

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**

销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**

添加销售项同时需要更新销售单中总额信息

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.total` (Long): 总额
- `salesItem.goods.gid` (Long): 商品ID
- `salesItem.color.cid` (Long): 颜色ID
- `salesItem.format.fid` (Long): 规格ID
- `salesItem.purchase` (Integer): 进价
- `salesItem.selling` (Integer): 售价
- `salesItem.discount` (Integer): 折扣
- `salesItem.disPrice` (Integer): 折扣价
- `salesItem.postDis` (Integer): 折让
- `salesItem.price` (Integer): 折让价
- `salesItem.priceType` (Short): 价格类型
- `salesItem.num` (Integer): 数量
- `salesItem.total` (Integer): 总价
- `salesItem.comment` (Integer): 备注
- `salesItem.ctype` (Short): 结算方式
- `salesItem.cvalue` (Integer): 结算值

```json
{
    "sales.sid": 1,
    "sales.total": 100000,
    "salesItem.goods.gid": 1,
    "salesItem.color.cid": 1,
    "salesItem.format.fid": 1,
    "salesItem.purchase": 50000
    "salesItem.selling": 100000,
    "salesItem.discount": 900,
    "salesItem.disPrice": 90000
    "salesItem.postDis": 900,
    "salesItem.price": 81000,
    "salesItem.priceType": 0,
    "salesItem.num": 1,
    "salesItem.total": 81000,
    "salesItem.comment": "",
    "salesItem.ctype": "",
    "salesItem.cvalue": "",
}
```


##### `查询` updateSalesItem

更新销售单中销售项 , 只能够更新数量/总额/备注

判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

更新销售项之前需要判断销售单补款状态 , 补款状态为初始 , 其他状态操作失败 , 错误信息 **260045 销售项状态不可操作**

销售项信息不存在 , 不存在 , 错误信息 **260023 销售项不存在**

更新销售项同时需要更新销售单中总额信息

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.total` (Long): 总额
- `salesItem.siid` (Long): 销售项ID
- `salesItem.num` (Integer): 数量
- `salesItem.total` (Integer): 总价
- `salesItem.comment` (Integer): 备注

```json
{
    "sales.sid": 1,
    "sales.total": 100000,
    "salesItem.siid": 1,
    "salesItem.num": 1,
    "salesItem.total": 81000,
    "salesItem.comment": ""
}
```


##### `查询` updateSalesItemForBalance

更新销售项关于结算信息 , 结算方式(ctype)和结算值(cvalue)

判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

判断销售单结算状态是否为0(初始) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

**Requests:**

- `salesItem.siid` (Long): 销售项ID
- `salesItem.ctype` (Short): 结算类型
- `salesItem.cvalue` (Integer): 结算值

```json
{
    "salesItem.siid": 1,
    "salesItem.ctype": 1,
    "salesItem.cvalue": 1
}
```


##### `查询` deleteSalesItem

删除销售单中销售项

判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.total` (Long): 总额
- `salesItem.siid` (Long): 销售项ID

```json
{
    "sales.sid": 1,
    "sales.total": 100000,
    "salesItem.siid": 1
}
```

## 退货


### 退货单


> **类**: `api.sales.SalesRefundsAction`


#### 数据类型: `salesRefunds`

| 参数 | 说明 | 类型 |
|------|------|------|
| `srid` | 退货单ID | Long |
| `sid` | 销售单ID | Long |
| `spid` | 款项ID | Long |
| `total` | 总额 | Long |
| `type` | 类型 , 0: 退货 , 2: 全退 , 3: 倒单 | Short |
| `status` | 状态 , 0: 初始 , 1: 已付款 | Short |
| `creater` | 创建人 ,  类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `comment` | 备注 | String |


##### `查询` pageSalesRefunds

分页方式获取销售退货信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材单信息列表 , 每条数据类型 `salesRefunds`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "srid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "spid": 1,
                "total": 100000,
                "type": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-06-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySalesRefundsBySid

通过销售单ID获取退货单

**Requests:**

- `salesRefunds.sid` (Long): 销售单ID

```json
{
    "salesRefunds.sid": 1
}
```

**Returns:**

- `salesRefundes` (List): 退货单列表 , 每条数据类型 `salesRefunds`

```json
{
    ...
    "salesRefundes": [
        {
            "srid": 1,
            "sid": 1,
            "spid": 1,
            "total": 100000,
            "type": 0,
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-06-01 00:00:00",
            "balanceTime": "2016-01-01 00:00:00",
            "comment": ""
        }
    ],
    ...
}
```

### 退货项


> **类**: `api.sales.SalesRefundItemAction`


#### 数据类型: `salesRefundsItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `riid` | 退货项ID | Long |
| `sid` | 销售单ID | Long |
| `rid` | 退货单ID | Long |
| `salesItem` | 销售项 , 类型 [salesItem ](./sales.html#api.sales.SalesAction.salesItem) | Object |
| `num` | 数量 | Integer |
| `total` | 总额 | Integer |


##### `查询` querySalesRefundsItemBySid

通过销售单号查询退货项信息

**Requests:**

- `salesRefunds.sid` (Long): 销售单ID

```json
{
    "salesRefunds.sid": 1
}
```

**Returns:**

- `salesRefundsItems` (List): 退货项列表 , 每条数据类型 `salesRefundsItem`

```json
{
    ...
    "salesRefundsItems": [
        {
            "riid": 1,
            "sid": 1,
            "rid": 1,
            "salesItem": {
                "siid": 1,
                "sid": 1,
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
                "purchase": 60,
                "selling": 90000
                "discount": 1,
                "disPrice": 90000
                "postDis": 1,
                "price": 90000
                "num": 1,
                "total": 90000
                "comment": "",
                "rawCtype": 0,
                "rawCvalue": 80000,
                "ctype": 0,
                "cvalue": 80000,
            }
            "num": 1,
            "total": 90
        }
    ],
    ...
}
```


##### `查询` querySalesRefundsItemByRid

通过退货单号查询退货项信息

**Requests:**

- `salesRefunds.rid` (Long): 销售单ID

```json
{
    "salesRefunds.rid": 1
}
```

**Returns:**

- `salesRefundsItems` (List): 退货项列表 , 每条数据类型 `salesRefundsItem`

```json
{
    ...
    "salesRefundsItems": [
        {
            "riid": 1,
            "sid": 1,
            "rid": 1,
            "salesItem": {
                "siid": 1,
                "sid": 1,
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
                "purchase": 60,
                "selling": 90000
                "discount": 1,
                "disPrice": 90000
                "postDis": 1,
                "price": 90000
                "num": 1,
                "total": 90000
                "comment": "",
                "rawCtype": 0,
                "rawCvalue": 80000,
                "ctype": 0,
                "cvalue": 80000,
            }
            "num": 1,
            "total": 90
        }
    ],
    ...
}
```

## 外销


### 外销单


> **类**: `api.sales.OalesAction`


#### 数据类型: `oales`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oid` | 外销单ID | Long |
| `foid` | 关联外销单ID | Long |
| `no` | 编号 , 由日期加六位格式计数组成 , 例: 1601010001 | String |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `customer` | 客户, 类型 [customer ](./customer.html#api.customer.CustomerAction.customer) | Object |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `category` | 品类 | String |
| `bid` | 品牌ID | Long |
| `brand` | 品牌 | String |
| `type` | 类型 , 0: 购货 , 1: 退货 | Short |
| `atttype` | 业务类型 , 0: 内购 , 1: 外购 | Short |
| `awardType` | 奖励类型 , 0: 设计部 , 1: 服务部 , 2: 工程部 | Short |
| `servicer` | 服务管家 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `materialer` | 主材员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `channer` | 渠道 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `checker` | 复核人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `createTime` | 创建时间 | Timestamp |
| `confirmTime` | 确认时间 | Timestamp |
| `checkTime` | 复核时间 | Timestamp |
| `finishTime` | 完结时间 | Timestamp |
| `total` | 总额 | Long |
| `profit` | 利润 | Long |
| `award` | 奖励 | Long |
| `cost` | 成本 | Long |
| `threshold` | 系数 | Integer |
| `status` | 状态 , 0: 初始 , 1: 提交, 2: 确认 , 3: 驳回 , 4: 复核 , 5: 完结 , 6: 废单 | Short |
| `comment` | 备注 | String |
| `company` | 公司 | Long |


##### `查询` pageOales

分页方式获取外销单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `statuses` (List): 状态列表 , 每条数据类型 Short

```json
{
    "statuses[0]": 1,
    "statuses[1]": 2
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 外销单信息列表 , 每条数据类型 `oales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "oid": 1,
                "no": "1601010001",
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                        ...
                    },
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            ...
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    }
                    "designer": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    }
                },

                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "servicer": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "materialer": null,
                "channer": null,

                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },

                "createTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",

                "category": "瓷砖",
                "brand": "瓷砖",

                "atttype": 0,
                "awardType": 0,

                "total": 100000,
                "profit": 0,
                "award": 0,

                "status": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryOalesByOrderId

通过装修单号查询外销单

**Requests:**

- `oales.orderId` (String): 装修单号

```json
{
    "oales.orderId:": "1601010001"
}
```

**Returns:**

- `oaleses` (List): 外销单信息列表 , 每条数据类型 `oales`

```json
{
    ...
    "oaleses": [
        {
            "oid": 1,
            "no": "1601010001",
            "decoration": {
                "doid": 1,
                "orderId": "1601010001",
                "customer": {
                    "id": 1,
                    "no": "1501010001",
                    "name": "李",
                    ...
                },
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        ...
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                }
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                }
            },

            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "servicer": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "materialer": null,
            "channer": null,

            dept: {
                "did": 1,
                "no": "D001",
                "name": "设计一部",
                "type": "设计部",
            },
            "region": {
                "did": 2,
                "no": "D002",
                "name": "设计一分区",
                "type": "设计大区",
            },

            "createTime": "2016-01-01 00:00:00",
            "confirmTime": "2016-01-01 00:00:00",
            "checkTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",

            "category": "瓷砖",
            "brand": "瓷砖",

            "atttype": 0,
            "awardType": 0,

            "total": 100000,
            "profit": 0,
            "award": 0,

            "status": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` amountOales

汇总外销总额

**Requests:**

- `oales.decoration.orderId` (Long): 销售单ID

```json
{
    "oales.decoration.orderId": "1601010001"
}
```

**Returns:**

- `amount` (Long): 外销总额

```json
{
    ...
    "amount": 1000000,
    ...
}
```


##### `查询` addOales

创建外销单

判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `oales.decoration.orderId` (String): 装修单号
- `oales.bid` (Long): 品牌ID
- `oales.total` (Long): 总价
- `oales.atttype` (Short): 业务类型
- `oales.comment` (String): 备注

```json
{
    "oales.decoration.orderId": "1601010001",
    "oales.bid": 1,
    "oales.total": 0,
    "oales.atttype": 0,
    "oales.comment": ""
}
```


##### `查询` updateOales

更新外销单

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**Requests:**

- `oales.oid` (Long): 外销单ID
- `oales.total` (Long): 总额

```json
{
    "oales.oid": 1,
    "oales.total": 0
}
```


##### `查询` submitOales

提交

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **370022 外销单不可操作**

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` cancelOales

撤销

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断销售单状态是否为1(提交) , 其他状态 , 错误信息 **370022 外销单不可操作**

更新外销单状态为0(初始)

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` confirmOales

确认

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断外销单状态是否为1(提交)/3(驳回) , 其他状态 , 错误信息 **370022 外销单不可操作**

判断外销单归属款项是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

更新外销单状态为2(确认) , 更新外销单确认时间

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` rejectOales

驳回外销单

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**

更新外销单状态3(驳回)

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` checkOales

复核外销单

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**

更新外销单状态为4(复核) , 更新外销单复核时间

**Requests:**


```json
{
    "oaleses[0].oid": 1
}
```


##### `查询` finishOales

完结外销单

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断外销单状态是否为4(复核) , 其他状态 , 错误信息 **370022 外销单不可操作**

更新外销单状态为5(完结) , 更新外销单完结时间

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` abateOales

废单

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` refundOales

退货

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

判断外销单状态是否为5(完结) , 其他状态 , 错误信息 **370022 外销单不可操作**

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```


##### `查询` deleteOales

删除

**Requests:**

- `oales.oid` (Long): 外销单ID

```json
{
    "oales.oid": 1
}
```

### 付款单


> **类**: `api.sales.OalesPayAction`


#### 数据类型: `oalesPay`

| 参数 | 说明 | 类型 |
|------|------|------|
| `opid` | 付款ID | Long |
| `oid` | 外销单ID | Long |
| `name` | 名称 | String |
| `money` | 金额 | Integer |
| `type` | 类型 , 0: 现金 , 1: 银行 , 2: 账扣 , 3: 内部 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `payTime` | 付款时间 | Timestamp |
| `comment` | 备注 | String |


##### `查询` pageOalesPay

分页方式获取外销单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 外销付款信息列表 , 每条数据类型 `oalesPay`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "opid": 1,
                "oid": 1,
                "name": "名称"
                "money": 10000,
                "type": 0,
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "createTime": "2016-01-01 00:00:00",
                "payTime": "2016-01-01 00:00:00",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryOalesPay

通过外销单ID获取外销付款信息

**Requests:**

- `oalesPay.oid` (Long): 外销单ID

```json
{
    "oalesPay.oid:": 1
}
```

**Returns:**

- `oalesPays` (List): 外销付款信息列表 , 每条数据类型 `oalesPay`

```json
{
    ...
    "oalesPays": [
        {
            "opid": 1,
            "oid": 1,
            "name": "名称"
            "money": 10000,
            "type": 0,
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "payTime": "2016-01-01 00:00:00",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addOalesPay

创建外销付款

判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**Requests:**

- `oalesPay.oid` (Long): 外销单ID
- `oalesPay.name` (String): 名称
- `oalesPay.money` (Integer): 金额
- `oalesPay.payTime` (Timestamp): 付款时间
- `oalesPay.type` (Short): 类型
- `oalesPay.comment` (String): 备注

```json
{
    "oalesPay.oid": 1,
    "oalesPay.name": "名称",
    "oalesPay.money": 10000,
    "oalesPay.payTime": "2016-01-01 00:00:00",
    "oalesPay.type": 0,
    "oalesPay.comment": ""
}
```


##### `查询` updateOalesPay

更新外销付款

判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

**Requests:**

- `oalesPay.opid` (Long): 外销付款ID
- `oalesPay.name` (String): 名称
- `oalesPay.money` (Integer): 金额
- `oalesPay.payTime` (Timestamp): 付款时间
- `oalesPay.type` (Short): 类型
- `oalesPay.comment` (String): 备注

```json
{
    "oalesPay.opid": 1,
    "oalesPay.name": "名称",
    "oalesPay.money": 10000,
    "oalesPay.payTime": "2016-01-01 00:00:00",
    "oalesPay.type": 0,
    "oalesPay.comment": ""
}
```


##### `查询` deleteOalesPay

删除外销付款

判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

**Requests:**

- `oalesPay.opid` (Long): 外销付款ID

```json
{
    "oalesPay.opid": 1
}
```

## 结算


### 结算单


销售单结算相关功能


> **类**: `api.sales.SalesBalanceAction`


#### 数据类型: `salesBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sbid` | 结算ID | Long |
| `sales` | 销售单 , 类型 [sales ](./inventory.html#api.material.SalesAction.sales) | Object |
| `refunds` | 退货单 , 类型 [refunds ](./inventory.html#api.material.SalesRefundAction.salesRefunds) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `voster` | 厂商结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `venderTime` | 厂商结算时间 | Timestamp |
| `poster` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `postTime` | 结算时间 | Timestamp |
| `checker` | 对账人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `checkTime` | 对账时间 | Timestamp |
| `allowance` | 补贴 | Long |
| `coupon` | 券值 | Integer |
| `total` | 总额 | Long |
| `balance` | 预结算值 | Long |
| `difference` | 差值 , 既总额 - 结算值 | Long |
| `vbalance` | 厂商结算 | Long |
| `pbalance` | 结算值 | Long |
| `type` | 类型 , 0: 购货 , 1: 预结算退货 , 2: 结算退货 , 3: 定金 | Short |
| `onetype` | 一类 , 0: 购货 , 1: 退货 , 2: 全退 , 3: 倒单 | Short |
| `status` | 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算 | Short |
| `deliverStatus` | 配送状态 , 0: 未配送 , 1: 部分送达 , 2: 全部送达 | Short |
| `verifyStatus` | 审核状态 , 0: 未审核 , 1: 部分审核 , 2: 全部审核 | Short |
| `confirmStatus` | 确认状态 , 0: 未确认 , 1: 部分确认 , 2: 全部确认 | Short |
| `checkStatus` | 对账状态 , 0: 初始 , 1: 对账 , 2: 已付 | Short |
| `comment` | 备注 | String |


##### `查询` pageSalesBalance

分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单公司进行查询

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售结算信息列表 , 每条数据类型 `salesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "balance": 0,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "deliverStatus": 0,
                "verifyStatus": 0,
                "confirmStatus": 0,
                "checkStatus": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesBalanceForDompany

分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单第二公司进行查询 , 第二公司为装修单公司

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售结算信息列表 , 每条数据类型 `salesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "ciid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "balance": 0,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "deliverStatus": 0,
                "verifyStatus": 0,
                "confirmStatus": 0,
                "checkStatus": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesBalanceForPompany

分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单第三公司进行查询 , 第三公司为款项公司

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售结算信息列表 , 每条数据类型 `salesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "ciid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "balance": 0,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "deliverStatus": 0,
                "verifyStatus": 0,
                "confirmStatus": 0,
                "checkStatus": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesBalanceForSupplier

分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过销售单厂商以及当前操作人信息查询对应销售单

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售结算信息列表 , 每条数据类型 `salesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "ciid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "balance": 0,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "deliverStatus": 0,
                "verifyStatus": 0,
                "confirmStatus": 0,
                "checkStatus": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesBalanceForCheck

分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

提供对账功能业务 , 通过销售单厂商 , 对账状态为初始以及状态为预结算的销售单

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售结算信息列表 , 每条数据类型 `salesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "ciid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "balance": 0,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "deliverStatus": 0,
                "verifyStatus": 0,
                "confirmStatus": 0,
                "checkStatus": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` updateSalesBalanceForVBalance

更新销售结算信息中的厂商结算值

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

更新销售结算信息中厂商结算值

**Requests:**

- `salesBalance.sbid` (Long): 结算ID
- `salesBalance.vbalance` (Long): 厂商结算值

```json
{
    "salesBalance.sbid": 1,
    "salesBalance.vbalance": 100
}
```


##### `查询` updateSalesBalanceForPBalance

更新销售结算信息中的结算值

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

判断销售结算信息状态是否为2(厂商结算) , 错误信息 **260038 销售结算状态不可操作**

更新销售结算信息中结算值

**Requests:**

- `salesBalance.sbid` (Integer): 结算ID
- `salesBalance.pbalance` (Long): 厂商结算值

```json
{
    "salesBalance.sbid": 1,
    "salesBalance.pbalance": 100
}
```


##### `查询` passSalesBalance

批量过渡销售单到完结 , 主要提供跳过主材结算过程

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态是否为0(初始) , 其他状态 **销售单状态不可操作**

更新销售单结算状态为4(完结)

**Requests:**


```json
{
    "sids[0]": 1,
    "sids[1]": 2
}
```


##### `查询` preSalesBalance

批量预结算销售单

判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

判断销售单是否存在未处理审批 , 审批状态为0(初始) , 错误信息 **240007 存在未处理审批信息**

利用销售单对应的销售项中的计算方式和计算值进行计算得出预结算值

套餐商品中的套餐信息直接进行结算 , 商品信息不参与结算过程

点位计算公式: 利润 = (折让价 - 折扣价 * (1 - 点位)) * 数量 , 成本 = 折扣价 * (1 - 点位) * 数量

底价计算方式: 利润 = (折让价 - 底价) * 数量 , 成本 = 底价 * 数量

补贴 = (折扣价 - 折让价) * 数量

生成销售单对应的销售结算信息

更新销售单结算状态为1(预结算)

**Requests:**


```json
{
    "sids[0]": 1,
    "sids[1]": 2
}
```


##### `查询` vpostSalesBalance

厂商结算

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

更新销售结算中状态更新为1(厂商结算) , 更新厂商结算时间

更新销售单结算状态为2(厂商结算)

**Requests:**


```json
{
    "sbids[0]": 1
}
```


##### `查询` rpreSalesBalance

反厂商结算

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

判断销售结算信息状态是否为1(厂商结算) , 错误信息 **260038 销售结算状态不可操作**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

更新销售结算中状态更新为0(预结算)

判断销售结算类型是否为0(购货) , 更新销售单结算状态为1(预结算)

**Requests:**


```json
{
    "sbids[0]": 1
}
```


##### `查询` postSalesBalance

结算

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

更新销售结算中状态更新为2(结算) , 更新结算时间

更新销售单结算状态为3(结算)

**Requests:**


```json
{
    "sbids[0]": 1
}
```

### 结算项


> **类**: `api.sales.SalesBalanceItemAction`


#### 数据类型: `salesBalanceItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sbiid` | 结算项ID | Long |
| `sbid` | 结算ID | Long |
| `salesItem` | 销售项 , 类型 [salesItem ](./sales.html#api.sales.SalesAction.salesItem) | Object |
| `rawCtype` | 原结算方式 , 0: 底价 , 1: 点位 | Short |
| `rawCvalue` | 原结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数 | Integer |
| `ctype` | 结算方式 | Short |
| `cvalue` | 结算值 | Integer |
| `num` | 数量 | Integer |
| `total` | 总价 | Integer |


##### `查询` querySalesBalanceItemBySbid

通过销售结算ID获取销售结算项信息

判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

**Requests:**

- `salesBalance.sbid` (Long): 结算ID

```json
{
    "salesBalance.sbid": 1
}
```

**Returns:**

- `salesBalanceItems` (List): 销售结算项列表 , 每条数据类型 `salesBalanceItem`

```json
{
    ...
    "salesBalanceItems": [
        {
            "sbiid": 1,
            "sbid": 1,
            "salesItem": {
                "siid": 1,
                "sid": 1,
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
                "purchase": 60,
                "selling": 90000
                "discount": 1,
                "disPrice": 90000
                "postDis": 1,
                "price": 90000
                "num": 1,
                "total": 90000
                "comment": "",
                "rawCtype": 0,
                "rawCvalue": 80000,
                "ctype": 0,
                "cvalue": 80000,
            },
            "rawCtype": 1,
            "rawCvalue": 0.1,
            "ctype": 1,
            "cvalue": 0.1,
            "num": 10000,
            "total": 1000
        }
    ],
    ...
}
```

## 活动


销售单活动管理


> **类**: `api.sales.SalesActivityAction`


#### 数据类型: `salesActivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sales` | 销售单 , 类型 [sales ](./inventory.html#api.material.SalesAction.sales) | Object |
| `activity` | 活动 , 类型 [activity ](./information.html#api.information.ActivityAction.activity) | Object |
| `amount` | 汇总 | Long |


#### 数据类型: `salesActivityItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `saiid` | 活动项ID | Long |
| `aid` | 活动ID | Long |
| `asid` | 奖品ID | Long |
| `orderId` | 装修单号 | String |
| `activity` | 活动名 | String |
| `name` | 活动项名 | String |
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
| `isStock` | 是否计入库存 , 0: 计入 , 1: 不计入 | Short |
| `isPayment` | 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算 | Short |
| `isAffirm` | 是否确认 , 0: 初始 , 1: 确认 , 2: 核对 | Short |
| `num` | 数量 | Integer |
| `money` | 价格 | Integer |
| `content` | 备注 | String |
| `comment` | 说明 | String |


##### `查询` pageSalesActivity

通过装修单号 , 分页方式获取销售活动 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId": "1601010001"
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 销售活动信息列表 , 每条数据类型 `salesActivity`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "ciid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "activity": {
                    "aid": 1,
                    "name": "test",
                    "creater": {
                        "uid": 1,
                        "userId": "U0479",
                        "userName": "白雪",
                        "currentName": "白雪"
                    },
                    "createTime": "2016-01-01 16:04:28",
                    "startTime": "2016-01-01 00:00:00",
                    "endTime": "2016-01-01 23:59:59",
                    "type": 1,
                    "defaults": 0,
                    "multiple": 1,
                    "status": 1,
                    "content": "8"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` amountSalesActivity

通过装修单号 , 获取归属销售单参与的活动信息以及款项信息

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId": "1601010001"
}
```

**Returns:**

- `salesActivitys` (List): 活动信息 , 类型  `salesActivity`

```json
{
    ...
    "salesActivitys":[
        {
            "activity": {
                "aid": 1,
                "name": "test",
            },
            "amount": 100000,
        }
    ],
    ...
}
```


##### `查询` amountSalesActivityForActivity

通过装修单号 , 获取归属销售单参与活动的积分总额

**Requests:**

- `salesActivity.sales.orderId` (String): 装修单号

```json
{
    "salesActivity.sales.orderId": "1601010001"
}
```

**Returns:**

- `salesActivity` (Object): 销售活动信息 , 类型  `salesActivity`

```json
{
    ...
    "salesActivity":{
        "amount": 100000,
    },
    ...
}
```


##### `查询` amountSalesActivityForPayment

通过装修单号 , 获取归属销售单所交款项的积分总额

**Requests:**

- `salesActivity.sales.orderId` (String): 装修单号

```json
{
    "salesActivity.sales.orderId": "1601010001"
}
```

**Returns:**

- `salesActivity` (Object): 销售活动信息 , 类型  `salesActivity`

```json
{
    ...
    "salesActivity":{
        "amount": 100000,
    },
    ...
}
```


##### `查询` querySalesActivityItem

通过装修单号 , 查询归属所有销售单参与的活动项信息

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId": "1601010001"
}
```

**Returns:**

- `salesActivityItems` (List): 活动项信息列表 , 每条数据类型 `SalesActivityItem`

```json
{
    ...
    "salesActivityItems": [
        {
            "saiid": 1,
            "orderId": "1601010001",
            "aid": 1,
            "asid": 1,
            "activity": "测试",
            "name": "测试项",

            "money": 100000,
            "num": 1,
            "content": "",

            "creater": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "operater": {
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

            "state": 0,
            "type": 0,
            "stateType": 0,
            "content": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addSalesActivityItem

添加销售活动项

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `salesActivity.sales.orderId` (String): 装修单号
- `salesActivity.amount` (Long): 积分

```json
{
    "salesActivity.sales.orderId": "1601010001",
    "salesActivity.amount": 1000000,
    "salesActivityItems[0].aid": 1,
    "salesActivityItems[0].asid": 1,
    "salesActivityItems[0].activity": "活动名",
    "salesActivityItems[0].name": "活动项",
    "salesActivityItems[0].type": 0,
    "salesActivityItems[0].num": 1500,
    "salesActivityItems[0].money": 10000,
    "salesActivityItems[0].integral": 1000000,
    "salesActivityItems[0].content": "说明"
}
```


##### `查询` receiveSalesActivityItem

领取销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**

判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.content` (String): 备注

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.content": "备注"
}
```


##### `查询` abateSalesActivityItem

失效销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**

销售活动项状态更新为1(失效)

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.content` (String): 备注

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.content": "备注"
}
```


##### `查询` deliveSalesActivityItem

配送销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

销售活动项状态更新为4(配送)

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `decorationActivityItem.content` (String): 备注

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.content": "备注"
}
```


##### `查询` unrefundSalesActivityItem

未退装修活动 , 已审批未退货

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

销售活动项状态更新为5(未退)

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.comment` (String): 说明

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.comment": "说明"
}
```


##### `查询` refundSalesActivityItem

退货销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**

销售活动项状态更新为3(退货)

判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.comment` (String): 说明

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.comment": "说明"
}
```


##### `查询` expendSalesActivityItem

消耗销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

销售活动项状态更新为7(消耗)

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.comment` (String): 说明

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.comment": "说明"
}
```


##### `查询` discountSalesActivityItem

折现销售活动项

判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

销售活动项状态更新为8(折现)

**Requests:**

- `salesActivityItem.saiid` (Long): 活动项ID
- `salesActivityItem.comment` (String): 说明

```json
{
    "salesActivityItem.saiid": 1,
    "salesActivityItem.comment": "说明"
}
```


##### `查询` sendSalesActivityItem

发送销售活动项

**Requests:**

- `salesActivityItem.orderId` (String): 装修单号
- `salesActivityItem.content` (String): 备注

```json
{
    "salesActivityItem.orderId": "1601010001",
    "salesActivityItem.content": ""
}
```


##### `查询` affirmSalesActivityItem

确认销售活动项

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

**Requests:**

- `sales.orderId` (String): 装修单号
- `sales.customer.no` (String): 编号

```json
{
    "sales.orderId": "1601010001",
    "sales.customer.no": "",
    "salesActivityItem[0].saiid": 1            
}
```

## 配送


> **类**: `api.sales.SalesDeliveryAction`


#### 数据类型: `salesDeliveryItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sdiid` | 配送项ID | Long |
| `sales` | 销售单 , 类型 [sales ](./inventory.html#api.material.SalesAction.sales) | Object |
| `salesItem` | 销售项 , 类型 [salesItem ](./sales.html#api.sales.SalesAction.salesItem) | Object |
| `status` | 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 完结 | Short |
| `createTime` | 创建时间 | Timestamp |
| `protranTime` | 预计配送时间 | Timestamp |
| `tranTime` | 配送时间 | Timestamp |
| `checkTime` | 审核时间 | Timestamp |
| `confirmTime` | 确认时间 | Timestamp |
| `finishTime` | 完结时间 | Timestamp |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `traner` | 配送人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `checker` | 审核人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `finisher` | 完结人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `comment` | 备注 | String |
| `company` | 公司ID | Integer |


##### `查询` pageSalesDeliveryItem

分页方式获取配送项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 配送项信息列表 , 每条数据类型 `salesDeliveryItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sdiid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
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
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "status": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "salesItem": {
                    "siid": 1,
                    "sid": 1,
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
                    "purchase": 60,
                    "selling": 90000
                    "discount": 1,
                    "disPrice": 90000
                    "postDis": 1,
                    "price": 90000
                    "num": 1,
                    "total": 90000
                    "comment": "",
                    "punum": 1,
                    "xgnum": 1,
                    "rawCtype": 0,
                    "rawCvalue": 80000,
                    "ctype": 0,
                    "cvalue": 80000,
                },
                "num": 10000,
                "refnum": 0,
                "status": 0,
                "comment": "备注",
                "protranTime": "2016-01-01 00:00:00",
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "creater": {
                    "uid": 11,
                    "userId": "U010",
                    "userName": "创建人",
                    "currentName": "创建人",
                    "duty": "创建人"
                },
                "traner": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "checker": {
                    "uid": 12,
                    "userId": "U012",
                    "userName": "审核人",
                    "currentName": "审核人",
                    "duty": "审核人"
                },
                "confirmer": {
                    "uid": 13,
                    "userId": "U013",
                    "userName": "确认人",
                    "currentName": "确认人",
                    "duty": "确认人"
                },
                "finisher": {
                    "uid": 14,
                    "userId": "U014",
                    "userName": "完结人",
                    "currentName": "完结人",
                    "duty": "完结人"
                }
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesDeliveryItemForSupplier

分页方式获取配送项信息 , 利用厂商作为条件 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 配送项信息列表 , 每条数据类型 `salesDeliveryItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sdiid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
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
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "status": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "salesItem": {
                    "siid": 1,
                    "sid": 1,
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
                    "purchase": 60,
                    "selling": 90000
                    "discount": 1,
                    "disPrice": 90000
                    "postDis": 1,
                    "price": 90000
                    "num": 1,
                    "total": 90000
                    "comment": "",
                    "punum": 1,
                    "xgnum": 1,
                    "rawCtype": 0,
                    "rawCvalue": 80000,
                    "ctype": 0,
                    "cvalue": 80000,
                },
                "num": 10000,
                "refnum": 0,
                "status": 0,
                "comment": "备注",
                "protranTime": "2016-01-01 00:00:00",
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "creater": {
                    "uid": 11,
                    "userId": "U010",
                    "userName": "创建人",
                    "currentName": "创建人",
                    "duty": "创建人"
                },
                "traner": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "checker": {
                    "uid": 12,
                    "userId": "U012",
                    "userName": "审核人",
                    "currentName": "审核人",
                    "duty": "审核人"
                },
                "confirmer": {
                    "uid": 13,
                    "userId": "U013",
                    "userName": "确认人",
                    "currentName": "确认人",
                    "duty": "确认人"
                },
                "finisher": {
                    "uid": 14,
                    "userId": "U014",
                    "userName": "完结人",
                    "currentName": "完结人",
                    "duty": "完结人"
                }
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageSalesDeliveryItemForInstorer

分页方式获取配送项信息 , 利用导购作为条件 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 配送项信息列表 , 每条数据类型 `salesDeliveryItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sdiid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
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
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "status": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "salesItem": {
                    "siid": 1,
                    "sid": 1,
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
                    "purchase": 60,
                    "selling": 90000
                    "discount": 1,
                    "disPrice": 90000
                    "postDis": 1,
                    "price": 90000
                    "num": 1,
                    "total": 90000
                    "comment": "",
                    "punum": 1,
                    "xgnum": 1,
                    "rawCtype": 0,
                    "rawCvalue": 80000,
                    "ctype": 0,
                    "cvalue": 80000,
                },
                "num": 10000,
                "refnum": 0,
                "status": 0,
                "comment": "备注",
                "protranTime": "2016-01-01 00:00:00",
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "creater": {
                    "uid": 11,
                    "userId": "U010",
                    "userName": "创建人",
                    "currentName": "创建人",
                    "duty": "创建人"
                },
                "traner": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "checker": {
                    "uid": 12,
                    "userId": "U012",
                    "userName": "审核人",
                    "currentName": "审核人",
                    "duty": "审核人"
                },
                "confirmer": {
                    "uid": 13,
                    "userId": "U013",
                    "userName": "确认人",
                    "currentName": "确认人",
                    "duty": "确认人"
                },
                "finisher": {
                    "uid": 14,
                    "userId": "U014",
                    "userName": "完结人",
                    "currentName": "完结人",
                    "duty": "完结人"
                }
            },
        ],
        ...
    },
    ...
}
```


##### `查询` querySalesDeliveryItem

获取配送项信息

**Requests:**

- `salesDeliveryItem.sales.sid` (Long): 销售单ID

```json
{
    "salesDeliveryItem.sales.sid": 1
}
```

**Returns:**

- `salesDeliveryItems` (List): 配送项信息列表 , 每条数据类型 `salesDeliveryItem`

```json
{
    ...
    "data": [
        {
            "sdiid": 1,
            "sales": {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "company": 1,
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
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "导购"
                },
                "instorer": {
                    "uid": 3,
                    "userId": "U0032",
                    "userName": "驻店",
                    "currentName": "驻店",
                    "duty": "驻店导购"
                },
                "guideDept": {
                    "did": 1,
                    "no": "D003",
                    "name": "导购一部",
                    "type": "导购部",
                },
                "finisher": {
                    "uid": 100,
                    "userId": "U073",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "财务"
                },
                "grade": "A",
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "depositpay": 100000,
                "depositpayStatus": 1,
                "fullpay": 0,
                "fullpayStatus": 0,
                "status": 0,
                "balanceStatus": 0,
                "total": 100000,
                "amount": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            },
            "salesItem": {
                "siid": 1,
                "sid": 1,
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
                "purchase": 60,
                "selling": 90000
                "discount": 1,
                "disPrice": 90000
                "postDis": 1,
                "price": 90000
                "num": 1,
                "total": 90000
                "comment": "",
                "punum": 1,
                "xgnum": 1,
                "rawCtype": 0,
                "rawCvalue": 80000,
                "ctype": 0,
                "cvalue": 80000,
            },
            "num": 10000,
            "refnum": 0,
            "status": 0,
            "comment": "备注",
            "protranTime": "2016-01-01 00:00:00",
            "tranTime": "2016-01-01 00:00:00",
            "checkTime": "2016-01-01 00:00:00",
            "confirmTime": "2016-01-01 00:00:00",
            "creater": {
                "uid": 11,
                "userId": "U010",
                "userName": "创建人",
                "currentName": "创建人",
                "duty": "创建人"
            },
            "traner": {
                "uid": 11,
                "userId": "U011",
                "userName": "配送人",
                "currentName": "配送人",
                "duty": "配送人"
            },
            "checker": {
                "uid": 12,
                "userId": "U012",
                "userName": "审核人",
                "currentName": "审核人",
                "duty": "审核人"
            },
            "confirmer": {
                "uid": 13,
                "userId": "U013",
                "userName": "确认人",
                "currentName": "确认人",
                "duty": "确认人"
            },
            "finisher": {
                "uid": 14,
                "userId": "U014",
                "userName": "完结人",
                "currentName": "完结人",
                "duty": "完结人"
            }
        },
    ],
    ...
}
```


##### `查询` updateSalesDeliveryItem

更新配送信息

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**Requests:**

- `salesDeliveryItem.sdiid` (Long): 配送项ID
- `salesDeliveryItem.protranTime` (Timestamp): 预计配送时间
- `salesDeliveryItem.comment` (String): 备注

```json
{
    "salesDeliveryItem.sdiid": 1,
    "salesDeliveryItem.protranTime": "2016-01-01 00:00:00",
    "salesDeliveryItem.comment": "备注"
}
```


##### `查询` deliveSalesDeliveryItem

配送

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

**Requests:**

- `salesDeliveryItem.sales.sid` (Long): 销售单ID

```json
{
    "salesDeliveryItem.sales.sid": 1
}
```


##### `查询` tranSalesDeliveryItem

配送

判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**Requests:**


```json
{
    "salesDeliveryItems[0].sdiid": 1
}
```


##### `查询` checkSalesDeliveryItem

审核

判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

判断配送项状态为1(配送) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**Requests:**


```json
{
    "salesDeliveryItems[n].sdiid": 1
}
```


##### `查询` confirmSalesDeliveryItem

确认

判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

判断配送项状态为2(审核) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**Requests:**


```json
{
    "salesDeliveryItems[n].sdiid": 1
}
```


##### `查询` finishSalesDeliveryItem

完结

判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

判断配送项状态为3(确认) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**Requests:**


```json
{
    "salesDeliveryItems[n].sdiid": 1
}
```

## 图片


> **类**: `api.sales.SalesPictureAction`


#### 数据类型: `salesPicture`

| 参数 | 说明 | 类型 |
|------|------|------|
| `spid` | 图片ID | Long |
| `sid` | 销售单ID | Long |
| `siid` | 销售项ID | Long |
| `name` | 名称 | String |
| `path` | 路径 | String |
| `filesize` | 文件大小 | Integer |
| `type` | 类型 , 0: 销售 , 1: 配送 , 2: 外销 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 有效 , 1: 删除 | Short |


##### `查询` querySalesPicture

获取销售图片信息

**Requests:**

- `salesPicture.sid` (Long): 销售单ID
- `salesPicture.siid` (Long): 销售项ID

```json
{
    "salesPicture.sid": 1,
    "salesPicture.siid": 1,
}
```

**Returns:**

- `salesPictures` (List): 结算信息列表 , 类型 `salesPicture`

```json
{
    ...
    "salesPictures": [
        {
            "spid": 1,
            "sid": 1,
            "siid": 1,
            "name": "销售图片",
            "path": "",
            "filesize": 0,
            "creater": {
                "uid": 1,
                "createrId": "U001",
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


##### `查询` addSalesPicture

添加销售图片

**Requests:**

- `salesPicture.sid` (Long): 销售单ID
- `salesPicture.siid` (Long): 销售项ID
- `salesPicture.path` (String): 路径

```json
{
    "salesPicture.sid": 1,
    "salesPicture.siid": 1,
    "salesPicture.name": "销售图片",
    "salesPicture.path": "",
    "salesPicture.filesize": 0,
    "salesPicture.type": 1
}
```


##### `查询` deleteSalesPicture

删除销售图片

**Requests:**

- `salesPicture.spid` (Long): 图片ID

```json
{
    "salesPicture.spid": 1
}
```

## 功能


> **类**: `api.sales.SalesFunctionAction`


#### 数据类型: `salesFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sfid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `group` | 分组 , 0: 公共 , 1: 订单 , 2: 仓储 , 4: 预结算 , 8: 结算 , 16: 对账 | Short |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` querySalesFunction

获取销售功能信息

**Requests:**

- `salesFunction.type` (Short): 类型

```json
{
    "salesFunction.type": 0
}
```

**Returns:**

- `salesFunctions` (Object): 结算信息 , 类型 `salesFunction`

```json
{
    ...
    "salesFunctions": [
        {
            "sfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.decoration.function",
            "group": 0,
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```


##### `查询` querySalesFunctionByName

通过名称获取销售功能信息

**Requests:**

- `salesFunction.name` (String): 名称

```json
{
    "salesFunction.name": "designer"
}
```

**Returns:**

- `salesFunctions` (Object): 结算信息 , 类型 `salesFunction`

```json
{
    ...
    "salesFunctions": [
        {
            "sfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.decoration.function",
            "group": 0,
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```
