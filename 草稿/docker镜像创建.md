### 创建镜像

`docker` 中创建镜像是通过 `Dockerfile` 文件进行的，它是一个文本文件，其内包含了一条条的 **指令 (Instruction)**，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建，下面显示的就是一个具有两条指令的 `Dockerfile` 文件。

```dockerfile
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

#### FROM

该指令用于指定一个基础镜像，所有的镜像创建时第一条指令必须是 `FROM`，如果不需要使用任何基础镜像，可以使用 `scratch`，它是一个虚拟概念，表示空白镜像。

```dockerfile
FROM scratch
```

#### RUN

该指令用于执行命令，是定制镜像时是最常用的指令之一，有两种形式：

- shell 形式

  ```dockerfile
  RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
  ```

- exec 形式

  ```dockerfile
  RUN ["可执行文件", "参数1", "参数2"]
  ```

每一条指令都会提交一层镜像，`RUN` 指令也是，所以下面这样的写法会引入大量无用的内容，如程序构建过程的中间内容，对于镜像来说是完全无用的，所以应该一次性讲这些内容写完。

```dockerfile
FROM debian:stretch

RUN apt-get update
RUN apt-get install -y gcc libc6-dev make wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN mkdir -p /usr/src/redis
RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
RUN make -C /usr/src/redis
RUN make -C /usr/src/redis install

```

```dockerfile
FROM debian:stretch

RUN set -x; buildDeps='gcc libc6-dev make wget' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && make -C /usr/src/redis \
    && make -C /usr/src/redis install \
    && rm -rf /var/lib/apt/lists/* \
    && rm redis.tar.gz \
    && rm -r /usr/src/redis \
    && apt-get purge -y --auto-remove $buildDeps

```

#### COPY

该指令用于将上下文中的文件复制到镜像中，其中源文件可以指定多个。

```dockerfile
COPY package.json /usr/src/app/
```

还可指定文件的所属用户和用户组以及使用通配符。

```dockerfile
COPY --chown=55:mygroup files* /mydir/
COPY --chown=bin files* /mydir/
COPY --chown=1 files* /mydir/
COPY --chown=10:11 files* /mydir/
```

#### ADD

在 `COPY` 指令上添加了一些功能，但不推荐使用。

#### CMD

`CMD` 指令的格式和 `RUN` 相似，同时也有两种形式。`Docker` 不是虚拟机，容器就是进程。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。`CMD` 指令就是用于指定默认的容器主进程的启动命令的，在运行容器是可以指定其他命令进行替换。`CMD` 中推荐使用 `exec` 形式，`shell` 形式的命令 `CMD service nginx start` 最终被解析为 `CMD [ "sh", "-c", "service nginx start"]`。

#### ENTRYPOINT

`ENTRYPOINT` 的目的和 `CMD` 一样，都是在指定容器启动程序及参数。`ENTRYPOINT` 在运行时也可以替代，不过比 `CMD` 要略显繁琐，需要通过 `docker run` 的参数 `--entrypoint` 来指定。当指定了 `ENTRYPOINT` 后，`CMD` 的含义就发生了改变，不再是直接的运行其命令，而是将 `CMD` 的内容作为参数传给 `ENTRYPOINT` 指令。

#### ENV

用于设置环境变量，之后的命令中都可以使用。

```dockerfile
ENV VERSION=1.0 DEBUG=on \
    NAME="Happy Feet"
```

#### AEG

和 `ENV` 类似，用于指定环境变量，不同之处在于变量只存在于构建镜像阶段，在容器运行后是不存在的。

```dockerfile
# 只在 FROM 中生效
ARG DOCKER_USERNAME=library

FROM ${DOCKER_USERNAME}/alpine

# 要想在 FROM 之后使用，必须再次指定
ARG DOCKER_USERNAME=library

RUN set -x ; echo ${DOCKER_USERNAME}
```

#### VOLUME 

定义容器匿名卷。

```dockerfile
VOLUME ["<路径1>", "<路径2>"...]
```

#### EXPOSE

声明容器打算暴露什么借口，它并不会真的去暴露这个端口。

```dockerfile
EXPOSE <端口1> [<端口2>...]
```

#### WORKDIR

改变之后各个指令执行的工作目录

```dockerfile
WORKDIR /app

RUN echo "hello" > world.txt
```

#### USER

切换用户或用户组，不会自动创建用户或用户组，所以使用前必须提前创建。

```dockerfile
RUN groupadd -r redis && useradd -r -g redis redis
USER redis
RUN [ "redis-server" ]
```

#### HEALTHCHECK

`HEALTHCHECK` 支持下列选项：

- `--interval=<间隔>`：两次健康检查的间隔，默认为 30 秒；
- `--timeout=<时长>`：健康检查命令运行超时时间，如果超过这个时间，本次健康检查就被视为失败，默认 30 秒；
- `--retries=<次数>`：当连续失败指定次数后，则将容器状态视为 `unhealthy`，默认 3 次。

和 `CMD`, `ENTRYPOINT` 一样，`HEALTHCHECK` 只可以出现一次，如果写了多个，只有最后一个生效。

在 `HEALTHCHECK [选项] CMD` 后面的命令，格式和 `ENTRYPOINT` 一样，分为 `shell` 格式，和 `exec` 格式。命令的返回值决定了该次健康检查的成功与否：`0`：成功；`1`：失败；`2`：保留，不要使用这个值。

假设我们有个镜像是个最简单的 Web 服务，我们希望增加健康检查来判断其 Web 服务是否在正常工作，我们可以用 `curl` 来帮助判断，其 `Dockerfile` 的 `HEALTHCHECK` 可以这么写：

```dockerfile
FROM nginx
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
HEALTHCHECK --interval=5s --timeout=3s \
  CMD curl -fs http://localhost/ || exit 1
```

#### LABEL

添加一些元数据

```dockerfile
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```



#### 构建镜像

```sh
$ docker build [选项] <上下文路径/URL/->
```

```sh
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
Step 1 : FROM nginx
 ---> e43d811ce2f4
Step 2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 9cdc27646c7b
 ---> 44aa4490ce2c
Removing intermediate container 9cdc27646c7b
Successfully built 44aa4490ce2c

```

上下文路径指明需要传给 `docker` 引擎的内容。