# right 权限
## 角色-外链

角色关联外链页面权限控制

## api.rigth.RoleChainPageAction

**数据类型**:

#### roleChainPage

    - **rcpid**: Id
      - 类型: *Long*
    - **rid**: 角色ID
      - 类型: *Integer*
    - **chainPage**: 外链 , 类型 `chianPage <./data.html#api.data.ChainPageAction.chianPage>`_
      - 类型: *Object*

    ### `queryRoleChainPageByRid` <span style="color:gray">[内部]</span>

        获取指定角色对应的外链信息

**请求参数**:

- **roleChainPage.rid**:
  角色ID

        **示例**:{
                "roleChainPage.rid": 1
            }

**返回参数**:

- **chainPages**: 外链信息列表 , 每条数据类型 `chianPage <./data.html#api.data.ChainPageAction.chianPage>`_
          - 类型: *List*

        **示例**:{
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

    ### `updateRoleChainPage` <span style="color:gray">[内部]</span>

        更新指定角色对应的外链信息

**请求参数**:

- **roleChainPage.rid**:
  角色ID
        - **cpids[n]**:
  外链ID列表 , 每条数据类型 Long

        **示例**:{
                "roleChainPage.rid": 1,
                "cpids[0]": 1
            }

## 装修单-权限

包括三个部分 , 设计部-人员/业务部-人员/装修单状态-人员

## api.right.decorationRightAction

**数据类型**:

#### decorationDesignDepartmentRight

    - **doddrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryDecorationDesignDepartmentRightByUserId` <span style="color:gray">[内部]</span>

        通过人员编号查询该人员的设计权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**请求参数**:

- **user.userId**:
  人员编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        **示例**:{
                "dids[0]": 1
            }

    ### `updateDecorationDesignDepartmentRight` <span style="color:gray">[内部]</span>

        更新人员设计权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联设计权限配置信息 , 之后更新人员对应的设计权限配置信息

**请求参数**:

- **user.userId**:
  人员编号
        - **dids[n]**:
  设计部ID列表 , 每条数据类型 Long

        **示例**:{
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }

**数据类型**:

#### decorationSalesmanDepartmentRight

    - **dosdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 业务部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryDecorationSalesmanDepartmentRightByUserId` <span style="color:gray">[内部]</span>

        通过人员编号查询该人员的业务权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**请求参数**:

- **user.userId**:
  人员编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **dids**: 业务部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        **示例**:{
                "dids[0]": 1
            }

    ### `updateDecorationSalesmanDepartmentRight` <span style="color:gray">[内部]</span>

        更新人员业务权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联业务权限配置信息 , 之后更新人员对应的业务权限配置信息

**请求参数**:

- **user.userId**:
  人员编号
        - **dids[n]**:
  业务部ID列表 , 每条数据类型 Long

        **示例**:{
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }

**数据类型**:

#### decorationStatusRight

    - **dosrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **status**: 状态
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryDecorationStatusRightByUserId` <span style="color:gray">[内部]</span>

        通过人员编号查询该人员的订单权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**请求参数**:

- **user.userId**:
  人员编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **statuses**: 状态列表 , 每条数据类型 String
          - 类型: *List*

        **示例**:{
                "statuses[0]": "全部"
            }

    ### `updateDecorationStatusRight` <span style="color:gray">[内部]</span>

        更新人员订单权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联订单权限配置信息 , 之后更新人员对应的订单权限配置信息

**请求参数**:

- **user.userId**:
  人员编号
        - **statuses[n]**:
  订单状态列表 , 每条数据类型 String

        **示例**:{
                 "user.userId": "FL-00001",
                 "statuses[0]": "全部"
            }

**数据类型**:

#### decorationUser

    - **dosrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.DecorationAction.decoration)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageDecorationUser` <span style="color:gray">[内部]</span>

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  装修单信息列表 , 每条数据类型 *decoration*

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

    ### `bindDecorationUser` <span style="color:gray">[内部]</span>

        绑定人员与装修单关联关系

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断装修单是否已经人员进行绑定 , 不可重复绑定

**请求参数**:

- **decorationUser.uid**:
  用户ID
        - **decorationUser.decoration.orderId**:
  装修单号

        **示例**:{
                "decorationUser.uid": 1,
                "decorationUser.decoration.orderId": "1601010001"
            }

    ### `unbindDecorationUser` <span style="color:gray">[内部]</span>

        解绑人员与装修单关联关系

**请求参数**:

- **decorationUser.uid**:
  用户ID
        - **decorationUser.decoration.orderId**:
  装修单号

        **示例**:{
                "decorationUser.uid": 1,
                "decorationUser.decoration.orderId": "1601010001"
            }

## 品牌-人员

品牌权限 , 根据人员信息配置人员查询以及操作品牌的权限

## api.data.BrandUserRightAction

**数据类型**:

#### brandUserRight

    - **burid**: 权限ID
      - 类型: *Long*
    - **uid**: 用户编号
      - 类型: *String*
    - **brand**: 品牌信息 , 类型 `brand <./data.html#api.data.BrandAction.brand>`_
      - 类型: *Object*

    ### `queryBrandUserRightByUid` <span style="color:gray">[内部]</span>

        查询指定用户拥有的品牌权限信息

**请求参数**:

- **brandUserRight.uid**:
  用户ID

        **示例**:{
                "brandUserRight.uid": 1
            }

**返回参数**:

- **brandUserRights**: 品牌权限信息列表 , 每条数据类型 *brandUserRight*
          - 类型: *Object*

        **示例**:{
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

    ### `queryBrandUserRightForLogin` <span style="color:gray">[内部]</span>

        获取当前用户的品牌权限信息

**返回参数**:

- **brandUserRights**: 品牌权限信息列表 , 每条数据类型 *brandUserRight*
          - 类型: *Object*

        **示例**:{
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

    ### `updateBrandUserRight` <span style="color:blue">[自定义]</span>

        更新品牌权限信息

**请求参数**:

- **brandUserRight.uid**:
  用户ID
        - **bids[n]**:
  品牌ID列表 , 每条数据类型 Long

        **示例**:{
                "brandUserRight.uid": 1,
                "bids[0]": 0
            }

## 房源-部门

## api.right.BuildingHouseRightAction

**数据类型**:

#### buildingHouseDepartmentRight

    - **hsdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryBuildingHouseDepartmentRightByUserId` <span style="color:gray">[内部]</span>

        通过人员编号查询该人员的房源归属部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**请求参数**:

- **user.userId**:
  人员编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        **示例**:{
                "dids[0]": 1
            }

    ### `updateBuildingHouseDepartmentRight` <span style="color:gray">[内部]</span>

        更新人员房源部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联房源部门权限配置信息 , 之后更新人员对应的房源部门权限配置信息

**请求参数**:

- **user.userId**:
  人员编号
        - **dids[n]**:
  设计部ID列表 , 每条数据类型 Long

        **示例**:{
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }

## 客源-部门

## api.right.customerSourceRightAction

**数据类型**:

#### customerSourceDepartmentRight

    - **csdrid**: ID
      - 类型: *Long*
    - **uid**: 用户ID
      - 类型: *Integer*
    - **did**: 设计部ID
      - 类型: *Integer*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryCustomerSourceDepartmentRightByUserId` <span style="color:gray">[内部]</span>

        通过人员编号查询该人员的客源归属部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

**请求参数**:

- **user.userId**:
  人员编号

        **示例**:{
                "user.userId": "FL-00001"
            }

**返回参数**:

- **dids**: 设计部ID列表 , 每条数据类型 Integer
          - 类型: *List*

        **示例**:{
                "dids[0]": 1
            }

    ### `updateCustomerSourceDepartmentRight` <span style="color:gray">[内部]</span>

        更新人员客源部门权限配置信息

        判断人员是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除人员原关联客源部门权限配置信息 , 之后更新人员对应的客源部门权限配置信息

**请求参数**:

- **user.userId**:
  人员编号
        - **dids[n]**:
  设计部ID列表 , 每条数据类型 Long

        **示例**:{
                 "user.userId": "FL-00001",
                 "dids[0]": 1
            }

## 装修功能-功能

## api.rigth.DecorationFunctionRightAction

**数据类型**:

#### decorationFunctionRight

    - **dfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **decorationFunction**: 功能 , 类型 [decorationFunction](./decoration.html#api.decoration.decorationFunctionAction.decorationFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryDecorationFunctionRightByName` <span style="color:gray">[内部]</span>

        通过名称获取装修功能

**请求参数**:

- **decorationFunction.name**:
  名称

        **示例**:{
                "decorationFunction.name": "designer"
            }

**返回参数**:

- **decorationFunctions**: 装修功能信息列表 , 每条数据类型 [decorationFunction](./decoration.html#api.decoration.DecorationFunctionAction.decorationFunction)
          - 类型: *List*

        **示例**:{
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

    ### `updateDecorationFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系

**请求参数**:

- **decorationFunction.name**:
  名称
        - **dfids[n]**:
  功能ID列表 , 每条数据类型 Long

        **示例**:{
                "decorationFunction.name": 1,
                "dfids[0]": 1
            }

## 生产功能-功能

## api.rigth.ProductionFunctionRightAction

**数据类型**:

#### productionFunctionRight

    - **pfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **productionFunction**: 功能 , 类型 [productionFunction](./production.html#api.production.ProductionFunctionAction.productionFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryProductionFunctionRightByName` <span style="color:gray">[内部]</span>

        通过名称获取生产功能

    ### `updateProductionFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系

## 款项功能-功能

## api.rigth.PaymentFunctionRightAction

**数据类型**:

#### paymentFunctionRight

    - **pfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **paymentFunction**: 功能 , 类型 [paymentFunction](./payment.html#api.payment.PaymentFunctionAction.paymentFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryPaymentFunctionRight` <span style="color:gray">[内部]</span>

        通过名称获取款项功能

    ### `updatePaymentFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系

## 销售功能-功能

## api.rigth.SalesFunctionRightAction

**数据类型**:

#### salesFunctionRight

    - **sfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **salesFunction**: 功能 , 类型 [salesFunction](./sales.html#api.sales.SalesFunctionAction.salesFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `querySalesFunctionRightByName` <span style="color:gray">[内部]</span>

        通过名称获取销售功能

    ### `updateSalesFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系

## 客源功能-功能

## api.rigth.CustomerOriginFunctionRightAction

**数据类型**:

#### customerOriginFunctionRight

    - **cofrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **customerOriginFunction**: 功能 , 类型 [customerOriginFunction](./customer.html#api.customer.CustomerOriginFunctionAction.customerOriginFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryCustomerOriginFunctionRight` <span style="color:gray">[内部]</span>

        通过名称获取客源功能

    ### `updateCustomerOriginFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系

## 销售配送-状态

## api.rigth.SalesDeliveryStatusRightAction

**数据类型**:

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

    ### `querySalesDeliveryStatusRight` <span style="color:gray">[内部]</span>

        获取销售配送状态

**请求参数**:

- **salesDeliveryStatusRight.bid**:
  品牌ID

        **示例**:{
                "salesDeliveryStatusRight.bid": 1
            }

**返回参数**:

- **salesDeliveryStatusRights**: 配送状态信息列表 , 每条数据类型 *salesDeliveryStatusRight*
          - 类型: *List*

        **示例**:{
                ...
                "salesDeliveryStatusRights": [
                    {
                        "sdsrid": 1,
                        "name": "状态",
                        "bid": 1,
                        "status": 0
                    }
                ]

    ### `updateSalesDeliveryStatusRight` <span style="color:gray">[内部]</span>

        更新销售配送状态

**请求参数**:

- **salesDeliveryStatusRight[n].name**:
  名称
        - **salesDeliveryStatusRight[n].bid**:
  品牌ID
        - **salesDeliveryStatusRight[n].status**:
  状态

        **示例**:{
                "salesDeliveryStatusRight[0].name": 1,
                "salesDeliveryStatusRight[0].bid": 1,
                "salesDeliveryStatusRight[0].status": 0
            }

## 报价功能-功能

## api.rigth.QuotationFunctionRightAction

**数据类型**:

#### quotationFunctionRight

    - **qfrid**: ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **quotationFunction**: 功能 , 类型 [quotationFunction](./quotation.html#api.quotation.QuotationFunctionAction.quotationFunction)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `queryQuotationFunctionRight` <span style="color:gray">[内部]</span>

        通过名称获取报价功能

    ### `updateQuotationFunctionRight` <span style="color:gray">[内部]</span>

        更新功能名称和功能之间关系
