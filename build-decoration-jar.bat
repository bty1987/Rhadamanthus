@echo off
REM ========================================
REM Rhadamanthus - Decoration 模块打包脚本 (Windows)
REM ========================================
REM 功能：打包 decoration 模块为独立的 JAR 文件
REM 使用方法：build-decoration-jar.bat
REM ========================================

echo ==========================================
echo 开始打包 decoration 模块...
echo ==========================================

REM 检查 Maven 是否安装
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误：Maven 未安装
    echo 请先安装 Maven：https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM 检查 Java 是否安装
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误：Java 未安装
    echo 请先安装 JDK 1.8 或更高版本
    pause
    exit /b 1
)

REM 显示版本信息
echo.
echo 环境检查：
mvn -version | findstr "Apache Maven"
java -version | findstr "java version"
echo.

REM 清理旧的构建
echo 步骤 1: 清理旧的构建...
call mvn clean

REM 编译 decoration 模块
echo.
echo 步骤 2: 编译 decoration 模块...
call mvn compile -P decoration

REM 打包 JAR
echo.
echo 步骤 3: 打包 JAR 文件...
call mvn package -P decoration -DskipTests

REM 检查构建产物
echo.
echo 步骤 4: 检查构建产物...
if exist "target\rhadamanthus-1.0.0.jar" (
    echo ✅ JAR 文件已生成: target\rhadamanthus-1.0.0.jar
    dir "target\rhadamanthus-1.0.0.jar" | findstr "rhadamanthus-1.0.0.jar"
) else (
    echo ❌ 错误：JAR 文件未生成
    pause
    exit /b 1
)

REM 显示 JAR 内容摘要
echo.
echo 步骤 5: JAR 内容摘要...
jar tf target\rhadamanthus-1.0.0.jar | findstr /C:"com/fanglin/decoration/" | find /c /v "" > temp.txt
set /p decoration_count=<temp.txt
echo   decoration 模块文件数: %decoration_count%

jar tf target\rhadamanthus-1.0.0.jar | findstr /C:"com/fanglin/common/" | find /c /v "" > temp.txt
set /p common_count=<temp.txt
echo   common 模块文件数: %common_count%

jar tf target\rhadamanthus-1.0.0.jar | findstr /C:"com/fanglin/core/" | find /c /v "" > temp.txt
set /p core_count=<temp.txt
echo   core 模块文件数: %core_count%

del temp.txt

REM 复制依赖到 WebContent/WEB-INF/lib（可选）
echo.
echo 步骤 6: 复制依赖到 WebContent\WEB-INF\lib...
call mvn dependency:copy-dependencies -P decoration -DoutputDirectory=WebContent\WEB-INF\lib

REM 统计依赖数量
dir /b WebContent\WEB-INF\lib\*.jar 2>nul | find /c /v "" > temp.txt
set /p dep_count=<temp.txt
echo ✅ 已复制 %dep_count% 个依赖到 WebContent\WEB-INF\lib

del temp.txt

echo.
echo ==========================================
echo ✅ decoration 模块打包完成！
echo ==========================================
echo.
echo 生成的文件：
echo   - target\rhadamanthus-1.0.0.jar
echo   - WebContent\WEB-INF\lib\*.jar ^(依赖库^)
echo.
echo 下一步：
echo   1. 将 JAR 文件复制到 Tomcat 的 webapps\Rhadamanthus\WEB-INF\lib\
echo   2. 重启 Tomcat
echo   3. 验证功能正常
echo.

pause
