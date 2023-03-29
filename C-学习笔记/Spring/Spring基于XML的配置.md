## 创建容器

`ClassPathXmlApplicationContext`是`ApplicationContext`类的一个实现，用来加载`xml`配置文件生成容器。

```java
ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:/bean.xml");
Object student = applicationContext.getBean("student");
System.out.println(student.getClass());
```

## Bean 定义




配置文件的一般形式如下，其中每一个`bean`标签都表示一个对象的定义，Spring 创建容器的过程中，会读取配置文件中的定义的`bean`，之后可以根据`bean`中的各种信息创建对象实例。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean id="hello" class="com.chang.Car">
        <property name="name" value="Spring"/>
    </bean>
</beans>
```

### id 属性

每一个`bean`都有一个`id`属性，它是`bean`的唯一标识，可以通过`id`属性从容器中获得`bean`，在同一个容器中所用的`id`属性应该是不同的。下面的例子展示了如和通过`id`获取对应的`bean`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean id="student" class="com.chang.bean.Student">
        <property name="name" value="chang"/>
    </bean>
</beans>
```

```java
Object student = applicationContext.getBean("student");
```

如果在`bean`的定义中没有指定`id`的化，`Spring`会分配一个默认的`id`属性给该`bean`，例如下面定义的`bean`，Spring 给他的默认`id`可能为`com.liang.bean.Student#0`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean class="com.chang.bean.Student">
        <property name="name" value="chang"/>
    </bean>
</beans>
```

### class属性

`bean`标签中的`class`属性值为一个全类名，它表示该`bean`的类型，从容器中获取`bean`的时候，也可以根据类型来获取。

```java
Object student = applicationContext.getBean(Student.class);
```

### name 属性

`name`属性可以用来个`bean`起一个或多个别名，起多个别名的时候要用逗号、分号或空格隔开，如下所示：

```xml
<bean name="studentBean bean" class="com.liang.bean.StudentBean"/>
```

### alias 属性

`alias`标签也可以用来给`bean`起别名，其中`alias`属性是别名，`name`属性是对应该别名的`bean`的`id`。

```xml
<alias name="fromName" alias="toName"/>
```

## 工厂方法创建Bean

前文中展示了`bean`最通常的配置方法，使用那样的配置时，创建`bean`时候是调用了对应类的构造方法。

在有些代码中，为了实现程序的低耦合，创建实例的时候通常不会直接调用类的构造函数，而是使用一些工厂方法，针对这种情况，Spring也提供了支持。

### 静态工厂方法

使用静态工厂方法创建 `bean` 实例时，`class` 属性也必须指定，但此时 `class` 属性并不是指定 `bean` 的类型，而是该`bean`对应的静态工厂类，因为 Spring 需要知道是用哪个工厂来创建 Bean 实例。另外，还需要使用`factory-method`属性来指定静态工厂方法名，Spring 将调用静态工厂方法，来返回一个`bean`。一旦获得了指定 `bean` 实例，Spring 后面的处理步骤与采用普通方法创建 `bean` 实例则完全一样。需要注意的是，当使用静态工厂方法来创建 `bean` 时，这个 `factory-method` 必须要是静态的。

```java
public class Car {

    private String name;

    private int age;
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class StaticFactory {
  
   public static Car getCar(String name) {
        Car car = new Car();
        car.setName(name);
        return car;
   } 
}
```

这里 `constructor-arg` 标签用于指定工厂方法需要的参数，`property` 标签用于注入属性，此处简单知道作用即刻，后面会对这两个标签详细展开。  

```xml
<bean id="car" class="com.liang.StaticFactory" factory-method="getCar">
     <constructor-arg value="Maserati"/>
     <property name="age" value="12"/>
</bean>
```

### 实例工厂方法

既然有了静态工厂方法，那么必然会有实例工厂方法，两者的区别仅在于前者方法属于类，后者方法属于对象实例。

```java
public class Car {

    private String name;

    private int age;

  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class CarFactory {
  
   public Car getCar(String name) {
        Car car = new Car();
        car.setName(name);
        return car;
   } 
}
```

既然是实例工厂方法，那么首先需要创建出对应的实例，也就是下面第一行中的定义。之后再正真定义`bean`的时候，不在需要`class`属性了，而是需要使用`factory-bean`属性来指定工厂实例，同时使用`factory-method`指定定的工厂方法。如果工厂方法有参数或者需要在创建`bean`之后注入属性，也可以使用`constructor-arg`和`property`两个标签。

```xml
<bean id="carfactory" class="com.liang.CarFactory"></bean>

<bean factory-bean="carfactory" factory-method="getCar">
    <constructor-arg value="Maserati"/>
    <property name="age" value="12"/>
</bean>
```

## FactoryBean

Spring 中有两种类型的 `bean`，一种是普通的 `bean`，另一种是工厂 `bean`，即 `FactoryBean` 。工厂 `bean` 跟普通 `bean` 不同，其返回的对象不是指定类的一个实例，而是该工厂 `bean` 的 `getObject` 方法返回的对象。

```java
public interface FactortBean {
    //返回实例
    Object getObject() throws Exception;
    //返回类型
    class getObjectType();
    //返回的实例是否为单例
    boolean isSingleton();
}
```

上面是`FactoryBean`接口，下面我们看一下它的具体使用。

```java
public class Car {

    private String name;

    private int age;

    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class CarFactoryBean implements FactoryBean{

    private String name;
    private int age;
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  

    public Object getObject() throws Exception {
        Car car = new Car();
        car.setName(this.name);
        car.setAge(this.age);
        return car;
    }
   
    public Class<?> getObjectType() {  //注意这个方法主要作用是：该方法返回的类型是在ioc容器中getbean所匹配的类型
        return Car.class;
    }
  
    public boolean isSingleton() {
        return true;
    }
}
```

我们在定义中没有添加`Car`，而是直接在容器中添加了一个`CarFactoryBean`，不过如果从容器中获取`id`为`car`的`bean`时，获得并不是`CarFactoryBean`的实例，而是`Car`的实例。这是应为Spring首先创建了一个`CarFactoryBean`的实例，然后调用了`getObject`方法获取返回值，并将该返回值作为`id`对应的实例。

```xml
<bean id="car" class="com.liang.CarFactoryBean">
     <property name="name" value="chang"/>
     <property name="age" value="12"/>
</bean>
```

## 导入其他配置

在一个项目中，Spring可能会管理分属不同业务的`bean`，如果将所有的`bean`定义在同一个配置文件中，会显得比较混乱。那么可以将不同业务的`bean`定义在不同的配置文件中，然后再将其汇总。通过下面的方式，可以导入其他的配置到当前配置中。

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

所有路径都相对于当前配置文件，因此`services.xml`必须与进行导入的文件位于同一目录或位置，而`messageSource.xml`和`themeSource.xml`必须位于导入文件位置下方的`resources`位置开头的斜杠会被忽略，所以通常建议省去斜杠。

除了使用相对路径，还可以使用`classpath:/com/liang/bean.xml`以及`file:C:/config/services.xml`这样的绝对路径。

不同配置文件中的`bean`如果有相同的`id`，即使是不相同的类，先定义的会把后定义的类覆盖掉。

除了使用这种方法汇总不同的配置文件，在创建容器的时候也支持添加多个文件，如下面的代码所示。

```java
ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:/bean.xml", "classpath:/bean2.xml");
```

## 依赖注入

所谓的依赖注入，简单的理解就是给实例中的属性赋值，比如下面的类，在创建了对象之后，通常要对`age`和`name`两个属性赋值。

```java
public class Car {

