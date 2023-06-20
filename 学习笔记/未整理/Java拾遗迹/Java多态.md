---
---

## 多态解决的问题

Java 中的类的继承主要解决的代码复用的问题，子类自动的拥有父类中的属性和方法，但是如果仅仅是这样，子类和父类就没有差别了，所以 Java 中还允许子类拥有和父类一样的属性和方法，甚至是覆盖父类中已有的方法，展现出于父类不一样的行为。如狗会跑步，鱼会游泳，它们同属于动物这个范畴，但是在移动的时候表现出不同的状态。

```java
class Animal {  
      
    public void move() {  
        System.out.println("移动");  
    }  
      
}  
  
class Dog extends Animal {  
      
    @Override  
    public void move() {  
  
        System.out.println("跑步");  
    }  
}  
  
class Fish extends Animal {  
  
    @Override  
    public void move() {  
  
        System.out.println("游泳");  
  
    }  
}
```

在学习继承的时候我们知道子类可以无条件的转型为父类，那么假设我们有一个方法，它用来驱动动物移动，那么当把 `Dog` 和 `Fish` 两种类型的实例分别传入方法后，执行的是结果是什么样呢？

```java
public static void move(Animal animal) {  
    animal.move();  
}
```

```java
Dog dog = new Dog();  
Fish fish = new Fish();  
move(dog);  
move(fish);
```

上述代码的输出结果如下：

```java
跑步
游泳
```

可以看到虽然 `Dog` 和 `Fish` 被转型成了 `Animal`，但转型方法的时候还执行的是各自的方法，这也是多态的体现。

## 方法调用绑定

>将一个方法调用同一个方法的主题关联起来的行为称为绑定。

根据绑定是在程序执行之前还是程序执行过程中进行可以将绑定分为：

- 前期绑定：由编译器和连接器决定，也就是在程序执行之前就已经知道执行的是哪个方法了，如 C 语言使用的就是前期绑定。
- 后期绑定：运行时才根据当前信息执行绑定，如上面例子中的 `move` 方法，当传入的 `Dog` 类型就执行 `Dog` 的方法，传入的是 `Fish` 类型就执行 `Fish` 的方法，所以后期绑定也被叫做动态绑定或运行时绑定。Java 中除了 `static` 和 `final` 方法，剩余的方法使用的都是后期绑定。

## `private` 方法

`private` 方法本质上是 `final` 方法，它对子类是屏蔽的，所以子类无法覆盖 `private` 方法，也就不存在动态绑定。如下面的例子中，输出结果为 `A f()`，并非预期中的 `B f()`，所以子类中的方法最好不要跟父类中的 `private` 方法同名，避免不必要的误会。

```java
class A {  
  
    private void f() {  
        System.out.println("A f()");  
    }  
  
    public static void test(A a) {  
        a.f();  
    }  
  
    public static void main(String[] args) {  
        test(new B());  
    }  
}  
  
class B extends A {  
  
    private void f() {  
        System.out.println("B f()");  
    }  
}
```

## 属性绑定

在 Java 中只有方法是动态绑定的，而属性不是，也就是说当用父类引用指向子类实例的时候，只能访问父类中的属性。

```java
class A {  
  
    public String data = "A class";  
    public String getData() {  
        return data;  
    }  
  
    public void setData(String data) {  
        this.data = data;  
    }  
}  
  
class B extends A {  
    public String data = "B class";  
  
    @Override  
    public String getData() {  
        return data;  
    }  
  
    @Override  
    public void setData(String data) {  
        this.data = data;  
    }  
}

public static void main(String[] args) {  
    B b = new B();  
    A a = b;  
    System.out.println(b.data +"===="+ b.getData());  
    System.out.println(a.data +"====" +a.getData());  
}
```

```java
B class====B class
A class====B class
```

通常情况下类的属性设置为 `private`，只提供 `public` 方法去操作属性。

## 构造方法

构造方法本身是前期绑定的，它本质上是一个 `static` 方法，但是构造方法中可以调用实例方方法，而这时候就容易出错。

```java
class A {  
    public void f() {  
        System.out.println("A f()");  
    }  
  
    public A() {  
        f();  
    }  
}  
  
class B extends A {  
    public void f() {  
        System.out.println("B f()");  
    }  
  
    public B() {  
        f();  
    }  
}  
  
public static void main(String[] args) {  
    new B();  
}
```

上面的代码执行结果为：

```java
B f()
B f()
```

在预期中 `A` 的构造方法会调用 `A` 的 `f()` 方法，但通过运行结果可以分析得知在 `A` 的构造函数中调用的 `f()` 方法属于 `B`。在实际使用过程中，如果忘记了这样的状况，很容易出现逻辑上的错误，所以要尽量避免在构造方法中调用实例方法。

## 抽象类

有时候父类本身并没有什么作用，只是创建了一个所有子类的公共模板，如下面的例子中，`Animal` 这个类的 `move` 方法是空的，作用只是告诉使用者它的子类中包含了 `move` 这样一个方法。

```java
class Animal {  
      
    public void move() {  
    }  
      
}  
  
class Dog extends Animal {  
      
    @Override  
    public void move() {  
        System.out.println("跑步");  
    }  
}  
  
class Fish extends Animal {  
  
    @Override  
    public void move() {  
        System.out.println("游泳");  
    }  
}

public static void move(Animal animal) {  
    animal.move();  
}
```

通常这种情况下创建 `Animal` 的实例是没有意义的，因为它所有的方法都是空的，具体实现都在子类中。针对这样的状况，Java 中提供了 `abstract` 关键字，用于创建抽象类。抽象类本质上就是具有抽象方法（可以简单理解为空方法）的类，而抽象方法必须需要在子类中实现。

关于抽象类有几点需要注意：

- 抽象类中可以有非抽象方法，这些方法的继承规则和普通类中一样；
- 抽象类中至少有一个抽象方法；
- 无法创建抽象类的实例。

```java
abstract class Animal {  
  
    abstract public void move();  
}  
  
class Dog extends Animal {  
  
  
    @Override  
    public void move() {  
        System.out.println("跑步");  
    }  
}
```
