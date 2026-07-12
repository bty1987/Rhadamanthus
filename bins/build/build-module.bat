@echo off
setlocal enabledelayedexpansion

REM ========================================
REM Rhadamanthus module jar builder (local jar, no Maven)
REM ========================================
REM usage: bins\build\build-module.bat ^<module^> ^<version^>
REM   e.g.  bins\build\build-module.bat decoration 8.3.027.010
REM         bins\build\build-module.bat quotation 8.3.028.001
REM out  : target\fanglin-^<module^>-^<version^>.jar
REM ========================================

REM parse args
set MODULE=%~1
set VERSION=%~2

if "!MODULE!"=="" (
    echo [X] usage: bins\build\build-module.bat ^<module^> ^<version^>
    echo     e.g.  bins\build\build-module.bat decoration 8.3.027.010
    echo.
    echo available modules:
    dir /b "%~dp0..\..\src\com\fanglin" 2>nul
    exit /b 1
)
if "!VERSION!"=="" (
    echo [X] version required
    echo     e.g.  bins\build\build-module.bat !MODULE! 8.3.027.010
    exit /b 1
)

set PROJECT_DIR=%~dp0..\..
pushd "%PROJECT_DIR%"
set PROJECT_DIR=%CD%

set SRC_DIR=%PROJECT_DIR%\src
set CONF_DIR=%PROJECT_DIR%\conf
set LIB_DIR=%PROJECT_DIR%\WebContent\WEB-INF\lib
set PRIV_LIB_DIR=%PROJECT_DIR%\project-libs
set CLASSES_DIR=%PROJECT_DIR%\target\classes
set JAR_OUTPUT=%PROJECT_DIR%\target\fanglin-!MODULE!-!VERSION!.jar

echo ========================================
echo  build fanglin-!MODULE!-!VERSION!.jar
echo ========================================
echo project: %PROJECT_DIR%
echo module : !MODULE!
echo version: !VERSION!
echo.

REM ---- step1: check module exists ----
if not exist "%SRC_DIR%\com\fanglin\!MODULE!" (
    echo [X] module not found: src\com\fanglin\!MODULE!
    echo     available modules:
    dir /b "%SRC_DIR%\com\fanglin"
    goto :error
)
echo [1/6] module ok: src\com\fanglin\!MODULE!

REM ---- step2: locate JDK 1.8 ----
echo [2/6] locate JDK 1.8 ...
set JDK8_HOME=
if exist "%JAVA_HOME%\bin\javac.exe" (
    "%JAVA_HOME%\bin\javac.exe" -version 2>&1 | findstr "1.8" >nul && set JDK8_HOME=%JAVA_HOME%
)
if "!JDK8_HOME!"=="" if exist "D:\Program Files\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=D:\Program Files\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "C:\Program Files\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=C:\Program Files\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "D:\Program Files (x86)\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=D:\Program Files (x86)\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "C:\Program Files (x86)\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=C:\Program Files (x86)\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" (
    echo [X] JDK 1.8 not found, set JAVA_HOME to JDK 1.8
    goto :error
)
set JAVAC_EXE=!JDK8_HOME!\bin\javac.exe
set JAR_EXE=!JDK8_HOME!\bin\jar.exe
echo       JDK 1.8: !JDK8_HOME!

REM ---- step3: build CLASSPATH (full, for compile) ----
echo [3/6] build CLASSPATH ...
set CP=%CLASSES_DIR%;%CONF_DIR%
for %%j in ("%LIB_DIR%\*.jar") do set CP=!CP!;%%j
for %%j in ("%PRIV_LIB_DIR%\*.jar") do set CP=!CP!;%%j

REM ensure full classes exist (compile all, so cross-module deps resolve)
REM if target\classes missing or empty, compile everything first
set NEED_FULL_COMPILE=1
if exist "%CLASSES_DIR%\com\fanglin\core" set NEED_FULL_COMPILE=0
if "!NEED_FULL_COMPILE!"=="1" (
    echo       full classes not found, compiling all sources first ...
    goto :full_compile
)
echo       reusing existing target\classes
goto :module_compile