    private String name;

    private int age;

    public Car() { 
    }

    public Car(String name, int age) {
        this.name = name;
        this.age = age;
    }
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

在 Sping 中有两种依赖注入的方式，一种是通过构造函数，一种是通过`setter`方法，也就是对应了我们编程时给对象属性赋值的两种方法。

```java
Car carOne = new Car("chang", 12);

Car carTwo = new Car();
carTwo.setName("liang");
carTwo.setAge(13);
```

调用的带参数的构造方法创建对象实例后，任然可以使用`set`方法更新属性值，所以在 Spring 中`setter`方法可用于覆盖构造函数中配置的依赖，构造函数一般用于强制性依赖，`setter`方法用于可选依赖。

### 基于构造函数注入

```java
public class TeacherBean {

    private String name;
    
    private StudentBean student;

    public TeacherBean(String name, StudentBean student) {
        this.name = name;
        this.student = student;
    }

}
```

当类的属性是通过构造函数赋值的时候，在定义`bean`的时候就需要基于构造函数将属性注入，通常配置如下：

```xml
<beans>
    <bean id="teacher" class="con.liang.TeacherBean">
        <constructor-arg value="chang"/>
        <constructor-arg ref="student"/>
    </bean>

    <bean id="student" class="com.liang.StudentBean"/>
</beans>
```

其中`<constructor-arg value="chang"/>`指定一个基本类型的参数，`<constructor-arg ref="student"/>`指定一个对象。

上面的示例中两个参数比较容易区分，如果两个参数都是基本类型或属于同一个类，则需要额外属性进行辅助，看下面的例子：

```java
public class TeacherBean {

    private String name;
    private int age;

    public TeacherBean(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

* 可以通过 `type` 指定类型进行区分。

  这个时候如果还是只用不带任何属性的`canstructor-arg`标签的话，Spring 是无法分清楚`1`这个值时赋给`name`还是`age`的，因为无法区分`1`这个字面值到底是数字还是字符串。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
       <constructor-arg value="1"/>
       <constructor-arg value="2"/>
   </bean>
  ```

  使用`type`属性就可以解决这个问题，下面的配置中就明确指明了`1`要赋给一个字符串类型，但这种方法也有缺点，如果多个参数类型相同的话，就无法使用了。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
       <constructor-arg type="java.lang.String" value="1"/>
       <constructor-arg type="int" value="2"/>
   </bean>
  ```
* 可以指定索引进行区分。

  这个方法比较好理解，直接使用参数在参数列表中的序号定位即可，比如下面的配置，将`1`赋给 0 号位的参数。

  ```xml
  <bean id="teacher"  class="com.liang.bean.TeacherBean">
      <constructor-arg index="0" value="1"/>
      <constructor-arg index="1" value="2"/>
  </bean>
  ```
* 可以指定属性名进行区分。

  这个也是比较清晰，使用参数名来对应值。

  ```xml
  <bean id="teacher"  class="com.liang.bean.TeacherBean">
      <constructor-arg name="name" value="1"/>
      <constructor-arg name="age" value="2"/>
  </bean>
  ```

### 基于Setter注入

在不通过构造方法注入时，Spring 需要首先调用类中无参数的构造函数进行实例化，之后再通过`setter`方法注入属性，所以必须保证无参数的构造函数以及`setter`方法存在。

```java
public class TeacherBean {
    private String name;
    private int age;   
}
```

对于上面的这个类，如果需要实现属性注入，配置如下：

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean">
    <property name="name" value="12" />
    <property name="age" value="122" />
</bean>
```

如果注入的属性时一个对象时，可以使用`​ <property name="student" ref="student" />`这样的方式：

```xml
<beans>
    <bean id="teacher" class="con.liang.TeacherBean">
        <property name="name" value="12" />
    	<property name="student" ref="student" />
    </bean>

    <bean id="student" class="com.liang.StudentBean"/>
</beans>
```

### 注入配置细节

#### 常量注入

- 字面值: 可用字符串表示的值，可以通过  `value` 属性或标签进行注入。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
          <property name="name" value="12" />
          <property name="age">
                  <value>12</value>
          </property >
   </bean>
  ```
- 支持将`value`标签中的字符串转化为`java.util.Properties`类

  ```xml
  <!-- typed as a java.util.Properties -->
  <property name="properties">
      <value>
          jdbc.driver.className=com.mysql.jdbc.Driver
          jdbc.url=jdbc:mysql://localhost:3306/mydb
      </value>
  </property>
  ```
- 基本数据类型及其封装类、String 等类型都可以采取字面值注入的方式
- 若字面值中包含特殊字符，可以使用 <![CDATA[]]> 把字面值包裹起来。

#### Bean 注入

* 可以用`ref`属性或标签引入外部类

  ```xml
  <bean id="addr" class="com.chang.pojo.Address">
      <property name="address" value="重庆"/>
  </bean>

  <!-- 使用ref属性 -->
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address" ref="addr"/>
  </bean>

  <!-- 使用标签 -->
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address">
          <ref bean="addr"/>
      </property>
  </bean>
  ```

  用`ref`标签的`parent`属性可以从父容器中获的`bean`

  ```xml
  <!-- in the parent context -->
  <bean id="accountService" class="com.something.SimpleAccountService">
      <!-- insert dependencies as required as here -->
  </bean>
  ```

  ```xml
  <!-- in the child (descendant) context -->
  <bean id="accountService" <!-- bean name is the same as the parent bean -->
      class="org.springframework.aop.framework.ProxyFactoryBean">
      <property name="target">
          <ref parent="accountService"/> <!-- notice how we refer to the parent bean -->
      </property>
      <!-- insert other configuration and dependencies as required here -->
  </bean>

