
## 类的初始化方法执行顺序

```java
class A {  
    public A() {  
        System.out.println("A构造方法");  
    }  
}  
  
class B extends A {  
    public B() {  
        System.out.println("B构造方法");  
    }  
}  
  
class C extends B {  
    public C() {  
        System.out.println("C构造方法");  
    }  
}
```

在 Java 中对子类进行初始化（执行构造方法）的时候，父类也会被初始化，而且顺序是从父类到子类，以上述的继承体系为例，创建一个 `C` 实例的时候输出结果如下：

```java
A构造方法
B构造方法
C构造方法
```

查看 `B` 类的字节码，可以看到在初始化方法中主动调用了父类 `A` 的初始化方法，也就是说在编译过程中编译器会主动在子类初始化方法的最前面调用父类的初始化方法。

```java
class com/liang/chapter7/B extends com/liang/chapter7/A {
  public <init>()V
   L0
    LINENUMBER 26 L0
    ALOAD 0
    BIPUSH 12
    INVOKESPECIAL com/liang/chapter7/A.<init> (I)V
   L1
    LINENUMBER 27 L1
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    LDC "B\u6784\u9020\u65b9\u6cd5"
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
   L2
    LINENUMBER 28 L2
    RETURN
   L3
    LOCALVARIABLE this Lcom/liang/chapter7/B; L0 L3 0
    MAXSTACK = 2
    MAXLOCALS = 1
}
```

那么当父类有多个初始化方法时，会发生什么情况呢？子类默认会调用无参的构造方法。

```java
class A {  
    public A() {  
        System.out.println("A构造方法");  
    }  
  
    public A(int num) {  
        System.out.println("A有参数的构造方法");  
    }  
}  
  
class B extends A {  
    public B() {  
        System.out.println("B构造方法");  
    }  
}
```

```java
A构造方法
B构造方法
```

正因如此，下面的代码是无法通过编译的，如果父类中没有默认的无参构造方法，那么在子类中就必须通过 `super` 关键字显示的调用它。

```java
class A {  
  
    public A(int num) {  
        System.out.println("A有参数的构造方法");  
    }  
}  
  
class B extends A {  
    public B() {  
        System.out.println("B构造方法");  
    }  
}
```

上面的代码修改成这样就能通过编译正常运行了。

```java
class A {  
  
    public A(int num) {  
        System.out.println("A有参数的构造方法");  
    }  
}  
  
class B extends A {  
    public B() {  
	    super(12);
        System.out.println("B构造方法");  
    }  
}
```

## 代码块执行顺序

当类第一次被加载的时候，会对类进行初始化，其中包括执行静态代码块中的内容，另外在对类进行实例化的时候，实例代码块中的内容也会被执行。

```java
class Father {  
  
    public Father() {  
        System.out.println("Father构造方法");  
    }  
  
    static {  
        System.out.println("Father static 代码块");  
    }  
  
    {  
        System.out.println("Father 代码块");  
    }  
}  
  
class Son extends Father {  
  
    public Son() {  
        System.out.println("Son构造方法");  
    }  
  
    static {  
        System.out.println("Son static 代码块");  
    }  
  
    {  
        System.out.println("Son 代码块");  
    }  
  
}
```

当第一次创建 `Son` 实例的时候，可以在控制台看到如下的输出结果：

```java
Father static 代码块
Son static 代码块
Father 代码块
Father构造方法
Son 代码块
Son构造方法
```

第二次创建的时候，输出结果为：

```java
Father 代码块
Father构造方法
Son 代码块
Son构造方法
```



## 方法的重载与重写

在 Java 中子类会继承父类的方法，也就是说子类可以调用父类中的方法，假设有下面的继承系统：

```java
class Father {  
    public void f() {  
        System.out.println("Father f()方法");  
    }  
  
    public void f(int a) {  
        System.out.println("Father f(int)方法");  
    }  
  
}  
  
class Son extends Father {  
  
    public void f() {  
        System.out.println("Son f()方法");  
    }  
  
  
    public void f(int a, int b) {  
        System.out.println("Son f(int,int)方法");  
    }  
  
}
```

```java
Son son = new Son();  
son.f();  
son.f(1);  
son.f(1,2);
```

```java
Son f()方法
Father f(int)方法
Son f(int,int)方法
```

通过执行上面的代码片段，可以发现如下规律：
- 子类方法如果和父类同名，并且参数列表一样，那么此时会执行子类的方法，如 `f()` 方法，此时称子类对父类的 `f()` 方法进行了**重写**；
- 子类中没有该方法，那么就调用父类的方法，如 `f(int)` 方法；
- 只有子类中有该方法，则直接执行该方法，如果方法与其他子类或父类中的方法同名但参数列表不同，此时属于普通的方法**重载**。

针对方法重写，Java 中提供了 `@Override` 注解，提示自己此时要重写父类的方法。推荐在重写父类方法的时候使用该注解，一来明确表示方法为重写方法，二来如果不小心写错方法名或参数列表，成了非重写的方法，编译期间编译器就会提示我们要做出修改。

