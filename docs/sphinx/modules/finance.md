# finance 财务
财务模块 , 根据收款以及相关数据进行财务相关业务的信息处理 .

其中科目作为基础数据进行记录以及统计 , 根据账本(期间)进行阶段财务数据的处理工作 , 生成相应的凭证信息 .

凭证信息作为整体数据 , 包括相关时间 , 操作人员信息 .

凭证信息包括两个部分数据 , 一是账目信息 , 二是辅助核算项目 . 账目信息关联科目信息 , 辅助核算项目关联其他信息 , 如订单 , 楼盘 .

## 摘要

摘要信息管理 , 提供账目摘要信息选择数据

## api.finance.AbstractsAction

**数据类型**:

#### abstracts

    - **aid**: 摘要ID
      - 类型: *Integer*
    - **ownerId**: 归属人ID
      - 类型: *Integer*
    - **abstracts**: 摘要信息
      - 类型: *String*

    ### <F> queryAbstracts

        获取操作用户拥有的摘要信息

**返回参数**:

- **abstractes**: 摘要信息列表 , 每条数据类型 *abstracts*
          - 类型: *List*

        **示例**:{
                ...
                "abstractes": [
                    {
                        "aid": 1,
                        "ownerId": 34,
                        "abstracts": "摘要"
                    }
                ],
                ...
            }

    ### <F> addAbstracts

        添加摘要信息

**请求参数**:

- **abstracts.abstracts**:
  摘要信息

        **示例**:{
                "abstracts.abstracts": "摘要"
            }

    ### <F> deleteAbstracts

        删除摘要信息

**请求参数**:

- **abstracts.aid**:
  摘要ID

        **示例**:{
                "abstracts.aid": 1
            }

## 期间

期间信息管理 , 作为关联账本数据信息基础 ,

期间信息格式 yyyyDD

## api.finance.PeriodAction

**数据类型**:

#### period

    - **pid**: 期间ID
      - 类型: *Long*
    - **period**: 期间
      - 类型: *String*
    - **status**: 状态 , 0: 初始 , 1: 关闭
      - 类型: *String*

    ### <F> queryPeriod

        获取所有期间信息

**返回参数**:

- **periods**: 期间信息列表 , 每条数据类型 *period*
          - 类型: *List*

        **示例**:{
                ...
                "periods": [
                    {
                        "pid": 1,
                        "period": "201601",
                        "status": 0
                    },
                ],
                ...
            }

    ### <F> queryPeriodForCurrent

        获取当前最新期间信息

**返回参数**:

- **period**: 期间信息 , 类型 *period*
          - 类型: *Object*

        **示例**:{
                ...
                "period": {
                    "pid": 1,
                    "period": "201601",
                    "status": 0
                ],
                ...
            }

    ### <F> queryPeriodForOpen

        获取处于初始(开启)状态的期间信息 , 提供创建凭证时选择的期间信息

**返回参数**:

- **periods**: 期间信息列表 , 每条数据类型 *period*
          - 类型: *List*

        **示例**:{
                ...
                "periods": [
                    {
                        "pid": 1,
                        "period": "201601",
                        "status": 0
                    },
                ],
                ...
            }

## 账本

账本既期间

依托期间信息 , 根据账本相关操作完成账本(期间)的相关操作

最后一个账本(期间)处于开帐状态 , 同时不能进行关帐动作

## api.finance.BookAction

    ### <F> checkoutBook

        结账 , 完成两个动作 , 一是产生新的期间信息 , 既新账本 ; 二是科目余额产生对应期间数据


    ### <F> openBook

        开帐 , 操作的账本的下一个账本必须处于开帐状态 , 否则不能开帐

**请求参数**:

- **period**: 期间
          - 类型: *String*

        **示例**:{
                "period": "201601"
            }

    ### <F> closeBook

        关帐 , 操作的账本的上一个账本必须处于关帐状态 , 否则不能关帐

**请求参数**:

- **period**: 期间
          - 类型: *String*

        **示例**:{
                "period": "201601"
            }

