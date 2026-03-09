# 客户机会创建接口文档

## 接口概述

**接口名称**: addCustomerChance
**功能描述**: 创建新的客户机会信息，自动创建客户资源并分配归属人
**接口路径**: `/addCustomerChance.do`
**请求方式**: `POST`
**内容类型**: `application/x-www-form-urlencoded` 或 `application/json`
**字符编码**: `UTF-8`

**版本**: v1.0
**最后更新**: 2025-01-03
**维护方**: 方林装饰 ERP 团队

---

## 认证方式

### 请求头要求

| Header 名称 | 值 | 必填 | 说明 |
|-------------|---|------|------|
| `authentication` | AES 加密的认证串 | 是 | 用户身份认证 |
| `Content-Type` | application/x-www-form-urlencoded | 建议填 | 表单提交格式 |
| `Cookie` | authentication=xxx | 自动 | 浏览器自动携带 |

### 认证串格式

**加密前**:
```
userId=xxx,roleId=123,userName=张三,updateTime=1234567890,company=1,timeout=0,rollcall=0
```

**加密后**: Base64(AES-128-CBC 加密)

---

## 请求参数

### 参数列表

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `customerChance.cno` | String | 是 | 客户机会编号(唯一) | `"CH20250103001"` |
| `customerChance.busitype.dbid` | Integer | 是 | 业务类型ID | `1` (整装) / `2` (主材) |
| `customerChance.source.no` | String | 是 | 客户资源编号(唯一) | `"CS20250103001"` |
| `customerChance.source.name` | String | 是 | 客户姓名 | `"张三"` |
| `customerChance.source.phone` | String | 是 | 客户电话(11位) | `"13812345678"` |
| `customerChance.source.gender` | String | 否 | 性别 | `"男"` / `"女"` |
| `customerChance.source.village.vid` | Integer | 是 | 楼盘ID | `12345` |
| `customerChance.source.house.houseNumber` | String | 是 | 楼号房号 | `"1栋101"` |
| `customerChance.source.house.area` | Integer | 否 | 面积(平方米) | `120` |
| `customerChance.source.designer.userId` | String | 否 | 设计师ID | `"user001"` |
| `customerChance.source.salesman.userId` | String | 否 | 销售员ID | `"user002"` |
| `company` | String | 否 | 公司编号(AES加密) | AES 加密后的值 |

**重要变更（2025-01-03）**：
- ~~`customerChance.source.customer.cid`~~ - 已移除，系统会根据手机号自动创建或关联客户
- ~~`customerChance.source.house.hid`~~ - 已移除，系统会根据楼盘+楼号自动创建或关联房产
- ~~`customerChance.source.house.buildArea`~~ - 已移除

### 参数详细说明

#### 1. 客户机会编号 (`customerChance.cno`)
- **格式规则**: 建议使用 `CH` + 日期 + 序号，如 `CH20250103001`
- **唯一性要求**: 全局唯一，重复会返回错误码 330076
- **长度限制**: 不超过 50 个字符

#### 2. 业务类型 (`customerChance.busitype.dbid`)
- **可选值**:
  - `1`: 整装业务
  - `2`: 主材业务
- **说明**: 必须是系统中已配置的业务类型ID

#### 3. 客户资源编号 (`customerChance.source.no`)
- **格式规则**: 建议使用 `CS` + 日期 + 序号，如 `CS20250103001`
- **唯一性要求**: 全局唯一，重复会返回错误码 330072
- **长度限制**: 不超过 50 个字符

#### 4. 客户电话 (`customerChance.source.phone`)
- **格式**: 11 位手机号
- **验证规则**: 必须是有效的中国大陆手机号
- **脱敏处理**: 存入数据库时自动脱敏为 `138****5678`

#### 5. 楼盘ID (`customerChance.source.village.vid`)
- **说明**: 系统中已存在的楼盘ID
- **获取方式**: 调用楼盘查询接口获取

#### 6. 楼号房号 (`customerChance.source.house.houseNumber`)
- **格式**: 楼栋号 + 房号，如 `1栋101`、`A座1501`
- **必填性**: 必填
- **自动处理**: 系统会根据楼盘ID + 楼号自动判断房产是否存在，存在则引用，不存在则创建

