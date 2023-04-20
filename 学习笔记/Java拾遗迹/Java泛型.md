## 什么是泛型

### 泛型类

泛型是 Java SE5 版本开始提供的功能，主要目的是为了实现**参数化类型**，使得同样的代码可以用于不同的数据类型。在 Java 中使用泛型最典型的例子是各种容器，在没有泛型的时代，假设我们要编写一个容器 `DataHolder`，该容器能够持有一个 `String` 类型的数据，那么它的源码可能如下：

```java

public class StringDataHolder {  
      
    /**  
     * 容器持有数据  
     */  
    private String data;  
    public String getData() {  
        return data;  
    }  
  
    public void setData(String data) {  
        this.data = data;  
    }  
  
    public static void main(String[] args) {  
          
        // 创建容器  
        StringDataHolder dataHolder = new StringDataHolder();  
        // 向容器中存放数据  
        dataHolder.setData("chang");  
        // 从容器中获取数据  
        System.out.println(dataHolder.getData());  
    }  
}
```

如果现在有了一个新的需求，需要一个能持有 `Integer` 类型数据的容器，那么我们很容易仿照上面的代码写出新的容器。

```java
public class IntegerDataHolder {  
  
    /**  
     * 容器持有数据  
     */  
    private Integer data;  
  
    public Integer getData() {  
        return data;  
    }  
  
    public void setData(Integer data) {  
        this.data = data;  
    }  
  
    public static void main(String[] args) {  
  
        // 创建容器  
        IntegerDataHolder dataHolder = new IntegerDataHolder();  
  
        // 向容器中存放数据  
        dataHolder.setData(1949);  
  
        // 从容器中获取数据  
        System.out.println(dataHolder.getData());  
    }  
}
```

不过这时候你可能发现问题了，这两个容器 `StringDataHolder` 和 `IntegerDataHolder` 除了持有的数据类型不同以外长得几乎一摸样，也就是说同一份代码我们写了两次。索性这两个容器比较简单，这样的重复还算是在可以容忍的范围内，但是如果这两个容器比较复杂（每个都有 1000 行代码）或者需要放入容器的数据类型很多（假设有 100 个），我们就没办法再这样简单的复制粘贴了，那么有没有解决办法呢？答案是有的。在 Java 中所有的类型都继承自 `Object`，所以可以用 `Object` 对象来存储数据，上述两个容器可以改写为：

```java
public class DataHolder {  
  
    /**  
     * 容器持有数据  
     */  
    private Object data;  
  
    public Object getData() {  
        return data;  
    }  
  
    public void setData(Object data) {  
        this.data = data;  
    }  
  
    public static void main(String[] args) {  
  
        // 创建容器  
        DataHolder dataHolder = new DataHolder();  
  
        // 向容器中存放数据  
        dataHolder.setData(1949);  
        // 从容器中获取数据  
        System.out.println(dataHolder.getData());  
        // 向容器中存放数据  
        dataHolder.setData("chang");  
        // 从容器中获取数据  
        System.out.println(dataHolder.getData());  
    }  
}
```

经过修改后的容器 `Dataholder` 可以用来持有不同类型的数据了，即使是基础数据类型也能够存放到这个容器中，这得益于 Java 中的自动装箱。不过成也萧何败萧何，`Object` 可以接受任何类型的数据，也意味着无法对容器持有的数据做出类型上的限制，有时候会出现意想不到的错误。

```java
public class Main {  
    public static void main(String[] args) {  
  
        // 创建容器，希望使用它来存放String类型的数据  
        DataHolder stringHolder = new DataHolder();  
  
        // 正常使用，存放String类型数据  
        stringHolder.setData("chang");  
        // 使用时将数据从Object转成String类型  
        String data = (String) stringHolder.getData();  
        System.out.println(data);  
  
        // 出现失误，存放了非String类型的数据  
        stringHolder.setData(1949);  
        // 认为容器中存放的是String类型的数据，依旧将数据从Object转成String类型  
        data = (String) stringHolder.getData();  
        System.out.println(data);  
    }  
}
```

上面的例子中创建了一个 `DataHolder` 容器，因为希望这个容器只用来持有 `String` 类型的数据，特意给其起了 `stringHolder` 这个名字。

