# salary 薪资
## 通用薪资

## api.salary.SalaryAction

**数据类型**:

#### salary

    - **sid**: 薪资ID
      - 类型: *Long*
    - **user**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **type**: 类型 , 0: 加 , 1: 减
      - 类型: *Short*
    - **onetype**: 一类, 0(基本) , 1(提成) , 2(扣款) , 3(其他)
      - 类型: *Short*
    - **twotype**: 二类, 0(基本) , 1(设计) , 2(业务) , ...
      - 类型: *Short*
    - **thrtype**: 三类, 0(基本) , 1(主材) , 2(销售) , 3(迟到) , 4(早退)
      - 类型: *Short*
    - **money**: 操作金额
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态, 0(初始) , 1(通过) , 2(拒绝) , 3(撤销)
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*

    ### `pageSalary` <span style="color:gray">[内部]</span>

        分页方式获取薪资信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  薪资信息列表 , 每条数据类型 *salary*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "user": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                            },
                            "createTime": "2016-01-01",
                            "type": 0,
                            "onetype": 1,
                            "twotype": 2,
                            "money": 100000,
                            "status": 0,
                            "operater": null,
                            "operateTime": "2016-01-01",
                            "comment":"说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `addSalary` <span style="color:gray">[内部]</span>

        添加薪资

                |Request:|
                - **salary.user.uid**:
  员工ID
        - **salary.type**:
  类型
        - **salary.onetype**:
  一类
        - **salary.twotype**:
  二类
        - **salary.thrtype**:
  三类
        - **salary.money**:
  操作金额
        - **salary.comment**:
  说明

        **示例**:{
                "salary.user.uid": 1,
                "salary.type": 1,
                "salary.money": 500000,
                "salary.twotype": 1,
                "salary.comment": ""
            }

    ### `passSalary` <span style="color:gray">[内部]</span>

        通过薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

                |Request:|
                - **salary.sid**:
  薪资ID

        **示例**:{
                "salary.sid": 1,
            }

    ### `rejectSalary` <span style="color:gray">[内部]</span>

        拒绝薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

                |Request:|
                - **salary.sid**:
  薪资ID

        **示例**:{
                "salary.sid": 1,
            }

    ### `cancelSalary` <span style="color:gray">[内部]</span>

        撤销薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

                |Request:|
                - **salary.sid**:
  薪资ID

        **示例**:{
                "salary.sid": 1,
            }

## 扣款

## api.salary.WithholdAction

**数据类型**:

#### withhold

    - **wid**: 扣款ID
      - 类型: *Long*
    - **user**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **type**: 类型 , 0: 标准 , 1: 装修款
      - 类型: *Short*
    - **orderId**: 装修单号
      - 类型: *String*
    - **ident**: 引用ID
      - 类型: *Long*
    - **money**: 操作金额
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态, 0(初始)
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*

    ### `pageWithhold` <span style="color:gray">[内部]</span>

        分页方式获取扣款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  扣款信息列表 , 每条数据类型 *withhold*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wid": 1,
                            "user": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                            },
                            "orderId": "1601010001",
                            "createTime": "2016-01-01",
                            "type": 0,
                            "money": 100000,
                            "status": 0,
                            "operater": null,
                            "operateTime": "2016-01-01",
                            "comment":"说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryWithhold` <span style="color:gray">[内部]</span>

        获取扣款信息

                |Request:|
                - **withhold.ident**:
  引用ID
        - **withhold.type**:
  类型

        **示例**:{
                "withhold.ident": 1,
                "withhold.type": 1
            }

**返回参数**:

- **withholds**: 扣款信息列表 , 每条数据类型 *withhold*
          - 类型: *List*

        **示例**:{
                ...
                "withholds": [
                    {
                        "wid": 1,
                        "user": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                        },
                        "orderId": "1601010001",
                        "createTime": "2016-01-01",
                        "type": 0,
                        "money": 100000,
                        "status": 0,
                        "operater": null,
                        "operateTime": "2016-01-01",
                        "comment":"说明"
                    }
                ],
                ...
            }

    ### `addWithhold` <span style="color:gray">[内部]</span>

        添加扣款信息

                |Request:|
                - **withhold.orderId**:
  装修单号
        - **withhold.ident**:
  引用ID
        - **withhold.type**:
  类型
        - **withhold.user.uid**:
  人员ID
        - **withhold.money**:
  金额
        - **withhold.comment**:
  说明

        **示例**:{
                "withhold.orderId": "1601010001",
                "withhold.ident": 1,
                "withhold.type": 1,
                "withhold.user.uid": 1,
                "withhold.money": 1000000,
                "withhold.comment": "说明",
            }

    ### `updateWithholdForStatus` <span style="color:gray">[内部]</span>

        更新扣款信息

        判断扣款信息是否存在 , 不存在 , 错误信息 **280013 扣款信息不存在**

                |Request:|
                - **withhold.wid**:
  扣款ID
        - **withhold.status**:
  状态

        **示例**:{
                "withhold.wid": 1,
                "withhold.status": 0
            }

