; Instalador com ícone e abertura automática do navegador
[Setup]
AppName=CheckInterface - Pakmatic
AppVersion=1.0
DefaultDirName={pf}\Pakmatic\CheckInterface
DefaultGroupName=Pakmatic
OutputDir=Output
OutputBaseFilename=CheckInterfaceInstaller
SetupIconFile="ico (2).ico"
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Files]
Source: "checkinterface.jar"; DestDir: "{app}"; Flags: ignoreversion
Source: "marcações.db"; DestDir: "{app}"; Flags: ignoreversion
Source: "logo.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\CheckInterface"; \
    Filename: "cmd.exe"; \
    Parameters: "/c start javaw -jar ""{app}\checkinterface.jar"" && start http://localhost:8080"; \
    WorkingDir: "{app}"; \
    IconFilename: "{app}\logo.ico"

Name: "{userdesktop}\CheckInterface"; \
    Filename: "cmd.exe"; \
    Parameters: "/c start javaw -jar ""{app}\checkinterface.jar"" && start http://localhost:8080"; \
    WorkingDir: "{app}"; \
    IconFilename: "{app}\logo.ico"

Name: "{group}\Desinstalar CheckInterface"; Filename: "{uninstallexe}"

[Run]
Filename: "cmd.exe"; \
    Parameters: "/c start javaw -jar ""{app}\checkinterface.jar"" && start http://localhost:8080"; \
    WorkingDir: "{app}"; \
    Flags: nowait postinstall skipifsilent

[Files]
Source: "checkinterface.jar"; DestDir: "{app}"; Flags: ignoreversion
Source: "marcações.db"; DestDir: "{app}"; Flags: ignoreversion
Source: "logo.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "iniciar.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\CheckInterface"; Filename: "{app}\iniciar.bat"; WorkingDir: "{app}"; IconFilename: "{app}\logo.ico"
Name: "{userdesktop}\CheckInterface"; Filename: "{app}\iniciar.bat"; WorkingDir: "{app}"; IconFilename: "{app}\logo.ico"
Name: "{group}\Desinstalar CheckInterface"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\iniciar.bat"; WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent
