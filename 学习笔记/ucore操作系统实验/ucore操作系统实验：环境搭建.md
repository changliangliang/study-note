
---
type: blog
status: 未发布
created: 2023-4-20 23:56:13
updated: 2023-4-20 23:56:58
tags: 操作系统 
categories: ucore操作系统实验
---

## 源码和文档

实验的源码可以从 [官方仓库](https://github.com/chyyuu/os_kernel_lab) 获取，需要注意的是目前实验所用的代码已经改为 `Rust` 语言，如果想要 `C` 语言的版本，需要切换到 `x86-32` 分支。

![](附件/ucore操作系统实验：环境搭建_image_1.png)

下载之后可以看到目录结构如下，其中 `labcodes` 为实验所用的源码，`labcodes_answer` 为实验的参考答案，遇到不会做的题目可以进行参考。

![](附件/ucore操作系统实验：环境搭建_image_2.png)
 
 实验的官方手册为： [ucore实验操作手册](https://github.com/chyyuu/ucore_os_docs)包含了实验内容以及实验相关的一些拓展知识。

## GCC 安装

根据官方文档，安装 `gcc` 之后还需要再安装相 `gcc` 编译时所需的依赖，不过这些在 `ubuntu` 里安装起来很容易，两条命令就可搞定。

```bash
sudo apt-get install gcc
sudo apt-get install build-essential
```

![](附件/ucore操作系统实验：环境搭建_image_3.png)

![](附件/ucore操作系统实验：环境搭建_image_4.png)

## QEMU 安裝


文档中安装 `QEMU` 使用的命令如下：

```
sudo apt-get install qemu-system
```

![](附件/ucore操作系统实验：环境搭建_image_5.png)

它会安装很多程序，总共有 600M，而我们在实验中只用到 `qemu-system-i386`，所以可以只安装该程序：

```
sudo apt-get install qemu-system-i386
```

切换到 `labcodes_answer/lab1_result` 目录，执行 `make qemu` 命令，如果弹出 `QEMU` 程序，并开始正常执行，则环境到此配置成功。

![](附件/ucore操作系统实验：环境搭建_image_6.png)

![](附件/ucore操作系统实验：环境搭建_image_7.png)

## 出现的问题

### lab1 编译时出现 `'obj/bootbloc.out' size: 600 bytes` 

![](附件/ucore操作系统实验：环境搭建_image_8.png)

在 `lab1_result` 中使用进行编译代码的时候有可能会出现如下结果，解决方案是可以使用低版本的 `gcc`，比如 `gcc-4.8`。

因为 `lab2_result` 是可以编译成功的，所有对比与 `bootblock` 相关的文件，发现在 `bootmian.c` 中有两行不同，进行修改后发现可以编译成功。

![](附件/ucore操作系统实验：环境搭建_image_9.png)