#### 7. 客户与房产自动处理机制
- **客户处理**: 系统根据客户手机号（`customerChance.source.phone`）自动判断客户是否已存在
  - **存在**: 直接关联已有客户记录
  - **不存在**: 自动创建新客户记录（生成客户编号、拼音索引等）
- **房产处理**: 系统根据楼盘ID（`customerChance.source.village.vid`）和楼号房号（`customerChance.source.house.houseNumber`）自动判断房产是否已存在
  - **存在**: 直接引用已有房产记录
  - **不存在**: 自动创建新房产记录
- **优势**: 简化接口调用，无需预先查询或创建客户和房产信息

#### 8. 公司编号 (`company`)
- **格式**: AES 加密后的公司编号
- **必填性**: 可选，为空则使用当前用户所属公司
- **加密方式**: AES-128-CBC，密钥由系统配置

---

## 完整请求 JSON 示例

### application/json 格式

```json
{
  "customerChance": {
    "cno": "CH20250103001",
    "busitype": {
      "dbid": 1
    },
    "source": {
      "no": "CS20250103001",
      "name": "张三",
      "phone": "13812345678",
      "gender": "男",
      "village": {
        "vid": 12345
      },
      "house": {
        "houseNumber": "1栋101",
        "area": 120
      },
      "designer": {
        "userId": "user001"
      },
      "salesman": {
        "userId": "user002"
      }
    }
  },
  "company": "AES_ENCRYPTED_COMPANY_ID"
}
```

### application/x-www-form-urlencoded 格式

```
customerChance.cno=CH20250103001
&customerChance.busitype.dbid=1
&customerChance.source.no=CS20250103001
&customerChance.source.name=张三
&customerChance.source.phone=13812345678
&customerChance.source.gender=男
&customerChance.source.village.vid=12345
&customerChance.source.house.houseNumber=1栋101
&customerChance.source.house.area=120
&customerChance.source.designer.userId=user001
&customerChance.source.salesman.userId=user002
```

### 字段层级结构说明

```
customerChance (根对象)
├── cno: 客户机会编号
├── busitype: 业务类型
│   └── dbid: 业务类型ID
├── source: 客户资源
│   ├── no: 客户资源编号
│   ├── name: 客户姓名
│   ├── phone: 客户电话
│   ├── gender: 性别（可选）
│   ├── village: 楼盘信息
│   │   └── vid: 楼盘ID
│   ├── house: 房产信息
│   │   ├── houseNumber: 楼号房号
│   │   └── area: 面积（可选）
│   ├── designer: 设计师（可选）
│   │   └── userId: 设计师ID
│   └── salesman: 销售员（可选）
│       └── userId: 销售员ID
└── company: 公司编号（可选，AES加密）
```

### 最小必填 JSON 示例

```json
{
  "customerChance": {
    "cno": "CH20250103001",
    "busitype": {
      "dbid": 1
    },
    "source": {
      "no": "CS20250103001",
      "name": "张三",
      "phone": "13812345678",
      "village": {
        "vid": 12345
      },
      "house": {
        "houseNumber": "1栋101"
      }
    }
  }
}
```

**说明**：以上是最小必填字段的JSON示例，其他字段（gender、area、designer、salesman等）为可选字段。

---

## 响应格式

