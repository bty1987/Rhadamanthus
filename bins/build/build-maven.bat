@echo off
chcp 65001 >nul
REM ========================================
REM Maven 构建 decoration 模块
REM ========================================

setlocal enabledelayedexpansion

set PROJECT_DIR=%~dp0

echo ========================================
echo Maven 构建 - Decoration 模块
echo ========================================
echo.

REM 检查 Maven 环境
echo [1/4] 检查 Maven 环境...
call mvn -version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Maven 环境
    echo.
    echo 请先安装 Maven:
    echo 1. 下载 Maven: https://maven.apache.org/download.cgi
    echo 2. 解压到任意目录 (例如: C:\Maven\)
    echo 3. 配置环境变量:
    echo    - 新建系统变量 MAVEN_HOME = C:\Maven\apache-maven-x.x.x
    echo    - 在 Path 中添加: %%MAVEN_HOME%%\bin
    echo 4. 重启命令提示符，再次运行此脚本
    echo.
    pause
    exit /b 1
)

echo Maven 环境检查通过
call mvn -version
echo.

REM 清理旧的构建
echo [2/4] 清理旧的构建...
if exist "target" rmdir /s /q "target"
if exist "build" rmdir /s /q "build"
echo 清理完成
echo.

REM 下载依赖并编译
echo [3/4] 下载依赖并编译源代码...
echo 这可能需要几分钟时间（首次运行需要下载大量依赖库）...
echo.

call mvn clean compile

if errorlevel 1 (
    echo.
    echo ❌ 编译失败！
    echo.
    echo 常见问题排查:
    echo 1. 检查网络连接（Maven 需要从中央仓库下载依赖）
    echo 2. 检查 settings.xml 配置（如果使用了镜像仓库）
    echo 3. 查看上方的错误信息
    echo.
    pause
    exit /b 1
)

echo ✓ 编译成功
echo.

REM 打包 JAR 并复制依赖
echo [4/4] 打包 JAR 并复制依赖库...

call mvn package

if errorlevel 1 (
    echo.
    echo ❌ 打包失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ 构建成功！
echo ========================================
echo.

REM 显示构建结果
echo 📦 构建产物:
echo.

REM JAR 文件信息
if exist "target\decoration-module.jar" (
    for %%f in ("target\decoration-module.jar") do (
        echo [1] decoration-module.jar
        echo     位置: %PROJECT_DIR%target\decoration-module.jar
        echo     大小: %%~zf 字节 (%%~zf / 1024 KB^)
    )
    echo.

    REM 显示 JAR 内容
    echo     内容预览:
    call jar tf target\decoration-module.jar | find "com/fanglin/decoration" | find ".class" > temp-classes.txt
    for /f %%i in ('find /c /v "" ^< temp-classes.txt') do set CLASS_COUNT=%%i
    echo     - 包含 !CLASS_COUNT! 个 .class 文件
    del temp-classes.txt
    echo.
)

REM 依赖库信息
if exist "WebContent\WEB-INF\lib" (
    echo [2] 依赖库 (已复制到 WEB-INF/lib/)
    echo     位置: %PROJECT_DIR%WebContent\WEB-INF\lib\

    set JAR_COUNT=0
    for %%f in ("WebContent\WEB-INF\lib\*.jar") do (
        set /a JAR_COUNT+=1
    )
    echo     数量: !JAR_COUNT! 个 JAR 文件
    echo.
)

REM 显示主要依赖
echo     主要依赖库:
echo     - Struts2 2.5.16
echo     - Spring 4.3.17
echo     - Hibernate 3.6.10
echo     - MySQL Connector 5.1.47
echo     - Jackson 2.9.10
echo     - Apache POI 3.17
echo     - 其他工具库...
echo.

echo ========================================
echo 🎉 所有步骤完成！
echo ========================================
echo.

echo 💡 使用建议:
echo.
echo 1. 部署 decoration 模块:
echo    复制 target\decoration-module.jar 到目标环境
echo.
echo 2. 部署完整应用:
echo    使用 WebContent\ 目录作为 Web 应用根目录
echo    所有依赖已复制到 WEB-INF\lib\
echo.
echo 3. 清理构建:
echo    运行: mvn clean
echo.
echo 4. 重新构建:
echo    运行: build-maven.bat
echo.

pause
endlocal
