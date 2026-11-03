
## 补录接口 (自动生成 2026-11-03)


> **类**: `api.dingding.DingTalkAccessTokenAction`


##### `查询` queryDingTalkAccessToken

- **接口**: `queryDingTalkAccessToken.do`
- **方法**: `queryAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `accessToken` | DingTalkAccessTokenVO |

##### `查询` queryDingTalkJsapiTicket

- **接口**: `queryDingTalkJsapiTicket.do`
- **方法**: `queryJsapiTicket()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `jsapiTicket` | DingTalkJsapiTicketVO |

##### `新增` makeDingTalkAccessToken

- **接口**: `makeDingTalkAccessToken.do`
- **方法**: `makeAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

##### `更新` batchMakeDingTalkAccessToken

- **接口**: `batchMakeDingTalkAccessToken.do`
- **方法**: `batchmakeAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

##### `删除` deleteDingTalkAccessToken

- **接口**: `deleteDingTalkAccessToken.do`
- **方法**: `deleteAccessToken()`


> **类**: `api.dingding.DingTalkCallbackAction`


##### `更新` dingTalkCallback

- **接口**: `dingTalkCallback.do`
- **方法**: `dtalkCallback()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `signature` | String |  |
| `timestamp` | String |  |
| `nonce` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `encrypt` | String |


> **类**: `api.dingding.DingTalkDepartmentAction`


##### `查询` queryDingTalkDepartment

- **接口**: `queryDingTalkDepartment.do`
- **方法**: `queryDDDepartment()`
- **说明**: 查询钉钉部门列表

**出参:**

| 字段 | 类型 |
|------|------|
| `departments` | List<Department> |


> **类**: `api.dingding.DingTalkUserAction`


##### `查询` queryDingTalkUser

- **接口**: `queryDingTalkUser.do`
- **方法**: `queryUser()`
- **说明**: 查询钉钉用户

**出参:**

| 字段 | 类型 |
|------|------|
| `user` | User |

##### `新增` addDingTalkUser

- **接口**: `addDingTalkUser.do`
- **方法**: `addDingTalkUser()`
- **说明**: 添加钉钉用户

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `user` | User |  |
| `dids` | List<Long> |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `errcode` | int |

##### `更新` updateDingTalkUser

- **接口**: `updateDingTalkUser.do`
- **方法**: `updateUser()`
- **说明**: 更新钉钉用户

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `user` | User |  |
| `dids` | List<Long> |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `errcode` | int |

##### `删除` deleteDingTalkUser

- **接口**: `deleteDingTalkUser.do`
- **方法**: `deleteUser()`
- **说明**: 删除钉钉用户

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `user` | User |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `errcode` | int |

