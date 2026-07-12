# 工程


## 放线


放线信息管理


> **类**: `api.drawline.DrawLineAction`


#### 数据类型: `drawLine`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dlid` | 放线信息ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `applayTime` | 申请时间 | Timestamp |
| `content` | 说明 | String |
| `actualTime` | 放线时间 | Long |
| `startTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `status` | 状态 , 0: 排队, 1: 申请, 2: 成功, 3: 失败 | Short |
| `count` | 申请次数 | Short |
| `appler` | 申请人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `group` | 放线小组 , 类型 [drawlineGroup ](./data.html#api.data.DrawlineGroup.drawlineGroup) | Object |
| `drawer` | 放线人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `company` | 公司ID | Long |


:param orderId: 装修单号
:type orderId: String
:param status: 状态
:type status: String
:param designerId: 设计师编号
:type designerId: String
:param salesmanId: 业务员编号
:type salesmanId: String
:param village: 楼盘名
:type village: String
:param villageId: 楼盘编号
:type villageId: String
:param designerDepartmentId: 设计部编号
:type designerDepartmentId: String
:param businessDepartmentId: 业务部编号
:type businessDepartmentId: String
:param designer: 设计师名
:type designer: String
:param salesman: 业务员名
:type salesman: String
:param businessDepartment: 业务部名称
:type businessDepartment: String
:param designerDepartment: 设计部名称
:type designerDepartment: String
:param actualDate: 放线时间 , 例: 2016-01-01
:type actualDate: String


##### `查询` pageDrawLine

分页方式获取放线信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 放线信息列表 , 每条数据类型 `drawLine`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "dlid": 3,
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
                    },
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

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "actualDate": "2016-01-01",
                "startTime": "11:19",
                "endTime": "16:19",
                "applayTime": "2016-01-01",
                "applayCount": 0,
                "applicant": {
                    "uid": 11,
                    "userId": "U213",
                    "userName": "宋贺",
                    "currentName": "宋贺",
                    "phone": "136xxxx2183",
                    ...
                }
                "drawLineGroup": {
                    "dgid": 1,
                    "name": "放线一组",
                    "content": "说明"
                },
                "drawer": null,
                "status": 1,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDrawLine

获取放线信息 , 条件参数传递方式参照 [filter ](../check_rule.html#filter)

**Returns:**

- `drawLines` (List): 放线信息列表 , 每条数据类型 `drawLine`

```json
{
    ...
    "drawLines": [
        {
            {
                "dlid": 3,
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
                    },
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

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "actualDate": "2016-01-01",
                "startTime": "11:19",
                "endTime": "16:19",
                "applayTime": "2016-01-01",
                "applayCount": 0,
                "applicant": {
                    "uid": 11,
                    "userId": "U213",
                    "userName": "宋贺",
                    "currentName": "宋贺",
                    "phone": "136xxxx2183",
                    ...
                }
                "drawLineGroup": {
                    "dgid": 1,
                    "name": "放线一组",
                    "content": "说明"
                },
                "drawer": null,
                "status": 1,
                "comment": "说明"
            }
        }
    ],
    ...
}
```


##### `查询` countDrawLine

通过时间范围获取放线信息数量

**Requests:**

- `drawLine.startTime` (String): 开始时间
- `drawLine.endTime` (String): 结束时间

```json
{
    "drawLine.startTime": "2016-01-01 00:00:00",
    "drawLine.endTime": "2016-01-01 23:59:59"
}
```

**Returns:**

- `drawLines` (Map): 放线数量信息列表 , 每条数据类型 Map<String, Integer>

```json
{
    ...
    "drawLineDateCount": {
        "2016-07-09": {
            "放线一组": 1
        },
        "2016-07-10": {
            "放线一组": 2,
            "放线二组": 1
        },
    },
    ...
}
```


##### `查询` applayDrawLine

申请放线 , 同时生成工程信息 , 更新房产信息

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单关联放线是否存在 , 如果存在 , 错误信息 **120013 已经在队列中,不可重复提交**

判断工程单是否存在 , 不存在生成工程单信息

利用装修单中面积信息 , 获取工程成本 , 同时更新工程单工费和辅料上限

获取辅料项需要控制项目 , 生成工程辅料相关信息

**Requests:**

- `drawLine.decoration.orderId` (String): 装修单号
- `drawLine.decoration.conpany` (Integer): 工程公司
- `drawLine.applayTime` (String): 申请时间
- `drawLine.comment` (String): 说明信息

```json
{
    "drawLine.decoration.orderId": "1601010001",
    "drawLine.decoration.conpany": 1,
    "drawLine.applayTime": "2016-01-01 23:59:59",
    "drawLine.comment": "说明"
}
```


##### `查询` updateDrawLine

更新放线信息

判断放线信息是否存在 , 不存在 , 错误信息 **120014 不存在该放线信息**

**Requests:**

- `drawLine.dlid` (Long): 放线信息ID

```json
{
    "drawLine.dlid": 1
}
```


##### `查询` resetDrawLine

重置放线 , 重新设置相关信息

**Requests:**

- `drawLine.dlid` (Long): 放线信息ID
- `drawLine.actualDate` (String): 放线日期
- `drawLine.startTime` (String): 开始时间
- `drawLine.endTime` (String): 结束时间
- `drawLine.drawLineGroup.dgid` (Long): 放线小组ID

```json
{
    "drawLine.dlid": 1,
    "drawLine.actualDate": "2016-01-01"
    "drawLine.startTime": "00:00:00",
    "drawLine.endTime": "23:59:59",
    "drawLine.comment": "说明",
    "drawLine.drawLineGroup.dgid": 1,
}
```


##### `查询` successDrawLine

放线成功

判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**

判断放线信息状态为1(申请) , 其他状态 , 错误信息 **120017 订单放线状态错误**

判断工程信息是否存在 , 不存在 , 错误信息 **120020 工程信息不存在**

**Requests:**

- `drawLine.dlid` (Long): 放线信息ID

```json
{
    "drawLine.dlid": 1,

    "constructionNode[0].sort": 3,
    "constructionNode[0].timeLimit": 10
}
```


##### `查询` failureDrawLine

放线失败

判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**

**Requests:**

- `drawLine.dlid` (Long): 放线信息ID

```json
{
    "drawLine.dlid": 1,
}
```

## 工程单


工程信息 , 订单整体功能相关信息


> **类**: `api.construction.ConstructionAction`


#### 数据类型: `construction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 工程单ID | Integer |
| `orderId` | 装修单号 | String |
| `supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `locker` | 锁定人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `schedule` | 施工进度 | Short |
| `createTime` | 创建时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `lockTime` | 锁定时间 | Timestamp |
| `accessory` | 辅料控制 , 0: 开放 , 1: 锁定 | Short |
| `accessoryLimit` | 辅料额上限 | Long |
| `salaryLimit` | 工费额上限 | Long |
| `accessoryTotal` | 辅料总额 | Long |
| `salaryTotal` | 工费总额 | Long |


:param orderId: 装修单号
:type orderId: String
:param status: 状态
:type status: String
:param designerId: 设计师编号
:type designerId: String
:param salesmanId: 业务员编号
:type salesmanId: String
:param village: 楼盘名
:type village: String
:param villageId: 楼盘编号
:type villageId: String
:param designer: 设计师名
:type designer: String
:param salesman: 业务员名
:type salesman: String
:param supervisor: 监理名
:type supervisor: String
:param houseNumber: 楼号
:type houseNumber: String
:param schedule: 施工进度
:type schedule: Short
:param projectStatus: 工程状态 , 包括: 未完工 , 已完工
:type projectStatus: String


##### `查询` pageConstruction

分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration)

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


##### `查询` pageConstructionForBase

分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration)

```json
{
    ...
    "paging": {
        ...
        "data": [
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
            },
            "supervisor": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "schedule": 3,
            "accessory": 0,
            "locker": {
                "id": 1,
                "no": "1501010001",
                "name": "李",
            },
            "lockTime": "2016-01-01 00:00:00",
            "accessoryLimit": 0,
            "salaryLimit": 0,
            "accessoryTotal": 0,
            "salaryTotal": 0
        ],
        ...
    },
    ...
}
```


##### `查询` pageConstructionForSupervision

分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

针对监理职位对返回装修单信息进行控制

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration)

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


##### `查询` pageConstructionForQualiter

分页方式获取质检对应装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration)

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


##### `查询` pageConstructionForAcceptance

分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

返回所有需要进行验收状态的装修单信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修单信息列表 , 每条数据类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration)

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


##### `查询` queryConstructionByOrderId

通过装修单号获取工程信息

**Requests:**

- `construction.orderId` (String): 装修单号

```json
{
    "construction.orderId": "1601010001"
}
```

**Returns:**

- `construction` (Object): 工程信息 , 类型 `construction`

```json
{
    ...
    "construction":{
        "cid": 4,
        "orderId": "1601010001",
        "schedule": 3,
        "supervisor": {
            "uid": 1,
            "userId": "FL-02381",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        }
     },
    ...
}
```


##### `查询` updateConstructionByOrderId

通过装修单号更新工程单

判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**Requests:**

- `construction.orderId` (String): 装修单号
- `construction.supervisor.userId` (String): 监理编号
- `construction.decoration.conpany` (Integer): 工程公司

```json
{
    "construction.orderId": "1601010001",
    "construction.supervisor.userId": "U0479",
    "construction.decoration.conpany": 1,

    "qualiters[0].uid": 1
}
```


##### `查询` updateConstructionForAdvance

更新工程单信息 , 包括: 辅料额上限和工费额上限

判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**Requests:**

- `construction.cid` (Long): 工程单ID
- `construction.accessoryLimit` (Long): 辅料额上限
- `construction.salaryLimit` (Long): 工费额上限

```json
{
    "construction.cid": 1,
    "construction.accessoryLimit": 10000000,
    "construction.salaryLimit": 10000000,
}
```


##### `查询` openAccessory

开放辅料单

判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**Requests:**

- `construction.cid` (Long): 工程单ID

```json
{
    "construction.cid": 1
}
```


##### `查询` lockAccessory

锁定辅料单

判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**Requests:**

- `construction.cid` (Long): 工程单ID

```json
{
    "construction.cid": 1
}
```

## 工程环节


工程阶段相关信息管理


> **类**: `api.construction.ConstructionScheduleAction`


#### 数据类型: `constructionSchedule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csid` | 工程环节ID | Long |
| `cid` | 工程单ID | Long |
| `orderId` | 装修单号 | String |
| `enterTime` | 进场时间 | Timestamp |
| `leaveTime` | 出场时间 | Timestamp |
| `startTime` | 开工时间 | Timestamp |
| `endTime` | 完工时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 开工 , 2: 完工 | Short |
| `workStatus` | 工作状态 , 0: 初始 , 1: 进场 , 2: 出场 | Short |
| `checkout` | 验证款项 , 0: 验证 , 1: 通过 | Short |
| `schedule` | 工程进度 | Short |
| `node` | 工程节点 , 类型 [constructionNode ](./data.html#api.data.ConstructionNodeAction.constructionNode) | Object |


##### `查询` pageConstructionSchedule

分页方式获施工节点信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 施工节点信息列表 , 每条数据类型 `constructionSchedule`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csid": 1,
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
                "construction": {
                    "cid": 1,
                    "supervisor": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "schedule": 3,
                    "accessory": 0,
                    "locker": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "lockTime": "2016-01-01 00:00:00",
                    "accessoryLimit": 0,
                    "salaryLimit": 0,
                    "accessoryTotal": 0,
                    "salaryTotal": 0
                },
                "startTime": "2016-01-01",
                "endTime": "2016-01-01",
                "status": 1,
                "schedule": 1
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryConstructionScheduleByOrderId

通过装修单号获取工程环节信息

**Requests:**

- `constructionSchedule.orderId` (String): 装修单号

```json
{
    "constructionSchedule.orderId": "1601010001"
}
```

**Returns:**

- `constructionSchedules` (List): 工程环节信息列表 , 每条数据类型 `constructionSchedule`

```json
{
    ...
    "constructionSchedules": [
        {
            "csid": 3,
            "cid": 4,
            "orderId": "1601010001",
            "startTime": "2016-01-01",
            "endTime": "2016-01-01",
            "status": 1,
            "schedule": 1,
            "node": {
                "cnid": 1,
                "name": "铲大白",
                "sort": 1
            }
        },
    ]
    ...
}
```


##### `查询` queryConstructionScheduleByCid

通过工程单ID获取工程环节信息

**Requests:**

- `constructionSchedule.cid` (Long): 工程单ID

```json
{
    "constructionSchedule.cid": 1
}
```

**Returns:**

- `constructionSchedules` (List): 工程环节信息列表 , 每条数据类型 `constructionSchedule`

```json
{
    ...
    "constructionSchedules": [
        {
            "csid": 3,
            "cid": 4,
            "orderId": "1601010001",
            "startTime": "2016-01-01",
            "endTime": "2016-01-01",
            "status": 1,
            "schedule": 1,
            "node": {
                "cnid": 1,
                "name": "铲大白",
                "sort": 1
            }
        },
    ]
    ...
}
```


##### `查询` queryConstructionScheduleByOrderIdASchedule

通过装修单号获取工程环节信息

**Requests:**

- `constructionSchedule.orderId` (String): 装修单号
- `constructionSchedule.schedule` (Short): 进度

```json
{
    "constructionSchedule.orderId": "1601010001",
    "constructionSchedule.schedule": 3
}
```

**Returns:**

- `constructionSchedule` (Object): 工程环节 , 类型 `constructionSchedule`

```json
{
    ...
    "constructionSchedule": {
        "csid": 3,
        "cid": 4,
        "orderId": "1601010001",
        "startTime": "2016-01-01",
        "endTime": "2016-01-01",
        "status": 1,
        "schedule": 1
    },
    ...
}
```


##### `查询` enterConstructionSchedule

进场

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

工程环节工作状态更新为1(进场) , 进场时间更新为当前时间

**Requests:**

- `constructionSchedule.csid` (Long): 工程环节ID

```json
{
    "constructionSchedule.csid": 1
}
```


##### `查询` leaveConstructionSchedule

出场

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

工程环节工作状态更新为2(出场) , 出场时间更新为当前时间

**Requests:**

- `constructionSchedule.csid` (Long): 工程环节ID

```json
{
    "constructionSchedule.csid": 1
}
```


##### `查询` beginConstructionSchedule

开工

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

判断工程环节状态为0(初始) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**

判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例

利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**

工程环节状态更新为1(开工) , 开工时间更新为当前时间

**Requests:**

- `constructionSchedule.csid` (Long): 工程环节ID

```json
{
    "constructionSchedule.csid": 1
}
```


##### `查询` finishConstructionSchedule

完工

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

判断工程环节状态为1(开工) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**

判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例

利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**

工程环节状态更新为2(完工) , 完工时间更新为当前时间

**Requests:**

- `constructionSchedule.csid` (Long): 工程环节ID

```json
{
    "constructionSchedule.csid": 1
}
```


##### `查询` checkoutConstructionSchedule

更新工程环节验证款项

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

**Requests:**

- `constructionSchedule.csid` (Long): 工程环节ID
- `constructionSchedule.checkout` (Short): 验证款项

```json
{
    "constructionSchedule.csid": 1,
    "constructionSchedule.startTime": 0
}
```

## 工程信息


> **类**: `api.construction.ConstructionInfoAction`


#### 数据类型: `constructionInfo`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ciid` | 信息ID | Long |
| `cid` | 工程单ID | Long |
| `orderId` | 装修单号 | String |
| `timeLimit` | 工期 | Integer |
| `ishovel` | 铲大白 , 0: 公司 , 1: 客户 | Short |
| `iskey` | 钥匙 , 0: 工程中心 , 1: 客户 | Short |
| `isCeremony` | 开工仪式 , 0: 有 , 1: 无 | Short |
| `finishTime` | 预计完工时间 | Timestamp |
| `keyTime` | 预计领钥匙时间 | Timestamp |
| `drawlineTime` | 预计放线时间 | Timestamp |
| `designTime` | 预计设计时间 | Timestamp |
| `comment` | 备注说明 | String |


