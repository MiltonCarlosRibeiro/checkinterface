@echo off
cd /d %~dp0
echo [INFO] Gerando JAR...
mvn clean package

echo [INFO] Empacotando com jpackage...

jpackage ^
  --type exe ^
  --name XLSXChecklist ^
  --input target ^
  --main-jar xlsxchecklist-0.0.1-SNAPSHOT.jar ^
  --main-class br.com.pakmatic.xlsxchecklist.XlsxchecklistApplication ^
  --dest dist ^
  --icon src\main\resources\static\assets\logo.ico ^
  --java-options "-Xmx512m" ^
  --win-shortcut ^
  --win-dir-chooser ^
  --win-menu ^
  --win-menu-group "Pakmatic Tools"

echo.
echo [OK] Instalador gerado na pasta 'dist'.
pause