## 科目

科目信息管理

## api.finance.SubjectAction

**数据类型**:

#### subject

    - **sid**: 科目ID
      - 类型: *Long*
    - **level**: 等级 , 1: 一级 , 2: 二级 , 3: 三级
      - 类型: *Short*
    - **oneCode**: 一级编号 , 四位数字组成
      - 类型: *String*
    - **twoCode**: 二级编号 , 三位数字组成
      - 类型: *String*
    - **thrCode**: 三级编号 , 三位数字组成
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **code**: 编号 , 由一级 , 二级和三级编号组成 , 共十位数字组成
      - 类型: *String*
    - **direction**: 余额方向 , 0: 借 , 1: 贷
      - 类型: *Short , 0: *
    - **assistant**: 辅助核算项目编号列表 , 格式: oi-oa-dsr
      - 类型: *String*

    ### <F> pageSubject

        分页方式获取科目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  大区信息列表 , 每条数据类型 *region*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "name": "现金",
                            "code": "1010000000",
                            "oneCode": "1010",
                            "thrCode": "000",
                            "twoCode": "000",
                            "direction": 1,
                            "level": 1,
                            "status": 0,
                            "assistant": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <F> querySubject

        获取所有科目信息

**返回参数**:

- **subjects**: 科目信息列表 , 每条数据类型 *subject*
          - 类型: *List*

        **示例**:{
                ...
                "subjects": [
                    {
                        "sid": 1,
                        "name": "现金",
                        "code": "1010000000",
                        "oneCode": "1010",
                        "thrCode": "000",
                        "twoCode": "000",
                        "direction": 1,
                        "level": 1,
                        "status": 0,
                        "assistant": ""
                    }
                ],
                ...
            }

    ### <F> querySubjectByNameOCode

        通过科目名称或编号获取科目信息

**请求参数**:

- **subject.name**:
  名称
        - **subject.code**:
  编号

        **示例**:{
                "subject.name": "现金",
                "subject.code": "1010001001"
            }

**返回参数**:

- **region**: 大区信息 , 类型 *region*
          - 类型: *object*

        **示例**:{
                ...
                "subject":{
                    "sid": 1,
                    "name": "现金",
                    "code": "1010000000",
                    "oneCode": "1010",
                    "thrCode": "000",
                    "twoCode": "000",
                    "direction": 1,
                    "level": 1,
                    "status": 0,
                    "assistant": ""
                },
                ...
            }

    ### <F> querySubjectByCode

        通过编号获取科目信息

**请求参数**:

- **subject.code**:
  编号

        **示例**:{
                "subject.code": "1010001001"
            }

**返回参数**:

- **region**: 大区信息 , 类型 *region*
          - 类型: *object*

        **示例**:{
                ...
                "subject":{
                    "sid": 1,
                    "name": "现金",
                    "code": "1010000000",
                    "oneCode": "1010",
                    "thrCode": "000",
                    "twoCode": "000",
                    "direction": 1,
                    "level": 1,
                    "status": 0,
                    "assistant": ""
                },
                ...
            }

    ### <F> addSubject

        添加科目信息 , 需要区分一 , 二 , 三级科目层级进行添加 , 如果添加二 , 三级科目 , 需要匹配上级科目的编号 , 如果没有上级科目将不能创建 , 如果科目编号存在或者名称存在也不能添加成功

        科目编号组成格式 , 准从 4-3-3 的格式 , 由数字组成

        一级科目编号为: xxxx 000 000

        二级科目编号为: xxxx xxx xxx

        三级科目编号为: xxxx xxx xxx

**请求参数**:

