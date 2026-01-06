# right {#right}

# 权限
## 角色-外链

角色关联外链页面权限控制

## api.rigth.RoleChainPageAction

        |DataType:|
        #### roleChainPage

    - **rcpid**: Id
      - 类型: *Long*
    - **rid**: 角色ID
      - 类型: *Integer*
    - **chainPage**: 外链 , 类型 `chianPage <./data.html#api.data.ChainPageAction.chianPage>`_
      - 类型: *Object*
    
    ### <I> queryRoleChainPageByRid

        获取指定角色对应的外链信息
    
                |Requests:|
                :param roleChainPage.rid: 角色ID
        :type roleChainPage.rid: Integer
        
        Example::
        
            {
                "roleChainPage.rid": 1
            }
            
                |Returns:|
                - **chainPages**: 外链信息列表 , 每条数据类型 `chianPage <./data.html#api.data.ChainPageAction.chianPage>`_
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> updateRoleChainPage

        更新指定角色对应的外链信息
        
                |Requests:|
                :param roleChainPage.rid: 角色ID
        :type roleChainPage.rid: Integer
        :param cpids[n]: 外链ID列表 , 每条数据类型 Long
        :type cpids[n]: List
        
        Example::
        
            {
                "roleChainPage.rid": 1,
                "cpids[0]": 1
            }
            
## 装修单-权限

包括三个部分 , 设计部-人员/业务部-人员/装修单状态-人员

## api.right.decorationRightAction

        |DataType:|
        #### decorationDesignDepartmentRight

    - **doddrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### <I> queryDecorationDesignDepartmentRightByUserId

        通过人员编号查询该人员的设计权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

                |Returns:|
                - **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        Example::

            {
                "dids[0]": 1
            }
            
    ### <I> updateDecorationDesignDepartmentRight

        更新人员设计权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联设计权限配置信息 , 之后更新人员对应的设计权限配置信息

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String
        :param dids[n]: 设计部ID列表 , 每条数据类型 Long
        :type dids[n]: List

        Example::

            {
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }
            
        |DataType:|
        #### decorationSalesmanDepartmentRight

    - **dosdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 业务部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*
            
    ### <I> queryDecorationSalesmanDepartmentRightByUserId

        通过人员编号查询该人员的业务权限配置信息
                
        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

                |Returns:|
                - **dids**: 业务部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        Example::

            {
                "dids[0]": 1
            }
            
    ### <I> updateDecorationSalesmanDepartmentRight

        更新人员业务权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联业务权限配置信息 , 之后更新人员对应的业务权限配置信息

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String
        :param dids[n]: 业务部ID列表 , 每条数据类型 Long
        :type user.userId: List

        Example::

            {
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }
            
        |DataType:|
        #### decorationStatusRight

    - **dosrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **status**: 状态
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*

	### <I> queryDecorationStatusRightByUserId

        通过人员编号查询该人员的订单权限配置信息
                
        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

                |Returns:|
                - **statuses**: 状态列表 , 每条数据类型 String
          - 类型: *List*

        Example::

            {
                "statuses[0]": "全部"
            }
			
    ### <I> updateDecorationStatusRight

        更新人员订单权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联订单权限配置信息 , 之后更新人员对应的订单权限配置信息

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String
        :param statuses[n]: 订单状态列表 , 每条数据类型 String
        :type statuses[n]: List

        Example::

            {
                 "user.userId": "FL-00001",
                 "statuses[0]": "全部"
            }
            
        |DataType:|
        #### decorationUser

    - **dosrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> pageDecorationUser

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .
        
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
            
    ### <I> bindDecorationUser

        绑定人员与装修单关联关系
        
        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单是否已经人员进行绑定 , 不可重复绑定
        
                |Requests:|
                :param decorationUser.uid: 用户ID
        :type decorationUser.uid: Integer
        :param decorationUser.decoration.orderId: 装修单号
        :type decorationUser.decoration.orderId: String
        
        Example::
        
            {
                "decorationUser.uid": 1,
                "decorationUser.decoration.orderId": "1601010001"
            }
            
    ### <I> unbindDecorationUser

        解绑人员与装修单关联关系
        
                |Requests:|
                :param decorationUser.uid: 用户ID
        :type decorationUser.uid: Integer
        :param decorationUser.decoration.orderId: 装修单号
        :type decorationUser.decoration.orderId: String
        
        Example::
        
            {
                "decorationUser.uid": 1,
                "decorationUser.decoration.orderId": "1601010001"
            }

