# Maven 按模块打包配置指南

> 创建时间：2026-03-26
> 适用于：Rhadamanthus ERP 系统

---

## 📋 项目模块概览

当前项目共有 **41 个模块**，主要业务模块包括：

### 核心业务模块
- **inventory** - 库存管理
- **quotation** - 报价管理
- **construction** - 施工管理
- **sales** - 销售管理
- **decoration** - 装修管理
- **seiya** - 星野系统

### 基础支撑模块
- **common** - 公共模块
- **core** - 核心模块
- **finance** - 财务模块
- **dingding** - 钉钉集成
- **fadada** - 法大大集成
- **aliyun** - 阿里云集成

---

## 🎯 按模块打包方案

### 方案一：使用 Maven Profile（推荐）

**优势：**
- 配置灵活，可以切换不同模块组合
- 不修改主 pom.xml
- 支持预定义的模块组合

#### 配置步骤

**1. 在 pom.xml 中添加 Profiles**

在 `<profiles>` 标签内添加以下配置：

```xml
<profiles>
    <!-- 单独打包库存模块 -->
    <profile>
        <id>inventory</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>com/fanglin/inventory/**</include>
                            <include>com/fanglin/common/**</include>
                            <include>com/fanglin/core/**</include>
                        </includes>
                        <excludes>
                            <exclude>com/fanglin/**/test/**</exclude>
                        </excludes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- 单独打包报价模块 -->
    <profile>
        <id>quotation</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>com/fanglin/quotation/**</include>
                            <include>com/fanglin/common/**</include>
                            <include>com/fanglin/core/**</include>
                        </includes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- 单独打包星野模块 -->
    <profile>
        <id>seiya</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>com/fanglin/seiya/**</include>
                            <include>com/fanglin/common/**</include>
                            <include>com/fanglin/core/**</include>
                        </includes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- 打包多个业务模块 -->
    <profile>
        <id>business-modules</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>com/fanglin/inventory/**</include>
                            <include>com/fanglin/quotation/**</include>
                            <include>com/fanglin/construction/**</include>
                            <include>com/fanglin/sales/**</include>
                            <include>com/fanglin/decoration/**</include>
                            <include>com/fanglin/common/**</include>
                            <include>com/fanglin/core/**</include>
                            <include>com/fanglin/finance/**</include>
                        </includes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

**2. 使用 Profile 打包**

```bash
# 只打包库存模块
mvn clean package -P inventory

# 只打包报价模块
mvn clean package -P quotation

# 只打包星野模块
mvn clean package -P seiya

# 打包所有业务模块
mvn clean package -P business-modules

# 打包完整项目（默认）
mvn clean package
```

---

### 方案二：使用 Maven War Plugin 子模块打包

**优势：**
- 每个模块生成独立的 WAR 包
- 支持独立部署
- 适合微服务化迁移

#### 配置步骤

**1. 修改 pom.xml 打包方式**

```xml
<packaging>pom</packaging>  <!-- 改为 POM -->
```

**2. 创建子模块 POM**

为每个主要模块创建独立的子模块：

```
Rhadamanthus/
├── pom.xml                 # 父 POM
├── rhadamanthus-inventory/ # 库存模块
│   └── pom.xml
├── rhadamanthus-quotation/ # 报价模块
│   └── pom.xml
├── rhadamanthus-seiya/     # 星野模块
│   └── pom.xml
└── rhadamanthus-web/       # Web 层
    └── pom.xml
```

**子模块 pom.xml 示例（inventory）：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.fanglin</groupId>
        <artifactId>rhadamanthus</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>rhadamanthus-inventory</artifactId>
    <packaging>jar</packaging>

    <name>Rhadamanthus Inventory Module</name>

    <build>
        <sourceDirectory>../src</sourceDirectory>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <includes>
                        <include>com/fanglin/inventory/**</include>
                        <include>com/fanglin/common/**</include>
                        <include>com/fanglin/core/**</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

**3. 打包子模块**

```bash
# 只打包库存模块
cd rhadamanthus-inventory
mvn clean package

