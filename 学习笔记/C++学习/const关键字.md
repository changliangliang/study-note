---
tag: cplusplus
---

### 定义常量

用 `const` 可以定义常量，常量不允许被修改。

```c++
int main() {
    const int a = 11;
    a = 1;
    return 0;
}
```

```
error: assignment of read-only variable 'a'
```


### 类型检查

`const` 与 `#define` 宏定义的区别： `const` 常量具有类型，编译器可以进行安全检查； `#define` 宏定义的数据只是简单的字符串替换，不能进行安全检查。

const 常量支持所有类型。
其他情况下它只是一个 const 限定的变量，不要将与常量混淆。
防止修改，起保护作用，增加程序健壮性

void f (const int i){
    i++; //error!
}
可以节省空间，避免不必要的内存分配

const 定义常量从汇编的角度来看，只是给出了对应的内存地址，而不是像 #define一样给出的是立即数 。
const 定义的常量在程序运行过程中只有一份拷贝，而 #define定义的常量在内存中有若干个拷贝 。


### const 成员函数
