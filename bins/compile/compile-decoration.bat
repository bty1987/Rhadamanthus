@echo off
REM Windows 版本 decoration 模块编译脚本
setlocal enabledelayedexpansion

echo 🚀 开始编译 decoration 模块...
echo.

REM 设置变量
set PROJECT_DIR=%~dp0
set BUILD_DIR=%PROJECT_DIR%build
set CLASSES_DIR=%BUILD_DIR%\classes
set JAR_OUTPUT=%BUILD_DIR%\decoration-module.jar

echo ========================================
echo 第1步: 检查环境
echo ========================================
echo.

REM 检查 Java 环境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Java 环境
    pause
    exit /b 1
)

echo ✅ Java 版本:
java -version 2>&1 | head -1
echo.

REM 清理并创建目录
echo 第2步: 准备构建目录
if exist "%BUILD_DIR%" rd /s /q "%BUILD_DIR%"
mkdir "%CLASSES_DIR%"

REM 设置 CLASSPATH
echo 第3步: 配置依赖路径
set CLASSPATH=%CLASSES_DIR%
for %%j in ("%PROJECT_DIR%project-libs\*.jar") do (
    set CLASSPATH=!CLASSPATH!;%%j
)
for %%j in ("%PROJECT_DIR%build\lib\*.jar") do (
    set CLASSPATH=!CLASSPATH!;%%j
)

echo CLASSPATH 配置完成
echo.

REM 收集 decoration 模块源文件
echo 第4步: 准备 decoration 源文件
if not exist "%PROJECT_DIR%src\com\fanglin\decoration" (
    echo ❌ 错误: decoration 模块目录不存在
    pause
    exit /b 1
)

REM 临时文件使用 Windows 路径
set SOURCES_LIST=%BUILD_DIR%\decoration-sources.txt

REM 收集所有 Java 文件
echo 收集 decoration 模块源文件...
dir /s /b "%PROJECT_DIR%src\com\fanglin\decoration\*.java" > "%SOURCES_LIST%"

REM 计算文件数量
set SOURCE_COUNT=0
for /f %%i in ('type "%SOURCES_LIST%" ^| find /c /v ""') do set SOURCE_COUNT=%%i

echo 找到 %SOURCE_COUNT% 个 decoration 源文件
echo.

if %SOURCE_COUNT% equ 0 (
    echo 错误: 未找到 decoration 模块源文件
    pause
    exit /b 1
)

REM 编译 decoration 模块
echo 第5步: 编译 decoration 模块...
echo 编译中...

REM 使用 javac 编译
javac -encoding UTF-8 -d "%CLASSES_DIR%" -cp "%CLASSPATH%" @"%SOURCES_LIST%" >"%BUILD_DIR%\compile.log" 2>&1

if %errorlevel% equ 0 (
    echo ✅ decoration 模块编译成功！
) else (
    echo ❌ 编译失败，查看编译日志:
    echo ----------------------------------------
    type "%BUILD_DIR%\compile.log"
    echo ----------------------------------------
    pause
    exit /b 1
)

REM 检查编译结果
echo 第6步: 检查编译结果...
set CLASS_COUNT=0
for /r "%CLASSES_DIR%" %%f in (*.class) do (
    set /a CLASS_COUNT+=1
)

echo 生成了 %CLASS_COUNT% 个 class 文件
echo.

REM 打包 JAR
echo 第7步: 打包 JAR 文件...
cd /d "%CLASSES_DIR%"

REM 确保目录结构正确
if not exist "com\fanglin\decoration" mkdir "com\fanglin\decoration"

REM 移动编译后的 class 文件到正确位置
echo 整理 class 文件...
for /r . %%f in (*.class) do (
    set "filepath=%%f"
    set "relpath=!filepath:%CD%=!"
    set "relpath=!relpath:\=/!"
    echo 移动: !relpath!
)

REM 打包
jar cvf "%JAR_OUTPUT%" com\fanglin\ >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ JAR 打包成功: %JAR_OUTPUT%
) else (
    echo ❌ JAR 打包失败
    cd /d "%PROJECT_DIR%"
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

REM 显示结果
echo.
echo ========================================
echo 编译结果
echo ========================================

if exist "%JAR_OUTPUT%" (
    echo ✅ JAR 文件: %JAR_OUTPUT%

    REM 显示文件大小
    for %%I in ("%JAR_OUTPUT%") do (
        set size=%%~zI
        echo 文件大小: !size! 字节
    )

    REM 统计 class 文件数量
    set JAR_CLASS_COUNT=0
    for /f %%i in ('jar tf "%JAR_OUTPUT%" ^| find "\.class$" ^| find /c /v ""') do set JAR_CLASS_COUNT=%%i
    echo 包含 %JAR_CLASS_COUNT% 个 .class 文件
    echo.

    echo 🎉 decoration-module.jar 已成功创建！
    echo 输出位置: %JAR_OUTPUT%

    REM 显示主要内容
    echo.
    echo 主要包含的类:
    jar tf "%JAR_OUTPUT%" 2>nul | find "\.class$" | head -10

) else (
    echo ❌ JAR 文件不存在
)

echo.
echo 编译日志位置: %BUILD_DIR%\compile.log
echo 源文件列表: %SOURCES_LIST%
echo.
echo ========================================
echo 完成！
pause