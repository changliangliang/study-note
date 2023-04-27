---
type: note
status: 未发布
created: 2023-04-28 00:05:53
updated: 2023-04-28 00:05:53
tags: []
categories: []
---

#todo

## 数据库操作

* SHOW DATABASES：用于显示当前存在的数据库。

  ![image-20210331095644135](附件/image/MySQL操作_image_1.png)

* USE [DATABASENAME]：切换数据库。

  ![image-20210331095715695](附件/image/MySQL操作_image_2.png)

* SHOW TABLES：查看当前数据库中存在的表。

  ![image-20210331095851356](附件/image/MySQL操作_image_3.png)

* SHOW COLUMNS FROM [TABLENAME]：显示某个表的表头。

  ![image-20210331095552767](附件/image/MySQL操作_image_4.png)

* 创建数据库

  ![image-20210331113500576](附件/image/MySQL操作_image_5.png)

* 删除数据库

  ![image-20210331113644549](附件/image/MySQL操作_image_6.png)

## 数据类型

### 数值类型

|     类型            |        大小                                       |      范围（有符号）|                               范围（无符号）|      用途                        |
| :--------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------ | :-------------------------- |
| TINYINT        | 1 byte                                        | (-128，127)                                                                                                                         | (0，255)                                                          | 小整数值                  |
| SMALLINT       | 2 bytes                                       | (-32 768，32 767)                                                                                                                   | (0，65 535)                                                       | 大整数值                  |
| MEDIUMINT      | 3 bytes                                       | (-8 388 608，8 388 607)                                                                                                             | (0，16 777 215)                                                   | 大整数值                  |
| INT 或 INTEGER | 4 bytes                                       | (-2 147 483 648，2 147 483 647)                                                                                                     | (0，4 294 967 295)                                                | 大整数值                  |
| BIGINT         | 8 bytes                                       | (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)                                                                             | (0，18 446 744 073 709 551 615)                                   | 极大整数值                |
| FLOAT          | 4 bytes                                       | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)                                         | 0，(1.175 494 351 E-38，3.402 823 466 E+38)                       | 单精度 浮点数值           |
| DOUBLE         | 8 bytes                                       | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值           |
| DECIMAL        | 对 DECIMAL(M,D)，如果 M>D，为 M+2 否则为 D+2 | 依赖于 M 和 D 的值                                                                                                                  | 依赖于 M 和 D 的值                                                | 小数值                    |

### 时间类型

| 类型      | 大小 ( bytes) | 范围                                                                                          | 格式                | 用途                     |
| :---------- | :-------------- | :---------------------------------------------------------------------------------------------- | :-------------------- | :------------------------- |
| DATE      | 3             | 1000-01-01/9999-12-31                                                                         | YYYY-MM-DD          | 日期值                   |
| TIME      | 3             | '-838:59:59'/'838:59:59'                                                                      | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1             | 1901/2155                                                                                     | YYYY                | 年份值                   |
| DATETIME  | 8             | 1000-01-01 00:00:00/9999-12-31 23:59:59                                                       | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4             | 1970-01-01 00:00:00/2038 结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038 年 1 月 19 日 凌晨 03:14:07 | YYYYMMDD HHMMSS     | 混合日期和时间值，时间戳 |

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

![image-20210331115635822](附件/image/MySQL操作_image_7.png)

#### 表不存在时创建

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type) 
```

#### 使用 NULL 值

默认情况下允许空值，通常可以通过下面的语句显示设置。

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NULL) 
```

#### 禁用空值

```sql
CREATE TABLE IF NOT EXISTS table_name (column_name column_type NOT NULL) 
```

#### 主键

`MySQL` 中主键的值必须唯一，所以主键不允许是空值。

```sql
CREATE TABLE IF NOT EXISTS table_name (
    									column_name column_type NOT NULL，
										PRIMARY KEY (key_1, key_2)
                                      );

```

#### 设置自增

每当新添加一行时，设置了 `AUTO_INCREMENT` 的字段会自动增加，每个表只能有一个自增字段而且必须被索引。

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

![image-20210402222155279](附件/image/MySQL操作_image_8.png)

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

![image-20210331185102399](附件/image/MySQL操作_image_9.png)

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

* 使用 `INSERT SELECT`:

  ```sql
  INSERT INTO table_name_1 ( field1, field2,...fieldN )
                         SELECT field1, field2,...fieldN 
                         FROM table_name_2;
  ```

