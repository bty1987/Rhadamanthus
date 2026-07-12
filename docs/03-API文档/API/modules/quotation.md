# 报价


## 预报


### 预报


装修单报价相关信息管理

折前总额 = ∑打折项 + ∑非打折项

折后总额 = ∑打折项 * 折扣 + ∑非打折项

车运费 = (∑打折项 + ∑非打折项) * 车运费比例

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例

报价额 = 工程额 + 车运费 + 管理费


> **类**: `api.quotetion.QuotetionAction`


#### 数据类型: `quotetion`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qid` | 报价ID | Long |
| `no` | 编号 , 随机生成一组字符串 , 同时系统唯一 | String |
| `name` | 报价名称 | String |
| `version` | 报价版本编号 | String |
| `cuid` | 创建人ID | Long |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `basePrice` | 基数 | Long |
| `undisPrice` | 不打折项总额 = ∑(工程量 * 不打折项折前单价) | Long |
| `disPrice` | 打折项总额 = ∑(工程量 * 打折项折前总价) | Long |
| `consPrice` | 工程总额 | Long |
| `comsPrice` | 主材总额 | Long |
| `discount` | 折扣 | Long |
| `trafficPrice` | 车运费 | Long |
| `trafficRate` | 车运费比例 | Integer |
| `trafficDiscount` | 车运费折扣 , 0: 不打折 1: 打折 | Short |
| `managePrice` | 管理费 | Long |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理费折扣 , 0: 不打折 1: 打折 | Short |
| `taxPrice` | 税金 | Long |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 | Short |
| `costPrice` | 成本总额 | Long |
| `content` | 说明 | String |
| `totalPrice` | 报价总额 | Long |


##### `查询` queryQuotetion

通过创建人ID查询归属的报价信息

**Returns:**

- `quotetions` (List): 报价信息列表 , 类型 `quotetion`

```json
{
    ...
    "quotetions":[
        {
            "qid": 1,
            "no": "JIN123IN4JKHJH",
            "name": "现代",
            "version": "QV001",
            "createTime": "2016-01-01",
            "updateTime": "2016-01-01",
            "basePrice": 0,
            "undisPrice": 90154,
            "disPrice": 90154,
            "consPrice": 0,
            "comsPrice": 0,
            "discount": 10000,
            "trafficPrice": 7800,
            "trafficRate": 200,
            "trafficDiscount": 0,
            "managePrice": 11154,
            "manageRate": 100,
            "manageDiscount": 0,
            "taxPrice": 0,
            "taxRate": 0,
            "taxDiscount": 0,
            "costPrice": 0,
            "totalPrice": 90154,
            "content": ""
        }
    ],
    ...
}
```


##### `查询` queryQuotetionByQid

通过报价ID获取报价信息

**Requests:**

- `quotetion.qid` (Long): 报价ID

```json
{
    "quotetion.qid": 1
}
```

**Returns:**

- `quotetion` (Object): 报价信息 , 类型 `quotetion`

```json
{
    ...
    "quotetion": {
        "qid": 1,
        "no": "JIN123IN4JKHJH",
        "name": "现代",
        "version": "QV001",
        "createTime": "2016-01-01",
        "updateTime": "2016-01-01",
        "basePrice": 0,
        "undisPrice": 90154,
        "disPrice": 90154,
        "consPrice": 0,
        "comsPrice": 0,
        "discount": 10000,
        "trafficPrice": 7800,
        "trafficRate": 200,
        "trafficDiscount": 0,
        "managePrice": 11154,
        "manageRate": 100,
        "manageDiscount": 0,
        "taxPrice": 0,
        "taxRate": 0,
        "taxDiscount": 0,
        "costPrice": 0,
        "totalPrice": 90154,
        "content": ""
    }
    ...
}
```


##### `查询` queryQuotetionByNo

通过报价编号获取报价信息

**Requests:**

- `quotetion.no` (String): 报价编号

```json
{
    "quotetion.no": "JIN123IN4JKHJH"
}
```

**Returns:**

- `quotetion` (Object): 报价信息 , 类型 `quotetion`

```json
{
    ...
    "quotetion": {
        "qid": 1,
        "no": "JIN123IN4JKHJH",
        "name": "现代",
        "version": "QV001",
        "createTime": "2016-01-01",
        "updateTime": "2016-01-01",
        "basePrice": 0,
        "undisPrice": 90154,
        "disPrice": 90154,
        "consPrice": 0,
        "comsPrice": 0,
        "discount": 10000,
        "trafficPrice": 7800,
        "trafficRate": 200,
        "trafficDiscount": 0,
        "managePrice": 11154,
        "manageRate": 100,
        "manageDiscount": 0,
        "taxPrice": 0,
        "taxRate": 0,
        "taxDiscount": 0,
        "costPrice": 0,
        "totalPrice": 90154,
        "content": ""
    }
    ...
}
```


##### `查询` addQuotetion

添加报价信息

判断当前操作人员创建报价数量 , 大于阀值 , 错误信息 **200001 报价已经达到数量上限**

创建名称为"生成项目"功能区 , 排序号为9999 , 类型为0(管理)

"生成项目"功能区创建两个项目

名称: "车运费" , 单位: "" , 工种: "其他" , 类型: 2(车运费) , 子类: 0(工程)

名称: "管理费" , 单位: "" , 工种: "其他" , 类型: 3(管理费) , 子类: 0(工程)

车运费和管理费的比例根据报价版本信息获取

**Requests:**

- `quotetion.name` (String): 报价名
- `quotetion.version` (String): 报价版本编号
- `quotetion.content` (String): 说明

```json
{
    "quotetion.name": "测试",
    "quotetion.version": "QV001",
    "quotetion.content": ""
}
```


##### `查询` updateQuotetion

更新报价基础信息

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.name` (String): 报价名
- `quotetion.content` (String): 说明

```json
{
    "quotetion.qid": 1,
    "quotetion.name": "测试",
    "quotetion.content": ""
}
```


##### `查询` updateQuotetionForAdvance

更新报价高级信息 , 同时按照报价的类型分别更新对应的信息

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.consPrice` (Long): 工程总额
- `quotetion.comsPrice` (Long): 主材总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本金额
- `quotetion.totalPrice` (Long): 报价总额

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.consPrice": 0,
    "quotetion.comsPrice": 0,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000
}
```


##### `查询` replicaQuotetion

拷贝报价 , 将报价(quotation)拷贝到报价(quotetion)

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.qid` (Long): 报价ID

```json
{
    "quotetion.no": 1
}
```


##### `查询` copyQuotetion

复制报价到报价中

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.qid` (Long): 拷贝报价ID

```json
{
    "quotetion.qid": 1
}
```


##### `查询` cloneQuotetion

克隆报价 , 通过报价编号进行拷贝

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.no` (String): 报价编号

```json
{
    "quotetion.no": "JIN123IN4JKHJH"
}
```


##### `查询` deleteQuotetion

通过报价ID删除报价信息 , 默认报价不能删除

判断删除报价是否归属操作人 , 不归属 , 错误信息 **200030 报价不可操作**

**Requests:**

- `quotetion.qid` (Long): 报价ID

```json
{
    "quotetion.qid": 1,
}
```

### 预报-功能区


报价中功能区信息管理


> **类**: `api.quotetion.QuotetionFunctionAreaAction`


#### 数据类型: `quotetionFunctionArea`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfaid` | 功能区ID | Long |
| `qid` | 报价ID | Long |
| `name` | 功能区名 | String |
| `index` | 功能区排序 | Integer |
| `type` | 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算) , 4(成本), 5(非业绩) | Short |
| `quotetionFunctionAreaItems` | 功能区包含报价项信息列表 , 每条数据类型 [quotetionFunctionAreaItem ](./quotation.html#api.quotetion.QuotetionFunctionAreaItemAction.quotetionFunctionAreaItem) | List |


##### `查询` queryQuotetionFunctionAreaByQid

通过报价ID查询功能区信息 , 包含功能区中报价项信息

**Requests:**

- `quotetion.qid` (Long): 报价ID

```json
{
    "quotetion.qid": 1,
}
```

**Returns:**

- `quotetionFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotetionFunctionArea`

```json
{
    ...
    "quotetionFunctionAreas": [
        {
            "qfaid": 1,
            "qid": 1,
            "name": "门厅",
            "sort": 1,
            "type": 1,
            "quotetionFunctionAreaItems": [
                {
                    "qfaiid": 1,
                    "qfaid": 1,
                    "qiid": null,
                    "name": "报价项",
                    "measurementUnit": "",
                    "discount": 0,
                    "num": 1,
                    "type": 2,
                    "unitPrice": 100,
                    "workType": "木工",
                    "content": ""
                }
            ]
        }
    ],
    ...
}
```


##### `查询` addQuotetionFuctionArea

报价中添加功能区信息

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

返回功能区 , 同时返回功能区中包含的报价项

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本金额
- `quotetion.totalPrice` (Long): 报价总额

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000,

    "functionAreaIds[0]": 1,
    "functionAreaIds[1]": 2,
}
```

**Returns:**

- `quotetionFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotetionFunctionArea`

```json
{
    ...
    "quotetionFunctionAreas": [
        {
            "qfaid": 1,
            "qid": 1,
            "name": "门厅",
            "sort": 1,
            "type": 1,
            "quotetionFunctionAreaItems": [
                {
                    "qfaiid": 1,
                    "qfaid": 1,
                    "qiid": 0,
                    "name": "报价项",
                    "measurementUnit": "",
                    "discount": 0,
                    "num": 1,
                    "type": 2,
                    "unitPrice": 100,
                    "workType": "木工",
                    "content": ""
                }
            ]
        }
    ],
    ...
}
```


##### `查询` updateQuotetionFunctionArea

更新功能区信息

判断功能区是否存在 , 不存在 , 错误信息 **200010 功能区不存在**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本总额
- `quotetion.totalPrice` (Long): 报价总额
- `quotetionFunctionArea.qfaid` (Long): 功能区ID
- `quotetionFunctionArea.name` (String): 功能区名称
- `quotetionFunctionArea.sort` (Integer): 功能区排序

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000,

    "quotetionFunctionArea.qfaid": 2,
    "quotetionFunctionArea.name": "门厅",
    "quotetionFunctionArea.sort": 2,
}
```


##### `查询` deleteQuotetionFunctionArea

删除功能区信息 , 功能区中包含的报价项信息一同删除

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本总额
- `quotetion.totalPrice` (Long): 报价总额
- `quotetionFunctionArea.qfaid` (Long): 功能区ID

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000,

    "quotetionFunctionArea.qfaid": 2
}
```

### 功能区-预报项


功能区中报价项信息管理


> **类**: `api.quotetion.QuotetionFunctionAreaItemAction`


#### 数据类型: `quotetionFunctionAreaItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfaiId` | 报价项ID | Long |
| `qfaid` | 所属功能区ID | Long |
| `qiid` | 引用报价项ID | Long |
| `name` | 报价项名 | String |
| `unitPrice` | 单价 | Integer |
| `index` | 索引 | Integer |
| `formula` | 公式 | String |
| `num` | 工程量 | Integer |
| `type` | 类型 , 0: 标准 , 1: 自定义 , 2: 车运 , 3: 管理 , 4: 不计 , 5: 成本 | Short |
| `subtype` | 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装 | Short |
| `measurementUnit` | 单位 | String |
| `workType` | 工种 | String |
| `discount` | 折扣标识 , 0: 不打折 , 1: 打折 | Short |
| `content` | 说明 | String |


##### `查询` updateQuotetionFunctionAreaItem

更新报价项信息 , 若无信息则为创建报价项信息

标准报价项 , 需要引用报价项ID信息 , 其他信息直接赋值

自定义报价项 , 引用报价项ID为NULL , 其他信息直接赋值

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本总额
- `quotetion.totalPrice` (Long): 报价总额
- `quotetionFunctionAreaItem.qfaiId` (Long): 报价项ID
- `quotetionFunctionAreaItem.qfaid` (Long): 所属功能区ID
- `quotetionFunctionAreaItem.qiid` (Long): 引用报价项ID
- `quotetionFunctionAreaItem.name` (String): 报价项名
- `quotetionFunctionAreaItem.unitPrice` (Integer): 单价
- `quotetionFunctionAreaItem.index` (Integer): 索引
- `quotetionFunctionAreaItem.formula` (String): 公式
- `quotetionFunctionAreaItem.num` (Integer): 工程量
- `quotetionFunctionAreaItem.type` (Short): 类型 , 0: 标准报价项 , 1: 自定义报价项
- `quotetionFunctionAreaItem.subtype` (Short): 子类
- `quotetionFunctionAreaItem.measurementUnit` (String): 单位
- `quotetionFunctionAreaItem.workType` (String): 工种
- `quotetionFunctionAreaItem.discount` (Short): 折扣标识 , 0: 不打折 , 1: 打折
- `quotetionFunctionAreaItem.content` (String): 说明

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000,

    "quotetionFunctionAreaItem.qfaid": 1,
    "quotetionFunctionAreaItem.qiid": null,
    "quotetionFunctionAreaItem.name": "整体墙棚面砂纸打磨处理",
    "quotetionFunctionAreaItem.index": 1,
    "quotetionFunctionAreaItem.formula": "1+1",
    "quotetionFunctionAreaItem.num": 5,
    "quotetionFunctionAreaItem.type": 0,
    "quotetionFunctionAreaItem.subtype": 0,
    "quotetionFunctionAreaItem.unitPrice": 2,
    "quotetionFunctionAreaItem.workType": "油",
    "quotetionFunctionAreaItem.measurementUnit": "平方米",
    "quotetionFunctionAreaItem.discount": 1,
    "quotetionFunctionAreaItem.content": ""
}
```

**Returns:**

- `quotetionFunctionAreaItem` (Object): 报价项信息 , 类型 `quotetionFunctionAreaItem`

```json
{
    ...
    "quotetionFunctionAreaItem": {
        "qfaiid": 1,
        "qfaid": 1,
        "qiid": 0,
        "name": "整体墙棚面砂纸打磨处理",
        "index": 1,
        "formula": "1+1",
        "num": 5,
        "type": 0,
        "subtype": 0,
        "unitPrice": 2,
        "workType": "油",
        "measurementUnit": "平方米",
        "discount": 1,
        "content": null,
    },
    ...
}
```


##### `查询` updateQuotetionFunctionAreaItemForIndex

更新报价项排序索引

更新过程只能够在同一个功能区中的两个索引之间完成

利用功能区定位报价项归属表

报价项获取失败或无报价项 , 不进行更新动作

判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**

**Requests:**

- `quotetionFunctionArea.qfaid` (Long): 功能区ID

```json
{
    "quotetionFunctionArea.qfaid": 1,
    "quotetionFunctionAreaItems[0].qfaiId": 1,
    "quotetionFunctionAreaItems[0].index": 1,
    "quotetionFunctionAreaItems[1].qfaiId": 2,
    "quotetionFunctionAreaItems[1].index": 2
}
```


##### `查询` updateQuotetionFunctionAreaItemForSpec

通过报价ID以及报价项类型更新报价项单价信息 , 只能适用类型为2:车运费和3:管理费的项目

判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本总额
- `quotetion.totalPrice` (Long): 报价总额
- `quotetionFunctionAreaItem.qfaiid` (Long): 报价项ID
- `quotetionFunctionAreaItem.unitPrice` (Integer): 单价

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 0,
    "quotetion.totalPrice": 10000,

    "quotetionFunctionAreaItem.qfaiid": 1,
    "quotetionFunctionAreaItem.unitPrice": 200
}
```


##### `查询` deleteQuotetionFunctionAreaItem

删除报价项信息

利用功能区定位报价项归属表

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotetion.qid` (Long): 报价ID
- `quotetion.basePrice` (Long): 基数
- `quotetion.undisPrice` (Long): 不打折项总额
- `quotetion.disPrice` (Long): 打折项总额
- `quotetion.discount` (Long): 折扣
- `quotetion.trafficPrice` (Long): 车运费
- `quotetion.trafficRate` (Integer): 车运费比例
- `quotetion.trafficDiscount` (Short): 车运费折扣
- `quotetion.managePrice` (Long): 管理费
- `quotetion.manageRate` (Integer): 管理费比例
- `quotetion.manageDiscount` (Short): 管理费折扣
- `quotetion.taxPrice` (Long): 税金
- `quotetion.taxRate` (Integer): 税金比例
- `quotetion.taxDiscount` (Short): 税金折扣
- `quotetion.costPrice` (Long): 成本总额
- `quotetion.totalPrice` (Long): 报价总额
- `quotetionFunctionArea.qfaid` (Long): 功能区ID
- `qfaiIds` (List): 报价项ID列表 , 每条数据类型 Long