  ```
* 可以使用`idref`代替`ref`标签

  使用`idref`标签在容器部署的时候会验证`bean`是否存在。

  ```xml
  <bean id="theTargetBean" class="..."/>
  <bean id="theClientBean" class="...">
      <property name="targetName">
          <idref bean="theTargetBean"/>
      </property>
  </bean>
  ```
* 可以使用内部类

  ```xml
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address">
          <bean id="addr" class="com.chang.pojo.Address">
      		<property name="address" value="重庆"/>
  	</bean>
      </property>
  </bean>
  ```

  内部类不用指明`id` 和`name`属性，但不能用于其他地方。
* Spring 支持使用级联属性赋值。

  ```xml
  <bean id="addr" class="com.chang.pojo.Address">
      <property name="address" value="重庆"/>
  </bean>

  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address" ref="addr"/>
      <property name="adderss.address" value="重庆"/>
  </bean>
  ```

#### 数组注入

```xml
<bean id="student" class="com.kuang.pojo.Student">
    <property name="name" value="小明"/>
    <property name="address" ref="addr"/>
    <property name="books">
        <array>
            <value>西游记</value>
            <value>红楼梦</value>
            <value>水浒传</value>
        </array>
    </property>
</bean>
```

#### List 注入

```xml
<property name="someList">
    <list>
        <value>a list element followed by a reference</value>
        <ref bean="myDataSource" />
    </list>
</property>
```

#### Map 注入

```xml
<property name="someMap">
    <map>
        <entry key="an entry" value="just some string"/>
        <entry key ="a ref" value-ref="myDataSource"/>
    </map>
</property>
```

#### set 注入

```xml
<property name="someSet">
    <set>
        <value>just some string</value>
        <ref bean="myDataSource" />
    </set>
</property>
```

#### Properties 注入

```xml
<property name="info">
    <props>
        <prop key="学号">20190604</prop>
        <prop key="性别">男</prop>
        <prop key="姓名">小明</prop>
    </props>
</property>
```

#### 集合合并

`bean`标签中有一个属性为`abstract`，默认情况下该值为`false`，如果将他设置为`true`的话，那么容器将不会创建它的实例。它需要和`parent`配合使用，姑且可以将`abstrcat`属性的`bean`称为父`bean`，将带有`parent`属性的`bean`称为子`bean`，父`bean`中的`property`标签会被继承到子`bean`中，比如下面的例子中，`<property name="name" value = "chang"/>`会被自动添加到子`bean`中。

```xml
<beans>
    <bean id="parent" abstract="true" class="example.ComplexObject">
        <property name="name" value = "chang"/>
        <property name="adminEmails">
            <props>
                <prop key="administrator">[emailprotected]</prop>
                <prop key="support">[emailprotected]</prop>
            </props>
        </property>
    </bean>
    <bean id="child" parent="parent">
        <property name="adminEmails">
            <!-- the merge is specified on the child collection definition -->
            <props merge="true">
                <prop key="sales">[emailprotected]</prop>
                <prop key="support">[emailprotected]</prop>
            </props>
        </property>
    </bean>
<beans>
```

子`bean`如果和父`bean`定义了相同的属性，那么后者会把前者的值覆盖。不过如果属性是集合的话，可以开启集合的合并行为，目前合并行为适用于`<list/>`，`<map/>`、`<set/>`和`<properties>`集合类型，需要做的是将`merge`属性设置为`true`。

在合并`List`元素时父`bean`的值位于所有子级列表的值之前，对于`Map`，`Set`和`Properties`集合类型，会继承所有父级中的元素，对于`key`相同的元素会进行覆盖。

#### 空字符串和null 值注入

```xml
<!-- 等价于 wife = null -->
<property name="wife"><null/></property>
<!-- 等价于 email = "" -->
<property name="email" value=""/>
```

#### 注入拓展: P 命名空间

在`beans`中添加`xmlns:p="http://www.springframework.org/schema/p"`可以开启P命名空间，作用是可以使用类似`p:email`的属性替代`property`标签。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="classic" class="com.example.ExampleBean">
        <property name="email" value="[emailprotected]"/>
    </bean>

    <bean name="p-namespace" class="com.example.ExampleBean"
        p:email="[emailprotected]"/>
</beans>
```

#### 注入拓展: c 命名空间

在`beans`中添加`xmlns:c="http://www.springframework.org/schema/c"`可以开启C命名空间，作用是使用类似`c:thingTwo-ref`的属性替代`constructor-arg`标签。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="thingOne" class="x.y.ThingTwo"/>
    <bean id="thingTwo" class="x.y.ThingThree"/>

    <!-- traditional declaration -->
    <bean id="thingOne" class="x.y.ThingOne">
        <constructor-arg ref="thingTwo"/>
        <constructor-arg ref="thingThree"/>
        <constructor-arg value="[emailprotected]"/>
    </bean>

    <!-- c-namespace declaration -->
    <bean id="thingOne" class="x.y.ThingOne" c:thingTwo-ref="thingTwo" c:thingThree-ref="thingThree" c:email="[emailprotected]"/>

</beans>
```

#### util 里的集合标签

使用基本的集合标签定义集合时 , 不能将集合作为独立的 `bean` 定义 , 导致其他 `bean` 无法引用该集合 , 无法让集合在不同 `bean` 之间共享。在`beans`中添加`xmlns:util="http://www.springframework.org/schema/util"`可以开启集合标签，它实现了集合类型的独立定义。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <util:list id="list">
        <ref bean="car1"/>
        <ref bean="car2"/>
        <ref bean="car3"/> 
        <ref bean="car4"/>
    </util:list>

    <bean id="car1" class="com.chang.Car"></bean>
    <bean id="car2" class="com.chang.Car"></bean>
    <bean id="car3" class="com.chang.Car"></bean>
    <bean id="car4" class="com.chang.Car"></bean>
  
    <bean id="person" class="com.chang.Person">
        <property name="car" ref="list"/>
    </bean>
</beans>
```

## 自动装配

Spring 容器可以自动装配`bean`，需要使用`autowire`属性里指定自动装配的模式。这个自动装配可以简单的理解为，如果一个`bean`的某个属性类型为`A`，当容器中存在一个类型为`A`的`bean`时，Spirng 可以自动将`A`类型的`bean`赋给该属性。

```java
public class User {

    private Car car;
}

public class Car {

}
```

在下面的配置中，`id`为`car`的`bean`会自动被赋给`user`的`car`属性。

```xml
<bean id="user" class="com.liang.User" autowire="byName"></bean>
<bean id="car" class="com.liang.Car"></bean>
```

`autowire`的可选值有多个，分别代表不同的装配模式：

* `no`：默认值，表示不进行自动装配，所有的`bean` 引用必须由手动定义。对于大型部署，建议不要更改默认设置，因为明确指定协作者可以提供更好的控制和清晰度，在某种程度上，它记录了系统的结构。
* `byName`：按属性名称自动装配， Spring 会寻找与属性同名的`bean`。例如，如果一个 `bean` 包含一个 `master`属性，那么 Spring 将查找一个名为`master` 的 `bean` 来为它赋值。
* `byType`：与`byName`类似，只不过它查找`bean`的依据是属性的类型。
* `constructor`：类似于 `byType`，但它适用于构造函数的情况。

在`byType`或`constructor`自动装配模式下，可以自动按类型装配数组或集合。如果使用的是`map`并且`key`是`String`类型，则使用`bean`的`id`属性作为`key`。

```java
public class TeacherBean {

   private StudentBean[] students;

    public void setStudents(StudentBean[] students) {
        this.students = students;
    }
}

public class StudentBean {

}
```

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean" autowire="byType" />

<bean class="com.liang.bean.StudentBean"/>
<bean class="com.liang.bean.StudentBean"/>
```

`bean`中还有一个属性`autowire-candidate`，将它设置为`false`后，该`bean`不参与按类型自动装配，但是不影响按名字装配。

```xml
<bean class="com.liang.bean.StudentBean" autowire-candidate="false"/>
```

## 继承和依赖

### 继承

Spring 允许继承 `bean` 的配置，被继承的`bean`称为父`​ bean`，继承这个父`Bean`的 `Bean ​`称为子 `Bean`，前面在集合合并中简单的提过，这里详细讲解一下。子 `bean ​`从父 `bean ​`中继承配置，包括 `bean`的属性配置，子 `bean` 也可以覆盖从父`bean`继承过来的配置。父`bean` 可以作为配置模板，也可以作为 `bean`实例。若只想把父`bean`作为模板, 可以设置`bean`的 `abstract ​`属性为`​ true`，这样 Spring 将不会实例化这个 `bean`，并不是 `bean`元素里的所有属性都会被继承，比如: `autowire`, `abstract` 等。

```xml
<bean id="parent" abstract="true">
    <property name="parentName">
        <value></value>
    </property>
</bean>

<bean id="child" class="com.spring.auto.autowire.Parent" parent="parent">
    <property name="parentName">
        <value>抽象类实现</value>
    </property>
</bean>
```

### 依赖

Spring 允许用户通过`depends-on`属性设定 `bean`前置依赖的`bean`，前置依赖的`bean` 会在本 `bean` 实例化之前创建好。如果前置依赖于多个`bean`，则可以通过逗号，空格隔开的方式配置 `bean` 的名称。

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager,accountDao">
    <property name="manager" ref="manager" />
</bean>

<bean id="manager" class="ManagerBean" />
<bean id="accountDao" class="x.y.jdbc.JdbcAccountDao" />
```

## 懒加载

一般情况下，容器创建的时候`bean`就会被加载，有时候不需要`bean`加载这么早，就可以使用懒加载，这时候`bean`会在获取的时候才被创建。

```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

如果希望所有的`bean`都实现懒加载，那么可以将`beans`上的`default-lazy-init`属性设置为`true`。

```xml
<beans default-lazy-init="true">
</beans>
```

## 方法注入

属性中的`bean`只有一次注入的机会，后续使用的都是同一个`bean`，有的时候我们希望每次可以使用不同的`bean`，这个时候就可以用到方法注入。

### ApplicationContextAware 接口

实现上述需求的一种方法是实现`ApplicationContextAware`接口给`bean`注入容器，每次通过容器获取新的`bean`，不过这种方法耦合度比较大，一般不推荐使用。

```java
public class TeacherBean implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    public StudentBean student() {
        return (StudentBean) applicationContext.getBean("student");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```

### 查找方法注入

Sping可以通过重写字节码生成子类覆盖父类的方法实现注入。

```java
public class TeacherBean  {
    
