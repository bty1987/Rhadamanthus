# construction {#construction}

# 工程
## 放线

放线信息管理

## api.drawline.DrawLineAction

        |DataType:|
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
    
    ### <I> pageDrawLine

        分页方式获取放线信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 放线信息列表 , 每条数据类型 *drawLine*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryDrawLine

        获取放线信息 , 条件参数传递方式参照 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **drawLines**: 放线信息列表 , 每条数据类型 *drawLine*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> countDrawLine

        通过时间范围获取放线信息数量
        
                |Requests:|
                :param drawLine.startTime: 开始时间
        :type drawLine.startTime: String
        :param drawLine.endTime: 结束时间
        :type drawLine.endTime: String
        
        Example::
        
            {
                "drawLine.startTime": "2016-01-01 00:00:00",
                "drawLine.endTime": "2016-01-01 23:59:59"
            }
            
                |Returns:|
                - **drawLines**: 放线数量信息列表 , 每条数据类型 Map<String, Integer>
          - 类型: *Map*
        
        Example::
        
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
            
    ### <I> applayDrawLine

        申请放线 , 同时生成工程信息 , 更新房产信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单关联放线是否存在 , 如果存在 , 错误信息 **120013 已经在队列中,不可重复提交**
        
        判断工程单是否存在 , 不存在生成工程单信息
        
        利用装修单中面积信息 , 获取工程成本 , 同时更新工程单工费和辅料上限
        
        获取辅料项需要控制项目 , 生成工程辅料相关信息
        
                |Requests:|
                :param drawLine.decoration.orderId: 装修单号
        :type drawLine.decoration.orderId: String
        :param drawLine.decoration.conpany: 工程公司
        :type drawLine.decoration.conpany: Integer
        :param drawLine.applayTime: 申请时间
        :type drawLine.applayTime: String
        :param drawLine.comment: 说明信息
        :type drawLine.comment: String
        
        Example::
        
            {
                "drawLine.decoration.orderId": "1601010001",
                "drawLine.decoration.conpany": 1,
                "drawLine.applayTime": "2016-01-01 23:59:59",
                "drawLine.comment": "说明"
            }

    ### <I> updateDrawLine

        更新放线信息
        
        判断放线信息是否存在 , 不存在 , 错误信息 **120014 不存在该放线信息**
        
                |Requests:|
                :param drawLine.dlid: 放线信息ID
        :type drawLine.dlid: Long
        
        Example::
        
            {
                "drawLine.dlid": 1
            }

    ### <I> resetDrawLine

        重置放线 , 重新设置相关信息
        
                |Requests:|
                :param drawLine.dlid: 放线信息ID
        :type drawLine.dlid: Long
        :param drawLine.actualDate: 放线日期
        :type drawLine.actualDate: String
        :param drawLine.startTime: 开始时间
        :type drawLine.startTime: String
        :param drawLine.endTime: 结束时间
        :type drawLine.endTime: String
        :param drawLine.drawLineGroup.dgid: 放线小组ID
        :type drawLine.drawLineGroup.dgid: Long
        
        Example::
        
            {
                "drawLine.dlid": 1,
                "drawLine.actualDate": "2016-01-01"
                "drawLine.startTime": "00:00:00",
                "drawLine.endTime": "23:59:59",
                "drawLine.comment": "说明",
                "drawLine.drawLineGroup.dgid": 1,
            }
            
    ### <I> successDrawLine

        放线成功
        
        判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**
        
        判断放线信息状态为1(申请) , 其他状态 , 错误信息 **120017 订单放线状态错误**
        
        判断工程信息是否存在 , 不存在 , 错误信息 **120020 工程信息不存在**
        
                |Requests:|
                :param drawLine.dlid: 放线信息ID
        :type drawLine.dlid: Long
        
        :param constructionNodes[n].sort: 排序
        :type constructionNodes[n].sort: Short
        :param constructionNodes[n].timeLimit: 工期
        :type constructionNode[n].timeLimit: Integer
        
        Example::
        
            {
                "drawLine.dlid": 1,
                
                "constructionNode[0].sort": 3,
                "constructionNode[0].timeLimit": 10
            }
        
    ### <I> failureDrawLine

        放线失败
        
        判断放线信息是否存在 , 不存在 , 错误信息 **120017 订单放线状态错误**
        
                |Requests:|
                :param drawLine.dlid: 放线信息ID
        :type drawLine.dlid: Long
        
        Example::
        
            {
                "drawLine.dlid": 1,
            }

## 工程单

工程信息 , 订单整体功能相关信息

