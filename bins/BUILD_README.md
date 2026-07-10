# Rhadamanthus 构建说明（纯本地 jar，无需 Maven）

本项目支持**完全脱离 Maven** 的构建方式：用本地 jar + `javac`/`jar` 直接编译打包。
Eclipse 编译不受任何影响（共用 `WebContent/WEB-INF/lib` 和 `target/classes`）。

---

## 一、首次准备：归集依赖 jar

依赖 jar 来自独立的 `Athena` 仓库（与本项目同级目录）。

```bash
# 1. clone 依赖仓库到项目上级目录
cd /d/ERP
git clone https://codeup.aliyun.com/5f348f095fd102f22f6ba565/fanglinserver/Athena.git

# 2. 归集 jar 到 WebContent/WEB-INF/lib（展平所有子目录）
cd /d/ERP/Rhadamanthus
bins\lib\gather-libs.bat
```

执行后 `WebContent/WEB-INF/lib/` 会包含所有第三方 jar（约 100 个），
`project-libs/` 里的 4 个私有 jar 也会被一并复制进去。

> jar 路径可用环境变量覆盖：`set ATHENA_DIR=D:\other\path && bins\lib\gather-libs.bat`

---

## 二、打单个模块 jar（常用，热替换部署）

```cmd
bins\build\build-module.bat ^<模块名^> ^<版本号^>
```

示例：

```cmd
bins\build\build-module.bat decoration 8.3.027.010
bins\build\build-module.bat quotation   8.3.028.001
bins\build\build-module.bat sales       8.3.027.010
```

产物：`target/fanglin-<模块名>-<版本号>.jar`

- 只含该模块（`com.fanglin.<模块名>`）的 class，不含 core/utils 等公共包
- 首次运行会先全量编译（生成 `target/classes`，供跨模块依赖解析），之后只编译目标模块
- 部署：把 jar 拷到 Tomcat 的 `webapps/<应用>/WEB-INF/lib/`，重启 Tomcat

模块名就是 `src/com/fanglin/` 下的目录名（decoration、quotation、sales、construction 等）。

---

## 三、全量编译 + 打 WAR

```cmd
bins\build\build-all.bat
```

产物：
- `target/classes/` —— 编译输出（.class + 配置文件）
- `target/rhadamanthus.war` —— 可直接部署到 Tomcat 的 war 包

部署：把 war 拷到 Tomcat `webapps/` 目录，或解压后部署。

---

## 四、目录约定

| 目录 | 作用 |
|-----|------|
| `WebContent/WEB-INF/lib/` | **唯一**的第三方 jar 仓库（编译/运行/打包/Tomcat 共用） |
| `project-libs/` | 4 个私有 jar（法大大/银联/lippi/sun.misc），会被归集脚本合并进 lib |
| `conf/` | 配置资源（ApplicationContext.xml 等），编译时复制到 classes |
| `target/classes/` | 全量编译输出（跨模块依赖解析用，Eclipse 和脚本共用） |
| `target/fanglin-<模块>-<版本>.jar` | 模块 jar 产物 |
| `target/rhadamanthus.war` | 全量 war 产物 |

---

## 五、环境要求

- **JDK 1.8**（必须，脚本自动探测 `JAVA_HOME` 和 `D:\Program Files\Java\jdk1.8.0_*`）
  - 项目用到了 `sun.misc.*` 等 JDK 1.8 内部 API，JDK 9+ 无法编译
  - 如果 JAVA_HOME 指向其它 JDK，请临时指定：`set JAVA_HOME=D:\Program Files\Java\jdk1.8.0_491`
- 不需要 Maven、不需要联网（jar 归集后完全离线构建）

---

## 六、与 Eclipse 的关系

- Eclipse 用 `Web App Libraries` 容器自动读取 `WEB-INF/lib/*.jar`，jar 一旦归集，Eclipse 自动识别。
- 编译输出目录都是 `target/classes`，Eclipse 和脚本互不干扰。
- 不依赖 m2e 插件。

---

## 七、故障排查

| 现象 | 原因 / 解决 |
|-----|------|
| `JDK 1.8 not found` | 设置 `JAVA_HOME` 指向 JDK 1.8，或确认装在默认路径 |
| `未找到 Athena 仓库` | 先 clone Athena.git 到上级目录，或用 `ATHENA_DIR` 指定路径 |
| 编译报 `程序包 xxx 不存在` | jar 未归集，先跑 `gather-libs.bat` |
| 编译报 `sun.misc.BASE64Decoder 找不到符号` | 用错了 JDK 版本，必须 JDK 1.8 |
| 编译报编码错误 | 源文件含 BOM，跑 `bins\tools\remove-bom.ps1` |