    public StudentBean student() {
        return null;
    }
}
```

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean">
    <lookup-method name="student" bean="student" />
</bean>

<bean id="student" class="com.liang.bean.StudentBean" scope="prototype" />
```

注入的方法签名应该满足如下格式：

```java
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

## Bean 的作用域

在 `bean`标签里可以设置`scope`属性设置`bean`的作用域，不同的作用域有不同的效果。

```xml
<bean id="ServiceImpl" class="cn.csdn.service.ServiceImpl" scope="singleton">
```

* `singleton`：默认的作用域，可以理解为单例模式，每个从容器中获得的`bean`都是同一个。
* `protptype`：每次获取`bean`的时候，Spring都会创建一个新的出来。

除此以外还有`request`、`session`、`application`和`websocket`作用域，不过最常使用的还是`singleton`和`protptype`作用域。

## 自定义Bean的性质

### 生命周期回调

在 Spring 框架内部使用`BeanPostProcessor`来处理它可以找到的任何回调接口并调用适当的方法，例如可以实现 Spring 的`InitializingBean`和`DisposableBean`接口。

#### 初始化回调

如果我们想要在`bean`初始化的时候做一些事情，可以实现`InitializingBean`接口，Spring 会在设置完属性后调用`afterPropertiesSet`方法。

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

```java
public class AnotherExampleBean implements InitializingBean {

    public void afterPropertiesSet() {
        // do some initialization work
    }
}
```

上面这种情况耦合度比较大，Spring 提供了另一种可以实现相同功能的方式，`init-method`可以用来指定一个方法，`bean`属性设置完成后会执行该方法。

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
```

```java
public class ExampleBean {

    public void init() {
        // do some initialization work
    }
}
```

#### 销毁回调

和初始化回调一样，销毁时也可以做一些事情。

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

```java
public class AnotherExampleBean implements DisposableBean {

    public void destroy() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

Spring 也提供了类似`init-method`的`destroy-method`方法，来实现解耦的目的。

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="cleanup"/>
```

```java
public class ExampleBean {

    public void cleanup() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

#### 默认初始化和销毁回调

在`beans`标签中可以使用`default-init-method`和`default-destroy-method`属性给所有`bean`设置默认的初始化合销毁回调，可以避免对每个`bean`都设置一遍。

#### 使用注解

除了上面提到的，还可以使用`@PostConstruct` 和`@PreDestroy`注解，不过首先需要开启注解，此处只要了解即可，对注解支持的介绍会在后续文章中。

```xml
<context:annotation-config/>
```

之后需要在方法上进行标注，其中`@PostConstruct` 标注的方法会在属性设置后被执行，`@PreDestroy`标注的方法会在`bean`被销毁前执行。

```java
public class TeacherBean  {

    @PostConstruct
    public void init() {
        System.out.println("init");
    }

    @PostConstruct
    public void close() {
        System.out.println("close");
    }
}
```

一个`bean`如果使用不同的方法配置了生命周期函数，则每个函数都会被执行，如果是同名的函数，也会被执行多次。

### ApplicationContextAware 

`ApplicationContextAware`接口用于获取`ApplicationContext`，在创建`bean`过程中，如果`bean`实现了`ApplicationContextAware`接口，Spring 会调用它的`setApplicationContext`方法。

```java
public interface ApplicationContextAware {

    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

### BeanNameAware 

与`ApplicationContextAware`功能类似，如果一个实现了`BeanNameAware`接口，那么Spring 会调用它的`setBeanName`方法，并将`bean`的`id`作为参数传入。

```java
public interface BeanNameAware {

    void setBeanName(String name) throws BeansException;
}
```

## 集成接口

Spring 中可以通过插入特殊集成接口的实现来扩展 Spring IoC 容器。

### 使用 BeanPostProcessor 自定义 Bean

`BeanPostProcessor`接口定义了回调方法，通过实现可以实现这些回调方法我们可以覆盖容器的默认的实例化逻辑、依赖项解析逻辑等。如果您想在 Spring 容器完成实例化，配置和初始化 bean 之后实现一些自定义逻辑，则可以插入一个或多个`BeanPostProcessor`实现。如果配置了多个`BeanPostProcessor`实例，可以通过设置`order`属性来控制这些`BeanPostProcessor`实例的执行顺序，这需要`BeanPostProcessor`实现`Ordered`接口。

```java
public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization");
        return bean;
    }
}
```

`​ postProcessBeforeInitializationa`在`bean`属性注入之后、初始化之前执行，在该方法中可以用来修改已经注入的属性，或者返回全新的`bean`等，`postProcessAfterInitialization`在`bean`初始化后执行。

### 使用 BeanFactoryPostProcessor 自定义配置元数据

`BeanFactoryPostProcessor`接口的语义与`BeanPostProcessor`相似，但有一个主要区别：`BeanFactoryPostProcessor`对 `bean` 配置元数据进行操作。也就是说，Spring IoC 容器允许`BeanFactoryPostProcessor`读取配置元数据，在`bean`实例化之前对`bean`的定义做出修改，比如改变`bean`的类型。如果配置多个`BeanFactoryPostProcessor`，与`BeanPostProcessor`的情况类似。

`PropertyPlaceholderConfigurer`是一个`BeanFactoryPostProcessor`的实现类，它可以用来使用外部文件中的值来替代 Spring 配置文件中的值，例如下面配置数据库的例子。

```xml
<bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
    <property name="locations" value="classpath:com/something/jdbc.properties"/>
</bean>

<bean id="dataSource" destroy-method="close"
        class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="${jdbc.driverClassName}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

可以使用如下命名空间做为代替：

```xml
<context:property-placeholder location="classpath:com/something/jdbc.properties"/>
```

### 使用 FactoryBean 自定义实例化逻辑

对于一些初始化比较复杂的类，可以使用前面提到的`FactoryBean`注入到容器中，在调用`ApplicationContext`的`getBean()`方法时，如果想要获得`FactoryBean`本省，需要在`bean`的`id`前面加上一个符号`&`，如`getBean("&myBean")`。

‍
## 创建容器

`ClassPathXmlApplicationContext`是`ApplicationContext`类的一个实现，用来加载`xml`配置文件生成容器。

```java
ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:/bean.xml");
Object student = applicationContext.getBean("student");
System.out.println(student.getClass());
```

## Bean定义

配置文件的一般形式如下，其中每一个`bean`标签都表示一个对象的定义，Spring 创建容器的过程中，会读取配置文件中的定义的`bean`，之后可以根据`bean`中的各种信息创建对象实例。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean id="hello" class="com.chang.Car">
        <property name="name" value="Spring"/>
    </bean>
</beans>
```

### id 属性

每一个`bean`都有一个`id`属性，它是`bean`的唯一标识，可以通过`id`属性从容器中获得`bean`，在同一个容器中所用的`id`属性应该是不同的。下面的例子展示了如和通过`id`获取对应的`bean`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean id="student" class="com.chang.bean.Student">
        <property name="name" value="chang"/>
    </bean>
</beans>
```

```java
Object student = applicationContext.getBean("student");
```

如果在`bean`的定义中没有指定`id`的化，`Spring`会分配一个默认的`id`属性给该`bean`，例如下面定义的`bean`，Spring 给他的默认`id`可能为`com.liang.bean.Student#0`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">  
   
