---
type: note
created: 2023-05-21 09:26:53
updated: 2023-05-21 09:26:53
tags:
categories: 
---



`static` 关键字用来修饰静态变量

当变量声明为static时，空间将在程序的生命周期内分配。即使多次调用该函数，静态变量的空间也只分配一次，前一次调用中的变量值通过下一次函数调用传递。这对于在C / C ++或需要存储先前函数状态的任何其他应用程序非常有用。


```c++
#include <iostream>
using namespace std;

int staticFun()
{
    static int count = 0;
    count++;
    return count;
}

int main()
{
    for (int i = 0; i < 5; i++)
    {
        cout << staticFun() << endl;
    }
    return 0;
}
```


```c++
1
2
3
4
5
```