## 装修提成

## api.salary.DecorationSalaryAction

**数据类型**:

#### decorationSalary

    - **dsid**: ID
      - 类型: *Long*

    ### `pageDecorationSalary` <span style="color:gray">[内部]</span>

## 主材提成

## api.salary.MaterialSalaryAction

**数据类型**:

#### materialSalary

    - **dsid**: ID
      - 类型: *Long*

    ### `pageMaterialSalary` <span style="color:gray">[内部]</span>

## 工人帐户

## api.salary.WorkerBalanceAction

**数据类型**:

#### workerBalance

    - **wbid**: 帐户ID
      - 类型: *Long*
    - **user**: 工人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **deposit**: 质保金
      - 类型: *Long*
    - **salary**: 工费
      - 类型: *Long*
    - **toplimit**: 质保金上限
      - 类型: *Long*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

    ### `pageWorkerBalance` <span style="color:gray">[内部]</span>

        分页方式获取工费帐户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工人帐户信息列表 , 每条数据类型 *workerBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wbid": 1,
                            "user": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "deposit": 0,
                            "salary": 0,
                            "toplimit": 1000000
                        }
                    ],
                    ...
                },
                ...
            }

    ### `addWorkerBalance` <span style="color:gray">[内部]</span>

        添加工人帐户信息

        判断工人帐户是否存在 , 已存在 , 错误信息 **280008 工人帐户已存在**

**请求参数**:

- **workerBalance.user.uid**:
  工人ID

        **示例**:{
                "workerBalance.user.uid": 1
            }

    ### `updateWorkerBalance` <span style="color:gray">[内部]</span>

        更新工人帐户信息

**请求参数**:

- **workerBalance.wbid**:
  帐户ID
        - **workerBalance.toplimit**:
  质保金上限

        **示例**:{
                "workerBalance.wbid": 1,
                "workerBalance.toplimit": 1000000
            }

## 工人工费

## api.salary.WorkerSalaryAction

**数据类型**:

