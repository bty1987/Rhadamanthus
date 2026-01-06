# material 主材
## 订单

主材单信息以及部分业务管理

## api.material.MaterialAction

**数据类型**:

#### material

    - **mid**: 主材单ID
      - 类型: *Long*
    - **no**: 主材单号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*

    - **salesman**: 业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **materialer**: 主材员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **instorer**: 驻店 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **grade**: 等级 , 包括: A/B/C
      - 类型: *String*
    - **category**: 品类
      - 类型: *String*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **brand**: 品牌
      - 类型: *String*

    - **designerFlag**: 设计师标识 , 0: 业务员类型为设计师 , 1: 业务员类型非设计师
      - 类型: *Short*
    - **packageFlag**: 套餐标识 , 0: 主材单中存在套餐 , 1: 主材单中不存在套餐
      - 类型: *Short*

    - **designRegion**: 设计大区
      - 类型: *String*
    - **designDepartment**: 设计部
      - 类型: *String*
    - **materialDepartment**: 主材部
      - 类型: *String*

    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **preBalanceTime**: 预结算时间
      - 类型: *Timestamp*
    - **postBalanceTime**: 结算时间
      - 类型: *Timestamp*
    - **fullpayTime**: 补款收款时间
      - 类型: *Timestamp*

    - **type**: 类型 , 包括: 0: 标准
      - 类型: *String*
    - **status**: 状态 , 包括: 0: 初始 , 1: 删除 , 2: 退货 , 3: 预结算 , 4: 购货 (保留) , 5: 结算 , 6: 全退 , 7: 倒单 , 8: 废单 , 9: 完结
      - 类型: *Short*
    - **balanceStatus**: 结算状态 , 包括: 0: 初始 , 1: 预结算 , 2: 结算
      - 类型: *Short*
    - **otherStatus**: 其他状态 , 包括: 1: 补款审批 , 2: 修理
      - 类型: *Short*

    - **depositPayment**: 定金金额
      - 类型: *Long*
    - **depositStatus**: 定金状态 , 包括: 0: 初始 , 1: 未付款 , 2: 已付款 , 3: 已确认
      - 类型: *Short*
    - **fullPayment**: 补款金额
      - 类型: *Long*
    - **fullStatus**: 补款状态 , 包括: 0: 初始 , 1: 未付款 , 2: 已付款 , 3: 已确认
      - 类型: *Short*

    - **total**: 总价
      - 类型: *Long*
    - **distotal**: 折扣总价
      - 类型: *Long*
    - **maling**: 抹零
      - 类型: *Integer*
    - **venderMaling**: 厂商抹零
      - 类型: *Integer*
    - **coupon**: 券值
      - 类型: *Integer*
    - **couponInfo**: 券信息 , 例子: #洁具券:150#
      - 类型: *String*

    - **comment**: 说明
      - 类型: *String*

        |Filters:|
        - **no**: 主材单号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **villageName**: 楼盘
      - 类型: *String*
    - **houseNumber**: 楼牌号
      - 类型: *String*
    - **instoreId**: 驻店员编号
      - 类型: *String*
    - **salesmanId**: 业务员编号
      - 类型: *String*
    - **salesmanName**: 业务员名
      - 类型: *String*
    - **fullStatusRange**: 补款状态范围 , 支持查询多个状态 , 包括: 0: 初始 , 1: 提交 , 2: 收款 , 3: 确认 , 4: 审批 , 格式为: 1,2000,3
      - 类型: *String*
    - **fullCollectTimeRange**: 补款收款时间 , 格式: 2016/01/01-2016/01/01
      - 类型: *String*

    ### `pageMaterial` <span style="color:gray">[内部]</span>

        分页方式获取主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        主材单状态不可为1(删除) , 归属装修单号非空

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *material*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },

                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",

                            "designerFlag": 1,
                            "packageFlag": 1,

                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",

                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",

                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,

                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,

                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageMaterialForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过装修单号 , 同时主材单状态不为1(删除)

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *material*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },

                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",

                            "designerFlag": 1,
                            "packageFlag": 1,

                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",

                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",

                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,

                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,

                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageMaterialByOrderId` <span style="color:gray">[内部]</span>

        分页方式获取操作用户所有主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过归属装修单号 , 根据当前操作用户信息 , 过滤主材单归属人员 , 包括业务员 , 驻店员 , 主材员

**请求参数**:

- **material.orderId**:
  订单编号

        **示例**:{
                "material.orderId": 1601010001
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *material*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },

                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",

                            "designerFlag": 1,
                            "packageFlag": 1,

                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",

                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",

                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,

                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,

                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageMaterialByUserId` <span style="color:gray">[内部]</span>

        分页方式获取订单所有主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过归属装修单号 , 根据当前操作用户信息 , 过滤主材单归属人员 , 包括业务员 , 驻店员 , 主材员

