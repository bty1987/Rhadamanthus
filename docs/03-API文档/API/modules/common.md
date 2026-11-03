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

## 补录接口 (自动生成 2026-11-03)


> **类**: `api.common.LoginAction`


##### `更新` requestLoginChallenge

- **接口**: `requestLoginChallenge.do`
- **方法**: `requestLoginChallenge()`
- **说明**: 生成登录挑战（nonce） 用于挑战-响应认证

**出参:**

| 字段 | 类型 |
|------|------|
| `nonce` | String |

##### `更新` phoneAuthCode

- **接口**: `phoneAuthCode.do`
- **方法**: `phoneAuthCode()`


> **类**: `api.common.BrandAction`


##### `删除` deleteBrandByBIds

- **接口**: `deleteBrandByBIds.do`
- **方法**: `deleteBrandByBIds()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `brands` | List<BrandVO> |  |


> **类**: `api.common.BrandPoolAction`


##### `查询` pageBrandPool

- **接口**: `pageBrandPool.do`
- **方法**: `pageBrandPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` queryBrandPoolByName

- **接口**: `queryBrandPoolByName.do`
- **方法**: `queryBrandPoolByName()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `brandPool` | BrandPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `brandPools` | List<BrandPoolVO> |

##### `新增` addBrandPool

- **接口**: `addBrandPool.do`
- **方法**: `addBrandPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `brandPool` | BrandPoolVO |  |

##### `更新` updateBrandPool

- **接口**: `updateBrandPool.do`
- **方法**: `updateBrandPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `brandPool` | BrandPoolVO |  |

##### `更新` updateBrandPoolForStatus

- **接口**: `updateBrandPoolForStatus.do`
- **方法**: `updateBrandPoolForStatus()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `brandPool` | BrandPoolVO |  |


> **类**: `api.common.BuildingNameRuleAction`


##### `新增` addBuildingNameRule

- **接口**: `addBuildingNameRule.do`
- **方法**: `addBuildingNameRule()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `buildingNameRule` | BuildingNameRuleVO |  |

##### `更新` updateBuildingNameRule

- **接口**: `updateBuildingNameRule.do`
- **方法**: `updateBuildingNameRule()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `buildingNameRule` | BuildingNameRuleVO |  |

##### `删除` deleteBuildingNameRule

- **接口**: `deleteBuildingNameRule.do`
- **方法**: `deleteBuildingNameRule()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `buildingNameRule` | BuildingNameRuleVO |  |


> **类**: `api.common.CategoryFormatAction`


##### `查询` queryCategoryFormatByCid

- **接口**: `queryCategoryFormatByCid.do`
- **方法**: `queryCategoryFormatByCid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `categoryFormat` | CategoryFormatVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `categoryFormats` | List<CategoryFormatVO> |

##### `新增` addCategoryFormat

- **接口**: `addCategoryFormat.do`
- **方法**: `addCategoryFormat()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `categoryFormat` | CategoryFormatVO |  |

##### `更新` updateCategoryFormat

- **接口**: `updateCategoryFormat.do`
- **方法**: `updateCategoryFormat()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `categoryFormat` | CategoryFormatVO |  |

##### `删除` deleteCategoryFormat

- **接口**: `deleteCategoryFormat.do`
- **方法**: `deleteCategoryFormat()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `categoryFormat` | CategoryFormatVO |  |


> **类**: `api.common.CityProperPartnerAction`


##### `查询` queryCityProperPartner

- **接口**: `queryCityProperPartner.do`
- **方法**: `queryCityProperPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cityProperPartner` | CityProperPartnerVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `cityProperPartners` | List<CityProperPartnerVO> |

##### `新增` addCityProperPartner

- **接口**: `addCityProperPartner.do`
- **方法**: `addCityProperPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cityProperPartner` | CityProperPartnerVO |  |

##### `删除` deleteCityProperPartner

- **接口**: `deleteCityProperPartner.do`
- **方法**: `deleteCityProperPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cityProperPartner` | CityProperPartnerVO |  |


> **类**: `api.common.ColorPoolAction`


##### `查询` pageColorPool