    <bean class="com.chang.bean.Student">
        <property name="name" value="chang"/>
    </bean>
</beans>
```

### class属性

`bean`标签中的`class`属性值为一个全类名，它表示该`bean`的类型，从容器中获取`bean`的时候，也可以根据类型来获取。

```java
Object student = applicationContext.getBean(Student.class);
```

### name 属性

`name`属性可以用来个`bean`起一个或多个别名，起多个别名的时候要用逗号、分号或空格隔开，如下所示：

```xml
<bean name="studentBean bean" class="com.liang.bean.StudentBean"/>
```

### alias 属性

`alias`标签也可以用来给`bean`起别名，其中`alias`属性是别名，`name`属性是对应该别名的`bean`的`id`。

```xml
<alias name="fromName" alias="toName"/>
```

## 工厂方法创建Bean

前文中展示了`bean`最通常的配置方法，使用那样的配置时，创建`bean`时候是调用了对应类的构造方法。

在有些代码中，为了实现程序的低耦合，创建实例的时候通常不会直接调用类的构造函数，而是使用一些工厂方法，针对这种情况，Spring也提供了支持。

### 静态工厂方法

使用静态工厂方法创建 `bean` 实例时，`class` 属性也必须指定，但此时 `class` 属性并不是指定 `bean` 的类型，而是该`bean`对应的静态工厂类，因为 Spring 需要知道是用哪个工厂来创建 Bean 实例。另外，还需要使用`factory-method`属性来指定静态工厂方法名，Spring 将调用静态工厂方法，来返回一个`bean`。一旦获得了指定 `bean` 实例，Spring 后面的处理步骤与采用普通方法创建 `bean` 实例则完全一样。需要注意的是，当使用静态工厂方法来创建 `bean` 时，这个 `factory-method` 必须要是静态的。

```java
public class Car {

    private String name;

    private int age;
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class StaticFactory {
  
   public static Car getCar(String name) {
        Car car = new Car();
        car.setName(name);
        return car;
   } 
}
```

这里`constructor-arg`标签用于指定工厂方法需要的参数，`property`标签用于注入属性，此处简单知道作用即刻，后面会对这两个标签详细展开。

```xml
<bean id="car" class="com.liang.StaticFactory" factory-method="getCar">
     <constructor-arg value="Maserati"/>
     <property name="age" value="12"/>
</bean>
```

### 实例工厂方法

既然有了静态工厂方法，那么必然会有实例工厂方法，两者的区别仅在于前者方法属于类，后者方法属于对象实例。

```java
public class Car {

    private String name;

    private int age;

  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class CarFactory {
  
   public Car getCar(String name) {
        Car car = new Car();
        car.setName(name);
        return car;
   } 
}
```

既然是实例工厂方法，那么首先需要创建出对应的实例，也就是下面第一行中的定义。之后再正真定义`bean`的时候，不在需要`class`属性了，而是需要使用`factory-bean`属性来指定工厂实例，同时使用`factory-method`指定定的工厂方法。如果工厂方法有参数或者需要在创建`bean`之后注入属性，也可以使用`constructor-arg`和`property`两个标签。

```xml
<bean id="carfactory" class="com.liang.CarFactory"></bean>

<bean factory-bean="carfactory" factory-method="getCar">
    <constructor-arg value="Maserati"/>
    <property name="age" value="12"/>
</bean>
```

## FactoryBean

Spring 中有两种类型的 `bean`，一种是普通的 `bean`，另一种是工厂 `bean`，即 `FactoryBean` 。工厂 `bean` 跟普通 `bean` 不同，其返回的对象不是指定类的一个实例，而是该工厂 `bean` 的 `getObject` 方法返回的对象。

```java
public interface FactortBean {
    //返回实例
    Object getObject() throws Exception;
    //返回类型
    class getObjectType();
    //返回的实例是否为单例
    boolean isSingleton();
}
```

上面是`FactoryBean`接口，下面我们看一下它的具体使用。

```java
public class Car {

    private String name;

    private int age;

    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

```java
public class CarFactoryBean implements FactoryBean{

    private String name;
    private int age;
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  

    public Object getObject() throws Exception {
        Car car = new Car();
        car.setName(this.name);
        car.setAge(this.age);
        return car;
    }
   
    public Class<?> getObjectType() {  //注意这个方法主要作用是：该方法返回的类型是在ioc容器中getbean所匹配的类型
        return Car.class;
    }
  
    public boolean isSingleton() {
        return true;
    }
}
```

我们在定义中没有添加`Car`，而是直接在容器中添加了一个`CarFactoryBean`，不过如果从容器中获取`id`为`car`的`bean`时，获得并不是`CarFactoryBean`的实例，而是`Car`的实例。这是应为Spring首先创建了一个`CarFactoryBean`的实例，然后调用了`getObject`方法获取返回值，并将该返回值作为`id`对应的实例。

```xml
<bean id="car" class="com.liang.CarFactoryBean">
     <property name="name" value="chang"/>
     <property name="age" value="12"/>
</bean>
```

## 导入其他配置

在一个项目中，Spring可能会管理分属不同业务的`bean`，如果将所有的`bean`定义在同一个配置文件中，会显得比较混乱。那么可以将不同业务的`bean`定义在不同的配置文件中，然后再将其汇总。通过下面的方式，可以导入其他的配置到当前配置中。

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

所有路径都相对于当前配置文件，因此`services.xml`必须与进行导入的文件位于同一目录或位置，而`messageSource.xml`和`themeSource.xml`必须位于导入文件位置下方的`resources`位置开头的斜杠会被忽略，所以通常建议省去斜杠。

除了使用相对路径，还可以使用`classpath:/com/liang/bean.xml`以及`file:C:/config/services.xml`这样的绝对路径。

不同配置文件中的`bean`如果有相同的`id`，即使是不相同的类，先定义的会把后定义的类覆盖掉。

除了使用这种方法汇总不同的配置文件，在创建容器的时候也支持添加多个文件，如下面的代码所示。

```java
ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:/bean.xml", "classpath:/bean2.xml");
```

## 依赖注入

所谓的依赖注入，简单的理解就是给实例中的属性赋值，比如下面的类，在创建了对象之后，通常要对`age`和`name`两个属性赋值。

```java
public class Car {

    private String name;

    private int age;

    public Car() { 
    }

    public Car(String name, int age) {
        this.name = name;
        this.age = age;
    }
  
    public void setAge( int age) {
        this.age = age;
    }
  
    public void setName(String name_) {
        this.name = name;
    }  
}
```

在 Sping 中有两种依赖注入的方式，一种是通过构造函数，一种是通过`setter`方法，也就是对应了我们编程时给对象属性赋值的两种方法。

```java
Car carOne = new Car("chang", 12);

Car carTwo = new Car();
carTwo.setName("liang");
carTwo.setAge(13);
```

调用的带参数的构造方法创建对象实例后，任然可以使用`set`方法更新属性值，所以在 Spring 中`setter`方法可用于覆盖构造函数中配置的依赖，构造函数一般用于强制性依赖，`setter`方法用于可选依赖。

### 基于构造函数注入

```java
public class TeacherBean {

    private String name;
    
    private StudentBean student;

    public TeacherBean(String name, StudentBean student) {
        this.name = name;
        this.student = student;
    }

}
```

当类的属性是通过构造函数赋值的时候，在定义`bean`的时候就需要基于构造函数将属性注入，通常配置如下：

```xml
<beans>
    <bean id="teacher" class="con.liang.TeacherBean">
        <constructor-arg value="chang"/>
        <constructor-arg ref="student"/>
    </bean>

    <bean id="student" class="com.liang.StudentBean"/>
</beans>
```

其中`<constructor-arg value="chang"/>`指定一个基本类型的参数，`<constructor-arg ref="student"/>`指定一个对象。

上面的示例中两个参数比较容易区分，如果两个参数都是基本类型或属于同一个类，则需要额外属性进行辅助，看下面的例子：

```java
public class TeacherBean {

    private String name;
    private int age;

    public TeacherBean(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

* 可以通过 `type` 指定类型进行区分。

  这个时候如果还是只用不带任何属性的`canstructor-arg`标签的话，Spring 是无法分清楚`1`这个值时赋给`name`还是`age`的，因为无法区分`1`这个字面值到底是数字还是字符串。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
       <constructor-arg value="1"/>
       <constructor-arg value="2"/>
   </bean>
  ```

