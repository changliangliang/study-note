---
type: blog
created: 2023-04-19 11:30:13
updated: 2023-04-20 19:07:58
tags: [操作系统]
categories: [ucore操作系统实验]
---

## 练习 1

> 练习 1：理解通过 make 生成执行文件的过程。（要求在报告中写出对下述问题的回答）
> 列出本实验各练习中对应的 OS 原理的知识点，并说明本实验中的实现部分如何对应和体现了原理中的基本概念和关键知识点。
>
> 在此练习中，大家需要通过静态分析代码来了解：
>
> 1. 操作系统镜像文件 ucore. img 是如何一步一步生成的？(需要比较详细地解释 Makefile 中每一条相关命令和命令参数的含义，以及说明命令导致的结果)
> 2. 一个被系统认为是符合规范的硬盘主引导扇区的特征是什么？
>
> 补充材料：
>
> 如何调试 Makefile
>
> 当执行 make 时，一般只会显示输出，不会显示 make 到底执行了哪些命令。
>
> 如想了解 make 执行了哪些命令，可以执行：
>
> $ make "V="
> 要获取更多有关 make 的信息，可上网查询，并请执行
> sdf
> $ man make

### 问题 1：操作系统镜像文件 ucore. img 是如何一步一步生成的？

实验源码的目录结构如下，我们切换到 `ucore_lab/labcodes_answer/lab1_result` 目录下执行两条命令，`make clean` 清除掉上一次生成的文件，`make V=` 编译文件生成镜像。

![](附件/image/ucore操作系统实验：lab1_image_1.png)

![](附件/image/ucore操作系统实验：lab1_image_2.png)

执行 `make V=` 的全部输出如下，它会现实整个过程中执行的所有命令：

```sh
+ cc kern/init/init.c
gcc -Ikern/init/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/init/init.c -o obj/kern/init/init.o
+ cc kern/libs/readline.c
gcc -Ikern/libs/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/libs/readline.c -o obj/kern/libs/readline.o
+ cc kern/libs/stdio.c
gcc -Ikern/libs/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/libs/stdio.c -o obj/kern/libs/stdio.o
+ cc kern/debug/kdebug.c
gcc -Ikern/debug/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/debug/kdebug.c -o obj/kern/debug/kdebug.o
+ cc kern/debug/kmonitor.c
gcc -Ikern/debug/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/debug/kmonitor.c -o obj/kern/debug/kmonitor.o
+ cc kern/debug/panic.c
gcc -Ikern/debug/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/debug/panic.c -o obj/kern/debug/panic.o
+ cc kern/driver/clock.c
gcc -Ikern/driver/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/driver/clock.c -o obj/kern/driver/clock.o
+ cc kern/driver/console.c
gcc -Ikern/driver/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/driver/console.c -o obj/kern/driver/console.o
+ cc kern/driver/intr.c
gcc -Ikern/driver/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/driver/intr.c -o obj/kern/driver/intr.o
+ cc kern/driver/picirq.c
gcc -Ikern/driver/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/driver/picirq.c -o obj/kern/driver/picirq.o
+ cc kern/trap/trap.c
gcc -Ikern/trap/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/trap/trap.c -o obj/kern/trap/trap.o
+ cc kern/trap/trapentry.S
gcc -Ikern/trap/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/trap/trapentry.S -o obj/kern/trap/trapentry.o
+ cc kern/trap/vectors.S
gcc -Ikern/trap/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/trap/vectors.S -o obj/kern/trap/vectors.o
+ cc kern/mm/pmm.c
gcc -Ikern/mm/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/mm/pmm.c -o obj/kern/mm/pmm.o
+ cc libs/printfmt.c
gcc -Ilibs/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/  -c libs/printfmt.c -o obj/libs/printfmt.o
+ cc libs/string.c
gcc -Ilibs/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/  -c libs/string.c -o obj/libs/string.o
+ ld bin/kernel
ld -m    elf_i386 -nostdlib -T tools/kernel.ld -o bin/kernel  obj/kern/init/init.o obj/kern/libs/readline.o obj/kern/libs/stdio.o obj/kern/debug/kdebug.o obj/kern/debug/kmonitor.o obj/kern/debug/panic.o obj/kern/driver/clock.o obj/kern/driver/console.o obj/kern/driver/intr.o obj/kern/driver/picirq.o obj/kern/trap/trap.o obj/kern/trap/trapentry.o obj/kern/trap/vectors.o obj/kern/mm/pmm.o  obj/libs/printfmt.o obj/libs/string.o
+ cc boot/bootasm.S
gcc -Iboot/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Os -nostdinc -c boot/bootasm.S -o obj/boot/bootasm.o
+ cc boot/bootmain.c
gcc -Iboot/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Os -nostdinc -c boot/bootmain.c -o obj/boot/bootmain.o
+ cc tools/sign.c
gcc -Itools/ -g -Wall -O2 -c tools/sign.c -o obj/sign/tools/sign.o
gcc -g -Wall -O2 obj/sign/tools/sign.o -o bin/sign
+ ld bin/bootblock
ld -m    elf_i386 -nostdlib -N -e start -Ttext 0x7C00 obj/boot/bootasm.o obj/boot/bootmain.o -o obj/bootblock.o
'obj/bootblock.out' size: 488 bytes
build 512 bytes boot sector: 'bin/bootblock' success!
dd if=/dev/zero of=bin/ucore.img count=10000
10000+0 records in
10000+0 records out
5120000 bytes (5.1 MB) copied, 0.0234475 s, 218 MB/s
dd if=bin/bootblock of=bin/ucore.img conv=notrunc
1+0 records in
1+0 records out
512 bytes (512 B) copied, 0.000192811 s, 2.7 MB/s
dd if=bin/kernel of=bin/ucore.img seek=1 conv=notrunc
146+1 records in
146+1 records out
74923 bytes (75 kB) copied, 0.000295907 s, 253 MB/s

```

