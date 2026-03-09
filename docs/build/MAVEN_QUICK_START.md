# Maven 构建快速开始指南

> 创建时间：2025-12-05
> 适用于：Decoration 模块 JAR 打包

---

## 📋 前置要求

### 1. 安装 Maven

#### Windows 安装步骤：

**下载 Maven**：
- 访问：https://maven.apache.org/download.cgi
- 下载：`apache-maven-3.x.x-bin.zip`（推荐 3.6.3 或更高版本）

**安装配置**：

```cmd
REM 1. 解压到任意目录
C:\Maven\apache-maven-3.6.3\

REM 2. 配置环境变量
MAVEN_HOME=C:\Maven\apache-maven-3.6.3
Path=%Path%;%MAVEN_HOME%\bin

REM 3. 验证安装
mvn -version
```

**预期输出**：
```
Apache Maven 3.6.3
Maven home: C:\Maven\apache-maven-3.6.3
Java version: 17.0.17, vendor: Oracle Corporation
```

### 2. 配置 Maven 镜像（可选，提升下载速度）

编辑 `C:\Maven\apache-maven-3.6.3\conf\settings.xml`，在 `<mirrors>` 标签内添加：

```xml
<mirrors>
    <!-- 阿里云镜像（推荐） -->
    <mirror>
        <id>aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Aliyun Maven Mirror</name>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

---

## 🚀 快速构建

### 一键构建（推荐）

```cmd
cd D:\ERP\Rhadamanthus
build-maven.bat
```

**构建流程**：
1. ✓ 检查 Maven 环境
2. ✓ 清理旧的构建
3. ✓ 下载依赖（首次运行约 5-10 分钟）
4. ✓ 编译源代码
5. ✓ 打包 JAR 文件
6. ✓ 复制依赖到 WEB-INF/lib

**构建产物**：
- `target/decoration-module.jar` - Decoration 模块 JAR 包
- `WebContent/WEB-INF/lib/*.jar` - 所有依赖库（50+ 个 JAR）

---

## 🔧 手动构建命令

### 完整构建流程

```cmd
cd D:\ERP\Rhadamanthus

# 1. 清理旧的构建
mvn clean

# 2. 下载依赖
mvn dependency:resolve

# 3. 编译源代码
mvn compile

# 4. 打包 JAR（包含复制依赖）
mvn package
```

### 常用命令

```cmd
# 仅下载依赖到本地仓库
mvn dependency:resolve

# 将依赖复制到 WEB-INF/lib
mvn dependency:copy-dependencies

# 查看依赖树
mvn dependency:tree

# 跳过测试打包
mvn package -DskipTests

# 强制更新依赖
mvn clean install -U

# 离线模式（使用本地仓库）
mvn package -o
```

---

## 📂 项目结构

Maven 构建后的目录结构：

```
D:\ERP\Rhadamanthus\
├── pom.xml                         ← Maven 配置文件
├── build-maven.bat                 ← 一键构建脚本
├── src/                            ← 源代码目录
│   └── com/fanglin/decoration/     ← Decoration 模块源码
├── conf/                           ← 配置文件目录
│   ├── ApplicationContext.xml
│   ├── struts.xml
│   └── jdbc.properties
├── target/                         ← Maven 构建输出目录
│   ├── classes/                    ← 编译后的 .class 文件
│   ├── decoration-module.jar       ← 打包的 JAR 文件
│   └── maven-status/               ← Maven 构建状态
├── WebContent/WEB-INF/lib/         ← 依赖库（Maven 自动复制）
│   ├── struts2-core-2.5.16.jar
│   ├── spring-context-4.3.17.RELEASE.jar
│   ├── hibernate-core-3.6.10.Final.jar
│   └── ... (50+ 依赖库)
└── .m2/                            ← Maven 本地仓库（用户目录）
    └── repository/                 ← 下载的依赖缓存
```

---

## 🎯 构建不同模块

### 修改 pom.xml 打包其他模块

编辑 `pom.xml` 中的 `<includes>` 标签：

```xml
<!-- 打包 decoration 模块 -->
<includes>
    <include>com/fanglin/decoration/**</include>
</includes>

<!-- 打包 sales 模块 -->
<includes>
    <include>com/fanglin/sales/**</include>
</includes>

<!-- 打包多个模块 -->
<includes>
    <include>com/fanglin/decoration/**</include>
    <include>com/fanglin/sales/**</include>
    <include>com/fanglin/construction/**</include>
</includes>

<!-- 打包所有模块 -->
<includes>
    <include>com/fanglin/**</include>
</includes>
```

修改后重新运行：
```cmd
mvn clean package
```

---

## ⚠️ 常见问题

### Q1: Maven 命令未找到

**错误信息**：
```
'mvn' 不是内部或外部命令，也不是可运行的程序或批处理文件。
```

**解决方案**：
1. 检查 Maven 是否安装
2. 验证环境变量配置：
   ```cmd
   echo %MAVEN_HOME%
   echo %Path%
   ```
3. 重启命令提示符

---

### Q2: 下载依赖失败

**错误信息**：
```
Could not resolve dependencies for project com.fanglin:rhadamanthus:jar:1.0.0
```

**解决方案**：

**方案 1：配置镜像（推荐）**
- 使用阿里云镜像（见上方配置说明）

**方案 2：检查网络**
```cmd
# 测试网络连接
ping repo.maven.apache.org
```

**方案 3：手动重试**
```cmd
mvn clean install -U
```

---

### Q3: 编译错误

**错误信息**：
```
[ERROR] COMPILATION ERROR
[ERROR] 某个类找不到符号
```

**解决方案**：

**检查依赖完整性**：
```cmd
mvn dependency:tree
```

**清理后重新编译**：
```cmd
mvn clean compile
```

**检查 Java 版本兼容性**：
```cmd
java -version  # 应该是 JDK 1.7+ 或 JDK 17（向后兼容）
```

---

### Q4: 内存不足

**错误信息**：
```
java.lang.OutOfMemoryError: Java heap space
```

**解决方案**：

增加 Maven 内存：

**临时设置（当前会话）**：
```cmd
set MAVEN_OPTS=-Xms512m -Xmx1024m
mvn clean package
```

**永久设置（环境变量）**：
```
新建系统变量：
名称: MAVEN_OPTS
值: -Xms512m -Xmx1024m -XX:PermSize=256m -XX:MaxPermSize=512m
```

---

### Q5: 依赖冲突

**错误信息**：
```
[WARNING] The POM for ... is missing
```

**解决方案**：

**查看依赖树找出冲突**：
```cmd
mvn dependency:tree -Dverbose
```

**排除冲突依赖**（在 pom.xml 中）：
```xml
<dependency>
    <groupId>org.apache.struts</groupId>
    <artifactId>struts2-core</artifactId>
    <version>2.5.16</version>
    <exclusions>
        <exclusion>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

---

### Q6: JAR 文件过大

**问题**：生成的 JAR 文件过大。

**解决方案**：

**方案 1：只打包需要的类**

编辑 `pom.xml`：
```xml
<includes>
    <include>com/fanglin/decoration/action/**</include>
    <include>com/fanglin/decoration/service/**</include>
    <!-- 排除不需要的包 -->
</includes>
```

**方案 2：使用瘦 JAR（不包含依赖）**

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <configuration>
        <includes>
            <include>com/fanglin/decoration/**</include>
        </includes>
        <excludes>
            <exclude>**/*.xml</exclude>
            <exclude>**/*.properties</exclude>
        </excludes>
    </configuration>
</plugin>
```

---

## 📊 依赖分析

### 查看所有依赖

```cmd
mvn dependency:list
```

### 查看依赖树

```cmd
mvn dependency:tree
```

**示例输出**：
```
com.fanglin:rhadamanthus:jar:1.0.0
├── org.apache.struts:struts2-core:jar:2.5.16
│   ├── org.apache.commons:commons-lang3:jar:3.6
│   └── ognl:ognl:jar:3.1.26
├── org.springframework:spring-context:jar:4.3.17.RELEASE
│   ├── org.springframework:spring-aop:jar:4.3.17.RELEASE
│   └── org.springframework:spring-beans:jar:4.3.17.RELEASE
└── org.hibernate:hibernate-core:jar:3.6.10.Final
    └── org.hibernate:hibernate-commons-annotations:jar:3.2.0.Final
```

### 查找特定依赖

```cmd
mvn dependency:tree | findstr "struts"
mvn dependency:tree | findstr "spring"
```

---

## 🔄 更新依赖版本

### 手动更新（推荐）

编辑 `pom.xml` 中的版本号：

```xml
<properties>
    <struts.version>2.5.22</struts.version>  <!-- 升级版本 -->
    <spring.version>4.3.25.RELEASE</spring.version>
</properties>
```

### 批量更新依赖

```cmd
# 查看可用更新
mvn versions:display-dependency-updates

# 自动更新到最新版本（谨慎使用）
mvn versions:use-latest-versions
```

---

## 🚢 部署建议

### 开发环境部署

```cmd
# 1. 构建项目
build-maven.bat

# 2. 复制到 Tomcat
xcopy WebContent\* <TOMCAT_HOME>\webapps\Rhadamanthus\ /E /Y

# 3. 启动 Tomcat
<TOMCAT_HOME>\bin\startup.bat
```

### 生产环境部署

```cmd
# 1. 构建发布版本
mvn clean package -P production

# 2. 打包整个 Web 应用（包含依赖）
cd WebContent
jar cvf ../Rhadamanthus.war *

# 3. 部署 WAR 到 Tomcat
copy Rhadamanthus.war <TOMCAT_HOME>\webapps\
```

---

## 📚 参考资料

### Maven 官方文档
- 官网：https://maven.apache.org/
- 入门指南：https://maven.apache.org/guides/getting-started/
- 仓库搜索：https://search.maven.org/

### 阿里云 Maven 镜像
- 文档：https://developer.aliyun.com/mirror/maven

### 依赖库官网
- Struts2：https://struts.apache.org/
- Spring：https://spring.io/
- Hibernate：https://hibernate.org/

---

## 💡 最佳实践

### 1. 使用依赖管理

在 `pom.xml` 中统一管理版本：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-framework-bom</artifactId>
            <version>4.3.17.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 2. 使用 Profile 区分环境

```xml
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <env>development</env>
        </properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <env>production</env>
        </properties>
    </profile>
</profiles>
```

激活 Profile：
```cmd
mvn clean package -P prod
```

### 3. 排除不需要的依赖

```xml
<dependency>
    <groupId>org.apache.struts</groupId>
    <artifactId>struts2-spring-plugin</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

---

## ✅ 检查清单

构建前检查：
- [ ] Maven 已安装并配置环境变量
- [ ] Java JDK 1.7+ 已安装
- [ ] 网络连接正常（首次构建需要下载依赖）
- [ ] 配置了 Maven 镜像（可选，提升速度）

构建完成后验证：
- [ ] `target/decoration-module.jar` 文件存在
- [ ] `WebContent/WEB-INF/lib/` 包含 50+ 个 JAR 依赖
- [ ] JAR 包大小合理（约 100KB - 1MB）
- [ ] 使用 `jar tf` 查看 JAR 内容正确

---

**最后更新**：2025-12-05
**版本**：1.0.0
**维护者**：AI 辅助生成
