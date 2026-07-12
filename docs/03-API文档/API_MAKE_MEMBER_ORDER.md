# makeMemberOrder 接口说明文档

## 接口概述

**接口名称**: makeMemberOrder
**功能描述**: 创建会员积分订单，处理积分兑换商品
**接口路径**: `/makeMemberOrder.do`
**请求方式**: `POST`
**内容类型**: `application/x-www-form-urlencoded` 或 `application/json`
**字符编码**: `UTF-8`

**版本**: v1.0
**最后更新**: 2025-01-09
**维护方**: 方林装饰 ERP 团队

---

## 认证方式

### 请求头要求

| Header 名称 | 值 | 必填 | 说明 |
|-------------|---|------|------|
| `authentication` | AES 加密的认证串 | 是 | 用户身份认证 |
| `Content-Type` | application/x-www-form-urlencoded 或 application/json | 建议填 | 请求体格式 |
| `Cookie` | authentication=xxx | 自动 | 浏览器自动携带 |

---

## 请求参数

### 参数列表

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| **memberOrder** | Object | 是 | 订单信息对象 | - |
| `memberOrder.orderId` | String | 是 | 装饰订单号 | `"ZC202501010001"` |
| `memberOrder.pointOrderId` | String | 是 | 积分订单号(唯一) | `"JF20250101001001"` |
| `memberOrder.decorationPoint` | Integer | 否 | 扣除装修积分 | `5000` |
| `memberOrder.materialPoint` | Integer | 否 | 扣除主材积分 | `3000` |
| `memberOrder.operatePoint` | Integer | 否 | 扣除运营积分 | `8000` |
| `memberOrder.surplusPoint` | Integer | 否 | 剩余运营积分 | `2000` |
| `memberOrder.point` | Integer | 是 | 扣除积分总量 | `8000` |
| **memberOrderItems** | Array | 是 | 商品列表(数组) | - |
| `memberOrderItems[0].no` | String | 是 | 商品编号 | `"GOODS001"` |
| `memberOrderItems[0].name` | String | 是 | 商品名称 | `"智能电饭煲"` |
| `memberOrderItems[0].point` | Integer | 是 | 单件商品积分 | `2000` |
| `memberOrderItems[0].num` | Integer | 是 | 商品数量 | `1` |

---

## cURL 调用示例

### 1. 基础 POST 请求

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "memberOrder": {
      "orderId": "ZC202501010001",
      "pointOrderId": "JF20250101001001",
      "point": 8000,
      "surplusPoint": 2000
    },
    "memberOrderItems": [
      {
        "no": "GOODS001",
        "name": "智能电饭煲",
        "point": 2000,
        "num": 1
      }
    ]
  }'
```

### 2. 完整参数请求（推荐）

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "memberOrder": {
      "orderId": "ZC202501010001",
      "pointOrderId": "JF20250101001001",
      "decorationPoint": 5000,
      "materialPoint": 3000,
      "operatePoint": 8000,
      "surplusPoint": 2000,
      "point": 8000
    },
    "memberOrderItems": [
      {
        "no": "GOODS001",
        "name": "智能电饭煲",
        "point": 2000,
        "num": 1
      },
      {
        "no": "GOODS002",
        "name": "空气炸锅",
        "point": 3000,
        "num": 2
      }
    ]
  }'
```

### 3. Form 表单格式

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'memberOrder.orderId=ZC202501010001' \
  -d 'memberOrder.pointOrderId=JF20250101001001' \
  -d 'memberOrder.decorationPoint=5000' \
  -d 'memberOrder.materialPoint=3000' \
  -d 'memberOrder.point=8000' \
  -d 'memberOrder.surplusPoint=2000' \
  -d 'memberOrderItems[0].no=GOODS001' \
  -d 'memberOrderItems[0].name=智能电饭煲' \
  -d 'memberOrderItems[0].point=2000' \
  -d 'memberOrderItems[0].num=1' \
  -d 'memberOrderItems[1].no=GOODS002' \
  -d 'memberOrderItems[1].name=空气炸锅' \
  -d 'memberOrderItems[1].point=3000' \
  -d 'memberOrderItems[1].num=2'
```

### 4. 带 URL 编码的 Form 表单（处理中文）

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  --data-urlencode 'memberOrder.orderId=ZC202501010001' \
  --data-urlencode 'memberOrder.pointOrderId=JF20250101001001' \
  --data-urlencode 'memberOrder.point=8000' \
  --data-urlencode 'memberOrderItems[0].no=GOODS001' \
  --data-urlencode 'memberOrderItems[0].name=智能电饭煲' \
  --data-urlencode 'memberOrderItems[0].point=2000' \
  --data-urlencode 'memberOrderItems[0].num=1'
```

### 5. 从文件读取 JSON 数据