根据上述的输出结果我么可以得知，在镜像生成的整个过程中主要分为三步：

- 编译源码：`gcc` 命令的会对源码进行编译，如下面的命令将 `kern/init/init.c` 编译成目标文件 `obj/kern/init/init.o`：

    ```bash
    + cc kern/init/init.c
    gcc -Ikern/init/ -fno-builtin -Wall -ggdb -m32 -gstabs -nostdinc  -fno-stack-protector -Ilibs/ -Ikern/debug/ -Ikern/driver/ -Ikern/trap/ -Ikern/mm/ -c kern/init/init.c -o obj/kern/init/init.o
    ```

- 生成可执行文件：`ld` 命令将生成的目标文件进行链接生成执行文件，如下面的命令将 `obj/kern` 目录下的目标文件连接生成可执行文件 `bin/kernel`：

    ```bash
    + ld bin/kernel
    ld -m    elf_i386 -nostdlib -T tools/kernel.ld -o bin/kernel  obj/kern/init/init.o obj/kern/libs/readline.o obj/kern/libs/stdio.o obj/kern/debug/kdebug.o obj/kern/debug/kmonitor.o obj/kern/debug/panic.o obj/kern/driver/clock.o obj/kern/driver/console.o obj/kern/driver/intr.o obj/kern/driver/picirq.o obj/kern/trap/trap.o obj/kern/trap/trapentry.o obj/kern/trap/vectors.o obj/kern/mm/pmm.o  obj/libs/printfmt.o obj/libs/string.o
    ```

- 生成镜像文件：`dd` 命令的作用是用指定大小的块拷贝一个文件，并在拷贝的同时进行指定的转换，下面的命令会创建一个 `bin/ucore.img` 文件，并将之前生成的 `bin/bootblock` 和 `bin/kernel` 拷贝到 `bin/ucore.img` 文件中。

    ```bash
    dd if=/dev/zero of=bin/ucore.img count=10000
    10000+0 records in
    10000+0 records out
    5120000 bytes (5.1 MB) copied, 0.0234475 s, 218 MB/s
    dd if=bin/bootblock of=bin/ucore.img conv=notrunc
    1+0 records in
    1+0 records out
    512 bytes (512 B) copied, 0.000192811 s, 2.7 MB/s
    dd if=bin/kernel of=bin/ucore.img seek=1 conv=notrunc
    146+1 records in
    146+1 records out
    74923 bytes (75 kB) copied, 0.000295907 s, 253 MB/s
    ```

### 问题 2：一个被系统认为是符合规范的硬盘主引导扇区的特征是什么？

引导扇区的大小为 512 字节，位于磁盘的第一个扇区，但是不是所有的磁盘都装有操作系统，所以统一规定将这 512 个字节的最后两个字节设置为标志位，取固定值 `0x55` 和 `0xAA`。

![](附件/image/ucore操作系统实验：lab1_image_3.png)

从实验文档中可以得知，`bin/sign` 是用来生硬盘主引导扇区的程序, 它的源码位于 `tools/sigh.c` ,内容如下：

![](附件/image/ucore操作系统实验：lab1_image_4.png)

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <sys/stat.h>

