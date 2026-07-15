# FLException 异常架构调整计划

> **版本**:v2.0 (2026-07-14)
> **范围**:`FLException` 异常类、全局异常拦截器、`error.md` 错误码文档、全台错误目录的协同整改
> **目标**:消除文档与代码的双轨漂移、补齐异常链与排查能力、建立**以 errorcode 为唯一键的全台错误目录**,让文本与代码彻底解耦,国际化成为目录的自然扩展
> **原则**:**新代码先行,老代码渐进迁移**,不做一次性大爆炸式重构(3568 处 throw 点无法一次性安全替换)

## 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-07-14 | 初版:三档计划(properties 单一事实源方案) |
| v2.0 | 2026-07-14 | 第一档已落地提交(`ac3bcff00`);重构二/三档为"全台错误目录"架构(errorcode 为唯一键,JSON 目录全台共享,后端不管理文本只过渡性读取) |

## 当前进度

| 档 | 状态 | 说明 |
|---|---|---|
| 第一档 快速止血 | ✅ **已完成** | 提交 `ac3bcff00`,已打包 6 模块 jar(core/common/inventory/personel/seiya/system,版本 8.3.027) |
| 1.5 错误信息优化 | ⏳ 待启动 | 句式模板化 + 兜底码精确化(文档+代码同步) |
| 第二档 全台错误目录 | ⏳ 待启动 | errorcode 为唯一键,`error-{lang}.json` 目录,后端不持有文本 |
| 第三档 规范整洁 | ⏳ 待启动 | HTTP 状态码映射、迁包、Action 风格约束 |

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

### 1.3 第一档已完成项(提交 `ac3bcff00`)

| 问题 | 处置 |
|---|---|
| FLException 无 cause 链、`getMessage()` 恒为 null | 新增 `(int,String,Throwable)` 构造;二参构造改为 `super(msg)` |
| 三段式 catch 在 3 个拦截器各复制一份 | 新增 `FLExceptionResolver` 统一解析,三拦截器改为单行调用 |
| error.md 硬冲突(`260061` 双义等) | "施工节点不匹配"挪到 `260072`;`160031/160032/330008` 未用码标 reserved |
| `110000` 文档与代码措辞不一 | 统一为"系统繁忙,请稍后重试",代码 14 处 + 文档同步 |
| error.md 占位符 `[#1#]`/`[#2#]` 与 `{1}` 并存 | 全部统一为 `{0}`/`{1}`(MessageFormat 标准) |
| error.md 无码段说明、302 个空位无标注 | 新增模块码段说明表;空位统一标 `reserved` |

---

## 二、问题清单(按严重度分级)

### 🔴 严重(数据一致性 / 排查能力)

#### P0-1 文档与代码双轨,消息漂移 ✅ 已解决(第一档)
- `error.md:17` 写 `110000 = 系统处理问题`,但拦截器兜底消息是 `"操作失败,请稍后重试"`;同一码在不同出口出现两种措辞。
- 第一档已将 `110000` 文档与代码统一为"系统繁忙,请稍后重试"(14 处代码 + 文档)。
- `-1` 在 `error.md` 是"无操作权限",但在部分 Service 里被复用为其它含义,负数码语义已被污染(未处理,留待后续)。

#### P0-2 `error.md` 自身存在硬冲突 ✅ 已解决(第一档)
| 原冲突 | 处置 |
|---|---|
| `260061` 双义("货单已存在"/"施工节点不匹配") | "施工节点不匹配"挪到 `260072`,代码同步 |
| `160031`/`160032` 都是"活动票已存在" | 两码均未被代码引用,标 reserved |
| `330008`/`330010` 都是"绑定订单失败" | `330008` 未被引用标 reserved,保留 `330010` |
| `130040`/`130101` 都是"话术不存在" | 实测两码都在用(Talking/Chating),非真冲突,保留并加注 |

#### P0-3 异常链丢失 ✅ 已解决(第一档)
- FLException 已新增 `(int, String, Throwable cause)` 构造方法,`getMessage()` 亦修复。

### 🟡 中等(可维护性)

#### P1-1 `errorArgs` 字段形同虚设
- 设计了 `errorArgs:List<String>`,配合 `error.md` 的 `{1}` / `[#1#]` 占位符,本意是参数化消息(类似 `MessageFormat`)。
- 代码里几乎不用,全是 `"未找到流程定义(businessType=" + type + ")"` 字符串拼接(`ApprovalFlowEngineServiceImpl.java:99`)。
- 后果:国际化能力为零;占位符语法 `{1}` 与 `[#1#]` 两种并存(`error.md:108` vs `error.md:559`),没有统一规范。

