# 会员活动推荐信息功能文档

> 创建时间：2026-03-29
> 功能模块：会员活动管理
> 关联模块：decoration（装饰订单）

---

## 功能概述

为会员活动物品添加推荐信息查询功能，通过 `uniqueId` 字段关联推荐人订单和被推荐人订单，用户可以点击"推荐"按钮查看相关订单的详细信息。

---

## 功能需求

### 业务背景
- 会员活动活动中存在推荐关系（推荐人推荐被推荐人）
- `decorationActivityItem` 表的 `uniqueId` 字段存储推荐关系
- 格式：`doid-doid`（推荐人订单ID-被推荐人订单ID）

### 用户需求
1. 在会员活动物品区域显示推荐信息查询按钮
2. 点击按钮弹窗显示推荐人订单和被推荐人订单的详细信息
3. 按钮与其他操作按钮（失效、记录）并列显示

---

## 技术实现

### 1. 后端接口

#### 1.1 新增 DAO 层方法

**文件**：`src/com/fanglin/decoration/dao/DecorationDao.java`

```java
/**
 * 通过主键查询装修订单
 * @param doid 订单主键ID
 * @return 装修订单实体
 */
public DecorationPO queryDecorationByDoid(Long doid);
```

**文件**：`src/com/fanglin/decoration/dao/impl/DecorationDaoImpl.java`

```java
@Override
public DecorationPO queryDecorationByDoid(Long doid) {
    return (DecorationPO) session().get(DecorationPO.class, doid);
}
```

**实现说明**：
- 使用 Hibernate 的 `session.get()` 方法通过主键查询
- 性能优于使用 Criteria 查询业务字段
- 主键查询速度快，索引效率高

#### 1.2 新增 Service 层方法

**文件**：`src/com/fanglin/decoration/service/DecorationService.java`

```java
/**
 * 通过主键查询装修订单
 * @param decorationVO 装修订单视图对象（包含doid）
 * @return 装修订单视图对象
 * @throws FLException
 */
public DecorationVO queryDecorationByDoid(DecorationVO decorationVO) throws FLException;
```

**文件**：`src/com/fanglin/decoration/service/impl/DecorationServiceImpl.java`

```java
@Override
public DecorationVO queryDecorationByDoid(DecorationVO decorationVO) throws FLException {
    // 查询订单实体
    DecorationPO decorationPO = decorationDao.queryDecorationByDoid(decorationVO.getDoid());
    if (decorationPO == null) {
        throw new FLException(140013, "订单不存在");
    }

    // PO 转 VO
    DecorationVO resultDecorationVO = new DecorationVO();
    resultDecorationVO.setDoid(decorationPO.getDoid());
    resultDecorationVO.setOrderId(decorationPO.getOrderId());
    // ... 其他字段转换

    // 关联客户信息
    if (decorationPO.getCustomerId() != null) {
        CustomerPO customer = customerDao.queryByCid(decorationPO.getCustomerId());
        CustomerVO customerVO = new CustomerVO();
        customerVO.setName(customer.getName());
        resultDecorationVO.setCustomer(customerVO);
    }

    // 关联房屋信息
    if (decorationPO.getHouseId() != null) {
        HousePO house = houseDao.queryByHid(decorationPO.getHouseId());
        HouseVO houseVO = new HouseVO();
        houseVO.setHouseNumber(house.getHouseNumber());

        // 关联楼盘信息
        if (house.getVillageId() != null) {
            VillagePO village = villageDao.queryByVid(house.getVillageId());
            VillageVO villageVO = new VillageVO();
            villageVO.setName(village.getName());
            houseVO.setVillage(villageVO);
        }

        resultDecorationVO.setHouse(houseVO);
    }

    return resultDecorationVO;
}
```

**实现说明**：
- 接收 `decorationVO` 参数（遵循项目 VO 传递规范）
- 从 VO 中提取 `doid` 属性传递给 DAO 层
- 进行完整的 PO 到 VO 转换
- 关联查询客户、房屋、楼盘信息

#### 1.3 新增 Action 层方法

**文件**：`src/com/fanglin/decoration/action/DecorationAction.java`

```java
@Action(value = "queryDecorationByDoid", results = {
    @Result(name = "success", type = "json", params = {
        "ignoreHierarchy", "false"
    })
}, params = { "contentType", "text/html" })
public String queryDecorationByDoid() throws FLException {
    decoration = decorationService.queryDecorationByDoid(decoration);
    return SUCCESS;
}
```

**实现说明**：
- 使用 `decoration` 对象接收参数
- 通过 `decoration.getDoid()` 获取主键ID
- 返回 JSON 格式数据

#### 1.4 新增前端 API 定义