**请求参数**:

- **material.orderId**:
  订单编号

        **示例**:{
                "material.orderId": 1601010001
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *material*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },

                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",

                            "designerFlag": 1,
                            "packageFlag": 1,

                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",

                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",

                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,

                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,

                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryMaterialByMid` <span style="color:gray">[内部]</span>

        通过主材单ID获取主材单信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

**请求参数**:

- **material.mid**:
  主材单ID

        **示例**:{
                "material.mid": 1
            }

**返回参数**:

- **material**: 主材单信息 , 类型 *material*
          - 类型: *Object*

        **示例**:{
                ...
                "material":{
                    "mid": 1,
                    "no": "M1601012703",
                    "orderId": "1601010001",
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "buildArea": 88.6
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "materialer": {
                        "uid": 21,
                        "userId": "FL-83726",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "179xxxx2837",
                        ...
                    },
                    "instorer": {
                        "uid": 87,
                        "userId": "FL-83726",
                        "userName": "宋茜",
                        "currentName": "宋茜",
                        "phone": "138xxxx2837",
                        ...
                    },

                    "grade": "B",
                    "category": "洁具",
                    "brand": "卫浴",

                    "designerFlag": 1,
                    "packageFlag": 1,

                    "designRegion": "设计一分区",
                    "designDepartment": "设计一部",
                    "materialDepartment": "主材二组",

                    "createTime": "2016-01-01 15:31:55",
                    "preBalanceTime": "2016-01-01 00:00:00",
                    "postBalanceTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 13:03:09",

                    "type": 1,
                    "status": 0,
                    "balanceStatus": 0,
                    "otherStatus": 2000,

                    "total": 0,
                    "distotal": 0,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",

                    "depositPayment": 0,
                    "depositStatus": 3,
                    "fullPayment": 2360000,
                    "fullStatus": 2000,

                    "comment": ""
                }
                ...
            }

    ### `queryMaterialByNo` <span style="color:gray">[内部]</span>

        通过主材单号获取主材单信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

**请求参数**:

- **material.no**:
  主材单号

        **示例**:{
                "material.no": 1
            }

**返回参数**:

- **material**: 主材单信息 , 类型 *material*
          - 类型: *Object*

        **示例**:{
                ...
                "material":{
                    "mid": 1,
                    "no": "M1601012703",
                    "orderId": "1601010001",
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "buildArea": 88.6
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "materialer": {
                        "uid": 21,
                        "userId": "FL-83726",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "179xxxx2837",
                        ...
                    },
                    "instorer": {
                        "uid": 87,
                        "userId": "FL-83726",
                        "userName": "宋茜",
                        "currentName": "宋茜",
                        "phone": "138xxxx2837",
                        ...
                    },

                    "grade": "B",
                    "category": "洁具",
                    "brand": "卫浴",

                    "designerFlag": 1,
                    "packageFlag": 1,

                    "designRegion": "设计一分区",
                    "designDepartment": "设计一部",
                    "materialDepartment": "主材二组",

                    "createTime": "2016-01-01 15:31:55",
                    "preBalanceTime": "2016-01-01 00:00:00",
                    "postBalanceTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 13:03:09",

                    "type": 1,
                    "status": 0,
                    "balanceStatus": 0,
                    "otherStatus": 2000,

                    "total": 0,
                    "distotal": 0,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",

                    "depositPayment": 0,
                    "depositStatus": 3,
                    "fullPayment": 2360000,
                    "fullStatus": 2000,

                    "comment": ""
                }
                ...
            }

    ### `addMaterial` <span style="color:gray">[内部]</span>

        创建主材单信息 , 同时包括主材项信息

        判断主材单品牌信息与主材项品牌信息是否一致 , 不一致 , 错误信息 **180024 主材项品牌不一致**

        获取当前默认主材活动信息 , 同时赋值给创建的主材单

        主材项需要判断套餐项目过程 , 针对总价计算以及结算信息进行区分处理

        利用归属装修单等级和公司以及主材单归属公司 , 按照规则生成主材单等级信息

**请求参数**:

- **material.orderId**:
  装修单号
        - **material.salesman.userId**:
  业务员编号
        - **material.materialer.userId**:
  主材员编号
        - **material.instore.userId**:
  驻店编号
        - **material.category**:
  品类
        - **material.bid**:
  品牌ID
        - **material.brand**:
  品牌
        - **material.type**:
  类型 , 包括: 0:标准
        - **material.total**:
  总价
        - **material.maling**:
  抹零
        - **material.coupon**:
  券值
        - **material.couponInfo**:
  券信息
        - **material.comment**:
  说明

        - **materialItem[n].no**:
  型号编号
        - **materialItem[n].name**:
  型号名
        - **materialItem[n].category**:
  品类
        - **materialItem[n].brand**:
  品牌
        - **materialItem[n].measurementUnit**:
  单位
        - **materialItem[n].packageName**:
  套餐名
        - **materialItem[n].unitPrice**:
  单价
        - **materialItem[n].purchasePrice**:
  进价
        - **materialItem[n].salePrice**:
  折后价
        - **materialItem[n].price**:
  售价
        - **materialItem[n].discount**:
  折扣
        - **materialItem[n].postDiscount**:
  折让
        - **materialItem[n].num**:
  数量
        - **materialItem[n].total**:
  总价
        - **materialItem[n].calcType**:
  结算方式
        - **materialItem[n].prePoint**:
  预结算值
        - **materialItem[n].comment**:
  备注

        **示例**:{
                "material.orderId": "1601010001",
                "material.salesman.userId": "U0186",
                "material.materialer.userId": "U0511",
                "material.instorer.userId": "",
                "material.category": "洁具",
                "material.bid": 1,
                "material.brand": "卫浴",
                "material.type": 1,
                "material.coupon": 0,
                "material.couponInfo": "",
                "material.maling": 0,
                "material.total": 0,
                "material.comment": "",

                "materialItem[0].no": "JP0005",
                "materialItem[0].name": "卫浴AB1116",
                "materialItem[0].category": "洁具",
                "materialItem[0].brand": "卫浴",
                "materialItem[0].measurementUnit": "个",
                "materialItem[0].packageName": "package",

                "materialItem[0].unitPrice": 2670000,
                "materialItem[0].purchasePrice": 1,
                "materialItem[0].salePrice": 2670000,
                "materialItem[0].price": 2670000,
                "materialItem[0].discount": 1,
                "materialItem[0].postDiscount": 1,
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,

                "materialItem[0].calcType": 1,
                "materialItem[0].prePoint": 0,

                "materialItem[0].comment": ""

            }

    ### `changeMaterialForOrderId` <span style="color:gray">[内部]</span>

        更换主材单所属装修单号

        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

**请求参数**:

- **material.no**:
  主材单号
        - **material.orderId**:
  更换装修单号

        **示例**:{
                "material.no": "M1601012703",
                "material.orderId": "1601010001"
            }

    ### `updateMaterialForCoupon` <span style="color:gray">[内部]</span>

        更新主材单中券相关信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

**请求参数**:

- **material.mid**:
  主材单ID
        - **material.coupon**:
  券值
        - **material.couponInfo**:
  券信息 , 例子: #洁具券:150#

        **示例**:{
                "material.mid": 1,
                "material.coupon": 150000,
                "material.couponInfo": #洁具券:150#
            }

    ### `updateMaterialForMaling` <span style="color:gray">[内部]</span>

        更新主材单中抹零信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

**请求参数**:

- **material.mid**:
  主材单ID
        - **material.maling**:
  抹零
        - **material.venderMaling**:
  厂商抹零

        **示例**:{
                "material.mid": 1,
                "material.maling": 100,
                "material.venderMaling": 100
            }

    ### `updateMaterialForActivity` <span style="color:gray">[内部]</span>

        更新主材单参与活动信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

**请求参数**:

- **material.mid**:
  主材单ID
        - **material.activityId**:
  活动ID

        **示例**:{
                "material.mid": 1,
                "material.activityId": 1
            }

    ### `deleteMaterial` <span style="color:gray">[内部]</span>

        删除主材单信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单定金状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

**请求参数**:

- **material.mid**:
  主材单ID

        **示例**:{
                "material.mid": 1
            }

## 型号

主材单型号信息管理

## api.material.MaterialItemAction

**数据类型**:

#### materialItem

    - **miid**: 主材项ID
      - 类型: *Long*
    - **mid**: 主材单ID
      - 类型: *Long*
    - **no**: 型号编号
      - 类型: *String*
    - **name**: 型号名
      - 类型: *String*
    - **category**: 品类
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **packageName**: 套餐名
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **purchasePrice**: 进价
      - 类型: *Integer*
    - **salePrice**: 折后价
      - 类型: *Integer*
    - **price**: 售价
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **postDiscount**: 折让
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Integer*
    - **status**: 状态 , 包括: 0: 初始 , 1: 删除
      - 类型: *Short*
    - **balanceStatus**: 结算状态 , 包括: 0: 初始 , 1: 预结算 , 2: 结算
      - 类型: *Short*
    - **refundStatus**: 退货状态 , 包括: 0: 初始 , 1: 退款
      - 类型: *Short*
    - **rawCalcType**: 原结算方式
      - 类型: *Short*
    - **rawPoint**: 原结算值
      - 类型: *Integer*
    - **calcType**: 结算方式 , 包括: 0: 底价 , 1: 点位
      - 类型: *Short*
    - **prePoint**: 预结算值
      - 类型: *Integer*
    - **postPoint**: 结算值
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*

    ### `queryMaterialItemByMid` <span style="color:gray">[内部]</span>

        通过主材单ID获取型号信息

**请求参数**:

- **material.mid**:
  主材单ID

        **示例**:{
                "material.mid": 1
            }

**返回参数**:

- **materialItems**: 型号信息列表 , 每条数据类型 *materialItem*
          - 类型: *List*

        **示例**:{
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",

                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,

                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,

                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,

                        "comment": null
                    }
                ],
                ...
            }

    ### `queryMaterialItemByMiid` <span style="color:gray">[内部]</span>

        通过主材项ID获取型号信息 , 返回结果为销售基础信息

**请求参数**:

- **materialItem.miid**:
  主材项ID

        **示例**:{
                "materialItem.miid": 1
            }

**返回参数**:

- **materialItem**: 型号信息 , 类型 *materialItem*
          - 类型: *List*

        **示例**:{
                ...
                "materialItem": {
                    "miid": 1,
                    "mid": 1,
                    "no": "JP0005",
                    "name": "卫浴AB1116",
                    "category": "洁具",
                    "brand": "卫浴",
                    "measurementUnit": "个",
                    "packageName": "package",

                    "unitPrice": 2670000,
                    "purchasePrice": 1,
                    "salePrice": 2670000,
                    "price": 2670000,
                    "discount": 1,
                    "postDiscount": 1,
                    "num": 2000,
                    "total": 0,

                    "status": 0,
                    "balanceStatus": 0,
                    "refundStatus": 0,

                    "rawCalcType": 0,
                    "rawPoint": 1,
                    "calcType": 1,
                    "prePoint": 0,
                    "postPoint": 0,

                    "comment": null
                }
                ...
            }

    ### `queryMaterialItemForNameByName` <span style="color:gray">[内部]</span>

        通过主材项名称查询指定主材单下型号相关信息

**请求参数**:

- **materialItem.mid**:
  主材单ID
        - **materialItem.name**:
  型号名称

        **示例**:{
                "materialItem.mid": 1,
                "materialItem.name": "卫浴"
            }

**返回参数**:

- **materialItems**: 型号信息列表 , 每条数据类型 *materialItem*
          - 类型: *List*

        **示例**:{
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",

                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,

                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,

                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,

                        "comment": null
                    }
                ],
                ...
            }

    ### `queryMaterialItemForNameByNo` <span style="color:gray">[内部]</span>

        通过主材项编号查询指定主材单下型号相关信息

**请求参数**:

- **materialItem.mid**:
  主材单ID
        - **materialItem.no**:
  型号编号

        **示例**:{
                "materialItem.mid": 1,
                "materialItem.no": "AB1154"
            }

**返回参数**:

- **materialItems**: 型号信息列表 , 每条数据类型 *materialItem*
          - 类型: *List*

        **示例**:{
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",

                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,

                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,

                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,

                        "comment": null
                    }
                ],
                ...
            }

    ### `addMaterialItem` <span style="color:gray">[内部]</span>

        主材单中添加主材项信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        主材项需要判断套餐项目过程 , 针对总价计算以及结算信息进行区分处理

        更新主材单中总价金额

**请求参数**:

- **material.mid**:
  主材单ID

        - **materialItem[n].no**:
  型号名
        - **materialItem[n].name**:
  型号名
        - **materialItem[n].category**:
  品类
        - **materialItem[n].brand**:
  品牌
        - **materialItem[n].measurementUnit**:
  单位
        - **materialItem[n].packageName**:
  套餐名
        - **materialItem[n].unitPrice**:
  单价
        - **materialItem[n].purchasePrice**:
  进价
        - **materialItem[n].salePrice**:
  折后价
        - **materialItem[n].price**:
  售价
        - **materialItem[n].discount**:
  折扣
        - **materialItem[n].postDiscount**:
  折让
        - **materialItem[n].num**:
  数量
        - **materialItem[n].total**:
  总价
        - **materialItem[n].calcType**:
  结算方式
        - **materialItem[n].prePoint**:
  预结算值
        - **materialItem[n].comment**:
  备注

        **示例**:{
                "material.mid": 1,
                "materialItem[0].no": "JP0005",
                "materialItem[0].name": "卫浴AB1116",
                "materialItem[0].category": "洁具",
                "materialItem[0].brand": "卫浴",
                "materialItem[0].measurementUnit": "个",
                "materialItem[0].packageName": "package",

                "materialItem[0].unitPrice": 2670000,
                "materialItem[0].purchasePrice": 1,
                "materialItem[0].salePrice": 2670000,
                "materialItem[0].price": 2670000,
                "materialItem[0].discount": 1,
                "materialItem[0].postDiscount": 1,
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,
                "materialItem[0].calcType": 1,
                "materialItem[0].prePoint": 0,
                "materialItem[0].comment": "",

            }

    ### `updateMaterialItemForModel` <span style="color:gray">[内部]</span>

        更新型号类型的型号信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**

        只可更新主材项数量 , 通过利用主材项价格信息更新项目总价以及主材单总价

**请求参数**:

- **material.mid**:
  主材单ID
        - **materialItem.miid**:
  主材项ID
        - **materialItem.num**:
  数量
        - **materialItem.total**:
  总价

        **示例**:{
                "material.mid": 1,
                "materialItem.miid": 2000,
                "materialItem.num": 2000,
                "materialItem.total": 0
            }

    ### `updateMaterialItemForPackage` <span style="color:gray">[内部]</span>

        更新套餐类型的型号信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**

        只可更新主材项数量以及总价 , 总价代表套餐整体价格 , 通过利用主材项价格信息更新项目总价以及主材单总价

**请求参数**:

- **material.mid**:
  主材单ID

        - **materialItem[n].miid**:
  主材项ID
        - **materialItem[n].packageName**:
  套餐名
        - **materialItem[n].num**:
  数量
        - **materialItem[n].total**:
  总价

        **示例**:{
                "material.mid": 1,
                "materialItem[0].miid": 1,
                "materialItem[0].packageName": "套餐1",
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,
            }

    ### `changeMaterialItemForCaclType` <span style="color:gray">[内部]</span>

        更改主材项结算方式

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**

        判断主材项是否为套餐 , 套餐不可修改 , 错误信息 **180010 套餐不能修改结算方式**

**请求参数**:

- **materialItem.miid**:
  主材型号ID
        - **materialItem.prePoint**:
  结算值

        **示例**:{
                "materialItem.miid": 1,
                "materialItem.prePoint": 10
            }

    ### `updateMaterialItemForPrePT` <span style="color:gray">[内部]</span>

        更新主材项预结算计算值

**请求参数**:

- **materialItem.miids**:
  主材项ID

        **示例**:{
                "materialItem.miids": 15
            }

    ### `deleteMaterialItem` <span style="color:gray">[内部]</span>

        删除主材项信息

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**

        计算项目总金额更新主材单总金额

**请求参数**:

- **material.mid**:
  主材单ID
        - **miids[n]**:
  主材项ID列表 , 类型为 Long

        **示例**:{
                "material.mid": 1,
                "miids[0]": 1,
                "miids[1]": 2
            }

## 退货

主材单退货信息管理

## api.material.MaterialRefundAction

**数据类型**:

#### materialRefund

    - **mrid**: 退货型号ID
      - 类型: *Long*
    - **mid**: 主材单ID
      - 类型: *Long*
    - **miid**: 主材项ID
      - 类型: *Long*
    - **ident**: 批次标识 , 标识退货批次
      - 类型: *Integer*
    - **no**: 型号编号
      - 类型: *String*
    - **name**: 型号名
      - 类型: *String*
    - **category**: 品类
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **packageName**: 套餐名
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **purchasePrice**: 进价
      - 类型: *Integer*
    - **salePrice**: 折后价
      - 类型: *Integer*
    - **price**: 售价
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **postDiscount**: 折让
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Integer*
    - **status**: 状态 , 包括: 0: 退货 , 1: 取消 , 2: 已收款 , 3: 已确认
      - 类型: *Short*
    - **balanceType**: 结算类型
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*

    ### `queryMaterialRefundByMid` <span style="color:gray">[内部]</span>

        通过主材单ID获取退货信息

**请求参数**:

- **materialRefund.mid**:
  主材单ID

        **示例**:{
                "materialRefund.mid": 1
            }

**返回参数**:

- **materialRefunds**: 型号信息列表 , 每条数据类型 *materialRefund*
          - 类型: *List*

        **示例**:{
                ...
                "materialRefunds": [
                    {
                        "mrid": 31,
                        "mid": 8,
                        "miid": 10000,
                        "ident": 382000,
                        "no": "JP0005",
                        "name": "卫浴AB1154",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个"
                        "packageName": "package",
                        "unitPrice": 2670000,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,
                        "status": 0,
                        "balanceStatus": 0,
                        "refundDes": "",
                        "postPoint": 0,
                        "prePoint": 0,
                        "comment": ""
                    }
                ],
                ...
            }

## 结算

主材单结算功能

## api.material.MaterialBalanceAction

**数据类型**:

#### materialBalance

    - **mbid**: 结算ID
      - 类型: *Long*
    - **material**: 主材单 , 类型 [material](./material.html#api.material.MaterialAction.material)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **instorer**: 主材驻店 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **poster**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balanceTime**: 预结算时间 , 既创建时间
      - 类型: *Timestamp*
    - **postTime**: 结算时间
      - 类型: *Timestmp*
    - **balance**: 结算值 , 利润
      - 类型: *Long*
    - **difference**: 差值 , 既总额 - 结算值
      - 类型: *Long*
    - **vbalance**: 厂商结算
      - 类型: *Long*
    - **post**: 结算值
      - 类型: *Long*
    - **vbalanceTime**: 厂商结算时间
      - 类型: *Timestamp*
    - **total**: 总价 , 生成结算数据时 , 购货类型记录主菜单总额 , 预结算/结算退货时记录退货款金额
      - 类型: *Long*
    - **status**: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
      - 类型: *Short*
    - **type**: 类型 , 0: 购货 , 1: 预结算退货 , 2: 结算退货
      - 类型: *Short*
    - **ident**: 退货标识
      - 类型: *Integer*
    - **mpid**: 款项ID, 类型为1(预结算退货)和2(结算退货)需要关联退货生成款项
      - 类型: *Integer*

        |Filters:|
        - **msoNo**: 主材单号
      - 类型: *String*
    - **instoreId**: 驻店员编号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **type**: 类型 , 0: 购货 , 1: 退货
      - 类型: *Short*
    - **status**: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
      - 类型: *Short*
    - **fullCollectTimeRange**: 补款收款时间 , 格式: 2016/01/01-2016/01/01
      - 类型: *String*

    ### `pageMaterialBalance` <span style="color:gray">[内部]</span>

        分页方式获取主材结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *materialBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            mbid: 1,
                            creater: {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "instorer": null,
                            "poster": null,
                            "balanceTime": "2016-01-01 00:00:00",
                            "balance": 0,
                            "difference": 0,
                            "vbalance": 0,
                            "vbalanceTime": null,
                            "total": 100,
                            "status": 0,
                            "type": 0,
                            "ident": 0,
                            "material": {
                                "mid": 1,
                                "no": "M1601012703",
                                "orderId": "1601010001",
                                "house":{
                                    "hid": 1,
                                    "village": {
                                        "vid": 1,
                                        "no": "P001",
                                        "name": "广场一期"
                                    },
                                    "houseNumber": "1#1-1-1",
                                    "buildArea": 88.6
                                },
                                "salesman": {
                                    "uid": 3,
                                    "userId": "FL-00638",
                                    "userName": "李宁",
                                    "currentName": "李宁",
                                    "phone": "156xxxx9283",
                                    ...
                                },
                                "materialer": {
                                    "uid": 21,
                                    "userId": "FL-83726",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "179xxxx2837",
                                    ...
                                },
                                "instorer": {
                                    "uid": 87,
                                    "userId": "FL-83726",
                                    "userName": "宋茜",
                                    "currentName": "宋茜",
                                    "phone": "138xxxx2837",
                                    ...
                                },

                                "category": "洁具",
                                "brand": "卫浴",

                                "designerFlag": 1,
                                "packageFlag": 1,

                                "designRegion": "设计一分区",
                                "designDepartment": "设计一部",
                                "materialDepartment": "主材二组",

                                "createTime": "2016-01-01 15:31:55",
                                "preBalanceTime": "2016-01-01 00:00:00",
                                "postBalanceTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 13:03:09",

                                "type": 1,
                                "status": 0,
                                "balanceStatus": 0,
                                "otherStatus": 2000,

                                "total": 0,
                                "distotal": 0,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": "",

                                "depositPayment": 0,
                                "depositStatus": 3,
                                "fullPayment": 2360000,
                                "fullStatus": 2000,

                                "comment": ""
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageMaterialBalanceForVender` <span style="color:gray">[内部]</span>

        分页方式获取主材结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据当前登陆系统的用户信息获取关联的主材驻店人员进行获取主材结算信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材结算信息列表 , 每条数据类型 *materialBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            mbid: 1,
                            creater: {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "instorer": null,
                            "poster": null,
                            "balanceTime": "2016-01-01 00:00:00",
                            "balance": 0,
                            "difference": 0,
                            "vbalance": 0,
                            "vbalanceTime": null,
                            "total": 100,
                            "status": 0,
                            "type": 0,
                            "ident": 0,
                            "material": {
                                "mid": 1,
                                "no": "M1601012703",
                                "orderId": "1601010001",
                                "house":{
                                    "hid": 1,
                                    "village": {
                                        "vid": 1,
                                        "no": "P001",
                                        "name": "广场一期"
                                    },
                                    "houseNumber": "1#1-1-1",
                                    "buildArea": 88.6
                                },
                                "salesman": {
                                    "uid": 3,
                                    "userId": "FL-00638",
                                    "userName": "李宁",
                                    "currentName": "李宁",
                                    "phone": "156xxxx9283",
                                    ...
                                },
                                "materialer": {
                                    "uid": 21,
                                    "userId": "FL-83726",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "179xxxx2837",
                                    ...
                                },
                                "instorer": {
                                    "uid": 87,
                                    "userId": "FL-83726",
                                    "userName": "宋茜",
                                    "currentName": "宋茜",
                                    "phone": "138xxxx2837",
                                    ...
                                },

                                "category": "洁具",
                                "brand": "卫浴",

                                "designerFlag": 1,
                                "packageFlag": 1,

                                "designRegion": "设计一分区",
                                "designDepartment": "设计一部",
                                "materialDepartment": "主材二组",

                                "createTime": "2016-01-01 15:31:55",
                                "preBalanceTime": "2016-01-01 00:00:00",
                                "postBalanceTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 13:03:09",

                                "type": 1,
                                "status": 0,
                                "balanceStatus": 0,
                                "otherStatus": 2000,

                                "total": 0,
                                "distotal": 0,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": "",

                                "depositPayment": 0,
                                "depositStatus": 3,
                                "fullPayment": 2360000,
                                "fullStatus": 2000,

                                "comment": ""
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageMaterialForPreBalance` <span style="color:gray">[内部]</span>

        分页方式获取需要预结算的主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材单信息列表 , 每条数据类型 *material*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },

                            "category": "洁具",
                            "brand": "卫浴",

                            "designerFlag": 1,
                            "packageFlag": 1,

                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",

                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",

                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,

                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,

                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `updateMaterialBalanceForVBalance` <span style="color:gray">[内部]</span>

        更新主材结算信息中的厂商结算值

        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**

        判断主材结算信息状态是否为0(预结算) , 其他状态 **180019 主材结算信息状态错误**

**请求参数**:

- **materialBalance.mbid**:
  结算ID
        - **materialBalance.vbalance**:
  厂商结算值

        **示例**:{
                "materialBalance.mbid": 1,
                "materialBalance.vbalance": 100
            }

    ### `updateMaterialBalanceForBalance` <span style="color:gray">[内部]</span>

        更新主材结算信息中的结算值

        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**

        判断主材结算信息状态是否为1(厂商结算) , 其他状态 **180019 主材结算信息状态错误**

**请求参数**:

- **materialBalance.mbid**:
  结算ID
        - **materialBalance.balance**:
  厂商结算值

        **示例**:{
                "materialBalance.mbid": 1,
                "materialBalance.balance": 100
            }

    ### `passBalanceMaterial` <span style="color:gray">[内部]</span>

        批量处理主材单到完结 , 主要提供跳过主材结算过程

        根据主材单状态以及结算状态处理 , 状态为0(初始) , 结算状态为0(初始)

        更新主材单状态为9(完结)

**请求参数**:

- **mids[n]**:
  主材单ID列表 , 每条数据类型 Long

        **示例**:{
                "mids[0]": 1,
                "mids[1]": 2
            }

    ### `preBalanceMaterial` <span style="color:gray">[内部]</span>

        批量预结算主材单

        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**

        判断预结算的主材单是否存在未处理审批 , 存在未处理审批 , 错误信息 **240007 存在未处理审批信息**

        判断主材单状态以及结算状态进行处理 , 状态为0(初始) , 结算状态为0(初始) , 补款状态为3(已确认) , 满足三个状态可以进行预结算处理

        生成主材单对应的主材结算信息

        利润计算公式 , 套餐商品只能根据点位方式进行计算

        点位计算方式: 利润 = (售价 - 折扣价 * (1 - 点位)) * 数量 , 成本 = 折扣价 * (1 - 点位) * 数量

        底价计算方式: 利润 = (售价 - 底价) * 数量 , 成本 = 底价 * 数量

        套餐计算方式: 利润 = 总价 * 点位 , 成本 = 总价 * (1 - 点位)

**请求参数**:

- **mids[n]**:
  主材单ID列表 , 每条数据类型 Long

        **示例**:{
                "mids[0]": 1,
                "mids[1]": 2
            }

    ### `vpostMaterialBalance` <span style="color:gray">[内部]</span>

        厂商结算

        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**

        判断主材结算信息状态是否为0(预结算) , 其他状态 **180019 主材结算信息状态错误**

**请求参数**:

- **materialBalance.mbid**:
  结算ID

        **示例**:{
                "materialBalance.mbid": 1
            }

    ### `postMaterialBalance` <span style="color:gray">[内部]</span>

        结算

        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**

        判断主材结算信息状态是否为1(厂商结算) , 其他状态 **180019 主材结算信息状态错误**

**请求参数**:

- **materialBalance.mbid**:
  结算ID

        **示例**:{
                "materialBalance.mbid": 1
            }

## 活动

主材单活动管理

## api.material.MaterialActivityAction

**数据类型**:

#### materialActivityItem

    - **maiid**: 活动项ID
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

    - **type**: 类型 , 0: 券 , 1: 物品
      - 类型: *Short*
    - **state**: 状态 , 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
      - 类型: *Short*
    - **isStock**: 是否计入库存 , 0: 计入 , 1: 不计入
      - 类型: *Short*
    - **isPayment**: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
      - 类型: *Short*

    - **num**: 数量
      - 类型: *Integer*
    - **money**: 价格
      - 类型: *Integer*
    - **content**: 备注
      - 类型: *String*

    - **receiveUserId**: 接收人编号
      - 类型: *String*
    - **receiveUserName**: 接收人名
      - 类型: *String*
    - **receiveTime**: 接收时间
      - 类型: *Timestamp*

    ### `queryMaterialActivity` <span style="color:gray">[内部]</span>

        通过装修单号 , 获取归属主材单参与的活动信息以及款项信息

**请求参数**:

- **material.orderId**:
  装修单号

        **示例**:{
                "material.orderId": "1601010001"
            }

**返回参数**:

- **materialActivitys**: 活动信息 , 类型 List <Map <String, String>>
          - 类型: *Object*

        **示例**:{
                ...
                "materialActivitys":[
                    {
                        "aid": 1,
                        "activity": "活动",
                        "amount": 1530,
                    }
                ],
                ...
            }

    ### `queryMaterialActivityItem` <span style="color:gray">[内部]</span>

        通过装修单号 , 查询归属所有主材单参与的活动项信息

**请求参数**:

- **material.orderId**:
  装修单号

        **示例**:{
                "material.orderId": "1601010001"
            }

**返回参数**:

- **materialActivityItems**: 活动项信息列表 , 每条数据类型 *materialActivityItem*
          - 类型: *List*

        **示例**:{
                ...
                "MaterialActivityItems": [
                    {
                        "maiid": 1,
                        "orderId": "1601010001",
                        "aid": 1,
                        "asid": 1,
                        "activity": "测试",
                        "name": "测试项",
                        "state": 0,
                        "type": 0,
                        "stateType": 0,

                        "money": 100,
                        "num": 1,
                        "content": "",


                        "receiveTime": "2016-08-21 15:00:54",
                        "receiveUserId": "",
                        "receiveUserName": ""
                    }
                ],
                ...
            }

    ### `addMaterialActivityItem` <span style="color:gray">[内部]</span>

        添加主材活动项

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **materialActivityItem.orderId**:
  装修单号
        - **materialActivityItem.aid**:
  活动ID
        - **materialActivityItem.asid**:
  奖品ID
        - **materialActivityItem.activity**:
  活动名
        - **materialActivityItem.name**:
  物品名
        - **materialActivityItem.type**:
  类型
        - **materialActivityItem.num**:
  数量
        - **materialActivityItem.money**:
  金额
        - **materialActivityItem.content**:
  说明

        **示例**:{
                "materialActivityItem.orderId": "1601010001",
                "materialActivityItem.aid": 1,
                "materialActivityItem.asid": 1,
                "materialActivityItem.activity": "活动名",
                "materialActivityItem.name": "活动项",
                "materialActivityItem.type": 0,
                "materialActivityItem.num": 1500,
                "materialActivityItem.money": 10000,
                "materialActivityItem.content": "说明"
            }

    ### `receiveMaterialActivityItem` <span style="color:gray">[内部]</span>

        领取主材活动项

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**

        判断主材活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录

**请求参数**:

- **materialActivityItem.maiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.maiid": 1
            }

    ### `abateMaterialActivityItem` <span style="color:gray">[内部]</span>

        失效主材活动项

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断主材活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        主材活动项状态更新为1(失效)

**请求参数**:

- **materialActivityItem.maiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.maiid": 1
            }

    ### `deliveMaterialActivityItem` <span style="color:gray">[内部]</span>

        配送主材活动项

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断主材活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        主材活动项状态更新为4(配送)

**请求参数**:

- **materialActivityItem.daiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.daiid": 1
            }

    ### `unrefundMaterialActivityItem` <span style="color:gray">[内部]</span>

        未退装修活动 , 已审批未退货

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断主材活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        主材活动项状态更新为5(未退)

**请求参数**:

- **materialActivityItem.daiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.daiid": 1
            }

    ### `refundMaterialActivityItem` <span style="color:gray">[内部]</span>

        退货主材活动项

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断主材活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        主材活动项状态更新为3(退货)

        判断主材活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号

**请求参数**:

- **materialActivityItem.daiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.daiid": 1
            }

    ### `expendMaterialActivityItem` <span style="color:gray">[内部]</span>

        消耗主材活动项

        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断主材活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        主材活动项状态更新为7(消耗)

**请求参数**:

- **materialActivityItem.daiid**:
  活动项ID

        **示例**:{
                "materialActivityItem.daiid": 1
            }
