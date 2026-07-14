# FLException 异常架构调整计划

> **版本**:v1.0 (2026-07-14)
> **范围**:`FLException` 异常类、全局异常拦截器、`error.md` 错误码文档的协同整改
> **目标**:消除文档与代码的双轨漂移、补齐异常链与排查能力、建立错误码常量体系,使 `error.md` 成为消息的**单一事实源**
> **原则**:**新代码先行,老代码渐进迁移**,不做一次性大爆炸式重构(3568 处 throw 点无法一次性安全替换)

---

## 一、背景与现状

### 1.1 当前架构

| 维度 | 现状 |
|---|---|
| 异常类 | `FLException extends RuntimeException`,字段仅 `code:int` / `errorMessage:String` / `errorArgs:List<String>`。位于 `src/com/fanglin/core/interceptor/FLException.java:16-61` |
| 构造方法 | 仅 2 个重载:`(int code)` 与 `(int code, String msg)`。**无 `cause` 链构造方法**,且未调用 `super(message)`,导致 `getMessage()` 恒为 null |
| 错误码 | **无集中常量类**,3568 处 `throw new FLException(...)` 全是 magic number,分布在 482 个文件 |
| 异常→JSON | 靠 `CommonInterceptor` / `LoginInterceptor` / `AccessInterceptor` 三个 Struts2 拦截器,**同一段 catch 三段式复制 3 份**,通过 OGNL `setValue("errorCode", ...)` 回写到 `BaseAction` 字段 |
| HTTP 语义 | **所有异常一律返回 HTTP 200**,前端只能靠 JSON 里的 `errorCode` 判断成败 |
| `error.md` | 维护了一份"错误码→消息"权威表,带 `{1}` / `[#1#]` 占位符语法,**但代码 throw 时第二个参数全是硬编码中文,从不查这张表** |

### 1.2 核心矛盾

> **文档里有一张"错误码→消息"的权威映射表,但代码 throw 时第二个参数全是硬编码中文 —— 文档和代码是两套并行、互不引用的消息源。**

由此衍生出消息漂移、占位符无人使用、国际化能力为零等一系列问题。

---

## 二、问题清单(按严重度分级)

### 🔴 严重(数据一致性 / 排查能力)

#### P0-1 文档与代码双轨,消息漂移
- `error.md:17` 写 `110000 = 系统处理问题`,但拦截器兜底消息是 `"操作失败,请稍后重试"`(`CommonInterceptor.java:62`);同一码在不同出口出现两种措辞。
- `-1` 在 `error.md:13` 是"无操作权限",但在部分 Service 里被复用为其它含义,负数码语义已被污染。

#### P0-2 `error.md` 自身存在硬冲突(确凿 Bug)
| 行号 | 错误码 | 冲突内容 |
|---|---|---|
| 785-786 | `260061` | 同时出现"货单已存在"和"施工节点不匹配"两个含义 |
| 459-460 | `160031` / `160032` | 都是"活动票已存在" |
| 864, 866 | `330008` / `330010` | 都是"绑定订单失败,验证码错误" |
| 121, 182 | `130040` / `130101` | 都是"话术不存在" |

#### P0-3 异常链丢失
- FLException 无 `(code, msg, cause)` 构造方法。
- Service 层 `catch (Exception e) { throw new FLException(150073, "不支持其他支付平台"); }` 这种包装直接丢了原始堆栈,线上排查 often 看不到根因。
- 典型点:`PaytranServiceImpl.java:371-382`、`LoginServiceImpl.java:94-95`。

### 🟡 中等(可维护性)

#### P1-1 `errorArgs` 字段形同虚设
- 设计了 `errorArgs:List<String>`,配合 `error.md` 的 `{1}` / `[#1#]` 占位符,本意是参数化消息(类似 `MessageFormat`)。
- 代码里几乎不用,全是 `"未找到流程定义(businessType=" + type + ")"` 字符串拼接(`ApprovalFlowEngineServiceImpl.java:99`)。
- 后果:国际化能力为零;占位符语法 `{1}` 与 `[#1#]` 两种并存(`error.md:108` vs `error.md:559`),没有统一规范。

#### P1-2 错误码全 magic number,无常量类
- 3568 处 throw、482 个文件,改一个码要全文搜索。
- 新增码时容易跟既有码撞车(P0-2 的 `260061` 撞码很可能由此而来)。