#### P1-2 错误码全 magic number,无常量类
- 3568 处 throw、482 个文件,改一个码要全文搜索。
- 新增码时容易跟既有码撞车(P0-2 的 `260061` 撞码很可能由此而来)。

#### P1-3 三段式 catch 模板复制 3 份 ✅ 已解决(第一档)
- `CommonInterceptor` / `LoginInterceptor` / `AccessInterceptor` 各写一遍 `catch(LockAcquisitionException) / catch(FLException) / catch(Exception)`。
- 第一档已抽出 `FLExceptionResolver.resolve()`,三拦截器改为单行调用。

#### P1-5 错误信息句式不统一、用词冗余(新发现,703 条量化扫描)
对 error.md 全部 703 条有效消息(排除 reserved)做了量化扫描,问题集中在:

| 问题 | 数据 | 示例 |
|---|---|---|
| 高频句式高度集中 | `X不存在` 220 处 + `X不可操作` 87 处 + `X已存在` 59 处 = **366 条(52%)** | — |
| `不存在` 语序倒置 | 正向 228 处,倒置 2 处 | `120014 不存在该放线信息` / `120016 不存在放线小组` |
| `不可操作` 带冗余"状态" | `X状态不可操作` 11 处 | `140049 装修单状态,不可操作`(逗号割裂) |
| `当前` 冗余前缀 | 12 处(无对比对象) | `120001 当前工人已经添加...` |
| `不能/不可/无法/不可进行` 用词不一致 | `不可操作`90 / `不能进行`7 / `不可修改`8 / `不可更新`4 / `不可删除`4 | `不能进行修改` vs `不可修改` |
| 兜底消息笼统无信息量 | 12 处 | `110007 网络问题` / `110010 请求失败` / `360001 金蝶请求异常` |
| 半角逗号约定(非 bug) | 703 条**全部用半角 `,`**,零全角 `，` | 全项目既定约定,保留不改 |

> 详见 [第 2.5 节 错误信息优化](#25-错误信息优化句式模板化本轮可做)。

#### P1-4 Action 层两种异常处理风格并存
- 风格 A:`throws FLException`,让拦截器接住(主流)。
- 风格 B:本地 `try { ... } catch (FLException e) { setErrorCode/setErrorMsg }`(`LoginAction.java:101-108`)。
- 新人不知该用哪种,Review 无统一标准。

### 🟢 轻微(规范 / 整洁)

#### P2-1 FLException 包路径错位
- 放在 `com.fanglin.core.interceptor`,但它是全局异常类,与"拦截器"语义无关,应迁到 `com.fanglin.core.exception`。

#### P2-2 兜底码 `110000` 语义模糊 ✅ 已解决(第一档)
- 文档写"系统处理问题",拦截器写"操作失败,请稍后重试",Service 写"系统处理问题" —— 一个码三种说法。
- 第一档已统一为"系统繁忙,请稍后重试"。

#### P2-3 成功码与负数码混用
- `errorCode == 0` 表示成功,但没有显式常量;且与负数码 `-1/-2`、5 位正数码 `110xxx` 三种格式混用,缺乏统一编码规范文档。
- 第一档已在 error.md 顶部补"模块码段说明"表,明确了码段归属,部分缓解。

#### P2-4 `error.md` 大量空位 ✅ 已解决(第一档)
- `130041/130042`、`200045`、`260063/260064` 等几十个码为空。
- 第一档已将 302 个空位统一标 `reserved`,消除歧义。

---

## 三、调整方案

按**风险与收益**分三档推进。各档之间无强依赖,可独立交付。

### 第一档:快速止血 ✅ 已完成(提交 `ac3bcff00`)

> 目标:把账记清楚,补上线上排查硬伤。本档全部落地,全量编译通过(javac 4415 文件),已打包 6 模块 jar(8.3.027)。

| 方案 | 内容 | 对应文件 |
|---|---|---|
| 1.1 | FLException 新增 `(int,String,Throwable)` 构造;二参构造改 `super(msg)` 修复 `getMessage()` 恒 null | `core/interceptor/FLException.java` |
| 1.2 | 新增 `FLExceptionResolver` 统一异常解析,三拦截器 catch 三段式改为单行调用;日志调用保留在各拦截器(签名不同) | `core/interceptor/FLExceptionResolver.java`(新)、`CommonInterceptor`、`LoginInterceptor`、`AccessInterceptor` |
| 1.3 | 修 error.md 硬冲突:`260061` 双义拆出 `260072`;`160031/160032/330008` 标 reserved;`130101` 加注 | `error.md` + `inventory/.../AccessoriesItemServiceImpl.java` |
| 1.4 | 统一 `110000` 为"系统繁忙,请稍后重试"(代码 14 处 + 文档) | 5 个 Service Impl + `error.md` |
| 1.5 | 占位符 `[#1#]`/`[#2#]` → `{0}`/`{1}`(8 处);补模块码段说明表;302 空位标 reserved | `error.md` |

> 改动都是加法优先 + 文案统一,老调用路径完全兼容。

以下为待推进档位,按**风险与收益**分档,推荐顺序:**1.5 错误信息优化 → 第二档(全台错误目录)→ 第三档(规范整洁)**。

### 1.5 错误信息优化:句式模板化 + 兜底码精确化(本轮新增)

> 目标:把 error.md 的 703 条消息按统一句式规整,并同步代码 throw 点,消除 P1-5 的句式/用词不一致。**这是第二档生成 error-cn.json 的质量前提**——先保证源头文本规整,再派生目录。

#### 数据依据(703 条有效消息量化扫描)

| 问题 | 数据 |
|---|---|
| 高频句式集中 | `X不存在` 220 + `X不可操作` 87 + `X已存在` 59 = **366 条(52%)** |
| `不存在` 语序倒置 | 正向 228 处,倒置仅 2 处 |
| `不可操作` 带冗余"状态" | `X状态不可操作` 11 处 |
| `当前` 冗余前缀 | 12 处(无对比对象) |
| 用词不一致 | `不可操作`90 / `不能进行`7 / `不可修改`8 / `不可更新`4 / `不可删除`4 |
| 兜底消息笼统 | 12 处 |
| 半角逗号(非 bug) | 703 条**全部半角 `,`**,既定约定保留 |

#### 2.5.1 句式模板(覆盖 52% 高频场景)

确立统一句式,所有新消息必须遵守,老消息按模板归并:

| 场景 | 统一句式 | 示例 |
|---|---|---|
| 不存在 | `{对象}不存在` | `客户不存在`、`订单不存在` |
| 已存在 | `{对象}已存在` | `客户电话已存在` |
| 状态禁止 | `{对象}不可{动作}` | `装修单不可操作`、`款项不可修改` |
| 被引用 | `{对象}已被引用,不可删除` | `角色{0}已被引用,不可删除` |
| 余额不足 | `{对象}余额不足` | `客户预付款余额不足` |
| 未完成 | `{对象}未完成{环节}` | `订单首付款未完成财务处理` |

**关键规则**:
- **去掉"当前"前缀**(12 处):没有对比对象时一律删除
- **去掉冗余"状态"二字**:`装修单状态不可操作` → `装修单不可操作`
- **统一用"不可"代替"不能/不能进行/无法"**:`不能进行修改` → `不可修改`
- **对象一律前置**:消灭"不存在该xx"倒装(2 处)

#### 2.5.2 兜底码消息精确化(12 处笼统消息)

| 码 | 现状 | 优化 |
|---|---|---|
| `110007` | `网络问题` | `网络连接异常,请检查网络` |
| `110010` | `请求失败` | `请求处理失败` |
| `110000` | `系统繁忙,请稍后重试` | 保留(第一档已统一) |
| `360001` | `金蝶请求异常` | `金蝶请求失败,请稍后重试` |
| `360002` | `金蝶响应异常` | `金蝶响应失败,请稍后重试` |
| `360003` | `金蝶资源异常` | `金蝶资源不可用,请联系管理员` |

#### 2.5.3 实施路径(文档 + 代码同步改)

⚠️ **关键约束**:仅改 error.md 会加剧文档/代码漂移。必须同步修改对应 throw 点(路径 B)。

- **先做高频模板**(`不存在`/`已存在`/`不可操作` 这 366 处):句式规整、机械化程度高,throw 点消息与文档高度一致,迁移安全。
- **再做兜底码**(12 处):影响面小,但需逐个核对实际 throw 点的消息变体(如 `330010` 在代码里有 3 种措辞)。
- **保留半角逗号约定**:不改标点,避免与 3568 处 throw 冲突。
- **不改业务语义**:只调句式和用词,不改错误码与触发条件。



### 第二档:全台错误目录(errorcode 为唯一键)

> 目标:让 **errorcode 成为全台唯一的错误标识**,文本目录(`error-{lang}.json`)成为全台唯一的文本来源,代码(后端/前端)只引用码、不持有文本。国际化是目录的自然扩展(平行加文件),不是独立工程。
>
> **核心原则:errorcode 是唯一键,文本目录是全台共享资源,后端不"管理"文本只"过渡性读取"。**

#### 架构总览

```
┌─────────────────────────────────────────────────────────┐
│  error.md  ← 人写的权威文档(source of truth)            │
│      ↓ 构建期自动生成                                    │
│  error-cn.json / error-en.json  ← 机器目录(全台共享)    │
│      ↓ 谁展示谁读                                        │
│  ┌─────────────┐        ┌──────────────────┐            │
│  │  后端(阶段1)│        │  前端(阶段2)     │            │
│  │  读 cn 目录  │        │  按 locale 读目录 │            │
│  │  填兜底文本  │        │  自主翻译展示     │            │
│  └─────────────┘        └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

**为什么不用后端 ResourceBundle(.properties)?**
properties 是 Java 专用格式,前端读不了;且"后端查表填 errorMessage 再吐 JSON"本质是后端在做翻译,文本仍归后端。JSON 目录是全台通用格式,后端、前端、移动端都能直读,谁展示谁翻译,后端彻底解耦。

#### 2.1 两层结构:码层(常量) + 文本层(目录)

"常量还是 json 文件"不是二选一,是**互补的两层**:

| 层 | 载体 | 职责 | 示例 |
|---|---|---|---|
| **码层**(代码内) | 常量/枚举 | 编译期类型安全,消灭 magic number | `PaymentErrorCode.CONV_NOT_EXIST.code == 150043` |
| **文本层**(目录) | JSON 文件 | 运行期文本,按语言分文件 | `error-cn.json: {"150043": "转换款不存在"}` |

常量保证 throw 点不写错码,JSON 目录保证文本可换语言。**码就是连接两层的 key**——常量里的 `150043` 同时是 JSON 里的 key。两层都从 error.md 派生,谁都不当另一方的源头。

#### 2.2 目录文件格式(flat,按码字符串做 key)

```json
// src/com/fanglin/core/i18n/error-cn.json
{
  "150043": "转换款不存在",
  "150046": "转换款支付异常,{0}",
  "150073": "不支持其他支付平台"
}

// src/com/fanglin/core/i18n/error-en.json(未来,现在留空骨架)
{
  "150043": "Conversion payment does not exist",
  "150046": "Conversion payment error: {0}",
  "150073": "Unsupported payment platform"
}
```

按码 flat 存,不按模块嵌套——码前缀(150xxx)已编码模块,按码查是 O(1)。`{0}` 用 MessageFormat 标准占位符。

#### 2.3 目录读取器(后端过渡用,极简)

```java
// src/com/fanglin/core/i18n/ErrorCatalog.java
public final class ErrorCatalog {

    private static final Map<String, String> CN = load("error-cn.json");

    private ErrorCatalog() {}

    private static Map<String, String> load(String file) {
        try (InputStream in = ErrorCatalog.class.getClassLoader()
                .getResourceAsStream("com/fanglin/core/i18n/" + file)) {
            // JSON → Map(用项目已有的 json 库)
            return JSON.parseObject(in, new TypeReference<Map<String,String>>(){});
        } catch (Exception e) {
            return Collections.emptyMap();  // 读不到不阻断启动,退化为按码兜底
        }
    }

    /** 按码查中文文本,带参数填充。查不到返回兜底。 */
    public static String message(int code, String... args) {
        String pattern = CN.get(String.valueOf(code));
        if (pattern == null) return "错误码:" + code;
        return MessageFormat.format(pattern, (Object[]) args);
    }
}
```

#### 2.4 FLException 改造(只传码 + 参数,不传文本)

```java
// 新增:推荐用法,文本来自目录
public FLException(int code, String... errorArgs) {
    this.code = code;
    this.errorArgs = Arrays.asList(errorArgs);
    this.errorMessage = ErrorCatalog.message(code, errorArgs);  // 查目录
}

// 保留老的 (int, String) 构造方法:向后兼容,过渡期老代码不变
// 但新代码一律走上面这个
```

#### 2.5 错误码常量类体系(码层,每模块一个)

**包结构**:
```
src/com/fanglin/{module}/code/
└── {Module}ErrorCode.java   # 每模块一个
```

**公共接口**:`src/com/fanglin/core/code/FLCode.java`

```java
package com.fanglin.core.code;

/**
 * 错误码契约:所有模块错误码枚举实现此接口。
 * 注意:message 仅用于参考,实际展示文本以 error-{lang}.json 目录为准。
 */
public interface FLCode {
    int getCode();
}
```

**示例 - payment 模块样板**:`src/com/fanglin/payment/code/PaymentErrorCode.java`

```java
package com.fanglin.payment.code;

import com.fanglin.core.code.FLCode;

/**
 * 款项/支付模块错误码。
 * 码段:150000-150999。码值即 error-{lang}.json 的 key。
 * 新增码:① 先在此定义 → ② error.md 登记 → ③ 构建期自动生成 json。
 */
public enum PaymentErrorCode implements FLCode {

    CONV_NOT_EXIST        (150043),
    CONV_PAY_PROCESSING   (150045),
    CONV_PAY_ERROR        (150046),
    UNSUPPORTED_PLATFORM  (150073);

    private final int code;

    PaymentErrorCode(int code) {
        this.code = code;
    }

    @Override
    public int getCode() { return code; }
}
```

> 注意:枚举里**不再存 message**(对比 v1.0 方案)。文本只存在于 JSON 目录,避免码层与文本层双写漂移。枚举只持有码,码是连接两层唯一的桥。

**新代码使用方式**:
```java
// 无参:文本完全来自目录
throw new FLException(PaymentErrorCode.CONV_NOT_EXIST);

// 带参:目录里 "150046": "转换款支付异常,{0}",自动用 args 填 {0}
throw new FLException(PaymentErrorCode.CONV_PAY_ERROR, e.getMessage());
```

#### 2.6 两阶段落地(与"前端暂不动"调和)

前端现在依赖 JSON 里的 `errorMsg` 字段,过渡期后端必须读目录填 errorMsg——但这是"读",不是"管理"。

**阶段 1(现在做):后端读目录,文本不进代码**
```
throw 点: throw new FLException(PaymentErrorCode.CONV_NOT_EXIST)
                     ↓ 只带码(+可选参数)
后端启动加载 error-cn.json 到内存 Map
                     ↓ 拦截器/序列化时按码查表
JSON 响应: { "errorCode": 150043, "errorMsg": "转换款不存在" }
                     ↓ 前端照旧
前端: 无感(仍收 errorCode + errorMsg)
```
**关键:后端代码里不再有任何中文消息文本**。文本只在 error-cn.json。后端只是目录的过渡读者。

**阶段 2(未来,前端改时):前端直读目录**
```
后端响应: { "errorCode": 150043, "errorArgs": [] }   ← 不再带 errorMsg
                     ↓
前端按用户 locale fetch error-cn.json / error-en.json
                     ↓ 按码查表 + 填参数
展示: "转换款不存在" / "Conversion payment does not exist"
```
**同一份 JSON 目录,阶段 1 后端读、阶段 2 前端读,文件不动,只换消费者。** 这就是全台统一目录的价值——前期投入零浪费。

#### 2.7 error.md → JSON 构建期生成与校验

1. **生成脚本**:构建期解析 error.md 表格,生成 error-cn.json(以及预留的 error-en.json 骨架)。
2. **双向校验**:
   - error.md 每个 code 在 JSON 中必须有对应 key;
   - 常量类枚举的每个 code 必须在 error.md 中登记;
   - 三者不一致则构建失败。

这样 error.md 是唯一源头,JSON 和常量类都是派生物,从机制上消灭双轨漂移。

#### 2.8 收益与风险

**收益**:
| 原问题 | 解决方式 |
|---|---|
| 文档/代码双轨漂移 | error.md 唯一源头,JSON/常量派生,代码零文本 |
| throw 点硬编码 3568 处中文 | 新 throw 点只传码,老点渐进迁移 |
| 国际化要改 3568 处 | 加 error-en.json 一份文件,代码零改动 |
| 前端 i18n 要后端配合 | 前端直接读 JSON 目录,后端无感 |
| 错误码 magic number | 常量枚举消除 |

**风险与缓解**:
- **风险**:3568 处老 throw 第二个参数是硬编码消息,迁移需逐个核对。
- **缓解**:仅新 throw 点启用目录查表;老 throw 点保留二参构造(不查表,以第二参数为准),向后兼容。日常迭代逐步替换,不立项集中重构。

---

### 第三档:规范与整洁(可选,按需推进)

#### 方案 3.1 FLException 迁包

从 `com.fanglin.core.interceptor` 迁到 `com.fanglin.core.exception`。IDE 全局 Move 一键完成,需同步更新 `import`(全项目唯一引用,影响面可控)。

**收益**:P2-1。

---

#### 方案 3.2 引入 HTTP 状态码语义(可选,配合第二档阶段2)

在拦截器层根据错误码段映射 HTTP 状态:

| 错误码段 | HTTP 状态 | 含义 |
|---|---|---|
| `-1`(无权限) | `401 Unauthorized` | 未登录或会话失效 |
| `-2`(无权限) / `230xxx`(权限) | `403 Forbidden` | 登录但无操作权限 |
| `110xxx`(参数/校验) | `400 Bad Request` | 客户端参数错误 |
| `110000`(系统) | `500 Internal Server Error` | 服务端异常 |
| 其它业务校验 | `200 OK`(保持现状) | 正常业务流,靠 errorCode 表达 |

**收益**:APM / 网关 / 监控能靠 HTTP 状态做告警;前端拦截器能统一处理 401 跳登录。

**风险**:前端若强依赖"永远 200",需灰度。**建议仅在新增的 REST 风格接口上启用**,老接口保持 200。本档需配合第二档阶段2(前端接入)时一并推进,当前前端暂不动则不做。

---

#### 方案 3.3 统一 Action 层异常风格

在 `AGENTS.md` 中补充约束:

> **Action 异常处理统一规范**
> - Action 方法统一 `throws FLException`,**禁止本地 try-catch**(让拦截器统一处理)。
> - `LoginAction` 等历史代码作为豁免,新 Action 必须遵守。
> - Action 方法体内 **禁止 `catch (Exception)`**,异常一律上抛由拦截器接管。

---

## 四、`error.md` 修整清单(第一档已交付)

> 本节记录第一档实际执行的修整动作及据实修正的处置。

### 4.1 硬冲突 ✅ 已处理

| 原冲突 | 处置(据实修正) |
|---|---|
| `260061` 双义("货单已存在"/"施工节点不匹配") | ✅ "施工节点不匹配"挪到 `260072`,代码 `AccessoriesItemServiceImpl` 同步 |
| `160031`/`160032` 都是"活动票已存在" | ✅ 代码查证两码均无引用,均标 `reserved` |
| `330008`/`330010` 都是"绑定订单失败" | ✅ 查证 `330008` 无引用标 reserved;`330010` 代码在用(保留)。**与原计划相反**:原计划保留 330008 标 330010,实际反过来 |
| `130040`/`130101` 都是"话术不存在" | ✅ 查证两码都在用(Talking/Chating),**非真冲突,不合并**,保留两者并在 `130101` 加注 |

### 4.2 措辞统一 ✅ 已完成

| 错误码 | 统一为 | 范围 |
|---|---|---|
| `110000` | **系统繁忙,请稍后重试** | 文档 + 代码 14 处(LoginServiceImpl/UserPreferServiceImpl/A20251113/A20260109/SystemConfigServiceImpl) |

### 4.3 占位符统一 ✅ 已完成

`[#1#]` / `[#2#]` 旧语法统一为 `{0}` / `{1}`(8 处)。`(#1#)` 形式同步改为 `({0})`。

### 4.4 文档结构增强 ✅ 已完成

已在 error.md 顶部新增"模块码段说明"小节(27 个码段)+ 占位符约定说明。

### 4.5 空位管理 ✅ 已完成

302 个空位统一标注 `reserved`。

### 4.6 待办:错误信息句式优化(1.5 节,未启动)

参见 [2.5 错误信息优化](#25-错误信息优化句式模板化兜底码精确化本轮新增)。涉及 703 条消息的句式模板化与 12 处兜底码精确化,需文档+代码同步改。

---

## 五、落地路线图

### 第一档(快速止血)✅ 已完成

| 序号 | 任务 | 涉及文件 | 预估工时 | 风险 |
|---|---|---|---|---|
| 1.1 | FLException 补 cause 构造方法 | `FLException.java` | 0.5h | 零(纯加法) |
| 1.2 | 抽 FLExceptionResolver,改造三拦截器 | `FLExceptionResolver.java`(新)、`CommonInterceptor.java`、`LoginInterceptor.java`、`AccessInterceptor.java` | 2h | 低(行为等价) |
| 1.3 | 修 `error.md` 硬冲突 | `error.md` + `AccessoriesItemServiceImpl.java` | 1h | 零 |
| 1.4 | 统一 `110000` 语义 | `error.md` + 5 个 Service Impl | 0.5h | 零 |
| 1.5 | 占位符统一 + 码段说明 + 空位 reserved | `error.md` | 1h | 零 |

**第一档交付物**:`error.md` 自洽无冲突;FLException 带异常链;异常处理逻辑单点维护;全量编译通过(javac 4415 文件 EXIT 0);6 模块 jar 已打包(8.3.027)。提交 `ac3bcff00`。

---

### 1.5 错误信息优化(待启动)

| 序号 | 任务 | 涉及文件 | 预估工时 | 风险 |
|---|---|---|---|---|
| 1.5a | 高频句式模板化(不存在/已存在/不可操作 366 处) | `error.md` + 对应 throw 点 | 4h | 中(逐个核对) |
| 1.5b | 兜底码精确化(12 处) | `error.md` + 对应 throw 点 | 1h | 低 |
| 1.5c | 去"当前"前缀(12 处)+ 去"状态"冗余(11 处) | `error.md` + 对应 throw 点 | 1h | 低 |

**交付物**:error.md 703 条消息句式统一;代码 throw 点与文档一致;为第二档生成 error-cn.json 提供规整源头。

---

### 第二档(全台错误目录)

| 序号 | 任务 | 涉及文件 | 预估工时 | 风险 |
|---|---|---|---|---|
| 2.1 | 编写 error.md → error-cn.json 生成脚本 | 构建脚本 | 1h | 零 |
| 2.2 | 创建 `ErrorCatalog` 目录读取器 | `core/i18n/ErrorCatalog.java`(新) | 1h | 零 |
| 2.3 | FLException 新增 `(int, String...)` 查目录构造方法 | `FLException.java` | 0.5h | 零(纯加法) |
| 2.4 | 定义 `FLCode` 接口 | `core/code/FLCode.java`(新) | 0.5h | 零 |
| 2.5 | payment 模块常量样板 `PaymentErrorCode` | `payment/code/PaymentErrorCode.java`(新) | 1h | 零 |
| 2.6 | payment 模块老 throw 点迁移到常量 + 目录 | payment 模块 Service | 2h | 中 |
| 2.7 | error.md ↔ json ↔ 常量 三向构建期校验 | 构建脚本 | 2h | 低 |
| 2.8 | 扩展至下一个模块(approval) | approval 模块 | 2h | 中 |

**第二档交付物**:全台错误目录(error-cn.json);码层常量体系;error.md 为唯一源头;构建期三向校验;国际化只需平行加 error-en.json。

---

### 第三档(规范整洁,可选)

| 序号 | 任务 | 预估工时 | 优先级 |
|---|---|---|---|
| 3.1 | FLException 迁包 `interceptor` → `exception` | 1h(含回归) | 低 |
| 3.2 | HTTP 状态码映射(配合第二档阶段2) | 2h | 中(需前端接入) |
| 3.3 | Action 异常风格写入 `AGENTS.md` | 0.5h | 高(文档约束) |

---

## 六、里程碑与验收标准

### 里程碑 M1:第一档完成 ✅

**验收**(全部通过):
- [x] `FLException` 新增 `(int, String, Throwable)` 构造方法,`getMessage()` 返回非 null。
- [x] 三个拦截器 catch 块均调用 `FLExceptionResolver.resolve(...)`,无重复的三段式逻辑。
- [x] `error.md` 无重复错误码。
- [x] `110000` 文档与代码消息一致(均为"系统繁忙,请稍后重试")。
- [x] `error.md` 新增模块码段说明。
- [x] 全量编译通过(javac 4415 文件)。

### 里程碑 M1.5:错误信息优化完成

**验收**:
- [ ] error.md 703 条消息符合句式模板(无"当前"前缀、无冗余"状态"、对象前置)。
- [ ] 12 处兜底码消息精确化。
- [ ] 代码 throw 点与文档消息一致(抽样校验)。

### 里程碑 M2:第二档完成(error-cn.json + payment 样板)

**验收**:
- [ ] `ErrorCatalog`、`FLCode`、`PaymentErrorCode` 存在并编译通过。
- [ ] `error-cn.json` 由构建脚本从 error.md 生成,覆盖全部非 reserved 条目。
- [ ] payment 模块所有 `throw new FLException(15xxxx, "...")` 替换为 `throw new FLException(PaymentErrorCode.XXX)`。
- [ ] 构建期三向校验通过(error.md ↔ json ↔ 常量)。
- [ ] payment 模块接口行为零回归(手工冒烟)。
- [ ] 后端代码中 payment 模块零中文消息文本。

### 里程碑 M3:全模块迁移(中长期)

**验收**:
- [ ] 全部业务模块的错误码常量类就位。
- [ ] 全项目无裸 magic number throw(脚本扫描)。
- [ ] error.md / error-cn.json / 常量类 三向一致。

### 里程碑 M4(未来):前端接入目录

**验收**:
- [ ] `error-en.json` 骨架存在(可暂为空)。
- [ ] 后端响应可切为 `{errorCode, errorArgs}` 不带 errorMsg(灰度)。
- [ ] 前端按 locale 读目录展示。

---

## 七、风险与回滚

| 风险 | 影响范围 | 缓解措施 |
|---|---|---|
| 1.5/第二档迁移改写 throw 点,引入行为偏差 | 单模块 | 每模块独立迁移、独立冒烟;不跨模块批量替换 |
| error-cn.json 与 error.md 不一致导致消息错乱 | 全局 | 构建期校验脚本,不一致则构建失败 |
| ErrorCatalog 读不到 json 导致启动异常 | 全局 | load 失败退化为空 Map,按码兜底,不阻断启动 |
| HTTP 状态码映射导致前端异常 | 前端 | 第三档仅在第二档阶段2推进,老接口保持 200 |
| FLException 迁包导致大量 import 变更 | 全局 | IDE 全局 Move,提交前全量编译 |

**回滚**:所有改动均以**加法优先**——新增构造方法、新增常量类、新增 json 目录,老代码路径保持可用。任一档出问题,回滚对应提交即可,不影响其它档。

---

## 八、附录:关键文件清单

### 已交付(第一档)

| 角色 | 文件路径 |
|---|---|
| 异常类(补 cause 链) | `src/com/fanglin/core/interceptor/FLException.java` |
| 统一异常解析器(新) | `src/com/fanglin/core/interceptor/FLExceptionResolver.java` |
| Common 拦截器 | `src/com/fanglin/core/interceptor/CommonInterceptor.java` |
| Login 拦截器 | `src/com/fanglin/core/interceptor/LoginInterceptor.java` |
| Access 拦截器 | `src/com/fanglin/core/interceptor/AccessInterceptor.java` |
| 错误码文档(修整后) | `docs/03-API文档/API/error.md` |
| 110000 文案统一(5 个 Service) | `LoginServiceImpl` / `UserPreferServiceImpl` / `A20251113ServiceImpl` / `A20260109ServiceImpl` / `SystemConfigServiceImpl` |
| 码迁移(260061→260072) | `inventory/.../AccessoriesItemServiceImpl.java` |

### 待新增(第二档)

| 角色 | 文件路径 |
|---|---|
| 错误码契约接口 | `src/com/fanglin/core/code/FLCode.java`(新) |
| 错误目录读取器 | `src/com/fanglin/core/i18n/ErrorCatalog.java`(新) |
| 中文错误目录 | `src/com/fanglin/core/i18n/error-cn.json`(新) |
| 英文错误目录(骨架) | `src/com/fanglin/core/i18n/error-en.json`(新) |
| payment 错误码常量 | `src/com/fanglin/payment/code/PaymentErrorCode.java`(新) |

### 参考(未改动,理解现状用)

| 角色 | 文件路径 |
|---|---|
| Action 基类(含 errorCode/errorMsg 字段) | `src/com/fanglin/core/action/BaseAction.java` |
| Struts2 配置 | `conf/struts.xml` |
| Service 层 catch/throw 模板示例 | `src/com/fanglin/payment/service/impl/PaytranServiceImpl.java` |
| Action 层本地 catch 示例 | `src/com/fanglin/common/action/LoginAction.java` |

---

## 九、决策记录

> 本节记录评审中确认的关键决策,便于后续追溯。

| 日期 | 决策 | 理由 |
|---|---|---|
| 2026-07-14 | 采用"渐进迁移"而非一次性重构 | 3568 处 throw 点无法一次性安全替换 |
| 2026-07-14 | 第一档优先补 `cause` 构造方法 | 线上排查硬伤,纯加法零风险 |
| 2026-07-14 | HTTP 状态码映射列为可选第三档 | 需前端配合,灰度推进 |
| 2026-07-14 | **放弃 properties(ResourceBundle)方案,改用 JSON 全台错误目录** | properties 是 Java 专用格式前端读不了;"后端查表填文本"本质仍是后端管翻译。JSON 目录全台通用,谁展示谁读,后端彻底解耦 |
| 2026-07-14 | **errorcode 为唯一键,目录按语言分文件(error-{lang}.json)** | 国际化只需平行加文件,代码零改动;同一目录阶段1后端读、阶段2前端读,前期投入零浪费 |
| 2026-07-14 | **常量枚举只持有 code,不持有 message** | 避免"码层常量"与"文本层目录"双写漂移;文本唯一来源是 JSON 目录 |
| 2026-07-14 | 国际化驱动力定位"前瞻储备",当前只做架构留口 | 暂无明确多语言业务需求,方案深度止于"可扩展"而非"真翻译"。error-en.json 留空骨架 |
| 2026-07-14 | **前端暂不动**(国际化阶段1) | 后端读目录填 errorMsg,前端无感;未来前端接入时文件不动只换消费者 |
| 2026-07-14 | **保留半角英文逗号约定**(703 条消息) | 全项目既定约定,与 3568 处 throw 一致;改为全角会引发全面冲突,收益为零 |
| 2026-07-14 | 错误信息优化走"文档+代码同步改"(路径B) | 仅改文档会加剧双轨漂移;高频模板机械化程度高,可安全迁移 |

---

**文档维护**:每次评审或实施推进后,更新本计划的"决策记录"与各里程碑验收清单。
