
.. _common:

***************
通用
***************

登陆
================

登陆以及相关操作

.. class:: api.common.LoginAction

    +---------+
    |DataType:|
    +---------+

    .. data:: role

    :param rid: 角色ID
    :type rid: Integer
    :param name: 角色名
    :type name: String

    .. data:: department

    :param did: 部门ID
    :type did: Integer
    :param no: 编号
    :type no: String
    :param name: 部门名称
    :type name: String
    :param type: 部门类型
    :type type: String
    :param subType: 部门子类型
    :type subType: String
    :param fatherDept: 上级部门
    :type fatherDept: object

    .. data:: user

    :param uid: 用户ID
    :type uid: Integer
    :param userId: 用户编号
    :type userId: String
    :param loginId: 登录名
    :type loginId: String
    :param oldUserId: 旧用户名
    :type oldUserId: String
    :param password: 密码
    :type password: String
    :param userName: 用户名
    :type userName: String
    :param currentName: 用户名
    :type currentName: String
    :param userPhoto: 用户头像照片
    :type userPhoto: String
    :param deptType: 部门类型
    :type deptType: String
    :param duty: 职位
    :type duty: String
    :param role: 用户角色对象 , 类型 :data:`role`
    :type role: Object
    :param dept: 所属部门 , 类型 :data:`department`
    :type dept: Object

    .. data:: loginInfo

    :param loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
    :type loginFlag: String
    :param userId: 用户编号
    :type userId: String
    :param code: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
    :type code: Integer
    :param message: 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因
    :type message: String
    :param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
    :type authentication: String
    :param optime: 操作时间
    :type optime: Long
    :param x: 位置信息 , x表示经度
    :type x: Double
    :param y: 位置信息 , y表示纬度
    :type y: Double
	
	.. method:: <I> doLogin
	
		登陆 , 同时获取登陆结果信息 . 
		
		+---------+
		|Requests:|
		+---------+
		
		:param userId: 登陆用户编号
		:type userId: String
		:param password: 登陆密码
		:type password: String
		:param verifyCode: 验证码
		:type verifyCode: String
		:param securityCode: 安全码
		:type securityCode: String
		
		Example::
		
			{
				userId: "U001",
				password: "password",
				verify: "1234",
				securityCode: "D0CCCF1C21CB4"
			}
		
		+--------+
		|Returns:|
		+--------+
		
		:param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
		:type authentication: String
		:param user: 登陆用户信息 , 类型 :data:`user`
		:type user: object
		
		Example::
		
			{
				...
				"authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
				"user":{
					"UId":34,
					"currentName": "游客",
					"dept":{
						"dId":250,
						"deptId": "DD_09",
						"deptName": "系统部",
						"fatherDept":null,
						"subType": "行政部",
						"type": "职能部"
					},
					"deptType": "职能部",
					"duty": "游客",
					"loginId": "baitianyu",
					"oldUserId": "DZSW.0102",
					"password": "86101F2733C1D",
					"role":{
						"roleId": "R01",
						"roleName": "游客"
					},
					"userId": "U001",
					"userName": "游客",
					"userPhoto": "18c5c24fe6c44.jpg",
				},
				...
			}
            
    .. method:: <A> logout
    
        登出 , 同时删除登陆信息
        
        +--------+
        |Returns:|
        +--------+

		无
		
        Example::

            {
                ...
            }

    .. method:: <C> requestAuthCode
	
        免登 , 同时获取登陆信息

        +---------+
        |Requests:|
        +---------+

        :param userId: 登陆用户编号
        :type userId: String
        :param code: 验证码
        :type code: String
        :param secret: 安全码
        :type secret: String
		
        Example::

            {
                "userId": "U001",
                "code": "C21CB4D0CCCF1",
                "secret": "C21CB4D0CCCF1"
            }
			
        +--------+
        |Returns:|
        +--------+

        :param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
        :type authentication: String

        Example::

            {
                ...
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
                ...
            }
            
    .. method:: <C> changeAuthCode
    
        更换 , 更新权限码中公司
        
        +---------+
        |Requests:|
        +---------+

        :param authentication: 权限码
        :type authentication: String
		
        Example::

            {
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
            }
            
        +--------+
        |Returns:|
        +--------+

        :param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
        :type authentication: String

        Example::

            {
                ...
                "authentication": "A9EDA0FCA5C7A2D10A7ECD3DCE2",
                ...
            }
            
    .. method:: <C> updateAuthCode
    
        更换 , 更新权限码中有效时间
        
        +---------+
        |Requests:|
        +---------+

        :param authentication: 权限码
        :type authentication: String
		
        Example::

            {
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
            }
            
        +--------+
        |Returns:|
        +--------+

        :param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
        :type authentication: String

        Example::

            {
                ...
                "authentication": "A0FCA5C7A2A9EDD10A7ECD3DCE2",
                ...
            }
            
    .. method:: <A> ping
    
        通过该API判断当前服务是否可用
        
        +--------+
        |Returns:|
        +--------+

        无

        Example::

            {
                ...
            }

    .. method:: <A> current
    
        获取当前系统时间
        
        +---------+
        |Requests:|
        +---------+

        :param current: 时间格式 , 默认 yyyy-MM-dd hh:mm:ss
        :type current: String
		
        Example::

            {
                "current": "yyyy-MM-dd hh:mm:ss"
            }
        
        +--------+
        |Returns:|
        +--------+

        :param current: 时间
        :type current: String
		
        Example::

            {
                "current": "2016-01-01 00:00:00"
            }
			
