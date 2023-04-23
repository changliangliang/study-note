---
type: blog
status: 未发布
created: 2023-04-18 16:45:41
updated: 2023-04-18 16:45:41
tags: docker
categories: docker学习笔记 
---

## 镜像操作

### 获取镜像

```bash
docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
```

- Docker 镜像仓库地址：格式一般是 `<域名/IP>[:端口号]`，默认地址是 Docker Hub (`docker.io`)；
- 仓库名：格式一般为 `<用户名>/<软件名>`，对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

### 列出镜像

```bash
docker image ls
```

![](附件/image/docker%20常用操作_image_1.png)

该命令会列出所有镜像的信息，包含了 `仓库名`、`标签`、`镜像 ID`、`创建时间` 以及 `所占用的空间`。

### 查看镜像体积

应为 `docker` 中的镜像是分层存储的，不同的镜像可能使用了同一层的内容，所以 `docker` 镜像占用的空间并不是上面每个镜像占用空间的简单加和，如果想要知道镜像占用的实际空间，可以使用下面的命令查看。

```bash
docker system df
```

![](附件/image/docker%20常用操作_image_2.png)

### 悬浮镜像

有时候在镜像列表中会出现仓库名和标签名为 `<none>` 的镜像，这是由于新旧镜像同名，旧镜像名称被取消，像这种无标签镜像也被称为虚悬镜像，以下情况可能会出现悬浮镜像：

- 官方对镜像进行了维护，之后使用 `docker pull` 拉取镜像；
- 使用 `docker build` 命令构建了新的同名镜像。

```sh
REPOSITORY      TAG           IMAGE ID         CREATED          SIZE
<none>          <none>        00285df0df87     5 days ago       342 MB
```

`docker image ls -f dangling=true `  命令可以查看悬浮镜像。一般来说悬浮惊醒已经没有任何的使用价值，可以通过 `docker image prune` 命令进行删除。

### 中间层镜像

由于镜像是分层存储的，有时候拉取顶层镜像的时候会存在一些中间镜像，这些镜像不会再列表中出现，但是对于顶层镜像来说是必须的。同时因为这些中间镜像是会重复利用的，只用删除顶层镜像，它依赖的中间镜像也会被删除，所以一般情况下不必担心中间镜像占用存储空间。如果希望查看中间镜像，可以使用如下命令：

```sh
$ docker image ls -a
```

### 列出指定镜像 #todo 

`docker image ls ubuntu` 

```bash
$ 
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              18.04               329ed837d508        3 days ago          63.3MB
ubuntu              bionic              329ed837d508        3 days ago          63.3MB
```

```sh
$ docker image ls ubuntu:18.04
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              18.04               329ed837d508        3 days ago          63.3MB
```

- 可以使用 `--filter` 过滤器，比如要查看 `mongo:3.2` 之后建立的镜像，可以用下面的命令：

```sh
$ docker image ls -f since=mongo:3.2
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
redis               latest              5f515359c7f8        5 days ago          183 MB
nginx               latest              05a60462f8ba        5 days ago          181 MB
```

想查看某个位置之前的镜像也可以，只需要把 `since` 换成 `before` 即可。此外，如果镜像构建时，定义了 `LABEL`，还可以通过 `LABEL` 来过滤。

```bash
$ docker image ls -f label=com.example.version=0.1
```

#### 以特定格式显示

- 只显示 `id`

```sh
$ docker image ls -q
5f515359c7f8
05a60462f8ba
fe9198c04d62
00285df0df87
329ed837d508
329ed837d508
```

- 自定义格式，格式使用 `go` 语言模板

```sh
$ docker image ls --format "{{.ID}}: {{.Repository}}"
5f515359c7f8: redis
05a60462f8ba: nginx
fe9198c04d62: mongo
00285df0df87: <none>
329ed837d508: ubuntu
329ed837d508: ubuntu
```

### 删除镜像

```bash
docker image rm [选项] <镜像1> [<镜像2> ...]
```

其中，`<镜像>` 可以是 `镜像短 ID`、`镜像长 ID`、`镜像名` 或者 `镜像摘要`，并且可以使用下面的方式配合 `docker image ls` 删除多个镜像。

```sh
$ docker image rm $(docker image ls -q redis)
```


