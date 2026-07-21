# wecom - 企业微信集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **wecom**

> 最后更新：2026-07-05

---

## 模块职责

wecom 模块负责**企业微信(WeCom)自建应用的消息推送集成**, 提供应用消息与群机器人 webhook 两条推送通道。

**接入范围**
- ✅ 应用 access_token 管理(懒加载刷新, DB 缓存)
- ✅ 应用消息推送(text / textcard)
- ✅ 群机器人 webhook 推送(text / markdown)
- ❌ OAuth 单点登录 / 通讯录同步 / 审批对接 / 回调事件接收(本期不做)

**与既有模块的关系**
- 结构镜像 `com.fanglin.dingding` 模块(钉钉是最接近的脚手架)
- 复用 `com.fanglin.dingding.utils.HttpHelper`(fastjson + Apache HttpClient)
- token 缓存表 `hades.eaccesstoken` 独立于公众号 `waccesstoken` / 钉钉 `daccesstoken`

---

## 核心包结构

```
wecom/
├── action/        - WecomAccessTokenAction (token 管理) / WecomMessageAction (推送自测/运维)
├── service/       - WecomAccessTokenService / WecomMessageService
│   └── impl/      - 对应实现
├── dao/           - WecomAccessTokenDao
│   └── impl/      - WecomAccessTokenDaoImpl
├── po/            - WecomAccessTokenPO (@Table hades.eaccesstoken)
├── vo/            - WecomAccessTokenVO
└── utils/
    └── WecomApi   - 企业微信 API URL 常量
```

---

## 对外接口

### Action 端点 (token 管理)

| 接口 | 路径 | 说明 |
|------|------|------|
| queryWecomAccessToken | `/queryWecomAccessToken.do?company=xxx` | 查询缓存 token |
| makeWecomAccessToken  | `/makeWecomAccessToken.do?company=xxx` | 主动刷新 token(供外部 cron) |
| batchMakeWecomAccessToken | `/batchMakeWecomAccessToken.do?company=xxx` | 批量刷新 0..company |
| deleteWecomAccessToken | `/deleteWecomAccessToken.do` | 清理过期 token |

### Action 端点 (消息推送 - 自测/运维入口)

> 业务代码请直接 `@Autowired WecomMessageService` 调用, 不走 HTTP。
> 这些端点供联调自测、外部系统主动推送、运维触发使用。

| 接口 | 路径 | 关键参数 | 说明 |
|------|------|---------|------|
| sendWecomText | `/sendWecomText.do` | receiveId, content, company | 应用文本消息 |
| sendWecomTextCard | `/sendWecomTextCard.do` | receiveId, title, description, jumpUrl, company | 应用文本卡片 |
| sendWecomGroupText | `/sendWecomGroupText.do` | webhookKey, content | 群机器人文本 |
| sendWecomGroupMarkdown | `/sendWecomGroupMarkdown.do` | webhookKey, markdown | 群机器人 markdown |

所有推送端点返回 `result` 字段: `0`=成功, `-1`=配置/token 异常, 其他=企业微信 errcode。

> `company` 参数取 `FormatUtil.encodeCompany(int)` 编码后的字符串。

### Service 接口 (供业务代码调用)

```java
@Autowired
private WecomMessageService wecomMessageService;

// 应用消息: 文本卡片(含跳转)
wecomMessageService.sendTextCard(receiveId, title, description, jumpUrl, company);

// 应用消息: 纯文本
wecomMessageService.sendText(receiveId, content, company);

// 群机器人: 文本
wecomMessageService.sendGroupText(webhookKey, content);

// 群机器人: markdown
wecomMessageService.sendGroupMarkdown(webhookKey, markdown);
```

**接收人约定**: `receiveId` 直接传 ERP 员工号 `UserPO.getUserId()`, 前提是企业微信通讯录 userid 与 ERP 员工号保持一致(部署时保证)。

---

## 关键 SystemConfig 配置

| key | 作用 | 作用域 | 示例 |
|-----|------|--------|------|
| `WECOM_OAPI_URL_STR` | API 域名 | 全局 | `https://qyapi.weixin.qq.com` |
| `WECOM_CORPID_STR` | 企业 CorpID | 按公司 | `wwxxx` |
| `WECOM_SECRET_STR` | 自建应用 Secret | 按公司 | `xxx` |
| `WECOM_AGENTID_STR` | 自建应用 AgentID | 按公司 | `1000002` |
| `MESSAGE_WECOM_GROUP_*` | 业务群机器人 webhook key | 按需 | webhook key |

---

## Token 刷新机制

采用**懒加载模式**(与钉钉模块一致, 不引入调度器):

```
WecomMessageService.sendXxx()
  └─> WecomAccessTokenService.getAccessToken(company)
        ├─ 查 DB 缓存, 若 (now - operateTime) < 7200 - 300 秒, 直接返回
        └─ 否则调 gettoken 接口刷新, 落库后返回
```

外部 cron 可定期调 `makeWecomAccessToken.do` 兜底刷新。

---

## 失败处理约定

**消息推送失败不抛异常, 不阻断主业务流程**(与钉钉模块 11 处调用站约定一致):
- 用 `LogUtils.logging(logger, url, errcode, errmsg)` 记录
- 返回企业微信 errcode(0=成功, 非 0=失败), 由调用方决定是否处理

---

## 参考文档

- 企业微信自建应用开发: https://developer.work.weixin.qq.com/document/
- 群机器人 webhook: https://developer.work.weixin.qq.com/document/path/91770
- 脚手架来源: `src/com/fanglin/dingding/`(钉钉模块)
