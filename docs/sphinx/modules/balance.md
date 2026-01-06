# balance {#balance}

# 结算
## 帐户

## api.balance.BalanceAccountAction

        |DataType:|
        #### balanceAccount

    - **baid**: 帐户ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **referMoney**: 应付额
      - 类型: *Long*
    - **realMoney**: 实付额
      - 类型: *Long*
    - **money**: 操作额
      - 类型: *Long*
    - **surplus**: 余额
      - 类型: *Long*
    - **type**: 类型 , 0: 结算 , 1: 出纳
      - 类型: *Short*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageBalanceAccount

        分页方式获取帐户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 帐户信息列表 , 每条数据类型 *balanceAccount*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "name": "帐户",
                            "belonger": {
                                "uid": 1,
                                "userId": "U021",
                                "userName": "归属人",
                                "currentName": "归属人"
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U022",
                                "userName": "创建人",
                                "currentName": "创建人"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "referMoney": 10000,
                            "realMoney": 10000,
                            "surplus": 10000,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryBalanceAccount

        通过归属人ID获取帐户信息 , 帐户类型为结算
        
                |Requests:|
                :param balanceAccount.belonger.uid: 归属人ID
        :type balanceAccount.belonger.uid: Long
        
        Example::
        
            {
                "balanceAccount.belonger.uid": 1
            }
            
                |Returns:|
                - **balanceAccounts**: 帐户列表 , 每条数据类型 *balanceAccount*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceAccounts": [
                    {
                        "baid": 1,
                        "name": "帐户",
                        "belonger": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U022",
                            "userName": "创建人",
                            "currentName": "创建人"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "referMoney": 10000,
                        "realMoney": 10000,
                        "surplus": 10000,
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <I> queryBalanceAccountForTeller

        通过公司ID获取帐户信息 , 类型为出纳
        
                |Returns:|
                - **balanceAccounts**: 帐户列表 , 每条数据类型 *balanceAccount*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceAccounts": [
                    {
                        "aid": 1,
                        "name": "帐户",
                        "belonger": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U022",
                            "userName": "创建人",
                            "currentName": "创建人"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "referMoney": 10000,
                        "realMoney": 10000,
                        "surplus": 10000,
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <I> addBalanceAccount

        添加帐户
        
                |Requests:|
                :param balanceAccount.name: 名称
        :type balanceAccount.name: String
        :param balanceAccount.belonger.uid: 归属人ID
        :type balanceAccount.belonger.uid: Long
        
        Example::
        
            {
                "balanceAccount.name": "帐户",
                "balanceAccount.belonger.uid": 1
            }
            
    ### <I> updateBalanceAccountForStatus

        更新帐户状态
        
        判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**
        
                |Requests:|
                :param balanceAccount.aid: 帐户ID
        :type balanceAccount.aid: Long
        
        Example::
        
            {
                "balanceAccount.aid": 1
            }
            
    ### <I> withdrawBalanceAccount

        提款
        
        判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**
        
        判断帐户余额是否满足操作额度 , 不满足 , 错误信息 **350003 帐户金额不足**
        
        根据 帐户余额 = 应付额 - 实付额 公式 , 对应更新实付额以及余额
        
        生成类型为2(提)的结算单
        
                |Requests:|
                :param balanceAccount.aid: 帐户ID
        :type balanceAccount.aid: Long
        :param balanceAccount.money: 操作额
        :type balanceAccount.money: Long
        
        Example::
        
            {
                "balanceAccount.aid": 1,
                "balanceAccount.money": 10000
            }

## 扣款

## api.balance.BalanceDccountAction

        |DataType:|
        #### balanceDccount

    - **bdid**: 扣款ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 扣款 , 1: 返款
      - 类型: *Short*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 操作时间
      - 类型: *Timestamp*
    - **startTime**: 开始时间
      - 类型: *Timestamp*
    - **endTime**: 结束时间
      - 类型: *Timestamp*
    - **cutpay**: 总额
      - 类型: *Long*
    - **surplus**: 余额
      - 类型: *Long*
    - **status**: 状态 , 0: 有效 , 1: 失效
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageBalanceDccount

        分页方式获取扣款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 扣款信息列表 , 每条数据类型 *balanceDccount*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bdid": 1,
                            "name": "扣款名称",
                            "type": 0,
                            "belonger": {
                                "uid": 1,
                                "userId": "U021",
                                "userName": "归属人",
                                "currentName": "归属人"
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U022",
                                "userName": "创建人",
                                "currentName": "创建人"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "startTime": "2016-01-01",
                            "endTime": "2016-01-01",
                            "cutpay": 1000,
                            "surplus": 1000,
                            "status": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryBalanceDccount

        获取扣款信息
        
                |Requests:|
                :param balanceDccount.belonger.uid: 归属人ID
        :type balanceDccount.belonger.uid: Long
        
        Example::
        
            {
                "balanceDccount.belonger.uid": 1
            }
        
        - **balanceDccounts**: 扣款信息列表 , 每条数据类型 *balanceDccount*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceDccounts": [
                    {
                        "bdid": 1,
                        "name": "扣款名称",
                        "type": 0,
                        "belonger": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U022",
                            "userName": "创建人",
                            "currentName": "创建人"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "startTime": "2016-01-01",
                        "endTime": "2016-01-01",
                        "cutpay": 1000,
                        "surplus": 1000,
                        "status": 0,
                        "comment": ""
                    }
                ],
                ...
            }
    
    ### <I> addBalanceDccount

        创建扣款信息
        
                |Requests:|
                :param balanceDccount.name: 名称
        :type balanceDccount.name: String
        :param balanceDccount.belonger.uid: 归属人ID
        :type balanceDccount.belonger.uid: Long
        :param balanceDccount.startTime: 开始时间
        :type balanceDccount.startTime: Timestamp
        :param balanceDccount.endTime: 结束时间
        :type balanceDccount.endTime: Timetamp
        :param balanceDccount.cutpay: 扣款
        :type balanceDccount.cutpay: Long
        :param balanceDccount.comment: 说明
        :type balanceDccount.comment: String
        
        Example::
        
            {
                "balanceDccount.name": "name",
                "balanceDccount.belonger.uid": 1,
                "balanceDccount.startTime": "2016-01-01",
                "balanceDccount.endTime": "2016-01-01",
                "balanceDccount.cutpay": 100000,
                "balanceDccount.comment": "说明"
            }
    
    ### <I> updateBalanceDccount

        更新扣款信息
        
                |Requests:|
                :param balanceDccount.bdid: 扣款ID
        :type balanceDccount.bdid: String
        :param balanceDccount.name: 名称
        :type balanceDccount.name: String
        :param balanceDccount.startTime: 开始时间
        :type balanceDccount.startTime: Timestamp
        :param balanceDccount.endTime: 结束时间
        :type balanceDccount.endTime: Timetamp
        :param balanceDccount.cutpay: 扣款
        :type balanceDccount.cutpay: Long
        :param balanceDccount.comment: 说明
        :type balanceDccount.comment: String
        
        Example::
        
            {
                "balanceDccount.bdid": 1,
                "balanceDccount.name": "name",
                "balanceDccount.startTime": "2016-01-01",
                "balanceDccount.endTime": "2016-01-01",
                "balanceDccount.cutpay": 100000,
                "balanceDccount.comment": "说明"
            }
    
    ### <I> updateBalanceDccountForStatus

        更新扣款信息状态
        
                |Requests:|
                :param balanceDccount.bdid: 扣款ID
        :type balanceDccount.bdid: String
        :param balanceDccount.status: 状态
        :type balanceDccount.status: Short
        
        Example::
        
            {
                "balanceDccount.bdid": 1,
                "balanceDccount.status": 0
            }

## 结算单

## api.balance.BalanceAction

        |DataType:|
        #### balance

    - **bid**: 结算单ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **startTime**: 开始时间
      - 类型: *Timestamp*
    - **endTime**: 结束时间
      - 类型: *Timestamp*
    - **amount**: 金额
      - 类型: *Long*
    - **surplus**: 余额
      - 类型: *Long*
    - **cutpay**: 扣款
      - 类型: *Long*
    - **type**: 类型 , 0: 支 , 1: 收 , 2: 提
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 已付 , 2: 完结
      - 类型: *Short*
    - **ispay**: 付款标识 , 0: 未付 , 1: 已付
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageBalance

        分页方式获取结算单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算单信息列表 , 每条数据类型 *balance*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bid": 1,
                            "no": "1601010001",
                            "belonger": {
                                "uid": 1,
                                "userId": "U021",
                                "userName": "归属人",
                                "currentName": "归属人"
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U022",
                                "userName": "创建人",
                                "currentName": "创建人"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "startTime": "2016-01-01",
                            "endTime": "2016-01-01",
                            "amount": 1000,
                            "surplus": 1000,
                            "type": 0,
                            "status": 0,
                            ispay: 0
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalance

        获取结算单信息
        
                |Requests:|
                :param balance.belonger.uid: 归属人ID
        :type balance.belonger.uid: Long
        :param balance.status: 状态
        :type balance.status: Short
        
        Example::
        
            {
                "balance.belonger.uid": 1,
                "balance.status": 0
            }
        
        - **balances**: 结算单信息列表 , 每条数据类型 *balance*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balances": [
                    {
                        "bid": 1,
                        "no": "1601010001",
                        "belonger": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U022",
                            "userName": "创建人",
                            "currentName": "创建人"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "startTime": "2016-01-01",
                        "endTime": "2016-01-01",
                        "amount": 1000,
                        "surplus": 1000,
                        "type": 0,
                        "status": 0,
                        ispay: 0
                    }
                ],
                ...
            }

    ### <I> addBalance

        添加结算单
        
                |Requests:|
                :param balance.belonger.uid: 归属人ID
        :type balance.belonger.uid: Long
        :param balance.startTime: 开始时间
        :type balance.startTime: Timestamp
        :param balance.endTime: 结束时间
        :type balance.endTime: Timestamp
        :param balance.amount: 金额
        :type balance.amount: Long
        
        Example::
        
            {
                "balance.belonger.uid": 1,
                "balance.startTime": "2016-01-01",
                "balance.endTime": "2016-01-01",
                "balance.amount": 1000
            }
            
    ### <I> balanceBalance

        结算
        
        判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**
        
        判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**
        
        判断帐户和结算单是否为统一归属人 , 存在不一致 , 错误信息 **350007 结算归属不一致**
        
        判断帐户余额是否满足操作额度 , 不满足 , 错误信息 **350003 帐户金额不足**
        
        结算过程 , 操作帐户类型为0(结算)
        
        结算过程中 , 结算单类型与帐户应付款/实付款/余额之间的关系
        
        收类型结算单对应的操作额 , 增加帐户中的应付款额度
        
        支类型结算单对应的操作额 , 增加帐户中的实付款额度
        
        帐户中余额 = 应付款 - 实付款
        
                |Requests:|
                :param balance.bid: 结算单ID
        :type balance.bid: Long
        
        :param account[n].aid: 帐户ID
        :type account[n].aid: Long
        :param account[n].money: 操作额
        :type account[n].money: Long
        
        Example::
        
            {
                "balance.belonger.uid": 1,
                "balance.amount": 1000
            }
            
    ### <I> payBalance

        出纳
        
        判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**
        
        判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**
        
        结算过程 , 操作帐户类型为1(出纳)
        
        出纳过程 , 不更新帐户中的应付额/实付额/余额 , 记录操作过程金额 , 生成结算明细
        
                |Requests:|
                :param balance.bid: 结算单ID
        :type balance.bid: Long
        
        :param account[n].aid: 帐户ID
        :type account[n].aid: Long
        :param account[n].money: 金额
        :type account[n].money: Long
        
        Example::
        
            {
                "balance.bid": 1,
                "balance.amount": 1000
                
                "account[0].aid": 1,
                "account[0].money": 1000,
            }

    ### <I> payedBalance

        付款
        
        判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**
        
                |Requests:|
                :param balances[n].bid: 结算单ID
        :type balances[n].bid: Long
        
        Example::
        
            {
                "balances[0].bid": 1,
            }
    
## 结算明细

## api.balance.BalanceDetailAction

        |DataType:|
        #### balanceDetail

    - **bdid**: 结算明细ID
      - 类型: *Long*
    - **account**: 帐户 , 类型 [account](./account.html#api.balance.AccountAction.account)
      - 类型: *Object*
    - **balance**: 结算单 , 类型 [balance](./balance.html#api.balance.BalanceAction.balance)
      - 类型: *Object*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **money**: 金额
      - 类型: *Long*
    
    ### <I> queryBalanceDetailForBalance

        根据结算单ID获取结算明细
        
                |Requests:|
                :param balanceDetail.balance.bid: 结算单ID
        :type balanceDetail.balance.bid: Long
        
        Example::
        
            {
                "balanceDetail.balance.bid": 1
            }
    
                |Returns:|
                - **balanceDetails**: 帐户明细列表 , 每条数据类型 *balanceDetail*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceDetails": [
                    {
                        "bdid": 1,
                        "account": {
                            "aid": 1,
                            "name": "帐户",
                            "belonger": {
                                "uid": 1,
                                "userId": "U021",
                                "userName": "归属人",
                                "currentName": "归属人"
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U022",
                                "userName": "创建人",
                                "currentName": "创建人"
                            }
                        },
                        "operater": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "operateTime": "2016-01-01 00:00:00",
                        "money": 10000
                    }
                ],
                ...
            }

## 结算扣款

## api.balance.BalanceCutpayAction

        |DataType:|
        #### balanceCutpay

    - **bcid**: 扣款ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **balance**: 结算单 , 类型 [balance](./balance.html#api.balance.BalanceAction.balance)
      - 类型: *Object*
    - **cutpay**: 关联扣款 , 类型 [balanceCutpay](./balance.html#api.balance.BalanceCutpayAction.balanceCutpay)
      - 类型: *Object*
    - **dccount**: 关联扣款 , 类型 [balanceDccount](./balance.html#api.balance.BalanceDccountAction.balanceDccount)
      - 类型: *Object*
    - **type**: 类型 , 0: 扣款 , 1: 返款
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **money**: 金额
      - 类型: *Integer*
    - **cutpay**: 总额
      - 类型: *Long*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageBalanceCutpay

        分页方式获取结算扣款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param balanceCutpay.balance.bid: 结算单ID
        :type balanceCutpay.balance.bid: Long
        :param balanceCutpay.dccount.bdid: 结算扣款
        :type balanceCutpay.dccount.bdid: Long
        
        Example::
        
            {
                "balanceCutpay.balance.bid": 1,
                "balanceCutpay.dccount.bdid": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 结算扣款信息列表 , 每条数据类型 *balanceCutpay*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bcid": 1,
                            "balance": {
                                "bid": 1,
                                "no": "1601010001",
                                ...
                            },
                            "cutpay": null,
                            "dccount": null,
                            "type": 0,
                            "operater": {
                                "uid": 1,
                                "userId": "U021",
                                "userName": "归属人",
                                "currentName": "归属人"
                            },
                            "operateTime": "2016-01-01 00:00:00",
                            "money": 10000,
                            "cutpay": 10000,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryBalanceCutpay

        通过结算单主键查询扣款信息
        
                |Requests:|
                :param balanceCutpay.balance.bid: 结算单ID
        :type balanceCutpay.balance.bid: Long
        :param balanceCutpay.dccount.bdid: 结算扣款
        :type balanceCutpay.dccount.bdid: Long
        
        Example::
        
            {
                "balanceCutpay.balance.bid": 1,
                "balanceCutpay.dccount.bdid": 1
            }

                |Returns:|
                - **balanceCutpays**: 结算扣款列表 , 每条数据类型 *balanceCutpay*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceCutpays": [
                    {
                        "bcid": 1,
                        "balance": {
                            "bid": 1,
                            "no": "1601010001",
                            ...
                        },
                        "cutpay": null,
                        "dccount": null,
                        "type": 0,
                        "operater": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "operateTime": "2016-01-01 00:00:00",
                        "money": 10000,
                        "cutpay": 10000,
                        "comment": "说明"
                    }
                ],
                ...
            }

    ### <I> addBalanceCutpay

        添加扣款信息
        
                |Requests:|
                :param balanceCutpay.balance.bid: 结算单ID
        :type balanceCutpay.balance.bid: Long
        :param blanaceCutpay.dccount.bdid: 关联扣款ID
        :type balanceCutpay.dccount.bdid: Long
        :param balanceCutpay.type: 类型
        :type balanceCutpay.type: Short
        :param balanceCutpay.money: 金额
        :type balanceCutpay.money: Integer
        :param balanceCutpay.comment: 说明
        :type balanceCutpay.comment: String
        
        Example::
        
            {
                "balanceCutpay.balance.bid": 1,
                "balanceCutpay.dccount.bdid": 1,
                "balanceCutpay.type": 0,
                "balanceCutpay.money": 10000,
                "balanceCutpay.comment": "说明"
            }

    ### <I> deductBalanceCutpay

        抵扣
        
                |Requests:|
                :param balanceCutpay.balance.bid: 结算单ID
        :type balanceCutpay.balance.bid: Long
        :param balanceCutpay.cutpay.bcid: 关联扣款ID
        :type balanceCutpay.cutpay.bcid: Long
        :param balanceCutpay.money: 金额
        :type balanceCutpay.money: Integer
        :param balanceCutpay.comment: 说明
        :type balanceCutpay.comment: String
        
        Example::
        
            {
                "balanceCutpay.balance.bid": 1,
                "balanceCutpay.cutpay.bcid": 1,
                "balanceCutpay.type": 0,
                "balanceCutpay.money": 10000,
                "balanceCutpay.comment": "说明"
            }

## 分摊明细

## api.balance.ApportDetailAction

        |DataType:|
        #### apportDetail

    - **adid**: 分摊明细ID
      - 类型: *Long*
    - **bid**: 结算单ID
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **money**: 金额
      - 类型: *Long*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> queryApportDetailForBalance

        通过结算单ID获取分摊明细
        
                |Requests:|
                :param apportDetail.bid: 结算单ID
        :type apportDetail.bid: Long
        
        Example::
        
            {
                "apportDetail.bid": 1
            }
    
                |Returns:|
                - **apportDetails**: 分摊明细列表 , 每条数据类型 *apportDetail*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "apportDetails": [
                    {
                        "bdid": 1,
                        "creater": {
                            "uid": 1,
                            "userId": "U021",
                            "userName": "归属人",
                            "currentName": "归属人"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "money": 10000,
                        "comment": "说明"
                    }
                ],
                ...
            }
    
    ### <I> addApportDetail

        添加分摊明细
        
        判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**
        
                |Requests:|
                :param apportDetail.bid: 结算单ID
        :type apportDetail.bid: Long
        :param apportDetail.money: 分摊额
        :type apportDetail.money: Long
        :param apportDetail.comment: 说明
        :type apportDetail.comment: String
        
        Example::
        
            {
                "apportDetail.bid": 1,
                "apportDetail.money": 10000,
                "apportDetail.comment": "说明",
            }
            
## 结算销售

### 结算

## api.balance.BalanceSalesAction

        |DataType:|
        #### balanceSales

    - **bsid**: 结算销售ID
      - 类型: *Long*
    - **bid**: 结算单ID
      - 类型: *Long*
    - **balance**: 结算单 , 类型 [balance](./sales.html#api.sales.BalanceAction.balance)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.data.BrandAction.brand)
      - 类型: *Object*
    - **grade**: 等级
      - 类型: *String*
    - **income**: 收入
      - 类型: *Long*
    - **cost**: 成本
      - 类型: *Long*
    - **payment**: 应付
      - 类型: *Long*
    - **profit**: 利润
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balancer**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **lockTime**: 锁定时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageBalanceSales

        分页方式获取结算销售信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算销售信息列表 , 每条数据类型 *balanceSales*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsid": 1,
                            "bid": 1,
                            "name": "结算销售",
                            "brand": {
                                "bid": 1,
                                "no": "B001",
                                "name": "品牌",
                                "pinyin": "pinpai",
                                "category": {
                                    "cid": 1,
                                    "no": "C001",
                                    "name": "地板"
                                },
                                "supplier": {
                                    "uid": 1000,
                                    "userId": "OC001",
                                    "currentName": "厂商",
                                    "userName": "厂商"
                                },
                            },
                            "grade": "A",
                            "income": 0,
                            "cost": 0,
                            "payment": 0,
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> pageBalanceSalesForBalance

        分页方式获取结算销售信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算销售信息列表 , 每条数据类型 *balanceSales*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsid": 1,
                            "bid": 1,
                            "balance": {
                                "bid": 1,
                                "no": "1601010001",
                                "belonger": {
                                    "uid": 1,
                                    "userId": "U021",
                                    "userName": "归属人",
                                    "currentName": "归属人"
                                },
                                "creater": {
                                    "uid": 1,
                                    "userId": "U022",
                                    "userName": "创建人",
                                    "currentName": "创建人"
                                },
                                "createTime": "2016-01-01 00:00:00",
                                "startTime": "2016-01-01",
                                "endTime": "2016-01-01",
                                "amount": 1000,
                                "surplus": 1000,
                                "type": 0,
                                "status": 0
                            },
                            "name": "结算销售",
                            "brand": {
                                "bid": 1,
                                "no": "B001",
                                "name": "品牌",
                                "pinyin": "pinpai",
                                "category": {
                                    "cid": 1,
                                    "no": "C001",
                                    "name": "地板"
                                },
                                "supplier": {
                                    "uid": 1000,
                                    "userId": "OC001",
                                    "currentName": "厂商",
                                    "userName": "厂商"
                                },
                            },
                            "grade": "A",
                            "income": 0,
                            "cost": 0,
                            "payment": 0,
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceSales

        查询结算销售 , 状态为0(初始)
        
                |Requests:|
                :param balanceSales.name: 名称
        :type balanceSales.name: String
        
        Example::
        
            {
                "balanceSales.name:": "结算销售"
            }
        
                |Returns:|
                - **balanceSaleses**: 结算销售信息列表 , 每条数据类型 *balanceSales*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceSaleses": [
                    {
                        "bsid": 1,
                        "bid": 1,
                        "name": "结算销售",
                        "brand": {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                            "pinyin": "pinpai",
                            "category": {
                                "cid": 1,
                                "no": "C001",
                                "name": "地板"
                            },
                            "supplier": {
                                "uid": 1000,
                                "userId": "OC001",
                                "currentName": "厂商",
                                "userName": "厂商"
                            },
                        },
                        "grade": "A",
                        "income": 0,
                        "cost": 0,
                        "payment": 0,
                        "profit": 0,
                        "creater": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "balancer": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "lockTime": "2016-01-01",
                        "balanceTime": "2016-01-01"
                    }
                ],
                ...
            }
            
    ### <I> queryBalanceSalesByBsid

        通过结算单ID查询结算销售
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid:": 1
            }
        
                |Returns:|
                - **balanceSales**: 结算销售信息 , 类型 *balanceSales*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "balanceSales": {
                    "bsid": 1,
                    "bid": 1,
                    "name": "结算销售",
                    "brand": {
                        "bid": 1,
                        "no": "B001",
                        "name": "品牌",
                        "pinyin": "pinpai",
                        "category": {
                            "cid": 1,
                            "no": "C001",
                            "name": "地板"
                        },
                        "supplier": {
                            "uid": 1000,
                            "userId": "OC001",
                            "currentName": "厂商",
                            "userName": "厂商"
                        },
                    },
                    "grade": "A",
                    "income": 0,
                    "cost": 0,
                    "payment": 0,
                    "profit": 0,
                    "creater": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "balancer": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "lockTime": "2016-01-01",
                    "balanceTime": "2016-01-01"
                }
                ...
            }
            
    ### <I> queryBalanceSalesByBid

        通过结算单ID查询结算销售
        
                |Requests:|
                :param balanceSales.bid: 结算单ID
        :type balanceSales.bid: Long
        
        Example::
        
            {
                "balanceSales.bid:": 1
            }
        
                |Returns:|
                - **balanceSales**: 结算销售信息 , 类型 *balanceSales*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "balanceSales": {
                    "bsid": 1,
                    "bid": 1,
                    "name": "结算销售",
                    "brand": {
                        "bid": 1,
                        "no": "B001",
                        "name": "品牌",
                        "pinyin": "pinpai",
                        "category": {
                            "cid": 1,
                            "no": "C001",
                            "name": "地板"
                        },
                        "supplier": {
                            "uid": 1000,
                            "userId": "OC001",
                            "currentName": "厂商",
                            "userName": "厂商"
                        },
                    },
                    "grade": "A",
                    "income": 0,
                    "cost": 0,
                    "payment": 0,
                    "profit": 0,
                    "creater": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "balancer": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "lockTime": "2016-01-01",
                    "balanceTime": "2016-01-01"
                }
                ...
            }

    ### <I> amountBalanceSales

        汇总结算销售
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1
            }

    ### <I> createBalanceSales

        创建结算销售
        
                |Requests:|
                :param balanceSales.name: 名称
        :type balanceSales.name: String
        :param balanceSales.brand.bid: 品牌ID
        :type balanceSales.brand.bid: Long
        :param balanceSales.grade: 等级
        :type balanceSales.grade: String
        
        Example::
        
            {
                "balanceSales.name": "结算销售",
                "balanceSales.brand.bid": 1,
                "balanceSales.grade": "A"
            }
            
    ### <I> updateBalanceSales

        更新结算销售
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        :param balanceSales.name: 名称
        :type balanceSales.name: String
        
        Example::
        
            {
                "balanceSales.bsid": 1,
                "balanceSales.name": "结算销售"
            }

    ### <I> submitBalanceSales

        提交结算销售
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**
    
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        :param balanceSales.income: 收入
        :type balanceSales.income: Long
        :param balanceSales.cost: 成本
        :type balanceSales.cost: Long
        :param balanceSales.payment: 应付
        :type balanceSales.payment: Long
        :param balanceSales.profit: 利润
        :type balanceSales.profit: Long
        
        :param balanceSalesBalances[n].salesBalance.sbid: 销售结算ID
        :type balanceSalesBalances[n].salesBalance.sbid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1,
                "balanceSales.income": 0,
                "balanceSales.cost": 0,
                "balanceSales.payment": 0,
                "balanceSales.profit": 0,
                
                "balanceSalesBalances[0].salesBalance.sbid": 1,
                "balanceSalesBalances[1].salesBalance.sbid": 2
            }

    ### <I> lockBalanceSales

        锁定结算销售
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**
        
        结算销售状态更新为1(锁定) , 更新锁定时间
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1
            }

    ### <I> unlockBalanceSales

        锁定结算销售
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为1(锁定) , 其他状态 , 错误信息 **350018 结算销售不可操作**
        
        结算销售状态更新为0(初始)
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1
            }

    ### <I> balanceBalanceSales

        结算
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为1(锁定) , 其他状态 , 错误信息 **350018 结算销售不可操作**
        
        结算销售状态更新为2(结算) , 更新结算人和结算时间
        
        生成对应结算单
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1
            }

    ### <I> deleteBalanceSales

        删除
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**
        
        判断结算销售明细 , 存在明细数据 , 错误信息 **350021 销售明细存在**
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1
            }

