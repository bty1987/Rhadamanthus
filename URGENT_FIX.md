# 紧急修复：MemberServiceImpl 编译错误和逻辑错误

## 问题 1：变量未定义（编译错误）

### 错误代码
```java
// ========== 2. 构建手机号列表和初始结果容器 ==========
List<String> encodedPhoneList = new ArrayList<String>();
List<Long> customerIds = new ArrayList<Long>(); // ❌ 缺少 queryOrderIds 声明

for (MemberVO member : members) {
    if (member.getOrderId() != null && !member.getOrderId().isEmpty()) {
        queryOrderIds.add(member.getOrderId()); // ❌ 编译错误：变量未定义
    }
    // ...
}

// 处理装修单号查询（如果存在）
if (!queryOrderIds.isEmpty()) { // ❌ 编译错误：变量未定义
    // ...
}
```

### 修复代码
```java
// ========== 2. 构建手机号列表和初始结果容器 ==========
List<String> encodedPhoneList = new ArrayList<String>();
List<String> queryOrderIds = new ArrayList<String>(); // ✅ 添加变量声明
List<Long> customerIds = new ArrayList<Long>();

for (MemberVO member : members) {
    if (member.getOrderId() != null && !member.getOrderId().isEmpty()) {
        queryOrderIds.add(member.getOrderId());
    }
    // ...
}

// 处理装修单号查询（如果存在）
if (!queryOrderIds.isEmpty()) {
    // ...
}
```

---

## 问题 2：逻辑错误 - flag 永远为 false（数据不返回）

### 错误代码
```java
// 9.1 【隐藏】处理主订单 - 根据业务需求，只返回推荐信息（关联订单）
for (DecorationPO decorationPO : decorationPOs) {
    String recommenderPhone = orderToPhoneMap.get(decorationPO.getOrderId());
    if (recommenderPhone == null) {
        continue;
    }

    CustomerPO customer = decorationPO.getCustomer();
    if (customer == null) {
        continue;
    }

    boolean flag = false; // ❌ 错误：flag 永远是 false

    List<CustomerPhonePO> customerPhones = customerPhoneBatchMap.get(customer.getCid());
    if (customerPhones != null && !customerPhones.isEmpty()) {
        String phone = FormatUtil.decodePhone(customerPhones.get(0).getPhone());
        String referOrderId = null;
        String uniqueId = generateUniqueId(decorationPO.getDoid(), decorationPO.getOrderId(), null);
        Integer activityCount = orderActivityCountMap.get(decorationPO.getOrderId());

        MemberVO member = createMemberVO(decorationPO, phone, referOrderId, uniqueId, activityCount);

        List<MemberVO> memberList = resultMap.get(recommenderPhone);
        // ❌ 错误：flag 永远是 false，永远不会执行
        if (memberList != null && flag) {
            memberList.add(member);
        }
    }
}
```

### 修复方案 1：如果要隐藏主订单（删除代码）
```java
// 直接删除 9.1 处理主订单的代码块
// 从第 558 行到第 574 行
```

### 修复方案 2：如果要显示主订单（删除 flag 检查）
```java
List<CustomerPhonePO> customerPhones = customerPhoneBatchMap.get(customer.getCid());
if (customerPhones != null && !customerPhones.isEmpty()) {
    String phone = FormatUtil.decodePhone(customerPhones.get(0).getPhone());
    String referOrderId = null;
    String uniqueId = generateUniqueId(decorationPO.getDoid(), decorationPO.getOrderId(), null);
    Integer activityCount = orderActivityCountMap.get(decorationPO.getOrderId());

    MemberVO member = createMemberVO(decorationPO, phone, referOrderId, uniqueId, activityCount);

    List<MemberVO> memberList = resultMap.get(recommenderPhone);
    // ✅ 删除 flag 检查
    if (memberList != null) {
        memberList.add(member);
    }
}
```

---

## 问题 3：变量重复声明

### 错误代码
```java
// ========== 2. 构建手机号列表和初始结果容器 ==========
List<String> encodedPhoneList = new ArrayList<String>();
List<Long> customerIds = new ArrayList<Long>(); // 方法开始处声明

// 处理手机号查询（如果存在）
if (!encodedPhoneList.isEmpty()) {
    // ...
    List<Long> customerIds = new ArrayList<Long>(); // ❌ 重复声明
    // ...
}
```

### 修复代码
```java
// ========== 2. 构建手机号列表和初始结果容器 ==========
List<String> encodedPhoneList = new ArrayList<String>();
List<Long> customerIds = new ArrayList<Long>(); // 使用方法开始处声明的变量

// 处理手机号查询（如果存在）
if (!encodedPhoneList.isEmpty()) {
    // ...
    customerIds = new ArrayList<Long>(); // ✅ 直接赋值，不重复声明
    // ...
}
```

---

## 修复总结

### 必须立即修复（阻塞编译/运行）
1. ✅ 添加 `queryOrderIds` 变量声明
2. ✅ 修复 flag 永远为 false 的逻辑错误

### 建议尽快修复（代码质量）
3. ✅ 删除变量重复声明
4. ✅ 优化性能问题（循环内重复查询）

### 后续优化
5. ✅ 拆分长方法，提高可读性