##### `查询` pageConstructionInfo

分页方式获取工程信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工程信息列表 , 每条数据类型 `constructionInfo`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ciid": 1,
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
                    },
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

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "timeLimit": 90000,
                "ishovel": 0,
                "iskey": 0,
                "isCeremony": 0,
                "finishTime": "2016-01-01 00:00:00",
                "keyTime": "2016-01-01 00:00:00",
                "drawlineTime": "2016-01-01 00:00:00",
                "designTime": "2016-01-01 00:00:00",
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryConstructionInfo

通过工程单ID获取工程信息

**Requests:**

- `constructionInfo.cid` (Long): 工程单ID

```json
{
    "constructionInfo.cid": 1
}
```

**Returns:**

- `constructionInfo` (Object): 工程信息 , 类型 `constructionInfo`

```json
{
    ...
    "constructionInfo": [
        {
            "ciid": 1,
            "cid": 3,
            "orderId": "1601010001",
            "timeLimit": 90000,
            "ishovel": 0,
            "iskey": 0,
            "isCeremony": 0,
            "finishTime": "2016-01-01 00:00:00",
            "keyTime": "2016-01-01 00:00:00",
            "drawlineTime": "2016-01-01 00:00:00",
            "designTime": "2016-01-01 00:00:00",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` queryConstructionInfoByOrderId