### 更新数据

```sql
UPDATE table_naem SET column_name=value WHERE语句
```

![image-20210402210614711](附件/image/MySQL操作_image_10.png)

![image-20210402210626694](附件/image/MySQL操作_image_11.png)

### 删除数据

```sql
DELETE FROM table_name WHERE语句
```

## 检索数据

### 检索单列数据

```sql
SELECT column_name FROM table_name;
```

![image-20210331200739288](附件/image/MySQL操作_image_12.png)

### 检索多列数据

```sql
SELECT column_name_1, column_name_2 FROM table_name;
```

![image-20210331201002715](附件/image/MySQL操作_image_13.png)

### 检索所有列

```sql
SELECT * FROM table_name;
```

![image-20210331201047238](附件/image/MySQL操作_image_14.png)

### 检索不同行

有的情况下多行的数据可能是相同的，比如下面的 `age`,第一行和第三行的数据是一样的，第二行和第四行的数据是一样的。

![image-20210331201314912](附件/image/MySQL操作_image_15.png)

如果希望只显示内容不同的行，可以使用下面的 `sql` 语句：

```sql
SELECT DISTINCT column_name FROM table_name;
```

![image-20210331201615273](附件/image/MySQL操作_image_16.png)

如果检索的是多列，每列内容都相同才会视为相同的行。

![image-20210331201713504](附件/image/MySQL操作_image_17.png)

### 限制结果行数

有时候检索结果数量比较多，如果只希望显示前几行，可以使用如下语句：

```sql
SELECT * FROM table_name LIMIT num;
```

![image-20210331202107303](附件/image/MySQL操作_image_18.png)

![image-20210331202135074](附件/image/MySQL操作_image_19.png)

上面 `sql` 语句只能限制搜索结果显示行数，如果希望指定结果显示的起始位置，需要使用下面的语句，比如从第二行开始，显示 3 行数据。

```sql
SELECT * FROM table_name LIMIT num,num;
```

![image-20210331202612733](附件/image/MySQL操作_image_20.png)

### 限定表名

```sql
SELECT table_name.column_name FROM table_name;
```

## 数据排序

### 单列排序

```sql
SELECT * FROM table_name ORDER BY column_name;
```

![image-20210331203312339](附件/image/MySQL操作_image_21.png)

### 多列排序

```sql
SELECT * FROM table_name ORDER BY column_name_1, column_name_2;
```

![image-20210331203422088](附件/image/MySQL操作_image_22.png)

### 指定排序方向

通过在需要排序的列后添加 `DESC` 和 `ASC` 可以指定该列使用降序和升序排列。

![image-20210331203711277](附件/image/MySQL操作_image_23.png)

## 过滤数据

### 使用 where 子句

```sql
SELECT * FROM table_name WHERE column_name=value;
```

![image-20210331204111942](附件/image/MySQL操作_image_24.png)

### where 子句支持的操作符

![image-20210331204243345](附件/image/MySQL操作_image_25.png)

### 范围检索

```sql
SELECT * FROM table_name WHERE column_name BETWEEN value_1 AND value_2;
```

![image-20210331204458983](附件/image/MySQL操作_image_26.png)

### 空值检索

```sql
SELECT * FROM table_name WHERE column_name IS NULL;
```

### AND 操作符

需要添加多个过滤条件，可以使用 `AND` 操作符。

```sql
SELECT * FROM table_name WHERE column_name_1=value_1 AND column_name_2>value_2;
```

![image-20210331204955564](附件/image/MySQL操作_image_27.png)

### OR 操作符

与 `AND` 使用方式相同，表示满足条件之一。

![image-20210331205105176](附件/image/MySQL操作_image_28.png)

当 `ADN` 和 `OR` 同时使用的时候 `AND` 的优先级比较高，所以必要时刻添加括号改变默认预算顺序。

### IN 操作符

```sql
SELECT * FROM table_name WHERE column_name IN (value_1, value_2);
```

![image-20210331205630307](附件/image/MySQL操作_image_29.png)

### NOT 操作符

`NOT` 操作符表示否定后面的条件。

```sql
SELECT * FROM table_name WHERE NOT column_name=value;
```

![image-20210331211720944](附件/image/MySQL操作_image_30.png)

### LIKE 操作符

`LIKE` 操作符用来进行通配符过滤。