```json
{
    "quotetion.qid": 1,
    "quotetion.basePrice": 0,
    "quotetion.undisPrice": 10000,
    "quotetion.disPrice": 10000,
    "quotetion.discount": 900,
    "quotetion.trafficPrice": 0,
    "quotetion.trafficRate": 200,
    "quotetion.trafficDiscount": 0,
    "quotetion.managePrice": 0,
    "quotetion.manageRate": 10035,
    "quotetion.manageDiscount": 0,
    "quotetion.taxPrice": 0,
    "quotetion.taxRate": 10035,
    "quotetion.taxDiscount": 0,
    "quotetion.costPrice": 10000,
    "quotetion.totalPrice": 10000,

    "quotetionFunctionArea.qfaid": 1,
    "qfaiIds[0]": 1,
    "qfaiIds[1]": 2
}
```

## 预签


折扣 = (起报价 - 优惠) / (起报价)
管理费 = (起报价 - 减项 - 优惠) * 管理费比例
总价 = 起报价 + 管理费 + 额外功能区 - 减项 + 增项 + 赋能

### 预签


> **类**: `api.quotation.ProtationAction`


#### 数据类型: `protation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 预签ID | Long |
| `ppid` | 预签产品ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `version` | 报价版本 , 类型 [quotationVersion ](./data.html#api.data.QuotationVersionAction.quotationVersion) | Object |
| `product` | 产品名称 | String |
| `name` | 名称 | 名称 |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `quotePrice` | 起报价 | Long |
| `quoteArea` | 起报面积 | Integer |
| `preferPrice` | 优惠额 | Long |
| `managePrice` | 管理费 | Long |
| `advancePrice` | 特殊优惠 | Long |
| `unitPrice` | 计价单价 | Long |
| `manageFormula` | 管理公式 | String |
| `managePrice` | 管理费 | Long |
| `costPrice` | 成本单价 | Long |
| `mostPrice` | 主材成本 | Long |
| `profitRate` | 利润率 | Integer |
| `costRate` | 工程增项成本比例 | Integer |
| `mostRate` | 主材增项成本比例 | Integer |
| `basicPrice` | 基础额 | Long |
| `comdPrice` | 工程额 | Long |
| `commPrice` | 主材额 | Long |
| `adddPrice` | 增工额 | Long |
| `addmPrice` | 增主额 | Long |
| `subcPrice` | 减通额 | Long |
| `subdPrice` | 减工额 | Long |
| `submPrice` | 减主额 | Long |
| `accdPrice` | 赋工额 | Long |
| `accmPrice` | 赋主额 | Long |
| `totalPrice` | 总额 | Long |
| `totalCost` | 成本总额 | Long |
| `totalProfit` | 利润总额 | Long |
| `status` | 状态 , 0: 启用 , 1: 禁用 , 2: 锁定 | Short |
| `defaults` | 默认标识 , 0: 非默认 , 1: 默认 | Short |
| `comment` | 备注 | String |


##### `查询` pageProtation

分页方式获预签单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 预签单信息列表 , 每条数据类型 `protation`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "ppid": 1,
                "orderId": "1601010001",
                "decoration": {
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
                },
                "version": {
                    "qvid": 1,
                    "no": "QV001",
                    "name": "test"
                    "comment": "test"
                },
                "name": "预签信息",
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "quotePrice": 100000,
                "quoteArea": 1000000,
                "preferPrice": 1000,
                "managePrice": 0,
                "advancePrice": 0,
                "unitPrice": 100000,
                "manageFormula": "",
                "managePrice": 0,
                "costPrice": 799000,
                "mostPrice": 20000000,
                "profitRate": 0,
                "costRate": 100,
                "mostRate": 100,
                "basicPrice": 0,
                "comdPrice": 0,
                "commPrice": 0,
                "adddPrice": 0,
                "addmPrice": 0,
                "subcPrice": 0,
                "subdPrice": 0,
                "submPrice": 0,
                "accdPrice": 0,
                "accmPrice": 0,
                "totalPrice": 0,
                "totalCost": 0,
                "totalProfit": 0,
                "status": 0,
                "defaults": 0,
                "comment": "备注"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryProtationByOrderId

通过装修单号查询预签信息

**Requests:**

- `protation.orderId` (String): 装修单号

```json
{
    "protation.orderId": "1601010001"
}
```

**Returns:**

- `protations` (Object): 预签信息列表 , 每条数据类型 `protation`

```json
{
    ...
    "protations": [
        {
            "pid": 1,
            "ppid": 1,
            "orderId": "1601010001",
            "name": "预签信息",
            "version": {
                "qvid": 1,
                "no": "QV001",
                "name": "test"
                "comment": "test"
            },
            "creater": {
                "uid": 1,
                "createrId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "quotePrice": 100000,
            "quoteArea": 1000000,
            "preferPrice": 1000,
            "managePrice": 0,
            "advancePrice": 0,
            "unitPrice": 100000,
            "manageFormula": "",
            "managePrice": 0,
            "costPrice": 799000,
            "mostPrice": 20000000,
            "profitRate": 0,
            "costRate": 100,
            "mostRate": 100,
            "basicPrice": 0,
            "comdPrice": 0,
            "commPrice": 0,
            "adddPrice": 0,
            "addmPrice": 0,
            "subcPrice": 0,
            "subdPrice": 0,
            "submPrice": 0,
            "accdPrice": 0,
            "accmPrice": 0,
            "totalPrice": 0,
            "totalCost": 0,
            "totalProfit": 0,
            "status": 0,
            "defaults": 0,
            "comment": "备注"
        }
    ],
    ...
}
```


##### `查询` queryProtationForDefaultByOrderId

通过装修单号获取默认预签信息

**Requests:**

- `protation.orderId` (String): 装修单号

```json
{
    "protation.orderId": "1601010001"
}
```

**Returns:**

- `protation` (Object): 预签信息 , 类型 `protation`

```json
{
    ...
    "protation": {
        "pid": 1,
        "ppid": 1,
        "orderId": "1601010001",
        "name": "预签信息",
        "version": {
            "qvid": 1,
            "no": "QV001",
            "name": "test"
            "comment": "test"
        },
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "quotePrice": 100000,
        "quoteArea": 1000000,
        "preferPrice": 1000,
        "managePrice": 0,
        "advancePrice": 0,
        "unitPrice": 100000,
        "manageFormula": "",
        "managePrice": 0,
        "costPrice": 799000,
        "mostPrice": 20000000,
        "profitRate": 0,
        "costRate": 100,
        "mostRate": 100,
        "basicPrice": 0,
        "comdPrice": 0,
        "commPrice": 0,
        "adddPrice": 0,
        "addmPrice": 0,
        "subcPrice": 0,
        "subdPrice": 0,
        "submPrice": 0,
        "accdPrice": 0,
        "accmPrice": 0,
        "totalPrice": 0,
        "totalCost": 0,
        "totalProfit": 0,
        "status": 0,
        "defaults": 0,
        "comment": "备注"
    }
    ...
}
```


##### `查询` queryProtationByPid

通过预签ID获取预签信息

**Requests:**

- `protation.pid` (Long): 预签ID

```json
{
    "protation.pid": 1
}
```

**Returns:**

- `protation` (Object): 预签信息 , 类型 `protation`

```json
{
    ...
    "protation": {
        "pid": 1,
        "ppid": 1,
        "orderId": "1601010001",
        "name": "预签信息",
        "version": {
            "qvid": 1,
            "no": "QV001",
            "name": "test"
            "comment": "test"
        },
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "quotePrice": 100000,
        "quoteArea": 1000000,
        "preferPrice": 1000,
        "managePrice": 0,
        "advancePrice": 0,
        "unitPrice": 100000,
        "manageFormula": "",
        "managePrice": 0,
        "costPrice": 799000,
        "mostPrice": 20000000,
        "profitRate": 0,
        "costRate": 100,
        "mostRate": 100,
        "basicPrice": 0,
        "comdPrice": 0,
        "commPrice": 0,
        "adddPrice": 0,
        "addmPrice": 0,
        "subcPrice": 0,
        "subdPrice": 0,
        "submPrice": 0,
        "accdPrice": 0,
        "accmPrice": 0,
        "totalPrice": 0,
        "totalCost": 0,
        "totalProfit": 0,
        "status": 0,
        "defaults": 0,
        "comment": "备注"
    }
    ...
}
```


##### `查询` addProtation

创建预签信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

判断预签数量是否已经达到上限 , 错误信息 **200048 预签数量达到上限**

**Requests:**

- `protation.ppid` (String): 预签产品ID
- `protation.orderId` (String): 装修单号
- `protation.name` (String): 名称
- `protation.comment` (String): 备注

```json
{
    "protation.ppid": 1,
    "protation.orderId": "1601010001",
    "protation.name": "预签信息",
    "protation.comment": "备注"
}
```


##### `查询` updateProtation

更新预签信息

判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**

判断预签信息状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID
- `protation.name` (String): 名称
- `protation.version.qvid` (Long): 报价版本ID
- `protation.comment` (String): 备注

```json
{
    "protation.pid": 1,
    "protation.name": "预签信息",
    "protation.version.qvid": 1,
    "protation.comment": "备注"
}
```


##### `查询` updateProtationForAdvance

更新预签信息

判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**

判断预签信息状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID
- `protation.basicPrice` (Long): 基础额
- `protation.profitPrice` (Long): 优惠额
- `protation.manageProfit` (Long): 管理优惠
- `protation.advanceProfit` (Long): 特殊优惠
- `protation.managePrice` (Long): 管理费
- `protation.comdPrice` (Long): 工程额
- `protation.commPrice` (Long): 主材额
- `protation.adddPrice` (Long): 增工额
- `protation.addmPrice` (Long): 增主额
- `protation.subcPrice` (Long): 减通额
- `protation.subdPrice` (Long): 减工额
- `protation.submPrice` (Long): 减主额
- `protation.accdPrice` (Long): 减工额
- `protation.accmPrice` (Long): 减主额
- `protation.totalPrice` (Long): 总额
- `protation.totalCost` (Long): 成本总额
- `protation.totalProfit` (Long): 利润总额

```json
{
    "protation.pid": 1,
    "protation.basicPrice": 0,
    "protation.profitPrice": 0,
    "protation.manageProfit": 0,
    "protation.advanceProfit": 0,
    "protation.managePrice": 0,
    "protation.comdPrice": 0,
    "protation.commPrice": 0,
    "protation.adddPrice": 0,
    "protation.addmPrice": 0,
    "protation.subcPrice": 0,
    "protation.subdPrice": 0,
    "protation.submPrice": 0,
    "protation.accdPrice": 0,
    "protation.accmPrice": 0,
    "protation.totalPrice": 0,
    "protation.totalCost": 0,
    "protation.totalProfit": 0
}
```


##### `查询` updateProtationForStatus

更新预签状态

判断预签报价是否存在 , 不存在 , 错误信息 **200046 预签不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID
- `protation.status` (String): 名称

```json
{
    "protation.pid": 1,
    "protation.status": "预签信息"
}
```


##### `查询` changeProtationForDefault

默认预签 , 其他默认重置

判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID

```json
{
    "protation.pid": 1
}
```


##### `查询` lockProtation

锁定预签报价

判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**

锁定状态的预签报价 , 可以进行打印功能 , 以及部分装修单操作限制 , 但不可以再进行编辑

更新预签报价状态为1(锁定)

**Requests:**

- `protation.pid` (Long): 预签报价ID

```json
{
    "protation.pid": 1
}
```


##### `查询` unlockProtation

解锁预签报价

判断预签报价是否存在 , 不存在 错误信息 **200003 报价不存在**

更新预签报价状态为0(启用)

**Requests:**

- `protation.pid` (Long): 报价ID

```json
{
    "protation.pid": 1
}
```


##### `查询` deleteProtation

删除预签

判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID

```json
{
    "protation.pid": 1
}
```

### 项目


> **类**: `api.quotation.ProtationItemAction`


#### 数据类型: `protationItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `piid` | 预签项ID | Long |
| `pid` | 预签ID | Long |
| `ppiid` | 产品项ID | Long |
| `name` | 名称 | String |
| `basicNum` | 基础量 | Integer |
| `addPrice` | 增补价 | Integer |
| `price` | 价格 | Integer |
| `subPrice` | 退减价 | Integer |
| `cost` | 成本 | Integer |
| `achePrice` | 业绩 | Integer |
| `areaCale` | 面积规则 , 0: 数量 , 1: 面积 | Short |
| `num` | 数量 | Integer |
| `type` | 类型 , 0: 基础 , 1: 工程 , 2: 主材 , 3: 增工 , 4: 增主 , 5: 减工 , 6: 减主 , 7: 赋工 , 8: 赋主 , 11: 减通 | Short |
| `onetype` | 一类 , 0: 标准 , 1: 标配 , 2: 标减 | Short |
| `atttype` | 业务类型 , 0: 通用 , 1: 工程 , 2: 主材 | Short |
| `content` | 说明 | String |


##### `查询` queryProtationItemByPid

通过预签ID获取预签项

**Requests:**

- `protationItem.pid` (Long): 预签ID

```json
{
    "protationItem.pid": 1
}
```

**Returns:**

- `protationItems` (Object): 预签项信息列表 , 每条数据类型 `protationItem`

```json
{
    ...
    "protationItems": [
        {
            "piid": 1,
            "pid": 1,
            "ppiid": 1,
            "name": "预签项",
            "basicNum": 0,
            "addPrice": 1000,
            "price": 100000,
            "subPrice": 1000,
            "cost": 0,
            "achePrice": 0,
            "areaCale": 0,
            "num": 10000,
            "type": 0,
            "onetype": 0,
            "atttype": 1,
            "content": "说明"
        }
    ],
    ...
}
```


##### `查询` updateProtationItem

创建/更新预签项

判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID
- `protation.basicPrice` (String): 基础额
- `protation.comdPrice` (String): 工程额
- `protation.commPrice` (String): 主材额
- `protation.adddPrice` (String): 增工额
- `protation.addmPrice` (String): 增主额
- `protation.subcPrice` (String): 减通额
- `protation.subdPrice` (String): 减工额
- `protation.submPrice` (String): 减主额
- `protation.totalPrice` (String): 总额
- `protationItem.piid` (Long): 预签项ID
- `protationItem.ppiid` (Long): 产品项ID
- `protationItem.name` (String): 名称
- `protationItem.basicNum` (Integer): 基础量
- `protationItem.addPrice` (Integer): 增补价
- `protationItem.price` (Integer): 单价
- `protationItem.subPrice` (Integer): 退减价
- `protationItem.cost` (Integer): 成本
- `protationItem.achePrice` (Integer): 业绩价
- `protationItem.areaCale` (Short): 面积规则
- `protationItem.num` (Integer): 数量
- `protationItem.type` (Short): 类型
- `protationItem.onetype` (Short): 一类
- `protationItem.atttype` (Short): 业务类型

```json
{
    "protation.pid": 1,
    "protation.basicPrice": 0,
    "protation.comdPrice": 0,
    "protation.commPrice": 0,
    "protation.adddPrice": 0,
    "protation.addmPrice": 0,
    "protation.subcPrice": 0,
    "protation.subdPrice": 0,
    "protation.submPrice": 0,
    "protation.totalPrice": 0,

    "protationItem.piid": 1,
    "protationItem.ppiid": 1,
    "protationItem.name": "预签项",
    "protationItem.basicNum": 0,
    "protationItem.addPrice": 1000,
    "protationItem.price": 100000,
    "protationItem.subPrice": 1000,
    "protationItem.cost": 0,
    "protationItem.achePrice": 1000,
    "protationItem.areaCale": 0,
    "protationItem.num": 10000,
    "protationItem.type": 0,
    "protationItem.onetype": 0,
    "protationItem.atttype": 1
}
```


##### `查询` deleteProtationItem

删除预签项

判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**

判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**

**Requests:**

- `protation.pid` (Long): 预签ID
- `protation.basicPrice` (String): 基础额
- `protation.comdPrice` (String): 工程额
- `protation.commPrice` (String): 主材额
- `protation.adddPrice` (String): 增工额
- `protation.addmPrice` (String): 增主额
- `protation.subcPrice` (String): 减通额
- `protation.subdPrice` (String): 减工额
- `protation.submPrice` (String): 减主额
- `protation.totalPrice` (String): 总额
- `protationItem.piid` (Long): 预签项ID

```json
{
    "protation.pid": 1,
    "protation.basicPrice": 0,
    "protation.comdPrice": 0,
    "protation.commPrice": 0,
    "protation.adddPrice": 0,
    "protation.addmPrice": 0,
    "protation.subcPrice": 0,
    "protation.subdPrice": 0,
    "protation.submPrice": 0,
    "protation.totalPrice": 0,

    "protationItem.piid": 1
}
```

### 成本


基础成本 = 计价面积 * 工程成本(报价)

主材成本 = 主材成本(报价) + ∑((计价面积 - 下限面积(成本)|上线面积 - 下限面积(成本)) * 成本单价(成本))

户型成本 = 基础额(报价)

增项成本 = 增工额(报价) * 增项工程成本比例(报价) + 增主额(报价) * 增项主材成本比例(报价)

利润率 = 1 - (基础成本 + 主材成本 + 户型成本 + 增项成本) / (预签额 - 活动物品总额)


> **类**: `api.quotation.ProtationCostAction`


#### 数据类型: `protationCost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pcid` | 成本ID | Long |
| `pid` | 预签ID | Long |
| `toplimit` | 上限面积 | Integer |
| `lowlimit` | 下限面积 | Integer |
| `costPrice` | 成本单价 | Integer |


##### `查询` queryProtationCost

通过预签产品获取成本信息

**Requests:**

- `protationCost.pid` (Long): 预签产品ID

```json
{
    "protationCost.pid": 1
}
```

**Returns:**

- `protationCosts` (List): 预签成本列表 , 类型 `protationCost`

```json
{
    ...
    "protationCosts":[
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

## 报价


### 报价


装修单报价相关信息管理

折前总额 = ∑打折项 + ∑非打折项

折后总额 = ∑打折项 * 折扣 + ∑非打折项

车运费 = (∑打折项 + ∑非打折项) * 车运费比例 * (车运费折扣 * 折扣)

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例

半包工程额 = (∑打折项 + 车运费) * 折扣 + ∑非打折项 + ∑拓展项 + ∑增项 - ∑打折减项 * 折扣 - ∑非打折减项 - ∑拓展减项

套餐工程额 = (∑打折项 + 车运费) * 折扣 + ∑非打折项 + ∑拓展项 + ∑增项 - ∑非增减项 * 0 - ∑增项减项 - ∑拓展减项

半价/满减基础 = ((∑打折项 + ∑非打折项 + 车运费) - (∑打折项 + ∑非打折项 + 车运费) % 基数) * 折扣 + (∑打折项 + ∑非打折项 + 车运费) % 基数

半价/满减工程额 = 半价/满减基础 + ∑拓展项 + ∑增项 - ∑报价减项 * 折扣 - ∑增项减项 - ∑拓展减项

报价额 = 工程额 + 管理费


打折项总额 = ∑打折项 * 折扣

非打折项独立总额 = ∑非打折项 * (非打折独立折扣 * 折扣)
非打折项基数总额 = ∑非打折项 * (非打折基数折扣 * 折扣)

车运费 = (∑打折项 + ∑非打折项) * 车运费比例
独立车运费 = 车运费 * (车运费独立折扣 * 折扣)
基数车运费 = 车运费 * (车运费基数折扣 * 折扣)

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例
独立管理费 = 管理费 * (管理费独立折扣 * 折扣)
基数管理费 = 管理费 * (管理费基数折扣 * 折扣)

管理税金 = (∑打折项 + ∑非打折项 + 车运费) * 税金比例 * 管理费税金折扣

基数总额 = 打折项总额 + 非打折项基数总额 + 基数车运费 + 基数管理费

工程总额 = ((基数总额 - 基数总额 % 基数) * 折扣 + 基数总额 % 基数 + 非打折项独立总额 + 独立车运费 + 独立管理费 + 管理税金) * (1 + 税金比例 * 总额税金折扣)
工程总额 = (基数总额 * 折扣 + (基数总额 % 基数 * (1 - 折扣)) + 非打折项独立总额 + 独立车运费 + 独立管理费 + 管理税金) * (1 + 税金比例 * 总额税金折扣)

基本参数 , ∑打折项 , ∑非打折项 , 基数 , 折扣 , 车运费折扣 , 车运费比例 , 管理费折扣 , 管理费比例 , 税金折扣 , 税金比例

车运费折扣 , 0: 不打折 , 1: 独立折扣 , 2: 基数折扣
管理费折扣 , 0: 不打折 , 1: 独立折扣 , 2: 基数折扣
税金折扣 , 0: 管理费 , 1: 总额


> **类**: `api.quotation.QuotationAction`


#### 数据类型: `quotation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qid` | 报价ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `name` | 报价名称 | String |
| `style` | 风格 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `version` | 报价版本 , 类型 [quotationVersion ](./data.html#api.data.QuotationVersionAction.quotationVersion) | Object |
| `basePrice` | 基数 , 满减类型计算参数 | Long |
| `undisPrice` | 不打折项总额 = ∑(工程量 * 不打折项折前单价) | Long |
| `disPrice` | 打折项总额 = ∑(工程量 * 打折项折前总价) | Long |
| `consPrice` | 工程总额 | Long |
| `comsPrice` | 主材总额 | Long |
| `discount` | 折扣 | Long |
| `trafficPrice` | 车运费 | Long |
| `trafficRate` | 车运费比例 | Integer |
| `trafficDiscount` | 车运费折扣 , 0: 不打折 1: 打折 | Short |
| `managePrice` | 管理费 | Long |
| `manageRate` | 管理费比例 | Integer |
| `manageDiscount` | 管理费折扣 , 0: 不打折 1: 打折 | Short |
| `taxPrice` | 税金 | Long |
| `taxRate` | 税金比例 | Integer |
| `taxDiscount` | 税金折扣 | Short |
| `unachePrice` | 非业绩总额 | Long |
| `costPrice` | 成本总额 | Long |
| `totalPrice` | 报价总额 | Long |
| `worktime` | 制作计时 | Integer |
| `auditime` | 审核计时 | Integer |
| `status` | 状态 , 0: 初始 , 1: 锁定 | Short |
| `defaults` | 默认标识 , 0: 非默认 , 1: 默认 | Short |
| `attstatus` | 业务状态 , 0: 初始 , 1: 制作 , 2: 审批 , 3: 完成 | Short |
| `content` | 说明 | String |


##### `查询` pageQuotation

分页方式获报价信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 报价单信息列表 , 每条数据类型 `quotation`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "qid": 1,
                "orderId": "1601010001",
                "decoration": {
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
                },
                "name": "现代",
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "updateTime": "2016-01-01",
                "style": "现代简约",
                "discount": 9,
                "houseArea": null,
                "notSalesmanRate": 0,
                "basePrice": 0,
                "undisPrice": 90154,
                "disPrice": 90154,
                "trafficPrice": 7800,
                "trafficRate": 200,
                "trafficDiscount": 0,
                "managePrice": 11154,
                "manageRate": 100,
                "manageDiscount": 0,
                "taxPrice": 0,
                "taxRate": 0,
                "taxDiscount": 0,
                "unachePrice": 0,
                "costPrice": 0,
                "totalPrice": 90154,
                "worktime": 0,
                "auditime": 0,
                "status": 0,
                "attstatus": 0,
                "content": ""
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryQuotationByOrderId

通过装修单号查询报价信息

**Requests:**

- `quotation.orderId` (String): 装修单号

```json
{
    "quotation.orderId": "1601010001"
}
```

**Returns:**

- `quotations` (List): 报价信息列表 , 类型 `quotation`

```json
{
    ...
    "quotations":[
        {
            "qid": 1,
            "orderId": "1601010001",
            "name": "现代",
            "creater": {
                "uid": 1,
                "createrId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "updateTime": "2016-01-01",
            "style": "现代简约",
            "discount": 9,
            "houseArea": null,
            "notSalesmanRate": 0,
            "basePrice": 0,
            "undisPrice": 90154,
            "disPrice": 90154,
            "trafficPrice": 7800,
            "trafficRate": 200,
            "trafficDiscount": 0,
            "managePrice": 11154,
            "manageRate": 100,
            "manageDiscount": 0,
            "taxPrice": 0,
            "taxRate": 0,
            "taxDiscount": 0,
            "unachePrice": 0,
            "costPrice": 0,
            "totalPrice": 90154,
            "worktime": 0,
            "auditime": 0,
            "status": 0,
            "attstatus": 0,
            "content": ""
        }
    ],
    ...
}
```


##### `查询` queryQuotationForDefaultByOrderId

通过装修单号获取默认报价信息

**Requests:**

- `quotation.orderId` (String): 装修单号
- `quotation.type` (Short): 类型

```json
{
    "quotation.orderId": "1601010001",
    "quotation.type": 0
}
```

**Returns:**

- `quotation` (Object): 报价信息 , 类型 `quotation`

```json
{
    ...
    "quotation": {
        "qid": 1,
        "orderId": "1601010001",
        "name": "现代",
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "updateTime": "2016-01-01",
        "style": "现代简约",
        "discount": 9,
        "houseArea": null,
        "notSalesmanRate": 0,
        "basePrice": 0,
        "undisPrice": 90154,
        "disPrice": 90154,
        "trafficPrice": 7800,
        "trafficRate": 200,
        "trafficDiscount": 0,
        "managePrice": 11154,
        "manageRate": 100,
        "manageDiscount": 0,
        "taxPrice": 0,
        "taxRate": 0,
        "taxDiscount": 0,
        "unachePrice": 0,
        "costPrice": 0,
        "totalPrice": 90154,
        "worktime": 0,
        "auditime": 0,
        "status": 0,
        "attstatus": 0,
        "content": ""
    }
    ...
}
```


##### `查询` queryQuotationById

通过报价ID获取报价信息

**Requests:**

- `quotation.qid` (String): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `quotation` (Object): 报价信息 , 类型 `quotation`

```json
{
    ...
    "quotation": {
        "qid": 1,
        "orderId": "1601010001",
        "name": "现代",
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "updateTime": "2016-01-01",
        "style": "现代简约",
        "discount": 9,
        "houseArea": null,
        "basePrice": 0,
        "notSalesmanRate": 0,
        "undisPrice": 90154,
        "disPrice": 90154,
        "trafficPrice": 7800,
        "trafficRate": 200,
        "trafficDiscount": 0,
        "managePrice": 11154,
        "manageRate": 100,
        "manageDiscount": 0,
        "taxPrice": 0,
        "taxRate": 0,
        "taxDiscount": 0,
        "unachePrice": 0,
        "costPrice": 0,
        "totalPrice": 90154,
        "worktime": 0,
        "auditime": 0,
        "status": 0,
        "attstatus": 0,
        "content": ""
    }
    ...
}
```


##### `查询` queryQuotationForConfig

获取报价相关配置信息

**Returns:**

- `configs` (Map): 报价信息 , 类型 Map <String, List<Sting>>

```json
{
    ...
    "configs": {
        "trafficRates": [
            "0.015",
            "0.02"
        ],
        "manageRates": [
            "10035",
            "10065"
        ]
    }
    ...
}
```


##### `查询` addQuotation

添加报价信息

**Requests:**

- `quotation.orderId` (String): 装修单号
- `quotation.name` (String): 报价名
- `quotation.style` (String): 风格
- `quotation.content` (String): 说明

```json
{
    "quotation.orderId": "1601010001",
    "quotation.name": "测试",
    "quotation.style": "现代",
    "quotation.content": ""
}
```


##### `查询` updateQuotation

更新报价基础信息

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.orderId` (String): 装修单号
- `quotation.name` (String): 报价名
- `quotation.style` (String): 风格
- `quotation.content` (String): 说明

```json
{
    "quotation.qid": 1,
    "quotation.orderId": "1601010001",
    "quotation.name": "测试",
    "quotation.style": "现代",
    "quotation.content": ""
}
```


##### `查询` updateQuotationForPrice

更新报价价格信息

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```


##### `查询` updateQuotationForAdvance

更新报价高级信息 , 同时按照报价的类型分别更新对应的信息

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000
}
```


##### `查询` updateQuotationForStatus

更新报价状态

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.status` (Short): 状态
- `quotation.attstatus` (Short): 状态

```json
{
    "quotation.qid": 1,
    "quotation.status": 1,
    "quotation.attstatus": 1
}
```


##### `查询` updateQuotationForTime

更新报价状态

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.worktime` (Integer): 制作及时
- `quotation.auditime` (Integer): 审核计时

```json
{
    "quotation.qid": 1,
    "quotation.worktime": 1,
    "quotation.auditime": 1
}
```


##### `查询` deleteQuotationById

通过报价ID删除报价信息 , 默认报价不能删除

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1,
}
```


##### `查询` replicaQuotation

装修单间拷贝报价 , 其中折扣不进行复制

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**

判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**

**Requests:**

- `quotation.qid` (Long): 拷贝报价ID
- `quotation.orderId` (String): 目的装修单号

```json
{
    "quotation.qid": 1,
    "quotation.orderId": "1601010002"
}
```


##### `查询` copyQuotation

装修单内拷贝报价 , 折扣与原报价相同

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**

判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**

**Requests:**

- `quotation.qid` (Long): 拷贝报价ID
- `quotation.orderId` (String): 目的装修单号

```json
{
    "quotation.qid": 1,
    "quotation.orderId": "1601010002"
}
```


##### `查询` cloneQuotation

克隆报价 , 将报价(quotetion)拷贝到报价(quotation)

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**

判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**

判断拷贝报价与装修单报价版本是否一致 , 错误信息 **200002 复制报价与当前报价版本不同,不能拷贝**

**Requests:**

- `quotation.no` (String): 报价编号

```json
{
    "quotation.no": 1
}
```


##### `查询` changeQuotationForDefault

更换默认报价 , 装修单内有且只有一份默认报价

**Requests:**

- `quotation.qid` (Long): 拷贝报价ID
- `quotation.orderId` (String): 目的装修单号

```json
{
    "quotation.qid": 1,
    "quotation.orderId": "1601010002"
}
```


##### `查询` lockQuotation

锁定报价

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

锁定状态的报价 , 可以进行打印功能 , 以及部分装修单操作限制 , 但不可以在进行编辑

更新报价状态为1(锁定)

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```


##### `查询` unlockQuotation

解锁报价

判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**

更新报价状态为0(初始)

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

### 报价-功能区


报价中功能区信息管理


> **类**: `api.quotation.QuotationFunctionAreaAction`


#### 数据类型: `quotationFunctionArea`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfaid` | 功能区ID | Long |
| `quotationId` | 报价ID | Long |
| `functionAreaName` | 功能区名 | String |
| `functionAreaOrder` | 功能区排序 | Integer |
| `functionAreaType` | 功能区类型 , 保留字段 | String |
| `type` | 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算) , 4(成本) , 5(非业绩) | Short |
| `total` | 总额 , 类型为 | Long |
| `quotationFunctionAreaItems` | 功能区包含报价项信息列表 , 每条数据类型 [quotationFunctionAreaItem ](./quotation.html#api.quotation.QuotationFunctionAreaItemAction.quotationFunctionAreaItem) | List |


##### `查询` queryQuotationFunctionAreaForCommonByQuotationId

通过报价ID查询功能区信息 , 不包含功能区中报价项信息

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `quotationFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotationFunctionArea`

```json
{
    ...
    "quotationFunctionAreas": [
        {
            "qfaid": 1,
            "quotationId": 1,
            "functionAreaName": "门厅",
            "functionAreaOrder": 1,
            "functionAreaType": "标准",
            "type": 1,
            "total": 0,
            "quotationFunctionAreaItems": null,
        }
    ],
    ...
}
```


##### `查询` queryQuotationFunctionAreaByQuotationId

通过报价ID查询功能区信息 , 包含功能区中报价项信息

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1,
}
```

**Returns:**

- `quotationFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotationFunctionArea`

```json
{
    ...
    "quotationFunctionAreas": [
        {
            "qfaid": 1,
            "quotationId": 1,
            "functionAreaName": "门厅",
            "functionAreaOrder": 1,
            "functionAreaType": "0",
            "type": 1,
            "total": 0,
            "quotationFunctionAreaItems": [
                {
                    "content": "",
                    "discount": 0,
                    "itemName": "报价项",
                    "measurementUnit": "",
                    "num": 1,
                    "qfaiId": 1,
                    "quotationFunctionAreaId": 1,
                    "quotationItemId": null,
                    "type": 2,
                    "unitPrice": 100,
                    "workType": "木工"
                }
            ]
        }
    ],
    ...
}
```


##### `查询` addQuotationFunctionArea

报价中添加功能区

根据装修单对应的默认报价完成功能区添加

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断装修单默认报价是否存在 , 不存在 错误信息 **200017 默认报价不存在**

- `quotation.orderId` (String): 装修单号

```json
{
    "quotation.orderId": "1601010001"
    "functionAreaIds[0]": 1
}
```


##### `查询` addQuotationFunctionAreaByFunctionAreaIds

报价中添加功能区信息

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionAreas[0].id": 1,
    "quotationFunctionAreas[0].quotationFunctionAreaParam.girth": 1,
    "quotationFunctionAreas[1].id": 2,
    "quotationFunctionAreas[0].quotationFunctionAreaParam.area": 1,
}
```