#### P1-3 三段式 catch 模板复制 3 份
- `CommonInterceptor` / `LoginInterceptor` / `AccessInterceptor` 各写一遍 `catch(LockAcquisitionException) / catch(FLException) / catch(Exception)`。
- 后续要加一类异常处理(如 Redis 连接异常)需改 3 处,容易漏。

#### P1-4 Action 层两种异常处理风格并存
- 风格 A:`throws FLException`,让拦截器接住(主流)。
- 风格 B:本地 `try { ... } catch (FLException e) { setErrorCode/setErrorMsg }`(`LoginAction.java:101-108`)。
- 新人不知该用哪种,Review 无统一标准。

### 🟢 轻微(规范 / 整洁)

#### P2-1 FLException 包路径错位
- 放在 `com.fanglin.core.interceptor`,但它是全局异常类,与"拦截器"语义无关,应迁到 `com.fanglin.core.exception`。

#### P2-2 兜底码 `110000` 语义模糊
- 文档写"系统处理问题",拦截器写"操作失败,请稍后重试",Service 写"系统处理问题" —— 一个码三种说法。

#### P2-3 成功码与负数码混用
- `errorCode == 0` 表示成功,但没有显式常量;且与负数码 `-1/-2`、5 位正数码 `110xxx` 三种格式混用,缺乏统一编码规范文档。

#### P2-4 `error.md` 大量空位
- `130041/130042`、`200045`、`260063/260064` 等几十个码为空。
- 既可能是预留扩展位(应标注 `reserved`),也可能是删除后未回收,现状看不出来,容易误用。

---

## 三、调整方案

按**风险与收益**分三档推进。各档之间无强依赖,可独立交付。

### 第一档:快速止血(1-2 天,零风险,不改架构)

> 目标:把账记清楚,补上线上排查硬伤。

#### 方案 1.1 给 FLException 补 `cause` 构造方法(纯加法)

**文件**:`src/com/fanglin/core/interceptor/FLException.java`

```java
public class FLException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private int code;
    private String errorMessage;
    private List<String> errorArgs;

    public FLException(int code) {
        this(code, (String) null);
    }

    public FLException(int code, String errorMessage) {
        super(errorMessage);              // ← 修复 getMessage() 恒为 null
        this.code = code;
        this.errorMessage = errorMessage;
    }

    /** 新增:保留异常因果链,用于包装底层异常 */
    public FLException(int code, String errorMessage, Throwable cause) {
        super(errorMessage, cause);       // ← cause 透传
        this.code = code;
        this.errorMessage = errorMessage;
    }

    // getter/setter 略
}
```

**收益**:同时解决 P0-3(异常链丢失)与"`getMessage()` 永远是 null"的隐患。
**兼容性**:纯加法,不影响现有 3568 处调用;老调用走二参重载,新调用可选用三参重载。

---

#### 方案 1.2 抽公共异常解析方法,消除三处复制

**新增**:`src/com/fanglin/core/interceptor/FLExceptionResolver.java`

```java
package com.fanglin.core.interceptor;

import org.hibernate.exception.LockAcquisitionException;
import com.opensymphony.xwork2.ActionInvocation;
import com.fanglin.common.po.SystemPO;
import com.fanglin.utils.LogUtils;
import org.slf4j.Logger;

/**
 * 统一异常解析:把异常转成 errorCode/errorMsg,回写到 Action ValueStack。
 * 供 CommonInterceptor / LoginInterceptor / AccessInterceptor 共用,
 * 避免三段式 catch 逻辑在三个拦截器里各复制一份。
 */
public final class FLExceptionResolver {

    private FLExceptionResolver() {}

    /** 公共兜底码与消息(单一事实源) */
    public static final int CODE_DATA_CONFLICT  = -2;
    public static final int CODE_SYSTEM_ERROR   = 110000;

    public static final String MSG_DATA_CONFLICT    = "数据冲突,请重新再试";
    public static final String MSG_SYSTEM_ERROR     = "系统繁忙,请稍后重试";

    public static void resolve(ActionInvocation invocation, Throwable e,
                               String actionName, String module, Logger logger) {
        try {
            if (e instanceof LockAcquisitionException) {
                invocation.getStack().setValue("errorCode", String.valueOf(CODE_DATA_CONFLICT));
                invocation.getStack().setValue("errorMsg",  MSG_DATA_CONFLICT);
            } else if (e instanceof FLException) {
                FLException fe = (FLException) e;
                invocation.getStack().setValue("errorCode", String.valueOf(fe.getCode()));
                invocation.getStack().setValue("errorMsg",  fe.getErrorMessage());
            } else {
                invocation.getStack().setValue("errorCode", String.valueOf(CODE_SYSTEM_ERROR));
                invocation.getStack().setValue("errorMsg",  MSG_SYSTEM_ERROR);
                LogUtils.logging(logger, e, actionName, module);
            }
        } catch (Exception ignore) {
            // 解析本身绝不再抛
        }
    }
}
```