## 品牌-人员

品牌权限 , 根据人员信息配置人员查询以及操作品牌的权限

## api.data.BrandUserRightAction

        |DataType:|
        #### brandUserRight

    - **burid**: 权限ID
      - 类型: *Long*
    - **uid**: 用户编号
      - 类型: *String*
    - **brand**: 品牌信息 , 类型 `brand <./data.html#api.data.BrandAction.brand>`_
      - 类型: *Object*
    
    ### <I> queryBrandUserRightByUid

        查询指定用户拥有的品牌权限信息
        
                |Requests:|
                :param brandUserRight.uid: 用户ID
        :type brandUserRight.uid: Integer
        
        Example::
        
            {
                "brandUserRight.uid": 1
            }
            
                |Returns:|
                - **brandUserRights**: 品牌权限信息列表 , 每条数据类型 *brandUserRight*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryBrandUserRightForLogin

        获取当前用户的品牌权限信息
    
                |Returns:|
                - **brandUserRights**: 品牌权限信息列表 , 每条数据类型 *brandUserRight*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <C> updateBrandUserRight

        更新品牌权限信息
        
                |Requests:|
                :param brandUserRight.uid: 用户ID
        :type brandUserRight.uid: Long
        :param bids[n]: 品牌ID列表 , 每条数据类型 Long
        :type bids[n]: List
        
        Example::
        
            {
                "brandUserRight.uid": 1,
                "bids[0]": 0
            }
            
## 房源-部门

## api.right.BuildingHouseRightAction

        |DataType:|
        #### buildingHouseDepartmentRight

    - **hsdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### <I> queryBuildingHouseDepartmentRightByUserId

        通过人员编号查询该人员的房源归属部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

                |Returns:|
                - **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        Example::

            {
                "dids[0]": 1
            }
            
    ### <I> updateBuildingHouseDepartmentRight

        更新人员房源部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联房源部门权限配置信息 , 之后更新人员对应的房源部门权限配置信息

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String
        :param dids[n]: 设计部ID列表 , 每条数据类型 Long
        :type dids[n]: List

        Example::

            {
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }
            
## 客源-部门

## api.right.customerSourceRightAction

        |DataType:|
        #### customerSourceDepartmentRight

    - **csdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### <I> queryCustomerSourceDepartmentRightByUserId

        通过人员编号查询该人员的客源归属部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

                |Returns:|
                - **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        Example::

            {
                "dids[0]": 1
            }
            
    ### <I> updateCustomerSourceDepartmentRight

        更新人员客源部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联客源部门权限配置信息 , 之后更新人员对应的客源部门权限配置信息

                |Requests:|
                :param user.userId: 人员编号
        :type user.userId: String
        :param dids[n]: 设计部ID列表 , 每条数据类型 Long
        :type dids[n]: List

        Example::

            {
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }

## 装修功能-功能

