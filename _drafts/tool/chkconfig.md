### runlevel

    $ chkconfig --levels 235 on

```
0   Halt
1   Single-User mode
2   Multi-user mode console logins only (without networking)
3   Multi-User mode, console logins only
4   Not used/User-definable
5   Multi-User mode, with display manager as well as console logins (X11)
6   Reboot
```

    $ chkconfig --del pm2-init.sh
    $ chkconfig --level 35 atd on


