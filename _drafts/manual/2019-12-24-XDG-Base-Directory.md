[XDG目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)

The XDG Base Directory Specification is based on the following concepts:

1. There is a single base directory relative to which user-specific data files should be written. This directory is defined by the environment variable $XDG_DATA_HOME.
2. There is a single base directory relative to which user-specific configuration files should be written. This directory is defined by the environment variable $XDG_CONFIG_HOME.
3. There is a set of preference ordered base directories relative to which data files should be searched. This set of directories is defined by the environment variable $XDG_DATA_DIRS.
4. There is a set of preference ordered base directories relative to which configuration files should be searched. This set of directories is defined by the environment variable $XDG_CONFIG_DIRS.
5. There is a single base directory relative to which user-specific non-essential (cached) data should be written. This directory is defined by the environment variable $XDG_CACHE_HOME.
6. There is a single base directory relative to which user-specific runtime files and other file objects should be placed. This directory is defined by the environment variable $XDG_RUNTIME_DIR.

| 环境变量         | 默认值                        | 用途                                                                           |
|------------------|-------------------------------|--------------------------------------------------------------------------------|
| $XDG_DATA_HOME   | $HOME/.local/share            | 应存储用户特定的数据文件的基准目录                                             |
| $XDG_CONFIG_HOME | $HOME/.config                 | 应存储用户特定的配置文件的基准目录                                             |
| $XDG_DATA_DIRS   | /usr/local/share/:/usr/share/ | 一套按照偏好顺序的基准目录集，用来搜索除了 $XDG_DATA_HOME 目录之外的数据文件   |
| $XDG_CONFIG_DIRS | /etc/xdg                      | 一套按照偏好顺序的基准目录集，用来搜索除了 $XDG_CONFIG_HOME 目录之外的配置文件 |
| $XDG_CACHE_HOME  | $HOME/.cache                  | 应存储用户特定的非重要性数据文件的基准目录                                     |
| $XDG_RUNTIME_DIR |                               | 应存储用户特定的非重要性运行时文件和一些其他文件对象                           |