:full_compile
if not exist "%CLASSES_DIR%" mkdir "%CLASSES_DIR%"
set ALL_SOURCES=%PROJECT_DIR%\target\all-sources.txt
dir /s /b "%SRC_DIR%\*.java" > "%ALL_SOURCES%"
REM full compile: classpath must NOT contain target\classes itself
REM (stale .class in target\classes can shadow fresh source and cause spurious errors)
set CP_FULL=%CONF_DIR%
for %%j in ("%LIB_DIR%\*.jar") do set CP_FULL=!CP_FULL!;%%j
for %%j in ("%PRIV_LIB_DIR%\*.jar") do set CP_FULL=!CP_FULL!;%%j
"!JAVAC_EXE!" -encoding UTF-8 -nowarn -Xlint:none -d "%CLASSES_DIR%" -cp "%CP_FULL%" @"%ALL_SOURCES%" 2>"%PROJECT_DIR%\target\compile-errors.log"
if errorlevel 1 (
    echo [X] full compile failed, see target\compile-errors.log
    type "%PROJECT_DIR%\target\compile-errors.log"
    goto :error
)
REM copy resources
copy /y "%CONF_DIR%\*.xml" "%CLASSES_DIR%\" >nul 2>&1
copy /y "%CONF_DIR%\*.properties" "%CLASSES_DIR%\" >nul 2>&1
copy /y "%CONF_DIR%\*.txt" "%CLASSES_DIR%\" >nul 2>&1

:module_compile
REM ---- step4: collect module sources ----
echo [4/6] collect module sources ...
set MOD_SOURCES=%PROJECT_DIR%\target\!MODULE!-sources.txt
if exist "%MOD_SOURCES%" del "%MOD_SOURCES%"
dir /s /b "%SRC_DIR%\com\fanglin\!MODULE!\*.java" > "%MOD_SOURCES%"

set MOD_COUNT=0
for /f %%i in ('type "%MOD_SOURCES%" ^| findstr /r /c:".*" ^| findstr /r /c:".*"') do set /a MOD_COUNT+=1
echo       !MODULE! sources: !MOD_COUNT! files
if !MOD_COUNT! equ 0 (
    echo [X] no java in src\com\fanglin\!MODULE!
    goto :error
)

REM ---- step5: compile module into staged dir ----
echo [5/6] compile !MODULE! ...
set MOD_CLASSES=%PROJECT_DIR%\target\!MODULE!-classes
if exist "%MOD_CLASSES%" rd /s /q "%MOD_CLASSES%"
mkdir "%MOD_CLASSES%"

REM compile module sources; classpath includes full classes for cross-module deps
"!JAVAC_EXE!" -encoding UTF-8 -nowarn -Xlint:none ^
    -d "%MOD_CLASSES%" ^
    -cp "%CLASSES_DIR%;%CP%" ^
    @"%MOD_SOURCES%" 2>"%PROJECT_DIR%\target\!MODULE!-compile-errors.log"
if errorlevel 1 (
    echo [X] module compile failed, see target\!MODULE!-compile-errors.log
    type "%PROJECT_DIR%\target\!MODULE!-compile-errors.log"
    goto :error
)

set MOD_CLASS_COUNT=0
for /r "%MOD_CLASSES%" %%f in (*.class) do set /a MOD_CLASS_COUNT+=1
echo       !MOD_CLASS_COUNT! class files

REM ---- step6: package jar (module classes only, no manifest) ----
echo [6/6] package fanglin-!MODULE!-!VERSION!.jar ...
if exist "%JAR_OUTPUT%" del "%JAR_OUTPUT%"
pushd "%MOD_CLASSES%"
REM 用 M(不生成MANIFEST.MF), 模拟第三方zip工具重打包, 兼容Tomcat加载
REM (jar cf生成的manifest会导致部分Tomcat环境无法识别class, zip重打包则正常)
"!JAR_EXE!" cfM "%JAR_OUTPUT%" com\fanglin\!MODULE!
popd

if not exist "%JAR_OUTPUT%" (
    echo [X] jar package failed
    goto :error
)

echo.
echo ========================================
echo  [v] BUILD SUCCESS
echo ========================================
echo jar : %JAR_OUTPUT%
for %%I in ("%JAR_OUTPUT%") do echo size: %%~zI bytes
echo.
echo verify:
echo   !JAR_EXE! tf "%JAR_OUTPUT%"
echo.
popd
exit /b 0

:error
echo.
echo [X] BUILD FAILED
popd
exit /b 1