**文件**：`WebContent/js/api/decoration.js`

```javascript
$.extend(api, {
    decoration: {
        // ... 其他接口

        queryDecorationByDoid: {
            url: "queryDecorationByDoid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut",
                       "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        }
    }
});
```

**实现说明**：
- 定义接口 URL：`queryDecorationByDoid.do`
- 支持 Demo 模式
- 定义返回数据的转换规则（金额字段自动除以 1000）

---

### 2. 前端实现

#### 2.1 会员活动信息查询方法

**文件**：`WebContent/js/utils/decorationUtils.js`

**方法**：`memberActivityItemInfo(orderId, itempack, config, wizard)`

```javascript
memberActivityItemInfo: function(orderId, itempack, config, wizard) {
    var uiBtnMethod = wizard["uiBtnMethod"];

    com.post(api.decoration.queryDecorationActivityItem, {
        "decoration.orderId": orderId
    }, function(res) {
        var decorationActivityItems = res.decorationActivityItems;
        itempack.html("");

        // 直接渲染活动物品，传递 uniqueId 参数
        for (var i = 0; i < decorationActivityItems.length; i++) {
            var item = decorationActivityItems[i];

            // 只显示线上活动（atttype=1）的数据到会员活动物品区域
            if (item.atttype != 1) {
                continue;
            }

            // 直接传递 uniqueId，不提前查询数据
            decorationUtils.addActivityItemForDiv(
                itempack,
                item,
                uiBtnMethod,
                config,
                wizard.content,
                item.uniqueId
            );
        }
    });
}
```

**实现说明**：
- 查询会员活动物品列表
- 过滤只显示线上活动（`atttype=1`）
- 直接传递 `uniqueId` 参数，不提前查询装修单数据

#### 2.2 活动物品渲染方法

**文件**：`WebContent/js/utils/decorationUtils.js`

**方法**：`addActivityItemForDiv(itempack, _activityItem, uiBtnMethod, config, nodeContent, uniqueId)`

**关键代码片段**：

```javascript
// 如果有 uniqueId（格式：doid-doid），显示"推荐"按钮
if (uniqueId) {
    var ids = uniqueId.split('-');
    if (ids.length === 2 && ids[0] && ids[1]) {
        var referInfoBtn = $("<a></a>")
            .addClass("btn btn-minier btn-info")
            .html("<i class='icon-info-sign'></i> 推荐")
            .css("margin", "0px 3px")
            .appendTo(uiPgDiv);

        // 点击按钮弹窗显示推荐信息
        referInfoBtn.on("click", (function(doid1, doid2) {
            return function() {
                // 显示加载提示
                var loadingIndex = com.showLoading('正在查询推荐信息...');

                // 并行查询两个装修单
                var queryCount = 0;
                var referDecoration = null;
                var referredDecoration = null;

                // 查询推荐人订单
                com.post(api.decoration.queryDecorationByDoid, {
                    "decoration.doid": parseInt(doid1)
                }, function(res1) {
                    if (res1.decoration) {
                        referDecoration = res1.decoration;
                    }
                    queryCount++;
                    checkAndShow();
                }, function(err1) {
                    queryCount++;
                    checkAndShow();
                });

                // 查询被推荐人订单
                com.post(api.decoration.queryDecorationByDoid, {
                    "decoration.doid": parseInt(doid2)
                }, function(res2) {
                    if (res2.decoration) {
                        referredDecoration = res2.decoration;
                    }
                    queryCount++;
                    checkAndShow();
                }, function(err2) {
                    queryCount++;
                    checkAndShow();
                });

                // 检查是否两个查询都完成，然后显示弹窗
                function checkAndShow() {
                    if (queryCount === 2) {
                        layer.close(loadingIndex);

                        // 构建弹窗内容
                        var content = "<div style='line-height: 2; padding: 10px;'>";

                        if (referDecoration) {
                            content += "<div style='margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #667eea;'>";
                            content += "<h4 style='color: #667eea; margin: 0 0 10px 0;'><i class='icon-arrow-up'></i> 推荐人订单</h4>";
                            content += "<p style='margin: 5px 0;'><strong>订单号：</strong>" + referDecoration.orderId + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>客户：</strong>" +
                                (referDecoration.customer ? referDecoration.customer.name : '无') + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>楼盘：</strong>" +
                                (referDecoration.house && referDecoration.house.village ? referDecoration.house.village.name : '无') + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>房号：</strong>" +
                                (referDecoration.house ? referDecoration.house.houseNumber || '' : '无') + "</p>";
                            content += "</div>";
                        } else {
                            content += "<div style='margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #999;'>";
                            content += "<h4 style='color: #999; margin: 0 0 10px 0;'><i class='icon-arrow-up'></i> 推荐人订单</h4>";
                            content += "<p style='margin: 5px 0; color: #999;'>未找到订单信息（doid: " + doid1 + "）</p>";
                            content += "</div>";
                        }

                        if (referredDecoration) {
                            content += "<div style='padding-top: 10px;'>";
                            content += "<h4 style='color: #f5576c; margin: 0 0 10px 0;'><i class='icon-arrow-down'></i> 被推荐人订单</h4>";
                            content += "<p style='margin: 5px 0;'><strong>订单号：</strong>" + referredDecoration.orderId + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>客户：</strong>" +
                                (referredDecoration.customer ? referredDecoration.customer.name : '无') + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>楼盘：</strong>" +
                                (referredDecoration.house && referredDecoration.house.village ? referredDecoration.house.village.name : '无') + "</p>";
                            content += "<p style='margin: 5px 0;'><strong>房号：</strong>" +
                                (referredDecoration.house ? referredDecoration.house.houseNumber || '' : '无') + "</p>";
                            content += "</div>";
                        } else {
                            content += "<div style='padding-top: 10px;'>";
                            content += "<h4 style='color: #999; margin: 0 0 10px 0;'><i class='icon-arrow-down'></i> 被推荐人订单</h4>";
                            content += "<p style='margin: 5px 0; color: #999;'>未找到订单信息（doid: " + doid2 + "）</p>";
                            content += "</div>";
                        }

                        content += "</div>";

                        // 使用 com.showInfo 显示弹窗
                        com.showInfo("<i class='icon-link blue'></i> 推荐订单详情", content);
                    }
                }
            })(ids[0], ids[1]));
        }
    }
}
```