### 明细

## api.balance.BalanceSalesAction

        |DataType:|
        #### balanceSalesBalance

    - **bsbid**: 销售结算ID
      - 类型: *Long*
    - **bsid**: 结算销售ID
      - 类型: *Long*
    - **salesBalance**: 销售结算 , 类型 [salesBalance](./sales.html#api.sales.SalesBalanceAction.salesBalance)
      - 类型: *Object*

    ### <I> pageBalanceSalesBalance

        分页方式获取结算销售明细信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        
        Example::
        
            {
                "balanceSales.bsid:": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算销售明细信息列表 , 每条数据类型 *balanceSalesBalance*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsbid": 1,
                            "bsid": 1,
                            "salesBalance": {
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
                                "total": 100.8,
                                "balance": 10000,
                                "difference": 90.8,
                                "vbalance": 0,
                                "pbalance": 0,
                                "type": 0,
                                "onetype": 0,
                                "status": 0,
                                "comment": "说明"
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceSalesBalance

        通过结算销售ID获取销售结算明细信息
        
                |Requests:|
                :param balanceSalesBalance.bsid: 结算销售ID
        :type balanceSalesBalance.bsid: Long
        
        Example::
        
            {
                "balanceSalesBalance.bsid": 1
            }
        
                |Returns:|
                - **balanceSalesBalances**: 结算销售信息列表 , 类型 *balanceSalesBalance*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceSalesBalances": [
                    {
                        "bsbid": 1,
                        "bsid": 1,
                        "salesBalance": {
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
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "comment": "说明"
                        }
                    }
                ],
                ...
            }

    ### <I> countBalanceSalesBalance

        统计结算销售
        
                |Requests:|
                :param balanceSalesBalance.bsid: 结算销售ID
        :type balanceSalesBalance.bsid: Long
        
        Example::
        
            {
                "balanceSalesBalance.bsid": 1
            }
            
                |Returns:|
                - **count**: 统计结果
          - 类型: *Long*
        
        Example::
        
            {
                ...
                "count": 0,
                ...
            }
            
    ### <I> unbindBalanceSales

        解绑结算销售
        
        判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**
        
        判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**
    
                |Requests:|
                :param balanceSales.bsid: 结算销售ID
        :type balanceSales.bsid: Long
        :param balanceSales.income: 收入
        :type balanceSales.income: Long
        :param balanceSales.cost: 成本
        :type balanceSales.cost: Long
        :param balanceSales.payment: 应付
        :type balanceSales.payment: Long
        :param balanceSales.profit: 利润
        :type balanceSales.profit: Long
        
        :param balanceSalesBalances[n].bsbid: 销售结算ID
        :type balanceSalesBalances[n].bsbid: Long
        
        Example::
        
            {
                "balanceSales.bsid": 1,
                "balanceSales.income": 0,
                "balanceSales.cost": 0,
                "balanceSales.payment": 0,
                "balanceSales.profit": 0,
                
                "balanceSalesBalances[0].bsbid": 1,
                "balanceSalesBalances[1].bsbid": 2
            }

## 结算外销

### 结算

## api.balance.BalanceOalesAction

        |DataType:|
        #### balanceOales

    - **boid**: 结算外销ID
      - 类型: *Long*
    - **bid**: 结算单ID
      - 类型: *Long*
    - **balance**: 结算单 , 类型 [balance](./sales.html#api.sales.BalanceAction.balance)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **grade**: 等级
      - 类型: *String*
    - **profit**: 利润
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balancer**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **lockTime**: 锁定时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageBalanceOales

        分页方式获取结算外销信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算外销信息列表 , 每条数据类型 *balanceOales*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "boid": 1,
                            "bid": 1,
                            "name": "结算外销",
                            "grade": "A",
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> pageBalanceOalesForBalance

        分页方式获取结算外销信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算外销信息列表 , 每条数据类型 *balanceOales*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "boid": 1,
                            "bid": 1,
                            "balance": {
                                "bid": 1,
                                "no": "1601010001",
                                "belonger": {
                                    "uid": 1,
                                    "userId": "U021",
                                    "userName": "归属人",
                                    "currentName": "归属人"
                                },
                                "creater": {
                                    "uid": 1,
                                    "userId": "U022",
                                    "userName": "创建人",
                                    "currentName": "创建人"
                                },
                                "createTime": "2016-01-01 00:00:00",
                                "startTime": "2016-01-01",
                                "endTime": "2016-01-01",
                                "amount": 1000,
                                "surplus": 1000,
                                "type": 0,
                                "status": 0
                            },
                            "name": "结算外销",
                            "grade": "A",
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceOales

        查询结算外销 , 状态为0(初始)
        
                |Requests:|
                :param balanceOales.name: 名称
        :type balanceOales.name: String
        
        Example::
        
            {
                "balanceOales.name:": "结算外销"
            }
        
                |Returns:|
                - **balanceOaleses**: 结算外销信息列表 , 每条数据类型 *balanceOales*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceOaleses": [
                    {
                        "boid": 1,
                        "bid": 1,
                        "name": "结算外销",
                        "grade": "A",
                        "profit": 0,
                        "creater": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "balancer": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "lockTime": "2016-01-01",
                        "balanceTime": "2016-01-01"
                    }
                ],
                ...
            }
            
    ### <I> queryBalanceOalesByBoid

        通过结算外销ID查询
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid:": 1
            }
        
                |Returns:|
                - **balanceOales**: 结算外销信息 , 类型 *balanceOales*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "balanceOales": {
                    "boid": 1,
                    "bid": 1,
                    "name": "结算外销",
                    "grade": "A",
                    "profit": 0,
                    "creater": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "balancer": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "lockTime": "2016-01-01",
                    "balanceTime": "2016-01-01"
                }
                ...
            }
            
    ### <I> queryBalanceOalesByBid

        通过结算单ID查询结算外销
        
                |Requests:|
                :param balanceOales.bid: 结算单ID
        :type balanceOales.bid: Long
        
        Example::
        
            {
                "balanceOales.bid:": 1
            }
        
                |Returns:|
                - **balanceOales**: 结算外销信息 , 类型 *balanceOales*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "balanceOales": {
                    "boid": 1,
                    "bid": 1,
                    "name": "结算外销",
                    "grade": "A",
                    "profit": 0,
                    "creater": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "balancer": {
                        "uid": 1,
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "lockTime": "2016-01-01",
                    "balanceTime": "2016-01-01"
                }
                ...
            }

    ### <I> amountBalanceOales

        汇总结算外销
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1
            }

    ### <I> createBalanceOales

        创建结算外销
        
                |Requests:|
                :param balanceOales.name: 名称
        :type balanceOales.name: String
        :param balanceOales.grade: 等级
        :type balanceOales.grade: String
        
        Example::
        
            {
                "balanceOales.name": "结算外销",
                "balanceOales.brand.bid": 1,
                "balanceOales.grade": "A"
            }
            
    ### <I> updateBalanceOales

        更新结算外销
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        :param balanceOales.name: 名称
        :type balanceOales.name: String
        
        Example::
        
            {
                "balanceOales.boid": 1,
                "balanceOales.name": "结算外销"
            }

    ### <I> submitBalanceOales

        提交结算外销
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**
    
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        :param balanceOales.profit: 利润
        :type balanceSales.profit: Long
        
        :param balanceOalesBalances[n].oales.oid: 外销单ID
        :type balanceOalesBalances[n].oales.oid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1,
                "balanceOales.profit": 0,
                
                "balanceOalesBalances[0].oales.oid": 1,
                "balanceOalesBalances[1].oales.oid": 2
            }

    ### <I> lockBalanceOales

        锁定结算外销
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**
        
        结算外销状态更新为1(锁定) , 更新锁定时间
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1
            }

    ### <I> unlockBalanceOales

        锁定结算外销
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为1(锁定) , 其他状态 , 错误信息 **350024 结算外销不可操作**
        
        结算外销状态更新为0(初始)
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1
            }

    ### <I> balanceBalanceOales

        结算
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为1(锁定) , 其他状态 , 错误信息 **350024 结算外销不可操作**
        
        结算外销状态更新为2(结算) , 更新结算人和结算时间
        
        生成对应结算单
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1
            }

    ### <I> deleteBalanceOales

        删除
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**
        
        判断结算外销明细 , 存在明细数据 , 错误信息 **350025 销售明细存在**
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1
            }