我们假设这个一个场景，某个粗心的程序员在编码过程中没注意到容器只能用来存放 `String` 数据，无意中将 ` int ` 数据存放到了这个容器中。

```java
stringHolder.setData(1949);
```

其他程序员在拿到这个容器后，发现这个是一个存放 `String` 数据的容器，所以很自然的取出容器中的数据，并做了类型转换。

```java
data = (String) stringHolder.getData();  
```

在编译代码的过程中编译器完全没有给出错误提示，大家以为大功告成了，但是将代码运行起来后发现了错误，提示我们无法将 `Integer` 类型转为 `String` 类型。

```bash
Exception in thread "main" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')
	at com.liang.Main.main(Main.java:30)
```

经过以上的铺垫，到这里终于要引出类本文的主题了，Java 中泛型的出现主要目的之一就是告诉编译器容器中应该存放什么样的类型，将上述类型转化的问题在编译期间就暴露出来。接下来我们看一下使用泛型改造后的 `DataHolder` 是什么样子，其中 `<T>` 叫做类型，它表示我们在使用这个类时传递的类型。

```java
public class DataHolder<T> {  
  
    /**  
     * 容器持有数据，表明数据类型为T  
     */  
    private T data;  
  
    public T getData() {  
        return data;  
    }  
  
    public void setData(T data) {  
        this.data = data;  
    }  
  
    public static void main(String[] args) {  
  
        // 创建容器, 通过<String>告诉编译器, T代表的类型为String
        DataHolder<String> dataHolder = new DataHolder<>();  
        // 向容器中存放String数据  
        dataHolder.setData("chang");  
        // 从容器中获取数据  
        System.out.println(dataHolder.getData());  
    }  
}
```

利用泛型改造后的容器，在创建的过程中通过泛型告诉了编译器这个容器中只能用来存放 `String` 类型的数据。

```java
 DataHolder<String> dataHolder = new DataHolder<>();  
```

这时候如果还有粗心的程序员想要在容器中存入 `int` 数据，那么在编译的过程中就会给出错误提示，告知无法将 `int` 转换为 `String`。

```java
dataHolder.setData(1949);
```

```bash
DataHolder.java:29: 错误: 不兼容的类型: int无法转换为String
        dataHolder.setData(1949);
                           ^
```

在一些现代的 IDE 中，甚至不用等到编译代码，当我们向容器中加入不正确的数据类型后 IDE 立马就会提示我们出现了错误。

![](附件/Java泛型_image_1.png)


像 `DataHolder` 这样在定义的时候使用了泛型通配符的类，就叫做泛型类。在 Java 中存在大量的类似的泛型类，如 `ArrayList` 和 `HashMap` 这样的容器，查看它们的源码可以看到使用到了泛型。

```java
public class ArrayList<E> extends AbstractList<E>  
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
```

```java
public class HashMap<K,V> extends AbstractMap<K,V>  
    implements Map<K,V>, Cloneable, Serializable {
```

### 泛型接口

接口的主要作用是对类的行为做出约定，更直白的一点讲就是规定了实现该接口的类应该有哪些方法，下面我们来看一个接口的例子：

```java
public interface Producer {  
  
    String produce();  
  
}
```

`Producer` 接口用于表示一个生产者，并且规定了生产者应该实现 `String produce()` 方法。

显然实现了 `Producer` 接口的生产者只能用来生产 `String` 数据，如果想要生产其他类型的数据，就需要重新定义新的接口：

```java
public interface Producer {  
  
    Integer produce();  
  
}

```

这时候我们遇到了容器中类似的问题，如果有 1000 个生产不同类型数据的生产者，该怎么办？这时候就可以用到泛型了，即所谓的泛型接口。

```java
public interface Producer<T> {  
  
    T produce();  
  
}
```

某个生产者类型在实现接口的时候，只要通过泛型指定出需要生产的类型就可以了。

```java
class StringProducer implements Producer<String> {  
  
    @Override  
    public String produce() {  
        return "chang";  
    }  
}  
  
class IntegerProducer implements Producer<Integer> {  
  
    @Override  
    public Integer produce() {  
        return 1949;  
    }  
}
```