- **接口**: `pageColorPool.do`
- **方法**: `pageColorPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` queryColorPoolByGpid

- **接口**: `queryColorPoolByGpid.do`
- **方法**: `queryColorPoolByGpid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `colorPool` | ColorPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `colorPools` | List<ColorPoolVO> |

##### `查询` queryColorPoolForEnableByGpid

- **接口**: `queryColorPoolForEnableByGpid.do`
- **方法**: `queryColorPoolForEnableByGpid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `colorPool` | ColorPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `colorPools` | List<ColorPoolVO> |

##### `新增` addColorPool

- **接口**: `addColorPool.do`
- **方法**: `addColorPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `colorPool` | ColorPoolVO |  |

##### `更新` updateColorPoolForStatus

- **接口**: `updateColorPoolForStatus.do`
- **方法**: `updateColorPoolForStatus()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `colorPool` | ColorPoolVO |  |


> **类**: `api.common.CustomerAccountAction`


##### `查询` queryCustomerAccount

- **接口**: `queryCustomerAccount.do`
- **方法**: `queryCustomerAccount()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerAccount` | CustomerAccountVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `customerAccounts` | List<CustomerAccountVO> |

##### `查询` queryDefaultCustomerAccount

- **接口**: `queryDefaultCustomerAccount.do`
- **方法**: `queryDefaultCustomerAccount()`

**出参:**

| 字段 | 类型 |
|------|------|
| `customerAccount` | CustomerAccountVO |

##### `新增` addCustomerAccount

- **接口**: `addCustomerAccount.do`
- **方法**: `addCustomerAccount()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerAccount` | CustomerAccountVO |  |

##### `更新` updateCustomerAccount

- **接口**: `updateCustomerAccount.do`
- **方法**: `updateCustomerAccount()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerAccount` | CustomerAccountVO |  |

##### `删除` deleteCustomerAccount

- **接口**: `deleteCustomerAccount.do`
- **方法**: `deleteCustomerAccount()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerAccount` | CustomerAccountVO |  |

##### `更新` setDefaultCustomerAccount

- **接口**: `setDefaultCustomerAccount.do`
- **方法**: `setDefaultCustomerAccount()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerAccount` | CustomerAccountVO |  |


> **类**: `api.common.CustomerRecordAction`


##### `新增` addCustomerRecord

- **接口**: `addCustomerRecord.do`
- **方法**: `addCustomerRecord()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `customerRecord` | CustomerRecordVO |  |


> **类**: `api.common.DepartmentPartnerAction`


##### `查询` queryDepartmentPartner

- **接口**: `queryDepartmentPartner.do`
- **方法**: `queryDepartmentPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `departmentPartner` | DepartmentPartnerVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `departmentPartners` | List<DepartmentPartnerVO> |

##### `新增` addDepartmentPartner

- **接口**: `addDepartmentPartner.do`
- **方法**: `addDepartmentPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `departmentPartner` | DepartmentPartnerVO |  |

##### `删除` deleteDepartmentPartner

- **接口**: `deleteDepartmentPartner.do`
- **方法**: `deleteDepartmentPartner()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `departmentPartner` | DepartmentPartnerVO |  |


> **类**: `api.common.FormatPoolAction`


##### `查询` pageFormatPool

- **接口**: `pageFormatPool.do`
- **方法**: `pageFormatPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` queryFormatPoolByGpid

- **接口**: `queryFormatPoolByGpid.do`
- **方法**: `queryFormatPoolByGpid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `formatPool` | FormatPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `formatPools` | List<FormatPoolVO> |

##### `查询` queryFormatPoolForEnableByGpid

- **接口**: `queryFormatPoolForEnableByGpid.do`
- **方法**: `queryFormatPoolForEnableByGpid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `formatPool` | FormatPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `formatPools` | List<FormatPoolVO> |

##### `新增` addFormatPool

- **接口**: `addFormatPool.do`
- **方法**: `addFormatPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `formatPool` | FormatPoolVO |  |

##### `更新` updateFormatPoolForStatus

- **接口**: `updateFormatPoolForStatus.do`
- **方法**: `updateFormatPoolForStatus()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `formatPool` | FormatPoolVO |  |