#### workerSalary

    - **wsid**: 工费ID
      - 类型: *Long*
    - **cwsid**: 关联工费ID
      - 类型: *关联工费ID*
    - **orderId**: 装修单号
      - 类型: *String*
    - **csid**: 工程ID
      - 类型: *Long*
    - **user**: 工人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **approver**: 审批人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **checker**: 质检人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **approveTime**: 审批时间
      - 类型: *Timestamp*
    - **checkTime**: 质检时间
      - 类型: *Timestamp*
    - **money**: 操作金额
      - 类型: *Long*
    - **deposit**: 操作质保金
      - 类型: *Long*
    - **salary**: 操作工费
      - 类型: *Long*
    - **type**: 类型 , 包括: 0(加), 1(减)
      - 类型: *Short*
    - **onetype**: 一类 , 0(工费), 1(扣/罚), 2(转额), 3(其他)
      - 类型: *Short*
    - **twotype**: 类型 , 包括: 1(工费), 2(增项), 3(油工一级奖励), 4(维修款), 5(罚款), 6(工程质保金), 7(工具押金), 8(借款), 9(工人家属保险)
      - 类型: *Short*
    - **status**: 状态 , 包括: 0(初始) , 1(通过) , 2(驳回) , 3(撤销)
      - 类型: *Short*
    - **isSend**: 消息状态 , 包括: 0(初始) , 1(待发) , 2(已发)
      - 类型: *Short*
    - **isAppr**: 审批状态 , 包括: 0(初始) , 1(待发) , 2(已发)
      - 类型: *Short*
    - **isCheck**: 质检状态 , 包括: 0(初始) , 1(确认)
      - 类型: *Short*
    - **count**: 计数 , 装修单下同一施工节点工费数量 , 状态通过计数
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*

    > **Note**: 加类金额根据当前人员帐户中质保金和工费金额操作 , 根据质保金上限 , 如果未达到质保金上限 , 补充到质保金中 , 超出部分补充到工费中 .

        减类金额根据当前人员帐户中质保金和工费金额操作 , 扣掉工费金额 , 工费金额不足时 , 扣掉质保金金额 , 质保金不足 , 本次操作失败 .

            | 1 工费           | 0 工费                   | 0/1 加/减                        |

        分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工费信息列表 , 每条数据类型 *workerSalary*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wsid": 1,
                            "csid": 1,
                            "orderId": "1601010001",
                            "user": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "creater": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "createTime": "2016-01-01",
                            "approver": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "approveTime": "2016-01-01",
                            "checker": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "checkTime": "2016-01-01",
                            "money": 100000,
                            "deposit": 0,
                            "salary": 100000,
                            "type": 0,
                            "onetype": 0,
                            "twotype": 1,
                            "count": 0,
                            "status": 0,
                            "isSend": 0,
                            "isAppr": 0,
                            "isCheck": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageWorkerSalaryByUserId` <span style="color:gray">[内部]</span>

        分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        通过指定员工编号获取

**请求参数**:

- **workerSalary.user.userId**:
  员工编号

        **示例**:{
                "workerSalary.user.userId": "U0409"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  返工信息列表 , 每条数据类型 *workerSalary*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wsid": 1,
                            "csid": 1,
                            "orderId": "1601010001",
                            "user": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "creater": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "createTime": "2016-01-01",
                            "approver": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "approveTime": "2016-01-01",
                            "checker": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                                ...
                            },
                            "checkTime": "2016-01-01",
                            "money": 100000,
                            "deposit": 0,
                            "salary": 100000,
                            "type": 0,
                            "onetype": 0,
                            "twotype": 1,
                            "count": 0,
                            "status": 0,
                            "isSend": 0,
                            "isAppr": 0,
                            "isCheck": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryWorkerSalary` <span style="color:gray">[内部]</span>

        获取工程对应工人的工费信息

**请求参数**:

- **workerSalary.csid**:
  工程ID
        - **workerSalary.user.userId**:
  员工编号

        **示例**:{
                "workerSalary.csid": 1,
                "workerSalary.user.userId": "U0409",
            }

**返回参数**:

- **workerSalarys**: 工人工费列表 , 每条数据类型 *workerSalary*
          - 类型: *List*

        **示例**:{
                ...
                "workerSalarys": [
                    {
                        "wsid": 1,
                        "csid": 1,
                        "orderId": "1601010001",
                        "user": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                            ...
                        },
                        "creater": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                            ...
                        },
                        "createTime": "2016-01-01",
                        "approver": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                            ...
                        },
                        "approveTime": "2016-01-01",
                        "checker": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                            ...
                        },
                        "checkTime": "2016-01-01",
                        "money": 100000,
                        "deposit": 0,
                        "salary": 100000,
                        "type": 0,
                        "onetype": 0,
                        "twotype": 1,
                        "count": 0,
                        "status": 0,
                        "isSend": 0,
                        "isAppr": 0,
                        "isCheck": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    ### `queryWorkerSalaryByWsid` <span style="color:gray">[内部]</span>

        通过工人工费ID获取工费信息

**请求参数**:

- **workerSalary.wsid**:
  工程ID

        **示例**:{
                "workerSalary.wsid": 1
            }

**返回参数**:

- **workerSalary**: 工人工费 , 类型 *workerSalary*
          - 类型: *Object*

        **示例**:{
                ...
                "workerSalary": {
                    "wsid": 1,
                    "csid": 1,
                    "orderId": "1601010001",
                    "user": {
                        "currentName": "白雪",
                        "userId": "U0479",
                        "userName": "白雪",
                        ...
                    },
                    "creater": {
                        "currentName": "白雪",
                        "userId": "U0479",
                        "userName": "白雪",
                        ...
                    },
                    "createTime": "2016-01-01",
                    "approver": {
                        "currentName": "白雪",
                        "userId": "U0479",
                        "userName": "白雪",
                        ...
                    },
                    "approveTime": "2016-01-01",
                    "checker": {
                        "currentName": "白雪",
                        "userId": "U0479",
                        "userName": "白雪",
                        ...
                    },
                    "checkTime": "2016-01-01",
                    "money": 100000,
                    "deposit": 0,
                    "salary": 100000,
                    "type": 0,
                    "onetype": 0,
                    "twotype": 1,
                    "count": 0,
                    "status": 0,
                    "isSend": 0,
                    "isAppr": 0,
                    "isCheck": 0,
                    "comment": ""
                },
                ...
            }

    ### `collectWorkerDeposit` <span style="color:gray">[内部]</span>

        收取工人质保金

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工费类型限定为: 类型为加类(0) , 一类为其他(3) , 二类为质保金(6)

