# construction 工程
## 放线

放线信息管理

## api.drawline.DrawLineAction

**数据类型**:

#### drawLine

    - **dlid**: 放线信息ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **applayTime**: 申请时间
      - 类型: *Timestamp*
    - **content**: 说明
      - 类型: *String*
    - **actualTime**: 放线时间
      - 类型: *Long*
    - **startTime**: 开始时间
      - 类型: *String*
    - **endTime**: 结束时间
      - 类型: *String*
    - **status**: 状态 , 0: 排队, 1: 申请, 2: 成功, 3: 失败
      - 类型: *Short*
    - **count**: 申请次数
      - 类型: *Short*
    - **appler**: 申请人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **group**: 放线小组 , 类型 [drawlineGroup](./data.html#api.data.DrawlineGroup.drawlineGroup)
      - 类型: *Object*
    - **drawer**: 放线人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **orderId**: 装修单号
      - 类型: *String*
    - **status**: 状态
      - 类型: *String*
    - **designerId**: 设计师编号
      - 类型: *String*
    - **salesmanId**: 业务员编号
      - 类型: *String*
    - **village**: 楼盘名
      - 类型: *String*
    - **villageId**: 楼盘编号
      - 类型: *String*
    - **designerDepartmentId**: 设计部编号
      - 类型: *String*
    - **businessDepartmentId**: 业务部编号
      - 类型: *String*
    - **designer**: 设计师名
      - 类型: *String*
    - **salesman**: 业务员名
      - 类型: *String*
    - **businessDepartment**: 业务部名称
      - 类型: *String*
    - **designerDepartment**: 设计部名称
      - 类型: *String*
    - **actualDate**: 放线时间 , 例: 2016-01-01
      - 类型: *String*

    ### `pageDrawLine` <span style="color:gray">[内部]</span>

        分页方式获取放线信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  放线信息列表 , 每条数据类型 *drawLine*

        **示例**:{
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

    ### `queryDrawLine` <span style="color:gray">[内部]</span>

        获取放线信息 , 条件参数传递方式参照 `filter <../check_rule.html#filter>`_

**返回参数**:

- **drawLines**: 放线信息列表 , 每条数据类型 *drawLine*
          - 类型: *List*

        **示例**:{
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

    ### `countDrawLine` <span style="color:gray">[内部]</span>

        通过时间范围获取放线信息数量

**请求参数**:

- **drawLine.startTime**:
  开始时间
        - **drawLine.endTime**:
  结束时间

        **示例**:{
                "drawLine.startTime": "2016-01-01 00:00:00",
                "drawLine.endTime": "2016-01-01 23:59:59"
            }

**返回参数**:

- **drawLines**: 放线数量信息列表 , 每条数据类型 Map<String, Integer>
          - 类型: *Map*

        **示例**:{
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

    ### `applayDrawLine` <span style="color:gray">[内部]</span>

        申请放线 , 同时生成工程信息 , 更新房产信息

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断装修单关联放线是否存在 , 如果存在 , 错误信息 **120013 已经在队列中,不可重复提交**

        判断工程单是否存在 , 不存在生成工程单信息

        利用装修单中面积信息 , 获取工程成本 , 同时更新工程单工费和辅料上限

        获取辅料项需要控制项目 , 生成工程辅料相关信息

**请求参数**:

- **drawLine.decoration.orderId**:
  装修单号
        - **drawLine.decoration.conpany**:
  工程公司
        - **drawLine.applayTime**:
  申请时间
        - **drawLine.comment**:
  说明信息

        **示例**:{
                "drawLine.decoration.orderId": "1601010001",
                "drawLine.decoration.conpany": 1,
                "drawLine.applayTime": "2016-01-01 23:59:59",
                "drawLine.comment": "说明"
            }

    ### `updateDrawLine` <span style="color:gray">[内部]</span>

        更新放线信息

        判断放线信息是否存在 , 不存在 , 错误信息 **120014 不存在该放线信息**

**请求参数**:

- **drawLine.dlid**:
  放线信息ID

        **示例**:{
                "drawLine.dlid": 1
            }

    ### `resetDrawLine` <span style="color:gray">[内部]</span>

        重置放线 , 重新设置相关信息

**请求参数**:

- **drawLine.dlid**:
  放线信息ID
        - **drawLine.actualDate**:
  放线日期
        - **drawLine.startTime**:
  开始时间
        - **drawLine.endTime**:
  结束时间
        - **drawLine.drawLineGroup.dgid**:
  放线小组ID

        **示例**:{
                "drawLine.dlid": 1,
                "drawLine.actualDate": "2016-01-01"
                "drawLine.startTime": "00:00:00",
                "drawLine.endTime": "23:59:59",
                "drawLine.comment": "说明",
                "drawLine.drawLineGroup.dgid": 1,
            }

    ### `successDrawLine` <span style="color:gray">[内部]</span>

        放线成功

        判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**

        判断放线信息状态为1(申请) , 其他状态 , 错误信息 **120017 订单放线状态错误**

        判断工程信息是否存在 , 不存在 , 错误信息 **120020 工程信息不存在**

**请求参数**:

- **drawLine.dlid**:
  放线信息ID

        - **constructionNodes[n].sort**:
  排序
        - **constructionNodes[n].timeLimit**:
  工期

        **示例**:{
                "drawLine.dlid": 1,

                "constructionNode[0].sort": 3,
                "constructionNode[0].timeLimit": 10
            }

    ### `failureDrawLine` <span style="color:gray">[内部]</span>

        放线失败

        判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**

**请求参数**:

- **drawLine.dlid**:
  放线信息ID

        **示例**:{
                "drawLine.dlid": 1,
            }

## 工程单

工程信息 , 订单整体功能相关信息

## api.construction.ConstructionAction

**数据类型**:

#### construction

    - **cid**: 工程单ID
      - 类型: *Integer*
    - **orderId**: 装修单号
      - 类型: *String*
    - **supervisor**: 监理 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **locker**: 锁定人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **schedule**: 施工进度
      - 类型: *Short*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **lockTime**: 锁定时间
      - 类型: *Timestamp*
    - **accessory**: 辅料控制 , 0: 开放 , 1: 锁定
      - 类型: *Short*
    - **accessoryLimit**: 辅料额上限
      - 类型: *Long*
    - **salaryLimit**: 工费额上限
      - 类型: *Long*
    - **accessoryTotal**: 辅料总额
      - 类型: *Long*
    - **salaryTotal**: 工费总额
      - 类型: *Long*

        |Filters:|
        - **orderId**: 装修单号
      - 类型: *String*
    - **status**: 状态
      - 类型: *String*
    - **designerId**: 设计师编号
      - 类型: *String*
    - **salesmanId**: 业务员编号
      - 类型: *String*
    - **village**: 楼盘名
      - 类型: *String*
    - **villageId**: 楼盘编号
      - 类型: *String*
    - **designer**: 设计师名
      - 类型: *String*
    - **salesman**: 业务员名
      - 类型: *String*
    - **supervisor**: 监理名
      - 类型: *String*
    - **houseNumber**: 楼号
      - 类型: *String*
    - **schedule**: 施工进度
      - 类型: *Short*
    - **projectStatus**: 工程状态 , 包括: 未完工 , 已完工
      - 类型: *String*

    ### `pageConstruction` <span style="color:gray">[内部]</span>

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_

        **示例**:{
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

    ### `pageConstructionForBase` <span style="color:gray">[内部]</span>

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_

        **示例**:{
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

    ### `pageConstructionForSupervision` <span style="color:gray">[内部]</span>

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        针对监理职位对返回装修单信息进行控制

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_

        **示例**:{
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

    ### `pageConstructionForQualiter` <span style="color:gray">[内部]</span>

        分页方式获取质检对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_

        **示例**:{
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

    ### `pageConstructionForAcceptance` <span style="color:gray">[内部]</span>

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        返回所有需要进行验收状态的装修单信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_

        **示例**:{
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

    ### `queryConstructionByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取工程信息

**请求参数**:

- **construction.orderId**:
  装修单号

        **示例**:{
                "construction.orderId": "1601010001"
            }

**返回参数**:

- **construction**: 工程信息 , 类型 *construction*
          - 类型: *Object*

        **示例**:{
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

    ### `updateConstructionByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号更新工程单

        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**请求参数**:

- **construction.orderId**:
  装修单号
        - **construction.supervisor.userId**:
  监理编号
        - **construction.decoration.conpany**:
  工程公司

        - **qualiters[n].uid**:
  质检id

        **示例**:{
                "construction.orderId": "1601010001",
                "construction.supervisor.userId": "U0479",
                "construction.decoration.conpany": 1,

                "qualiters[0].uid": 1
            }

    ### `updateConstructionForAdvance` <span style="color:gray">[内部]</span>

        更新工程单信息 , 包括: 辅料额上限和工费额上限

        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**请求参数**:

- **construction.cid**:
  工程单ID
        - **construction.accessoryLimit**:
  辅料额上限
        - **construction.salaryLimit**:
  工费额上限

        **示例**:{
                "construction.cid": 1,
                "construction.accessoryLimit": 10000000,
                "construction.salaryLimit": 10000000,
            }

    ### `openAccessory` <span style="color:gray">[内部]</span>

        开放辅料单

        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**请求参数**:

- **construction.cid**:
  工程单ID

        **示例**:{
                "construction.cid": 1
            }

    ### `lockAccessory` <span style="color:gray">[内部]</span>

        锁定辅料单

        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

**请求参数**:

- **construction.cid**:
  工程单ID

        **示例**:{
                "construction.cid": 1
            }

## 工程环节

工程阶段相关信息管理

## api.construction.ConstructionScheduleAction

**数据类型**:

#### constructionSchedule

    - **csid**: 工程环节ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **enterTime**: 进场时间
      - 类型: *Timestamp*
    - **leaveTime**: 出场时间
      - 类型: *Timestamp*
    - **startTime**: 开工时间
      - 类型: *Timestamp*
    - **endTime**: 完工时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 开工 , 2: 完工
      - 类型: *Short*
    - **workStatus**: 工作状态 , 0: 初始 , 1: 进场 , 2: 出场
      - 类型: *Short*
    - **checkout**: 验证款项 , 0: 验证 , 1: 通过
      - 类型: *Short*
    - **schedule**: 工程进度
      - 类型: *Short*
    - **node**: 工程节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*

    ### `pageConstructionSchedule` <span style="color:gray">[内部]</span>

        分页方式获施工节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  施工节点信息列表 , 每条数据类型 *constructionSchedule*

        **示例**:{
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

    ### `queryConstructionScheduleByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取工程环节信息

**请求参数**:

- **constructionSchedule.orderId**:
  装修单号

        **示例**:{
                "constructionSchedule.orderId": "1601010001"
            }

**返回参数**:

- **constructionSchedules**: 工程环节信息列表 , 每条数据类型 *constructionSchedule*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructionScheduleByCid` <span style="color:gray">[内部]</span>

        通过工程单ID获取工程环节信息

**请求参数**:

- **constructionSchedule.cid**:
  工程单ID

        **示例**:{
                "constructionSchedule.cid": 1
            }

**返回参数**:

- **constructionSchedules**: 工程环节信息列表 , 每条数据类型 *constructionSchedule*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructionScheduleByOrderIdASchedule` <span style="color:gray">[内部]</span>

        通过装修单号获取工程环节信息

**请求参数**:

- **constructionSchedule.orderId**:
  装修单号
        - **constructionSchedule.schedule**:
  进度

        **示例**:{
                "constructionSchedule.orderId": "1601010001",
                "constructionSchedule.schedule": 3
            }

**返回参数**:

- **constructionSchedule**: 工程环节 , 类型 *constructionSchedule*
          - 类型: *Object*

        **示例**:{
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

    ### `enterConstructionSchedule` <span style="color:gray">[内部]</span>

        进场

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        工程环节工作状态更新为1(进场) , 进场时间更新为当前时间

**请求参数**:

- **constructionSchedule.csid**:
  工程环节ID

        **示例**:{
                "constructionSchedule.csid": 1
            }

    ### `leaveConstructionSchedule` <span style="color:gray">[内部]</span>

        出场

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        工程环节工作状态更新为2(出场) , 出场时间更新为当前时间

**请求参数**:

- **constructionSchedule.csid**:
  工程环节ID

        **示例**:{
                "constructionSchedule.csid": 1
            }

    ### `beginConstructionSchedule` <span style="color:gray">[内部]</span>

        开工

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        判断工程环节状态为0(初始) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**

        判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例

        利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**

        工程环节状态更新为1(开工) , 开工时间更新为当前时间

**请求参数**:

- **constructionSchedule.csid**:
  工程环节ID

        **示例**:{
                "constructionSchedule.csid": 1
            }

    ### `finishConstructionSchedule` <span style="color:gray">[内部]</span>

        完工

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        判断工程环节状态为1(开工) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**

        判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例

        利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**

        工程环节状态更新为2(完工) , 完工时间更新为当前时间

**请求参数**:

- **constructionSchedule.csid**:
  工程环节ID

        **示例**:{
                "constructionSchedule.csid": 1
            }

    ### `checkoutConstructionSchedule` <span style="color:gray">[内部]</span>

        更新工程环节验证款项

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

**请求参数**:

- **constructionSchedule.csid**:
  工程环节ID
        - **constructionSchedule.checkout**:
  验证款项

        **示例**:{
                "constructionSchedule.csid": 1,
                "constructionSchedule.startTime": 0
            }

## 工程信息

## api.construction.ConstructionInfoAction

**数据类型**:

#### constructionInfo

    - **ciid**: 信息ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **timeLimit**: 工期
      - 类型: *Integer*
    - **ishovel**: 铲大白 , 0: 公司 , 1: 客户
      - 类型: *Short*
    - **iskey**: 钥匙 , 0: 工程中心 , 1: 客户
      - 类型: *Short*
    - **isCeremony**: 开工仪式 , 0: 有 , 1: 无
      - 类型: *Short*
    - **finishTime**: 预计完工时间
      - 类型: *Timestamp*
    - **keyTime**: 预计领钥匙时间
      - 类型: *Timestamp*
    - **drawlineTime**: 预计放线时间
      - 类型: *Timestamp*
    - **designTime**: 预计设计时间
      - 类型: *Timestamp*
    - **comment**: 备注说明
      - 类型: *String*

    ### `pageConstructionInfo` <span style="color:gray">[内部]</span>

        分页方式获取工程信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工程信息列表 , 每条数据类型 *constructionInfo*

        **示例**:{
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

    ### `queryConstructionInfo` <span style="color:gray">[内部]</span>

        通过工程单ID获取工程信息

**请求参数**:

- **constructionInfo.cid**:
  工程单ID

        **示例**:{
                "constructionInfo.cid": 1
            }

**返回参数**:

- **constructionInfo**: 工程信息 , 类型 *constructionInfo*
          - 类型: *Object*

        **示例**:{
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

    ### `queryConstructionInfoByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取工程信息

**请求参数**:

- **constructionInfo.orderId**:
  装修单号

        **示例**:{
                "constructionInfo.orderId": "1601010001"
            }

**返回参数**:

- **constructionInfo**: 工程信息 , 类型 *constructionInfo*
          - 类型: *Object*

        **示例**:{
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

    ### `updateConstructionInfo` <span style="color:gray">[内部]</span>

        更新工程信息

**请求参数**:

- **constructionInfo.cid**:
  工程单ID
        - **constructionInfo.timeLimit**:
  工期
        - **constructionInfo.ishovel**:
  铲大白
        - **constructionInfo.iskey**:
  钥匙
        - **constructionInfo.isCeremony**:
  工程仪式
        - **constructionInfo.finishTime**:
  预计完工时间
        - **constructionInfo.keyTime**:
  预计领钥匙时间
        - **constructionInfo.drawlineTime**:
  预计放线时间
        - **constructionInfo.designTime**:
  预计设计时间
        - **constructionInfo.comment**:
  说明

        - **constructionInfo.decoration.house.quoteArea**:
  预算面积

        **示例**:{
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

    ### `updateConstructionInfoByOrderId` <span style="color:gray">[内部]</span>

        更新工程信息

        通过装修单号获取对应工程信息 , 存在更新工程信息 , 不存在 , 添加工程信息

**请求参数**:

- **constructionInfo.orderId**:
  装修单号
        - **constructionInfo.ishovel**:
  铲大白
        - **constructionInfo.iskey**:
  钥匙
        - **constructionInfo.isCeremony**:
  工程仪式
        - **constructionInfo.finishTime**:
  预计完工时间
        - **constructionInfo.keyTime**:
  预计领钥匙时间
        - **constructionInfo.drawlineTime**:
  预计放线时间
        - **constructionInfo.designTime**:
  预计设计时间
        - **constructionInfo.comment**:
  说明

        **示例**:{
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

## 工程计划

## api.construction.ConstructionPlanction

**数据类型**:

#### constructionPlan

    - **cpid**: 计划ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **startTime**: 开始时间
      - 类型: *Timestamp*
    - **endTime**: 结束时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*

    ### `queryConstructionPlanByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取工程计划

**请求参数**:

- **constructionPlan.orderId**:
  装修单号

        **示例**:{
                "constructionPlan.orderId": 1
            }

**返回参数**:

- **constructionPlans**: 工程计划信息列表 , 类型 *constructionInfo*
          - 类型: *List*

        **示例**:{
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

    ### `addConstructionPlan` <span style="color:gray">[内部]</span>

        添加工程计划

**请求参数**:

- **constructionPlan.orderId**:
  装修单号
        - **constructionPlan.name**:
  装修单号
        - **constructionPlan.startTime**:
  装修单号
        - **constructionPlan.endTime**:
  装修单号
        - **constructionPlan.comment**:
  装修单号

        **示例**:{
                "constructionPlan.orderId": "1601010001",
                "constructionPlan.name": "计划",
                "constructionPlan.startTime": "2016-01-01 00:00:00",
                "constructionPlan.endTime": "2016-01-01 00:00:00",
                "constructionPlan.comment": "说明",
            }

    ### `deleteConstructionPlan` <span style="color:gray">[内部]</span>

        删除工程计划

**请求参数**:

- **constructionPlan.cpid**:
  计划ID

        **示例**:{
                "constructionPlan.cpid": 1
            }

## 工程图片

工程图片 , 施工图片资源管理

## api.construction.ConstructionDrawingAction

**数据类型**:

#### constructionDrawing

    - **cdid**: 图片ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Long*
    - **name**: 图片名
      - 类型: *String*
    - **url**: 图片路径
      - 类型: *String*
    - **filesize**: 文件大小
      - 类型: *Integer*
    - **invurl**: 图片路径 , 保留字段
      - 类型: *String*
    - **type**: 类型 , 0: 本地图片 , 1: 钉钉图片
      - 类型: *Short*
    - **schedule**: 施工进度
      - 类型: *Short*

    ### `queryConstructionDrawingByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取工程图片信息

        可以同过工程单ID以及施工进度获取图片信息

**请求参数**:

- **construction.orderId**:
  装修单号
        - **constructionDrawing.schedule**:
  施工进度 , <选填>

        **示例**:{
                "construction.orderId": "1601010001",
                "constructionDrawing.schedule": 1,
            }

**返回参数**:

- **constructionDrawings**: 工程图片信息列表 , 每条数据类型 *constructionDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructionDrawingByCid` <span style="color:gray">[内部]</span>

        获取工程图片信息

        可以同过工程单ID以及施工进度获取图片信息

**请求参数**:

- **constructionDrawing.cid**:
  工程单ID
        - **constructionDrawing.schedule**:
  施工进度 , <选填>

        **示例**:{
                "constructionDrawing.cid": 1,
                "constructionDrawing.schedule": 1,
            }

**返回参数**:

- **constructionDrawings**: 工程图片信息列表 , 每条数据类型 *constructionDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `addConstructionDrawing` <span style="color:gray">[内部]</span>

        添加工程图片信息

**请求参数**:

- **constructionDrawing.cid**:
  工程单ID
        - **constructionDrawing.name**:
  名称
        - **constructionDrawing.url**:
  图片路径
        - **constructionDrawing.invurl**:
  图片路径 , 保留
        - **constructionDrawing.filesize**:
  文件大小
        - **constructionDrawing.type**:
  类型
        - **constructionDrawing.schedule**:
  施工进度

        **示例**:{
                "constructionDrawing.cid": 1,
                "constructionDrawing.name": "",
                "constructionDrawing.invurl": "",
                "constructionDrawing.url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "constructionDrawing.filesize": 0,
                "constructionDrawing.type": 0,
                "constructionDrawing.schedule": 1
            }

    ### `addConstructionDrawings` <span style="color:gray">[内部]</span>

        批量工程图片信息

**请求参数**:

- **constructionDrawing[n].cid**:
  工程单ID
        - **constructionDrawing[n].name**:
  名称
        - **constructionDrawing[n].url**:
  图片路径
        - **constructionDrawing[n].invurl**:
  图片路径 , 保留
        - **constructionDrawing[n].filesize**:
  文件大小
        - **constructionDrawing[n].type**:
  类型
        - **constructionDrawing[n].schedule**:
  施工进度

        **示例**:{
                "constructionDrawing[n].cid": 1,
                "constructionDrawing[n].name": "",
                "constructionDrawing[n].invurl": "",
                "constructionDrawing[n].url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "constructionDrawing[n].filesize": 0,
                "constructionDrawing[n].type": 0,
                "constructionDrawing[n].schedule": 1
            }

    ### `deleteConstructionDrawing` <span style="color:gray">[内部]</span>

        删除工程图片信息

**请求参数**:

- **constructionDrawing.cdid**:
  图片ID

        **示例**:{
                "chanDrawing.cdid": 1
            }

## 质检

## api.construction.QualiterAction

**数据类型**:

#### qualiter

    - **qid**: 质检ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Integer*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **user**: 施工人员 , 类型: [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **schedule**: 施工进度
      - 类型: *Short*
    - **rate**: 评分
      - 类型: *Short*
    - **assessment**: 评价
      - 类型: *String*
    - **creater**: 创建人 , 类型: [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*

    ### `queryQualiter` <span style="color:gray">[内部]</span>

        通过装修单号获取质检信息

**请求参数**:

- **qualiter.orderId**:
  装修单号

        **示例**:{
                "qualiter.orderId: "1601010001"
            }

**返回参数**:

- **qualiters**: 质检信息列表 , 每条数据类型 *qualiter*
          - 类型: *List*

        **示例**:{
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

    ### `addQualiter` <span style="color:gray">[内部]</span>

        添加质检

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**

**请求参数**:

- **qualiter.decoration.orderId**:
  装修单号
        - **qualiter.user.uid**:
  质检ID

        **示例**:{
                "qualiter.decoration.orderId: "1601010001",
                "qualiter.user.uid": 1
            }

    ### `deleteQualiter` <span style="color:gray">[内部]</span>

        删除质检

**请求参数**:

- **qualiter.qid**:
  质检ID

        **示例**:{
            "qualiter.qid: 1
        }

## 施工人员

工程各环节中施工人员信息管理

## api.construction.ConstructerAction

**数据类型**:

#### constructer

    - **crid**: 施工人员ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Integer*
    - **orderId**: 装修单号
      - 类型: *String*
    - **user**: 施工人员 , 类型: [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **schedule**: 施工进度 , 包括: 1: 铲大白 , 2: 放线 , 3: 水力电 , 4: 瓦工 , 5: 地面找平 , 6: 木工 , 7: 油工 , 8: 水电验收 , 9: 保洁
      - 类型: *Short*
    - **salary**: 工费
      - 类型: *Float*
    - **rate**: 评分
      - 类型: *Short*
    - **rate1**: 评分
      - 类型: *Short*
    - **rate2**: 评分
      - 类型: *Short*
    - **assessment**: 评价
      - 类型: *String*
    - **creater**: 创建人 , 类型: [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **sendTime**: 推送时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始, 1: 失效 , 2: 推送 , 3: 完成
      - 类型: *Short*

    ### `queryConstructerByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息

        如果schedule没有传值将返回装修单号对应的所有施工人员信息

        施工人员状态为初始(0)

**请求参数**:

- **constructer.orderId**:
  装修单号
        - **constructer.schedule**:
  施工进度
        - **constructer.csid**:
  施工进度ID

        **示例**:{
                "constructer.orderId": "1601010001",
                "constructer.schedule": 1,
                "constructer.csid": 1
            }

**返回参数**:

- **constructers**: 施工人员信息列表 , 每条数据类型 *constructer*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructerByCid` <span style="color:gray">[内部]</span>

        通过工程单ID获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息

        如果schedule没有传值将返回装修单号对应的所有施工人员信息

        施工人员状态为初始(0)

**请求参数**:

- **constructer.cid**:
  工程单ID
        - **constructer.schedule**:
  施工进度
        - **constructer.csid**:
  施工进度ID

        **示例**:{
                "constructer.cid:1,
                "constructer.schedule": 1,
                "constructer.csid": 1
            }

**返回参数**:

- **constructers**: 施工人员信息列表 , 每条数据类型 *constructer*
          - 类型: *List*

        **示例**:{
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

    ### `queryConstructerByCrid` <span style="color:gray">[内部]</span>

        通过施工人员ID获取信息

**请求参数**:

- **constructer.crid**:
  施工人员ID

        **示例**:{
                "constructer.crid: 1
            }

**返回参数**:

- **constructer**: 施工人员信息 , 类型 *constructer*
          - 类型: *Object*

        **示例**:{
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

    ### `addConstructer` <span style="color:gray">[内部]</span>

        添加施工人员信息

        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**

        判断施工环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        判断施工环节状态是否为0(初始) , 错误信息 **120026 工程环节未开工**

        判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**

        判断同一工程和同一施工进度中 , 被添加的施工人员是否已经存在 , 存在添加失败 , 错误信息 **当前工人已经添加,不能重复添加同一工人**

**请求参数**:

- **constructer.cid**:
  工程单ID
        - **constructer.schedule**:
  施工进度
        - **constructer.user.userId**:
  施工人员编号

        **示例**:{
                "constructer.cid:1,
                "constructer.schedule": 1,
                "constructer.user.userId": "U0001"
            }

    ### `updateConstructerForRate` <span style="color:gray">[内部]</span>

        更新施工人员信息

        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

**请求参数**:

- **constructer.crid**:
  施工人员ID
        - **constructer.rate**:
  评级
        - **constructer.rate1**:
  评级
        - **constructer.rate2**:
  评级
        - **constructer.assessment**:
  评价

        **示例**:{
                "constructer.cid:1,
                "constructer.rate": 5,
                "constructer.rate1": 5,
                "constructer.rate2": 5,
                "constructer.assessment": "评价信息"
            }

    ### `rateConstructer` <span style="color:gray">[内部]</span>

        评级

        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

        判断状态是否为2(推送) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**

        更新状态为3(完成) , 更新完成时间

**请求参数**:

- **constructer.crid**:
  施工人员ID
        - **constructer.rate**:
  评级
        - **constructer.rate1**:
  评级
        - **constructer.rate2**:
  评级
        - **constructer.assessment**:
  评价

        **示例**:{
                "constructer.cid:1,
                "constructer.rate": 5,
                "constructer.rate1": 5,
                "constructer.rate2": 5,
                "constructer.assessment": "评价信息"
            }

    ### `sendConstructer` <span style="color:gray">[内部]</span>

        推送

        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**

        判断状态是否为0(初始) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**

        更新状态为1(推送) , 更新推送时间

**请求参数**:

- **constructer.crid**:
  施工人员ID

        **示例**:{
                "constructer.cid:1
            }

    ### `deleteConstructer` <span style="color:gray">[内部]</span>

        删除施工人员信息 , 更新施工人员状态为失效(1)

        判断删除施工人员存在工费信息 , 存在不能删除 , 错误信息 **120023 施工人员存在工费,不可删除**

**请求参数**:

- **constructer.crid**:
  施工人员ID

        **示例**:{
                "constructer.crid:1
            }

## 工程辅料

## api.construction.ConstructionAccessoryAction

**数据类型**:

#### constructionAccessory

    - **caid**: 工程辅料ID
      - 类型: *Long*
    - **cid**: 工程单ID
      - 类型: *Long*
    - **aoods**: 辅材 , 类型: [aoods](./data.html#api.data.AoodsAction.aoods)
      - 类型: *Object*
    - **checkup**: 验证标识 , 0: 验证 , 1: 通过
      - 类型: *Short*
    - **numLimit**: 数量限制
      - 类型: *Long*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总额
      - 类型: *Long*

    ### `pageConstructionAccessory` <span style="color:gray">[内部]</span>

        分页方式获取工程辅料信息 , 根据工程单ID获取 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工程辅料信息列表 , 每条数据类型 *constructionAccessory*

        **示例**:{
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

    ### `addConstructionAccessory` <span style="color:gray">[内部]</span>

        添加工程辅料信息

        判断工程单是否存在 , 不存在 , 错误信息 **120020 工程单不存在**

**请求参数**:

- **constructionAccessory.cid**:
  工程单ID
        - **constructionAccessory.aoods.aid**:
  辅材ID
        - **constructionAccessory.checkup**:
  验证标识
        - **constructionAccessory.numLimit**:
  数量上限

        **示例**:{
                "constructionAccessory.cid": 1,
                "constructionAccessory.aoods.aid": 1,
                "constructionAccessory.checkup": 0,
                "constructionAccessory.numLimit": 1000000
            }

    ### `updateConstructionAccessory` <span style="color:gray">[内部]</span>

        更新工程辅料信息

**请求参数**:

- **constructionAccessory.caid**:
  工程辅料ID
        - **constructionAccessory.checkup**:
  验证标识
        - **constructionAccessory.numLimit**:
  数量上限

        **示例**:{
                "constructionAccessory.caid": 1,
                "constructionAccessory.checkup": 0,
                "constructionAccessory.numLimit": 1000000
            }

## 返工

返工信息管理

## api.construction.ReworkAction

**数据类型**:

#### rework

    工程返工信息

    - **rwId**: 返工信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **createrId**: 创建人员编号
      - 类型: *String*
    - **createrName**: 创建人员名称
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *String*
    - **reworkDes**: 说明
      - 类型: *String*

    #### reworkDrawing

    返工图片信息

    - **rwdId**: 返工图片ID
      - 类型: *Long*
    - **rwId**: 返工信息ID
      - 类型: *Long*
    - **rwdName**: 名称
      - 类型: *String*
    - **rwdUrl**: 路径
      - 类型: *String*
    - **rwdAddUrl**: 路径 , 保留字段
      - 类型: *String*

    ### `pageReworkByOrderId` <span style="color:gray">[内部]</span>

        分页方式通过装修单号获取返工信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  返工信息列表 , 每条数据类型 *rework*

        **示例**:{
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

    ### `addRework` <span style="color:gray">[内部]</span>

        添加返工信息

**请求参数**:

- **rework.orderId**:
  装修单号
        - **rework.createTime**:
  返工时间
        - **rework.reworkDes**:
  说明

        **示例**:{
                "rework.orderId": "1601010001",
                "rework.createTime": "2016-01-01",
                "rework.reworkDes": "说明"
            }

    ### `updateRework` <span style="color:gray">[内部]</span>

        更新返工信息

**请求参数**:

- **rework.rwId**:
  返工信息ID
        - **rework.createTime**:
  返工时间
        - **rework.reworkDes**:
  说明

        **示例**:{
                "rework.rwId": 3,
                "rework.createTime": "2016-01-01",
                "rework.reworkDes": "说明"
            }

    ### `deleteRework` <span style="color:gray">[内部]</span>

        批量删除返工信息

**请求参数**:

- **rwIds[n]**:
  返工信息ID列表 , 每条数据类型 Integer

        **示例**:{
                "rwIds[0]": 3,
                "rwIds[1]": 4
            }

    ### `queryReworkDrawingByReworkId` <span style="color:gray">[内部]</span>

        通过返工信息ID查询返工信息图片

**请求参数**:

- **reworkDrawing.rwId**:
  返工信息ID

        **示例**:{
                "reworkDrawing.rwId": 3,
            }

**返回参数**:

- **reworkDrawings**: 图片信息列表 , 每条数据类型 *reworkDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `addReworkDrawing` <span style="color:gray">[内部]</span>

        添加返工图片信息

**请求参数**:

- **reworkDrawing.rwId**:
  返工信息ID
        - **reworkDrawing.rwdName**:
  名称
        - **reworkDrawing.rwdUrl**:
  路径
        - **reworkDrawing.rwdAddUrl**:
  路径 , 保留字段

        **示例**:{
                "reworkDrawing.rwId": 3,
                "reworkDrawing.rwdName": "",
                "reworkDrawing.rwdUrl": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "reworkDrawing.rwdAddUrl": "",
            }

    ### `deleteReworkDrawingById` <span style="color:gray">[内部]</span>

        删除返工图片信息

**请求参数**:

- **reworkDrawing.rwdId**:
  图片信息

        **示例**:{
                "reworkDrawing.rwdId": 3,
            }

## 巡检记录

巡检记录信息管理

## api.construction.InspectionRecordAction

**数据类型**:

#### inspectionRecord

    - **irId**: 记录信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **orderAddr**: 订单地址
      - 类型: *String*
    - **operaterId**: 操作人编号
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *String*
    - **operaterName**: 操作人名
      - 类型: *String*
    - **startTime**: 开始时间
      - 类型: *String*
    - **endTime**: 结束时间
      - 类型: *String*
    - **recordDes**: 说明
      - 类型: *String*

    ### `pageInspectionRecordByOrderId` <span style="color:gray">[内部]</span>

        分页方式通过装修单号获取巡检记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  巡检记录信息列表 , 每条数据类型 *inspectionRecord*

        **示例**:{
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

    ### `addInspectionRecord` <span style="color:gray">[内部]</span>

        添加巡检记录信息

**请求参数**:

- **inspectionRecord.orderId**:
  装修单号
        - **inspectionRecord.orderAddr**:
  订单地址
        - **inspectionRecord.startTime**:
  开始时间
        - **inspectionRecord.endTime**:
  结束时间
        - **inspectionRecord.recordDes**:
  说明

        **示例**:{
                "inspectionRecord.orderId": "1601010001",
                "inspectionRecord.orderAddr": "楼盘",
                "inspectionRecord.startTime": "2016-01-01 15:30:30",
                "inspectionRecord.endTime": "2016-01-01 19:32:30",
                "inspectionRecord.recordDes": "说明"
            }

    ### `updateInspectionRecord` <span style="color:gray">[内部]</span>

        更新巡检记录信息

**请求参数**:

- **inspectionRecord.irId**:
  巡检信息ID
        - **inspectionRecord.startTime**:
  开始时间
        - **inspectionRecord.endTime**:
  结束时间
        - **inspectionRecord.recordDes**:
  说明

        **示例**:{
                "inspectionRecord.irId": 1,
                "inspectionRecord.startTime": "2016-01-01 15:30:30",
                "inspectionRecord.endTime": "2016-01-01 19:32:30",
                "inspectionRecord.recordDes": "说明"
            }

    ### `deleteInspectionRecord` <span style="color:gray">[内部]</span>

        批量删除巡检记录信息

**请求参数**:

- **irIds[0]**:
  巡检信息ID列表 , 每条数据类型 Integer

        **示例**:{
                "irIds[0]": 3,
                "irIds[1]": 4
            }

## 客服

### 投诉

投诉记录信息管理

## api.construction.InspectionRecordAction

**数据类型**:

#### customerServiceComplaint

    - **cscId**: 投诉信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **customerName**: 客户名
      - 类型: *String*
    - **createrId**: 创建人编号
      - 类型: *String*
    - **createrName**: 创建人名
      - 类型: *String*
    - **operaterId**: 操作人编号
      - 类型: *String*
    - **operaterName**: 操作人名
      - 类型: *String*
    - **type**: 类型 , 包括: 装修 , 主材
      - 类型: *Integer*
    - **level**: 等级 , 包括: 0:标准 , 1:重要
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *String*
    - **status**: 状态 , 包括: 0:未处理 , 1:已处理
      - 类型: *Integer*
    - **handle**: 处理说明
      - 类型: *String*
    - **handleTime**: 处理时间
      - 类型: *String*
    - **des**: 说明
      - 类型: *String*

    ### `pageCustomerServiceComplaint` <span style="color:gray">[内部]</span>

        分页方式通过装修单号获取投诉信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  投诉信息列表 , 每条数据类型 *customerServiceComplaint*

        **示例**:{
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

    ### `addCustomerServiceComplaint` <span style="color:gray">[内部]</span>

        添加投诉信息

**请求参数**:

- **customerServiceComplaint.orderId**:
  装修单号
        - **customerServiceComplaint.level**:
  等级 , 包括: 0:标准 , 1:重要
        - **customerServiceComplaint.createTime**:
  创建时间
        - **customerServiceComplaint.customerName**:
  客户名
        - **customerServiceComplaint.des**:
  说明

        **示例**:{
                "customerServiceComplaint.orderId": "1601010001",
                "customerServiceComplaint.level": 0,
                "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
                "customerServiceComplaint.customerName": "王先生",
                "customerServiceComplaint.des": "说明"
            }

    ### `updateCustomerServiceComplaint` <span style="color:gray">[内部]</span>

        更新投诉信息

**请求参数**:

- **customerServiceComplaint.cscId**:
  投诉信息ID
        - **customerServiceComplaint.orderId**:
  装修单号
        - **customerServiceComplaint.level**:
  等级 , 包括: 0:标准 , 1:重要
        - **customerServiceComplaint.createTime**:
  创建时间
        - **customerServiceComplaint.customerName**:
  客户名
        - **customerServiceComplaint.des**:
  说明

        **示例**:{
                "customerServiceComplaint.cscId": 1,
                "customerServiceComplaint.orderId": "1601010001",
                "customerServiceComplaint.level": 0,
                "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
                "customerServiceComplaint.customerName": "王先生",
                "customerServiceComplaint.des": "说明"
            }

    ### `handleCustomerServiceComplaint` <span style="color:gray">[内部]</span>

        处理投诉信息

**请求参数**:

- **customerServiceComplaint.cscId**:
  投诉信息ID
        - **customerServiceComplaint.handle**:
  处理信息

        **示例**:{
                "customerServiceComplaint.cscId": 1,
                "customerServiceComplaint.handle": "处理说明"
            }

    ### `deleteCustomerServiceComplaint` <span style="color:gray">[内部]</span>

        批量删除投诉信息

**请求参数**:

- **cscIds[n]**:
  投诉信息ID列表 , 每条数据类型 Long

        **示例**:{
                "cscIds[0]": 1,
                "cscIds[1]": 2
            }

### 保修

保修记录信息管理

## api.construction.CustomerServiceGuaranteeAction

**数据类型**:

#### customerServiceGuarantee

    - **csgId**: 保修信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **customerName**: 客户名
      - 类型: *String*
    - **guaranteeTime**: 保修时间
      - 类型: *String*
    - **guaranteeDes**: 说明
      - 类型: *String*

    ### `pageCustomerServiceGuarantee` <span style="color:gray">[内部]</span>

        分页方式通过装修单号获取保修信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  保修信息列表 , 每条数据类型 *customerServiceGuarantee*

        **示例**:{
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

    ### `addCustomerServiceGuarantee` <span style="color:gray">[内部]</span>

        添加保修信息

**请求参数**:

- **customerServiceGuarantee.orderId**:
  装修单号
        - **customerServiceGuarantee.customerName**:
  客户名
        - **customerServiceGuarantee.guaranteeTime**:
  保修时间
        - **customerServiceGuarantee.guaranteeDes**:
  说明

        **示例**:{
                "customerServiceGuarantee.csgId": 1,
                "customerServiceGuarantee.orderId": "1601010001",
                "customerServiceGuarantee.customerName": "王先生",
                "customerServiceGuarantee.guaranteeTime": "2016-01-01 15:30:30",
                "customerServiceGuarantee.guaranteeDes": "说明"
            }

    ### `updateCustomerServiceGuarantee` <span style="color:gray">[内部]</span>

        更新保修信息

**请求参数**:

- **customerServiceGuarantee.csgId**:
  保修信息ID
        - **customerServiceGuarantee.guaranteeDes**:
  说明

        **示例**:{
                "customerServiceGuarantee.csgId": 1,
                "customerServiceGuarantee.guaranteeDes": "说明"
            }

    ### `deleteCustomerServiceGuarantee` <span style="color:gray">[内部]</span>

        删除保修信息

**请求参数**:

- **csgIds[n]**:
  保修信息ID列表 , 每条数据类型 Long

        **示例**:{
                "csgIds[0]": 1,
                "csgIds[1]": 2
            }

### 回访

回访记录信息管理

## api.construction.CustomerServiceBackVisitAction

**数据类型**:

#### customerServiceBackVisit

    - **csbvId**: 回访信息ID
      - 类型: *Integer*
    - **orderId**: 装修单号
      - 类型: *String*
    - **orderAddr**: 订单地址
      - 类型: *String*
    - **customerName**: 客户名
      - 类型: *String*
    - **backVisitTime**: 回访时间
      - 类型: *String*
    - **backVisitType**: 类型 , 包括: 0: 标准 , 1: 重要
      - 类型: *String*
    - **backVisitDes**: 说明
      - 类型: *String*

    ### `pageCustomerServiceBackVisit` <span style="color:gray">[内部]</span>

        分页方式通过装修单号获取回访信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  回访信息列表 , 每条数据类型 *customerServiceBackVisit*

        **示例**:{
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

    ### `addCustomerServiceBackVisit` <span style="color:gray">[内部]</span>

        添加回访信息

**请求参数**:

- **customerServiceBackVisit.orderId**:
  装修单号
        - **customerServiceBackVisit.orderAddr**:
  订单地址
        - **customerServiceBackVisit.customerName**:
  客户名
        - **customerServiceBackVisit.backVisitTime**:
  保修时间
        - **customerServiceBackVisit.backVisitDes**:
  说明

        **示例**:{
                "customerServiceBackVisit.csgId": 1,
                "customerServiceBackVisit.orderId": "1601010001",
                "customerServiceBackVisit.orderAddr": "楼盘",
                "customerServiceBackVisit.customerName": "王先生",
                "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
                "customerServiceBackVisit.backVisitType": 1,
                "customerServiceBackVisit.backVisitDes": "说明"
            }

    ### `updateCustomerServiceBackVisit` <span style="color:gray">[内部]</span>

        更新回访信息

**请求参数**:

- **customerServiceBackVisit.csbvId**:
  回访信息ID
        - **customerServiceBackVisit.orderId**:
  装修单号
        - **customerServiceBackVisit.orderAddr**:
  订单地址
        - **customerServiceBackVisit.customerName**:
  客户名
        - **customerServiceBackVisit.backVisitTime**:
  保修时间
        - **customerServiceBackVisit.backVisitDes**:
  说明

        **示例**:{
                "customerServiceBackVisit.csbvId": 1,
                "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
                "customerServiceBackVisit.backVisitType": 1,
                "customerServiceBackVisit.backVisitDes": "说明"
            }

    ### `deleteCustomerServiceBackVisit` <span style="color:gray">[内部]</span>

        删除回访信息

**请求参数**:

- **csbvIds[n]**:
  回访信息ID列表 , 每条数据类型 Integer

        **示例**:{
                "csbvIds[0]": 1,
                "csbvIds[1]": 2
            }

## 验收

工程信息验收过程 , 可以针对工程过程中的监理和质检进行评分和评价 , 以及针对整体订单施工情况进行评分

## api.construction.AcceptanceAction

**数据类型**:

#### acceptance

    - **actId**: 验收信息ID
      - 类型: *Integer*
    - **orderId**: 装修单号
      - 类型: *String*
    - **customer**: 客户名
      - 类型: *String*
    - **orderAddr**: 订单地址
      - 类型: *String*
    - **designer**: 设计师
      - 类型: *String*
    - **acceptanceTime**: 验收时间
      - 类型: *String*
    - **waterwayQualityName**: 水路质检
      - 类型: *String*
    - **waterwayWorkerName**: 水路工人
      - 类型: *String*
    - **waterwayQuality**: 水路工程质量评价
      - 类型: *Integer*
    - **waterwayServer**: 水路服务质量评价
      - 类型: *Integer*
    - **waterwayHygiene**: 水路卫生质量评价
      - 类型: *Integer*
    - **waterwayDes**: 水路评价
      - 类型: *String*
    - **circuitQualityName**: 电路质检
      - 类型: *String*
    - **circuitWorkerName**: 电路工人
      - 类型: *String*
    - **circuitQuality**: 电路工程质量评价
      - 类型: *Integer*
    - **circuitServer**: 电路服务质量评价
      - 类型: *Integer*
    - **circuitHygiene**: 电路卫生质量评价
      - 类型: *Integer*
    - **circuitDes**: 电路评价
      - 类型: *String*
    - **bricklayQualityName**: 瓦工质检
      - 类型: *String*
    - **bricklayWorkerName**: 瓦工工人
      - 类型: *String*
    - **bricklayQuality**: 瓦工程质量评价
      - 类型: *Integer*
    - **bricklayServer**: 瓦工服务质量评价
      - 类型: *Integer*
    - **bricklayHygiene**: 瓦工卫生质量评价
      - 类型: *Integer*
    - **bricklayDes**: 瓦工评价
      - 类型: *String*
    - **carpentQualityName**: 木工质检
      - 类型: *String*
    - **carpentWorkerName**: 木工工人
      - 类型: *String*
    - **carpentQuality**: 木工程质量评价
      - 类型: *Integer*
    - **carpentServer**: 木工服务质量评价
      - 类型: *Integer*
    - **carpentHygiene**: 木工卫生质量评价
      - 类型: *Integer*
    - **carpentDes**: 木工评价
      - 类型: *String*
    - **oilQualityName**: 油工质检
      - 类型: *String*
    - **oilWorkerName**: 油工工人
      - 类型: *String*
    - **oilQuality**: 油工工程质量评价
      - 类型: *Integer*
    - **oilServer**: 油工服务质量评价
      - 类型: *Integer*
    - **oilHygiene**: 油工卫生质量评价
      - 类型: *Integer*
    - **oilDes**: 油工评价
      - 类型: *String*
    - **supervisId**: 监理编号
      - 类型: *String*
    - **supervisName**: 监理
      - 类型: *String*
    - **supervisQuality**: 监理工程质量评价
      - 类型: *Integer*
    - **supervisServer**: 监理服务质量评价
      - 类型: *Integer*
    - **supervisHygiene**: 监理卫生质量评价
      - 类型: *Integer*
    - **supervisDes**: 监理评价
      - 类型: *String*
    - **materialQuality**: 主材工程质量评价
      - 类型: *Integer*
    - **materialServer**: 主材服务质量评价
      - 类型: *Integer*
    - **materialDes**: 主材评价
      - 类型: *String*
    - **question**: 问题
      - 类型: *String*
    - **propose**: 建议
      - 类型: *String*
    - **multiple**: 评级
      - 类型: *Integer*

    ### `queryAcceptance` <span style="color:gray">[内部]</span>

        通过装修单号获取验收信息

**请求参数**:

- **acceptance.orderId**:
  装修单号

        **示例**:{
                "acceptance.orderId": "1601010001"
            }

**返回参数**:

- **acceptance**: 验收信息 , 每条数据类型 *acceptance*
          - 类型: *List*

        **示例**:{
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

    ### `updateAcceptance` <span style="color:gray">[内部]</span>

        保存验收信息

        - **acceptance.orderId**:
  装修单号
        - **acceptance.acceptanceTime**:
  验收时间
        - **acceptance.waterwayQuality**:
  水路工程质量评价
        - **acceptance.waterwayServer**:
  水路服务质量评价
        - **acceptance.waterwayHygiene**:
  水路卫生质量评价
        - **acceptance.waterwayDes**:
  水路评价
        - **acceptance.circuitQuality**:
  电路工程质量评价
        - **acceptance.circuitServer**:
  电路服务质量评价
        - **acceptance.circuitHygiene**:
  电路卫生质量评价
        - **acceptance.circuitDes**:
  电路评价
        - **acceptance.bricklayQuality**:
  瓦工程质量评价
        - **acceptance.bricklayServer**:
  瓦工服务质量评价
        - **acceptance.bricklayHygiene**:
  瓦工卫生质量评价
        - **acceptance.bricklayDes**:
  瓦工评价
        - **acceptance.carpentQuality**:
  木工程质量评价
        - **acceptance.carpentServer**:
  木工服务质量评价
        - **acceptance.carpentHygiene**:
  木工卫生质量评价
        - **acceptance.carpentDes**:
  木工评价
        - **acceptance.oilQuality**:
  油工工程质量评价
        - **acceptance.oilServer**:
  油工服务质量评价
        - **acceptance.oilHygiene**:
  油工卫生质量评价
        - **acceptance.oilDes**:
  油工评价
        - **acceptance.supervisQuality**:
  监理工程质量评价
        - **acceptance.supervisServer**:
  监理服务质量评价
        - **acceptance.supervisHygiene**:
  监理卫生质量评价
        - **acceptance.supervisDes**:
  监理评价
        - **acceptance.materialQuality**:
  主材工程质量评价
        - **acceptance.materialServer**:
  主材服务质量评价
        - **acceptance.materialDes**:
  主材评价
        - **acceptance.question**:
  问题
        - **acceptance.propose**:
  建议
        - **acceptance.multiple**:
  评级

        **示例**:{
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