**Returns:**

- `quotationFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotationFunctionArea`

```json
{
    ...
    "quotationFunctionAreas": [
        {
            "qfaid": 1,
            "quotationId": 1,
            "functionAreaName": "门厅",
            "functionAreaOrder": 1,
            "functionAreaType": "0",
            "type": 1,
            "total": 0,
            "quotationFunctionAreaItems": [
                {
                    "qfaiId": 1,
                    "itemName": "整体墙棚面砂纸打磨处理",
                    "index": 1,
                    "formula": "1+1",
                    "initnum": 5,
                    "num": 5,
                    "type": 0,
                    "subtype": 0,
                    "unitPrice": 2,
                    "workType": "油",
                    "measurementUnit": "平方米",
                    "discount": 1,
                    "quotationFunctionAreaId": null,
                    "quotationItemId": null,
                    "content": "",
                }
            ]
        }
    ],
    ...
}
```


##### `查询` updateQuotationFunctionArea

更新功能区信息

判断功能区是否存在 , 不存在 , 错误信息 **200010 功能区不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 200030 报价状态不可操作

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额
- `quotationFunctionArea.qfaid` (Long): 功能区ID
- `quotationFunctionArea.functionAreaName` (String): 功能区名称
- `quotationFunctionArea.functionAreaOrder` (Integer): 功能区排序

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionArea.qfaid": 2,
    "quotationFunctionArea.functionAreaName": "门厅",
    "quotationFunctionArea.functionAreaOrder": 2,
}
```


##### `查询` deleteQuotationFunctionArea

删除功能区信息 , 功能区中包含的报价项信息一同删除

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 200030 报价状态不可操作

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额
- `quotationFunctionArea.qfaid` (Long): 功能区ID

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionArea.qfaid": 2
}
```

