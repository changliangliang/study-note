

## gcc-4.8 安装

实验中使用的 `ubuntu` 版本为 ` 20.04 `，默认情况下安装的 `gcc` 版本为 ` 9.4.0 `，发现在编译实验代码的过程中会出现错误。

![](附件/ucore操作系统实验：环境搭建_image_1.png)

![](附件/ucore操作系统实验：环境搭建_image_2.png)

![](附件/ucore操作系统实验：环境搭建_image_3.png)

翻阅实验手册发现使用的 `gcc` 版本为 `4.8`，于是尝试安装该版本的 `gcc`。

![](附件/ucore操作系统实验：环境搭建_image_4.png)

直接安装发现软件源中没有没有该版本的 `gcc`

![](附件/ucore操作系统实验：环境搭建_image_5.png)



```bash
cd /usr/bin
sudo rm gcc // 删除原来的gcc
sudo ln -s gcc-4.8 gcc
sudo rm g++ // 删除原来的g++
sudo ln -s g++-4.8 g++
```