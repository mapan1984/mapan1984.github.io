    $ youtube-dl.exe --proxy socks5://127.0.0.1:1080/ --list-formats 'https://www.youtube.com/watch?v=SVCflvs9dGw'
    $ youtube-dl.exe --proxy socks5://127.0.0.1:1080/ -f 137+251 --output "%(uploader)s%(title)s.%(ext)s" 'https://www.youtube.com/watch?v=SVCflvs9dGw'