### 功能区-报价项


功能区中报价项信息管理


> **类**: `api.quotation.QuotationFunctionAreaItemAction`


#### 数据类型: `quotationFunctionAreaItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfaiId` | 报价项ID | Long |
| `itemName` | 报价项名 | String |
| `unitPrice` | 单价 | Integer |
| `index` | 索引 | Integer |
| `formula` | 公式 | String |
| `initnum` | 初始工程量 | Integer |
| `num` | 工程量 | Integer |
| `type` | 类型 , 0: 标准 , 1: 自定义 , 2: 车运 , 3: 管理 , 4: 不计, 5: 成本 , 6: 非业绩 | Short |
| `subtype` | 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装 | Short |
| `measurementUnit` | 单位 | String |
| `workType` | 工种 | String |
| `discount` | 折扣标识 , 0: 不打折 , 1: 打折 | Short |
| `quotationFunctionAreaId` | 所属功能区ID | Long |
| `quotationItemId` | 引用报价项ID | Long |
| `content` | 说明 | String |


##### `查询` queryQuotationFunctionAreaItemByQuotationFunctionAreaId

通过归属功能区ID查询报价项信息

**Requests:**

- `quotationFunctionArea.quotationFunctionAreaId` (Long): 功能区ID

```json
{
    "quotationFunctionArea.quotationFunctionAreaId": 1
}
```

**Returns:**

- `quotationFunctionAreaItems` (List): 报价项信息列表 , 每条数据类型 `quotationFunctionAreaItem`

```json
{
    ...
    "quotationFunctionAreaItems": [
        {
            "qfaiId": 1,
            "itemName": "整体墙棚面砂纸打磨处理",
            "index": 1,
            "formula": "1+1",
            "initnum": 5,
            "num": 5,
            "type": 0,
            "subtype": 0,
            "unitPrice": 2,
            "workType": "油",
            "measurementUnit": "平方米",
            "discount": 1,
            "quotationFunctionAreaId": null,
            "quotationItemId": null,
            "content": "",
        }
    ],
    ...
}
```


##### `查询` updateQuotationFunctionAreaItem

更新报价项信息 , 若无信息则为创建报价项信息 , 标准报价项 , 需要引用报价项ID信息 , 其他信息直接赋值 ; 自定义报价项 , 引用报价项ID为NULL , 其他信息直接赋值

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额
- `quotationFunctionAreaItem.qfaiId` (Long): 报价项ID
- `quotationFunctionAreaItem.itemName` (String): 报价项名
- `quotationFunctionAreaItem.unitPrice` (Integer): 单价
- `quotationFunctionAreaItem.index` (Integer): 索引
- `quotationFunctionAreaItem.formula` (String): 公式
- `quotationFunctionAreaItem.initnum` (Integer): 初始工程量
- `quotationFunctionAreaItem.num` (Integer): 工程量
- `quotationFunctionAreaItem.type` (Short): 类型 , 0: 标准报价项 , 1: 自定义报价项
- `quotationFunctionAreaItem.subtype` (Short): 子类
- `quotationFunctionAreaItem.measurementUnit` (String): 单位
- `quotationFunctionAreaItem.workType` (String): 工种
- `quotationFunctionAreaItem.discount` (Short): 折扣标识 , 0: 不打折 , 1: 打折
- `quotationFunctionAreaItem.quotationFunctionAreaId` (Long): 所属功能区ID
- `quotationFunctionAreaItem.quotationItemId` (Long): 引用报价项ID
- `quotationFunctionAreaItem.content` (String): 说明

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionAreaItem.itemName": "整体墙棚面砂纸打磨处理",
    "quotationFunctionAreaItem.index": 1,
    "quotationFunctionAreaItem.formula": "1+1",
    "quotationFunctionAreaItem.initnum": 5,
    "quotationFunctionAreaItem.num": 5,
    "quotationFunctionAreaItem.type": 0,
    "quotationFunctionAreaItem.subtype": 0,
    "quotationFunctionAreaItem.unitPrice": 2,
    "quotationFunctionAreaItem.workType": "油",
    "quotationFunctionAreaItem.measurementUnit": "平方米",
    "quotationFunctionAreaItem.discount": 1,
    "quotationFunctionAreaItem.quotationFunctionAreaId": 1,
    "quotationFunctionAreaItem.quotationItemId": null,
    "quotationFunctionAreaItem.content": ""
}
```

**Returns:**

- `quotationFunctionAreaItem` (Object): 报价项信息 , 类型 `quotationFunctionAreaItem`

```json
{
    ...
    "quotationFunctionAreaItem": {
        "qfaiId": 1,
        "itemName": "整体墙棚面砂纸打磨处理",
        "index": 1,
        "formula": "1+1",
        "initnum": 5,
        "num": 5,
        "type": 0,
        "subtype": 0,
        "unitPrice": 2,
        "workType": "油",
        "measurementUnit": "平方米",
        "discount": 1,
        "quotationFunctionAreaId": null,
        "quotationItemId": null,
        "content": null,
    },
    ...
}
```


##### `查询` updateQuotationFunctionAreaItemForSpec

更新特殊报价项单价信息 , 直接更新报价项单价

利用功能区定位报价项归属表

判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotationFunctionAreaItem.qfaiId` (Long): 报价项ID
- `quotationFunctionAreaItem.quotationFunctionAreaId` (Long): 功能区ID
- `quotationFunctionAreaItem.unitPrice` (Integer): 单价

```json
{
    "quotationFunctionAreaItem.qfaiId": 1,
    "quotationFunctionAreaItem.quotationFunctionAreaId": 1,
    "quotationFunctionAreaItem.unitPrice": 200
}
```


##### `查询` updateQuotationFunctionAreaItemForIndex

更新报价项排序索引

更新过程只能够在同一个功能区中的两个索引之间完成

利用功能区定位报价项归属表

报价项获取失败或无报价项 , 不进行更新动作

判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**

**Requests:**

- `quotationFunctionArea.qfaid` (Long): 功能区ID

```json
{
    "quotationFunctionArea.qfaid": 1,
    "quotationFunctionAreaItems[0].qfaiId": 1,
    "quotationFunctionAreaItems[0].index": 1,
    "quotationFunctionAreaItems[1].qfaiId": 2,
    "quotationFunctionAreaItems[1].index": 2
}
```


##### `查询` updateQuotationFunctionAreaItemByQuotationIdAType

通过报价ID以及报价项类型更新报价项单价信息 , 只能适用类型为2:车运费和3:管理费的项目

