
.. _user:

***************
人资
***************

部门
================

类型
----------------

部门类型信息管理

.. class:: api.communion.DepartmentTypeAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: departmentType
    
    :param dtid: ID
    :type dtid: Long
    :param name: 名称
    :type name: String
    
    .. method:: <I> pageDepartmentType
    
        分页方式获取部门类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 部门类型信息列表 , 每条数据类型 :data:`departmentType`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "dtid": 1,
                            "name": "设计",
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryDepartmentType
    
        获取部门类型信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param departmentTypes: 部门类型信息 , 类型 :data:`departmentType`
        :type departmentTypes: object
        
        Example::
        
            {
                ...
                "departmentTypes": [
                    {
                        "dtid": 1,
                        "name": "设计",
                    }
                ],
                ...
            }
            
    .. method:: <C> addDepartmentType
    
        添加部门类型信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param departmentType.name: 名称
        :type departmentType.name: String
        
        Example::
        
            {
                "departmentType.name": "设计"
            }
            
部门
----------------

部门信息管理

.. note::
	
	* 部门层级可以划分多层 , 利用上级部门字段 , 按照两级结构进行划分 , 分为分区和部门 , 主要体现在设计和业务 . 
	* 设计大区 - 设计部 , 业务大区 - 业务部 , 主材部 , 工程部 , 职能部 , 其他分类可以根据公司具体情况进行管理 . 
            
