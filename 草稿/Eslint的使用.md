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

`env` 用于定义系统的环境，一个环境定义了一组预定义的全局变量，如 ` browser ` 定义了浏览器环境中的全局变量，`node` 定义了 `nodejs` 中的全局变量，其他可用的选项见 [官方文档](https://eslint.org/docs/latest/use/configure/language-options#specifying-environments)。

### plugins

Eslint 支持使用第三方插件，可以通过 `npm` 来安装这些插件，它们的主要作用是提供一些 Eslint 中不存在的系统环境或者规则。在配置文件里配置插件时，可以使用 ` plugins ` 关键字来存放插件名字的列表，插件名称可以省略 `eslint-plugin-` 前缀。

```js
module.exports = {
  plugins: [
    "plugin1",
    "eslint-plugin-plugin2"
  ],
  env: {
    browser: true,
    es2021: true,
    "plugin1/custom": true
  }
}
```

### gloabals

当访问当前源文件内未定义的变量时，`no-undef` 规则将发出警告，如果想要在一个源文件里使用全局变量，可以在 `eslint` 中定义这些全局变量，这样就不会发出警告了。

```js
module.exports = {
  globals: {
    "var1": "readonly"
  },
  env: {
    browser: true,
    es2021: true,
  }
}
```

对于每个全局变量，可以将对应的值设置为 `writable` 允许重写变量，或 `readonly` 不允许重写变量，还可以使用字符串 `off` 禁用全局变量，注意在使用 `readonly` 时需要启用 `​no-global-assign` 规则来禁止对只读的全局变量进行修改，通常情况下该规则都是启动的。

### paserOptions

解析器的作用是将 `javascrpit` 源码转化为抽象语法树，以便于后续的处理，`eslint` 默认的解析器为 `espree`，此外还可以使用第三方提供的解析器。

```js
module.exports = {

  env: {
    browser: true,
    es2021: true,
  },
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
```

解析器选项使用 `parserOptions` 属性设置，可用的选项有：

* `ecmaVersion`：默认设置为 3，5（默认），可以使用 6~14 来指定你想要使用的 ECMAScript 版本，也可以用使用年份命名的版本号指定为 2015，2016 之类的。
* `sourceType`：设置为 `"script"` (默认) 或 `"module"`；
* `allowReserved`：是否允许使用保留字作为关键字（`ecmaVersion` 需为 13）；
* `ecmaFeatures` 这是个对象，表示你想使用的额外的语言特性，可设置如下属性：
  * `globalReturn`：允许在全局作用域下使用 `return` 语句；
  * `impliedStrict`：启用全局 严格模式；
  * `jsx`：启用 JSX；

需要注意的一点是，对于 `ES6` 语法的支持需要使用 `{ "parserOptions": { "ecmaVersion": 6 } }` 开启，但是此时对 `ES6` 中的全局变量是不支持的，还需要配置 `{ "env":{ "es6": true } }`。另外，也可以直接配置 `{ "env": { "es6": true } }`，它会会自动启用对 `ES6` 语法的支持。

### rules

Eslint 附带有大量的规则，我们可以使用注释或配置文件修改项目中要使用的规则, 这些规则的取值可以为

* `off` 或 `0`：不开启该规则；
* `warn` 或 `1`：违反该规则触发警告；
* `error` 或 `2`：违反该规则触发错误；

```js
module.exports = {

  env: {
    browser: true,
    es2021: true,
  },
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    eqeqeq: "off",
    curly: "error",
  }
}
```

同环境一样，Eslint 可以使用定义在插件中的规则，使用时必须为 `插件名/规则ID` 的形式。

```json
{
    "plugins": [
        "plugin1"
    ],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": [
            "error",
            "double"
        ],
        "plugin1/rule1": "error"
    }
}
```

### overrides

如果想要将更改部分文件的检查规则，可以配置 `overrides` 项实现，所有 `files` 匹配到的文件都会适用对应的 `rules`。

```js
module.exports = {
  overrides: [
    {
      "files": ["*-test.js", "*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```

### ignorePatterns

`ignorePatterns` 用于设置哪些文件不会被 Eslint 检查

```js
module.exports = {
  overrides: [
    {
      "files": ["*-test.js", "*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],

  ignorePatterns: ["temp.js", "**/vendor/*.js"],
}
```

### extents

`extends` 属性用来拓展配置文件，例如以下两个配置文件，B 在 A 的基础上进行拓展：

```json
// 配置文件A
{
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {},
    "rules": {
        "quotes": [
            "error",
            "single"
        ]
    }
}
```

```json
// 配置文件B
{
    "env": {
        "node": false
    },
    "extends": [
        "A"
    ],
    "rules": {
        "quotes": [
            "warn",
            "single"
        ]
    }
}
```

```json
// 等效于B的配置文件
{
    "env": {
        "browser": true,
        "es6": true,
        "node": false
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {},
    "rules": {
        "quotes": [
            "warn",
            "single"
        ]
    }
}
```

### root

子配置文件会向上继承父文件夹中的配置文件，直到遇到 `root` 选项为 `true` 的配置文件，子配置文件会覆盖父配置文件中相同的选项。

```js
module.exports = {
  root: true,
  overrides: [
    {
      "files": ["*-test.js", "*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],

  ignorePatterns: ["temp.js", "**/vendor/*.js"],
}
```