### 泛型方法

泛型还可以单独用在方法上，与普通方法的区别在于返回值前添加了类型参数 `<T>`，并且返回类型或者形参类型都能使用 `T` 来表示。

```java
class Main {

	public static <T>  T staticMethod(T o) {  
	    return o;  
	}  
	  
	public <T>  T method(T o) {  
	    return o;  
	}
}

```

泛型方法在使用时通常不需要像使用泛型类或者泛型接口那样显示的指明类型参数的具体值，编译器可以根据方法的实参或者返回值进行推测，当然在需要的时候也可以在调用方法的时候显示的指明。

```java
// 编译器自信推断
String a = Main.staticMethod("chang");
Integer b = Main.staticMethod(1949);

//显示指明参数类型
Integer c = Main.<Integer>staticMethod(1949);
```

泛型方法中的参数类型是独立于类存在的，无论类中是否存在泛型都不会对泛型方法产生影响，一般在编程实践中我们遵守这样一个原则：使用泛型方法能够达到目的的情况下，绝对不使用泛型类。下面我们来看一个泛型方法在实际中使用的例子，这是 `Collections` 工具类中的 `fill` 方法，作用是填充集合为指定元素：

```JAVA
public static <T> void fill(List<? super T> list, T obj) {  
    int size = list.size();  
  
    if (size < FILL_THRESHOLD || list instanceof RandomAccess) {  
        for (int i=0; i<size; i++)  
            list.set(i, obj);  
    } else {  
        ListIterator<? super T> itr = list.listIterator();  
        for (int i=0; i<size; i++) {  
            itr.next();  
            itr.set(obj);  
        }  
    }  
}
```

## 泛型擦除

### 擦除

Java 在实现泛型的时候，为了兼容已有的代码，是用了擦除法来实现泛型，所以 Java 中泛型只存在于编译期，所有的类型检查工作都由编译期完成，编译完成后泛型中的类型信息会被全部擦除。

```java

// 泛型版本
public class DataHolder<T> {  
  
    /**  
     * 容器持有数据，表明数据类型为T  
     */  
    private T data;  
  
    public T getData() {  
        return data;  
    }  
  
    public void setData(T data) {  
        this.data = data;  
    }  
}

// Object版本
public class DataHolder {  
  
    /**  
     * 容器持有数据  
     */  
    private Object data;  
  
    public Object getData() {  
        return data;  
    }  
  
    public void setData(Object data) {  
        this.data = data;  
    }  
}
```

前文中我们编写的泛型类 `DataHolder` 编译后在虚拟机看来，其实和 `Object` 版本没有区别，这一点可以通过 `javap -c  DataHolder.class` 反编译查看两者的字节码来验证，可以说一模一样。

```java
public class com.liang.DataHolder<T> {
  public com.liang.DataHolder();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public T getData();
    Code:
       0: aload_0
       1: getfield      #7                  // Field data:Ljava/lang/Object;
       4: areturn

  public void setData(T);
    Code:
       0: aload_0
       1: aload_1
       2: putfield      #7                  // Field data:Ljava/lang/Object;
       5: return
}
```

```java
public class com.liang.DataHolder {
  public com.liang.DataHolder();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public java.lang.Object getData();
    Code:
       0: aload_0
       1: getfield      #7                  // Field data:Ljava/lang/Object;
       4: areturn

  public void setData(java.lang.Object);
    Code:
       0: aload_0
       1: aload_1
       2: putfield      #7                  // Field data:Ljava/lang/Object;
       5: return
}

```

正因为这样泛型类和普通类不能同时存在，如果我们在编码是写了如下两个类，那么编译时一定会看到 `java: 类重复: com.liang.DataHolder` 这样的错误，提示我们编写了两个一样的类。

```java
class DataHolder {  
  
}  
  
class DataHolder<T> {  
      
}
```

还是这个原因，同一个泛型类即使赋予了不同的类型参数，它们任然属于同一个类，下面的代码片段输出值为 `true`。

```java
ArrayList<String> strArray = new ArrayList<>();  
ArrayList<Integer> intArray = new ArrayList<>();  
System.out.println(strArray.getClass() == intArray.getClass());
```

