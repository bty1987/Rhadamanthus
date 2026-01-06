# decoration {#decoration}

# 装修
## 订单

装修单信息管理以及相关业务功能

## api.decoration.DecorationAction

        |DataType:|
        #### decoration

    - **doid**: 装修单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **customer**: 客户信息 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    
    - **grade**: 等级 , A/B/C
      - 类型: *String*
    - **type**: 类型 , 0: 半包 , 装修单 , 不包括主材单 , 1: 整装 , 装修+主材单 , 2: 满减 , 主材配比 , 装修打折
      - 类型: *Short*
    - **typeness**: 类型 , 0: 半包 , 1: 整装 , 2: 半价 , 3: 满减 , 4: 减上捡
      - 类型: *Short*
    - **houseType**: 房屋类别 , 包括: 0: 期房 , 1: 现房
      - 类型: *String*
    - **houseClass**: 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
      - 类型: *String*
    - **resourceType**: 资源类型 , 0: 咨询 , 1: 量房
      - 类型: *Short*
    
    - **busitype**: 业务类型ID
      - 类型: *Long*
    
    - **ddid**: 部门ID
      - 类型: *Long*
    - **sdid**: 部门ID
      - 类型: *Long*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **designer**: 设计师 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **quoter**: 报价员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **escorter**: 跟单员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **supervisor**: 监理 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **contracter**: 签单人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **versionId**: 报价版本
      - 类型: *String*
    - **discount**: 默认报价折扣
      - 类型: *Integer*
    - **payScale**: 付款比例
      - 类型: *Integer*
    - **saleScale**: 销售比例
      - 类型: *Integer*
    
    - **presignPrice**: 预签额
      - 类型: *Long*
    - **signPrice**: 合同额
      - 类型: *Long*
    - **factPrice**: 实收额
      - 类型: *Long*
    - **couponCut**: 券优惠额
      - 类型: *Long*
    - **thingCut**: 奖品优惠额
      - 类型: *Long*
    - **notSalesmanRate**: 非业务人员提点
      - 类型: *Integer*
    
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **measureTime**: 量尺时间
      - 类型: *Timestamp*
    - **depositTime**: 定金时间
      - 类型: *Timestamp*
    - **sdesignTime**: 开始设计时间
      - 类型: *Timestamp*
    - **edesignTime**: 结束设计时间
      - 类型: *Timestamp*
    - **presignTime**: 预签时间
      - 类型: *Timestamp*
    - **signTime**: 签单时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **accountTime**: 决算时间
      - 类型: *Timestamp*
    
    - **status**: 状态 , 包括: 0(初始) , 1(定金) , 2(预签) , 3(签约) , 4(重签), 5(废单) , 6(终止) , 7(决算) , 8(完结)
      - 类型: *Short*
    - **designStatus**: 设计状态 , 包括: 0(待设计), 1(设计中), 2(完成)
      - 类型: *Short*
    - **projectStatus**: 工程状态 , 包括: 0(初始) , 1(开工) , 2(完工) , 其他状态关联 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Long*
    - **sourceStatus**: 资源状态 , 包括: 0(待确认) , 1(合同确认) , 2(放线确认)
      - 类型: *Short*
    - **repairStatus**: 维修状态 , 包括: 0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款)
      - 类型: *Short*
    - **balanceStatus**: 结算状态 , 包括: 0(初始) , 1(结算)
      - 类型: *Short*
    - **otherStatus**: 其他状态 , 包括: 1(合尺) , 2(设计费)
      - 类型: *Short*
    
    - **addition**: 附加信息 , 类型 [decorationAddition](./decoration.html#api.decoration.DecorationAdditionAction.decorationAddition)
      - 类型: *Obejct*
    
    - **company**: 装修公司
      - 类型: *Integer*
    - **conpany**: 工程公司
      - 类型: *Integer*
    
        |Filters:|
        - **orderId**: 装修单号
      - 类型: *String*
    - **customerId**: 客户编号
      - 类型: *String*
    - **customerPhone**: 客户电话
      - 类型: *String*
    - **houseNumber**: 楼号
      - 类型: *String*
    - **houseClass**: 房屋类型
      - 类型: *String*
    - **status**: 状态
      - 类型: *String*
    - **otherStatus**: 其他状态
      - 类型: *String*
    - **designerId**: 设计师编号
      - 类型: *String*
    - **salesmanId**: 业务员编号
      - 类型: *String*
    - **supervisorId**: 监理名编号
      - 类型: *String*
    - **designerDepartmentId**: 设计部编号
      - 类型: *String*
    - **salesmanDepartmentId**: 业务部编号
      - 类型: *String*
    - **villageId**: 楼盘编号
      - 类型: *String*

    - **houseArea**: 房屋面积
      - 类型: *String*
    - **signTimeDateRange**: 签单时间 , 例: 2016/01/01-2016/01/02
      - 类型: *String*
    - **createTimeDateRange**: 创建时间 , 例: 2016/01/01-2016/01/02
      - 类型: *String*
    
    ### <I> pageDecoration

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) 
        
        该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位/部门权限/公司等条件控制
        
        该方法只提供基本信息 , 部分重要信息不可显示 , 显示信息包括: 装修单号, 楼盘, 设计师/部门, 业务员/部门, 面积, 状态
        
        该方法可以提供装修单状态作为条件
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
    
    ### <I> pageDecorationForGeneral

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) 
        
        该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位 , 部门权限控制 
        
        该方法查询范围为当前操作公司 , 状态为5(废单)和5(废单)之外状态的装修单
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForCommon

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法获取的信息是通用方式获取 , 在标准获取方式的基础上增加了归属信息 , 客户预付款信息
        
        该方法根据操作人设计部门权限限制 , 装修单状态权限限制 , 当前操作公司限制
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForCompany

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法获取的信息是通用方式获取 , 在标准获取方式的基础上增加了归属信息 , 客户预付款信息
        
        当前操作公司限制
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForGrade

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        默认条件为公司和等级
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForCustomer

        分页方式获取装修单 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        支持电话作为条件查询客户拥有的装修单信息
        
                |Requests:|
                - **customerPhone**: 客户电话
          - 类型: *String*
        
        Example::
        
            {
                "customerPhone": "13000000000"
            }

                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForDesigner

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)

        根据当前操作人员 , 当前操作公司限制 , 返回对应设计师归属的装修单基本信息

                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForDesignerDept

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法根据操作人归属部门 , 返回装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForDesignerManager

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法根据操作人设计部门权限限制 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForSalesman

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        根据当前操作人员 , 当前操作公司限制 , 返回对应业务员归属的装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> pageDecorationForSalesmanDept

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法根据操作人归属部门 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForSalesmanManager

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法根据操作人业务部门权限限制 , 装修单状态权限限制 , 当前操作公司限制 , 返回装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForQuoter

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        根据当前操作人员 , 当前操作公司限制 , 返回对应报价员归属的装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForEscorter

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        根据当前操作人员 , 当前操作公司限制 , 返回对应跟单员归属的装修单基本信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> pageDecorationForBelong

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
        该方法提供归属相关功能装修单查询 , 状态范围作为限制修改归属的条件
        
        该方法获取的信息是标准方式获取 , 返回装修单中基础信息 , 无人员职位 , 部门权限控制 
        
        该方法查询范围为当前操作公司 , 状态为0(初始)/1(定金)/2(预签)/4(重签)的装修单
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
            
    ### <I> queryDecorationByCustomerId

        通过客户ID或客户编号获取装修单 , 返回装修单中基础信息
        
                |Requests:|
                :param decoration.customer.cid: 客户ID
        :type decoration.customer.cid: Long
        :param decoration.customer.no: 客户编号
        :type decoration.customer.no: String
        
        Example::
        
            {
                "decoration.customer.cid": 1
            }
            
                |Returns:|
                - **decorations**: 装修单列表 , 每条数据类型 *decoration*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryDecorationByOrderId

        通过装修单号获取装修单信息 , 返回装修单中基础信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        该方法增加显示装修单归属公司编号 , 该编号利用加密方式进行处理 , 加密过程出现错误 , 错误信息 **230015 公司不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **decoration**: 装修单信息 , 类型 *decoration*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryDecorationForCommonByOrderId

        通过装修单号获取装修单 , 根据操作人员信息控制客户敏感信息是否显示 , 返回装修单中基础信息
        
        该方法增加显示装修单归属公司编号 , 该编号利用加密方式进行处理 , 加密过程出现错误 , 错误信息 **230015 公司不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **decoration**: 装修单信息 , 类型 *decoration*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> checkDecoration

        通过指定条件验证装修单是否存在

        条件参数传递方式参照 [filter](../check_rule.html#filter)

                |Returns:|
                - **decorations**: 装修单信息 , 类型 *decorations*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> createDecoration

        创建装修单 , 客户与装修单一一绑定 , 不能同时拥有多个装修单 , 楼盘号不能重复
        
        判断楼盘楼号是否已经绑定装修单 , 装修单状态为5(废单)和6(终止)除外 , 错误信息 **140034 订单楼盘,楼号已存在**
        
        创建的装修单绑定当前归属公司的默认报价版本
        
        根据装修单基本信息生成装修单信息
        
        根据设计师和业务员生成装修单归属信息 , 包括归属设计/业务对应的人员/部门/分区 , 以及相应的比例等信息
        
        根据设计师和业务员生成附加信息 , 包括设计/业务人员/部门/分区名称 , 保护期等信息
        
        根据当前服务节点信息 , 生成装修单对应的服务信息
        
        生成装修单对应的预算审核信息
        
                |Requests:|
                :param decoration.customer.cid: 客户Id
        :type decoration.customer.cid: Long
        :param decoration.house.hid: 房产ID
        :type decoration.house.hid: Long
        :param decoration.designer.userId: 设计师编号
        :type decoration.designer.userId: String
        :param decoration.salesman.userId: 业务员编号
        :type decoration.salesman.userId: String
        :param decoration.quoter.userId: 报价员编号
        :type decoration.quoter.userId: String
        :param decoration.escorter.userId: 跟单员编号
        :type decoration.escorter.userId: String
        
        :param decoration.grade: 等级
        :type decoration.grade: String
        :param decoration.type: 类型
        :type decoration.type: Short
        :param decoration.typeness: 类型
        :type decoration.typeness: Short
        :param decoration.resourceType: 资源类型
        :type decoration.resourceType: Short
        :param decoration.houseType:  房屋类别 , 包括: 期房 , 现房
        :type decoration.houseType: String
        :param decoration.houseClass: 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
        :type decoration.houseClass: String
        :param decoration.houseArea: 建筑面积
        :type decoration.houseArea: Integer
        :param decoration.notSalesmanRate: 非业务人员比例
        :type decoration.notSalesmanRate: Integer
        
        :param decoration.busitype: 业务类型ID
        :type decoration.busitype: Long
        
        :param decorationInfo.notSalesmanName: 非业务员名
        :type decorationInfo.notSalesmanName: String
        :param decorationInfo.notSalesmanPhone: 非业务员电话
        :type decorationInfo.notSalesmanPhone: String
        :param decorationInfo.notSalesmanContent: 非业务员备注
        :type decorationInfo.notSalesmanContent: String
        :param decorationInfo.backOrderName: 返单人员名
        :type decorationInfo.backOrderName: String
        :param decorationInfo.backOrderPhone: 返单人员电话
        :type decorationInfo.backOrderPhone: String
        :param decorationInfo.backOrderContent: 返单人员备注
        :type decorationInfo.backOrderContent: String
        
        Example::
        
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

    ### <I> createDecorationForAdvance

        创建装修单 , 楼盘号不能重复 , 不针对客户多单进行校验
        
        判断楼盘楼号是否已经绑定装修单 , 装修单状态为5(废单)和6(终止)除外 , 错误信息 **140034 订单楼盘,楼号已存在**
        
        创建的装修单绑定当前归属公司的默认报价版本
        
        根据装修单基本信息生成装修单信息
        
        根据设计师和业务员生成装修单归属信息 , 包括归属设计/业务对应的人员/部门/分区 , 以及相应的比例等信息
        
        根据设计师和业务员生成附加信息 , 包括设计/业务人员/部门/分区名称 , 保护期等信息
        
        根据当前服务节点信息 , 生成装修单对应的服务信息
        
        生成装修单对应的预算审核信息
        
                |Requests:|
                :param decoration.customer.cid: 客户Id
        :type decoration.customer.cid: Long
        :param decoration.house.hid: 房产ID
        :type decoration.house.hid: Long
        :param decoration.designer.userId: 设计师编号
        :type decoration.designer.userId: String
        :param decoration.salesman.userId: 业务员编号
        :type decoration.salesman.userId: String
        :param decoration.quoter.userId: 报价员编号
        :type decoration.quoter.userId: String
        :param decoration.escorter.userId: 跟单员编号
        :type decoration.escorter.userId: String
        
        :param decoration.grade: 等级
        :type decoration.grade: String
        :param decoration.type: 类型
        :type decoration.type: Short
        :param decoration.typeness: 类型
        :type decoration.typeness: Short
        :param decoration.resourceType: 资源类型
        :type decoration.resourceType: Short
        :param decoration.houseType:  房屋类别 , 包括: 期房 , 现房
        :type decoration.houseType: String
        :param decoration.houseClass: 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
        :type decoration.houseClass: String
        :param decoration.houseArea: 建筑面积
        :type decoration.houseArea: Integer
        :param decoration.notSalesmanRate: 非业务人员比例
        :type decoration.notSalesmanRate: Integer
        
        :param decoration.busitype: 业务类型ID
        :type decoration.busitype: Long
        
        :param decorationInfo.notSalesmanName: 非业务员名
        :type decorationInfo.notSalesmanName: String
        :param decorationInfo.notSalesmanPhone: 非业务员电话
        :type decorationInfo.notSalesmanPhone: String
        :param decorationInfo.notSalesmanContent: 非业务员备注
        :type decorationInfo.notSalesmanContent: String
        :param decorationInfo.backOrderName: 返单人员名
        :type decorationInfo.backOrderName: String
        :param decorationInfo.backOrderPhone: 返单人员电话
        :type decorationInfo.backOrderPhone: String
        :param decorationInfo.backOrderContent: 返单人员备注
        :type decorationInfo.backOrderContent: String
        
        Example::
        
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

    ### <I> changeDecorationForAdvance

        更改装修单高级信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        修改装修单高级信息 , 装修单状态为: 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可修改
        
        修改信息包括业务员信息 , 房屋类别 , 房屋类型 , 类型 , 报价员以及跟单员 , 等级
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.house.buildArea: 建筑面积
        :type decoration.house.buildArea: Integer
        :param decoration.house.quoteArea: 计价面积
        :type decoration.house.quoteArea: Integer
        :param decoration.quoter.userId: 报价员编号
        :type decoration.quoter.userId: String
        :param decoration.escorter.userId: 跟单员Id
        :type decoration.escorter.userId: String
        
        :param decoration.grade: 等级
        :type decoration.grade: String
        :param decoration.houseType: 房屋类别 , 包括: 期房 , 现房
        :type decoration.houseType: String
        :param decoration.houseClass: 房屋类型 , 包括: 清水 , 二手 , 别墅 , 阁楼 , 地下等
        :type decoration.houseClass: String
        :param decoration.notSalesmanRate: 非业务人员比例
        :type decoration.notSalesmanRate: Integer
        
        :param decoration.busitype: 业务类型ID
        :type decoration.busitype: Long
        
        :param decorationInfo.notSalesmanName: 非业务员名
        :type decorationInfo.notSalesmanName: String
        :param decorationInfo.notSalesmanPhone: 非业务员电话
        :type decorationInfo.notSalesmanPhone: String
        :param decorationInfo.notSalesmanContent: 非业务员备注
        :type decorationInfo.notSalesmanContent: String

    
        Example::
        
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

    ### <I> changeDecorationForCustomer

        更改装修单归属客户
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.customer.cid: 客户ID
        :type decoration.customer.cid: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.customer.cid": 1
            }

    ### <I> changeDecorationForHouse

        更改装修单归属房产
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断房产是否存在 , 不存在 , 错误信息 **320002 房产不存在**
        
        将修改前后的房产信息生成服务记录
        
                |Requests:|
                :param decoration.orderId: 编号
        :type decoration.orderId: String
        :param decoration.house.hid: 修改房产ID
        :type decoration.house.hid: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.house.hid": 1
            }
            
    ### <I> changeDecorationForOrderId

        更改装修单编号
        
        .. warning::
        
            由于装修单号关联其他信息 , 所以不能轻易修改
            
        判断修改装修单号是否存在 , 已经存在 , 错误信息 **140010 订单编号已经存在**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        根据修改装修单号信息生成服务记录
        
                |Requests:|
                :param decoration.orderId: 原装修单号
        :type decoration.orderId: String
        - **decorationId**: 新装修单号
          - 类型: *String*
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decorationId": "1601010002"
            }
        
    ### <I> changeDecorationForTime

        更改装修单相关时间 , 例: 创建时间 , 签单时间
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        根据修改的时间信息生成服务记录
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        - **timeType**: 修改时间类型 , 1: 创建时间 , 2: 签单时间
          - 类型: *Integer*
        - **dateTime**: 修改时间
          - 类型: *Timestamp*
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "timeType": 1,
                "dateTime": "2016-01-01 00:00:00"
            }
            
    ### <I> changeDecorationForVersionId

        更改装修单报价版本
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可更改 , 错误信息 **140004 装修单状态不可操作**
        
        装修单更改报价版本之后 , 已经存在的报价相关内容将被删除 , 保证报价关联的版本信息一致
        
        .. warning::
        
            已经存在的报价相关内容将被删除 , 保证报价关联的版本信息一致
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.versionId: 报价版本
        :type decoration.versionId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.versionId": "QV001"
            }

    ### <I> changeDecorationForPayScale

        修改装修单付款比例
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String

        Example::

            {
                "decoration.orderId": "1601010001"
            }
            
    ### <I> changeDecorationForStatus

        修改装修单状态
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        .. warning::
        
            由于装修单状态较多关联信息以及节点控制 , 更改之后可能引发数据问题

                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.status: 状态
        :type decoration.status: Short

        Example::

            {
                "decoration.orderId": "1601010001",
                "decoration.status": 1
            }

    ### <I> changeDecorationForRepairStatus

        修改装修单保修状态
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.repairStatus: 保修状态
        :type decoration.repairStatus: Short

        Example::

            {
                "decoration.orderId": "1601010001",
                "decoration.repairStatus": 0
            }
            
    ### <I> obsoleteDecoration

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
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }
            
    ### <I> terminalDecoration

        终止
        
        装修单状态为2(预签) , 通过预付款完成扣款动作 , 同时验证预付款余额
        
        装修单状态为3(签约) , 通过已交款项完成扣款动作
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断涉及款项总额与交款总额 , 如果超过 , 错误信息 **150025 款项金额不正确**
        
        根据涉及款项信息 , 生成对应款项 , 交款总额如有结余 , 生成合同退款
        
        更新装修单状态为6(终止) , 生成装修单操作记录
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        :param decorationPayments[n].paymentType: 款项类型
        :type decorationPayments[n].paymentType: String
        :param decorationPayments[n].referMoney: 应收款
        :type decorationPayments[n].referMoney: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                
                "decorationPayments[0].paymentType": "合同退款",
                "decorationPayments[0].referMoney": 100
            }

    ### <I> subDecorationForQuotationTime

        装修单拷贝报价限制次数减一
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }

    ### <I> updateDecorationForAdvance

        更改装修单高级信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        修改装修单高级信息 , 装修单状态为: 0(初始)/1(定金)/2(预签)/4(重签) , 其他状态不可修改
        
        修改信息包括类型, 业务类型, 非业务提点
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.type: 类型
        :type decoration.type: Short
        :param decoration.typeness: 类型
        :type decoration.typeness: Short
        :param decoration.notSalesmanRate: 非业务人员比例
        :type decoration.notSalesmanRate: Integer
    
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.type": 0,
                "decoration.typeness": 0,
                "decoration.notSalesmanRate": 0
            }

    ### <I> updateDecorationForPayScale

        更新装修单付款比例
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }

    ### <I> updateDecorationForSaleScale

        更新装修单销售比例
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }

## 信息

装修单相关信息

## api.decoration.DecorationInfoAction

        |DataType:|
        #### decorationInfo

    - **diid**: 信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **notSalesmanName**: 非业务员名
      - 类型: *String*
    - **notSalesmanPhone**: 非业务员电话
      - 类型: *String*
    - **notSalesmanContent**: 非业务员备注
      - 类型: *String*
    - **backOrderName**: 返单人员名
      - 类型: *String*
    - **backOrderPhone**: 返单人员电话
      - 类型: *String*
    - **backOrderContent**: 返单人员备注
      - 类型: *String*
    - **isConfirmPricture**: 确认图纸 , 0: 已确认 , 1: 待确认
      - 类型: *Short*
    - **isConfirmDesign**: 确认设计 , 0: 已确认 , 1: 待确认
      - 类型: *Short*
    
    ### <I> queryDecorationInfoByOrderId

        通过装修单号获取装修单信息
        
                |Requests:|
                :param decorationInfo.orderId: 装修单号
        :type decorationInfo.orderId: String
    
    
        Example::
        
            {
                "decorationInfo.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationInfo**: 合同信息 , 类型 *decorationInfo*
          - 类型: *Object*
    
        Example::
        
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
            
    ### <I> sendDecorationInfoForConfirm

        发送确认装修信息消息
        
                |Requests:|
                :param decorationInfo.orderId: 装修单号
        :type decorationInfo.orderId: String
        :param decorationInfo.isConfirmPricture: 施工图确认
        :type decorationInfo.isConfirmPricture: Short
        :param decorationInfo.isConfirmDesign: 施工图确认
        :type decorationInfo.isConfirmDesign: Short
        
        Example::
        
            {
                "decorationInfo.orderId": "1601010001",
                "decorationInfo.isConfirmPricture": 1,
                "decorationInfo.isConfirmDesign": 1
            }
            
    ### <I-C> confirmDecorationInfo

        确认装修单信息 , 其中包括施工图确认
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**
        
                |Requests:|
                :param decorationInfo.orderId: 信息ID
        :type decorationInfo.orderId: Long
        :param decoration.customer.phone: 电话
        :type decoration.customer.phone: String
        
        :param decorationInfo.isConfirmPricture: 施工图确认
        :type decorationInfo.isConfirmPricture: Short
        :param decorationInfo.isConfirmDesign: 设计确认
        :type decorationInfo.isConfirmDesign: Short
        
        Example::
        
            {
                "constructionInfo.orderId": 1,
                "decoration.customer.phone": "138xxxx9283",
                
                "constructionInfo.isConfirmPricture": 1,
                "constructionInfo.isConfirmDesign": 1
            }
            
## 附加

装修单附加信息

## api.decoration.DecorationAdditionAction

        |DataType:|
        #### decorationAddition

    - **daid**: 附加信息ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **designer**: 设计师
      - 类型: *String*
    - **designDepartment**: 设计部
      - 类型: *String*
    - **designRegion**: 设计大区
      - 类型: *String*
    - **salesman**: 业务员
      - 类型: *String*
    - **salesDepartment**: 业务部
      - 类型: *String*
    - **salesRegion**: 业务大区
      - 类型: *String*
    
    ### <I> queryDecorationAdditionByOrderId

        通过装修单号获取附加信息
        
                |Requests:|
                :param decorationAddition.orderId: 装修单号
        :type decorationAddition.orderId: String
    
    
        Example::
        
            {
                "decorationAddition.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationAddition**: 合同信息 , 类型 *decorationAddition*
          - 类型: *Object*
    
        Example::
        
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
            
    ### <I> queryDecorationConfig

        获取装修单配置信息 , 例如半价配置等
        
        满减配比 , 字段说明 , id(编号)/n(名称)/mm(主材配比)/dd(折扣-十进制)/db(折扣基数)/dt(装修单类型)/sr(服务费比例)/v(显示标识)
        
                |Requests:|
                - **typeness**: 类型列表 , 每条数据类型 Short , 半包/半价/...
          - 类型: *List*
    
    
        Example::
        
            {
                "typeness[0]": 0
                "typeness[1]": 1
            }
            
                |Returns:|
                - **config**: 配置信息 , 类型 Map <String, Object>
          - 类型: *Object*
    
        Example::
        
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
            
    ### <I-C> queryDecorationSchedule

        获取装修单对应的进度信息 , 进度包括: 
        
        0(订单生成) , 1(预算) , 2(合同签单) , 3(签单设计方案完成) , 4(开工设计方案完成) , 
        
        5(铲大白) , 6(放线) , 7(力工) , 8(水暖) , 9(电工) , 10(瓦工) , 11(地面找平) , 
        
        12(木工) , 13(油工) , 14(决算) , 15(保洁)
        
        根据装修单的状态/设计状态/工程状态 , 报价 , 装修信息的效果图完成进度的确认
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
    
    
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }

## 量房

装修量尺信息

## api.decoration.DecorationMeasureAction

        |DataType:|
        #### decorationMeasure

    - **dmid**: 量房ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **applayTime**: 申请时间
      - 类型: *Timestamp*
    - **content**: 说明
      - 类型: *String*
    - **actualTime**: 量房时间
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
    - **measurer**: 量房员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Long*
    
    ### <I> pageDecorationMeasure

    ### <I> queryDecorationMeasure

    ### <I> applayDecorationMeasure

    ### <I> sendDecorationMeasure

    ### <I> confirmDecorationMeasure

    ### <I> successDecorationMeasure

    ### <I> failureDecorationMeasure

## 合同

装修单合同相关操作

## api.decoration.DecorationContractAction

        |DataType:|
        #### decorationContract

    - **dcid**: 合同ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **cid**: 合同ID
      - 类型: *Long*
    - **no**: 合同编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **title**: 标题
      - 类型: *String*
    - **download**: 下载地址
      - 类型: *String*
    - **viewpdf**: 查看地址
      - 类型: *String*
    - **filesize**: 文件大小
      - 类型: *Integer*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **signner**: 签署人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comsignTime**: 公司签时间
      - 类型: *Timestamp*
    - **cussignTime**: 客户签时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地)
      - 类型: *Short*
    - **ishow**: 显示标识
      - 类型: *Short*
    
    ### <I> queryDecorationContractByOrderId

        通过装修单号获取合同信息
        
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
    
    
        Example::
        
            {
                "decorationContract.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationContracts**: 合同信息列表 , 类型 *decorationContract*
          - 类型: *List*
    
        Example::
        
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

    ### <I-C> queryDecorationContract

        通过装修单号获取合同信息
        
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
    
    
        Example::
        
            {
                "decorationContract.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationContracts**: 合同信息列表 , 类型 *decorationContract*
          - 类型: *List*
    
        Example::
        
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

    ### <I> sendDecorationContractForAuth

        发送认证通知
        
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
    
    
        Example::
        
            {
                "decorationContract.orderId": "1601010001"
            }

    ### <I> sendDecorationContract

        发送合同通知
        
        通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        :param decorationContract.type: 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载
        :type decorationContract.type: Short
        
        Example::
        
            {
                "decorationContract.dcid": 1,
                "decorationContract.type": 1
            }

    ### <I> redirectDecorationContract

        跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址
        
        类型包括1(签章)/2(签订)/3(查看)/4(下载)
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    ### <I> viewDecorationContract

        查看合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }
            
    ### <I> signDecorationContractForCompany

        签订合同 , 针对公司信息
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1,
                "signet.sid": 1
            }
            
    ### <I> signDecorationContractForCustomer

        签订合同 , 针对客户信息
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1,
                "customer.cid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=sign",
                ...
            }

    ### <I> addDecorationContract

        创建合同
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断合同模版是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**
        
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
        :param contract.cid: 合同模版ID
        :type contract.cid: Long
        
        Example::
        
            {
                "decorationContract.orderId": "1601010001",
                "contract.cid": 1,
            }

    ### <I> makeDecorationContract

        生成合同
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断合同模版是否存在 , 不存在 , 错误信息 **130044 合同模版不存在**
        
        判断装修合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
                |Requests:|
                :param decorationContract.dcid: 装修合同ID
        :type decorationContract.dcid: Long
        :type decorationContract.orderId: String
        :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
        :param contract.cid: 合同模版ID
        :type contract.cid: Long
        - **data**: 模版参数 , 字符串类型的JSON格式对象
          - 类型: *String*
        
        Example::
        
            {
                "decorationContract.dcid": 1,
                "contract.cid": 1,
                "data": "{"data": "数据内容格式"}"
            }

    ### <I> affixDecorationContract

        签订合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        更新装修合同为1(已签)
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1
            }

    ### <I> expireDecorationContract

        失效合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        更新装修合同为2(失效)
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1
            }

            
    ### <I> filingDecorationContract

        归档合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为1(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        
        Example::
        
            {
                "decorationContract.dcid": 1
            }

    ### <I> showDecorationContract

        合同显示控制
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
                |Requests:|
                :param decorationContract.dcid: 合同ID
        :type decorationContract.dcid: Long
        :param decorationContract.ishow: 显示标识
        :type decorationContract.ishow: Short
        
        Example::
        
            {
                "decorationContract.dcid": 1,
                "decorationContract.ishow": 0
            }
            
    ### <I> presignDecorationContract

        预签合同
        
        装修单状态需要为: 0(初始)/1(定金)
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 0(初始)/1(定金)之外的其他状态不能预签 , 错误信息 **140005 订单合同不能修改**
        
        判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        装修款中 , 一类为0(收款), 二类为1(合同)的款项 , 至少存在一个款项状态为已付款/已确认
        
        更新装修单状态为2(预签)
        
        生成装修单操作记录
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
    
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.presignPrice": 100
            }

    ### <I> signDecorationContract

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
        
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
    
    
        Example::
        
            {
                "decorationContract.orderId": "1601010001"
            }
            
    ### <I> resignDecorationContract

        重签合同
        
        装修单状态需要为: 重签
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态为4(重签) , 其他状态不能重签 , 错误信息 **140027 订单状态不能重签合同**
        
        判断装修单是否有未处理审批 , 存在未处理审批不能重签 , 错误信息 **140037 订单存在未处理审批项**
        
        判断装修单是否存在增减项 , 存在增减项不能重签 , 错误信息 **140041 订单存在增减项,不能重新签单**
        
        判断装修活动 , 存在状态0(初始)/2(接收)的物品/券 , 错误信息 **140058 订单活动奖品未处理**
        
        更新装修单状态为4(重签)
        
        生成装修单操作记录
    
                |Requests:|
                :param decorationContract.orderId: 装修单号
        :type decorationContract.orderId: String
    
        Example::
        
            {
                "decorationContract.orderId": "1601010001"
            }