判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额
- `quotationFunctionAreaItem.type` (Short): 报价项类型
- `quotationFunctionAreaItem.unitPrice` (Integer): 单价

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionAreaItem.type": 3,
    "quotationFunctionAreaItem.unitPrice": 200
}
```


##### `查询` deleteQuotationFunctionAreaItem

删除报价项信息

利用功能区定位报价项归属表

判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**

**Requests:**

- `quotation.qid` (Long): 报价ID
- `quotation.basePrice` (Long): 基数
- `quotation.undisPrice` (Long): 不打折项总额
- `quotation.disPrice` (Long): 打折项总额
- `quotation.discount` (Long): 折扣
- `quotation.trafficPrice` (Long): 车运费
- `quotation.trafficRate` (Integer): 车运费比例
- `quotation.trafficDiscount` (Short): 车运费折扣
- `quotation.managePrice` (Long): 管理费
- `quotation.manageRate` (Integer): 管理费比例
- `quotation.manageDiscount` (Short): 管理费折扣
- `quotation.taxPrice` (Long): 税金
- `quotation.taxRate` (Integer): 税金比例
- `quotation.taxDiscount` (Short): 税金折扣
- `quotation.unachePrice` (Long): 非业绩总额
- `quotation.costPrice` (Long): 成本总额
- `quotation.totalPrice` (Long): 报价总额
- `quotationFunctionArea.qfaid` (Long): 功能区ID
- `qfaiIds` (List): 报价项ID列表 , 每条数据类型 Long

```json
{
    "quotation.qid": 1,
    "quotation.basePrice": 0,
    "quotation.undisPrice": 10000,
    "quotation.disPrice": 10000,
    "quotation.discount": 900,
    "quotation.trafficPrice": 0,
    "quotation.trafficRate": 200,
    "quotation.trafficDiscount": 0,
    "quotation.managePrice": 0,
    "quotation.manageRate": 10035,
    "quotation.manageDiscount": 0,
    "quotation.taxPrice": 0,
    "quotation.taxRate": 10035,
    "quotation.taxDiscount": 0,
    "quotation.unachePrice": 0,
    "quotation.costPrice": 0,
    "quotation.totalPrice": 10000,

    "quotationFunctionArea.qfaid": 1,
    "qfaiIds[0]": 1,
    "qfaiIds[1]": 2
}
```

### 优惠


> **类**: `api.quotation.QuotationPerferAction`


#### 数据类型: `quotationPerfer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qpid` | 优惠ID | Long |
| `orderId` | 装修单号 | String |
| `qid` | 报价单ID | Long |
| `perferPrice` | 通用优惠 | Long |
| `managePerfer` | 管理优惠 | Long |
| `advancePerfer` | 特批优惠 | Long |


##### `查询` queryQuotationPerfer

通过报价ID获取优惠信息

**Requests:**

- `quotationPerfer.qid` (Long): 报价单ID

```json
{
    "quotationPerfer.qid": 1
}
```

**Returns:**

- `quotationPerfer` (Object): 报价优惠信息 , 每条数据类型 `quotationPerfer`

```json
{
    ...
    "quotationPerfer": {
        "qpid": 1,
        "orderId": "1601010001",
        "qid": 1,
        "perferPrice": 1000,
        "managePerfer": 1000,
        "advancePerfer": 1000
    }
    ...
}
```


##### `查询` updateQuotationPerfer

更新报价优惠信息

**Requests:**

- `quotationPerfer.qid` (Long): 报价单ID
- `quotationPerfer.perferPrice` (Long): 通用优惠
- `quotationPerfer.managePerfer` (Long): 管理优惠
- `quotationPerfer.advancePerfer` (Long): 特批优惠

```json
{
    "quotationPerfer.orderId": "1601010001",
    "quotationPerfer.perferPrice": 0,
    "quotationPerfer.managePerfer": 0,
    "quotationPerfer.advancePerfer": 0
}
```

## 扩展


装修单报价过程扩展项目处理过程 , 主要使用在订单类型为整装的处理过程

### 扩展


> **类**: `api.quotation.ExtensionAction`


#### 数据类型: `extension`

| 参数 | 说明 | 类型 |
|------|------|------|
| `eid` | 拓展项ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `type` | 类型 , 0: 增项 , 1: 减项 | Short |
| `atttype` | 业务类型 , 0: 通用, 1: 置换 | Short |
| `undisPrice` | 非打折项总额 | Long |
| `disPrice` | 打折项总额 | Long |
| `consPrice` | 工程总额 | Long |
| `comsPrice` | 主材总额 | Long |
| `manageRate` | 管理费比例 | Long |
| `manageDiscount` | 管理费折扣 , 0: 不打折 , 1: 打折 | Short |
| `managePrice` | 管理费 | Long |
| `total` | 总价 | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `content` | 说明 | String |


##### `查询` pageExtension

分页方式获取拓展单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 拓展单信息列表 , 每条数据类型 `extension`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "eid": 1,
                "decoration": {
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
                },
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "type": 0,
                "atttype": 0,
                "undisPrice": 1000.00,
                "disPrice": 1000.00,
                "consPrice": 0,
                "comsPrice": 0,
                "manageDiscount": 0,
                "manageRate": 0,
                "managePrice": 0,
                "total": 4.53,
                "status": 1,
                "content": "主材拓展项"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageExtensionByOrderId

分页方式获取拓展项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `extension.orderId` (String): 装修单号

```json
{
    "extension.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 拓展项信息列表 , 每条数据类型 `extension`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "eid": 1,
                "orderId": "1601010001",
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "type": 0,
                "atttype": 0,
                "undisPrice": 1000.00,
                "disPrice": 1000.00,
                "consPrice": 0,
                "comsPrice": 0,
                "manageDiscount": 0,
                "manageRate": 0,
                "managePrice": 0,
                "total": 4.53,
                "status": 1,
                "content": "拓展项"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryExtensionByEid

通过拓展项ID获取拓展项信息

**Requests:**

- `extension.eid` (Long): 拓展单ID

```json
{
    "extension.eid": 1
}
```

**Returns:**

- `extensions` (List): 拓展项信息列表 , 每条数据类型 `extension`

```json
{
    ...
    "extensions": [
        {
            "eid": 1,
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "createrId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "type": 0,
            "atttype": 0,
            "undisPrice": 1000.00,
            "disPrice": 1000.00,
            "consPrice": 0,
            "comsPrice": 0,
            "manageDiscount": 0,
            "manageRate": 0,
            "managePrice": 0,
            "total": 4.53,
            "status": 1,
            "content": "拓展项"
        }
    ],
    ...
}
```


##### `查询` queryExtensionByOrderId

通过装修单号获取拓展项信息

**Requests:**

- `extension.orderId` (String): 装修单号

```json
{
    "extension.orderId": "1601010001"
}
```

**Returns:**

- `extensions` (List): 拓展项信息列表 , 每条数据类型 `extension`

```json
{
    ...
    "extensions": [
        {
            "eid": 1,
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "createrId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "type": 0,
            "atttype": 0,
            "undisPrice": 1000.00,
            "disPrice": 1000.00,
            "consPrice": 0,
            "comsPrice": 0,
            "manageDiscount": 0,
            "manageRate": 0,
            "managePrice": 0,
            "total": 4.53,
            "status": 1,
            "content": "拓展项"
        }
    ],
    ...
}
```


##### `查询` addExtension

添加拓展项信息

判断添加拓展项归属装修单状态 , 已签约 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

**Requests:**

- `extension.orderId` (String): 装修单号
- `extension.type` (Short): 类型 , 0: 增项 , 1: 减项
- `extension.atttype` (Short): 业务类型
- `extension.content` (String): 说明

```json
{
    "extension.orderId": "1601010001",
    "extension.type": 0,
    "extension.atttype": 0,
    "extension.content": ""
}
```


##### `查询` updateExtension

更新扩展信息

判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**

判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

**Requests:**

- `extension.eid` (Long): 拓展单ID
- `extension.content` (String): 说明

```json
{
    "extension.eid": 1,
    "extension.content": ""
}
```


##### `查询` updateExtensionForAdvance

更新拓展项高级信息

判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**

判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

**Requests:**

- `extension.eid` (Long): 拓展单ID
- `extension.undisPrice` (Long): 非打折项总额
- `extension.disPrice` (Long): 打折项总额
- `extension.consPrice` (Long): 工程总额
- `extension.comsPrice` (Long): 主材总额
- `extension.manageDiscount` (Short): 管理费折扣
- `extension.manageRate` (Integer): 管理费比例
- `extension.managePrice` (Integer): 管理费
- `extension.total` (Long): 总价

```json
{
    "extension.eid": 1,
    "extension.undisPrice": 100,
    "extension.disPrice": 100,
    "extension.consPrice": 100,
    "extension.comsPrice": 100,
    "extension.manageDiscount": 0,
    "extension.manageRate": 0,
    "extension.managePrice": 0,
    "extension.total": 100
}
```


##### `查询` deleteExtension

删除拓展项信息

判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

**Requests:**

- `extension.eid` (Long): 拓展单ID

```json
{
    "extension.eid": 1
}
```

### 项目


> **类**: `api.quotation.ExtensionItemAction`


#### 数据类型: `extensionItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `eiid` | ID | Long |
| `eid` | 拓展项ID | Long |
| `itemName` | 名称 | String |
| `type` | 类型 , 0: 数据报价项(增项) , 1: 自定义(增项) , 2: 数据报价项(减项) , 3: 自定义(减项) , 4: 报价中项(减项), 5: 报价中项(增项) | Short |
| `subtype` | 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装 | Short |
| `measurementUnit` | 单位 | String |
| `workType` | 工种 | String |
| `discount` | 打折标识 , 0: 不打折, 1: 打折 | Short |
| `addPrice` | 增补价 | Integer |
| `unitPrice` | 单价 | Integer |
| `subPrice` | 退减价 | Integer |
| `initnum` | 初始量 | Integer |
| `num` | 工程量 | Integer |
| `quotationFunctionAreaId` | 所属功能区ID | Long |
| `quotationFunctionAreaName` | 所属功能区 | String |
| `quoteItemId` | 引用项ID | Long |
| `qiid` | 报价项ID (数据) | Long |
| `content` | 说明 | String |


##### `查询` queryExtensionItemByEid

通过拓展项ID获取包含的报价项信息

**Requests:**

- `extension.eid` (Long): 拓展项ID

```json
{
    "extension.eid": 1
}
```

**Returns:**

- `extensionItems` (List): 拓展项中报价项信息列表 , 类型 `extensionItem`

```json
{
    ...
    "extensionItems": [
        {
            "eiid": 1,
            "eid": 1,
            "content": "说明信息",
            "itemName": "原墙体建筑大白铲除",
            "measurementUnit": "米",
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quoteItemId": 3,
            "qiid": 0,
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "workType": "油"
        }
    ]
    ...
}
```


##### `查询` queryExtensionItemByOrderId

通过装修单号获取扩展项信息

**Requests:**

- `extension.orderId` (String): 装修单号

```json
{
    "extension.orderId": "1601010001"
}
```

**Returns:**

- `extensionItems` (List): 拓展项中报价项信息列表 , 类型 `extensionItem`

```json
{
    ...
    "extensionItems": [
        {
            "eiid": 1,
            "eid": 1,
            "content": "说明信息",
            "itemName": "原墙体建筑大白铲除",
            "measurementUnit": "米",
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quoteItemId": 3,
            "qiid": 0,
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "workType": "油"
        }
    ]
    ...
}
```


##### `查询` queryExtensionItemByEids

通过拓展项ID列表获取包含的报价项信息

**Requests:**


```json
{
    "extensionIds[0]": 1,
    "extensionIds[1]": 2
}
```

**Returns:**

- `extensionItems` (List): 拓展项中报价项信息列表 , 类型 `extensionItem`

```json
{
    ...
    "extensionItems": [
        {
            "eiid": 1,
            "eid": 1,
            "content": "说明信息",
            "itemName": "原墙体建筑大白铲除",
            "measurementUnit": "米",
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quoteItemId": 3,
            "qiid": 0,
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "workType": "油"
        }
    ]
    ...
}
```


##### `查询` updateExtensionItem

更新拓展项中报价项信息 , 如果无对应信息 , 创建新信息

判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

拓展项 , 增项类型 , 单价使用引用报价项的增补价 ; 减项类型 , 单价使用引用报价项的退减价

**Requests:**

- `extension.eid` (Long): 拓展项ID
- `extension.undisPrice` (Long): 非打折项总额
- `extension.disPrice` (Long): 打折项总额
- `extension.consPrice` (Long): 工程总额
- `extension.comsPrice` (Long): 主材总额
- `extension.manageDiscount` (Short): 管理费折扣
- `extension.manageRate` (Integer): 管理费比例
- `extension.managePrice` (Integer): 管理费
- `extension.total` (Long): 总价
- `extensionItem.eiid` (Long): 拓展项目ID
- `extensionItem.eid` (Long): 增减项ID
- `extensionItem.measurementUnit` (String): 单位
- `extensionItem.workType` (String): 工种
- `extensionItem.discount` (Short): 打折标识
- `extensionItem.addPrice` (Integer): 增补价
- `extensionItem.unitPrice` (Integer): 单价
- `extensionItem.subPrice` (Integer): 退减价
- `extensionItem.num` (Integer): 工程量
- `extensionItem.quotationFunctionAreaId` (Long): 所属功能区ID
- `extensionItem.quoteItemId` (Long): 引用项ID
- `extensionItem.content` (String): 说明

```json
{
    "extension.eid": 1,
    "extension.undisPrice": 10000,
    "extension.disPrice": 1000,
    "extension.consPrice": 1000,
    "extension.comsPrice": 1000,
    "extension.manageDiscount": 0,
    "extension.manageRate": 0,
    "extension.managePrice": 0,
    "extension.total": 100,

    "extensionItem.eiid": 1,
    "extensionItem.itemName": "原墙体建筑大白铲除",
    "extensionItem.measurementUnit": "米",
    "extensionItem.num": 1,
    "extensionItem.quotationFunctionAreaId": 2,
    "extensionItem.quoteItemId": 3,
    "extensionItem.discount": 0,
    "extensionItem.addPrice": 10,
    "extensionItem.unitPrice": 10,
    "extensionItem.subPrice": 10,
    "extensionItem.workType": "油",
    "extensionItem.content": "信息"
}
```


##### `查询` deleteExtensionItem

删除增减项中报价项信息

判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

**Requests:**

- `extension.eid` (Long): 增减项ID
- `extension.undisPrice` (Long): 非打折项总额
- `extension.disPrice` (Long): 打折项总额
- `extension.consPrice` (Long): 工程总额
- `extension.comsPrice` (Long): 主材总额
- `extension.manageDiscount` (Short): 管理费折扣
- `extension.manageRate` (Integer): 管理费比例
- `extension.managePrice` (Integer): 管理费
- `extension.total` (Long): 总价
- `extensionItem.eiid` (Long): 拓展项目ID

```json
{
    "extension.eid": 1,
    "extension.undisPrice": 100,
    "extension.disPrice": 100,
    "extension.consPrice": 100,
    "extension.comsPrice": 100,
    "extension.manageDiscount": 100,
    "extension.manageRate": 100,
    "extension.managePrice": 100,
    "extension.total": 100,

    "extensionItem.eiid": 1
}
```

## 增减


装修单增减项信息管理

增减项中的报价项 , 类型为2(自定义项)需要说明信息 , 其他类型说明信息以及打折依据引用项进行获取

增项类型为0(标准报价项) , 2(自定义项) , 减项类型为1(系统定义项) , 3(报价中报价项) , 4(增项中报价项)

### 增减


> **类**: `api.quotation.AddReduceAction`


#### 数据类型: `addReduce`

| 参数 | 说明 | 类型 |
|------|------|------|
| `arid` | 增减单ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `dpid` | 装修款ID | Long |
| `type` | 类型 , 0: 增项 , 1: 减项 | Short |
| `atttype` | 业务类型 , 0: 工程 , 1: 主材 | Short |
| `paytype` | 付款类型 , 0: 付款 , 1: 下拨(增项) , 2: 特批(增项) , 3: 不退(减项) | Short |
| `discount` | 折扣 | Integer |
| `manageRate` | 管理费比例 | Long |
| `manageDiscount` | 管理费折扣 , 0: 不打折 , 1: 打折 | Short |
| `managePrice` | 管理费 | Long |
| `taxRate` | 税金比例 | Long |
| `taxDiscount` | 税金折扣 , 0: 无税金 , 1: 管理税金 , 2: 总额税金 | Short |
| `taxPrice` | 税金 | Long |
| `undisPrice` | 不打折项总额 = ∑(工程量 * 不打折项折前单价) | Long |
| `disPrice` | 打折项总额 = ∑(工程量 * 打折项折前总价) | Long |
| `calPrice` | 计算总额 | Long |
| `uncalPrice` | 非计算总额 | Long |
| `consPrice` | 工程总额 | Long |
| `comsPrice` | 主材总额 | Long |
| `total` | 总价 | Long |
| `schedule` | 进度 , 对应装修单状态 | Short |
| `constructionNode` | 施工节点 , 包括: 0(初始) , 1(开工) , 2(完工) , 其他状态关联 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Long |
| `status` | 状态 , 0: 初始 , 1: 提交 , 2: 已付款 , 3: 已确认 | Short |
| `isAffirm` | 是否确认 , 0: 未确认 , 1: 客户确认 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `unpayTime` | 下拨时间 | Timestamp |
| `confirmTime` | 确认时间 | Timestamp |
| `sendTime` | 推送时间 | Timestamp |
| `affirmTime` | 确认时间 | Timstamp |
| `content` | 说明 | String |


:param status: 状态
:type status: String


##### `查询` pageAddReduce

分页方式获取增减单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 增减单信息列表 , 每条数据类型 `addReduce`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "arid": 1,
                "dpid": 2,
                "orderId": "1601010001",
                "decoration": {
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
                },
                "type": 0,
                "atttype": 0,
                "paytype": 0,
                "discount": 10000,
                "manageRate": 0,
                "manageDiscount": 0,
                "managePrice": 0,
                "taxRate": 0,
                "taxDiscount": 0,
                "taxPrice": 0,
                "undisPrice": 0,
                "disPrice": 0,
                "calPrice": 0,
                "uncalPrice": 0,
                "consPrice": 0,
                "comsPrice": 0,
                "total": 4.53,
                "schedule": 3,
                "constructionNode": {
                    "cnid": 2,
                    "name": "铲大白"
                },
                "status": 1,
                "isAffirm": 0,
                "createTime": "2016-01-01",
                "unpayTime": "2016-01-01",
                "confirmTime": "2016-01-01",
                "sendTime": "2016-01-01",
                "affirmTime": "2016-01-01",
                "content": "增项"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageAddReduceByOrderId

分页方式获取增减单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `addReduce.orderId` (String): 装修单号

```json
{
    "addReduce.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 增减单信息列表 , 每条数据类型 `addReduce`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "arid": 1,
                "dpid": 2,
                "orderId": "1601010001",
                "type": 0,
                "atttype": 0,
                "paytype": 0,
                "discount": 10000,
                "manageRate": 0,
                "manageDiscount": 0,
                "managePrice": 0,
                "taxRate": 0,
                "taxDiscount": 0,
                "taxPrice": 0,
                "undisPrice": 0,
                "disPrice": 0,
                "calPrice": 0,
                "uncalPrice": 0,
                "consPrice": 0,
                "comsPrice": 0,
                "total": 4.53,
                "schedule": 3,
                "constructionNode": {
                    "cnid": 2,
                    "name": "铲大白"
                },
                "status": 1,
                "isAffirm": 0,
                "createTime": "2016-01-01",
                "unpayTime": "2016-01-01",
                "confirmTime": "2016-01-01",
                "sendTime": "2016-01-01",
                "affirmTime": "2016-01-01",
                "content": "增项"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryAddReduceByOrderId

通过装修单号获取增减单信息

**Requests:**

- `addReduce.orderId` (String): 装修单号

```json
{
    "addReduce.orderId": "1601010001"
}
```

**Returns:**

- `addReduces` (List): 增减单信息列表 , 每条数据类型 `addReduce`

```json
{
    ...
    "addReduces": [
        {
            "arid": 1,
            "dpid": 2,
            "orderId": "1601010001",
            "type": 0,
            "atttype": 0,
            "paytype": 0,
            "discount": 10000,
            "manageRate": 0,
            "manageDiscount": 0,
            "managePrice": 0,
            "taxRate": 0,
            "taxDiscount": 0,
            "taxPrice": 0,
            "undisPrice": 0,
            "disPrice": 0,
            "calPrice": 0,
            "uncalPrice": 0,
            "consPrice": 0,
            "comsPrice": 0,
            "total": 0,
            "schedule": 3,
            "constructionNode": {
                "cnid": 2,
                "name": "铲大白"
            },
            "status": 1,
            "isAffirm": 0,
            "createTime": "2016-01-01",
            "unpayTime": "2016-01-01",
            "confirmTime": "2016-01-01",
            "sendTime": "2016-01-01",
            "affirmTime": "2016-01-01",
            "content": "增项"
        }
    ],
    ...
}
```


##### `查询` queryAddReduceForPayedByOrderId

通过装修单号获取款项状态为已付款和已确认的增减单信息

**Requests:**

- `addReduce.orderId` (String): 装修单号

```json
{
    "addReduce.orderId": "1601010001"
}
```

**Returns:**

- `addReduces` (List): 增减单信息列表 , 每条数据类型 `addReduce`

```json
{
    ...
    "addReduces": [
        {
            "arid": 1,
            "dpid": 2,
            "orderId": "1601010001",
            "type": 0,
            "atttype": 0,
            "paytype": 0,
            "discount": 10000,
            "manageRate": 0,
            "manageDiscount": 0,
            "managePrice": 0,
            "taxRate": 0,
            "taxDiscount": 0,
            "taxPrice": 0,
            "undisPrice": 0,
            "disPrice": 0,
            "calPrice": 0,
            "uncalPrice": 0,
            "consPrice": 0,
            "comsPrice": 0,
            "total": 0,
            "schedule": 3,
            "constructionNode": {
                "cnid": 2,
                "name": "铲大白"
            },
            "status": 1,
            "isAffirm": 0,
            "createTime": "2016-01-01",
            "unpayTime": "2016-01-01",
            "confirmTime": "2016-01-01",
            "sendTime": "2016-01-01",
            "affirmTime": "2016-01-01",
            "content": "增项"
        }
    ],
    ...
}
```


##### `查询` queryAddReduceByArid

通过增减单ID获取增减单信息

**Requests:**

- `addReduce.arid` (Long): 增减单ID

```json
{
    "addReduce.arid": 1
}
```

**Returns:**

- `addReduce` (Object): 增减单信息 , 数据类型 `addReduce`

```json
{
    ...
    "addReduce": {
        "arid": 1,
        "dpid": 2,
        "orderId": "1601010001",
        "type": 0,
        "atttype": 0,
        "paytype": 0,
        "discount": 10000,
        "manageRate": 0,
        "manageDiscount": 0,
        "managePrice": 0,
        "taxRate": 0,
        "taxDiscount": 0,
        "taxPrice": 0,
        "undisPrice": 0,
        "disPrice": 0,
        "calPrice": 0,
        "uncalPrice": 0,
        "consPrice": 0,
        "comsPrice": 0,
        "total": 0,
        "schedule": 3,
        "constructionNode": {
            "cnid": 2,
            "name": "铲大白"
        },
        "status": 1,
        "isAffirm": 0,
        "createTime": "2016-01-01",
        "unpayTime": "2016-01-01",
        "confirmTime": "2016-01-01",
        "sendTime": "2016-01-01",
        "affirmTime": "2016-01-01",
        "content": "增项"
    }
    ...
}
```


##### `查询` queryAddReduceByDpid

通过款项ID获取增减单信息

**Requests:**

- `addReduce.dpid` (Long): 款项ID

```json
{
    "addReduce.dpid": 2
}
```

**Returns:**

- `addReduces` (List): 增减单信息列表 , 每条数据类型 `addReduce`

```json
{
    ...
    "addReduces": [
        {
            "arid": 1,
            "dpid": 2,
            "orderId": "1601010001",
            "type": 0,
            "atttype": 0,
            "paytype": 0,
            "discount": 10000,
            "manageRate": 0,
            "manageDiscount": 0,
            "managePrice": 0,
            "taxRate": 0,
            "taxDiscount": 0,
            "taxPrice": 0,
            "undisPrice": 0,
            "disPrice": 0,
            "calPrice": 0,
            "uncalPrice": 0,
            "consPrice": 0,
            "comsPrice": 0,
            "total": 0,
            "schedule": 3,
            "constructionNode": {
                "cnid": 2,
                "name": "铲大白"
            },
            "status": 1,
            "isAffirm": 0,
            "createTime": "2016-01-01",
            "unpayTime": "2016-01-01",
            "confirmTime": "2016-01-01",
            "sendTime": "2016-01-01",
            "affirmTime": "2016-01-01",
            "content": "增项"
        }
    ],
    ...
}
```


##### `查询` addAddReduce

添加增减单

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

**Requests:**

- `addReduce.orderId` (String): 装修单号
- `addReduce.type` (Short): 类型 , 0: 增项 , 1: 减项
- `addReduce.atttype` (Short): 业务类型
- `addReduce.content` (String): 说明

```json
{
    "addReduce.orderId": "1601010001",
    "addReduce.type": 0,
    "addReduce.atttype": 0,
    "addReduce.content": ""
}
```


##### `查询` updateAddReduce

更新增减单

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

**Requests:**

- `addReduce.arid` (Short): 增减单ID
- `addReduce.undisPrice` (Long): 不打折总额
- `addReduce.disPrice` (Long): 打折总额
- `addReduce.uncalPrice` (Long): 非配比总额
- `addReduce.calPrice` (Long): 配比总额
- `addReduce.consPrice` (Long): 工程总额
- `addReduce.comsPrice` (Long): 主材总额

```json
{
    "addReduce.arid": 1,
    "addReduce.undisPrice": 1000000,
    "addReduce.disPrice": 0,
    "addReduce.uncalPrice": 0,
    "addReduce.calPrice": 1000000,
    "addReduce.consPrice": 0,
    "addReduce.comsPrice": 0
}
```


##### `查询` updateAddReduceForAdvance

更新增减单

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

**Requests:**

- `addReduce.arid` (Integer): 增减单ID
- `addReduce.total` (Long): 总价
- `addReduce.manageRate` (Long): 管理费比例
- `addReduce.manageDiscount` (Short): 管理费折扣
- `addReduce.managePrice` (Long): 管理费
- `addReduce.taxRate` (Long): 税金比例
- `addReduce.taxDiscount` (Short): 税金折扣
- `addReduce.taxPrice` (Long): 管理费
- `addReduce.undisPrice` (Long): 非打折项总额
- `addReduce.disPrice` (Long): 打折项总额
- `addReduce.uncalPrice` (Long): 非配比总额
- `addReduce.calPrice` (Long): 配比总额
- `addReduce.consPrice` (Long): 工程总额
- `addReduce.comsPrice` (Long): 主材总额

```json
{
    "addReduce.arid": 1,
    "addReduce.total": 100,
    "addReduce.manageRate": 1003
    "addReduce.manageDiscount": 0
    "addReduce.managePrice": 10,
    "addReduce.taxRate": 130
    "addReduce.taxDiscount": 0
    "addReduce.taxPrice": 0,
    "addReduce.undisPrice": 10,
    "addReduce.disPrice": 10,
    "addReduce.uncalPrice": 10,
    "addReduce.calPrice": 10,
    "addReduce.consPrice": 0,
    "addReduce.comsPrice": 0
}
```


##### `查询` unpayAddReduce

下拨

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

判断增减单类型是否为0(增项) , 其他类型 , 错误信息 **200062 增减单类型不可操作**

判断增减单款项类型是否为0(付款) , 其他类型 , 错误信息 **200062 增减单类型不可操作**

**Requests:**

- `addReduce.arid` (Long): 增减单ID
- `addReduce.paytype` (Short): 款项类型

```json
{
    "addReduce.arid": 1,
    "addReduce.paytype": 1
}
```


##### `查询` confirmAddReduce

确认

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

判断增减单款项类型是否为0(付款) , 类型匹配 , 错误信息 **200062 增减单类型不可操作**

**Requests:**

- `addReduce.arid` (Long): 增减单ID

```json
{
    "addReduce.arid": 1
}
```


##### `查询` sendAddReduce

发送

**Requests:**


```json
{
    "addReduces[0].arid": 1
}
```


##### `创建` affirmAddReduce

确认

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.customer.no` (String): 编号

```json
{
    "decoration.orderId": "1601010001",
    "decoration.customer.no": "",
    "addReduces[0].arid": 1
}
```


##### `查询` submitAddReduce

提交增减单

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

判断增减单是否存在关联装修款 , 已存在 , 错误信息 **150002 款项已存在**

创建关联装修款 , 更新增减单状态为1(提交)

**Requests:**


```json
{
    "addReduces[n].arid": 1
}
```


##### `查询` cancelAddReduce

撤销增减单

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

判断关联装修款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断关联装修款状态是否为0(未付款) , 其他状态 , 错误信息 **150019 款项不能撤销**

删除关联装修款 , 更新增减单状态为0(初始)

**Requests:**

- `addReduce.dpid` (Long): 装修款ID

```json
{
    "addReduce.dpid": 1
}
```


##### `查询` deleteAddReduce

删除增减单信息 , 只有初始和提交状态能够进行删除动作

判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**

判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

判断是否存在关联报价项 , 获取失败 , 错误信息 **200013 报价项不存在**

判断是否存在关联增减项 , 获取失败 , 错误信息 **140036 增减项不存在**

判断是否存在关联扩展项 , 获取失败 , 错误信息 **200027 扩展项不存在**

删除动作需要判断增减单状态 , 状态为初始和提交能够完成删除动作 , 同时需要将删除引用的报价项的工程量增加回原引用项目

**Requests:**

- `addReduce.arid` (Long): 增减单ID

```json
{
    "addReduce.arid": 1
}
```

### 项目


> **类**: `api.quotation.AddReduceItemAction`


#### 数据类型: `addReduceItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ariid` | 报价项ID | Long |
| `arid` | 增减单ID | Long |
| `itemName` | 名称 | String |
| `type` | 类型 , 0: 标准报价项 , 1: 系统定义项 , 2: 自定义项 , 3: 报价中报价项 , 4: 增项中报价项 , 5: 拓展中报价项 | Short |
| `subtype` | 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装 | Short |
| `itemtype` | 项目类型 , 0: 标准 , 1: 成本 | Short |
| `measurementUnit` | 单位 | String |
| `workType` | 工种 | String |
| `discount` | 折扣标识 , 0: 不打折 , 1: 打折 , 2: 不打折(非配比) , 3: 打折(非配比) | Short |
| `addPrice` | 增补价 | Integer |
| `unitPrice` | 单价 | Integer |
| `subPrice` | 退减价 | Integer |
| `initnum` | 初始量 | Integer |
| `num` | 工程量 | Integer |
| `quotationFunctionAreaId` | 所属功能区ID | Long |
| `quotationFunctionAreaName` | 所属功能区 | String |
| `quoteItemId` | 引用项ID | Long |
| `qiid` | 报价项ID (数据) | Long |
| `content` | 说明 | String |


##### `查询` queryAddReduceItemByAddReduceId

通过增减单ID获取增减项中包含的报价项信息

**Requests:**

- `addReduce.arid` (Long): 增减单ID

```json
{
    "addReduce.arid": 1
}
```

**Returns:**

- `addReduceItems` (List): 增减项信息列表 , 类型 `addReduceItem`

```json
{
    ...
    "addReduceItems": [
        {
            "ariid": 1,
            "arid": 1,
            "itemName": "原墙体建筑大白铲除",
            "type": 0,
            "subtype": 1,
            "itemtype": 1,
            "measurementUnit": "米",
            "workType": "油",
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quotationFunctionAreaName": "门厅",
            "quoteItemId": 3,
            "qiid": 0,
            "content": "说明信息"
        }
    ]
    ...
}
```


##### `查询` queryAddReduceItemByOrderId

通过增减单ID列表获取增减项中包含的报价项信息

**Requests:**

- `addReduce.orderId` (String): 装修单号

```json
{
    "addReduce.orderId": "1601010001"
}
```

**Returns:**

- `addReduceItems` (List): 增减项信息列表 , 类型 `addReduceItem`

```json
{
    ...
    "addReduceItems": [
        {
            "ariid": 1,
            "arid": 1,
            "itemName": "原墙体建筑大白铲除",
            "type": 0,
            "subtype": 1,
            "itemtype": 1,
            "measurementUnit": "米",
            "workType": "油",
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quotationFunctionAreaName": "门厅",
            "quoteItemId": 3,
            "qiid": 0,
            "content": "说明信息"
        }
    ]
    ...
}
```


##### `查询` queryAddReduceItemByAddReduceIds

通过增减单ID列表获取增减项中包含的报价项信息

**Requests:**


```json
{
    "addReduceIds[0]": 1,
    "addReduceIds[1]": 2
}
```

**Returns:**

- `addReduceItems` (List): 增减项信息列表 , 类型 `addReduceItem`

```json
{
    ...
    "addReduceItems": [
        {
            "ariid": 1,
            "arid": 1,
            "itemName": "原墙体建筑大白铲除",
            "type": 0,
            "subtype": 1,
            "itemtype": 1,
            "measurementUnit": "米",
            "workType": "油",
            "discount": 0,
            "addPrice": 10,
            "unitPrice": 10,
            "subPrice": 10,
            "initnum": 1000,
            "num": 1000,
            "quotationFunctionAreaId": 2,
            "quotationFunctionAreaName": "门厅",
            "quoteItemId": 3,
            "qiid": 0,
            "content": "说明信息"
        }
    ]
    ...
}
```


##### `查询` updateAddReduceItem

更新增减项中报价项信息 , 如果无对应信息 , 创建新信息

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

类型为3(报价中报价项)和4(增项中报价项) , 增减项类型为减项 , 需要减去引用的项目工程量 , 同时判断引用项工程量

增减项 , 增项类型 , 单价使用引用报价项的增补价 ; 减项类型 , 单价使用引用报价项的退减价

**Requests:**

- `addReduce.arid` (Long): 增减单ID
- `addReduce.total` (Long): 总价
- `addReduce.manageRate` (Long): 管理费比例
- `addReduce.managePrice` (Long): 管理费
- `addReduce.undisPrice` (Long): 非打折项总额
- `addReduce.disPrice` (Long): 打折项总额
- `addReduce.uncalPrice` (Long): 非配比总额
- `addReduce.calPrice` (Long): 配比总额
- `addReduce.consPrice` (Long): 工程总额
- `addReduce.comsPrice` (Long): 主材总额
- `addReduceItem.ariid` (Long): 报价项ID
- `addReduceItem.arid` (Long): 增减项ID
- `addReduceItem.type` (Short): 类型 , 0: 标准报价项 , 1: 系统定义项 , 2: 自定义项 , 3: 报价中报价项 , 4: 增项中报价项
- `addReduceItem.measurementUnit` (String): 单位
- `addReduceItem.workType` (String): 工种
- `addReduceItem.discount` (Short): 折扣
- `addReduceItem.addPrice` (Integer): 增补价
- `addReduceItem.unitPrice` (Integer): 单价
- `addReduceItem.subPrice` (Integer): 退减价
- `addReduceItem.num` (Integer): 工程量
- `addReduceItem.quotationFunctionAreaId` (Long): 所属功能区ID
- `addReduceItem.quotationFunctionAreaName` (String): 所属功能区
- `addReduceItem.quoteItemId` (Long): 引用项ID
- `addReduceItem.content` (String): 说明

```json
{
    "addReduce.arid": 1,
    "addReduce.total": 100,
    "addReduce.manageRate": 1003
    "addReduce.managePrice": 10,
    "addReduce.undisPrice": 10,
    "addReduce.disPrice": 10,
    "addReduce.uncalPrice": 10,
    "addReduce.calPrice": 10,
    "addReduce.consPrice": 0,
    "addReduce.comsPrice": 0,

    "addReduceItem.ariid": 1,
    "addReduceItem.itemName": "原墙体建筑大白铲除",
    "addReduceItem.type": 0,
    "addReduceItem.subtype": 1,
    "addReduceItem.itemtype": 1,
    "addReduceItem.measurementUnit": "米",
    "addReduceItem.workType": "油"
    "addReduceItem.discount": 0,
    "addReduceItem.addPrice": 10,
    "addReduceItem.unitPrice": 10,
    "addReduceItem.subPrice": 10,
    "addReduceItem.num": 1,
    "addReduceItem.quotationFunctionAreaId": 2,
    "addReduceItem.quoteItemId": 3,
    "addReduceItem.qiid": 3,
    "addReduceItem.content": "说明信息",
}
```


##### `查询` updateAddReduceItemForAdvance

更新增减项项目信息

根据打折标识更新增减项的配比计算值

判断增减单是否存在 , 不存在 , 错误信息 **140018 增减单不存在**

判断增减项是否存在 , 不存在 , 错误信息 **140036 增减项不存在**

**Requests:**

- `addReduce.arid` (Long): 增减单ID
- `addReduce.uncalPrice` (Long): 非配比总额
- `addReduce.calPrice` (Long): 配比总额
- `addReduceItem.ariid` (Long): 报价项ID
- `addReduceItem.discount` (Long): 打折标识

```json
{
    "addReduce.arid": 1,
    "addReduce.uncalPrice": 0,
    "addReduce.calPrice": 0,

    "addReduceItem.ariid": 1,
    "addReduceItem.discount": 1
}
```


##### `查询` deleteAddReduceItem

删除增减项

判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**

删除动作需要判断当前增减单的状态 , 状态为初始以及提交状态能够完成删除动作

**Requests:**

- `addReduce.arid` (Long): 增减单ID
- `addReduce.total` (Long): 总价
- `addReduce.manageRate` (Long): 管理费比例
- `addReduce.managePrice` (Long): 管理费
- `addReduce.undisPrice` (Long): 非打折项总额
- `addReduce.disPrice` (Long): 打折项总额
- `addReduce.uncalPrice` (Long): 非配比总额
- `addReduce.calPrice` (Long): 配比总额
- `addReduce.consPrice` (Long): 工程总额
- `addReduce.comsPrice` (Long): 主材总额
- `addReduceItem.ariid` (Long): 报价项ID

```json
{
    "addReduce.arid": 1,
    "addReduce.total": 100,
    "addReduce.manageRate": 1003
    "addReduce.managePrice": 10,
    "addReduce.undisPrice": 10,
    "addReduce.disPrice": 10,
    "addReduce.uncalPrice": 10,
    "addReduce.calPrice": 10,
    "addReduce.consPrice": 0,
    "addReduce.comsPrice": 0,

    "addReduceItem.ariid": 1
}
```

## 选材


装修单报价过程拓展项目处理过程 , 主要使用在订单类型为整装的处理过程

### 选材


> **类**: `api.quotation.SelectionAction`


#### 数据类型: `selection`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 选材单ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `qid` | 报价ID | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定 | Short |
| `isAffirm` | 是否确认 , 0: 未确认 , 1: 客户确认 | Short |
| `total` | 总额 | Long |
| `quotationTotal` | 报价总额 | Long |
| `extensionAddTotal` | 拓展总额 | Long |
| `extensionReduceTotal` | 拓展总额 | Long |
| `addReduceAddTotal` | 增减总额 | Long |
| `addReduceMinusTotal` | 增减总额 | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `splitter` | 拆单员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `traner` | 下单人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `affirmTime` | 确认时间 | Timestamp |
| `company` | 公司ID | Integer |


##### `查询` pageSelection

分页方式获取选材单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材单信息列表 , 每条数据类型 `selection`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "orderId": "1601010001,
                "decoration": {
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
                },
                "qid": 1,
                "total": 10000,
                "quotationTotal": 10000,
                "extensionTotal": 0,
                "addReductTotal": 0,
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "splitter": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "traner": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "createTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySelectionByOrderId

通过装修单号获取选材单 , 关联查询默认报价以及对应的选材单

判断装修单的默认报价是否存在 , 不存在 , 错误信息 **200017 默认报价不存在**

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selection.orderId` (String): 装修单号

```json
{
    "selection.orderId": "1601010001"
}
```

**Returns:**

- `selection` (Object): 选材单

```json
{
    ...
    "selection": {
        "sid": 1,
        "orderId": "1601010001,
        "qid": 1,
        "total": 10000,
        "quotationTotal": 10000,
        "extensionTotal": 0,
        "addReductTotal": 0,
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "splitter": {
            "uid": 11,
            "userId": "U011",
            "userName": "配送人",
            "currentName": "配送人",
            "duty": "配送人"
        },
        "traner": {
            "uid": 11,
            "userId": "U011",
            "userName": "配送人",
            "currentName": "配送人",
            "duty": "配送人"
        },
        "createTime": "2016-01-01"
    },
    ...
}
```


##### `查询` querySelectionByQid

通过报价ID获取选材单

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selection.qid` (Long): 报价ID

```json
{
    "selection.qid": 1
}
```

**Returns:**

- `selection` (Object): 选材单

```json
{
    ...
    "selection": {
        "sid": 1,
        "orderId": "1601010001,
        "qid": 1,
        "total": 10000,
        "quotationTotal": 10000,
        "extensionTotal": 0,
        "addReductTotal": 0,
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "splitter": {
            "uid": 11,
            "userId": "U011",
            "userName": "配送人",
            "currentName": "配送人",
            "duty": "配送人"
        },
        "traner": {
            "uid": 11,
            "userId": "U011",
            "userName": "配送人",
            "currentName": "配送人",
            "duty": "配送人"
        },
        "createTime": "2016-01-01"
    },
    ...
}
```


##### `查询` addSelection

创建选材单

判断报价是否存在 , 不存在 , 错误信息 **200003 报价不存在**

**Requests:**

- `selection.qid` (Long): 报价ID

```json
{
    "selection.qid": 1
}
```


##### `查询` updateSelection

更新选材单

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selection.sid` (Long): 选材单ID
- `selection.splitter.uid` (Long): 拆单员ID
- `selection.traner.uid` (Long): 下单员ID

```json
{
    "selection.sid": 1,
    "selection.splitter.uid": 1,
    "selection.traner.uid": 1
}
```


##### `查询` updateSelectionForAdvance

更新选材单 , 主要针对各类总额更新

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**

**Requests:**

- `selection.sid` (Long): 选材单ID
- `selection.total` (Long): 总额
- `selection.quotationTotal` (Long): 报价总额
- `selection.extensionTotal` (Long): 拓展总额
- `selection.addReductTotal` (Long): 增减总额

```json
{
    "selection.sid": 1,
    "selection.total": 10000,
    "selection.quotationTotal": 10000,
    "selection.extensionTotal": 0,
    "selection.addReductTotal": 0
}
```


##### `查询` lockSelection

锁定选材单

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**

更新选材单状态为1(锁定)

**Requests:**

- `selection.sid` (Long): 选材单ID

```json
{
    "selection.sid": 1
}
```


##### `查询` sendSelection

推送

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selection.sid` (Long): 选材单ID

```json
{
    "selection.sid": 1
}
```


##### `创建` affirmSelection

确认

判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**

判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `decoration.orderId` (String): 装修单号
- `decoration.customer.no` (String): 编号
- `selection.sid` (Long): 选材单ID

```json
{
    "decoration.orderId": "1601010001",
    "decoration.customer.no": "",
    "selection.sid": 1,
}
```

### 项目


> **类**: `api.quotation.SelectionItemAction`


#### 数据类型: `selectionItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `siid` | 选材项ID | Long |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `suid` | 厂商ID | Long |
| `sid` | 选材单ID | Long |
| `areaId` | 引用区ID , 包括三个类型 , 分别是功能区 , 拓展 , 增减 | Long |
| `areaName` | 功能区名称 | String |
| `quoteId` | 引用项ID , 包括四个类型 , 分别是报价项 , 拓展项 , 增减项 , 选材项 | Long |
| `type` | 类型 , 0: 报价项 , 1: 拓展增 , 2: 拓展减 , 3: 增项增 , 4: 增项减 , 5: 选材项 | Short |
| `goods` | 商品 , 类型: [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `preprice` | 预算金额 , 通过报价项(原价) , 增项(增补价) , 减项(退减价)赋值 | Integer |
| `postprice` | 结算价 | Integer |
| `initnum` | 工程量 | Integer |
| `num` | 数量 | Integer |
| `refnum` | 退数量 | Integer |
| `accountStatus` | 对账状态 , 0: 初始 , 1: 对账 | Short |
| `status` | 状态 , 0: 初始(拆单), 1: 配送(下单), 2: 审核, 3: 确认, 4: 完结, 5: 核对, 6: 结算 , 7: 失效 | Short |
| `createTime` | 创建时间(拆单时间) | Timestamp |
| `tranTime` | 配送时间(下单时间) | Timestamp |
| `checkTime` | 审核时间 | Timestamp |
| `confirmTime` | 确认时间 | Timestamp |
| `finishTime` | 完结时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `accountTime` | 对账时间 | Timestamp |
| `traner` | 配送人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `checker` | 审核人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `finisher` | 完结人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balancer` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `accounter` | 对账人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `comment` | 备注 | String |
| `company` | 公司ID | Integer |


##### `查询` pageSelectionItem

分页方式获取选材项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材项信息列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "siid": 1,
                "decoration": {
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
                },
                "sid": 1,
                "areaId": 1,
                "quoteId": 1,
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "checkup": 0,
                    "company": 0
                },
                "areaName": "功能区",
                "preprice": 0,
                "postprice": 0,
                "initnum": 10000,
                "num": 10000,
                "refnum": 0,
                "accountStatus": 0,
                "status": 0,
                "comment": "备注"
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "accountTime": "2016-01-01 00:00:00",
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
                },
                "balancer": {
                    "uid": 15,
                    "userId": "U015",
                    "userName": "结算人",
                    "currentName": "结算人",
                    "duty": "结算人"
                },
                "accounter": null
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageSelectionItemForSupplier

分页方式获取选材项信息 , 利用厂商作为条件 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材项信息列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "siid": 1,
                "decoration": {
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
                },
                "sid": 1,
                "areaId": 1,
                "quoteId": 1,
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "checkup": 0,
                    "company": 0
                },
                "areaName": "功能区",
                "preprice": 0,
                "postprice": 0,
                "initnum": 10000,
                "num": 10000,
                "refnum": 0,
                "accountStatus": 0,
                "status": 0,
                "comment": "备注"
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "accountTime": "2016-01-01 00:00:00",
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
                },
                "balancer": {
                    "uid": 15,
                    "userId": "U015",
                    "userName": "结算人",
                    "currentName": "结算人",
                    "duty": "结算人"
                },
                "accounter": null
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageSelectionItemForEscorter

分页方式获取选材项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

归属装修单的跟单员作为当前操作的默认条件

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材项信息列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "siid": 1,
                "decoration": {
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
                },
                "sid": 1,
                "areaId": 1,
                "quoteId": 1,
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "checkup": 0,
                    "company": 0
                },
                "areaName": "功能区",
                "preprice": 0,
                "postprice": 0,
                "initnum": 10000,
                "num": 10000,
                "refnum": 0,
                "accountStatus": 0,
                "status": 0,
                "comment": "备注"
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "accountTime": "2016-01-01 00:00:00",
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
                },
                "balancer": {
                    "uid": 15,
                    "userId": "U015",
                    "userName": "结算人",
                    "currentName": "结算人",
                    "duty": "结算人"
                },
                "accounter": null
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageSelectionItemForAccount

分页方式获取选材项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

选材项对账状态为0(初始)作为默认条件

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 选材项信息列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "siid": 1,
                "decoration": {
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
                },
                "sid": 1,
                "areaId": 1,
                "quoteId": 1,
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "checkup": 0,
                    "company": 0
                },
                "areaName": "功能区",
                "preprice": 0,
                "postprice": 0,
                "initnum": 10000,
                "num": 10000,
                "refnum": 0,
                "accountStatus": 0,
                "status": 0,
                "comment": "备注"
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "accountTime": "2016-01-01 00:00:00",
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
                },
                "balancer": {
                    "uid": 15,
                    "userId": "U015",
                    "userName": "结算人",
                    "currentName": "结算人",
                    "duty": "结算人"
                },
                "accounter": null
            },
        ],
        ...
    },
    ...
}
```


##### `查询` querySelectionItemByOrderId

通过装修单号获取选材项 , 利用装修单对应的默认报价获取对应的选材信息

判断装修单的默认报价是否存在 , 不存在 , 错误信息 **200017 默认报价不存在**

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selectionItem.orderId` (String): 装修单编号

```json
{
    "selectionItem.orderId": "1601010001"
}
```

**Returns:**

- `selectionItems` (List): 选材项列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "selectionItems": [
        {
            "siid": 1,
            "orderId": "1601010001",
            "sid": 1,
            "areaId": 1,
            "quoteId": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个",
                "purchase": 100000,
                "selling": 10000,
                "pieceNum": 1,
                "type": 0,
                "checkup": 0,
                "company": 0
            },
            "areaName": "功能区",
            "preprice": 0,
            "postprice": 0,
            "initnum": 10000,
            "num": 10000,
            "refnum": 0,
            "accountStatus": 0,
            "status": 0,
            "comment": "备注"
            "tranTime": "2016-01-01 00:00:00",
            "checkTime": "2016-01-01 00:00:00",
            "confirmTime": "2016-01-01 00:00:00",
            "balanceTime": "2016-01-01 00:00:00",
            "accountTime": "2016-01-01 00:00:00",
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
            },
            "balancer": {
                "uid": 15,
                "userId": "U015",
                "userName": "结算人",
                "currentName": "结算人",
                "duty": "结算人"
            },
            "accounter": null
        }
    ]
    ...
}
```


##### `查询` querySelectionItem

通过报价ID获取选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

**Requests:**

- `selectionItem.sid` (Long): 选材单ID

```json
{
    "selectionItem.sid": 1
}
```

**Returns:**

- `selectionItems` (List): 选材项列表 , 每条数据类型 `selectionItem`

```json
{
    ...
    "selectionItems": [
        {
            "siid": 1,
            "orderId": "1601010001",
            "sid": 1,
            "areaId": 1,
            "quoteId": 1,
            "goods": {
                "gid": 1,
                "no": "JGIDNEHDUIN5SD",
                "name": "瓷砖",
                "barcode": "254125212521251",
                "category": "瓷砖",
                "brand": "瓷砖",
                "measurementUnit": "个",
                "purchase": 100000,
                "selling": 10000,
                "pieceNum": 1,
                "type": 0,
                "checkup": 0,
                "company": 0
            },
            "areaName": "功能区",
            "preprice": 0,
            "postprice": 0,
            "initnum": 10000,
            "num": 10000,
            "refnum": 0,
            "accountStatus": 0,
            "status": 0,
            "comment": "备注"
            "tranTime": "2016-01-01 00:00:00",
            "checkTime": "2016-01-01 00:00:00",
            "confirmTime": "2016-01-01 00:00:00",
            "balanceTime": "2016-01-01 00:00:00",
            "accountTime": "2016-01-01 00:00:00",
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
            },
            "balancer": {
                "uid": 15,
                "userId": "U015",
                "userName": "结算人",
                "currentName": "结算人",
                "duty": "结算人"
            },
            "accounter": null
        }
    ]
    ...
}
```


##### `查询` collateSelectionItem

核对选材项

以装修单号为条件 , 判断状态非4(完结)的选材项 , 如果存在 , 错误信息 **200039 选材项状态不可操作**

**Requests:**

- `selection.orderId` (String): 装修单号

```json
{
    "selection.orderId": "1601010001"
}
```


##### `查询` addSelectionItem

添加选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**

**Requests:**

- `selection.sid` (Long): 选材单ID
- `selection.total` (Long): 总额
- `selection.quotationTotal` (Long): 报价总额
- `selection.extensionTotal` (Long): 拓展总额
- `selection.addReductTotal` (Long): 增减总额
- `selectionItem.areaId` (Long): 引用区ID
- `selectionItem.quoteId` (Long): 引用项ID
- `selectionItem.goods.gid` (Long): 商品ID
- `selectionItem.areaName` (String): 功能区
- `selectionItem.preprice` (Integer): 预算价格
- `selectionItem.initnum` (Integer): 工程量
- `selectionItem.num` (Integer): 数量

```json
{
    "selection.sid": 1,
    "selection.total": 10000,
    "selection.quotationTotal": 10000,
    "selection.extensionTotal": 0,
    "selection.addReductTotal": 0,

    "selectionItem.areaId": 1,
    "selectionItem.quoteId": 1,
    "selectionItem.goods.gid": 1,
    "selectionItem.areaName": "功能区",
    "selectionItem.preprice": 0,
    "selectionItem.initnum": 1000,
    "selectionItem.num": 1000
}
```


##### `查询` updateSelectionItem

更新选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**

**Requests:**

- `selection.sid` (Long): 选材单ID
- `selection.total` (Long): 总额
- `selection.quotationTotal` (Long): 报价总额
- `selection.extensionTotal` (Long): 拓展总额
- `selection.addReductTotal` (Long): 增减总额
- `selectionItem.siid` (Long): 选材项ID
- `selectionItem.postprice` (Integer): 结算价
- `selectionItem.num` (Integer): 数量

```json
{
    "selection.sid": 1,
    "selection.total": 10000,
    "selection.quotationTotal": 10000,
    "selection.extensionTotal": 0,
    "selection.addReductTotal": 0,

    "selectionItem.siid": 1,
    "selectionItem.postprice": 10000,
    "selectionItem.num": 10000
}
```


##### `查询` tranSelectionItem

配送选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为0(初始) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItems[0].siid": 1,
    "selectionItems[0].num": 1000
}
```


##### `查询` checkSelectionItem

审核选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为1(配送) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItems[0].siid": 1,
    "selectionItems[0].comment": "备注"
}
```


##### `查询` confirmSelectionItem

确认选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为2(审核) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItems[0].siid": 1
}
```


##### `查询` finishSelectionItem

完结选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为3(确认) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItems[0].siid": 1
}
```


