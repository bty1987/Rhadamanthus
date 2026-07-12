@echo off
setlocal enabledelayedexpansion

REM ========================================
REM Rhadamanthus build (local jar, no Maven)
REM ========================================
REM usage: bins\build\build-all.bat
REM needs: JDK 1.8 + jars in WebContent\WEB-INF\lib
REM out  : target\classes + target\rhadamanthus.war
REM ========================================

set PROJECT_DIR=%~dp0..\..
pushd "%PROJECT_DIR%"
set PROJECT_DIR=%CD%

set SRC_DIR=%PROJECT_DIR%\src
set CONF_DIR=%PROJECT_DIR%\conf
set LIB_DIR=%PROJECT_DIR%\WebContent\WEB-INF\lib
set PRIV_LIB_DIR=%PROJECT_DIR%\project-libs
set WEBCONTENT_DIR=%PROJECT_DIR%\WebContent
set CLASSES_DIR=%PROJECT_DIR%\target\classes
set WAR_OUTPUT=%PROJECT_DIR%\target\rhadamanthus.war

echo ========================================
echo  Rhadamanthus build (local jar, no Maven)
echo ========================================
echo project: %PROJECT_DIR%
echo.

REM ---- step1: locate JDK 1.8 ----
echo [1/7] locate JDK 1.8 ...
set JDK8_HOME=

REM prio1: JAVA_HOME, must be 1.8
if exist "%JAVA_HOME%\bin\javac.exe" (
    "%JAVA_HOME%\bin\javac.exe" -version 2>&1 | findstr "1.8" >nul && set JDK8_HOME=%JAVA_HOME%
)
REM prio2: common install paths
if "!JDK8_HOME!"=="" if exist "D:\Program Files\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=D:\Program Files\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "C:\Program Files\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=C:\Program Files\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "D:\Program Files (x86)\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=D:\Program Files (x86)\Java\jdk1.8.0_491
if "!JDK8_HOME!"=="" if exist "C:\Program Files (x86)\Java\jdk1.8.0_491\bin\javac.exe" set JDK8_HOME=C:\Program Files (x86)\Java\jdk1.8.0_491

if "!JDK8_HOME!"=="" (
    echo [X] JDK 1.8 not found
    echo     JAVA_HOME now is: %JAVA_HOME%
    echo     set JAVA_HOME to a JDK 1.8 dir, e.g.
    echo     set JAVA_HOME=D:\Program Files\Java\jdk1.8.0_491
    goto :error
)

set JAVAC_EXE=!JDK8_HOME!\bin\javac.exe
set JAR_EXE=!JDK8_HOME!\bin\jar.exe
echo [v] JDK 1.8: !JDK8_HOME!
"!JAVAC_EXE!" -version 2>&1
echo.
echo.

REM ---- step2: check libs ----
echo [2/7] check libs...
if not exist "%LIB_DIR%\*.jar" (
    echo [X] no jar in %LIB_DIR%
    echo     run bins\lib\gather-libs.bat first
    goto :error
)
set LIB_COUNT=0
for %%j in ("%LIB_DIR%\*.jar") do set /a LIB_COUNT+=1
set PRIV_COUNT=0
if exist "%PRIV_LIB_DIR%\*.jar" (
    for %%j in ("%PRIV_LIB_DIR%\*.jar") do set /a PRIV_COUNT+=1
)
echo [v] WEB-INF/lib: %LIB_COUNT% jars
echo [v] project-libs: %PRIV_COUNT% jars
echo.

REM ---- step3: build CLASSPATH ----
echo [3/7] build CLASSPATH...
REM full compile: classpath must NOT contain target\classes itself
REM (stale .class in target\classes can shadow fresh source and cause spurious errors)
set CP=%CONF_DIR%
for %%j in ("%LIB_DIR%\*.jar") do set CP=!CP!;%%j
for %%j in ("%PRIV_LIB_DIR%\*.jar") do set CP=!CP!;%%j
echo [v] CLASSPATH ready
echo.

REM ---- step4: prepare output ----
echo [4/7] prepare output dir...
if exist "%CLASSES_DIR%" rd /s /q "%CLASSES_DIR%"
mkdir "%CLASSES_DIR%" 2>nul
echo [v] %CLASSES_DIR%
echo.

REM ---- step5: collect sources ----
echo [5/7] collect sources...
set SOURCES_LIST=%PROJECT_DIR%\target\sources.txt
if exist "%SOURCES_LIST%" del "%SOURCES_LIST%"
dir /s /b "%SRC_DIR%\*.java" > "%SOURCES_LIST%"

set SRC_COUNT=0
for /f %%i in ('type "%SOURCES_LIST%" ^| findstr /r /c:".*" ^| findstr /r /c:".*"') do set /a SRC_COUNT+=1
echo [v] java files: !SRC_COUNT!
if !SRC_COUNT! equ 0 (
    echo [X] no java source found
    goto :error
)
echo.

REM ---- step6: compile ----
echo [6/7] compiling (may take a few minutes)...
"!JAVAC_EXE!" -encoding UTF-8 -nowarn -Xlint:none ^
      -d "%CLASSES_DIR%" ^
      -cp "%CP%" ^
      @"%SOURCES_LIST%" 2>"%PROJECT_DIR%\target\compile-errors.log"

if errorlevel 1 (
    echo [X] compile failed, see target\compile-errors.log
    type "%PROJECT_DIR%\target\compile-errors.log"
    goto :error
)
echo [v] compile ok
echo.

REM copy resources to classes
echo     copy resources...
copy /y "%CONF_DIR%\*.xml" "%CLASSES_DIR%\" >nul 2>&1
copy /y "%CONF_DIR%\*.properties" "%CLASSES_DIR%\" >nul 2>&1
copy /y "%CONF_DIR%\*.txt" "%CLASSES_DIR%\" >nul 2>&1

set CLASS_COUNT=0
for /r "%CLASSES_DIR%" %%f in (*.class) do set /a CLASS_COUNT+=1
echo [v] !CLASS_COUNT! class files generated
echo.

REM ---- step7: package WAR ----
echo [7/7] package WAR...
if exist "%WEBCONTENT_DIR%\WEB-INF\classes" rd /s /q "%WEBCONTENT_DIR%\WEB-INF\classes"
xcopy /e /y /i "%CLASSES_DIR%\*" "%WEBCONTENT_DIR%\WEB-INF\classes\" >nul

if exist "%WAR_OUTPUT%" del "%WAR_OUTPUT%"
pushd "%WEBCONTENT_DIR%"
"!JAR_EXE!" cf "%WAR_OUTPUT%" *
popd

if not exist "%WAR_OUTPUT%" (
    echo [X] WAR package failed
    goto :error
)
echo [v] WAR: %WAR_OUTPUT%
for %%I in ("%WAR_OUTPUT%") do echo     size: %%~zI bytes
echo.

echo ========================================
echo  [v] BUILD SUCCESS
echo ========================================
echo output:
echo   classes : %CLASSES_DIR%
echo   war     : %WAR_OUTPUT%
echo deploy: copy war to Tomcat webapps dir
echo.
popd
exit /b 0

:error
echo.
echo [X] BUILD FAILED
popd
exit /b 1