```sql
SELECT * FROM table_name WHERE column_name LIKE value;
```

#### % 通配符

表示任意字符重复任意次。

![image-20210331212054063](附件/image/MySQL操作_image_31.png)

#### _ 通配符

匹配单个字符。

![image-20210331212221091](附件/image/MySQL操作_image_32.png)

### 正则表达式

```sql
SELECT * FROM table_name WHERE column_name REGEXP value;
```

![image-20210331212616589](附件/image/MySQL操作_image_33.png)

#### OR

`|` 分割正则表达式，表示 `or` 的含义，如 `1000|2000` 表示匹配 `1000` 或 `2000`

#### []

`[]` 表示匹配字符之一：

* `[ab]c` 表示匹配 `ac` 或 `bc`。
* `[0-9]` 匹配 0~9 之一。

#### 匹配特殊字符

如果要匹配 `.` 符号，需要使用 `\\.`，匹配 `\` 则需要 `\\\`。

![image-20210331213300984](附件/image/MySQL操作_image_34.png)

#### 匹配字符类

![image-20210331213331997](附件/image/MySQL操作_image_35.png)

#### 匹配多个实例

![image-20210331213424451](附件/image/MySQL操作_image_36.png)

#### 定位符

![image-20210331213535467](附件/image/MySQL操作_image_37.png)

## 计算字段

### 拼接字段

有时候需要的数据分散在表格的多个字段里，可以使用 `CONCAT` 函数进行拼接。

```sql
SELECT CONCAT(value_1, value_2) FROM table_name;
```

![image-20210401110819203](附件/image/MySQL操作_image_38.png)

### 去除空白

`RTrim` 函数用于去除右侧空白，相应的 `LTrim` 用于去除左侧空白，`TRim` 用于去除两侧空白。

### 使用别名

```sql
SELECT column_name AS new_name FROM table_name;
```

![image-20210401111326034](附件/image/MySQL操作_image_39.png)

### 算数计算

```sql
SELECT column_name_1 * column_name_2 AS new_name FROM table_name;
```

![image-20210401111518146](附件/image/MySQL操作_image_40.png)

## 数据处理函数

### 文本处理函数

![image-20210401111848498](附件/image/MySQL操作_image_41.png)

![image-20210401111908733](附件/image/MySQL操作_image_42.png)

### 时间和日期处理函数

![image-20210401112804598](附件/image/MySQL操作_image_43.png)

### 数值处理函数

![image-20210401145037269](附件/image/MySQL操作_image_44.png)

### 聚合函数

![image-20210401145201709](附件/image/MySQL操作_image_45.png)

![image-20210401145305688](附件/image/MySQL操作_image_46.png)

![image-20210401145410179](附件/image/MySQL操作_image_47.png)

### 聚合不同值

![image-20210401145549235](附件/image/MySQL操作_image_48.png)

## 数据分组

### 创建分组

![image-20210401150024436](附件/image/MySQL操作_image_49.png)

### 过滤分组

过滤分组使用的 `HAVING` 关键字，使用方法和 `WHERE` 完全一致，唯一的区别在于前者用于过滤分组，后者用于过滤行。

![image-20210401151245336](附件/image/MySQL操作_image_50.png)

## select 子句顺序

![image-20210401151531982](附件/image/MySQL操作_image_51.png)

![image-20210401151546981](附件/image/MySQL操作_image_52.png)

## 子查询

### 利用子查询过滤

![image-20210401152724085](附件/image/MySQL操作_image_53.png)

### 作为计算字段使用子查询

![image-20210401153732276](附件/image/MySQL操作_image_54.png)

## 联结表

### 内联结

直接从多个表中查询是，`MySQL` 会简单的做多张表的笛卡尔积，我们需要使用 `WHERE` 语句过滤创需要的内容。

![image-20210401154329969](附件/image/MySQL操作_image_55.png)

### 外联结

![image-20210401160019358](附件/image/MySQL操作_image_56.png)

内联结与外联结的区别在于内联结只会保留匹配的内容，而外连接会将主要表内的所有内容保留。

## 组合查询

`UNION` 可以用来组合多条查询语句。

![image-20210401163450659](附件/image/MySQL操作_image_57.png)

## 约束

### 概念

约束是用于规定表中的数据规则，如果存在违反约束的数据行为，行为会被约束终止。Mysql 中的约束有以下几种：

* 主键约束
* 自增约束
* 外键约束
* 唯一约束
* 非空约束
* 默认约束

### 使用

#### 主键约束

主键不能重复，也不允许为空，并且一个表中只能有一个主键。通常情况下不会使用业务中的数据作为主键，即使它有些时候符合主键的条件（比如身份证号），而是会在业务数据之外新增一列数据专门作为主键。

##### 创建表时添加主键约束

```sql
-- 格式
<字段名> <数据类型> PRIMARY KEY

