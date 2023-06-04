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

## 全局配置