通过装修单号获取工程信息

**Requests:**

- `constructionInfo.orderId` (String): 装修单号

```json
{
    "constructionInfo.orderId": "1601010001"
}
```

**Returns:**

- `constructionInfo` (Object): 工程信息 , 类型 `constructionInfo`

```json
{
    ...
    "constructionInfo": [
        {
            "ciid": 1,
            "cid": 3,
            "orderId": "1601010001",
            "timeLimit": 90000,
            "ishovel": 0,
            "iskey": 0,
            "isCeremony": 0,
            "finishTime": "2016-01-01 00:00:00",
            "keyTime": "2016-01-01 00:00:00",
            "drawlineTime": "2016-01-01 00:00:00",
            "designTime": "2016-01-01 00:00:00",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` updateConstructionInfo

更新工程信息

**Requests:**

- `constructionInfo.cid` (Long): 工程单ID
- `constructionInfo.timeLimit` (Integer): 工期
- `constructionInfo.ishovel` (Short): 铲大白
- `constructionInfo.iskey` (Short): 钥匙
- `constructionInfo.isCeremony` (Short): 工程仪式
- `constructionInfo.finishTime` (Timestamp): 预计完工时间
- `constructionInfo.keyTime` (Timestamp): 预计领钥匙时间
- `constructionInfo.drawlineTime` (Timestamp): 预计放线时间
- `constructionInfo.designTime` (Timestamp): 预计设计时间
- `constructionInfo.comment` (String): 说明
- `constructionInfo.decoration.house.quoteArea` (Integer): 预算面积

```json
{
    "constructionInfo.cid": 1,
    "constructionInfo.timeLimit": 90000,
    "constructionInfo.ishovel": 0,
    "constructionInfo.iskey": 0,
    "constructionInfo.isCeremony": 0,
    "constructionInfo.finishTime": "2016-01-01 00:00:00",
    "constructionInfo.keyTime": "2016-01-01 00:00:00",
    "constructionInfo.drawlineTime": "2016-01-01 00:00:00",
    "constructionInfo.designTime": "2016-01-01 00:00:00",
    "constructionInfo.comment": "说明",

    "constructionInfo.decoration.house.quoteArea": 0
}
```


##### `查询` updateConstructionInfoByOrderId

更新工程信息

通过装修单号获取对应工程信息 , 存在更新工程信息 , 不存在 , 添加工程信息

**Requests:**

- `constructionInfo.orderId` (String): 装修单号
- `constructionInfo.ishovel` (Short): 铲大白
- `constructionInfo.iskey` (Short): 钥匙
- `constructionInfo.isCeremony` (Short): 工程仪式
- `constructionInfo.finishTime` (Timestamp): 预计完工时间
- `constructionInfo.keyTime` (Timestamp): 预计领钥匙时间
- `constructionInfo.drawlineTime` (Timestamp): 预计放线时间
- `constructionInfo.designTime` (Timestamp): 预计设计时间
- `constructionInfo.comment` (String): 说明

```json
{
    "constructionInfo.orderId": "1601010001",
    "constructionInfo.timeLimit": 90000,
    "constructionInfo.ishovel": 0,
    "constructionInfo.iskey": 0,
    "constructionInfo.isCeremony": 0,
    "constructionInfo.finishTime": "2016-01-01 00:00:00",
    "constructionInfo.keyTime": "2016-01-01 00:00:00",
    "constructionInfo.drawlineTime": "2016-01-01 00:00:00",
    "constructionInfo.designTime": "2016-01-01 00:00:00",
    "constructionInfo.comment": "说明"
}
```

## 工程计划


> **类**: `api.construction.ConstructionPlanction`