-- 示例
CREATE TABLE 表名 (
    id INT PRIMARY KEY,
    name VARCHAR(20)
);

```

```sql
-- 格式
[CONSTRAINT <约束名>] PRIMARY KEY [字段名]

-- 示例
CREATE TABLE 表名 (
    id INT,
    name VARCHAR(20),
    PRIMARY KEY(id, name)
);
```

##### 创建表之后添加主键约束

```sql
-- 格式
ALTER TABLE <数据表名> ADD PRIMARY KEY(<字段名>);
```

##### 删除主键

```sql
ALTER TABLE <数据表名> DROP PRIMARY KEY;
```

#### 自增约束

在 MySQL 中，当主键定义为自增长后，这个主键的值就不再需要用户输入数据了，而由数据库系统根据定义自动赋值。每增加一条记录，主键会自动以相同的步长进行增长。

* 默认情况下，AUTO_INCREMENT 的初始值是 1，每新增一条记录，字段值自动加 1；
* 一个表中只能有一个字段使用 AUTO_INCREMENT 约束，且该字段必须有索引；
* AUTO_INCREMENT 约束的字段必须具备 NOT NULL 属性；
* AUTO_INCREMENT 约束的字段只能是整数类型（TINYINT、SMALLINT、INT、BIGINT 等）；
* AUTO_INCREMENT 约束字段的最大值受该字段的数据类型约束，如果达到上限，AUTO_INCREMENT 就会失效。

##### 创建表时添加自增

```sql
-- 格式
<字段名> <数据类型> AUTO_INCREMENT