- **subject.name**:
  名称
        - **subject.code**:
  编号
        - **subject.oneCode**:
  一级编号
        - **subject.twoCode**:
  二级编号
        - **subject.thrCode**:
  三级编号
        - **subject.direction**:
  科目余额方向
        - **subject.level**:
  等级 , 1: 一级 , 2: 二级 , 3: 三级
        - **subject.assistant**:
  辅助核算项

        **示例**:{
                "subject.name": "现金",
                "subject.code": "1010001001",
                "subject.oneCode": "1010",
                "subject.twoCode": "001",
                "subject.thrCode": "001",
                "subject.direction": 0,
                "subject.level": 3,
                "subject.assistant": ""
            }

    ### <F> updateSubject

        更新科目信息 , 如果当前科目已经使用将不能进行更新动作

**请求参数**:

- **subject.sid**:
  科目ID
        - **subject.name**:
  名称
        - **subject.code**:
  编号
        - **subject.oneCode**:
  一级编号
        - **subject.twoCode**:
  二级编号
        - **subject.thrCode**:
  三级编号
        - **subject.direction**:
  科目余额方向
        - **subject.level**:
  等级 , 1: 一级 , 2: 二级 , 3: 三级
        - **subject.assistant**:
  辅助核算项

        **示例**:{
                "subject.sid": 1
                "subject.name": "现金",
                "subject.code": "1010001001",
                "subject.oneCode": "1010",
                "subject.twoCode": "001",
                "subject.thrCode": "001",
                "subject.direction": 0,
                "subject.level": 3,
                "subject.assistant": ""
            }

    ### <F> updateSubjectForStatus

        更新科目状态

**请求参数**:

- **subject.sid**:
  科目ID
        - **subject.status**:
  状态

        **示例**:{
                "subject.sid": 1
                "subject.status": 0
            }

    ### <F> deleteSubject

        删除科目信息 , 已经被引用的科目将不能删除

**请求参数**:

- **subject.sid**:
  科目ID

        **示例**:{
                "subject.sid": 1
            }


## 科目余额

科目余额信息 , 根据期间(账本)进行统计科目对应余额相关数据 , 同时统计年余额

## api.finance.SubjectBalanceAction

**数据类型**:

