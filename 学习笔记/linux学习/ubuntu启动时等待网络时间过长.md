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

![](附件/image/ubuntu启动时等待网络时间过长_image_2.png)
