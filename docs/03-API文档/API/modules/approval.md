# 审批


## 审批


审批整体信息管理


> **类**: `api.approval.ApprovalAction`


审批类型包括:


| Type | 审批类型 |  |
| --- | --- | --- |
| 1 | 客户信息修改 | 保留 |
| 2 | 楼盘信息修改 | 保留 |
| 3 | 装修归属修改 |  |
| 4 | 报价折扣修改 |  |
| 5 | 装修退款 |  |
| 6 | 主材退货 |  |
| 7 | 主材场外退款 |  |
| 8 | 装修活动申请 |  |
| 9 | 主材补款提交 |  |
| 10 | 销售退货 |  |
| 11 | 商品库存调拨 |  |
| 12 | 销售补款提交 |  |
| 13 | 人资 |  |
| 14 | 客源转装修单 |  |
| 16 | 装修满减修改 |  |
| 17 | 客源初审 |  |
| 18 | 销售不退定金 |  |
| 19 | 装修合同终止 |  |
| 20 | 报价特批优惠 |  |


#### 数据类型: `approval`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `receiver` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `sender` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 类型 | Short |
| `ident` | 外链ID | String |
| `status` | 状态 , 包括: 0: 初始 , 1: 审批通过 , 2: 审批拒绝 , 3: 审批中 , 4: 发起失败 , 5: 客户确认 , 6: 待确认 , 7: 客户拒绝 | Short |
| `createTime` | 创建时间 | Timestamp |
| `approvalTime` | 审批时间 | Timestamp |
| `contents` | 说明信息 , 系统自动生成 | String |
| `comment` | 备注 | String |
| `annotate` | 批注 | String |
| `psid` | 钉钉审批编号 | String |


##### `查询` pageApproval

分页方式获取审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `approval`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "orderId": "1601010001",
                "receiver": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "sender": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "type": 8,
                "ident": 1,
                "status": 1,
                "createTime": "2016-01-01 15:00:44",
                "approvalTime": "2016-01-01 15:00:54",
                "contents": "订单号:1607290003,参与活动:test1",
                "comment": "",
                "annotate": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageApprovalForReceive

分页方式获取指定接收人的审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `approval`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "orderId": "1601010001",
                "receiver": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "sender": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "type": 8,
                "ident": 1,
                "status": 1,
                "createTime": "2016-01-01 15:00:44",
                "approvalTime": "2016-01-01 15:00:54",
                "contents": "订单号:1607290003,参与活动:test1",
                "comment": "",
                "annotate": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageApprovalForSend

分页方式获取指定发送人的审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `approval`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "orderId": "1601010001",
                "receiver": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "sender": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "type": 8,
                "ident": 1,
                "status": 1,
                "createTime": "2016-01-01 15:00:44",
                "approvalTime": "2016-01-01 15:00:54",
                "contents": "订单号:1607290003,参与活动:test1",
                "comment": "",
                "annotate": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageApprovalForReceive

分页方式获取指定接收人的审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `approval`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "orderId": "1601010001",
                "receiver": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "sender": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "type": 8,
                "ident": 1,
                "status": 1,
                "createTime": "2016-01-01 15:00:44",
                "approvalTime": "2016-01-01 15:00:54",
                "contents": "订单号:1607290003,参与活动:test1",
                "comment": "",
                "annotate": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageApprovalForReceiveDept

分页方式获取审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

获取方式为 , 根据当前操作人归属部门 , 查询审批信息中对应的审批部门

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `approval`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "orderId": "1601010001",
                "receiver": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "sender": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "type": 8,
                "ident": 1,
                "status": 1,
                "createTime": "2016-01-01 15:00:44",
                "approvalTime": "2016-01-01 15:00:54",
                "contents": "订单号:1607290003,参与活动:test1",
                "comment": "",
                "annotate": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryApprovalByAId

