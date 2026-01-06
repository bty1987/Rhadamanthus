# sales 销售
## 销售

### 销售单

## api.material.SalesAction

**数据类型**:

#### sales

    - **sid**: 销售单ID
      - 类型: *Long*
    - **no**: 编号 , 由日期加六位格式计数组成 , 例: 1601010001
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*

    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **grade**: 等级 , 包括: A/B/C
      - 类型: *String*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*

    - **salesman**: 业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **dept**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **guider**: 导购 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **instorer**: 驻店 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **guideDept**: 导购归属部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **finisher**: 完结人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **category**: 品类
      - 类型: *String*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **brand**: 品牌
      - 类型: *String*

    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **fullpayTime**: 补款时间
      - 类型: *Timestamp*
    - **finishTime**: 完结时间
      - 类型: *Timestamp*
    - **affirmTime**: 确认时间
      - 类型: *Timestamp*

    - **isAffirm**: 确认状态
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 2: 全退 , 3: 倒单 , 4: 废单 , 5: 完结
      - 类型: *Short*
    - **depositpay**: 定金
      - 类型: *Long*
    - **depositpayStatus**: 定金状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认
      - 类型: *Short*
    - **fullpay**: 补款
      - 类型: *Long*
    - **fullpayStatus**: 补款状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认
      - 类型: *Short*
    - **balanceStatus**: 结算状态 , 0: 初始 , 1: 预结算 , 2: 厂商结算 , 3: 结算 , 4: 完结
      - 类型: *Short*

    - **total**: 总额
      - 类型: *Long*
    - **amount**: 总额 , 当前总额
      - 类型: *Long*
    - **maling**: 抹零
      - 类型: *Integer*
    - **venderMaling**: 厂商抹零
      - 类型: *Integer*
    - **coupon**: 券值
      - 类型: *Integer*
    - **couponInfo**: 券信息 , 例: #洁具券:150#
      - 类型: *String*
    - **ctype**: 结算类型 , 0: 底价 , 1: 点位 , 2: 不计算(默认)
      - 类型: *Short*
    - **cvalue**: 结算值
      - 类型: *Long*

    - **comment**: 备注
      - 类型: *String*

    - **company**: 公司 , 通常为销售公司
      - 类型: *Long*
    - **dompany**: 公司 , 通常为装修公司
      - 类型: *Long*
    - **pompany**: 公司 , 通常为收款公司
      - 类型: *Long*

        |Filters:|
        - **no**: 销售单号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **instorerId**: 驻店员编号
      - 类型: *String*
    - **salesmanId**: 业务员编号
      - 类型: *String*
    - **salesmanName**: 业务员名
      - 类型: *String*
    - **fullpayTimeRange**: 补款收款时间 , 格式: 2016/01/01-2016/01/01
      - 类型: *String*

    ### `pageSales` <span style="color:gray">[内部]</span>

        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据当前操作用户信息 , 过滤销售单归属人员 , 包括业务 , 驻店 , 导购

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForDompany` <span style="color:gray">[内部]</span>

        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单归属的第二公司进行查询 , 第二公司为装修单公司

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForPompany` <span style="color:gray">[内部]</span>

        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单归属的第三公司进行查询 , 第三公司为款项公司

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForSupplier` <span style="color:gray">[内部]</span>

        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据当前操作用户信息 , 查询对应厂商对应的销售单

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForBalance` <span style="color:gray">[内部]</span>

        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "company": 1,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForBalanceByDompany` <span style="color:gray">[内部]</span>

        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据销售单归属第二公司进行查询 , 第二公司为装修单公司

        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesForBalanceByPompany` <span style="color:gray">[内部]</span>

        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据销售单归属第三公司进行查询 , 第三公司为款项公司

        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesByOrderId` <span style="color:gray">[内部]</span>

        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过装修单号获取归属的销售单信息

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId:": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售单信息列表 , 每条数据类型 *sales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }

    ### `querySalesBySid` <span style="color:gray">[内部]</span>

        通过销售单ID获取销售单信息

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

**返回参数**:

- **sales**: 销售单信息 , 类型 *sales*
          - 类型: *List*

        **示例**:{
                ...
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "phone": "",
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
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "affirmTime": "2016-01-01 00:00:00",
                    "isAffirm": 0,
                    "status": 0,
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",
                    "comment": "",
                    "company": 1
                }
                ...
            }

    ### `querySalesByNo` <span style="color:gray">[内部]</span>

        通过销售单编号获取销售单信息

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

**请求参数**:

- **sales.no**:
  销售单编号

        **示例**:{
                "sales.no": "1601010001"
            }

**返回参数**:

- **sales**: 销售单信息 , 类型 *sales*
          - 类型: *List*

        **示例**:{
                ...
                "sales": {
                        "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "phone": "",
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
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "affirmTime": "2016-01-01 00:00:00",
                    "isAffirm": 0,
                    "status": 0,
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",
                    "comment": "",
                    "company": 1
                }
                ...
            }

    ### `amountSales` <span style="color:gray">[内部]</span>

        汇总销售总额

**请求参数**:

- **sales.orderId**:
  销售单ID

        **示例**:{
                "sales.orderId": "1601010001"
            }

**返回参数**:

- **amount**: 销售总额
          - 类型: *Long*

        **示例**:{
                ...
                "amount": 1000000,
                ...
            }

    ### `sendSales` <span style="color:gray">[内部]</span>

        推送销售单

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

    ### `checkSales` <span style="color:gray">[内部]</span>

        验证销售单

        根据归属装修单判断销售单状态是否全部完结 , 存在其他状态 , 错误信息 **260057 销售单未完结**

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId": "1601010001",
            }

    ### `addSales` <span style="color:gray">[内部]</span>

        创建销售单

        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断装修单状态为

        获取第二公司信息 , 解密过程以及获取公司信息 , 处理失败 , 错误信息 **230015 公司不存在**

        销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**

        销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**

        利用归属装修单等级和公司以及销售单归属公司 , 按照规则生成销售单等级信息

**请求参数**:

- **sales.orderId**:
  装修单号
        - **sales.phone**:
  电话
        - **sales.house.hid**:
  房产ID
        - **sales.salesman.userId**:
  业务员编号
        - **sales.guider.userId**:
  主材员编号
        - **sales.instorer.userId**:
  驻店编号
        - **sales.category**:
  品类
        - **sales.bid**:
  品牌ID
        - **sales.brand**:
  品牌
        - **sales.total**:
  总价
        - **sales.maling**:
  抹零
        - **sales.coupon**:
  券值
        - **sales.comment**:
  备注

        - **salesItems[n].goods.gid**:
  商品ID
        - **salesItems[n].color.cid**:
  颜色ID
        - **salesItems[n].format.fid**:
  规格ID
        - **salesItems[n].purchase**:
  进价
        - **salesItems[n].selling**:
  售价
        - **salesItems[n].discount**:
  折扣
        - **salesItems[n].disPrice**:
  折扣价
        - **salesItems[n].postDis**:
  折让
        - **salesItems[n].price**:
  折让价
        - **salesItems[n].priceType**:
  价格类型
        - **salesItems[n].num**:
  数量
        - **salesItems[n].total**:
  总价
        - **salesItems[n].comment**:
  备注
        - **salesItems[n].ctype**:
  结算方式
        - **salesItems[n].cvalue**:
  结算值

        **示例**:{
                "sales.orderId": "1601010001",
                "sales.phone": "",
                "sales.house.hid": 1,
                "sales.salesman.userId": "U0186",
                "sales.guider.userId": "U0511",
                "sales.instore.userId": "",
                "sales.category": "洁具",
                "sales.bid": 1,
                "sales.brand": "卫浴",
                "sales.coupon": 0,
                "sales.couponInfo": "",
                "sales.comment": "",
                "sales.maling": 0,
                "sales.total": 0,

                "salesItems[0].goods.gid": 1,
                "salesItems[0].color.cid": 1,
                "salesItems[0].format.fid": 1,
                "salesItems[0].purchase": 50000
                "salesItems[0].selling": 100000,
                "salesItems[0].discount": 900,
                "salesItems[0].disPrice": 90000
                "salesItems[0].postDis": 900,
                "salesItems[0].price": 81000,
                "salesItems[0].priceType": 0,
                "salesItems[0].num": 1,
                "salesItems[0].total": 81000,
                "salesItems[0].comment": "",
                "salesItems[0].ctype": "",
                "salesItems[0].cvalue": ""
            }

    ### `updateSales` <span style="color:gray">[内部]</span>

        更新销售单信息

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.grade**:
  等级

        **示例**:{
                "sales.sid": 1,
                "sales.grade": "B"
            }

    ### `updateSalesForActivity` <span style="color:gray">[内部]</span>

        更新销售单参与活动信息

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.activityId**:
  活动ID

        **示例**:{
                "sales.sid": 1,
                "sales.activityId": 1
            }

    ### `updateSalesForBelong` <span style="color:gray">[内部]</span>

        更新销售单归属信息 , 渠道(业务)/驻店/导购

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.salesman.userId**:
  业务员编号
        - **sales.guider.userId**:
  主材员编号
        - **sales.instorer.userId**:
  驻店编号
        - **sales.supplier.userId**:
  厂商

        **示例**:{
                "sales.sid": 1,
                "sales.salesman.userId": "U0083",
                "sales.guider.userId": "U0083",
                "sales.instorer.userId": "U0083",
                "sales.supplier.userId": "U0083"
            }

    ### `updateSalesForCoupon` <span style="color:gray">[内部]</span>

        更新销售单中券相关信息

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.coupon**:
  券值
        - **sales.couponInfo**:
  券信息 , 例子: #洁具券:150#

        **示例**:{
                "sales.sid": 1,
                "sales.coupon": 150000
                "sales.couponInfo": #洁具券:150#
            }

    ### `updateSalesForMaling` <span style="color:gray">[内部]</span>

        更新销售单中抹零信息

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.maling**:
  抹零
        - **sales.venderMaling**:
  厂商抹零

        **示例**:{
                "sales.sid": 1,
                "sales.maling": 100000,
                "sales.venderMaling": 100
            }

    ### `updateSalesForAdvance` <span style="color:gray">[内部]</span>

        更新销售单的信息 , 高级业务处理

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        更新销售单状态为0(初始)

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

    ### <I-C> affirmSales

        确认销售单

        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

        判断客户编号是否绑定 , 未绑定 , 错误信息 **330017 装修单未绑定**

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.customer.no**:
  客户编号

        **示例**:{
                "sales.sid": 1,
                "sales.customer.no": "",
            }

    ### `terminalSales` <span style="color:gray">[内部]</span>

        废止销售单

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 结算状态为0(初始) , 定金状态为-1(初始) , 补款状态为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

    ### `finishSales` <span style="color:gray">[内部]</span>

        完结销售单

        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

### 销售项

## api.material.SalesItemAction

**数据类型**:

#### salesItem

    - **siid**: 销售项ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 颜色 , 类型 [color](./data.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 规格 , 类型 [format](./data.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **purchase**: 进价
      - 类型: *Integer*
    - **selling**: 售价
      - 类型: *Integer*
    - **discount**: 折扣
      - 类型: *Integer*
    - **disPrice**: 折扣价
      - 类型: *Integer*
    - **postDis**: 折让
      - 类型: *Integer*
    - **price**: 折让价
      - 类型: *Integer*
    - **priceType**: 价格类型
      - 类型: *Short*
    - **initnum**: 初始量
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*
    - **punum**: 采购余数
      - 类型: *Integer*
    - **xgnum**: 出库余数
      - 类型: *Integer*
    - **rawCtype**: 原结算方式
      - 类型: *Short*
    - **rawCvalue**: 原结算值
      - 类型: *Integer*
    - **ctype**: 结算方式 , 0: 底价 , 1: 点位 , 2: 不计算
      - 类型: *Short*
    - **cvalue**: 结算值
      - 类型: *Integer*

    ### `querySalesItemBySid` <span style="color:gray">[内部]</span>

        通过销售单ID获取销售项

**请求参数**:

- **sales.sid**:
  销售单ID

        **示例**:{
                "sales.sid": 1
            }

**返回参数**:

- **salesItems**: 销售项列表 , 每条数据类型 *salesItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesItems": [
                    {
                        "siid": 1,
                        "sid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
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
                        "purchase": 60,
                        "selling": 90000
                        "discount": 1,
                        "disPrice": 90000
                        "postDis": 1,
                        "price": 90000
                        "initnum": 1,
                        "num": 1,
                        "total": 90000
                        "comment": "",
                        "punum": 1,
                        "xgnum": 1,
                        "rawCtype": 0,
                        "rawCvalue": 80000,
                        "ctype": 0,
                        "cvalue": 80000,
                    }
                ],
                ...
            }

    ### `querySalesItemBySids` <span style="color:gray">[内部]</span>

        通过销售单ID列表获取销售项

**请求参数**:

- **sids[n]**:
  销售单ID列表 , 每条数据类型 Long

        **示例**:{
                "sids[0]": 1
            }

**返回参数**:

- **salesItems**: 销售项列表 , 每条数据类型 *salesItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesItems": [
                    {
                        "siid": 1,
                        "sid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
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
                        "purchase": 60,
                        "selling": 90000
                        "discount": 1,
                        "disPrice": 90000
                        "postDis": 1,
                        "price": 90000,
                        "initnum": 1,
                        "num": 1,
                        "total": 90000
                        "comment": "",
                        "punum": 1,
                        "xgnum": 1,
                        "rawCtype": 0,
                        "rawCvalue": 80000,
                        "ctype": 0,
                        "cvalue": 80000,
                    }
                ],
                ...
            }

    ### `addSalesItem` <span style="color:gray">[内部]</span>

        添加销售项

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**

        销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**

        添加销售项同时需要更新销售单中总额信息

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.total**:
  总额
        - **salesItem.goods.gid**:
  商品ID
        - **salesItem.color.cid**:
  颜色ID
        - **salesItem.format.fid**:
  规格ID
        - **salesItem.purchase**:
  进价
        - **salesItem.selling**:
  售价
        - **salesItem.discount**:
  折扣
        - **salesItem.disPrice**:
  折扣价
        - **salesItem.postDis**:
  折让
        - **salesItem.price**:
  折让价
        - **salesItem.priceType**:
  价格类型
        - **salesItem.num**:
  数量
        - **salesItem.total**:
  总价
        - **salesItem.comment**:
  备注
        - **salesItem.ctype**:
  结算方式
        - **salesItem.cvalue**:
  结算值

        **示例**:{
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.goods.gid": 1,
                "salesItem.color.cid": 1,
                "salesItem.format.fid": 1,
                "salesItem.purchase": 50000
                "salesItem.selling": 100000,
                "salesItem.discount": 900,
                "salesItem.disPrice": 90000
                "salesItem.postDis": 900,
                "salesItem.price": 81000,
                "salesItem.priceType": 0,
                "salesItem.num": 1,
                "salesItem.total": 81000,
                "salesItem.comment": "",
                "salesItem.ctype": "",
                "salesItem.cvalue": "",
            }

    ### `updateSalesItem` <span style="color:gray">[内部]</span>

        更新销售单中销售项 , 只能够更新数量/总额/备注

        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        更新销售项之前需要判断销售单补款状态 , 补款状态为初始 , 其他状态操作失败 , 错误信息 **260045 销售项状态不可操作**

        销售项信息不存在 , 不存在 , 错误信息 **260023 销售项不存在**

        更新销售项同时需要更新销售单中总额信息

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.total**:
  总额
        - **salesItem.siid**:
  销售项ID
        - **salesItem.num**:
  数量
        - **salesItem.total**:
  总价
        - **salesItem.comment**:
  备注

        **示例**:{
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.siid": 1,
                "salesItem.num": 1,
                "salesItem.total": 81000,
                "salesItem.comment": ""
            }

    ### `updateSalesItemForBalance` <span style="color:gray">[内部]</span>

        更新销售项关于结算信息 , 结算方式(ctype)和结算值(cvalue)

        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

        判断销售单结算状态是否为0(初始) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

**请求参数**:

- **salesItem.siid**:
  销售项ID
        - **salesItem.ctype**:
  结算类型
        - **salesItem.cvalue**:
  结算值

        **示例**:{
                "salesItem.siid": 1,
                "salesItem.ctype": 1,
                "salesItem.cvalue": 1
            }

    ### `deleteSalesItem` <span style="color:gray">[内部]</span>

        删除销售单中销售项

        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.total**:
  总额
        - **salesItem.siid**:
  销售项ID

        **示例**:{
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.siid": 1
            }

## 退货

### 退货单

## api.sales.SalesRefundsAction

**数据类型**:

#### salesRefunds

    - **srid**: 退货单ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **spid**: 款项ID
      - 类型: *Long*
    - **total**: 总额
      - 类型: *Long*
    - **type**: 类型 , 0: 退货 , 2: 全退 , 3: 倒单
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 已付款
      - 类型: *Short*
    - **creater**: 创建人 ,  类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **comment**: 备注
      - 类型: *String*

    ### `pageSalesRefunds` <span style="color:gray">[内部]</span>

        分页方式获取销售退货信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  选材单信息列表 , 每条数据类型 *salesRefunds*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "srid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "spid": 1,
                            "total": 100000,
                            "type": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-06-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `querySalesRefundsBySid` <span style="color:gray">[内部]</span>

        通过销售单ID获取退货单

**请求参数**:

- **salesRefunds.sid**:
  销售单ID

        **示例**:{
                "salesRefunds.sid": 1
            }

**返回参数**:

- **salesRefundes**: 退货单列表 , 每条数据类型 *salesRefunds*
          - 类型: *List*

        **示例**:{
                ...
                "salesRefundes": [
                    {
                        "srid": 1,
                        "sid": 1,
                        "spid": 1,
                        "total": 100000,
                        "type": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-06-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }

### 退货项

## api.sales.SalesRefundItemAction

**数据类型**:

#### salesRefundsItem

    - **riid**: 退货项ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **rid**: 退货单ID
      - 类型: *Long*
    - **salesItem**: 销售项 , 类型 [salesItem](./sales.html#api.sales.SalesAction.salesItem)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总额
      - 类型: *Integer*

    ### `querySalesRefundsItemBySid` <span style="color:gray">[内部]</span>

        通过销售单号查询退货项信息

**请求参数**:

- **salesRefunds.sid**:
  销售单ID

        **示例**:{
                "salesRefunds.sid": 1
            }

**返回参数**:

- **salesRefundsItems**: 退货项列表 , 每条数据类型 *salesRefundsItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesRefundsItems": [
                    {
                        "riid": 1,
                        "sid": 1,
                        "rid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
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
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        }
                        "num": 1,
                        "total": 90
                    }
                ],
                ...
            }

    ### `querySalesRefundsItemByRid` <span style="color:gray">[内部]</span>

        通过退货单号查询退货项信息

**请求参数**:

- **salesRefunds.rid**:
  销售单ID

        **示例**:{
                "salesRefunds.rid": 1
            }

**返回参数**:

- **salesRefundsItems**: 退货项列表 , 每条数据类型 *salesRefundsItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesRefundsItems": [
                    {
                        "riid": 1,
                        "sid": 1,
                        "rid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
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
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        }
                        "num": 1,
                        "total": 90
                    }
                ],
                ...
            }

## 外销

### 外销单

## api.sales.OalesAction

**数据类型**:

#### oales

    - **oid**: 外销单ID
      - 类型: *Long*
    - **foid**: 关联外销单ID
      - 类型: *Long*
    - **no**: 编号 , 由日期加六位格式计数组成 , 例: 1601010001
      - 类型: *String*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **customer**: 客户, 类型 [customer](./customer.html#api.customer.CustomerAction.customer)
      - 类型: *Object*

    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **category**: 品类
      - 类型: *String*
    - **bid**: 品牌ID
      - 类型: *Long*
    - **brand**: 品牌
      - 类型: *String*

    - **type**: 类型 , 0: 购货 , 1: 退货
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 内购 , 1: 外购
      - 类型: *Short*
    - **awardType**: 奖励类型 , 0: 设计部 , 1: 服务部 , 2: 工程部
      - 类型: *Short*

    - **servicer**: 服务管家 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **materialer**: 主材员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **channer**: 渠道 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **checker**: 复核人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **dept**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*

    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **checkTime**: 复核时间
      - 类型: *Timestamp*
    - **finishTime**: 完结时间
      - 类型: *Timestamp*

    - **total**: 总额
      - 类型: *Long*
    - **profit**: 利润
      - 类型: *Long*
    - **award**: 奖励
      - 类型: *Long*
    - **cost**: 成本
      - 类型: *Long*
    - **threshold**: 系数
      - 类型: *Integer*

    - **status**: 状态 , 0: 初始 , 1: 提交, 2: 确认 , 3: 驳回 , 4: 复核 , 5: 完结 , 6: 废单
      - 类型: *Short*

    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司
      - 类型: *Long*

    ### `pageOales` <span style="color:gray">[内部]</span>

        分页方式获取外销单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **statuses**: 状态列表 , 每条数据类型 Short
          - 类型: *List*

        **示例**:{
                "statuses[0]": 1,
                "statuses[1]": 2
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  外销单信息列表 , 每条数据类型 *oales*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "oid": 1,
                            "no": "1601010001",
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
                                }
                                "designer": {
                                    "uid": 2,
                                    "userId": "FL-00186",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "phone": "138xxxx1828",
                                    ...
                                }
                            },

                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "servicer": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "materialer": null,
                            "channer": null,

                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },

                            "createTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",

                            "category": "瓷砖",
                            "brand": "瓷砖",

                            "atttype": 0,
                            "awardType": 0,

                            "total": 100000,
                            "profit": 0,
                            "award": 0,

                            "status": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryOalesByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号查询外销单

**请求参数**:

- **oales.orderId**:
  装修单号

        **示例**:{
                "oales.orderId:": "1601010001"
            }

**返回参数**:

- **oaleses**: 外销单信息列表 , 每条数据类型 *oales*
          - 类型: *List*

        **示例**:{
                ...
                "oaleses": [
                    {
                        "oid": 1,
                        "no": "1601010001",
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
                            }
                            "designer": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            }
                        },

                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "servicer": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "materialer": null,
                        "channer": null,

                        dept: {
                            "did": 1,
                            "no": "D001",
                            "name": "设计一部",
                            "type": "设计部",
                        },
                        "region": {
                            "did": 2,
                            "no": "D002",
                            "name": "设计一分区",
                            "type": "设计大区",
                        },

                        "createTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "finishTime": "2016-01-01 00:00:00",

                        "category": "瓷砖",
                        "brand": "瓷砖",

                        "atttype": 0,
                        "awardType": 0,

                        "total": 100000,
                        "profit": 0,
                        "award": 0,

                        "status": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    ### `amountOales` <span style="color:gray">[内部]</span>

        汇总外销总额

**请求参数**:

- **oales.decoration.orderId**:
  销售单ID

        **示例**:{
                "oales.decoration.orderId": "1601010001"
            }

**返回参数**:

- **amount**: 外销总额
          - 类型: *Long*

        **示例**:{
                ...
                "amount": 1000000,
                ...
            }

    ### `addOales` <span style="color:gray">[内部]</span>

        创建外销单

        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **oales.decoration.orderId**:
  装修单号
        - **oales.bid**:
  品牌ID
        - **oales.total**:
  总价
        - **oales.atttype**:
  业务类型
        - **oales.comment**:
  备注

        **示例**:{
                "oales.decoration.orderId": "1601010001",
                "oales.bid": 1,
                "oales.total": 0,
                "oales.atttype": 0,
                "oales.comment": ""
            }

    ### `updateOales` <span style="color:gray">[内部]</span>

        更新外销单

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**请求参数**:

- **oales.oid**:
  外销单ID
        - **oales.total**:
  总额

        **示例**:{
                "oales.oid": 1,
                "oales.total": 0
            }

    ### `submitOales` <span style="color:gray">[内部]</span>

        提交

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **370022 外销单不可操作**

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `cancelOales` <span style="color:gray">[内部]</span>

        撤销

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断销售单状态是否为1(提交) , 其他状态 , 错误信息 **370022 外销单不可操作**

        更新外销单状态为0(初始)

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `confirmOales` <span style="color:gray">[内部]</span>

        确认

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断外销单状态是否为1(提交)/3(驳回) , 其他状态 , 错误信息 **370022 外销单不可操作**

        判断外销单归属款项是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

        更新外销单状态为2(确认) , 更新外销单确认时间

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `rejectOales` <span style="color:gray">[内部]</span>

        驳回外销单

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**

        更新外销单状态3(驳回)

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `checkOales` <span style="color:gray">[内部]</span>

        复核外销单

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**

        更新外销单状态为4(复核) , 更新外销单复核时间

**请求参数**:

- **oaleses[n].oid**:
  外销单ID

        **示例**:{
                "oaleses[0].oid": 1
            }

    ### `finishOales` <span style="color:gray">[内部]</span>

        完结外销单

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断外销单状态是否为4(复核) , 其他状态 , 错误信息 **370022 外销单不可操作**

        更新外销单状态为5(完结) , 更新外销单完结时间

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `abateOales` <span style="color:gray">[内部]</span>

        废单

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `refundOales` <span style="color:gray">[内部]</span>

        退货

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

        判断外销单状态是否为5(完结) , 其他状态 , 错误信息 **370022 外销单不可操作**

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

    ### `deleteOales` <span style="color:gray">[内部]</span>

        删除

**请求参数**:

- **oales.oid**:
  外销单ID

        **示例**:{
                "oales.oid": 1
            }

### 付款单

## api.sales.OalesPayAction

**数据类型**:

#### oalesPay

    - **opid**: 付款ID
      - 类型: *Long*
    - **oid**: 外销单ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **money**: 金额
      - 类型: *Integer*
    - **type**: 类型 , 0: 现金 , 1: 银行 , 2: 账扣 , 3: 内部
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **payTime**: 付款时间
      - 类型: *Timestamp*
    - **comment**: 备注
      - 类型: *String*

    ### `pageOalesPay` <span style="color:gray">[内部]</span>

        分页方式获取外销单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  外销付款信息列表 , 每条数据类型 *oalesPay*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "opid": 1,
                            "oid": 1,
                            "name": "名称"
                            "money": 10000,
                            "type": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "payTime": "2016-01-01 00:00:00",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryOalesPay` <span style="color:gray">[内部]</span>

        通过外销单ID获取外销付款信息

