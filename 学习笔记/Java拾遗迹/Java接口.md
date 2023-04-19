## 接口是什么

接口是 Java 中对类的进一步抽象，用于描述具有同样的一个或多个方法的类。在接口中所有的方法都是空方法，都必须在实现类中实现，听起来很像只拥有抽象方法的抽象类，但实际上并非如此。

```java
interface Move {  
    void Move();  
}  
  
  
class Dog implements Move {  
  
    @Override  
    public void Move() {  
        System.out.println("用腿移动");  
    }  
}

class Car implements Move {  
  
    @Override  
    public void Move() {  
        System.out.println("用轮子移动");  
    }  
}
```

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

class Fish extends Animal {  
  
  
    @Override  
    public void move() {  
        System.out.println("游泳");  
    }  
}
```

上面两个例子展示了抽象类与接口的不同，抽象类是对一类事物的提炼，具有子类属于父类这样一层含义，如在 `Animal` 这样一个抽象类下放置狗和鱼这样的动物是合理的，但是如果要放置汽车就不太行了，虽然汽车像动物一样也是可以移动的。反之，接口只是对行为的一种提炼，任何能够移动的事物都可以放置在 `Move` 这样一个接口下。

## 实现多个接口

Java 中为了避免多继承引起的混乱，在类的继承方面值允许单继承，但是对于接口来说就没有这样的限制，一个类可以实现多个接口。

```java
interface A {  
    void f();  
}  
  
interface B {  
    void g();  
}  
  
class C implements A,B {  
  
    @Override  
    public void f() {  
          
    }  
  
    @Override  
    public void g() {  
  
    }  
}
```

不过这里有一个问题，如果实现的多个接口中具有同样签名的方法会怎么样，答案是没影响。但是如果有方法名和参数列表相同但是返回值不同的方法，此时就会出现问题，因为接口中的方法必须实现，但此时实现的方法只有返回值不同，而 Java 中只有返回值不同的方法并不属于方法重载的范畴，即此时无法通过编译。所以在创建接口的时候，因尽量避免这种情况发生。

## 接口中的属性

接口中可以添加属性，但都会默认变为 `public static final` 的，即使我们不添加这些关键字，因次接口中的属性只能通过接口来访问，还有一点需要注意的是，如果在接口中定义了属性，那么必须在属性定义的时候就进行赋值。

