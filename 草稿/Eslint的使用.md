---
type: note
created: 2023-05-05 17:36:44
updated: 2023-05-05 17:36:44
tags: []
categories: []
---

![](附件/image/Eslint的使用_image_1.png)

Eslint 是一个 js 代码检查工具，可以用来避免低级的语法错误以及统一代码风格。

## 安装

### 自动安装并配置

```
npm init @eslint/config
```

执行上述命令就能进入到 Eslint 的配置程序，我们可以根据自己的需求选择选项，选择完成之后会自动安装 Eslint 并根据我们的回答生成配置文件。

![](附件/image/Eslint的使用_image_2.png)

之后就可以通过 `npx eslint` 命令来检查我们的代码了，可以检查单一的文件也可以直接检查一个文件夹。

![](附件/image/Eslint的使用_image_3.png)

![](附件/image/Eslint的使用_image_4.png)

### 手动安装并配置

除了自动安装配置 Eslint 外，还可以选择手动安装：

```
npm install --save-dev eslint
```

之后需要在项目目录下创建一个 Eslint 的配置文件，如下面的 `.eslintrc.js` 文件。

```js
// .eslintrc.js example
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
```

## 配置文件

根据 Eslint 官方文档，它支持多种形式的文件配置，默认的文件名和优先级如下：

1. `.eslintrc.js`
2. `.eslintrc.cjs`
3. `.eslintrc.yaml`
4. `.eslintrc.yml`
5. `.eslintrc.json`
6. `.eslintrc`
7. `package.json`

这里以 `.eslintrc.js` 为例对 Eslint 的配置文件进行讲解，它的大致形式如下：

```js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}

```

### env

`env` 用于定义系统的环境，一个环境定义了一组预定义的全局变量，如 ` browser ` 定义了浏览器环境中的全局变量，`node` 定义了 `nodejs` 中的全局变量，其他可用的选项见[官方文档](https://eslint.org/docs/latest/use/configure/language-options#specifying-environments) 。