### 成功响应

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "customerChance": {
    "ccid": 123456,
    "cno": "CH20250103001",
    "status": 0,
    "isCheck": 0,
    "orderId": null,
    "createTime": 1704268800000,
    "source": {
      "csid": 789012,
      "no": "CS20250103001",
      "phone": "138****5678",
      "status": 0,
      "createTime": 1704268800000
    }
  }
}
```

**字段说明**:
- `ccid`: 客户机会ID（系统自动生成）
- `status`: 状态（0=初始, 1=已确认, 2=已完成, 3=已释放）
- `isCheck`: 验证状态（0=验证中, 1=已忽略）
- `orderId`: 关联订单ID（转单后生成）

### 错误响应

```json
{
  "errorCode": 330072,
  "errorMsg": "客户资源已存在"
}
```

---

## 错误码说明

| 错误码 | 错误信息 | 触发条件 | 解决方案 |
|--------|---------|---------|---------|
| `0` | 成功 | 接口调用成功 | - |
| `330071` | 客户资源不存在 | source 对象为空 | 检查请求参数完整性 |
| `330072` | 客户资源已存在 | 客户资源编号重复 | 更换编号或查询已存在资源 |
| `330075` | 客户机会不存在 | customerChance 对象为空 | 检查请求参数完整性 |
| `330076` | 客户机会已存在 | 客户机会编号重复 | 更换编号或查询已存在机会 |
| `130002` | 客户不存在 | 传入的客户ID无效 | 检查客户ID是否正确 |
| `130017` | 房产不存在 | 楼盘ID无效 | 检查楼盘ID是否正确 |
| `110005` | 登陆超时 | 认证串过期或无效 | 重新登录获取认证串 |
| `-2` | 无权限 | 用户无该操作权限 | 联系管理员分配权限 |

---

## 业务流程

```
1. 接收请求
   ├─ 验证认证串
   ├─ 解析请求参数
   └─ 校验参数完整性

2. 参数校验
   ├─ 客户机会编号唯一性
   ├─ 客户资源编号唯一性
   └─ 必填字段完整性

3. 自动处理客户和房产（新增）
   ├─ 根据手机号自动判断客户是否存在
   │  ├─ 存在：直接获取客户ID(cid)
   │  └─ 不存在：自动创建新客户并生成cid
   ├─ 根据楼盘ID+楼号自动判断房产是否存在
   │  ├─ 存在：直接获取房产ID(hid)
   │  └─ 不存在：自动创建新房产并生成hid
   └─ 将cid和hid设置到客户资源对象

4. 数据处理
   ├─ 客户电话脱敏 (138****5678)
   ├─ 设置业务类型
   └─ 设置创建人信息

5. 创建客户资源
   ├─ 使用已关联的客户ID(cid)
   ├─ 使用已关联的房产ID(hid)
   ├─ 关联楼盘信息
   └─ 保存客户资源记录

6. 分配客户资源
   ├─ 根据规则匹配归属人
   ├─ 设置归属部门/区域
   ├─ 更新客户机会状态
   └─ 发送通知消息

7. 返回结果
   └─ 返回创建的客户机会信息
```

---

## 调用示例

### cURL 示例

```bash
curl -X POST 'https://erp.example.com/addCustomerChance.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'customerChance.cno=CH20250103001' \
  -d 'customerChance.busitype.dbid=1' \
  -d 'customerChance.source.no=CS20250103001' \
  -d 'customerChance.source.name=张三' \
  -d 'customerChance.source.phone=13812345678' \
  -d 'customerChance.source.gender=男' \
  -d 'customerChance.source.village.vid=12345' \
  -d 'customerChance.source.house.houseNumber=1栋101' \
  -d 'customerChance.source.house.area=120'
```

### Java HttpClient 示例

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class AddCustomerChanceExample {

    public static void main(String[] args) throws Exception {
        // 1. 构建请求参数
        StringBuilder params = new StringBuilder();
        params.append("customerChance.cno=").append(URLEncoder.encode("CH20250103001", "UTF-8"));
        params.append("&customerChance.busitype.dbid=1");
        params.append("&customerChance.source.no=").append(URLEncoder.encode("CS20250103001", "UTF-8"));
        params.append("&customerChance.source.name=").append(URLEncoder.encode("张三", "UTF-8"));
        params.append("&customerChance.source.phone=13812345678");
        params.append("&customerChance.source.gender=").append(URLEncoder.encode("男", "UTF-8"));
        params.append("&customerChance.source.village.vid=12345");
        params.append("&customerChance.source.house.houseNumber=").append(URLEncoder.encode("1栋101", "UTF-8"));
        params.append("&customerChance.source.house.area=120");

        // 2. 创建HTTP客户端
        HttpClient client = HttpClient.newHttpClient();

        // 3. 构建请求
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://erp.example.com/addCustomerChance.do"))
            .header("authentication", "YOUR_ENCRYPTED_AUTH_STRING")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(params.toString()))
            .build();

        // 4. 发送请求
        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        // 5. 处理响应
        System.out.println("Response Code: " + response.statusCode());
        System.out.println("Response Body: " + response.body());
    }
}
```

