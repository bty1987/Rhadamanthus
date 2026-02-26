# 设计图片多次确认功能 - 开发文档

> 创建时间：2025-12-31
> 模块：装饰订单管理 (decoration)
> 功能：设计图片多次确认，支持完成/微改/大改状态流转
> 方案：复用 decorationservice 表，扩展 decorationpicture 状态

---

## 目录

- [一、需求背景](#一需求背景)
- [二、方案概述](#二方案概述)
- [三、数据库设计](#三数据库设计)
- [四、后端实现](#四后端实现)
- [五、前端实现](#五前端实现)
- [六、API接口文档](#六api接口文档)
- [七、状态流转图](#七状态流转图)
- [八、使用说明](#八使用说明)
- [九、文件清单](#九文件清单)

---

## 一、需求背景

### 1.1 业务场景

在装饰订单的设计阶段，设计师完成设计后需要客户确认。实际业务中：

1. 客户可能对设计提出**完成、微改、大改**三种确认结果
2. 每次确认时，设计师可能展示**不同的设计图片**组合
3. 需要记录每轮确认的**具体图片内容**和**客户意见**
4. 可能存在多轮确认（微改后再次确认，大改后重新确认等）

### 1.2 原有问题

原有系统中 `designStatus` 只有三个状态：
- `0` - 初始/待设计
- `1` - 设计中
- `2` - 已完成

无法满足：
- 区分完成/微改/大改三种确认结果
- 记录每轮确认的图片
- 支持多轮确认的历史追溯

---

## 二、方案概述

### 2.1 设计思路

**复用现有架构**，不新建专用确认表：

| 方案点 | 说明 |
|-------|------|
| 确认记录存储 | 复用 `decorationService` 表，type=1 表示设计方案确认 |
| 图片关联存储 | `decorationService.args` 字段存储 JSON 格式的 dpid 列表 |
| 图片状态控制 | 扩展 `decorationPicture.status`，增加状态值控制显示/隐藏 |
| 确认意见 | 使用 `decorationService.comment` 字段存储修改意见 |

### 2.2 核心功能

| 功能 | 描述 | 使用角色 |
|-----|------|---------|
| 图片显示/隐藏 | 设计师控制图片是否用于本次确认展示 | 设计师 |
| 创建确认记录 | 生成 decorationservice 记录，记录展示的图片 | 设计师 |
| 提交确认 | 选择完成/微改/大改，填写修改意见，完成确认 | 内部人员 |
| 查看确认历史 | 按 decorationservice type=1 查询所有确认记录 | 所有人员 |

### 2.3 状态扩展

设计状态从 3 个扩展到 **8 个**：

| 值 | 状态名称 | 说明 |
|:--:|---------|------|
| 0 | 初始/待设计 | 订单创建后的初始状态 |
| 1 | 设计中 | 设计师正在进行设计 |
| 2 | **完成-待确认** | 设计师提交确认，等待客户确认 |
| 3 | **完成-已确认** | 客户确认完成，设计流程结束 |
| 4 | **微改-待确认** | 设计师修改后，等待客户确认微改结果 |
| 5 | **微改-已确认** | 客户确认微改，可继续修改或结束 |
| 6 | **大改-待确认** | 设计师大改后，等待客户确认 |
| 7 | **大改-已确认** | 客户确认大改，可继续修改或结束 |

---

## 三、数据库设计

### 3.1 修改 decorationService 表

**新增字段**：

```sql
ALTER TABLE decoration.decorationService
ADD COLUMN args TEXT COMMENT '扩展参数(JSON格式),存储确认相关的数据';

-- 示例 JSON 结构：
-- {"dpids":[1001,1002,1003],"result":2,"pictureCount":3}
```

**复用现有字段**：

| 字段名 | 原用途 | 新用途 |
|-------|-------|--------|
| type | 服务类型 | `1` = 设计方案确认 |
| status | 服务状态 | `0`=待确认, `1`=已确认 |
| comment | 备注 | 客户确认意见/修改要求 |
| name | 服务名称 | 显示为"设计确认(第N轮)" |
| detail | 服务详情 | 确认结果描述 |

### 3.2 扩展 decorationPicture 表 status 字段

**现有状态**：

```java
public static final short STATUS_DISABLE_INT = 0;  // 禁用/隐藏
public static final short STATUS_ENABLE_INT = 1;   // 启用/显示
```

**新增状态**：

```java
public static final short STATUS_CONFIRM_SHOW_INT = 4;  // 本次确认展示
```

**状态说明**：

| 值 | 状态名称 | 说明 |
|:--:|---------|------|
| 0 | 隐藏 | 图片不显示，不参与确认 |
| 1 | 正常显示 | 图片正常显示，可用于确认 |
| 4 | 本次确认展示 | 标记为本次确认要展示的图片 |

### 3.3 数据字典更新

`docs/CONSTANTS.md` 和 `docs/constants.json` 中新增状态常量：

```javascript
// 设计状态
DESIGNSTATUS_INITIA_INT: 0              // 初始/待设计
DESIGNSTATUS_CONDUCT_INT: 1             // 设计中
DESIGNSTATUS_COMPLETE_PENDING_INT: 2    // 完成-待确认
DESIGNSTATUS_COMPLETE_CONFIRMED_INT: 3  // 完成-已确认
DESIGNSTATUS_MINOR_PENDING_INT: 4       // 微改-待确认
DESIGNSTATUS_MINOR_CONFIRMED_INT: 5     // 微改-已确认
DESIGNSTATUS_MAJOR_PENDING_INT: 6       // 大改-待确认
DESIGNSTATUS_MAJOR_CONFIRMED_INT: 7     // 大改-已确认

// 图片状态
PICTURESTATUS_HIDE_INT: 0               // 隐藏
PICTURESTATUS_SHOW_INT: 1               // 正常显示
PICTURESTATUS_CONFIRM_SHOW_INT: 4       // 本次确认展示
```

---

## 四、后端实现

### 4.1 实体类修改

#### DecorationServicePO.java - 新增 args 字段

```java
@Column(name = "args", columnDefinition = "TEXT")
private String args;

public String getArgs() {
    return args;
}

public void setArgs(String args) {
    this.args = args;
}

// 新增确认结果常量
public static final short CONFIRM_RESULT_COMPLETE = 2;  // 完成
public static final short CONFIRM_RESULT_MINOR = 4;     // 微改
public static final short CONFIRM_RESULT_MAJOR = 6;     // 大改

// 新增确认状态常量
public static final short CONFIRM_STATUS_PENDING = 0;   // 待确认
public static final short CONFIRM_STATUS_CONFIRMED = 1; // 已确认
```

#### DecorationPicturePO.java - 扩展 status 状态

```java
// 原有状态
public static final short STATUS_DISABLE_INT = 0;       // 隐藏
public static final short STATUS_ENABLE_INT = 1;        // 正常显示

// 新增状态
public static final short STATUS_CONFIRM_SHOW_INT = 4;  // 本次确认展示
```

### 4.2 VO类修改

#### DecorationServiceVO.java

```java
// 扩展字段
private String args;                      // JSON参数
private List<Long> dpids;                 // 本次确认的图片ID列表
private Short confirmResult;              // 确认结果: 2=完成,4=微改,6=大改
private Integer roundNumber;              // 确认轮次
private List<DecorationPictureVO> pictures; // 确认关联的图片列表

// getters and setters...
```

### 4.3 DAO层扩展

#### DecorationServiceDao.java - 新增方法

```java
/**
 * 查询订单的设计确认记录列表(type=1)
 */
List<DecorationServicePO> queryDecorationServiceForDesignConfirmByOrderId(String orderId);

/**
 * 查询订单的待确认设计记录
 */
DecorationServicePO queryDecorationServiceForPendingByOrderId(String orderId);

/**
 * 获取订单的下一确认轮次
 */
int getNextRoundForDesignConfirmByOrderId(String orderId);
```

#### DecorationPictureDao.java - 新增方法

```java
/**
 * 批量更新图片状态
 */
int batchUpdateDecorationPictureForStatusByDpids(List<Long> dpids, short status);

/**
 * 批量更新图片状态（带清除逻辑）
 * @说明 如果status=4(本次确认展示)，会先清除订单下其他图片的status=4状态
 */
int batchUpdateDecorationPictureForStatusByOrderIdAndDpids(String orderId, List<Long> dpids, short status);

/**
 * 清除订单下所有图片的确认展示状态
 */
int clearDecorationPictureForConfirmShowByOrderId(String orderId);

/**
 * 查询订单下指定状态的图片
 */
List<DecorationPicturePO> queryDecorationPictureForStatusByOrderIdAndStatus(String orderId, short status);

/**
 * 查询订单下展示中的图片（用于确认）
 */
List<DecorationPicturePO> queryDecorationPictureForConfirmShowByOrderId(String orderId);
```

#### DecorationPictureDaoImpl.java - 实现示例

```java
@Override
public int batchUpdateDecorationPictureForStatusByOrderIdAndDpids(String orderId, List<Long> dpids, short status) {
    // 如果设置为"本次确认展示"，先清除其他图片的展示状态
    if (status == DecorationPicturePO.STATUS_CONFIRM_SHOW_INT) {
        String clearSql = "update decoration.decorationpicture set status = 1 " +
                         "where orderId = :orderId and status = 4";
        session().createSQLQuery(clearSql)
               .setString("orderId", orderId)
               .executeUpdate();
    }

    // 批量更新选中的图片
    String updateSql = "update decoration.decorationpicture set status = :status " +
                      "where dpId in :dpids";
    return session().createSQLQuery(updateSql)
           .setShort("status", status)
           .setParameterList("dpids", dpids)
           .executeUpdate();
}

@Override
public int clearConfirmShowStatus(String orderId) {
    String sql = "update decoration.decorationpicture set status = 1 " +
                "where orderId = :orderId and status = 4";
    return session().createSQLQuery(sql)
           .setString("orderId", orderId)
           .executeUpdate();
}
```

### 4.4 Service层实现

#### DecorationServiceServiceImpl.java - 新增方法

```java
/**
 * 创建设计确认记录
 */
@Transactional(rollbackFor = Exception.class)
public long createDesignConfirmationForPictureByOrderId(DecorationServiceVO serviceVO, String userId) {
    String orderId = serviceVO.getOrderId();

    // 1. 获取下一轮次号
    int roundNumber = decorationServiceDao.getNextRoundForDesignConfirmByOrderId(orderId);

    // 2. 查询标记为"本次确认展示"的图片
    List<DecorationPicturePO> showPictures = decorationPictureDao.queryDecorationPictureForConfirmShowByOrderId(orderId);

    if (showPictures.isEmpty()) {
        throw new FLException("请先选择需要确认的图片");
    }

    // 3. 构建args JSON
    List<Long> dpids = new ArrayList<>();
    for (DecorationPicturePO pic : showPictures) {
        dpids.add(pic.getDpId());
    }

    Map<String, Object> argsMap = new HashMap<>();
    argsMap.put("dpids", dpids);
    argsMap.put("pictureCount", dpids.size());
    String argsJson = JSON.toJSONString(argsMap);

    // 4. 创建 decorationservice 记录
    DecorationServicePO servicePO = new DecorationServicePO();
    servicePO.setOrderId(orderId);
    servicePO.setName("设计确认(第" + roundNumber + "轮)");
    servicePO.setDetail("待客户确认");
    servicePO.setType(DecorationServicePO.TYPE_DESIGN_CONFIRM);
    servicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
    servicePO.setArgs(argsJson);
    servicePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
    decorationServiceDao.save(servicePO);

    // 5. 更新订单状态为完成-待确认
    decorationDao.updateDesignStatus(orderId, 2);

    return servicePO.getDsid();
}

/**
 * 提交设计确认
 */
@Transactional(rollbackFor = Exception.class)
public void submitDesignConfirmationForResultByDsid(DecorationServiceVO serviceVO, String userId) {
    Long dsid = serviceVO.getDsid();
    Short result = serviceVO.getConfirmResult();
    String remark = serviceVO.getComment();

    // 1. 获取确认记录
    DecorationServicePO servicePO = decorationServiceDao.get(dsid);

    // 2. 解析原有args，添加确认结果
    String argsJson = servicePO.getArgs();
    Map<String, Object> argsMap = JSON.parseObject(argsJson, Map.class);
    argsMap.put("result", result);
    argsMap.put("remark", remark);
    servicePO.setArgs(JSON.toJSONString(argsMap));

    // 3. 更新确认记录状态
    servicePO.setStatus(DecorationServicePO.SERVICESTATUS_FINISH_INT);
    servicePO.setComment(remark);
    servicePO.setFinishTime(new Timestamp(System.currentTimeMillis()));
    decorationServiceDao.update(servicePO);

    // 4. 更新详情描述
    String resultText = getResultText(result);
    servicePO.setDetail("客户确认: " + resultText);
    decorationServiceDao.update(servicePO);

    // 5. 根据结果更新订单设计状态
    int newDesignStatus;
    switch (result) {
        case 2: // 完成
            newDesignStatus = 3;
            break;
        case 4: // 微改
            newDesignStatus = 5;
            break;
        case 6: // 大改
            newDesignStatus = 7;
            break;
        default:
            newDesignStatus = 3;
    }
    decorationDao.updateDesignStatus(servicePO.getOrderId(), newDesignStatus);

    // 6. 清除图片的确认展示状态
    decorationPictureDao.clearDecorationPictureForConfirmShowByOrderId(servicePO.getOrderId());
}

/**
 * 查询设计确认历史
 */
public List<DecorationServiceVO> queryDesignConfirmationHistoryForByOrderId(String orderId) {
    List<DecorationServicePO> list = decorationServiceDao.queryDecorationServiceForDesignConfirmByOrderId(orderId);
    List<DecorationServiceVO> result = new ArrayList<>();

    for (DecorationServicePO po : list) {
        DecorationServiceVO vo = new DecorationServiceVO();
        po.ptv(vo);

        // 解析args获取图片列表
        if (po.getArgs() != null) {
            Map<String, Object> argsMap = JSON.parseObject(po.getArgs(), Map.class);
            List<Integer> dpids = (List<Integer>) argsMap.get("dpids");
            if (dpids != null && !dpids.isEmpty()) {
                List<DecorationPictureVO> pictures = new ArrayList<>();
                for (Integer dpid : dpids) {
                    DecorationPicturePO pic = decorationPictureDao.get(dpid.longValue());
                    if (pic != null) {
                        DecorationPictureVO picVO = new DecorationPictureVO();
                        pic.ptv(picVO);
                        pictures.add(picVO);
                    }
                }
                vo.setPictures(pictures);
            }
            // 设置确认结果
            Integer result = (Integer) argsMap.get("result");
            if (result != null) {
                vo.setConfirmResult(result.shortValue());
            }
        }

        result.add(vo);
    }

    return result;
}

/**
 * 切换图片确认展示状态
 */
@Transactional(rollbackFor = Exception.class)
public void toggleDecorationPictureForShowStatusByOrderIdAndDpid(String orderId, Long dpid, short status) {
    DecorationPicturePO picture = decorationPictureDao.get(dpid);

    // 如果设置为"本次确认展示"，先清除其他图片的展示状态
    if (status == DecorationPicturePO.STATUS_CONFIRM_SHOW_INT) {
        decorationPictureDao.clearDecorationPictureForConfirmShowByOrderId(orderId);
    }

    picture.setStatus(status);
    decorationPictureDao.update(picture);
}

/**
 * 批量切换图片展示状态
 * @param orderId 订单编号
 * @param dpidStr 图片ID列表字符串，逗号分隔
 * @param status 目标状态
 * @return 更新的图片数量
 */
@Transactional(rollbackFor = Exception.class)
public int batchToggleDecorationPictureForShowStatusByOrderIdAndDpids(String orderId, String dpidStr, short status) {
    if (dpidStr == null || dpidStr.trim().isEmpty()) {
        return 0;
    }

    // 解析图片ID列表
    String[] dpidArr = dpidStr.split(",");
    List<Long> dpids = new ArrayList<>();
    for (String dpid : dpidArr) {
        try {
            dpids.add(Long.parseLong(dpid.trim()));
        } catch (NumberFormatException e) {
            // 忽略无效的ID
        }
    }

    if (dpids.isEmpty()) {
        return 0;
    }

    // 使用带清除逻辑的批量更新
    return decorationPictureDao.batchUpdateDecorationPictureForStatusByOrderIdAndDpids(orderId, dpids, status);
}

private String getResultText(short result) {
    switch (result) {
        case 2: return "完成";
        case 4: return "微改";
        case 6: return "大改";
        default: return "未知";
    }
}
```

### 4.5 Action层

#### DecorationServiceAction.java - 新增方法

```java
/**
 * 创建设计确认记录
 */
@Action(value = "createDesignConfirmation")
public String createDesignConfirmation() throws FLException {
    long dsid = decorationServiceService.createDesignConfirmationForPictureByOrderId(
        decorationService, queryUserId());
    decorationService.setDsid(dsid);
    return SUCCESS;
}

/**
 * 提交设计确认
 */
@Action(value = "submitDesignConfirmation")
public String submitDesignConfirmation() throws FLException {
    decorationServiceService.submitDesignConfirmationForResultByDsid(
        decorationService, queryUserId());
    return SUCCESS;
}

/**
 * 查询设计确认历史
 */
@Action(value = "queryDesignConfirmationHistory")
public String queryDesignConfirmationHistory() {
    decorationServices = decorationServiceService.queryDesignConfirmationHistoryForByOrderId(
        decorationService.getOrderId());
    return SUCCESS;
}

/**
 * 切换图片展示状态
 */
@Action(value = "toggleDecorationPictureForShowStatus")
public String toggleDecorationPictureForShowStatus() throws FLException {
    decorationServiceService.toggleDecorationPictureForShowStatusByOrderIdAndDpid(
        decorationService.getOrderId(),
        decorationPicture.getDpId(),
        decorationPicture.getStatus());
    return SUCCESS;
}

/**
 * 批量切换图片展示状态
 */
@Action(value = "batchToggleDecorationPictureForShowStatus")
public String batchToggleDecorationPictureForShowStatus() throws FLException {
    int count = decorationServiceService.batchToggleDecorationPictureForShowStatusByOrderIdAndDpids(
        decorationService.getOrderId(),
        dpids,
        status);
    // 返回更新数量
    getResponse().setContentType("application/json");
    getResponse().getWriter().write(
        "{\"errorCode\":0,\"errorMsg\":\"成功更新 " + count + " 张图片状态\",\"affectedCount\":" + count + "}");
    return NONE;
}

// 批量操作参数
private String dpids;  // 图片ID列表，逗号分隔
private short status;   // 目标状态

public void setDpids(String dpids) {
    this.dpids = dpids;
}

public void setStatus(short status) {
    this.status = status;
}
}
```

---

## 五、前端实现

### 5.1 页面结构

```
WebContent/views/decoration/decorationDesignConfirmation.html
├── 订单信息头部
│   ├── 订单编号
│   ├── 当前设计状态
│   └── 设计师
├── 图片管理区
│   ├── 批量操作工具栏
│   │   ├── 全选/取消全选 复选框
│   │   ├── 批量设为展示 按钮
│   │   ├── 批量取消展示 按钮
│   │   └── 已选择 X 张图片 提示
│   ├── 图片列表（支持单选/批量选择）
│   └── 创建确认按钮
├── 确认操作区
│   ├── 确认结果选择（完成/微改/大改）
│   ├── 修改意见输入
│   └── 提交确认按钮
└── 确认历史
    └── 历史记录列表（每轮的图片和意见）
```

### 5.2 批量操作UI设计

```
┌─────────────────────────────────────────────────────────────────┐
│  图片管理                                         已选择: 3 张   │
├─────────────────────────────────────────────────────────────────┤
│  [批量设为展示] [批量取消展示]    [全选] □                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  │ ✓   │ │ ✓   │ │     │ │ ✓   │ │     │ │     │             │
│  │ 图1 │ │ 图2 │ │ 图3 │ │ 图4 │ │ 图5 │ │ 图6 │             │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 核心功能

```javascript
// 全局变量
var selectedDpids = [];  // 已选择的图片ID列表
var allPictures = [];    // 所有图片数据

// ========== 图片加载与渲染 ==========

// 加载订单图片列表
function loadPictures() {
    com.post(api.decoration.queryDecorationPictures, {
        'decorationPicture.orderId': orderId
    }, function(res) {
        if (res.decorationPictures) {
            allPictures = res.decorationPictures;
            renderPictureGrid(allPictures);
            updateSelectedCount();
        }
    });
}

// 渲染图片网格（支持批量选择）
function renderPictureGrid(pictures) {
    var html = '';
    pictures.forEach(function(pic) {
        var isShow = pic.status == 4; // STATUS_CONFIRM_SHOW_INT
        var isSelected = selectedDpids.indexOf(pic.dpId) > -1;

        html += `
            <div class="pic-item ${isShow ? 'showing' : ''} ${isSelected ? 'selected' : ''}"
                 data-dpid="${pic.dpId}">
                <div class="pic-checkbox">
                    <input type="checkbox" ${isSelected ? 'checked' : ''}
                           onchange="toggleSelectPicture(${pic.dpId}, this.checked)">
                </div>
                <img src="${pic.path}" alt="${pic.name}">
                <div class="pic-info">
                    <span class="pic-name">${pic.name}</span>
                    ${isShow ? '<span class="badge-show">展示中</span>' : ''}
                </div>
                <div class="pic-actions">
                    <button class="btn-sm ${isShow ? 'btn-warning' : 'btn-primary'}"
                            onclick="toggleSingleShow(${pic.dpId}, ${isShow ? 1 : 4})">
                        ${isShow ? '取消展示' : '设为展示'}
                    </button>
                </div>
            </div>
        `;
    });
    $('#pictureGrid').html(html);
}

// ========== 批量选择功能 ==========

// 全选/取消全选
function toggleSelectAll(checked) {
    selectedDpids = [];
    if (checked) {
        allPictures.forEach(function(pic) {
            selectedDpids.push(pic.dpId);
        });
    }
    renderPictureGrid(allPictures);
    updateSelectedCount();
}

// 切换单个图片选择状态
function toggleSelectPicture(dpid, checked) {
    var index = selectedDpids.indexOf(dpid);
    if (checked && index === -1) {
        selectedDpids.push(dpid);
    } else if (!checked && index > -1) {
        selectedDpids.splice(index, 1);
    }
    updateSelectedCount();
}

// 更新选择计数显示
function updateSelectedCount() {
    $('#selectedCount').text(selectedDpids.length);

    // 更新全选复选框状态
    var allSelected = selectedDpids.length === allPictures.length && allPictures.length > 0;
    $('#selectAllCheckbox').prop('checked', allSelected);
}

// ========== 批量设置展示状态 ==========

// 批量设为展示
function batchSetShow() {
    if (selectedDpids.length === 0) {
        com.showAlert(com.warn, '请先选择要展示的图片');
        return;
    }

    com.post(api.decoration.batchToggleDecorationPictureForShowStatus, {
        'decorationService.orderId': orderId,
        'dpids': selectedDpids.join(','),
        'status': 4  // STATUS_CONFIRM_SHOW_INT
    }, function(res) {
        com.showAlert(com.info, '已将 ' + selectedDpids.length + ' 张图片设为展示');
        selectedDpids = [];  // 清空选择
        loadPictures();
    });
}

// 批量取消展示
function batchCancelShow() {
    if (selectedDpids.length === 0) {
        com.showAlert(com.warn, '请先选择要取消展示的图片');
        return;
    }

    com.post(api.decoration.batchToggleDecorationPictureForShowStatus, {
        'decorationService.orderId': orderId,
        'dpids': selectedDpids.join(','),
        'status': 1  // STATUS_ENABLE_INT
    }, function(res) {
        com.showAlert(com.info, '已取消 ' + selectedDpids.length + ' 张图片的展示状态');
        selectedDpids = [];  // 清空选择
        loadPictures();
    });
}

// ========== 单个图片操作 ==========

// 切换单个图片展示状态
function toggleSingleShow(dpid, status) {
    com.post(api.decoration.toggleDecorationPictureForShowStatus, {
        'decorationService.orderId': orderId,
        'decorationPicture.dpId': dpid,
        'decorationPicture.status': status
    }, function(res) {
        loadPictures();
    });
}

// ========== 确认操作 ==========

// 创建确认记录
function createConfirmation() {
    // 检查是否有展示中的图片
    var showingPictures = allPictures.filter(function(p) {
        return p.status == 4;
    });

    if (showingPictures.length === 0) {
        com.showAlert(com.warn, '请先选择至少一张图片设为展示');
        return;
    }

    com.post(api.decoration.createDesignConfirmation, {
        'decorationService.orderId': orderId
    }, function(res) {
        com.showAlert(com.info, '确认记录创建成功，共包含 ' + showingPictures.length + ' 张图片');
        loadConfirmationHistory();
        loadPictures();
    });
}

// 提交确认结果
function submitConfirmation() {
    var result = $('input[name="confirmResult"]:checked').val();
    var remark = $('#confirmRemark').val();

    if (!result) {
        com.showAlert(com.warn, '请选择确认结果');
        return;
    }

    com.post(api.decoration.submitDesignConfirmation, {
        'decorationService.orderId': orderId,
        'decorationService.confirmResult': result,
        'decorationService.comment': remark
    }, function(res) {
        com.showAlert(com.info, '确认成功');
        loadConfirmationHistory();
        loadPictures();
    });
}

// 加载确认历史
function loadConfirmationHistory() {
    com.post(api.decoration.queryDesignConfirmationHistory, {
        'decorationService.orderId': orderId
    }, function(res) {
        if (res.decorationServices) {
            renderHistoryList(res.decorationServices);
        }
    });
}

// 渲染历史记录
function renderHistoryList(history) {
    var html = '';
    history.forEach(function(item) {
        var resultText = getResultText(item.confirmResult);
        var picsHtml = item.pictures.map(function(p) {
            return `<img src="${p.path}" class="history-pic">`;
        }).join('');

        html += `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-name">${item.name}</span>
                    <span class="history-result">${resultText}</span>
                    <span class="history-time">${formatTime(item.finishTime)}</span>
                </div>
                <div class="history-pictures">${picsHtml}</div>
                <div class="history-remark">${item.comment || ''}</div>
            </div>
        `;
    });
    $('#historyList').html(html);
}
```

---

## 六、API接口文档

### 6.1 切换单个图片展示状态

**接口地址**: `toggleDecorationPictureForShowStatus.do`

**请求方式**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|-----|------|
| decorationService.orderId | String | 是 | 订单编号 |
| decorationPicture.dpId | Long | 是 | 图片ID |
| decorationPicture.status | Short | 是 | 目标状态: 1=正常显示, 4=本次确认展示 |

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "操作成功"
}
```

### 6.2 批量切换图片展示状态

**接口地址**: `batchToggleDecorationPictureForShowStatus.do`

**请求方式**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|-----|------|
| decorationService.orderId | String | 是 | 订单编号 |
| dpids | String | 是 | 图片ID列表，逗号分隔，如: "1001,1002,1003" |
| status | Short | 是 | 目标状态: 1=正常显示, 4=本次确认展示 |

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "成功更新 3 张图片状态",
  "affectedCount": 3
}
```

### 6.3 创建设计确认记录

**接口地址**: `createDesignConfirmation.do`

**请求方式**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|-----|------|
| decorationService.orderId | String | 是 | 订单编号 |

**说明**: 系统自动查询 status=4 的图片作为确认内容

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "decorationService": {
    "dsid": 1234,
    "orderId": "D202512010001",
    "name": "设计确认(第1轮)",
    "status": 0
  }
}
```

### 6.4 提交设计确认

**接口地址**: `submitDesignConfirmation.do`

**请求方式**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|-----|------|
| decorationService.orderId | String | 是 | 订单编号 |
| decorationService.confirmResult | Short | 是 | 确认结果: 2=完成, 4=微改, 6=大改 |
| decorationService.comment | String | 否 | 修改意见 |

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "确认成功"
}
```

### 6.5 查询设计确认历史

**接口地址**: `queryDesignConfirmationHistory.do`

**请求方式**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|-----|------|
| decorationService.orderId | String | 是 | 订单编号 |

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "decorationServices": [
    {
      "dsid": 1234,
      "orderId": "D202512010001",
      "name": "设计确认(第1轮)",
      "detail": "客户确认: 微改",
      "confirmResult": 4,
      "comment": "客厅背景墙颜色需要调整",
      "status": 1,
      "createTime": 1735660800000,
      "finishTime": 1735690000000,
      "pictures": [
        {
          "dpId": 1001,
          "name": "客厅效果图.jpg",
          "path": "/upload/2024/12/xxx.jpg"
        }
      ]
    }
  ]
}
```

---

## 七、状态流转图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        设计状态流转图                                │
└─────────────────────────────────────────────────────────────────────┘

    0(待设计)
        │
        │ 设计师开始设计
        ▼
    1(设计中)
        │
        │ 设计师选择图片 → 点击"创建确认"
        ▼
    2(完成-待确认) ────────────┐
        │                      │
        │ 内部人员代客户确认    │
        ▼                      │
    ┌───┴─────┐                │
    │         │                │
    ▼         ▼                │
  完成(3)   微改(4)            │
    │         │                │
    │    设计师修改后          │
    │    重新选择图片          │
    │         │                │
    │         ▼                │
    │    5(微改-已确认)        │
    │         │                │
    └────┬────┘                │
         │                     │
         │ 大改后重新设计       │
         ▼                     │
    6(大改-待确认) ─────────────┘
        │
        │ 内部人员代客户确认
        ▼
    7(大改-已确认)
        │
        │ 继续修改
        ▼
    回到 1(设计中)

    流程结束：选择"完成"后状态变为 3(完成-已确认)
```

---

## 八、使用说明

### 8.1 设计师操作流程

1. **上传设计图**: 在 `decorationPicture.html` 页面上传设计效果图
2. **选择确认图片**: 在设计确认页面，点击图片上的"设为展示"按钮选择本次要确认的图片
3. **创建确认**: 点击"创建确认"按钮，系统生成 decorationservice 记录
4. **等待确认**: 系统将订单状态更新为"完成-待确认"

### 8.2 内部人员操作流程

1. **查看待确认**: 进入设计确认页面，查看已创建的确认记录
2. **提交确认**:
   - 选择确认结果：**完成** / **微改** / **大改**
   - 填写修改意见（可选）
   - 点击"提交确认"
3. **查看历史**: 在确认历史区域查看所有轮次的确认记录

### 8.3 页面访问

**URL格式**:
```
/views/decoration/decorationDesignConfirmation.html?orderId=Dxxxxxxxx
```

**从订单详情页跳转**:
```javascript
// 在 decoration4detail.html 中添加入口
<a href="/views/decoration/decorationDesignConfirmation.html?orderId={orderId}">
    设计确认
</a>
```

---

## 九、文件清单

### 9.1 数据库变更

| 类型 | 说明 |
|-----|------|
| SQL | `sql/add_decorationservice_args_field.sql` |

### 9.2 修改文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/com/fanglin/decoration/po/DecorationServicePO.java` | 新增 args 字段及常量 |
| `src/com/fanglin/decoration/po/DecorationPicturePO.java` | 新增 STATUS_CONFIRM_SHOW_INT 常量 |
| `src/com/fanglin/decoration/vo/DecorationServiceVO.java` | 扩展字段 |
| `src/com/fanglin/decoration/vo/DecorationPictureVO.java` | 扩展字段 |
| `src/com/fanglin/decoration/dao/DecorationServiceDao.java` | 新增查询方法 |
| `src/com/fanglin/decoration/dao/impl/DecorationServiceDaoImpl.java` | 实现查询方法 |
| `src/com/fanglin/decoration/dao/DecorationPictureDao.java` | 新增状态管理方法 |
| `src/com/fanglin/decoration/dao/impl/DecorationPictureDaoImpl.java` | 实现状态管理方法 |
| `src/com/fanglin/decoration/service/DecorationServiceService.java` | 新增确认相关方法 |
| `src/com/fanglin/decoration/service/impl/DecorationServiceServiceImpl.java` | 实现确认逻辑 |
| `src/com/fanglin/decoration/action/DecorationServiceAction.java` | 新增 Action 方法 |
| `docs/CONSTANTS.md` | 扩展 designStatus 和 pictureStatus 枚举 |
| `docs/constants.json` | 扩展状态常量 |
| `WebContent/js/api/decoration.js` | 添加新API接口定义 |

### 9.3 新建文件

| 类型 | 文件路径 |
|-----|---------|
| HTML | `WebContent/views/decoration/decorationDesignConfirmation.html` |
| JS | `WebContent/js/decoration/decorationDesignConfirmation.js` |
| CSS | `WebContent/css/decoration/decorationDesignConfirmation.css` |

### 9.4 SQL 脚本

```sql
-- 文件: sql/add_decorationservice_args_field.sql

-- 为 decorationService 表添加 args 字段
ALTER TABLE decoration.decorationService
ADD COLUMN args TEXT COMMENT '扩展参数(JSON格式)' AFTER detail;

-- 添加索引以优化查询
CREATE INDEX idx_design_confirm ON decoration.decorationService(orderId, type);
```

---

## 十、部署说明

### 10.1 数据库升级

执行 SQL 脚本添加字段：
```bash
mysql -u root -p decoration < sql/add_decorationservice_args_field.sql
```

### 10.2 应用部署

1. 编译 Java 源文件
2. 部署到 Tomcat
3. 清理浏览器缓存
4. 验证功能

### 10.3 权限配置

如需控制访问权限，在系统权限配置中添加：
- 菜单名称：设计确认
- 访问路径：`/views/decoration/decorationDesignConfirmation.html`
- 相关权限：`createDesignConfirmation`, `submitDesignConfirmation`

---

## 十一、测试验证

### 11.1 功能测试用例

| 用例编号 | 测试场景 | 预期结果 |
|---------|---------|---------|
| TC01 | 图片展示/隐藏切换 | 状态正确切换，界面正确显示 |
| TC02 | 创建确认-无展示图片 | 提示需要先选择图片 |
| TC03 | 创建确认-有展示图片 | 确认记录创建成功，args包含dpid列表 |
| TC04 | 提交确认-选择完成 | 状态变为完成-已确认，流程结束 |
| TC05 | 提交确认-选择微改 | 状态变为微改-已确认 |
| TC06 | 提交确认-选择大改 | 状态变为大改-已确认 |
| TC07 | 查看确认历史 | 显示所有轮次记录及图片 |

### 11.2 边界测试

| 场景 | 验证点 |
|-----|--------|
| 无设计图的订单 | 创建确认时提示需要先上传图片 |
| 已有待确认记录 | 不允许创建新的确认记录 |
| 重复提交确认 | 后端校验防止重复确认 |
| 图片状态切换 | 只允许一张图片设置为"本次确认展示" |

---

**文档版本**: v2.0 (复用 decorationservice 方案)
**最后更新**: 2025-12-31
**维护者**: Claude