## 半包

装修单半包模式说明

## api.decoration.DecorationMidpackAction

        |DataType:|
        #### decorationMidpack

    - **dmid**: 半包ID
      - 类型: *Long*
    - **decoration**: 装修单信息 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficRate**: 车运费折扣 , 0: 不打折 , 1: 打折
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣 , 0: 管理税金 , 1: 总额税金
      - 类型: *Short*
    - **materialRate**: 主材配比
      - 类型: *Integer*
    - **materialOrigin**: 原主材额
      - 类型: *Long*
    - **materialPrice**: 主材额
      - 类型: *Long*
    - **materialPaidup**: 主材实付额
      - 类型: *Long*
    - **serviceRate**: 服务费配比
      - 类型: *Integer*
    - **servicePrice**: 服务费
      - 类型: *Long*
    - **servicePaidup**: 服务实付费
      - 类型: *Long*
    - **status**: 状态 , 包括: 0(初始)
      - 类型: *Short*
    
    ### <I> queryDecorationMidpack

        获取装修单对应的半包信息
        
                |Requests:|
                :param decorationMidpack.orderId: 装修单号
        :type decorationMidpack.orderId: String
        
        Example::
        
            {
                "decorationMidpack.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationMidpack**: 半包信息 , 每条数据类型 *decorationMidpack*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> makeDecorationMidpack

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
        
                |Requests:|
                :param decorationMidpack.orderId: 装修单号
        :type decorationMidpack.orderId: String
        :param decorationMidpack.psid: 款项比例ID
        :type decorationMidpack.psid: Long
        
        :param decorationMidpack.materialRate: 主材配比
        :type decorationMidpack.materialPrice: Integer
        :param decorationMidpack.serviceRate: 服务配比
        :type decorationMidpack.serviceRate: Integer
        
        :param decorationMidpack.materialPrice: 主材金额
        :type decorationMidpack.materialPrice: Integer

        Example::
        
            {
                "decorationMidpack.orderId": "1601010001",
                "decorationMidpack.psid": 1,
                
                "decorationMidpack.materialRate": 100000,
                "decorationMidpack.serviceRate": 100000,
                
                "decorationMidpack.materialPrice": 100000
            }

    ### <I> updateDecorationMidpack

        更新半包信息
    
                |Requests:|
                :param decorationMidpack.orderId: 装修单号
        :type decorationMidpack.orderId: String
        :param decorationMidpack.materialPrice: 主材金额
        :type decorationMidpack.materialPrice: Integer
        
        Example::
        
            {
                "decorationMidpack.orderId": "1601010001",
                "decorationMidpack.materialPrice": 0
            }

## 满减

装修单满减模式说明 , 半价是特殊的满减方式

基础造价 = ∑打折项 + ∑非打折项 + 车运费   **注: 直接费**

工程造价 = ∑打折项 + ∑非打折项 + 车运费 + 管理费

主材造价 = (∑打折项 + ∑非打折项 + 车运费 + 管理费) * 主材配比

服务费 = 主材造价 * 服务费配比

合同额 = (基础造价 - 基础造价 % 基数) * 折扣 + 基础造价 % 基数 + 管理费

+-----------------------------| 主材配比                    | 装修单折扣                                                                   |
+=============================+==============================================================================+
| 120%                        | 7.2                                                                          |
+-----------------------------| 150%                        | 6.5                                                                          |
+-----------------------------| 180%                        | 5.6                                                                          |
+-----------------------------| 200%                        | 5                                                                            |
+-----------------------------## api.decoration.DecorationHolonomyAction

        |DataType:|
        #### decorationHolonomy

    - **dhid**: 半价ID
      - 类型: *Long*
    - **decoration**: 装修单信息 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **maching**: 主材配比
      - 类型: *Long*
    - **discount**: 装修单折扣
      - 类型: *Long*
    - **discountBase**: 折扣基数
      - 类型: *Long*
    - **projectBase**: 工程基础 , 与报价额等同
      - 类型: *Long*
    - **projectPrice**: 工程总额 , 折后工程额
      - 类型: *Long*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficDiscount**: 车运费折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣 , 0: 管理税金 , 1: 总额税金
      - 类型: *Short*
    - **taxPrice**: 税金
      - 类型: *Long*
    - **originMaterialPrice**: 原主材总额
      - 类型: *Long*
    - **materialPrice**: 主材总额
      - 类型: *Long*
    - **materialPaidup**: 主材实付额
      - 类型: *Long*
    - **servicePrice**: 服务费
      - 类型: *Long*
    - **serviceRate**: 服务费比例
      - 类型: *Integer*
    - **servicePaidup**: 服务费实收
      - 类型: *Long*
    - **status**: 状态 , 包括: 0(初始) , 1(决算)
      - 类型: *Short*
    
    ### <I> pageDecorationHolonomy

        分页方式获取装修单满减信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单满减信息列表 , 每条数据类型 *decorationHolonomy*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryDecorationHolonomy

        获取装修单对应的满减信息
        
                |Requests:|
                :param decorationHolonomy.orderId: 装修单号
        :type decorationHolonomy.orderId: String
        
        Example::
        
            {
                "decorationHolonomy.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationHolonomy**: 满减信息 , 每条数据类型 *decorationHolonomy*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> makeDecorationHolonomy

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
        
                |Requests:|
                :param decorationHolonomy.orderId: 装修单号
        :type decorationHolonomy.orderId: String
        :param decorationHolonomy.psid: 款项比例ID
        :type decorationHolonomy.psid: Long
        :param decorationHolonomy.maching: 主材配比
        :type decorationHolonomy.maching: Long
        :param decorationHolonomy.discount: 折扣
        :type decorationHolonomy.discount: Long
        :param decorationHolonomy.serviceRate: 服务费配比
        :type decorationHolonomy.serviceRate: Integer

        Example::
        
            {
                "decorationHolonomy.orderId": "1601010001",
                "decorationHolonomy.psid": 1,
                "decorationHolonomy.manageRate": 1006,
                "decorationHolonomy.maching": 2,
                "decorationHolonomy.discount": 5,
                "decorationHolonomy.discountBase": 1,
                "decorationHolonomy.serviceRate": 100
            }
            
    ### <I> updateDecorationHolonomy

        更新装修满减信息
        
        判断满减信息是否存在 , 不存在 , 错误信息 **140042 满减信息不存在**
        
        更细内容主要为 , 主材总额
        
                |Requests:|
                :param decorationHolonomy.orderId: 装修单号
        :type decorationHolonomy.orderId: String
        :param decorationHolonomy.materialPrice: 主材总额
        :type decorationHolonomy.materialPrice: Long

        Example::
        
            {
                "decorationHolonomy.orderId": "1601010001",
                "decorationHolonomy.materialPrice": 10010000
            }
            
## 整装

装修单整装类型相关信息

## api.decoration.DecorationInclusiveAction

        |DataType:|
        #### decorationInclusive

    - **diid**: 整装ID
      - 类型: *Long*
    - **decoration**: 装修单信息 , 类型 *decoration*
      - 类型: *Object*
    - **contractPrice**: 合同总额
      - 类型: *Long*
    - **projectPrice**: 工程总额
      - 类型: *Long*
    - **cdiff**: 工程差额
      - 类型: *Long*
    - **mdiff**: 主材差额
      - 类型: *Long*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficRate**: 车运费折扣 , 0: 不打折 , 1: 打折
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣 , 0: 管理税金 , 1: 总额税金
      - 类型: *Short*
    - **materialPaidup**: 实收主材额
      - 类型: *Long*
    
    ### <I> pageDecorationInclusive

        分页方式获取装修单整装信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单套餐信息列表 , 每条数据类型 *decorationInclusive*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryDecorationInclusive

        获取装修单对应的套餐信息
        
                |Requests:|
                :param decorationInclusive.orderId: 装修单号
        :type decorationInclusive.orderId: String
        
        Example::
        
            {
                "decorationInclusive.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationInclusive**: 满减信息 , 类型 *decorationInclusive*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> makeDecorationInclusive

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
        
                |Requests:|
                :param decorationInclusive.orderId: 装修单号
        :type decorationInclusive.orderId: String
        :param decorationInclusive.contractPrice: 合同总额
        :type decorationInclusive.contractPrice: Long

        Example::
        
            {
                "decorationInclusive.orderId": "1601010001",
                "decorationInclusive.contractPrice": 50000
            }
            
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

## api.decoration.DecorationAccountAction

        |DataType:|
        #### decorationAccount

    - **daid**: 决算ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **type**: 类型 , 0: 半包 , 1: 套餐 , 2: 半价, 3: 满减
      - 类型: *Short*
    - **arcal**: 增减配比计算 , 0: 计算配比 , 1: 不计算配比
      - 类型: *Short*
    - **matching**: 主材配比
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **discountBase**: 折扣基数
      - 类型: *Long*
    - **serviceRate**: 服务费比例
      - 类型: *Integer*
    - **materialPrice**: 主材总额
      - 类型: *Long*
    - **servicePrice**: 服务费
      - 类型: *Long*
    - **paidupMatching**: 实花配比
      - 类型: *Integer*
    - **difference**: 差额
      - 类型: *Long*
    - **coupon**: 券优惠
      - 类型: *Long*
    - **fulldel**: 满送
      - 类型: *Long*
    - **cashback**: 返现
      - 类型: *Long*
    - **internal**: 内部优惠
      - 类型: *Long*
    - **isAffirm**: 是否确认 , 0: 初始 , 1: 确认
      - 类型: *Short*
    - **affirmTime**: 确认时间
      - 类型: *Timestamp*
    
    ### <I> queryDecorationAccount

        获取装修单对应的决算信息
        
                |Requests:|
                :param decorationAccount.orderId: 装修单号
        :type decorationAccount.orderId: String
        
        Example::
        
            {
                "decorationAccount.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationAccount**: 决算信息 , 每条数据类型 *decorationAccount*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> updateDecorationAccount

        更新装修决算信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        装修单状态为3(签约)能够生成决算信息 , 错误信息 **140004 装修单状态不可操作**
        
                |Requests:|
                :param decorationAccount.orderId: 装修单号
        :type decorationAccount.orderId: String
        :param decorationAccount.type: 类型
        :type decorationAccount.type: Short
        :param decorationAccount.arcal: 增减配比计算
        :type decorationAccount.arcal: Short
        :param decorationAccount.maching: 主材配比
        :type decorationAccount.maching: Integer
        :param decorationAccount.discount: 折扣
        :type decorationAccount.discount: Long
        :param decorationAccount.serviceRate: 服务费配比
        :type decorationAccount.serviceRate: Long
        :param decorationAccount.materialPrice: 主材总额
        :type decorationAccount.materialPrice: Long
        :param decorationAccount.servicePrice: 服务费
        :type decorationAccount.servicePrice: Long
        :param decorationAccount.paidupMatching: 实话配比
        :type decorationAccount.paidupMatching: Integer
        :param decorationAccount.difference: 差额
        :type decorationAccount.difference: Long
        :param decorationAccount.coupon: 券优惠
        :type decorationAccount.coupon: Long
        :param decorationAccount.fulldel: 满减
        :type decorationAccount.fulldel: Long
        :param decorationAccount.cashback: 返现
        :type decorationAccount.cashback: Long
        :param decorationAccount.internal: 内部优惠
        :type decorationAccount.internal: Long

        Example::
        
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
            
    ### <I> makeDecorationAccount

        决算
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        装修单状态为3(签约)能够生成决算信息 , 错误信息 **140004 装修单状态不可操作**
        
        装修款状态更新为7(决算)
        
        生成装修单操作记录
        
                |Requests:|
                :param decorationAccount.orderId: 装修单号
        :type decorationAccount.orderId: String

        Example::
        
            {
                "decorationAccount.orderId": "1601010001"
            }

    ### <I> sendDecorationAccount

        推送决算信息
        
        判断决算信息是否存在 , 不存在 , 错误信息 **140081 决算信息不存在**
        
                |Requests:|
                :param decorationAccount.orderId: 装修单号
        :type decorationAccount.orderId: String

        Example::
        
            {
                "decorationAccount.orderId": "1601010001"
            }

    ### <I> affirmDecorationAccount

        确认决算信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断客户编号是否绑定 , 未绑定 , 错误信息 **330017 装修单未绑定**
        
        判断决算信息是否存在 , 不存在 , 错误信息 **140081 决算信息不存在**
        
                |Requests:|
                :param decorationAccount.orderId: 装修单号
        :type decorationAccount.orderId: String
        :param decoration.customer.no: 编号
        :type decoration.customer.no: String

        Example::
        
            {
                "decorationAccount.orderId": "1601010001",
                "decoration.customer.no": ""
            }
    
## 归属

装修单归属信息 , 包括设计师和业务员归属管理

## api.decoration.DecorationBelongAction

        |DataType:|
        #### decorationBelong

    - **dbid**: 归属ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **type**: 类型 , 0: 设计, 1: 业务
      - 类型: *Short*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **department**: 归属部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 归属分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **operater**: 操作人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **rate**: 比例 , 多个归属人员 , 比例之和等于1
      - 类型: *Short*
    - **defaults**: 装修单归属标识 , 0: 非归属, 1: 归属
      - 类型: *Short*
    - **status**: 状态 , 0: 有效 , 1: 无效 , 2: 确认 , 3: 审批
      - 类型: *Short*
    
    ### <I> queryDecorationBelong

        获取所有类型为设计的归属信息 , 不区分状态是否有效
        
                |Requests:|
                :param decorationBelong.orderId: 装修单号
        :type decorationBelong.orderId: String
        :param decorationBelong.type: 类型
        :type decorationBelong.type: Short
        :param decorationBelong.status: 状态
        :type decorationBelong.status: String
        
        Example::
        
            {
                "decorationBelong.orderId": "1601010001",
                "decorationBelong.type": 1,
                "decorationBelong.status": 0
            }
            
                |Returns:|
                - **decorationBelongs**: 归属信息列表 , 每条数据类型 *decorationBelong*
          - 类型: *List*
        
        Example::
        
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

## 活动

装修单活动管理

## api.decoration.DecorationActivityAction

        |DataType:|
        #### decorationActivity

    - **daid**: 活动ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **activity**: 活动信息 , 类型 [activity](./information.html#api.information.ActivityAction.activity)
      - 类型: *Object*
    - **amount**: 总额
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定
      - 类型: *Short*
    
    #### decorationActivityItem

    - **daiid**: 活动项ID
      - 类型: *Long*
    - **aid**: 活动ID
      - 类型: *Long*
    - **asid**: 奖品ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **activity**: 活动名
      - 类型: *String*
    - **name**: 活动项名
      - 类型: *String*
    
    - **num**: 数量
      - 类型: *Integer*
    - **money**: 价格
      - 类型: *Integer*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **refunder**: 退货人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **refundTime**: 操作时间
      - 类型: *Timestamp*
    - **affirmTime**: 确认时间
      - 类型: *Timestamp*
    - **checkTime**: 核对时间
      - 类型: *Timestamp*
    
    - **type**: 类型 , 0: 券 , 1: 物品 , 2: 红包
      - 类型: *Short*
    - **state**: 状态 , 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗 , 8: 折现
      - 类型: *Short*
    - **stateType**: 状态类型 , 0: 到点 , 1: 定金 , 2: 签单 , 3: 抽奖 , 4: 特批 , 5: 购买(过时) , 6: 其他(过时) , 7: 升级 , 8: 设计
      - 类型: *Short*
    - **isStock**: 是否计入库存 , 0: 计入 , 1: 不计入
      - 类型: *Short*
    - **isPrefor**: 是否计入业绩 , 0: 计入 , 1: 不计入
      - 类型: *Short*
    - **isPayment**: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
      - 类型: *Short*
    - **isAffirm**: 是否确认 , 0: 初始 , 1: 确认 , 2: 核对
      - 类型: *Short*
    
    - **content**: 备注
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*

    ### <I> queryDecorationActivityByOrderId

        通过装修单号获取活动信息
        
                |Requests:|
                :param decorationActivity.orderId: 装修单号
        :type decorationActivity.orderId: String
        
        Example::
        
            {
                "decorationActivity.orderId": "1601010001"
            }
    
                |Returns:|
                - **decorationActivitys**: 活动信息列表 , 每条数据类型 *decorationActivity*
          - 类型: *List*
        
        Example::
        
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

    ### <I> amountDecorationActivity

        汇总活动总额
        
                |Requests:|
                :param decorationActivity.orderId: 装修单号
        :type decorationActivity.orderId: String
        
        :param decorationActivityItem.type: 类型
        :type decorationActivityItem.type: Short
        :param decorationActivityItem.isPrefor: 是否计入业绩
        :type decorationActivityItem.isPrefor: Short
        :param decorationActivityItem.isPayment: 是否计入金额
        :type decorationActivityItem.isPayment: Short
        
        Example::
        
            {
                "decorationActivity.orderId": "1601010001",
                "decorationActivityItem.type": 0,
                "decorationActivityItem.isPrefor": 0,
                "decorationActivityItem.isPayment": 0
            }

                |Returns:|
                - **decorationActivity**: 装修活动信息 , 类型 *decorationActivity*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "decorationActivity": {
                        "orderId": "1601010001"
                        "amount": 100000,
                }
                ...
            }

    ### <I> queryDecorationActivityItem

        通过装修单号获取装修单拥有活动项信息
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationActivityItems**: 活动项信息列表 , 每条数据类型 *decorationActivityItem*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addDecorationActivity

        添加装修单参与活动信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签)之外的其他状态 , 错误信息 **140003 装修单已签约**
        
        判断操作活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**
        
        判断操作活动有效时间 , 结束时间小于当前时间 , 错误信息 **140032 活动已过期**
        
                |Requests:|
                :param decorationActivity.orderId: 装修单号
        :type decorationActivity.orderId: String
        :param decorationActivity.activity.aid: 活动ID
        :type decorationActivity.activity.aid: Long
        
        Example::
        
            {
                "decorationActivity.orderId": "1601010001",
                "decorationActivity.activity.aid": 1
            }
            
    ### <I> deleteDecorationActivity

        删除装修单参与活动信息
        
        判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**
        
        判断装修活动状态是否为0(初始) , 其他状态 , 错误信息 **140059 订单活动状态不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 0(初始)/1(定金)/2(预签)/4(重签)之外的其他状态 , 错误信息 **140003 装修单已签约**
        
        更新对应装修单的券优惠额/奖品优惠额
        
                |Requests:|
                :param decorationActivity.daid: 活动ID
        :type decorationActivity.daid: Long
        
        Example::
        
            {
                "decorationActivity.daid": 1
            }

    ### <I> lockDecorationActivity

        锁定装修活动
        
        判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**
        
        判断装修活动状态是否为0(初始) , 其他状态 , 错误信息 **140059 订单活动状态不可操作**
        
        装修活动状态更新为1(锁定)
        
                |Requests:|
                :param decorationActivity.daid: 活动ID
        :type decorationActivity.daid: Long
        
        Example::
        
            {
                "decorationActivity.daid": 1
            }
            
    ### <I> unlockDecorationActivity

        解锁装修活动
        
        判断装修单活动是否存在 , 不存在 , 错误信息 **140033 订单活动信息不存在**
        
        判断装修活动状态是否为1(锁定) , 其他状态 , 错误信息 **140059 订单活动不可操作**
        
        装修活动状态更新为0(初始)
        
                |Requests:|
                :param decorationActivity.daid: 活动ID
        :type decorationActivity.daid: Long
        
        Example::
        
            {
                "decorationActivity.daid": 1
            }
            
    ### <I> addDecorationActivityItem

        添加装修活动项
        
        判断奖品是否存在 , 不存在 , 错误信息 **240003 奖品不存在**
        
                |Requests:|
                :param decorationActivityItem.orderId: 装修单号
        :type decorationActivityItem.orderId: String
        :param decorationActivityItem.asid: 奖品ID
        :type decorationActivityItem.asid: Long
        :param decorationActivityItem.aid: 活动ID
        :type decorationActivityItem.aid: Long
        :param decorationActivityItem.activityName: 活动名
        :type decorationActivityItem.activityName: String
        :param decorationActivityItem.type: 类型
        :type decorationActivityItem.type: Short
        :param decorationActivityItem.stateType: 状态类型
        :type decorationActivityItem.stateType: Short
        :param decorationActivityItem.money: 价格
        :type decorationActivityItem.money: Integer
        :param decorationActivityItem.num: 数量
        :type decorationActivityItem.num: Integer
        :param decorationActivityItem.content: 说明
        :type decorationActivityItem.content: String
        
        Example::
        
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
            
    ### <I> receiveDecorationActivityItem

        领取装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**
        
        判断装修活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.content: 备注
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.content": "备注"
            }
            
    ### <I> abateDecorationActivityItem

        失效装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        装修活动项状态更新为1(失效)
        
        重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.content: 备注
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.content": "备注"
            }
            
    ### <I> deliveDecorationActivityItem

        配送装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        装修活动项状态更新为4(配送)
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.content: 备注
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.content": "备注"
            }
            
    ### <I> unrefundDecorationActivityItem

        未退装修活动 , 已审批未退货
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        装修活动项状态更新为5(未退)
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.comment: 说明
        :type decorationActivityItem.comment: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.comment": "说明"
            }
            
    ### <I> refundDecorationActivityItem

        退货装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        装修活动项状态更新为3(退货)
        
        判断装修活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号
        
        重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.comment: 说明
        :type decorationActivityItem.comment: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.comment": "说明"
            }
        
    ### <I> expendDecorationActivityItem

        消耗装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        装修活动项状态更新为7(消耗)
        
        重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.comment: 说明
        :type decorationActivityItem.comment: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.comment": "说明"
            }

    ### <I> discountDecorationActivityItem

        折现装修活动项
        
        判断装修活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断装修活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        装修活动项状态更新为8(折现)
        
        重新计算归属装修单中券优惠和物品优惠 , 实收额 , 原有金额基础上减少消耗活动项
        
                |Requests:|
                :param decorationActivityItem.daiid: 活动项ID
        :type decorationActivityItem.daiid: Long
        :param decorationActivityItem.content: 说明
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1,
                "decorationActivityItem.content": "说明"
            }
            
    ### <I> amountDecorationActivityItem

        统计装修活动项
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态 , 3(签单)/7(决算)其他状态不可操作 , 错误信息 **140004 装修单状态不可操作**
        
        装修活动项状态更新为7(消耗)
        
        重新计算归属装修单中券优惠和物品优惠 , 实收额 , 统计所有装修活动项进行统计
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decorationActivityItem.daiid": 1
            }

    ### <I> sendDecorationActivityItem

        发送装修活动项
        
                |Requests:|
                :param decorationActivityItem.orderId: 装修单号
        :type decorationActivityItem.orderId: Long
        :param decorationActivityItem.content: 备注
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "decorationActivityItem.orderId": "1601010001",
                "decorationActivityItem.content": ""
            }

    ### <I> affirmDecorationActivityItem

        确认装修活动项
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.customer.no: 编号
        :type decoration.customer.no: String
        
        :param decorationActivityItem[n].daiid: 活动项ID
        :type decorationActivityItem[n].daiid: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.customer.no": "",
                
                "decorationActivityItem[0].daiid": 1
                
            }
    
