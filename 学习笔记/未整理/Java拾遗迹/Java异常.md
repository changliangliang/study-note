---
---

## 打印异常堆栈信息

`e.printStackTrace()` 会打印出从方法调用处到异常抛出处的所有方法调用信息。

```java
public class Main {  

    public static void funA() throws Exception {  
        throw new Exception();  
    }  
  
    public static void funB() throws Exception {  
        funA();  
    }  
    public static void funC() throws Exception {  
        funB();  
    }  
    public static void funD() throws Exception {  
        funC();  
    }  
  
    public static void main(String[] args) {  
  
        try {  
            funD();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
}
```

![](附件/image/Java异常_image_1.png)

默认情况下错误堆栈信息会被打应到 `err` 输出，不过该方法还提供了其他重载方法，可以修改输出的地点，比如 `printStackTrace(System.out)` 会把堆栈信息打印到标准输出。

```java
public void printStackTrace(PrintStream s) {  
    printStackTrace(new WrappedPrintStream(s));  
}
```

## 异常日志

对于自定义的异常，可以在构造方法中直接处理异常的日志。

```java
class MyException extends Exception {  
  
    public MyException() {  
        // 日志处理
        // 另外该方法在构造函数中也可以获得完整的调用堆栈
        this.printStackTrace();  
    }  
}
```

对于第三方异常，不一定会这么处理，那么有可能须要在编程时补货异常并添加日志。

```java
public static void main(String[] args) {  
  
    try {  
        funD();  
    } catch (Exception e) {  
        日志处理 
    }  
}
```

## 复用异常

在有些编程语言中每种异常被定义成了一个全局变量，已实现异常的复用，但是在 Java 中不要这样做，因为异常的堆栈信息在创建时就被确定了，如果复用异常就无法获得正确的堆栈信息。

```java
public class Main {  
  
    private static Exception  e = new Exception();  
  
  
    public static void funA() throws Exception {  
        throw e;  
    }  
  
    public static void funB() throws Exception {  
        funA();  
    }  
    public static void funC() throws Exception {  
        funB();  
    }  
    public static void funD() throws Exception {  
        funC();  
    }  
  
    public static void main(String[] args) {  
  
        try {  
            funD();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }
}
```

![](附件/image/Java异常_image_2.png)

还有一种解决方法, 使用 `fillInStackTrace()` 方法重置堆栈信息。

```java
public static void funA() throws Exception {  
    e.fillInStackTrace();  
    throw e;  
}
```

## 异常链条

有时候我们捕获异常后会将其转化为其他异常抛出，如使用第三库时，捕获了第三方库抛出的异常后，我们会转化为自定义的异常抛出，以实现异常的统一。这样做的的一个缺陷是丢失了原有的异常信息，好在 Java 中提供了解决措施，即调用 `initCause` 方法可以传入一个异常到当前异常中，作为引起当前异常的原因，形成下图所示的错误链条：

```java 
class ExceptionA extends Exception {  
  
}  
  
class ExceptionB extends Exception {  
  
}  
  
class ExceptionC extends Exception {  
  
}  
public class Main {  
  
  
  
    public static void funA() throws Exception {  
        throw new ExceptionA();  
    }  
  
    public static void funB() throws Exception {  
  
        try {  
            funA();  
        } catch (ExceptionA a) {  
  
  
            ExceptionB exceptionB = new ExceptionB();  
            exceptionB.initCause(a);  
            throw exceptionB;  
        }  
    }  
    public static void funC() throws Exception {  
        try {  
            funB();  
        } catch (ExceptionB b) {  
            ExceptionC exceptionC = new ExceptionC();  
            exceptionC.initCause(b);  
            throw exceptionC;  
        }  
    }  
    public static void funD() throws Exception {  
        funC();  
    }  
  
    public static void main(String[] args) {  
  
        try {  
            funD();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
}
```

![](附件/image/Java异常_image_3.png)

## 异常分类

下图展示了 Java 中异常的分类，所有的异常都继承自 `Throwable`，其中 `Error` 表示严重的错误，会直接影响到程序的运行，通常反生在编译期间或者系统出现错误时；`Exeption` 为 Java 程序运行过程中出现的错误，可以被程序员捕获和处理。

`Execption` 又可以分为两部分，`RuntimeException` 为运行时异常，如空指针异常，只有程序真正运行时才会发现这些异常，这些异常不用程序员来捕获，Java 虚拟机会自动抛出它们；剩下的异常则需要程序员显示的进行捕获处理，可以使用 `try` 语句，或者在方法中抛出。

![](附件/image/Java异常_image_4.png)

## `finally` 和 `return`

`finally` 块会在 `return` 之前执行，`test` 方法被调用时代码块中的输出语句会执行。

```java
  
public static int test() {  
    try {  
        return 2;  
    } finally {  
        System.out.println("finally");  
    }  
  
}
```

`finally` 中如果有 `return` 会覆盖掉之前的 `return`, 下面方法的调用结果为 3。

```java
public static int test() {  
  
    try {  
        return 2;  
    } finally {  
        return 3;  
    }  
  
}
```

不过需要注意的是，`finally` 中对变量的修改不会影响到之前的 `return` 语句，`test` 返回值为 2。

```java
public static int test() {  
  
    int x = 2;  
    try {  
        return x;  
    } finally {  
        x = 3;  
    }  
  
}
```

## 异常丢失问题

多层 `try` 语句使用的时候，可能会出现异常丢失问题。

```java
try {  
    try {  
        int[] data = new int[2];  
        data[4] = 0;  
    } finally {  
        String s = null;  
        s.substring(0);  
    }  
} catch (ArrayIndexOutOfBoundsException e) {  
    e.printStackTrace();  
}
```

另一种异常丢失出现在 `finally` 中使用 `return`

```java
public static void test() {  
  
    try {  
        throw new Exception();  
    }finally {  
        return;  
    }  
}
```