> **类**: `api.common.GoodsPoolAction`


##### `查询` pageGoodsPool

- **接口**: `pageGoodsPool.do`
- **方法**: `pageGoodsPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |
| `goodsPool` | GoodsPoolVO |  |

##### `查询` queryGoodsPool

- **接口**: `queryGoodsPool.do`
- **方法**: `queryGoodsPool()`

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPools` | List<GoodsPoolVO> |

##### `查询` queryGoodsPoolByAtid

- **接口**: `queryGoodsPoolByAtid.do`
- **方法**: `queryGoodsPoolByAtid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPools` | List<GoodsPoolVO> |

##### `查询` queryGoodsPoolByNo

- **接口**: `queryGoodsPoolByNo.do`
- **方法**: `queryGoodsPoolByNo()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPools` | List<GoodsPoolVO> |

##### `查询` queryGoodsPoolByName

- **接口**: `queryGoodsPoolByName.do`
- **方法**: `queryGoodsPoolByName()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPools` | List<GoodsPoolVO> |

##### `查询` queryGoodsPoolByBarcode

- **接口**: `queryGoodsPoolByBarcode.do`
- **方法**: `queryGoodsPoolByBarcode()`

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPool` | GoodsPoolVO |

##### `查询` queryGoodsPoolByGpid

- **接口**: `queryGoodsPoolByGpid.do`
- **方法**: `queryGoodsPoolByGpid()`

**出参:**

| 字段 | 类型 |
|------|------|
| `goodsPool` | GoodsPoolVO |

##### `新增` addGoodsPool

- **接口**: `addGoodsPool.do`
- **方法**: `addGoodsPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |

##### `更新` batchAddFromPool

- **接口**: `batchAddFromPool.do`
- **方法**: `batchAddFromPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPools` | List<GoodsPoolVO> |  |

##### `更新` updateGoodsPool

- **接口**: `updateGoodsPool.do`
- **方法**: `updateGoodsPool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |

##### `更新` updateGoodsPoolForStatus

- **接口**: `updateGoodsPoolForStatus.do`
- **方法**: `updateGoodsPoolForStatus()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `goodsPool` | GoodsPoolVO |  |


> **类**: `api.common.PricePoolAction`


##### `查询` pagePricePool

- **接口**: `pagePricePool.do`
- **方法**: `pagePricePool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` queryPricePoolByGpid

- **接口**: `queryPricePoolByGpid.do`
- **方法**: `queryPricePoolByGpid()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `pricePool` | PricePoolVO |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `pricePools` | List<PricePoolVO> |

##### `查询` queryPricePoolByPpid

- **接口**: `queryPricePoolByPpid.do`
- **方法**: `queryPricePoolByPpid()`

**出参:**

| 字段 | 类型 |
|------|------|
| `pricePool` | PricePoolVO |

##### `新增` addPricePool

- **接口**: `addPricePool.do`
- **方法**: `addPricePool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `pricePool` | PricePoolVO |  |

##### `更新` updatePricePoolForStatus

- **接口**: `updatePricePoolForStatus.do`
- **方法**: `updatePricePoolForStatus()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `pricePool` | PricePoolVO |  |

##### `删除` deletePricePool

- **接口**: `deletePricePool.do`
- **方法**: `deletePricePool()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `pricePool` | PricePoolVO |  |


> **类**: `api.common.TaskAction`


##### `更新` updateTask

- **接口**: `updateTask.do`
- **方法**: `updateTask()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `task` | TaskVO |  |

##### `更新` syncRoleTask

- **接口**: `syncRoleTask.do`
- **方法**: `syncRoleTask()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `role` | RoleVO |  |
| `companys` | List<com.fanglin.system.vo.CompanyVO> |  |


> **类**: `api.common.VillageAction`


##### `更新` locateVillage

- **接口**: `locateVillage.do`
- **方法**: `locateVillage()`

**出参:**

| 字段 | 类型 |
|------|------|
| `village` | VillageVO |