int
main(int argc, char *argv[]) {
    struct stat st;
    if (argc != 3) {
        fprintf(stderr, "Usage: <input filename> <output filename>\n");
        return -1;
    }
    if (stat(argv[1], &st) != 0) {
        fprintf(stderr, "Error opening file '%s': %s\n", argv[1], strerror(errno));
        return -1;
    }
    printf("'%s' size: %lld bytes\n", argv[1], (long long)st.st_size);
    if (st.st_size > 510) {
        fprintf(stderr, "%lld >> 510!!\n", (long long)st.st_size);
        return -1;
    }
    char buf[512];
    memset(buf, 0, sizeof(buf));
    FILE *ifp = fopen(argv[1], "rb");
    int size = fread(buf, 1, st.st_size, ifp);
    if (size != st.st_size) {
        fprintf(stderr, "read '%s' error, size is %d.\n", argv[1], size);
        return -1;
    }
    fclose(ifp);
    buf[510] = 0x55;
    buf[511] = 0xAA;
    FILE *ofp = fopen(argv[2], "wb+");
    size = fwrite(buf, 1, 512, ofp);
    if (size != 512) {
        fprintf(stderr, "write '%s' error, size is %d.\n", argv[2], size);
        return -1;
    }
    fclose(ofp);
    printf("build 512 bytes boot sector: '%s' success!\n", argv[2]);
    return 0;
}
```

从源码中可以看到将 512 个字节数据中的最后两个字节分别设置为了 `0x55` 和 `0xAA`。

```c
buf[510] = 0x55;
buf[511] = 0xAA;
```

## 练习 2

> 为了熟悉使用 qemu 和 gdb 进行的调试工作，我们进行如下的小练习：
>
> - 从 CPU 加电后执行的第一条指令开始，单步跟踪 BIOS 的执行。
> - 在初始化位置 0 x 7 c 00 设置实地址断点, 测试断点正常。
> - 从 0 x 7 c 00 开始跟踪代码运行, 将单步跟踪反汇编得到的代码与 bootasm. S 和 bootblock. asm 进行比较。
> - 自己找一个 bootloader 或内核中的代码位置，设置断点并进行测试。
>
> 提示：参考附录“启动后第一条执行的指令”，可了解更详细的解释，以及如何单步调试和查看 BIOS 代码。
>
> 提示：查看 labcodes_answer/lab 1_result/tools/lab 1 init 文件，用如下命令试试如何调试 bootloader 第一条指令：
>
>  $ cd labcodes_answer/lab 1_result/
>  $ make lab 1-mon

### 问题 1：从 CPU 加电后执行的第一条指令开始，单步跟踪 BIOS 的执行

在项目目录下执行 `make gdb` 命令，可以看到启动了一个 `QEMU` 虚拟机，此时它正等待着 `gdb` 远程连接。

![](附件/image/ucore操作系统实验：lab1_image_5.png)

接下来使用 `gdb` 命令进行调试，输入 `set architecture i8086` 设置当前调试的机器为 `i8086`，输入 `target remote : 1234` 连接到 `QEMU`。

![](附件/image/ucore操作系统实验：lab1_image_6.png)

此时输入 `si` 则会开始执行一条命令。

![](附件/image/ucore操作系统实验：lab1_image_7.png)

### 问题 2：在初始化位置 0x7c00 设置实地址断点, 测试断点正常

每次进行调试时都进行连接是比较麻烦的，可以将一些前置命令放在一个文件里，如下面的文件 `gdbinit`，每次使用 `gdb -x gdbinit` 命令启动 `gdb`，那么文件 `gdbinit` 中所用的命令都会被执行，之后都通过这种方式来执行。

![](附件/image/ucore操作系统实验：lab1_image_8.png)

![](附件/image/ucore操作系统实验：lab1_image_9.png)

在 `gdbinit` 文件中输入如下内容，再次进行调试：

```int
set architecture i8086
target remote:1234
b *0x7c00 #设置点
c     
x/10i $pc #显示汇编指令
```

![](附件/image/ucore操作系统实验：lab1_image_10.png)

### 问题 3：从 0x7c00 开始跟踪代码运行，将单步跟踪反汇编得到的代码与 bootasm.S 和 bootblock.asm 进行比较

`bootasm.S` 和 `bootblock.asm` 中的内容如下，比较可知两者与 `0x7c00` 处的指令基本一致。

![](附件/image/ucore操作系统实验：lab1_image_11.png)

![](附件/image/ucore操作系统实验：lab1_image_12.png)

### 问题 4：自己找一个 bootloader 或内核中的代码位置，设置断点并进行测试

这里选择使用 `kern/init/init.c` 中的 `kern_init` 函数作为断点：

![](附件/image/ucore操作系统实验：lab1_image_13.png)

将 `gdbinit` 文件修改为：

```init
set architecture i8086
file bin/kernel
target remote:1234
b kern_init #设置点
c     
x/10i $pc #显示汇编指令
```

获得断点处的指令如下：

![](附件/image/ucore操作系统实验：lab1_image_14.png)

如果执行命令的时候使用 `gdb -x gdbinit -tui`，甚至可以打开一个 `gdb` 的命令行界面，直接现实断点处的源码文件。

![](附件/image/ucore操作系统实验：lab1_image_15.png)

## 练习 3

> BIOS 将通过读取硬盘主引导扇区到内存，并转跳到对应内存中的位置执行 bootloader。请分析 bootloader 是如何完成从实模式进入保护模式的。
> 
> 提示：需要阅读小节“保护模式和分段机制”和 lab1/boot/bootasm.S 源码，了解如何从实模式切换到保护模式，需要了解：
> 
> - 为何开启 A20，以及如何开启 A20
> - 如何初始化 GDT 表
> - 如何使能和进入保护模式

### 问题 1：为何开启 A20，以及如何开启 A20

当 A20 处于关闭状态时，第 21 一根地址总线的值总是 0，会导致只能访问到 `0-1M`, `2-3M`, `4-5M` 等奇数内存，所以想要访问完整的内存空间，必须开启 A20。

根据提示阅读 `lab1/boot/bootasm.S`，其中开启 A20 的代码如下，在 `ucore` 实验中通过控制键盘控制器实现 A20 的开启。

```asm
seta20.1:
    inb $0x64, %al           # 从0x64端口读取键盘控制器状态到al寄存器中
    testb $0x2, %al          # 判断al寄存器第2为是否为1，如果是执行下一条指令
    jnz seta20.1             # 跳转到seta20.1重新执行

    movb $0xd1, %al          # 设置al寄存器的值为 0xd1
    outb %al, $0x64          # 将al中的值写入0x64端口