### Python Requests 示例

```python
import requests

# 接口地址
url = "https://erp.example.com/addCustomerChance.do"

# 请求头
headers = {
    "authentication": "YOUR_ENCRYPTED_AUTH_STRING",
    "Content-Type": "application/x-www-form-urlencoded"
}

# 请求参数
data = {
    "customerChance.cno": "CH20250103001",
    "customerChance.busitype.dbid": 1,
    "customerChance.source.no": "CS20250103001",
    "customerChance.source.name": "张三",
    "customerChance.source.phone": "13812345678",
    "customerChance.source.gender": "男",
    "customerChance.source.village.vid": 12345,
    "customerChance.source.house.houseNumber": "1栋101",
    "customerChance.source.house.area": 120
}

# 发送POST请求
try:
    response = requests.post(url, headers=headers, data=data, timeout=30)

    # 检查响应状态
    if response.status_code == 200:
        result = response.json()

        if result["errorCode"] == 0:
            print("✅ 客户机会创建成功")
            print(f"客户机会ID: {result['customerChance']['ccid']}")
            print(f"客户机会编号: {result['customerChance']['cno']}")
            print(f"状态: {result['customerChance']['status']}")
        else:
            print(f"❌ 创建失败: {result['errorMsg']}")
            print(f"错误码: {result['errorCode']}")
    else:
        print(f"❌ HTTP请求失败: {response.status_code}")

except requests.exceptions.RequestException as e:
    print(f"❌ 请求异常: {e}")
```

### JavaScript/AJAX 示例

```javascript
// 使用 jQuery
$.ajax({
    url: 'https://erp.example.com/addCustomerChance.do',
    type: 'POST',
    headers: {
        'authentication': 'YOUR_ENCRYPTED_AUTH_STRING'
    },
    data: {
        'customerChance.cno': 'CH20250103001',
        'customerChance.busitype.dbid': 1,
        'customerChance.source.no': 'CS20250103001',
        'customerChance.source.name': '张三',
        'customerChance.source.phone': '13812345678',
        'customerChance.source.gender': '男',
        'customerChance.source.village.vid': 12345,
        'customerChance.source.house.houseNumber': '1栋101',
        'customerChance.source.house.area': 120
    },
    dataType: 'json',
    success: function(res) {
        if (res.errorCode == 0) {
            console.log('✅ 客户机会创建成功');
            console.log('客户机会ID:', res.customerChance.ccid);
            console.log('客户机会编号:', res.customerChance.cno);
        } else {
            console.error('❌ 创建失败:', res.errorMsg);
            console.error('错误码:', res.errorCode);
        }
    },
    error: function(xhr, status, error) {
        console.error('❌ 请求失败:', error);
    }
});
```

---

## 数据字典

### 业务类型 (busitype)

| ID | 名称 | 说明 |
|----|------|------|
| 1 | 整装 | 全屋整装业务 |
| 2 | 主材 | 主材销售业务 |
| 3 | 局改 | 局部改造业务 |

### 客户机会状态 (status)

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | 初始 | 刚创建，待分配 |
| 1 | 已确认 | 设计师已确认 |
| 2 | 已完成 | 已转装修单 |
| 3 | 已释放 | 客户资源已释放 |

### 验证状态 (isCheck)

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | 验证中 | 需要验证客户/房产 |
| 1 | 已忽略 | 跳过验证 |

---

## 注意事项

### ⚠️ 重要提示

1. **编号唯一性**
   - `cno` 和 `no` 必须全局唯一
   - 建议使用固定前缀+日期+序号格式
   - 重复提交会返回错误，不会覆盖已有数据

2. **电话号码处理**
   - 必须是 11 位有效手机号
   - 系统会自动脱敏存储（中间4位替换为****）
   - 原始号码不会明文存储在数据库中
   - 系统会根据手机号自动判断客户是否存在，无需手动传入客户ID