  使用`type`属性就可以解决这个问题，下面的配置中就明确指明了`1`要赋给一个字符串类型，但这种方法也有缺点，如果多个参数类型相同的话，就无法使用了。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
       <constructor-arg type="java.lang.String" value="1"/>
       <constructor-arg type="int" value="2"/>
   </bean>
  ```
* 可以指定索引进行区分。

  这个方法比较好理解，直接使用参数在参数列表中的序号定位即可，比如下面的配置，将`1`赋给 0 号位的参数。

  ```xml
  <bean id="teacher"  class="com.liang.bean.TeacherBean">
      <constructor-arg index="0" value="1"/>
      <constructor-arg index="1" value="2"/>
  </bean>
  ```
* 可以指定属性名进行区分。

  这个也是比较清晰，使用参数名来对应值。

  ```xml
  <bean id="teacher"  class="com.liang.bean.TeacherBean">
      <constructor-arg name="name" value="1"/>
      <constructor-arg name="age" value="2"/>
  </bean>
  ```

### 基于Setter注入

在不通过构造方法注入时，Spring 需要首先调用类中无参数的构造函数进行实例化，之后再通过`setter`方法注入属性，所以必须保证无参数的构造函数以及`setter`方法存在。

```java
public class TeacherBean {
    private String name;
    private int age;   
}
```

对于上面的这个类，如果需要实现属性注入，配置如下：

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean">
    <property name="name" value="12" />
    <property name="age" value="122" />
</bean>
```

如果注入的属性时一个对象时，可以使用`​ <property name="student" ref="student" />`这样的方式：

```xml
<beans>
    <bean id="teacher" class="con.liang.TeacherBean">
        <property name="name" value="12" />
    	<property name="student" ref="student" />
    </bean>

    <bean id="student" class="com.liang.StudentBean"/>
</beans>
```

### 注入配置细节

#### 常量注入

- 字面值: 可用字符串表示的值，可以通过  `value` 属性或标签进行注入。

  ```xml
   <bean id="teacher"  class="com.liang.bean.TeacherBean">
          <property name="name" value="12" />
          <property name="age">
                  <value>12</value>
          </property >
   </bean>
  ```
- 支持将`value`标签中的字符串转化为`java.util.Properties`类

  ```xml
  <!-- typed as a java.util.Properties -->
  <property name="properties">
      <value>
          jdbc.driver.className=com.mysql.jdbc.Driver
          jdbc.url=jdbc:mysql://localhost:3306/mydb
      </value>
  </property>
  ```
- 基本数据类型及其封装类、String 等类型都可以采取字面值注入的方式
- 若字面值中包含特殊字符，可以使用 <![CDATA[]]> 把字面值包裹起来。

#### Bean 注入

* 可以用`ref`属性或标签引入外部类

  ```xml
  <bean id="addr" class="com.chang.pojo.Address">
      <property name="address" value="重庆"/>
  </bean>

  <!-- 使用ref属性 -->
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address" ref="addr"/>
  </bean>

  <!-- 使用标签 -->
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address">
          <ref bean="addr"/>
      </property>
  </bean>
  ```

  用`ref`标签的`parent`属性可以从父容器中获的`bean`

  ```xml
  <!-- in the parent context -->
  <bean id="accountService" class="com.something.SimpleAccountService">
      <!-- insert dependencies as required as here -->
  </bean>
  ```

  ```xml
  <!-- in the child (descendant) context -->
  <bean id="accountService" <!-- bean name is the same as the parent bean -->
      class="org.springframework.aop.framework.ProxyFactoryBean">
      <property name="target">
          <ref parent="accountService"/> <!-- notice how we refer to the parent bean -->
      </property>
      <!-- insert other configuration and dependencies as required here -->
  </bean>

  ```
* 可以使用`idref`代替`ref`标签

  使用`idref`标签在容器部署的时候会验证`bean`是否存在。

  ```xml
  <bean id="theTargetBean" class="..."/>
  <bean id="theClientBean" class="...">
      <property name="targetName">
          <idref bean="theTargetBean"/>
      </property>
  </bean>
  ```
* 可以使用内部类

  ```xml
  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address">
          <bean id="addr" class="com.chang.pojo.Address">
      		<property name="address" value="重庆"/>
  	</bean>
      </property>
  </bean>
  ```

  内部类不用指明`id` 和`name`属性，但不能用于其他地方。
* Spring 支持使用级联属性赋值。

