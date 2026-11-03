
## 补录接口 (自动生成 2026-11-03)


> **类**: `api.wechat.WeChatAccessTokenAction`


##### `查询` queryWeChatAccessToken

- **接口**: `queryWeChatAccessToken.do`
- **方法**: `queryAccessTokenForNew()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `accessToken` | WeChatAccessTokenVO |

##### `查询` queryWeChatJsapiTicket

- **接口**: `queryWeChatJsapiTicket.do`
- **方法**: `queryWJsapiTicketForNew()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `jsapiTicket` | WeChatJsapiTicketVO |

##### `新增` makeWeChatAccessToken

- **接口**: `makeWeChatAccessToken.do`
- **方法**: `makeAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `type` | Short |  |
| `company` | String |  |

##### `删除` deleteWeChatAccessToken

- **接口**: `deleteWeChatAccessToken.do`
- **方法**: `deleteAccessToken()`

##### `删除` deleteWeChatOpenAccessToken

- **接口**: `deleteWeChatOpenAccessToken.do`
- **方法**: `deleteWOpenAccessToken()`


> **类**: `api.wechat.WeChatAppAction`


##### `新增` makeWeChatAppSession

- **接口**: `makeWeChatAppSession.do`
- **方法**: `makeSession()`
- **说明**: 创建小程序 Session

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `userInfo` | WeChatUserInfoVO |

##### `查询` queryWeChatAppUserInfo

- **接口**: `queryWeChatAppUserInfo.do`
- **方法**: `queryUserInfoWithCompany()`
- **说明**: 获取用户信息（重新获取 session_key）

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | String |  |
| `encryptedData` | String |  |
| `iv` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `userInfo` | WeChatUserInfoVO |

##### `查询` queryWeChatAppUserInfoByCache

- **接口**: `queryWeChatAppUserInfoByCache.do`
- **方法**: `queryUserInfoByCache()`
- **说明**: 获取用户信息（使用缓存的 session_key）

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | String |  |
| `encryptedData` | String |  |
| `iv` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `userInfo` | WeChatUserInfoVO |

##### `查询` queryWeChatAppGroupInfo

- **接口**: `queryWeChatAppGroupInfo.do`
- **方法**: `queryGroupInfo()`
- **说明**: 获取群组信息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | String |  |
| `encryptedData` | String |  |
| `iv` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `groupInfo` | WeChatGroupInfoVO |

##### `查询` queryWeChatAppPhoneInfo

- **接口**: `queryWeChatAppPhoneInfo.do`
- **方法**: `queryPhoneInfo()`
- **说明**: 获取手机号信息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `phoneInfo` | WeChatPhoneInfoVO |

##### `删除` deleteWeChatAppSession

- **接口**: `deleteWeChatAppSession.do`
- **方法**: `deleteSession()`
- **说明**: 删除过期的 Session


> **类**: `api.wechat.WeChatConfigAction`


##### `查询` queryWeChatConfig

- **接口**: `queryWeChatConfig.do`
- **方法**: `queryWXConfig()`
- **说明**: 查询微信 JS-SDK 配置（通过 VO 对象）

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | String |  |
| `query` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `wxConfigVO` | WeChatConfigVO |

##### `更新` getWeChatConfig

- **接口**: `getWeChatConfig.do`
- **方法**: `getConfig()`
- **说明**: 获取微信 JS-SDK 配置（JSON 格式字符串）

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | String |  |
| `query` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `configJson` | String |


> **类**: `api.wechat.WeChatMessageAction`


##### `更新` sendWeChatPaymentMessage

- **接口**: `sendWeChatPaymentMessage.do`
- **方法**: `sendPaymentMessage()`
- **说明**: 发送支付通知消息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `unionId` | String |  |
| `name` | String |  |
| `orderId` | String |  |
| `money` | String |  |
| `comment` | String |  |

##### `更新` sendWeChatServiceSchedule

- **接口**: `sendWeChatServiceSchedule.do`
- **方法**: `sendServiceScheduleWithUrl()`
- **说明**: 发送服务进度通知消息（含路径）

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `unionId` | String |  |
| `name` | String |  |
| `orderId` | String |  |
| `content` | String |  |
| `path` | String |  |


> **类**: `api.wechat.WeChatServerAction`


##### `查询` queryWeChatServerUrl

- **接口**: `queryWeChatServerUrl.do`
- **方法**: `queryServerUrl()`
- **说明**: 获取 communion 服务器地址

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `communion` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `serverUrl` | String |


> **类**: `api.wechat.WeChatUserBindAction`


##### `查询` queryWeChatUserBind

- **接口**: `queryWeChatUserBind.do`
- **方法**: `queryUserBind()`
- **说明**: 查询微信用户绑定的系统用户

**出参:**

| 字段 | 类型 |
|------|------|
| `userBindVO` | WeChatUserBindVO |

##### `新增` addWeChatUserBind

- **接口**: `addWeChatUserBind.do`
- **方法**: `addUserBind()`
- **说明**: 添加或更新微信用户绑定

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `userBindVO` | WeChatUserBindVO |  |

##### `删除` deleteWeChatUserBind

- **接口**: `deleteWeChatUserBind.do`
- **方法**: `deleteUserBind()`
- **说明**: 删除微信用户绑定

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `userBindVO` | WeChatUserBindVO |  |


> **类**: `api.wechat.WeChatUserInfoAction`


##### `查询` queryWeChatUserInfo

- **接口**: `queryWeChatUserInfo.do`
- **方法**: `queryUserInfo()`
- **说明**: 查询微信公众号用户信息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `openId` | String |  |
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `userInfo` | WeChatUserInfoVO |