-- 示例
CREATE TABLE tb_student(
    id INT(4) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL
);
```

##### 创建表后添加自增

```sql
ALTER TABLE <表名称> modify <字段名> <数据类型> auto_increment;
```

##### 删除自增

```sql
ALTER TABLE <表名称> modify <字段名> <数据类型>;
```

##### 设置自增初始值

```sql
CREATE TABLE tablename (
    -- 字段 --
) AUTO_INCREMENT=100;
```

#### 外键约束

MySQL 外键约束（FOREIGN KEY）是表的一个特殊字段，经常与主键约束一起使用。对于两个具有关联关系的表而言，相关联字段中主键所在的表就是主表（父表），外键所在的表就是从表（子表）。

外键用来建立主表与从表的关联关系，为两个表的数据建立连接，约束两个表中数据的一致性和完整性。比如，一个小学只有 1 到 6 年纪，那学生信息中年级也只能是 1 到 6，不能是其它的值。

主表删除某条记录时，从表中与之对应的记录也必须有相应的改变。一个表可以有一个或多个外键，外键可以为空值，若不为空值，则每一个外键的值必须等于主表中主键的某个值。

定义外键时，需要遵守下列规则：

* 主表必须已经存在于数据库中，或者是当前正在创建的表。如果是后一种情况，则主表与从表是同一个表，这样的表称为自参照表，这种结构称为自参照完整性。
* 必须为主表定义主键。
* 主键不能包含空值，但允许在外键中出现空值。也就是说，只要外键的每个非空值出现在指定的主键中，这个外键的内容就是正确的。
* 在主表的表名后面指定列名或列名的组合。这个列或列的组合必须是主表的主键或候选键。
* 外键中列的数目必须和主表的主键中列的数目相同。
* 外键中列的数据类型必须和主表主键中对应列的数据类型相同。

##### 创建表时设置外键

```sql
-- 格式
[CONSTRAINT <外键名>] FOREIGN KEY 字段名 [，字段名2，…] REFERENCES <主表名> 主键列1 [，主键列2，…]
```

##### 创建表后添加外键

```sql
ALTER TABLE <数据表名> ADD CONSTRAINT <外键名>
FOREIGN KEY(<列名>) REFERENCES <主表名> (<列名>);
```

##### 删除外键

```sql
ALTER TABLE <表名> DROP FOREIGN KEY <外键约束名>;
```

#### 唯一约束

唯一约束（Unique Key）是指所有记录中字段的值不能重复出现。例如，为 id 字段加上唯一性约束后，每条记录的 id 值都是唯一的，不能出现重复的情况。如果其中一条记录的 id 值为‘0001’，那么该表中就不能出现另一条记录的 id 值也为‘0001’。

唯一约束与主键约束相似的是它们都可以确保列的唯一性。不同的是，唯一约束在一个表中可有多个，并且设置唯一约束的列允许有空值，但是只能有一个空值。而主键约束在一个表中只能有一个，且不允许有空值。比如，在用户信息表中，为了避免表中用户名重名，可以把用户名设置为唯一约束。

##### 创建表时添加唯一约束

```sql
<字段名> <数据类型> UNIQUE
```

##### 创建表后添加唯一约束

```sql
ALTER TABLE <数据表名> ADD CONSTRAINT <唯一约束名> UNIQUE(<列名>);
```

##### 删除唯一约束

```sql
ALTER TABLE <表名> DROP INDEX <唯一约束名>;
```

#### 默认值

默认值（Default）的完整称呼是“默认值约束（Default Constraint）”，用来指定某列的默认值。在表中插入一条新记录时，如果没有为某个字段赋值，系统就会自动为这个字段插入默认值。

##### 创建表时添加默认值

```sql
<字段名> <数据类型> DEFAULT <默认值>;
```

##### 创建表后添加唯一约束

```sql
ALTER TABLE <数据表名>
CHANGE COLUMN <字段名> <数据类型> DEFAULT <默认值>;
```

##### 删除唯一约束

```sql
ALTER TABLE <数据表名>
CHANGE COLUMN <字段名> <字段名> <数据类型> DEFAULT NULL;
```

#### 非空约束

非空约束（NOT NULL）指字段的值不能为空。对于使用了非空约束的字段，如果用户在添加数据时没有指定值，数据库系统就会报错。可以通过 CREATE TABLE 或 ALTER TABLE 语句实现。在表中某个列的定义后加上关键字 NOT NULL 作为限定词，来约束该列的取值不能为空。

##### 创建表时添加非空约束

```sql
<字段名> <数据类型> NOT NULL;
```

##### 创建表后添加非空约束

```sql
ALTER TABLE <数据表名>
CHANGE COLUMN <字段名>
<字段名> <数据类型> NOT NULL;
```

##### 删除唯一约束

```sql
ALTER TABLE <数据表名>
CHANGE COLUMN <字段名> <字段名> <数据类型> NULL;
```

### 检查约束

检查约束（CHECK）是用来检查数据表中字段值有效性的一种手段，可以通过 CREATE TABLE 或 ALTER TABLE 语句实现。设置检查约束时要根据实际情况进行设置，这样能够减少无效数据的输入。

##### 创建表时添加非空约束

```sql
CHECK(<检查约束>)
```

##### 创建表后添加非空约束

```sql
ALTER TABLE tb_emp7 ADD CONSTRAINT <检查约束名> CHECK(<检查约束>)
```

##### 删除唯一约束

```sql
ALTER TABLE <数据表名> DROP CONSTRAINT <检查约束名>;
```

## 事务

* 开启事务

  ```sql
  START TRANSACTION;
  ```

  ![image-20210403093342377](附件/image/MySQL操作_image_58.png)

* 回滚

  ```sql
  ROLLBACK;
  ```

* 提交

  ```sql
  COMMIT;
  ```

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

![image-20210403095926791](附件/image/MySQL操作_image_59.png)

### 支持校对的列表

```sql
SHOW COLLATION;
```

![image-20210403100103281](附件/image/MySQL操作_image_60.png)

### 查看当前字符集合校对

![image-20210403100338368](附件/image/MySQL操作_image_61.png)

![image-20210403100405151](附件/image/MySQL操作_image_62.png)

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

![image-20210404215420592](附件/image/MySQL操作_image_63.png)

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

![image-20210404220518613](附件/image/MySQL操作_image_64.png)

### 设置访问权限

```sql
GRANT SELECT ON test.* TO name;
```

![image-20210404223653959](附件/image/MySQL操作_image_65.png)

![image-20210404223725764](附件/image/MySQL操作_image_66.png)

![image-20210404223742515](附件/image/MySQL操作_image_67.png)

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
