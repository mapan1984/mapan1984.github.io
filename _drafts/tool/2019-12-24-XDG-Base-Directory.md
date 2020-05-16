[XDG目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)

The XDG Base Directory Specification is based on the following concepts:

1. There is a single base directory relative to which user-specific data files should be written. This directory is defined by the environment variable $XDG_DATA_HOME.
2. There is a single base directory relative to which user-specific configuration files should be written. This directory is defined by the environment variable $XDG_CONFIG_HOME.
3. There is a set of preference ordered base directories relative to which data files should be searched. This set of directories is defined by the environment variable $XDG_DATA_DIRS.
4. There is a set of preference ordered base directories relative to which configuration files should be searched. This set of directories is defined by the environment variable $XDG_CONFIG_DIRS.
5. There is a single base directory relative to which user-specific non-essential (cached) data should be written. This directory is defined by the environment variable $XDG_CACHE_HOME.
6. There is a single base directory relative to which user-specific runtime files and other file objects should be placed. This directory is defined by the environment variable $XDG_RUNTIME_DIR.

|                  |                               |  |
|------------------|-------------------------------|--|
| $XDG_DATA_HOME   | $HOME/.local/share            |  |
| $XDG_CONFIG_HOME | $HOME/.config                 |  |
| $XDG_DATA_DIRS   | /usr/local/share/:/usr/share/ |  |
| $XDG_CONFIG_DIRS | /etc/xdg                      |  |
| $XDG_CACHE_HOME  | $HOME/.cache                  |  |
| $XDG_RUNTIME_DIR |                               |  |
