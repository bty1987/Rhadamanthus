# utils - 工具类模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **utils**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

utils 模块提供系统全局使用的**通用工具方法集合**，涵盖日期处理、Excel 导入导出、加解密、字符串处理、文件操作、二维码生成等基础功能，为其他业务模块提供底层工具支持。

**核心功能**
- 日期时间工具（DateUtil）
- Excel 导入导出（PoiExcelUtil）
- 加解密工具（Base64Util）
- 字符串格式化（FormatUtil）
- HTTP 请求工具（HttpUtil）
- IP 地址解析（IPUtil）
- 二维码生成（QRCodeUtil）
- 拼音转换（PinYin4Util）
- UUID 生成（UUIDUtil）
- 日志工具（LogUtils）
- 分页工具（Paging）
- Bean 复制（BeanUtil）
- Cookie 工具（CookieUtil）
- 系统配置（SystemConfig）
- Office 转 PDF（Office2Pdf）
- 水印工具（WMCodeUtil）
- 消息工具（MessageUtil）

---

## 入口与启动

### 工具类清单
- `DateUtil.java` - 日期时间处理
- `PoiExcelUtil.java` - Excel 操作
- `Base64Util.java` - Base64 编解码
- `FormatUtil.java` - 字符串格式化
- `HttpUtil.java` - HTTP 请求
- `IPUtil.java` - IP 地址工具
- `QRCodeUtil.java` - 二维码生成
- `PinYin4Util.java` - 拼音转换
- `UUIDUtil.java` - UUID 生成
- `LogUtils.java` - 日志记录
- `Arith.java` - 精确数学运算
- `Paging.java` - 分页对象
- `BeanUtil.java` - Bean 属性复制
- `CookieUtil.java` - Cookie 操作
- `SystemConfig.java` - 系统配置读取
- `Office2Pdf.java` - Office 文档转 PDF
- `WMCodeUtil.java` - 水印处理
- `MessageUtil.java` - 消息工具
- `Constant.java` - 常量定义
- `SpringApplicationContext.java` - Spring 上下文工具
- `SubjectInfoUtil.java` - 主体信息工具

---

## 核心工具详解

### 1. DateUtil - 日期时间工具

#### 主要功能
```java
// 格式化当前时间
String current(String format)
String current()  // 默认 yyyyMMddHHmmss

// 字符串转日期
Date parseDate(String date, String format)

// Date 与 Timestamp 互转
Timestamp getDateToTimestamp(Date date)
Date getTimestampToDate(Timestamp tamp)

// 日期格式转换
String format(String date, String sourceFormat, String transFormat)
String formatMedium(String date, String transFormat)
String formatShort(String date)

// 日期转字符串
String getDateToDateString(Date date, String format)

// 日期运算
Date plusDay(Date date, int num)
int diffDay(Timestamp start, Timestamp end)

// 月份首尾日期
Date getFirstDay(Date theDate)
Date getLastDay(Date theDate)

// 工作日计算（排除周末与节假日）
int getWorkDays(Date startDate, Date endDate)
int getWorkDays(Timestamp startTs, Timestamp endTs)
Date getEndWorkDate(Date startDate, int workingDays)

// 节假日配置
Set<String> initHoliday()  // 2025年法定节假日
```

#### 使用示例
```java
// 获取当前时间串
String now = DateUtil.current(); // "20251201183002"

// 计算工作日天数
Date start = DateUtil.parseDate("2025-10-01", "yyyy-MM-dd");
Date end = DateUtil.parseDate("2025-10-31", "yyyy-MM-dd");
int workDays = DateUtil.getWorkDays(start, end); // 自动排除周末和节假日

// 根据工作日计算结束日期
Date endDate = DateUtil.getEndWorkDate(start, 20); // 20个工作日后的日期
```

---

### 2. PoiExcelUtil - Excel 导入导出

#### 主要功能
```java
// 导出 Excel
void exportExcel(ExcelWorkSheet<?> sheetObj, OutputStream out)

// 读取 Excel
List<List<String>> readExcel(String filePath)
List<List<String>> readExcel(File file)
List<List<String>> readExcel(File file, String fileName)
```

#### 使用示例
```java
// 导出 Excel
ExcelWorkSheet<UserVO> sheet = new ExcelWorkSheet<>();
sheet.setSheetName("用户列表");
sheet.setColumns(Arrays.asList("工号", "姓名", "部门"));
sheet.setPropertyNames(Arrays.asList("userId", "userName", "deptName"));
sheet.setData(userList);

OutputStream out = new FileOutputStream("用户列表.xls");
PoiExcelUtil.exportExcel(sheet, out);

// 读取 Excel
List<List<String>> content = PoiExcelUtil.readExcel("数据.xlsx");
for (List<String> row : content) {
    // 处理每行数据
}
```

#### 支持格式
- `.xls` (Excel 2003 及以前)
- `.xlsx` (Excel 2007 及以后)

---

### 3. QRCodeUtil - 二维码生成

#### 主要功能
- 生成二维码图片
- 支持自定义尺寸、颜色、容错级别
- 支持 Logo 嵌入

---

### 4. PinYin4Util - 拼音转换

#### 主要功能
- 中文转拼音
- 获取首字母
- 支持多音字

---

### 5. HttpUtil - HTTP 请求

#### 主要功能
- GET 请求
- POST 请求
- 文件上传
- 响应解析

---

### 6. Arith - 精确数学运算

#### 主要功能
```java
// 精确加减乘除
double add(double v1, double v2)
double sub(double v1, double v2)
double mul(double v1, double v2)
double div(double v1, double v2, int scale)

// 四舍五入
double round(double v, int scale)
```

**用途**: 解决浮点数运算精度问题，适用于金额计算。

---

### 7. Base64Util - Base64 编解码

#### 主要功能
- 字符串 Base64 编码/解码
- 文件 Base64 编码/解码
- 图片 Base64 处理

---

### 8. UUIDUtil - UUID 生成

#### 主要功能
- 生成标准 UUID
- 生成无横线 UUID
- 生成短 UUID

---

### 9. Paging - 分页工具

#### 主要功能
```java
class Paging<T> {
    private int page;        // 当前页
    private int rows;        // 每页行数
    private int total;       // 总记录数
    private List<T> data;    // 数据列表

    // 计算总页数
    int getPages()
}
```

---

### 10. SystemConfig - 系统配置

#### 主要功能
```java
// 读取配置文件
String getString(String key)
int getInt(String key)
boolean getBoolean(String key)
```

**配置文件**: `conf/sysconfig.properties`

---

### 11. Office2Pdf - Office 转 PDF

#### 主要功能
- Word 转 PDF
- Excel 转 PDF
- PowerPoint 转 PDF

**依赖**: OpenOffice/LibreOffice

---

### 12. LogUtils - 日志工具

#### 主要功能
- 统一日志记录
- 日志级别控制
- 异常堆栈记录

---

## 常量定义（Constant）

```java
// 全局常量
public class Constant {
    // 字符编码
    public static final String CHARSET_UTF8 = "UTF-8";

    // 日期格式
    public static final String DATE_FORMAT_YYYYMMDD = "yyyy-MM-dd";
    public static final String DATE_FORMAT_FULL = "yyyy-MM-dd HH:mm:ss";

    // 状态码
    public static final int STATUS_SUCCESS = 0;
    public static final int STATUS_FAIL = -1;

    // 其他常量...
}
```

---

## 测试与质量

### 当前测试覆盖
- 部分工具类有 main 方法用于测试
- 缺少系统化的单元测试

### 建议增强
1. 为每个工具类添加 JUnit 单元测试
2. 测试边界条件与异常场景
3. 验证日期计算的准确性
4. 测试 Excel 大文件处理性能
5. 验证加解密的正确性

---

## 常见问题 (FAQ)

**Q: 为什么要使用 Arith 而不是直接用 BigDecimal？**
A: Arith 是对 BigDecimal 的简化封装，提供更便捷的静态方法，适合金额计算场景。

**Q: DateUtil 的工作日计算准确吗？**
A: 准确，已内置 2025 年法定节假日配置。需要每年更新 `initHoliday()` 方法中的节假日列表。

**Q: Excel 导出支持的最大数据量是多少？**
A:
- `.xls` 格式：最多 65536 行
- `.xlsx` 格式：最多 1048576 行
- 建议超过 1 万条数据时分批导出

**Q: 如何自定义日期格式？**
A: 使用 DateUtil 的 format 方法，传入自定义格式串：
```java
String custom = DateUtil.format("20251201", "yyyyMMdd", "yyyy年MM月dd日");
```

**Q: 二维码如何添加 Logo？**
A: QRCodeUtil 支持 Logo 嵌入，可在生成二维码时传入 Logo 图片路径。

---

## 相关文件清单

### 核心代码
```
src/com/fanglin/utils/
├── DateUtil.java                         - 日期时间工具 ★
├── PoiExcelUtil.java                     - Excel 导入导出 ★
├── Arith.java                            - 精确数学运算 ★
├── Base64Util.java                       - Base64 编解码
├── BeanUtil.java                         - Bean 属性复制
├── Constant.java                         - 常量定义
├── CookieUtil.java                       - Cookie 操作
├── FormatUtil.java                       - 格式化工具
├── HttpUtil.java                         - HTTP 请求
├── IPUtil.java                           - IP 地址工具
├── LogUtils.java                         - 日志工具
├── MessageUtil.java                      - 消息工具
├── Office2Pdf.java                       - Office 转 PDF
├── Paging.java                           - 分页对象
├── PinYin4Util.java                      - 拼音转换
├── QRCodeUtil.java                       - 二维码生成
├── SpringApplicationContext.java         - Spring 上下文
├── SubjectInfoUtil.java                  - 主体信息
├── SystemConfig.java                     - 系统配置读取
├── UUIDUtil.java                         - UUID 生成
└── WMCodeUtil.java                       - 水印处理
```

**★ 标注的是最常用的核心工具类**

---

## 使用建议

### 1. 日期处理统一使用 DateUtil
- 避免直接使用 `SimpleDateFormat`（非线程安全）
- 工作日计算优先使用 `getWorkDays`
- 每年初更新节假日配置

### 2. 金额计算统一使用 Arith
- 避免浮点数精度问题
- 四舍五入使用 `round` 方法

### 3. Excel 导入导出使用 PoiExcelUtil
- 大文件建议分批处理
- 注意内存占用

### 4. 配置读取使用 SystemConfig
- 集中管理配置项
- 避免硬编码

### 5. 统一使用 LogUtils 记录日志
- 便于日志级别控制
- 便于问题排查

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化工具类模块 AI 上下文文档
- 记录 20+ 个核心工具类功能
- 补充 DateUtil 工作日计算详解
- 补充 PoiExcelUtil Excel 操作说明
- 添加使用建议与常见问题解答