#### subjectBalance

    - **sbId**: 科目余额ID
      - 类型: *Long*
    - **subject**: 科目信息 , 类型 `subject <./finance.html#api.finance.SubjectAction.subject>`_
      - 类型: *Object*
    - **period**: 期间
      - 类型: *String*
    - **total**: 总额
      - 类型: *Float*
    - **initial**: 起始金额
      - 类型: *Float*
    - **balance**: 期间余额
      - 类型: *Float*
    - **debit**: 借方向余额
      - 类型: *Float*
    - **credit**: 贷方向余额
      - 类型: *Float*
    - **annual**: 年余额
      - 类型: *Float*
    - **adebit**: 年借方向余额
      - 类型: *Float*
    - **acredit**: 年贷方向余额
      - 类型: *Float*
    - **status**: 状态 , 0: 初始 , 1: 过期
      - 类型: *Short*

    ### <F> pageSubjectBalance

        分页方式获取科目余额信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  科目余额信息列表 , 每条数据类型 *subjectBalance*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbId": 1,
                            "acredit": 0.0,
                            "adebit": 0.0,
                            "annual": 300.0,
                            "balance": 300.0,
                            "credit": 0.0,
                            "debit": 0.0,
                            "initial": 300.0,
                            "period": "201608",
                            "status": 1,
                            "total": 300.0,
                            "subject": {
                                "assistant": "",
                                "code": "1010001001",
                                "direction": 1,
                                "level": 3,
                                "name": "金额",
                                "oneCode": "1010",
                                "sid": 66,
                                "status": 0,
                                "thrCode": "001",
                                "twoCode": "001"
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    ### <F> querySubjectBalance

        获取所有科目余额信息

**返回参数**:

- **subjectBalances**: 科目余额信息列表 , 每条数据类型 *subjectBalance*
          - 类型: *List*

        **示例**:{
                ...
                "subjectBalances": [
                    {
                        "sbId": 1,
                        "acredit": 0.0,
                        "adebit": 0.0,
                        "annual": 300.0,
                        "balance": 300.0,
                        "credit": 0.0,
                        "debit": 0.0,
                        "initial": 300.0,
                        "period": "201608",
                        "status": 1,
                        "total": 300.0,
                        "subject": {
                            "assistant": "",
                            "code": "1010001001",
                            "direction": 1,
                            "level": 3,
                            "name": "金额",
                            "oneCode": "1010",
                            "sid": 66,
                            "status": 0,
                            "thrCode": "001",
                            "twoCode": "001"
                        }
                    }
                ],
                ...
            }

    ### <F> updateSubjectBalanceForBalance

        通过科目ID更新科目对应余额信息

**请求参数**:

- **subjectBalance.subject.sid**:
  科目ID
        - **subjectBalance.balance**:
  余额金额

        **示例**:{
                "subjectBalance.subject.sid": 1,
                "subjectBalance.balance": 100
            }

## 凭证

凭证管理 , 凭证相关动作

## api.finance.VoucherAction

**数据类型**:

#### voucher

    - **vid**: 凭证ID
      - 类型: *Long*
    - **voucherId**: 凭证编号 , 格式为 xxxxxxxxxx , 十位数字组成
      - 类型: *String*
    - **word**: 字号 , 格式为XX , 两位大写字符组成
      - 类型: *String*
    - **wordnum**: 行号
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **period**: 期间
      - 类型: *String*
    - **originator**: 创建人 , 类型为 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **auditor**: 审计人 , 类型为 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **auditTime**: 审计时间
      - 类型: *Timestamp*
    - **postor**: 过账人 , 类型为 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **postTime**: 过账时间
      - 类型: *Timestamp*
    - **authorizer**: 授权人 , 类型为 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **cashier**: 出纳 , 类型为 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **reference**: 说明
      - 类型: *String*
    - **attachmentNum**: 附件数
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*
    - **status**: 状态 , 0: 预制 , 1: 正式 , 2: 关闭 , 3: 非正式
      - 类型: *Short*
    - **lockFlag**: 锁标识
      - 类型: *Short*
    - **accounts**: 账目信息列表 , 每条数据类型 account
      - 类型: *List*

        |Filters:|
        - **a.ou**:
  创建人Id
    - **a.pu**:
  过账人Id
    - **a.ct**:
  创建时间
    - **a.pt**:
  过账时间Id
    - **a.p**:
  期间
    - **y.a**:
  账目摘要

    ### <F> pageVoucher

        分页方式获取凭证信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  凭证信息列表 , 每条数据类型 *voucher*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "accounts": [
                                {
                                    "abstracts": "摘要",
                                    "aid": 2,
                                    "assistant": null,
                                    "businessTime": null,
                                    "createTime": null,
                                    "credit": 100.0,
                                    "debit": 0.0,
                                    "oneCode": "1010",
                                    "period": "201601",
                                    "saId": 0,
                                    "status": 0,
                                    "subjectName": "现金",
                                    "thrCode": "001",
                                    "twoCode": "001",
                                    "voucher": null,
                                    "word": "DR"
                                },
                                {
                                    "abstracts": "摘要",
                                    "aid": 1,
                                    "assistant": null,
                                    "businessTime": null,
                                    "createTime": null,
                                    "credit": 0.0,
                                    "debit": 100.0,
                                    "oneCode": "1020",
                                    "period": "201601",
                                    "saId": 0,
                                    "status": 0,
                                    "subjectName": "银行卡",
                                    "thrCode": "001",
                                    "twoCode": "001",
                                    "voucher": null,
                                    "word": "DR"
                                }
                            ],
                            "attachmentNum": 0,
                            "auditTime": null,
                            "auditor": null,
                            "authorizer": null,
                            "cashier": null,
                            "comment": "",
                            "createTime": "2016-09-18",
                            "lockFlag": null,
                            "originator": {
                                "currentName": "白雪",
                                "dept": null,
                                "deptType": "设计部",
                                "duty": "设计师",
                                "uid": 2146,
                                "userId": "U001",
                                "userName": "白雪",
                            },
                            "period": "201610",
                            "postTime": "2016-01-01",
                            "postor": null,
                            "reference": "",
                            "status": 1,
                            "vid": 1,
                            "voucherId": "1100000019",
                            "word": "DR",
                            "wordnum": 0
                        }
                    ],
                    ...
                },
                ...
            }

    ### <F> queryVoucherByVId

        通过凭证ID获取凭证信息

