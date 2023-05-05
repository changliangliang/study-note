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