## 回访

装修单回访信息管理

## api.decoration.BackVisitAction

        |DataType:|
        #### backVisit

    - **bvid**: 回访ID
      - 类型: *Integer*
    - **orderId**: 装修单号
      - 类型: *String*
    - **sender**: 发送者
      - 类型: *String*
    - **senderId**: 发送者编号
      - 类型: *String*
    - **senderPhoto**: 发送者照片
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **content**: 内容
      - 类型: *String*
    - **receivers**: 接收者名称列表 , 每条数据类型 String
      - 类型: *List*
    
        |Filters:|
        - **orderId**: 装修单号
      - 类型: *String*
    
    ### <I> pageBackVisitByOrderId

        分页方式通过装修单号获取回访信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Requests:|
                :param backVisit.orderId: 装修单号
        :type backVisit.orderId: String
        
        Example::
        
            {
                "backVisit.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 回访信息列表 , 每条数据类型 *backVisit*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryBackVisitByOrderId

        通过装修单号获取回访信息
        
                |Requests:|
                :param backVisit.orderId: 装修单号
        :type backVisit.orderId: String
        
        Example::
        
            {
                "backVisit.orderId": "1601010001"
            }
    
                |Returns:|
                - **backVisits**: 回访信息列表 , 每条数据类型 *backVisit*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addBackVisit

        添加回访信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param backVisit.orderId: 装修单号
        :type backVisit.orderId: String
        :param backVisit.content: 内容
        :type backVisit.content: String
        :param backVisit.receivers: 接收人编号列表 , 每条数据类型 String
        :type backVisit.receivers: List
        
        Example::
        
            {
                "backVisit.orderId": "1601010001",
                "backVisit.receivers[0]": "U001",
                "backVisit.receivers[1]": "U002"
            }
            
    ### <I> deleteBackVisitById

        通过回访ID删除回访信息
        
                |Requests:|
                :param backVisit.bvid: 回访ID
        :type backVisit.bvid: Integer
        
        Example::
        
            {
                "backVisit.bvid": 1
            }
        
## 图纸

装修单图纸信息管理

## api.decoration.DecorationPictureAction

        |DataType:|
        #### decorationPicture

    - **dpid**: 图纸ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **path**: 图纸路径
      - 类型: *String*
    - **uploadTime**: 上传时间
      - 类型: *Timestamp*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **content**: 说明
      - 类型: *String*
    - **type**: 类型 , 0: CAD , 1: 效果图 , 2: 工程文件 , 3: 合同图 , 4: 原始图
      - 类型: *Short*
    - **status**: 状态 , 0: 初始, 1: 失效
      - 类型: *Short*
    
    #### decorationPictureRecord

    - **dprid**: 记录ID
      - 类型: *Long*
    - **dpid**: 图纸ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 上传时间
      - 类型: *Timestamp*
    
    ### <I> queryDecorationPictureByOrderId

        通过装修单号获取图纸信息
        
                |Requests:|
                :param decorationPricture.orderId: 装修单号
        :type decorationPricture.orderId: String
        
        Example::
        
            {
                "decorationPricture.orderId": "1601010001"
            }
    
                |Returns:|
                - **decorationPictures**: 图纸信息列表 , 每条数据类型 *decorationPicture*
          - 类型: *List*
        
        Example::
        
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

    ### <I> downloadDecorationPicture

        下载
    
                |Requests:|
                :param decorationPricture.dpid: 图纸ID
        :type decorationPricture.dpid: Long
        
        Example::
        
            {
                "decorationPricture.dpid": 1
            }

                |Returns:|
                - **decorationPicture**: 图纸信息 , 每条数据类型 *decorationPicture*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addDecorationPicture

        添加图纸信息
        
                |Requests:|
                :param decorationPricture.orderId: 装修单号
        :type decorationPricture.orderId: String
        :param decorationPricture.name: 名称
        :type decorationPricture.name: String
        :param decorationPricture.content: 说明
        :type decorationPricture.content: String
        :param decorationPricture.path: 路径
        :type decorationPricture.path: String
        :param decorationPricture.type: 类型 , 0: CAD , 1: 图片 , 2: 合同
        :type decorationPricture.type: Short
        
        Example::
        
            {
                "decorationPricture.orderId": "1601010001"
                "decorationPricture.name": "picture.jpg"
                "decorationPricture.content": ""
                "decorationPricture.path": "/upload/Imag/26/8/1/2/1d7184baf670d0370658.png"
                "decorationPricture.type": 1
            }
            
    ### <I> deleteDecorationPicture

        删除图纸系你想
        
                |Requests:|
                :param decorationPricture.dpid: 图纸ID
        :type decorationPricture.dpid: Long
        
        Example::
        
            {
                "decorationPricture.dpid": 1
            }
            
## 服务

## api.decoration.DecorationServiceAction

        |DataType:|
        #### decorationService

    - **dsid**: 服务ID
      - 类型: *Long*
    - **orderId**: 装修单编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **detail**: 详述
      - 类型: *String*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 完成
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> queryDecorationServiceByOrderId

                |Requests:|
                :param decorationService.orderId: 装修单编号
        :type decorationService.orderId: String
        
        Example::
        
            {
                "decorationService.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationServices**: 服务信息列表 , 每条数据类型 *decorationService*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addDecorationService

        添加装修服务信息
        
                |Requests:|
                :param decorationService.orderId: 装修单号
        :type decorationService.orderId: String
        :param decorationService.name: 名称
        :type decorationService.name: String
        :param decorationService.detail: 详述
        :type decorationService.detail: String
        
        Example::
        
            {
                "decorationService.orderId": "1601010001",
                "decorationService.name": "报价",
                "decorationService.detail": "报价详情"
            }
            
    ### <I> completeDecorationService

        提交完成装修服务
        
        判断装修服务信息是否存在 , 不存在 , 错误信息 **140055 装修服务不存在**
        
        判断装修服务信息状态是否为0(初始) , 错误信息 **140056 装修服务不可操作**
    
                |Requests:|
                :param decorationService.dsid: 服务ID
        :type decorationService.dsid: Long
        :param decorationService.comment: 说明
        :type decorationService.comment: String
        
        Example::
        
            {
                "decorationService.dsid": 1,
                "decorationService.comment": "说明"
            }
            
## 人员

## api.decoration.DecorationUserAction

        |DataType:|
        #### decorationUser

    - **duid**: ID
      - 类型: *Long*
    - **orderId**: 装修单编号
      - 类型: *String*
    - **user**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **isShow**: 显示标识 , 0: 显示 , 1: 隐藏
      - 类型: *Short*
    - **isPay**: 薪资标识 , 0: 无薪 , 1: 有薪
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    
    
    ### <I> pageDecorationForUser

        分页方式获取装修单信息 , 通过装修人员关联 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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

    ### <I> queryDecorationUser

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 人员信息列表 , 每条数据类型 *decorationUser*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addDecorationUser

        添加装修单相关人员信息
        
                |Requests:|
                :param decorationUser.orderId: 装修单号
        :type decorationUser.orderId: Long
        :param decorationUser.user.uid: 人员ID
        :type decorationUser.user.uid: Long
        
        Example::
        
            {
                "decorationUser.orderId": "1601010001",
                "decorationUser.user.uid": 1
            }

    ### <I> updateDecorationUser

        更新
        
        判断人员信息是否存在 , 不存在 , 错误信息 **140077 人员不存在**
        
                |Requests:|
                :param decorationUser.duid: 人员ID
        :type decorationUser.duid: Long
        :param decorationUser.isShow: 显示标识
        :type decorationUser.isShow: Short
        :param decorationUser.isPay: 薪资标识
        :type decorationUser.isPay: Short
        
        Example::
        
            {
                "decorationUser.orderId": "1601010001",
                "decorationUser.isShow": 1,
                "decorationUser.isPay": 1
            }
            
    ### <I> deleteDecorationUser

        删除装修单相关人员信息
        
                |Requests:|
                :param decorationUser.duid: ID
        :type decorationUser.duid: Long
    
## 审核

预算审核相关处理过程

## api.decoration.AuditAction

        |DataType:|
        #### audit

    - **aid**: 审核ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **auditer**: 审核人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **auditTime**: 审核时间
      - 类型: *Timestamp*
    
    #### auditRecord

    - **arid**: ID
      - 类型: *Long*
    - **aid**: 审核信息ID
      - 类型: *Long*
    - **unitprice**: 单价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已处理
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    #### auditScale

    - **asid**: ID
      - 类型: *Long*
    - **arid**: 审核记录ID
      - 类型: *Long*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **belongDepartment**: 归属部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **money**: 金额
      - 类型: *Long*
    - **type**: 类型 , 0: 设计师 , 1: 设计经理
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 已付款 , 2: 退款
      - 类型: *Short*
    
    ### <I> pageAudit

        分页方式通过装修单号获取审批信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 审批信息列表 , 每条数据类型 *backVisit*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> applyAudit

        申请审批 , 审批记录没有审批人归属 , 进行审批人分配
        
        判断审批信息是否存在 , 不存在 , 错误信息 **140044 审批记录不存在**
        
        审批信息归属审批人已经存在 , 错误信息 **140048 审核人已存在**
        
                |Requests:|
                :param audit.aid: ID
        :type audit.aid: Long
        
        Example::
        
            {
                "audit.aid": 1
            }
            
                |Returns:|
                - **auditRecords**: 审核记录信息列表 , 每条数据类型 *auditRecord*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> queryAuditRecordByOrderId

        通过审核信息ID获取审核信息
        
                |Requests:|
                :param audit.decoration.orderId: 装修单号
        :type audit.decoration.orderId: String
        
        Example::
        
            {
                "audit.decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **auditRecords**: 审核记录信息列表 , 每条数据类型 *auditRecord*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addAuditRecord

        添加审批记录信息
        
        判断审批信息是否存在 , 不存在 , 错误信息 **140044 审批记录不存在**
    
                |Requests:|
                :param auditRecord.aid: ID
        :type auditRecord.aid: Long
        :param auditRecord.unitprice: 单价
        :type auditRecord.unitprice: Integer
        :param auditRecord.num: 数量
        :type auditRecord.num: Integer
        :param auditRecord.discount: 折扣
        :type auditRecord.discount: Integer
        :param auditRecord.comment: 说明
        :type auditRecord.comment: String
        
        Example::
        
            {
                "auditRecord.aid": 1,
                "auditRecord.unitprice":10000,
                "auditRecord.num": 10,
                "auditRecord.discount": 0.9,
                "auditRecord.comment": "说明"
            }
                
    ### <I> updateAuditRecord

        更新审批记录信息
        
        操作审批记录信息不存在 , 错误信息 **140044 审批记录不存在**
        
        判断审批信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140045 审批记录状态不可操作**
        
        判断操作审批信息是否拥有审批比例信息 , 存在不可更新 , 错误信息 **140045 审批记录状态不可操作**
        
                |Requests:|
                :param auditRecord.arid: ID
        :type auditRecord.arid: Long
        :param auditRecord.unitprice: 单价
        :type auditRecord.unitprice: Integer
        :param auditRecord.num: 数量
        :type auditRecord.num: Integer
        :param auditRecord.discount: 折扣
        :type auditRecord.discount: Integer
        :param auditRecord.comment: 说明
        :type auditRecord.comment: String
        
        Example::
        
            {
                "auditRecord.arid": 1,
                "auditRecord.unitprice":10000,
                "auditRecord.num": 10,
                "auditRecord.discount": 0.9,
                "auditRecord.comment": "说明"
            }
            
    ### <I> queryAuditScaleByArid

        通过审批信息ID获取审批比例信息
        
                |Requests:|
                :param auditRecord.arid: ID
        :type auditRecord.arid: Long
        
        Example::
        
            {
                "auditRecord.arid": 1
            }
        
                |Returns:|
                - **auditScales**: 审核比例信息列表 , 每条数据类型 *auditScale*
          - 类型: *List*
        
        Example::
        
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
        
    ### <I> makeAuditScale

        按照规则生成审批比例信息
        
        生成规则为归属装修单中的默认设计师以及设计师所在部门经理 , 比例为9:1方式才分审批信息中的金额
        
        判断归属审批信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140046 审批比例生成失败**
        
                |Requests:|
                :param auditRecord.arid: ID
        :type auditRecord.arid: Long
        
        Example::
        
            {
                "auditRecord.arid": 1
            }
            
    ### <I> addAuditScale

        添加审核比例信息
        
        判断审批记录是否存在 , 不存在 , 错误信息 **140044 审核记录不存在**
        
                |Requests:|
                :param auditScale.arid: ID
        :type auditScale.arid: Long
        :param auditScale.belonger.userId: 归属人编号
        :type auditScale.belonger.userId: String
        :param auditScale.money: 金额
        :type auditScale.money: Long
        :param auditScale.type: 类型
        :type auditScale.type: Short
        
        Example::
        
            {
                "auditScale.arid": 1,
                "auditScale.belonger.userId": "U001",
                "auditScale.money": 10000,
                "auditScale.type": 0,
            }
            
    ### <I> updateAuditScaleForStatus

        更新审核比例信息状态
        
        判断审核比例信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140047 审批比例信息状态不可操作**
        
                |Requests:|
                :param auditScale.asid: ID
        :type auditScale.asid: Long
        :param auditScale.status: 状态
        :type auditScale.status: Short
        
        Example::
        
            {
                "auditScale.asid": 1,
                "auditScale.status": 0,
            }
            
    ### <I> deleteAuditScale

        删除审核比例信息
        
        判断审核比例信息状态 , 0(初始)之外的其他状态不可修改 , 错误信息 **140047 审批比例信息状态不可操作**
        
                |Requests:|
                :param auditScale.asid: ID
        :type auditScale.asid: Long
        
        Example::
        
            {
                "auditScale.asid": 1
            }
            
## 结算

## api.decoration.decorationBalanceAction

        |DataType:|
        #### decorationBalance

    - **dbid**: 结算ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **balance**: 结算额
      - 类型: *Long*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    
    ### <I> pageDecorationForBalance

        分页方式获取装修结算信息 , 通过装修结算信息关联 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修单信息列表 , 每条数据类型 *decoration*
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
    
    ### <I> queryDecorationBalance

        通过装修单号查询结算信息
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationBalance**: 结算信息 , 类型 *decorationBalance*
          - 类型: *Object*
            
        Example::
        
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
            
    ### <I> makeDecorationBalance

        生成结算信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修结算信息是否存在 , 存在更新结算值 , 不存在创建结算信息
        
                |Requests:|
                :param decorationBalance.decoration.orderId: 装修单号
        :type decorationBalance.decoration.orderId: String
        :param decorationBalance.balance: 结算额
        :type decorationBalance.balance: Long
        
        Example::
        
            {
                "decorationBalance.decoration.orderId": "1601010001",
                "decorationBalance.balance": 10000
            }
            
## 功能

## api.decoration.DecorationFunctionAction

        |DataType:|
        #### decorationFunction

    - **dfid**: 功能ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: key
      - 类型: *String*
    - **value**: value
      - 类型: *String*
    - **type**: 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点, 6: 状态
      - 类型: *Short*
    - **subtype**: 子类 , 0: 字符串, 1: 数组
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### <I> queryDecorationFunction

        获取装修功能信息
    
                |Requests:|
                :param decorationFunction.type: 类型
        :type decorationFunction.type: Short
        
        Example::
        
            {
                "decorationFunction.type": 0
            }
            
                |Returns:|
                - **decorationFunctions**: 功能信息列表 , 类型 *decorationFunction*
          - 类型: *List*
            
        Example::
        
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
            
    ### <I> queryDecorationFunctionByName

        通过名称获取装修功能信息
    
                |Requests:|
                :param decorationFunction.name: 名称
        :type decorationFunction.name: String
        
        Example::
        
            {
                "decorationFunction.name": "designer"
            }
            
                |Returns:|
                - **decorationFunctions**: 结算信息 , 类型 *decorationFunction*
          - 类型: *Object*
            
        Example::
        
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
