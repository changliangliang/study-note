---
type: note
created: 2023-05-06 18:39:45
updated: 2023-05-06 18:39:45
tags:
categories: 
---

Eslint 本身是一个命令行工具，它只能在终端中使用，最终的检查结果也只在终端中显示。因此，每次修改完源码文件后，我们都需要手动在终端中敲入命令，并且根据 Eslint 的输出结果自己去找出源码中出错的地方。

![](附件/image/vscode插件之Eslint_image_1.png)

Eslint 插件的主要作用是在 vscode 编辑器中直接显示错误提示，免去我们自己寻找出错位置的麻烦。插件本身并没有代码检测的功能，它是通过调用 Eslint 实现这个功能的，有限适用的是当前工作目录下安装的 Eslint，如果没有找到会调用全局安装的 Eslint。

![](附件/image/vscode插件之Eslint_image_2.png)

Eslint 插件支持的配置的选项比较多，大部分保持默认即可，详细内容可以查看 [Eslint插件官方文档](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) ，下面的内容是我自己使用时的配置：

```json
//***************************************
//* vscode设置
//*************************************** 
  
//! 关闭vscode全局保存时格式化的配置
//! 如果需要使用自动格式化，需要针对不同的文件独立设置
"editor.formatOnSave": false,

//***************************************
//* javascript相关配置
//***************************************
// 使用eslint提供的代码修复功能, 在文件保存是根据eslint配置的规则自动格式化代码。
"[javascript]": {
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
},

//***************************************
//* eslint 相关配置
//***************************************

// 启动eslint
"eslint.enable": true, 
// 关闭eslint提供的格式化器
"eslint.format.enable": false,
  
// 将eslint添加到检查范围
"eslint.validate": [
    "javascript",
  
]
```