## 使用继承还是组合

继承表示 `is-a` 的关系，如 `狗-动物` 这样的关系，使用父类的地方都可以用子类来代替，因为子类拥有父类所有的方法（public 方法）；组合表示 `has-a` 的关系，如果 `轮子-车` 这样的关新，车包含了轮子，但轮子不能用来代替车。

通常情况下能有组合解决问题的时候就使用组合来解决问题，因为继承会增加类之间的耦合性，有时候如果对父类进行了修改，子类也必须做出相应的修改。只有在明确要表示 `is-a` 这样的场景下，才会选择使用继承来解决问题。

![](附件/image/Java继承_image_1.png)


## `protected` 关键字的使用

在使用 `protected` 关键字的时候，通常将属性设置为 `private`，将操作属性的方法设置为 `protected`，如下所示：

```java
class Father {  
  
    private int data;  
  
    protected void set(int i) {  
        data = i;  
    }  
  
    protected int get() {  
        return data;  
    }  
  
}  
  
class Son extends Father {  
  
    @Override  
    public int get() {  
        return super.get() + 1;  
    }  
  
}
```

## 转型

转型可以分为向上转型和向下转型：
- 向上转型：将子类型转化为父类型；
- 向下转型：将父类型转化为子类型。

向上转型总是比较安全的，因为子类会继承父类的所有的 `public` 方法，那么对使用者来说，父类型可以使用的方法子类型中也有，子类型与父类型之间没有差别。

向下转型就不总是安全的，因为子类中会实现自己独有的方法，对于使用者来说，父类并不能用来替代子类。

在 Java 中如果进行向上转型，是没有任何限制的，因为它总是安全的，但是向下转型时，必须使用显示的转型语法，而且即使通过了编译在运行期间也可能抛出错误。

```java
Son son = new Son();  
Father father = new Father();  
Son castSon = (Son) father;  
Father castFather = son;
```

上面代码对应的字节码如下，可以看到在执行 `Son castSon = (Son) father` 时使用了 `checkcast` 指令。

> 指令 checkcast 用于检查类型强制转换是否可以进行。如果可以进行，那么 checkcast 指令不会改变操作数栈，否则它会抛出 ClassCastException 异常。

```java
 0 new #7 <com/liang/chapter7/Son>
 3 dup
 4 invokespecial #9 <com/liang/chapter7/Son.<init> : ()V>
 7 astore_1
 8 new #10 <com/liang/chapter7/Father>
11 dup
12 invokespecial #12 <com/liang/chapter7/Father.<init> : ()V>
15 astore_2
16 aload_2
17 checkcast #7 <com/liang/chapter7/Son>
20 astore_3
21 aload_1
22 astore 4
24 return

```

## `final` 关键字

`final` 关键字在 Java 中表示“不可以改变”，它可以用于数据、方法和类。

### 用于数据

当 `fianl` 用于基本数据类型时，当前数据被赋值后就不可以被改变了，它可以用于类属性、实例属性和普通变量。`fianl` 标注的数据有两种赋值方法，一是在定义时直接赋值，二是在定义完成后再赋值。无论赋值方式如何，数据一旦被赋值后就不可在进行赋值。

```java
class Main {

	public static final int a = 1;  
	  
	public static final int b;  
	  
	static {  
	    b = 2;  
	}
}
```

```java
class Main {

	public int c  = 1;  
	  
	public int d;  
	  
	{  
	    d = 2;  
	}  
	  
	public int e;

	public Main() {
		e = 3;
	}
}
```

```java
public static void main(String[] args) {  
    final int a = 1;  
    final int b;  
    b = 1;  
}
```

`final` 用于引用数据类型时，它只能保证引用的对象不会发生改变，但无法约束对象内部的发生的变化，下面的代码片段演示了这一点：

```java
final int[] nums = new int[]{1,2,3};  
nums[0] = 12;
```

`final` 还能用于函数的参数，作用是防止在方法内部对参数作出修改，这一特定的主要作用是想匿名内部类中传递数据。

```java
public void f(final int a) {  
  
}
```

### 用于方法

`final` 关键字用于方法上，表示这个方法是最终的版本了，可以阻止方法被子类重写，如果在子类中重写了 `final` 方法，在编译期间会抛出错误。

另一个使用 `final` 的原因是早期版本的 Java 在调用 `final` 方法的时候做出一定的优化，提升程序的执行效率，不过目前已经不需要在考虑这个问题了。

对于 `private` 类型的方法，无论是否使用 `fianl` 结果都是一样的，因为 `private` 本身对子类就是不可见的，所以就谈不上子类对其进行重写。即使是子类中写了和父类中一样的方法，本质上也只是一个新的方法，而不是对父类中方法的重写。

### 用于类

当 `final` 被用于类的时候，表明当前类是最终版本，不行忘任有任何子类对其进行更改和拓展，如 `String` 类就是 `final` 类，所以我们无法继承 `String` 创建子类。

```java
public final class String  
    implements java.io.Serializable, Comparable<String>, CharSequence,  
               Constable, ConstantDesc {

}
```