  ```xml
  <bean id="addr" class="com.chang.pojo.Address">
      <property name="address" value="重庆"/>
  </bean>

  <bean id="student" class="com.chang.pojo.Student">
      <property name="name" value="小明"/>
      <property name="address" ref="addr"/>
      <property name="adderss.address" value="重庆"/>
  </bean>
  ```

#### 数组注入

```xml
<bean id="student" class="com.kuang.pojo.Student">
    <property name="name" value="小明"/>
    <property name="address" ref="addr"/>
    <property name="books">
        <array>
            <value>西游记</value>
            <value>红楼梦</value>
            <value>水浒传</value>
        </array>
    </property>
</bean>
```

#### List 注入

```xml
<property name="someList">
    <list>
        <value>a list element followed by a reference</value>
        <ref bean="myDataSource" />
    </list>
</property>
```

#### Map 注入

```xml
<property name="someMap">
    <map>
        <entry key="an entry" value="just some string"/>
        <entry key ="a ref" value-ref="myDataSource"/>
    </map>
</property>
```

#### set 注入

```xml
<property name="someSet">
    <set>
        <value>just some string</value>
        <ref bean="myDataSource" />
    </set>
</property>
```

#### Properties 注入

```xml
<property name="info">
    <props>
        <prop key="学号">20190604</prop>
        <prop key="性别">男</prop>
        <prop key="姓名">小明</prop>
    </props>
</property>
```

#### 集合合并

`bean`标签中有一个属性为`abstract`，默认情况下该值为`false`，如果将他设置为`true`的话，那么容器将不会创建它的实例。它需要和`parent`配合使用，姑且可以将`abstrcat`属性的`bean`称为父`bean`，将带有`parent`属性的`bean`称为子`bean`，父`bean`中的`property`标签会被继承到子`bean`中，比如下面的例子中，`<property name="name" value = "chang"/>`会被自动添加到子`bean`中。

```xml
<beans>
    <bean id="parent" abstract="true" class="example.ComplexObject">
        <property name="name" value = "chang"/>
        <property name="adminEmails">
            <props>
                <prop key="administrator">[emailprotected]</prop>
                <prop key="support">[emailprotected]</prop>
            </props>
        </property>
    </bean>
    <bean id="child" parent="parent">
        <property name="adminEmails">
            <!-- the merge is specified on the child collection definition -->
            <props merge="true">
                <prop key="sales">[emailprotected]</prop>
                <prop key="support">[emailprotected]</prop>
            </props>
        </property>
    </bean>
<beans>
```

子`bean`如果和父`bean`定义了相同的属性，那么后者会把前者的值覆盖。不过如果属性是集合的话，可以开启集合的合并行为，目前合并行为适用于`<list/>`，`<map/>`、`<set/>`和`<properties>`集合类型，需要做的是将`merge`属性设置为`true`。

在合并`List`元素时父`bean`的值位于所有子级列表的值之前，对于`Map`，`Set`和`Properties`集合类型，会继承所有父级中的元素，对于`key`相同的元素会进行覆盖。

#### 空字符串和null 值注入

```xml
<!-- 等价于 wife = null -->
<property name="wife"><null/></property>
<!-- 等价于 email = "" -->
<property name="email" value=""/>
```

#### 注入拓展: P 命名空间

在`beans`中添加`xmlns:p="http://www.springframework.org/schema/p"`可以开启P命名空间，作用是可以使用类似`p:email`的属性替代`property`标签。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="classic" class="com.example.ExampleBean">
        <property name="email" value="[emailprotected]"/>
    </bean>

    <bean name="p-namespace" class="com.example.ExampleBean"
        p:email="[emailprotected]"/>
</beans>
```

#### 注入拓展: c 命名空间

在`beans`中添加`xmlns:c="http://www.springframework.org/schema/c"`可以开启C命名空间，作用是使用类似`c:thingTwo-ref`的属性替代`constructor-arg`标签。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="thingOne" class="x.y.ThingTwo"/>
    <bean id="thingTwo" class="x.y.ThingThree"/>

    <!-- traditional declaration -->
    <bean id="thingOne" class="x.y.ThingOne">
        <constructor-arg ref="thingTwo"/>
        <constructor-arg ref="thingThree"/>
        <constructor-arg value="[emailprotected]"/>
    </bean>

    <!-- c-namespace declaration -->
    <bean id="thingOne" class="x.y.ThingOne" c:thingTwo-ref="thingTwo" c:thingThree-ref="thingThree" c:email="[emailprotected]"/>

</beans>
```

#### util 里的集合标签

使用基本的集合标签定义集合时 , 不能将集合作为独立的 `bean` 定义 , 导致其他 `bean` 无法引用该集合 , 无法让集合在不同 `bean` 之间共享。在`beans`中添加`xmlns:util="http://www.springframework.org/schema/util"`可以开启集合标签，它实现了集合类型的独立定义。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <util:list id="list">
        <ref bean="car1"/>
        <ref bean="car2"/>
        <ref bean="car3"/> 
        <ref bean="car4"/>
    </util:list>

    <bean id="car1" class="com.chang.Car"></bean>
    <bean id="car2" class="com.chang.Car"></bean>
    <bean id="car3" class="com.chang.Car"></bean>
    <bean id="car4" class="com.chang.Car"></bean>
  
    <bean id="person" class="com.chang.Person">
        <property name="car" ref="list"/>
    </bean>
</beans>
```

## 自动装配

Spring 容器可以自动装配`bean`，需要使用`autowire`属性里指定自动装配的模式。这个自动装配可以简单的理解为，如果一个`bean`的某个属性类型为`A`，当容器中存在一个类型为`A`的`bean`时，Spirng 可以自动将`A`类型的`bean`赋给该属性。

```java
public class User {

    private Car car;
}

public class Car {

}
```

在下面的配置中，`id`为`car`的`bean`会自动被赋给`user`的`car`属性。

```xml
<bean id="user" class="com.liang.User" autowire="byName"></bean>
<bean id="car" class="com.liang.Car"></bean>
```

`autowire`的可选值有多个，分别代表不同的装配模式：

* `no`：默认值，表示不进行自动装配，所有的`bean` 引用必须由手动定义。对于大型部署，建议不要更改默认设置，因为明确指定协作者可以提供更好的控制和清晰度，在某种程度上，它记录了系统的结构。
* `byName`：按属性名称自动装配， Spring 会寻找与属性同名的`bean`。例如，如果一个 `bean` 包含一个 `master`属性，那么 Spring 将查找一个名为`master` 的 `bean` 来为它赋值。
* `byType`：与`byName`类似，只不过它查找`bean`的依据是属性的类型。
* `constructor`：类似于 `byType`，但它适用于构造函数的情况。

在`byType`或`constructor`自动装配模式下，可以自动按类型装配数组或集合。如果使用的是`map`并且`key`是`String`类型，则使用`bean`的`id`属性作为`key`。

```java
public class TeacherBean {

   private StudentBean[] students;