通过审批ID获取审批信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approval` (Object): 审批信息 , 类型 `approval`

```json
{
    ...
    "approval":{
        "aid": 1,
        "orderId": "1601010001",
        "receiver": {
            "uid": 1,
            "userId": "FL-02381",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        },
        "sender": {
            "uid": 2,
            "userId": "FL-00186",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "createTime": "2016-01-01 15:00:44",
        "approvalTime": "2016-01-01 15:00:54",
        "contents": "订单号:1607290003,参与活动:test1",
        "type": 8,
        "ident": 1,
        "status": 1,
        "createTime": "2016-01-01 15:00:44",
        "approvalTime": "2016-01-01 15:00:54",
        "contents": "订单号:1607290003,参与活动:test1",
        "comment": "",
        "annotate": ""
    },
    ...
}
```


##### `查询` countApprovalForReceive

利用当前操作人 , 统计接收未处理审批数量

**Returns:**

- `count` (Integer): 总数

```json
{
    ...
    "count": 1
    ...
}
```


##### `查询` countApprovalForSend

利用当前操作人 , 统计发送未处理审批数量

**Returns:**

- `count` (Integer): 总数

```json
{
    ...
    "count": 1
    ...
}
```


##### `查询` approveApproval

通过审批

判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

判断审批状态是否为0(初始)/5(客户确认)/7(客户拒绝) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

装修归属审批 , 通过之后原有归属信息状态设置为1(失效) , 利用审批信息更新归属信息 , 更新装修单附加信息内容

报价折扣审批 , 通过之后修改报价折扣信息

装修退款审批 , 通过之后需要将退款款项标记为历史 , 生成一条对应类型的退款记录并提交

装修活动审批 , 通过之后将活动项更新到装修活动项 , 根据计算业绩标识计算净业绩和复合业绩 , 根据计算金额标识计算券优惠和物品优惠

主材退货审批 , 通过之后需要将主材退货型号生成退货记录 , 同时判断该主材单是否为预结算/结算状态生成结算数据

主材补款审批 , 通过之后生成补款款项信息

销售退货审批 , 通过之后需要生成退货单以及商品对应退货项 , 同时判断该销售单是否为预结算/结算状态生成结算数据

商品库存调拨审批 , 通过之后按照审批申请商品对应的出入库更新对应商品库存 , 同时生成调拨类型货单以及货单项

销售补款审批 , 通过之后生成补款款项信息

**Requests:**

- `approval.aid` (Long): 审批ID
- `approval.annotate` (String): 批注

```json
{
    "approval.aid": 1,
    "approval.annotate": 1
}
```


##### `查询` refuseApproval

拒绝审批

判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

判断审批状态是否为0(初始)/5(客户确认)/7(客户拒绝) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

装修退款审批 , 拒绝处理过程需要将需要处理的款项状态还原为 **已确认**

主材退货审批 , 拒绝处理过程需要将申请退货的型号还原到主材单中对应商品

主材补款审批 , 拒绝处理过程需要将主材订单补款状态修改为 **初始**

销售退货审批 , 拒绝处理过程需要将申请退货的商品还原到销售单中对应商品

商品库存调拨审批 , 拒绝处理过程需要将申请个调拨商品还原到货单中对应商品

**Requests:**

- `approval.aid` (Long): 审批ID
- `approval.annotate` (String): 批注

```json
{
    "approval.aid": 1,
    "approval.annotate": 1
}
```


##### `查询` affirmApproval

发起确认

判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

判断审批状态是否为0(初始) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

发送通知消息给客户 , 客户完成确认动作

审批状态更新为6(待确认)

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```


##### `查询/创建` confirmApproval

客户确认

判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

判断审批状态是否为6(待确认) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

更新审批信息状态为5(客户确认)

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```


##### `查询/创建` rejectApproval

客户拒绝

判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

判断审批状态是否为6(待确认) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

更新审批信息状态为7(客户拒绝)

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```


##### `查询/创建` approvalCallback

审批回调

判断审批信息是否存在 , 不存在 , 错误信息 **240001 审批信息不存在**

通过回调接口参数 , 执行通过审批或者拒绝审批流程

**Requests:**

- `approval.psid` (String): 钉钉审批编号

```json
{
    "approval.psid": "SLKSDUD238N234FN7"
}
```

## 审批人员


人员关于审批权限管理


> **类**: `api.approval.ApproverAction`


#### 数据类型: `approver`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 审批人员ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 审批类型 , 包括: 1(客户信息修改), 2(订单楼盘信息修改), 3(订单归属修改), 4(报价折扣修改), 5(订单退款), 6(主材退货), 7(主裁场外退款)(过时), 8(活动物品申领), 9(主材补款提交), 10(销售退货) | Short |
| `comment` | 说明信息 | String |


##### `查询/查看` pageApprover

分页方式获取审批人员信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批人员列表 , 每条数据类型 `approver`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "type": 1,
                "user": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryApproverByType

通过审批类型获取审批人员信息

**Requests:**

- `approver.type` (Short): 审批类型

```json
{
    "approver.type": 1
}
```

**Returns:**

- `approvers` (List): 审批人员列表 , 每条数据类型 `approver`

```json
{
    ...
    "approvers": [
        {
            "aid": 1,
            "type": 1,
            "user": {
                "uid": 1,
                "userId": "U001",
                "userName": "设计师",
                "currentName": "设计师",
                "duty": "设计师"
            },
            "comment": "说明"
        }
    ]
    ...
}
```


##### `查询/查看` addApprover

添加审批人员信息

判断当前添加信息 , 审批类型对应员工是否已经存在 , 如果存在 , 错误信息 **230008 审批人员已有该审批权限**

**Requests:**

- `approver.userId` (String): 员工编号
- `approver.type` (Short): 审批类型
- `approver.comment` (String): 说明

```json
{
    "approver.userId": "U001",
    "approver.type": 1,
    "approver.comment": "说明"
}
```


##### `查询/查看` deleteApprover

删除审批人员信息

**Requests:**

- `approver.aid` (Long): 审批人员ID

```json
{
    "approver.aid": 1
}
```

## 装修单客户修改


装修单客户修改审批过程


> **类**: `api.approval.ApprovalDecorationCustomerAction`


#### 数据类型: `approvalDecorationCustomer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adcid` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `scid` | 原客户ID | Long |
| `tcid` | 现客户ID | Long |


##### `查询` submitApprovalForDecorationCustomer

提交客户信息修改审批

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationCustomer.orderId` (String): 装修单号
- `approvalDecorationCustomer.scid` (Long): 原客户ID
- `approvalDecorationCustomer.tcid` (Long): 现客户ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationCustomer.orderId": "1601010001",
    "approvalDecorationCustomer.scid": 1,
    "approvalDecorationCustomer.tcid": 2
}
```

## 装修单房产修改


装修单房产修改审批过程


> **类**: `api.approval.ApprovalDecorationHouseAction`


#### 数据类型: `approvalDecorationHouse`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adhid` | ID | Lonng |
| `aid` | 审批ID | Lonng |
| `orderId` | 装修单号 | String |
| `shid` | 原房产ID | Long |
| `thid` | 现房产ID | Long |


##### `查询` submitApprovalForDecorationHouse

提交装修单楼盘信息修改

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationHouse.orderId` (String): 装修单号
- `approvalDecorationHouse.shid` (String): 原房产ID
- `approvalDecorationHouse.thid` (String): 现房产ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationHouse.orderId": "1601010001",
    "approvalDecorationHouse.shid": 1,
    "approvalDecorationHouse.thid": 2
}
```

## 装修归属修改


装修单归属信息修改审批过程


> **类**: `api.approval.ApprovalDecorationBelongAction`


#### 数据类型: `approvalDecorationBelong`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adbid` | 审批ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `belongType` | 类型 , 包括: 0: 设计 , 1: 业务 | Short |


#### 数据类型: `approvalDecorationBelongItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adbiid` | 项目ID | Long |
| `aobId` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `buid` | 归属人ID | Long |
| `bdid` | 归属部门ID | Long |
| `brid` | 归属分区ID | Long |
| `rate` | 归属比例 | Integer |
| `defaultFlag` | 默认标识 , 0: 否 , 1: 是 | Long |


##### `查询` submitApprovalForDecorationBelong

提交装修单归属信息修改

**Requests:**

- `approval.receiver.userId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationBelong.orderId` (String): 装修单号
- `approvalDecorationBelong.belongType` (Short): 归属类型

```json
{
    "approval.receiver.userId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationBelong.orderId": "1601010001",
    "approvalDecorationBelong.belongType": 0,
    "approvalDecorationBelongItem[0].buid": 1,
    "approvalDecorationBelongItem[0].bdid": 1,
    "approvalDecorationBelongItem[0].brid": 1,
    "approvalDecorationBelongItem[0].rate": 0.5,
    "approvalDecorationBelongItem[0].defaultFlag": 1,
    "approvalDecorationBelongItem[1].buid": 2,
    "approvalDecorationBelongItem[1].bdid": 2,
    "approvalDecorationBelongItem[1].brid": 2,
    "approvalDecorationBelongItem[1].rate": 0.5,
    "approvalDecorationBelongItem[1].defaultFlag": 0
}
```

## 报价折扣修改


报价折扣修改审批过程


> **类**: `api.approval.ApprovalQuotationDiscountAction`


#### 数据类型: `approvalQuotationDiscount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aqdId` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `quotationId` | 报价ID | Integer |
| `oldDiscount` | 原折扣 | Integer |
| `newDiscount` | 新折扣 | Integer |
| `basePrice` | 基数 | Integer |


##### `查询` submitApprovalForQuotationDiscount

提交报价折扣修改

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalQuotationDiscount.orderId` (String): 装修单号
- `approvalQuotationDiscount.quotationId` (String): 报价ID
- `approvalQuotationDiscount.oldDiscount` (String): 原折扣
- `approvalQuotationDiscount.newDiscount` (String): 新折扣
- `approvalQuotationDiscount.basePrice` (String): 新折扣

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalOrderBelong.orderId": "1601010001",
    "approvalOrderBelong.quotationId": 1,
    "approvalOrderBelong.oldDiscount": 10000,
    "approvalOrderBelong.newDiscount": 9,
    "approvalOrderBelong.basePrice": 1
}
```

## 装修款项退款


装修款项退款审批过程


> **类**: `api.approval.ApprovalDecorationRefundAction`


#### 数据类型: `approvalDecorationRefund`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adrId` | ID | Long |
| `aid` | 审批ID | Long |
| `paymentId` | 装修款项ID | Long |


##### `查询` submitApprovalForDecorationRefund

提交装修款项退款审批

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationRefund.paymentId` (String): 装修款项ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationRefund.paymentId": 1
}
```

## 主材退货


主材退货审批过程


> **类**: `api.approval.ApprovalMaterialRefundAction`


#### 数据类型: `approvalMaterialRefund`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amrId` | ID | Long |
| `aid` | 审批ID | Long |
| `msoId` | 主材装修单号 | Long |
| `refund` | 退货总金额 | Long |
| `type` | 类型 , 0: 退货 , 6: 全退 , 7: 倒单 | Short |


#### 数据类型: `approvalMaterialRefundItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amriId` | SubID | Long |
| `amrId` | ID | Long |
| `msoId` | 主材装修单号 | Long |
| `msoiId` | 型号ID | Long |
| `num` | 退货数量 | Integer |
| `total` | 退货金额 | Integer |
| `packageName` | 套餐名 | String |
| `materialItem` | 型号 , 类型 [materialItem ](./material.html#api.material.MaterialItemAction.materialItem) | Object |


##### `查询` queryApprovalMaterialRefundItem

获取主材退货审批项信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalMaterialRefundItems` (List): 主材退货型号信息列表 , 每条数据类型 `approvalMaterialRefundItem`

```json
{
    ...
    "approvalMaterialRefundItems": {
        "mid": 1,
        "miid": 21,
        "num": 1,
        "total": 100000,
        "packageName": "",
        "materialItem": {
            "brannd": "卫浴",
            "name": "卫浴AB1116",
            "no": "JP0005",
            "purchasePrice": 1,
            "category": "洁具",
            "unitPrice": 2670000,
            "measurementUnit": "个",
            ...
        }
    }
    ...
}
```


##### `查询` submitApprovalForMaterialRefund

提交主材退货审批

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalMaterialRefund.mid` (Long): 主材订单ID
- `approvalMaterialRefund.refund` (Long): 退款总金额

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalMaterialRefund.mid": 1,
    "approvalMaterialRefund.refund": 100000,
    "approvalMateralRefundItem[0].mid": 1,
    "approvalMateralRefundItem[0].miid": 21,
    "approvalMateralRefundItem[0].num": 1,
    "approvalMateralRefundItem[0].total": 100000,
    "approvalMateralRefundItem[0].packageName": ""
}
```

## 装修活动申请


装修活动以及活动物品申请审批过程


> **类**: `api.approval.ApprovalDecorationActivityAction`


#### 数据类型: `approvalDecorationActivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adaid` | ID | Long |
| `aid` | 审批ID | Long |
| `activityId` | 活动ID | Long |
| `orderId` | 装修单号 | String |
| `activityName` | 活动名 | String |


#### 数据类型: `approvalDecorationActivityItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adaiid` | SubID | Long |
| `adaid` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `activityName` | 活动名 | String |
| `activityItemName` | 活动物品名 | String |
| `type` | 物品类型 , 包括: 0: 券 , 1: 物品 | Short |
| `stateType` | 状态类型 , 0: 到点 , 1: 定金 , 2: 签单 , 3: 抽奖 , 4: 特批 , 5: 购买(过时) , 6: 其他(过时) , 7: 升级 | Short |
| `num` | 数量 | Integer |
| `money` | 金额 | Integer |
| `content` | 内容 | String |


##### `查询` queryApprovalDecorationActivity

获取装修活动审批信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalDecorationActivityItems` (List): 装修活动项目列表 , 每条数据类型 `approvalDecorationActivityItem`

```json
{
    ...
    "approvalDecorationActivityItems": [
        {
            "adaiid": 1,
            "adaid": 1,
            "aid": 1,
            "orderId": "1601010001",
            "activityName": "活动",
            "activityItemName": "活动项",
            "type": 0,
            "stateType": 0,
            "num": 1,
            "money": 100000,
            "content": "备注"
        }
    ]
    ...
}
```


##### `查询` submitApprovalForDecorationActivity

提交装修活动以及活动物品审批

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationActivity.orderId` (String): 装修单号
- `approvalDecorationActivity.activityName` (String): 活动名

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationActivity.orderId": "1601010001",
    "approvalDecorationActivity.activityName": "活动",
    "approvalDecorationActivityItem[0].activityName": "活动",
    "approvalDecorationActivityItem[0].activityItemName": "券",
    "approvalDecorationActivityItem[0].type": 0,
    "approvalDecorationActivityItem[0].stateType": 0,
    "approvalDecorationActivityItem[0].num": 1,
    "approvalDecorationActivityItem[0].money": 100000,
    "approvalDecorationActivityItem[0].content": ""
}
```

## 主材补款提交审批


主材单所属型号存在折扣价和单价打折之后的价格不等 , 提交补款时需要进行审批


> **类**: `api.approval.ApprovalMaterialFullPaymentAction`


#### 数据类型: `approvalMaterialFullPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amfpid` | ID | Long |
| `aid` | 审批ID | Long |
| `mid` | 主材单ID | Long |
| `referMoney` | 补款金额 | Long |


##### `查询` submitApprovalForMaterialFullPayment

提交主材补款审批

审批通过增加主菜单对应的补款款项信息

判断操作主材单对应的补款是否已经存在 , 如果存在 , 错误信息 **150033 款项类型已存在**

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalMaterialFullPayment.mid` (Long): 主材单ID
- `approvalMaterialFullPayment.referMoney` (Long): 补款金额

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalMaterialFullPayment.mid": 1,
    "approvalMaterialFullPayment.referMoney": 100
}
```

## 销售退货


销售退货审批过程


> **类**: `api.approval.ApprovalSalesRefundAction`


#### 数据类型: `approvalSalesRefund`

| 参数 | 说明 | 类型 |
|------|------|------|
| `asrid` | ID | Long |
| `aid` | 审批ID | Long |
| `sid` | 销售单ID | Long |
| `refund` | 退货总金额 | Long |
| `type` | 类型 , 0: 退货 , 2: 全退 , 3: 倒单 | Short |


#### 数据类型: `approvalSalesRefundItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `asriid` | 退货项ID | Long |
| `asrid` | ID | Long |
| `sid` | 销售单ID | Long |
| `siid` | 销售项ID | Long |
| `num` | 退货数量 | Integer |
| `total` | 退货金额 | Integer |
| `salesItem` | 销售项 , 类型 [salesItem ](./inventory.html#api.inventory.SalesAction.salesItem) | Object |


##### `查看` queryApprovalSalesRefundItem

获取主材退货审批项信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalSalesRefundItems` (List): 主材退货型号信息列表 , 每条数据类型 `approvalSalesRefundItem`

```json
{
    ...
    "approvalSalesRefundItems": [
        {
            "asriid": 1,
            "asrid": 1,
            "sid": 1,
            "num": 1,
            "total": 100000,
            "salesItem": {
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
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
                }
            }
        }
    ]
    ...
}
```


##### `查看` submitApprovalForSalesRefund

提交销售退货审批

销售单信息不存在 , 更新失败 , 错误信息 **260021 销售单不存在**

判断退货商品数据是否大于对应销售项数量 , 错误信息 **260030 销售项剩余数量不足**

判断退货商品对于货单项存在 , 数量是否满足退货数量 , 错误信息 **160031 退货商品未到达仓库**

更新退货所属销售项对应的销售货单项剩余数量

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalSalesRefund.sid` (Long): 销售单ID
- `approvalSalesRefund.refund` (Long): 退款总金额

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalSalesRefund.sid": 1,
    "approvalSalesRefund.refund": 100000,
    "approvalSalesRefundItem[0].sid": 1,
    "approvalSalesRefundItem[0].siid": 21,
    "approvalSalesRefundItem[0].num": 1,
    "approvalSalesRefundItem[0].total": 100
}
```

## 商品库存调拨


商品库存调拨审批过程


> **类**: `api.approval.ApprovalManifestDBAction`


#### 数据类型: `approvalManifestDB`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amdbid` | ID | Long |
| `aid` | 审批ID | Long |
| `manifestTime` | 货单时间 | Timestamp |
| `comment` | 备注 | String |
| `attachment` | 附件路径 | String |


