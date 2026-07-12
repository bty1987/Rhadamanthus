# 经纪人报备保护检查脚本

## 1. 功能概述

本脚本用于定时检查新建装修单是否已被渠道经纪人报备。

**业务流程：** ERP 系统在创建装修单（"转尺"流程）时，需要判断该客户是否已被经纪人报备过。如果有，则在装修附加信息中标记经纪人标识，供后续业务流程（关联线索/拦截）使用。

**执行逻辑：**

1. 每分钟查询 `decoration.decoration` 表中上一分钟创建的装修单
2. 关联查询客户手机号、楼盘地址等信息
3. 调用 fl-sync 服务的 `/clue/brokerReportCheck` 接口查询报备状态
4. 若已被报备，更新 `decoration.decorationaddition.brokerFlag = 1`

## 2. 文件位置

```
script/crond_broker_report_check.py
```

## 3. 前置依赖

### Python 依赖包

```
pip install pymysql requests pycryptodome
```

| 包名 | 用途 |
|---|---|
| `pymysql` | MySQL 数据库连接 |
| `requests` | HTTP 接口调用 |
| `pycryptodome` | AES 解密客户手机号和门牌号 |

### 运行环境要求

- Python 3.6+
- 网络可达数据库（192.168.5.21:3306）
- 网络可达 fl-sync 服务
- 数据库账号需有 `decoration` 库的 SELECT/UPDATE 权限

## 4. 配置说明

脚本顶部有四个配置块，需根据实际环境修改：

### 4.1 数据库配置

```python
DB_CONFIG = {
    'host': '192.168.5.21',
    'port': 3306,
    'user': 'root',
    'password': 'Neusoft!',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}
```

| 字段 | 说明 |
|---|---|
| `host` | 数据库地址 |
| `user` | 数据库用户名（需有 decoration 库读写权限） |
| `password` | 数据库密码 |

### 4.2 fl-sync 服务配置

```python
FL_SYNC_CONFIG = {
    'base_url': 'http://TODO:PORT',
    'broker_check_path': '/clue/brokerReportCheck',
    'timeout': 10,
}
```

| 字段 | 说明 |
|---|---|
| `base_url` | **必填** fl-sync 服务地址，如 `http://192.168.5.100:8080` |
| `broker_check_path` | 接口路径，默认无需修改 |
| `timeout` | HTTP 请求超时时间（秒） |

### 4.3 API 签名配置

```python
API_SIGN_CONFIG = {
    'appId': 'erp_contacts_sync',
    'appSecret': 'TODO',
}
```

| 字段 | 说明 |
|---|---|
| `appId` | 应用标识，已按接口文档固定为 `erp_contacts_sync` |
| `appSecret` | **必填** 对应的签名密钥，需向 fl-sync 团队获取 |

签名算法：`SHA256(requestParams + "#" + requestBody + "##" + headerStr + "###" + appSecret)`

对于本脚本的 GET 请求：
- `requestParams`：按参数名字典序排列的 key=value 拼接，如 `buildingNo=xxx&phone=138xxx`
- `requestBody`：空字符串
- `headerStr`：`appId=xxx&nonce=xxx&timestamp=xxx`

### 4.4 AES 解密配置

```python
AES_CONFIG = {
    'key': 'TODO',
    'iv': 'TODO',
}
```

| 字段 | 说明 |
|---|---|
| `key` | AES 解密密钥（与 Java 端 `SensitiveDataHelper` 一致） |
| `iv` | AES 初始化向量 |

数据库中 `customer.phone` 和 `house.houseNumber` 为 AES 加密存储，需解密后传给接口。

## 5. 运行方式

### 5.1 单次执行

用于测试或手动触发：

```bash
python crond_broker_report_check.py
```

执行一次后自动退出。

### 5.2 循环执行

用于长期部署，脚本自带循环：

```bash
python crond_broker_report_check.py --loop
```

默认每 60 秒执行一次，可通过 `--interval` 调整：

```bash
python crond_broker_report_check.py --loop --interval 30
```

按 `Ctrl+C` 停止。

### 5.3 调试模式

开启 DEBUG 级别日志（输出签名原文、接口响应等详细信息）：

```bash
python crond_broker_report_check.py --loop --debug
```

### 5.4 crontab 定时调用（备选方案）

如果不使用内置循环，也可通过 crontab 每分钟调用单次模式：

```bash
* * * * * cd /path/to/script && python crond_broker_report_check.py >> crond_broker_report_check.log 2>&1
```

## 6. 数据流

### 6.1 数据库查询

```sql
SELECT
    d.orderId,                           -- 装修订单号
    d.createTime,                        -- 创建时间
    c.phone AS encryptedPhone,           -- 客户手机号（AES加密）
    h.houseNumber AS encryptedHouseNumber, -- 门牌号（AES加密）
    v.name AS villageName                -- 楼盘名称（明文）
FROM decoration.decoration d
LEFT JOIN communion.customer c ON d.customerId = c.cid
LEFT JOIN communion.house h ON d.hid = h.hid
LEFT JOIN communion.village v ON h.villageId = v.vid
WHERE d.createTime >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)
  AND d.createTime < DATE_SUB(NOW(), INTERVAL 1 MINUTE)
  AND d.status != 5                      -- 排除废单
ORDER BY d.createTime ASC
LIMIT 200
```