**改造三个拦截器**:catch 三段式替换为单行调用:

```java
// CommonInterceptor.java:52-66 改为
} catch (Exception e) {
    FLExceptionResolver.resolve(invocation, e, actionName, "common", logger);
}
return Action.SUCCESS;
```

**收益**:P1-3 消除,后续扩展异常类型只改一处。

---

#### 方案 1.3 修 `error.md` 硬冲突与占位符

详见 [第四章 `error.md` 修整清单](#四-errormd-修整清单)。

---

#### 方案 1.4 统一兜底码 `110000` 语义

在 `error.md` 与三个拦截器中,把 `110000` 的消息统一为:

| 文档/位置 | 统一文案 |
|---|---|
| `error.md:17` | `110000 \| 系统繁忙,请稍后重试` |
| `FLExceptionResolver.MSG_SYSTEM_ERROR` | `系统繁忙,请稍后重试` |
| 原 `LoginServiceImpl` 等兜底处 | `系统繁忙,请稍后重试` |

**收益**:P0-1 的核心矛盾点统一措辞。

---

### 第二档:架构演进(中长期,分模块推进)

> 目标:让 `error.md` 成为消息的**单一事实源**,建立错误码常量体系。

#### 方案 2.1 建立错误码常量类体系(渐进)

**包结构**:
```
src/com/fanglin/{module}/
└── code/
    └── {Module}ErrorCode.java   # 每模块一个
```

**示例 - payment 模块样板**:`src/com/fanglin/payment/code/PaymentErrorCode.java`

```java
package com.fanglin.payment.code;

import com.fanglin.core.code.FLCode;

/**
 * 款项/支付模块错误码。
 * 码段:150000-150999。新增码前必查 error.md,避免撞码。
 */
public enum PaymentErrorCode implements FLCode {

    CONV_NOT_EXIST        (150043, "转换款不存在"),
    CONV_PAY_PROCESSING   (150045, "转换款支付正在处理"),
    CONV_PAY_ERROR        (150046, "转换款支付异常,{0}"),   // {0} = 原因
    UNSUPPORTED_PLATFORM  (150073, "不支持其他支付平台");

    private final int code;
    private final String message;

    PaymentErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() { return code; }

    @Override
    public String getMessage() { return message; }
}
```

**公共接口**:`src/com/fanglin/core/code/FLCode.java`

```java
package com.fanglin.core.code;

/**
 * 错误码契约:所有模块错误码枚举实现此接口。
 * message 支持占位符 {0}/{1}...(MessageFormat 语法)。
 */
public interface FLCode {
    int getCode();
    String getMessage();
}
```

**新代码使用方式**:
```java
throw new FLException(PaymentErrorCode.CONV_NOT_EXIST);

// 带参数化消息
throw new FLException(
    PaymentErrorCode.CONV_PAY_ERROR,
    e.getMessage()
);
```

**迁移策略**:
- 新增错误码必须先在常量类定义,再在 `error.md` 登记。
- 老代码 `throw new FLException(150043, "转换款不存在")` 在日常迭代中顺手替换,**不立项集中替换**。
- 每次替换一个模块后,该模块进入"常量类约束"状态,`AGENTS.md` 更新对应模块约束。

---

#### 方案 2.2 让 FLException 真正用上 `error.md`(消息单一事实源)

**目标**:throw 点不再硬编码中文,消息来自 `error.md` 转译的 properties。

**步骤**:

1. **转译**:把 `error.md` 表格转成 `src/com/fanglin/core/code/errorMessage.properties`:
   ```properties
   150043=转换款不存在
   150045=转换款支付正在处理
   150046=转换款支付异常,{0}
   150073=不支持其他支付平台
   ...
   ```

2. **FLException 增加按 code 查模板的构造方法**:
   ```java
   public FLException(int code, String... args) {
       this.code = code;
       this.errorArgs = Arrays.asList(args);
       this.errorMessage = MessageSourceHolder.format(code, args);   // 查表 + MessageFormat
   }
   ```

3. **FLException 的 message 不再来自 throw 点**:
   ```java
   // 老:throw new FLException(150043, "转换款不存在");
   // 新:throw new FLException(150043);                  // 消息来自 properties
   //   或:throw new FLException(150046, e.getMessage());  // 带占位符参数
   ```

4. **`error.md` 与 properties 双向校验脚本**(构建期检查):
   - 解析 `error.md` 提取所有 `(code, message)` 对。
   - 解析 properties 提取所有 `(code, message)` 对。
   - 对比:每个 code 必须同时存在且消息一致。
   - CI 阶段执行,不一致则构建失败。

**收益**:P0-1(消息漂移)、P1-1(errorArgs 形同虚设)、P2-4(空位管理)一次性消解。`error.md` 真正成为单一事实源。

**风险与缓解**:
- **风险**:3568 处老 throw 第二个参数是硬编码消息,迁移后这些硬编码消息需要与 properties 对齐。
- **缓解**:仅对**新 throw 点**启用查表机制;老 throw 点保留二参构造方法,二参重载继续以第二参数为准(不查表),保证向后兼容。日常迭代逐步替换。

---

### 第三档:规范与整洁(可选,按需推进)

#### 方案 3.1 FLException 迁包

从 `com.fanglin.core.interceptor` 迁到 `com.fanglin.core.exception`。IDE 全局 Move 一键完成,需同步更新 `import`(全项目唯一引用,影响面可控)。

**收益**:P2-1。

---

#### 方案 3.2 引入 HTTP 状态码语义(可选,需前端配合)

在拦截器层根据错误码段映射 HTTP 状态:

| 错误码段 | HTTP 状态 | 含义 |
|---|---|---|
| `-1`(无权限) | `401 Unauthorized` | 未登录或会话失效 |
| `-2`(无权限) / `230xxx`(权限) | `403 Forbidden` | 登录但无操作权限 |
| `110xxx`(参数/校验) | `400 Bad Request` | 客户端参数错误 |
| `110000`(系统) | `500 Internal Server Error` | 服务端异常 |
| 其它业务校验 | `200 OK`(保持现状) | 正常业务流,靠 errorCode 表达 |

**收益**:APM / 网关 / 监控能靠 HTTP 状态做告警;前端拦截器能统一处理 401 跳登录。

**风险**:前端若强依赖"永远 200",需灰度。**建议仅在新增的 REST 风格接口上启用**,老接口保持 200。

---

#### 方案 3.3 统一 Action 层异常风格

在 `AGENTS.md` 中补充约束:

> **Action 异常处理统一规范**
> - Action 方法统一 `throws FLException`,**禁止本地 try-catch**(让拦截器统一处理)。
> - `LoginAction` 等历史代码作为豁免,新 Action 必须遵守。
> - Action 方法体内 **禁止 `catch (Exception)`**,异常一律上抛由拦截器接管。

---

## 四、`error.md` 修整清单

### 4.1 硬冲突(必改)

| 行号 | 错误码 | 冲突 | 处置 |
|---|---|---|---|
| 785-786 | `260061` | "货单已存在" / "施工节点不匹配" | "施工节点不匹配"改用空位码 `260072` |
| 459-460 | `160031` / `160032` | 都是"活动票已存在" | 删除 `160032`,空位标注 `reserved` |
| 864, 866 | `330008` / `330010` | 都是"绑定订单失败,验证码错误" | 合并为 `330008`,`330010` 标 `reserved` |
| 121, 182 | `130040` / `130101` | 都是"话术不存在" | 合并为 `130040`,`130101` 标 `reserved` |

### 4.2 措辞统一

| 错误码 | 当前文档 | 拦截器代码 | 统一为 |
|---|---|---|---|
| `110000` | 系统处理问题 | 操作失败,请稍后重试 | **系统繁忙,请稍后重试** |

### 4.3 占位符统一

全文将 `[#1#]` / `[#2#]` 旧语法统一为 `{0}` / `{1}`(`MessageFormat` 标准)。

涉及行(示例):`error.md:559`、`error.md:108`、`error.md:302`、`error.md:672-674`、`error.md:676-677` 等。

| 旧语法 | 新语法 | 示例 |
|---|---|---|
| `[#1#]` | `{0}` | `城市[#1#]已被引用` → `城市{0}已被引用` |
| `[#2#]` | `{1}` | `版本(#1#)已存在` → `版本{0}已存在` |

### 4.4 文档结构增强

在 `error.md` 顶部新增"模块码段说明"小节:

```markdown
## 模块码段说明

| 码段 | 模块 | 说明 |
|---|---|---|
| 0 | 成功 | 保留 |
| -1 / -2 | 通用 | 无权限 / 数据冲突 |
| 110xxx | System | 系统/通用/登录 |
| 120xxx | Construction | 施工 |
| 130xxx | Data | 数据(客户/楼盘/收据等) |
| 140xxx | Decoration | 装修订单 |
| 150xxx | Payment | 款项/支付 |
| 160xxx | Information | 审批/活动/消息 |
| 180xxx | Material | 主材 |
| 190xxx | Personel | 人员 |
| 200xxx | Quotation | 报价 |
| 220xxx | Production | 生产 |
| 230xxx | System | 系统(城市/公司/角色) |
| 240xxx | Approval | 审批 |
| 250xxx | Finance | 财务凭证 |
| 260xxx | Inventory | 库存 |
| 270xxx | Ding | 钉钉 |
| 280xxx | Salary | 薪资 |
| 310xxx | Department | 部门 |
| 320xxx | Building | 楼盘房产 |
| 330xxx | Customer | 客户 |
| 340xxx | Store | 商城 |
| 350xxx | Balance | 结算 |
| 360xxx | Kingdee | 金蝶 |
| 370xxx | Sales | 销售 |
```

### 4.5 空位管理

对 `error.md` 中所有"错误信息列为空"的码,统一标注为 `reserved`(预留扩展位),避免误用。涉及 `130041` / `130042` / `200045` / `260063` / `260064` 等几十处。

---

## 五、落地路线图

### 第一档(快速止血)

| 序号 | 任务 | 涉及文件 | 预估工时 | 风险 |
|---|---|---|---|---|
| 1.1 | FLException 补 cause 构造方法 | `FLException.java` | 0.5h | 零(纯加法) |
| 1.2 | 抽 FLExceptionResolver,改造三拦截器 | `FLExceptionResolver.java`(新)、`CommonInterceptor.java`、`LoginInterceptor.java`、`AccessInterceptor.java` | 2h | 低(行为等价) |
| 1.3 | 修 `error.md` 硬冲突 | `error.md` | 1h | 零 |
| 1.4 | 统一 `110000` 语义 | `error.md`、`FLExceptionResolver`、`LoginServiceImpl.java` | 0.5h | 零 |

**第一档交付物**:`error.md` 自洽无冲突;FLException 带异常链;异常处理逻辑单点维护。

---

### 第二档(架构演进)

| 序号 | 任务 | 涉及文件 | 预估工时 | 风险 |
|---|---|---|---|---|
| 2.1a | 定义 `FLCode` 接口 | `core/code/FLCode.java`(新) | 0.5h | 零 |
| 2.1b | payment 模块样板 `PaymentErrorCode` | `payment/code/PaymentErrorCode.java`(新) | 1h | 零 |
| 2.1c | FLException 增加 `FLCode` 构造方法 | `FLException.java` | 0.5h | 零(纯加法) |
| 2.1d | payment 模块老 throw 点迁移 | payment 模块 Service | 2h | 中(逐个核对) |
| 2.1e | 扩展至下一个模块(approval) | approval 模块 | 2h | 中 |
| 2.2a | `error.md` → `errorMessage.properties` 转译 | `core/code/errorMessage.properties`(新) | 2h | 零 |
| 2.2b | FLException 按码查表构造方法 | `FLException.java`、`MessageSourceHolder`(新) | 3h | 中 |
| 2.2c | 构建期双向校验脚本 | `pom.xml`、校验脚本 | 2h | 低 |

**第二档交付物**:错误码常量类体系;`error.md` 与 properties 双向校验;消息单一事实源。

---

### 第三档(规范整洁,可选)

| 序号 | 任务 | 预估工时 | 优先级 |
|---|---|---|---|
| 3.1 | FLException 迁包 `interceptor` → `exception` | 1h(含回归) | 低 |
| 3.2 | HTTP 状态码映射(新接口启用) | 2h | 中(需前端配合) |
| 3.3 | Action 异常风格写入 `AGENTS.md` | 0.5h | 高(文档约束) |

---

## 六、里程碑与验收标准

### 里程碑 M1:第一档完成

**验收**:
- [ ] `FLException` 新增 `(int, String, Throwable)` 构造方法,`getMessage()` 返回非 null。
- [ ] 三个拦截器 catch 块均调用 `FLExceptionResolver.resolve(...)`,无重复的三段式逻辑。
- [ ] `error.md` 无重复错误码(脚本校验)。
- [ ] `110000` 文档与代码消息一致(均为"系统繁忙,请稍后重试")。
- [ ] `error.md` 新增模块码段说明。
- [ ] 全量 `mvn clean compile` 通过。

### 里程碑 M2:第二档完成(payment 模块样板)

**验收**:
- [ ] `FLCode` 接口、`PaymentErrorCode` 枚举存在并编译通过。
- [ ] payment 模块所有 `throw new FLException(15xxxx, "...")` 替换为 `throw new FLException(PaymentErrorCode.XXX)`。
- [ ] `errorMessage.properties` 存在,覆盖所有 `error.md` 条目。
- [ ] 构建期校验脚本存在,能检测 `error.md` 与 properties 不一致。
- [ ] payment 模块接口行为零回归(手工冒烟)。

### 里程碑 M3:全模块迁移(中长期)

**验收**:
- [ ] 全部业务模块的错误码常量类就位。
- [ ] 全项目无裸 magic number throw(脚本扫描)。
- [ ] `error.md` 与 properties 双向一致,作为消息单一事实源。

---

## 七、风险与回滚

| 风险 | 影响范围 | 缓解措施 |
|---|---|---|
| 第二档迁移改写 throw 点,引入行为偏差 | 单模块 | 每模块独立迁移、独立冒烟;不跨模块批量替换 |
| `errorMessage.properties` 与 `error.md` 不一致导致消息错乱 | 全局 | 构建期校验脚本,不一致则构建失败 |
| HTTP 状态码映射导致前端异常 | 前端 | 第三档仅在新接口启用,老接口保持 200 |
| FLException 迁包导致大量 import 变更 | 全局 | IDE 全局 Move,提交前全量编译 |

**回滚**:所有改动均以**加法优先**——新增构造方法、新增常量类、新增 properties,老代码路径保持可用。任一档出问题,回滚对应提交即可,不影响其它档。

---

## 八、附录:关键文件清单

| 角色 | 文件路径 |
|---|---|
| 异常类 | `src/com/fanglin/core/interceptor/FLException.java` |
| Action 基类(含 errorCode/errorMsg 字段) | `src/com/fanglin/core/action/BaseAction.java` |
| Struts2 配置 | `conf/struts.xml` |
| Common 拦截器 | `src/com/fanglin/core/interceptor/CommonInterceptor.java` |
| Login 拦截器 | `src/com/fanglin/core/interceptor/LoginInterceptor.java` |
| Access 拦截器 | `src/com/fanglin/core/interceptor/AccessInterceptor.java` |
| 错误码文档 | `docs/03-API文档/API/error.md` |
| Service 层 catch/throw 模板示例 | `src/com/fanglin/payment/service/impl/PaytranServiceImpl.java` |
| Action 层本地 catch 示例 | `src/com/fanglin/common/action/LoginAction.java` |

---

## 九、决策记录

> 本节记录评审中确认的关键决策,便于后续追溯。

| 日期 | 决策 | 理由 |
|---|---|---|
| 2026-07-14 | 采用"渐进迁移"而非一次性重构 | 3568 处 throw 点无法一次性安全替换 |
| 2026-07-14 | 第一档优先补 `cause` 构造方法 | 线上排查硬伤,纯加法零风险 |
| 2026-07-14 | `error.md` 作为消息单一事实源 | 消除文档与代码双轨漂移的根因 |
| 2026-07-14 | HTTP 状态码映射列为可选第三档 | 需前端配合,灰度推进 |

---

**文档维护**:每次评审或实施推进后,更新本计划的"决策记录"与各里程碑验收清单。