#### 数据类型: `approvalManifestDBItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `amdbiid` | 调拨项ID | Long |
| `amdbid` | ID | Long |
| `goods` | 商品 , 类型 [goods ](./inventory.html#api.data.GoodsAction.goods) | Object |
| `color` | 商品 , 类型 [color ](./inventory.html#api.data.ColorAction.color) | Object |
| `format` | 商品 , 类型 [format ](./inventory.html#api.data.FormatAction.format) | Object |
| `instorehouse` | 入库仓库 , 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `outstorehouse` | 出库仓库, 类型 [storehouse ](./inventory.html#api.inventory.StorehouseAction.storehouse) | Object |
| `num` | 数量 | Integer |
| `comment` | 说明 | String |


##### `查看` queryApprovalManifestDBItem

获取主材退货审批项信息

**Requests:**

- `approval.aid` (Integer): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalManifestDBItems` (List): 调拨商品列表 , 每条数据类型 `approvalManifestDBItem`

```json
{
    ...
    "approvalManifestDBItems": [
        {
            "amdbiid": 1,
            "amdbid": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
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
                "name": "仓库1"
            },
            "outstorehouse": {
                "shid": 2,
                "code": "KDI2J45N",
                "name": "仓库2"
            },
            "num": 10000,
            "comment": "说明"
        }
    ]
    ...
}
```


##### `查看` submitApprovalForManifestDB

提交商品库存调拨审批

判断调拨项出库对应商品(颜色 , 规格)库存不存在 , 调拨失败 , 错误信息 260008 商品库存不足

判断调拨项出库对应商品(颜色 , 规格)库存数量小于出库数量 , 调拨失败 , 错误信息 260008 商品库存不足

更新调拨项出库商品库存和入库商品数量

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalManifestDB.manifestTime` (Timestamp): 货单时间
- `approvalManifestDB.comment` (String): 备注
- `approvalManifestDB.attachment` (String): 附件路径

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalManifestDB.manifestTime": "2016-01-01 00:00:00",
    "approvalManifestDB.comment": 100000,
    "approvalManifestDB.attachment": "",
    "approvalManifestDBItem[0].goods.gid": 1,
    "approvalManifestDBItem[0].color.cid": 1,
    "approvalManifestDBItem[0].format.fid": 1,
    "approvalManifestDBItem[0].instorehouse.shid": 1,
    "approvalManifestDBItem[0].outstorehouse.shid": 2,
    "approvalManifestDBItem[0].num": 1,
    "approvalManifestDBItem[0].comment": "说明"
}
```

## 销售补款提交


销售单中销售项折扣价小于折让价 , 提交补款时需要进行审批


> **类**: `api.approval.ApprovalSalesDiscountAction`


#### 数据类型: `approvalSalesDiscount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `asdid` | ID | Long |
| `aid` | 审批ID | Long |
| `sid` | 销售单ID | Long |
| `referMoney` | 补款金额 | Long |
| `paymentType` | 款项类型 , 支持类型包括: 3(补款) , 5(补款退款) | Short |


##### `查询` submitApprovalForSalesDiscount

销售补款提交审批

审批通过增加销售款对应的补款款项信息

判断操作销售单对应的补款是否已经存在 , 如果存在 , 错误信息 **260012 销售订单当前状态不能提交补款**

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalSalesDiscount.sid` (Long): 销售单ID
- `approvalSalesDiscount.referMoney` (Long): 补款金额
- `approvalSalesDiscount.paymentType` (Short): 款项类型

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalSalesDiscount.sid": 1,
    "approvalSalesDiscount.referMoney": 100000,
    "approvalSalesDiscount.paymentType": 3
}
```

## 客源初审


> **类**: `api.approval.ApprovalCustomerOriginAction`


#### 数据类型: `approvalCustomerOrigin`

| 参数 | 说明 | 类型 |
|------|------|------|
| `acoid` | ID | Long |
| `aid` | 审批ID | Long |
| `csid` | 客源ID | Long |


##### `查询` queryApprovalCustomerOrigin

查询审批客源信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```


##### `查询` submitApprovalForCustomerOrigin

客源初审提交

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalCustomerOrigin.csid` (Long): 客源ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalCustomerOrigin.csid": 1
}
```

## 客源转装修单


客源信息转成装修单

客源关联房产以及客户信息 , 之后提交判断是否存在装修单 , 不存在直接创建装修单 ; 存在通过判断量尺时间以及设计/业务的保护期进行更改装修单归属


> **类**: `api.approval.ApprovalCustomerOriginTDecorationAction`


#### 数据类型: `approvalCustomerOriginTDecoration`

| 参数 | 说明 | 类型 |
|------|------|------|
| `acodid` | ID | Long |
| `aid` | 审批ID | Long |
| `csid` | 客源ID | Long |
| `customerOrigin` | 客源 , 类型 [customerOrigin ](./customer.html#api.customer.CustomerOriginAction.customerOrigin) | Object |
| `type` | 类型 , 0: 半包, 1: 整装, 2: 满减 | Short |
| `typeness` | 类型 | Short |
| `houseType` | 房屋类别 , 包括: 0: 期房 , 1: 现房 | Short |
| `houseClass` | 房屋类型 , 包括: 平层 , 阁楼等 | String |
| `resourceType` | 资源类型 , 0: 咨询 , 1: 量房 | Short |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `code` | 审批编号 | String |
| `forms` | 表格信息 | String |


##### `查询` queryApprovalCustomerOriginTDecoration

提交客源转装修单审批

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalCustomerOriginTDecoration` (Object): 客源信息 , 类型 `approvalCustomerOriginTDecoration`

```json
{
    ...
    "approvalCustomerOriginTDecoration": {
        "customerOrigin": {
            "house": {
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
            },
            "designer": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "buildArea": 100000,
            "salesmanType": "资源",
        },
        "salesman": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "type": 0,
        "typeness": 0,
        "houseType": 0,
        "houseClass": "别墅",
        "resourceType": 0,
    }
    ...
}
```


##### `查询` submitApprovalForCustomerOriginTDecoration

提交客源转装修单审批

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态是否为3(确认)和6(拒绝) , 其他状态 , 错误信息 **330014 客源状态不可操作**

判断客源业务类型是否存在 , 不存在 , 错误信息 **240008 业务类型非空**

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalCustomerOriginTDecoration.customerOrigin.csid` (Long): 客源ID
- `approvalCustomerOriginTDecoration.type` (Short): 装修单类型
- `approvalCustomerOriginTDecoration.typeness` (Short): 装修单类型
- `approvalCustomerOriginTDecoration.houseType` (Short): 房屋类别
- `approvalCustomerOriginTDecoration.houseClass` (String): 房屋类型
- `approvalCustomerOriginTDecoration.resourceType` (Short): 资源类型
- `approvalCustomerOriginTDecoration.salesman.userId` (Integer): 业务员ID

```json
{
    "approvalCustomerOriginTDecoration.customerOrigin.csid": 1,
    "approvalCustomerOriginTDecoration.type": 0,
    "approvalCustomerOriginTDecoration.typeness": 0,
    "approvalCustomerOriginTDecoration.houseType": "期房",
    "approvalCustomerOriginTDecoration.resourceType": 1,
    "approvalCustomerOriginTDecoration.salesman.userId": 1
}
```

## 客户资源


> **类**: `api.approval.ApprovalCustomerSourceAction`


#### 数据类型: `approvalCustomerSource`

| 参数 | 说明 | 类型 |
|------|------|------|
| `acsid` | ID | Long |
| `aid` | 审批ID | Long |
| `csid` | 资源ID | Long |
| `hid` | 房产ID | Long |


##### `查询` queryApprovalCustomerSource

查询审批客源信息

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```


##### `查询` submitApprovalForCustomerSource

客源初审提交

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalCustomerSource.csid` (Long): 客源ID
- `approvalCustomerSource.hid` (Long): 房产ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalCustomerSource.hid": 1,
    "approvalCustomerSource.hid": 1
}
```

## 客户机会


机会信息转成装修单

客源关联房产以及客户信息 , 之后提交判断是否存在装修单 , 不存在直接创建装修单 ; 存在通过判断量尺时间以及设计/业务的保护期进行更改装修单归属


> **类**: `api.approval.ApprovalCustomerChanceAction`


#### 数据类型: `approvalCustomerChance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `accid` | ID | Long |
| `aid` | 审批ID | Long |
| `ccid` | 机会ID | Long |
| `chance` | 机会 , 类型 [customerChance ](./customer.html#api.customer.CustomerChanceAction.customerChance) | Object |
| `type` | 类型 , 0: 半包, 1: 整装, 2: 满减 | Short |
| `typeness` | 类型 | Short |
| `houseType` | 房屋类别 , 包括: 0: 期房 , 1: 现房 | Short |
| `houseClass` | 房屋类型 , 包括: 平层 , 阁楼等 | String |
| `resourceType` | 资源类型 , 0: 咨询 , 1: 量房 | Short |
| `code` | 审批编号 | String |
| `forms` | 表格信息 | String |


##### `查询` queryApprovalCustomerChance

提交客源转装修单审批

**Requests:**

- `approval.aid` (Long): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approvalCustomerChance` (Object): 客源信息 , 类型 `approvalCustomerChance`

```json
{
    ...
    "approvalCustomerChance": {
        "chance": {
            "house": {
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
            },
            "designer": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "buildArea": 100000,
            "salesmanType": "资源",
        },
        "type": 0,
        "typeness": 0,
        "houseType": 0,
        "houseClass": "别墅",
        "resourceType": 0,
    }
    ...
}
```


##### `查询` submitApprovalForCustomerChance

提交客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态是否为3(确认) , 其他状态 , 错误信息 **330077 客户机会不可操作**

判断客户资源状态是否为3(确认) , 其他状态 , 错误信息 **330074 客户资源不可操作**

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalCustomerChance.chance.ccid` (Long): 机会ID
- `approvalCustomerChance.type` (Short): 装修单类型
- `approvalCustomerChance.typeness` (Short): 装修单类型
- `approvalCustomerChance.houseType` (Short): 房屋类别
- `approvalCustomerChance.houseClass` (String): 房屋类型
- `approvalCustomerChance.resourceType` (Short): 资源类型
- `approvalCustomerChance.salesman.userId` (Integer): 业务员ID

```json
{
    "approvalCustomerChance.chance.ccid": 1,
    "approvalCustomerChance.type": 0,
    "approvalCustomerChance.typeness": 0,
    "approvalCustomerChance.houseType": "期房",
    "approvalCustomerChance.resourceType": 1,
    "approvalCustomerChance.salesman.userId": 1
}
```

## 装修单满减修改


> **类**: `api.approval.ApprovalDecorationHolonomyAction`


#### 数据类型: `approvalDecorationHolonomy`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adhid` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `materialPrice` | 主材配比额 | Long |


##### `查询` submitApprovalForDecorationHolonomy

装修单满减修改

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationHolonomy.orderId` (Long): 装修单
- `approvalDecorationHolonomy.materialPrice` (Long): 补款金额

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalSalesDiscount.sid": 1,
    "approvalSalesDiscount.referMoney": 100000
}
```

**Returns:**

- `approvalCustomerOrigin` (Object): 客源信息 , 类型 `approvalCustomerOrigin`

```json
{
    ...
    "approvalCustomerOrigin": {
        "customerOrigin": {
            "house": {
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
            },
            "designer": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "buildArea": 100000,
            "salesmanType": "资源",
        }
    }
    ...
}
```

## 销售不退定金


> **类**: `api.approval.ApprovalSalesDaymentAction`


#### 数据类型: `approvalSalesDayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sadid` | ID | Long |
| `aid` | 审批ID | Long |
| `sid` | 销售单ID | Long |


##### `查询` submitApprovalForSalesDayment

销售不退定金

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalSalesDayment.sid` (Long): 销售单ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalSalesDayment.sid": 1
}
```

## 装修合同终止


> **类**: `api.approval.ApprovalDecorationTerminalAction`


#### 数据类型: `approvalDecorationTerminal`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adtid` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |


#### 数据类型: `approvalDecorationTerminalItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adtiid` | ID | Long |
| `aid` | 审批ID | Long |
| `adtid` | 合同终止审批ID | Long |
| `paymentType` | 款项类型 | String |
| `referMoney` | 金额 | Long |


##### `查询` submitApprovalForDecorationTerminal

销售不退定金

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationTerminal.orderId` (String): 装修单号

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",
    "approvalDecorationTerminal.orderId": "1601010001",
    "approvalDecorationTerminalItem[0].paymentType": "违约金",
    "approvalDecorationTerminalItem[0].referMoney": 0
}
```

## 报价特批优惠


> **类**: `api.approval.ApprovalQuotationPreferAction`


#### 数据类型: `approvalQuotationPrefer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aqpid` | ID | Long |
| `aid` | 审批ID | Long |
| `qid` | 报价ID | Long |
| `qpid` | 报价优惠ID | Long |
| `ppid` | 预签产品ID | Long |
| `preferPrice` | 优惠额 | Long |
| `managePrefer` | 管理优惠 | Long |
| `advancePrefer` | 特批优惠 | Long |
| `taxPrice` | 税金 |  |
| `totalPrice` | 报价总额 | Long |


##### `查询` submitApprovalForQuotationPreferAction

报价特批优惠

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalQuotationPrefer.qid` (Long): 报价ID
- `approvalQuotationPrefer.qpid` (Long): 报价优惠ID
- `approvalQuotationPrefer.ppid` (Long): 预签产品ID
- `approvalQuotationPrefer.preferPrice` (Long): 优惠额
- `approvalQuotationPrefer.managePrefer` (Long): 管理优惠
- `approvalQuotationPrefer.advancePrefer` (Long): 管理优惠
- `approvalQuotationPrefer.taxPrice` (Long): 管理优惠
- `approvalQuotationPrefer.totalPrice` (Long): 报价总额

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",

    "approvalQuotationPrefer.qid": 1,
    "approvalQuotationPrefer.qpid": 1,
    "approvalQuotationPrefer.ppid": 0,
    "approvalQuotationPrefer.preferPrice": 10000,
    "approvalQuotationPrefer.managePrefer": 10000,
    "approvalQuotationPrefer.advancePrefer": 10000,
    "approvalQuotationPrefer.taxPrice": 10000,
    "approvalQuotationPrefer.totalPrice": 10000
}
```

## 装修合同生成


> **类**: `api.approval.ApprovalDecorationContractAction`


#### 数据类型: `approvalDecorationContract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adcid` | ID | Long |
| `aid` | 审批ID | Long |
| `orderId` | 装修单号 | String |
| `cid` | 合同模板ID | Long |


##### `查询` submitApprovalDecorationContractAction

报价特批优惠

**Requests:**

- `approval.receiverId` (String): 接收人编号
- `approval.comment` (String): 备注信息
- `approvalDecorationContract.orderId` (String): 装修单号
- `approvalDecorationContract.cid` (Long): 合同模板ID

```json
{
    "approval.receiverId": "U0479",
    "approval.comment": "说明",

    "approvalQuotationPrefer.orderId": '1601010001',
    "approvalQuotationPrefer.cid": 1
}
```

## 钉钉


> **类**: `api.approval.ProcessAction`


#### 数据类型: `processRefer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `prid` | 参考ID | Long |
| `id` | 标识 | String |
| `name` | 名称 | String |
| `type` | 类型 , 包括: query, filling, select, text, textarea, upload, datetime | String |


#### 数据类型: `process`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 审批ID | Long |
| `name` | 名称 | String |
| `key` | 键值 | String |
| `code` | 编号 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `processItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `piid` | 项目ID | Long |
| `pid` | 审批ID | Long |
| `id` | 标识 | String |
| `name` | 名称 | String |
| `form` | 类别 , 包括: field, item, comment | String |
| `type` | 类型 , 包括: query, filling, select, text, textarea, upload, datetime | String |
| `validate` | 校验 , 包括: require, integer, float | String |
| `data` | 数据 , select类型选择项内容 | String |
| `comment` | 备注 , 备注类型说明内容 | String |
| `sort` | 排序 | Short |


##### `查询` queryProcessRefer

获取审批参考信息

**Returns:**

- `processRefers` (List): 审批参考列表 , 每条数据类型 `processRefer`

```json
{
    ...
    "processRefers": [
        {
            "prid": 1,
            "id": "id",
            "name": "参考名称",
            "type": "filling"
        }
    ],
    ...
}
```


##### `查询` pageProcess

分页方式获取审批信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 审批信息列表 , 每条数据类型 `process`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "name": "审批名称",
                "key": "A348",
                "code": "JSD4H324JJ4JNjd43JNjdsjf"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryProcess

获取审批信息

**Returns:**

- `processes` (List): 审批信息列表 , 每条数据类型 `process`

```json
{
    ...
    "processes": [
        {
            "pid": 1,
            "name": "审批名称",
            "key": "A348",
            "code": "JSD4H324JJ4JNjd43JNjdsjf"
            "items": [
                {
                    "piid": 1,
                    "pid": 1,
                    "id": "name",
                    "name": "名称",
                    "form": "field",
                    "type": "text",
                    "validate": "require",
                    "data": "",
                    "comment": "",
                    "sort": 1
                }
            ],
        }
    }
    ...
}
```


##### `查询` queryProcessByPid

获取审批信息

**Requests:**

- `process.pid` (Long): 审批ID

```json
{
    "process.pid": 1
}
```

**Returns:**

- `process` (Object): 审批信息 , 类型 `process`

```json
{
    ...
    "process": {
        "pid": 1,
        "name": "审批名称",
        "key": "A348",
        "code": "JSD4H324JJ4JNjd43JNjdsjf"
        "items": [
            {
                "piid": 1,
                "pid": 1,
                "id": "name",
                "name": "名称",
                "form": "field",
                "type": "text",
                "validate": "require",
                "data": "",
                "comment": "",
                "sort": 1
            }
        ]
    }
    ...
}
```


##### `查询` queryProcessItem

获取审批项信息

**Requests:**

- `process.pid` (Long): 审批ID

```json
{
    "process.pid": 1
}
```

**Returns:**

- `processItems` (Object): 审批项目信息列表 , 类型 `processItem`

```json
{
    ...
    "processItems": [
        {
            "piid": 1,
            "pid": 1,
            "id": "name",
            "name": "名称",
            "form": "field",
            "type": "text",
            "validate": "require",
            "data": "",
            "comment": "",
            "sort": 1
        }
    ]
    ...
}
```


##### `查询` addProcess

添加审批

**Requests:**

- `process.name` (Long): 名称
- `process.key` (Long): 键值
- `process.code` (String): 编号

```json
{
    "process.name": "名称",
    "process.key": "A348",
    "process.code": "JSD4H324JJ4JNjd43JNjdsjf",

    "processItems[0].id": "name",
    "processItems[0].name": "名称",
    "processItems[0].form": "field",
    "processItems[0].type": "text",
    "processItems[0].validate": "require",
    "processItems[0].data": "",
    "processItems[0].comment": "",
    "processItems[0].sort": 1
}
```


##### `查询` updateProcess

更新审批

**Requests:**

- `process.pid` (Long): 审批ID
- `process.name` (Long): 名称
- `process.key` (Long): 键值
- `process.code` (String): 编号

```json
{
    "process.pid": 1,
    "process.name": "名称",
    "process.key": "A348",
    "process.code": "JSD4H324JJ4JNjd43JNjdsjf",

    "processItems[0].id": "name",
    "processItems[0].name": "名称",
    "processItems[0].form": "field",
    "processItems[0].type": "text",
    "processItems[0].validate": "require",
    "processItems[0].data": "",
    "processItems[0].comment": "",
    "processItems[0].sort": 1
}
```


##### `查询` updateProcessForStatus

更新审批状态

**Requests:**

- `process.pid` (Long): 审批ID
- `process.status` (Short): 状态

```json
{
    "process.pid": 1,
    "process.status": 1
}
```


##### `查询` deleteProcess

删除审批

**Requests:**

- `process.pid` (Long): 审批ID

```json
{
    "process.pid": 1,
    "process.status": 1
}
```


##### `查询` updateProcessItem

更新审批项

**Requests:**

- `processItem.piid` (Long): 项目ID
- `processItem.id` (String): 标识
- `processItem.name` (String): 名称
- `processItem.form` (String): 类别
- `processItem.type` (String): 类型
- `processItem.validate` (String): 校验
- `processItem.data` (String): 数据
- `processItem.comment` (String): 备注
- `processItem.sort` (Short): 排序

```json
{
    "processItem.piid": 1,
    "processItem.id": "name",
    "processItem.name": "名称",
    "processItem.form": "field",
    "processItem.type": "text",
    "processItem.validate": "require",
    "processItem.data": "",
    "processItem.comment": "",
    "processItem.sort": 1
}
```


##### `查询` deleteProcessItem

删除审批项

**Requests:**

- `processItem.piid` (Long): 项目ID

```json
{
    "processItem.piid": 1
}
```