验证码
================

验证码获取以及处理方式

.. class:: api.common.LoginAction
			
	.. method:: <I> queryVode
	
		获取验证码信息
		
		+--------+
		|Returns:|
		+--------+
		
		:param securityCode: 验证码信息
		:type securityCode: String
		
		Example::
		
			{
				...
				"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
				...
			}
	
	.. method:: <I> verifyCode
	
		获取验证码图片
		
		+---------+
		|Requests:|
		+---------+
		
		:param securityCode: 验证码信息 , 利用  :data:`queryVode` 接口获取到的securityCode
		:type securityCode: String
		
		Example::
		
			{
				"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
			}
		
		+--------+
		|Returns:|
		+--------+
		
		:param imageStream: 验证码图片流信息
		:type imageStream: stream

水印
================

水印图片信息

.. class:: api.common.WMCodeAction
		
	.. method:: <I> wmCode
	
		获取水印图片
		
		+--------+
		|Returns:|
		+--------+
		
		:param watermark: 水印图片信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示
		:type watermark: String
		
		Example::
		
			{
				...
				"watermark": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
				...
			}
		
二维码
================

二维码获取以及处理方式

.. class:: api.common.LoginInfoAction

    +---------+
    |DataType:|
    +---------+

    .. data:: loginInfo
	
    :param loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
    :type loginFlag: String
    :param userId: 用户编号
    :type userId: String
    :param code: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
    :type code: Integer
    :param message: 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因
    :type message: String
    :param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
    :type authentication: String
    :param optime: 操作时间
    :type optime: long
    :param x: 位置信息 , x表示经度
    :type x: double
    :param y: 位置信息 , y表示纬度
    :type y: double
	
	.. method:: <C> QRCode
	
		获取二维码信息
		
		+--------+
		|Returns:|
		+--------+
		
		:param QRCode: 二维码信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示
		:type QRCode: String
		
		Example::
		
			{
				...
				"QRCode": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
				...
			}
	
	.. method:: <C> queryLoginInfoByLoginFlag
	
		获取二维码登陆状态
		
		+---------+
		|Requests:|
		+---------+
		
		:param loginInfo.loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
		:type loginInfo.loginFlag: String
		
		Example::
		
			{
				"loginInfo.loginFlag": "1f60e515cda647d1894295df49cc4467",
			}
			
		+--------+
		|Returns:|
		+--------+
		
		:param loginInfo: 二维码登陆信息 , 类型 :data:`loginInfo`
		:type loginInfo: object
		:param loginInfo.loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
		:type loginInfo.loginFlag: String
		:param loginInfo.code: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
		:type loginInfo.code: Integer
		:param authentication: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
		:type authentication: String
		
		Example::
		
			{
				...
				"loginInfo": {
					"loginFlag": "1f60e515cda647d1894295df49cc4467",
					"code": 0,
					"authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
				},
				...
			}
			
	.. method:: <C> updateLoginInfoForAuthentication
	
		更新二维码登陆状态 , 同时判断用户是否有权登陆系统
		
		+---------+
		|Requests:|
		+---------+
		
		:param loginInfo.loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
		:type loginInfo.loginFlag: String
		:param loginInfo.userId: 用户编号
		:type loginInfo.userId: String
		:param loginInfo.x: 位置信息 , x表示经度
		:type loginInfo.x: double
		:param loginInfo.y: 位置信息 , y表示纬度
		:type loginInfo.y: double
		
		Example::
		
			{
				"loginInfo.loginFlag": "1f60e515cda647d1894295df49cc4467",
				"loginInfo.userId": "U001",
				"loginInfo.x": 42.251251,
				"loginInfo.y": 123.52545852
			}
            
    .. method:: <C> deleteLoginInfo
    
        删除当前操作之前 , 无效的登陆信息
        
菜单
================

菜单信息

