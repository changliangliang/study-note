---
---

## 内部类

Java 中类的定义可以写在其他类内部，这样的类就叫做内部类。

```java
public class Outer {  

    public class Inner {   
    }  
}
```

### 创建

内部类前也可以使用 `public` 等访问控制符修饰，用来控制外界对内部类的访问。需要注意的是，内部类必须通过外部类的实例来访问，所以创建内部类实例的过程如下：

```java
Outer o = new Outer();
Outer.Inner  i = o.nwe Inner();
```

当然如果是在外类自己的作用域内创建实例的话就不需要这么麻烦了，和普通类的创建过程是一样的。

### 访问外部类

内部类拥有外部类中所有属性和方法的访问权限，所以通过内部类可以很轻松的修改外部类中的数据，如在 Java 中的 `ArrayList`，它的迭代器就是一个内部类，通过这个迭代器我们能修改 `ArrayList` 中的数据。

![](附件/image/Java内部类_image_1.png)

《Java 编程思想》给出了内部类可以修改外部类实例数据的原因，通过外部类实例创建内部类实例的时候，会为内部类实例自动的创建一个指向外部类实例的应用。

![](附件/image/Java内部类_image_2.png)

不过外部类实例是无法直接访问内部类实例的数据的，因为外部类实例中并不会有指向内部类实例的应用，不过如果将内部类实例传入外部类方法中，就可以进行修改了。

```java 
public class Outer {  
  
    private class Inner {  
        int data = 0;  
        public int getData() {  
            return data;  
        }  
    }  
  
    public void change(Inner inner, int data) {  
        inner.data = data;  
    }  
  
    public static void staticChange(Inner inner, int data) {  
        inner.data = data;  
    }  
  
    public static void main(String[] args) {  
        Outer outer = new Outer();  
        Inner inner = outer.new Inner();  
        System.out.println(inner.getData());  
  
        outer.change(inner, 10);  
        System.out.println(inner.getData());  
  
        Outer.staticChange(inner, 20);  
        System.out.println(inner.getData());  
    }  
}
```

### 获取外部实例

在普通类中通过 `this` 关键字表示的是当前实例，在内部类中也是如此，那么如果想要获取外部实例怎么办，比如内部实例的某个方式返回值为外部实例，只需要使用这样的符号 `外部类名称.this` 即可：

```java
public class Outer {  

    public class Inner {   
        public Outer getOuter() {
            return Outer.this;
        }
    }  
}
```

### 向上转型

内部类的一个作用是可以将细节隐藏，还是以 `ArrayList` 中的迭代器为例，它有 `private` 标识符，也就是说在类的外部无法访问到它。

![](附件/image/Java内部类_image_3.png)

通过 `ArrayList` 提供的 `iterator` 方法可以获得这个迭代器的实例，但是却将它向上转型为了 `Iterator`。这和符合要求，用户只要知道 `Iterator` 可以用于遍历数据即可，具体内部是怎样实现的它不需要关心。

![](附件/image/Java内部类_image_4.png)

### 继承

在继承内部类的时候需要特别注意，内部类实例在实例化的时候会自动的创建一个指向外部类实例的引用，但是内部类的子类有时候不需要通过外部类实例来调用，那么就需要显示的它指定这个外部类实例。

```java

class Outer {  
    class Inner {
      
    }  
}  
  
class A extends Outer.Inner {  

    public A(Outer outer) {  
        outer.super();  
    }  
}  
public class Main {  
    public static void main(String[] args) {  
  
        A a = new A(new Outer());  
    }  
}
```

在外部类的子类中定义的内部类，不会覆盖外部类中的内部类。

## 局部内部类

类还可以定义在任意方法和代码块中：

```java  
public class Outer {  
  
    static {  
  
        // 静态代码块  
        class InnerOne {  
        }  
  
        System.out.println(new InnerOne());  
    }  
  
    {  
        // 实例代码块  
        class InnerTwo {  
        }  
  
        System.out.println(new InnerTwo());  
  
    }  
  
    public void method(boolean flag) {  
  
        // 方法中  
        class InnerThree {  
  
        }  
        System.out.println(new InnerThree());  
  
        if(flag) {  
  
            // if作用域  
            class InnerFour {  
  
            }  
  
            System.out.println(new InnerFour());  
  
  
        }  
  
    }  
  
    public static void main(String[] args) {  
  
        Outer outer = new Outer();  
        outer.method(true);  
    }  
}
```

不过需要注意的是，只有在定义类的作用于范围内类是可见的，一旦出了作用域，就无法访问该类了。

## 匿名内部类

有些时候我们需要创建一个类的子类并获取它的实例，但是这个子类仅用到一次，那么就可以使用匿名内部类。

```java
class Animal {  
  
    public void name() {  
        System.out.println("动物");  
    }  
  
}  
  
public class Main {  
  
    public static void main(String[] args) {  
  
       Animal dog = new Animal() {  
           public void name() {  
               System.out.println("狗");  
           }  
       };  
  
       dog.name();  
    }  
}
```

上面的写法等价于：

```java
public class Main {  
  
    public static void main(String[] args) {  
        
        class Dog extends Animal {  
            public void name() {  
                System.out.println("狗");  
            }  
        }  
        
        Animal dog = new Dog();  
        dog.name(); 
    }  
}

```

这样的写法它的作用是创建一个 `Animal` 的子类，同时获取这个子类的实例，因为创建类的过程中别没有像写普通类那样给出名字，所以叫匿名内部类。

```java
Animal dog = new Animal() {  
   public void name() {  
       System.out.println("狗");  
   }  
};  
```

由于匿名内部类没有名字，我们在代码中无法像使用其他类那样重复使用，当然也没有这样的必要，匿名内部类本来就是用于代替那些只用一次的子类的。

如果父类的构造函数有参数，那么在使用匿名内部类的时需要传递这些参数：

```java
class Animal {  
      
    private int age;  
    public Animal(int age) {  
        this.age = age;  
    }  
}

Animal dog = new Animal(10) {  
   public void name() {  
       System.out.println("狗");  
   }  
};  
```

匿名函数没有名字，那么也就没有相应的构造函数，如果想要对类中的属性进行初始化，需用通过初始化代码块来实现。

## 嵌套类

定义在其他类内部，并且使用 `static` 标注的类叫做嵌套类，也可以叫静态内部类。

```java
class Outer {
    public static class Inner {
    
    }
}
```

和普通的静态成员一样，静态内部类可以通过外部类的类名来访问，并且嵌套类实例无法访问到外部类的实例属性和方法, 但是可以访问静态属性和方法。

```java
class Outer {  
      
    static class Inner {  
             
    }  
}  
public class Main {  
  
    public static void main(String[] args) {  
        Outer.Inner inner = new Outer.Inner();  
    }  
}
```
