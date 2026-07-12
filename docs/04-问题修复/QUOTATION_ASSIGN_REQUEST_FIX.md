# pageQuotationAssignRequest JSONException 修复

> 日期: 2026-04-29
> 提交: `782a3163`, `3c17fc5b`

---

## 问题描述

`pageQuotationAssignRequest` 接口返回 JSON 时抛出 `JSONException`，页面无法正常显示报价预算分配请求数据。

---

## 根因分析

### 直接原因

`QuotationAssignRequestPO.ptv()` 方法使用 `BeanUtil.copyProperties(this, vo)` 将 PO 属性复制到 VO。

其中 `requestUser`（UserPO）和 `user`（UserPO）是 Hibernate `@ManyToOne` 关联对象，在 Session 中为 LAZY 代理。

当 Struts2 将 VO 序列化为 JSON 时，会调用 UserPO 的 getter，触发 LAZY 加载关联的 `RolePO`/`DepartmentPO`/`DutyPO`，导致：
- `LazyInitializationException`（Session 已关闭）
- 或循环引用导致 `JSONException`

### 附带发现

BeanUtil 对类型不匹配的字段会**静默跳过**（不报错但也不复制），以下字段因此始终为 null：

| PO 字段 | PO 类型 | VO 字段 | VO 类型 | 结果 |
|---------|---------|---------|---------|------|
| company | int | company | CompanyVO | 跳过 |
| department | Integer | department | DepartmentVO | 跳过 |
| requestTime | Timestamp | requestTime | String | 跳过 |
| assignTime | Timestamp | assignTime | String | 跳过 |
| createTime | Timestamp | createTime | String | 跳过 |

---

## 修复方案

### 第一阶段：排除 LAZY 代理字段（`782a3163`）

在 `ptv()` 中将问题字段从 BeanUtil 排除列表排除，手动映射：

1. **requestUser / user** — 创建轻量 UserPO，仅复制 `uid`/`currentName`/`userName` 三个安全字段，避免序列化 LAZY 代理
2. **company** — `new CompanyVO(String.valueOf(company))`
3. **department** — `new DepartmentVO()` + `setDid(department)`
4. **时间字段** — 手动 `.toString()` 转换

### 第二阶段：VO 时间字段类型统一（`3c17fc5b`）

将 VO 中 `requestTime`/`assignTime`/`finishTime`/`createTime` 从 `String` 改为 `java.sql.Timestamp`，与 PO 类型一致。

效果：
- BeanUtil 可自动复制时间字段，不再需要手动转换
- 排除列表从 8 个字段减少到 4 个（`company`, `department`, `requestUser`, `user`）

---

## 修改文件

| 文件 | 变更 |
|------|------|
| `src/com/fanglin/quotation/po/QuotationAssignRequestPO.java` | 重写 `ptv()` 方法 |
| `src/com/fanglin/quotation/vo/QuotationAssignRequestVO.java` | 时间字段 String -> Timestamp |

---

## ptv() 最终代码

```java
public QuotationAssignRequestVO ptv(QuotationAssignRequestVO vo) {
    // 复制基本属性，排除需要特殊处理或类型不匹配的字段
    BeanUtil.copyProperties(this, vo, "company", "department", "requestUser", "user");

    // 公司：PO int -> VO CompanyVO（仅设置cid）
    vo.setCompany(new CompanyVO(String.valueOf(company)));

    // 部门：PO Integer -> VO DepartmentVO（仅设置did）
    if (department != null) {
        DepartmentVO deptVO = new DepartmentVO();
        deptVO.setDid(department);
        vo.setDepartment(deptVO);
    }

    // 请求人：轻量UserPO（避免LAZY代理序列化）
    if (requestUser != null) {
        UserPO ru = new UserPO();
        ru.setUid(requestUser.getUid());
        ru.setCurrentName(requestUser.getCurrentName());
        ru.setUserName(requestUser.getUserName());
        vo.setRequestUser(ru);
    }

    // 预算员：轻量UserPO
    if (user != null) {
        UserPO u = new UserPO();
        u.setUid(user.getUid());
        u.setCurrentName(user.getCurrentName());
        u.setUserName(user.getUserName());
        vo.setUser(u);
    }

    return vo;
}
```

---

## 经验总结

1. **BeanUtil 类型不匹配是静默跳过**，不会报错也不会复制，需要特别注意 PO/VO 字段类型一致性
2. **LAZY 代理对象不能直接放入 VO**，JSON 序列化会触发关联加载导致异常
3. **解决策略**：创建轻量对象仅复制必要字段，或在 BeanUtil 排除列表中排除后手动映射
4. **VO 时间字段建议与 PO 保持同一类型**（Timestamp），减少手动转换代码