**请求参数**:

- **voucher.vid**:
  凭证ID

        **示例**:{
                "voucher.vid": 1
            }

**返回参数**:

- **voucher**: 凭证信息 , 类型 *voucher*
          - 类型: *object*

        **示例**:{
                ...
                "voucher":{
                    "accounts": [
                        {
                            "abstracts": "摘要",
                            "aid": 2,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 100.0,
                            "debit": 0.0,
                            "oneCode": "1010",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "现金",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": null,
                            "word": "DR"
                        },
                        {
                            "abstracts": "摘要",
                            "aid": 1,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 0.0,
                            "debit": 100.0,
                            "oneCode": "1020",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "银行卡",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": null,
                            "word": "DR"
                        }
                    ],
                    "attachmentNum": 0,
                    "auditTime": null,
                    "auditor": null,
                    "authorizer": null,
                    "cashier": null,
                    "comment": "",
                    "createTime": "2016-09-18",
                    "lockFlag": null,
                    "originator": {
                        "currentName": "白雪",
                        "dept": null,
                        "deptType": "设计部",
                        "duty": "设计师",
                        "uid": 2146,
                        "userId": "U001",
                        "userName": "白雪",
                    },
                    "period": "201610",
                    "postTime": "2016-09-18",
                    "postor": null,
                    "reference": "",
                    "status": 1,
                    "vid": 1,
                    "voucherId": "1100000019",
                    "word": "DR",
                    "wordnum": 0
                },
                ...
            }

    ### <F> addVoucher

        添加凭证信息 , 在添加凭证信息之前 , 账目信息以及辅助核算项目信息存储到临时数据中 , 通过ID列表进行关联动作

**请求参数**:

- **voucher.word**:
  字号 , 格式为XX , 两位大写字符组成
        - **voucher.reference**:
  说明
        - **voucher.createTime**:
  创建时间
        - **voucher.attachmentNum**:
  附件数
        - **voucher.comment**:
  备注
        - **atIds[n]**:
  临时账目ID列表

        **示例**:{
                "voucher.word": "DD",
                "voucher.reference": "说明",
                "voucher.createTime": "2016-01-01 00:00:00",
                "voucher.attachmentNum": 0,
                "voucher.comment": "备注",
                "atIds[0]": 152,
                "atIds[1]": 352
            }

    ### <F> updateVoucher

        更新凭证信息 , 只有预制凭证能够进行更新动作

        更新动作利用临时数据与凭证中账目和辅助核算项信息进行比较 , 之后完成更新动作

**请求参数**:

- **voucher.vid**:
  凭证ID
        - **voucher.reference**:
  说明
        - **voucher.createTime**:
  创建时间
        - **voucher.postTime**:
  过账时间
        - **voucher.attachmentNum**:
  附件数
        - **voucher.comment**:
  备注
        - **atIds[n]**:
  临时创建账目ID列表
        - **uatIds[n]**:
  临时更新账目ID列表
        - **datIds[n]**:
  删除账目ID列表

        **示例**:{
                "voucher.vid": 1,
                "voucher.word": "DD",
                "voucher.reference": "说明",
                "voucher.createTime": "2016-01-01 00:00:00",
                "voucher.attachmentNum": 0,
                "voucher.comment": "备注",
                "atIds[0]": 152,
                "atIds[1]": 352,
                "uatIds[0]": 452,
                "datIds[0]": 23
            }

    ### <F> postVoucher

        过账凭证

**请求参数**:

- **voucher.vid**:
  凭证ID

        **示例**:{
                "voucher.vid": 1,
            }

    ### <F> postVouchers

        批量过账凭证

**请求参数**:

