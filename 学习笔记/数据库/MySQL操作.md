---
type: note
status: 未发布
created: 2023-04-28 00:05:53
updated: 2023-04-28 00:05:53
tags:
categories: 
---


## 数据库操作

* SHOW DATABASES：用于显示当前存在的数据库。

  ![image-20210331095644135](assets/image-20210331095644135.png)
* USE  [DATABASENAME]：切换数据库。

  ![image-20210331095715695](assets/image-20210331095715695.png)
* SHOW TABLES：查看当前数据库中存在的表。

  ![image-20210331095851356](assets/image-20210331095851356.png)
* SHOW COLUMNS FROM [TABLENAME]：显示某个表的表头。

  ![image-20210331095552767](assets/image-20210331095552767.png)
* 创建数据库

  ![image-20210331113500576](assets/image-20210331113500576.png)
* 删除数据库

  ![image-20210331113644549](assets/image-20210331113644549.png)

## 数据类型

### 数值类型

|                |                                               |                                                                                                                                     |                                                                   |                           |
| :--------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------ | :-------------------------- |
| 类型           | 大小                                          | 范围（有符号）                                                                                                                      | 范围（无符号）                                                    | 用途                      |
| TINYINT        | 1 byte                                        | (-128，127)                                                                                                                         | (0，255)                                                          | 小整数值                  |
| SMALLINT       | 2 bytes                                       | (-32 768，32 767)                                                                                                                   | (0，65 535)                                                       | 大整数值                  |
| MEDIUMINT      | 3 bytes                                       | (-8 388 608，8 388 607)                                                                                                             | (0，16 777 215)                                                   | 大整数值                  |
| INT 或 INTEGER | 4 bytes                                       | (-2 147 483 648，2 147 483 647)                                                                                                     | (0，4 294 967 295)                                                | 大整数值                  |
| BIGINT         | 8 bytes                                       | (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)                                                                             | (0，18 446 744 073 709 551 615)                                   | 极大整数值                |
| FLOAT          | 4 bytes                                       | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)                                         | 0，(1.175 494 351 E-38，3.402 823 466 E+38)                       | 单精度 浮点数值           |
| DOUBLE         | 8 bytes                                       | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值           |
| DECIMAL        | 对 DECIMAL(M,D) ，如果 M>D，为 M+2 否则为 D+2 | 依赖于 M 和 D 的值                                                                                                                  | 依赖于 M 和 D 的值                                                | 小数值                    |

### 时间类型

| 类型      | 大小 ( bytes) | 范围                                                                                          | 格式                | 用途                     |
| :---------- | :-------------- | :---------------------------------------------------------------------------------------------- | :-------------------- | :------------------------- |
| DATE      | 3             | 1000-01-01/9999-12-31                                                                         | YYYY-MM-DD          | 日期值                   |
| TIME      | 3             | '-838:59:59'/'838:59:59'                                                                      | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1             | 1901/2155                                                                                     | YYYY                | 年份值                   |
| DATETIME  | 8             | 1000-01-01 00:00:00/9999-12-31 23:59:59                                                       | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4             | 1970-01-01 00:00:00/2038结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038年1月19日 凌晨 03:14:07 | YYYYMMDD HHMMSS     | 混合日期和时间值，时间戳 |

### 字符创类型

| 类型       | 大小                  | 用途                            |
| :----------- | :---------------------- | :-------------------------------- |
| CHAR       | 0-255 bytes           | 定长字符串                      |
| VARCHAR    | 0-65535 bytes         | 变长字符串                      |
| TINYBLOB   | 0-255 bytes           | 不超过 255 个字符的二进制字符串 |
| TINYTEXT   | 0-255 bytes           | 短文本字符串                    |
| BLOB       | 0-65 535 bytes        | 二进制形式的长文本数据          |
| TEXT       | 0-65 535 bytes        | 长文本数据                      |
| MEDIUMBLOB | 0-16 777 215 bytes    | 二进制形式的中等长度文本数据    |
| MEDIUMTEXT | 0-16 777 215 bytes    | 中等长度文本数据                |
| LONGBLOB   | 0-4 294 967 295 bytes | 二进制形式的极大文本数据        |
| LONGTEXT   | 0-4 294 967 295 bytes | 极大文本数据                    |

## 表的操作

### 创建表

