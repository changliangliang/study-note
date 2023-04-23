注解可以简单的理解为给类添加的额外信息，它本身并不会做任何事情，通常由其它程序识别后做出对应的处理，如 `@Override` 注解由编译器识别，会判断该注解标识的类是否重写正确。

## 内置注解

Java 中内置了三个注解：
- `@Override` ：表示方法重写了父类方法；
- `@Deprecated` ：表示该方法已经过期，不推荐使用；
- `@SuppressWarnings` ：关闭不当的编译器警告。

## 定义注解

我们也可以定义自己的注解，此时需要用到元注解，它们是专门用来定义注解的。

![](附件/image/Java注解_image_1.png)

如我们想要定义一个 `@Test` 注解, 它在类上使用，保留到运行时：

```java
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)  
@interface Test {  
	public int id() default 12;  
	public String name() default "chang";
}
```

此外注解还可以添加属性，定义的形式看上去向方法，而且可以定义默认值, 使用方式如下：

```java
@Test(id=12, name="liang")  
public class Main {  
}
```

## 注解的处理

注解本身只提供信息，我们要想使用这些注解需用在程序中使用反射获取这些信息。

```java
  
@Test(id=12, name="liang")  
public class Main {  
  
    public static void main(String[] args) {  
  
        Test test = Main.class.getAnnotation(Test.class);  
        if(test != null) {  
            System.out.println("==========");  
            System.out.println(test.id());  
            System.out.println(test.name());  
            System.out.println("==========");  
        }  
    }  
}
```

获取到注解信息后，我们可以根据信息做出各种的处理，如根据信息创建代理类等等。几乎所有的框架中都大量使用到了注解，用来方便我们使用，减少模板代码，它们要比上面的例子复杂的多，但本质上还是通过反射来获取注解信息，然后根据根据信息做特定的处理。

注解中的属性还可以是注解类型，处理方式跟其他类型一样：

```java
@interface Data {  
    int age();  
    String name();  
}  
  
@Retention(RetentionPolicy.RUNTIME)  
@interface Test {  
    int id();  
    Data data();  
  
}  
  
  
@Test(id=12, data = @Data(age = 12,name = "chang"))  
public class Main {  
  
    public static void main(String[] args) {  
  
        Test test = Main.class.getAnnotation(Test.class);  
        System.out.println(test.id());  
        Data data = test.data();  
        System.out.println(data.age());  
        System.out.println(data.name());  
  
    }  
}
```

