@echo off
setlocal enabledelayedexpansion

echo 🚀 开始完整编译项目...
echo.

REM 设置变量
set PROJECT_DIR=%~dp0
set BUILD_DIR=%PROJECT_DIR%build
set CLASSES_DIR=%BUILD_DIR%\classes
set JAR_OUTPUT=%BUILD_DIR%\decoration-module.jar
set ALL_SOURCES=%BUILD_DIR%\all-sources.txt

REM 清理并创建目录
if exist "%BUILD_DIR%" rd /s /q "%BUILD_DIR%"
mkdir "%CLASSES_DIR%"

REM 设置 CLASSPATH
echo 配置 CLASSPATH...
set CLASSPATH=%CLASSES_DIR%

REM 添加项目 JAR 包
for %%j in ("%PROJECT_DIR%project-libs\*.jar") do (
    if exist "%%j" (
        echo 添加依赖: %%j
        set CLASSPATH=!CLASSPATH!;%%j
    )
)

REM 添加 WEB-INF/lib 下的 JAR 包
for %%j in ("%PROJECT_DIR%WebContent\WEB-INF\lib\*.jar") do (
    if exist "%%j" (
        echo 添加依赖: %%~nxj
        set CLASSPATH=!CLASSPATH!;%%j
    )
)

echo CLASSPATH 配置完成
echo.

REM 定义需要编译的模块（按依赖顺序）
set MODULES=core utils communion personel customer building quotation system data approval payment information sales construction material decoration

REM 收集所有源文件
echo 收集源文件...
set total_files=0

for %%m in (%MODULES%) do (
    echo 收集模块: %%m
    set module_count=0
    for /r "%PROJECT_DIR%src\com\fanglin\%%m" %%f in (*.java) do (
        echo %%f >> "%ALL_SOURCES%"
        set /a module_count+=1
        set /a total_files+=1
    )
    echo   - %%m: !module_count! 个文件
)

echo 总计收集了 %total_files% 个源文件
echo.

if %total_files% equ 0 (
    echo 错误: 未找到任何源文件
    pause
    exit /b 1
)

REM 编译所有模块
echo 开始编译所有模块...
javac -encoding UTF-8 -d "%CLASSES_DIR%" -cp "%CLASSPATH%" @"%ALL_SOURCES%" >"%BUILD_DIR%\compile.log" 2>&1

if %errorlevel% equ 0 (
    echo ✅ 所有模块编译成功！
) else (
    echo ❌ 编译失败，查看错误详情:
    echo ========================================
    type "%BUILD_DIR%\compile.log"
    echo ========================================
    echo.
    echo 尝试编译单个模块以定位问题...
    goto :COMPILE_INDIVIDUAL
)

:CHECK_RESULT
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

REM 打包 JAR（只包含 decoration 模块）
echo 打包 decoration 模块到 JAR...
cd /d "%CLASSES_DIR%"

REM 创建 JAR 包，只包含 decoration 模块
jar cf "%JAR_OUTPUT%" com\fanglin\decoration\ >nul 2>&1

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

    if %JAR_CLASS_COUNT% gtr 0 (
        echo ✅ 成功解决了 class 文件问题！
        echo.
        echo 🎉 decoration-module.jar 已成功创建！

        REM 显示主要内容
        echo.
        echo 主要包含的类:
        jar tf "%JAR_OUTPUT%" 2>nul | find "\.class$" | head -10

        echo.
        echo 完整的包结构:
        jar tf "%JAR_OUTPUT%" 2>nul | find "/$" | head -10
    ) else (
        echo ⚠️ JAR 包中没有找到 class 文件
    )
) else (
    echo ❌ JAR 文件不存在
)

echo.
echo 编译日志: %BUILD_DIR%\compile.log
echo 所有源文件列表: %ALL_SOURCES%
echo.
echo ========================================
goto :END

:COMPILE_INDIVIDUAL
echo.
echo 尝试编译单个模块以定位问题...
for %%m in (%MODULES%) do (
    echo.
    echo 尝试编译模块: %%m
    set MODULE_SOURCES=%BUILD_DIR%\module-%%m-sources.txt

    REM 为当前模块创建源文件列表
    if exist "%MODULE_SOURCES%" del "%MODULE_SOURCES%"
    for /r "%PROJECT_DIR%src\com\fanglin\%%m" %%f in (*.java) do (
        echo %%f >> "%MODULE_SOURCES%"
    )

    REM 尝试编译当前模块
    javac -encoding UTF-8 -d "%CLASSES_DIR%" -cp "%CLASSPATH%" @"%MODULE_SOURCES%" >"%BUILD_DIR%\compile-%%m.log" 2>&1

    if !errorlevel! equ 0 (
        echo   ✅ %%m 模块编译成功
    ) else (
        echo   ❌ %%m 模块编译失败
        echo   错误预览:
        type "%BUILD_DIR%\compile-%%m.log" | head -20
    )

    del "%MODULE_SOURCES%" >nul 2>&1
)

goto :END

:END
echo.
pause