    public void setStudents(StudentBean[] students) {
        this.students = students;
    }
}

public class StudentBean {

}
```

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean" autowire="byType" />

<bean class="com.liang.bean.StudentBean"/>
<bean class="com.liang.bean.StudentBean"/>
```

`bean`中还有一个属性`autowire-candidate`，将它设置为`false`后，该`bean`不参与按类型自动装配，但是不影响按名字装配。

```xml
<bean class="com.liang.bean.StudentBean" autowire-candidate="false"/>
```

## 继承和依赖

### 继承

Spring 允许继承 `bean` 的配置，被继承的`bean`称为父`​ bean`，继承这个父`Bean`的 `Bean ​`称为子 `Bean`，前面在集合合并中简单的提过，这里详细讲解一下。子 `bean ​`从父 `bean ​`中继承配置，包括 `bean`的属性配置，子 `bean` 也可以覆盖从父`bean`继承过来的配置。父`bean` 可以作为配置模板，也可以作为 `bean`实例。若只想把父`bean`作为模板, 可以设置`bean`的 `abstract ​`属性为`​ true`，这样 Spring 将不会实例化这个 `bean`，并不是 `bean`元素里的所有属性都会被继承，比如: `autowire`, `abstract` 等。

```xml
<bean id="parent" abstract="true">
    <property name="parentName">
        <value></value>
    </property>
</bean>

<bean id="child" class="com.spring.auto.autowire.Parent" parent="parent">
    <property name="parentName">
        <value>抽象类实现</value>
    </property>
</bean>
```

### 依赖

Spring 允许用户通过`depends-on`属性设定 `bean`前置依赖的`bean`，前置依赖的`bean` 会在本 `bean` 实例化之前创建好。如果前置依赖于多个`bean`，则可以通过逗号，空格隔开的方式配置 `bean` 的名称。

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager,accountDao">
    <property name="manager" ref="manager" />
</bean>

<bean id="manager" class="ManagerBean" />
<bean id="accountDao" class="x.y.jdbc.JdbcAccountDao" />
```

## 懒加载

一般情况下，容器创建的时候`bean`就会被加载，有时候不需要`bean`加载这么早，就可以使用懒加载，这时候`bean`会在获取的时候才被创建。

```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

如果希望所有的`bean`都实现懒加载，那么可以将`beans`上的`default-lazy-init`属性设置为`true`。

```xml
<beans default-lazy-init="true">
</beans>
```

## 方法注入

属性中的`bean`只有一次注入的机会，后续使用的都是同一个`bean`，有的时候我们希望每次可以使用不同的`bean`，这个时候就可以用到方法注入。

### ApplicationContextAware 接口

实现上述需求的一种方法是实现`ApplicationContextAware`接口给`bean`注入容器，每次通过容器获取新的`bean`，不过这种方法耦合度比较大，一般不推荐使用。

```java
public class TeacherBean implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    public StudentBean student() {
        return (StudentBean) applicationContext.getBean("student");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```

### 查找方法注入

Sping可以通过重写字节码生成子类覆盖父类的方法实现注入。

```java
public class TeacherBean  {
    
    public StudentBean student() {
        return null;
    }
}
```

```xml
<bean id="teacher"  class="com.liang.bean.TeacherBean">
    <lookup-method name="student" bean="student" />
</bean>

<bean id="student" class="com.liang.bean.StudentBean" scope="prototype" />
```

注入的方法签名应该满足如下格式：

```java
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

## Bean 的作用域

在 `bean`标签里可以设置`scope`属性设置`bean`的作用域，不同的作用域有不同的效果。

```xml
<bean id="ServiceImpl" class="cn.csdn.service.ServiceImpl" scope="singleton">
```

* `singleton`：默认的作用域，可以理解为单例模式，每个从容器中获得的`bean`都是同一个。
* `protptype`：每次获取`bean`的时候，Spring都会创建一个新的出来。

除此以外还有`request`、`session`、`application`和`websocket`作用域，不过最常使用的还是`singleton`和`protptype`作用域。

## 自定义Bean的性质

### 生命周期回调

在 Spring 框架内部使用`BeanPostProcessor`来处理它可以找到的任何回调接口并调用适当的方法，例如可以实现 Spring 的`InitializingBean`和`DisposableBean`接口。

#### 初始化回调

如果我们想要在`bean`初始化的时候做一些事情，可以实现`InitializingBean`接口，Spring 会在设置完属性后调用`afterPropertiesSet`方法。

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

```java
public class AnotherExampleBean implements InitializingBean {

    public void afterPropertiesSet() {
        // do some initialization work
    }
}
```

上面这种情况耦合度比较大，Spring 提供了另一种可以实现相同功能的方式，`init-method`可以用来指定一个方法，`bean`属性设置完成后会执行该方法。

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
```

```java
public class ExampleBean {

    public void init() {
        // do some initialization work
    }
}
```

#### 销毁回调

和初始化回调一样，销毁时也可以做一些事情。

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

```java
public class AnotherExampleBean implements DisposableBean {

    public void destroy() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

Spring 也提供了类似`init-method`的`destroy-method`方法，来实现解耦的目的。

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="cleanup"/>
```

```java
public class ExampleBean {

    public void cleanup() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

#### 默认初始化和销毁回调

在`beans`标签中可以使用`default-init-method`和`default-destroy-method`属性给所有`bean`设置默认的初始化合销毁回调，可以避免对每个`bean`都设置一遍。

#### 使用注解

除了上面提到的，还可以使用`@PostConstruct` 和`@PreDestroy`注解，不过首先需要开启注解，此处只要了解即可，对注解支持的介绍会在后续文章中。

```xml
<context:annotation-config/>
```

之后需要在方法上进行标注，其中`@PostConstruct` 标注的方法会在属性设置后被执行，`@PreDestroy`标注的方法会在`bean`被销毁前执行。

```java
public class TeacherBean  {

    @PostConstruct
    public void init() {
        System.out.println("init");
    }

    @PostConstruct
    public void close() {
        System.out.println("close");
    }
}
```

一个`bean`如果使用不同的方法配置了生命周期函数，则每个函数都会被执行，如果是同名的函数，也会被执行多次。

### ApplicationContextAware 

`ApplicationContextAware`接口用于获取`ApplicationContext`，在创建`bean`过程中，如果`bean`实现了`ApplicationContextAware`接口，Spring 会调用它的`setApplicationContext`方法。

```java
public interface ApplicationContextAware {

    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

### BeanNameAware 

与`ApplicationContextAware`功能类似，如果一个实现了`BeanNameAware`接口，那么Spring 会调用它的`setBeanName`方法，并将`bean`的`id`作为参数传入。

```java
public interface BeanNameAware {

    void setBeanName(String name) throws BeansException;
}
```

## 集成接口

Spring 中可以通过插入特殊集成接口的实现来扩展 Spring IoC 容器。

### 使用 BeanPostProcessor 自定义 Bean

`BeanPostProcessor`接口定义了回调方法，通过实现可以实现这些回调方法我们可以覆盖容器的默认的实例化逻辑、依赖项解析逻辑等。如果您想在 Spring 容器完成实例化，配置和初始化 bean 之后实现一些自定义逻辑，则可以插入一个或多个`BeanPostProcessor`实现。如果配置了多个`BeanPostProcessor`实例，可以通过设置`order`属性来控制这些`BeanPostProcessor`实例的执行顺序，这需要`BeanPostProcessor`实现`Ordered`接口。

```java
public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization");
        return bean;
    }
}
```

`​ postProcessBeforeInitializationa`在`bean`属性注入之后、初始化之前执行，在该方法中可以用来修改已经注入的属性，或者返回全新的`bean`等，`postProcessAfterInitialization`在`bean`初始化后执行。

### 使用 BeanFactoryPostProcessor 自定义配置元数据

`BeanFactoryPostProcessor`接口的语义与`BeanPostProcessor`相似，但有一个主要区别：`BeanFactoryPostProcessor`对 `bean` 配置元数据进行操作。也就是说，Spring IoC 容器允许`BeanFactoryPostProcessor`读取配置元数据，在`bean`实例化之前对`bean`的定义做出修改，比如改变`bean`的类型。如果配置多个`BeanFactoryPostProcessor`，与`BeanPostProcessor`的情况类似。

`PropertyPlaceholderConfigurer`是一个`BeanFactoryPostProcessor`的实现类，它可以用来使用外部文件中的值来替代 Spring 配置文件中的值，例如下面配置数据库的例子。

```xml
<bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
    <property name="locations" value="classpath:com/something/jdbc.properties"/>
</bean>

<bean id="dataSource" destroy-method="close"
        class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="${jdbc.driverClassName}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

可以使用如下命名空间做为代替：

```xml
<context:property-placeholder location="classpath:com/something/jdbc.properties"/>
```

### 使用 FactoryBean 自定义实例化逻辑

对于一些初始化比较复杂的类，可以使用前面提到的`FactoryBean`注入到容器中，在调用`ApplicationContext`的`getBean()`方法时，如果想要获得`FactoryBean`本省，需要在`bean`的`id`前面加上一个符号`&`，如`getBean("&myBean")`。

‍