.. class:: api.communion.DepartmentAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: department
    
    :param did: 部门ID
    :type did: Long
    :param no: 编码
    :type no: String
    :param name: 名称
    :type name: String
    :param pinyin: 拼音
    :type pinyin: String
    :param type: 部门类型 , 类型 `departmentType <./department.html#api.communion.DepartmentTypeAction.departmentType>`_
    :type type: Object
    :param fatherDept: 上级部门 , 类型 :data:`department`
    :type fatherDept: Object
    :param manager: 管理员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type manager: Object
    :param level: 等级 , 1: 分区 , 2: 部门
    :type level: Short
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态 , 0: 禁用 , 1: 启用
    :type status: Short
    :param isdet: 是否定岗 , 0: 开放 , 1: 定岗
    :type isdet: Short
    :param limit: 数量上限
    :type limit: Integer
    :param company: 公司
    :type company: Long
    :param comment: 说明信息
    :type comment: String
    
    :param kino: 金蝶编号
    :type kino: String
    :param kiname: 金蝶名称
    :type kiname: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param type: 类型
    :type type: String
    :param name: 名称
    :type name: String
    
    .. method:: <I> pageDepartment
    
        分页方式获取部门信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 部门信息列表 , 每条数据类型 :data:`department`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "did": 1,
                            "no": "D001",
                            "name": "市场营销一部",
                            "type": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "fatherDept": {
                                "did": 1,
                                "no": "D002",
                                "createTime": "2014-01-01",
                                "name": "市场一分区",
                                "comment": "市场一分区",
                                "subType": null,
                                "type": "业务大区",
                                "contractPrefix": null,
                                "fatherDept": null,
                                "cityProper": null
                            },
                            "manager": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "level": 1,
                            "createTime": "2014-01-01",
                            "isdet": 0,
                            "limit": 100,
                            "comment": "",
                            "kino": "01.01.02",
                            "kiname": "市场营销一部"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryDepartment
    
        获取全部部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.type: 类型 , 通过类型进行查询
        :type dept.type: String
        
        Example::
        	
        	{
        		"dept.type": "业务部"
        	}
        
        +--------+
        |Returns:|
        +--------+
        
        :param departments: 部门信息列表 , 每条数据类型 :data:`department`
        :type departments: List
        
        Example::
        
            {
                ...
                "departments": [
                    {
                        "did": 1,
                        "no": "D001",
                        "name": "市场营销一部",
                        "createTime": "2014-01-01",
                        "type": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "fatherDept": {
                            "did": 1,
                            "no": "D002",
                            "createTime": "2014-01-01",
                            "name": "市场一分区",
                            "comment": "市场一分区",
                            "subType": null,
                            "type": "业务大区",
                            "contractPrefix": null,
                            "fatherDept": null,
                            "cityProper": null
                        },
                        "level": 1,
                        "isdet": 0,
                        "limit": 100,
                        "comment": "",
                        "kino": "01.01.02",
                        "kiname": "市场营销一部"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryDepartmentByDtid
    
        通过部门类型ID获取部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.type.dtid: 部门类型ID
        :type dept.type.dtid: Integer
        
        Example::
        
            {
                "dept.type.dtid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param departments: 部门信息列表 , 每条数据类型 :data:`department`
        :type departments: List
        
        Example::
        
            {
                ...
                "departments": [
                    {
                        "did": 1,
                        "no": "D001",
                        "name": "市场营销一部",
                        "createTime": "2014-01-01",
                        "type": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "fatherDept": {
                            "did": 1,
                            "no": "D002",
                            "createTime": "2014-01-01",
                            "name": "市场一分区",
                            "comment": "市场一分区",
                            "subType": null,
                            "type": "业务大区",
                            "contractPrefix": null,
                            "fatherDept": null,
                            "cityProper": null
                        },
                        "manager": {
                            "uid": 2,
                            "userId": "FL-00186",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "phone": "138xxxx1828",
                            ...
                        },
                        "level": 1,
                        "isdet": 0,
                        "limit": 100,
                        "comment": "",
                        "kino": "01.01.02",
                        "kiname": "市场营销一部"
                    }
                ],
                ...
            }
            
    .. method:: <I> queryDepartmentByDid
    
        通过部门ID获取部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.did: 部门ID
        :type dept.did: Long
        
        Example::
        
            {
                "dept.did": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dept: 部门信息 , 类型 :data:`department`
        :type dept: object
        
        Example::
        
            {
                ...
                "dept":{
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                    "createTime": "2014-01-01",
                    "type": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "fatherDept": {
                        "did": 1,
                        "no": "D002",
                        "createTime": "2014-01-01",
                        "name": "市场一分区",
                        "comment": "市场一分区",
                        "subType": null,
                        "type": "业务大区",
                        "contractPrefix": null,
                        "fatherDept": null,
                        "cityProper": null
                    },
                    "manager": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "level": 1,
                    "isdet": 0,
                    "limit": 100,
                    "comment": "",
                    "kino": "01.01.02",
                    "kiname": "市场营销一部"
                },
                ...
            }
            
    .. method:: <I> queryDepartmentByNo
    
        通过部门编号获取部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.no: 部门编号
        :type dept.no: String
        
        Example::
        
            {
                "dept.no": "D001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dept: 部门信息 , 类型 :data:`department`
        :type dept: object
        
        Example::
        
            {
                ...
                "dept":{
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                    "createTime": "2014-01-01",
                    "type": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "fatherDept": {
                        "did": 1,
                        "no": "D002",
                        "createTime": "2014-01-01",
                        "name": "市场一分区",
                        "comment": "市场一分区",
                        "subType": null,
                        "type": "业务大区",
                        "contractPrefix": null,
                        "fatherDept": null,
                        "cityProper": null
                    },
                    "manager": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "level": 1,
                    "isdet": 0,
                    "limit": 100,
                    "comment": "",
                    "kino": "01.01.02",
                    "kiname": "市场营销一部"
                },
                ...
            }
            
    .. method:: <I> queryDepartmentByName
    
        通过部门名称以及部门类型获取部门信息 , 部门名称可以使用名称拼音进行查询
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.name: 部门名称 , 部门名称拼音
        :type dept.name: String
        :param dept.type: 类型 , 包括:设计大区 , 业务大区 , 设计部 , 业务部 , 主材部 , 职能部 , 工程部
        :type dept.type: String
        
        Example::
            
            {
                "dept.name": "shichang",
                "dept.type": "设计部"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param departments: 部门信息列表 , 每条数据类型 :data:`department`
        :type departments: List
        
        Example::
        
            {
                ...
                "departments": [
                    {
                        "did": 1,
                        "no": "D001",
                        "name": "市场营销一部",
                        "createTime": "2014-01-01",
                        "type": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "fatherDept": {
                            "did": 1,
                            "no": "D002",
                            "createTime": "2014-01-01",
                            "name": "市场一分区",
                            "comment": "市场一分区",
                            "subType": null,
                            "type": "业务大区",
                            "contractPrefix": null,
                            "fatherDept": null,
                            "cityProper": null
                        },
                        "manager": {
                            "uid": 2,
                            "userId": "FL-00186",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "phone": "138xxxx1828",
                            ...
                        },
                        "level": 1,
                        "isdet": 0,
                        "limit": 100,
                        "comment": "",
                        "kino": "01.01.02",
                        "kiname": "市场营销一部"
                    }
                ],
                ...
            }
            
    .. method:: <C> addDepartment
    
        添加部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.name: 名称
        :type dept.name: String
        :param dept.comment: 说明信息
        :type dept.comment: String
        :param dept.type.dtid: 类型ID
        :type dept.type.dtid: Long
        :param dept.fatherDept.did: 上级部门ID
        :type dept.fatherDept.did: Long
        :param dept.manager.uid: 管理员ID
        :type dept.manager.uid: Long
        :param dept.level: 等级
        :type dept.level: Short
        :param dept.isdet: 是否定岗
        :type dept.isdet: Short
        :param dept.limit: 数量上限
        :type dept.limit: Short
        
        :param dept.kino: 金蝶编号
        :type dept.kino: String
        :param dept.kiname: 金蝶名称
        :type dept.kiname: String
        
        Example::
        
            {
                "dept.name": "设计部",
                "dept.comment": "说明信息",
                "dept.type.dtid": 1,
                "dept.fatherDept.did": 1,
                "dept.manager.uid": 1,
                "dept.level": 1,
                "dept.isdet": 1,
                "dept.limit": 1,
                "dept.kino": "01.01.02",
                "dept.kiname": "设计部"
            }
            
    .. method:: <C> updateDepartment
    
        更新部门信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.did: 部门ID
        :type dept.did: Long
        :param dept.name: 名称
        :type dept.name: String
        :param dept.type.dtid: 类型ID
        :type dept.type.dtid: Long
        :param dept.fatherDept.did: 上级部门ID
        :type dept.fatherDept.did: Long
        :param dept.comment: 说明信息
        :type dept.comment: String
        :param dept.manager.uid: 管理员ID
        :type dept.manager.uid: Long
        :param dept.level: 等级
        :type dept.level: Short
        :param dept.isdet: 是否定岗
        :type dept.isdet: Short
        :param dept.limit: 数量上限
        :type dept.limit: Short
        
        :param dept.kino: 金蝶编号
        :type dept.kino: String
        :param dept.kiname: 金蝶名称
        :type dept.kiname: String
        
        Example::
        
            {
                "dept.did": 1,
                "dept.name": "设计部",
                "dept.comment": "说明信息",
                "dept.type.dtid": 1,
                "dept.fatherDept.did": 1,
                "dept.manager.uid": 1,
                "dept.level": 1,
                "dept.isdet": 1,
                "dept.limit": 1,
                "dept.kino": "01.01.02",
                "dept.kiname": "设计部"
            }
        
    .. method:: <C> updateDepartmentForStatus
    
        更新部门状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param dept.did: 部门ID
        :type dept.did: Long
        :param dept.status: 状态
        :type dept.status: Short
        :param dept.isdet: 是否定岗
        :type dept.isdet: Short
        
        Example::
        
            {
                "dept.did": 1,
                "dept.status": 1,
                "dept.isdet": 0
            }

定岗
----------------

.. class:: api.communion.DutmentAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: dutment
    
    :param did: 定岗ID
    :type did: Long
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: Object
    :param duty: 职位 , 类型 `duty <./data.html#api.duty.DutyAction.duty>`__
    :type duty: Object
    :param limit: 人员上限
    :type limit: Integer
    :param num: 人员数量
    :type num: Integer
    
    .. method:: <I> queryDutmentByDeid
    
        根据部门获取对应职位的定岗信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dutment.dept.did: 部门ID
        :type dutment.dept.did: Long
        
        Example::
        
            {
                "dutment.dept.did": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dutments: 定岗列表 , 每条数据类型 :data:`dutment`
        :type dutments: List
        
        Example::
        
            {
                ...
                "dutments": [
                    {
                        "did": 1,
                        "dept": {
                            "did": 1,
                            "no": "D001",
                            "name": "市场营销一部",
                            "createTime": "2014-01-01",
                            "type": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "fatherDept": {
                                "did": 1,
                                "no": "D002",
                                "createTime": "2014-01-01",
                                "name": "市场一分区",
                                "comment": "市场一分区",
                                "subType": null,
                                "type": "业务大区",
                                "contractPrefix": null,
                                "fatherDept": null,
                                "cityProper": null
                            },
                            "comment": "",
                            "kino": "01.01.02",
                            "kiname": "市场营销一部"
                        },
                        "duty": {
                            "did": 1,
                            "name": "设计师",
                            "departmentType": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "type": 0,
                            "status": 0,
                            "lead": 0
                        },
                        "limit": 10000,
                        "num": 0
                    }
                ],
                ...
            }
        
    .. method:: <I> queryDutmentByDuid
    
        根据职位获取对应部门的定岗信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dutment.duty.did: 职位ID
        :type dutment.duty.did: Long
        
        Example::
        
            {
                "dutment.duty.did": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param dutments: 定岗列表 , 每条数据类型 :data:`dutment`
        :type dutments: List
        
        Example::
        
            {
                ...
                "dutments": [
                    {
                        "did": 1,
                        "dept": {
                            "did": 1,
                            "no": "D001",
                            "name": "市场营销一部",
                            "createTime": "2014-01-01",
                            "type": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "fatherDept": {
                                "did": 1,
                                "no": "D002",
                                "createTime": "2014-01-01",
                                "name": "市场一分区",
                                "comment": "市场一分区",
                                "subType": null,
                                "type": "业务大区",
                                "contractPrefix": null,
                                "fatherDept": null,
                                "cityProper": null
                            },
                            "comment": "",
                            "kino": "01.01.02",
                            "kiname": "市场营销一部"
                        },
                        "duty": {
                            "did": 1,
                            "name": "设计师",
                            "departmentType": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "type": 0,
                            "status": 0,
                            "lead": 0
                        },
                        "limit": 10000,
                        "num": 0
                    }
                ],
                ...
            }

    .. method:: <C> addDutment
    
        添加定岗信息
        
        判断职位和部门是否存在定岗信息 , 已经存在 , 错误信息 **130051 定岗信息已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param dutment.duty.did: 职位ID
        :type dutment.duty.did: Long
        :param dutment.dept.did: 部门ID
        :type dutment.dept.did: Long
        :param dutment.limit: 人员上限
        :type dutment.limit: Integer
        
        Example::
        
            {
                "dutment.duty.did": 1,
                "dutment.dept.did": 1,
                "dutment.limit": 0
            }
            
    .. method:: <C> updateDutment
    
        更新定岗信息
        
        更新数据包括人员数量上限
        
        判断定岗信息是否存在 , 不存在 , 错误信息 **130050 定岗信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param dutment.did: 定岗ID
        :type dutment.did: Long
        :param dutment.limit: 人员上限
        :type dutment.limit: Integer
        
        Example::
        
            {
                "dutment.did": 1,
                "dutment.limit": 0
            }
            
    .. method:: <C> deleteDutment
    
        删除定岗信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param dutment.did: 定岗ID
        :type dutment.did: Long
        
        Example::
        
            {
                "dutment.did": 1
            }

员工
================

员工
----------------

员工信息管理

.. class:: api.personel.UserAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: user
    
    :param uid: 员工ID
    :type uid: Long
    :param userId: 员工编号
    :type userId: String
    :param oldUserId: 旧员工编号
    :type oldUserId: String
    :param type: 类型 , 0: 人员 , 1: 厂商 , 2: 商户 , 3: 管理
    :type type: Short
    :param loginId: 登陆帐号
    :type loginId: String
    :param password: 密码
    :type password: String
    :param userName: 用户名
    :type userName: String
    :param currentName: 现用名
    :type currentName: String
    :param pinyin: 拼音
    :type pinyin: String
    :param identity: 身份证号
    :type identity: String
    :param phone: 手机号
    :type phone: String
    :param status: 状态 , 0: 在职, 1: 离职, 2: 停薪留职
    :type status: Short
    :param userPhoto: 用户图片
    :type userPhoto: String
    :param isLogin: 是否允许登陆 , 0: 不能登陆 , 1: 允许登陆
    :type isLogin: Short
    :param extranet: 扫码权限 , 0: 允许, 1: 不允许
    :type extranet: Short
    :param freedom: 特权 , 1: 超时 , 2: 操作名单 , 4:  , 默认值为0 , 标识没有超时特权 , 操作为黑名单
    :type freedom: Short
    
    :param duty: 职位 , 类型 `duty <./data.html#api.duty.DutyAction.duty>`__
    :type duty: Object
    :param role: 角色 , 类型 `role <./system.html#api.system.RoleAction.role>`__
    :type role: object
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: object
    
    :param authStatus: 认证状态 , 0: 初始 , 1(认证) , 2(本地认证)
    :type authStatus: Short
    
    :param company: 公司代码
    :type company: Long
    :param companys: 公司信息
    :type companys: String
    
    .. data:: userInfo
    
    :param uiid: 信息ID
    :type uiid: Long
    
    :param user: 员工 , 类型 :data:`user`
    :type user: Object
    
    :param rank: 级别
    :type rank: Short
    :param level: 职级 , 0: 员工 , 1: 核心员工 , 2: 主管 , 3: 经理 , 4: 总监及以上
    :type level: Short
    :param form: 岗位类型 , 0: 产值 , 1: 非产值
    :type form: Short
    
    :param gender: 性别 , 0: 女 , 1: 男
    :type gender: String
    :param age: 年龄
    :type age: Integer
    :param birthday: 出生日期
    :type birthday: Timestamp
    :param height: 身高
    :type height: Integer
    :param weight: 体重
    :type weight: Integer
    :param political: 政治面貌 , 0: 群众 , 1: 团员 , 2: 党员
    :type political: Short
    :param nation: 民族
    :type nation: String
    :param hobby: 特长/爱好
    :type hobby: String
    :param qq: QQ
    :type qq: String
    :param wechat: 微信
    :type wechat: String
    :param email: 邮箱
    :type email: String
    
    :param isMarried: 婚姻状况 , 0: 已婚 , 1: 未婚
    :type isMarried: Short
    :param isBirth: 生育状况 , 0: 已育 , 1: 未育
    :type isBirth: Short
    :param isHouseLoan: 是否有房贷 , 0: 有 , 1: 无
    :type isHouseLoan: Short
    :param isCarLoan: 是否有车贷 , 0: 有 , 1: 无
    :type isCarLoan: Short
    :param isCarID: 是否有驾照 , 0: 有 , 1: 无
    :type isCarID: Short
    :param isPassID: 是否有护照 , 0: 有 , 1: 无
    :type isPassID: Short
    :param isHMID: 是否有港澳通行证 , 0: 有 , 1: 无
    :type isHMID: Short
    :param isTWID: 是否有台湾通行证 , 0: 有 , 1: 无
    :type isTWID: Short
    
    :param householdType: 户口类型 , 0: 农村 , 1: 城镇
    :type householdType: Short
    :param hometownPlace: 户籍地
    :type hometownPlace: String
    :param hometownAddress: 户籍地址
    :type hometownAddress: String
    :param address: 现住地址
    :type address: String
    :param lover: 爱人
    :type lover: String
    :param claner: 直系亲属
    :type claner: String
    :param clanerCom: 直系亲属公司
    :type clanerCom: String
    :param emergencyMan: 紧急联系人
    :type emergencyMan: String
    :param emergencyPhone: 紧急联系人电话
    :type emergencyPhone: String
    :param fangliner: 方林家属 , 类型 :data:`user`
    :type fangliner: Object
    
    :param firstTime: 入司时间/进入集团时间
    :type firstTime: Timestamp
    :param entryTime: 入职时间
    :type entryTime: Timestamp
    :param employWay: 招聘方式 , 0: 校园招聘 , 1: 网络招聘 , 2: 内部推荐 , 3: 主动应聘 , 4: 猎头
    :type employWay: Short
    :param recommendMan: 推荐人
    :type recommendMan: String
    :param jobYears: 司龄
    :type jobYears: Integer
    :param employType: 招聘类型 , 0: 正式 , 1: 试用
    :type employType: Short
    :param employTime: 招聘时间
    :type employTime: Timestamp
    :param serviceYears: 服务年限
    :type serviceYears: Integer
    
    :param isPresentGraduate: 是否应届 , 0: 是 , 1: 否
    :type isPresentGraduate: Short
    :param graduateTime: 毕业时间
    :type graduateTime: Timestamp
    :param school: 毕业学校
    :type school: String
    :param education: 学历 , 0: 小学及以下 , 1: 初中 , 2: 中专 , 3: 高中 , 4: 大专 , 5: 本科 , 6: 研究生及以上
    :type education: Short
    :param specialty: 专业
    :type specialty: String

    :param isContract: 是否签劳动合同
    :type isContract: String
    :param signTime: 签合同日期
    :type signTime: Timestamp
    :param eignTime: 合同结束日期
    :type eignTime: Timestamp
    :param fignTime: 首次合同日期
    :type fignTime: Timestamp
    :param signNum: 续签合同次数
    :type signNum: Integer
    :param preformNum: 试用期限
    :type preformNum: String
    :param formTime: 转正日期
    :type formTime: Timestamp
    
    :param isInsurance: 是否上保险 , 0: 是 , 1: 否
    :type isInsurance: Short
    :param insuranceType: 保险类型 , 0: 社保 , 1: 商业保险
    :type insuranceType: Short
    :param insuranceTime: 参保时间
    :type insuranceTime: Timestamp
    :param pensionNum: 养老编号
    :type pensionNum: String
    :param medicalNum: 医疗编号
    :type medicalNum: String
    :param publicNum: 公积金号
    :type pulibcNum: String

    :param palary: 试用工资
    :type palary: String
    :param salary: 转正工资
    :type salary: String
    :param bank: 开户行
    :type bank: String
    :param bankCardNum: 银行卡号
    :type bankCardNum: String
    
    :param comment: 备注
    :type comment: String
    
    .. data:: userBase
    
    :param uid: 员工ID
    :type uid: Long
    :param userId: 员工编号
    :type userId: String
    :param oldUserId: 旧员工编号
    :type oldUserId: String
    :param userName: 用户名
    :type userName: String
    :param currentName: 现用名
    :type currentName: String
    :param phone: 手机号
    :type phone: String
    :param userPhoto: 用户图片
    :type userPhoto: String
    :param duty: 职位 , 类型 `duty <./data.html#api.duty.DutyAction.duty>`__
    :type duty: String
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: object
    
    .. data:: keyValue
    
    :param key: 键
    :type key: String
    :param value: 值
    :type value: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param userId: 员工编号
    :type userId: String
    :param currentName: 现用名
    :type currentName: String
    :param status: 状态
    :type status: String
    :param identity: 身份证号
    :type identity: String
    :param no: 角色编号
    :type no: String
    :param deptType: 部门类型
    :type deptType: String
    :param no: 部门编号
    :type no: String
    
    .. method:: <I> pageUser
    
        分页方式获取员工信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 员工信息列表 , 每条数据类型 :data:`user`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uid": 34,
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "identity": "000000000000000000",
                            "phone": "138xxxx3874",
                            "company": 0,
                            "duty": {
                                "did": 1,
                                "name": "设计师",
                                "departmentType": {
                                    "dtid": 1,
                                    "name": "设计"
                                },
                                "lead": 0
                            },
                            "dept": {
                                "did": 250,
                                "no": "D001",
                                "name": "设计部",
                                "fatherDept": null,
                                "type": "职能部"
                            },
                            "role": {
                                "rid": 1,
                                "no": "R001",
                                "name": "游客"
                            },
                            "status": 0,
                            "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageUserInfo
    
        分页方式获取员工信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 员工信息列表 , 每条数据类型 :data:`userInfo`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uiid": 1,
                            "user": {
                                "uid": 1,
                                "userId": "U001",
                                "oldUserId": "U001",
                                "userName": "员工",
                                "currentName": "员工",
                                "identity": "000000000000000000",
                                "phone": "138xxxx3874",
                                "company": 0,
                                "duty": {
                                    "did": 1,
                                    "name": "设计师",
                                    "departmentType": {
                                        "dtid": 1,
                                        "name": "设计"
                                    },
                                    "lead": 0
                                },
                                "dept": {
                                    "did": 250,
                                    "no": "D001",
                                    "name": "设计部",
                                    "fatherDept": null,
                                    "type": "职能部"
                                },
                                "role": {
                                    "rid": 1,
                                    "no": "R001",
                                    "name": "游客"
                                },
                                "status": 0,
                                "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                            },
                            
                            "level": 0,
                            
                            "gender": 1,
                            "age": 28,
                            "birthday": "2016-01-01",
                            "height": 180,
                            "weight": 60,
                            "political": 0,
                            "nation": "汉",
                            "hobby": "",
                            "qq": "",
                            "wechat": "",
                            "email": "",
                            
                            "isMarried": 0,
                            "isBirth": 0,
                            "isHouseLoan": 0,
                            "isCarLoan": 0,
                            "isCarID": 0,
                            "isPassID": 0,
                            "isHMID": 0,
                            "isTWID": 0,
                            
                            "householdType": 0,
                            "hometownPlace": "沈阳",
                            "hometownAddress": "",
                            "address": "",
                            "lover": "",
                            "claner": "直系亲属",
                            "clanerCom": "公司",
                            "emergencyMan": "紧急联系人",
                            "emergencyPhone": "电话",
                            "fangliner": null,
                            
                            "firstTime": "2016-01-01",
                            "entryTime": "2016-01-01",
                            "employWay": 0,
                            "employType": 0,
                            "employTime": "2016-01-01",
                            "recommendMan": "推荐人",
                            "jobYears": 0,
                            "serviceYears": 0,
                            
                            "isPresentGraduate": 0,
                            "graduateTime": "2016-01-01",
                            "school": "",
                            "education": 0,
                            "specialty": "",
                            
                            "isContract": 0,
                            "signTime": "2016-01-01",
                            "eignTime": "2016-01-01",
                            "fignTime": "2016-01-01",
                            "signNum": 0,
                            "preformNum": 90,
                            "formTime": "2016-01-01",
                            
                            "isInsurance": 0,
                            "insuranceType": 0,
                            "insuranceTime": "2016-01-01",
                            "pensionNum": "",
                            "medicalNum": "",
                            "publicNum": "",
                            
                            "palary": 0,
                            "salary": 0,
                            "bank": "",
                            "bankCardNum": "",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryUserByLoginId
    
        通过登录帐号获取员工信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.loginId: 登陆帐号
        :type user.loginId: String
        
        Example::
        
            {
                "user.loginId": "yuangong"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param user: 员工信息 , 类型 :data:`user`
        :type user: object
        
        Example::
        
            {
                ...
                "user": {
                    "uid": 34,
                    "userId": "U001",
                    "oldUserId": "U001",
                    "userName": "员工",
                    "currentName": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "company": 0,
                    "duty": {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "lead": 0
                    },
                    "dept": {
                        "did": 250,
                        "no": "D001",
                        "name": "设计部",
                        "fatherDept": null,
                        "type": "职能部"
                    },
                    "role": {
                        "rid": 1,
                        "no": "R001",
                        "name": "游客"
                    },
                    "status": 0,
                    "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                }
                ...
            }
            
    .. method:: <I> queryUserByUserId
    
        获取指定用户编号对应的用户信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        获取人员同时获取公司名称信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param user: 员工信息 , 类型 :data:`user`
        :type user: object
        
        Example::
        
            {
                ...
                "user": {
                    "uid": 34,
                    "userId": "U001",
                    "oldUserId": "U001",
                    "userName": "员工",
                    "currentName": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "company": 0,
                    "duty": {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "lead": 0
                    },
                    "dept": {
                        "did": 250,
                        "no": "D001",
                        "name": "设计部",
                        "fatherDept": null,
                        "type": "职能部"
                    },
                    "role": {
                        "rid": 1,
                        "no": "R001",
                        "name": "游客"
                    },
                    "status": 0,
                    "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                }
                ...
            }
            
    .. method:: <I> queryUserInfoByUserId
    
        获取指定用户编号对应的用户信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        获取人员同时获取公司名称信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userInfo.user.userId: 员工编号
        :type userInfo.user.userId: String
        
        Example::
        
            {
                "userInfo.user.userId": "U001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userInfo: 员工信息 , 类型 :data:`userInfo`
        :type userInfo: object
        
        Example::
        
            {
                ...
                "userInfo": {
                    "uiid": 32,
                    "user": {
                        "uid": 34,
                        "userId": "U001",
                        "oldUserId": "U001",
                        "userName": "员工",
                        "currentName": "员工",
                        "identity": "000000000000000000",
                        "phone": "138xxxx3874",
                        "company": 0,
                        "duty": {
                            "did": 1,
                            "name": "设计师",
                            "departmentType": {
                                "dtid": 1,
                                "name": "设计"
                            },
                            "lead": 0
                        },
                        "dept": {
                            "did": 250,
                            "no": "D001",
                            "name": "设计部",
                            "fatherDept": null,
                            "type": "职能部"
                        },
                        "role": {
                            "rid": 1,
                            "no": "R001",
                            "name": "游客"
                        },
                        "status": 0,
                        "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                    },
                    
                    "level": 0,
                    
                    "gender": 1,
                    "age": 28,
                    "birthday": "2016-01-01",
                    "height": 180,
                    "weight": 60,
                    "political": 0,
                    "nation": "汉",
                    "hobby": "",
                    "qq": "",
                    "wechat": "",
                    "email": "",
                    
                    "isMarried": 0,
                    "isBirth": 0,
                    "isHouseLoan": 0,
                    "isCarLoan": 0,
                    "isCarID": 0,
                    "isPassID": 0,
                    "isHMID": 0,
                    "isTWID": 0,
                    
                    "householdType": 0,
                    "hometownPlace": "沈阳",
                    "hometownAddress": "",
                    "address": "",
                    "lover": "",
                    "claner": "直系亲属",
                    "clanerCom": "公司",
                    "emergencyMan": "紧急联系人",
                    "emergencyPhone": "电话",
                    "fangliner": null,
                    
                    "firstTime": "2016-01-01",
                    "entryTime": "2016-01-01",
                    "employWay": 0,
                    "employType": 0,
                    "employTime": "2016-01-01",
                    "recommendMan": "推荐人",
                    "jobYears": 0,
                    "serviceYears": 0,
                    
                    "isPresentGraduate": 0,
                    "graduateTime": "2016-01-01",
                    "school": "",
                    "education": 0,
                    "specialty": "",
                    
                    "isContract": 0,
                    "signTime": "2016-01-01",
                    "eignTime": "2016-01-01",
                    "fignTime": "2016-01-01",
                    "signNum": 0,
                    "preformNum": 90,
                    "formTime": "2016-01-01",
                    
                    "isInsurance": 0,
                    "insuranceType": 0,
                    "insuranceTime": "2016-01-01",
                    "pensionNum": "",
                    "medicalNum": "",
                    "publicNum": "",
                    
                    "palary": 0,
                    "salary": 0,
                    "bank": "",
                    "bankCardNum": "",
                    "comment": ""
                }
                ...
            }
            
    .. method:: <I> queryUserForSelfByUserId
    
        获取当前登陆员工信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        获取人员同时获取公司名称信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param user: 员工信息 , 类型 :data:`user`
        :type user: object
        
        Example::
        
            {
                ...
                "user": {
                    "uid": 34,
                    "userId": "U001",
                    "oldUserId": "U001",
                    "userName": "员工",
                    "currentName": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "company": 0,
                    "duty": {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "lead": 0
                    },
                    "dept": {
                        "did": 250,
                        "no": "D001",
                        "name": "设计部",
                        "fatherDept": null,
                        "type": "职能部"
                    },
                    "role": {
                        "rid": 1,
                        "no": "R001",
                        "name": "游客"
                    },
                    "status": 0,
                    "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                }
                ...
            }
            
    .. method:: <I> queryUserByOldUserId
    
        通过旧员工编号获取员工信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.oldUserId: 旧员工编号
        :type user.oldUserId: String
        
        Example::
        
            {
                "user.oldUserId": "yuangong"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param user: 员工信息 , 类型 :data:`user`
        :type user: object
        
        Example::
        
            {
                ...
                "user": {
                    "uid": 34,
                    "userId": "U001",
                    "oldUserId": "U001",
                    "userName": "员工",
                    "currentName": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "company": 0,
                    "duty": {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "lead": 0
                    },
                    "dept": {
                        "did": 250,
                        "no": "D001",
                        "name": "设计部",
                        "fatherDept": null,
                        "type": "职能部"
                    },
                    "role": {
                        "rid": 1,
                        "no": "R001",
                        "name": "游客"
                    },
                    "status": 0,
                    "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                }
                ...
            }
            
    .. method:: <I> queryUserByPinyin
    
        通过员工名拼音获取员工名以及员工编号信息
        
        通过pinyin筛选的字段包括 , pinyin/currentName/userId
        
        +---------+
        |Requests:|
        +---------+
        
        :param pinyin: 员工名拼音
        :type pinyin: String
        
        Example::
        
            {
                "pinyin": "yuangong"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为员工编号 , 值为员工现用名
        :type autoFillKeyValue: List
        :param autoFillList: 员工现用名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "U001",
                        "value": "员工"
                    }
                ],
                "autoFillList": [
                    "员工"
                ],
                ...
            }
            
    .. method:: <I> queryUserByUids
    
        通过员工ID列表获取员工信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param uids[n]: 员工ID
        :type uids[n]: Integer
        
        Example::
        
            {
                "uids[0]": 1,
                "uids[1]": 2
            }

        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为员工编号 , 值为员工现用名
        :type autoFillKeyValue: List
        :param autoFillList: 员工现用名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "U001",
                        "value": "员工"
                    }
                ],
                "autoFillList": [
                    "员工"
                ],
                ...
            }
            
    .. method:: <C> addUser
    
        添加员工信息
        
        判断公司信息是否存在 , 不存在 , 错误信息 **230015 公司不存在**
        
        通过员工电话以及身份证信息判断是否存在 , 人员存在 , 错误信息 **190006 人员已存在**
        
        判断人员归属部门是否存在上级部门 , 不存在不可添加人员 , 错误信息 **310002 部门不可添加人员**
        
        如果部门是否定岗为1(定岗) , 同时定岗信息不存在 , 错误信息 **130050 定岗信息不存在**
        
        根据部门和职位判断定岗信息 , 人员数量达到定岗上限 , 错误信息 **190011 人员数量已达上限**
        
        添加人员默认角色信息是否存在 , 不存在 , 错误信息 **角色不存在**
        
        生成工作经历信息 , 类型为入职 , 同时记录公司 , 部门 , 职位
        
        +---------+
        |Requests:|
        +---------+
        
        :param userInfo.user.loginId: 登陆帐号
        :type userInfo.user.loginId: String
        :param userInfo.user.oldUserId: 旧员工编号
        :type userInfo.user.oldUserId: String
        :param userInfo.user.userName: 用户名
        :type userInfo.user.userName: String
        :param userInfo.user.currentName: 现用名
        :type userInfo.user.currentName: String
        :param userInfo.user.status: 状态
        :type userInfo.user.status: Short
        :param userInfo.user.identity: 身份证号
        :type userInfo.user.identity: String
        :param userInfo.user.phone: 手机号
        :type userInfo.user.phone: String
        
        :param userInfo.user.duty.did: 职位ID
        :type userInfo.user.duty.did: Long
        :param userInfo.user.role.rid: 角色ID
        :type userInfo.user.role.rid: Long
        :param userInfo.user.dept.did: 部门ID
        :type userInfo.user.dept.did: Long
        
        :param userInfo.gender: 性别
        :type userInfo.gender: Short
        :param userInfo.age: 年龄
        :type userInfo.age: Integer
        :param userInfo.birthday: 出生日期
        :type userInfo.birthday: Timestamp
        :param userInfo.height: 身高
        :type userInfo.height: Integer
        :param userInfo.weight: 体重
        :type userInfo.weight: Integer
        :param userInfo.political: 政治面貌
        :type userInfo.political: Short
        :param userInfo.nation: 民族
        :type userInfo.nation: String
        :param userInfo.hobby: 爱好/特长
        :type userInfo.hobby: String
        :param userInfo.qq: QQ
        :type userInfo.qq: String
        :param userInfo.wechat: 微信
        :type userInfo.wechat: String
        :param userInfo.email: 邮件
        :type userInfo.email: String
        
        :param userInfo.isMarried: 婚姻状况
        :type userInfo.isMarried: Short
        :param userInfo.isBirth: 生育状况
        :type userInfo.isBirth: Short
        :param userInfo.isHouseLoan: 是否有房贷
        :type userInfo.isHouseLoan: Short
        :param userInfo.isCarLoan: 是否有车贷
        :type userInfo.isCarLoan: Short
        :param userInfo.isCarID: 是否有驾照
        :type userInfo.isCarID: Short
        :param userInfo.isPassID: 是否有护照
        :type userInfo.isPassID: Short
        :param userInfo.isHMID: 是否有港澳通行证
        :type userInfo.isHMID: Short
        :param userInfo.isTWID: 是否有台湾通行证
        :type userInfo.isTWID: Short
        
        :param userInfo.householdType: 户籍类型
        :type userInfo.householdType: Short
        :param userInfo.hometownPlace: 户籍地
        :type userInfo.hometownPlace: String
        :param userInfo.hometownAddress: 户籍地址
        :type userInfo.hometownAddress: String
        :param userInfo.address: 现住址
        :type userInfo.address: String
        :param userInfo.claner: 直系亲属
        :type userInfo.claner: String
        :param userInfo.clanerCom: 直系亲属公司
        :type userInfo.clanerCom: String
        :param userInfo.emergencyMan: 紧急联系人
        :type userInfo.emergencyMan: String
        :param userInfo.emergencyPhone: 紧急联系人电话
        :type userInfo.emergencyPhone: String
        :param userInfo.fangliner.uid: 方林家属
        :type userInfo.fangliner.uid: Long
        
        :param userInfo.firstTime: 入司时间
        :type userInfo.firstTime: Timestamp
        :param userInfo.entryTime: 入职时间
        :type userInfo.entryTime: Timestamp
        :param userInfo.employWay: 招聘类型
        :type userInfo.employWay: Short
        :param userInfo.recommendMan: 推荐人
        :type userInfo.recommendMan: String
        :param userInfo.jobYears: 司龄
        :type userInfo.jobYears: Integer
        :param userInfo.employType: 招聘类型
        :type userInfo.employType: Short
        :param userInfo.employTime: 招聘时间
        :type userInfo.employTime: Timestamp
        :param userInfo.serviceYears: 服务年限
        :type userInfo.serviceYears: Integer
        
        :param userInfo.isPresentGraduate: 是否应届
        :type userInfo.isPresentGraduate: Short
        :param userInfo.graduateTime: 毕业时间
        :type userInfo.graduateTime: Timestamp
        :param userInfo.school: 毕业院校
        :type userInfo.school: String
        :param userInfo.education: 学历
        :type userInfo.education: Short
        :param userInfo.specialty: 专业
        :type userInfo.specialty: String
        
        :param userInfo.isContract: 是否签劳动合同
        :type userInfo.isContract: Short
        :param userInfo.signTime: 签合同日期
        :type userInfo.signTime: Timestamp
        :param userInfo.eignTime: 合同结束日期
        :type userInfo.eignTime: Timestamp
        :param userInfo.fignTime: 首次合同日期
        :type userInfo.fignTime: Timestamp
        :param userInfo.signNum: 续签合同次数
        :type userInfo.signNum: Integer
        :param userInfo.preformNum: 试用期限
        :type userInfo.preformNum: Integer
        :param userInfo.formTime: 转正日期
        :type userInfo.formTime: Timestamp
        
        :param userInfo.isInsurance: 是否上保险
        :type userInfo.isInsurance: Short
        :param userInfo.insuranceType: 保险类型
        :type userInfo.insuranceType: Short
        :param userInfo.insuranceTime: 参保日期
        :type userInfo.insuranceTime: Timestamp
        :param userInfo.pensionNum: 养老编号
        :type userInfo.pensionNum: String
        :param userInfo.medicalNum: 医疗编号
        :type userInfo.medicalNum: String
        :param userInfo.publicNum: 公积金号
        :type userInfo.publicNum: String
        
        :param userInfo.palary: 试用工资
        :type userInfo.palary: Integer
        :param userInfo.salary: 工资
        :type userInfo.salary: Integer
        :param userInfo.bank: 开户行
        :type userInfo.bank: String
        :param userInfo.bankCardNum: 银行卡号
        :type userInfo.bankCardNum: String
        
        :param userInfo.comment: 备注
        :type userInfo.comment: String
        
        :param userEducations: 教育信息列表 , 每条数据类型 `userEducation <./user.html#api.personel.UserOperationAction.userOperation>`__
        :type userEducations: List
        :param userContracts: 合同信息列表 , 每条数据类型 `userEducation <./user.html#api.personel.UserEducationAction.userEducation>`__
        :type userContracts: List
        :param userOperations: 公司信息列表 , 每条数据类型 `userOperation <./user.html#api.personel.UserOperationAction.userOperation>`__
        :type userOperations: List
        
        Example::
        
            {
                "userInfo.user.loginId": "yuangong",
                "userInfo.user.oldUserId": "U001",
                "userInfo.user.userName": "员工",
                "userInfo.user.currentName": "员工",
                "userInfo.user.status": 0,
                "userInfo.user.identity": "000000000000000000",
                "userInfo.user.phone": "13888888888",
                
                "userInfo.user.duty.did": 1,
                "userInfo.user.dept.did": 1,
                "userInfo.user.role.rid": 1,
                
                "userInfo.level": 0,
                
                "userInfo.gender": 1,
                "userInfo.age": 28,
                "userInfo.birthday": "2016-01-01",
                "userInfo.height": 180,
                "userInfo.weight": 60,
                "userInfo.political": 0,
                "userInfo.nation": "汉",
                "userInfo.hobby": "",
                "userInfo.qq": "",
                "userInfo.wechat": "",
                "userInfo.email": "",
                
                "userInfo.isMarried": 0,
                "userInfo.isBirth": 0,
                "userInfo.isHouseLoan": 0,
                "userInfo.isCarLoan": 0,
                "userInfo.isCarID": 0,
                "userInfo.isPassID": 0,
                "userInfo.isHMID": 0,
                "userInfo.isTWID": 0,
                
                "userInfo.householdType": 0,
                "userInfo.hometownPlace": "",
                "userInfo.hometownAddress": "",
                "userInfo.address": "",
                "userInfo.lover": "",
                "userInfo.claner": "直系亲属",
                "userInfo.clanerCom": "公司",
                "userInfo.emergencyMan": "紧急联系人",
                "userInfo.emergencyPhone": "电话",
                "userInfo.fangliner": null,
                
                "userInfo.firstTime": "2016-01-01",
                "userInfo.entryTime": "2016-01-01",
                "userInfo.employWay": 0,
                "userInfo.employType": 0,
                "userInfo.employTime": "2016-01-01",
                "userInfo.recommendMan": "推荐人",
                "userInfo.jobYears": 0,
                "userInfo.serviceYears": 0,
                
                "userInfo.isPresentGraduate": 0,
                "userInfo.graduateTime": "2016-01-01",
                "userInfo.school": "",
                "userInfo.education": 0,
                "userInfo.specialty": "",
                
                "userInfo.isContract": 0,
                "userInfo.signTime": "2016-01-01",
                "userInfo.eignTime": "2016-01-01",
                "userInfo.fignTime": "2016-01-01",
                "userInfo.signNum": 0,
                "userInfo.preformNum": 90,
                "userInfo.formTime": "2016-01-01",
                
                "userInfo.isInsurance": 0,
                "userInfo.insuranceType": 0,
                "userInfo.insuranceTime": "2016-01-01",
                "userInfo.pensionNum": "",
                "userInfo.medicalNum": "",
                "userInfo.publicNum": "",
                
                "userInfo.palary": 0,
                "userInfo.salary": 0,
                "userInfo.bank": "",
                "userInfo.bankCardNum": "",
                
                "userInfo.comment": ""
                
            }
            
    .. method:: <C> updateUser
    
        更新员工信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        判断人员归属部门是否存在上级部门 , 不存在不可添加人员 , 错误信息 **310002 部门不可添加人员**
        
        生成工作经历信息 , 根据员工状态类型为调职/入职/离职 , 同时记录原部 , 现部 , 原职 , 现职
        
        +---------+
        |Requests:|
        +---------+
        
        :param userInfo.user.uid: 人员ID
        :type userInfo.user.uid: Long
        :param userInfo.user.oldUserId: 旧员工编号
        :type userInfo.user.oldUserId: String
        :param userInfo.user.currentName: 现用名
        :type userInfo.user.currentName: String
        :param userInfo.user.status: 状态
        :type userInfo.user.status: Short
        :param userInfo.user.identity: 身份证号
        :type userInfo.user.identity: String
        :param userInfo.user.phone: 手机号
        :type userInfo.user.phone: String
        
        :param userInfo.user.duty.did: 职位ID
        :type userInfo.user.duty.did: Long
        :param userInfo.user.role.rid: 角色ID
        :type userInfo.user.role.rid: Long
        :param userInfo.user.dept.did: 部门ID
        :type userInfo.user.dept.did: Long
        
        :param userInfo.gender: 性别
        :type userInfo.gender: Short
        :param userInfo.age: 年龄
        :type userInfo.age: Integer
        :param userInfo.birthday: 出生日期
        :type userInfo.birthday: Timestamp
        :param userInfo.height: 身高
        :type userInfo.height: Integer
        :param userInfo.weight: 体重
        :type userInfo.weight: Integer
        :param userInfo.political: 政治面貌
        :type userInfo.political: Short
        :param userInfo.nation: 民族
        :type userInfo.nation: String
        :param userInfo.hobby: 爱好/特长
        :type userInfo.hobby: String
        :param userInfo.qq: QQ
        :type userInfo.qq: String
        :param userInfo.wechat: 微信
        :type userInfo.wechat: String
        :param userInfo.email: 邮件
        :type userInfo.email: String
        
        :param userInfo.isMarried: 婚姻状况
        :type userInfo.isMarried: Short
        :param userInfo.isBirth: 生育状况
        :type userInfo.isBirth: Short
        :param userInfo.isHouseLoan: 是否有房贷
        :type userInfo.isHouseLoan: Short
        :param userInfo.isCarLoan: 是否有车贷
        :type userInfo.isCarLoan: Short
        :param userInfo.isCarID: 是否有驾照
        :type userInfo.isCarID: Short
        :param userInfo.isPassID: 是否有护照
        :type userInfo.isPassID: Short
        :param userInfo.isHMID: 是否有港澳通行证
        :type userInfo.isHMID: Short
        :param userInfo.isTWID: 是否有台湾通行证
        :type userInfo.isTWID: Short
        
        :param userInfo.householdType: 户籍类型
        :type userInfo.householdType: Short
        :param userInfo.hometownPlace: 户籍地址
        :type userInfo.hometownPlace: String
        :param userInfo.hometownAddress: 户籍地址
        :type userInfo.hometownAddress: String
        :param userInfo.address: 现住址
        :type userInfo.address: String
        :param userInfo.claner: 直系亲属
        :type userInfo.claner: String
        :param userInfo.clanerCom: 直系亲属公司
        :type userInfo.clanerCom: String
        :param userInfo.emergencyMan: 紧急联系人
        :type userInfo.emergencyMan: String
        :param userInfo.emergencyPhone: 紧急联系人电话
        :type userInfo.emergencyPhone: String
        :param userInfo.fangliner.uid: 方林家属
        :type userInfo.fangliner.uid: Long
        
        :param userInfo.firstTime: 入司时间
        :type userInfo.firstTime: Timestamp
        :param userInfo.entryTime: 入职时间
        :type userInfo.entryTime: Timestamp
        :param userInfo.employWay: 招聘类型
        :type userInfo.employWay: Short
        :param userInfo.recommendMan: 推荐人
        :type userInfo.recommendMan: String
        :param userInfo.jobYears: 司龄
        :type userInfo.jobYears: Integer
        :param userInfo.employType: 招聘类型
        :type userInfo.employType: Short
        :param userInfo.employTime: 招聘时间
        :type userInfo.employTime: Timestamp
        :param userInfo.serviceYears: 服务年限
        :type userInfo.serviceYears: Integer
        
        :param userInfo.isPresentGraduate: 是否应届
        :type userInfo.isPresentGraduate: Short
        :param userInfo.graduateTime: 毕业时间
        :type userInfo.graduateTime: Timestamp
        :param userInfo.school: 毕业院校
        :type userInfo.school: String
        :param userInfo.education: 学历
        :type userInfo.education: Short
        :param userInfo.specialty: 专业
        :type userInfo.specialty: String
        
        :param userInfo.isContract: 是否签劳动合同
        :type userInfo.isContract: Short
        :param userInfo.signTime: 签合同日期
        :type userInfo.signTime: Timestamp
        :param userInfo.eignTime: 合同结束日期
        :type userInfo.eignTime: Timestamp
        :param userInfo.fignTime: 首次合同日期
        :type userInfo.fignTime: Timestamp
        :param userInfo.signNum: 续签合同次数
        :type userInfo.signNum: Integer
        :param userInfo.preformNum: 试用期限
        :type userInfo.preformNum: Integer
        :param userInfo.formTime: 转正日期
        :type userInfo.formTime: Timestamp
        
        :param userInfo.isInsurance: 是否上保险
        :type userInfo.isInsurance: Short
        :param userInfo.insuranceType: 保险类型
        :type userInfo.insuranceType: Short
        :param userInfo.insuranceTime: 参保日期
        :type userInfo.insuranceTime: Timestamp
        :param userInfo.pensionNum: 养老编号
        :type userInfo.pensionNum: String
        :param userInfo.medicalNum: 医疗编号
        :type userInfo.medicalNum: String
        :param userInfo.publicNum: 公积金号
        :type userInfo.publicNum: String
        
        :param userInfo.palary: 试用工资
        :type userInfo.palary: Integer
        :param userInfo.salary: 工资
        :type userInfo.salary: Integer
        :param userInfo.bank: 开户行
        :type userInfo.bank: String
        :param userInfo.bankCardNum: 银行卡号
        :type userInfo.bankCardNum: String
        
        :param userInfo.comment: 备注
        :type userInfo.comment: String
        
        Example::
        
            {
            
                "userInfo.user.uid": 1,
                "userInfo.user.oldUserId": "U001",
                "userInfo.user.currentName": "员工",
                "userInfo.user.status": 0,
                "userInfo.user.identity": "000000000000000000",
                "userInfo.user.phone": "13888888888",
                
                "userInfo.user.duty.did": 1,
                "userInfo.user.dept.did": 1,
                "userInfo.user.role.rid": 1,
                
                "userInfo.level": 0,
                
                "userInfo.gender": 1,
                "userInfo.age": 28,
                "userInfo.birthday": "2016-01-01",
                "userInfo.height": 180,
                "userInfo.weight": 60,
                "userInfo.political": 0,
                "userInfo.nation": "汉",
                "userInfo.hobby": "",
                "userInfo.qq": "",
                "userInfo.wechat": "",
                "userInfo.email": "",
                
                "userInfo.isMarried": 0,
                "userInfo.isBirth": 0,
                "userInfo.isHouseLoan": 0,
                "userInfo.isCarLoan": 0,
                "userInfo.isCarID": 0,
                "userInfo.isPassID": 0,
                "userInfo.isHMID": 0,
                "userInfo.isTWID": 0,
                
                "userInfo.householdType": 0,
                "userInfo.hometownPlace": "",
                "userInfo.hometownAddress": "",
                "userInfo.address": "",
                "userInfo.lover": "",
                "userInfo.claner": "直系亲属",
                "userInfo.clanerCom": "公司",
                "userInfo.emergencyMan": "紧急联系人",
                "userInfo.emergencyPhone": "电话",
                "userInfo.fangliner": null,
                
                "userInfo.firstTime": "2016-01-01",
                "userInfo.entryTime": "2016-01-01",
                "userInfo.employWay": 0,
                "userInfo.employType": 0,
                "userInfo.employTime": "2016-01-01",
                "userInfo.recommendMan": "推荐人",
                "userInfo.jobYears": 0,
                "userInfo.serviceYears": 0,
                
                "userInfo.isPresentGraduate": 0,
                "userInfo.graduateTime": "2016-01-01",
                "userInfo.school": "",
                "userInfo.education": 0,
                "userInfo.specialty": "",
                
                "userInfo.isContract": 0,
                "userInfo.signTime": "2016-01-01",
                "userInfo.eignTime": "2016-01-01",
                "userInfo.fignTime": "2016-01-01",
                "userInfo.signNum": 0,
                "userInfo.preformNum": 90,
                "userInfo.formTime": "2016-01-01",
                
                "userInfo.isInsurance": 0,
                "userInfo.insuranceType": 0,
                "userInfo.insuranceTime": "2016-01-01",
                "userInfo.pensionNum": "",
                "userInfo.medicalNum": "",
                "userInfo.publicNum": "",
                
                "userInfo.palary": 0,
                "userInfo.salary": 0,
                "userInfo.bank": "",
                "userInfo.bankCardNum": "",
                
                "userInfo.comment": ""
                
                "userInfo.user.userId": "U001",
                "userInfo.user.oldUserId": "U001",
                "userInfo.user.userName": "员工",
                "userInfo.user.currentName": "员工",
                "userInfo.user.userNamePinYin": "[yuangong]",
                "userInfo.user.status": "在职",
                "userInfo.user.birthday": "2016-06-01",
                "userInfo.user.deptType": "职能部",
                "userInfo.user.duty.did": 1,
                "userInfo.user.gender": "男",
                "userInfo.user.identity": "000000000000000000",
                "userInfo.user.dept.no": "D001",
                "userInfo.user.role.no": "R001",
                
                "userInfo.address": "",
                "userInfo.age": 28,
                "userInfo.bank": "bank",
                "userInfo.bankCardNum": "0000000000000000",
                "userInfo.education": "",
                "userInfo.email": "",
                "userInfo.emergencyMan": "员工",
                "userInfo.emergencyPhone": "138xxxx3874",
                "userInfo.employTime": "2016-06-01",
                "userInfo.employType": "正式",
                "userInfo.employWay": "员工推荐",
                "userInfo.entryTime": "2016-06-01",
                "userInfo.extranet": 0,
                "userInfo.graduateTime": "2016-06-01",
                "userInfo.hometownPlace": "",
                "userInfo.hometownAddress": "",
                "userInfo.houseType": "",
                "userInfo.householdType": "城市户口",
                "userInfo.insuranceTime": "2015-01-01",
                "userInfo.isBirth": "是",
                "userInfo.isCarLoan": "否",
                "userInfo.isContract": "是",
                "userInfo.isHouseLoan": "是",
                "userInfo.isInsurance": "是",
                "userInfo.isLogin": 3,
                "userInfo.isMarried": "是",
                "userInfo.isPresentGraduate": "否",
                "userInfo.jobYears": 0,
                "userInfo.lover": "员工",
                "userInfo.medicalNum": "",
                "userInfo.pensionNum": "",
                "userInfo.phone": "138xxxx3874",
                "userInfo.political": "群众",
                "userInfo.qq": "",
                "userInfo.recommendMan": "员工",
                "userInfo.salary": 1000,
                "userInfo.school": "",
                "userInfo.serviceYears": 0,
                "userInfo.specialty": "",
                "userInfo.statusUpdateTime": "2016-01-01 00:00:00",
                "userInfo.wechat": ""
            }
            
    .. method:: <C> updateUserForBaseInfo
    
        更新员工基本信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        更新信息范围 , 年龄/QQ/微信号/邮箱/紧急联系人/紧急联系人电话/用户图片
        
        +---------+
        |Requests:|
        +---------+
        
        :param userInfo.user.uid: 员工ID
        :type userInfo.user.uid: String
        :param userInfo.user.phone: 手机号
        :type userInfo.user.phone: String
        :param userInfo.qq: QQ
        :type userInfo.qq: String
        :param userInfo.wechat: 微信
        :type userInfo.wechat: String
        :param userInfo.email: 邮箱
        :type userInfo.email: String
        :param userInfo.emergencyMan: 紧急联系人
        :type userInfo.emergencyMan: String
        :param userInfo.emergencyPhone: 紧急联系人电话
        :type userInfo.emergencyPhone: String
        :param userInfo.user.userPhoto: 用户图片
        :type userInfo.user.userPhoto: String
        
        Example::
        
            {
                "userInfo.user.userId": "U001",
                "userInfo.user.phone": "138xxxx3874",
                "userInfo.qq": "",
                "userInfo.wechat": "",
                "userInfo.email": "",
                "userInfo.emergencyMan": "员工",
                "userInfo.emergencyPhone": "",
                "userInfo.user.userPhoto": ""
            }
            
    .. method:: <C> updateUserForAdvance
    
        更新用户高级信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**
        
        生成工作经历信息 , 类型为调公司 , 记录信息为原公司 , 现公司
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        :param user.isLogin: 是否允许登陆 , 0: 不能登陆 , 1: 允许登陆
        :type user.isLogin: Short
        :param user.company: 公司代码
        :type user.company: Short
        :param user.extranet: 外网权限
        :type user.extranet: Short
        :param user.role.no: 角色编号
        :type user.role.no: String
        
        Example::
        
            {
                "user.userId": "U001",
                "user.isLogin": 0,
                "user.company": 45854521,
                "user.extranet": 0,
                "user.role.no": "R001"
            }

    .. method:: <C> updateUserForProfile
    
        更新用户简介信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
    
    .. method:: <C> updateUserForPhoto
    
        更新用户图片信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        :param user.photo: 头像
        :type user.photo: String
        :param user.identityPathF: 身份证正面照
        :type user.identityPathF: String
        :param user.identityPathB: 身份证背面照
        :type user.identityPathB: String
        
        Example::
        
            {
                "user.userId": "U001",
                "user.photo": "",
                "user.userId": "",
                "user.userId": "",
            }

    .. method:: <C> quitUser
    
        离职
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }

    .. method:: <C> tranUser
    
        调职
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        :param user.dept.did: 员工编号
        :type user.dept.did: Long
        :param user.company: 公司
        :type user.company: Integer
        
        Example::
        
            {
                "user.userId": "U001"
                "user.dept.did": 1
                "user.company": 1
            }
            
    .. method:: <C> defaultPassword
    
        重置密码
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        利用系统配置中的默认密码更新人员的密码信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
            
    .. method:: <C> resetPassword
    
        重置密码
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        随机生成密码更新人员的密码信息 , 同时进行通知
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
            
    .. method:: <C> changePassword
     
        修改密码
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        验证原密码 , 更新新密码
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.userId: 员工编号
        :type user.userId: String
        :param user.password: 原密码
        :type user.password: String
        :param user.rePassword: 新密码
        :type user.rePassword: String
        
        Example::
        
            {
                "user.userId": "U001"
                "user.password": "password",
                "user.rePassword": "rePassword"
            }

    .. method:: <C> registUser
    
        注册
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 人员ID
        :type user.uid: Long
        
        Example::
        
            {
                "user.uid": 1
            }
    
    .. method:: <C> resetUser
    
        重置
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 人员ID
        :type user.uid: Long
        
        Example::
        
            {
                "user.uid": 1
            }
    
    .. method:: <C> authUser
    
        认证
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 人员ID
        :type user.uid: Long
        
        Example::
        
            {
                "user.uid": 1
            }
    
    .. method:: <C> confirmUser
    
        确认
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 人员ID
        :type user.uid: Long
        
        Example::
        
            {
                "user.uid": 1
            }
    
    .. method:: <C> signateUser
    
        签名
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 人员ID
        :type user.uid: Long
        
        Example::
        
            {
                "user.uid": 1
            }

合同
----------------

员工合同信息管理

.. class:: api.personel.UserContractAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userContract
    
    :param ucid: 合同ID
    :type ucid: Long
    :param uid: 员工ID
    :type uid: Long
    
    :param no: 合同编号
    :type no: String
    :param name: 名称
    :type name: String
    :param title: 标题
    :type title: 标题
    :param signTime: 签订时间
    :type signTime: Timestamp
    :param startTime: 开始时间
    :type startTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    
    :param download: 下载地址
    :type download: String
    :param viewpdf: 查看地址
    :type viewpdf: String
    :param filesize: 文件大小
    :type filesize: Integer
    
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param signner: 签署人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type signner: Object
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param comsignTime: 公司签时间
    :type comsignTime: Timestamp
    :param cussignTime: 客户签时间
    :type cussignTime: Timestamp
    
    :param status: 状态 , 0: 初始 , 1: 无效 , 2: 已签 , 3: 归档 , 4: 归档(本地)
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> queryUserContract
    
        获取人员合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.uid: 人员ID
        :type userContract.uid: Long
        
        Example::
        
            {
                "userContract.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userContracts: 员工合同列表 , 每条数据类型 :data:`userContract`
        :type userContracts: List
        
        Example::
        
            {
                ...
                "userContracts": [
                    {
                        "ucid": 0,
                        "uid": 1,
                        "no": "ESCASD",
                        "name": "合同名称",
                        "title": "合同标题"
                        "signTime": "2016-01-01 00:00:00",
                        "startTime": "2016-01-01 00:00:00",
                        "endTime": "2016-01-01 00:00:00",
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
                        "comment": "说明"
                    }
                ],
                ...
            }

    .. method:: <I> sendUserContractForAuth
    
        发送认证通知
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
    
    
        Example::
        
            {
                "userContract.ucid": 1
            }

    .. method:: <I> sendUserContract
    
        发送合同通知
        
        通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        :param userContract.type: 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载
        :type userContract.type: Short
        
        Example::
        
            {
                "userContract.ucid": 1,
                "userContract.type": 1
            }

    .. method:: <I> redirectUserContract
    
        跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址
        
        类型包括1(签章)/2(签订)/3(查看)/4(下载)
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    .. method:: <I> viewUserContract
    
        查看合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }
            
    .. method:: <I> signUserContractForCompany
    
        签订合同 , 针对公司信息
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        :param signet.signno: 签章编号
        :type signet.signno: String
        :param signet.keyword: 关键字
        :type signet.keyword: String
        :param signet.signid: 印章ID
        :type signet.signid: Long
        
        Example::
        
            {
                "userContract.ucid": 1,
                "signet.signno": "IN31HJOS",
                "signet.keyword": "关键字",
                "signet.signid": 1
            }
            
    .. method:: <I> signUserContractForUser
    
        签订合同 , 针对员工信息
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=sign",
                ...
            }

    .. method:: <C> addUserContract
    
        添加用户合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.uid: 人员ID
        :type userContract.uid: Long
        
        :param userContract.no: 编号
        :type userContract.no: String
        :param userContract.name: 名称
        :type userContract.name: String
        :param userContract.signTime: 签订时间
        :type userContract.signTime: Timestamp
        :param userContract.beginTime: 开始时间
        :type userContract.beginTime: Timestamp
        :param userContract.endTime: 结束时间
        :type userContract.endTime: Timestamp
        :param userContract.comment: 说明
        :type userContract.comment: String
        
        :param contract.cid: 合同ID
        :type contract.cid: Long
        :param contract.no: 合同编号
        :type contract.no: String
        :param contract.name: 名称
        :type contract.name: String
        :param contract.title: 标题
        :type contract.title: String
        
        Example::
        
            {
                "userContract.uid": 1,
                "userContract.no": "ESAEASDF",
                "userContract.name": "合同名称",
                "userContract.signTime": "2016-01-01 00:00:00",
                "userContract.beginTime": "2016-01-01 00:00:00",
                "userContract.endTime": "2016-01-01 00:00:00",
                "userContract.comment": "",
                
                "contract.cid": 1,
                "contract.no": "74HENIDH121H",
                "contract.name": "合同模版",
                "contract.title": "合同标题",
            }
            
    .. method:: <C> updateUserContract
    
        更新用户合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        :param userContract.comment: 说明
        :type userContract.comment: String
        
        Example::
        
            {
                "userContract.ucid": 1,
                "userContract.comment": ""
            }

    .. method:: <I> affixUserContract
    
        签订合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        更新装修合同为1(已签)
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }

    .. method:: <I> expireUserContract
    
        失效合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        更新装修合同为1(失效)
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }

            
    .. method:: <I> filingUserContract
    
        归档合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为2(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        更新装修合同为3(归档)
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid": 1
            }
            
    .. method:: <C> deleteUserContract
    
        删除合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userContract.ucid: 合同ID
        :type userContract.ucid: Long
        
        Example::
        
            {
                "userContract.ucid: 1
            }
            
经历
----------------

员工工作经历信息管理

.. class:: api.personel.UserExperienceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userExperience
    
    :param upid: 工作经历ID
    :type upid: Long
    :param uid: 用户编号
    :type uid: Integer
    :param type: 类型 , 包括: 调职 , 入职 , 离职
    :type type: String
    :param operator: 操作人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type operator: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param operateTime: 操作时间
    :type operateTime: Timestamp
    :param comment: 描述
    :type comment: String

    .. method:: <I> queryUserExperienceByUid
    
        通过员工ID获取员工工经历
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param userExperience.uid: 员工ID
        :type userExperience.uid: Integer
        
        Example::
        
            {
                "userExperience.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userExperiences: 员工经历列表 , 每条数据类型 :data:`userExperience`
        :type userExperiences: List
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "upid": 1,
                        "uid": 1,
                        "type": "调职",
                        "operator": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "operateTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> updateUserExperience
    
        更新工作经历信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userExperience.ueid: 工作经历ID
        :type userExperience.ueid: Long
        :param userExperience.operateTime: 操作时间
        :type userExperience.operateTime: Long
        
        Example::
        
            {
                "userExperience.ueid": 1,
                "userExperience.operateTime": "2016-01-01 00:00:00"
            }

工作
----------------

员工工作信息管理

.. class:: api.personel.UserOperationAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userOperation
    
    :param uoid: 工作ID
    :type uoid: Long
    :param uid: 用户ID
    :type uid: Long
    :param company: 公司
    :type company: String
    :param trade: 行业
    :type trade: String
    :param duty: 职位
    :type duty: String
    :param beginTime: 开始时间
    :type beginTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    :param salary: 薪资
    :type salary: Long
    :param createTime: 创建时间
    :type createTime: String
    :param comment: 描述
    :type comment: String
    
    .. method:: <I> queryUserOperation
    
        获取人员工作
        
        +---------+
        |Requests:|
        +---------+
        
        :param userOperation.uid: 人员ID
        :type userOperation.uid: Long
        
        Example::
        
            {
                "userOperation.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userOperations: 工作信息列表 , 每条数据类型 :data:`userOperation`
        :type userOperations: List
        
        Example::
        
            {
                ...
                "userOperations": [
                    {
                        "uoid": 1,
                        "uid": 1,
                        "company": "公司名称",
                        "trade": "公司行业",
                        "duty": "职位",
                        "beginTime": "2016-01-01 00:00:00",
                        "endTime": "2016-01-01 00:00:00",
                        "salary": 0,
                        "createTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <C> addUserOperation
    
        添加人员工作
        
        +---------+
        |Requests:|
        +---------+
        
        :param userOperation.uid: 人员ID
        :type userOperation.uid: Long
        :param userOperation.company: 公司
        :type userOperation.company: String
        :param userOperation.trade: 行业
        :type userOperation.trade: String
        :param userOperation.duty: 职位
        :type userOperation.duty: String
        :param userOperation.beginTime: 开始时间
        :type userOperation.beginTime: Timestamp
        :param userOperation.endTime: 公司
        :type userOperation.endTime: Timestamp
        :param userOperation.salary: 薪资
        :type userOperation.salary: Long
        :param userOperation.comment: 说明
        :type userOperation.comment: String
        
        Example::
        
            {
                "userOperation.uid": 1,
                "userOperation.company": "公司名称",
                "userOperation.trade": "公司行业",
                "userOperation.duty": "职位",
                "userOperation.beginTime": "2016-01-01 00:00:00",
                "userOperation.endTime": "2016-01-01 00:00:00",
                "userOperation.salary": 0,
                "userOperation.comment": ""
            }
            
    .. method:: <C> updateUserOperation
    
        添加人员工作
        
        +---------+
        |Requests:|
        +---------+
        
        :param userOperation.uoid: 工作ID
        :type userOperation.uoid: Long
        :param userOperation.company: 公司
        :type userOperation.company: String
        :param userOperation.trade: 行业
        :type userOperation.trade: String
        :param userOperation.duty: 职位
        :type userOperation.duty: String
        :param userOperation.beginTime: 开始时间
        :type userOperation.beginTime: Timestamp
        :param userOperation.endTime: 公司
        :type userOperation.endTime: Timestamp
        :param userOperation.salary: 薪资
        :type userOperation.salary: Long
        :param userOperation.comment: 说明
        :type userOperation.comment: String
        
        Example::
        
            {
                "userOperation.uoid": 1,
                "userOperation.company": "公司名称",
                "userOperation.trade": "公司行业",
                "userOperation.duty": "职位",
                "userOperation.beginTime": "2016-01-01 00:00:00",
                "userOperation.endTime": "2016-01-01 00:00:00",
                "userOperation.salary": 0,
                "userOperation.comment": ""
            }
            
    .. method:: <C> deleteUserOperation
    
        删除人员工作
        
        +---------+
        |Requests:|
        +---------+
        
        :param userOperation.uoid: 工作ID
        :type userOperation.uoid: Long
        
        Example::
        
            {
                "userOperation.uoid": 1
            }
            
教育
----------------

.. class:: api.personel.UserEducationAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userEducation
    
    :param ueid: 教育ID
    :type ueid: Long
    :param uid: 人员ID
    :type uid: Long
    :param organ: 机构
    :type organ: String
    :param certificate: 证书
    :type certificate: String
    :param beginTime: 开始时间
    :type beginTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    :param createTime: 创建时间
    :type createTime: String
    :param specialty: 专业
    :type specialty: String
    :param content: 内容
    :type content: String
    
    .. method:: <I> queryUserEducation
    
        获取人员教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userEducation.uid: 人员ID
        :type userEducation.uid: Long
        
        Example::
        
            {
                "userEducation.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userEducations: 教育信息列表 , 每条数据类型 :data:`userEducation`
        :type userEducations: List
        
        Example::
        
            {
                ...
                "userEducations": [
                    {
                        "ueid": 1,
                        "uid": 1,
                        "organ": "机构名称",
                        "certificate": "证书",
                        "beginTime": "2016-01-01 00:00:00",
                        "endTime": "2016-01-01 00:00:00",
                        "createTime": "2016-01-01 00:00:00",
                        "specialty": "专业",
                        "content": ""
                    }
                ],
                ...
            }
            
    .. method:: <C> addUserEducation
    
        添加人员教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userEducation.uid: 人员ID
        :type userEducation.uid: Long
        :param userEducation.organ: 机构
        :type userEducation.organ: String
        :param userEducation.certificate: 证书
        :type userEducation.certificate: String
        :param userEducation.beginTime: 开始时间
        :type userEducation.beginTime: Timestamp
        :param userEducation.endTime: 公司
        :type userEducation.endTime: Timestamp
        :param userEducation.specialty: 专业
        :type userEducation.specialty: String
        :param userEducation.content: 内容
        :type userEducation.content: String
        
        Example::
        
            {
                "userEducation.uid": 1,
                "userEducation.organ": "机构名称",
                "userEducation.certificate": "证书",
                "userEducation.beginTime": "2016-01-01 00:00:00",
                "userEducation.endTime": "2016-01-01 00:00:00",
                "userEducation.specialty": "专业",
                "userEducation.content": ""
            }
            
    .. method:: <C> updateUserEducation
    
        更新人员教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userEducation.ueid: 教育ID
        :type userEducation.ueid: Long
        :param userEducation.organ: 机构
        :type userEducation.organ: String
        :param userEducation.certificate: 证书
        :type userEducation.certificate: String
        :param userEducation.beginTime: 开始时间
        :type userEducation.beginTime: Timestamp
        :param userEducation.endTime: 公司
        :type userEducation.endTime: Timestamp
        :param userEducation.specialty: 专业
        :type userEducation.specialty: String
        :param userEducation.content: 内容
        :type userEducation.content: String
        
        Example::
        
            {
                "userEducation.ueid": 1,
                "userEducation.organ": "机构名称",
                "userEducation.certificate": "证书",
                "userEducation.beginTime": "2016-01-01 00:00:00",
                "userEducation.endTime": "2016-01-01 00:00:00",
                "userEducation.specialty": "专业",
                "userEducation.content": ""
            }
            
    .. method:: <C> deleteUserEducation
    
        更新人员教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param userEducation.ueid: 教育ID
        :type userEducation.ueid: Long
        
        Example::
        
            {
                "userEducation.ueid": 1
            }

公司
----------------

人员对应可操作公司权限

.. class:: api.personel.UserCompanyAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userCompany
    
    :param ucid: ID
    :type ucid: Integer
    :param uid: 员工ID
    :type uid: Integer
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    
    :param company: 公司 , 类型 `company <./system.html#api.system.CompanyAction.company>`_
    :type company: Object
    
    .. method:: <I> queryUserCompany
    
        通过员工ID获取对应操作公司信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 员工ID
        :type user.uid: Integer
        
        Example::
        
            {
                "user.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userCompanys: 员工-公司信息列表 , 每条数据类型 :data:`userCompany`
        :type userCompanys: List
        
        Example::
        
            {
                ...
                "userCompanys": [
                    {
                        "ucid": 1,
                        "uid": 1,
                        "company": {
                            "cid": "LAKDSAUFEJNSDAIDUF",
                            "name": "公司"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                    }
                ],
                ...
            }

    .. method:: <I> queryUserCompanyForSelf
    
        获取当前操作人员公司信息
            
        +--------+
        |Returns:|
        +--------+
        
        :param userCompanys: 员工-公司信息列表 , 每条数据类型 :data:`userCompany`
        :type userCompanys: List
        
        Example::
        
            {
                ...
                "userCompanys": [
                    {
                        "ucid": 1,
                        "uid": 1,
                        "company": {
                            "cid": "LAKDSAUFEJNSDAIDUF",
                            "name": "公司"
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                    }
                ],
                ...
            }
            
    .. method:: <C> updateUserCompany
    
        更新人员-公司信息
        
        删除原有人员-公司信息 , 更新新配置人员-公司信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 员工ID
        :type user.uid: Integer
        :param cids[n]: 公司ID列表 , 每条数据类型 String
        :type cids[n]: List
        
        Example::
        
            {
                "user.uid": 1,
                "cids[0]": "LAKDSAUFEJNSDAIDUF"
            }

角色
----------------

.. class:: api.personel.UserCompanyAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userRole
    
    :param urid: ID
    :type urid: Long
    :param uid: 员工ID
    :type uid: Integer
    :param role: 角色 , 类型 `role <./system.html#api.system.RoleAction.role>`__
    :type role: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    
    .. method:: <I> queryUserRole
    
        通过员工ID获取对应角色信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 员工ID
        :type user.uid: Integer
        
        Example::
        
            {
                "user.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param userRoles: 角色信息列表 , 每条数据类型 :data:`userRole`
        :type userRoles: List
        
        Example::
        
            {
                ...
                "userRoles": [
                    {
                        "urid": 1,
                        "uid": 1,
                        "role": {
                            "rid": "1",
                            "name": "角色",
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                    }
                ],
                ...
            }
            
    .. method:: <C> updateUserRole
    
        更新人员-角色信息
        
        删除原有人员-公司信息 , 更新新配置人员-公司信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param user.uid: 员工ID
        :type user.uid: Integer
        :param rids[n]: 角色ID列表 , 每条数据类型 Integer
        :type rids[n]: List
        
        Example::
        
            {
                "user.uid": 1,
                "rids[0]": 1
            }

招聘
================

招聘
----------------

.. class:: api.personel.RecruitmentAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: recruitment
    
    :param rid: 招聘ID
    :type rid: Long
    :param name: 姓名
    :type name: String
    :param identity: 身份证号
    :type identity: String
    :param nation: 民族
    :type nation: String
    :param place: 地址
    :type place: String
    
    :param photoPath: 照片
    :type photoPath: String
    :param identityPathF: 身份证正面
    :type identityPathF: String
    :param identityPathB: 身份证背面
    :type identityPathB: String
    
    :param weight: 体重
    :type weight: Integer
    :param height: 身高
    :type height: Integer
    
    :param employWay: 应聘方式 , 0: 校园招聘 , 1: 网络招聘 , 2: 内部推荐 , 3: 主动应聘 , 4: 猎头
    :type employWay: Short
    :param householdType: 户口类型 , 0: 农村 , 1: 城镇
    :type householdType: Short
    :param political: 政治面貌 , 0: 群众 , 1: 团员 , 2: 党员
    :type political: Short
    :param education: 学历 , 0: 小学及以下 , 1: 初中 , 2: 中专 , 3: 高中 , 4: 大专 , 5: 本科 , 6: 研究生及以上
    :type education: Short
    
    :param phone: 电话
    :type phone: String
    :param wechat: 微信号
    :type wechat: String
    :param qq: QQ号
    :type qq: String
    
    :param address: 现住址
    :type address: String
    :param nativePlace: 籍贯
    :type nativePlace: String
    :param hometownPlace: 户籍地
    :type hometownPlace: String
    :param specialty: 专业
    :type specialty: String
    
    :param emergencyMan: 紧急联系人
    :type emergencyMan: String
    :param emergencyPhone: 紧急联系人电话
    :type emergencyPhone: String
    
    :param isMarried: 婚姻状况 , 0: 已婚 , 1: 未婚
    :type isMarried: Short
    :param isBirth: 生育状况 , 0: 已育 , 1: 未育
    :type isBirth: Short
    :param isHouse: 是否有独立住房 , 0: 有 , 1: 无
    :type isHouse: Short
    :param isCar: 是否有独立车辆 , 0: 有 , 1: 无
    :type isCar: Short
    :param isHouseLoan: 是否有房贷 , 0: 有 , 1: 无
    :type isHouseLoan: Short
    :param isCarLoan: 是否有车贷 , 0: 有 , 1: 无
    :type isCarLoan: Short
    :param isCarID: 是否有驾照 , 0: 有 , 1: 无
    :type isCarID: Short
    :param isPassID: 是否有护照 , 0: 有 , 1: 无
    :type isPassID: Short
    :param isHMID: 是否有港澳通行证 , 0: 有 , 1: 无
    :type isHMID: Short
    :param isTWID: 是否有台湾通行证 , 0: 有 , 1: 无
    :type isTWID: Short
    
    :param isContract: 是否与原单位签订劳动合同 , 0: 是 , 1: 否
    :type isContract: Short
    :param isSnsurance: 是否已缴纳社会保险 , 0: 是 , 1: 否
    :type isSnsurance: Short
    :param isFire: 是否已经与其它单位解除了劳动关系 , 0: 是 , 1: 否
    :type isFire: Short
    :param isCnsurance: 是否缴纳其他商业保险 , 0: 是 , 1: 否
    :type isCnsurance: Short
    :param isCompete: 现在是否还在竟业限制期内 , 0: 是 , 1: 否
    :type isCompete: Short
    :param isTrain: 公司提供培训机会时，是否同意并签订协议 , 0: 是 , 1: 否
    :type isTrain: Short
    :param isCriminal: 是否曾有前科劣迹、行政/邢事拘留等经历 , 0: 是 , 1: 否
    :type isCriminal: Short
    :param isDisease: 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史 , 0: 是 , 1: 否
    :type isDisease: Short
    
    :param status: 状态 , 0: 初始 , 1: 入职 , 2: 作废
    :type status: Short
    
    .. method:: <I> pageRecruitment
    
        分页方式获取招聘信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 招聘信息列表 , 每条数据类型 :data:`recruitment`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "rid": 1,
                            "name": "员工",
                            "identity": "000000000000000000",
                            "phone": "138xxxx3874",
                            "nation": "汉",
                            "place": "地址",
                            
                            "height": 180,
                            "weight": 60,
                            
                            "qq": "",
                            "wechat": "",
                            "email": "",
                            
                            "employWay": 0,
                            "political": 0,
                            "householdType": 0,
                            "education": 0,
                            
                            "address": "",
                            "nativePlace": "沈阳",
                            "hometownPlace": "沈阳",
                            "specialty": "专业",
                            
                            "emergencyMan": "紧急联系人",
                            "emergencyPhone": "电话",

                            "isMarried": 0,
                            "isBirth": 0,
                            "isHouse": 0,
                            "isHouseLoan": 0,
                            "isCar": 0,
                            "isCarLoan": 0,
                            "isCarID": 0,
                            "isPassID": 0,
                            "isHMID": 0,
                            "isTWID": 0,
                            
                            "isContract": 0,
                            "isSnsurance": 0,
                            "isFire": 0,
                            "isCnsurance": 0,
                            "isCompete": 0,
                            "isTrain": 0,
                            "isCriminal": 0,
                            "isDisease": 0,
                            "isCompete": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryRecruitment
    
        查询招聘信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.identity: 身份证号
        :type recruitment.identity: String
        :param recruitment.phone: 电话
        :type recruitment.phone: String
        
        Example::
        
            {
                "recruitment.identity": "000000000000000000",
                "recruitment.phone": "138xxxx3874"
            }

        +--------+
        |Returns:|
        +--------+
        
        :param recruitments: 招聘信息列表 , 每条数据类型 :data:`recruitment`
        :type recruitments: List
        
        Example::
        
            {
                ...
                "recruitments": [
                    {
                        "rid": 1,
                        "name": "员工",
                        "identity": "000000000000000000",
                        "phone": "138xxxx3874",
                        "nation": "汉",
                        "place": "地址",
                        
                        "height": 180,
                        "weight": 60,
                        
                        "qq": "",
                        "wechat": "",
                        "email": "",
                        
                        "employWay": 0,
                        "political": 0,
                        "householdType": 0,
                        "education": 0,
                        
                        "address": "",
                        "nativePlace": "沈阳",
                        "hometownPlace": "沈阳",
                        "specialty": "专业",
                        
                        "emergencyMan": "紧急联系人",
                        "emergencyPhone": "电话",

                        "isMarried": 0,
                        "isBirth": 0,
                        "isHouse": 0,
                        "isHouseLoan": 0,
                        "isCar": 0,
                        "isCarLoan": 0,
                        "isCarID": 0,
                        "isPassID": 0,
                        "isHMID": 0,
                        "isTWID": 0,
                        
                        "isContract": 0,
                        "isSnsurance": 0,
                        "isFire": 0,
                        "isCnsurance": 0,
                        "isCompete": 0,
                        "isTrain": 0,
                        "isCriminal": 0,
                        "isDisease": 0
                    }
                ],
                ...
            }

    .. method:: <I> queryRecruitmentByRid
    
        查询招聘信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: String
        
        Example::
        
            {
                "recruitment.rid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param recruitment: 招聘信息 , 类型 :data:`recruitment`
        :type recruitment: List
        
        Example::
        
            {
                ...
                "recruitment": {
                    "rid": 1,
                    "name": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "nation": "汉",
                    "place": "地址",
                    
                    "height": 180,
                    "weight": 60,
                    
                    "qq": "",
                    "wechat": "",
                    "email": "",
                    
                    "employWay": 0,
                    "political": 0,
                    "householdType": 0,
                    "education": 0,
                    
                    "address": "",
                    "nativePlace": "沈阳",
                    "hometownPlace": "沈阳",
                    "specialty": "专业",
                    
                    "emergencyMan": "紧急联系人",
                    "emergencyPhone": "电话",

                    "isMarried": 0,
                    "isBirth": 0,
                    "isHouse": 0,
                    "isHouseLoan": 0,
                    "isCar": 0,
                    "isCarLoan": 0,
                    "isCarID": 0,
                    "isPassID": 0,
                    "isHMID": 0,
                    "isTWID": 0,
                    
                    "isContract": 0,
                    "isSnsurance": 0,
                    "isFire": 0,
                    "isCnsurance": 0,
                    "isCompete": 0,
                    "isTrain": 0,
                    "isCriminal": 0,
                    "isDisease": 0
                }
                ...
            }

    .. method:: <I> checkRecruitment
    
        检查招聘信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.identity: 身份证号
        :type recruitment.identity: String
        :param recruitment.phone: 电话
        :type recruitment.phone: String
        
        Example::
        
            {
                "recruitment.identity": "000000000000000000",
                "recruitment.phone": "138xxxx3874"
            }

        +--------+
        |Returns:|
        +--------+
        
        :param recruitment: 招聘信息 , 类型 :data:`recruitment`
        :type recruitment: Object
        
        Example::
        
            {
                ...
                "recruitment": {
                    "rid": 1,
                    "name": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "nation": "汉",
                    "place": "地址",
                    
                    "height": 180,
                    "weight": 60,
                    
                    "qq": "",
                    "wechat": "",
                    "email": "",
                    
                    "employWay": 0,
                    "political": 0,
                    "householdType": 0,
                    "education": 0,
                    
                    "address": "",
                    "nativePlace": "沈阳",
                    "hometownPlace": "沈阳",
                    "specialty": "专业",
                    
                    "emergencyMan": "紧急联系人",
                    "emergencyPhone": "电话",

                    "isMarried": 0,
                    "isBirth": 0,
                    "isHouse": 0,
                    "isHouseLoan": 0,
                    "isCar": 0,
                    "isCarLoan": 0,
                    "isCarID": 0,
                    "isPassID": 0,
                    "isHMID": 0,
                    "isTWID": 0,
                    
                    "isContract": 0,
                    "isSnsurance": 0,
                    "isFire": 0,
                    "isCnsurance": 0,
                    "isCompete": 0,
                    "isTrain": 0,
                    "isCriminal": 0,
                    "isDisease": 0
                }
                ...
            }
        
    .. method:: <I> addRecruitment
    
        添加招聘信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.name: 姓名
        :type recruitment.name: String
        :param recruitment.identity: 身份证号
        :type recruitment.identity: String
        :param recruitment.phone: 电话
        :type recruitment.phone: String
        :param recruitment.nation: 民族
        :type recruitment.nation: String
        :param recruitment.place: 地址
        :type recruitment.place: String
        
        :param recruitment.height: 身高
        :type recruitment.height: String
        :param recruitment.weight: 体重
        :type recruitment.weight: String
        :param recruitment.qq: QQ号
        :type recruitment.qq: String
        :param recruitment.wechat: 微信号
        :type recruitment.wechat: String
        :param recruitment.email: 地址
        :type recruitment.email: String
        
        :param recruitment.employWay: 应聘方式
        :type recruitment.employWay: Short
        :param recruitment.political: 户口类型
        :type recruitment.political: Short
        :param recruitment.householdType: 政治面貌
        :type recruitment.householdType: Short
        :param recruitment.education: 学历
        :type recruitment.education: Short
        
        :param recruitment.address: 现住址
        :type recruitment.address: String
        :param recruitment.nativePlace: 籍贯
        :type recruitment.nativePlace: String
        :param recruitment.hometownPlace: 户籍地
        :type recruitment.hometownPlace: String
        :param recruitment.specialty: 专业
        :type recruitment.specialty: String
        
        :param recruitment.emergencyMan: 紧急联系人
        :type recruitment.emergencyMan: String
        :param recruitment.emergencyPhone: 紧急联系人电话
        :type recruitment.emergencyPhone: String
        
        :param recruitment.isMarried: 婚姻状况
        :type recruitment.isMarried: Short
        :param recruitment.isBirth: 婚姻状况
        :type recruitment.isBirth: Short
        :param recruitment.isHouse: 婚姻状况
        :type recruitment.isHouse: Short
        :param recruitment.isCar: 婚姻状况
        :type recruitment.isCar: Short
        :param recruitment.isHouseLoan: 婚姻状况
        :type recruitment.isHouseLoan: Short
        :param recruitment.isCarLoan: 婚姻状况
        :type recruitment.isCarLoan: Short
        :param recruitment.isCarID: 婚姻状况
        :type recruitment.isCarID: Short
        :param recruitment.isPassID: 婚姻状况
        :type recruitment.isPassID: Short
        :param recruitment.isHMID: 婚姻状况
        :type recruitment.isHMID: Short
        :param recruitment.isTWID: 婚姻状况
        :type recruitment.isTWID: Short
        
        :param recruitment.isContract: 是否与原单位签订劳动合同
        :type recruitment.isContract: Short
        :param recruitment.isSnsurance: 是否已缴纳社会保险
        :type recruitment.isSnsurance: Short
        :param recruitment.isFire: 是否已经与其它单位解除了劳动关系
        :type recruitment.isFire: Short
        :param recruitment.isCnsurance: 是否缴纳其他商业保险
        :type recruitment.isCnsurance: Short
        :param recruitment.isCompete: 现在是否还在竟业限制期内
        :type recruitment.isCompete: Short
        :param recruitment.isTrain: 公司提供培训机会时，是否同意并签订协议
        :type recruitment.isTrain: Short
        :param recruitment.isCriminal: 是否曾有前科劣迹、行政/邢事拘留等经历
        :type recruitment.isCriminal: Short
        :param recruitment.isDisease: 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史
        :type recruitment.isDisease: Short

        :param recruitmentEducation[n].organ: 机构
        :type recruitmentEducation[n].organ: String
        :param recruitmentEducation[n].certificate: 证书
        :type recruitmentEducation[n].certificate: String
        :param recruitmentEducation[n].beginTime: 开始时间
        :type recruitmentEducation[n].beginTime: Timestamp
        :param recruitmentEducation[n].endTime: 结束时间
        :type recruitmentEducation[n].endTime: Timestamp
        :param recruitmentEducation[n].createTime: 创建时间
        :type recruitmentEducation[n].createTime: Timestamp
        :param recruitmentEducation[n].specialty: 专业
        :type recruitmentEducation[n].specialty: String
        :param recruitmentEducation[n].content: 内容
        :type recruitmentEducation[n].content: String

        :param recruitmentOperation[n].company: 公司
        :type recruitmentOperation[n].company: String
        :param recruitmentOperation[n].trade: 行业
        :type recruitmentOperation[n].trade: String
        :param recruitmentOperation[n].duty: 职位
        :type recruitmentOperation[n].duty: String
        :param recruitmentOperation[n].beginTime: 开始时间
        :type recruitmentOperation[n].beginTime: Timestamp
        :param recruitmentOperation[n].endTime: 结束时间
        :type recruitmentOperation[n].endTime: Timestamp
        :param recruitmentOperation[n].createTime: 创建时间
        :type recruitmentOperation[n].createTime: Timestamp
        :param recruitmentOperation[n].salary: 薪资
        :type recruitmentOperation[n].salary: String
        :param recruitmentOperation[n].comment: 内容
        :type recruitmentOperation[n].comment: String
        
        Example::
        
            {
                "recruitment.name": "姓名",
                "recruitment.identity": "000000000000000000",
                "recruitment.phone": "138xxxx3874",
                "recruitment.nation": "汉",
                "recruitment.place": "地址",
                
                "recruitment.height": 180,
                "recruitment.weight": 60,
                "recruitment.qq": "",
                "recruitment.wechat": "",
                "recruitment.email": "",
                
                "recruitment.employWay": 0,
                "recruitment.political": 0,
                "recruitment.householdType": 0,
                "recruitment.education": 0,
                
                "recruitment.address": "辽宁沈阳",
                "recruitment.nativePlace": "辽宁沈阳",
                "recruitment.hometownPlace": "辽宁沈阳",
                "recruitment.specialty": "",
                
                "recruitment.emergencyMan": "",
                "recruitment.emergencyPhone": "",
                
                "recruitment.isMarried": 0,
                "recruitment.isBirth": 0,
                "recruitment.isHouse": 0,
                "recruitment.isCar": 0,
                "recruitment.isHouseLoan": 0,
                "recruitment.isCarLoan": 0,
                "recruitment.isCarID": 0,
                "recruitment.isPassID": 0,
                "recruitment.isHMID": 0,
                "recruitment.isTWID": 0,
                
                "recruitment.isContract": 0,
                "recruitment.isSnsurance": 0,
                "recruitment.isFire": 0,
                "recruitment.isCnsurance": 0,
                "recruitment.isCompete": 0,
                "recruitment.isTrain": 0,
                "recruitment.isCriminal": 0,
                "recruitment.isDisease": 0,
                
                "recruitmentEducation[0].organ": "",
                "recruitmentEducation[0].certificate": "",
                "recruitmentEducation[0].beginTime": "2016-01-01",
                "recruitmentEducation[0].endTime": "2016-01-01",
                "recruitmentEducation[0].createTime": "2016-01-01",
                "recruitmentEducation[0].specialty": "",
                "recruitmentEducation[0].content": "",
                
                "recruitmentOperation[0].company": "",
                "recruitmentOperation[0].trade": "",
                "recruitmentOperation[0].duty": "",
                "recruitmentOperation[0].beginTime": "2016-01-01",
                "recruitmentOperation[0].endTime": "2016-01-01",
                "recruitmentOperation[0].createTime": "2016-01-01",
                "recruitmentOperation[0].salary": "",
                "recruitmentOperation[0].comment": ""
            }

    .. method:: <I> updateRecruitment
    
        更新招聘信息
        
        判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**
        
        判断招聘信息状态为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: Long
        :param recruitment.name: 姓名
        :type recruitment.name: String
        :param recruitment.identity: 身份证号
        :type recruitment.identity: String
        :param recruitment.phone: 电话
        :type recruitment.phone: String
        :param recruitment.nation: 民族
        :type recruitment.nation: String
        :param recruitment.place: 地址
        :type recruitment.place: String
        
        :param recruitment.height: 身高
        :type recruitment.height: String
        :param recruitment.weight: 体重
        :type recruitment.weight: String
        :param recruitment.qq: QQ号
        :type recruitment.qq: String
        :param recruitment.wechat: 微信号
        :type recruitment.wechat: String
        :param recruitment.email: 地址
        :type recruitment.email: String
        
        :param recruitment.employWay: 应聘方式
        :type recruitment.employWay: Short
        :param recruitment.political: 户口类型
        :type recruitment.political: Short
        :param recruitment.householdType: 政治面貌
        :type recruitment.householdType: Short
        :param recruitment.education: 学历
        :type recruitment.education: Short
        
        :param recruitment.address: 现住址
        :type recruitment.address: String
        :param recruitment.nativePlace: 籍贯
        :type recruitment.nativePlace: String
        :param recruitment.hometownPlace: 户籍地
        :type recruitment.hometownPlace: String
        :param recruitment.specialty: 专业
        :type recruitment.specialty: String
        
        :param recruitment.emergencyMan: 紧急联系人
        :type recruitment.emergencyMan: String
        :param recruitment.emergencyPhone: 紧急联系人电话
        :type recruitment.emergencyPhone: String
        
        :param recruitment.isMarried: 婚姻状况
        :type recruitment.isMarried: Short
        :param recruitment.isBirth: 婚姻状况
        :type recruitment.isBirth: Short
        :param recruitment.isHouse: 婚姻状况
        :type recruitment.isHouse: Short
        :param recruitment.isCar: 婚姻状况
        :type recruitment.isCar: Short
        :param recruitment.isHouseLoan: 婚姻状况
        :type recruitment.isHouseLoan: Short
        :param recruitment.isCarLoan: 婚姻状况
        :type recruitment.isCarLoan: Short
        :param recruitment.isCarID: 婚姻状况
        :type recruitment.isCarID: Short
        :param recruitment.isPassID: 婚姻状况
        :type recruitment.isPassID: Short
        :param recruitment.isHMID: 婚姻状况
        :type recruitment.isHMID: Short
        :param recruitment.isTWID: 婚姻状况
        :type recruitment.isTWID: Short
        
        :param recruitment.isContract: 是否与原单位签订劳动合同
        :type recruitment.isContract: Short
        :param recruitment.isSnsurance: 是否已缴纳社会保险
        :type recruitment.isSnsurance: Short
        :param recruitment.isFire: 是否已经与其它单位解除了劳动关系
        :type recruitment.isFire: Short
        :param recruitment.isCnsurance: 是否缴纳其他商业保险
        :type recruitment.isCnsurance: Short
        :param recruitment.isCompete: 现在是否还在竟业限制期内
        :type recruitment.isCompete: Short
        :param recruitment.isTrain: 公司提供培训机会时，是否同意并签订协议
        :type recruitment.isTrain: Short
        :param recruitment.isCriminal: 是否曾有前科劣迹、行政/邢事拘留等经历
        :type recruitment.isCriminal: Short
        :param recruitment.isDisease: 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史
        :type recruitment.isDisease: Short
        
        Example::
        
            {
                "recruitment.rid": 1,
                "recruitment.name": "姓名",
                "recruitment.identity": "000000000000000000",
                "recruitment.phone": "138xxxx3874",
                "recruitment.nation": "汉",
                "recruitment.place": "地址",
                
                "recruitment.height": 180,
                "recruitment.weight": 60,
                "recruitment.qq": "",
                "recruitment.wechat": "",
                "recruitment.email": "",
                
                "recruitment.employWay": 0,
                "recruitment.political": 0,
                "recruitment.householdType": 0,
                "recruitment.education": 0,
                
                "recruitment.address": "辽宁沈阳",
                "recruitment.nativePlace": "辽宁沈阳",
                "recruitment.hometownPlace": "辽宁沈阳",
                "recruitment.specialty": "",
                
                "recruitment.emergencyMan": "",
                "recruitment.emergencyPhone": "",
                
                "recruitment.isMarried": 0,
                "recruitment.isBirth": 0,
                "recruitment.isHouse": 0,
                "recruitment.isCar": 0,
                "recruitment.isHouseLoan": 0,
                "recruitment.isCarLoan": 0,
                "recruitment.isCarID": 0,
                "recruitment.isPassID": 0,
                "recruitment.isHMID": 0,
                "recruitment.isTWID": 0,
                
                "recruitment.isContract": 0,
                "recruitment.isSnsurance": 0,
                "recruitment.isFire": 0,
                "recruitment.isCnsurance": 0,
                "recruitment.isCompete": 0,
                "recruitment.isTrain": 0,
                "recruitment.isCriminal": 0,
                "recruitment.isDisease": 0
            }

    .. method:: <I> updateRecruitmentForAdvance
    
        更新招聘信息
        
        判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: Long
        :param recruitment.photoPath: 照片
        :type recruitment.photoPath: String
        :param recruitment.identityPathF: 身份证正面
        :type recruitment.identityPathF: String
        :param recruitment.identityPathB: 身份证背面
        :type recruitment.identityPathB: String
        
        Example::
        
            {
                "recruitment.rid": 1,
                "recruitment.photoPath": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
                "recruitment.identityPathF": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
                "recruitment.identityPathB": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
            }

    .. method:: <I> updateRecruitmentForStatus
    
        更新招聘状态
        
        判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: Long
        
        Example::
        
            {
                "recruitment.rid": 1
            }

    .. method:: <I> entryRecruitment
    
        入职
        
        判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**
        
        判断招聘信息状态是否为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: Long
        
        Example::
        
            {
                "recruitment.rid": 1
            }

    .. method:: <I> cancelRecruitment
    
        作废
        
        判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**
        
        判断招聘信息状态是否为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitment.rid: 招聘ID
        :type recruitment.rid: Long
        
        Example::
        
            {
                "recruitment.rid": 1
            }
        
教育
----------------

.. class:: api.personel.RecruitmentEducationAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: recruitmentEducation
    
    :param reid: 教育ID
    :type reid: Long
    :param rid: 人员ID
    :type rid: Long
    :param organ: 机构
    :type organ: String
    :param certificate: 证书
    :type certificate: String
    :param beginTime: 开始时间
    :type beginTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    :param createTime: 创建时间
    :type createTime: String
    :param specialty: 专业
    :type specialty: String
    :param content: 内容
    :type content: String
    
    .. method:: <I> queryRecruitmentEducation
    
        查询招聘教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentEducation.rid: 招聘ID
        :type recruitmentEducation.rid: Long
        
        Example::
        
            {
                "recruitmentEducation.rid": 1,
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param recruitmentEducations: 招聘信息列表 , 每条数据类型 :data:`recruitmentEducation`
        :type recruitmentEducations: List
        
        Example::
        
            {
                ...
                "recruitmentEducations": [
                    {
                        "reid": 1,
                        "rid": 1,
                        "organ": "",
                        "certificate": "",
                        "beginTime": "2016-01-01",
                        "endTime": "2016-01-01",
                        "createTime": "2016-01-01",
                        "specialty": "专业",
                        "content": ""
                    }
                ],
                ...
            }

    .. method:: <I> addRecruitmentEducation
    
        添加招聘教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentEducation.rid: 招聘ID
        :type recruitmentEducation.rid: Long
        :param recruitmentEducation.organ: 机构
        :type recruitmentEducation.organ: String
        :param recruitmentEducation.organ: 机构
        :type recruitmentEducation.organ: String
        :param recruitmentEducation.certificate: 证书
        :type recruitmentEducation.certificate: String
        :param recruitmentEducation.beginTime: 开始时间
        :type recruitmentEducation.beginTime: Timestamp
        :param recruitmentEducation.endTime: 结束时间
        :type recruitmentEducation.endTime: Timestamp
        :param recruitmentEducation.createTime: 创建时间
        :type recruitmentEducation.createTime: Timestamp
        :param recruitmentEducation.specialty: 专业
        :type recruitmentEducation.specialty: String
        :param recruitmentEducation.content: 内容
        :type recruitmentEducation.content: String
        
        Example::
        
            {
                "recruitmentEducation.rid": 1,
                "recruitmentEducation.organ": "",
                "recruitmentEducation.certificate": "",
                "recruitmentEducation.beginTime": "2016-01-01",
                "recruitmentEducation.endTime": "2016-01-01",
                "recruitmentEducation.createTime": "2016-01-01",
                "recruitmentEducation.specialty": "",
                "recruitmentEducation.content": "",
            }

    .. method:: <I> updateRecruitmentEducation
    
        更新招聘教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentEducation.reid: 招聘教育ID
        :type recruitmentEducation.reid: Long
        :param recruitmentEducation.organ: 机构
        :type recruitmentEducation.organ: String
        :param recruitmentEducation.organ: 机构
        :type recruitmentEducation.organ: String
        :param recruitmentEducation.certificate: 证书
        :type recruitmentEducation.certificate: String
        :param recruitmentEducation.beginTime: 开始时间
        :type recruitmentEducation.beginTime: Timestamp
        :param recruitmentEducation.endTime: 结束时间
        :type recruitmentEducation.endTime: Timestamp
        :param recruitmentEducation.createTime: 创建时间
        :type recruitmentEducation.createTime: Timestamp
        :param recruitmentEducation.specialty: 专业
        :type recruitmentEducation.specialty: String
        :param recruitmentEducation.content: 内容
        :type recruitmentEducation.content: String
        
        Example::
        
            {
                "recruitmentEducation.reid": 1,
                "recruitmentEducation.organ": "",
                "recruitmentEducation.certificate": "",
                "recruitmentEducation.beginTime": "2016-01-01",
                "recruitmentEducation.endTime": "2016-01-01",
                "recruitmentEducation.createTime": "2016-01-01",
                "recruitmentEducation.specialty": "",
                "recruitmentEducation.content": "",
            }

    .. method:: <I> deleteRecruitmentEducation
    
        删除招聘教育信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentEducation.reid: 招聘教育ID
        :type recruitmentEducation.reid: Long
        
        Example::
        
            {
                "recruitmentEducation.reid": 1
            }

工作
----------------

员工工作信息管理

.. class:: api.personel.RecruitmentOperationAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: recruitmentOperation
    
    :param roid: 工作ID
    :type roid: Long
    :param rid: 招聘ID
    :type rid: Long
    :param company: 公司
    :type company: String
    :param trade: 行业
    :type trade: String
    :param duty: 职位
    :type duty: String
    :param beginTime: 开始时间
    :type beginTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    :param salary: 薪资
    :type salary: Long
    :param createTime: 创建时间
    :type createTime: String
    :param comment: 描述
    :type comment: String
    
    .. method:: <I> queryRecruitmentOperation
    
        查询招聘工作信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentOperation.rid: 招聘ID
        :type recruitmentOperation.rid: Long
        
        Example::
        
            {
                "recruitmentOperation.rid": 1,
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param recruitmentOperations: 招聘信息列表 , 每条数据类型 :data:`recruitmentOperation`
        :type recruitmentOperations: List
        
        Example::
        
            {
                ...
                "recruitmentOperations": [
                    {
                        "roid": 1,
                        "rid": 1,
                        "company": "",
                        "trade": "",
                        "duty": "",
                        "beginTime": "2016-01-01",
                        "endTime": "2016-01-01",
                        "createTime": "2016-01-01",
                        "salary": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    .. method:: <I> addRecruitmentOperation
    
        添加招聘工作信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentOperation.rid: 招聘ID
        :type recruitmentOperation.rid: Long
        :param recruitmentOperation.company: 公司
        :type recruitmentOperation.company: String
        :param recruitmentOperation.trade: 行业
        :type recruitmentOperation.trade: String
        :param recruitmentOperation.duty: 职位
        :type recruitmentOperation.duty: String
        :param recruitmentOperation.beginTime: 开始时间
        :type recruitmentOperation.beginTime: Timestamp
        :param recruitmentOperation.endTime: 结束时间
        :type recruitmentOperation.endTime: Timestamp
        :param recruitmentOperation.createTime: 创建时间
        :type recruitmentOperation.createTime: Timestamp
        :param recruitmentOperation.salary: 薪资
        :type recruitmentOperation.salary: String
        :param recruitmentOperation.comment: 内容
        :type recruitmentOperation.comment: String
        
        Example::
        
            {
                "recruitmentOperation.rid": 1,
                "recruitmentOperation.company": "",
                "recruitmentOperation.trade": "",
                "recruitmentOperation.duty": "",
                "recruitmentOperation.beginTime": "2016-01-01",
                "recruitmentOperation.endTime": "2016-01-01",
                "recruitmentOperation.createTime": "2016-01-01",
                "recruitmentOperation.salary": "",
                "recruitmentOperation.comment": ""
            }

    .. method:: <I> updateRecruitmentOperation
    
        更新招聘工作信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentOperation.roid: 招聘工作ID
        :type recruitmentOperation.roid: Long
        :param recruitmentOperation.company: 公司
        :type recruitmentOperation.company: String
        :param recruitmentOperation.trade: 行业
        :type recruitmentOperation.trade: String
        :param recruitmentOperation.duty: 职位
        :type recruitmentOperation.duty: String
        :param recruitmentOperation.beginTime: 开始时间
        :type recruitmentOperation.beginTime: Timestamp
        :param recruitmentOperation.endTime: 结束时间
        :type recruitmentOperation.endTime: Timestamp
        :param recruitmentOperation.createTime: 创建时间
        :type recruitmentOperation.createTime: Timestamp
        :param recruitmentOperation.salary: 薪资
        :type recruitmentOperation.salary: String
        :param recruitmentOperation.comment: 内容
        :type recruitmentOperation.comment: String
        
        Example::
        
            {
                "recruitmentOperation.roid": 1,
                "recruitmentOperation.company": "",
                "recruitmentOperation.trade": "",
                "recruitmentOperation.duty": "",
                "recruitmentOperation.beginTime": "2016-01-01",
                "recruitmentOperation.endTime": "2016-01-01",
                "recruitmentOperation.createTime": "2016-01-01",
                "recruitmentOperation.salary": "",
                "recruitmentOperation.comment": ""
            }

    .. method:: <I> deleteRecruitmentOperation
    
        删除招聘工作信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param recruitmentOperation.roid: 招聘工作ID
        :type recruitmentOperation.roid: Long
        
        Example::
        
            {
                "recruitmentOperation.roid": 1
            }

厂商
================

厂商
----------------

.. class:: api.personel.SupplierAction

    .. method:: <I> pageSupplier
    
        分页方式获取厂商信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 员工信息列表 , 每条数据类型 :data:`user`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uid": 34,
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "phone": "138xxxx3874",
                            "company": 0,
                            "duty": {
                                "did": 1,
                                "name": "设计师",
                                "departmentType": {
                                    "dtid": 1,
                                    "name": "设计"
                                },
                                "lead": 0
                            },
                            "dept": {
                                "did": 250,
                                "no": "D001",
                                "name": "设计部",
                                "fatherDept": null,
                                "type": "职能部"
                            },
                            "role": {
                                "rid": 1,
                                "no": "R001",
                                "name": "游客"
                            },
                            "status": 0,
                            "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> querySupplierByPinyin
    
        通过拼音获取厂商信息
        
        通过pinyin筛选的字段包括 , pinyin/currentName/userId
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplier.pinyin: 员工名拼音
        :type supplier.pinyin: String
        
        Example::
        
            {
                "supplier.pinyin": "yuangong"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为员工编号 , 值为员工现用名
        :type autoFillKeyValue: List
        :param autoFillList: 员工现用名列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "C001",
                        "value": "厂商"
                    }
                ],
                "autoFillList": [
                    "员工"
                ],
                ...
            }
            
    .. method:: <I> addSupplier
    
        添加厂商
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplier.loginId: 登陆帐号
        :type supplier.loginId: String
        :param supplier.userName: 用户名
        :type supplier.userName: String
        :param supplier.duty.did: 职位ID
        :type supplier.duty.did: Integer
        :param supplier.identity: 身份证号
        :type supplier.identity: String
        :param supplier.phone: 手机号
        :type supplier.phone: String
        
        Example::
        
            {
                "supplier.loginId": "yuangong",
                "supplier.userName": "厂商",
                "supplier.deptType": "职能部",
                "supplier.duty.did": 1,
                "supplier.identity": "000000000000000000",
                "supplier.dept.no": "D001"
            }

    .. method:: <I> updateSupplier
    
        更新厂商
        
        判断厂商信息是否存在 , 不存在 , 错误信息 **190012 厂商不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplier.uid: 厂商ID
        :type supplier.uid: Long
        :param supplier.userName: 名称
        :type supplier.userName: String
        :param supplier.identity: 身份证号
        :type supplier.identity: String
        :param supplier.phone: 手机号
        :type supplier.phone: String
        
        Example::
        
            {
                "supplier.loginId": "yuangong",
                "supplier.userName": "厂商",
                "supplier.identity": "000000000000000000",
                "supplier.phone": "138xxxx1918"
            }

合同
----------------

员工合同信息管理

.. class:: api.personel.SupplierContractAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: supplierContract
    
    :param scid: 合同ID
    :type scid: Long
    :param uid: 员工ID
    :type uid: Long
    
    :param no: 合同编号
    :type no: String
    :param name: 名称
    :type name: String
    :param title: 标题
    :type title: 标题
    :param signTime: 签订时间
    :type signTime: Timestamp
    :param startTime: 开始时间
    :type startTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    
    :param download: 下载地址
    :type download: String
    :param viewpdf: 查看地址
    :type viewpdf: String
    :param filesize: 文件大小
    :type filesize: Integer
    
    :param creater: 创建人 , 类型 `supplier <./supplier.html#api.personel.SupplierAction.supplier>`__
    :type creater: Object
    :param signner: 签署人 , 类型 `supplier <./supplier.html#api.personel.SupplierAction.supplier>`__
    :type signner: Object
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param comsignTime: 公司签时间
    :type comsignTime: Timestamp
    :param cussignTime: 客户签时间
    :type cussignTime: Timestamp
    
    :param status: 状态 , 0: 初始 , 1: 无效 , 2: 已签 , 3: 归档 , 4: 归档(本地)
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> querySupplierContract
    
        获取人员合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.uid: 人员ID
        :type supplierContract.uid: Long
        
        Example::
        
            {
                "supplierContract.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param supplierContracts: 员工合同列表 , 每条数据类型 :data:`supplierContract`
        :type supplierContracts: List
        
        Example::
        
            {
                ...
                "supplierContracts": [
                    {
                        "scid": 0,
                        "uid": 1,
                        "no": "ESCASD",
                        "name": "合同名称",
                        "title": "合同标题"
                        "signTime": "2016-01-01 00:00:00",
                        "startTime": "2016-01-01 00:00:00",
                        "endTime": "2016-01-01 00:00:00",
                        "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                        "download": "JKLSHFD213J12GH312U32.pdf",
                        "filesize": 0,
                        "creater": {
                            "uid": 1,
                            "supplierId": "U0203",
                            "supplierName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "signner": null,
                        "createTime": "2016-01-01 00:00:00",
                        "comsignTime": null,
                        "cussignTime": null,
                        "status": 0,
                        "comment": "说明"
                    }
                ],
                ...
            }

    .. method:: <I> sendSupplierContractForAuth
    
        发送认证通知
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
    
    
        Example::
        
            {
                "supplierContract.scid": 1
            }

    .. method:: <I> sendSupplierContract
    
        发送合同通知
        
        通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        :param supplierContract.type: 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载
        :type supplierContract.type: Short
        
        Example::
        
            {
                "supplierContract.scid": 1,
                "supplierContract.type": 1
            }

    .. method:: <I> redirectSupplierContract
    
        跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址
        
        类型包括1(签章)/2(签订)/3(查看)/4(下载)
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    .. method:: <I> viewSupplierContract
    
        查看合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }
            
    .. method:: <I> signSupplierContractForCompany
    
        签订合同 , 针对公司信息
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        :param signet.signno: 签章编号
        :type signet.signno: String
        :param signet.keyword: 关键字
        :type signet.keyword: String
        :param signet.signid: 印章ID
        :type signet.signid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1,
                "signet.signno": "IN31HJOS",
                "signet.keyword": "关键字",
                "signet.signid": 1
            }
            
    .. method:: <I> signSupplierContractForSupplier
    
        签订合同 , 针对员工信息
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param redirect: 跳转地址
        :type redirect: String
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=sign",
                ...
            }

    .. method:: <C> addSupplierContract
    
        添加用户合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.uid: 人员ID
        :type supplierContract.uid: Long
        
        :param supplierContract.no: 编号
        :type supplierContract.no: String
        :param supplierContract.name: 名称
        :type supplierContract.name: String
        :param supplierContract.signTime: 签订时间
        :type supplierContract.signTime: Timestamp
        :param supplierContract.beginTime: 开始时间
        :type supplierContract.beginTime: Timestamp
        :param supplierContract.endTime: 结束时间
        :type supplierContract.endTime: Timestamp
        :param supplierContract.comment: 说明
        :type supplierContract.comment: String
        
        :param contract.cid: 合同ID
        :type contract.cid: Long
        :param contract.no: 合同编号
        :type contract.no: String
        :param contract.name: 名称
        :type contract.name: String
        :param contract.title: 标题
        :type contract.title: String
        
        Example::
        
            {
                "supplierContract.uid": 1,
                "supplierContract.no": "ESAEASDF",
                "supplierContract.name": "合同名称",
                "supplierContract.signTime": "2016-01-01 00:00:00",
                "supplierContract.beginTime": "2016-01-01 00:00:00",
                "supplierContract.endTime": "2016-01-01 00:00:00",
                "supplierContract.comment": "",
                
                "contract.cid": 1,
                "contract.no": "74HENIDH121H",
                "contract.name": "合同模版",
                "contract.title": "合同标题",
            }
            
    .. method:: <C> updateSupplierContract
    
        更新用户合同信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        :param supplierContract.comment: 说明
        :type supplierContract.comment: String
        
        Example::
        
            {
                "supplierContract.scid": 1,
                "supplierContract.comment": ""
            }

    .. method:: <I> affixSupplierContract
    
        签订合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        更新装修合同为1(已签)
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }

    .. method:: <I> expireSupplierContract
    
        失效合同
        
        判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**
        
        更新装修合同为1(失效)
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }

            
    .. method:: <I> filingSupplierContract
    
        归档合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为2(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        更新装修合同为3(归档)
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid": 1
            }
            
    .. method:: <C> deleteSupplierContract
    
        删除合同
        
        判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param supplierContract.scid: 合同ID
        :type supplierContract.scid: Long
        
        Example::
        
            {
                "supplierContract.scid: 1
            }

合同-品牌
----------------

.. class:: api.personel.SupplierContractBrandAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: supplierContractBrand
    
    :param scbid: ID
    :type scbid: Long
    :param scid: 合同ID
    :type scid: Long
    
    :param brand: 品牌 , 类型 `brand <./data.html#api.data.BrandAction.brand>`__
    :type brand: Object
    :param ctype: 结算类型 , 0: 底价 , 1: 点位
    :type ctype: Short
    :param cvalue: 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
    :type cvalue: Integer
    :param breakpay: 违约金
    :type breakpay: Integer
    
    .. querySupplierContractBrand
    
    .. addSupplierContractBrand
    
    .. deleteSupplierContractBrand

合同-商品
----------------

.. class:: api.personel.SupplierContractGoodsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: supplierContractGoods
    
    :param scgid: ID
    :type scgid: Long
    :param scid: 合同ID
    :type scid: Long
    
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param price: 价格
    :type price: Integer
    :param balance: 结算价
    :type balance: Integer
    
    .. querySupplierContractGoods
    
    .. addSupplierContractGoods
    
    .. deleteSupplierContractGoods

商户
================

.. class:: api.personel.SupplierAction

    .. method:: <I> pageSupplier
    
        分页方式获取商户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 商户信息列表 , 每条数据类型 :data:`user`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uid": 34,
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "phone": "138xxxx3874",
                            "company": 0,
                            "duty": {
                                "did": 1,
                                "name": "设计师",
                                "departmentType": {
                                    "dtid": 1,
                                    "name": "设计"
                                },
                                "lead": 0
                            },
                            "dept": {
                                "did": 250,
                                "no": "D001",
                                "name": "设计部",
                                "fatherDept": null,
                                "type": "职能部"
                            },
                            "role": {
                                "rid": 1,
                                "no": "R001",
                                "name": "游客"
                            },
                            "status": 0,
                            "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryMerchantByPinyin
    
        通过拼音获取商户信息
        
        通过pinyin筛选的字段包括 , pinyin/currentName/userId
        
        +---------+
        |Requests:|
        +---------+
        
        :param merchant.pinyin: 商户拼音
        :type merchant.pinyin: String
        
        Example::
        
            {
                "merchant.pinyin": "yuangong"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为商户编号 , 值为名称
        :type autoFillKeyValue: List
        :param autoFillList: 名称列表 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "C001",
                        "value": "厂商"
                    }
                ],
                "autoFillList": [
                    "员工"
                ],
                ...
            }

管理
================

.. class:: api.personel.AvengerAction

    .. method:: <I> pageAvenger
    
        分页方式获取管理信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 管理信息列表 , 每条数据类型 :data:`user`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "uid": 34,
                            "userId": "U001",
                            "oldUserId": "U001",
                            "userName": "员工",
                            "currentName": "员工",
                            "phone": "138xxxx3874",
                            "company": 0,
                            "duty": {
                                "did": 1,
                                "name": "设计师",
                                "departmentType": {
                                    "dtid": 1,
                                    "name": "设计"
                                },
                                "lead": 0
                            },
                            "dept": {
                                "did": 250,
                                "no": "D001",
                                "name": "设计部",
                                "fatherDept": null,
                                "type": "职能部"
                            },
                            "role": {
                                "rid": 1,
                                "no": "R001",
                                "name": "游客"
                            },
                            "status": 0,
                            "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> queryAvengerByPinyin
    
        通过拼音获取管理信息
        
        通过pinyin筛选的字段包括 , pinyin/currentName/userId
        
        +---------+
        |Requests:|
        +---------+
        
        :param avenger.pinyin: 管理拼音
        :type avenger.pinyin: String
        
        Example::
        
            {
                "avenger.pinyin": "yuangong"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param autoFillKeyValue: 键值列表 , 每条数据类型 :data:`keyValue` , 键为管理编号 , 值为名称
        :type autoFillKeyValue: List
        :param autoFillList: 名称 , 每条数据类型String
        :type autoFillList: List
        
        Example::
        
            {
                ...
                "autoFillKeyValue": [
                    {
                        "key": "C001",
                        "value": "厂商"
                    }
                ],
                "autoFillList": [
                    "员工"
                ],
                ...
            }

需求
================

.. class:: api.personel.UserRequireAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userRequire
    
    :param urid: 需求ID
    :type urid: Long
    :param content: 内容
    :type content: String
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param department: 创建部门 , 类型 `department <./department.html#api.communion.DepartmentAction.department>`__
    :type department: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param receipter: 接收人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type receipter: Object
    :param approveTime: 审批时间
    :type approvalTime: Timestamp
    :param finishTime: 完成时间
    :type finishTime: Timestamp
    :param type: 类型 , 0: 招聘 , 1: 培训
    :type type: Short
    :param status: 状态 , 0: 初始 , 1: 通过 , 2: 拒绝 , 3: 完成
    :type status: Short
    
    .. method:: <I> pageUserRequire
    
        分页方式获取人员需求消息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`__ 以及 `filter <../check_rule.html#filter>`__
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 人员需求信息列表 , 每条数据类型 :data:`userRequire`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "urid": 1,
                            "content": "招聘需求",
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "userName": "白雪",
                                "currentName": "白雪",
                            },
                            "department": {
                                "did": 1,
                                "no": "D001",
                                "name": "市场营销一部",
                            },
                            "createTime": "2016-01-01",
                            "receipter": {
                                "uid": 1,
                                "userId": "U0001",
                                "userName": "白雪",
                                "currentName": "白雪",
                            },
                            "approveTime": "2016-01-01",
                            "finishTime": "2016-01-01",
                            "type": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
        
    .. method:: <I> addUserRequire
    
        添加人员需求
        
        +---------+
        |Requests:|
        +---------+
        
        :param userRequire.content: 名称
        :type userRequire.content: String
        :param userRequire.type: 类型
        :type userRequire.type: Short
        
        Example::
        
            {
                "userRequire.content": "人员需求",
                "userRequire.type": 0
            }
        
    .. method:: <I> approveUserRequire
    
        通过人员需求
        
        判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**
        
        判断人员需求状态是否为0(初始) , 其他状态 , 错误信息 **190010 人员需求不可操作**
        
        更新人员需求状态为1(通过)
        
        :param userRequire.urid: 需求ID
        :type userRequire.urid: Long
        
        Example::
        
            {
                "userRequire.urid": 1
            }
    
    .. method:: <I> refuseUserRequire
    
        拒绝人员需求
        
        判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**
        
        判断人员需求状态是否为0(初始) , 其他状态 , 错误信息 **190010 人员需求不可操作**
        
        更新人员需求状态为2(拒绝)
        
        :param userRequire.urid: 需求ID
        :type userRequire.urid: Long
        
        Example::
        
            {
                "userRequire.urid": 1
            }
    
    .. method:: <I> finishUserRequire
    
        完成人员需求
        
        判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**
        
        判断人员需求状态是否为1(通过) , 其他状态 , 错误信息 **190010 人员需求不可操作**
        
        更新人员需求状态为3(完成)
        
        :param userRequire.urid: 需求ID
        :type userRequire.urid: Long
        
        Example::
        
            {
                "userRequire.urid": 1
            }

标签
================

.. class:: api.data.UserLabelAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: userLabel
    
    :param ulid: 人员标签ID
    :type ulid: Long
    :param user: 人员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param label: 标签 , 类型 `label <./data.html#api.data.LabelAction.label>`__
    :type label: Object
    :param scope: 积分
    :type scope: Integer

    .. method:: <I> queryUserLabelByUid
    
    .. method:: <I> pickUserLabel
    
    .. method:: <I> addUserLabel
    
    .. method:: <I> deleteUserLabel
    
绩效
================

.. class:: api.personel.PerformanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: performance
    
    :param pid: 绩效ID
    :type pid: Long
    :param user: 人员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param type: 类型
    :type type: Short
    :param value: 绩效
    :type value: Integer
    :param level: 等级
    :type level: Short
    :param startTime: 开始时间
    :type startTime: Timestamp
    :param endTime: 结束时间
    :type endTime: Timestamp
    :param work: 工作
    :type work: String
    :param content: 内容
    :type content: String
    
    .. method:: pagePerformance
    
        分页方式获取绩效信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
    .. method:: addPreformance
    
        添加绩效信息

考勤
================

.. class:: api.personel.AttendanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: attendance
    
    :param aid: 考勤ID
    :type aid: Long
    :param uid: 用户ID
    :type uid: Long
    :param month: 月份 , 例如: 201601
    :type month: Integer
    :param a1: 考勤标识 , 两位数 , 十位标识早记录 , 各位标识晚记录 , 1: 正常 , 2: 迟到/早退 , 3: 未打卡
    :type a1: Short
    :param a2: 考勤标识
    :type a2: Short
    :param a31: 考勤标识
    :type a31: Short
    
    .. method:: <I> queryAttendance
    
        获取考勤记录
        
        +---------+
        |Requests:|
        +---------+
        
        :param attendance.uid: 人员ID
        :type attendance.uid: Long
        :param attendance.month: 月份
        :type attendance.month: Integer

        Example::
        
            {
                "attendance.uid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param attendances: 签到信息列表 , 每条数据类型 :data:`attendance`
        :type attendances: List
        
        Example::
        
            {
                ...
                "attendances": [
                    {
                        "aid": 1,
                        "uid": 1,
                        "month": 201601,
                        "a1": 11
                        "a2": 12,
                        ...
                        "a31": 11
                    }
                ],
                ...
            }