seta20.2:
    inb $0x64, %al            # 从0x64端口读取键盘控制器状态到al寄存器中
    testb $0x2, %al           # 判断al寄存器第2为是否为1，如果是执行下一条指令
    jnz seta20.2              # 跳转到seta20.2重新执行

    movb $0xdf, %al           # 设置al寄存器的值为 0xdf
    outb %al, $0x60           # 将al中的值写入0x60端口
```

所以开启 A20 的整个步骤为：
- 向键盘控制器的 `0x64` 端口发送的命令 `0xd1`，即代码段 `seta20.1` 完成的工作；
- 向键盘控制器的 `0x60` 端口发送的命令 `0xdf`，即代码段 `seta20.2` 完成的工作；


### 问题 2：如何初始化 GDT 表

 `lab1/boot/bootasm.S` 文件尾部定义 `GDT` 表，代码如下：

```asm
# Bootstrap GDT
.p2align 2                                  # force 4 byte alignment
gdt:
    SEG_NULLASM                             # null seg
    SEG_ASM(STA_X|STA_R, 0x0, 0xffffffff)   # code seg for bootloader and kernel
    SEG_ASM(STA_W, 0x0, 0xffffffff)         # data seg for bootloader and kernel

gdtdesc:
    .word 0x17                              # sizeof(gdt) - 1
    .long gdt                               # address gdt
```

其中 `gdtdesc` 记录了 `gdt` 表的长度以及所在的位置，在 `lab1/boot/bootasm.S` 中有这么一条指令，它的作用是将 `gdtdesc` 处的数据读取到全局描述符表寄存器 `GDTR`，这是一个长度为 48 位的寄存器，计算机根据 `GDTR` 可以知道全局描述符表所在的位置上和长度。

```asm
lgdt gdtdesc
```

### 问题 3：如何使能和进入保护模式

![](附件/image/ucore操作系统实验：lab1_image_16.png)

在 CPU 中有一个 `CR0` 寄存器，包含了6个预定义标志，第 0 位是保护允许位 PE ( Protedted Enable )，用于启动保护模式，如果 PE 位置 1，则保护模式启动，如果 PE=0，则在实模式下运行。所以启动保护模式只需要将 `CR0` 寄存器第 0

打开保护模式标志位，相当于按下了保护模式的开关。cr0寄存器的第0位就是这个开关，通过CR0_PE_ON或cr0寄存器，将第0位置1

```asm
movl %cr0, %eax
orl $CR0_PE_ON, %eax
movl %eax, %cr0
```

## 参考资料

- [Lab\_1：练习1——理解通过make生成执行文件的过程 - chuyaoxin - 博客园](https://www.cnblogs.com/cyx-b/p/11750020.html)