## 容器操作

### 新建并启动

新建容器的命令如下，可以指定容器中执行的程序以及所需的参数。

```bash
docker run ubuntu:18.04 /bin/echo 'Hello world'
```

当利用 `docker run` 来创建容器时，Docker 在后台运行的标准操作包括：

- 检查本地是否存在指定的镜像，不存在就从 [`registry`](https://vuepress.mirror.docker-practice.com/repository/) 下载
- 利用镜像创建并启动一个容器
- 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
- 从地址池配置一个 ip 地址给容器
- 执行用户指定的应用程序
- 执行完毕后容器被终止

如果想要和容器中运行的程序进行交互，可以使用如下命令：

```bash
docker run -t -i ubuntu:18.04 /bin/bash
root@af8bae53bdd3:/#
```

- `-t` 选项让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上；
- `-i` 则让容器的标准输入保持打开。

### 启动已经存在的容器

```bash
docker container start
```

### 后台运行

![](附件/image/docker%20常用操作_image_3.png)

默认情况下容器的输出会直接在前台现实，`-d` 参数用来让容器在后台输出。

![](附件/image/docker%20常用操作_image_4.png)

此时会返回一个 `容器ID`，如果想要查看容器的输出内容，可以使用 `docker container logs` 命令。

![](附件/image/docker%20常用操作_image_5.png)

输出内容使用 `docker logs` 来查看。

```sh
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
77b2dc01fe0f3f1265df143181e7b9af5e05279a884f4776ee75350ea9d8017a
```

### 终止容器

```bash
docker container stop 容器ID
```

![](附件/image/docker%20常用操作_image_6.png)

终止后返回容器对应的 ID。

### 列出容器

```bash
docker container ls
```

如果想要列出所有容器，可以使用 `-a` 参数：

```bash
docker container ls -a
```

![](附件/image/docker%20常用操作_image_7.png)

### 重启容器

改命令会将一个运行态的容器终止，然后再重新启动它。

```bash
docker container restart 容器ID
```

### 进入容器

当容器后台运行时，有时候需要重新进入到容器中进行一些操作，这时候可以使用 `docker exec` 命令。

首先创建一个后台运行的 `ubuntu` 容器。

![](附件/image/docker%20常用操作_image_8.png)

通过如下命令可以进入到该容器中进行一些操作：

```bash
docker exec -it d63a bash
```

![](附件/image/docker%20常用操作_image_9.png)

`-t` 和 `-i` 参数的含义和 `docker run` 中的参数含义是一样的。

### 删除容器

```bash
docker container rm 容器ID
```

![](附件/image/docker%20常用操作_image_10.png)

类似于镜像操作，使用 `docker container prune` 可以清理掉所有处于终止状态的容器。

### 查看容器详情

```bash
docker container inspect 容器ID
```

![](附件/image/docker%20常用操作_image_11.png)

## 数据操作

### 数据卷

容器中所有的数据的生存周期和容器是一致的，例如我们使用了一个 `MySQL` 容器，当移除该容器后所有存储的数据都将会消失。数据卷提供了一种将数据和容器分离的机制，类似于 Linux 中的文件挂载，数据存在于硬盘中，而硬盘和操作系统之间是相互独立了，这里的数据卷就可以看做是硬盘。

#### 创建数据卷

```bash
docker volume create 数据卷名称
```

![](附件/image/docker%20常用操作_image_12.png)

#### 查看数据卷

`docker volume ls` 可以查看目前存在的所有数据卷，如果想要查看数据卷的详细信息，可以使用 `docker volume inspect 数据卷名称`。

![](附件/image/docker%20常用操作_image_13.png)

![](附件/image/docker%20常用操作_image_14.png)

可以看到数据卷本质上就是 `/var/lib/docker/volumes/` 目录下的一个文件夹。

#### 挂载数据卷

在创建容器的时候使用 `--mount` 参数可以用来挂载数据卷，

![](附件/image/docker%20常用操作_image_15.png)

在挂在目录 `/testdata` 中创建一个文件，然后在主机目录下的 `/var/lib/docker/volumes/mydata/_data` 目录中可以看到文件 `test.txt` ，即在容器中创建的那个文件。

![](附件/image/docker%20常用操作_image_16.png)

![](附件/image/docker%20常用操作_image_17.png)

使用 `docker container inspect` 命令查看容器信息，可以在 `Mounts` 项中看到容器挂载的所有数据卷。

![](附件/image/docker%20常用操作_image_18.png)

#### 删除数据卷

```bash
docker volume rm 数据卷名称
```

数据卷的存在会占用主机的存储空间，所以当数据卷不在使用时尽量将其删除，使用 `$ docker volume prune` 命令可以删除所有没有被挂载的数据卷。

### 挂载主机目录

有时候想要挂载的数据不一定是容器生成的，或者更直白的一点说，想要把主机中已经存在的数据挂载到容器上，使用 `--mount` 参数也是可以实现的，同时可以使用 `readonly` 设置为只读。

```bash
--mount type=bind,source=/src/webapp,target=/usr/share/nginx/html,readonly 
```


## 网络配置

### 端口映射

容器中有时候会运行一些网络应用，如 web 服务器，那么就需要能够从外部访问到这些网络应用，在 docker 中是通过端口映射实现的。

`docker run` 命令有两个参数可以用于端口映射：

- `-P` 参数随机映射主机端口到内部容器开方的端口；
- `-p` 则可以指定要映射的端口，并且在一个指定端口上只可以绑定一个容器。


`-p` 参数支持的格式有为：

```
ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort
```

-  `-p 80:80`：将所有接口上的 80 端口都映射的容器的 80 端口；
- `-p 127.0.0.1:80:80`：将所有接口 `127.0.0.1` 上的 80 端口映射的容器的 80 端口；
- `-p 127.0.0.1::80`：将所有接口 `127.0.0.1` 上的随机一个端口映射的容器的 80 端口；
- `-p 127.0.0.1:80:80/udp`：将所有接口 `127.0.0.1` 上的 80 端口映射的容器的 80 端口，不过使用的是 udp 端口。

命令 `docker port` 可以查看映射的端口。

![](附件/image/docker%20常用操作_image_19.png)

### 连接容器

容器互联的作用是使的同一个主机上的容器可以实现相互访问，第一步是先创建一个 docker 网络，使用的命令如下：

```
docker network create -d bridge my-net
```

之后创建容器的时候可以使用 `--network` 参数指定容器使用的网络：

![](附件/image/docker%20常用操作_image_20.png)

下面使用实例展示两者之间的通信：

![](附件/image/docker%20常用操作_image_21.png)

![](附件/image/docker%20常用操作_image_22.png)

## 其他操作

### 容器开机自启

设置容器开机自启主要有两步，设置 docker 服务开机自己，以及容器本身自动重启。在 Ubuntu 中设置 docker 自启的命令如下：

```bash
sudo systemctl enable docker.service
```

`docker run` 命令具有参数 `--restart`，用于设置容器的重启策略。

| 策略           | 描述                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| no             | 默认值，不会自动重启。                                                  |
| on-failure     | 因为错误退出就会重启，错误退出指非 0 退出码。                           |
| always         | 停止就会重启。如果是手工停止，则在 Docker daemon 或容器本身重启时启动。 |
| unless-stopped | 类似于 always，除了当容器被停止，它是不会重启的。                       |

已经创建的容器，可以使用 `docker update` 命令来更新它的重启策略：

```bash
docker update --restart always 容器名 
```

### 权限设置

![](附件/image/docker%20常用操作_image_23.png)

刚安装好的 `docker` 在使用时会提示没有权限，必须使用 `sudo` 来执行，解决方法为：

- 添加 `docker` 用户组：`sudo groupadd docker`
- 将当前用户添加进 `docker` 用户组：`sudo gpasswd -a ${USER} docker`
- 重启 `docekr`：`sudo systemctl restart docker`
- 修改 `docker.sock` 文件权限：`sudo chmod a+rw /var/run/docker.sock`

之后再执行命令就不需要添加 `sudo` 了：

![](附件/image/docker%20常用操作_image_24.png)



## 参考资料

- [Docker从入门到实践](https://yeasy.gitbook.io/docker_practice/) 
-  [打不死的小强，让Docker的容器自动重启 - 南瓜慢说官网](https://www.pkslow.com/archives/docker-container-auto-restart)