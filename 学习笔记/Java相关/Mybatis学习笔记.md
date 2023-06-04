---
type: note
created: 2023-06-04 15:36:36
updated: 2023-06-04 15:36:36
tags: []
categories: []
---

## 简单使用

### 依赖添加

```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

### 全局配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://127.0.0.1:3306"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="org/mybatis/example/BlogMapper.xml"/>
        <!-- 注册映射  -->
    </mappers>
</configuration>
```

### 添加接口和映射文件

```java
public interface VideoMapper {
    public video getVideoByCode(String code);
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">


<mapper namespace="com.chang.domain.VideoMapper">
    <select id="selectVideo" resultType="com.chang.domain.video">
        select * from videos where code = #{id}
     </select>
</mapper>
```

### 使用 Mybatis

#### 从 XML 中构建 SqlSessionFactory

Mybatis 提供了直接利用 java 代码创建 SqlSessionFactory 的方法，不过大多时候使用 XML 更加方便

```java
public class mybatisUtil {
    private static SqlSessionFactory sqlSessionFactory;
    static {
        String resource = "mybatis-conf.xml";
        InputStream inputStream = null;
        try {
            inputStream = Resources.getResourceAsStream(resource);
        } catch (IOException e) {
            e.printStackTrace();
        }
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    }
    public static SqlSession getSqlSession(){
        SqlSession sqlSession;
        sqlSession = sqlSessionFactory.openSession();
        return sqlSession;
    }
}
```

#### 获得代理对象

```java
SqlSession sqlSession = mybatisUtil.getSqlSession();
//为接口创建一个代理对象
videoMapper mapper = sqlSession.getMapper(videoMapper.class);
video v = mapper.getVideoByCode("ipx-414");
System.out.println(v) ;
```

## 全局配置文件详解

### propertise

用来引入外部 properties 配置文件, resource 用来引入类路径下的资源, url 用来引入磁盘路径下的资源

```xml
<properties resource="org/mybatis/example/config.properties">
  <property name="username" value="dev_user"/>
  <property name="password" value="F2Fa3!33TYyg"/>
</properties>
```

设置好的属性可以在配置文件中的其他地方引用

```xml
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```

这个例子中的 username 和 password 将会由 properties 元素中设置的相应值来替换。driver 和 url 属性将会由 config.properties 文件中对应的值来替换。

### settings

该项用于设置 Mybatis 的中一些全局性配置，如是否开启缓存，是否开启懒加载之类的，具体选项可以查看官方配置文档：[mybatis – MyBatis 3 | 配置](https://mybatis.org/mybatis-3/zh/configuration.html#%E8%AE%BE%E7%BD%AE%EF%BC%88settings%EF%BC%89)