- **vids[n]**:
  凭证ID列表 , 每条数据类型 Long

        **示例**:{
                "vids[n]": 32,
            }

    ### <F> inpostVoucher

        反审核凭证

**请求参数**:

- **voucher.vid**:
  凭证ID

        **示例**:{
                "voucher.vid": 1,
            }

## 账目

账目信息管理

## api.finance.AccountAction

**数据类型**:

#### account

    - **aid**: 账目ID
      - 类型: *Long*
    - **voucher**: 所属凭证 , 类型 [voucher](./finance.html#api.system.RegionAction.voucher)
      - 类型: *Object*
    - **assistant**: 辅助核算项 , 类型 [assistant](./finance.html#api.system.RegionAction.assistant)
      - 类型: *Object*
    - **word**: 字号
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **period**: 期间
      - 类型: *String*
    - **saId**: 序号
      - 类型: *Integer*
    - **abstracts**: 摘要
      - 类型: *String*
    - **oneCode**: 一级编号
      - 类型: *String*
    - **twoCode**: 二级编号
      - 类型: *String*
    - **thrCode**: 三级编号
      - 类型: *String*
    - **subjectName**: 科目名称
      - 类型: *String*
    - **debit**: 借金额
      - 类型: *Float*
    - **credit**: 贷金额
      - 类型: *Float*
    - **businessTime**: 业务时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 预制 , 1: 正式 , 2: 关闭
      - 类型: *Short*

    #### assistant

    - **assistant.aid**:
  辅助核算项ID
    - **assistant.orderId**:
  订单号
    - **assistant.orderAddr**:
  楼盘地址
    - **assistant.msoNo**:
  主材订单号
    - **assistant.user**:
  员工 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.department**:
  部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.designRegion**:
  设计分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.designDepartment**:
  设计部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.deginer**:
  设计师 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.businessRegion**:
  业务分区 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.businessDepartment**:
  业务部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.salesman**:
  业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.supervisDepartment**:
  监理部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.supervisor**:
  监理 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.workDepartment**:
  工人部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.worker**:
  工人 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.officeDepartment**:
  职能部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.officer**:
  职能员工 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.materialDepartment**:
  主材部 , 类型 [department](./department.html#api.department.DepartmentAction.department)
    - **assistant.materialer**:
  主材员 , 类型 [user](./user.html#api.personel.UserAction.user)
    - **assistant.brandName**:
  型号名
    - **assistant.company**:
  公司

        |Filters:|
        - **a.ou**:
  创建人ID
    - **a.pu**:
  过账人ID
    - **a.ct**:
  创建时间
    - **a.pt**:
  过账时间
    - **a.p**:
  期间
    - **c.oi**:
  订单编号
    - **c.mn**:
  主材订单编号
    - **c.du**:
  设计师ID
    - **c.su**:
  业务员ID
    - **c.vu**:
  监理ID
    - **c.wu**:
  工人ID
    - **c.ou**:
  员工ID
    - **c.mu**:
  主材人员ID
    - **c.dr**:
  设计大区ID
    - **c.dd**:
  设计部ID
    - **c.br**:
  业务大区ID
    - **c.db**:
  业务部ID
    - **c.sd**:
  监理部ID
    - **c.wd**:
  工人部ID
    - **c.od**:
  员工部ID
    - **c.md**:
  主材部ID

    ### <F> pageAccount

        分页方式获取账目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  账目信息列表 , 每条数据类型 *account*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "abstracts": "摘要",
                            "aid": 1,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 0.0,
                            "debit": 100.0,
                            "oneCode": "1010",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "现金",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": {
                                "accounts": null,
                                "attachmentNum": 0,
                                "auditTime": null,
                                "auditor": null,
                                "authorizer": null,
                                "cashier": null,
                                "comment": "",
                                "createTime": "2016-09-18",
                                "lockFlag": null,
                                "originator": {
                                    "currentName": "白雪",
                                    "dept": null,
                                    "deptType": "设计部",
                                    "duty": "设计师",
                                    "uid": 2146,
                                    "userId": "U001",
                                    "userName": "白雪",
                                },
                                "period": "201601",
                                "postTime": "2016-01-01",
                                "postor": null,
                                "reference": "",
                                "status": 1,
                                "vid": 1,
                                "voucherId": "1100000019",
                                "word": "DR",
                                "wordnum": 0
                            },
                            "word": "DR"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <F> queryAccountByAId

        通过账目编号获取账目信息

**请求参数**:

- **account.aid**:
  账目ID

        **示例**:{
                "account.aid": 1
            }

**返回参数**:

- **account**: 账目信息 , 类型 *account*
          - 类型: *object*

        **示例**:{
                ...
                "account":{
                    "abstracts": "摘要",
                    "aid": 1,
                    "assistant": null,
                    "businessTime": null,
                    "createTime": null,
                    "credit": 0.0,
                    "debit": 100.0,
                    "oneCode": "1010",
                    "period": "201601",
                    "saId": 0,
                    "status": 0,
                    "subjectName": "现金",
                    "thrCode": "001",
                    "twoCode": "001",
                    "voucher": {
                        "accounts": null,
                        "attachmentNum": 0,
                        "auditTime": null,
                        "auditor": null,
                        "authorizer": null,
                        "cashier": null,
                        "comment": "",
                        "createTime": "2016-09-18",
                        "lockFlag": null,
                        "originator": {
                            "currentName": "白雪",
                            "dept": null,
                            "deptType": "设计部",
                            "duty": "设计师",
                            "uid": 2146,
                            "userId": "U001",
                            "userName": "白雪",
                        },
                        "period": "201601",
                        "postTime": "2016-01-01",
                        "postor": null,
                        "reference": "",
                        "status": 1,
                        "vid": 1,
                        "voucherId": "1100000019",
                        "word": "DR",
                        "wordnum": 0
                    },
                    "word": "DR"
                },
                ...
            }

    ### <F> queryAccountForFormalByAId

        通过账目编号获取账目信息 , 同时将账目以及辅助核算项目信息提交到临时数据中 , 以便提供编辑操作

**请求参数**:

- **account.aid**:
  账目ID

        **示例**:{
                "account.aid": 1
            }

**返回参数**:

- **account**: 账目信息 , 类型 *account*
          - 类型: *object*

        **示例**:{
                ...
                "account":{
                    "abstracts": "摘要",
                    "aid": 1,
                    "assistant": null,
                    "businessTime": null,
                    "createTime": null,
                    "credit": 0.0,
                    "debit": 100.0,
                    "oneCode": "1010",
                    "period": "201601",
                    "saId": 0,
                    "status": 0,
                    "subjectName": "现金",
                    "thrCode": "001",
                    "twoCode": "001",
                    "voucher": {
                        "accounts": null,
                        "attachmentNum": 0,
                        "auditTime": null,
                        "auditor": null,
                        "authorizer": null,
                        "cashier": null,
                        "comment": "",
                        "createTime": "2016-09-18",
                        "lockFlag": null,
                        "originator": {
                            "currentName": "白雪",
                            "dept": null,
                            "deptType": "设计部",
                            "duty": "设计师",
                            "uid": 2146,
                            "userId": "U001",
                            "userName": "白雪",
                        },
                        "period": "201601",
                        "postTime": "2016-01-01",
                        "postor": null,
                        "reference": "",
                        "status": 1,
                        "vid": 1,
                        "voucherId": "1100000019",
                        "word": "DR",
                        "wordnum": 0
                    },
                    "word": "DR"
                },
                ...
            }

    ### <F> addAccount

        添加账目信息到临时数据中 , 提供提交凭证时进行管理数据使用

**请求参数**:

- **account.word**:
  字号
        - **account.period**:
  期间
        - **account.abstracts**:
  摘要
        - **account.oneCode**:
  一级编号
        - **account.twoCode**:
  二级编号
        - **account.thrCode**:
  三级编号
        - **account.subjectName**:
  科目名称
        - **account.debit**:
  借金额
        - **account.credit**:
  贷金额

        - **account.assistant.orderId**:
  订单号
        - **account.assistant.orderAddr**:
  楼盘地址
        - **account.assistant.msoNo**:
  主材订单号
        - **account.assistant.user.uid**:
  员工ID
        - **account.assistant.department.did**:
  部门ID
        - **account.assistant.designRegion.did**:
  设计分区ID
        - **account.assistant.designDepartment.did**:
  设计部ID
        - **account.assistant.deginer.uid**:
  设计师ID
        - **account.assistant.businessRegion.did**:
  业务分区ID
        - **account.assistant.businessDepartment.did**:
  业务部ID
        - **account.assistant.salesman.uid**:
  业务员ID
        - **account.assistant.supervisDepartment.did**:
  监理部
        - **account.assistant.supervisor.uid**:
  监理ID
        - **account.assistant.workDepartment.did**:
  工人部ID
        - **account.assistant.worker.uid**:
  工人ID
        - **account.assistant.officeDepartment.did**:
  职能部ID
        - **account.assistant.officer.uid**:
  职能员工ID
        - **account.assistant.materialDepartment.did**:
  主材部ID
        - **account.assistant.materialer.uid**:
  主材员ID
        - **account.assistant.brandName**:
  型号名
        - **account.assistant.company**:
  公司

        **示例**:{
                "account.subjectName": "现金",
                "account.abstracts": "摘要",
                "account.period": "201601",
                "account.word": "DR",
                "account.credit": 0.0,
                "account.debit": 100.0,
                "account.oneCode": "1010",
                "account.twoCode": "001",
                "account.thrCode": "001",
                "account.assistant.orderId": "1601010001"
            }

    ### <F> updateAccount

        更新账目信息到临时信息中

**请求参数**:

- **account.aid**:
  账目ID
        - **account.word**:
  字号
        - **account.period**:
  期间
        - **account.abstracts**:
  摘要
        - **account.oneCode**:
  一级编号
        - **account.twoCode**:
  二级编号
        - **account.thrCode**:
  三级编号
        - **account.subjectName**:
  科目名称
        - **account.debit**:
  借金额
        - **account.credit**:
  贷金额

        - **account.assistant.orderId**:
  订单号
        - **account.assistant.orderAddr**:
  楼盘地址
        - **account.assistant.msoNo**:
  主材订单号
        - **account.assistant.user.uid**:
  员工ID
        - **account.assistant.department.did**:
  部门ID
        - **account.assistant.designRegion.did**:
  设计分区ID
        - **account.assistant.designDepartment.did**:
  设计部ID
        - **account.assistant.deginer.uid**:
  设计师ID
        - **account.assistant.businessRegion.did**:
  业务分区ID
        - **account.assistant.businessDepartment.did**:
  业务部ID
        - **account.assistant.salesman.uid**:
  业务员ID
        - **account.assistant.supervisDepartment.did**:
  监理部
        - **account.assistant.supervisor.uid**:
  监理ID
        - **account.assistant.workDepartment.did**:
  工人部ID
        - **account.assistant.worker.uid**:
  工人ID
        - **account.assistant.officeDepartment.did**:
  职能部ID
        - **account.assistant.officer.uid**:
  职能员工ID
        - **account.assistant.materialDepartment.did**:
  主材部ID
        - **account.assistant.materialer.uid**:
  主材员ID
        - **account.assistant.brandName**:
  型号名
        - **account.assistant.company**:
  公司

        **示例**:{
                "account.aid": 2,
                "account.subjectName": "现金",
                "account.abstracts": "摘要",
                "account.period": "201601",
                "account.word": "DR",
                "account.credit": 0.0,
                "account.debit": 100.0,
                "account.oneCode": "1010",
                "account.twoCode": "001",
                "account.thrCode": "001",
                "account.assistant.orderId": "1601010001"
            }

    ### <F> deleteAccount

        删除临时账目信息

**请求参数**:

- **account.aid**:
  账目ID

        **示例**:{
                "account.aid": 2
            }
