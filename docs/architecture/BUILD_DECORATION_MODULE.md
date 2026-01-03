# Decoration 模块 JAR 打包说明

> 创建时间：2025-12-05
> 状态：⚠️ **需要配置依赖库**

---

## 当前问题

执行 `build-decoration.bat` 脚本时发现以下问题：

### 1. ❌ 缺少依赖库

**问题描述**：
- `WebContent/WEB-INF/lib/` 目录中只有 `readme.txt`，没有实际的 JAR 依赖
- `.classpath` 文件引用的外部路径 `E:/Ali/Athena/98.Jars/Other/` 不存在
- 项目中未找到任何 `.jar` 文件

**必需的依赖库**（根据 `.classpath` 分析）：
```
- Struts 2.5.16
- Spring 4.3.17
- Hibernate 3.x
- MySQL Connector
- C3P0 连接池
- Servlet API
- Jackson JSON
- Apache Commons (IO, FileUpload, Lang, etc.)
- Log4j
- 其他第三方库...
```

### 2. ✅ Java 环境正常

```
Java Version: 17.0.17
Javac Version: 17.0.17
```

**注意**：项目要求 JDK 1.7+，当前 JDK 17 向后兼容，可以使用。

### 3. ❌ 无编译输出

- 项目中未找到 `.class` 文件
- `build/` 目录不存在

---

## 解决方案

### 方案 1：复制依赖库到项目（推荐）

#### Step 1: 准备依赖库

从以下位置获取依赖库 JAR 文件：

1. **从开发环境复制**：
   - Eclipse 工作空间库：`<ECLIPSE_HOME>/plugins/`
   - Tomcat 库：`<TOMCAT_HOME>/lib/`

2. **或从 Maven 中央仓库下载**：
   ```xml
   <!-- 核心依赖示例 -->
   <dependencies>
       <dependency>
           <groupId>org.apache.struts</groupId>
           <artifactId>struts2-core</artifactId>
           <version>2.5.16</version>
       </dependency>
       <dependency>
           <groupId>org.springframework</groupId>
           <artifactId>spring-context</artifactId>
           <version>4.3.17.RELEASE</version>
       </dependency>
       <dependency>
           <groupId>org.hibernate</groupId>
           <artifactId>hibernate-core</artifactId>
           <version>3.6.10.Final</version>
       </dependency>
       <!-- 更多依赖... -->
   </dependencies>
   ```

#### Step 2: 复制到项目

将所有 JAR 文件复制到：
```
D:\ERP\Rhadamanthus\WebContent\WEB-INF\lib\
```

#### Step 3: 执行构建脚本

```cmd
cd D:\ERP\Rhadamanthus
build-decoration.bat
```

---

### 方案 2：使用 Maven 管理依赖

#### Step 1: 创建 `pom.xml`

