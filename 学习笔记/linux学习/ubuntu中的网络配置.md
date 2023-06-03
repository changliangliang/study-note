---
type: blog
created: 2022-04-19 20:38:27
updated: 2022-04-19 20:38:27
tags: [linux]
categories: []
---

## 配置流程

从 Ubuntu 18 开始，Ubuntu 开始用 Netplan 作为网络配置的程序，于是乎想要更改网络配置，就需要编辑文件夹 `/etc/netplan` 里的文件，其中 `01-network-manager-all.yaml` 就是配置文件。

![](附件/image/ubuntu中的网络配置_image_1.png)

编辑完配置文件后，执行如下命令使配置文件生效：

```bash
netplat apply
```

之后重启网络服务

```bash
systemctl restart NetworkManager.service
```

使用 `ip a` 命令常看网卡状态，判断是否配置成功。

![](附件/image/ubuntu中的网络配置_image_2.png)

## 常用配置

### 动态 IP

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: true
```

### 静态 IP

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      addresses:
        - 10.10.10.2/24
      routes: 
        - to: default
          via: 10.10.10.1
      nameservers:
          addresses: [10.10.10.1, 1.1.1.1]
```

### 多网卡

```yaml
network:
  version: 2
  ethernets:
    enred:
      dhcp4: yes
      dhcp4-overrides:
        route-metric: 100
    engreen:
      dhcp4: yes
      dhcp4-overrides:
        route-metric: 200
```

### 无密码 wifi

```yaml
network:
  version: 2
  wifis:
    wl0:
      access-points:
        opennetwork: {}
      dhcp4: yes
```

### 有密码 wifi

```yaml
network:
  version: 2
  renderer: networkd
  wifis:
    wlp2s0b1:
      dhcp4: no
      dhcp6: no
      addresses: [192.168.0.21/24]
      routes: 
        - to: default
          via: 10.10.10.1
      nameservers:
        addresses: [192.168.0.1, 8.8.8.8]
      access-points:
        "network_ssid_name":
          password: "**********"
```

### 单网卡多地址（同一网段）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
     addresses:
       - 10.100.1.38/24
       - 10.100.1.39/24
     gateway4: 10.100.1.1
```

### 单网卡多地址（不同网段）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
     addresses:
       - 9.0.0.9/24
       - 10.0.0.10/24
       - 11.0.0.11/24
     #gateway4:    # unset, since we configure routes below
     routes:
       - to: 0.0.0.0/0
         via: 9.0.0.1
         metric: 100
       - to: 0.0.0.0/0
         via: 10.0.0.1
         metric: 100
       - to: 0.0.0.0/0
         via: 11.0.0.1
         metric: 100
```

## 参考资料

- [Ubuntu 18.04 LTS 通过 Netplan 配置网络教程 - 腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1699857)
