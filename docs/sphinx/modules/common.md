# common {#common}

# 通用
## 登陆

登陆以及相关操作

## api.common.LoginAction

        |DataType:|
        #### role

    - **rid**: 角色ID
      - 类型: *Integer*
    - **name**: 角色名
      - 类型: *String*

    #### department

    - **did**: 部门ID
      - 类型: *Integer*
    - **no**: 编号
      - 类型: *String*
    - **name**: 部门名称
      - 类型: *String*
    - **type**: 部门类型
      - 类型: *String*
    - **subType**: 部门子类型
      - 类型: *String*
    - **fatherDept**: 上级部门
      - 类型: *object*

    #### user

    - **uid**: 用户ID
      - 类型: *Integer*
    - **userId**: 用户编号
      - 类型: *String*
    - **loginId**: 登录名
      - 类型: *String*
    - **oldUserId**: 旧用户名
      - 类型: *String*
    - **password**: 密码
      - 类型: *String*
    - **userName**: 用户名
      - 类型: *String*
    - **currentName**: 用户名
      - 类型: *String*
    - **userPhoto**: 用户头像照片
      - 类型: *String*
    - **deptType**: 部门类型
      - 类型: *String*
    - **duty**: 职位
      - 类型: *String*
    - **role**: 用户角色对象 , 类型 *role*
      - 类型: *Object*
    - **dept**: 所属部门 , 类型 *department*
      - 类型: *Object*

    #### loginInfo

    - **loginFlag**: 标识键值 , 可以通过该信息获取二维码登陆信息
      - 类型: *String*
    - **userId**: 用户编号
      - 类型: *String*
    - **code**: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
      - 类型: *Integer*
    - **message**: 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因
      - 类型: *String*
    - **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
      - 类型: *String*
    - **optime**: 操作时间
      - 类型: *Long*
    - **x**: 位置信息 , x表示经度
      - 类型: *Double*
    - **y**: 位置信息 , y表示纬度
      - 类型: *Double*
	
	### <I> doLogin

		登陆 , 同时获取登陆结果信息 . 
		
				|Requests:|
				- **userId**: 登陆用户编号
		  - 类型: *String*
		- **password**: 登陆密码
		  - 类型: *String*
		- **verifyCode**: 验证码
		  - 类型: *String*
		- **securityCode**: 安全码
		  - 类型: *String*
		
		Example::
		
			{
				userId: "U001",
				password: "password",
				verify: "1234",
				securityCode: "D0CCCF1C21CB4"
			}
		
				|Returns:|
				- **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
		  - 类型: *String*
		- **user**: 登陆用户信息 , 类型 *user*
		  - 类型: *object*
		
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
            
    ### <A> logout

        登出 , 同时删除登陆信息
        
                |Returns:|
        		无
		
        Example::

            {
                ...
            }

    ### <C> requestAuthCode

        免登 , 同时获取登陆信息

                |Requests:|
                - **userId**: 登陆用户编号
          - 类型: *String*
        - **code**: 验证码
          - 类型: *String*
        - **secret**: 安全码
          - 类型: *String*
		
        Example::

            {
                "userId": "U001",
                "code": "C21CB4D0CCCF1",
                "secret": "C21CB4D0CCCF1"
            }
			
                |Returns:|
                - **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
          - 类型: *String*

        Example::

            {
                ...
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
                ...
            }
            
    ### <C> changeAuthCode

        更换 , 更新权限码中公司
        
                |Requests:|
                - **authentication**: 权限码
          - 类型: *String*
		
        Example::

            {
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
            }
            
                |Returns:|
                - **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
          - 类型: *String*

        Example::

            {
                ...
                "authentication": "A9EDA0FCA5C7A2D10A7ECD3DCE2",
                ...
            }
            
    ### <C> updateAuthCode

        更换 , 更新权限码中有效时间
        
                |Requests:|
                - **authentication**: 权限码
          - 类型: *String*
		
        Example::

            {
                "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
            }
            
                |Returns:|
                - **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
          - 类型: *String*

        Example::

            {
                ...
                "authentication": "A0FCA5C7A2A9EDD10A7ECD3DCE2",
                ...
            }
            
    ### <A> ping

        通过该API判断当前服务是否可用
        
                |Returns:|
                无

        Example::

            {
                ...
            }

    ### <A> current

        获取当前系统时间
        
                |Requests:|
                - **current**: 时间格式 , 默认 yyyy-MM-dd hh:mm:ss
          - 类型: *String*
		
        Example::

            {
                "current": "yyyy-MM-dd hh:mm:ss"
            }
        
                |Returns:|
                - **current**: 时间
          - 类型: *String*
		
        Example::

            {
                "current": "2016-01-01 00:00:00"
            }
			
## 验证码

验证码获取以及处理方式

## api.common.LoginAction

	### <I> queryVode

		获取验证码信息
		
				|Returns:|
				- **securityCode**: 验证码信息
		  - 类型: *String*
		
		Example::
		
			{
				...
				"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
				...
			}
	
	### <I> verifyCode

		获取验证码图片
		
				|Requests:|
				- **securityCode**: 验证码信息 , 利用  *queryVode* 接口获取到的securityCode
		  - 类型: *String*
		
		Example::
		
			{
				"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
			}
		
				|Returns:|
				- **imageStream**: 验证码图片流信息
		  - 类型: *stream*

## 水印

水印图片信息

## api.common.WMCodeAction

	### <I> wmCode

		获取水印图片
		
				|Returns:|
				- **watermark**: 水印图片信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示
		  - 类型: *String*
		
		Example::
		
			{
				...
				"watermark": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
				...
			}
		
