# MemberServiceImpl 性能问题修复方案

## 问题 1：queryMember 方法 - 循环内重复查询公司信息（严重）

### 当前代码（错误）
```java
for (int i = 0; i < orderIdList.size(); i++) {
    String orderId = orderIdList.get(i);
    String key = orderKeyList.get(i);
    orderIdToKeyMap.put(orderId, key);
    resultMap.put(key, new ArrayList<MemberVO>());

    DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
    if (decorationPO != null) {
        Integer companyId = decorationPO.getCompany();
        companyIds.add(companyId);

        // ❌ 错误：循环内重复查询
        if (!companyMap.containsKey(companyId)) {
            List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(Arrays.asList(companyId));
            for (CompanyPO companyPO : companyPOs) {
                companyMap.put(companyPO.getCid(), companyPO.getName());
            }
        }

        String companyName = companyMap.get(companyId);
        MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);
        resultMap.get(key).add(resultMember);
    }
}
```

### 修复后代码（正确）
```java
// ========== 按装修单号查询 ==========
if (!orderIdList.isEmpty()) {
    Map<String, String> orderIdToKeyMap = new HashMap<String, String>();

    // 1. 收集所有订单信息
    List<DecorationPO> orderDecorationPOs = new ArrayList<DecorationPO>();
    for (int i = 0; i < orderIdList.size(); i++) {
        String orderId = orderIdList.get(i);
        String key = orderKeyList.get(i);
        orderIdToKeyMap.put(orderId, key);
        resultMap.put(key, new ArrayList<MemberVO>());

        DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
        if (decorationPO != null) {
            orderDecorationPOs.add(decorationPO);
            companyIds.add(decorationPO.getCompany());
        }
    }

    // 2. 批量查询所有公司信息（只查询一次）
    Map<Integer, String> companyMap = new HashMap<Integer, String>();
    if (!companyIds.isEmpty()) {
        List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);
        for (CompanyPO companyPO : companyPOs) {
            companyMap.put(companyPO.getCid(), companyPO.getName());
        }
    }

    // 3. 构建结果
    for (int i = 0; i < orderIdList.size(); i++) {
        String orderId = orderIdList.get(i);
        String key = orderKeyList.get(i);

        // 从已查询的列表中获取订单（避免重复查询）
        DecorationPO decorationPO = null;
        for (DecorationPO po : orderDecorationPOs) {
            if (po.getOrderId().equals(orderId)) {
                decorationPO = po;
                break;
            }
        }

        if (decorationPO != null) {
            Integer companyId = decorationPO.getCompany();
            String companyName = companyMap.get(companyId);
            MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);
            resultMap.get(key).add(resultMember);
        }
    }
}
```

---

## 问题 2：queryMemberForInfo 方法 - 代码复杂度过高

### 建议：拆分子方法

```java
/**
 * 处理装修单号查询
 */
private void queryByOrderIds(List<String> queryOrderIds, Map<String, List<MemberVO>> resultMap,
                             List<DecorationPO> decorationPOs, Map<String, String> orderIdToPhoneMap,
                             Integer company) throws FLException {
    // ... 装修单号查询逻辑
}

/**
 * 处理手机号查询
 */
private void queryByPhones(List<String> encodedPhoneList, Map<String, List<MemberVO>> resultMap,
                          List<DecorationPO> decorationPOs, List<Long> customerIds,
                          Map<Long, String> customerToPhoneMap, Integer company) throws FLException {
    // ... 手机号查询逻辑
}

/**
 * 构建结果映射
 */
private void buildResultMap(List<DecorationPO> decorationPOs, Map<String, String> orderToPhoneMap,
                            Map<String, Integer> orderActivityCountMap, Map<Long, List<CustomerPhonePO>> customerPhoneBatchMap,
                            Map<String, Long> orderIdToDoIdMap, Map<String, List<MemberVO>> resultMap) {
    // ... 构建结果逻辑
}
```

---

## 性能对比

| 场景 | 修复前 | 修复后 | 改进 |
|------|--------|--------|------|
| 100 个订单，5 个公司 | 5 次数据库查询 | 1 次数据库查询 | 减少 80% |
| 100 个订单，10 个公司 | 10 次数据库查询 | 1 次数据库查询 | 减少 90% |
| 100 个订单，100 个公司 | 100 次数据库查询 | 1 次数据库查询 | 减少 99% |

---

## 兼容性检查

需要全局搜索 `init(decorationPO, companyName)` 的调用点，确认是否都需要更新为 `init(decorationPO, companyName, companyId)`：

```bash
grep -r "\.init(decorationPO" src/ --include="*.java"
```

预期结果：所有调用点都已更新为三参数版本。

---

## 测试建议

1. **性能测试**：对比修复前后的查询时间
2. **功能测试**：验证装修单号查询和手机号查询都正常工作
3. **回归测试**：确保现有功能不受影响
