 
.. _dingtalk:

***************
钉钉
***************

钉钉
================
           
.. class:: api.dingding.DingTalkAction

    .. data:: user
    
    :param userid: 员工编号
    :type userid: String
    :param name: 员工名
    :type name: String
    :param position: 职位
    :type position: String
    :param mobile: 电话
    :type mobile: String
    :param avatar: 头像
    :type avatar: String
    :param email: 邮件
    :type email: String
    :param department: 部门
    :type department: Object
    :param active: 激活状态
    :type active: String
    
    .. data:: deptartment
    
    :param id: ID
    :type id: Integer
    :param name: 部门名称
    :type name: String
    :param parentid: 父级部门ID
    :type parentid: Integer
         
    .. method:: <I> queryDDUser
    
        通过员工编号查询该人员的钉钉相关信息

        +---------+
        |Requests:|
        +---------+

        :param user.userId: 员工编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

        +--------+
        |Returns:|
        +--------+

        :param user: 员工信息 , 类型 :data:`user`
        :type user: Object

        Example::

            {
                ...
                "user": {
                    "active": true,
                    "avatar": "http://static.dingtalk.com/media/lADPACOG84WW3mjNAq7NAoA_640_686.jpg",
                    "department":{
                       0:2465645,
                       1:33271028
                    } 
                    "email": null,
                    "extattr": null,
                    "mobile": "138xxxx3620",
                    "name": "白雪",
                    "openId": "TWZrgP4lkiS6cqniimPUNvYwiEiE",
                    "position": "设计师",
                    "status": 0,
                    "userid": "FL-00001",
                }
                ...
            }

    .. method:: <I> queryDDDepartment
    
        通过登录人员的当前登录的公司查询当前公司的钉钉组织结构
          
        +--------+
        |Returns:|
        +--------+

        :param user: 部门信息列表 , 每条数据类型 :data:`department`
        :type user: List

        Example::

            {
                ...
                "departments": [
                    0: {
                        "id": 2742563,
                        "name": "巡检部",
                        "parentid": 2747375,
                    },
                ],
                ...
            }

	.. method:: <I> addDDUser
    
        添加人员到钉钉

        +---------+
        |Requests:|
        +---------+
            
        :param user.Mobile: 联系方式 
        :type user.Mobile: String
        :param user.Position: 职位 
        :type user.Position: String
        :param user.name: 姓名 
        :type user.name: String
        :param user.userid: 员工号 
        :type user.userid: String
        :param dids: 钉钉部门 
        :type dids: list

        Example::

           {
                "user.Mobile": "13840103620",
                "user.Position": "设计师",
                "user.name" : "白雪",
                "user.userid": "FL-07033",
                "dids": [2465645,2742563],
            }
			
    .. method:: <I> updateDDUser

        更新员工钉钉信息

        +---------+
        |Requests:|
        +---------+

        :param user.Mobile: 联系方式 
        :type user.Mobile: String
        :param user.Position: 职位 
        :type user.Position: String
        :param user.name: 姓名 
        :type user.name: String
        :param user.userid: 员工号 
        :type user.userid: String
        :param dids: 钉钉部门 
        :type dids: list

        Example::

            {
                "user.Mobile": "13840103620",
                "user.Position": "设计师",
                "user.name" : "白雪",
                "user.userid": "FL-07033",
                "dids": [2465645,2742563],
            }

    .. method:: <I> deleteDDUser
    
        从钉钉中删除

        +---------+
        |Requests:|
        +---------+

        :param user.userId: 员工编号
        :type user.userId: String

        Example::

            {
                "user.userId": "FL-00001"
            }

    .. method:: <I> requestDDConfig
    
    .. method:: <I> queryDDUserInfo

    .. method:: <I> queryAccessToken
    
    .. method:: <I> queryJsapiTicket
    
    .. method:: <I> makeAccessToken
    
    .. method:: <I> batchmakeAccessToken
    
    .. method:: <I> deleteAccessToken
    