#### 数据类型: `constructionPlan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 计划ID | Long |
| `cid` | 工程单ID | Long |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `createTime` | 创建时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` queryConstructionPlanByOrderId

通过装修单号获取工程计划

**Requests:**

- `constructionPlan.orderId` (String): 装修单号

```json
{
    "constructionPlan.orderId": 1
}
```

**Returns:**

- `constructionPlans` (List): 工程计划信息列表 , 类型 `constructionInfo`

```json
{
    ...
    "constructionPlans": [
        {
            "cpid": 1,
            "cid": 3,
            "orderId": "1601010001",
            "name": "计划",
            "createTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 00:00:00",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` addConstructionPlan

添加工程计划

**Requests:**

- `constructionPlan.orderId` (String): 装修单号
- `constructionPlan.name` (String): 装修单号
- `constructionPlan.startTime` (String): 装修单号
- `constructionPlan.endTime` (String): 装修单号
- `constructionPlan.comment` (String): 装修单号

```json
{
    "constructionPlan.orderId": "1601010001",
    "constructionPlan.name": "计划",
    "constructionPlan.startTime": "2016-01-01 00:00:00",
    "constructionPlan.endTime": "2016-01-01 00:00:00",
    "constructionPlan.comment": "说明",
}
```


##### `查询` deleteConstructionPlan

删除工程计划

**Requests:**

- `constructionPlan.cpid` (Long): 计划ID

```json
{
    "constructionPlan.cpid": 1
}
```

## 工程图片


工程图片 , 施工图片资源管理


> **类**: `api.construction.ConstructionDrawingAction`


#### 数据类型: `constructionDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cdid` | 图片ID | Long |
| `cid` | 工程单ID | Long |
| `name` | 图片名 | String |
| `url` | 图片路径 | String |
| `filesize` | 文件大小 | Integer |
| `invurl` | 图片路径 , 保留字段 | String |
| `type` | 类型 , 0: 本地图片 , 1: 钉钉图片 | Short |
| `schedule` | 施工进度 | Short |


##### `查询` queryConstructionDrawingByOrderId

通过装修单号获取工程图片信息

可以同过工程单ID以及施工进度获取图片信息

**Requests:**

- `construction.orderId` (String): 装修单号
- `constructionDrawing.schedule` (Short): 施工进度 , <选填>

```json
{
    "construction.orderId": "1601010001",
    "constructionDrawing.schedule": 1,
}
```

**Returns:**

- `constructionDrawings` (List): 工程图片信息列表 , 每条数据类型 `constructionDrawing`

```json
{
    ...
    "constructionDrawings": [
        {
            "cdid": 1,
            "cid": 3,
            "name": "",
            "invurl": "",
            "url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
            "filesize": 0,
            "type": 0,
            "schedule": 1
        }
    ],
    ...
}
```


##### `查询` queryConstructionDrawingByCid

获取工程图片信息

可以同过工程单ID以及施工进度获取图片信息

**Requests:**

- `constructionDrawing.cid` (Long): 工程单ID
- `constructionDrawing.schedule` (Short): 施工进度 , <选填>

```json
{
    "constructionDrawing.cid": 1,
    "constructionDrawing.schedule": 1,
}
```

**Returns:**

- `constructionDrawings` (List): 工程图片信息列表 , 每条数据类型 `constructionDrawing`

```json
{
    ...
    "constructionDrawings": [
        {
            "cdid": 1,
            "cid": 3,
            "name": "",
            "invurl": "",
            "url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
            "filesize": 0,
            "type": 0,
            "schedule": 1
        }
    ],
    ...
}
```


##### `查询` addConstructionDrawing

添加工程图片信息

**Requests:**

- `constructionDrawing.cid` (Long): 工程单ID
- `constructionDrawing.name` (String): 名称
- `constructionDrawing.url` (String): 图片路径
- `constructionDrawing.invurl` (String): 图片路径 , 保留
- `constructionDrawing.filesize` (Integer): 文件大小
- `constructionDrawing.type` (Short): 类型
- `constructionDrawing.schedule` (Short): 施工进度

```json
{
    "constructionDrawing.cid": 1,
    "constructionDrawing.name": "",
    "constructionDrawing.invurl": "",
    "constructionDrawing.url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
    "constructionDrawing.filesize": 0,
    "constructionDrawing.type": 0,
    "constructionDrawing.schedule": 1
}
```


##### `查询` addConstructionDrawings

批量工程图片信息

**Requests:**


```json
{
    "constructionDrawing[n].cid": 1,
    "constructionDrawing[n].name": "",
    "constructionDrawing[n].invurl": "",
    "constructionDrawing[n].url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
    "constructionDrawing[n].filesize": 0,
    "constructionDrawing[n].type": 0,
    "constructionDrawing[n].schedule": 1
}
```


##### `查询` deleteConstructionDrawing

删除工程图片信息

**Requests:**

- `constructionDrawing.cdid` (Long): 图片ID

```json
{
    "chanDrawing.cdid": 1
}
```

## 质检


> **类**: `api.construction.QualiterAction`


#### 数据类型: `qualiter`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qid` | 质检ID | Long |
| `cid` | 工程单ID | Integer |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `user` | 施工人员 , 类型: [user ](./user.html#api.personel.UserAction.user) | Object |
| `schedule` | 施工进度 | Short |
| `rate` | 评分 | Short |
| `assessment` | 评价 | String |
| `creater` | 创建人 , 类型: [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 | Short |


##### `查询` queryQualiter

通过装修单号获取质检信息

**Requests:**

- `qualiter.orderId` (String): 装修单号

```json
{
    "qualiter.orderId: "1601010001"
}
```

**Returns:**

- `qualiters` (List): 质检信息列表 , 每条数据类型 `qualiter`

```json
{
    ...
    "qualiters": [
        {
            "qid": 1,
            "cid" 1,
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
                },
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

                "designDepartment": "设计中心一部",
                "designRegion": "设计一分区",
                "businessDepartment": "市场营销一部",
                ...
            },
            "user": {
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
            "schedule": 1,
            "rate": 0,
            "assessment": "",
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
            "createTime": "2016-01-01 00:00:00",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addQualiter

添加质检

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**

**Requests:**

- `qualiter.decoration.orderId` (String): 装修单号
- `qualiter.user.uid` (Long): 质检ID

```json
{
    "qualiter.decoration.orderId: "1601010001",
    "qualiter.user.uid": 1
}
```


##### `查询` deleteQualiter

删除质检

**Requests:**

- `qualiter.qid` (Long): 质检ID

```json
{
    "qualiter.qid: 1
}
```

## 施工人员


工程各环节中施工人员信息管理


> **类**: `api.construction.ConstructerAction`


#### 数据类型: `constructer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `crid` | 施工人员ID | Long |
| `cid` | 工程单ID | Integer |
| `orderId` | 装修单号 | String |
| `user` | 施工人员 , 类型: [user ](./user.html#api.personel.UserAction.user) | Object |
| `schedule` | 施工进度 , 包括: 1: 铲大白 , 2: 放线 , 3: 水力电 , 4: 瓦工 , 5: 地面找平 , 6: 木工 , 7: 油工 , 8: 水电验收 , 9: 保洁 | Short |
| `salary` | 工费 | Float |
| `rate` | 评分 | Short |
| `rate1` | 评分 | Short |
| `rate2` | 评分 | Short |
| `assessment` | 评价 | String |
| `creater` | 创建人 , 类型: [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `sendTime` | 推送时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `status` | 状态 , 0: 初始, 1: 失效 , 2: 推送 , 3: 完成 | Short |


##### `查询` queryConstructerByOrderId

通过装修单号获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息

如果schedule没有传值将返回装修单号对应的所有施工人员信息

施工人员状态为初始(0)

**Requests:**

- `constructer.orderId` (String): 装修单号
- `constructer.schedule` (Short): 施工进度
- `constructer.csid` (Long): 施工进度ID

```json
{
    "constructer.orderId": "1601010001",
    "constructer.schedule": 1,
    "constructer.csid": 1
}
```

**Returns:**

- `constructers` (List): 施工人员信息列表 , 每条数据类型 `constructer`

```json
{
    ...
    "data": [
        {
            "crid": 1,
            "cid" 1,
            "orderId": "1601010001",
            "user": {
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
            "schedule": 1,
            "salary": 100.00,
            "rate": 0,
            "rate1": 0,
            "rate2": 0,
            "assessment": "",
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
            "createTime": "2016-01-01 00:00:00",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` queryConstructerByCid

通过工程单ID获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息

如果schedule没有传值将返回装修单号对应的所有施工人员信息

施工人员状态为初始(0)

**Requests:**

- `constructer.cid` (Long): 工程单ID
- `constructer.schedule` (Short): 施工进度
- `constructer.csid` (Long): 施工进度ID

```json
{
    "constructer.cid:1,
    "constructer.schedule": 1,
    "constructer.csid": 1
}
```

**Returns:**

- `constructers` (List): 施工人员信息列表 , 每条数据类型 `constructer`

```json
{
    ...
    "data": [
        {
            "crid": 1,
            "cid" 1,
            "orderId": "1601010001",
            "user": {
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
            "schedule": 1,
            "salary": 100.00,
            "rate": 0,
            "rate1": 0,
            "rate2": 0,
            "assessment": "",
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
            "createTime": "2016-01-01 00:00:00",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` queryConstructerByCrid

通过施工人员ID获取信息

**Requests:**

- `constructer.crid` (Long): 施工人员ID

```json
{
    "constructer.crid: 1
}
```

**Returns:**

- `constructer` (Object): 施工人员信息 , 类型 `constructer`

```json
{
    ...
    "constructer": {
        "crid": 1,
        "cid" 1,
        "orderId": "1601010001",
        "user": {
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
        "schedule": 1,
        "salary": 100.00,
        "rate": 0,
        "rate1": 0,
        "rate2": 0,
        "assessment": "",
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
        "createTime": "2016-01-01 00:00:00",
        "status": 0
    },
    ...
}
```


##### `查询` addConstructer

添加施工人员信息

判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

判断施工环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

判断施工环节状态是否为0(初始) , 错误信息 **120026 工程环节未开工**

判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**

判断同一工程和同一施工进度中 , 被添加的施工人员是否已经存在 , 存在添加失败 , 错误信息 **当前工人已经添加,不能重复添加同一工人**

**Requests:**

- `constructer.cid` (Long): 工程单ID
- `constructer.schedule` (Short): 施工进度
- `constructer.user.userId` (String): 施工人员编号

```json
{
    "constructer.cid:1,
    "constructer.schedule": 1,
    "constructer.user.userId": "U0001"
}
```


##### `查询` updateConstructerForRate

更新施工人员信息

判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

**Requests:**

- `constructer.crid` (Long): 施工人员ID
- `constructer.rate` (Short): 评级
- `constructer.rate1` (Short): 评级
- `constructer.rate2` (Short): 评级
- `constructer.assessment` (String): 评价

```json
{
    "constructer.cid:1,
    "constructer.rate": 5,
    "constructer.rate1": 5,
    "constructer.rate2": 5,
    "constructer.assessment": "评价信息"
}
```


##### `查询` rateConstructer

评级

判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

判断状态是否为2(推送) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**

更新状态为3(完成) , 更新完成时间

**Requests:**

- `constructer.crid` (Long): 施工人员ID
- `constructer.rate` (Short): 评级
- `constructer.rate1` (Short): 评级
- `constructer.rate2` (Short): 评级
- `constructer.assessment` (String): 评价

```json
{
    "constructer.cid:1,
    "constructer.rate": 5,
    "constructer.rate1": 5,
    "constructer.rate2": 5,
    "constructer.assessment": "评价信息"
}
```


##### `查询` sendConstructer

推送

判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

判断状态是否为0(初始) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**

更新状态为1(推送) , 更新推送时间

**Requests:**

- `constructer.crid` (Long): 施工人员ID

```json
{
    "constructer.cid:1
}
```


##### `查询` deleteConstructer

删除施工人员信息 , 更新施工人员状态为失效(1)

判断删除施工人员存在工费信息 , 存在不能删除 , 错误信息 **120023 施工人员存在工费,不可删除**

**Requests:**

- `constructer.crid` (Long): 施工人员ID

```json
{
    "constructer.crid:1
}
```

## 工程辅料


> **类**: `api.construction.ConstructionAccessoryAction`


#### 数据类型: `constructionAccessory`

| 参数 | 说明 | 类型 |
|------|------|------|
| `caid` | 工程辅料ID | Long |
| `cid` | 工程单ID | Long |
| `aoods` | 辅材 , 类型: [aoods ](./data.html#api.data.AoodsAction.aoods) | Object |
| `checkup` | 验证标识 , 0: 验证 , 1: 通过 | Short |
| `numLimit` | 数量限制 | Long |
| `num` | 数量 | Integer |
| `total` | 总额 | Long |


##### `查询` pageConstructionAccessory

分页方式获取工程辅料信息 , 根据工程单ID获取 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工程辅料信息列表 , 每条数据类型 `constructionAccessory`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "caid": 1,
                "cid": 1,
                "aoods": {
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
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
                        "workType": {
                            "id": 1,
                            "name": "瓦"
                        }
                    }
                },
                "checkup": 0,
                "numLimit": 1000000,
                "num": 1,
                "total": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addConstructionAccessory

添加工程辅料信息

判断工程单是否存在 , 不存在 , 错误信息 **120020 工程单不存在**

**Requests:**

- `constructionAccessory.cid` (Long): 工程单ID
- `constructionAccessory.aoods.aid` (Long): 辅材ID
- `constructionAccessory.checkup` (Short): 验证标识
- `constructionAccessory.numLimit` (Integer): 数量上限

```json
{
    "constructionAccessory.cid": 1,
    "constructionAccessory.aoods.aid": 1,
    "constructionAccessory.checkup": 0,
    "constructionAccessory.numLimit": 1000000
}
```


##### `查询` updateConstructionAccessory

更新工程辅料信息

**Requests:**

- `constructionAccessory.caid` (Long): 工程辅料ID
- `constructionAccessory.checkup` (Short): 验证标识
- `constructionAccessory.numLimit` (Integer): 数量上限

```json
{
    "constructionAccessory.caid": 1,
    "constructionAccessory.checkup": 0,
    "constructionAccessory.numLimit": 1000000
}
```

## 返工


返工信息管理


> **类**: `api.construction.ReworkAction`


#### 数据类型: `rework`

| 参数 | 说明 | 类型 |
|------|------|------|


工程返工信息

:param rwId: 返工信息ID
:type rwId: Long
:param orderId: 装修单号
:type orderId: String
:param createrId: 创建人员编号
:type createrId: String
:param createrName: 创建人员名称
:type createrName: String
:param createTime: 创建时间
:type createTime: String
:param reworkDes: 说明
:type reworkDes: String


#### 数据类型: `reworkDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|


返工图片信息

:param rwdId: 返工图片ID
:type rwdId: Long
:param rwId: 返工信息ID
:type rwId: Long
:param rwdName: 名称
:type rwdName: String
:param rwdUrl: 路径
:type rwdUrl: String
:param rwdAddUrl: 路径 , 保留字段
:type rwdAddUrl: String


##### `查询` pageReworkByOrderId

分页方式通过装修单号获取返工信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 返工信息列表 , 每条数据类型 `rework`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "createTime": "2016-01-01",
                "createrId": "U2037",
                "createrName": "陈维",
                "orderId": "1601010001",
                "reworkDes": "说明",
                "rwId": 3
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addRework

添加返工信息

**Requests:**

- `rework.orderId` (String): 装修单号
- `rework.createTime` (String): 返工时间
- `rework.reworkDes` (String): 说明

```json
{
    "rework.orderId": "1601010001",
    "rework.createTime": "2016-01-01",
    "rework.reworkDes": "说明"
}
```


##### `查询` updateRework

更新返工信息

**Requests:**

- `rework.rwId` (Integer): 返工信息ID
- `rework.createTime` (String): 返工时间
- `rework.reworkDes` (String): 说明

```json
{
    "rework.rwId": 3,
    "rework.createTime": "2016-01-01",
    "rework.reworkDes": "说明"
}
```


##### `查询` deleteRework

批量删除返工信息

**Requests:**


```json
{
    "rwIds[0]": 3,
    "rwIds[1]": 4
}
```


##### `查询` queryReworkDrawingByReworkId

通过返工信息ID查询返工信息图片

**Requests:**

- `reworkDrawing.rwId` (Integer): 返工信息ID

```json
{
    "reworkDrawing.rwId": 3,
}
```

**Returns:**

- `reworkDrawings` (List): 图片信息列表 , 每条数据类型 `reworkDrawing`

```json
{
    ...
    "reworkDrawings": [
        {
            "reworkDrawing.rwdId": 1,
            "reworkDrawing.rwId": 2,
            "reworkDrawing.rwdAddUrl": "",
            "reworkDrawing.rwdName": "",
            "reworkDrawing.rwdUrl": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
        }
    ],
    ...
}
```


##### `查询` addReworkDrawing

添加返工图片信息

**Requests:**

- `reworkDrawing.rwId` (Integer): 返工信息ID
- `reworkDrawing.rwdName` (String): 名称
- `reworkDrawing.rwdUrl` (String): 路径
- `reworkDrawing.rwdAddUrl` (String): 路径 , 保留字段

```json
{
    "reworkDrawing.rwId": 3,
    "reworkDrawing.rwdName": "",
    "reworkDrawing.rwdUrl": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
    "reworkDrawing.rwdAddUrl": "",
}
```


##### `查询` deleteReworkDrawingById

删除返工图片信息

**Requests:**

- `reworkDrawing.rwdId` (Integer): 图片信息

```json
{
    "reworkDrawing.rwdId": 3,
}
```

## 巡检记录


巡检记录信息管理


> **类**: `api.construction.InspectionRecordAction`


#### 数据类型: `inspectionRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `irId` | 记录信息ID | Long |
| `orderId` | 装修单号 | String |
| `orderAddr` | 订单地址 | String |
| `operaterId` | 操作人编号 | String |
| `createTime` | 创建时间 | String |
| `operaterName` | 操作人名 | String |
| `startTime` | 开始时间 | String |
| `endTime` | 结束时间 | String |
| `recordDes` | 说明 | String |


##### `查询` pageInspectionRecordByOrderId

分页方式通过装修单号获取巡检记录信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 巡检记录信息列表 , 每条数据类型 `inspectionRecord`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "irId": 12,
                "endTime": "2016-01-01 19:32:30",
                "operaterId": "U3051",
                "operaterName": "白雪",
                "orderAddr": "楼盘",
                "orderId": "1601010001",
                "recordDes": "说明",
                "startTime": "2016-01-01 15:30:30"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addInspectionRecord

添加巡检记录信息

**Requests:**

- `inspectionRecord.orderId` (String): 装修单号
- `inspectionRecord.orderAddr` (String): 订单地址
- `inspectionRecord.startTime` (String): 开始时间
- `inspectionRecord.endTime` (String): 结束时间
- `inspectionRecord.recordDes` (String): 说明

```json
{
    "inspectionRecord.orderId": "1601010001",
    "inspectionRecord.orderAddr": "楼盘",
    "inspectionRecord.startTime": "2016-01-01 15:30:30",
    "inspectionRecord.endTime": "2016-01-01 19:32:30",
    "inspectionRecord.recordDes": "说明"
}
```


##### `查询` updateInspectionRecord

更新巡检记录信息

**Requests:**

- `inspectionRecord.irId` (Integer): 巡检信息ID
- `inspectionRecord.startTime` (String): 开始时间
- `inspectionRecord.endTime` (String): 结束时间
- `inspectionRecord.recordDes` (String): 说明

```json
{
    "inspectionRecord.irId": 1,
    "inspectionRecord.startTime": "2016-01-01 15:30:30",
    "inspectionRecord.endTime": "2016-01-01 19:32:30",
    "inspectionRecord.recordDes": "说明"
}
```


##### `查询` deleteInspectionRecord

批量删除巡检记录信息

**Requests:**


```json
{
    "irIds[0]": 3,
    "irIds[1]": 4
}
```

## 客服


### 投诉


投诉记录信息管理


> **类**: `api.construction.InspectionRecordAction`


#### 数据类型: `customerServiceComplaint`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cscId` | 投诉信息ID | Long |
| `orderId` | 装修单号 | String |
| `customerName` | 客户名 | String |
| `createrId` | 创建人编号 | String |
| `createrName` | 创建人名 | String |
| `operaterId` | 操作人编号 | String |
| `operaterName` | 操作人名 | String |
| `type` | 类型 , 包括: 装修 , 主材 | Integer |
| `level` | 等级 , 包括: 0:标准 , 1:重要 | Integer |
| `createTime` | 创建时间 | String |
| `status` | 状态 , 包括: 0:未处理 , 1:已处理 | Integer |
| `handle` | 处理说明 | String |
| `handleTime` | 处理时间 | String |
| `des` | 说明 | String |


##### `查询` pageCustomerServiceComplaint

分页方式通过装修单号获取投诉信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 投诉信息列表 , 每条数据类型 `customerServiceComplaint`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cscId": 2,
                "orderId": "1601010001",
                "customerName": "王先生",
                "des": "说明",
                "handle": "",
                "handleTime": "2016-01-01",
                "level": 0,
                "status": 0,
                "createTime": "2016-07-12",
                "type": 0,
                "createrId": "U3051",
                "createrName": "刘斌",
                "operaterId": "",
                "operaterName": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addCustomerServiceComplaint

添加投诉信息

**Requests:**

- `customerServiceComplaint.orderId` (String): 装修单号
- `customerServiceComplaint.level` (Integer): 等级 , 包括: 0:标准 , 1:重要
- `customerServiceComplaint.createTime` (String): 创建时间
- `customerServiceComplaint.customerName` (String): 客户名
- `customerServiceComplaint.des` (String): 说明

```json
{
    "customerServiceComplaint.orderId": "1601010001",
    "customerServiceComplaint.level": 0,
    "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
    "customerServiceComplaint.customerName": "王先生",
    "customerServiceComplaint.des": "说明"
}
```


##### `查询` updateCustomerServiceComplaint

更新投诉信息

**Requests:**

- `customerServiceComplaint.cscId` (Integer): 投诉信息ID
- `customerServiceComplaint.orderId` (String): 装修单号
- `customerServiceComplaint.level` (Integer): 等级 , 包括: 0:标准 , 1:重要
- `customerServiceComplaint.createTime` (String): 创建时间
- `customerServiceComplaint.customerName` (String): 客户名
- `customerServiceComplaint.des` (String): 说明

```json
{
    "customerServiceComplaint.cscId": 1,
    "customerServiceComplaint.orderId": "1601010001",
    "customerServiceComplaint.level": 0,
    "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
    "customerServiceComplaint.customerName": "王先生",
    "customerServiceComplaint.des": "说明"
}
```


##### `查询` handleCustomerServiceComplaint

处理投诉信息

**Requests:**

- `customerServiceComplaint.cscId` (String): 投诉信息ID
- `customerServiceComplaint.handle` (String): 处理信息

```json
{
    "customerServiceComplaint.cscId": 1,
    "customerServiceComplaint.handle": "处理说明"
}
```


##### `查询` deleteCustomerServiceComplaint

批量删除投诉信息

**Requests:**


```json
{
    "cscIds[0]": 1,
    "cscIds[1]": 2
}
```

### 保修


保修记录信息管理


> **类**: `api.construction.CustomerServiceGuaranteeAction`


#### 数据类型: `customerServiceGuarantee`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csgId` | 保修信息ID | Long |
| `orderId` | 装修单号 | String |
| `customerName` | 客户名 | String |
| `guaranteeTime` | 保修时间 | String |
| `guaranteeDes` | 说明 | String |


##### `查询` pageCustomerServiceGuarantee

分页方式通过装修单号获取保修信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 保修信息列表 , 每条数据类型 `customerServiceGuarantee`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csgId": 3,
                "orderId": "1601010001",
                "customerName": "李先生",
                "guaranteeTime": "2016-08-01",
                "guaranteeDes": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addCustomerServiceGuarantee

添加保修信息

**Requests:**

- `customerServiceGuarantee.orderId` (String): 装修单号
- `customerServiceGuarantee.customerName` (String): 客户名
- `customerServiceGuarantee.guaranteeTime` (String): 保修时间
- `customerServiceGuarantee.guaranteeDes` (String): 说明

```json
{
    "customerServiceGuarantee.csgId": 1,
    "customerServiceGuarantee.orderId": "1601010001",
    "customerServiceGuarantee.customerName": "王先生",
    "customerServiceGuarantee.guaranteeTime": "2016-01-01 15:30:30",
    "customerServiceGuarantee.guaranteeDes": "说明"
}
```


##### `查询` updateCustomerServiceGuarantee

更新保修信息

**Requests:**

- `customerServiceGuarantee.csgId` (Integer): 保修信息ID
- `customerServiceGuarantee.guaranteeDes` (String): 说明

```json
{
    "customerServiceGuarantee.csgId": 1,
    "customerServiceGuarantee.guaranteeDes": "说明"
}
```


##### `查询` deleteCustomerServiceGuarantee

删除保修信息

**Requests:**


```json
{
    "csgIds[0]": 1,
    "csgIds[1]": 2
}
```

### 回访


回访记录信息管理


> **类**: `api.construction.CustomerServiceBackVisitAction`


#### 数据类型: `customerServiceBackVisit`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csbvId` | 回访信息ID | Integer |
| `orderId` | 装修单号 | String |
| `orderAddr` | 订单地址 | String |
| `customerName` | 客户名 | String |
| `backVisitTime` | 回访时间 | String |
| `backVisitType` | 类型 , 包括: 0: 标准 , 1: 重要 | String |
| `backVisitDes` | 说明 | String |


##### `查询` pageCustomerServiceBackVisit

分页方式通过装修单号获取回访信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 回访信息列表 , 每条数据类型 `customerServiceBackVisit`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csbvId": 1,
                "orderId": "1601010001",
                "orderAddr": "楼盘",
                "customerName": "王先生",
                "backVisitTime": "2016-01-01",
                "backVisitType": 1,
                "backVisitDes": "说明",
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addCustomerServiceBackVisit

添加回访信息

**Requests:**

- `customerServiceBackVisit.orderId` (String): 装修单号
- `customerServiceBackVisit.orderAddr` (String): 订单地址
- `customerServiceBackVisit.customerName` (String): 客户名
- `customerServiceBackVisit.backVisitTime` (String): 保修时间
- `customerServiceBackVisit.backVisitDes` (String): 说明

```json
{
    "customerServiceBackVisit.csgId": 1,
    "customerServiceBackVisit.orderId": "1601010001",
    "customerServiceBackVisit.orderAddr": "楼盘",
    "customerServiceBackVisit.customerName": "王先生",
    "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
    "customerServiceBackVisit.backVisitType": 1,
    "customerServiceBackVisit.backVisitDes": "说明"
}
```


##### `查询` updateCustomerServiceBackVisit

更新回访信息

**Requests:**

- `customerServiceBackVisit.csbvId` (String): 回访信息ID
- `customerServiceBackVisit.orderId` (String): 装修单号
- `customerServiceBackVisit.orderAddr` (String): 订单地址
- `customerServiceBackVisit.customerName` (String): 客户名
- `customerServiceBackVisit.backVisitTime` (String): 保修时间
- `customerServiceBackVisit.backVisitDes` (String): 说明

```json
{
    "customerServiceBackVisit.csbvId": 1,
    "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
    "customerServiceBackVisit.backVisitType": 1,
    "customerServiceBackVisit.backVisitDes": "说明"
}
```


##### `查询` deleteCustomerServiceBackVisit

删除回访信息

**Requests:**


```json
{
    "csbvIds[0]": 1,
    "csbvIds[1]": 2
}
```

## 验收


工程信息验收过程 , 可以针对工程过程中的监理和质检进行评分和评价 , 以及针对整体订单施工情况进行评分


> **类**: `api.construction.AcceptanceAction`


#### 数据类型: `acceptance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `actId` | 验收信息ID | Integer |
| `orderId` | 装修单号 | String |
| `customer` | 客户名 | String |
| `orderAddr` | 订单地址 | String |
| `designer` | 设计师 | String |
| `acceptanceTime` | 验收时间 | String |
| `waterwayQualityName` | 水路质检 | String |
| `waterwayWorkerName` | 水路工人 | String |
| `waterwayQuality` | 水路工程质量评价 | Integer |
| `waterwayServer` | 水路服务质量评价 | Integer |
| `waterwayHygiene` | 水路卫生质量评价 | Integer |
| `waterwayDes` | 水路评价 | String |
| `circuitQualityName` | 电路质检 | String |
| `circuitWorkerName` | 电路工人 | String |
| `circuitQuality` | 电路工程质量评价 | Integer |
| `circuitServer` | 电路服务质量评价 | Integer |
| `circuitHygiene` | 电路卫生质量评价 | Integer |
| `circuitDes` | 电路评价 | String |
| `bricklayQualityName` | 瓦工质检 | String |
| `bricklayWorkerName` | 瓦工工人 | String |
| `bricklayQuality` | 瓦工程质量评价 | Integer |
| `bricklayServer` | 瓦工服务质量评价 | Integer |
| `bricklayHygiene` | 瓦工卫生质量评价 | Integer |
| `bricklayDes` | 瓦工评价 | String |
| `carpentQualityName` | 木工质检 | String |
| `carpentWorkerName` | 木工工人 | String |
| `carpentQuality` | 木工程质量评价 | Integer |
| `carpentServer` | 木工服务质量评价 | Integer |
| `carpentHygiene` | 木工卫生质量评价 | Integer |
| `carpentDes` | 木工评价 | String |
| `oilQualityName` | 油工质检 | String |
| `oilWorkerName` | 油工工人 | String |
| `oilQuality` | 油工工程质量评价 | Integer |
| `oilServer` | 油工服务质量评价 | Integer |
| `oilHygiene` | 油工卫生质量评价 | Integer |
| `oilDes` | 油工评价 | String |
| `supervisId` | 监理编号 | String |
| `supervisName` | 监理 | String |
| `supervisQuality` | 监理工程质量评价 | Integer |
| `supervisServer` | 监理服务质量评价 | Integer |
| `supervisHygiene` | 监理卫生质量评价 | Integer |
| `supervisDes` | 监理评价 | String |
| `materialQuality` | 主材工程质量评价 | Integer |
| `materialServer` | 主材服务质量评价 | Integer |
| `materialDes` | 主材评价 | String |
| `question` | 问题 | String |
| `propose` | 建议 | String |
| `multiple` | 评级 | Integer |


##### `查询` queryAcceptance

通过装修单号获取验收信息

**Requests:**

- `acceptance.orderId` (String): 装修单号

```json
{
    "acceptance.orderId": "1601010001"
}
```

**Returns:**

- `acceptance` (List): 验收信息 , 每条数据类型 `acceptance`

```json
{
    ...
    "acceptance": {
        "actId": 5,
        "acceptanceTime": "2016-01-01",
        "bricklayDes": "",
        "bricklayHygiene": 0,
        "bricklayQuality": 3,
        "bricklayQualityName": "王金",
        "bricklayServer": 0,
        "bricklayWorkerName": "査达林",
        "carpentDes": "",
        "carpentHygiene": 0,
        "carpentQuality": 3,
        "carpentQualityName": "王建",
        "carpentServer": 0,
        "carpentWorkerName": "葛鑫",
        "circuitDes": "",
        "circuitHygiene": 0,
        "circuitQuality": 3,
        "circuitQualityName": "孙兴",
        "circuitServer": 0,
        "circuitWorkerName": "曹星",
        "customer": "李先生",
        "designer": "白雪",
        "integerernal": null,
        "materialDes": "",
        "materialQuality": 0,
        "materialServer": 0,
        "multiple": 3,
        "oilDes": "",
        "oilHygiene": 0,
        "oilQuality": 3,
        "oilQualityName": "李波",
        "oilServer": 0,
        "oilWorkerName": "钱宝",
        "orderAddr": "楼盘 5#2",
        "orderId": "1601010001",
        "propose": "建议说明",
        "question": "",
        "supervisDes": "",
        "supervisHygiene": 0,
        "supervisId": null,
        "supervisName": "白添宇",
        "supervisQuality": 3,
        "supervisServer": 0,
        "waterwayDes": "",
        "waterwayHygiene": 0,
        "waterwayQuality": 3,
        "waterwayQualityName": "孙兴",
        "waterwayServer": 0,
        "waterwayWorkerName": null
    },
    ...
}
```


##### `查询` updateAcceptance

保存验收信息

- `acceptance.orderId` (String): 装修单号
- `acceptance.acceptanceTime` (String): 验收时间
- `acceptance.waterwayQuality` (Integer): 水路工程质量评价
- `acceptance.waterwayServer` (Integer): 水路服务质量评价
- `acceptance.waterwayHygiene` (Integer): 水路卫生质量评价
- `acceptance.waterwayDes` (String): 水路评价
- `acceptance.circuitQuality` (Integer): 电路工程质量评价
- `acceptance.circuitServer` (Integer): 电路服务质量评价
- `acceptance.circuitHygiene` (Integer): 电路卫生质量评价
- `acceptance.circuitDes` (String): 电路评价
- `acceptance.bricklayQuality` (Integer): 瓦工程质量评价
- `acceptance.bricklayServer` (Integer): 瓦工服务质量评价
- `acceptance.bricklayHygiene` (Integer): 瓦工卫生质量评价
- `acceptance.bricklayDes` (String): 瓦工评价
- `acceptance.carpentQuality` (Integer): 木工程质量评价
- `acceptance.carpentServer` (Integer): 木工服务质量评价
- `acceptance.carpentHygiene` (Integer): 木工卫生质量评价
- `acceptance.carpentDes` (String): 木工评价
- `acceptance.oilQuality` (Integer): 油工工程质量评价
- `acceptance.oilServer` (Integer): 油工服务质量评价
- `acceptance.oilHygiene` (Integer): 油工卫生质量评价
- `acceptance.oilDes` (String): 油工评价
- `acceptance.supervisQuality` (Integer): 监理工程质量评价
- `acceptance.supervisServer` (Integer): 监理服务质量评价
- `acceptance.supervisHygiene` (Integer): 监理卫生质量评价
- `acceptance.supervisDes` (String): 监理评价
- `acceptance.materialQuality` (Integer): 主材工程质量评价
- `acceptance.materialServer` (Integer): 主材服务质量评价
- `acceptance.materialDes` (String): 主材评价
- `acceptance.question` (String): 问题
- `acceptance.propose` (String): 建议
- `acceptance.multiple` (Integer): 评级

```json
{
    "acceptance.actId": 5,
    "acceptance.acceptanceTime": "2016-01-01",
    "acceptance.bricklayDes": "",
    "acceptance.bricklayHygiene": 0,
    "acceptance.bricklayQuality": 3,
    "acceptance.bricklayServer": 0,
    "acceptance.carpentDes": "",
    "acceptance.carpentHygiene": 0,
    "acceptance.carpentQuality": 3,
    "acceptance.carpentServer": 0,
    "acceptance.circuitDes": "",
    "acceptance.circuitHygiene": 0,
    "acceptance.circuitQuality": 3,
    "acceptance.circuitServer": 0,
    "acceptance.materialDes": "",
    "acceptance.materialQuality": 0,
    "acceptance.materialServer": 0,
    "acceptance.multiple": 3,
    "acceptance.oilDes": "",
    "acceptance.oilHygiene": 0,
    "acceptance.oilQuality": 3,
    "acceptance.oilServer": 0,
    "acceptance.orderId": "1601010001",
    "acceptance.propose": "建议说明",
    "acceptance.question": "",
    "acceptance.supervisDes": "",
    "acceptance.supervisHygiene": 0,
    "acceptance.supervisQuality": 3,
    "acceptance.supervisServer": 0,
    "acceptance.waterwayDes": "",
    "acceptance.waterwayHygiene": 0,
    "acceptance.waterwayQuality": 3,
    "acceptance.waterwayServer": 0
}
```
