\
    @echo off
    setlocal ENABLEEXTENSIONS
    pushd "%~dp0"

    echo Rebuilding data\manifest.json from data\sessions\*.txt ...
    py tools\rebuild_manifest.py 2>nul
    if errorlevel 1 (
        echo 'py' not found or failed, trying 'python'...
        python tools\rebuild_manifest.py
    )

    echo.
    echo Done.
    popd
    pause
    endlocal