**请求参数**:

- **workerSalary.user.userId**:
  员工编号
        - **workerSalary.money**:
  操作金额
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }

    ### `drawWorkerDeposit` <span style="color:gray">[内部]</span>

        提现工人质保金

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

        工费类型限定为: 类型为减类(1) , 一类为其他(3) , 二类为质保金(6)

**请求参数**:

- **workerSalary.user.userId**:
  员工编号
        - **workerSalary.money**:
  操作金额
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }

    ### `addWorkerSalary` <span style="color:gray">[内部]</span>

        添加工人工费

        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

        判断工程环节状态为1(开工) , 其他状态 , 错误信息 **120025 工程环节不可操作**

        判断工程环节状态是否为2(完工) , 未完工不可添加 , 错误信息 **120027 工程环节未完工**

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工费类型限定为: 类型为加类(0) , 一类为工费(0) , 二类为工费/增项/油工一级奖励(1/2/3)

        根据工人工费对应账户中质保金和工费更新工费中对应的金额

**请求参数**:

- **workerSalary.user.userId**:
  员工编号
        - **workerSalary.orderId**:
  装修单号
        - **workerSalary.csid**:
  工程ID
        - **workerSalary.money**:
  操作金额
        - **workerSalary.twotype**:
  二类
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 1,
                "workerSalary.comment": ""
            }

    ### `cutWorkerSalary` <span style="color:gray">[内部]</span>

        扣款工人工费

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

        工费类型限定为: 类型为减类(0) , 一类为扣/罚(1) , 二类为罚款(5)

        根据工人工费对应账户中质保金和工费更新工费中对应的金额

**请求参数**:

- **workerSalary.user.userId**:
  员工编号
        - **workerSalary.orderId**:
  装修单号
        - **workerSalary.csid**:
  工程ID
        - **workerSalary.money**:
  操作金额
        - **workerSalary.twotype**:
  二类
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 5,
                "workerSalary.comment": ""
            }

    ### `tranWorkerSalary` <span style="color:gray">[内部]</span>

        转款工人工费

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

        工费类型限定为: 一类为转款(2) , 二类为维修金(4)

        根据工人工费对应账户中质保金和工费更新工费中对应的金额

        根据工人工费信息生成两条工费数据 , 同时进行关联操作

**请求参数**:

- **sourceId**: 员工编号
          - 类型: *String*
        - **targetId**: 员工编号
          - 类型: *String*

        - **workerSalary.orderId**:
  装修单号
        - **workerSalary.csid**:
  工程ID
        - **workerSalary.money**:
  操作金额
        - **workerSalary.twotype**:
  二类
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 1,
                "workerSalary.comment": ""
            }

    ### `payWorkerSalary` <span style="color:gray">[内部]</span>

        发放工人工费

        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

        工人帐户中工费金额不足 , 错误信息 **280006 工费金额不足**

        工费类型限定为: 类型为减类(1) , 一类为工费(0) , 二类为维修金(1)

**请求参数**:

- **workerSalary.user.userId**:
  员工编号
        - **workerSalary.money**:
  操作金额
        - **workerSalary.comment**:
  备注

        **示例**:{
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }

    ### `adoptWorkerSalary` <span style="color:gray">[内部]</span>

        通过工人工费

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断工费状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 工费状态不可操作**

        如果通过的工人工费存在关联工费信息 , 需要一同处理

**请求参数**:

- **workerSalarys[n].wsid**:
  工费ID

        **示例**:{
                "workerSalarys[n].wsid": 1
            }

    ### `rejectWorkerSalary` <span style="color:gray">[内部]</span>

        驳回

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断工费状态是否为1(通过) , 非初始不能驳回 , 错误信息 **280002 工费状态不可操作**

        如果驳回的工人工费存在关联工费信息 , 需要一同处理 , 关联还原质保金

**请求参数**:

- **workerSalary.wsid**:
  工费ID

        **示例**:{
                "workerSalary.wsid": 1
            }

    ### `checkWsorkerSalary` <span style="color:gray">[内部]</span>

        质检

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断质检状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**请求参数**:

