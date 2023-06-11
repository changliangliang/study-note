---
type: blog
created: 2023-06-10 15:25:52
updated: 2023-06-10 15:25:52
tags: []
categories: [ucore操作系统实验]
status: 未发布
---

> 我们需要在 lab1 中完成 kdebug.c 中函数 print_stackframe 的实现，可以通过函数 print_stackframe 来跟踪函数调用堆栈中记录的返回地址。在如果能够正确实现此函数，可在 lab1 中执行 “make qemu”后，在 qemu 模拟器中得到类似如下的输出：
>
> ……
> ebp:0x00007b28 eip:0x00100992 args:0x00010094 0x00010094 0x00007b58 0x00100096
>     kern/debug/kdebug.c:305: print_stackframe+22
> ebp:0x00007b38 eip:0x00100c79 args:0x00000000 0x00000000 0x00000000 0x00007ba8
>     kern/debug/kmonitor.c:125: mon_backtrace+10
> ebp:0x00007b58 eip:0x00100096 args:0x00000000 0x00007b80 0xffff0000 0x00007b84
>     kern/init/init.c:48: grade_backtrace2+33
> ebp:0x00007b78 eip:0x001000bf args:0x00000000 0xffff0000 0x00007ba4 0x00000029
>     kern/init/init.c:53: grade_backtrace1+38
> ebp:0x00007b98 eip:0x001000dd args:0x00000000 0x00100000 0xffff0000 0x0000001d
>     kern/init/init.c:58: grade_backtrace0+23
> ebp:0x00007bb8 eip:0x00100102 args:0x0010353c 0x00103520 0x00001308 0x00000000
>     kern/init/init.c:63: grade_backtrace+34
> ebp:0x00007be8 eip:0x00100059 args:0x00000000 0x00000000 0x00000000 0x00007c53
>     kern/init/init.c:28: kern_init+88
> ebp:0x00007bf8 eip:0x00007d73 args:0xc031fcfa 0xc08ed88e 0x64e4d08e 0xfa7502a8

根据输出样例，我们可以知道在 `print_stackframe` 要做的的是把遍历当前的函数栈，并打印每个栈中的 `ebp`、`eip` 和函数中的参数。

```c
void
print_stackframe(void) {
     /* LAB1 YOUR CODE : STEP 1 */
     /* (1) call read_ebp() to get the value of ebp. the type is (uint32_t);
      * (2) call read_eip() to get the value of eip. the type is (uint32_t);
      * (3) from 0 .. STACKFRAME_DEPTH
      *    (3.1) printf value of ebp, eip
      *    (3.2) (uint32_t)calling arguments [0..4] = the contents in address (uint32_t)ebp +2 [0..4]
      *    (3.3) cprintf("\n");
      *    (3.4) call print_debuginfo(eip-1) to print the C calling function name and line number, etc.
      *    (3.5) popup a calling stackframe
      *           NOTICE: the calling funciton's return addr eip  = ss:[ebp+4]
      *                   the calling funciton's ebp = ss:[ebp]
      */

    // 读取ebp和eip
    uint32_t ebp = read_ebp(), eip = read_eip();
    
    int i, j;

    // 遍历栈
    for (i = 0; ebp != 0 && i < STACKFRAME_DEPTH; i ++) {
        
        // 打印 ebp eip
        cprintf("ebp:0x%08x eip:0x%08x args:", ebp, eip);
        
        // 打应参数
        uint32_t *args = (uint32_t *)ebp + 2;
        for (j = 0; j < 4; j ++) {
            cprintf("0x%08x ", args[j]);
        }
        cprintf("\n");
        print_debuginfo(eip - 1);

        // 切换栈信息
        eip = ((uint32_t *)ebp)[1];
        ebp = ((uint32_t *)ebp)[0];
    }
}
```
