@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM 归集第三方 jar 到 WebContent\WEB-INF\lib
REM ========================================
REM 策略: 以 .classpath 为权威清单, 只复制它引用的 jar
REM       (避免把多版本/无用 jar 全塞进来造成冲突)
REM 数据源: Athena 仓库 (默认 D:\ERP\Athena\Other, 可用 ATHENA_DIR 覆盖)
REM 路径映射: .classpath 里的 E:/Ali/Athena/98.Jars/Other/xxx
REM           → 实际 %ATHENA_DIR%/Other/xxx
REM ========================================

REM 项目根目录
set PROJECT_DIR=%~dp0..\..
pushd "%PROJECT_DIR%"
set PROJECT_DIR=%CD%

set LIB_DIR=%PROJECT_DIR%\WebContent\WEB-INF\lib
set CLASSPATH_FILE=%PROJECT_DIR%\.classpath

REM Athena 仓库目录: 默认上级目录的 Athena, 可用环境变量覆盖
if "%ATHENA_DIR%"=="" set ATHENA_DIR=%PROJECT_DIR%\..\Athena
pushd "%ATHENA_DIR%" 2>nul
if errorlevel 1 (
    echo ❌ 未找到 Athena 仓库: %ATHENA_DIR%
    echo    请先 clone 或拷贝 Athena 到该目录, 或用环境变量指定:
    echo    set ATHENA_DIR=路径 ^&^& bins\lib\gather-libs.bat
    goto :error_project
)
set ATHENA_DIR=%CD%
popd
set JAR_ROOT=%ATHENA_DIR%\Other

if not exist "%JAR_ROOT%" (
    echo ❌ 未找到 jar 根目录: %JAR_ROOT%
    echo    期望结构: %ATHENA_DIR%\Other\*.jar (含 aliyun-oss/ fadada/ 等子目录)
    goto :error_project
)

if not exist "%CLASSPATH_FILE%" (
    echo ❌ 未找到 .classpath: %CLASSPATH_FILE%
    goto :error_project
)

echo ========================================
echo  归集第三方 jar (按 .classpath 清单)
echo ========================================
echo jar 根目录 : %JAR_ROOT%
echo 目标       : %LIB_DIR%
echo.

REM ---- 第1步: 清空目标目录旧 jar ----
echo [1/3] 清空 %LIB_DIR% 旧 jar...
if exist "%LIB_DIR%\*.jar" del /q "%LIB_DIR%\*.jar"
echo ✅ 已清空
echo.

REM ---- 第2步: 解析 .classpath, 逐条复制 ----
echo [2/3] 解析 .classpath 并复制 jar...
if not exist "%LIB_DIR%" mkdir "%LIB_DIR%"

set COPIED=0
set MISSING=0
set TOTAL=0

REM 临时文件: 存放从.classpath提取的相对路径(Other/之后的部分)
set LIST_FILE=%PROJECT_DIR%\target\classpath-jars.txt
if not exist "%PROJECT_DIR%\target" mkdir "%PROJECT_DIR%\target"

REM 用 findstr 筛选含 Other 的 lib 条目, 再用 PowerShell 精确提取路径
powershell -NoProfile -Command ^
  "$cp = Get-Content '%CLASSPATH_FILE%';" ^
  "foreach ($line in $cp) {" ^
  "  if ($line -match 'kind=\"lib\"' -and $line -match 'Other/')" ^
  "  {" ^
  "    if ($line -match 'Other/(.+?\.jar)') { $matches[1] }" ^
  "  }" ^
  "}" > "%LIST_FILE%"

for /f "usebackq delims=" %%L in ("%LIST_FILE%") do (
    set /a TOTAL+=1
    if exist "%JAR_ROOT%\%%L" (
        copy /y "%JAR_ROOT%\%%L" "%LIB_DIR%\" >nul 2>&1
        if not errorlevel 1 (
            set /a COPIED+=1
        ) else (
            echo   ⚠ 复制失败: %%L
        )
    ) else (
        echo   ✗ 缺失: %%L
        set /a MISSING+=1
    )
)

echo.
echo ✅ 复制 %COPIED% / %TOTAL% 个 jar
if %MISSING% gtr 0 echo ⚠ 缺失 %MISSING% 个 (Athena 仓库不完整?)
echo.

REM ---- 第3步: 结果统计 ----
echo [3/3] 结果统计...
set FINAL=0
for %%j in ("%LIB_DIR%\*.jar") do set /a FINAL+=1
echo ✅ WEB-INF\lib 现有 %FINAL% 个 jar
echo.
echo ========================================
echo  ✅ 归集完成
echo ========================================
echo 下一步: bins\build\build-all.bat
echo.
popd
exit /b 0

:error_project
popd
exit /b 1
