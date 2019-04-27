## wsl-terminal

下载位置：

    C:\wsl-terminal

快捷方式：

    C:\wsl-terminal\bin\mintty.exe --wsl --rootfs=// --configdir "C:\wsl-terminal\etc" -i "C:\wsl-terminal\open-wsl.exe"  -t "Bash on Ubuntu" -e /bin/wslbridge  -e SHELL="/bin/bash" -e LANG -t -e USE_TMUX=1 /bin/bash

配置：

    C:\wsl-terminal\etc

## wsltty

下载位置：

    %LOCALAPPDATA%

快捷方式：

    %LOCALAPPDATA%\wsltty\bin\mintty.exe --WSL=Ubuntu --configdir="%APPDATA%\wsltty" -t "Bash on Ubuntu" -~

配置：

    %APPDATA%\wsltty
