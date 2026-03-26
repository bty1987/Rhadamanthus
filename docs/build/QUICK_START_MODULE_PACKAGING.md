# Maven 按模块打包快速使用指南

> 更新时间：2026-03-26
> 适用于：Rhadamanthus ERP 系统

---

## ✅ 当前状态

pom.xml 已配置完成，支持以下模块的独立打包：

### 可用 Profile

| Profile ID | 说明 | 包含模块 |
|-----------|------|---------|
| `inventory` | 库存管理模块 | inventory + common + core |
| `quotation` | 报价管理模块 | quotation + quotetion + common + core |
| `seiya` | 星野系统模块 | seiya + common + core |
| `sales` | 销售管理模块 | sales + common + core |
| `construction` | 施工管理模块 | construction + common + core |
| `decoration` | 装修管理模块 | decoration + common + core |
| `business-modules` | 所有业务模块 | 所有业务模块 + common + core |

---

## 🚀 快速命令

### 编译单个模块

```bash
# 只编译库存模块
mvn clean compile -P inventory

# 只编译报价模块
mvn clean compile -P quotation

# 只编译星野模块
mvn clean compile -P seiya

# 只编译销售模块
mvn clean compile -P sales

# 只编译施工模块
mvn clean compile -P construction

# 只打包装修模块
mvn clean compile -P decoration

# 编译所有业务模块
mvn clean compile -P business-modules
```

### 打包单个模块

```bash
# 只打包库存模块
mvn clean package -P inventory

# 只打包报价模块
mvn clean package -P quotation

# 只打包星野模块
mvn clean package -P seiya

# 只打包销售模块
mvn clean package -P sales

# 只打包施工模块
mvn clean package -P construction

# 只打包装修模块
mvn clean package -P decoration

# 打包所有业务模块
mvn clean package -P business-modules
```

### 打包完整项目（默认）

```bash
mvn clean package
```

---

## 📦 打包产物

### 打包后的文件位置

```
Rhadamanthus/
├── target/
│   ├── classes/              # 编译后的 .class 文件
│   └── rhadamanthus-1.0.0.jar  # 打包的 JAR 文件
└── WebContent/
    └── WEB-INF/
        └── lib/             # 所有依赖库（自动复制）
```

### 按模块打包的 JAR 文件

- **默认打包：** `target/rhadamanthus-1.0.0.jar`（包含所有模块）
- **按模块打包：** `target/rhadamanthus-1.0.0.jar`（只包含指定模块）

---

## 🔧 常用命令

### 查看所有可用的 Profile

```bash
mvn help:active-profiles
```

### 查看依赖树

```bash
# 查看完整依赖树
mvn dependency:tree

# 查看某个模块的依赖
mvn dependency:tree -Dincludes=com.fanglin:inventory
```

### 清理构建产物

```bash
mvn clean
```

### 跳过测试

```bash
mvn clean package -P inventory -DskipTests
```

---

## ⚠️ 注意事项

### 1. 第三方 JAR 包

pom.xml 中配置了 4 个本地 JAR 包（使用 `systemPath`），需要确保这些文件存在：

```
project-libs/
├── nlpush_sdk_java-1.0.06.jar        # 银盛支付
├── fadada_api_sdk-1.7.17.1.jar       # 法大大
├── sun.misc.base64decoder.jar         # Base64 解码器
└── lippi-oapi-encrpt.jar             # 钉钉加密
```

如果这些文件不存在，编译会失败。

### 2. Java 版本

- **编译版本：** Java 1.8
- **运行环境：** Tomcat 7（建议 Java 7/8）

### 3. 模块依赖

打包单个业务模块时，会自动包含：
- 业务模块本身（如 inventory）
- common 模块（公共模块）
- core 模块（核心模块）

### 4. 配置文件

配置文件在 `conf/` 目录，打包时会自动包含：
- `ApplicationContext.xml`（Spring 配置）
- `struts.xml`（Struts2 配置）
- `jdbc.properties`（数据库配置）
- 其他 .xml 和 .properties 文件

---

## 💡 使用场景

### 场景 1：只修改了库存模块

```bash
# 只编译和打包库存模块
mvn clean package -P inventory

# 部署到 Tomcat
cp target/rhadamanthus-1.0.0.jar <TOMCAT_HOME>/webapps/Rhadamanthus/WEB-INF/lib/
```

### 场景 2：只修改了报价和施工模块

```bash
# 编译报价和施工模块
mvn clean compile -P quotation
mvn clean compile -P construction

# 或者使用组合打包
mvn clean package -P business-modules
```

### 场景 3：发布新版本

```bash
# 打包完整项目
mvn clean package

# 复制依赖到 WEB-INF/lib
mvn dependency:copy-dependencies

# 打包 WAR
cd WebContent
jar cvf ../Rhadamanthus.war *

# 部署到生产环境
```

---

## 🐛 常见问题

### Q1: 编译失败，提示找不到 JAR 包

**错误信息：**
```
[ERROR] COMPILATION ERROR
[ERROR] 某个类找不到符号
```

**解决方案：**
1. 检查 `project-libs/` 目录下是否有缺失的 JAR 包
2. 确认 `.classpath` 中的 JAR 路径是否正确
3. 运行 `mvn dependency:resolve` 下载缺失的依赖

### Q2: Profile 不生效

**错误信息：**
```
[WARNING] No profiles detected!
```

**解决方案：**
1. 确认 pom.xml 中有 `<profiles>` 标签
2. 确认 Profile ID 拼写正确（如 `inventory` 而不是 `Inventory`）
3. 运行 `mvn help:active-profiles` 查看激活的 Profile

### Q3: 打包的 JAR 文件太大

**问题：** JAR 文件包含不需要的类。

**解决方案：**
使用 Profile 打包指定模块，而不是打包完整项目：
```bash
# 不要这样（打包所有模块）
mvn clean package

# 而是这样（只打包需要的模块）
mvn clean package -P inventory
```

---

## 📚 更多文档

- **详细配置指南：** `docs/build/MODULE_PACKAGING_GUIDE.md`
- **Maven 快速开始：** `docs/build/MAVEN_QUICK_START.md`
- **缺失 JAR 包分析：** `docs/build/缺失JAR包分析报告.md`

---

**最后更新：** 2026-03-26
**维护者：** AI 辅助生成
