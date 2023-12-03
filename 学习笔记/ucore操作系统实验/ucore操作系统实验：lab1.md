---
type: blog
created: 2023-04-19 11:30:13
updated: 2023-04-20 19:07:58
tags: [操作系统]
categories: [ucore操作系统实验]
---

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
