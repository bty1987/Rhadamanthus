# 通用


## 登陆


登陆以及相关操作


> **类**: `api.common.LoginAction`


#### 数据类型: `role`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 角色ID | Integer |
| `name` | 角色名 | String |


#### 数据类型: `department`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 部门ID | Integer |
| `no` | 编号 | String |
| `name` | 部门名称 | String |
| `type` | 部门类型 | String |
| `subType` | 部门子类型 | String |
| `fatherDept` | 上级部门 | object |


#### 数据类型: `user`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uid` | 用户ID | Integer |
| `userId` | 用户编号 | String |
| `loginId` | 登录名 | String |
| `oldUserId` | 旧用户名 | String |
| `password` | 密码 | String |
| `userName` | 用户名 | String |
| `currentName` | 用户名 | String |
| `userPhoto` | 用户头像照片 | String |
| `deptType` | 部门类型 | String |
| `duty` | 职位 | String |
| `role` | 用户角色对象 , 类型 `role` | Object |
| `dept` | 所属部门 , 类型 `department` | Object |


#### 数据类型: `loginInfo`

| 参数 | 说明 | 类型 |
|------|------|------|
| `loginFlag` | 标识键值 , 可以通过该信息获取二维码登陆信息 | String |
| `userId` | 用户编号 | String |
| `code` | 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息 | Integer |
| `message` | 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因 | String |
| `authentication` | 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . | String |
| `optime` | 操作时间 | Long |
| `x` | 位置信息 , x表示经度 | Double |
| `y` | 位置信息 , y表示纬度 | Double |


##### `查询` doLogin

登陆 , 同时获取登陆结果信息 .

**Requests:**

- `userId` (String): 登陆用户编号
- `password` (String): 登陆密码
- `verifyCode` (String): 验证码
- `securityCode` (String): 安全码

```json
{
	userId: "U001",
	password: "password",
	verify: "1234",
	securityCode: "D0CCCF1C21CB4"
}
```

**Returns:**

- `authentication` (String): 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 .
- `user` (object): 登陆用户信息 , 类型 `user`

```json
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
```


##### `操作` logout

登出 , 同时删除登陆信息

**Returns:**

无


```json
{
    ...
}
```


##### `创建` requestAuthCode

免登 , 同时获取登陆信息

**Requests:**

- `userId` (String): 登陆用户编号
- `code` (String): 验证码
- `secret` (String): 安全码

```json
{
    "userId": "U001",
    "code": "C21CB4D0CCCF1",
    "secret": "C21CB4D0CCCF1"
}
```

**Returns:**

- `authentication` (String): 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 .

```json
{
    ...
    "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
    ...
}
```


##### `创建` changeAuthCode

更换 , 更新权限码中公司

**Requests:**

- `authentication` (String): 权限码

```json
{
    "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
}
```

**Returns:**

- `authentication` (String): 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 .

```json
{
    ...
    "authentication": "A9EDA0FCA5C7A2D10A7ECD3DCE2",
    ...
}
```


##### `创建` updateAuthCode

更换 , 更新权限码中有效时间

**Requests:**

- `authentication` (String): 权限码

```json
{
    "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
}
```

**Returns:**

- `authentication` (String): 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 .

```json
{
    ...
    "authentication": "A0FCA5C7A2A9EDD10A7ECD3DCE2",
    ...
}
```


##### `操作` ping

通过该API判断当前服务是否可用

**Returns:**

无


```json
{
    ...
}
```


##### `操作` current

获取当前系统时间

**Requests:**

- `current` (String): 时间格式 , 默认 yyyy-MM-dd hh:mm:ss

```json
{
    "current": "yyyy-MM-dd hh:mm:ss"
}
```

**Returns:**

- `current` (String): 时间

```json
{
    "current": "2016-01-01 00:00:00"
}
```

## 验证码


验证码获取以及处理方式


> **类**: `api.common.LoginAction`


##### `查询` queryVode

获取验证码信息

**Returns:**

- `securityCode` (String): 验证码信息

```json
{
	...
	"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
	...
}
```


##### `查询` verifyCode

获取验证码图片

**Requests:**

- `securityCode` (String): 验证码信息 , 利用  `queryVode` 接口获取到的securityCode

```json
{
	"securityCode": "C3FCFAA9AB125D8712BA9EDA010A7E8B0B5C",
}
```

**Returns:**

- `imageStream` (stream): 验证码图片流信息
## 水印


水印图片信息


> **类**: `api.common.WMCodeAction`


##### `查询` wmCode

获取水印图片

**Returns:**

- `watermark` (String): 水印图片信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示

```json
{
	...
	"watermark": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
	...
}
```

## 二维码


二维码获取以及处理方式


> **类**: `api.common.LoginInfoAction`


#### 数据类型: `loginInfo`

| 参数 | 说明 | 类型 |
|------|------|------|
| `loginFlag` | 标识键值 , 可以通过该信息获取二维码登陆信息 | String |
| `userId` | 用户编号 | String |
| `code` | 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息 | Integer |
| `message` | 错误信息 , 当code为非-1或0状态时 , 该信息表示操作错误的具体原因 | String |
| `authentication` | 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 . | String |
| `optime` | 操作时间 | long |
| `x` | 位置信息 , x表示经度 | double |
| `y` | 位置信息 , y表示纬度 | double |


##### `创建` QRCode

获取二维码信息

**Returns:**

- `QRCode` (String): 二维码信息 , 利用Base64进行编码的图片信息 , 支持页面直接显示

```json
{
	...
	"QRCode": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAID0lEQVR42u...",
	...
}
```


