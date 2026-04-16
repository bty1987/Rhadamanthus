# 权限


## 角色-外链


角色关联外链页面权限控制


> **类**: `api.rigth.RoleChainPageAction`


#### 数据类型: `roleChainPage`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rcpid` | Id | Long |
| `rid` | 角色ID | Integer |
| `chainPage` | 外链 , 类型 [chianPage ](./data.html#api.data.ChainPageAction.chianPage) | Object |


##### `查询` queryRoleChainPageByRid

获取指定角色对应的外链信息

**Requests:**

- `roleChainPage.rid` (Integer): 角色ID

```json
{
    "roleChainPage.rid": 1
}
```

**Returns:**

- `chainPages` (List): 外链信息列表 , 每条数据类型 [chianPage ](./data.html#api.data.ChainPageAction.chianPage)

```json
{
    ...
    "chainPages": [
        {
            "cpid": 1,
            "name": "页面",
            "url": "http://api.com",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` updateRoleChainPage

更新指定角色对应的外链信息

**Requests:**

- `roleChainPage.rid` (Integer): 角色ID

```json
{
    "roleChainPage.rid": 1,
    "cpids[0]": 1
}
```

## 装修单-权限


包括三个部分 , 设计部-人员/业务部-人员/装修单状态-人员


> **类**: `api.right.decorationRightAction`


#### 数据类型: `decorationDesignDepartmentRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `doddrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `did` | 设计部ID | Integer |
| `company` | 公司ID | Integer |


##### `查询` queryDecorationDesignDepartmentRightByUserId

通过人员编号查询该人员的设计权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 人员编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `dids` (List): 设计部ID列表 , 每条数据类型 Integer

```json
{
    "dids[0]": 1
}
```


##### `查询` updateDecorationDesignDepartmentRight

更新人员设计权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除人员原关联设计权限配置信息 , 之后更新人员对应的设计权限配置信息

**Requests:**

- `user.userId` (String): 人员编号

```json
{
     "user.userId": "FL-00001",
     "dids[0]": 1
}
```

**DataType:**


#### 数据类型: `decorationSalesmanDepartmentRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dosdrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `did` | 业务部ID | Integer |
| `company` | 公司ID | Integer |


##### `查询` queryDecorationSalesmanDepartmentRightByUserId

通过人员编号查询该人员的业务权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 人员编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `dids` (List): 业务部ID列表 , 每条数据类型 Integer

```json
{
    "dids[0]": 1
}
```


##### `查询` updateDecorationSalesmanDepartmentRight

更新人员业务权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除人员原关联业务权限配置信息 , 之后更新人员对应的业务权限配置信息

**Requests:**

- `user.userId` (String): 人员编号

```json
{
     "user.userId": "FL-00001",
     "dids[0]": 1
}
```

**DataType:**


#### 数据类型: `decorationStatusRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dosrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `status` | 状态 | String |
| `company` | 公司ID | Integer |


##### `查询` queryDecorationStatusRightByUserId

通过人员编号查询该人员的订单权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 人员编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `statuses` (List): 状态列表 , 每条数据类型 String

```json
{
    "statuses[0]": "全部"
}
```


##### `查询` updateDecorationStatusRight

更新人员订单权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除人员原关联订单权限配置信息 , 之后更新人员对应的订单权限配置信息

**Requests:**

- `user.userId` (String): 人员编号

```json
{
     "user.userId": "FL-00001",
     "statuses[0]": "全部"
}
```

**DataType:**


#### 数据类型: `decorationUser`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dosrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.DecorationAction.decoration) | Object |
| `company` | 公司ID | Integer |


##### `查询` pageDecorationUser

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

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
                    ...
                },

                "type": 0,
                "typeness": 0,
                "busitype": 1,
                "houseType": "期房",
                "houseClass": "二手",
                "resourceType": 0,

                "version": {
                    "qvid": 1,
                    "versionId": "QV001",
                },

                "notSalesmanRate": 0.03,
                "orderTotalPrice": 100,
                "discount": 10,

                "createTime": "2016-07-11",
                "measureTime": null,
                "depositTime": null,
                "contractTime": null,

                "status": "初始",
                "projectStatus": 0,
                "otherStatus": 0,

                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
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


##### `查询` bindDecorationUser

绑定人员与装修单关联关系

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单是否已经人员进行绑定 , 不可重复绑定

**Requests:**

- `decorationUser.uid` (Integer): 用户ID
- `decorationUser.decoration.orderId` (String): 装修单号

```json
{
    "decorationUser.uid": 1,
    "decorationUser.decoration.orderId": "1601010001"
}
```


##### `查询` unbindDecorationUser

解绑人员与装修单关联关系

**Requests:**

- `decorationUser.uid` (Integer): 用户ID
- `decorationUser.decoration.orderId` (String): 装修单号

```json
{
    "decorationUser.uid": 1,
    "decorationUser.decoration.orderId": "1601010001"
}
```

## 品牌-人员


品牌权限 , 根据人员信息配置人员查询以及操作品牌的权限


> **类**: `api.data.BrandUserRightAction`


#### 数据类型: `brandUserRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `burid` | 权限ID | Long |
| `uid` | 用户编号 | String |
| `brand` | 品牌信息 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |


##### `查询` queryBrandUserRightByUid

查询指定用户拥有的品牌权限信息

**Requests:**

- `brandUserRight.uid` (Integer): 用户ID

```json
{
    "brandUserRight.uid": 1
}
```

**Returns:**

- `brandUserRights` (Object): 品牌权限信息列表 , 每条数据类型 `brandUserRight`

```json
{
    ...
    "brandUserRights":[
        {
            "mbrid": 1,
            "uid": 1,
            "brand": {
                "bid": 1,
                "brandId": "B001",
                "brandName": "品牌",
                "brandNamePinyin": "pinpai",
                "cid": 1,
                "categoryId": "C001",
                "categoryName": "地板"
            }
        },
    ]
    ...
}
```


##### `查询` queryBrandUserRightForLogin

获取当前用户的品牌权限信息

**Returns:**

- `brandUserRights` (Object): 品牌权限信息列表 , 每条数据类型 `brandUserRight`

```json
{
    ...
    "brandUserRights":[
        {
            "mbrid": 1,
            "uid": 1,
            "brand": {
                "bid": 1,
                "brandId": "B001",
                "brandName": "品牌",
                "brandNamePinyin": "pinpai",
                "cid": 1,
                "categoryId": "C001",
                "categoryName": "地板"
            }
        },
    ]
    ...
}
```


##### `创建` updateBrandUserRight

更新品牌权限信息

**Requests:**

- `brandUserRight.uid` (Long): 用户ID

```json
{
    "brandUserRight.uid": 1,
    "bids[0]": 0
}
```

## 房源-部门


> **类**: `api.right.BuildingHouseRightAction`


#### 数据类型: `buildingHouseDepartmentRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `hsdrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `did` | 设计部ID | Integer |
| `company` | 公司ID | Integer |


##### `查询` queryBuildingHouseDepartmentRightByUserId

通过人员编号查询该人员的房源归属部门权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 人员编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `dids` (List): 设计部ID列表 , 每条数据类型 Integer

```json
{
    "dids[0]": 1
}
```


##### `查询` updateBuildingHouseDepartmentRight

更新人员房源部门权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除人员原关联房源部门权限配置信息 , 之后更新人员对应的房源部门权限配置信息

**Requests:**

- `user.userId` (String): 人员编号

```json
{
     "user.userId": "FL-00001",
     "dids[0]": 1
}
```

## 客源-部门


> **类**: `api.right.customerSourceRightAction`


#### 数据类型: `customerSourceDepartmentRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csdrid` | ID | Long |
| `uid` | 用户ID | Integer |
| `did` | 设计部ID | Integer |
| `company` | 公司ID | Integer |


##### `查询` queryCustomerSourceDepartmentRightByUserId

通过人员编号查询该人员的客源归属部门权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 人员编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `dids` (List): 设计部ID列表 , 每条数据类型 Integer

```json
{
    "dids[0]": 1
}
```


##### `查询` updateCustomerSourceDepartmentRight

更新人员客源部门权限配置信息

判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除人员原关联客源部门权限配置信息 , 之后更新人员对应的客源部门权限配置信息

**Requests:**

- `user.userId` (String): 人员编号

```json
{
     "user.userId": "FL-00001",
     "dids[0]": 1
}
```

## 装修功能-功能


> **类**: `api.rigth.DecorationFunctionRightAction`


#### 数据类型: `decorationFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dfrid` | ID | Long |
| `name` | 名称 | String |
| `decorationFunction` | 功能 , 类型 [decorationFunction ](./decoration.html#api.decoration.decorationFunctionAction.decorationFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` queryDecorationFunctionRightByName

通过名称获取装修功能

**Requests:**

- `decorationFunction.name` (String): 名称

```json
{
    "decorationFunction.name": "designer"
}
```

**Returns:**

- `decorationFunctions` (List): 装修功能信息列表 , 每条数据类型 [decorationFunction ](./decoration.html#api.decoration.DecorationFunctionAction.decorationFunction)

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


##### `查询` updateDecorationFunctionRight

更新功能名称和功能之间关系

**Requests:**

- `decorationFunction.name` (String): 名称

```json
{
    "decorationFunction.name": 1,
    "dfids[0]": 1
}
```

## 生产功能-功能


> **类**: `api.rigth.ProductionFunctionRightAction`


#### 数据类型: `productionFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pfrid` | ID | Long |
| `name` | 名称 | String |
| `productionFunction` | 功能 , 类型 [productionFunction ](./production.html#api.production.ProductionFunctionAction.productionFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` queryProductionFunctionRightByName

通过名称获取生产功能


##### `查询` updateProductionFunctionRight

更新功能名称和功能之间关系

## 款项功能-功能


> **类**: `api.rigth.PaymentFunctionRightAction`


#### 数据类型: `paymentFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pfrid` | ID | Long |
| `name` | 名称 | String |
| `paymentFunction` | 功能 , 类型 [paymentFunction ](./payment.html#api.payment.PaymentFunctionAction.paymentFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` queryPaymentFunctionRight

通过名称获取款项功能


##### `查询` updatePaymentFunctionRight

更新功能名称和功能之间关系

## 销售功能-功能


> **类**: `api.rigth.SalesFunctionRightAction`


#### 数据类型: `salesFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sfrid` | ID | Long |
| `name` | 名称 | String |
| `salesFunction` | 功能 , 类型 [salesFunction ](./sales.html#api.sales.SalesFunctionAction.salesFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` querySalesFunctionRightByName

通过名称获取销售功能


##### `查询` updateSalesFunctionRight

更新功能名称和功能之间关系

## 客源功能-功能


> **类**: `api.rigth.CustomerOriginFunctionRightAction`


#### 数据类型: `customerOriginFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cofrid` | ID | Long |
| `name` | 名称 | String |
| `customerOriginFunction` | 功能 , 类型 [customerOriginFunction ](./customer.html#api.customer.CustomerOriginFunctionAction.customerOriginFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` queryCustomerOriginFunctionRight

通过名称获取客源功能


##### `查询` updateCustomerOriginFunctionRight

更新功能名称和功能之间关系

## 销售配送-状态


> **类**: `api.rigth.SalesDeliveryStatusRightAction`


#### 数据类型: `salesDeliveryStatusRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sdsrid` | ID | Long |
| `name` | 名称 | String |
| `bid` | 品牌ID | Long |
| `status` | 状态 | Short |
| `company` | 公司ID | Integer |


##### `查询` querySalesDeliveryStatusRight

获取销售配送状态

**Requests:**

- `salesDeliveryStatusRight.bid` (Long): 品牌ID

```json
{
    "salesDeliveryStatusRight.bid": 1
}
```

**Returns:**

- `salesDeliveryStatusRights` (List): 配送状态信息列表 , 每条数据类型 `salesDeliveryStatusRight`

```json
{
    ...
    "salesDeliveryStatusRights": [
        {
            "sdsrid": 1,
            "name": "状态",
            "bid": 1,
            "status": 0
        }
    ]
```


##### `查询` updateSalesDeliveryStatusRight

更新销售配送状态

**Requests:**


```json
{
    "salesDeliveryStatusRight[0].name": 1,
    "salesDeliveryStatusRight[0].bid": 1,
    "salesDeliveryStatusRight[0].status": 0
}
```

## 报价功能-功能


> **类**: `api.rigth.QuotationFunctionRightAction`


#### 数据类型: `quotationFunctionRight`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfrid` | ID | Long |
| `name` | 名称 | String |
| `quotationFunction` | 功能 , 类型 [quotationFunction ](./quotation.html#api.quotation.QuotationFunctionAction.quotationFunction) | Object |
| `company` | 公司ID | Integer |


##### `查询` queryQuotationFunctionRight

通过名称获取报价功能


##### `查询` updateQuotationFunctionRight

更新功能名称和功能之间关系
