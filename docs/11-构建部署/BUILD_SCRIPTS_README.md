# Rhadamanthus 模块打包脚本使用说明

> 创建时间：2026-03-26
> 适用于：Rhadamanthus ERP 系统

---

## 📋 脚本清单

| 脚本名称 | 平台 | 功能 |
|---------|------|------|
| `build-module.sh` | Linux/Mac | 通用模块打包脚本，支持所有模块 |
| `build-decoration-jar.sh` | Linux/Mac | 专门打包 decoration 模块 |
| `build-decoration-jar.bat` | Windows | 专门打包 decoration 模块 |

---

## 🚀 快速使用

### Linux/Mac 环境

#### 方式 1：使用通用脚本（推荐）

```bash
cd /root/clawd/projects/Rhadamanthus

# 打包 decoration 模块
./build-module.sh decoration

# 打包 inventory 模块
./build-module.sh inventory

# 打包 quotation 模块
./build-module.sh quotation

# 打包所有业务模块
./build-module.sh business-modules
```

#### 方式 2：使用专用脚本

```bash
# 只打包 decoration 模块
./build-decoration-jar.sh
```

### Windows 环境

```cmd
cd D:\ERP\Rhadamanthus

# 只打包 decoration 模块
build-decoration-jar.bat
```

---

## 📦 支持的模块

| 模块名称 | 说明 | 包含内容 |
|---------|------|---------|
| `inventory` | 库存管理模块 | inventory + common + core |
| `quotation` | 报价管理模块 | quotation + quotetion + common + core |
| `seiya` | 星野系统模块 | seiya + common + core |
| `sales` | 销售管理模块 | sales + common + core |
| `construction` | 施工管理模块 | construction + common + core |
| `decoration` | 装修管理模块 | decoration + common + core |
| `business-modules` | 所有业务模块 | 所有业务模块 + common + core |

---

## 🔧 使用前准备

### 1. 安装 Java

**Linux/Mac:**
```bash
# 检查 Java 是否安装
java -version

# 如果未安装，安装 OpenJDK 8
# Ubuntu/Debian
sudo apt-get install openjdk-8-jdk

# CentOS/RHEL
sudo yum install java-1.8.0-openjdk-devel

# macOS
brew install openjdk@8
```

**Windows:**
- 下载 JDK 1.8：https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html
- 安装后配置环境变量：
  ```
  JAVA_HOME=C:\Program Files\Java\jdk1.8.0_xxx
  Path=%Path%;%JAVA_HOME%\bin
  ```

### 2. 安装 Maven

**Linux/Mac:**
```bash
# 检查 Maven 是否安装
mvn -version

# 如果未安装，下载并安装 Maven
# 下载：https://maven.apache.org/download.cgi
# 解压到 /opt/maven
# 配置环境变量
export M2_HOME=/opt/maven
export PATH=$PATH:$M2_HOME/bin
```

**Windows:**
- 下载 Maven：https://maven.apache.org/download.cgi
- 解压到 `C:\Maven\apache-maven-3.x.x`
- 配置环境变量：
  ```
  MAVEN_HOME=C:\Maven\apache-maven-3.x.x
  Path=%Path%;%MAVEN_HOME%\bin
  ```

### 3. 配置 Maven 镜像（可选，提升速度）

编辑 `~/.m2/settings.xml`（Linux/Mac）或 `%USERPROFILE%\.m2\settings.xml`（Windows），添加阿里云镜像：

```xml
<mirrors>
    <mirror>
        <id>aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Aliyun Maven Mirror</name>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

### 4. 确保第三方 JAR 包存在

检查 `project-libs/` 目录下是否有以下文件：

```
project-libs/
├── nlpush_sdk_java-1.0.06.jar        # 银盛支付 SDK
├── fadada_api_sdk-1.7.17.1.jar       # 法大大 SDK
├── sun.misc.base64decoder.jar         # Base64 解码器
└── lippi-oapi-encrpt.jar             # 钉钉加密
```

如果这些文件不存在，编译会失败。可以从 `.classpath` 中的路径复制：
- `E:/Ali/Athena/98.Jars/Other/yspay/`
- `E:/Ali/Athena/98.Jars/Other/fadada/`
- `E:/Ali/Athena/98.Jars/Other/hwyun-obs/`

---

## 📝 打包流程

脚本会自动执行以下步骤：

### 步骤 1：环境检查
- 检查 Maven 是否安装
- 检查 Java 是否安装
- 显示版本信息

### 步骤 2：清理旧的构建
```bash
mvn clean
```

### 步骤 3：编译指定模块
```bash
mvn compile -P <module_name>
```

### 步骤 4：打包 JAR 文件
```bash
mvn package -P <module_name> -DskipTests
```

### 步骤 5：检查构建产物
- 验证 JAR 文件是否生成
- 显示文件大小
- 显示 JAR 内容摘要

### 步骤 6：复制依赖到 WebContent/WEB-INF/lib
```bash
mvn dependency:copy-dependencies -P <module_name>
```

---

## 📦 打包产物

打包完成后，会生成以下文件：

```
Rhadamanthus/
├── target/
│   ├── classes/              # 编译后的 .class 文件
│   └── rhadamanthus-1.0.0.jar  # 打包的 JAR 文件
└── WebContent/
    └── WEB-INF/
        └── lib/             # 所有依赖库（自动复制）
            ├── spring-*.jar
            ├── struts2-*.jar
            ├── hibernate-*.jar
            └── ... (50+ 个 JAR)