时间窗口说明：查询 2 分钟前 ~ 1 分钟前的数据，留 1 分钟缓冲，避免边界数据遗漏。

### 6.2 接口调用

```
GET /clue/brokerReportCheck?phone=138xxxx1234&buildingNo=xxx&decorationOrderNo=xxx

Headers:
  appId: erp_contacts_sync
  timestamp: <13位毫秒时间戳>
  nonce: <UUID>
  sign: <SHA256签名>
```

响应：

```json
{
  "code": 0,
  "data": {
    "isBrokerReported": true,
    "clueNo": "CL20260512000001",
    "clueId": 123456
  },
  "msg": ""
}
```

三个查询参数均为可选，但至少传一个：
- `phone`：客户手机号（明文）
- `buildingNo`：楼盘地址（楼盘名 + 门牌号）
- `decorationOrderNo`：装修订单号

### 6.3 数据库更新

当 `isBrokerReported = true` 时：

```sql
UPDATE decoration.decorationaddition
SET brokerFlag = 1
WHERE orderId = 'xxx'
```

同时插入一条消息队列事件：

```sql
INSERT INTO information.messagequeuing (orderId, operation, args, createTime, status)
VALUES ('xxx', 'brokerDecoration', '{"orderId":"xxx","event":"BROKER_REPORT_MATCHED","clueNo":"CL20260512000001","clueId":123456}', NOW(), 0)
```

消息队列表 `information.messagequeuing` 结构：

| 字段 | 值 | 说明 |
|---|---|---|
| `orderId` | 装修订单号 | 关联装修单 |
| `operation` | `brokerDecoration` | 操作标识 |
| `args` | JSON 字符串 | 含 orderId, event, clueNo, clueId |
| `createTime` | `NOW()` | 创建时间 |
| `status` | `0` | 未处理（由 `crond_message_queue_processor` 后续消费） |

### 6.4 涉及的表和字段

| 库.表 | 字段 | 用途 |
|---|---|---|
| `decoration.decoration` | `doid` | 主键 |
| `decoration.decoration` | `orderId` | 装修订单号，关联 decorationaddition |
| `decoration.decoration` | `createTime` | 创建时间，用于筛选时间窗口 |
| `decoration.decoration` | `customerId` | 关联 customer 表 |
| `decoration.decoration` | `hid` | 关联 house 表 |
| `decoration.decoration` | `status` | 状态（排除废单 status=5） |
| `communion.customer` | `phone` | 客户手机号（AES 加密） |
| `communion.house` | `houseNumber` | 门牌号（AES 加密） |
| `communion.village` | `name` | 楼盘名称 |
| `decoration.decorationaddition` | `orderId` | 关联键（与 decoration.orderId 对应） |
| `decoration.decorationaddition` | `brokerFlag` | 经纪人报备标识（0=未报备，1=已报备） |
| `information.messagequeuing` | `orderId` | 装修订单号，关联事件与装修单 |
| `information.messagequeuing` | `operation` | 操作标识，值为 `brokerDecoration` |
| `information.messagequeuing` | `args` | JSON 参数，含 orderId/event/clueNo/clueId |
| `information.messagequeuing` | `status` | 0=未处理，由消息队列处理器后续消费 |

## 7. 日志

- **日志文件**：`crond_broker_report_check.log`（与脚本同目录）
- **日志级别**：INFO（默认）/ DEBUG（--debug 模式）
- **日志内容**：每次执行的检查数量、报备数量、更新结果、异常信息

关键日志示例：

```
2026-05-15 10:31:00 - INFO - 开始经纪人报备检查: 2026-05-15 10:31:00
2026-05-15 10:31:00 - INFO - 查询到 3 条上一分钟创建的装修单
2026-05-15 10:31:00 - INFO - 检查装修单: orderId=2605150001, phone=138xxxx1234, buildingNo=xx小区 1-1
2026-05-15 10:31:01 - INFO - 发现经纪人报备: orderId=2605150001, clueNo=CL20260512000001, clueId=123456
2026-05-15 10:31:01 - INFO - 更新 brokerFlag 成功: orderId=2605150001, clueNo=CL20260512000001, clueId=123456
2026-05-15 10:31:01 - INFO - 检查完成: 共3单, 报备1单, 更新1条, 失败0条, 耗时1.2s
```

## 8. 异常处理

| 场景 | 处理方式 |
|---|---|
| 数据库连接失败 | 记录错误日志，跳过本次执行 |
| 接口调用超时 | 记录错误日志，跳过该单（下次不会再查，因为时间窗口已过） |
| 接口返回非0 | 记录警告日志，跳过该单 |
| decorationaddition 无对应记录 | 记录警告日志（可能装修单还未同步附加信息） |
| AES 解密失败 | 返回原始密文继续调用接口 |
| 配置未填写 | appSecret 未配置时不带签名；AES 未配置时不解密直接传原值 |

## 9. 待确认事项

以下配置需根据实际环境填写后才能正常运行：

- [ ] `FL_SYNC_CONFIG.base_url` — fl-sync 服务地址
- [ ] `API_SIGN_CONFIG.appSecret` — `erp_contacts_sync` 的签名密钥
- [ ] `AES_CONFIG.key` / `AES_CONFIG.iv` — 手机号解密密钥（如接口可接受加密值则可不配）
