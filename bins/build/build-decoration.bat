@echo off
chcp 65001 >nul
REM ========================================
REM 编译并打包 decoration 模块
REM ========================================

setlocal enabledelayedexpansion

REM 设置项目路径
set PROJECT_DIR=%~dp0
set SRC_DIR=%PROJECT_DIR%src
set BUILD_DIR=%PROJECT_DIR%build
set CLASSES_DIR=%BUILD_DIR%\classes
set LIB_DIR=%PROJECT_DIR%WebContent\WEB-INF\lib
set JAR_OUTPUT=%BUILD_DIR%\decoration-module.jar

echo ========================================
echo 开始构建 decoration 模块
echo ========================================
echo.

REM 检查 Java 环境
echo [1/5] 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 Java 环境，请确保 JDK 已安装并配置到 PATH
    pause
    exit /b 1
)
javac -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 javac 编译器，请确保安装的是 JDK 而非 JRE
    pause
    exit /b 1
)
echo Java 环境检查通过
echo.

REM 创建构建目录
echo [2/5] 创建构建目录...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
mkdir "%CLASSES_DIR%"
echo 构建目录创建完成
echo.

REM 收集所有 JAR 依赖
echo [3/5] 收集依赖库...
set CLASSPATH=%CLASSES_DIR%

if exist "%LIB_DIR%" (
    for %%f in ("%LIB_DIR%\*.jar") do (
        set CLASSPATH=!CLASSPATH!;%%f
    )
    echo 已添加 WEB-INF/lib 目录下的 JAR 文件
) else (
    echo 警告: 未找到 %LIB_DIR% 目录
)
echo.

REM 生成源文件列表
echo [4/5] 编译源代码...
echo 正在扫描源文件...

REM 创建临时文件列表
set SOURCE_LIST=%BUILD_DIR%\sources.txt
if exist "%SOURCE_LIST%" del "%SOURCE_LIST%"

REM 收集需要编译的模块源文件
echo 收集 decoration 模块及其依赖...
for /r "%SRC_DIR%\com\fanglin\core" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\utils" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\communion" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\personel" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\customer" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\building" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\quotation" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\data" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\system" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\approval" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\balance" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\payment" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\right" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\sales" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\construction" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\material" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"
for /r "%SRC_DIR%\com\fanglin\decoration" %%f in (*.java) do echo %%f >> "%SOURCE_LIST%"

echo 开始编译（这可能需要几分钟）...
javac -encoding UTF-8 -d "%CLASSES_DIR%" -cp "%CLASSPATH%" -Xlint:-unchecked -Xlint:-deprecation @"%SOURCE_LIST%" 2>"%BUILD_DIR%\compile-errors.log"

if errorlevel 1 (
    echo.
    echo ❌ 编译失败！
    echo 错误日志已保存到: %BUILD_DIR%\compile-errors.log
    echo.
    type "%BUILD_DIR%\compile-errors.log"
    echo.
    pause
    exit /b 1
)

echo ✓ 编译成功
echo.

REM 打包 JAR 文件（只包含 decoration 模块）
echo [5/5] 打包 JAR 文件...
cd /d "%CLASSES_DIR%"
jar cvf "%JAR_OUTPUT%" com\fanglin\decoration\ >nul 2>&1

if errorlevel 1 (
    echo 错误: JAR 打包失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ 构建成功！
echo ========================================
echo JAR 文件位置: %JAR_OUTPUT%
echo.

REM 显示文件信息
for %%f in ("%JAR_OUTPUT%") do (
    echo 文件大小: %%~zf 字节
)

REM 列出 JAR 内容
echo.
echo JAR 包内容概览:
jar tf "%JAR_OUTPUT%" | find "com/fanglin/decoration" | find /c "class" >"%BUILD_DIR%\class-count.tmp"
set /p CLASS_COUNT=<"%BUILD_DIR%\class-count.tmp"
echo - 包含 %CLASS_COUNT% 个 .class 文件
del "%BUILD_DIR%\class-count.tmp"

echo.
echo 主要包含的子模块:
jar tf "%JAR_OUTPUT%" | find ".class" | find /v "$" >"%BUILD_DIR%\classes-list.tmp"
for /f "tokens=1,2,3,4,5 delims=/" %%a in (%BUILD_DIR%\classes-list.tmp) do (
    if "%%e" neq "" echo   - %%d
)
del "%BUILD_DIR%\classes-list.tmp"

echo.
echo 🎉 decoration 模块 JAR 包已成功创建！
echo.
pause
endlocal
