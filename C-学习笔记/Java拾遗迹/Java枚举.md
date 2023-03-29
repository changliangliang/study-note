## values 和 valueOf 方法

```java
enum Day {  
    One,  
    Two,  
    Three  
}
```

查看枚举类的字节码文件，可以看到编译器自动添加了两个方法。

```java
// class version 52.0 (52)
// access flags 0x4030
// signature Ljava/lang/Enum<Lcom/liang/chapter19/test1/Day;>;
// declaration: com/liang/chapter19/test1/Day extends java.lang.Enum<com.liang.chapter19.test1.Day>
final enum com/liang/chapter19/test1/Day extends java/lang/Enum {

  // compiled from: Main.java

  // access flags 0x4019
  public final static enum Lcom/liang/chapter19/test1/Day; One

  // access flags 0x4019
  public final static enum Lcom/liang/chapter19/test1/Day; Two

  // access flags 0x4019
  public final static enum Lcom/liang/chapter19/test1/Day; Three

  // access flags 0x101A
  private final static synthetic [Lcom/liang/chapter19/test1/Day; $VALUES

  // access flags 0x9
  public static values()[Lcom/liang/chapter19/test1/Day;
   L0
    LINENUMBER 3 L0
    GETSTATIC com/liang/chapter19/test1/Day.$VALUES : [Lcom/liang/chapter19/test1/Day;
    INVOKEVIRTUAL [Lcom/liang/chapter19/test1/Day;.clone ()Ljava/lang/Object;
    CHECKCAST [Lcom/liang/chapter19/test1/Day;
    ARETURN
    MAXSTACK = 1
    MAXLOCALS = 0

  // access flags 0x9
  public static valueOf(Ljava/lang/String;)Lcom/liang/chapter19/test1/Day;
   L0
    LINENUMBER 3 L0
    LDC Lcom/liang/chapter19/test1/Day;.class
    ALOAD 0
    INVOKESTATIC java/lang/Enum.valueOf (Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
    CHECKCAST com/liang/chapter19/test1/Day
    ARETURN
   L1
    LOCALVARIABLE name Ljava/lang/String; L0 L1 0
    MAXSTACK = 2
    MAXLOCALS = 1

  // access flags 0x2
  // signature ()V
  // declaration: void <init>()
  private <init>(Ljava/lang/String;I)V
   L0
    LINENUMBER 3 L0
    ALOAD 0
    ALOAD 1
    ILOAD 2
    INVOKESPECIAL java/lang/Enum.<init> (Ljava/lang/String;I)V
    RETURN
   L1
    LOCALVARIABLE this Lcom/liang/chapter19/test1/Day; L0 L1 0
    MAXSTACK = 3
    MAXLOCALS = 3

  // access flags 0x100A
  private static synthetic $values()[Lcom/liang/chapter19/test1/Day;
   L0
    LINENUMBER 3 L0
    ICONST_3
    ANEWARRAY com/liang/chapter19/test1/Day
    DUP
    ICONST_0
    GETSTATIC com/liang/chapter19/test1/Day.One : Lcom/liang/chapter19/test1/Day;
    AASTORE
    DUP
    ICONST_1
    GETSTATIC com/liang/chapter19/test1/Day.Two : Lcom/liang/chapter19/test1/Day;
    AASTORE
    DUP
    ICONST_2
    GETSTATIC com/liang/chapter19/test1/Day.Three : Lcom/liang/chapter19/test1/Day;
    AASTORE
    ARETURN
    MAXSTACK = 4
    MAXLOCALS = 0

  // access flags 0x8
  static <clinit>()V
   L0
    LINENUMBER 4 L0
    NEW com/liang/chapter19/test1/Day
    DUP
    LDC "One"
    ICONST_0
    INVOKESPECIAL com/liang/chapter19/test1/Day.<init> (Ljava/lang/String;I)V
    PUTSTATIC com/liang/chapter19/test1/Day.One : Lcom/liang/chapter19/test1/Day;
   L1
    LINENUMBER 5 L1
    NEW com/liang/chapter19/test1/Day
    DUP
    LDC "Two"
    ICONST_1
    INVOKESPECIAL com/liang/chapter19/test1/Day.<init> (Ljava/lang/String;I)V
    PUTSTATIC com/liang/chapter19/test1/Day.Two : Lcom/liang/chapter19/test1/Day;
   L2
    LINENUMBER 6 L2
    NEW com/liang/chapter19/test1/Day
    DUP
    LDC "Three"
    ICONST_2
    INVOKESPECIAL com/liang/chapter19/test1/Day.<init> (Ljava/lang/String;I)V
    PUTSTATIC com/liang/chapter19/test1/Day.Three : Lcom/liang/chapter19/test1/Day;
   L3
    LINENUMBER 3 L3
    INVOKESTATIC com/liang/chapter19/test1/Day.$values ()[Lcom/liang/chapter19/test1/Day;
    PUTSTATIC com/liang/chapter19/test1/Day.$VALUES : [Lcom/liang/chapter19/test1/Day;
    RETURN
    MAXSTACK = 4
    MAXLOCALS = 0
}

```

`values` 方法可以获取该枚举所有的实例，`valueOf` 根据名称获取枚举实例。

```java
for (Day value : Day.values()) {  
  
    System.out.println(value);  
}

Day one = Day.valueOf("One");
```

## 添加方法

枚举和普通的类一样，也可以添加普通方法和构造方法。

```java
enum Day {  
    One(1),  
    Two(2),  
    Three(3);  
  
    private int v ;  
  
    Day(int v) {  
        this.v = v;  
    }  
  
    public int value() {  
        return this.v;  
    }  
  
  
}
```

```java
public static void main(String[] args) {  
    int value = Day.One.value();  
    System.out.println(value);  
}
```

需要注意的是如果写了带有参数的构造方法，那么在定义枚举的时候需要将参数传入 ` One(1)`，并且构造方法无法使用 `public` 修饰，因为它始终是 `private`，即使在 `Day` 内部编译器也会阻止我们实例化。

## Swich 语句

枚举因为是不可变类型，所以可以用于 swich 语句中：

```java
public static void main(String[] args) {  
    Day day = Day.One;  
    switch (day) {  
        case One:  
            System.out.println("One");  
            break;        case Two:  
            System.out.println("two");  
            break;        default:  
            System.out.println("Three");  
    }  
}
```


## 实现方法

```java
enum Data {  
    Week {  
        @Override  
        public String toString() {  
            return "星期";  
        }  
    },  
  
    Month {  
        @Override  
        public String toString() {  
            return "月份";  
        }  
    };  
  
  
    public String toString() {  
        return super.toString();  
    }  
  
}
```