##### `创建` queryLoginInfoByLoginFlag

获取二维码登陆状态

**Requests:**

- `loginInfo.loginFlag` (String): 标识键值 , 可以通过该信息获取二维码登陆信息

```json
{
	"loginInfo.loginFlag": "1f60e515cda647d1894295df49cc4467",
}
```

**Returns:**

- `loginInfo` (object): 二维码登陆信息 , 类型 `loginInfo`
- `loginInfo.loginFlag` (String): 标识键值 , 可以通过该信息获取二维码登陆信息
- `loginInfo.code` (Integer): 登陆状态 , -1: 无操作 , 需要再次确认 , 0: 成功 , 其他代码表示失败 , 同时带有错误信息
- `authentication` (String): 权限码 , 成功登陆之后返回该编号 , 其他API请求需要携带该编号完成其他API请求动作 .

```json
{
	...
	"loginInfo": {
		"loginFlag": "1f60e515cda647d1894295df49cc4467",
		"code": 0,
		"authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2",
	},
	...
}
```


##### `创建` updateLoginInfoForAuthentication

更新二维码登陆状态 , 同时判断用户是否有权登陆系统

**Requests:**

- `loginInfo.loginFlag` (String): 标识键值 , 可以通过该信息获取二维码登陆信息
- `loginInfo.userId` (String): 用户编号
- `loginInfo.x` (double): 位置信息 , x表示经度
- `loginInfo.y` (double): 位置信息 , y表示纬度

```json
{
	"loginInfo.loginFlag": "1f60e515cda647d1894295df49cc4467",
	"loginInfo.userId": "U001",
	"loginInfo.x": 42.251251,
	"loginInfo.y": 123.52545852
}
```


##### `创建` deleteLoginInfo

删除当前操作之前 , 无效的登陆信息

## 菜单


菜单信息


> **类**: `api.common.IndexAction`


#### 数据类型: `tree`

| 参数 | 说明 | 类型 |
|------|------|------|
| `id` | 菜单ID | Integer |
| `name` | 菜单名称 | String |
| `url` | 菜单URL | String |
| `icon` | 图标 | String |
| `sub` | 子菜单列表 , 每条数据类型 `tree` |  |


##### `查询` createTree

获取菜单信息

**Returns:**

- `tree` (List): 菜单信息列表 , 每条数据类型 `tree`

```json
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
```

## 监控


> **类**: `api.factory.MonitorAction`


#### 数据类型: `monitor`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mid` | 监控ID | Long |
| `name` | 名称 | String |
| `host` | 主机地址 | String |
| `type` | 类型 , 例如: sensor , mysql , nginx , tomcat , es , crond等 | String |
| `value` | 监控数值 | String |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `count` | 统计数 , 通常为异常统计信息 | Integer |
| `updateTime` | 更新时间 | Timestamp |


##### `创建` queryMonitor

获取监控信息


##### `创建` updateMonitor

更新监控信息

## 服务


> **类**: `api.factory.ServerAction`


#### 数据类型: `server`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 服务ID | Long |
| `name` | 名称 | String |
| `host` | 地址 | String |
| `type` | 类型 , 0: communion , 1: server , 2: media , 3: dmedia , 4: library , 5: store | Short |
| `company` | 公司 | Integer |
| `comment` | 说明 | String |


##### `创建` queryServer

获取服务信息

## 硬件


> **类**: `api.factory.MacontrolAction`


#### 数据类型: `macontrol`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mid` | 硬件ID | Long |
| `name` | 名称 | String |
| `mac` | 地址 | String |
| `ip` | 地址 | String |
| `buid` | 归属人ID | Long |
| `status` | 状态 | Short |
| `comment` | 说明 | String |


##### `查询` queryMacontrol

通过归属人和地址获取硬件信息


##### `查询` checkMacontrol

验证硬件信息


##### `创建` addMacontrol

添加硬件信息


##### `查询` deleteMacontrol

删除硬件信息

## 资源


> **类**: `api.common.UploadAction`


##### `查询` uploadFile

上传资源 , 控制文件大小类型等处理

## 导入


导入


> **类**: `api.imports.AccessoriesTypeImport`


辅料类型导入


##### `查询` importAccessoriesType

辅料类型导入


> **类**: `api.imports.GoodsImport`


商品颜色导入


##### `查询` importGoods

商品导入


##### `查询` importColor

商品颜色导入


##### `查询` importFormat

商品规格导入


##### `查询` importPrice

商品价格导入


##### `查询` importDeletePrice

导入方式删除商品价格


> **类**: `api.imports.MaterialModuleImport`


主材商品型号导入


##### `查询` importMaterialModule

主材商品型号导入


> **类**: `api.imports.QuotationItemImport`


报价项导入


##### `查询` importQuotationItem

报价项导入


> **类**: `api.imports.WorkerSalaryImport`


工人工费导入


##### `查询` importWorkerSalary

工人工费基本导入


##### `查询` batchImportWorkerSalary

工人工费高级导入


> **类**: `api.imports.UserSalaryImport`


员工薪资导入


##### `查询` importUserSalary

员工薪资基本导入

## 导出


导出


> **类**: `api.exports.DecorationExportAction`


装修导出


##### `查询` exportDecorationByContractTime

根据签单时间导出装修单信息


> **类**: `api.exports.PaymentExportAction`


款项导出


##### `查询` exportDecorationPayment

装修款导出


##### `查询` exportMaterialPayment

主材款导出

## 日志


> **类**: `api.log.LogAction`


日志记录


##### `创建` pageActionLog

分页方式获取操作记录


##### `创建` pageLoginLog

分页方式获取登陆记录