```sql
CREATE TABLE table_name (
	column_name column_type,
	column_name column_type,
	column_name column_type,
	column_name column_type
);
```

![image-20210331115635822](assets/image-20210331115635822.png)

#### 表不存在时创建

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type) 
```

#### 使用NULL值

默认情况下允许空值，通常可以通过下面的语句显示设置。

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NULL) 
```

#### 禁用空值

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NOT NULL) 
```

#### 主键

`MySQL`中主键的值必须唯一，所以主键不允许是空值。

```sql
CREATE TABLE IF NOT EXISTS table_name (
    									column_name column_type NOT NULL，
										PRIMARY KEY (key_1, key_2)
                                      );

```

#### 设置自增

每当新添加一行时，设置了`AUTO_INCREMENT`的字段会自动增加，每个表只能有一个自增字段而且必须被索引。

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NOT NULL AUTO_INCREMENT) 
```

#### 指定默认值

默认值只能设置为常数，不支持设置为函数。

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NOT NULL DEFAULT value)
```

#### 设置引擎

```sql
CREATE TABLE table_name (
    					  column_name column_type,
					      column_name column_type,
					      column_name column_type,
					      column_name column_type
						) ENGINE=InnoDB;
```

![image-20210402222155279](assets/image-20210402222155279.png)

### 更新表

#### 添加新的列

```sql
ALTER TABLE table_name ADD column_name column_type;
```

#### 删除列

```sql
ALTER TABLE table_name DROP column_name;
```

### 删除表

```sql
DROP TABLE table_name;
```

![image-20210331185102399](assets/image-20210331185102399.png)

### 重命名表

```sql
RENAME TABLE old_name TO new_name;
```

### 插入数据

* 向表中插入数据

  ```sql
  INSERT INTO table_name VALUES ( value1, value2,...valueN );
  ```
* 向指定列插入数据：

  ```sql
  INSERT INTO table_name ( field1, field2,...fieldN )
                         VALUES
                         ( value1, value2,...valueN );
  ```
* 插入多行数据：

  ```sql
  INSERT INTO table_name ( field1, field2,...fieldN )
                         VALUES
                         ( value1, value2,...valueN ),
                         ( value1, value2,...valueN ),
                         ( value1, value2,...valueN );
  ```
* 使用`INSERT SELECT`:

  ```sql
  INSERT INTO table_name_1 ( field1, field2,...fieldN )
                         SELECT field1, field2,...fieldN 
                         FROM table_name_2;
  ```

### 更新数据

```sql
UPDATE table_naem SET column_name=value WHERE语句
```

![image-20210402210614711](assets/image-20210402210614711.png)

![image-20210402210626694](assets/image-20210402210626694.png)

### 删除数据

```sql
DELETE FROM table_name WHERE语句
```

## 检索数据

### 检索单列数据

```sql
SELECT column_name FROM table_name;
```

![image-20210331200739288](assets/image-20210331200739288.png)

### 检索多列数据

```sql
SELECT column_name_1, column_name_2 FROM table_name;
```

![image-20210331201002715](assets/image-20210331201002715.png)

### 检索所有列

```sql
SELECT * FROM table_name;
```

![image-20210331201047238](assets/image-20210331201047238.png)

### 检索不同行

有的情况下多行的数据可能是相同的，比如下面的`age`,第一行和第三行的数据是一样的，第二行和第四行的数据是一样的。

![image-20210331201314912](assets/image-20210331201314912.png)

如果希望只显示内容不同的行，可以使用下面的`sql`语句：

```sql
SELECT DISTINCT column_name FROM table_name;
```

![image-20210331201615273](assets/image-20210331201615273.png)

如果检索的是多列，每列内容都相同才会视为相同的行。

![image-20210331201713504](assets/image-20210331201713504.png)

### 限制结果行数

有时候检索结果数量比较多，如果只希望显示前几行，可以使用如下语句：

```sql
SELECT * FROM table_name LIMIT num;
```

![image-20210331202107303](assets/image-20210331202107303.png)

![image-20210331202135074](assets/image-20210331202135074.png)

上面`sql`语句只能限制搜索结果显示行数，如果希望指定结果显示的起始位置，需要使用下面的语句，比如从第二行开始，显示3行数据。

```sql
SELECT * FROM table_name LIMIT num,num;
```

![image-20210331202612733](assets/image-20210331202612733.png)

### 限定表名

```sql
SELECT table_name.column_name FROM table_name;
```

## 数据排序

### 单列排序

```sql
SELECT * FROM table_name ORDER BY column_name;
```

![image-20210331203312339](assets/image-20210331203312339.png)

### 多列排序

```sql
SELECT * FROM table_name ORDER BY column_name_1, column_name_2;
```

![image-20210331203422088](assets/image-20210331203422088.png)

### 指定排序方向

通过在需要排序的列后添加`DESC`和`ASC`可以指定该列使用降序和升序排列。

![image-20210331203711277](assets/image-20210331203711277.png)

## 过滤数据

### 使用where子句

```sql
SELECT * FROM table_name WHERE column_name=value;
```

![image-20210331204111942](assets/image-20210331204111942.png)

### where子句支持的操作符

![image-20210331204243345](assets/image-20210331204243345.png)

### 范围检索

```sql
SELECT * FROM table_name WHERE column_name BETWEEN value_1 AND value_2;
```

![image-20210331204458983](assets/image-20210331204458983.png)

### 空值检索

```sql
SELECT * FROM table_name WHERE column_name IS NULL;
```

### AND操作符

需要添加多个过滤条件，可以使用`AND`操作符。

```sql
SELECT * FROM table_name WHERE column_name_1=value_1 AND column_name_2>value_2;
```

![image-20210331204955564](assets/image-20210331204955564.png)

### OR操作符

与`AND`使用方式相同，表示满足条件之一。

![image-20210331205105176](assets/image-20210331205105176.png)

当`ADN`和`OR`同时使用的时候`AND`的优先级比较高，所以必要时刻添加括号改变默认预算顺序。

### IN操作符

```sql
SELECT * FROM table_name WHERE column_name IN (value_1, value_2);
```

![image-20210331205630307](assets/image-20210331205630307.png)

### NOT操作符

`NOT`操作符表示否定后面的条件。

```sql
SELECT * FROM table_name WHERE NOT column_name=value;
```

![image-20210331211720944](assets/image-20210331211720944.png)

### LIKE操作符

`LIKE`操作符用来进行通配符过滤。

```sql
SELECT * FROM table_name WHERE column_name LIKE value;
```

#### %通配符

表示任意字符重复任意次。

![image-20210331212054063](assets/image-20210331212054063.png)

#### _通配符

匹配单个字符。

![image-20210331212221091](assets/image-20210331212221091.png)

### 正则表达式

```sql
SELECT * FROM table_name WHERE column_name REGEXP value;
```

![image-20210331212616589](assets/image-20210331212616589.png)

#### OR

`|`分割正则表达式，表示`or`的含义，如`1000|2000`表示匹配`1000`或`2000`

#### []

`[]`表示匹配字符之一：

* `[ab]c`表示匹配`ac`或`bc`。
* `[0-9]`匹配0~9之一。

#### 匹配特殊字符

如果要匹配`.`符号，需要使用`\\.`，匹配`\`则需要`\\\`。

![image-20210331213300984](assets/image-20210331213300984.png)

#### 匹配字符类

![image-20210331213331997](assets/image-20210331213331997.png)

#### 匹配多个实例

![image-20210331213424451](assets/image-20210331213424451.png)

#### 定位符

![image-20210331213535467](assets/image-20210331213535467.png)

## 计算字段

### 拼接字段

有时候需要的数据分散在表格的多个字段里，可以使用`CONCAT`函数进行拼接。

```sql
SELECT CONCAT(value_1, value_2) FROM table_name;
```

![image-20210401110819203](assets/image-20210401110819203.png)

### 去除空白

`RTrim`函数用于去除右侧空白，相应的`LTrim`用于去除左侧空白，`TRim`用于去除两侧空白。

### 使用别名

```sql
SELECT column_name AS new_name FROM table_name;
```

![image-20210401111326034](assets/image-20210401111326034.png)

### 算数计算

```sql
SELECT column_name_1 * column_name_2 AS new_name FROM table_name;
```

![image-20210401111518146](assets/image-20210401111518146.png)

## 数据处理函数

### 文本处理函数

![image-20210401111848498](assets/image-20210401111848498.png)

![image-20210401111908733](assets/image-20210401111908733.png)

### 时间和日期处理函数

![image-20210401112804598](assets/image-20210401112804598.png)

### 数值处理函数

![image-20210401145037269](assets/image-20210401145037269.png)

### 聚合函数

![image-20210401145201709](assets/image-20210401145201709.png)

![image-20210401145305688](assets/image-20210401145305688.png)

![image-20210401145410179](assets/image-20210401145410179.png)

### 聚合不同值

![image-20210401145549235](assets/image-20210401145549235.png)

## 数据分组

### 创建分组

![image-20210401150024436](assets/image-20210401150024436.png)

### 过滤分组

过滤分组使用的`HAVING`关键字，使用方法和`WHERE`完全一致，唯一的区别在于前者用于过滤分组，后者用于过滤行。

![image-20210401151245336](assets/image-20210401151245336.png)

## select子句顺序

![image-20210401151531982](assets/image-20210401151531982.png)

![image-20210401151546981](assets/image-20210401151546981.png)

## 子查询

### 利用子查询过滤

![image-20210401152724085](assets/image-20210401152724085.png)

### 作为计算字段使用子查询

![image-20210401153732276](assets/image-20210401153732276.png)

## 联结表

### 内联结

直接从多个表中查询是，`MySQL`会简单的做多张表的笛卡尔积，我们需要使用`WHERE`语句过滤创需要的内容。

![image-20210401154329969](assets/image-20210401154329969.png)

### 外联结

![image-20210401160019358](assets/image-20210401160019358.png)

内联结与外联结的区别在于内联结只会保留匹配的内容，而外连接会将主要表内的所有内容保留。

## 组合查询

`UNION`可以用来组合多条查询语句。

![image-20210401163450659](assets/image-20210401163450659.png)

## 约束

{{select * from blocks where id='20210918150216-bxgurdv'}}

## 事务

* 开启事务

  ```sql
  START TRANSACTION;
  ```

  ![image-20210403093342377](附件/image-20210403093342377.png)
* 回滚

  ```sql
  ROLLBACK;
  ```
* 提交

  ```sql
  COMMIT;
  ```
* 占位点

  * 设置占位点

    ```sql
    SAVEPOINT name;
    ```
  * 回滚到占位点

    ```sql
    ROLLBACK TO name;
    ```
* 更改默认提交行为

  ```sql
  SET autocommit=0;
  ```

## 全球化

### 查看支持的字符集

```sql
SHOW CHARACTER SET;
```

![image-20210403095926791](assets/image-20210403095926791.png)

### 支持校对的列表

```sql
SHOW COLLATION;
```

![image-20210403100103281](assets/image-20210403100103281.png)

### 查看当前字符集合校对

![image-20210403100338368](assets/image-20210403100338368.png)

![image-20210403100405151](assets/image-20210403100405151.png)

### 设置表的默认字符集和校对

```sql
CREATE TABLE table_name (column_name column_type,
					     column_name column_type,
					     column_name column_type,
					     column_name column_type)
					     DEFUALT CHARATER SET utf8
					     COLLATION utf8mb4_0900_ai_ci
