# 报表


## 装修业绩排名


> **类**: `api.report.DecorationRankAction`


#### 数据类型: `decorationRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `drid` | ID | Integer |
| `designer` | 设计师 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `depte` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `month` | 月份 , 格式 yyyymm | Integer |
| `rank` | 计算值 | Integer |
| `type` | 类型 , 0: 设计 , 1: 业务 | Short |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `decorationDepartmentRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ddrid` | ID | Integer |
| `depte` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `month` | 月份 , 格式 yyyymm | Integer |
| `rank` | 计算值 | Integer |
| `type` | 类型 , 0: 设计 , 1: 业务 | Short |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `decorationRegionRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `drrid` | ID | Integer |
| `region` | 分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `month` | 月份 , 格式 yyyymm | Integer |
| `rank` | 计算值 | Integer |
| `type` | 类型 , 0: 设计 , 1: 业务 | Short |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |
| `company` | 公司 | Integer |


##### `查询` queryDecorationRank

装修业绩排名信息

**Requests:**

- `decorationRank.type` (Short): 类型

```json
{
    "decorationRank.type": 0
}
```

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `decorationRank`

```json
{
    ...
    "ranks": [
        {
            "drid": 1,
            "region": {
                "did": 2,
                "no": "D002",
                "name": "设计一分区",
                "type": "设计大区",
            },
            "depte": {
                "did": 1,
                "no": "D001",
                "name": "设计一部",
                "type": "设计部",
            },
            "designer": {
               "uid": 1,
               "userName": "白雪",
               "currentName": "白雪",
               "duty": "设计师"
            },
            "month": 202306,
            "rank": 21293,
            "status": 0,
            "company": 1
        }
    ],
    ...
}
```


##### `查询` queryDecorationDepartmentRank

部门装修业绩排名信息

**Requests:**

- `decorationDepartmentRank.type` (Short): 类型

```json
{
    "decorationDepartmentRank.type": 0
}
```

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `decorationDepartmentRank`

```json
{
    ...
    "ranks": [
        {

            "ddrid": 1,
            "depte": {
                "did": 1,
                "no": "D001",
                "name": "设计一部",
                "type": "设计部",
            },
            "month": 202306,
            "rank": 21293,
            "status": 0,
            "company": 1
        }
    ],
    ...
}	
```


##### `查询` queryDecorationRegionRank

设计分区装修业绩排名信息

**Requests:**

- `decorationRegionRank.type` (Short): 类型

```json
{
    "decorationRegionRank.type": 0
}
```

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `decorationRegionRank`

```json
{
    ...
    "ranks": [
        {
            "drrid": 1,
            "region": {
                "did": 2,
                "no": "D002",
                "name": "设计一分区",
                "type": "设计大区",
            },
            "month": 202306,
            "rank": 21293,
            "status": 0,
            "company": 1
        }
    ],
    ...
}
```

## 主材业绩排名


> **类**: `api.report.MaterialRankAction`


#### 数据类型: `materialDesignerRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mdrId` | ID | Integer |
| `designerId` | 设计师编号 | String |
| `designerName` | 设计师名 | String |
| `createTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `rank` | 计算值 | Double |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |


#### 数据类型: `materialDesignerDepartmentRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mddrid` | ID | Integer |
| `designerDeptId` | 设计部编号 | String |
| `designerDeptName` | 设计部名 | String |
| `createTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `rank` | 计算值 | Double |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |


#### 数据类型: `materialDesignerRegionRank`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mdrrid` | ID | Integer |
| `designerRegionId` | 设计分区编号 | String |
| `designerRegionName` | 设计分区名 | String |
| `createTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `rank` | 计算值 | Double |
| `status` | 状态 , 包括: 0: 初始 , 1: 失效 | Short |


##### `查询` queryMaterialDesignerRank

设计师主材业绩排名

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerRank`

```json
{
    ...
    "ranks": [
        {
            "mdrId": 1
            "designerId": "FL-0001",
            "designerName": "白雪",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` queryMaterialDesignerDepartmentRank