```

---

## 🚀 部署到 Tomcat

### 方式 1：直接复制 JAR（推荐用于开发/测试）

```bash
# 复制 JAR 到 Tomcat
cp target/rhadamanthus-1.0.0.jar <TOMCAT_HOME>/webapps/Rhadamanthus/WEB-INF/lib/

# 复制依赖到 Tomcat
cp WebContent/WEB-INF/lib/*.jar <TOMCAT_HOME>/webapps/Rhadamanthus/WEB-INF/lib/

# 重启 Tomcat
<TOMCAT_HOME>/bin/shutdown.sh
<TOMCAT_HOME>/bin/startup.sh

# 查看日志
tail -f <TOMCAT_HOME>/logs/catalina.out
```

### 方式 2：打包 WAR（推荐用于生产）

```bash
# 1. 打包完整项目
mvn clean package

# 2. 打包 WAR
cd WebContent
jar cvf ../Rhadamanthus.war *

# 3. 部署 WAR 到 Tomcat
cp Rhadamanthus.war <TOMCAT_HOME>/webapps/

# 4. Tomcat 会自动解压并部署
```

---

## 🐛 常见问题

### Q1: 提示 "Maven 未安装"

**错误信息：**
```
❌ 错误：Maven 未安装
```

**解决方案：**
1. 下载 Maven：https://maven.apache.org/download.cgi
2. 解压并配置环境变量
3. 验证安装：`mvn -version`

### Q2: 提示 "Java 未安装"

**错误信息：**
```
❌ 错误：Java 未安装
```

**解决方案：**
1. 下载 JDK 1.8：https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html
2. 安装并配置环境变量
3. 验证安装：`java -version`

### Q3: 编译失败，提示找不到 JAR 包

**错误信息：**
```
[ERROR] COMPILATION ERROR
[ERROR] 某个类找不到符号
```

**解决方案：**
1. 检查 `project-libs/` 目录下是否有缺失的 JAR 包
2. 运行 `mvn dependency:resolve` 下载缺失的依赖
3. 确认 `.classpath` 中的 JAR 路径是否正确

### Q4: Profile 不生效

**错误信息：**
```
[WARNING] No profiles detected!
```

**解决方案：**
1. 确认 pom.xml 中有 `<profiles>` 标签
2. 确认 Profile ID 拼写正确
3. 运行 `mvn help:active-profiles` 查看激活的 Profile

### Q5: 打包的 JAR 文件太大

**问题：** JAR 文件包含不需要的类。

**解决方案：**
使用 Profile 打包指定模块，而不是打包完整项目：
```bash
# 不要这样（打包所有模块）
mvn clean package

# 而是这样（只打包需要的模块）
./build-module.sh decoration
```

---

## 💡 使用场景

### 场景 1：只修改了 decoration 模块

```bash
# 只打包 decoration 模块
./build-module.sh decoration

# 部署到 Tomcat
cp target/rhadamanthus-1.0.0.jar <TOMCAT_HOME>/webapps/Rhadamanthus/WEB-INF/lib/

# 重启 Tomcat
<TOMCAT_HOME>/bin/shutdown.sh && <TOMCAT_HOME>/bin/startup.sh
```

### 场景 2：批量打包多个模块

```bash
# 打包 inventory 模块
./build-module.sh inventory

# 打包 quotation 模块
./build-module.sh quotation

# 打包 seiya 模块
./build-module.sh seiya
```

### 场景 3：发布新版本

```bash
# 打包所有业务模块
./build-module.sh business-modules

# 打包 WAR
cd WebContent && jar cvf ../Rhadamanthus.war *

# 部署到生产环境
scp Rhadamanthus.war user@prod-server:<TOMCAT_HOME>/webapps/
```

---

## 📚 更多文档

- **Maven 快速开始：** `docs/build/MAVEN_QUICK_START.md`
- **按模块打包配置：** `docs/build/MODULE_PACKAGING_GUIDE.md`
- **快速使用指南：** `docs/build/QUICK_START_MODULE_PACKAGING.md`

---

## 🤝 贡献

如果遇到问题或有改进建议，欢迎提交 Issue 或 Pull Request。

---

**最后更新：** 2026-03-26
**维护者：** AI 辅助生成
