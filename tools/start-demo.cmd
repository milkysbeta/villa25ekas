@echo off
setlocal
title Villa 25 Ekas - demo server

rem ---------------------------------------------------------------------------
rem  Starts the development server and opens the demo in your browser.
rem  Leave this window open while you work; closing it stops the server.
rem ---------------------------------------------------------------------------

set "ROOT=%~dp0.."
set "SITE=%ROOT%\site"
set "URL=http://localhost:5180/demo/?key=acid1234"

echo.
echo   VILLA 25 EKAS
echo   ---------------------------------------------------
echo.

rem Node is the only requirement; say so plainly rather than failing obscurely.
where node >nul 2>&1
if errorlevel 1 (
  echo   Node.js is not installed, or not on PATH.
  echo   Install it from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)

rem First run after a fresh clone has no node_modules.
if not exist "%SITE%\node_modules\vite\bin\vite.js" (
  echo   First run - installing dependencies. This takes a minute...
  echo.
  pushd "%SITE%"
  call npm install
  popd
  echo.
)

rem If something is already listening on 5180, reuse it rather than failing on
rem the strict-port check.
netstat -ano | findstr /r /c:"TCP.*:5180 .*LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo   Server already running on port 5180 - opening the browser.
  start "" "%URL%"
  echo.
  echo   Close the other server window to stop it.
  timeout /t 4 >nul
  exit /b 0
)

echo   Starting the server...
echo.
echo   Demo:     %URL%
echo   Password: acid1234
echo.
echo   Keep this window open. Close it to stop the server.
echo   ---------------------------------------------------
echo.

rem Give Vite a moment to bind the port before the browser asks for it.
start "" /b cmd /c "timeout /t 4 >nul && start "" "%URL%""

pushd "%SITE%"
node "node_modules\vite\bin\vite.js" --port 5180 --strictPort
popd

echo.
echo   Server stopped.
pause
