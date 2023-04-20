
---
type: blog
status: 未发布
created: 2022-01-13 9:34:37
updated: 2023-01-13 9:34:37
tags: vscode 工具
categories: vscode配置 
---


在使用 vscode 编写项目的时候，有时候能看到一个名为 `.vscode` 的文件夹，这个文件夹中保存的就是跟 vscode 相关的配置文件，需要注意的是该配置文件仅对当前项目有效。其中 `task.json` 和 `launch.json` 是两个比较重要的文件，前者主要用于生成程序（如使用 `gcc` 命令编译源码），后者用于程序的调试。

### task. json

![](附件/VScode中的task.json和launch.json_image_1.png)

在 `task.json` 文件中写入如下内容：

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "build",
            "command": "D:\\scoop\\apps\\mingw\\current\\bin\\gcc.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        },
    ],
    "version": "2.0.0"
}
```

点击 `终端->运行任务->build`，vscode 将会读取上述配置文件，并根据配置文件编译当前打开的文件，如 `main.c`。

![](附件/VScode中的task.json和launch.json_image_2.png)

![](附件/VScode中的task.json和launch.json_image_3.png)

从终端输出的结果可以看到任务 `build` 执行了，并且可以看到实际执行的命令。

![](附件/VScode中的task.json和launch.json_image_4.png)

`task.json` 更详细的参数介绍, 可查看：[Tasks in Visual Studio Code](https://code.visualstudio.com/docs/editor/tasks)

### launch. json

`launch.json` 可以配置调试相关的信息，我们在该文件中配置三个不同的调试配置，那么在 vscode 调试界面则可以看到我们配置。

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "js 调试",
            "program": "${workspaceFolder}/${fileBasename}",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        },

        {
            "name": "python 调试",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "c 调试",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceFolder}/${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "miDebuggerPath": "gdb",
        }
    ]
}
```

![](附件/VScode中的task.json和launch.json_image_5.png)

使用 `c 调试` 则可以用来调试 `cdebug.c` 程序 ，`python调试` 能用来调试 `pydebug.py` 程序。

![](附件/VScode中的task.json和launch.json_image_6.png)

![](附件/VScode中的task.json和launch.json_image_7.png)

`launch.json` 更详细的参数介绍可查看：[Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)