设计部主材业绩排名

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerDepartmentRank`

```json
{
    ...
    "ranks": [
        {

            "mddrId": 1
            "designerDeptId": "FL_DD_01",
            "designerDeptName": "设计一部",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` queryMaterialDesignerRegionRank

设计分区主材业绩排名

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerRegionRank`

```json
{
    ...
    "ranks": [
        {
            "mdrrId": 1
            "designerRegionId": "FL_DD_01",
            "designerRegionName": "设计一分区",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` materialDesignerRank

设计师主材业绩排名TOP10

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerRank`

```json
{
    ...
    "ranks": [
        {
            "mdrId": 1
            "designerId": "FL-0001",
            "designerName": "白雪",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` materialDesignerDepartmentRank

设计主材业绩排名TOP10

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerDepartmentRank`

```json
{
    ...
    "ranks": [
        {

            "mddrId": 1
            "designerDeptId": "FL_DD_01",
            "designerDeptName": "设计一部",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` materialDesignerRegionRank

设计分区主材业绩排名TOP10

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDesignerRegionRank`

```json
{
    ...
    "ranks": [
        {
            "mdrrId": 1
            "designerRegionId": "FL_DD_01",
            "designerRegionName": "设计一分区",
            "createTime": "2017-09-06",
            "endTime": "2017-09-06",
            "rank": 21293,
            "status": 0
        }
    ],
    ...
}
```

## 主材业绩统计


> **类**: `api.report.MaterialReportAction`


#### 数据类型: `materialDepartmentCount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mdcId` | ID | Integer |
| `materialDeptId` | 主材部编号 | String |
| `createTime` | 开始时间 | String |
| `total` | 统计值 | Float |


#### 数据类型: `materialDesignerCount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mdcId` | ID | Integer |
| `designerId` | 设计师编号 | String |
| `designerName` | 设计师 | String |
| `designerDepartmentId` | 设计部编号 | String |
| `designerDepartmentName` | 设计部名 |  |
| `designerRegionId` | 设计分区编号 | String |
| `designerRegionName` | 设计分区名 | String |
| `createTime` | 开始时间 | String |
| `total` | 统计值 | Float |


#### 数据类型: `materialDesignerDepartmentCount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mddcId` | ID | Integer |
| `designerDepartmentId` | 设计部编号 | String |
| `designerDepartmentName` | 设计部名 |  |
| `designerRegionId` | 设计分区编号 | String |
| `designerRegionName` | 设计分区名 | String |
| `createTime` | 开始时间 | String |
| `total` | 统计值 | Float |


#### 数据类型: `materialDesignerRegionCount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mdrcId` | ID | Integer |
| `designerRegionId` | 设计分区编号 | String |
| `designerRegionName` | 设计分区名 | String |
| `createTime` | 开始时间 | String |
| `total` | 统计值 | Float |


##### `查询` materialDepartmentReport

查询全部主材部门业绩统计信息

**Returns:**

- `ranks` (List): 排名信息列表 , 每条数据类型 `materialDepartmentCount`

```json
{
    ...
    "materialDepartmentCounts": [
        {
            "mdcId": 1,
            "materialDept": "FL_MD_01",
```

"createTime":"2015-03-11",

"total": 283736

}

],

}


##### `查询` designerReport

设计师主材业绩统计信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}
```

**Returns:**

- `designers` (List): 排名信息列表 , 每条数据类型 `materialDesignerCount`

```json
{
    ...
    "designers": [
        {
            "mdcId": 1,
            "designerId": "U_00001",
            "designerName": "12",
            "designerDepartmentId": "FL_DD_01",
            "designerDepartmentName": "大东分公司",
            "designerRegionId": "FL_DR_01",
            "designerRegionName": "设计一分区"
```

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` designerDeportmentReport

设计部主材业绩统计信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}
```

**Returns:**

- `designerDepartments` (List): 排名信息列表 , 每条数据类型 `materialDesignerDepartmentCount`

```json
{
    ...
    "designerDepartments": [
        {
            "mddcId": 1,
            "designerDepartmentId": "FL_DD_01",
            "designerDepartmentName": "大东分公司",
            "designerRegionId": "FL_DR_01",
            "designerRegionName": "设计一分区"
```

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` designerRegionReport

设计分区主材业绩统计信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}        
```

**Returns:**

- `designerRegions` (List): 排名信息列表 , 每条数据类型 `materialDesignerRegionCount`

```json
{
    ...
    "designerRegions": [
        {
            "mdrcId": 1,
            "designerRegionId": "FL_DR_01",
            "designerRegionName": "设计一分区"
```

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` countDesigner

统计设计师主材业绩信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}
```

**Returns:**

- `designers` (List): 排名信息列表 , 每条数据类型 `materialDesignerCount`

```json
{
    ...
    "designers": [
        {
```

"mdcId": 1,

"designerId": "U_00001",

"designerName": "12",

"designerDepartmentId": "FL_DD_01",

"designerDepartmentName": "大东分公司",

"designerRegionId": "FL_DR_01",

"designerRegionName": "设计一分区"

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` countDesignerDepartment

统计设计部门主材绩信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}
```

**Returns:**

- `designerDepartments` (List): 排名信息列表 , 每条数据类型 `materialDesignerDepartmentCount`

```json
{
    ...
    "designerDepartments": [
        {
            "mddcId": 1,
            "designerDepartmentId": "FL_DD_01",
            "designerDepartmentName": "大东分公司",
            "designerRegionId": "FL_DR_01",
            "designerRegionName": "设计一分区"
```

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` countDesignerRegion

统计设计分区主材业绩信息

**Requests:**

- `reportType` (Integer): 报表类型

```json
{
    reportType: 1
}        
```

**Returns:**

- `designerRegions` (List): 排名信息列表 , 每条数据类型 `materialDesignerRegionCount`

```json
{
    ...
    "designerRegions": [
        {
            "mdrcId": 1,
            "designerRegionId": "FL_DR_01",
            "designerRegionName": "设计一分区"
```

"createTime": "2015-05-25"

"total": 2360

}

],

}


##### `查询` queryRankForPlace

查询设计师排名信息 , 分为装修和主材 , 统计方式为汇总业绩以及排名信息

**Returns:**

- `decorationRank` (String): 装修业绩
- `decorationPlace` (String): 装修排名
- `materialRank` (String): 主材业绩
- `materialPlace` (String): 主材排名

```json
{
    ...

    "decorationPlace": "2"
    "decorationRank": "151249.0"
    "materialPlace": "2"
    "materialRank": "1655621.139974594"
    ...
}
```

## 装修工程进度统计


> **类**: `api.report.DecorationReportAction`


#### 数据类型: `decoration7Construction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dcid` | ID | Long |
| `company` | 公司 | String |
| `cs0` | 未开工 | Integer |
| `cs1` | 已开工 | Integer |
| `cs2` | 已完工 | Integer |
| `cs3` | 砌墙 | Integer |
| `cs4` | 铲大白 | Integer |
| `cs5` | 放线 | Integer |
| `cs6` | 水暖 | Integer |
| `cs7` | 力工 | Integer |
| `cs8` | 电工 | Integer |
| `cs9` | 瓦工 | Integer |
| `cs10` | 地面找平 | Integer |
| `cs11` | 木工 | Integer |
| `cs12` | 油工 | Integer |
| `cs13` | 水电验收 | Integer |
| `cs14` | 保洁 | Integer |


##### `查询` queryDecoration7Construction

查询装修工程进度统计信息

**Returns:**

- `decoration7Constructions` (String): 装修工程状态信息列表 , 每条数据类型 `decoration7Construction`

```json
{
    ...

    "decoration7Constructions": [
        {
            "company": "公司",
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0,
            "cs5": 0,
            "cs6": 0,
            "cs7": 0,
            "cs8": 0,
            "cs9": 0,
            "cs10": 0,
            "cs11": 0,
            "cs12": 0,
            "cs13": 0,
            "cs14": 0
        }
    ]
    ...
}
```


##### `查询` updateDecoration7Construction

## 装修业绩统计


> **类**: `api.report.DecorationReportAction`


#### 数据类型: `decoration7Achievement`

| 参数 | 说明 | 类型 |
|------|------|------|
| `daid` | ID | Long |
| `department` | 部门, 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `year` | 年份 | Integer |
| `month` | 月份 | Integer |
| `cs0` | 签单数 | Long |
| `cs1` | 设计数 | Long |
| `cs2` | 签单额 | Long |
| `cs3` | 净业绩 | Long |
| `cs4` | 设计额 | Long |
| `cs5` | 服务费 | Long |
| `company` | 公司 | Integer |


##### `查询` queryDecoration7Achievement

查询装修业绩进度统计信息

**Returns:**

- `decoration7Achievements` (List): 装修业绩信息列表 , 每条数据类型 `decoration7Achievement`

```json
{
    ...

    "decoration7Achievements": [
        {
            "daid": 1,
            "department": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
            },
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0,
            "cs5": 0
        }
    ]
    ...
}
```


##### `查询` updateDecoration7Achievement

## 销售业绩统计


> **类**: `api.report.SalesReportAction`


#### 数据类型: `sales7Achievement`

| 参数 | 说明 | 类型 |
|------|------|------|
| `said` | ID | Long |
| `department` | 部门, 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `year` | 年份 | Integer |
| `month` | 月份 | Integer |
| `cs0` | 销售单数 | Long |
| `cs1` | 定金总额 | Long |
| `cs2` | 补款总额 | Long |
| `cs3` | 补款数 | Long |
| `cs4` | 退货单数 | Long |
| `cs5` | 退货总额 | Long |
| `cs6` | 结算单数 | Long |
| `cs7` | 结算总额 | Long |
| `company` | 公司 | Integer |


##### `查询` querySales7Achievement

查询销售业绩进度统计信息

**Returns:**

- `sales7Achievements` (List): 销售业绩信息列表 , 每条数据类型 `sales7Achievement`

```json
{
    ...

    "sales7Achievements": [
        {
            "said": 1,
            "department": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
            },
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0,
            "cs5": 0,
            "cs6": 0,
            "cs7": 0
        }
    ]
    ...
}
```

## 工程状态统计


> **类**: `api.report.ConstructionReportAction`


#### 数据类型: `construction7Achievement`

| 参数 | 说明 | 类型 |
|------|------|------|
| `caid` | ID | Long |
| `year` | 年份 | Integer |
| `month` | 月份 | Integer |
| `cs0` | 未开工数 | Long |
| `cs1` | 开工数 | Long |
| `cs2` | 完工数 | Long |
| `cs3` | 铲大白 | Integer |
| `cs4` | 放线 | Integer |
| `cs5` | 水暖 | Integer |
| `cs6` | 力工 | Integer |
| `cs7` | 电工 | Integer |
| `cs8` | 瓦工 | Integer |
| `cs9` | 地面找平 | Integer |
| `cs10` | 木工 | Integer |
| `cs11` | 油工 | Integer |
| `cs12` | 水电验收 | Integer |
| `cs13` | 保洁 | Integer |
| `company` | 公司 | Integer |


##### `查询` queryConstruction7Achievement

查询工程状态进度统计信息

**Returns:**

- `construction7Achievements` (List): 工程状态信息列表 , 每条数据类型 `construction7Achievement`

```json
{
    ...

    "construction7Achievements": [
        {
            "said": 1,
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0,
            "cs5": 0,
            "cs6": 0,
            "cs7": 0,
            "cs8": 0,
            "cs9": 0,
            "cs10": 0,
            "cs11": 0,
            "cs12": 0,
            "cs13": 0
        }
    ]
    ...
}
```

## 人资状态统计


> **类**: `api.report.UserReportAction`


#### 数据类型: `user7Achievement`

| 参数 | 说明 | 类型 |
|------|------|------|


在职总数/离职总数/入职人数/离职人数/调职人数/

:param uaid: ID
:type uaid: Long
:param year: 年份
:type year: Integer
:param month: 月份
:type month: Integer
:param cs0: 总数
:type cs0: Long
:param cs1: 在职总数
:type cs1: Long
:param cs2: 离职总数
:type cs2: Long
:param cs3: 入职人数
:type cs3: Long
:param cs4: 离职人数
:type cs4: Long
:param cs5: 调职人数
:type cs5: Long
:param company: 公司
:type company: Integer


##### `查询` queryUser7Achievement

查询人资状态统计信息

**Returns:**

- `user7Achievements` (List): 人资状态信息列表 , 每条数据类型 `user7Achievement`

```json
{
    ...

    "user7Achievements": [
        {
            "uaid": 1,
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0,
            "cs5": 0
        }
    ]
    ...
}
```

## 审批状态统计


> **类**: `api.report.ApprovalReportAction`


#### 数据类型: `approval7Achievement`

| 参数 | 说明 | 类型 |
|------|------|------|


总数/创建数量/未处理数量/通过数量/驳回数量

:param aaid: ID
:type aaid: Long
:param year: 年份
:type year: Integer
:param month: 月份
:type month: Integer
:param type: 类型
:type type: Short
:param cs0: 总数
:type cs0: Long
:param cs1: 创建数量
:type cs1: Long
:param cs2: 未处理数量
:type cs2: Long
:param cs3: 通过数量
:type cs3: Long
:param cs4: 驳回数量
:type cs4: Long
:param company: 公司
:type company: Integer


##### `查询` queryApproval7Achievement

查询审批状态进度统计信息

**Returns:**

- `approval7Achievements` (List): 审批状态信息列表 , 每条数据类型 `approval7Achievement`

```json
{
    ...

    "approval7Achievements": [
        {
            "said": 1,
            "type": 0,
            "cs0": 0,
            "cs1": 0,
            "cs2": 0,
            "cs3": 0,
            "cs4": 0
        }
    ]
    ...
}
```

## 补录接口 (自动生成 2026-11-03)


> **类**: `api.report.ApprovalMetricAction`


##### `查询` queryApprovalTrend

- **接口**: `queryApprovalTrend.do`
- **方法**: `queryApprovalTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `approvalTrend` | List<MetricDualTrendVO> |

##### `查询` queryApprovalTypeDist

- **接口**: `queryApprovalTypeDist.do`
- **方法**: `queryApprovalTypeDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `typeDist` | List<MetricPointVO> |

##### `更新` refreshApprovalMetric

- **接口**: `refreshApprovalMetric.do`
- **方法**: `refreshApprovalMetric()`


> **类**: `api.report.ConstructionMetricAction`


##### `查询` queryConstructionStartFinishTrend

- **接口**: `queryConstructionStartFinishTrend.do`
- **方法**: `queryConstructionStartFinishTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `startFinishTrend` | List<MetricDualTrendVO> |

##### `查询` queryConstructionPeriodTrend

- **接口**: `queryConstructionPeriodTrend.do`
- **方法**: `queryConstructionPeriodTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `periodTrend` | List<MetricDualTrendVO> |

##### `查询` queryConstructionOverdueDist

- **接口**: `queryConstructionOverdueDist.do`
- **方法**: `queryConstructionOverdueDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `overdueDist` | List<MetricPointVO> |

##### `更新` refreshConstructionMetric

- **接口**: `refreshConstructionMetric.do`
- **方法**: `refreshConstructionMetric()`


> **类**: `api.report.CustomerMetricAction`


##### `查询` queryCustomerFunnelTrend

- **接口**: `queryCustomerFunnelTrend.do`
- **方法**: `queryCustomerFunnelTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `funnelTrend` | List<MetricDualTrendVO> |

##### `查询` queryCustomerSourceDist

- **接口**: `queryCustomerSourceDist.do`
- **方法**: `queryCustomerSourceDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `sourceDist` | List<MetricPointVO> |

##### `查询` queryCustomerConvertTrend

- **接口**: `queryCustomerConvertTrend.do`
- **方法**: `queryCustomerConvertTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `convertTrend` | List<MetricPointVO> |

##### `更新` refreshCustomerMetric

- **接口**: `refreshCustomerMetric.do`
- **方法**: `refreshCustomerMetric()`


> **类**: `api.report.DecorationMetricAction`


##### `查询` queryDecorationFunnel

- **接口**: `queryDecorationFunnel.do`
- **方法**: `queryDecorationFunnel()`

**出参:**

| 字段 | 类型 |
|------|------|
| `funnel` | List<MetricPointVO> |

##### `查询` queryDecorationStatusDist

- **接口**: `queryDecorationStatusDist.do`
- **方法**: `queryDecorationStatusDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `statusDist` | List<MetricPointVO> |

##### `查询` queryDecorationSignTrend

- **接口**: `queryDecorationSignTrend.do`
- **方法**: `queryDecorationSignTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `signTrend` | List<MetricTrendVO> |

##### `查询` queryDecorationTypeDist

- **接口**: `queryDecorationTypeDist.do`
- **方法**: `queryDecorationTypeDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `typeDist` | List<MetricPointVO> |

##### `更新` refreshDecorationMetric

- **接口**: `refreshDecorationMetric.do`
- **方法**: `refreshDecorationMetric()`


> **类**: `api.report.DecorationRankAction`


##### `更新` decorationRank

- **接口**: `decorationRank.do`
- **方法**: `decorationDesignerRank()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `decorationRank` | DecorationRankVO |  |

##### `更新` decorationDepartmentRank

- **接口**: `decorationDepartmentRank.do`
- **方法**: `decorationDesignerDepartmentRank()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `decorationDepartmentRank` | DecorationDepartmentRankVO |  |

##### `更新` decorationRegionRank

- **接口**: `decorationRegionRank.do`
- **方法**: `decorationRegionRank()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `decorationRegionRank` | DecorationRegionRankVO |  |


> **类**: `api.report.FundsMetricAction`


##### `查询` queryFundsTrend

- **接口**: `queryFundsTrend.do`
- **方法**: `queryFundsTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `fundsTrend` | List<FundsTrendVO> |

##### `更新` refreshFundsMetric

- **接口**: `refreshFundsMetric.do`
- **方法**: `refreshFundsMetric()`


> **类**: `api.report.InventoryMetricAction`


##### `查询` queryInventoryInOutTrend

- **接口**: `queryInventoryInOutTrend.do`
- **方法**: `queryInventoryInOutTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `inOutTrend` | List<MetricDualTrendVO> |

##### `查询` queryInventoryTypeDist

- **接口**: `queryInventoryTypeDist.do`
- **方法**: `queryInventoryTypeDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `typeDist` | List<MetricPointVO> |

##### `更新` refreshInventoryMetric

- **接口**: `refreshInventoryMetric.do`
- **方法**: `refreshInventoryMetric()`


> **类**: `api.report.PanoramaMetricAction`


##### `查询` queryOrderPanorama

- **接口**: `queryOrderPanorama.do`
- **方法**: `queryOrderPanorama()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `orderId` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `panorama` | OrderPanoramaVO |


> **类**: `api.report.PaymentMetricAction`


##### `查询` queryPaymentTrend

- **接口**: `queryPaymentTrend.do`
- **方法**: `queryPaymentTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `collectTrend` | List<MetricTrendVO> |
| `refundTrend` | List<MetricTrendVO> |
| `netTrend` | List<MetricTrendVO> |

##### `查询` queryPaymentTypeDist

- **接口**: `queryPaymentTypeDist.do`
- **方法**: `queryPaymentTypeDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `paymentTypeDist` | List<MetricPointVO> |

##### `更新` refreshPaymentMetric

- **接口**: `refreshPaymentMetric.do`
- **方法**: `refreshPaymentMetric()`


> **类**: `api.report.QuotationMetricAction`


##### `查询` queryQuotationSignTrend

- **接口**: `queryQuotationSignTrend.do`
- **方法**: `queryQuotationSignTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `quotationSignTrend` | List<MetricDualTrendVO> |

##### `更新` refreshQuotationMetric

- **接口**: `refreshQuotationMetric.do`
- **方法**: `refreshQuotationMetric()`


> **类**: `api.report.QuotationRankAction`


##### `更新` rankAddReduce

- **接口**: `rankAddReduce.do`
- **方法**: `rankAddReduce()`

**出参:**

| 字段 | 类型 |
|------|------|
| `addReduceRankVOs` | List<AddReduceRankVO> |


> **类**: `api.report.SalaryMetricAction`


##### `查询` querySalaryMetricTrend

- **接口**: `querySalaryMetricTrend.do`
- **方法**: `querySalaryMetricTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `salaryTrend` | List<MetricDualTrendVO> |

##### `查询` querySalaryWorkerTypeDist

- **接口**: `querySalaryWorkerTypeDist.do`
- **方法**: `querySalaryWorkerTypeDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `workerTypeDist` | List<MetricPointVO> |

##### `更新` refreshSalaryMetric

- **接口**: `refreshSalaryMetric.do`
- **方法**: `refreshSalaryMetric()`


> **类**: `api.report.SalesMetricAction`


##### `查询` querySalesTrend

- **接口**: `querySalesTrend.do`
- **方法**: `querySalesTrend()`

**出参:**

| 字段 | 类型 |
|------|------|
| `salesTrend` | List<MetricDualTrendVO> |

##### `查询` querySalesCategoryDist

- **接口**: `querySalesCategoryDist.do`
- **方法**: `querySalesCategoryDist()`

**出参:**

| 字段 | 类型 |
|------|------|
| `categoryDist` | List<MetricPointVO> |

##### `更新` refreshSalesMetric

- **接口**: `refreshSalesMetric.do`
- **方法**: `refreshSalesMetric()`