.. class:: api.common.IndexAction

	+---------+
	|DataType:|
	+---------+
	
	.. data:: tree
	
	:param id: 菜单ID
	:type id: Integer
	:param name: 菜单名称
	:type name: String
	:param url: 菜单URL
	:type url: String
	:param icon: 图标
	:type icon: String
	:param sub: 子菜单列表 , 每条数据类型 :data:`tree`
	
	.. method:: <I> createTree
	
		获取菜单信息
		
		+--------+
		|Returns:|
		+--------+
		
		:param tree: 菜单信息列表 , 每条数据类型 :data:`tree`
		:type tree: List
		
        Example::
            
            {
                ...
                "tree": [
                    {
                        "icon": "icon-dashboard",
                        "id": 1,
                        "name": "系统",
                        "sub": [
                            {
                                "icon": "icon-double-angle-right",
                                "id": 1,
                                "name": "大区",
                                "sub": [
                                    {
                                        "icon": "icon-pencil",
                                        "id": 1,
                                        "name": "大区",
                                        "sub": [],
                                        "url": "/views/system/region.html"
                                    }
                                ],
                                "url": "#"
                            },
                            {
                                "icon": "icon-double-angle-right",
                                "id": 2,
                                "name": "城市",
                                "sub": [
                                    {
                                        "icon": "icon-pencil",
                                        "id": 2,
                                        "name": "城市",
                                        "sub": [],
                                        "url": "/views/system/city.html"
                                    }
                                ],
                                "url": "#"
                            }
                        ]
                    }
                ],
                ...
            }
            
监控
================

.. class:: api.factory.MonitorAction

    +---------+
    |DataType:|
    +---------+

    .. data:: monitor

    :param mid: 监控ID
    :type mid: Long
    :param name: 名称
    :type name: String
    :param host: 主机地址
    :type host: String
    :param type: 类型 , 例如: sensor , mysql , nginx , tomcat , es , crond等
    :type type: String
    :param value: 监控数值
    :type value: String
    :param comment: 说明
    :type comment: String
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param count: 统计数 , 通常为异常统计信息
    :type count: Integer
    :param updateTime: 更新时间
    :type updateTime: Timestamp

    .. method:: <C> queryMonitor

        获取监控信息

    .. method:: <C> updateMonitor

        更新监控信息

服务
================

.. class:: api.factory.ServerAction

    +---------+
    |DataType:|
    +---------+

    .. data:: server

    :param sid: 服务ID
    :type sid: Long
    :param name: 名称
    :type name: String
    :param host: 地址
    :type host: String
    :param type: 类型 , 0: communion , 1: server , 2: media , 3: dmedia , 4: library , 5: store
    :type type: Short
    :param company: 公司
    :type company: Integer
    :param comment: 说明
    :type comment: String

    .. method:: <C> queryServer

        获取服务信息

硬件
================

.. class:: api.factory.MacontrolAction

    +---------+
    |DataType:|
    +---------+

    .. data:: macontrol

    :param mid: 硬件ID
    :type mid: Long
    :param name: 名称
    :type name: String
    :param mac: 地址
    :type mac: String
    :param ip: 地址
    :type ip: String
    :param buid: 归属人ID
    :type buid: Long
    :param status: 状态
    :type status: Short
    :param comment: 说明
    :type comment: String
    
    .. method:: <I> queryMacontrol
    
        通过归属人和地址获取硬件信息
        
    .. method:: <I> checkMacontrol
    
        验证硬件信息
        
    .. method:: <C> addMacontrol
    
        添加硬件信息
        
    .. method:: <I> deleteMacontrol
    
        删除硬件信息

资源
================

.. class:: api.common.UploadAction

    .. method:: <I> uploadFile
    
        上传资源 , 控制文件大小类型等处理

导入
================

导入

.. class:: api.imports.AccessoriesTypeImport

    辅料类型导入

    .. method:: <I> importAccessoriesType
    
        辅料类型导入
        
.. class:: api.imports.GoodsImport

    商品颜色导入
    
    .. method:: <I> importGoods
    
        商品导入

    .. method:: <I> importColor
    
        商品颜色导入
        
    .. method:: <I> importFormat
    
        商品规格导入
        
    .. method:: <I> importPrice
    
        商品价格导入
        
    .. method:: <I> importDeletePrice
    
        导入方式删除商品价格
        
.. class:: api.imports.MaterialModuleImport

    主材商品型号导入

    .. method:: <I> importMaterialModule
    
        主材商品型号导入
        
.. class:: api.imports.QuotationItemImport

    报价项导入

    .. method:: <I> importQuotationItem
    
        报价项导入
        
.. class:: api.imports.WorkerSalaryImport

    工人工费导入
    
    .. method:: <I> importWorkerSalary
    
        工人工费基本导入
        
    .. method:: <I> batchImportWorkerSalary
    
        工人工费高级导入
        
.. class:: api.imports.UserSalaryImport

    员工薪资导入
    
    .. method:: <I> importUserSalary
    
        员工薪资基本导入

导出
================

导出

.. class:: api.exports.DecorationExportAction

    装修导出

    .. method:: <I> exportDecorationByContractTime
    
        根据签单时间导出装修单信息
        
.. class:: api.exports.PaymentExportAction

    款项导出

    .. method:: <I> exportDecorationPayment
    
        装修款导出
        
    .. method:: <I> exportMaterialPayment

        主材款导出
        
日志
================

.. class:: api.log.LogAction

    日志记录
    
    .. method:: <C> pageActionLog
    
        分页方式获取操作记录
        
    .. method:: <C> pageLoginLog
    
        分页方式获取登陆记录
    
        

    