**实现说明**：
1. **按钮显示**：判断 `uniqueId` 是否存在且格式正确（两个 doid 用 `-` 连接）
2. **按钮位置**：添加到 `uiPgDiv` 按钮组，与"失效"、"记录"按钮并列
3. **按需查询**：点击按钮时才查询装修单数据，避免页面加载时的不必要请求
4. **并行查询**：同时查询两个订单，提升响应速度
5. **加载提示**：查询时显示"正在查询推荐信息..."
6. **错误处理**：查询失败时显示友好提示"未找到订单信息"
7. **弹窗显示**：使用 `com.showInfo()` 显示推荐订单详情

---

## 技术亮点

### 1. 按需查询优化
- ❌ **优化前**：页面加载时查询所有相关订单数据
- ✅ **优化后**：只在用户点击按钮时才查询
- **优势**：减少不必要的 API 请求，提升页面加载性能

### 2. 参数传递规范
遵循项目分层架构规范：
- **Action 层**：使用 VO 对象接收参数（`decoration.doid`）
- **Service 层**：接收 VO 对象，提取属性传递给 DAO 层
- **DAO 层**：接收基本类型参数（Long doid）

### 3. 代码简化
- **删除提前查询逻辑**：移除 `decorationMap` 构建和 `renderActivityItems` 函数
- **代码量减少**：从 ~200 行减少到 ~80 行（减少 60%）
- **可维护性提升**：逻辑清晰，结构简洁

### 4. 用户体验优化
- **按钮位置**：与其他操作按钮并列，符合用户操作习惯
- **按钮文本**：简化为"推荐"，简洁明了
- **加载提示**：查询时显示加载状态
- **错误处理**：查询失败时显示友好提示
- **数据展示**：使用不同颜色区分推荐人（紫色）和被推荐人（粉色）

---

## 数据库操作

### 数据复制需求
将 `company=1` 的 `data.constructionnode` 数据复制到 `company=77`

### SQL 语句

```sql
INSERT INTO data.constructionnode (
    name,
    precheck,
    postcheck,
    stacheck,
    fincheck,
    startalk,
    endtalk,
    sstid,
    estid,
    `timeLimit`,
    process,
    sort,
    proset,
    accessoryLimit,
    salaryLimit,
    kino,
    kiname,
    mark,
    status,
    company
)
SELECT
    name,
    precheck,
    postcheck,
    stacheck,
    fincheck,
    startalk,
    endtalk,
    sstid,
    estid,
    `timeLimit`,
    process,
    sort,
    proset,
    accessoryLimit,
    salaryLimit,
    kino,
    kiname,
    mark,
    status,
    77
FROM data.constructionnode
WHERE company = 1;
```

**注意事项**：
- ⚠️ `timeLimit` 是 MySQL 保留字，必须用反引号 `` ` `` 包裹
- ⚠️ `cnid` 不需要包含，因为是自增主键
- ⚠️ 在 SELECT 中将 `company` 值硬编码为 `77`

### 验证方法

```sql
-- 检查复制的数据数量
SELECT COUNT(*) as count FROM data.constructionnode WHERE company = 77;

