
## 补录接口 (自动生成 2026-11-03)


> **类**: `api.wecom.WecomAccessTokenAction`


##### `查询` queryWecomAccessToken

- **接口**: `queryWecomAccessToken.do`
- **方法**: `queryAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `accessToken` | WecomAccessTokenVO |

##### `新增` makeWecomAccessToken

- **接口**: `makeWecomAccessToken.do`
- **方法**: `makeAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

##### `更新` batchMakeWecomAccessToken

- **接口**: `batchMakeWecomAccessToken.do`
- **方法**: `batchmakeAccessToken()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `company` | String |  |

##### `删除` deleteWecomAccessToken

- **接口**: `deleteWecomAccessToken.do`
- **方法**: `deleteAccessToken()`


> **类**: `api.wecom.WecomMessageAction`


##### `更新` sendWecomText

- **接口**: `sendWecomText.do`
- **方法**: `sendText()`
- **说明**: 发送应用文本消息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `receiveId` | String |  |
| `content` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `company` | Integer |
| `result` | int |

##### `更新` sendWecomTextCard

- **接口**: `sendWecomTextCard.do`
- **方法**: `sendTextCard()`
- **说明**: 发送应用文本卡片消息

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `receiveId` | String |  |
| `title` | String |  |
| `description` | String |  |
| `jumpUrl` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `company` | Integer |
| `result` | int |

##### `更新` sendWecomGroupText

- **接口**: `sendWecomGroupText.do`
- **方法**: `sendGroupText()`
- **说明**: 群机器人发送文本

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `content` | String |  |
| `webhookKey` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `result` | int |

##### `更新` sendWecomGroupMarkdown

- **接口**: `sendWecomGroupMarkdown.do`
- **方法**: `sendGroupMarkdown()`
- **说明**: 群机器人发送 markdown

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `webhookKey` | String |  |
| `markdown` | String |  |

**出参:**

| 字段 | 类型 |
|------|------|
| `result` | int |