**请求参数**:

- **oalesPay.oid**:
  外销单ID

        **示例**:{
                "oalesPay.oid:": 1
            }

**返回参数**:

- **oalesPays**: 外销付款信息列表 , 每条数据类型 *oalesPay*
          - 类型: *List*

        **示例**:{
                ...
                "oalesPays": [
                    {
                        "opid": 1,
                        "oid": 1,
                        "name": "名称"
                        "money": 10000,
                        "type": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "payTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }

    ### `addOalesPay` <span style="color:gray">[内部]</span>

        创建外销付款

        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**

**请求参数**:

- **oalesPay.oid**:
  外销单ID
        - **oalesPay.name**:
  名称
        - **oalesPay.money**:
  金额
        - **oalesPay.payTime**:
  付款时间
        - **oalesPay.type**:
  类型
        - **oalesPay.comment**:
  备注

        **示例**:{
                "oalesPay.oid": 1,
                "oalesPay.name": "名称",
                "oalesPay.money": 10000,
                "oalesPay.payTime": "2016-01-01 00:00:00",
                "oalesPay.type": 0,
                "oalesPay.comment": ""
            }

    ### `updateOalesPay` <span style="color:gray">[内部]</span>

        更新外销付款

        判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

**请求参数**:

- **oalesPay.opid**:
  外销付款ID
        - **oalesPay.name**:
  名称
        - **oalesPay.money**:
  金额
        - **oalesPay.payTime**:
  付款时间
        - **oalesPay.type**:
  类型
        - **oalesPay.comment**:
  备注

        **示例**:{
                "oalesPay.opid": 1,
                "oalesPay.name": "名称",
                "oalesPay.money": 10000,
                "oalesPay.payTime": "2016-01-01 00:00:00",
                "oalesPay.type": 0,
                "oalesPay.comment": ""
            }

    ### `deleteOalesPay` <span style="color:gray">[内部]</span>

        删除外销付款

        判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**

**请求参数**:

- **oalesPay.opid**:
  外销付款ID

        **示例**:{
                "oalesPay.opid": 1
            }

## 结算

### 结算单

销售单结算相关功能

## api.sales.SalesBalanceAction

**数据类型**:

#### salesBalance

    - **sbid**: 结算ID
      - 类型: *Long*
    - **sales**: 销售单 , 类型 [sales](./inventory.html#api.material.SalesAction.sales)
      - 类型: *Object*
    - **refunds**: 退货单 , 类型 [refunds](./inventory.html#api.material.SalesRefundAction.salesRefunds)
      - 类型: *Object*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **dept**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **voster**: 厂商结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **venderTime**: 厂商结算时间
      - 类型: *Timestamp*
    - **poster**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **postTime**: 结算时间
      - 类型: *Timestamp*
    - **checker**: 对账人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **checkTime**: 对账时间
      - 类型: *Timestamp*
    - **allowance**: 补贴
      - 类型: *Long*
    - **coupon**: 券值
      - 类型: *Integer*
    - **total**: 总额
      - 类型: *Long*
    - **balance**: 预结算值
      - 类型: *Long*
    - **difference**: 差值 , 既总额 - 结算值
      - 类型: *Long*
    - **vbalance**: 厂商结算
      - 类型: *Long*
    - **pbalance**: 结算值
      - 类型: *Long*
    - **type**: 类型 , 0: 购货 , 1: 预结算退货 , 2: 结算退货 , 3: 定金
      - 类型: *Short*
    - **onetype**: 一类 , 0: 购货 , 1: 退货 , 2: 全退 , 3: 倒单
      - 类型: *Short*
    - **status**: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
      - 类型: *Short*
    - **deliverStatus**: 配送状态 , 0: 未配送 , 1: 部分送达 , 2: 全部送达
      - 类型: *Short*
    - **verifyStatus**: 审核状态 , 0: 未审核 , 1: 部分审核 , 2: 全部审核
      - 类型: *Short*
    - **confirmStatus**: 确认状态 , 0: 未确认 , 1: 部分确认 , 2: 全部确认
      - 类型: *Short*
    - **checkStatus**: 对账状态 , 0: 初始 , 1: 对账 , 2: 已付
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*

    ### `pageSalesBalance` <span style="color:gray">[内部]</span>

        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单公司进行查询

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售结算信息列表 , 每条数据类型 *salesBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesBalanceForDompany` <span style="color:gray">[内部]</span>

        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单第二公司进行查询 , 第二公司为装修单公司

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售结算信息列表 , 每条数据类型 *salesBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesBalanceForPompany` <span style="color:gray">[内部]</span>

        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单第三公司进行查询 , 第三公司为款项公司

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售结算信息列表 , 每条数据类型 *salesBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesBalanceForSupplier` <span style="color:gray">[内部]</span>

        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过销售单厂商以及当前操作人信息查询对应销售单

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售结算信息列表 , 每条数据类型 *salesBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesBalanceForCheck` <span style="color:gray">[内部]</span>

        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        提供对账功能业务 , 通过销售单厂商 , 对账状态为初始以及状态为预结算的销售单

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售结算信息列表 , 每条数据类型 *salesBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `updateSalesBalanceForVBalance` <span style="color:gray">[内部]</span>

        更新销售结算信息中的厂商结算值

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

        更新销售结算信息中厂商结算值

**请求参数**:

- **salesBalance.sbid**:
  结算ID
        - **salesBalance.vbalance**:
  厂商结算值

        **示例**:{
                "salesBalance.sbid": 1,
                "salesBalance.vbalance": 100
            }

    ### `updateSalesBalanceForPBalance` <span style="color:gray">[内部]</span>

        更新销售结算信息中的结算值

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

        判断销售结算信息状态是否为2(厂商结算) , 错误信息 **260038 销售结算状态不可操作**

        更新销售结算信息中结算值

**请求参数**:

- **salesBalance.sbid**:
  结算ID
        - **salesBalance.pbalance**:
  厂商结算值

        **示例**:{
                "salesBalance.sbid": 1,
                "salesBalance.pbalance": 100
            }

    ### `passSalesBalance` <span style="color:gray">[内部]</span>

        批量过渡销售单到完结 , 主要提供跳过主材结算过程

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态是否为0(初始) , 其他状态 **销售单状态不可操作**

        更新销售单结算状态为4(完结)

**请求参数**:

- **sids[n]**:
  销售单ID列表 , 每条数据类型 Long

        **示例**:{
                "sids[0]": 1,
                "sids[1]": 2
            }

    ### `preSalesBalance` <span style="color:gray">[内部]</span>

        批量预结算销售单

        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260022 销售单状态不可操作**

        判断销售单是否存在未处理审批 , 审批状态为0(初始) , 错误信息 **240007 存在未处理审批信息**

        利用销售单对应的销售项中的计算方式和计算值进行计算得出预结算值

        套餐商品中的套餐信息直接进行结算 , 商品信息不参与结算过程

        点位计算公式: 利润 = (折让价 - 折扣价 * (1 - 点位)) * 数量 , 成本 = 折扣价 * (1 - 点位) * 数量

        底价计算方式: 利润 = (折让价 - 底价) * 数量 , 成本 = 底价 * 数量

        补贴 = (折扣价 - 折让价) * 数量

        生成销售单对应的销售结算信息

        更新销售单结算状态为1(预结算)

**请求参数**:

- **sids[n]**:
  销售单ID列表 , 每条数据类型 Long

        **示例**:{
                "sids[0]": 1,
                "sids[1]": 2
            }

    ### `vpostSalesBalance` <span style="color:gray">[内部]</span>

        厂商结算

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        更新销售结算中状态更新为1(厂商结算) , 更新厂商结算时间

        更新销售单结算状态为2(厂商结算)

**请求参数**:

- **sbids[n]**:
  结算ID列表 , 每条数据类型 Long

        **示例**:{
                "sbids[0]": 1
            }

    ### `rpreSalesBalance` <span style="color:gray">[内部]</span>

        反厂商结算

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

        判断销售结算信息状态是否为1(厂商结算) , 错误信息 **260038 销售结算状态不可操作**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        更新销售结算中状态更新为0(预结算)

        判断销售结算类型是否为0(购货) , 更新销售单结算状态为1(预结算)

**请求参数**:

- **sbids[n]**:
  结算ID列表 , 每条数据类型 Long

        **示例**:{
                "sbids[0]": 1
            }

    ### `postSalesBalance` <span style="color:gray">[内部]</span>

        结算

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        更新销售结算中状态更新为2(结算) , 更新结算时间

        更新销售单结算状态为3(结算)

**请求参数**:

- **sbids[n]**:
  结算ID列表 , 每条数据类型 Long

        **示例**:{
                "sbids[0]": 1
            }

### 结算项

## api.sales.SalesBalanceItemAction

**数据类型**:

#### salesBalanceItem

    - **sbiid**: 结算项ID
      - 类型: *Long*
    - **sbid**: 结算ID
      - 类型: *Long*
    - **salesItem**: 销售项 , 类型 [salesItem](./sales.html#api.sales.SalesAction.salesItem)
      - 类型: *Object*
    - **rawCtype**: 原结算方式 , 0: 底价 , 1: 点位
      - 类型: *Short*
    - **rawCvalue**: 原结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
      - 类型: *Integer*
    - **ctype**: 结算方式
      - 类型: *Short*
    - **cvalue**: 结算值
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Integer*

    ### `querySalesBalanceItemBySbid` <span style="color:gray">[内部]</span>

        通过销售结算ID获取销售结算项信息

        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**

**请求参数**:

- **salesBalance.sbid**:
  结算ID

        **示例**:{
                "salesBalance.sbid": 1
            }

**返回参数**:

- **salesBalanceItems**: 销售结算项列表 , 每条数据类型 *salesBalanceItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesBalanceItems": [
                    {
                        "sbiid": 1,
                        "sbid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
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
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        },
                        "rawCtype": 1,
                        "rawCvalue": 0.1,
                        "ctype": 1,
                        "cvalue": 0.1,
                        "num": 10000,
                        "total": 1000
                    }
                ],
                ...
            }

## 活动

销售单活动管理

## api.sales.SalesActivityAction

**数据类型**:

#### salesActivity

    - **sales**: 销售单 , 类型 [sales](./inventory.html#api.material.SalesAction.sales)
      - 类型: *Object*
    - **activity**: 活动 , 类型 [activity](./information.html#api.information.ActivityAction.activity)
      - 类型: *Object*
    - **amount**: 汇总
      - 类型: *Long*

    #### salesActivityItem

    - **saiid**: 活动项ID
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
    - **isStock**: 是否计入库存 , 0: 计入 , 1: 不计入
      - 类型: *Short*
    - **isPayment**: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
      - 类型: *Short*
    - **isAffirm**: 是否确认 , 0: 初始 , 1: 确认 , 2: 核对
      - 类型: *Short*

    - **num**: 数量
      - 类型: *Integer*
    - **money**: 价格
      - 类型: *Integer*
    - **content**: 备注
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*

    ### `pageSalesActivity` <span style="color:gray">[内部]</span>

        通过装修单号 , 分页方式获取销售活动 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  销售活动信息列表 , 每条数据类型 *salesActivity*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "activity": {
                                "aid": 1,
                                "name": "test",
                                "creater": {
                                    "uid": 1,
                                    "userId": "U0479",
                                    "userName": "白雪",
                                    "currentName": "白雪"
                                },
                                "createTime": "2016-01-01 16:04:28",
                                "startTime": "2016-01-01 00:00:00",
                                "endTime": "2016-01-01 23:59:59",
                                "type": 1,
                                "defaults": 0,
                                "multiple": 1,
                                "status": 1,
                                "content": "8"
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### `amountSalesActivity` <span style="color:gray">[内部]</span>

        通过装修单号 , 获取归属销售单参与的活动信息以及款项信息

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId": "1601010001"
            }

**返回参数**:

- **salesActivitys**: 活动信息 , 类型  *salesActivity*
          - 类型: *List*

        **示例**:{
                ...
                "salesActivitys":[
                    {
                        "activity": {
                            "aid": 1,
                            "name": "test",
                        },
                        "amount": 100000,
                    }
                ],
                ...
            }

    ### `amountSalesActivityForActivity` <span style="color:gray">[内部]</span>

        通过装修单号 , 获取归属销售单参与活动的积分总额

**请求参数**:

- **salesActivity.sales.orderId**:
  装修单号

        **示例**:{
                "salesActivity.sales.orderId": "1601010001"
            }

**返回参数**:

- **salesActivity**: 销售活动信息 , 类型  *salesActivity*
          - 类型: *Object*

        **示例**:{
                ...
                "salesActivity":{
                    "amount": 100000,
                },
                ...
            }

    ### `amountSalesActivityForPayment` <span style="color:gray">[内部]</span>

        通过装修单号 , 获取归属销售单所交款项的积分总额

**请求参数**:

- **salesActivity.sales.orderId**:
  装修单号

        **示例**:{
                "salesActivity.sales.orderId": "1601010001"
            }

**返回参数**:

- **salesActivity**: 销售活动信息 , 类型  *salesActivity*
          - 类型: *Object*

        **示例**:{
                ...
                "salesActivity":{
                    "amount": 100000,
                },
                ...
            }

    ### `querySalesActivityItem` <span style="color:gray">[内部]</span>

        通过装修单号 , 查询归属所有销售单参与的活动项信息

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId": "1601010001"
            }

**返回参数**:

- **salesActivityItems**: 活动项信息列表 , 每条数据类型 *SalesActivityItem*
          - 类型: *List*

        **示例**:{
                ...
                "salesActivityItems": [
                    {
                        "saiid": 1,
                        "orderId": "1601010001",
                        "aid": 1,
                        "asid": 1,
                        "activity": "测试",
                        "name": "测试项",

                        "money": 100000,
                        "num": 1,
                        "content": "",

                        "creater": {
                            "uid": 1,
                            "userId": "U0479",
                            "userName": "白雪",
                            "currentName": "白雪"
                        },
                        "operater": {
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

                        "state": 0,
                        "type": 0,
                        "stateType": 0,
                        "content": "",
                        "comment": ""
                    }
                ],
                ...
            }

    ### `addSalesActivityItem` <span style="color:gray">[内部]</span>

        添加销售活动项

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **salesActivity.sales.orderId**:
  装修单号
        - **salesActivity.amount**:
  积分

        - **salesActivityItems[n].aid**:
  活动ID
        - **salesActivityItems[n].asid**:
  奖品ID
        - **salesActivityItems[n].activity**:
  活动名
        - **salesActivityItems[n].name**:
  物品名
        - **salesActivityItems[n].type**:
  类型
        - **salesActivityItems[n].num**:
  数量
        - **salesActivityItems[n].money**:
  金额
        - **salesActivityItems[n].integral**:
  积分
        - **salesActivityItems[n].content**:
  说明

        **示例**:{
                "salesActivity.sales.orderId": "1601010001",
                "salesActivity.amount": 1000000,
                "salesActivityItems[0].aid": 1,
                "salesActivityItems[0].asid": 1,
                "salesActivityItems[0].activity": "活动名",
                "salesActivityItems[0].name": "活动项",
                "salesActivityItems[0].type": 0,
                "salesActivityItems[0].num": 1500,
                "salesActivityItems[0].money": 10000,
                "salesActivityItems[0].integral": 1000000,
                "salesActivityItems[0].content": "说明"
            }

    ### `receiveSalesActivityItem` <span style="color:gray">[内部]</span>

        领取销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**

        判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.content**:
  备注

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }

    ### `abateSalesActivityItem` <span style="color:gray">[内部]</span>

        失效销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**

        销售活动项状态更新为1(失效)

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.content**:
  备注

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }

    ### `deliveSalesActivityItem` <span style="color:gray">[内部]</span>

        配送销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        销售活动项状态更新为4(配送)

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **decorationActivityItem.content**:
  备注

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }

    ### `unrefundSalesActivityItem` <span style="color:gray">[内部]</span>

        未退装修活动 , 已审批未退货

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        销售活动项状态更新为5(未退)

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.comment**:
  说明

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    ### `refundSalesActivityItem` <span style="color:gray">[内部]</span>

        退货销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**

        销售活动项状态更新为3(退货)

        判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.comment**:
  说明

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    ### `expendSalesActivityItem` <span style="color:gray">[内部]</span>

        消耗销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        销售活动项状态更新为7(消耗)

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.comment**:
  说明

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    ### `discountSalesActivityItem` <span style="color:gray">[内部]</span>

        折现销售活动项

        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**

        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**

        销售活动项状态更新为8(折现)

**请求参数**:

- **salesActivityItem.saiid**:
  活动项ID
        - **salesActivityItem.comment**:
  说明

        **示例**:{
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    ### `sendSalesActivityItem` <span style="color:gray">[内部]</span>

        发送销售活动项

**请求参数**:

- **salesActivityItem.orderId**:
  装修单号
        - **salesActivityItem.content**:
  备注

        **示例**:{
                "salesActivityItem.orderId": "1601010001",
                "salesActivityItem.content": ""
            }

    ### `affirmSalesActivityItem` <span style="color:gray">[内部]</span>

        确认销售活动项

        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**

**请求参数**:

- **sales.orderId**:
  装修单号
        - **sales.customer.no**:
  编号

        - **salesActivityItem[n].saiid**:
  活动项ID

        **示例**:{
                "sales.orderId": "1601010001",
                "sales.customer.no": "",
                "salesActivityItem[0].saiid": 1
            }

## 配送

## api.sales.SalesDeliveryAction

**数据类型**:

#### salesDeliveryItem

    - **sdiid**: 配送项ID
      - 类型: *Long*
    - **sales**: 销售单 , 类型 [sales](./inventory.html#api.material.SalesAction.sales)
      - 类型: *Object*
    - **salesItem**: 销售项 , 类型 [salesItem](./sales.html#api.sales.SalesAction.salesItem)
      - 类型: *Object*
    - **status**: 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 完结
      - 类型: *Short*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **protranTime**: 预计配送时间
      - 类型: *Timestamp*
    - **tranTime**: 配送时间
      - 类型: *Timestamp*
    - **checkTime**: 审核时间
      - 类型: *Timestamp*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **finishTime**: 完结时间
      - 类型: *Timestamp*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **traner**: 配送人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **checker**: 审核人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **finisher**: 完结人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*

    ### `pageSalesDeliveryItem` <span style="color:gray">[内部]</span>

        分页方式获取配送项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  配送项信息列表 , 每条数据类型 *salesDeliveryItem*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                "salesman": {
                                    "uid": 1,
                                    "userId": "U001",
                                    "userName": "设计师",
                                    "currentName": "设计师",
                                    "duty": "设计师"
                                },
                                dept: {
                                    "did": 1,
                                    "no": "D001",
                                    "name": "设计一部",
                                    "type": "设计部",
                                },
                                "region": {
                                    "did": 2,
                                    "no": "D002",
                                    "name": "设计一分区",
                                    "type": "设计大区",
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
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
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
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
                            }
                        },
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesDeliveryItemForSupplier` <span style="color:gray">[内部]</span>

        分页方式获取配送项信息 , 利用厂商作为条件 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  配送项信息列表 , 每条数据类型 *salesDeliveryItem*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                "salesman": {
                                    "uid": 1,
                                    "userId": "U001",
                                    "userName": "设计师",
                                    "currentName": "设计师",
                                    "duty": "设计师"
                                },
                                dept: {
                                    "did": 1,
                                    "no": "D001",
                                    "name": "设计一部",
                                    "type": "设计部",
                                },
                                "region": {
                                    "did": 2,
                                    "no": "D002",
                                    "name": "设计一分区",
                                    "type": "设计大区",
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
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
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
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
                            }
                        },
                    ],
                    ...
                },
                ...
            }

    ### `pageSalesDeliveryItemForInstorer` <span style="color:gray">[内部]</span>

        分页方式获取配送项信息 , 利用导购作为条件 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  配送项信息列表 , 每条数据类型 *salesDeliveryItem*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                "salesman": {
                                    "uid": 1,
                                    "userId": "U001",
                                    "userName": "设计师",
                                    "currentName": "设计师",
                                    "duty": "设计师"
                                },
                                dept: {
                                    "did": 1,
                                    "no": "D001",
                                    "name": "设计一部",
                                    "type": "设计部",
                                },
                                "region": {
                                    "did": 2,
                                    "no": "D002",
                                    "name": "设计一分区",
                                    "type": "设计大区",
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
                                },
                                "instorer": {
                                    "uid": 3,
                                    "userId": "U0032",
                                    "userName": "驻店",
                                    "currentName": "驻店",
                                    "duty": "驻店导购"
                                },
                                "guideDept": {
                                    "did": 1,
                                    "no": "D003",
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
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
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
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
                            }
                        },
                    ],
                    ...
                },
                ...
            }

    ### `querySalesDeliveryItem` <span style="color:gray">[内部]</span>

        获取配送项信息

**请求参数**:

- **salesDeliveryItem.sales.sid**:
  销售单ID

        **示例**:{
                "salesDeliveryItem.sales.sid": 1
            }

**返回参数**:

- **salesDeliveryItems**: 配送项信息列表 , 每条数据类型 *salesDeliveryItem*
          - 类型: *List*

        **示例**:{
                ...
                "data": [
                    {
                        "sdiid": 1,
                        "sales": {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "company": 1,
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
                            "salesman": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            dept: {
                                "did": 1,
                                "no": "D001",
                                "name": "设计一部",
                                "type": "设计部",
                            },
                            "region": {
                                "did": 2,
                                "no": "D002",
                                "name": "设计一分区",
                                "type": "设计大区",
                            },
                            "guider": {
                                "uid": 2,
                                "userId": "U0012",
                                "userName": "导购",
                                "currentName": "导购",
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店导购"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "status": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        },
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
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
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "punum": 1,
                            "xgnum": 1,
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        },
                        "num": 10000,
                        "refnum": 0,
                        "status": 0,
                        "comment": "备注",
                        "protranTime": "2016-01-01 00:00:00",
                        "tranTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "creater": {
                            "uid": 11,
                            "userId": "U010",
                            "userName": "创建人",
                            "currentName": "创建人",
                            "duty": "创建人"
                        },
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
                        }
                    },
                ],
                ...
            }

    ### `updateSalesDeliveryItem` <span style="color:gray">[内部]</span>

        更新配送信息

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**请求参数**:

- **salesDeliveryItem.sdiid**:
  配送项ID
        - **salesDeliveryItem.protranTime**:
  预计配送时间
        - **salesDeliveryItem.comment**:
  备注

        **示例**:{
                "salesDeliveryItem.sdiid": 1,
                "salesDeliveryItem.protranTime": "2016-01-01 00:00:00",
                "salesDeliveryItem.comment": "备注"
            }

    ### `deliveSalesDeliveryItem` <span style="color:gray">[内部]</span>

        配送

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**

**请求参数**:

- **salesDeliveryItem.sales.sid**:
  销售单ID

        **示例**:{
                "salesDeliveryItem.sales.sid": 1
            }

    ### `tranSalesDeliveryItem` <span style="color:gray">[内部]</span>

        配送

        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

        判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**请求参数**:

- **salesDeliveryItems[n].sdiid**:
  配送项ID

        **示例**:{
                "salesDeliveryItems[0].sdiid": 1
            }

    ### `checkSalesDeliveryItem` <span style="color:gray">[内部]</span>

        审核

        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

        判断配送项状态为1(配送) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**请求参数**:

- **salesDeliveryItems[n].sdiid**:
  配送项ID

        **示例**:{
                "salesDeliveryItems[n].sdiid": 1
            }

    ### `confirmSalesDeliveryItem` <span style="color:gray">[内部]</span>

        确认

        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

        判断配送项状态为2(审核) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**请求参数**:

- **salesDeliveryItems[n].sdiid**:
  配送项ID

        **示例**:{
                "salesDeliveryItems[n].sdiid": 1
            }

    ### `finishSalesDeliveryItem` <span style="color:gray">[内部]</span>

        完结

        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**

        判断配送项状态为3(确认) , 其他状态 , 错误信息 **260066 配送项状态不可操作**

**请求参数**:

- **salesDeliveryItems[n].sdiid**:
  配送项ID

        **示例**:{
                "salesDeliveryItems[n].sdiid": 1
            }

## 图片

## api.sales.SalesPictureAction

**数据类型**:

#### salesPicture

    - **spid**: 图片ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **siid**: 销售项ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **filesize**: 文件大小
      - 类型: *Integer*
    - **type**: 类型 , 0: 销售 , 1: 配送 , 2: 外销
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 有效 , 1: 删除
      - 类型: *Short*

    ### `querySalesPicture` <span style="color:gray">[内部]</span>

        获取销售图片信息

**请求参数**:

- **salesPicture.sid**:
  销售单ID
        - **salesPicture.siid**:
  销售项ID

        **示例**:{
                "salesPicture.sid": 1,
                "salesPicture.siid": 1,
            }

**返回参数**:

- **salesPictures**: 结算信息列表 , 类型 *salesPicture*
          - 类型: *List*

        **示例**:{
                ...
                "salesPictures": [
                    {
                        "spid": 1,
                        "sid": 1,
                        "siid": 1,
                        "name": "销售图片",
                        "path": "",
                        "filesize": 0,
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01 00:00:00"
                    }
                ],
                ...
            }

    ### `addSalesPicture` <span style="color:gray">[内部]</span>

        添加销售图片

**请求参数**:

- **salesPicture.sid**:
  销售单ID
        - **salesPicture.siid**:
  销售项ID
        - **salesPicture.path**:
  路径

        **示例**:{
                "salesPicture.sid": 1,
                "salesPicture.siid": 1,
                "salesPicture.name": "销售图片",
                "salesPicture.path": "",
                "salesPicture.filesize": 0,
                "salesPicture.type": 1
            }

    ### `deleteSalesPicture` <span style="color:gray">[内部]</span>

        删除销售图片

**请求参数**:

- **salesPicture.spid**:
  图片ID

        **示例**:{
                "salesPicture.spid": 1
            }

## 功能

## api.sales.SalesFunctionAction

**数据类型**:

#### salesFunction

    - **sfid**: 功能ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: key
      - 类型: *String*
    - **value**: value
      - 类型: *String*
    - **group**: 分组 , 0: 公共 , 1: 订单 , 2: 仓储 , 4: 预结算 , 8: 结算 , 16: 对账
      - 类型: *Short*
    - **type**: 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点
      - 类型: *Short*
    - **subtype**: 子类 , 0: 字符串, 1: 数组
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### `querySalesFunction` <span style="color:gray">[内部]</span>

        获取销售功能信息

**请求参数**:

- **salesFunction.type**:
  类型

        **示例**:{
                "salesFunction.type": 0
            }

**返回参数**:

- **salesFunctions**: 结算信息 , 类型 *salesFunction*
          - 类型: *Object*

        **示例**:{
                ...
                "salesFunctions": [
                    {
                        "sfid": 1,
                        "name": "designer",
                        "key": "api",
                        "value": "api.decoration.function",
                        "group": 0,
                        "type": 0,
                        "subtype": 0,
                        "comment": "说明",
                        "sort": 0
                    }
                ],
                ...
            }

    ### `querySalesFunctionByName` <span style="color:gray">[内部]</span>

        通过名称获取销售功能信息

**请求参数**:

- **salesFunction.name**:
  名称

        **示例**:{
                "salesFunction.name": "designer"
            }

**返回参数**:

- **salesFunctions**: 结算信息 , 类型 *salesFunction*
          - 类型: *Object*

        **示例**:{
                ...
                "salesFunctions": [
                    {
                        "sfid": 1,
                        "name": "designer",
                        "key": "api",
                        "value": "api.decoration.function",
                        "group": 0,
                        "type": 0,
                        "subtype": 0,
                        "comment": "说明",
                        "sort": 0
                    }
                ],
                ...
            }
