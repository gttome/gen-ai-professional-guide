@echo off
setlocal ENABLEEXTENSIONS

REM ============================================================
REM Book Cover Tester — Analytics Dashboard (Static)
REM Robust local launcher (serves THIS folder)
REM - Default port is 5520 to avoid common conflicts on 5500
REM - Opens version.txt and index.html with cache-busting params
REM ============================================================

pushd "%~dp0"

set PORT=5520
set BUILD=6.0.5
set URL=http://localhost:%PORT%/index.html?v=%BUILD%&ts=%RANDOM%%RANDOM%
set VURL=http://localhost:%PORT%/version.txt?v=%BUILD%&ts=%RANDOM%%RANDOM%

echo.
echo Serving from: %CD%
echo Build: v%BUILD%
echo Port : %PORT%
echo.
echo Opening:
echo   %URL%
echo   %VURL%
echo.
echo If you get "address already in use", change PORT above or close the other server.
echo Tip: Ctrl+F5 for a hard refresh.
echo.

start "" "%URL%"
start "" "%VURL%"

py -3 -m http.server %PORT% --bind 127.0.0.1
if errorlevel 1 (
  python -m http.server %PORT% --bind 127.0.0.1
)

popd
endlocal