## 二维码

二维码获取以及处理方式

## api.common.LoginInfoAction

        |DataType:|
        #### loginInfo

    - **loginFlag**: 标识键值 , 可以通过该信息获取二维码登陆信息
      - 类型: *String*
    - **userId**: 用户编号
      - 类型: *String*
    - **code**: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
      - 类型: *Integer*
    - **message**: 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因
      - 类型: *String*
    - **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
      - 类型: *String*
    - **optime**: 操作时间
      - 类型: *long*
    - **x**: 位置信息 , x表示经度
      - 类型: *double*
    - **y**: 位置信息 , y表示纬度
      - 类型: *double*
	
	### <C> QRCode

		获取二维码信息
		
				|Returns:|
				- **QRCode**: 二维码信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示
		  - 类型: *String*
		
		Example::
		
			{
				...
				"QRCode": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
				...
			}
	
	### <C> queryLoginInfoByLoginFlag

		获取二维码登陆状态
		
				|Requests:|
				:param loginInfo.loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
		:type loginInfo.loginFlag: String
		
		Example::
		
			{
				"loginInfo.loginFlag": "1f60e515cda647d1894295df49cc4467",
			}
			
				|Returns:|
				- **loginInfo**: 二维码登陆信息 , 类型 *loginInfo*
		  - 类型: *object*
		:param loginInfo.loginFlag: 标识键值 , 可以通过该信息获取二维码登陆信息
		:type loginInfo.loginFlag: String
		:param loginInfo.code: 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
		:type loginInfo.code: Integer
		- **authentication**: 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . 
		  - 类型: *String*
		
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
			
	### <C> updateLoginInfoForAuthentication

		更新二维码登陆状态 , 同时判断用户是否有权登陆系统
		
				|Requests:|
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
            
    ### <C> deleteLoginInfo

        删除当前操作之前 , 无效的登陆信息
        
## 菜单

菜单信息

## api.common.IndexAction

		|DataType:|
		#### tree

	- **id**: 菜单ID
	  - 类型: *Integer*
	- **name**: 菜单名称
	  - 类型: *String*
	- **url**: 菜单URL
	  - 类型: *String*
	- **icon**: 图标
	  - 类型: *String*
	- **sub**: 子菜单列表 , 每条数据类型 *tree*
	
	### <I> createTree

		获取菜单信息
		
				|Returns:|
				- **tree**: 菜单信息列表 , 每条数据类型 *tree*
		  - 类型: *List*
		
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
            
## 监控

## api.factory.MonitorAction

        |DataType:|
        #### monitor

    - **mid**: 监控ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **host**: 主机地址
      - 类型: *String*
    - **type**: 类型 , 例如: sensor , mysql , nginx , tomcat , es , crond等
      - 类型: *String*
    - **value**: 监控数值
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **count**: 统计数 , 通常为异常统计信息
      - 类型: *Integer*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*

    ### <C> queryMonitor

        获取监控信息

    ### <C> updateMonitor

        更新监控信息

## 服务

## api.factory.ServerAction

        |DataType:|
        #### server

    - **sid**: 服务ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **host**: 地址
      - 类型: *String*
    - **type**: 类型 , 0: communion , 1: server , 2: media , 3: dmedia , 4: library , 5: store
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*

    ### <C> queryServer

        获取服务信息

## 硬件

## api.factory.MacontrolAction

        |DataType:|
        #### macontrol

    - **mid**: 硬件ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **mac**: 地址
      - 类型: *String*
    - **ip**: 地址
      - 类型: *String*
    - **buid**: 归属人ID
      - 类型: *Long*
    - **status**: 状态
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> queryMacontrol

        通过归属人和地址获取硬件信息
        
    ### <I> checkMacontrol

        验证硬件信息
        
    ### <C> addMacontrol

        添加硬件信息
        
    ### <I> deleteMacontrol

        删除硬件信息

## 资源

## api.common.UploadAction

    ### <I> uploadFile

        上传资源 , 控制文件大小类型等处理

## 导入

导入

## api.imports.AccessoriesTypeImport

    辅料类型导入

    ### <I> importAccessoriesType

        辅料类型导入
        
## api.imports.GoodsImport

    商品颜色导入
    
    ### <I> importGoods

        商品导入

    ### <I> importColor

        商品颜色导入
        
    ### <I> importFormat

        商品规格导入
        
    ### <I> importPrice

        商品价格导入
        
    ### <I> importDeletePrice

        导入方式删除商品价格
        
## api.imports.MaterialModuleImport

    主材商品型号导入

    ### <I> importMaterialModule

        主材商品型号导入
        
## api.imports.QuotationItemImport

    报价项导入

    ### <I> importQuotationItem

        报价项导入
        
## api.imports.WorkerSalaryImport

    工人工费导入
    
    ### <I> importWorkerSalary

        工人工费基本导入
        
    ### <I> batchImportWorkerSalary

        工人工费高级导入
        
## api.imports.UserSalaryImport

    员工薪资导入
    
    ### <I> importUserSalary

        员工薪资基本导入

## 导出

导出

## api.exports.DecorationExportAction

    装修导出

    ### <I> exportDecorationByContractTime

        根据签单时间导出装修单信息
        
## api.exports.PaymentExportAction

    款项导出

    ### <I> exportDecorationPayment

        装修款导出
        
    ### <I> exportMaterialPayment

        主材款导出
        
## 日志

## api.log.LogAction

    日志记录
    
    ### <C> pageActionLog

        分页方式获取操作记录
        
    ### <C> pageLoginLog

        分页方式获取登陆记录
