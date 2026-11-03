
## 补录接口 (自动生成 2026-11-03)


> **类**: `api.log.BusinessLogAction`


##### `查询` pageCustomerLog

- **接口**: `pageCustomerLog.do`
- **方法**: `pageCustomerLog()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` pageDecorationLog

- **接口**: `pageDecorationLog.do`
- **方法**: `pageDecorationLog()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

##### `查询` pageKingdeeSyncLog

- **接口**: `pageKingdeeSyncLog.do`
- **方法**: `pageKingdeeSyncLog()`

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |


> **类**: `api.log.LogAction`


##### `查询` pageActionLogWithHistory

- **接口**: `pageActionLogWithHistory.do`
- **方法**: `pageActionLogWithHistory()`
- **说明**: Phase 4.3: 含历史的操作日志查询（热表 + 归档表 UNION）。 <p>前端"含历史"开关勾选时调用此接口。要求 filters 含 createTime between 条件。

**入参:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `paging` | Paging | 分页参数 , 参照 [paging](../check_rule.html#page) |

