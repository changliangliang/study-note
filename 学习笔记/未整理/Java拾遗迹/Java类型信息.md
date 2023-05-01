---
{}
---

## RTTI

![](附件/image/Java类型信息_image_1.png)


RTTI （运行时类型识别）是在程序运行过程中获取类型信息的一种机制，对于多态的实现具有重要的意义。在 `Shape` 继承体系中，可以将 `Shape` 的子类实例传递给下面的方法，当要执行 `draw()` 方法时，会调用子类对应的 `draw()` 方法。这种情况里编译时期是无法确定传入的是哪个子类的实例，只能在程序运行过程中确定，就需要用到 RTTI。

```java
public void method(Shape s) {
	s.draw();
}
```

Java 中 RTTI 主要体现在以下几个地方：
- 进行类型转换的时候确保正确性，如果执行了一个错误的转换则抛出错误；
- 代表类型的 `Class` 对象，通过它可以获取类型相关的所有信息；
- `Instanceof` 关键字，可以判断对象是否为某个类型；

## Class 类

类型信息在 JVM 中以 `Class` 对象的形式存在，也就是说我们在源码文件中编写的一个个类，在经历编译成为字节码后，被加载到 JVM 中，形成一个个的 `Class` 对象。

每个 `Class` 对象都记录着其对应类的各种信息，使用 `Class` 类提供了大量的方法来获取这些信息，如：
- `getSuperclass()` 可以获取父类；
- `getInterfaces()` 获取继承的接口；
- `getFields()` 获取所有属性；
- `getMethods()` 获取所有方法；

Java 中类加载到 JVM 中时动态进行的，只要当类被使用的时候才会进入到 JVM 中，运行下面的代码片段，可以看到只有 `Test1` 的静态代码块被执行了。

```java
class Test1 {  
  
    static {  
        System.out.println("Test1类被加载了");  
    }  
}  
  
class Test2 {  
  
    static {  
        System.out.println("Test2类被加载了");  
    }  
}  
  
public class Main {  
  
    public static void main(String[] args) {  
        new Test1();  
    }  
}
```

除了通过 `new` 一个对象这种方法使用类会把类加载进 JVM，Java 中还提供了 `forName` 方法，它的返回值为加载的类对象。

```java
Class.forName("com.liang.chapter14.test1.Test2");
```

`类名.class` 也表示类对象，它是类对象的字面量，相对于 `forName` 的方式，使用字面量更加安全，因为它在编译期间就会检查类是否存在，而 `forName` 只有到了运行时才能确定要获取的类是否存在。 

## `instanceof` 关键字

`instanceof` 用来判断对象是否为某个类型的实例，使用方法如下：

```java
class Animal {  
  
}  
  
class Dog extends Animal{  
  
}  
  
class Cat extends Animal {  
  
}  
public class Main {  
  
    public static void main(String[] args) {  
  
        Animal a = new Dog();  
  
        System.out.println(a instanceof Dog);  
        System.out.println(a instanceof Cat);  
        System.out.println(a instanceof Animal);  
  
    }  
}
```

`Class` 类中也提供了 `isInstance()` 方法，用于判断某个对象是否为当前类型的实例：

```java
Class<?> catClass = Cat.class;  
boolean instance = catClass.isInstance(a);  
System.out.println(instance);
```

## 反射

所谓反射就是在程序运行时动态的获得类型相关的信息，主要用在一些无法确定具体类型信息的场合，通常在一些框架中会使用到。

```java
public static void test(Class<?> clazz) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {  
  
    // 获取所有构造方的参数列表  
    for (Constructor<?> constructor : clazz.getConstructors()) {  
        System.out.println(Arrays.toString(constructor.getParameters()));  
    }  
  
    // 获取只有一个int参数的构造方法  
    Constructor<?> constructor = clazz.getConstructor(int.class);  
    Object o = constructor.newInstance(1);  
  
    //获取所有方法  
    Method[] methods = clazz.getMethods();  
    for (Method method : methods) {  
  
        System.out.println(method.getName() + "====" + Arrays.toString(method.getParameters()));  
    }  
  
    // 获取方法，调用方法  
    Method getData = clazz.getMethod("getData");  
    Object r = getData.invoke(o);  
    System.out.println(r);  
}
```