## api.rigth.DecorationFunctionRightAction

        |DataType:|
        #### decorationFunctionRight

    - **dfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **decorationFunction**: 功能 , 类型 [decorationFunction](./decoration.html#api.decoration.decorationFunctionAction.decorationFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> queryDecorationFunctionRightByName

        通过名称获取装修功能
    
                |Requests:|
                :param decorationFunction.name: 名称
        :type decorationFunction.name: String
        
        Example::
        
            {
                "decorationFunction.name": "designer"
            }
            
                |Returns:|
                - **decorationFunctions**: 装修功能信息列表 , 每条数据类型 [decorationFunction](./decoration.html#api.decoration.DecorationFunctionAction.decorationFunction)
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
            
    ### <I> updateDecorationFunctionRight

        更新功能名称和功能之间关系
        
                |Requests:|
                :param decorationFunction.name: 名称
        :type decorationFunction.name: String
        :param dfids[n]: 功能ID列表 , 每条数据类型 Long
        :type dfids[n]: List
        
        Example::
        
            {
                "decorationFunction.name": 1,
                "dfids[0]": 1
            }

## 生产功能-功能

## api.rigth.ProductionFunctionRightAction

        |DataType:|
        #### productionFunctionRight

    - **pfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **productionFunction**: 功能 , 类型 [productionFunction](./production.html#api.production.ProductionFunctionAction.productionFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> queryProductionFunctionRightByName

        通过名称获取生产功能
        
    ### <I> updateProductionFunctionRight

        更新功能名称和功能之间关系

## 款项功能-功能

## api.rigth.PaymentFunctionRightAction

        |DataType:|
        #### paymentFunctionRight

    - **pfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **paymentFunction**: 功能 , 类型 [paymentFunction](./payment.html#api.payment.PaymentFunctionAction.paymentFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> queryPaymentFunctionRight

        通过名称获取款项功能
        
    ### <I> updatePaymentFunctionRight

        更新功能名称和功能之间关系

## 销售功能-功能

## api.rigth.SalesFunctionRightAction

        |DataType:|
        #### salesFunctionRight

    - **sfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **salesFunction**: 功能 , 类型 [salesFunction](./sales.html#api.sales.SalesFunctionAction.salesFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> querySalesFunctionRightByName

        通过名称获取销售功能
        
    ### <I> updateSalesFunctionRight

        更新功能名称和功能之间关系

## 客源功能-功能

## api.rigth.CustomerOriginFunctionRightAction

        |DataType:|
        #### customerOriginFunctionRight

    - **cofrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **customerOriginFunction**: 功能 , 类型 [customerOriginFunction](./customer.html#api.customer.CustomerOriginFunctionAction.customerOriginFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> queryCustomerOriginFunctionRight

        通过名称获取客源功能
        
    ### <I> updateCustomerOriginFunctionRight

        更新功能名称和功能之间关系

## 销售配送-状态

## api.rigth.SalesDeliveryStatusRightAction

        |DataType:|
        #### salesDeliveryStatusRight

    - **sdsrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **status**: 状态
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*

    ### <I> querySalesDeliveryStatusRight

        获取销售配送状态
        
                |Requests:|
                :param salesDeliveryStatusRight.bid: 品牌ID
        :type salesDeliveryStatusRight.bid: Long
        
        Example::
        
            {
                "salesDeliveryStatusRight.bid": 1
            }

                |Returns:|
                - **salesDeliveryStatusRights**: 配送状态信息列表 , 每条数据类型 *salesDeliveryStatusRight*
          - 类型: *List*
        
        Example::
        
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
        
    ### <I> updateSalesDeliveryStatusRight

        更新销售配送状态
        
                |Requests:|
                :param salesDeliveryStatusRight[n].name: 名称
        :type salesDeliveryStatusRight[n].name: String
        :param salesDeliveryStatusRight[n].bid: 品牌ID
        :type salesDeliveryStatusRight[n].bid: Long
        :param salesDeliveryStatusRight[n].status: 状态
        :type salesDeliveryStatusRight[n].status: Short
        
        Example::
        
            {
                "salesDeliveryStatusRight[0].name": 1,
                "salesDeliveryStatusRight[0].bid": 1,
                "salesDeliveryStatusRight[0].status": 0
            }

## 报价功能-功能

## api.rigth.QuotationFunctionRightAction

        |DataType:|
        #### quotationFunctionRight

    - **qfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **quotationFunction**: 功能 , 类型 [quotationFunction](./quotation.html#api.quotation.QuotationFunctionAction.quotationFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> queryQuotationFunctionRight

        通过名称获取报价功能
        
    ### <I> updateQuotationFunctionRight

        更新功能名称和功能之间关系