```

### 指定列的字符集和校对

```sql
CREATE TABLE table_name (column_name column_type
                         DEFUALT CHARATER SET utf8
					     COLLATION utf8mb4_0900_ai_ci,
					     column_name column_type)  
```

### 查找时设置字符集

```sql
SELECT * FROM table_name ORDER BY column_name COLLATE utf8mb4_0900_ai_ci;
```

## 安全管理

### 查看所有用户

```sql
USER mysql;
SELECT user FROM user;
```

![image-20210404215420592](assets/image-20210404215420592.png)

### 创建新用户

```sql
CREATE USER user_name IDENTIFIED BY 'password';
```

### 重命名账户

```sql
RENAME old TO new;
```

### 删除账户

```sql
DROP USER name;
```

### 查看用户权限

```sql
SHOW GRANTS FOR name;
```

![image-20210404220518613](assets/image-20210404220518613.png)

### 设置访问权限

```sql
GRANT SELECT ON test.* TO name;
```

![image-20210404223653959](assets/image-20210404223653959.png)

![image-20210404223725764](assets/image-20210404223725764.png)

![image-20210404223742515](assets/image-20210404223742515.png)

### 撤销访问权限

```sql
REVOKE SELECT ON test.* FROM name;
```

### 修改密码

* 设置其它用户密码

  ```sql
  SET PASSWORD FOR username = Password("password");
  ```
* 设置自己密码

  ```sql
  SET PASSWORD = Password("password");
  ```