因为 Java 是通过擦除的方式实现的泛型，所以在泛型内部无货获取任何类型相关的信息，它带来的影响主要有：
1. 无法创建实例，如下面的代码是无法编译通过的，应为在编译后类型信息 `T` 会被替换为 `Object`，如果允许创建实例那么创建出的也为 `Object` 实例，失去了泛型存在的意义。

	```java
	public class DataHolder<T> {  
	  
	    private T data;  
	  
	    public T creat() {  
	        return new T();  // 等用于 new Object();
	    }  
	  
	}
	```
	
2. 无法调用除了 `Object` 类之外的方法，如下面的 `method1` 方法可以编译通过，`method2` 方法无法编译通过，因为类型擦除的时候 `T` 被替换成了 `Object`。

	```java
	public static <T> void method1(T t) {  
	    t.toString();  
	}  
	public static <T> void method2(T t) {  
	    t.substring(0);  
	}
	```

###  边界

泛型在编译过程中类型参数会被擦除替换成 `Object`，导致只能使用 `Object` 的方法，根本原因在于编译期间编译器无法知道使用者会传入什么样的类型，只能将其擦除为 `Object`。边界的出现就是为了解决这样的问题，明确的告诉编译器将来会传入类型的边界，如下面的例子中，`<T extends Animal>` 明确了 `T` 可以为 `Animal` 极其子类，那么在擦除的时候 `T` 会被替换为 `Animal` 而不是 `Object`。

```java
public static <T extends Animal> void method(T t) {  
	//可以使用Animal中所有的方法 
}  
```

同样的泛型类中也是如此，根据反编译后的字节码，确确实实的看到了 `T` 被进行了替换。

```java
class Animal {   
}  
  
class Dog extends Animal {    
}  
  
class Holder<T extends Animal> {  
  
    private T obj;  
  
    public T getObj() {  
        return obj;  
    }  
  
    public void setObj(T obj) {  
        this.obj = obj;  
    }  
}  

```

```java
// class version 52.0 (52)
// access flags 0x20
// signature <T:Lcom/liang/chapter15/test1/Animal;>Ljava/lang/Object;
// declaration: com/liang/chapter15/test1/Holder<T extends com.liang.chapter15.test1.Animal>
class com/liang/chapter15/test1/Holder {

  // compiled from: Main.java

  // access flags 0x2
  // signature TT;
  // declaration: obj extends T
  private Lcom/liang/chapter15/test1/Animal; obj

  // access flags 0x0
  <init>()V
   L0
    LINENUMBER 12 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this Lcom/liang/chapter15/test1/Holder; L0 L1 0
    // signature Lcom/liang/chapter15/test1/Holder<TT;>;
    // declaration: this extends com.liang.chapter15.test1.Holder<T>
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x1
  // signature ()TT;
  // declaration: T getObj()
  public getObj()Lcom/liang/chapter15/test1/Animal;
   L0
    LINENUMBER 17 L0
    ALOAD 0
    GETFIELD com/liang/chapter15/test1/Holder.obj : Lcom/liang/chapter15/test1/Animal;
    ARETURN
   L1
    LOCALVARIABLE this Lcom/liang/chapter15/test1/Holder; L0 L1 0
    // signature Lcom/liang/chapter15/test1/Holder<TT;>;
    // declaration: this extends com.liang.chapter15.test1.Holder<T>
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x1
  // signature (TT;)V
  // declaration: void setObj(T)
  public setObj(Lcom/liang/chapter15/test1/Animal;)V
   L0
    LINENUMBER 21 L0
    ALOAD 0
    ALOAD 1
    PUTFIELD com/liang/chapter15/test1/Holder.obj : Lcom/liang/chapter15/test1/Animal;
   L1
    LINENUMBER 22 L1
    RETURN
   L2
    LOCALVARIABLE this Lcom/liang/chapter15/test1/Holder; L0 L2 0
    // signature Lcom/liang/chapter15/test1/Holder<TT;>;
    // declaration: this extends com.liang.chapter15.test1.Holder<T>
    LOCALVARIABLE obj Lcom/liang/chapter15/test1/Animal; L0 L2 1
    // signature TT;
    // declaration: obj extends T
    MAXSTACK = 2
    MAXLOCALS = 2
}

```