### 明细

## api.balance.BalanceOalesBalanceAction

        |DataType:|
        #### balanceOalesBalance

    - **bobid**: 结算明细ID
      - 类型: *Long*
    - **boid**: 结算外销ID
      - 类型: *Long*
    - **oales**: 外销单 , 类型 [oales](./sales.html#api.sales.OalesAction.oales)
      - 类型: *Object*

    ### <I> pageBalanceOalesBalance

        分页方式获取结算外销明细信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        
        Example::
        
            {
                "balanceOales.boid:": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算外销明细信息列表 , 每条数据类型 *balanceOalesBalance*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bobid": 1,
                            "boid": 1,
                            "oales": {
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
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceOalesBalance

        通过结算外销ID获取外销单明细信息
        
                |Requests:|
                :param balanceOalesBalance.boid: 结算外销ID
        :type balanceOalesBalance.boid: Long
        
        Example::
        
            {
                "balanceOalesBalance.boid": 1
            }
        
                |Returns:|
                - **balanceOalesBalances**: 结算外销信息列表 , 类型 *balanceOalesBalance*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceOalesBalances": [
                    {
                        "bobid": 1,
                        "boid": 1,
                        "oales": {
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
                    }
                ],
                ...
            }

    ### <I> countBalanceOalesBalance

        统计结算外销
        
                |Requests:|
                :param balanceOalesBalance.boid: 结算外销ID
        :type balanceOalesBalance.boid: Long
        
        Example::
        
            {
                "balanceOalesBalance.boid": 1
            }
            
                |Returns:|
                - **count**: 统计结果
          - 类型: *Long*
        
        Example::
        
            {
                ...
                "count": 0,
                ...
            }
            
    ### <I> unbindBalanceOales

        解绑结算外销
        
        判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**
        
        判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**
    
                |Requests:|
                :param balanceOales.boid: 结算外销ID
        :type balanceOales.boid: Long
        :param balanceOales.profit: 利润
        :type balanceOales.profit: Long
        
        :param balanceOalesBalances[n].bobid: 销售结算ID
        :type balanceOalesBalances[n].bobid: Long
        
        Example::
        
            {
                "balanceOales.boid": 1,
                "balanceOales.income": 0,
                "balanceOales.cost": 0,
                "balanceOales.payment": 0,
                "balanceOales.profit": 0,
                
                "balanceOalesBalances[0].bobid": 1,
                "balanceOalesBalances[1].bobid": 2
            }

## 结算选材

### 结算

## api.balance.BalanceSelectionAction

        |DataType:|
        #### balanceSelection

    - **bsid**: 结算选材ID
      - 类型: *Long*
    - **bid**: 结算单ID
      - 类型: *Long*
    - **balance**: 结算单 , 类型 [balance](./sales.html#api.sales.BalanceAction.balance)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.data.BrandAction.brand)
      - 类型: *Object*
    - **grade**: 等级
      - 类型: *String*
    - **income**: 收入
      - 类型: *Long*
    - **cost**: 成本
      - 类型: *Long*
    - **payment**: 应付
      - 类型: *Long*
    - **profit**: 利润
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balancer**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **lockTime**: 锁定时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **company**: 公司
      - 类型: *Integer*

    ### <I> pageBalanceSelection

        分页方式获取结算选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算选材信息列表 , 每条数据类型 *balanceSelection*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsid": 1,
                            "bid": 1,
                            "name": "结算选材",
                            "brand": {
                                "bid": 1,
                                "no": "B001",
                                "name": "品牌",
                                "pinyin": "pinpai",
                                "category": {
                                    "cid": 1,
                                    "no": "C001",
                                    "name": "地板"
                                },
                                "supplier": {
                                    "uid": 1000,
                                    "userId": "OC001",
                                    "currentName": "厂商",
                                    "userName": "厂商"
                                },
                            },
                            "grade": "A",
                            "income": 0,
                            "cost": 0,
                            "payment": 0,
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> pageBalanceSelectionForBalance

        分页方式获取结算选材信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算选材信息列表 , 每条数据类型 *balanceSelection*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsid": 1,
                            "bid": 1,
                            "name": "结算选材",
                            "brand": {
                                "bid": 1,
                                "no": "B001",
                                "name": "品牌",
                                "pinyin": "pinpai",
                                "category": {
                                    "cid": 1,
                                    "no": "C001",
                                    "name": "地板"
                                },
                                "supplier": {
                                    "uid": 1000,
                                    "userId": "OC001",
                                    "currentName": "厂商",
                                    "userName": "厂商"
                                },
                            },
                            "grade": "A",
                            "income": 0,
                            "cost": 0,
                            "payment": 0,
                            "profit": 0,
                            "creater": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "balancer": {
                                "uid": 1,
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "lockTime": "2016-01-01",
                            "balanceTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> pageBalanceSelectionItem

        分页方式获取结算选材项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid:": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算选材项信息列表 , 每条数据类型 *balanceSelectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsiid": 1,
                            "bsid": 1,
                            "selectionItem": {
                                "siid": 1,
                                "orderId": "1601010001",
                                "sid": 1,
                                "areaId": 1,
                                "quoteId": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个",
                                    "purchase": 100000,
                                    "selling": 10000,
                                    "pieceNum": 1,
                                    "type": 0,
                                    "checkup": 0,
                                    "company": 0
                                },
                                "areaName": "功能区",
                                "preprice": 0,
                                "postprice": 0,
                                "initnum": 10000,
                                "num": 10000,
                                "refnum": 0,
                                "status": 0,
                                "comment": "备注"
                                "tranTime": "2016-01-01 00:00:00",
                                "checkTime": "2016-01-01 00:00:00",
                                "confirmTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
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
                                },
                                "balancer": {
                                    "uid": 15,
                                    "userId": "U015",
                                    "userName": "结算人",
                                    "currentName": "结算人",
                                    "duty": "结算人"
                                }
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceSelection

        查询结算选材 , 状态为0(初始)
        
                |Requests:|
                :param balanceSelection.name: 名称
        :type balanceSelection.name: String
        
        Example::
        
            {
                "balanceSelection.name:": "结算选材"
            }
        
                |Returns:|
                - **balanceSelections**: 结算选材信息列表 , 每条数据类型 *balanceSelection*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceSelections": [
                    {
                        "bsid": 1,
                        "bid": 1,
                        "name": "结算选材",
                        "brand": {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                            "pinyin": "pinpai",
                            "category": {
                                "cid": 1,
                                "no": "C001",
                                "name": "地板"
                            },
                            "supplier": {
                                "uid": 1000,
                                "userId": "OC001",
                                "currentName": "厂商",
                                "userName": "厂商"
                            },
                        },
                        "grade": "A",
                        "income": 0,
                        "cost": 0,
                        "payment": 0,
                        "profit": 0,
                        "creater": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "balancer": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "lockTime": "2016-01-01",
                        "balanceTime": "2016-01-01"
                    }
                ],
                ...
            }

    ### <I> queryBalanceSelectionByBsid

        查询结算选材
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid:": 1
            }
        
                |Returns:|
                - **balanceSelections**: 结算选材信息列表 , 每条数据类型 *balanceSelection*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceSelections": [
                    {
                        "bsid": 1,
                        "bid": 1,
                        "name": "结算选材",
                        "brand": {
                            "bid": 1,
                            "no": "B001",
                            "name": "品牌",
                            "pinyin": "pinpai",
                            "category": {
                                "cid": 1,
                                "no": "C001",
                                "name": "地板"
                            },
                            "supplier": {
                                "uid": 1000,
                                "userId": "OC001",
                                "currentName": "厂商",
                                "userName": "厂商"
                            },
                        },
                        "grade": "A",
                        "income": 0,
                        "cost": 0,
                        "payment": 0,
                        "profit": 0,
                        "creater": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "balancer": {
                            "uid": 1,
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "lockTime": "2016-01-01",
                        "balanceTime": "2016-01-01"
                    }
                ],
                ...
            }

    ### <I> amountBalanceSelection

        汇总结算选材
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1
            }

    ### <I> createBalanceSelection

        创建结算选材
        
                |Requests:|
                :param balanceSelection.name: 名称
        :type balanceSelection.name: String
        :param balanceSelection.brand.bid: 品牌ID
        :type balanceSelection.brand.bid: Long
        :param balanceSelection.grade: 等级
        :type balanceSelection.grade: String
        
        Example::
        
            {
                "balanceSelection.name": "结算选材",
                "balanceSelection.brand.bid": 1,
                "balanceSelection.grade": "A"
            }

    ### <I> updateBalanceSelection

        更新结算选材
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        :param balanceSelection.name: 名称
        :type balanceSelection.name: String
        
        Example::
        
            {
                "balanceSelection.bsid": 1,
                "balanceSelection.name": "结算选材"
            }

    ### <I> submitBalanceSelection

        提交结算选材
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**
    
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        :param balanceSelection.income: 收入
        :type balanceSelection.income: Long
        :param balanceSelection.cost: 成本
        :type balanceSelection.cost: Long
        :param balanceSelection.payment: 应付
        :type balanceSelection.payment: Long
        :param balanceSelection.profit: 利润
        :type balanceSelection.profit: Long
        
        :param balanceSelectionItems[n].selectionItem.siid: 选材项ID
        :type balanceSelectionItems[n].selectionItem.siid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1,
                "balanceSelection.income": 0,
                "balanceSelection.cost": 0,
                "balanceSelection.payment": 0,
                "balanceSelection.profit": 0,
                
                "balanceSelectionItems[0].selectionItem.siid": 1,
                "balanceSelectionItems[1].selectionItem.siid": 2
            }

    ### <I> lockBalanceSelection

        锁定结算选材
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**
        
        结算选材状态更新为1(锁定) , 更新锁定时间
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1
            }

    ### <I> unlockBalanceSelection

        锁定结算选材
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为1(锁定) , 其他状态 , 错误信息 **350028 结算选材不可操作**
        
        结算选材状态更新为0(初始)
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1
            }

    ### <I> balanceBalanceSelection

        结算
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为1(锁定) , 其他状态 , 错误信息 **350028 结算选材不可操作**
        
        结算选材更新为2(结算) , 更新结算人和结算时间
        
        生成对应结算单
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1
            }

    ### <I> deleteBalanceSelection

        删除
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**
        
        判断结算选材明细存在 , 存在明细数据 , 错误信息 **350029 结算选材明细存在**
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1
            }