- **workerSalary.wsid**:
  工费ID

        **示例**:{
                "workerSalary.wsid": 1
            }

    ### `deleteWorkerSalary` <span style="color:gray">[内部]</span>

        删除工人工费信息

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断工费状态是否为0(初始) , 非初始不能删除 , 错误信息 **280002 工费状态不可操作**

        操作工费状态置3(撤销)

        如果通过的工人工费存在关联工费信息 , 需要一同处理

**请求参数**:

- **workerSalary.wsid**:
  工费ID

        **示例**:{
                "workerSalary.wsid": 1
            }

    ### `batchWorkerSalary` <span style="color:gray">[内部]</span>

        批量发送工费

        利用开始和结束时间作为范围 , 状态为1(通过) , 消息状态为0(初始)

**请求参数**:

- **workerSalary.createTime**:
  开始时间
        - **workerSalary.endTime**:
  结束时间

        **示例**:{
                "workerSalary.createTime": "2016-01-01 00:00:00",
                "workerSalary.endTime": "2016-01-01 23: 59:59"
            }

    ### `sendWorkerSalary` <span style="color:gray">[内部]</span>

        发送工费

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断工费状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**请求参数**:

- **workerSalary.wsid**:
  工费Id

        **示例**:{
                "workerSalary.wsid": 1
            }

    ### `cancelWorkerSalary` <span style="color:gray">[内部]</span>

        取消发送工费

        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

        判断工费状态是否为1(待发) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**请求参数**:

- **workerSalary.wsid**:
  工费Id

        **示例**:{
                "workerSalary.wsid": 1
            }

## 设计师薪资

## api.salary.DesignerSalaryAction

**数据类型**:

#### designerSalary

    - **dsid**: ID
      - 类型: *Long*

    ### `pageDesignerSalary` <span style="color:gray">[内部]</span>

    ### `addDesignerSalary` <span style="color:gray">[内部]</span>

    ### `updateDesignerSalary` <span style="color:gray">[内部]</span>

    ### `adoptDesignerSalary` <span style="color:gray">[内部]</span>

    ### `rejectDesignerSalary` <span style="color:gray">[内部]</span>

    ### `deleteDesignerSalary` <span style="color:gray">[内部]</span>

## 图片

图片信息管理 , 提供如楼盘图片等资源

## api.salary.SalaryDrawingAction

**数据类型**:

#### salaryDrawing

    - **sdid**: 图片ID
      - 类型: *Long*
    - **sid**: 关联ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **drawingUrl**: 图片路径
      - 类型: *String*
    - **drawingType**: 图片类型 , 0: 本地 , 1: 钉钉
      - 类型: *Short*
    - **type**: 类型 , 0: 工费
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*

    ### `querySalaryDrawing` <span style="color:gray">[内部]</span>

        通过关联ID以及类型获取图片信息

**请求参数**:

- **salaryDrawing.sid**:
  关联ID
        - **salaryDrawing.type**:
  类型

        **示例**:{
                "salaryDrawing.sid": 1,
                "salaryDrawing.type": 0
            }

**返回参数**:

- **salaryDrawings**: 图片信息列表 , 每条数据类型 *salaryDrawing*
          - 类型: *List*

        **示例**:{
                ...
                "salaryDrawings": [
                    {
                        "sdid": 1,
                        "sid": 1,
                        "name": "SDFK4DFS4D5",
                        "drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                        "drawingType": 0,
                        "type": 0,
                        "creater": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01"
                    }
                ],
                ...
            }

    ### `addSalaryDrawing` <span style="color:blue">[自定义]</span>

        添加图片信息

**请求参数**:

- **salaryDrawing.sid**:
  关联ID
        - **salaryDrawing.name**:
  名称
        - **salaryDrawing.drawingUrl**:
  路径
        - **salaryDrawing.drawingType**:
  图片类型
        - **salaryDrawing.type**:
  类型

        **示例**:{
                "salaryDrawing.sid": 1,
                "salaryDrawing.name": "name.jpg",
                "salaryDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "salaryDrawing.drawingType": 0,
                "salaryDrawing.type": 0
            }

    ### `deleteSalaryDrawing` <span style="color:blue">[自定义]</span>

        删除图片信息

**请求参数**:

- **salaryDrawing.sdid**:
  图片ID

        **示例**:{
                "salaryDrawing.sdid": 1
            }
