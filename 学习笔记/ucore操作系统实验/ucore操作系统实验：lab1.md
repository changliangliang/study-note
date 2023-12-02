---
type: blog
created: 2023-04-19 11:30:13
updated: 2023-04-20 19:07:58
tags: [操作系统]
categories: [ucore操作系统实验]
---

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

根据提示阅读 `lab1/boot/bootasm.S`（[ucore实验：bootasm.S源码](学习笔记/ucore操作系统实验/ucore实验：bootasm.S源码.md)），其中开启 A20 的代码如下，在 `ucore` 实验中通过控制键盘控制器实现 A20 的开启。

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

![](附件/image/ucore操作系统实验：lab1_image_1.png)

在 CPU 中有一个 `CR0` 寄存器，包含了 6 个预定义标志，第 0 位是保护允许位 PE ( Protedted Enable )，用于启动保护模式，如果 PE 位置 1，则保护模式启动，如果 PE=0，则在实模式下运行。所以启动保护模式只需要将 `CR0` 寄存器第 0 位设为 1 即可，相关代码如下：

```asm
movl %cr0, %eax
orl $CR0_PE_ON, %eax
movl %eax, %cr0
```

## 练习 4

> 通过阅读 bootmain.c，了解 bootloader 如何加载 ELF 文件。通过分析源代码和通过 qemu 来运行并调试 bootloader&OS，
>
> - bootloader 如何读取硬盘扇区的？
> - bootloader 是如何加载 ELF 格式的 OS？

### 问题 1：bootloader 如何读取硬盘扇区的

`bootmain.c` 中有如下代码片段，作用就是从磁盘中读取扇区，整个流程大致为：

- 等待磁盘准备好
- 发出读取扇区的命令
- 等待磁盘准备好
- 把磁盘扇区数据读到指定内存

```c

// 不断的读取磁盘状态，等待磁盘准备好
static void waitdisk(void)
{
    while ((inb(0x1F7) & 0xC0) != 0x40)
}

// 读取secno处一个扇区到dst处
static void readsect(void *dst, uint32_t secno)
{
    // 等待磁盘准备好
    waitdisk();

    // 像磁盘中的寄存器写入要读取的扇区总数，这里始终为1
    outb(0x1F2, 1);

    // 写入secno
    outb(0x1F3, secno & 0xFF);
    outb(0x1F4, (secno >> 8) & 0xFF);
    outb(0x1F5, (secno >> 16) & 0xFF);
    outb(0x1F6, ((secno >> 24) & 0xF) | 0xE0);

    // 发起读命令
    outb(0x1F7, 0x20); // cmd 0x20 - read sectors

    // 等待磁盘准备好
    waitdisk();

    // 读取数据
    insl(0x1F0, dst, SECTSIZE / 4);
}
```

### 问题 2：bootloader 是如何加载 ELF 格式的 OS

下面是 `bootloader` 中加载 os 的代码，主要步骤是将 ELF 文件头部读到内存中，根据头部获取其他段的位置和长度，并读取到内存指定位置，之后开始执行入口函数，操作系统正式被运行起来。

```c
void bootmain(void)
{
    // 将操作系统第一页读取到内存中，位置在ELFHDR处,
    // SECTSIZE * 8 其中 SECTSIZE 大小为512字节一个扇区，8个扇区组成一页
    readseg((uintptr_t)ELFHDR, SECTSIZE * 8, 0);

    // 判断读取到的数据是否为一个合法的ELF，主要根据ELF头部判断
    if (ELFHDR->e_magic != ELF_MAGIC)
    {
        goto bad;
    }

    struct proghdr *ph, *eph;

    // 根据ELF头部的信息，将剩余部分读到内存中
    ph = (struct proghdr *)((uintptr_t)ELFHDR + ELFHDR->e_phoff);
    eph = ph + ELFHDR->e_phnum;
    for (; ph < eph; ph++)
    {
        readseg(ph->p_va & 0xFFFFFF, ph->p_memsz, ph->p_offset);
    }

    // 根据ELF头部信息，执行入口函数
    ((void (*)(void))(ELFHDR->e_entry & 0xFFFFFF))();

bad:
    outw(0x8A00, 0x8A00);
    outw(0x8A00, 0x8E00);

    /* do nothing */
    while (1)
        ;
}
```

[ucore操作系统实验-lab1-练习5](学习笔记/ucore操作系统实验/ucore操作系统实验-lab1-练习5.md)

## 参考资料

- [Lab\_1：练习1——理解通过make生成执行文件的过程 - chuyaoxin - 博客园](https://www.cnblogs.com/cyx-b/p/11750020.html)
- [Lab1：练习3——分析bootloader进入保护模式的过程 - huilinmumu - 博客园](https://www.cnblogs.com/huilinmumu/p/16217843.html)
- [保护模式和分段机制 · ucore\_os\_docs](https://chyyuu.gitbooks.io/ucore_os_docs/content/lab1/lab1_3_2_1_protection_mode.html)
