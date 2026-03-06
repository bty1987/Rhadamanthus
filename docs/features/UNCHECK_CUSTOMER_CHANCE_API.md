# uncheckCustomerChance 接口文档

## 接口信息

**接口名称**: uncheckCustomerChance
**功能描述**: 将客户机会设置为忽略状态（isCheck = 1）
**请求路径**: `/uncheckCustomerChance.do`
**请求方式**: POST
**创建时间**: 2025-12-31

## 功能说明

将指定的客户机会的 `isCheck` 字段更新为 `1`（忽略状态），表示该客户机会不再需要验证。

## 请求参数

### 请求体（JSON 格式）

```json
{
  "customerChance": {
    "ccid": 12345
  }
}
```

### 参数说明

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| customerChance.ccid | Long | 是 | 客户机会ID |

## 响应结果

### 成功响应
```json
{
  "errorCode": 0,
  "errorMsg": "",
  "customerChance": {
    "ccid": 12345,
    "isCheck": 1
  }
}
```

### 失败响应

#### 1. 客户机会不存在
```json
{
  "errorCode": 330075,
  "errorMsg": "客户机会不存在"
}
```

## 使用示例

### 前端 JavaScript 调用

```javascript
// 设置客户机会为忽略状态
function uncheckCustomerChance(ccid) {
    com.post({
        url: 'uncheckCustomerChance.do',
        data: {
            'customerChance.ccid': ccid
        },
        success: function(res) {
            if (res.errorCode == 0) {
                com.showAlert(com.info, '设置成功');
                // 刷新列表
                loadCustomerChanceList();
            } else {
                com.showAlert(com.error, res.errorMsg);
            }
        },
        error: function(res) {
            com.showAlert(com.error, '请求失败: ' + res.errorMsg);
        }
    });
}

// 调用示例
uncheckCustomerChance(12345);
```

### jQuery Ajax 调用

```javascript
$.ajax({
    url: '/uncheckCustomerChance.do',
    type: 'POST',
    data: {
        'customerChance.ccid': 12345
    },
    dataType: 'json',
    success: function(res) {
        if (res.errorCode == 0) {
            alert('设置成功');
        } else {
            alert('设置失败: ' + res.errorMsg);
        }
    },
    error: function() {
        alert('请求失败');
    }
});
```

### 后端 Java 调用

```java
// 在 Service 层调用
CustomerChanceVO customerChanceVO = new CustomerChanceVO();
customerChanceVO.setCcid(12345L);

customerChanceService.uncheckCustomerChance(customerChanceVO);
```

## 业务规则

### 1. 数据验证
- **ccid 必填**: 客户机会ID必须提供
- **ccid 存在性检查**: 客户机会必须存在于数据库中

### 2. 状态限制
- 无状态限制：任何状态下的客户机会都可以设置为忽略状态

### 3. 字段更新
- **isCheck**: 强制设置为 `1`（CustomerChancePO.ISCHECK_IGNORE_INT）
- **更新时间**: 数据库自动更新 `update_time` 字段

## 数据库操作

### 执行的 SQL

```sql
-- 查询客户机会
SELECT * FROM customer.customerchance WHERE ccid = ?;

-- 更新 isCheck 字段
UPDATE customer.customerchance
SET isCheck = 1
WHERE ccid = ?;
```

## 日志记录

### 应用日志

```
INFO  c.f.c.s.i.CustomerChanceServiceImpl - 客户机会设置为忽略状态, ccid=12345, isCheck=1
```

### 日志内容
- **操作类型**: 更新客户机会
- **ccid**: 客户机会ID
- **isCheck**: 新值（1 = 忽略）

## 相关接口

### 相关查询接口
- **queryCustomerChanceByCcid**: 查询客户机会详情
- **pageCustomerChance**: 分页查询客户机会列表

### 相关更新接口
- **updateCustomerChance**: 更新客户机会信息
- **disableCustomerChance**: 释放客户机会
- **issueCustomerChance**: 下发客户机会

### 字段取值说明

| isCheck 值 | 常量 | 说明 |
|-----------|------|------|
| 0 | ISCHECK_CHECK_INT | 验证状态（默认值） |
| 1 | ISCHECK_IGNORE_INT | 忽略状态 |

## 注意事项

1. **不可逆操作**: 设置为忽略状态后，需要手动重新设置为验证状态
2. **业务影响**: 忽略状态可能会影响后续的业务流程判断
3. **权限要求**: 该接口需要相应的用户权限（根据系统权限配置）

## 错误码说明

| 错误码 | 错误信息 | 说明 | 处理建议 |
|--------|---------|------|---------|
| 330075 | 客户机会不存在 | 指定的 ccid 不存在 | 检查 ccid 是否正确 |

## 实现细节

### Action 层
**文件**: `src/com/fanglin/customer/action/CustomerChanceAction.java`

```java
@Action(value = "uncheckCustomerChance", results = { @Result(name = "success", type = "json") })
public String uncheckCustomerChance() throws FLException {
    customerChanceService.uncheckCustomerChance(customerChance);
    return SUCCESS;
}
```

### Service 层
**接口**: `src/com/fanglin/customer/service/CustomerChanceService.java`

```java
public void uncheckCustomerChance(CustomerChanceVO customerChanceVO) throws FLException;
```

**实现**: `src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java`

```java
@Override
@Transactional(rollbackFor = Exception.class)
public void uncheckCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {
    CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

    if (customerChancePO == null) {
        throw new FLException(330075, "客户机会不存在");
    }

    // 设置 isCheck 为 1（忽略状态）
    customerChancePO.setIsCheck(CustomerChancePO.ISCHECK_IGNORE_INT);

    customerChanceDao.update(customerChancePO);

    log.info("客户机会设置为忽略状态, ccid={}, isCheck={}", customerChancePO.getCcid(), customerChancePO.getIsCheck());
}
```

## 测试用例

### 单元测试示例

```java
@Test
public void testUncheckCustomerChance() {
    CustomerChanceVO customerChanceVO = new CustomerChanceVO();
    customerChanceVO.setCcid(12345L);

    // 执行方法
    customerChanceService.uncheckCustomerChance(customerChanceVO);

    // 验证结果
    CustomerChancePO result = customerChanceDao.get(12345L);
    assertEquals(CustomerChancePO.ISCHECK_IGNORE_INT, result.getIsCheck());
}
```

### 集成测试示例

```java
@Test
public void testUncheckCustomerChanceApi() throws Exception {
    mockMvc.perform(post("/uncheckCustomerChance.do")
            .param("customerChance.ccid", "12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.errorCode").value(0));
}
```

## 版本历史

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| 1.0.0 | 2025-12-31 | 初始版本，创建接口 | AI Assistant |

---

**维护者**: AI Assistant
**审核人**: 待定
**最后更新**: 2025-12-31
