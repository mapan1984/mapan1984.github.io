### 基本操作

列出所有虚拟机：

    $ virsh list --all

显示虚拟机信息：

    $ virsh dominfo kvm-1

关闭虚拟机：

    $ virsh shutdown kvm-1

启动虚拟器：

    $ virsh start kvm-1

设置虚拟机跟随系统自启：

    $ virsh autostart kvm-1

关闭虚拟以及自启：

    $ virsh autostart --disable kvm-1

删除虚拟机：

    $ virsh undefine kvm-1

通过控制窗口登录虚拟机：

    $ virsh console kvm-1