## api.construction.ConstructionAction

        |DataType:|
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
    
    ### <I> pageConstruction

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageConstructionForBase

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_
        :type paging.data: List
        
        Example::
        
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

    ### <I> pageConstructionForSupervision

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        针对监理职位对返回装修单信息进行控制
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_
        :type paging.data: List
        
        Example::
        
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

    ### <I> pageConstructionForQualiter

        分页方式获取质检对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageConstructionForAcceptance

        分页方式获取工程对应装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        返回所有需要进行验收状态的装修单信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`_
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryConstructionByOrderId

        通过装修单号获取工程信息
        
                |Requests:|
                :param construction.orderId: 装修单号
        :type construction.orderId: String
        
        Example::
        
            {
                "construction.orderId": "1601010001"
            }
            
                |Returns:|
                - **construction**: 工程信息 , 类型 *construction*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> updateConstructionByOrderId

        通过装修单号更新工程单
        
        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**
        
                |Requests:|
                :param construction.orderId: 装修单号
        :type construction.orderId: String
        :param construction.supervisor.userId: 监理编号
        :type construction.supervisor.userId: String
        :param construction.decoration.conpany: 工程公司
        :type construction.decoration.conpany: Integer
        
        :param qualiters[n].uid: 质检id
        :type qualiters[n].uid: Long
        
        Example::
        
            {
                "construction.orderId": "1601010001",
                "construction.supervisor.userId": "U0479",
                "construction.decoration.conpany": 1,
                
                "qualiters[0].uid": 1
            }
            
    ### <I> updateConstructionForAdvance

        更新工程单信息 , 包括: 辅料额上限和工费额上限
        
        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**
        
                |Requests:|
                :param construction.cid: 工程单ID
        :type construction.cid: Long
        :param construction.accessoryLimit: 辅料额上限
        :type construction.accessoryLimit: Long
        :param construction.salaryLimit: 工费额上限
        :type construction.salaryLimit: Long
        
        Example::
        
            {
                "construction.cid": 1,
                "construction.accessoryLimit": 10000000,
                "construction.salaryLimit": 10000000,
            }
    
    ### <I> openAccessory

        开放辅料单
        
        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**
        
                |Requests:|
                :param construction.cid: 工程单ID
        :type construction.cid: Long
        
        Example::
        
            {
                "construction.cid": 1
            }
    
    ### <I> lockAccessory

        锁定辅料单
        
        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**
        
                |Requests:|
                :param construction.cid: 工程单ID
        :type construction.cid: Long
        
        Example::
        
            {
                "construction.cid": 1
            }
        
## 工程环节

工程阶段相关信息管理

## api.construction.ConstructionScheduleAction

        |DataType:|
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
    
    ### <I> pageConstructionSchedule

        分页方式获施工节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 施工节点信息列表 , 每条数据类型 *constructionSchedule*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryConstructionScheduleByOrderId

        通过装修单号获取工程环节信息
        
                |Requests:|
                :param constructionSchedule.orderId: 装修单号
        :type constructionSchedule.orderId: String
        
        Example::
        
            {
                "constructionSchedule.orderId": "1601010001"
            }
            
                |Returns:|
                - **constructionSchedules**: 工程环节信息列表 , 每条数据类型 *constructionSchedule*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> queryConstructionScheduleByCid

        通过工程单ID获取工程环节信息
        
                |Requests:|
                :param constructionSchedule.cid: 工程单ID
        :type constructionSchedule.cid: Long
        
        Example::
        
            {
                "constructionSchedule.cid": 1
            }
            
                |Returns:|
                - **constructionSchedules**: 工程环节信息列表 , 每条数据类型 *constructionSchedule*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryConstructionScheduleByOrderIdASchedule

        通过装修单号获取工程环节信息
        
                |Requests:|
                :param constructionSchedule.orderId: 装修单号
        :type constructionSchedule.orderId: String
        :param constructionSchedule.schedule: 进度
        :type constructionSchedule.schedule: Short
        
        Example::
        
            {
                "constructionSchedule.orderId": "1601010001",
                "constructionSchedule.schedule": 3
            }
            
                |Returns:|
                - **constructionSchedule**: 工程环节 , 类型 *constructionSchedule*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> enterConstructionSchedule

        进场
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        工程环节工作状态更新为1(进场) , 进场时间更新为当前时间
    
                |Requests:|
                :param constructionSchedule.csid: 工程环节ID
        :type constructionSchedule.csid: Long
        
        Example::
        
            {
                "constructionSchedule.csid": 1
            }

    ### <I> leaveConstructionSchedule

        出场
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        工程环节工作状态更新为2(出场) , 出场时间更新为当前时间
    
                |Requests:|
                :param constructionSchedule.csid: 工程环节ID
        :type constructionSchedule.csid: Long
        
        Example::
        
            {
                "constructionSchedule.csid": 1
            }

    ### <I> beginConstructionSchedule

        开工
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        判断工程环节状态为0(初始) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**
        
        判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例
        
        利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**
        
        工程环节状态更新为1(开工) , 开工时间更新为当前时间
    
                |Requests:|
                :param constructionSchedule.csid: 工程环节ID
        :type constructionSchedule.csid: Long
        
        Example::
        
            {
                "constructionSchedule.csid": 1
            }
    
    ### <I> finishConstructionSchedule

        完工
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        判断工程环节状态为1(开工) , 其他状态不可操作 , 错误信息 **120025 工程环节不可操作**
        
        判断工程环节是否验证款项 , 如果需要验证款项 , 分为两个部分验证装修款比例和主材款比例
        
        利用关联工程环节比例配置以及装修单对应的比例数据 , 完成验证动作 , 错误信息 **120018 装修款比例不足** 和 **120033 销售比例不足**
        
        工程环节状态更新为2(完工) , 完工时间更新为当前时间
        
                |Requests:|
                :param constructionSchedule.csid: 工程环节ID
        :type constructionSchedule.csid: Long
        
        Example::
        
            {
                "constructionSchedule.csid": 1
            }
            
    ### <I> checkoutConstructionSchedule

        更新工程环节验证款项
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
                |Requests:|
                :param constructionSchedule.csid: 工程环节ID
        :type constructionSchedule.csid: Long
        :param constructionSchedule.checkout: 验证款项
        :type constructionSchedule.checkout: Short
        
        Example::
        
            {
                "constructionSchedule.csid": 1,
                "constructionSchedule.startTime": 0
            }
            
## 工程信息

## api.construction.ConstructionInfoAction

        |DataType:|
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
    
    ### <I> pageConstructionInfo

        分页方式获取工程信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 工程信息列表 , 每条数据类型 *constructionInfo*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryConstructionInfo

        通过工程单ID获取工程信息
        
                |Requests:|
                :param constructionInfo.cid: 工程单ID
        :type constructionInfo.cid: Long
        
        Example::
        
            {
                "constructionInfo.cid": 1
            }
            
                |Returns:|
                - **constructionInfo**: 工程信息 , 类型 *constructionInfo*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryConstructionInfoByOrderId

        通过装修单号获取工程信息
        
                |Requests:|
                :param constructionInfo.orderId: 装修单号
        :type constructionInfo.orderId: String
        
        Example::
        
            {
                "constructionInfo.orderId": "1601010001"
            }
            
                |Returns:|
                - **constructionInfo**: 工程信息 , 类型 *constructionInfo*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> updateConstructionInfo

        更新工程信息
        
                |Requests:|
                :param constructionInfo.cid: 工程单ID
        :type constructionInfo.cid: Long
        :param constructionInfo.timeLimit: 工期
        :type constructionInfo.timeLimit: Integer
        :param constructionInfo.ishovel: 铲大白
        :type constructionInfo.ishovel: Short
        :param constructionInfo.iskey: 钥匙
        :type constructionInfo.iskey: Short
        :param constructionInfo.isCeremony: 工程仪式
        :type constructionInfo.isCeremony: Short
        :param constructionInfo.finishTime: 预计完工时间
        :type constructionInfo.finishTime: Timestamp
        :param constructionInfo.keyTime: 预计领钥匙时间
        :type constructionInfo.keyTime: Timestamp
        :param constructionInfo.drawlineTime: 预计放线时间
        :type constructionInfo.drawlineTime: Timestamp
        :param constructionInfo.designTime: 预计设计时间
        :type constructionInfo.designTime: Timestamp
        :param constructionInfo.comment: 说明
        :type constructionInfo.comment: String
        
        :param constructionInfo.decoration.house.quoteArea: 预算面积
        :type constructionInfo.decoration.house.quoteArea: Integer
        
        Example::
        
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
            
    ### <I> updateConstructionInfoByOrderId

        更新工程信息
        
        通过装修单号获取对应工程信息 , 存在更新工程信息 , 不存在 , 添加工程信息
        
                |Requests:|
                :param constructionInfo.orderId: 装修单号
        :type constructionInfo.orderId: String
        :param constructionInfo.ishovel: 铲大白
        :type constructionInfo.ishovel: Short
        :param constructionInfo.iskey: 钥匙
        :type constructionInfo.iskey: Short
        :param constructionInfo.isCeremony: 工程仪式
        :type constructionInfo.isCeremony: Short
        :param constructionInfo.finishTime: 预计完工时间
        :type constructionInfo.finishTime: Timestamp
        :param constructionInfo.keyTime: 预计领钥匙时间
        :type constructionInfo.keyTime: Timestamp
        :param constructionInfo.drawlineTime: 预计放线时间
        :type constructionInfo.drawlineTime: Timestamp
        :param constructionInfo.designTime: 预计设计时间
        :type constructionInfo.designTime: Timestamp
        :param constructionInfo.comment: 说明
        :type constructionInfo.comment: String
        
        Example::
        
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

## 工程计划

## api.construction.ConstructionPlanction

        |DataType:|
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
    
    ### <I> queryConstructionPlanByOrderId

        通过装修单号获取工程计划
        
                |Requests:|
                :param constructionPlan.orderId: 装修单号
        :type constructionPlan.orderId: String
        
        Example::
        
            {
                "constructionPlan.orderId": 1
            }
            
                |Returns:|
                - **constructionPlans**: 工程计划信息列表 , 类型 *constructionInfo*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addConstructionPlan

        添加工程计划
        
                |Requests:|
                :param constructionPlan.orderId: 装修单号
        :type constructionPlan.orderId: String
        :param constructionPlan.name: 装修单号
        :type constructionPlan.name: String
        :param constructionPlan.startTime: 装修单号
        :type constructionPlan.startTime: String
        :param constructionPlan.endTime: 装修单号
        :type constructionPlan.endTime: String
        :param constructionPlan.comment: 装修单号
        :type constructionPlan.comment: String
        
        Example::
        
            {
                "constructionPlan.orderId": "1601010001",
                "constructionPlan.name": "计划",
                "constructionPlan.startTime": "2016-01-01 00:00:00",
                "constructionPlan.endTime": "2016-01-01 00:00:00",
                "constructionPlan.comment": "说明",
            }

    ### <I> deleteConstructionPlan

        删除工程计划
        
                |Requests:|
                :param constructionPlan.cpid: 计划ID
        :type constructionPlan.cpid: Long
        
        Example::
        
            {
                "constructionPlan.cpid": 1
            }

## 工程图片

工程图片 , 施工图片资源管理

## api.construction.ConstructionDrawingAction

        |DataType:|
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
    
    ### <I> queryConstructionDrawingByOrderId

        通过装修单号获取工程图片信息
        
        可以同过工程单ID以及施工进度获取图片信息
        
                |Requests:|
                :param construction.orderId: 装修单号
        :type construction.orderId: String
        :param constructionDrawing.schedule: 施工进度 , <选填>
        :type constructionDrawing.schedule: Short
        
        Example::
        
            {
                "construction.orderId": "1601010001",
                "constructionDrawing.schedule": 1,
            }
            
                |Returns:|
                - **constructionDrawings**: 工程图片信息列表 , 每条数据类型 *constructionDrawing*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> queryConstructionDrawingByCid

        获取工程图片信息
        
        可以同过工程单ID以及施工进度获取图片信息
        
                |Requests:|
                :param constructionDrawing.cid: 工程单ID
        :type constructionDrawing.cid: Long
        :param constructionDrawing.schedule: 施工进度 , <选填>
        :type constructionDrawing.schedule: Short
        
        Example::
        
            {
                "constructionDrawing.cid": 1,
                "constructionDrawing.schedule": 1,
            }
            
                |Returns:|
                - **constructionDrawings**: 工程图片信息列表 , 每条数据类型 *constructionDrawing*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addConstructionDrawing

        添加工程图片信息
        
                |Requests:|
                :param constructionDrawing.cid: 工程单ID
        :type constructionDrawing.cid: Long
        :param constructionDrawing.name: 名称
        :type constructionDrawing.name: String
        :param constructionDrawing.url: 图片路径
        :type constructionDrawing.url: String
        :param constructionDrawing.invurl: 图片路径 , 保留
        :type constructionDrawing.invurl: String
        :param constructionDrawing.filesize: 文件大小
        :type constructionDrawing.filesize: Integer
        :param constructionDrawing.type: 类型
        :type constructionDrawing.type: Short
        :param constructionDrawing.schedule: 施工进度
        :type constructionDrawing.schedule: Short
        
        Example::
        
            {
                "constructionDrawing.cid": 1,
                "constructionDrawing.name": "",
                "constructionDrawing.invurl": "",
                "constructionDrawing.url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "constructionDrawing.filesize": 0,
                "constructionDrawing.type": 0,
                "constructionDrawing.schedule": 1
            }
            
    ### <I> addConstructionDrawings

        批量工程图片信息
        
                |Requests:|
                :param constructionDrawing[n].cid: 工程单ID
        :type constructionDrawing[n].cid: Long
        :param constructionDrawing[n].name: 名称
        :type constructionDrawing[n].name: String
        :param constructionDrawing[n].url: 图片路径
        :type constructionDrawing[n].url: String
        :param constructionDrawing[n].invurl: 图片路径 , 保留
        :type constructionDrawing[n].invurl: String
        :param constructionDrawing[n].filesize: 文件大小
        :type constructionDrawing[n].filesize: Integer
        :param constructionDrawing[n].type: 类型
        :type constructionDrawing[n].type: Short
        :param constructionDrawing[n].schedule: 施工进度
        :type constructionDrawing[n].schedule: Short
        
        Example::
        
            {
                "constructionDrawing[n].cid": 1,
                "constructionDrawing[n].name": "",
                "constructionDrawing[n].invurl": "",
                "constructionDrawing[n].url": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "constructionDrawing[n].filesize": 0,
                "constructionDrawing[n].type": 0,
                "constructionDrawing[n].schedule": 1
            }
            
    ### <I> deleteConstructionDrawing

        删除工程图片信息
        
                |Requests:|
                :param constructionDrawing.cdid: 图片ID
        :type constructionDrawing.cdid: Long
        
        Example::

            {
                "chanDrawing.cdid": 1
            }

## 质检

## api.construction.QualiterAction

        |DataType:|
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
    
    ### <I> queryQualiter

        通过装修单号获取质检信息
        
                |Requests:|
                :param qualiter.orderId: 装修单号
        :type qualiter.orderId: String
        
        Example::
        
            {
                "qualiter.orderId: "1601010001"
            }
        
                |Returns:|
                - **qualiters**: 质检信息列表 , 每条数据类型 *qualiter*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addQualiter

        添加质检
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**
        
                |Requests:|
                :param qualiter.decoration.orderId: 装修单号
        :type qualiter.decoration.orderId: String
        :param qualiter.user.uid: 质检ID
        :type qualiter.user.uid: Long
        
        Example::
        
            {
                "qualiter.decoration.orderId: "1601010001",
                "qualiter.user.uid": 1
            }

    ### <I> deleteQualiter

        删除质检

                |Requests:|
                :param qualiter.qid: 质检ID
        :type qualiter.qid: Long

        Example::

        {
            "qualiter.qid: 1
        }

## 施工人员

工程各环节中施工人员信息管理

## api.construction.ConstructerAction

        |DataType:|
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

    ### <I> queryConstructerByOrderId

        通过装修单号获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息
        
        如果schedule没有传值将返回装修单号对应的所有施工人员信息
        
        施工人员状态为初始(0)
        
                |Requests:|
                :param constructer.orderId: 装修单号
        :type constructer.orderId: String
        :param constructer.schedule: 施工进度
        :type constructer.schedule: Short
        :param constructer.csid: 施工进度ID
        :type constructer.csid: Long
        
        Example::
        
            {
                "constructer.orderId": "1601010001",
                "constructer.schedule": 1,
                "constructer.csid": 1
            }
            
                |Returns:|
                - **constructers**: 施工人员信息列表 , 每条数据类型 *constructer*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> queryConstructerByCid

        通过工程单ID获取施工人员信息 , 同时可以利用schedule获取具体工程环节人员信息
        
        如果schedule没有传值将返回装修单号对应的所有施工人员信息
        
        施工人员状态为初始(0)
        
                |Requests:|
                :param constructer.cid: 工程单ID
        :type constructer.cid: Long
        :param constructer.schedule: 施工进度
        :type constructer.schedule: Short
        :param constructer.csid: 施工进度ID
        :type constructer.csid: Long
        
        Example::
        
            {
                "constructer.cid:1,
                "constructer.schedule": 1,
                "constructer.csid": 1
            }
        
                |Returns:|
                - **constructers**: 施工人员信息列表 , 每条数据类型 *constructer*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryConstructerByCrid

        通过施工人员ID获取信息
        
                |Requests:|
                :param constructer.crid: 施工人员ID
        :type constructer.crid: Long
        
        Example::
        
            {
                "constructer.crid: 1
            }
        
                |Returns:|
                - **constructer**: 施工人员信息 , 类型 *constructer*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> addConstructer

        添加施工人员信息
        
        判断工程单是否存在 , 不存在添加失败 , 错误信息 **120020 工程单不存在**
        
        判断施工环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        判断施工环节状态是否为0(初始) , 错误信息 **120026 工程环节未开工**
        
        判断工人对应人员信息是否存在 , 不存在 , 错误信息 **220005 员工不存在**
        
        判断同一工程和同一施工进度中 , 被添加的施工人员是否已经存在 , 存在添加失败 , 错误信息 **当前工人已经添加,不能重复添加同一工人**
        
                |Requests:|
                :param constructer.cid: 工程单ID
        :type constructer.cid: Long
        :param constructer.schedule: 施工进度
        :type constructer.schedule: Short
        :param constructer.user.userId: 施工人员编号
        :type constructer.user.userId: String
        
        Example::
        
            {
                "constructer.cid:1,
                "constructer.schedule": 1,
                "constructer.user.userId": "U0001"
            }
            
    ### <I> updateConstructerForRate

        更新施工人员信息
        
        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**
        
                |Requests:|
                :param constructer.crid: 施工人员ID
        :type constructer.crid: Long
        :param constructer.rate: 评级
        :type constructer.rate: Short
        :param constructer.rate1: 评级
        :type constructer.rate1: Short
        :param constructer.rate2: 评级
        :type constructer.rate2: Short
        :param constructer.assessment: 评价
        :type constructer.assessment: String
        
        Example::
        
            {
                "constructer.cid:1,
                "constructer.rate": 5,
                "constructer.rate1": 5,
                "constructer.rate2": 5,
                "constructer.assessment": "评价信息"
            }

    ### <I> rateConstructer

        评级
        
        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**
        
        判断状态是否为2(推送) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**
        
        更新状态为3(完成) , 更新完成时间
        
                |Requests:|
                :param constructer.crid: 施工人员ID
        :type constructer.crid: Long
        :param constructer.rate: 评级
        :type constructer.rate: Short
        :param constructer.rate1: 评级
        :type constructer.rate1: Short
        :param constructer.rate2: 评级
        :type constructer.rate2: Short
        :param constructer.assessment: 评价
        :type constructer.assessment: String
        
        Example::
        
            {
                "constructer.cid:1,
                "constructer.rate": 5,
                "constructer.rate1": 5,
                "constructer.rate2": 5,
                "constructer.assessment": "评价信息"
            }

    ### <I> sendConstructer

        推送
        
        判断施工人员是否存在 , 不存在更新失败 , 错误信息 **120021 施工人员不存在**
        
        判断状态是否为0(初始) , 其他状态 , 错误信息 **120022 施工人员状态不可操作**
        
        更新状态为1(推送) , 更新推送时间
        
                |Requests:|
                :param constructer.crid: 施工人员ID
        :type constructer.crid: Long
        
        Example::
        
            {
                "constructer.cid:1
            }
            
    ### <I> deleteConstructer

        删除施工人员信息 , 更新施工人员状态为失效(1)
        
        判断删除施工人员存在工费信息 , 存在不能删除 , 错误信息 **120023 施工人员存在工费,不可删除**
        
                |Requests:|
                :param constructer.crid: 施工人员ID
        :type constructer.crid: Long
        
        Example::
        
            {
                "constructer.crid:1
            }

## 工程辅料

## api.construction.ConstructionAccessoryAction

        |DataType:|
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
    
    ### <I> pageConstructionAccessory

        分页方式获取工程辅料信息 , 根据工程单ID获取 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 工程辅料信息列表 , 每条数据类型 *constructionAccessory*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addConstructionAccessory

        添加工程辅料信息
        
        判断工程单是否存在 , 不存在 , 错误信息 **120020 工程单不存在**
        
                |Requests:|
                :param constructionAccessory.cid: 工程单ID
        :type constructionAccessory.cid: Long
        :param constructionAccessory.aoods.aid: 辅材ID
        :type constructionAccessory.aoods.aid: Long
        :param constructionAccessory.checkup: 验证标识
        :type constructionAccessory.checkup: Short
        :param constructionAccessory.numLimit: 数量上限
        :type constructionAccessory.numLimit: Integer
        
        Example::
        
            {
                "constructionAccessory.cid": 1,
                "constructionAccessory.aoods.aid": 1,
                "constructionAccessory.checkup": 0,
                "constructionAccessory.numLimit": 1000000
            }
            
    ### <I> updateConstructionAccessory

        更新工程辅料信息
        
                |Requests:|
                :param constructionAccessory.caid: 工程辅料ID
        :type constructionAccessory.caid: Long
        :param constructionAccessory.checkup: 验证标识
        :type constructionAccessory.checkup: Short
        :param constructionAccessory.numLimit: 数量上限
        :type constructionAccessory.numLimit: Integer
        
        Example::
        
            {
                "constructionAccessory.caid": 1,
                "constructionAccessory.checkup": 0,
                "constructionAccessory.numLimit": 1000000
            }

## 返工

返工信息管理

## api.construction.ReworkAction

        |DataType:|
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
    
    ### <I> pageReworkByOrderId

        分页方式通过装修单号获取返工信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 返工信息列表 , 每条数据类型 *rework*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addRework

        添加返工信息
        
                |Requests:|
                :param rework.orderId: 装修单号
        :type rework.orderId: String
        :param rework.createTime: 返工时间
        :type rework.createTime: String
        :param rework.reworkDes: 说明
        :type rework.reworkDes: String
        
        Example::
        
            {
                "rework.orderId": "1601010001",
                "rework.createTime": "2016-01-01",
                "rework.reworkDes": "说明"
            }
            
    ### <I> updateRework

        更新返工信息
        
                |Requests:|
                :param rework.rwId: 返工信息ID
        :type rework.rwId: Integer
        :param rework.createTime: 返工时间
        :type rework.createTime: String
        :param rework.reworkDes: 说明
        :type rework.reworkDes: String
        
        Example::
        
            {
                "rework.rwId": 3,
                "rework.createTime": "2016-01-01",
                "rework.reworkDes": "说明"
            }
            
    ### <I> deleteRework

        批量删除返工信息
        
                |Requests:|
                :param rwIds[n]: 返工信息ID列表 , 每条数据类型 Integer
        :type rwIds[n]: List
        
        Example::
        
            {
                "rwIds[0]": 3,
                "rwIds[1]": 4
            }
            
    ### <I> queryReworkDrawingByReworkId

        通过返工信息ID查询返工信息图片
        
                |Requests:|
                :param reworkDrawing.rwId: 返工信息ID
        :type reworkDrawing.rwId: Integer
        
        Example::
        
            {
                "reworkDrawing.rwId": 3,
            }
            
                |Returns:|
                - **reworkDrawings**: 图片信息列表 , 每条数据类型 *reworkDrawing*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addReworkDrawing

        添加返工图片信息
        
                |Requests:|
                :param reworkDrawing.rwId: 返工信息ID
        :type reworkDrawing.rwId: Integer
        :param reworkDrawing.rwdName: 名称
        :type reworkDrawing.rwdName: String
        :param reworkDrawing.rwdUrl: 路径
        :type reworkDrawing.rwdUrl: String
        :param reworkDrawing.rwdAddUrl: 路径 , 保留字段
        :type reworkDrawing.rwdAddUrl: String
        
        Example::
        
            {
                "reworkDrawing.rwId": 3,
                "reworkDrawing.rwdName": "",
                "reworkDrawing.rwdUrl": "/upload/Imag/6/5/9/6/e11e94473baaa4887a0877569.jpg",
                "reworkDrawing.rwdAddUrl": "",
            }
            
    ### <I> deleteReworkDrawingById

        删除返工图片信息
        
                |Requests:|
                :param reworkDrawing.rwdId: 图片信息
        :type reworkDrawing.rwdId: Integer
        
        Example::
        
            {
                "reworkDrawing.rwdId": 3,
            }

## 巡检记录

巡检记录信息管理

## api.construction.InspectionRecordAction

        |DataType:|
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
    
    ### <I> pageInspectionRecordByOrderId

        分页方式通过装修单号获取巡检记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 巡检记录信息列表 , 每条数据类型 *inspectionRecord*
        :type paging.data: List
    
        Example::
        
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
            
    ### <I> addInspectionRecord

        添加巡检记录信息
        
                |Requests:|
                :param inspectionRecord.orderId: 装修单号
        :type inspectionRecord.orderId: String
        :param inspectionRecord.orderAddr: 订单地址
        :type inspectionRecord.orderAddr: String
        :param inspectionRecord.startTime: 开始时间
        :type inspectionRecord.startTime: String
        :param inspectionRecord.endTime: 结束时间
        :type inspectionRecord.endTime: String
        :param inspectionRecord.recordDes: 说明
        :type inspectionRecord.recordDes: String
        
        Example::
        
            {
                "inspectionRecord.orderId": "1601010001",
                "inspectionRecord.orderAddr": "楼盘",
                "inspectionRecord.startTime": "2016-01-01 15:30:30",
                "inspectionRecord.endTime": "2016-01-01 19:32:30",
                "inspectionRecord.recordDes": "说明"
            }
            
    ### <I> updateInspectionRecord

        更新巡检记录信息
        
                |Requests:|
                :param inspectionRecord.irId: 巡检信息ID
        :type inspectionRecord.irId: Integer
        :param inspectionRecord.startTime: 开始时间
        :type inspectionRecord.startTime: String
        :param inspectionRecord.endTime: 结束时间
        :type inspectionRecord.endTime: String
        :param inspectionRecord.recordDes: 说明
        :type inspectionRecord.recordDes: String
        
        Example::
        
            {
                "inspectionRecord.irId": 1,
                "inspectionRecord.startTime": "2016-01-01 15:30:30",
                "inspectionRecord.endTime": "2016-01-01 19:32:30",
                "inspectionRecord.recordDes": "说明"
            }
            
    ### <I> deleteInspectionRecord

        批量删除巡检记录信息
        
                |Requests:|
                :param irIds[0]: 巡检信息ID列表 , 每条数据类型 Integer
        :type irIds[0]: List
        
        Example::
        
            {
                "irIds[0]": 3,
                "irIds[1]": 4
            }
            
## 客服

### 投诉

投诉记录信息管理

## api.construction.InspectionRecordAction

        |DataType:|
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
    
    ### <I> pageCustomerServiceComplaint

        分页方式通过装修单号获取投诉信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 投诉信息列表 , 每条数据类型 *customerServiceComplaint*
        :type paging.data: List
    
        Example::
        
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
    
    ### <I> addCustomerServiceComplaint

        添加投诉信息
        
                |Requests:|
                :param customerServiceComplaint.orderId: 装修单号
        :type customerServiceComplaint.orderId: String
        :param customerServiceComplaint.level: 等级 , 包括: 0:标准 , 1:重要
        :type customerServiceComplaint.level: Integer
        :param customerServiceComplaint.createTime: 创建时间
        :type customerServiceComplaint.createTime: String
        :param customerServiceComplaint.customerName: 客户名
        :type customerServiceComplaint.customerName: String
        :param customerServiceComplaint.des: 说明
        :type customerServiceComplaint.des: String
    
        Example::
        
            {
                "customerServiceComplaint.orderId": "1601010001",
                "customerServiceComplaint.level": 0,
                "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
                "customerServiceComplaint.customerName": "王先生",
                "customerServiceComplaint.des": "说明"
            }
            
    ### <I> updateCustomerServiceComplaint

        更新投诉信息
        
                |Requests:|
                :param customerServiceComplaint.cscId: 投诉信息ID
        :type customerServiceComplaint.cscId: Integer
        :param customerServiceComplaint.orderId: 装修单号
        :type customerServiceComplaint.orderId: String
        :param customerServiceComplaint.level: 等级 , 包括: 0:标准 , 1:重要
        :type customerServiceComplaint.level: Integer
        :param customerServiceComplaint.createTime: 创建时间
        :type customerServiceComplaint.createTime: String
        :param customerServiceComplaint.customerName: 客户名
        :type customerServiceComplaint.customerName: String
        :param customerServiceComplaint.des: 说明
        :type customerServiceComplaint.des: String
        
        Example::
        
            {
                "customerServiceComplaint.cscId": 1,
                "customerServiceComplaint.orderId": "1601010001",
                "customerServiceComplaint.level": 0,
                "customerServiceComplaint.createTime": "2016-01-01 15:30:30",
                "customerServiceComplaint.customerName": "王先生",
                "customerServiceComplaint.des": "说明"
            }
            
    ### <I> handleCustomerServiceComplaint

        处理投诉信息
        
                |Requests:|
                :param customerServiceComplaint.cscId: 投诉信息ID
        :type customerServiceComplaint.cscId: String
        :param customerServiceComplaint.handle: 处理信息
        :type customerServiceComplaint.handle: String
        
        Example::
        
            {
                "customerServiceComplaint.cscId": 1,
                "customerServiceComplaint.handle": "处理说明"
            }
            
    ### <I> deleteCustomerServiceComplaint

        批量删除投诉信息
        
                |Requests:|
                :param cscIds[n]: 投诉信息ID列表 , 每条数据类型 Long
        :type cscIds[n]: List
        
        Example::
        
            {
                "cscIds[0]": 1,
                "cscIds[1]": 2
            }
            
### 保修

保修记录信息管理

## api.construction.CustomerServiceGuaranteeAction

        |DataType:|
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
    
    ### <I> pageCustomerServiceGuarantee

        分页方式通过装修单号获取保修信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 保修信息列表 , 每条数据类型 *customerServiceGuarantee*
        :type paging.data: List
    
        Example::
        
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
    
    ### <I> addCustomerServiceGuarantee

        添加保修信息
        
                |Requests:|
                :param customerServiceGuarantee.orderId: 装修单号
        :type customerServiceGuarantee.orderId: String
        :param customerServiceGuarantee.customerName: 客户名
        :type customerServiceGuarantee.customerName: String
        :param customerServiceGuarantee.guaranteeTime: 保修时间
        :type customerServiceGuarantee.guaranteeTime: String
        :param customerServiceGuarantee.guaranteeDes: 说明
        :type customerServiceGuarantee.guaranteeDes: String
        
        Example::
        
            {
                "customerServiceGuarantee.csgId": 1,
                "customerServiceGuarantee.orderId": "1601010001",
                "customerServiceGuarantee.customerName": "王先生",
                "customerServiceGuarantee.guaranteeTime": "2016-01-01 15:30:30",
                "customerServiceGuarantee.guaranteeDes": "说明"
            }
            
    ### <I> updateCustomerServiceGuarantee

        更新保修信息
        
                |Requests:|
                :param customerServiceGuarantee.csgId: 保修信息ID
        :type customerServiceGuarantee.csgId: Integer
        :param customerServiceGuarantee.guaranteeDes: 说明
        :type customerServiceGuarantee.guaranteeDes: String
        
        Example::
        
            {
                "customerServiceGuarantee.csgId": 1,
                "customerServiceGuarantee.guaranteeDes": "说明"
            }
            
    ### <I> deleteCustomerServiceGuarantee

        删除保修信息
        
                |Requests:|
                :param csgIds[n]: 保修信息ID列表 , 每条数据类型 Long
        :type csgIds[n]: List
        
        Example::
        
            {
                "csgIds[0]": 1,
                "csgIds[1]": 2
            }
            
### 回访

回访记录信息管理

## api.construction.CustomerServiceBackVisitAction

        |DataType:|
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
    
    ### <I> pageCustomerServiceBackVisit

        分页方式通过装修单号获取回访信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 回访信息列表 , 每条数据类型 *customerServiceBackVisit*
        :type paging.data: List

        Example::
        
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
            
    ### <I> addCustomerServiceBackVisit

        添加回访信息
        
                |Requests:|
                :param customerServiceBackVisit.orderId: 装修单号
        :type customerServiceBackVisit.orderId: String
        :param customerServiceBackVisit.orderAddr: 订单地址
        :type customerServiceBackVisit.orderAddr: String
        :param customerServiceBackVisit.customerName: 客户名
        :type customerServiceBackVisit.customerName: String
        :param customerServiceBackVisit.backVisitTime: 保修时间
        :type customerServiceBackVisit.backVisitTime: String
        :param customerServiceBackVisit.backVisitDes: 说明
        :type customerServiceBackVisit.backVisitDes: String
        
        Example::
        
            {
                "customerServiceBackVisit.csgId": 1,
                "customerServiceBackVisit.orderId": "1601010001",
                "customerServiceBackVisit.orderAddr": "楼盘",
                "customerServiceBackVisit.customerName": "王先生",
                "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
                "customerServiceBackVisit.backVisitType": 1,
                "customerServiceBackVisit.backVisitDes": "说明"
            }
            
    ### <I> updateCustomerServiceBackVisit

        更新回访信息
        
                |Requests:|
                :param customerServiceBackVisit.csbvId: 回访信息ID
        :type customerServiceBackVisit.csbvId: String
        :param customerServiceBackVisit.orderId: 装修单号
        :type customerServiceBackVisit.orderId: String
        :param customerServiceBackVisit.orderAddr: 订单地址
        :type customerServiceBackVisit.orderAddr: String
        :param customerServiceBackVisit.customerName: 客户名
        :type customerServiceBackVisit.customerName: String
        :param customerServiceBackVisit.backVisitTime: 保修时间
        :type customerServiceBackVisit.backVisitTime: String
        :param customerServiceBackVisit.backVisitDes: 说明
        :type customerServiceBackVisit.backVisitDes: String
        
        Example::
        
            {
                "customerServiceBackVisit.csbvId": 1,
                "customerServiceBackVisit.backVisitTime": "2016-01-01 15:30:30",
                "customerServiceBackVisit.backVisitType": 1,
                "customerServiceBackVisit.backVisitDes": "说明"
            }
            
    ### <I> deleteCustomerServiceBackVisit

        删除回访信息
        
                |Requests:|
                :param csbvIds[n]: 回访信息ID列表 , 每条数据类型 Integer
        :type csbvIds[n]: String
        
        Example::
        
            {
                "csbvIds[0]": 1,
                "csbvIds[1]": 2
            }
            
## 验收

工程信息验收过程 , 可以针对工程过程中的监理和质检进行评分和评价 , 以及针对整体订单施工情况进行评分

## api.construction.AcceptanceAction

        |DataType:|
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

    ### <I> queryAcceptance

        通过装修单号获取验收信息
        
                |Requests:|
                :param acceptance.orderId: 装修单号
        :type acceptance.orderId: String
        
        Example::
        
            {
                "acceptance.orderId": "1601010001"
            }
            
                |Returns:|
                - **acceptance**: 验收信息 , 每条数据类型 *acceptance*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> updateAcceptance

        保存验收信息
        
        :param acceptance.orderId: 装修单号
        :type acceptance.orderId: String
        :param acceptance.acceptanceTime: 验收时间
        :type acceptance.acceptanceTime: String
        :param acceptance.waterwayQuality: 水路工程质量评价
        :type acceptance.waterwayQuality: Integer
        :param acceptance.waterwayServer: 水路服务质量评价
        :type acceptance.waterwayServer: Integer
        :param acceptance.waterwayHygiene: 水路卫生质量评价
        :type acceptance.waterwayHygiene: Integer
        :param acceptance.waterwayDes: 水路评价
        :type acceptance.waterwayDes: String
        :param acceptance.circuitQuality: 电路工程质量评价
        :type acceptance.circuitQuality: Integer
        :param acceptance.circuitServer: 电路服务质量评价
        :type acceptance.circuitServer: Integer
        :param acceptance.circuitHygiene: 电路卫生质量评价
        :type acceptance.circuitHygiene: Integer
        :param acceptance.circuitDes: 电路评价
        :type acceptance.circuitDes: String
        :param acceptance.bricklayQuality: 瓦工程质量评价
        :type acceptance.bricklayQuality: Integer
        :param acceptance.bricklayServer: 瓦工服务质量评价
        :type acceptance.bricklayServer: Integer
        :param acceptance.bricklayHygiene: 瓦工卫生质量评价
        :type acceptance.bricklayHygiene: Integer
        :param acceptance.bricklayDes: 瓦工评价
        :type acceptance.bricklayDes: String
        :param acceptance.carpentQuality: 木工程质量评价
        :type acceptance.carpentQuality: Integer
        :param acceptance.carpentServer: 木工服务质量评价
        :type acceptance.carpentServer: Integer
        :param acceptance.carpentHygiene: 木工卫生质量评价
        :type acceptance.carpentHygiene: Integer
        :param acceptance.carpentDes: 木工评价
        :type acceptance.carpentDes: String
        :param acceptance.oilQuality: 油工工程质量评价
        :type acceptance.oilQuality: Integer
        :param acceptance.oilServer: 油工服务质量评价
        :type acceptance.oilServer: Integer
        :param acceptance.oilHygiene: 油工卫生质量评价
        :type acceptance.oilHygiene: Integer
        :param acceptance.oilDes: 油工评价
        :type acceptance.oilDes: String
        :param acceptance.supervisQuality: 监理工程质量评价
        :type acceptance.supervisQuality: Integer
        :param acceptance.supervisServer: 监理服务质量评价
        :type acceptance.supervisServer: Integer
        :param acceptance.supervisHygiene: 监理卫生质量评价
        :type acceptance.supervisHygiene: Integer
        :param acceptance.supervisDes: 监理评价
        :type acceptance.supervisDes: String
        :param acceptance.materialQuality: 主材工程质量评价
        :type acceptance.materialQuality: Integer
        :param acceptance.materialServer: 主材服务质量评价
        :type acceptance.materialServer: Integer
        :param acceptance.materialDes: 主材评价
        :type acceptance.materialDes: String
        :param acceptance.question: 问题
        :type acceptance.question: String
        :param acceptance.propose: 建议
        :type acceptance.propose: String
        :param acceptance.multiple: 评级
        :type acceptance.multiple: Integer
        
        Example::
        
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