### 明细

## api.balance.BalanceSelectionAction

        |DataType:|
        #### balanceSelectionItem

    - **bsiid**: 结算选材ID
      - 类型: *Long*
    - **bsid**: 结算选材ID
      - 类型: *Long*
    - **selectionItem**: 选材项 , 类型 [selectionItem](./quotation.html#api.quotation.SelectionItemAction.selectionItem)
      - 类型: *Object*

    ### <I> pageBalanceSelectionItem

        分页方式获取结算选材项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        
        Example::
        
            {
                "balanceSelection.bsid:": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 结算选材项信息列表 , 每条数据类型 *balanceSelectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bsiid": 1,
                            "bsid": 1,
                            "selectionItem": {
                                "siid": 1,
                                "orderId": "1601010001",
                                "sid": 1,
                                "areaId": 1,
                                "quoteId": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个",
                                    "purchase": 100000,
                                    "selling": 10000,
                                    "pieceNum": 1,
                                    "type": 0,
                                    "checkup": 0,
                                    "company": 0
                                },
                                "areaName": "功能区",
                                "preprice": 0,
                                "postprice": 0,
                                "initnum": 10000,
                                "num": 10000,
                                "refnum": 0,
                                "status": 0,
                                "comment": "备注"
                                "tranTime": "2016-01-01 00:00:00",
                                "checkTime": "2016-01-01 00:00:00",
                                "confirmTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
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
                                },
                                "balancer": {
                                    "uid": 15,
                                    "userId": "U015",
                                    "userName": "结算人",
                                    "currentName": "结算人",
                                    "duty": "结算人"
                                }
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBalanceSelectionItem

        获取结算选材项
        
                |Requests:|
                :param balanceSelectionItem.bsid: 结算选材ID
        :type balanceSelectionItem.bsid: String
        
        Example::
        
            {
                "balanceSelectionItem.bsid:": 1
            }

                |Returns:|
                - **balanceSelectionItems**: 结算选材项信息列表 , 每条数据类型 *balanceSelectionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "balanceSelectionItems": [
                    {
                        "bsiid": 1,
                        "bsid": 1,
                        "selectionItem": {
                            "siid": 1,
                            "orderId": "1601010001",
                            "sid": 1,
                            "areaId": 1,
                            "quoteId": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "checkup": 0,
                                "company": 0
                            },
                            "areaName": "功能区",
                            "preprice": 0,
                            "postprice": 0,
                            "initnum": 10000,
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注"
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
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
                            },
                            "balancer": {
                                "uid": 15,
                                "userId": "U015",
                                "userName": "结算人",
                                "currentName": "结算人",
                                "duty": "结算人"
                            }
                        }
                    }
                ],
                ...
            }

    ### <I> countBalanceSelectionItem

        统计结算选材项数量
        
                |Requests:|
                :param balanceSelectionItem.bsid: 结算选材ID
        :type balanceSelectionItem.bsid: String
        
        Example::
        
            {
                "balanceSelectionItem.bsid:": 1
            }

                |Returns:|
                - **count**: 结算选材项数量
          - 类型: *Integer*
        
        Example::
        
            {
                ...
                "count": 100
                ...
            }
            
    ### <I> unbindBalanceSelection

        解绑结算选材
        
        判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**
        
        判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**
    
                |Requests:|
                :param balanceSelection.bsid: 结算选材ID
        :type balanceSelection.bsid: Long
        :param balanceSelection.income: 收入
        :type balanceSelection.income: Long
        :param balanceSelection.cost: 成本
        :type balanceSelection.cost: Long
        :param balanceSelection.payment: 应付
        :type balanceSelection.payment: Long
        :param balanceSelection.profit: 利润
        :type balanceSelection.profit: Long
        
        :param balanceSelectionItems[n].bsiid: 销售选材项ID
        :type balanceSelectionItems[n].bsiid: Long
        
        Example::
        
            {
                "balanceSelection.bsid": 1,
                "balanceSelection.income": 0,
                "balanceSelection.cost": 0,
                "balanceSelection.payment": 0,
                "balanceSelection.profit": 0,
                
                "balanceSelectionItems[0].bsiid": 1,
                "balanceSelectionItems[1].bsiid": 2
            }

