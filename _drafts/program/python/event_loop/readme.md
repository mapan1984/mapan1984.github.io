一个generator即为一个协程，利用yeild实现暂停和恢复执行，同时可以与外部进行数据交换。

runner使用`next`激活并执行task。

在task中，执行`yeild sleep(10)`(模仿io操作)，`sleep`即为event，并在初始是加入events_list。

event的callback函数为继续执行task。

当events_list不为空，则取出一个event，判断是否执行完成，完成则会执行该event的callback，在这里即为继续执行task。


1. 维护一个events list，用于存储io events
2. 协程函数进行io操作时，自身挂起，同时向events list中插入io event
3. 通过轮询，捕获io event返回的事件
4. 从events list中取出io event，恢复协程函数