### 补偿

因为类型擦除的原因，无法在泛型类的内部获取有关类型参数的信息，不过我们可以通过手动添加类型信息的方法在某种程度上缓解问题。如想要在泛型中创建实例，那么做法应该是保存额外的类型信息到泛型类中：

```java
public class Producer<T> {  
	
	// 类型信息
	private final Class<T> clazz;  
  
	public Producer(Class<T> clazz) {  
		this.clazz = clazz;  
	}  
  
	// 利用反射获取类型实例  
	public T creat()   
			throws NoSuchMethodException, InvocationTargetException,   
					InstantiationException, IllegalAccessException {  
		return this.clazz.getDeclaredConstructor().newInstance();  
	}  
}
```

## 泛型数组使用的建议

有时候我们可能想要创建如下的泛型数据，但是 Java 中是不允许这样做的，通常情况下的解决方案是使用 `ArrayList` 容器来替代想要创建的数组。

```java
T[] datas = new T[10];
```

或者学习 `ArrayList` 中的处理方式，使用 `Object` 数组来存储元素，在需要取出元素的时候做类型转换。

![](附件/Java泛型_image_2.png)

![](附件/Java泛型_image_3.png)

![](附件/Java泛型_image_4.png)


## 通配符

在数组中父类数组的引用可以指向子类数组，下面的代码片段是可以通过编译并运行的。

```java
class Animal {        
}  
  
class Dog extends Animal {  
      
}

public class Main {  
  
    public static void main(String[] args) {  
        Animal[] as = new Dog[10];  
    }  
}
```

但是在泛型容器中并不存在这样的关系，下面的赋值语句是无法通过编译的，`ArrayList<Animal>` 和 `ArrayList<Dog>` 之间不存在任何联系。

```java
ArrayList<Animal> list = new ArrayList<Dog>();
```

在编程过程有时候可能需要使用这样的关系，使用保存父类的容器引用去指向保存子类的容器，那么通配符就是用来解决这个问题的。

```java
ArrayList<? extends Animal> list = new ArrayList<Dog>();
```

`ArrayList<? extends Animal>` 表示这个容器中存放的是 `Animal` 及其子类，它会把容器中所有的元素都当成 `Animal` 来看待。不过这种情况下，我们只能从容器中获取元素，无他添加元素，即使是 `Dog` 类型。实际上 `list` 指向的是 `new ArrayList<Dog>()` 创建出的 `Dog` 容器，但在编译器看来是一个存放 `Animal` 及其子类的容器，但具体存放的是什么，信息已经丢失了，而 `Animal` 可能有其他子类，如 `Cat`，对 `ArrayList<? extends Animal>` 来说它是合法元素，但对 `ArrayList<Dog>` 来说它是不合法的。

通配符还能和 `super` 搭配使用，`ArrayList<? super Dog>` 表示这是一个存放 `Dog` 及其父类的容器，这时候可以向其中添加 `Dog` 及其子类的元素。对于任何 `Dog` 的父类 `T` 来说，`Dog` 及其子类都是 `T` 的子类，所以任何 `Dog` 及其子列对该容器来说都是合法值。

```java
ArrayList<? super Dog> list = new ArrayList<Dog>();
```

单独使用 `?` 也是可以的，`ArrayList<?>`，它表示容器中存放的数据可以是任何类型，但是此时无法向容器中添加元素，原因与 `ArrayList<? extends Animal>` 是类似的。

## 泛型存在的问题

- 无法使用基础类型
	泛型中的类型无法使用基础数据类型，即 `ArrayList<int>` 这样的形式是不允许的，好在 Java 中针对每种类型提供对应的包装类，在使用基础类型的时候可以使用对应的包装类代替，而且由于自动装箱开箱的机制，基础类型可以和包装类型之间自动转化。
- 一个类无法实现同一个泛型接口的不同变体
- 同一个泛型类的不同变体不能作为区分重载方法的依据，因为在 Jvm 看来它们和原始类是一样的

