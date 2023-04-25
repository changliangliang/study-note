---
type: blog
created: 2022-06-19 09:36:12
updated: 2022-06-19 09:36:18
tags: [javascript, npm]
categories: []
---

## 默认管理方式

安装完 node 之后，默认的原始源是：

```
https://registry.npmjs.org/
```

在使用 `npm` 命令安装包的时候，可以使用 `--registry` 选项指定源：

```
//本次从淘宝仓库源下载
npm --registry=https://registry.npm.taobao.org install
```

每次使用命令行时都手动指定源比较麻烦，所以 `npm` 提供了配置命令用来设置源，配置的源有多个，但只有一个是生效的：

```
//设置淘宝源
npm config set registry https://registry.npm.taobao.org

//设置公司的源
npm config set registry http://127.0.0.1:4873

//查看源，可以看到设置过的所有的源
npm config get registry
```

也可以修改 `~/.npmrc`，添加源的设置：

```
registry = https://registry.npm.taobao.org
```

## 使用 nrm 管理源

 `nrm ​` 是一个 NPM 源管理器，可以使用 `​ nrm` 在不同的源切换。

```shell
// 安装nrm
npm install -g nrm

// 列出当前所有源
nrm ls
```

`nrm ls` 命令的输出结果如下，其中带 `*` 的是当前使用的源。

```
* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
```

如果想要切花源，比如切换到 taobao，可以使用如下命令：

```
nrm use taobao
```

可以增加定制的源，命令如下：

```
nrm add  <registry> <url> [home]
```

可以删除指定的源，命令如下：

```
nrm del <registry>
```

还可以通过 `nrm test ​` 测试相应源的响应时间。

```
nrm test npm 
```