3. **客户与房产自动处理（重要）**
   - **客户处理**：系统根据手机号自动查找或创建客户
     - 无需预先查询客户是否存在
     - 无需传入 `customerChance.source.customer.cid`
     - 系统自动生成客户编号、拼音索引等信息
   - **房产处理**：系统根据楼盘ID + 楼号自动查找或创建房产
     - 无需预先查询房产是否存在
     - 无需传入 `customerChance.source.house.hid`
     - 系统自动关联楼盘信息
   - **简化集成**：外部系统只需传递基础信息（姓名、手机、楼盘、楼号），系统自动完成复杂关联

4. **认证串管理**
   - 认证串有效期为 30 分钟（可配置）
   - 过期需要重新登录获取
   - 请妥善保管，不要泄露

5. **自动分配规则**
   - 创建客户资源后会自动分配归属人
   - 分配规则由系统配置（按来源、区域、部门等）
   - 分配成功后会发送钉钉/小程序通知

6. **事务处理**
   - 整个创建过程在一个事务中完成
   - 任何步骤失败都会自动回滚
   - 不会出现部分成功的情况

7. **频率限制**
   - 同一用户建议每分钟不超过 10 次请求
   - 超过频率可能会触发限流保护

### 🔒 安全建议

1. **传输加密**
   - 生产环境必须使用 HTTPS 协议
   - 认证串需要定期更新

2. **参数验证**
   - 调用前请验证所有必填参数
   - 验证编号的唯一性

3. **错误处理**
   - 请根据错误码进行相应处理
   - 不要直接展示后端错误信息给最终用户

4. **日志记录**
   - 建议记录所有请求和响应日志
   - 敏感信息（如电话）需要脱敏记录

---

## 联调测试

### 测试环境地址

- **测试环境**: `https://erp-test.example.com`
- **生产环境**: `https://erp.example.com`

### 测试账号

| 环境 | 用户ID | 密码 | 说明 |
|------|--------|------|------|
| 测试环境 | test001 | Test@1234 | 用于联调测试 |
| 生产环境 | (申请获取) | (申请获取) | 正式使用 |

### 测试用例

#### 用例1: 正常创建新客户
```json
{
  "customerChance.cno": "TEST001",
  "customerChance.busitype.dbid": 1,
  "customerChance.source.no": "CS_TEST001",
  "customerChance.source.name": "测试客户",
  "customerChance.source.phone": "13800138000",
  "customerChance.source.gender": "男",
  "customerChance.source.village.vid": 1,
  "customerChance.source.house.houseNumber": "1栋101"
}
```

**预期结果**: 成功创建，返回 `errorCode=0`

#### 用例2: 重复编号测试
```json
{
  "customerChance.cno": "TEST001",  // 重复编号
  "customerChance.source.no": "CS_TEST002",
  ...
}
```

**预期结果**: 返回错误码 330076

#### 用例3: 缺少必填参数
```json
{
  "customerChance.cno": "TEST002",
  // 缺少 customerChance.source.no
  ...
}
```

**预期结果**: 返回错误码 330071

---

## 附录

### 相关接口

| 接口名称 | 接口路径 | 说明 |
|---------|---------|------|
| 查询客户机会 | `/queryCustomerChanceByCcid.do` | 根据ID查询客户机会详情 |
| 更新客户机会 | `/updateCustomerChance.do` | 更新客户机会信息 |
| 分配客户机会 | `/issueCustomerChance.do` | 手动分配客户机会 |
| 释放客户机会 | `/disableCustomerChance.do` | 释放客户机会资源 |

### 更新日志

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|---------|------|
| v1.1 | 2025-01-03 | 优化接口参数：移除cid和hid参数，增加客户和房产自动处理机制 | ERP 团队 |
| v1.0 | 2025-01-03 | 初始版本，发布接口文档 | ERP 团队 |

---

## 技术支持

**问题反馈**: 联系方林装饰 ERP 技术支持团队
**邮箱**: tech-support@fanglin.com
**电话**: 400-XXX-XXXX
**工作时间**: 周一至周五 9:00-18:00

---

© 2025 方林装饰 ERP 系统. All rights reserved.