```bash
# 创建 request.json 文件
cat > request.json << 'EOF'
{
  "memberOrder": {
    "orderId": "ZC202501010001",
    "pointOrderId": "JF20250101001001",
    "point": 8000,
    "surplusPoint": 2000
  },
  "memberOrderItems": [
    {
      "no": "GOODS001",
      "name": "智能电饭煲",
      "point": 2000,
      "num": 1
    }
  ]
}
EOF

# 使用文件发送请求
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d @request.json
```

### 6. 带 Cookie 认证（模拟浏览器登录）

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: authentication=YOUR_ENCRYPTED_AUTH_STRING; JSESSIONID=xxxxx' \
  -d '{
    "memberOrder": {
      "orderId": "ZC202501010001",
      "pointOrderId": "JF20250101001001",
      "point": 8000
    },
    "memberOrderItems": [
      {"no": "GOODS001", "name": "智能电饭煲", "point": 2000, "num": 1}
    ]
  }'
```

### 7. 详细输出（调试模式）

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "memberOrder": {
      "orderId": "ZC202501010001",
      "pointOrderId": "JF20250101001001",
      "point": 8000
    },
    "memberOrderItems": [
      {"no": "GOODS001", "name": "智能电饭煲", "point": 2000, "num": 1}
    ]
  }' \
  -v \
  --trace-ascii /dev/stdout
```

### 8. 保存响应到文件

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "memberOrder": {
      "orderId": "ZC202501010001",
      "pointOrderId": "JF20250101001001",
      "point": 8000
    },
    "memberOrderItems": [
      {"no": "GOODS001", "name": "智能电饭煲", "point": 2000, "num": 1}
    ]
  }' \
  -o response.json \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n"
```

### 9. Windows PowerShell 版本

```powershell
$headers = @{
    'authentication' = 'YOUR_ENCRYPTED_AUTH_STRING'
    'Content-Type' = 'application/json'
}