## 成本

## api.balance.ComcostAction

        |DataType:|
        #### comcost

    - **cid**: 成本ID
      - 类型: *Long*
    - **type**: 类型 , 0: 标准
      - 类型: *Short*
    - **orderId**: 装修单号
      - 类型: *String*
    - **ident**: 引用ID
      - 类型: *Long*
    - **money**: 操作金额
      - 类型: *Long*
    - **creater**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态, 0(初始)
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageComcost

        分页方式获取成本信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 扣款信息列表 , 每条数据类型 *comcost*
        :type paging.data: List

        Example::

            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "type": 0,
                            "money": 100000,
                            "orderId": "1601010001",
                            "creater": {
                                "currentName": "白雪",
                                "userId": "U0479",
                                "userName": "白雪",
                            },
                            "createTime": "2016-01-01",
                            "status": 0,
                            "comment":"说明",
                            "company": 0
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryComcost

        获取成本信息
        
                |Request:|
                :param comcost.ident: 引用ID
        :type comcost.ident: Long
        :param comcost.type: 类型
        :type comcost.type: Short

        Example::

            {
                "comcost.ident": 1,
                "comcost.type": 1
            }
        
                |Returns:|
                - **comcosts**: 成本信息列表 , 每条数据类型 *comcost*
          - 类型: *List*

        Example::

            {
                ...
                "comcosts": [
                    {
                        "cid": 1,
                        "type": 0,
                        "money": 100000,
                        "orderId": "1601010001",
                        "creater": {
                            "currentName": "白雪",
                            "userId": "U0479",
                            "userName": "白雪",
                        },
                        "createTime": "2016-01-01",
                        "status": 0,
                        "comment":"说明",
                        "company": 0
                    }
                ],
                ...
            }

    ### <I> addComcost

        添加成本信息
        
                |Request:|
                :param comcost.orderId: 装修单号
        :type comcost.orderId: String
        :param comcost.ident: 引用ID
        :type comcost.ident: Long
        :param comcost.type: 类型
        :type comcost.type: Short
        :param comcost.money: 金额
        :type comcost.money: Long
        :param comcost.comment: 说明
        :type comcost.comment: String
        :param comcost.company: 公司ID
        :type comcost.company: Integer

        Example::

            {
                "comcost.orderId": "1601010001",
                "comcost.ident": 1,
                "comcost.type": 1,
                "comcost.money": 1000000,
                "comcost.comment": "说明",
                "comcost.company": 1
            }
            
    ### <I> updateComcostForStatus

        更新成本状态
        
        判断成本信息是否存在 , 不存在 , 错误信息 **350011 成本不存在**
        
                |Request:|
                :param comcost.cid: 成本ID
        :type comcost.cid: Long
        :param comcost.status: 状态
        :type comcost.status: Short

        Example::

            {
                "comcost.cid": 1,
                "comcost.status": 0
            }