在项目根目录创建 Maven 配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.fanglin</groupId>
    <artifactId>rhadamanthus</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Rhadamanthus ERP</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>
        <struts.version>2.5.16</struts.version>
        <spring.version>4.3.17.RELEASE</spring.version>
        <hibernate.version>3.6.10.Final</hibernate.version>
    </properties>

    <dependencies>
        <!-- Struts2 -->
        <dependency>
            <groupId>org.apache.struts</groupId>
            <artifactId>struts2-core</artifactId>
            <version>${struts.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.struts</groupId>
            <artifactId>struts2-spring-plugin</artifactId>
            <version>${struts.version}</version>
        </dependency>

        <!-- Spring -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-orm</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!-- Hibernate -->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>${hibernate.version}</version>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

        <!-- C3P0 -->
        <dependency>
            <groupId>com.mchange</groupId>
            <artifactId>c3p0</artifactId>
            <version>0.9.5.2</version>
        </dependency>

        <!-- Servlet API -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>

        <!-- Jackson -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.9.10</version>
        </dependency>

        <!-- Apache Commons -->
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.6</version>
        </dependency>
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.3.3</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.8.1</version>
        </dependency>

        <!-- Log4j -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src</sourceDirectory>
        <resources>
            <resource>
                <directory>conf</directory>
            </resource>
        </resources>

        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.7</source>
                    <target>1.7</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <includes>
                        <include>com/fanglin/decoration/**</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

#### Step 2: 构建项目

```cmd
cd D:\ERP\Rhadamanthus

# 下载依赖
mvn clean install

# 打包 decoration 模块
mvn package
```

生成的 JAR 文件位置：
```
target/rhadamanthus-1.0.0.jar
```

---

### 方案 3：从运行环境提取（如果有部署实例）

如果已经有运行中的 Tomcat 实例：

#### Step 1: 定位 Tomcat 部署目录

```
<TOMCAT_HOME>/webapps/Rhadamanthus/WEB-INF/lib/
```

#### Step 2: 复制依赖库

```cmd
xcopy "<TOMCAT_HOME>\webapps\Rhadamanthus\WEB-INF\lib\*" "D:\ERP\Rhadamanthus\WebContent\WEB-INF\lib\" /E /Y
```

#### Step 3: 复制编译好的 class 文件

```cmd
xcopy "<TOMCAT_HOME>\webapps\Rhadamanthus\WEB-INF\classes\com\fanglin\decoration" "D:\ERP\Rhadamanthus\build\classes\com\fanglin\decoration" /E /Y
```

#### Step 4: 直接打包

```cmd
cd D:\ERP\Rhadamanthus\build\classes
jar cvf ../../decoration-module.jar com\fanglin\decoration\
```

---

## 简化构建脚本（需要依赖库）

创建 `build-decoration-simple.bat`：

```batch
@echo off
chcp 65001 >nul

echo ========================================
echo 简化版 - 仅打包 decoration 模块
echo ========================================

set PROJECT_DIR=%~dp0
set BUILD_DIR=%PROJECT_DIR%build
set JAR_OUTPUT=%BUILD_DIR%\decoration-module.jar

REM 检查是否有编译好的 class 文件
if not exist "%BUILD_DIR%\classes\com\fanglin\decoration" (
    echo 错误: 未找到编译好的 class 文件
    echo 请先执行完整构建: build-decoration.bat
    pause
    exit /b 1
)

REM 打包
cd /d "%BUILD_DIR%\classes"
jar cvf "%JAR_OUTPUT%" com\fanglin\decoration\

if errorlevel 1 (
    echo 错误: 打包失败
    pause
    exit /b 1
)

echo.
echo ✓ 打包成功！
echo JAR 文件: %JAR_OUTPUT%
pause
```

---

## 依赖库清单（参考）

根据 `.classpath` 分析，项目需要以下依赖库：

| 库名 | 用途 | 版本 |
|------|------|------|
| `struts2-core-*.jar` | Struts2 核心 | 2.5.16 |
| `spring-*.jar` | Spring 框架 | 4.3.17 |
| `hibernate-*.jar` | Hibernate ORM | 3.x |
| `mysql-connector-java-*.jar` | MySQL 驱动 | 5.1.x |
| `c3p0-*.jar` | 数据库连接池 | 0.9.5 |
| `servlet-api-*.jar` | Servlet API | 3.1 |
| `jackson-*.jar` | JSON 处理 | 2.9+ |
| `commons-io-*.jar` | 文件操作 | 2.6 |
| `commons-fileupload-*.jar` | 文件上传 | 1.3 |
| `commons-lang3-*.jar` | 工具类 | 3.8 |
| `log4j-*.jar` | 日志框架 | 1.2.17 |
| `poi-*.jar` | Excel 操作 | 3.17+ |
| `pinyin4j-*.jar` | 拼音转换 | 2.5.1 |
| `ehcache-*.jar` | 缓存框架 | 2.10+ |
| `fastjson-*.jar` | JSON 处理 | 1.2.x |

---

## 后续步骤

### 1. 准备依赖库

- [ ] 确定依赖库来源（开发环境/Maven/部署实例）
- [ ] 复制 JAR 文件到 `WebContent/WEB-INF/lib/`
- [ ] 验证所有必需的 JAR 都已就位

### 2. 执行构建

- [ ] 运行 `build-decoration.bat`
- [ ] 检查编译错误日志
- [ ] 验证生成的 JAR 文件

### 3. 测试 JAR

- [ ] 部署到测试环境
- [ ] 验证 decoration 模块功能正常
- [ ] 进行集成测试

---

## 常见问题

### Q1: 编译时出现"找不到符号"错误？

**A**: 检查以下内容：
1. 所有依赖的 JAR 是否都在 `WEB-INF/lib/` 中
2. 其他模块（core、utils、communion 等）是否已编译
3. 源文件编码是否为 UTF-8

### Q2: 打包后的 JAR 文件过大？

**A**:
- 默认只打包 `com\fanglin\decoration\` 目录
- 如果需要减小体积，可以排除不必要的类：
  ```cmd
  jar cvf decoration.jar com\fanglin\decoration\*.class
  ```

### Q3: 如何验证 JAR 包内容？

**A**:
```cmd
jar tf build\decoration-module.jar
```

### Q4: 编译时内存不足？

**A**: 增加 Java 堆内存：
```batch
set JAVA_OPTS=-Xms512m -Xmx1024m
javac ...
```

---

## 联系方式

如需帮助，请参考：
- [项目文档](../CLAUDE.md)
- [前端架构文档](../WebContent/CLAUDE.md)
- [API 接口文档](./API.md)

---

**最后更新**: 2025-12-05
**状态**: ⚠️ 等待依赖库配置