$body = @{
    memberOrder = @{
        orderId = 'ZC202501010001'
        pointOrderId = 'JF20250101001001'
        point = 8000
        surplusPoint = 2000
    }
    memberOrderItems = @(
        @{
            no = 'GOODS001'
            name = '智能电饭煲'
            point = 2000
            num = 1
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' `
    -Method Post `
    -Headers $headers `
    -Body $body
```

### 10. Windows CMD 版本

```cmd
curl -X POST "http://localhost:8080/Rhadamanthus/makeMemberOrder.do" ^
  -H "authentication: YOUR_ENCRYPTED_AUTH_STRING" ^
  -H "Content-Type: application/json" ^
  -d "{\"memberOrder\":{\"orderId\":\"ZC202501010001\",\"pointOrderId\":\"JF20250101001001\",\"point\":8000},\"memberOrderItems\":[{\"no\":\"GOODS001\",\"name\":\"智能电饭煲\",\"point\":2000,\"num\":1}]}"
```

---

## 其他语言调用示例

### Python Requests

```python
import requests
import json

url = "http://localhost:8080/Rhadamanthus/makeMemberOrder.do"
headers = {
    "authentication": "YOUR_ENCRYPTED_AUTH_STRING",
    "Content-Type": "application/json"
}

data = {
    "memberOrder": {
        "orderId": "ZC202501010001",
        "pointOrderId": "JF20250101001001",
        "decorationPoint": 5000,
        "materialPoint": 3000,
        "point": 8000,
        "surplusPoint": 2000
    },
    "memberOrderItems": [
        {"no": "GOODS001", "name": "智能电饭煲", "point": 2000, "num": 1},
        {"no": "GOODS002", "name": "空气炸锅", "point": 3000, "num": 2}
    ]
}

response = requests.post(url, headers=headers, json=data, timeout=30)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

### Java HttpClient

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class MakeMemberOrderExample {
    public static void main(String[] args) throws Exception {
        String json = """
            {
              "memberOrder": {
                "orderId": "ZC202501010001",
                "pointOrderId": "JF20250101001001",
                "point": 8000,
                "surplusPoint": 2000
              },
              "memberOrderItems": [
                {"no": "GOODS001", "name": "智能电饭煲", "point": 2000, "num": 1}
              ]
            }
            """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/Rhadamanthus/makeMemberOrder.do"))
            .header("authentication", "YOUR_ENCRYPTED_AUTH_STRING")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println("Status: " + response.statusCode());
        System.out.println("Response: " + response.body());
    }
}
```

### JavaScript/AJAX

```javascript
$.ajax({
    url: '/makeMemberOrder.do',
    type: 'POST',
    contentType: 'application/json',
    headers: {
        'authentication': 'YOUR_ENCRYPTED_AUTH_STRING'
    },
    data: JSON.stringify({
        memberOrder: {
            orderId: 'ZC202501010001',
            pointOrderId: 'JF' + Date.now(),
            point: 8000,
            surplusPoint: 2000
        },
        memberOrderItems: [
            {no: 'GOODS001', name: '智能电饭煲', point: 2000, num: 1},
            {no: 'GOODS002', name: '空气炸锅', point: 3000, num: 2}
        ]
    }),
    success: function(res) {
        console.log('兑换成功', res);
    },
    error: function(xhr) {
        console.error('兑换失败', xhr.responseJSON);
    }
});
```

---

## 响应格式

### 成功响应

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "success": true
}
```

### 错误响应

```json
{
  "errorCode": 140013,
  "errorMsg": "订单不存在",
  "success": false
}
```

---

## 错误码说明

| 错误码 | 错误信息 | 触发条件 | 解决方案 |
|--------|----------|----------|----------|
| 0 | 成功 | 接口调用成功 | - |
| 140013 | 订单不存在 | orderId 对应的装饰订单不存在 | 检查订单号是否正确 |
| 330049 | 积分不足 | 可用积分小于兑换所需积分 | 检查客户积分余额 |
| 160011 | 活动信息不存在 | 订单未关联有效的促销活动 | 确认订单是否有活动 |
| 130006 | 客户支付记录不存在 | 订单无有效支付记录 | 确认订单支付状态 |

---

## 业务逻辑说明

### 1. 积分计算规则

```java
// 可用装修积分 = 总装修积分 - 已扣除积分
long availableDecorationPoint = totald - amount;

// 可用主材积分 = 总主材积分（未扣除）
long availableMaterialPoint = totals;

// 可用运营积分
long availableOperatePoint = surplusPoint * 1000000;

// 判断积分是否充足
availableDecorationPoint + availableMaterialPoint >= point * 1000000
```

### 2. 处理流程

1. **验证订单存在性** - 根据 `orderId` 查询装饰订单
2. **积分余额校验** - 检查装修积分、主材积分、运营积分是否充足
3. **活动信息验证** - 查询订单关联的促销活动
4. **创建订单项目** - 为每个商品创建活动项目记录
5. **更新积分账户** - 扣减相应积分
6. **生成支付记录** - 关联支付记录和积分使用
7. **保存积分流水** - 记录积分变动历史

### 3. 积分扣减顺序

按照支付记录创建时间的先后顺序，依次从各笔支付中扣除积分：
- 优先扣除装修支付对应的积分
- 再扣除主材支付对应的积分

---

## 注意事项

### ⚠️ 重要提示

1. **幂等性**：相同的 `pointOrderId` 不能重复提交，会导致数据重复
2. **事务性**：整个接口在事务中执行，失败会自动回滚
3. **积分精度**：内部计算时积分会乘以 1000000 保存
4. **用户认证**：需要从 Session 中获取当前用户ID
5. **活动限制**：订单必须关联有效的促销活动才能兑换

### 🔒 安全建议

1. 生产环境必须使用 HTTPS 协议
2. 认证串需要定期更新，妥善保管
3. 调用前验证所有必填参数
4. 记录请求日志，敏感信息脱敏

---

## 测试用例

### 用例1: 正常兑换

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/makeMemberOrder.do' \
  -H 'authentication: TEST_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "memberOrder": {
      "orderId": "TEST_ZC001",
      "pointOrderId": "TEST_JF001",
      "point": 5000,
      "surplusPoint": 1000
    },
    "memberOrderItems": [
      {"no": "GOODS001", "name": "测试商品", "point": 5000, "num": 1}
    ]
  }'
```

**预期结果**: `errorCode=0`

### 用例2: 积分不足

```bash
# 修改 point 为超大值
curl ... -d '{"memberOrder":{"point": 999999999}, ...}'
```

**预期结果**: `errorCode=330049`

### 用例3: 订单不存在

```bash
curl ... -d '{"memberOrder":{"orderId":"INVALID_ORDER"}, ...}'
```

**预期结果**: `errorCode=140013`

---

## 相关接口

| 接口名称 | 接口路径 | 说明 |
|---------|---------|------|
| 查询会员积分 | `/queryMemberPoint.do` | 查询客户可用积分 |
| 取消会员订单 | `/cancelMemberOrder.do` | 取消积分订单，退还积分 |
| 更新会员商品 | `/updateMemberGoods.do` | 更新积分商品信息 |

---

## 更新日志

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-01-09 | 初始版本，发布接口文档 | ERP 团队 |

---

## 技术支持

**问题反馈**: 联系方林装饰 ERP 技术支持团队
**邮箱**: tech-support@fanglin.com
**电话**: 400-XXX-XXXX
**工作时间**: 周一至周五 9:00-18:00

---

© 2025 方林装饰 ERP 系统. All rights reserved.
