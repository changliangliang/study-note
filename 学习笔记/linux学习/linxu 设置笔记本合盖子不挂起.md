---
type: note
created: 2023-06-02 22:50:00
updated: 2023-06-02 22:50:00
tags: []
categories: []
---

![](附件/image/linxu%20设置笔记本合盖子不挂起_image_1.png)

要实现合上笔记本盖子后不挂起，可以修改 `/etc/systemd/logind.conf` 的内容，其中有三种不同类型的笔记本电脑合盖默认设置：

- HandleLidSwitch=suspend：当笔记本电脑使用电池供电时，合盖挂起
- HandleLidSwitchExternalPower=suspend：当笔记本电脑插入电源插座时，合盖挂起
- HandleLidSwitchDocked=ignore：当笔记本电脑连接到扩展坞时，合盖忽略

其中值的部分可以选择如下几个选项：

- suspend：合盖时挂起
- lock：合盖时锁定
- ignore：什么都不做
- poweroff：关机
- hibernate：合盖时休眠

修改之后重启服务或者重启系统即可：

```
service systemd-logind restart
```
