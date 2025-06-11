@echo off
cd /d "%~dp0"
start javaw -jar checkinterface.jar
timeout /t 2 >nul
start http://localhost:8080