# 只打包报价模块
cd ../rhadamanthus-quotation
mvn clean package

# 只打包星野模块
cd ../rhadamanthus-seiya
mvn clean package
```

---

### 方案三：使用 Maven Assembly Plugin 打包自定义 JAR

**优势：**
- 灵活控制打包内容
- 可以包含/排除特定文件
- 支持自定义输出格式

#### 配置步骤

**1. 在 pom.xml 中添加 Assembly Plugin**

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
        <includes>
            <!-- 只包含特定模块 -->
            <include>com/fanglin/inventory/**</include>
            <include>com/fanglin/common/**</include>
            <include>com/fanglin/core/**</include>
        </includes>
    </configuration>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**2. 打包**

```bash
mvn clean package
```

---

## 📦 模块依赖关系

### 核心依赖链

```
业务模块（inventory/quotation/seiya等）
    ↓ 依赖
common（公共模块）
    ↓ 依赖
core（核心模块）
    ↓ 依赖
第三方库（Spring/Struts2/Hibernate等）
```

### 打包建议

**打包单个业务模块时，需要同时打包：**
1. 业务模块本身（如 inventory）
2. common 模块（公共模块）
3. core 模块（核心模块）

**示例：**
```xml
<includes>
    <include>com/fanglin/inventory/**</include>
    <include>com/fanglin/common/**</include>
    <include>com/fanglin/core/**</include>
</includes>
```

---

## 🚀 快速命令参考

### 按模块编译

```bash
# 只编译库存模块
mvn compile -P inventory

# 只编译报价模块
mvn compile -P quotation

# 只编译星野模块
mvn compile -P seiya

# 编译所有业务模块
mvn compile -P business-modules
```

### 按模块打包

```bash
# 只打包库存模块
mvn clean package -P inventory

# 只打包报价模块
mvn clean package -P quotation

# 只打包星野模块
mvn clean package -P seiya

# 打包所有业务模块
mvn clean package -P business-modules
```

### 查看模块依赖

```bash
# 查看完整依赖树
mvn dependency:tree

# 只查看某个模块的依赖
mvn dependency:tree -Dincludes=com.fanglin:inventory
```

---

## ⚠️ 注意事项

### 1. 模块间依赖

- 打包业务模块时，必须包含 common 和 core
- common 和 core 可能相互依赖，建议一起打包

### 2. 配置文件

- 配置文件在 `conf/` 目录
- 需要确保打包时包含正确的配置

### 3. 第三方 JAR 包

- 银盛支付、法大大等专有 JAR 使用 `systemPath` 加载
- 需要确保 `project-libs/` 目录下有这些 JAR 文件

### 4. 测试代码

- 默认不打包测试代码（`src/test/`）
- 如需包含，修改配置

---

## 💡 最佳实践

### 1. 使用 Profile 管理模块组合

定义多个 Profile，对应不同的打包场景：

```xml
<profiles>
    <profile>
        <id>dev</id>
        <activation><activeByDefault>true</activeByDefault></activation>
    </profile>

    <profile>
        <id>test</id>
        <properties>
            <env>test</env>
        </properties>
    </profile>

    <profile>
        <id>production</id>
        <properties>
            <env>production</env>
        </properties>
    </profile>
</profiles>
```

### 2. 使用属性统一管理版本

```xml
<properties>
    <module.inventory.version>1.0.0</module.inventory.version>
    <module.quotation.version>1.0.0</module.quotation.version>
</properties>
```

### 3. 使用 Maven Wrapper 确保构建一致性

项目根目录添加：
```
mvnw
mvnw.cmd
.mvn/wrapper/maven-wrapper.jar
.mvn/wrapper/maven-wrapper.properties
```

---

## 📚 参考资料

- [Maven Profiles](https://maven.apache.org/guides/introduction/introduction-to-profiles.html)
- [Maven Assembly Plugin](https://maven.apache.org/plugins/maven-assembly-plugin/)
- [Maven Multi-Module Project](https://maven.apache.org/guides/mini/guide-multiple-modules/)

---

**最后更新：** 2026-03-26
**维护者：** AI 辅助生成
