## 按键映射

  递归        非递归        模式
:map    :noremap       normal, visual, operator-pending
:nmap    :nnoremap    normal
:xmap    :xnoremap    visual
:cmap    :cnoremap    command-line
:omap    :onoremap    operator-pending
:imap    :inoremap    insert

取消映射：

    :unmap

通过`<nop>`禁用映射：

    :noremap <left> <nop>

## 自动命令

`:au`查看所有的自动命令。

`:h {event}`查看Vim中所有事件的列表。

`:help autocommand`

## 局部化

全局         局部                 作用域       帮助文档
:set         :setlocal          缓冲区或窗口    :h local-options
:map         :map <buffer>         缓冲区     :h :map-local
:autocmd     :autocmd * <buffer>   缓冲区     :h autocmd-buflocal
:cd          :lcd                  窗口       :h :lcd
:<leader>    :<localleader>       缓冲区     :h maploacalleader