##### `查询` reviewSelectionItem

核对选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为4(完结) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItem[0].siid": 1
}
```


##### `查询` balanceSelectionItem

结算选材项

判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**

判断选材项状态为5(核对) , 其他状态 , 错误信息 **200039 选材项状态不可操作**

**Requests:**


```json
{
    "selectionItem[0].siid": 1
}
```


##### `查询` refundSelectionItem

退货

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**

**Requests:**


```json
{
    "selectionItems[0].siid": 1,
    "selectionItems[0].refnum": 1
}
```


##### `查询` deleteSelectionItem

删除选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态非0(初始)/1(配送) , 其他状态 , 错误信息 **200036 选材单不可操作**

**Requests:**

- `selection.sid` (Long): 选材单ID
- `selection.total` (Long): 总额
- `selection.quotationTotal` (Long): 报价总额
- `selection.extensionTotal` (Long): 拓展总额
- `selection.addReductTotal` (Long): 增减总额
- `selectionItem.siid` (Long): 选材项ID

```json
{
    "selection.sid": 1,
    "selection.total": 10000,
    "selection.quotationTotal": 10000,
    "selection.extensionTotal": 0,
    "selection.addReductTotal": 0,

    "selectionItem.siid": 1
}
```


##### `查询` cutoffSelectionItem

失效选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态为5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**

选材项状态更新为7(失效)

**Requests:**


```json
{
    "selectionItems[0].siid": 1
}
```


##### `查询` rejectSelectionItem

驳回选材项

判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**

判断选材单状态非5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**

选材项状态更新为4(完结)

**Requests:**


```json
{
    "selectionItems[0].siid": 1
}
```

### 项目


> **类**: `api.quotation.QuotationRemeasureAction`


#### 数据类型: `quotationRemeasure`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qrid` | 回尺单ID | Long |
| `orderId` | 装修单号 | String |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 | Short |
| `company` | 公司ID | Integer |