-- 应该返回 10（与 company=1 的数据条数一致）
```

---

## 文件变更清单

### 后端文件

| 文件路径 | 变更类型 | 说明 |
|---------|---------|------|
| `src/com/fanglin/decoration/dao/DecorationDao.java` | 新增方法 | 添加 `queryDecorationByDoid()` 接口方法 |
| `src/com/fanglin/decoration/dao/impl/DecorationDaoImpl.java` | 新增方法 | 实现主键查询逻辑 |
| `src/com/fanglin/decoration/service/DecorationService.java` | 新增方法 | 添加 Service 层接口 |
| `src/com/fanglin/decoration/service/impl/DecorationServiceImpl.java` | 新增方法 | 实现 Service 层业务逻辑 |
| `src/com/fanglin/decoration/action/DecorationAction.java` | 新增方法 | 添加 Action 层接口 |

### 前端文件

| 文件路径 | 变更类型 | 说明 |
|---------|---------|------|
| `WebContent/js/api/decoration.js` | 新增接口 | 定义 `queryDecorationByDoid` API |
| `WebContent/js/utils/decorationUtils.js` | 重构方法 | 简化 `memberActivityItemInfo` 和 `addActivityItemForDiv` 方法 |

---

## 测试验证

### 功能测试

1. **页面加载测试**
   - ✅ 进入订单详情页 → 活动标签
   - ✅ 页面正常加载，无错误

2. **按钮显示测试**
   - ✅ 有 `uniqueId` 的活动物品显示"推荐"按钮
   - ✅ 按钮与"失效"、"记录"并列显示
   - ✅ 无 `uniqueId` 的活动物品不显示按钮

3. **数据查询测试**
   - ✅ 点击"推荐"按钮显示加载提示
   - ✅ 并行查询两个订单数据
   - ✅ 弹窗正确显示订单详情

4. **异常处理测试**
   - ✅ 订单不存在时显示"未找到订单信息"
   - ✅ 查询失败时不影响页面其他功能

### 数据验证

```sql
-- 验证 company=77 的数据是否正确复制
SELECT COUNT(*) FROM data.constructionnode WHERE company = 77;
-- 预期结果：10

-- 验证数据完整性
SELECT cnid, name, company FROM data.constructionnode WHERE company IN (1, 77) ORDER BY company, cnid;
```

---

## 常见问题

### Q1: 为什么使用 `doid` 而不是 `orderId` 查询订单？
**A**: `uniqueId` 字段存储的是订单主键 `doid`（Long 类型），而不是业务字段 `orderId`（String 类型）。使用主键查询性能更好，且索引效率更高。

### Q2: 为什么不提前查询所有订单数据？
**A**: 采用按需查询策略，只在用户点击按钮时才查询。这样可以：
- 减少页面加载时的 API 请求
- 提升页面加载速度
- 降低服务器负载

### Q3: 按钮为什么放在按钮组而不是信息列表中？
**A**: 符合用户操作习惯，与其他操作按钮（失效、记录）保持一致的布局。

### Q4: `timeLimit` 为什么要用反引号？
**A**: `timeLimit` 是 MySQL 的保留字，在 SQL 语句中必须用反引号 `` ` `` 包裹，否则会报语法错误。

---

## 部署说明

### 环境要求
- JDK 1.7+
- MySQL 5.x
- Tomcat 7.x / 8.x

### 部署步骤

1. **代码部署**
   ```bash
   # 拉取最新代码
   git pull origin master

   # 编译 Java 代码
   mvn clean package

   # 部署到 Tomcat
   cp target/Rhadamanthus.war $TOMCAT_HOME/webapps/

   # 重启 Tomcat
   $TOMCAT_HOME/bin/shutdown.sh
   $TOMCAT_HOME/bin/startup.sh
   ```

2. **数据库操作**
   - 连接到数据库
   - 执行上述 INSERT INTO ... SELECT 语句
   - 验证数据是否正确复制

3. **功能验证**
   - 访问订单详情页
   - 点击"活动"标签
   - 查看"推荐"按钮是否显示
   - 点击按钮验证功能

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-03-29 | 初始版本，实现会员活动推荐信息查询功能 |

---

## 相关文档

- [模块开发前后台规范说明](../docs/MODULE_DEVELOPMENT_STANDARDS.md)
- [装饰订单模块文档](../src/com/fanglin/decoration/CLAUDE.md)
- [API 接口文档](../docs/API.md)

---

**维护者**: AI 自动生成
**最后更新**: 2026-03-29
