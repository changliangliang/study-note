---
---

通常情况下创建对象时都会使用一个引用指向它，但是程序中可能有成千上万个对象，不可能给每个对象显示的创建一个引用。

```java
String str = new String("chang")
```

Java 中提供的解决方案时可以将对象存放到数组，不过数组的缺点在于它的大小是固定的，一旦容量确定后就不可以改变了，同时功能比较单一，无法实现 hash 映射之类的特殊功能，于是又出现了大量功能丰富的容器，如 `HashMap`、`ArrayList` 等。

```java
public class Main {  
  
    public static void main(String[] args) {  
  
        ArrayList arrayList = new ArrayList();  
  
        for(int i = 0; i < 1000000; i++) {  
            Data data = new Data();  
            data.set(i);  
            arrayList.add(data);  
        }  
  
        arrayList.forEach(new Consumer() {  
            @Override  
            public void accept(Object o) {  
                Data data = (Data) o;  
                System.out.println(data.get());  
            }  
        });  
    }  
}
```

Java 中的容器可以分为 `Collection` 和 `Map` 两类，其中 `Collection` 表示独立的元素序列，`Map` 存储的是 `key-value` 这样的键值对关系。

![](附件/image/Java容器_image_1.png)

## 迭代器

迭代器时遍历容器中元素的一种工具，目的是让使用者能够用同样的方法遍历不同的容器。

![](附件/image/Java内部类_image_1.png)

上图是 `ArrayList` 中定义迭代器，它是一个内部类，实现了了 `Iterator` 接口，其他容器总的迭代器也是如此。不同的容器根据自己不同内部结构各自实现了自己的迭代器，但是所有的迭代器在使用时都是一样：

- 通过调用容器的 `iterator()` 方法可以获取容器对应的迭代器；
- 迭代器的 `hasNext()` 方法用于判断是由还有元素；
- 迭代器的 `next()` 方法用于获取当前元素；
- 迭代器的 `remove()` 方法用于移除当前元素。

```java
public class Main {  
  
    public static void main(String[] args) {  
  
        ArrayList arrayList = new ArrayList();  
  
        for(int i = 0; i < 1000000; i++) {  
            Data data = new Data();  
            data.set(i);  
            arrayList.add(data);  
        }  
  
  
        Iterator iterator = arrayList.iterator();  
  
        while (iterator.hasNext()) {  
            Object next = iterator.next();  
            System.out.println(next);  
            iterator.remove();  
        }  
    }  
}
```

![](附件/image/Java容器_image_3.png)