#### 数据类型: `quotationRemeasureItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qriid` | 回尺项ID | Long |
| `qrid` | 回尺单ID | Long |
| `orderId` | 装修单号 | String |
| `areaId` | 引用区ID , 包括三个类型 , 分别是功能区 , 拓展 , 增减 | Long |
| `areaName` | 功能区名称 | String |
| `selectionItem` | 选材项 , 类型 [selectionItem ](./quotation.html#api.quotation.SelectionItemAction.selectionItem) | Object |
| `remeasureFormat` | 回尺指标 , 类型 [remeasureFormat ](./data.html#api.data.RemeasureFormatAction.remeasureFormat) | Object |
| `name` | 名称 | String |
| `type` | 类型 , 0: 文本 , 1: 数值 | Short |


##### `查询` pageQuotationRemeasure


##### `查询` queryQuotationRemeasure


##### `查询` queryQuotationRemeasureItem


##### `查询` makeQuotationRemeasure


##### `查询` updateQuotationRemeasureItem

## 定额


### 定额


> **类**: `api.quotation.NormtionAction`


#### 数据类型: `normtion`

| 参数 | 说明 | 类型 |
|------|------|------|
| `nid` | 报价定额ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `qid` | 报价ID | Long |
| `moodTotal` | 材料总额 | Long |
| `mriceTotal` | 工费总额 | Long |
| `moodPrintNum` | 材料打印次数 | Integer |
| `mricePriceNum` | 工费打印次数 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |


##### `查询` pageNormtion

分页方式获取定额单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 定额单信息列表 , 每条数据类型 `normtion`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "nid": 1,
                "orderId": "1601010001",
                "decoration": {
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
                },
                "qid": 1,
                "moodTotal": 0,
                "mriceTotal": 0,
                "noodPriceNum": 0,
                "mricePriceNum": 0,
                "status": 0,
                "creater": {
                    "uid": 1,
                    "createrId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryNormtion

查询定额信息

**Requests:**

- `normtion.qid` (Long): 报价ID

```json
{
    "normtion.qid": 1
}
```

**Returns:**

- `normtion` (Object): 定额信息列表 , 类型 `normtion`

```json
{
    ...
    "normtion": {
        "nid": 1,
        "qid": 1,
        "moodTotal": 0,
        "mriceTotal": 0,
        "noodPriceNum": 0,
        "mricePriceNum": 0,
        "status": 0,
        "creater": {
            "uid": 1,
            "createrId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01"
    },
    ...
}
```


##### `查询` makeNormtionForQuotation

生成定额信息

**Requests:**

- `normtion.nid` (Long): 定额ID

```json
{
    "normtion.nid": 1
}
```


##### `查询` makeNormtionForExtension

生成定额信息

**Requests:**

- `normtion.orderId` (String): 装修单号
- `extension.eid` (Long): 扩展单ID

```json
{
    "normtion.orderId": 1,
    "extension.eid": 1
}
```


##### `查询` makeNormtionForAddReduce

生成定额信息

**Requests:**

- `normtion.orderId` (String): 装修单号
- `addReduce.arid` (Long): 增减单ID

```json
{
    "normtion.orderId": 1,
    "addReduce.arid": 1
}
```


```json
{
    "normtion.nid": 1
}
```


##### `查询` printNormtion

打印定额信息

**Requests:**

- `normtion.nid` (Long): 定额ID
- `normtion.noodPriceNum` (Integer): 材料打印数量
- `normtion.mricePriceNum` (Integer): 工费打印数量

```json
{
    "normtion.nid": 1,
    "normtion.noodPriceNum": 1,
    "normtion.mricePriceNum": 1
}
```


##### `查询` updateNormtionForStatus

更新定额单状态

**Requests:**

- `normtion.nid` (Long): 定额ID
- `normtion.status` (Short): 状态

```json
{
    "normtion.nid": 1,
    "normtion.status": 1
}
```

### 材料项


> **类**: `api.quotation.NormoodItemAction`


#### 数据类型: `normoodItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ngiid` | 定额材料ID | Long |
| `qid` | 报价ID | Long |
| `sid` | 引用ID , 包括报价/拓展/增减 | Long |
| `areaId` | 功能区ID | Long |
| `quoteId` | 引用项ID | Long |
| `qiid` | 报价项ID | Long |
| `type` | 类型 , 包括: 0(报价) , 1(拓展) , 2(增减) | Short |
| `normtype` | 定额类型 , 包括: 0(材料) , 1(打包) | Short |
| `atttype` | 业务类型 , 包括: 0(收款) , 1(出款) | Short |
| `noods` | 定材 , 类型 [noods ](./data.html#api.data.NoodsAction.noods) | Object |
| `unit` | 单位 | String |
| `num` | 数量 | Integer |


##### `查询` queryNormoodItem

查询报价定额材料项目

**Requests:**

- `normoodItem.qid` (Long): 报价ID

```json
{
    "normoodItem.qid": 1
}
```

**Returns:**

- `normoodItems` (List): 定额材料信息列表 , 每条数据类型 `normoodItem`

```json
{
    ...
    "normoodItems": [
        {
            "ngiid": 1,
            "qid": 1,
            "sid": 1,
            "areaId": 1,
            "qiid": 1,
            "type": 0,
            "normtype": 0,
            "atttype": 0,
            "noods": {
                "nid": 1,
                "name": "名称",
                "selling": 1000,
                "balance": 1000
            },
            "unit": "个",
            "num": 1000
        }
    ],
    ...
}
```


##### `查询` queryQuotationNormood

获取报价项关联的定额材料

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `quotationFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotationFunctionArea`

```json
{
    ...
    "quotationFunctionAreas": [
        {
            "qfaid": 1,
            "quotationId": 1,
            "functionAreaName": "门厅",
            "functionAreaOrder": 1,
            "functionAreaType": "0",
            "type": 1,
            "total": 0,
            "quotationFunctionAreaItems": [
                {
                    "content": "",
                    "discount": 0,
                    "itemName": "报价项",
                    "measurementUnit": "",
                    "num": 1,
                    "qfaiId": 1,
                    "quotationFunctionAreaId": 1,
                    "quotationItemId": null,
                    "type": 2,
                    "unitPrice": 100,
                    "workType": "木工",
                    "noods": {
                        "nid": 1,
                        "name": "名称",
                        "selling": 1000,
                        "balance": 1000
                    },
                }
            ]
        }
    ],
    ...
}
```


##### `查询` queryExtensionNormood


##### `查询` queryAddReduceNormood


##### `查询` amountQuotationNormood

汇总报价关联的定额材料

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `normoods` (List): 定额信息列表 , 每条数据类型 [normood ](./data.html#api.data.NormAction.normood)

```json
{
    ...
    "normoods": [
        {
            "ngid": 1,
            "num": 1000,
            "amount": 1000
        },
    ],
    ...
}
```


##### `查询` amountExtensionNormood


##### `查询` amountAddReduceNormood


##### `查询` addNormoodItem

添加报价定额材料

**Requests:**

- `normoodItem.qid` (Long): 报价ID
- `normoodItem.sid` (Long): 引用ID
- `normoodItem.areaId` (Long): 功能区ID
- `normoodItem.quoteId` (Long): 引用项ID
- `normoodItem.qiid` (Long): 报价项ID
- `normoodItem.type` (Short): 类型
- `normoodItem.normtype` (Short): 定额类型
- `normoodItem.atttype` (Short): 业务类型
- `normoodItem.goods.gid` (Long): 商品ID
- `normoodItem.noods.nid` (Long): 定材ID
- `normoodItem.unit` (String): 单位
- `normoodItem.num` (Integer): 数量

```json
{
    "normoodItem.qid": 1,
    "normoodItem.sid": 1,
    "normoodItem.areaId": 1,
    "normoodItem.quoteId": 1,
    "normoodItem.qiid": 1,
    "normoodItem.type": 0,
    "normoodItem.normtype": 0,
    "normoodItem.atttype": 0,
    "normoodItem.goods.gid": 1,
    "normoodItem.noods.nid": 1,
    "normoodItem.unit": "个",
    "normoodItem.num": 1,
}
```


##### `查询` deleteNormoodItem

删除报价定额材料

**Requests:**

- `normoodItem.ngiid` (Long): 报价定额材料ID

```json
{
    "normoodItem.ngiid": 1
}
```

### 工费项


> **类**: `api.quotation.NormriceItemAction`


#### 数据类型: `normriceItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `npiid` | 定额工费ID | Long |
| `qid` | 报价ID | Long |
| `sid` | 引用ID , 包括报价/拓展/增减 | Long |
| `areaId` | 功能区ID | Long |
| `quoteId` | 引用项ID | Long |
| `qiid` | 报价项ID | Long |
| `type` | 类型 , 包括: 0(报价) , 1(拓展) , 2(增减) | Short |
| `normtype` | 定额类型 , 包括: 0(工费) , 1(附加) | Short |
| `atttype` | 业务类型 , 包括: 0(收款) , 1(出款) | Short |
| `constructionNode` | 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |
| `name` | 名称 | String |
| `unit` | 单位 | String |
| `num` | 数量 | Integer |
| `trannum` | 转换量 | Integer |
| `salary` | 薪资 | Integer |


##### `查询` queryNormriceItem

查询报价定额工费项目

**Requests:**

- `normriceItem.qid` (Long): 报价ID

```json
{
    "normriceItem.qid": 1
}
```

**Returns:**

- `normriceItems` (List): 定额工费信息列表 , 每条数据类型 `normriceItem`
- `npiid` (Long): 定额工费ID
- `qid` (Long): 报价ID
- `sid` (Long): 引用ID , 包括报价/拓展/增减
- `areaId` (Long): 功能区ID
- `quoteId` (Long): 引用项ID
- `qiid` (Long): 报价项ID
- `type` (Short): 类型 , 包括: 0(报价) , 1(拓展) , 2(增减)
- `normtype` (Short): 定额类型 , 包括: 0(工费) , 1(附加)
- `atttype` (Short): 业务类型 , 包括: 0(收款) , 1(出款)
- `constructionNode` (Object): 施工节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode)
- `name` (String): 名称
- `unit` (String): 单位
- `num` (Integer): 数量
- `trannum` (Integer): 转换量
- `salary` (Integer): 薪资

```json
{
    ...
    "normriceItems": [
        {
            "npiid": 1,
            "qid": 1,
            "sid": 1,
            "areaId": 1,
            "qiid": 1,
            "type": 0,
            "normtype": 0,
            "atttype": 0,
            "constructionNode": {
                "cnid": 2,
                "name": "铲大白"
            },
            "name": "名称",
            "unit": "个",
            "trannum": 1000,
            "num": 1000,
            "salary": 1000
        }
    ],
    ...
}
```


##### `查询` queryQuotationNormrice

获取报价项关联的定额工费

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `quotationFunctionAreas` (List): 功能区信息列表 , 每条数据类型 `quotationFunctionArea`

```json
{
    ...
    "quotationFunctionAreas": [
        {
            "qfaid": 1,
            "quotationId": 1,
            "functionAreaName": "门厅",
            "functionAreaOrder": 1,
            "functionAreaType": "0",
            "type": 1,
            "total": 0,
            "quotationFunctionAreaItems": [
                {
                    "content": "",
                    "discount": 0,
                    "itemName": "报价项",
                    "measurementUnit": "",
                    "num": 1,
                    "qfaiId": 1,
                    "quotationFunctionAreaId": 1,
                    "quotationItemId": null,
                    "type": 2,
                    "unitPrice": 100,
                    "workType": "木工",
                    "normrice": {
                        "npid": 1,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "salary": 1000
                    },
                }
            ]
        }
    ],
    ...
}
```


##### `查询` queryExtensionNormrice


##### `查询` queryAddReduceNormrice


##### `查询` amountQuotationNormrice

汇总报价关联的定额工费

**Requests:**

- `quotation.qid` (Long): 报价ID

```json
{
    "quotation.qid": 1
}
```

**Returns:**

- `normrices` (List): 定额信息列表 , 每条数据类型 [normrice ](./data.html#api.data.NormAction.normrice)

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
            "salary": 1000,
            "amount": 1000
        },
    ],
    ...
}
```


##### `查询` amountExtensionNormrice


##### `查询` amountAddReduceNormrice


##### `查询` addNormriceItem

添加报价定额工费

**Requests:**

- `normriceItem.qid` (Long): 报价ID
- `normriceItem.sid` (Long): 引用ID
- `normriceItem.areaId` (Long): 功能区ID
- `normriceItem.quoteId` (Long): 引用项ID
- `normriceItem.qiid` (Long): 报价项ID
- `normriceItem.type` (Short): 类型
- `normriceItem.normtype` (Short): 定额类型
- `normriceItem.atttype` (Short): 业务类型
- `normriceItem.constructionNode.cnid` (Long): 施工节点ID
- `normriceItem.name` (String): 名称
- `normriceItem.unit` (String): 单位
- `normriceItem.trannum` (Integer): 转换量
- `normriceItem.num` (Integer): 数量
- `normriceItem.salary` (Integer): 工费

```json
{
    "normriceItem.qid": 1,
    "normriceItem.sid": 1,
    "normriceItem.areaId": 1,
    "normriceItem.quoteId": 1,
    "normriceItem.qiid": 1,
    "normriceItem.type": 0,
    "normriceItem.normtype": 0,
    "normriceItem.atttype": 0,
    "normriceItem.constructionNode.cnid": 1,
    "normriceItem.name": "名称",
    "normriceItem.unit": "个",
    "normriceItem.num": 1,
}
```


##### `查询` deleteNormriceItem

删除报价定额工费

**Requests:**

- `normriceItem.npiid` (Long): 报价定额工费ID

```json
{
    "normriceItem.ngiid": 1
}
```

## 记录


> **类**: `api.quotation.QuotationRecordAction`


#### 数据类型: `quotationRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qrid` | 记录ID | Long |
| `orderId` | 装修单号 | String |
| `sid` | 预签单ID/报价单ID/扩展单ID/增减单ID | Long |
| `type` | 类型 , 0(预签) , 1(报价) , 2(扩展) , 3(增减) | Short |
| `operator` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` queryQuotationRecord

获取报价记录信息

**Requests:**

- `quotationRecord.sid` (Short): ID
- `quotationRecord.type` (Short): 类型

```json
{
    "quotationFunction.sid": 0,
    "quotationFunction.type": 0
}
```

**Returns:**

- `quotationRecords` (List): 记录信息列表 , 类型 `quotationRecord`

```json
{
    ...
    "quotationRecords": [
        {
            "qrid": 1,
            "orderId": "1601010001",
            "sid": 1,
            "type": 0,
            "comment": "说明"
        }
    ],
    ...
}
```

## 功能


> **类**: `api.quotation.QuotationFunctionAction`


#### 数据类型: `quotationFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qfid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点, 6: 状态 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` queryQuotationFunction

获取报价功能信息

**Requests:**

- `quotationFunction.type` (Short): 类型

```json
{
    "quotationFunction.type": 0
}
```

**Returns:**

- `quotationFunctions` (List): 功能信息列表 , 类型 `quotationFunction`

```json
{
    ...
    "quotationFunctions": [
        {
            "qfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.customer.function",
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```
