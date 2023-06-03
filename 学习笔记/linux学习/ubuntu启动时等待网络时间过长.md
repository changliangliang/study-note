---
type: note
created: 2023-06-03 11:01:24
updated: 2023-06-03 11:01:24
tags: []
categories: []
---

> A start job is running for wait for Network to be configured

`systemd-networkd-wait-online.service` 服务的作用是等待网络连线成功，在默认情况下它会一直等待到所有被其监视且由 `systemd-networkd.service` 管理的网络接口链接成功或者超时失败。

开机后为查看 `systemd-networkd-wait-online.service` 服务的状态：

![](附件/image/ubuntu启动时等待网络时间过长_image_1.png)

查看当前的网卡的配置，发现其中一个网卡一直在配置中：

![](附件/image/ubuntu启动时等待网络时间过长_image_2.png)

查看该网卡的配置（`/etc/netplan` 目录下），可以发现 `dhcp4` 是开启的，到这一步大概知道为什么网络配置失败了，这个网卡处理的是有线连接，但是我并没有使用到网线。

![](附件/image/ubuntu启动时等待网络时间过长_image_3.png)

这里有两种解决方案：
- 禁用该网卡
- 减少 `systemd-networkd-wait-online.service` 等待时间

禁用网卡可以使用如下命令：

```
ip link set 网卡名 down
```

