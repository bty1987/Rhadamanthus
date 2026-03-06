@echo off
setlocal enabledelayedexpansion

echo 🚀 开始简化编译 decoration 模块...
echo.

REM 设置变量
set PROJECT_DIR=%~dp0
set BUILD_DIR=%PROJECT_DIR%build
set CLASSES_DIR=%BUILD_DIR%\classes
set JAR_OUTPUT=%BUILD_DIR%\decoration-module.jar
set SOURCES_LIST=%BUILD_DIR%\sources.txt

REM 清理并创建目录
if exist "%BUILD_DIR%" rd /s /q "%BUILD_DIR%"
mkdir "%CLASSES_DIR%"

REM 设置 CLASSPATH
set CLASSPATH=%CLASSES_DIR%
for %%j in ("%PROJECT_DIR%project-libs\*.jar") do (
    set CLASSPATH=!CLASSPATH!;%%j
)
for %%j in ("%PROJECT_DIR%WebContent\WEB-INF\lib\*.jar") do (
    if exist "%%j" (
        set CLASSPATH=!CLASSPATH!;%%j
    )
)

echo CLASSPATH 配置完成
echo.

REM 收集 decoration 模块 Java 文件（排除测试文件）
echo 收集 decoration 模块源文件...
set count=0
for /r "%PROJECT_DIR%src\com\fanglin\decoration" %%f in (*.java) do (
    echo %%f >> "%SOURCES_LIST%"
    set /a count+=1
)

echo 找到 %count% 个 decoration 源文件
echo.

if %count% equ 0 (
    echo 错误: 未找到 decoration 模块源文件
    pause
    exit /b 1
)

REM 编译 decoration 模块
echo 编译 decoration 模块...
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
echo 检查编译结果...
set CLASS_COUNT=0
for /r "%CLASSES_DIR%" %%f in (*.class) do (
    set /a CLASS_COUNT+=1
)

echo 生成了 %CLASS_COUNT% 个 class 文件
if %CLASS_COUNT% equ 0 (
    echo ❌ 没有生成任何 class 文件
    pause
    exit /b 1
)

REM 打包 JAR
echo 打包 JAR 文件...
cd /d "%CLASSES_DIR%"

REM 创建 JAR 包
jar cf "%JAR_OUTPUT%" . >nul 2>&1

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
        echo 文件大小: %%~zI 字节
    )

    REM 统计 JAR 中的 class 文件数量
    set JAR_CLASS_COUNT=0
    for /f %%i in ('jar tf "%JAR_OUTPUT%" ^| find "\.class$" ^| find /c /v ""') do set JAR_CLASS_COUNT=%%i
    echo 包含 %JAR_CLASS_COUNT% 个 .class 文件

    REM 显示主要内容
    echo.
    echo 主要包含的类:
    jar tf "%JAR_OUTPUT%" 2>nul | find "\.class$" | head -10

    echo.
    echo 🎉 decoration-module.jar 已成功创建！
    echo 输出位置: %JAR_OUTPUT%

) else (
    echo ❌ JAR 文件不存在
)

echo.
echo 编译日志: %BUILD_DIR%\compile.log
echo ========================================
pause